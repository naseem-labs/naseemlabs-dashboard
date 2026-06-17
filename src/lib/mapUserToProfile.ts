import type { UserProfile } from '../types/profile';
import type { DashboardUser } from '../types/dashboard';

export function mapUserToProfile(user: DashboardUser): UserProfile {
  return {
    id: user.id,
    clinicId: user.clinicId,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
    phone: user.phone,
    language: user.language,
    timezone: user.timezone,
    avatarUrl: user.avatarUrl,
    avatarInitials: user.avatarInitials,
  };
}
