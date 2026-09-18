import { LeadDetailCard } from './LeadDetailCard';

interface GuideTheAgentCardProps {
  leadContext: string;
  followupType: string;
  followupReason: string;
  scheduledFor: string;
  scheduledOn: string;
}

function formatDateTime(value: string) {
  if (!value) return '-';

  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
    .format(new Date(value))
    .replace(',', ' at');
}

export function GuideTheAgentCard({
  leadContext,
  followupType,
  followupReason,
  scheduledFor,
  scheduledOn,
}: GuideTheAgentCardProps) {
  return (
    <LeadDetailCard title="Lead Context">
      <p className="mb-4 text-sm text-navy">{leadContext}</p>
      <dl className="space-y-3 text-sm">
        <div className="grid min-w-0 grid-cols-[minmax(0,7rem)_minmax(0,1fr)] items-start gap-x-3 gap-y-1 sm:grid-cols-[minmax(7rem,9rem)_1fr]">
          <dt className="min-w-0 break-words font-semibold text-slate-600">Follow-up Type</dt>
          <dd className="min-w-0 break-words text-navy">{followupType}</dd>
        </div>
        <div className="grid min-w-0 grid-cols-[minmax(0,7rem)_minmax(0,1fr)] items-start gap-x-3 gap-y-1 sm:grid-cols-[minmax(7rem,9rem)_1fr]">
          <dt className="min-w-0 break-words font-semibold text-slate-600">Reason</dt>
          <dd className="min-w-0 break-words text-navy">{followupReason}</dd>
        </div>
        <div className="grid min-w-0 grid-cols-[minmax(0,7rem)_minmax(0,1fr)] items-start gap-x-3 gap-y-1 sm:grid-cols-[minmax(7rem,9rem)_1fr]">
          <dt className="min-w-0 break-words font-semibold text-slate-600">Next Follow-up</dt>
          <dd className="min-w-0 break-words text-navy">{formatDateTime(scheduledFor)}</dd>
        </div>
        <div className="grid min-w-0 grid-cols-[minmax(0,7rem)_minmax(0,1fr)] items-start gap-x-3 gap-y-1 sm:grid-cols-[minmax(7rem,9rem)_1fr]">
          <dt className="min-w-0 break-words font-semibold text-slate-600">Scheduled On</dt>
          <dd className="min-w-0 break-words text-navy">{formatDateTime(scheduledOn)}</dd>
        </div>
      </dl>
    </LeadDetailCard>
  );
}
