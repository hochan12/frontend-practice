import "./MagazinePage.css";
import "./PageLayout.css";
import "./Trend.css";
import PageComments from "../components/PageComments";

import img1 from "../assets/s1.png";
import img2 from "../assets/s4.png";
import img3 from "../assets/s5.png";
import img4 from "../assets/s6.png";
import img5 from "../assets/s12.jpeg";
import img6 from "../assets/s3.png";
import img7 from "../assets/s9.jpg";
import img8 from "../assets/s7.jpg";
import img9 from "../assets/s15.jpg";
import img10 from "../assets/s14.jpg";
import img11 from "../assets/s16.jpg";
import img12 from "../assets/s15.png";
import img13 from "../assets/s17.jpg";
import img14 from "../assets/s8.jpg";
import img15 from "../assets/s10.jpg";
import img16 from "../assets/s18.jpg";
import img17 from "../assets/s19.jpg";
import img18 from "../assets/s20.png";
import img19 from "../assets/s23.jpg";
import img20 from "../assets/s24.jpg";
import img21 from "../assets/s22.jpg";
import img22 from "../assets/s25.jpg";
import img23 from "../assets/s26.jpg";
import img24 from "../assets/s27.jpg";
import img25 from "../assets/s28.jpg";
import img26 from "../assets/s29.jpg";


