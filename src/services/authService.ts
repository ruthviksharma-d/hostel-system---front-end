import { api, storageKeys } from './api';

export type UserRole = 'TENANT' | 'MAINTENANCE';

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data?: T;
  timestamp?: string;
};

type AuthResponse = {
  token: string;
  tokenType: 'Bearer';
  user: {
    id: number;
    name: string;
    email: string;
    role: UserRole;
    createdAt?: string;
  };
};

type LoginRequest = {
  email: string;
  password: string;
};

type RegisterRequest = {
  name: string;
  email: string;
  password: string;
  role: UserRole;
};

export function persistAuth(auth: AuthResponse) {
  localStorage.setItem(storageKeys.jwt, auth.token);
  localStorage.setItem(storageKeys.role, auth.user.role);
  localStorage.setItem(storageKeys.userId, String(auth.user.id));
  localStorage.setItem(storageKeys.userName, auth.user.name);
  localStorage.setItem(storageKeys.userEmail, auth.user.email);
}

export async function login(payload: LoginRequest) {
  const res = await api.post<ApiResponse<AuthResponse>>('/api/auth/login', payload);

  if (!res.data?.data?.token || !res.data?.data?.user) {
    throw new Error(res.data?.message || 'Login failed');
  }

  persistAuth(res.data.data);
  return res.data.data;
}

export async function register(payload: RegisterRequest) {
  const res = await api.post<ApiResponse<AuthResponse>>('/api/auth/register', payload);

  if (!res.data?.data?.token || !res.data?.data?.user) {
    throw new Error(res.data?.message || 'Registration failed');
  }

  persistAuth(res.data.data);
  return res.data.data;
}

export async function getCurrentUser() {
  const res = await api.get<ApiResponse<AuthResponse['user']>>('/api/auth/me');

  if (!res.data?.data) {
    throw new Error(res.data?.message || 'Failed to load current user');
  }

  localStorage.setItem(storageKeys.role, res.data.data.role);
  localStorage.setItem(storageKeys.userId, String(res.data.data.id));
  localStorage.setItem(storageKeys.userName, res.data.data.name);
  localStorage.setItem(storageKeys.userEmail, res.data.data.email);

  return res.data.data;
}
