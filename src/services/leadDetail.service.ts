import type {
  AddNotePayload,
  LeadDetailData,
  LostLeadReason,
  UpdateNotePayload,
} from '../types/leadDetail';
import { isSupabaseConfigured } from '../lib/supabase';
import {
  addNoteInSupabase,
  addStaffNoteInSupabase,
  deleteNoteInSupabase,
  fetchChatHistoryInSupabase,
  fetchSupabaseLeadDetail,
  hasPendingAiSummaryRequestInSupabase,
  markConsultationReadyInSupabase,
  markLostLeadInSupabase,
  pauseFollowUpInSupabase,
  requestAiSummaryInSupabase,
  requestPhotosInSupabase,
  sendConsultationInviteInSupabase,
  sendToDoctorReviewInSupabase,
  startFollowUpInSupabase,
  updateNoteInSupabase,
  updateAiContextInSupabase,
  updatePatientInfoInSupabase,
} from './supabase/leadDetail.service';

function requireSupabase(): void {
  if (!isSupabaseConfigured()) {
    throw new Error(
      'Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.',
    );
  }
}

export const leadDetailService = {
  async getLeadDetail(leadId: string, clinicId: string): Promise<LeadDetailData | null> {
    requireSupabase();
    return fetchSupabaseLeadDetail(leadId, clinicId);
  },

  async startFollowUp(
    detail: LeadDetailData,
    actorName: string,
    userId: string,
  ): Promise<LeadDetailData> {
    requireSupabase();
    return startFollowUpInSupabase(detail, actorName, userId);
  },

  async pauseFollowUp(
    detail: LeadDetailData,
    actorName: string,
    userId: string,
  ): Promise<LeadDetailData> {
    requireSupabase();
    return pauseFollowUpInSupabase(detail, actorName, userId);
  },

  async requestPhotos(
    detail: LeadDetailData,
    actorName: string,
    userId: string,
  ): Promise<LeadDetailData> {
    requireSupabase();
    return requestPhotosInSupabase(detail, actorName, userId);
  },

  async sendToDoctorReview(
    detail: LeadDetailData,
    actorName: string,
    userId: string,
  ): Promise<LeadDetailData> {
    requireSupabase();
    return sendToDoctorReviewInSupabase(detail, actorName, userId);
  },

  async sendConsultationInvite(
    detail: LeadDetailData,
    userId: string,
  ): Promise<LeadDetailData> {
    requireSupabase();
    return sendConsultationInviteInSupabase(detail, userId);
  },

  async markConsultationReady(
    detail: LeadDetailData,
    actorName: string,
    userId: string,
  ): Promise<LeadDetailData> {
    requireSupabase();
    return markConsultationReadyInSupabase(detail, actorName, userId);
  },

  async markLostLead(
    detail: LeadDetailData,
    actorName: string,
    userId: string,
    reason: LostLeadReason,
  ): Promise<LeadDetailData> {
    requireSupabase();
    return markLostLeadInSupabase(detail, actorName, userId, reason);
  },

  async addNote(
    detail: LeadDetailData,
    payload: AddNotePayload,
    userId: string,
  ): Promise<LeadDetailData> {
    requireSupabase();
    return addNoteInSupabase(detail, payload, userId);
  },

  async addStaffNote(
    detail: LeadDetailData,
    content: string,
    userId: string,
  ): Promise<LeadDetailData> {
    requireSupabase();
    return addStaffNoteInSupabase(detail, content, userId);
  },

  async updateAiContext(detail: LeadDetailData, content: string): Promise<LeadDetailData> {
    requireSupabase();
    return updateAiContextInSupabase(detail, content);
  },

  async updateNote(detail: LeadDetailData, payload: UpdateNotePayload): Promise<LeadDetailData> {
    requireSupabase();
    return updateNoteInSupabase(detail, payload);
  },

  async deleteNote(detail: LeadDetailData, noteId: string): Promise<LeadDetailData> {
    requireSupabase();
    return deleteNoteInSupabase(detail, noteId);
  },

  async updatePatientInfo(
    detail: LeadDetailData,
    patientInfo: LeadDetailData['patientInfo'],
  ): Promise<LeadDetailData> {
    requireSupabase();
    return updatePatientInfoInSupabase(detail, patientInfo);
  },

  async requestAiSummary(detail: LeadDetailData): Promise<void> {
    requireSupabase();
    return requestAiSummaryInSupabase(detail);
  },

  async hasPendingAiSummaryRequest(leadId: string): Promise<boolean> {
    requireSupabase();
    return hasPendingAiSummaryRequestInSupabase(leadId);
  },

  async fetchChatHistory(clinicId: string, phone: string) {
    requireSupabase();
    return fetchChatHistoryInSupabase(clinicId, phone);
  },
};
