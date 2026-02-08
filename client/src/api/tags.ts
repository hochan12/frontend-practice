// client/src/api/tags.ts
const API_BASE =
  (import.meta as any).env?.VITE_API_BASE || "http://localhost:3000";

function authHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

export type TagItem = { tag: string; count: number };

export type ApiPost = {
  id: number;
  caption?: string | null;
  thumbnail?: string | null;
  images: string[];
  createdAt?: string | null;
  author?: { id: number; nickname: string } | null;
};

export const tagsApi = {
  async list(token: string): Promise<{ ok: true; tags: TagItem[] }> {
    const res = await fetch(`${API_BASE}/api/tags`, {
      headers: authHeaders(token),
    });
    if (!res.ok) throw new Error(`tags list failed (${res.status})`);
    return res.json();
  },

  async postsByTag(
    token: string,
    tag: string
  ): Promise<{ ok: true; tag: string; posts: ApiPost[] }> {
    const res = await fetch(`${API_BASE}/api/tags/${encodeURIComponent(tag)}/posts`, {
      headers: authHeaders(token),
    });
    if (!res.ok) throw new Error(`tag posts failed (${res.status})`);
    return res.json();
  },
};