import { Link } from "react-router-dom";
import { allVocab, scenes } from "../data/scenes";
import { getProgress, mastery } from "../lib/progress";

export default function ReviewPage() {
  const words = allVocab()
    .map((w) => ({ ...w, progress: getProgress(w.id) }))
    .sort((a, b) => mastery(a.progress) - mastery(b.progress));

  return (
    <div>
      <h2 className="kana" style={{ fontSize: 32 }}>
        Review
      </h2>
      <p className="sub">Weak words first. Open a scene to see the picture again.</p>
      <div className="dialogue" style={{ marginTop: 18 }}>
        {words.map((w) => {
          const m = mastery(w.progress);
          const scene = scenes.find((s) => s.id === w.sceneId);
          return (
            <Link key={w.id} to={`/scene/${w.sceneId}`} className="line" style={{ display: "block" }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                <div>
                  <div className="kana" style={{ fontSize: 20 }}>
                    {w.word}
                  </div>
                  <div className="small">
                    {w.romaji} — {w.english} · {scene?.titleEn}
                  </div>
                </div>
                <div className="small">{m}%</div>
              </div>
              <div className="progress-bar">
                <span style={{ width: `${m}%`, background: scene?.accent }} />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
