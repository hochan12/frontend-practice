import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

/**
 * GET /api/me
 * (네 프로젝트에 이미 있을 수 있어서 유지용으로 넣었음)
 */
router.get("/", requireAuth, async (req, res) => {
  const userId = req.user.id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, nickname: true, role: true, createdAt: true, updatedAt: true },
  });

  return res.json({ ok: true, user });
});

/**
 * GET /api/me/bookmarks
 * => { ok: true, postIds: number[] }
 * (지금은 Post를 DB에 안 넣었으니 postId만 내려준다)
 */
router.get("/bookmarks", requireAuth, async (req, res) => {
  const userId = req.user.id;

  const rows = await prisma.bookmark.findMany({
    where: { userId },
    select: { postId: true },
    orderBy: { createdAt: "desc" },
  });

  const postIds = rows.map((r) => r.postId);
  return res.json({ ok: true, postIds });
});

export default router;