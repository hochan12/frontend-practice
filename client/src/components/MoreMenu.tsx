import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import "./MoreMenu.css";

export default function MoreMenu() {
  const [open, setOpen] = useState(false);

  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const isHydrated = useAuthStore((s) => s.isHydrated);

  const navigate = useNavigate();
  const location = useLocation();

  const from = useMemo(() => location.pathname, [location.pathname]);

  const onLogout = () => {
    logout();
    setOpen(false);
    navigate("/login", { replace: true, state: { from } });
  };

  // init 전에는 깜빡임 방지 (원하면 없애도 됨)
  if (!isHydrated) return null;

  return (
    <div className="moreWrap">
      <button className="moreBtn" onClick={() => setOpen((v) => !v)} aria-label="more">
        ⋯
      </button>

      {open && (
        <>
          <div className="moreBackdrop" onClick={() => setOpen(false)} />
          <div className="morePanel">
            {/* 로그인 상태에서만 접근시키고 싶으니 여기도 보호(UX) */}
            <Link to="/tags" onClick={() => setOpen(false)} className="moreItem">
              태그 모음
            </Link>
            <Link to="/saved" onClick={() => setOpen(false)} className="moreItem">
              저장한 항목
            </Link>

            <div className="moreDivider" />

            {!user ? (
              <>
                <Link to="/login" onClick={() => setOpen(false)} className="moreItem">
                  Login
                </Link>
                <Link to="/register" onClick={() => setOpen(false)} className="moreItem">
                  Register
                </Link>
              </>
            ) : (
              <button onClick={onLogout} className="moreItem danger">
                Logout
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}