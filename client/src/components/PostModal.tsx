import { useEffect, useMemo, useState } from "react";
import type { Post } from "../data/posts";
import "./PostModal.css";

type Props = {
  post: Post | null;
  isOpen: boolean;
  initialIndex?: number;
  onClose: () => void;
  // (있으면 유지) 로그인 요구 등 나중에 연결할 때 씀
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

export default function PostModal({
  post,
  isOpen,
  initialIndex = 0,
  onClose,
  onRequireLogin,
}: Props) {
  const BRAND = "Magazine";

  const images = post?.images ?? [];
  const [index, setIndex] = useState(initialIndex);

  // (옵션) 아래 값들은 posts 데이터에 없을 수도 있어서 안전하게 처리
  const caption = (post as any)?.caption ?? `${BRAND} Post ${post?.id ?? ""} 캡션(나중에 관리자에서 수정)`;
  const tags: string[] = (post as any)?.tags ?? ["minimal", "menswear"];
  const createdAt = (post as any)?.createdAt ?? new Date().toISOString();

  // 좋아요/댓글(프론트 임시 상태)
  const [liked, setLiked] = useState(false);
  const baseLikeCount = (post as any)?.likeCount ?? 128;
  const likeCount = baseLikeCount + (liked ? 1 : 0);

  const commentsSeed =
    ((post as any)?.comments as Array<{ nickname: string; text: string }>) ?? [
      { nickname: "가나다", text: "안녕하세요~" },
      { nickname: "ABC", text: "Hello~" },
    ];
  const [comments, setComments] = useState(commentsSeed);
  const [commentText, setCommentText] = useState("");

  // post가 바뀌거나 열릴 때 인덱스 초기화
  useEffect(() => {
    if (!isOpen) return;
    setIndex(initialIndex);
    setLiked(false);
    setComments(commentsSeed);
    setCommentText("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, initialIndex, post?.id]);

  const canGo = images.length > 1;
  const isFirst = index === 0;
  const isLast = index === images.length - 1;

  const prev = () => {
    if (!canGo || isFirst) return;
    setIndex((v) => Math.max(0, v - 1));
  };

  const next = () => {
    if (!canGo || isLast) return;
    setIndex((v) => Math.min(images.length - 1, v + 1));
  };

  // body 스크롤 잠금 + 키보드 제어
  useEffect(() => {
    if (!isOpen) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, index, images.length, post?.id]);

  const titleText = useMemo(() => {
    if (!post) return "";
    return `${BRAND}`;
  }, [post]);

  const submitComment = () => {
    const text = commentText.trim();
    if (!text) return;
    setComments((prev) => [...prev, { nickname: "me", text }]);
    setCommentText("");
  };

  if (!isOpen || !post) return null;

  return (
    <div className="pmOverlay" onMouseDown={onClose}>
      <div className="pmDialog" onMouseDown={(e) => e.stopPropagation()}>
        {/* 왼쪽: 이미지 캐러셀 */}
        <div className="pmMedia">
          <div className="pmMediaInner">
            <img className="pmImg" src={images[index]} alt={`${titleText}-${index + 1}`} />
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

        {/* 오른쪽: 인스타 느낌 패널 */}
        <div className="pmSide">
          <div className="pmHeader">
            <div className="pmProfile">
              <div className="pmAvatar">{BRAND[0]}</div>
              <div className="pmNameCol">
                <div className="pmName">{BRAND}</div>
              </div>
            </div>

            <button className="pmClose" onClick={onClose} aria-label="close">
              ✕
            </button>
          </div>

          <div className="pmBody">
            <div className="pmCaption">{caption}</div>

            <div className="pmMetaRow">
              <div className="pmDate">{formatDate(createdAt)}</div>
              <div className="pmTags">
                {tags.map((t) => (
                  <span className="pmTag" key={t}>
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="pmLikeLine">
              <button
                className="pmLikeCountBtn"
                type="button"
                onClick={() => {
                  // 나중에 “좋아요 누른 사람 목록” 모달 연결
                  if (onRequireLogin) onRequireLogin();
                }}
                title="좋아요 누른 계정 보기(나중에 연결)"
              >
                좋아요 {likeCount}개
              </button>

              <div className="pmActions">
                <button
                  className={`pmActionBtn ${liked ? "isActive" : ""}`}
                  type="button"
                  onClick={() => setLiked((v) => !v)}
                >
                  ♡ 좋아요
                </button>
                <button className="pmActionBtn" type="button">
                  ☆ 저장
                </button>
              </div>
            </div>

            <div className="pmDivider" />

            <div className="pmComments">
              {comments.map((c, i) => (
                <div key={i} className="pmCommentRow">
                  <span className="pmCommentName">{c.nickname}</span>
                  <span>{c.text}</span>
                </div>
              ))}
            </div>

            <div className="pmCommentInputRow">
              <input
                className="pmInput"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="댓글 달기..."
              />
              <button className="pmPostBtn" type="button" onClick={submitComment}>
                게시
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}