interface ToastProps {
  message: string;
  variant?: 'success' | 'error';
  onClose?: () => void;
}

export function Toast({ message, variant = 'success', onClose }: ToastProps) {
  const styles =
    variant === 'success'
      ? 'bg-green-600 text-white'
      : 'bg-red-600 text-white';

  return (
    <div
      role="status"
      className={`fixed bottom-6 right-4 z-50 flex max-w-sm items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium shadow-lg ${styles}`}
    >
      <span className="flex-1">{message}</span>
      {onClose ? (
        <button
          type="button"
          onClick={onClose}
          className="rounded-md px-1 text-white/80 transition hover:text-white"
          aria-label="Dismiss"
        >
          ×
        </button>
      ) : null}
    </div>
  );
}
