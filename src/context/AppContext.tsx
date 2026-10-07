import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  CategoryId,
  CategoryInfo,
  DealNotification,
  AnalyticsStats,
  FilterOptions,
  SortOption,
  ClickLogEntry,
} from '../types/product';
import { INITIAL_PRODUCTS, CATEGORIES, INITIAL_NOTIFICATIONS } from '../data/initialProducts';

interface Toast {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warn';
}

interface AppContextType {
  // Navigation & UI
  activeTab: 'home' | 'deals' | 'search' | 'wishlist' | 'profile' | 'admin' | 'analytics';
  setActiveTab: (tab: 'home' | 'deals' | 'search' | 'wishlist' | 'profile' | 'admin' | 'analytics') => void;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  isNotificationOpen: boolean;
  setIsNotificationOpen: (open: boolean) => void;

  // Products
  products: Product[];
  categories: CategoryInfo[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  resetDefaultCatalog: () => void;

  // Search & Filters
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filters: FilterOptions;
  setFilters: React.Dispatch<React.SetStateAction<FilterOptions>>;
  resetFilters: () => void;
  sortOption: SortOption;
  setSortOption: (sort: SortOption) => void;
  selectCategory: (cat: CategoryId | 'all') => void;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;

  // Settings & Preferences
  currency: 'INR' | 'USD';
  setCurrency: (c: 'INR' | 'USD') => void;
  formatPrice: (priceInInr: number) => string;
  darkMode: boolean;
  setDarkMode: (val: boolean | ((prev: boolean) => boolean)) => void;
  affiliateTag: string;
  setAffiliateTag: (tag: string) => void;

  // Notifications
  notifications: DealNotification[];
  unreadNotifCount: number;
  addNotification: (title: string, message: string, badge?: string, productId?: string) => void;
  markNotifAsRead: (id: string) => void;
  markAllNotifsAsRead: () => void;

  // Analytics & Amazon Redirect
  analytics: AnalyticsStats;
  trackProductView: (productId: string) => void;
  openBuyOnAmazon: (product: Product) => void;

  // Toasts
  toasts: Toast[];
  showToast: (message: string, type?: 'info' | 'success' | 'warn') => void;
  removeToast: (id: string) => void;
}

const defaultFilters: FilterOptions = {
  category: 'all',
  minPrice: 0,
  maxPrice: 200000,
  minDiscount: 0,
  minRating: 0,
  brand: 'all',
  onlyPrime: false,
  onlyDeals: false,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PRODUCTS: 'deals_smart_products_v1',
  WISHLIST: 'deals_smart_wishlist_v1',
  DARK_MODE: 'deals_smart_dark_mode_v1',
  CURRENCY: 'deals_smart_currency_v1',
  AFFILIATE_TAG: 'deals_smart_affiliate_tag_v1',
  NOTIFICATIONS: 'deals_smart_notifs_v1',
  ANALYTICS: 'deals_smart_analytics_v1',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Products
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_PRODUCTS;
  });

  const [categories] = useState<CategoryInfo[]>(CATEGORIES);

  // Active Tab & Modal
  const [activeTab, setActiveTab] = useState<'home' | 'deals' | 'search' | 'wishlist' | 'profile' | 'admin' | 'analytics'>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterOptions>(defaultFilters);
  const [sortOption, setSortOption] = useState<SortOption>('popular');

  // Wishlist
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.WISHLIST);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return ['prod-1', 'prod-5'];
  });

  // Dark Mode
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DARK_MODE);
      if (saved !== null) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return false;
  });

  // Currency & Affiliate Tag
  const [currency, setCurrency] = useState<'INR' | 'USD'>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CURRENCY);
      if (saved === 'USD' || saved === 'INR') return saved;
    } catch {
      // ignore
    }
    return 'INR';
  });

  const [affiliateTag, setAffiliateTag] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.AFFILIATE_TAG);
      if (saved) return saved;
    } catch {
      // ignore
    }
    return 'dealssmart-21';
  });

  // Notifications
  const [notifications, setNotifications] = useState<DealNotification[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_NOTIFICATIONS;
  });

  // Analytics
  const [analytics, setAnalytics] = useState<AnalyticsStats>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ANALYTICS);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    // Initial seeded stats
    const initialClicks: Record<string, number> = {};
    const initialViews: Record<string, number> = {};
    const initialCatClicks: Record<string, number> = {};
    let totalClicks = 0;
    let totalViews = 0;

    INITIAL_PRODUCTS.forEach((p) => {
      const c = p.clicksCount || 0;
      const v = p.viewsCount || 0;
      initialClicks[p.id] = c;
      initialViews[p.id] = v;
      initialCatClicks[p.category] = (initialCatClicks[p.category] || 0) + c;
      totalClicks += c;
      totalViews += v;
    });

    return {
      totalViews,
      totalClicks,
      ctr: totalViews > 0 ? Number(((totalClicks / totalViews) * 100).toFixed(1)) : 0,
      clicksByProduct: initialClicks,
      viewsByProduct: initialViews,
      clicksByCategory: initialCatClicks,
      recentClicks: [
        {
          id: 'click-1',
          productId: 'prod-5',
          productTitle: 'Instant Pot Duo 7-in-1 Multi Cooker',
          category: 'home-kitchen',
          timestamp: '15 mins ago',
          affiliateUrl: 'https://www.amazon.in/dp/B00FLYWNYQ?tag=dealssmart-21',
        },
        {
          id: 'click-2',
          productId: 'prod-1',
          productTitle: 'Sony WH-1000XM5 ANC Headphones',
          category: 'electronics',
          timestamp: '42 mins ago',
          affiliateUrl: 'https://www.amazon.in/dp/B09XS7JWHH?tag=dealssmart-21',
        },
        {
          id: 'click-3',
          productId: 'prod-16',
          productTitle: 'Portronics Ruffpad 15M LCD Writing Pad',
          category: 'other-deals',
          timestamp: '1 hour ago',
          affiliateUrl: 'https://www.amazon.in/dp/B0CG27V5Q5?tag=dealssmart-21',
        },
      ],
    };
  });

  // Toasts
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    } catch {
      // ignore
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(wishlist));
    } catch {
      // ignore
    }
  }, [wishlist]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.DARK_MODE, JSON.stringify(darkMode));
    } catch {
      // ignore
    }
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CURRENCY, currency);
    } catch {
      // ignore
    }
  }, [currency]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.AFFILIATE_TAG, affiliateTag);
    } catch {
      // ignore
    }
  }, [affiliateTag]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
    } catch {
      // ignore
    }
  }, [notifications]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ANALYTICS, JSON.stringify(analytics));
    } catch {
      // ignore
    }
  }, [analytics]);

  const showToast = (message: string, type: 'info' | 'success' | 'warn' = 'info') => {
    const id = `${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    setToasts((prev) => [...prev.slice(-3), { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Price formatting
  const formatPrice = (priceInInr: number): string => {
    if (currency === 'USD') {
      const usdVal = priceInInr / 83.5;
      return `$${usdVal.toLocaleString('en-US', { minimumFractionDigits: usdVal < 10 ? 2 : 0, maximumFractionDigits: 2 })}`;
    }
    return `₹${priceInInr.toLocaleString('en-IN')}`;
  };

  // Wishlist handler
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      if (prev.includes(productId)) {
        showToast('Removed from Wishlist', 'info');
        return prev.filter((id) => id !== productId);
      } else {
        showToast('Added to Wishlist ❤️', 'success');
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const clearWishlist = () => {
    setWishlist([]);
    showToast('Wishlist cleared', 'info');
  };

  // Reset filters
  const resetFilters = () => {
    setFilters(defaultFilters);
    setSearchQuery('');
  };

  const selectCategory = (cat: CategoryId | 'all') => {
    setFilters((prev) => ({ ...prev, category: cat }));
  };

  // Analytics & Buy on Amazon
  const trackProductView = (productId: string) => {
    setAnalytics((prev) => {
      const currentViews = (prev.viewsByProduct[productId] || 0) + 1;
      const totalViews = prev.totalViews + 1;
      const ctr = totalViews > 0 ? Number(((prev.totalClicks / totalViews) * 100).toFixed(1)) : 0;
      return {
        ...prev,
        totalViews,
        ctr,
        viewsByProduct: {
          ...prev.viewsByProduct,
          [productId]: currentViews,
        },
      };
    });

    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, viewsCount: (p.viewsCount || 0) + 1 } : p))
    );
  };

  const buildAffiliateUrl = (product: Product): string => {
    let url = product.affiliateUrl || product.amazonUrl || 'https://www.amazon.com';
    try {
      const urlObj = new URL(url);
      urlObj.searchParams.set('tag', affiliateTag);
      return urlObj.toString();
    } catch {
      if (url.includes('?')) {
        return `${url}&tag=${affiliateTag}`;
      }
      return `${url}?tag=${affiliateTag}`;
    }
  };

  const openBuyOnAmazon = (product: Product) => {
    const finalUrl = buildAffiliateUrl(product);

    // Track analytics
    const newEntry: ClickLogEntry = {
      id: `click-${Date.now()}`,
      productId: product.id,
      productTitle: product.title,
      category: product.category,
      timestamp: 'Just now',
      affiliateUrl: finalUrl,
    };

    setAnalytics((prev) => {
      const totalClicks = prev.totalClicks + 1;
      const productClicks = (prev.clicksByProduct[product.id] || 0) + 1;
      const catClicks = (prev.clicksByCategory[product.category] || 0) + 1;
      const ctr = prev.totalViews > 0 ? Number(((totalClicks / prev.totalViews) * 100).toFixed(1)) : 0;

      return {
        ...prev,
        totalClicks,
        ctr,
        clicksByProduct: {
          ...prev.clicksByProduct,
          [product.id]: productClicks,
        },
        clicksByCategory: {
          ...prev.clicksByCategory,
          [product.category]: catClicks,
        },
        recentClicks: [newEntry, ...prev.recentClicks.slice(0, 19)],
      };
    });

    setProducts((prev) =>
      prev.map((p) => (p.id === product.id ? { ...p, clicksCount: (p.clicksCount || 0) + 1 } : p))
    );

    showToast(`Redirecting to Amazon... 🛒`, 'success');

    // Safe open in external window
    setTimeout(() => {
      window.open(finalUrl, '_blank', 'noopener,noreferrer');
    }, 250);
  };

  // Product management (Admin)
  const addProduct = (newProdData: Omit<Product, 'id' | 'createdAt'>) => {
    const id = `prod-${Date.now()}`;
    const newProd: Product = {
      ...newProdData,
      id,
      createdAt: new Date().toISOString(),
      viewsCount: 0,
      clicksCount: 0,
    };
    setProducts((prev) => [newProd, ...prev]);
    showToast('New deal added successfully! 🎉', 'success');
  };

  const updateProduct = (id: string, updatedFields: Partial<Product>) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updatedFields } : p)));
    if (selectedProduct && selectedProduct.id === id) {
      setSelectedProduct((prev) => (prev ? { ...prev, ...updatedFields } : null));
    }
    showToast('Deal updated successfully! ✨', 'success');
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    if (selectedProduct && selectedProduct.id === id) {
      setSelectedProduct(null);
    }
    showToast('Product removed from deals catalog', 'info');
  };

  const resetDefaultCatalog = () => {
    setProducts(INITIAL_PRODUCTS);
    showToast('Reset to original Amazon deals catalog', 'info');
  };

  // Notification management
  const addNotification = (title: string, message: string, badge?: string, productId?: string) => {
    const newNotif: DealNotification = {
      id: `notif-${Date.now()}`,
      title,
      message,
      timestamp: 'Just now',
      read: false,
      badge: badge || 'Alert',
      productId,
    };
    setNotifications((prev) => [newNotif, ...prev]);
    showToast(`Broadcast sent: ${title}`, 'info');
  };

  const markNotifAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotifsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('All notifications marked as read', 'info');
  };

  const unreadNotifCount = notifications.filter((n) => !n.read).length;

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        selectedProduct,
        setSelectedProduct,
        isNotificationOpen,
        setIsNotificationOpen,
        products,
        categories,
        addProduct,
        updateProduct,
        deleteProduct,
        resetDefaultCatalog,
        searchQuery,
        setSearchQuery,
        filters,
        setFilters,
        resetFilters,
        sortOption,
        setSortOption,
        selectCategory,
        wishlist,
        toggleWishlist,
        isInWishlist,
        clearWishlist,
        currency,
        setCurrency,
        formatPrice,
        darkMode,
        setDarkMode,
        affiliateTag,
        setAffiliateTag,
        notifications,
        unreadNotifCount,
        addNotification,
        markNotifAsRead,
        markAllNotifsAsRead,
        analytics,
        trackProductView,
        openBuyOnAmazon,
        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
