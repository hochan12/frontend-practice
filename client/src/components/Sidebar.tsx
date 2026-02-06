import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import "./Sidebar.css";
import { useAuthStore } from "../store/authStore";

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);
  const location = useLocation();

  return (
    <aside className="sidebar">
      <Link to="/" className="brandLink">
        <h1 className="brand">Magazine</h1>
      </Link>

      <nav className="menu">
        <Link className="menu-item" to="/color">올해의 컬러</Link>
        <Link className="menu-item" to="/trend">올해의 트렌드</Link>
        <Link className="menu-item" to="/styling">스타일링 팁</Link>
      </nav>

      <div className="kebabWrap">
        <button
          className="kebabBtn"
          onClick={() => setOpen((v) => !v)}
          aria-label="more menu"
        >
          ⋯
        </button>

        {open && (
          <>
            <div className="kebabOverlay" onClick={() => setOpen(false)} />

            <div className="kebabMenu">
              {/* ✅ 태그 모음 삭제 */}
              <Link className="kebabItem" to="/saved" onClick={() => setOpen(false)}>
                저장한 항목
              </Link>

              <div className="kebabDivider" />

              {!user ? (
                <Link
                  className="kebabItem"
                  to="/login"
                  state={{ from: location.pathname }}
                  onClick={() => setOpen(false)}
                >
                  Login
                </Link>
              ) : (
                <button
                  className="kebabItem danger"
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
      </div>
    </aside>
  );
}