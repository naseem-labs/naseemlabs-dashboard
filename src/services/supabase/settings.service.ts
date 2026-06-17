import { getSupabaseClient } from '../../lib/supabase';
import { authService } from '../auth.service';
import { resolveWorkspaceContext } from './clinicContext';

export interface ClinicSettings {
  clinicId: string;
  timezone: string;
}

export async function fetchClinicSettings(): Promise<ClinicSettings> {
  const session = authService.getSession();
  const context = await resolveWorkspaceContext(session?.user?.email);
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('clinic_settings')
    .select('*')
    .eq('clinic_id', context.clinicId)
    .maybeSingle<{ clinic_id: string; timezone: string | null }>();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    const { error: insertError } = await supabase.from('clinic_settings').insert({
      clinic_id: context.clinicId,
      timezone: 'Asia/Kolkata',
    });

    if (insertError) {
      throw new Error(insertError.message);
    }

    return {
      clinicId: context.clinicId,
      timezone: 'Asia/Kolkata',
    };
  }

  return {
    clinicId: data.clinic_id,
    timezone: data.timezone ?? 'Asia/Kolkata',
  };
}

export async function saveClinicSettings(timezone: string): Promise<ClinicSettings> {
  const session = authService.getSession();
  const context = await resolveWorkspaceContext(session?.user?.email);
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('clinic_settings')
    .upsert(
      {
        clinic_id: context.clinicId,
        timezone,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'clinic_id' },
    )
    .select('*')
    .maybeSingle<{ clinic_id: string; timezone: string | null }>();

  if (error || !data) {
    throw new Error(error?.message ?? 'Unable to save clinic settings.');
  }

  return {
    clinicId: data.clinic_id,
    timezone: data.timezone ?? timezone,
  };
}
