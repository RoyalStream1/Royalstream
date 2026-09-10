import React from 'react';

export interface StatBadgeProps {
  label: string;
  value: string | number;
  subtext?: string;
  variant?: 'purple' | 'emerald' | 'amber' | 'blue';
}

export const StatBadge: React.FC<StatBadgeProps> = ({
  label,
  value,
  subtext,
  variant = 'purple',
}) => {
  const bgMap = {
    purple: 'bg-purple-950/40 border-purple-800/40 text-purple-200',
    emerald: 'bg-emerald-950/40 border-emerald-800/40 text-emerald-200',
    amber: 'bg-amber-950/40 border-amber-800/40 text-amber-200',
    blue: 'bg-blue-950/40 border-blue-800/40 text-blue-200',
  };

  return (
    <div className={`p-4 rounded-xl border backdrop-blur-md transition-all hover:scale-[1.02] ${bgMap[variant]}`}>
      <div className="text-xs uppercase tracking-wider text-slate-400 font-medium">{label}</div>
      <div className="text-2xl font-bold mt-1 tracking-tight text-white">{value}</div>
      {subtext && <div className="text-xs text-slate-400 mt-1">{subtext}</div>}
    </div>
  );
};
