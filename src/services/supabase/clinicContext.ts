import { CLINIC_ID_STORAGE_KEY } from '../../constants/storage';
import { createRlsSetupError } from '../../lib/supabaseErrors';
import { getSupabaseClient } from '../../lib/supabase';
import type { DashboardUser } from '../../types/dashboard';
import { authService } from '../auth.service';
import {
  buildSyntheticUser,
  mapDbClinicToClinic,
  mapDbUserToDashboardUser,
} from './mappers';
import { fetchClinicForOwner } from './workspace.service';
import type { DbClinic, DbUser } from './types';

export interface WorkspaceContext {
  clinicId: string;
  user: DashboardUser;
  clinic: ReturnType<typeof mapDbClinicToClinic>;
}

let cachedWorkspaceContext: { key: string; context: WorkspaceContext } | null = null;
let workspaceContextRequest: { key: string; promise: Promise<WorkspaceContext> } | null = null;

export function getStoredClinicId(): string | null {
  try {
    return localStorage.getItem(CLINIC_ID_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function setStoredClinicId(clinicId: string): void {
  try {
    const previousClinicId = localStorage.getItem(CLINIC_ID_STORAGE_KEY);
    localStorage.setItem(CLINIC_ID_STORAGE_KEY, clinicId);
    if (previousClinicId !== clinicId) {
      cachedWorkspaceContext = null;
    }
  } catch {
    // Ignore storage errors
  }
}

async function loadClinicById(clinicId: string): Promise<DbClinic | null> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('clinics')
    .select('*')
    .eq('id', clinicId)
    .maybeSingle<DbClinic>();

  if (error) {
    throw new Error(`Failed to load clinic: ${error.message}`);
  }

  return data;
}

async function loadWorkspaceContext(
  email?: string,
  preferredClinicId?: string,
): Promise<WorkspaceContext> {
  const supabase = getSupabaseClient();
  const session = authService.getSession();
  const ownerEmail = email ?? session?.user?.email;
  let clinicRow: DbClinic | null = null;

  const storedClinicId = preferredClinicId ?? getStoredClinicId();
  if (storedClinicId) {
    clinicRow = await loadClinicById(storedClinicId);
  }

  if (!clinicRow && ownerEmail) {
    const workspaceClinic = await fetchClinicForOwner(ownerEmail);
    if (workspaceClinic) {
      clinicRow = await loadClinicById(workspaceClinic.id);
      if (clinicRow) {
        setStoredClinicId(clinicRow.id);
      }
    }
  }

  if (!clinicRow) {
    throw createRlsSetupError();
  }

  let user: DashboardUser | null = null;

  if (session?.user?.id && session.user.id !== 'local-session-user') {
    const { data: sessionUserRow } = await supabase
      .from('users')
      .select('*')
      .eq('id', session.user.id)
      .maybeSingle<DbUser>();

    if (sessionUserRow) {
      user = mapDbUserToDashboardUser(sessionUserRow);
    }
  }

  if (!user && ownerEmail) {
    const { data: userRow } = await supabase
      .from('users')
      .select('*')
      .eq('email', ownerEmail)
      .maybeSingle<DbUser>();

    if (userRow) {
      user = mapDbUserToDashboardUser(userRow);
    }
  }

  if (!user) {
    user = buildSyntheticUser(ownerEmail, clinicRow.id);
  }

  return {
    clinicId: clinicRow.id,
    clinic: mapDbClinicToClinic(clinicRow),
    user,
  };
}

function getWorkspaceContextKey(email?: string, preferredClinicId?: string): string {
  const session = authService.getSession();
  const ownerEmail = email ?? session?.user?.email ?? '';
  const storedClinicId = preferredClinicId ?? getStoredClinicId() ?? '';

  return [
    session?.accessToken ?? '',
    session?.issuedAt ?? '',
    session?.user?.id ?? '',
    session?.user?.email ?? '',
    session?.user?.clinicId ?? '',
    session?.user?.role ?? '',
    ownerEmail,
    storedClinicId,
  ].join('|');
}

export function resolveWorkspaceContext(
  email?: string,
  preferredClinicId?: string,
): Promise<WorkspaceContext> {
  const key = getWorkspaceContextKey(email, preferredClinicId);

  if (cachedWorkspaceContext?.key === key) {
    return Promise.resolve(cachedWorkspaceContext.context);
  }

  if (workspaceContextRequest?.key === key) {
    return workspaceContextRequest.promise;
  }

  const request = loadWorkspaceContext(email, preferredClinicId)
    .then((context) => {
      cachedWorkspaceContext = { key, context };
      if (workspaceContextRequest?.promise === request) {
        workspaceContextRequest = null;
      }
      return context;
    })
    .catch((error: unknown) => {
      if (workspaceContextRequest?.promise === request) {
        workspaceContextRequest = null;
      }
      throw error;
    });

  workspaceContextRequest = { key, promise: request };
  return request;
}
