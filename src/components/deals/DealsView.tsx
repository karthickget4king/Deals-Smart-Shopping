import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ProductCard } from '../product/ProductCard';
import { Flame, Clock, Tag, TrendingUp, Sparkles, Filter, Percent } from 'lucide-react';
import { CountdownTimer } from '../common/CountdownTimer';

type DealSubTab =
  | 'all-deals'
  | 'todays-deals'
  | 'lightning-deals'
  | 'highest-discounts'
  | 'under-499'
  | 'under-999'
  | 'trending'
  | 'new-deals';

export const DealsView: React.FC = () => {
  const { products, currency } = useApp();
  const [subTab, setSubTab] = useState<DealSubTab>('all-deals');

  const dealTabs = [
    { id: 'all-deals' as const, label: 'All Deals', icon: Flame },
    { id: 'todays-deals' as const, label: "Today's Deals", icon: Clock },
    { id: 'lightning-deals' as const, label: 'Lightning Deals', icon: Sparkles },
    { id: 'highest-discounts' as const, label: '50%+ OFF', icon: Percent },
    { id: 'under-499' as const, label: currency === 'INR' ? 'Under ₹499' : 'Under $10', icon: Tag },
    { id: 'under-999' as const, label: currency === 'INR' ? 'Under ₹999' : 'Under $25', icon: Tag },
    { id: 'trending' as const, label: 'Trending', icon: TrendingUp },
    { id: 'new-deals' as const, label: 'New Deals', icon: Sparkles },
  ];

  // Filtering based on active deals tab
  const filteredProducts = products.filter((p) => {
    switch (subTab) {
      case 'todays-deals':
        return p.isDeal;
      case 'lightning-deals':
        return p.isLightningDeal;
      case 'highest-discounts':
        return p.discountPercentage >= 40;
      case 'under-499':
        return p.dealPrice <= (currency === 'INR' ? 499 : 10 * 83.5);
      case 'under-999':
        return p.dealPrice <= (currency === 'INR' ? 999 : 25 * 83.5);
      case 'trending':
        return p.isTrending;
      case 'new-deals':
        return p.isFeatured || p.isDeal;
      default:
        return p.isDeal || p.discountPercentage >= 15;
    }
  });

  return (
    <div className="space-y-5 pb-20">
      {/* Header Banner */}
      <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-[#CC0C39] via-[#E11D48] to-[#FF9900] text-white shadow-lg shadow-rose-900/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1 text-xs font-bold uppercase tracking-wider text-white/90">
              <Flame size={16} className="fill-white" />
              <span>Amazon Exclusive Deals Hub</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              Today\'s Top Amazon Deals & Discounts
            </h1>
            <p className="text-xs sm:text-sm text-white/90 mt-1">
              Curated price cuts, lightning timers, and deep value offers.
            </p>
          </div>

          <div className="bg-white/20 backdrop-blur-md px-3.5 py-2 rounded-xl text-center shrink-0 border border-white/20">
            <span className="text-[11px] font-semibold text-white/80 block">
              Global Flash Sale Ends In:
            </span>
            <CountdownTimer className="bg-transparent text-white px-0 py-0 text-sm font-black justify-center" />
          </div>
        </div>
      </div>

      {/* Sub Tabs Horizontal Scroll */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar -mx-3 px-3 sm:mx-0 sm:px-0">
        {dealTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = subTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setSubTab(tab.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 transition-all active:scale-95 cursor-pointer ${
                isActive
                  ? 'bg-[#111111] dark:bg-white text-white dark:text-[#111111] shadow-md shadow-black/10'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:border-[#FF9900]'
              }`}
            >
              <Icon size={14} className={isActive ? 'text-[#FF9900]' : 'text-gray-400'} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Deals Count */}
      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 px-1">
        <span>
          Showing <strong className="text-gray-800 dark:text-gray-200">{filteredProducts.length}</strong> verified deals
        </span>
        <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
          ⚡ Updated hourly from Amazon feeds
        </span>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="py-16 text-center bg-white dark:bg-gray-850 rounded-2xl border border-gray-200/80 dark:border-gray-800 p-8">
          <Tag size={40} className="mx-auto text-gray-300 dark:text-gray-600 mb-3" />
          <h3 className="text-base font-bold text-gray-900 dark:text-white">
            No deals found in this filter
          </h3>
          <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
            Try switching to "All Deals" or check our Lightning Deals section for active offers.
          </p>
          <button
            onClick={() => setSubTab('all-deals')}
            className="mt-4 px-4 py-2 rounded-xl bg-[#FF9900] text-[#111111] font-bold text-xs"
          >
            Show All Deals
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};
