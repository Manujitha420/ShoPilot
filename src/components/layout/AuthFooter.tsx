'use client';

import React from 'react';
import Link from 'next/link';

export default function AuthFooter() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="w-full bg-[#f1f3f9] border-t border-slate-200/60 py-6 px-6 md:px-12 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left Side: Brand & Copyright */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left gap-1">
          <span className="text-base font-bold text-[#3b42c4]">
            shoPilot
          </span>
          <span className="text-xs text-slate-500 font-medium">
            &copy; {currentYear === 2024 ? '2024' : '2024-' + currentYear} shoPilot AI. Precision Shopping.
          </span>
        </div>

        {/* Right Side: Links */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-semibold text-slate-600">
          <Link href="/privacy" className="hover:text-[#3b42c4] transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-[#3b42c4] transition-colors">
            Terms of Service
          </Link>
          <Link href="/help" className="hover:text-[#3b42c4] transition-colors">
            Help Center
          </Link>
          <Link href="/contact" className="hover:text-[#3b42c4] transition-colors">
            Contact Us
          </Link>
        </div>
      </div>
    </footer>
  );
}
