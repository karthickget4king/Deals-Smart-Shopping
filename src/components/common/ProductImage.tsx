import React, { useState } from 'react';
import { CategoryId } from '../../types/product';

interface ProductImageProps {
  src: string;
  alt: string;
  category?: CategoryId;
  className?: string;
  aspectRatio?: 'square' | 'wide' | 'auto';
  priority?: boolean;
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string; icon: string }> = {
  electronics: { bg: 'from-blue-500/10 to-indigo-500/10', text: 'text-blue-500', icon: '⚡' },
  mobiles: { bg: 'from-purple-500/10 to-pink-500/10', text: 'text-purple-500', icon: '📱' },
  laptops: { bg: 'from-cyan-500/10 to-blue-500/10', text: 'text-cyan-500', icon: '💻' },
  fashion: { bg: 'from-amber-500/10 to-orange-500/10', text: 'text-amber-500', icon: '👕' },
  'home-kitchen': { bg: 'from-emerald-500/10 to-teal-500/10', text: 'text-emerald-500', icon: '🍳' },
  beauty: { bg: 'from-rose-500/10 to-pink-500/10', text: 'text-rose-500', icon: '✨' },
  grocery: { bg: 'from-lime-500/10 to-green-500/10', text: 'text-lime-600', icon: '🥑' },
  accessories: { bg: 'from-violet-500/10 to-purple-500/10', text: 'text-violet-500', icon: '🎧' },
  fitness: { bg: 'from-red-500/10 to-orange-500/10', text: 'text-red-500', icon: '🏋️' },
  kids: { bg: 'from-yellow-500/10 to-amber-500/10', text: 'text-yellow-600', icon: '🧸' },
  'other-deals': { bg: 'from-neutral-500/10 to-stone-500/10', text: 'text-neutral-500', icon: '🎁' },
};

export const ProductImage: React.FC<ProductImageProps> = ({
  src,
  alt,
  category = 'electronics',
  className = '',
  aspectRatio = 'square',
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const aspectClass =
    aspectRatio === 'square'
      ? 'aspect-square'
      : aspectRatio === 'wide'
      ? 'aspect-[16/10]'
      : '';

  const catStyle = CATEGORY_COLORS[category] || CATEGORY_COLORS.electronics;

  if (hasError || !src) {
    return (
      <div
        className={`relative flex flex-col items-center justify-center p-4 bg-gradient-to-br ${catStyle.bg} bg-gray-50 dark:bg-gray-800 text-center select-none overflow-hidden ${aspectClass} ${className}`}
      >
        <div className="w-12 h-12 rounded-2xl bg-white/80 dark:bg-gray-700/80 shadow-sm flex items-center justify-center text-2xl mb-2">
          {catStyle.icon}
        </div>
        <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 line-clamp-2 px-2">
          {alt}
        </p>
        <span className="mt-1 text-[10px] uppercase font-bold tracking-wider text-[#FF9900]">
          Amazon Verified Deal
        </span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-gray-100 dark:bg-gray-800 ${aspectClass} ${className}`}>
      {/* Skeleton loader while fetching */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 animate-pulse flex items-center justify-center">
          <span className="text-xl opacity-40">{catStyle.icon}</span>
        </div>
      )}

      <img
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        className={`w-full h-full object-contain p-2 transition-transform duration-300 group-hover:scale-105 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
};
