export type LeadDetailStage =
  | 'new_lead'
  | 'follow_up_active'
  | 'waiting_for_photos'
  | 'doctor_review_requested'
  | 'consultation_ready'
  | 'lost_lead';

export type PhotoStatus = 'received' | 'pending' | 'requested' | 'missing';

export type LostLeadReason =
  | 'cost'
  | 'no_response'
  | 'chose_another_clinic'
  | 'not_interested'
  | 'other';

export type LeadActionType =
  | 'start_follow_up'
  | 'pause_follow_up'
  | 'request_photos'
  | 'send_to_doctor'
  | 'mark_consultation_ready'
  | 'mark_lost';

export interface LeadPatient {
  firstName: string;
  lastName: string;
  phone: string;
  location: string;
  avatarInitials: string;
}

export interface LeadMetricItem {
  label: string;
  value: string;
  subValue?: string;
  variant?: 'purple' | 'orange' | 'green' | 'blue' | 'red' | 'slate';
}

export interface LeadMetrics {
  currentStage: LeadMetricItem;
  nextAction: LeadMetricItem;
  lastActivity: LeadMetricItem;
  doctorReview: LeadMetricItem;
}

export interface PatientInformation {
  age: number;
  city: string;
  occupation: string;
  hairLossDuration: string;
  affectedArea: string;
  hairType: string;
  previousTreatment: string;
  previousTransplant: boolean;
  budgetRange: string;
  goal: string;
  patientConcern: string;
  createdOn: string;
}

export interface LeadProfile {
  aiSummary: string;
  leadContext: string;
  nextAction: string;
}

export interface FollowUp {
  followupType: string;
  followupReason: string;
  scheduledFor: string;
  createdAt: string;
}

export interface GuideItem {
  id: string;
  text: string;
}

export interface LeadPhoto {
  id: string;
  label: string;
  status: PhotoStatus;
  storageUrl: string | null;
  uploadedAt?: string;
}

export interface InternalNote {
  id: string;
  content: string;
  authorName: string;
  createdAt: string;
  updatedAt: string;
}

export interface TimelineEvent {
  id: string;
  title: string;
  description?: string;
  actorName?: string;
  createdAt: string;
}

export interface LeadDetailData {
  id: string;
  clinicId: string;
  patient: LeadPatient;
  stage: LeadDetailStage;
  stageLabel: string;
  stageSince: string;
  followUpActive: boolean;
  metrics: LeadMetrics;
  patientInfo: PatientInformation;
  leadProfile: LeadProfile;
  followUp: FollowUp;
  guideItems: GuideItem[];
  photos: LeadPhoto[];
  notes: InternalNote[];
  timeline: TimelineEvent[];
  doctorReviewStatus: string;
}

export interface AddNotePayload {
  content: string;
  authorName: string;
}

export interface UpdateNotePayload {
  noteId: string;
  content: string;
}
