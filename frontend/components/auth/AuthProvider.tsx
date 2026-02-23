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

  // 🔹 Restore user on refresh
 useEffect(() => {
  const storedToken = localStorage.getItem('auth-token');

  if (storedToken) {
    setToken(storedToken);

    apiClient
      .getCurrentUser(storedToken)
      .then((data) => {
        setUser(data);
      })
      .catch(() => {
        localStorage.removeItem('auth-token');
        setUser(null);
        setToken(null);
      })
      .finally(() => {
        setLoading(false);
      });
  } else {
    setLoading(false);
  }
}, []);

  // 🔹 Login
  const login = async (email: string, password: string) => {
    try {
      const response = await apiClient.login(email, password);
      const authToken = response.access_token;

      localStorage.setItem('auth-token', authToken);
      setToken(authToken);

      // fetch current user
      const userRes = await fetch('/api/v1/auth/me', {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!userRes.ok) throw new Error('Failed to fetch user');

      const userData = await userRes.json();
      setUser(userData);

      router.push('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  // 🔹 Register (then auto login)
  const register = async (email: string, password: string, name?: string) => {
    try {
      await apiClient.register(email, password, name);
      await login(email, password);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  // 🔹 Logout
  const logout = async () => {
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