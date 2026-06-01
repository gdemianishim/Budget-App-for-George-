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
    { label: 'Mortgage / Rent', budgeted: 0, spent: 0 },
    { label: '2nd Mortgage', budgeted: 0, spent: 0 },
    { label: 'Taxes', budgeted: 0, spent: 0 },
    { label: 'Other', budgeted: 0, spent: 0 },
    { label: 'Other', budgeted: 0, spent: 0 },
  ],

  utilities: [
    { label: 'Water', budgeted: 0, spent: 0 },
    { label: 'Oil', budgeted: 0, spent: 0 },
    { label: 'Cell / Mobile', budgeted: 0, spent: 0 },
    { label: 'Internet', budgeted: 0, spent: 0 },
    { label: 'Cable', budgeted: 0, spent: 0 },
    { label: 'Other', budgeted: 0, spent: 0 },
  ],

  personalCare: [
    { label: 'Medical', budgeted: 0, spent: 0 },
    { label: 'Hair / Nails', budgeted: 10, spent: 0 },
    { label: 'Clothing', budgeted: 0, spent: 0 },
    { label: 'Dry Cleaning', budgeted: 0, spent: 0 },
    { label: 'Gym', budgeted: 37.5, spent: 0 },
    { label: 'Organization Fees', budgeted: 0, spent: 0 },
    { label: 'Child Care', budgeted: 0, spent: 0 },
  ],

  insurance: [
    { label: 'Home', budgeted: 0, spent: 0 },
    { label: 'Health', budgeted: 0, spent: 0 },
    { label: 'Life', budgeted: 0, spent: 0 },
    { label: 'Auto', budgeted: 0, spent: 0 },
  ],

  businessTools: [
    { label: 'LLC', budgeted: 137.5, spent: 0 },
    { label: 'Functions', budgeted: 75, spent: 0 },
    { label: 'Meetings', budgeted: 5, spent: 0 },
    { label: 'Additional Tools / Ditto', budgeted: 275, spent: 0 },
  ],

  recreation: [
    { label: 'Entertainment', budgeted: 5, spent: 0 },
    { label: 'Vacation', budgeted: 0, spent: 0 },
    { label: 'Pocket Money', budgeted: 0, spent: 0 },
    { label: 'Other', budgeted: 31.92, spent: 0 },
    { label: 'Other', budgeted: 0, spent: 0 },
  ],

  transportation: [
    { label: 'Fuel / Gas', budgeted: 82.5, spent: 0 },
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
};
