import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";

const router = Router();

function signAccessToken(user) {
  return jwt.sign(
    { sub: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

/**
 * POST /api/auth/register
 * body: { email, nickname, password }
 */
router.post("/register", async (req, res) => {
  try {
    const { email, nickname, password } = req.body ?? {};
    if (!email || !nickname || !password) {
      return res.status(400).json({ ok: false, error: "email/nickname/password required" });
    }

    const hashed = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        nickname,
        password: hashed,
      },
      select: { id: true, email: true, nickname: true, role: true, createdAt: true },
    });

    const accessToken = signAccessToken(user);

    return res.status(201).json({
      ok: true,
      user,
      accessToken,
    });
  } catch (e) {
    // Prisma unique constraint (email)
    if (e?.code === "P2002") {
      return res.status(409).json({ ok: false, error: "Email already exists" });
    }
    return res.status(500).json({ ok: false, error: String(e) });
  }
});

/**
 * POST /api/auth/login
 * body: { email, password }
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body ?? {};
    if (!email || !password) {
      return res.status(400).json({ ok: false, error: "email/password required" });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, nickname: true, role: true, password: true },
    });

    if (!user) {
      return res.status(401).json({ ok: false, error: "Invalid credentials" });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(401).json({ ok: false, error: "Invalid credentials" });
    }

    const accessToken = signAccessToken(user);

    return res.json({
      ok: true,
      user: { id: user.id, email: user.email, nickname: user.nickname, role: user.role },
      accessToken,
    });
  } catch (e) {
    return res.status(500).json({ ok: false, error: String(e) });
  }
});

export default router;