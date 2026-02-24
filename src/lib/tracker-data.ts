export interface PerformanceEntry {
  date: string; // YYYY-MM-DD
  execution_score: number;
  mental_clarity: number;
  priority_completed: boolean;
  primary_blocker: string;
  custom_blocker_text: string | null;
  productivity_depth: 'surface' | 'focused' | 'deep' | 'custom' | '';
  custom_work_depth_text: string | null;
  created_at: string;
}

const STORAGE_KEY = 'performance_tracker_entries';

export function getEntries(): PerformanceEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function getTodayEntry(): PerformanceEntry | null {
  const today = new Date().toISOString().slice(0, 10);
  return getEntries().find(e => e.date === today) || null;
}

export function saveEntry(entry: Omit<PerformanceEntry, 'date' | 'created_at'>): PerformanceEntry {
  const entries = getEntries();
  const today = new Date().toISOString().slice(0, 10);
  const existing = entries.findIndex(e => e.date === today);

  const full: PerformanceEntry = {
    ...entry,
    date: today,
    created_at: new Date().toISOString(),
  };

  if (existing >= 0) {
    entries[existing] = full;
  } else {
    entries.push(full);
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  return full;
}

export function getLast7Days(): PerformanceEntry[] {
  const entries = getEntries();
  const now = new Date();
  const cutoff = new Date(now);
  cutoff.setDate(cutoff.getDate() - 7);
  return entries
    .filter(e => new Date(e.date) >= cutoff)
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function getLast14Days(): PerformanceEntry[] {
  const entries = getEntries();
  const now = new Date();
  const cutoff = new Date(now);
  cutoff.setDate(cutoff.getDate() - 14);
  return entries
    .filter(e => new Date(e.date) >= cutoff)
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function getConsistencyZone(avg: number): { label: string; zone: 'high' | 'moderate' | 'low' } {
  if (avg >= 8) return { label: 'High Performance Zone', zone: 'high' };
  if (avg >= 5) return { label: 'Moderate Zone', zone: 'moderate' };
  return { label: 'Improvement Needed', zone: 'low' };
}

export const BLOCKERS = [
  'Distraction',
  'Emotional State',
  'Lack of Clarity',
  'External Dependency',
  'Low Energy',
  'No Major Blocker',
] as const;

export const DEPTH_OPTIONS = [
  { value: 'surface' as const, label: 'Surface-Level Tasks', description: 'Admin, emails, quick tasks' },
  { value: 'focused' as const, label: 'Focused Work', description: 'Structured, goal-oriented work' },
  { value: 'deep' as const, label: 'Deep Work', description: 'High-intensity, creative work' },
];
