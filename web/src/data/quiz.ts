import { quizWords, type VocabWord } from "./catalog";

export type PracticeMode = "MEANING" | "READING" | "MIXED";

export type QuizQuestion = {
  word: VocabWord;
  prompt: string;
  promptHint: string;
  options: string[];
  correctIndex: number;
};

function titleCase(value: string): string {
  return value.toLowerCase().replace(/^\w/, (c) => c.toUpperCase());
}

function meaningQuestion(word: VocabWord, pool: VocabWord[]): QuizQuestion {
  const distractors = pool
    .filter((w) => w.id !== word.id)
    .map((w) => titleCase(w.meaning))
    .filter((v, i, arr) => arr.indexOf(v) === i)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);
  const correct = titleCase(word.meaning);
  const options = [...distractors, correct].sort(() => Math.random() - 0.5);
  return {
    word,
    prompt: word.kanji,
    promptHint: "What does this mean?",
    options,
    correctIndex: options.indexOf(correct),
  };
}

function readingQuestion(word: VocabWord, pool: VocabWord[]): QuizQuestion {
  const distractors = pool
    .filter((w) => w.id !== word.id)
    .map((w) => w.hiragana)
    .filter((v, i, arr) => arr.indexOf(v) === i)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);
  const options = [...distractors, word.hiragana].sort(() => Math.random() - 0.5);
  return {
    word,
    prompt: word.kanji,
    promptHint: "Choose the reading (hiragana)",
    options,
    correctIndex: options.indexOf(word.hiragana),
  };
}

export function buildQuiz(mode: PracticeMode, count = 8): QuizQuestion[] {
  const pool = [...quizWords].sort(() => Math.random() - 0.5);
  return pool.slice(0, Math.min(count, pool.length)).map((word) => {
    if (mode === "MEANING") return meaningQuestion(word, pool);
    if (mode === "READING") return readingQuestion(word, pool);
    return Math.random() < 0.5
      ? meaningQuestion(word, pool)
      : readingQuestion(word, pool);
  });
}
