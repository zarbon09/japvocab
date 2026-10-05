import React, { useState, useEffect, useMemo } from 'react';
import { VOCAB_BANK, VocabularyWord } from '../data';
import { 
  DeckFilter, 
  getCategoryById, 
  getLessonById 
} from '../utils/categories';
import { getLearnedWordIds } from '../utils/progressStorage';
import { DeckSelectorModal } from './DeckSelectorModal';
import { MilestoneCelebrationModal } from './MilestoneCelebrationModal';
import { recordQuizSession, getStreakInfo } from '../utils/statsStorage';
import { checkAndUnlockNewBadges, MilestoneBadge } from '../utils/badges';

type PracticeMode = 'adaptive' | 'pic' | 'ja-en' | 'en-ja' | 'sentence';

interface PractiseViewProps {
  activeDeck?: DeckFilter;
  onSelectDeck?: (deck: DeckFilter) => void;
  onNavigate?: (view: string) => void;
}

const DEFAULT_DECK: DeckFilter = { type: 'all', title: 'All 824 Words' };

export const PractiseView: React.FC<PractiseViewProps> = ({
  activeDeck = DEFAULT_DECK,
  onSelectDeck,
  onNavigate
}) => {
  const [currentMode, setCurrentMode] = useState<PracticeMode>('adaptive');
  const [questions, setQuestions] = useState<VocabularyWord[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [weakWords, setWeakWords] = useState<VocabularyWord[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isDeckModalOpen, setIsDeckModalOpen] = useState(false);
  const [learnedSet] = useState<Set<number>>(() => getLearnedWordIds());
  const [newlyUnlockedBadge, setNewlyUnlockedBadge] = useState<MilestoneBadge | null>(null);

  // Filter words by active deck
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

  useEffect(() => {
    initMode(currentMode);
  }, [activeDeck.type, activeDeck.id]);

  const initMode = (mode: PracticeMode) => {
    setCurrentMode(mode);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setCorrectCount(0);
    setIncorrectCount(0);
    setWeakWords([]);
    setIsCompleted(false);

    let nextQuestions: VocabularyWord[] = [];
    if (mode === 'adaptive') {
      nextQuestions = [...activeWords];
    } else {
      nextQuestions = activeWords.filter(q => q.type === mode);
      if (nextQuestions.length === 0) {
        nextQuestions = activeWords.map(item => ({ ...item, type: mode }));
      }
    }
    // Shuffle and cap at 15 for an optimal session length
    nextQuestions.sort(() => Math.random() - 0.5);
    const sessionLength = Math.min(nextQuestions.length, 15);
    setQuestions(nextQuestions.slice(0, sessionLength));
  };

  const handleSelectOption = (optText: string, correctAnswer: string) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(optText);
    const correct = optText === correctAnswer;
    setIsCorrect(correct);

    if (correct) {
      setCorrectCount(c => c + 1);
    } else {
      setIncorrectCount(c => c + 1);
      setWeakWords(prev => [...prev, currentQuestion]);
    }
  };

  const nextQuestion = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setIsCorrect(null);
    } else {
      setIsCompleted(true);
      const updatedStats = recordQuizSession(questions.length, correctCount);
      const sInfo = getStreakInfo();
      const newlyUnlocked = checkAndUnlockNewBadges(learnedSet.size, learnedSet, updatedStats, sInfo);
      if (newlyUnlocked.length > 0) {
        setNewlyUnlockedBadge(newlyUnlocked[0]);
      }
    }
  };

  const currentQuestion = questions[currentIndex];

  // Aggressive Prefetch logic for Practice view images
  const prefetchUrls = useMemo(() => {
    const urls = [];
    for (let i = 1; i <= 3; i++) {
      if (currentIndex + i < questions.length) {
        const nextQ = questions[currentIndex + i];
        if (nextQ.type === 'pic' || nextQ.type === 'adaptive') {
          const prefetchPrompt = `A very simple light drawing of ${nextQ.english}, clean minimalist sketch, white background, no text.`;
          urls.push(`https://image.pollinations.ai/prompt/${encodeURIComponent(prefetchPrompt)}?width=400&height=300&nologo=true&seed=${nextQ.id}`);
        }
      }
    }
    return urls;
  }, [currentIndex, questions]);

  const { typeTag, furiganaText, mainText, instruction, correctAnswer, options, showImage, showAudio } = useMemo(() => {
    if (!currentQuestion) return { options: [], correctAnswer: '' };
    
    let optionsList: string[] = [];
    let correct = '';
    let tTag = '';
    let fText = '';
    let mText = '';
    let inst = '';
    let img = false;
    let aud = false;

    const q = currentQuestion;

    if (q.type === "pic") {
      tTag = "Picture → Japanese";
      img = true;
      fText = "";
      mText = "この言葉は何？";
      inst = "Look at the photo and pick the correct Japanese verb:";
      correct = q.kanji;
      optionsList = [q.kanji, ...q.distractors];
    } else if (q.type === "ja-en") {
      tTag = "Japanese → English";
      fText = q.furigana;
      mText = q.kanji;
      inst = "Choose the correct English definition:";
      correct = q.english;
      optionsList = [q.english, ...q.distractors];
    } else if (q.type === "en-ja") {
      tTag = "English → Japanese";
      fText = "MEANING";
      mText = q.english.toUpperCase();
      inst = "Which kanji word represents this meaning?";
      correct = q.kanji;
      optionsList = [q.kanji, ...q.distractors];
    } else if (q.type === "sentence") {
      tTag = "Sentence Completion";
      fText = q.sentenceMeaning;
      mText = q.sentence;
      inst = "Fill in the blank with the natural N5 fit:";
      correct = q.sentenceTarget;
      optionsList = [q.sentenceTarget, ...q.sentenceDistractors];
    } else {
      // Fallback
      correct = q.kanji;
      optionsList = [q.kanji, ...q.distractors];
    }

    // Sort uniquely based on content to not shuffle every render unnecessarily, but shuffle on init. 
    // For simplicity, we just shuffle once based on question ID.
    // Using a seeded approach or just randomizing in useMemo is fine since deps change on question switch.
    optionsList.sort(() => Math.random() - 0.5);

    return { typeTag: tTag, furiganaText: fText, mainText: mText, instruction: inst, correctAnswer: correct, options: optionsList, showImage: img, showAudio: aud };
  }, [currentQuestion]);

  if (!currentQuestion) return null;

  return (
    <div className="flex flex-col w-full px-margin pb-space-xl">
      {/* Prefetch Next Images */}
      {prefetchUrls.map(url => (
        <img key={url} src={url} className="hidden" alt="prefetch" />
      ))}

      {/* Active Quiz Deck Filter */}
      <div className="flex items-center justify-between pt-space-xs pb-1 gap-2 flex-wrap">
        <button
          onClick={() => setIsDeckModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container hover:bg-surface-container-high border border-primary/20 text-on-surface text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95 group"
          title="Change Quiz Deck / Lesson / Category"
        >
          <span className="material-symbols-outlined text-[16px] text-primary group-hover:rotate-12 transition-transform">collections_bookmark</span>
          <span className="truncate max-w-[150px] sm:max-w-[240px]">Quiz: {activeDeck.title}</span>
          <span className="material-symbols-outlined text-[16px] text-on-surface-variant">arrow_drop_down</span>
        </button>

        <span className="text-xs text-on-surface-variant font-medium">
          {activeWords.length} words in pool
        </span>
      </div>

      {/* Modes */}
      <div className="flex items-center gap-space-xs overflow-x-auto py-space-sm -mx-margin px-margin no-scrollbar">
        {[
          { id: 'adaptive', icon: 'bolt', label: 'Adaptive Mix (10)' },
          { id: 'pic', icon: 'image', label: 'Picture Quiz' },
          { id: 'ja-en', icon: 'translate', label: 'JP → EN' },
          { id: 'en-ja', icon: 'sync_alt', label: 'EN → JP' },
          { id: 'sentence', icon: 'edit_note', label: 'Cloze Fill' },
        ].map(mode => (
          <button
            key={mode.id}
            onClick={() => initMode(mode.id as PracticeMode)}
            className={`shrink-0 px-space-md py-space-xs rounded-full font-label-md text-label-md flex items-center gap-1 transition-all active:scale-95 ${
              currentMode === mode.id
                ? 'bg-primary text-on-primary shadow-sm'
                : 'bg-surface-container-high text-on-surface-variant'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">{mode.icon}</span>
            <span>{mode.label}</span>
          </button>
        ))}
      </div>

      {!isCompleted ? (
        <div className="flex flex-col w-full mt-space-xs">
          {/* Progress Indicator */}
          <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm mb-space-md">
            <div className="flex items-center justify-between mb-space-xs">
              <div className="flex items-center gap-space-xs">
                <span className="px-space-xs py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm uppercase tracking-wider">JLPT N5</span>
                <span className="font-label-lg text-label-lg text-on-surface-variant">Question {currentIndex + 1} / {questions.length}</span>
              </div>
              <div className="flex items-center gap-1 text-secondary font-label-md text-label-md font-bold">
                <span className="material-symbols-outlined text-[18px]">verified</span>
                <span>No penalties</span>
              </div>
            </div>
            <div className="w-full h-2.5 bg-surface-container-highest rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-primary-container via-primary to-secondary rounded-full transition-all duration-300 ease-out" style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}></div>
            </div>
          </div>

          {/* Question Card */}
          <div className="bg-surface-container-lowest p-space-md rounded-3xl shadow-sm flex flex-col items-center text-center relative overflow-hidden transition-all duration-300">
            <div className="w-full flex justify-between items-center mb-space-sm">
              <div className="flex items-center gap-1 bg-surface-container px-space-sm py-space-xs rounded-full font-label-sm text-label-sm text-on-surface-variant">
                <span className="material-symbols-outlined text-[14px]">psychology</span>
                <span>{typeTag}</span>
              </div>
              <button className="w-9 h-9 rounded-full bg-surface-container-high text-primary flex items-center justify-center active:scale-90 transition-transform">
                <span className="material-symbols-outlined text-[20px]">volume_up</span>
              </button>
            </div>

            {showImage && (
              <div className="w-full mb-space-md">
                <div 
                  className="w-full h-44 rounded-2xl overflow-hidden relative shadow-inner flex flex-col items-center justify-center bg-surface-container"
                  style={{ background: `linear-gradient(135deg, hsl(${Math.abs(currentQuestion.english.charCodeAt(0)) * 15 % 360}, 70%, 92%), hsl(${(Math.abs(currentQuestion.english.charCodeAt(0)) * 15 + 45) % 360}, 70%, 96%))` }}
                >
                  <img 
                    src={`https://image.pollinations.ai/prompt/${encodeURIComponent(`A very simple light drawing of ${currentQuestion.english}, clean minimalist sketch, white background, no text.`)}?width=400&height=300&nologo=true&seed=${currentQuestion.id}`}
                    alt={currentQuestion.english}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent flex items-end p-space-sm pointer-events-none">
                    <span className="text-white/90 font-label-sm text-label-sm bg-black/40 backdrop-blur-md px-space-xs py-0.5 rounded-md font-bold shadow-sm">Visual Clue</span>
                  </div>
                </div>
              </div>
            )}

            {showAudio && (
              <div className="w-full mb-space-md py-space-lg bg-surface-container rounded-2xl flex-col items-center justify-center gap-space-sm flex">
                <div className="w-16 h-16 rounded-full bg-primary-fixed flex items-center justify-center shadow-sm">
                  <button className="w-12 h-12 rounded-full bg-primary text-on-primary flex items-center justify-center active:scale-95 shadow-md">
                    <span className="material-symbols-outlined text-[28px]">volume_up</span>
                  </button>
                </div>
                <p className="font-label-md text-label-md text-on-surface-variant">Tap button to listen clearly</p>
              </div>
            )}

            <div className="mb-space-md flex flex-col items-center">
              <span className="font-furigana text-furigana text-primary font-bold min-h-[16px]">{furiganaText}</span>
              <h2 className="font-kanji-hero-mobile text-kanji-hero-mobile text-on-surface font-semibold tracking-wide">{mainText}</h2>
              <p className="font-body-md text-body-md text-on-surface-variant mt-1">{instruction}</p>
            </div>

            <div className="w-full flex flex-col gap-space-sm">
              {options.map((optText, idx) => {
                const isSelected = selectedAnswer === optText;
                const badgeLetter = String.fromCharCode(65 + idx);
                let btnClass = "w-full p-space-md rounded-2xl font-headline-sm text-headline-sm text-left flex items-center justify-between transition-all duration-200 active:scale-98 shadow-sm";
                let iconClass = "material-symbols-outlined text-[20px]";
                let iconName = "radio_button_unchecked";

                if (selectedAnswer !== null) {
                  if (optText === correctAnswer) {
                    btnClass += " bg-secondary-fixed text-on-secondary-fixed";
                    iconName = "check_circle";
                    iconClass += " text-secondary";
                  } else if (isSelected && optText !== correctAnswer) {
                    btnClass += " bg-error-container text-on-error-container";
                    iconName = "cancel";
                    iconClass += " text-error";
                  } else {
                    btnClass += " bg-surface-container-low text-on-surface opacity-50";
                    iconClass += " text-outline-variant";
                  }
                } else {
                  btnClass += " bg-surface-container-low text-on-surface hover:bg-surface-container";
                  iconClass += " text-outline-variant";
                }

                return (
                  <button key={idx} disabled={selectedAnswer !== null} onClick={() => handleSelectOption(optText, correctAnswer)} className={btnClass}>
                    <div className="flex items-center gap-space-md">
                      <span className="w-7 h-7 rounded-full bg-surface-container-highest text-on-surface-variant font-label-md text-label-md flex items-center justify-center font-bold">{badgeLetter}</span>
                      <span className="font-bold">{optText}</span>
                    </div>
                    <span className={iconClass}>{iconName}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {selectedAnswer !== null && (
            <div className={`mt-space-md p-space-md rounded-2xl transition-all duration-300 shadow-sm ${isCorrect ? 'bg-secondary-fixed text-on-secondary-fixed' : 'bg-surface-container-highest text-on-surface'}`}>
              <div className="flex items-start justify-between gap-space-sm">
                <div className="flex items-start gap-space-sm">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${isCorrect ? 'bg-secondary text-on-secondary' : 'bg-primary-container text-on-primary-container'}`}>
                    <span className="material-symbols-outlined text-[20px]">
                      {isCorrect ? 'done_all' : 'lightbulb'}
                    </span>
                  </div>
                  <div className="flex flex-col text-left">
                    <h4 className={`font-headline-sm text-headline-sm font-bold ${isCorrect ? 'text-on-secondary-fixed' : 'text-on-surface'}`}>
                      {isCorrect ? '✓ Correct! 🎉' : '✗ Friendly Review'}
                    </h4>
                    <p className={`font-body-md text-body-md mt-0.5 ${isCorrect ? 'text-on-secondary-fixed-variant' : 'text-on-surface-variant'}`}>
                      {isCorrect 
                        ? `${currentQuestion.kanji} (${currentQuestion.furigana}) • "${currentQuestion.english}" matches perfectly!`
                        : `Correct answer is "${correctAnswer}". ${currentQuestion.kanji} (${currentQuestion.furigana}) translates to "${currentQuestion.english}".`
                      }
                    </p>
                  </div>
                </div>
              </div>
              <button onClick={nextQuestion} className="w-full mt-space-md py-space-sm px-space-md rounded-full bg-primary text-on-primary font-label-lg text-label-lg font-bold shadow-md active:scale-98 transition-transform flex items-center justify-center gap-1">
                <span>Continue</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col w-full mt-space-xs">
          <div className="bg-surface-container-lowest p-space-lg rounded-3xl shadow-md text-center flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-primary-fixed flex items-center justify-center mb-space-sm shadow-sm animate-bounce">
              <span className="text-[40px]">🌸</span>
            </div>
            <span className="px-space-sm py-space-xs rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-bold uppercase tracking-wider mb-space-xs">Session Completed</span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">お疲れ様でした!</h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1">Great practice! Regular active recall cements JLPT N5 kanji into long-term memory.</p>
            
            <div className="w-full my-space-lg p-space-md bg-surface-container rounded-2xl flex items-center justify-around">
              <div className="flex flex-col items-center">
                <span className="font-display-lg-mobile text-display-lg-mobile text-primary font-bold">{Math.round((correctCount / questions.length) * 100)}%</span>
                <span className="font-label-md text-label-md text-on-surface-variant">Overall Accuracy</span>
              </div>
              <div className="h-12 w-0.5 bg-surface-container-highest"></div>
              <div className="flex flex-col text-left gap-1">
                <div className="flex items-center gap-1 text-secondary font-label-md text-label-md font-semibold">
                  <span className="material-symbols-outlined text-[16px]">check_circle</span>
                  <span>{correctCount} Correct</span>
                </div>
                <div className="flex items-center gap-1 text-on-surface-variant font-label-md text-label-md font-semibold">
                  <span className="material-symbols-outlined text-[16px]">replay</span>
                  <span>{incorrectCount} To Review</span>
                </div>
              </div>
            </div>

            <div className="w-full text-left mb-space-lg">
              <div className="flex items-center justify-between mb-space-xs">
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">Focus Review Words</h3>
                <span className="font-label-sm text-label-sm text-on-surface-variant">Adaptive list</span>
              </div>
              <div className="flex flex-col gap-space-xs">
                {(weakWords.length > 0 ? weakWords : questions.slice(0, 2)).map((w, i) => (
                  <div key={i} className="p-space-sm bg-surface-container-low rounded-xl flex items-center justify-between shadow-xs">
                    <div className="flex items-center gap-space-sm">
                      <div className="w-8 h-8 rounded-full bg-primary-fixed text-on-primary-fixed flex items-center justify-center font-bold font-label-md text-label-md">N5</div>
                      <div className="flex flex-col text-left">
                        <span className="font-headline-sm text-headline-sm font-bold text-on-surface">{w.kanji} <span className="text-primary font-furigana text-furigana">{w.furigana}</span></span>
                        <span className="font-label-md text-label-md text-on-surface-variant">{w.english}</span>
                      </div>
                    </div>
                    <button className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant active:scale-90">
                      <span className="material-symbols-outlined text-[18px]">volume_up</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-space-sm w-full">
              <button onClick={() => initMode(currentMode)} className="w-full py-space-sm rounded-full bg-primary text-on-primary font-label-lg text-label-lg font-bold shadow-md active:scale-95 transition-transform flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-[20px]">refresh</span>
                <span>Practise Again</span>
              </button>
              {onNavigate && (
                <button 
                  onClick={() => onNavigate('progress')}
                  className="w-full py-space-sm rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface font-label-lg text-label-lg font-bold shadow-xs active:scale-95 transition-transform flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-[20px] text-primary">workspace_premium</span>
                  <span>View Milestone Badges</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <DeckSelectorModal
        isOpen={isDeckModalOpen}
        activeDeck={activeDeck}
        learnedSet={learnedSet}
        onClose={() => setIsDeckModalOpen(false)}
        onSelectDeck={(deck) => {
          onSelectDeck?.(deck);
        }}
        onQuizDeck={(deck) => {
          onSelectDeck?.(deck);
        }}
      />

      <MilestoneCelebrationModal
        badge={newlyUnlockedBadge}
        onClose={() => setNewlyUnlockedBadge(null)}
        onViewDashboard={() => {
          setNewlyUnlockedBadge(null);
          onNavigate?.('progress');
        }}
      />
    </div>
  );
};
