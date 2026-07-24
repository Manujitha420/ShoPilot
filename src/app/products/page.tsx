'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/hooks/useAuth';
import { useFavorites } from '@/hooks/useFavorites';
import useProducts from '@/hooks/useProducts';
import useSearchProducts from '@/hooks/useSearchProducts';
import { useCategories } from '@/hooks/useCategories';
import { useCartAnimation } from '@/hooks/useCartAnimation';
import { Product } from '@/types';
import ProductComparison from '@/components/product/ProductComparison';
import { MOCK_COLORS, MOCK_SIZES } from '@/constants';
import { 
  Search, ChevronLeft, ChevronRight, SlidersHorizontal, ArrowRightLeft, 
  X, Sparkles, Loader2, Star, Heart, Eye, ShoppingCart, Info, Award, 
  Zap, GraduationCap, DollarSign, Leaf, Flame, ShieldAlert, ShoppingBag
} from 'lucide-react';

const ITEMS_PER_PAGE = 9;

function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { animateCartAdd, flyingDotsOverlay } = useCartAnimation();
  const { data: categories, isLoading: isCategoriesLoading } = useCategories();

  // URL Params Sync
  const initialCategory = searchParams?.get('category') || '';
  const initialQuery = searchParams?.get('query') || '';

  // Core States
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState('popularity'); // popularity, price-asc, price-desc, newest, rating-desc, ai-recommended, best-deals
  const [page, setPage] = useState(1);

  // Filters Sidebar States
  const [priceRange, setPriceRange] = useState<number>(2000);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [minRating, setMinRating] = useState<number>(0);
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);
  const [minDiscount, setMinDiscount] = useState<number>(0);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);

  // AI Smart Filters ("Help me choose")
  const [activeSmartFilter, setActiveSmartFilter] = useState<string | null>(null);

  // Comparison State
  const [compareProducts, setCompareProducts] = useState<Product[]>([]);
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);

  // Quick View State
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Cart Feedback
  const [cartFeedback, setCartFeedback] = useState<string | null>(null);

  // Sync comparison state from/to localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('shopilot_compare');
      if (stored) {
        setCompareProducts(JSON.parse(stored));
      }
    } catch (e) {
      console.error(e);
    }

    const handleCompareUpdate = () => {
      try {
        const stored = localStorage.getItem('shopilot_compare');
        if (stored) {
          setCompareProducts(JSON.parse(stored));
        } else {
          setCompareProducts([]);
        }
      } catch (e) {
        console.error(e);
      }
    };
    window.addEventListener('shopilot_compare_update', handleCompareUpdate);
    window.addEventListener('storage', handleCompareUpdate);
    return () => {
      window.removeEventListener('shopilot_compare_update', handleCompareUpdate);
      window.removeEventListener('storage', handleCompareUpdate);
    };
  }, []);

  // Sync parameters
  useEffect(() => {
    const category = searchParams?.get('category') || '';
    const query = searchParams?.get('query') || '';
    setSelectedCategory(category);
    setSearchQuery(query);
    setDebouncedQuery(query);
    setPage(1);
  }, [searchParams]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      setPage(1);
    }, 450);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch product list
  const isSearching = debouncedQuery.trim().length > 0;
  const skip = (page - 1) * ITEMS_PER_PAGE;

  const normalQuery = useProducts({
    limit: 50, // Get a larger set locally to allow advanced client-side filtering (discount, brands, ratings, price, colors, sizes, AI weights)
    skip: 0,
    category: selectedCategory || undefined,
  });

  const searchQueryResults = useSearchProducts({
    query: debouncedQuery,
    limit: 50,
    skip: 0,
  });

  const activeQuery = isSearching ? searchQueryResults : normalQuery;
  const { data, isLoading, error } = activeQuery;

  // Process data with local filtering
  let filteredProducts: Product[] = [];
  if (data?.products) {
    filteredProducts = data.products.filter((p) => {
      // 1. Price Range filter
      if (p.price > priceRange) return false;

      // 2. Brand filter
      if (selectedBrands.length > 0 && p.brand && !selectedBrands.includes(p.brand)) return false;

      // 3. Rating filter
      if (p.rating < minRating) return false;

      // 4. In Stock filter
      if (onlyInStock && p.stock <= 0) return false;

      // 5. Discount filter
      if (p.discountPercentage < minDiscount) return false;

      // 6. Colors/Sizes (mock match logic)
      if (selectedColors.length > 0) {
        const itemColor = MOCK_COLORS[p.id % MOCK_COLORS.length];
        if (!selectedColors.includes(itemColor)) return false;
      }
      if (selectedSizes.length > 0) {
        const itemSize = MOCK_SIZES[p.id % MOCK_SIZES.length];
        if (!selectedSizes.includes(itemSize)) return false;
      }

      // 7. AI Smart Filters Override / Filter
      if (activeSmartFilter) {
        if (activeSmartFilter === 'best-performance' && p.rating < 4.5) return false;
        if (activeSmartFilter === 'best-value' && (p.price > 400 || p.discountPercentage < 10)) return false;
        if (activeSmartFilter === 'students' && p.price > 300) return false;
        if (activeSmartFilter === 'premium' && p.price < 500) return false;
        if (activeSmartFilter === 'eco' && p.id % 4 !== 0) return false; // simulated Eco-Friendly
        if (activeSmartFilter === 'popular' && p.rating < 4.2) return false;
        if (activeSmartFilter === 'newest-ai' && p.id % 3 !== 0) return false;
      }

      return true;
    });

    // Handle Sorting
    filteredProducts = [...filteredProducts].sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating-desc') return b.rating - a.rating;
      if (sortBy === 'best-deals') return b.discountPercentage - a.discountPercentage;
      if (sortBy === 'newest') return b.id - a.id; // simulation for newest
      if (sortBy === 'ai-recommended') {
        const matchA = getAiMatchScore(a);
        const matchB = getAiMatchScore(b);
        return matchB - matchA;
      }
      // default: popularity
      return b.rating * b.stock - a.rating * a.stock;
    });
  }

  // Paginate local results
  const totalProducts = filteredProducts.length;
  const paginatedProducts = filteredProducts.slice(skip, skip + ITEMS_PER_PAGE);
  const totalPages = Math.ceil(totalProducts / ITEMS_PER_PAGE);

  // Extract unique brands for the filter sidebar
  const uniqueBrands = Array.from(
    new Set(data?.products?.map((p) => p.brand).filter(Boolean) || [])
  ) as string[];

  // Dynamic AI Match Score generator based on product traits and search context
  const getAiMatchScore = (product: Product) => {
    let score = 75; // base
    if (product.rating > 4.5) score += 12;
    if (product.discountPercentage > 12) score += 8;
    if (product.price < 500) score += 5;
    // Context additions
    if (debouncedQuery.toLowerCase().includes('laptop') && product.category.includes('laptop')) score += 15;
    if (debouncedQuery.toLowerCase().includes('phone') && product.category.includes('phone')) score += 15;
    
    // Normalize to max 99%
    return Math.min(99, Math.max(70, score));
  };

  const handleFavoriteClick = (productId: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      router.push(`/login?redirect=${encodeURIComponent('/products')}`);
      return;
    }
    toggleFavorite(productId);
  };

  const saveCompareList = (list: Product[]) => {
    try {
      localStorage.setItem('shopilot_compare', JSON.stringify(list));
      setCompareProducts(list);
      window.dispatchEvent(new Event('shopilot_compare_update'));
    } catch (e) {
      console.error(e);
    }
  };

  const handleCompareToggle = (product: Product) => {
    const exists = compareProducts.some((p) => p.id === product.id);
    let updated: Product[];
    if (exists) {
      updated = compareProducts.filter((p) => p.id !== product.id);
    } else {
      if (compareProducts.length >= 3) {
        updated = [...compareProducts.slice(1), product];
      } else {
        updated = [...compareProducts, product];
      }
    }
    saveCompareList(updated);
  };

  const addToCartMock = (product: Product) => {
    try {
      const cartData = localStorage.getItem('shopilot_cart');
      let cartItems: any[] = cartData ? JSON.parse(cartData) : [];
      const existingItemIndex = cartItems.findIndex((item: any) => item.product.id === product.id);
      if (existingItemIndex > -1) {
        cartItems[existingItemIndex].quantity += 1;
      } else {
        cartItems.push({
          product,
          quantity: 1,
          variant: 'Standard / Default'
        });
      }
      localStorage.setItem('shopilot_cart', JSON.stringify(cartItems));
      window.dispatchEvent(new Event('shopilot_cart_update'));
      setCartFeedback(`Added "${product.title}" to Cart!`);
    } catch (e) {
      console.error('Failed to update cart:', e);
      setCartFeedback('Failed to add to cart.');
    }
    setTimeout(() => setCartFeedback(null), 2500);
  };

  const triggerSearchPreset = (preset: string) => {
    setSearchQuery(preset);
    setDebouncedQuery(preset);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 relative">
      <Navbar />
      {/* Flying Dots Overlay */}
      {flyingDotsOverlay}

      {/* Cart Toast Feedback */}
      {cartFeedback && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-[#3b42c4] text-white text-xs font-bold px-5 py-3 rounded-full shadow-lg flex items-center gap-2 animate-bounce">
          <ShoppingCart className="w-4 h-4" />
          <span>{cartFeedback}</span>
        </div>
      )}

      {/* Large AI-Powered Search Banner */}
      <section className="relative overflow-hidden pt-12 pb-10 bg-white border-b border-slate-200/60">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-50/40 rounded-full blur-3xl -z-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-8">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 border border-indigo-100 text-[#3b42c4] rounded-full text-[10px] font-bold uppercase tracking-wider mb-4">
              ✦ ShoPilot Search Engine
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-none">
              Smart Catalog Search
            </h1>
            <p className="text-slate-500 mt-2.5 text-sm sm:text-base leading-relaxed">
              Use standard queries or ask our AI engine directly to target your perfect match.
            </p>
          </div>

          {/* AI Search Box */}
          <div className="max-w-2xl mx-auto">
            <div className="relative flex items-center bg-slate-50 hover:bg-slate-100/60 border border-slate-200 focus-within:bg-white focus-within:border-[#3b42c4] focus-within:ring-2 focus-within:ring-indigo-100 rounded-2xl p-2 transition-all">
              <Sparkles className="w-5 h-5 text-[#3b42c4] ml-3 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Find a lightweight laptop under $900..."
                className="w-full bg-transparent text-slate-800 placeholder-slate-400 pl-3 pr-10 py-2 outline-none text-sm font-semibold"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Example Presets */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
              <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mr-1">AI Try:</span>
              {[
                'Find a lightweight laptop under $900',
                'High rating phones',
                'Best deals this week'
              ].map((preset) => (
                <button
                  key={preset}
                  onClick={() => triggerSearchPreset(preset)}
                  className="text-xs px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200/50 text-slate-600 hover:text-slate-850 rounded-xl transition-all cursor-pointer font-medium"
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Catalog View Container */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        
        {/* AI Recommendations Banner based on History */}
        <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 mb-8 relative overflow-hidden shadow-md">
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="max-w-xl">
              <div className="flex items-center gap-2 mb-2 text-indigo-300">
                <Sparkles className="w-4.5 h-4.5 animate-pulse" />
                <span className="text-xs font-black uppercase tracking-wider">AI Companion Recs</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight leading-tight">
                Based on your browsing history, we think you'll love these.
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm mt-1.5 leading-relaxed">
                Our algorithm evaluated 24 metrics including views, matches, and items added to wishlists.
              </p>
            </div>
            <button
              onClick={() => {
                setSortBy('ai-recommended');
                setActiveSmartFilter('premium');
              }}
              className="px-5 py-2.5 bg-white text-indigo-950 hover:bg-slate-100 rounded-xl text-xs font-bold transition-all shadow-sm shrink-0 flex items-center gap-1.5 cursor-pointer"
            >
              <span>Verify Recommendations</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* AI Smart Filters Area ("Help me choose") */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Info className="w-4 h-4 text-indigo-500" />
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-500">AI Smart Filters ("Help me choose")</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'best-value', label: 'Best Value', icon: DollarSign, color: 'text-emerald-600 bg-emerald-50 border-emerald-100 hover:bg-emerald-100' },
              { id: 'best-performance', label: 'Best Performance', icon: Zap, color: 'text-amber-600 bg-amber-50 border-amber-100 hover:bg-amber-100' },
              { id: 'students', label: 'Best for Students', icon: GraduationCap, color: 'text-indigo-600 bg-indigo-50 border-indigo-100 hover:bg-indigo-100' },
              { id: 'premium', label: 'Premium Picks', icon: Award, color: 'text-purple-600 bg-purple-50 border-purple-100 hover:bg-purple-100' },
              { id: 'eco', label: 'Eco Friendly', icon: Leaf, color: 'text-green-600 bg-green-50 border-green-100 hover:bg-green-100' },
              { id: 'popular', label: 'Most Popular', icon: Flame, color: 'text-rose-600 bg-rose-50 border-rose-100 hover:bg-rose-100' },
              { id: 'newest-ai', label: 'Newest Recommendation', icon: Sparkles, color: 'text-cyan-600 bg-cyan-50 border-cyan-100 hover:bg-cyan-100' }
            ].map((filter) => {
              const active = activeSmartFilter === filter.id;
              const Icon = filter.icon;
              return (
                <button
                  key={filter.id}
                  onClick={() => setActiveSmartFilter(active ? null : filter.id)}
                  className={`flex items-center gap-1.5 px-4 py-2 border rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    active 
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                      : filter.color
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{filter.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Filters Sidebar */}
          <aside className="lg:col-span-1 bg-white border border-slate-200/60 p-6 rounded-3xl shadow-sm h-fit space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <span className="font-extrabold text-slate-800 text-sm tracking-wide uppercase flex items-center gap-1.5">
                <SlidersHorizontal className="w-4 h-4 text-slate-500" />
                Filters
              </span>
              {(selectedCategory || selectedBrands.length > 0 || minRating > 0 || onlyInStock || minDiscount > 0 || selectedColors.length > 0 || selectedSizes.length > 0 || activeSmartFilter) && (
                <button
                  onClick={() => {
                    setSelectedCategory('');
                    setSelectedBrands([]);
                    setMinRating(0);
                    setOnlyInStock(false);
                    setMinDiscount(0);
                    setSelectedColors([]);
                    setSelectedSizes([]);
                    setActiveSmartFilter(null);
                    setPriceRange(2000);
                  }}
                  className="text-[10px] font-black text-rose-500 hover:text-rose-600 uppercase tracking-wider cursor-pointer"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Price Slider */}
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                Price Cap: <span className="text-[#3b42c4] font-black">${priceRange}</span>
              </label>
              <input
                type="range"
                min="10"
                max="2000"
                step="20"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#3b42c4]"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-bold mt-1">
                <span>$10</span>
                <span>$2,000</span>
              </div>
            </div>

            {/* Categories */}
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Category</label>
              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-2 scrollbar-none">
                <button
                  onClick={() => setSelectedCategory('')}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    selectedCategory === ''
                      ? 'bg-indigo-50 text-[#3b42c4] font-bold border-l-2 border-[#3b42c4]'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                  }`}
                >
                  All Products
                </button>
                {isCategoriesLoading ? (
                  <div className="flex items-center gap-2 px-3 py-1.5 text-xs text-slate-400">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span>Loading...</span>
                  </div>
                ) : (
                  categories?.map((cat) => {
                    const active = selectedCategory === cat.slug;
                    return (
                      <button
                        key={cat.slug}
                        onClick={() => setSelectedCategory(cat.slug)}
                        className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          active
                            ? 'bg-indigo-50 text-[#3b42c4] font-bold border-l-2 border-[#3b42c4]'
                            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                        }`}
                      >
                        {cat.name}
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* Brands Checkboxes */}
            {uniqueBrands.length > 0 && (
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Brands</label>
                <div className="space-y-2 max-h-40 overflow-y-auto pr-2 scrollbar-none">
                  {uniqueBrands.map((brand) => {
                    const isChecked = selectedBrands.includes(brand);
                    return (
                      <label key={brand} className="flex items-center gap-2 text-xs font-medium text-slate-600 cursor-pointer hover:text-slate-800">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            setSelectedBrands((prev) =>
                              isChecked ? prev.filter((b) => b !== brand) : [...prev, brand]
                            );
                          }}
                          className="rounded border-slate-300 text-[#3b42c4] focus:ring-[#3b42c4]"
                        />
                        <span>{brand}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Rating Stars Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Minimum Rating</label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((stars) => (
                  <button
                    key={stars}
                    onClick={() => setMinRating(stars === minRating ? 0 : stars)}
                    className="p-1 hover:scale-110 transition-transform cursor-pointer"
                  >
                    <Star className={`w-5 h-5 ${stars <= minRating ? 'text-amber-500 fill-current' : 'text-slate-200'}`} />
                  </button>
                ))}
                {minRating > 0 && <span className="text-[10px] text-slate-400 font-bold ml-1">{minRating}+ Stars</span>}
              </div>
            </div>

            {/* Availability */}
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Availability</label>
              <label className="flex items-center gap-2 text-xs font-medium text-slate-600 cursor-pointer hover:text-slate-800">
                <input
                  type="checkbox"
                  checked={onlyInStock}
                  onChange={(e) => setOnlyInStock(e.target.checked)}
                  className="rounded border-slate-300 text-[#3b42c4] focus:ring-[#3b42c4]"
                />
                <span>In Stock only</span>
              </label>
            </div>

            {/* Discount Filter */}
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Discount percentage</label>
              <div className="flex gap-2">
                {[0, 5, 10, 15].map((disc) => (
                  <button
                    key={disc}
                    onClick={() => setMinDiscount(disc)}
                    className={`flex-1 py-1 border text-xs font-semibold rounded-lg transition-all ${
                      minDiscount === disc
                        ? 'bg-[#3b42c4] border-[#3b42c4] text-white'
                        : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    {disc === 0 ? 'Any' : `${disc}%+`}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Filters */}
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Colors</label>
              <div className="flex flex-wrap gap-1.5">
                {MOCK_COLORS.map((col) => {
                  const isSel = selectedColors.includes(col);
                  return (
                    <button
                      key={col}
                      onClick={() => {
                        setSelectedColors(prev => isSel ? prev.filter(c => c !== col) : [...prev, col]);
                      }}
                      className={`text-[10px] px-2.5 py-1 border rounded-lg font-semibold transition-all ${
                        isSel ? 'bg-[#3b42c4] border-[#3b42c4] text-white' : 'bg-slate-50 border-slate-200 text-slate-500'
                      }`}
                    >
                      {col}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Size Filters */}
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Size Options</label>
              <div className="flex flex-wrap gap-1.5">
                {MOCK_SIZES.map((sz) => {
                  const isSel = selectedSizes.includes(sz);
                  return (
                    <button
                      key={sz}
                      onClick={() => {
                        setSelectedSizes(prev => isSel ? prev.filter(s => s !== sz) : [...prev, sz]);
                      }}
                      className={`text-[10px] px-2.5 py-1 border rounded-lg font-semibold transition-all ${
                        isSel ? 'bg-[#3b42c4] border-[#3b42c4] text-white' : 'bg-slate-50 border-slate-200 text-slate-500'
                      }`}
                    >
                      {sz}
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* Right Product Grid Column */}
          <section className="lg:col-span-3 space-y-6">
            
            {/* Sort & Stats Header */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border border-slate-200/60 px-5 py-3 rounded-2xl shadow-sm">
              <span className="text-xs font-bold text-slate-500">
                Found <span className="text-slate-800 font-black">{totalProducts}</span> matching items
              </span>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <span className="text-xs font-bold text-slate-400 shrink-0 uppercase tracking-wide">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full sm:w-48 bg-slate-50 border border-slate-200 text-slate-700 focus:border-[#3b42c4] rounded-xl px-3 py-2 outline-none transition-all text-xs font-bold cursor-pointer"
                >
                  <option value="popularity">Popularity</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="newest">Newest Catalog Items</option>
                  <option value="rating-desc">Highest Rated First</option>
                  <option value="ai-recommended">AI Match Recommended</option>
                  <option value="best-deals">Best Discount Deals</option>
                </select>
              </div>
            </div>

            {/* Grid & Load States */}
            {error ? (
              <div className="text-center py-16 bg-red-50 border border-red-200 rounded-3xl px-6 flex flex-col items-center">
                <ShieldAlert className="w-8 h-8 text-red-500 mb-2" />
                <p className="text-red-600 font-bold">Failed to load items.</p>
                <p className="text-slate-400 text-xs mt-1">Check NIM API Keys or local connectivity settings.</p>
              </div>
            ) : isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white border border-slate-200/60 rounded-3xl p-5 flex flex-col h-[440px] animate-pulse">
                    <div className="w-full aspect-[4/3] bg-slate-100 rounded-2xl mb-4" />
                    <div className="h-4 bg-slate-100 rounded-md w-1/3 mb-2" />
                    <div className="h-5 bg-slate-100 rounded-md w-3/4 mb-4" />
                    <div className="h-4 bg-slate-100 rounded-md w-1/2 mb-auto" />
                    <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                      <div className="h-6 bg-slate-100 rounded-md w-1/4" />
                      <div className="h-9 bg-slate-100 rounded-md w-20" />
                    </div>
                  </div>
                ))}
              </div>
            ) : paginatedProducts.length === 0 ? (
              <div className="text-center py-20 bg-white border border-slate-200 rounded-3xl shadow-sm">
                <ShoppingBag className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-slate-500 text-sm font-semibold">No catalog items matched those filter choices.</p>
                <p className="text-slate-400 text-xs mt-1">Try relaxing some rating, price, or brand selectors.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {paginatedProducts.map((product) => {
                    const matchScore = getAiMatchScore(product);
                    const originalPrice = product.discountPercentage 
                      ? (product.price / (1 - product.discountPercentage / 100)).toFixed(2)
                      : null;
                    const isFav = isFavorite(product.id);
                    const compareSelected = compareProducts.some((p) => p.id === product.id);

                    return (
                      <div 
                        key={product.id} 
                        onClick={() => router.push(`/products/${product.id}`)}
                        className="group relative bg-white border border-slate-200/60 hover:border-slate-300 rounded-3xl p-5 flex flex-col h-[445px] transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
                      >
                        
                        {/* Image Container */}
                        <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-slate-50 mb-4 border border-slate-100">
                          <img
                            src={product.thumbnail}
                            alt={product.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                          />

                          {/* AI Match Badge */}
                          <span className="absolute top-3 left-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                            <Sparkles className="w-2.5 h-2.5 fill-current" />
                            {matchScore}% Match
                          </span>

                          {/* Favorite Button */}
                          <button
                            onClick={(e) => handleFavoriteClick(product.id, e)}
                            className={`absolute top-3 right-3 p-2 rounded-xl border transition-all duration-200 cursor-pointer ${
                              isFav
                                ? 'bg-rose-50 border-rose-200 text-rose-500'
                                : 'bg-white/80 backdrop-blur-sm border-slate-200 text-slate-400 hover:text-slate-600'
                            }`}
                          >
                            <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                          </button>

                          {/* Discount % Badge */}
                          {product.discountPercentage > 0 && (
                            <span className="absolute bottom-3 left-3 bg-emerald-500 text-white text-[10px] font-black px-2 py-0.5 rounded-md">
                              -{Math.round(product.discountPercentage)}%
                            </span>
                          )}
                        </div>

                        {/* Metadata */}
                        <div className="flex flex-col flex-1">
                          <div className="flex items-center justify-between text-[11px] mb-2">
                            <span className="text-slate-400 font-bold truncate max-w-[60%]">{product.brand || 'Generic'}</span>
                            <div className="flex items-center gap-0.5 text-amber-500 bg-amber-50 border border-amber-100 px-1.5 py-0.5 rounded-lg">
                              <Star className="w-3 h-3 fill-current" />
                              <span className="font-extrabold text-[10px]">{product.rating.toFixed(1)}</span>
                            </div>
                          </div>

                          <h3 
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/products/${product.id}`);
                            }}
                            className="text-sm font-black text-slate-800 line-clamp-1 leading-snug hover:text-[#3b42c4] transition-colors cursor-pointer"
                          >
                            {product.title}
                          </h3>
                          <p className="text-[11px] text-slate-400 font-medium mt-0.5 line-clamp-2">
                            {product.description || 'No description available for this item.'}
                          </p>

                          {/* Action & Price Bottom Row */}
                          <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                            <div className="flex flex-col">
                              <span className="text-base font-black text-slate-900">${product.price.toFixed(2)}</span>
                              {originalPrice && (
                                <span className="text-[10px] text-slate-400 line-through">${originalPrice}</span>
                              )}
                            </div>

                            <div className="flex items-center gap-1.5">
                              {/* Quick View Button */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setQuickViewProduct(product);
                                }}
                                title="Quick View"
                                className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-500 rounded-xl transition-all cursor-pointer"
                              >
                                <Eye className="w-4 h-4" />
                              </button>

                              {/* Compare Toggle */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCompareToggle(product);
                                }}
                                title={compareSelected ? 'Remove Comparison' : 'Add to Compare'}
                                className={`p-2 border rounded-xl transition-all cursor-pointer ${
                                  compareSelected 
                                    ? 'bg-indigo-50 border-indigo-200 text-[#3b42c4]' 
                                    : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-600'
                                }`}
                              >
                                <ArrowRightLeft className="w-4 h-4" />
                              </button>

                              {/* Add to Cart */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  animateCartAdd(e, () => addToCartMock(product));
                                }}
                                title="Add to Cart"
                                className="p-2 bg-slate-900 hover:bg-slate-855 text-white rounded-xl transition-all cursor-pointer"
                              >
                                <ShoppingCart className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-12 pt-6 border-t border-slate-200/60">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 rounded-xl text-xs font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Previous</span>
                    </button>

                    <span className="text-xs font-semibold text-slate-500">
                      Page <span className="text-[#3b42c4] font-bold">{page}</span> of {totalPages}
                    </span>

                    <button
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 rounded-xl text-xs font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <span>Next</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      </main>

      {/* Comparison Drawer */}
      {compareProducts.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[90%] max-w-2xl bg-white/95 border border-slate-200 shadow-xl rounded-2xl p-4 flex items-center justify-between gap-4 animate-slideUp backdrop-blur-sm">
          <div className="flex items-center gap-3 overflow-x-auto scrollbar-none py-1">
            <div className="w-8 h-8 bg-indigo-50 rounded-xl flex items-center justify-center text-[#3b42c4]">
              <ArrowRightLeft className="w-4 h-4" />
            </div>
            {compareProducts.map((p) => (
              <div key={p.id} className="relative flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl shrink-0">
                <img src={p.thumbnail} alt={p.title} className="w-7 h-7 object-cover bg-white rounded-lg" />
                <span className="text-xs font-bold text-slate-700 max-w-[100px] truncate">{p.title}</span>
                <button
                  onClick={() => saveCompareList(compareProducts.filter((item) => item.id !== p.id))}
                  className="text-slate-400 hover:text-rose-500 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={() => setIsComparisonOpen(true)}
            disabled={compareProducts.length < 2}
            className="px-4 py-2.5 bg-[#3b42c4] hover:bg-[#2d33a6] disabled:bg-slate-100 disabled:text-slate-400 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer disabled:cursor-not-allowed shrink-0"
          >
            Compare Specs
          </button>
        </div>
      )}

      {/* Comparison Modal */}
      {isComparisonOpen && compareProducts.length >= 2 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white border border-slate-200 shadow-2xl rounded-[24px] w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <ProductComparison
              productA={compareProducts[0]}
              productB={compareProducts[1]}
              onClose={() => setIsComparisonOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Inline Quick View Modal */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white border border-slate-200 shadow-2xl rounded-3xl max-w-2xl w-full p-6 relative overflow-hidden flex flex-col sm:flex-row gap-6">
            <button
              onClick={() => setQuickViewProduct(null)}
              className="absolute top-4 right-4 p-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-500 hover:text-slate-800 transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="w-full sm:w-1/2 aspect-square bg-slate-50 rounded-2xl overflow-hidden border border-slate-100">
              <img src={quickViewProduct.thumbnail} alt={quickViewProduct.title} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">{quickViewProduct.category}</span>
                <h3 className="text-lg font-black text-slate-800 mt-1 mb-2">{quickViewProduct.title}</h3>
                <div className="flex items-center gap-1.5 mb-4">
                  <div className="flex items-center gap-0.5 text-amber-500 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200/50">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span className="font-extrabold text-xs">{quickViewProduct.rating.toFixed(1)}</span>
                  </div>
                  <span className="text-xs text-slate-400 font-semibold">{quickViewProduct.stock} left in stock</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">{quickViewProduct.description}</p>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <span className="text-xl font-black text-slate-900">${quickViewProduct.price.toFixed(2)}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    animateCartAdd(e, () => addToCartMock(quickViewProduct));
                    setQuickViewProduct(null);
                  }}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-850 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
        <Loader2 className="w-8 h-8 text-[#3b42c4] animate-spin" />
        <p className="text-slate-500 font-semibold text-sm">Loading products catalog...</p>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}
