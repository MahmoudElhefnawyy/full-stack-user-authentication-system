import { useState, useCallback } from 'react';

type ToastVariant = 'success' | 'error';

interface ToastState {
  message: string;
  variant: ToastVariant;
  visible: boolean;
}

export function useToast() {
  const [toast, setToast] = useState<ToastState>({
    message: '',
    variant: 'success',
    visible: false,
  });

  const showToast = useCallback((message: string, variant: ToastVariant = 'success') => {
    setToast({ message, variant, visible: true });
    setTimeout(() => setToast((t) => ({ ...t, visible: false })), 4000);
  }, []);

  return { toast, showToast };
}

interface ToastProps {
  message: string;
  variant: ToastVariant;
  visible: boolean;
}

export function Toast({ message, variant, visible }: ToastProps) {
  const colors =
    variant === 'success'
      ? 'bg-emerald-500/90 border-emerald-400'
      : 'bg-red-500/90 border-red-400';

  const icon = variant === 'success' ? '✓' : '✕';

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={`
        fixed top-5 right-5 z-50 flex items-center gap-3 px-4 py-3
        rounded-xl border backdrop-blur-sm text-white text-sm font-medium
        shadow-lg transition-all duration-300
        ${colors}
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-3 pointer-events-none'}
      `}
    >
      <span className="text-base leading-none">{icon}</span>
      <span>{message}</span>
    </div>
  );
}
