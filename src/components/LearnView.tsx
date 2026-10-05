import React, { useState, useMemo, useEffect } from 'react';
import { VOCAB_BANK, VocabularyWord } from '../data';
import { ImageUploaderModal } from './ImageUploaderModal';
import { JumpToWordModal } from './JumpToWordModal';
import { DeckSelectorModal } from './DeckSelectorModal';
import { MilestoneCelebrationModal } from './MilestoneCelebrationModal';
import { getImageFromStorage, syncImagesWithServer } from '../utils/imageStorage';
import { 
  getSavedWordIndex, 
  saveCurrentWordIndex, 
  getLearnedWordIds, 
  toggleWordLearned 
} from '../utils/progressStorage';
import { 
  DeckFilter, 
  getCategoryById, 
  getLessonById 
} from '../utils/categories';
import { checkAndUnlockNewBadges, MilestoneBadge } from '../utils/badges';
import { getQuizStats, getStreakInfo, recordActivityEvent } from '../utils/statsStorage';

const Flashcard: React.FC<{ word: VocabularyWord }> = ({ word }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imgSrc, setImgSrc] = useState<string>(`/vocab-images/${word.id}.jpg`);
  const [fallbackStep, setFallbackStep] = useState(0);

  useEffect(() => {
    setIsFlipped(false);
    setImageLoaded(false);
    setFallbackStep(0);

    let isMounted = true;
    getImageFromStorage(word.id).then(storedData => {
      if (!isMounted) return;
      if (storedData) {
        setImgSrc(storedData);
      } else {
        setImgSrc(`/vocab-images/${word.id}.jpg`);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [word.id]);

  const handleImageError = () => {
    if (fallbackStep === 0) {
      // Try png
      setFallbackStep(1);
      setImgSrc(`/vocab-images/${word.id}.png`);
    } else if (fallbackStep === 1) {
      // Fallback to online generator
      setFallbackStep(2);
      const prompt = `A very simple light drawing of ${word.english}, clean minimalist sketch, white background, no text.`;
      setImgSrc(`https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=400&height=300&nologo=true&seed=${word.id}`);
    }
  };

  return (
    <div 
      className="w-full aspect-[3/4] max-w-sm mx-auto cursor-pointer group"
      style={{ perspective: '1000px' }}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div 
        className="relative w-full h-full transition-transform duration-500"
        style={{ transformStyle: 'preserve-3d', transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
      >
        {/* Front of Card (Image + Kanji) */}
        <div 
          className="absolute inset-0 w-full h-full bg-surface-container-lowest rounded-2xl flex flex-col overflow-hidden shadow-md border border-surface-variant/20 group-hover:shadow-lg transition-shadow"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="w-full h-[60%] relative bg-surface-container overflow-hidden">
            <img 
              src={imgSrc} 
              alt={word.english}
              onLoad={() => setImageLoaded(true)}
              onError={handleImageError}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            />
            {!imageLoaded && (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="material-symbols-outlined text-[32px] text-primary/30 animate-pulse mb-2">image</span>
              </div>
            )}
          </div>
          <div className="w-full h-[40%] flex flex-col items-center justify-center relative p-space-sm bg-surface-container-lowest">
            <span className="font-kanji-hero text-[64px] leading-none text-on-surface font-extrabold tracking-tight drop-shadow-sm select-none">{word.kanji}</span>
            <p className="absolute bottom-3 text-on-surface-variant font-label-sm opacity-60 flex items-center gap-1 select-none">
              <span className="material-symbols-outlined text-[14px]">touch_app</span> Tap to flip
            </p>
          </div>
        </div>

        {/* Back of Card (Meaning/Furigana) */}
        <div 
          className="absolute inset-0 w-full h-full bg-primary-container text-on-primary-container rounded-2xl flex flex-col items-center justify-center p-space-md shadow-md border border-primary/20"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <span className="font-furigana text-[28px] text-primary font-bold tracking-widest select-none mb-3">{word.furigana}</span>
          <span className="font-headline-lg text-[36px] font-black uppercase tracking-wider text-center select-none leading-tight">{word.english}</span>
          <span className="font-body-lg text-[20px] opacity-80 select-none mt-4">{word.romaji}</span>
        </div>
      </div>
    </div>
  );
};

const renderSentence = (sentence: string, target: string, furigana: string) => {
  if (!sentence.includes('______')) return sentence;
  const parts = sentence.split('______');
  return (
    <>
      {parts[0]}
      <span className="text-primary font-bold px-1 relative inline-flex flex-col items-center justify-end leading-none translate-y-[-0.2em]">
        <span className="text-[0.45em] absolute top-[-1.2em] font-medium opacity-80 whitespace-nowrap">{furigana}</span>
        {target}
      </span>
      {parts[1]}
    </>
  );
};

interface LearnViewProps {
  initialIndex?: number;
  activeDeck?: DeckFilter;
  onSelectDeck?: (deck: DeckFilter) => void;
  onQuizDeck?: (deck: DeckFilter) => void;
}

const DEFAULT_DECK: DeckFilter = { type: 'all', title: 'All 824 Words' };

export const LearnView: React.FC<LearnViewProps> = ({ 
  initialIndex,
  activeDeck = DEFAULT_DECK,
  onSelectDeck,
  onQuizDeck
}) => {
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isJumpModalOpen, setIsJumpModalOpen] = useState(false);
  const [isDeckModalOpen, setIsDeckModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [learnedSet, setLearnedSet] = useState<Set<number>>(() => getLearnedWordIds());
  const [celebrationBadge, setCelebrationBadge] = useState<MilestoneBadge | null>(null);

  // Active words depending on selected deck / lesson / category
  const activeWords: VocabularyWord[] = useMemo(() => {
    if (activeDeck.type === 'lesson' && activeDeck.id) {
      const lesson = getLessonById(activeDeck.id);
      if (lesson) {
        const idSet = new Set(lesson.wordIds);
        return VOCAB_BANK.filter(w => idSet.has(w.id));
      }
    } else if (activeDeck.type === 'category' && activeDeck.id) {
      const cat = getCategoryById(activeDeck.id);
      if (cat) {
        const idSet = new Set(cat.wordIds);
        return VOCAB_BANK.filter(w => idSet.has(w.id));
      }
    }
    return VOCAB_BANK;
  }, [activeDeck]);

  const [currentIndex, setCurrentIndex] = useState(() => {
    if (initialIndex !== undefined && initialIndex >= 0 && initialIndex < activeWords.length) {
      return initialIndex;
    }
    return getSavedWordIndex(VOCAB_BANK.length);
  });

  // Reset or adjust index when active deck changes
  useEffect(() => {
    if (activeDeck.type !== 'all') {
      setCurrentIndex(0);
    }
  }, [activeDeck.type, activeDeck.id]);

  useEffect(() => {
    if (initialIndex !== undefined && initialIndex >= 0 && initialIndex < activeWords.length) {
      setCurrentIndex(initialIndex);
    }
  }, [initialIndex, activeWords.length]);

  useEffect(() => {
    if (activeDeck.type === 'all') {
      saveCurrentWordIndex(currentIndex);
    }
  }, [currentIndex, activeDeck.type]);

  useEffect(() => {
    syncImagesWithServer();
  }, []);

  const refreshProgress = () => {
    const updated = getLearnedWordIds();
    setLearnedSet(updated);
    const qStats = getQuizStats();
    const sInfo = getStreakInfo();
    const newBadges = checkAndUnlockNewBadges(updated.size, updated, qStats, sInfo);
    if (newBadges.length > 0) {
      setCelebrationBadge(newBadges[0]);
    }
  };

  const currentWord = activeWords[currentIndex] || activeWords[0];
  const isCurrentLearned = currentWord ? learnedSet.has(currentWord.id) : false;

  const handleToggleLearned = () => {
    if (!currentWord) return;
    const isLearnedNow = toggleWordLearned(currentWord.id);
    recordActivityEvent('learn');
    const updated = getLearnedWordIds();
    setLearnedSet(updated);

    if (isLearnedNow) {
      const qStats = getQuizStats();
      const sInfo = getStreakInfo();
      const newBadges = checkAndUnlockNewBadges(updated.size, updated, qStats, sInfo);
      if (newBadges.length > 0) {
        setCelebrationBadge(newBadges[0]);
      }
    }
  };

  // Aggressive Prefetch logic: determine next 3 words' images to eliminate loading times
  const prefetchUrls = useMemo(() => {
    const urls = [];
    for (let i = 1; i <= 3; i++) {
      if (currentIndex + i < activeWords.length) {
        const prefetchWord = activeWords[currentIndex + i];
        const prefetchPrompt = `A very simple light drawing of ${prefetchWord.english}, clean minimalist sketch, white background, no text.`;
        urls.push(`https://image.pollinations.ai/prompt/${encodeURIComponent(prefetchPrompt)}?width=400&height=300&nologo=true&seed=${prefetchWord.id}`);
      }
    }
    return urls;
  }, [currentIndex, activeWords]);

  const handleNext = () => {
    if (currentIndex < activeWords.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const playAudio = () => {
    if ('speechSynthesis' in window && currentWord) {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(currentWord.kanji);
      utter.lang = 'ja-JP';
      utter.rate = 0.85;
      window.speechSynthesis.speak(utter);
    }
  };

  const playSentenceAudio = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = 'ja-JP';
      utter.rate = 0.85;
      window.speechSynthesis.speak(utter);
    }
  };

  if (!currentWord) return null;

  // Deck learned stats
  const deckLearnedCount = activeWords.filter(w => learnedSet.has(w.id)).length;
  const deckProgressPct = Math.round((deckLearnedCount / activeWords.length) * 100);

  return (
    <div className="flex flex-col w-full px-margin pb-space-xl gap-space-md selection:bg-primary-fixed selection:text-on-primary-fixed">
      {/* Prefetch Next Images */}
      {prefetchUrls.map(url => (
        <img key={url} src={url} className="hidden" alt="prefetch" />
      ))}
      
      {/* Top Tracker & Focus Mode Bar */}
      <div className="flex items-center justify-between pt-space-xs gap-2 flex-wrap">
        <div className="flex items-center gap-space-xs flex-wrap">
          {/* Deck / Category Selector Button */}
          <button
            onClick={() => setIsDeckModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container hover:bg-surface-container-high border border-primary/20 text-on-surface text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95 group"
            title="Choose Lesson Batch or Themed Category"
          >
            <span className="material-symbols-outlined text-[16px] text-primary group-hover:rotate-12 transition-transform">collections_bookmark</span>
            <span className="truncate max-w-[130px] sm:max-w-[200px]">{activeDeck.title}</span>
            <span className="material-symbols-outlined text-[16px] text-on-surface-variant">arrow_drop_down</span>
          </button>

          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center gap-1 px- space-sm px-2.5 py-1 rounded-full bg-surface-container text-on-surface hover:bg-surface-container-high shadow-sm active:scale-95 transition-all text-xs font-semibold cursor-pointer"
            title="Import custom images"
          >
            <span className="material-symbols-outlined text-[15px] text-primary">add_photo_alternate</span>
            <span>Images</span>
          </button>
        </div>

        <div className="flex items-center gap-space-sm">
          {/* Interactive Jump to Word Counter */}
          <button
            onClick={() => setIsJumpModalOpen(true)}
            className="flex items-center gap-1.5 bg-surface-container hover:bg-surface-container-high px-space-sm py-1 rounded-full shadow-sm active:scale-95 transition-all border border-primary/20 hover:border-primary cursor-pointer group"
            title="Click to jump to any word"
          >
            <span className="material-symbols-outlined text-primary text-[15px] group-hover:scale-110 transition-transform">swap_vert</span>
            <span className="font-label-md text-label-md text-on-surface font-bold">
              {currentIndex + 1} / {activeWords.length}
            </span>
            {activeDeck.type !== 'all' && (
              <span className="text-[11px] text-primary font-bold">(#{currentWord.id})</span>
            )}
            <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-1.5 py-0.2 rounded-full">Jump</span>
          </button>

          <button
            onClick={() => setIsFocusMode(true)}
            className="flex items-center gap-1 px-space-sm py-1 rounded-full bg-primary-fixed text-on-primary-fixed shadow-sm active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined text-[16px]">visibility</span>
            <span className="font-label-sm text-label-sm font-bold uppercase tracking-wider">Focus</span>
          </button>
        </div>
      </div>

      {/* Active Deck Filter Info Banner (when filtered by lesson or category) */}
      {activeDeck.type !== 'all' && (
        <div className="flex items-center justify-between px-3 py-1.5 bg-primary-fixed/30 rounded-xl border border-primary/20 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="font-semibold text-on-primary-fixed">
              Studying: <strong>{activeDeck.title}</strong> ({activeWords.length} words)
            </span>
          </div>
          <button
            onClick={() => onSelectDeck?.({ type: 'all', title: 'All 824 Words' })}
            className="text-[11px] font-bold text-primary hover:underline flex items-center gap-0.5"
          >
            <span>Show All 824</span>
            <span className="material-symbols-outlined text-[14px]">close</span>
          </button>
        </div>
      )}

      {/* Progress Bar & Learned Counter */}
      <div className="flex flex-col gap-1">
        <div className="w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-primary via-primary-container to-secondary rounded-full transition-all duration-300" style={{ width: `${((currentIndex + 1) / activeWords.length) * 100}%` }}></div>
        </div>
        <div className="flex items-center justify-between text-[11px] text-on-surface-variant font-medium px-1">
          <span>
            {activeDeck.type === 'all' 
              ? `Card #${currentIndex + 1}` 
              : `${currentIndex + 1} of ${activeWords.length} in deck (Global #${currentWord.id})`
            }
          </span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
            <span>{deckLearnedCount} of {activeWords.length} learned ({deckProgressPct}%)</span>
          </span>
        </div>
      </div>

      {/* FLASHCARD CONTAINER */}
      <div className="w-full flex items-center justify-center my-space-sm relative">
        <Flashcard key={`${currentWord.id}-${refreshKey}`} word={currentWord} />
      </div>

      {/* ACTION BUTTONS: LISTEN & MARK AS LEARNED */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-xs">
        <button onClick={playAudio} className="w-full bg-primary-container text-on-primary-container hover:bg-primary hover:text-on-primary transition-all duration-200 py-space-sm px-space-md rounded-full shadow-sm flex items-center justify-center gap-space-sm active:scale-[0.98]">
          <span className="material-symbols-outlined text-[24px]">volume_up</span>
          <span className="font-label-lg text-label-lg font-bold tracking-wide">Listen Pronunciation</span>
        </button>

        <button 
          onClick={handleToggleLearned} 
          className={`w-full py-space-sm px-space-md rounded-full shadow-sm flex items-center justify-center gap-space-sm active:scale-[0.98] transition-all font-label-lg text-label-lg font-bold border ${
            isCurrentLearned 
              ? 'bg-secondary-fixed text-on-secondary-fixed border-secondary shadow-xs' 
              : 'bg-surface-container text-on-surface hover:bg-surface-container-high border-surface-variant/30'
          }`}
        >
          <span className="material-symbols-outlined text-[22px]">
            {isCurrentLearned ? 'check_circle' : 'radio_button_unchecked'}
          </span>
          <span>{isCurrentLearned ? 'Learned ✓' : 'Mark as Learned'}</span>
        </button>
      </div>

      {/* Example Sentences */}
      <div className="bg-surface-container-lowest rounded-lg p-space-md shadow-sm flex flex-col gap-space-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-primary text-[18px]">chat_bubble_outline</span>
            <h2 className="font-label-md text-label-md text-on-surface-variant font-bold uppercase tracking-wider">Context Sentence</h2>
          </div>
          <span className="font-label-sm text-label-sm text-on-surface-variant bg-surface-container px-space-sm py-0.5 rounded-full">1 Example</span>
        </div>

        <div className="bg-surface-container-low rounded-DEFAULT p-space-sm flex items-start justify-between gap-space-sm group hover:bg-surface-container transition-colors">
          <div className="flex flex-col gap-0.5">
            <div className="flex items-baseline gap-1.5 flex-wrap leading-relaxed pt-3">
              <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                {renderSentence(currentWord.sentence, currentWord.sentenceTarget || currentWord.kanji, currentWord.furigana)}
              </span>
            </div>
            <p className="font-body-md text-body-md text-on-surface font-medium">{currentWord.sentenceMeaning}</p>
          </div>
          <button onClick={() => playSentenceAudio(currentWord.sentence.replace('______', currentWord.sentenceTarget || currentWord.kanji))} className="flex-shrink-0 w-10 h-10 rounded-full bg-surface-container-highest text-on-surface-variant flex items-center justify-center hover:bg-primary-fixed hover:text-on-primary-fixed active:scale-90 transition-all mt-3">
            <span className="material-symbols-outlined text-[20px]">volume_up</span>
          </button>
        </div>
      </div>

      {/* Nav Buttons */}
      <div className="grid grid-cols-2 gap-space-sm pt-space-xs">
        <button 
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="flex items-center justify-start gap-2 bg-surface-container text-on-surface p-space-sm rounded-DEFAULT shadow-sm hover:bg-surface-container-high active:scale-95 transition-all text-left disabled:opacity-50"
        >
          <div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface-variant flex-shrink-0">
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          </div>
          <div className="min-w-0">
            <span className="block font-label-sm text-label-sm text-on-surface-variant">Prev</span>
            <span className="block font-label-lg text-label-lg font-bold truncate">
              {currentIndex > 0 ? activeWords[currentIndex - 1].english : '-'}
            </span>
          </div>
        </button>
        <button 
          onClick={handleNext}
          disabled={currentIndex === activeWords.length - 1}
          className="flex items-center justify-end gap-2 bg-surface-container text-on-surface p-space-sm rounded-DEFAULT shadow-sm hover:bg-surface-container-high active:scale-95 transition-all text-right disabled:opacity-50"
        >
          <div className="min-w-0">
            <span className="block font-label-sm text-label-sm text-on-surface-variant">Next</span>
            <span className="block font-label-lg text-label-lg font-bold truncate">
              {currentIndex < activeWords.length - 1 ? activeWords[currentIndex + 1].english : '-'}
            </span>
          </div>
          <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </div>
        </button>
      </div>

      {/* FOCUS OVERLAY */}
      <div className={`fixed inset-0 z-50 bg-surface/95 backdrop-blur-xl flex flex-col justify-between p-margin pb-safe transition-opacity duration-300 ${isFocusMode ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="flex items-center justify-between pt-safe">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></span>
            <span className="font-label-md text-label-md text-on-surface-variant font-bold tracking-wider uppercase">Zen Focus Mode</span>
          </div>
          <button onClick={() => setIsFocusMode(false)} className="w-10 h-10 rounded-full bg-surface-container-highest text-on-surface flex items-center justify-center active:scale-90 transition-transform">
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>
        </div>
        
        <div className="flex flex-col items-center justify-center gap-space-sm my-auto text-center w-full">
          <div className="w-full max-w-sm flex items-center justify-center my-space-xs">
            <Flashcard word={currentWord} />
          </div>
        </div>

        <div className="pb-space-md flex flex-col gap-space-sm">
          {/* Added Navigation Buttons to Focus Mode */}
          <div className="flex items-center justify-between w-full max-w-sm mx-auto px-space-sm">
            <button 
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="w-12 h-12 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface disabled:opacity-30 active:scale-90 transition-all"
            >
              <span className="material-symbols-outlined text-[24px]">arrow_back</span>
            </button>
            <button 
              onClick={playAudio} 
              className="flex-1 max-w-[200px] mx-space-sm bg-primary text-on-primary py-space-sm rounded-full shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-transform"
            >
              <span className="material-symbols-outlined text-[24px]">volume_up</span>
              <span className="font-label-lg text-label-lg font-bold tracking-wide uppercase">Listen</span>
            </button>
            <button 
              onClick={handleNext}
              disabled={currentIndex === activeWords.length - 1}
              className="w-12 h-12 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface disabled:opacity-30 active:scale-90 transition-all"
            >
              <span className="material-symbols-outlined text-[24px]">arrow_forward</span>
            </button>
          </div>
          <p className="text-center font-label-sm text-label-sm text-on-surface-variant opacity-70 mt-space-xs">Focus pure imagery without translation clutter</p>
        </div>
      </div>

      <ImageUploaderModal 
        isOpen={isUploadModalOpen} 
        onClose={() => setIsUploadModalOpen(false)}
        onSuccess={() => setRefreshKey(k => k + 1)}
      />

      <JumpToWordModal
        isOpen={isJumpModalOpen}
        currentIndex={currentIndex}
        onClose={() => setIsJumpModalOpen(false)}
        onSelectWord={(index) => {
          setCurrentIndex(index);
          saveCurrentWordIndex(index);
        }}
        onRefreshProgress={refreshProgress}
      />

      <DeckSelectorModal
        isOpen={isDeckModalOpen}
        activeDeck={activeDeck}
        learnedSet={learnedSet}
        onClose={() => setIsDeckModalOpen(false)}
        onSelectDeck={(deck) => {
          onSelectDeck?.(deck);
        }}
        onQuizDeck={(deck) => {
          onQuizDeck?.(deck);
        }}
      />

      <MilestoneCelebrationModal
        badge={celebrationBadge}
        onClose={() => setCelebrationBadge(null)}
      />
    </div>
  );
};
