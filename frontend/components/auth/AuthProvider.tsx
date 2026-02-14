'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';
import { User } from '@/lib/types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check for existing token in localStorage
    const storedToken = localStorage.getItem('auth-token');
    if (storedToken) {
      setToken(storedToken);
      // Normally we'd fetch user data with the token here
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { user: userData, token: authToken } = await apiClient.login(email, password);
      localStorage.setItem('auth-token', authToken);
      setUser(userData);
      setToken(authToken);
      router.push('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (email: string, password: string, name?: string) => {
    try {
      const { user: userData, token: authToken } = await apiClient.register(email, password, name);
      localStorage.setItem('auth-token', authToken);
      setUser(userData);
      setToken(authToken);
      router.push('/dashboard');
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = async () => {
    if (token) {
      try {
        await apiClient.logout(token);
      } catch (error) {
        console.error('Logout error:', error);
        // Even if logout fails on the server, we should still clear local data
      }
    }
    localStorage.removeItem('auth-token');
    setUser(null);
    setToken(null);
    router.push('/auth/signin');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}