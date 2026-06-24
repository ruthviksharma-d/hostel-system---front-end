import { api } from './api';

export type RequestCategory = 'ELECTRICAL' | 'PLUMBING' | 'INTERNET' | 'FURNITURE' | 'OTHER';
export type RequestStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';

export const REQUEST_CATEGORIES: RequestCategory[] = ['ELECTRICAL', 'PLUMBING', 'INTERNET', 'FURNITURE', 'OTHER'];
export const REQUEST_STATUSES: RequestStatus[] = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];

export type CreateRequestDTO = {
  title: string;
  description: string;
  category: RequestCategory;
};

export type RequestResponse = {
  id: number;
  title: string;
  description: string;
  category: RequestCategory;
  status: RequestStatus;
  createdById: number;
  createdByName: string;
  createdByEmail: string;
  resolutionNote?: string | null;
  resolvedAt?: string | null;
  closedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type PageResponse<T> = {
  content: T[];
  pageNo: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
};

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data?: T;
  timestamp?: string;
};

export async function getMyRequests(params?: {
  status?: RequestStatus;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
  category?: RequestCategory;
}) {
  const res = await api.get<ApiResponse<PageResponse<RequestResponse>>>('/api/requests/my', { params });
  if (!res.data?.data) throw new Error(res.data?.message || 'Failed to fetch requests');
  return res.data.data;
}

export async function getAllRequests(params?: {
  status?: RequestStatus;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
  category?: RequestCategory;
}) {
  const res = await api.get<ApiResponse<PageResponse<RequestResponse>>>('/api/requests', { params });
  if (!res.data?.data) throw new Error(res.data?.message || 'Failed to fetch all requests');
  return res.data.data;
}

export async function getRequestById(id: number) {
  const res = await api.get<ApiResponse<RequestResponse>>(`/api/requests/${id}`);
  if (!res.data?.data) throw new Error(res.data?.message || 'Failed to fetch request details');
  return res.data.data;
}

export async function updateStatus(id: number, payload: { status: RequestStatus; resolutionNote?: string }) {
  const res = await api.put<ApiResponse<RequestResponse>>(`/api/requests/${id}/status`, payload);
  if (!res.data?.data) throw new Error(res.data?.message || 'Failed to update request status');
  return res.data.data;
}

export async function closeRequest(id: number) {
  const res = await api.put<ApiResponse<RequestResponse>>(`/api/requests/${id}/close`);
  if (!res.data?.data) throw new Error(res.data?.message || 'Failed to close request');
  return res.data.data;
}

export async function createRequest(payload: CreateRequestDTO) {
  const res = await api.post<ApiResponse<RequestResponse>>('/api/requests', payload);
  if (!res.data?.data) throw new Error(res.data?.message || 'Failed to create request');
  return res.data.data;
}

