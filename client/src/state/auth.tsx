import React, { createContext, useContext, useMemo, useState } from "react";

type AuthState = {
  isLoggedIn: boolean;
  myNickname: string | null;
  login: (nickname: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // ✅ 지금은 프론트 데모: 새로고침하면 초기화되는 게 정상
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [myNickname, setMyNickname] = useState<string | null>(null);

  const login = (nickname: string) => {
    setIsLoggedIn(true);
    setMyNickname(nickname.trim() || "me");
  };

  const logout = () => {
    setIsLoggedIn(false);
    setMyNickname(null);
  };

  const value = useMemo(
    () => ({ isLoggedIn, myNickname, login, logout }),
    [isLoggedIn, myNickname]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth는 AuthProvider 안에서만 사용 가능");
  return ctx;
}