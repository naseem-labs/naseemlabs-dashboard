import type { LeadDetailData, LeadDetailStage } from '../types/leadDetail';
import type { Lead } from '../types/dashboard';
import { LEAD_DETAIL_STAGE_CONFIG } from '../constants/leadDetail';
import { getMockLeadById } from './mockDashboardData';

const leadDetailStore = new Map<string, LeadDetailData>();

function createRajeshKumarDetail(): LeadDetailData {
  return {
    id: 'lead-001',
    clinicId: 'clinic-001',
    patient: {
      firstName: 'Rajesh',
      lastName: 'Kumar',
      phone: '+91 98765 43210',
      location: 'Ludhiana, Punjab',
      avatarInitials: 'RK',
    },
    stage: 'new_lead',
    stageLabel: LEAD_DETAIL_STAGE_CONFIG.new_lead.label,
    stageSince: '2026-06-15',
    followUpActive: false,
    metrics: {
      currentStage: {
        label: 'Current Stage',
        value: 'New Lead',
        subValue: 'Since Jun 15, 2026',
        variant: 'green',
      },
      nextAction: {
        label: 'Next Action',
        value: 'Start Follow Up',
        variant: 'orange',
      },
      lastActivity: {
        label: 'Last Activity',
        value: '1 Hour Ago',
        subValue: 'WhatsApp Message',
        variant: 'slate',
      },
      doctorReview: {
        label: 'Doctor Review',
        value: 'Not Requested',
        variant: 'slate',
      },
    },
    patientInfo: {
      age: 34,
      city: 'Ludhiana',
      hairLossDuration: '3 Years',
      affectedArea: 'Front & Crown',
      hairType: 'Straight, Medium Density',
      previousTreatment: 'Minoxidil (6 months)',
      goal: 'Natural hairline restoration',
      createdOn: '2026-06-15T08:00:00Z',
    },
    snapshot: {
      mainConcern: 'Cost',
      decisionStage: 'Comparing Clinics',
      currentRisk: 'Delay',
      confidenceLevel: 'Medium',
      likelyObjection: 'Pricing',
      bestNextStep: 'Share natural-looking results and financing options',
    },
    guideItems: [
      { id: 'guide-1', text: 'Acknowledge cost concern first' },
      { id: 'guide-2', text: 'Do not push consultation immediately' },
      { id: 'guide-3', text: 'Share natural-looking results' },
      { id: 'guide-4', text: 'Ask for donor area photo' },
      { id: 'guide-5', text: 'Patient comparing multiple clinics' },
      { id: 'guide-6', text: 'Best follow-up time: After 6 PM' },
    ],
    photos: [
      {
        id: 'photo-1',
        label: 'Front View',
        status: 'received',
        storageUrl: null,
      },
      {
        id: 'photo-2',
        label: 'Top View',
        status: 'received',
        storageUrl: null,
      },
      {
        id: 'photo-3',
        label: 'Crown View',
        status: 'missing',
        storageUrl: null,
      },
      {
        id: 'photo-4',
        label: 'Donor Area',
        status: 'missing',
        storageUrl: null,
      },
    ],
    notes: [
      {
        id: 'note-1',
        content: 'Patient asked about cost comparison with other clinics in Ludhiana.',
        authorName: 'Simran Kaur',
        createdAt: '2026-06-16T14:30:00Z',
        updatedAt: '2026-06-16T14:30:00Z',
      },
      {
        id: 'note-2',
        content: 'Prefers evening calls after 6 PM due to work schedule.',
        authorName: 'Simran Kaur',
        createdAt: '2026-06-16T18:00:00Z',
        updatedAt: '2026-06-16T18:00:00Z',
      },
    ],
    timeline: [
      {
        id: 'timeline-1',
        title: 'Lead Created',
        description: 'Inquiry received via WhatsApp',
        createdAt: '2026-06-15T08:00:00Z',
      },
      {
        id: 'timeline-2',
        title: 'Patient Replied',
        description: 'Shared front and top view photos',
        actorName: 'Rajesh Kumar',
        createdAt: '2026-06-15T12:00:00Z',
      },
      {
        id: 'timeline-3',
        title: 'WhatsApp Message',
        description: 'Cost inquiry follow-up sent',
        actorName: 'Simran Kaur',
        createdAt: '2026-06-17T05:30:00Z',
      },
    ],
    doctorReviewStatus: 'Not Requested',
  };
}

