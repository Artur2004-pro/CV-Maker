import { useState, useEffect, useCallback, createContext, useContext, type ReactNode } from 'react';
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { apiClient } from '../services/apiClient';
import { tokenService } from '../services/tokenService';
import type { AuthResponse, LoginRequest, SignupRequest, VerifyEmailRequest } from '../types/api';

interface User {
  id: string;
  email: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isVerified: boolean;
  error: string | null;
  lastActivity: number;
}

interface AuthContextType extends AuthState {
  login: (credentials: LoginRequest) => Promise<void>;
  register: (credentials: SignupRequest) => Promise<void>;
  verifyEmail: (data: VerifyEmailRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
  clearError: () => void;
  updateActivity: () => void;
  displayName: string;
  sessionInfo: any;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: true,
    isAuthenticated: false,
    isVerified: false,
    error: null,
    lastActivity: Date.now(),
  });

  const navigate = useNavigate();
  const location = useLocation();

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const authData = tokenService.getAuthData();
        
        if (authData) {
          const user = authData.tokenData.user;
          const token = authData.tokenData.token;
          
          // Set token in API client
          apiClient.setToken(token);
          
          setAuthState({
            user,
            token,
            isLoading: false,
            isAuthenticated: true,
            isVerified: user?.isVerified || false,
            error: null,
            lastActivity: authData.lastActivity,
          });
        } else {
          // Clear token from API client if no auth data
          apiClient.clearToken();
          
          setAuthState({
            user: null,
            token: null,
            isLoading: false,
            isAuthenticated: false,
            isVerified: false,
            error: null,
            lastActivity: Date.now(),
          });
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        apiClient.clearToken();
        
        setAuthState({
          user: null,
          token: null,
          isLoading: false,
          isAuthenticated: false,
          isVerified: false,
          error: 'Failed to initialize authentication',
          lastActivity: Date.now(),
        });
      }
    };

    initializeAuth();
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      if (authState.token) {
        try {
          await apiClient.post('/auth/logout');
        } catch (error) {
          console.log('Logout API call failed, continuing with local logout');
        }
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      tokenService.clearAuthData();
      
      // Token is already cleared in apiClient by tokenService.clearAuthData()
      
      setAuthState({
        user: null,
        token: null,
        isLoading: false,
        isAuthenticated: false,
        isVerified: false,
        error: null,
        lastActivity: Date.now(),
      });
      
      navigate('/login', { replace: true });
    }
  }, [authState.token, navigate]);

  const login = useCallback(async (credentials: LoginRequest): Promise<void> => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
      
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Login failed');
      }
      
      tokenService.saveAuthData(response.data);
      
      setAuthState({
        user: response.data.user,
        token: response.data.token,
        isLoading: false,
        isAuthenticated: true,
        isVerified: response.data.user?.isVerified || false,
        error: null,
        lastActivity: Date.now(),
      });
      
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
      
    } catch (error: any) {
      const errorMessage = error.message || 'Login failed. Please try again.';
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        isAuthenticated: false,
        isVerified: false,
        user: null,
        token: null,
        error: errorMessage,
        lastActivity: Date.now(),
      }));
      throw error;
    }
  }, [navigate, location.state]);

  const register = useCallback(async (credentials: SignupRequest): Promise<void> => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await apiClient.post('/auth/signup', credentials);
      
      if (!response.success) {
        throw new Error(response.error || 'Registration failed');
      }
      
      // Registration successful, but user needs to verify email
      setAuthState(prev => ({ ...prev, isLoading: false }));
      
    } catch (error: any) {
      const errorMessage = error.message || 'Registration failed. Please try again.';
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        isAuthenticated: false,
        isVerified: false,
        user: null,
        token: null,
        error: errorMessage,
        lastActivity: Date.now(),
      }));
      throw error;
    }
  }, []);

  const verifyEmail = useCallback(async (data: VerifyEmailRequest): Promise<void> => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await apiClient.post<AuthResponse>('/auth/verify-email', data);
      
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Email verification failed');
      }
      
      tokenService.saveAuthData(response.data);
      
      // Token is already set in apiClient by tokenService.saveAuthData()
      
      setAuthState({
        user: response.data.user,
        token: response.data.token,
        isLoading: false,
        isAuthenticated: true,
        isVerified: response.data.user?.isVerified || false,
        error: null,
        lastActivity: Date.now(),
      });
      
      navigate('/dashboard', { replace: true });
      
    } catch (error: any) {
      const errorMessage = error.message || 'Email verification failed. Please try again.';
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        isAuthenticated: false,
        isVerified: false,
        user: null,
        token: null,
        error: errorMessage,
        lastActivity: Date.now(),
      }));
      throw error;
    }
  }, [navigate]);

  const refreshToken = useCallback(async (): Promise<boolean> => {
    return await tokenService.refreshTokenIfNeeded();
  }, []);

  const clearError = useCallback(() => {
    setAuthState(prev => ({ ...prev, error: null }));
  }, []);

  const updateActivity = useCallback(() => {
    tokenService.updateActivity();
    setAuthState(prev => ({ ...prev, lastActivity: Date.now() }));
  }, []);

  const displayName = authState.user?.email || 'User';
  const sessionInfo = tokenService.getSessionInfo();

  const contextValue: AuthContextType = {
    ...authState,
    login,
    register,
    verifyEmail,
    logout: handleLogout,
    refreshToken,
    clearError,
    updateActivity,
    displayName,
    sessionInfo,
  };

  return React.createElement(
    AuthContext.Provider,
    { value: contextValue },
    children
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const useAuthStatus = () => {
  const { isAuthenticated, isVerified, isLoading, error } = useAuth();
  
  return {
    isAuthenticated,
    isVerified,
    isLoading,
    error,
    isReady: !isLoading && !error,
    needsVerification: isAuthenticated && !isVerified,
  };
};

export const useRequireAuth = () => {
  const { isAuthenticated, isLoading, isVerified } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);
  
  return { isAuthenticated, isVerified, isLoading };
};
