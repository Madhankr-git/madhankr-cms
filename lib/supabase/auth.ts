import { getSupabaseServerClient } from './server';
import { isSupabaseConfigured } from './client';

export interface VerifiedAdminUser {
  id: string;
  email: string;
  role: 'admin';
}

/**
 * Server-side authentication and authorization verification.
 * Cryptographically validates the caller's Supabase JWT session via supabase.auth.getUser()
 * and verifies that the authenticated user possesses the 'admin' role.
 */
export async function verifyServerAdmin(): Promise<{ user: VerifiedAdminUser | null; error?: string }> {
  if (!isSupabaseConfigured()) {
    return { user: null, error: 'Supabase is not configured on the server' };
  }

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return { user: null, error: 'Unable to initialize Supabase server client' };
  }

  try {
    // Cryptographically verify session token with Supabase Auth
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        user: null,
        error: authError?.message || 'Authentication required: No valid Supabase session found'
      };
    }

    // 1. Check user metadata / app_metadata for admin role
    const metadataRole = user.app_metadata?.role || user.user_metadata?.role;
    if (metadataRole === 'admin') {
      return {
        user: { id: user.id, email: user.email || '', role: 'admin' }
      };
    }

    // 2. Query profiles table for admin role assignment
    try {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (!profileError && profile?.role === 'admin') {
        return {
          user: { id: user.id, email: user.email || '', role: 'admin' }
        };
      }
    } catch {
      // Profile query failed or table not yet seeded
    }

    // If role cannot be confirmed as admin, reject
    return {
      user: null,
      error: 'Forbidden: User account does not have required administrator privileges'
    };
  } catch (err: any) {
    return {
      user: null,
      error: err?.message || 'Internal session verification error'
    };
  }
}
