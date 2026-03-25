import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  Search,
  Sun,
  Moon,
  Monitor,
  X,
  Check,
  AlertCircle,
  Info,
  CheckCircle,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useNotifications } from '../../context/NotificationContext';
import { useAuth } from '../../context/AuthContext';
import { formatDistanceToNow } from 'date-fns';

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const { user } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const notificationRef = useRef<HTMLDivElement>(null);
  const themeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (themeRef.current && !themeRef.current.contains(e.target as Node)) {
        setShowThemeMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'alert':
        return <AlertCircle className="w-5 h-5 text-danger" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-success" />;
      case 'info':
        return <Info className="w-5 h-5 text-info" />;
      default:
        return <Bell className="w-5 h-5 text-text-muted" />;
    }
  };

  const themeOptions = [
    { value: 'light', icon: Sun, label: 'Light' },
    { value: 'dark', icon: Moon, label: 'Dark' },
    { value: 'system', icon: Monitor, label: 'System' },
  ] as const;

  return (
    <header className="sticky top-0 z-30 h-16 bg-surface-light border-b border-border">
      <div className="flex items-center justify-between h-full px-6">
        {/* Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setShowSearch(true)}
              onBlur={() => setTimeout(() => setShowSearch(false), 200)}
              placeholder="Search transactions..."
              className="input input-with-icon h-10 text-sm"
              style={{ paddingLeft: '40px' }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text transition-colors"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Search Results Dropdown */}
          <AnimatePresence>
            {showSearch && searchQuery && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="absolute mt-2 w-full max-w-md card p-4 shadow-lg"
              >
                <p className="text-sm text-text-secondary">
                  Search results for "{searchQuery}"...
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 ml-4">
          {/* Theme Toggle */}
          <div ref={themeRef} className="relative">
            <button
              onClick={() => setShowThemeMenu(!showThemeMenu)}
              className="w-10 h-10 flex items-center justify-center text-text-secondary hover:text-text hover:bg-surface-lighter rounded-xl transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Moon className="w-5 h-5" />
              ) : theme === 'light' ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Monitor className="w-5 h-5" />
              )}
            </button>

            <AnimatePresence>
              {showThemeMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -8 }}
                  className="absolute right-0 mt-2 w-40 card card-sm shadow-lg overflow-hidden p-1"
                >
                  {themeOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setTheme(option.value);
                        setShowThemeMenu(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-surface-lighter transition-colors ${
                        theme === option.value ? 'text-primary bg-primary-light' : 'text-text'
                      }`}
                    >
                      <option.icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{option.label}</span>
                      {theme === option.value && <Check className="w-4 h-4 ml-auto" />}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Notifications */}
          <div ref={notificationRef} className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative w-10 h-10 flex items-center justify-center text-text-secondary hover:text-text hover:bg-surface-lighter rounded-xl transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-danger text-white text-xs font-medium rounded-full flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -8 }}
                  className="absolute right-0 mt-2 w-96 card p-0 shadow-lg overflow-hidden"
                >
                  <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                    <h3 className="font-semibold text-text">Notifications</h3>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-sm text-primary hover:text-primary-dark font-medium transition-colors"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="empty-state py-8">
                        <Bell className="w-8 h-8 text-text-muted mb-2" />
                        <p className="text-sm text-text-secondary">No notifications</p>
                      </div>
                    ) : (
                      notifications.slice(0, 5).map((notification) => (
                        <div
                          key={notification.id}
                          onClick={() => markAsRead(notification.id)}
                          className={`flex gap-3 px-4 py-3 hover:bg-surface-lighter cursor-pointer transition-colors border-b border-border last:border-0 ${
                            !notification.read ? 'bg-primary-light/30' : ''
                          }`}
                        >
                          <div className="flex-shrink-0 mt-0.5">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm ${!notification.read ? 'font-medium text-text' : 'text-text-secondary'}`}>
                              {notification.title}
                            </p>
                            <p className="text-xs text-text-muted mt-0.5 line-clamp-2">
                              {notification.message}
                            </p>
                            <p className="text-xs text-text-muted mt-1">
                              {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                            </p>
                          </div>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2" />
                          )}
                        </div>
                      ))
                    )}
                  </div>

                  {notifications.length > 5 && (
                    <div className="p-3 border-t border-border text-center">
                      <button className="text-sm text-primary hover:text-primary-dark font-medium transition-colors">
                        View all notifications
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User Avatar */}
          <div className="avatar avatar-md cursor-pointer hover:shadow-md transition-shadow">
            {user?.name?.charAt(0) || 'U'}
          </div>
        </div>
      </div>
    </header>
  );
}
