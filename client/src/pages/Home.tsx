// client/src/pages/Home.tsx
import "./Home.css";
import PostGrid from "../components/PostGrid";

export default function Home() {
  return (
    <div className="pageWrap">
      <div className="homeOffset">
        <PostGrid />
      </div>
    </div>
  );
}