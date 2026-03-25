import { useState, useEffect, useCallback } from 'react';
import { secureStorage, sanitizeInput } from '../utils/security';

export interface Goal {
  id: string;
  title: string;
  description?: string;
  targetAmount?: number;
  currentAmount?: number;
  deadline?: string;
  category: 'savings' | 'investment' | 'debt' | 'purchase' | 'emergency' | 'other';
  priority: 'high' | 'medium' | 'low';
  status: 'active' | 'completed' | 'paused';
  createdAt: string;
  updatedAt: string;
  milestones?: {
    id: string;
    title: string;
    completed: boolean;
  }[];
}

const STORAGE_KEY = 'financeflow_goals';

const defaultGoals: Goal[] = [
  {
    id: '1',
    title: 'Build Emergency Fund',
    description: 'Save 6 months of expenses for emergencies',
    targetAmount: 15000,
    currentAmount: 8500,
    deadline: '2026-12-31',
    category: 'emergency',
    priority: 'high',
    status: 'active',
    createdAt: '2026-01-15',
    updatedAt: '2026-03-20',
    milestones: [
      { id: 'm1', title: 'Save first $5,000', completed: true },
      { id: 'm2', title: 'Reach $10,000', completed: false },
      { id: 'm3', title: 'Complete $15,000', completed: false },
    ],
  },
  {
    id: '2',
    title: 'Pay off Credit Card',
    description: 'Clear high-interest credit card debt',
    targetAmount: 3500,
    currentAmount: 2100,
    deadline: '2026-06-30',
    category: 'debt',
    priority: 'high',
    status: 'active',
    createdAt: '2026-02-01',
    updatedAt: '2026-03-18',
  },
  {
    id: '3',
    title: 'Start Investment Portfolio',
    description: 'Begin investing in index funds',
    targetAmount: 5000,
    currentAmount: 1200,
    category: 'investment',
    priority: 'medium',
    status: 'active',
    createdAt: '2026-03-01',
    updatedAt: '2026-03-15',
  },
];

export function useGoals() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load goals from storage
  useEffect(() => {
    const stored = secureStorage.getItem<Goal[]>(STORAGE_KEY, defaultGoals);
    setGoals(stored);
    setIsLoading(false);
  }, []);

  // Save goals to storage
  useEffect(() => {
    if (!isLoading) {
      secureStorage.setItem(STORAGE_KEY, goals);
    }
  }, [goals, isLoading]);

  const addGoal = useCallback((goalData: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>) => {
    const sanitizedTitle = sanitizeInput(goalData.title);
    if (!sanitizedTitle || sanitizedTitle.length < 2) {
      return { success: false, error: 'Goal title must be at least 2 characters' };
    }

    const newGoal: Goal = {
      ...goalData,
      id: Date.now().toString(),
      title: sanitizedTitle,
      description: goalData.description ? sanitizeInput(goalData.description) : undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setGoals((prev) => [newGoal, ...prev]);
    return { success: true, goal: newGoal };
  }, []);

  const updateGoal = useCallback((id: string, updates: Partial<Goal>) => {
    setGoals((prev) =>
      prev.map((goal) =>
        goal.id === id
          ? {
              ...goal,
              ...updates,
              title: updates.title ? sanitizeInput(updates.title) : goal.title,
              description: updates.description ? sanitizeInput(updates.description) : goal.description,
              updatedAt: new Date().toISOString(),
            }
          : goal
      )
    );
  }, []);

  const deleteGoal = useCallback((id: string) => {
    setGoals((prev) => prev.filter((goal) => goal.id !== id));
  }, []);

  const toggleMilestone = useCallback((goalId: string, milestoneId: string) => {
    setGoals((prev) =>
      prev.map((goal) => {
        if (goal.id !== goalId || !goal.milestones) return goal;
        return {
          ...goal,
          milestones: goal.milestones.map((m) =>
            m.id === milestoneId ? { ...m, completed: !m.completed } : m
          ),
          updatedAt: new Date().toISOString(),
        };
      })
    );
  }, []);

  const addMilestone = useCallback((goalId: string, title: string) => {
    const sanitizedTitle = sanitizeInput(title);
    if (!sanitizedTitle) return;

    setGoals((prev) =>
      prev.map((goal) => {
        if (goal.id !== goalId) return goal;
        return {
          ...goal,
          milestones: [
            ...(goal.milestones || []),
            { id: Date.now().toString(), title: sanitizedTitle, completed: false },
          ],
          updatedAt: new Date().toISOString(),
        };
      })
    );
  }, []);

  const updateProgress = useCallback((id: string, amount: number) => {
    if (amount < 0) return;
    setGoals((prev) =>
      prev.map((goal) =>
        goal.id === id
          ? {
              ...goal,
              currentAmount: amount,
              status: goal.targetAmount && amount >= goal.targetAmount ? 'completed' : goal.status,
              updatedAt: new Date().toISOString(),
            }
          : goal
      )
    );
  }, []);

  // Computed values
  const activeGoals = goals.filter((g) => g.status === 'active');
  const completedGoals = goals.filter((g) => g.status === 'completed');
  const highPriorityGoals = activeGoals.filter((g) => g.priority === 'high');

  const totalProgress = activeGoals.reduce(
    (acc, goal) => {
      if (goal.targetAmount && goal.currentAmount !== undefined) {
        acc.current += goal.currentAmount;
        acc.target += goal.targetAmount;
      }
      return acc;
    },
    { current: 0, target: 0 }
  );

  const overallProgressPercent =
    totalProgress.target > 0 ? (totalProgress.current / totalProgress.target) * 100 : 0;

  return {
    goals,
    activeGoals,
    completedGoals,
    highPriorityGoals,
    totalProgress,
    overallProgressPercent,
    isLoading,
    addGoal,
    updateGoal,
    deleteGoal,
    toggleMilestone,
    addMilestone,
    updateProgress,
  };
}
