import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-16 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-xl border border-gray-100 dark:border-gray-700 animate-in fade-in slide-in-from-top-4 duration-200"
        >
          <div className="flex items-center gap-2.5">
            {toast.type === 'success' && <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />}
            {toast.type === 'warn' && <AlertCircle size={18} className="text-amber-500 shrink-0" />}
            {toast.type === 'info' && <Info size={18} className="text-[#007185] shrink-0" />}
            <span className="text-xs sm:text-sm font-medium">{toast.message}</span>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 rounded-lg"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
};
