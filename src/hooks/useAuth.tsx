'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { LoginCredentials, UserProfile, RegisterCredentials } from '@/types';

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
  isLoggingIn: boolean;
  isRegistering: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    // Check active session via HttpOnly cookie API endpoint
    const checkSession = async () => {
      try {
        const res = await axios.get('/api/auth/me');
        if (res.data.authenticated) {
          setUser(res.data.user);
          setToken('active_session_cookie');
        } else {
          setUser(null);
          setToken(null);
        }
      } catch (err) {
        setUser(null);
        setToken(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const response = await axios.post('/api/auth/login', credentials);
      return response.data;
    },
    onSuccess: (data) => {
      setUser(data.user);
      setToken(data.token || 'active_session_cookie');
      setError(null);
      queryClient.clear();
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Invalid username or password.');
    },
  });

  const login = async (credentials: LoginCredentials) => {
    setError(null);
    await loginMutation.mutateAsync(credentials);
  };

  const registerMutation = useMutation({
    mutationFn: async (credentials: RegisterCredentials) => {
      const response = await axios.post('/api/auth/login', {
        username: credentials.username,
        password: credentials.password,
      });
      return response.data;
    },
    onSuccess: (data) => {
      setUser(data.user);
      setToken(data.token || 'active_session_cookie');
      setError(null);
      queryClient.clear();
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    },
  });

  const register = async (credentials: RegisterCredentials) => {
    setError(null);
    await registerMutation.mutateAsync(credentials);
  };

  const logout = async () => {
    try {
      await axios.post('/api/auth/logout');
    } catch (e) {
      console.error('Logout error:', e);
    }
    setToken(null);
    setUser(null);
    queryClient.clear();
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        error,
        isLoggingIn: loginMutation.isPending,
        isRegistering: registerMutation.isPending,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
export default AuthProvider;
