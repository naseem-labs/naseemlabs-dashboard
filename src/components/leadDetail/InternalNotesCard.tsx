import { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import type { InternalNote } from '../../types/leadDetail';
import { formatDisplayDate } from '../../hooks/useDashboard';
import { LeadDetailCard } from './LeadDetailCard';

interface InternalNotesCardProps {
  notes: InternalNote[];
  onUpdate: (noteId: string, content: string) => void;
  onDelete: (noteId: string) => void;
}

export function InternalNotesCard({ notes, onUpdate, onDelete }: InternalNotesCardProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState('');

  const startEdit = (note: InternalNote) => {
    setEditingId(note.id);
    setDraft(note.content);
  };

  const saveEdit = (noteId: string) => {
    if (draft.trim()) {
      onUpdate(noteId, draft);
    }
    setEditingId(null);
    setDraft('');
  };

  return (
    <LeadDetailCard title="Internal Notes">
      {notes.length === 0 ? (
        <p className="text-sm text-slate-500">No internal notes yet.</p>
      ) : (
        <ul className="space-y-3">
          {notes.map((note) => (
            <li
              key={note.id}
              className="rounded-xl border border-slate-100 bg-slate-50/80 p-3"
            >
              {editingId === note.id ? (
                <div className="space-y-2">
                  <textarea
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    rows={3}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-navy focus:border-purple-400 focus:outline-none"
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => saveEdit(note.id)}
                      className="text-xs font-semibold text-purple-600"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className="text-xs font-medium text-slate-500"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-sm text-navy">{note.content}</p>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <p className="text-xs text-slate-500">
                      {note.authorName} · {formatDisplayDate(note.createdAt)}
                    </p>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => startEdit(note)}
                        className="rounded p-1 text-slate-400 hover:bg-white hover:text-purple-600"
                        aria-label="Edit note"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(note.id)}
                        className="rounded p-1 text-slate-400 hover:bg-white hover:text-red-600"
                        aria-label="Delete note"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </LeadDetailCard>
  );
}
