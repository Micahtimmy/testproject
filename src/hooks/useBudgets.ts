import { useState, useEffect, useCallback } from 'react';
import type { Budget, Category } from '../types';
import { useNotifications } from '../context/NotificationContext';
import { secureStorage, sanitizeAmount, generateSecureId } from '../utils/security';

const STORAGE_KEY = 'financeflow-budgets';

const DEFAULT_BUDGETS: Budget[] = [
  { id: '1', category: 'food', limit: 800, spent: 735, period: 'monthly' },
  { id: '2', category: 'transport', limit: 300, spent: 134, period: 'monthly' },
  { id: '3', category: 'entertainment', limit: 400, spent: 223, period: 'monthly' },
  { id: '4', category: 'shopping', limit: 500, spent: 645, period: 'monthly' },
  { id: '5', category: 'bills', limit: 2500, spent: 2120, period: 'monthly' },
  { id: '6', category: 'health', limit: 200, spent: 85, period: 'monthly' },
];

type BudgetPeriod = 'weekly' | 'monthly' | 'yearly';

interface BudgetInput {
  category: Category;
  limit: number | string;
  period: BudgetPeriod;
}

function getInitialBudgets(): Budget[] {
  const stored = secureStorage.getItem<Budget[]>(STORAGE_KEY, []);
  if (stored.length > 0) {
    return stored;
  }
  secureStorage.setItem(STORAGE_KEY, DEFAULT_BUDGETS);
  return DEFAULT_BUDGETS;
}

export function useBudgets() {
  const [budgets, setBudgets] = useState<Budget[]>(getInitialBudgets);
  const { addNotification } = useNotifications();

  // Persist budgets to storage
  useEffect(() => {
    if (budgets.length > 0) {
      secureStorage.setItem(STORAGE_KEY, budgets);
    }
  }, [budgets]);

  // Add new budget with validation
  const addBudget = useCallback((input: BudgetInput): { success: boolean; error?: string } => {
    const limit = sanitizeAmount(input.limit);

    if (limit <= 0) {
      return { success: false, error: 'Budget limit must be greater than 0' };
    }

    if (!['weekly', 'monthly', 'yearly'].includes(input.period)) {
      return { success: false, error: 'Invalid budget period' };
    }

    // Check if budget for this category already exists
    const existingBudget = budgets.find(b => b.category === input.category);
    if (existingBudget) {
      return { success: false, error: 'Budget for this category already exists' };
    }

    const newBudget: Budget = {
      id: generateSecureId(),
      category: input.category,
      limit,
      spent: 0,
      period: input.period,
    };

    setBudgets((prev) => [...prev, newBudget]);
    return { success: true };
  }, [budgets]);

  // Update budget with validation
  const updateBudget = useCallback((id: string, updates: Partial<BudgetInput>) => {
    if (!id || typeof id !== 'string') return;

    setBudgets((prev) =>
      prev.map((b) => {
        if (b.id !== id) return b;

        const updatedBudget = { ...b };

        if (updates.limit !== undefined) {
          const sanitizedLimit = sanitizeAmount(updates.limit);
          if (sanitizedLimit > 0) {
            updatedBudget.limit = sanitizedLimit;
          }
        }
        if (updates.period !== undefined && ['weekly', 'monthly', 'yearly'].includes(updates.period)) {
          updatedBudget.period = updates.period;
        }

        return updatedBudget;
      })
    );
  }, []);

  // Delete budget
  const deleteBudget = useCallback((id: string) => {
    if (!id || typeof id !== 'string') return;
    setBudgets((prev) => prev.filter((b) => b.id !== id));
  }, []);

  // Add expense to budget with alerts
  const addExpenseToBudget = useCallback((category: Category, amount: number) => {
    const sanitizedAmount = sanitizeAmount(amount);
    if (sanitizedAmount <= 0) return;

    setBudgets((prev) =>
      prev.map((b) => {
        if (b.category !== category) return b;

        const newSpent = b.spent + sanitizedAmount;
        const percentage = (newSpent / b.limit) * 100;
        const previousPercentage = (b.spent / b.limit) * 100;

        // Trigger alerts at 80% and 100% thresholds
        if (percentage >= 100 && previousPercentage < 100) {
          addNotification({
            type: 'alert',
            title: 'Budget Exceeded!',
            message: `You've exceeded your ${category} budget by $${(newSpent - b.limit).toFixed(2)}.`,
          });
        } else if (percentage >= 80 && previousPercentage < 80) {
          addNotification({
            type: 'alert',
            title: 'Budget Warning',
            message: `You've used ${percentage.toFixed(0)}% of your ${category} budget.`,
          });
        }

        return { ...b, spent: newSpent };
      })
    );
  }, [addNotification]);

  // Get budget status
  const getBudgetStatus = useCallback((budget: Budget): 'exceeded' | 'warning' | 'moderate' | 'good' => {
    const percentage = (budget.spent / budget.limit) * 100;
    if (percentage >= 100) return 'exceeded';
    if (percentage >= 80) return 'warning';
    if (percentage >= 50) return 'moderate';
    return 'good';
  }, []);

  // Get budget by category
  const getBudgetByCategory = useCallback((category: Category): Budget | undefined => {
    return budgets.find(b => b.category === category);
  }, [budgets]);

  // Calculate totals
  const totalBudgeted = budgets.reduce((sum, b) => sum + b.limit, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
  const totalRemaining = totalBudgeted - totalSpent;

  // Reset monthly budgets (call this at the start of each month)
  const resetBudgets = useCallback(() => {
    setBudgets((prev) =>
      prev.map((b) => ({ ...b, spent: 0 }))
    );
  }, []);

  return {
    budgets,
    addBudget,
    updateBudget,
    deleteBudget,
    addExpenseToBudget,
    getBudgetStatus,
    getBudgetByCategory,
    totalBudgeted,
    totalSpent,
    totalRemaining,
    resetBudgets,
  };
}
