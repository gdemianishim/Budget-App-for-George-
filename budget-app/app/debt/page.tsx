'use client';
import { useBudgetStore } from '@/lib/store';
import { getTotals } from '@/lib/calculations';
import { DebtItem } from '@/types/budget';

const fmt = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
const pct = (n: number) => `${n.toFixed(2)}%`;

export default function DebtPage() {
  const { debt, income, extraIncome, setDebtItem } = useBudgetStore();
  const state = useBudgetStore();
  const totals = getTotals(state);
  const totalBalance = debt.reduce((a, d) => a + d.balance, 0);
  const totalMin = totals.debtMinPayments;
  const dti = totals.totalIncome > 0 ? (totalMin / totals.totalIncome) * 100 : 0;

  const update = (i: number, field: keyof DebtItem, raw: string) => {
    const value = field === 'label' ? raw : parseFloat(raw) || 0;
    setDebtItem(i, field, value);
  };

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Debt Tracker</h1>
        <p className="text-gray-500 text-sm mt-1">Monitor balances, interest rates, and minimum payments</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <p className="text-xs text-gray-500">Total Debt Balance</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{fmt(totalBalance)}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <p className="text-xs text-gray-500">Total Min. Payments/mo</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{fmt(totalMin)}</p>
        </div>
        <div className={`rounded-2xl border p-5 ${dti > 20 ? 'bg-red-50 border-red-200' : 'bg-emerald-50 border-emerald-200'}`}>
          <p className="text-xs text-gray-500">Debt-to-Income Ratio</p>
          <p className={`text-2xl font-bold mt-1 ${dti > 20 ? 'text-red-700' : 'text-emerald-700'}`}>{pct(dti)}</p>
          <p className="text-xs mt-1 text-gray-400">{dti > 20 ? 'High — aim below 20%' : 'Healthy range'}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="grid grid-cols-5 gap-3 px-6 py-3 bg-gray-50 text-xs font-semibold text-gray-400 uppercase tracking-wider">
          <span className="col-span-2">Debt Name</span>
          <span>Balance ($)</span>
          <span>APY (%)</span>
          <span>Min. Payment ($)</span>
        </div>
        <div className="divide-y divide-gray-100">
          {debt.map((item, i) => (
            <div key={i} className="grid grid-cols-5 gap-3 items-center px-6 py-3">
              <input
                value={item.label}
                onChange={(e) => update(i, 'label', e.target.value)}
                className="col-span-2 border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
              <input
                type="number" min="0" step="0.01"
                value={item.balance || ''}
                placeholder="0.00"
                onChange={(e) => update(i, 'balance', e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-right focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
              <input
                type="number" min="0" step="0.01" max="100"
                value={item.apy || ''}
                placeholder="0.00"
                onChange={(e) => update(i, 'apy', e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-right focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
              <input
                type="number" min="0" step="0.01"
                value={item.minPayment || ''}
                placeholder="0.00"
                onChange={(e) => update(i, 'minPayment', e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-right focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-5 gap-3 px-6 py-4 bg-gray-50 border-t border-gray-200">
          <span className="col-span-2 text-sm font-semibold text-gray-700">Total</span>
          <span className="text-sm font-bold text-gray-900 text-right">{fmt(totalBalance)}</span>
          <span />
          <span className="text-sm font-bold text-gray-900 text-right">{fmt(totalMin)}</span>
        </div>
      </div>

      {debt.some(d => d.balance > 0 && d.apy > 0) && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
          <p className="font-semibold text-amber-800 text-sm">Debt Payoff Strategy</p>
          <p className="text-sm text-gray-600 mt-1">
            Focus extra payments on <strong>{[...debt].filter(d => d.balance > 0 && d.apy > 0).sort((a, b) => b.apy - a.apy)[0]?.label}</strong> — it has the highest APY and costs you the most in interest.
          </p>
        </div>
      )}
    </div>
  );
}
