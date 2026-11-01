'use client';

import React, { useState } from 'react';
import {
  X,
  Mail,
  Lock,
  User as UserIcon,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Loader2,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    authModalMode,
    closeAuthModal,
    setAuthModalMode,
    signIn,
    signUp,
  } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [grade, setGrade] = useState('Class 10');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      if (authModalMode === 'signin') {
        const { error } = await signIn(email.trim(), password);
        if (error) {
          // Provide friendly Hinglish/English beginner explanation
          if (error.includes('Invalid login credentials')) {
            setErrorMessage('गलत ईमेल या पासवर्ड। कृपया अपनी ईमेल और पासवर्ड की जाँच करें। (Invalid email or password).');
          } else {
            setErrorMessage(error);
          }
        } else {
          closeAuthModal();
        }
      } else {
        // Sign Up
        if (password.length < 6) {
          setErrorMessage('पासवर्ड कम से कम 6 अक्षरों का होना चाहिए। (Password must be at least 6 characters).');
          setIsLoading(false);
          return;
        }

        const { error, needsConfirmation } = await signUp(
          email.trim(),
          password,
          fullName.trim() || 'Student',
          grade
        );

        if (error) {
          if (error.includes('already registered')) {
            setErrorMessage('यह ईमेल पहले से रजिस्टर्ड है। कृपया "Sign In" टैब पर जाएँ। (Email is already registered).');
          } else {
            setErrorMessage(error);
          }
        } else if (needsConfirmation) {
          setSuccessMessage(
            'अकाउंट बन गया! कृपया अपने ईमेल इनबॉक्स में जाकर कन्फर्मेशन लिंक पर क्लिक करें। (Check your email to confirm).'
          );
        } else {
          setSuccessMessage('अकाउंट सफलतापूर्वक बन गया और आप लॉगिन हो चुके हैं! 🎉');
          setTimeout(() => {
            closeAuthModal();
          }, 1500);
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-md rounded-3xl bg-gradient-to-b from-[#0c1811] via-[#09120c] to-[#060b08] border border-[#1b3123] p-6 sm:p-8 space-y-6 shadow-2xl relative animate-in zoom-in-95">
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          title="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 mb-1">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-extrabold text-white">
            {authModalMode === 'signin' ? 'Sign In to FocusFlow' : 'Create Student Account'}
          </h3>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            {authModalMode === 'signin'
              ? 'Welcome back! Sync your study streaks and daily targets.'
              : 'Save your Class 10 board exam study sessions safely in Supabase Cloud.'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex rounded-xl bg-[#080d09] p-1 border border-[#182c1f]">
          <button
            type="button"
            onClick={() => {
              setAuthModalMode('signin');
              setErrorMessage(null);
              setSuccessMessage(null);
            }}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
              authModalMode === 'signin'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthModalMode('signup');
              setErrorMessage(null);
              setSuccessMessage(null);
            }}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
              authModalMode === 'signup'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Error Message Box */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-start gap-2.5 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div className="leading-relaxed">{errorMessage}</div>
          </div>
        )}

        {/* Success Message Box */}
        {successMessage && (
          <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-start gap-2.5 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div className="leading-relaxed">{successMessage}</div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {authModalMode === 'signup' && (
            <>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <UserIcon className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Your Full Name</span>
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Raunak Jaiswal"
                  className="w-full bg-[#0a100c] border border-[#1b3123] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Grade / Academic Goal</span>
                </label>
                <input
                  type="text"
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  placeholder="e.g. Class 10 CBSE Board"
                  className="w-full bg-[#0a100c] border border-[#1b3123] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
                />
              </div>
            </>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-emerald-400" />
              <span>Email Address</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="student@example.com"
              className="w-full bg-[#0a100c] border border-[#1b3123] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Password {authModalMode === 'signup' ? '(min 6 chars)' : ''}</span>
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#0a100c] border border-[#1b3123] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-500/20 hover:scale-[1.01] active:scale-[0.99] mt-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Connecting with Supabase...</span>
              </>
            ) : (
              <>
                <span>{authModalMode === 'signin' ? 'Sign In to Your Account' : 'Create Student Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer info */}
        <div className="text-center pt-2 border-t border-[#142419]">
          <button
            type="button"
            onClick={closeAuthModal}
            className="text-xs text-slate-400 hover:text-slate-200 transition-colors"
          >
            Continue in Guest Mode (Offline)
          </button>
        </div>
      </div>
    </div>
  );
};
