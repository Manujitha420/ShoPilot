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
  Check,
  Clock,
  Flame
} from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();

  const [searchQuery, setSearchQuery] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  // Custom states for new interactive sections
  const [activeAiTab, setActiveAiTab] = useState<'recommended' | 'trending' | 'interests' | 'recent' | 'continue' | 'featured'>('recommended');
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [timeLeft, setTimeLeft] = useState({ hours: 10, minutes: 45, seconds: 0 });

  // Countdown timer effect
  React.useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          return { hours: 12, minutes: 0, seconds: 0 };
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Today's Deals (Flash Sale) data
  const todayDeals = [
    {
      id: 931,
      title: 'Aura Sound Max Wireless (Matte Black)',
      category: 'Electronics',
      originalPrice: 299.00,
      price: 179.00,
      discount: 40,
      rating: 4.9,
      claimed: 82,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 932,
      title: 'Zenith Watch Pro Series 5',
      category: 'Wearables',
      originalPrice: 349.00,
      price: 226.85,
      discount: 35,
      rating: 4.8,
      claimed: 64,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 933,
      title: 'Nova Mechanical Core Tactile Keyboard',
      category: 'Computing',
      originalPrice: 159.00,
      price: 111.30,
      discount: 30,
      rating: 4.7,
      claimed: 45,
      image: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=600&auto=format&fit=crop&q=80',
    }
  ];

  // AI Recommendation tabs data
  const aiRecommendedTabs = {
    recommended: [
      {
        id: 901,
        title: 'Aura Sound Max Wireless',
        price: 299.00,
        rating: 4.9,
        category: 'Electronics',
        matchScore: 98,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
      },
      {
        id: 902,
        title: 'Zenith Watch Pro',
        price: 349.00,
        rating: 4.8,
        category: 'Wearables',
        matchScore: 95,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
      },
      {
        id: 903,
        title: 'Nova Mechanical Core',
        price: 159.00,
        rating: 4.7,
        category: 'Computing',
        matchScore: 92,
        image: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=600&auto=format&fit=crop&q=80',
      }
    ],
    trending: [
      {
        id: 911,
        title: 'Ergonomic Mesh Task Chair',
        price: 249.00,
        rating: 4.6,
        category: 'Furniture',
        matchScore: 94,
        image: 'https://images.unsplash.com/photo-1580481072645-022f9a6dbf27?w=600&auto=format&fit=crop&q=80',
      },
      {
        id: 904,
        title: 'Lumina X-900 Mirrorless',
        price: 1299.00,
        rating: 5.0,
        category: 'Photography',
        matchScore: 97,
        image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&auto=format&fit=crop&q=80',
      },
      {
        id: 912,
        title: 'Sonic Glow Smart Toothbrush',
        price: 89.00,
        rating: 4.5,
        category: 'Electronics',
        matchScore: 91,
        image: 'https://images.unsplash.com/photo-1559592482-b288b5fc6d76?w=600&auto=format&fit=crop&q=80',
      }
    ],
    interests: [
      {
        id: 921,
        title: 'Hydration Therapy Essence',
        price: 39.00,
        rating: 4.7,
        category: 'Beauty',
        matchScore: 93,
        image: 'https://images.unsplash.com/photo-1608248597481-496100c80836?w=600&auto=format&fit=crop&q=80',
      },
      {
        id: 922,
        title: 'Royal Oud Intense Cologne',
        price: 145.00,
        rating: 4.8,
        category: 'Fragrances',
        matchScore: 96,
        image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600&auto=format&fit=crop&q=80',
      },
      {
        id: 923,
        title: 'Smart Ambient Desk Lamp',
        price: 79.00,
        rating: 4.6,
        category: 'Furniture',
        matchScore: 90,
        image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&auto=format&fit=crop&q=80',
      }
    ],
    recent: [
      {
        id: 901,
        title: 'Aura Sound Max Wireless',
        price: 299.00,
        rating: 4.9,
        category: 'Electronics',
        matchScore: 98,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
      },
      {
        id: 922,
        title: 'Royal Oud Intense Cologne',
        price: 145.00,
        rating: 4.8,
        category: 'Fragrances',
        matchScore: 96,
        image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600&auto=format&fit=crop&q=80',
      }
    ],
    continue: [
      {
        id: 902,
        title: 'Zenith Watch Pro',
        price: 349.00,
        rating: 4.8,
        category: 'Wearables',
        matchScore: 95,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
      },
      {
        id: 903,
        title: 'Nova Mechanical Core',
        price: 159.00,
        rating: 4.7,
        category: 'Computing',
        matchScore: 92,
        image: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=600&auto=format&fit=crop&q=80',
      }
    ],
    featured: [
      {
        id: 904,
        title: 'Lumina X-900 Mirrorless',
        price: 1299.00,
        rating: 5.0,
        category: 'Photography',
        matchScore: 97,
        image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&auto=format&fit=crop&q=80',
      },
      {
        id: 901,
        title: 'Aura Sound Max Wireless',
        price: 299.00,
        rating: 4.9,
        category: 'Electronics',
        matchScore: 98,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
      },
      {
        id: 903,
        title: 'Nova Mechanical Core',
        price: 159.00,
        rating: 4.7,
        category: 'Computing',
        matchScore: 92,
        image: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=600&auto=format&fit=crop&q=80',
      }
    ]
  };

  const testimonials = [
    {
      name: 'Sarah Connor',
      role: 'Verified Buyer',
      rating: 5,
      comment: "ShoPilot's AI comparison saved me over $200 on my new gaming laptop. It parsed all user reviews instantly, outlining precisely what I needed to watch out for!",
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
    },
    {
      name: 'David Miller',
      role: 'Tech Enthusiast',
      rating: 5,
      comment: "I love the chat interface! Being able to simply ask for a phone with a great camera under $600 and get live listings in seconds feels like magic.",
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
    },
    {
      name: 'Jessica Alwi',
      role: 'Design Lead',
      rating: 5,
      comment: "The UI is clean, extremely responsive, and the AI features are genuinely useful. I recommend ShoPilot to all my coworkers who shop online.",
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80'
    }
  ];

  const nextTestimonial = () => {
    setActiveTestimonial(prev => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveTestimonial(prev => (prev - 1 + testimonials.length) % testimonials.length);
  };

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
                className="group relative bg-[#3b42c4] text-white font-bold px-6 py-2.5 rounded-xl overflow-hidden cursor-pointer border border-[#3b42c4] shadow-sm text-sm shrink-0 transition-all duration-300"
              >
                {/* Slide background overlay from bottom to top */}
                <span className="absolute inset-x-0 bottom-0 h-0 bg-white transition-all duration-300 ease-out group-hover:h-full z-0" />
                <span className="relative z-10 transition-colors duration-600 group-hover:text-[#3b42c4]">
                  Search
                </span>
              </button>
            </div>
          </form>

          {/* Actions */}
          <div className="flex flex-wrap justify-center items-center gap-4 mt-8">
            <Link
              href="/products"
              className="group relative bg-[#3b42c4] text-white font-bold py-3 px-6 rounded-xl overflow-hidden cursor-pointer border border-[#3b42c4] shadow-sm text-sm transition-all duration-300"
            >
              {/* Slide background overlay from bottom to top */}
              <span className="absolute inset-x-0 bottom-0 h-0 bg-white transition-all duration-300 ease-out group-hover:h-full z-0" />
              <span className="relative z-10 transition-colors duration-600 group-hover:text-[#3b42c4]">
                Start Shopping
              </span>
            </Link>
            <Link
              href="/chat"
              className="group relative bg-white text-[#3b42c4] border border-slate-200 font-bold py-3 px-6 rounded-xl overflow-hidden cursor-pointer shadow-sm text-sm transition-all duration-300 flex items-center gap-2"
            >
              {/* Slide background overlay from bottom to top */}
              <span className="absolute inset-x-0 bottom-0 h-0 bg-slate-100 transition-all duration-300 ease-out group-hover:h-full z-0" />
              <span className="relative z-10 flex items-center gap-2 transition-colors duration-600">
                <Sparkles className="w-4 h-4" />
                <span>Try AI Assistant</span>
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Category Section */}
      <section id="categories" className="py-16 bg-white border-b border-slate-100">
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
                <div className="absolute inset-0 z-0">
                  <img
                    src="https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=80"
                    alt="Smartphones"
                    className="w-full h-full object-cover transition-all duration-700 ease-in-out group-hover:scale-105 group-hover:opacity-0"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80"
                    alt="Smartphones Hover"
                    className="absolute inset-0 w-full h-full object-cover opacity-0 transition-all duration-700 ease-in-out group-hover:scale-105 group-hover:opacity-100"
                  />
                </div>
                {/* Light overlay at the bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/20 to-transparent z-10" />
                <div className="absolute bottom-6 left-6 z-20 flex flex-col items-start gap-1">
                  <span className="bg-[#eef2ff] text-[#3b42c4] font-extrabold text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-md">
                    Tech Hub
                  </span>
                  <span className="text-xl font-bold text-slate-800">
                    Electronics
                  </span>
                </div>
              </Link>

              {/* Laptops (wide, top right card) */}
              <Link
                href="/products?category=laptops"
                className="md:col-span-2 relative overflow-hidden rounded-[24px] bg-slate-50 h-[220px] group border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.01)] transition-all hover:shadow-md cursor-pointer"
              >
                <div className="absolute inset-0 z-0">
                  <img
                    src="https://images.unsplash.com/photo-1496181130204-7552cc145cdb?w=600&auto=format&fit=crop&q=80"
                    alt="Laptops"
                    className="w-full h-full object-cover transition-all duration-700 ease-in-out group-hover:scale-105 group-hover:opacity-0"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=600&auto=format&fit=crop&q=80"
                    alt="Laptops Hover"
                    className="absolute inset-0 w-full h-full object-cover opacity-0 transition-all duration-700 ease-in-out group-hover:scale-105 group-hover:opacity-100"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/10 to-transparent z-10" />
                <div className="absolute bottom-6 left-6 z-20">
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
                <div className="absolute inset-0 z-0">
                  <img
                    src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&auto=format&fit=crop&q=80"
                    alt="Furniture"
                    className="w-full h-full object-cover transition-all duration-700 ease-in-out group-hover:scale-105 group-hover:opacity-0"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=600&auto=format&fit=crop&q=80"
                    alt="Furniture Hover"
                    className="absolute inset-0 w-full h-full object-cover opacity-0 transition-all duration-700 ease-in-out group-hover:scale-105 group-hover:opacity-100"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/10 to-transparent z-10" />
                <div className="absolute bottom-6 left-6 z-20">
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
                <div className="absolute inset-0 z-0">
                  <img
                    src="https://images.unsplash.com/photo-1608248597481-496100c80836?w=600&auto=format&fit=crop&q=80"
                    alt="Beauty"
                    className="w-full h-full object-cover transition-all duration-700 ease-in-out group-hover:scale-105 group-hover:opacity-0"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop&q=80"
                    alt="Beauty Hover"
                    className="absolute inset-0 w-full h-full object-cover opacity-0 transition-all duration-700 ease-in-out group-hover:scale-105 group-hover:opacity-100"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/10 to-transparent z-10" />
                <div className="absolute bottom-6 left-6 z-20">
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
                <div className="absolute inset-0 z-0">
                  <img
                    src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80"
                    alt="Groceries"
                    className="w-full h-full object-cover transition-all duration-700 ease-in-out group-hover:scale-105 group-hover:opacity-0"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=600&auto=format&fit=crop&q=80"
                    alt="Groceries Hover"
                    className="absolute inset-0 w-full h-full object-cover opacity-0 transition-all duration-700 ease-in-out group-hover:scale-105 group-hover:opacity-100"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/10 to-transparent z-10" />
                <div className="absolute bottom-6 left-6 z-20">
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
                <div className="absolute inset-0 z-0">
                  <img
                    src="https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600&auto=format&fit=crop&q=80"
                    alt="Fragrances"
                    className="w-full h-full object-cover transition-all duration-700 ease-in-out group-hover:scale-105 group-hover:opacity-0"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=600&auto=format&fit=crop&q=80"
                    alt="Fragrances Hover"
                    className="absolute inset-0 w-full h-full object-cover opacity-0 transition-all duration-700 ease-in-out group-hover:scale-105 group-hover:opacity-100"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/10 to-transparent z-10" />
                <div className="absolute bottom-6 left-6 z-20">
                  <span className="text-xl font-bold text-slate-800">
                    Fragrances
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Today's Deals (Flash Sale) Section */}
      <section className="py-16 bg-slate-50 border-t border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-600 font-extrabold text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-md mb-2">
                <Flame className="w-3.5 h-3.5 fill-current animate-pulse" />
                <span>Flash Sale</span>
              </span>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Today's Deals</h2>
              <p className="text-sm text-slate-500 mt-1">Limited-time offers curated with AI precision. Grab them before they're gone!</p>
            </div>

            {/* Countdown timer UI */}
            <div className="flex items-center gap-3 bg-white border border-slate-200 shadow-sm px-4 py-2.5 rounded-2xl shrink-0">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-rose-500" />
                <span>Ends In</span>
              </span>
              <div className="flex items-center gap-1 text-slate-900 font-black text-sm select-none">
                <span className="bg-slate-100 px-2.5 py-1 rounded-lg w-[38px] text-center">{String(timeLeft.hours).padStart(2, '0')}</span>
                <span>:</span>
                <span className="bg-slate-100 px-2.5 py-1 rounded-lg w-[38px] text-center">{String(timeLeft.minutes).padStart(2, '0')}</span>
                <span>:</span>
                <span className="bg-slate-100 px-2.5 py-1 rounded-lg w-[38px] text-center text-rose-600 animate-pulse">{String(timeLeft.seconds).padStart(2, '0')}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {todayDeals.map((deal) => {
              const isFav = isFavorite(deal.id);
              return (
                <div
                  key={deal.id}
                  className="bg-white border border-slate-200/60 rounded-3xl p-5 flex flex-col relative group transition-all duration-300 hover:shadow-md shadow-sm"
                >
                  {/* Discount percentage tag */}
                  <span className="absolute top-6 left-6 bg-rose-500 text-white font-extrabold text-[10px] tracking-wide uppercase px-2.5 py-1 rounded-lg z-20">
                    -{deal.discount}% Off
                  </span>

                  {/* Heart button */}
                  <button
                    onClick={(e) => handleFavoriteClick(deal.id, e)}
                    className={`absolute top-6 right-6 p-2.5 rounded-xl border transition-all duration-200 cursor-pointer z-20 ${
                      isFav
                        ? 'bg-rose-50 border-rose-200 text-rose-500'
                        : 'bg-white/80 border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-white'
                    }`}
                  >
                    <Heart className={`w-4.5 h-4.5 ${isFav ? 'fill-current' : ''}`} />
                  </button>

                  {/* Image container */}
                  <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-slate-50 mb-5 border border-slate-100 relative">
                    <img
                      src={deal.image}
                      alt={deal.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  {/* Meta: Category & rating */}
                  <div className="flex items-center justify-between text-[11px] mb-2 font-bold">
                    <span className="text-slate-400 uppercase tracking-wider">{deal.category}</span>
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{deal.rating.toFixed(1)}</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-sm font-bold text-slate-800 line-clamp-1 mb-2">
                    {deal.title}
                  </h3>

                  {/* Claimed progress bar */}
                  <div className="space-y-1.5 mb-4 mt-1">
                    <div className="flex justify-between text-[10px] font-bold text-slate-400">
                      <span>Limited Offers</span>
                      <span className="text-slate-600 font-extrabold">{deal.claimed}% claimed</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-rose-500 rounded-full transition-all duration-500"
                        style={{ width: `${deal.claimed}%` }}
                      />
                    </div>
                  </div>

                  {/* Price and Cart */}
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Flash Price</span>
                      <div className="flex items-baseline gap-1.5 mt-0.5">
                        <span className="text-lg font-black text-rose-600">${deal.price.toFixed(2)}</span>
                        <span className="text-slate-400 line-through text-xs font-semibold">${deal.originalPrice.toFixed(2)}</span>
                      </div>
                    </div>

                    <button
                      onClick={handleAddToCart}
                      className="p-3 bg-[#3b42c4] hover:bg-[#2d33a6] text-white rounded-2xl cursor-pointer shadow-sm transition-all duration-300 flex items-center justify-center"
                    >
                      <ShoppingCart className="w-4.5 h-4.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* AI Recommendation Section (AI Smart Picks) */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-8 gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 bg-indigo-50 border border-indigo-100 text-[#3b42c4] text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3">
                <Sparkles className="w-3.5 h-3.5 fill-current" />
                <span>Recommended For You</span>
              </span>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">AI Recommendation Dashboard</h2>
              <p className="text-sm text-slate-500 mt-1">Smart personalization matching your exact shopping style and interests.</p>
            </div>

            {/* Sub-tabs selection */}
            <div className="flex flex-wrap items-center gap-1.5 bg-slate-50 border border-slate-200/60 p-1.5 rounded-2xl overflow-x-auto scrollbar-none">
              {(['recommended', 'trending', 'interests', 'recent', 'continue', 'featured'] as const).map((tab) => {
                const labels: Record<string, string> = {
                  recommended: 'For You',
                  trending: 'Trending',
                  interests: 'Interests',
                  recent: 'Recent',
                  continue: 'Continue',
                  featured: 'Featured'
                };
                const active = activeAiTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveAiTab(tab)}
                    className={`px-4 py-2 text-xs font-bold transition-all duration-200 cursor-pointer whitespace-nowrap ${
                      active
                        ? 'bg-white border border-slate-200 shadow-sm text-[#3b42c4]'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {labels[tab]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {aiRecommendedTabs[activeAiTab].map((p) => {
              const isFav = isFavorite(p.id);
              return (
                <div
                  key={p.id}
                  className="bg-white border border-slate-200/60 rounded-3xl p-5 flex flex-col relative group transition-all duration-300 hover:shadow-md shadow-sm"
                >
                  {/* AI Match Score Badge */}
                  <span className="absolute top-6 left-6 bg-emerald-50 border border-emerald-100 text-emerald-600 font-extrabold text-[10px] tracking-wide uppercase px-2.5 py-1 rounded-xl z-20 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 fill-current text-emerald-500" />
                    <span>{p.matchScore}% Match</span>
                  </span>

                  {/* Heart button */}
                  <button
                    onClick={(e) => handleFavoriteClick(p.id, e)}
                    className={`absolute top-6 right-6 p-2.5 rounded-xl border transition-all duration-200 cursor-pointer z-20 ${
                      isFav
                        ? 'bg-rose-50 border-rose-200 text-rose-500'
                        : 'bg-white/80 border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-white'
                    }`}
                  >
                    <Heart className={`w-4.5 h-4.5 ${isFav ? 'fill-current' : ''}`} />
                  </button>

                  {/* Image container */}
                  <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-slate-50 mb-5 border border-slate-100 relative">
                    <img
                      src={p.image}
                      alt={p.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  {/* Meta: Category & rating */}
                  <div className="flex items-center justify-between text-[11px] mb-2 font-bold">
                    <span className="text-slate-400 uppercase tracking-wider">{p.category}</span>
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{p.rating.toFixed(1)}</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-sm font-bold text-slate-800 line-clamp-1 mb-4">
                    {p.title}
                  </h3>

                  {/* Price and Cart */}
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Price</span>
                      <span className="text-lg font-black text-slate-900 mt-0.5">${p.price.toFixed(2)}</span>
                    </div>

                    <button
                      onClick={handleAddToCart}
                      className="p-3 bg-[#3b42c4] hover:bg-[#2d33a6] text-white rounded-2xl cursor-pointer shadow-sm transition-all duration-300 flex items-center justify-center"
                    >
                      <ShoppingCart className="w-4.5 h-4.5" />
                    </button>
                  </div>
                </div>
              );
            })}
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

      {/* Customer Reviews Testimonials Carousel Section */}
      <section className="py-16 bg-[#f8fafc] border-t border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center gap-1.5 bg-indigo-50 border border-indigo-100 text-[#3b42c4] text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Customer Reviews</span>
          </span>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-8">What Our Shoppers Say</h2>

          {/* Testimonial card */}
          <div className="relative bg-white border border-slate-200/60 rounded-3xl p-8 md:p-12 shadow-sm transition-all duration-300">
            <div className="absolute top-6 left-6 text-slate-100 text-6xl font-serif select-none pointer-events-none">“</div>
            
            <div className="relative z-10 flex flex-col items-center">
              {/* Stars */}
              <div className="flex items-center gap-1 text-amber-500 mb-6">
                {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>

              {/* Comment text */}
              <p className="text-slate-600 text-base md:text-lg leading-relaxed font-medium italic mb-8 max-w-2xl">
                &ldquo;{testimonials[activeTestimonial].comment}&rdquo;
              </p>

              {/* User profile info */}
              <div className="flex items-center gap-3.5">
                <img
                  src={testimonials[activeTestimonial].avatar}
                  alt={testimonials[activeTestimonial].name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-slate-100 shadow-sm"
                />
                <div className="text-left">
                  <h4 className="text-sm font-bold text-slate-900">{testimonials[activeTestimonial].name}</h4>
                  <p className="text-xs text-slate-400 font-semibold">{testimonials[activeTestimonial].role}</p>
                </div>
              </div>
            </div>

            {/* Slider arrows */}
            <div className="absolute inset-y-0 -left-4 md:-left-6 flex items-center">
              <button
                onClick={prevTestimonial}
                className="p-3 bg-white border border-slate-200 rounded-full hover:bg-slate-50 text-slate-500 hover:text-slate-800 cursor-pointer transition-colors shadow-sm"
              >
                <ChevronLeft className="w-4.5 h-4.5 stroke-[2.5]" />
              </button>
            </div>
            <div className="absolute inset-y-0 -right-4 md:-right-6 flex items-center">
              <button
                onClick={nextTestimonial}
                className="p-3 bg-white border border-slate-200 rounded-full hover:bg-slate-50 text-slate-500 hover:text-slate-800 cursor-pointer transition-colors shadow-sm"
              >
                <ChevronRight className="w-4.5 h-4.5 stroke-[2.5]" />
              </button>
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveTestimonial(idx)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  activeTestimonial === idx ? 'w-6 bg-[#3b42c4]' : 'w-2.5 bg-slate-200'
                }`}
              />
            ))}
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
              Get AI shopping tips.
            </h2>
            <p className="text-indigo-100 text-sm md:text-base max-w-xl mx-auto mb-8 font-medium">
              Subscribe to get exclusive AI-curated deals, product comparison insights, and smart shopping recommendations sent directly to your inbox.
            </p>

            {subscribed ? (
              <div className="bg-emerald-500/10 border border-emerald-500/25 rounded-2xl p-4 max-w-md mx-auto text-emerald-200 text-sm flex items-center justify-center gap-2 animate-fadeIn">
                <Check className="w-5 h-5 shrink-0" />
                <span className="font-bold">Thank you! You've successfully subscribed to AI shopping tips.</span>
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
                  Subscribe
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
