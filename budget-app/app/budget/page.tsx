'use client';
import { useBudgetStore } from '@/lib/store';
import { getTotals } from '@/lib/calculations';
import BudgetSection from '@/components/BudgetSection';
import { LineItem } from '@/types/budget';

type Category = 'tithing' | 'savings' | 'household' | 'utilities' | 'personalCare' | 'insurance' | 'businessTools' | 'recreation' | 'transportation' | 'foodHousehold' | 'medicalHealth';

const fmt = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);

const categories: { key: Category; label: string }[] = [
  { key: 'tithing', label: 'Tithing / Charity' },
  { key: 'savings', label: 'Savings & Investments' },
  { key: 'household', label: 'Household' },
  { key: 'utilities', label: 'Utilities' },
  { key: 'personalCare', label: 'Personal Care' },
  { key: 'insurance', label: 'Insurance' },
  { key: 'businessTools', label: 'Business Tools' },
  { key: 'recreation', label: 'Recreation' },
  { key: 'transportation', label: 'Transportation' },
  { key: 'foodHousehold', label: 'Food / Household' },
  { key: 'medicalHealth', label: 'Medical / Health' },
];

export default function BudgetPage() {
  const state = useBudgetStore();
  const { setIncome, setExtraIncome, setPayFrequency, setLineItem } = state;
  const totals = getTotals(state);

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Monthly Budget</h1>
        <p className="text-gray-500 text-sm mt-1">Track budgeted vs actual spending for each category</p>
      </div>

      {/* Income Block */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="font-semibold text-gray-800 mb-4">Monthly Income</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-medium text-gray-500 block mb-1">Primary Income</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
              <input
                type="number" min="0" step="0.01"
                value={state.income || ''}
                placeholder="0.00"
                onChange={(e) => setIncome(parseFloat(e.target.value) || 0)}
                className="w-full border border-gray-200 rounded-lg pl-7 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 block mb-1">Extra Income</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
              <input
                type="number" min="0" step="0.01"
                value={state.extraIncome || ''}
                placeholder="0.00"
                onChange={(e) => setExtraIncome(parseFloat(e.target.value) || 0)}
                className="w-full border border-gray-200 rounded-lg pl-7 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 block mb-1">Pay Frequency (per month)</label>
            <select
              value={state.payFrequency}
              onChange={(e) => setPayFrequency(parseInt(e.target.value))}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              <option value={1}>Monthly (1x)</option>
              <option value={2}>Bi-weekly / Semi-monthly (2x)</option>
              <option value={4}>Weekly (4x)</option>
            </select>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100 flex gap-6 text-sm">
          <span className="text-gray-500">Total Monthly Income: <strong className="text-gray-900">{fmt(totals.totalIncome)}</strong></span>
          <span className="text-gray-500">Per Check: <strong className="text-gray-900">{fmt(totals.totalIncome / (state.payFrequency || 1))}</strong></span>
        </div>
      </div>

      {/* Category Sections */}
      {categories.map(({ key, label }) => (
        <BudgetSection
          key={key}
          title={label}
          items={state[key] as LineItem[]}
          onUpdate={(index, field, value) => setLineItem(key, index, field, value)}
        />
      ))}

      {/* Totals Summary */}
      <div className="bg-indigo-600 rounded-2xl p-6 text-white">
        <h2 className="font-semibold mb-4">Overall Summary</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Budgeted', value: fmt(totals.totalBudgeted) },
            { label: 'Total Spent', value: fmt(totals.totalSpent) },
            { label: 'Difference', value: fmt(totals.totalDifference) },
            { label: 'Left Over', value: fmt(totals.actuallyLeft) },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="text-indigo-200 text-xs">{label}</p>
              <p className="text-xl font-bold mt-0.5">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
