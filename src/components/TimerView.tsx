'use client';

import React, { useState } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  Volume2,
  VolumeX,
  Sparkles,
  BookOpen,
  Coffee,
  Sliders,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { TimerMode } from '@/types';
import { soundEngine } from '@/lib/audio';

export const TimerView: React.FC = () => {
  const {
    timerMode,
    timeLeft,
    totalDuration,
    isRunning,
    startTimer,
    pauseTimer,
    resetTimer,
    setPreset,
    skipTimer,
    activeSubject,
    setActiveSubject,
    activeTopic,
    setActiveTopic,
    completedCycles,
    settings,
    updateSettings,
    ambientTracks,
    toggleAmbientTrack,
  } = useApp();

  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customMinutes, setCustomMinutes] = useState(45);

  // Time calculations
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeFormatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  // Progress percentage (0 to 100)
  const progressPercent =
    totalDuration > 0 ? ((totalDuration - timeLeft) / totalDuration) * 100 : 0;

  // SVG circular properties
  const radius = 135;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  // Preset definitions
  const presets: { label: string; minutes: number; mode: TimerMode }[] = [
    { label: '25m Pomodoro', minutes: 25, mode: 'focus' },
    { label: '50m Deep Work', minutes: 50, mode: 'focus' },
    { label: '90m Ultradian', minutes: 90, mode: 'focus' },
    { label: '5m Short Break', minutes: 5, mode: 'short_break' },
    { label: '15m Long Break', minutes: 15, mode: 'long_break' },
  ];

  const subjects = [
    'Mathematics',
    'Science',
    'Social Science',
    'English',
    'Computer Science',
    'Revision / Notes',
  ];

  const modeBadge = {
    focus: {
      label: 'FOCUS TIME',
      color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      icon: <Sparkles className="w-3.5 h-3.5" />,
      subtext: 'Deep concentration — phones on silent',
    },
    short_break: {
      label: 'SHORT BREAK',
      color: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
      icon: <Coffee className="w-3.5 h-3.5" />,
      subtext: 'Drink water, stretch your back, relax your eyes',
    },
    long_break: {
      label: 'LONG BREAK',
      color: 'bg-blue-500/10 text-blue-300 border-blue-500/30',
      icon: <Coffee className="w-3.5 h-3.5" />,
      subtext: 'Great work! Take a walk or have a light snack',
    },
  }[timerMode];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-200">
      {/* Subject & Topic Selector Bar */}
      <div className="rounded-2xl bg-[#090f0b] border border-[#182c1f] p-5 space-y-4 shadow-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400">
            <BookOpen className="w-4 h-4" />
            <span>Current Study Subject & Topic</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => soundEngine.playCelebrationChime()}
              className="px-2.5 py-1 rounded-md bg-[#101b13] border border-[#182c1f] text-slate-300 text-xs hover:text-emerald-300 transition-colors"
              title="Test completion chime sound"
            >
              🔔 Test Bell Chime
            </button>
            <button
              onClick={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
              className={`p-1.5 rounded-lg border text-xs transition-colors ${
                settings.soundEnabled
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : 'bg-red-500/10 border-red-500/30 text-red-400'
              }`}
              title={settings.soundEnabled ? 'Chime Enabled' : 'Chime Muted'}
            >
              {settings.soundEnabled ? (
                <Volume2 className="w-4 h-4" />
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Quick subject pills */}
        <div className="flex flex-wrap items-center gap-2">
          {subjects.map((sub) => {
            const isSelected = activeSubject === sub;
            return (
              <button
                key={sub}
                onClick={() => setActiveSubject(sub)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                    : 'bg-[#101912] text-slate-300 border border-[#1a2e21] hover:bg-[#15241a] hover:text-white'
                }`}
              >
                {sub}
              </button>
            );
          })}
        </div>

        {/* Specific topic text input */}
        <div className="relative">
          <input
            type="text"
            value={activeTopic}
            onChange={(e) => setActiveTopic(e.target.value)}
            placeholder="What specific topic or exercise are you solving right now? (e.g. NCERT Ex 8.4)"
            className="w-full bg-[#0c140f] border border-[#182c1f] rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/60 transition-colors"
          />
        </div>
      </div>

      {/* Main Focus Timer Container */}
      <div className="rounded-3xl bg-gradient-to-b from-[#0a120c] via-[#080d09] to-[#050806] border border-[#1b3123] p-8 sm:p-12 flex flex-col items-center justify-center text-center shadow-2xl relative overflow-hidden">
        {/* Glowing background halo */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] bg-emerald-500/5 blur-[90px] rounded-full pointer-events-none" />

        {/* Mode badge */}
        <div
          className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-semibold uppercase tracking-wider mb-8 ${modeBadge.color}`}
        >
          {modeBadge.icon}
          <span>{modeBadge.label}</span>
        </div>

        {/* Circular Animated SVG Timer */}
        <div className="relative w-72 h-72 sm:w-80 sm:h-80 flex items-center justify-center my-2">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 320 320">
            {/* Background ring */}
            <circle
              cx="160"
              cy="160"
              r={radius}
              stroke="#132319"
              strokeWidth="10"
              fill="transparent"
            />
            {/* Animated progress ring */}
            <circle
              cx="160"
              cy="160"
              r={radius}
              stroke={timerMode === 'focus' ? '#10b981' : '#f59e0b'}
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-1000 ease-linear"
            />
          </svg>

          {/* Center countdown readout */}
          <div className="absolute inset-0 flex flex-col items-center justify-center space-y-1">
            <span className="text-6xl sm:text-7xl font-mono font-extrabold text-white tracking-tighter">
              {timeFormatted}
            </span>
            <span className="text-xs text-slate-400 font-medium">
              {activeSubject} • {timerMode === 'focus' ? 'Session' : 'Break'}
            </span>
            <span className="text-[11px] text-emerald-400 font-mono pt-1">
              {Math.round(progressPercent)}% completed
            </span>
          </div>
        </div>

        {/* Motivational subtext */}
        <p className="text-xs text-slate-400 mt-6 mb-8 max-w-sm">{modeBadge.subtext}</p>

        {/* Pomodoro 4-Cycle Dots */}
        <div className="flex items-center gap-2 mb-8">
          {[0, 1, 2, 3].map((cycleIndex) => {
            const isCompleted = completedCycles % 4 > cycleIndex;
            const isCurrent = completedCycles % 4 === cycleIndex && timerMode === 'focus';
            return (
              <div
                key={cycleIndex}
                className={`w-3.5 h-3.5 rounded-full transition-all ${
                  isCompleted
                    ? 'bg-emerald-400 shadow-sm shadow-emerald-400/50'
                    : isCurrent
                    ? 'bg-emerald-500/40 border border-emerald-400 animate-pulse'
                    : 'bg-[#15261c] border border-[#1f3728]'
                }`}
                title={`Cycle ${cycleIndex + 1} of 4`}
              />
            );
          })}
          <span className="text-[11px] text-slate-500 ml-2 font-mono">
            Cycle {(completedCycles % 4) + 1} of 4
          </span>
        </div>

        {/* Main Timer Action Buttons */}
        <div className="flex items-center gap-4">
          <button
            onClick={resetTimer}
            className="p-3.5 rounded-2xl bg-[#0e1711] border border-[#1a2e21] text-slate-300 hover:text-white hover:border-emerald-500/40 transition-all shadow-sm"
            title="Reset timer"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          {!isRunning ? (
            <button
              onClick={startTimer}
              className="px-8 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-base flex items-center gap-2.5 transition-all shadow-xl shadow-emerald-500/30 hover:scale-105 active:scale-95"
            >
              <Play className="w-5 h-5 fill-slate-950" />
              <span>{timeLeft < totalDuration ? 'Resume Focus' : 'Start Focus'}</span>
            </button>
          ) : (
            <button
              onClick={pauseTimer}
              className="px-8 py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-base flex items-center gap-2.5 transition-all shadow-xl shadow-amber-500/30 hover:scale-105 active:scale-95"
            >
              <Pause className="w-5 h-5 fill-slate-950" />
              <span>Pause Timer</span>
            </button>
          )}

          <button
            onClick={skipTimer}
            className="p-3.5 rounded-2xl bg-[#0e1711] border border-[#1a2e21] text-slate-300 hover:text-white hover:border-emerald-500/40 transition-all shadow-sm"
            title="Skip to next phase"
          >
            <SkipForward className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Preset Buttons Grid */}
      <div className="rounded-2xl bg-[#090f0b] border border-[#182c1f] p-5 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Timer Presets & Durations
          </span>
          <button
            onClick={() => setShowCustomModal(!showCustomModal)}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1.5"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Custom Duration</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {presets.map((p) => {
            const isMatch = totalDuration === p.minutes * 60 && timerMode === p.mode;
            return (
              <button
                key={p.label}
                onClick={() => setPreset(p.minutes, p.mode)}
                className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all text-center ${
                  isMatch
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-md'
                    : 'bg-[#0c140f] text-slate-300 border-[#182c1f] hover:bg-[#111e15] hover:text-white'
                }`}
              >
                {p.label}
              </button>
            );
          })}
        </div>

        {/* Custom duration slider popup */}
        {showCustomModal && (
          <div className="p-4 rounded-xl bg-[#0d1611] border border-[#1d3525] space-y-3 pt-3 animate-in fade-in">
            <div className="flex items-center justify-between text-xs text-slate-200">
              <span>Set Custom Study Duration:</span>
              <span className="font-mono font-bold text-emerald-400 text-sm">
                {customMinutes} minutes
              </span>
            </div>
            <input
              type="range"
              min="5"
              max="120"
              step="5"
              value={customMinutes}
              onChange={(e) => setCustomMinutes(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowCustomModal(false)}
                className="px-3 py-1 rounded-md text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setPreset(customMinutes, 'focus');
                  setShowCustomModal(false);
                }}
                className="px-4 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs shadow-sm hover:bg-emerald-400"
              >
                Apply {customMinutes}m Focus
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Mini Ambient Sound Player inside Timer View */}
      <div className="rounded-2xl bg-[#090f0b] border border-[#182c1f] p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Volume2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">Ambient Study Audio</h4>
            <p className="text-[11px] text-slate-400">
              Click to layer soothing background sound while this timer runs
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleAmbientTrack('rain')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              ambientTracks.rain.isPlaying
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-[#0d1611] text-slate-300 border-[#182c1f] hover:bg-[#121f17]'
            }`}
          >
            🌧️ Rain {ambientTracks.rain.isPlaying ? '• Playing' : ''}
          </button>
          <button
            onClick={() => toggleAmbientTrack('lofi')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              ambientTracks.lofi.isPlaying
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-[#0d1611] text-slate-300 border-[#182c1f] hover:bg-[#121f17]'
            }`}
          >
            🎧 Lo-Fi 432Hz {ambientTracks.lofi.isPlaying ? '• Playing' : ''}
          </button>
          <button
            onClick={() => toggleAmbientTrack('forest')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              ambientTracks.forest.isPlaying
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-[#0d1611] text-slate-300 border-[#182c1f] hover:bg-[#121f17]'
            }`}
          >
            🌲 Forest {ambientTracks.forest.isPlaying ? '• Playing' : ''}
          </button>
        </div>
      </div>
    </div>
  );
};
