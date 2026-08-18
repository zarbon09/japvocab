import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getScene, type Vocab } from "../data/scenes";
import { markQuiz } from "../lib/progress";
import { speakJapanese } from "../lib/speech";

function shuffle<T>(arr: T[]) {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function PracticePage() {
  const { id = "" } = useParams();
  const scene = getScene(id);
  const [mode, setMode] = useState<"cards" | "listen" | "cloze">("cards");

  if (!scene) return <p>Scene not found.</p>;

  return (
    <div>
      <p className="small">
        <Link to={`/scene/${scene.id}`}>{scene.titleEn}</Link> / practice
      </p>
      <h2 className="kana" style={{ fontSize: 32 }}>
        {scene.titleJp} drill
      </h2>
      <div className="tabs">
        <button className={mode === "cards" ? "active" : ""} onClick={() => setMode("cards")}>
          Flip cards
        </button>
        <button className={mode === "listen" ? "active" : ""} onClick={() => setMode("listen")}>
          Listen & pick
        </button>
        <button className={mode === "cloze" ? "active" : ""} onClick={() => setMode("cloze")}>
          Dialogue blanks
        </button>
      </div>
      {mode === "cards" && <CardDrill vocab={scene.vocab} />}
      {mode === "listen" && <ListenDrill vocab={scene.vocab} />}
      {mode === "cloze" && <ClozeDrill sceneId={scene.id} />}
    </div>
  );
}

function CardDrill({ vocab }: { vocab: Vocab[] }) {
  const [i, setI] = useState(0);
  const [show, setShow] = useState(false);
  const word = vocab[i];

  function next(ok: boolean) {
    markQuiz(word.id, ok);
    setShow(false);
    setI((n) => (n + 1) % vocab.length);
  }

  return (
    <div className="panel">
      <p className="small">
        {i + 1} / {vocab.length} · look at the picture cue, then flip
      </p>
      <div className="flash-card" onClick={() => setShow(true)}>
        {!show ? (
          <div>
            <p className="small">{word.hint}</p>
            <p style={{ fontSize: 28, margin: "8px 0 0" }}>{word.english}</p>
          </div>
        ) : (
          <div>
            <p className="word-jp">{word.word}</p>
            <p className="reading">
              {word.reading} · {word.romaji}
            </p>
          </div>
        )}
      </div>
      <div className="actions">
        <button className="btn ghost" onClick={() => speakJapanese(word.word)}>
          Hear
        </button>
        {show ? (
          <>
            <button className="btn ghost" onClick={() => next(false)}>
              Again
            </button>
            <button className="btn" onClick={() => next(true)}>
              Got it
            </button>
          </>
        ) : (
          <button className="btn" onClick={() => setShow(true)}>
            Flip
          </button>
        )}
      </div>
    </div>
  );
}

function ListenDrill({ vocab }: { vocab: Vocab[] }) {
  const [round, setRound] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);

  const target = vocab[round % vocab.length];
  const options = useMemo(() => {
    const others = shuffle(vocab.filter((v) => v.id !== target.id)).slice(0, 3);
    return shuffle([target, ...others]);
  }, [round, vocab, target]);

  function choose(v: Vocab) {
    if (picked) return;
    const ok = v.id === target.id;
    setPicked(v.id);
    markQuiz(target.id, ok);
  }

  return (
    <div className="panel">
      <p className="small">Hear the Japanese, then choose the English meaning.</p>
      <button className="btn" onClick={() => speakJapanese(target.word)}>
        Play audio
      </button>
      <div className="quiz-options">
        {options.map((v) => {
          let cls = "";
          if (picked) {
            if (v.id === target.id) cls = "ok";
            else if (v.id === picked) cls = "bad";
          }
          return (
            <button key={v.id} className={cls} onClick={() => choose(v)}>
              {v.english}
            </button>
          );
        })}
      </div>
      {picked && (
        <div className="actions">
          <button
            className="btn"
            onClick={() => {
              setPicked(null);
              setRound((r) => r + 1);
            }}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

function ClozeDrill({ sceneId }: { sceneId: string }) {
  const scene = getScene(sceneId)!;
  const lines = scene.dialogue.filter((d) => d.vocabIds.length > 0);
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const line = lines[i % lines.length];
  const answer = scene.vocab.find((v) => v.id === line.vocabIds[0])!;
  const blanked = line.jp.replace(answer.word, "＿＿＿");
  const options = useMemo(() => {
    const others = shuffle(scene.vocab.filter((v) => v.id !== answer.id)).slice(0, 3);
    return shuffle([answer, ...others]);
  }, [i, scene.vocab, answer]);

  return (
    <div className="panel">
      <p className="small">Fill the missing word from the conversation.</p>
      <p className="speaker">{line.speaker}</p>
      <p className="kana" style={{ fontSize: 22 }}>
        {blanked.includes("＿＿＿") ? blanked : `＿＿＿（${line.jp}）`}
      </p>
      <p className="small">{line.en}</p>
      <div className="quiz-options">
        {options.map((v) => {
          let cls = "";
          if (picked) {
            if (v.id === answer.id) cls = "ok";
            else if (v.id === picked) cls = "bad";
          }
          return (
            <button
              key={v.id}
              className={cls}
              onClick={() => {
                if (picked) return;
                setPicked(v.id);
                markQuiz(answer.id, v.id === answer.id);
              }}
            >
              {v.word} · {v.english}
            </button>
          );
        })}
      </div>
      {picked && (
        <button
          className="btn"
          style={{ marginTop: 12 }}
          onClick={() => {
            setPicked(null);
            setI((n) => n + 1);
          }}
        >
          Next line
        </button>
      )}
    </div>
  );
}
