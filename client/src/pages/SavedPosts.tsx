import { useEffect, useMemo, useState } from "react";
import "./SavedPosts.css";
import { posts } from "../data/posts";
import { useAuthStore } from "../store/authStore";
import { bookmarkApi } from "../api/bookmarks";
import PostModal from "../components/PostModal";
import { useLocation, useNavigate } from "react-router-dom";

/** ✅ PostModal이 저장하는 로컬 키와 반드시 동일해야 함 */
function savedKey(nickname: string) {
  return `saved:${nickname}`;
}
function loadLocalSavedIds(nickname: string): number[] {
  try {
    const raw = localStorage.getItem(savedKey(nickname));
    if (!raw) return [];
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return [];
    return arr.map((x: any) => Number(x)).filter((n) => Number.isFinite(n));
  } catch {
    return [];
  }
}
function saveLocalSavedIds(nickname: string, ids: number[]) {
  localStorage.setItem(savedKey(nickname), JSON.stringify(ids));
}

export default function SavedPosts() {
  const user = useAuthStore((s) => s.user);

  // ✅ 프로젝트마다 토큰 키가 달라서 안전하게 커버
  const token =
    useAuthStore((s: any) => s.accessToken ?? s.token ?? s.access_token) ?? null;

  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(false);
  const [postIds, setPostIds] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);

  // ✅ 모달 상태
  const [selected, setSelected] = useState<(typeof posts)[number] | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  /** ✅ “무조건 뜨게” 전략
   *  1) 로그인 유저면 localStorage(saved:닉네임)에서 먼저 즉시 로드
   *  2) token이 있으면 서버 목록도 가져와서 local + server union
   *  3) 서버가 실패해도 local은 유지
   */
  useEffect(() => {
    let alive = true;

    async function run() {
      if (!user?.nickname) {
        setPostIds([]);
        return;
      }

      // 1) 로컬 먼저(즉시)
      const localIds = loadLocalSavedIds(user.nickname);
      if (alive) setPostIds(localIds);

      // token 없으면 여기서 끝(그래도 로컬로는 보임)
      if (!token) return;

      // 2) 서버 목록도 합치기
      setLoading(true);
      setError(null);

      try {
        const data = await bookmarkApi.list(token);

        const idsRaw = Array.isArray((data as any)?.postIds)
          ? (data as any).postIds
          : [];

        const serverIds = idsRaw
          .map((x: any) => Number(x))
          .filter((n: number) => Number.isFinite(n));

        const union = Array.from(new Set<number>([...localIds, ...serverIds]));

        if (!alive) return;
        setPostIds(union);

        // ✅ localStorage도 union으로 맞춰서 “서버/로컬 불일치”를 줄임
        saveLocalSavedIds(user.nickname, union);
      } catch (e: any) {
        if (!alive) return;
        // 서버 실패해도 로컬은 이미 setPostIds(localIds)로 들어가 있으니 화면은 뜸
        setError(e?.message ?? null);
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    }

    run();

    // ✅ PostModal이 저장 토글 후 쏘는 이벤트
    const onChanged = () => run();
    window.addEventListener("bookmarks:changed", onChanged);

    // ✅ 로컬 저장(같은 탭/다른 탭) 변하면 반영
    const onStorage = () => run();
    window.addEventListener("storage", onStorage);

    return () => {
      alive = false;
      window.removeEventListener("bookmarks:changed", onChanged);
      window.removeEventListener("storage", onStorage);
    };
  }, [user?.nickname, token]);

  const saved = useMemo(() => {
    if (!postIds.length) return [];
    const set = new Set(postIds);
    return posts.filter((p) => set.has(Number(p.id)));
  }, [postIds]);

  const openModal = (p: (typeof posts)[number]) => {
    setSelected(p);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    // PostModal에서 애니메이션 닫기 후 onClose가 호출되므로
    // 여기서는 선택 해제는 약간 늦게 해도 되고 바로 해도 됨
    setSelected(null);
  };

  const requireLogin = () => {
    // 저장/좋아요/댓글 등에서 로그인 요구할 때 이동
    navigate("/login", { state: { from: location.pathname } });
  };

  return (
    <div className="pageWrap">
      <h2><div className="pageTitle">저장한 항목</div></h2>

      {!user ? (
        <div className="pageEmpty">로그인하면 저장한 항목을 볼 수 있어요.</div>
      ) : saved.length === 0 ? (
        <div className="pageEmpty">
          아직 저장한 게시물이 없어요.
          {loading ? " (불러오는 중...)" : ""}
          {error ? ` (서버 동기화 실패: ${error})` : ""}
        </div>
      ) : (
        <div className="savedGridWrap">
          <div className="savedGrid">
            {saved.map((p) => (
              <button
                key={p.id}
                className="savedCard"
                type="button"
                onClick={() => openModal(p)}
                aria-label={`saved-${p.id}`}
              >
                <img
                  className="savedImg"
                  src={(p as any).thumbnail ?? (p as any).images?.[0]}
                  alt={`saved-${p.id}`}
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ✅ 저장한 항목 페이지에서도 모달 열리게 */}
      <PostModal
        post={selected}
        isOpen={modalOpen}
        initialIndex={0}
        onClose={closeModal}
        onRequireLogin={requireLogin}
      />
    </div>
  );
}