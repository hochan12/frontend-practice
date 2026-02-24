import { useState } from "react";
import { useAuthStore } from "../store/authStore";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

import "./MagazinePage.css";
import "./PageLayout.css";
import "./Auth.css";

export default function Login() {
  const login = useAuthStore((s) => s.login);
  const user = useAuthStore((s) => s.user);
  const isHydrated = useAuthStore((s) => s.isHydrated);

  const nav = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isHydrated)
    return <div style={{ padding: 16 }}>Loading...</div>;

  if (user) return <Navigate to={from} replace />;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login({ email, password });
      // 로그인 성공 시 Navigate가 자동 이동
    } catch (err: any) {
      setError(err?.message ?? "로그인 실패");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="magPage authPage">
      <div className="pageLayout">
        <div className="pageCard authCard">
          <h2 className="authTitle">Login</h2>
          <div className="authRule" />
          <p className="authDesc">
            Sign in to like, save, and comment on picks.
          </p>

          <form className="authForm" onSubmit={onSubmit}>
            <div className="authField">
              <label className="authLabel">Email</label>
              <input
                className="authInput"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email"
                autoComplete="email"
              />
            </div>

            <div className="authField">
              <label className="authLabel">Password</label>
              <input
                className="authInput"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="password"
                type="password"
                autoComplete="current-password"
              />
            </div>

            <button
              className="authBtn"
              disabled={loading}
              type="submit"
            >
              {loading ? "로그인 중..." : "로그인"}
            </button>

            <div className="authSubRow">
              <button
                type="button"
                className="authLinkBtn"
                onClick={() => nav("/register")}
              >
                회원가입
              </button>
            </div>

            {error && <div className="authErr">{error}</div>}

            <div className="authOk">
              로그인 후 원래 가려던 페이지로 자동 복귀합니다.
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}