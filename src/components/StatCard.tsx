import React from 'react';
    import type { LucideIcon } from 'lucide-react';

    interface StatCardProps {
      title: string;
      value: string | number;
      icon: LucideIcon;
      color: string;
    }

    const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color }) => (
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-2 rounded-lg ${color}`}>
            <Icon size={20} className="text-white" />
          </div>
        </div>
        <div>
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{title}</p>
          <h3 className="text-2xl font-bold text-slate-900 mt-1">{value}</h3>
        </div>
      </div>
    );

    export default StatCard;