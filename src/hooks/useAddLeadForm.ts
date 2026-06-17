import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { DashboardUser } from '../types/dashboard';
import type { AddLeadFormErrors, AddLeadFormState, LeadSource } from '../types/addLead';
import { NOTE_MAX_LENGTH } from '../constants/addLead';
import { leadDetailPath } from '../constants/routes';
import { addLeadService } from '../services/addLead.service';

const INITIAL_STATE: AddLeadFormState = {
  patientName: '',
  phone: '',
  city: '',
  leadSource: '',
  concernArea: null,
  photosAvailable: null,
  photoTypes: [],
  note: '',
};

function validateForm(state: AddLeadFormState): AddLeadFormErrors {
  const errors: AddLeadFormErrors = {};

  if (!state.patientName.trim()) {
    errors.patientName = 'Patient name is required.';
  }

  if (!state.phone.trim()) {
    errors.phone = 'Phone number is required.';
  } else if (state.phone.replace(/\D/g, '').length < 10) {
    errors.phone = 'Enter a valid phone number.';
  }

  if (!state.leadSource) {
    errors.leadSource = 'Lead source is required.';
  }

  return errors;
}

export function useAddLeadForm(user: DashboardUser, workspaceId: string) {
  const navigate = useNavigate();
  const [form, setForm] = useState<AddLeadFormState>(INITIAL_STATE);
  const [errors, setErrors] = useState<AddLeadFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const updateField = useCallback(
    <K extends keyof AddLeadFormState>(key: K, value: AddLeadFormState[K]) => {
      setForm((current) => ({ ...current, [key]: value }));
      setErrors((current) => ({ ...current, [key]: undefined }));
      setSubmitError(null);
    },
    [],
  );

  const handleSubmit = useCallback(async () => {
    const validationErrors = validateForm(form);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const result = await addLeadService.createLead({
        patientName: form.patientName,
        phone: form.phone.trim(),
        city: form.city,
        leadSource: form.leadSource as LeadSource,
        concernArea: form.concernArea,
        photosAvailable: form.photosAvailable === true,
        photoTypes: form.photosAvailable ? form.photoTypes : [],
        note: form.note.slice(0, NOTE_MAX_LENGTH),
        workspaceId,
        createdBy: user.id,
        createdByName: `${user.firstName} ${user.lastName}`,
      });

      setSuccessMessage('Lead created successfully.');
      window.setTimeout(() => {
        navigate(leadDetailPath(result.leadId));
      }, 900);
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : 'Unable to create lead. Please try again.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [form, navigate, user, workspaceId]);

  const handleCancel = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  return {
    form,
    errors,
    isSubmitting,
    submitError,
    successMessage,
    isSupabaseConfigured: addLeadService.isConfigured(),
    updateField,
    handleSubmit,
    handleCancel,
    clearSuccessMessage: () => setSuccessMessage(null),
    clearSubmitError: () => setSubmitError(null),
  };
}
