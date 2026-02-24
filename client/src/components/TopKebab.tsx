// client/src/components/TopKebab.tsx
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./TopKebab.css";
import { useAuthStore } from "../store/authStore";

export default function TopKebab() {
  const [open, setOpen] = useState(false);
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);
  const location = useLocation();
  const nav = useNavigate();

  // ✅ 페이지 이동하면 메뉴 닫기(overlay 잔류 방지)
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <>
      <div className="topKebabWrap">
        <button
          className="topKebabBtn"
          onClick={() => setOpen((v) => !v)}
          aria-label="open menu"
        >
          <img
            src="/brand/logo.png"
            alt="Magazine menu"
            className="topKebabLogo"
            draggable={false}
          />
        </button>
      </div>

      {open && (
        <>
          <div className="topKebabOverlay" onClick={() => setOpen(false)} />

          <div className="topKebabMenu">
            <Link className="topKebabItem" to="/saved" onClick={() => setOpen(false)}>
              저장한 항목
            </Link>

            {user && (
              <button
                className="topKebabItem"
                type="button"
                onClick={() => {
                  setOpen(false);
                  nav("/account");
                }}
              >
                Account
              </button>
            )}

            <div className="topKebabDivider" />

            {!user ? (
              <Link
                className="topKebabItem"
                to="/login"
                state={{ from: location.pathname }}
                onClick={() => setOpen(false)}
              >
                Login
              </Link>
            ) : (
              <button
                className="topKebabItem danger"
                type="button"
                onClick={() => {
                  logout();
                  setOpen(false);
                }}
              >
                Logout
              </button>
            )}
          </div>
        </>
      )}
    </>
  );
}