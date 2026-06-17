import type { UserRole } from './dashboard';

export interface UserProfile {
  id: string;
  clinicId: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  phone: string;
  language: string;
  timezone: string;
  avatarUrl: string | null;
  avatarInitials: string;
}

export interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  language: string;
  timezone: string;
}
