'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import useProduct from '@/hooks/useProduct';
import useProducts from '@/hooks/useProducts';
import useFavorites from '@/hooks/useFavorites';
import { useAuth } from '@/hooks/useAuth';
import { Skeleton } from '@/components/ui/Skeleton';
import { 
  Star, 
  Heart, 
  ArrowLeft, 
  ShieldCheck, 
  Truck, 
  RefreshCw, 
  ThumbsUp, 
  ThumbsDown, 
  Sparkles, 
  AlertCircle,
  Plus,
  Minus,
  ArrowRightLeft,
  MessageSquare,
  Send,
  ChevronDown,
  ChevronUp,
  RotateCw,
  ShoppingBag,
  Eye,
  X,
  Check,
  Award
} from 'lucide-react';
import axios from 'axios';

interface SummaryResult {
  summary: string;
  pros: string[];
  cons: string[];
  highlights?: string[];
  buyingAdvice?: string;
}

interface ChatMsg {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  isError?: boolean;
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const productId = Number(id);

  const { data: product, isLoading, error } = useProduct(productId);
  const { isFavorite, toggleFavorite } = useFavorites();
  const { isAuthenticated } = useAuth();

  // Fetch related products in the same category
  const { data: relatedData } = useProducts({
    category: product?.category,
    limit: 6
  });

  // Filter out the current product from recommendations
  const relatedProducts = relatedData?.products?.filter(p => p.id !== productId).slice(0, 4) || [];

  // Gallery states
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [zoomStyle, setZoomStyle] = useState<React.CSSProperties>({ transformOrigin: 'center' });
  const [isZoomed, setIsZoomed] = useState(false);
  const [is360Active, setIs360Active] = useState(false);
  const [spinIndex, setSpinIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(0);
  const currentDragIndex = useRef(0);

  // Specifications state
  const [isSpecsOpen, setIsSpecsOpen] = useState(true);

  // Add to cart states
  const [quantity, setQuantity] = useState(1);
  const [cartFeedback, setCartFeedback] = useState<string | null>(null);

  // AI Summary states
  const [aiLoading, setAiLoading] = useState(false);
  const [summary, setSummary] = useState<SummaryResult | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  // Helpful reviews votes tracker
  const [votedReviews, setVotedReviews] = useState<Record<number, boolean>>({});
  const [helpfulCounts, setHelpfulCounts] = useState<Record<number, number>>({});

  // Product Chat Widget states
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMsg[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Sync active image on product load
  useEffect(() => {
    if (product) {
      setActiveImage(product.images[0] || product.thumbnail || null);
      // Initialize chat messages with product greeting
      setChatMessages([
        { 
          id: 'welcome', 
          role: 'assistant', 
          content: `👋 Hi! I'm your ShoPilot AI Assistant. Ask me anything about the **${product.title}**! E.g. 'Is this worth the price?' or 'Tell me about the warranty.'` 
        }
      ]);
    }
  }, [product]);

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

  // Scroll chat widget to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, chatLoading]);

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
        <Navbar />
        <main className="max-w-3xl w-full mx-auto px-4 py-16 flex-1 flex flex-col items-center justify-center text-center">
          <AlertCircle className="w-16 h-16 text-rose-600 mb-4" />
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Product Not Found</h1>
          <p className="text-slate-500 mb-6">The product you are trying to view does not exist or was deleted.</p>
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#3b42c4] hover:bg-[#2d33a6] text-white rounded-xl text-sm font-semibold transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Catalog
          </button>
        </main>
        <Footer />
      </div>
    );
  }

  const isFav = product ? isFavorite(product.id) : false;

