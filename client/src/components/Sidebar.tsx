import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div
      style={{
        width: "50vw",
        height: "100vh",
        position: "relative",
      }}
    >
      {/* ✅ 제목: 화면(뷰포트) 기준 왼쪽 위 고정 */}
      <Link to="/" style={{ textDecoration: "none", color: "black" }}>
        <h1
          style={{
            position: "fixed",
            top: "30px",
            left: "90px",
            margin: 0,
            cursor: "pointer",
            zIndex: 10,
          }}
        >
          Magazine
        </h1>
      </Link>

      {/* ✅ 버튼 영역: 여기만 패딩 적용 + 세로 가운데 */}
      <div
        style={{
          height: "100%",
          padding: "60px 50px",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            transform: "translateY(-80px)",
            gap: "18px",
            width: "fit-content",
          }}
        >
          <Link to="/color" style={{ textDecoration: "none" }}>
            <div className="menuBox">올해의 컬러</div>
          </Link>

          <Link to="/trend" style={{ textDecoration: "none" }}>
            <div className="menuBox">올해의 트렌드</div>
          </Link>

          <Link to="/styling" style={{ textDecoration: "none" }}>
            <div className="menuBox">스타일링 팁</div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;