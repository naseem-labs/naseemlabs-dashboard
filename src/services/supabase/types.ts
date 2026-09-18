export interface DbClinic {
  id: string;
  name: string;
  clinic_whatsapp_number: string | null;
  owner_email: string | null;
  location: string | null;
  created_at: string | null;
}

export interface DbUser {
  id: string;
  clinic_id: string | null;
  name: string;
  email: string;
  role: 'receptionist' | 'doctor';
  created_at: string | null;
}

export interface DbLead {
  id: string;
  clinic_id: string;
  name: string | null;
  phone: string;
  city: string | null;
  stage: string | null;
  followup_active: boolean | null;
  doctor_review_status: string | null;
  source: string | null;
  created_by: string | null;
  photos_available: boolean | null;
  requested_photo_types: string[] | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface DbLeadProfile {
  lead_id: string;
  age: number | null;
  hair_loss_duration: string | null;
  affected_area: string | null;
  hair_type: string | null;
  previous_treatment: string | null;
  previous_transplant: boolean | null;
  location: string | null;
  occupation: string | null;
  budget_range: string | null;
  goal: string | null;
  patient_concern: string | null;
  ai_summary: string | null;
  lead_context: string | null;
  next_action: string | null;
  consultation_booking_requested: boolean | null;
  updated_at: string | null;
}

export interface DbLeadAction {
  id: string;
  lead_id: string;
  user_id: string | null;
  action_type: string;
  action_note: string | null;
  created_at: string | null;
}

export interface DbInternalOpNote {
  id: string;
  lead_id: string;
  clinic_id: string;
  phone_number: string;
  note_text: string;
  created_by: string | null;
  created_at: string | null;
}

export interface DbPreetPatientMemory {
  clinic_id: string;
  session_id: string;
  ai_context_intel: string | null;
}

export interface DbLeadPhoto {
  id: string;
  lead_id: string;
  photo_type: string;
  storage_path: string;
  uploaded_at: string | null;
}

export interface DbFollowupQueue {
  id: string;
  lead_id: string;
  clinic_id: string;
  patient_number: string;
  clinic_number: string;
  followup_type: string;
  followup_reason: string | null;
  scheduled_for: string | null;
  status: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface DbNotification {
  id: string;
  clinic_id: string;
  lead_id: string | null;
  type: string;
  is_read: boolean | null;
  created_at: string | null;
}

export interface DbLeadWithRelations extends DbLead {
  lead_profile: DbLeadProfile | DbLeadProfile[] | null;
}

export interface DbAiSummaryRequest {
  id: string;
  lead_id: string;
  clinic_id: string;
  phone: string;
  created_at: string;
}

export interface DbChatHistoryRow {
  id: number;
  session_id: string;
  message: {
    type?: string;
    content?: unknown;
  } | null;
  updated_at: string | null;
}
