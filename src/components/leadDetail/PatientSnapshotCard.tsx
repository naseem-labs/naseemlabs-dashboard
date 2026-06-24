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
          <div
            key={field.key}
            className="flex flex-col gap-1 text-sm sm:flex-row sm:items-start sm:justify-between sm:gap-3"
          >
            <dt className="font-medium text-slate-500">{field.label}</dt>
            <dd className="break-all text-left font-semibold text-navy sm:text-right">
              {snapshot[field.key]}
            </dd>
          </div>
        ))}

        <div className="rounded-xl border border-orange-100 bg-orange-50/60 p-2.5 sm:p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-orange-700">
            Best Next Step
          </p>
          <p className="mt-1 text-sm font-medium text-navy">{snapshot.bestNextStep}</p>
        </div>
      </dl>
    </LeadDetailCard>
  );
}
