import type { AuthResponse, AuthSession, LoginCredentials } from '../types';
import { isSupabaseConfigured } from '../lib/supabase';
import { storageService } from './storage.service';
import { findOrCreateSupabaseUser } from './supabase/auth.service';
import { splitPatientName } from './supabase/mappers';

const SESSION_DURATION_MS = 24 * 60 * 60 * 1000;

function createSessionToken(userId: string, email: string): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(
    JSON.stringify({
      sub: userId,
      email,
      iat: Math.floor(Date.now() / 1000),
    }),
  );
  const signature = btoa(`session-${userId}`);
  return `${header}.${payload}.${signature}`;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function buildSession(
  credentials: LoginCredentials,
  user: { id: string; email: string; name: string; clinicId: string | null; role: 'receptionist' | 'doctor' },
): AuthSession {
  const issuedAt = new Date().toISOString();
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS).toISOString();
  const nameParts = splitPatientName(user.name);

  return {
    accessToken: createSessionToken(user.id, user.email),
    refreshToken: createSessionToken(user.id, user.email),
    user: {
      id: user.id,
      email: user.email,
      displayName: `${nameParts.firstName} ${nameParts.lastName}`.trim(),
      clinicId: user.clinicId ?? '',
      role: user.role,
    },
    expiresAt,
    rememberMe: credentials.rememberMe,
    issuedAt,
  };
}

function isSessionExpired(session: AuthSession): boolean {
  if (!session.expiresAt) {
    return true;
  }

  return new Date(session.expiresAt).getTime() <= Date.now();
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const email = credentials.email.trim();
    const password = credentials.password;

    if (!email || !password) {
      return { success: false, error: 'Email and password are required.' };
    }

    if (!isValidEmail(email)) {
      return { success: false, error: 'Please enter a valid email address.' };
    }

    if (password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters.' };
    }

    if (!isSupabaseConfigured()) {
      return { success: false, error: 'Supabase is not configured.' };
    }

    try {
      const displayName = email.split('@')[0].replace(/[._-]/g, ' ');
      const dbUser = await findOrCreateSupabaseUser(email, displayName);
      const session = buildSession(credentials, {
        id: dbUser.id,
        email: dbUser.email,
        name: dbUser.name,
        clinicId: dbUser.clinic_id,
        role: dbUser.role,
      });

      storageService.set(session, credentials.rememberMe);
      return { success: true, session };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unable to sign in. Please try again.',
      };
    }
  },

  getSession(): AuthSession | null {
    const localSession = storageService.get<AuthSession>(true);
    const sessionSession = storageService.get<AuthSession>(false);
    const session = localSession ?? sessionSession;

    if (!session) {
      return null;
    }

    if (isSessionExpired(session)) {
      this.logout();
      return null;
    }

    return session;
  },

  isAuthenticated(): boolean {
    return this.getSession() !== null;
  },

  logout(): void {
    storageService.clear();
  },

  setWorkspaceRole(role: 'receptionist' | 'doctor'): void {
    const session = this.getSession();
    if (!session?.user) {
      return;
    }

    const nextSession: AuthSession = {
      ...session,
      user: {
        ...session.user,
        role,
      },
    };

    storageService.set(nextSession, session.rememberMe);
  },

  setClinicId(clinicId: string): void {
    const session = this.getSession();
    if (!session?.user) {
      return;
    }

    const nextSession: AuthSession = {
      ...session,
      user: {
        ...session.user,
        clinicId,
      },
    };

    storageService.set(nextSession, session.rememberMe);
  },

  async validateToken(_token: string): Promise<boolean> {
    const session = this.getSession();
    return session?.accessToken === _token && !isSessionExpired(session);
  },
};
