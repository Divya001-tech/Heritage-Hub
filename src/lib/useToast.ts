import { create } from 'zustand';
import { ToastItem, ToastType } from '../types';

interface ToastStore {
  toasts: ToastItem[];
  addToast: (type: ToastType, title: string, message?: string, duration?: number) => string;
  removeToast: (id: string) => void;
  clearAll: () => void;
}

export const useToast = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (type, title, message, duration = 4000) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    const newToast: ToastItem = { id, type, title, message, duration };

    set((state) => ({
      toasts: [...state.toasts, newToast],
    }));

    if (duration > 0) {
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }));
      }, duration);
    }

    return id;
  },
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
  clearAll: () => set({ toasts: [] }),
}));

// Convenience shortcuts
export const toast = {
  success: (title: string, message?: string) => useToast.getState().addToast('success', title, message),
  error: (title: string, message?: string) => useToast.getState().addToast('error', title, message, 6000),
  info: (title: string, message?: string) => useToast.getState().addToast('info', title, message),
  warning: (title: string, message?: string) => useToast.getState().addToast('warning', title, message, 5000),
};
