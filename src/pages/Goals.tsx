import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Target,
  Plus,
  X,
  CheckCircle,
  Circle,
  TrendingUp,
  PiggyBank,
  CreditCard,
  ShoppingBag,
  Shield,
  MoreHorizontal,
  Calendar,
  Flag,
  ChevronRight,
  Trash2,
} from 'lucide-react';
import { useGoals } from '../hooks/useGoals';
import type { Goal } from '../hooks/useGoals';
import { EmptyState } from '../components/illustrations/EmptyState';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

const categoryIcons = {
  savings: PiggyBank,
  investment: TrendingUp,
  debt: CreditCard,
  purchase: ShoppingBag,
  emergency: Shield,
  other: MoreHorizontal,
};

const categoryColors = {
  savings: { bg: 'bg-primary-light', text: 'text-primary' },
  investment: { bg: 'bg-blue-50', text: 'text-blue-600' },
  debt: { bg: 'bg-red-50', text: 'text-danger' },
  purchase: { bg: 'bg-purple-50', text: 'text-purple-600' },
  emergency: { bg: 'bg-amber-50', text: 'text-warning' },
  other: { bg: 'bg-gray-100', text: 'text-text-secondary' },
};

const priorityConfig = {
  high: { label: 'High', color: 'badge-danger' },
  medium: { label: 'Medium', color: 'badge-warning' },
  low: { label: 'Low', color: 'badge-neutral' },
};

