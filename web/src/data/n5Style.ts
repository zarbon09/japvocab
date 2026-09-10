function hash(text: string): number {
  let h = 2166136261;
  for (const ch of text) {
    h ^= ch.charCodeAt(0);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function pick<T>(items: T[], n: number): T {
  const item = items[n % items.length];
  if (item === undefined) {
    throw new Error("pick() needs a non-empty list");
  }
  return item;
}

const MORA_SOUND: Record<string, string> = {
  あ: "AH",
  い: "EE",
  う: "OO",
  え: "EH",
  お: "OH",
  か: "CAR",
  き: "KEY",
  く: "COO",
  け: "KAY",
  こ: "CO",
  さ: "SAW",
  し: "SHE",
  す: "SUE",
  せ: "SAY",
  そ: "SO",
  た: "TA",
  ち: "CHEE",
  つ: "TWO",
  て: "TAY",
  と: "TOE",
  な: "NAH",
  に: "KNEE",
  ぬ: "NEW",
  ね: "NEIGH",
  の: "NO",
  は: "HA",
  ひ: "HE",
  ふ: "FOO",
  へ: "HEY",
  ほ: "HOE",
  ま: "MA",
  み: "ME",
  む: "MOO",
  め: "MAY",
  も: "MOE",
  や: "YA",
  ゆ: "YOU",
  よ: "YO",
  ら: "RAH",
  り: "REE",
  る: "RUE",
  れ: "RAY",
  ろ: "ROW",
  わ: "WAH",
  を: "WO",
  ん: "N",
  が: "GA",
  ぎ: "GEE",
  ぐ: "GOO",
  げ: "GAY",
  ご: "GO",
  ざ: "ZA",
  じ: "GEE",
  ず: "ZOO",
  ぜ: "ZAY",
  ぞ: "ZO",
  だ: "DAH",
  ぢ: "GEE",
  づ: "DOO",
  で: "DAY",
  ど: "DOE",
  ば: "BAH",
  び: "BEE",
  ぶ: "BOO",
  べ: "BAY",
  ぼ: "BOW",
  ぱ: "PAH",
  ぴ: "PEA",
  ぷ: "POO",
  ぺ: "PAY",
  ぽ: "POE",
  きゃ: "CAT",
  きゅ: "CUE",
  きょ: "KYO",
  しゃ: "SHA",
  しゅ: "SHOE",
  しょ: "SHOW",
  ちゃ: "CHA",
  ちゅ: "CHEW",
  ちょ: "CHO",
  にゃ: "NYA",
  にゅ: "NEW",
  にょ: "NYO",
  ひゃ: "HYA",
  ひゅ: "HUE",
  ひょ: "HYO",
  みゃ: "MYA",
  みゅ: "MULE",
  みょ: "MYO",
  りゃ: "RYA",
  りゅ: "RUE",
  りょ: "RIO",
  ぎゃ: "GYA",
  ぎゅ: "GOO",
  ぎょ: "GYO",
  じゃ: "JA",
  じゅ: "JEW",
  じょ: "JOE",
  びゃ: "BYA",
  びゅ: "VIEW",
  びょ: "BYO",
  ぴゃ: "PYA",
  ぴゅ: "PEW",
  ぴょ: "PYO",
  っ: "T-",
  ー: "",
};

function morae(hira: string): string[] {
  const chars = [...hira];
  const small = new Set(["ゃ", "ゅ", "ょ", "ぁ", "ぃ", "ぅ", "ぇ", "ぉ"]);
  const out: string[] = [];
  for (let i = 0; i < chars.length; i += 1) {
    const cur = chars[i];
    if (!cur) continue;
    const next = chars[i + 1];
    if (next && small.has(next)) {
      out.push(cur + next);
      i += 1;
      continue;
    }
    out.push(cur);
  }
  return out;
}

function soundPhrase(hira: string, romaji: string): string {
  const parts = morae(hira)
    .map((m) => MORA_SOUND[m] ?? m.toUpperCase())
    .filter((p) => p.length > 0);
  if (parts.length === 0) return romaji.toUpperCase();
  return parts.join("-");
}

export type N5Style = {
  hook: string;
  body: string;
  caption: string;
  highlights: string[];
  tint: string;
  image: string;
};

const SKY = ["#8ecae6", "#bde0fe", "#ffd6a5", "#c8b6ff", "#90e0ef", "#ffc8dd", "#b8e0d2"];
const HAIR = ["#3d2914", "#1d1d1d", "#7a4b27", "#c45c26", "#5c3a24", "#2f4a6e"];
const SHIRT = ["#2f7a45", "#e8a0b4", "#0f4c81", "#e8c15a", "#c45c26", "#6b3fa0", "#215533"];
const TINTS = ["#7ba7c9", "#c45c26", "#2f6b4f", "#6b3fa0", "#b42318", "#875400", "#0f4c81"];

type Kit =
  | "rain"
  | "point"
  | "house"
  | "bath"
  | "food"
  | "time"
  | "car"
  | "train"
  | "school"
  | "tree"
  | "shop"
  | "cat"
  | "dog"
  | "book"
  | "phone"
  | "money"
  | "clothes"
  | "night"
  | "question"
  | "yes"
  | "walk"
  | "sea"
  | "snow"
  | "hot"
  | "cold"
  | "work"
  | "play"
  | "family"
  | "default";

function kitFor(meaning: string): Kit {
  const m = meaning.toLowerCase();
  if (/rain|umbrella/.test(m)) return "rain";
  if (/there|here|that|this|where|which|who|what/.test(m)) return "point";
  if (/house|home|apartment|room|hotel|building|door|window|kitchen/.test(m)) return "house";
  if (/bath|shower|toilet|wash/.test(m)) return "bath";
  if (/eat|food|rice|bread|meat|fish|fruit|tea|coffee|lunch|dinner|breakfast|delicious|restaurant|kitchen|cup|bowl|plate|chopstick/.test(m)) {
    return "food";
  }
  if (/time|day|week|year|hour|clock|watch|morning|night|evening|today|tomorrow|yesterday|month|always/.test(m)) {
    return "time";
  }
  if (/car|taxi|bus|bicycle/.test(m)) return "car";
  if (/train|station|ticket/.test(m)) return "train";
  if (/school|study|learn|student|class|homework|teacher|book|library|dictionary/.test(m)) {
    return "school";
  }
  if (/tree|mountain|park|flower|garden|village|sky/.test(m)) return "tree";
  if (/shop|store|buy|sell|shopping/.test(m)) return "shop";
  if (/cat/.test(m)) return "cat";
  if (/dog|animal|pet/.test(m)) return "dog";
  if (/book|magazine|newspaper|letter|page/.test(m)) return "book";
  if (/phone|call|television|radio|camera/.test(m)) return "phone";
  if (/money|bank|cheap|expensive|buy/.test(m)) return "money";
  if (/wear|clothes|shirt|coat|hat|shoes|skirt/.test(m)) return "clothes";
  if (/night|evening|dark|moon/.test(m)) return "night";
  if (/how|why|what|which|who|question/.test(m)) return "question";
  if (/\byes\b|\bgood\b|\ball right\b|please|thanks/.test(m)) return "yes";
  if (/walk|run|go|come|return/.test(m)) return "walk";
  if (/sea|swim|fish|water/.test(m)) return "sea";
  if (/snow|cold|winter|ice/.test(m)) return "snow";
  if (/hot|summer|sunny|warm/.test(m)) return "hot";
  if (/work|job|office|company/.test(m)) return "work";
  if (/play|sport|game|hobby/.test(m)) return "play";
  if (/mother|father|family|brother|sister|child|friend|wife|grandmother|grandfather|aunt/.test(m)) {
    return "family";
  }
  return "default";
}

function propSvg(kit: Kit, accent: string): string {
  switch (kit) {
    case "rain":
      return `<g>
        <line x1="80" y1="20" x2="70" y2="70" stroke="#7ba7c9" stroke-width="3"/>
        <line x1="140" y1="10" x2="128" y2="80" stroke="#7ba7c9" stroke-width="3"/>
        <line x1="210" y1="24" x2="198" y2="90" stroke="#7ba7c9" stroke-width="3"/>
        <path d="M430 150 q70 -70 140 0" fill="#e8f4ff" stroke="#7ba7c9" stroke-width="6"/>
        <line x1="500" y1="150" x2="500" y2="230" stroke="#7ba7c9" stroke-width="6"/>
      </g>`;
    case "point":
      return `<g>
        <path d="M160 210 l90 -40 l-20 18 l40 8 z" fill="${accent}"/>
        <circle cx="150" cy="80" r="26" fill="#fff" stroke="${accent}" stroke-width="6"/>
      </g>`;
    case "house":
      return `<g>
        <rect x="90" y="160" width="160" height="130" rx="8" fill="#f6f1e4" stroke="#5c3a24" stroke-width="5"/>
        <polygon points="80,160 170,90 260,160" fill="#c45c26"/>
        <rect x="150" y="210" width="40" height="80" fill="#7ba7c9"/>
      </g>`;
    case "bath":
      return `<g>
        <ellipse cx="180" cy="250" rx="90" ry="28" fill="#90e0ef"/>
        <rect x="100" y="200" width="160" height="50" rx="18" fill="#bde0fe"/>
        <circle cx="140" cy="190" r="10" fill="#fff"/>
        <circle cx="170" cy="180" r="8" fill="#fff"/>
        <circle cx="200" cy="188" r="11" fill="#fff"/>
      </g>`;
    case "food":
      return `<g>
        <ellipse cx="180" cy="240" rx="70" ry="18" fill="#d9c7a8"/>
        <ellipse cx="180" cy="220" rx="48" ry="16" fill="#f6f1e4" stroke="${accent}" stroke-width="5"/>
        <circle cx="180" cy="214" r="14" fill="#e8c15a"/>
      </g>`;
    case "time":
      return `<g>
        <circle cx="170" cy="150" r="54" fill="#fffbf3" stroke="${accent}" stroke-width="8"/>
        <line x1="170" y1="150" x2="170" y2="112" stroke="#2b2b2b" stroke-width="6"/>
        <line x1="170" y1="150" x2="204" y2="150" stroke="#2b2b2b" stroke-width="5"/>
      </g>`;
    case "car":
      return `<g>
        <rect x="80" y="210" width="170" height="46" rx="16" fill="${accent}"/>
        <rect x="110" y="188" width="90" height="30" rx="10" fill="#dcefdd"/>
        <circle cx="120" cy="258" r="16" fill="#2b2b2b"/>
        <circle cx="210" cy="258" r="16" fill="#2b2b2b"/>
      </g>`;
    case "train":
      return `<g>
        <rect x="70" y="150" width="200" height="90" rx="16" fill="${accent}"/>
        <rect x="90" y="168" width="44" height="36" fill="#bde0fe"/>
        <rect x="150" y="168" width="44" height="36" fill="#bde0fe"/>
        <rect x="210" y="168" width="44" height="36" fill="#bde0fe"/>
        <rect x="40" y="248" width="260" height="10" fill="#5c3a24"/>
      </g>`;
    case "school":
      return `<g>
        <rect x="80" y="140" width="170" height="120" fill="#f6f1e4" stroke="#215533" stroke-width="5"/>
        <rect x="100" y="160" width="40" height="30" fill="#8ecae6"/>
        <rect x="160" y="160" width="40" height="30" fill="#8ecae6"/>
        <rect x="145" y="200" width="36" height="60" fill="#c45c26"/>
      </g>`;
    case "tree":
      return `<g>
        <rect x="160" y="190" width="22" height="80" fill="#7a4b27"/>
        <circle cx="170" cy="170" r="48" fill="#2f7a45"/>
        <circle cx="140" cy="190" r="32" fill="#215533"/>
      </g>`;
    case "shop":
      return `<g>
        <rect x="90" y="170" width="170" height="110" fill="#fffbf3" stroke="#c45c26" stroke-width="5"/>
        <rect x="80" y="150" width="190" height="28" fill="#e8a0b4"/>
        <rect x="155" y="210" width="40" height="70" fill="#7ba7c9"/>
      </g>`;
    case "cat":
      return `<g>
        <ellipse cx="170" cy="230" rx="40" ry="28" fill="#f0c27a"/>
        <circle cx="150" cy="200" r="22" fill="#f0c27a"/>
        <polygon points="136,186 142,164 154,186" fill="#f0c27a"/>
        <polygon points="164,186 176,164 186,186" fill="#f0c27a"/>
      </g>`;
    case "dog":
      return `<g>
        <ellipse cx="180" cy="236" rx="48" ry="26" fill="#c4a484"/>
        <circle cx="230" cy="214" r="20" fill="#c4a484"/>
        <ellipse cx="246" cy="222" rx="10" ry="6" fill="#5c3a24"/>
      </g>`;
    case "book":
      return `<g>
        <rect x="120" y="160" width="90" height="110" rx="6" fill="${accent}"/>
        <rect x="128" y="168" width="74" height="94" fill="#fffbf3"/>
      </g>`;
    case "phone":
      return `<g>
        <rect x="150" y="150" width="50" height="90" rx="12" fill="#2b2b2b"/>
        <rect x="158" y="162" width="34" height="58" fill="#8ecae6"/>
      </g>`;
    case "money":
      return `<g>
        <circle cx="160" cy="200" r="34" fill="#e8c15a"/>
        <text x="160" y="210" text-anchor="middle" font-size="28" font-weight="700" fill="#875400">¥</text>
      </g>`;
    case "clothes":
      return `<g>
        <path d="M140 160 l30 -20 l30 20 v70 h-60 z" fill="${accent}"/>
        <line x1="120" y1="148" x2="220" y2="148" stroke="#5c3a24" stroke-width="6"/>
      </g>`;
    case "night":
      return `<g>
        <circle cx="160" cy="90" r="36" fill="#ffeaa7"/>
        <circle cx="148" cy="82" r="28" fill="#3d405b"/>
      </g>`;
    case "question":
      return `<g>
        <text x="160" y="180" font-size="96" font-weight="800" fill="${accent}">?</text>
      </g>`;
    case "yes":
      return `<g>
        <circle cx="170" cy="180" r="40" fill="#dcefdd" stroke="#2f7a45" stroke-width="8"/>
        <path d="M150 180 l14 14 l28 -28" fill="none" stroke="#2f7a45" stroke-width="8" stroke-linecap="round"/>
      </g>`;
    case "walk":
      return `<g>
        <path d="M90 260 q80 -70 170 0" fill="none" stroke="${accent}" stroke-width="10" stroke-dasharray="12 10"/>
      </g>`;
    case "sea":
      return `<g>
        <path d="M40 240 q40 20 80 0 q40 -20 80 0 q40 20 80 0 q40 -20 80 0 v40 h-320 z" fill="#4ea8de"/>
      </g>`;
    case "snow":
      return `<g>
        <circle cx="120" cy="70" r="6" fill="#fff"/>
        <circle cx="200" cy="50" r="7" fill="#fff"/>
        <circle cx="280" cy="90" r="5" fill="#fff"/>
        <circle cx="90" cy="120" r="6" fill="#fff"/>
        <circle cx="240" cy="130" r="8" fill="#fff"/>
      </g>`;
    case "hot":
      return `<g>
        <circle cx="170" cy="80" r="40" fill="#ffd166"/>
        <circle cx="170" cy="80" r="22" fill="#ffb703"/>
      </g>`;
    case "cold":
      return `<g>
        <path d="M170 110 v80" stroke="#8ecae6" stroke-width="8"/>
        <path d="M140 140 h60" stroke="#8ecae6" stroke-width="8"/>
        <path d="M150 170 l40 20" stroke="#8ecae6" stroke-width="6"/>
      </g>`;
    case "work":
      return `<g>
        <rect x="120" y="180" width="90" height="60" rx="8" fill="#5c3a24"/>
        <rect x="148" y="168" width="34" height="16" fill="#c4a484"/>
      </g>`;
    case "play":
      return `<g>
        <circle cx="160" cy="210" r="28" fill="${accent}"/>
        <circle cx="210" cy="230" r="18" fill="#e8c15a"/>
      </g>`;
    case "family":
      return `<g>
        <circle cx="130" cy="190" r="22" fill="#ffd9b3"/>
        <rect x="114" y="212" width="32" height="36" rx="8" fill="#0f4c81"/>
        <circle cx="190" cy="198" r="18" fill="#ffd9b3"/>
        <rect x="176" y="216" width="28" height="30" rx="8" fill="#e8a0b4"/>
      </g>`;
    default:
      return `<g>
        <circle cx="170" cy="200" r="44" fill="${accent}"/>
        <circle cx="170" cy="200" r="22" fill="#fffbf3"/>
      </g>`;
  }
}

function hairSvg(color: string, variant: number): string {
  if (variant % 3 === 0) {
    return `<path d="M-34 0 q34 -48 68 0 v18 q-34 10 -68 0 z" fill="${color}"/>`;
  }
  if (variant % 3 === 1) {
    return `<path d="M-36 8 q0 -52 36 -52 q36 0 36 52 q-18 -16 -36 -8 q-18 -8 -36 8z" fill="${color}"/>`;
  }
  return `<path d="M-30 -4 q30 -40 60 0 q8 20 -8 28 q-22 -18 -44 0 q-16 -8 -8 -28z" fill="${color}"/>`;
}

function chibi(x: number, y: number, hair: string, shirt: string, variant: number): string {
  return `<g transform="translate(${x} ${y})">
    <ellipse cx="0" cy="118" rx="30" ry="10" fill="#00000022"/>
    ${hairSvg(hair, variant)}
    <circle cx="0" cy="10" r="30" fill="#ffd9b3"/>
    <circle cx="-10" cy="8" r="5.5" fill="#2b2b2b"/>
    <circle cx="10" cy="8" r="5.5" fill="#2b2b2b"/>
    <circle cx="-8" cy="6.5" r="2" fill="#fff"/>
    <circle cx="12" cy="6.5" r="2" fill="#fff"/>
    <circle cx="-16" cy="18" r="4" fill="#f5a9b8"/>
    <circle cx="16" cy="18" r="4" fill="#f5a9b8"/>
    <path d="M-7 22 Q0 28 7 22" fill="none" stroke="#c45c7a" stroke-width="2.4" stroke-linecap="round"/>
    <rect x="-18" y="42" width="36" height="42" rx="12" fill="${shirt}"/>
    <circle cx="-24" cy="58" r="7" fill="#ffd9b3"/>
    <circle cx="24" cy="58" r="7" fill="#ffd9b3"/>
    <rect x="-14" y="82" width="11" height="24" rx="5" fill="#3d5a80"/>
    <rect x="3" y="82" width="11" height="24" rx="5" fill="#3d5a80"/>
  </g>`;
}

function cartoonSvg(seed: string, kit: Kit): string {
  const n = hash(seed);
    let sky = pick(SKY, n);
    if (kit === "night") sky = "#3d405b";
    if (kit === "hot") sky = "#ffd6a5";
    if (kit === "snow") sky = "#d7e3fc";
    if (kit === "sea") sky = "#90e0ef";
    if (kit === "rain") sky = "#8d99ae";
  const hair = pick(HAIR, n >> 3);
  const shirt = pick(SHIRT, n >> 6);
  const accent = pick(TINTS, n >> 9);
  const ground = n % 2 === 0 ? "#7cb87c" : "#e6d5b8";
  const chibiX = 520 + (n % 40);
  const buildings =
    kit === "house" || kit === "shop" || kit === "school" || kit === "default"
      ? `<rect x="40" y="120" width="70" height="160" fill="#e6ccb2" opacity="0.7"/>
         <rect x="230" y="100" width="80" height="180" fill="#d4a373" opacity="0.55"/>`
      : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 440">
    <rect width="800" height="440" fill="${sky}"/>
    <rect y="300" width="800" height="140" fill="${ground}"/>
    ${buildings}
    ${propSvg(kit, accent)}
    ${chibi(chibiX, 210, hair, shirt, n)}
  </svg>`;
}

function captionFor(meaning: string, kit: Kit): string {
  const m = meaning;
  switch (kit) {
    case "rain":
      return `Look! There is rain everywhere. We must use our umbrella — this is ${m}!`;
    case "point":
      return `Look! Someone is pointing. That direction is the clue for ${m}.`;
    case "house":
      return `Look! A little house on the street. This scene is about ${m}.`;
    case "bath":
      return `Look! Bubbles in the tub. Time for ${m}.`;
    case "food":
      return `Look! A meal is ready on the table. It is all about ${m}.`;
    case "time":
      return `Look! The clock is ticking. Remember this moment: ${m}.`;
    case "car":
      return `Look! A car is waiting on the road. Think ${m}.`;
    case "train":
      return `Look! The train is here. This trip is ${m}.`;
    case "school":
      return `Look! School time. Open your book and learn ${m}.`;
    case "tree":
      return `Look! Outside in nature. This green scene is ${m}.`;
    case "shop":
      return `Look! The shop is open. You can find ${m} here.`;
    case "cat":
      return `Look! A cat showed up. The cartoon is teaching ${m}.`;
    case "dog":
      return `Look! A friendly animal. This scene means ${m}.`;
    case "book":
      return `Look! An open book. The page is about ${m}.`;
    case "phone":
      return `Look! A gadget in hand. Use it for ${m}.`;
    case "money":
      return `Look! Coins on the table. This is about ${m}.`;
    case "clothes":
      return `Look! An outfit on the hanger. Wear it and remember ${m}.`;
    case "night":
      return `Look! The moon is out. Night words like ${m} live here.`;
    case "question":
      return `Look! A big question mark. Ask yourself: ${m}?`;
    case "yes":
      return `Look! A happy yes. The feeling is ${m}.`;
    case "walk":
      return `Look! Footsteps on the path. Keep going — ${m}.`;
    case "sea":
      return `Look! Waves at the shore. This water scene is ${m}.`;
    case "snow":
      return `Look! Snow is falling. Bundle up for ${m}.`;
    case "hot":
      return `Look! The sun is strong. This warm scene is ${m}.`;
    case "cold":
      return `Look! It feels chilly. The word is ${m}.`;
    case "work":
      return `Look! A bag packed for the office. Today is ${m}.`;
    case "play":
      return `Look! Time to play. The game is ${m}.`;
    case "family":
      return `Look! People together. This family scene is ${m}.`;
    default:
      return `Look! A unique cartoon for this word. The scene is about ${m}.`;
  }
}

export function buildN5Style(args: {
  kanji: string;
  hiragana: string;
  romaji: string;
  meaning: string;
  extra: string;
}): N5Style {
  const kit = kitFor(args.meaning);
  const tint = pick(TINTS, hash(args.kanji + args.hiragana));
  const phrase = soundPhrase(args.hiragana, args.romaji);
  const roma = args.romaji.toUpperCase();
  const extra = args.extra ? ` Also: ${args.extra}.` : "";
  const caption = captionFor(args.meaning, kit);
  const highlights = args.meaning
    .split(/\s+/)
    .map((w) => w.replace(/[^a-zA-Z'-]/g, ""))
    .filter((w) => w.length > 2)
    .slice(0, 3);
  const svg = cartoonSvg(`${args.kanji}-${args.hiragana}`, kit);
  return {
    hook: `${roma} = ${phrase}`,
    body: `Remember: ${roma} = ${phrase} (sounds like the reading). That silly sound locks in “${args.meaning}”. Picture the cartoon whenever you hear ${args.romaji}.${extra}`,
    caption,
    highlights: highlights.length ? highlights : [args.meaning],
    tint,
    image: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`,
  };
}
