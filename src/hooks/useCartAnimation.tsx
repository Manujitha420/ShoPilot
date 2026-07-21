'use client';
import React, { useState } from 'react';

function FlyingCartDot({ startX, startY }: { startX: number, startY: number }) {
  return (
    <div
      className="fixed z-[9999] pointer-events-none rounded-full bg-emerald-400 shadow-sm flex items-center justify-center border-2 border-white"
      style={{
        left: startX - 8,
        top: startY - 8,
        width: '16px',
        height: '16px',
        animation: 'item-drop 0.4s cubic-bezier(0.5, 0, 1, 1) forwards'
      }}
    />
  );
}

export function useCartAnimation() {
  const [flyingDots, setFlyingDots] = useState<{ id: number, x: number, y: number }[]>([]);

  const animateCartAdd = (e: React.MouseEvent | undefined, onComplete: () => void) => {
    if (e) {
      const btn = e.currentTarget as HTMLElement;
      btn.classList.add('btn-catch-anim');
      setTimeout(() => btn.classList.remove('btn-catch-anim'), 500);

      const rect = btn.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      const id = Date.now() + Math.random();
      
      setFlyingDots(prev => [...prev, { id, x, y }]);
      
      setTimeout(() => {
        onComplete();
        window.dispatchEvent(new Event('shopilot_cart_bounce'));
        setFlyingDots(prev => prev.filter(dot => dot.id !== id));
      }, 400); // 400ms delay to let the drop animation finish
    } else {
      onComplete();
      window.dispatchEvent(new Event('shopilot_cart_bounce'));
    }
  };

  const flyingDotsOverlay = (
    <>
      {flyingDots.map(dot => (
        <FlyingCartDot key={dot.id} startX={dot.x} startY={dot.y} />
      ))}
    </>
  );

  return { animateCartAdd, flyingDotsOverlay };
}
