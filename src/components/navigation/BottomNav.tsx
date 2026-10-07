import React from 'react';
import { useApp } from '../../context/AppContext';
import { Home, Flame, Search, Heart, User, ShieldCheck } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, wishlist } = useApp();

  const tabs = [
    { id: 'home' as const, label: 'Home', icon: Home },
    { id: 'deals' as const, label: 'Deals', icon: Flame, badge: 'HOT' },
    { id: 'search' as const, label: 'Search', icon: Search },
    { id: 'wishlist' as const, label: 'Wishlist', icon: Heart, count: wishlist.length },
    { id: 'profile' as const, label: 'Profile', icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white/95 dark:bg-[#131921]/95 backdrop-blur-md border-t border-gray-200/80 dark:border-gray-800 transition-colors">
      <div className="grid grid-cols-5 h-16 max-w-md mx-auto items-center px-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="relative flex flex-col items-center justify-center h-full min-h-[44px] min-w-[44px] py-1 select-none focus:outline-none transition-colors"
            >
              <div className="relative">
                <Icon
                  size={20}
                  className={`transition-transform duration-150 ${
                    isActive
                      ? 'text-[#FF9900] scale-110 stroke-[2.5]'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}
                />

                {/* Badge for deals */}
                {tab.badge && !isActive && (
                  <span className="absolute -top-1.5 -right-3 px-1 py-0.2 rounded-full bg-[#CC0C39] text-white text-[8px] font-extrabold tracking-tight">
                    {tab.badge}
                  </span>
                )}

                {/* Wishlist count badge */}
                {tab.count !== undefined && tab.count > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 min-w-[15px] h-3.5 px-0.5 rounded-full bg-[#CC0C39] text-white text-[9px] font-extrabold flex items-center justify-center">
                    {tab.count}
                  </span>
                )}
              </div>

              <span
                className={`text-[10px] font-semibold mt-1 tracking-tight truncate ${
                  isActive
                    ? 'text-[#FF9900]'
                    : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                {tab.label}
              </span>

              {/* Active bottom bar accent */}
              {isActive && (
                <span className="absolute bottom-1 w-4 h-0.5 rounded-full bg-[#FF9900]" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
