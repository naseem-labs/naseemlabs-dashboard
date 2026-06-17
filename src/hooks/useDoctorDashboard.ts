import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import { authService } from '../services/auth.service';
import {
  fetchDoctorReviewQueue,
  submitDoctorReview,
} from '../services/supabase/doctor.service';
import type { DoctorReviewLead } from '../services/supabase/doctor.service';

export function useDoctorDashboard() {
  const [queue, setQueue] = useState<DoctorReviewLead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const items = await fetchDoctorReviewQueue();
      setQueue(items);
    } catch (loadError) {
      setError(
        loadError instanceof Error ? loadError.message : 'Unable to load doctor review queue.',
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

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
        await load();
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
