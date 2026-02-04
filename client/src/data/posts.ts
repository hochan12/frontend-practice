export type Comment = {
  id: string;
  nickname: string;
  text: string;
};

export type Post = {
  id: number;
  images: string[];
  thumbnail: string;

  // ✅ 데모용 메타 (나중에 DB로 교체)
  authorNickname: string;   // 화면에는 이 닉네임만 보이게
  caption: string;
  tags: string[];
  createdAt: string;        // YYYY-MM-DD

  likeCount: number;        // 기본 수치
  likedBy: string[];        // 좋아요 누른 사람 목록(데모)
  comments: Comment[];      // 댓글 목록(데모)
};

type GlobModule = Record<string, { default: string } | string>;

const modules = import.meta.glob("../assets/*.png", { eager: true }) as GlobModule;

function getUrl(mod: { default: string } | string) {
  return typeof mod === "string" ? mod : mod.default;
}

function parseKey(path: string) {
  const file = path.split("/").pop() ?? "";
  const m = file.match(/^(\d+)-(\d+)\.png$/);
  if (!m) return null;
  return { n: Number(m[1]), idx: Number(m[2]) };
}

function getImagesFor(n: number) {
  const list: { idx: number; url: string }[] = [];
  for (const path in modules) {
    const parsed = parseKey(path);
    if (!parsed) continue;
    if (parsed.n !== n) continue;
    list.push({ idx: parsed.idx, url: getUrl(modules[path]) });
  }
  list.sort((a, b) => a.idx - b.idx);
  return list.map((x) => x.url);
}

// ✅ 데모용
const demoTags = [
  ["minimal", "menswear"],
  ["coffee", "winter"],
  ["morigirl", "vintage"],
  ["styling", "tips"],
  ["daily", "mood"],
];

function tagsFor(id: number) {
  const t = demoTags[(id - 1) % demoTags.length];
  return t.map((x) => `#${x}`);
}

export const posts: Post[] = Array.from({ length: 15 }, (_, i) => {
  const id = i + 1;
  const images = getImagesFor(id);

  if (images.length === 0) {
    throw new Error(`assets에 ${id}-*.png 파일을 찾지 못했어.`);
  }

  return {
    id,
    images,
    thumbnail: images[0],

    authorNickname: "Fashion 2026", // ✅ @아이디 없이 닉네임만
    caption: `Post ${id} 캡션(나중에 관리자에서 수정)`,
    tags: tagsFor(id),
    createdAt: "2026-02-04",

    likeCount: 128,
    likedBy: ["sora", "jun"],

    comments: [
      { id: `${id}-c1`, nickname: "sora", text: "무드 너무 좋다" },
      { id: `${id}-c2`, nickname: "jun", text: "첫 장이 제일 강력해요" },
    ],
  };
});