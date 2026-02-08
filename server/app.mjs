// server/app.mjs
import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import { prisma } from "./src/lib/prisma.js";

import authRouter from "./src/routes/auth.js";
import meRouter from "./src/routes/me.js";
import postsRouter from "./src/routes/posts.js";
import bookmarksRouter from "./src/routes/bookmarks.js";
import commentsRouter from "./src/routes/comments.js";

import { optionalAuth } from "./src/middleware/auth.js";

const app = express();

/** ESM에서 __dirname 대체 */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** CORS */
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

/** /posts 정적 파일 서빙 */
const POSTS_DIR =
  process.env.POSTS_DIR || path.resolve(__dirname, "../client/public/posts");

app.use("/posts", express.static(POSTS_DIR));

/** health check */
app.get("/api/health", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ ok: true, db: true });
  } catch (e) {
    res.status(500).json({ ok: false, db: false, error: String(e) });
  }
});

/** routes */
app.use("/api/auth", authRouter);
app.use("/api/me", meRouter);
app.use("/api/posts", optionalAuth, postsRouter);
app.use("/api/bookmarks", bookmarksRouter);
app.use("/api/comments", commentsRouter);

const PORT = Number(process.env.PORT || 3000);

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log("📂 Serving /posts from:", POSTS_DIR);
});