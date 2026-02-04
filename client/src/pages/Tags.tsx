import { Link } from "react-router-dom";
import { posts } from "../data/posts";
import "./PageLayout.css";

export default function Tags() {
  const tagSet = new Set<string>();
  posts.forEach((p) => (p.tags || []).forEach((t) => tagSet.add(t)));

  const tags = Array.from(tagSet).sort((a, b) => a.localeCompare(b));

  return (
    <div className="pageWrap">
      <div className="pageTitle">태그 모음</div>
      <div className="chipGrid">
        {tags.map((t) => (
          <Link key={t} className="chip" to={`/tags/${encodeURIComponent(t)}`}>
            #{t}
          </Link>
        ))}
      </div>
    </div>
  );
}