import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

import "./MagazinePage.css";
import "./PageLayout.css";
import "./Auth.css";

const API_BASE = (import.meta as any).env?.VITE_API_BASE || "http://localhost:3000";

function normalizeRegisterError(status: number, data: any) {
  const rawMsg = String(data?.message ?? "").toLowerCase();

  // ✅ 서버가 409(Conflict)로 주거나, 메시지에 unique/duplicate 같은 힌트를 주는 경우 대응
  const looksLikeConflict = status === 409 || status === 400 || status === 422;

  // 이메일 중복 힌트
  const emailDup =
    rawMsg.includes("email") &&
    (rawMsg.includes("duplicate") || rawMsg.includes("unique") || rawMsg.includes("already"));

  // 닉네임 중복 힌트
  const nickDup =
    (rawMsg.includes("nickname") || rawMsg.includes("nick")) &&
    (rawMsg.includes("duplicate") || rawMsg.includes("unique") || rawMsg.includes("already"));

  if (looksLikeConflict && emailDup) return "이미 사용중인 이메일입니다.";
  if (looksLikeConflict && nickDup) return "이미 사용중인 닉네임입니다.";

  // ✅ 서버가 아예 명확한 에러코드를 내려주는 경우(있으면 이게 제일 확실)
  // 예: { code: "EMAIL_TAKEN" } / { code: "NICKNAME_TAKEN" }
  const code = String(data?.code ?? "").toUpperCase();
  if (code === "EMAIL_TAKEN" || code === "DUPLICATE_EMAIL") return "이미 사용중인 이메일입니다.";
  if (code === "NICKNAME_TAKEN" || code === "DUPLICATE_NICKNAME") return "이미 사용중인 닉네임입니다.";

  return data?.message ?? `회원가입 실패 (${status})`;
}

export default function Register() {
  const nav = useNavigate();

  // const login = useAuthStore((s) => s.login);

  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, nickname }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(normalizeRegisterError(res.status, data));
      }

      // ✅ UX: 가입 후 자동 로그인까지 원하면 아래 주석 해제
      // await login({ email, password });
      // nav("/", { replace: true });

      nav("/login", { replace: true });
    } catch (err: any) {
      setError(err?.message ?? "회원가입 실패");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="magPage authPage">
      <div className="pageLayout">
        <div className="pageCard authCard">
          <h2 className="authTitle">Register</h2>
          <div className="authRule" />
          <p className="authDesc">Create an account to like, save, and comment on picks.</p>

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
              <label className="authLabel">Nickname</label>
              <input
                className="authInput"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="nickname"
                autoComplete="nickname"
              />
              <div className="authHint">닉네임은 중복 불가야.</div>
            </div>

            <div className="authField">
              <label className="authLabel">Password</label>
              <input
                className="authInput"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="password"
                type="password"
                autoComplete="new-password"
              />
            </div>

            <button className="authBtn" disabled={loading} type="submit">
              {loading ? "가입 중..." : "회원가입"}
            </button>

            <div className="authSubRow">
              <button type="button" className="authLinkBtn" onClick={() => nav("/login")}>
                이미 계정이 있나요? (login)
              </button>
            </div>

            {error && <div className="authErr">{error}</div>}
          </form>
        </div>
      </div>
    </div>
  );
}