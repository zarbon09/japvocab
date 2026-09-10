import pdfCards from "./pdfCards.json";
import openJlpt from "./openjlpt-n5.json";
import { words as starterWords, type ExampleSentence, type VocabWord } from "./words";

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

const TINTS = ["#0f4c81", "#c45c26", "#2f6b4f", "#6b3fa0", "#b42318", "#875400"];

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

function examplesFor(entry: OpenJlptEntry, meaning: string): ExampleSentence[] {
  const highlight = meaning.split(/[,/]/)[0]?.trim() || meaning;
  const picked: ExampleSentence[] = [];
  for (const ex of entry.examples ?? []) {
    const ja = String(ex.ja ?? "").trim();
    const en = String(ex.en ?? "").trim();
    if (!ja || !en || isRudeExample(ja, en)) continue;
    picked.push({
      tokens: [{ text: ja, reading: null, highlight: false }],
      english: en,
      englishHighlight: highlight,
    });
    if (picked.length >= 2) break;
  }
  if (picked.length === 0) {
    const reading = entry.reading.trim() || null;
    picked.push({
      tokens: [{ text: `${entry.word}。`, reading, highlight: true }],
      english: `This word means ${meaning}.`,
      englishHighlight: highlight,
    });
  }
  return picked;
}

function fromOpenJlpt(entry: OpenJlptEntry, index: number): VocabWord {
  const meanings = (entry.meanings ?? []).map((m) => String(m).trim()).filter(Boolean);
  const meaning = meanings[0] ?? "N5 vocabulary";
  const extra = meanings.slice(1, 3).join("; ");
  const hiragana = (entry.reading || entry.word).trim();
  return {
    id: `n5-${entry.word}-${entry.reading || "kana"}`,
    kanji: entry.word,
    hiragana,
    romaji: hiragana,
    meaning,
    category: "Full N5 list",
    sceneCaption: extra ? `Also: ${extra}` : `N5 vocabulary: ${meaning}.`,
    sceneHighlightWords: extra ? ["Also"] : [meaning],
    mnemonicHook: "Full N5 list",
    mnemonicBody: extra
      ? `Other meanings: ${extra}. From OpenJLPT (CC BY 4.0).`
      : "Typed N5 vocabulary from OpenJLPT (CC BY 4.0). PDF picture cards are in a separate filter.",
    sceneTint: TINTS[index % TINTS.length] ?? "#0f4c81",
    examples: examplesFor(entry, meaning),
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
