// server/src/routes/me.js
import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { requireAuth } from "../middleware/auth.js";
import { mergePostImages, resolvePostImagesFromFs } from "../utils/postImages.js";

const router = Router();

/**
 * GET /api/me
 */
router.get("/", requireAuth, async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: {
      id: true,
      email: true,
      nickname: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return res.json({ ok: true, user });
});

/**
 * GET /api/me/bookmarks
 */
router.get("/bookmarks", requireAuth, async (req, res) => {
  const items = await prisma.bookmark.findMany({
    where: { userId: req.user.id },
    orderBy: { createdAt: "desc" },
    select: { postId: true },
  });

  return res.json({ ok: true, postIds: items.map((x) => x.postId) });
});

/**
 * ✅ GET /api/me/bookmarks/posts
 * SavedPosts 1번 요청으로 끝
 * ✅ 실제 이미지 개수까지 포함해서 내려줌
 */
router.get("/bookmarks/posts", requireAuth, async (req, res) => {
  const items = await prisma.bookmark.findMany({
    where: { userId: req.user.id },
    orderBy: { createdAt: "desc" },
    select: {
      post: {
        select: {
          id: true,
          caption: true,
          thumbnail: true,
          images: true,
          createdAt: true,
          author: { select: { id: true, nickname: true } },
        },
      },
    },
  });

  const postsRaw = items.map((x) => x.post).filter(Boolean);

  const posts = postsRaw.map((p) => {
    const fsImages = resolvePostImagesFromFs(p.id, {
      max: 30,
      consecutiveMissLimit: 2,
      useCache: true,
    });

    const images = mergePostImages(p.images, fsImages);
    const thumbnail = p.thumbnail || images[0] || null;

    return { ...p, thumbnail, images };
  });

  return res.json({ ok: true, posts });
});

export default router;