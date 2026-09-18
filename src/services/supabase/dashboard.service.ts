import type { DashboardData } from '../../types/dashboard';
import { isSupabaseConfigured, getSupabaseClient } from '../../lib/supabase';
import { authService } from '../auth.service';
import { resolveWorkspaceContext } from './clinicContext';
import {
  computeKpiStats,
  mapDbLeadToLead,
} from './mappers';
import type { DbLead, DbLeadAction, DbLeadProfile } from './types';

export async function fetchSupabaseDashboardData(
  selectedDate?: Date | null,
): Promise<DashboardData | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const session = authService.getSession();
  const context = await resolveWorkspaceContext(session?.user?.email);
  const supabase = getSupabaseClient();

  let leadsQuery = supabase
    .from('leads')
    .select(
      'id, clinic_id, name, phone, city, stage, followup_active, doctor_review_status, created_at, updated_at',
    )
    .eq('clinic_id', context.clinicId);

  if (selectedDate) {
    const startOfDay = new Date(selectedDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(selectedDate);
    endOfDay.setHours(23, 59, 59, 999);

    leadsQuery = leadsQuery
      .gte('created_at', startOfDay.toISOString())
      .lte('created_at', endOfDay.toISOString());
  }

  const { data: leadRows, error: leadsError } = await leadsQuery.order(
    'updated_at',
    { ascending: false },
  );

  if (leadsError) {
    throw new Error(leadsError.message);
  }

  const leads = (leadRows ?? []) as DbLead[];
  const leadIds = leads.map((lead) => lead.id);

  const [{ data: actionRows }, { data: profileRows }] =
    await Promise.all([
      leadIds.length
        ? supabase
            .from('lead_actions')
            .select('lead_id, action_type, action_note, created_at')
            .in('lead_id', leadIds)
            .order('created_at', { ascending: false })
        : Promise.resolve({ data: [] as DbLeadAction[] }),
      leadIds.length
        ? supabase.from('lead_profile').select('lead_id, next_action').in('lead_id', leadIds)
        : Promise.resolve({ data: [] as DbLeadProfile[] }),
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
    mapDbLeadToLead(
      lead,
      actionsByLead.get(lead.id)?.[0],
      profilesByLead.get(lead.id) ?? null,
    ),
  );

  return {
    clinic: context.clinic,
    user: context.user,
    clinics: [],
    kpi_stats: computeKpiStats(leads),
    leads: mappedLeads,
    notifications: [],
  };
}
