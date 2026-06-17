import type { Lead, NextActionType } from '../../types/dashboard';
import { authService } from '../auth.service';
import { resolveWorkspaceContext } from './clinicContext';
import {
  fetchSupabaseLeadDetail,
  markConsultationReadyInSupabase,
  requestPhotosInSupabase,
  sendToDoctorReviewInSupabase,
  startFollowUpInSupabase,
} from './leadDetail.service';

export interface WorkflowResult {
  success: boolean;
  message: string;
}

export async function executeSupabaseWorkflowAction(
  lead: Lead,
  actionType: NextActionType,
): Promise<WorkflowResult> {
  const session = authService.getSession();
  const context = await resolveWorkspaceContext(session?.user?.email);
  const actorName = `${context.user.firstName} ${context.user.lastName}`.trim();
  const userId = context.user.id;
  const patientName = `${lead.first_name} ${lead.last_name}`.trim();

  const detail = await fetchSupabaseLeadDetail(lead.id, lead.clinic_id);
  if (!detail) {
    return { success: false, message: 'Lead not found.' };
  }

  switch (actionType) {
    case 'follow_up':
      await startFollowUpInSupabase(detail, actorName, userId);
      return { success: true, message: `Follow-up started for ${patientName}.` };
    case 'request_photos':
      await requestPhotosInSupabase(detail, actorName, userId);
      return { success: true, message: `Photo request sent to ${patientName}.` };
    case 'schedule_consultation':
      await markConsultationReadyInSupabase(detail, actorName, userId);
      return {
        success: true,
        message: `Consultation marked ready for ${patientName}.`,
      };
    case 'doctor_review':
      await sendToDoctorReviewInSupabase(detail, actorName, userId);
      return { success: true, message: `Doctor review requested for ${patientName}.` };
    case 'view_lead':
      return { success: true, message: 'Navigating to lead detail.' };
    default:
      return { success: false, message: 'Unknown action type.' };
  }
}
