import React from 'react';
import AuthHeader from '@/components/layout/AuthHeader';
import AuthFooter from '@/components/layout/AuthFooter';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-[#f5f6fa] text-slate-800">
      <AuthHeader />

      <main className="flex-1 flex items-center justify-center p-6 relative">
        {/* Soft background glows */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-100/30 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl -z-10 pointer-events-none" />

        {children}
      </main>

      <AuthFooter />
    </div>
  );
}
