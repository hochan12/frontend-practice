// server/src/routes/tags.js
import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

/**
 * GET /api/tags
 * 응답: { ok:true, tags: [{ tag:string, count:number }] }
 */
router.get("/", requireAuth, async (req, res) => {
  try {
    // tags 배열을 펼쳐서 집계
    // Postgres + Prisma: tags가 text[] 라는 가정
    // raw query가 제일 빠르고 확실함
    const rows = await prisma.$queryRaw`
      SELECT t.tag, COUNT(*)::int as count
      FROM (
        SELECT UNNEST("tags") AS tag
        FROM "Post"
        WHERE "tags" IS NOT NULL
      ) t
      GROUP BY t.tag
      ORDER BY count DESC, t.tag ASC
    `;

    // rows: [{ tag, count }]
    return res.json({ ok: true, tags: rows });
  } catch (e) {
    return res.status(500).json({ ok: false, error: String(e) });
  }
});

/**
 * GET /api/tags/:tag/posts
 * 응답: { ok:true, tag:string, posts:[...] }
 * - PostGrid에 필요한 것만 최소로 내려줌
 */
router.get("/:tag/posts", requireAuth, async (req, res) => {
  try {
    const tag = String(req.params.tag || "").trim();
    if (!tag) return res.status(400).json({ ok: false, error: "tag is required" });

    const posts = await prisma.post.findMany({
      where: { tags: { has: tag } },
      orderBy: { id: "asc" },
      select: {
        id: true,
        caption: true,
        thumbnail: true,
        images: true,
        createdAt: true,
        author: { select: { id: true, nickname: true } },
      },
    });

    return res.json({ ok: true, tag, posts });
  } catch (e) {
    return res.status(500).json({ ok: false, error: String(e) });
  }
});

export default router;