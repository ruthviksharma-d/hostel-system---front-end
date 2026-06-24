import { storageKeys } from '../services/api';

export function isAuthenticated(): boolean {
  const token = localStorage.getItem(storageKeys.jwt);
  return Boolean(token);
}

export function getUserRole(): 'TENANT' | 'MAINTENANCE' | null {
  const role = localStorage.getItem(storageKeys.role);
  if (role === 'TENANT') return 'TENANT';
  if (role === 'MAINTENANCE') return 'MAINTENANCE';
  return null;
}

export function getUserName(): string {
  return localStorage.getItem(storageKeys.userName) || '';
}

export function getUserEmail(): string {
  return localStorage.getItem(storageKeys.userEmail) || '';
}

export function logout() {
  localStorage.removeItem(storageKeys.jwt);
  localStorage.removeItem(storageKeys.role);
  localStorage.removeItem(storageKeys.userId);
  localStorage.removeItem(storageKeys.userName);
  localStorage.removeItem(storageKeys.userEmail);
}

