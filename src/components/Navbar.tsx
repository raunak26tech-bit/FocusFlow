'use client';

import React, { useState } from 'react';
import {
  Flame,
  Clock,
  Music,
  BarChart3,
  Users,
  Settings,
  LayoutDashboard,
  Sparkles,
  Menu,
  X,
  Volume2,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { ActiveTab } from '@/types';

export const Navbar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    currentStreak,
    isRunning,
    timeLeft,
    activeSubject,
    ambientTracks,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Check if any ambient track is currently playing
  const isAnySoundPlaying = Object.values(ambientTracks).some((t) => t.isPlaying);

  // Format mm:ss for mini timer
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeFormatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const navLinks: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'timer', label: 'Focus Timer', icon: <Clock className="w-4 h-4" /> },
    { id: 'music', label: 'Focus Music', icon: <Music className="w-4 h-4" /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'groups', label: 'Study Groups', icon: <Users className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#182c1f] bg-[#060b08]/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div
          onClick={() => {
            setActiveTab('landing');
            setMobileMenuOpen(false);
          }}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-900 flex items-center justify-center shadow-lg shadow-emerald-900/30 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-emerald-100" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-lg tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                FocusFlow
              </span>
              <span className="text-[10px] uppercase font-semibold tracking-wider px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                PRO
              </span>
            </div>
            <span className="text-[11px] text-emerald-600 font-medium -mt-1 hidden sm:inline">
              Deep Study Sanctuary
            </span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 bg-[#0c140f]/80 p-1 rounded-xl border border-[#182c1f]">
          {navLinks.map((link) => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => setActiveTab(link.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.icon}
                <span>{link.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right side status badges & CTA */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Active Sound Indicator */}
          {isAnySoundPlaying && (
            <button
              onClick={() => setActiveTab('music')}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-xs animate-pulse hover:bg-emerald-900/50"
              title="Ambient sound is playing"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span className="font-mono">Audio On</span>
            </button>
          )}

          {/* Mini Timer Live Badge (if running and not on timer page) */}
          {isRunning && activeTab !== 'timer' && (
            <button
              onClick={() => setActiveTab('timer')}
              className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-medium hover:bg-emerald-500/25 transition-all"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>{timeFormatted}</span>
              <span className="text-emerald-500 truncate max-w-[80px]">
                {activeSubject}
              </span>
            </button>
          )}

          {/* Streak Badge */}
          <div
            onClick={() => setActiveTab('analytics')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0c140f] border border-[#182c1f] text-amber-400 text-xs font-semibold cursor-pointer hover:border-amber-500/40 transition-colors"
            title={`${currentStreak} days continuous study streak!`}
          >
            <Flame className="w-4 h-4 fill-amber-500 text-amber-500 animate-bounce" />
            <span>{currentStreak} {currentStreak === 1 ? 'Day' : 'Days'} Streak</span>
          </div>

          {/* Landing / App View Toggle */}
          {activeTab === 'landing' ? (
            <button
              onClick={() => setActiveTab('dashboard')}
              className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs tracking-wide transition-all shadow-md shadow-emerald-500/20 hover:scale-[1.02]"
            >
              Open App →
            </button>
          ) : (
            <button
              onClick={() => setActiveTab('landing')}
              className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white text-xs font-medium hover:bg-white/5 transition-colors"
            >
              Home
            </button>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-2">
          {/* Mobile Streak */}
          <div
            onClick={() => setActiveTab('analytics')}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#0c140f] border border-[#182c1f] text-amber-400 text-xs font-semibold"
          >
            <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span>{currentStreak}d</span>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/5"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#182c1f] bg-[#080d09] px-4 pt-2 pb-4 space-y-1 animate-in slide-in-from-top-2 duration-150">
          <button
            onClick={() => {
              setActiveTab('landing');
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
              activeTab === 'landing'
                ? 'bg-emerald-600/20 text-emerald-400'
                : 'text-slate-300 hover:bg-white/5'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Landing Page</span>
          </button>

          {navLinks.map((link) => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => {
                  setActiveTab(link.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isActive
                    ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30'
                    : 'text-slate-300 hover:bg-white/5'
                }`}
              >
                {link.icon}
                <span>{link.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
