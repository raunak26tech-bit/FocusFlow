export type ActiveTab =
  | 'landing'
  | 'dashboard'
  | 'timer'
  | 'music'
  | 'analytics'
  | 'groups'
  | 'settings';

export type TimerMode = 'focus' | 'short_break' | 'long_break';

export interface StudySession {
  id: string;
  subject: string;
  topic?: string;
  durationMinutes: number;
  completedAt: string; // ISO string
  mode: TimerMode;
  dateKey: string; // YYYY-MM-DD for grouping
}

export interface StudyRoom {
  id: string;
  name: string;
  subject: string;
  description: string;
  participantsCount: number;
  maxParticipants: number;
  hostName: string;
  isLive: boolean;
  tags: string[];
  currentSession: string; // e.g., "Pomodoro 25m - Cycle 2"
}

export interface UserSettings {
  studentName: string;
  gradeLevel: string; // e.g. "Class 10 - CBSE"
  dailyGoalMinutes: number; // default 180 (3 hours)
  pomodoroFocusMinutes: number; // default 25
  pomodoroShortBreakMinutes: number; // default 5
  pomodoroLongBreakMinutes: number; // default 15
  soundEnabled: boolean;
  autoStartBreaks: boolean;
  quotePreference: string;
}

export type AmbientSoundId = 'rain' | 'forest' | 'lofi' | 'whitenoise' | 'cafe';

export interface SoundTrack {
  id: AmbientSoundId;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export interface DayActivity {
  day: string; // Mon, Tue, etc.
  date: string; // YYYY-MM-DD
  minutes: number;
  goalMet: boolean;
}
