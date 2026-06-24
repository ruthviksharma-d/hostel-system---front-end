import React from 'react';
    import { useNavigate } from 'react-router-dom';
    import Layout from '../../components/Layout';
    import StatusBadge from '../../components/StatusBadge';
    import { Search, Filter, ChevronRight } from 'lucide-react';

    const ALL_REQUESTS = [
      { id: 'REQ-001', tenant: 'Jane Smith', room: 'A-102', title: 'Leaking Faucet', category: 'Plumbing', priority: 'Medium', status: 'In Progress', date: '2024-03-15' },
      { id: 'REQ-002', tenant: 'John Doe', room: 'B-204', title: 'AC Not Cooling', category: 'Electrical', priority: 'High', status: 'Open', date: '2024-03-16' },
      { id: 'REQ-003', tenant: 'John Doe', room: 'B-204', title: 'Broken Chair Leg', category: 'Furniture', priority: 'Low', status: 'Resolved', date: '2024-03-10' },
      { id: 'REQ-004', tenant: 'Mike Ross', room: 'C-305', title: 'Window Latch Broken', category: 'Furniture', priority: 'Low', status: 'Open', date: '2024-03-17' },
    ];

    export default function AllRequests() {
      const navigate = useNavigate();

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
                    placeholder="Search by ID, tenant, room..."
                    className="pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-slate-900/10 outline-none w-full md:w-80"
                  />
                </div>
                <select className="px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-slate-900/10 outline-none text-sm font-medium">
                  <option>All Status</option>
                  <option>Open</option>
                  <option>In Progress</option>
                  <option>Resolved</option>
                </select>
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
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">ID</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Tenant Name</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Room</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Title</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Priority</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {ALL_REQUESTS.map((req) => (
                      <tr key={req.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-6 py-4 font-mono text-sm text-slate-600">{req.id}</td>
                        <td className="px-6 py-4 font-semibold text-slate-900">{req.tenant}</td>
                        <td className="px-6 py-4 text-sm text-slate-600">{req.room}</td>
                        <td className="px-6 py-4 text-sm text-slate-900 font-medium">{req.title}</td>
                        <td className="px-6 py-4 text-sm text-slate-600">{req.category}</td>
                        <td className="px-6 py-4">
                          <StatusBadge status={req.priority} type="priority" />
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={req.status} type="status" />
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => navigate(`/maintenance/requests/${req.id}`)}
                            className="text-slate-400 hover:text-slate-900 transition-colors"
                          >
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
        </Layout>
      );
    }