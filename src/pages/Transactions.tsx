import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Search,
  Download,
  Trash2,
  ArrowUpDown,
  X,
  Briefcase,
  Laptop,
  TrendingUp,
  Coins,
  Utensils,
  Car,
  Gamepad2,
  ShoppingBag,
  Receipt,
  Heart,
  Plane,
  GraduationCap,
  MoreHorizontal,
} from 'lucide-react';
import { useTransactions } from '../hooks/useTransactions';
import { CATEGORY_CONFIG, INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../types';
import type { TransactionType, Category } from '../types';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Briefcase,
  Laptop,
  TrendingUp,
  Coins,
  Utensils,
  Car,
  Gamepad2,
  ShoppingBag,
  Receipt,
  Heart,
  Plane,
  GraduationCap,
  MoreHorizontal,
};

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function Transactions() {
  const { transactions, addTransaction, deleteTransaction } = useTransactions();
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [sortOrder] = useState<'asc' | 'desc'>('desc');

  // Form state
  const [formType, setFormType] = useState<TransactionType>('expense');
  const [formAmount, setFormAmount] = useState('');
  const [formCategory, setFormCategory] = useState<Category>('food');
  const [formDescription, setFormDescription] = useState('');
  const [formDate, setFormDate] = useState(new Date().toISOString().split('T')[0]);
  const [formRecurring, setFormRecurring] = useState(false);

  const filteredTransactions = transactions
    .filter((t) => {
      if (filterType !== 'all' && t.type !== filterType) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          t.description.toLowerCase().includes(query) ||
          t.category.toLowerCase().includes(query)
        );
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return sortOrder === 'desc'
          ? new Date(b.date).getTime() - new Date(a.date).getTime()
          : new Date(a.date).getTime() - new Date(b.date).getTime();
      } else {
        return sortOrder === 'desc' ? b.amount - a.amount : a.amount - b.amount;
      }
    });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formAmount || !formDescription) return;

    addTransaction({
      type: formType,
      amount: parseFloat(formAmount),
      category: formCategory,
      description: formDescription,
      date: formDate,
      recurring: formRecurring,
    });

    // Reset form
    setFormAmount('');
    setFormDescription('');
    setFormRecurring(false);
    setShowAddModal(false);
  };

  const getCategoryIcon = (category: Category) => {
    const config = CATEGORY_CONFIG[category];
    const Icon = iconMap[config.icon];
    return Icon ? <Icon className="w-5 h-5" /> : null;
  };

  const categories = formType === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text">Transactions</h1>
          <p className="text-text-muted">Manage and track all your transactions</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white rounded-xl font-medium transition-all duration-300 shadow-lg shadow-primary/25"
        >
          <Plus className="w-5 h-5" />
          Add Transaction
        </button>
      </div>

      {/* Filters */}
      <div className="glass-card p-4">
        <div className="flex flex-wrap items-center gap-4">
          {/* Search */}
          <div className="flex-1 min-w-64 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search transactions..."
              className="w-full bg-surface dark:bg-surface light:bg-gray-50 border border-surface-lighter dark:border-surface-lighter light:border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-text placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          {/* Type Filter */}
          <div className="flex bg-surface dark:bg-surface light:bg-gray-100 rounded-xl p-1">
            {(['all', 'income', 'expense'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filterType === type
                    ? 'bg-primary text-white shadow'
                    : 'text-text-muted hover:text-text'
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>

          {/* Sort */}
          <button
            onClick={() => {
              if (sortBy === 'date') {
                setSortBy('amount');
              } else {
                setSortBy('date');
              }
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-surface dark:bg-surface light:bg-gray-100 border border-surface-lighter dark:border-surface-lighter light:border-gray-200 rounded-xl text-text-muted hover:text-text transition-colors"
          >
            <ArrowUpDown className="w-4 h-4" />
            Sort by {sortBy}
          </button>

          {/* Export */}
          <button className="flex items-center gap-2 px-4 py-2.5 bg-surface dark:bg-surface light:bg-gray-100 border border-surface-lighter dark:border-surface-lighter light:border-gray-200 rounded-xl text-text-muted hover:text-text transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Transactions List */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface-lighter/50 dark:border-surface-lighter/50 light:border-gray-200/50">
                <th className="text-left px-6 py-4 text-sm font-medium text-text-muted">Transaction</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-text-muted">Category</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-text-muted">Date</th>
                <th className="text-right px-6 py-4 text-sm font-medium text-text-muted">Amount</th>
                <th className="text-right px-6 py-4 text-sm font-medium text-text-muted">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-lighter/30 dark:divide-surface-lighter/30 light:divide-gray-100">
              {filteredTransactions.map((transaction) => {
                const config = CATEGORY_CONFIG[transaction.category];
                return (
                  <motion.tr
                    key={transaction.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="hover:bg-surface-lighter/20 dark:hover:bg-surface-lighter/20 light:hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="p-2 rounded-xl"
                          style={{ backgroundColor: `${config.color}20` }}
                        >
                          <span style={{ color: config.color }}>
                            {getCategoryIcon(transaction.category)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-text">{transaction.description}</p>
                          {transaction.recurring && (
                            <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                              Recurring
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-text-muted">{config.label}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-text-muted">
                        {new Date(transaction.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span
                        className={`font-semibold ${
                          transaction.type === 'income' ? 'text-success' : 'text-danger'
                        }`}
                      >
                        {transaction.type === 'income' ? '+' : '-'}
                        {formatCurrency(transaction.amount)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => deleteTransaction(transaction.id)}
                        className="p-2 text-text-muted hover:text-danger hover:bg-danger/10 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredTransactions.length === 0 && (
          <div className="p-12 text-center">
            <p className="text-text-muted">No transactions found</p>
          </div>
        )}
      </div>

      {/* Add Transaction Modal */}
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
                <h2 className="text-xl font-bold text-text">Add Transaction</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 hover:bg-surface-lighter rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-text-muted" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Type Toggle */}
                <div className="flex bg-surface dark:bg-surface light:bg-gray-100 rounded-xl p-1">
                  <button
                    type="button"
                    onClick={() => {
                      setFormType('expense');
                      setFormCategory('food');
                    }}
                    className={`flex-1 py-2.5 rounded-lg font-medium transition-all ${
                      formType === 'expense'
                        ? 'bg-danger text-white shadow'
                        : 'text-text-muted hover:text-text'
                    }`}
                  >
                    Expense
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFormType('income');
                      setFormCategory('salary');
                    }}
                    className={`flex-1 py-2.5 rounded-lg font-medium transition-all ${
                      formType === 'income'
                        ? 'bg-success text-white shadow'
                        : 'text-text-muted hover:text-text'
                    }`}
                  >
                    Income
                  </button>
                </div>

                {/* Amount & Date */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-text-muted mb-2">Amount</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">$</span>
                      <input
                        type="number"
                        value={formAmount}
                        onChange={(e) => setFormAmount(e.target.value)}
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                        required
                        className="w-full bg-surface dark:bg-surface light:bg-gray-50 border border-surface-lighter dark:border-surface-lighter light:border-gray-200 rounded-xl py-3 pl-8 pr-4 text-text focus:outline-none focus:ring-2 focus:ring-primary/30"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-text-muted mb-2">Date</label>
                    <input
                      type="date"
                      value={formDate}
                      onChange={(e) => setFormDate(e.target.value)}
                      required
                      className="w-full bg-surface dark:bg-surface light:bg-gray-50 border border-surface-lighter dark:border-surface-lighter light:border-gray-200 rounded-xl py-3 px-4 text-text focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm text-text-muted mb-2">Category</label>
                  <div className="grid grid-cols-3 gap-2">
                    {categories.map((cat) => (
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

                {/* Description */}
                <div>
                  <label className="block text-sm text-text-muted mb-2">Description</label>
                  <input
                    type="text"
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="What was this for?"
                    required
                    className="w-full bg-surface dark:bg-surface light:bg-gray-50 border border-surface-lighter dark:border-surface-lighter light:border-gray-200 rounded-xl py-3 px-4 text-text focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>

                {/* Recurring */}
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formRecurring}
                    onChange={(e) => setFormRecurring(e.target.checked)}
                    className="w-5 h-5 rounded border-surface-lighter text-primary focus:ring-primary"
                  />
                  <span className="text-text">This is a recurring transaction</span>
                </label>

                {/* Submit */}
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white rounded-xl py-3.5 font-medium transition-all duration-300 shadow-lg shadow-primary/25"
                >
                  Add {formType === 'income' ? 'Income' : 'Expense'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
