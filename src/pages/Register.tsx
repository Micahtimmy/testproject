import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, Wallet, ArrowRight, Loader2, Check, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { validatePassword } from '../utils/security';

export function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const { register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const passwordValidation = validatePassword(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!agreedToTerms) {
      setError('Please agree to the terms and conditions');
      return;
    }

    if (!passwordValidation.isValid) {
      setError('Please create a stronger password');
      return;
    }

    setError('');
    setIsLoading(true);

    const result = await register(email, password, name);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error || 'Registration failed. Please try again.');
    }

    setIsLoading(false);
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    setError('');

    const result = await loginWithGoogle();

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error || 'Google registration failed');
    }

    setIsGoogleLoading(false);
  };

  const features = [
    'AI-powered budget recommendations',
    'Real-time spending alerts',
    'Investment portfolio tracking',
    'Bank-grade security',
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="hidden lg:flex lg:w-1/2 gradient-dark p-12 flex-col justify-between relative overflow-hidden"
      >
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-40 left-10 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-semibold text-white">FinanceFlow</span>
          </div>
        </div>

        <div className="relative z-10 space-y-8">
          <h1 className="text-5xl font-semibold text-white leading-tight">
            Start your journey to
            <span className="block text-primary-light">financial freedom</span>
          </h1>

          <div className="space-y-4">
            {features.map((feature, index) => (
              <motion.div
                key={feature}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                  <Check className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-white/90">{feature}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <Shield className="w-5 h-5 text-white/60" />
          <p className="text-white/60 text-sm">
            Join 50,000+ users who trust FinanceFlow with their finances
          </p>
        </div>
      </motion.div>

      {/* Right Panel - Register Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-surface overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="w-full max-w-md py-8"
        >
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-semibold text-text">FinanceFlow</span>
          </div>

          <h2 className="text-heading-1 mb-2">Create account</h2>
          <p className="text-body-sm mb-8">Start your 14-day free trial. No credit card required.</p>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 text-danger rounded-xl p-4 mb-6 text-sm"
              role="alert"
            >
              {error}
            </motion.div>
          )}

          <button
            onClick={handleGoogleLogin}
            disabled={isGoogleLoading}
            className="btn btn-secondary w-full h-12 mb-6"
          >
            {isGoogleLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Sign up with Google
              </>
            )}
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-surface text-text-muted">Or register with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-text-secondary mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  required
                  autoComplete="name"
                  className="input"
                  style={{ paddingLeft: '44px' }}
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  required
                  autoComplete="email"
                  className="input"
                  style={{ paddingLeft: '44px' }}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-text-secondary mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a strong password"
                  required
                  autoComplete="new-password"
                  className="input"
                  style={{ paddingLeft: '44px', paddingRight: '44px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {/* Password strength indicator */}
              {password && (
                <div className="mt-3 space-y-3">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div
                        key={level}
                        className={`h-1 flex-1 rounded-full transition-colors ${
                          passwordValidation.score >= level
                            ? passwordValidation.score <= 2
                              ? 'bg-danger'
                              : passwordValidation.score <= 3
                              ? 'bg-warning'
                              : 'bg-success'
                            : 'bg-border'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className={`flex items-center gap-1.5 ${passwordValidation.hasMinLength ? 'text-success' : 'text-text-muted'}`}>
                      <Check className="w-3 h-3" /> 8+ characters
                    </div>
                    <div className={`flex items-center gap-1.5 ${passwordValidation.hasUppercase ? 'text-success' : 'text-text-muted'}`}>
                      <Check className="w-3 h-3" /> Uppercase letter
                    </div>
                    <div className={`flex items-center gap-1.5 ${passwordValidation.hasNumber ? 'text-success' : 'text-text-muted'}`}>
                      <Check className="w-3 h-3" /> Number
                    </div>
                    <div className={`flex items-center gap-1.5 ${passwordValidation.hasSpecialChar ? 'text-success' : 'text-text-muted'}`}>
                      <Check className="w-3 h-3" /> Special character
                    </div>
                  </div>
                </div>
              )}
            </div>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-0.5"
              />
              <span className="text-sm text-text-secondary">
                I agree to the{' '}
                <a href="#" className="text-primary hover:text-primary-dark font-medium">Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="text-primary hover:text-primary-dark font-medium">Privacy Policy</a>
              </span>
            </label>

            <button
              type="submit"
              disabled={isLoading || !passwordValidation.isValid}
              className="btn btn-primary w-full h-12"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-text-secondary mt-8 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:text-primary-dark font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
