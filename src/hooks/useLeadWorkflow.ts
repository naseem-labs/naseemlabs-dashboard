import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Lead } from '../types/dashboard';
import { workflowService } from '../services/workflow.service';

export function useLeadWorkflow() {
  const navigate = useNavigate();

  const handleFollowUp = useCallback(async (lead: Lead) => {
    return workflowService.handleFollowUp(lead);
  }, []);

  const handleRequestPhotos = useCallback(async (lead: Lead) => {
    return workflowService.handleRequestPhotos(lead);
  }, []);

  const handleScheduleConsultation = useCallback(async (lead: Lead) => {
    return workflowService.handleScheduleConsultation(lead);
  }, []);

  const handleDoctorReview = useCallback(async (lead: Lead) => {
    return workflowService.handleDoctorReview(lead);
  }, []);

  const handleNextAction = useCallback(
    async (lead: Lead) => {
      if (lead.next_action.action_type === 'view_lead') {
        navigate(`/leads/${lead.id}`);
        return { success: true, message: 'Navigating to lead detail.' };
      }

      return workflowService.executeAction(lead, lead.next_action.action_type);
    },
    [navigate],
  );

  const viewLead = useCallback(
    (leadId: string) => {
      navigate(`/leads/${leadId}`);
    },
    [navigate],
  );

  return {
    handleFollowUp,
    handleRequestPhotos,
    handleScheduleConsultation,
    handleDoctorReview,
    handleNextAction,
    viewLead,
  };
}
