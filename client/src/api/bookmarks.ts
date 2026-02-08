// client/src/api/bookmarks.ts
const API_BASE =
  (import.meta as any).env?.VITE_API_BASE || "http://localhost:3000";

function authHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

export const bookmarkApi = {
  async list(token: string): Promise<{ ok: true; postIds: number[] }> {
    const res = await fetch(`${API_BASE}/api/me/bookmarks`, {
      headers: authHeaders(token),
    });
    if (!res.ok) throw new Error(`bookmarks list failed (${res.status})`);
    return res.json();
  },

  async toggle(
    token: string,
    postId: number
  ): Promise<{ ok: true; saved: boolean }> {
    const res = await fetch(`${API_BASE}/api/posts/${postId}/bookmark`, {
      method: "POST",
      headers: authHeaders(token),
    });
    if (!res.ok) throw new Error(`bookmark toggle failed (${res.status})`);
    return res.json();
  },

  // ✅ NEW: 저장 여부 단건 조회
  async getSaved(
    token: string,
    postId: number
  ): Promise<{ ok: true; savedByMe: boolean }> {
    const res = await fetch(`${API_BASE}/api/posts/${postId}/bookmark`, {
      headers: authHeaders(token),
    });
    if (!res.ok) throw new Error(`bookmark get failed (${res.status})`);
    return res.json();
  },
};