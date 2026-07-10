'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CategoryFilter from '@/components/product/CategoryFilter';
import ProductCard from '@/components/product/ProductCard';
import ProductComparison from '@/components/product/ProductComparison';
import { ProductCardSkeleton } from '@/components/ui/Skeleton';
import useProducts from '@/hooks/useProducts';
import useSearchProducts from '@/hooks/useSearchProducts';
import { Product } from '@/types';
import { Search, ChevronLeft, ChevronRight, SlidersHorizontal, ArrowRightLeft, X, Sparkles, Loader2 } from 'lucide-react';

const ITEMS_PER_PAGE = 8;

function ProductsContent() {
  const searchParams = useSearchParams();
  
  // Initialize category from query param if present
  const initialCategory = searchParams?.get('category') || '';
  const initialQuery = searchParams?.get('query') || '';

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState('');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(1);

  // Sync with searchParams when they change
  useEffect(() => {
    const category = searchParams?.get('category') || '';
    const query = searchParams?.get('query') || '';
    setSelectedCategory(category);
    setSearchQuery(query);
    setDebouncedQuery(query);
    setPage(1);
  }, [searchParams]);

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
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 relative">
      <Navbar />

      {/* Hero section */}
      <section className="relative overflow-hidden py-10 bg-white border-b border-slate-100">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-50/30 rounded-full blur-3xl -z-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 border border-indigo-100 text-[#3b42c4] rounded-full text-[10px] font-bold uppercase tracking-wider mb-3">
            ✦ Browse Catalog
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Explore All Products
          </h1>
          <p className="text-slate-500 mt-2 text-sm sm:text-base max-w-2xl leading-relaxed">
            Find the best items, compare specs, and discover details on standard items.
          </p>
        </div>
      </section>

      {/* Main Browse Shell */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        
        {/* Filter Controls Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white border border-slate-200/60 p-4 rounded-2xl mb-8 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
          {/* Search Input */}
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full bg-white border border-slate-200 focus:border-[#3b42c4] focus:ring-1 focus:ring-[#3b42c4] text-slate-800 rounded-xl pl-12 pr-10 py-2.5 outline-none transition-all text-sm font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
            <SlidersHorizontal className="w-4 h-4 text-slate-400 hidden sm:block" />
            <select
              onChange={handleSortChange}
              value={sortBy ? `${sortBy}-${order}` : ''}
              className="w-full md:w-48 bg-white border border-slate-200 text-slate-600 focus:border-[#3b42c4] rounded-xl px-4 py-2.5 outline-none transition-all text-sm font-semibold cursor-pointer"
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
          <aside className="md:col-span-1 border-r border-slate-200/60 pr-0 md:pr-6">
            <CategoryFilter
              selectedCategory={selectedCategory}
              onSelectCategory={handleCategorySelect}
            />
          </aside>

          {/* Right Product Grid */}
          <section className="md:col-span-3">
            {error ? (
              <div className="text-center py-16 bg-red-50 border border-red-200 rounded-2xl px-6">
                <p className="text-red-600 font-bold">Failed to retrieve products.</p>
                <p className="text-slate-400 text-xs mt-1">Please check your internet connection and try again.</p>
              </div>
            ) : isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : !data || data.products.length === 0 ? (
              <div className="text-center py-20 bg-white border border-slate-200 rounded-2xl shadow-sm">
                <p className="text-slate-500 text-sm font-semibold">No products matching your search.</p>
                <p className="text-slate-400 text-xs mt-1">Try refining your keyword or filtering by category.</p>
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

      {/* Sticky Bottom Comparison Shelf */}
      {compareProducts.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[90%] max-w-2xl bg-white/95 border border-slate-200 shadow-xl rounded-2xl p-4 flex items-center justify-between gap-4 animate-slideUp backdrop-blur-sm">
          <div className="flex items-center gap-4 overflow-x-auto scrollbar-none py-1">
            <div className="hidden sm:flex w-9 h-9 bg-indigo-50 rounded-xl items-center justify-center text-[#3b42c4]">
              <ArrowRightLeft className="w-4 h-4" />
            </div>
            
            {compareProducts.map((p) => (
              <div key={p.id} className="relative flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl shrink-0">
                <img
                  src={p.thumbnail}
                  alt={p.title}
                  className="w-7 h-7 object-cover bg-white rounded-lg border border-slate-100"
                />
                <span className="text-xs font-bold text-slate-700 max-w-[100px] truncate">{p.title}</span>
                <button
                  onClick={() => removeCompareProduct(p.id)}
                  className="p-0.5 hover:bg-slate-200 rounded-md text-slate-400 hover:text-rose-500 transition-all cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}

            {compareProducts.length === 1 && (
              <span className="text-xs text-slate-400 italic hidden sm:inline font-semibold">
                Select 1 more item to compare...
              </span>
            )}
          </div>

          <button
            onClick={() => setIsComparisonOpen(true)}
            disabled={compareProducts.length < 2}
            className="shrink-0 flex items-center gap-2 px-4 py-2.5 bg-[#3b42c4] hover:bg-[#2d33a6] disabled:bg-slate-200 text-white disabled:text-slate-400 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer disabled:cursor-not-allowed"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Compare Specs</span>
          </button>
        </div>
      )}

      {/* Comparison Fullscreen Modal */}
      {isComparisonOpen && (
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
