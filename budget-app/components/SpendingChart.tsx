'use client';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import { CategorySummary } from '@/types/budget';

const COLORS = [
  '#6366f1','#10b981','#f59e0b','#3b82f6','#ec4899',
  '#8b5cf6','#14b8a6','#f97316','#06b6d4','#84cc16','#ef4444',
];

interface Props {
  summaries: CategorySummary[];
}

const fmt = (n: number) => `$${n.toFixed(0)}`;

export function BudgetPieChart({ summaries }: Props) {
  const data = summaries.filter(s => s.budgeted > 0).map(s => ({ name: s.name, value: s.budgeted }));
  if (data.length === 0) return <p className="text-gray-400 text-sm text-center py-8">No budget data yet.</p>;
  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={3} dataKey="value">
          {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
        </Pie>
        <Tooltip formatter={(v) => fmt(Number(v))} />
        <Legend iconType="circle" iconSize={10} />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function BudgetBarChart({ summaries }: Props) {
  const data = summaries
    .filter(s => s.budgeted > 0 || s.spent > 0)
    .map(s => ({ name: s.name.split(' ')[0], budgeted: s.budgeted, spent: s.spent }));
  if (data.length === 0) return <p className="text-gray-400 text-sm text-center py-8">No budget data yet.</p>;
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="name" tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 11 }} tickFormatter={fmt} />
        <Tooltip formatter={(v) => fmt(Number(v))} />
        <Legend />
        <Bar dataKey="budgeted" fill="#6366f1" radius={[4, 4, 0, 0]} name="Budgeted" />
        <Bar dataKey="spent" fill="#10b981" radius={[4, 4, 0, 0]} name="Spent" />
      </BarChart>
    </ResponsiveContainer>
  );
}
