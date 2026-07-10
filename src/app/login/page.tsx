'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { User, Eye, EyeOff, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import AuthHeader from '@/components/layout/AuthHeader';
import AuthFooter from '@/components/layout/AuthFooter';

function LoginFormContent() {
  const { login, error, isLoggingIn, isAuthenticated } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
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
    <div className="w-full max-w-[480px]">
      {/* Centered White Card */}
      <div className="bg-white border border-slate-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[24px] p-8 md:p-10 text-slate-800">
        {/* Badge */}
        <div className="flex justify-start mb-5">
          <div className="flex items-center gap-1 bg-[#eef2ff] text-[#3b42c4] font-bold text-[10px] tracking-widest uppercase px-3 py-1.5 rounded-full">
            <span className="text-[12px] leading-none select-none">✦</span>
            <span>Precision Shopping</span>
          </div>
        </div>

        {/* Title & Subtitle */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Welcome back
          </h1>
          <p className="text-slate-500 mt-2 text-sm leading-relaxed">
            Log in to manage your AI-powered shopping ecosystem.
          </p>
        </div>

        {/* Error Notification */}
        {(error || localError) && (
          <div className="mb-6 flex items-start gap-3 bg-red-50 border border-red-200 rounded-2xl p-4 text-red-700 text-sm">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <span>{localError || error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-2">
              Email or Username
            </label>
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="name@company.com"
                className="w-full bg-white border border-slate-200 hover:border-slate-300 focus:border-[#3b42c4] focus:ring-1 focus:ring-[#3b42c4] text-slate-800 rounded-xl pl-4 pr-12 py-3 outline-none transition-all text-sm placeholder-slate-400 font-medium"
              />
              <User className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-slate-500">
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-xs font-semibold text-[#3b42c4] hover:underline"
              >
                Forgot?
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white border border-slate-200 hover:border-slate-300 focus:border-[#3b42c4] focus:ring-1 focus:ring-[#3b42c4] text-slate-800 rounded-xl pl-4 pr-12 py-3 outline-none transition-all text-sm placeholder-slate-400 font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center">
            <input
              id="remember-me"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4.5 w-4.5 text-[#3b42c4] focus:ring-[#3b42c4] border-slate-300 rounded cursor-pointer"
            />
            <label
              htmlFor="remember-me"
              className="ml-2 block text-sm font-semibold text-slate-500 cursor-pointer"
            >
              Remember me
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoggingIn}
            className="w-full bg-[#3b42c4] hover:bg-[#2d33a6] text-white font-bold py-3.5 px-6 rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm text-sm disabled:opacity-50 cursor-pointer"
          >
            {isLoggingIn ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <span>Login</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Separator */}
        <div className="relative my-7 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200/80" />
          </div>
          <span className="relative bg-white px-3 text-xs text-slate-400 font-semibold uppercase tracking-wider">
            Or SignIn with
          </span>
        </div>

        {/* Social Buttons */}
        <div className="grid grid-cols-3 gap-3">
          {/* Google */}
          <button
            type="button"
            className="flex items-center justify-center py-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 shadow-sm transition-all cursor-pointer"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.34 0-6.05-2.71-6.05-6.05s2.71-6.05 6.05-6.05c1.478 0 2.822.535 3.862 1.417l3.078-3.078C18.91 2.99 15.827 2 12.24 2 6.584 2 2 6.584 2 12.24s4.584 10.24 10.24 10.24c5.795 0 9.828-4.073 9.828-9.982 0-.67-.06-1.3-.17-1.89l-9.658-.323z"
              />
            </svg>
          </button>

          {/* Facebook */}
          <button
            type="button"
            className="flex items-center justify-center py-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 shadow-sm transition-all cursor-pointer"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#1877F2">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          </button>

          {/* Apple */}
          <button
            type="button"
            className="flex items-center justify-center py-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 shadow-sm transition-all cursor-pointer"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#000000">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.21.67-2.93 1.49-.62.69-1.16 1.84-1.01 2.96 1.1.09 2.23-.58 2.95-1.39z" />
            </svg>
          </button>
        </div>

        {/* Create Account Link */}
        <div className="mt-8 text-center text-sm">
          <span className="text-slate-500 font-semibold">Don't have an account? </span>
          <Link
            href="/register"
            className="font-bold text-[#3b42c4] hover:underline"
          >
            Create an account
          </Link>
        </div>
      </div>

      {/* Subtle developer demo credentials helper helper */}
      <div className="mt-6 p-4 bg-white/50 backdrop-blur-sm border border-slate-200/50 rounded-2xl text-slate-600 text-xs">
        <p className="font-bold mb-2 text-slate-700">Developer Demo Accounts:</p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => handleFillDemo('emilys')}
            className="flex-1 bg-white hover:bg-slate-50 border border-slate-200 py-1.5 px-3 rounded-lg font-medium transition-colors text-center cursor-pointer"
          >
            Emily (emilys)
          </button>
          <button
            type="button"
            onClick={() => handleFillDemo('michaelw')}
            className="flex-1 bg-white hover:bg-slate-50 border border-slate-200 py-1.5 px-3 rounded-lg font-medium transition-colors text-center cursor-pointer"
          >
            Michael (michaelw)
          </button>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#f5f6fa] text-slate-800">
      <AuthHeader />

      <main className="flex-1 flex items-center justify-center p-6 relative">
        {/* Soft background glows */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-100/30 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl -z-10 pointer-events-none" />

        <Suspense fallback={
          <div className="bg-white border border-slate-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[24px] p-10 max-w-md w-full flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-8 h-8 text-[#3b42c4] animate-spin" />
            <p className="text-slate-500 font-semibold text-sm">Loading login portal...</p>
          </div>
        }>
          <LoginFormContent />
        </Suspense>
      </main>

      <AuthFooter />
    </div>
  );
}
