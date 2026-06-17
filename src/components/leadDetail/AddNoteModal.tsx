import { useState } from 'react';

interface AddNoteModalProps {
  isOpen: boolean;
  isLoading: boolean;
  onClose: () => void;
  onSave: (content: string) => void;
}

export function AddNoteModal({ isOpen, isLoading, onClose, onSave }: AddNoteModalProps) {
  const [content, setContent] = useState('');

  if (!isOpen) {
    return null;
  }

  const handleSave = () => {
    if (content.trim()) {
      onSave(content);
      setContent('');
    }
  };

  const handleClose = () => {
    setContent('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/40 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-note-title"
        className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl"
      >
        <h2 id="add-note-title" className="text-lg font-bold text-navy">
          Add Internal Note
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Manual staff notes only. Not AI generated.
        </p>

        <textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          rows={5}
          placeholder="Write your note..."
          className="mt-4 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-navy focus:border-purple-400 focus:outline-none"
        />

        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={handleClose}
            className="rounded-xl px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!content.trim() || isLoading}
            className="rounded-xl bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Save Note
          </button>
        </div>
      </div>
    </div>
  );
}
