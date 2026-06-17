import type {
  Clinic,
  DashboardUser,
  KpiStat,
  Lead,
  LastActivity,
  NextAction,
  NotificationItem,
} from '../../types/dashboard';
import { formatPhoneForDisplay } from '../../lib/phone';
import type {
  GuideItem,
  LeadDetailData,
  LeadMetrics,
  LeadPhoto,
  TimelineEvent,
} from '../../types/leadDetail';
import { LEAD_DETAIL_STAGE_CONFIG } from '../../constants/leadDetail';
import { CONCERN_AREA_OPTIONS } from '../../constants/addLead';
import type {
  DbClinic,
  DbLead,
  DbLeadAction,
  DbLeadPhoto,
  DbLeadProfile,
  DbNotification,
  DbUser,
} from './types';
import { mapDbLeadToDetailStage, mapDbStageToUi } from './stageMapping';

const PHOTO_LABELS: Record<string, string> = {
  front: 'Front View',
  top: 'Top View',
  crown: 'Crown View',
  donor: 'Donor Area',
};

export function getInitials(name: string | null, phone: string): string {
  if (name?.trim()) {
    const parts = name.trim().split(/\s+/);
    return parts
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? '')
      .join('');
  }

  return phone.replace(/\D/g, '').slice(-2) || 'PT';
}

export function splitPatientName(name: string | null): { firstName: string; lastName: string } {
  if (!name?.trim()) {
    return { firstName: 'Unknown', lastName: 'Patient' };
  }

  const parts = name.trim().split(/\s+/);
  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(' '),
  };
}

export function formatRelativeTime(isoDate: string | null): string {
  if (!isoDate) {
    return 'Just now';
  }

  const date = new Date(isoDate);
  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);

  if (diffMinutes < 1) {
    return 'Just now';
  }

  if (diffMinutes < 60) {
    return `${diffMinutes} min ago`;
  }

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
  }

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
}

function mapActionToActivity(action: DbLeadAction | undefined): LastActivity {
  if (!action) {
    return { label: 'No activity', description: 'No recent activity', icon: 'message' };
  }

  const iconMap: Record<string, LastActivity['icon']> = {
    lead_created: 'message',
    follow_up_started: 'phone',
    photos_requested: 'upload',
    consultation_ready_marked: 'calendar',
    sent_for_doctor_review: 'review',
    internal_note: 'message',
  };

  return {
    label: formatRelativeTime(action.created_at),
    description: action.action_note ?? action.action_type.replace(/_/g, ' '),
    icon: iconMap[action.action_type] ?? 'message',
  };
}

function deriveNextAction(lead: DbLead, profile: DbLeadProfile | null): NextAction {
  if (profile?.next_action) {
    return {
      id: `na-${lead.id}`,
      label: profile.next_action,
      action_type: 'follow_up',
      variant: 'orange',
    };
  }

  const uiStage = mapDbStageToUi(lead.stage, lead.followup_active);

  switch (uiStage) {
    case 'new_lead':
      return { id: `na-${lead.id}`, label: 'Start Follow Up', action_type: 'follow_up', variant: 'orange' };
    case 'follow_up':
      return { id: `na-${lead.id}`, label: 'Follow Up Today', action_type: 'follow_up', variant: 'orange' };
    case 'information_collected':
      return { id: `na-${lead.id}`, label: 'Request Photos', action_type: 'request_photos', variant: 'orange' };
    case 'consultation_ready':
      return {
        id: `na-${lead.id}`,
        label: 'Schedule Consultation',
        action_type: 'schedule_consultation',
        variant: 'green',
      };
    case 'doctor_review':
      return { id: `na-${lead.id}`, label: 'Doctor Review', action_type: 'doctor_review', variant: 'blue' };
    default:
      return { id: `na-${lead.id}`, label: 'View Lead', action_type: 'view_lead', variant: 'purple' };
  }
}

export function mapDbClinicToClinic(row: DbClinic): Clinic {
  return {
    id: row.id,
    name: row.name,
    logo_url: null,
    logo_initials: row.name.trim().charAt(0).toUpperCase() || 'C',
  };
}

export function mapDbUserToDashboardUser(row: DbUser): DashboardUser {
  const nameParts = splitPatientName(row.name);

  return {
    id: row.id,
    clinicId: row.clinic_id ?? '',
    firstName: nameParts.firstName,
    lastName: nameParts.lastName,
    email: row.email,
    role: row.role,
    phone: '',
    language: 'en',
    timezone: 'Asia/Kolkata',
    avatarUrl: null,
    avatarInitials: getInitials(row.name, row.email),
  };
}

