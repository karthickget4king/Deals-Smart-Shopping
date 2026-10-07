import React from 'react';
import { Product } from '../../types/product';
import { useApp } from '../../context/AppContext';
import { ProductImage } from '../common/ProductImage';
import { StarRating } from '../common/StarRating';
import { Heart, ShoppingBag, ArrowUpRight, Flame, Clock, Check } from 'lucide-react';
import { CountdownTimer } from '../common/CountdownTimer';

interface ProductCardProps {
  product: Product;
  variant?: 'grid' | 'compact' | 'horizontal';
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, variant = 'grid' }) => {
  const {
    setSelectedProduct,
    isInWishlist,
    toggleWishlist,
    formatPrice,
    openBuyOnAmazon,
    trackProductView,
  } = useApp();

  const isFavorited = isInWishlist(product.id);
  const savings = product.originalPrice - product.dealPrice;

  const handleCardClick = () => {
    trackProductView(product.id);
    setSelectedProduct(product);
  };

  const handleBuyClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    openBuyOnAmazon(product);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative flex flex-col justify-between bg-white dark:bg-gray-850 rounded-2xl border border-gray-200/90 dark:border-gray-800 shadow-xs hover:shadow-lg hover:border-[#FF9900]/40 transition-all duration-200 cursor-pointer overflow-hidden"
    >
      {/* Top Media Section */}
      <div className="relative w-full overflow-hidden bg-gray-50 dark:bg-gray-900/60 p-3">
        {/* Deal Badges (Top Left) */}
        <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1 items-start max-w-[70%]">
          {product.discountPercentage >= 40 && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#CC0C39] text-white text-[11px] font-black tracking-tight shadow-xs">
              <Flame size={11} className="fill-white" />
              {product.discountPercentage}% OFF
            </span>
          )}

          {product.isLightningDeal && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#131921] text-[#FF9900] text-[10px] font-bold border border-[#FF9900]/30 shadow-xs">
              <Clock size={10} />
              Limited Deal
            </span>
          )}

          {!product.isLightningDeal && product.isFeatured && product.discountPercentage < 40 && (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-amber-500 text-white text-[10px] font-bold">
              Featured Pick
            </span>
          )}
        </div>

        {/* Wishlist Button (Top Right) */}
        <button
          onClick={handleWishlistClick}
          aria-label={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
            isFavorited
              ? 'bg-[#CC0C39] text-white shadow-md'
              : 'bg-white/90 dark:bg-gray-800/90 text-gray-400 hover:text-[#CC0C39] hover:bg-white shadow-xs'
          }`}
        >
          <Heart
            size={16}
            className={isFavorited ? 'fill-white stroke-white' : 'stroke-[2]'}
          />
        </button>

        {/* Image */}
        <div className="w-full aspect-square flex items-center justify-center pt-2">
          <ProductImage
            src={product.image}
            alt={product.title}
            category={product.category}
            aspectRatio="square"
            className="w-full h-full object-contain rounded-xl"
          />
        </div>

        {/* Lightning Deal Countdown ticker if applicable */}
        {product.isLightningDeal && (
          <div className="mt-1 pt-1 border-t border-gray-100 dark:border-gray-800 text-center">
            <CountdownTimer
              targetDate={product.dealEndsAt}
              className="bg-transparent py-0 px-0 justify-center text-[11px]"
              label="Ends in"
            />
          </div>
        )}
      </div>

      {/* Card Content Details */}
      <div className="p-3.5 flex flex-col flex-1 justify-between gap-2.5">
        <div>
          {/* Brand & Category micro-line */}
          <div className="flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400 font-medium">
            <span className="text-[#007185] dark:text-[#56BED4] font-semibold uppercase tracking-wider text-[10px]">
              {product.brand}
            </span>
            {product.primeEligible && (
              <span className="text-[10px] font-extrabold text-[#007185] dark:text-[#56BED4] flex items-center gap-0.5">
                <Check size={11} className="stroke-[3]" /> prime
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="mt-1 text-xs sm:text-sm font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 leading-snug group-hover:text-[#007185] dark:group-hover:text-[#56BED4] transition-colors">
            {product.title}
          </h3>

          {/* Rating */}
          <div className="mt-1.5 flex items-center">
            <StarRating rating={product.rating} reviewCount={product.reviewCount} />
          </div>
        </div>

        {/* Pricing Block */}
        <div>
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-lg sm:text-xl font-extrabold text-[#111111] dark:text-white tabular-nums tracking-tight">
              {formatPrice(product.dealPrice)}
            </span>
            <span className="text-xs text-gray-400 dark:text-gray-500 line-through tabular-nums">
              {formatPrice(product.originalPrice)}
            </span>
            {product.discountPercentage > 0 && (
              <span className="text-xs font-bold text-[#CC0C39] tabular-nums">
                -{product.discountPercentage}%
              </span>
            )}
          </div>

          {/* Savings Callout */}
          {savings > 0 && (
            <p className="text-[11px] font-semibold text-[#067D62] dark:text-emerald-400 mt-0.5">
              You Save {formatPrice(savings)}
            </p>
          )}

          {/* Action Buttons: "View Deal" + "Buy on Amazon" */}
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleCardClick}
              className="w-full py-2 px-2 rounded-xl text-xs font-semibold bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 transition-colors text-center flex items-center justify-center gap-1 cursor-pointer"
            >
              <span>View Deal</span>
            </button>

            <button
              type="button"
              onClick={handleBuyClick}
              className="w-full py-2 px-2 rounded-xl text-xs font-bold bg-[#FF9900] hover:bg-[#E68A00] text-[#111111] shadow-xs hover:shadow-md transition-all text-center flex items-center justify-center gap-1 active:scale-95 cursor-pointer"
            >
              <ShoppingBag size={12} />
              <span className="truncate">Buy Amazon</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
