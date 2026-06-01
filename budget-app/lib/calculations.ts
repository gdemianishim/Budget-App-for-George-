import { BudgetState, CategorySummary, Insight, LineItem, NextBestAction } from '@/types/budget';

const sumItems = (items: LineItem[]) => ({
  budgeted: items.reduce((a, i) => a + i.budgeted, 0),
  spent: items.reduce((a, i) => a + i.spent, 0),
});

export function getCategorySummaries(s: BudgetState): CategorySummary[] {
  const cats: [string, LineItem[]][] = [
    ['Tithing / Charity', s.tithing],
    ['Savings', s.savings],
    ['Household', s.household],
    ['Utilities', s.utilities],
    ['Personal Care', s.personalCare],
    ['Insurance', s.insurance],
    ['Business Tools', s.businessTools],
    ['Recreation', s.recreation],
    ['Transportation', s.transportation],
    ['Food / Household', s.foodHousehold],
    ['Medical / Health', s.medicalHealth],
  ];
  return cats.map(([name, items]) => ({ name, ...sumItems(items) }));
}

export function getTotals(s: BudgetState) {
  const summaries = getCategorySummaries(s);
  const debtMinPayments = s.debt.reduce((a, d) => a + d.minPayment, 0);
  const totalIncome = s.income + s.extraIncome;
  const totalBudgeted = summaries.reduce((a, c) => a + c.budgeted, 0) + debtMinPayments;
  const totalSpent = summaries.reduce((a, c) => a + c.spent, 0) + debtMinPayments;
  const businessBudgeted = sumItems(s.businessTools).budgeted;
  const savingsBudgeted = sumItems(s.savings).budgeted;

  return {
    totalIncome,
    totalBudgeted,
    totalSpent,
    totalDifference: totalBudgeted - totalSpent,
    shouldHaveLeft: totalIncome - totalBudgeted,
    actuallyLeft: totalIncome - totalSpent,
    debtMinPayments,
    businessBudgeted,
    savingsBudgeted,
  };
}

export function getTransferAllocations(s: BudgetState) {
  const freq = s.payFrequency || 1;
  const totalIncome = s.income + s.extraIncome;
  const totals = getTotals(s);
  const businessTools = totals.businessBudgeted;
  const expensePerCheck = (totals.totalBudgeted - businessTools) / freq;
  const toolsPerCheck = businessTools / freq;
  const savingsPerCheck = totals.savingsBudgeted / freq;
  const operatingBalance = totalIncome - totals.totalBudgeted;

  return {
    operatingBalance: operatingBalance > 0 ? operatingBalance : 0,
    expensePerCheck,
    toolsPerCheck,
    savingsPerCheck,
  };
}

export function getHealthScore(s: BudgetState): number {
  const { totalIncome, totalBudgeted, savingsBudgeted, debtMinPayments } = getTotals(s);
  if (totalIncome === 0) return 0;

  const savingsRate = savingsBudgeted / totalIncome;
  const debtRatio = debtMinPayments / totalIncome;
  const margin = (totalIncome - totalBudgeted) / totalIncome;

  let score = 50;
  score += Math.min(savingsRate * 200, 25);
  score -= Math.min(debtRatio * 200, 25);
  score += Math.min(margin * 100, 25);
  score = Math.max(0, Math.min(100, Math.round(score)));
  return score;
}

export function getNetWorth(s: BudgetState) {
  const totalAssets = s.assets.reduce((a, i) => a + i.value, 0);
  const totalLiabilities = s.liabilities.reduce((a, i) => a + i.balance, 0) +
    s.debt.reduce((a, d) => a + d.balance, 0);
  return { totalAssets, totalLiabilities, netWorth: totalAssets - totalLiabilities };
}

export function getCashFlowForecast(s: BudgetState, months = 12) {
  const { totalIncome, totalBudgeted } = getTotals(s);
  const monthlySavings = totalIncome - totalBudgeted;
  const savingsBudgeted = s.savings.reduce((a, i) => a + i.budgeted, 0);
  const efBudgeted = s.savings[0]?.budgeted ?? 0;

  return Array.from({ length: months }, (_, i) => {
    const month = new Date();
    month.setMonth(month.getMonth() + i + 1);
    const label = month.toLocaleString('default', { month: 'short', year: '2-digit' });
    const cumulativeSavings = savingsBudgeted * (i + 1);
    const cashBalance = monthlySavings * (i + 1);
    const emergencyFund = efBudgeted * (i + 1);
    return { label, income: totalIncome, expenses: totalBudgeted, net: monthlySavings, cumulative: cashBalance, emergencyFund };
  });
}

