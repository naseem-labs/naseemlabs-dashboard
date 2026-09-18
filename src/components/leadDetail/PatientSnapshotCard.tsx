import type { LeadProfile } from '../../types/leadDetail';
import { LeadDetailCard } from './LeadDetailCard';

interface PatientSnapshotCardProps {
  profile: LeadProfile;
  isGenerating: boolean;
  isSummaryPending: boolean;
  summaryError: string | null;
  onGenerateSummary: () => void;
  onViewChat: () => void;
}

function hasRealAiSummary(summary: string | null | undefined): boolean {
  if (!summary?.trim()) {
    return false;
  }

  return summary.trim() !== 'No AI summary available.';
}

export function PatientSnapshotCard({
  profile,
  isGenerating,
  isSummaryPending,
  summaryError,
  onGenerateSummary,
  onViewChat,
}: PatientSnapshotCardProps) {
  const showPendingMessage =
    isSummaryPending && !hasRealAiSummary(profile.aiSummary);

  return (
    <LeadDetailCard
      title="AI Summary"
      headerClassName="flex w-full flex-col gap-2.5 border-b border-slate-100 pb-3 sm:flex-row sm:items-center sm:justify-between"
      titleClassName="whitespace-nowrap text-sm font-semibold text-slate-900"
      action={
        <div className="flex w-full flex-col items-stretch gap-2 sm:w-auto sm:flex-row sm:items-center sm:justify-end">
          <button
            type="button"
            onClick={onGenerateSummary}
            disabled={isGenerating}
            className="flex h-7 w-full min-w-0 flex-1 items-center justify-center gap-1 whitespace-nowrap rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {isGenerating ? 'Requesting...' : '💫 Generate AI Summary'}
          </button>
          <button
            type="button"
            onClick={onViewChat}
            className="flex h-7 w-full shrink-0 items-center justify-center whitespace-nowrap rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-xs transition hover:bg-slate-50 sm:w-auto"
          >
            View Chat
          </button>
        </div>
      }
    >
      {showPendingMessage ? (
        <p className="mb-3 text-xs text-slate-500">
          Summary requested. It will appear here when ready.
        </p>
      ) : null}

      {summaryError ? (
        <p className="mb-3 text-xs text-red-600">{summaryError}</p>
      ) : null}

      <p className="min-w-0 break-words whitespace-pre-wrap text-sm leading-6 text-slate-700">
        {profile.aiSummary ?? 'No AI summary available.'}
      </p>
    </LeadDetailCard>
  );
}
