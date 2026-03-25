import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, AlertTriangle, CheckCircle, TrendingUp, Bell } from 'lucide-react';
import { useBudgets } from '../hooks/useBudgets';
import { CATEGORY_CONFIG, EXPENSE_CATEGORIES } from '../types';
import type { Category } from '../types';

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function Budgets() {
  const { budgets, addBudget, deleteBudget, getBudgetStatus, totalBudgeted, totalSpent } = useBudgets();
  const [showAddModal, setShowAddModal] = useState(false);
  const [formCategory, setFormCategory] = useState<Category>('food');
  const [formLimit, setFormLimit] = useState('');
  const [formPeriod, setFormPeriod] = useState<'weekly' | 'monthly' | 'yearly'>('monthly');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formLimit) return;

    addBudget({
      category: formCategory,
      limit: parseFloat(formLimit),
      period: formPeriod,
    });

    setFormLimit('');
    setShowAddModal(false);
  };

  const overallProgress = totalBudgeted > 0 ? (totalSpent / totalBudgeted) * 100 : 0;

  const budgetsByStatus = {
    exceeded: budgets.filter((b) => getBudgetStatus(b) === 'exceeded'),
    warning: budgets.filter((b) => getBudgetStatus(b) === 'warning'),
    good: budgets.filter((b) => ['good', 'moderate'].includes(getBudgetStatus(b))),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text">Budgets</h1>
          <p className="text-text-muted">Set spending limits and track your progress</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white rounded-xl font-medium transition-all duration-300 shadow-lg shadow-primary/25"
        >
          <Plus className="w-5 h-5" />
          Create Budget
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-text-muted font-medium">Total Budget</span>
            <div className="p-2 bg-primary/20 rounded-xl">
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
          </div>
          <p className="text-2xl font-bold text-text">{formatCurrency(totalBudgeted)}</p>
          <p className="text-sm text-text-muted mt-1">per month</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-text-muted font-medium">Total Spent</span>
            <div className={`p-2 rounded-xl ${overallProgress > 100 ? 'bg-danger/20' : 'bg-warning/20'}`}>
              <Bell className={`w-5 h-5 ${overallProgress > 100 ? 'text-danger' : 'text-warning'}`} />
            </div>
          </div>
          <p className="text-2xl font-bold text-text">{formatCurrency(totalSpent)}</p>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex-1 bg-surface-lighter rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${
                  overallProgress > 100 ? 'bg-danger' : overallProgress > 80 ? 'bg-warning' : 'bg-success'
                }`}
                style={{ width: `${Math.min(overallProgress, 100)}%` }}
              />
            </div>
            <span className="text-sm text-text-muted">{overallProgress.toFixed(0)}%</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-text-muted font-medium">Remaining</span>
            <div className="p-2 bg-success/20 rounded-xl">
              <CheckCircle className="w-5 h-5 text-success" />
            </div>
          </div>
          <p className={`text-2xl font-bold ${totalBudgeted - totalSpent >= 0 ? 'text-success' : 'text-danger'}`}>
            {formatCurrency(Math.abs(totalBudgeted - totalSpent))}
          </p>
          <p className="text-sm text-text-muted mt-1">
            {totalBudgeted - totalSpent >= 0 ? 'left to spend' : 'over budget'}
          </p>
        </motion.div>
      </div>

      {/* Budget Alerts */}
      {budgetsByStatus.exceeded.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-danger/10 border border-danger/20 rounded-2xl p-4"
        >
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-danger" />
            <p className="font-medium text-danger">
              {budgetsByStatus.exceeded.length} budget{budgetsByStatus.exceeded.length > 1 ? 's' : ''} exceeded this month
            </p>
          </div>
        </motion.div>
      )}

      {/* Budget Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {budgets.map((budget, index) => {
          const config = CATEGORY_CONFIG[budget.category];
          const status = getBudgetStatus(budget);
          const percentage = (budget.spent / budget.limit) * 100;
          const remaining = budget.limit - budget.spent;

          return (
            <motion.div
              key={budget.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="glass-card p-6 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="p-2.5 rounded-xl"
                    style={{ backgroundColor: `${config.color}20` }}
                  >
                    <div className="w-5 h-5" style={{ color: config.color }}>
                      <TrendingUp className="w-5 h-5" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-text">{config.label}</h3>
                    <p className="text-sm text-text-muted capitalize">{budget.period}</p>
                  </div>
                </div>
                <button
                  onClick={() => deleteBudget(budget.id)}
                  className="p-2 opacity-0 group-hover:opacity-100 hover:bg-danger/10 rounded-lg transition-all"
                >
                  <X className="w-4 h-4 text-danger" />
                </button>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-2xl font-bold text-text">{formatCurrency(budget.spent)}</p>
                    <p className="text-sm text-text-muted">of {formatCurrency(budget.limit)}</p>
                  </div>
                  <span
                    className={`text-sm font-medium px-3 py-1 rounded-full ${
                      status === 'exceeded'
                        ? 'bg-danger/20 text-danger'
                        : status === 'warning'
                        ? 'bg-warning/20 text-warning'
                        : 'bg-success/20 text-success'
                    }`}
                  >
                    {status === 'exceeded' ? 'Over Budget' : status === 'warning' ? 'Warning' : 'On Track'}
                  </span>
                </div>

                <div className="w-full bg-surface-lighter rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all duration-500 ${
                      status === 'exceeded'
                        ? 'bg-gradient-to-r from-danger to-red-400'
                        : status === 'warning'
                        ? 'bg-gradient-to-r from-warning to-yellow-400'
                        : 'bg-gradient-to-r from-success to-emerald-400'
                    }`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-text-muted">{percentage.toFixed(0)}% used</span>
                  <span className={remaining >= 0 ? 'text-success' : 'text-danger'}>
                    {remaining >= 0 ? `${formatCurrency(remaining)} left` : `${formatCurrency(Math.abs(remaining))} over`}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}

        {/* Add Budget Card */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => setShowAddModal(true)}
          className="glass-card p-6 border-2 border-dashed border-surface-lighter hover:border-primary/50 transition-colors flex flex-col items-center justify-center gap-3 min-h-48"
        >
          <div className="p-3 bg-primary/10 rounded-xl">
            <Plus className="w-6 h-6 text-primary" />
          </div>
          <p className="font-medium text-text-muted">Create New Budget</p>
        </motion.button>
      </div>

      {/* Add Budget Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-surface-light dark:bg-surface-light light:bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-text">Create Budget</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 hover:bg-surface-lighter rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-text-muted" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Category */}
                <div>
                  <label className="block text-sm text-text-muted mb-2">Category</label>
                  <div className="grid grid-cols-3 gap-2">
                    {EXPENSE_CATEGORIES.filter(cat => !budgets.find(b => b.category === cat)).map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setFormCategory(cat)}
                        className={`p-3 rounded-xl text-xs font-medium transition-all ${
                          formCategory === cat
                            ? 'ring-2 ring-primary'
                            : 'bg-surface dark:bg-surface light:bg-gray-50 hover:bg-surface-lighter'
                        }`}
                        style={
                          formCategory === cat
                            ? { backgroundColor: `${CATEGORY_CONFIG[cat].color}20`, color: CATEGORY_CONFIG[cat].color }
                            : { color: 'inherit' }
                        }
                      >
                        {CATEGORY_CONFIG[cat].label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Limit */}
                <div>
                  <label className="block text-sm text-text-muted mb-2">Budget Limit</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">$</span>
                    <input
                      type="number"
                      value={formLimit}
                      onChange={(e) => setFormLimit(e.target.value)}
                      placeholder="0.00"
                      step="1"
                      min="0"
                      required
                      className="w-full bg-surface dark:bg-surface light:bg-gray-50 border border-surface-lighter dark:border-surface-lighter light:border-gray-200 rounded-xl py-3 pl-8 pr-4 text-text focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                </div>

                {/* Period */}
                <div>
                  <label className="block text-sm text-text-muted mb-2">Budget Period</label>
                  <div className="flex bg-surface dark:bg-surface light:bg-gray-100 rounded-xl p-1">
                    {(['weekly', 'monthly', 'yearly'] as const).map((period) => (
                      <button
                        key={period}
                        type="button"
                        onClick={() => setFormPeriod(period)}
                        className={`flex-1 py-2.5 rounded-lg font-medium text-sm transition-all ${
                          formPeriod === period
                            ? 'bg-primary text-white shadow'
                            : 'text-text-muted hover:text-text'
                        }`}
                      >
                        {period.charAt(0).toUpperCase() + period.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Alert Settings */}
                <div className="bg-surface dark:bg-surface light:bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Bell className="w-5 h-5 text-primary" />
                    <span className="font-medium text-text">Alert Settings</span>
                  </div>
                  <p className="text-sm text-text-muted">
                    You'll receive alerts when you reach 80% and 100% of your budget.
                  </p>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white rounded-xl py-3.5 font-medium transition-all duration-300 shadow-lg shadow-primary/25"
                >
                  Create Budget
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
