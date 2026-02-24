// client/src/pages/Account.tsx
import { useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

import "./MagazinePage.css";
import "./PageLayout.css";
import "./Auth.css";

const API_BASE = (import.meta as any).env?.VITE_API_BASE || "http://localhost:3000";

function authHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

export default function Account() {
  const nav = useNavigate();

  const user = useAuthStore((s) => s.user);
  const token =
    useAuthStore((s: any) => s.accessToken ?? s.token ?? s.access_token) ?? null;

  const logout = useAuthStore((s: any) => s.logout);

  const mustType = useMemo(() => "DELETE", []);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  if (!user || !token) return <Navigate to="/login" replace />;

  const onDeleteAccount = async () => {
    setError(null);
    setOk(null);
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/me`, {
        method: "DELETE",
        headers: authHeaders(token),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message ?? `회원 탈퇴 실패 (${res.status})`);

      setOk("계정이 삭제되었습니다. 홈으로 이동할게요.");

      // ✅ 상태 정리
      logout?.();

      // ✅ 성공 메시지 잠깐 보여주고 이동
      setTimeout(() => {
        nav("/", { replace: true });
      }, 600);
    } catch (e: any) {
      setError(e?.message ?? "회원 탈퇴 실패");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="magPage authPage">
      <div className="pageLayout">
        <div className="pageCard authCard">
          <h2 className="authTitle">Account</h2>
          <div className="authRule" />
          <p className="authDesc">
            Signed in as <b>{user?.nickname ?? "User"}</b>
          </p>

          <div className="authSection">
            <div className="authSectionTitle">Danger Zone</div>
            <div className="authHint">
              회원 탈퇴 시 계정과 관련 데이터(저장/댓글 등)가 삭제될 수 있어. (서버 정책에 따라 다름)
            </div>

            {!confirmOpen ? (
              <button
                type="button"
                className="authBtn authBtnDanger"
                onClick={() => {
                  setConfirmOpen(true);
                  setConfirmText("");
                  setError(null);
                  setOk(null);
                }}
              >
                회원 탈퇴
              </button>
            ) : (
              <div className="authConfirmBox">
                <div className="authConfirmTitle">정말 탈퇴할까요?</div>
                <div className="authHint">
                  진행하려면 아래에 <b>{mustType}</b> 를 입력해줘.
                </div>

                <input
                  className="authInput"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder={mustType}
                  disabled={loading}
                />

                <div className="authConfirmRow">
                  <button
                    type="button"
                    className="authBtn authBtnGhost"
                    onClick={() => {
                      setConfirmOpen(false);
                      setError(null);
                      setOk(null);
                    }}
                    disabled={loading}
                  >
                    취소
                  </button>

                  <button
                    type="button"
                    className="authBtn authBtnDanger"
                    onClick={onDeleteAccount}
                    disabled={loading || confirmText !== mustType}
                  >
                    {loading ? "처리 중..." : "탈퇴 확정"}
                  </button>
                </div>
              </div>
            )}

            {error && <div className="authErr">{error}</div>}
            {ok && <div className="authOk">{ok}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}