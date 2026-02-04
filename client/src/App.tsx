import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import Color from "./pages/Color";
import Trend from "./pages/Trend";
import Styling from "./pages/Styling";
import "./App.css";

function App() {
  return (
    <div className="layout">
      {/* 왼쪽 50% */}
      <aside className="left">
        <Sidebar />
      </aside>

      {/* 오른쪽 50% */}
      <main className="right">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/color" element={<Color />} />
          <Route path="/trend" element={<Trend />} />
          <Route path="/styling" element={<Styling />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;