'use client';
import { useBudgetStore } from '@/lib/store';
import { getTotals, getCategorySummaries, getHealthScore } from '@/lib/calculations';
import KPICard from '@/components/KPICard';
import { BudgetPieChart, BudgetBarChart } from '@/components/SpendingChart';
import HealthScore from '@/components/HealthScore';
import { DollarSign, TrendingDown, TrendingUp, Wallet } from 'lucide-react';

const fmt = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);

export default function DashboardPage() {
  const state = useBudgetStore();
  const totals = getTotals(state);
  const summaries = getCategorySummaries(state);
  const score = getHealthScore(state);

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Your financial overview at a glance</p>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <KPICard
          title="Monthly Income"
          value={fmt(totals.totalIncome)}
          subtitle={`${state.payFrequency}x per month`}
          icon={<DollarSign size={20} />}
          color="green"
        />
        <KPICard
          title="Total Budgeted"
          value={fmt(totals.totalBudgeted)}
          subtitle="Planned spending"
          icon={<Wallet size={20} />}
          color="blue"
        />
        <KPICard
          title="Total Spent"
          value={fmt(totals.totalSpent)}
          subtitle="Actual spending"
          icon={<TrendingDown size={20} />}
          color={totals.totalSpent > totals.totalBudgeted ? 'red' : 'purple'}
        />
        <KPICard
          title="Left Over"
          value={fmt(totals.actuallyLeft)}
          subtitle="After actual spending"
          icon={<TrendingUp size={20} />}
          color={totals.actuallyLeft >= 0 ? 'green' : 'red'}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-800 mb-1">Financial Health Score</h2>
          <p className="text-xs text-gray-400 mb-4">Based on savings rate, debt load & margin</p>
          <div className="flex justify-center">
            <HealthScore score={score} />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-800 mb-1">Budget by Category</h2>
          <p className="text-xs text-gray-400 mb-2">Planned allocation</p>
          <BudgetPieChart summaries={summaries} />
        </div>

        <div className="xl:col-span-1 bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-800 mb-1">Budget vs Spent</h2>
          <p className="text-xs text-gray-400 mb-2">By category</p>
          <BudgetBarChart summaries={summaries} />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="font-semibold text-gray-800 mb-4">Monthly Summary</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { label: 'Should Have Left', value: fmt(totals.shouldHaveLeft), ok: totals.shouldHaveLeft >= 0 },
            { label: 'Actually Left Over', value: fmt(totals.actuallyLeft), ok: totals.actuallyLeft >= 0 },
            { label: 'Difference', value: fmt(totals.totalDifference), ok: totals.totalDifference >= 0 },
            { label: 'Total Debt Payments', value: fmt(totals.debtMinPayments), ok: true },
            { label: 'Savings Budgeted', value: fmt(totals.savingsBudgeted), ok: true },
            { label: 'Business Tools', value: fmt(totals.businessBudgeted), ok: true },
          ].map(({ label, value, ok }) => (
            <div key={label} className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-500">{label}</p>
              <p className={`text-lg font-bold mt-1 ${ok ? 'text-gray-900' : 'text-red-600'}`}>{value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
