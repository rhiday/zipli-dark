// Types matching the backend API DTOs

export interface User {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  role: 'donor' | 'receiver';
  createdAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  role?: 'donor' | 'receiver';
}

export interface UpdateUserRequest {
  email?: string;
  firstName?: string;
  lastName?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface DeleteAccountRequest {
  password: string;
}

export interface ApiError {
  message: string;
  statusCode?: number;
  error?: string;
}
