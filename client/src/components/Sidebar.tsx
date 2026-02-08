// client/src/components/Sidebar.tsx
import { Link } from "react-router-dom";
import "./Sidebar.css";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <Link to="/" className="brandLink">
        <h1 className="brand">Magazine</h1>
      </Link>

      <nav className="menu">
        <Link className="menu-item" to="/color">올해의 컬러</Link>
        <Link className="menu-item" to="/trend">올해의 트렌드</Link>
        <Link className="menu-item" to="/styling">스타일링 팁</Link>
      </nav>
    </aside>
  );
}