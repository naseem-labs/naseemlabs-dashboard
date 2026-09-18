import type { LeadDetailData } from '../../types/leadDetail';

interface ActionSystemCardProps {
  detail: LeadDetailData;
  isLoading: boolean;
  onSendConsultationInvite: () => void;
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
  onSendConsultationInvite,
  onPauseFollowUp,
  onStartFollowUp,
  onRequestPhotos,
  onSendToDoctorReview,
  onMarkConsultationReady,
  onMarkLostLead,
}: ActionSystemCardProps) {
  const isLost = detail.stage === 'lost_lead';
  const inviteSent = detail.leadProfile.consultationBookingRequested;

  return (
    <section
      tabIndex={0}
      className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm outline-none"
    >
      <h2 className="text-sm font-semibold text-navy group-hover:mb-4 group-focus-within:mb-4 [@media(hover:none)]:mb-4">
        Action System
      </h2>

      <div className="grid grid-rows-[0fr] overflow-hidden transition-[grid-template-rows] duration-200 group-hover:grid-rows-[1fr] group-focus-within:grid-rows-[1fr] [@media(hover:none)]:grid-rows-[1fr]">
        <div className="min-h-0 overflow-hidden">
          <div className="flex flex-col gap-2.5">
            {inviteSent ? (
              <ActionButton
                label="Consultation Invite Sent ✓"
                variant="sent"
                disabled
              />
            ) : (
              <ActionButton
                label="📅 Send Consultation Invite"
                variant="primary"
                onClick={onSendConsultationInvite}
                disabled={isLoading || isLost}
              />
            )}

            {detail.followUpActive ? (
              <ActionButton
                label="Pause Follow Up"
                variant="secondary"
                onClick={onPauseFollowUp}
                disabled={isLoading || isLost}
              />
            ) : (
              <ActionButton
                label="▷ Start Follow Up"
                variant="secondary"
                onClick={onStartFollowUp}
                disabled={isLoading || isLost}
              />
            )}

            <ActionButton
              label="📸 Request Photos"
              variant="secondary"
              onClick={onRequestPhotos}
              disabled={isLoading || isLost}
            />

            <ActionButton
              label="🩺 Send To Doctor"
              variant="secondary"
              onClick={onSendToDoctorReview}
              disabled={isLoading || isLost}
            />

            <ActionButton
              label="📅 Mark Consultation Ready"
              variant="secondary"
              onClick={onMarkConsultationReady}
              disabled={isLoading || isLost}
            />

            <ActionButton
              label="✕ Mark Lost Lead"
              variant="danger"
              onClick={onMarkLostLead}
              disabled={isLoading || isLost}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function ActionButton({
  label,
  variant,
  onClick,
  disabled,
}: {
  label: string;
  variant: 'primary' | 'sent' | 'secondary' | 'danger';
  onClick?: () => void;
  disabled?: boolean;
}) {
  const styles = {
    primary:
      'bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 px-4 rounded-xl shadow-sm border-transparent',
    sent:
      'bg-emerald-100 text-emerald-800 border border-emerald-300 font-semibold py-2.5 px-4 rounded-xl',
    secondary:
      'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-medium py-2 px-4 rounded-xl',
    danger:
      'bg-rose-50/40 hover:bg-rose-50 text-rose-600 border border-rose-200/70 font-medium py-2 px-4 rounded-xl',
  } as const;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex w-full items-center justify-center gap-2 text-sm transition disabled:cursor-not-allowed disabled:opacity-50 ${styles[variant]}`}
    >
      {label}
    </button>
  );
}
