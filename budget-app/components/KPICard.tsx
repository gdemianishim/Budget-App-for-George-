'use client';
import { ReactNode } from 'react';

interface KPICardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: ReactNode;
  color: 'green' | 'blue' | 'purple' | 'red' | 'yellow';
}

const colorMap = {
  green: 'bg-emerald-50 border-emerald-200 text-emerald-700',
  blue: 'bg-blue-50 border-blue-200 text-blue-700',
  purple: 'bg-violet-50 border-violet-200 text-violet-700',
  red: 'bg-red-50 border-red-200 text-red-700',
  yellow: 'bg-amber-50 border-amber-200 text-amber-700',
};

const iconBg = {
  green: 'bg-emerald-100',
  blue: 'bg-blue-100',
  purple: 'bg-violet-100',
  red: 'bg-red-100',
  yellow: 'bg-amber-100',
};

export default function KPICard({ title, value, subtitle, icon, color }: KPICardProps) {
  return (
    <div className={`rounded-2xl border p-5 flex items-start gap-4 ${colorMap[color]}`}>
      <div className={`rounded-xl p-3 ${iconBg[color]}`}>{icon}</div>
      <div>
        <p className="text-sm font-medium opacity-70">{title}</p>
        <p className="text-2xl font-bold mt-0.5">{value}</p>
        {subtitle && <p className="text-xs mt-1 opacity-60">{subtitle}</p>}
      </div>
    </div>
  );
}
