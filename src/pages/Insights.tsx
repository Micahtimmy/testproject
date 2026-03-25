import { motion } from 'framer-motion';
import {
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  PiggyBank,
  Target,
  Zap,
  ExternalLink,
  X,
} from 'lucide-react';
import { useTransactions } from '../hooks/useTransactions';
import { useBudgets } from '../hooks/useBudgets';
import { useAIInsights } from '../hooks/useAIInsights';

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

const insightIcons = {
  saving: PiggyBank,
  investment: TrendingUp,
  warning: AlertTriangle,
  tip: Lightbulb,
};

const insightColors = {
  saving: { bg: 'bg-primary-light', border: 'border-primary-light', text: 'text-primary' },
  investment: { bg: 'bg-blue-50', border: 'border-blue-100', text: 'text-blue-600' },
  warning: { bg: 'bg-red-50', border: 'border-red-100', text: 'text-danger' },
  tip: { bg: 'bg-amber-50', border: 'border-amber-100', text: 'text-warning' },
};

export function Insights() {
  const { transactions } = useTransactions();
  const { budgets } = useBudgets();
  const { insights, stocks, isAnalyzing, refreshInsights, dismissInsight } = useAIInsights(transactions, budgets);

  const highPriorityInsights = insights.filter((i) => i.priority === 'high');
  const otherInsights = insights.filter((i) => i.priority !== 'high');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-heading-1 flex items-center gap-3">
            <Sparkles className="w-7 h-7 text-primary" />
            AI Insights
          </h1>
          <p className="text-body-sm mt-1">Personalized financial recommendations powered by AI</p>
        </div>
        <button
          onClick={refreshInsights}
          disabled={isAnalyzing}
          className="btn btn-secondary"
        >
          <RefreshCw className={`w-5 h-5 ${isAnalyzing ? 'animate-spin' : ''}`} />
          {isAnalyzing ? 'Analyzing...' : 'Refresh Insights'}
        </button>
      </div>

      {/* AI Analysis Banner */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden gradient-primary rounded-2xl p-6 text-white"
      >
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">AI Financial Analysis</h2>
              <p className="text-white/70 text-sm">Based on your spending patterns and financial goals</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <p className="text-white/70 text-sm mb-1">Potential Savings</p>
              <p className="text-2xl font-semibold">$847/mo</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <p className="text-white/70 text-sm mb-1">Investment Opportunity</p>
              <p className="text-2xl font-semibold">$2,400/yr</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <p className="text-white/70 text-sm mb-1">Financial Health Score</p>
              <p className="text-2xl font-semibold">78/100</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* High Priority Alerts */}
      {highPriorityInsights.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-heading-3 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-danger" />
            Requires Attention
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {highPriorityInsights.map((insight, index) => {
              const Icon = insightIcons[insight.type];
              const colors = insightColors[insight.type];

              return (
                <motion.div
                  key={insight.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`card border ${colors.border} relative group`}
                >
                  <button
                    onClick={() => dismissInsight(insight.id)}
                    className="absolute top-4 right-4 p-1.5 opacity-0 group-hover:opacity-100 hover:bg-surface-lighter rounded-lg transition-all"
                    aria-label="Dismiss insight"
                  >
                    <X className="w-4 h-4 text-text-muted" />
                  </button>

                  <div className="flex gap-4">
                    <div className={`w-10 h-10 rounded-xl ${colors.bg} flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-5 h-5 ${colors.text}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-text text-sm mb-1">{insight.title}</h3>
                      <p className="text-xs text-text-secondary mb-3">{insight.description}</p>

                      {insight.impact && (
                        <div className="bg-surface-lighter rounded-lg p-3 mb-3">
                          <p className="text-xs text-text-secondary">
                            <span className="font-medium text-text">Impact: </span>
                            {insight.impact}
                          </p>
                        </div>
                      )}

                      {insight.action && (
                        <button className={`text-sm font-medium ${colors.text} hover:underline flex items-center gap-1`}>
                          {insight.action}
                          <ArrowUpRight className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recommendations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Recommendations */}
        <div className="space-y-4">
          <h2 className="text-heading-3 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-warning" />
            Smart Recommendations
          </h2>

          <div className="space-y-3">
            {otherInsights.map((insight, index) => {
              const Icon = insightIcons[insight.type];
              const colors = insightColors[insight.type];

              return (
                <motion.div
                  key={insight.id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="card card-sm group"
                >
                  <div className="flex gap-3">
                    <div className={`w-8 h-8 rounded-lg ${colors.bg} flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-4 h-4 ${colors.text}`} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-text text-sm">{insight.title}</h4>
                      <p className="text-xs text-text-muted mt-1">{insight.description}</p>
                      {insight.impact && (
                        <p className="text-xs text-primary mt-2 font-medium">{insight.impact}</p>
                      )}
                    </div>
                    <button
                      onClick={() => dismissInsight(insight.id)}
                      className="p-1 opacity-0 group-hover:opacity-100 hover:bg-surface-lighter rounded transition-all h-fit"
                      aria-label="Dismiss insight"
                    >
                      <X className="w-3 h-3 text-text-muted" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Stock Suggestions */}
        <div className="space-y-4">
          <h2 className="text-heading-3 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Investment Suggestions
          </h2>

          <div className="card p-0 overflow-hidden">
            <div className="divide-y divide-border">
              {stocks.map((stock, index) => (
                <motion.div
                  key={stock.symbol}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 hover:bg-surface-lighter transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center font-semibold text-primary text-sm">
                        {stock.symbol.slice(0, 2)}
                      </div>
                      <div>
                        <p className="font-semibold text-text text-sm">{stock.symbol}</p>
                        <p className="text-xs text-text-muted">{stock.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-text text-sm">{formatCurrency(stock.price)}</p>
                      <div className={`flex items-center gap-1 text-xs ${stock.change >= 0 ? 'text-primary' : 'text-danger'}`}>
                        {stock.change >= 0 ? (
                          <ArrowUpRight className="w-3 h-3" />
                        ) : (
                          <ArrowDownRight className="w-3 h-3" />
                        )}
                        <span>{stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <span
                      className={`badge ${
                        stock.recommendation === 'buy'
                          ? 'badge-success'
                          : stock.recommendation === 'sell'
                          ? 'badge-danger'
                          : 'badge-warning'
                      }`}
                    >
                      {stock.recommendation.toUpperCase()}
                    </span>
                    <p className="text-xs text-text-muted flex-1 ml-3 truncate">{stock.reason}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="p-4 border-t border-border">
              <button className="w-full text-sm text-primary hover:text-primary-dark font-medium flex items-center justify-center gap-2 transition-colors">
                View All Investment Options
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Financial Goals */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-heading-3 flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Suggested Financial Goals
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              title: 'Emergency Fund',
              target: 15000,
              current: 8500,
              timeframe: '12 months',
              color: 'from-primary to-teal-400',
            },
            {
              title: 'Vacation Savings',
              target: 5000,
              current: 2100,
              timeframe: '6 months',
              color: 'from-blue-500 to-cyan-400',
            },
            {
              title: 'Investment Portfolio',
              target: 50000,
              current: 23000,
              timeframe: '24 months',
              color: 'from-purple-500 to-pink-400',
            },
          ].map((goal, index) => (
            <motion.div
              key={goal.title}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.35 + index * 0.05 }}
              className="bg-surface-lighter rounded-xl p-5"
            >
              <h3 className="font-semibold text-text text-sm mb-1">{goal.title}</h3>
              <p className="text-xs text-text-muted mb-4">Target: {goal.timeframe}</p>

              <div className="flex justify-between text-sm mb-2">
                <span className="text-text font-medium">{formatCurrency(goal.current)}</span>
                <span className="text-text-muted">{formatCurrency(goal.target)}</span>
              </div>

              <div className="progress">
                <div
                  className={`progress-bar bg-gradient-to-r ${goal.color}`}
                  style={{ width: `${(goal.current / goal.target) * 100}%` }}
                />
              </div>

              <p className="text-xs text-text-muted mt-3">
                {((goal.current / goal.target) * 100).toFixed(0)}% complete
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
