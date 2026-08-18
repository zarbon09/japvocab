import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getScene } from "../data/scenes";
import { markSeen } from "../lib/progress";
import { speakJapanese } from "../lib/speech";

export default function ScenePage() {
  const { id = "" } = useParams();
  const scene = getScene(id);
  const [selectedId, setSelectedId] = useState<string | null>(scene?.vocab[0]?.id ?? null);
  const [lineIndex, setLineIndex] = useState(0);
  const [tab, setTab] = useState<"explore" | "dialogue">("explore");

  const word = useMemo(
    () => scene?.vocab.find((v) => v.id === selectedId) ?? scene?.vocab[0],
    [scene, selectedId],
  );

  if (!scene || !word) {
    return <p>Scene not found.</p>;
  }

  const line = scene.dialogue[lineIndex];

  function pick(vocabId: string) {
    setSelectedId(vocabId);
    markSeen(vocabId);
    const v = scene!.vocab.find((x) => x.id === vocabId);
    if (v) speakJapanese(v.word);
  }

  return (
    <div>
      <p className="small">
        <Link to="/">Scenes</Link> / {scene.titleEn}
      </p>
      <h2 className="kana" style={{ fontSize: 32, margin: "6px 0 4px" }}>
        {scene.titleJp}
        <span className="sub" style={{ marginLeft: 10 }}>
          {scene.titleEn} · {scene.reading}
        </span>
      </h2>
      <div className="tabs">
        <button className={tab === "explore" ? "active" : ""} onClick={() => setTab("explore")}>
          Picture
        </button>
        <button className={tab === "dialogue" ? "active" : ""} onClick={() => setTab("dialogue")}>
          Dialogue
        </button>
        <Link to={`/scene/${scene.id}/practice`}>Practice</Link>
      </div>

      {tab === "explore" ? (
        <div className="scene-layout">
          <div className="scene-frame">
            <img src={scene.image} alt={scene.titleEn} />
            {scene.vocab.map((v) => (
              <button
                key={v.id}
                className={`hotspot ${selectedId === v.id ? "active" : ""}`}
                style={{ left: `${v.x}%`, top: `${v.y}%`, ["--spot" as string]: scene.accent }}
                title={v.english}
                onClick={() => pick(v.id)}
              />
            ))}
          </div>
          <aside className="panel">
            <p className="small">Tap a glowing spot on the picture</p>
            <p className="word-jp">{word.word}</p>
            <p className="reading">
              {word.reading} · {word.romaji}
            </p>
            <p style={{ fontSize: 20, margin: 0 }}>{word.english}</p>
            <p className="small">{word.partOfSpeech} · {word.hint}</p>
            <div className="example">
              <div>{word.exampleJp}</div>
              <div className="small">{word.exampleEn}</div>
            </div>
            <div className="actions">
              <button className="btn" onClick={() => speakJapanese(word.word)}>
                Hear word
              </button>
              <button className="btn ghost" onClick={() => speakJapanese(word.exampleJp)}>
                Hear sentence
              </button>
            </div>
          </aside>
        </div>
      ) : (
        <div className="scene-layout">
          <div className="dialogue">
            {scene.dialogue.map((d, i) => (
              <button
                key={i}
                className={`line ${i === lineIndex ? "current" : ""}`}
                onClick={() => {
                  setLineIndex(i);
                  speakJapanese(d.jp);
                  d.vocabIds.forEach(markSeen);
                  if (d.vocabIds[0]) setSelectedId(d.vocabIds[0]);
                }}
              >
                <div className="speaker">{d.speaker}</div>
                <div className="kana" style={{ fontSize: 18 }}>
                  {d.jp}
                </div>
                <div className="small">{d.reading}</div>
                <div>{d.en}</div>
              </button>
            ))}
          </div>
          <aside className="panel">
            <p className="small">Words in this line</p>
            {line.vocabIds.map((vid) => {
              const v = scene.vocab.find((x) => x.id === vid);
              if (!v) return null;
              return (
                <button
                  key={vid}
                  className="line"
                  style={{ width: "100%", marginBottom: 8 }}
                  onClick={() => pick(vid)}
                >
                  <strong>{v.word}</strong>
                  <div className="small">
                    {v.romaji} — {v.english}
                  </div>
                </button>
              );
            })}
            <button className="btn wide" onClick={() => speakJapanese(line.jp)}>
              Play line
            </button>
          </aside>
        </div>
      )}
    </div>
  );
}
