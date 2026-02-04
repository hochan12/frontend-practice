// client/src/state/storage.ts
export function loadJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function saveJSON<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function uid(prefix = "id") {
  return `${prefix}_${Math.random().toString(36).slice(2)}_${Date.now()}`;
}

export function maskNickname(nick: string) {
  // "fashion" -> "f****"
  if (!nick) return "";
  if (nick.length <= 1) return "*";
  const first = nick[0];
  return first + "*".repeat(Math.min(6, Math.max(1, nick.length - 1)));
}