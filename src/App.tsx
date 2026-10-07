/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/header/Header';
import { BottomNav } from './components/navigation/BottomNav';
import { ToastContainer } from './components/common/Toast';
import { HomeView } from './components/home/HomeView';
import { DealsView } from './components/deals/DealsView';
import { SearchView } from './components/search/SearchView';
import { WishlistView } from './components/wishlist/WishlistView';
import { ProfileView } from './components/profile/ProfileView';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AnalyticsDashboard } from './components/analytics/AnalyticsDashboard';
import { ProductDetailsModal } from './components/product/ProductDetailsModal';
import { Logo } from './components/common/Logo';
import { ShieldCheck, Heart, Sparkles, ExternalLink } from 'lucide-react';

const MainContent: React.FC = () => {
  const { activeTab, setActiveTab } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA] dark:bg-[#0F141C] text-[#111111] dark:text-gray-100 transition-colors">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 pt-2 sm:pt-4">
        {activeTab === 'home' && <HomeView />}
        {activeTab === 'deals' && <DealsView />}
        {activeTab === 'search' && <SearchView />}
        {activeTab === 'wishlist' && <WishlistView />}
        {activeTab === 'profile' && <ProfileView />}
        {activeTab === 'admin' && <AdminDashboard />}
        {activeTab === 'analytics' && <AnalyticsDashboard />}
      </main>

      {/* Global Product Details Modal */}
      <ProductDetailsModal />

      {/* Toast Alert Notifications */}
      <ToastContainer />

      {/* Mobile Bottom Navigation */}
      <BottomNav />

      {/* Responsive Footer */}
      <footer className="mt-auto border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-[#131921] py-8 px-4 sm:px-8 mb-16 md:mb-0">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <Logo size="md" showTagline={true} />
            <p className="mt-2 text-xs text-gray-500 max-w-md">
              Your intelligent destination for verified Amazon deals, lightning discounts, price drops, and curated shopping specials.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex items-center gap-6 text-xs font-semibold text-gray-600 dark:text-gray-400">
            <button
              onClick={() => setActiveTab('home')}
              className="hover:text-[#FF9900] transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => setActiveTab('deals')}
              className="hover:text-[#FF9900] transition-colors"
            >
              Today's Deals
            </button>
            <button
              onClick={() => setActiveTab('search')}
              className="hover:text-[#FF9900] transition-colors"
            >
              Search
            </button>
            <button
              onClick={() => setActiveTab('admin')}
              className="hover:text-[#FF9900] transition-colors"
            >
              Admin
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className="hover:text-[#FF9900] transition-colors"
            >
              Analytics
            </button>
          </div>
        </div>

        {/* Affiliate Disclosure Notice */}
        <div className="max-w-7xl mx-auto mt-6 pt-6 border-t border-gray-100 dark:border-gray-800/80 text-center">
          <p className="text-[11px] text-gray-400 dark:text-gray-500 max-w-3xl mx-auto leading-relaxed">
            Amazon Associate Disclosure: As an Amazon Associate, Deals Smart Shopping earns from qualifying purchases. Product prices, availability, and discounts are accurate as of the date/time indicated and are subject to change by Amazon.
          </p>
          <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-2">
            © {new Date().getFullYear()} Deals Smart Shopping. All rights reserved. Amazon and the Amazon logo are trademarks of Amazon.com, Inc. or its affiliates.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
