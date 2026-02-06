import { useState } from "react";
import { useAuthStore } from "../store/authStore";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

export default function Login() {
  const login = useAuthStore((s) => s.login);
  const user = useAuthStore((s) => s.user);
  const isHydrated = useAuthStore((s) => s.isHydrated);

  const nav = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from || "/";

  const [email, setEmail] = useState("test@test.com");
  const [password, setPassword] = useState("1234");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isHydrated) return <div style={{ padding: 16 }}>Loading...</div>;
  if (user) return <Navigate to={from} replace />;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login({ email, password });
      // ✅ user 생기면 위 Navigate가 from으로 자동 이동
    } catch (err: any) {
      setError(err?.message ?? "로그인 실패");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 360, margin: "40px auto" }}>
      <h2>Login</h2>

      <form onSubmit={onSubmit}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email"
            autoComplete="email"
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="password"
            type="password"
            autoComplete="current-password"
          />

          <button disabled={loading} type="submit">
            {loading ? "로그인 중..." : "로그인"}
          </button>

          {/* ✅ 회원가입 버튼 복구 */}
          <button
            type="button"
            onClick={() => nav("/register")}
            style={{
              marginTop: 6,
              width: "100%",
              height: 36,
              border: "1px solid rgba(0,0,0,0.12)",
              borderRadius: 8,
              background: "#fff",
              cursor: "pointer",
              fontWeight: 700,
            }}
          >
            회원가입
          </button>

          {error && <p style={{ color: "red" }}>{error}</p>}

          <p style={{ fontSize: 12, opacity: 0.7 }}>
            로그인 후 원래 가려던 페이지로 자동 복귀합니다.
          </p>
        </div>
      </form>
    </div>
  );
}