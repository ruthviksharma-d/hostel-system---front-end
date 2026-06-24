import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import StatCard from '../../components/StatCard';
import StatusBadge from '../../components/StatusBadge';
import {
  Plus,
  ClipboardList,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { getUserName } from '../../auth/authUtils';
import {
  createRequest,
  getMyRequests,
  REQUEST_CATEGORIES,
  type RequestCategory,
  type RequestResponse,
} from '../../services/requestService';
import { countByStatus, formatCategory, formatDate, requestCode } from '../../utils/requestFormatting';

export default function TenantDashboard() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [requests, setRequests] = useState<RequestResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const page = await getMyRequests({ page: 0, size: 100, sortBy: 'createdAt', sortDir: 'desc' });
      setRequests(page.content);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.message || 'Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const stats = useMemo(() => countByStatus(requests), [requests]);
  const recentRequests = requests.slice(0, 5);

  const handleCreateRequest = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;

    const formData = new FormData(e.currentTarget);
    const title = String(formData.get('title') || '').trim();
    const category = formData.get('category') as RequestCategory;
    const description = String(formData.get('description') || '').trim();

    setSubmitting(true);
    try {
      await createRequest({ title, category, description });
      toast.success('Maintenance request submitted successfully!');
      setIsModalOpen(false);
      await loadRequests();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.message || 'Failed to create request');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout role="tenant">
      <div className="space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Welcome back, {getUserName() || 'Tenant'}</h1>
            <p className="text-slate-500 mt-1">Here&apos;s what&apos;s happening with your maintenance requests.</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20"
          >
            <Plus size={20} />
            Create Request
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Total Requests" value={stats.total} icon={ClipboardList} color="bg-slate-900" />
          <StatCard title="Open" value={stats.OPEN} icon={AlertCircle} color="bg-blue-600" />
          <StatCard title="In Progress" value={stats.IN_PROGRESS} icon={Clock} color="bg-amber-500" />
          <StatCard title="Resolved" value={stats.RESOLVED} icon={CheckCircle2} color="bg-emerald-600" />
        </div>

        {/* Recent Requests Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-900">Recent Requests</h3>
            <button
              onClick={() => navigate('/tenant/requests')}
              className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-1"
            >
              View All <ChevronRight size={16} />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Request ID</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500">Loading requests...</td>
                  </tr>
                ) : recentRequests.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500">No maintenance requests yet.</td>
                  </tr>
                ) : (
                  recentRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4 font-mono text-sm text-slate-600">{requestCode(req.id)}</td>
                      <td className="px-6 py-4 font-semibold text-slate-900">{req.title}</td>
                      <td className="px-6 py-4"><StatusBadge status={req.category} type="category" /></td>
                      <td className="px-6 py-4"><StatusBadge status={req.status} /></td>
                      <td className="px-6 py-4 text-sm text-slate-500">{formatDate(req.createdAt)}</td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => navigate(`/tenant/requests/${req.id}`)}
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

      {/* Create Request Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100">
                <h3 className="text-xl font-bold text-slate-900">New Maintenance Request</h3>
                <p className="text-slate-500 text-sm">Describe the issue you&apos;re facing.</p>
              </div>
              <form onSubmit={handleCreateRequest} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Title</label>
                  <input
                    name="title"
                    required
                    maxLength={255}
                    placeholder="e.g., Broken light switch"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Category</label>
                  <select
                    name="category"
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 outline-none transition-all"
                  >
                    {REQUEST_CATEGORIES.map((category) => (
                      <option key={category} value={category}>{formatCategory(category)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Description</label>
                  <textarea
                    name="description"
                    required
                    rows={4}
                    placeholder="Provide more details about the problem..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 outline-none transition-all resize-none"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-6 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 px-6 py-3 rounded-xl font-bold bg-slate-900 text-white hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20 disabled:opacity-60"
                  >
                    {submitting ? 'Submitting...' : 'Submit Request'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </Layout>
  );
}
