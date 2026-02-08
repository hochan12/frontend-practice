// client/src/pages/Tags.tsx
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./PageLayout.css";
import { useAuthStore } from "../store/authStore";
import { tagsApi, type TagItem } from "../api/tags";

export default function Tags() {
  const token =
    useAuthStore((s: any) => s.accessToken ?? s.token ?? s.access_token) ?? null;
  const location = useLocation();

  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<TagItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await tagsApi.list(token);
        setItems(Array.isArray(data.tags) ? data.tags : []);
      } catch (e: any) {
        setError(e?.message ?? "태그 불러오기 실패");
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  return (
    <div className="pageWrap">
      <div className="pageTitle">태그</div>

      {loading ? (
        <div className="pageEmpty">불러오는 중...</div>
      ) : error ? (
        <div className="pageEmpty">{error}</div>
      ) : items.length === 0 ? (
        <div className="pageEmpty">태그가 없어요.</div>
      ) : (
        <div style={{ padding: 18, display: "flex", flexWrap: "wrap", gap: 10 }}>
          {items.map((t) => (
            <Link
              key={t.tag}
              to={`/tags/${encodeURIComponent(t.tag)}`}
              state={{ from: location.pathname }}
              style={{
                border: "1px solid rgba(0,0,0,0.12)",
                borderRadius: 999,
                padding: "10px 14px",
                textDecoration: "none",
                color: "inherit",
                fontWeight: 800,
                fontSize: 13,
              }}
            >
              #{t.tag} <span style={{ opacity: 0.6, fontWeight: 700 }}>({t.count})</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}