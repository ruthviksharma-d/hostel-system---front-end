import React from 'react';
import { formatCategory, formatStatus } from '../utils/requestFormatting';

    interface StatusBadgeProps {
      status: string;
      type?: 'status' | 'category';
    }

    const StatusBadge: React.FC<StatusBadgeProps> = ({ status, type = 'status' }) => {
      const getStyles = () => {
        const s = status.toUpperCase();
        if (type === 'status') {
          switch (s) {
            case 'OPEN': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'IN_PROGRESS': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'RESOLVED': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'CLOSED': return 'bg-slate-100 text-slate-700 border-slate-200';
            default: return 'bg-slate-100 text-slate-700 border-slate-200';
          }
        }

        return 'bg-slate-100 text-slate-700 border-slate-200';
      };

      return (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStyles()}`}>
          {type === 'status' ? formatStatus(status) : formatCategory(status)}
        </span>
      );
    };

    export default StatusBadge;
