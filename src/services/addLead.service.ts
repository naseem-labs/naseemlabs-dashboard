import type { CreateLeadInput, CreateLeadResult } from '../types/addLead';
import { isSupabaseConfigured } from '../lib/supabase';
import { createLeadInSupabase } from './supabase/addLead.service';

export const addLeadService = {
  async createLead(input: CreateLeadInput): Promise<CreateLeadResult> {
    if (!isSupabaseConfigured()) {
      throw new Error(
        'Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.',
      );
    }

    return createLeadInSupabase(input);
  },

  isConfigured(): boolean {
    return isSupabaseConfigured();
  },
};
