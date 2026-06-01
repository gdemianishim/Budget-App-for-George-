'use client';
import { useBudgetStore } from '@/lib/store';
import { getTotals } from '@/lib/calculations';

const fmt = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);

export default function SavingsPage() {
  const state = useBudgetStore();
  const { setLineItem } = state;
  const totals = getTotals(state);

  const emergencyFund = state.savings[0];
  const efGoal3 = totals.totalBudgeted * 3;
  const efGoal6 = totals.totalBudgeted * 6;
  const efSpent = emergencyFund.spent;
  const progress3 = efGoal3 > 0 ? Math.min((efSpent / efGoal3) * 100, 100) : 0;
  const monthsToGoal3 = emergencyFund.budgeted > 0 ? Math.ceil((efGoal3 - efSpent) / emergencyFund.budgeted) : null;

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Savings Goals</h1>
        <p className="text-gray-500 text-sm mt-1">Monitor your savings progress and milestones</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5">
          <p className="text-xs text-emerald-700 font-medium">Monthly Savings Budget</p>
          <p className="text-2xl font-bold text-emerald-800 mt-1">{fmt(totals.savingsBudgeted)}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-5">
          <p className="text-xs text-gray-500">3-Month Emergency Goal</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{fmt(efGoal3)}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-5">
          <p className="text-xs text-gray-500">6-Month Emergency Goal</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{fmt(efGoal6)}</p>
        </div>
      </div>

      {/* Emergency Fund Progress */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="font-semibold text-gray-800">Emergency Fund</h2>
            <p className="text-xs text-gray-400 mt-0.5">3–6 months of expenses as a safety net</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-gray-900">{fmt(efSpent)}</p>
            <p className="text-xs text-gray-400">saved so far</p>
          </div>
        </div>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>3-Month Goal ({fmt(efGoal3)})</span>
              <span>{progress3.toFixed(1)}%</span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${progress3}%` }}
              />
            </div>
          </div>
        </div>
        {monthsToGoal3 !== null && monthsToGoal3 > 0 && (
          <p className="text-sm text-gray-500 mt-4">
            At <strong>{fmt(emergencyFund.budgeted)}/month</strong>, you&apos;ll reach your 3-month goal in approximately <strong>{monthsToGoal3} months</strong>.
          </p>
        )}
        {efSpent >= efGoal3 && (
          <p className="text-sm text-emerald-600 font-medium mt-4">3-month emergency fund reached!</p>
        )}
      </div>

      {/* Savings Items */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h2 className="font-semibold text-gray-800">Savings Accounts</h2>
        </div>
        <div className="divide-y divide-gray-100">
          <div className="grid grid-cols-4 gap-3 px-6 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            <span className="col-span-2">Account</span>
            <span>Monthly Budget ($)</span>
            <span>Balance / Saved ($)</span>
          </div>
          {state.savings.map((item, i) => (
            <div key={i} className="grid grid-cols-4 gap-3 items-center px-6 py-3">
              <span className="col-span-2 text-sm text-gray-700">{item.label}</span>
              <input
                type="number" min="0" step="0.01"
                value={item.budgeted || ''}
                placeholder="0.00"
                onChange={(e) => setLineItem('savings', i, 'budgeted', parseFloat(e.target.value) || 0)}
                className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-right focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
              <input
                type="number" min="0" step="0.01"
                value={item.spent || ''}
                placeholder="0.00"
                onChange={(e) => setLineItem('savings', i, 'spent', parseFloat(e.target.value) || 0)}
                className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-right focus:outline-none focus:ring-blue-300 focus:ring-2"
              />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-4 gap-3 px-6 py-4 bg-gray-50 border-t border-gray-200">
          <span className="col-span-2 text-sm font-semibold text-gray-700">Total</span>
          <span className="text-sm font-bold text-gray-900 text-right">
            {fmt(state.savings.reduce((a, i) => a + i.budgeted, 0))}
          </span>
          <span className="text-sm font-bold text-gray-900 text-right">
            {fmt(state.savings.reduce((a, i) => a + i.spent, 0))}
          </span>
        </div>
      </div>

      {/* Milestones */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="font-semibold text-gray-800 mb-4">Savings Milestones</h2>
        <div className="space-y-3">
          {[
            { label: '$1,000 Starter Fund', target: 1000 },
            { label: '1-Month Expenses', target: totals.totalBudgeted },
            { label: '3-Month Emergency Fund', target: efGoal3 },
            { label: '6-Month Emergency Fund', target: efGoal6 },
          ].map(({ label, target }) => {
            const reached = efSpent >= target;
            return (
              <div key={label} className={`flex items-center gap-3 p-3 rounded-xl ${reached ? 'bg-emerald-50' : 'bg-gray-50'}`}>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${reached ? 'bg-emerald-500 text-white' : 'bg-gray-300 text-white'}`}>
                  {reached ? '✓' : '○'}
                </div>
                <span className={`text-sm font-medium ${reached ? 'text-emerald-700' : 'text-gray-600'}`}>{label}</span>
                <span className="ml-auto text-xs text-gray-400">{fmt(target)}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
