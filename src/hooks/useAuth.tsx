'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import authService from '@/services/auth.service';
import { LoginCredentials, UserProfile, RegisterCredentials } from '@/types';

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
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
    // Retrieve authentication status on startup (client-side only)
    const storedToken = localStorage.getItem('shopilot_token');
    const storedUser = localStorage.getItem('shopilot_user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      const { token: userToken, ...profile } = data;
      localStorage.setItem('shopilot_token', userToken);
      localStorage.setItem('shopilot_user', JSON.stringify(profile));
      setToken(userToken);
      setUser(profile);
      setError(null);
      
      // Clear Query cache to load fresh user specific items (like favorites)
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
    mutationFn: authService.register,
    onSuccess: (data) => {
      // Mock log in the registered user since dummyjson doesn't persist it
      const mockToken = 'mock_token_' + Math.random().toString(36).substring(2);
      const profile: UserProfile = {
        id: data.id || 999,
        username: data.username || 'newuser',
        email: data.email || 'newuser@example.com',
        firstName: data.firstName || 'New',
        lastName: data.lastName || 'User',
        gender: data.gender || 'unknown',
        image: data.image || 'https://dummyjson.com/icon/emilys/128',
      };
      
      localStorage.setItem('shopilot_token', mockToken);
      localStorage.setItem('shopilot_user', JSON.stringify(profile));
      setToken(mockToken);
      setUser(profile);
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

  const logout = () => {
    localStorage.removeItem('shopilot_token');
    localStorage.removeItem('shopilot_user');
    localStorage.removeItem('shopilot_favorites'); // clear favorites as well
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
        isAuthenticated: !!token,
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
