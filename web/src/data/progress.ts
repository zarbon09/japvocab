export type LearnerProgress = {
  viewedIds: string[];
  knownIds: string[];
  quizzesTaken: number;
  correctAnswers: number;
  answersAttempted: number;
  lastScorePercent: number;
};

const KEY = "n5-web-progress";

const empty: LearnerProgress = {
  viewedIds: [],
  knownIds: [],
  quizzesTaken: 0,
  correctAnswers: 0,
  answersAttempted: 0,
  lastScorePercent: 0,
};

export function loadProgress(): LearnerProgress {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return empty;
    return { ...empty, ...JSON.parse(raw) } as LearnerProgress;
  } catch {
    return empty;
  }
}

export function saveProgress(next: LearnerProgress) {
  localStorage.setItem(KEY, JSON.stringify(next));
}

export function markViewed(id: string, current: LearnerProgress): LearnerProgress {
  if (current.viewedIds.includes(id)) return current;
  const next = { ...current, viewedIds: [...current.viewedIds, id] };
  saveProgress(next);
  return next;
}

export function toggleKnown(id: string, current: LearnerProgress): LearnerProgress {
  const knownIds = current.knownIds.includes(id)
    ? current.knownIds.filter((x) => x !== id)
    : [...current.knownIds, id];
  const next = { ...current, knownIds };
  saveProgress(next);
  return next;
}

export function recordQuiz(
  current: LearnerProgress,
  correct: number,
  total: number,
): LearnerProgress {
  const next: LearnerProgress = {
    ...current,
    quizzesTaken: current.quizzesTaken + 1,
    correctAnswers: current.correctAnswers + correct,
    answersAttempted: current.answersAttempted + total,
    lastScorePercent: total === 0 ? 0 : Math.round((correct * 100) / total),
  };
  saveProgress(next);
  return next;
}
