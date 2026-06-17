export type LeadStage =
  | 'new_lead'
  | 'follow_up'
  | 'information_collected'
  | 'photos_received'
  | 'consultation_ready'
  | 'doctor_review';

export type KpiFilterStage =
  | 'new'
  | 'followup'
  | 'consultation-ready'
  | 'doctor-review';

export type NextActionType =
  | 'follow_up'
  | 'request_photos'
  | 'schedule_consultation'
  | 'doctor_review'
  | 'view_lead';

export type TrendDirection = 'up' | 'down' | 'neutral';

export type UserRole = 'receptionist' | 'doctor' | 'admin';

export interface Clinic {
  id: string;
  name: string;
  logo_url: string | null;
  logo_initials: string;
}

export interface DashboardUser {
  id: string;
  clinicId: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  phone: string;
  language: string;
  timezone: string;
  avatarUrl: string | null;
  avatarInitials: string;
}

export interface TrendIndicator {
  value: number;
  direction: TrendDirection;
  label: string;
}

export interface KpiStat {
  id: string;
  label: string;
  count: number;
  subtitle: string;
  trend: TrendIndicator;
  filter_stage: KpiFilterStage;
  accent: 'purple' | 'orange' | 'green' | 'blue';
}

export interface LastActivity {
  label: string;
  description: string;
  icon: 'message' | 'phone' | 'upload' | 'calendar' | 'review';
}

export interface NextAction {
  id: string;
  label: string;
  action_type: NextActionType;
  variant: 'orange' | 'purple' | 'blue' | 'green' | 'navy';
}

export interface Lead {
  id: string;
  clinic_id: string;
  first_name: string;
  last_name: string;
  phone: string;
  stage: LeadStage;
  last_activity: LastActivity;
  next_action: NextAction;
  avatar_initials: string;
  created_at: string;
  updated_at: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  read: boolean;
}

export interface DashboardData {
  clinic: Clinic;
  user: DashboardUser;
  clinics: Clinic[];
  kpi_stats: KpiStat[];
  leads: Lead[];
  notifications: NotificationItem[];
}

export interface StageConfig {
  label: string;
  textClass: string;
  bgClass: string;
}

export interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
}

export interface LeadFilters {
  search: string;
  stage: LeadStage | 'all';
}
