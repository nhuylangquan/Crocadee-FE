import axios from 'axios';
import { apiClient } from '../../../lib/axios';

const TOKEN_STORAGE_KEY = 'token';
const USER_STORAGE_KEY = 'authUser';

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  accessToken: string;
  tokenType: 'Bearer';
  user: AuthUser;
}

interface LoginPayload {
  username: string;
  password: string;
}

interface RegisterPayload {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface ApiErrorBody {
  message?: string | string[];
}

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  return apiClient.post<AuthResponse, AuthResponse>('/auth/login', payload);
}

export async function register(
  payload: RegisterPayload
): Promise<AuthResponse> {
  return apiClient.post<AuthResponse, AuthResponse>('/auth/register', payload);
}

export function saveAuthSession(
  authResponse: AuthResponse,
  rememberSession = true
) {
  const storage = rememberSession ? localStorage : sessionStorage;
  const staleStorage = rememberSession ? sessionStorage : localStorage;

  staleStorage.removeItem(TOKEN_STORAGE_KEY);
  staleStorage.removeItem(USER_STORAGE_KEY);
  storage.setItem(TOKEN_STORAGE_KEY, authResponse.accessToken);
  storage.setItem(USER_STORAGE_KEY, JSON.stringify(authResponse.user));
}

export function getAuthErrorMessage(
  error: unknown,
  fallbackMessage: string
): string {
  if (!axios.isAxiosError<unknown>(error)) {
    return fallbackMessage;
  }

  const data: unknown = error.response?.data;

  if (isApiErrorBody(data) && data.message) {
    return Array.isArray(data.message) ? data.message.join(' ') : data.message;
  }

  return error.message || fallbackMessage;
}

function isApiErrorBody(data: unknown): data is ApiErrorBody {
  return typeof data === 'object' && data !== null && 'message' in data;
}

export async function forgotPassword(email: string): Promise<void> {
  return apiClient.post('/auth/forgot-password', { email });
}

export async function resetPassword(payload: {
  token: string;
  newPassword: string;
}): Promise<void> {
  return apiClient.post('/auth/reset-password', payload);
}
