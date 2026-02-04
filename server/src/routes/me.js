import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { requireAuth } from "../middlewares/auth.js";

const router = Router();

/**
 * GET /api/me
 * header: Authorization: Bearer <token>
 */
router.get("/", requireAuth, async (req, res) => {
  try {
    const me = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, email: true, nickname: true, role: true, createdAt: true, updatedAt: true },
    });

    if (!me) return res.status(404).json({ ok: false, error: "User not found" });

    return res.json({ ok: true, user: me });
  } catch (e) {
    return res.status(500).json({ ok: false, error: String(e) });
  }
});

export default router;