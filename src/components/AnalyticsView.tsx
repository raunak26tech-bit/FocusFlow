'use client';

import React, { useState, useMemo } from 'react';
import {
  BarChart3,
  Calendar,
  Flame,
  Award,
  Clock,
  PieChart,
  Lightbulb,
  ArrowUpRight,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

export const AnalyticsView: React.FC = () => {
  const { sessions, currentStreak, settings } = useApp();
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | 'all'>('7d');

  const [filteredSessions, setFilteredSessions] = useState(sessions.filter((s) => s.mode === 'focus'));
  const [chartDays, setChartDays] = useState<{ label: string; dateStr: string; minutes: number }[]>([]);
  const [habitGrid, setHabitGrid] = useState<{ dateStr: string; minutes: number; level: number }[]>([]);

  // Update client computations
  React.useEffect(() => {
    const focusOnly = sessions.filter((s) => s.mode === 'focus');
    const now = new Date();

    let filtered = focusOnly;
    if (timeRange === '7d') {
      const cut = new Date(now.getTime() - 7 * 24 * 3600 * 1000);
      filtered = focusOnly.filter((s) => new Date(s.completedAt) >= cut);
    } else if (timeRange === '30d') {
      const cut = new Date(now.getTime() - 30 * 24 * 3600 * 1000);
      filtered = focusOnly.filter((s) => new Date(s.completedAt) >= cut);
    }
    setFilteredSessions(filtered);

    // Chart days
    const numDays = timeRange === '30d' ? 14 : 7;
    const days: { label: string; dateStr: string; minutes: number }[] = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (let i = numDays - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const label = dayNames[d.getDay()];

      const mins = sessions
        .filter((s) => s.dateKey === dateStr && s.mode === 'focus')
        .reduce((sum, s) => sum + s.durationMinutes, 0);

      days.push({ label, dateStr, minutes: mins });
    }
    setChartDays(days);

    // Habit Grid
    const cells: { dateStr: string; minutes: number; level: number }[] = [];
    for (let i = 27; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];

      const mins = sessions
        .filter((s) => s.dateKey === dateStr && s.mode === 'focus')
        .reduce((sum, s) => sum + s.durationMinutes, 0);

      let level = 0;
      if (mins > 0 && mins < 45) level = 1;
      else if (mins >= 45 && mins < 90) level = 2;
      else if (mins >= 90 && mins < 150) level = 3;
      else if (mins >= 150) level = 4;

      cells.push({ dateStr, minutes: mins, level });
    }
    setHabitGrid(cells);
  }, [sessions, timeRange]);

  // Aggregate stats
  const totalMinutes = useMemo(() => {
    return filteredSessions.reduce((acc, s) => acc + s.durationMinutes, 0);
  }, [filteredSessions]);

  const totalHours = (totalMinutes / 60).toFixed(1);

  // Subject breakdown
  const subjectBreakdown = useMemo(() => {
    const map: Record<string, number> = {};
    filteredSessions.forEach((s) => {
      map[s.subject] = (map[s.subject] || 0) + s.durationMinutes;
    });

    const entries = Object.entries(map).map(([subject, mins]) => ({
      subject,
      minutes: mins,
      percentage: totalMinutes > 0 ? Math.round((mins / totalMinutes) * 100) : 0,
    }));

    return entries.sort((a, b) => b.minutes - a.minutes);
  }, [filteredSessions, totalMinutes]);

  const maxChartMins = Math.max(...chartDays.map((d) => d.minutes), 60);

  const subjectPalette: Record<string, { bar: string; badge: string }> = {
    Mathematics: {
      bar: 'bg-emerald-500',
      badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    },
    Science: {
      bar: 'bg-blue-500',
      badge: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
    },
    'Social Science': {
      bar: 'bg-amber-500',
      badge: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    },
    English: {
      bar: 'bg-purple-500',
      badge: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
    },
    Default: {
      bar: 'bg-teal-500',
      badge: 'bg-teal-500/15 text-teal-300 border-teal-500/30',
    },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      {/* Analytics Header & Range Filter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2.5">
            <BarChart3 className="w-7 h-7 text-emerald-400" />
            <span>Study Analytics & Insights</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Data-driven feedback to help you peak right before your board exams
          </p>
        </div>

        {/* Range Selector */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#090f0b] border border-[#182c1f]">
          <button
            onClick={() => setTimeRange('7d')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              timeRange === '7d'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Last 7 Days
          </button>
          <button
            onClick={() => setTimeRange('30d')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              timeRange === '30d'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Last 30 Days
          </button>
          <button
            onClick={() => setTimeRange('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              timeRange === 'all'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All Time
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl bg-[#090f0b] border border-[#182c1f] p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-semibold uppercase tracking-wider">Total Focused Time</span>
            <Clock className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">
            {totalHours} <span className="text-sm font-normal text-slate-400">hours</span>
          </div>
          <div className="text-[11px] text-emerald-400 font-medium">
            {totalMinutes} active study minutes
          </div>
        </div>

        <div className="rounded-xl bg-[#090f0b] border border-[#182c1f] p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-semibold uppercase tracking-wider">Active Streak</span>
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
          </div>
          <div className="text-3xl font-extrabold text-white flex items-center gap-2">
            <span>{currentStreak}</span>
            <span className="text-xs text-amber-400 font-semibold uppercase">Days</span>
          </div>
          <div className="text-[11px] text-slate-400">
            Target: 30-day consistent streak
          </div>
        </div>

        <div className="rounded-xl bg-[#090f0b] border border-[#182c1f] p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-semibold uppercase tracking-wider">Sessions Logged</span>
            <Award className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">
            {filteredSessions.length}
          </div>
          <div className="text-[11px] text-slate-400">
            Average {(totalMinutes / Math.max(1, filteredSessions.length)).toFixed(0)}m per session
          </div>
        </div>

        <div className="rounded-xl bg-[#090f0b] border border-[#182c1f] p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-semibold uppercase tracking-wider">Daily Goal</span>
            <Calendar className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">
            {(settings.dailyGoalMinutes / 60).toFixed(1)}{' '}
            <span className="text-sm font-normal text-slate-400">hrs/day</span>
          </div>
          <div className="text-[11px] text-emerald-400">
            Configured in Settings
          </div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Bar Chart (2 cols) */}
        <div className="lg:col-span-2 rounded-2xl bg-[#090f0b] border border-[#182c1f] p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white">Focus Time Distribution</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Minutes studied per day across the selected window
              </p>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
              Peak: {Math.max(...chartDays.map((d) => d.minutes))}m
            </span>
          </div>

          <div className="h-56 flex items-end justify-between gap-2 sm:gap-4 pt-6">
            {chartDays.map((day) => {
              const heightPct = Math.max(6, Math.round((day.minutes / maxChartMins) * 100));
              return (
                <div key={day.dateStr} className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#101912] text-emerald-300 border border-[#182c1f] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {day.minutes}m
                  </div>
                  <div className="w-full bg-[#111e15] rounded-t-lg h-full flex items-end p-1">
                    <div
                      className="w-full rounded-t-md bg-gradient-to-t from-emerald-600 to-emerald-400 transition-all duration-500 group-hover:from-emerald-500 group-hover:to-emerald-300"
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-semibold text-slate-400 group-hover:text-emerald-400 transition-colors">
                    {day.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Subject Breakdown Donut/Bars (1 col) */}
        <div className="rounded-2xl bg-[#090f0b] border border-[#182c1f] p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <PieChart className="w-4 h-4 text-emerald-400" />
                <span>Subject Allocation</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Where your effort goes</p>
            </div>
          </div>

          <div className="space-y-4">
            {subjectBreakdown.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-500">
                No session data for this period
              </div>
            ) : (
              subjectBreakdown.map((item) => {
                const palette =
                  subjectPalette[item.subject] || subjectPalette.Default;
                return (
                  <div key={item.subject} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-white">{item.subject}</span>
                      <span className="font-mono text-emerald-400 font-semibold">
                        {item.minutes}m ({item.percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-[#122016] rounded-full h-2 overflow-hidden">
                      <div
                        className={`${palette.bar} h-2 rounded-full transition-all duration-500`}
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Habit Consistency Heatmap (28-day matrix) */}
      <div className="rounded-2xl bg-[#090f0b] border border-[#182c1f] p-6 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-500" />
              <span>4-Week Study Habit Heatmap</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Darker green cells represent longer focus blocks
            </p>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <span>Less</span>
            <span className="w-3 h-3 rounded bg-[#101b13] border border-[#182c1f]" />
            <span className="w-3 h-3 rounded bg-emerald-900/60" />
            <span className="w-3 h-3 rounded bg-emerald-700" />
            <span className="w-3 h-3 rounded bg-emerald-500" />
            <span className="w-3 h-3 rounded bg-emerald-400" />
            <span>More</span>
          </div>
        </div>

        <div className="pt-2 overflow-x-auto">
          <div className="grid grid-cols-7 sm:grid-cols-14 gap-2.5 min-w-[500px]">
            {habitGrid.map((cell) => {
              const colorClass = [
                'bg-[#101b13] border border-[#182c1f]', // 0
                'bg-emerald-950/70 border border-emerald-900/50', // 1
                'bg-emerald-800/80 border border-emerald-700/60', // 2
                'bg-emerald-600 border border-emerald-500', // 3
                'bg-emerald-400 border border-emerald-300 shadow-sm shadow-emerald-400/40', // 4
              ][cell.level];

              return (
                <div
                  key={cell.dateStr}
                  className={`h-10 rounded-lg flex flex-col items-center justify-center p-1 text-[10px] transition-all hover:scale-105 cursor-pointer ${colorClass}`}
                  title={`${cell.dateStr}: ${cell.minutes} minutes`}
                >
                  <span className="font-mono font-semibold text-slate-200">
                    {cell.minutes > 0 ? `${cell.minutes}m` : '—'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Board Exam Preparation Insights */}
      <div className="rounded-2xl bg-gradient-to-r from-[#0c1b12] to-[#07110a] border border-[#1b3623] p-6 space-y-4">
        <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
          <Lightbulb className="w-4 h-4" />
          <span>Class 10 Board Exam Strategy Recommendation</span>
        </div>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
          Based on memory science and spacing effects: alternate between a problem-solving subject (like Mathematics Trigonometry) and a conceptual reading subject (like Science Life Processes or History). Using 50-minute deep blocks with 10-minute active recall breaks enhances long-term retention by over 40%!
        </p>
      </div>
    </div>
  );
};
