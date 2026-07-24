'use client';

import React, { useState, useRef, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/hooks/useAuth';
import { Product } from '@/types';
import { 
  Sparkles, Send, Bot, User, HelpCircle, ArrowRight, CornerDownRight, 
  Activity, ShieldAlert, Cpu, Terminal, Compass, BarChart2
} from 'lucide-react';
import Link from 'next/link';
import aiService from '@/services/ai.service';
import { useAgenticActions } from '@/hooks/useAgenticActions';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  products?: Product[];
  intent?: string;
  isError?: boolean;
  action?: any;
}

const PRESETS = [
  'Show me laptops under $800',
  'Find smartphones',
  'Go to my shopping cart',
  'Open my settings profile',
];

export default function ChatPage() {
  const { isAuthenticated, user } = useAuth();
  const { executeAction } = useAgenticActions();
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "🌐 System initialized. ShoPilot AI HUD is active. How can I assist you with your catalog query today? I can execute navigations, filter inventory, or inject products directly to your cart.",
      intent: 'greeting',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeFilters, setActiveFilters] = useState<any>({
    category: null,
    brand: null,
    query: null,
    maxPrice: null,
  });
  const [thoughtToken, setThoughtToken] = useState('SYSTEM IDLE');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Rotate thought tokens when loading is active to simulate reasoning steps
  useEffect(() => {
    if (!loading) {
      setThoughtToken('SYSTEM IDLE');
      return;
    }
    const tokens = [
      'COGNITIVE_PIPELINE: Initializing...',
      'INTENT_PARSER: Decoding user tokens...',
      'DATABASE_BROKER: Scanning catalog dimensions...',
      'RESPONSE_STREAMER: Formulating reply schema...',
    ];
    let i = 0;
    const interval = setInterval(() => {
      setThoughtToken(tokens[i % tokens.length]);
      i++;
    }, 1200);
    return () => clearInterval(interval);
  }, [loading]);

  const handleSendMessage = async (textToSend: string) => {
    const text = textToSend.trim();
    if (!text) return;

    setInput('');
    setLoading(true);

    const userMessageId = Math.random().toString();
    const newUserMessage: Message = {
      id: userMessageId,
      role: 'user',
      content: text,
    };

    setMessages((prev) => [...prev, newUserMessage]);

    try {
      // Build conversation history format for backend
      const history = messages
        .filter((msg) => msg.id !== 'welcome' && !msg.isError)
        .map((msg) => ({
          role: msg.role,
          content: msg.content,
        }));

      const data = await aiService.chat(text, history);

      if (data.success === false) {
        throw new Error(data.error || 'Failed to get AI reply');
      }

      // Sync active filters to HUD sidebar
      if (data.filters) {
        setActiveFilters({
          category: data.filters.category || null,
          brand: data.filters.brand || null,
          query: data.filters.query || null,
          maxPrice: data.filters.maxPrice || null,
        });
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          role: 'assistant',
          content: data.reply || "I couldn't process that query.",
          products: data.products || [],
          intent: data.intent,
          action: data.action,
        },
      ]);

      // Execute extracted agentic actions
      if (data.action) {
        await executeAction(data.action, data.products || []);
      }
    } catch (err: any) {
      console.error('AI assistant error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          role: 'assistant',
          content: 
            err.response?.data?.error || 
            err.message || 
            'AI Request failed. Please check backend connection.',
          isError: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(input);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#050814] text-slate-100 relative">
      <Navbar />

      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 grid grid-cols-1 lg:grid-cols-4 gap-8 h-[calc(100vh-140px)]">
        
        {/* Left Side: System Telemetry HUD Panel */}
        <div className="hud-glass p-6 rounded-3xl flex flex-col justify-between border-indigo-500/20 shadow-indigo-950/20 shadow-2xl relative overflow-hidden hidden lg:flex">
          {/* Scanning line animation */}
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent h-1/3 animate-pulse pointer-events-none" />
          
          <div>
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-indigo-950/80">
              <Cpu className="w-5 h-5 text-cyan-400" />
              <h2 className="text-sm font-bold tracking-widest text-cyan-400 uppercase text-hud-glow">AI Core Status</h2>
            </div>

            {/* Radar scanner graphics */}
            <div className="relative w-full aspect-square bg-[#03060f] border border-indigo-950 rounded-2xl flex items-center justify-center overflow-hidden mb-6">
              <div className="radar-ring" />
              <div className="radar-ring" style={{ animationDelay: '1s' }} />
              <div className="absolute inset-0 flex items-center justify-center opacity-25">
                <div className="w-full h-[1px] bg-cyan-500" />
                <div className="h-full w-[1px] bg-cyan-500 absolute" />
              </div>
              <Terminal className="w-6 h-6 text-cyan-400/80 animate-pulse z-10" />
            </div>

            {/* Cognitive Pipeline logs */}
            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">State Processor</span>
                <div className="bg-slate-950/80 border border-indigo-950 px-3 py-2 rounded-xl text-xs font-mono text-cyan-300 truncate">
                  {thoughtToken}
                </div>
              </div>

              {/* Active Entity Filters extracted from chat */}
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Entity Extractors</span>
                <div className="space-y-1.5 font-mono text-[11px]">
                  <div className="flex justify-between py-1 px-2.5 bg-indigo-950/20 border border-indigo-950 rounded-lg">
                    <span className="text-slate-400">Category:</span>
                    <span className={activeFilters.category ? "text-cyan-400 font-bold" : "text-slate-600"}>
                      {activeFilters.category || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 px-2.5 bg-indigo-950/20 border border-indigo-950 rounded-lg">
                    <span className="text-slate-400">Brand:</span>
                    <span className={activeFilters.brand ? "text-cyan-400 font-bold" : "text-slate-600"}>
                      {activeFilters.brand || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 px-2.5 bg-indigo-950/20 border border-indigo-950 rounded-lg">
                    <span className="text-slate-400">MaxPrice:</span>
                    <span className={activeFilters.maxPrice ? "text-cyan-400 font-bold" : "text-slate-600"}>
                      {activeFilters.maxPrice ? `$${activeFilters.maxPrice}` : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-indigo-950/80 text-[10px] text-slate-500 font-mono flex items-center justify-between">
            <span>CONTEXT: {user?.username ? user.username.toUpperCase() : 'ANONYMOUS'}</span>
            <Activity className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
          </div>
        </div>

        {/* Right Side: Chat Console */}
        <div className="lg:col-span-3 hud-glass rounded-3xl overflow-hidden flex flex-col h-full border-indigo-500/20 shadow-2xl relative hologram-scanner">
          
          {/* Panel Header */}
          <div className="bg-[#0b1021]/60 border-b border-indigo-950/80 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                <Sparkles className="w-4.5 h-4.5 animate-pulse" />
              </div>
              <div>
                <h1 className="font-bold text-white text-sm tracking-wider">ShoPilot AI Assistant</h1>
                <span className="flex items-center gap-1 text-[10px] text-cyan-400 mt-0.5 font-bold tracking-widest uppercase">
                  <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping" />
                  CO-PILOT LINK ACTIVE
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
              <Compass className="w-4 h-4 text-cyan-500" />
              <span>Dashboard Mode</span>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hud">
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-4 ${isUser ? 'justify-end' : 'justify-start'} animate-fadeIn`}
                >
                  {/* Bot Avatar */}
                  {!isUser && (
                    <div className="w-9 h-9 rounded-xl bg-indigo-950/80 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0 shadow-md">
                      <Bot className="w-4.5 h-4.5" />
                    </div>
                  )}

                  {/* Message Bubble Container */}
                  <div className={`flex flex-col gap-3 max-w-[85%] sm:max-w-[75%] ${isUser ? 'items-end' : 'items-start'}`}>
                    {/* Text Bubble */}
                    <div
                      className={`px-5 py-3.5 rounded-2xl text-sm leading-relaxed border shadow-sm ${
                        isUser
                          ? 'bg-indigo-600 border-indigo-500 text-white rounded-tr-none shadow-indigo-600/10'
                          : msg.isError
                          ? 'bg-red-950/20 border-red-900/50 text-red-200 rounded-tl-none'
                          : 'bg-slate-900/40 border-indigo-950/80 text-slate-200 rounded-tl-none'
                      }`}
                    >
                      {msg.content}
                    </div>

                    {/* Holographic Action Card Completed banner */}
                    {!isUser && msg.action && msg.action.type !== 'none' && (
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-950/20 border border-emerald-900/40 rounded-xl text-[10px] font-mono text-emerald-400 uppercase tracking-widest">
                        <Activity className="w-3.5 h-3.5 animate-pulse" />
                        <span>[ACTION TRIGGERED: {msg.action.type.toUpperCase()}]</span>
                      </div>
                    )}

                    {/* AI Rendered Live Products list */}
                    {!isUser && msg.products && msg.products.length > 0 && (
                      <div className="w-full mt-2 space-y-2">
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold px-1">
                          <CornerDownRight className="w-3.5 h-3.5" />
                          <span>Matching Catalog Items</span>
                        </div>
                        
                        {/* Horizontal Scrollable Product list */}
                        <div className="flex gap-4 overflow-x-auto pb-3 pt-1 scrollbar-hud w-full max-w-full">
                          {msg.products.map((product) => (
                            <div
                              key={product.id}
                              className="bg-slate-950/60 hover:bg-slate-950 border border-slate-900 hover:border-slate-800/80 p-3 rounded-2xl shrink-0 w-[180px] transition-all flex flex-col justify-between h-[210px] group shadow-md"
                            >
                              <div className="relative aspect-square w-full h-24 bg-slate-950 rounded-xl overflow-hidden mb-2 border border-slate-900">
                                <img
                                  src={product.thumbnail}
                                  alt={product.title}
                                  className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
                                />
                              </div>
                              <div className="flex-1 min-h-0 flex flex-col justify-between">
                                <div>
                                  <h4 className="text-xs font-bold text-slate-200 truncate group-hover:text-indigo-400 transition-colors">
                                    {product.title}
                                  </h4>
                                  <p className="text-[10px] text-slate-500 font-semibold truncate mt-0.5">
                                    {product.brand || 'Generic'}
                                  </p>
                                </div>
                                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-900">
                                  <span className="text-xs font-black text-slate-200">${product.price.toFixed(2)}</span>
                                  <Link
                                    href={`/products/${product.id}`}
                                    className="p-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-[10px] font-semibold text-indigo-400 hover:text-indigo-300 transition-all flex items-center gap-0.5"
                                  >
                                    <span>Specs</span>
                                    <ArrowRight className="w-3 h-3" />
                                  </Link>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* User Avatar */}
                  {isUser && (
                    <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 shrink-0 shadow-md">
                      <User className="w-4.5 h-4.5" />
                    </div>
                  )}
                </div>
              );
            })}

            {/* Futuristic loading/typing loader */}
            {loading && (
              <div className="flex items-start gap-4 justify-start">
                <div className="w-9 h-9 rounded-xl bg-indigo-950/80 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
                  <Bot className="w-4.5 h-4.5 animate-bounce" />
                </div>
                <div className="flex flex-col gap-1">
                  <div className="px-5 py-3.5 bg-slate-900/30 border border-indigo-950/80 text-cyan-400 text-xs font-mono rounded-2xl rounded-tl-none flex items-center gap-2">
                    <span className="w-2 h-2 bg-cyan-400 rounded-full animate-ping" />
                    <span>AI reasoning stream in progress...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested prompts presets (only shown when conversation has not progressed) */}
          {messages.length === 1 && (
            <div className="px-6 py-4 border-t border-indigo-950/60 bg-[#0a0f21]/40">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-2 px-1">
                Suggested Telemetry Inputs
              </span>
              <div className="flex flex-wrap gap-2">
                {PRESETS.map((preset, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(preset)}
                    className="text-xs px-3.5 py-2 bg-slate-950/60 hover:bg-slate-950 hover:border-indigo-500/40 border border-indigo-950 text-slate-400 hover:text-slate-200 rounded-xl transition-all cursor-pointer font-medium font-mono"
                  >
                    &gt; {preset}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Bottom Chat Input */}
          <form
            onSubmit={handleSubmit}
            className="p-4 bg-[#0a0f21]/80 border-t border-indigo-950/80 flex gap-3 items-center"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Query catalog parameters..."
              disabled={loading}
              className="flex-1 bg-slate-950/60 hover:bg-slate-950/90 focus:bg-slate-950 border border-indigo-950 focus:border-indigo-500 text-slate-200 rounded-2xl px-5 py-3.5 outline-none transition-all text-sm disabled:opacity-50 placeholder-slate-700 font-mono"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-3.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-900 text-white disabled:text-slate-700 rounded-2xl transition-all shadow-md shadow-indigo-600/10 cursor-pointer disabled:cursor-not-allowed shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      </main>

      <Footer />
    </div>
  );
}
