// server/src/utils/postImages.js
import fs from "fs";
import path from "path";

const extsDefault = ["png", "jpg", "jpeg", "webp"];

// postId -> images[]
const cache = new Map();

/**
 * ✅ 파일시스템에서 실제 존재하는 /client/public/posts/{id}-{n}.{ext} 만 찾아서
 * "/posts/{id}-{n}.{ext}" 배열로 반환
 *
 * opts:
 * - max: 최대 몇 장까지 찾을지
 * - consecutiveMissLimit: 연속 miss가 몇 번이면 중단할지
 * - exts: 확장자 후보
 * - useCache: 캐시 사용
 */
export function resolvePostImagesFromFs(postId, opts = {}) {
  const max = opts.max ?? 30;
  const consecutiveMissLimit = opts.consecutiveMissLimit ?? 2;
  const exts = opts.exts ?? extsDefault;
  const useCache = opts.useCache ?? true;

  if (!Number.isFinite(postId) || postId <= 0) return [];

  if (useCache && cache.has(postId)) return cache.get(postId);

  // ✅ 서버 실행 위치 기준으로 client/public/posts 찾아감
  // - 일반적으로 Project/server 에서 node 실행한다는 전제
  const postsDir =
    process.env.POSTS_DIR ||
    path.resolve(process.cwd(), "../client/public/posts");

  const found = [];
  let miss = 0;

  for (let i = 1; i <= max; i++) {
    let hit = false;

    for (const ext of exts) {
      const filePath = path.join(postsDir, `${postId}-${i}.${ext}`);
      if (fs.existsSync(filePath)) {
        found.push(`/posts/${postId}-${i}.${ext}`);
        hit = true;
        break;
      }
    }

    if (hit) {
      miss = 0;
    } else {
      miss += 1;
      if (miss >= consecutiveMissLimit) break;
    }
  }

  if (useCache) cache.set(postId, found);
  return found;
}

/** ✅ DB images + FS images 합치기 (중복 제거 + 정렬) */
export function mergePostImages(dbImages, fsImages) {
  const a = Array.isArray(dbImages) ? dbImages.filter(Boolean) : [];
  const b = Array.isArray(fsImages) ? fsImages.filter(Boolean) : [];

  const set = new Set();
  for (const x of a) set.add(x);
  for (const x of b) set.add(x);

  const merged = Array.from(set);

  // "/posts/{id}-{n}.ext" 형태면 n 기준 정렬
  merged.sort((x, y) => {
    const nx = extractN(x);
    const ny = extractN(y);
    if (nx == null && ny == null) return String(x).localeCompare(String(y));
    if (nx == null) return 1;
    if (ny == null) return -1;
    return nx - ny;
  });

  return merged;
}

function extractN(url) {
  const m = String(url).match(/\/posts\/\d+-(\d+)\.(png|jpg|jpeg|webp)(\?.*)?$/i);
  if (!m) return null;
  const n = Number(m[1]);
  return Number.isFinite(n) ? n : null;
}

export function clearPostImagesCache(postId) {
  if (typeof postId === "number") cache.delete(postId);
  else cache.clear();
}