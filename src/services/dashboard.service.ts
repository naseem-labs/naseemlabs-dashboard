import type { DashboardData } from '../types/dashboard';
import { isSupabaseConfigured } from '../lib/supabase';
import { fetchSupabaseDashboardData } from './supabase/dashboard.service';
import { setStoredClinicId } from './supabase/clinicContext';

export type DashboardDataSource = 'supabase' | 'unconfigured';

function requireSupabaseConfigured(): void {
  if (!isSupabaseConfigured()) {
    throw new Error(
      'Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.',
    );
  }
}

export const dashboardService = {
  async getDashboardData(selectedDate?: Date | null): Promise<DashboardData> {
    requireSupabaseConfigured();
    const data = await fetchSupabaseDashboardData(selectedDate);
    if (!data) {
      throw new Error('Unable to load dashboard data from Supabase.');
    }
    return data;
  },

  async getDataSource(): Promise<DashboardDataSource> {
    return isSupabaseConfigured() ? 'supabase' : 'unconfigured';
  },

  async setActiveClinic(
    currentData: DashboardData,
    clinicId: string,
  ): Promise<DashboardData> {
    requireSupabaseConfigured();
    setStoredClinicId(clinicId);
    const data = await fetchSupabaseDashboardData();
    if (!data) {
      return currentData;
    }
    return data;
  },
};
