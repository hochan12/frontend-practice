// client/src/pages/Trend.tsx
import "./MagazinePage.css";
import "./PageLayout.css";
import "./Trend.css";

import img1 from "../assets/1남성.jpg";
import img3 from "../assets/3남성.jpg";
import img4 from "../assets/4남성.jpg";
import img6 from "../assets/6여성.jpg";
import img7 from "../assets/7여성.jpg";
import img8 from "../assets/8여성.jpg";
import img9 from "../assets/9여성.jpg";
import img10 from "../assets/10여성.jpg";
import img11 from "../assets/11여성.jpeg";
import img12 from "../assets/12여성.png";
import img14 from "../assets/7남성.jpg";
import img15 from "../assets/8남성.jpg";
import img16 from "../assets/11남성.jpg";
import img18 from "../assets/14여성.jpg";
import img20 from "../assets/16여성.jpg";
import img13 from "../assets/13여성.jpg";
import img17 from "../assets/17여성.jpg";

import PageComments from "../components/PageComments";


export default function Styling() {
  return (
    <div className="magPage">
      <div className="pageLayout">
        <div className="pageCard">
          {/* ✅ Trend 결: Intro */}
          <div className="trendIntro">
            <h2 className="sectionTitle">올해의 트렌드</h2>
            <p className="trendText">매해 초, 인스타 매거진이나 유튜브 등 패션 관련 컨텐츠에서 빠짐없이 등장하는 올해 트렌드 예측.
2~3년 전까지만 해도 나를 포함해 트렌드를 꽤나 중요하게 생각했던 사람들이 많았던 것 같다.
미니멀, 스트릿, 고프코어처럼 들었을 때 바로 어떤 느낌인지 떠오르는 스타일들이 유행을 하곤 했었는데 요즘은 유행하는 스타일, 트렌드가 점점 약해지고 각자 본인의 개성대로 입는 추세라고 생각한다.

물론 전체적인 범주에서의 메가 트렌드나 인플루언서, 연예인이 특정 제품을 착용해서 핫해지거나 유행하는 스타일들이 있긴 하지만, 예전에 비하면 트렌드가 그렇게까지 중요하다는 느낌은 들지 않는 것이 사실이다.
그럼에도 꾸준히 트렌드 분석이나 올해의 컬러에 대한 얘기들이 매년 끊이지 않는 이유는 트렌드를 알면서 본인의 스타일을 고수하는 것과 아예 모르고 있는 것에는 분명한 차이가 있기 때문이라고 생각한다.

이번엔 또 무슨 코어가 있고 어떤 룩이 있는지 그저 단어로 접하는 것보다 직접 보고 스스로 느껴보는 게 더 와닿을 것이라 생각한다. 작성자의 시선에서 올해 한번쯤 봐두면 좋을만한 스타일에 대해 정리해봤다.
</p>
          </div>

          {/* ✅ Trend 결: Sections */}
          <div className="trendSections">
            {/* 섹션 1 */}
            <section className="trendSection">
              <h3 className="sectionTitle">남성복도 바지핏은 좁아지고 상의 또한 타이트해졌다.</h3>
              <div className="imgRow imgCount3">
                <div className="imgCard">
                  <img className="img" src={img1} alt="trend"/>
                </div>
                <div className="imgCard">
                  <img className="img" src={img14} alt="trend"/>
                </div>
                <div className="imgCard">
                  <img className="img" src={img3} alt="trend"/>
                </div>
                <div className="imgCard">
                  <img className="img" src={img15} alt="trend"/>
                </div>
                <div className="imgCard">
                  <img className="img" src={img4} alt="trend"/>
                </div>
                <div className="imgCard">
                  <img className="img" src={img16} alt="trend"/>
                </div>
              </div>
              <div className="sectionLead">
                더하는 게 아닌 덜어내는 것에 집중하는 분위기.
              </div>
              <div className="sectionDesc">
                위의 룩들을 보면 로고도, 그렇다 할 디테일도 없이 단순히 소재와 핏으로 분위기를 잡아내고 있다.\n몇년간 꾸준히 사랑받아온 와이드팬츠도 저물어가는 추세. 바지 핏이 점차 좁아지면서 밸런스를 맞추기 위해 자연스럽게 상의까지 레귤러핏으로 자리잡는 느낌이다. 별 다른 디테일 없이 고급스러운 분위기의 착장을 만드는 것에 집중해보면 좋을 것 같다.
                </div>
              <div className="sectionDesc">
                {"\n"}
              </div>
            </section>

            {/* 섹션 2 */}
            <section className="trendSection">
              <h3 className="sectionTitle">마찬가지로 덜어내는 여성복</h3>
              <div className="imgRow imgCount2 imgTwoFixed">
                <div className="imgCard">
                  <img className="img" src={img6} alt="trend"/>
                </div>
                <div className="imgCard">
                  <img className="img" src={img7} alt="trend"/>
                </div>
                <div className="imgCard">
                  <img className="img" src={img8} alt="trend"/>
                </div>
                <div className="imgCard">
                  <img className="img" src={img9} alt="trend"/>
                </div>
              </div>
              <div className="sectionLead">
                이러한 스타일링은 여성복에서도 확인할 수 있다.
              </div>
              <div className="sectionDesc">
                개인적으로 올해는 실루엣만으로 고급스러운 분위기를 자아내는 착장에 대한 선호가 더 많아질 것다. 
                덜어내지만 심심해 보이지는 않게 하는 데에 있어서 포인트는 사람 자체의 분위기에 옷을 녹아들게 하는 것이라고 생각한다. 
                무조건 잘생기거나 예쁠 필요도 없고 그저 본인 스타일에 대한 이해와 그에 맞는 분위기만 신경써줘도 착장이 한 층 더 매력있어질 것이다.{"\n"}
                2026년 트렌드 키워드로 포엣(poet) 코어를 많이 언급하곤 하는데 이름에서 알 수 있듯이 시인처럼 지적이고 감성적인 이미지의 룩을 생각하면 쉽다. 
                악세서리 또한 전체적으로 안경이나 가방처럼 과하지 않은 아이템들로 담백하게 스타일링하는 느낌이다.
              </div>
              <div className="imgRow imgCount2 imgTwoFixed">
                <div className="imgCard">
                  <img className="img" src={img18} alt="trend"/>
                </div>
                <div className="imgCard">
                  <img className="img" src={img20} alt="trend"/>
                </div>
              </div>
              <div className="sectionLead">
                데님과 니트, 셔츠를 활용한 자연스러운 분위기.
              </div>
            </section>

            {/* 섹션 3 */}
            <section className="trendSection">
              <h3 className="sectionTitle">또 다른 키워드, 모리걸</h3>
              <div className="imgRow imgCount3">
                <div className="imgCard">
                  <img className="img" src={img10} alt="trend"/>
                </div>
                <div className="imgCard">
                  <img className="img" src={img11} alt="trend"/>
                </div>
                <div className="imgCard">
                  <img className="img" src={img12} alt="trend"/>
                </div>
              </div>
              <div className="sectionDesc">
                일본어로 숲을 뜻하는 모리(森)와 소녀(girl)가 합쳐진 단어 모리걸, 약간의 빈티지함과 몽환적인 분위기를 지닌 스타일이라고 보면 좋을 것 같다. 
                이름에서 알 수 있듯이 일본 문화의 영향을 받은 느낌이 있는데, 색감을 다양하게 쓰거나 키치한 그래픽을 넣어 러블리한 감성을 만들어낸다.{"\n"}
                이러한 착장은 작년에 이어 올해도 더 다양한 브랜드에서 제품이 나오고 소비자들에게도 인기가 많을 것이라 생각된다.
              </div>
              <div className="imgRow imgCount2 imgTwoFixed">
                <div className="imgCard">
                  <img className="img" src={img13} alt="trend"/>
                </div>
                <div className="imgCard">
                  <img className="img" src={img17} alt="trend"/>
                </div>
              </div>
              <div className="sectionLead">
                전체적으로 비슷한 톤의 색감들로 매치하고, 프릴 스커트나 패턴이 있는 아이템들을 레이어드 해주면 수월하게 스타일링이 가능하다. 
                앞서 소개한 포엣 코어와는 다른 느낌의 빈티지한 느낌의 안경이나 악세서리를 사용해주는 것도 좋은 방법이다.
              </div>
              <div className="sectionDesc">
                {"\n"}트렌드라고 해서 무조건 그걸 따라야 한다는 법은 없다.{"\n"}
                작성자 또한 다양한 곳에서 트렌드라고 하는 것들을 봐도 올해는 이런 게 있구나 정도로만 두고 현재 스스로가 느끼기에 예쁜 스타일을 선택할 것이다.{"\n"}
                이 글 또한 작성자의 시선에서 예측하고 만들어진 주관적인 생각이기 때문에 결국 패션은 각자의 개성대로 즐기는 게 가장 바람직한 문화라고 생각한다.
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

