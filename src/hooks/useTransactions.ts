import { useState, useEffect, useCallback } from 'react';
import type { Transaction, Category } from '../types';
import { secureStorage, sanitizeInput, sanitizeAmount, isValidDate, generateSecureId } from '../utils/security';

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

interface TransactionInput {
  type: 'income' | 'expense';
  amount: number | string;
  category: Category;
  description: string;
  date: string;
  recurring?: boolean;
}

interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load transactions from storage
  useEffect(() => {
    const stored = secureStorage.getItem<Transaction[]>(STORAGE_KEY, []);
    if (stored.length > 0) {
      setTransactions(stored);
    } else {
      setTransactions(DEMO_TRANSACTIONS);
      secureStorage.setItem(STORAGE_KEY, DEMO_TRANSACTIONS);
    }
    setIsLoaded(true);
  }, []);

  // Persist transactions to storage
  useEffect(() => {
    if (isLoaded && transactions.length > 0) {
      secureStorage.setItem(STORAGE_KEY, transactions);
    }
  }, [transactions, isLoaded]);

  // Validate transaction input
  const validateTransaction = useCallback((input: TransactionInput): ValidationResult => {
    const errors: string[] = [];

    if (!['income', 'expense'].includes(input.type)) {
      errors.push('Invalid transaction type');
    }

    const amount = sanitizeAmount(input.amount);
    if (amount <= 0) {
      errors.push('Amount must be greater than 0');
    }

    if (!input.category) {
      errors.push('Category is required');
    }

    const description = sanitizeInput(input.description);
    if (!description || description.length < 1) {
      errors.push('Description is required');
    }

    if (!isValidDate(input.date)) {
      errors.push('Invalid date format');
    }

    return { valid: errors.length === 0, errors };
  }, []);

  // Add new transaction with validation
  const addTransaction = useCallback((input: TransactionInput): { success: boolean; error?: string } => {
    const validation = validateTransaction(input);
    if (!validation.valid) {
      setError(validation.errors[0]);
      return { success: false, error: validation.errors[0] };
    }

    const newTransaction: Transaction = {
      id: generateSecureId(),
      type: input.type,
      amount: sanitizeAmount(input.amount),
      category: input.category,
      description: sanitizeInput(input.description),
      date: input.date,
      recurring: input.recurring || false,
    };

    setTransactions((prev) => [newTransaction, ...prev]);
    setError(null);
    return { success: true };
  }, [validateTransaction]);

  // Delete transaction
  const deleteTransaction = useCallback((id: string) => {
    if (!id || typeof id !== 'string') return;
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Update transaction with validation
  const updateTransaction = useCallback((id: string, updates: Partial<TransactionInput>) => {
    if (!id || typeof id !== 'string') return;

    setTransactions((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;

        const updatedTransaction = { ...t };

        if (updates.amount !== undefined) {
          updatedTransaction.amount = sanitizeAmount(updates.amount);
        }
        if (updates.description !== undefined) {
          updatedTransaction.description = sanitizeInput(updates.description);
        }
        if (updates.category !== undefined) {
          updatedTransaction.category = updates.category;
        }
        if (updates.date !== undefined && isValidDate(updates.date)) {
          updatedTransaction.date = updates.date;
        }
        if (updates.type !== undefined && ['income', 'expense'].includes(updates.type)) {
          updatedTransaction.type = updates.type;
        }
        if (updates.recurring !== undefined) {
          updatedTransaction.recurring = updates.recurring;
        }

        return updatedTransaction;
      })
    );
  }, []);

  // Get transactions by date range
  const getTransactionsByDateRange = useCallback((startDate: string, endDate: string) => {
    if (!isValidDate(startDate) || !isValidDate(endDate)) return [];
    return transactions.filter((t) => t.date >= startDate && t.date <= endDate);
  }, [transactions]);

  // Get transactions by category
  const getTransactionsByCategory = useCallback((category: string) => {
    return transactions.filter((t) => t.category === category);
  }, [transactions]);

  // Calculate totals
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

  // Clear error
  const clearError = useCallback(() => setError(null), []);

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
    error,
    clearError,
  };
}
