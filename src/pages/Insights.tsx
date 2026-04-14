import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
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
  ChevronRight,
  Info,
} from 'lucide-react';
import { useTransactions } from '../hooks/useTransactions';
import { useBudgets } from '../hooks/useBudgets';
import { useAIInsights } from '../hooks/useAIInsights';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

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

// Map insight actions to actual routes or actions
const actionRoutes: Record<string, string> = {
  'Review subscriptions and recurring expenses': '/transactions?filter=recurring',
  'Set up automatic savings transfer': '/goals',
  'Review budget allocations': '/budgets',
  'Explore investment options': '/insights#investments',
};

// External finance platforms for stocks
const stockPlatforms: Record<string, string> = {
  AAPL: 'https://finance.yahoo.com/quote/AAPL',
  GOOGL: 'https://finance.yahoo.com/quote/GOOGL',
  MSFT: 'https://finance.yahoo.com/quote/MSFT',
  AMZN: 'https://finance.yahoo.com/quote/AMZN',
  NVDA: 'https://finance.yahoo.com/quote/NVDA',
  TSLA: 'https://finance.yahoo.com/quote/TSLA',
  VOO: 'https://finance.yahoo.com/quote/VOO',
  VTI: 'https://finance.yahoo.com/quote/VTI',
};

export function Insights() {
  const { transactions } = useTransactions();
  const { budgets } = useBudgets();
  const { insights, stocks, isAnalyzing, refreshInsights, dismissInsight } = useAIInsights(transactions, budgets);
  const [selectedStock, setSelectedStock] = useState<string | null>(null);

  const highPriorityInsights = insights.filter((i) => i.priority === 'high');
  const otherInsights = insights.filter((i) => i.priority !== 'high');

  const handleInsightAction = (action: string) => {
    const route = actionRoutes[action];
    if (route) {
      if (route.startsWith('/')) {
        window.location.href = route;
      }
    }
  };

  const openStockDetails = (symbol: string) => {
    const url = stockPlatforms[symbol] || `https://finance.yahoo.com/quote/${symbol}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-heading-1 flex items-center gap-3">
            <Sparkles className="w-7 h-7 text-primary" />
            AI Insights
          </h1>
          <p className="text-body-sm mt-1">Personalized financial recommendations powered by AI</p>
        </div>
        <Button
          onClick={refreshInsights}
          disabled={isAnalyzing}
          variant="secondary"
          className="gap-2"
        >
          <RefreshCw className={`w-5 h-5 ${isAnalyzing ? 'animate-spin' : ''}`} />
          {isAnalyzing ? 'Analyzing...' : 'Refresh Insights'}
        </Button>
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
            <Link to="/budgets" className="bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/20 transition-colors cursor-pointer">
              <p className="text-white/70 text-sm mb-1">Potential Savings</p>
              <p className="text-2xl font-semibold">$847/mo</p>
              <p className="text-white/60 text-xs mt-1 flex items-center gap-1">
                View budgets <ChevronRight className="w-3 h-3" />
              </p>
            </Link>
            <Link to="/goals" className="bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/20 transition-colors cursor-pointer">
              <p className="text-white/70 text-sm mb-1">Investment Opportunity</p>
              <p className="text-2xl font-semibold">$2,400/yr</p>
              <p className="text-white/60 text-xs mt-1 flex items-center gap-1">
                Set goals <ChevronRight className="w-3 h-3" />
              </p>
            </Link>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <p className="text-white/70 text-sm mb-1">Financial Health Score</p>
              <p className="text-2xl font-semibold">78/100</p>
              <div className="mt-2 h-1.5 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-white rounded-full" style={{ width: '78%' }} />
              </div>
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
                >
                  <Card className={`border ${colors.border} relative group h-full`}>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => dismissInsight(insight.id)}
                      className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 h-8 w-8"
                      aria-label="Dismiss insight"
                    >
                      <X className="w-4 h-4 text-text-muted" />
                    </Button>

                    <CardContent className="pt-6">
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
                            <Button
                              variant="link"
                              className={`p-0 h-auto ${colors.text} text-sm font-medium`}
                              onClick={() => handleInsightAction(insight.action!)}
                            >
                              {insight.action}
                              <ArrowUpRight className="w-4 h-4 ml-1" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recommendations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
                >
                  <Card className="group hover:shadow-md transition-shadow">
                    <CardContent className="py-4">
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
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => dismissInsight(insight.id)}
                          className="opacity-0 group-hover:opacity-100 h-6 w-6"
                          aria-label="Dismiss insight"
                        >
                          <X className="w-3 h-3 text-text-muted" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Stock Suggestions */}
        <div className="space-y-4" id="investments">
          <div className="flex items-center justify-between">
            <h2 className="text-heading-3 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Investment Suggestions
            </h2>
            <Button
              variant="ghost"
              size="sm"
              className="text-text-muted"
              onClick={() => window.open('https://finance.yahoo.com', '_blank', 'noopener,noreferrer')}
            >
              <Info className="w-4 h-4 mr-1" />
              Data from Yahoo Finance
            </Button>
          </div>

          <Card className="p-0 overflow-hidden">
            <div className="divide-y divide-border">
              {stocks.map((stock, index) => (
                <motion.button
                  key={stock.symbol}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => openStockDetails(stock.symbol)}
                  className="w-full p-4 hover:bg-surface-lighter transition-colors text-left cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center font-semibold text-primary text-sm">
                        {stock.symbol.slice(0, 2)}
                      </div>
                      <div>
                        <p className="font-semibold text-text text-sm flex items-center gap-1">
                          {stock.symbol}
                          <ExternalLink className="w-3 h-3 text-text-muted" />
                        </p>
                        <p className="text-xs text-text-muted">{stock.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-text text-sm">{formatCurrency(stock.price)}</p>
                      <div className={`flex items-center justify-end gap-1 text-xs ${stock.change >= 0 ? 'text-primary' : 'text-danger'}`}>
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
                </motion.button>
              ))}
            </div>

            <div className="p-4 border-t border-border">
              <Button
                variant="ghost"
                className="w-full text-primary hover:text-primary-dark"
                onClick={() => window.open('https://finance.yahoo.com/markets/', '_blank', 'noopener,noreferrer')}
              >
                View All Investment Options on Yahoo Finance
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Financial Goals - Link to Goals Page */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                Suggested Financial Goals
              </CardTitle>
              <Button variant="outline" size="sm" asChild>
                <Link to="/goals">
                  Manage Goals
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            </div>
            <CardDescription>
              Track your progress towards financial freedom
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  title: 'Emergency Fund',
                  target: 15000,
                  current: 8500,
                  timeframe: '12 months',
                  color: 'from-primary to-teal-400',
                  link: '/goals',
                },
                {
                  title: 'Vacation Savings',
                  target: 5000,
                  current: 2100,
                  timeframe: '6 months',
                  color: 'from-blue-500 to-cyan-400',
                  link: '/goals',
                },
                {
                  title: 'Investment Portfolio',
                  target: 50000,
                  current: 23000,
                  timeframe: '24 months',
                  color: 'from-purple-500 to-pink-400',
                  link: '/goals',
                },
              ].map((goal, index) => (
                <motion.div
                  key={goal.title}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.35 + index * 0.05 }}
                >
                  <Link
                    to={goal.link}
                    className="block bg-surface-lighter rounded-xl p-5 hover:shadow-md transition-all hover:-translate-y-0.5"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-text text-sm">{goal.title}</h3>
                      <ChevronRight className="w-4 h-4 text-text-muted" />
                    </div>
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
                  </Link>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stock Detail Modal */}
      <AnimatePresence>
        {selectedStock && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedStock(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Card className="w-full max-w-md">
                <CardHeader>
                  <CardTitle>Stock Details</CardTitle>
                  <CardDescription>View more information on Yahoo Finance</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    className="w-full"
                    onClick={() => openStockDetails(selectedStock)}
                  >
                    Open in Yahoo Finance
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
