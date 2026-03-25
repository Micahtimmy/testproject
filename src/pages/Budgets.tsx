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
  const [formError, setFormError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!formLimit || parseFloat(formLimit) <= 0) {
      setFormError('Please enter a valid budget limit');
      return;
    }

    const result = addBudget({
      category: formCategory,
      limit: parseFloat(formLimit),
      period: formPeriod,
    });

    if (result.success) {
      setFormLimit('');
      setShowAddModal(false);
    } else {
      setFormError(result.error || 'Failed to create budget');
    }
  };

  const overallProgress = totalBudgeted > 0 ? (totalSpent / totalBudgeted) * 100 : 0;

  const budgetsByStatus = {
    exceeded: budgets.filter((b) => getBudgetStatus(b) === 'exceeded'),
    warning: budgets.filter((b) => getBudgetStatus(b) === 'warning'),
    good: budgets.filter((b) => ['good', 'moderate'].includes(getBudgetStatus(b))),
  };

  // Get available categories (not already used)
  const availableCategories = EXPENSE_CATEGORIES.filter(
    (cat) => !budgets.find((b) => b.category === cat)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-heading-1">Budgets</h1>
          <p className="text-body-sm mt-1">Set spending limits and track your progress</p>
        </div>
        <button
          onClick={() => {
            if (availableCategories.length > 0) {
              setFormCategory(availableCategories[0]);
              setShowAddModal(true);
            }
          }}
          disabled={availableCategories.length === 0}
          className="btn btn-primary"
        >
          <Plus className="w-5 h-5" />
          Create Budget
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="card hover-lift"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-text-secondary font-medium text-sm">Total Budget</span>
            <div className="w-10 h-10 bg-primary-light rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
          </div>
          <p className="text-2xl font-semibold text-text">{formatCurrency(totalBudgeted)}</p>
          <p className="text-sm text-text-muted mt-1">per month</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="card hover-lift"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-text-secondary font-medium text-sm">Total Spent</span>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${overallProgress > 100 ? 'bg-red-50' : 'bg-amber-50'}`}>
              <Bell className={`w-5 h-5 ${overallProgress > 100 ? 'text-danger' : 'text-warning'}`} />
            </div>
          </div>
          <p className="text-2xl font-semibold text-text">{formatCurrency(totalSpent)}</p>
          <div className="flex items-center gap-2 mt-2">
            <div className="progress flex-1">
              <div
                className={`progress-bar ${
                  overallProgress > 100 ? 'progress-bar-danger' : overallProgress > 80 ? 'progress-bar-warning' : 'progress-bar-success'
                }`}
                style={{ width: `${Math.min(overallProgress, 100)}%` }}
              />
            </div>
            <span className="text-sm text-text-muted">{overallProgress.toFixed(0)}%</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card hover-lift"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-text-secondary font-medium text-sm">Remaining</span>
            <div className="w-10 h-10 bg-primary-light rounded-xl flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-primary" />
            </div>
          </div>
          <p className={`text-2xl font-semibold ${totalBudgeted - totalSpent >= 0 ? 'text-primary' : 'text-danger'}`}>
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
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 rounded-2xl p-4"
        >
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-danger" />
            <p className="font-medium text-danger text-sm">
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
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              className="card group hover-lift"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${config.color}15` }}
                  >
                    <TrendingUp className="w-5 h-5" style={{ color: config.color }} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-text text-sm">{config.label}</h3>
                    <p className="text-xs text-text-muted capitalize">{budget.period}</p>
                  </div>
                </div>
                <button
                  onClick={() => deleteBudget(budget.id)}
                  className="p-2 opacity-0 group-hover:opacity-100 hover:bg-red-50 rounded-lg transition-all"
                  aria-label="Delete budget"
                >
                  <X className="w-4 h-4 text-danger" />
                </button>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-2xl font-semibold text-text">{formatCurrency(budget.spent)}</p>
                    <p className="text-xs text-text-muted">of {formatCurrency(budget.limit)}</p>
                  </div>
                  <span
                    className={`badge ${
                      status === 'exceeded'
                        ? 'badge-danger'
                        : status === 'warning'
                        ? 'badge-warning'
                        : 'badge-success'
                    }`}
                  >
                    {status === 'exceeded' ? 'Over Budget' : status === 'warning' ? 'Warning' : 'On Track'}
                  </span>
                </div>

                <div className="progress">
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

                <div className="flex justify-between text-sm">
                  <span className="text-text-muted">{percentage.toFixed(0)}% used</span>
                  <span className={remaining >= 0 ? 'text-primary' : 'text-danger'}>
                    {remaining >= 0 ? `${formatCurrency(remaining)} left` : `${formatCurrency(Math.abs(remaining))} over`}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}

        {/* Add Budget Card */}
        {availableCategories.length > 0 && (
          <motion.button
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => {
              setFormCategory(availableCategories[0]);
              setShowAddModal(true);
            }}
            className="card border-2 border-dashed border-border hover:border-primary transition-colors flex flex-col items-center justify-center gap-3 min-h-48"
          >
            <div className="w-12 h-12 bg-primary-light rounded-xl flex items-center justify-center">
              <Plus className="w-6 h-6 text-primary" />
            </div>
            <p className="font-medium text-text-secondary">Create New Budget</p>
          </motion.button>
        )}
      </div>

      {/* Add Budget Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              className="card w-full max-w-md shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-heading-2">Create Budget</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 hover:bg-surface-lighter rounded-lg transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5 text-text-muted" />
                </button>
              </div>

              {formError && (
                <div className="bg-red-50 border border-red-200 text-danger rounded-xl p-3 mb-4 text-sm">
                  {formError}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Category</label>
                  <div className="grid grid-cols-3 gap-2">
                    {availableCategories.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setFormCategory(cat)}
                        className={`p-3 rounded-xl text-xs font-medium transition-all border ${
                          formCategory === cat
                            ? 'border-primary bg-primary-light'
                            : 'border-border bg-surface-lighter hover:border-text-muted'
                        }`}
                        style={
                          formCategory === cat
                            ? { color: CATEGORY_CONFIG[cat].color }
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
                  <label className="block text-sm font-medium text-text-secondary mb-2">Budget Limit</label>
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
                      className="input"
                      style={{ paddingLeft: '32px' }}
                    />
                  </div>
                </div>

                {/* Period */}
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Budget Period</label>
                  <div className="flex bg-surface-lighter rounded-xl p-1">
                    {(['weekly', 'monthly', 'yearly'] as const).map((period) => (
                      <button
                        key={period}
                        type="button"
                        onClick={() => setFormPeriod(period)}
                        className={`flex-1 py-2.5 rounded-lg font-medium text-sm transition-all ${
                          formPeriod === period
                            ? 'bg-primary text-white'
                            : 'text-text-secondary hover:text-text'
                        }`}
                      >
                        {period.charAt(0).toUpperCase() + period.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Alert Settings */}
                <div className="bg-surface-lighter rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Bell className="w-5 h-5 text-primary" />
                    <span className="font-medium text-text text-sm">Alert Settings</span>
                  </div>
                  <p className="text-xs text-text-muted">
                    You'll receive alerts when you reach 80% and 100% of your budget.
                  </p>
                </div>

                {/* Submit */}
                <button type="submit" className="btn btn-primary w-full h-12">
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