export function getScenarioTotals(s: BudgetState) {
  const base = getTotals(s);
  const incomeMultiplier = 1 + s.scenarioIncomeChange / 100;
  const expenseMultiplier = 1 + s.scenarioExpenseChange / 100;
  const scenarioIncome = base.totalIncome * incomeMultiplier;
  const scenarioExpenses = base.totalBudgeted * expenseMultiplier;
  return {
    base,
    scenarioIncome,
    scenarioExpenses,
    scenarioLeft: scenarioIncome - scenarioExpenses,
    incomeDelta: scenarioIncome - base.totalIncome,
    expenseDelta: scenarioExpenses - base.totalBudgeted,
  };
}

export function getRecurringBills(s: BudgetState): { label: string; amount: number; category: string }[] {
  const cats: [string, LineItem[]][] = [
    ['Household', s.household],
    ['Utilities', s.utilities],
    ['Personal Care', s.personalCare],
    ['Insurance', s.insurance],
    ['Business Tools', s.businessTools],
    ['Transportation', s.transportation],
  ];
  const bills: { label: string; amount: number; category: string }[] = [];
  for (const [cat, items] of cats) {
    for (const item of items) {
      if (item.isRecurring && item.budgeted > 0) {
        bills.push({ label: item.label, amount: item.budgeted, category: cat });
      }
    }
  }
  return bills.sort((a, b) => b.amount - a.amount);
}

export function getInsights(s: BudgetState): Insight[] {
  const { totalIncome, totalBudgeted, savingsBudgeted, debtMinPayments, actuallyLeft, businessBudgeted } = getTotals(s);
  const insights: Insight[] = [];
  if (totalIncome === 0) return insights;

  const savingsRate = (savingsBudgeted / totalIncome) * 100;
  const debtRatio = (debtMinPayments / totalIncome) * 100;
  const businessRatio = (businessBudgeted / totalIncome) * 100;

  if (savingsRate < 10) {
    insights.push({ type: 'warning', title: 'Low Savings Rate', body: `You're saving ${savingsRate.toFixed(1)}% of income. Aim for at least 10–20% to build a solid financial foundation.` });
  } else if (savingsRate >= 20) {
    insights.push({ type: 'success', title: 'Strong Savings Rate', body: `Excellent! You're saving ${savingsRate.toFixed(1)}% of income — well above the recommended 20%.` });
  }

  if (debtRatio > 20) {
    insights.push({ type: 'danger', title: 'High Debt Load', body: `Minimum debt payments are ${debtRatio.toFixed(1)}% of income. Focus on paying off high-APY balances first.` });
  } else if (debtMinPayments > 0) {
    insights.push({ type: 'info', title: 'Debt Under Control', body: `Debt payments are ${debtRatio.toFixed(1)}% of income — within the healthy range. Keep going!` });
  }

  if (actuallyLeft > 0) {
    insights.push({ type: 'info', title: `$${actuallyLeft.toFixed(2)} Unallocated`, body: `You have $${actuallyLeft.toFixed(2)} left over each month. Consider routing it to your Emergency Fund or Investment Account.` });
  } else if (actuallyLeft < 0) {
    insights.push({ type: 'danger', title: 'Overspending Alert', body: `You're spending $${Math.abs(actuallyLeft).toFixed(2)} more than you earn. Review your expenses and cut discretionary categories first.` });
  }

  if (businessRatio > 50) {
    insights.push({ type: 'warning', title: 'Business Costs Are High', body: `Business tools represent ${businessRatio.toFixed(1)}% of income. Make sure your business revenue covers these costs or plan to scale income.` });
  } else if (businessRatio > 0) {
    insights.push({ type: 'success', title: 'Business Investment On Track', body: `You're investing ${businessRatio.toFixed(1)}% of income in business tools — a manageable rate for growing your network marketing business.` });
  }

  const efBudgeted = s.savings[0]?.budgeted ?? 0;
  const monthsToGoal = efBudgeted > 0 ? Math.ceil((totalBudgeted * 3) / efBudgeted) : 0;
  if (efBudgeted > 0 && monthsToGoal > 0) {
    insights.push({ type: 'info', title: 'Emergency Fund Timeline', body: `At your current rate, you'll reach a 3-month emergency fund in approximately ${monthsToGoal} months. Stay consistent!` });
  }

  if (totalBudgeted > totalIncome) {
    insights.push({ type: 'danger', title: 'Budget Exceeds Income', body: `Your planned expenses ($${totalBudgeted.toFixed(2)}) exceed your income ($${totalIncome.toFixed(2)}). Reduce discretionary spending.` });
  }

  return insights;
}

