import type { NotificationType, NotificationTypeConfig } from '../types/notification';

export const NOTIFICATION_TYPE_CONFIG: Record<NotificationType, NotificationTypeConfig> = {
  new_lead: {
    label: 'New Lead',
    badgeClass: 'bg-purple-50 text-purple-700',
  },
  follow_up_reminder: {
    label: 'Follow Up Reminder',
    badgeClass: 'bg-orange-50 text-orange-700',
  },
  doctor_review: {
    label: 'Doctor Review',
    badgeClass: 'bg-blue-50 text-blue-700',
  },
  consultation_scheduled: {
    label: 'Consultation Scheduled',
    badgeClass: 'bg-green-50 text-green-700',
  },
  system: {
    label: 'System Notification',
    badgeClass: 'bg-slate-100 text-slate-700',
  },
};
