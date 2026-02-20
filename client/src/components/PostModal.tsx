// client/src/components/PostModal.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import "./PostModal.css";
import { useAuthStore } from "../store/authStore";
import { bookmarkApi } from "../api/bookmarks";
import { likesApi } from "../api/likes";
import { commentsApi } from "../api/comments";
import { useLocation, useNavigate } from "react-router-dom";
import { resolvePostImagesFromPublic } from "../data/posts";

type PostLikeShape = {
  id: number;
  images?: string[];     // ✅ 있을 수도/없을 수도
  thumbnail?: string;
  caption?: string;
  createdAt?: string;
};

type Props = {
  post: PostLikeShape | null;
  isOpen: boolean;
  initialIndex?: number;
  onClose: () => void;
  onRequireLogin?: () => void;
};

function formatDate(isoOrDate: string | Date | undefined) {
  if (!isoOrDate) return "";
  const d = typeof isoOrDate === "string" ? new Date(isoOrDate) : isoOrDate;
  if (Number.isNaN(d.getTime())) return "";
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

type AuthPromptType = "like" | "save" | "comment";
type UiComment = {
  id: number;
  text: string;
  createdAt: string;
  userId: number;
  nickname: string;
};
type BookmarkChangedDetail = { postId: number; saved: boolean };

export default function PostModal({
  post,
  isOpen,
  initialIndex = 0,
  onClose,
  onRequireLogin,
}: Props) {
  const BRAND = "Magazine";

  const user = useAuthStore((s) => s.user);
  const token =
    useAuthStore((s: any) => s.accessToken ?? s.token ?? s.access_token) ?? null;

  const navigate = useNavigate();
  const location = useLocation();

  const [visible, setVisible] = useState(false);

  const [images, setImages] = useState<string[]>([]);
  const [index, setIndex] = useState(initialIndex);

  const caption = post?.caption ?? `${BRAND} Post ${post?.id ?? ""}`;
  const createdAt = post?.createdAt ?? new Date().toISOString();

  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const [saved, setSaved] = useState(false);

  const [likePop, setLikePop] = useState(false);
  const [savePop, setSavePop] = useState(false);

  const [authPrompt, setAuthPrompt] = useState<AuthPromptType | null>(null);

  const [comments, setComments] = useState<UiComment[]>([]);
  const [commentText, setCommentText] = useState("");

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState("");

  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [isComposing, setIsComposing] = useState(false);

  const submitLockRef = useRef(false);
  const editLockRef = useRef(false);
  const deleteLockRef = useRef(false);

  useEffect(() => {
    if (!isOpen) return;
    requestAnimationFrame(() => setVisible(true));
  }, [isOpen]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 220);
  };

  // ✅ 모달 열릴 때: 이미지 목록 결정
// - DB images가 "충분히 많으면" DB를 신뢰
// - DB images가 0~2장처럼 "적으면" public/posts를 스캔해서 보강
// ✅ 모달 열릴 때: 이미지 목록 결정 (DB + public 합치기)
useEffect(() => {
  if (!isOpen || !post) return;

  const postId = Number(post.id);
  let alive = true;

  (async () => {
    // 1) DB에서 온 images(있을 수도/2장일 수도)
    const fromDb = Array.isArray(post.images) ? post.images.filter(Boolean) : [];

    // 2) public/posts 스캔 (캐시됨)
    const fromPublic = await resolvePostImagesFromPublic(postId, {
      max: 30,                 // ✅ 최대 30장까지 "찾되"
      consecutiveMissLimit: 2, // ✅ 연속 2번 miss면 중단
    });

    if (!alive) return;

    // 3) 합치기(중복 제거 + n 기준 정렬)
    const { mergePostImages } = await import("../data/posts");
    const merged = mergePostImages(fromDb, fromPublic);

    setImages(merged);

    // 인덱스는 안전하게
    const nextIndex =
      merged.length === 0 ? 0 : Math.min(initialIndex, merged.length - 1);
    setIndex(nextIndex);
  })();

  return () => {
    alive = false;
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [isOpen, post?.id, initialIndex]);

  const canGo = images.length > 1;
  const isFirst = index === 0;
  const isLast = index === images.length - 1;

  const prev = () => {
    if (!canGo || isFirst) return;
    setIndex((v) => v - 1);
  };
  const next = () => {
    if (!canGo || isLast) return;
    setIndex((v) => v + 1);
  };

  // ✅ body 스크롤 잠금 + 키보드
  useEffect(() => {
    if (!isOpen) return;

    const prevOverflow = document.body.style.overflow;
    const prevPaddingRight = document.body.style.paddingRight;

    const scrollBarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = "hidden";
    if (scrollBarWidth > 0) {
      document.body.style.paddingRight = `${scrollBarWidth}px`;
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPaddingRight;
      window.removeEventListener("keydown", onKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, index, images.length, post?.id]);

  const titleText = useMemo(() => (post ? `${BRAND}` : ""), [post]);

  const goLogin = () => {
    onRequireLogin?.();
    navigate("/login", { state: { from: location.pathname } });
  };

  /** ✅ 모달 열릴 때: like/comments + saved 로딩 */
  useEffect(() => {
    if (!isOpen || !post) return;

    const postId = Number(post.id);

    setAuthPrompt(null);
    setLikePop(false);
    setSavePop(false);

    setCommentText("");
    setEditingId(null);
    setEditingText("");
    setConfirmDeleteId(null);

    submitLockRef.current = false;
    editLockRef.current = false;
    deleteLockRef.current = false;

    if (!token || !user) setSaved(false);

    (async () => {
      try {
        const like = await likesApi.get(postId, token);
        setLikeCount(like.count);
        setLiked(!!like.likedByMe);
      } catch {}

      try {
        const c = await commentsApi.list(postId);
        setComments(Array.isArray((c as any)?.comments) ? (c as any).comments : []);
      } catch {
        setComments([]);
      }

      if (token && user) {
        try {
          const b = await bookmarkApi.getSaved(token, postId);
          setSaved(!!b.savedByMe);
        } catch {
          setSaved(false);
        }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, post?.id, token, user?.id]);

  /** ✅ 좋아요 */
  const toggleLike = async () => {
    if (!post) return;
    const postId = Number(post.id);

    if (!token || !user) {
      setAuthPrompt("like");
      return;
    }

    const optimisticLiked = !liked;
    setLiked(optimisticLiked);
    setLikeCount((c) => Math.max(0, c + (optimisticLiked ? 1 : -1)));
    setLikePop(true);
    window.setTimeout(() => setLikePop(false), 260);

    try {
      await likesApi.toggle(token, postId);
      const like = await likesApi.get(postId, token);
      setLikeCount(like.count);
      setLiked(!!like.likedByMe);
    } catch {
      try {
        const like = await likesApi.get(postId, token);
        setLikeCount(like.count);
        setLiked(!!like.likedByMe);
      } catch {}
    }
  };

  /** ✅ 저장 */
  const toggleSave = async () => {
    if (!post) return;
    const postId = Number(post.id);

    if (!token || !user) {
      setAuthPrompt("save");
      return;
    }

    const optimistic = !saved;
    setSaved(optimistic);

    if (optimistic) {
      setSavePop(true);
      window.setTimeout(() => setSavePop(false), 260);
    }

    window.dispatchEvent(
      new CustomEvent<BookmarkChangedDetail>("bookmarks:changed", {
        detail: { postId, saved: optimistic },
      })
    );

    try {
      const data = await bookmarkApi.toggle(token, postId);
      const serverSaved = !!(data as any)?.saved;

      setSaved(serverSaved);

      window.dispatchEvent(
        new CustomEvent<BookmarkChangedDetail>("bookmarks:changed", {
          detail: { postId, saved: serverSaved },
        })
      );
    } catch {
      setSaved(!optimistic);

      window.dispatchEvent(
        new CustomEvent<BookmarkChangedDetail>("bookmarks:changed", {
          detail: { postId, saved: !optimistic },
        })
      );
    }
  };

  /** ✅ 댓글 작성 */
  const submitComment = async () => {
    if (!post) return;
    const postId = Number(post.id);

    if (!token || !user) {
      setAuthPrompt("comment");
      return;
    }

    const v = commentText.trim();
    if (!v) return;

    if (submitLockRef.current) return;
    submitLockRef.current = true;

    try {
      const data = await commentsApi.create(token, postId, v);
      const created = (data as any)?.comment as UiComment | undefined;

      if (created) {
        setComments((prev) => [...prev, created]);
        setCommentText("");
      } else {
        const c = await commentsApi.list(postId);
        setComments(Array.isArray((c as any)?.comments) ? (c as any).comments : []);
        setCommentText("");
      }
    } finally {
      window.setTimeout(() => {
        submitLockRef.current = false;
      }, 120);
    }
  };

  /** ✅ 댓글 수정 */
  const startEdit = (c: UiComment) => {
    setConfirmDeleteId(null);
    setEditingId(c.id);
    setEditingText(c.text);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingText("");
  };

  const submitEdit = async () => {
    if (!token || !user) {
      setAuthPrompt("comment");
      return;
    }
    if (editingId == null) return;

    const nextText = editingText.trim();
    if (!nextText) return;

    if (editLockRef.current) return;
    editLockRef.current = true;

    try {
      await commentsApi.update(token, editingId, nextText);
      setComments((prev) =>
        prev.map((c) => (c.id === editingId ? { ...c, text: nextText } : c))
      );
      cancelEdit();
    } finally {
      window.setTimeout(() => {
        editLockRef.current = false;
      }, 120);
    }
  };

  /** ✅ 삭제 확인(인라인) */
  const askDelete = (commentId: number) => {
    cancelEdit();
    setConfirmDeleteId(commentId);
  };
  const cancelDelete = () => setConfirmDeleteId(null);

  const confirmDelete = async (commentId: number) => {
    if (!token || !user) {
      setAuthPrompt("comment");
      return;
    }

    if (deleteLockRef.current) return;
    deleteLockRef.current = true;

    try {
      await commentsApi.remove(token, commentId);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
      setConfirmDeleteId(null);
    } finally {
      window.setTimeout(() => {
        deleteLockRef.current = false;
      }, 150);
    }
  };

  if (!isOpen || !post) return null;



  
  // ✅ 안전장치: 이미지가 0개면 placeholder 보여주기
  const hasImage = images.length > 0 && !!images[index];

  return (
    <div className={`pmOverlay ${visible ? "open" : ""}`} onMouseDown={handleClose}>
      <div
        className={`pmDialog ${visible ? "open" : ""}`}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* 왼쪽: 이미지 */}
        <div className="pmMedia">
          <div className="pmMediaInner">
            {hasImage ? (
              <img className="pmImg" src={images[index]} alt={`${titleText}-${index + 1}`} />
            ) : (
              <div className="pmNoImage">
                <div className="pmNoImageTitle">이미지가 없어요</div>
                <div className="pmNoImageSub">/public/posts에 파일이 있는지 확인해줘.</div>
              </div>
            )}
          </div>

          {canGo && (
            <>
              <button className="pmNav pmPrev" onClick={prev} disabled={isFirst} aria-label="previous">
                ‹
              </button>
              <button className="pmNav pmNext" onClick={next} disabled={isLast} aria-label="next">
                ›
              </button>

              <div className="pmDots">
                {images.map((_, i) => (
                  <button
                    key={i}
                    className={`pmDot ${i === index ? "isActive" : ""}`}
                    onClick={() => setIndex(i)}
                    aria-label={`go to ${i + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* 오른쪽 */}
        <div className="pmSide">
          <div className="pmHeader">
            <div className="pmProfile">
              <div className="pmAvatar">{BRAND[0]}</div>
              <div className="pmName">{BRAND}</div>
            </div>

            <button className="pmClose" onClick={handleClose} aria-label="close">
              ✕
            </button>
          </div>

          <div className="pmBody">
            <div className="pmCaption">{caption}</div>

            <div className="pmMetaRow">
              <div className="pmDate">{formatDate(createdAt)}</div>
            </div>

            <div className="pmLikeLine">
              <button className="pmLikeCountBtn" type="button">
                좋아요 {likeCount}개
              </button>

              <div className="pmActions">
                <button
                  className={`pmActionBtn pmLikeBtn ${liked ? "isLiked" : ""} ${likePop ? "isPop" : ""}`}
                  type="button"
                  onClick={toggleLike}
                >
                  <span className="pmIcon" aria-hidden>♥</span>
                  좋아요
                </button>

                <button
                  className={`pmActionBtn pmSaveBtn ${saved ? "isSaved" : ""} ${savePop ? "isPop" : ""}`}
                  type="button"
                  onClick={toggleSave}
                >
                  <span className="pmIcon" aria-hidden>★</span>
                  저장
                </button>
              </div>
            </div>

            {!user && authPrompt && (
              <div className="pmAuthBox">
                <div className="pmAuthText">
                  {authPrompt === "like"
                    ? "좋아요를 누르려면 로그인하세요."
                    : authPrompt === "save"
                    ? "저장하려면 로그인하세요."
                    : "댓글을 작성하려면 로그인하세요."}
                </div>
                <div className="pmAuthActions">
                  <button className="pmAuthBtn" type="button" onClick={goLogin}>
                    로그인하기
                  </button>
                  <button className="pmAuthGhost" type="button" onClick={() => setAuthPrompt(null)}>
                    닫기
                  </button>
                </div>
              </div>
            )}

            <div className="pmDivider" />

            {/* 댓글 UI는 네가 이미 잘 해둔 그대로 유지 */}
            <div className="pmComments">
              {comments.length === 0 ? (
                <div style={{ fontSize: 13, opacity: 0.65 }}>아직 댓글이 없어요.</div>
              ) : (
                comments.map((c) => {
                  const isMine = !!user && c.userId === user.id;
                  const isEditing = editingId === c.id;
                  const isDeleting = confirmDeleteId === c.id;

                  return (
                    <div key={c.id} className={`pmCommentRow ${isDeleting ? "isDeleting" : ""}`}>
                      <span className="pmCommentName">{c.nickname}</span>

                      {isDeleting ? (
                        <>
                          <span className="pmCommentText">{c.text}</span>
                          <div className="pmDeleteConfirm" role="alert">
                            <span className="pmDeleteText">댓글을 삭제하시겠습니까?</span>
                            <div className="pmDeleteBtns">
                              <button className="pmPostBtn pmPostBtnSm" type="button" onClick={() => confirmDelete(c.id)}>
                                예
                              </button>
                              <button className="pmPostBtn pmPostBtnSm pmGhost" type="button" onClick={cancelDelete}>
                                아니오
                              </button>
                            </div>
                          </div>
                        </>
                      ) : isEditing ? (
                        <>
                          <input
                            className="pmInput pmCommentEditInput"
                            value={editingText}
                            onChange={(e) => setEditingText(e.target.value)}
                            onCompositionStart={() => setIsComposing(true)}
                            onCompositionEnd={() => setIsComposing(false)}
                            onKeyDown={(e) => {
                              if (e.key !== "Enter") return;
                              if (isComposing) return;
                              e.preventDefault();
                              submitEdit();
                            }}
                            placeholder="수정할 내용을 입력..."
                          />

                          <div className="pmCommentActions">
                            <button className="pmPostBtn pmPostBtnSm" type="button" onClick={submitEdit}>
                              수정
                            </button>
                            <button className="pmPostBtn pmPostBtnSm pmGhost" type="button" onClick={cancelEdit}>
                              취소
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <span className="pmCommentText">{c.text}</span>

                          {isMine && (
                            <div className="pmCommentActions">
                              <button className="pmPostBtn pmPostBtnSm" type="button" onClick={() => startEdit(c)}>
                                수정
                              </button>
                              <button className="pmPostBtn pmPostBtnSm pmDanger" type="button" onClick={() => askDelete(c.id)}>
                                삭제
                              </button>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            <form
              className="pmCommentInputRow"
              onSubmit={(e) => {
                e.preventDefault();
                if (isComposing) return;
                submitComment();
              }}
            >
              <input
                className="pmInput"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder={user ? "댓글 달기..." : "로그인 후 댓글을 작성할 수 있어요"}
                disabled={!user}
                onCompositionStart={() => setIsComposing(true)}
                onCompositionEnd={() => setIsComposing(false)}
              />
              <button className="pmPostBtn" type="submit" disabled={!user || commentText.trim().length === 0}>
                게시
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}