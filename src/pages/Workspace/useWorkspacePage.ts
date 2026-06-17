import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { WORKSPACE_ROUTE_BY_ID } from '../../constants/workspace';
import { authService } from '../../services/auth.service';
import {
  fetchClinicForOwner,
  formatClinicWhatsappForDisplay,
  isClinicSetupComplete,
  linkUserToClinic,
  saveClinicForOwner,
} from '../../services/supabase/workspace.service';
import type { ClinicSetupForm, WorkspaceClinic } from '../../types/workspace';
import type { WorkspaceId } from '../../types/workspace.types';

const EMPTY_FORM: ClinicSetupForm = {
  clinicName: '',
  clinicWhatsappNumber: '',
  clinicLocation: '',
};

export function useWorkspacePage() {
  const navigate = useNavigate();
  const session = authService.getSession();
  const ownerEmail = session?.user?.email ?? '';

  const [selectedWorkspace, setSelectedWorkspace] = useState<WorkspaceId>('reception');
  const [clinic, setClinic] = useState<WorkspaceClinic | null>(null);
  const [form, setForm] = useState<ClinicSetupForm>(EMPTY_FORM);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof ClinicSetupForm, string>>>(
    {},
  );

  const isSetupComplete = useMemo(() => isClinicSetupComplete(clinic), [clinic]);
  const isReadOnly = isSetupComplete;

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
        const existingClinic = await fetchClinicForOwner(ownerEmail);
        if (!isMounted) {
          return;
        }

        setClinic(existingClinic);

        if (existingClinic) {
          setForm({
            clinicName: existingClinic.name,
            clinicWhatsappNumber: formatClinicWhatsappForDisplay(
              existingClinic.clinicWhatsappNumber,
            ),
            clinicLocation: existingClinic.location ?? '',
          });
        }
      } catch (loadError) {
        if (isMounted) {
          setError(
            loadError instanceof Error ? loadError.message : 'Unable to load clinic information.',
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
    (field: keyof ClinicSetupForm, value: string) => {
      if (isReadOnly) {
        return;
      }

      setForm((current) => ({ ...current, [field]: value }));
      setFieldErrors((current) => ({ ...current, [field]: undefined }));
      setError(null);
    },
    [isReadOnly],
  );

  const validateReceptionForm = useCallback((): boolean => {
    if (isSetupComplete) {
      return true;
    }

    const nextErrors: Partial<Record<keyof ClinicSetupForm, string>> = {};

    if (!form.clinicName.trim()) {
      nextErrors.clinicName = 'Clinic name is required.';
    }

    if (!form.clinicWhatsappNumber.trim()) {
      nextErrors.clinicWhatsappNumber = 'Clinic WhatsApp number is required.';
    } else if (form.clinicWhatsappNumber.replace(/\D/g, '').length < 10) {
      nextErrors.clinicWhatsappNumber = 'Enter a valid WhatsApp number.';
    }

    if (!form.clinicLocation.trim()) {
      nextErrors.clinicLocation = 'Clinic location is required.';
    }

    setFieldErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }, [form, isSetupComplete]);

  const continueToWorkspace = useCallback(
    async (workspaceId: WorkspaceId) => {
      if (!session?.user?.id) {
        setError('You must be signed in to continue.');
        return;
      }

      setIsSubmitting(true);
      setError(null);

      try {
        const role = workspaceId === 'doctor' ? 'doctor' : 'receptionist';
        authService.setWorkspaceRole(role);

        let activeClinic = clinic;

        if (workspaceId === 'reception') {
          if (!validateReceptionForm()) {
            setIsSubmitting(false);
            return;
          }

          if (!isSetupComplete) {
            activeClinic = await saveClinicForOwner({
              clinicName: form.clinicName,
              clinicWhatsappNumber: form.clinicWhatsappNumber,
              clinicLocation: form.clinicLocation,
              ownerEmail,
            });
            setClinic(activeClinic);
          }
        } else if (!activeClinic) {
          setError('Complete reception desk clinic setup before using doctor review.');
          setIsSubmitting(false);
          return;
        }

        if (!activeClinic) {
          throw new Error('Clinic not found. Complete clinic setup first.');
        }

        await linkUserToClinic(session.user.id, activeClinic.id, role);
        authService.setClinicId(activeClinic.id);
        navigate(WORKSPACE_ROUTE_BY_ID[workspaceId], { replace: true });
      } catch (submitError) {
        setError(
          submitError instanceof Error ? submitError.message : 'Unable to continue to workspace.',
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      clinic,
      form.clinicLocation,
      form.clinicName,
      form.clinicWhatsappNumber,
      isSetupComplete,
      navigate,
      ownerEmail,
      session?.user?.id,
      validateReceptionForm,
    ],
  );

  return {
    selectedWorkspace,
    setSelectedWorkspace,
    form,
    updateField,
    fieldErrors,
    isLoading,
    isSubmitting,
    isReadOnly,
    isSetupComplete,
    error,
    continueToWorkspace,
  };
}
