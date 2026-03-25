import { Trash2, Briefcase, Laptop, TrendingUp, Utensils, Car, Gamepad2, ShoppingBag, Receipt, Heart, MoreHorizontal } from 'lucide-react';
import type { Transaction, Category } from '../types';
import { CATEGORY_CONFIG } from '../types';

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Briefcase,
  Laptop,
  TrendingUp,
  Utensils,
  Car,
  Gamepad2,
  ShoppingBag,
  Receipt,
  Heart,
  MoreHorizontal,
};

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

function getCategoryIcon(category: Category) {
  const config = CATEGORY_CONFIG[category];
  const Icon = iconMap[config.icon];
  return Icon ? <Icon className="w-5 h-5" /> : null;
}

export function TransactionList({ transactions, onDelete }: TransactionListProps) {
  if (transactions.length === 0) {
    return (
      <div className="bg-surface-light rounded-2xl p-12 text-center border border-surface-lighter/50">
        <p className="text-text-muted">No transactions yet. Add one to get started!</p>
      </div>
    );
  }

  return (
    <div className="bg-surface-light rounded-2xl border border-surface-lighter/50 overflow-hidden">
      <div className="p-4 border-b border-surface-lighter/50">
        <h3 className="font-semibold text-text">Recent Transactions</h3>
      </div>
      <div className="divide-y divide-surface-lighter/30">
        {transactions.slice(0, 10).map((transaction) => {
          const config = CATEGORY_CONFIG[transaction.category];
          return (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-4 hover:bg-surface-lighter/30 transition-colors group"
            >
              <div className="flex items-center gap-4">
                <div
                  className="p-2.5 rounded-xl"
                  style={{ backgroundColor: `${config.color}20` }}
                >
                  <span style={{ color: config.color }}>{getCategoryIcon(transaction.category)}</span>
                </div>
                <div>
                  <p className="font-medium text-text">{transaction.description}</p>
                  <p className="text-sm text-text-muted">
                    {config.label} • {formatDate(transaction.date)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span
                  className={`font-semibold ${
                    transaction.type === 'income' ? 'text-success' : 'text-danger'
                  }`}
                >
                  {transaction.type === 'income' ? '+' : '-'}
                  {formatCurrency(transaction.amount)}
                </span>
                <button
                  onClick={() => onDelete(transaction.id)}
                  className="p-2 opacity-0 group-hover:opacity-100 hover:bg-danger/20 rounded-lg transition-all"
                >
                  <Trash2 className="w-4 h-4 text-danger" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
