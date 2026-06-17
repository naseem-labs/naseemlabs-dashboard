import type {
  Clinic,
  DashboardData,
  DashboardUser,
  KpiStat,
  Lead,
  NotificationItem,
} from '../types/dashboard';

const clinics: Clinic[] = [
  {
    id: 'clinic-001',
    name: 'Bajwa Hair Restoration',
    logo_url: null,
    logo_initials: 'B',
  },
  {
    id: 'clinic-002',
    name: 'Advanced Hair Studio',
    logo_url: null,
    logo_initials: 'A',
  },
  {
    id: 'clinic-003',
    name: 'London Hair Centre',
    logo_url: null,
    logo_initials: 'L',
  },
];

const users: DashboardUser[] = [
  {
    id: 'user-001',
    clinicId: 'clinic-001',
    firstName: 'Simran',
    lastName: 'Kaur',
    email: 'simran.kaur@bajwahair.com',
    role: 'receptionist',
    phone: '+91 98765 11111',
    language: 'en',
    timezone: 'Asia/Kolkata',
    avatarUrl: null,
    avatarInitials: 'SK',
  },
  {
    id: 'user-002',
    clinicId: 'clinic-002',
    firstName: 'Aman',
    lastName: 'Singh',
    email: 'aman.singh@advancedhair.com',
    role: 'receptionist',
    phone: '+91 98765 22222',
    language: 'en',
    timezone: 'Asia/Kolkata',
    avatarUrl: null,
    avatarInitials: 'AS',
  },
  {
    id: 'user-003',
    clinicId: 'clinic-001',
    firstName: 'Bajwa',
    lastName: 'Singh',
    email: 'dr.bajwa@bajwahair.com',
    role: 'doctor',
    phone: '+91 98765 33333',
    language: 'en',
    timezone: 'Asia/Kolkata',
    avatarUrl: null,
    avatarInitials: 'DB',
  },
];

export const leads: Lead[] = [
  {
    id: 'lead-001',
    clinic_id: 'clinic-001',
    first_name: 'Rajesh',
    last_name: 'Kumar',
    phone: '+91 98765 43210',
    stage: 'follow_up',
    last_activity: {
      label: '2 hours ago',
      description: 'WhatsApp message sent',
      icon: 'message',
    },
    next_action: {
      id: 'na-001',
      label: 'Follow Up Today',
      action_type: 'follow_up',
      variant: 'orange',
    },
    avatar_initials: 'RK',
    created_at: '2026-06-15T08:00:00Z',
    updated_at: '2026-06-17T06:30:00Z',
  },
  {
    id: 'lead-002',
    clinic_id: 'clinic-001',
    first_name: 'Simran',
    last_name: 'Kaur',
    phone: '+91 98123 45678',
    stage: 'information_collected',
    last_activity: {
      label: 'Yesterday',
      description: 'Patient form submitted',
      icon: 'upload',
    },
    next_action: {
      id: 'na-002',
      label: 'Request Missing Photos',
      action_type: 'request_photos',
      variant: 'purple',
    },
    avatar_initials: 'SK',
    created_at: '2026-06-14T10:00:00Z',
    updated_at: '2026-06-16T14:20:00Z',
  },
  {
    id: 'lead-003',
    clinic_id: 'clinic-001',
    first_name: 'Amanpreet',
    last_name: 'Singh',
    phone: '+91 99887 76655',
    stage: 'doctor_review',
    last_activity: {
      label: 'Yesterday',
      description: 'Summary sent to doctor',
      icon: 'review',
    },
    next_action: {
      id: 'na-003',
      label: 'Check Doctor Review',
      action_type: 'doctor_review',
      variant: 'blue',
    },
    avatar_initials: 'AS',
    created_at: '2026-06-13T09:00:00Z',
    updated_at: '2026-06-16T11:00:00Z',
  },
  {
    id: 'lead-004',
    clinic_id: 'clinic-001',
    first_name: 'Priya',
    last_name: 'Sharma',
    phone: '+91 91234 56789',
    stage: 'new_lead',
    last_activity: {
      label: '30 minutes ago',
      description: 'Inquiry via website',
      icon: 'message',
    },
    next_action: {
      id: 'na-004',
      label: 'Follow Up Today',
      action_type: 'follow_up',
      variant: 'orange',
    },
    avatar_initials: 'PS',
    created_at: '2026-06-17T11:30:00Z',
    updated_at: '2026-06-17T11:30:00Z',
  },
  {
    id: 'lead-005',
    clinic_id: 'clinic-001',
    first_name: 'Harpreet',
    last_name: 'Gill',
    phone: '+91 98760 12345',
    stage: 'consultation_ready',
    last_activity: {
      label: '3 hours ago',
      description: 'Photos received',
      icon: 'upload',
    },
    next_action: {
      id: 'na-005',
      label: 'Schedule Consultation',
      action_type: 'schedule_consultation',
      variant: 'green',
    },
    avatar_initials: 'HG',
    created_at: '2026-06-12T07:00:00Z',
    updated_at: '2026-06-17T09:00:00Z',
  },
  {
    id: 'lead-006',
    clinic_id: 'clinic-001',
    first_name: 'Neha',
    last_name: 'Verma',
    phone: '+91 97654 32109',
    stage: 'photos_received',
    last_activity: {
      label: '5 hours ago',
      description: 'Photo upload complete',
      icon: 'upload',
    },
    next_action: {
      id: 'na-006',
      label: 'Schedule Consultation',
      action_type: 'schedule_consultation',
      variant: 'green',
    },
    avatar_initials: 'NV',
    created_at: '2026-06-11T12:00:00Z',
    updated_at: '2026-06-17T07:00:00Z',
  },
  {
    id: 'lead-007',
    clinic_id: 'clinic-001',
    first_name: 'Vikram',
    last_name: 'Malhotra',
    phone: '+91 96543 21098',
    stage: 'new_lead',
    last_activity: {
      label: '1 hour ago',
      description: 'Phone inquiry received',
      icon: 'phone',
    },
    next_action: {
      id: 'na-007',
      label: 'Follow Up Today',
      action_type: 'follow_up',
      variant: 'orange',
    },
    avatar_initials: 'VM',
    created_at: '2026-06-17T10:00:00Z',
    updated_at: '2026-06-17T10:00:00Z',
  },
  {
    id: 'lead-008',
    clinic_id: 'clinic-001',
    first_name: 'Kiran',
    last_name: 'Devi',
    phone: '+91 95432 10987',
    stage: 'follow_up',
    last_activity: {
      label: '4 hours ago',
      description: 'Follow-up call made',
      icon: 'phone',
    },
    next_action: {
      id: 'na-008',
      label: 'Follow Up Today',
      action_type: 'follow_up',
      variant: 'orange',
    },
    avatar_initials: 'KD',
    created_at: '2026-06-10T08:00:00Z',
    updated_at: '2026-06-17T08:00:00Z',
  },
];

