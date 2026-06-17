import type { PatientSnapshot } from '../../types/leadDetail';
import { LeadDetailCard } from './LeadDetailCard';

interface PatientSnapshotCardProps {
  snapshot: PatientSnapshot;
}

const SNAPSHOT_FIELDS: { key: keyof PatientSnapshot; label: string }[] = [
  { key: 'mainConcern', label: 'Main Concern' },
  { key: 'decisionStage', label: 'Decision Stage' },
  { key: 'currentRisk', label: 'Current Risk' },
  { key: 'confidenceLevel', label: 'Confidence Level' },
  { key: 'likelyObjection', label: 'Likely Objection' },
];

export function PatientSnapshotCard({ snapshot }: PatientSnapshotCardProps) {
  return (
    <LeadDetailCard title="Patient Snapshot">
      <dl className="space-y-2.5">
        {SNAPSHOT_FIELDS.map((field) => (
          <div key={field.key} className="flex items-start justify-between gap-3 text-sm">
            <dt className="font-medium text-slate-500">{field.label}</dt>
            <dd className="text-right font-semibold text-navy">{snapshot[field.key]}</dd>
          </div>
        ))}

        <div className="rounded-xl border border-orange-100 bg-orange-50/60 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-orange-700">
            Best Next Step
          </p>
          <p className="mt-1 text-sm font-medium text-navy">{snapshot.bestNextStep}</p>
        </div>
      </dl>
    </LeadDetailCard>
  );
}
