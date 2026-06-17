import type { DashboardData } from '../../types/dashboard';
import { isSupabaseConfigured, getSupabaseClient } from '../../lib/supabase';
import { authService } from '../auth.service';
import { resolveWorkspaceContext } from './clinicContext';
import {
  computeKpiStats,
  mapDbClinicToClinic,
  mapDbLeadToLead,
  mapDbNotification,
} from './mappers';
import type { DbLead, DbLeadAction, DbLeadProfile, DbNotification } from './types';

export async function fetchSupabaseDashboardData(): Promise<DashboardData | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const session = authService.getSession();
  const context = await resolveWorkspaceContext(session?.user?.email);
  const supabase = getSupabaseClient();

  const { data: clinicRows, error: clinicsError } = await supabase
    .from('clinics')
    .select('*')
    .order('name');

  if (clinicsError) {
    throw new Error(clinicsError.message);
  }

  const { data: leadRows, error: leadsError } = await supabase
    .from('leads')
    .select('*')
    .eq('clinic_id', context.clinicId)
    .order('updated_at', { ascending: false });

  if (leadsError) {
    throw new Error(leadsError.message);
  }

  const leads = (leadRows ?? []) as DbLead[];
  const leadIds = leads.map((lead) => lead.id);

  const [{ data: actionRows }, { data: profileRows }, { data: notificationRows }] =
    await Promise.all([
      leadIds.length
        ? supabase
            .from('lead_actions')
            .select('*')
            .in('lead_id', leadIds)
            .order('created_at', { ascending: false })
        : Promise.resolve({ data: [] as DbLeadAction[] }),
      leadIds.length
        ? supabase.from('lead_profile').select('*').in('lead_id', leadIds)
        : Promise.resolve({ data: [] as DbLeadProfile[] }),
      supabase
        .from('notifications')
        .select('*')
        .eq('clinic_id', context.clinicId)
        .order('created_at', { ascending: false })
        .limit(20),
    ]);

  const actionsByLead = new Map<string, DbLeadAction[]>();
  for (const action of (actionRows ?? []) as DbLeadAction[]) {
    const existing = actionsByLead.get(action.lead_id) ?? [];
    existing.push(action);
    actionsByLead.set(action.lead_id, existing);
  }

  const profilesByLead = new Map<string, DbLeadProfile>();
  for (const profile of (profileRows ?? []) as DbLeadProfile[]) {
    profilesByLead.set(profile.lead_id, profile);
  }

  const mappedLeads = leads.map((lead) =>
    mapDbLeadToLead(lead, actionsByLead.get(lead.id)?.[0], profilesByLead.get(lead.id) ?? null),
  );

  return {
    clinic: context.clinic,
    user: context.user,
    clinics: (clinicRows ?? []).map(mapDbClinicToClinic),
    kpi_stats: computeKpiStats(leads),
    leads: mappedLeads,
    notifications: ((notificationRows ?? []) as DbNotification[]).map(mapDbNotification),
  };
}
