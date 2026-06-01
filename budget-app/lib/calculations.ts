import { BudgetState, CategorySummary, Insight, LineItem } from '@/types/budget';

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

  return {
    totalIncome,
    totalBudgeted,
    totalSpent,
    totalDifference: totalBudgeted - totalSpent,
    shouldHaveLeft: totalIncome - totalBudgeted,
    actuallyLeft: totalIncome - totalSpent,
    debtMinPayments,
    businessBudgeted,
    savingsBudgeted: sumItems(s.savings).budgeted,
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

export function getInsights(s: BudgetState): Insight[] {
  const { totalIncome, totalBudgeted, savingsBudgeted, debtMinPayments, actuallyLeft, businessBudgeted } = getTotals(s);
  const insights: Insight[] = [];

  if (totalIncome === 0) return insights;

  const savingsRate = totalIncome > 0 ? (savingsBudgeted / totalIncome) * 100 : 0;
  const debtRatio = totalIncome > 0 ? (debtMinPayments / totalIncome) * 100 : 0;
  const businessRatio = totalIncome > 0 ? (businessBudgeted / totalIncome) * 100 : 0;

  if (savingsRate < 10) {
    insights.push({
      type: 'warning',
      title: 'Low Savings Rate',
      body: `You're saving ${savingsRate.toFixed(1)}% of income. Aim for at least 10–20% to build a solid financial foundation.`,
    });
  } else if (savingsRate >= 20) {
    insights.push({
      type: 'success',
      title: 'Strong Savings Rate',
      body: `Excellent! You're saving ${savingsRate.toFixed(1)}% of income — well above the recommended 20%.`,
    });
  }

  if (debtRatio > 20) {
    insights.push({
      type: 'danger',
      title: 'High Debt Load',
      body: `Minimum debt payments are ${debtRatio.toFixed(1)}% of income. Focus on paying off high-APY balances first.`,
    });
  } else if (debtMinPayments > 0) {
    insights.push({
      type: 'info',
      title: 'Debt Under Control',
      body: `Debt payments are ${debtRatio.toFixed(1)}% of income — within the healthy range. Keep going!`,
    });
  }

  if (actuallyLeft > 0) {
    insights.push({
      type: 'info',
      title: `$${actuallyLeft.toFixed(2)} Unallocated`,
      body: `You have $${actuallyLeft.toFixed(2)} left over each month. Consider routing it to your Emergency Fund or Investment Account.`,
    });
  } else if (actuallyLeft < 0) {
    insights.push({
      type: 'danger',
      title: 'Overspending Alert',
      body: `You're spending $${Math.abs(actuallyLeft).toFixed(2)} more than you earn. Review your expenses and cut discretionary categories first.`,
    });
  }

  if (businessRatio > 50) {
    insights.push({
      type: 'warning',
      title: 'Business Costs Are High',
      body: `Business tools represent ${businessRatio.toFixed(1)}% of income. Make sure your business revenue covers these costs or plan to scale income.`,
    });
  } else if (businessRatio > 0) {
    insights.push({
      type: 'success',
      title: 'Business Investment On Track',
      body: `You're investing ${businessRatio.toFixed(1)}% of income in business tools — a manageable rate for growing your network marketing business.`,
    });
  }

  const emergencyFundBudgeted = s.savings.find(i => i.label === 'Emergency Fund')?.budgeted ?? 0;
  const monthlyExpenses = totalBudgeted;
  const monthsToGoal = monthlyExpenses > 0 ? (3 * monthlyExpenses) / Math.max(emergencyFundBudgeted, 1) : 0;
  if (emergencyFundBudgeted > 0 && monthsToGoal > 0) {
    insights.push({
      type: 'info',
      title: 'Emergency Fund Timeline',
      body: `At your current rate, you'll reach a 3-month emergency fund in approximately ${Math.ceil(monthsToGoal)} months. Stay consistent!`,
    });
  }

  if (totalBudgeted > totalIncome) {
    insights.push({
      type: 'danger',
      title: 'Budget Exceeds Income',
      body: `Your planned expenses ($${totalBudgeted.toFixed(2)}) exceed your income ($${totalIncome.toFixed(2)}). Reduce discretionary spending.`,
    });
  }

  return insights;
}
