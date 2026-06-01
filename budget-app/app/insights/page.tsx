'use client';
import { useBudgetStore } from '@/lib/store';
import { getInsights, getTotals, getHealthScore, getNextBestActions, getBusinessRecommendations } from '@/lib/calculations';
import InsightCard from '@/components/InsightCard';
import HealthScore from '@/components/HealthScore';

const fmt = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);

const impactColor = { high: 'bg-red-100 text-red-700', medium: 'bg-amber-100 text-amber-700', low: 'bg-gray-100 text-gray-600' };
const bizColor = { success: 'bg-emerald-50 border-emerald-200 text-emerald-800', warning: 'bg-amber-50 border-amber-200 text-amber-800', info: 'bg-blue-50 border-blue-200 text-blue-800', danger: 'bg-red-50 border-red-200 text-red-800' };

export default function InsightsPage() {
  const state = useBudgetStore();
  const insights = getInsights(state);
  const totals = getTotals(state);
  const score = getHealthScore(state);
  const actions = getNextBestActions(state);
  const bizRecs = getBusinessRecommendations(state);

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Financial Insights</h1>
        <p className="text-gray-500 text-sm mt-1">AI-powered recommendations based on your numbers</p>
      </div>

      {/* Health + Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col items-center">
          <h2 className="font-semibold text-gray-800 mb-4 self-start">Financial Health Score</h2>
          <HealthScore score={score} />
          <p className="text-xs text-gray-400 mt-3 text-center">Savings rate, debt-to-income & monthly margin</p>
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

      {/* Next Best Actions */}
      <div>
        <h2 className="font-semibold text-gray-800 mb-3">⚡ Next Best Actions</h2>
        <p className="text-xs text-gray-400 mb-4">Prioritized steps to improve your financial position right now</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {actions.map((action) => (
            <div key={action.priority} className="bg-white rounded-2xl border border-gray-200 p-5 flex gap-4">
              <div className="text-2xl shrink-0 mt-0.5">{action.icon}</div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-semibold text-gray-800 text-sm">{action.title}</p>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${impactColor[action.impact]}`}>
                    {action.impact} impact
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">{action.description}</p>
                <span className="text-xs text-indigo-600 font-medium mt-2 inline-block">{action.category}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Recommendations */}
      <div>
        <h2 className="font-semibold text-gray-800 mb-3">🤖 Financial Recommendations</h2>
        <div className="space-y-3">
          {insights.length === 0 ? (
            <div className="bg-gray-50 rounded-2xl p-8 text-center text-gray-400">
              Enter your budget data to receive personalized insights.
            </div>
          ) : (
            insights.map((insight, i) => <InsightCard key={i} insight={insight} />)
          )}
        </div>
      </div>

      {/* Business Growth Recommendations */}
      <div>
        <h2 className="font-semibold text-gray-800 mb-3">📈 Business Growth Recommendations</h2>
        <div className="space-y-3">
          {bizRecs.map((rec, i) => (
            <div key={i} className={`rounded-2xl border p-4 ${bizColor[rec.type]}`}>
              <p className="text-sm">{rec.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Step-by-step plan */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="font-semibold text-gray-800 mb-3">Your 6-Step Financial Roadmap</h2>
        <ol className="space-y-3">
          {[
            'Build a $1,000 starter emergency fund first — before anything else',
            'Pay off all high-APY credit card debt using the avalanche method',
            'Fully fund your 3-month emergency fund',
            'Invest at least 15% of income into a retirement or investment account',
            'Grow business income to cover all tool and LLC costs with profit left over',
            'Scale savings and investments as income grows — live below your means',
          ].map((step, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
              <span className="bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
              {step}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
