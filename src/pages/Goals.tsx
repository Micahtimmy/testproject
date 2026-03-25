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
        <button onClick={() => setShowAddModal(true)} className="btn btn-primary">
          <Plus className="w-5 h-5" />
          New Goal
        </button>
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
                className="card hover-lift cursor-pointer group"
                onClick={() => setSelectedGoal(goal)}
              >
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
                        <div
                          key={milestone.id}
                          className="flex items-center gap-2 text-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleMilestone(goal.id, milestone.id);
                          }}
                        >
                          {milestone.completed ? (
                            <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                          ) : (
                            <Circle className="w-4 h-4 text-text-muted flex-shrink-0" />
                          )}
                          <span className={milestone.completed ? 'text-text-muted line-through' : 'text-text'}>
                            {milestone.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Completed Goals Toggle */}
      {completedGoals.length > 0 && (
        <div>
          <button
            onClick={() => setShowCompleted(!showCompleted)}
            className="flex items-center gap-2 text-text-secondary hover:text-text transition-colors"
          >
            <ChevronRight className={`w-4 h-4 transition-transform ${showCompleted ? 'rotate-90' : ''}`} />
            <span className="font-medium">Completed Goals ({completedGoals.length})</span>
          </button>

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
                      <div key={goal.id} className="card bg-surface-lighter opacity-75">
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
                      </div>
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
              className="card w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-heading-2">Create New Goal</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 hover:bg-surface-lighter rounded-lg transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5 text-text-muted" />
                </button>
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
                  <input
                    type="text"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="e.g., Build Emergency Fund"
                    required
                    maxLength={100}
                    className="input"
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
                    className="input h-auto py-3"
                  />
                </div>

                {/* Target Amount & Deadline */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">Target Amount</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">$</span>
                      <input
                        type="number"
                        value={formTarget}
                        onChange={(e) => setFormTarget(e.target.value)}
                        placeholder="0"
                        min="0"
                        step="1"
                        className="input"
                        style={{ paddingLeft: '32px' }}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">Deadline</label>
                    <input
                      type="date"
                      value={formDeadline}
                      onChange={(e) => setFormDeadline(e.target.value)}
                      className="input"
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
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setFormCategory(cat)}
                          className={`p-3 rounded-xl text-xs font-medium transition-all border flex flex-col items-center gap-2 ${
                            formCategory === cat
                              ? `border-primary ${colors.bg}`
                              : 'border-border bg-surface-lighter hover:border-text-muted'
                          }`}
                        >
                          <Icon className={`w-5 h-5 ${formCategory === cat ? colors.text : 'text-text-muted'}`} />
                          <span className="capitalize">{cat}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Priority */}
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Priority</label>
                  <div className="flex bg-surface-lighter rounded-xl p-1">
                    {(['low', 'medium', 'high'] as const).map((priority) => (
                      <button
                        key={priority}
                        type="button"
                        onClick={() => setFormPriority(priority)}
                        className={`flex-1 py-2.5 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2 ${
                          formPriority === priority
                            ? priority === 'high'
                              ? 'bg-danger text-white'
                              : priority === 'medium'
                              ? 'bg-warning text-white'
                              : 'bg-text-muted text-white'
                            : 'text-text-secondary hover:text-text'
                        }`}
                      >
                        <Flag className="w-4 h-4" />
                        {priority.charAt(0).toUpperCase() + priority.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit */}
                <button type="submit" className="btn btn-primary w-full h-12">
                  Create Goal
                </button>
              </form>
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
              className="card w-full max-w-lg shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
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
                <button
                  onClick={() => setSelectedGoal(null)}
                  className="p-2 hover:bg-surface-lighter rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-text-muted" />
                </button>
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
                      <button
                        key={milestone.id}
                        onClick={() => toggleMilestone(selectedGoal.id, milestone.id)}
                        className="w-full flex items-center gap-3 p-3 bg-surface-lighter rounded-xl hover:bg-border transition-colors text-left"
                      >
                        {milestone.completed ? (
                          <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                        ) : (
                          <Circle className="w-5 h-5 text-text-muted flex-shrink-0" />
                        )}
                        <span className={milestone.completed ? 'text-text-muted line-through' : 'text-text'}>
                          {milestone.title}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                {selectedGoal.status === 'active' && (
                  <button
                    onClick={() => {
                      updateGoal(selectedGoal.id, { status: 'completed' });
                      setSelectedGoal(null);
                    }}
                    className="btn btn-primary flex-1"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Mark Complete
                  </button>
                )}
                <button
                  onClick={() => {
                    deleteGoal(selectedGoal.id);
                    setSelectedGoal(null);
                  }}
                  className="btn btn-secondary text-danger hover:bg-red-50"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
