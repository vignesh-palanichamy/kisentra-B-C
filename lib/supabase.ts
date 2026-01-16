import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://example.com';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder';

if (supabaseUrl === 'https://example.com' || supabaseAnonKey === 'placeholder') {
  console.warn('Supabase environment variables are not set. Using localStorage fallback.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
});

// Helper function to check if Supabase is configured
export const isSupabaseConfigured = () => {
  return supabaseUrl !== 'https://example.com' && supabaseAnonKey !== 'placeholder';
};

