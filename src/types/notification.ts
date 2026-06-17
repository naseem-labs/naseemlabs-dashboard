export type NotificationType =
  | 'new_lead'
  | 'follow_up_reminder'
  | 'doctor_review'
  | 'consultation_scheduled'
  | 'system';

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface NotificationTypeConfig {
  label: string;
  badgeClass: string;
}
