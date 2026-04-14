import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { User } from '../types';
import { secureStorage, isValidEmail, validatePassword, sanitizeInput, checkRateLimit } from '../utils/security';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'financeflow-user';
const SESSION_KEY = 'financeflow-session';

const DEFAULT_USER: User = {
  id: '1',
  email: 'demo@financeflow.app',
  name: 'Alex Johnson',
  avatar: undefined,
  preferences: {
    theme: 'light',
    currency: 'USD',
    notifications: {
      email: true,
      push: true,
      budgetAlerts: true,
      weeklyReport: true,
    },
  },
};

// Session timeout (30 minutes)
const SESSION_TIMEOUT = 30 * 60 * 1000;

// Check if session is still valid
function isSessionValid(): boolean {
  const session = secureStorage.getItem<{ timestamp: number }>(SESSION_KEY, { timestamp: 0 });
  const now = Date.now();
  if (session.timestamp && now - session.timestamp > SESSION_TIMEOUT) {
    secureStorage.removeItem(STORAGE_KEY);
    secureStorage.removeItem(SESSION_KEY);
    return false;
  }
  return true;
}

// Get initial user state
function getInitialUser(): User | null {
  const storedUser = secureStorage.getItem<User | null>(STORAGE_KEY, null);
  if (storedUser && isSessionValid()) {
    secureStorage.setItem(SESSION_KEY, { timestamp: Date.now() });
    return storedUser;
  }
  return null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(getInitialUser);
  const [isLoading] = useState(false);

  // Update session timestamp
  const updateSession = useCallback(() => {
    secureStorage.setItem(SESSION_KEY, { timestamp: Date.now() });
  }, []);

  // Keep session alive on activity
  useEffect(() => {
    if (!user) return;

    const handleActivity = () => updateSession();

    window.addEventListener('click', handleActivity);
    window.addEventListener('keypress', handleActivity);

    return () => {
      window.removeEventListener('click', handleActivity);
      window.removeEventListener('keypress', handleActivity);
    };
  }, [user, updateSession]);

  // Login with email/password
  const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // Rate limiting
    if (!checkRateLimit('login', 5, 60000)) {
      return { success: false, error: 'Too many login attempts. Please wait a minute.' };
    }

    // Validate email
    if (!isValidEmail(email)) {
      return { success: false, error: 'Please enter a valid email address' };
    }

    // Validate password presence
    if (!password || password.length < 1) {
      return { success: false, error: 'Password is required' };
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // In production, this would validate against a backend
    const sanitizedEmail = sanitizeInput(email);
    const userName = sanitizedEmail.split('@')[0];
    const newUser: User = {
      ...DEFAULT_USER,
      email: sanitizedEmail,
      name: userName.charAt(0).toUpperCase() + userName.slice(1),
    };

    setUser(newUser);
    secureStorage.setItem(STORAGE_KEY, newUser);
    updateSession();

    return { success: true };
  }, [updateSession]);

  // Login with Google
  const loginWithGoogle = useCallback(async (): Promise<{ success: boolean; error?: string }> => {
    // Rate limiting
    if (!checkRateLimit('google-login', 3, 60000)) {
      return { success: false, error: 'Too many attempts. Please wait a minute.' };
    }

    // Simulate Google OAuth
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const newUser = { ...DEFAULT_USER };
    setUser(newUser);
    secureStorage.setItem(STORAGE_KEY, newUser);
    updateSession();

    return { success: true };
  }, [updateSession]);

  // Register new user
  const register = useCallback(async (
    email: string,
    password: string,
    name: string
  ): Promise<{ success: boolean; error?: string }> => {
    // Rate limiting
    if (!checkRateLimit('register', 3, 60000)) {
      return { success: false, error: 'Too many registration attempts. Please wait a minute.' };
    }

    // Validate email
    if (!isValidEmail(email)) {
      return { success: false, error: 'Please enter a valid email address' };
    }

    // Validate password
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return { success: false, error: 'Password must be at least 8 characters with uppercase, lowercase, number, and special character' };
    }

    // Validate name
    const sanitizedName = sanitizeInput(name);
    if (!sanitizedName || sanitizedName.length < 2) {
      return { success: false, error: 'Please enter a valid name (at least 2 characters)' };
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const newUser: User = {
      ...DEFAULT_USER,
      email: sanitizeInput(email),
      name: sanitizedName,
    };

    setUser(newUser);
    secureStorage.setItem(STORAGE_KEY, newUser);
    updateSession();

    return { success: true };
  }, [updateSession]);

  // Logout
  const logout = useCallback(() => {
    setUser(null);
    secureStorage.removeItem(STORAGE_KEY);
    secureStorage.removeItem(SESSION_KEY);
  }, []);

  // Update user profile
  const updateUser = useCallback((updates: Partial<User>) => {
    if (!user) return;

    const sanitizedUpdates: Partial<User> = {};

    if (updates.name) {
      sanitizedUpdates.name = sanitizeInput(updates.name);
    }
    if (updates.email && isValidEmail(updates.email)) {
      sanitizedUpdates.email = updates.email;
    }
    if (updates.preferences) {
      sanitizedUpdates.preferences = {
        ...user.preferences,
        ...updates.preferences,
      };
    }

    const updatedUser = { ...user, ...sanitizedUpdates };
    setUser(updatedUser);
    secureStorage.setItem(STORAGE_KEY, updatedUser);
  }, [user]);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    loginWithGoogle,
    register,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
