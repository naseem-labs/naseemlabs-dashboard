export const ROUTES = {
  LOGIN: '/login',
  WORKSPACE: '/workspace',
  PROFILE: '/profile',
  NOTIFICATIONS: '/notifications',
  DASHBOARD: '/dashboard',
  DOCTOR_DASHBOARD: '/doctor-dashboard',
  LEADS: '/leads',
  LEAD_DETAIL: '/leads/:leadId',
  ADD_LEAD: '/leads/new',
  SETTINGS: '/settings',
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];

export const LEAD_STAGE_QUERY = {
  NEW: 'new',
  FOLLOWUP: 'followup',
  CONSULTATION_READY: 'consultation-ready',
  DOCTOR_REVIEW: 'doctor-review',
} as const;

export type LeadStageQuery =
  (typeof LEAD_STAGE_QUERY)[keyof typeof LEAD_STAGE_QUERY];

export function leadDetailPath(leadId: string): string {
  return `/leads/${leadId}`;
}

export function leadsWithStagePath(stage: LeadStageQuery): string {
  return `/leads?stage=${stage}`;
}
