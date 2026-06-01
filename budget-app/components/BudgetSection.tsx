'use client';
import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { LineItem } from '@/types/budget';

interface Props {
  title: string;
  items: LineItem[];
  onUpdate: (index: number, field: 'budgeted' | 'spent', value: number) => void;
}

const fmt = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);

export default function BudgetSection({ title, items, onUpdate }: Props) {
  const [open, setOpen] = useState(true);

  const totalBudgeted = items.reduce((a, i) => a + i.budgeted, 0);
  const totalSpent = items.reduce((a, i) => a + i.spent, 0);
  const totalDiff = totalBudgeted - totalSpent;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <button
        className="w-full flex items-center justify-between px-5 py-4 bg-gray-50 hover:bg-gray-100 transition-colors"
        onClick={() => setOpen(!open)}
      >
        <span className="font-semibold text-gray-800">{title}</span>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-gray-500">Budget: <span className="font-medium text-gray-800">{fmt(totalBudgeted)}</span></span>
          <span className="text-gray-500">Spent: <span className="font-medium text-gray-800">{fmt(totalSpent)}</span></span>
          <span className={`font-semibold ${totalDiff >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>{fmt(totalDiff)}</span>
          {open ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
        </div>
      </button>

      {open && (
        <div className="divide-y divide-gray-100">
          <div className="grid grid-cols-4 gap-3 px-5 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            <span>Item</span>
            <span>Budgeted ($)</span>
            <span>Spent ($)</span>
            <span>Difference</span>
          </div>
          {items.map((item, i) => {
            const diff = item.budgeted - item.spent;
            return (
              <div key={i} className="grid grid-cols-4 gap-3 items-center px-5 py-3">
                <span className="text-sm text-gray-700">{item.label}</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={item.budgeted || ''}
                  placeholder="0.00"
                  onChange={(e) => onUpdate(i, 'budgeted', parseFloat(e.target.value) || 0)}
                  className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-right focus:outline-none focus:ring-2 focus:ring-blue-300 w-full"
                />
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={item.spent || ''}
                  placeholder="0.00"
                  onChange={(e) => onUpdate(i, 'spent', parseFloat(e.target.value) || 0)}
                  className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-right focus:outline-none focus:ring-2 focus:ring-blue-300 w-full"
                />
                <span className={`text-sm font-medium ${diff >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  {fmt(diff)}
                </span>
              </div>
            );
          })}
          <div className="grid grid-cols-4 gap-3 px-5 py-3 bg-gray-50">
            <span className="text-sm font-semibold text-gray-700">Subtotal</span>
            <span className="text-sm font-semibold text-right text-gray-800">{fmt(totalBudgeted)}</span>
            <span className="text-sm font-semibold text-right text-gray-800">{fmt(totalSpent)}</span>
            <span className={`text-sm font-semibold ${totalDiff >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>{fmt(totalDiff)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
