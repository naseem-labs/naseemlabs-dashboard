import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  ChevronDown,
  MapPin,
  MessageCircle,
  Phone,
} from 'lucide-react';
import type { LeadDetailData } from '../../types/leadDetail';
import { LEAD_DETAIL_STAGE_CONFIG } from '../../constants/leadDetail';
import { ROUTES } from '../../constants/routes';
import { PatientAvatar } from '../dashboard/PatientAvatar';
import { ActionsDropdown } from './ActionsDropdown';

interface LeadDetailHeaderProps {
  detail: LeadDetailData;
  isActionLoading: boolean;
  onSendConsultationInvite: () => void;
  onStartFollowUp: () => void;
  onPauseFollowUp: () => void;
  onRequestPhotos: () => void;
  onSendToDoctorReview: () => void;
  onMarkConsultationReady: () => void;
  onMarkLostLead: () => void;
}

export function LeadDetailHeader({
  detail,
  isActionLoading,
  onSendConsultationInvite,
  onStartFollowUp,
  onPauseFollowUp,
  onRequestPhotos,
  onSendToDoctorReview,
  onMarkConsultationReady,
  onMarkLostLead,
}: LeadDetailHeaderProps) {
  const stageConfig = LEAD_DETAIL_STAGE_CONFIG[detail.stage];
  const telHref = `tel:${detail.patient.phone.replace(/\s/g, '')}`;

  return (
    <header className="shrink-0 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <Link
              to={ROUTES.LEADS}
              className="mt-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-purple-600"
              aria-label="Back to leads"
            >
              <ArrowLeft size={18} />
            </Link>

            <PatientAvatar
              initials={detail.patient.avatarInitials}
              size="lg"
              className="shrink-0"
            />

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-bold text-navy sm:text-2xl">
                  {detail.patient.firstName} {detail.patient.lastName}
                </h1>
                <span
                  className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold ${stageConfig.badgeClass}`}
                >
                  {detail.stageLabel}
                </span>
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-600">
                <span className="inline-flex items-center gap-1.5">
                  <MessageCircle size={14} className="text-green-500" />
                  {detail.patient.phone}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <MapPin size={14} className="text-purple-500" />
                  {detail.patient.location}
                </span>
              </div>
            </div>
          </div>

          <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:justify-end">
            <a
              href={telHref}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-semibold !text-white shadow-sm transition hover:bg-green-700 sm:flex-none"
            >
              <Phone size={16} className="text-white" />
              Call Patient
            </a>

            <ActionsDropdown
              detail={detail}
              isLoading={isActionLoading}
              onSendConsultationInvite={onSendConsultationInvite}
              onStartFollowUp={onStartFollowUp}
              onPauseFollowUp={onPauseFollowUp}
              onRequestPhotos={onRequestPhotos}
              onSendToDoctorReview={onSendToDoctorReview}
              onMarkConsultationReady={onMarkConsultationReady}
              onMarkLostLead={onMarkLostLead}
              trigger={
                <button
                  type="button"
                  disabled={isActionLoading}
                  className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-slate-800 px-3.5 py-2 text-xs font-medium text-white shadow-xs transition hover:bg-slate-900 disabled:opacity-60 sm:flex-none"
                >
                  Actions
                  <ChevronDown size={16} />
                </button>
              }
            />
          </div>
        </div>
      </div>
    </header>
  );
}
