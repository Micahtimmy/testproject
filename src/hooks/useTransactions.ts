import { useState, useEffect } from 'react';
import type { Transaction } from '../types';

const STORAGE_KEY = 'financeflow-transactions';

const DEMO_TRANSACTIONS: Transaction[] = [
  { id: '1', type: 'income', amount: 8500, category: 'salary', description: 'Monthly Salary - TechCorp', date: '2026-03-01', recurring: true },
  { id: '2', type: 'income', amount: 1200, category: 'freelance', description: 'UI Design Project', date: '2026-03-03' },
  { id: '3', type: 'expense', amount: 1800, category: 'bills', description: 'Rent Payment', date: '2026-03-01', recurring: true },
  { id: '4', type: 'expense', amount: 245, category: 'food', description: 'Whole Foods Grocery', date: '2026-03-02' },
  { id: '5', type: 'expense', amount: 89, category: 'transport', description: 'Uber Rides', date: '2026-03-03' },
  { id: '6', type: 'income', amount: 450, category: 'dividends', description: 'AAPL Dividend', date: '2026-03-05' },
  { id: '7', type: 'expense', amount: 320, category: 'bills', description: 'Electric & Internet', date: '2026-03-05', recurring: true },
  { id: '8', type: 'expense', amount: 156, category: 'entertainment', description: 'Netflix + Spotify + Disney+', date: '2026-03-06', recurring: true },
  { id: '9', type: 'expense', amount: 420, category: 'shopping', description: 'Nike Air Max', date: '2026-03-08' },
  { id: '10', type: 'income', amount: 2500, category: 'freelance', description: 'Mobile App Development', date: '2026-03-10' },
  { id: '11', type: 'expense', amount: 85, category: 'health', description: 'Gym Membership', date: '2026-03-10', recurring: true },
  { id: '12', type: 'expense', amount: 178, category: 'food', description: 'Restaurant - Date Night', date: '2026-03-12' },
  { id: '13', type: 'expense', amount: 650, category: 'travel', description: 'Flight to NYC', date: '2026-03-14' },
  { id: '14', type: 'expense', amount: 89, category: 'education', description: 'Udemy Course', date: '2026-03-15' },
  { id: '15', type: 'income', amount: 180, category: 'investment', description: 'ETF Gains', date: '2026-03-18' },
  { id: '16', type: 'expense', amount: 312, category: 'food', description: 'Weekly Groceries', date: '2026-03-19' },
  { id: '17', type: 'expense', amount: 45, category: 'transport', description: 'Gas Station', date: '2026-03-20' },
  { id: '18', type: 'expense', amount: 225, category: 'shopping', description: 'Amazon Orders', date: '2026-03-21' },
  { id: '19', type: 'expense', amount: 67, category: 'entertainment', description: 'Movie Tickets', date: '2026-03-22' },
  { id: '20', type: 'income', amount: 800, category: 'freelance', description: 'Logo Design', date: '2026-03-23' },
];

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setTransactions(JSON.parse(stored));
    } else {
      setTransactions(DEMO_TRANSACTIONS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_TRANSACTIONS));
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
    }
  }, [transactions, isLoaded]);

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: crypto.randomUUID(),
    };
    setTransactions((prev) => [newTransaction, ...prev]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const updateTransaction = (id: string, updates: Partial<Transaction>) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
  };

  const getTransactionsByDateRange = (startDate: string, endDate: string) => {
    return transactions.filter((t) => t.date >= startDate && t.date <= endDate);
  };

  const getTransactionsByCategory = (category: string) => {
    return transactions.filter((t) => t.category === category);
  };

  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  // Monthly stats
  const currentMonth = new Date().toISOString().slice(0, 7);
  const monthlyTransactions = transactions.filter((t) => t.date.startsWith(currentMonth));

  const monthlyIncome = monthlyTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlyExpenses = monthlyTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  return {
    transactions,
    addTransaction,
    deleteTransaction,
    updateTransaction,
    getTransactionsByDateRange,
    getTransactionsByCategory,
    totalIncome,
    totalExpenses,
    balance,
    monthlyIncome,
    monthlyExpenses,
    isLoaded,
  };
}
