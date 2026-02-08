// client/src/api/likes.ts
const API_BASE = (import.meta as any).env?.VITE_API_BASE || "http://localhost:3000";

function authHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

export const likesApi = {
  async get(
    postId: number,
    token?: string | null
  ): Promise<{ ok: true; count: number; likedByMe: boolean }> {
    const res = await fetch(`${API_BASE}/api/posts/${postId}/like`, {
      headers: token ? authHeaders(token) : undefined,
    });
    if (!res.ok) throw new Error(`like get failed (${res.status})`);
    return res.json();
  },

  async toggle(token: string, postId: number): Promise<{ ok: true; liked: boolean }> {
    const res = await fetch(`${API_BASE}/api/posts/${postId}/like`, {
      method: "POST",
      headers: authHeaders(token),
    });
    if (!res.ok) throw new Error(`like toggle failed (${res.status})`);
    return res.json();
  },
};