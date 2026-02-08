// client/src/api/posts.ts
const API_BASE = (import.meta as any).env?.VITE_API_BASE || "http://localhost:3000";

export type ApiPost = {
  id: number;
  caption?: string;
  thumbnail?: string;
  images?: string[];
  createdAt?: string;
  author?: { id: number; nickname: string };
};

export type PostsPage = {
  ok: boolean;
  posts: ApiPost[];
  nextCursor: number | null;
  hasMore: boolean;
};

export const postsApi = {
  async list(params?: { limit?: number; cursor?: number | null }): Promise<PostsPage> {
    const qs = new URLSearchParams();

    if (typeof params?.limit === "number") qs.set("limit", String(params.limit));
    if (typeof params?.cursor === "number") qs.set("cursor", String(params.cursor)); // ✅ 0도 포함

    const q = qs.toString();
    const url = `${API_BASE}/api/posts${q ? `?${q}` : ""}`;

    const res = await fetch(url);
    if (!res.ok) throw new Error(`posts list failed (${res.status})`);
    return res.json();
  },
};