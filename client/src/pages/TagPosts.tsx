// client/src/pages/TagPosts.tsx
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import "./PageLayout.css";
import "../components/PostGrid.css";
import { useAuthStore } from "../store/authStore";
import { tagsApi, type ApiPost } from "../api/tags";
import PostModal from "../components/PostModal";

export default function TagPosts() {
  const { tag: rawTag } = useParams();
  const tag = decodeURIComponent(String(rawTag ?? ""));

  const token =
    useAuthStore((s: any) => s.accessToken ?? s.token ?? s.access_token) ?? null;

  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<ApiPost[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<ApiPost | null>(null);

  useEffect(() => {
    if (!token || !tag) return;

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await tagsApi.postsByTag(token, tag);
        setItems(Array.isArray(data.posts) ? data.posts : []);
      } catch (e: any) {
        setError(e?.message ?? "게시물 불러오기 실패");
      } finally {
        setLoading(false);
      }
    })();
  }, [token, tag]);

  const gridItems = useMemo(() => items, [items]);

  const openModal = (p: ApiPost) => {
    setSelected(p);
    setOpen(true);
  };

  return (
    <div className="pageWrap">
      <div className="pageTitle">#{tag}</div>

      {loading ? (
        <div className="pageEmpty">불러오는 중...</div>
      ) : error ? (
        <div className="pageEmpty">{error}</div>
      ) : gridItems.length === 0 ? (
        <div className="pageEmpty">이 태그의 게시물이 없어요.</div>
      ) : (
        <div className="postGrid">
          {gridItems.map((p) => (
            <button
              key={p.id}
              className="postCard"
              type="button"
              onClick={() => openModal(p)}
              aria-label={`open post ${p.id}`}
            >
              <img className="postThumb" src={p.thumbnail ?? p.images?.[0]} alt={`post-${p.id}`} />
            </button>
          ))}
        </div>
      )}

      <PostModal
        post={selected as any}
        isOpen={open}
        initialIndex={0}
        onClose={() => setOpen(false)}
        onRequireLogin={() => {}}
      />
    </div>
  );
}