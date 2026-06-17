import type { LeadStage } from '../../types/dashboard';
import type { LeadDetailStage } from '../../types/leadDetail';
import type { DbLead } from './types';

/** UI dashboard stage → DB `leads.stage` value */
export const UI_TO_DB_STAGE: Record<LeadStage, string> = {
  new_lead: 'new',
  follow_up: 'follow_up',
  information_collected: 'waiting_for_photos',
  photos_received: 'photos_received',
  consultation_ready: 'consultation_ready',
  doctor_review: 'doctor_review',
};

/** DB `leads.stage` value → UI dashboard stage */
export const DB_TO_UI_STAGE: Record<string, LeadStage> = {
  new: 'new_lead',
  follow_up: 'follow_up',
  waiting_for_photos: 'information_collected',
  photos_received: 'photos_received',
  consultation_ready: 'consultation_ready',
  doctor_review: 'doctor_review',
  lost: 'new_lead',
};

export function mapDbStageToUi(stage: string | null, followupActive: boolean | null): LeadStage {
  if (stage === 'new' && followupActive) {
    return 'follow_up';
  }

  return DB_TO_UI_STAGE[stage ?? 'new'] ?? 'new_lead';
}

export function mapUiStageToDb(stage: LeadStage): string {
  return UI_TO_DB_STAGE[stage];
}

export function mapDbLeadToDetailStage(lead: DbLead): LeadDetailStage {
  if (lead.stage === 'lost') {
    return 'lost_lead';
  }

  if (lead.stage === 'consultation_ready') {
    return 'consultation_ready';
  }

  if (
    lead.doctor_review_status &&
    lead.doctor_review_status !== 'none' &&
    lead.doctor_review_status !== ''
  ) {
    return 'doctor_review_requested';
  }

  if (lead.stage === 'doctor_review') {
    return 'doctor_review_requested';
  }

  if (lead.stage === 'waiting_for_photos') {
    return 'waiting_for_photos';
  }

  if (lead.followup_active || lead.stage === 'follow_up') {
    return 'follow_up_active';
  }

  return 'new_lead';
}

export function mapDetailStageToDb(stage: LeadDetailStage): {
  stage: string;
  followupActive: boolean;
  doctorReviewStatus?: string;
} {
  switch (stage) {
    case 'follow_up_active':
      return { stage: 'follow_up', followupActive: true };
    case 'waiting_for_photos':
      return { stage: 'waiting_for_photos', followupActive: true };
    case 'doctor_review_requested':
      return { stage: 'doctor_review', followupActive: true, doctorReviewStatus: 'requested' };
    case 'consultation_ready':
      return { stage: 'consultation_ready', followupActive: false };
    case 'lost_lead':
      return { stage: 'lost', followupActive: false };
    default:
      return { stage: 'new', followupActive: false, doctorReviewStatus: 'none' };
  }
}
