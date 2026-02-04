import "dotenv/config";
import express from "express";
import cors from "cors";
import { prisma } from "./src/lib/prisma.js";

import authRouter from "./src/routes/auth.js";
import meRouter from "./src/routes/me.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

/**
 * (유지) 올해의 컬러
 */
app.get("/api/color", (req, res) => {
  res.json({
    title: "PANTONE 올해의 컬러 2026",
    color: "Cloud Dancer",
    description: "소란스러운 세상 속 고요와 평온의 속삭임",
  });
});

/**
 * (유지) 올해의 패션 트렌드
 */
app.get("/api/trend", (req, res) => {
  res.json({
    title: "2026 패션 트렌드",
    trends: ["미니멀 실루엣", "테크웨어 감성", "젠더리스 스타일"],
  });
});

/**
 * (유지) 스타일링 팁
 */
app.get("/api/styling", (req, res) => {
  res.json({
    title: "스타일링 팁",
    tips: ["톤온톤 컬러 매칭 활용", "과한 로고보다 소재에 집중", "신발로 포인트 주기"],
  });
});

/**
 * (유지) DB 헬스체크
 */
app.get("/api/health", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ ok: true, db: true });
  } catch (e) {
    res.status(500).json({ ok: false, db: false, error: String(e) });
  }
});

/**
 * (추가) Auth / Me 라우터
 */
app.use("/api/auth", authRouter);
app.use("/api/me", meRouter);

// 루트는 프론트가 아니라서 "Cannot GET /" 나오는 게 정상임.
// 그래도 보기 싫으면 아래 주석 해제하면 됨.
// app.get("/", (req, res) => res.send("OK"));

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});