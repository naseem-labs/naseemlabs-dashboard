import type { AppNotification } from '../types/notification';
import { isSupabaseConfigured } from '../lib/supabase';
import {
  fetchSupabaseNotifications,
  markNotificationRead,
} from './supabase/notifications.service';

export const notificationService = {
  async getNotifications(): Promise<AppNotification[]> {
    if (!isSupabaseConfigured()) {
      throw new Error(
        'Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.',
      );
    }

    const notifications = await fetchSupabaseNotifications();
    return notifications ?? [];
  },

  async markAsRead(notificationId: string): Promise<void> {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase is not configured.');
    }

    await markNotificationRead(notificationId);
  },
};
