import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

type Props = {
  children: React.ReactNode;
};

export default function ProtectedRoute({ children }: Props) {
  const user = useAuthStore((s) => s.user);
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const location = useLocation();

  // init() 끝날 때까지는 판단 유예
  if (!isHydrated) return <div style={{ padding: 16 }}>Loading...</div>;

  // 로그인 안 됐으면 /login으로 보내고, 원래 가려던 위치를 state로 넘김
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <>{children}</>;
}