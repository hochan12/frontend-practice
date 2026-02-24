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
            {/* ✅ 태그 모음 삭제 */}
            <Link to="/saved" onClick={() => setOpen(false)} className="moreItem">
              저장한 항목
            </Link>

            <div className="moreDivider" />

            {!user ? (
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="moreItem"
                state={{ from }}
              >
                Login
              </Link>
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