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
      className="group box-border w-full max-w-full overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm outline-none"
    >
      <h2 className="text-sm font-semibold text-navy group-hover:mb-4 group-focus-within:mb-4 [@media(hover:none)]:mb-4">
        Action System
      </h2>

      <div className="grid grid-rows-[0fr] overflow-hidden transition-[grid-template-rows] duration-200 group-hover:grid-rows-[1fr] group-focus-within:grid-rows-[1fr] [@media(hover:none)]:grid-rows-[1fr]">
        <div className="min-h-0 overflow-hidden">
          <div className="flex w-full flex-col gap-2">
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
      'bg-emerald-600 hover:bg-emerald-700 text-white sm:font-semibold sm:py-2.5 sm:px-4 sm:rounded-xl shadow-sm border-transparent',
    sent:
      'bg-emerald-100 text-emerald-800 border border-emerald-300 sm:font-semibold sm:py-2.5 sm:px-4 sm:rounded-xl',
    secondary:
      'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 sm:py-2 sm:px-4 sm:rounded-xl',
    danger:
      'bg-rose-50/40 hover:bg-rose-50 text-rose-600 border border-rose-200/70 sm:py-2 sm:px-4 sm:rounded-xl',
  } as const;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex h-9 w-full min-w-0 items-center justify-center gap-1.5 break-words rounded-lg px-4 py-2 text-center text-xs font-medium transition disabled:cursor-not-allowed disabled:opacity-50 sm:h-auto sm:gap-2 sm:rounded-xl sm:text-sm ${styles[variant]}`}
    >
      {label}
    </button>
  );
}
