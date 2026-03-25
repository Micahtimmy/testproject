/**
 * Security utilities for FinanceFlow
 * Implements security by design principles
 */

// HTML entity encoding to prevent XSS
export function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Sanitize user input - removes potentially dangerous characters
export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return '';
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove angle brackets
    .slice(0, 500); // Limit length
}

// Validate email format
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email) && email.length <= 254;
}

// Validate password strength
export interface PasswordValidation {
  isValid: boolean;
  hasMinLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
  score: number;
}

export function validatePassword(password: string): PasswordValidation {
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const score = [hasMinLength, hasUppercase, hasLowercase, hasNumber, hasSpecialChar]
    .filter(Boolean).length;

  return {
    isValid: score >= 4,
    hasMinLength,
    hasUppercase,
    hasLowercase,
    hasNumber,
    hasSpecialChar,
    score,
  };
}

// Sanitize currency amount
export function sanitizeAmount(amount: string | number): number {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num) || !isFinite(num)) return 0;
  // Limit to reasonable range and 2 decimal places
  return Math.round(Math.min(Math.max(num, 0), 999999999) * 100) / 100;
}

// Validate date format (YYYY-MM-DD)
export function isValidDate(dateString: string): boolean {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateString)) return false;
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
}

// Secure localStorage wrapper with error handling
export const secureStorage = {
  setItem(key: string, value: unknown): boolean {
    try {
      const serialized = JSON.stringify(value);
      // Prevent storing excessively large data
      if (serialized.length > 5 * 1024 * 1024) {
        console.warn('Data too large to store');
        return false;
      }
      localStorage.setItem(key, serialized);
      return true;
    } catch (error) {
      console.error('Storage error:', error);
      return false;
    }
  },

  getItem<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key);
      if (item === null) return defaultValue;
      return JSON.parse(item) as T;
    } catch (error) {
      console.error('Storage retrieval error:', error);
      return defaultValue;
    }
  },

  removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Storage removal error:', error);
    }
  },
};

// Rate limiting helper (client-side)
const rateLimitMap = new Map<string, { count: number; timestamp: number }>();

export function checkRateLimit(action: string, maxAttempts: number = 5, windowMs: number = 60000): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(action);

  if (!record || now - record.timestamp > windowMs) {
    rateLimitMap.set(action, { count: 1, timestamp: now });
    return true;
  }

  if (record.count >= maxAttempts) {
    return false;
  }

  record.count++;
  return true;
}

// Generate secure random ID
export function generateSecureId(): string {
  return crypto.randomUUID();
}

// Validate and sanitize transaction data
export interface TransactionInput {
  type: 'income' | 'expense';
  amount: string | number;
  category: string;
  description: string;
  date: string;
  recurring?: boolean;
}

export function validateTransaction(input: TransactionInput): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!['income', 'expense'].includes(input.type)) {
    errors.push('Invalid transaction type');
  }

  const amount = sanitizeAmount(input.amount);
  if (amount <= 0) {
    errors.push('Amount must be greater than 0');
  }

  if (!input.category || input.category.length > 50) {
    errors.push('Invalid category');
  }

  const description = sanitizeInput(input.description);
  if (!description || description.length < 1) {
    errors.push('Description is required');
  }

  if (!isValidDate(input.date)) {
    errors.push('Invalid date format');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
