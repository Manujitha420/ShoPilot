'use client';

import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full bg-[#f1f3f9] border-t border-slate-200/60 py-8 px-6 md:px-12 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Left Side: Brand & Description */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left gap-1">
          <span className="text-base font-bold text-[#3b42c4]">
            shoPilot
          </span>
          <p className="text-xs text-slate-500 font-medium max-w-sm">
            The AI-powered marketplace designed for precision and efficiency in every purchase.
          </p>
        </div>

        {/* Right Side: Links and Copyright */}
        <div className="flex flex-col items-center md:items-end gap-3 text-xs text-slate-600 font-semibold">
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
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
          <span className="text-[10px] text-slate-400 font-medium">
            &copy; 2024 shoPilot. Precision Shopping.
          </span>
        </div>

      </div>
    </footer>
  );
}
