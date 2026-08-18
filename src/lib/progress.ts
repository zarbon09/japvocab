const KEY = "mira-progress-v1";

export type WordProgress = {
  seen: number;
  correct: number;
  wrong: number;
  last: number;
};

type Store = Record<string, WordProgress>;

function read(): Store {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "{}") as Store;
  } catch {
    return {};
  }
}

function write(store: Store) {
  localStorage.setItem(KEY, JSON.stringify(store));
}

export function getProgress(id: string): WordProgress {
  return read()[id] ?? { seen: 0, correct: 0, wrong: 0, last: 0 };
}

export function markSeen(id: string) {
  const store = read();
  const cur = store[id] ?? { seen: 0, correct: 0, wrong: 0, last: 0 };
  store[id] = { ...cur, seen: cur.seen + 1, last: Date.now() };
  write(store);
}

export function markQuiz(id: string, ok: boolean) {
  const store = read();
  const cur = store[id] ?? { seen: 0, correct: 0, wrong: 0, last: 0 };
  store[id] = {
    seen: cur.seen + 1,
    correct: cur.correct + (ok ? 1 : 0),
    wrong: cur.wrong + (ok ? 0 : 1),
    last: Date.now(),
  };
  write(store);
}

export function mastery(p: WordProgress) {
  if (p.seen === 0) return 0;
  const ratio = p.correct / Math.max(1, p.correct + p.wrong);
  const exposure = Math.min(1, p.seen / 6);
  return Math.round(ratio * exposure * 100);
}

export function statsFor(ids: string[]) {
  const store = read();
  let seen = 0;
  let mastered = 0;
  for (const id of ids) {
    const p = store[id];
    if (!p) continue;
    if (p.seen > 0) seen += 1;
    if (mastery(p) >= 70) mastered += 1;
  }
  return { seen, mastered, total: ids.length };
}
