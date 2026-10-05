import confetti from 'canvas-confetti';
import { THEMED_CATEGORIES, getBatchProgress } from './categories';
import { QuizStats, StreakInfo } from './statsStorage';

export type BadgeTier = 'bronze' | 'silver' | 'sakura' | 'fuji' | 'gold' | 'diamond' | 'mythic';

export interface MilestoneBadge {
  id: string;
  category: 'milestone' | 'category' | 'habit' | 'skill';
  title: string;
  kanjiTitle: string;
  icon: string;
  materialIcon: string;
  tier: BadgeTier;
  targetCount: number;
  description: string;
  hint: string;
  accentColor: string;
  bgGradient: string;
}

export interface BadgeStatus extends MilestoneBadge {
  unlocked: boolean;
  unlockedAt?: number; // timestamp
  currentProgress: number;
  progressPercent: number;
  isNew?: boolean;
}

export const MILESTONE_BADGES: MilestoneBadge[] = [
  // --- WORD COUNT MILESTONES ---
  {
    id: 'badge_10',
    category: 'milestone',
    title: 'First Steps',
    kanjiTitle: '第一歩',
    icon: '🌱',
    materialIcon: 'eco',
    tier: 'bronze',
    targetCount: 10,
    description: 'Took your first step into Japanese by learning 10 JLPT N5 words.',
    hint: 'Learn 10 words in Learn mode',
    accentColor: '#10b981',
    bgGradient: 'from-emerald-500/15 to-teal-500/5',
  },
  {
    id: 'badge_50',
    category: 'milestone',
    title: 'Torii Gate Traveler',
    kanjiTitle: '鳥居の旅人',
    icon: '⛩️',
    materialIcon: 'temple_buddhist',
    tier: 'silver',
    targetCount: 50,
    description: 'Passed beneath the sacred Torii gate by mastering your first full batch of 50 words!',
    hint: 'Learn 50 words (Lesson 1)',
    accentColor: '#ef4444',
    bgGradient: 'from-red-500/15 to-rose-500/5',
  },
  {
    id: 'badge_100',
    category: 'milestone',
    title: 'Cherry Blossom Scholar',
    kanjiTitle: '桜の学者',
    icon: '🌸',
    materialIcon: 'local_florist',
    tier: 'sakura',
    targetCount: 100,
    description: 'Triple digits unlocked! 100 essential words now bloom in your visual memory.',
    hint: 'Reach 100 learned words',
    accentColor: '#ec4899',
    bgGradient: 'from-pink-500/15 to-rose-500/5',
  },
  {
    id: 'badge_250',
    category: 'milestone',
    title: 'Mt. Fuji Ascender',
    kanjiTitle: '富士山登頂者',
    icon: '🗻',
    materialIcon: 'landscape',
    tier: 'fuji',
    targetCount: 250,
    description: 'Climbing above the clouds! A quarter of all JLPT N5 vocabulary conquered.',
    hint: 'Reach 250 learned words',
    accentColor: '#3b82f6',
    bgGradient: 'from-blue-500/15 to-indigo-500/5',
  },
  {
    id: 'badge_412',
    category: 'milestone',
    title: 'Halfway Hero',
    kanjiTitle: '中間地点の勇者',
    icon: '🏆',
    materialIcon: 'military_tech',
    tier: 'gold',
    targetCount: 412,
    description: '50% Mark Reached! You have mastered half of the entire JLPT N5 vocabulary.',
    hint: 'Reach 412 words (50% of 824)',
    accentColor: '#eab308',
    bgGradient: 'from-amber-500/20 to-yellow-500/5',
  },
  {
    id: 'badge_500',
    category: 'milestone',
    title: 'Master of 500',
    kanjiTitle: '五百の達人',
    icon: '⚡',
    materialIcon: 'bolt',
    tier: 'diamond',
    targetCount: 500,
    description: 'Surpassed 500 words! Natural Japanese conversations and manga begin to make sense.',
    hint: 'Reach 500 learned words',
    accentColor: '#06b6d4',
    bgGradient: 'from-cyan-500/20 to-sky-500/5',
  },
  {
    id: 'badge_824',
    category: 'milestone',
    title: 'N5 Grand Master',
    kanjiTitle: '完全制覇',
    icon: '👑',
    materialIcon: 'workspace_premium',
    tier: 'mythic',
    targetCount: 824,
    description: 'Grand Mastery! All 824 official JLPT N5 vocabulary words fully absorbed.',
    hint: 'Master all 824 words in the bank',
    accentColor: '#8b5cf6',
    bgGradient: 'from-purple-500/25 via-pink-500/20 to-amber-500/15',
  },

  // --- HABIT & STREAK BADGES ---
  {
    id: 'badge_streak_3',
    category: 'habit',
    title: 'Daily Spark',
    kanjiTitle: '毎日の火花',
    icon: '🔥',
    materialIcon: 'local_fire_department',
    tier: 'bronze',
    targetCount: 3,
    description: 'Studied for 3 consecutive days. Consistency builds language fluency!',
    hint: 'Maintain a 3-day study streak',
    accentColor: '#f97316',
    bgGradient: 'from-orange-500/15 to-amber-500/5',
  },
  {
    id: 'badge_streak_7',
    category: 'habit',
    title: 'Unstoppable Routine',
    kanjiTitle: '不屈の連続',
    icon: '⚡',
    materialIcon: 'electric_bolt',
    tier: 'gold',
    targetCount: 7,
    description: 'A full 7-day study streak! Habitual learning is the key to Japanese mastery.',
    hint: 'Maintain a 7-day study streak',
    accentColor: '#eab308',
    bgGradient: 'from-amber-500/20 to-orange-500/5',
  },

  // --- QUIZ & SKILL BADGES ---
  {
    id: 'badge_perfect_quiz',
    category: 'skill',
    title: 'Sharp Shooter',
    kanjiTitle: '百発百中',
    icon: '🎯',
    materialIcon: 'center_focus_strong',
    tier: 'silver',
    targetCount: 1,
    description: 'Answered 100% of quiz questions correctly in a practice session!',
    hint: 'Score 100% on any practice quiz session',
    accentColor: '#3b82f6',
    bgGradient: 'from-blue-500/15 to-cyan-500/5',
  },
  {
    id: 'badge_quiz_5',
    category: 'skill',
    title: 'Dojo Challenger',
    kanjiTitle: '道場の挑戦者',
    icon: '🧠',
    materialIcon: 'psychology',
    tier: 'bronze',
    targetCount: 5,
    description: 'Completed 5 practice quiz sessions to reinforce active recall.',
    hint: 'Complete 5 practice sessions',
    accentColor: '#8b5cf6',
    bgGradient: 'from-purple-500/15 to-indigo-500/5',
  },
  {
    id: 'badge_custom_visual',
    category: 'skill',
    title: 'Visual Curator',
    kanjiTitle: '視覚の収集家',
    icon: '🎨',
    materialIcon: 'palette',
    tier: 'silver',
    targetCount: 1,
    description: 'Explored custom mnemonic visuals to anchor words in memory.',
    hint: 'Upload or generate a custom memory image',
    accentColor: '#ec4899',
    bgGradient: 'from-pink-500/15 to-purple-500/5',
  },

  // --- THEMED CATEGORY MASTERY BADGES ---
  {
    id: 'badge_food',
    category: 'category',
    title: 'Tokyo Gourmet',
    kanjiTitle: '東京グルメ',
    icon: '🍜',
    materialIcon: 'ramen_dining',
    tier: 'gold',
    targetCount: 77, // Total food words
    description: 'Mastered all food, dining, and beverage vocabulary in JLPT N5.',
    hint: 'Complete 100% of the Food & Dining category',
    accentColor: '#f97316',
    bgGradient: 'from-orange-500/20 to-red-500/5',
  },
  {
    id: 'badge_action',
    category: 'category',
    title: 'Action Master',
    kanjiTitle: '行動の達人',
    icon: '🏃',
    materialIcon: 'directions_run',
    tier: 'gold',
    targetCount: 97, // Total action verbs
    description: 'Learned every fundamental movement, travel, and action verb in N5.',
    hint: 'Complete 100% of the Action & Motion category',
    accentColor: '#3b82f6',
    bgGradient: 'from-blue-500/20 to-indigo-500/5',
  },
  {
    id: 'badge_people',
    category: 'category',
    title: 'Social Circle',
    kanjiTitle: '人の輪',
    icon: '👥',
    materialIcon: 'groups',
    tier: 'silver',
    targetCount: 63,
    description: 'Mastered all people, family, profession, and relationship terms.',
    hint: 'Complete 100% of People & Family words',
    accentColor: '#8b5cf6',
    bgGradient: 'from-purple-500/15 to-pink-500/5',
  },
  {
    id: 'badge_travel',
    category: 'category',
    title: 'Shinkansen Explorer',
    kanjiTitle: '新幹線探検家',
    icon: '🚅',
    materialIcon: 'train',
    tier: 'silver',
    targetCount: 75,
    description: 'Ready to travel around Tokyo, Kyoto, and beyond with all location terms mastered.',
    hint: 'Complete 100% of Places & Travel words',
    accentColor: '#06b6d4',
    bgGradient: 'from-cyan-500/15 to-emerald-500/5',
  },
];

