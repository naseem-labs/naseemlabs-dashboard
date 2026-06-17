import {
  Calendar,
  Camera,
  Pause,
  Play,
  Stethoscope,
  X,
} from 'lucide-react';
import type { LeadDetailData } from '../../types/leadDetail';

interface ActionSystemCardProps {
  detail: LeadDetailData;
  isLoading: boolean;
  onStartFollowUp: () => void;
  onPauseFollowUp: () => void;
  onRequestPhotos: () => void;
  onSendToDoctorReview: () => void;
  onMarkConsultationReady: () => void;
  onMarkLostLead: () => void;
}

export function ActionSystemCard({
  detail,
  isLoading,
  onStartFollowUp,
  onPauseFollowUp,
  onRequestPhotos,
  onSendToDoctorReview,
  onMarkConsultationReady,
  onMarkLostLead,
}: ActionSystemCardProps) {
  const isLost = detail.stage === 'lost_lead';

  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-sm font-semibold text-navy">Action System</h2>

      <div className="flex flex-col gap-2.5">
        {detail.followUpActive ? (
          <ActionButton
            label="Pause Follow Up"
            icon={<Pause size={16} />}
            variant="green"
            onClick={onPauseFollowUp}
            disabled={isLoading || isLost}
          />
        ) : (
          <ActionButton
            label="Start Follow Up"
            icon={<Play size={16} />}
            variant="green"
            onClick={onStartFollowUp}
            disabled={isLoading || isLost}
          />
        )}

        <ActionButton
          label="Request Photos"
          icon={<Camera size={16} />}
          variant="orange"
          onClick={onRequestPhotos}
          disabled={isLoading || isLost}
        />

        <ActionButton
          label="Send To Doctor"
          icon={<Stethoscope size={16} />}
          variant="purple"
          onClick={onSendToDoctorReview}
          disabled={isLoading || isLost}
        />

        <ActionButton
          label="Mark Consultation Ready"
          icon={<Calendar size={16} />}
          variant="blue"
          onClick={onMarkConsultationReady}
          disabled={isLoading || isLost}
        />

        <ActionButton
          label="Mark Lost Lead"
          icon={<X size={16} />}
          variant="red"
          onClick={onMarkLostLead}
          disabled={isLoading || isLost}
        />
      </div>
    </section>
  );
}

function ActionButton({
  label,
  icon,
  variant,
  onClick,
  disabled,
}: {
  label: string;
  icon: React.ReactNode;
  variant: 'green' | 'orange' | 'purple' | 'blue' | 'red';
  onClick: () => void;
  disabled?: boolean;
}) {
  const styles = {
    green: 'bg-green-600 text-white hover:bg-green-700 border-transparent',
    orange: 'border-orange-300 text-orange-700 hover:bg-orange-50 bg-white',
    purple: 'border-purple-300 text-purple-700 hover:bg-purple-50 bg-white',
    blue: 'border-blue-300 text-blue-700 hover:bg-blue-50 bg-white',
    red: 'border-red-300 text-red-600 hover:bg-red-50 bg-white',
  } as const;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${styles[variant]}`}
    >
      {icon}
      {label}
    </button>
  );
}
