import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Product, CategoryId } from '../../types/product';
import {
  Plus,
  Edit2,
  Trash2,
  ShieldCheck,
  RotateCcw,
  Bell,
  Sparkles,
  ExternalLink,
  Flame,
  X,
  Check,
  Send,
} from 'lucide-react';

interface ProductFormData {
  title: string;
  brand: string;
  category: CategoryId;
  shortDescription: string;
  description: string;
  image: string;
  originalPrice: number;
  dealPrice: number;
  discountPercentage: number;
  rating: number;
  reviewCount: number;
  amazonUrl: string;
  affiliateUrl: string;
  isFeatured: boolean;
  isTrending: boolean;
  isDeal: boolean;
  isLightningDeal: boolean;
  primeEligible: boolean;
  stockStatus: 'In Stock' | 'Only 3 Left' | 'Limited Quantity';
  keyFeatures: string;
  pros: string;
  cons: string;
}

const emptyForm: ProductFormData = {
  title: '',
  brand: '',
  category: 'electronics',
  shortDescription: '',
  description: '',
  image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
  originalPrice: 4999,
  dealPrice: 2499,
  discountPercentage: 50,
  rating: 4.5,
  reviewCount: 1200,
  amazonUrl: 'https://www.amazon.in/dp/B09XS7JWHH',
  affiliateUrl: 'https://www.amazon.in/dp/B09XS7JWHH?tag=dealssmart-21',
  isFeatured: true,
  isTrending: true,
  isDeal: true,
  isLightningDeal: false,
  primeEligible: true,
  stockStatus: 'In Stock',
  keyFeatures: 'High performance device\nFast USB-C charging\nDurable build quality',
  pros: 'Great value for money\nPremium aesthetics',
  cons: 'Limited stock available',
};

