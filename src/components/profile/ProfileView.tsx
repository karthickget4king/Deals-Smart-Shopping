import React from 'react';
import { useApp } from '../../context/AppContext';
import { Logo } from '../common/Logo';
import {
  Sun,
  Moon,
  ShieldCheck,
  BarChart3,
  Globe,
  Heart,
  Share2,
  ExternalLink,
  Info,
  CheckCircle2,
  Smartphone,
  Sparkles,
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const {
    currency,
    setCurrency,
    darkMode,
    setDarkMode,
    setActiveTab,
    affiliateTag,
    wishlist,
    products,
    analytics,
  } = useApp();

  return (
    <div className="space-y-5 pb-20 max-w-2xl mx-auto">
      {/* Profile Card Header */}
      <div className="p-6 rounded-3xl bg-white dark:bg-gray-850 border border-gray-200/80 dark:border-gray-800 shadow-xs flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FF9900] to-[#FFA41C] text-[#111111] flex items-center justify-center font-extrabold text-2xl shadow-lg shadow-[#FF9900]/25">
          DS
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white truncate">
              Smart Shopper
            </h1>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400">
              Verified
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Saving money with Deals Smart Shopping
          </p>

          <div className="flex items-center gap-4 mt-2 text-xs text-gray-600 dark:text-gray-300">
            <span>
              <strong className="text-gray-900 dark:text-white">{wishlist.length}</strong> Saved Deals
            </span>
            <span>·</span>
            <span>
              <strong className="text-[#FF9900]">{analytics.totalClicks}</strong> Amazon Redirects
            </span>
          </div>
        </div>
      </div>

      {/* Preferences Section */}
      <div className="p-5 rounded-3xl bg-white dark:bg-gray-850 border border-gray-200/80 dark:border-gray-800 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider text-xs text-gray-400">
          Shopping Preferences
        </h2>

        {/* Currency Switcher */}
        <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <Globe size={18} className="text-[#007185] dark:text-[#56BED4]" />
            <div>
              <p className="text-xs font-semibold text-gray-900 dark:text-white">
                Display Currency
              </p>
              <p className="text-[11px] text-gray-500">
                INR (₹) for Amazon India or USD ($) conversion
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
            <button
              onClick={() => setCurrency('INR')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                currency === 'INR'
                  ? 'bg-white dark:bg-gray-700 text-[#111111] dark:text-white shadow-xs'
                  : 'text-gray-500'
              }`}
            >
              ₹ INR
            </button>
            <button
              onClick={() => setCurrency('USD')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                currency === 'USD'
                  ? 'bg-white dark:bg-gray-700 text-[#111111] dark:text-white shadow-xs'
                  : 'text-gray-500'
              }`}
            >
              $ USD
            </button>
          </div>
        </div>

        {/* Theme Mode Toggle */}
        <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            {darkMode ? (
              <Moon size={18} className="text-amber-400" />
            ) : (
              <Sun size={18} className="text-amber-500" />
            )}
            <div>
              <p className="text-xs font-semibold text-gray-900 dark:text-white">
                Theme Appearance
              </p>
              <p className="text-[11px] text-gray-500">
                {darkMode ? 'Dark OLED mode active' : 'Clean light mode active'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setDarkMode((prev) => !prev)}
            className="px-3.5 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {darkMode ? 'Switch to Light' : 'Switch to Dark'}
          </button>
        </div>

        {/* Quick Shortcut to Wishlist */}
        <div
          onClick={() => setActiveTab('wishlist')}
          className="flex items-center justify-between py-2 cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <Heart size={18} className="text-[#CC0C39]" />
            <div>
              <p className="text-xs font-semibold text-gray-900 dark:text-white group-hover:text-[#007185] transition-colors">
                My Saved Wishlist
              </p>
              <p className="text-[11px] text-gray-500">{wishlist.length} items in your list</p>
            </div>
          </div>
          <span className="text-xs font-bold text-[#007185] dark:text-[#56BED4]">
            View →
          </span>
        </div>
      </div>

      {/* Admin & Management Quick Access */}
      <div className="p-5 rounded-3xl bg-white dark:bg-gray-850 border border-gray-200/80 dark:border-gray-800 shadow-xs space-y-3">
        <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider text-xs text-gray-400">
          Management & Analytics
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <button
            onClick={() => setActiveTab('admin')}
            className="p-3.5 rounded-2xl bg-gray-50 dark:bg-gray-800 hover:bg-[#FF9900]/10 border border-gray-200/70 dark:border-gray-700/70 text-left transition-all group flex items-start gap-3 cursor-pointer"
          >
            <div className="p-2 rounded-xl bg-[#111111] dark:bg-white text-white dark:text-[#111111]">
              <ShieldCheck size={18} />
            </div>
            <div>
              <h3 className="text-xs font-bold text-gray-900 dark:text-white group-hover:text-[#FF9900] transition-colors">
                Admin Console
              </h3>
              <p className="text-[11px] text-gray-500 mt-0.5">
                Add, edit, or delete deals and push alert notifications.
              </p>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className="p-3.5 rounded-2xl bg-gray-50 dark:bg-gray-800 hover:bg-[#007185]/10 border border-gray-200/70 dark:border-gray-700/70 text-left transition-all group flex items-start gap-3 cursor-pointer"
          >
            <div className="p-2 rounded-xl bg-[#007185] text-white">
              <BarChart3 size={18} />
            </div>
            <div>
              <h3 className="text-xs font-bold text-gray-900 dark:text-white group-hover:text-[#007185] transition-colors">
                Affiliate Analytics
              </h3>
              <p className="text-[11px] text-gray-500 mt-0.5">
                Monitor views, Amazon clicks and CTR leaderboard.
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Amazon Associates Disclosure & Brand Info */}
      <div className="p-5 rounded-3xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/70 dark:border-amber-900/40 text-xs space-y-2">
        <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200 font-bold">
          <Info size={16} className="text-[#FF9900]" />
          <span>Amazon Associates Program Disclosure</span>
        </div>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-[11px]">
          Deals Smart Shopping is a participant in the Amazon Services LLC Associates Program and Amazon Associates Program India, an affiliate advertising program designed to provide a means for sites to earn advertising fees by advertising and linking to Amazon.in / Amazon.com.
        </p>
        <p className="text-gray-500 text-[10px] pt-1">
          Active Associates Tag ID: <code className="font-mono font-bold text-gray-800 dark:text-gray-200">{affiliateTag}</code>
        </p>
      </div>

      {/* App Branding & Tagline */}
      <div className="text-center pt-2 pb-6 space-y-1">
        <Logo size="sm" showTagline={false} className="justify-center items-center" />
        <p className="text-xs font-semibold text-gray-600 dark:text-gray-300">
          Smart Deals. Better Prices. Smarter Shopping.
        </p>
        <p className="text-[10px] text-gray-400">
          Version 2.4.0 · High Performance Deals Engine
        </p>
      </div>
    </div>
  );
};
