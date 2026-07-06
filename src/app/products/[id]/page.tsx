'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import useProduct from '@/hooks/useProduct';
import useFavorites from '@/hooks/useFavorites';
import { useAuth } from '@/hooks/useAuth';
import { Skeleton } from '@/components/ui/Skeleton';
import { Star, Heart, ArrowLeft, ShieldCheck, Truck, RefreshCw, ThumbsUp, ThumbsDown, Sparkles, AlertCircle } from 'lucide-react';
import axios from 'axios';

interface SummaryResult {
  summary: string;
  pros: string[];
  cons: string[];
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const productId = Number(id);

  const { data: product, isLoading, error } = useProduct(productId);
  const { isFavorite, toggleFavorite } = useFavorites();
  const { isAuthenticated } = useAuth();

  // AI Summary states
  const [aiLoading, setAiLoading] = useState(false);
  const [summary, setSummary] = useState<SummaryResult | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  // Trigger AI summary once product load completes
  useEffect(() => {
    if (product) {
      const getSummary = async () => {
        setAiLoading(true);
        setAiError(null);
        try {
          const res = await axios.post('/api/ai', {
            type: 'summary',
            product,
          });
          if (res.data.success === false) {
            throw new Error(res.data.error || 'Failed to fetch summary');
          }
          setSummary(res.data);
        } catch (err: any) {
          console.error('Summary fetch error:', err);
          setAiError(
            err.response?.data?.error || 
            err.message || 
            'Could not retrieve AI analysis. Make sure NVIDIA_NIM_API_KEY is configured in .env.local.'
          );
        } finally {
          setAiLoading(false);
        }
      };
      getSummary();
    }
  }, [product]);

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
        <Navbar />
        <main className="max-w-3xl w-full mx-auto px-4 py-16 flex-1 flex flex-col items-center justify-center text-center">
          <AlertCircle className="w-16 h-16 text-rose-500 mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Product Not Found</h1>
          <p className="text-slate-400 mb-6">The product you are trying to view does not exist or was deleted.</p>
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm font-semibold hover:bg-slate-800 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Catalog
          </button>
        </main>
        <Footer />
      </div>
    );
  }

  const isFav = product ? isFavorite(product.id) : false;

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />

      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        {/* Back Button */}
        <button
          onClick={() => router.push('/')}
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm font-semibold mb-8 group cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to Catalog</span>
        </button>

        {isLoading || !product ? (
          /* Loading Spec Skeletons */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Skeleton className="w-full aspect-square rounded-3xl" />
            <div className="space-y-6">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-24 w-full" />
              <div className="h-px bg-slate-900" />
              <Skeleton className="h-12 w-1/3" />
            </div>
          </div>
        ) : (
          /* Main Spec Detail Layout */
          <div className="space-y-12">
            
            {/* Product Overview Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              
              {/* Product Gallery (Left) */}
              <div className="space-y-4">
                <div className="aspect-square bg-slate-950/80 border border-slate-900 rounded-3xl overflow-hidden flex items-center justify-center p-6">
                  <img
                    src={product.images[0] || product.thumbnail}
                    alt={product.title}
                    className="max-h-full object-contain rounded-2xl"
                  />
                </div>
                {/* Thumbnails Row if multiple */}
                {product.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-4">
                    {product.images.slice(0, 4).map((img, idx) => (
                      <div
                        key={idx}
                        className="aspect-square bg-slate-950/40 border border-slate-900 rounded-2xl overflow-hidden p-2 flex items-center justify-center"
                      >
                        <img
                          src={img}
                          alt={`${product.title} preview ${idx}`}
                          className="max-h-full object-contain"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Details Specs (Right) */}
              <div className="space-y-6">
                <div>
                  <span className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-lg">
                    {product.category.replace('-', ' ')}
                  </span>
                  <h1 className="text-3xl sm:text-4xl font-extrabold text-white mt-3 leading-tight">
                    {product.title}
                  </h1>
                  <p className="text-slate-500 text-sm mt-1">Brand: {product.brand || 'Generic'} | SKU: {product.sku}</p>
                </div>

                {/* Rating & Availability */}
                <div className="flex items-center gap-4 text-sm font-semibold">
                  <div className="flex items-center gap-1.5 text-amber-400 bg-amber-400/5 border border-amber-400/15 px-3 py-1 rounded-xl">
                    <Star className="w-4 h-4 fill-current" />
                    <span>{product.rating.toFixed(1)} / 5</span>
                  </div>
                  <span className="text-slate-600">|</span>
                  <span className={product.stock > 0 ? 'text-emerald-400' : 'text-rose-400'}>
                    {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
                  </span>
                </div>

                {/* Price card */}
                <div className="bg-slate-900/20 border border-slate-900 rounded-3xl p-6 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-slate-400 text-xs uppercase font-bold tracking-wider mb-1">
                      Price
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-black text-white">${product.price.toFixed(2)}</span>
                      {product.discountPercentage > 0 && (
                        <span className="text-slate-500 line-through text-sm">
                          ${(product.price / (1 - product.discountPercentage / 100)).toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (!isAuthenticated) {
                        router.push(`/login?redirect=${encodeURIComponent(`/products/${product.id}`)}`);
                        return;
                      }
                      toggleFavorite(product.id);
                    }}
                    className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm border transition-all cursor-pointer ${
                      isFav
                        ? 'bg-rose-500/10 border-rose-500/30 text-rose-500'
                        : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:text-white'
                    }`}
                  >
                    <Heart className={`w-4.5 h-4.5 ${isFav ? 'fill-current' : ''}`} />
                    <span>{isFav ? 'Favorited' : 'Add to Favorites'}</span>
                  </button>
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-slate-400 text-xs uppercase font-bold tracking-wider mb-2">
                    Description
                  </h3>
                  <p className="text-slate-300 text-sm leading-relaxed">{product.description}</p>
                </div>

                {/* Details list */}
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="bg-slate-900/10 border border-slate-900 p-4 rounded-2xl flex items-center gap-3">
                    <Truck className="w-5 h-5 text-indigo-400 shrink-0" />
                    <div>
                      <p className="text-slate-400 font-medium">Shipping Info</p>
                      <p className="text-slate-200 mt-0.5">{product.shippingInformation}</p>
                    </div>
                  </div>
                  <div className="bg-slate-900/10 border border-slate-900 p-4 rounded-2xl flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-indigo-400 shrink-0" />
                    <div>
                      <p className="text-slate-400 font-medium">Warranty</p>
                      <p className="text-slate-200 mt-0.5">{product.warrantyInformation}</p>
                    </div>
                  </div>
                </div>

              </div>

            </div>

            {/* AI analysis Section */}
            <div className="border border-indigo-500/10 bg-gradient-to-br from-indigo-950/10 via-slate-900/20 to-slate-950 rounded-3xl p-6 sm:p-8">
              
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400">
                  <Sparkles className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">ShoPilot AI Sentiment & Specs Review</h2>
                  <p className="text-xs text-slate-500">Real-time analysis powered by NVIDIA NIM (Llama 3.3 70B)</p>
                </div>
              </div>

              {aiLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-5/6" />
                  <Skeleton className="h-16 w-full" />
                </div>
              ) : aiError ? (
                <div className="flex items-start gap-3 bg-red-950/30 border border-red-800/40 rounded-2xl p-4 text-red-200 text-xs">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span>{aiError}</span>
                </div>
              ) : summary ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Summary paragraph */}
                  <div className="md:col-span-1 border-b md:border-b-0 md:border-r border-slate-900/60 pb-6 md:pb-0 pr-0 md:pr-8">
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                      Executive Summary
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed font-medium mt-3">
                      {summary.summary}
                    </p>
                  </div>

                  {/* Strengths */}
                  <div className="md:col-span-1">
                    <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider flex items-center gap-1.5">
                      <ThumbsUp className="w-3.5 h-3.5" /> Key Strengths
                    </span>
                    <ul className="space-y-2 mt-4 text-xs text-slate-300 pl-4 list-disc">
                      {summary.pros.map((pro, i) => (
                        <li key={i}>{pro}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Weaknesses */}
                  <div className="md:col-span-1">
                    <span className="text-[10px] uppercase font-bold text-rose-400 tracking-wider flex items-center gap-1.5">
                      <ThumbsDown className="w-3.5 h-3.5" /> Key Weaknesses
                    </span>
                    <ul className="space-y-2 mt-4 text-xs text-slate-300 pl-4 list-disc">
                      {summary.cons.map((con, i) => (
                        <li key={i}>{con}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <p className="text-slate-500 text-xs italic">Awaiting AI input...</p>
              )}

            </div>

            {/* Customer Reviews Section */}
            <div className="border border-slate-900 rounded-3xl p-6 sm:p-8">
              <h2 className="text-lg font-bold text-white mb-6">Customer Reviews</h2>
              
              {product.reviews && product.reviews.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {product.reviews.map((rev, idx) => (
                    <div key={idx} className="bg-slate-950/40 border border-slate-900 p-5 rounded-2xl flex flex-col justify-between h-[160px]">
                      <div>
                        <div className="flex items-center gap-1 text-amber-400 mb-3">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 ${
                                i < rev.rating ? 'fill-current' : 'text-slate-800'
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-slate-300 text-xs italic line-clamp-3">
                          &ldquo;{rev.comment}&rdquo;
                        </p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-slate-900/60 flex items-center justify-between text-[10px] text-slate-500">
                        <span className="font-semibold text-slate-400">{rev.reviewerName}</span>
                        <span>{new Date(rev.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 text-xs italic">No customer reviews yet for this product.</p>
              )}
            </div>

          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
