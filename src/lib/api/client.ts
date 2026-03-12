import type {
  User,
  LoginRequest,
  LoginResponse,
  CreateUserRequest,
  UpdateUserRequest,
  ChangePasswordRequest,
  DeleteAccountRequest,
  ApiError,
} from './types';

// Prefer explicit env var. In production, fall back to the deployed backend URL,
// and in dev fall back to the local NestJS server on port 8002.
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === 'production'
    ? 'https://accountsettings-production.up.railway.app'
    : 'http://localhost:8002');

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
    // Load token from localStorage on initialization
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
    }
  }

  setToken(token: string | null) {
    this.token = token;
    if (token && typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    } else if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }

  getToken(): string | null {
    return this.token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    // Ensure token is loaded from localStorage (in case it was set elsewhere)
    if (!this.token && typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
    }

    const url = `${this.baseUrl}${endpoint}`;
    
    // Normalize headers to Record<string, string>
    const normalizedHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Handle different HeadersInit types
    if (options.headers) {
      if (options.headers instanceof Headers) {
        options.headers.forEach((value, key) => {
          normalizedHeaders[key] = value;
        });
      } else if (Array.isArray(options.headers)) {
        options.headers.forEach(([key, value]) => {
          normalizedHeaders[key] = value;
        });
      } else {
        Object.assign(normalizedHeaders, options.headers);
      }
    }

    if (this.token) {
      normalizedHeaders['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      console.log('[API Client] Making request:', {
        url,
        method: options.method || 'GET',
        hasToken: !!this.token,
      });

      const response = await fetch(url, {
        method: options.method,
        body: options.body,
        cache: options.cache,
        credentials: options.credentials,
        mode: options.mode,
        redirect: options.redirect,
        signal: options.signal,
        headers: normalizedHeaders,
      });

      console.log('[API Client] Response:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
      });

      // Handle 204 No Content responses
      if (response.status === 204) {
        return undefined as T;
      }

      // Check if response has content before trying to parse JSON
      const contentType = response.headers.get('content-type');
      let data: unknown;
      
      if (contentType && contentType.includes('application/json')) {
        try {
          data = await response.json();
        } catch {
          // If JSON parsing fails, create error from response text
          const text = await response.text();
          throw {
            message: text || 'Invalid JSON response',
            statusCode: response.status,
            error: 'ParseError',
          } as ApiError;
        }
      } else {
        // Non-JSON response
        const text = await response.text();
        data = { message: text || 'An error occurred' };
      }

      if (!response.ok) {
        const errorData = data as { message?: string; error?: string };
        const error: ApiError = {
          message: errorData.message || errorData.error || 'An error occurred',
          statusCode: response.status,
          error: errorData.error,
        };
        throw error;
      }

      return data as T;
    } catch (error) {
      // If it's already an ApiError, re-throw it
      if (error && typeof error === 'object' && 'statusCode' in error) {
        throw error;
      }
      
      // Handle network errors
      if (error instanceof TypeError && error.message.includes('fetch')) {
        console.error('[API Client] Network error:', error);
        throw {
          message: `Network error: Could not connect to server at ${url}. Is the backend running on ${this.baseUrl}?`,
          statusCode: 0,
          error: 'NetworkError',
        } as ApiError;
      }
      
      // Generic error
      throw {
        message: error instanceof Error ? error.message : 'An unexpected error occurred',
        statusCode: 0,
        error: 'UnknownError',
      } as ApiError;
    }
  }

  // Auth endpoints
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await this.request<LoginResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    this.setToken(response.access_token);
    return response;
  }

  async register(userData: CreateUserRequest): Promise<User> {
    return this.request<User>('/api/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // User endpoints
  async getCurrentUser(): Promise<User> {
    return this.request<User>('/api/users/me', {
      method: 'GET',
    });
  }

  async updateProfile(updates: UpdateUserRequest): Promise<User> {
    return this.request<User>('/api/users/me', {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  async changePassword(passwordData: ChangePasswordRequest): Promise<void> {
    return this.request<void>('/api/users/me/password', {
      method: 'PATCH',
      body: JSON.stringify(passwordData),
    });
  }

  async deleteAccount(passwordData: DeleteAccountRequest): Promise<void> {
    return this.request<void>('/api/users/me', {
      method: 'DELETE',
      body: JSON.stringify(passwordData),
    });
  }

  logout() {
    this.setToken(null);
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
