import { Link } from "react-router-dom";
import { scenes } from "../data/scenes";
import { statsFor } from "../lib/progress";

export default function Home() {
  const allIds = scenes.flatMap((s) => s.vocab.map((v) => v.id));
  const global = statsFor(allIds);

  return (
    <>
      <section className="hero">
        <div>
          <h2>See the word. Hear the scene. Speak the line.</h2>
          <p>
            Learn Japanese vocabulary inside illustrated places — tap objects in a café, station,
            kitchen, konbini, or park, then practise the same words in a short dialogue.
          </p>
        </div>
        <div className="stat-card">
          <span className="small">Words you’ve touched</span>
          <strong>
            {global.seen} / {global.total}
          </strong>
          <span className="small">{global.mastered} feeling solid (70%+ quiz)</span>
        </div>
      </section>
      <div className="scene-grid">
        {scenes.map((scene) => {
          const stats = statsFor(scene.vocab.map((v) => v.id));
          const pct = Math.round((stats.seen / stats.total) * 100);
          return (
            <Link key={scene.id} to={`/scene/${scene.id}`} className="scene-card">
              <img src={scene.image} alt={scene.titleEn} />
              <div className="meta">
                <div className="kana">{scene.titleJp}</div>
                <div className="sub">
                  {scene.titleEn} · {scene.reading} · {scene.vocab.length} words
                </div>
                <p className="sub">{scene.summary}</p>
                <div className="progress-bar" style={{ ["--accent" as string]: scene.accent }}>
                  <span style={{ width: `${pct}%`, background: scene.accent }} />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}
