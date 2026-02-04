import PageComments from "../components/PageComments";
import "./PageLayout.css";

export default function Styling() {
  return (
    <div className="pageLayout">
      <div className="pageCard">
        <h2>스타일링 팁</h2>
        <p>(여기도 나중에 글을 채우고, 아래 댓글만 유지하면 돼.)</p>

        <PageComments pageKey="styling" />
      </div>
    </div>
  );
}