export function buildSyntheticUser(email: string | undefined, clinicId: string): DashboardUser {
  const localPart = email?.split('@')[0] ?? 'receptionist';
  const displayName = localPart
    .split(/[._-]/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

  const nameParts = splitPatientName(displayName);

  return {
    id: 'local-session-user',
    clinicId,
    firstName: nameParts.firstName,
    lastName: nameParts.lastName,
    email: email ?? 'receptionist@clinic.local',
    role: 'receptionist',
    phone: '',
    language: 'en',
    timezone: 'Asia/Kolkata',
    avatarUrl: null,
    avatarInitials: getInitials(displayName, email ?? 'RP'),
  };
}

export function mapDbLeadToLead(
  lead: DbLead,
  latestAction: DbLeadAction | undefined,
  profile: DbLeadProfile | null,
): Lead {
  const { firstName, lastName } = splitPatientName(lead.name);

  return {
    id: lead.id,
    clinic_id: lead.clinic_id,
    first_name: firstName,
    last_name: lastName,
    phone: formatPhoneForDisplay(lead.phone),
    stage: mapDbStageToUi(lead.stage, lead.followup_active),
    last_activity: mapActionToActivity(latestAction),
    next_action: deriveNextAction(lead, profile),
    avatar_initials: getInitials(lead.name, lead.phone),
    created_at: lead.created_at ?? new Date().toISOString(),
    updated_at: lead.updated_at ?? lead.created_at ?? new Date().toISOString(),
  };
}

export function computeKpiStats(leads: DbLead[]): KpiStat[] {
  const newCount = leads.filter((lead) => lead.stage === 'new' && !lead.followup_active).length;
  const followUpCount = leads.filter(
    (lead) =>
      lead.followup_active ||
      lead.stage === 'follow_up' ||
      lead.stage === 'waiting_for_photos' ||
      lead.stage === 'photos_received',
  ).length;
  const consultationCount = leads.filter((lead) => lead.stage === 'consultation_ready').length;
  const doctorReviewCount = leads.filter(
    (lead) =>
      lead.stage === 'doctor_review' ||
      (lead.doctor_review_status && lead.doctor_review_status !== 'none'),
  ).length;

  return [
    {
      id: 'kpi-new-leads',
      label: 'New Leads',
      count: newCount,
      subtitle: 'New inquiries',
      trend: { value: 0, direction: 'neutral', label: 'live from database' },
      filter_stage: 'new',
      accent: 'purple',
    },
    {
      id: 'kpi-follow-up',
      label: 'Follow Up',
      count: followUpCount,
      subtitle: 'Active follow ups',
      trend: { value: 0, direction: 'neutral', label: 'live from database' },
      filter_stage: 'followup',
      accent: 'orange',
    },
    {
      id: 'kpi-consultation',
      label: 'Consultation Ready',
      count: consultationCount,
      subtitle: 'Ready for consultation',
      trend: { value: 0, direction: 'neutral', label: 'live from database' },
      filter_stage: 'consultation-ready',
      accent: 'green',
    },
    {
      id: 'kpi-doctor-review',
      label: 'Doctor Review',
      count: doctorReviewCount,
      subtitle: 'Pending doctor review',
      trend: { value: 0, direction: 'neutral', label: 'live from database' },
      filter_stage: 'doctor-review',
      accent: 'blue',
    },
  ];
}

export function mapDbNotification(row: DbNotification): NotificationItem {
  return {
    id: row.id,
    title: row.type.replace(/_/g, ' '),
    read: Boolean(row.is_read),
  };
}

function mapActionToTimeline(action: DbLeadAction, actorName?: string): TimelineEvent {
  return {
    id: action.id,
    title: action.action_type.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
    description: action.action_note ?? undefined,
    actorName,
    createdAt: action.created_at ?? new Date().toISOString(),
  };
}

function buildPhotos(
  lead: DbLead,
  uploadedPhotos: DbLeadPhoto[],
): LeadPhoto[] {
  const requested = lead.requested_photo_types ?? [];
  const types = ['front', 'top', 'crown', 'donor'];

  return types.map((type) => {
    const uploaded = uploadedPhotos.find((photo) => photo.photo_type === type);
    let status: LeadPhoto['status'] = 'missing';

    if (uploaded) {
      status = 'received';
    } else if (requested.includes(type)) {
      status = lead.photos_available ? 'received' : 'requested';
    } else if (lead.photos_available) {
      status = 'pending';
    }

    return {
      id: uploaded?.id ?? `${lead.id}-${type}`,
      label: PHOTO_LABELS[type] ?? type,
      status,
      storageUrl: uploaded?.storage_path ?? null,
    };
  });
}

function buildGuideItems(profile: DbLeadProfile | null, lead: DbLead): GuideItem[] {
  const items: GuideItem[] = [];

  if (profile?.patient_concern) {
    items.push({ id: 'guide-concern', text: `Acknowledge concern: ${profile.patient_concern}` });
  }

  if (profile?.next_action) {
    items.push({ id: 'guide-next', text: profile.next_action });
  }

  if (lead.stage === 'waiting_for_photos') {
    items.push({ id: 'guide-photos', text: 'Confirm patient received photo request' });
  }

  if (items.length === 0) {
    items.push({ id: 'guide-default', text: 'Review lead details and take the next action' });
  }

  return items;
}

export function mapDbLeadToLeadDetail(
  lead: DbLead,
  profile: DbLeadProfile | null,
  actions: DbLeadAction[],
  photos: DbLeadPhoto[],
  actorNames: Record<string, string>,
): LeadDetailData {
  const detailStage = mapDbLeadToDetailStage(lead);
  const stageConfig = LEAD_DETAIL_STAGE_CONFIG[detailStage];
  const { firstName, lastName } = splitPatientName(lead.name);
  const timelineActions = actions.filter((action) => action.action_type !== 'internal_note');
  const noteActions = actions.filter((action) => action.action_type === 'internal_note');
  const latestAction = timelineActions[0];

  const metrics: LeadMetrics = {
    currentStage: {
      label: 'Current Stage',
      value: stageConfig.label,
      subValue: lead.created_at
        ? `Since ${new Date(lead.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
        : undefined,
      variant: detailStage === 'lost_lead' ? 'red' : detailStage === 'follow_up_active' ? 'orange' : 'green',
    },
    nextAction: {
      label: 'Next Action',
      value: profile?.next_action ?? deriveNextAction(lead, profile).label,
      variant: 'orange',
    },
    lastActivity: {
      label: 'Last Activity',
      value: formatRelativeTime(latestAction?.created_at ?? lead.updated_at),
      subValue: latestAction?.action_note ?? latestAction?.action_type?.replace(/_/g, ' '),
      variant: 'slate',
    },
    doctorReview: {
      label: 'Doctor Review',
      value:
        lead.doctor_review_status && lead.doctor_review_status !== 'none'
          ? lead.doctor_review_status
          : 'Not Requested',
      variant:
        lead.doctor_review_status && lead.doctor_review_status !== 'none' ? 'blue' : 'slate',
    },
  };

  return {
    id: lead.id,
    clinicId: lead.clinic_id,
    patient: {
      firstName,
      lastName,
      phone: formatPhoneForDisplay(lead.phone),
      location: profile?.location ?? lead.city ?? 'Location not set',
      avatarInitials: getInitials(lead.name, lead.phone),
    },
    stage: detailStage,
    stageLabel: stageConfig.label,
    stageSince: lead.created_at?.split('T')[0] ?? new Date().toISOString().split('T')[0],
    followUpActive: Boolean(lead.followup_active),
    metrics,
    patientInfo: {
      age: profile?.age ?? 0,
      city: lead.city ?? profile?.location ?? 'Not set',
      hairLossDuration: profile?.hair_loss_duration ?? 'Not specified',
      affectedArea: profile?.affected_area ?? 'Not specified',
      hairType: profile?.hair_type ?? 'Not specified',
      previousTreatment: profile?.previous_treatment ?? 'None',
      goal: profile?.goal ?? 'Not specified',
      createdOn: lead.created_at ?? new Date().toISOString(),
    },
    snapshot: {
      mainConcern: profile?.patient_concern ?? 'Not specified',
      decisionStage: profile?.lead_context ?? 'Researching',
      currentRisk: 'Medium',
      confidenceLevel: 'Medium',
      likelyObjection: profile?.budget_range ?? 'Not specified',
      bestNextStep: profile?.next_action ?? 'Follow up with patient',
    },
    guideItems: buildGuideItems(profile, lead),
    photos: buildPhotos(lead, photos),
    notes: noteActions.map((action) => ({
      id: action.id,
      content: action.action_note ?? '',
      authorName: action.user_id ? actorNames[action.user_id] ?? 'Staff' : 'Staff',
      createdAt: action.created_at ?? new Date().toISOString(),
      updatedAt: action.created_at ?? new Date().toISOString(),
    })),
    timeline: timelineActions.map((action) =>
      mapActionToTimeline(action, action.user_id ? actorNames[action.user_id] : undefined),
    ),
    doctorReviewStatus:
      lead.doctor_review_status && lead.doctor_review_status !== 'none'
        ? lead.doctor_review_status
        : 'Not Requested',
  };
}

export function mapConcernAreaToProfileText(concern: string | null): string | null {
  if (!concern) {
    return null;
  }

  return CONCERN_AREA_OPTIONS.find((option) => option.value === concern)?.label ?? concern;
}
