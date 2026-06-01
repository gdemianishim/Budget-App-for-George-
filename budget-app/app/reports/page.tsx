'use client';
import { useBudgetStore } from '@/lib/store';
import { getTotals, getCategorySummaries, getHealthScore, getNetWorth, getRecurringBills } from '@/lib/calculations';
import { BudgetPieChart } from '@/components/SpendingChart';
import HealthScore from '@/components/HealthScore';

const fmt = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);

const pct = (n: number, total: number) =>
  total > 0 ? `${((n / total) * 100).toFixed(1)}%` : '—';

export default function ReportsPage() {
  const state = useBudgetStore();
  const totals = getTotals(state);
  const summaries = getCategorySummaries(state);
  const score = getHealthScore(state);
  const nw = getNetWorth(state);
  const recurring = getRecurringBills(state);
  const now = new Date();
  const monthLabel = now.toLocaleString('default', { month: 'long', year: 'numeric' });

  const topCategory = [...summaries].sort((a, b) => b.budgeted - a.budgeted)[0];
  const overspentCats = summaries.filter(s => s.spent > s.budgeted && s.budgeted > 0);

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Monthly Financial Report</h1>
          <p className="text-gray-500 text-sm mt-1">{monthLabel} · Auto-generated from your budget data</p>
        </div>
        <button onClick={() => window.print()} className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors">
          Print / Save PDF
        </button>
      </div>

      {/* Executive Summary */}
      <div className="bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl p-6 text-white">
        <h2 className="font-semibold text-indigo-200 mb-4 text-sm uppercase tracking-wider">Executive Summary</h2>
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Monthly Income', value: fmt(totals.totalIncome) },
            { label: 'Total Budgeted', value: fmt(totals.totalBudgeted) },
            { label: 'Total Spent', value: fmt(totals.totalSpent) },
            { label: 'Net Position', value: fmt(totals.actuallyLeft) },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="text-indigo-200 text-xs">{label}</p>
              <p className="text-xl font-bold mt-0.5">{value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col items-center">
          <p className="font-semibold text-gray-800 mb-3 self-start">Financial Health</p>
          <HealthScore score={score} />
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <p className="font-semibold text-gray-800 mb-1">Budget Allocation</p>
          <p className="text-xs text-gray-400 mb-2">By category</p>
          <BudgetPieChart summaries={summaries} />
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-3">
          <p className="font-semibold text-gray-800">Key Numbers</p>
          {[
            { label: 'Savings Rate', value: pct(totals.savingsBudgeted, totals.totalIncome) },
            { label: 'Debt-to-Income', value: pct(totals.debtMinPayments, totals.totalIncome) },
            { label: 'Business Cost %', value: pct(totals.businessBudgeted, totals.totalIncome) },
            { label: 'Recurring Bills', value: fmt(recurring.reduce((a, b) => a + b.amount, 0)) },
            { label: 'Net Worth', value: fmt(nw.netWorth) },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between items-center py-1 border-b border-gray-50">
              <span className="text-xs text-gray-500">{label}</span>
              <span className="text-sm font-semibold text-gray-900">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
          <h2 className="font-semibold text-gray-800">Category Breakdown</h2>
        </div>
        <div className="divide-y divide-gray-100">
          <div className="grid grid-cols-5 px-6 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            <span className="col-span-2">Category</span><span className="text-right">Budgeted</span><span className="text-right">Spent</span><span className="text-right">Status</span>
          </div>
          {summaries.filter(s => s.budgeted > 0 || s.spent > 0).map((cat) => {
            const diff = cat.budgeted - cat.spent;
            return (
              <div key={cat.name} className="grid grid-cols-5 px-6 py-3 text-sm items-center">
                <span className="col-span-2 text-gray-700">{cat.name}</span>
                <span className="text-right text-gray-600">{fmt(cat.budgeted)}</span>
                <span className="text-right text-gray-600">{fmt(cat.spent)}</span>
                <span className={`text-right text-xs font-semibold ${diff >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  {diff >= 0 ? `$${diff.toFixed(0)} under` : `$${Math.abs(diff).toFixed(0)} over`}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Alerts */}
      <div className="grid grid-cols-2 gap-4">
        {topCategory && (
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
            <p className="font-semibold text-blue-800">🏆 Largest Budget Category</p>
            <p className="text-2xl font-bold text-blue-700 mt-1">{topCategory.name}</p>
            <p className="text-sm text-blue-600">{fmt(topCategory.budgeted)}/mo · {pct(topCategory.budgeted, totals.totalBudgeted)} of budget</p>
          </div>
        )}
        {overspentCats.length > 0 ? (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
            <p className="font-semibold text-red-800">⚠️ Over Budget</p>
            <div className="mt-2 space-y-1">
              {overspentCats.map(c => (
                <p key={c.name} className="text-sm text-red-700">{c.name}: <strong>{fmt(c.spent - c.budgeted)}</strong> over</p>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5">
            <p className="font-semibold text-emerald-800">✅ No Overspending</p>
            <p className="text-sm text-emerald-700 mt-1">All categories are within budget this month. Great discipline!</p>
          </div>
        )}
      </div>
    </div>
  );
}
