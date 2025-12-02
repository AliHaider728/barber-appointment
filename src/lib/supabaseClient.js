import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Get the correct redirect URL based on environment
const getRedirectURL = () => {
  // Production URLs
  if (window.location.hostname.includes('vercel.app')) {
    return 'https://barber-appointment-six.vercel.app/callback';
  }
  // Local development
  return 'http://localhost:5173/callback';
};

// Create a single instance to be reused throughout the app
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: window.localStorage,
    storageKey: 'barber-auth-token',
    // Set the redirect URL
    redirectTo: getRedirectURL(),       
  }
});

// Export the redirect URL for use in OAuth flows
export const REDIRECT_URL = getRedirectURL();