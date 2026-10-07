import React from 'react';
import { useApp } from '../../context/AppContext';
import { HeroBanner } from './HeroBanner';
import { CategoryChips } from './CategoryChips';
import { ProductCard } from '../product/ProductCard';
import { Flame, Clock, Sparkles, TrendingUp, ArrowRight, ShieldCheck } from 'lucide-react';
import { CountdownTimer } from '../common/CountdownTimer';

export const HomeView: React.FC = () => {
  const { products, filters, setActiveTab } = useApp();

  // Filter if user selected a category chip
  const activeProducts =
    filters.category === 'all'
      ? products
      : products.filter((p) => p.category === filters.category);

  // Trending Deals
  const trendingDeals = activeProducts.filter((p) => p.isTrending).slice(0, 4);

  // Today's Best Deals (with lightning or deal tags)
  const todaysBestDeals = activeProducts.filter((p) => p.isDeal).slice(0, 4);

  // Featured Products
  const featuredProducts = activeProducts.filter((p) => p.isFeatured).slice(0, 4);

  return (
    <div className="space-y-6 sm:space-y-8 pb-20">
      {/* 2. Hero Banner */}
      <HeroBanner />

      {/* 3. Categories Navigation Bar */}
      <CategoryChips />

      {/* Filter notification if category is selected */}
      {filters.category !== 'all' && (
        <div className="flex items-center justify-between p-3 rounded-xl bg-[#FF9900]/10 border border-[#FF9900]/25 text-xs">
          <span className="font-semibold text-gray-800 dark:text-gray-200">
            Showing deals in <strong className="capitalize">{filters.category.replace('-', ' ')}</strong>
          </span>
          <button
            onClick={() => setActiveTab('search')}
            className="text-[#007185] dark:text-[#56BED4] font-bold hover:underline"
          >
            Refine filters →
          </button>
        </div>
      )}

      {/* 5. Today's Best Deals (with Countdown / Deal badges) */}
      <section className="space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#CC0C39]/10 text-[#CC0C39] flex items-center justify-center">
              <Clock size={18} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                <span>Today\'s Best Deals</span>
                <span className="text-xs font-black px-2 py-0.5 rounded-full bg-[#CC0C39] text-white">
                  Limited Time
                </span>
              </h2>
              <p className="text-xs text-gray-500">
                Top rated price drops with active countdown timers
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('deals')}
            className="text-xs font-bold text-[#007185] dark:text-[#56BED4] hover:underline flex items-center gap-1"
          >
            <span>See all</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
          {todaysBestDeals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 4. Trending Deals */}
      <section className="space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#FF9900]/15 text-[#FF9900] flex items-center justify-center">
              <TrendingUp size={18} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                <span>Trending Deals</span>
                <span className="text-xs font-bold text-[#FF9900]">🔥 Popular</span>
              </h2>
              <p className="text-xs text-gray-500">
                Most clicked and viewed items by shoppers today
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('deals')}
            className="text-xs font-bold text-[#007185] dark:text-[#56BED4] hover:underline flex items-center gap-1"
          >
            <span>See all</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
          {trendingDeals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 6. Featured Products */}
      <section className="space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <Sparkles size={18} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                Featured Best-Sellers
              </h2>
              <p className="text-xs text-gray-500">
                High-converting, tested Amazon essentials with verified customer ratings
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('search')}
            className="text-xs font-bold text-[#007185] dark:text-[#56BED4] hover:underline flex items-center gap-1"
          >
            <span>Browse all</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Assurance / Trust Banner */}
      <section className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-gray-850 border border-gray-200/80 dark:border-gray-800 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
        <div className="flex flex-col items-center">
          <span className="text-2xl mb-1">🛒</span>
          <h4 className="text-xs font-bold text-gray-900 dark:text-white">Direct Amazon Checkout</h4>
          <p className="text-[11px] text-gray-500 mt-0.5">
            You buy safely directly on official Amazon platforms with your Prime account.
          </p>
        </div>

        <div className="flex flex-col items-center sm:border-x border-gray-100 dark:border-gray-800 sm:px-4">
          <span className="text-2xl mb-1">⚡</span>
          <h4 className="text-xs font-bold text-gray-900 dark:text-white">Verified Price Tracking</h4>
          <p className="text-[11px] text-gray-500 mt-0.5">
            Every deal is verified to show real discounts off regular list prices.
          </p>
        </div>

        <div className="flex flex-col items-center">
          <span className="text-2xl mb-1">🔒</span>
          <h4 className="text-xs font-bold text-gray-900 dark:text-white">Official Associate</h4>
          <p className="text-[11px] text-gray-500 mt-0.5">
            Compliant Amazon Associates links with transparent disclosure.
          </p>
        </div>
      </section>
    </div>
  );
};
