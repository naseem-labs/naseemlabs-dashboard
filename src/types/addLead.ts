export type LeadSource =
  | 'whatsapp'
  | 'call'
  | 'walk_in'
  | 'website'
  | 'instagram'
  | 'facebook'
  | 'referral'
  | 'other';

export type ConcernArea =
  | 'front'
  | 'crown'
  | 'front_crown'
  | 'general_thinning'
  | 'not_sure';

export type PhotoType = 'front' | 'top' | 'crown' | 'donor';

export interface CreateLeadPayload {
  patientName: string;
  phone: string;
  city: string;
  leadSource: LeadSource;
  concernArea: ConcernArea | null;
  photosAvailable: boolean;
  photoTypes: PhotoType[];
  note: string;
}

export interface CreateLeadInput extends CreateLeadPayload {
  workspaceId: string;
  createdBy: string;
  createdByName: string;
}

export interface CreateLeadResult {
  leadId: string;
}

export interface AddLeadFormState {
  patientName: string;
  phone: string;
  city: string;
  leadSource: LeadSource | '';
  concernArea: ConcernArea | null;
  photosAvailable: boolean | null;
  photoTypes: PhotoType[];
  note: string;
}

export interface AddLeadFormErrors {
  patientName?: string;
  phone?: string;
  leadSource?: string;
}
