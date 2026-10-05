export interface Supporter {
  id: string;
  name: string;
  tier: 'founding' | 'patron' | 'backer';
  tierLabel: string;
  badgeIcon: string;
  message?: string;
  date: string;
  isCreator?: boolean;
}

const SUPPORTERS_STORAGE_KEY = 'visual_japanese_backers_list';

// Initial founding and early supporters seed
export const INITIAL_SUPPORTERS: Supporter[] = [
  {
    id: 'supporter-1',
    name: 'Amlen',
    tier: 'founding',
    tierLabel: 'Creator & Developer',
    badgeIcon: '👑',
    message: 'Dedicated to keeping Japanese learning visual and 100% free for everyone!',
    date: 'Oct 2026',
    isCreator: true,
  },
  {
    id: 'supporter-2',
    name: 'SakuraLearner_99',
    tier: 'patron',
    tierLabel: 'N4 Pioneer',
    badgeIcon: '🌸',
    message: 'Can’t wait for the N4 deck! Passed N5 with these mnemonics.',
    date: 'Oct 2026',
  },
  {
    id: 'supporter-3',
    name: 'Kenji & Maya',
    tier: 'patron',
    tierLabel: 'Matcha Patron',
    badgeIcon: '🍵',
    message: 'Arigato gozaimasu for making this completely free with no paywalls!',
    date: 'Oct 2026',
  },
  {
    id: 'supporter-4',
    name: 'TokyoDrifter',
    tier: 'backer',
    tierLabel: 'Milestone Backer',
    badgeIcon: '⚡',
    message: 'Rooting for the $1,000 N4 goal! Gambatte!',
    date: 'Oct 2026',
  },
];

export function getSupporters(): Supporter[] {
  if (typeof window === 'undefined') return INITIAL_SUPPORTERS;
  try {
    const raw = localStorage.getItem(SUPPORTERS_STORAGE_KEY);
    if (!raw) return INITIAL_SUPPORTERS;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch (err) {
    console.error('Error reading supporters:', err);
  }
  return INITIAL_SUPPORTERS;
}

export function saveSupporter(newSupporter: Omit<Supporter, 'id' | 'date'> & { date?: string }): Supporter[] {
  const current = getSupporters();
  const supporter: Supporter = {
    ...newSupporter,
    id: `backer-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    date: newSupporter.date || new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
  };
  const updated = [supporter, ...current];
  if (typeof window !== 'undefined') {
    localStorage.setItem(SUPPORTERS_STORAGE_KEY, JSON.stringify(updated));
  }
  return updated;
}
