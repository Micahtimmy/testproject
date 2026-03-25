import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import type { Transaction, Category } from '../types';
import { CATEGORY_CONFIG } from '../types';

interface SpendingChartProps {
  transactions: Transaction[];
}

interface ChartData {
  name: string;
  value: number;
  color: string;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function SpendingChart({ transactions }: SpendingChartProps) {
  const expenses = transactions.filter((t) => t.type === 'expense');

  if (expenses.length === 0) {
    return (
      <div className="bg-surface-light rounded-2xl p-6 border border-surface-lighter/50">
        <h3 className="font-semibold text-text mb-4">Spending by Category</h3>
        <div className="h-48 flex items-center justify-center text-text-muted">
          No expense data to display
        </div>
      </div>
    );
  }

  const categoryTotals = expenses.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {} as Record<Category, number>);

  const chartData: ChartData[] = Object.entries(categoryTotals)
    .map(([category, value]) => ({
      name: CATEGORY_CONFIG[category as Category].label,
      value,
      color: CATEGORY_CONFIG[category as Category].color,
    }))
    .sort((a, b) => b.value - a.value);

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="bg-surface-light rounded-2xl p-6 border border-surface-lighter/50">
      <h3 className="font-semibold text-text mb-4">Spending by Category</h3>
      <div className="flex items-center gap-6">
        <div className="w-48 h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload as ChartData;
                    return (
                      <div className="bg-surface px-3 py-2 rounded-lg border border-surface-lighter shadow-xl">
                        <p className="text-text font-medium">{data.name}</p>
                        <p className="text-text-muted text-sm">{formatCurrency(data.value)}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex-1 space-y-2">
          {chartData.slice(0, 5).map((item) => (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-text-muted">{item.name}</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-medium text-text">{formatCurrency(item.value)}</span>
                <span className="text-xs text-text-muted ml-2">
                  {((item.value / total) * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
