import { useEffect, useMemo, useRef, useState } from "react";
import "./PageComments.css";
import { useAuthStore } from "../store/authStore";

type PageComment = {
  id: string;
  userId?: number; // ✅ 내 댓글 판별용(새로 추가)
  nickname: string;
  text: string;
  createdAt: string; // ISO
};

type Props = {
  pageKey: string; // "trend" | "color" | "styling"
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

export default function PageComments({ pageKey }: Props) {
  const storageKey = `pageComments:${pageKey}`;

  // ✅ PostModal과 동일한 로그인 기준
  const user = useAuthStore((s) => s.user);
  const token =
    useAuthStore((s: any) => s.accessToken ?? s.token ?? s.access_token) ?? null;

  const isLoggedIn = !!user && !!token;
  const myNickname = user?.nickname ?? user?.email?.split("@")?.[0] ?? "me";
  const myUserId = user?.id ?? null;

  const [text, setText] = useState("");
  const [items, setItems] = useState<PageComment[]>(() => load(storageKey));

  // ✅ IME(한글 조합) 안정화
  const [isComposing, setIsComposing] = useState(false);
  const submitLockRef = useRef(false);
  const justSubmittedRef = useRef(false);

  // ✅ submit 후 input 리셋(IME 버퍼까지 제거)
  const [inputKey, setInputKey] = useState(0);

  // ✅ 수정/삭제
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const editLockRef = useRef(false);
  const deleteLockRef = useRef(false);

  useEffect(() => {
    setItems(load(storageKey));
    setText("");
    setEditingId(null);
    setEditingText("");
    setConfirmDeleteId(null);
    setInputKey((k) => k + 1);
  }, [storageKey]);

  useEffect(() => {
    const onStorage = () => setItems(load(storageKey));
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [storageKey]);

  const canPost = useMemo(
    () => isLoggedIn && text.trim().length > 0,
    [isLoggedIn, text]
  );

  const isMine = (c: PageComment) => {
    if (!isLoggedIn) return false;
    if (myUserId != null && c.userId != null) return c.userId === myUserId;
    // ✅ 이전에 저장된 댓글(userId 없던 시절)도 내 닉네임이면 내 댓글로 취급
    return c.nickname === myNickname;
  };

  const submit = () => {
    if (!isLoggedIn) return;
    if (isComposing) return;

    const v = text.trim();
    if (!v) return;

    if (submitLockRef.current) return;
    submitLockRef.current = true;
    justSubmittedRef.current = true;

    const next: PageComment = {
      id:
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : String(Date.now()),
      userId: myUserId ?? undefined,
      nickname: myNickname,
      text: v,
      createdAt: new Date().toISOString(),
    };

    const updated = [...items, next];
    setItems(updated);
    save(storageKey, updated);

    // ✅ IME 꼬임 방지: 비우기 + input 리마운트
    setText("");
    setEditingId(null);
    setEditingText("");
    setConfirmDeleteId(null);
    setInputKey((k) => k + 1);

    window.setTimeout(() => {
      submitLockRef.current = false;
      justSubmittedRef.current = false;
    }, 140);
  };

  const startEdit = (c: PageComment) => {
    setConfirmDeleteId(null);
    setEditingId(c.id);
    setEditingText(c.text);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingText("");
  };

  const submitEdit = () => {
    if (!isLoggedIn) return;
    if (editingId == null) return;
    if (isComposing) return;

    const v = editingText.trim();
    if (!v) return;

    if (editLockRef.current) return;
    editLockRef.current = true;

    const updated = items.map((c) => (c.id === editingId ? { ...c, text: v } : c));
    setItems(updated);
    save(storageKey, updated);
    cancelEdit();

    window.setTimeout(() => {
      editLockRef.current = false;
    }, 140);
  };

  const askDelete = (id: string) => {
    cancelEdit();
    setConfirmDeleteId(id);
  };

  const cancelDelete = () => setConfirmDeleteId(null);

  const confirmDelete = (id: string) => {
    if (!isLoggedIn) return;

    if (deleteLockRef.current) return;
    deleteLockRef.current = true;

    const updated = items.filter((c) => c.id !== id);
    setItems(updated);
    save(storageKey, updated);
    setConfirmDeleteId(null);

    window.setTimeout(() => {
      deleteLockRef.current = false;
    }, 160);
  };

  return (
    <div className="pcWrap">
      <div className="pcTitle">댓글</div>

      <div className="pcList">
        {items.length === 0 ? (
          <div className="pcEmpty">아직 댓글이 없어요.</div>
        ) : (
          items.map((c) => {
            const mine = isMine(c);
            const editing = editingId === c.id;
            const deleting = confirmDeleteId === c.id;

            return (
              <div key={c.id} className={`pcItem ${deleting ? "isDeleting" : ""}`}>
                <span className="pcNick">{c.nickname}</span>

                {deleting ? (
                  <>
                    <span className="pcText">{c.text}</span>
                    <div className="pcDeleteConfirm" role="alert">
                      <span className="pcDeleteText">댓글을 삭제하시겠습니까?</span>
                      <div className="pcDeleteBtns">
                        <button
                          className="pcBtn pcBtnSm"
                          type="button"
                          onClick={() => confirmDelete(c.id)}
                        >
                          예
                        </button>
                        <button
                          className="pcBtn pcBtnSm pcGhost"
                          type="button"
                          onClick={cancelDelete}
                        >
                          아니오
                        </button>
                      </div>
                    </div>
                  </>
                ) : editing ? (
                  <>
                    <input
                      className="pcInput pcEditInput"
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      onCompositionStart={() => setIsComposing(true)}
                      onCompositionEnd={() => {
                        setIsComposing(false);
                      }}
                      onKeyDown={(e) => {
                        if (e.key !== "Enter") return;
                        if (isComposing) return;
                        e.preventDefault();
                        submitEdit(); // ✅ Enter로 수정 반영
                      }}
                      placeholder="수정할 내용을 입력..."
                    />
                    <div className="pcActions">
                      <button className="pcBtn pcBtnSm" type="button" onClick={submitEdit}>
                        수정
                      </button>
                      <button className="pcBtn pcBtnSm pcGhost" type="button" onClick={cancelEdit}>
                        취소
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <span className="pcText">{c.text}</span>
                    {mine && (
                      <div className="pcActions">
                        <button className="pcBtn pcBtnSm" type="button" onClick={() => startEdit(c)}>
                          수정
                        </button>
                        <button
                          className="pcBtn pcBtnSm pcDanger"
                          type="button"
                          onClick={() => askDelete(c.id)}
                        >
                          삭제
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })
        )}
      </div>

      <div className="pcInputRow">
        <input
          key={inputKey} // ✅ IME 버퍼까지 초기화 (마지막 글자 남는 문제 해결 핵심)
          className="pcInput"
          placeholder={isLoggedIn ? "댓글 달기..." : "로그인 후 댓글을 작성할 수 있어요"}
          value={text}
          onChange={(e) => {
            // ✅ submit 직후 늦게 들어오는 조합 커밋이 text를 다시 살리는 걸 방지
            if (justSubmittedRef.current) return;
            setText(e.target.value);
          }}
          onCompositionStart={() => setIsComposing(true)}
          onCompositionEnd={(e) => {
            setIsComposing(false);
            // ✅ submit 직후 compositionend가 들어오는 케이스 방어
            if (justSubmittedRef.current) return;
            setText((e.target as HTMLInputElement).value);
          }}
          onKeyDown={(e) => {
            if (e.key !== "Enter") return;
            if (isComposing) return;
            e.preventDefault();
            submit();
          }}
          disabled={!isLoggedIn}
        />
        <button className="pcBtn" type="button" onClick={submit} disabled={!canPost}>
          게시
        </button>
      </div>
    </div>
  );
}