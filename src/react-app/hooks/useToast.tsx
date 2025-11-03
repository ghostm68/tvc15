import { useState, useCallback } from 'react';
import { ToastProps } from '@/react-app/components/Toast';

export interface ToastData {
  type: 'success' | 'error' | 'info';
  message: string;
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const addToast = useCallback((data: ToastData) => {
    const id = Date.now().toString();
    const newToast: ToastProps = {
      id,
      ...data,
      onClose: removeToast,
    };
    setToasts(prev => [...prev, newToast]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  return {
    toasts,
    addToast,
    removeToast,
  };
}
