'use client';

import React from 'react';
import useCategories from '@/hooks/useCategories';
import { LayoutGrid, Check } from 'lucide-react';

interface CategoryFilterProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export default function CategoryFilter({
  selectedCategory,
  onSelectCategory,
}: CategoryFilterProps) {
  const { data: categories = [], isLoading, error } = useCategories();

  if (error) return null;

  return (
    <div className="w-full">
      <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4 px-3">
        Categories
      </h3>

      {isLoading ? (
        <div className="space-y-2">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="h-9 w-full bg-slate-100 border border-slate-200/60 animate-pulse rounded-xl"
            />
          ))}
        </div>
      ) : (
        <div className="space-y-1.5 flex flex-row overflow-x-auto pb-4 md:pb-0 md:overflow-x-visible md:flex-col gap-2 md:gap-1.5 scrollbar-none">
          {/* "All Products" Button */}
          <button
            onClick={() => onSelectCategory('')}
            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer shrink-0 ${
              selectedCategory === ''
                ? 'bg-[#3b42c4] text-white shadow-sm'
                : 'bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-800'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span>All Products</span>
            {selectedCategory === '' && <Check className="w-3.5 h-3.5 ml-auto hidden md:block" />}
          </button>

          {/* Categories Loop */}
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.slug;
            return (
              <button
                key={cat.slug}
                onClick={() => onSelectCategory(cat.slug)}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer shrink-0 ${
                  isSelected
                    ? 'bg-[#3b42c4] text-white shadow-sm'
                    : 'bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-800'
                }`}
              >
                <span className="truncate max-w-[150px]">{cat.name}</span>
                {isSelected && <Check className="w-3.5 h-3.5 ml-auto hidden md:block" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
