const BASE = "http://localhost:3000";

async function request(path: string, token: string, init?: RequestInit) {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(init?.headers || {}),
    },
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error || "Request failed");
  }
  return data;
}

export const bookmarkApi = {
  async list(token: string): Promise<{ ok: boolean; postIds: number[] }> {
    return request("/api/bookmarks", token);
  },

  async toggle(token: string, postId: number): Promise<{ ok: boolean; saved: boolean }> {
    return request(`/api/bookmarks/${postId}`, token, { method: "POST" });
  },

  async remove(token: string, postId: number): Promise<{ ok: boolean; saved: boolean }> {
    return request(`/api/bookmarks/${postId}`, token, { method: "DELETE" });
  },
};