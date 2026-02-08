// client/src/data/posts.ts
// ✅ public/posts/ 이미지를 "필요할 때만" 찾아 쓰는 유틸
// ✅ 서버가 없는 파일에도 200을 줄 수 있어 Content-Type image/* 검증
// ✅ DB images + public 스캔 결과를 합치기 위한 helper 제공
// ✅ postId별 miss/lastFound 캐시로 스캔 효율 개선

export type Comment = {
  id: string;
  nickname: string;
  text: string;
};

export type Post = {
  id: number;
  images: string[];
  thumbnail: string;

  authorNickname?: string;
  caption?: string;
  tags?: string[];
  createdAt?: string;

  likeCount?: number;
  likedBy?: string[];
  comments?: Comment[];
};

// ✅ 예전 import 깨짐 방지용
export const posts: Post[] = [];

/** postId -> resolved image urls */
const imageCache = new Map<number, string[]>();

/** postId -> last found index (예: 6번까지 찾았으면 6) */
const lastFoundIndexCache = new Map<number, number>();

function isImageContentType(ct: string | null) {
  if (!ct) return false;
  return ct.toLowerCase().startsWith("image/");
}

async function existsImage(url: string): Promise<boolean> {
  // 1) HEAD
  try {
    const head = await fetch(url, { method: "HEAD", cache: "no-store" });
    if (!head.ok) return false;

    const ct = head.headers.get("content-type");
    if (isImageContentType(ct)) return true;

    // HEAD가 애매하면 GET으로 재확인
  } catch {
    // ignore -> GET
  }

  // 2) GET 최소 확인 (Range)
  try {
    const get = await fetch(url, {
      method: "GET",
      cache: "no-store",
      headers: { Range: "bytes=0-0" },
    });
    if (!get.ok) return false;

    const ct = get.headers.get("content-type");
    return isImageContentType(ct);
  } catch {
    return false;
  }
}

/**
 * ✅ public/posts/{postId}-{n}.{ext} 자동 탐색 (실존하는 것만)
 * 개선:
 * - postId별 lastFoundIndexCache로 다음번 스캔은 "마지막으로 찾은 다음 번호부터" 진행
 * - 연속 miss 계산은 "번호 단위로" (확장자 후보는 miss에 반영하지 않음)
 */
export async function resolvePostImagesFromPublic(
  postId: number,
  opts?: {
    max?: number;                  // 기본 12
    consecutiveMissLimit?: number; // 기본 2
    exts?: string[];               // ["png","jpg","jpeg","webp"]
    useCache?: boolean;            // 기본 true
    startFrom?: number;            // 강제 시작 인덱스 (기본: lastFound+1 또는 1)
  }
): Promise<string[]> {
  const max = opts?.max ?? 12;
  const consecutiveMissLimit = opts?.consecutiveMissLimit ?? 2;
  const exts = opts?.exts ?? ["png", "jpg", "jpeg", "webp"];
  const useCache = opts?.useCache ?? true;

  if (!Number.isFinite(postId) || postId <= 0) return [];

  if (useCache && imageCache.has(postId)) return imageCache.get(postId)!;

  const found: string[] = [];
  let consecutiveMiss = 0;

  const lastFound = lastFoundIndexCache.get(postId) ?? 0;
  const start = Math.max(1, opts?.startFrom ?? (lastFound > 0 ? lastFound + 1 : 1));

  for (let i = start; i <= max; i++) {
    let hitThisIndex = false;

    // ✅ 같은 i에 대해 확장자 후보를 빠르게 확인 (miss는 i 기준으로 1회만)
    for (const ext of exts) {
      const url = `/posts/${postId}-${i}.${ext}`;
      // eslint-disable-next-line no-await-in-loop
      const ok = await existsImage(url);
      if (ok) {
        found.push(url);
        hitThisIndex = true;
        lastFoundIndexCache.set(postId, i);
        break;
      }
    }

    if (hitThisIndex) {
      consecutiveMiss = 0;
    } else {
      consecutiveMiss += 1;
      if (consecutiveMiss >= consecutiveMissLimit) break;
    }
  }

  if (useCache) imageCache.set(postId, found);
  return found;
}

/**
 * ✅ DB images + public 스캔 결과를 합쳐서 "중복 제거 + 정렬"해서 반환
 * - DB가 2장만 있어도 public에 더 있으면 합쳐져서 전체가 보임
 * - URL이 "/posts/1-2.png"처럼 상대경로든 절대경로든 들어와도 최대한 맞춰 정렬
 */
export function mergePostImages(
  fromDb: string[] | undefined,
  fromPublic: string[] | undefined
): string[] {
  const db = Array.isArray(fromDb) ? fromDb.filter(Boolean) : [];
  const pub = Array.isArray(fromPublic) ? fromPublic.filter(Boolean) : [];

  // 중복 제거
  const set = new Set<string>();
  for (const u of db) set.add(u);
  for (const u of pub) set.add(u);

  const merged = Array.from(set);

  // 정렬: "/posts/{id}-{n}.{ext}" 패턴이면 n 기준으로 정렬
  merged.sort((a, b) => {
    const na = extractOrderNumber(a);
    const nb = extractOrderNumber(b);
    if (na == null && nb == null) return a.localeCompare(b);
    if (na == null) return 1;
    if (nb == null) return -1;
    return na - nb;
  });

  return merged;
}

function extractOrderNumber(url: string): number | null {
  // .../posts/12-7.png => 7
  const m = url.match(/\/posts\/\d+-(\d+)\.(png|jpg|jpeg|webp)(\?.*)?$/i);
  if (!m) return null;
  const n = Number(m[1]);
  return Number.isFinite(n) ? n : null;
}

/** 캐시 지우기 */
export function clearPostImageCache(postId?: number) {
  if (typeof postId === "number") {
    imageCache.delete(postId);
    lastFoundIndexCache.delete(postId);
  } else {
    imageCache.clear();
    lastFoundIndexCache.clear();
  }
}