const STORAGE_KEY_UNLOCKED_BADGES = 'jlpt_unlocked_badges_v1';

export function getUnlockedBadgesMap(): Record<string, number> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_UNLOCKED_BADGES);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to read unlocked badges', e);
  }
  return {};
}

export function saveUnlockedBadge(badgeId: string): number {
  const map = getUnlockedBadgesMap();
  if (!map[badgeId]) {
    map[badgeId] = Date.now();
    try {
      localStorage.setItem(STORAGE_KEY_UNLOCKED_BADGES, JSON.stringify(map));
    } catch (e) {
      console.error('Failed to save unlocked badge', e);
    }
  }
  return map[badgeId];
}

/**
 * Evaluates user progress and unlocks any eligible badges that haven't been unlocked yet.
 * Returns an array of newly unlocked badges so a celebration can be shown.
 */
export function checkAndUnlockNewBadges(
  learnedCount: number,
  learnedSet: Set<number>,
  quizStats: QuizStats,
  streakInfo: StreakInfo,
  hasCustomImages: boolean = false
): MilestoneBadge[] {
  const currentUnlocked = getUnlockedBadgesMap();
  const newlyUnlocked: MilestoneBadge[] = [];

  for (const badge of MILESTONE_BADGES) {
    if (currentUnlocked[badge.id]) continue; // Already unlocked

    let shouldUnlock = false;

    // Check criteria
    switch (badge.id) {
      case 'badge_10':
        shouldUnlock = learnedCount >= 10;
        break;
      case 'badge_50':
        shouldUnlock = learnedCount >= 50;
        break;
      case 'badge_100':
        shouldUnlock = learnedCount >= 100;
        break;
      case 'badge_250':
        shouldUnlock = learnedCount >= 250;
        break;
      case 'badge_412':
        shouldUnlock = learnedCount >= 412;
        break;
      case 'badge_500':
        shouldUnlock = learnedCount >= 500;
        break;
      case 'badge_824':
        shouldUnlock = learnedCount >= 824;
        break;
      case 'badge_streak_3':
        shouldUnlock = streakInfo.currentStreak >= 3 || streakInfo.longestStreak >= 3;
        break;
      case 'badge_streak_7':
        shouldUnlock = streakInfo.currentStreak >= 7 || streakInfo.longestStreak >= 7;
        break;
      case 'badge_perfect_quiz':
        shouldUnlock = quizStats.perfectQuizzes > 0;
        break;
      case 'badge_quiz_5':
        shouldUnlock = quizStats.totalQuizzes >= 5;
        break;
      case 'badge_custom_visual':
        shouldUnlock = hasCustomImages;
        break;
      case 'badge_food': {
        const cat = THEMED_CATEGORIES.find(c => c.id === 'food');
        if (cat) {
          const { learned, total } = getBatchProgress(cat.wordIds, learnedSet);
          shouldUnlock = total > 0 && learned >= total;
        }
        break;
      }
      case 'badge_action': {
        const cat = THEMED_CATEGORIES.find(c => c.id === 'action');
        if (cat) {
          const { learned, total } = getBatchProgress(cat.wordIds, learnedSet);
          shouldUnlock = total > 0 && learned >= total;
        }
        break;
      }
      case 'badge_people': {
        const cat = THEMED_CATEGORIES.find(c => c.id === 'people');
        if (cat) {
          const { learned, total } = getBatchProgress(cat.wordIds, learnedSet);
          shouldUnlock = total > 0 && learned >= total;
        }
        break;
      }
      case 'badge_travel': {
        const cat = THEMED_CATEGORIES.find(c => c.id === 'travel');
        if (cat) {
          const { learned, total } = getBatchProgress(cat.wordIds, learnedSet);
          shouldUnlock = total > 0 && learned >= total;
        }
        break;
      }
    }

    if (shouldUnlock) {
      saveUnlockedBadge(badge.id);
      newlyUnlocked.push(badge);
    }
  }

  return newlyUnlocked;
}

