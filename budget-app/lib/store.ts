'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { BudgetState, LineItem, DebtItem } from '@/types/budget';
import { DEFAULT_BUDGET } from './defaults';

type Category = keyof Omit<BudgetState, 'income' | 'extraIncome' | 'payFrequency' | 'debt'>;

interface BudgetStore extends BudgetState {
  setIncome: (income: number) => void;
  setExtraIncome: (extraIncome: number) => void;
  setPayFrequency: (freq: number) => void;
  setLineItem: (category: Category, index: number, field: 'budgeted' | 'spent', value: number) => void;
  setDebtItem: (index: number, field: keyof DebtItem, value: number | string) => void;
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

      reset: () => set(DEFAULT_BUDGET),
    }),
    { name: 'george-budget-v1' }
  )
);
