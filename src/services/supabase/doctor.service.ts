import type { Lead } from '../../types/dashboard';
import type { LeadDetailData } from '../../types/leadDetail';
import { getSupabaseClient } from '../../lib/supabase';
import { authService } from '../auth.service';
import { resolveWorkspaceContext } from './clinicContext';
import { mapDbLeadToLeadDetail } from './mappers';
import { createSignedPhotoUrls } from './photoStorage';
import type { DbLead, DbLeadAction, DbLeadPhoto, DbLeadProfile, DbUser } from './types';

export interface DoctorReviewLead {
  leadId: string;
  patientName: string;
  phone: string;
  stage: string;
  concern: string | null;
  nextAction: string | null;
  requestedAt: string | null;
}

async function fetchLeadBundle(leadId: string) {
  const supabase = getSupabaseClient();

  const { data: lead } = await supabase
    .from('leads')
    .select('*')
    .eq('id', leadId)
    .maybeSingle<DbLead>();

  if (!lead) {
    return null;
  }

  const [{ data: profile }, { data: actions }, { data: photos }, { data: followup }] = await Promise.all([
    supabase.from('lead_profile').select('*').eq('lead_id', leadId).maybeSingle<DbLeadProfile>(),
    supabase
      .from('lead_actions')
      .select('*')
      .eq('lead_id', leadId)
      .order('created_at', { ascending: false }),
    supabase.from('lead_photos').select('*').eq('lead_id', leadId),
    supabase
      .from('followup_queue')
      .select('*')
      .eq('lead_id', leadId)
      .order('created_at', { ascending: false })
      .limit(1),
  ]);

  const userIds = Array.from(
    new Set(((actions ?? []) as DbLeadAction[]).map((action) => action.user_id).filter(Boolean)),
  ) as string[];

  let actorNames: Record<string, string> = {};
  if (userIds.length) {
    const { data: users } = await supabase.from('users').select('id, name').in('id', userIds);
    actorNames = Object.fromEntries(
      ((users ?? []) as Pick<DbUser, 'id' | 'name'>[]).map((user) => [user.id, user.name]),
    );
  }

  const photoRows = (photos ?? []) as DbLeadPhoto[];
  const signedUrls = await createSignedPhotoUrls(photoRows);

  return mapDbLeadToLeadDetail(
    lead,
    profile,
    (actions ?? []) as DbLeadAction[],
    photoRows,
    (followup ?? [])[0] ?? null,
    actorNames,
    signedUrls,
  );
}

export async function fetchDoctorReviewQueue(): Promise<DoctorReviewLead[]> {
  const session = authService.getSession();
  const context = await resolveWorkspaceContext(session?.user?.email);
  const supabase = getSupabaseClient();

  const { data: leads, error } = await supabase
    .from('leads')
    .select('id, name, phone, stage, doctor_review_status, updated_at')
    .eq('clinic_id', context.clinicId)
    .or('stage.eq.doctor_review,doctor_review_status.eq.requested')
    .order('updated_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  const leadIds = (leads ?? []).map((lead) => lead.id);
  if (!leadIds.length) {
    return [];
  }

  const { data: profiles } = await supabase
    .from('lead_profile')
    .select('lead_id, patient_concern, next_action')
    .in('lead_id', leadIds);

  const profileMap = new Map(
    ((profiles ?? []) as Pick<DbLeadProfile, 'lead_id' | 'patient_concern' | 'next_action'>[]).map(
      (profile) => [profile.lead_id, profile],
    ),
  );

  return (leads ?? []).map((lead) => {
    const profile = profileMap.get(lead.id);
    return {
      leadId: lead.id,
      patientName: lead.name?.trim() || 'Unknown Patient',
      phone: lead.phone,
      stage: lead.stage ?? 'doctor_review',
      concern: profile?.patient_concern ?? null,
      nextAction: profile?.next_action ?? null,
      requestedAt: lead.updated_at,
    };
  });
}

export async function submitDoctorReview(
  leadId: string,
  decision: 'approved' | 'needs_more_info' | 'not_suitable',
  note: string,
): Promise<LeadDetailData | null> {
  const session = authService.getSession();
  const context = await resolveWorkspaceContext(session?.user?.email);
  const supabase = getSupabaseClient();

  const doctorId =
    session?.user?.id && session.user.id !== 'local-session-user' ? session.user.id : null;

  if (!doctorId) {
    throw new Error('Doctor account not found. Sign in again.');
  }

  const { error: reviewError } = await supabase.from('doctor_reviews').insert({
    lead_id: leadId,
    doctor_id: doctorId,
    decision,
    note: note.trim() || null,
  });

  if (reviewError) {
    throw new Error(reviewError.message);
  }

  const nextStage = decision === 'approved' ? 'consultation_ready' : 'follow_up';
  const nextDoctorStatus = decision === 'approved' ? 'approved' : 'reviewed';

  const { error: leadError } = await supabase
    .from('leads')
    .update({
      stage: nextStage,
      doctor_review_status: nextDoctorStatus,
      followup_active: decision !== 'approved',
      updated_at: new Date().toISOString(),
    })
    .eq('id', leadId)
    .eq('clinic_id', context.clinicId);

  if (leadError) {
    throw new Error(leadError.message);
  }

  await supabase.from('lead_actions').insert({
    lead_id: leadId,
    user_id: doctorId,
    action_type: 'doctor_review_completed',
    action_note: `Decision: ${decision.replace(/_/g, ' ')}${note.trim() ? `. ${note.trim()}` : ''}`,
  });

  await supabase.from('notifications').insert({
    clinic_id: context.clinicId,
    lead_id: leadId,
    type: 'doctor_review',
    is_read: false,
  });

  return fetchLeadBundle(leadId);
}

export async function fetchDoctorDashboardLeads(): Promise<Lead[]> {
  const queue = await fetchDoctorReviewQueue();
  return queue.map((item) => ({
    id: item.leadId,
    clinic_id: '',
    first_name: item.patientName.split(' ')[0] ?? 'Unknown',
    last_name: item.patientName.split(' ').slice(1).join(' '),
    phone: item.phone,
    stage: 'doctor_review',
    last_activity: {
      label: 'Review pending',
      description: item.concern ?? 'Awaiting doctor review',
      icon: 'review' as const,
    },
    next_action: {
      id: `review-${item.leadId}`,
      label: 'Review Patient',
      action_type: 'doctor_review' as const,
      variant: 'blue' as const,
    },
    avatar_initials: item.patientName
      .split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase(),
    photos: [],
    created_at: item.requestedAt ?? new Date().toISOString(),
    updated_at: item.requestedAt ?? new Date().toISOString(),
  }));
}
