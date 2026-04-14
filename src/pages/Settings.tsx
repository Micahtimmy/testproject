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
import { sanitizeInput, isValidEmail } from '../utils/security';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

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
  const [saveError, setSaveError] = useState('');

  const [notifications, setNotifications] = useState({
    email: user?.preferences.notifications.email ?? true,
    push: user?.preferences.notifications.push ?? true,
    budgetAlerts: user?.preferences.notifications.budgetAlerts ?? true,
    weeklyReport: user?.preferences.notifications.weeklyReport ?? true,
  });

  const handleSaveProfile = async () => {
    setSaveError('');
    setSaveMessage('');

    const sanitizedName = sanitizeInput(name);
    if (!sanitizedName || sanitizedName.length < 2) {
      setSaveError('Name must be at least 2 characters');
      return;
    }

    if (!isValidEmail(email)) {
      setSaveError('Please enter a valid email address');
      return;
    }

    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 800));

    updateUser({ name: sanitizedName, email });
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
              <h2 className="text-heading-2 mb-1">Profile Settings</h2>
              <p className="text-body-sm">Manage your account information</p>
            </div>

            {/* Avatar */}
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="avatar avatar-lg w-20 h-20 text-2xl">
                  {name.charAt(0) || 'U'}
                </div>
                <button
                  className="absolute -bottom-1 -right-1 w-8 h-8 bg-surface-light border border-border rounded-xl shadow-sm hover:bg-surface-lighter transition-colors flex items-center justify-center"
                  aria-label="Change avatar"
                >
                  <Camera className="w-4 h-4 text-text-muted" />
                </button>
              </div>
              <div>
                <p className="font-medium text-text">{name}</p>
                <p className="text-sm text-text-secondary">{email}</p>
                <span className="badge badge-success mt-2">Pro Member</span>
              </div>
            </div>

            {/* Error/Success Messages */}
            {saveError && (
              <div className="bg-red-50 border border-red-200 text-danger rounded-xl p-3 text-sm">
                {saveError}
              </div>
            )}

            {/* Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Full Name</label>
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={100}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Email</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Button
                onClick={handleSaveProfile}
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
              {saveMessage && (
                <motion.span
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-sm text-primary flex items-center gap-1"
                >
                  <Check className="w-4 h-4" />
                  {saveMessage}
                </motion.span>
              )}
            </div>

            {/* Danger Zone */}
            <div className="pt-6 border-t border-border">
              <h3 className="text-heading-3 mb-4">Danger Zone</h3>
              <div className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-xl">
                <div>
                  <p className="font-medium text-text text-sm">Delete Account</p>
                  <p className="text-xs text-text-secondary">Permanently delete your account and all data</p>
                </div>
                <Button variant="outline" size="sm" className="border-danger text-danger hover:bg-danger hover:text-white">
                  Delete
                </Button>
              </div>
            </div>
          </div>
        );

      case 'appearance':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-heading-2 mb-1">Appearance</h2>
              <p className="text-body-sm">Customize how FinanceFlow looks</p>
            </div>

            {/* Theme Selection */}
            <div>
              <h3 className="text-sm font-medium text-text-secondary mb-4">Theme</h3>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { value: 'light', icon: Sun, label: 'Light', preview: 'bg-white border-border' },
                  { value: 'dark', icon: Moon, label: 'Dark', preview: 'bg-gray-900 border-gray-700' },
                  { value: 'system', icon: Monitor, label: 'System', preview: 'bg-gradient-to-r from-white to-gray-900' },
                ].map((option) => (
                  <Button
                    key={option.value}
                    variant={theme === option.value ? 'outline' : 'ghost'}
                    onClick={() => setTheme(option.value as 'light' | 'dark' | 'system')}
                    className={`p-4 h-auto flex-col ${
                      theme === option.value
                        ? 'border-primary bg-primary-light'
                        : 'border-border hover:border-text-muted'
                    }`}
                  >
                    <div className={`w-full h-16 rounded-lg mb-3 ${option.preview} border`} />
                    <div className="flex items-center justify-center gap-2">
                      <option.icon className="w-4 h-4 text-text-secondary" />
                      <span className="font-medium text-text text-sm">{option.label}</span>
                      {theme === option.value && <Check className="w-4 h-4 text-primary" />}
                    </div>
                  </Button>
                ))}
              </div>
            </div>

            {/* Currency */}
            <div>
              <label htmlFor="currency-select" className="block text-sm font-medium text-text-secondary mb-4">Currency</label>
              <select
                id="currency-select"
                className="flex h-10 w-full md:w-64 rounded-xl border border-[hsl(var(--border))] bg-white px-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:ring-offset-2"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (&euro;)</option>
                <option value="GBP">GBP (&pound;)</option>
                <option value="JPY">JPY (&yen;)</option>
              </select>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-heading-2 mb-1">Notifications</h2>
              <p className="text-body-sm">Choose how you want to be notified</p>
            </div>

            <div className="space-y-3">
              {[
                { key: 'email', icon: Mail, title: 'Email Notifications', description: 'Receive important updates via email' },
                { key: 'push', icon: Smartphone, title: 'Push Notifications', description: 'Get instant alerts on your device' },
                { key: 'budgetAlerts', icon: AlertCircle, title: 'Budget Alerts', description: 'Get notified when approaching budget limits' },
                { key: 'weeklyReport', icon: FileText, title: 'Weekly Report', description: 'Receive a weekly summary of your finances' },
              ].map((item) => {
                const toggleId = `toggle-${item.key}`;
                const labelId = `label-${item.key}`;
                return (
                  <div
                    key={item.key}
                    className="flex items-center justify-between p-4 bg-surface-lighter rounded-xl"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-primary-light rounded-xl flex items-center justify-center">
                        <item.icon className="w-5 h-5 text-primary" aria-hidden="true" />
                      </div>
                      <div>
                        <p id={labelId} className="font-medium text-text text-sm">{item.title}</p>
                        <p className="text-xs text-text-muted">{item.description}</p>
                      </div>
                    </div>
                    <button
                      id={toggleId}
                      onClick={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key as keyof typeof notifications] })}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        notifications[item.key as keyof typeof notifications] ? 'bg-primary' : 'bg-gray-300'
                      }`}
                      role="switch"
                      aria-checked={notifications[item.key as keyof typeof notifications]}
                      aria-labelledby={labelId}
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-white shadow transform transition-transform ${
                          notifications[item.key as keyof typeof notifications] ? 'translate-x-6' : 'translate-x-0.5'
                        }`}
                      />
                    </button>
                  </div>
                );
              })}
            </div>

            <Button onClick={handleSaveNotifications}>
              Save Preferences
            </Button>

            {saveMessage && (
              <span className="text-sm text-primary flex items-center gap-1">
                <Check className="w-4 h-4" />
                {saveMessage}
              </span>
            )}
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-heading-2 mb-1">Security</h2>
              <p className="text-body-sm">Manage your account security</p>
            </div>

            <div className="space-y-3">
              <Card className="p-0">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-text text-sm">Password</p>
                      <p className="text-xs text-text-muted">Last changed 30 days ago</p>
                    </div>
                    <Button variant="ghost" size="sm" className="text-primary">
                      Change
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="p-0">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-text text-sm">Two-Factor Authentication</p>
                      <p className="text-xs text-text-muted">Add an extra layer of security</p>
                    </div>
                    <span className="badge badge-success">Enabled</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="p-0 cursor-pointer hover:shadow-sm transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-text text-sm">Connected Accounts</p>
                      <p className="text-xs text-text-muted">Manage linked accounts</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-text-muted" />
                  </div>
                </CardContent>
              </Card>

              <Card className="p-0 cursor-pointer hover:shadow-sm transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-text text-sm">Active Sessions</p>
                      <p className="text-xs text-text-muted">View and manage your active sessions</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-text-muted" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'billing':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-heading-2 mb-1">Billing</h2>
              <p className="text-body-sm">Manage your subscription and payment methods</p>
            </div>

            <div className="gradient-primary rounded-2xl p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <span className="text-white/80 text-sm">Current Plan</span>
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">Pro</span>
              </div>
              <p className="text-3xl font-semibold">$9.99/month</p>
              <p className="text-white/70 text-sm mt-1">Renews on April 25, 2026</p>
            </div>

            <div className="p-4 bg-surface-lighter rounded-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-blue-400 rounded-md flex items-center justify-center text-white text-xs font-bold">
                    VISA
                  </div>
                  <div>
                    <p className="font-medium text-text text-sm">&bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull; 4242</p>
                    <p className="text-xs text-text-muted">Expires 12/28</p>
                  </div>
                </div>
                <button className="text-primary hover:text-primary-dark font-medium text-sm">Edit</button>
              </div>
            </div>
          </div>
        );

      case 'help':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-heading-2 mb-1">Help & Support</h2>
              <p className="text-body-sm">Get help with FinanceFlow</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { title: 'Documentation', description: 'Learn how to use all features', icon: FileText, url: '#' },
                { title: 'FAQs', description: 'Find answers to common questions', icon: HelpCircle, url: '#' },
                { title: 'Contact Support', description: 'Get help from our team', icon: Mail, url: '#' },
                { title: 'Community', description: 'Join our Discord community', icon: User, url: '#' },
              ].map((item) => (
                <Card
                  key={item.title}
                  className="p-0 cursor-pointer hover:shadow-md transition-all group"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <item.icon className="w-5 h-5 text-primary" />
                      <span className="font-medium text-text text-sm">{item.title}</span>
                      <ChevronRight className="w-4 h-4 text-text-muted ml-auto group-hover:translate-x-1 transition-transform" />
                    </div>
                    <p className="text-xs text-text-muted">{item.description}</p>
                  </CardContent>
                </Card>
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
        <Card className="p-2 sticky top-24">
          <nav aria-label="Settings navigation">
            {settingsSections.map((section) => (
              <Button
                key={section.id}
                variant={activeSection === section.id ? 'secondary' : 'ghost'}
                onClick={() => setActiveSection(section.id)}
                className={`w-full justify-start gap-3 mb-1 ${
                  activeSection === section.id
                    ? 'bg-primary-light text-primary'
                    : 'text-text-secondary hover:bg-surface-lighter hover:text-text'
                }`}
              >
                <section.icon className="w-5 h-5" />
                {section.label}
              </Button>
            ))}

            <div className="my-2 border-t border-border" />

            <Button
              variant="ghost"
              onClick={handleLogout}
              className="w-full justify-start gap-3 text-danger hover:bg-red-50"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </Button>
          </nav>
        </Card>
      </div>

      {/* Content */}
      <Card className="flex-1">
        <CardContent className="pt-6">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {renderContent()}
          </motion.div>
        </CardContent>
      </Card>
    </div>
  );
}
