import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import StatusBadge from '../../components/StatusBadge';
import { ChevronRight, History } from 'lucide-react';
import { toast } from 'react-toastify';
import { getMyRequests, type RequestResponse } from '../../services/requestService';
import { formatDate, requestCode } from '../../utils/requestFormatting';

export default function RequestHistory() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<RequestResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyRequests({ page: 0, size: 100, sortBy: 'updatedAt', sortDir: 'desc' })
      .then((page) => setRequests(page.content))
      .catch((err: any) => toast.error(err?.response?.data?.message || err?.message || 'Failed to load request history'))
      .finally(() => setLoading(false));
  }, []);

  const historyRequests = useMemo(
    () => requests.filter((request) => request.status === 'RESOLVED' || request.status === 'CLOSED'),
    [requests]
  );

  return (
    <Layout role="tenant">
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-900 rounded-lg text-white">
            <History size={24} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Request History</h1>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Request ID</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Completed Date</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500">Loading request history...</td>
                  </tr>
                ) : historyRequests.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500">No resolved or closed requests yet.</td>
                  </tr>
                ) : (
                  historyRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4 font-mono text-sm text-slate-600">{requestCode(req.id)}</td>
                      <td className="px-6 py-4 font-semibold text-slate-900">{req.title}</td>
                      <td className="px-6 py-4"><StatusBadge status={req.category} type="category" /></td>
                      <td className="px-6 py-4"><StatusBadge status={req.status} /></td>
                      <td className="px-6 py-4 text-sm text-slate-500">{formatDate(req.closedAt || req.resolvedAt || req.updatedAt)}</td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => navigate(`/tenant/requests/${req.id}`)}
                          className="text-slate-400 hover:text-slate-900 transition-colors inline-flex items-center gap-1 text-sm font-semibold"
                        >
                          View Details
                          <ChevronRight size={16} />
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
