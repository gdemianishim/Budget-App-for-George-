'use client';
import { useBudgetStore } from '@/lib/store';
import { getCashFlowForecast, getTotals } from '@/lib/calculations';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, BarChart, Bar,
} from 'recharts';

const fmt = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

export default function ForecastPage() {
  const state = useBudgetStore();
  const totals = getTotals(state);
  const forecast = getCashFlowForecast(state, 12);
  const monthlyNet = totals.totalIncome - totals.totalBudgeted;

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Cash Flow Forecast</h1>
        <p className="text-gray-500 text-sm mt-1">12-month projection based on your current budget</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className={`rounded-2xl border p-5 ${monthlyNet >= 0 ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
          <p className="text-xs text-gray-500">Monthly Net</p>
          <p className={`text-2xl font-bold mt-1 ${monthlyNet >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>{fmt(monthlyNet)}</p>
          <p className="text-xs text-gray-400 mt-0.5">income minus expenses</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-5">
          <p className="text-xs text-gray-500">Projected 6-Month Balance</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{fmt(monthlyNet * 6)}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-5">
          <p className="text-xs text-gray-500">Projected 12-Month Balance</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{fmt(monthlyNet * 12)}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="font-semibold text-gray-800 mb-1">Cumulative Cash Flow</h2>
        <p className="text-xs text-gray-400 mb-4">Running total of money saved over 12 months</p>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={forecast}>
            <defs>
              <linearGradient id="netGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="efGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="label" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
            <Tooltip formatter={(v) => fmt(Number(v))} />
            <Legend />
            <Area type="monotone" dataKey="cumulative" stroke="#6366f1" fill="url(#netGrad)" name="Cash Balance" strokeWidth={2} />
            <Area type="monotone" dataKey="emergencyFund" stroke="#10b981" fill="url(#efGrad)" name="Emergency Fund" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="font-semibold text-gray-800 mb-1">Income vs Expenses</h2>
        <p className="text-xs text-gray-400 mb-4">Monthly comparison over 12 months</p>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={forecast}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="label" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${v}`} />
            <Tooltip formatter={(v) => fmt(Number(v))} />
            <Legend />
            <Bar dataKey="income" fill="#6366f1" name="Income" radius={[3, 3, 0, 0]} />
            <Bar dataKey="expenses" fill="#f59e0b" name="Expenses" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
          <h2 className="font-semibold text-gray-800">Monthly Breakdown</h2>
        </div>
        <div className="divide-y divide-gray-100">
          <div className="grid grid-cols-5 px-6 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            <span>Month</span><span className="text-right">Income</span><span className="text-right">Expenses</span><span className="text-right">Net</span><span className="text-right">Cumulative</span>
          </div>
          {forecast.map((row) => (
            <div key={row.label} className="grid grid-cols-5 px-6 py-2.5 text-sm">
              <span className="text-gray-700 font-medium">{row.label}</span>
              <span className="text-right text-gray-700">{fmt(row.income)}</span>
              <span className="text-right text-gray-700">{fmt(row.expenses)}</span>
              <span className={`text-right font-medium ${row.net >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>{fmt(row.net)}</span>
              <span className={`text-right font-bold ${row.cumulative >= 0 ? 'text-gray-900' : 'text-red-600'}`}>{fmt(row.cumulative)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