  // Hover Zoom handlers
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({ transformOrigin: `${x}% ${y}%` });
  };

  // 360 Spin Drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!product || product.images.length === 0) return;
    setIsDragging(true);
    dragStartX.current = e.clientX;
    currentDragIndex.current = spinIndex;
  };

  const handleMouseMove360 = (e: React.MouseEvent) => {
    if (!isDragging || !product || product.images.length === 0) return;
    const deltaX = e.clientX - dragStartX.current;
    // Every 15px of drag moves one frame
    const sensitivity = 15;
    const offset = Math.floor(deltaX / sensitivity);
    let newIndex = (currentDragIndex.current - offset) % product.images.length;
    if (newIndex < 0) {
      newIndex += product.images.length;
    }
    setSpinIndex(newIndex);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch support for 360 Spin
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!product || product.images.length === 0) return;
    setIsDragging(true);
    dragStartX.current = e.touches[0].clientX;
    currentDragIndex.current = spinIndex;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !product || product.images.length === 0) return;
    const deltaX = e.touches[0].clientX - dragStartX.current;
    const sensitivity = 15;
    const offset = Math.floor(deltaX / sensitivity);
    let newIndex = (currentDragIndex.current - offset) % product.images.length;
    if (newIndex < 0) {
      newIndex += product.images.length;
    }
    setSpinIndex(newIndex);
  };

  // Quantity helpers
  const handleQtyChange = (val: number) => {
    if (!product) return;
    const newVal = Math.max(1, Math.min(product.stock, quantity + val));
    setQuantity(newVal);
  };

  // Add to Cart / Buy Now actions
  const triggerCartAction = (actionName: string) => {
    if (!product) return;
    setCartFeedback(`${actionName === 'buy' ? 'Proceeding to checkout with' : 'Added'} ${quantity} item(s) to Cart!`);
    setTimeout(() => setCartFeedback(null), 3500);
  };

  // Compare action
  const toggleCompareLocalStorage = () => {
    if (!product) return;
    try {
      const items = localStorage.getItem('shopilot_compare');
      let compareList: number[] = items ? JSON.parse(items) : [];
      if (compareList.includes(product.id)) {
        compareList = compareList.filter(id => id !== product.id);
        setCartFeedback('Removed product from Comparison list.');
      } else {
        if (compareList.length >= 4) {
          setCartFeedback('You can compare up to 4 products at a time.');
          setTimeout(() => setCartFeedback(null), 3000);
          return;
        }
        compareList.push(product.id);
        setCartFeedback('Added product to Comparison list! Navigate to catalog to compare.');
      }
      localStorage.setItem('shopilot_compare', JSON.stringify(compareList));
    } catch (e) {
      console.error('Compare list storage error:', e);
    }
    setTimeout(() => setCartFeedback(null), 3500);
  };

  const isProductInCompare = () => {
    if (!product) return false;
    try {
      const items = localStorage.getItem('shopilot_compare');
      const compareList: number[] = items ? JSON.parse(items) : [];
      return compareList.includes(product.id);
    } catch (e) {
      return false;
    }
  };

  // Review Helpful voting
  const handleVoteHelpful = (idx: number) => {
    if (votedReviews[idx]) return;
    setVotedReviews(prev => ({ ...prev, [idx]: true }));
    setHelpfulCounts(prev => ({
      ...prev,
      [idx]: (helpfulCounts[idx] || Math.floor(Math.random() * 15) + 2) + 1
    }));
  };

  // Chat Widget send handler
  const handleSendChat = async () => {
    const text = chatInput.trim();
    if (!text || !product) return;
    setChatInput('');
    setChatLoading(true);
    setChatMessages(prev => [...prev, { id: Math.random().toString(), role: 'user', content: text }]);

    try {
      const history = chatMessages
        .filter(m => m.id !== 'welcome' && !m.isError)
        .map(m => ({ role: m.role, content: m.content }));
      
      // Inject product context into user's first query or prompt history
      const promptContext = `[Context Product: ${product.title}, Brand: ${product.brand}, Price: $${product.price}, Category: ${product.category}, Rating: ${product.rating}, Description: ${product.description}]`;
      const messageWithContext = history.length === 0 ? `${promptContext} ${text}` : text;

      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'chat', message: messageWithContext, history }),
      });
      const data = await res.json();
      if (data.success === false) throw new Error(data.error || 'Failed to get response');
      
      setChatMessages(prev => [...prev, {
        id: Math.random().toString(),
        role: 'assistant',
        content: data.reply || "I'm sorry, I couldn't process that query."
      }]);
    } catch (err: any) {
      setChatMessages(prev => [...prev, {
        id: Math.random().toString(),
        role: 'assistant',
        content: err.message || 'Error occurred. Please verify NVIDIA NIM configurations.',
        isError: true
      }]);
    } finally {
      setChatLoading(false);
    }
  };

  // Dynamic Specifications based on category
  const renderSpecifications = () => {
    if (!product) return null;
    
    const isElectronics = ['laptops', 'smartphones', 'tablets', 'mobile-accessories'].includes(product.category);

    const electronicSpecs = [
      { key: 'Processor', value: product.brand === 'Apple' ? 'Apple Silicon M-Series/A-Series Core' : 'Octa-core High Performance Processor' },
      { key: 'RAM', value: product.category === 'laptops' ? '16GB Unified Memory / DDR5' : '8GB High Speed RAM' },
      { key: 'Storage', value: product.category === 'laptops' ? '512GB NVMe PCIe SSD' : '128GB UFS Storage' },
      { key: 'Display', value: product.category === 'laptops' ? '15.6" Retina / Liquid Crystal Ultra-crisp Display' : '6.1" OLED Retina Display' },
      { key: 'Battery', value: product.category === 'laptops' ? '70Wh Li-Polymer (Up to 18 hours)' : '4000mAh Lithium-ion' },
      { key: 'Weight', value: `${product.weight || 1.5} kg` },
      { key: 'Warranty', value: product.warrantyInformation || '1 Year Manufacturer Warranty' }
    ];

    const generalSpecs = [
      { key: 'Dimensions', value: product.dimensions ? `${product.dimensions.width}W × ${product.dimensions.height}H × ${product.dimensions.depth}D cm` : 'Standard dimensions' },
      { key: 'Weight', value: `${product.weight} lbs` },
      { key: 'Category', value: product.category.replace('-', ' ') },
      { key: 'SKU', value: product.sku },
      { key: 'Warranty', value: product.warrantyInformation || '1 Month standard store warranty' },
      { key: 'Shipping Speed', value: product.shippingInformation || 'Standard Ground delivery' },
      { key: 'MOQ (Minimum Order)', value: product.minimumOrderQuantity ? `${product.minimumOrderQuantity} unit(s)` : '1 unit' }
    ];

    const specsToUse = isElectronics ? electronicSpecs : generalSpecs;

    return (
      <div className="overflow-hidden border border-slate-200/80 rounded-2xl bg-white shadow-sm transition-all duration-300">
        <button
          onClick={() => setIsSpecsOpen(!isSpecsOpen)}
          className="w-full px-6 py-4 flex items-center justify-between font-bold text-slate-800 text-sm md:text-base border-b border-slate-100 hover:bg-slate-50 transition-colors"
        >
          <span>Technical Specifications & Metrics</span>
          {isSpecsOpen ? <ChevronUp className="w-5 h-5 text-slate-500" /> : <ChevronDown className="w-5 h-5 text-slate-500" />}
        </button>
        
        {isSpecsOpen && (
          <div className="px-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
              {specsToUse.map((spec, i) => (
                <div key={i} className="flex justify-between py-2.5 border-b border-slate-100 text-xs md:text-sm">
                  <span className="font-semibold text-slate-500">{spec.key}</span>
                  <span className="text-slate-800 font-medium text-right max-w-[60%] truncate">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 relative">
      <Navbar />

      {/* Cart Feedback Toast */}
      {cartFeedback && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-slate-900 border border-slate-800 text-white font-bold text-xs md:text-sm px-6 py-3.5 rounded-full shadow-2xl flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{cartFeedback}</span>
        </div>
      )}

      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        {/* Back Button */}
        <button
          onClick={() => router.push('/')}
          className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 text-sm font-semibold mb-6 group cursor-pointer"
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
              <div className="h-px bg-slate-200" />
              <Skeleton className="h-12 w-1/3" />
            </div>
          </div>
        ) : (
          <div className="space-y-12">
            
            {/* Upper Detail Card */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              
              {/* Product Gallery (Left) */}
              <div className="space-y-4">
                
                {/* Main Viewport */}
                <div className="relative aspect-square bg-white border border-slate-200/80 rounded-3xl overflow-hidden flex items-center justify-center p-6 shadow-sm select-none">
                  {is360Active ? (
                    // 360 Spin Mode
                    <div 
                      className="w-full h-full flex flex-col items-center justify-center cursor-grab active:cursor-grabbing"
                      onMouseDown={handleMouseDown}
                      onMouseMove={handleMouseMove360}
                      onMouseUp={handleMouseUp}
                      onMouseLeave={handleMouseUp}
                      onTouchStart={handleTouchStart}
                      onTouchMove={handleTouchMove}
                      onTouchEnd={handleMouseUp}
                    >
                      <img
                        src={product.images[spinIndex] || product.thumbnail}
                        alt="360 rotation view"
                        className="max-h-[85%] object-contain pointer-events-none"
                      />
                      <div className="absolute bottom-4 flex items-center gap-1.5 text-[10px] md:text-xs font-bold text-slate-400 bg-slate-50/90 border border-slate-200/60 px-3 py-1 rounded-full backdrop-blur-sm shadow-sm select-none">
                        <RotateCw className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '4s' }} />
                        <span>Drag horizontally to rotate 360°</span>
                      </div>
                    </div>
                  ) : (
                    // Hover Zoom Mode
                    <div 
                      className="w-full h-full overflow-hidden flex items-center justify-center cursor-zoom-in"
                      onMouseEnter={() => setIsZoomed(true)}
                      onMouseLeave={() => setIsZoomed(false)}
                      onMouseMove={handleMouseMove}
                    >
                      {activeImage && (
                        <img
                          src={activeImage}
                          alt={product.title}
                          style={isZoomed ? { ...zoomStyle, transform: 'scale(2.2)' } : undefined}
                          className={`max-h-full object-contain rounded-2xl transition-transform ${isZoomed ? '' : 'duration-300'}`}
                        />
                      )}
                    </div>
                  )}

                  {/* 360 Toggle Overlay Button */}
                  {product.images.length > 1 && (
                    <button
                      onClick={() => setIs360Active(!is360Active)}
                      className={`absolute top-4 right-4 p-2.5 rounded-2xl border transition-all shadow-sm cursor-pointer hover:scale-105 ${
                        is360Active 
                          ? 'bg-indigo-600 border-indigo-600 text-white' 
                          : 'bg-white/90 border-slate-200 text-slate-600 hover:text-slate-900'
                      }`}
                      title={is360Active ? 'Static View' : '360° Spin'}
                    >
                      <RotateCw className="w-5 h-5" />
                    </button>
                  )}
                </div>

                {/* Thumbnails Row */}
                {product.images.length > 1 && (
                  <div className="grid grid-cols-5 gap-3.5">
                    {product.images.slice(0, 5).map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setIs360Active(false);
                          setActiveImage(img);
                        }}
                        className={`aspect-square bg-white border rounded-2xl overflow-hidden p-2 flex items-center justify-center shadow-sm transition-all hover:scale-102 cursor-pointer ${
                          !is360Active && activeImage === img 
                            ? 'border-[#3b42c4] ring-2 ring-[#3b42c4]/15' 
                            : 'border-slate-200/80 hover:border-slate-300'
                        }`}
                      >
                        <img
                          src={img}
                          alt={`${product.title} view ${idx}`}
                          className="max-h-full object-contain pointer-events-none"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Product Specifications & Buy Panel (Right) */}
              <div className="space-y-6">
                <div>
                  <span className="bg-indigo-50 border border-indigo-100 text-[#3b42c4] text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg">
                    {product.category.replace('-', ' ')}
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3.5 leading-snug">
                    {product.title}
                  </h1>
                  <p className="text-slate-500 text-sm mt-1.5 font-medium">Brand: {product.brand || 'Generic'} | SKU: {product.sku}</p>
                </div>

                {/* Rating & Stock status */}
                <div className="flex items-center gap-4 text-sm font-semibold">
                  <div className="flex items-center gap-1 text-amber-500 bg-amber-50 border border-amber-100 px-3 py-1 rounded-xl shadow-xs">
                    <Star className="w-4 h-4 fill-current" />
                    <span>{product.rating.toFixed(1)} / 5</span>
                  </div>
                  <span className="text-slate-300">|</span>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl border text-xs ${
                    product.stock > 0 
                      ? 'text-emerald-700 bg-emerald-50 border-emerald-100' 
                      : 'text-rose-700 bg-rose-50 border-rose-100'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${product.stock > 0 ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                    {product.stock > 0 ? `In Stock (${product.stock} left)` : 'Out of Stock'}
                  </span>
                </div>

                {/* Price block */}
                <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex flex-col">
                    <span className="text-slate-400 text-xs uppercase font-extrabold tracking-wider mb-1">
                      Offer Price
                    </span>
                    <div className="flex items-baseline gap-2.5">
                      <span className="text-3xl font-black text-slate-900">${product.price.toFixed(2)}</span>
                      {product.discountPercentage > 0 && (
                        <>
                          <span className="text-slate-400 line-through text-sm">
                            ${(product.price / (1 - product.discountPercentage / 100)).toFixed(2)}
                          </span>
                          <span className="text-emerald-600 bg-emerald-50 text-[10px] font-extrabold px-2 py-0.5 rounded-md border border-emerald-100">
                            SAVE {Math.round(product.discountPercentage)}%
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Wishlist and Compare */}
                  <div className="flex gap-2">
                    {/* Compare */}
                    <button
                      onClick={toggleCompareLocalStorage}
                      className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        isProductInCompare()
                          ? 'bg-indigo-50 border-indigo-200 text-[#3b42c4]'
                          : 'bg-white border-slate-200 text-slate-600 hover:text-slate-800'
                      }`}
                      title="Add to product comparison list"
                    >
                      <ArrowRightLeft className="w-4 h-4" />
                      <span>{isProductInCompare() ? 'Comparing' : 'Compare'}</span>
                    </button>

                    {/* Favorite */}
                    <button
                      onClick={() => {
                        if (!isAuthenticated) {
                          router.push(`/login?redirect=${encodeURIComponent(`/products/${product.id}`)}`);
                          return;
                        }
                        toggleFavorite(product.id);
                      }}
                      className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        isFav
                          ? 'bg-rose-50 border-rose-200 text-rose-600'
                          : 'bg-white border-slate-200 text-slate-600 hover:text-slate-800'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                      <span>{isFav ? 'Wishlisted' : 'Wishlist'}</span>
                    </button>
                  </div>
                </div>

                {/* Add to Cart Section */}
                {product.stock > 0 && (
                  <div className="bg-slate-100/50 border border-slate-200/50 rounded-3xl p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-slate-700">Quantity</span>
                      <div className="flex items-center bg-white border border-slate-200 rounded-xl overflow-hidden">
                        <button
                          onClick={() => handleQtyChange(-1)}
                          disabled={quantity <= 1}
                          className="px-3.5 py-2 text-slate-500 hover:bg-slate-50 hover:text-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-5 font-bold text-sm text-slate-800">{quantity}</span>
                        <button
                          onClick={() => handleQtyChange(1)}
                          disabled={quantity >= product.stock}
                          className="px-3.5 py-2 text-slate-500 hover:bg-slate-50 hover:text-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3.5 pt-2">
                      <button
                        onClick={() => triggerCartAction('cart')}
                        className="w-full py-3 bg-white border border-slate-300 hover:border-slate-400 text-slate-800 font-bold text-sm rounded-2xl transition-colors cursor-pointer shadow-xs"
                      >
                        Add to Cart
                      </button>
                      <button
                        onClick={() => triggerCartAction('buy')}
                        className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-2xl transition-colors cursor-pointer shadow-sm flex items-center justify-center gap-1.5"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        Buy Now
                      </button>
                    </div>
                  </div>
                )}

                {/* Description */}
                <div>
                  <h3 className="text-slate-400 text-xs uppercase font-extrabold tracking-wider mb-2">
                    Product Description
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed font-medium">{product.description}</p>
                </div>

                {/* Quick Info Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs">
                  <div className="bg-white border border-slate-200/80 p-4 rounded-2xl flex items-center gap-3 shadow-xs">
                    <Truck className="w-5 h-5 text-indigo-500 shrink-0" />
                    <div>
                      <p className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">Shipping Info</p>
                      <p className="text-slate-700 font-bold mt-0.5">{product.shippingInformation || 'Ships in 1-2 days'}</p>
                    </div>
                  </div>
                  <div className="bg-white border border-slate-200/80 p-4 rounded-2xl flex items-center gap-3 shadow-xs">
                    <ShieldCheck className="w-5 h-5 text-indigo-500 shrink-0" />
                    <div>
                      <p className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">Warranty</p>
                      <p className="text-slate-700 font-bold mt-0.5">{product.warrantyInformation || 'Store warranty'}</p>
                    </div>
                  </div>
                  <div className="bg-white border border-slate-200/80 p-4 rounded-2xl flex items-center gap-3 shadow-xs">
                    <RefreshCw className="w-5 h-5 text-indigo-500 shrink-0" />
                    <div>
                      <p className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">Return Policy</p>
                      <p className="text-slate-700 font-bold mt-0.5">{product.returnPolicy || '30 days standard returns'}</p>
                    </div>
                  </div>
                </div>

              </div>

            </div>

            {/* AI Summary Card (Unique Feature) */}
            <div className="border border-indigo-100 bg-gradient-to-br from-indigo-50/30 via-white to-indigo-50/10 rounded-[32px] p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-3.5 mb-6">
                <div className="w-11 h-11 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 shadow-xs">
                  <Sparkles className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">shoPilot AI Sentiment & Buying Analysis</h2>
                  <p className="text-xs text-slate-500 font-semibold">Real-time summaries and reviews parsing by Nvidia NIM Llama-3.3 70B</p>
                </div>
              </div>

              {aiLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-5/6" />
                  <Skeleton className="h-16 w-full" />
                </div>
              ) : aiError ? (
                <div className="flex items-start gap-3 bg-rose-50 border border-rose-200 rounded-2xl p-4 text-rose-800 text-xs">
                  <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span>{aiError}</span>
                </div>
              ) : summary ? (
                <div className="space-y-8">
                  {/* Highlights and summary banner */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-6 border-b border-slate-100">
                    <div className="lg:col-span-2 space-y-3">
                      <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider">AI Executive Summary</span>
                      <p className="text-sm text-slate-700 leading-relaxed font-semibold">
                        {summary.summary}
                      </p>
                    </div>

                    <div className="space-y-3">
                      <span className="text-[10px] uppercase font-black text-indigo-600 tracking-wider">AI Highlights</span>
                      <div className="space-y-2">
                        {summary.highlights?.map((highlight, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-xs text-slate-600 font-semibold">
                            <span className="text-indigo-500">✅</span>
                            <span>{highlight}</span>
                          </div>
                        )) || (
                          <>
                            <div className="flex items-center gap-2 text-xs text-slate-600 font-semibold">
                              <span>✅ Best choice for quality</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-600 font-semibold">
                              <span>✅ Worth buying under ${Math.ceil(product.price * 1.1)}</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Pros and Cons */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Pros */}
                    <div className="bg-emerald-50/30 border border-emerald-100/60 rounded-2xl p-5">
                      <span className="text-xs uppercase font-black text-emerald-600 tracking-wider flex items-center gap-1.5 mb-4">
                        <ThumbsUp className="w-4 h-4" /> AI Pros
                      </span>
                      <ul className="space-y-2.5">
                        {summary.pros.map((pro, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-slate-600 font-semibold leading-normal">
                            <span className="text-emerald-500 shrink-0">✔</span>
                            <span>{pro}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Cons */}
                    <div className="bg-rose-50/30 border border-rose-100/60 rounded-2xl p-5">
                      <span className="text-xs uppercase font-black text-rose-600 tracking-wider flex items-center gap-1.5 mb-4">
                        <ThumbsDown className="w-4 h-4" /> AI Cons
                      </span>
                      <ul className="space-y-2.5">
                        {summary.cons.map((con, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-slate-600 font-semibold leading-normal">
                            <span className="text-rose-500 shrink-0">✖</span>
                            <span>{con}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* AI Buying Advice */}
                  <div className="bg-white/80 border border-slate-200/80 rounded-2xl p-5 shadow-2xs">
                    <span className="text-[10px] uppercase font-black text-indigo-500 tracking-wider flex items-center gap-1.5 mb-2.5">
                      <Award className="w-4 h-4" /> shoPilot Buying Advice
                    </span>
                    <p className="text-xs md:text-sm text-slate-600 italic font-semibold leading-relaxed">
                      &ldquo;{summary.buyingAdvice || `This product is recommended for consumers looking for a quality ${product.brand || 'Generic'} solution because it offers solid value and high user ratings.`}&rdquo;
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-slate-500 text-xs italic">Awaiting AI analysis...</p>
              )}
            </div>

            {/* Specifications Section */}
            {renderSpecifications()}

            {/* Customer Reviews Section */}
            <div className="border border-slate-200 bg-white rounded-[32px] p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                  <h2 className="text-lg font-black text-slate-900">Customer Ratings & Comments</h2>
                  <p className="text-xs text-slate-400 mt-1 font-semibold">Verified reviews left by purchasers</p>
                </div>
                
                {/* Visual Average */}
                <div className="flex items-center gap-3">
                  <span className="text-4xl font-black text-slate-800">{product.rating.toFixed(1)}</span>
                  <div className="space-y-1">
                    <div className="flex items-center gap-0.5 text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < Math.round(product.rating) ? 'fill-current' : 'text-slate-200'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{product.reviews?.length || 3} verified reviews</p>
                  </div>
                </div>
              </div>

              {product.reviews && product.reviews.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {product.reviews.map((rev, idx) => {
                    const votes = helpfulCounts[idx] || Math.floor(Math.random() * 8) + 1;
                    return (
                      <div key={idx} className="bg-slate-50 border border-slate-200/80 p-5 rounded-2xl flex flex-col justify-between shadow-xs hover:border-slate-300 transition-colors">
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-1 text-amber-400">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3 h-3 ${
                                    i < rev.rating ? 'fill-current' : 'text-slate-200'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-[10px] text-slate-400 font-semibold">{new Date(rev.date).toLocaleDateString()}</span>
                          </div>
                          
                          <p className="text-slate-600 text-xs italic font-medium leading-relaxed mb-4">
                            &ldquo;{rev.comment}&rdquo;
                          </p>

                          {/* Mock Customer Photo */}
                          <div className="flex gap-2 mb-4">
                            <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[10px] font-extrabold text-indigo-500 overflow-hidden shrink-0">
                              Photo
                            </div>
                            <div className="w-10 h-10 rounded-lg bg-slate-200/80 border border-slate-300/30 flex items-center justify-center text-[10px] font-bold text-slate-500 overflow-hidden shrink-0">
                              Box
                            </div>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-500">
                          <span className="font-bold text-slate-600">{rev.reviewerName}</span>
                          <button
                            onClick={() => handleVoteHelpful(idx)}
                            className={`flex items-center gap-1 px-2.5 py-1 rounded-md border transition-all cursor-pointer ${
                              votedReviews[idx]
                                ? 'bg-emerald-50 border-emerald-200 text-emerald-600 font-bold'
                                : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800'
                            }`}
                          >
                            <ThumbsUp className="w-3 h-3" />
                            <span>Helpful ({votes})</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-slate-500 text-xs italic">No customer reviews yet for this product.</p>
              )}
            </div>

            {/* Related Products Section */}
            {relatedProducts.length > 0 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-black text-slate-900">People Also Bought & Similar Products</h2>
                  <p className="text-xs text-slate-400 mt-1 font-semibold">Recommendations matching category &brand</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                  {relatedProducts.map((p) => {
                    const originalP = p.discountPercentage 
                      ? (p.price / (1 - p.discountPercentage / 100)).toFixed(2)
                      : null;
                    return (
                      <div 
                        key={p.id}
                        onClick={() => router.push(`/products/${p.id}`)}
                        className="group bg-white border border-slate-200/60 hover:border-slate-300 p-4 rounded-2xl flex flex-col h-[320px] transition-all hover:shadow-xs hover:-translate-y-0.5 cursor-pointer"
                      >
                        <div className="aspect-[4/3] bg-slate-50 rounded-xl overflow-hidden p-2 flex items-center justify-center border border-slate-100">
                          <img
                            src={p.thumbnail}
                            alt={p.title}
                            className="max-h-full object-contain transition-transform duration-300 group-hover:scale-103"
                          />
                        </div>
                        <div className="flex flex-col flex-1 mt-3">
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{p.brand || 'Generic'}</span>
                          <h3 className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-2 mt-1 leading-normal">
                            {p.title}
                          </h3>

                          <div className="mt-auto pt-2 border-t border-slate-100 flex items-center justify-between">
                            <div className="flex flex-col">
                              <span className="text-xs font-black text-slate-900">${p.price.toFixed(2)}</span>
                              {originalP && <span className="text-[10px] text-slate-400 line-through">${originalP}</span>}
                            </div>
                            <div className="flex items-center gap-0.5 text-amber-500 text-[10px] font-bold">
                              <Star className="w-3 h-3 fill-current" />
                              <span>{p.rating.toFixed(1)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>
        )}
      </main>

      <Footer />

      {/* Docked AI Chat Widget dedicated to product */}
      {product && (
        <>
          {/* Floating trigger button */}
          <button
            onClick={() => setChatOpen(!chatOpen)}
            className="fixed bottom-6 right-6 z-50 p-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-2xl transition-transform hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center gap-2 group"
          >
            <MessageSquare className="w-6 h-6 shrink-0" />
            <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 text-xs font-extrabold tracking-wide uppercase select-none">AI Chat</span>
          </button>

          {/* Chat Panel Drawer */}
          <div
            className={`fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-3rem)] bg-white border border-slate-200 rounded-[24px] shadow-2xl flex flex-col overflow-hidden transition-all duration-300 origin-bottom-right ${
              chatOpen ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto' : 'opacity-0 scale-90 translate-y-4 pointer-events-none'
            }`}
            style={{ height: 480 }}
          >
            {/* Header */}
            <div className="bg-slate-50 border-b border-slate-200 px-4 py-3.5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 shadow-2xs">
                  <Sparkles className="w-4.5 h-4.5 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-slate-800 tracking-tight leading-none">shoPilot AI Assistant</h3>
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5 block">Product Context active</span>
                </div>
              </div>
              <button 
                onClick={() => setChatOpen(false)}
                className="p-1.5 hover:bg-slate-200/60 rounded-lg text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Message Pane */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col max-w-[85%] ${
                    msg.role === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'
                  }`}
                >
                  <div
                    className={`px-3.5 py-2.5 rounded-2xl text-xs md:text-sm font-semibold leading-relaxed shadow-3xs ${
                      msg.role === 'user'
                        ? 'bg-indigo-600 text-white rounded-br-none'
                        : msg.isError
                        ? 'bg-rose-50 border border-rose-200 text-rose-800 rounded-bl-none'
                        : 'bg-white border border-slate-200/80 text-slate-700 rounded-bl-none'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div className="mr-auto max-w-[85%] flex items-start gap-1">
                  <div className="bg-white border border-slate-200 px-3.5 py-2.5 rounded-2xl rounded-bl-none flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input Form */}
            <div className="p-3 border-t border-slate-200 bg-white flex items-center gap-2">
              <input
                type="text"
                placeholder="Ask about this product..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:outline-hidden focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <button
                onClick={handleSendChat}
                disabled={!chatInput.trim() || chatLoading}
                className="p-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
