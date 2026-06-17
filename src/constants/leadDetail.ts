import type { LeadDetailStage, LostLeadReason } from '../types/leadDetail';

export const LEAD_DETAIL_STAGE_CONFIG: Record<
  LeadDetailStage,
  { label: string; badgeClass: string }
> = {
  new_lead: {
    label: 'New Lead',
    badgeClass: 'bg-green-50 text-green-700 border-green-100',
  },
  follow_up_active: {
    label: 'Active Follow Up',
    badgeClass: 'bg-orange-50 text-orange-700 border-orange-100',
  },
  waiting_for_photos: {
    label: 'Waiting For Photos',
    badgeClass: 'bg-purple-50 text-purple-700 border-purple-100',
  },
  doctor_review_requested: {
    label: 'Doctor Review',
    badgeClass: 'bg-blue-50 text-blue-700 border-blue-100',
  },
  consultation_ready: {
    label: 'Consultation Ready',
    badgeClass: 'bg-green-50 text-green-700 border-green-100',
  },
  lost_lead: {
    label: 'Lost Lead',
    badgeClass: 'bg-red-50 text-red-700 border-red-100',
  },
};

export const LOST_LEAD_REASONS: { value: LostLeadReason; label: string }[] = [
  { value: 'cost', label: 'Cost' },
  { value: 'no_response', label: 'No Response' },
  { value: 'chose_another_clinic', label: 'Chose Another Clinic' },
  { value: 'not_interested', label: 'Not Interested' },
  { value: 'other', label: 'Other' },
];

export const PHOTO_STATUS_CONFIG = {
  received: { label: 'Received', className: 'bg-green-50 text-green-700' },
  pending: { label: 'Pending', className: 'bg-slate-100 text-slate-600' },
  requested: { label: 'Requested', className: 'bg-orange-50 text-orange-700' },
  missing: { label: 'Not Received', className: 'bg-slate-100 text-slate-500' },
} as const;

export function getLostReasonLabel(reason: LostLeadReason): string {
  return LOST_LEAD_REASONS.find((item) => item.value === reason)?.label ?? reason;
}
