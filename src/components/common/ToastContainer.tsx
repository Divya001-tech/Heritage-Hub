import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { useToast } from '../../lib/useToast';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div
      aria-live="polite"
      aria-label="Notifications"
      className="fixed bottom-24 right-4 sm:bottom-6 sm:right-6 z-[9999] flex flex-col gap-2 max-w-sm w-full pointer-events-none"
    >
      <AnimatePresence>
        {toasts.map((toast) => {
          let bgClass = 'bg-white dark:bg-[#1A1612] border-stone-200 dark:border-[#332C24] text-stone-900 dark:text-stone-100';
          let Icon = Info;
          let iconColor = 'text-[#C85A17]';

          if (toast.type === 'success') {
            bgClass = 'bg-white dark:bg-[#1A1612] border-[#2E6F40]/30 text-stone-900 dark:text-stone-100 shadow-emerald-500/10';
            Icon = CheckCircle2;
            iconColor = 'text-[#2E6F40]';
          } else if (toast.type === 'error') {
            bgClass = 'bg-white dark:bg-[#1A1612] border-red-500/40 text-stone-900 dark:text-stone-100 shadow-red-500/10';
            Icon = AlertCircle;
            iconColor = 'text-red-500';
          } else if (toast.type === 'warning') {
            bgClass = 'bg-white dark:bg-[#1A1612] border-amber-500/40 text-stone-900 dark:text-stone-100 shadow-amber-500/10';
            Icon = AlertTriangle;
            iconColor = 'text-amber-500';
          }

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={`pointer-events-auto p-4 rounded-xl border shadow-xl flex items-start gap-3 backdrop-blur-md ${bgClass}`}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${iconColor}`} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold font-heading leading-tight">{toast.title}</p>
                {toast.message && (
                  <p className="text-[11px] text-stone-600 dark:text-stone-400 mt-0.5 leading-snug break-words">
                    {toast.message}
                  </p>
                )}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 transition-colors p-1"
                aria-label="Dismiss notification"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
