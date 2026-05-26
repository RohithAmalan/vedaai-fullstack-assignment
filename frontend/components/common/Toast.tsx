'use client';

import { useEffect } from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ToastProps {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  onRemove: (id: string) => void;
}

const icons = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
};

const styles = {
  success: 'bg-white border-green-200 text-green-800',
  error: 'bg-white border-red-200 text-red-800',
  info: 'bg-white border-blue-200 text-blue-800',
};

const iconStyles = {
  success: 'text-green-500',
  error: 'text-red-500',
  info: 'text-blue-500',
};

export function ToastItem({ id, message, type, onRemove }: ToastProps) {
  const Icon = icons[type];

  useEffect(() => {
    const t = setTimeout(() => onRemove(id), 4000);
    return () => clearTimeout(t);
  }, [id, onRemove]);

  return (
    <div
      className={cn(
        'flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg min-w-[280px] max-w-sm',
        styles[type]
      )}
    >
      <Icon size={18} className={cn('flex-shrink-0', iconStyles[type])} />
      <p className="text-sm font-medium flex-1">{message}</p>
      <button onClick={() => onRemove(id)} className="p-0.5 rounded text-gray-400 hover:text-gray-600">
        <X size={14} />
      </button>
    </div>
  );
}

type ToastData = Omit<ToastProps, 'onRemove'>;

export function ToastContainer({ toasts, onRemove }: { toasts: ToastData[]; onRemove: (id: string) => void }) {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} {...toast} onRemove={onRemove} />
      ))}
    </div>
  );
}
