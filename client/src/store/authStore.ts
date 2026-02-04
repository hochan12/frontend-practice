import { create } from "zustand";
import { authApi } from "../api/auth";

type User = {
  id: number;
  email: string;
  nickname: string;
  role: "ADMIN" | "USER";
  createdAt?: string;
  updatedAt?: string;
};

type AuthState = {
  user: User | null;
  accessToken: string | null;
  isHydrated: boolean;

  setToken: (token: string | null) => void;
  logout: () => void;

  init: () => Promise<void>;
  register: (payload: { email: string; nickname: string; password: string }) => Promise<void>;
  login: (payload: { email: string; password: string }) => Promise<void>;
  fetchMe: () => Promise<void>;
};

const TOKEN_KEY = "accessToken";

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  isHydrated: false,

  setToken: (token) => {
    set({ accessToken: token });

    // localStorage 동기화
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  },

  logout: () => {
    // 토큰 제거 + 유저 초기화
    get().setToken(null);
    set({ user: null });
  },

  init: async () => {
    const token = localStorage.getItem(TOKEN_KEY);

    if (token) {
      set({ accessToken: token });

      try {
        const me = await authApi.me(token);
        set({ user: me.user });
      } catch {
        // 토큰 만료/불일치면 정리
        get().logout();
      }
    }

    set({ isHydrated: true });
  },

  register: async ({ email, nickname, password }) => {
    const res = await authApi.register({ email, nickname, password });
    get().setToken(res.accessToken);
    set({ user: res.user });
  },

  login: async ({ email, password }) => {
    const res = await authApi.login({ email, password });
    get().setToken(res.accessToken);
    set({ user: res.user });
  },

  fetchMe: async () => {
    const token = get().accessToken;
    if (!token) throw new Error("No token");

    const me = await authApi.me(token);
    set({ user: me.user });
  },
}));