export const kpiStatsMutable: KpiStat[] = [
  {
    id: 'kpi-new-leads',
    label: 'New Leads',
    count: 12,
    subtitle: 'New inquiries today',
    trend: { value: 20, direction: 'up', label: 'from yesterday' },
    filter_stage: 'new',
    accent: 'purple',
  },
  {
    id: 'kpi-follow-up',
    label: 'Follow Up',
    count: 7,
    subtitle: 'Active follow ups',
    trend: { value: 12, direction: 'up', label: 'from yesterday' },
    filter_stage: 'followup',
    accent: 'orange',
  },
  {
    id: 'kpi-consultation',
    label: 'Consultation Ready',
    count: 3,
    subtitle: 'Ready for consultation',
    trend: { value: 15, direction: 'up', label: 'from yesterday' },
    filter_stage: 'consultation-ready',
    accent: 'green',
  },
  {
    id: 'kpi-doctor-review',
    label: 'Doctor Review',
    count: 2,
    subtitle: 'Pending doctor review',
    trend: { value: 5, direction: 'down', label: 'from yesterday' },
    filter_stage: 'doctor-review',
    accent: 'blue',
  },
];

const notifications: NotificationItem[] = [
  { id: 'notif-001', title: 'New lead inquiry received', read: false },
  { id: 'notif-002', title: 'Doctor review completed', read: false },
  { id: 'notif-003', title: 'Consultation scheduled', read: true },
];

function resolveUser(email?: string): DashboardUser {
  const matched = users.find(
    (user) => user.email.toLowerCase() === email?.toLowerCase(),
  );
  return matched ?? users[0];
}

function getClinicLeads(clinicId: string): Lead[] {
  return leads.filter((lead) => lead.clinic_id === clinicId);
}

export function buildMockDashboardData(userEmail?: string): DashboardData {
  const user = resolveUser(userEmail);
  const clinic = clinics.find((item) => item.id === user.clinicId) ?? clinics[0];

  return {
    clinic,
    user,
    clinics,
    kpi_stats: kpiStatsMutable,
    leads: getClinicLeads(clinic.id),
    notifications,
  };
}

export function getMockLeadById(leadId: string, clinicId: string): Lead | undefined {
  return leads.find((lead) => lead.id === leadId && lead.clinic_id === clinicId);
}

export function updateMockClinic(
  data: DashboardData,
  clinicId: string,
): DashboardData {
  const clinic = data.clinics.find((item) => item.id === clinicId);
  if (!clinic) {
    return data;
  }

  return {
    ...data,
    clinic,
    leads: getClinicLeads(clinic.id),
  };
}

export function getMockUserByEmail(email?: string): DashboardUser {
  return resolveUser(email);
}
