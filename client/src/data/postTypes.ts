// client/src/data/postTypes.ts
export type Post = {
  id: number;
  images: string[];     // 실제 URL들
  thumbnail: string;    // 실제 URL
  caption: string;
  createdAt: string;
  authorNickname: string;
};