import { useEffect, useMemo, useState } from "react";
import "./PageComments.css";

export type PageComment = {
  id: string;
  nickname: string;
  text: string;
  createdAt: string; // ISO
};

type Props = {
  storageKey: string;              // 페이지별로 다르게 (예: "page:trend")
  isLoggedIn: boolean;
  myNickname: string;              // 로그인한 사람 닉네임
  onRequireLogin?: () => void;      // 로그인 모달 열기 등
};

function load(storageKey: string): PageComment[] {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return [];
    return arr;
  } catch {
    return [];
  }
}

function save(storageKey: string, comments: PageComment[]) {
  localStorage.setItem(storageKey, JSON.stringify(comments));
}

export default function PageComments({
  storageKey,
  isLoggedIn,
  myNickname,
  onRequireLogin,
}: Props) {
  const [text, setText] = useState("");
  const [items, setItems] = useState<PageComment[]>(() => load(storageKey));

  useEffect(() => {
    // 다른 페이지로 이동 시 storageKey 바뀌면 그걸로 로딩
    setItems(load(storageKey));
    setText("");
  }, [storageKey]);

  const canPost = useMemo(() => isLoggedIn && text.trim().length > 0, [isLoggedIn, text]);

  const submit = () => {
    if (!isLoggedIn) {
      onRequireLogin?.();
      return;
    }
    const v = text.trim();
    if (!v) return;

    const next: PageComment = {
      id: crypto.randomUUID(),
      nickname: myNickname || "user",
      text: v,
      createdAt: new Date().toISOString(),
    };

    const updated = [...items, next];
    setItems(updated);
    save(storageKey, updated);
    setText("");
  };

  return (
    <div className="pcWrap">
      <div className="pcTitle">댓글</div>

      <div className="pcList">
        {items.length === 0 ? (
          <div className="pcEmpty">아직 댓글이 없어요.</div>
        ) : (
          items.map((c) => (
            <div className="pcItem" key={c.id}>
              <span className="pcNick">{c.nickname}</span>
              <span className="pcText">{c.text}</span>
            </div>
          ))
        )}
      </div>

      <div className="pcInputRow">
        <input
          className="pcInput"
          placeholder={isLoggedIn ? "댓글 달기..." : "로그인 후 댓글을 작성할 수 있어요"}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") submit();
          }}
          disabled={!isLoggedIn}
        />
        <button className="pcBtn" type="button" onClick={submit} disabled={!canPost}>
          게시
        </button>
      </div>

      {!isLoggedIn && (
        <div className="pcHint" onClick={() => onRequireLogin?.()}>
          로그인해야 댓글을 작성할 수 있어요.
        </div>
      )}
    </div>
  );
}