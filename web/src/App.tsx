import { useMemo, useState } from "react";
import { wordById, words, type VocabWord } from "./data/catalog";
import {
  loadProgress,
  markViewed,
  recordQuiz,
  toggleKnown,
  type LearnerProgress,
} from "./data/progress";
import { buildQuiz, type PracticeMode, type QuizQuestion } from "./data/quiz";

type Tab = "learn" | "practice" | "progress";

function highlightText(text: string, hits: string[]) {
  if (!hits.length) return text;
  const pattern = hits
    .map((h) => h.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("|");
  const re = new RegExp(`(${pattern})`, "gi");
  return text.split(re).map((part, i) =>
    hits.some((h) => h.toLowerCase() === part.toLowerCase()) ? (
      <em className="em" key={`${part}-${i}`}>
        {part}
      </em>
    ) : (
      part
    ),
  );
}

function Furigana({ word }: { word: VocabWord["examples"][number] }) {
  return (
    <div className="ruby">
      {word.tokens.map((t, i) => (
        <span key={`${t.text}-${i}`}>
          <small>{t.reading ?? ""}</small>
          {t.highlight ? <b>{t.text}</b> : <i>{t.text}</i>}
        </span>
      ))}
    </div>
  );
}

function LearnList({
  progress,
  onOpen,
}: {
  progress: LearnerProgress;
  onOpen: (id: string) => void;
}) {
  const [category, setCategory] = useState("From your PDF");
  const chips = ["All", "Starter cards", "From your PDF"];
  const visible = words.filter((w) => {
    if (category === "All") return true;
    if (category === "Starter cards") return !w.fullCard;
    if (category === "From your PDF") return Boolean(w.fullCard);
    return w.category === category;
  });

  return (
    <section>
      <div className="top-label">JLPT N5</div>
      <h1>Learn</h1>
      <p className="muted">
        Open a card. PDF cards show the picture from your book. Starter cards have kanji, memory tips, and sentences.
      </p>
      <div className="chips">
        {chips.map((name) => (
          <button
            key={name}
            className={category === name ? "on" : ""}
            onClick={() => setCategory(name)}
            type="button"
          >
            {name}
          </button>
        ))}
      </div>
      {visible.map((word) => (
        <button
          className="card-row"
          key={word.id}
          onClick={() => onOpen(word.id)}
          type="button"
        >
          <img alt="" className="thumb" src={word.sceneImage} />
          <div className="kanji-box">{word.kanji}</div>
          <div>
            <div className="top-label">{word.hiragana}</div>
            <div className="meaning">{word.meaning}</div>
            <div className="muted">{word.romaji}</div>
          </div>
          <div className="row-meta">
            {word.category}
            <div>
              {progress.knownIds.includes(word.id)
                ? "known"
                : progress.viewedIds.includes(word.id)
                  ? "opened"
                  : ""}
            </div>
          </div>
        </button>
      ))}
    </section>
  );
}

function WordCard({
  word,
  known,
  onBack,
  onToggle,
}: {
  word: VocabWord;
  known: boolean;
  onBack: () => void;
  onToggle: () => void;
}) {
  if (word.fullCard) {
    return (
      <article>
        <button className="back" onClick={onBack} type="button">
          ← Back
        </button>
        <div className="top-label">JLPT N5 · from your PDF</div>
        <h1 style={{ fontSize: 28 }}>
          {word.kanji === "N5" ? "Picture card" : word.kanji}
        </h1>
        <p className="muted">{word.meaning}</p>
        <div className="scene">
          <img alt={word.meaning} className="scene-art full-card" src={word.sceneImage} />
        </div>
        <p className="muted">{word.mnemonicBody}</p>
        <button className="primary" onClick={onToggle} type="button">
          {known ? "Marked as known" : "Mark as known"}
        </button>
      </article>
    );
  }

  return (
    <article>
      <button className="back" onClick={onBack} type="button">
        ← Back
      </button>
      <div className="hero" style={{ background: `${word.sceneTint}38` }}>
        <span className="ribbon">JLPT N5</span>
        <div className="top-label" style={{ marginTop: 8 }}>
          {word.hiragana}
        </div>
        <div className="huge">{word.kanji}</div>
        <div className="pill">{word.romaji}</div>
        <h2>{word.meaning}</h2>
      </div>
      <div className="scene">
        <img alt={word.meaning} className="scene-art" src={word.sceneImage} />
        <div className="bubble">
          {highlightText(word.sceneCaption, word.sceneHighlightWords)}
        </div>
      </div>
      <div className="panel">
        <span className="tip-label">MEMORY TIP</span>
        <h3 style={{ color: "var(--green-dark)" }}>{word.mnemonicHook}</h3>
        <p>{word.mnemonicBody}</p>
      </div>
      <div className="panel ex-box">
        <span className="ex-bar">EXAMPLE SENTENCES</span>
        {word.examples.map((ex, i) => (
          <div className="example" key={`${word.id}-ex-${i}`}>
            <strong style={{ color: "var(--pink)" }}>{i + 1}.</strong>
            <Furigana word={ex} />
            <p>{highlightText(ex.english, [ex.englishHighlight])}</p>
          </div>
        ))}
      </div>
      <button className="primary" onClick={onToggle} type="button">
        {known ? "Marked as known" : "Mark as known"}
      </button>
    </article>
  );
}

function PracticeHome({ onStart }: { onStart: (mode: PracticeMode) => void }) {
  return (
    <section>
      <div className="top-label">JLPT N5</div>
      <h1>Practice</h1>
      <p className="muted">
        8 quick questions. Tap an answer, then see if you were right.
      </p>
      {(
        [
          ["MEANING", "Meaning quiz", "See the kanji. Pick the English meaning."],
          ["READING", "Reading quiz", "See the kanji. Pick the hiragana reading."],
          ["MIXED", "Mixed quiz", "A mix of meaning and reading questions."],
        ] as const
      ).map(([mode, title, body]) => (
        <button
          className="mode-card"
          key={mode}
          onClick={() => onStart(mode)}
          type="button"
        >
          <div className="meaning">{title}</div>
          <p className="muted">{body}</p>
          <div className="top-label">Start →</div>
        </button>
      ))}
    </section>
  );
}

function QuizView({
  questions,
  onDone,
  onClose,
}: {
  questions: QuizQuestion[];
  onDone: (correct: number, total: number) => void;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);
  const question = questions[index];
  const answered = selected !== null;

  if (finished || !question) {
    const percent =
      questions.length === 0 ? 0 : Math.round((correctCount * 100) / questions.length);
    return (
      <div className="center">
        <h1>Quiz complete</h1>
        <div className="score">
          {correctCount} / {questions.length}
        </div>
        <p className="muted">{percent}%</p>
        <button
          className="primary"
          onClick={() => onDone(correctCount, questions.length)}
          type="button"
        >
          Save and return
        </button>
      </div>
    );
  }

  return (
    <section>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <strong className="top-label">
          Question {index + 1} / {questions.length}
        </strong>
        <button className="ghost" onClick={onClose} type="button">
          Exit
        </button>
      </div>
      <div className="progress-bar">
        <span style={{ width: `${((index + 1) / questions.length) * 100}%` }} />
      </div>
      <div className="panel" style={{ textAlign: "center" }}>
        <div className="muted">{question.promptHint}</div>
        <div className="prompt-kanji">{question.prompt}</div>
      </div>
      {question.options.map((label, optionIndex) => {
        const isCorrect = optionIndex === question.correctIndex;
        const isPicked = selected === optionIndex;
        const cls =
          !answered ? "" : isCorrect ? "correct" : isPicked ? "wrong" : "";
        return (
          <button
            className={`option ${cls}`}
            disabled={answered}
            key={label}
            onClick={() => {
              setSelected(optionIndex);
              if (isCorrect) setCorrectCount((n) => n + 1);
            }}
            type="button"
          >
            {label}
          </button>
        );
      })}
      {answered ? (
        <button
          className="primary"
          onClick={() => {
            if (index === questions.length - 1) setFinished(true);
            else {
              setIndex((n) => n + 1);
              setSelected(null);
            }
          }}
          type="button"
        >
          {index === questions.length - 1 ? "See score" : "Next"}
        </button>
      ) : null}
    </section>
  );
}

function ProgressView({ progress }: { progress: LearnerProgress }) {
  const total = words.length;
  const viewed = Math.min(progress.viewedIds.length, total);
  const known = Math.min(progress.knownIds.length, total);
  const accuracy =
    progress.answersAttempted === 0
      ? 0
      : Math.round((progress.correctAnswers * 100) / progress.answersAttempted);
  const nextTip =
    viewed === 0
      ? "Open Learn and study your first card. Start with 雨 (rain)."
      : known < 5
        ? "Keep opening cards, then mark the ones you remember as known."
        : progress.quizzesTaken === 0
          ? "You have studied a few words. Try a Practice quiz next."
          : accuracy < 70
            ? "Review cards you missed, then take the mixed quiz again."
            : "Nice work. Revisit Practice, then add more N5 words later.";

  return (
    <section>
      <div className="top-label">JLPT N5</div>
      <h1>Progress</h1>
      <div className="stat">
        <div className="muted">Cards opened</div>
        <div className="meaning">
          {viewed} / {total}
        </div>
        <div className="progress-bar">
          <span style={{ width: `${(viewed / total) * 100}%` }} />
        </div>
      </div>
      <div className="stat">
        <div className="muted">Marked known</div>
        <div className="meaning">
          {known} / {total}
        </div>
        <div className="progress-bar">
          <span style={{ width: `${(known / total) * 100}%` }} />
        </div>
      </div>
      <div className="stat">
        <div className="muted">Quiz accuracy</div>
        <div className="meaning">{accuracy}%</div>
        <div className="progress-bar">
          <span style={{ width: `${accuracy}%` }} />
        </div>
      </div>
      <div className="stats-row">
        <div className="stat">
          <div className="muted">Quizzes</div>
          <div className="meaning">{progress.quizzesTaken}</div>
        </div>
        <div className="stat">
          <div className="muted">Last score</div>
          <div className="meaning">{progress.lastScorePercent}%</div>
        </div>
      </div>
      <div className="panel">
        <div className="meaning">What to do next</div>
        <p>{nextTip}</p>
      </div>
    </section>
  );
}

export default function App() {
  const [tab, setTab] = useState<Tab>("learn");
  const [wordId, setWordId] = useState<string | null>(null);
  const [quiz, setQuiz] = useState<QuizQuestion[] | null>(null);
  const [progress, setProgress] = useState<LearnerProgress>(() => loadProgress());
  const word = wordId ? wordById(wordId) : undefined;

  const openWord = (id: string) => {
    setWordId(id);
    setProgress((p) => markViewed(id, p));
  };

  const quizKey = useMemo(() => quiz?.map((q) => q.word.id).join("-") ?? "", [quiz]);

  return (
    <div className="app">
      {tab === "learn" && !word && <LearnList onOpen={openWord} progress={progress} />}
      {tab === "learn" && word && (
        <WordCard
          known={progress.knownIds.includes(word.id)}
          onBack={() => setWordId(null)}
          onToggle={() => setProgress((p) => toggleKnown(word.id, p))}
          word={word}
        />
      )}
      {tab === "practice" && !quiz && (
        <PracticeHome
          onStart={(mode) => {
            setQuiz(buildQuiz(mode));
          }}
        />
      )}
      {tab === "practice" && quiz && (
        <QuizView
          key={quizKey}
          onClose={() => setQuiz(null)}
          onDone={(correct, total) => {
            setProgress((p) => recordQuiz(p, correct, total));
            setQuiz(null);
            setTab("progress");
          }}
          questions={quiz}
        />
      )}
      {tab === "progress" && <ProgressView progress={progress} />}

      <nav className="tabs">
        {(
          [
            ["learn", "Learn"],
            ["practice", "Practice"],
            ["progress", "Progress"],
          ] as const
        ).map(([id, label]) => (
          <button
            className={tab === id ? "active" : ""}
            key={id}
            onClick={() => {
              setTab(id);
              setWordId(null);
              setQuiz(null);
            }}
            type="button"
          >
            {label}
          </button>
        ))}
      </nav>
    </div>
  );
}
