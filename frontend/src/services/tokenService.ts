import type { AuthResponse } from '../types/api';
import { apiClient } from './apiClient';

interface TokenData {
  token: string;
  user: {
    id: string;
    email: string;
    isVerified: boolean;
    createdAt: string;
    updatedAt: string;
  };
  expiresAt: number;
  refreshToken?: string;
}

interface StoredAuthData {
  tokenData: TokenData;
  loginTime: number;
  lastActivity: number;
}

class TokenService {
  private readonly TOKEN_KEY = 'cv_maker_token';
  private readonly USER_KEY = 'cv_maker_user';
  private readonly AUTH_DATA_KEY = 'cv_maker_auth_data';
  private readonly ACTIVITY_KEY = 'cv_maker_last_activity';
  
  private readonly TOKEN_EXPIRY_BUFFER = 5 * 60 * 1000; // 5 minutes buffer
  private readonly SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
  private readonly MAX_INACTIVITY = 24 * 60 * 60 * 1000; // 24 hours

  // Save complete authentication data
  saveAuthData(authResponse: AuthResponse): void {
    const tokenData: TokenData = {
      token: authResponse.token,
      user: authResponse.user,
      expiresAt: this.getTokenExpiryTime(authResponse.token),
      refreshToken: this.extractRefreshToken(authResponse.token),
    };

    const storedData: StoredAuthData = {
      tokenData,
      loginTime: Date.now(),
      lastActivity: Date.now(),
    };

    // Save to localStorage
    localStorage.setItem(this.AUTH_DATA_KEY, JSON.stringify(storedData));
    localStorage.setItem(this.TOKEN_KEY, authResponse.token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(authResponse.user));
    localStorage.setItem(this.ACTIVITY_KEY, Date.now().toString());

    // Set token in API client
    this.setApiToken(authResponse.token);
  }

  // Get stored authentication data
  getAuthData(): StoredAuthData | null {
    try {
      const stored = localStorage.getItem(this.AUTH_DATA_KEY);
      if (!stored) return null;

      const authData: StoredAuthData = JSON.parse(stored);
      
      // Check if token is expired
      if (this.isTokenExpired(authData.tokenData.expiresAt)) {
        this.clearAuthData();
        return null;
      }

      // Check session timeout
      if (this.isSessionExpired(authData.lastActivity)) {
        this.clearAuthData();
        return null;
      }

      // Update last activity
      authData.lastActivity = Date.now();
      localStorage.setItem(this.ACTIVITY_KEY, Date.now().toString());
      localStorage.setItem(this.AUTH_DATA_KEY, JSON.stringify(authData));

      // Set token in API client
      this.setApiToken(authData.tokenData.token);

      return authData;
    } catch (error) {
      console.error('Error reading auth data:', error);
      this.clearAuthData();
      return null;
    }
  }

  // Get current token
  getToken(): string | null {
    const authData = this.getAuthData();
    return authData?.tokenData.token || null;
  }

  // Get current user
  getUser() {
    const authData = this.getAuthData();
    return authData?.tokenData.user || null;
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return this.getAuthData() !== null;
  }

  // Check if user is verified
  isUserVerified(): boolean {
    const user = this.getUser();
    return user?.isVerified || false;
  }

  // Get user display name
  getDisplayName(): string {
    const user = this.getUser();
    return user?.email || 'User';
  }

  // Update last activity
  updateActivity(): void {
    const lastActivity = localStorage.getItem(this.ACTIVITY_KEY);
    const now = Date.now();
    
    if (!lastActivity || (now - parseInt(lastActivity)) > 60000) { // Update every minute
      localStorage.setItem(this.ACTIVITY_KEY, now.toString());
      
      const authData = this.getAuthData();
      if (authData) {
        authData.lastActivity = now;
        localStorage.setItem(this.AUTH_DATA_KEY, JSON.stringify(authData));
      }
    }
  }

