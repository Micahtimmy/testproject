import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Calendar,
  Target,
  ChevronRight,
  CheckCircle,
  Circle,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useTransactions } from '../hooks/useTransactions';
import { useBudgets } from '../hooks/useBudgets';
import { useAIInsights } from '../hooks/useAIInsights';
import { useGoals } from '../hooks/useGoals';
import { CATEGORY_CONFIG } from '../types';
import type { Category } from '../types';

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function Dashboard() {
  const {
    transactions,
    balance,
    totalIncome,
    totalExpenses,
    monthlyIncome,
    monthlyExpenses,
  } = useTransactions();
  const { budgets, getBudgetStatus } = useBudgets();
  const { insights, isAnalyzing } = useAIInsights(transactions, budgets);
  const { activeGoals, toggleMilestone } = useGoals();

  // Prepare chart data
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date.toISOString().split('T')[0];
  });

  const chartData = last7Days.map((date) => {
    const dayTransactions = transactions.filter((t) => t.date === date);
    const income = dayTransactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const expenses = dayTransactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    return {
      date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
      income,
      expenses,
    };
  });

  // Spending by category for pie chart
  const expensesByCategory = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const pieData = Object.entries(expensesByCategory)
    .map(([category, value]) => ({
      name: CATEGORY_CONFIG[category as Category]?.label || category,
      value,
      color: CATEGORY_CONFIG[category as Category]?.color || '#6B7280',
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  const recentTransactions = transactions.slice(0, 5);
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-heading-1">Dashboard</h1>
          <p className="text-body-sm mt-1">Welcome back! Here's your financial overview.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-surface-light border border-border rounded-xl">
          <Calendar className="w-4 h-4 text-text-muted" />
          <span className="text-sm text-text-secondary">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}
          </span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Balance */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
          className="relative overflow-hidden gradient-primary rounded-2xl p-6 text-white"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Wallet className="w-5 h-5" />
              </div>
              <span className="text-white/80 font-medium text-sm">Total Balance</span>
            </div>
            <p className="text-3xl font-semibold">{formatCurrency(balance)}</p>
            <div className="flex items-center gap-1 mt-2 text-sm text-white/70">
              <ArrowUpRight className="w-4 h-4" />
              <span>+12.5% from last month</span>
            </div>
          </div>
        </motion.div>

        {/* Monthly Income */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="card hover-lift"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-primary-light rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <span className="text-text-secondary font-medium text-sm">Monthly Income</span>
          </div>
          <p className="text-2xl font-semibold text-primary">{formatCurrency(monthlyIncome)}</p>
          <div className="flex items-center gap-1 mt-2 text-sm text-text-muted">
            <ArrowUpRight className="w-4 h-4 text-primary" />
            <span>+8.2% from last month</span>
          </div>
        </motion.div>

        {/* Monthly Expenses */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card hover-lift"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
              <TrendingDown className="w-5 h-5 text-danger" />
            </div>
            <span className="text-text-secondary font-medium text-sm">Monthly Expenses</span>
          </div>
          <p className="text-2xl font-semibold text-danger">{formatCurrency(monthlyExpenses)}</p>
          <div className="flex items-center gap-1 mt-2 text-sm text-text-muted">
            <ArrowDownRight className="w-4 h-4 text-danger" />
            <span>-3.1% from last month</span>
          </div>
        </motion.div>

        {/* Savings Rate */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="card hover-lift"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
              <Target className="w-5 h-5 text-warning" />
            </div>
            <span className="text-text-secondary font-medium text-sm">Savings Rate</span>
          </div>
          <p className="text-2xl font-semibold text-text">{savingsRate.toFixed(1)}%</p>
          <div className="progress mt-3">
            <div
              className={`progress-bar ${savingsRate >= 20 ? 'progress-bar-success' : 'progress-bar-warning'}`}
              style={{ width: `${Math.min(savingsRate, 100)}%` }}
            />
          </div>
        </motion.div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Income vs Expenses Chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 card"
        >
          <h3 className="text-heading-3 mb-6">Income vs Expenses (Last 7 Days)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="card card-sm shadow-lg">
                          <p className="text-sm font-medium text-text mb-2">{label}</p>
                          {payload.map((entry, index) => (
                            <p key={index} className="text-sm" style={{ color: entry.color }}>
                              {entry.name}: {formatCurrency(entry.value as number)}
                            </p>
                          ))}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="income"
                  name="Income"
                  stroke="#10B981"
                  strokeWidth={2}
                  fill="url(#incomeGradient)"
                />
                <Area
                  type="monotone"
                  dataKey="expenses"
                  name="Expenses"
                  stroke="#EF4444"
                  strokeWidth={2}
                  fill="url(#expenseGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Spending by Category */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="card"
        >
          <h3 className="text-heading-3 mb-6">Spending by Category</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="card card-sm shadow-lg">
                          <p className="text-sm font-medium text-text">{data.name}</p>
                          <p className="text-sm text-text-secondary">{formatCurrency(data.value)}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-4">
            {pieData.slice(0, 4).map((item) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-text-secondary">{item.name}</span>
                </div>
                <span className="font-medium text-text">{formatCurrency(item.value)}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Transactions */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 card p-0 overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-border">
            <h3 className="text-heading-3">Recent Transactions</h3>
          </div>
          <div className="divide-y divide-border">
            {recentTransactions.map((transaction) => {
              const config = CATEGORY_CONFIG[transaction.category];
              return (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between px-6 py-4 hover:bg-surface-lighter transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${config.color}15` }}
                    >
                      <TrendingUp className="w-5 h-5" style={{ color: config.color }} />
                    </div>
                    <div>
                      <p className="font-medium text-text text-sm">{transaction.description}</p>
                      <p className="text-xs text-text-muted">
                        {config.label} • {new Date(transaction.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`font-semibold text-sm ${
                      transaction.type === 'income' ? 'text-primary' : 'text-danger'
                    }`}
                  >
                    {transaction.type === 'income' ? '+' : '-'}
                    {formatCurrency(transaction.amount)}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* AI Insights Preview */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="card"
        >
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-5 h-5 text-primary" />
            <h3 className="text-heading-3">AI Insights</h3>
            {isAnalyzing && (
              <div className="w-4 h-4 border-2 border-primary-light border-t-primary rounded-full animate-spin ml-auto" />
            )}
          </div>

          <div className="space-y-3">
            {insights.slice(0, 3).map((insight) => (
              <div
                key={insight.id}
                className={`p-4 rounded-xl border ${
                  insight.type === 'warning'
                    ? 'bg-red-50 border-red-100'
                    : insight.type === 'saving'
                    ? 'bg-primary-light border-primary-light'
                    : insight.type === 'investment'
                    ? 'bg-blue-50 border-blue-100'
                    : 'bg-surface-lighter border-border'
                }`}
              >
                <p className="font-medium text-text text-sm">{insight.title}</p>
                <p className="text-xs text-text-secondary mt-1 line-clamp-2">
                  {insight.description}
                </p>
              </div>
            ))}
          </div>

          {/* Budget Alerts */}
          <div className="mt-6 pt-6 border-t border-border">
            <h4 className="text-sm font-medium text-text-secondary mb-3">Budget Status</h4>
            <div className="space-y-3">
              {budgets.slice(0, 3).map((budget) => {
                const status = getBudgetStatus(budget);
                const percentage = (budget.spent / budget.limit) * 100;
                return (
                  <div key={budget.id}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-text capitalize">{budget.category}</span>
                      <span
                        className={
                          status === 'exceeded'
                            ? 'text-danger'
                            : status === 'warning'
                            ? 'text-warning'
                            : 'text-text-muted'
                        }
                      >
                        {formatCurrency(budget.spent)} / {formatCurrency(budget.limit)}
                      </span>
                    </div>
                    <div className="progress h-1.5">
                      <div
                        className={`progress-bar ${
                          status === 'exceeded'
                            ? 'progress-bar-danger'
                            : status === 'warning'
                            ? 'progress-bar-warning'
                            : 'progress-bar-success'
                        }`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Goals Section */}
      {activeGoals.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              <h3 className="text-heading-3">Active Goals</h3>
            </div>
            <Link
              to="/goals"
              className="text-sm text-primary hover:text-primary-dark font-medium flex items-center gap-1 transition-colors"
            >
              View All
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeGoals.slice(0, 3).map((goal) => {
              const progress = goal.targetAmount && goal.currentAmount !== undefined
                ? (goal.currentAmount / goal.targetAmount) * 100
                : 0;

              return (
                <div key={goal.id} className="bg-surface-lighter rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-text text-sm">{goal.title}</h4>
                    <span
                      className={`badge ${
                        goal.priority === 'high'
                          ? 'badge-danger'
                          : goal.priority === 'medium'
                          ? 'badge-warning'
                          : 'badge-neutral'
                      }`}
                    >
                      {goal.priority}
                    </span>
                  </div>

                  {goal.targetAmount && (
                    <div className="mb-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-text-secondary">
                          {formatCurrency(goal.currentAmount || 0)}
                        </span>
                        <span className="text-text-muted">{formatCurrency(goal.targetAmount)}</span>
                      </div>
                      <div className="progress h-1.5">
                        <div
                          className="progress-bar"
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {goal.milestones && goal.milestones.length > 0 && (
                    <div className="space-y-1.5">
                      {goal.milestones.slice(0, 2).map((milestone) => (
                        <button
                          key={milestone.id}
                          onClick={() => toggleMilestone(goal.id, milestone.id)}
                          className="w-full flex items-center gap-2 text-xs text-left hover:bg-border/50 rounded p-1 -ml-1 transition-colors"
                        >
                          {milestone.completed ? (
                            <CheckCircle className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                          ) : (
                            <Circle className="w-3.5 h-3.5 text-text-muted flex-shrink-0" />
                          )}
                          <span className={milestone.completed ? 'text-text-muted line-through' : 'text-text-secondary'}>
                            {milestone.title}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
}
