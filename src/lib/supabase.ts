import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Helper to check if credentials have been provided
export const isSupabaseConfigured = (): boolean => {
  return (
    Boolean(supabaseUrl) &&
    Boolean(supabaseAnonKey) &&
    supabaseUrl.startsWith('https://') &&
    !supabaseUrl.includes('your_supabase_project_url')
  );
};

// Create the Supabase client safely without breaking if keys are pending
export const supabase: SupabaseClient | null = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Function to test whether the connection to Supabase database works
export const testSupabaseConnection = async (): Promise<{
  connected: boolean;
  message: string;
}> => {
  if (!isSupabaseConfigured() || !supabase) {
    return {
      connected: false,
      message: 'Supabase credentials are not configured yet in .env.local.',
    };
  }

  try {
    // Ping profiles or auth session to test the live connection
    const { error } = await supabase.from('profiles').select('id').limit(1);
    if (error && error.code !== 'PGRST116') {
      // If table doesn't exist yet, connection worked but schema is needed
      if (error.message.includes('relation "public.profiles" does not exist')) {
        return {
          connected: true,
          message: 'Connected to Supabase! (Database schema tables still need to be created).',
        };
      }
      return {
        connected: false,
        message: `Connection error: ${error.message}`,
      };
    }
    return {
      connected: true,
      message: 'Successfully connected to Supabase database!',
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return {
      connected: false,
      message: `Failed to connect to Supabase: ${errorMsg}`,
    };
  }
};
