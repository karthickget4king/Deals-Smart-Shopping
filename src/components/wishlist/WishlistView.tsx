import React from 'react';
import { useApp } from '../../context/AppContext';
import { ProductCard } from '../product/ProductCard';
import { Heart, Trash2, ShoppingBag, Sparkles, Share2 } from 'lucide-react';

export const WishlistView: React.FC = () => {
  const { wishlist, products, clearWishlist, setActiveTab, showToast, formatPrice } = useApp();

  const savedProducts = products.filter((p) => wishlist.includes(p.id));

  const totalOriginal = savedProducts.reduce((sum, p) => sum + p.originalPrice, 0);
  const totalDeal = savedProducts.reduce((sum, p) => sum + p.dealPrice, 0);
  const totalSavings = totalOriginal - totalDeal;

  const handleShareWishlist = () => {
    const listNames = savedProducts.map((p) => `• ${p.title} (${formatPrice(p.dealPrice)})`).join('\n');
    const shareText = `Check out my saved Amazon deals on Deals Smart Shopping:\n${listNames}`;
    if (navigator.share) {
      navigator.share({
        title: 'My Saved Deals',
        text: shareText,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareText);
      showToast('Wishlist items copied to clipboard! 📋', 'success');
    }
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Top Header Card */}
      <div className="p-4 sm:p-6 rounded-2xl bg-white dark:bg-gray-850 border border-gray-200/80 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-[#CC0C39] flex items-center justify-center">
              <Heart size={20} className="fill-[#CC0C39]" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                Saved Deals & Wishlist
              </h1>
              <p className="text-xs text-gray-500">
                {savedProducts.length} items saved locally on your device
              </p>
            </div>
          </div>
        </div>

        {savedProducts.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleShareWishlist}
              className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Share2 size={14} />
              <span>Share List</span>
            </button>

            <button
              onClick={clearWishlist}
              className="px-3 py-2 rounded-xl border border-rose-200 dark:border-rose-900/40 text-xs font-semibold text-[#CC0C39] hover:bg-rose-50 dark:hover:bg-rose-950/20 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Trash2 size={14} />
              <span>Clear</span>
            </button>
          </div>
        )}
      </div>

      {/* Savings Summary Banner if items exist */}
      {savedProducts.length > 0 && totalSavings > 0 && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-400 font-semibold">
            <Sparkles size={16} />
            <span>Total potential savings across your saved items:</span>
          </div>
          <span className="font-extrabold text-sm text-[#067D62] dark:text-emerald-300">
            {formatPrice(totalSavings)}
          </span>
        </div>
      )}

      {/* Products Grid or Empty State */}
      {savedProducts.length === 0 ? (
        <div className="py-20 text-center bg-white dark:bg-gray-850 rounded-2xl border border-gray-200/80 dark:border-gray-800 p-8 shadow-xs">
          <div className="w-16 h-16 rounded-full bg-rose-50 dark:bg-rose-950/30 text-[#CC0C39] mx-auto flex items-center justify-center mb-4">
            <Heart size={32} />
          </div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Your Wishlist is Empty
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 max-w-sm mx-auto mt-1 mb-6">
            Tap the heart icon on any deal or product card to save it for quick price tracking and buying on Amazon.
          </p>
          <button
            onClick={() => setActiveTab('deals')}
            className="px-6 py-3 rounded-xl bg-[#FF9900] hover:bg-[#E68A00] text-[#111111] font-bold text-sm shadow-md shadow-[#FF9900]/20 inline-flex items-center gap-2 cursor-pointer active:scale-95 transition-all"
          >
            <Sparkles size={16} />
            <span>Discover Amazon Deals</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
          {savedProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
};
