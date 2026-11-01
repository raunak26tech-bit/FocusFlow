'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import confetti from 'canvas-confetti';
import {
  ActiveTab,
  TimerMode,
  StudySession,
  StudyRoom,
  UserSettings,
  AmbientSoundId,
} from '@/types';
import {
  DEFAULT_SETTINGS,
  getStoredSessions,
  saveStoredSessions,
  getStoredSettings,
  saveStoredSettings,
  getStoredRooms,
  saveStoredRooms,
} from '@/lib/storage';
import { soundEngine } from '@/lib/audio';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

interface AmbientTrackState {
  isPlaying: boolean;
  volume: number;
}

interface AppContextType {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  settings: UserSettings;
  updateSettings: (newSettings: Partial<UserSettings>) => void;
  sessions: StudySession[];
  addSession: (session: Omit<StudySession, 'id' | 'completedAt' | 'dateKey'>) => void;
  deleteSession: (id: string) => void;
  rooms: StudyRoom[];
  addRoom: (room: Omit<StudyRoom, 'id' | 'isLive' | 'participantsCount'>) => void;
  joinRoom: (roomId: string) => void;
  activeRoomId: string | null;
  setActiveRoomId: (id: string | null) => void;

  // Supabase Auth
  user: User | null;
  isAuthModalOpen: boolean;
  authModalMode: 'signin' | 'signup';
  openAuthModal: (mode?: 'signin' | 'signup') => void;
  closeAuthModal: () => void;
  setAuthModalMode: (mode: 'signin' | 'signup') => void;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (
    email: string,
    password: string,
    fullName: string,
    gradeLevel: string
  ) => Promise<{ error: string | null; needsConfirmation: boolean }>;
  signOut: () => Promise<void>;

  // Timer controls
  timerMode: TimerMode;
  timeLeft: number;
  totalDuration: number;
  isRunning: boolean;
  activeSubject: string;
  setActiveSubject: (subject: string) => void;
  activeTopic: string;
  setActiveTopic: (topic: string) => void;
  startTimer: () => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  resetTimer: () => void;
  setPreset: (minutes: number, mode?: TimerMode) => void;
  skipTimer: () => void;
  completedCycles: number;

  // Ambient sound controls
  ambientTracks: Record<AmbientSoundId, AmbientTrackState>;
  toggleAmbientTrack: (id: AmbientSoundId) => void;
  setTrackVolume: (id: AmbientSoundId, volume: number) => void;
  stopAllAmbient: () => void;

