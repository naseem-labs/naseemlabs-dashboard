export const RLS_SETUP_ERROR_CODE = 'SUPABASE_RLS_SETUP_REQUIRED';

export const RLS_SETUP_MESSAGE =
  'Database access is blocked. Row Level Security is enabled on your Supabase project, but the access policies have not been applied yet.';

export function createRlsSetupError(): Error {
  return new Error(`${RLS_SETUP_ERROR_CODE}: ${RLS_SETUP_MESSAGE}`);
}

export function isRlsSetupError(message: string | null | undefined): boolean {
  return Boolean(message?.includes(RLS_SETUP_ERROR_CODE));
}

export function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  if (typeof error === 'string' && error.trim()) {
    return error;
  }

  return fallback;
}

export function getSupabaseProjectRef(): string | null {
  const url = import.meta.env.VITE_SUPABASE_URL;

  if (!url) {
    return null;
  }

  const match = url.match(/https:\/\/([^.]+)\.supabase\.co/);
  return match?.[1] ?? null;
}

export function getSupabaseSqlEditorUrl(): string | null {
  const projectRef = getSupabaseProjectRef();

  if (!projectRef) {
    return null;
  }

  return `https://supabase.com/dashboard/project/${projectRef}/sql/new`;
}
