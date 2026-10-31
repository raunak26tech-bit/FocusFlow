'use client';

import React, { useState } from 'react';
import {
  Settings,
  User,
  Clock,
  Target,
  Volume2,
  Trash2,
  Download,
  RotateCcw,
  Check,
  Sparkles,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { soundEngine } from '@/lib/audio';
import { getInitialSessions } from '@/lib/storage';

export const SettingsView: React.FC = () => {
  const { settings, updateSettings, sessions } = useApp();

  const [studentName, setStudentName] = useState(settings.studentName);
  const [gradeLevel, setGradeLevel] = useState(settings.gradeLevel);
  const [dailyGoalMinutes, setDailyGoalMinutes] = useState(settings.dailyGoalMinutes);
  const [focusMin, setFocusMin] = useState(settings.pomodoroFocusMinutes);
  const [shortBreakMin, setShortBreakMin] = useState(settings.pomodoroShortBreakMinutes);
  const [longBreakMin, setLongBreakMin] = useState(settings.pomodoroLongBreakMinutes);
  const [savedAlert, setSavedAlert] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      studentName,
      gradeLevel,
      dailyGoalMinutes,
      pomodoroFocusMinutes: focusMin,
      pomodoroShortBreakMinutes: shortBreakMin,
      pomodoroLongBreakMinutes: longBreakMin,
    });
    setSavedAlert(true);
    setTimeout(() => setSavedAlert(false), 2500);
  };

  const exportData = () => {
    const data = {
      settings,
      sessions,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `focusflow-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleResetSampleData = () => {
    if (confirm('Reset your study history to the initial Class 10 sample data?')) {
      localStorage.setItem('focusflow_sessions_v1', JSON.stringify(getInitialSessions()));
      window.location.reload();
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2.5">
            <Settings className="w-7 h-7 text-emerald-400" />
            <span>Settings & Preferences</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Customize your study routine, daily targets, and Pomodoro intervals
          </p>
        </div>

        {savedAlert && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold animate-in fade-in">
            <Check className="w-4 h-4" />
            <span>Preferences Saved!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Student Profile Card */}
        <div className="rounded-2xl bg-[#090f0b] border border-[#182c1f] p-6 space-y-5">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400 pb-2 border-b border-[#142419]">
            <User className="w-4 h-4" />
            <span>Student Profile</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Your First Name / Display Name
              </label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="w-full bg-[#0c140f] border border-[#182c1f] rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Grade / Academic Goal
              </label>
              <input
                type="text"
                value={gradeLevel}
                onChange={(e) => setGradeLevel(e.target.value)}
                placeholder="e.g. Class 10 CBSE Board Exam"
                className="w-full bg-[#0c140f] border border-[#182c1f] rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
              />
            </div>
          </div>
        </div>

        {/* Daily Study Goal Card */}
        <div className="rounded-2xl bg-[#090f0b] border border-[#182c1f] p-6 space-y-5">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400 pb-2 border-b border-[#142419]">
            <Target className="w-4 h-4" />
            <span>Daily Focus Goal</span>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span>Target Focus Duration Per Day:</span>
              <span className="font-mono font-bold text-emerald-400 text-sm">
                {(dailyGoalMinutes / 60).toFixed(1)} Hours ({dailyGoalMinutes} mins)
              </span>
            </div>
            <input
              type="range"
              min="30"
              max="480"
              step="30"
              value={dailyGoalMinutes}
              onChange={(e) => setDailyGoalMinutes(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>30 mins</span>
              <span>2 hours</span>
              <span>4 hours</span>
              <span>6 hours</span>
              <span>8 hours</span>
            </div>
          </div>
        </div>

        {/* Pomodoro Timer Preferences */}
        <div className="rounded-2xl bg-[#090f0b] border border-[#182c1f] p-6 space-y-5">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400 pb-2 border-b border-[#142419]">
            <Clock className="w-4 h-4" />
            <span>Pomodoro Interval Preferences</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Focus Duration: {focusMin}m
              </label>
              <input
                type="range"
                min="15"
                max="90"
                step="5"
                value={focusMin}
                onChange={(e) => setFocusMin(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Short Break: {shortBreakMin}m
              </label>
              <input
                type="range"
                min="3"
                max="15"
                step="1"
                value={shortBreakMin}
                onChange={(e) => setShortBreakMin(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Long Break: {longBreakMin}m
              </label>
              <input
                type="range"
                min="10"
                max="30"
                step="5"
                value={longBreakMin}
                onChange={(e) => setLongBreakMin(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-white">Auto-Start Breaks</div>
              <div className="text-[11px] text-slate-400">
                Automatically begin break countdown when a focus block ends
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.autoStartBreaks}
              onChange={(e) => updateSettings({ autoStartBreaks: e.target.checked })}
              className="w-4 h-4 accent-emerald-500 cursor-pointer rounded"
            />
          </div>
        </div>

        {/* Audio Preferences */}
        <div className="rounded-2xl bg-[#090f0b] border border-[#182c1f] p-6 space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400 pb-2 border-b border-[#142419]">
            <Volume2 className="w-4 h-4" />
            <span>Sound & Chimes</span>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-white">
                Completion Bell Chime
              </div>
              <div className="text-[11px] text-slate-400">
                Plays a soothing harmonic bell when the countdown hits zero
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => soundEngine.playCelebrationChime()}
                className="px-3 py-1 rounded-lg bg-[#0e1711] border border-[#182c1f] text-xs text-slate-300 hover:text-emerald-300"
              >
                Test Chime 🔔
              </button>
              <input
                type="checkbox"
                checked={settings.soundEnabled}
                onChange={(e) => updateSettings({ soundEnabled: e.target.checked })}
                className="w-4 h-4 accent-emerald-500 cursor-pointer rounded"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-8 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs tracking-wide transition-all shadow-md shadow-emerald-500/20 hover:scale-[1.02]"
          >
            Save All Preferences
          </button>
        </div>
      </form>

      {/* Data Management & Privacy */}
      <div className="rounded-2xl bg-[#090f0b] border border-[#182c1f] p-6 space-y-4">
        <h3 className="text-sm font-bold text-white">Data Management & Privacy</h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          FocusFlow does not collect personal information or use tracking cookies. All your study sessions, timer streaks, and room preferences are stored strictly inside your browser’s localStorage.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="button"
            onClick={exportData}
            className="px-4 py-2 rounded-xl bg-[#0e1711] hover:bg-[#14231a] text-slate-200 border border-[#1b3123] text-xs font-semibold flex items-center gap-2 transition-all hover:border-emerald-500/40"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export Study Sessions (JSON)</span>
          </button>

          <button
            type="button"
            onClick={handleResetSampleData}
            className="px-4 py-2 rounded-xl bg-amber-950/20 hover:bg-amber-950/40 text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center gap-2 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Sample Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};
