import express from "express";
import { prisma } from "../lib/prisma.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

/**
 * GET /api/bookmarks
 * -> { postIds: number[] }
 */
router.get("/", requireAuth, async (req, res) => {
  const userId = req.user.id;

  const rows = await prisma.bookmark.findMany({
    where: { userId },
    select: { postId: true },
    orderBy: { createdAt: "desc" },
  });

  res.json({ ok: true, postIds: rows.map((r) => r.postId) });
});

/**
 * POST /api/bookmarks/:postId
 * -> toggle (없으면 생성 / 있으면 삭제)
 */
router.post("/:postId", requireAuth, async (req, res) => {
  const userId = req.user.id;
  const postId = Number(req.params.postId);

  if (!Number.isFinite(postId)) {
    return res.status(400).json({ ok: false, error: "Invalid postId" });
  }

  const existing = await prisma.bookmark.findUnique({
    where: { userId_postId: { userId, postId } },
    select: { id: true },
  });

  if (existing) {
    await prisma.bookmark.delete({
      where: { userId_postId: { userId, postId } },
    });
    return res.json({ ok: true, saved: false });
  }

  await prisma.bookmark.create({
    data: { userId, postId },
  });

  return res.json({ ok: true, saved: true });
});

/**
 * DELETE /api/bookmarks/:postId
 */
router.delete("/:postId", requireAuth, async (req, res) => {
  const userId = req.user.id;
  const postId = Number(req.params.postId);

  if (!Number.isFinite(postId)) {
    return res.status(400).json({ ok: false, error: "Invalid postId" });
  }

  await prisma.bookmark.deleteMany({
    where: { userId, postId },
  });

  res.json({ ok: true, saved: false });
});

export default router;