import { useEffect, useMemo, useState } from "react";
import "./PageComments.css";

type PageComment = {
  id: string;
  nickname: string;
  text: string;
  createdAt: string; // ISO
};

type Props = {
  pageKey: string; // "trend" | "color" | "styling"
};

// ✅ 지금은 프론트(로컬) 데모
function getAuth() {
  const isLoggedIn = localStorage.getItem("demo:loggedIn") === "true";
  const myNickname = localStorage.getItem("demo:nickname") || "me";
  return { isLoggedIn, myNickname };
}

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

export default function PageComments({ pageKey }: Props) {
  const storageKey = `pageComments:${pageKey}`;

  const [{ isLoggedIn, myNickname }, setAuth] = useState(getAuth);
  const [text, setText] = useState("");
  const [items, setItems] = useState<PageComment[]>(() => load(storageKey));

  useEffect(() => {
    setItems(load(storageKey));
    setText("");
    setAuth(getAuth());
  }, [storageKey]);

  useEffect(() => {
    const onStorage = () => {
      setItems(load(storageKey));
      setAuth(getAuth());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [storageKey]);

  const canPost = useMemo(
    () => isLoggedIn && text.trim().length > 0,
    [isLoggedIn, text]
  );

  const submit = () => {
    const authNow = getAuth();
    setAuth(authNow);

    if (!authNow.isLoggedIn) return; // ✅ 안내문구는 아래 힌트/링크가 아니라 placeholder로만 처리

    const v = text.trim();
    if (!v) return;

    const next: PageComment = {
      id:
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : String(Date.now()),
      nickname: authNow.myNickname || myNickname || "me",
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

      {/* ✅ (삭제) 밑줄 힌트/문구 pcHint 자체를 제거 */}
    </div>
  );
}