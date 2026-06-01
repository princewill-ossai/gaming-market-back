import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabase: SupabaseClient;

export const getSupabase = () => {
  if (!supabase) {
    supabase = createClient(
      process.env.SUPABASE_URL as string,
      process.env.SUPABASE_KEY as string,
    );
  }

  return supabase;
};