  // Refresh token if needed
  async refreshTokenIfNeeded(): Promise<boolean> {
    const authData = this.getAuthData();
    if (!authData || !authData.tokenData.refreshToken) {
      return false;
    }

    // Check if token needs refresh (expires in less than 5 minutes)
    const timeUntilExpiry = authData.tokenData.expiresAt - Date.now();
    if (timeUntilExpiry > this.TOKEN_EXPIRY_BUFFER) {
      return true; // Token is still valid
    }

    try {
      // This would call your refresh token endpoint
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authData.tokenData.refreshToken}`,
        },
      });

      if (response.ok) {
        const newAuthResponse: AuthResponse = await response.json();
        this.saveAuthData(newAuthResponse);
        return true;
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
    }

    // Refresh failed, clear auth data
    this.clearAuthData();
    return false;
  }

  // Clear all authentication data
  clearAuthData(): void {
    localStorage.removeItem(this.AUTH_DATA_KEY);
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem(this.ACTIVITY_KEY);
    
    // Clear API client token
    this.clearApiToken();
  }

  // Validate token format
  isValidToken(token: string): boolean {
    try {
      // Basic JWT validation (structure only)
      const parts = token.split('.');
      if (parts.length !== 3) return false;
      
      // Try to decode payload
      const payload = JSON.parse(atob(parts[1]));
      
      // Check expiration
      if (payload.exp && payload.exp < Date.now() / 1000) {
        return false;
      }
      
      return true;
    } catch (error) {
      return false;
    }
  }

  // Get token expiry time
  private getTokenExpiryTime(token: string): number {
    try {
      const parts = token.split('.');
      const payload = JSON.parse(atob(parts[1]));
      return (payload.exp || 0) * 1000; // Convert to milliseconds
    } catch (error) {
      // Default to 1 hour from now if can't parse
      return Date.now() + (60 * 60 * 1000);
    }
  }

  // Extract refresh token (if available)
  private extractRefreshToken(token: string): string | undefined {
    try {
      const parts = token.split('.');
      const payload = JSON.parse(atob(parts[1]));
      return payload.refreshToken;
    } catch (error) {
      return undefined;
    }
  }

  // Check if token is expired
  private isTokenExpired(expiresAt: number): boolean {
    return Date.now() >= expiresAt;
  }

  // Check if session is expired due to inactivity
  private isSessionExpired(lastActivity: number): boolean {
    return (Date.now() - lastActivity) > this.MAX_INACTIVITY;
  }

  // Set token in API client
  setApiToken(token: string): void {
    apiClient.setToken(token);
  }

  // Clear token from API client
  private clearApiToken(): void {
    apiClient.clearToken();
  }

  // Get authentication status
  getAuthStatus() {
    const authData = this.getAuthData();
    
    if (!authData) {
      return {
        isAuthenticated: false,
        isExpired: false,
        needsRefresh: false,
        timeUntilExpiry: 0,
        user: null,
      };
    }

    const timeUntilExpiry = authData.tokenData.expiresAt - Date.now();
    const needsRefresh = timeUntilExpiry < this.TOKEN_EXPIRY_BUFFER;

    return {
      isAuthenticated: true,
      isExpired: false,
      needsRefresh,
      timeUntilExpiry,
      user: authData.tokenData.user,
    };
  }

  // Initialize token service
  initialize(): void {
    // Check for existing auth on app start
    const authData = this.getAuthData();
    if (authData) {
      console.log('User session restored');
    } else {
      console.log('No active session found');
    }
  }

  // Get session info
  getSessionInfo() {
    const authData = this.getAuthData();
    if (!authData) return null;

    const sessionDuration = Date.now() - authData.loginTime;
    const inactivityDuration = Date.now() - authData.lastActivity;

    return {
      loginTime: authData.loginTime,
      lastActivity: authData.lastActivity,
      sessionDuration,
      inactivityDuration,
      expiresAt: authData.tokenData.expiresAt,
      timeUntilExpiry: authData.tokenData.expiresAt - Date.now(),
    };
  }
}

// Create singleton instance
export const tokenService = new TokenService();

// Initialize on import
tokenService.initialize();

// Export types
export type { TokenData, StoredAuthData };
