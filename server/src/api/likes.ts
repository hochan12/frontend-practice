// client/src/api/likes.ts
const API_BASE = (import.meta as any).env?.VITE_API_BASE || "http://localhost:3000";

function authHeaders(token?: string | null) {
  const h: Record<string, string> = { "Content-Type": "application/json" };
  if (token) h.Authorization = `Bearer ${token}`;
  return h;
}

export const likesApi = {
  // 좋아요 개수 + 내가 눌렀는지
  async get(postId: number, token?: string | null): Promise<{ ok: true; count: number; likedByMe: boolean }> {
    const res = await fetch(`${API_BASE}/api/posts/${postId}/likes`, {
      headers: authHeaders(token),
    });
    if (!res.ok) throw new Error(`likes get failed (${res.status})`);
    return res.json();
  },

  // 토글
  async toggle(postId: number, token: string): Promise<{ ok: true; liked: boolean; count: number }> {
    const res = await fetch(`${API_BASE}/api/posts/${postId}/like`, {
      method: "POST",
      headers: authHeaders(token),
    });
    if (!res.ok) throw new Error(`like toggle failed (${res.status})`);
    return res.json();
  },
};