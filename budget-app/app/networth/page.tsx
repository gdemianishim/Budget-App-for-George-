'use client';
import { useBudgetStore } from '@/lib/store';
import { getNetWorth } from '@/lib/calculations';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const fmt = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);

export default function NetWorthPage() {
  const state = useBudgetStore();
  const { setAsset, setLiability } = state;
  const { totalAssets, totalLiabilities, netWorth } = getNetWorth(state);

  const chartData = [
    { name: 'Assets', value: totalAssets },
    { name: 'Liabilities', value: totalLiabilities },
    { name: 'Net Worth', value: netWorth },
  ];

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Net Worth Tracker</h1>
        <p className="text-gray-500 text-sm mt-1">Track what you own minus what you owe</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5">
          <p className="text-xs text-emerald-700 font-medium">Total Assets</p>
          <p className="text-2xl font-bold text-emerald-800 mt-1">{fmt(totalAssets)}</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
          <p className="text-xs text-red-700 font-medium">Total Liabilities</p>
          <p className="text-2xl font-bold text-red-800 mt-1">{fmt(totalLiabilities)}</p>
        </div>
        <div className={`rounded-2xl border p-5 ${netWorth >= 0 ? 'bg-indigo-50 border-indigo-200' : 'bg-orange-50 border-orange-200'}`}>
          <p className="text-xs font-medium text-gray-600">Net Worth</p>
          <p className={`text-2xl font-bold mt-1 ${netWorth >= 0 ? 'text-indigo-700' : 'text-orange-700'}`}>{fmt(netWorth)}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Assets */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 bg-emerald-50 border-b border-emerald-100">
            <h2 className="font-semibold text-emerald-800">Assets</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {state.assets.map((asset, i) => (
              <div key={i} className="flex items-center gap-3 px-6 py-3">
                <span className="text-sm text-gray-700 flex-1">{asset.label}</span>
                <div className="relative w-36">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                  <input type="number" min="0" value={asset.value || ''} placeholder="0"
                    onChange={(e) => setAsset(i, 'value', parseFloat(e.target.value) || 0)}
                    className="w-full border border-gray-200 rounded-lg pl-6 pr-3 py-1.5 text-sm text-right focus:outline-none focus:ring-2 focus:ring-emerald-300" />
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center px-6 py-3 bg-emerald-50 border-t border-emerald-100">
            <span className="text-sm font-semibold text-emerald-800">Total</span>
            <span className="font-bold text-emerald-800">{fmt(totalAssets)}</span>
          </div>
        </div>

        {/* Liabilities */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 bg-red-50 border-b border-red-100">
            <h2 className="font-semibold text-red-800">Liabilities</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {state.liabilities.map((liability, i) => (
              <div key={i} className="flex items-center gap-3 px-6 py-3">
                <span className="text-sm text-gray-700 flex-1">{liability.label}</span>
                <div className="relative w-36">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                  <input type="number" min="0" value={liability.balance || ''} placeholder="0"
                    onChange={(e) => setLiability(i, 'balance', parseFloat(e.target.value) || 0)}
                    className="w-full border border-gray-200 rounded-lg pl-6 pr-3 py-1.5 text-sm text-right focus:outline-none focus:ring-2 focus:ring-red-300" />
                </div>
              </div>
            ))}
            <div className="px-6 py-3 bg-gray-50 text-xs text-gray-400">Debt balances from Debt Tracker also count toward liabilities</div>
          </div>
          <div className="flex justify-between items-center px-6 py-3 bg-red-50 border-t border-red-100">
            <span className="text-sm font-semibold text-red-800">Total</span>
            <span className="font-bold text-red-800">{fmt(totalLiabilities)}</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="font-semibold text-gray-800 mb-4">Net Worth Breakdown</h2>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={chartData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" />
            <YAxis tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
            <Tooltip formatter={(v) => fmt(Number(v))} />
            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
              <Cell fill="#10b981" />
              <Cell fill="#ef4444" />
              <Cell fill={netWorth >= 0 ? '#6366f1' : '#f97316'} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="font-semibold text-gray-800 mb-3">Net Worth Milestones</h2>
        <div className="space-y-2">
          {[
            { label: 'Break Even (Net Worth = $0)', target: 0 },
            { label: 'First $1,000 Net Worth', target: 1000 },
            { label: '$10,000 Net Worth', target: 10000 },
            { label: '$50,000 Net Worth', target: 50000 },
          ].map(({ label, target }) => (
            <div key={label} className={`flex items-center gap-3 p-3 rounded-xl ${netWorth >= target ? 'bg-emerald-50' : 'bg-gray-50'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${netWorth >= target ? 'bg-emerald-500 text-white' : 'bg-gray-300 text-white'}`}>
                {netWorth >= target ? '✓' : '○'}
              </span>
              <span className={`text-sm font-medium ${netWorth >= target ? 'text-emerald-700' : 'text-gray-500'}`}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
