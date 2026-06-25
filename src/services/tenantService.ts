import { api } from './api';

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data?: T;
};

type PageResponse<T> = {
  content: T[];
  pageNo: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
};

export type ApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export type TenantResponse = {
  id: number;
  name: string;
  email: string;
  approvalStatus: ApprovalStatus;
  createdAt?: string;
  updatedAt?: string;
};

export async function getPendingTenants(params: { page?: number; size?: number } = {}) {
  const { page = 0, size = 20 } = params;
  const res = await api.get<ApiResponse<PageResponse<TenantResponse>>>('/api/admin/tenants/pending', {
    params: { page, size },
  });
  if (!res.data?.data) throw new Error(res.data?.message || 'Failed to load pending tenants');
  return res.data.data;
}

export async function getPendingCount(): Promise<number> {
  const res = await api.get<ApiResponse<number>>('/api/admin/tenants/pending/count');
  return res.data?.data ?? 0;
}

export async function getApprovedTenants(params: { page?: number; size?: number } = {}) {
  const { page = 0, size = 20 } = params;
  const res = await api.get<ApiResponse<PageResponse<TenantResponse>>>('/api/admin/tenants', {
    params: { page, size },
  });
  if (!res.data?.data) throw new Error(res.data?.message || 'Failed to load tenants');
  return res.data.data;
}

export async function approveTenant(id: number): Promise<TenantResponse> {
  const res = await api.put<ApiResponse<TenantResponse>>(`/api/admin/tenants/${id}/approve`);
  if (!res.data?.data) throw new Error(res.data?.message || 'Failed to approve tenant');
  return res.data.data;
}

export async function rejectTenant(id: number): Promise<TenantResponse> {
  const res = await api.put<ApiResponse<TenantResponse>>(`/api/admin/tenants/${id}/reject`);
  if (!res.data?.data) throw new Error(res.data?.message || 'Failed to reject tenant');
  return res.data.data;
}
