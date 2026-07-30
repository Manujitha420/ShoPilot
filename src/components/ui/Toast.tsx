'use client';

import React, { useState, useEffect } from 'react';
import { Check } from 'lucide-react';

export function triggerCartToast(message: string = 'Added 1 Item to Cart!') {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('shopilot_cart_added', { detail: { message } }));
  }
}

export default function Toast() {
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({
    message: 'Added 1 Item to Cart!',
    visible: false,
  });

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const handleCartAdded = (e: Event) => {
      const customEvent = e as CustomEvent<{ message?: string }>;
      const msg = customEvent.detail?.message || 'Added 1 Item to Cart!';
      
      setToast({ message: msg, visible: true });

      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        setToast((prev) => ({ ...prev, visible: false }));
      }, 3000);
    };

    window.addEventListener('shopilot_cart_added', handleCartAdded);
    return () => {
      window.removeEventListener('shopilot_cart_added', handleCartAdded);
      if (timer) clearTimeout(timer);
    };
  }, []);

  if (!toast.visible) return null;

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] animate-slideDown pointer-events-none">
      <div 
        className="bg-black text-white font-bold text-xs sm:text-sm px-6 py-3.5 shadow-2xl flex items-center gap-3 border border-slate-800/80"
        style={{ borderRadius: '35px' }}
      >
        <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
          <Check className="w-4 h-4 stroke-[3]" />
        </div>
        <span className="tracking-wide select-none">{toast.message}</span>
      </div>
    </div>
  );
}