  // Computed metrics
  todayMinutes: number;
  currentStreak: number;
  dailyGoalProgress: number; // 0 - 100 percentage
  totalSessionsCount: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('landing');
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [rooms, setRooms] = useState<StudyRoom[]>([]);
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);

  // Supabase Auth state
  const [user, setUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signin');

  const openAuthModal = useCallback((mode: 'signin' | 'signup' = 'signin') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
  }, []);

  // Sync profile and study sessions when user logs in
  const syncUserCloudData = useCallback(async (userId: string) => {
    if (!supabase) return;
    try {
      // 1. Fetch Profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (profile) {
        setSettings((prev) => {
          const updated = {
            ...prev,
            studentName: profile.student_name || prev.studentName,
            gradeLevel: profile.grade_level || prev.gradeLevel,
          };
          saveStoredSettings(updated);
          return updated;
        });
      }

      // 2. Fetch Sessions
      const { data: cloudSessions } = await supabase
        .from('study_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('completed_at', { ascending: false });

      if (cloudSessions && cloudSessions.length > 0) {
        const mappedSessions: StudySession[] = cloudSessions.map((s: {
          id: string;
          subject: string;
          topic?: string;
          duration_minutes: number;
          completed_at: string;
          mode: string;
          date_key: string;
        }) => ({
          id: s.id,
          subject: s.subject,
          topic: s.topic,
          durationMinutes: s.duration_minutes,
          completedAt: s.completed_at,
          mode: s.mode as TimerMode,
          dateKey: s.date_key,
        }));
        setSessions(mappedSessions);
        saveStoredSessions(mappedSessions);
      }
    } catch (e) {
      console.warn('Error syncing cloud data:', e);
    }
  }, []);

  // Listen to Supabase Auth State
  useEffect(() => {
    if (!supabase) return;

    // Check existing active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        syncUserCloudData(session.user.id);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        syncUserCloudData(session.user.id);
      } else {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [syncUserCloudData]);

  // Auth Action handlers
  const signIn = useCallback(
    async (email: string, password: string) => {
      if (!supabase) {
        return { error: 'Supabase client is not configured yet.' };
      }
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        return { error: error.message };
      }
      if (data.user) {
        setUser(data.user);
        syncUserCloudData(data.user.id);
      }
      return { error: null };
    },
    [syncUserCloudData]
  );

  const signUp = useCallback(
    async (email: string, password: string, fullName: string, gradeLevel: string) => {
      if (!supabase) {
        return { error: 'Supabase client is not configured yet.', needsConfirmation: false };
      }
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            grade_level: gradeLevel,
          },
        },
      });
      if (error) {
        return { error: error.message, needsConfirmation: false };
      }
      const needsConfirmation = !data.session && Boolean(data.user);
      if (data.user) {
        setUser(data.user);
        // Upsert profile in Supabase
        await supabase.from('profiles').upsert({
          id: data.user.id,
          student_name: fullName,
          grade_level: gradeLevel,
        });
        syncUserCloudData(data.user.id);
      }
      return { error: null, needsConfirmation };
    },
    [syncUserCloudData]
  );

  const signOut = useCallback(async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
  }, []);

  // Timer state
  const [timerMode, setTimerMode] = useState<TimerMode>('focus');
  const [totalDuration, setTotalDuration] = useState<number>(25 * 60);
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [activeSubject, setActiveSubject] = useState<string>('Mathematics');
  const [activeTopic, setActiveTopic] = useState<string>('Trigonometry');
  const [completedCycles, setCompletedCycles] = useState<number>(0);

  // Ambient sound tracks
  const [ambientTracks, setAmbientTracks] = useState<
    Record<AmbientSoundId, AmbientTrackState>
  >({
    rain: { isPlaying: false, volume: 0.6 },
    forest: { isPlaying: false, volume: 0.5 },
    lofi: { isPlaying: false, volume: 0.5 },
    whitenoise: { isPlaying: false, volume: 0.4 },
    cafe: { isPlaying: false, volume: 0.4 },
  });

  // Load initial data from localStorage on mount
  useEffect(() => {
    const loadedSettings = getStoredSettings();
    const loadedSessions = getStoredSessions();
    const loadedRooms = getStoredRooms();
    setSettings(loadedSettings);
    setSessions(loadedSessions);
    setRooms(loadedRooms);

    // Initial timer based on settings
    setTotalDuration(loadedSettings.pomodoroFocusMinutes * 60);
    setTimeLeft(loadedSettings.pomodoroFocusMinutes * 60);
  }, []);

  // Update Settings
  const updateSettings = useCallback(
    (newSettings: Partial<UserSettings>) => {
      setSettings((prev) => {
        const updated = { ...prev, ...newSettings };
        saveStoredSettings(updated);
        return updated;
      });

      // Sync settings with Supabase if logged in
      if (supabase && user) {
        if (newSettings.studentName || newSettings.gradeLevel) {
          supabase
            .from('profiles')
            .update({
              student_name: newSettings.studentName,
              grade_level: newSettings.gradeLevel,
              updated_at: new Date().toISOString(),
            })
            .eq('id', user.id)
            .then();
        }

        supabase
          .from('user_settings')
          .upsert({
            user_id: user.id,
            daily_goal_minutes: newSettings.dailyGoalMinutes,
            pomodoro_focus_minutes: newSettings.pomodoroFocusMinutes,
            pomodoro_short_break_minutes: newSettings.pomodoroShortBreakMinutes,
            pomodoro_long_break_minutes: newSettings.pomodoroLongBreakMinutes,
            sound_enabled: newSettings.soundEnabled,
            auto_start_breaks: newSettings.autoStartBreaks,
            updated_at: new Date().toISOString(),
          })
          .then();
      }
    },
    [user]
  );

  // Add study session
  const addSession = useCallback(
    (newSession: Omit<StudySession, 'id' | 'completedAt' | 'dateKey'>) => {
      const now = new Date();
      const session: StudySession = {
        ...newSession,
        id: `sess-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        completedAt: now.toISOString(),
        dateKey: now.toISOString().split('T')[0],
      };

      setSessions((prev) => {
        const updated = [session, ...prev];
        saveStoredSessions(updated);
        return updated;
      });

      // Sync study session with Supabase if logged in
      if (supabase && user) {
        supabase
          .from('study_sessions')
          .insert({
            user_id: user.id,
            subject: newSession.subject,
            topic: newSession.topic || '',
            duration_minutes: newSession.durationMinutes,
            mode: newSession.mode,
            completed_at: session.completedAt,
            date_key: session.dateKey,
          })
          .then(({ error }) => {
            if (error) console.warn('Supabase session insert notice:', error.message);
          });
      }
    },
    [user]
  );

  const deleteSession = useCallback(
    (id: string) => {
      setSessions((prev) => {
        const updated = prev.filter((s) => s.id !== id);
        saveStoredSessions(updated);
        return updated;
      });

      // Delete from Supabase if logged in
      if (supabase && user) {
        supabase
          .from('study_sessions')
          .delete()
          .eq('id', id)
          .then();
      }
    },
    [user]
  );

  // Study Rooms
  const addRoom = useCallback(
    (roomData: Omit<StudyRoom, 'id' | 'isLive' | 'participantsCount'>) => {
      const newRoom: StudyRoom = {
        ...roomData,
        id: `room-${Date.now()}`,
        isLive: true,
        participantsCount: 1,
      };
      setRooms((prev) => {
        const updated = [newRoom, ...prev];
        saveStoredRooms(updated);
        return updated;
      });
    },
    []
  );

  const joinRoom = useCallback((roomId: string) => {
    setActiveRoomId(roomId);
    setRooms((prev) =>
      prev.map((r) =>
        r.id === roomId
          ? { ...r, participantsCount: Math.min(r.maxParticipants, r.participantsCount + 1) }
          : r
      )
    );
  }, []);

  // Trigger celebration effects
  const triggerCelebration = useCallback(() => {
    if (settings.soundEnabled) {
      soundEngine.playCelebrationChime();
    }
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10b981', '#34d399', '#059669', '#6ee7b7', '#f59e0b'],
      });
    } catch {}
  }, [settings.soundEnabled]);

  // Handle timer tick & completion
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      // Completed!
      setIsRunning(false);
      triggerCelebration();

      if (timerMode === 'focus') {
        const durationMin = Math.round(totalDuration / 60);
        addSession({
          subject: activeSubject || 'Study Session',
          topic: activeTopic || 'Deep Work Focus',
          durationMinutes: durationMin,
          mode: 'focus',
        });
        setCompletedCycles((c) => c + 1);

        // Switch to break
        const nextBreakMin =
          (completedCycles + 1) % 4 === 0
            ? settings.pomodoroLongBreakMinutes
            : settings.pomodoroShortBreakMinutes;
        const nextMode: TimerMode =
          (completedCycles + 1) % 4 === 0 ? 'long_break' : 'short_break';

        setTimerMode(nextMode);
        setTotalDuration(nextBreakMin * 60);
        setTimeLeft(nextBreakMin * 60);

        if (settings.autoStartBreaks) {
          setIsRunning(true);
        }
      } else {
        // Break finished, go back to focus
        setTimerMode('focus');
        setTotalDuration(settings.pomodoroFocusMinutes * 60);
        setTimeLeft(settings.pomodoroFocusMinutes * 60);
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [
    isRunning,
    timeLeft,
    timerMode,
    totalDuration,
    activeSubject,
    activeTopic,
    completedCycles,
    settings,
    addSession,
    triggerCelebration,
  ]);

  // Timer controls
  const startTimer = useCallback(() => {
    soundEngine.playClick();
    setIsRunning(true);
  }, []);

  const pauseTimer = useCallback(() => {
    soundEngine.playClick();
    setIsRunning(false);
  }, []);

  const resumeTimer = useCallback(() => {
    soundEngine.playClick();
    setIsRunning(true);
  }, []);

  const resetTimer = useCallback(() => {
    soundEngine.playClick();
    setIsRunning(false);
    setTimeLeft(totalDuration);
  }, [totalDuration]);

  const setPreset = useCallback(
    (minutes: number, mode: TimerMode = 'focus') => {
      soundEngine.playClick();
      setIsRunning(false);
      setTimerMode(mode);
      setTotalDuration(minutes * 60);
      setTimeLeft(minutes * 60);
    },
    []
  );

  const skipTimer = useCallback(() => {
    soundEngine.playClick();
    setIsRunning(false);
    if (timerMode === 'focus') {
      setTimerMode('short_break');
      setTotalDuration(settings.pomodoroShortBreakMinutes * 60);
      setTimeLeft(settings.pomodoroShortBreakMinutes * 60);
    } else {
      setTimerMode('focus');
      setTotalDuration(settings.pomodoroFocusMinutes * 60);
      setTimeLeft(settings.pomodoroFocusMinutes * 60);
    }
  }, [timerMode, settings]);

  // Ambient sound controls
  const toggleAmbientTrack = useCallback(
    (id: AmbientSoundId) => {
      setAmbientTracks((prev) => {
        const current = prev[id];
        const nextPlaying = !current.isPlaying;
        if (nextPlaying) {
          soundEngine.startAmbientSound(id, current.volume);
        } else {
          soundEngine.stopAmbientSound(id);
        }
        return {
          ...prev,
          [id]: { ...current, isPlaying: nextPlaying },
        };
      });
    },
    []
  );

  const setTrackVolume = useCallback(
    (id: AmbientSoundId, volume: number) => {
      setAmbientTracks((prev) => {
        const current = prev[id];
        if (current.isPlaying) {
          soundEngine.setSoundVolume(id, volume);
        }
        return {
          ...prev,
          [id]: { ...current, volume },
        };
      });
    },
    []
  );

  const stopAllAmbient = useCallback(() => {
    soundEngine.stopAll();
    setAmbientTracks((prev) => {
      const reset = { ...prev };
      (Object.keys(reset) as AmbientSoundId[]).forEach((key) => {
        reset[key] = { ...reset[key], isPlaying: false };
      });
      return reset;
    });
  }, []);

  // Computed metrics state (hydrated on client)
  const [todayDateStr, setTodayDateStr] = useState<string>('');

  useEffect(() => {
    setTodayDateStr(new Date().toISOString().split('T')[0]);
  }, []);

  const todayMinutes = useMemo(() => {
    if (!todayDateStr) return 0;
    return sessions
      .filter((s) => s.dateKey === todayDateStr && s.mode === 'focus')
      .reduce((sum, s) => sum + s.durationMinutes, 0);
  }, [sessions, todayDateStr]);

  const dailyGoalProgress = useMemo(() => {
    if (settings.dailyGoalMinutes <= 0) return 100;
    const pct = Math.round((todayMinutes / settings.dailyGoalMinutes) * 100);
    return Math.min(100, Math.max(0, pct));
  }, [todayMinutes, settings.dailyGoalMinutes]);

  // Calculate study streak on client
  const [currentStreak, setCurrentStreak] = useState<number>(1);

  useEffect(() => {
    if (sessions.length === 0) {
      setCurrentStreak(0);
      return;
    }
    const focusSessions = sessions.filter((s) => s.mode === 'focus');
    const uniqueDates = Array.from(new Set(focusSessions.map((s) => s.dateKey))).sort().reverse();

    if (uniqueDates.length === 0) {
      setCurrentStreak(0);
      return;
    }

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const firstDate = new Date(uniqueDates[0]);
    firstDate.setHours(0, 0, 0, 0);

    const diffDays = Math.round((today.getTime() - firstDate.getTime()) / (1000 * 3600 * 24));
    // If user studied today or yesterday, streak continues
    if (diffDays > 1) {
      setCurrentStreak(0);
      return;
    }

    const checkDate = new Date(firstDate);
    for (const dStr of uniqueDates) {
      const d = new Date(dStr);
      d.setHours(0, 0, 0, 0);
      const diff = Math.round((checkDate.getTime() - d.getTime()) / (1000 * 3600 * 24));
      if (diff === 0) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
    setCurrentStreak(Math.max(1, streak));
  }, [sessions]);

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        settings,
        updateSettings,
        sessions,
        addSession,
        deleteSession,
        rooms,
        addRoom,
        joinRoom,
        activeRoomId,
        setActiveRoomId,
        user,
        isAuthModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
        setAuthModalMode,
        signIn,
        signUp,
        signOut,
        timerMode,
        timeLeft,
        totalDuration,
        isRunning,
        activeSubject,
        setActiveSubject,
        activeTopic,
        setActiveTopic,
        startTimer,
        pauseTimer,
        resumeTimer,
        resetTimer,
        setPreset,
        skipTimer,
        completedCycles,
        ambientTracks,
        toggleAmbientTrack,
        setTrackVolume,
        stopAllAmbient,
        todayMinutes,
        currentStreak,
        dailyGoalProgress,
        totalSessionsCount: sessions.length,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
