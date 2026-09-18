import { Plus } from 'lucide-react';

interface AddLeadFormActionsProps {
  isSubmitting: boolean;
  onCancel: () => void;
  onSubmit: () => void;
}

export function AddLeadFormActions({
  isSubmitting,
  onCancel,
  onSubmit,
}: AddLeadFormActionsProps) {
  return (
    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
      <button
        type="button"
        onClick={onCancel}
        disabled={isSubmitting}
        className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-navy transition hover:bg-slate-50 disabled:opacity-60"
      >
        Cancel
      </button>

      <button
        type="button"
        onClick={onSubmit}
        disabled={isSubmitting}
        className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Plus size={16} />
        {isSubmitting ? 'Creating Lead...' : 'Create Lead'}
      </button>
    </div>
  );
}
