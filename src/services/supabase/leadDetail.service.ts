import type {
  AddNotePayload,
  LeadChatMessage,
  LeadDetailData,
  LostLeadReason,
  PatientInformation,
  UpdateNotePayload,
} from '../../types/leadDetail';
import { normalizePhone } from '../../lib/phone';
import { getLostReasonLabel } from '../../constants/leadDetail';
import { getSupabaseClient } from '../../lib/supabase';
import { mapDbLeadToLeadDetail } from './mappers';
import { createSignedPhotoUrls } from './photoStorage';
import { mapDetailStageToDb } from './stageMapping';
import type {
  DbChatHistoryRow,
  DbInternalOpNote,
  DbLead,
  DbLeadAction,
  DbLeadPhoto,
  DbLeadProfile,
  DbPreetPatientMemory,
  DbUser,
} from './types';

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
    { data: staffNotes },
    { data: aiContextMemory },
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
    supabase
      .from('internal_op_notes')
      .select('*')
      .eq('lead_id', leadId)
      .order('created_at', { ascending: false }),
    supabase
      .from('preet_patient_memory')
      .select('clinic_id, session_id, ai_context_intel')
      .eq('clinic_id', clinicId)
      .eq('session_id', normalizePhone(lead.phone))
      .maybeSingle<DbPreetPatientMemory>(),
  ]);

  const userIds = Array.from(
    new Set([
      ...((actions ?? []) as DbLeadAction[]).map((action) => action.user_id),
      ...((staffNotes ?? []) as DbInternalOpNote[]).map((note) => note.created_by),
    ].filter(Boolean)),
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
    (staffNotes ?? []) as DbInternalOpNote[],
    (aiContextMemory as DbPreetPatientMemory | null) ?? null,
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

export async function sendConsultationInviteInSupabase(
  detail: LeadDetailData,
  userId: string,
): Promise<LeadDetailData> {
  const supabase = getSupabaseClient();
  const { error } = await supabase
    .from('lead_profile')
    .update({ consultation_booking_requested: true })
    .eq('lead_id', detail.id);

  if (error) {
    throw new Error(error.message);
  }

  await insertAction(
    detail.id,
    userId,
    'consultation_invite_sent',
    'WhatsApp priority consultation invitation dispatched via system.',
  );

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

export async function addStaffNoteInSupabase(
  detail: LeadDetailData,
  content: string,
  userId: string,
): Promise<LeadDetailData> {
  const supabase = getSupabaseClient();
  const { error } = await supabase.from('internal_op_notes').insert({
    lead_id: detail.id,
    clinic_id: detail.clinicId,
    phone_number: normalizePhone(detail.patient.phone),
    note_text: content.trim(),
    created_by: userId === 'local-session-user' ? null : userId,
  });

  if (error) {
    throw new Error(error.message);
  }

  return (await fetchLeadBundle(detail.id, detail.clinicId))!;
}

export async function updateAiContextInSupabase(
  detail: LeadDetailData,
  content: string,
): Promise<LeadDetailData> {
  const supabase = getSupabaseClient();
  const sessionId = normalizePhone(detail.patient.phone);
  const trimmedContent = content.trim();
  const { data: updatedMemory, error: updateError } = await supabase
    .from('preet_patient_memory')
    .update({ ai_context_intel: trimmedContent, updated_at: new Date().toISOString() })
    .eq('clinic_id', detail.clinicId)
    .eq('session_id', sessionId)
    .select('clinic_id')
    .maybeSingle();

  if (updateError) {
    throw new Error(updateError.message);
  }

  if (!updatedMemory) {
    const { error: insertError } = await supabase.from('preet_patient_memory').insert({
      clinic_id: detail.clinicId,
      session_id: sessionId,
      ai_context_intel: trimmedContent,
    });

    if (insertError) {
      throw new Error(insertError.message);
    }
  }

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
    patient_concern: patientInfo.patientConcern,
    updated_at: new Date().toISOString(),
  });

  return (await fetchLeadBundle(detail.id, detail.clinicId))!;
}

function extractChatContent(content: unknown): string {
  if (typeof content === 'string') {
    return content;
  }

  if (Array.isArray(content)) {
    return content
      .map((part) => {
        if (typeof part === 'string') {
          return part;
        }
        if (part && typeof part === 'object' && 'text' in part) {
          return String((part as { text?: unknown }).text ?? '');
        }
        return '';
      })
      .join('')
      .trim();
  }

  return '';
}

function chatSessionCandidates(phone: string): string[] {
  const normalized = normalizePhone(phone);
  const digits = phone.replace(/\D/g, '');
  return Array.from(
    new Set(
      [normalized, digits, digits.slice(-10), phone.trim()].filter((value) => value.length > 0),
    ),
  );
}

export async function hasPendingAiSummaryRequestInSupabase(leadId: string): Promise<boolean> {
  const supabase = getSupabaseClient();

  const { count, error } = await supabase
    .from('ai_summary_requests')
    .select('id', { count: 'exact', head: true })
    .eq('lead_id', leadId);

  if (error) {
    throw new Error(error.message);
  }

  return (count ?? 0) > 0;
}

export async function requestAiSummaryInSupabase(detail: LeadDetailData): Promise<void> {
  const supabase = getSupabaseClient();
  const phone = normalizePhone(detail.patient.phone);

  const { error } = await supabase.from('ai_summary_requests').insert({
    lead_id: detail.id,
    clinic_id: detail.clinicId,
    phone,
  });

  if (error) {
    throw new Error(error.message);
  }
}

export async function fetchChatHistoryInSupabase(
  clinicId: string,
  phone: string,
): Promise<LeadChatMessage[]> {
  const supabase = getSupabaseClient();
  const sessionIds = chatSessionCandidates(phone);

  const { data: clinicLeads, error: leadError } = await supabase
    .from('leads')
    .select('phone')
    .eq('clinic_id', clinicId);

  if (leadError) {
    throw new Error(leadError.message);
  }

  const clinicHasNumber = ((clinicLeads ?? []) as { phone: string }[]).some((lead) => {
    const leadDigits = chatSessionCandidates(lead.phone);
    return leadDigits.some((value) => sessionIds.includes(value));
  });

  if (!clinicHasNumber) {
    return [];
  }

  const { data, error } = await supabase
    .from('preet_n8n_chat_histories')
    .select('id, session_id, message, updated_at')
    .in('session_id', sessionIds)
    .order('id', { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return ((data ?? []) as DbChatHistoryRow[]).map((row) => {
    const sender = row.message?.type === 'ai' ? 'ai' : 'human';
    return {
      id: row.id,
      sender,
      content: extractChatContent(row.message?.content),
      sentAt: row.updated_at,
    };
  });
}
