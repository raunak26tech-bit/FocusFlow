'use client';

import React from 'react';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  CloudRain,
  Trees,
  Radio,
  Wind,
  Coffee,
  Sparkles,
  Sliders,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { AmbientSoundId } from '@/types';

interface TrackConfig {
  id: AmbientSoundId;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  tags: string[];
}

export const MusicView: React.FC = () => {
  const {
    ambientTracks,
    toggleAmbientTrack,
    setTrackVolume,
    stopAllAmbient,
  } = useApp();

  const tracks: TrackConfig[] = [
    {
      id: 'rain',
      title: 'Monsoon Rain & Gentle Thunder',
      subtitle: 'Soft, steady rainfall filtering through forest leaves. Perfect for late-night problem solving.',
      icon: <CloudRain className="w-6 h-6 text-emerald-400" />,
      tags: ['Pink Noise', 'Deep Sleep', 'Maths Prep'],
    },
    {
      id: 'forest',
      title: 'Pine Forest & Mountain Breeze',
      subtitle: 'Gentle rustling pines and distant morning nature reverberations. Calms pre-exam anxiety.',
      icon: <Trees className="w-6 h-6 text-emerald-400" />,
      tags: ['Resonant Wind', 'Nature Sanctuary', 'Reading'],
    },
    {
      id: 'lofi',
      title: '432Hz Binaural Theta Tone',
      subtitle: 'Science-backed 4Hz brainwave frequency tuning your mental state into effortless deep absorption.',
      icon: <Radio className="w-6 h-6 text-emerald-400" />,
      tags: ['432Hz Harmonized', 'Theta Waves', 'Memory Retention'],
    },
    {
      id: 'whitenoise',
      title: 'Brown Noise Focus Masking',
      subtitle: 'Warm low-end static that blankets household chatter, fan noise, and traffic instantly.',
      icon: <Wind className="w-6 h-6 text-emerald-400" />,
      tags: ['Audio Blanket', 'Zero Distraction', 'High Concentration'],
    },
    {
      id: 'cafe',
      title: 'Cozy Library Ambience',
      subtitle: 'Warm, low-frequency atmospheric hum of a quiet university study hall.',
      icon: <Coffee className="w-6 h-6 text-emerald-400" />,
      tags: ['Atmospheric', 'Silent Grinding', 'Productive Energy'],
    },
  ];

  const isAnyPlaying = Object.values(ambientTracks).some((t) => t.isPlaying);

  // Quick Mood Preset applicator
  const applyPresetMood = (preset: 'monsoon' | 'nature' | 'hyperfocus') => {
    stopAllAmbient();
    setTimeout(() => {
      if (preset === 'monsoon') {
        toggleAmbientTrack('rain');
        setTrackVolume('rain', 0.6);
      } else if (preset === 'nature') {
        toggleAmbientTrack('forest');
        setTrackVolume('forest', 0.5);
      } else if (preset === 'hyperfocus') {
        toggleAmbientTrack('lofi');
        setTrackVolume('lofi', 0.5);
        toggleAmbientTrack('whitenoise');
        setTrackVolume('whitenoise', 0.3);
      }
    }, 100);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-200">
      {/* Top Banner & Master Controls */}
      <div className="rounded-3xl bg-gradient-to-r from-[#0c1811] via-[#09120c] to-[#070e09] border border-[#1b3123] p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl relative overflow-hidden">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Zero-Distraction Audio Sanctuary</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Focus Soundscapes & Ambient Mixer
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Synthesized procedural soundscapes that run directly in your browser. No internet lag, no YouTube ads, and no unexpected pauses.
          </p>
        </div>

        {/* Master Stop Button */}
        <div className="flex items-center gap-3 relative z-10 w-full md:w-auto">
          {isAnyPlaying && (
            <button
              onClick={stopAllAmbient}
              className="px-4 py-2.5 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 hover:bg-red-900/50 text-xs font-semibold flex items-center gap-2 transition-all"
            >
              <VolumeX className="w-4 h-4" />
              <span>Mute All Sounds</span>
            </button>
          )}

          {/* Animated visualizer if playing */}
          {isAnyPlaying && (
            <div className="flex items-end gap-1 h-6 px-3 py-1 bg-emerald-950/40 rounded-lg border border-emerald-500/20">
              <span className="w-1 bg-emerald-400 rounded-full animate-bounce h-4" />
              <span className="w-1 bg-emerald-400 rounded-full animate-bounce h-6 delay-75" />
              <span className="w-1 bg-emerald-400 rounded-full animate-bounce h-3 delay-150" />
              <span className="w-1 bg-emerald-400 rounded-full animate-bounce h-5 delay-100" />
            </div>
          )}
        </div>
      </div>

      {/* Mood Presets Quick Bar */}
      <div className="rounded-2xl bg-[#090f0b] border border-[#182c1f] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
          <Sliders className="w-3.5 h-3.5 text-emerald-400" />
          <span>Curated Study Moods:</span>
        </span>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => applyPresetMood('monsoon')}
            className="px-3 py-1.5 rounded-lg bg-[#0e1711] border border-[#1a2e21] text-xs text-slate-200 hover:border-emerald-500/50 hover:text-emerald-300 transition-all"
          >
            🌧️ Monsoon Focus
          </button>
          <button
            onClick={() => applyPresetMood('nature')}
            className="px-3 py-1.5 rounded-lg bg-[#0e1711] border border-[#1a2e21] text-xs text-slate-200 hover:border-emerald-500/50 hover:text-emerald-300 transition-all"
          >
            🌲 Deep Forest Sanctuary
          </button>
          <button
            onClick={() => applyPresetMood('hyperfocus')}
            className="px-3 py-1.5 rounded-lg bg-[#0e1711] border border-[#1a2e21] text-xs text-slate-200 hover:border-emerald-500/50 hover:text-emerald-300 transition-all"
          >
            ⚡ Theta 432Hz + Brown Noise
          </button>
        </div>
      </div>

      {/* Sound Track Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tracks.map((track) => {
          const trackState = ambientTracks[track.id];
          const isPlaying = trackState?.isPlaying || false;
          const volume = trackState?.volume ?? 0.5;

          return (
            <div
              key={track.id}
              className={`rounded-2xl p-6 border transition-all duration-200 flex flex-col justify-between space-y-5 ${
                isPlaying
                  ? 'bg-gradient-to-b from-[#0e1c13] to-[#09120c] border-emerald-500/50 shadow-lg shadow-emerald-500/10'
                  : 'bg-[#090f0b] border-[#182c1f] hover:border-[#223d2b]'
              }`}
            >
              {/* Card Header */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all ${
                      isPlaying
                        ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 scale-105'
                        : 'bg-[#101912] border-[#1a2e21] text-slate-400'
                    }`}
                  >
                    {track.icon}
                  </div>

                  {/* Play / Pause Toggle Button */}
                  <button
                    onClick={() => toggleAmbientTrack(track.id)}
                    className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
                      isPlaying
                        ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/30'
                        : 'bg-[#121f16] hover:bg-[#182b1f] text-emerald-400 border border-emerald-500/30'
                    }`}
                  >
                    {isPlaying ? (
                      <Pause className="w-5 h-5 fill-slate-950" />
                    ) : (
                      <Play className="w-5 h-5 fill-emerald-400 ml-0.5" />
                    )}
                  </button>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white">{track.title}</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {track.subtitle}
                  </p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {track.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#111e15] text-slate-400 border border-[#1b3122]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Volume Slider */}
              <div className="pt-4 border-t border-[#142419] space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Track Volume</span>
                  </span>
                  <span className="font-mono text-emerald-400">
                    {Math.round(volume * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={(e) => setTrackVolume(track.id, Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
