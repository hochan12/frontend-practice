// client/src/pages/Home.tsx
import "./Home.css";
import PostGrid from "../components/PostGrid";

export default function Home() {
  return (
    <div className="pageWrap">
      <div className="homeOffset">
        <header className="homeHeader">
          <span className="homeKicker">EDITORIAL</span>
          <h1 className="homeTitle">Magazine Picks</h1>
          <div className="homeRule" />
        </header>

        <PostGrid />
      </div>
    </div>
  );
}