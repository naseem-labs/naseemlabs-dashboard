import { useCallback, useEffect, useState } from 'react';
import type { UserProfile } from '../types/profile';
import { profileService } from '../services/profile.service';
import { useSupabaseRealtime } from './useSupabaseRealtime';

export function useProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await profileService.getProfile();
        if (isMounted) {
          setProfile(data);
        }
      } catch {
        if (isMounted) {
          setError('Unable to load profile.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void load();

    return () => {
      isMounted = false;
    };
  }, []);

  useSupabaseRealtime(
    'user-profile',
    [{ table: 'users' }, { table: 'clinics' }],
    () => {
      void profileService.getProfile().then(setProfile).catch(() => undefined);
    },
  );

  const saveProfile = useCallback(async (nextProfile: UserProfile) => {
    setIsSaving(true);
    setError(null);

    try {
      const saved = await profileService.saveProfile(nextProfile);
      setProfile(saved);
      setIsEditing(false);
      return saved;
    } catch {
      setError('Unable to save profile.');
      return null;
    } finally {
      setIsSaving(false);
    }
  }, []);

  return {
    profile,
    isLoading,
    isSaving,
    error,
    isEditing,
    setIsEditing,
    saveProfile,
  };
}
