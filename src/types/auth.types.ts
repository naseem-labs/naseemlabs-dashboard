export interface AuthUser {
  id: string;
  email: string;
  displayName: string;
  clinicId: string;
  role: 'receptionist' | 'doctor';
}

export interface AuthSession {
  accessToken: string | null;
  refreshToken: string | null;
  user: AuthUser | null;
  expiresAt: string | null;
  rememberMe: boolean;
  issuedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface AuthResponse {
  success: boolean;
  error?: string;
  session?: AuthSession;
}

export interface AuthState {
  isAuthenticated: boolean;
  session: AuthSession | null;
  isLoading: boolean;
}
