import type { UserProfile } from '../../types/profile';
import { getSupabaseClient } from '../../lib/supabase';
import { mapDbUserToDashboardUser } from './mappers';
import { mapUserToProfile } from '../../lib/mapUserToProfile';
import type { DbUser } from './types';

export async function fetchSupabaseProfile(userId: string): Promise<UserProfile | null> {
  if (userId === 'local-session-user') {
    return null;
  }

  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .maybeSingle<DbUser>();

  if (error || !data) {
    return null;
  }

  return mapUserToProfile(mapDbUserToDashboardUser(data));
}

export async function saveSupabaseProfile(profile: UserProfile): Promise<UserProfile | null> {
  if (profile.id === 'local-session-user') {
    return profile;
  }

  const supabase = getSupabaseClient();
  const fullName = `${profile.firstName} ${profile.lastName}`.trim();
  const { data, error } = await supabase
    .from('users')
    .update({
      name: fullName,
      email: profile.email,
      role: profile.role,
    })
    .eq('id', profile.id)
    .select('*')
    .maybeSingle<DbUser>();

  if (error || !data) {
    return null;
  }

  return mapUserToProfile(mapDbUserToDashboardUser(data));
}
