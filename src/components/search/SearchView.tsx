import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { ProductCard } from '../product/ProductCard';
import { SortOption } from '../../types/product';
import {
  Search,
  SlidersHorizontal,
  X,
  ArrowUpDown,
  RotateCcw,
  Check,
  Star,
  Sparkles,
} from 'lucide-react';

export const SearchView: React.FC = () => {
  const {
    products,
    categories,
    searchQuery,
    setSearchQuery,
    filters,
    setFilters,
    resetFilters,
    sortOption,
    setSortOption,
    formatPrice,
    currency,
  } = useApp();

  const [showFilterDrawer, setShowFilterDrawer] = useState(false);

  // Extract unique brands
  const brands = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.brand) set.add(p.brand);
    });
    return Array.from(set).sort();
  }, [products]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Text search
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchTitle = p.title.toLowerCase().includes(q);
          const matchBrand = p.brand.toLowerCase().includes(q);
          const matchDesc = p.description.toLowerCase().includes(q);
          const matchCat = p.category.toLowerCase().includes(q);
          if (!matchTitle && !matchBrand && !matchDesc && !matchCat) {
            return false;
          }
        }

        // Category filter
        if (filters.category !== 'all' && p.category !== filters.category) {
          return false;
        }

        // Brand filter
        if (filters.brand !== 'all' && p.brand !== filters.brand) {
          return false;
        }

        // Discount filter
        if (filters.minDiscount > 0 && p.discountPercentage < filters.minDiscount) {
          return false;
        }

        // Rating filter
        if (filters.minRating > 0 && p.rating < filters.minRating) {
          return false;
        }

        // Price filter
        if (p.dealPrice < filters.minPrice || p.dealPrice > filters.maxPrice) {
          return false;
        }

        // Prime filter
        if (filters.onlyPrime && !p.primeEligible) {
          return false;
        }

        // Only deals
        if (filters.onlyDeals && !p.isDeal && !p.isLightningDeal) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        switch (sortOption) {
          case 'price-asc':
            return a.dealPrice - b.dealPrice;
          case 'price-desc':
            return b.dealPrice - a.dealPrice;
          case 'highest-discount':
            return b.discountPercentage - a.discountPercentage;
          case 'highest-rated':
            return b.rating - a.rating;
          case 'newest':
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          case 'popular':
          default:
            return (b.clicksCount || 0) + (b.reviewCount || 0) - ((a.clicksCount || 0) + (a.reviewCount || 0));
        }
      });
  }, [products, searchQuery, filters, sortOption]);

  const activeFilterCount = [
    filters.category !== 'all',
    filters.brand !== 'all',
    filters.minDiscount > 0,
    filters.minRating > 0,
    filters.maxPrice < 200000,
    filters.onlyPrime,
    filters.onlyDeals,
  ].filter(Boolean).length;

  return (
    <div className="space-y-4 pb-20">
      {/* Search Input Bar */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search products by title, brand, or keywords..."
          className="w-full h-12 pl-11 pr-10 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm focus:outline-none focus:border-[#FF9900] shadow-xs text-gray-900 dark:text-gray-100 placeholder-gray-400"
          autoFocus={false}
        />
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xs p-1"
          >
            ✕
          </button>
        )}
      </div>

      {/* Suggested Quick Search Chips */}
      {!searchQuery && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs text-gray-500">
          <span className="font-semibold text-gray-400 shrink-0">Popular:</span>
          {['Sony Headphones', 'iPhone 15', 'MacBook Air', 'Instant Pot', 'Fitbit', 'GaN Charger'].map(
            (term) => (
              <button
                key={term}
                onClick={() => setSearchQuery(term)}
                className="px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 shrink-0 transition-colors"
              >
                {term}
              </button>
            )
          )}
        </div>
      )}

      {/* Control Bar: Sort & Filter Toggle */}
      <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-white dark:bg-gray-850 border border-gray-200/80 dark:border-gray-800">
        {/* Sort Select */}
        <div className="flex items-center gap-1.5 text-xs">
          <ArrowUpDown size={14} className="text-gray-400 shrink-0" />
          <span className="text-gray-500 hidden sm:inline">Sort:</span>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as SortOption)}
            className="bg-transparent font-semibold text-gray-800 dark:text-gray-200 focus:outline-none cursor-pointer py-1"
          >
            <option value="popular">Most Popular</option>
            <option value="newest">Newest Deals</option>
            <option value="highest-discount">Highest Discount</option>
            <option value="highest-rated">Highest Rated</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>

        {/* Filter Drawer Button */}
        <button
          onClick={() => setShowFilterDrawer(true)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            activeFilterCount > 0
              ? 'bg-[#FF9900] text-[#111111] shadow-xs'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200'
          }`}
        >
          <SlidersHorizontal size={14} />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-black text-white text-[10px]">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Active Filter Chips */}
      {activeFilterCount > 0 && (
        <div className="flex items-center gap-2 flex-wrap text-xs">
          {filters.category !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FF9900]/15 text-[#111111] dark:text-[#FF9900] border border-[#FF9900]/30 font-semibold">
              Category: {filters.category}
              <button
                onClick={() => setFilters((f) => ({ ...f, category: 'all' }))}
                className="hover:text-red-600"
              >
                ×
              </button>
            </span>
          )}

          {filters.brand !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FF9900]/15 text-[#111111] dark:text-[#FF9900] border border-[#FF9900]/30 font-semibold">
              Brand: {filters.brand}
              <button
                onClick={() => setFilters((f) => ({ ...f, brand: 'all' }))}
                className="hover:text-red-600"
              >
                ×
              </button>
            </span>
          )}

          {filters.minDiscount > 0 && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#CC0C39]/15 text-[#CC0C39] border border-[#CC0C39]/30 font-semibold">
              {filters.minDiscount}%+ Discount
              <button
                onClick={() => setFilters((f) => ({ ...f, minDiscount: 0 }))}
                className="hover:text-red-600"
              >
                ×
              </button>
            </span>
          )}

          {filters.minRating > 0 && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 font-semibold">
              {filters.minRating}★ & Above
              <button
                onClick={() => setFilters((f) => ({ ...f, minRating: 0 }))}
                className="hover:text-red-600"
              >
                ×
              </button>
            </span>
          )}

          <button
            onClick={resetFilters}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xs font-semibold flex items-center gap-1"
          >
            <RotateCcw size={12} /> Clear all
          </button>
        </div>
      )}

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 px-1">
        <span>
          Found <strong>{filteredProducts.length}</strong> products
          {searchQuery ? ` for "${searchQuery}"` : ''}
        </span>
      </div>

      {/* Grid of Results */}
      {filteredProducts.length === 0 ? (
        <div className="py-16 text-center bg-white dark:bg-gray-850 rounded-2xl border border-gray-200/80 dark:border-gray-800 p-8">
          <Search size={40} className="mx-auto text-gray-300 dark:text-gray-600 mb-3" />
          <h3 className="text-base font-bold text-gray-900 dark:text-white">
            No matching products found
          </h3>
          <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search query, clearing filters, or browsing other categories.
          </p>
          <button
            onClick={resetFilters}
            className="mt-4 px-4 py-2 rounded-xl bg-[#FF9900] text-[#111111] font-bold text-xs"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
          {filteredProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}

      {/* Filters Modal / Slide-over Drawer */}
      {showFilterDrawer && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="fixed inset-0"
            onClick={() => setShowFilterDrawer(false)}
          />

          <div className="relative w-full max-w-md bg-white dark:bg-gray-900 h-full shadow-2xl flex flex-col z-10 overflow-hidden border-l border-gray-200 dark:border-gray-800">
            {/* Header */}
            <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
              <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <SlidersHorizontal size={18} className="text-[#FF9900]" />
                Filter Products
              </h2>
              <button
                onClick={() => setShowFilterDrawer(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            {/* Filter Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-5">
              {/* Category Filter */}
              <div>
                <label className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider block mb-2">
                  Category
                </label>
                <div className="grid grid-cols-2 gap-1.5 text-xs">
                  <button
                    onClick={() => setFilters((f) => ({ ...f, category: 'all' }))}
                    className={`p-2 rounded-lg text-left transition-colors font-medium ${
                      filters.category === 'all'
                        ? 'bg-[#FF9900] text-[#111111] font-bold'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    All Categories
                  </button>
                  {categories.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setFilters((f) => ({ ...f, category: c.id }))}
                      className={`p-2 rounded-lg text-left transition-colors font-medium truncate ${
                        filters.category === c.id
                          ? 'bg-[#FF9900] text-[#111111] font-bold'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {c.icon} {c.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Discount Filter */}
              <div>
                <label className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider block mb-2">
                  Minimum Discount
                </label>
                <div className="flex items-center gap-2">
                  {[0, 20, 30, 50, 70].map((disc) => (
                    <button
                      key={disc}
                      onClick={() => setFilters((f) => ({ ...f, minDiscount: disc }))}
                      className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${
                        filters.minDiscount === disc
                          ? 'bg-[#CC0C39] text-white'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {disc === 0 ? 'Any' : `${disc}%+`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Customer Rating Filter */}
              <div>
                <label className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider block mb-2">
                  Customer Rating
                </label>
                <div className="flex items-center gap-2">
                  {[0, 3, 4, 4.5].map((rate) => (
                    <button
                      key={rate}
                      onClick={() => setFilters((f) => ({ ...f, minRating: rate }))}
                      className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1 ${
                        filters.minRating === rate
                          ? 'bg-amber-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {rate === 0 ? 'All' : `${rate}★+`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Brand Filter */}
              <div>
                <label className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider block mb-2">
                  Brand
                </label>
                <select
                  value={filters.brand}
                  onChange={(e) => setFilters((f) => ({ ...f, brand: e.target.value }))}
                  className="w-full p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-800 dark:text-gray-200"
                >
                  <option value="all">All Brands</option>
                  {brands.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              {/* Max Price Range */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                    Max Price
                  </label>
                  <span className="text-xs font-extrabold text-[#FF9900]">
                    {filters.maxPrice >= 200000 ? 'Any' : formatPrice(filters.maxPrice)}
                  </span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="200000"
                  step="500"
                  value={filters.maxPrice}
                  onChange={(e) =>
                    setFilters((f) => ({ ...f, maxPrice: Number(e.target.value) }))
                  }
                  className="w-full accent-[#FF9900] cursor-pointer"
                />
              </div>

              {/* Quick Toggles */}
              <div className="space-y-2 pt-2 border-t border-gray-100 dark:border-gray-800">
                <label className="flex items-center gap-2.5 text-xs font-semibold cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={filters.onlyPrime}
                    onChange={(e) =>
                      setFilters((f) => ({ ...f, onlyPrime: e.target.checked }))
                    }
                    className="w-4 h-4 rounded text-[#FF9900] accent-[#FF9900]"
                  />
                  <span>Amazon Prime Eligible Only</span>
                </label>

                <label className="flex items-center gap-2.5 text-xs font-semibold cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={filters.onlyDeals}
                    onChange={(e) =>
                      setFilters((f) => ({ ...f, onlyDeals: e.target.checked }))
                    }
                    className="w-4 h-4 rounded text-[#FF9900] accent-[#FF9900]"
                  />
                  <span>Limited Time Deals Only</span>
                </label>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="p-4 border-t border-gray-100 dark:border-gray-800 flex items-center gap-3 bg-gray-50 dark:bg-gray-900">
              <button
                onClick={resetFilters}
                className="flex-1 py-2.5 px-4 rounded-xl border border-gray-300 dark:border-gray-700 text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Reset All
              </button>
              <button
                onClick={() => setShowFilterDrawer(false)}
                className="flex-1 py-2.5 px-4 rounded-xl bg-[#FF9900] text-[#111111] text-xs font-bold shadow-md shadow-[#FF9900]/20"
              >
                Apply Filters ({filteredProducts.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
