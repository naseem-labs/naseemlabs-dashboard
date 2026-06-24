import type { CreateLeadInput, CreateLeadResult } from '../../types/addLead';
import { normalizePhone } from '../../lib/phone';
import { getSupabaseClient } from '../../lib/supabase';
import { mapConcernAreaToProfileText } from './mappers';

interface LeadRow {
  id: string;
}

export async function createLeadInSupabase(
  input: CreateLeadInput,
): Promise<CreateLeadResult> {
  const supabase = getSupabaseClient();
  const phone = normalizePhone(input.phone);
  const createdBy =
    input.createdBy && input.createdBy !== 'local-session-user' ? input.createdBy : null;

  const { data: existingLead } = await supabase
    .from('leads')
    .select('id')
    .eq('clinic_id', input.workspaceId)
    .eq('phone', phone)
    .maybeSingle();

  if (existingLead) {
    throw new Error('A lead with this phone number already exists for this clinic.');
  }

  const { data: lead, error: leadError } = await supabase
    .from('leads')
    .insert({
      clinic_id: input.workspaceId,
      name: input.patientName.trim(),
      phone,
      city: input.city.trim() || null,
      source: input.leadSource,
      stage: 'new',
      followup_active: false,
      doctor_review_status: 'none',
      photos_available: input.photosAvailable,
      requested_photo_types: input.photoTypes,
      created_by: createdBy,
    })
    .select('id')
    .single<LeadRow>();

  if (leadError || !lead) {
    if (leadError?.code === '23505') {
      throw new Error('A lead with this phone number already exists for this clinic.');
    }

    throw new Error(leadError?.message ?? 'Unable to create lead.');
  }

  const profilePayload = {
    lead_id: lead.id,
    affected_area: mapConcernAreaToProfileText(input.concernArea),
    lead_context: input.note.trim() || null,
    location: input.city.trim() || null,
    next_action: 'Start Follow Up',
  };

  const { error: profileError } = await supabase
    .from('lead_profile')
    .upsert(profilePayload, { onConflict: 'lead_id' });

  if (profileError) {
    throw new Error(profileError.message);
  }

  const { error: createdActionError } = await supabase.from('lead_actions').insert({
    lead_id: lead.id,
    user_id: createdBy,
    action_type: 'lead_created',
    action_note: `Inquiry received via ${input.leadSource.replace(/_/g, ' ')}`,
  });

  if (createdActionError) {
    throw new Error(createdActionError.message);
  }

  if (input.note.trim()) {
    const { error: noteError } = await supabase.from('lead_actions').insert({
      lead_id: lead.id,
      user_id: createdBy,
      action_type: 'internal_note',
      action_note: input.note.trim(),
    });

    if (noteError) {
      throw new Error(noteError.message);
    }
  }

  if (input.photosAvailable && input.photoTypes.length > 0) {
    const photoRows = input.photoTypes.map((photoType) => ({
      lead_id: lead.id,
      photo_type: photoType,
      storage_path: `pending/${lead.id}/${photoType}`,
    }));

    const { error: photosError } = await supabase.from('lead_photos').insert(photoRows);
    if (photosError) {
      throw new Error(photosError.message);
    }
  }

  await supabase.from('notifications').insert({
    clinic_id: input.workspaceId,
    lead_id: lead.id,
    type: 'new_lead',
    is_read: false,
  });

  return { leadId: lead.id };
}

