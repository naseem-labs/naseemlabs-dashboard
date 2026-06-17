import { normalizePhone, formatPhoneForDisplay } from '../../lib/phone';
import { getSupabaseClient } from '../../lib/supabase';
import { authService } from '../auth.service';
import { setStoredClinicId } from './clinicContext';
import type { DbClinic, DbUser } from './types';
import type { WorkspaceClinic, WorkspaceClinicInput } from '../../types/workspace';

function mapDbClinic(row: DbClinic): WorkspaceClinic {
  return {
    id: row.id,
    name: row.name,
    clinicWhatsappNumber: row.clinic_whatsapp_number,
    location: row.location,
    ownerEmail: row.owner_email,
  };
}

export function isClinicSetupComplete(clinic: WorkspaceClinic | null): boolean {
  if (!clinic) {
    return false;
  }

  return Boolean(
    clinic.name.trim() &&
      clinic.clinicWhatsappNumber?.trim() &&
      clinic.location?.trim(),
  );
}

export async function fetchClinicForOwner(ownerEmail: string): Promise<WorkspaceClinic | null> {
  const supabase = getSupabaseClient();

  const { data: byOwner, error: ownerError } = await supabase
    .from('clinics')
    .select('*')
    .eq('owner_email', ownerEmail)
    .maybeSingle<DbClinic>();

  if (ownerError) {
    throw new Error(ownerError.message);
  }

  if (byOwner) {
    return mapDbClinic(byOwner);
  }

  const session = authService.getSession();
  if (!session?.user?.id) {
    return null;
  }

  const { data: userRow } = await supabase
    .from('users')
    .select('clinic_id')
    .eq('id', session.user.id)
    .maybeSingle<Pick<DbUser, 'clinic_id'>>();

  if (!userRow?.clinic_id) {
    return null;
  }

  const { data: byUserClinic, error: clinicError } = await supabase
    .from('clinics')
    .select('*')
    .eq('id', userRow.clinic_id)
    .maybeSingle<DbClinic>();

  if (clinicError) {
    throw new Error(clinicError.message);
  }

  return byUserClinic ? mapDbClinic(byUserClinic) : null;
}

export async function saveClinicForOwner(input: WorkspaceClinicInput): Promise<WorkspaceClinic> {
  const supabase = getSupabaseClient();
  const whatsappNumber = normalizePhone(input.clinicWhatsappNumber);
  const ownerEmail = input.ownerEmail.trim().toLowerCase();

  const { data: existing } = await supabase
    .from('clinics')
    .select('*')
    .eq('owner_email', ownerEmail)
    .maybeSingle<DbClinic>();

  let clinicRow: DbClinic | null = null;

  if (existing) {
    const { data, error } = await supabase
      .from('clinics')
      .update({
        name: input.clinicName.trim(),
        clinic_whatsapp_number: whatsappNumber,
        location: input.clinicLocation.trim(),
        owner_email: ownerEmail,
      })
      .eq('id', existing.id)
      .select('*')
      .single<DbClinic>();

    if (error || !data) {
      throw new Error(error?.message ?? 'Unable to update clinic.');
    }

    clinicRow = data;
  } else {
    const { data, error } = await supabase
      .from('clinics')
      .insert({
        name: input.clinicName.trim(),
        clinic_whatsapp_number: whatsappNumber,
        location: input.clinicLocation.trim(),
        owner_email: ownerEmail,
      })
      .select('*')
      .single<DbClinic>();

    if (error || !data) {
      throw new Error(error?.message ?? 'Unable to create clinic.');
    }

    clinicRow = data;
  }

  setStoredClinicId(clinicRow.id);
  return mapDbClinic(clinicRow);
}

export async function linkUserToClinic(
  userId: string,
  clinicId: string,
  role: DbUser['role'],
): Promise<void> {
  const supabase = getSupabaseClient();

  const { error: userError } = await supabase
    .from('users')
    .update({ clinic_id: clinicId, role })
    .eq('id', userId);

  if (userError) {
    throw new Error(userError.message);
  }

  const { error: roleError } = await supabase.from('user_roles').insert({
    user_id: userId,
    clinic_id: clinicId,
    role,
  });

  if (roleError && roleError.code !== '23505') {
    throw new Error(roleError.message);
  }

  setStoredClinicId(clinicId);
}

export function formatClinicWhatsappForDisplay(value: string | null): string {
  if (!value) {
    return '';
  }

  return formatPhoneForDisplay(value);
}
