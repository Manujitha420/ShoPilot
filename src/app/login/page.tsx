'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { LogIn, Sparkles, User, Lock, AlertCircle, CheckCircle } from 'lucide-react';

function LoginFormContent() {
  const { login, error, isLoggingIn, isAuthenticated } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const redirectPath = searchParams?.get('redirect') || '/';

  useEffect(() => {
    if (isAuthenticated) {
      router.push(redirectPath);
    }
  }, [isAuthenticated, router, redirectPath]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!username.trim() || !password.trim()) {
      setLocalError('Please fill in all fields.');
      return;
    }

    try {
      await login({ username, password });
    } catch (err) {
      // Error is handled inside useAuth context
    }
  };

  const handleFillDemo = (demoUser: 'emilys' | 'michaelw') => {
    if (demoUser === 'emilys') {
      setUsername('emilys');
      setPassword('emilyspass');
    } else {
      setUsername('michaelw');
      setPassword('michaelwpass');
    }
  };

  return (
    <div className="w-full max-w-md">
      {/* Background glowing elements */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />

      {/* Glassmorphic Container */}
      <div className="relative overflow-hidden backdrop-blur-xl bg-slate-900/60 border border-slate-800/80 shadow-2xl rounded-3xl p-8 md:p-10">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20 mb-4 animate-pulse">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-indigo-200 to-indigo-400 bg-clip-text text-transparent">
            Welcome to ShoPilot
          </h1>
          <p className="text-slate-400 mt-2 text-sm">
            Experience AI-driven e-commerce matching your exact shopping needs.
          </p>
        </div>

        {/* Error Notifications */}
        {(error || localError) && (
          <div className="mb-6 flex items-start gap-3 bg-red-950/40 border border-red-800/50 rounded-2xl p-4 text-red-200 text-sm animate-shake">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <span>{localError || error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Username
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. emilys"
                className="w-full bg-slate-950/50 hover:bg-slate-950/80 focus:bg-slate-950 border border-slate-800 focus:border-indigo-500 text-white rounded-2xl pl-12 pr-4 py-3.5 outline-none transition-all duration-200 text-sm placeholder-slate-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950/50 hover:bg-slate-950/80 focus:bg-slate-950 border border-slate-800 focus:border-indigo-500 text-white rounded-2xl pl-12 pr-4 py-3.5 outline-none transition-all duration-200 text-sm placeholder-slate-600"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoggingIn}
            className="w-full relative group overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/40 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoggingIn ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Sign In</span>
                <LogIn className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>
        </form>

        {/* Separator */}
        <div className="relative my-8 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-800" />
          </div>
          <span className="relative bg-slate-900/0 px-3 text-xs text-slate-500 uppercase tracking-widest backdrop-blur-md">
            Demo Credentials
          </span>
        </div>

        {/* Demo Users */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleFillDemo('emilys')}
            className="flex flex-col items-center p-3 bg-slate-950/40 hover:bg-slate-950/80 border border-slate-800/80 rounded-2xl transition-all text-left text-xs cursor-pointer group"
          >
            <span className="font-semibold text-slate-300 group-hover:text-indigo-400 transition-colors">Emily Smith</span>
            <span className="text-slate-500 mt-1">Username: emilys</span>
          </button>
          <button
            type="button"
            onClick={() => handleFillDemo('michaelw')}
            className="flex flex-col items-center p-3 bg-slate-950/40 hover:bg-slate-950/80 border border-slate-800/80 rounded-2xl transition-all text-left text-xs cursor-pointer group"
          >
            <span className="font-semibold text-slate-300 group-hover:text-indigo-400 transition-colors">Michael Williams</span>
            <span className="text-slate-500 mt-1">Username: michaelw</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 bg-slate-950 relative min-h-screen">
      <Suspense fallback={
        <div className="backdrop-blur-xl bg-slate-900/60 border border-slate-800/80 shadow-2xl rounded-3xl p-10 max-w-md w-full flex flex-col items-center justify-center gap-4">
          <span className="w-8 h-8 border-4 border-indigo-600/30 border-t-indigo-500 rounded-full animate-spin" />
          <p className="text-slate-400 text-sm">Loading login portal...</p>
        </div>
      }>
        <LoginFormContent />
      </Suspense>
    </div>
  );
}
