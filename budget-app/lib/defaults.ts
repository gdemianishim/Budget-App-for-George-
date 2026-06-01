import { BudgetState } from '@/types/budget';

export const DEFAULT_BUDGET: BudgetState = {
  income: 689.55,
  extraIncome: 0,
  payFrequency: 1,

  tithing: [
    { label: 'Charity 1', budgeted: 0, spent: 0 },
    { label: 'Charity 2', budgeted: 0, spent: 0 },
    { label: 'Charity 3', budgeted: 0, spent: 0 },
  ],

  savings: [
    { label: 'Emergency Fund', budgeted: 25, spent: 0 },
    { label: 'Investment Account', budgeted: 0, spent: 0 },
    { label: 'Other', budgeted: 0, spent: 0 },
  ],

  household: [
    { label: 'Mortgage / Rent', budgeted: 0, spent: 0, isRecurring: true },
    { label: '2nd Mortgage', budgeted: 0, spent: 0 },
    { label: 'Taxes', budgeted: 0, spent: 0 },
    { label: 'Other', budgeted: 0, spent: 0 },
    { label: 'Other', budgeted: 0, spent: 0 },
  ],

  utilities: [
    { label: 'Water', budgeted: 0, spent: 0, isRecurring: true },
    { label: 'Oil', budgeted: 0, spent: 0, isRecurring: true },
    { label: 'Cell / Mobile', budgeted: 0, spent: 0, isRecurring: true },
    { label: 'Internet', budgeted: 0, spent: 0, isRecurring: true },
    { label: 'Cable', budgeted: 0, spent: 0, isRecurring: true },
    { label: 'Other', budgeted: 0, spent: 0 },
  ],

  personalCare: [
    { label: 'Medical', budgeted: 0, spent: 0 },
    { label: 'Hair / Nails', budgeted: 10, spent: 0 },
    { label: 'Clothing', budgeted: 0, spent: 0 },
    { label: 'Dry Cleaning', budgeted: 0, spent: 0 },
    { label: 'Gym', budgeted: 37.5, spent: 0, isRecurring: true },
    { label: 'Organization Fees', budgeted: 0, spent: 0 },
    { label: 'Child Care', budgeted: 0, spent: 0 },
  ],

  insurance: [
    { label: 'Home', budgeted: 0, spent: 0, isRecurring: true },
    { label: 'Health', budgeted: 0, spent: 0, isRecurring: true },
    { label: 'Life', budgeted: 0, spent: 0, isRecurring: true },
    { label: 'Auto', budgeted: 0, spent: 0, isRecurring: true },
  ],

  businessTools: [
    { label: 'LLC', budgeted: 137.5, spent: 0, isRecurring: true },
    { label: 'Functions', budgeted: 75, spent: 0 },
    { label: 'Meetings', budgeted: 5, spent: 0 },
    { label: 'Additional Tools / Ditto', budgeted: 275, spent: 0, isRecurring: true },
  ],

  recreation: [
    { label: 'Entertainment', budgeted: 5, spent: 0 },
    { label: 'Vacation', budgeted: 0, spent: 0 },
    { label: 'Pocket Money', budgeted: 0, spent: 0 },
    { label: 'Other', budgeted: 31.92, spent: 0 },
    { label: 'Other', budgeted: 0, spent: 0 },
  ],

  transportation: [
    { label: 'Fuel / Gas', budgeted: 82.5, spent: 0, isRecurring: true },
    { label: 'MetroCard', budgeted: 0, spent: 0 },
    { label: 'Train Pass', budgeted: 0, spent: 0 },
    { label: 'Tolls', budgeted: 0, spent: 0 },
    { label: 'Maintenance (Oil, etc.)', budgeted: 0, spent: 0 },
  ],

  foodHousehold: [
    { label: 'Groceries', budgeted: 0, spent: 0 },
    { label: 'Outside Food', budgeted: 100, spent: 0 },
    { label: 'Jeff', budgeted: 0, spent: 0 },
    { label: 'Baba', budgeted: 0, spent: 0 },
  ],

  medicalHealth: [
    { label: 'Doctor', budgeted: 0, spent: 0 },
    { label: 'Medication', budgeted: 0, spent: 0 },
    { label: 'Other', budgeted: 0, spent: 0 },
    { label: 'Other', budgeted: 0, spent: 0 },
  ],

  debt: [
    { label: 'Vehicle #1', balance: 0, apy: 0, minPayment: 0 },
    { label: 'Vehicle #2', balance: 0, apy: 0, minPayment: 0 },
    { label: 'Credit Card 1', balance: 0, apy: 0, minPayment: 76 },
    { label: 'Credit Card 2', balance: 0, apy: 0, minPayment: 0 },
    { label: 'Credit Card 3', balance: 0, apy: 0, minPayment: 0 },
    { label: 'Credit Card 4', balance: 0, apy: 0, minPayment: 0 },
    { label: 'Credit Card 5', balance: 0, apy: 0, minPayment: 0 },
    { label: 'Credit Card 6', balance: 0, apy: 0, minPayment: 0 },
    { label: 'Credit Card 7', balance: 0, apy: 0, minPayment: 0 },
    { label: 'Credit Card 8', balance: 0, apy: 0, minPayment: 0 },
    { label: 'Credit Card 9', balance: 0, apy: 0, minPayment: 0 },
    { label: 'Credit Card 10', balance: 0, apy: 0, minPayment: 0 },
    { label: 'Student Loan 1', balance: 0, apy: 0, minPayment: 0 },
    { label: 'Student Loan 2', balance: 0, apy: 0, minPayment: 0 },
    { label: 'Student Loan 3', balance: 0, apy: 0, minPayment: 0 },
  ],

  goals: [
    {
      id: '1',
      name: '3-Month Emergency Fund',
      targetAmount: 2580,
      currentAmount: 0,
      targetDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      category: 'emergency',
      color: '#10b981',
    },
    {
      id: '2',
      name: 'Pay Off Credit Card',
      targetAmount: 500,
      currentAmount: 0,
      targetDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      category: 'debt',
      color: '#ef4444',
    },
    {
      id: '3',
      name: 'Business Growth Fund',
      targetAmount: 1000,
      currentAmount: 0,
      targetDate: new Date(Date.now() + 270 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      category: 'business',
      color: '#f59e0b',
    },
  ],

  assets: [
    { label: 'Checking Account', value: 0 },
    { label: 'Savings Account', value: 0 },
    { label: 'Investment Account', value: 0 },
    { label: 'Vehicle(s)', value: 0 },
    { label: 'Other Assets', value: 0 },
  ],

  liabilities: [
    { label: 'Credit Card Debt', balance: 0 },
    { label: 'Student Loans', balance: 0 },
    { label: 'Vehicle Loans', balance: 0 },
    { label: 'Other Debt', balance: 0 },
  ],

  scenarioIncomeChange: 0,
  scenarioExpenseChange: 0,
};
