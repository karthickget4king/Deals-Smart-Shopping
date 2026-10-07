import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ProductImage } from '../common/ProductImage';
import { StarRating } from '../common/StarRating';
import { CountdownTimer } from '../common/CountdownTimer';
import {
  X,
  Heart,
  Share2,
  ExternalLink,
  ShoppingBag,
  Check,
  ShieldCheck,
  Truck,
  Flame,
  ThumbsUp,
  ThumbsDown,
  Info,
  Clock,
  Sparkles,
} from 'lucide-react';

export const ProductDetailsModal: React.FC = () => {
  const {
    selectedProduct,
    setSelectedProduct,
    isInWishlist,
    toggleWishlist,
    formatPrice,
    openBuyOnAmazon,
    showToast,
  } = useApp();

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!selectedProduct) return null;

  const isFavorited = isInWishlist(selectedProduct.id);
  const savings = selectedProduct.originalPrice - selectedProduct.dealPrice;
  const gallery = selectedProduct.galleryImages?.length
    ? selectedProduct.galleryImages
    : [selectedProduct.image];

  const handleShare = async () => {
    const text = `Check out this deal on ${selectedProduct.title} for ${formatPrice(selectedProduct.dealPrice)}!`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: selectedProduct.title,
          text: text,
          url: window.location.href,
        });
      } catch {
        // user cancelled or share failed
      }
    } else {
      navigator.clipboard.writeText(`${text} ${window.location.href}`);
      showToast('Deal link copied to clipboard! 📋', 'success');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0"
        onClick={() => setSelectedProduct(null)}
      />

      {/* Main Modal Container */}
      <div className="relative w-full max-w-3xl bg-white dark:bg-gray-900 sm:rounded-3xl shadow-2xl flex flex-col max-h-[100dvh] sm:max-h-[92vh] z-10 border border-gray-100 dark:border-gray-800 overflow-hidden">
        {/* Top Sticky Bar */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-4 py-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-extrabold tracking-wider text-[#FF9900]">
              {selectedProduct.brand}
            </span>
            <span className="text-gray-300 dark:text-gray-700">·</span>
            <span className="text-xs text-gray-500 capitalize">
              {selectedProduct.category.replace('-', ' ')}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleShare}
              aria-label="Share deal"
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors"
            >
              <Share2 size={18} />
            </button>

            <button
              onClick={() => toggleWishlist(selectedProduct.id)}
              aria-label={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
              className={`p-2 rounded-full transition-colors ${
                isFavorited
                  ? 'text-[#CC0C39] bg-rose-50 dark:bg-rose-950/30'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300'
              }`}
            >
              <Heart
                size={18}
                className={isFavorited ? 'fill-[#CC0C39]' : ''}
              />
            </button>

            <button
              onClick={() => setSelectedProduct(null)}
              aria-label="Close dialog"
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 hover:text-gray-800 dark:hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Top Gallery & Pricing Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* Gallery View */}
            <div className="flex flex-col gap-3">
              <div className="relative aspect-square w-full rounded-2xl bg-gray-50 dark:bg-gray-800/70 p-4 border border-gray-100 dark:border-gray-800 overflow-hidden flex items-center justify-center">
                {selectedProduct.discountPercentage >= 30 && (
                  <div className="absolute top-3 left-3 z-10 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#CC0C39] text-white text-xs font-black shadow-md">
                    <Flame size={12} className="fill-white" />
                    {selectedProduct.discountPercentage}% OFF
                  </div>
                )}

                <ProductImage
                  src={gallery[activeImageIndex] || selectedProduct.image}
                  alt={selectedProduct.title}
                  category={selectedProduct.category}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Thumbnails */}
              {gallery.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {gallery.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 bg-gray-50 dark:bg-gray-800 p-1 ${
                        activeImageIndex === idx
                          ? 'border-[#FF9900] ring-2 ring-[#FF9900]/30'
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`Thumbnail ${idx + 1}`}
                        className="w-full h-full object-contain"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Information & Buy Box */}
            <div className="flex flex-col justify-between h-full space-y-4">
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white leading-snug">
                  {selectedProduct.title}
                </h1>

                {/* Rating */}
                <div className="mt-2.5 flex items-center gap-3">
                  <StarRating
                    rating={selectedProduct.rating}
                    reviewCount={selectedProduct.reviewCount}
                    size="md"
                  />
                  {selectedProduct.primeEligible && (
                    <span className="text-xs font-extrabold text-[#007185] dark:text-[#56BED4] flex items-center gap-0.5 bg-sky-50 dark:bg-sky-950/40 px-2 py-0.5 rounded-md">
                      <Check size={12} className="stroke-[3]" /> prime
                    </span>
                  )}
                </div>

                {/* Deal Countdown Alert Box */}
                {selectedProduct.isLightningDeal && (
                  <div className="mt-3.5 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#CC0C39]">
                      <Clock size={16} />
                      <span>Limited Time Lightning Deal</span>
                    </div>
                    <CountdownTimer
                      targetDate={selectedProduct.dealEndsAt}
                      className="bg-transparent px-0 py-0"
                    />
                  </div>
                )}

                {/* Pricing Block */}
                <div className="mt-4 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800">
                  <div className="flex items-baseline gap-3 flex-wrap">
                    <span className="text-2xl sm:text-3xl font-black text-[#111111] dark:text-white tabular-nums">
                      {formatPrice(selectedProduct.dealPrice)}
                    </span>
                    <span className="text-sm text-gray-400 dark:text-gray-500 line-through tabular-nums">
                      M.R.P: {formatPrice(selectedProduct.originalPrice)}
                    </span>
                    <span className="text-xs font-bold text-[#CC0C39] bg-rose-100 dark:bg-rose-950/50 px-2 py-0.5 rounded-md">
                      -{selectedProduct.discountPercentage}%
                    </span>
                  </div>

                  {savings > 0 && (
                    <p className="mt-1 text-xs font-semibold text-[#067D62] dark:text-emerald-400">
                      Total Savings: {formatPrice(savings)} ({selectedProduct.discountPercentage}%)
                    </p>
                  )}

                  <div className="mt-3 pt-3 border-t border-gray-200/60 dark:border-gray-700/60 flex items-center justify-between text-xs text-gray-600 dark:text-gray-300">
                    <span className="flex items-center gap-1.5">
                      <Truck size={14} className="text-[#007185] dark:text-[#56BED4]" />
                      Fast Free Delivery via Amazon
                    </span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      {selectedProduct.stockStatus || 'In Stock'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Big "Buy on Amazon" Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => openBuyOnAmazon(selectedProduct)}
                  className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#FF9900] to-[#FFA41C] hover:from-[#FFA41C] hover:to-[#FF9900] text-[#111111] font-extrabold text-base shadow-lg shadow-[#FF9900]/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer border border-[#E68A00]"
                >
                  <ShoppingBag size={20} />
                  <span>🛒 Buy on Amazon</span>
                  <ExternalLink size={16} className="opacity-70 ml-1" />
                </button>

                <p className="mt-2 text-center text-[11px] text-gray-500 dark:text-gray-400 flex items-center justify-center gap-1">
                  <ShieldCheck size={12} className="text-emerald-600" />
                  Amazon Associate: We may earn from qualifying purchases.
                </p>
              </div>
            </div>
          </div>

          {/* Key Features Bullet Points */}
          {selectedProduct.keyFeatures?.length > 0 && (
            <div className="p-4 rounded-2xl bg-gray-50/70 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800">
              <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-2.5 flex items-center gap-2">
                <Sparkles size={16} className="text-[#FF9900]" />
                Key Highlights & Features
              </h2>
              <ul className="space-y-2">
                {selectedProduct.keyFeatures.map((feat, idx) => (
                  <li
                    key={idx}
                    className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2.5"
                  >
                    <Check
                      size={14}
                      className="text-emerald-500 shrink-0 mt-0.5 stroke-[2.5]"
                    />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Full Description */}
          <div>
            <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-2">
              Product Overview
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              {selectedProduct.description}
            </p>
          </div>

          {/* Pros & Cons Grid */}
          {(selectedProduct.pros?.length > 0 || selectedProduct.cons?.length > 0) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Pros */}
              <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30">
                <h3 className="text-xs font-bold text-emerald-800 dark:text-emerald-400 flex items-center gap-1.5 mb-2">
                  <ThumbsUp size={14} /> What Users Love (Pros)
                </h3>
                <ul className="space-y-1.5 text-xs text-gray-700 dark:text-gray-300">
                  {selectedProduct.pros.map((pro, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-emerald-500 font-bold">✓</span>
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Cons */}
              <div className="p-4 rounded-2xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30">
                <h3 className="text-xs font-bold text-rose-800 dark:text-rose-400 flex items-center gap-1.5 mb-2">
                  <ThumbsDown size={14} /> Things to Consider (Cons)
                </h3>
                <ul className="space-y-1.5 text-xs text-gray-700 dark:text-gray-300">
                  {selectedProduct.cons.map((con, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-rose-500 font-bold">✕</span>
                      <span>{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Trust and Safety Badges */}
          <div className="py-3 border-t border-gray-100 dark:border-gray-800 grid grid-cols-3 gap-2 text-center text-[11px] text-gray-500 dark:text-gray-400">
            <div>
              <p className="font-bold text-gray-800 dark:text-gray-200">100% Genuine</p>
              <p>Amazon Fulfilled</p>
            </div>
            <div>
              <p className="font-bold text-gray-800 dark:text-gray-200">Easy Returns</p>
              <p>Amazon Return Policy</p>
            </div>
            <div>
              <p className="font-bold text-gray-800 dark:text-gray-200">Verified Deals</p>
              <p>Monitored Discounts</p>
            </div>
          </div>
        </div>

        {/* Mobile Sticky Buy Button Bar */}
        <div className="sm:hidden p-3 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 flex items-center gap-3">
          <div className="flex flex-col">
            <span className="text-xs text-gray-400 line-through">
              {formatPrice(selectedProduct.originalPrice)}
            </span>
            <span className="text-lg font-black text-gray-900 dark:text-white tabular-nums leading-none">
              {formatPrice(selectedProduct.dealPrice)}
            </span>
          </div>

          <button
            type="button"
            onClick={() => openBuyOnAmazon(selectedProduct)}
            className="flex-1 py-3 px-4 rounded-xl bg-[#FF9900] active:bg-[#E68A00] text-[#111111] font-extrabold text-sm flex items-center justify-center gap-1.5 shadow-md shadow-[#FF9900]/25"
          >
            <ShoppingBag size={16} />
            <span>Buy on Amazon</span>
          </button>
        </div>
      </div>
    </div>
  );
};
