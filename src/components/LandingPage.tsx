'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Play,
  Clock,
  Music,
  BarChart2,
  Users,
  CheckCircle2,
  ArrowRight,
  Flame,
  BookOpen,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

export const LandingPage: React.FC = () => {
  const { setActiveTab, setPreset, startTimer } = useApp();

  // Mini preview state for the hero widget
  const [heroSeconds] = useState(25 * 60);
  const [heroActive, setHeroActive] = useState(false);

  const heroMin = Math.floor(heroSeconds / 60);
  const heroSec = heroSeconds % 60;
  const heroTimeFormatted = `${heroMin.toString().padStart(2, '0')}:${heroSec.toString().padStart(2, '0')}`;

  const toggleHeroTimer = () => {
    if (!heroActive) {
      setHeroActive(true);
      // Also sync main app timer!
      setPreset(25, 'focus');
      startTimer();
      setActiveTab('timer');
    } else {
      setHeroActive(false);
    }
  };

  const features = [
    {
      icon: <Clock className="w-6 h-6 text-emerald-400" />,
      title: 'Precision Pomodoro Engine',
      description:
        'Proven 25-minute, 50-minute, and 90-minute study blocks that train your brain for laser-sharp focus during exams.',
      badge: 'Science-Backed',
    },
    {
      icon: <Music className="w-6 h-6 text-emerald-400" />,
      title: 'Procedural Ambient Soundscape',
      description:
        'Synthesized rain, forest whispers, and 432Hz theta binaural tones that mask background noise with zero buffering or ads.',
      badge: 'Zero Latency',
    },
    {
      icon: <BarChart2 className="w-6 h-6 text-emerald-400" />,
      title: 'Visual Study Analytics',
      description:
        'Track exact minutes invested in Mathematics, Science, and English. Keep your daily streak alive with habit heatmaps.',
      badge: 'Instant Insights',
    },
    {
      icon: <Users className="w-6 h-6 text-emerald-400" />,
      title: 'Virtual Study Rooms',
      description:
        'Study alongside fellow Class 10 and high school students in silent rooms. Gain mutual accountability without social media distractions.',
      badge: 'Collaborative',
    },
  ];

  const testimonials = [
    {
      name: 'Aryan Sharma',
      role: 'Class 10 CBSE Student (96.2% Target)',
      text: 'Earlier I would study 10 minutes and check Instagram for 40 minutes. FocusFlow’s 50-minute deep work intervals helped me complete all RD Sharma trigonometry exercises in one weekend!',
      avatar: '👨‍🎓',
      streak: '18 Days Streak',
    },
    {
      name: 'Sneha Roy',
      role: 'ICSE Board Aspirant',
      text: 'The rain soundscape and dark forest theme make late-night science revision so peaceful. It feels like sitting inside a quiet university library.',
      avatar: '👩‍🎓',
      streak: '24 Days Streak',
    },
    {
      name: 'Devansh K.',
      role: 'Class 10 Olympiad Qualifier',
      text: 'The best part is how lightweight and fast it is. All my study sessions are logged in the dashboard automatically without needing any login or cloud account.',
      avatar: '🧑‍💻',
      streak: '31 Days Streak',
    },
  ];

  return (
    <div className="w-full relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-emerald-500/10 blur-[120px] pointer-events-none rounded-full" />

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 md:pt-24 md:pb-32 flex flex-col items-center text-center">
        {/* Top Announcement Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0c140f] border border-emerald-500/30 text-emerald-300 text-xs font-medium mb-8 shadow-sm hover:border-emerald-500/50 transition-colors">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>Inspired by Regain — Designed for High-Achieving Students</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span className="text-slate-400">v1.0 Live</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white max-w-4xl leading-[1.12]">
          Reclaim Your Attention.{' '}
          <span className="bg-gradient-to-r from-emerald-400 via-emerald-300 to-green-500 bg-clip-text text-transparent">
            Crush Every Exam.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl font-normal leading-relaxed">
          The ultimate dark forest green study sanctuary. Combines science-backed Pomodoro rhythms,
          soothing ambient soundscapes, and virtual study rooms to turn procrastination into effortless flow.
        </p>

        {/* Action Buttons */}
        <div className="mt-9 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <button
            onClick={() => {
              setPreset(25, 'focus');
              startTimer();
              setActiveTab('timer');
            }}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm tracking-wide transition-all shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            <span>Start Focusing Free</span>
          </button>

          <button
            onClick={() => setActiveTab('dashboard')}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#0e1711] hover:bg-[#14231a] text-slate-200 border border-[#1d3525] font-semibold text-sm transition-all flex items-center justify-center gap-2 hover:text-white hover:border-emerald-500/40"
          >
            <span>Open Student Dashboard</span>
            <ArrowRight className="w-4 h-4 text-emerald-400" />
          </button>
        </div>

        {/* Quick Highlights Row */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>100% Free for Students</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>No Registration Needed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Works Completely Offline</span>
          </div>
        </div>

        {/* Live Interactive Hero Preview Card */}
        <div className="mt-14 w-full max-w-3xl rounded-2xl p-1 bg-gradient-to-b from-emerald-500/25 via-[#182c1f]/40 to-transparent shadow-2xl">
          <div className="rounded-[15px] bg-[#090f0b] border border-[#182c1f] p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 text-left">
            {/* Left side preview details */}
            <div className="space-y-3 max-w-sm">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>INTERACTIVE DEMO</span>
              </div>
              <h3 className="text-xl font-bold text-white">Experience Deep Work Now</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Try a 25-minute Pomodoro cycle with one click. When the timer finishes, your study session is auto-recorded into your personal streak notebook!
              </p>
              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => {
                    setPreset(25, 'focus');
                    setActiveTab('timer');
                  }}
                  className="px-3 py-1 rounded-md bg-[#101d14] text-emerald-300 text-xs border border-emerald-500/20 hover:border-emerald-500/50"
                >
                  25m Pomodoro
                </button>
                <button
                  onClick={() => {
                    setPreset(50, 'focus');
                    setActiveTab('timer');
                  }}
                  className="px-3 py-1 rounded-md bg-[#101d14] text-emerald-300 text-xs border border-emerald-500/20 hover:border-emerald-500/50"
                >
                  50m Deep Work
                </button>
              </div>
            </div>

            {/* Right side live widget */}
            <div className="flex flex-col items-center p-6 rounded-xl bg-[#0c140f] border border-[#1b3123] w-full sm:w-72 shadow-inner">
              <div className="text-[11px] font-semibold text-emerald-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Mathematics • Trigonometry</span>
              </div>
              <div className="text-5xl font-mono font-extrabold text-white my-3 tracking-tighter">
                {heroTimeFormatted}
              </div>
              <button
                onClick={toggleHeroTimer}
                className="w-full py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-500/20"
              >
                <Play className="w-3.5 h-3.5 fill-slate-950" />
                <span>Launch Focus Session</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-[#132018]">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
            Engineered For Excellence
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
            Everything You Need To Study 10x More Effectively
          </h2>
          <p className="text-sm text-slate-400 mt-3">
            Designed to eliminate the mental friction of starting, keeping you in state of effortless flow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-[#0a100c] border border-[#182c1f] p-6 hover:border-emerald-500/40 hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between group shadow-lg"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  {feat.icon}
                </div>
                <div className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 mb-2 border border-emerald-500/20">
                  {feat.badge}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{feat.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{feat.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison: Ordinary Timers vs FocusFlow */}
      <section className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="rounded-2xl bg-[#090f0b] border border-[#182c1f] p-8 sm:p-10">
          <div className="text-center mb-10">
            <h3 className="text-2xl font-bold text-white">Why FocusFlow Beats Typical Study Apps</h3>
            <p className="text-xs text-slate-400 mt-2">
              Most timer apps distract you with ads, clumsy YouTube audio, or overwhelming features.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 rounded-xl bg-red-950/20 border border-red-900/30 space-y-3">
              <h4 className="font-bold text-red-400 text-sm flex items-center gap-2">
                <span>✕</span> Ordinary Timer Apps
              </h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li>• Annoying video ads interrupting deep concentration</li>
                <li>• YouTube audio buffering and video distractions</li>
                <li>• Complicated signups demanding emails & phone numbers</li>
                <li>• Cluttered, bright interfaces that cause eye strain</li>
              </ul>
            </div>

            <div className="p-6 rounded-xl bg-emerald-950/30 border border-emerald-500/30 space-y-3">
              <h4 className="font-bold text-emerald-400 text-sm flex items-center gap-2">
                <span>✓</span> FocusFlow Sanctuary
              </h4>
              <ul className="space-y-2 text-xs text-slate-200">
                <li>• 100% ad-free, private, and instant load time</li>
                <li>• Procedural soundscapes synthesized right inside your browser</li>
                <li>• Local storage persistence: zero passwords to remember</li>
                <li>• Soothing dark forest green palette tuned for late night focus</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-[#132018]">
        <div className="text-center max-w-xl mx-auto mb-14">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
            Real Student Results
          </span>
          <h2 className="text-3xl font-extrabold text-white mt-2">
            Loved By Serious Students & Top Rankers
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-[#0a100c] border border-[#182c1f] p-6 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-2xl">{t.avatar}</div>
                  <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
                    <Flame className="w-3 h-3 fill-amber-500" />
                    <span>{t.streak}</span>
                  </div>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed italic">
                  &ldquo;{t.text}&rdquo;
                </p>
              </div>

              <div className="pt-6 border-t border-[#132018] mt-6">
                <div className="font-bold text-sm text-white">{t.name}</div>
                <div className="text-[11px] text-emerald-500 font-medium">{t.role}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="rounded-3xl bg-gradient-to-b from-emerald-950/60 via-[#0a120d] to-[#070c08] border border-emerald-500/30 p-10 sm:p-14 shadow-2xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Ready To Score Your Personal Best In Board Exams?
            </h2>
            <p className="text-sm text-slate-300">
              Start with one 25-minute study block today. Watch your focus compound into unstoppable confidence.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <button
                onClick={() => {
                  setPreset(25, 'focus');
                  startTimer();
                  setActiveTab('timer');
                }}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm tracking-wide transition-all shadow-lg shadow-emerald-500/30"
              >
                Start Your First Focus Block Free
              </button>
              <button
                onClick={() => setActiveTab('groups')}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#0c140f] hover:bg-[#132018] text-slate-200 border border-[#1b3123] font-semibold text-sm transition-all"
              >
                Browse Study Rooms
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
