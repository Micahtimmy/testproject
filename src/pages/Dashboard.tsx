import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Clock,
  Target,
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
import { CATEGORY_CONFIG } from '../types';
import type { Category } from '../types';

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

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
      color: CATEGORY_CONFIG[category as Category]?.color || '#6b7280',
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  const recentTransactions = transactions.slice(0, 5);

  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text">Dashboard</h1>
          <p className="text-text-muted">Welcome back! Here's your financial overview.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-surface-light/50 dark:bg-surface-light/50 light:bg-white/50 backdrop-blur-xl rounded-xl border border-surface-lighter/50 dark:border-surface-lighter/50 light:border-gray-200/50">
          <Clock className="w-4 h-4 text-text-muted" />
          <span className="text-sm text-text-muted">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}
          </span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Balance */}
        <motion.div
          custom={0}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-dark to-indigo-700 rounded-2xl p-6 text-white shadow-xl shadow-primary/20"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-white/20 backdrop-blur-xl rounded-xl">
                <Wallet className="w-5 h-5" />
              </div>
              <span className="text-white/80 font-medium">Total Balance</span>
            </div>
            <p className="text-3xl font-bold tracking-tight">{formatCurrency(balance)}</p>
            <div className="flex items-center gap-1 mt-2 text-sm text-white/70">
              <ArrowUpRight className="w-4 h-4" />
              <span>+12.5% from last month</span>
            </div>
          </div>
        </motion.div>

        {/* Monthly Income */}
        <motion.div
          custom={1}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="glass-card p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-success/20 rounded-xl">
              <TrendingUp className="w-5 h-5 text-success" />
            </div>
            <span className="text-text-muted font-medium">Monthly Income</span>
          </div>
          <p className="text-2xl font-bold text-success">{formatCurrency(monthlyIncome)}</p>
          <div className="flex items-center gap-1 mt-2 text-sm text-text-muted">
            <ArrowUpRight className="w-4 h-4 text-success" />
            <span>+8.2% from last month</span>
          </div>
        </motion.div>

        {/* Monthly Expenses */}
        <motion.div
          custom={2}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="glass-card p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-danger/20 rounded-xl">
              <TrendingDown className="w-5 h-5 text-danger" />
            </div>
            <span className="text-text-muted font-medium">Monthly Expenses</span>
          </div>
          <p className="text-2xl font-bold text-danger">{formatCurrency(monthlyExpenses)}</p>
          <div className="flex items-center gap-1 mt-2 text-sm text-text-muted">
            <ArrowDownRight className="w-4 h-4 text-danger" />
            <span>-3.1% from last month</span>
          </div>
        </motion.div>

        {/* Savings Rate */}
        <motion.div
          custom={3}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="glass-card p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-warning/20 rounded-xl">
              <Target className="w-5 h-5 text-warning" />
            </div>
            <span className="text-text-muted font-medium">Savings Rate</span>
          </div>
          <p className="text-2xl font-bold text-text">{savingsRate.toFixed(1)}%</p>
          <div className="w-full bg-surface-lighter rounded-full h-2 mt-3">
            <div
              className="bg-gradient-to-r from-warning to-success h-2 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(savingsRate, 100)}%` }}
            />
          </div>
        </motion.div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Income vs Expenses Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 glass-card p-6"
        >
          <h3 className="font-semibold text-text mb-6">Income vs Expenses (Last 7 Days)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-surface-light dark:bg-surface-light light:bg-white px-4 py-3 rounded-xl border border-surface-lighter dark:border-surface-lighter light:border-gray-200 shadow-xl">
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
                  stroke="#10b981"
                  strokeWidth={2}
                  fill="url(#incomeGradient)"
                />
                <Area
                  type="monotone"
                  dataKey="expenses"
                  name="Expenses"
                  stroke="#ef4444"
                  strokeWidth={2}
                  fill="url(#expenseGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Spending by Category */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card p-6"
        >
          <h3 className="font-semibold text-text mb-6">Spending by Category</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
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
                        <div className="bg-surface-light dark:bg-surface-light light:bg-white px-3 py-2 rounded-lg border border-surface-lighter dark:border-surface-lighter light:border-gray-200 shadow-xl">
                          <p className="text-sm font-medium text-text">{data.name}</p>
                          <p className="text-sm text-text-muted">{formatCurrency(data.value)}</p>
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
                  <span className="text-text-muted">{item.name}</span>
                </div>
                <span className="font-medium text-text">{formatCurrency(item.value)}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="lg:col-span-2 glass-card overflow-hidden"
        >
          <div className="p-6 border-b border-surface-lighter/50 dark:border-surface-lighter/50 light:border-gray-200/50">
            <h3 className="font-semibold text-text">Recent Transactions</h3>
          </div>
          <div className="divide-y divide-surface-lighter/30 dark:divide-surface-lighter/30 light:divide-gray-100">
            {recentTransactions.map((transaction) => {
              const config = CATEGORY_CONFIG[transaction.category];
              return (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 hover:bg-surface-lighter/20 dark:hover:bg-surface-lighter/20 light:hover:bg-gray-50/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="p-2.5 rounded-xl"
                      style={{ backgroundColor: `${config.color}20` }}
                    >
                      <div className="w-5 h-5" style={{ color: config.color }}>
                        <TrendingUp className="w-5 h-5" />
                      </div>
                    </div>
                    <div>
                      <p className="font-medium text-text">{transaction.description}</p>
                      <p className="text-sm text-text-muted">
                        {config.label} • {new Date(transaction.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`font-semibold ${
                      transaction.type === 'income' ? 'text-success' : 'text-danger'
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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="glass-card p-6"
        >
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-text">AI Insights</h3>
            {isAnalyzing && (
              <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin ml-auto" />
            )}
          </div>

          <div className="space-y-4">
            {insights.slice(0, 3).map((insight) => (
              <div
                key={insight.id}
                className={`p-4 rounded-xl border ${
                  insight.type === 'warning'
                    ? 'bg-danger/5 border-danger/20'
                    : insight.type === 'saving'
                    ? 'bg-success/5 border-success/20'
                    : insight.type === 'investment'
                    ? 'bg-primary/5 border-primary/20'
                    : 'bg-surface-lighter/30 border-surface-lighter/50'
                }`}
              >
                <p className="font-medium text-text text-sm">{insight.title}</p>
                <p className="text-xs text-text-muted mt-1 line-clamp-2">
                  {insight.description}
                </p>
              </div>
            ))}
          </div>

          {/* Budget Alerts */}
          <div className="mt-6 pt-6 border-t border-surface-lighter/50 dark:border-surface-lighter/50 light:border-gray-200/50">
            <h4 className="text-sm font-medium text-text-muted mb-3">Budget Status</h4>
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
                    <div className="w-full bg-surface-lighter rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full transition-all duration-500 ${
                          status === 'exceeded'
                            ? 'bg-danger'
                            : status === 'warning'
                            ? 'bg-warning'
                            : 'bg-success'
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
    </div>
  );
}
