'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabaseBrowserClient, isSupabaseConfigured } from '@/lib/supabase/client';

interface AdminAuthContextType {
  isAuthenticated: boolean;
  user: { email: string; name: string; role: string } | null;
  loading: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType>({
  isAuthenticated: false,
  user: null,
  loading: true,
  login: async () => ({ success: false }),
  logout: async () => {},
});

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<{ email: string; name: string; role: string } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      if (!isSupabaseConfigured()) {
        setIsAuthenticated(false);
        setUser(null);
        setLoading(false);
        return;
      }

      const client = getSupabaseBrowserClient();
      if (!client) {
        setIsAuthenticated(false);
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        // Authenticate with genuine Supabase Auth session
        const { data: { session }, error: sessionError } = await client.auth.getSession();
        if (sessionError || !session) {
          setIsAuthenticated(false);
          setUser(null);
          setLoading(false);
          return;
        }

        // Cryptographically verify user validity with Supabase Auth server
        const { data: { user: authUser }, error: userError } = await client.auth.getUser();
        if (userError || !authUser) {
          setIsAuthenticated(false);
          setUser(null);
          setLoading(false);
          return;
        }

        // Verify admin role authorization
        const metadataRole = authUser.app_metadata?.role || authUser.user_metadata?.role;
        let role = metadataRole;

        if (!role) {
          // Check profiles table
          try {
            const { data: profile } = await client
              .from('profiles')
              .select('role')
              .eq('id', authUser.id)
              .single();
            if (profile) {
              role = profile.role;
            }
          } catch {
            // Profile query failed
          }
        }

        if (role === 'admin') {
          setIsAuthenticated(true);
          setUser({
            email: authUser.email || '',
            name: authUser.user_metadata?.display_name || authUser.email?.split('@')[0] || 'Admin',
            role: 'admin',
          });
        } else {
          // Reject non-admin authenticated users
          await client.auth.signOut();
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (err) {
        console.error('Session validation error:', err);
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, []);

  const login = async (email: string, password?: string) => {
    if (!isSupabaseConfigured()) {
      return {
        success: false,
        error: 'Supabase authentication is not configured in .env.local.'
      };
    }

    const client = getSupabaseBrowserClient();
    if (!client || !password) {
      return {
        success: false,
        error: 'Please enter both your email address and password.'
      };
    }

    try {
      const { data, error } = await client.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error || !data.session) {
        return {
          success: false,
          error: error?.message || 'Authentication failed: Invalid login credentials.'
        };
      }

      // Check admin role
      const metadataRole = data.user.app_metadata?.role || data.user.user_metadata?.role;
      let role = metadataRole;

      if (!role) {
        try {
          const { data: profile } = await client
            .from('profiles')
            .select('role')
            .eq('id', data.user.id)
            .single();
          if (profile) {
            role = profile.role;
          }
        } catch {
          // Profile query failed
        }
      }

      if (role !== 'admin') {
        await client.auth.signOut();
        return {
          success: false,
          error: 'Access denied: Administrator privileges required.'
        };
      }

      setIsAuthenticated(true);
      setUser({
        email: data.user.email || email,
        name: data.user.user_metadata?.display_name || data.user.email?.split('@')[0] || 'Admin',
        role: 'admin',
      });

      return { success: true };
    } catch (err: any) {
      return {
        success: false,
        error: err?.message || 'Unexpected error during authentication.'
      };
    }
  };

  const logout = async () => {
    const client = getSupabaseBrowserClient();
    if (client) {
      try {
        await client.auth.signOut();
      } catch (err) {
        console.error('Sign-out error:', err);
      }
    }
    setIsAuthenticated(false);
    setUser(null);
    router.push('/login');
  };

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated, user, loading, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  return useContext(AdminAuthContext);
}
