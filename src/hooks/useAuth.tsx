'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import authService from '@/services/auth.service';
import { LoginCredentials, UserProfile } from '@/types';

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  error: string | null;
  isLoggingIn: boolean;
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
        logout,
        error,
        isLoggingIn: loginMutation.isPending,
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
