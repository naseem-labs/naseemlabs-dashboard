import type { LeadProfile } from '../../types/leadDetail';
import { LeadDetailCard } from './LeadDetailCard';

interface PatientSnapshotCardProps {
  profile: LeadProfile;
}

export function PatientSnapshotCard({ profile }: PatientSnapshotCardProps) {
  return (
    <LeadDetailCard title="AI Summary">
      <p className="text-sm leading-6 text-slate-700 whitespace-pre-wrap">
        {profile.aiSummary ?? 'No AI summary available.'}
      </p>
    </LeadDetailCard>
  );
}
