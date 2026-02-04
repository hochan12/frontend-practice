import PageComments from "../components/PageComments";
import "./PageLayout.css";

export default function Color() {
  return (
    <div className="pageLayout">
      <div className="pageCard">
        <h2>올해의 컬러</h2>
        <p>(여기에 네가 작성할 글을 나중에 채우면 돼.)</p>

        <PageComments pageKey="color" />
      </div>
    </div>
  );
}