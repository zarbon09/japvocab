import React, { useState, useMemo } from 'react';
import { VOCAB_BANK } from '../data';
import { 
  getSavedWordIndex, 
  getLearnedWordIds, 
  getNextUnlearnedIndex 
} from '../utils/progressStorage';
import { 
  THEMED_CATEGORIES, 
  LESSON_BATCHES, 
  DeckFilter,
  getBatchProgress 
} from '../utils/categories';
import { DeckSelectorModal } from './DeckSelectorModal';
import { getAllBadgesWithStatus } from '../utils/badges';
import { getQuizStats, getStreakInfo } from '../utils/statsStorage';

interface HomeViewProps {
  onChangeView?: (view: string, wordIndex?: number, deck?: DeckFilter) => void;
  activeDeck?: DeckFilter;
  onSelectDeck?: (deck: DeckFilter) => void;
  onOpenSupport?: (tab?: 'support' | 'hall-of-fame' | 'feedback') => void;
}

const DEFAULT_DECK: DeckFilter = { type: 'all', title: 'All 824 Words' };

export const HomeView: React.FC<HomeViewProps> = ({ 
  onChangeView,
  activeDeck = DEFAULT_DECK,
  onSelectDeck,
  onOpenSupport
}) => {
  const [showSettings, setShowSettings] = useState(false);
  const [showRomaji, setShowRomaji] = useState(true);
  const [autoAudio, setAutoAudio] = useState(true);
  const [dailyGoal, setDailyGoal] = useState(10);
  const [deckTab, setDeckTab] = useState<'lessons' | 'themes'>('lessons');
  const [isDeckModalOpen, setIsDeckModalOpen] = useState(false);

  const savedIndex = useMemo(() => getSavedWordIndex(VOCAB_BANK.length), []);
  const learnedIds = useMemo(() => getLearnedWordIds(), []);
  const nextWord = VOCAB_BANK[savedIndex] || VOCAB_BANK[0];
  const completedToday = Math.min(learnedIds.size, dailyGoal);

  const quizStats = useMemo(() => getQuizStats(), []);
  const streakInfo = useMemo(() => getStreakInfo(), []);
  const badgesWithStatus = useMemo(() => {
    return getAllBadgesWithStatus(learnedIds.size, learnedIds, quizStats, streakInfo);
  }, [learnedIds, quizStats, streakInfo]);

  const unlockedBadgesCount = useMemo(() => {
    return badgesWithStatus.filter(b => b.unlocked).length;
  }, [badgesWithStatus]);

  const nextMilestoneBadge = useMemo(() => {
    return badgesWithStatus.find(b => !b.unlocked && b.category === 'milestone') || null;
  }, [badgesWithStatus]);

  return (
    <div className="flex flex-col w-full pb-8 select-none">
      {/* Interactive View State Controller */}
      <div className="px-margin pt-space-md flex items-center justify-end">
        <div className="flex items-center gap-space-xs">
          <button
            onClick={() => setShowSettings(true)}
            className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface active:scale-90 transition-transform shadow-sm"
            title="Settings"
          >
            <span className="material-symbols-outlined text-[18px]">settings</span>
          </button>
        </div>
      </div>

      {/* Intro Greeting */}
      <header className="px-margin pt-space-sm pb-space-xs">
        <div className="flex items-baseline justify-between">
          <h2 className="font-headline-md text-headline-md text-on-surface tracking-tight">
            Welcome back, Learner! <span className="inline-block hover:rotate-12 transition-transform">🌸</span>
          </h2>
        </div>
        <div className="mt-space-xs flex items-center gap-space-xs">
          <span className="inline-flex items-center gap-1 bg-primary-fixed text-on-primary-fixed-variant px-space-sm py-0.5 rounded-full font-label-sm text-label-sm font-semibold shadow-sm">
            <span className="material-symbols-outlined text-[12px]">auto_awesome</span>
            See it. Hear it. Remember it.
          </span>
        </div>
      </header>

      {/* TODAY'S GOAL HERO CARD */}
      <section className="px-margin pt-space-md">
        <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-md transition-all">
          <div className="flex items-center justify-between pb-space-xs">
            <div className="flex items-center gap-space-xs">
              <span className="w-1.5 h-4 bg-primary rounded-full"></span>
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-bold">Today's Goal</span>
            </div>
            <div className="flex items-center gap-1 bg-secondary-container px-space-sm py-0.5 rounded-full shadow-sm">
              <span className="text-xs">🔥</span>
              <span className="font-label-sm text-label-sm font-bold text-on-secondary-container">5 Day Streak</span>
            </div>
          </div>
          <div className="mt-space-xs flex items-baseline justify-between">
            <div className="flex items-baseline gap-space-xs">
              <span className="font-display-lg-mobile text-display-lg-mobile font-bold text-on-surface tracking-tight">{completedToday}</span>
              <span className="text-on-surface-variant font-headline-md text-headline-md font-medium">/</span>
              <span className="text-on-surface-variant font-headline-md text-headline-md font-medium">{dailyGoal} words</span>
            </div>
            <span className="font-label-md text-label-md text-primary font-bold">{Math.round((completedToday / dailyGoal) * 100)}% Complete</span>
          </div>
          <div className="mt-space-sm w-full bg-surface-container-high h-3 rounded-full overflow-hidden p-0.5 flex items-center">
            <div
              className="h-full bg-gradient-to-r from-primary-container via-primary to-secondary rounded-full transition-all duration-700 ease-out"
              style={{ width: `${Math.min(100, (completedToday / dailyGoal) * 100)}%` }}
            ></div>
          </div>
          <div className="mt-space-md flex items-center justify-between gap-space-sm pt-space-xs">
            <div className="flex items-center gap-2 text-on-surface-variant min-w-0">
              <span className="material-symbols-outlined text-[20px] text-primary shrink-0">flag</span>
              <p className="font-label-md text-label-md truncate">Next up: <span className="font-semibold text-on-surface">{nextWord.kanji} ({nextWord.romaji}) • #{nextWord.id}</span></p>
            </div>
            <button onClick={() => onChangeView?.('learn', savedIndex)} className="shrink-0 bg-primary hover:bg-primary-container active:scale-95 transition-all text-on-primary font-label-lg text-label-lg px-space-md py-space-sm rounded-full shadow-sm flex items-center gap-1.5">
              <span>🌸 Continue #{nextWord.id}</span>
              <span className="material-symbols-outlined text-[18px]">play_arrow</span>
            </button>
          </div>
        </div>
      </section>

      {/* METHOD HERO: VISUAL FLASHCARD TEASER */}
      <section className="px-margin pt-space-md">
        <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-md border border-surface-variant/20 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between pb-space-sm">
            <div className="flex items-center gap-space-xs">
              <span className="font-label-sm text-label-sm bg-tertiary-fixed text-on-tertiary-fixed px-space-sm py-0.5 rounded-full font-bold">Visual Anchor</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant font-semibold">Word #12</span>
            </div>
            <span className="font-label-sm text-label-sm text-secondary font-bold flex items-center gap-0.5">
              <span className="material-symbols-outlined text-[14px]">visibility</span>
              See • Hear • Retain
            </span>
          </div>
          <div 
            onClick={() => onChangeView?.('learn', 11)} 
            className="cursor-pointer group relative w-full h-44 rounded-xl overflow-hidden bg-surface-container-low flex flex-col justify-end p-space-md shadow-inner"
            title="Tap to study this word in Learn view"
          >
            <div
              className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
              style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDtPnNoWMPYpzhQ2sDZWB31DrgKSZXUCvEjgeC5EV_lpXQcX6g1AZXH28GdLl5GKrTbcdIC_yg25n36rHRHCc9E-6PLBeBmhZLhjyIg0FgHlfgHfGXYeunB0XpS-5MG9rhV6nrzBJ3hQpzmCm_4MAvkJDr9VlJqMhWCPx7NIJnDxEut0PGOrEWJTaVOwCmvBo2OHgV70kPARZwVaJKIbr39VIOsSxIyQbrE6KFqWf4AOdraz1FBn5Myuw')" }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/85 via-inverse-surface/30 to-transparent"></div>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                if ('speechSynthesis' in window) {
                  window.speechSynthesis.cancel();
                  const utter = new SpeechSynthesisUtterance('開ける');
                  utter.lang = 'ja-JP';
                  window.speechSynthesis.speak(utter);
                }
              }}
              aria-label="Play pronunciation"
              className="absolute top-space-sm right-space-sm bg-surface-container-lowest/90 hover:bg-surface-container-lowest active:scale-90 transition-transform p-2.5 rounded-full shadow-md flex items-center justify-center text-primary"
            >
              <span className="material-symbols-outlined text-[20px]">volume_up</span>
            </button>
            <div className="relative z-10 flex items-end justify-between">
              <div className="text-inverse-on-surface">
                <div className="flex items-baseline gap-space-xs">
                  <ruby className="font-kanji-hero-mobile text-kanji-hero-mobile font-bold tracking-wide">
                    開ける
                    <rt className="font-furigana text-furigana text-primary-fixed tracking-normal">あける</rt>
                  </ruby>
                </div>
                {showRomaji && <p className="font-label-md text-label-md text-surface-container-highest tracking-wide mt-0.5">akeru • Ichidan Verb</p>}
              </div>
              <div className="bg-surface-container-lowest/95 backdrop-blur-md px-space-sm py-1 rounded-xl text-on-surface shadow-sm">
                <span className="font-label-sm text-label-sm font-bold text-primary block">Meaning</span>
                <span className="font-body-md text-body-md font-semibold">to open</span>
              </div>
            </div>
          </div>
          <div className="mt-space-sm grid grid-cols-4 gap-space-xs text-center pt-space-xs">
            <div className="bg-surface-container-low py-1.5 px-1 rounded-lg">
              <span className="block font-label-sm text-label-sm font-bold text-primary">1. SEE</span>
              <span className="block font-label-sm text-label-sm text-on-surface-variant scale-90">Scene</span>
            </div>
            <div className="bg-surface-container-low py-1.5 px-1 rounded-lg">
              <span className="block font-label-sm text-label-sm font-bold text-primary">2. DECODE</span>
              <span className="block font-label-sm text-label-sm text-on-surface-variant scale-90">Kanji</span>
            </div>
            <div className="bg-surface-container-low py-1.5 px-1 rounded-lg">
              <span className="block font-label-sm text-label-sm font-bold text-primary">3. HEAR</span>
              <span className="block font-label-sm text-label-sm text-on-surface-variant scale-90">Tokyo Tone</span>
            </div>
            <div className="bg-surface-container-low py-1.5 px-1 rounded-lg">
              <span className="block font-label-sm text-label-sm font-bold text-secondary">4. RECALL</span>
              <span className="block font-label-sm text-label-sm text-on-surface-variant scale-90">Active Quiz</span>
            </div>
          </div>
        </div>
      </section>

      {/* MILESTONE BADGES & PROGRESS QUICK DASHBOARD ACCESS */}
      <section className="px-margin pt-space-md">
        <div 
          onClick={() => onChangeView?.('progress')}
          className="cursor-pointer group p-space-md rounded-2xl bg-surface-container-lowest border border-surface-variant/25 shadow-md hover:shadow-lg transition-all flex items-center justify-between gap-space-sm relative overflow-hidden"
        >
          {/* Subtle gradient glow */}
          <div className="absolute top-0 right-0 w-40 h-full bg-gradient-to-l from-primary/10 to-transparent pointer-events-none" />

          <div className="flex items-center gap-space-md min-w-0 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-primary-fixed flex items-center justify-center text-2xl shadow-xs group-hover:scale-110 transition-transform shrink-0">
              <span>🏆</span>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-label-sm text-[11px] font-bold uppercase tracking-wider text-primary">
                  Milestone Badges & Trophy Case
                </span>
                <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold text-[10px]">
                  {unlockedBadgesCount} / {badgesWithStatus.length}
                </span>
              </div>
              <h4 className="font-bold text-sm text-on-surface mt-0.5 truncate">
                {nextMilestoneBadge 
                  ? `Next Target: ${nextMilestoneBadge.icon} ${nextMilestoneBadge.title} (${nextMilestoneBadge.targetCount} words)` 
                  : 'All Milestones Mastered!'}
              </h4>
              <p className="text-[11px] text-on-surface-variant truncate">
                {nextMilestoneBadge 
                  ? `${Math.max(0, nextMilestoneBadge.targetCount - learnedIds.size)} words to unlock • Tap to view full dashboard` 
                  : 'Tap to view your trophy cabinet'}
              </p>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-1 text-primary font-bold text-xs relative z-10">
            <span className="hidden sm:inline">Stats</span>
            <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </div>
        </div>
      </section>

      {/* THEMED CATEGORIES & LESSON BATCHES SECTION */}
      <section className="px-margin pt-space-md">
        <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-md">
          <div className="flex items-center justify-between pb-space-xs">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-4 bg-primary rounded-full"></span>
              <div>
                <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">Curated Study Decks</h3>
                <p className="font-label-sm text-label-sm text-on-surface-variant">Master words by 50-word batches or semantic themes</p>
              </div>
            </div>
            <button 
              onClick={() => setIsDeckModalOpen(true)}
              className="px-2.5 py-1 rounded-full bg-surface-container hover:bg-surface-container-high text-primary font-bold text-xs flex items-center gap-1 transition-colors"
            >
              <span>View All</span>
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </button>
          </div>

          {/* Tab selector */}
          <div className="flex gap-2 my-space-sm bg-surface-container-low p-1 rounded-xl">
            <button
              onClick={() => setDeckTab('lessons')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                deckTab === 'lessons'
                  ? 'bg-surface-container-lowest text-primary shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">calendar_view_day</span>
              <span>17 Lesson Batches</span>
            </button>
            <button
              onClick={() => setDeckTab('themes')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                deckTab === 'themes'
                  ? 'bg-surface-container-lowest text-primary shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">category</span>
              <span>11 Themed Categories</span>
            </button>
          </div>

          {/* Lessons / Themes List */}
          {deckTab === 'lessons' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-80 overflow-y-auto pr-1">
              {LESSON_BATCHES.slice(0, 6).map(batch => {
                const { learned, total, pct } = getBatchProgress(batch.wordIds, learnedIds);
                return (
                  <div
                    key={batch.id}
                    className="p-3 rounded-xl bg-surface-container-low hover:bg-surface-container border border-surface-variant/20 transition-all flex flex-col justify-between gap-2"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-on-surface">{batch.title} ({batch.range})</span>
                        <span className="text-[11px] font-bold text-primary">{pct}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden mt-1.5">
                        <div 
                          className="h-full bg-primary rounded-full transition-all duration-300" 
                          style={{ width: `${pct}%` }} 
                        />
                      </div>
                      <span className="text-[10px] text-on-surface-variant mt-1 block">
                        {learned} of {total} words learned
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 pt-1">
                      <button
                        onClick={() => {
                          const deck: DeckFilter = { type: 'lesson', id: batch.id, title: `${batch.title} (${batch.range})` };
                          onSelectDeck?.(deck);
                          onChangeView?.('learn', undefined, deck);
                        }}
                        className="flex-1 py-1 px-2.5 rounded-lg bg-primary text-on-primary text-xs font-bold shadow-xs active:scale-95 transition-transform flex items-center justify-center gap-1"
                      >
                        <span className="material-symbols-outlined text-[14px]">auto_stories</span>
                        <span>Study</span>
                      </button>
                      <button
                        onClick={() => {
                          const deck: DeckFilter = { type: 'lesson', id: batch.id, title: `${batch.title} (${batch.range})` };
                          onSelectDeck?.(deck);
                          onChangeView?.('practise', undefined, deck);
                        }}
                        className="py-1 px-2.5 rounded-lg bg-surface-container text-on-surface hover:bg-secondary hover:text-on-secondary text-xs font-bold transition-colors flex items-center justify-center gap-1"
                        title="Quiz this lesson"
                      >
                        <span className="material-symbols-outlined text-[14px]">quiz</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-80 overflow-y-auto pr-1">
              {THEMED_CATEGORIES.slice(0, 6).map(category => {
                const { learned, total, pct } = getBatchProgress(category.wordIds, learnedIds);
                return (
                  <div
                    key={category.id}
                    className="p-3 rounded-xl bg-surface-container-low hover:bg-surface-container border border-surface-variant/20 transition-all flex flex-col justify-between gap-2"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-white shrink-0 shadow-xs"
                            style={{ backgroundColor: category.color }}
                          >
                            <span className="material-symbols-outlined text-[16px]">{category.icon}</span>
                          </div>
                          <div>
                            <span className="font-bold text-xs text-on-surface block leading-tight">{category.title}</span>
                            <span className="text-[10px] text-on-surface-variant">{category.count} words</span>
                          </div>
                        </div>
                        <span className="text-[11px] font-bold text-primary">{pct}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden mt-2">
                        <div 
                          className="h-full rounded-full transition-all duration-300" 
                          style={{ width: `${pct}%`, backgroundColor: category.color }} 
                        />
                      </div>
                      <span className="text-[10px] text-on-surface-variant mt-1 block">
                        {learned} of {total} words learned
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 pt-1">
                      <button
                        onClick={() => {
                          const deck: DeckFilter = { type: 'category', id: category.id, title: category.title };
                          onSelectDeck?.(deck);
                          onChangeView?.('learn', undefined, deck);
                        }}
                        className="flex-1 py-1 px-2.5 rounded-lg bg-primary text-on-primary text-xs font-bold shadow-xs active:scale-95 transition-transform flex items-center justify-center gap-1"
                      >
                        <span className="material-symbols-outlined text-[14px]">auto_stories</span>
                        <span>Study</span>
                      </button>
                      <button
                        onClick={() => {
                          const deck: DeckFilter = { type: 'category', id: category.id, title: category.title };
                          onSelectDeck?.(deck);
                          onChangeView?.('practise', undefined, deck);
                        }}
                        className="py-1 px-2.5 rounded-lg bg-surface-container text-on-surface hover:bg-secondary hover:text-on-secondary text-xs font-bold transition-colors flex items-center justify-center gap-1"
                        title="Quiz this category"
                      >
                        <span className="material-symbols-outlined text-[14px]">quiz</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-3 pt-2 border-t border-surface-variant/15 text-center">
            <button
              onClick={() => setIsDeckModalOpen(true)}
              className="text-xs font-bold text-primary hover:underline inline-flex items-center gap-1"
            >
              <span>Explore all 17 Lessons and 11 Themed Categories</span>
              <span className="material-symbols-outlined text-[14px]">open_in_new</span>
            </button>
          </div>
        </div>
      </section>

      {/* COMMUNITY CROWDFUNDING & SUPPORT SECTION */}
      <section className="px-gutter mb-space-xl">
        <div className="bg-gradient-to-br from-amber-500/10 via-yellow-500/5 to-surface-container-low rounded-3xl p-space-lg border border-amber-500/25 shadow-sm">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl select-none">🍵</span>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 dark:text-amber-300 block">
                  Community Funded & 100% Free
                </span>
                <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                  Help Unlock the Complete JLPT N4 Deck
                </h3>
              </div>
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-900 dark:text-amber-200 shrink-0">
              $1,000 Goal
            </span>
          </div>

          <p className="text-xs text-on-surface-variant leading-relaxed mb-3">
            This app is 100% free and ad-free. Our next mission is bringing the complete JLPT N4 curriculum (1,500+ illustrated flashcards, native audio, and mnemonics). Help us hit the $1,000 milestone to fund the development and keep it free for all learners forever!
          </p>

          {/* Milestone progress bar */}
          <div className="bg-surface-container-highest rounded-full h-2 overflow-hidden mb-1.5">
            <div 
              className="bg-gradient-to-r from-amber-500 to-[#FFDD00] h-full rounded-full transition-all duration-500" 
              style={{ width: '12%' }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-on-surface-variant font-medium mb-3">
            <span>Community Milestone</span>
            <span>Target: $1,000</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => onOpenSupport?.('support')}
              className="flex-1 min-w-[170px] py-2.5 px-4 rounded-xl bg-[#FFDD00] hover:bg-[#ffe338] text-neutral-900 font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all active:scale-95"
            >
              <span className="text-base">☕</span>
              <span>Buy Me a Coffee / Matcha</span>
              <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
            </button>
            <button
              onClick={() => onOpenSupport?.('hall-of-fame')}
              className="py-2.5 px-3.5 rounded-xl bg-surface-container text-on-surface hover:bg-surface-container-high font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              title="Milestone Backers Hall of Fame"
            >
              <span>🏆</span>
              <span>Supporter Wall</span>
            </button>
            <button
              onClick={() => onOpenSupport?.('feedback')}
              className="py-2.5 px-3 rounded-xl bg-surface-container text-on-surface hover:bg-surface-container-high font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              title="Suggestions & Feedback"
            >
              <span className="material-symbols-outlined text-[15px]">chat</span>
              <span>Contact</span>
            </button>
          </div>
        </div>
      </section>

      {/* SETTINGS MODAL */}
      <div className={`fixed inset-0 z-50 bg-black/40 backdrop-blur-xs transition-opacity duration-300 flex items-end justify-center ${showSettings ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className={`w-full max-w-md bg-surface-container-lowest rounded-t-3xl p-space-lg shadow-2xl transform transition-transform duration-300 ${showSettings ? 'translate-y-0' : 'translate-y-full'}`}>
          <div className="w-12 h-1.5 bg-surface-container-highest rounded-full mx-auto mb-space-md"></div>
          <div className="flex items-center justify-between pb-space-sm">
            <div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">Learning Preferences</h3>
              <p className="font-label-sm text-label-sm text-on-surface-variant">Customize your tactile study experience</p>
            </div>
            <button onClick={() => setShowSettings(false)} className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface hover:bg-surface-container-high transition-colors">
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
          <div className="mt-space-md flex flex-col gap-space-md">
            <div className="flex items-center justify-between py-1">
              <div>
                <span className="font-label-lg text-label-lg font-bold text-on-surface block">Show Romaji Pronunciation</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">Recommended for absolute beginners</span>
              </div>
              <button onClick={() => setShowRomaji(!showRomaji)} className={`w-12 h-7 rounded-full p-0.5 transition-colors relative ${showRomaji ? 'bg-primary' : 'bg-surface-container-highest'}`}>
                <div className={`w-6 h-6 bg-surface rounded-full shadow-sm transform transition-transform ${showRomaji ? 'translate-x-5' : 'translate-x-0'}`}></div>
              </button>
            </div>
            <div className="flex items-center justify-between py-1">
              <div>
                <span className="font-label-lg text-label-lg font-bold text-on-surface block">Auto-Play Tokyo Audio</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">Plays native pitch pronunciation upon reveal</span>
              </div>
              <button onClick={() => setAutoAudio(!autoAudio)} className={`w-12 h-7 rounded-full p-0.5 transition-colors relative ${autoAudio ? 'bg-primary' : 'bg-surface-container-highest'}`}>
                <div className={`w-6 h-6 bg-surface rounded-full shadow-sm transform transition-transform ${autoAudio ? 'translate-x-5' : 'translate-x-0'}`}></div>
              </button>
            </div>
            <div className="py-1">
              <span className="font-label-lg text-label-lg font-bold text-on-surface block mb-space-xs">Daily Word Target</span>
              <div className="grid grid-cols-3 gap-space-xs">
                {[5, 10, 20].map(val => (
                  <button key={val} onClick={() => setDailyGoal(val)} className={`py-space-sm rounded-xl font-label-md text-label-md font-bold transition-all ${dailyGoal === val ? 'bg-primary text-on-primary shadow-sm' : 'bg-surface-container-low text-on-surface'}`}>
                    {val} words
                  </button>
                ))}
              </div>
            </div>

            {/* Support button in settings */}
            <div className="pt-2 border-t border-surface-variant/20 flex items-center justify-between">
              <div>
                <span className="font-label-lg text-label-lg font-bold text-on-surface block">Support & Donations</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">Buy Me a Coffee & $1,000 N4 Goal</span>
              </div>
              <button 
                onClick={() => { setShowSettings(false); onOpenSupport?.(); }}
                className="py-1.5 px-3 bg-[#FFDD00] hover:bg-[#ffe338] text-neutral-900 font-bold text-xs rounded-full shadow-xs transition-transform active:scale-95 flex items-center gap-1"
              >
                <span>☕</span>
                <span>Support</span>
              </button>
            </div>

            {/* Download Source Code ZIP */}
            <div className="pt-2 border-t border-surface-variant/20 flex items-center justify-between">
              <div>
                <span className="font-label-lg text-label-lg font-bold text-on-surface block">Export Project</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">Full project ZIP with images & code</span>
              </div>
              <a 
                href="/api/download-zip"
                download="visual-japanese-n5.zip"
                className="py-1.5 px-3 bg-surface-container-high hover:bg-surface-container-highest border border-surface-variant/30 text-on-surface font-bold text-xs rounded-full shadow-xs transition-transform active:scale-95 flex items-center gap-1.5"
              >
                <svg className="w-3.5 h-3.5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                <span>Download ZIP</span>
              </a>
            </div>

            <button onClick={() => setShowSettings(false)} className="mt-space-xs w-full bg-primary hover:bg-primary-container active:scale-98 transition-all text-on-primary font-label-lg text-label-lg py-space-sm rounded-full shadow-md font-bold">
              Apply Settings
            </button>
          </div>
        </div>
      </div>

      <DeckSelectorModal
        isOpen={isDeckModalOpen}
        activeDeck={activeDeck}
        learnedSet={learnedIds}
        onClose={() => setIsDeckModalOpen(false)}
        onSelectDeck={(deck) => {
          onSelectDeck?.(deck);
          onChangeView?.('learn', undefined, deck);
        }}
        onQuizDeck={(deck) => {
          onSelectDeck?.(deck);
          onChangeView?.('practise', undefined, deck);
        }}
      />
    </div>
  );
};

