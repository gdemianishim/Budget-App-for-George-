'use client';
import { useBudgetStore } from '@/lib/store';
import { getInsights, getTotals, getHealthScore } from '@/lib/calculations';
import InsightCard from '@/components/InsightCard';
import HealthScore from '@/components/HealthScore';

const fmt = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);

export default function InsightsPage() {
  const state = useBudgetStore();
  const insights = getInsights(state);
  const totals = getTotals(state);
  const score = getHealthScore(state);

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Financial Insights</h1>
        <p className="text-gray-500 text-sm mt-1">Personalized recommendations based on your numbers</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col items-center">
          <h2 className="font-semibold text-gray-800 mb-4">Financial Health Score</h2>
          <HealthScore score={score} />
          <p className="text-xs text-gray-400 mt-3 text-center">Based on savings rate, debt-to-income ratio, and monthly margin</p>
        </div>

        <div className="md:col-span-2 bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-800 mb-4">Key Metrics</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Monthly Income', value: fmt(totals.totalIncome) },
              { label: 'Total Expenses', value: fmt(totals.totalBudgeted) },
              { label: 'Savings Rate', value: totals.totalIncome > 0 ? `${((totals.savingsBudgeted / totals.totalIncome) * 100).toFixed(1)}%` : '—' },
              { label: 'Debt Payments', value: fmt(totals.debtMinPayments) },
              { label: 'Left Over', value: fmt(totals.actuallyLeft) },
              { label: 'Business Cost', value: fmt(totals.businessBudgeted) },
            ].map(({ label, value }) => (
              <div key={label} className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-500">{label}</p>
                <p className="font-bold text-gray-900 mt-0.5">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="font-semibold text-gray-800">Recommendations</h2>
        {insights.length === 0 ? (
          <div className="bg-gray-50 rounded-2xl p-8 text-center text-gray-400">
            <p>Enter your budget data to receive personalized insights.</p>
          </div>
        ) : (
          insights.map((insight, i) => <InsightCard key={i} insight={insight} />)
        )}
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="font-semibold text-gray-800 mb-3">Next Best Steps</h2>
        <ol className="space-y-3">
          {[
            'Fill in your actual income in the Budget page',
            'Enter your real monthly spending in each category',
            'Add your debt balances and APY rates in the Debt Tracker',
            'Set your emergency fund savings amount in the Savings page',
            'Review your Business transfer allocations',
            'Come back to this page for updated personalized recommendations',
          ].map((step, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
              <span className="bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
              {step}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
