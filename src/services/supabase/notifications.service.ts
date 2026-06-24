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
    .select(`
      *,
      leads (
        id,
        name,
        phone,
        stage,
        lead_profile (
          patient_concern,
          next_action,
          ai_summary,
          lead_context
        )
      )
    `)
    .eq('clinic_id', context.clinicId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return ((data ?? []) as any[]).map((row) => {
    const lead = Array.isArray(row.leads) ? row.leads[0] : row.leads;

    const profile = Array.isArray(lead?.lead_profile)
      ? lead.lead_profile[0]
      : lead?.lead_profile;

    const concern = profile?.patient_concern;
    const nextAction = profile?.next_action;

    return {
      id: row.id,
      leadId: lead?.id,
      type: row.type === 'new_lead' ? 'new_lead' : row.type === 'doctor_review' ? 'doctor_review' : 'system',
      title: lead?.name || row.title || 'Unknown Patient',
      message:
        row.message ||
        [
          lead?.phone,
          concern ? `Concern: ${concern}` : null,
          nextAction ? `Next: ${nextAction}` : null,
        ]
          .filter(Boolean)
          .join(' • '),
      createdAt: row.created_at ?? new Date().toISOString(),
      read: Boolean(row.is_read),
    };
  });
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
