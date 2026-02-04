import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

/**
 * 올해의 컬러
 */
app.get("/api/color", (req, res) => {
  res.json({
    title: "PANTONE 올해의 컬러 2026",
    color: "Cloud Dancer",
    description: "소란스러운 세상 속 고요와 평온의 속삭임"
  });
});

/**
 * 올해의 패션 트렌드
 */
app.get("/api/trend", (req, res) => {
  res.json({
    title: "2026 패션 트렌드",
    trends: [
      "미니멀 실루엣",
      "테크웨어 감성",
      "젠더리스 스타일"
    ]
  });
});

/**
 * 스타일링 팁
 */
app.get("/api/styling", (req, res) => {
  res.json({
    title: "스타일링 팁",
    tips: [
      "톤온톤 컬러 매칭 활용",
      "과한 로고보다 소재에 집중",
      "신발로 포인트 주기"
    ]
  });
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});