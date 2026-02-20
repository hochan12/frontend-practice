import "./MagazinePage.css";
import "./PageLayout.css";
import "./Trend.css"; // ✅ Trend의 스타일 클래스를 그대로 재사용 (구조 변경 X)
import PageComments from "../components/PageComments";

export default function Styling() {
  return (
    <div className="magPage">
      <div className="pageLayout">
        <div className="pageCard">
          {/* ✅ Trend 결: Intro */}
          <div className="trendIntro">
            <h2 className="sectionTitle">스타일링 팁</h2>
            <p className="trendText">
              예시
            </p>
          </div>

          {/* ✅ Trend 결: Sections */}
          <div className="trendSections">
            {/* 섹션 1 */}
            <section className="trendSection">
              <h3 className="sectionTitle">(예시) 실루엣: 상하 밸런스 먼저</h3>
              <div className="sectionLead">
                “오버 상의면 하의는 슬림/스트레이트”, “와이드 하의면 상의는 정돈”처럼
                비율을 먼저 맞추면 절반은 성공.
              </div>
              <div className="sectionDesc">
                무채색 룩은 디테일이 적어서, 핏이 곧 분위기가 된다.
                상하 둘 다 오버로 가면 힘이 빠지고, 둘 다 타이트면 답답해진다.
                하나만 강조하고 나머지는 정돈하는 방식이 가장 안정적이다.
              </div>

              <div className="imgRow imgCount3">
                <div className="imgCard">
                  <img
                    className="img"
                    src="https://images.unsplash.com/photo-1520975958225-51b29c8e1a4a?auto=format&fit=crop&w=900&q=80"
                    alt="silhouette 1"
                    loading="lazy"
                  />
                </div>
                <div className="imgCard">
                  <img
                    className="img"
                    src="https://images.unsplash.com/photo-1520975682031-ae3d0a9f8d6b?auto=format&fit=crop&w=900&q=80"
                    alt="silhouette 2"
                    loading="lazy"
                  />
                </div>
                <div className="imgCard">
                  <img
                    className="img"
                    src="https://images.unsplash.com/photo-1520975778561-2b8b93a7d2e2?auto=format&fit=crop&w=900&q=80"
                    alt="silhouette 3"
                    loading="lazy"
                  />
                </div>
              </div>
            </section>

            {/* 섹션 2 */}
            <section className="trendSection">
              <h3 className="sectionTitle">(예시) 디테일: 면적 작은 포인트 1개</h3>
              <div className="sectionLead">
                포인트는 “컬러”가 아니라 “소재/광택/형태”로 주는 게 매거진 느낌이 난다.
              </div>
              <div className="sectionDesc">
                무채색 미니멀에서 포인트를 크게 넣으면 분위기가 깨질 수 있다.
                대신 가방의 질감(가죽/나일론), 신발의 광택, 주얼리 하나처럼
                “면적이 작은 요소”로 룩의 중심만 만들어 주면 가장 세련되게 정리된다.
              </div>

              <div className="imgRow imgCount3">
                <div className="imgCard">
                  <img
                    className="img"
                    src="https://images.unsplash.com/photo-1520975963159-0f0bd2d96b1f?auto=format&fit=crop&w=900&q=80"
                    alt="detail point 1"
                    loading="lazy"
                  />
                </div>
                <div className="imgCard">
                  <img
                    className="img"
                    src="https://images.unsplash.com/photo-1520975693757-5e9d5a5d7f6b?auto=format&fit=crop&w=900&q=80"
                    alt="detail point 2"
                    loading="lazy"
                  />
                </div>
                <div className="imgCard">
                  <img
                    className="img"
                    src="https://images.unsplash.com/photo-1520975678922-8d9c60f7ce18?auto=format&fit=crop&w=900&q=80"
                    alt="detail point 3"
                    loading="lazy"
                  />
                </div>
              </div>
            </section>
          </div>

          {/* ✅ 댓글 유지 */}
          <PageComments pageKey="styling" />
        </div>
      </div>
    </div>
  );
}