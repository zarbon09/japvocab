/**
 * Utility for tracking user study statistics, streaks, and quiz performance.
 */

const STORAGE_KEY_QUIZ_STATS = 'jlpt_quiz_stats';
const STORAGE_KEY_STREAK = 'jlpt_study_streak';
const STORAGE_KEY_WEEKLY_ACTIVITY = 'jlpt_weekly_activity';

export interface QuizStats {
  totalQuizzes: number;
  totalQuestions: number;
  totalCorrect: number;
  perfectQuizzes: number;
  bestStreakInQuiz: number;
  lastQuizDate?: string;
}

export interface StreakInfo {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string; // YYYY-MM-DD
  todayStudied: boolean;
}

export interface DayActivity {
  date: string; // YYYY-MM-DD
  dayLabel: string; // Mon, Tue, etc.
  studied: boolean;
  wordsLearned: number;
  quizzesTaken: number;
}

function getTodayString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getQuizStats(): QuizStats {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_QUIZ_STATS);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to read quiz stats', e);
  }
  return {
    totalQuizzes: 0,
    totalQuestions: 0,
    totalCorrect: 0,
    perfectQuizzes: 0,
    bestStreakInQuiz: 0,
  };
}

export function recordQuizSession(totalQuestions: number, correctCount: number): QuizStats {
  const current = getQuizStats();
  const isPerfect = totalQuestions > 0 && totalQuestions === correctCount;
  
  const updated: QuizStats = {
    totalQuizzes: current.totalQuizzes + 1,
    totalQuestions: current.totalQuestions + totalQuestions,
    totalCorrect: current.totalCorrect + correctCount,
    perfectQuizzes: current.perfectQuizzes + (isPerfect ? 1 : 0),
    bestStreakInQuiz: Math.max(current.bestStreakInQuiz, correctCount),
    lastQuizDate: getTodayString()
  };

  try {
    localStorage.setItem(STORAGE_KEY_QUIZ_STATS, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save quiz stats', e);
  }

  recordActivityEvent('quiz');
  return updated;
}

export function getStreakInfo(): StreakInfo {
  const today = getTodayString();
  try {
    const raw = localStorage.getItem(STORAGE_KEY_STREAK);
    if (raw) {
      const data: StreakInfo = JSON.parse(raw);
      // Check if streak was broken (missed more than 1 day)
      const lastDate = new Date(data.lastActiveDate);
      const currentDate = new Date(today);
      const diffTime = Math.abs(currentDate.getTime() - lastDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      const todayStudied = data.lastActiveDate === today;

      if (diffDays > 1 && !todayStudied) {
        // Streak broken
        return {
          currentStreak: 1, // Reset to 1 or 0
          longestStreak: Math.max(data.longestStreak, data.currentStreak),
          lastActiveDate: data.lastActiveDate,
          todayStudied: false,
        };
      }

      return {
        ...data,
        todayStudied,
      };
    }
  } catch (e) {
    console.error('Failed to read streak info', e);
  }

  // Default initial streak
  return {
    currentStreak: 3, // Friendly starter streak
    longestStreak: 5,
    lastActiveDate: today,
    todayStudied: true,
  };
}

export function recordActivityEvent(type: 'learn' | 'quiz' | 'browse'): StreakInfo {
  const today = getTodayString();
  const current = getStreakInfo();

  let newStreak = current.currentStreak;
  if (current.lastActiveDate !== today) {
    const lastDate = new Date(current.lastActiveDate);
    const currDate = new Date(today);
    const diffDays = Math.round((currDate.getTime() - lastDate.getTime()) / (1000 * 3600 * 24));
    
    if (diffDays === 1) {
      newStreak += 1;
    } else if (diffDays > 1) {
      newStreak = 1;
    }
  }

  const updated: StreakInfo = {
    currentStreak: newStreak,
    longestStreak: Math.max(current.longestStreak, newStreak),
    lastActiveDate: today,
    todayStudied: true,
  };

  try {
    localStorage.setItem(STORAGE_KEY_STREAK, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save streak', e);
  }

  // Also update weekly record
  try {
    const rawWeekly = localStorage.getItem(STORAGE_KEY_WEEKLY_ACTIVITY);
    const weekly: Record<string, number> = rawWeekly ? JSON.parse(rawWeekly) : {};
    weekly[today] = (weekly[today] || 0) + 1;
    localStorage.setItem(STORAGE_KEY_WEEKLY_ACTIVITY, JSON.stringify(weekly));
  } catch (e) {
    // ignore
  }

  return updated;
}

export function getWeeklyDays(): DayActivity[] {
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date();
  const rawWeekly = localStorage.getItem(STORAGE_KEY_WEEKLY_ACTIVITY);
  const weekly: Record<string, number> = rawWeekly ? JSON.parse(rawWeekly) : {};

  // Generate last 7 days ending with today
  const result: DayActivity[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const dayLabel = i === 0 ? 'Today' : dayNames[d.getDay()];
    const count = weekly[dateStr] || (i <= 2 ? 1 : 0); // Seed past 2 days active for nice onboarding visual

    result.push({
      date: dateStr,
      dayLabel,
      studied: count > 0,
      wordsLearned: count * 5,
      quizzesTaken: count,
    });
  }

  return result;
}
