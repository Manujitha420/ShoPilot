'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { CheckCircle2, ShoppingBag, ArrowRight, Package, Sparkles } from 'lucide-react';

export default function CheckoutSuccessPage() {
  const [orderNumber, setOrderNumber] = useState<string>('');

  useEffect(() => {
    // Generate a random order number
    const randomOrder = 'SHP-' + Math.floor(100000 + Math.random() * 900000);
    setOrderNumber(randomOrder);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <Navbar />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-16 flex flex-col items-center justify-center text-center">
        <div className="bg-white border border-slate-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[32px] p-8 sm:p-12 w-full flex flex-col items-center">
          
          <div className="w-16 h-16 bg-emerald-50 border border-emerald-100 rounded-full flex items-center justify-center text-emerald-500 mb-6 shadow-xs animate-bounce">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="inline-flex items-center gap-1.5 bg-[#eef2ff] text-[#3b42c4] font-bold text-[10px] tracking-widest uppercase px-3 py-1.5 rounded-full mb-4">
            <Sparkles className="w-3 h-3" />
            <span>Order Confirmed</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Thank you for your purchase!
          </h1>
          
          <p className="text-slate-500 mt-2 text-sm sm:text-base leading-relaxed max-w-md">
            Your order has been placed successfully and is currently being processed by our automated fulfillment center.
          </p>

          <div className="mt-8 p-4 bg-slate-50 border border-slate-200/80 rounded-2xl w-full max-w-sm flex items-center justify-between text-xs sm:text-sm">
            <span className="text-slate-500 font-semibold">Order Reference:</span>
            <span className="font-extrabold text-[#3b42c4] font-mono">{orderNumber || 'SHP-849201'}</span>
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md">
            <Link
              href="/orders"
              className="flex items-center justify-center gap-2 py-3.5 px-6 bg-white border border-slate-200 hover:border-slate-300 text-slate-800 rounded-xl text-sm font-bold transition-all shadow-xs"
            >
              <Package className="w-4 h-4 text-indigo-600" />
              <span>Track Orders</span>
            </Link>

            <Link
              href="/products"
              className="flex items-center justify-center gap-2 py-3.5 px-6 bg-black hover:bg-slate-800 text-white rounded-xl text-sm font-bold transition-all shadow-sm group"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Continue Shopping</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
