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
    },
    []
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
    },
    []
  );

  const deleteSession = useCallback((id: string) => {
    setSessions((prev) => {
      const updated = prev.filter((s) => s.id !== id);
      saveStoredSessions(updated);
      return updated;
    });
  }, []);

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

    let checkDate = new Date(firstDate);
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
