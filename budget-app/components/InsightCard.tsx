import { Insight } from '@/types/budget';
import { CheckCircle, AlertTriangle, Info, XCircle } from 'lucide-react';

const config = {
  success: { bg: 'bg-emerald-50 border-emerald-200', icon: <CheckCircle className="text-emerald-600" size={20} />, title: 'text-emerald-800' },
  warning: { bg: 'bg-amber-50 border-amber-200', icon: <AlertTriangle className="text-amber-600" size={20} />, title: 'text-amber-800' },
  info: { bg: 'bg-blue-50 border-blue-200', icon: <Info className="text-blue-600" size={20} />, title: 'text-blue-800' },
  danger: { bg: 'bg-red-50 border-red-200', icon: <XCircle className="text-red-600" size={20} />, title: 'text-red-800' },
};

export default function InsightCard({ insight }: { insight: Insight }) {
  const { bg, icon, title } = config[insight.type];
  return (
    <div className={`rounded-2xl border p-5 flex gap-4 ${bg}`}>
      <div className="mt-0.5 shrink-0">{icon}</div>
      <div>
        <p className={`font-semibold ${title}`}>{insight.title}</p>
        <p className="text-sm text-gray-600 mt-1">{insight.body}</p>
      </div>
    </div>
  );
}
