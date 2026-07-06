'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/product/ProductCard';
import { ProductCardSkeleton } from '@/components/ui/Skeleton';
import { useAuth } from '@/hooks/useAuth';
import { useFavorites } from '@/hooks/useFavorites';
import { Heart, ArrowLeft, LogIn, Sparkles } from 'lucide-react';

export default function FavoritesPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { favoriteProducts, isLoading: favsLoading, toggleFavorite, favoriteIds } = useFavorites();
  const router = useRouter();

  // Route Guard: redirect unauthenticated users to login page
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push(`/login?redirect=${encodeURIComponent('/favorites')}`);
    }
  }, [isAuthenticated, authLoading, router]);

  if (authLoading || (!isAuthenticated && !authLoading)) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
        <Navbar />
        <main className="max-w-3xl w-full mx-auto px-4 py-20 flex-1 flex flex-col items-center justify-center text-center">
          <div className="w-10 h-10 border-4 border-indigo-600/30 border-t-indigo-500 rounded-full animate-spin mb-4" />
          <p className="text-slate-400 text-sm">Verifying session...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />

      {/* Header */}
      <section className="relative overflow-hidden py-10 border-b border-slate-900/60 bg-gradient-to-b from-rose-950/10 via-slate-950 to-slate-950">
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-rose-500/5 rounded-full blur-3xl -z-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
            <Heart className="w-3.5 h-3.5 fill-current animate-pulse" /> Curated Collection
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Your Favorites
          </h1>
          <p className="text-slate-400 mt-2 text-sm leading-relaxed max-w-xl">
            Save products you like, compare their specs, and check AI feedback before buying.
          </p>
        </div>
      </section>

      {/* Favorites Catalog list */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        {favsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-pulse">
            {[...Array(4)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : favoriteProducts.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/10 border border-slate-900/60 rounded-3xl max-w-md mx-auto">
            <div className="w-12 h-12 bg-slate-950/80 border border-slate-800 rounded-2xl flex items-center justify-center text-slate-500 mx-auto mb-4">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-200 mb-1">Your list is empty</h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto mb-6">
              Tap the heart icon on any product in the catalog to add it to your curated favorites list.
            </p>
            <button
              onClick={() => router.push('/')}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-600/10 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Catalog</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-fadeIn">
            {favoriteProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isComparingSelected={false}
                onCompareToggle={() => {}} // Disabled or ignored in simple listing
                canCompare={false}
              />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
