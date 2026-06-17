import { useState } from 'react';
import type { LostLeadReason } from '../../types/leadDetail';
import { LOST_LEAD_REASONS } from '../../constants/leadDetail';

interface MarkLostLeadModalProps {
  isOpen: boolean;
  isLoading: boolean;
  onClose: () => void;
  onConfirm: (reason: LostLeadReason) => void;
}

export function MarkLostLeadModal({
  isOpen,
  isLoading,
  onClose,
  onConfirm,
}: MarkLostLeadModalProps) {
  const [reason, setReason] = useState<LostLeadReason | ''>('');

  if (!isOpen) {
    return null;
  }

  const handleConfirm = () => {
    if (reason) {
      onConfirm(reason);
      setReason('');
    }
  };

  const handleClose = () => {
    setReason('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/40 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="mark-lost-title"
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
      >
        <h2 id="mark-lost-title" className="text-lg font-bold text-navy">
          Mark Lost Lead
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Please select a reason. This action cannot be undone without manual review.
        </p>

        <div className="mt-4 space-y-2">
          {LOST_LEAD_REASONS.map((option) => (
            <label
              key={option.value}
              className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-2.5 text-sm transition ${
                reason === option.value
                  ? 'border-red-300 bg-red-50 text-red-700'
                  : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <input
                type="radio"
                name="lost-reason"
                value={option.value}
                checked={reason === option.value}
                onChange={() => setReason(option.value)}
                className="accent-red-600"
              />
              {option.label}
            </label>
          ))}
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={handleClose}
            className="rounded-xl px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!reason || isLoading}
            className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
