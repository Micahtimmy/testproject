import { useState, useEffect } from 'react';
import type { Budget, Category } from '../types';
import { useNotifications } from '../context/NotificationContext';

const STORAGE_KEY = 'financeflow-budgets';

const DEFAULT_BUDGETS: Budget[] = [
  { id: '1', category: 'food', limit: 800, spent: 735, period: 'monthly' },
  { id: '2', category: 'transport', limit: 300, spent: 134, period: 'monthly' },
  { id: '3', category: 'entertainment', limit: 400, spent: 223, period: 'monthly' },
  { id: '4', category: 'shopping', limit: 500, spent: 645, period: 'monthly' },
  { id: '5', category: 'bills', limit: 2500, spent: 2120, period: 'monthly' },
  { id: '6', category: 'health', limit: 200, spent: 85, period: 'monthly' },
];

export function useBudgets() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const { addNotification } = useNotifications();

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setBudgets(JSON.parse(stored));
    } else {
      setBudgets(DEFAULT_BUDGETS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_BUDGETS));
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(budgets));
    }
  }, [budgets, isLoaded]);

  const addBudget = (budget: Omit<Budget, 'id' | 'spent'>) => {
    const newBudget: Budget = {
      ...budget,
      id: crypto.randomUUID(),
      spent: 0,
    };
    setBudgets((prev) => [...prev, newBudget]);
  };

  const updateBudget = (id: string, updates: Partial<Budget>) => {
    setBudgets((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...updates } : b))
    );
  };

  const deleteBudget = (id: string) => {
    setBudgets((prev) => prev.filter((b) => b.id !== id));
  };

  const addExpenseToBudget = (category: Category, amount: number) => {
    setBudgets((prev) =>
      prev.map((b) => {
        if (b.category === category) {
          const newSpent = b.spent + amount;
          const percentage = (newSpent / b.limit) * 100;

          // Trigger alerts at 80% and 100%
          if (percentage >= 100 && (b.spent / b.limit) * 100 < 100) {
            addNotification({
              type: 'alert',
              title: 'Budget Exceeded!',
              message: `You've exceeded your ${category} budget by $${(newSpent - b.limit).toFixed(2)}.`,
            });
          } else if (percentage >= 80 && (b.spent / b.limit) * 100 < 80) {
            addNotification({
              type: 'alert',
              title: 'Budget Warning',
              message: `You've used ${percentage.toFixed(0)}% of your ${category} budget.`,
            });
          }

          return { ...b, spent: newSpent };
        }
        return b;
      })
    );
  };

  const getBudgetStatus = (budget: Budget) => {
    const percentage = (budget.spent / budget.limit) * 100;
    if (percentage >= 100) return 'exceeded';
    if (percentage >= 80) return 'warning';
    if (percentage >= 50) return 'moderate';
    return 'good';
  };

  const totalBudgeted = budgets.reduce((sum, b) => sum + b.limit, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);

  return {
    budgets,
    addBudget,
    updateBudget,
    deleteBudget,
    addExpenseToBudget,
    getBudgetStatus,
    totalBudgeted,
    totalSpent,
    isLoaded,
  };
}
