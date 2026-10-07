import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  reviewCount?: number;
  size?: 'sm' | 'md';
  showCount?: boolean;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  reviewCount,
  size = 'sm',
  showCount = true,
}) => {
  const iconSize = size === 'sm' ? 13 : 16;
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.4;

  return (
    <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-300">
      <div className="flex items-center text-[#FFA41C]">
        {[...Array(5)].map((_, i) => {
          const isFilled = i < fullStars || (i === fullStars && hasHalfStar);
          return (
            <Star
              key={i}
              size={iconSize}
              className={`${
                isFilled
                  ? 'fill-[#FFA41C] text-[#FFA41C]'
                  : 'text-gray-300 dark:text-gray-600'
              }`}
            />
          );
        })}
      </div>
      <span className="font-semibold text-gray-800 dark:text-gray-100 tabular-nums">
        {rating.toFixed(1)}
      </span>
      {showCount && reviewCount !== undefined && (
        <span className="text-gray-500 dark:text-gray-400 tabular-nums text-[11px]">
          ({reviewCount.toLocaleString()})
        </span>
      )}
    </div>
  );
};
