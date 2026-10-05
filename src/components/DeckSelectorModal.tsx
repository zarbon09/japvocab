import React, { useState } from 'react';
import { 
  THEMED_CATEGORIES, 
  LESSON_BATCHES, 
  ThemedCategory, 
  LessonBatch, 
  DeckFilter,
  getBatchProgress 
} from '../utils/categories';
import { VOCAB_BANK } from '../data';

interface DeckSelectorModalProps {
  isOpen: boolean;
  activeDeck: DeckFilter;
  learnedSet: Set<number>;
  onClose: () => void;
  onSelectDeck: (deck: DeckFilter) => void;
  onQuizDeck?: (deck: DeckFilter) => void;
}

export const DeckSelectorModal: React.FC<DeckSelectorModalProps> = ({
  isOpen,
  activeDeck,
  learnedSet,
  onClose,
  onSelectDeck,
  onQuizDeck
}) => {
  const [tab, setTab] = useState<'lessons' | 'themes'>('lessons');

  if (!isOpen) return null;

  const totalAllLearned = learnedSet.size;
  const totalAllPct = Math.round((totalAllLearned / VOCAB_BANK.length) * 100);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div 
        className="w-full max-w-xl bg-surface-container-lowest rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-space-md border-b border-surface-variant/20 flex items-center justify-between bg-surface-container-low">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[20px]">collections_bookmark</span>
            </div>
            <div>
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">Select Study Deck</h3>
              <p className="font-label-sm text-label-sm text-on-surface-variant">Focus by 50-word lesson or semantic theme</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Global Deck Reset Button */}
        <div className="px-space-md pt-space-sm pb-1 bg-surface-container-lowest">
          <button
            onClick={() => {
              onSelectDeck({ type: 'all', title: 'All 824 Words' });
              onClose();
            }}
            className={`w-full p-space-sm rounded-2xl border transition-all flex items-center justify-between text-left ${
              activeDeck.type === 'all'
                ? 'bg-primary-fixed/40 border-primary text-on-surface shadow-xs'
                : 'bg-surface-container-low hover:bg-surface-container border-surface-variant/20 text-on-surface'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-sm shrink-0">
                824
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-on-surface">Full JLPT N5 Master Deck</span>
                  {activeDeck.type === 'all' && (
                    <span className="text-[10px] bg-primary text-on-primary px-1.5 py-0.2 rounded-full font-bold">
                      ACTIVE
                    </span>
                  )}
                </div>
                <span className="text-xs text-on-surface-variant">
                  All 824 words in chronological order • {totalAllLearned} learned ({totalAllPct}%)
                </span>
              </div>
            </div>
            <span className="material-symbols-outlined text-primary text-[20px]">
              {activeDeck.type === 'all' ? 'check_circle' : 'arrow_forward'}
            </span>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-surface-variant/15 px-space-md pt-2 bg-surface-container-lowest">
          <button
            onClick={() => setTab('lessons')}
            className={`flex-1 py-2.5 text-center font-label-md text-label-md font-bold border-b-2 transition-all flex items-center justify-center gap-1.5 ${
              tab === 'lessons'
                ? 'border-primary text-primary'
                : 'border-transparent text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">calendar_view_day</span>
            <span>17 Lesson Batches (50 Words)</span>
          </button>
          <button
            onClick={() => setTab('themes')}
            className={`flex-1 py-2.5 text-center font-label-md text-label-md font-bold border-b-2 transition-all flex items-center justify-center gap-1.5 ${
              tab === 'themes'
                ? 'border-primary text-primary'
                : 'border-transparent text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">category</span>
            <span>11 Themed Categories</span>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-space-md overflow-y-auto flex-1 flex flex-col gap-space-sm">
          {tab === 'lessons' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-xs">
              {LESSON_BATCHES.map(batch => {
                const isActive = activeDeck.type === 'lesson' && activeDeck.id === batch.id;
                const { learned, total, pct } = getBatchProgress(batch.wordIds, learnedSet);
                const sampleWords = VOCAB_BANK.slice(batch.startId - 1, batch.startId + 3);

                return (
                  <div
                    key={batch.id}
                    className={`p-space-sm rounded-2xl border transition-all flex flex-col justify-between gap-2 text-left ${
                      isActive
                        ? 'bg-primary-fixed/20 border-primary ring-1 ring-primary/40'
                        : 'bg-surface-container-low hover:bg-surface-container border-surface-variant/20'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-7 h-7 rounded-lg bg-surface-container-highest text-on-surface font-bold text-xs flex items-center justify-center">
                            #{batch.number}
                          </span>
                          <span className="font-bold text-sm text-on-surface">{batch.title}</span>
                        </div>
                        <span className="text-xs font-semibold text-on-surface-variant">
                          {batch.range}
                        </span>
                      </div>

                      {/* Sample Kanji preview */}
                      <div className="flex items-center gap-1.5 mt-2">
                        {sampleWords.map(w => (
                          <span key={w.id} className="text-xs font-bold text-on-surface/80 bg-surface-container px-1.5 py-0.5 rounded">
                            {w.kanji}
                          </span>
                        ))}
                        <span className="text-[10px] text-on-surface-variant/70">+46 more</span>
                      </div>

                      {/* Progress Bar */}
                      <div className="mt-2.5 flex items-center justify-between text-[11px] text-on-surface-variant font-medium">
                        <span>{learned} / {total} learned</span>
                        <span className="font-bold text-primary">{pct}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden mt-1">
                        <div 
                          className="h-full bg-primary rounded-full transition-all duration-300"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 pt-1">
                      <button
                        onClick={() => {
                          onSelectDeck({ type: 'lesson', id: batch.id, title: `${batch.title} (${batch.range})` });
                          onClose();
                        }}
                        className={`flex-1 py-1.5 px-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1 ${
                          isActive 
                            ? 'bg-primary text-on-primary shadow-xs' 
                            : 'bg-surface-container-highest text-on-surface hover:bg-primary hover:text-on-primary'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[14px]">auto_stories</span>
                        <span>{isActive ? 'Active' : 'Study'}</span>
                      </button>

                      {onQuizDeck && (
                        <button
                          onClick={() => {
                            onQuizDeck({ type: 'lesson', id: batch.id, title: `${batch.title} (${batch.range})` });
                            onClose();
                          }}
                          className="py-1.5 px-2.5 rounded-xl bg-surface-container-high hover:bg-secondary hover:text-on-secondary text-on-surface-variant font-bold text-xs transition-colors flex items-center justify-center gap-1"
                          title="Quiz this lesson"
                        >
                          <span className="material-symbols-outlined text-[14px]">quiz</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-xs">
              {THEMED_CATEGORIES.map(category => {
                const isActive = activeDeck.type === 'category' && activeDeck.id === category.id;
                const { learned, total, pct } = getBatchProgress(category.wordIds, learnedSet);
                const sampleWords = VOCAB_BANK.filter(w => category.wordIds.includes(w.id)).slice(0, 3);

                return (
                  <div
                    key={category.id}
                    className={`p-space-sm rounded-2xl border transition-all flex flex-col justify-between gap-2 text-left ${
                      isActive
                        ? 'bg-primary-fixed/20 border-primary ring-1 ring-primary/40'
                        : 'bg-surface-container-low hover:bg-surface-container border-surface-variant/20'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-8 h-8 rounded-xl flex items-center justify-center text-white shrink-0 shadow-xs"
                            style={{ backgroundColor: category.color }}
                          >
                            <span className="material-symbols-outlined text-[18px]">{category.icon}</span>
                          </div>
                          <div>
                            <span className="font-bold text-sm text-on-surface block leading-tight">{category.title}</span>
                            <span className="text-[10px] text-on-surface-variant">{category.count} words</span>
                          </div>
                        </div>
                      </div>

                      <p className="text-[11px] text-on-surface-variant mt-1.5 line-clamp-1">
                        {category.description}
                      </p>

                      {/* Sample Kanji preview */}
                      <div className="flex items-center gap-1.5 mt-2">
                        {sampleWords.map(w => (
                          <span key={w.id} className="text-xs font-bold text-on-surface/80 bg-surface-container px-1.5 py-0.5 rounded">
                            {w.kanji}
                          </span>
                        ))}
                        <span className="text-[10px] text-on-surface-variant/70">+{category.count - sampleWords.length} more</span>
                      </div>

                      {/* Progress Bar */}
                      <div className="mt-2.5 flex items-center justify-between text-[11px] text-on-surface-variant font-medium">
                        <span>{learned} / {total} learned</span>
                        <span className="font-bold text-primary">{pct}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden mt-1">
                        <div 
                          className="h-full rounded-full transition-all duration-300"
                          style={{ width: `${pct}%`, backgroundColor: category.color }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 pt-1">
                      <button
                        onClick={() => {
                          onSelectDeck({ type: 'category', id: category.id, title: category.title });
                          onClose();
                        }}
                        className={`flex-1 py-1.5 px-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1 ${
                          isActive 
                            ? 'bg-primary text-on-primary shadow-xs' 
                            : 'bg-surface-container-highest text-on-surface hover:bg-primary hover:text-on-primary'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[14px]">auto_stories</span>
                        <span>{isActive ? 'Active' : 'Study'}</span>
                      </button>

                      {onQuizDeck && (
                        <button
                          onClick={() => {
                            onQuizDeck({ type: 'category', id: category.id, title: category.title });
                            onClose();
                          }}
                          className="py-1.5 px-2.5 rounded-xl bg-surface-container-high hover:bg-secondary hover:text-on-secondary text-on-surface-variant font-bold text-xs transition-colors flex items-center justify-center gap-1"
                          title="Quiz this category"
                        >
                          <span className="material-symbols-outlined text-[14px]">quiz</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
