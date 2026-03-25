import { motion } from 'framer-motion';
import {
  Sparkles,
  TrendingUp,
  TrendingDown,
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
  saving: { bg: 'bg-success/10', border: 'border-success/20', text: 'text-success' },
  investment: { bg: 'bg-primary/10', border: 'border-primary/20', text: 'text-primary' },
  warning: { bg: 'bg-danger/10', border: 'border-danger/20', text: 'text-danger' },
  tip: { bg: 'bg-warning/10', border: 'border-warning/20', text: 'text-warning' },
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
          <h1 className="text-2xl font-bold text-text flex items-center gap-3">
            <Sparkles className="w-7 h-7 text-primary" />
            AI Insights
          </h1>
          <p className="text-text-muted">Personalized financial recommendations powered by AI</p>
        </div>
        <button
          onClick={refreshInsights}
          disabled={isAnalyzing}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl font-medium transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-5 h-5 ${isAnalyzing ? 'animate-spin' : ''}`} />
          {isAnalyzing ? 'Analyzing...' : 'Refresh Insights'}
        </button>
      </div>

      {/* AI Analysis Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-dark to-indigo-700 rounded-2xl p-6 text-white"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-white/20 backdrop-blur-xl rounded-xl">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">AI Financial Analysis</h2>
              <p className="text-white/70">Based on your spending patterns and financial goals</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-white/10 backdrop-blur-xl rounded-xl p-4">
              <p className="text-white/70 text-sm mb-1">Potential Savings</p>
              <p className="text-2xl font-bold">$847/mo</p>
            </div>
            <div className="bg-white/10 backdrop-blur-xl rounded-xl p-4">
              <p className="text-white/70 text-sm mb-1">Investment Opportunity</p>
              <p className="text-2xl font-bold">$2,400/yr</p>
            </div>
            <div className="bg-white/10 backdrop-blur-xl rounded-xl p-4">
              <p className="text-white/70 text-sm mb-1">Financial Health Score</p>
              <p className="text-2xl font-bold">78/100</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* High Priority Alerts */}
      {highPriorityInsights.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-text flex items-center gap-2">
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
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`glass-card p-5 border ${colors.border} relative group`}
                >
                  <button
                    onClick={() => dismissInsight(insight.id)}
                    className="absolute top-4 right-4 p-1.5 opacity-0 group-hover:opacity-100 hover:bg-surface-lighter rounded-lg transition-all"
                  >
                    <X className="w-4 h-4 text-text-muted" />
                  </button>

                  <div className="flex gap-4">
                    <div className={`p-3 rounded-xl ${colors.bg} h-fit`}>
                      <Icon className={`w-5 h-5 ${colors.text}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-text mb-1">{insight.title}</h3>
                      <p className="text-sm text-text-muted mb-3">{insight.description}</p>

                      {insight.impact && (
                        <div className="bg-surface dark:bg-surface light:bg-gray-50 rounded-lg p-3 mb-3">
                          <p className="text-sm text-text-muted">
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
          <h2 className="text-lg font-semibold text-text flex items-center gap-2">
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
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-card p-4 group"
                >
                  <div className="flex gap-3">
                    <div className={`p-2 rounded-lg ${colors.bg} h-fit`}>
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
          <h2 className="text-lg font-semibold text-text flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-success" />
            Investment Suggestions
          </h2>

          <div className="glass-card overflow-hidden">
            <div className="divide-y divide-surface-lighter/30 dark:divide-surface-lighter/30 light:divide-gray-100">
              {stocks.map((stock, index) => (
                <motion.div
                  key={stock.symbol}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 hover:bg-surface-lighter/20 dark:hover:bg-surface-lighter/20 light:hover:bg-gray-50/50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary-dark/20 flex items-center justify-center font-bold text-primary text-sm">
                        {stock.symbol.slice(0, 2)}
                      </div>
                      <div>
                        <p className="font-semibold text-text">{stock.symbol}</p>
                        <p className="text-xs text-text-muted">{stock.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-text">{formatCurrency(stock.price)}</p>
                      <div className={`flex items-center gap-1 text-xs ${stock.change >= 0 ? 'text-success' : 'text-danger'}`}>
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
                      className={`text-xs font-medium px-2 py-1 rounded-full ${
                        stock.recommendation === 'buy'
                          ? 'bg-success/20 text-success'
                          : stock.recommendation === 'sell'
                          ? 'bg-danger/20 text-danger'
                          : 'bg-warning/20 text-warning'
                      }`}
                    >
                      {stock.recommendation.toUpperCase()}
                    </span>
                    <p className="text-xs text-text-muted flex-1 ml-3 truncate">{stock.reason}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="p-4 border-t border-surface-lighter/30 dark:border-surface-lighter/30 light:border-gray-100">
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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-card p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-text flex items-center gap-2">
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
              color: 'from-emerald-500 to-teal-500',
            },
            {
              title: 'Vacation Savings',
              target: 5000,
              current: 2100,
              timeframe: '6 months',
              color: 'from-blue-500 to-cyan-500',
            },
            {
              title: 'Investment Portfolio',
              target: 50000,
              current: 23000,
              timeframe: '24 months',
              color: 'from-purple-500 to-pink-500',
            },
          ].map((goal, index) => (
            <motion.div
              key={goal.title}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className="bg-surface dark:bg-surface light:bg-gray-50 rounded-xl p-5"
            >
              <h3 className="font-semibold text-text mb-1">{goal.title}</h3>
              <p className="text-xs text-text-muted mb-4">Target: {goal.timeframe}</p>

              <div className="flex justify-between text-sm mb-2">
                <span className="text-text">{formatCurrency(goal.current)}</span>
                <span className="text-text-muted">{formatCurrency(goal.target)}</span>
              </div>

              <div className="w-full bg-surface-lighter rounded-full h-2.5">
                <div
                  className={`h-2.5 rounded-full bg-gradient-to-r ${goal.color}`}
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
