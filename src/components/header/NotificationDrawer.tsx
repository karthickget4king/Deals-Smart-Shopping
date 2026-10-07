import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, Bell, CheckCheck, Flame, ExternalLink } from 'lucide-react';

export const NotificationDrawer: React.FC = () => {
  const {
    isNotificationOpen,
    setIsNotificationOpen,
    notifications,
    markNotifAsRead,
    markAllNotifsAsRead,
    products,
    setSelectedProduct,
  } = useApp();

  if (!isNotificationOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      {/* Backdrop tap to close */}
      <div
        className="fixed inset-0"
        onClick={() => setIsNotificationOpen(false)}
      />

      <div className="relative w-full max-w-md bg-white dark:bg-gray-900 h-full shadow-2xl flex flex-col z-10 border-l border-gray-100 dark:border-gray-800">
        {/* Header */}
        <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-gray-850">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#FF9900]/10 text-[#FF9900] flex items-center justify-center">
              <Bell size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900 dark:text-white">
                Deal Alerts & Drops
              </h2>
              <p className="text-xs text-gray-500">Live Amazon price drops & updates</p>
            </div>
          </div>
          <button
            onClick={() => setIsNotificationOpen(false)}
            className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X size={20} />
          </button>
        </div>

        {/* Actions bar */}
        <div className="px-4 py-2.5 bg-gray-50 dark:bg-gray-800/60 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs">
          <span className="text-gray-500">
            {notifications.filter((n) => !n.read).length} unread alerts
          </span>
          <button
            onClick={markAllAll => markAllNotifsAsRead()}
            className="text-[#007185] dark:text-[#56BED4] hover:underline flex items-center gap-1 font-semibold"
          >
            <CheckCheck size={14} />
            Mark all read
          </button>
        </div>

        {/* List of notifications */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.length === 0 ? (
            <div className="py-12 text-center text-gray-400">
              <Bell size={36} className="mx-auto mb-2 opacity-40" />
              <p className="text-sm font-medium">No new deal alerts right now</p>
              <p className="text-xs text-gray-500 mt-1">We will alert you when top price cuts happen!</p>
            </div>
          ) : (
            notifications.map((notif) => {
              const matchedProduct = notif.productId
                ? products.find((p) => p.id === notif.productId)
                : null;

              return (
                <div
                  key={notif.id}
                  onClick={() => {
                    markNotifAsRead(notif.id);
                    if (matchedProduct) {
                      setSelectedProduct(matchedProduct);
                      setIsNotificationOpen(false);
                    }
                  }}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    notif.read
                      ? 'bg-white dark:bg-gray-800/40 border-gray-100 dark:border-gray-800/80 text-gray-700 dark:text-gray-300'
                      : 'bg-[#FFF8E7] dark:bg-amber-950/20 border-[#FFD814]/40 text-gray-900 dark:text-gray-100 shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="font-bold text-sm flex items-center gap-1.5">
                      {notif.title}
                    </span>
                    {notif.badge && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#CC0C39] text-white shrink-0">
                        {notif.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed mb-2">
                    {notif.message}
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-gray-400 dark:text-gray-500 pt-1 border-t border-gray-100/60 dark:border-gray-700/40">
                    <span>{notif.timestamp}</span>
                    {matchedProduct && (
                      <span className="text-[#007185] dark:text-[#56BED4] font-semibold flex items-center gap-1">
                        View Deal <ExternalLink size={10} />
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-center text-[11px] text-gray-500">
          Deals Smart alerts are tracked directly from Amazon promotions.
        </div>
      </div>
    </div>
  );
};
