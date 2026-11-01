'use client';

import React from 'react';
import { AppProvider, useApp } from '@/context/AppContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { LandingPage } from '@/components/LandingPage';
import { DashboardView } from '@/components/DashboardView';
import { TimerView } from '@/components/TimerView';
import { MusicView } from '@/components/MusicView';
import { AnalyticsView } from '@/components/AnalyticsView';
import { StudyGroupsView } from '@/components/StudyGroupsView';
import { SettingsView } from '@/components/SettingsView';
import { AuthModal } from '@/components/AuthModal';

function MainAppContent() {
  const { activeTab } = useApp();

  return (
    <div className="flex flex-col min-h-screen bg-[#060b08] text-slate-100 font-sans selection:bg-emerald-500/25 selection:text-emerald-300">
      <Navbar />

      <main className="flex-1 w-full">
        {activeTab === 'landing' && <LandingPage />}
        {activeTab === 'dashboard' && <DashboardView />}
        {activeTab === 'timer' && <TimerView />}
        {activeTab === 'music' && <MusicView />}
        {activeTab === 'analytics' && <AnalyticsView />}
        {activeTab === 'groups' && <StudyGroupsView />}
        {activeTab === 'settings' && <SettingsView />}
      </main>

      <Footer />
      <AuthModal />
    </div>
  );
}

export default function Home() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
