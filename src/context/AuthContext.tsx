import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEFAULT_USER: User = {
  id: '1',
  email: 'demo@financeflow.app',
  name: 'Alex Johnson',
  avatar: undefined,
  preferences: {
    theme: 'dark',
    currency: 'USD',
    notifications: {
      email: true,
      push: true,
      budgetAlerts: true,
      weeklyReport: true,
    },
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('financeflow-user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, _password: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const newUser = { ...DEFAULT_USER, email, name: email.split('@')[0] };
    setUser(newUser);
    localStorage.setItem('financeflow-user', JSON.stringify(newUser));
  };

  const loginWithGoogle = async () => {
    // Simulate Google OAuth
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const newUser = { ...DEFAULT_USER };
    setUser(newUser);
    localStorage.setItem('financeflow-user', JSON.stringify(newUser));
  };

  const register = async (email: string, _password: string, name: string) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const newUser = { ...DEFAULT_USER, email, name };
    setUser(newUser);
    localStorage.setItem('financeflow-user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('financeflow-user');
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updated = { ...user, ...updates };
      setUser(updated);
      localStorage.setItem('financeflow-user', JSON.stringify(updated));
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, loginWithGoogle, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
