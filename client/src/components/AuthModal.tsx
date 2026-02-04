// client/src/components/AuthModal.tsx
import { useState } from "react";
import { useAuth } from "../state/auth";
import "./AuthModal.css";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function AuthModal({ isOpen, onClose }: Props) {
  const { login, signup } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">("login");

  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [nick, setNick] = useState("");
  const [msg, setMsg] = useState<string>("");

  if (!isOpen) return null;

  const onSubmit = () => {
    setMsg("");
    if (mode === "login") {
      const r = login(id, pw);
      if (!r.ok) return setMsg(r.message ?? "로그인 실패");
      onClose();
      return;
    }
    const r = signup(id, pw, nick);
    if (!r.ok) return setMsg(r.message ?? "회원가입 실패");
    onClose();
  };

  return (
    <div className="amOverlay" onMouseDown={onClose}>
      <div className="amDialog" onMouseDown={(e) => e.stopPropagation()}>
        <div className="amHeader">
          <div className="amTitle">{mode === "login" ? "로그인" : "회원가입"}</div>
          <button className="amClose" onClick={onClose} aria-label="close">
            ✕
          </button>
        </div>

        <div className="amBody">
          <label className="amLabel">
            아이디
            <input className="amInput" value={id} onChange={(e) => setId(e.target.value)} />
          </label>

          <label className="amLabel">
            비밀번호
            <input
              className="amInput"
              type="password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
            />
          </label>

          {mode === "signup" && (
            <label className="amLabel">
              닉네임(표시용)
              <input className="amInput" value={nick} onChange={(e) => setNick(e.target.value)} />
            </label>
          )}

          {msg && <div className="amMsg">{msg}</div>}

          <button className="amSubmit" type="button" onClick={onSubmit}>
            {mode === "login" ? "로그인" : "회원가입"}
          </button>

          <button
            className="amSwitch"
            type="button"
            onClick={() => {
              setMsg("");
              setMode((m) => (m === "login" ? "signup" : "login"));
            }}
          >
            {mode === "login" ? "회원가입으로 전환" : "로그인으로 전환"}
          </button>

          <div className="amHint">
            (데모) 관리자 계정: <b>admin</b> / <b>admin1234</b>
          </div>
        </div>
      </div>
    </div>
  );
}