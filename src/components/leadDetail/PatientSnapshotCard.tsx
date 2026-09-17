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
      action={
        <div className="flex flex-wrap items-center justify-end gap-1.5">
          <button
            type="button"
            onClick={onGenerateSummary}
            disabled={isGenerating}
            className="rounded-md border border-purple-200 bg-purple-600 px-2 py-1 text-[10px] font-semibold leading-tight text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isGenerating ? 'Requesting...' : '💫 Generate AI Summary'}
          </button>
          <button
            type="button"
            onClick={onViewChat}
            className="rounded-md border border-slate-200 bg-white px-2 py-1 text-[10px] font-semibold leading-tight text-purple-600 transition hover:bg-purple-50"
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
