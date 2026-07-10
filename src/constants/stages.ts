import type { KpiFilterStage, LeadStage, StageConfig } from '../types/dashboard';

export const STAGE_CONFIG: Record<LeadStage, StageConfig> = {
  new_lead: {
    label: 'New Lead',
    textClass: 'text-purple-700',
    bgClass: 'bg-purple-50',
  },
  follow_up: {
    label: 'Follow Up',
    textClass: 'text-orange-700',
    bgClass: 'bg-orange-50',
  },
  waiting_for_photos: {
    label: 'Waiting For Photos',
    textClass: 'text-purple-700',
    bgClass: 'bg-purple-50',
  },
  photos_received: {
    label: 'Photos Received',
    textClass: 'text-green-700',
    bgClass: 'bg-green-50',
  },
  consultation_ready: {
    label: 'Consultation Ready',
    textClass: 'text-green-700',
    bgClass: 'bg-green-50',
  },
  doctor_review: {
    label: 'Doctor Review',
    textClass: 'text-blue-700',
    bgClass: 'bg-blue-50',
  },
};

export const KPI_STAGE_MAP: Record<string, LeadStage[]> = {
  new: ['new_lead'],
  followup: ['follow_up'],
  'consultation-ready': ['consultation_ready'],
  'doctor-review': ['doctor_review'],
};

export const QUERY_STAGE_MAP: Record<KpiFilterStage, LeadStage> = {
  new: 'new_lead',
  followup: 'follow_up',
  'consultation-ready': 'consultation_ready',
  'doctor-review': 'doctor_review',
};

export function resolveStageFromQuery(stageParam: string | null): LeadStage | 'all' {
  if (!stageParam) {
    return 'all';
  }

  const mapped = QUERY_STAGE_MAP[stageParam as KpiFilterStage];
  return mapped ?? 'all';
}
export const STAGE_FILTER_OPTIONS: { value: LeadStage | 'all'; label: string }[] = [
  { value: 'all', label: 'All Stages' },
  { value: 'new_lead', label: 'New Lead' },
  { value: 'follow_up', label: 'Follow Up' },
  { value: 'waiting_for_photos', label: 'Waiting For Photos' },
  { value: 'photos_received', label: 'Photos Received' },
  { value: 'consultation_ready', label: 'Consultation Ready' },
  { value: 'doctor_review', label: 'Doctor Review' },
];
