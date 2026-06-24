import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import StatusBadge from '../../components/StatusBadge';
import { ArrowLeft, Calendar, Tag, AlertCircle, Clock, CheckCircle2, PackageCheck } from 'lucide-react';
import { toast } from 'react-toastify';
import { closeRequest, getRequestById, type RequestResponse } from '../../services/requestService';
import { formatDate, formatStatus, requestCode } from '../../utils/requestFormatting';

export default function RequestDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState<RequestResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [closing, setClosing] = useState(false);

  const numericId = Number(id);

  const loadRequest = async () => {
    if (!Number.isFinite(numericId)) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      setRequest(await getRequestById(numericId));
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.message || 'Failed to load request');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequest();
  }, [numericId]);

  const handleClose = async () => {
    if (!request || closing) return;

    setClosing(true);
    try {
      setRequest(await closeRequest(request.id));
      toast.success('Request closed successfully.');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.message || 'Failed to close request');
    } finally {
      setClosing(false);
    }
  };

  const timeline = request
    ? [
        { status: 'OPEN', date: request.createdAt, note: 'Request submitted' },
        ...(request.status === 'IN_PROGRESS' || request.status === 'RESOLVED' || request.status === 'CLOSED'
          ? [{ status: 'IN_PROGRESS', date: request.updatedAt, note: 'Maintenance staff started work' }]
          : []),
        ...(request.resolvedAt
          ? [{ status: 'RESOLVED', date: request.resolvedAt, note: request.resolutionNote || 'Request resolved' }]
          : []),
        ...(request.closedAt
          ? [{ status: 'CLOSED', date: request.closedAt, note: 'Request closed by tenant' }]
          : []),
      ]
    : [];

  if (loading) {
    return (
      <Layout role="tenant">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500">Loading request...</div>
      </Layout>
    );
  }

  if (!request) {
    return (
      <Layout role="tenant">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500">Request not found.</div>
      </Layout>
    );
  }

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
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{requestCode(request.id)}</span>
                <h1 className="text-3xl font-bold text-slate-900 mt-1">{request.title}</h1>
              </div>
              <StatusBadge status={request.status} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
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
                  <p className="text-xs text-slate-500 font-medium uppercase">Created Date</p>
                  <p className="font-semibold text-slate-900">{formatDate(request.createdAt)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                  <AlertCircle size={18} />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium uppercase">Status</p>
                  <p className="font-semibold text-slate-900">{formatStatus(request.status)}</p>
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

            {request.resolutionNote && (
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">Resolution Notes</h3>
                <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl text-emerald-800">
                  {request.resolutionNote}
                </div>
              </div>
            )}

            {request.status === 'RESOLVED' && (
              <button
                onClick={handleClose}
                disabled={closing}
                className="inline-flex items-center gap-2 bg-slate-900 text-white px-5 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all disabled:opacity-60"
              >
                <PackageCheck size={18} />
                {closing ? 'Closing...' : 'Close Request'}
              </button>
            )}

            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-6">Timeline</h3>
              <div className="space-y-6 relative before:absolute before:left-[17px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                {timeline.map((item, idx) => {
                  const Icon = item.status === 'OPEN' ? AlertCircle : item.status === 'IN_PROGRESS' ? Clock : CheckCircle2;
                  return (
                    <div key={`${item.status}-${idx}`} className="flex gap-6 relative">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center z-10 border-4 border-white shadow-sm bg-slate-900">
                        <Icon size={14} className="text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{formatStatus(item.status)}</p>
                        <p className="text-xs text-slate-500 mb-1">{formatDate(item.date)}</p>
                        <p className="text-sm text-slate-600">{item.note}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
