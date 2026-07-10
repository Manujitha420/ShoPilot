'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { User, Mail, Lock, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import AuthHeader from '@/components/layout/AuthHeader';
import AuthFooter from '@/components/layout/AuthFooter';

function RegisterFormContent() {
  const { register, error, isRegistering, isAuthenticated } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
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

    // Form Validations
    if (!fullName.trim() || !email.trim() || !password || !confirmPassword) {
      setLocalError('Please fill in all fields.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setLocalError('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setLocalError('Passwords do not match.');
      return;
    }

    if (!agreeToTerms) {
      setLocalError('You must agree to the Terms of Service and Privacy Policy.');
      return;
    }

    try {
      const nameParts = fullName.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      // Generate a mock username using the email prefix and a random suffix
      const username = email.split('@')[0] + Math.floor(Math.random() * 1000);

      await register({
        username,
        email,
        firstName,
        lastName,
        password,
      });
    } catch (err) {
      // Error is handled inside useAuth context
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
            <span>AI-Powered Shopping</span>
          </div>
        </div>

        {/* Title & Subtitle */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Create your account
          </h1>
          <p className="text-slate-500 mt-2 text-sm leading-relaxed">
            Join the AI-powered shopping revolution
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
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full bg-white border border-slate-200 hover:border-slate-300 focus:border-[#3b42c4] focus:ring-1 focus:ring-[#3b42c4] text-slate-800 rounded-xl pl-12 pr-4 py-3 outline-none transition-all text-sm placeholder-slate-400 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-white border border-slate-200 hover:border-slate-300 focus:border-[#3b42c4] focus:ring-1 focus:ring-[#3b42c4] text-slate-800 rounded-xl pl-12 pr-4 py-3 outline-none transition-all text-sm placeholder-slate-400 font-medium"
              />
            </div>
          </div>

          {/* Password & Confirm Password (2 Columns) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white border border-slate-200 hover:border-slate-300 focus:border-[#3b42c4] focus:ring-1 focus:ring-[#3b42c4] text-slate-800 rounded-xl pl-12 pr-4 py-3 outline-none transition-all text-sm placeholder-slate-400 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                {/* Custom Reset-Lock SVG Icon */}
                <svg
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l.73-.72" />
                  <rect x="9" y="11" width="6" height="5" rx="1" />
                  <path d="M10 11V9a2 2 0 0 1 4 0v2" />
                </svg>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white border border-slate-200 hover:border-slate-300 focus:border-[#3b42c4] focus:ring-1 focus:ring-[#3b42c4] text-slate-800 rounded-xl pl-12 pr-4 py-3 outline-none transition-all text-sm placeholder-slate-400 font-medium"
                />
              </div>
            </div>
          </div>

          {/* Agreement Checkbox */}
          <div className="flex items-start">
            <input
              id="agree-to-terms"
              type="checkbox"
              checked={agreeToTerms}
              onChange={(e) => setAgreeToTerms(e.target.checked)}
              className="h-4.5 w-4.5 text-[#3b42c4] focus:ring-[#3b42c4] border-slate-300 rounded cursor-pointer mt-0.5"
            />
            <label
              htmlFor="agree-to-terms"
              className="ml-2 block text-sm font-semibold text-slate-500 cursor-pointer select-none leading-normal"
            >
              I agree to the{' '}
              <Link href="/terms" className="text-[#3b42c4] hover:underline font-bold">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-[#3b42c4] hover:underline font-bold">
                Privacy Policy
              </Link>
              .
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isRegistering}
            className="w-full bg-[#3b42c4] hover:bg-[#2d33a6] text-white font-bold py-3.5 px-6 rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm text-sm disabled:opacity-50 cursor-pointer"
          >
            {isRegistering ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <span>Create Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Sign In Link */}
        <div className="mt-8 text-center text-sm">
          <span className="text-slate-500 font-semibold">Already have an account? </span>
          <Link
            href="/login"
            className="font-bold text-[#3b42c4] hover:underline"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
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
            <p className="text-slate-500 font-semibold text-sm">Loading registration portal...</p>
          </div>
        }>
          <RegisterFormContent />
        </Suspense>
      </main>

      <AuthFooter />
    </div>
  );
}
