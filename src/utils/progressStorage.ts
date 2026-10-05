/**
 * Utility for persisting and managing user learning progress across sessions
 */

const STORAGE_KEY_CURRENT_INDEX = 'jlpt_current_word_index';
const STORAGE_KEY_LEARNED_IDS = 'jlpt_learned_word_ids';

export function getSavedWordIndex(maxWords: number): number {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_CURRENT_INDEX);
    if (saved !== null) {
      const idx = parseInt(saved, 10);
      if (!isNaN(idx) && idx >= 0 && idx < maxWords) {
        return idx;
      }
    }
  } catch (e) {
    console.error('Failed to read saved word index', e);
  }
  return 0;
}

export function saveCurrentWordIndex(index: number): void {
  try {
    localStorage.setItem(STORAGE_KEY_CURRENT_INDEX, index.toString());
  } catch (e) {
    console.error('Failed to save current word index', e);
  }
}

export function getLearnedWordIds(): Set<number> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_LEARNED_IDS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return new Set(parsed);
      }
    }
  } catch (e) {
    console.error('Failed to read learned words', e);
  }
  return new Set();
}

export function toggleWordLearned(id: number): boolean {
  try {
    const learned = getLearnedWordIds();
    const isLearnedNow = !learned.has(id);
    if (isLearnedNow) {
      learned.add(id);
    } else {
      learned.delete(id);
    }
    localStorage.setItem(STORAGE_KEY_LEARNED_IDS, JSON.stringify(Array.from(learned)));
    return isLearnedNow;
  } catch (e) {
    console.error('Failed to toggle word learned', e);
    return false;
  }
}

export function markWordsLearnedRange(startId: number, endId: number): void {
  try {
    const learned = getLearnedWordIds();
    for (let id = startId; id <= endId; id++) {
      learned.add(id);
    }
    localStorage.setItem(STORAGE_KEY_LEARNED_IDS, JSON.stringify(Array.from(learned)));
  } catch (e) {
    console.error('Failed to mark words range', e);
  }
}

export function getNextUnlearnedIndex(words: { id: number }[]): number {
  const learned = getLearnedWordIds();
  for (let i = 0; i < words.length; i++) {
    if (!learned.has(words[i].id)) {
      return i;
    }
  }
  return 0;
}
