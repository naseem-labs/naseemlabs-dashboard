import { Check } from 'lucide-react';
import type { GuideItem } from '../../types/leadDetail';
import { LeadDetailCard } from './LeadDetailCard';

interface GuideTheAgentCardProps {
  items: GuideItem[];
  highlight?: string | null;
}

export function GuideTheAgentCard({ items, highlight }: GuideTheAgentCardProps) {
  return (
    <LeadDetailCard title="Guide The Agent">
      <ul className="space-y-2.5">
        {items.map((item) => (
          <li key={item.id} className="flex items-start gap-2.5 text-sm text-navy">
            <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-50 text-green-600">
              <Check size={12} strokeWidth={3} />
            </span>
            <span>{item.text}</span>
          </li>
        ))}
      </ul>

      {highlight ? (
        <div className="mt-4 rounded-xl border-2 border-orange-300 bg-orange-50/50 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-orange-700">
            Next Best Action
          </p>
          <p className="mt-1 text-sm font-semibold text-navy">{highlight}</p>
        </div>
      ) : null}
    </LeadDetailCard>
  );
}
