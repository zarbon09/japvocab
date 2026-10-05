import React, { useState, useMemo } from 'react';
import { VOCAB_BANK } from '../data';
import { 
  getLearnedWordIds, 
  markWordsLearnedRange 
} from '../utils/progressStorage';
import { 
  THEMED_CATEGORIES, 
  LESSON_BATCHES, 
  DeckFilter,
  getBatchProgress 
} from '../utils/categories';
import { 
  getAllBadgesWithStatus, 
  BadgeStatus, 
  MilestoneBadge, 
  fireMilestoneCelebration 
} from '../utils/badges';
import { 
  getQuizStats, 
  getStreakInfo, 
  getWeeklyDays 
} from '../utils/statsStorage';
import { MilestoneCelebrationModal } from './MilestoneCelebrationModal';

interface ProgressDashboardViewProps {
  onNavigate?: (view: string, wordIndex?: number, deck?: DeckFilter) => void;
  onSelectDeck?: (deck: DeckFilter) => void;
  onOpenSupport?: (tab?: 'support' | 'hall-of-fame' | 'feedback') => void;
}

export const ProgressDashboardView: React.FC<ProgressDashboardViewProps> = ({
  onNavigate,
  onSelectDeck,
  onOpenSupport,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'badges' | 'categories' | 'lessons'>('overview');
  const [badgeFilter, setBadgeFilter] = useState<'all' | 'unlocked' | 'locked'>('all');
  const [selectedBadgeForDetail, setSelectedBadgeForDetail] = useState<MilestoneBadge | null>(null);
  const [celebrationBadge, setCelebrationBadge] = useState<MilestoneBadge | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Load fresh progress data
  const learnedIds = useMemo(() => getLearnedWordIds(), [refreshKey]);
  const quizStats = useMemo(() => getQuizStats(), [refreshKey]);
  const streakInfo = useMemo(() => getStreakInfo(), [refreshKey]);
  const weeklyDays = useMemo(() => getWeeklyDays(), [refreshKey]);

  const totalWords = VOCAB_BANK.length; // 824
  const masteredCount = learnedIds.size;
  const overallPercent = Math.min(100, Math.round((masteredCount / totalWords) * 100));
  const remainingCount = Math.max(0, totalWords - masteredCount);

  // Badge data
  const badgesWithStatus = useMemo(() => {
    return getAllBadgesWithStatus(masteredCount, learnedIds, quizStats, streakInfo);
  }, [masteredCount, learnedIds, quizStats, streakInfo, refreshKey]);

  const unlockedBadgesCount = useMemo(() => {
    return badgesWithStatus.filter(b => b.unlocked).length;
  }, [badgesWithStatus]);

  // Determine Learner Rank
  const learnerRank = useMemo(() => {
    if (masteredCount >= 824) return { title: 'N5 Grand Master', level: 'MAX', icon: '👑', color: '#8b5cf6' };
    if (masteredCount >= 500) return { title: 'High Apprentice', level: 'Lvl 7', icon: '⚡', color: '#06b6d4' };
    if (masteredCount >= 412) return { title: 'Halfway Champion', level: 'Lvl 6', icon: '🏆', color: '#eab308' };
    if (masteredCount >= 250) return { title: 'Fuji Climber', level: 'Lvl 5', icon: '🗻', color: '#3b82f6' };
    if (masteredCount >= 100) return { title: 'Sakura Scholar', level: 'Lvl 4', icon: '🌸', color: '#ec4899' };
    if (masteredCount >= 50) return { title: 'Torii Initiate', level: 'Lvl 3', icon: '⛩️', color: '#ef4444' };
    if (masteredCount >= 10) return { title: 'First Stepper', level: 'Lvl 2', icon: '🌱', color: '#10b981' };
    return { title: 'Novice Explorer', level: 'Lvl 1', icon: '🔰', color: '#64748b' };
  }, [masteredCount]);

  // Next milestone calculation
  const nextMilestone = useMemo(() => {
    const milestones = [10, 50, 100, 250, 412, 500, 824];
    for (const target of milestones) {
      if (masteredCount < target) {
        const badge = badgesWithStatus.find(b => b.targetCount === target && b.category === 'milestone');
        return {
          target,
          wordsNeeded: target - masteredCount,
          badge,
        };
      }
    }
    return null;
  }, [masteredCount, badgesWithStatus]);

  // Filtered badges
  const filteredBadges = useMemo(() => {
    if (badgeFilter === 'unlocked') return badgesWithStatus.filter(b => b.unlocked);
    if (badgeFilter === 'locked') return badgesWithStatus.filter(b => !b.unlocked);
    return badgesWithStatus;
  }, [badgesWithStatus, badgeFilter]);

  // Quiz accuracy
  const accuracyPercent = quizStats.totalQuestions > 0
    ? Math.round((quizStats.totalCorrect / quizStats.totalQuestions) * 100)
    : 0;

  // Test helper: add 10 words
  const handleSimulateStudy = () => {
    markWordsLearnedRange(1, Math.min(824, masteredCount + 10));
    setRefreshKey(k => k + 1);
  };

  return (
    <div className="flex flex-col w-full pb-16 select-none animate-fade-in">
      {/* HEADER BAR */}
      <header className="px-margin pt-space-md pb-space-xs">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-primary text-[22px]">insights</span>
              <span className="font-label-sm text-label-sm font-bold uppercase tracking-wider text-primary">
                Learner Analytics
              </span>
            </div>
            <h2 className="font-headline-md text-headline-md font-bold text-on-surface tracking-tight mt-0.5">
              Progress & Badges
            </h2>
          </div>

          {/* Unlocked badges pill */}
          <button
            onClick={() => setActiveTab('badges')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container hover:bg-surface-container-high transition-colors border border-surface-variant/30 shadow-xs"
          >
            <span className="text-base">🏆</span>
            <span className="font-label-sm text-label-sm font-bold text-on-surface">
              {unlockedBadgesCount} / {badgesWithStatus.length}
            </span>
          </button>
        </div>

        {/* NAVIGATION TABS */}
        <div className="flex gap-1.5 mt-space-sm bg-surface-container-low p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 ${
              activeTab === 'overview'
                ? 'bg-surface-container-lowest text-primary shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">dashboard</span>
            <span>Overview</span>
          </button>
          <button
            onClick={() => setActiveTab('badges')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 ${
              activeTab === 'badges'
                ? 'bg-surface-container-lowest text-primary shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">military_tech</span>
            <span>Trophies ({unlockedBadgesCount})</span>
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 ${
              activeTab === 'categories'
                ? 'bg-surface-container-lowest text-primary shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">category</span>
            <span>Themes</span>
          </button>
          <button
            onClick={() => setActiveTab('lessons')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 ${
              activeTab === 'lessons'
                ? 'bg-surface-container-lowest text-primary shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">route</span>
            <span>Roadmap</span>
          </button>
        </div>
      </header>

      {/* ================= OVERVIEW TAB ================= */}
      {activeTab === 'overview' && (
        <div className="px-margin flex flex-col gap-space-md pt-space-xs">
          {/* HERO LEVEL & MASTERY CARD */}
          <div className="relative rounded-2xl bg-surface-container-lowest p-space-md shadow-md border border-surface-variant/20 overflow-hidden">
            {/* Background decorative blob */}
            <div 
              className="absolute -top-12 -right-12 w-48 h-48 rounded-full blur-3xl opacity-20 pointer-events-none"
              style={{ backgroundColor: learnerRank.color }}
            />

            <div className="flex items-center justify-between pb-space-xs relative z-10">
              <div className="flex items-center gap-2">
                <div 
                  className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl shadow-xs"
                  style={{ backgroundColor: `${learnerRank.color}20`, color: learnerRank.color }}
                >
                  <span>{learnerRank.icon}</span>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-sm text-on-surface">{learnerRank.title}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md font-bold text-white shadow-xs" style={{ backgroundColor: learnerRank.color }}>
                      {learnerRank.level}
                    </span>
                  </div>
                  <p className="text-[11px] text-on-surface-variant">JLPT N5 Vocabulary Mastery</p>
                </div>
              </div>

              <div className="text-right">
                <span className="font-display-lg-mobile text-2xl font-black text-primary">
                  {overallPercent}%
                </span>
                <span className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                  Complete
                </span>
              </div>
            </div>

            {/* Big Progress Bar */}
            <div className="mt-space-sm relative z-10">
              <div className="flex items-center justify-between text-xs font-semibold text-on-surface mb-1">
                <span>{masteredCount} Words Mastered</span>
                <span className="text-on-surface-variant">{totalWords} Total</span>
              </div>
              <div className="w-full h-3.5 bg-surface-container-high rounded-full overflow-hidden p-0.5 flex items-center">
                <div 
                  className="h-full rounded-full transition-all duration-700 ease-out bg-gradient-to-r from-primary via-secondary to-tertiary shadow-sm"
                  style={{ width: `${overallPercent}%` }}
                />
              </div>
            </div>

            {/* Segmented breakdown: Mastered / Learning / Remaining */}
            <div className="grid grid-cols-3 gap-2 mt-space-md pt-space-xs border-t border-surface-variant/15 relative z-10">
              <div className="bg-surface-container-low p-2 rounded-xl text-center">
                <span className="flex items-center justify-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Mastered
                </span>
                <span className="text-lg font-bold text-on-surface block mt-0.5">{masteredCount}</span>
                <span className="text-[10px] text-on-surface-variant">{overallPercent}% of deck</span>
              </div>

              <div className="bg-surface-container-low p-2 rounded-xl text-center">
                <span className="flex items-center justify-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  In Deck
                </span>
                <span className="text-lg font-bold text-on-surface block mt-0.5">
                  {Math.min(50, totalWords - masteredCount)}
                </span>
                <span className="text-[10px] text-on-surface-variant">Active Batch</span>
              </div>

              <div className="bg-surface-container-low p-2 rounded-xl text-center">
                <span className="flex items-center justify-center gap-1 text-[11px] font-bold text-on-surface-variant">
                  <span className="w-2 h-2 rounded-full bg-surface-variant"></span>
                  Remaining
                </span>
                <span className="text-lg font-bold text-on-surface block mt-0.5">{remainingCount}</span>
                <span className="text-[10px] text-on-surface-variant">Ahead</span>
              </div>
            </div>

            {/* Next Milestone Banner */}
            {nextMilestone && nextMilestone.badge && (
              <div className="mt-space-md p-3 rounded-xl bg-primary-fixed/40 border border-primary-fixed flex items-center justify-between gap-3 relative z-10">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="text-2xl shrink-0">{nextMilestone.badge.icon}</span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Next Milestone</span>
                    </div>
                    <p className="font-bold text-xs text-on-surface truncate">
                      {nextMilestone.badge.title} ({nextMilestone.target} Words)
                    </p>
                    <p className="text-[10px] text-on-surface-variant">
                      {nextMilestone.wordsNeeded} more words to unlock
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => onNavigate?.('learn')}
                  className="shrink-0 py-1.5 px-3 rounded-lg bg-primary text-on-primary font-bold text-xs shadow-xs hover:bg-primary-container active:scale-95 transition-all flex items-center gap-1"
                >
                  <span>Learn</span>
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </button>
              </div>
            )}
          </div>

          {/* 2-COLUMN STATS: STREAK & QUIZ DOJO */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm">
            {/* STREAK & CALENDAR */}
            <div className="rounded-2xl bg-surface-container-lowest p-space-md shadow-md border border-surface-variant/20 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-lg">🔥</span>
                    <span className="font-label-sm text-label-sm font-bold uppercase tracking-wider text-on-surface-variant">
                      Study Habit
                    </span>
                  </div>
                  <span className="font-bold text-xs px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400">
                    Record: {streakInfo.longestStreak} Days
                  </span>
                </div>

                <div className="mt-2 flex items-baseline gap-2">
                  <span className="font-display-lg-mobile text-3xl font-extrabold text-on-surface">
                    {streakInfo.currentStreak}
                  </span>
                  <span className="text-sm font-bold text-on-surface-variant">Day Streak</span>
                </div>

                {/* 7-DAY ACTIVITY DOTS */}
                <div className="mt-3">
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">
                    Past 7 Days
                  </p>
                  <div className="grid grid-cols-7 gap-1">
                    {weeklyDays.map((day, idx) => (
                      <div key={idx} className="flex flex-col items-center gap-1">
                        <div 
                          className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold transition-all ${
                            day.studied 
                              ? 'bg-primary text-on-primary shadow-xs' 
                              : 'bg-surface-container-high text-on-surface-variant/50'
                          }`}
                        >
                          {day.studied ? '✓' : '·'}
                        </div>
                        <span className="text-[9px] font-medium text-on-surface-variant">
                          {day.dayLabel}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-surface-variant/15 flex items-center justify-between text-[11px] text-on-surface-variant">
                <span>Status:</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Active Today
                </span>
              </div>
            </div>

            {/* QUIZ ACCURACY DOJO */}
            <div className="rounded-2xl bg-surface-container-lowest p-space-md shadow-md border border-surface-variant/20 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-lg">🎯</span>
                    <span className="font-label-sm text-label-sm font-bold uppercase tracking-wider text-on-surface-variant">
                      Quiz Recall
                    </span>
                  </div>
                  <span className="font-bold text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400">
                    {quizStats.totalQuizzes} Quizzes Taken
                  </span>
                </div>

                <div className="mt-2 flex items-baseline gap-2">
                  <span className="font-display-lg-mobile text-3xl font-extrabold text-on-surface">
                    {quizStats.totalQuestions > 0 ? `${accuracyPercent}%` : '---'}
                  </span>
                  <span className="text-sm font-bold text-on-surface-variant">Accuracy Rate</span>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2 text-center">
                  <div className="bg-surface-container-low p-2 rounded-xl">
                    <span className="text-[10px] text-on-surface-variant block">Correct Answers</span>
                    <span className="text-base font-bold text-on-surface">{quizStats.totalCorrect}</span>
                  </div>
                  <div className="bg-surface-container-low p-2 rounded-xl">
                    <span className="text-[10px] text-on-surface-variant block">Perfect Scores</span>
                    <span className="text-base font-bold text-secondary">{quizStats.perfectQuizzes}</span>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-surface-variant/15 flex items-center justify-between">
                <span className="text-[11px] text-on-surface-variant">Reinforce memory:</span>
                <button
                  onClick={() => onNavigate?.('practise')}
                  className="py-1 px-2.5 rounded-lg bg-secondary text-on-secondary font-bold text-xs shadow-xs active:scale-95 transition-transform flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[14px]">psychology</span>
                  <span>Quiz Now</span>
                </button>
              </div>
            </div>
          </div>

          {/* FEATURED TROPHY SPOTLIGHT */}
          <div className="rounded-2xl bg-surface-container-lowest p-space-md shadow-md border border-surface-variant/20">
            <div className="flex items-center justify-between pb-space-xs">
              <div className="flex items-center gap-2">
                <span className="text-xl">🏆</span>
                <div>
                  <h3 className="font-bold text-sm text-on-surface">Milestone Showcase</h3>
                  <p className="text-[11px] text-on-surface-variant">Recent trophies and badges earned</p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('badges')}
                className="text-xs font-bold text-primary hover:underline flex items-center gap-0.5"
              >
                <span>View All ({badgesWithStatus.length})</span>
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-space-sm">
              {badgesWithStatus.slice(0, 4).map(badge => (
                <div
                  key={badge.id}
                  onClick={() => setSelectedBadgeForDetail(badge)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col items-center text-center relative overflow-hidden group ${
                    badge.unlocked
                      ? 'bg-surface-container-low hover:bg-surface-container border-primary-fixed shadow-xs hover:scale-102'
                      : 'bg-surface-container-lowest border-surface-variant/20 opacity-60 hover:opacity-80'
                  }`}
                >
                  {badge.unlocked && (
                    <div className="absolute top-1.5 right-1.5">
                      <span className="material-symbols-outlined text-primary text-[14px]">verified</span>
                    </div>
                  )}

                  <div className="text-3xl my-1 group-hover:scale-110 transition-transform">
                    {badge.icon}
                  </div>
                  <span className="font-bold text-xs text-on-surface truncate w-full mt-1">
                    {badge.title}
                  </span>
                  <span className="text-[10px] text-on-surface-variant truncate w-full">
                    {badge.unlocked ? 'Unlocked' : `${badge.progressPercent}%`}
                  </span>

                  {/* Tiny progress bar */}
                  {!badge.unlocked && (
                    <div className="w-full h-1 bg-surface-container-highest rounded-full mt-2 overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full" 
                        style={{ width: `${badge.progressPercent}%` }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* COMMUNITY SUPPORT & JLPT N4 FUNDING CARD */}
          <div className="rounded-2xl bg-gradient-to-br from-amber-500/10 via-yellow-500/5 to-surface-container-lowest p-space-md shadow-md border border-amber-500/25">
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">🍵</span>
                <div>
                  <h3 className="font-bold text-sm text-on-surface">Support Free Japanese & Unlock N4</h3>
                  <p className="text-[11px] text-on-surface-variant">Community Crowdfunding Stretch Goal</p>
                </div>
              </div>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-900 dark:text-amber-200">
                $1,000 Target
              </span>
            </div>

            <p className="text-xs text-on-surface-variant mb-3">
              This app is 100% free and ad-free. Our next mission is bringing the complete JLPT N4 curriculum (1,500+ illustrated flashcards, native audio, and mnemonics). Help us hit the $1,000 milestone to fund the development and keep it free for all learners forever!
            </p>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => onOpenSupport?.('support')}
                className="flex-1 py-2 px-3 rounded-xl bg-[#FFDD00] hover:bg-[#ffe338] text-neutral-900 font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-transform active:scale-95"
              >
                <span>☕</span>
                <span>Buy Me a Coffee</span>
              </button>
              <button
                onClick={() => onOpenSupport?.('hall-of-fame')}
                className="py-2 px-3 rounded-xl bg-surface-container text-on-surface hover:bg-surface-container-high font-bold text-xs flex items-center justify-center gap-1 transition-colors"
                title="View Backers Hall of Fame"
              >
                <span>🏆</span>
                <span>Supporter Wall</span>
              </button>
              <button
                onClick={() => onOpenSupport?.('feedback')}
                className="py-2 px-3 rounded-xl bg-surface-container text-on-surface hover:bg-surface-container-high font-bold text-xs flex items-center justify-center gap-1 transition-colors"
              >
                <span className="material-symbols-outlined text-[15px]">mail</span>
                <span>Feedback</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= BADGES & TROPHIES TAB ================= */}
      {activeTab === 'badges' && (
        <div className="px-margin flex flex-col gap-space-md pt-space-xs">
          {/* FILTER PILLS */}
          <div className="flex items-center justify-between bg-surface-container-lowest p-2 rounded-2xl shadow-xs border border-surface-variant/20">
            <div className="flex gap-1">
              {(['all', 'unlocked', 'locked'] as const).map(filter => (
                <button
                  key={filter}
                  onClick={() => setBadgeFilter(filter)}
                  className={`py-1 px-3 rounded-xl text-xs font-bold capitalize transition-all ${
                    badgeFilter === filter
                      ? 'bg-primary text-on-primary shadow-xs'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            <span className="text-xs font-semibold text-on-surface-variant pr-2">
              {filteredBadges.length} Badges
            </span>
          </div>

          {/* BADGES GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {filteredBadges.map(badge => (
              <div
                key={badge.id}
                onClick={() => setSelectedBadgeForDetail(badge)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden flex items-start gap-3.5 ${
                  badge.unlocked
                    ? 'bg-surface-container-lowest hover:bg-surface-container-low border-surface-variant/30 shadow-sm hover:shadow-md'
                    : 'bg-surface-container-lowest/60 border-dashed border-surface-variant/30 opacity-75 hover:opacity-100'
                }`}
              >
                {/* Badge Medal Visual */}
                <div 
                  className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center shrink-0 shadow-xs relative ${
                    badge.unlocked ? 'border-2' : 'grayscale'
                  }`}
                  style={{ 
                    backgroundColor: `${badge.accentColor}15`,
                    borderColor: badge.unlocked ? badge.accentColor : 'transparent'
                  }}
                >
                  <span className="text-2xl">{badge.icon}</span>
                  <span className="text-[9px] font-black uppercase tracking-wider text-on-surface-variant mt-0.5">
                    {badge.tier}
                  </span>
                </div>

                {/* Badge Info */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                      {badge.kanjiTitle}
                    </span>
                    {badge.unlocked ? (
                      <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                        <span className="material-symbols-outlined text-[12px]">check</span>
                        Unlocked
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-full">
                        {badge.progressPercent}%
                      </span>
                    )}
                  </div>

                  <h4 className="font-bold text-sm text-on-surface mt-0.5 truncate">
                    {badge.title}
                  </h4>
                  <p className="text-[11px] text-on-surface-variant line-clamp-2 mt-0.5">
                    {badge.description}
                  </p>

                  {/* Progress bar */}
                  <div className="mt-2 w-full">
                    <div className="flex items-center justify-between text-[10px] text-on-surface-variant mb-0.5">
                      <span>{badge.hint}</span>
                      <span className="font-semibold text-on-surface">
                        {badge.currentProgress} / {badge.targetCount}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-300"
                        style={{ 
                          width: `${badge.progressPercent}%`,
                          backgroundColor: badge.accentColor 
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= THEMED CATEGORIES TAB ================= */}
      {activeTab === 'categories' && (
        <div className="px-margin flex flex-col gap-space-sm pt-space-xs">
          <div className="bg-surface-container-lowest p-3 rounded-2xl shadow-xs border border-surface-variant/20 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-on-surface">11 Semantic Vocabulary Themes</h3>
              <p className="text-[11px] text-on-surface-variant">Master words clustered by real-life contexts</p>
            </div>
            <span className="text-xs font-bold text-primary">824 Words Total</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {THEMED_CATEGORIES.map(category => {
              const { learned, total, pct } = getBatchProgress(category.wordIds, learnedIds);
              const isCategoryComplete = total > 0 && learned === total;

              return (
                <div
                  key={category.id}
                  className="p-3.5 rounded-2xl bg-surface-container-lowest border border-surface-variant/20 shadow-sm flex flex-col justify-between gap-3 hover:shadow-md transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div 
                          className="w-9 h-9 rounded-xl flex items-center justify-center text-white shrink-0 shadow-xs"
                          style={{ backgroundColor: category.color }}
                        >
                          <span className="material-symbols-outlined text-[20px]">{category.icon}</span>
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="font-bold text-xs text-on-surface">{category.title}</h4>
                            {isCategoryComplete && (
                              <span className="text-xs">🏆</span>
                            )}
                          </div>
                          <p className="text-[10px] text-on-surface-variant line-clamp-1">{category.description}</p>
                        </div>
                      </div>
                      <span className="text-xs font-black text-primary">{pct}%</span>
                    </div>

                    <div className="w-full h-2 bg-surface-container-highest rounded-full overflow-hidden mt-2.5">
                      <div 
                        className="h-full rounded-full transition-all duration-300"
                        style={{ width: `${pct}%`, backgroundColor: category.color }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-on-surface-variant mt-1">
                      <span>{learned} of {total} words learned</span>
                      <span>{total - learned} remaining</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-1 border-t border-surface-variant/15">
                    <button
                      onClick={() => {
                        const deck: DeckFilter = { type: 'category', id: category.id, title: category.title };
                        onSelectDeck?.(deck);
                        onNavigate?.('learn', undefined, deck);
                      }}
                      className="flex-1 py-1.5 px-3 rounded-lg bg-primary text-on-primary font-bold text-xs shadow-xs active:scale-95 transition-transform flex items-center justify-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[14px]">auto_stories</span>
                      <span>Study Deck</span>
                    </button>
                    <button
                      onClick={() => {
                        const deck: DeckFilter = { type: 'category', id: category.id, title: category.title };
                        onSelectDeck?.(deck);
                        onNavigate?.('practise', undefined, deck);
                      }}
                      className="py-1.5 px-3 rounded-lg bg-surface-container hover:bg-secondary hover:text-on-secondary text-on-surface font-bold text-xs transition-colors flex items-center justify-center gap-1"
                      title="Quiz this category"
                    >
                      <span className="material-symbols-outlined text-[14px]">quiz</span>
                      <span>Quiz</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= 17 LESSON BATCHES ROADMAP TAB ================= */}
      {activeTab === 'lessons' && (
        <div className="px-margin flex flex-col gap-space-sm pt-space-xs">
          <div className="bg-surface-container-lowest p-3 rounded-2xl shadow-xs border border-surface-variant/20 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-on-surface">17 Sequential Lesson Batches</h3>
              <p className="text-[11px] text-on-surface-variant">50 words per batch for steady, manageable pacing</p>
            </div>
            <span className="text-xs font-bold text-secondary">Step-by-step</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {LESSON_BATCHES.map(batch => {
              const { learned, total, pct } = getBatchProgress(batch.wordIds, learnedIds);
              const isBatchComplete = total > 0 && learned === total;

              return (
                <div
                  key={batch.id}
                  className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                    isBatchComplete
                      ? 'bg-emerald-500/5 border-emerald-500/30'
                      : learned > 0
                        ? 'bg-surface-container-lowest border-primary/30 shadow-xs'
                        : 'bg-surface-container-lowest border-surface-variant/20'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div 
                          className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                            isBatchComplete 
                              ? 'bg-emerald-500 text-white' 
                              : learned > 0
                                ? 'bg-primary text-on-primary'
                                : 'bg-surface-container text-on-surface-variant'
                          }`}
                        >
                          {isBatchComplete ? '✓' : batch.number}
                        </div>
                        <div>
                          <span className="font-bold text-xs text-on-surface block leading-tight">
                            {batch.title}
                          </span>
                          <span className="text-[10px] text-on-surface-variant">
                            Words #{batch.range}
                          </span>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-primary">{pct}%</span>
                    </div>

                    <div className="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden mt-2.5">
                      <div 
                        className={`h-full rounded-full transition-all duration-300 ${
                          isBatchComplete ? 'bg-emerald-500' : 'bg-primary'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-on-surface-variant mt-1 block">
                      {learned} of {total} words learned
                    </span>
                  </div>

                  <div className="flex items-center gap-2 pt-1 border-t border-surface-variant/15">
                    <button
                      onClick={() => {
                        const deck: DeckFilter = { type: 'lesson', id: batch.id, title: `${batch.title} (${batch.range})` };
                        onSelectDeck?.(deck);
                        onNavigate?.('learn', batch.startId - 1, deck);
                      }}
                      className="flex-1 py-1.5 px-3 rounded-lg bg-primary text-on-primary font-bold text-xs shadow-xs active:scale-95 transition-transform flex items-center justify-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[14px]">play_arrow</span>
                      <span>Start Lesson</span>
                    </button>
                    <button
                      onClick={() => {
                        const deck: DeckFilter = { type: 'lesson', id: batch.id, title: `${batch.title} (${batch.range})` };
                        onSelectDeck?.(deck);
                        onNavigate?.('practise', undefined, deck);
                      }}
                      className="py-1.5 px-3 rounded-lg bg-surface-container hover:bg-secondary hover:text-on-secondary text-on-surface font-bold text-xs transition-colors flex items-center justify-center gap-1"
                      title="Quiz this batch"
                    >
                      <span className="material-symbols-outlined text-[14px]">quiz</span>
                      <span>Quiz</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* QUICK LEARNER TEST BAR */}
      <div className="px-margin pt-space-lg">
        <div className="p-3 rounded-xl bg-surface-container-low border border-surface-variant/20 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[18px]">tune</span>
            <span className="text-xs text-on-surface font-medium">Quick Practice Milestone Simulator:</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSimulateStudy}
              className="py-1 px-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-xs font-semibold text-on-surface transition-colors"
            >
              + Mark 10 Words
            </button>
            <button
              onClick={() => {
                if (badgesWithStatus.length > 0) {
                  setCelebrationBadge(badgesWithStatus[0]);
                }
              }}
              className="py-1 px-2.5 rounded-lg bg-primary-fixed hover:bg-primary-fixed-dim text-xs font-semibold text-on-primary-fixed transition-colors flex items-center gap-1"
            >
              <span>🎉 Preview Celebration</span>
            </button>
          </div>
        </div>
      </div>

      {/* DETAIL MODAL FOR CLICKED BADGE */}
      {selectedBadgeForDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
          <div 
            className="w-full max-w-sm rounded-3xl bg-surface-container-lowest border border-surface-variant/30 shadow-2xl p-6 text-center relative overflow-hidden animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedBadgeForDetail(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>

            <div 
              className="w-20 h-20 rounded-full mx-auto my-2 flex flex-col items-center justify-center shadow-md border-2"
              style={{ 
                backgroundColor: `${selectedBadgeForDetail.accentColor}20`,
                borderColor: selectedBadgeForDetail.accentColor 
              }}
            >
              <span className="text-3xl">{selectedBadgeForDetail.icon}</span>
              <span className="text-[9px] font-black uppercase text-on-surface-variant">
                {selectedBadgeForDetail.tier}
              </span>
            </div>

            <p className="font-bold text-xs uppercase tracking-widest text-primary mt-1">
              {selectedBadgeForDetail.kanjiTitle}
            </p>
            <h3 className="font-extrabold text-xl text-on-surface mt-0.5">
              {selectedBadgeForDetail.title}
            </h3>
            <p className="text-xs text-on-surface-variant mt-2 leading-relaxed px-2">
              {selectedBadgeForDetail.description}
            </p>

            <div className="mt-4 p-3 rounded-xl bg-surface-container-low border border-surface-variant/20 text-left">
              <span className="text-[10px] font-bold uppercase text-on-surface-variant block">Requirement</span>
              <p className="text-xs font-semibold text-on-surface mt-0.5">{selectedBadgeForDetail.hint}</p>
            </div>

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => {
                  fireMilestoneCelebration();
                  setSelectedBadgeForDetail(null);
                }}
                className="flex-1 py-2 px-3 rounded-xl bg-primary text-on-primary font-bold text-xs shadow-xs active:scale-95 transition-all flex items-center justify-center gap-1"
              >
                <span>🎉 Celebrate</span>
              </button>
              <button
                onClick={() => setSelectedBadgeForDetail(null)}
                className="py-2 px-4 rounded-xl bg-surface-container text-on-surface font-semibold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NEWLY UNLOCKED CELEBRATION MODAL */}
      {celebrationBadge && (
        <MilestoneCelebrationModal
          badge={celebrationBadge}
          onClose={() => setCelebrationBadge(null)}
          onViewDashboard={() => {
            setCelebrationBadge(null);
            setActiveTab('badges');
          }}
        />
      )}
    </div>
  );
};
