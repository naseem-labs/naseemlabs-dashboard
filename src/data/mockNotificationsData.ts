import type { AppNotification } from '../types/notification';

const mockNotifications: AppNotification[] = [
  {
    id: 'notif-001',
    type: 'new_lead',
    title: 'New Lead Inquiry',
    message: 'A new patient inquiry was received via the website.',
    read: false,
    createdAt: '2026-06-17T08:30:00Z',
  },
  {
    id: 'notif-002',
    type: 'follow_up_reminder',
    title: 'Follow Up Reminder',
    message: 'Rajesh Kumar is due for a follow-up today.',
    read: false,
    createdAt: '2026-06-17T07:15:00Z',
  },
  {
    id: 'notif-003',
    type: 'doctor_review',
    title: 'Doctor Review Pending',
    message: 'Amanpreet Singh is waiting for doctor review.',
    read: false,
    createdAt: '2026-06-16T16:45:00Z',
  },
  {
    id: 'notif-004',
    type: 'consultation_scheduled',
    title: 'Consultation Scheduled',
    message: 'Harpreet Gill consultation has been scheduled.',
    read: true,
    createdAt: '2026-06-16T11:20:00Z',
  },
  {
    id: 'notif-005',
    type: 'system',
    title: 'System Update',
    message: 'Your clinic settings were updated successfully.',
    read: true,
    createdAt: '2026-06-15T09:00:00Z',
  },
];

export function buildMockNotifications(): AppNotification[] {
  return [...mockNotifications];
}
