export type CategoryId =
  | 'electronics'
  | 'mobiles'
  | 'laptops'
  | 'fashion'
  | 'home-kitchen'
  | 'beauty'
  | 'grocery'
  | 'accessories'
  | 'fitness'
  | 'kids'
  | 'other-deals';

export interface CategoryInfo {
  id: CategoryId;
  name: string;
  icon: string;
  description: string;
  count?: number;
}

export interface Product {
  id: string;
  title: string;
  shortDescription: string;
  description: string;
  image: string;
  galleryImages: string[];
  originalPrice: number;
  dealPrice: number;
  discountPercentage: number;
  currency: 'INR' | 'USD';
  category: CategoryId;
  brand: string;
  rating: number;
  reviewCount: number;
  amazonUrl: string;
  affiliateUrl: string;
  isFeatured: boolean;
  isTrending: boolean;
  isDeal: boolean; // Today's Deal
  isLightningDeal?: boolean;
  dealEndsAt?: string; // ISO date string
  primeEligible?: boolean;
  stockStatus?: 'In Stock' | 'Only 3 Left' | 'Limited Quantity';
  keyFeatures: string[];
  pros: string[];
  cons: string[];
  createdAt: string;
  viewsCount?: number;
  clicksCount?: number;
}

export interface DealNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  productId?: string;
  badge?: string;
}

export interface ClickLogEntry {
  id: string;
  productId: string;
  productTitle: string;
  category: CategoryId;
  timestamp: string;
  affiliateUrl: string;
}

export interface AnalyticsStats {
  totalViews: number;
  totalClicks: number;
  ctr: number;
  clicksByProduct: Record<string, number>;
  viewsByProduct: Record<string, number>;
  clicksByCategory: Record<string, number>;
  recentClicks: ClickLogEntry[];
}

export type SortOption =
  | 'popular'
  | 'newest'
  | 'price-asc'
  | 'price-desc'
  | 'highest-discount'
  | 'highest-rated';

export interface FilterOptions {
  category: CategoryId | 'all';
  minPrice: number;
  maxPrice: number;
  minDiscount: number;
  minRating: number;
  brand: string | 'all';
  onlyPrime: boolean;
  onlyDeals: boolean;
}
