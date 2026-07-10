'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useFavorites } from '@/hooks/useFavorites';
import { useAuth } from '@/hooks/useAuth';
import { 
  Sparkles, 
  Search, 
  ArrowRight, 
  ArrowRightLeft, 
  Heart, 
  ShoppingCart, 
  Star, 
  ChevronLeft, 
  ChevronRight, 
  MessageSquare,
  Sparkle,
  BadgeAlert,
  Bot,
  Layers,
  Sparkle as SparkleIcon,
  ShieldCheck,
  Check
} from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  // Trending Products data
  const trendingProducts = [
    {
      id: 901,
      title: 'Aura Sound Max Wireless',
      price: 299.00,
      rating: 4.9,
      category: 'Electronics',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 902,
      title: 'Zenith Watch Pro',
      price: 349.00,
      rating: 4.8,
      category: 'Wearables',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 903,
      title: 'Nova Mechanical Core',
      price: 159.00,
      rating: 4.7,
      category: 'Computing',
      image: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 904,
      title: 'Lumina X-900 Mirrorless',
      price: 1299.00,
      rating: 5.0,
      category: 'Photography',
      image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&auto=format&fit=crop&q=80',
    },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/chat?query=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setSubscribed(true);
      setEmailInput('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  const handleFavoriteClick = (productId: number, e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      router.push(`/login?redirect=${encodeURIComponent('/')}`);
      return;
    }
    toggleFavorite(productId);
  };

  const handleAddToCart = () => {
    setCartCount(prev => prev + 1);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-800 relative">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 md:py-24 bg-white text-center">
        {/* Soft background glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-50/40 rounded-full blur-3xl -z-10 pointer-events-none" />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-1 bg-[#eef2ff] text-[#3b42c4] font-extrabold text-[10px] tracking-widest uppercase px-3 py-1.5 rounded-full mb-6">
            <span className="text-[12px] leading-none select-none">✦</span>
            <span>Next-Gen Shopping AI</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-none max-w-3xl">
            Find the <span className="bg-gradient-to-r from-[#3b42c4] to-indigo-500 bg-clip-text text-transparent">Perfect Product</span> with AI
          </h1>

          {/* Subtitle */}
          <p className="text-slate-500 mt-6 text-base sm:text-lg max-w-2xl leading-relaxed">
            Stop scrolling and start finding. Our intelligent engine analyzes millions of products to match your exact needs in seconds.
          </p>

          {/* Search Box */}
          <form onSubmit={handleSearchSubmit} className="w-full max-w-2xl mt-10">
            <div className="relative flex items-center bg-white border border-slate-200 focus-within:border-[#3b42c4] focus-within:ring-1 focus-within:ring-[#3b42c4] rounded-2xl p-2 shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-all">
              <Sparkles className="w-5 h-5 text-[#3b42c4] ml-3 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ask AI anything... e.g. Recommend a gaming laptop under $1000"
                className="w-full bg-transparent text-slate-800 placeholder-slate-400 pl-3 pr-4 py-2.5 outline-none text-sm font-semibold"
              />
              <button
                type="submit"
                className="bg-[#3b42c4] hover:bg-[#2d33a6] text-white font-bold px-6 py-2.5 rounded-xl transition-all shadow-sm text-sm shrink-0 cursor-pointer"
              >
                Search
              </button>
            </div>
          </form>

          {/* Actions */}
          <div className="flex flex-wrap justify-center items-center gap-4 mt-8">
            <Link
              href="/products"
              className="bg-[#3b42c4] hover:bg-[#2d33a6] text-white font-bold py-3 px-6 rounded-xl transition-all shadow-sm text-sm"
            >
              Start Shopping
            </Link>
            <Link
              href="/chat"
              className="bg-white hover:bg-slate-50 text-[#3b42c4] border border-slate-200 font-bold py-3 px-6 rounded-xl transition-all text-sm flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Try AI Assistant</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Category Section */}
      <section id="categories" className="py-16 bg-white border-t border-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl font-black tracking-tight text-slate-900">
                Shop by Category
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Curated collections for every lifestyle.
              </p>
            </div>
            <Link
              href="/products"
              className="flex items-center gap-1 text-sm font-bold text-[#3b42c4] hover:underline"
            >
              <span>View all</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Custom Category Grid Layout */}
          <div className="space-y-6">
            {/* Top Grid Area */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Smartphones (tall, left card) */}
              <Link
                href="/products?category=smartphones"
                className="md:row-span-2 relative overflow-hidden rounded-[24px] bg-slate-50 h-[320px] md:h-full min-h-[360px] group border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.01)] transition-all hover:shadow-md cursor-pointer"
              >
                <img
                  src="https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=80"
                  alt="Smartphones"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Light overlay at the bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/20 to-transparent z-0" />
                <div className="absolute bottom-6 left-6 z-10 flex flex-col items-start gap-1">
                  <span className="bg-[#eef2ff] text-[#3b42c4] font-extrabold text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-md">
                    Tech Hub
                  </span>
                  <span className="text-xl font-bold text-slate-800">
                    Smartphones
                  </span>
                </div>
              </Link>

              {/* Laptops (wide, top right card) */}
              <Link
                href="/products?category=laptops"
                className="md:col-span-2 relative overflow-hidden rounded-[24px] bg-slate-50 h-[220px] group border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.01)] transition-all hover:shadow-md cursor-pointer"
              >
                <img
                  src="https://images.unsplash.com/photo-1496181130204-7552cc145cdb?w=600&auto=format&fit=crop&q=80"
                  alt="Laptops"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/10 to-transparent z-0" />
                <div className="absolute bottom-6 left-6 z-10">
                  <span className="text-xl font-bold text-slate-800">
                    Laptops
                  </span>
                </div>
              </Link>

              {/* Furniture */}
              <Link
                href="/products?category=furniture"
                className="relative overflow-hidden rounded-[24px] bg-slate-50 h-[220px] group border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.01)] transition-all hover:shadow-md cursor-pointer"
              >
                <img
                  src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&auto=format&fit=crop&q=80"
                  alt="Furniture"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/10 to-transparent z-0" />
                <div className="absolute bottom-6 left-6 z-10">
                  <span className="text-xl font-bold text-slate-800">
                    Furniture
                  </span>
                </div>
              </Link>

              {/* Beauty */}
              <Link
                href="/products?category=beauty"
                className="relative overflow-hidden rounded-[24px] bg-slate-50 h-[220px] group border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.01)] transition-all hover:shadow-md cursor-pointer"
              >
                <img
                  src="https://images.unsplash.com/photo-1608248597481-496100c80836?w=600&auto=format&fit=crop&q=80"
                  alt="Beauty"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/10 to-transparent z-0" />
                <div className="absolute bottom-6 left-6 z-10">
                  <span className="text-xl font-bold text-slate-800">
                    Beauty
                  </span>
                </div>
              </Link>
            </div>

            {/* Bottom Grid Area */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Groceries */}
              <Link
                href="/products?category=groceries"
                className="relative overflow-hidden rounded-[24px] bg-slate-50 h-[180px] group border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.01)] transition-all hover:shadow-md cursor-pointer"
              >
                <img
                  src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80"
                  alt="Groceries"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/10 to-transparent z-0" />
                <div className="absolute bottom-6 left-6 z-10">
                  <span className="text-xl font-bold text-slate-800">
                    Groceries
                  </span>
                </div>
              </Link>

              {/* Fragrances */}
              <Link
                href="/products?category=fragrances"
                className="relative overflow-hidden rounded-[24px] bg-slate-50 h-[180px] group border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.01)] transition-all hover:shadow-md cursor-pointer"
              >
                <img
                  src="https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600&auto=format&fit=crop&q=80"
                  alt="Fragrances"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/10 to-transparent z-0" />
                <div className="absolute bottom-6 left-6 z-10">
                  <span className="text-xl font-bold text-slate-800">
                    Fragrances
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* AI Powered Features Section */}
      <section className="py-16 bg-[#f4f7fe]/40 border-t border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            AI-Powered Precision
          </h2>
          <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
            Experience shopping at the speed of thought with our suite of intelligent features.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
            {/* feature 1 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_4px_15px_rgba(0,0,0,0.01)] text-left flex flex-col h-full relative overflow-hidden">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-[#3b42c4] mb-4">
                <SparkleIcon className="w-5 h-5 fill-current" />
              </div>
              <h3 className="text-base font-bold text-slate-800 mb-2">Smart Recommendations</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Personalized picks based on your style, behavior, and preferences.
              </p>
              <div className="absolute bottom-0 inset-x-0 h-1 bg-[#3b42c4]" />
            </div>

            {/* feature 2 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_4px_15px_rgba(0,0,0,0.01)] text-left flex flex-col h-full relative overflow-hidden">
              <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 mb-4">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-800 mb-2">Review Summaries</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Instantly digest thousands of customer reviews into key pros and cons.
              </p>
              <div className="absolute bottom-0 inset-x-0 h-1 bg-purple-500" />
            </div>

            {/* feature 3 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_4px_15px_rgba(0,0,0,0.01)] text-left flex flex-col h-full relative overflow-hidden">
              <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600 mb-4">
                <ArrowRightLeft className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-800 mb-2">Price Comparisons</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Real-time tracking and comparison across 1,000+ top retailers.
              </p>
              <div className="absolute bottom-0 inset-x-0 h-1 bg-orange-500" />
            </div>

            {/* feature 4 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_4px_15px_rgba(0,0,0,0.01)] text-left flex flex-col h-full relative overflow-hidden">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 mb-4">
                <Bot className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-800 mb-2">Personal Assistant</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Chat 24/7 with your personal shopper to find anything you need.
              </p>
              <div className="absolute bottom-0 inset-x-0 h-1 bg-blue-500" />
            </div>
          </div>
        </div>
      </section>

      {/* Trending Now Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl font-black tracking-tight text-slate-900">
                Trending Now
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Real-time popular products tailored for you.
              </p>
            </div>
            
            {/* Slider arrows */}
            <div className="flex items-center gap-2">
              <button className="p-2 border border-slate-200 rounded-full hover:bg-slate-50 text-slate-400 hover:text-slate-700 cursor-pointer transition-colors">
                <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
              </button>
              <button className="p-2 border border-slate-200 rounded-full hover:bg-slate-50 text-slate-400 hover:text-slate-700 cursor-pointer transition-colors">
                <ChevronRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingProducts.map((p) => {
              const isFav = isFavorite(p.id);
              return (
                <div 
                  key={p.id}
                  className="bg-white border border-slate-200/60 rounded-[20px] p-4 flex flex-col relative group transition-all duration-300 hover:shadow-md"
                >
                  {/* Heart button */}
                  <button
                    onClick={(e) => handleFavoriteClick(p.id, e)}
                    className={`absolute top-6 right-6 p-2 rounded-xl border transition-all duration-200 cursor-pointer z-20 ${
                      isFav
                        ? 'bg-rose-50 border-rose-200 text-rose-500'
                        : 'bg-white/80 border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-white'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                  </button>

                  {/* Image container */}
                  <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-slate-50 mb-4 border border-slate-100">
                    <img
                      src={p.image}
                      alt={p.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  {/* Meta: Category & rating */}
                  <div className="flex items-center justify-between text-[11px] mb-2">
                    <span className="text-slate-400 font-bold uppercase tracking-wider">{p.category}</span>
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span className="font-extrabold">{p.rating.toFixed(1)}</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-sm font-bold text-slate-800 line-clamp-1 mb-3">
                    {p.title}
                  </h3>

                  {/* Price and Cart */}
                  <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-100">
                    <span className="text-base font-black text-slate-900">${p.price.toFixed(2)}</span>
                    
                    <button
                      onClick={handleAddToCart}
                      className="p-2.5 bg-[#3b42c4] hover:bg-[#2d33a6] text-white rounded-xl cursor-pointer shadow-sm transition-all duration-300 flex items-center justify-center"
                    >
                      <ShoppingCart className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Newsletter CTA Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-[#3b42c4] to-indigo-800 rounded-[32px] p-8 md:p-12 text-center text-white relative overflow-hidden shadow-lg shadow-indigo-600/10">
            {/* Background elements */}
            <div className="absolute -top-24 -left-24 w-80 h-80 bg-white/5 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-white/5 rounded-full blur-2xl pointer-events-none" />

            <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-2">
              Ready for Smarter Shopping?
            </h2>
            <p className="text-indigo-100 text-sm md:text-base max-w-xl mx-auto mb-8 font-medium">
              Join over 500,000 shoppers using CartIQ to find the best deals and the perfect products every single day.
            </p>

            {subscribed ? (
              <div className="bg-emerald-500/10 border border-emerald-500/25 rounded-2xl p-4 max-w-md mx-auto text-emerald-200 text-sm flex items-center justify-center gap-2 animate-fadeIn">
                <Check className="w-5 h-5 shrink-0" />
                <span className="font-bold">Thank you! You've joined CartIQ successfully.</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full bg-white/10 hover:bg-white/15 focus:bg-white/20 border border-white/20 focus:border-white/50 text-white placeholder-indigo-200/80 rounded-xl px-4 py-3 outline-none text-sm transition-all font-semibold"
                />
                <button
                  type="submit"
                  className="w-full sm:w-auto bg-white hover:bg-slate-50 text-[#3b42c4] font-black px-6 py-3 rounded-xl transition-all shadow-md text-sm shrink-0 cursor-pointer"
                >
                  Join Now
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Floating AI Assistant Robot Toggle Button */}
      <Link
        href="/chat"
        title="Open AI Chat Assistant"
        className="fixed bottom-6 right-6 z-40 bg-black text-white hover:bg-slate-900 p-4 rounded-full shadow-lg cursor-pointer hover:scale-105 transition-all flex items-center justify-center w-14 h-14"
      >
        <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          {/* Custom robot face SVG */}
          <rect x="3" y="11" width="18" height="10" rx="2" />
          <circle cx="12" cy="5" r="2" />
          <path d="M12 7v4" />
          <line x1="8" y1="16" x2="8" y2="16.01" />
          <line x1="16" y1="16" x2="16" y2="16.01" />
          <path d="M9 11v-2a3 3 0 0 1 6 0v2" />
        </svg>
      </Link>

      <Footer />
    </div>
  );
}
