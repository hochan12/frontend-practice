import { useMemo } from "react";
import "./PageLayout.css";
import { posts } from "../data/posts";
import { useAuthStore } from "../store/authStore";

function loadSavedIds(nickname: string) {
  try {
    const raw = localStorage.getItem(`saved:${nickname}`);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

export default function SavedPosts() {
  const user = useAuthStore((s) => s.user);

  const saved = useMemo(() => {
    if (!user?.nickname) return [];
    const ids = loadSavedIds(user.nickname);
    return posts.filter((p) => ids.includes(p.id));
  }, [user?.nickname]);

  return (
    <div className="pageWrap">
      <div className="pageTitle">저장한 항목</div>

      {!user ? (
        <div className="pageEmpty">로그인하면 저장한 항목을 볼 수 있어요.</div>
      ) : saved.length === 0 ? (
        <div className="pageEmpty">아직 저장한 게시물이 없어요.</div>
      ) : (
        <div className="thumbGrid">
          {saved.map((p) => (
            <div key={p.id} className="thumbCard">
              <img className="thumbImg" src={p.thumbnail} alt={`saved-${p.id}`} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}