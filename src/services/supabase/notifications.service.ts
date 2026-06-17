import type { AppNotification } from '../../types/notification';
import { isSupabaseConfigured, getSupabaseClient } from '../../lib/supabase';
import { resolveWorkspaceContext } from './clinicContext';
import { authService } from '../auth.service';
import type { DbNotification } from './types';

export async function fetchSupabaseNotifications(): Promise<AppNotification[] | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const session = authService.getSession();
  const context = await resolveWorkspaceContext(session?.user?.email);
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('clinic_id', context.clinicId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return ((data ?? []) as DbNotification[]).map((row) => ({
    id: row.id,
    type: row.type === 'new_lead' ? 'new_lead' : row.type === 'doctor_review' ? 'doctor_review' : 'system',
    title: row.type.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()),
    message: row.type.replace(/_/g, ' '),
    createdAt: row.created_at ?? new Date().toISOString(),
    read: Boolean(row.is_read),
  }));
}

export async function markNotificationRead(notificationId: string): Promise<void> {
  const supabase = getSupabaseClient();
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', notificationId);

  if (error) {
    throw new Error(error.message);
  }
}
