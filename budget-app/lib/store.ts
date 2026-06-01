'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { BudgetState, LineItem, DebtItem, Goal, Asset, Liability } from '@/types/budget';
import { DEFAULT_BUDGET } from './defaults';

type Category = keyof Omit<BudgetState, 'income' | 'extraIncome' | 'payFrequency' | 'debt' | 'goals' | 'assets' | 'liabilities' | 'scenarioIncomeChange' | 'scenarioExpenseChange'>;

interface BudgetStore extends BudgetState {
  setIncome: (income: number) => void;
  setExtraIncome: (extraIncome: number) => void;
  setPayFrequency: (freq: number) => void;
  setLineItem: (category: Category, index: number, field: keyof LineItem, value: number | boolean) => void;
  setDebtItem: (index: number, field: keyof DebtItem, value: number | string) => void;
  setGoal: (id: string, updates: Partial<Goal>) => void;
  addGoal: (goal: Goal) => void;
  removeGoal: (id: string) => void;
  setAsset: (index: number, field: keyof Asset, value: number | string) => void;
  setLiability: (index: number, field: keyof Liability, value: number | string) => void;
  setScenario: (incomeChange: number, expenseChange: number) => void;
  reset: () => void;
}

export const useBudgetStore = create<BudgetStore>()(
  persist(
    (set) => ({
      ...DEFAULT_BUDGET,

      setIncome: (income) => set({ income }),
      setExtraIncome: (extraIncome) => set({ extraIncome }),
      setPayFrequency: (payFrequency) => set({ payFrequency }),

      setLineItem: (category, index, field, value) =>
        set((state) => {
          const items = [...(state[category] as LineItem[])];
          items[index] = { ...items[index], [field]: value };
          return { [category]: items };
        }),

      setDebtItem: (index, field, value) =>
        set((state) => {
          const debt = [...state.debt];
          debt[index] = { ...debt[index], [field]: value };
          return { debt };
        }),

      setGoal: (id, updates) =>
        set((state) => ({
          goals: state.goals.map((g) => (g.id === id ? { ...g, ...updates } : g)),
        })),

      addGoal: (goal) =>
        set((state) => ({ goals: [...state.goals, goal] })),

      removeGoal: (id) =>
        set((state) => ({ goals: state.goals.filter((g) => g.id !== id) })),

      setAsset: (index, field, value) =>
        set((state) => {
          const assets = [...state.assets];
          assets[index] = { ...assets[index], [field]: value };
          return { assets };
        }),

      setLiability: (index, field, value) =>
        set((state) => {
          const liabilities = [...state.liabilities];
          liabilities[index] = { ...liabilities[index], [field]: value };
          return { liabilities };
        }),

      setScenario: (scenarioIncomeChange, scenarioExpenseChange) =>
        set({ scenarioIncomeChange, scenarioExpenseChange }),

      reset: () => set(DEFAULT_BUDGET),
    }),
    { name: 'george-budget-v2' }
  )
);
