import type { ApiResponse, ApiError } from '../types/api';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const finalConfig = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };
    
    try {
      const response = await fetch(url, finalConfig);
      
      // Handle non-JSON responses (e.g., network errors)
      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        // If response is not JSON, create error response
        if (!response.ok) {
          return {
            success: false,
            error: `HTTP error! status: ${response.status}`,
          };
        }
        return {
          success: true,
          data: null,
          message: 'Success',
        };
      }
      
      if (!response.ok) {
        // Handle 401 Unauthorized errors
        if (response.status === 401) {
          this.clearToken();
          // Note: tokenService.clearAuthData() will be called by useAuth hook
          // when it detects the 401 error, to avoid circular dependency
        }
        
        return {
          success: false,
          error: data.message || `HTTP error! status: ${response.status}`,
        };
      }

      return {
        success: true,
        data: data.data || data,
        message: data.message,
      };
    } catch (error) {
      // Network errors or other exceptions
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint);
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }

  async upload<T>(endpoint: string, file: File, onProgress?: (progress: number) => void): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append('file', file);
    
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable && onProgress) {
          const progress = (event.loaded / event.total) * 100;
          onProgress(progress);
        }
      });

      xhr.addEventListener('load', () => {
        try {
          const response = JSON.parse(xhr.responseText);
          resolve({
            success: xhr.status >= 200 && xhr.status < 300,
            data: response.data || response,
            message: response.message,
          });
        } catch (error) {
          reject(new Error('Failed to parse response'));
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error('Upload failed'));
      });

      xhr.open('POST', `${this.baseURL}${endpoint}`);
      
      if (this.token) {
        xhr.setRequestHeader('Authorization', `Bearer ${this.token}`);
      }

      xhr.send(formData);
    });
  }

  setToken(token: string) {
    this.token = token;
  }

  clearToken() {
    this.token = null;
  }

  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.get('/health');
      return response.success;
    } catch (error) {
      return false;
    }
  }
}

// Create singleton instance
export const apiClient = new ApiClient(API_BASE_URL);

// Export types
export type { ApiClient };