/**
 * Returns all badges with their live progress percentage and unlocked status.
 */
export function getAllBadgesWithStatus(
  learnedCount: number,
  learnedSet: Set<number>,
  quizStats: QuizStats,
  streakInfo: StreakInfo,
  hasCustomImages: boolean = false
): BadgeStatus[] {
  const unlockedMap = getUnlockedBadgesMap();

  return MILESTONE_BADGES.map(badge => {
    const isUnlocked = !!unlockedMap[badge.id];
    let currentProgress = 0;

    switch (badge.id) {
      case 'badge_10':
      case 'badge_50':
      case 'badge_100':
      case 'badge_250':
      case 'badge_412':
      case 'badge_500':
      case 'badge_824':
        currentProgress = Math.min(learnedCount, badge.targetCount);
        break;
      case 'badge_streak_3':
      case 'badge_streak_7':
        currentProgress = Math.min(Math.max(streakInfo.currentStreak, streakInfo.longestStreak), badge.targetCount);
        break;
      case 'badge_perfect_quiz':
        currentProgress = Math.min(quizStats.perfectQuizzes, badge.targetCount);
        break;
      case 'badge_quiz_5':
        currentProgress = Math.min(quizStats.totalQuizzes, badge.targetCount);
        break;
      case 'badge_custom_visual':
        currentProgress = hasCustomImages ? 1 : 0;
        break;
      case 'badge_food': {
        const cat = THEMED_CATEGORIES.find(c => c.id === 'food');
        if (cat) {
          const { learned } = getBatchProgress(cat.wordIds, learnedSet);
          currentProgress = learned;
        }
        break;
      }
      case 'badge_action': {
        const cat = THEMED_CATEGORIES.find(c => c.id === 'action');
        if (cat) {
          const { learned } = getBatchProgress(cat.wordIds, learnedSet);
          currentProgress = learned;
        }
        break;
      }
      case 'badge_people': {
        const cat = THEMED_CATEGORIES.find(c => c.id === 'people');
        if (cat) {
          const { learned } = getBatchProgress(cat.wordIds, learnedSet);
          currentProgress = learned;
        }
        break;
      }
      case 'badge_travel': {
        const cat = THEMED_CATEGORIES.find(c => c.id === 'travel');
        if (cat) {
          const { learned } = getBatchProgress(cat.wordIds, learnedSet);
          currentProgress = learned;
        }
        break;
      }
    }

    const pct = badge.targetCount > 0 
      ? Math.min(100, Math.round((currentProgress / badge.targetCount) * 100))
      : 0;

    return {
      ...badge,
      unlocked: isUnlocked,
      unlockedAt: unlockedMap[badge.id],
      currentProgress,
      progressPercent: isUnlocked ? 100 : pct,
    };
  });
}

/**
 * Triggers a multi-stage celebratory confetti explosion
 */
export function fireMilestoneCelebration() {
  // Fire multiple waves
  try {
    // Wave 1: Center burst
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#f43f5e', '#ec4899', '#8b5cf6', '#eab308', '#10b981'],
    });

    // Wave 2: Left burst
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#3b82f6', '#06b6d4', '#ec4899', '#f97316'],
      });
    }, 250);

    // Wave 3: Right burst
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#eab308', '#10b981', '#f43f5e', '#8b5cf6'],
      });
    }, 400);
  } catch (err) {
    console.warn('Confetti could not be fired', err);
  }
}
