import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  ArrowLeftRight,
  PiggyBank,
  Target,
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
  { icon: Target, label: 'Goals', path: '/goals' },
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
      animate={{ width: isCollapsed ? 72 : 260 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="fixed left-0 top-0 h-screen z-40 flex flex-col bg-surface-light border-r border-border"
    >
      {/* Logo */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-border">
        <NavLink to="/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-sm">
            <Wallet className="w-5 h-5 text-white" />
          </div>
          {!isCollapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-lg font-semibold text-text"
            >
              FinanceFlow
            </motion.span>
          )}
        </NavLink>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-20 w-6 h-6 bg-surface-light border border-border rounded-full shadow-sm hover:bg-surface-lighter transition-colors flex items-center justify-center z-50"
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {isCollapsed ? (
          <ChevronRight className="w-3.5 h-3.5 text-text-secondary" />
        ) : (
          <ChevronLeft className="w-3.5 h-3.5 text-text-secondary" />
        )}
      </button>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative ${
                    isActive
                      ? 'bg-primary-light text-primary-dark font-medium'
                      : 'text-text-secondary hover:bg-surface-lighter hover:text-text'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full"
                      />
                    )}
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    {!isCollapsed && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-sm"
                      >
                        {item.label}
                      </motion.span>
                    )}
                    {isCollapsed && (
                      <div className="absolute left-full ml-3 px-3 py-2 bg-text text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 shadow-lg">
                        {item.label}
                      </div>
                    )}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* User Section */}
      <div className="p-3 border-t border-border">
        {!isCollapsed ? (
          <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-lighter">
            <div className="avatar avatar-md flex-shrink-0">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text truncate">{user?.name || 'User'}</p>
              <p className="text-xs text-text-muted truncate">{user?.email || 'user@email.com'}</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-text-muted hover:text-danger hover:bg-red-50 rounded-lg transition-colors"
              title="Logout"
              aria-label="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={handleLogout}
            className="w-full p-3 text-text-muted hover:text-danger hover:bg-red-50 rounded-xl transition-colors flex justify-center"
            title="Logout"
            aria-label="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        )}
      </div>
    </motion.aside>
  );
}
