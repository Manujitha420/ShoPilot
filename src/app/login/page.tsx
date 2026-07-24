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
      window.location.href = redirectPath;
    }
  }, [isAuthenticated, redirectPath]);

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
            <div className="relative">
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder=" "
                className="peer w-full bg-white border border-slate-200 hover:border-slate-300 focus:border-[#3b42c4] focus:ring-1 focus:ring-[#3b42c4] text-slate-800 rounded-xl pl-4 pr-12 pt-6 pb-2.5 outline-none transition-all text-sm font-semibold"
              />
              <label
                htmlFor="username"
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-semibold transition-all duration-200 pointer-events-none origin-[0_0]
                           peer-focus:-translate-y-[18px] peer-focus:scale-75 peer-focus:text-[#3b42c4] peer-focus:font-bold
                           peer-[:not(:placeholder-shown)]:-translate-y-[18px] peer-[:not(:placeholder-shown)]:scale-75"
              >
                Email Address
              </label>
              <User className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder=" "
                className="peer w-full bg-white border border-slate-200 hover:border-slate-300 focus:border-[#3b42c4] focus:ring-1 focus:ring-[#3b42c4] text-slate-800 rounded-xl pl-4 pr-24 pt-6 pb-2.5 outline-none transition-all text-sm font-semibold"
              />
              <label
                htmlFor="password"
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-semibold transition-all duration-200 pointer-events-none origin-[0_0]
                           peer-focus:-translate-y-[18px] peer-focus:scale-75 peer-focus:text-[#3b42c4] peer-focus:font-bold
                           peer-[:not(:placeholder-shown)]:-translate-y-[18px] peer-[:not(:placeholder-shown)]:scale-75"
              >
                Password
              </label>
              <div className="absolute right-12 top-1/2 -translate-y-1/2 pr-1.5 flex items-center z-20">
                <Link
                  href="/forgot-password"
                  className="text-xs font-bold text-[#3b42c4] hover:underline"
                >
                  Forgot?
                </Link>
              </div>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none z-20"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Remember Me with expanding outline cool transition */}
          <div
            className="flex items-center select-none cursor-pointer group w-fit"
            onClick={() => setRememberMe(!rememberMe)}
          >
            <div className="relative flex items-center justify-center w-6 h-6">
              {/* Expanding outline background element */}
              <div className={`absolute inset-0 rounded-lg bg-[#3b42c4]/15 transition-all duration-500 ease-out transform
                ${rememberMe ? 'scale-[1.6] opacity-100' : 'scale-50 opacity-0 group-hover:scale-100 group-hover:opacity-40'}`}
              />
              {/* Checkbox box */}
              <div className={`relative w-4.5 h-4.5 rounded border transition-all duration-300 flex items-center justify-center z-10
                ${rememberMe
                  ? 'border-[#3b42c4] bg-[#3b42c4]'
                  : 'border-slate-300 bg-white group-hover:border-slate-400'
                }`}
              >
                {rememberMe && (
                  <svg className="w-3 h-3 text-white" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="17 5 8 14 3 9" />
                  </svg>
                )}
              </div>
            </div>
            <span className="ml-3 text-sm font-semibold text-slate-500 group-hover:text-slate-600 transition-colors">
              Remember me
            </span>
          </div>

          {/* Submit Button with slide-up hover fill transition */}
          <button
            type="submit"
            disabled={isLoggingIn}
            className="group relative w-full bg-black text-white font-bold py-3.5 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden cursor-pointer border border-black shadow-sm"
          >
            {/* Slide background overlay from bottom to top */}
            <span className="absolute inset-x-0 bottom-0 h-0 bg-white transition-all duration-300 ease-out group-hover:h-full z-0" />

            {/* Content */}
            <span className="relative z-10 flex items-center gap-2 transition-colors duration-600 group-hover:text-black">
              {isLoggingIn ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <span>LOGIN</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </span>
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

        {/* Social Buttons with zoom zoom zoom hover effect */}
        <div className="grid grid-cols-3 gap-3">
          {/* Google */}
          <button
            type="button"
            className="group flex items-center justify-center py-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all cursor-pointer"
          >
            <svg className="w-6 h-6 transition-transform duration-300 group-hover:scale-120" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.61c-.29 1.53-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-8.58z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.97-1.08 7.96-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.08 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.15C3.27 21.35 7.37 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.27 14.24A7.18 7.18 0 0 1 4.9 12c0-.79.13-1.57.37-2.31V6.54H1.29A11.94 11.94 0 0 0 0 12c0 2.05.52 4.02 1.29 5.76l3.98-3.52z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.44-3.44C17.96 1.19 15.24 0 12 0 7.37 0 3.27 2.65 1.29 6.54l3.98 3.15c.95-2.85 3.6-4.94 6.73-4.94z"
              />
            </svg>
          </button>

          {/* Facebook */}
          <button
            type="button"
            className="group flex items-center justify-center py-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all cursor-pointer"
          >
            <svg className="w-6 h-6 transition-transform duration-300 group-hover:scale-120" viewBox="0 0 24 24" fill="#1877F2">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          </button>

          {/* Apple */}
          <button
            type="button"
            className="group flex items-center justify-center py-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all cursor-pointer"
          >
            <svg className="w-6 h-6 transition-transform duration-300 group-hover:scale-120" viewBox="0 0 24 24" fill="#000000">
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
