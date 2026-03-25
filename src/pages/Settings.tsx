import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Bell,
  Palette,
  Shield,
  CreditCard,
  HelpCircle,
  LogOut,
  Sun,
  Moon,
  Monitor,
  Check,
  Mail,
  Smartphone,
  AlertCircle,
  FileText,
  ChevronRight,
  Camera,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';

const settingsSections = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'billing', label: 'Billing', icon: CreditCard },
  { id: 'help', label: 'Help & Support', icon: HelpCircle },
];

export function Settings() {
  const { user, updateUser, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('profile');
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const [notifications, setNotifications] = useState({
    email: user?.preferences.notifications.email ?? true,
    push: user?.preferences.notifications.push ?? true,
    budgetAlerts: user?.preferences.notifications.budgetAlerts ?? true,
    weeklyReport: user?.preferences.notifications.weeklyReport ?? true,
  });

  const handleSaveProfile = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    updateUser({ name, email });
    setSaveMessage('Profile updated successfully!');
    setIsSaving(false);
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const handleSaveNotifications = () => {
    if (user) {
      updateUser({
        preferences: {
          ...user.preferences,
          notifications,
        },
      });
      setSaveMessage('Notification preferences saved!');
      setTimeout(() => setSaveMessage(''), 3000);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-text mb-1">Profile Settings</h2>
              <p className="text-text-muted">Manage your account information</p>
            </div>

            {/* Avatar */}
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white text-3xl font-bold">
                  {name.charAt(0) || 'U'}
                </div>
                <button className="absolute -bottom-2 -right-2 p-2 bg-surface-light dark:bg-surface-light light:bg-white border border-surface-lighter dark:border-surface-lighter light:border-gray-200 rounded-xl shadow-lg hover:bg-surface-lighter transition-colors">
                  <Camera className="w-4 h-4 text-text-muted" />
                </button>
              </div>
              <div>
                <p className="font-medium text-text">{name}</p>
                <p className="text-sm text-text-muted">{email}</p>
                <p className="text-xs text-primary mt-1">Pro Member</p>
              </div>
            </div>

            {/* Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-muted mb-2">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-surface dark:bg-surface light:bg-gray-50 border border-surface-lighter dark:border-surface-lighter light:border-gray-200 rounded-xl py-3 px-4 text-text focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-muted mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-surface dark:bg-surface light:bg-gray-50 border border-surface-lighter dark:border-surface-lighter light:border-gray-200 rounded-xl py-3 px-4 text-text focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="px-6 py-2.5 bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white rounded-xl font-medium transition-all disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
              {saveMessage && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-sm text-success flex items-center gap-1"
                >
                  <Check className="w-4 h-4" />
                  {saveMessage}
                </motion.span>
              )}
            </div>

            {/* Danger Zone */}
            <div className="pt-6 border-t border-surface-lighter dark:border-surface-lighter light:border-gray-200">
              <h3 className="text-lg font-semibold text-text mb-4">Danger Zone</h3>
              <div className="flex items-center justify-between p-4 bg-danger/5 border border-danger/20 rounded-xl">
                <div>
                  <p className="font-medium text-text">Delete Account</p>
                  <p className="text-sm text-text-muted">Permanently delete your account and all data</p>
                </div>
                <button className="px-4 py-2 border border-danger text-danger hover:bg-danger hover:text-white rounded-xl font-medium transition-all">
                  Delete
                </button>
              </div>
            </div>
          </div>
        );

      case 'appearance':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-text mb-1">Appearance</h2>
              <p className="text-text-muted">Customize how FinanceFlow looks</p>
            </div>

            {/* Theme Selection */}
            <div>
              <h3 className="text-sm font-medium text-text-muted mb-4">Theme</h3>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { value: 'light', icon: Sun, label: 'Light', preview: 'bg-white border-gray-200' },
                  { value: 'dark', icon: Moon, label: 'Dark', preview: 'bg-gray-900 border-gray-700' },
                  { value: 'system', icon: Monitor, label: 'System', preview: 'bg-gradient-to-r from-white to-gray-900' },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setTheme(option.value as 'light' | 'dark' | 'system')}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      theme === option.value
                        ? 'border-primary bg-primary/5'
                        : 'border-surface-lighter dark:border-surface-lighter light:border-gray-200 hover:border-primary/50'
                    }`}
                  >
                    <div className={`w-full h-20 rounded-lg mb-3 ${option.preview} border`} />
                    <div className="flex items-center justify-center gap-2">
                      <option.icon className="w-4 h-4 text-text-muted" />
                      <span className="font-medium text-text">{option.label}</span>
                      {theme === option.value && <Check className="w-4 h-4 text-primary" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Currency */}
            <div>
              <h3 className="text-sm font-medium text-text-muted mb-4">Currency</h3>
              <select className="w-full md:w-64 bg-surface dark:bg-surface light:bg-gray-50 border border-surface-lighter dark:border-surface-lighter light:border-gray-200 rounded-xl py-3 px-4 text-text focus:outline-none focus:ring-2 focus:ring-primary/30">
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="JPY">JPY (¥)</option>
              </select>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-text mb-1">Notifications</h2>
              <p className="text-text-muted">Choose how you want to be notified</p>
            </div>

            <div className="space-y-4">
              {[
                { key: 'email', icon: Mail, title: 'Email Notifications', description: 'Receive important updates via email' },
                { key: 'push', icon: Smartphone, title: 'Push Notifications', description: 'Get instant alerts on your device' },
                { key: 'budgetAlerts', icon: AlertCircle, title: 'Budget Alerts', description: 'Get notified when approaching budget limits' },
                { key: 'weeklyReport', icon: FileText, title: 'Weekly Report', description: 'Receive a weekly summary of your finances' },
              ].map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between p-4 bg-surface dark:bg-surface light:bg-gray-50 rounded-xl"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <item.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-text">{item.title}</p>
                      <p className="text-sm text-text-muted">{item.description}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key as keyof typeof notifications] })}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      notifications[item.key as keyof typeof notifications] ? 'bg-primary' : 'bg-surface-lighter'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white shadow transform transition-transform ${
                        notifications[item.key as keyof typeof notifications] ? 'translate-x-6' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={handleSaveNotifications}
              className="px-6 py-2.5 bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white rounded-xl font-medium transition-all"
            >
              Save Preferences
            </button>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-text mb-1">Security</h2>
              <p className="text-text-muted">Manage your account security</p>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-surface dark:bg-surface light:bg-gray-50 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-text">Password</p>
                    <p className="text-sm text-text-muted">Last changed 30 days ago</p>
                  </div>
                  <button className="px-4 py-2 text-primary hover:bg-primary/10 rounded-xl font-medium transition-colors">
                    Change
                  </button>
                </div>
              </div>

              <div className="p-4 bg-surface dark:bg-surface light:bg-gray-50 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-text">Two-Factor Authentication</p>
                    <p className="text-sm text-text-muted">Add an extra layer of security</p>
                  </div>
                  <span className="px-3 py-1 bg-success/20 text-success text-sm font-medium rounded-full">
                    Enabled
                  </span>
                </div>
              </div>

              <div className="p-4 bg-surface dark:bg-surface light:bg-gray-50 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-text">Connected Accounts</p>
                    <p className="text-sm text-text-muted">Manage linked accounts</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-text-muted" />
                </div>
              </div>
            </div>
          </div>
        );

      case 'billing':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-text mb-1">Billing</h2>
              <p className="text-text-muted">Manage your subscription and payment methods</p>
            </div>

            <div className="bg-gradient-to-br from-primary to-primary-dark rounded-2xl p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <span className="text-white/80">Current Plan</span>
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">Pro</span>
              </div>
              <p className="text-3xl font-bold">$9.99/month</p>
              <p className="text-white/70 mt-1">Renews on April 25, 2026</p>
            </div>

            <div className="p-4 bg-surface dark:bg-surface light:bg-gray-50 rounded-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-blue-400 rounded-md flex items-center justify-center text-white text-xs font-bold">
                    VISA
                  </div>
                  <div>
                    <p className="font-medium text-text">•••• •••• •••• 4242</p>
                    <p className="text-sm text-text-muted">Expires 12/28</p>
                  </div>
                </div>
                <button className="text-primary hover:text-primary-dark font-medium">Edit</button>
              </div>
            </div>
          </div>
        );

      case 'help':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-text mb-1">Help & Support</h2>
              <p className="text-text-muted">Get help with FinanceFlow</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { title: 'Documentation', description: 'Learn how to use all features', icon: FileText },
                { title: 'FAQs', description: 'Find answers to common questions', icon: HelpCircle },
                { title: 'Contact Support', description: 'Get help from our team', icon: Mail },
                { title: 'Community', description: 'Join our Discord community', icon: User },
              ].map((item) => (
                <button
                  key={item.title}
                  className="p-4 bg-surface dark:bg-surface light:bg-gray-50 rounded-xl text-left hover:bg-surface-lighter transition-colors group"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <item.icon className="w-5 h-5 text-primary" />
                    <span className="font-medium text-text">{item.title}</span>
                    <ChevronRight className="w-4 h-4 text-text-muted ml-auto group-hover:translate-x-1 transition-transform" />
                  </div>
                  <p className="text-sm text-text-muted">{item.description}</p>
                </button>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex gap-6">
      {/* Sidebar */}
      <div className="w-64 flex-shrink-0">
        <nav className="glass-card p-2 sticky top-24">
          {settingsSections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeSection === section.id
                  ? 'bg-primary/10 text-primary'
                  : 'text-text-muted hover:bg-surface-lighter hover:text-text'
              }`}
            >
              <section.icon className="w-5 h-5" />
              <span className="font-medium">{section.label}</span>
            </button>
          ))}

          <div className="my-2 border-t border-surface-lighter dark:border-surface-lighter light:border-gray-200" />

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-danger hover:bg-danger/10 transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </nav>
      </div>

      {/* Content */}
      <div className="flex-1 glass-card p-6">
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {renderContent()}
        </motion.div>
      </div>
    </div>
  );
}
