import pdfCards from "./pdfCards.json";
import openJlpt from "./openjlpt-n5.json";
import { toRomaji } from "wanakana";
import { words as starterWords, type ExampleSentence, type RubyToken, type VocabWord } from "./words";

export type { VocabWord };

type PdfCard = {
  id: string;
  kanji: string;
  hiragana: string;
  romaji: string;
  meaning: string;
  sceneImage: string;
  ocrHint: string;
};

type OpenJlptEntry = {
  word: string;
  reading: string;
  meanings: string[];
  examples?: { ja: string; en: string }[];
};

const TINTS = [
  "#7ba7c9",
  "#c45c26",
  "#2f6b4f",
  "#6b3fa0",
  "#b42318",
  "#875400",
  "#0f4c81",
  "#c47a2c",
];

const starterKeys = new Set(starterWords.map((w) => w.kanji));

function cleanKanji(raw: string): string {
  const only = (raw.match(/[\u4e00-\u9fff]+/g) || []).join("");
  if (!only || /^[一]+$/.test(only)) return "N5";
  return only.slice(0, 4);
}

function cleanMeaning(raw: string): string {
  const t = raw.replace(/\s+/g, " ").trim();
  if (t.length < 3) return "Open the picture card";
  if (/[가-힣]/.test(t)) return "Open the picture card";
  return t.slice(0, 60);
}

function isRudeExample(ja: string, en: string): boolean {
  return /hell|stupid|idiot|damn|shut up/i.test(en) || /地獄/.test(ja);
}

function hasKanji(text: string): boolean {
  return /[\u4e00-\u9fff]/.test(text);
}

function tokenizeExample(ja: string, word: string, reading: string): RubyToken[] {
  const needles = [word, reading].filter((n) => n.length > 0);
  needles.sort((a, b) => b.length - a.length);
  let hit: { index: number; surface: string } | null = null;
  for (const needle of needles) {
    const index = ja.indexOf(needle);
    if (index >= 0) {
      hit = { index, surface: needle };
      break;
    }
  }
  if (!hit) {
    return [{ text: ja, reading: null, highlight: false }];
  }
  const tokens: RubyToken[] = [];
  if (hit.index > 0) {
    tokens.push({ text: ja.slice(0, hit.index), reading: null, highlight: false });
  }
  tokens.push({
    text: hit.surface,
    reading: hasKanji(hit.surface) ? reading || null : null,
    highlight: true,
  });
  const rest = ja.slice(hit.index + hit.surface.length);
  if (rest) {
    tokens.push({ text: rest, reading: null, highlight: false });
  }
  return tokens;
}

function examplesFor(
  entry: OpenJlptEntry,
  word: string,
  reading: string,
  meaning: string,
): ExampleSentence[] {
  const highlight = meaning.split(/[,/]/)[0]?.trim() || meaning;
  const picked: ExampleSentence[] = [];
  for (const ex of entry.examples ?? []) {
    const ja = String(ex.ja ?? "").trim();
    const en = String(ex.en ?? "").trim();
    if (!ja || !en || isRudeExample(ja, en)) continue;
    picked.push({
      tokens: tokenizeExample(ja, word, reading),
      english: en,
      englishHighlight: highlight,
    });
    if (picked.length >= 3) break;
  }
  if (picked.length === 0) {
    picked.push({
      tokens: [
        { text: word, reading: hasKanji(word) ? reading || null : null, highlight: true },
        { text: "です。", reading: null, highlight: false },
      ],
      english: `This word means ${meaning}.`,
      englishHighlight: highlight,
    });
  }
  return picked;
}

