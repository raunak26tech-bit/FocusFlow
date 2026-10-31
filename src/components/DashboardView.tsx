'use client';

import React, { useMemo } from 'react';
import {
  Flame,
  Clock,
  Target,
  Trophy,
  Play,
  ArrowRight,
  Sparkles,
  BookOpen,
  Calendar,
  CheckCircle,
  Trash2,
  Volume2,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

export const DashboardView: React.FC = () => {
  const {
    settings,
    todayMinutes,
    currentStreak,
    dailyGoalProgress,
    sessions,
    deleteSession,
    setActiveTab,
    setPreset,
    startTimer,
    toggleAmbientTrack,
    ambientTracks,
  } = useApp();

  // Greeting based on current hour (client-hydrated)
  const [greeting, setGreeting] = React.useState('Welcome back');
  const [weeklyData, setWeeklyData] = React.useState<
    { label: string; dateStr: string; minutes: number; dayNum: number }[]
  >([]);

  React.useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 17) setGreeting('Good afternoon');
    else setGreeting('Good evening');

    // Weekly Activity (Last 7 days)
    const days: { label: string; dateStr: string; minutes: number; dayNum: number }[] = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const label = dayNames[d.getDay()];

      const dayMins = sessions
        .filter((s) => s.dateKey === dateStr && s.mode === 'focus')
        .reduce((sum, s) => sum + s.durationMinutes, 0);

      days.push({
        label,
        dateStr,
        minutes: dayMins,
        dayNum: d.getDate(),
      });
    }
    setWeeklyData(days);
  }, [sessions]);

  // Format minutes into "Xh Ym"
  const formatTime = (totalMin: number) => {
    const h = Math.floor(totalMin / 60);
    const m = totalMin % 60;
    if (h === 0) return `${m}m`;
    if (m === 0) return `${h}h`;
    return `${h}h ${m}m`;
  };

  // Max minutes in the week for bar height scaling
  const maxWeeklyMins = useMemo(() => {
    const maxVal = Math.max(...weeklyData.map((d) => d.minutes), 60);
    return maxVal;
  }, [weeklyData]);

  // Most focused subject
  const topSubject = useMemo(() => {
    if (sessions.length === 0) return 'Mathematics';
    const counts: Record<string, number> = {};
    sessions.forEach((s) => {
      counts[s.subject] = (counts[s.subject] || 0) + s.durationMinutes;
    });
    let top = 'Mathematics';
    let max = 0;
    Object.entries(counts).forEach(([sub, total]) => {
      if (total > max) {
        max = total;
        top = sub;
      }
    });
    return top;
  }, [sessions]);

  const subjectColors: Record<string, string> = {
    Mathematics: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    Science: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
    'Social Science': 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    English: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
    Default: 'bg-slate-700/30 text-slate-300 border-slate-600/30',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      {/* Top Header Card */}
      <div className="rounded-2xl bg-gradient-to-r from-[#0c1811] via-[#09120c] to-[#070e09] border border-[#1b3123] p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl relative overflow-hidden">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{settings.gradeLevel}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            {greeting}, {settings.studentName} ✨
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            {dailyGoalProgress >= 100
              ? '🎉 Outstanding work! You reached your daily study goal today. Keep the momentum going!'
              : `You are at ${dailyGoalProgress}% of today's study target. Ready for the next focus sprint?`}
          </p>
        </div>

        {/* Quick Launch Actions */}
        <div className="flex flex-wrap items-center gap-3 relative z-10 w-full md:w-auto">
          <button
            onClick={() => {
              setPreset(25, 'focus');
              startTimer();
              setActiveTab('timer');
            }}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-500/20"
          >
            <Play className="w-3.5 h-3.5 fill-slate-950" />
            <span>Quick 25m Focus</span>
          </button>
          <button
            onClick={() => {
              setPreset(50, 'focus');
              startTimer();
              setActiveTab('timer');
            }}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-[#122117] hover:bg-[#182e20] text-emerald-300 border border-emerald-500/30 font-semibold text-xs flex items-center justify-center gap-2 transition-all"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>50m Deep Work</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Daily Goal Card */}
        <div className="rounded-xl bg-[#090f0b] border border-[#182c1f] p-5 space-y-3">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-semibold uppercase tracking-wider">Today's Focus</span>
            <Target className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">
              {formatTime(todayMinutes)}
              <span className="text-xs text-slate-400 font-normal ml-2">
                / {formatTime(settings.dailyGoalMinutes)}
              </span>
            </div>
            <div className="w-full bg-[#122017] rounded-full h-2 mt-3 overflow-hidden">
              <div
                className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${dailyGoalProgress}%` }}
              />
            </div>
          </div>
          <div className="text-[11px] text-emerald-400 flex items-center justify-between font-medium">
            <span>{dailyGoalProgress}% Goal Reached</span>
            {dailyGoalProgress >= 100 && <span>Goal Met! ⭐</span>}
          </div>
        </div>

        {/* Current Streak */}
        <div className="rounded-xl bg-[#090f0b] border border-[#182c1f] p-5 space-y-3">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-semibold uppercase tracking-wider">Study Streak</span>
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white flex items-center gap-2">
              <span>{currentStreak}</span>
              <span className="text-xs text-amber-400 font-semibold uppercase tracking-wider">
                {currentStreak === 1 ? 'Day' : 'Days'} In A Row
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              Consistency is your superpower. Study at least 15 mins daily to hold the flame!
            </p>
          </div>
        </div>

        {/* Total Sessions */}
        <div className="rounded-xl bg-[#090f0b] border border-[#182c1f] p-5 space-y-3">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-semibold uppercase tracking-wider">Completed Sessions</span>
            <Trophy className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">
              {sessions.filter((s) => s.mode === 'focus').length}
              <span className="text-xs text-slate-400 font-normal ml-2">Total Blocks</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              Top subject: <span className="text-emerald-400 font-semibold">{topSubject}</span>
            </p>
          </div>
        </div>

        {/* Ambient Sound Quick Card */}
        <div className="rounded-xl bg-[#090f0b] border border-[#182c1f] p-5 space-y-3 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-semibold uppercase tracking-wider">Focus Ambience</span>
            <Volume2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <div className="text-sm font-semibold text-white">
              {ambientTracks.rain.isPlaying ? 'Rain Playing 🌧️' : 'Ambient Audio Muted'}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Mask distraction with procedural forest rain.
            </p>
          </div>
          <button
            onClick={() => toggleAmbientTrack('rain')}
            className={`w-full py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              ambientTracks.rain.isPlaying
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-[#101b13] text-slate-300 border-[#1a2f22] hover:bg-[#16271c]'
            }`}
          >
            {ambientTracks.rain.isPlaying ? 'Stop Rain' : 'Play Rain Sounds'}
          </button>
        </div>
      </div>

      {/* Main Grid: Weekly Chart & Quick Nav */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Weekly Activity Bar Chart (2 cols) */}
        <div className="lg:col-span-2 rounded-2xl bg-[#090f0b] border border-[#182c1f] p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-400" />
                <span>Weekly Study Activity</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Your focus hours over the last 7 days
              </p>
            </div>
            <button
              onClick={() => setActiveTab('analytics')}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1"
            >
              <span>Full Analytics</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Bar Chart Visualization */}
          <div className="pt-6 pb-2">
            <div className="h-48 flex items-end justify-between gap-2 sm:gap-4 px-2">
              {weeklyData.map((day, idx) => {
                const heightPct = Math.max(8, Math.round((day.minutes / maxWeeklyMins) * 100));
                const isToday = idx === weeklyData.length - 1;
                return (
                  <div key={day.dateStr} className="flex-1 flex flex-col items-center gap-2 group">
                    {/* Tooltip on hover */}
                    <div className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-[#132219] text-emerald-300 border border-emerald-500/30 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {formatTime(day.minutes)}
                    </div>

                    {/* Bar */}
                    <div className="w-full max-w-[40px] bg-[#111e16] rounded-t-lg h-full flex items-end p-1">
                      <div
                        className={`w-full rounded-t-md transition-all duration-500 ${
                          isToday
                            ? 'bg-gradient-to-t from-emerald-600 to-emerald-400 shadow-md shadow-emerald-500/30'
                            : day.minutes > 0
                            ? 'bg-emerald-700/80 hover:bg-emerald-600'
                            : 'bg-[#182c20]'
                        }`}
                        style={{ height: `${heightPct}%` }}
                      />
                    </div>

                    {/* Label */}
                    <div className="text-center">
                      <div
                        className={`text-xs font-semibold ${
                          isToday ? 'text-emerald-400' : 'text-slate-400'
                        }`}
                      >
                        {day.label}
                      </div>
                      <div className="text-[10px] text-slate-500">{day.dayNum}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Study Groups Preview Banner (1 col) */}
        <div className="rounded-2xl bg-[#090f0b] border border-[#182c1f] p-6 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>LIVE STUDY ROOMS</span>
            </div>
            <h3 className="text-lg font-bold text-white">Class 10 Board Exam Sprint</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              18 students are currently studying Mathematics & Science in the virtual library. Join them now for quiet, uninterrupted focus!
            </p>

            <div className="p-3.5 rounded-xl bg-[#0d1611] border border-[#182c1f] space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span>Active Participants</span>
                <span className="font-semibold text-emerald-400">18 / 25</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span>Current Cycle</span>
                <span className="font-mono text-slate-400">Pomodoro 50m • Cycle 3</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('groups')}
            className="w-full py-2.5 rounded-xl bg-[#122117] hover:bg-emerald-500 hover:text-slate-950 text-emerald-300 border border-emerald-500/30 font-bold text-xs transition-all flex items-center justify-center gap-2 group"
          >
            <span>Enter Study Rooms</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Recent Study Sessions Table */}
      <div className="rounded-2xl bg-[#090f0b] border border-[#182c1f] p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <span>Recent Study Sessions</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Every completed timer automatically persists into your study notebook
            </p>
          </div>
          <button
            onClick={() => setActiveTab('timer')}
            className="px-3 py-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/25 text-xs font-semibold transition-all flex items-center gap-1.5"
          >
            <span>+ New Session</span>
          </button>
        </div>

        {sessions.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-xs">
            No study sessions recorded yet. Start your first Pomodoro timer above!
          </div>
        ) : (
          <div className="divide-y divide-[#132018] overflow-x-auto">
            {sessions.slice(0, 6).map((sess) => {
              const badgeClass = subjectColors[sess.subject] || subjectColors.Default;
              const dateDisplay = new Date(sess.completedAt).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={sess.id}
                  className="py-3.5 flex items-center justify-between gap-4 hover:bg-white/[0.02] px-2 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                      <CheckCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider border ${badgeClass}`}
                        >
                          {sess.subject}
                        </span>
                        <span className="text-xs font-semibold text-white">
                          {sess.topic || 'Focused Study Session'}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Completed at {dateDisplay} • {sess.dateKey}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-xs font-mono font-semibold text-emerald-400 bg-[#0d1611] px-2.5 py-1 rounded border border-[#1a2f22]">
                      {sess.durationMinutes} min
                    </span>
                    <button
                      onClick={() => deleteSession(sess.id)}
                      className="text-slate-500 hover:text-red-400 p-1 rounded transition-colors"
                      title="Delete entry"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
