// server/scripts/syncPostImages.mjs
import fs from "node:fs";
import path from "node:path";
import { prisma } from "../src/lib/prisma.js";

/**
 * ✅ client/public/posts 안 파일들:
 *   1-1.png, 1-2.png, 2-1.jpg ... 형태를 스캔해서
 * Post.thumbnail / Post.images 를 실제 존재하는 파일 기준으로 업데이트한다.
 *
 * 실행:
 *   node server/scripts/syncPostImages.mjs
 */

const PROJECT_ROOT = process.cwd();
const POSTS_DIR = path.join(PROJECT_ROOT, "client", "public", "posts");

function parseFile(name) {
  // ex) "12-6.png" -> { postId:12, index:6, ext:"png" }
  const m = name.match(/^(\d+)-(\d+)\.(png|jpg|jpeg|webp)$/i);
  if (!m) return null;
  return { postId: Number(m[1]), index: Number(m[2]), ext: m[3].toLowerCase() };
}

async function main() {
  if (!fs.existsSync(POSTS_DIR)) {
    console.error("posts dir not found:", POSTS_DIR);
    process.exit(1);
  }

  const files = fs.readdirSync(POSTS_DIR);
  const byPost = new Map(); // postId -> [{index, url}]

  for (const f of files) {
    const info = parseFile(f);
    if (!info) continue;
    const url = `/posts/${f}`; // ✅ 브라우저에서 접근하는 경로
    if (!byPost.has(info.postId)) byPost.set(info.postId, []);
    byPost.get(info.postId).push({ index: info.index, url });
  }

  // postId별로 index 오름차순 정렬
  for (const [postId, arr] of byPost.entries()) {
    arr.sort((a, b) => a.index - b.index);
  }

  const allPosts = await prisma.post.findMany({
    select: { id: true },
    orderBy: { id: "asc" },
  });

  let updated = 0;

  for (const p of allPosts) {
    const list = byPost.get(p.id) ?? [];
    const images = list.map((x) => x.url);
    const thumbnail = images[0] ?? null;

    // ✅ images가 0개면 건너뛰거나(선택), DB를 비워도 됨
    // 여기서는 "DB를 실제 상태로" 맞추기 위해 그대로 반영
    await prisma.post.update({
      where: { id: p.id },
      data: {
        thumbnail: thumbnail ?? "",
        images: images,
      },
    });

    updated += 1;
    console.log(`[sync] post ${p.id}: ${images.length} images`);
  }

  console.log(`done. updated posts: ${updated}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });