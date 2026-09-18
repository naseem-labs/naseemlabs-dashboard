import type { LeadMetrics } from '../../types/leadDetail';

interface LeadMetricsBarProps {
  metrics: LeadMetrics;
}

const VARIANT_CLASSES = {
  purple: 'text-purple-700',
  orange: 'text-orange-600',
  green: 'text-green-600',
  blue: 'text-blue-600',
  red: 'text-red-600',
  slate: 'text-navy',
} as const;

export function LeadMetricsBar({ metrics }: LeadMetricsBarProps) {
  const items = [
    metrics.currentStage,
    metrics.nextAction,
    metrics.lastActivity,
    metrics.doctorReview,
  ];

  return (
    <div className="grid w-full min-w-0 max-w-full shrink-0 grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="box-border w-full min-w-0 max-w-full rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm"
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {item.label}
          </p>
          <p
            className={`mt-1 text-sm font-bold ${
              VARIANT_CLASSES[item.variant ?? 'slate']
            }`}
          >
            {item.value}
          </p>
          {item.subValue ? (
            <p className="mt-0.5 text-xs text-slate-500">{item.subValue}</p>
          ) : null}
        </div>
      ))}
    </div>
  );
}
