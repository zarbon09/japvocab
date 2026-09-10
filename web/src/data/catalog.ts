import pdfCards from "./pdfCards.json";
import { words as starterWords, type VocabWord } from "./words";

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
}));

export const words: VocabWord[] = [...starterWords, ...fromPdf];

export function wordById(id: string): VocabWord | undefined {
  return words.find((w) => w.id === id);
}

export function categories(): string[] {
  return [...new Set(words.map((w) => w.category))];
}
