'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CategoryFilter from '@/components/product/CategoryFilter';
import ProductCard from '@/components/product/ProductCard';
import ProductComparison from '@/components/product/ProductComparison';
import { ProductCardSkeleton } from '@/components/ui/Skeleton';
import useProducts from '@/hooks/useProducts';
import useSearchProducts from '@/hooks/useSearchProducts';
import { Product } from '@/types';
import { Search, ChevronLeft, ChevronRight, SlidersHorizontal, ArrowRightLeft, X, Sparkles } from 'lucide-react';

const ITEMS_PER_PAGE = 8;

export default function HomePage() {
  // Query & filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(1);

  // Comparison states
  const [compareProducts, setCompareProducts] = useState<Product[]>([]);
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      setPage(1); // Reset page on new search
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Handle category changes
  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setSearchQuery(''); // Clear search query when category changes
    setDebouncedQuery('');
    setPage(1); // Reset to first page
  };

  // Handle sorting changes
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === '') {
      setSortBy('');
    } else {
      const [field, dir] = value.split('-');
      setSortBy(field);
      setOrder(dir as 'asc' | 'desc');
    }
    setPage(1); // Reset to first page
  };

  // Determine query parameters
  const skip = (page - 1) * ITEMS_PER_PAGE;
  const isSearching = debouncedQuery.trim().length > 0;

  // Custom data queries
  const normalQuery = useProducts({
    limit: ITEMS_PER_PAGE,
    skip,
    category: selectedCategory || undefined,
    sortBy: sortBy || undefined,
    order: sortBy ? order : undefined,
  });

  const searchQueryResults = useSearchProducts({
    query: debouncedQuery,
    limit: ITEMS_PER_PAGE,
    skip,
  });

  // Pick the active query based on search input
  const activeQuery = isSearching ? searchQueryResults : normalQuery;
  const { data, isLoading, error } = activeQuery;

  // Pagination calculation
  const totalProducts = data?.total || 0;
  const totalPages = Math.ceil(totalProducts / ITEMS_PER_PAGE);

  // Compare toggles
  const handleCompareToggle = (product: Product) => {
    setCompareProducts((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        return prev.filter((p) => p.id !== product.id);
      }
      if (prev.length >= 2) {
        // Replace second item if limit reached
        return [prev[0], product];
      }
      return [...prev, product];
    });
  };

  const removeCompareProduct = (id: number) => {
    setCompareProducts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 relative">
      <Navbar />

      {/* Hero section */}
      <section className="relative overflow-hidden py-12 border-b border-slate-900/60 bg-gradient-to-b from-indigo-950/20 via-slate-950 to-slate-950">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
                <Sparkles className="w-3.5 h-3.5 fill-current animate-pulse" /> AI-Driven Commerce
              </span>
              <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
                Discover the Perfect Products
              </h1>
              <p className="text-slate-400 mt-3 text-base sm:text-lg max-w-2xl leading-relaxed">
                Browse our premium catalog, compare items side-by-side, and let our intelligent assistant guide your choices.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Browse Shell */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        
        {/* Filter Controls Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-900/10 border border-slate-900 p-4 rounded-3xl mb-8 backdrop-blur-md">
          {/* Search Input */}
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full bg-slate-950/60 hover:bg-slate-950/90 focus:bg-slate-950 border border-slate-900 focus:border-indigo-500 text-slate-200 rounded-2xl pl-12 pr-4 py-3 outline-none transition-all text-sm placeholder-slate-600"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
            <SlidersHorizontal className="w-4 h-4 text-slate-500 hidden sm:block" />
            <select
              onChange={handleSortChange}
              className="w-full md:w-48 bg-slate-950/60 border border-slate-900 text-slate-300 focus:border-indigo-500 rounded-2xl px-4 py-3 outline-none transition-all text-sm cursor-pointer"
            >
              <option value="">Default Sort</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating-desc">Rating: Highest First</option>
            </select>
          </div>
        </div>

        {/* Content Layout Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Left Category Sidebar */}
          <aside className="md:col-span-1 border-r border-slate-900/60 pr-0 md:pr-6">
            <CategoryFilter
              selectedCategory={selectedCategory}
              onSelectCategory={handleCategorySelect}
            />
          </aside>

          {/* Right Product Grid */}
          <section className="md:col-span-3">
            {error ? (
              <div className="text-center py-16 bg-red-950/10 border border-red-950 rounded-3xl px-6">
                <p className="text-red-400 font-medium">Failed to retrieve products.</p>
                <p className="text-slate-500 text-sm mt-1">Please check your internet connection and try again.</p>
              </div>
            ) : isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : !data || data.products.length === 0 ? (
              <div className="text-center py-20 bg-slate-900/10 border border-slate-900 rounded-3xl">
                <p className="text-slate-400 text-base font-medium">No products matching your search.</p>
                <p className="text-slate-500 text-xs mt-1">Try refining your keyword or filtering by category.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {data.products.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      isComparingSelected={compareProducts.some((p) => p.id === product.id)}
                      onCompareToggle={() => handleCompareToggle(product)}
                      canCompare={compareProducts.length < 2}
                    />
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-12 pt-6 border-t border-slate-900/60">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-900 hover:bg-slate-800/80 border border-slate-800 text-slate-300 rounded-xl text-sm font-semibold transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Previous</span>
                    </button>

                    <span className="text-sm font-medium text-slate-400">
                      Page <span className="text-white font-bold">{page}</span> of {totalPages}
                    </span>

                    <button
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-900 hover:bg-slate-800/80 border border-slate-800 text-slate-300 rounded-xl text-sm font-semibold transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
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

      {/* Sticky Bottom Comparison Shelf */}
      {compareProducts.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[90%] max-w-2xl backdrop-blur-xl bg-slate-900/90 border border-slate-800/90 shadow-2xl rounded-3xl p-4 sm:p-5 flex items-center justify-between gap-4 animate-slideUp">
          <div className="flex items-center gap-4 overflow-x-auto scrollbar-none py-1">
            <div className="hidden sm:flex w-10 h-10 bg-indigo-500/10 rounded-xl items-center justify-center text-indigo-400">
              <ArrowRightLeft className="w-5 h-5 animate-pulse" />
            </div>
            
            {compareProducts.map((p) => (
              <div key={p.id} className="relative flex items-center gap-2 bg-slate-950/80 border border-slate-800 px-3 py-1.5 rounded-2xl shrink-0">
                <img
                  src={p.thumbnail}
                  alt={p.title}
                  className="w-7 h-7 object-cover bg-slate-900 rounded-lg border border-slate-800"
                />
                <span className="text-xs font-semibold text-slate-300 max-w-[100px] truncate">{p.title}</span>
                <button
                  onClick={() => removeCompareProduct(p.id)}
                  className="p-0.5 hover:bg-slate-800 rounded-md text-slate-500 hover:text-rose-400 transition-all cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}

            {compareProducts.length === 1 && (
              <span className="text-xs text-slate-500 italic hidden sm:inline">
                Select 1 more item to compare...
              </span>
            )}
          </div>

          <button
            onClick={() => setIsComparisonOpen(true)}
            disabled={compareProducts.length < 2}
            className="shrink-0 flex items-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white disabled:text-slate-500 rounded-2xl text-xs font-extrabold transition-all duration-200 shadow-lg shadow-indigo-600/10 cursor-pointer disabled:cursor-not-allowed"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Compare Specs</span>
          </button>
        </div>
      )}

      {/* Comparison Fullscreen Modal */}
      {isComparisonOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900/95 border border-slate-800 shadow-2xl rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <ProductComparison
              productA={compareProducts[0]}
              productB={compareProducts[1]}
              onClose={() => setIsComparisonOpen(false)}
            />
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