export function getNextBestActions(s: BudgetState): NextBestAction[] {
  const { totalIncome, totalBudgeted, savingsBudgeted, debtMinPayments, actuallyLeft } = getTotals(s);
  const actions: NextBestAction[] = [];

  if (totalIncome === 0) {
    actions.push({ priority: 1, icon: '💰', title: 'Enter Your Income', description: 'Go to the Budget page and enter your monthly income to unlock all recommendations.', impact: 'high', category: 'Setup' });
    return actions;
  }

  const savingsRate = savingsBudgeted / totalIncome;
  const highestApyDebt = [...s.debt].filter(d => d.balance > 0 && d.apy > 0).sort((a, b) => b.apy - a.apy)[0];
  const efBudgeted = s.savings[0]?.budgeted ?? 0;
  const efGoal = totalBudgeted * 3;

  if (actuallyLeft > 50) {
    actions.push({ priority: 1, icon: '🚀', title: `Put $${actuallyLeft.toFixed(0)}/mo to work`, description: `You have $${actuallyLeft.toFixed(2)} unallocated each month. Route it to your highest-priority goal.`, impact: 'high', category: 'Cash Flow' });
  }

  if (savingsRate < 0.1) {
    actions.push({ priority: 2, icon: '🏦', title: 'Boost Emergency Fund', description: `Increase your emergency fund contribution to at least $${(totalIncome * 0.1).toFixed(0)}/mo (10% of income).`, impact: 'high', category: 'Savings' });
  }

  if (highestApyDebt) {
    actions.push({ priority: 3, icon: '💳', title: `Pay Down ${highestApyDebt.label}`, description: `At ${highestApyDebt.apy}% APY, this debt costs you the most. Pay beyond the minimum to save on interest.`, impact: 'high', category: 'Debt' });
  }

  if (efBudgeted > 0 && efGoal > 0) {
    const months = Math.ceil(efGoal / efBudgeted);
    actions.push({ priority: 4, icon: '🛡️', title: '3-Month Safety Net', description: `You're on track — ${months} months to a full 3-month emergency fund at current savings rate.`, impact: 'medium', category: 'Savings' });
  }

  const businessRatio = getTotals(s).businessBudgeted / totalIncome;
  if (businessRatio > 0.3) {
    actions.push({ priority: 5, icon: '📈', title: 'Scale Business Revenue', description: `Business costs are ${(businessRatio * 100).toFixed(0)}% of income. Focus on growing income to make tools a smaller % of revenue.`, impact: 'high', category: 'Business' });
  }

  if (s.goals.some(g => g.currentAmount < g.targetAmount * 0.1)) {
    actions.push({ priority: 6, icon: '🎯', title: 'Jump-Start Your Goals', description: 'Several goals have no progress yet. Allocate even $25/mo per goal to build momentum.', impact: 'medium', category: 'Goals' });
  }

  const recurringTotal = getRecurringBills(s).reduce((a, b) => a + b.amount, 0);
  if (recurringTotal > totalIncome * 0.5) {
    actions.push({ priority: 7, icon: '🔁', title: 'Review Recurring Bills', description: `Recurring bills total $${recurringTotal.toFixed(0)}/mo — over 50% of income. Audit subscriptions and fixed costs.`, impact: 'medium', category: 'Bills' });
  }

  actions.push({ priority: 8, icon: '📊', title: 'Run a Scenario', description: "Use the Scenario page to model 'What if my income drops 20%?' and ensure you're prepared.", impact: 'low', category: 'Planning' });

  return actions.slice(0, 6);
}

export function getBusinessRecommendations(s: BudgetState) {
  const { totalIncome, businessBudgeted } = getTotals(s);
  const ratio = totalIncome > 0 ? businessBudgeted / totalIncome : 0;
  const recs = [];

  if (ratio > 0.6) recs.push({ type: 'danger' as const, text: 'Business costs exceed 60% of income. Prioritize closing sales or reducing tool spend immediately.' });
  else if (ratio > 0.4) recs.push({ type: 'warning' as const, text: 'Business costs are 40–60% of income. Aim to grow income 2x before adding more tools.' });
  else if (ratio > 0.2) recs.push({ type: 'info' as const, text: 'Business costs are healthy at 20–40%. Focus on consistent prospecting to grow revenue.' });
  else recs.push({ type: 'success' as const, text: 'Business costs are under 20% of income — excellent leverage. Consider reinvesting gains.' });

  recs.push({ type: 'info' as const, text: 'Track your income-per-hour across business activities to identify your highest-ROI actions.' });
  recs.push({ type: 'info' as const, text: 'In network marketing, consistent daily activity (5–10 outreach/day) compounds over time.' });
  recs.push({ type: 'success' as const, text: 'Use your LLC to deduct eligible business expenses — tools, meetings, mileage, phone.' });

  return recs;
}
