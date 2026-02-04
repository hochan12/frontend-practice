const BASE_URL = "http://localhost:3000";

type User = {
  id: number;
  email: string;
  nickname: string;
  role: "ADMIN" | "USER";
  createdAt?: string;
  updatedAt?: string;
};

type AuthResponse = {
  ok: boolean;
  user: User;
  accessToken: string;
};

type MeResponse = {
  ok: boolean;
  user: User;
};

async function request<T>(url: string, options: RequestInit): Promise<T> {
  const res = await fetch(url, options);
  const text = await res.text();

  let data: any;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { raw: text };
  }

  if (!res.ok) {
    const msg = data?.error || data?.message || `HTTP ${res.status}`;
    throw new Error(msg);
  }

  return data as T;
}

export const authApi = {
  register: (payload: { email: string; nickname: string; password: string }) =>
    request<AuthResponse>(`${BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),

  login: (payload: { email: string; password: string }) =>
    request<AuthResponse>(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),

  me: (token: string) =>
    request<MeResponse>(`${BASE_URL}/api/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
};