// server/src/routes/posts.js
import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { requireAuth } from "../middleware/auth.js";
import { mergePostImages, resolvePostImagesFromFs } from "../utils/postImages.js";

const router = Router();

// ✅ GET /api/posts?limit=18&cursor=123
router.get("/", async (req, res) => {
  try {
    const limitRaw = Number(req.query.limit);
    const limit = Number.isFinite(limitRaw) ? Math.min(Math.max(limitRaw, 6), 60) : 18;

    const cursorRaw = req.query.cursor;
    const cursor = cursorRaw != null ? Number(cursorRaw) : null;

    const posts = await prisma.post.findMany({
      take: limit + 1, // ✅ 다음 페이지 존재 여부 확인용으로 1개 더 가져옴
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
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

    const hasMore = posts.length > limit;
    const items = hasMore ? posts.slice(0, limit) : posts;
    const nextCursor = hasMore ? items[items.length - 1].id : null;

    return res.json({ ok: true, posts: items, nextCursor, hasMore });
  } catch (e) {
    return res.status(500).json({ ok: false, error: String(e) });
  }
});

/**
 * (선택) GET /api/posts/:id
 * - 모달 단건용 (원하면 쓰고, 안 쓰면 안 써도 됨)
 * - PostModal에서 단건 재조회 방식으로 갈 때 유용
 */
router.get("/:id", async (req, res) => {
  const postId = Number(req.params.id);
  if (!Number.isFinite(postId)) {
    return res.status(400).json({ ok: false, error: "Invalid postId" });
  }

  try {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: {
        id: true,
        caption: true,
        thumbnail: true,
        images: true,
        createdAt: true,
        author: { select: { id: true, nickname: true } },
      },
    });

    if (!post) return res.status(404).json({ ok: false, error: "Not found" });

    const fsImages = resolvePostImagesFromFs(post.id, {
      max: 30,
      consecutiveMissLimit: 2,
      useCache: true,
    });

    const images = mergePostImages(post.images, fsImages);
    const thumbnail = post.thumbnail || images[0] || null;

    return res.json({ ok: true, post: { ...post, thumbnail, images } });
  } catch (e) {
    return res.status(500).json({ ok: false, error: String(e) });
  }
});

/**
 * POST /api/posts/:id/bookmark (토글)
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

  await prisma.bookmark.create({ data: { userId, postId } });
  return res.json({ ok: true, saved: true });
});

/**
 * ✅ GET /api/posts/:id/bookmark
 * 응답: { ok:true, savedByMe:boolean }
 */
router.get("/:id/bookmark", requireAuth, async (req, res) => {
  const userId = req.user.id;
  const postId = Number(req.params.id);

  if (!Number.isFinite(postId)) {
    return res.status(400).json({ ok: false, error: "Invalid postId" });
  }

  const existing = await prisma.bookmark.findUnique({
    where: { userId_postId: { userId, postId } },
    select: { id: true },
  });

  return res.json({ ok: true, savedByMe: !!existing });
});

/**
 * POST /api/posts/:id/like (토글)
 */
router.post("/:id/like", requireAuth, async (req, res) => {
  const userId = req.user.id;
  const postId = Number(req.params.id);

  if (!Number.isFinite(postId)) {
    return res.status(400).json({ ok: false, error: "Invalid postId" });
  }

  const existing = await prisma.like.findUnique({
    where: { userId_postId: { userId, postId } },
    select: { id: true },
  });

  if (existing) {
    await prisma.like.delete({ where: { userId_postId: { userId, postId } } });
    return res.json({ ok: true, liked: false });
  }

  await prisma.like.create({ data: { userId, postId } });
  return res.json({ ok: true, liked: true });
});

/**
 * GET /api/posts/:id/like
 * 응답: { ok:true, count:number, likedByMe:boolean }
 * - optionalAuth가 app에서 적용되어 있으면 req.user로 likedByMe 계산됨
 */
router.get("/:id/like", async (req, res) => {
  const postId = Number(req.params.id);
  if (!Number.isFinite(postId)) {
    return res.status(400).json({ ok: false, error: "Invalid postId" });
  }

  const count = await prisma.like.count({ where: { postId } });

  const userId = req.user?.id ?? null;
  let likedByMe = false;

  if (userId) {
    const mine = await prisma.like.findUnique({
      where: { userId_postId: { userId, postId } },
      select: { id: true },
    });
    likedByMe = !!mine;
  }

  return res.json({ ok: true, count, likedByMe });
});

/**
 * GET /api/posts/:id/comments
 */
router.get("/:id/comments", async (req, res) => {
  const postId = Number(req.params.id);
  if (!Number.isFinite(postId)) {
    return res.status(400).json({ ok: false, error: "Invalid postId" });
  }

  const comments = await prisma.comment.findMany({
    where: { postId },
    orderBy: { id: "asc" },
    select: {
      id: true,
      text: true,
      createdAt: true,
      userId: true,
      user: { select: { nickname: true } },
    },
  });

  return res.json({
    ok: true,
    comments: comments.map((c) => ({
      id: c.id,
      text: c.text,
      createdAt: c.createdAt,
      userId: c.userId,
      nickname: c.user.nickname,
    })),
  });
});

/**
 * POST /api/posts/:id/comments
 */
router.post("/:id/comments", requireAuth, async (req, res) => {
  const postId = Number(req.params.id);
  if (!Number.isFinite(postId)) {
    return res.status(400).json({ ok: false, error: "Invalid postId" });
  }

  const text = String(req.body?.text ?? "").trim();
  if (!text) {
    return res.status(400).json({ ok: false, error: "text is required" });
  }

  const created = await prisma.comment.create({
    data: { postId, userId: req.user.id, text },
    select: {
      id: true,
      text: true,
      createdAt: true,
      userId: true,
      user: { select: { nickname: true } },
    },
  });

  return res.json({
    ok: true,
    comment: {
      id: created.id,
      text: created.text,
      createdAt: created.createdAt,
      userId: created.userId,
      nickname: created.user.nickname,
    },
  });
});

export default router;