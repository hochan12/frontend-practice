// client/src/App.tsx
import { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Account from "./pages/Account";
import Sidebar from "./components/Sidebar";
import TopKebab from "./components/TopKebab";

import Home from "./pages/Home";
import Color from "./pages/Color";
import Trend from "./pages/Trend";
import Styling from "./pages/Styling";
import Tags from "./pages/Tags";
import TagPosts from "./pages/TagPosts";
import SavedPosts from "./pages/SavedPosts";
import Login from "./pages/Login";
import Register from "./pages/Register";

import { useAuthStore } from "./store/authStore";
import "./App.css";

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const user = useAuthStore((s) => s.user);
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const location = useLocation();

  if (!isHydrated) return <div style={{ padding: 16 }}>Loading...</div>;
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  return children;
}

export default function App() {
  const init = useAuthStore((s) => s.init);

  useEffect(() => {
    init();
  }, [init]);

  return (
    <div className="layout">
      {/* 왼쪽 */}
      <aside className="left">
        <Sidebar />
      </aside>

      {/* 오른쪽 */}
      <main className="right">
        {/* ✅ 오른쪽 상단 kebab */}
        <TopKebab />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/color" element={<Color />} />
          <Route path="/trend" element={<Trend />} />
          <Route path="/styling" element={<Styling />} />
          <Route path="/account" element={<Account />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/tags"
            element={
              <ProtectedRoute>
                <Tags />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tags/:tag"
            element={
              <ProtectedRoute>
                <TagPosts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/saved"
            element={
              <ProtectedRoute>
                <SavedPosts />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}