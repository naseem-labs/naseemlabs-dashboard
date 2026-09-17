import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import { authService } from '../services/auth.service';
import {
  fetchDoctorReviewQueue,
  submitDoctorReview,
} from '../services/supabase/doctor.service';
import type { DoctorReviewLead } from '../services/supabase/doctor.service';
import { useSupabaseRealtime } from './useSupabaseRealtime';

export function useDoctorDashboard() {
  const [queue, setQueue] = useState<DoctorReviewLead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const load = useCallback(async (silent = false) => {
    if (!silent) {
      setIsLoading(true);
      setError(null);
    }

    try {
      const items = await fetchDoctorReviewQueue();
      setQueue(items);
    } catch (loadError) {
      if (!silent) {
        setError(
          loadError instanceof Error ? loadError.message : 'Unable to load doctor review queue.',
        );
      }
    } finally {
      if (!silent) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useSupabaseRealtime(
    'doctor-review-queue',
    [
      { table: 'leads' },
      { table: 'lead_profile' },
      { table: 'lead_photos' },
      { table: 'lead_actions' },
    ],
    () => {
      void load(true);
    },
  );

  const reviewLead = useCallback(
    async (
      leadId: string,
      decision: 'approved' | 'needs_more_info' | 'not_suitable',
      note: string,
    ) => {
      setIsSubmitting(true);
      setError(null);

      try {
        await submitDoctorReview(leadId, decision, note);
        await load(true);
      } catch (submitError) {
        setError(
          submitError instanceof Error ? submitError.message : 'Unable to submit doctor review.',
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [load],
  );

  return {
    queue,
    isLoading,
    error,
    isSubmitting,
    reload: load,
    reviewLead,
  };
}

export function useDoctorAuth() {
  const navigate = useNavigate();
  const session = authService.getSession();

  const handleLogout = useCallback(() => {
    authService.logout();
    navigate(ROUTES.LOGIN, { replace: true });
  }, [navigate]);

  return {
    session,
    handleLogout,
  };
}
