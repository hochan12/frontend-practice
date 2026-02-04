import { useMemo } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import PostGrid from "../components/PostGrid";
import { posts } from "../data/posts";
import "./PageLayout.css";

export default function TagPosts() {
  const { tag } = useParams();
  const decoded = useMemo(() => decodeURIComponent(tag ?? ""), [tag]);

  const filtered = useMemo(
    () => posts.filter((p) => p.tags.includes(decoded)),
    [decoded]
  );

  return (
    <div className="pageLayout">
      <div className="leftArea">
        <Sidebar />
      </div>

      <div className="rightArea">
        <div className="pageCard" style={{ marginBottom: 16 }}>
          <h2>#{decoded}</h2>
          <p style={{ color: "rgba(0,0,0,0.6)" }}>{filtered.length}개의 게시물</p>
        </div>

        {/* ✅ PostGrid가 posts를 내부에서 쓰는 구조면,
            PostGrid에 props로 list를 받도록 살짝 바꾸는 게 깔끔해.
            지금은 “최소 변경”을 위해 아래처럼 간단히 안내만 할게. */}

        <PostGrid listOverride={filtered} />
      </div>
    </div>
  );
}