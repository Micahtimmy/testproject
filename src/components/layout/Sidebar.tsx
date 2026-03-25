import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  ArrowLeftRight,
  PiggyBank,
  Sparkles,
  Settings,
  LogOut,
  Wallet,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: ArrowLeftRight, label: 'Transactions', path: '/transactions' },
  { icon: PiggyBank, label: 'Budgets', path: '/budgets' },
  { icon: Sparkles, label: 'AI Insights', path: '/insights' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 80 : 280 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="fixed left-0 top-0 h-screen z-40 flex flex-col bg-surface-light/80 dark:bg-surface-light/80 light:bg-white/80 backdrop-blur-2xl border-r border-surface-lighter/50 dark:border-surface-lighter/50 light:border-gray-200/50"
    >
      {/* Logo */}
      <div className="p-6 flex items-center justify-between">
        <NavLink to="/dashboard" className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-br from-primary to-primary-dark rounded-xl shadow-lg shadow-primary/20">
            <Wallet className="w-6 h-6 text-white" />
          </div>
          {!isCollapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-xl font-bold text-text"
            >
              FinanceFlow
            </motion.span>
          )}
        </NavLink>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-20 p-1.5 bg-surface-light dark:bg-surface-light light:bg-white border border-surface-lighter dark:border-surface-lighter light:border-gray-200 rounded-full shadow-lg hover:bg-surface-lighter dark:hover:bg-surface-lighter light:hover:bg-gray-50 transition-colors z-50"
      >
        {isCollapsed ? (
          <ChevronRight className="w-4 h-4 text-text-muted" />
        ) : (
          <ChevronLeft className="w-4 h-4 text-text-muted" />
        )}
      </button>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative ${
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-text-muted hover:bg-surface-lighter/50 dark:hover:bg-surface-lighter/50 light:hover:bg-gray-100/50 hover:text-text'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full"
                  />
                )}
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="font-medium"
                  >
                    {item.label}
                  </motion.span>
                )}
                {isCollapsed && (
                  <div className="absolute left-full ml-2 px-3 py-2 bg-surface dark:bg-surface light:bg-gray-800 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 shadow-xl">
                    {item.label}
                  </div>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-surface-lighter/50 dark:border-surface-lighter/50 light:border-gray-200/50">
        {!isCollapsed ? (
          <div className="flex items-center gap-3 p-3 rounded-xl bg-surface/50 dark:bg-surface/50 light:bg-gray-50/50">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white font-medium">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-text truncate">{user?.name || 'User'}</p>
              <p className="text-xs text-text-muted truncate">{user?.email || 'user@email.com'}</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-text-muted hover:text-danger hover:bg-danger/10 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <button
            onClick={handleLogout}
            className="w-full p-3 text-text-muted hover:text-danger hover:bg-danger/10 rounded-xl transition-colors flex justify-center"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        )}
      </div>
    </motion.aside>
  );
}
