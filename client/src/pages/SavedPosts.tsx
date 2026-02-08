// client/src/pages/SavedPosts.tsx
import { useEffect, useState } from "react";
import "./PageLayout.css";
import "../components/PostGrid.css"; // ✅ PostGrid.css 재사용
import { useAuthStore } from "../store/authStore";
import PostModal from "../components/PostModal";

const API_BASE = (import.meta as any).env?.VITE_API_BASE || "http://localhost:3000";

function authHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

type PostLite = {
  id: number;
  caption?: string;
  thumbnail?: string;
  images?: string[];
  createdAt?: string;
  author?: { id: number; nickname: string };
};

type BookmarkChangedDetail = { postId: number; saved: boolean };

export default function SavedPosts() {
  const user = useAuthStore((s) => s.user);
  const token =
    useAuthStore((s: any) => s.accessToken ?? s.token ?? s.access_token) ?? null;

  // ✅ 첫 렌더부터 스켈레톤이 보이도록
  const [loading, setLoading] = useState(true);
  const [hasFetched, setHasFetched] = useState(false);

  const [items, setItems] = useState<PostLite[]>([]);
  const [error, setError] = useState<string | null>(null);

  // 모달
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<PostLite | null>(null);

  const skeletonCount = 9;
  const MIN_SKELETON_MS = 80; // ✅ Home/Saved 공통 체감

  async function refetch() {
    // ✅ 로그인 전이면: 로딩 끄고, 그리드엔 안내 문구만
    if (!user || !token) {
      setLoading(false);
      setHasFetched(true);
      setItems([]);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    const startedAt = performance.now();

    try {
      const res = await fetch(`${API_BASE}/api/me/bookmarks/posts`, {
        headers: authHeaders(token),
      });
      if (!res.ok) throw new Error(`bookmarks posts failed (${res.status})`);

      const data = await res.json();
      const nextItems = Array.isArray(data?.posts) ? data.posts : [];

      const elapsed = performance.now() - startedAt;
      const remain = MIN_SKELETON_MS - elapsed;
      if (remain > 0) await sleep(remain);

      setItems(nextItems);
    } catch (e: any) {
      const elapsed = performance.now() - startedAt;
      const remain = MIN_SKELETON_MS - elapsed;
      if (remain > 0) await sleep(remain);

      setError(e?.message ?? "저장 목록 불러오기 실패");
      setItems([]);
    } finally {
      setHasFetched(true);
      setLoading(false);
    }
  }

  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, token]);

  // ✅ 모달에서 저장 토글 시 즉시 반영(저장 취소하면 즉시 제거)
  useEffect(() => {
    const onChanged = (e: Event) => {
      const ce = e as CustomEvent<BookmarkChangedDetail>;
      const d = ce.detail;
      if (!d || !Number.isFinite(d.postId)) return;

      setItems((prev) => {
        if (d.saved) return prev;
        return prev.filter((p) => p.id !== d.postId);
      });
    };

    window.addEventListener("bookmarks:changed", onChanged as any);
    return () => window.removeEventListener("bookmarks:changed", onChanged as any);
  }, []);

  const openModal = (p: PostLite) => {
    setSelected(p);
    setOpen(true);
  };

  return (
    <div className="pageWrap">
      <h2>
        <div className="pageTitle">저장한 항목</div>
      </h2>

      {!user ? (
        <div className="pageEmpty">로그인하면 저장한 항목을 볼 수 있어요.</div>
      ) : (
        <>
          {/* ✅ 그리드 컨테이너는 항상 유지(레이아웃 흔들림 방지) */}
          <div className="postGrid">
            {loading ? (
              Array.from({ length: skeletonCount }).map((_, i) => (
                <div key={i} className="postCard postCard--skeleton" aria-hidden="true">
                  <div className="postSkelShine" />
                </div>
              ))
            ) : error ? (
              <div className="postGridMessage">{error}</div>
            ) : hasFetched && items.length === 0 ? (
              <div className="postGridMessage">아직 저장한 게시물이 없어요.</div>
            ) : (
              items.map((p) => (
                <button
                  key={p.id}
                  className="postCard"
                  type="button"
                  onClick={() => openModal(p)}
                  aria-label={`open saved post ${p.id}`}
                >
                  <img
                    className="postThumb"
                    src={p.thumbnail ?? p.images?.[0]}
                    alt={`saved-${p.id}`}
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
            initialIndex={0}
            onClose={() => setOpen(false)}
            onRequireLogin={() => {}}
          />
        </>
      )}
    </div>
  );
}