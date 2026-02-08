// client/src/components/PostGrid.tsx
import { useEffect, useMemo, useState } from "react";
import "./PostGrid.css";
import PostModal from "./PostModal";
import { postsApi, type ApiPost } from "../api/posts";

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export default function PostGrid() {
  const [items, setItems] = useState<ApiPost[]>([]);
  const [loading, setLoading] = useState(true); // ✅ 첫 렌더부터 스켈레톤
  const [error, setError] = useState<string | null>(null);
  const [hasFetched, setHasFetched] = useState(false); // ✅ 최초 로딩 완료 여부

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<ApiPost | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const skeletonCount = 9;
  const MIN_SKELETON_MS = 150;

  useEffect(() => {
    let alive = true;

    (async () => {
      setLoading(true);
      setError(null);

      const startedAt = performance.now();

      try {
        const data = await postsApi.list();
        const arr = Array.isArray((data as any)?.posts) ? (data as any).posts : [];

        const elapsed = performance.now() - startedAt;
        const remain = MIN_SKELETON_MS - elapsed;
        if (remain > 0) await sleep(remain);

        if (!alive) return;
        setItems(arr);
      } catch (e: any) {
        const elapsed = performance.now() - startedAt;
        const remain = MIN_SKELETON_MS - elapsed;
        if (remain > 0) await sleep(remain);

        if (!alive) return;
        setError(e?.message ?? "게시물 불러오기 실패");
        setItems([]);
      } finally {
        if (!alive) return;
        setHasFetched(true);
        setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  const openModal = (p: ApiPost) => {
    setSelected(p);
    setSelectedIndex(0);
    setOpen(true);
  };

  const gridItems = useMemo(() => items, [items]);

  return (
    <>
      <div className="postGrid">
        {loading ? (
          Array.from({ length: skeletonCount }).map((_, i) => (
            <div key={i} className="postCard postCard--skeleton" aria-hidden="true">
              <div className="postSkelShine" />
            </div>
          ))
        ) : error ? (
          <div className="postGridMessage">{error}</div>
        ) : hasFetched && !gridItems.length ? (
          <div className="postGridMessage">
            <h2 style={{ margin: "0 0 8px 0" }}>게시물이 없습니다.</h2>
            (서버 /api/posts 응답 확인)
          </div>
        ) : (
          gridItems.map((p) => (
            <button
              key={p.id}
              className="postCard"
              type="button"
              onClick={() => openModal(p)}
              aria-label={`open post ${p.id}`}
            >
              <img
                className="postThumb"
                src={p.thumbnail ?? p.images?.[0]}
                alt={`post-${p.id}`}
                loading="lazy"
                decoding="async"
                draggable={false}
              />
            </button>
          ))
        )}
      </div>

      <PostModal
        post={selected as any}
        isOpen={open}
        initialIndex={selectedIndex}
        onClose={() => setOpen(false)}
        onRequireLogin={() => {}}
      />
    </>
  );
}