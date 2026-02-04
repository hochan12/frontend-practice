import { useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export default function Register() {
  const register = useAuthStore((s) => s.register);
  const user = useAuthStore((s) => s.user);
  const isHydrated = useAuthStore((s) => s.isHydrated);

  const location = useLocation() as any;
  const from = location?.state?.from || "/";

  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isHydrated) return <div style={{ padding: 16 }}>Loading...</div>;
  if (user) return <Navigate to={from} replace />;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await register({ email, nickname, password });
      // 성공하면 user가 생기므로 위 Navigate가 자동 이동
    } catch (err: any) {
      setError(err?.message ?? "회원가입 실패");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 360, margin: "40px auto" }}>
      <h2>Register</h2>

      <form onSubmit={onSubmit}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email"
            autoComplete="email"
          />
          <input
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="nickname"
            autoComplete="nickname"
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="password"
            type="password"
            autoComplete="new-password"
          />

          <button disabled={loading} type="submit">
            {loading ? "가입 중..." : "회원가입"}
          </button>

          {error && <p style={{ color: "red" }}>{error}</p>}

          <p style={{ marginTop: 8, fontSize: 14 }}>
            이미 계정이 있어? <Link to="/login">Login</Link>
          </p>
        </div>
      </form>
    </div>
  );
}