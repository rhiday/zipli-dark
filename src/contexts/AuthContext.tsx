"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api/client';
import type { User, LoginRequest, CreateUserRequest, ApiError } from '@/lib/api/types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: CreateUserRequest) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const token = apiClient.getToken();
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const userData = await apiClient.getCurrentUser();
      setUser(userData);
    } catch (error) {
      // Token might be invalid, clear it
      console.error('Failed to refresh user:', error);
      apiClient.logout();
      setUser(null);
      // Don't show error toast here - it's expected if token is invalid
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async (credentials: LoginRequest) => {
    try {
      await apiClient.login(credentials);
      // Small delay to ensure token is set before refreshing user
      await new Promise(resolve => setTimeout(resolve, 100));
      await refreshUser();
      toast.success('Logged in successfully');
    } catch (error) {
      const apiError = error as ApiError;
      toast.error(apiError.message || 'Invalid credentials');
      throw error;
    }
  };

  const register = async (userData: CreateUserRequest) => {
    try {
      await apiClient.register(userData);
      // Auto-login after registration
      await login({ email: userData.email, password: userData.password });
      toast.success('Account created successfully');
    } catch (error) {
      const apiError = error as ApiError;
      toast.error(apiError.message || 'Failed to create account');
      throw error;
    }
  };

  const logout = () => {
    apiClient.logout();
    setUser(null);
    toast.success('You have been logged out');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
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
