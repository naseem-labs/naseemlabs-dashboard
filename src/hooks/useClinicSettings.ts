import { useCallback, useEffect, useState } from 'react';
import {
  fetchClinicSettings,
  saveClinicSettings,
  type ClinicSettings,
} from '../services/supabase/settings.service';

export function useClinicSettings() {
  const [settings, setSettings] = useState<ClinicSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await fetchClinicSettings();
        if (isMounted) {
          setSettings(data);
        }
      } catch (loadError) {
        if (isMounted) {
          setError(
            loadError instanceof Error ? loadError.message : 'Unable to load clinic settings.',
          );
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

  const saveTimezone = useCallback(async (timezone: string) => {
    setIsSaving(true);
    setError(null);

    try {
      const saved = await saveClinicSettings(timezone);
      setSettings(saved);
      return saved;
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Unable to save settings.');
      return null;
    } finally {
      setIsSaving(false);
    }
  }, []);

  return {
    settings,
    isLoading,
    isSaving,
    error,
    saveTimezone,
  };
}
