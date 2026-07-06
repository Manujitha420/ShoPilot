'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useFavorites } from '@/hooks/useFavorites';
import { Product } from '@/types';
import { Star, Heart, ArrowRightLeft, Sparkles } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  isComparingSelected: boolean;
  onCompareToggle: () => void;
  canCompare: boolean;
}

export default function ProductCard({
  product,
  isComparingSelected,
  onCompareToggle,
  canCompare,
}: ProductCardProps) {
  const { isAuthenticated } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  const router = useRouter();

  const isFav = isFavorite(product.id);
  
  // Calculate original price before discount
  const originalPrice = product.discountPercentage 
    ? (product.price / (1 - product.discountPercentage / 100)).toFixed(2)
    : null;

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      router.push(`/login?redirect=${encodeURIComponent('/')}`);
      return;
    }
    toggleFavorite(product.id);
  };

  return (
    <div className="group relative backdrop-blur-md bg-slate-900/30 border border-slate-900 hover:border-slate-800/80 rounded-3xl p-5 flex flex-col h-[420px] transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1">
      
      {/* Product Image Container */}
      <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-slate-950/80 mb-4 border border-slate-900">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Floating Category Badge */}
        <span className="absolute top-3 left-3 bg-slate-950/85 backdrop-blur-md border border-slate-800/80 text-[10px] font-bold text-slate-300 uppercase tracking-widest px-2.5 py-1 rounded-lg">
          {product.category.replace('-', ' ')}
        </span>

        {/* Favorite Button */}
        <button
          onClick={handleFavoriteClick}
          className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur-md border transition-all duration-200 cursor-pointer ${
            isFav
              ? 'bg-rose-500/10 border-rose-500/30 text-rose-500 hover:bg-rose-500/20'
              : 'bg-slate-950/65 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-950/90'
          }`}
        >
          <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
        </button>

        {/* Discount Badge */}
        {product.discountPercentage > 0 && (
          <span className="absolute bottom-3 left-3 bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-400 px-2 py-0.5 rounded-lg">
            -{Math.round(product.discountPercentage)}% OFF
          </span>
        )}
      </div>

      {/* Product Metadata */}
      <div className="flex flex-col flex-1">
        {/* Brand & Rating */}
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="text-slate-500 font-medium truncate max-w-[60%]">
            {product.brand || 'Generic'}
          </span>
          <div className="flex items-center gap-1 text-amber-400 bg-amber-400/5 px-2 py-0.5 rounded-lg border border-amber-400/10">
            <Star className="w-3 h-3 fill-current" />
            <span className="font-semibold">{product.rating.toFixed(1)}</span>
          </div>
        </div>

        {/* Title */}
        <Link href={`/products/${product.id}`} className="block group-hover:text-indigo-400 transition-colors">
          <h3 className="text-base font-bold text-slate-200 line-clamp-2 leading-snug">
            {product.title}
          </h3>
        </Link>

        {/* Stock status indicator */}
        <div className="mt-2 mb-4 text-xs font-medium">
          {product.stock <= 5 ? (
            <span className="text-rose-400">Only {product.stock} left in stock</span>
          ) : (
            <span className="text-slate-500">In Stock ({product.stock})</span>
          )}
        </div>

        {/* Price & Action Section */}
        <div className="mt-auto pt-4 border-t border-slate-900/60 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-lg font-black text-slate-100">${product.price.toFixed(2)}</span>
            {originalPrice && (
              <span className="text-xs text-slate-500 line-through">${originalPrice}</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Compare Toggle Button */}
            <button
              onClick={(e) => {
                e.preventDefault();
                onCompareToggle();
              }}
              disabled={!isComparingSelected && !canCompare}
              title={isComparingSelected ? 'Remove from Comparison' : 'Add to Comparison'}
              className={`p-2.5 rounded-xl border transition-all duration-200 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed ${
                isComparingSelected
                  ? 'bg-indigo-500/10 border-indigo-500/40 text-indigo-400'
                  : 'bg-slate-950/40 border-slate-900 hover:border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-950/80'
              }`}
            >
              <ArrowRightLeft className="w-4 h-4" />
            </button>

            {/* View Details Link */}
            <Link
              href={`/products/${product.id}`}
              className="flex items-center gap-1 px-3 py-2 bg-slate-900 hover:bg-slate-800/80 border border-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-semibold transition-all"
            >
              <span>Details</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
