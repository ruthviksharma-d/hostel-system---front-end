import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import StatusBadge from '../../components/StatusBadge';
import { Search, ChevronRight } from 'lucide-react';
import { toast } from 'react-toastify';
import { getAllRequests, REQUEST_STATUSES, type RequestResponse, type RequestStatus } from '../../services/requestService';
import { formatDate, formatStatus, requestCode } from '../../utils/requestFormatting';

export default function AllRequests() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<RequestResponse[]>([]);
  const [status, setStatus] = useState<RequestStatus | ''>('');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getAllRequests({ status: status || undefined, page: 0, size: 100, sortBy: 'createdAt', sortDir: 'desc' })
      .then((page) => setRequests(page.content))
      .catch((err: any) => toast.error(err?.response?.data?.message || err?.message || 'Failed to load requests'))
      .finally(() => setLoading(false));
  }, [status]);

  const filteredRequests = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return requests;

    return requests.filter((request) => {
      return [
        requestCode(request.id),
        request.createdByName,
        request.createdByEmail,
        request.title,
        request.description,
        request.category,
        request.status,
      ].some((value) => String(value).toLowerCase().includes(normalizedQuery));
    });
  }, [query, requests]);

  return (
    <Layout role="maintenance">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-slate-900">All Maintenance Requests</h1>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 md:flex-none">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by ID, tenant, or title..."
                className="pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-slate-900/10 outline-none w-full md:w-80"
              />
            </div>
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value as RequestStatus | '')}
              className="px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-slate-900/10 outline-none text-sm font-medium"
            >
              <option value="">All Status</option>
              {REQUEST_STATUSES.map((item) => (
                <option key={item} value={item}>{formatStatus(item)}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Tenant Name</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Tenant Email</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Created Date</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-8 text-center text-slate-500">Loading requests...</td>
                  </tr>
                ) : filteredRequests.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-8 text-center text-slate-500">No requests found.</td>
                  </tr>
                ) : (
                  filteredRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4 font-mono text-sm text-slate-600">{requestCode(req.id)}</td>
                      <td className="px-6 py-4 font-semibold text-slate-900">{req.createdByName}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{req.createdByEmail}</td>
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
