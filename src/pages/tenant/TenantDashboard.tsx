import React, { useState } from 'react';
    import Layout from '../../components/Layout';
    import StatCard from '../../components/StatCard';
    import StatusBadge from '../../components/StatusBadge';
    import { 
      Plus, 
      ClipboardList, 
      Clock, 
      CheckCircle2, 
      AlertCircle,
      ChevronRight
    } from 'lucide-react';
    import { motion, AnimatePresence } from 'framer-motion';
    import { toast } from 'react-toastify';

    const MOCK_REQUESTS = [
      { id: 'REQ-001', title: 'Leaking Faucet', category: 'Plumbing', priority: 'Medium', status: 'In Progress', date: '2024-03-15' },
      { id: 'REQ-002', title: 'AC Not Cooling', category: 'Electrical', priority: 'High', status: 'Open', date: '2024-03-16' },
      { id: 'REQ-003', title: 'Broken Chair Leg', category: 'Furniture', priority: 'Low', status: 'Resolved', date: '2024-03-10' },
    ];

    export default function TenantDashboard() {
      const [isModalOpen, setIsModalOpen] = useState(false);

      const handleCreateRequest = (e: React.FormEvent) => {
        e.preventDefault();
        toast.success('Maintenance request submitted successfully!');
        setIsModalOpen(false);
      };

      return (
        <Layout role="tenant">
          <div className="space-y-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Welcome back, John!</h1>
                <p className="text-slate-500 mt-1">Here's what's happening with your room maintenance.</p>
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
              <StatCard title="Total Requests" value="12" icon={ClipboardList} color="bg-slate-900" />
              <StatCard title="Open" value="2" icon={AlertCircle} color="bg-blue-600" />
              <StatCard title="In Progress" value="1" icon={Clock} color="bg-amber-500" />
              <StatCard title="Resolved" value="9" icon={CheckCircle2} color="bg-emerald-600" />
            </div>

            {/* Recent Requests Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-slate-900">Recent Requests</h3>
                <button className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-1">
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
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Priority</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {MOCK_REQUESTS.map((req) => (
                      <tr key={req.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-6 py-4 font-mono text-sm text-slate-600">{req.id}</td>
                        <td className="px-6 py-4 font-semibold text-slate-900">{req.title}</td>
                        <td className="px-6 py-4 text-sm text-slate-600">{req.category}</td>
                        <td className="px-6 py-4">
                          <StatusBadge status={req.priority} type="priority" />
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={req.status} type="status" />
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-500">{req.date}</td>
                        <td className="px-6 py-4">
                          <button className="text-slate-400 hover:text-slate-900 transition-colors">
                            <ChevronRight size={20} />
                          </button>
                        </td>
                      </tr>
                    ))}
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
                    <p className="text-slate-500 text-sm">Describe the issue you're facing in your room.</p>
                  </div>
                  <form onSubmit={handleCreateRequest} className="p-6 space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Title</label>
                      <input 
                        required
                        placeholder="e.g., Broken light switch"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 outline-none transition-all"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Category</label>
                        <select className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 outline-none transition-all">
                          <option>Electrical</option>
                          <option>Plumbing</option>
                          <option>Furniture</option>
                          <option>Internet</option>
                          <option>Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Priority</label>
                        <select className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 outline-none transition-all">
                          <option>Low</option>
                          <option>Medium</option>
                          <option>High</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Description</label>
                      <textarea 
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
                        className="flex-1 px-6 py-3 rounded-xl font-bold bg-slate-900 text-white hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20"
                      >
                        Submit Request
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