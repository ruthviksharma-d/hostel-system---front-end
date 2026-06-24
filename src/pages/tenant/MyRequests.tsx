import React from 'react';
    import { useNavigate } from 'react-router-dom';
    import Layout from '../../components/Layout';
    import StatusBadge from '../../components/StatusBadge';
    import { ChevronRight, Search, Filter } from 'lucide-react';

    const MOCK_REQUESTS = [
      { id: 'REQ-001', title: 'Leaking Faucet', category: 'Plumbing', priority: 'Medium', status: 'In Progress', date: '2024-03-15' },
      { id: 'REQ-002', title: 'AC Not Cooling', category: 'Electrical', priority: 'High', status: 'Open', date: '2024-03-16' },
      { id: 'REQ-004', title: 'Window Latch Broken', category: 'Furniture', priority: 'Low', status: 'Open', date: '2024-03-17' },
    ];

    export default function MyRequests() {
      const navigate = useNavigate();

      return (
        <Layout role="tenant">
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h1 className="text-2xl font-bold text-slate-900">My Requests</h1>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text" 
                    placeholder="Search requests..."
                    className="pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-slate-900/10 outline-none w-full md:w-64"
                  />
                </div>
                <button className="p-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50">
                  <Filter size={20} />
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50">
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Request ID</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Title</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Priority</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Created Date</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Action</th>
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
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </Layout>
      );
    }