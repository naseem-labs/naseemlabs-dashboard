import { useState } from 'react';
import type { TimelineEvent } from '../../types/leadDetail';
import { LeadDetailCard } from './LeadDetailCard';

interface TimelineSectionProps {
  events: TimelineEvent[];
}

function formatTimelineDate(isoDate: string): string {
  return new Date(isoDate).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function TimelineSection({ events }: TimelineSectionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <LeadDetailCard
      title="Timeline"
      action={
        <button
          type="button"
          onClick={() => setIsOpen((current) => !current)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-purple-600 transition hover:bg-purple-50"
        >
          {isOpen ? 'Hide Timeline' : 'View Timeline'}
        </button>
      }
    >
      {isOpen ? (
        events.length === 0 ? (
          <p className="text-sm text-slate-500">No timeline events yet.</p>
        ) : (
          <ol className="relative space-y-4 border-l border-slate-200 pl-4">
            {events.map((event) => (
              <li key={event.id} className="relative">
                <span className="absolute -left-[1.35rem] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-purple-500 ring-2 ring-purple-100" />
                <p className="text-sm font-semibold text-navy">{event.title}</p>
                {event.description ? (
                  <p className="text-sm text-slate-600">{event.description}</p>
                ) : null}
                {event.actorName ? (
                  <p className="text-xs text-slate-500">By {event.actorName}</p>
                ) : null}
                <p className="mt-0.5 text-xs text-slate-400">
                  {formatTimelineDate(event.createdAt)}
                </p>
              </li>
            ))}
          </ol>
        )
      ) : null}
    </LeadDetailCard>
  );
}
