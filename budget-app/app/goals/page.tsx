'use client';
import { useState } from 'react';
import { useBudgetStore } from '@/lib/store';
import { getTotals } from '@/lib/calculations';
import { Goal } from '@/types/budget';
import { Plus, Trash2 } from 'lucide-react';

const fmt = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);

const categoryColors: Record<Goal['category'], string> = {
  emergency: '#10b981', savings: '#6366f1', debt: '#ef4444',
  investment: '#3b82f6', purchase: '#f59e0b', business: '#8b5cf6',
};

const categoryEmoji: Record<Goal['category'], string> = {
  emergency: '🛡️', savings: '🏦', debt: '💳',
  investment: '📈', purchase: '🛒', business: '🚀',
};

export default function GoalsPage() {
  const { goals, setGoal, addGoal, removeGoal } = useBudgetStore();
  const state = useBudgetStore();
  const totals = getTotals(state);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Omit<Goal, 'id'>>({
    name: '', targetAmount: 0, currentAmount: 0,
    targetDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    category: 'savings', color: '#6366f1',
  });

  const handleAdd = () => {
    if (!form.name || form.targetAmount <= 0) return;
    addGoal({ ...form, id: Date.now().toString(), color: categoryColors[form.category] });
    setShowForm(false);
    setForm({ name: '', targetAmount: 0, currentAmount: 0, targetDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10), category: 'savings', color: '#6366f1' });
  };

  const totalGoalAmount = goals.reduce((a, g) => a + g.targetAmount, 0);
  const totalProgress = goals.reduce((a, g) => a + g.currentAmount, 0);

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Goal-Based Planning</h1>
          <p className="text-gray-500 text-sm mt-1">Set financial goals and track progress toward each one</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors">
          <Plus size={16} /> Add Goal
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-5">
          <p className="text-xs text-indigo-700 font-medium">Total Goals Target</p>
          <p className="text-2xl font-bold text-indigo-800 mt-1">{fmt(totalGoalAmount)}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-5">
          <p className="text-xs text-gray-500">Total Saved Toward Goals</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{fmt(totalProgress)}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-5">
          <p className="text-xs text-gray-500">Monthly Surplus Available</p>
          <p className={`text-2xl font-bold mt-1 ${totals.actuallyLeft >= 0 ? 'text-emerald-700' : 'text-red-600'}`}>{fmt(totals.actuallyLeft)}</p>
        </div>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl border border-indigo-200 p-6">
          <h3 className="font-semibold text-gray-800 mb-4">New Goal</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="text-xs font-medium text-gray-500 block mb-1">Goal Name</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Pay off credit card" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1">Target Amount ($)</label>
              <input type="number" min="0" value={form.targetAmount || ''} onChange={(e) => setForm({ ...form, targetAmount: parseFloat(e.target.value) || 0 })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1">Current Amount ($)</label>
              <input type="number" min="0" value={form.currentAmount || ''} onChange={(e) => setForm({ ...form, currentAmount: parseFloat(e.target.value) || 0 })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1">Target Date</label>
              <input type="date" value={form.targetDate} onChange={(e) => setForm({ ...form, targetDate: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1">Category</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as Goal['category'] })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300">
                <option value="emergency">Emergency Fund</option>
                <option value="savings">Savings</option>
                <option value="debt">Debt Payoff</option>
                <option value="investment">Investment</option>
                <option value="purchase">Purchase</option>
                <option value="business">Business</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={handleAdd} className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors">Save Goal</button>
            <button onClick={() => setShowForm(false)} className="bg-gray-100 text-gray-700 px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors">Cancel</button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {goals.map((goal) => {
          const progress = goal.targetAmount > 0 ? Math.min((goal.currentAmount / goal.targetAmount) * 100, 100) : 0;
          const remaining = goal.targetAmount - goal.currentAmount;
          const daysLeft = Math.max(0, Math.ceil((new Date(goal.targetDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
          const monthsLeft = Math.ceil(daysLeft / 30);
          const requiredPerMonth = monthsLeft > 0 && remaining > 0 ? remaining / monthsLeft : 0;
          const color = categoryColors[goal.category];

          return (
            <div key={goal.id} className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{categoryEmoji[goal.category]}</span>
                  <div>
                    <h3 className="font-semibold text-gray-800">{goal.name}</h3>
                    <p className="text-xs text-gray-400">{daysLeft > 0 ? `${daysLeft} days left` : 'Past due'} · {new Date(goal.targetDate).toLocaleDateString()}</p>
                  </div>
                </div>
                <button onClick={() => removeGoal(goal.id)} className="text-gray-300 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
              </div>

              <div className="mb-3">
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-gray-500">{fmt(goal.currentAmount)} saved</span>
                  <span className="font-semibold text-gray-800">{fmt(goal.targetAmount)} goal</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${progress}%`, backgroundColor: color }} />
                </div>
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>{progress.toFixed(0)}% complete</span>
                  <span>{fmt(remaining)} remaining</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400">Current Amount</p>
                  <input type="number" min="0" value={goal.currentAmount || ''} placeholder="0.00"
                    onChange={(e) => setGoal(goal.id, { currentAmount: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-transparent text-sm font-semibold text-gray-900 focus:outline-none mt-0.5"
                  />
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400">Required per Month</p>
                  <p className="text-sm font-semibold text-gray-900 mt-0.5" style={{ color: requiredPerMonth > totals.actuallyLeft ? '#ef4444' : undefined }}>
                    {requiredPerMonth > 0 ? fmt(requiredPerMonth) : '—'}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
