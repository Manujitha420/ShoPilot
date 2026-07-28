'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Package, ArrowRight, Clock, CheckCircle2, ChevronRight } from 'lucide-react';

const MOCK_ORDERS = [
  {
    id: 'SHP-984210',
    date: '2026-07-26',
    status: 'Delivered',
    total: 129.99,
    items: [
      { title: 'Essence Mascara Lash Princess', qty: 2, price: 9.99, thumbnail: 'https://cdn.dummyjson.com/products/images/beauty/Essence%20Mascara%20Lash%20Princess/thumbnail.png' },
      { title: 'Eyeshadow Palette with Mirror', qty: 1, price: 109.99, thumbnail: 'https://cdn.dummyjson.com/products/images/beauty/Eyeshadow%20Palette%20with%20Mirror/thumbnail.png' }
    ]
  },
  {
    id: 'SHP-732104',
    date: '2026-07-20',
    status: 'Processing',
    total: 49.99,
    items: [
      { title: 'Calvin Klein CK One', qty: 1, price: 49.99, thumbnail: 'https://cdn.dummyjson.com/products/images/fragrances/Calvin%20Klein%20CK%20One/thumbnail.png' }
    ]
  }
];

export default function OrdersPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
              <Package className="w-8 h-8 text-[#3b42c4]" />
              <span>Order History</span>
            </h1>
            <p className="text-slate-500 text-sm mt-1">Manage and track your recent ShoPilot orders.</p>
          </div>

          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#3b42c4] hover:underline"
          >
            <span>Explore Products</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {MOCK_ORDERS.map((order) => (
            <div
              key={order.id}
              className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-4 hover:border-slate-300 transition-colors"
            >
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-extrabold text-slate-900 text-sm">{order.id}</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-slate-500 text-xs font-semibold">{order.date}</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                    order.status === 'Delivered'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    {order.status === 'Delivered' ? (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    ) : (
                      <Clock className="w-3.5 h-3.5" />
                    )}
                    <span>{order.status}</span>
                  </span>

                  <span className="text-sm font-black text-slate-900">${order.total.toFixed(2)}</span>
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-3">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs sm:text-sm">
                    <div className="flex items-center gap-3">
                      <img src={item.thumbnail} alt={item.title} className="w-10 h-10 object-contain bg-slate-50 border rounded-lg p-1" />
                      <div>
                        <p className="font-bold text-slate-800">{item.title}</p>
                        <p className="text-slate-400 text-xs">Qty: {item.qty}</p>
                      </div>
                    </div>
                    <span className="font-semibold text-slate-700">${(item.price * item.qty).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {/* Action */}
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#3b42c4] hover:text-[#2d33a6] cursor-pointer"
                >
                  <span>View Order Details</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </main>

      <Footer />
    </div>
  );
}
