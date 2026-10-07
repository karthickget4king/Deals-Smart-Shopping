import React from 'react';
import { useApp } from '../../context/AppContext';
import { Logo } from '../common/Logo';
import { Search, Bell, Sun, Moon, ShieldCheck, Heart } from 'lucide-react';
import { NotificationDrawer } from './NotificationDrawer';

export const Header: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    unreadNotifCount,
    setIsNotificationOpen,
    darkMode,
    setDarkMode,
    wishlist,
  } = useApp();

  return (
    <>
      <header className="sticky top-0 z-30 w-full bg-white/95 dark:bg-[#131921]/95 backdrop-blur-md border-b border-gray-200/80 dark:border-gray-800 transition-colors">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
          {/* Left: Brand Logo */}
          <div
            onClick={() => setActiveTab('home')}
            className="cursor-pointer shrink-0 transition-opacity active:opacity-80"
          >
            <Logo size="md" showTagline={false} />
          </div>

          {/* Middle: Integrated Search Bar (Desktop / Tablet) & Quick Tap (Mobile) */}
          <div className="flex-1 max-w-xl mx-1 sm:mx-4">
            <div
              onClick={() => {
                if (activeTab !== 'search') setActiveTab('search');
              }}
              className="relative flex items-center w-full"
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (activeTab !== 'search') setActiveTab('search');
                }}
                placeholder="Search deals, electronics, brands..."
                className="w-full h-9 sm:h-10 pl-9 sm:pl-10 pr-4 text-xs sm:text-sm bg-gray-100 dark:bg-gray-800/80 hover:bg-gray-200/70 dark:hover:bg-gray-800 focus:bg-white dark:focus:bg-gray-900 rounded-full border border-transparent focus:border-[#FF9900] text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none transition-all"
              />
              <Search
                size={16}
                className="absolute left-3 text-gray-400 dark:text-gray-400 pointer-events-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSearchQuery('');
                  }}
                  className="absolute right-3 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode((prev) => !prev)}
              aria-label="Toggle theme"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {darkMode ? <Sun size={18} className="text-[#FFA41C]" /> : <Moon size={18} />}
            </button>

            {/* Notification Bell */}
            <button
              onClick={() => setIsNotificationOpen(true)}
              aria-label="View notifications"
              className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <Bell size={18} />
              {unreadNotifCount > 0 && (
                <span className="absolute top-1.5 right-1.5 min-w-[16px] h-4 px-1 rounded-full bg-[#CC0C39] text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white dark:ring-[#131921] animate-pulse">
                  {unreadNotifCount}
                </span>
              )}
            </button>

            {/* Wishlist Header Icon (Desktop) */}
            <button
              onClick={() => setActiveTab('wishlist')}
              aria-label="View Wishlist"
              className="hidden md:flex relative w-10 h-10 rounded-full items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <Heart size={18} className={wishlist.length > 0 ? 'text-[#CC0C39]' : ''} />
              {wishlist.length > 0 && (
                <span className="absolute top-1.5 right-1.5 min-w-[16px] h-4 px-1 rounded-full bg-[#CC0C39] text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white dark:ring-[#131921]">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Admin / Portal Trigger */}
            <button
              onClick={() => setActiveTab(activeTab === 'admin' ? 'home' : 'admin')}
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                activeTab === 'admin'
                  ? 'bg-[#111111] dark:bg-white text-white dark:text-[#111111] border-transparent shadow-sm'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-700 hover:border-[#FF9900]'
              }`}
            >
              <ShieldCheck size={14} className="text-[#FF9900]" />
              <span>Admin</span>
            </button>

            {/* Profile Avatar / Trigger */}
            <button
              onClick={() => setActiveTab('profile')}
              aria-label="User settings"
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs border transition-all ${
                activeTab === 'profile'
                  ? 'border-[#FF9900] ring-2 ring-[#FF9900]/30 bg-[#FF9900]/10 text-[#FF9900]'
                  : 'border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
            >
              DS
            </button>
          </div>
        </div>
      </header>

      <NotificationDrawer />
    </>
  );
};
