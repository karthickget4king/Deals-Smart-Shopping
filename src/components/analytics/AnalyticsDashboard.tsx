import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  BarChart3,
  MousePointerClick,
  Eye,
  TrendingUp,
  Percent,
  ExternalLink,
  ShieldCheck,
  ShoppingBag,
} from 'lucide-react';

export const AnalyticsDashboard: React.FC = () => {
  const { analytics, products, formatPrice, setSelectedProduct } = useApp();

  // Top clicked products
  const mostClicked = [...products]
    .map((p) => ({
      ...p,
      clicks: analytics.clicksByProduct[p.id] || 0,
    }))
    .filter((p) => p.clicks > 0)
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 5);

  // Top viewed products
  const mostViewed = [...products]
    .map((p) => ({
      ...p,
      views: analytics.viewsByProduct[p.id] || 0,
    }))
    .filter((p) => p.views > 0)
    .sort((a, b) => b.views - a.views)
    .slice(0, 5);

  // Category breakdown
  const categoryStats = Object.entries(analytics.clicksByCategory)
    .map(([cat, clicks]) => ({
      category: cat,
      clicks,
    }))
    .sort((a, b) => b.clicks - a.clicks);

  const maxCatClicks = Math.max(...categoryStats.map((c) => c.clicks), 1);

  return (
    <div className="space-y-5 pb-20">
      {/* Header */}
      <div className="p-4 sm:p-6 rounded-2xl bg-white dark:bg-gray-850 border border-gray-200/80 dark:border-gray-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-[#007185]/10 text-[#007185] dark:text-[#56BED4] flex items-center justify-center">
              <BarChart3 size={20} />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                Affiliate & Performance Analytics
              </h1>
              <p className="text-xs text-gray-500">
                Live Amazon click-through rate, impressions and conversion insights
              </p>
            </div>
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 text-xs font-semibold self-start sm:self-auto border border-emerald-200/50">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Real-time tracking active</span>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Views */}
        <div className="p-4 rounded-2xl bg-white dark:bg-gray-850 border border-gray-200/80 dark:border-gray-800 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 dark:text-gray-400 mb-2">
            <span className="text-xs font-medium">Product Views</span>
            <Eye size={18} className="text-[#007185]" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tabular-nums">
            {analytics.totalViews.toLocaleString()}
          </p>
          <p className="text-[11px] text-gray-400 mt-1">Impressions logged across app</p>
        </div>

        {/* Total Amazon Clicks */}
        <div className="p-4 rounded-2xl bg-white dark:bg-gray-850 border border-gray-200/80 dark:border-gray-800 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 dark:text-gray-400 mb-2">
            <span className="text-xs font-medium">Amazon Clicks</span>
            <MousePointerClick size={18} className="text-[#FF9900]" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-[#FF9900] tabular-nums">
            {analytics.totalClicks.toLocaleString()}
          </p>
          <p className="text-[11px] text-gray-400 mt-1">"Buy on Amazon" click outs</p>
        </div>

        {/* CTR % */}
        <div className="p-4 rounded-2xl bg-white dark:bg-gray-850 border border-gray-200/80 dark:border-gray-800 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 dark:text-gray-400 mb-2">
            <span className="text-xs font-medium">Click-Through Rate</span>
            <Percent size={18} className="text-emerald-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 tabular-nums">
            {analytics.ctr}%
          </p>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1">
            Industry avg: 1.5% - 2.8%
          </p>
        </div>

        {/* Active Deals Catalog */}
        <div className="p-4 rounded-2xl bg-white dark:bg-gray-850 border border-gray-200/80 dark:border-gray-800 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 dark:text-gray-400 mb-2">
            <span className="text-xs font-medium">Active Deals</span>
            <ShoppingBag size={18} className="text-[#CC0C39]" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tabular-nums">
            {products.length}
          </p>
          <p className="text-[11px] text-gray-400 mt-1">
            {products.filter((p) => p.isDeal).length} tagged as Today's Deals
          </p>
        </div>
      </div>

      {/* Leaderboard Lists: Top Clicked & Top Viewed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Most Clicked Products */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-gray-850 border border-gray-200/80 dark:border-gray-800 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <MousePointerClick size={16} className="text-[#FF9900]" />
              Top Products by Amazon Clicks
            </h2>
            <span className="text-xs text-gray-400">Total clicks</span>
          </div>

          <div className="space-y-3">
            {mostClicked.length === 0 ? (
              <p className="text-xs text-gray-400 py-4 text-center">No clicks recorded yet.</p>
            ) : (
              mostClicked.map((item, idx) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedProduct(item)}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/60 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0 pr-2">
                    <span className="w-5 text-center font-bold text-xs text-gray-400">
                      #{idx + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">
                        {item.title}
                      </p>
                      <p className="text-[11px] text-[#007185] dark:text-[#56BED4]">
                        {formatPrice(item.dealPrice)} ({item.brand})
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                    <span className="text-xs font-black text-[#FF9900] tabular-nums">
                      {item.clicks} clicks
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Category Performance Breakdown */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-gray-850 border border-gray-200/80 dark:border-gray-800 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <TrendingUp size={16} className="text-emerald-500" />
              Category Click Distribution
            </h2>
            <span className="text-xs text-gray-400">Affiliate Volume</span>
          </div>

          <div className="space-y-2.5">
            {categoryStats.length === 0 ? (
              <p className="text-xs text-gray-400 py-4 text-center">No category data yet.</p>
            ) : (
              categoryStats.map((cat) => {
                const percent = Math.round((cat.clicks / maxCatClicks) * 100);

                return (
                  <div key={cat.category} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-medium">
                      <span className="capitalize text-gray-700 dark:text-gray-300">
                        {cat.category.replace('-', ' ')}
                      </span>
                      <span className="font-bold text-gray-900 dark:text-white tabular-nums">
                        {cat.clicks} clicks
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#FF9900] to-[#FFA41C] rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Real-Time Amazon Click Activity Log */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-gray-850 border border-gray-200/80 dark:border-gray-800 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <ShieldCheck size={16} className="text-[#007185] dark:text-[#56BED4]" />
            Recent Amazon Affiliate Outbound Activity
          </h2>
          <span className="text-xs text-gray-400">Latest 20 Events</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800 text-gray-400 font-semibold">
                <th className="py-2 px-2">Time</th>
                <th className="py-2 px-2">Product Title</th>
                <th className="py-2 px-2">Category</th>
                <th className="py-2 px-2 text-right">Destination</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60">
              {analytics.recentClicks.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-4 text-center text-gray-400">
                    No outbound clicks yet. Click "Buy on Amazon" on any product to simulate.
                  </td>
                </tr>
              ) : (
                analytics.recentClicks.map((click) => (
                  <tr key={click.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/40">
                    <td className="py-2.5 px-2 text-gray-500 whitespace-nowrap">
                      {click.timestamp}
                    </td>
                    <td className="py-2.5 px-2 font-medium text-gray-900 dark:text-white max-w-xs truncate">
                      {click.productTitle}
                    </td>
                    <td className="py-2.5 px-2 text-gray-500 capitalize">
                      {click.category.replace('-', ' ')}
                    </td>
                    <td className="py-2.5 px-2 text-right">
                      <a
                        href={click.affiliateUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[#007185] dark:text-[#56BED4] hover:underline font-semibold"
                      >
                        <span>Amazon</span>
                        <ExternalLink size={11} />
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
