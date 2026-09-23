import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://jueocxhfynultunhwixf.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_cUckID26XpfFev-XOBUB6A_LpfJULM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Triggers Google OAuth login via Supabase
 */
export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}`,
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
