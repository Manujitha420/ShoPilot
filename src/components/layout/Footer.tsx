import React from 'react';
import { Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-slate-950 border-t border-slate-900 py-8 px-4 text-center mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col items-center justify-between gap-4 md:flex-row md:px-8">
        
        {/* Brand */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600/10 border border-indigo-500/20 rounded-lg flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-indigo-400" />
          </div>
          <span className="text-sm font-bold text-slate-300">ShoPilot</span>
        </div>

        {/* Text */}
        <p className="text-xs text-slate-500">
          &copy; {new Date().getFullYear()} ShoPilot AI. Powered by NVIDIA NIM and DummyJSON APIs. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
