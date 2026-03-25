import { useState, useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { useAuth } from '../../context/AuthContext';
import { secureStorage } from '../../utils/security';
import { Onboarding, useOnboarding } from '../Onboarding';

export function Layout() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { showOnboarding, isChecked, completeOnboarding } = useOnboarding();

  // Persist sidebar state
  useEffect(() => {
    const stored = secureStorage.getItem<boolean>('sidebar-collapsed', false);
    setSidebarCollapsed(stored);
  }, []);

  useEffect(() => {
    secureStorage.setItem('sidebar-collapsed', sidebarCollapsed);
  }, [sidebarCollapsed]);

  // Loading state
  if (isLoading || !isChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="w-12 h-12 border-4 border-primary-light border-t-primary rounded-full animate-spin" />
          <p className="text-text-secondary text-sm">Loading...</p>
        </motion.div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-surface">
      {/* Onboarding for new users */}
      {showOnboarding && (
        <Onboarding onComplete={completeOnboarding} userName={user?.name} />
      )}

      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <motion.main
        initial={false}
        animate={{
          marginLeft: sidebarCollapsed ? 72 : 260,
        }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="min-h-screen"
      >
        <Navbar />
        <div className="p-8 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.div>
        </div>
      </motion.main>
    </div>
  );
}
