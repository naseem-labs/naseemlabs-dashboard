import {
  getSupabaseSqlEditorUrl,
  isRlsSetupError,
  RLS_SETUP_MESSAGE,
} from '../../lib/supabaseErrors';

interface DataLoadErrorScreenProps {
  error: string | null;
  fallbackMessage?: string;
}

export function DataLoadErrorScreen({
  error,
  fallbackMessage = 'Unable to load data.',
}: DataLoadErrorScreenProps) {
  const message = error ?? fallbackMessage;
  const isSetupRequired = isRlsSetupError(message);
  const sqlEditorUrl = getSupabaseSqlEditorUrl();

  if (isSetupRequired) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface px-4 py-10">
        <div className="w-full max-w-xl rounded-2xl border border-amber-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">
            One-time setup required
          </p>
          <h1 className="mt-2 text-xl font-semibold text-navy">Database access is blocked</h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">{RLS_SETUP_MESSAGE}</p>

          <ol className="mt-5 list-decimal space-y-2 pl-5 text-sm leading-6 text-slate-700">
            <li>Open your Supabase project SQL Editor.</li>
            <li>
              Paste and run the migration at{' '}
              <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs">
                supabase/migrations/20260617_integration.sql
              </code>
              .
            </li>
            <li>Refresh this page after the migration completes.</li>
          </ol>

          {sqlEditorUrl ? (
            <a
              href={sqlEditorUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex rounded-xl bg-navy px-4 py-2.5 text-sm font-medium text-white transition hover:bg-navy/90"
            >
              Open Supabase SQL Editor
            </a>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4 py-10">
      <div className="w-full max-w-lg rounded-2xl border border-red-200 bg-white p-6 text-center shadow-sm">
        <h1 className="text-lg font-semibold text-red-700">Something went wrong</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">{message}</p>
      </div>
    </div>
  );
}
