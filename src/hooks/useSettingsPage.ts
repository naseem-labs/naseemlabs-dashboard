import { useCallback, useEffect, useMemo, useState } from 'react';
import { authService } from '../services/auth.service';
import { profileService } from '../services/profile.service';
import { fetchClinicSettings, saveClinicSettings } from '../services/supabase/settings.service';
import {
  fetchClinicForOwner,
  formatClinicWhatsappForDisplay,
  saveClinicForOwner,
} from '../services/supabase/workspace.service';
import type { UserProfile } from '../types/profile';

export interface SettingsFormState {
  clinicName: string;
  clinicWhatsappNumber: string;
  clinicLocation: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  timezone: string;
  language: string;
}

const EMPTY_FORM: SettingsFormState = {
  clinicName: '',
  clinicWhatsappNumber: '',
  clinicLocation: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  timezone: 'Asia/Kolkata',
  language: 'en',
};

export function useSettingsPage() {
  const session = authService.getSession();
  const ownerEmail = session?.user?.email ?? '';

  const [form, setForm] = useState<SettingsFormState>(EMPTY_FORM);
  const [initialForm, setInitialForm] = useState<SettingsFormState>(EMPTY_FORM);
  const [clinicId, setClinicId] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      if (!ownerEmail) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const [clinic, clinicSettings, userProfile] = await Promise.all([
          fetchClinicForOwner(ownerEmail),
          fetchClinicSettings(),
          profileService.getProfile(),
        ]);

        if (!isMounted) {
          return;
        }

        const nextForm: SettingsFormState = {
          clinicName: clinic?.name ?? '',
          clinicWhatsappNumber: formatClinicWhatsappForDisplay(clinic?.clinicWhatsappNumber ?? ''),
          clinicLocation: clinic?.location ?? '',
          firstName: userProfile.firstName,
          lastName: userProfile.lastName,
          email: userProfile.email,
          phone: userProfile.phone,
          timezone: clinicSettings.timezone,
          language: userProfile.language,
        };

        setClinicId(clinic?.id ?? clinicSettings.clinicId);
        setProfile(userProfile);
        setForm(nextForm);
        setInitialForm(nextForm);
      } catch (loadError) {
        if (isMounted) {
          setError(
            loadError instanceof Error ? loadError.message : 'Unable to load settings.',
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
  }, [ownerEmail]);

  const updateField = useCallback(
    <K extends keyof SettingsFormState>(field: K, value: SettingsFormState[K]) => {
      setForm((current) => ({ ...current, [field]: value }));
      setSuccessMessage(null);
      setError(null);
    },
    [],
  );

  const preview = useMemo(
    () => ({
      name: form.clinicName || 'Your Clinic Name',
      whatsapp: form.clinicWhatsappNumber || '+91 —',
      location: form.clinicLocation || 'Location not set',
      initials: (form.clinicName || 'NL').trim().charAt(0).toUpperCase(),
    }),
    [form.clinicLocation, form.clinicName, form.clinicWhatsappNumber],
  );

  const saveSettings = useCallback(async () => {
    if (!ownerEmail || !profile) {
      return;
    }

    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const savedClinic = await saveClinicForOwner({
        clinicName: form.clinicName,
        clinicWhatsappNumber: form.clinicWhatsappNumber,
        clinicLocation: form.clinicLocation,
        ownerEmail,
      });

      await saveClinicSettings(form.timezone);

      const savedProfile = await profileService.saveProfile({
        ...profile,
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        language: form.language,
        timezone: form.timezone,
      });

      setClinicId(savedClinic.id);
      setProfile(savedProfile);
      setInitialForm(form);
      setSuccessMessage('Settings saved successfully.');
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Unable to save settings.');
    } finally {
      setIsSaving(false);
    }
  }, [form, ownerEmail, profile]);

  const resetToDefault = useCallback(() => {
    setForm(initialForm);
    setSuccessMessage(null);
    setError(null);
  }, [initialForm]);

  return {
    form,
    preview,
    clinicId,
    isLoading,
    isSaving,
    error,
    successMessage,
    updateField,
    saveSettings,
    resetToDefault,
  };
}
