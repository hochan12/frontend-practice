// client/src/components/PostModal.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import type { Post } from "../data/posts";
import "./PostModal.css";
import { useAuthStore } from "../store/authStore";
import { bookmarkApi } from "../api/bookmarks";
import { useLocation, useNavigate } from "react-router-dom";

type Props = {
  post: Post | null;
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

/** =========================
 *  좋아요: (A) 유저별 liked + (B) 포스트별 총카운트
 *  ========================= */
function likeUserKey(nickname: string) {
  return `liked:${nickname}`;
}
function loadLikedIds(nickname: string): number[] {
  try {
    const raw = localStorage.getItem(likeUserKey(nickname));
    if (!raw) return [];
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return [];
    return arr.map((x: any) => Number(x)).filter((n: number) => Number.isFinite(n));
  } catch {
    return [];
  }
}
function saveLikedIds(nickname: string, ids: number[]) {
  localStorage.setItem(likeUserKey(nickname), JSON.stringify(ids));
}

function likeCountKey(postId: number) {
  return `likeCount:${postId}`;
}
function loadLikeCount(postId: number, fallback: number) {
  try {
    const raw = localStorage.getItem(likeCountKey(postId));
    if (!raw) return fallback;
    const n = Number(raw);
    return Number.isFinite(n) ? n : fallback;
  } catch {
    return fallback;
  }
}
function saveLikeCount(postId: number, count: number) {
  localStorage.setItem(likeCountKey(postId), String(count));
}

/** =========================
 *  저장: 유저별 saved (로컬은 무조건 유지)
 *  ========================= */
function savedKey(nickname: string) {
  return `saved:${nickname}`;
}
function loadSavedIds(nickname: string): number[] {
  try {
    const raw = localStorage.getItem(savedKey(nickname));
    if (!raw) return [];
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return [];
    return arr.map((x: any) => Number(x)).filter((n: number) => Number.isFinite(n));
  } catch {
    return [];
  }
}
function saveSavedIds(nickname: string, ids: number[]) {
  localStorage.setItem(savedKey(nickname), JSON.stringify(ids));
}

/** =========================
 *  댓글: 포스트별 localStorage
 *  ========================= */
type LocalComment = { nickname: string; text: string; createdAt: string };
function commentKey(postId: number) {
  return `pmComments:${postId}`;
}
function loadPostComments(postId: number): LocalComment[] {
  try {
    const raw = localStorage.getItem(commentKey(postId));
    if (!raw) return [];
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return [];
    return arr;
  } catch {
    return [];
  }
}
function savePostComments(postId: number, items: LocalComment[]) {
  localStorage.setItem(commentKey(postId), JSON.stringify(items));
}

type AuthPromptType = "like" | "save";

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

  /** 애니메이션용 */
  const [visible, setVisible] = useState(false);

  const images = post?.images ?? [];
  const [index, setIndex] = useState(initialIndex);

  const caption =
    (post as any)?.caption ??
    `${BRAND} Post ${post?.id ?? ""} 캡션(나중에 관리자에서 수정)`;
  const createdAt = (post as any)?.createdAt ?? new Date().toISOString();

  /** 상태 */
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  const [likePop, setLikePop] = useState(false);
  const [savePop, setSavePop] = useState(false);

  const [authPrompt, setAuthPrompt] = useState<AuthPromptType | null>(null);

  // ✅ 좋아요 총카운트는 “포스트별 localStorage”가 진실
  const baseLikeCount = (post as any)?.likeCount ?? 128;
  const [likeCount, setLikeCount] = useState(baseLikeCount);

  // 댓글
  const seedFallback =
    ((post as any)?.comments as Array<{ nickname: string; text: string }>) ?? [
      { nickname: "sora", text: "무드 너무 좋다" },
      { nickname: "jun", text: "첫 장이 제일 강력해요" },
    ];

  const [comments, setComments] = useState<LocalComment[]>([]);
  const [commentText, setCommentText] = useState("");

  // ✅ 한글 IME 중복 submit 방지
  const [isComposing, setIsComposing] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    requestAnimationFrame(() => setVisible(true));
  }, [isOpen]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 220);
  };

  // ✅ 북마크 list fetch 경쟁 방지
  const fetchSeqRef = useRef(0);

  // 열릴 때 초기화 + 상태 로딩
  useEffect(() => {
    if (!isOpen || !post) return;

    const postId = Number((post as any).id);

    setIndex(initialIndex);
    setAuthPrompt(null);
    setLikePop(false);
    setSavePop(false);
    setCommentText("");

    // ✅ 좋아요 총카운트 로딩(로그아웃해도 유지)
    const c = loadLikeCount(postId, baseLikeCount);
    setLikeCount(c);

    // ✅ liked(내가 눌렀는지) 로딩: 로그인 유저만 유지
    if (user?.nickname) {
      const ids = loadLikedIds(user.nickname);
      setLiked(ids.includes(postId));
    } else {
      setLiked(false);
    }

    // ✅ saved 로딩: 로컬 기준 즉시
    if (user?.nickname) {
      const ids = loadSavedIds(user.nickname);
      setSaved(ids.includes(postId));
    } else {
      setSaved(false);
    }

    // ✅ 댓글 로딩(포스트별 localStorage)
    const stored = loadPostComments(postId);
    if (stored.length > 0) {
      setComments(stored);
    } else {
      const seeded: LocalComment[] = seedFallback.map((c) => ({
        nickname: c.nickname,
        text: c.text,
        createdAt: new Date().toISOString(),
      }));
      setComments(seeded);
      savePostComments(postId, seeded);
    }

    // ✅ DB 저장 상태는 “있으면 동기화”, 하지만 로컬을 절대 덮어써서 지우지 않음
    if (!user?.nickname || !token) return;

    const seq = ++fetchSeqRef.current;
    (async () => {
      try {
        const data = await bookmarkApi.list(token);
        if (fetchSeqRef.current !== seq) return;

        const idsRaw = Array.isArray((data as any)?.postIds)
          ? (data as any).postIds
          : [];
        const serverIds = idsRaw
          .map((x: any) => Number(x))
          .filter((n: number) => Number.isFinite(n));

        const localIds = loadSavedIds(user.nickname);
        const union = new Set<number>([...serverIds, ...localIds]);

        const isSaved = union.has(postId);
        setSaved(isSaved);

        // ✅ localStorage도 union으로 정리(보존)
        saveSavedIds(user.nickname, Array.from(union));
      } catch {
        // 서버 실패해도 로컬 유지
      }
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, initialIndex, post?.id, user?.nickname, token]);

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

  /** ✅ 좋아요: 유저별 상태 + 총카운트(포스트별) 동시에 갱신 */
  const toggleLike = () => {
    if (!post) return;

    const postId = Number((post as any).id);

    if (!user?.nickname) {
      setAuthPrompt("like");
      return;
    }

    const nickname = user.nickname;
    const ids = loadLikedIds(nickname);
    const has = ids.includes(postId);

    if (!has) {
      // 좋아요 ON
      const nextIds = [...ids, postId];
      saveLikedIds(nickname, nextIds);
      setLiked(true);

      const nextCount = likeCount + 1;
      setLikeCount(nextCount);
      saveLikeCount(postId, nextCount);

      setLikePop(true);
      window.setTimeout(() => setLikePop(false), 260);
    } else {
      // 좋아요 OFF
      const nextIds = ids.filter((x) => x !== postId);
      saveLikedIds(nickname, nextIds);
      setLiked(false);

      const nextCount = Math.max(0, likeCount - 1);
      setLikeCount(nextCount);
      saveLikeCount(postId, nextCount);
    }
  };

  /** ✅ 저장: 로컬은 무조건 토글(항상 노란색) + 토큰 있으면 DB도 시도 + SavedPosts 갱신 이벤트 */
  const toggleSave = async () => {
    if (!post) return;

    const postId = Number((post as any).id);

    // ✅ 저장은 "로그인"만 필수. 토큰은 없어도 로컬 저장은 됨
    if (!user?.nickname) {
      setAuthPrompt("save");
      return;
    }

    const nickname = user.nickname;

    // 1) ✅ 로컬 즉시 토글
    const ids = loadSavedIds(nickname);
    const has = ids.includes(postId);
    const nextIds = has ? ids.filter((x) => x !== postId) : [...ids, postId];
    saveSavedIds(nickname, nextIds);

    const optimisticNext = !has;
    setSaved(optimisticNext);

    if (optimisticNext) {
      setSavePop(true);
      window.setTimeout(() => setSavePop(false), 260);
    }

    // ✅ SavedPosts 즉시 갱신
    window.dispatchEvent(new Event("bookmarks:changed"));

    // 2) ✅ 토큰 있으면 DB 동기화 시도 (실패해도 로컬 유지)
    if (!token) return;

    try {
      const data = await bookmarkApi.toggle(token, postId);
      const serverSaved = !!(data as any)?.saved;

      setSaved(serverSaved);

      const current = loadSavedIds(nickname);
      const fixed = serverSaved
        ? Array.from(new Set([...current, postId]))
        : current.filter((x) => x !== postId);

      saveSavedIds(nickname, fixed);

      // ✅ DB 반영 후 한번 더 갱신
      window.dispatchEvent(new Event("bookmarks:changed"));
    } catch {
      // 서버 실패해도 로컬 유지
    }
  };

  /** ✅ 댓글 저장 */
  const submitComment = () => {
    if (!post) return;
    if (!user?.nickname) return;

    const postId = Number((post as any).id);

    const v = commentText.trim();
    if (!v) return;

    const next: LocalComment = {
      nickname: user.nickname,
      text: v,
      createdAt: new Date().toISOString(),
    };

    const updated = [...comments, next];
    setComments(updated);
    savePostComments(postId, updated);
    setCommentText("");
  };

  if (!isOpen || !post) return null;

  return (
    <div
      className={`pmOverlay ${visible ? "open" : ""}`}
      onMouseDown={handleClose}
    >
      <div
        className={`pmDialog ${visible ? "open" : ""}`}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* 왼쪽: 이미지 */}
        <div className="pmMedia">
          <div className="pmMediaInner">
            <img
              className="pmImg"
              src={images[index]}
              alt={`${titleText}-${index + 1}`}
            />
          </div>

          {canGo && (
            <>
              <button
                className="pmNav pmPrev"
                onClick={prev}
                disabled={isFirst}
                aria-label="previous"
              >
                ‹
              </button>
              <button
                className="pmNav pmNext"
                onClick={next}
                disabled={isLast}
                aria-label="next"
              >
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

        {/* 오른쪽 패널 */}
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
              {/* ✅ 태그는 너가 삭제 원해서 여기엔 없음 */}
            </div>

            <div className="pmLikeLine">
              <button className="pmLikeCountBtn" type="button">
                좋아요 {likeCount}개
              </button>

              <div className="pmActions">
                <button
                  className={`pmActionBtn pmLikeBtn ${
                    liked ? "isLiked" : ""
                  } ${likePop ? "isPop" : ""}`}
                  type="button"
                  onClick={toggleLike}
                >
                  <span className="pmIcon" aria-hidden>
                    ♥
                  </span>
                  좋아요
                </button>

                <button
                  className={`pmActionBtn pmSaveBtn ${
                    saved ? "isSaved" : ""
                  } ${savePop ? "isPop" : ""}`}
                  type="button"
                  onClick={toggleSave}
                >
                  <span className="pmIcon" aria-hidden>
                    ★
                  </span>
                  저장
                </button>
              </div>
            </div>

            {/* 비로그인 안내(좋아요/저장 눌렀을 때만) */}
            {!user && authPrompt && (
              <div className="pmAuthBox">
                <div className="pmAuthText">
                  {authPrompt === "like"
                    ? "좋아요를 누르려면 로그인하세요."
                    : "저장하려면 로그인하세요."}
                </div>
                <div className="pmAuthActions">
                  <button className="pmAuthBtn" type="button" onClick={goLogin}>
                    로그인하기
                  </button>
                  <button
                    className="pmAuthGhost"
                    type="button"
                    onClick={() => setAuthPrompt(null)}
                  >
                    닫기
                  </button>
                </div>
              </div>
            )}

            <div className="pmDivider" />

            <div className="pmComments">
              {comments.length === 0 ? (
                <div style={{ fontSize: 13, opacity: 0.65 }}>
                  아직 댓글이 없어요.
                </div>
              ) : (
                comments.map((c, i) => (
                  <div key={`${c.createdAt}-${i}`} className="pmCommentRow">
                    <span className="pmCommentName">{c.nickname}</span>
                    <span>{c.text}</span>
                  </div>
                ))
              )}
            </div>

            <div className="pmCommentInputRow">
              <input
                className="pmInput"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder={
                  user ? "댓글 달기..." : "로그인 후 댓글을 작성할 수 있어요"
                }
                disabled={!user}
                onCompositionStart={() => setIsComposing(true)}
                onCompositionEnd={() => setIsComposing(false)}
                onKeyDown={(e) => {
                  if (e.key !== "Enter") return;
                  if (isComposing) return; // ✅ 한글 조합 중 Enter 무시
                  e.preventDefault();
                  submitComment();
                }}
              />
              <button
                className="pmPostBtn"
                type="button"
                onClick={submitComment}
                disabled={!user || commentText.trim().length === 0}
              >
                게시
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}