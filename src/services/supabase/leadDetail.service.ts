import type {
  AddNotePayload,
  LeadDetailData,
  LostLeadReason,
  PatientInformation,
  UpdateNotePayload,
} from '../../types/leadDetail';
import { getLostReasonLabel } from '../../constants/leadDetail';
import { getSupabaseClient } from '../../lib/supabase';
import { mapDbLeadToLeadDetail } from './mappers';
import { mapDetailStageToDb } from './stageMapping';
import type { DbLead, DbLeadAction, DbLeadPhoto, DbLeadProfile, DbUser } from './types';

async function fetchLeadBundle(leadId: string, clinicId: string) {
  const supabase = getSupabaseClient();

  const { data: lead, error: leadError } = await supabase
    .from('leads')
    .select('*')
    .eq('id', leadId)
    .eq('clinic_id', clinicId)
    .maybeSingle<DbLead>();

  if (leadError) {
    throw new Error(leadError.message);
  }

  if (!lead) {
    return null;
  }

  const [
    { data: profile },
    { data: actions },
    { data: photos },
    { data: followup },
  ] = await Promise.all([
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

  return mapDbLeadToLeadDetail(
    lead,
    profile,
    (actions ?? []) as DbLeadAction[],
    (photos ?? []) as DbLeadPhoto[],
    (followup ?? [])[0] ?? null,
    actorNames,
  );
}

async function insertAction(
  leadId: string,
  userId: string | null,
  actionType: string,
  actionNote?: string,
) {
  const supabase = getSupabaseClient();
  const { error } = await supabase.from('lead_actions').insert({
    lead_id: leadId,
    user_id: userId && userId !== 'local-session-user' ? userId : null,
    action_type: actionType,
    action_note: actionNote ?? null,
  });

  if (error) {
    throw new Error(error.message);
  }
}

async function updateLeadRow(leadId: string, patch: Partial<DbLead>) {
  const supabase = getSupabaseClient();
  const { error } = await supabase
    .from('leads')
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq('id', leadId);

  if (error) {
    throw new Error(error.message);
  }
}

export async function fetchSupabaseLeadDetail(
  leadId: string,
  clinicId: string,
): Promise<LeadDetailData | null> {
  return fetchLeadBundle(leadId, clinicId);
}

export async function startFollowUpInSupabase(
  detail: LeadDetailData,
  actorName: string,
  userId: string,
): Promise<LeadDetailData> {
  await updateLeadRow(detail.id, {
    stage: 'follow_up',
    followup_active: true,
    doctor_review_status: 'none',
  });
  await insertAction(detail.id, userId, 'follow_up_started', `By ${actorName}`);
  return (await fetchLeadBundle(detail.id, detail.clinicId))!;
}

export async function pauseFollowUpInSupabase(
  detail: LeadDetailData,
  actorName: string,
  userId: string,
): Promise<LeadDetailData> {
  await updateLeadRow(detail.id, { stage: 'new', followup_active: false });
  await insertAction(detail.id, userId, 'follow_up_paused', `By ${actorName}`);
  return (await fetchLeadBundle(detail.id, detail.clinicId))!;
}

export async function requestPhotosInSupabase(
  detail: LeadDetailData,
  actorName: string,
  userId: string,
): Promise<LeadDetailData> {
  await updateLeadRow(detail.id, { stage: 'waiting_for_photos', followup_active: true });
  await insertAction(detail.id, userId, 'photos_requested', `By ${actorName}`);

  const supabase = getSupabaseClient();
  await supabase
    .from('lead_profile')
    .upsert({ lead_id: detail.id, next_action: 'Request donor area photo' });

  return (await fetchLeadBundle(detail.id, detail.clinicId))!;
}

export async function sendToDoctorReviewInSupabase(
  detail: LeadDetailData,
  actorName: string,
  userId: string,
): Promise<LeadDetailData> {
  await updateLeadRow(detail.id, {
    stage: 'doctor_review',
    followup_active: true,
    doctor_review_status: 'requested',
  });
  await insertAction(detail.id, userId, 'sent_for_doctor_review', `By ${actorName}`);
  return (await fetchLeadBundle(detail.id, detail.clinicId))!;
}

export async function markConsultationReadyInSupabase(
  detail: LeadDetailData,
  actorName: string,
  userId: string,
): Promise<LeadDetailData> {
  await updateLeadRow(detail.id, {
    stage: 'consultation_ready',
    followup_active: false,
  });
  await insertAction(detail.id, userId, 'consultation_ready_marked', `By ${actorName}`);
  return (await fetchLeadBundle(detail.id, detail.clinicId))!;
}

export async function markLostLeadInSupabase(
  detail: LeadDetailData,
  actorName: string,
  userId: string,
  reason: LostLeadReason,
): Promise<LeadDetailData> {
  const mapped = mapDetailStageToDb('lost_lead');
  await updateLeadRow(detail.id, {
    stage: mapped.stage,
    followup_active: mapped.followupActive,
    doctor_review_status: 'none',
  });
  await insertAction(
    detail.id,
    userId,
    'lead_marked_lost',
    `By ${actorName}. Reason: ${getLostReasonLabel(reason)}`,
  );
  return (await fetchLeadBundle(detail.id, detail.clinicId))!;
}

export async function addNoteInSupabase(
  detail: LeadDetailData,
  payload: AddNotePayload,
  userId: string,
): Promise<LeadDetailData> {
  await insertAction(detail.id, userId, 'internal_note', payload.content.trim());
  return (await fetchLeadBundle(detail.id, detail.clinicId))!;
}

export async function updateNoteInSupabase(
  detail: LeadDetailData,
  payload: UpdateNotePayload,
): Promise<LeadDetailData> {
  const supabase = getSupabaseClient();
  const { error } = await supabase
    .from('lead_actions')
    .update({ action_note: payload.content.trim() })
    .eq('id', payload.noteId)
    .eq('action_type', 'internal_note');

  if (error) {
    throw new Error(error.message);
  }

  return (await fetchLeadBundle(detail.id, detail.clinicId))!;
}

export async function deleteNoteInSupabase(
  detail: LeadDetailData,
  noteId: string,
): Promise<LeadDetailData> {
  const supabase = getSupabaseClient();
  const { error } = await supabase
    .from('lead_actions')
    .delete()
    .eq('id', noteId)
    .eq('action_type', 'internal_note');

  if (error) {
    throw new Error(error.message);
  }

  return (await fetchLeadBundle(detail.id, detail.clinicId))!;
}

export async function updatePatientInfoInSupabase(
  detail: LeadDetailData,
  patientInfo: PatientInformation,
): Promise<LeadDetailData> {
  const supabase = getSupabaseClient();

  await supabase
    .from('leads')
    .update({
      city: patientInfo.city,
      updated_at: new Date().toISOString(),
    })
    .eq('id', detail.id);

  await supabase.from('lead_profile').upsert({
    lead_id: detail.id,
    age: patientInfo.age || null,
    hair_loss_duration: patientInfo.hairLossDuration,
    affected_area: patientInfo.affectedArea,
    hair_type: patientInfo.hairType,
    previous_treatment: patientInfo.previousTreatment,
    goal: patientInfo.goal,
    location: patientInfo.city,
    updated_at: new Date().toISOString(),
  });

  return (await fetchLeadBundle(detail.id, detail.clinicId))!;
}
