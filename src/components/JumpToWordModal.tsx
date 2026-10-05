import React, { useState, useMemo } from 'react';
import { VOCAB_BANK, VocabularyWord } from '../data';
import { 
  getLearnedWordIds, 
  markWordsLearnedRange, 
  getNextUnlearnedIndex 
} from '../utils/progressStorage';

interface JumpToWordModalProps {
  isOpen: boolean;
  currentIndex: number;
  onClose: () => void;
  onSelectWord: (index: number) => void;
  onRefreshProgress?: () => void;
}

export const JumpToWordModal: React.FC<JumpToWordModalProps> = ({
  isOpen,
  currentIndex,
  onClose,
  onSelectWord,
  onRefreshProgress
}) => {
  const [targetNumber, setTargetNumber] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sliderVal, setSliderVal] = useState<number>(currentIndex + 1);
  const [activeTab, setActiveTab] = useState<'number' | 'search' | 'quick'>('number');
  const [showBulkSuccess, setShowBulkSuccess] = useState<string | null>(null);

  const learnedSet = useMemo(() => getLearnedWordIds(), [isOpen]);
  const nextUnlearnedIdx = useMemo(() => getNextUnlearnedIndex(VOCAB_BANK), [isOpen]);
  const nextUnlearnedWord = VOCAB_BANK[nextUnlearnedIdx];

  // Update slider if currentIndex changes
  React.useEffect(() => {
    setSliderVal(currentIndex + 1);
  }, [currentIndex, isOpen]);

  // Filtered words for search tab
  const filteredWords = useMemo(() => {
    if (!searchQuery.trim()) return VOCAB_BANK.slice(0, 30);
    const q = searchQuery.toLowerCase().trim();
    return VOCAB_BANK.filter(w => 
      w.english.toLowerCase().includes(q) ||
      w.kanji.includes(q) ||
      w.romaji.toLowerCase().includes(q) ||
      w.furigana.includes(q) ||
      w.id.toString() === q
    ).slice(0, 50);
  }, [searchQuery]);

  if (!isOpen) return null;

  const handleJumpToNumber = (num: number) => {
    if (num >= 1 && num <= VOCAB_BANK.length) {
      onSelectWord(num - 1);
      onClose();
    }
  };

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(targetNumber, 10);
    if (!isNaN(val) && val >= 1 && val <= VOCAB_BANK.length) {
      handleJumpToNumber(val);
    }
  };

  const handleMarkRange = (from: number, to: number) => {
    markWordsLearnedRange(from, to);
    setShowBulkSuccess(`Marked words #${from} to #${to} as learned!`);
    if (onRefreshProgress) onRefreshProgress();
    setTimeout(() => setShowBulkSuccess(null), 3000);
  };

  const sliderWord = VOCAB_BANK[sliderVal - 1];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div 
        className="w-full max-w-lg bg-surface-container-lowest rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-space-md border-b border-surface-variant/20 flex items-center justify-between bg-surface-container-low">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[20px]">swap_vert</span>
            </div>
            <div>
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">Jump to Word</h3>
              <p className="font-label-sm text-label-sm text-on-surface-variant">Choose any card from 1 to {VOCAB_BANK.length}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Tab switchers */}
        <div className="flex border-b border-surface-variant/15 px-space-md pt-2 bg-surface-container-lowest">
          <button
            onClick={() => setActiveTab('number')}
            className={`flex-1 py-2 text-center font-label-md text-label-md font-bold border-b-2 transition-all ${
              activeTab === 'number'
                ? 'border-primary text-primary'
                : 'border-transparent text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Enter Word #
          </button>
          <button
            onClick={() => setActiveTab('search')}
            className={`flex-1 py-2 text-center font-label-md text-label-md font-bold border-b-2 transition-all ${
              activeTab === 'search'
                ? 'border-primary text-primary'
                : 'border-transparent text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Search Words
          </button>
          <button
            onClick={() => setActiveTab('quick')}
            className={`flex-1 py-2 text-center font-label-md text-label-md font-bold border-b-2 transition-all ${
              activeTab === 'quick'
                ? 'border-primary text-primary'
                : 'border-transparent text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Bulk Learned
          </button>
        </div>

        {/* Body */}
        <div className="p-space-md overflow-y-auto flex-1 flex flex-col gap-space-md">
          {/* Resume next unlearned word banner */}
          {nextUnlearnedWord && (
            <button
              onClick={() => handleJumpToNumber(nextUnlearnedIdx + 1)}
              className="w-full p-space-sm bg-gradient-to-r from-primary-fixed/60 via-primary-fixed/30 to-surface-container rounded-2xl border border-primary/20 flex items-center justify-between text-left hover:scale-[1.01] active:scale-[0.99] transition-all shadow-xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
                  #{nextUnlearnedIdx + 1}
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-primary block">
                    Resume Learning
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="font-bold text-on-surface text-base">{nextUnlearnedWord.kanji}</span>
                    <span className="text-xs text-primary font-medium">({nextUnlearnedWord.furigana})</span>
                    <span className="text-xs text-on-surface-variant">• {nextUnlearnedWord.english}</span>
                  </div>
                </div>
              </div>
              <span className="material-symbols-outlined text-primary text-[20px] mr-1">arrow_forward</span>
            </button>
          )}

          {activeTab === 'number' && (
            <div className="flex flex-col gap-space-md">
              {/* Direct input form */}
              <form onSubmit={handleInputSubmit} className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="number"
                    min="1"
                    max={VOCAB_BANK.length}
                    value={targetNumber}
                    onChange={e => setTargetNumber(e.target.value)}
                    placeholder="Enter word number (e.g. 81)"
                    className="w-full px-4 py-3 rounded-xl bg-surface-container text-on-surface border border-surface-variant/30 focus:outline-none focus:border-primary font-body-lg text-body-lg"
                    autoFocus
                  />
                  <span className="absolute right-3 top-3.5 text-xs text-on-surface-variant/70">
                    / {VOCAB_BANK.length}
                  </span>
                </div>
                <button
                  type="submit"
                  disabled={!targetNumber || parseInt(targetNumber, 10) < 1 || parseInt(targetNumber, 10) > VOCAB_BANK.length}
                  className="px-6 py-3 rounded-xl bg-primary text-on-primary font-label-lg font-bold shadow-sm active:scale-95 transition-all disabled:opacity-40"
                >
                  Go
                </button>
              </form>

              {/* Slider Scrubbing */}
              <div className="bg-surface-container-low p-space-sm rounded-2xl border border-surface-variant/20 flex flex-col gap-2">
                <div className="flex justify-between items-center text-xs font-semibold text-on-surface-variant">
                  <span>Interactive Deck Slider</span>
                  <span className="text-primary font-bold">Word #{sliderVal}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max={VOCAB_BANK.length}
                  value={sliderVal}
                  onChange={e => setSliderVal(parseInt(e.target.value, 10))}
                  className="w-full accent-primary cursor-pointer"
                />
                {sliderWord && (
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-bold text-on-surface">{sliderWord.kanji}</span>
                      <span className="text-xs text-primary font-medium">{sliderWord.furigana}</span>
                      <span className="text-xs text-on-surface-variant">({sliderWord.english})</span>
                    </div>
                    <button
                      onClick={() => handleJumpToNumber(sliderVal)}
                      className="px-3 py-1 bg-surface-container-highest hover:bg-primary hover:text-on-primary text-xs font-bold rounded-lg transition-colors"
                    >
                      Jump Here
                    </button>
                  </div>
                )}
              </div>

              {/* Quick Jump Shortcuts */}
              <div>
                <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-2">
                  Quick Jump Presets
                </span>
                <div className="grid grid-cols-4 gap-2">
                  {[1, 50, 81, 100, 200, 400, 600, 824].map(num => (
                    <button
                      key={num}
                      onClick={() => handleJumpToNumber(num)}
                      className={`py-2 px-1 rounded-xl text-xs font-bold text-center border transition-all ${
                        currentIndex + 1 === num
                          ? 'bg-primary text-on-primary border-primary shadow-xs'
                          : 'bg-surface-container text-on-surface border-surface-variant/20 hover:bg-surface-container-high'
                      }`}
                    >
                      #{num}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'search' && (
            <div className="flex flex-col gap-space-sm">
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-3 text-[20px] text-on-surface-variant">
                  search
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search by Kanji, English, or Romaji..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-container text-on-surface border border-surface-variant/30 focus:outline-none focus:border-primary text-sm"
                  autoFocus
                />
              </div>

              <div className="flex flex-col gap-1.5 max-h-64 overflow-y-auto pr-1">
                {filteredWords.map(word => {
                  const isCurrent = word.id === currentIndex + 1;
                  const isLearned = learnedSet.has(word.id);
                  return (
                    <button
                      key={word.id}
                      onClick={() => handleJumpToNumber(word.id)}
                      className={`w-full p-2.5 rounded-xl flex items-center justify-between text-left transition-colors border ${
                        isCurrent
                          ? 'bg-primary-fixed text-on-primary-fixed border-primary/30'
                          : 'bg-surface-container-low hover:bg-surface-container border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-lg bg-surface-container-highest text-on-surface-variant flex items-center justify-center text-xs font-bold shrink-0">
                          #{word.id}
                        </span>
                        <div>
                          <div className="flex items-baseline gap-2">
                            <span className="font-bold text-sm text-on-surface">{word.kanji}</span>
                            <span className="text-xs text-primary font-medium">{word.furigana}</span>
                          </div>
                          <span className="text-xs text-on-surface-variant">{word.english}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {isLearned && (
                          <span className="text-xs bg-secondary-fixed text-on-secondary-fixed px-1.5 py-0.5 rounded font-semibold">
                            Learned
                          </span>
                        )}
                        <span className="material-symbols-outlined text-[16px] text-on-surface-variant">
                          arrow_forward
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'quick' && (
            <div className="flex flex-col gap-space-md">
              <div className="bg-surface-container-low p-space-md rounded-2xl border border-surface-variant/20">
                <h4 className="font-bold text-sm text-on-surface mb-1">Already learned up to a certain word?</h4>
                <p className="text-xs text-on-surface-variant mb-4">
                  If you previously learned words (for example words 1 through 80), you can mark them as learned in bulk so your progress is recorded and you start right from #81!
                </p>

                {showBulkSuccess && (
                  <div className="mb-3 p-2.5 bg-secondary-fixed text-on-secondary-fixed rounded-xl text-xs font-bold flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px]">check_circle</span>
                    <span>{showBulkSuccess}</span>
                  </div>
                )}

                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => {
                      handleMarkRange(1, 80);
                      handleJumpToNumber(81);
                    }}
                    className="w-full py-2.5 px-4 bg-primary text-on-primary rounded-xl font-bold text-xs flex items-center justify-between active:scale-98 transition-all shadow-sm"
                  >
                    <span>Mark #1 to #80 as Learned & Jump to #81</span>
                    <span className="material-symbols-outlined text-[18px]">bolt</span>
                  </button>

                  <button
                    onClick={() => {
                      handleMarkRange(1, 50);
                      handleJumpToNumber(51);
                    }}
                    className="w-full py-2 px-4 bg-surface-container hover:bg-surface-container-high text-on-surface rounded-xl font-bold text-xs flex items-center justify-between transition-colors"
                  >
                    <span>Mark #1 to #50 as Learned</span>
                    <span className="material-symbols-outlined text-[16px]">check</span>
                  </button>

                  <button
                    onClick={() => {
                      handleMarkRange(1, 100);
                      handleJumpToNumber(101);
                    }}
                    className="w-full py-2 px-4 bg-surface-container hover:bg-surface-container-high text-on-surface rounded-xl font-bold text-xs flex items-center justify-between transition-colors"
                  >
                    <span>Mark #1 to #100 as Learned</span>
                    <span className="material-symbols-outlined text-[16px]">check</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
