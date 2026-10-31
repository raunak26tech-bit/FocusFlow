'use client';

import React, { useState } from 'react';
import {
  Users,
  Plus,
  Search,
  Sparkles,
  CheckCircle,
  Clock,
  Shield,
  ArrowRight,
  Flame,
  X,
  Send,
  Heart,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { StudyRoom } from '@/types';
import confetti from 'canvas-confetti';

export const StudyGroupsView: React.FC = () => {
  const {
    rooms,
    addRoom,
    joinRoom,
    activeRoomId,
    setActiveRoomId,
    settings,
    setPreset,
    startTimer,
    setActiveTab,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New room form states
  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomSubject, setNewRoomSubject] = useState('Mathematics');
  const [newRoomDesc, setNewRoomDesc] = useState('');
  const [newRoomCapacity, setNewRoomCapacity] = useState(20);

  // Floating cheers state in active room
  const [cheers, setCheers] = useState<string[]>([]);

  // Filter rooms
  const filteredRooms = rooms.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTag =
      selectedTag === 'All' ||
      r.subject.toLowerCase().includes(selectedTag.toLowerCase()) ||
      r.tags.some((t) => t.toLowerCase().includes(selectedTag.toLowerCase()));

    return matchesSearch && matchesTag;
  });

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomName.trim()) return;

    addRoom({
      name: newRoomName,
      subject: newRoomSubject,
      description:
        newRoomDesc ||
        `Dedicated focus room hosted by ${settings.studentName} for productive study.`,
      maxParticipants: newRoomCapacity,
      hostName: settings.studentName,
      tags: [newRoomSubject, 'Student Room', settings.gradeLevel.split('—')[0].trim()],
      currentSession: 'Pomodoro 25m • Active Now',
    });

    setNewRoomName('');
    setNewRoomDesc('');
    setShowCreateModal(false);
  };

  const sendCheer = (emoji: string) => {
    setCheers((prev) => [...prev, emoji]);
    try {
      confetti({
        particleCount: 25,
        spread: 60,
        origin: { y: 0.8 },
      });
    } catch {}

    setTimeout(() => {
      setCheers((prev) => prev.slice(1));
    }, 2000);
  };

  // Active room data if student joined a room
  const activeRoom = rooms.find((r) => r.id === activeRoomId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-[#0c1811] via-[#09120c] to-[#070e09] border border-[#1b3123] p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl relative overflow-hidden">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <Users className="w-3.5 h-3.5" />
            <span>Virtual Accountability Rooms</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Study Together, Beat Procrastination
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Join silent study rooms with fellow students preparing for Class 10 & 12 exams. Double your focus through quiet social accountability.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-emerald-500/20 hover:scale-[1.02]"
        >
          <Plus className="w-4 h-4" />
          <span>Create Study Room</span>
        </button>
      </div>

      {/* Active Joined Room Modal / Screen */}
      {activeRoom && (
        <div className="rounded-3xl bg-gradient-to-b from-[#0c1c13] via-[#08110b] to-[#050906] border-2 border-emerald-500/50 p-6 sm:p-8 shadow-2xl relative space-y-6 animate-in zoom-in-95">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#182c1f]">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-300 text-xs font-bold font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>CURRENTLY IN ROOM: {activeRoom.name}</span>
              </div>
              <h2 className="text-xl font-bold text-white mt-1.5">{activeRoom.subject}</h2>
              <p className="text-xs text-slate-400">
                Hosted by {activeRoom.hostName} • {activeRoom.participantsCount} students focusing silently
              </p>
            </div>

            <button
              onClick={() => setActiveRoomId(null)}
              className="px-4 py-2 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 hover:bg-red-900/50 text-xs font-semibold flex items-center gap-2 transition-all"
            >
              <X className="w-4 h-4" />
              <span>Leave Room</span>
            </button>
          </div>

          {/* Virtual Desk Peers */}
          <div className="space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Students Focusing With You Right Now:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {[
                { name: `${settings.studentName} (You)`, subject: 'Current Subject', isYou: true },
                { name: 'Aryan S.', subject: 'Maths Trigonometry', isYou: false },
                { name: 'Priya P.', subject: 'Science Light', isYou: false },
                { name: 'Sneha R.', subject: 'Social Science', isYou: false },
                { name: 'Rohan V.', subject: 'English Prose', isYou: false },
                { name: 'Devansh K.', subject: 'Sample Paper', isYou: false },
              ].map((peer, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border flex flex-col items-center text-center space-y-1.5 ${
                    peer.isYou
                      ? 'bg-emerald-950/50 border-emerald-500/50 shadow-md shadow-emerald-500/20'
                      : 'bg-[#09110c] border-[#182c1f]'
                  }`}
                >
                  <div className="w-9 h-9 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-sm">
                    {peer.isYou ? '🎯' : '🧑‍🎓'}
                  </div>
                  <div className="text-xs font-bold text-white truncate w-full">
                    {peer.name}
                  </div>
                  <div className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Studying</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cheer buttons */}
          <div className="p-4 rounded-xl bg-[#090f0b] border border-[#182c1f] flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs text-slate-300 font-medium">
              Send silent encouragement to study peers:
            </span>
            <div className="flex items-center gap-2">
              {['👏 Great Focus!', '🔥 Keep Crushing It', '💪 Halfway There', '⭐ 100% Target'].map(
                (cheerText) => (
                  <button
                    key={cheerText}
                    onClick={() => sendCheer(cheerText.split(' ')[0])}
                    className="px-3 py-1.5 rounded-lg bg-[#0e1711] hover:bg-[#14231a] text-slate-200 border border-[#1b3123] text-xs font-medium transition-all hover:border-emerald-500/40 active:scale-95"
                  >
                    {cheerText}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Quick jump to timer */}
          <div className="pt-2 flex justify-end">
            <button
              onClick={() => {
                setPreset(25, 'focus');
                startTimer();
                setActiveTab('timer');
              }}
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-emerald-500/20"
            >
              <span>Sync With Room Timer (25m) →</span>
            </button>
          </div>
        </div>
      )}

      {/* Search & Subject Filter Bar */}
      <div className="rounded-2xl bg-[#090f0b] border border-[#182c1f] p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search rooms by name, exam or subject..."
            className="w-full bg-[#0c140f] border border-[#182c1f] rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {['All', 'Mathematics', 'Science', 'Class 10', 'Silent'].map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                selectedTag === tag
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-[#0c140f] text-slate-400 border-[#182c1f] hover:text-white'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Room Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredRooms.map((room) => {
          const isJoined = activeRoomId === room.id;

          return (
            <div
              key={room.id}
              className={`rounded-2xl p-6 border transition-all duration-200 flex flex-col justify-between space-y-5 ${
                isJoined
                  ? 'bg-[#0d1c13] border-emerald-500/60 shadow-lg shadow-emerald-500/10'
                  : 'bg-[#090f0b] border-[#182c1f] hover:border-[#223d2b]'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {room.subject}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>
                      {room.participantsCount}/{room.maxParticipants} studying
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white">{room.name}</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {room.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {room.tags.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 rounded text-[10px] bg-[#111e15] text-slate-400 border border-[#192f20]"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom details & action */}
              <div className="pt-4 border-t border-[#142419] flex items-center justify-between">
                <div className="text-[11px] text-slate-400">
                  <span>Host: </span>
                  <span className="text-white font-medium">{room.hostName}</span>
                </div>

                {isJoined ? (
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Joined</span>
                  </span>
                ) : (
                  <button
                    onClick={() => joinRoom(room.id)}
                    className="px-4 py-1.5 rounded-lg bg-[#112117] hover:bg-emerald-500 hover:text-slate-950 text-emerald-300 border border-emerald-500/30 text-xs font-bold transition-all"
                  >
                    Join Room
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Room Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-[#090f0b] border border-[#1b3123] p-6 space-y-5 shadow-2xl relative animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#182c1f]">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-400" />
                <span>Create New Study Room</span>
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRoom} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Room Name
                </label>
                <input
                  type="text"
                  required
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                  placeholder="e.g. Class 10 Maths Sample Paper Drill"
                  className="w-full bg-[#0c140f] border border-[#182c1f] rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Subject</label>
                <select
                  value={newRoomSubject}
                  onChange={(e) => setNewRoomSubject(e.target.value)}
                  className="w-full bg-[#0c140f] border border-[#182c1f] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500/50"
                >
                  <option value="Mathematics">Mathematics</option>
                  <option value="Science">Science (Physics / Chem / Bio)</option>
                  <option value="Social Science">Social Science (History / Geo / Pol)</option>
                  <option value="English">English</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Silent Study">Silent Study (All Subjects)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Description / Study Objective
                </label>
                <textarea
                  rows={3}
                  value={newRoomDesc}
                  onChange={(e) => setNewRoomDesc(e.target.value)}
                  placeholder="What is the group working on? (e.g. Solving 2024 CBSE question papers)"
                  className="w-full bg-[#0c140f] border border-[#182c1f] rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Max Participants: {newRoomCapacity}
                </label>
                <input
                  type="range"
                  min="5"
                  max="50"
                  step="5"
                  value={newRoomCapacity}
                  onChange={(e) => setNewRoomCapacity(Number(e.target.value))}
                  className="w-full accent-emerald-500"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20"
                >
                  Create & Launch Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
