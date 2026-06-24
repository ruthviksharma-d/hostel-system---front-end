import React from 'react';
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
      PackageCheck
    } from 'lucide-react';

    const RECENT_ALL = [
      { id: 'REQ-002', tenant: 'John Doe', room: 'B-204', title: 'AC Not Cooling', category: 'Electrical', priority: 'High', status: 'Open', date: '2024-03-16' },
      { id: 'REQ-001', tenant: 'Jane Smith', room: 'A-102', title: 'Leaking Faucet', category: 'Plumbing', priority: 'Medium', status: 'In Progress', date: '2024-03-15' },
      { id: 'REQ-004', tenant: 'Mike Ross', room: 'C-305', title: 'Window Latch Broken', category: 'Furniture', priority: 'Low', status: 'Open', date: '2024-03-17' },
    ];

    export default function MaintenanceDashboard() {
      const navigate = useNavigate();

      return (
        <Layout role="maintenance">
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Maintenance Overview</h1>
              <p className="text-slate-500 mt-1">Manage and track all hostel maintenance requests.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <StatCard title="Total" value="48" icon={ClipboardList} color="bg-slate-900" />
              <StatCard title="Open" value="12" icon={AlertCircle} color="bg-blue-600" />
              <StatCard title="In Progress" value="8" icon={Clock} color="bg-amber-500" />
              <StatCard title="Resolved" value="24" icon={CheckCircle2} color="bg-emerald-600" />
              <StatCard title="Closed" value="4" icon={PackageCheck} color="bg-slate-400" />
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
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Room</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Title</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Priority</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {RECENT_ALL.map((req) => (
                      <tr key={req.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-6 py-4 font-mono text-sm text-slate-600">{req.id}</td>
                        <td className="px-6 py-4 font-semibold text-slate-900">{req.tenant}</td>
                        <td className="px-6 py-4 text-sm text-slate-600">{req.room}</td>
                        <td className="px-6 py-4 text-sm text-slate-900 font-medium">{req.title}</td>
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