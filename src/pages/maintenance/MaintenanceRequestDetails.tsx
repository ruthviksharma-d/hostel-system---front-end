import React, { useState } from 'react';
    import { useParams, useNavigate } from 'react-router-dom';
    import Layout from '../../components/Layout';
    import StatusBadge from '../../components/StatusBadge';
    import { ArrowLeft, User, Home, Phone, Mail, Save } from 'lucide-react';
    import { toast } from 'react-toastify';

    export default function MaintenanceRequestDetails() {
      const { id } = useParams();
      const navigate = useNavigate();
      const [status, setStatus] = useState('In Progress');
      const [notes, setNotes] = useState('Technician assigned. Parts ordered for replacement.');

      const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        toast.success('Request updated successfully!');
      };

      const request = {
        id: id || 'REQ-001',
        tenant: {
          name: 'John Doe',
          room: 'B-204',
          phone: '+1 234 567 890',
          email: 'john.doe@example.com'
        },
        title: 'Leaking Faucet',
        category: 'Plumbing',
        priority: 'Medium',
        date: '2024-03-15',
        description: 'The faucet in the bathroom is constantly dripping even when turned off tightly. It is wasting a lot of water and making a noise at night.',
        timeline: [
          { status: 'Open', date: '2024-03-15 09:00 AM', note: 'Request submitted by tenant' },
          { status: 'In Progress', date: '2024-03-15 02:30 PM', note: 'Maintenance staff acknowledged the request' }
        ]
      };

      return (
        <Layout role="maintenance">
          <div className="max-w-5xl mx-auto space-y-6">
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors font-semibold"
            >
              <ArrowLeft size={20} />
              Back to All Requests
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column: Request Info */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="p-8 border-b border-slate-100">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{request.id}</span>
                      <StatusBadge status={request.priority} type="priority" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900">{request.title}</h1>
                    <p className="text-slate-500 mt-2">{request.category} • Submitted on {request.date}</p>
                  </div>
                  <div className="p-8">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">Description</h3>
                    <p className="text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-100">
                      {request.description}
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
                  <h3 className="text-lg font-bold text-slate-900 mb-6">Update Status & Notes</h3>
                  <form onSubmit={handleUpdate} className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Current Status</label>
                      <select 
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-900/10 outline-none transition-all"
                      >
                        <option>Open</option>
                        <option>In Progress</option>
                        <option>Resolved</option>
                        <option>Closed</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Resolution Notes</label>
                      <textarea 
                        rows={4}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Add notes about the progress or resolution..."
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-900/10 outline-none transition-all resize-none"
                      />
                    </div>
                    <button 
                      type="submit"
                      className="w-full bg-slate-900 text-white py-3.5 rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-900/20"
                    >
                      <Save size={20} />
                      Save Changes
                    </button>
                  </form>
                </div>
              </div>

              {/* Right Column: Tenant Info */}
              <div className="space-y-6">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-6">Tenant Information</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                        <User size={20} />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 font-medium">Name</p>
                        <p className="font-semibold text-slate-900">{request.tenant.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                        <Home size={20} />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 font-medium">Room Number</p>
                        <p className="font-semibold text-slate-900">{request.tenant.room}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                        <Phone size={20} />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 font-medium">Phone</p>
                        <p className="font-semibold text-slate-900">{request.tenant.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                        <Mail size={20} />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 font-medium">Email</p>
                        <p className="font-semibold text-slate-900">{request.tenant.email}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900 rounded-2xl p-6 text-white">
                  <h3 className="font-bold mb-4">Quick Actions</h3>
                  <div className="space-y-2">
                    <button className="w-full py-2 px-4 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-semibold transition-colors text-left">
                      Mark as Urgent
                    </button>
                    <button className="w-full py-2 px-4 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-semibold transition-colors text-left">
                      Print Request
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Layout>
      );
    }