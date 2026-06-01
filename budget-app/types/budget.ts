export interface LineItem {
  label: string;
  budgeted: number;
  spent: number;
  isRecurring?: boolean;
}

export interface DebtItem {
  label: string;
  balance: number;
  apy: number;
  minPayment: number;
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  category: 'emergency' | 'savings' | 'debt' | 'investment' | 'purchase' | 'business';
  color: string;
}

export interface Asset {
  label: string;
  value: number;
}

export interface Liability {
  label: string;
  balance: number;
}

export interface BudgetState {
  income: number;
  extraIncome: number;
  payFrequency: number;

  tithing: LineItem[];
  savings: LineItem[];
  household: LineItem[];
  utilities: LineItem[];
  personalCare: LineItem[];
  insurance: LineItem[];
  businessTools: LineItem[];
  recreation: LineItem[];
  transportation: LineItem[];
  foodHousehold: LineItem[];
  medicalHealth: LineItem[];

  debt: DebtItem[];

  goals: Goal[];
  assets: Asset[];
  liabilities: Liability[];

  scenarioIncomeChange: number;
  scenarioExpenseChange: number;
}

export interface CategorySummary {
  name: string;
  budgeted: number;
  spent: number;
}

export interface Insight {
  type: 'success' | 'warning' | 'info' | 'danger';
  title: string;
  body: string;
}

export interface NextBestAction {
  priority: number;
  icon: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  category: string;
}
