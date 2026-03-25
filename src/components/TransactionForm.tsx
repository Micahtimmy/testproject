import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import type { Transaction, TransactionType, Category } from '../types';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES, CATEGORY_CONFIG } from '../types';

interface TransactionFormProps {
  onAdd: (transaction: Omit<Transaction, 'id'>) => void;
}

export function TransactionForm({ onAdd }: TransactionFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<Category>('food');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description) return;

    onAdd({
      type,
      amount: parseFloat(amount),
      category,
      description,
      date,
    });

    setAmount('');
    setDescription('');
    setIsOpen(false);
  };

  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    setCategory(newType === 'income' ? 'salary' : 'food');
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white rounded-xl p-4 flex items-center justify-center gap-2 font-medium transition-all duration-300 shadow-lg shadow-primary/20 hover:shadow-primary/30"
      >
        <Plus className="w-5 h-5" />
        Add Transaction
      </button>
    );
  }

  return (
    <div className="bg-surface-light rounded-2xl p-6 border border-surface-lighter/50 animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-text">New Transaction</h3>
        <button
          onClick={() => setIsOpen(false)}
          className="p-2 hover:bg-surface-lighter rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-text-muted" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Transaction Type Toggle */}
        <div className="flex bg-surface rounded-xl p-1">
          <button
            type="button"
            onClick={() => handleTypeChange('expense')}
            className={`flex-1 py-2.5 rounded-lg font-medium transition-all duration-200 ${
              type === 'expense'
                ? 'bg-danger text-white shadow-lg'
                : 'text-text-muted hover:text-text'
            }`}
          >
            Expense
          </button>
          <button
            type="button"
            onClick={() => handleTypeChange('income')}
            className={`flex-1 py-2.5 rounded-lg font-medium transition-all duration-200 ${
              type === 'income'
                ? 'bg-success text-white shadow-lg'
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
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                step="0.01"
                min="0"
                required
                className="w-full bg-surface border border-surface-lighter rounded-xl py-3 pl-8 pr-4 text-text placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm text-text-muted mb-2">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full bg-surface border border-surface-lighter rounded-xl py-3 px-4 text-text focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
            />
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm text-text-muted mb-2">Category</label>
          <div className="grid grid-cols-4 gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`p-3 rounded-xl text-xs font-medium transition-all duration-200 ${
                  category === cat
                    ? 'ring-2 ring-primary bg-primary/20 text-white'
                    : 'bg-surface text-text-muted hover:bg-surface-lighter hover:text-text'
                }`}
                style={category === cat ? { backgroundColor: `${CATEGORY_CONFIG[cat].color}20` } : {}}
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
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What was this for?"
            required
            className="w-full bg-surface border border-surface-lighter rounded-xl py-3 px-4 text-text placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white rounded-xl py-3.5 font-medium transition-all duration-300 shadow-lg shadow-primary/20"
        >
          Add {type === 'income' ? 'Income' : 'Expense'}
        </button>
      </form>
    </div>
  );
}