function createGenericDetail(lead: Lead): LeadDetailData {
  const stage = mapDashboardStageToDetail(lead.stage);

  return {
    id: lead.id,
    clinicId: lead.clinic_id,
    patient: {
      firstName: lead.first_name,
      lastName: lead.last_name,
      phone: lead.phone,
      location: 'Punjab, India',
      avatarInitials: lead.avatar_initials,
    },
    stage,
    stageLabel: LEAD_DETAIL_STAGE_CONFIG[stage].label,
    stageSince: lead.created_at.split('T')[0],
    followUpActive: stage === 'follow_up_active',
    metrics: {
      currentStage: {
        label: 'Current Stage',
        value: LEAD_DETAIL_STAGE_CONFIG[stage].label,
        subValue: `Since ${formatShortDate(lead.created_at)}`,
        variant: 'purple',
      },
      nextAction: {
        label: 'Next Action',
        value: lead.next_action.label,
        variant: lead.next_action.variant === 'green' ? 'green' : 'orange',
      },
      lastActivity: {
        label: 'Last Activity',
        value: lead.last_activity.label,
        subValue: lead.last_activity.description,
        variant: 'slate',
      },
      doctorReview: {
        label: 'Doctor Review',
        value: stage === 'doctor_review_requested' ? 'Requested' : 'Not Requested',
        variant: stage === 'doctor_review_requested' ? 'blue' : 'slate',
      },
    },
    patientInfo: {
      age: 32,
      city: 'Ludhiana',
      hairLossDuration: '2 Years',
      affectedArea: 'Front',
      hairType: 'Straight',
      previousTreatment: 'None',
      goal: 'Hair restoration',
      createdOn: lead.created_at,
    },
    snapshot: {
      mainConcern: 'Results',
      decisionStage: 'Researching',
      currentRisk: 'Low',
      confidenceLevel: 'Medium',
      likelyObjection: 'Time commitment',
      bestNextStep: 'Schedule a follow-up call',
    },
    guideItems: [
      { id: `guide-${lead.id}-1`, text: 'Confirm patient availability' },
      { id: `guide-${lead.id}-2`, text: 'Review submitted information' },
      { id: `guide-${lead.id}-3`, text: 'Offer to answer questions' },
    ],
    photos: [
      { id: `photo-${lead.id}-1`, label: 'Front View', status: 'pending', storageUrl: null },
      { id: `photo-${lead.id}-2`, label: 'Top View', status: 'pending', storageUrl: null },
      { id: `photo-${lead.id}-3`, label: 'Crown View', status: 'missing', storageUrl: null },
      { id: `photo-${lead.id}-4`, label: 'Donor Area', status: 'missing', storageUrl: null },
    ],
    notes: [],
    timeline: [
      {
        id: `timeline-${lead.id}-1`,
        title: 'Lead Created',
        createdAt: lead.created_at,
      },
    ],
    doctorReviewStatus:
      stage === 'doctor_review_requested' ? 'Requested' : 'Not Requested',
  };
}

function mapDashboardStageToDetail(stage: Lead['stage']): LeadDetailStage {
  switch (stage) {
    case 'new_lead':
      return 'new_lead';
    case 'follow_up':
      return 'follow_up_active';
    case 'information_collected':
      return 'waiting_for_photos';
    case 'doctor_review':
      return 'doctor_review_requested';
    case 'consultation_ready':
      return 'consultation_ready';
    case 'photos_received':
      return 'waiting_for_photos';
    default:
      return 'new_lead';
  }
}

function formatShortDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function getMockLeadDetail(leadId: string, clinicId: string): LeadDetailData | null {
  const cached = leadDetailStore.get(leadId);
  if (cached) {
    return structuredClone(cached);
  }

  if (leadId === 'lead-001') {
    const detail = createRajeshKumarDetail();
    leadDetailStore.set(leadId, detail);
    return structuredClone(detail);
  }

  const lead = getMockLeadById(leadId, clinicId);
  if (!lead) {
    return null;
  }

  const detail = createGenericDetail(lead);
  leadDetailStore.set(leadId, detail);
  return structuredClone(detail);
}

export function saveMockLeadDetail(detail: LeadDetailData): LeadDetailData {
  leadDetailStore.set(detail.id, structuredClone(detail));
  return structuredClone(detail);
}

export function resetMockLeadDetailStore(): void {
  leadDetailStore.clear();
}
