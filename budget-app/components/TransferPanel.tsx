import { ArrowRight } from 'lucide-react';

interface Props {
  operatingBalance: number;
  expensePerCheck: number;
  toolsPerCheck: number;
  savingsPerCheck: number;
  payFrequency: number;
}

const fmt = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);

const freqLabel: Record<number, string> = { 1: 'monthly', 2: 'per check (bi-weekly)', 4: 'per check (weekly)' };

export default function TransferPanel({ operatingBalance, expensePerCheck, toolsPerCheck, savingsPerCheck, payFrequency }: Props) {
  const label = freqLabel[payFrequency] || 'per check';
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <h3 className="font-semibold text-gray-800 mb-4">Transfer Allocations</h3>
      <p className="text-xs text-gray-400 mb-5">How to split each paycheck across accounts</p>
      <div className="space-y-4">
        {[
          { label: 'Operating Account', value: operatingBalance, desc: 'Running balance after all expenses', color: 'text-blue-600 bg-blue-50' },
          { label: 'Expense Account', value: expensePerCheck, desc: `Living expenses ${label}`, color: 'text-purple-600 bg-purple-50' },
          { label: 'Tools Account', value: toolsPerCheck, desc: `Business tools ${label}`, color: 'text-amber-600 bg-amber-50' },
          { label: 'Savings Account', value: savingsPerCheck, desc: `Savings ${label}`, color: 'text-emerald-600 bg-emerald-50' },
        ].map(({ label, value, desc, color }) => (
          <div key={label} className="flex items-center gap-3">
            <ArrowRight size={16} className="text-gray-300 shrink-0" />
            <div className={`rounded-xl px-4 py-3 flex-1 flex justify-between items-center ${color.split(' ')[1]}`}>
              <div>
                <p className="text-sm font-semibold text-gray-800">{label}</p>
                <p className="text-xs text-gray-500">{desc}</p>
              </div>
              <span className={`text-lg font-bold ${color.split(' ')[0]}`}>{fmt(value)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
