import { useEffect, useRef, useState } from 'react';
import type { LeadDetailData } from '../../types/leadDetail';

interface ActionsDropdownProps {
  detail: LeadDetailData;
  isLoading: boolean;
  trigger: React.ReactNode;
  onStartFollowUp: () => void;
  onPauseFollowUp: () => void;
  onRequestPhotos: () => void;
  onSendToDoctorReview: () => void;
  onMarkConsultationReady: () => void;
  onMarkLostLead: () => void;
}

export function ActionsDropdown({
  detail,
  isLoading,
  trigger,
  onStartFollowUp,
  onPauseFollowUp,
  onRequestPhotos,
  onSendToDoctorReview,
  onMarkConsultationReady,
  onMarkLostLead,
}: ActionsDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const closeAndRun = (action: () => void) => {
    setIsOpen(false);
    action();
  };

  const isLost = detail.stage === 'lost_lead';

  return (
    <div ref={containerRef} className="relative flex-1 sm:flex-none">
      <div onClick={() => !isLoading && setIsOpen((open) => !open)}>{trigger}</div>

      {isOpen ? (
        <div className="absolute right-0 z-30 mt-2 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg">
          {detail.followUpActive ? (
            <DropdownItem
              label="Pause Follow Up"
              onClick={() => closeAndRun(onPauseFollowUp)}
              disabled={isLoading || isLost}
            />
          ) : (
            <DropdownItem
              label="Start Follow Up"
              onClick={() => closeAndRun(onStartFollowUp)}
              disabled={isLoading || isLost}
            />
          )}
          <DropdownItem
            label="Request Photos"
            onClick={() => closeAndRun(onRequestPhotos)}
            disabled={isLoading || isLost}
          />
          <DropdownItem
            label="Send To Doctor Review"
            onClick={() => closeAndRun(onSendToDoctorReview)}
            disabled={isLoading || isLost}
          />
          <DropdownItem
            label="Mark Consultation Ready"
            onClick={() => closeAndRun(onMarkConsultationReady)}
            disabled={isLoading || isLost}
          />
          <DropdownItem
            label="Mark Lost Lead"
            onClick={() => closeAndRun(onMarkLostLead)}
            disabled={isLoading || isLost}
            danger
          />
        </div>
      ) : null}
    </div>
  );
}

function DropdownItem({
  label,
  onClick,
  disabled,
  danger,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`block w-full px-4 py-2.5 text-left text-sm font-medium transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 ${
        danger ? 'text-red-600' : 'text-navy'
      }`}
    >
      {label}
    </button>
  );
}
