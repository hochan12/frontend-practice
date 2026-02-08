// server/src/routes/comments.js
import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.patch("/:id", requireAuth, async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) return res.status(400).json({ ok: false, error: "Invalid id" });

  const text = String(req.body?.text ?? "").trim();
  if (!text) return res.status(400).json({ ok: false, error: "text is required" });

  const existing = await prisma.comment.findUnique({
    where: { id },
    select: { id: true, userId: true },
  });
  if (!existing) return res.status(404).json({ ok: false, error: "Comment not found" });
  if (existing.userId !== req.user.id) return res.status(403).json({ ok: false, error: "Forbidden" });

  const updated = await prisma.comment.update({
    where: { id },
    data: { text },
    select: { id: true, text: true, createdAt: true, userId: true },
  });

  return res.json({ ok: true, comment: updated });
});

router.delete("/:id", requireAuth, async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) return res.status(400).json({ ok: false, error: "Invalid id" });

  const existing = await prisma.comment.findUnique({
    where: { id },
    select: { id: true, userId: true },
  });
  if (!existing) return res.status(404).json({ ok: false, error: "Comment not found" });
  if (existing.userId !== req.user.id) return res.status(403).json({ ok: false, error: "Forbidden" });

  await prisma.comment.delete({ where: { id } });
  return res.json({ ok: true });
});

export default router;