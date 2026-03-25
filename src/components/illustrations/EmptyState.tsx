import { motion } from 'framer-motion';

interface EmptyStateProps {
  type: 'transactions' | 'budgets' | 'goals' | 'insights' | 'notifications';
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ type, title, description, action }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-8 text-center"
    >
      <div className="mb-6">
        {type === 'transactions' && <TransactionsIllustration />}
        {type === 'budgets' && <BudgetsIllustration />}
        {type === 'goals' && <GoalsIllustration />}
        {type === 'insights' && <InsightsIllustration />}
        {type === 'notifications' && <NotificationsIllustration />}
      </div>
      <h3 className="text-heading-3 mb-2">{title}</h3>
      <p className="text-body-sm max-w-sm mb-6">{description}</p>
      {action && (
        <button onClick={action.onClick} className="btn btn-primary">
          {action.label}
        </button>
      )}
    </motion.div>
  );
}

function TransactionsIllustration() {
  return (
    <svg width="160" height="120" viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <motion.rect
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        x="20" y="20" width="120" height="24" rx="8"
        fill="#F1F5F9" stroke="#E2E8F0" strokeWidth="1"
      />
      <motion.rect
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        x="20" y="52" width="120" height="24" rx="8"
        fill="#F1F5F9" stroke="#E2E8F0" strokeWidth="1"
      />
      <motion.rect
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        x="20" y="84" width="120" height="24" rx="8"
        fill="#ECFDF5" stroke="#059669" strokeWidth="1" strokeDasharray="4 2"
      />
      <motion.circle
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.4, type: "spring" }}
        cx="36" cy="32" r="6" fill="#E2E8F0"
      />
      <motion.circle
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: "spring" }}
        cx="36" cy="64" r="6" fill="#E2E8F0"
      />
      <motion.circle
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.6, type: "spring" }}
        cx="36" cy="96" r="6" fill="#059669"
      />
      <motion.path
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        d="M32 96L35 99L40 93"
        stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  );
}

function BudgetsIllustration() {
  return (
    <svg width="160" height="120" viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <motion.circle
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: "spring" }}
        cx="80" cy="60" r="45" fill="#F1F5F9" stroke="#E2E8F0" strokeWidth="2"
      />
      <motion.circle
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring" }}
        cx="80" cy="60" r="30" fill="white" stroke="#E2E8F0" strokeWidth="2"
      />
      <motion.path
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        d="M80 15A45 45 0 0 1 125 60"
        stroke="#059669" strokeWidth="6" strokeLinecap="round"
      />
      <motion.text
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        x="80" y="65" textAnchor="middle" fill="#059669" fontSize="14" fontWeight="600"
      >
        0%
      </motion.text>
    </svg>
  );
}

function GoalsIllustration() {
  return (
    <svg width="160" height="120" viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <motion.circle
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: "spring" }}
        cx="80" cy="50" r="40" fill="#ECFDF5" stroke="#059669" strokeWidth="2"
      />
      <motion.circle
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring" }}
        cx="80" cy="50" r="28" fill="white" stroke="#059669" strokeWidth="2"
      />
      <motion.circle
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.3, type: "spring" }}
        cx="80" cy="50" r="16" fill="#ECFDF5" stroke="#059669" strokeWidth="2"
      />
      <motion.circle
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.4, type: "spring" }}
        cx="80" cy="50" r="6" fill="#059669"
      />
      <motion.path
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, type: "spring" }}
        d="M80 10V30M80 10L74 16M80 10L86 16"
        stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      />
      <motion.rect
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.6 }}
        x="30" y="100" width="100" height="6" rx="3" fill="#E2E8F0"
      />
      <motion.rect
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.7 }}
        x="30" y="100" width="40" height="6" rx="3" fill="#059669"
      />
    </svg>
  );
}

function InsightsIllustration() {
  return (
    <svg width="160" height="120" viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <motion.path
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        d="M20 90L50 70L80 80L110 40L140 60"
        stroke="#059669" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
        fill="none"
      />
      <motion.path
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        transition={{ delay: 0.6 }}
        d="M20 90L50 70L80 80L110 40L140 60V100H20V90Z"
        fill="#059669"
      />
      <motion.circle
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: "spring" }}
        cx="50" cy="70" r="5" fill="#059669"
      />
      <motion.circle
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.6, type: "spring" }}
        cx="80" cy="80" r="5" fill="#059669"
      />
      <motion.circle
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.7, type: "spring" }}
        cx="110" cy="40" r="5" fill="#059669"
      />
      <motion.circle
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.8, type: "spring" }}
        cx="140" cy="60" r="5" fill="#059669"
      />
      <motion.g initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}>
        <rect x="95" y="18" width="30" height="16" rx="4" fill="#059669" />
        <text x="110" y="29" textAnchor="middle" fill="white" fontSize="8" fontWeight="600">+24%</text>
        <path d="M110 34L106 38H114L110 34Z" fill="#059669" />
      </motion.g>
    </svg>
  );
}

function NotificationsIllustration() {
  return (
    <svg width="160" height="120" viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <motion.path
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: "spring" }}
        d="M80 20C62.3 20 48 34.3 48 52V68L40 80H120L112 68V52C112 34.3 97.7 20 80 20Z"
        fill="#F1F5F9" stroke="#E2E8F0" strokeWidth="2"
      />
      <motion.path
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ delay: 0.3 }}
        d="M72 80V84C72 88.4 75.6 92 80 92C84.4 92 88 88.4 88 84V80"
        stroke="#E2E8F0" strokeWidth="2" strokeLinecap="round"
      />
      <motion.circle
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.4, type: "spring" }}
        cx="100" cy="40" r="12" fill="#059669"
      />
      <motion.path
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.5, duration: 0.3 }}
        d="M96 40L99 43L104 37"
        stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  );
}

export { TransactionsIllustration, BudgetsIllustration, GoalsIllustration, InsightsIllustration, NotificationsIllustration };
