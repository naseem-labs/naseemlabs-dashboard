import { useState } from 'react';
import type { StaffNote, TimelineEvent } from '../../types/leadDetail';

type ActivityTab = 'timeline' | 'notes' | 'context';

interface PatientActivityLogsCardProps {
  timeline: TimelineEvent[];
  staffNotes: StaffNote[];
  aiContextIntel: string | null;
  isSaving: boolean;
  onAddStaffNote: (content: string) => Promise<void>;
  onUpdateAiContext: (content: string) => Promise<void>;
}

function formatTimelineDate(isoDate: string): string {
  return new Date(isoDate).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function formatRelativeTime(isoDate: string): string {
  const elapsedMs = Math.max(0, Date.now() - new Date(isoDate).getTime());
  const minutes = Math.floor(elapsedMs / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;

  return new Date(isoDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function PatientActivityLogsCard({
  timeline,
  staffNotes,
  aiContextIntel,
  isSaving,
  onAddStaffNote,
  onUpdateAiContext,
}: PatientActivityLogsCardProps) {
  const [activeTab, setActiveTab] = useState<ActivityTab>('timeline');
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [noteDraft, setNoteDraft] = useState('');
  const [isEditingContext, setIsEditingContext] = useState(false);
  const [contextDraft, setContextDraft] = useState('');

  const openContextEditor = () => {
    setContextDraft(aiContextIntel ?? '');
    setIsEditingContext(true);
  };

  const saveStaffNote = async () => {
    if (!noteDraft.trim()) return;
    await onAddStaffNote(noteDraft);
    setNoteDraft('');
    setIsAddingNote(false);
  };

  const saveAiContext = async () => {
    await onUpdateAiContext(contextDraft);
    setIsEditingContext(false);
  };

  return (
    <section className="box-border flex min-h-[220px] w-full min-w-0 max-w-full flex-col justify-between overflow-hidden rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="whitespace-nowrap text-sm font-semibold text-slate-900">Activity Logs</h2>

        <div
          className="no-scrollbar flex max-w-full items-center gap-1 overflow-x-auto py-1 sm:w-auto"
          role="tablist"
          aria-label="Patient activity views"
        >
          {([
            ['timeline', `Timeline (${timeline.length})`],
            ['notes', `Staff Notes (${staffNotes.length})`],
            ['context', '● AI Context'],
          ] as const).map(([tab, label]) => (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={activeTab === tab}
              onClick={() => setActiveTab(tab)}
              className={`shrink-0 whitespace-nowrap rounded-md border px-2.5 py-1 text-xs font-medium transition-colors duration-150 ${
                activeTab === tab
                  ? 'border-slate-200/60 bg-white text-blue-600 shadow-sm'
                  : 'border-transparent text-slate-500 hover:bg-blue-50/60 hover:text-blue-600'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4" role="tabpanel">
        {activeTab === 'timeline' ? (
          timeline.length === 0 ? (
            <p className="py-6 text-center text-xs text-slate-400">No timeline events yet.</p>
          ) : (
            <ol className="relative space-y-4 border-l border-slate-200 pl-4">
              {timeline.map((event) => (
                <li key={event.id} className="relative">
                  <span className="absolute -left-[1.35rem] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-slate-600 ring-2 ring-slate-200" />
                  <p className="min-w-0 break-words text-sm font-semibold text-slate-800">{event.title}</p>
                  {event.description ? (
                    <p className="mt-0.5 min-w-0 break-words text-sm text-slate-600">{event.description}</p>
                  ) : null}
                  <p className="mt-1 text-xs text-slate-400">
                    By {event.actorName ?? 'Staff'} • {formatTimelineDate(event.createdAt)}
                  </p>
                </li>
              ))}
            </ol>
          )
        ) : null}

        {activeTab === 'notes' ? (
          <div>
            <div className="mb-3 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setIsAddingNote((current) => !current)}
                className="inline-flex h-7 items-center gap-1 rounded-md bg-emerald-600 px-2.5 py-1 text-xs font-medium text-white shadow-xs transition hover:bg-emerald-700"
              >
                + Add Staff Note
              </button>
            </div>

            {isAddingNote ? (
              <div className="mb-3 rounded-xl border border-slate-200 bg-slate-50 p-3.5">
                <textarea
                  value={noteDraft}
                  onChange={(event) => setNoteDraft(event.target.value)}
                  rows={3}
                  placeholder="Add fees, visit dates, preferences, or other front-desk details..."
                  className="w-full resize-y rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                />
                <div className="mt-3 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingNote(false);
                      setNoteDraft('');
                    }}
                    className="h-7 rounded-md px-3 py-1 text-xs font-medium text-slate-500 transition hover:bg-white hover:text-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => void saveStaffNote()}
                    disabled={!noteDraft.trim() || isSaving}
                    className="h-7 rounded-md bg-emerald-600 px-3 py-1 text-xs font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isSaving ? 'Saving...' : 'Save Note'}
                  </button>
                </div>
              </div>
            ) : null}

            {staffNotes.length === 0 ? (
              <p className="py-6 text-center text-xs text-slate-400">No staff notes yet.</p>
            ) : (
              <ul>
                {staffNotes.map((note) => (
                  <li
                    key={note.id}
                    className="mb-2.5 rounded-xl border border-slate-200/80 bg-slate-50 p-3.5 last:mb-0"
                  >
                    <p className="min-w-0 break-words text-sm text-slate-700">{note.content}</p>
                    <p className="mt-2 text-xs text-slate-400">
                      {note.authorName} · {formatRelativeTime(note.createdAt)}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : null}

        {activeTab === 'context' ? (
          <div>
            <div className="mb-3 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={openContextEditor}
                disabled={isEditingContext}
                className="inline-flex h-7 items-center gap-1 rounded-md bg-blue-600 px-2.5 py-1 text-xs font-medium text-white shadow-xs transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                + Update AI Context
              </button>
            </div>

            <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-4">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100/70 px-2 py-0.5 text-xs font-medium text-emerald-700">
                <span aria-hidden="true">●</span>
                Active in Preet Memory
              </span>

              {isEditingContext ? (
                <textarea
                  value={contextDraft}
                  onChange={(event) => setContextDraft(event.target.value)}
                  rows={5}
                  className="mt-3 w-full resize-y rounded-lg border border-indigo-100 bg-white px-3 py-2.5 text-sm leading-relaxed text-slate-800 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                  placeholder="Add psychological intel for the AI agent..."
                />
              ) : (
                <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-slate-800">
                  {aiContextIntel?.trim() || 'No active psychological intel set for AI agent.'}
                </p>
              )}

              {isEditingContext ? (
                <div className="mt-3 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditingContext(false)}
                    className="h-7 rounded-md px-3 py-1 text-xs font-medium text-slate-500 transition hover:bg-white hover:text-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => void saveAiContext()}
                    disabled={isSaving}
                    className="h-7 rounded-md bg-blue-600 px-3 py-1 text-xs font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isSaving ? 'Updating...' : 'Save AI Context'}
                  </button>
                </div>
              ) : null}
            </div>

          </div>
        ) : null}
      </div>
    </section>
  );
}
