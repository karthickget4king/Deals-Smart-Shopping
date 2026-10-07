import React from 'react';
import { useApp } from '../../context/AppContext';
import { CategoryId } from '../../types/product';

export const CategoryChips: React.FC = () => {
  const { categories, filters, selectCategory, products } = useApp();

  return (
    <div className="my-3 sm:my-4">
      <div className="flex items-center justify-between mb-2.5 px-0.5">
        <h2 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
          <span>Explore Categories</span>
        </h2>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {categories.length} categories
        </span>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-0.5 no-scrollbar -mx-3 px-3 sm:mx-0 sm:px-0">
        {/* 'All' button */}
        <button
          onClick={() => selectCategory('all')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-all active:scale-95 ${
            filters.category === 'all'
              ? 'bg-[#111111] dark:bg-white text-white dark:text-[#111111] shadow-md shadow-black/10'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
          }`}
        >
          <span>🔥</span>
          <span>All Deals</span>
          <span
            className={`text-[10px] px-1.5 py-0.2 rounded-full ${
              filters.category === 'all'
                ? 'bg-white/20 dark:bg-black/20 text-white dark:text-black font-bold'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
            }`}
          >
            {products.length}
          </span>
        </button>

        {/* Dynamic Categories */}
        {categories.map((cat) => {
          const isSelected = filters.category === cat.id;
          const count = products.filter((p) => p.category === cat.id).length;

          return (
            <button
              key={cat.id}
              onClick={() => selectCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-all active:scale-95 ${
                isSelected
                  ? 'bg-[#FF9900] text-[#111111] shadow-md shadow-[#FF9900]/20 font-bold'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
              {count > 0 && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected
                      ? 'bg-black/15 text-black font-bold'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
