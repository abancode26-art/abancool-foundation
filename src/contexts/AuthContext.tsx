// ============================================================
// ABANCOOL BILLING - Authentication Context
//
// Kiro: Replace the placeholder auth logic with real Laravel
// Sanctum or session-based authentication.
// 
// Flow:
// 1. On app load, call GET /auth/me to check session
// 2. On login, POST /auth/login then refresh user
// 3. On logout, POST /auth/logout then clear state
// 4. Role-based access: user.role === 'admin' | 'client'
// ============================================================

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { User } from '@/types';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, email: string, password: string) => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Kiro: Remove these placeholder users and connect to real auth
const DEMO_USERS: Record<string, User> = {
  'client@abancool.com': {
    id: '1',
    email: 'client@abancool.com',
    name: 'John Mwangi',
    role: 'client',
    email_verified_at: '2024-01-15T00:00:00Z',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
  },
  'admin@abancool.com': {
    id: '2',
    email: 'admin@abancool.com',
    name: 'Sarah Oduya',
    role: 'admin',
    email_verified_at: '2024-01-01T00:00:00Z',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
    isAdmin: false,
  });

  const setUser = useCallback((user: User | null) => {
    setState({
      user,
      isLoading: false,
      isAuthenticated: !!user,
      isAdmin: user?.role === 'admin',
    });
  }, []);

  const checkAuth = useCallback(async () => {
    // Kiro: Replace with GET /auth/me
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      const saved = localStorage.getItem('abancool_user');
      if (saved) {
        setUser(JSON.parse(saved));
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    }
  }, [setUser]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = useCallback(async (email: string, _password: string) => {
    // Kiro: Replace with POST /auth/login
    setState(prev => ({ ...prev, isLoading: true }));
    await new Promise(r => setTimeout(r, 800)); // Simulate network
    const user = DEMO_USERS[email];
    if (!user) {
      setState(prev => ({ ...prev, isLoading: false }));
      throw new Error('Invalid credentials. Try client@abancool.com or admin@abancool.com');
    }
    localStorage.setItem('abancool_user', JSON.stringify(user));
    setUser(user);
  }, [setUser]);

  const register = useCallback(async (name: string, email: string, _password: string) => {
    // Kiro: Replace with POST /auth/register
    await new Promise(r => setTimeout(r, 800));
    const user: User = {
      id: Date.now().toString(),
      email,
      name,
      role: 'client',
      email_verified_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    localStorage.setItem('abancool_user', JSON.stringify(user));
    setUser(user);
  }, [setUser]);

  const logout = useCallback(async () => {
    // Kiro: Replace with POST /auth/logout
    localStorage.removeItem('abancool_user');
    setUser(null);
  }, [setUser]);

  const forgotPassword = useCallback(async (_email: string) => {
    // Kiro: Replace with POST /auth/forgot-password
    await new Promise(r => setTimeout(r, 800));
  }, []);

  const resetPassword = useCallback(async (_token: string, _email: string, _password: string) => {
    // Kiro: Replace with POST /auth/reset-password
    await new Promise(r => setTimeout(r, 800));
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