export const AdminDashboard: React.FC = () => {
  const {
    products,
    categories,
    addProduct,
    updateProduct,
    deleteProduct,
    resetDefaultCatalog,
    formatPrice,
    addNotification,
    affiliateTag,
    setAffiliateTag,
    showToast,
  } = useApp();

  const [activeAdminTab, setActiveAdminTab] = useState<'products' | 'notifications' | 'affiliate'>('products');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<ProductFormData>(emptyForm);

  // Notification Broadcast Form State
  const [notifTitle, setNotifTitle] = useState('🔥 New Amazon Deal Alert!');
  const [notifMessage, setNotifMessage] = useState('Huge 50% discount live on electronics right now!');
  const [notifBadge, setNotifBadge] = useState('50% OFF');

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingId(product.id);
    setFormData({
      title: product.title,
      brand: product.brand,
      category: product.category,
      shortDescription: product.shortDescription || '',
      description: product.description,
      image: product.image,
      originalPrice: product.originalPrice,
      dealPrice: product.dealPrice,
      discountPercentage: product.discountPercentage,
      rating: product.rating,
      reviewCount: product.reviewCount,
      amazonUrl: product.amazonUrl,
      affiliateUrl: product.affiliateUrl,
      isFeatured: product.isFeatured,
      isTrending: product.isTrending,
      isDeal: product.isDeal,
      isLightningDeal: !!product.isLightningDeal,
      primeEligible: !!product.primeEligible,
      stockStatus: product.stockStatus || 'In Stock',
      keyFeatures: product.keyFeatures ? product.keyFeatures.join('\n') : '',
      pros: product.pros ? product.pros.join('\n') : '',
      cons: product.cons ? product.cons.join('\n') : '',
    });
    setIsModalOpen(true);
  };

  const handlePriceChange = (orig: number, deal: number) => {
    let disc = 0;
    if (orig > 0 && deal > 0 && orig > deal) {
      disc = Math.round(((orig - deal) / orig) * 100);
    }
    setFormData((prev) => ({
      ...prev,
      originalPrice: orig,
      dealPrice: deal,
      discountPercentage: disc,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showToast('Product title is required', 'warn');
      return;
    }

    const keyFeatures = formData.keyFeatures
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
    const pros = formData.pros
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
    const cons = formData.cons
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const productPayload = {
      title: formData.title,
      brand: formData.brand || 'Generic',
      category: formData.category,
      shortDescription: formData.shortDescription || formData.title,
      description: formData.description || formData.title,
      image: formData.image,
      galleryImages: [formData.image],
      originalPrice: Number(formData.originalPrice),
      dealPrice: Number(formData.dealPrice),
      discountPercentage: Number(formData.discountPercentage),
      currency: 'INR' as const,
      rating: Number(formData.rating),
      reviewCount: Number(formData.reviewCount),
      amazonUrl: formData.amazonUrl,
      affiliateUrl:
        formData.affiliateUrl ||
        `${formData.amazonUrl}${formData.amazonUrl.includes('?') ? '&' : '?'}tag=${affiliateTag}`,
      isFeatured: formData.isFeatured,
      isTrending: formData.isTrending,
      isDeal: formData.isDeal,
      isLightningDeal: formData.isLightningDeal,
      primeEligible: formData.primeEligible,
      stockStatus: formData.stockStatus,
      keyFeatures: keyFeatures.length ? keyFeatures : ['Amazon Verified Product', 'Fast Delivery'],
      pros: pros.length ? pros : ['Authentic seller'],
      cons: cons.length ? cons : ['Limited quantities'],
    };

    if (editingId) {
      updateProduct(editingId, productPayload);
    } else {
      addProduct(productPayload);
    }

    setIsModalOpen(false);
  };

  const handleBroadcastNotification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifTitle.trim() || !notifMessage.trim()) return;
    addNotification(notifTitle, notifMessage, notifBadge);
  };

  return (
    <div className="space-y-5 pb-20">
      {/* Top Banner */}
      <div className="p-4 sm:p-6 rounded-2xl bg-white dark:bg-gray-850 border border-gray-200/80 dark:border-gray-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-[#111111] dark:bg-white text-white dark:text-[#111111] flex items-center justify-center">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                Admin Management Console
              </h1>
              <p className="text-xs text-gray-500">
                Manage Amazon affiliate products, deal badges, push alerts and affiliate tags
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={resetDefaultCatalog}
            className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw size={14} />
            <span>Reset Catalog</span>
          </button>

          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 rounded-xl bg-[#FF9900] hover:bg-[#E68A00] text-[#111111] font-bold text-xs flex items-center gap-1.5 shadow-md shadow-[#FF9900]/20 transition-all cursor-pointer"
          >
            <Plus size={16} />
            <span>Add New Deal</span>
          </button>
        </div>
      </div>

      {/* Admin Subtabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 dark:border-gray-800 pb-2">
        <button
          onClick={() => setActiveAdminTab('products')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
            activeAdminTab === 'products'
              ? 'bg-[#111111] dark:bg-white text-white dark:text-[#111111]'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          Products Catalog ({products.length})
        </button>
        <button
          onClick={() => setActiveAdminTab('notifications')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
            activeAdminTab === 'notifications'
              ? 'bg-[#111111] dark:bg-white text-white dark:text-[#111111]'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          Deal Push Broadcasts
        </button>
        <button
          onClick={() => setActiveAdminTab('affiliate')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
            activeAdminTab === 'affiliate'
              ? 'bg-[#111111] dark:bg-white text-white dark:text-[#111111]'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          Affiliate Tag Settings
        </button>
      </div>

      {/* Tab: Products List */}
      {activeAdminTab === 'products' && (
        <div className="bg-white dark:bg-gray-850 rounded-2xl border border-gray-200/80 dark:border-gray-800 overflow-hidden shadow-xs">
          <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <h2 className="text-sm font-bold text-gray-900 dark:text-white">
              All Listed Deals ({products.length})
            </h2>
            <span className="text-xs text-gray-400">Manage pricing, URLs & badges</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800 text-gray-400 font-semibold bg-gray-50/50 dark:bg-gray-900/50">
                  <th className="py-2.5 px-3">Product</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Deal Price</th>
                  <th className="py-2.5 px-3">Discount</th>
                  <th className="py-2.5 px-3">Badges</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/40">
                    <td className="py-3 px-3 max-w-xs">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={product.image}
                          alt={product.title}
                          className="w-10 h-10 object-contain rounded-lg bg-gray-100 dark:bg-gray-800 p-1 shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 dark:text-white truncate">
                            {product.title}
                          </p>
                          <p className="text-[11px] text-gray-400">{product.brand}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 capitalize text-gray-500">
                      {product.category.replace('-', ' ')}
                    </td>
                    <td className="py-3 px-3 font-bold text-gray-900 dark:text-white tabular-nums">
                      {formatPrice(product.dealPrice)}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded font-extrabold bg-[#CC0C39]/10 text-[#CC0C39] text-[11px]">
                        -{product.discountPercentage}%
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1 flex-wrap">
                        {product.isDeal && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 font-semibold">
                            Today's Deal
                          </span>
                        )}
                        {product.isLightningDeal && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-100 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 font-semibold">
                            ⚡ Lightning
                          </span>
                        )}
                        {product.isFeatured && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-100 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 font-semibold">
                            Featured
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(product)}
                          aria-label="Edit deal"
                          className="p-1.5 rounded-lg text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => deleteProduct(product.id)}
                          aria-label="Delete deal"
                          className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Push Notifications Broadcast */}
      {activeAdminTab === 'notifications' && (
        <div className="bg-white dark:bg-gray-850 p-5 rounded-2xl border border-gray-200/80 dark:border-gray-800 shadow-xs max-w-xl space-y-4">
          <div className="flex items-center gap-2">
            <Bell size={20} className="text-[#FF9900]" />
            <h2 className="text-sm font-bold text-gray-900 dark:text-white">
              Create & Broadcast Deal Notification
            </h2>
          </div>
          <p className="text-xs text-gray-500">
            Push instant deal alerts to users (simulated locally and displayed in the bell drawer).
          </p>

          {/* Quick preset templates */}
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-gray-500">Quick Templates:</span>
            <div className="flex items-center gap-2 flex-wrap">
              {[
                { title: '🔥 New Amazon Deal Alert!', msg: 'Huge price cut on electronics!', badge: 'Deal Alert' },
                { title: '💥 70% OFF – Limited Time Deal!', msg: 'Clearance sale live right now!', badge: '70% OFF' },
                { title: "⚡ Don't miss today's best deals!", msg: 'Lightning deals expire in 2 hours!', badge: 'Flash' },
              ].map((tmpl, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setNotifTitle(tmpl.title);
                    setNotifMessage(tmpl.msg);
                    setNotifBadge(tmpl.badge);
                  }}
                  className="px-2.5 py-1 rounded-lg text-xs bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                >
                  {tmpl.title}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleBroadcastNotification} className="space-y-3 pt-2">
            <div>
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                Notification Headline
              </label>
              <input
                type="text"
                value={notifTitle}
                onChange={(e) => setNotifTitle(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs"
                placeholder="🔥 New Amazon Deal Alert!"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                Message Body
              </label>
              <textarea
                value={notifMessage}
                onChange={(e) => setNotifMessage(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs h-20"
                placeholder="Product dropped by 50%..."
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                Alert Badge Tag
              </label>
              <input
                type="text"
                value={notifBadge}
                onChange={(e) => setNotifBadge(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs"
                placeholder="50% OFF / Flash"
              />
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#FF9900] text-[#111111] font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md shadow-[#FF9900]/20"
            >
              <Send size={14} />
              <span>Broadcast Deal Alert</span>
            </button>
          </form>
        </div>
      )}

      {/* Tab: Affiliate Tag Settings */}
      {activeAdminTab === 'affiliate' && (
        <div className="bg-white dark:bg-gray-850 p-5 rounded-2xl border border-gray-200/80 dark:border-gray-800 shadow-xs max-w-xl space-y-4">
          <h2 className="text-sm font-bold text-gray-900 dark:text-white">
            Amazon Associates Tracking Tag
          </h2>
          <p className="text-xs text-gray-500">
            This tag is dynamically attached to all "Buy on Amazon" redirect links across the application.
          </p>

          <div className="flex items-center gap-3">
            <input
              type="text"
              value={affiliateTag}
              onChange={(e) => setAffiliateTag(e.target.value)}
              className="flex-1 p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs font-mono font-bold"
              placeholder="dealssmart-21"
            />
            <button
              onClick={() => showToast('Affiliate tracking tag updated! ✅', 'success')}
              className="px-4 py-2.5 rounded-xl bg-[#111111] dark:bg-white text-white dark:text-[#111111] text-xs font-bold"
            >
              Save Tag
            </button>
          </div>

          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 text-xs text-amber-800 dark:text-amber-300">
            Current affiliate link pattern preview:
            <code className="block mt-1 font-mono text-[11px] break-all bg-white/70 dark:bg-gray-900/70 p-2 rounded">
              https://www.amazon.in/dp/B09XS7JWHH?tag={affiliateTag}
            </code>
          </div>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
          <div
            className="fixed inset-0"
            onClick={() => setIsModalOpen(false)}
          />

          <div className="relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-3xl shadow-2xl z-10 flex flex-col max-h-[90vh] overflow-hidden border border-gray-200 dark:border-gray-800">
            {/* Header */}
            <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
              <h2 className="text-base font-bold text-gray-900 dark:text-white">
                {editingId ? 'Edit Amazon Deal' : 'Add New Amazon Deal'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            {/* Scrollable Form */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
              {/* Title */}
              <div>
                <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                  Product Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Sony WH-1000XM5 Wireless Headphones"
                  className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
                  required
                />
              </div>

              {/* Brand & Category */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                    Brand
                  </label>
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    placeholder="Sony, Apple, Samsung..."
                    className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
                  />
                </div>

                <div>
                  <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value as CategoryId })
                    }
                    className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 capitalize"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Pricing */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                    Original Price (₹)
                  </label>
                  <input
                    type="number"
                    value={formData.originalPrice}
                    onChange={(e) =>
                      handlePriceChange(Number(e.target.value), formData.dealPrice)
                    }
                    className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
                  />
                </div>

                <div>
                  <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                    Deal Price (₹) *
                  </label>
                  <input
                    type="number"
                    value={formData.dealPrice}
                    onChange={(e) =>
                      handlePriceChange(formData.originalPrice, Number(e.target.value))
                    }
                    className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 font-bold text-[#CC0C39]"
                    required
                  />
                </div>

                <div>
                  <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                    Discount %
                  </label>
                  <input
                    type="number"
                    value={formData.discountPercentage}
                    onChange={(e) =>
                      setFormData({ ...formData, discountPercentage: Number(e.target.value) })
                    }
                    className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
                  />
                </div>
              </div>

              {/* Rating & Reviews */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                    Star Rating (1 - 5)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
                  />
                </div>

                <div>
                  <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                    Review Count
                  </label>
                  <input
                    type="number"
                    value={formData.reviewCount}
                    onChange={(e) =>
                      setFormData({ ...formData, reviewCount: Number(e.target.value) })
                    }
                    className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
                  />
                </div>
              </div>

              {/* Image URL */}
              <div>
                <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                  Product Image URL
                </label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
                />
              </div>

              {/* Amazon URLs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                    Amazon Product URL *
                  </label>
                  <input
                    type="text"
                    value={formData.amazonUrl}
                    onChange={(e) => setFormData({ ...formData, amazonUrl: e.target.value })}
                    placeholder="https://www.amazon.in/dp/..."
                    className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
                    required
                  />
                </div>

                <div>
                  <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                    Affiliate URL (or leave blank to auto-append tag)
                  </label>
                  <input
                    type="text"
                    value={formData.affiliateUrl}
                    onChange={(e) => setFormData({ ...formData, affiliateUrl: e.target.value })}
                    placeholder="https://www.amazon.in/dp/...?tag=dealssmart-21"
                    className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
                />
              </div>

              {/* Key Features (line by line) */}
              <div>
                <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                  Key Features (One bullet per line)
                </label>
                <textarea
                  value={formData.keyFeatures}
                  onChange={(e) => setFormData({ ...formData, keyFeatures: e.target.value })}
                  rows={3}
                  className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
                />
              </div>

              {/* Badges and Flags */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isDeal}
                    onChange={(e) => setFormData({ ...formData, isDeal: e.target.checked })}
                    className="accent-[#FF9900]"
                  />
                  <span>Today's Deal</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isLightningDeal}
                    onChange={(e) =>
                      setFormData({ ...formData, isLightningDeal: e.target.checked })
                    }
                    className="accent-[#FF9900]"
                  />
                  <span>Lightning Deal</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isTrending}
                    onChange={(e) => setFormData({ ...formData, isTrending: e.target.checked })}
                    className="accent-[#FF9900]"
                  />
                  <span>Trending</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="accent-[#FF9900]"
                  />
                  <span>Featured</span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#FF9900] text-[#111111] font-bold shadow-md shadow-[#FF9900]/20"
                >
                  {editingId ? 'Save Changes' : 'Publish Deal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