export default function Styling() {
  return (
    <div className="magPage">
      <div className="pageLayout">
        <div className="pageCard">
          {/* ✅ Trend 결: Intro */}
          <div className="trendIntro">
            <h2 className="sectionTitle">스타일링 팁</h2>
            <p className="trendText">
              
            </p>
          </div>

          {/* ✅ Trend 결: Sections */}
          <div className="trendSections">
            {/* 섹션 1 */}
            <section className="trendSection">
              <h3 className="sectionTitle">눈여겨볼 액세서리</h3>
              <div className="sectionDesc">
                미니멀한 스타일링을 주로 하다 보면 자칫 착장이 너무 단순해보일 때가 있는데, 이런 부분을 해결하기 가장 쉬운 방법이 액세서리를 활용하는 것이다. 
                안경이나 반지/팔찌 등 비교적 도전하기 쉬운 액세서리들도 물론 좋지만 올해에는 스카프나 얇은 머플러 같은 아이템에 주목해보면 좋을 것 같다. 
                </div>
              <div className="imgRow imgCount2 imgTwoFixed">
                <div className="imgCard">
                  <img className="img" src={img1} alt="styling"/>
                </div>
                <div className="imgCard">
                  <img className="img" src={img3} alt="styling"/>
                </div>
                <div className="imgCard">
                  <img className="img" src={img6} alt="styling"/>
                </div>
                <div className="imgCard">
                  <img className="img" src={img18} alt="styling"/>
                </div>
              </div>
              <div className="sectionLead">
                스카프는 착장에 한층 더 세련된 무드를 더해주고 전체적으로 부드럽고 따뜻한 느낌을 내기 때문에 차분하지만 세련된 스타일링을 원하는 사람에게 적극 추천한다.
              </div>
              <div className="sectionDesc">
                {"\n"}
              </div>
              <div className="sectionDesc">
                옷을 입는 데에 있어서 가방이 있고 없고의 차이는 정말 크다. 
                아직 도전하기 어려운 색이나 패턴을 가방으로 먼저 사용해볼 수도 있고 착장의 느낌을 결정하는 데 가방이 굉장히 큰 역할을 하기 때문에
                어떤 스타일을 즐겨 하든 개인적으로 가방은 필수적인 요소라고 생각한다.
              </div>
              <div className="imgRow imgCount2 imgTwoFixed">
                <div className="imgCard">
                  <img className="img" src={img7} alt="styling"/>
                </div>
                <div className="imgCard">
                  <img className="img" src={img8} alt="styling"/>
                </div>
              </div>
              <div className="sectionLead">
                블랙이나 브라운처럼 튀지 않는 기본적인 색이라도 가방 하나만 더해줘도 착장이 심심해 보이지 않게 되고
                강렬한 색감이나 패턴이 있는 가방으로 포인트를 줄 수도 있다.
              </div>
            </section>

            {/* 섹션 3 */}
            <section className="trendSection">
              <h3 className="sectionTitle">작은 포인트 하나</h3>
              <div className="sectionDesc">
                모자를 활용하면 조금 더 캐주얼한 무드로 포인트를 줄 수 있다.{"\n"}
                모자도 가방처럼 비교적 색을 사용하기 쉬운 아이템이기 때문에 포인트를 줄 수 있는 색의 모자를 매치해서
                더욱 센스있는 스타일링을 할 수 있다.
              </div>
              <div className="imgRow imgCount2 imgTwoFixed">
                <div className="imgCard">
                  <img className="img" src={img20} alt="styling"/>
                </div>
                <div className="imgCard">
                  <img className="img" src={img19} alt="styling"/>
                </div>
                <div className="imgCard">
                  <img className="img" src={img21} alt="styling"/>
                </div>
                <div className="imgCard">
                  <img className="img" src={img22} alt="styling"/>
                </div>
              </div>
              <div className="sectionLead">
                앞서 추천한 스카프와는 확실히 다른 방향으로 코디를 살려주는 것을 볼 수 있다.
              </div>
            </section>

            {/* 섹션 4 */}
            <section className="trendSection">
              <h3 className="sectionTitle">레이어드</h3>
              <div className="sectionDesc">
                반팔 안에 긴팔을 레이어드 해서 스타일링하는 것 또한 센스있게 캐주얼한 느낌을 주기 좋다.{"\n"}
                여기서도 마찬가지로 포인트 되는 색이나 패턴을 안쪽 긴팔에 사용해주면 부담스럽지 않게 다양한 시도를 해볼 수 있기 때문에 추천한다.
              </div>
              <div className="imgRow imgCount2 imgTwoFixed">
                <div className="imgCard">
                  <img className="img" src={img23} alt="styling"/>
                </div>
                <div className="imgCard">
                  <img className="img" src={img26} alt="styling"/>
                </div>
                <div className="imgCard">
                  <img className="img" src={img13} alt="styling"/>
                </div>
                <div className="imgCard">
                  <img className="img" src={img25} alt="styling"/>
                </div>
              </div>
              <div className="sectionLead">
                꼭 티셔츠끼리만 매치하는 게 아니라 반팔 셔츠에 긴팔티, 얇은 원피스 위에 티셔츠를 레이어드하는 등 
                가지고 있는 옷들을 여러가지로 다양하게 활용해보는 것을 추천한다.
              </div>
            </section>

            {/* 섹션 5 */}
            <section className="trendSection">
              <h3 className="sectionTitle">컨셉은 확실하게</h3>
              <div className="sectionDesc">
                어떤 스타일이든 본인이 보여주고 싶은 이미지를 확실하게 만들어내는 게 중요하다.{"\n"}
                개인적으로 사람들이 옷에 관심을 가지고 얼마 지나지 않았을 때 많이 실수하는 부분들 중 하나가 서로 무드가 너무 다른 아이템들을 함께 매치하는 것이라고 생각하는데,
                극단적으로 예를 들어보면 슬랙스를 입었는데 갑자기 된장포스를 신는다거나, 트레이닝 셋업에 더비슈즈를 신는 등 믹스매치하려는 의도는 알겠지만 조금 과한 경우가 있을 수 있다.
                각자가 추구하는 스타일의 범주를 너무 벗어나지 않는 선에서 포인트를 주는 것이 중요하다고 생각한다.
              </div>
              <div className="imgRow imgCount2 imgTwoFixed">
                <div className="imgCard">
                  <img className="img" src={img14} alt="styling"/>
                </div>
                <div className="imgCard">
                  <img className="img" src={img15} alt="styling"/>
                </div>
                <div className="imgCard">
                  <img className="img" src={img16} alt="styling"/>
                </div>
                <div className="imgCard">
                  <img className="img" src={img17} alt="styling"/>
                </div>
              </div>
              <div className="sectionLead">
                위의 두 사진은 최소한의 아이템만을 사용했지만 심심하지 않고 오히려 세련된 느낌을 주고, 
                아래는 색을 과감하게 쓰면서도 과하지 않은 센스있는 코디를 보여준다.
                이처럼 본인이 원하는 스타일의 컨셉을 확실하게 정하고 그 틀을 벗어나지 않는 선에서 포인트를 넣어가며 스타일링하다 보면 어렵지 않게 멋있는 코디를 다양하게 만들 수 있을 것이다.
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