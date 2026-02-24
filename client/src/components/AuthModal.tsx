import { useMemo, useState } from "react";
import { useAuth } from "../state/auth";
import "./AuthModal.css";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function AuthModal({ isOpen, onClose }: Props) {
  const { login } = useAuth();
  const [nickname, setNickname] = useState("");

  const canSubmit = useMemo(() => nickname.trim().length >= 1, [nickname]);

  if (!isOpen) return null;

  const submit = () => {
    if (!canSubmit) return;
    login(nickname);
    onClose();
  };

  return (
    <div className="amOverlay" onMouseDown={onClose}>
      <div className="amDialog" onMouseDown={(e) => e.stopPropagation()}>
        <div className="amHeader">
          <div className="amTitle">로그인</div>
          <button className="amClose" onClick={onClose} aria-label="close">
            ✕
          </button>
        </div>

        <div className="amBody">
          <label className="amLabel">닉네임</label>
          <input
            className="amInput"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="예: me"
            autoFocus
          />

          <div className="amActions">
            <button className="amBtn ghost" onClick={onClose}>
              취소
            </button>
            <button className="amBtn" onClick={submit} disabled={!canSubmit}>
              로그인
            </button>
          </div>

          <div className="amHint">
            * 지금은 데모라서 닉네임만 받음 (DB 연결은 7단계에서).
          </div>
        </div>
      </div>
    </div>
  );
}