import React from 'react';

    interface StatusBadgeProps {
      status: string;
      type: 'status' | 'priority';
    }

    const StatusBadge: React.FC<StatusBadgeProps> = ({ status, type }) => {
      const getStyles = () => {
        const s = status.toLowerCase();
        if (type === 'status') {
          switch (s) {
            case 'open': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'in progress': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'resolved': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'closed': return 'bg-slate-100 text-slate-700 border-slate-200';
            default: return 'bg-slate-100 text-slate-700 border-slate-200';
          }
        } else {
          switch (s) {
            case 'high': return 'bg-rose-100 text-rose-700 border-rose-200';
            case 'medium': return 'bg-orange-100 text-orange-700 border-orange-200';
            case 'low': return 'bg-slate-100 text-slate-700 border-slate-200';
            default: return 'bg-slate-100 text-slate-700 border-slate-200';
          }
        }
      };

      return (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStyles()}`}>
          {status}
        </span>
      );
    };

    export default StatusBadge;