function categoryFor(word: string, meaning: string): string {
  const m = meaning.toLowerCase();
  if (/time|day|week|year|now|morning|night|hour|clock|today|tomorrow|yesterday/.test(m)) {
    return "Time";
  }
  if (/person|people|friend|family|i |you|he |she |name|teacher|student/.test(m)) {
    return "People";
  }
  if (/school|study|learn|book|write|read|class/.test(m)) {
    return "School";
  }
  if (/rain|water|fire|tree|mountain|sky|sun|nature|weather|wind/.test(m)) {
    return "Nature";
  }
  if (word.endsWith("い") && word.length >= 2 && hasKanji(word)) {
    return "Adjectives";
  }
  return "Daily life";
}

function highlightWords(meaning: string): string[] {
  const first = meaning.split(/[,/]/)[0]?.trim() ?? meaning;
  return first
    .split(/\s+/)
    .map((w) => w.replace(/[^a-zA-Z'-]/g, ""))
    .filter((w) => w.length > 2)
    .slice(0, 3);
}

function fromOpenJlpt(entry: OpenJlptEntry, index: number): VocabWord {
  const meanings = (entry.meanings ?? []).map((m) => String(m).trim()).filter(Boolean);
  const meaning = meanings[0] ?? "N5 vocabulary";
  const extra = meanings.slice(1, 3).join("; ");
  const word = String(entry.word ?? "").trim();
  const hiragana = (entry.reading || word).trim();
  const romaji = toRomaji(hiragana);
  const roma = romaji.trim() || hiragana;
  const tint = TINTS[index % TINTS.length] ?? "#7ba7c9";
  const hits = highlightWords(meaning);
  const extraBit = extra ? ` Also: ${extra}.` : "";
  return {
    id: `n5-${word}-${entry.reading || "kana"}`,
    kanji: word,
    hiragana,
    romaji: roma,
    meaning: meaning.toUpperCase(),
    category: categoryFor(word, meaning),
    sceneCaption: `Look! This scene is about ${meaning}. Remember ${word} — it means ${meaning}.${extraBit}`,
    sceneHighlightWords: hits,
    mnemonicHook: `${roma.toUpperCase()} = ${meaning}`,
    mnemonicBody: extra
      ? `Say ${roma} when you see ${word}. It means “${meaning}” (also ${extra}). Picture that meaning.`
      : `Say ${roma} when you see ${word}. It means “${meaning}”. Picture that meaning in your head.`,
    sceneTint: tint,
    examples: examplesFor(entry, word, hiragana, meaning),
    sceneImage: "",
    deck: "n5",
  };
}

const fromPdf: VocabWord[] = (pdfCards as PdfCard[]).map((c) => ({
  id: c.id,
  kanji: cleanKanji(c.kanji),
  hiragana: c.hiragana,
  romaji: c.romaji,
  meaning: cleanMeaning(c.meaning),
  category: "From your PDF",
  sceneCaption: c.ocrHint || "Study the picture card from your N5 PDF.",
  sceneHighlightWords: [],
  mnemonicHook: "Picture card",
  mnemonicBody:
    "This card is taken from your N5 PDF. The picture, meaning, and example sentences are on the image.",
  sceneTint: "#eef6fb",
  examples: [],
  sceneImage: c.sceneImage,
  fullCard: true,
  deck: "pdf",
}));

const starters: VocabWord[] = starterWords.map((w) => ({ ...w, deck: "starter" }));

const fromOpenJlptList: VocabWord[] = (openJlpt as OpenJlptEntry[])
  .filter((entry) => {
    const word = String(entry.word ?? "").trim();
    return word.length > 0 && !starterKeys.has(word);
  })
  .map((entry, index) => fromOpenJlpt(entry, index));

export const words: VocabWord[] = [...starters, ...fromOpenJlptList, ...fromPdf];

/** Typed cards Practice can quiz (not PDF pictures). */
export const quizWords: VocabWord[] = words.filter((w) => w.deck !== "pdf");

export function wordById(id: string): VocabWord | undefined {
  return words.find((w) => w.id === id);
}

export function categories(): string[] {
  return [...new Set(words.map((w) => w.category))];
}
