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

router.delete("/", requireAuth, async (req, res) => {
  try {
    const userId = req.user.id; // requireAuth가 req.user를 심어준다는 가정

    // ✅ 관계 데이터 정리 (스키마에 따라 테이블명은 너 코드 기준으로 수정)
    await prisma.comment.deleteMany({ where: { userId } });
    await prisma.bookmark.deleteMany({ where: { userId } });

    // ✅ 유저 삭제
    await prisma.user.delete({ where: { id: userId } });

    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(500).json({ message: "탈퇴 처리 실패", error: String(e) });
  }
});

export default router;