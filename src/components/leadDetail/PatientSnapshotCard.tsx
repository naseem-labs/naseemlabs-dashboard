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
      headerClassName="flex w-full items-center justify-between gap-2"
      titleClassName="whitespace-nowrap text-sm font-semibold text-slate-900"
      action={
        <div className="flex shrink-0 items-center gap-1.5">
          <button
            type="button"
            onClick={onGenerateSummary}
            disabled={isGenerating}
            className="flex h-7 items-center gap-1 rounded-md bg-indigo-600 px-2 py-1 text-xs font-medium whitespace-nowrap text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isGenerating ? 'Requesting...' : '💫 Generate AI Summary'}
          </button>
          <button
            type="button"
            onClick={onViewChat}
            className="h-7 rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-medium whitespace-nowrap text-slate-700 shadow-xs transition hover:bg-slate-50"
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

      <p className="text-sm leading-6 text-slate-700 whitespace-pre-wrap">
        {profile.aiSummary ?? 'No AI summary available.'}
      </p>
    </LeadDetailCard>
  );
}
