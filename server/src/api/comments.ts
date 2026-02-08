// client/src/api/comments.ts
const API_BASE = (import.meta as any).env?.VITE_API_BASE || "http://localhost:3000";

function authHeaders(token?: string | null) {
  const h: Record<string, string> = { "Content-Type": "application/json" };
  if (token) h.Authorization = `Bearer ${token}`;
  return h;
}

export type ApiComment = {
  id: number;
  text: string;
  createdAt: string;
  userId: number;
  nickname: string;
};

export const commentsApi = {
  async list(postId: number): Promise<{ ok: true; comments: ApiComment[] }> {
    const res = await fetch(`${API_BASE}/api/posts/${postId}/comments`);
    if (!res.ok) throw new Error(`comments list failed (${res.status})`);
    return res.json();
  },

  async create(token: string, postId: number, text: string): Promise<{ ok: true; comment: ApiComment }> {
    const res = await fetch(`${API_BASE}/api/posts/${postId}/comments`, {
      method: "POST",
      headers: authHeaders(token),
      body: JSON.stringify({ text }),
    });
    if (!res.ok) throw new Error(`comments create failed (${res.status})`);
    return res.json();
  },

  async update(token: string, commentId: number, text: string): Promise<{ ok: true; comment: ApiComment }> {
    const res = await fetch(`${API_BASE}/api/comments/${commentId}`, {
      method: "PATCH",
      headers: authHeaders(token),
      body: JSON.stringify({ text }),
    });
    if (!res.ok) throw new Error(`comments update failed (${res.status})`);
    return res.json();
  },

  async remove(token: string, commentId: number): Promise<{ ok: true }> {
    const res = await fetch(`${API_BASE}/api/comments/${commentId}`, {
      method: "DELETE",
      headers: authHeaders(token),
    });
    if (!res.ok) throw new Error(`comments delete failed (${res.status})`);
    return res.json();
  },
};