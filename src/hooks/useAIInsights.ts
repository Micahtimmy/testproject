import { useState, useEffect, useCallback } from 'react';
import type { AIInsight, StockSuggestion, Transaction, Budget } from '../types';

const STORAGE_KEY = 'financeflow-ai-insights';

const generateInsights = (transactions: Transaction[], budgets: Budget[]): AIInsight[] => {
  const insights: AIInsight[] = [];
  const now = new Date();

  // Analyze spending patterns
  const expenses = transactions.filter((t) => t.type === 'expense');
  const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);
  const income = transactions.filter((t) => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);

  // Savings rate insight
  const savingsRate = income > 0 ? ((income - totalExpenses) / income) * 100 : 0;
  if (savingsRate < 20) {
    insights.push({
      id: crypto.randomUUID(),
      type: 'warning',
      title: 'Low Savings Rate',
      description: `Your current savings rate is ${savingsRate.toFixed(1)}%. Financial experts recommend saving at least 20% of your income.`,
      impact: `Increasing to 20% could save you $${((income * 0.2) - (income - totalExpenses)).toFixed(0)} more per month`,
      action: 'Review subscriptions and recurring expenses',
      priority: 'high',
      createdAt: now.toISOString(),
    });
  } else {
    insights.push({
      id: crypto.randomUUID(),
      type: 'tip',
      title: 'Great Savings Rate!',
      description: `You're saving ${savingsRate.toFixed(1)}% of your income. Keep it up!`,
      impact: 'You\'re on track for financial independence',
      priority: 'low',
      createdAt: now.toISOString(),
    });
  }

  // Category-specific insights
  const foodExpenses = expenses.filter((t) => t.category === 'food').reduce((sum, t) => sum + t.amount, 0);
  if (foodExpenses > income * 0.15) {
    insights.push({
      id: crypto.randomUUID(),
      type: 'saving',
      title: 'Reduce Food & Dining Costs',
      description: `You're spending ${((foodExpenses / income) * 100).toFixed(1)}% of your income on food. The recommended amount is 10-15%.`,
      impact: `Potential monthly savings: $${(foodExpenses - income * 0.12).toFixed(0)}`,
      action: 'Try meal prepping and limiting restaurant visits to weekends',
      priority: 'medium',
      createdAt: now.toISOString(),
    });
  }

  // Entertainment spending
  const entertainmentExpenses = expenses.filter((t) => t.category === 'entertainment').reduce((sum, t) => sum + t.amount, 0);
  const subscriptions = expenses.filter((t) => t.category === 'entertainment' && t.recurring);
  if (subscriptions.length > 0) {
    insights.push({
      id: crypto.randomUUID(),
      type: 'saving',
      title: 'Review Your Subscriptions',
      description: `You have ${subscriptions.length} recurring entertainment subscriptions totaling $${entertainmentExpenses.toFixed(0)}/month.`,
      impact: 'Canceling unused subscriptions could save $50-150/month',
      action: 'Audit which services you actually use weekly',
      priority: 'medium',
      createdAt: now.toISOString(),
    });
  }

  // Budget alerts
  budgets.forEach((budget) => {
    const percentage = (budget.spent / budget.limit) * 100;
    if (percentage > 90) {
      insights.push({
        id: crypto.randomUUID(),
        type: 'warning',
        title: `${budget.category.charAt(0).toUpperCase() + budget.category.slice(1)} Budget Critical`,
        description: `You've used ${percentage.toFixed(0)}% of your ${budget.category} budget with ${new Date().getDate()} days left in the month.`,
        impact: `$${(budget.limit - budget.spent).toFixed(0)} remaining`,
        action: 'Consider postponing non-essential purchases',
        priority: 'high',
        createdAt: now.toISOString(),
      });
    }
  });

  // Investment recommendation
  if (savingsRate > 10) {
    insights.push({
      id: crypto.randomUUID(),
      type: 'investment',
      title: 'Investment Opportunity',
      description: 'Based on your savings pattern, you could allocate more to investments.',
      impact: 'Historical S&P 500 returns: ~10% annually',
      action: 'Consider setting up automatic monthly investments',
      priority: 'medium',
      createdAt: now.toISOString(),
    });
  }

  // Emergency fund check
  insights.push({
    id: crypto.randomUUID(),
    type: 'tip',
    title: 'Emergency Fund Status',
    description: 'Aim to have 3-6 months of expenses saved for emergencies.',
    impact: `Target: $${(totalExpenses * 4).toFixed(0)} in emergency savings`,
    action: 'Set up automatic transfers to a high-yield savings account',
    priority: 'low',
    createdAt: now.toISOString(),
  });

  return insights;
};

const STOCK_SUGGESTIONS: StockSuggestion[] = [
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    price: 198.45,
    change: 2.34,
    changePercent: 1.19,
    recommendation: 'buy',
    reason: 'Strong services revenue growth and AI integration potential',
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corp.',
    price: 425.22,
    change: 5.67,
    changePercent: 1.35,
    recommendation: 'buy',
    reason: 'Cloud dominance and enterprise AI leadership',
  },
  {
    symbol: 'VOO',
    name: 'Vanguard S&P 500 ETF',
    price: 478.90,
    change: 3.21,
    changePercent: 0.67,
    recommendation: 'buy',
    reason: 'Low-cost diversified exposure to US large caps',
  },
  {
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    price: 156.78,
    change: -1.23,
    changePercent: -0.78,
    recommendation: 'hold',
    reason: 'Search dominance but regulatory headwinds',
  },
  {
    symbol: 'NVDA',
    name: 'NVIDIA Corp.',
    price: 875.34,
    change: 12.45,
    changePercent: 1.44,
    recommendation: 'hold',
    reason: 'AI leader but valuation stretched',
  },
  {
    symbol: 'VTI',
    name: 'Vanguard Total Stock Market',
    price: 268.45,
    change: 1.89,
    changePercent: 0.71,
    recommendation: 'buy',
    reason: 'Broad market exposure with minimal fees',
  },
];

export function useAIInsights(transactions: Transaction[], budgets: Budget[]) {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [stocks] = useState<StockSuggestion[]>(STOCK_SUGGESTIONS);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const refreshInsights = useCallback(() => {
    setIsAnalyzing(true);
    // Simulate AI processing time
    setTimeout(() => {
      const newInsights = generateInsights(transactions, budgets);
      setInsights(newInsights);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newInsights));
      setIsAnalyzing(false);
    }, 1500);
  }, [transactions, budgets]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && transactions.length > 0) {
      setInsights(JSON.parse(stored));
    } else if (transactions.length > 0) {
      refreshInsights();
    }
  }, [transactions.length, refreshInsights]);

  const dismissInsight = (id: string) => {
    setInsights((prev) => prev.filter((i) => i.id !== id));
  };

  return {
    insights,
    stocks,
    isAnalyzing,
    refreshInsights,
    dismissInsight,
  };
}
