import React from 'react';
    import { useParams, useNavigate } from 'react-router-dom';
    import Layout from '../../components/Layout';
    import StatusBadge from '../../components/StatusBadge';
    import { ArrowLeft, Calendar, Tag, AlertCircle, Clock, CheckCircle2 } from 'lucide-react';

    export default function RequestDetails() {
      const { id } = useParams();
      const navigate = useNavigate();

      // Mock data for demonstration
      const request = {
        id: id || 'REQ-001',
        title: 'Leaking Faucet',
        category: 'Plumbing',
        priority: 'Medium',
        status: 'In Progress',
        date: '2024-03-15',
        description: 'The faucet in the bathroom is constantly dripping even when turned off tightly. It is wasting a lot of water and making a noise at night.',
        resolutionNotes: 'Technician assigned. Parts ordered for replacement.',
        timeline: [
          { status: 'Open', date: '2024-03-15 09:00 AM', note: 'Request submitted by tenant' },
          { status: 'In Progress', date: '2024-03-15 02:30 PM', note: 'Maintenance staff acknowledged the request' }
        ]
      };

      return (
        <Layout role="tenant">
          <div className="max-w-4xl mx-auto space-y-6">
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors font-semibold"
            >
              <ArrowLeft size={20} />
              Back to Requests
            </button>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-slate-100">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{request.id}</span>
                    <h1 className="text-3xl font-bold text-slate-900 mt-1">{request.title}</h1>
                  </div>
                  <div className="flex gap-2">
                    <StatusBadge status={request.priority} type="priority" />
                    <StatusBadge status={request.status} type="status" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                      <Tag size={18} />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-medium uppercase">Category</p>
                      <p className="font-semibold text-slate-900">{request.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                      <Calendar size={18} />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-medium uppercase">Created Date</p>
                      <p className="font-semibold text-slate-900">{request.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                      <AlertCircle size={18} />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-medium uppercase">Priority</p>
                      <p className="font-semibold text-slate-900">{request.priority}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8 space-y-8">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-3">Description</h3>
                  <p className="text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                    {request.description}
                  </p>
                </div>

                {request.resolutionNotes && (
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-3">Resolution Notes</h3>
                    <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl text-emerald-800">
                      {request.resolutionNotes}
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-6">Timeline</h3>
                  <div className="space-y-6 relative before:absolute before:left-[17px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                    {request.timeline.map((item, idx) => (
                      <div key={idx} className="flex gap-6 relative">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center z-10 border-4 border-white shadow-sm ${
                          item.status === 'Open' ? 'bg-blue-500' : 'bg-amber-500'
                        }`}>
                          {item.status === 'Open' ? <AlertCircle size={14} className="text-white" /> : <Clock size={14} className="text-white" />}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{item.status}</p>
                          <p className="text-xs text-slate-500 mb-1">{item.date}</p>
                          <p className="text-sm text-slate-600">{item.note}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Layout>
      );
    }