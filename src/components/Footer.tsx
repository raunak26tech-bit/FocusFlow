'use client';

import React from 'react';
import { Sparkles, Heart, Shield, ArrowUpRight } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export const Footer: React.FC = () => {
  const { setActiveTab } = useApp();

  return (
    <footer className="w-full border-t border-[#182c1f] bg-[#050906] text-slate-400 py-12 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand column */}
        <div className="md:col-span-1 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="font-bold text-white text-base">FocusFlow</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            The modern deep-work productivity sanctuary inspired by Regain. Designed specifically for students to achieve effortless focus and exam mastery.
          </p>
          <div className="flex items-center gap-2 text-[11px] text-emerald-500 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>All systems nominal & fully client-side</span>
          </div>
        </div>

        {/* Quick Features */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">
            Features
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <button
                onClick={() => setActiveTab('timer')}
                className="hover:text-emerald-400 transition-colors flex items-center gap-1"
              >
                <span>Pomodoro Focus Timer</span>
                <ArrowUpRight className="w-3 h-3 opacity-60" />
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('music')}
                className="hover:text-emerald-400 transition-colors flex items-center gap-1"
              >
                <span>Ambient Soundscape</span>
                <ArrowUpRight className="w-3 h-3 opacity-60" />
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('groups')}
                className="hover:text-emerald-400 transition-colors flex items-center gap-1"
              >
                <span>Virtual Study Groups</span>
                <ArrowUpRight className="w-3 h-3 opacity-60" />
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('analytics')}
                className="hover:text-emerald-400 transition-colors flex items-center gap-1"
              >
                <span>Streak & Productivity Stats</span>
                <ArrowUpRight className="w-3 h-3 opacity-60" />
              </button>
            </li>
          </ul>
        </div>

        {/* Study Subjects */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">
            Built For Class 10 & 12
          </h4>
          <ul className="space-y-2 text-xs text-slate-400">
            <li>• Mathematics & Sample Papers</li>
            <li>• Science (Physics, Chemistry, Biology)</li>
            <li>• Social Science & Timeline Flashcards</li>
            <li>• English & Language Comprehension</li>
            <li>• Coding & Computer Science</li>
          </ul>
        </div>

        {/* Motivational Quote */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
            Study Wisdom
          </h4>
          <div className="p-3.5 rounded-xl bg-[#0c140f] border border-[#182c1f] text-xs italic text-slate-300 leading-relaxed">
            &ldquo;Small daily disciplines repeated consistently over time lead to stunning board exam results.&rdquo;
          </div>
          <div className="text-[11px] text-slate-500 flex items-center gap-1">
            <Shield className="w-3.5 h-3.5 text-emerald-500" />
            <span>100% Privacy — All data saved locally on your device</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-10 pt-6 border-t border-[#132018] flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
        <p>© 2026 FocusFlow. Inspired by Regain (regainapp.ai).</p>
        <div className="flex items-center gap-1">
          <span>Crafted with</span>
          <Heart className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400 inline" />
          <span>for curious student developers.</span>
        </div>
      </div>
    </footer>
  );
};
