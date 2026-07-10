'use client';

import React from 'react';
import Link from 'next/link';
import { Bell, ShoppingCart } from 'lucide-react';

export default function AuthHeader() {
  return (
    <header className="w-full bg-white border-b border-slate-100 py-4 px-6 md:px-12 flex items-center justify-between">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 group">
        <span className="text-xl font-bold tracking-tight text-[#3b42c4]">
          shoPilot
        </span>
      </Link>

      {/* Header Controls */}
      <div className="flex items-center gap-6 text-slate-600">
        <button className="p-2 hover:text-slate-900 hover:bg-slate-50 rounded-full transition-colors relative">
          <Bell className="w-5 h-5 text-slate-500 stroke-[2]" />
          {/* Subtle indicator dot */}
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-600 rounded-full border border-white" />
        </button>
        <button className="p-2 hover:text-slate-900 hover:bg-slate-50 rounded-full transition-colors">
          <ShoppingCart className="w-5 h-5 text-slate-500 stroke-[2]" />
        </button>
        <div className="w-9 h-9 rounded-full overflow-hidden border border-slate-200">
          <img
            src="https://dummyjson.com/icon/emilys/128"
            alt="User Avatar"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </header>
  );
}
