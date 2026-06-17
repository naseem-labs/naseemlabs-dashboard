import type { WorkspaceId } from './workspace.types';

export interface ClinicSetupForm {
  clinicName: string;
  clinicWhatsappNumber: string;
  clinicLocation: string;
}

export interface WorkspaceClinic {
  id: string;
  name: string;
  clinicWhatsappNumber: string | null;
  location: string | null;
  ownerEmail: string | null;
}

export interface WorkspaceClinicInput {
  clinicName: string;
  clinicWhatsappNumber: string;
  clinicLocation: string;
  ownerEmail: string;
}

export interface WorkspaceContinuePayload {
  workspaceId: WorkspaceId;
  clinic?: ClinicSetupForm;
}
