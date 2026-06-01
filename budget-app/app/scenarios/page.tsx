'use client';
import { useBudgetStore } from '@/lib/store';
import { getScenarioTotals, getHealthScore } from '@/lib/calculations';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const fmt = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);

const presets = [
  { label: 'Income +20%', income: 20, expense: 0 },
  { label: 'Income -20%', income: -20, expense: 0 },
  { label: 'Expenses +15%', income: 0, expense: 15 },
  { label: 'Expenses -10%', income: 0, expense: -10 },
  { label: 'Best Case', income: 30, expense: -10 },
  { label: 'Worst Case', income: -30, expense: 20 },
];

export default function ScenariosPage() {
  const state = useBudgetStore();
  const { setScenario } = state;
  const { base, scenarioIncome, scenarioExpenses, scenarioLeft, incomeDelta, expenseDelta } = getScenarioTotals(state);

  const barData = [
    { name: 'Income', base: base.totalIncome, scenario: scenarioIncome },
    { name: 'Expenses', base: base.totalBudgeted, scenario: scenarioExpenses },
    { name: 'Left Over', base: base.actuallyLeft, scenario: scenarioLeft },
  ];

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Scenario Modeling</h1>
        <p className="text-gray-500 text-sm mt-1">Explore "what if" situations to stress-test your finances</p>
      </div>

      {/* Preset Scenarios */}
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Quick Presets</p>
        <div className="grid grid-cols-3 gap-3">
          {presets.map((p) => (
            <button key={p.label} onClick={() => setScenario(p.income, p.expense)}
              className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 hover:border-indigo-400 hover:text-indigo-700 transition-colors text-left">
              <p className="font-semibold">{p.label}</p>
              <p className="text-xs text-gray-400 mt-0.5">
                {p.income !== 0 && `Income ${p.income > 0 ? '+' : ''}${p.income}%`}
                {p.income !== 0 && p.expense !== 0 && ' · '}
                {p.expense !== 0 && `Expenses ${p.expense > 0 ? '+' : ''}${p.expense}%`}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Sliders */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="font-semibold text-gray-800 mb-5">Custom Scenario</h2>
        <div className="space-y-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-gray-700">Income Change</label>
              <span className={`text-sm font-bold px-2 py-0.5 rounded-lg ${state.scenarioIncomeChange >= 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                {state.scenarioIncomeChange >= 0 ? '+' : ''}{state.scenarioIncomeChange}%
              </span>
            </div>
            <input type="range" min="-50" max="100" step="5" value={state.scenarioIncomeChange}
              onChange={(e) => setScenario(parseInt(e.target.value), state.scenarioExpenseChange)}
              className="w-full accent-indigo-600" />
            <div className="flex justify-between text-xs text-gray-400 mt-1"><span>-50%</span><span>0</span><span>+100%</span></div>
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-gray-700">Expense Change</label>
              <span className={`text-sm font-bold px-2 py-0.5 rounded-lg ${state.scenarioExpenseChange <= 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                {state.scenarioExpenseChange >= 0 ? '+' : ''}{state.scenarioExpenseChange}%
              </span>
            </div>
            <input type="range" min="-50" max="100" step="5" value={state.scenarioExpenseChange}
              onChange={(e) => setScenario(state.scenarioIncomeChange, parseInt(e.target.value))}
              className="w-full accent-indigo-600" />
            <div className="flex justify-between text-xs text-gray-400 mt-1"><span>-50%</span><span>0</span><span>+100%</span></div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Scenario Income', value: scenarioIncome, delta: incomeDelta, good: incomeDelta >= 0 },
          { label: 'Scenario Expenses', value: scenarioExpenses, delta: expenseDelta, good: expenseDelta <= 0 },
          { label: 'Money Left Over', value: scenarioLeft, delta: scenarioLeft - base.actuallyLeft, good: scenarioLeft >= base.actuallyLeft },
        ].map(({ label, value, delta, good }) => (
          <div key={label} className={`rounded-2xl border p-5 ${good ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
            <p className="text-xs text-gray-500">{label}</p>
            <p className={`text-2xl font-bold mt-1 ${good ? 'text-emerald-700' : 'text-red-700'}`}>{fmt(value)}</p>
            <p className={`text-xs mt-1 font-medium ${good ? 'text-emerald-600' : 'text-red-600'}`}>
              {delta >= 0 ? '+' : ''}{fmt(delta)} vs baseline
            </p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="font-semibold text-gray-800 mb-4">Baseline vs Scenario</h2>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${v}`} />
            <Tooltip formatter={(v) => fmt(Number(v))} />
            <Legend />
            <Bar dataKey="base" fill="#6366f1" name="Baseline" radius={[4, 4, 0, 0]} />
            <Bar dataKey="scenario" fill="#10b981" name="Scenario" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {scenarioLeft < 0 && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
          <p className="font-semibold text-red-800">⚠️ Danger Zone</p>
          <p className="text-sm text-red-700 mt-1">In this scenario, you would be <strong>{fmt(Math.abs(scenarioLeft))}</strong> short each month. Consider cutting recreation, food, and personal care first.</p>
        </div>
      )}
      {scenarioLeft >= 0 && scenarioLeft > base.actuallyLeft * 1.2 && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5">
          <p className="font-semibold text-emerald-800">🚀 Growth Opportunity</p>
          <p className="text-sm text-emerald-700 mt-1">In this scenario, you'd have <strong>{fmt(scenarioLeft)}</strong> left each month. Route the extra <strong>{fmt(scenarioLeft - base.actuallyLeft)}</strong> to investments or goals.</p>
        </div>
      )}
    </div>
  );
}
