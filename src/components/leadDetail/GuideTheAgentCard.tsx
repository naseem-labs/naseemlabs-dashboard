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
      <div className="space-y-2 text-sm">
        <div className="flex">
          <span className="w-40 font-semibold text-slate-600">Follow-up Type</span>
          <span className="text-navy">{followupType}</span>
        </div>
        <div className="flex">
          <span className="w-40 font-semibold text-slate-600">Reason</span>
          <span className="text-navy">{followupReason}</span>
        </div>
        <div className="flex">
          <span className="w-40 font-semibold text-slate-600">Next Follow-up</span>
          <span className="text-navy">{formatDateTime(scheduledFor)}</span>
        </div>
        <div className="flex">
          <span className="w-40 font-semibold text-slate-600">Scheduled On</span>
          <span className="text-navy">{formatDateTime(scheduledOn)}</span>
        </div>
      </div>
    </LeadDetailCard>
  );
}
