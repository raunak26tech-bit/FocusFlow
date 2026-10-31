import { StudySession, StudyRoom, UserSettings } from '@/types';

const STORAGE_KEYS = {
  SESSIONS: 'focusflow_sessions_v1',
  SETTINGS: 'focusflow_settings_v1',
  ROOMS: 'focusflow_rooms_v1',
  CURRENT_STREAK: 'focusflow_streak_v1',
};

export const DEFAULT_SETTINGS: UserSettings = {
  studentName: 'Raunak',
  gradeLevel: 'Class 10 — Board Exam Aspirant',
  dailyGoalMinutes: 180, // 3 hours
  pomodoroFocusMinutes: 25,
  pomodoroShortBreakMinutes: 5,
  pomodoroLongBreakMinutes: 15,
  soundEnabled: true,
  autoStartBreaks: false,
  quotePreference: 'growth',
};

// Realistic initial sample rooms
export const INITIAL_ROOMS: StudyRoom[] = [
  {
    id: 'room-1',
    name: 'Class 10 Board Exam Sprint 🎯',
    subject: 'Mathematics & Science',
    description: 'Deep focus room for Class 10 students solving sample papers & NCERT exemplars. Strict silent study!',
    participantsCount: 18,
    maxParticipants: 25,
    hostName: 'Aryan Sharma',
    isLive: true,
    tags: ['Class 10', 'Board Prep', 'NCERT', 'Sprint'],
    currentSession: 'Pomodoro 50m • Cycle 3',
  },
  {
    id: 'room-2',
    name: 'Late Night STEM Focus 🔬',
    subject: 'Physics & Chemistry',
    description: 'Working through Light reflection, electricity numericals and chemical equations together.',
    participantsCount: 9,
    maxParticipants: 15,
    hostName: 'Priya Patel',
    isLive: true,
    tags: ['Science', 'Problem Solving', 'Night Owls'],
    currentSession: 'Deep Work 25m • Active',
  },
  {
    id: 'room-3',
    name: 'Silent Library — No Distractions 📚',
    subject: 'All Subjects',
    description: 'Camera/Timer on, phone away. Keep each other accountable for long uninterrupted study stretches.',
    participantsCount: 31,
    maxParticipants: 50,
    hostName: 'FocusFlow Official',
    isLive: true,
    tags: ['Silent Study', 'Deep Flow', 'All Grades'],
    currentSession: 'Pomodoro 25m • Cycle 4',
  },
  {
    id: 'room-4',
    name: 'Social Science & English Memorization 🗺️',
    subject: 'History & Geography',
    description: 'Active recall & flashcard revision for Class 10 Nationalism in India & Map Work.',
    participantsCount: 12,
    maxParticipants: 20,
    hostName: 'Rohan Verma',
    isLive: false,
    tags: ['Social Science', 'Active Recall', 'Class 10'],
    currentSession: 'Starts in 15 mins',
  },
];

export const getInitialSessions = (): StudySession[] => {
  const getDateDaysAgo = (daysAgo: number): string => {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    return d.toISOString().split('T')[0];
  };

  const nowMs = Date.now();

  return [
    {
      id: 'sess-1',
      subject: 'Mathematics',
      topic: 'Trigonometry Identities & Proofs',
      durationMinutes: 50,
      completedAt: new Date(nowMs - 3600000 * 3).toISOString(),
      mode: 'focus',
      dateKey: getDateDaysAgo(0),
    },
    {
      id: 'sess-2',
      subject: 'Science',
      topic: 'Light - Reflection & Refraction Ray Diagrams',
      durationMinutes: 50,
      completedAt: new Date(nowMs - 3600000 * 5).toISOString(),
      mode: 'focus',
      dateKey: getDateDaysAgo(0),
    },
    {
      id: 'sess-3',
      subject: 'Science',
      topic: 'Chemical Reactions and Equations Balancing',
      durationMinutes: 25,
      completedAt: new Date(nowMs - 3600000 * 25).toISOString(),
      mode: 'focus',
      dateKey: getDateDaysAgo(1),
    },
    {
      id: 'sess-4',
      subject: 'Mathematics',
      topic: 'Quadratic Equations Word Problems',
      durationMinutes: 50,
      completedAt: new Date(nowMs - 3600000 * 27).toISOString(),
      mode: 'focus',
      dateKey: getDateDaysAgo(1),
    },
    {
      id: 'sess-5',
      subject: 'Social Science',
      topic: 'Nationalism in India Timeline Revision',
      durationMinutes: 50,
      completedAt: new Date(nowMs - 3600000 * 50).toISOString(),
      mode: 'focus',
      dateKey: getDateDaysAgo(2),
    },
    {
      id: 'sess-6',
      subject: 'English',
      topic: 'Letter to God & Analytical Paragraph Writing',
      durationMinutes: 25,
      completedAt: new Date(nowMs - 3600000 * 74).toISOString(),
      mode: 'focus',
      dateKey: getDateDaysAgo(3),
    },
    {
      id: 'sess-7',
      subject: 'Mathematics',
      topic: 'Arithmetic Progressions nth Term',
      durationMinutes: 50,
      completedAt: new Date(nowMs - 3600000 * 98).toISOString(),
      mode: 'focus',
      dateKey: getDateDaysAgo(4),
    },
    {
      id: 'sess-8',
      subject: 'Science',
      topic: 'Life Processes — Nutrition & Respiration',
      durationMinutes: 50,
      completedAt: new Date(nowMs - 3600000 * 122).toISOString(),
      mode: 'focus',
      dateKey: getDateDaysAgo(5),
    },
  ];
};

export const getStoredSessions = (): StudySession[] => {
  if (typeof window === 'undefined') return [];
  try {
    const item = localStorage.getItem(STORAGE_KEYS.SESSIONS);
    if (!item) {
      const initial = getInitialSessions();
      localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(item);
  } catch {
    return getInitialSessions();
  }
};

export const saveStoredSessions = (sessions: StudySession[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
  } catch (e) {
    console.error('Failed to save sessions:', e);
  }
};

export const getStoredSettings = (): UserSettings => {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const item = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!item) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
      return DEFAULT_SETTINGS;
    }
    return { ...DEFAULT_SETTINGS, ...JSON.parse(item) };
  } catch {
    return DEFAULT_SETTINGS;
  }
};

export const saveStoredSettings = (settings: UserSettings): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings:', e);
  }
};

export const getStoredRooms = (): StudyRoom[] => {
  if (typeof window === 'undefined') return INITIAL_ROOMS;
  try {
    const item = localStorage.getItem(STORAGE_KEYS.ROOMS);
    if (!item) {
      localStorage.setItem(STORAGE_KEYS.ROOMS, JSON.stringify(INITIAL_ROOMS));
      return INITIAL_ROOMS;
    }
    return JSON.parse(item);
  } catch {
    return INITIAL_ROOMS;
  }
};

export const saveStoredRooms = (rooms: StudyRoom[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.ROOMS, JSON.stringify(rooms));
  } catch (e) {
    console.error('Failed to save rooms:', e);
  }
};
