import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import StatCard from '../../components/StatCard';
import StatusBadge from '../../components/StatusBadge';
import {
  ClipboardList,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  PackageCheck,
  UserCheck,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { getAllRequests, type RequestResponse } from '../../services/requestService';
import { getPendingCount } from '../../services/tenantService';
import { countByStatus, formatDate, requestCode } from '../../utils/requestFormatting';

export default function MaintenanceDashboard() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<RequestResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [pendingCount, setPendingCount] = useState<number | null>(null);

  useEffect(() => {
    getAllRequests({ page: 0, size: 100, sortBy: 'createdAt', sortDir: 'desc' })
      .then((page) => setRequests(page.content))
      .catch((err: any) => toast.error(err?.response?.data?.message || err?.message || 'Failed to load requests'))
      .finally(() => setLoading(false));

    getPendingCount()
      .then(setPendingCount)
      .catch(() => {});
  }, []);

  const stats = useMemo(() => countByStatus(requests), [requests]);
  const recentRequests = requests.slice(0, 5);

  return (
    <Layout role="maintenance">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Maintenance Overview</h1>
          <p className="text-slate-500 mt-1">Manage and track all hostel maintenance requests.</p>
        </div>

        {/* Pending approvals alert banner */}
        {pendingCount !== null && pendingCount > 0 && (
          <button
            onClick={() => navigate('/maintenance/pending-approvals')}
            className="w-full flex items-center justify-between p-4 bg-amber-50 border border-amber-200 rounded-2xl hover:bg-amber-100 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500 rounded-lg">
                <UserCheck size={18} className="text-white" />
              </div>
              <div>
                <p className="font-bold text-amber-900">
                  {pendingCount} tenant{pendingCount !== 1 ? 's' : ''} awaiting approval
                </p>
                <p className="text-sm text-amber-700">Review and approve new tenant registrations</p>
              </div>
            </div>
            <ChevronRight size={20} className="text-amber-600 shrink-0" />
          </button>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard title="Total" value={stats.total} icon={ClipboardList} color="bg-slate-900" />
          <StatCard title="Open" value={stats.OPEN} icon={AlertCircle} color="bg-blue-600" />
          <StatCard title="In Progress" value={stats.IN_PROGRESS} icon={Clock} color="bg-amber-500" />
          <StatCard title="Resolved" value={stats.RESOLVED} icon={CheckCircle2} color="bg-emerald-600" />
          <StatCard title="Closed" value={stats.CLOSED} icon={PackageCheck} color="bg-slate-400" />
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-900">Recent Requests</h3>
            <button
              onClick={() => navigate('/maintenance/all-requests')}
              className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-1"
            >
              View All <ChevronRight size={16} />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Tenant</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-slate-500">Loading requests...</td>
                  </tr>
                ) : recentRequests.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-slate-500">No maintenance requests found.</td>
                  </tr>
                ) : (
                  recentRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4 font-mono text-sm text-slate-600">{requestCode(req.id)}</td>
                      <td className="px-6 py-4 font-semibold text-slate-900">{req.createdByName}</td>
                      <td className="px-6 py-4 text-sm text-slate-900 font-medium">{req.title}</td>
                      <td className="px-6 py-4"><StatusBadge status={req.category} type="category" /></td>
                      <td className="px-6 py-4"><StatusBadge status={req.status} /></td>
                      <td className="px-6 py-4 text-sm text-slate-500">{formatDate(req.createdAt)}</td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => navigate(`/maintenance/requests/${req.id}`)}
                          className="text-slate-400 hover:text-slate-900 transition-colors"
                        >
                          <ChevronRight size={20} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}
