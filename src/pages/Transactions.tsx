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
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

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
  const { transactions, addTransaction, deleteTransaction, error, clearError } = useTransactions();
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
  const [formError, setFormError] = useState('');

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
    setFormError('');

    if (!formAmount || parseFloat(formAmount) <= 0) {
      setFormError('Please enter a valid amount');
      return;
    }

    if (!formDescription.trim()) {
      setFormError('Please enter a description');
      return;
    }

    const result = addTransaction({
      type: formType,
      amount: parseFloat(formAmount),
      category: formCategory,
      description: formDescription.trim(),
      date: formDate,
      recurring: formRecurring,
    });

    if (result.success) {
      setFormAmount('');
      setFormDescription('');
      setFormRecurring(false);
      setShowAddModal(false);
    } else {
      setFormError(result.error || 'Failed to add transaction');
    }
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
          <h1 className="text-heading-1">Transactions</h1>
          <p className="text-body-sm mt-1">Manage and track all your transactions</p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="w-5 h-5 mr-2" />
          Add Transaction
        </Button>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-danger rounded-xl p-4 text-sm flex items-center justify-between">
          {error}
          <Button variant="ghost" size="icon" onClick={clearError} className="text-danger hover:text-red-700 h-8 w-8">
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap items-center gap-4">
            {/* Search */}
            <div className="flex-1 min-w-64 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search transactions..."
                className="h-10 text-sm pl-10"
              />
            </div>

            {/* Type Filter */}
            <div className="flex bg-surface-lighter rounded-xl p-1">
              {(['all', 'income', 'expense'] as const).map((type) => (
                <Button
                  key={type}
                  variant={filterType === type ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setFilterType(type)}
                  className={filterType === type ? '' : 'text-text-secondary hover:text-text'}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Button>
              ))}
            </div>

            {/* Sort */}
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setSortBy(sortBy === 'date' ? 'amount' : 'date')}
            >
              <ArrowUpDown className="w-4 h-4 mr-2" />
              Sort by {sortBy}
            </Button>

            {/* Export */}
            <Button variant="secondary" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Transactions List */}
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-6 py-4 text-sm font-medium text-text-secondary">Transaction</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-text-secondary">Category</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-text-secondary">Date</th>
                <th className="text-right px-6 py-4 text-sm font-medium text-text-secondary">Amount</th>
                <th className="text-right px-6 py-4 text-sm font-medium text-text-secondary">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredTransactions.map((transaction) => {
                const config = CATEGORY_CONFIG[transaction.category];
                return (
                  <motion.tr
                    key={transaction.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="hover:bg-surface-lighter transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center"
                          style={{ backgroundColor: `${config.color}15` }}
                        >
                          <span style={{ color: config.color }}>
                            {getCategoryIcon(transaction.category)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-text text-sm">{transaction.description}</p>
                          {transaction.recurring && (
                            <span className="badge badge-info text-xs">Recurring</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-text-secondary text-sm">{config.label}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-text-secondary text-sm">
                        {new Date(transaction.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span
                        className={`font-semibold text-sm ${
                          transaction.type === 'income' ? 'text-primary' : 'text-danger'
                        }`}
                      >
                        {transaction.type === 'income' ? '+' : '-'}
                        {formatCurrency(transaction.amount)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteTransaction(transaction.id)}
                        className="text-text-muted hover:text-danger hover:bg-red-50 h-9 w-9"
                        aria-label="Delete transaction"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredTransactions.length === 0 && (
          <div className="empty-state p-12 text-center">
            <p className="text-text-secondary">No transactions found</p>
            <Button className="mt-4" onClick={() => setShowAddModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Transaction
            </Button>
          </div>
        )}
      </Card>

      {/* Add Transaction Modal */}
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
              onClick={(e) => e.stopPropagation()}
            >
              <Card className="w-full max-w-md shadow-xl">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-heading-2">Add Transaction</h2>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowAddModal(false)}
                      aria-label="Close modal"
                    >
                      <X className="w-5 h-5 text-text-muted" />
                    </Button>
                  </div>

                  {formError && (
                    <div className="bg-red-50 border border-red-200 text-danger rounded-xl p-3 mb-4 text-sm">
                      {formError}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Type Toggle */}
                    <div className="flex bg-surface-lighter rounded-xl p-1">
                      <Button
                        type="button"
                        variant={formType === 'expense' ? 'destructive' : 'ghost'}
                        onClick={() => {
                          setFormType('expense');
                          setFormCategory('food');
                        }}
                        className="flex-1"
                      >
                        Expense
                      </Button>
                      <Button
                        type="button"
                        variant={formType === 'income' ? 'default' : 'ghost'}
                        onClick={() => {
                          setFormType('income');
                          setFormCategory('salary');
                        }}
                        className="flex-1"
                      >
                        Income
                      </Button>
                    </div>

                    {/* Amount & Date */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-text-secondary mb-2">Amount</label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">$</span>
                          <Input
                            type="number"
                            value={formAmount}
                            onChange={(e) => setFormAmount(e.target.value)}
                            placeholder="0.00"
                            step="0.01"
                            min="0"
                            required
                            className="pl-8"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-secondary mb-2">Date</label>
                        <Input
                          type="date"
                          value={formDate}
                          onChange={(e) => setFormDate(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    {/* Category */}
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">Category</label>
                      <div className="grid grid-cols-3 gap-2">
                        {categories.map((cat) => (
                          <Button
                            key={cat}
                            type="button"
                            variant={formCategory === cat ? 'outline' : 'ghost'}
                            onClick={() => setFormCategory(cat)}
                            className={`p-3 h-auto text-xs font-medium ${
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
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">Description</label>
                      <Input
                        type="text"
                        value={formDescription}
                        onChange={(e) => setFormDescription(e.target.value)}
                        placeholder="What was this for?"
                        required
                        maxLength={200}
                      />
                    </div>

                    {/* Recurring */}
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formRecurring}
                        onChange={(e) => setFormRecurring(e.target.checked)}
                        className="rounded border-border"
                      />
                      <span className="text-sm text-text">This is a recurring transaction</span>
                    </label>

                    {/* Submit */}
                    <Button type="submit" className="w-full h-12">
                      Add {formType === 'income' ? 'Income' : 'Expense'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
