import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const TOKEN_KEY = 'hostelfix:jwt';

export const storageKeys = {
  jwt: TOKEN_KEY,
  role: 'hostelfix:user:role',
  userId: 'hostelfix:user:id',
  userName: 'hostelfix:user:name',
  userEmail: 'hostelfix:user:email',
};

function getJwtToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

function setAuthorizationHeader(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
  const token = getJwtToken();
  if (!token) return config;

  config.headers = {
    ...(config.headers as Record<string, unknown> | undefined),
    Authorization: `Bearer ${token}`,
  } as any;

  return config;
}

export const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use((config) => setAuthorizationHeader(config));

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(storageKeys.jwt);
      localStorage.removeItem(storageKeys.role);
      localStorage.removeItem(storageKeys.userId);
      localStorage.removeItem(storageKeys.userName);
      localStorage.removeItem(storageKeys.userEmail);
      window.dispatchEvent(new Event('hostelfix:unauthorized'));
    }

    return Promise.reject(error);
  }
);