export function Goals() {
  const {
    activeGoals,
    completedGoals,
    totalProgress,
    overallProgressPercent,
    addGoal,
    updateGoal,
    deleteGoal,
    toggleMilestone,
  } = useGoals();

  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [showCompleted, setShowCompleted] = useState(false);

  // Form state
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formTarget, setFormTarget] = useState('');
  const [formDeadline, setFormDeadline] = useState('');
  const [formCategory, setFormCategory] = useState<Goal['category']>('savings');
  const [formPriority, setFormPriority] = useState<Goal['priority']>('medium');
  const [formError, setFormError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!formTitle.trim()) {
      setFormError('Please enter a goal title');
      return;
    }

    const result = addGoal({
      title: formTitle,
      description: formDescription || undefined,
      targetAmount: formTarget ? parseFloat(formTarget) : undefined,
      currentAmount: 0,
      deadline: formDeadline || undefined,
      category: formCategory,
      priority: formPriority,
      status: 'active',
    });

    if (result.success) {
      setFormTitle('');
      setFormDescription('');
      setFormTarget('');
      setFormDeadline('');
      setFormCategory('savings');
      setFormPriority('medium');
      setShowAddModal(false);
    } else {
      setFormError(result.error || 'Failed to create goal');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-heading-1 flex items-center gap-3">
            <Target className="w-7 h-7 text-primary" />
            Financial Goals
          </h1>
          <p className="text-body-sm mt-1">Track your progress towards financial freedom</p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="w-5 h-5 mr-2" />
          New Goal
        </Button>
      </div>

      {/* Progress Overview */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="card gradient-primary text-white"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <p className="text-white/70 text-sm mb-1">Overall Progress</p>
            <p className="text-4xl font-semibold">{overallProgressPercent.toFixed(0)}%</p>
            <p className="text-white/70 text-sm mt-2">
              {formatCurrency(totalProgress.current)} of {formatCurrency(totalProgress.target)} saved
            </p>
          </div>

          <div className="flex-1 max-w-md">
            <div className="h-3 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(overallProgressPercent, 100)}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full bg-white rounded-full"
              />
            </div>
          </div>

          <div className="flex gap-6">
            <div className="text-center">
              <p className="text-3xl font-semibold">{activeGoals.length}</p>
              <p className="text-white/70 text-sm">Active</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-semibold">{completedGoals.length}</p>
              <p className="text-white/70 text-sm">Completed</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Active Goals */}
      {activeGoals.length === 0 ? (
        <EmptyState
          type="goals"
          title="No active goals"
          description="Set your first financial goal to start tracking your progress towards financial freedom."
          action={{ label: 'Create Goal', onClick: () => setShowAddModal(true) }}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {activeGoals.map((goal, index) => {
            const Icon = categoryIcons[goal.category];
            const colors = categoryColors[goal.category];
            const progress = goal.targetAmount && goal.currentAmount !== undefined
              ? (goal.currentAmount / goal.targetAmount) * 100
              : 0;

            return (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card
                  className="hover:shadow-md transition-shadow cursor-pointer group h-full"
                  onClick={() => setSelectedGoal(goal)}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center`}>
                          <Icon className={`w-6 h-6 ${colors.text}`} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-text">{goal.title}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`badge ${priorityConfig[goal.priority].color}`}>
                              {priorityConfig[goal.priority].label}
                            </span>
                            {goal.deadline && (
                              <span className="text-xs text-text-muted flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(goal.deadline).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>

                    {goal.description && (
                      <p className="text-sm text-text-secondary mb-4 line-clamp-2">{goal.description}</p>
                    )}

                    {goal.targetAmount && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-text font-medium">{formatCurrency(goal.currentAmount || 0)}</span>
                          <span className="text-text-muted">{formatCurrency(goal.targetAmount)}</span>
                        </div>
                        <div className="progress">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(progress, 100)}%` }}
                            transition={{ duration: 0.5, ease: 'easeOut' }}
                            className={`progress-bar ${progress >= 100 ? 'bg-primary' : progress >= 75 ? 'bg-primary' : progress >= 50 ? 'bg-warning' : 'bg-primary'}`}
                          />
                        </div>
                        <p className="text-xs text-text-muted text-right">{progress.toFixed(0)}% complete</p>
                      </div>
                    )}

                    {goal.milestones && goal.milestones.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-border">
                        <p className="text-xs font-medium text-text-secondary mb-2">Milestones</p>
                        <div className="space-y-2">
                          {goal.milestones.slice(0, 3).map((milestone) => (
                            <Button
                              key={milestone.id}
                              variant="ghost"
                              className="w-full justify-start p-1 h-auto text-sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleMilestone(goal.id, milestone.id);
                              }}
                            >
                              {milestone.completed ? (
                                <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mr-2" />
                              ) : (
                                <Circle className="w-4 h-4 text-text-muted flex-shrink-0 mr-2" />
                              )}
                              <span className={milestone.completed ? 'text-text-muted line-through' : 'text-text'}>
                                {milestone.title}
                              </span>
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Completed Goals Toggle */}
      {completedGoals.length > 0 && (
        <div>
          <Button
            variant="ghost"
            onClick={() => setShowCompleted(!showCompleted)}
            className="text-text-secondary hover:text-text"
          >
            <ChevronRight className={`w-4 h-4 transition-transform mr-2 ${showCompleted ? 'rotate-90' : ''}`} />
            Completed Goals ({completedGoals.length})
          </Button>

          <AnimatePresence>
            {showCompleted && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
                  {completedGoals.map((goal) => {
                    const Icon = categoryIcons[goal.category];
                    const colors = categoryColors[goal.category];

                    return (
                      <Card key={goal.id} className="bg-surface-lighter opacity-75">
                        <CardContent className="pt-6">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl ${colors.bg} flex items-center justify-center`}>
                              <Icon className={`w-5 h-5 ${colors.text}`} />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-text">{goal.title}</h4>
                              {goal.targetAmount && (
                                <p className="text-sm text-text-muted">{formatCurrency(goal.targetAmount)} achieved</p>
                              )}
                            </div>
                            <CheckCircle className="w-5 h-5 text-primary" />
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Add Goal Modal */}
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
              <Card className="w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-heading-2">Create New Goal</h2>
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
                    {/* Title */}
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">Goal Title</label>
                      <Input
                        type="text"
                        value={formTitle}
                        onChange={(e) => setFormTitle(e.target.value)}
                        placeholder="e.g., Build Emergency Fund"
                        required
                        maxLength={100}
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">Description (optional)</label>
                      <textarea
                        value={formDescription}
                        onChange={(e) => setFormDescription(e.target.value)}
                        placeholder="What's this goal about?"
                        rows={2}
                        maxLength={300}
                        className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </div>

                    {/* Target Amount & Deadline */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-text-secondary mb-2">Target Amount</label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">$</span>
                          <Input
                            type="number"
                            value={formTarget}
                            onChange={(e) => setFormTarget(e.target.value)}
                            placeholder="0"
                            min="0"
                            step="1"
                            className="pl-8"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-secondary mb-2">Deadline</label>
                        <Input
                          type="date"
                          value={formDeadline}
                          onChange={(e) => setFormDeadline(e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Category */}
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">Category</label>
                      <div className="grid grid-cols-3 gap-2">
                        {(Object.keys(categoryIcons) as Goal['category'][]).map((cat) => {
                          const Icon = categoryIcons[cat];
                          const colors = categoryColors[cat];
                          return (
                            <Button
                              key={cat}
                              type="button"
                              variant={formCategory === cat ? 'outline' : 'ghost'}
                              onClick={() => setFormCategory(cat)}
                              className={`p-3 h-auto flex flex-col items-center gap-2 ${
                                formCategory === cat
                                  ? `border-primary ${colors.bg}`
                                  : 'border-border bg-surface-lighter hover:border-text-muted'
                              }`}
                            >
                              <Icon className={`w-5 h-5 ${formCategory === cat ? colors.text : 'text-text-muted'}`} />
                              <span className="capitalize text-xs">{cat}</span>
                            </Button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Priority */}
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">Priority</label>
                      <div className="flex bg-surface-lighter rounded-xl p-1">
                        {(['low', 'medium', 'high'] as const).map((priority) => (
                          <Button
                            key={priority}
                            type="button"
                            variant={formPriority === priority ? (priority === 'high' ? 'destructive' : 'default') : 'ghost'}
                            onClick={() => setFormPriority(priority)}
                            className={`flex-1 ${
                              formPriority === priority && priority === 'medium' ? 'bg-warning text-white hover:bg-warning/90' : ''
                            } ${formPriority === priority && priority === 'low' ? 'bg-text-muted text-white hover:bg-text-muted/90' : ''}`}
                          >
                            <Flag className="w-4 h-4 mr-2" />
                            {priority.charAt(0).toUpperCase() + priority.slice(1)}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Submit */}
                    <Button type="submit" className="w-full h-12">
                      Create Goal
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Goal Detail Modal */}
      <AnimatePresence>
        {selectedGoal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedGoal(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Card className="w-full max-w-lg shadow-xl">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-3">
                      {(() => {
                        const Icon = categoryIcons[selectedGoal.category];
                        const colors = categoryColors[selectedGoal.category];
                        return (
                          <div className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center`}>
                            <Icon className={`w-6 h-6 ${colors.text}`} />
                          </div>
                        );
                      })()}
                      <div>
                        <h2 className="text-heading-2">{selectedGoal.title}</h2>
                        <span className={`badge ${priorityConfig[selectedGoal.priority].color}`}>
                          {priorityConfig[selectedGoal.priority].label} Priority
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelectedGoal(null)}
                    >
                      <X className="w-5 h-5 text-text-muted" />
                    </Button>
                  </div>

                  {selectedGoal.description && (
                    <p className="text-text-secondary mb-6">{selectedGoal.description}</p>
                  )}

                  {selectedGoal.targetAmount && (
                    <div className="bg-surface-lighter rounded-xl p-4 mb-6">
                      <div className="flex justify-between mb-2">
                        <span className="text-text-secondary">Progress</span>
                        <span className="font-semibold text-text">
                          {formatCurrency(selectedGoal.currentAmount || 0)} / {formatCurrency(selectedGoal.targetAmount)}
                        </span>
                      </div>
                      <div className="progress h-3">
                        <div
                          className="progress-bar"
                          style={{
                            width: `${Math.min(((selectedGoal.currentAmount || 0) / selectedGoal.targetAmount) * 100, 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {selectedGoal.milestones && selectedGoal.milestones.length > 0 && (
                    <div className="mb-6">
                      <h4 className="font-medium text-text mb-3">Milestones</h4>
                      <div className="space-y-2">
                        {selectedGoal.milestones.map((milestone) => (
                          <Button
                            key={milestone.id}
                            variant="ghost"
                            onClick={() => toggleMilestone(selectedGoal.id, milestone.id)}
                            className="w-full justify-start p-3 h-auto bg-surface-lighter hover:bg-border"
                          >
                            {milestone.completed ? (
                              <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mr-3" />
                            ) : (
                              <Circle className="w-5 h-5 text-text-muted flex-shrink-0 mr-3" />
                            )}
                            <span className={milestone.completed ? 'text-text-muted line-through' : 'text-text'}>
                              {milestone.title}
                            </span>
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3">
                    {selectedGoal.status === 'active' && (
                      <Button
                        onClick={() => {
                          updateGoal(selectedGoal.id, { status: 'completed' });
                          setSelectedGoal(null);
                        }}
                        className="flex-1"
                      >
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Mark Complete
                      </Button>
                    )}
                    <Button
                      variant="secondary"
                      onClick={() => {
                        deleteGoal(selectedGoal.id);
                        setSelectedGoal(null);
                      }}
                      className="text-danger hover:bg-red-50"
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
