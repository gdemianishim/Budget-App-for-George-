export interface LineItem {
  label: string;
  budgeted: number;
  spent: number;
}

export interface DebtItem {
  label: string;
  balance: number;
  apy: number;
  minPayment: number;
}

export interface BudgetState {
  income: number;
  extraIncome: number;
  payFrequency: number; // 1=monthly, 2=biweekly/semi, 4=weekly

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
