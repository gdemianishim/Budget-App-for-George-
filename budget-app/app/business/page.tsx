'use client';
import { useBudgetStore } from '@/lib/store';
import { getTotals, getTransferAllocations } from '@/lib/calculations';
import BudgetSection from '@/components/BudgetSection';
import TransferPanel from '@/components/TransferPanel';
import { LineItem } from '@/types/budget';

const fmt = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);

export default function BusinessPage() {
  const state = useBudgetStore();
  const { setLineItem } = state;
  const totals = getTotals(state);
  const transfers = getTransferAllocations(state);
  const businessBudgeted = state.businessTools.reduce((a, i) => a + i.budgeted, 0);
  const businessRatio = totals.totalIncome > 0 ? (businessBudgeted / totals.totalIncome) * 100 : 0;

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Business Tools</h1>
        <p className="text-gray-500 text-sm mt-1">Track business expenses and per-paycheck transfer allocations</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
          <p className="text-xs text-amber-700 font-medium">Monthly Business Budget</p>
          <p className="text-2xl font-bold text-amber-800 mt-1">{fmt(businessBudgeted)}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-5">
          <p className="text-xs text-gray-500">% of Income</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{businessRatio.toFixed(1)}%</p>
          <p className="text-xs text-gray-400 mt-0.5">of total monthly income</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-5">
          <p className="text-xs text-gray-500">ROI Potential</p>
          <p className="text-sm text-gray-700 mt-2 font-medium">Scale income to cover costs</p>
          <p className="text-xs text-gray-400 mt-0.5">Network marketing growth model</p>
        </div>
      </div>

      <BudgetSection
        title="Business Tools"
        items={state.businessTools as LineItem[]}
        onUpdate={(index, field, value) => setLineItem('businessTools', index, field, value)}
      />

      <TransferPanel
        operatingBalance={transfers.operatingBalance}
        expensePerCheck={transfers.expensePerCheck}
        toolsPerCheck={transfers.toolsPerCheck}
        savingsPerCheck={transfers.savingsPerCheck}
        payFrequency={state.payFrequency}
      />

      <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-6">
        <h3 className="font-semibold text-indigo-800 mb-2">The Plan</h3>
        <p className="text-sm text-gray-600">
          Each paycheck, transfer your funds into dedicated accounts: <strong>Operating</strong> covers your running balance,
          the <strong>Expense Account</strong> handles living expenses, the <strong>Tools Account</strong> covers business investments,
          and <strong>Savings</strong> builds your financial foundation. Keeping these separate makes it impossible to accidentally spend business money on personal items.
        </p>
        <div className="grid grid-cols-2 gap-3 mt-4 text-sm">
          <div className="bg-white rounded-xl p-3 border border-indigo-100">
            <span className="text-indigo-700 font-medium">Step 1:</span>
            <span className="text-gray-600 ml-1">Get paid → deposit to operating account</span>
          </div>
          <div className="bg-white rounded-xl p-3 border border-indigo-100">
            <span className="text-indigo-700 font-medium">Step 2:</span>
            <span className="text-gray-600 ml-1">Transfer expense allocation to expense account</span>
          </div>
          <div className="bg-white rounded-xl p-3 border border-indigo-100">
            <span className="text-indigo-700 font-medium">Step 3:</span>
            <span className="text-gray-600 ml-1">Transfer tools allocation to tools account</span>
          </div>
          <div className="bg-white rounded-xl p-3 border border-indigo-100">
            <span className="text-indigo-700 font-medium">Step 4:</span>
            <span className="text-gray-600 ml-1">Transfer savings allocation to savings account</span>
          </div>
        </div>
      </div>
    </div>
  );
}
