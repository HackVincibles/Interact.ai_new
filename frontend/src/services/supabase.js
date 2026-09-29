import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('[SUPABASE] URL:', supabaseUrl);
console.log('[SUPABASE] key exists:', Boolean(supabaseAnonKey));
console.log(
  '[SUPABASE] key prefix:',
  supabaseAnonKey ? supabaseAnonKey.slice(0, 12) : 'MISSING'
);
console.log(
  '[SUPABASE] key length:',
  supabaseAnonKey?.length
);

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

/**
 * Triggers Google OAuth login via Supabase
 */
export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/`,
    },
  });
  if (error) {
    console.error('Google OAuth Error:', error.message);
    throw error;
  }
  return data;
}

/**
 * Triggers GitHub OAuth login via Supabase
 */
export async function signInWithGitHub() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: `${window.location.origin}`,
    },
  });
  if (error) {
    console.error('GitHub OAuth Error:', error.message);
    throw error;
  }
  return data;
}
