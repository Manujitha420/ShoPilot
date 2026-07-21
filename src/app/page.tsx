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
  Flame,
  Eye,
  X
} from 'lucide-react';



// ─── Floating AI Chat Popup Component ───────────────────────────────────────
interface ChatMsg { id: string; role: 'user' | 'assistant'; content: string; products?: any[]; isError?: boolean; }

const POPUP_PRESETS = [
  'Recommend a laptop for programming',
  'Best smartphones under $1000',
  'Suggest gifts for a gamer',
];

function AIChatPopup() {
  const [chatOpen, setChatOpen] = React.useState(false);
  const [chatMessages, setChatMessages] = React.useState<ChatMsg[]>([
    { id: 'welcome', role: 'assistant', content: "👋 Hi! I'm your ShoPilot AI. Ask me to recommend products, compare prices, or find deals!" },
  ]);
  const [chatInput, setChatInput] = React.useState('');
  const [chatLoading, setChatLoading] = React.useState(false);
  const chatEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, chatLoading]);

  const sendChat = async (text: string) => {
    const msg = text.trim();
    if (!msg) return;
    setChatInput('');
    setChatLoading(true);
    setChatMessages(prev => [...prev, { id: Math.random().toString(), role: 'user', content: msg }]);
    try {
      const history = chatMessages
        .filter(m => m.id !== 'welcome' && !m.isError)
        .map(m => ({ role: m.role, content: m.content }));
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'chat', message: msg, history }),
      });
      const data = await res.json();
      if (data.success === false) throw new Error(data.error || 'Failed');
      setChatMessages(prev => [...prev, {
        id: Math.random().toString(), role: 'assistant',
        content: data.reply || "I couldn't process that.", products: data.products || [],
      }]);
    } catch (err: any) {
      setChatMessages(prev => [...prev, {
        id: Math.random().toString(), role: 'assistant',
        content: err.message || 'Something went wrong. Please try again.', isError: true,
      }]);
    } finally { setChatLoading(false); }
  };

  return (
    <>
      {/* Chat Panel */}
      <div
        className={`fixed bottom-24 right-24 z-50 w-[370px] max-w-[calc(100vw-6rem)] bg-white border border-slate-200 rounded-3xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 origin-bottom-right ${chatOpen ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-90 pointer-events-none'
          }`}
        style={{ height: 520 }}
      >
        {/* Header */}
        <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <p className="font-bold text-slate-800 text-sm leading-none">ShoPilot AI</p>
              <span className="flex items-center gap-1 text-[10px] text-emerald-600 mt-0.5 font-semibold">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                Online &middot; Llama 3.3 70B
              </span>
            </div>
          </div>
          <button id="chat-popup-close-btn" onClick={() => setChatOpen(false)}
            className="w-7 h-7 rounded-lg bg-slate-200 hover:bg-slate-300 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors cursor-pointer">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-none bg-slate-50/50">
          {chatMessages.map(msg => {
            const isUser = msg.role === 'user';
            return (
              <div key={msg.id} className={`flex items-end gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}>
                {!isUser && (
                  <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="10" rx="2" /><circle cx="12" cy="5" r="2" />
                      <path d="M12 7v4" /><line x1="8" y1="16" x2="8" y2="16.01" /><line x1="16" y1="16" x2="16" y2="16.01" />
                    </svg>
                  </div>
                )}
                <div className={`max-w-[80%] flex flex-col gap-2 ${isUser ? 'items-end' : 'items-start'}`}>
                  <div className={`px-4 py-2.5 rounded-2xl text-xs leading-relaxed border ${isUser ? 'bg-indigo-600 border-indigo-500 text-white rounded-br-sm shadow-sm'
                    : msg.isError ? 'bg-red-50 border-red-200 text-red-700 rounded-bl-sm'
                      : 'bg-white border-slate-200 text-slate-700 rounded-bl-sm shadow-sm'
                    }`}>{msg.content}</div>
                  {!isUser && msg.products && msg.products.length > 0 && (
                    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none w-full max-w-full">
                      {msg.products.slice(0, 4).map((p: any) => (
                        <a key={p.id} href={`/products/${p.id}`} className="shrink-0 w-28 bg-white border border-slate-200 rounded-xl p-2 hover:border-indigo-500/50 hover:shadow-sm transition-all group">
                          <img src={p.thumbnail} alt={p.title} className="w-full h-16 object-cover rounded-lg mb-1.5 group-hover:scale-105 transition-transform" />
                          <p className="text-[10px] font-bold text-slate-800 truncate">{p.title}</p>
                          <p className="text-[10px] font-black text-indigo-600 mt-0.5">${p.price?.toFixed(2)}</p>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
                {isUser && (
                  <div className="w-7 h-7 rounded-lg bg-slate-200 border border-slate-300 flex items-center justify-center text-slate-600 shrink-0">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" /></svg>
                  </div>
                )}
              </div>
            );
          })}
          {chatLoading && (
            <div className="flex items-end gap-2.5 justify-start">
              <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0 animate-pulse">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="10" rx="2" /><circle cx="12" cy="5" r="2" /><path d="M12 7v4" />
                </svg>
              </div>
              <div className="px-4 py-2.5 bg-white border border-slate-200 rounded-2xl rounded-bl-sm flex items-center gap-1 shadow-sm">
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Preset chips */}
        {chatMessages.length === 1 && (
          <div className="px-4 pb-3 flex flex-wrap gap-1.5 shrink-0 bg-slate-50/50">
            {POPUP_PRESETS.map((p, i) => (
              <button key={i} onClick={() => sendChat(p)}
                className="text-[10px] px-2.5 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-950 rounded-lg transition-all cursor-pointer font-semibold shadow-sm">
                {p}
              </button>
            ))}
          </div>
        )}

        {/* Input bar */}
        <form onSubmit={e => { e.preventDefault(); sendChat(chatInput); }}
          className="p-3 border-t border-slate-200 flex gap-2 items-center shrink-0 bg-white">
          <input type="text" value={chatInput} onChange={e => setChatInput(e.target.value)}
            disabled={chatLoading} placeholder="Ask me anything about products..."
            className="flex-1 bg-slate-50 border border-slate-200 focus:border-indigo-500 text-slate-800 rounded-xl px-4 py-2.5 outline-none text-xs disabled:opacity-50 placeholder-slate-400 transition-all focus:bg-white"
          />
          <button type="submit" disabled={chatLoading || !chatInput.trim()}
            className="p-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-100 text-white disabled:text-slate-400 rounded-xl transition-all cursor-pointer disabled:cursor-not-allowed shrink-0 shadow-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M22 2 11 13" /><path d="M22 2 15 22 11 13 2 9l20-7z" /></svg>
          </button>
        </form>
      </div>

      {/* FAB toggle */}
      <button id="chat-popup-toggle-btn" onClick={() => setChatOpen(o => !o)}
        title="Open AI Chat Assistant"
        className={`fixed bottom-6 right-6 z-50 text-white rounded-full shadow-xl cursor-pointer hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center w-14 h-14 group ${chatOpen ? 'bg-slate-700 hover:bg-slate-600 rotate-180' : 'bg-black hover:bg-slate-900'
          }`}
      >
        {/* Pulsing ambient glow behind button */}
        {!chatOpen && (
          <span className="absolute -inset-1 bg-black/10 rounded-full animate-ping -z-10 group-hover:bg-[#3b42c4]/20 transition-all duration-300" />
        )}

        {chatOpen ? (
          <svg className="w-6 h-6 transition-transform duration-300 group-hover:scale-90" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12" /></svg>
        ) : (
          <svg className="w-7 h-7 transition-all duration-300 group-hover:rotate-12 group-hover:scale-105" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="10" rx="2" /><circle cx="12" cy="5" r="2" />
            <path d="M12 7v4" /><line x1="8" y1="16" x2="8" y2="16.01" /><line x1="16" y1="16" x2="16" y2="16.01" />
            <path d="M9 11v-2a3 3 0 0 1 6 0v2" />
          </svg>
        )}
      </button>
    </>
  );
}
// ─────────────────────────────────────────────────────────────────────────────

const categories = [
  {
    href: '/products?category=smartphones',
    label: 'Electronics',
    badge: 'Tech Hub',
    img: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=80',
    imgHover: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80',
    span: 'md:row-span-2 md:col-span-1 min-h-[360px]',
    height: 'h-[320px] md:h-full',
  },
  {
    href: '/products?category=laptops',
    label: 'Laptops',
    badge: null,
    img: 'https://images.unsplash.com/photo-1496181130204-7552cc145cdb?w=600&auto=format&fit=crop&q=80',
    imgHover: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=600&auto=format&fit=crop&q=80',
    span: 'md:col-span-2',
    height: 'h-[220px]',
  },
  {
    href: '/products?category=furniture',
    label: 'Furniture',
    badge: null,
    img: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&auto=format&fit=crop&q=80',
    imgHover: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=600&auto=format&fit=crop&q=80',
    span: '',
    height: 'h-[220px]',
  },
  {
    href: '/products?category=beauty',
    label: 'Beauty',
    badge: null,
    img: 'https://images.unsplash.com/photo-1608248597481-496100c80836?w=600&auto=format&fit=crop&q=80',
    imgHover: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop&q=80',
    span: '',
    height: 'h-[220px]',
  },
];

const bottomCategories = [
  {
    href: '/products?category=groceries',
    label: 'Groceries',
    img: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80',
    imgHover: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=600&auto=format&fit=crop&q=80',
  },
  {
    href: '/products?category=fragrances',
    label: 'Fragrances',
    img: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600&auto=format&fit=crop&q=80',
    imgHover: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=600&auto=format&fit=crop&q=80',
  },
];

function CategoryGrid() {
  const cardRefs = React.useRef<(HTMLAnchorElement | null)[]>([]);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    cardRefs.current.forEach((el) => { if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="space-y-6">
      {/* Top Grid Area */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map((cat, i) => (
          <a
            key={cat.label}
            href={cat.href}
            ref={(el) => { cardRefs.current[i] = el; }}
            className={`cat-card group relative overflow-hidden rounded-[24px] bg-slate-50 ${cat.height} ${cat.span} border border-slate-100 cursor-pointer`}
            style={{ '--delay': `${i * 90}ms` } as React.CSSProperties}
          >
            {/* Images */}
            <div className="absolute inset-0 z-0">
              <img src={cat.img} alt={cat.label} className="w-full h-full object-cover transition-all duration-700 ease-in-out group-hover:scale-110 group-hover:opacity-0" />
              <img src={cat.imgHover} alt={`${cat.label} alt`} className="absolute inset-0 w-full h-full object-cover opacity-0 scale-105 transition-all duration-700 ease-in-out group-hover:scale-110 group-hover:opacity-100" />
            </div>
            {/* Indigo overlay sweep from bottom */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#3b42c4]/80 via-[#3b42c4]/20 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            {/* Default white gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-white/85 via-white/15 to-transparent z-10 group-hover:opacity-0 transition-opacity duration-500" />
            {/* Shadow lift */}
            <div className="absolute inset-0 rounded-[24px] shadow-[0_2px_12px_rgba(0,0,0,0.04)] group-hover:shadow-[0_16px_48px_rgba(59,66,196,0.22)] transition-shadow duration-500 z-0 pointer-events-none" />
            {/* Label area */}
            <div className="absolute bottom-6 left-6 z-20 flex flex-col items-start gap-1">
              {cat.badge && (
                <span className="bg-[#eef2ff] text-[#3b42c4] group-hover:bg-white/20 group-hover:text-white font-extrabold text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-md transition-colors duration-400">
                  {cat.badge}
                </span>
              )}
              <span className="text-xl font-bold text-slate-800 group-hover:text-white transition-colors duration-400">
                {cat.label}
              </span>
            </div>
            {/* Browse badge — appears on hover */}
            <div className="absolute bottom-6 right-6 z-20 flex items-center gap-1.5 bg-white/90 text-[#3b42c4] text-xs font-bold px-3 py-1.5 rounded-full opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400 shadow-sm">
              Browse <span>→</span>
            </div>
          </a>
        ))}
      </div>

      {/* Bottom Grid Area */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {bottomCategories.map((cat, i) => (
          <a
            key={cat.label}
            href={cat.href}
            ref={(el) => { cardRefs.current[categories.length + i] = el; }}
            className="cat-card group relative overflow-hidden rounded-[24px] bg-slate-50 h-[180px] border border-slate-100 cursor-pointer"
            style={{ '--delay': `${(categories.length + i) * 90}ms` } as React.CSSProperties}
          >
            <div className="absolute inset-0 z-0">
              <img src={cat.img} alt={cat.label} className="w-full h-full object-cover transition-all duration-700 ease-in-out group-hover:scale-110 group-hover:opacity-0" />
              <img src={cat.imgHover} alt={`${cat.label} alt`} className="absolute inset-0 w-full h-full object-cover opacity-0 scale-105 transition-all duration-700 ease-in-out group-hover:scale-110 group-hover:opacity-100" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#3b42c4]/80 via-[#3b42c4]/20 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-white/85 via-white/15 to-transparent z-10 group-hover:opacity-0 transition-opacity duration-500" />
            <div className="absolute inset-0 rounded-[24px] shadow-[0_2px_12px_rgba(0,0,0,0.04)] group-hover:shadow-[0_16px_48px_rgba(59,66,196,0.22)] transition-shadow duration-500 z-0 pointer-events-none" />
            <div className="absolute bottom-6 left-6 z-20">
              <span className="text-xl font-bold text-slate-800 group-hover:text-white transition-colors duration-400">
                {cat.label}
              </span>
            </div>
            <div className="absolute bottom-6 right-6 z-20 flex items-center gap-1.5 bg-white/90 text-[#3b42c4] text-xs font-bold px-3 py-1.5 rounded-full opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400 shadow-sm">
              Browse <span>→</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

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
  const [quickViewProduct, setQuickViewProduct] = useState<any | null>(null);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [testimonialVisible, setTestimonialVisible] = useState(true);
  const [displayedTestimonial, setDisplayedTestimonial] = useState(0);
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

  // Hero parallax — only activates once user scrolls PAST the hero section
  const heroRef = React.useRef<HTMLElement>(null);
  const [heroParallax, setHeroParallax] = React.useState(0);
  React.useEffect(() => {
    const handleScroll = () => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      // rect.top goes negative once the section scrolls off the top edge
      const scrolledPast = Math.max(0, -rect.top);
      setHeroParallax(scrolledPast);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
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
    },
    {
      name: 'Marcus Reid',
      role: 'Frequent Shopper',
      rating: 4,
      comment: "ShoPilot genuinely cut my research time in half. The AI picks up on subtle preferences I didn't even realise I had. Would love to see even more retailer integrations down the road.",
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80'
    },
    {
      name: 'Priya Nair',
      role: 'Lifestyle Blogger',
      rating: 4,
      comment: "I was sceptical at first, but the personalised recommendations are genuinely spot-on. Found my perfect skincare set in under two minutes. A few more filter options would make this perfect!",
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    }
  ];

  const goToTestimonial = (idx: number) => {
    if (idx === displayedTestimonial) return;
    setTestimonialVisible(false);
    setTimeout(() => {
      setDisplayedTestimonial(idx);
      setActiveTestimonial(idx);
      setTestimonialVisible(true);
    }, 300);
  };

  const nextTestimonial = () => {
    goToTestimonial((displayedTestimonial + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    goToTestimonial((displayedTestimonial - 1 + testimonials.length) % testimonials.length);
  };

  // Autoplay testimonials every 4 seconds
  React.useEffect(() => {
    const timer = setInterval(() => {
      goToTestimonial((displayedTestimonial + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayedTestimonial]);

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
      <section ref={heroRef} className="relative py-16 md:py-24 bg-white text-center">
        <style>{`
          @keyframes float-a {
            0%, 100% { transform: translateY(0px) rotate(-3deg); }
            50%       { transform: translateY(-14px) rotate(-1.5deg); }
          }
          @keyframes float-b {
            0%, 100% { transform: translateY(0px) rotate(2deg); }
            50%       { transform: translateY(-10px) rotate(3.5deg); }
          }
          @keyframes float-c {
            0%, 100% { transform: translateY(0px) rotate(-2deg); }
            50%       { transform: translateY(-16px) rotate(-0.5deg); }
          }
          @keyframes float-d {
            0%, 100% { transform: translateY(0px) rotate(4deg); }
            50%       { transform: translateY(-12px) rotate(2.5deg); }
          }
          @keyframes float-e {
            0%, 100% { transform: translateY(0px) rotate(-1deg); }
            50%       { transform: translateY(-18px) rotate(1deg); }
          }
          @keyframes float-f {
            0%, 100% { transform: translateY(0px) rotate(3.5deg); }
            50%       { transform: translateY(-10px) rotate(5deg); }
          }
          @keyframes float-chip {
            0%, 100% { transform: translateY(0px); }
            50%       { transform: translateY(-8px); }
          }
          .flt-a { animation: float-a 6s ease-in-out infinite; }
          .flt-b { animation: float-b 7.5s ease-in-out infinite; }
          .flt-c { animation: float-c 5.5s ease-in-out infinite; }
          .flt-d { animation: float-d 8s ease-in-out infinite; }
          .flt-e { animation: float-e 6.5s ease-in-out infinite; }
          .flt-f { animation: float-f 9s ease-in-out infinite; }
          .flt-chip { animation: float-chip 4s ease-in-out infinite; }
          .flt-chip2 { animation: float-chip 5s ease-in-out infinite 0.8s; }
          .flt-chip3 { animation: float-chip 6s ease-in-out infinite 0.3s; }
          @keyframes float-g {
            0%, 100% { transform: translateY(0px) rotate(1.5deg); }
            50%       { transform: translateY(-13px) rotate(-1deg); }
          }
          @keyframes float-h {
            0%, 100% { transform: translateY(0px) rotate(-2.5deg); }
            50%       { transform: translateY(-9px) rotate(0.5deg); }
          }
          .flt-g { animation: float-g 7s ease-in-out infinite 1.2s; }
          .flt-h { animation: float-h 5.8s ease-in-out infinite 0.5s; }
          .flt-chip4 { animation: float-chip 4.5s ease-in-out infinite 1.5s; }
          .flt-chip5 { animation: float-chip 5.5s ease-in-out infinite 0.2s; }
          .flt-chip6 { animation: float-chip 6.5s ease-in-out infinite 2s; }
        `}</style>

        {/* Background layer — overflow-hidden so dots/blobs stay inside section */}
        <div className="absolute inset-0 overflow-hidden -z-10 pointer-events-none">
          {/* Dot-grid background pattern */}
          <div
            className="absolute inset-0 opacity-[0.35]"
            style={{ backgroundImage: 'radial-gradient(circle, #c7d2fe 1px, transparent 1px)', backgroundSize: '28px 28px' }}
          />
          {/* Soft background glow blobs */}
          <div className="absolute top-0 left-1/4 w-[480px] h-[480px] bg-indigo-100/50 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-[360px] h-[360px] bg-rose-100/40 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] bg-purple-100/30 rounded-full blur-3xl" />
        </div>


        {/* ── FLOATING PROMO CARDS — parallax wrapper ────────── */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            transform: `translateY(-${heroParallax * 0.35}px)`,
            willChange: 'transform',
            transition: 'transform 0.1s linear',
            pointerEvents: 'none',
          }}
        >

          {/* Flash Sale — far left, vertically high */}
          <div style={{ top: '6%', left: '1%' }} className="hidden lg:block absolute w-64 bg-gradient-to-br from-rose-50 to-amber-50 border border-rose-200/60 p-5 rounded-2xl z-10 shadow-md text-left flt-a">
            <div className="flex items-center gap-2 mb-2.5">
              <span className="text-lg">🔥</span>
              <span className="bg-rose-500 text-white font-extrabold text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-md">Flash Sale</span>
            </div>
            <h4 className="text-sm font-black text-slate-800 mb-1">Today Only</h4>
            <p className="text-xs text-slate-500 font-semibold leading-snug">Up to <span className="text-rose-500 font-black">60% Off</span> smartphones &amp; wearables!</p>
            <div className="mt-3 flex items-center gap-2">
              <span className="text-xs line-through text-slate-400 font-semibold">$299</span>
              <span className="text-base font-black text-rose-500">$119</span>
            </div>
          </div>

          {/* AI Smart Picks — slightly inset left, lower-middle */}
          <div style={{ top: '52%', left: '3%' }} className="hidden lg:block absolute w-64 bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200/60 p-5 rounded-2xl z-10 shadow-md text-left flt-c">
            <span className="inline-block bg-[#3b42c4] text-white font-extrabold text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-md mb-2.5">Summer Deal</span>
            <h4 className="text-sm font-black text-slate-800 mb-1">AI Smart Picks</h4>
            <p className="text-xs text-slate-500 font-semibold leading-snug">Up to <span className="text-[#3b42c4] font-black">40% Off</span> curated tech &amp; accessories.</p>
            <div className="mt-3 flex items-center gap-2">
              <div className="flex -space-x-2">
                {['https://i.pravatar.cc/32?img=1', 'https://i.pravatar.cc/32?img=2', 'https://i.pravatar.cc/32?img=3'].map((src, i) => (
                  <img key={i} src={src} className="w-6 h-6 rounded-full border-2 border-white object-cover" alt="" />
                ))}
              </div>
              <span className="text-[11px] text-slate-400 font-bold">+2.4k shopping</span>
            </div>
          </div>

          {/* Free Shipping — bottom-left, pushed in a bit */}
          <div style={{ bottom: '4%', left: '7%' }} className="hidden lg:block absolute w-64 bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200/60 p-5 rounded-2xl z-10 shadow-md text-left flt-e">
            <div className="flex items-center gap-2 mb-2.5">
              <span className="text-lg">📦</span>
              <span className="bg-emerald-500 text-white font-extrabold text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-md">Free Ship</span>
            </div>
            <h4 className="text-sm font-black text-slate-800 mb-1">Express Delivery</h4>
            <p className="text-xs text-slate-500 font-semibold leading-snug">Free express shipping on orders over <span className="text-emerald-600 font-black">$100</span> — no code needed.</p>
          </div>

          {/* New Arrival — right side, sits near top-right corner */}
          <div style={{ top: '3%', right: '2%' }} className="hidden lg:block absolute w-64 bg-gradient-to-bl from-purple-50 to-indigo-50 border border-purple-200/60 p-5 rounded-2xl z-10 shadow-md text-left flt-b">
            <div className="flex items-center gap-2 mb-2.5">
              <span className="text-lg">✨</span>
              <span className="bg-purple-500 text-white font-extrabold text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-md">New Arrival</span>
            </div>
            <h4 className="text-sm font-black text-slate-800 mb-1">Just Dropped</h4>
            <p className="text-xs text-slate-500 font-semibold leading-snug">Freshest picks added this week — AI-curated and ready to ship.</p>
            <div className="mt-3 w-full bg-purple-100 rounded-full h-2 overflow-hidden">
              <div className="bg-purple-500 h-full w-4/5 rounded-full" />
            </div>
            <p className="text-[11px] text-purple-500 font-black mt-1">80% claimed</p>
          </div>

          {/* Precision Match — right, lower-mid, offset inward */}
          <div style={{ top: '44%', right: '1%' }} className="hidden lg:block absolute w-64 bg-gradient-to-bl from-rose-50 to-orange-50 border border-rose-200/60 p-5 rounded-2xl z-10 shadow-md text-left flt-d">
            <span className="inline-block bg-rose-500 text-white font-extrabold text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-md mb-2.5">AI Match</span>
            <h4 className="text-sm font-black text-slate-800 mb-1">Precision Match</h4>
            <p className="text-xs text-slate-500 font-semibold leading-snug">Chat with AI to unlock personalised discount codes instantly.</p>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400">Match score</span>
              <span className="text-base font-black text-rose-500">96%</span>
            </div>
            <div className="w-full bg-rose-100 rounded-full h-2 mt-1 overflow-hidden">
              <div className="bg-rose-500 h-full rounded-full" style={{ width: '96%' }} />
            </div>
          </div>

          {/* Top Rated — bottom-right, with a slight inward push */}
          <div style={{ bottom: '5%', right: '4%' }} className="hidden lg:block absolute w-64 bg-gradient-to-bl from-amber-50 to-yellow-50 border border-amber-200/60 p-5 rounded-2xl z-10 shadow-md text-left flt-f">
            <div className="flex items-center gap-2 mb-2.5">
              <span className="text-lg">⭐</span>
              <span className="bg-amber-500 text-white font-extrabold text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-md">Top Rated</span>
            </div>
            <h4 className="text-sm font-black text-slate-800 mb-1">Loved by Shoppers</h4>
            <p className="text-xs text-slate-500 font-semibold leading-snug">4.9 ★ average — join <span className="text-amber-600 font-black">500K+</span> happy AI shoppers worldwide.</p>
          </div>

          {/* ── FLOATING STAT CHIPS (scattered) ─────────────────── */}
          <div style={{ top: '28%', left: '9%' }} className="hidden lg:flex absolute items-center gap-1.5 bg-white border border-slate-200 shadow-md px-3 py-1.5 rounded-full z-10 flt-chip pointer-events-none">
            <span className="text-[10px]">🛒</span>
            <span className="text-[10px] font-black text-slate-700">1,248 sold today</span>
          </div>
          <div style={{ top: '18%', right: '9%' }} className="hidden lg:flex absolute items-center gap-1.5 bg-white border border-slate-200 shadow-md px-3 py-1.5 rounded-full z-10 flt-chip2 pointer-events-none">
            <span className="text-[10px]">🤖</span>
            <span className="text-[10px] font-black text-slate-700">AI found 3 better deals</span>
          </div>
          <div style={{ bottom: '25%', right: '10%' }} className="hidden lg:flex absolute items-center gap-1.5 bg-white border border-slate-200 shadow-md px-3 py-1.5 rounded-full z-10 flt-chip3 pointer-events-none">
            <span className="text-[10px]">⚡</span>
            <span className="text-[10px] font-black text-slate-700">Code AISHOP20 active</span>
          </div>

          {/* ── MIDDLE ZONE CARDS ─────────────────────────────── */}

          {/* Trending Deal — upper-left middle */}
          <div style={{ top: '5%', left: '22%' }} className="hidden lg:block absolute w-60 bg-gradient-to-br from-sky-50 to-blue-50 border border-sky-200/60 p-5 rounded-2xl z-10 shadow-md text-left flt-g">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">📈</span>
              <span className="bg-sky-500 text-white font-extrabold text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-md">Trending</span>
            </div>
            <h4 className="text-sm font-black text-slate-800 mb-1">Hot Right Now</h4>
            <p className="text-xs text-slate-500 font-semibold leading-snug">2,310 people viewing this deal right now.</p>
            <div className="mt-2.5 flex items-center gap-1">
              {'★★★★★'.split('').map((s, i) => <span key={i} className="text-amber-400 text-xs">{s}</span>)}
              <span className="text-[11px] text-slate-400 ml-0.5 font-bold">4.9</span>
            </div>
          </div>

          {/* AI Cashback — upper-right middle */}
          <div style={{ top: '7%', right: '22%' }} className="hidden lg:block absolute w-60 bg-gradient-to-bl from-violet-50 to-fuchsia-50 border border-violet-200/60 p-5 rounded-2xl z-10 shadow-md text-left flt-h">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">💸</span>
              <span className="bg-violet-500 text-white font-extrabold text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-md">Cashback</span>
            </div>
            <h4 className="text-sm font-black text-slate-800 mb-1">Earn While You Shop</h4>
            <p className="text-xs text-slate-500 font-semibold leading-snug">Get up to <span className="text-violet-600 font-black">12% cashback</span> on every AI-matched purchase.</p>
          </div>

          {/* Price Drop — lower-left middle */}
          <div style={{ bottom: '7%', left: '20%' }} className="hidden lg:block absolute w-56 bg-gradient-to-br from-lime-50 to-green-50 border border-lime-200/60 p-5 rounded-2xl z-10 shadow-md text-left flt-c">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">🏷️</span>
              <span className="bg-lime-500 text-white font-extrabold text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-md">Price Drop</span>
            </div>
            <h4 className="text-sm font-black text-slate-800 mb-1">Just Dropped</h4>
            <p className="text-xs text-slate-500 font-semibold leading-snug">Price fell <span className="text-lime-600 font-black">$34</span> in the last hour.</p>
          </div>

          {/* Loyalty Points — lower-right middle */}
          <div style={{ bottom: '6%', right: '21%' }} className="hidden lg:block absolute w-60 bg-gradient-to-bl from-pink-50 to-rose-50 border border-pink-200/60 p-5 rounded-2xl z-10 shadow-md text-left flt-e">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">🎁</span>
              <span className="bg-pink-500 text-white font-extrabold text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-md">Rewards</span>
            </div>
            <h4 className="text-sm font-black text-slate-800 mb-1">Loyalty Points</h4>
            <p className="text-xs text-slate-500 font-semibold leading-snug">Earn <span className="text-pink-600 font-black">3×</span> points on AI-curated picks this weekend.</p>
          </div>

          {/* ── MIDDLE ZONE CHIPS ─────────────────────────────── */}
          <div style={{ top: '38%', left: '18%' }} className="hidden lg:flex absolute items-center gap-1.5 bg-white border border-slate-200 shadow-md px-3 py-1.5 rounded-full z-10 flt-chip4 pointer-events-none">
            <span className="text-[10px]">🔔</span>
            <span className="text-[10px] font-black text-slate-700">Price alert set</span>
          </div>
          <div style={{ top: '62%', left: '22%' }} className="hidden lg:flex absolute items-center gap-1.5 bg-white border border-slate-200 shadow-md px-3 py-1.5 rounded-full z-10 flt-chip5 pointer-events-none">
            <span className="text-[10px]">💚</span>
            <span className="text-[10px] font-black text-slate-700">Eco-friendly pick</span>
          </div>
          <div style={{ top: '55%', right: '19%' }} className="hidden lg:flex absolute items-center gap-1.5 bg-white border border-slate-200 shadow-md px-3 py-1.5 rounded-full z-10 flt-chip6 pointer-events-none">
            <span className="text-[10px]">🚀</span>
            <span className="text-[10px] font-black text-slate-700">Ships in 2 hrs</span>
          </div>

        </div>{/* end parallax wrapper */}

        <div className="relative z-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
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
        <style>{`
          @keyframes cat-fade-up {
            from { opacity: 0; transform: translateY(28px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          .cat-card {
            opacity: 0;
          }
          .cat-card.in-view {
            animation: cat-fade-up 0.55s cubic-bezier(0.22, 1, 0.36, 1) var(--delay, 0ms) both;
          }
        `}</style>
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
          <CategoryGrid />
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
                  onClick={() => router.push(`/products/${deal.id}`)}
                  className="bg-white border border-slate-200/60 rounded-3xl p-5 flex flex-col relative group transition-all duration-300 hover:shadow-md shadow-sm cursor-pointer hover:-translate-y-0.5"
                >
                  {/* Discount percentage tag */}
                  <span className="absolute top-6 left-6 bg-rose-500 text-white font-extrabold text-[10px] tracking-wide uppercase px-2.5 py-1 rounded-lg z-20">
                    -{deal.discount}% Off
                  </span>

                  {/* Quick Action Overlays */}
                  <div className="absolute top-6 right-6 flex items-center gap-1.5 z-20">
                    {/* Quick View Button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setQuickViewProduct({
                          id: deal.id,
                          title: deal.title,
                          category: deal.category,
                          price: deal.price,
                          rating: deal.rating,
                          thumbnail: deal.image,
                          description: 'AI Precision-matched Daily Deal. Limited quantity available at this exclusive discount.'
                        });
                      }}
                      title="Quick Lookup"
                      className="p-2.5 rounded-xl border bg-white/80 border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-white cursor-pointer transition-all"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    {/* Heart button */}
                    <button
                      onClick={(e) => handleFavoriteClick(deal.id, e)}
                      className={`p-2.5 rounded-xl border transition-all duration-200 cursor-pointer ${isFav
                        ? 'bg-rose-50 border-rose-200 text-rose-500'
                        : 'bg-white/80 border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-white'
                        }`}
                    >
                      <Heart className={`w-4.5 h-4.5 ${isFav ? 'fill-current' : ''}`} />
                    </button>
                  </div>

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
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleAddToCart();
                      }}

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
                    className={`px-4 py-2 text-xs font-bold transition-all duration-200 cursor-pointer whitespace-nowrap ${active
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
                  onClick={() => router.push(`/products/${p.id}`)}
                  className="bg-white border border-slate-200/60 rounded-3xl p-5 flex flex-col relative group transition-all duration-300 hover:shadow-md shadow-sm cursor-pointer hover:-translate-y-0.5"
                >
                  {/* AI Match Score Badge */}
                  <span className="absolute top-6 left-6 bg-emerald-50 border border-emerald-100 text-emerald-600 font-extrabold text-[10px] tracking-wide uppercase px-2.5 py-1 rounded-xl z-20 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 fill-current text-emerald-500" />
                    <span>{p.matchScore}% Match</span>
                  </span>

                  {/* Quick Action Overlays */}
                  <div className="absolute top-6 right-6 flex items-center gap-1.5 z-20">
                    {/* Quick View Button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setQuickViewProduct({
                          id: p.id,
                          title: p.title,
                          category: p.category,
                          price: p.price,
                          rating: p.rating,
                          thumbnail: p.image,
                          description: `AI-Recommended matching catalog product. Matches ${p.matchScore}% with your browsing history and shopping style.`
                        });
                      }}
                      title="Quick Lookup"
                      className="p-2.5 rounded-xl border bg-white/80 border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-white cursor-pointer transition-all"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    {/* Heart button */}
                    <button
                      onClick={(e) => handleFavoriteClick(p.id, e)}
                      className={`p-2.5 rounded-xl border transition-all duration-200 cursor-pointer ${isFav
                        ? 'bg-rose-50 border-rose-200 text-rose-500'
                        : 'bg-white/80 border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-white'
                        }`}
                    >
                      <Heart className={`w-4.5 h-4.5 ${isFav ? 'fill-current' : ''}`} />
                    </button>
                  </div>

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
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleAddToCart();
                      }}

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
      <section className="relative overflow-hidden min-h-[600px] flex items-center justify-center bg-slate-950 border-t border-b border-slate-900 py-20">
        
        {/* Background Image Collage Grid */}
        <div className="absolute inset-0 grid grid-cols-2 sm:grid-cols-4 gap-2 opacity-25 select-none pointer-events-none">
          <div className="relative h-full w-full">
            <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop" alt="Lifestyle 1" className="absolute inset-0 w-full h-full object-cover" />
          </div>
          <div className="relative h-full w-full">
            <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=600&auto=format&fit=crop" alt="Lifestyle 2" className="absolute inset-0 w-full h-full object-cover" />
          </div>
          <div className="relative h-full w-full">
            <img src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=600&auto=format&fit=crop" alt="Lifestyle 3" className="absolute inset-0 w-full h-full object-cover" />
          </div>
          <div className="relative h-full w-full">
            <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=600&auto=format&fit=crop" alt="Lifestyle 4" className="absolute inset-0 w-full h-full object-cover" />
          </div>
        </div>

        {/* Semi-transparent dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/50 to-slate-950/80 backdrop-blur-[2px]" />

        {/* Vertical Stack Content */}
        <div className="relative z-10 max-w-5xl w-full mx-auto px-6 sm:px-10 lg:px-16 text-center">
          <span className="inline-flex items-center gap-1.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-6">
            <SparkleIcon className="w-3.5 h-3.5 fill-current" />
            <span>AI-Powered Precision</span>
          </span>

          <div className="flex flex-col gap-4 mt-2">
            {[
              { title: 'Smart Recommendations', desc: 'Personalized picks based on your style, behavior, and preferences.' },
              { title: 'Review Summaries', desc: 'Instantly digest thousands of customer reviews into key pros and cons.' },
              { title: 'Price Comparisons', desc: 'Real-time tracking and comparison across 1,000+ top retailers.' },
              { title: 'Personal Assistant', desc: 'Chat 24/7 with your personal shopper to find anything you need.' }
            ].map((item, idx) => (
              <div key={idx} className="group relative py-6 cursor-pointer border-b border-white/10 last:border-b-0 hover:border-indigo-500/50 transition-all duration-300">
                <div className="flex flex-col items-start w-full">
                  {/* Vertical Point Title - one line (whitespace-nowrap), italic on hover */}
                  <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-wider text-white transition-all duration-550 group-hover:text-indigo-400 group-hover:italic whitespace-nowrap">
                    {item.title}
                  </h3>
                  
                  {/* Description - only visible on hover, placed under the heading but aligned to the right side */}
                  <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-all duration-500 ease-in-out w-full">
                    <div className="overflow-hidden">
                      <p className="text-xs sm:text-sm text-indigo-200 leading-relaxed font-semibold transition-all duration-500 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 text-right max-w-xl ml-auto mt-2">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
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
            <style>{`
              @keyframes slide-progress {
                0% { width: 0%; }
                100% { width: 100%; }
              }
              @keyframes testimonial-fade-in {
                from { opacity: 0; transform: translateY(8px); }
                to   { opacity: 1; transform: translateY(0); }
              }
            `}</style>
            <div className="absolute top-6 left-6 text-slate-100 text-6xl font-serif select-none pointer-events-none">“</div>

            <div
              className="relative z-10 flex flex-col items-center"
              style={{
                opacity: testimonialVisible ? 1 : 0,
                transform: testimonialVisible ? 'translateY(0)' : 'translateY(8px)',
                transition: 'opacity 0.3s ease, transform 0.3s ease'
              }}
            >
              {/* Stars */}
              <div className="flex items-center gap-1 text-amber-500 mb-6">
                {[...Array(testimonials[displayedTestimonial].rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>

              {/* Comment text */}
              <p className="text-slate-600 text-base md:text-lg leading-relaxed font-medium italic mb-8 max-w-2xl">
                &ldquo;{testimonials[displayedTestimonial].comment}&rdquo;
              </p>

              {/* User profile info */}
              <div className="flex items-center gap-3.5">
                <img
                  src={testimonials[displayedTestimonial].avatar}
                  alt={testimonials[displayedTestimonial].name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-slate-100 shadow-sm"
                />
                <div className="text-left">
                  <h4 className="text-sm font-bold text-slate-900">{testimonials[displayedTestimonial].name}</h4>
                  <p className="text-xs text-slate-400 font-semibold">{testimonials[displayedTestimonial].role}</p>
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
          <div className="flex justify-center gap-2.5 mt-6">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goToTestimonial(idx)}
                className={`h-2.5 rounded-full transition-all duration-300 relative overflow-hidden cursor-pointer ${
                  displayedTestimonial === idx ? 'w-8 bg-indigo-100' : 'w-2.5 bg-slate-200'
                }`}
              >
                {displayedTestimonial === idx && (
                  <div
                    key={activeTestimonial}
                    className="absolute top-0 left-0 h-full bg-[#3b42c4] rounded-full"
                    style={{
                      animation: 'slide-progress 4.05s linear forwards'
                    }}
                  />
                )}
              </button>
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

      {/* Inline Quick Lookup Modal */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white border border-slate-200 shadow-2xl rounded-3xl max-w-2xl w-full p-6 relative overflow-hidden flex flex-col sm:flex-row gap-6 text-left">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setQuickViewProduct(null);
              }}
              className="absolute top-4 right-4 p-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-500 hover:text-slate-800 transition-all cursor-pointer z-10"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="w-full sm:w-1/2 aspect-square bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 shrink-0">
              <img src={quickViewProduct.thumbnail} alt={quickViewProduct.title} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{quickViewProduct.category}</span>
                <h3 className="text-lg font-black text-slate-800 mt-1 mb-2 leading-tight">{quickViewProduct.title}</h3>
                <div className="flex items-center gap-1.5 mb-4">
                  <div className="flex items-center gap-0.5 text-amber-500 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200/50">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span className="font-extrabold text-xs">{quickViewProduct.rating.toFixed(1)}</span>
                  </div>
                  <span className="text-xs text-slate-400 font-semibold">Ready to Ship</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">{quickViewProduct.description}</p>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <span className="text-xl font-black text-slate-900">${quickViewProduct.price.toFixed(2)}</span>
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setQuickViewProduct(null);
                      router.push(`/products/${quickViewProduct.id}`);
                    }}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    View Details
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart();
                      setQuickViewProduct(null);
                    }}

                    className="px-4 py-2.5 bg-[#3b42c4] hover:bg-[#2d33a6] text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating AI Chat Popup */}
      <AIChatPopup />

      <Footer />

    </div>
  );
}
