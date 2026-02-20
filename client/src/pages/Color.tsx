import "./MagazinePage.css";
import "./PageLayout.css";
import "./Trend.css"; // ✅ Trend의 스타일 클래스를 그대로 재사용 (구조 변경 X)
import PageComments from "../components/PageComments";

import img1 from "../assets/1.jpg";
import img2 from "../assets/2.jpg";
import img3 from "../assets/5.jpg";
import img4 from "../assets/outfit1.jpg";
import img5 from "../assets/outfit2.jpg";
import img6 from "../assets/outfit3.jpeg";
import img7 from "../assets/outfit4.jpeg";
import img8 from "../assets/outfit5.jpg";
import img9 from "../assets/outfit6.jpeg";
import img10 from "../assets/outfit7.jpeg";
import img11 from "../assets/outfit8.jpg";
import img12 from "../assets/outfit9.jpg";
import img13 from "../assets/outfit10.jpg";
import img14 from "../assets/outfit11.jpg";
import img15 from "../assets/outfit12.jpg";


export default function Color() {
  return (
    <div className="magPage">
      <div className="pageLayout">
        <div className="pageCard">
          <div className="trendIntro">
            <h2 className="sectionTitle">올해의 컬러</h2>
              
            {/* ✅ hero: imgRow + heroImgRow / imgCard + heroImgCard */}
            <div className="imgRow imgCount1 heroImgRow">
              <div className="imgCard heroImgCard">
                <img className="img" src={img1} alt="Cloud Dancer" />
              </div>
            </div>

            <p className="trendText">
              <div className="sectionLead">
                팬톤(PANTONE)이 지정한 올해의 컬러 Cloud Dancer(11-4201)
              </div>
              {"\n"}
              소란스러운 세상 속에서 조용한 성찰의 가치를 다시 일깨우는, 고요한 영향력을 지닌 맑은 화이트 톤.
              {"\n"}
              다양한 색을 더욱 돋보이게 해주고 어떤 색과도 조화를 이루며 대비를 만들 수 있기 때문에 단독으로든,
              다른 색과 함께 사용하든 손쉽게 스타일링이 가능하고 범용성이 좋다.{"\n"}{"\n"}
            </p>
          </div>

          <div className="trendSections">
            <section className="trendSection">
              <h3 className="sectionTitle">그래서 팬톤이 뭔데?</h3>
              <div className="sectionDesc">
                옷을 좋아하는 사람들이라면 심심치 않게 들어볼 수 있는 단어 팬톤, 올해 트렌드에 관련된 패션 컨텐츠들을 보다 보면 팬톤에서 지정한 올해의 색 얘기는 빠지지 않고 등장할 것이다.
                 대체 팬톤이 뭐길래 항상 언급되고 이들이 정한 컬러가 소개되는 걸까.{"\n"}{"\n"}
                 팬톤은 전 세계의 디자이너와 브랜드가 색을 가지고 정확하게 소통하고 재현할 수 있도록 기준을 제시해 주는 글로벌 컬러 표준 기업이다. 
                 1963년에 처음 색상 번호 기반의 보편적인 컬러 언어를 구축했으며, 현재 패션, 그래픽, 제품, 인테리어 등 다양한 산업에서 10,000개 이상의 컬러 표준을 제공한다. 
                 또한 컬러 트렌드 예측과 브랜드 컨설팅, 디지털과 실제 물리적인 환경에서의 색의 일관성을 유지하도록 지원하는 역할을 하고 있다.{"\n"}{"\n"}
                 이렇듯 팬톤은 패션 뿐만 아니라 색을 사용하는 모든 분야에 영향력을 가지는 기업이다 보니 패션 산업에서 또한 팬톤에서 지정한 올해의 컬러에 관심과 집중이 쏟아지는 것이다.
                {"\n"}{"\n"}
              </div>

              <div className="imgRow imgCount2">
                <div className="imgCard">
                  <img className="img" src={img2} alt="2026color"/>
                </div>
                <div className="imgCard">
                  <img className="img" src={img3} alt="2025color"/>
                </div>
              </div>
              <div className="sectionLead">
                팬톤이 지정한 올해의 컬러(좌 2026, 우 2025)
              </div>
            </section>

            <section className="trendSection">
              <h3 className="sectionTitle">어떻게 활용하면 좋을까?</h3>
              <div className="sectionDesc">
                트렌드 컬러라고 무조건 그 색만 사용하는 것보다는 그와 어울리는 색들을 다양하게 활용해보는 것을 추천한다.{"\n"}
                앞서 언급했듯 올해의 컬러인 Cloud Dancer는 어느 색과도 조화를 이루는 맑은 화이트 계열이기 때문에 이와 잘 어울리는 파스텔 톤들을 한번 주목해보면 좋을 것 같다.
              </div>

              <div className="imgRow imgCount2">
                <div className="imgCard">
                  <img className="img" src={img4} alt="2026color"/>
                </div>
                <div className="imgCard">
                  <img className="img" src={img5} alt="2026color"/>
                </div>
              </div>

              <div className="sectionDesc">
                밝은 색의 파스텔 톤들은 보는 이로 하여금 화사한 이미지와 함께 부드럽고 포근한 인상을 줄 수 있다. 
                이런 이미지는 화이트 계열과 특히나 잘 어울린다고 생각하기 때문에 올해는 레이어드를 통해 다양한 색감을 사용해보는 것을 더욱 추천한다.
                {"\n"}{"\n"}{"\n"}
              </div>

              <div className="imgRow imgCount2 imgTwoFixed">
                <div className="imgCard">
                  <img className="img" src={img7} alt="2026color"/>
                </div>
                <div className="imgCard">
                  <img className="img" src={img10} alt="2026color"/>
                </div>
                <div className="imgCard">
                  <img className="img" src={img8} alt="2026color"/>
                </div>
                <div className="imgCard">
                  <img className="img" src={img11} alt="2026color"/>
                </div>
              </div>
              <div className="sectionLead">
                이런 식으로 화이트 톤과 함께 다양한 색감을 섞어주면 손쉽게 스타일링이 가능하다.
              </div>
              <div className="sectionDesc">
                {"\n"}
              </div>
            </section>

            <section className="trendSection">
              <h3 className="sectionTitle">무채색과의 조화</h3>
              <div className="sectionDesc">
                화이트는 어느 색과도 조화를 이룰 수 있다.{"\n"}
                그 중에서도 같은 무채색끼리 스타일링 했을 때 세련된 무드를 극대화시킬 수 있다고 생각한다.
              </div>
              <div className="sectionDesc">
                {"\n"}
              </div>
              <div className="imgRow imgCount2 imgTwoFixed">
                <div className="imgCard">
                  <img className="img" src={img12} alt="2026color"/>
                </div>
                <div className="imgCard">
                  <img className="img" src={img13} alt="2026color"/>
                </div>
                <div className="imgCard">
                  <img className="img" src={img14} alt="2026color"/>
                </div>
                <div className="imgCard">
                  <img className="img" src={img15} alt="2026color"/>
                </div>
              </div>
              <div className="sectionLead">
                회색과 검정 계열만으로도 심심하지 않게 스타일링이 가능하다.
              </div>
              <div className="sectionDesc">
                한 착장 안에서 톤이나 소재에서 차이를 주거나 악세서리를 추가해주는 등 별 거 아닌 것 같아 보이는 디테일들이 착장의 감도를 높여주는 역할을 한다.
                개인적으로 무채색이 주는 세련된 느낌을 좋아해 이런 스타일링을 즐겨 하는 편이다.{"\n"}{"\n"}
              </div>
              <div className="sectionDesc">
                앞서 말했듯 올해의 컬러인 Cloud Dancer는 다양한 색과 잘 어우러지기 때문에 이 컬러 한가지에만 집중하기보다 다양한 색감을 적극 활용해 보는 것을 추천한다.
                작성자 또한 올해에는 더 많은 색을 사용해 스타일링하는 것을 시도해 볼 생각이다.
              </div>
            </section>
          </div>

          <PageComments pageKey="color" />
        </div>
      </div>
    </div>
  );
}