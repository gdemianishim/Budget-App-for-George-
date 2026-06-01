'use client';
import { useBudgetStore } from '@/lib/store';
import { getRecurringBills, getTotals } from '@/lib/calculations';
import { LineItem } from '@/types/budget';
import { RefreshCw } from 'lucide-react';

const fmt = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);

type Category = 'tithing' | 'savings' | 'household' | 'utilities' | 'personalCare' | 'insurance' | 'businessTools' | 'recreation' | 'transportation' | 'foodHousehold' | 'medicalHealth';

const catKeys: { key: Category; label: string }[] = [
  { key: 'household', label: 'Household' },
  { key: 'utilities', label: 'Utilities' },
  { key: 'personalCare', label: 'Personal Care' },
  { key: 'insurance', label: 'Insurance' },
  { key: 'businessTools', label: 'Business Tools' },
  { key: 'transportation', label: 'Transportation' },
];

export default function RecurringPage() {
  const state = useBudgetStore();
  const { setLineItem } = state;
  const totals = getTotals(state);
  const bills = getRecurringBills(state);
  const recurringTotal = bills.reduce((a, b) => a + b.amount, 0);

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Recurring Bills</h1>
        <p className="text-gray-500 text-sm mt-1">Mark and track your fixed monthly obligations</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
          <p className="text-xs text-amber-700 font-medium">Total Recurring</p>
          <p className="text-2xl font-bold text-amber-800 mt-1">{fmt(recurringTotal)}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-5">
          <p className="text-xs text-gray-500">% of Income</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {totals.totalIncome > 0 ? `${((recurringTotal / totals.totalIncome) * 100).toFixed(1)}%` : '—'}
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-5">
          <p className="text-xs text-gray-500">Recurring Bills Count</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{bills.length}</p>
        </div>
      </div>

      {bills.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 bg-amber-50 border-b border-amber-100 flex items-center gap-2">
            <RefreshCw size={16} className="text-amber-600" />
            <h2 className="font-semibold text-amber-800">Detected Recurring Bills</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {bills.map((bill) => (
              <div key={`${bill.category}-${bill.label}`} className="flex items-center px-6 py-3">
                <span className="text-xs text-gray-400 w-28 shrink-0">{bill.category}</span>
                <span className="text-sm text-gray-800 flex-1">{bill.label}</span>
                <span className="font-semibold text-gray-900">{fmt(bill.amount)}/mo</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between px-6 py-3 bg-amber-50 border-t border-amber-100">
            <span className="font-semibold text-amber-800">Total Monthly Fixed Costs</span>
            <span className="font-bold text-amber-800">{fmt(recurringTotal)}</span>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <h2 className="font-semibold text-gray-800">Toggle Recurring for Each Item</h2>
        {catKeys.map(({ key, label }) => {
          const items = state[key] as LineItem[];
          return (
            <div key={key} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="px-5 py-3 bg-gray-50 border-b border-gray-100">
                <h3 className="font-medium text-gray-700 text-sm">{label}</h3>
              </div>
              <div className="divide-y divide-gray-100">
                {items.map((item, i) => (
                  <div key={i} className="flex items-center justify-between px-5 py-3">
                    <span className="text-sm text-gray-700">{item.label}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-500">{fmt(item.budgeted)}</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={!!item.isRecurring}
                          onChange={(e) => setLineItem(key, i, 'isRecurring', e.target.checked)}
                          className="sr-only peer" />
                        <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:bg-amber-500 transition-colors" />
                        <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow peer-checked:translate-x-4 transition-transform" />
                      </label>
                      <span className={`text-xs font-medium w-16 ${item.isRecurring ? 'text-amber-600' : 'text-gray-400'}`}>
                        {item.isRecurring ? 'Recurring' : 'Variable'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
