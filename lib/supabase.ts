import { createClient } from '@supabase/supabase-js';

const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ? process.env.NEXT_PUBLIC_SUPABASE_URL.trim() : '';
const envKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.trim() : '';

// Validate URL format (simple check)
const isValidUrl = (url: string) => url.startsWith('http://') || url.startsWith('https://');

const supabaseUrl = isValidUrl(envUrl) ? envUrl : 'https://example.com';
const supabaseAnonKey = envKey || 'placeholder';

if (supabaseUrl === 'https://example.com' || supabaseAnonKey === 'placeholder') {
  console.warn('Supabase environment variables are not set or valid. Using localStorage fallback.');
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
  return isValidUrl(envUrl) && !!envKey;
};

