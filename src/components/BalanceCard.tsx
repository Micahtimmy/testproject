import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';

interface BalanceCardProps {
  balance: number;
  totalIncome: number;
  totalExpenses: number;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function BalanceCard({ balance, totalIncome, totalExpenses }: BalanceCardProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {/* Total Balance */}
      <div className="bg-gradient-to-br from-primary to-primary-dark rounded-2xl p-6 text-white shadow-lg shadow-primary/20">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-white/20 rounded-xl">
            <Wallet className="w-6 h-6" />
          </div>
          <span className="text-white/80 font-medium">Total Balance</span>
        </div>
        <p className="text-3xl font-bold tracking-tight">{formatCurrency(balance)}</p>
      </div>

      {/* Income */}
      <div className="bg-surface-light rounded-2xl p-6 border border-surface-lighter/50">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-success/20 rounded-xl">
            <TrendingUp className="w-6 h-6 text-success" />
          </div>
          <span className="text-text-muted font-medium">Income</span>
        </div>
        <p className="text-2xl font-bold text-success">{formatCurrency(totalIncome)}</p>
      </div>

      {/* Expenses */}
      <div className="bg-surface-light rounded-2xl p-6 border border-surface-lighter/50">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-danger/20 rounded-xl">
            <TrendingDown className="w-6 h-6 text-danger" />
          </div>
          <span className="text-text-muted font-medium">Expenses</span>
        </div>
        <p className="text-2xl font-bold text-danger">{formatCurrency(totalExpenses)}</p>
      </div>
    </div>
  );
}
