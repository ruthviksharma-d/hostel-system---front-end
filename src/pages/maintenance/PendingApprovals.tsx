import React, { useEffect, useState, useCallback } from 'react';
import { UserCheck, UserX, Users, RefreshCw } from 'lucide-react';
import { toast } from 'react-toastify';
import Layout from '../../components/Layout';
import {
  getPendingTenants,
  approveTenant,
  rejectTenant,
  type TenantResponse,
} from '../../services/tenantService';

function formatDate(iso?: string) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function PendingApprovals() {
  const [tenants, setTenants] = useState<TenantResponse[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<number | null>(null);

  const PAGE_SIZE = 20;

  const load = useCallback(async (p = 0) => {
    setLoading(true);
    try {
      const data = await getPendingTenants({ page: p, size: PAGE_SIZE });
      setTenants(data.content);
      setTotalElements(data.totalElements);
      setPage(p);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.message || 'Failed to load pending tenants');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(0); }, [load]);

  const handleApprove = async (id: number) => {
    setActionId(id);
    try {
      await approveTenant(id);
      toast.success('Tenant approved — they can now log in.');
      setTenants(prev => prev.filter(t => t.id !== id));
      setTotalElements(prev => prev - 1);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.message || 'Failed to approve tenant');
    } finally {
      setActionId(null);
    }
  };

  const handleReject = async (id: number) => {
    if (!window.confirm('Reject this tenant? Their account will be deactivated.')) return;
    setActionId(id);
    try {
      await rejectTenant(id);
      toast.success('Tenant rejected.');
      setTenants(prev => prev.filter(t => t.id !== id));
      setTotalElements(prev => prev - 1);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.message || 'Failed to reject tenant');
    } finally {
      setActionId(null);
    }
  };

  return (
    <Layout role="maintenance">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Pending Approvals</h1>
            <p className="text-slate-500 mt-1">
              {totalElements > 0 ? `${totalElements} tenant${totalElements !== 1 ? 's' : ''} awaiting approval` : 'No pending registrations'}
            </p>
          </div>
          <button
            onClick={() => load(page)}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-slate-500">Loading pending tenants...</div>
          ) : tenants.length === 0 ? (
            <div className="p-16 text-center">
              <Users size={40} className="text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 font-medium">All caught up! No pending registrations.</p>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Registered</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tenants.map(tenant => (
                  <tr key={tenant.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-900">{tenant.name}</td>
                    <td className="px-6 py-4 text-slate-600">{tenant.email}</td>
                    <td className="px-6 py-4 text-slate-500 text-sm">{formatDate(tenant.createdAt)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleApprove(tenant.id)}
                          disabled={actionId === tenant.id}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
                        >
                          <UserCheck size={15} />
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(tenant.id)}
                          disabled={actionId === tenant.id}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-100 text-rose-700 text-sm font-semibold rounded-lg hover:bg-rose-200 transition-colors disabled:opacity-50"
                        >
                          <UserX size={15} />
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {/* Pagination */}
          {totalElements > PAGE_SIZE && !loading && (
            <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-600">
              <span>Page {page + 1} of {Math.ceil(totalElements / PAGE_SIZE)}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => load(page - 1)}
                  disabled={page === 0}
                  className="px-3 py-1 border border-slate-200 rounded-lg disabled:opacity-40 hover:bg-slate-50 transition-colors"
                >
                  Previous
                </button>
                <button
                  onClick={() => load(page + 1)}
                  disabled={(page + 1) * PAGE_SIZE >= totalElements}
                  className="px-3 py-1 border border-slate-200 rounded-lg disabled:opacity-40 hover:bg-slate-50 transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
