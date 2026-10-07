import React from 'react';
import { useApp } from '../../context/AppContext';
import { Flame, Sparkles, ArrowRight, ShieldCheck, Zap, Percent } from 'lucide-react';
import { CountdownTimer } from '../common/CountdownTimer';

export const HeroBanner: React.FC = () => {
  const { setActiveTab } = useApp();

  return (
    <div className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-gradient-to-br from-[#131921] via-[#1E2633] to-[#0F141C] text-white shadow-xl shadow-black/10 border border-white/5 my-3 sm:my-5">
      {/* Ambient background glow decoration */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-[#FF9900]/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 -mb-12 w-48 h-48 rounded-full bg-[#007185]/20 blur-2xl pointer-events-none" />

      <div className="relative z-10 p-5 sm:p-7 md:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Left Column Content */}
        <div className="max-w-xl">
          {/* Subtle live indicator badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-semibold mb-3.5">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF9900] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF9900]"></span>
            </span>
            <span className="text-[#FF9900]">Live Amazon Price Drops</span>
            <span className="text-white/40">·</span>
            <CountdownTimer className="bg-transparent px-0 py-0 text-white" label="Refreshes in" />
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white font-['Outfit',sans-serif] leading-tight">
            🔥 Best Amazon Deals Today
          </h1>

          <p className="mt-2 text-sm sm:text-base text-gray-300 leading-relaxed font-normal">
            Discover amazing products at the best prices. Hand-picked discounts, verified lightning specials, and price drops updated hourly.
          </p>

          {/* Value props */}
          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-gray-300">
            <span className="flex items-center gap-1.5">
              <Percent size={14} className="text-[#FF9900]" />
              Up to 77% OFF
            </span>
            <span className="text-white/30">·</span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-emerald-400" />
              100% Genuine Amazon Links
            </span>
            <span className="text-white/30">·</span>
            <span className="flex items-center gap-1.5">
              <Zap size={14} className="text-amber-400" />
              Prime Verified
            </span>
          </div>

          {/* Action CTAs */}
          <div className="mt-6 flex items-center gap-3">
            <button
              onClick={() => setActiveTab('deals')}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#FF9900] to-[#FFA41C] text-[#111111] font-bold text-sm shadow-lg shadow-[#FF9900]/25 hover:from-[#FFA41C] hover:to-[#FF9900] active:scale-[0.98] transition-all cursor-pointer"
            >
              <Sparkles size={16} />
              Explore Deals
              <ArrowRight size={16} />
            </button>

            <button
              onClick={() => setActiveTab('search')}
              className="inline-flex items-center justify-center px-4 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-sm border border-white/15 active:scale-[0.98] transition-all"
            >
              Browse Categories
            </button>
          </div>
        </div>

        {/* Right Column Highlights / Mini Card Deck */}
        <div className="hidden lg:flex flex-col gap-2.5 max-w-xs shrink-0 bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10">
          <div className="flex items-center justify-between text-xs text-gray-300 pb-2 border-b border-white/10">
            <span className="font-bold flex items-center gap-1 text-[#FF9900]">
              <Flame size={14} /> Lightning Pick
            </span>
            <span className="text-[11px] bg-[#CC0C39] px-2 py-0.5 rounded font-bold text-white">
              77% OFF
            </span>
          </div>
          <p className="text-xs font-semibold text-white line-clamp-2">
            Portronics Ruffpad 15M Re-Writable LCD Writing Pad
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-white">₹449</span>
            <span className="text-xs line-through text-gray-400">₹1,999</span>
            <span className="text-[11px] text-emerald-400 font-semibold ml-auto">
              Save ₹1,550
            </span>
          </div>
          <button
            onClick={() => setActiveTab('deals')}
            className="w-full mt-1 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-center text-xs font-semibold text-white transition-colors"
          >
            Check Lightning Deals →
          </button>
        </div>
      </div>
    </div>
  );
};
