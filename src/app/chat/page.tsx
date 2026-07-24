'use client';

import React, { useState, useRef, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/hooks/useAuth';
import { Product } from '@/types';
import { Sparkles, Send, Bot, User, HelpCircle, ArrowRight, CornerDownRight, Heart, Star, AlertCircle, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import aiService from '@/services/ai.service';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  products?: Product[];
  intent?: string;
  isError?: boolean;
}

const PRESETS = [
  'Recommend a laptop for programming',
  'Best smartphones under $1000',
  'Suggest gifts for a gamer',
  'Show me some fragrances',
];

export default function ChatPage() {
  const { isAuthenticated, user } = useAuth();
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "👋 Hello! I am your ShoPilot AI Assistant. I can help you search the catalog, filter categories, compare models, and give recommendations. Try typing a query or selecting one of the suggested prompts below!",
      intent: 'greeting',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

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

      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          role: 'assistant',
          content: data.reply || "I couldn't process that query.",
          products: data.products || [],
          intent: data.intent,
        },
      ]);
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
            'AI Request failed. Please ensure your NVIDIA NIM API Key is defined in the root .env.local file.',
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
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 relative">
      <Navbar />

      <main className="max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 flex flex-col h-[calc(100vh-140px)]">
        
        {/* Chat Wrapper */}
        <div className="flex-1 bg-slate-900/10 border border-slate-900/80 rounded-3xl overflow-hidden flex flex-col h-full backdrop-blur-md">
          
          {/* Top Info Bar */}
          <div className="bg-slate-900/40 border-b border-slate-900/80 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white">
                <Sparkles className="w-4.5 h-4.5 animate-pulse" />
              </div>
              <div>
                <span className="font-bold text-white text-sm">ShoPilot AI Assistant</span>
                <span className="flex items-center gap-1 text-[10px] text-emerald-400 mt-0.5 font-semibold">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                  Online (Llama 3.3 70B)
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500">
              <HelpCircle className="w-4 h-4 text-slate-600" />
              <span className="hidden sm:inline">Only handles shopping & catalog inquiries</span>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-none">
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-4 ${isUser ? 'justify-end' : 'justify-start'} animate-fadeIn`}
                >
                  {/* Bot Avatar */}
                  {!isUser && (
                    <div className="w-9 h-9 rounded-xl bg-indigo-950 border border-indigo-900/60 flex items-center justify-center text-indigo-400 shrink-0 shadow-md">
                      <Bot className="w-4.5 h-4.5" />
                    </div>
                  )}

                  {/* Message Bubble Container */}
                  <div className={`flex flex-col gap-3 max-w-[85%] sm:max-w-[75%] ${isUser ? 'items-end' : 'items-start'}`}>
                    {/* Text Bubble */}
                    <div
                      className={`px-5 py-3.5 rounded-2xl text-sm leading-relaxed border shadow-sm ${
                        isUser
                          ? 'bg-indigo-600 border-indigo-500 text-white rounded-tr-none'
                          : msg.isError
                          ? 'bg-red-950/20 border-red-900/50 text-red-200 rounded-tl-none'
                          : 'bg-slate-900/35 border-slate-900/80 text-slate-200 rounded-tl-none'
                      }`}
                    >
                      {msg.content}
                    </div>

                    {/* AI Rendered Live Products Checklist */}
                    {!isUser && msg.products && msg.products.length > 0 && (
                      <div className="w-full mt-2 space-y-2">
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold px-1">
                          <CornerDownRight className="w-3.5 h-3.5" />
                          <span>Matching Catalog Items</span>
                        </div>
                        
                        {/* Horizontal Scrollable Product list */}
                        <div className="flex gap-4 overflow-x-auto pb-3 pt-1 scrollbar-none w-full max-w-full">
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

            {/* Typing Loader */}
            {loading && (
              <div className="flex items-start gap-4 justify-start animate-pulse">
                <div className="w-9 h-9 rounded-xl bg-indigo-950 border border-indigo-900/65 flex items-center justify-center text-indigo-400 shrink-0">
                  <Bot className="w-4.5 h-4.5" />
                </div>
                <div className="px-5 py-3.5 bg-slate-900/20 border border-slate-900/80 text-slate-500 text-xs rounded-2xl rounded-tl-none flex items-center gap-1.5 font-medium">
                  <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce delay-100" />
                  <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce delay-200" />
                  <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce delay-300" />
                  <span>AI assistant is looking for matching products...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick presets (only shown when conversation has not progressed) */}
          {messages.length === 1 && (
            <div className="px-6 py-4 border-t border-slate-900/60">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-2 px-1">
                Suggested Prompts
              </span>
              <div className="flex flex-wrap gap-2">
                {PRESETS.map((preset, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(preset)}
                    className="text-xs px-3.5 py-2 bg-slate-950/40 hover:bg-slate-950 hover:border-slate-800 border border-slate-900 text-slate-400 hover:text-slate-200 rounded-xl transition-all cursor-pointer font-medium"
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Bottom Chat Input */}
          <form
            onSubmit={handleSubmit}
            className="p-4 bg-slate-900/40 border-t border-slate-900/80 flex gap-3 items-center"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask for laptop recommendations, compare phones, search items..."
              disabled={loading}
              className="flex-1 bg-slate-950 hover:bg-slate-950/90 focus:bg-slate-950 border border-slate-900 focus:border-indigo-500 text-slate-200 rounded-2xl px-5 py-3.5 outline-none transition-all text-sm disabled:opacity-50 placeholder-slate-600"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-3.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-850 text-white disabled:text-slate-600 rounded-2xl transition-all shadow-md shadow-indigo-600/10 cursor-pointer disabled:cursor-not-allowed shrink-0"
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
