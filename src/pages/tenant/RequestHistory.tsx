import React from 'react';
    import { useNavigate } from 'react-router-dom';
    import Layout from '../../components/Layout';
    import StatusBadge from '../../components/StatusBadge';
    import { ChevronRight, History } from 'lucide-react';

    const MOCK_HISTORY = [
      { id: 'REQ-003', title: 'Broken Chair Leg', category: 'Furniture', priority: 'Low', status: 'Resolved', date: '2024-03-10' },
      { id: 'REQ-005', title: 'Light Bulb Replacement', category: 'Electrical', priority: 'Low', status: 'Closed', date: '2024-03-05' },
      { id: 'REQ-006', title: 'Shower Drain Clogged', category: 'Plumbing', priority: 'Medium', status: 'Resolved', date: '2024-02-28' },
    ];

    export default function RequestHistory() {
      const navigate = useNavigate();

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
                    {MOCK_HISTORY.map((req) => (
                      <tr key={req.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-6 py-4 font-mono text-sm text-slate-600">{req.id}</td>
                        <td className="px-6 py-4 font-semibold text-slate-900">{req.title}</td>
                        <td className="px-6 py-4 text-sm text-slate-600">{req.category}</td>
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