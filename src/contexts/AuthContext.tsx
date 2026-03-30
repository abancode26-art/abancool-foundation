import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  role: 'super_admin' | 'admin' | 'support' | 'customer';
  status: string;
  company_name: string;
  country: string;
}

interface AuthState {
  user: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, phone?: string) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, email: string, password: string) => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
    isAdmin: false,
  });

  const fetchProfile = useCallback(async (userId: string): Promise<UserProfile | null> => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (error || !data) return null;
    return data as UserProfile;
  }, []);

  const setUser = useCallback((user: UserProfile | null) => {
    setState({
      user,
      isLoading: false,
      isAuthenticated: !!user,
      isAdmin: user?.role === 'super_admin' || user?.role === 'admin',
    });
  }, []);

  const checkAuth = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const profile = await fetchProfile(session.user.id);
        setUser(profile);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    }
  }, [fetchProfile, setUser]);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        // Use setTimeout to avoid potential deadlocks with Supabase client
        setTimeout(async () => {
          const profile = await fetchProfile(session.user.id);
          setUser(profile);
        }, 0);
      } else {
        setUser(null);
      }
    });

    // Then check initial session
    checkAuth();

    return () => subscription.unsubscribe();
  }, [checkAuth, fetchProfile, setUser]);

  const login = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);
  }, []);

  const register = useCallback(async (name: string, email: string, password: string, phone?: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name, phone: phone || '' },
      },
    });
    if (error) throw new Error(error.message);
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
  }, [setUser]);

  const forgotPassword = useCallback(async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) throw new Error(error.message);
  }, []);

  const resetPassword = useCallback(async (_token: string, _email: string, password: string) => {
    const { error } = await supabase.auth.updateUser({ password });
    if (error) throw new Error(error.message);
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, forgotPassword, resetPassword, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
