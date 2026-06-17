import { getSupabaseClient } from '../../lib/supabase';
import type { DbUser } from './types';

export async function findOrCreateSupabaseUser(
  email: string,
  displayName: string,
): Promise<DbUser> {
  const supabase = getSupabaseClient();
  const normalizedEmail = email.trim().toLowerCase();

  const { data: existing, error: existingError } = await supabase
    .from('users')
    .select('*')
    .eq('email', normalizedEmail)
    .maybeSingle<DbUser>();

  if (existingError) {
    throw new Error(existingError.message);
  }

  if (existing) {
    return existing;
  }

  const { data: created, error: createError } = await supabase
    .from('users')
    .insert({
      email: normalizedEmail,
      name: displayName.trim() || normalizedEmail.split('@')[0],
      role: 'receptionist',
      clinic_id: null,
    })
    .select('*')
    .single<DbUser>();

  if (createError || !created) {
    throw new Error(createError?.message ?? 'Unable to create user account.');
  }

  return created;
}
