import type { Lead, NextActionType } from '../types/dashboard';
import { isSupabaseConfigured } from '../lib/supabase';
import { executeSupabaseWorkflowAction } from './supabase/workflow.service';

export interface WorkflowResult {
  success: boolean;
  message: string;
}

export const workflowService = {
  async handleFollowUp(lead: Lead): Promise<WorkflowResult> {
    return this.executeAction(lead, 'follow_up');
  },

  async handleRequestPhotos(lead: Lead): Promise<WorkflowResult> {
    return this.executeAction(lead, 'request_photos');
  },

  async handleScheduleConsultation(lead: Lead): Promise<WorkflowResult> {
    return this.executeAction(lead, 'schedule_consultation');
  },

  async handleDoctorReview(lead: Lead): Promise<WorkflowResult> {
    return this.executeAction(lead, 'doctor_review');
  },

  async executeAction(lead: Lead, actionType: NextActionType): Promise<WorkflowResult> {
    if (!isSupabaseConfigured()) {
      return { success: false, message: 'Supabase is not configured.' };
    }

    return executeSupabaseWorkflowAction(lead, actionType);
  },
};
