export type TransactionType = 'income' | 'expense';

export type Category =
  | 'salary'
  | 'freelance'
  | 'investment'
  | 'dividends'
  | 'food'
  | 'transport'
  | 'entertainment'
  | 'shopping'
  | 'bills'
  | 'health'
  | 'travel'
  | 'education'
  | 'other';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: Category;
  description: string;
  date: string;
  recurring?: boolean;
}

export interface Budget {
  id: string;
  category: Category;
  limit: number;
  spent: number;
  period: 'weekly' | 'monthly' | 'yearly';
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  preferences: {
    theme: 'light' | 'dark' | 'system';
    currency: string;
    notifications: {
      email: boolean;
      push: boolean;
      budgetAlerts: boolean;
      weeklyReport: boolean;
    };
  };
}

export interface AIInsight {
  id: string;
  type: 'saving' | 'investment' | 'warning' | 'tip';
  title: string;
  description: string;
  impact?: string;
  action?: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
}

export interface StockSuggestion {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  recommendation: 'buy' | 'hold' | 'sell';
  reason: string;
}

export interface Notification {
  id: string;
  type: 'alert' | 'reminder' | 'info' | 'success';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export const CATEGORY_CONFIG: Record<Category, { label: string; color: string; icon: string }> = {
  salary: { label: 'Salary', color: '#10b981', icon: 'Briefcase' },
  freelance: { label: 'Freelance', color: '#06b6d4', icon: 'Laptop' },
  investment: { label: 'Investment', color: '#8b5cf6', icon: 'TrendingUp' },
  dividends: { label: 'Dividends', color: '#a855f7', icon: 'Coins' },
  food: { label: 'Food & Dining', color: '#f59e0b', icon: 'Utensils' },
  transport: { label: 'Transport', color: '#3b82f6', icon: 'Car' },
  entertainment: { label: 'Entertainment', color: '#ec4899', icon: 'Gamepad2' },
  shopping: { label: 'Shopping', color: '#f97316', icon: 'ShoppingBag' },
  bills: { label: 'Bills & Utilities', color: '#ef4444', icon: 'Receipt' },
  health: { label: 'Health', color: '#14b8a6', icon: 'Heart' },
  travel: { label: 'Travel', color: '#0ea5e9', icon: 'Plane' },
  education: { label: 'Education', color: '#6366f1', icon: 'GraduationCap' },
  other: { label: 'Other', color: '#6b7280', icon: 'MoreHorizontal' },
};

export const INCOME_CATEGORIES: Category[] = ['salary', 'freelance', 'investment', 'dividends', 'other'];
export const EXPENSE_CATEGORIES: Category[] = ['food', 'transport', 'entertainment', 'shopping', 'bills', 'health', 'travel', 'education', 'other'];
