// client/src/components/TopKebab.tsx
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import "./TopKebab.css";
import { useAuthStore } from "../store/authStore";

export default function TopKebab() {
  const [open, setOpen] = useState(false);
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);
  const location = useLocation();

  return (
    <>
      <div className="topKebabWrap">
        <button
          className="topKebabBtn"
          onClick={() => setOpen((v) => !v)}
          aria-label="more menu"
        >
          ⋯
        </button>
      </div>

      {open && (
        <>
          <div className="topKebabOverlay" onClick={() => setOpen(false)} />

          <div className="topKebabMenu">
            <Link className="topKebabItem" to="/saved" onClick={() => setOpen(false)}>
              저장한 항목
            </Link>

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