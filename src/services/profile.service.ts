import type { UserProfile } from '../types/profile';
import { mapUserToProfile } from '../lib/mapUserToProfile';
import { isSupabaseConfigured } from '../lib/supabase';
import { authService } from './auth.service';
import { resolveWorkspaceContext } from './supabase/clinicContext';
import {
  fetchSupabaseProfile,
  saveSupabaseProfile,
} from './supabase/profile.service';

const localProfileOverrides = new Map<string, Partial<UserProfile>>();

export const profileService = {
  async getProfile(): Promise<UserProfile> {
    const session = authService.getSession();
    const userId = session?.user?.id;

    if (isSupabaseConfigured() && userId) {
      const supabaseProfile = await fetchSupabaseProfile(userId);
      if (supabaseProfile) {
        return {
          ...supabaseProfile,
          ...localProfileOverrides.get(supabaseProfile.id),
        };
      }
    }

    if (isSupabaseConfigured()) {
      const context = await resolveWorkspaceContext(session?.user?.email);
      const profile = mapUserToProfile(context.user);
      return {
        ...profile,
        ...localProfileOverrides.get(profile.id),
      };
    }

    throw new Error('Supabase is not configured.');
  },

  async saveProfile(profile: UserProfile): Promise<UserProfile> {
    if (isSupabaseConfigured()) {
      const saved = await saveSupabaseProfile(profile);
      if (saved) {
        localProfileOverrides.delete(saved.id);
        return saved;
      }

      localProfileOverrides.set(profile.id, profile);
      return profile;
    }

    throw new Error('Supabase is not configured.');
  },

  mapUserToProfile,
};
