import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

/**
 * POST /api/posts/:id/bookmark
 * => 토글: 없으면 생성, 있으면 삭제
 * 응답: { ok: true, saved: boolean }
 */
router.post("/:id/bookmark", requireAuth, async (req, res) => {
  const userId = req.user.id;
  const postId = Number(req.params.id);

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

export default router;