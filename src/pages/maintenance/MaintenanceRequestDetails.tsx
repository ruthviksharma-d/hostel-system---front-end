import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import StatusBadge from '../../components/StatusBadge';
import { ArrowLeft, User, Mail, Save, Calendar, Tag } from 'lucide-react';
import { toast } from 'react-toastify';
import { getRequestById, updateStatus, type RequestResponse, type RequestStatus } from '../../services/requestService';
import { formatDate, formatStatus, requestCode } from '../../utils/requestFormatting';

const MAINTENANCE_STATUSES: RequestStatus[] = ['OPEN', 'IN_PROGRESS', 'RESOLVED'];

export default function MaintenanceRequestDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState<RequestResponse | null>(null);
  const [status, setStatus] = useState<RequestStatus>('OPEN');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const numericId = Number(id);

  const loadRequest = async () => {
    if (!Number.isFinite(numericId)) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const data = await getRequestById(numericId);
      setRequest(data);
      setStatus(data.status === 'CLOSED' ? 'RESOLVED' : data.status);
      setNotes(data.resolutionNote || '');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.message || 'Failed to load request');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequest();
  }, [numericId]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!request || saving || request.status === 'CLOSED') return;

    setSaving(true);
    try {
      const updated = await updateStatus(request.id, {
        status,
        resolutionNote: status === 'RESOLVED' ? notes : undefined,
      });
      setRequest(updated);
      setStatus(updated.status === 'CLOSED' ? 'RESOLVED' : updated.status);
      setNotes(updated.resolutionNote || '');
      toast.success('Request updated successfully!');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.message || 'Failed to update request');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Layout role="maintenance">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500">Loading request...</div>
      </Layout>
    );
  }

  if (!request) {
    return (
      <Layout role="maintenance">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500">Request not found.</div>
      </Layout>
    );
  }

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
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{requestCode(request.id)}</span>
                  <StatusBadge status={request.status} />
                </div>
                <h1 className="text-2xl font-bold text-slate-900">{request.title}</h1>
                <p className="text-slate-500 mt-2">Submitted on {formatDate(request.createdAt)}</p>
              </div>
              <div className="p-8 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                      <Tag size={18} />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-medium uppercase">Category</p>
                      <StatusBadge status={request.category} type="category" />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                      <Calendar size={18} />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-medium uppercase">Last Updated</p>
                      <p className="font-semibold text-slate-900">{formatDate(request.updatedAt)}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">Description</h3>
                  <p className="text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-100">
                    {request.description}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
              <h3 className="text-lg font-bold text-slate-900 mb-6">Update Status & Notes</h3>
              {request.status === 'CLOSED' ? (
                <p className="text-slate-600 bg-slate-50 border border-slate-100 rounded-xl p-4">
                  This request is closed and cannot be updated by maintenance.
                </p>
              ) : (
                <form onSubmit={handleUpdate} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Current Status</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as RequestStatus)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-900/10 outline-none transition-all"
                    >
                      {MAINTENANCE_STATUSES.map((item) => (
                        <option key={item} value={item}>{formatStatus(item)}</option>
                      ))}
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
                    disabled={saving}
                    className="w-full bg-slate-900 text-white py-3.5 rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-900/20 disabled:opacity-60"
                  >
                    <Save size={20} />
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </form>
              )}
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
                    <p className="font-semibold text-slate-900">{request.createdByName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Email</p>
                    <p className="font-semibold text-slate-900">{request.createdByEmail}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h3 className="font-bold text-slate-900 mb-4">Resolution Workflow</h3>
              <div className="space-y-3 text-sm text-slate-600">
                <p>Open requests can be acknowledged by moving them to In Progress.</p>
                <p>Resolved requests should include a resolution note for the tenant.</p>
                <p>Tenants close requests after reviewing the resolution.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
