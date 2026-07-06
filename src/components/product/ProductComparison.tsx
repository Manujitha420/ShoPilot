'use client';

import React, { useState } from 'react';
import { Product } from '@/types';
import { Sparkles, ArrowRightLeft, ThumbsUp, ThumbsDown, Check, X, AlertCircle } from 'lucide-react';
import axios from 'axios';

interface ProductComparisonProps {
  productA: Product;
  productB: Product;
  onClose: () => void;
}

interface ComparisonResult {
  differences: string[];
  pros: {
    productA: string[];
    productB: string[];
  };
  cons: {
    productA: string[];
    productB: string[];
  };
  recommendation: string;
}

export default function ProductComparison({
  productA,
  productB,
  onClose,
}: ProductComparisonProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ComparisonResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generateComparison = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('/api/ai', {
        type: 'compare',
        productA,
        productB,
      });
      
      if (response.data.success === false) {
        throw new Error(response.data.error || 'Failed to compare');
      }

      setResult(response.data);
    } catch (err: any) {
      console.error('Comparison error:', err);
      setError(
        err.response?.data?.error || 
        err.message || 
        'Could not generate comparison. Please check that your NVIDIA NIM API Key is set up correctly in .env.local.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto max-h-[85vh] scrollbar-none text-slate-200 p-6 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-900/60 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600/10 border border-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-400">
            <ArrowRightLeft className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Compare Products</h2>
            <p className="text-xs text-slate-500">Analyze features, pricing and AI recommendation side-by-side</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 bg-slate-900/40 border border-slate-900 hover:border-slate-800 text-slate-400 hover:text-white rounded-xl transition-all cursor-pointer text-xs font-semibold"
        >
          Close
        </button>
      </div>

      {/* Product Spec Side-by-Side Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Product A */}
        <div className="backdrop-blur-md bg-slate-900/10 border border-slate-900 p-5 rounded-2xl flex items-center gap-4">
          <img
            src={productA.thumbnail}
            alt={productA.title}
            className="w-20 h-20 object-cover bg-slate-950 rounded-xl border border-slate-900 shrink-0"
          />
          <div className="flex-1 min-w-0">
            <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-400">
              Product A
            </span>
            <h3 className="font-bold text-white text-sm truncate mt-0.5">{productA.title}</h3>
            <p className="text-slate-400 font-semibold text-sm mt-1">${productA.price.toFixed(2)}</p>
            <p className="text-xs text-slate-500 mt-0.5">Rating: {productA.rating} / 5</p>
          </div>
        </div>

        {/* Product B */}
        <div className="backdrop-blur-md bg-slate-900/10 border border-slate-900 p-5 rounded-2xl flex items-center gap-4">
          <img
            src={productB.thumbnail}
            alt={productB.title}
            className="w-20 h-20 object-cover bg-slate-950 rounded-xl border border-slate-900 shrink-0"
          />
          <div className="flex-1 min-w-0">
            <span className="text-[10px] uppercase font-bold tracking-widest text-purple-400">
              Product B
            </span>
            <h3 className="font-bold text-white text-sm truncate mt-0.5">{productB.title}</h3>
            <p className="text-slate-400 font-semibold text-sm mt-1">${productB.price.toFixed(2)}</p>
            <p className="text-xs text-slate-500 mt-0.5">Rating: {productB.rating} / 5</p>
          </div>
        </div>
      </div>

      {/* AI trigger block */}
      {!result && !loading && (
        <div className="flex flex-col items-center justify-center py-10 bg-slate-900/20 border border-slate-900/80 border-dashed rounded-3xl text-center px-6">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20 mb-4 animate-bounce">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h4 className="text-base font-bold text-slate-200 mb-1">
            NVIDIA Llama 3.3 Comparison Analysis
          </h4>
          <p className="text-xs text-slate-500 max-w-sm mb-6">
            Compare target details, analyze user ratings, identify key differences, and generate a final shopping recommendation.
          </p>
          
          <button
            onClick={generateComparison}
            className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-sm font-semibold transition-all duration-200 shadow-md shadow-indigo-600/20 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate AI Comparison</span>
          </button>
        </div>
      )}

      {/* Loading analysis block */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-12 bg-slate-900/10 border border-slate-900/40 rounded-3xl">
          <div className="w-10 h-10 border-4 border-indigo-600/30 border-t-indigo-500 rounded-full animate-spin mb-4" />
          <h4 className="text-sm font-bold text-slate-200 mb-1 animate-pulse">
            Consulting ShoPilot AI...
          </h4>
          <p className="text-xs text-slate-500">Processing specifications and review sentiment.</p>
        </div>
      )}

      {/* Error block */}
      {error && (
        <div className="flex items-start gap-3 bg-red-950/45 border border-red-800/40 rounded-2xl p-5 text-red-200 text-sm mb-6">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-semibold block mb-1">AI Request Failed</span>
            <span className="text-slate-400 text-xs leading-relaxed">{error}</span>
          </div>
        </div>
      )}

      {/* Results output */}
      {result && (
        <div className="space-y-8 animate-fadeIn">
          
          {/* Differences */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-indigo-400 mb-3">
              Key Differences
            </h4>
            <ul className="space-y-2 bg-slate-900/15 border border-slate-900 p-5 rounded-2xl">
              {result.differences.map((diff, i) => (
                <li key={i} className="flex items-start gap-2.5 text-slate-300 text-xs leading-relaxed">
                  <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full shrink-0 mt-1.5" />
                  <span>{diff}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Pros and Cons side-by-side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Product A Pros/Cons */}
            <div className="border border-slate-900 p-5 rounded-2xl bg-slate-950/20">
              <span className="text-[10px] uppercase font-black text-indigo-400 tracking-wider">
                {productA.title}
              </span>
              
              {/* Pros */}
              <div className="mt-4">
                <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 mb-2">
                  <ThumbsUp className="w-3.5 h-3.5 text-emerald-500" /> Strengths
                </span>
                <ul className="space-y-1.5 pl-5 list-disc text-xs text-slate-300">
                  {result.pros.productA.map((pro, i) => (
                    <li key={i}>{pro}</li>
                  ))}
                </ul>
              </div>

              {/* Cons */}
              <div className="mt-5">
                <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 mb-2">
                  <ThumbsDown className="w-3.5 h-3.5 text-rose-500" /> Weaknesses
                </span>
                <ul className="space-y-1.5 pl-5 list-disc text-xs text-slate-300">
                  {result.cons.productA.map((con, i) => (
                    <li key={i}>{con}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Product B Pros/Cons */}
            <div className="border border-slate-900 p-5 rounded-2xl bg-slate-950/20">
              <span className="text-[10px] uppercase font-black text-purple-400 tracking-wider">
                {productB.title}
              </span>

              {/* Pros */}
              <div className="mt-4">
                <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 mb-2">
                  <ThumbsUp className="w-3.5 h-3.5 text-emerald-500" /> Strengths
                </span>
                <ul className="space-y-1.5 pl-5 list-disc text-xs text-slate-300">
                  {result.pros.productB.map((pro, i) => (
                    <li key={i}>{pro}</li>
                  ))}
                </ul>
              </div>

              {/* Cons */}
              <div className="mt-5">
                <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 mb-2">
                  <ThumbsDown className="w-3.5 h-3.5 text-rose-500" /> Weaknesses
                </span>
                <ul className="space-y-1.5 pl-5 list-disc text-xs text-slate-300">
                  {result.cons.productB.map((con, i) => (
                    <li key={i}>{con}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* AI Recommendation */}
          <div className="relative overflow-hidden bg-gradient-to-r from-indigo-950/40 to-purple-950/40 border border-indigo-500/20 rounded-2xl p-6">
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl -z-10 pointer-events-none" />
            
            <h4 className="text-sm font-extrabold text-white flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-indigo-400 fill-current animate-pulse" />
              AI Recommendation & Verdict
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              {result.recommendation}
            </p>
          </div>

        </div>
      )}
    </div>
  );
}
