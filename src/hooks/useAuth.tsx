'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/services/api.client';
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
    // Check active session via Backend API or stored tokens
    const checkSession = async () => {
      const storedToken = localStorage.getItem('shopilot_access_token');
      if (!storedToken) {
        setUser(null);
        setToken(null);
        setIsLoading(false);
        return;
      }

      try {
        const res = await apiClient.get('/auth/me');
        if (res.data.success && res.data.user) {
          const u = res.data.user;
          const userProfile: UserProfile = {
            id: u.id,
            username: u.email,
            email: u.email,
            firstName: u.name.split(' ')[0] || u.name,
            lastName: u.name.split(' ').slice(1).join(' ') || '',
            gender: 'unspecified',
            image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(u.name)}`,
          };
          setUser(userProfile);
          setToken(storedToken);
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
      const response = await apiClient.post('/auth/login', {
        email: credentials.username || (credentials as any).email,
        password: credentials.password,
      });
      return response.data;
    },
    onSuccess: (data) => {
      if (data.accessToken) {
        localStorage.setItem('shopilot_access_token', data.accessToken);
      }
      if (data.refreshToken) {
        localStorage.setItem('shopilot_refresh_token', data.refreshToken);
      }

      const u = data.user;
      const userProfile: UserProfile = {
        id: u.id,
        username: u.email,
        email: u.email,
        firstName: u.name.split(' ')[0] || u.name,
        lastName: u.name.split(' ').slice(1).join(' ') || '',
        gender: 'unspecified',
        image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(u.name)}`,
      };

      setUser(userProfile);
      setToken(data.accessToken);
      setError(null);
      queryClient.clear();
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Invalid email or password.');
    },
  });

  const login = async (credentials: LoginCredentials) => {
    setError(null);
    await loginMutation.mutateAsync(credentials);
  };

  const registerMutation = useMutation({
    mutationFn: async (credentials: RegisterCredentials) => {
      const name = `${credentials.firstName || ''} ${credentials.lastName || ''}`.trim() || credentials.username;
      const response = await apiClient.post('/auth/register', {
        email: credentials.email,
        password: credentials.password,
        name: name,
      });
      return response.data;
    },
    onSuccess: (data) => {
      if (data.accessToken) {
        localStorage.setItem('shopilot_access_token', data.accessToken);
      }
      if (data.refreshToken) {
        localStorage.setItem('shopilot_refresh_token', data.refreshToken);
      }

      const u = data.user;
      const userProfile: UserProfile = {
        id: u.id,
        username: u.email,
        email: u.email,
        firstName: u.name.split(' ')[0] || u.name,
        lastName: u.name.split(' ').slice(1).join(' ') || '',
        gender: 'unspecified',
        image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(u.name)}`,
      };

      setUser(userProfile);
      setToken(data.accessToken);
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
    localStorage.removeItem('shopilot_access_token');
    localStorage.removeItem('shopilot_refresh_token');
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
