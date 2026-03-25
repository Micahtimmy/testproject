import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wallet,
  TrendingUp,
  Target,
  Sparkles,
  Shield,
  ChevronRight,
  ChevronLeft,
  Check,
  X,
} from 'lucide-react';
import { secureStorage } from '../utils/security';

interface OnboardingProps {
  onComplete: () => void;
  userName?: string;
}

const ONBOARDING_KEY = 'financeflow_onboarding_complete';

const slides = [
  {
    id: 'welcome',
    icon: Wallet,
    title: 'Welcome to FinanceFlow',
    description: 'Your personal finance companion that helps you take control of your money with smart insights and easy tracking.',
    color: 'from-primary to-teal-400',
  },
  {
    id: 'track',
    icon: TrendingUp,
    title: 'Track Every Dollar',
    description: 'Easily log income and expenses. See where your money goes with beautiful visualizations and real-time updates.',
    color: 'from-blue-500 to-cyan-400',
  },
  {
    id: 'budget',
    icon: Target,
    title: 'Set & Achieve Goals',
    description: 'Create budgets and financial goals. Get alerts when you\'re close to limits and celebrate when you hit milestones.',
    color: 'from-purple-500 to-pink-400',
  },
  {
    id: 'insights',
    icon: Sparkles,
    title: 'AI-Powered Insights',
    description: 'Get personalized recommendations based on your spending patterns. Our AI helps you save more and spend smarter.',
    color: 'from-amber-500 to-orange-400',
  },
  {
    id: 'secure',
    icon: Shield,
    title: 'Bank-Grade Security',
    description: 'Your data is encrypted and secure. We never share your information. Your privacy is our top priority.',
    color: 'from-primary to-emerald-400',
  },
];

export function Onboarding({ onComplete, userName }: OnboardingProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide((prev) => prev - 1);
    }
  };

  const handleComplete = () => {
    setIsExiting(true);
    secureStorage.setItem(ONBOARDING_KEY, true);
    setTimeout(onComplete, 300);
  };

  const handleSkip = () => {
    handleComplete();
  };

  const slide = slides[currentSlide];
  const Icon = slide.icon;
  const isLastSlide = currentSlide === slides.length - 1;

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="card w-full max-w-lg p-0 overflow-hidden shadow-2xl"
          >
            {/* Header with gradient */}
            <div className={`relative bg-gradient-to-br ${slide.color} p-8 pb-20`}>
              <button
                onClick={handleSkip}
                className="absolute top-4 right-4 p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                aria-label="Skip onboarding"
              >
                <X className="w-5 h-5" />
              </button>

              <motion.div
                key={slide.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="text-center"
              >
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Icon className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-semibold text-white mb-2">
                  {currentSlide === 0 && userName ? `Welcome, ${userName}!` : slide.title}
                </h2>
              </motion.div>
            </div>

            {/* Content */}
            <div className="px-8 pt-4 pb-8 -mt-12 relative">
              <div className="bg-surface rounded-xl p-6 shadow-lg mb-6">
                <motion.p
                  key={slide.id + '-desc'}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="text-text-secondary text-center leading-relaxed"
                >
                  {slide.description}
                </motion.p>
              </div>

              {/* Progress dots */}
              <div className="flex justify-center gap-2 mb-6">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`h-2 rounded-full transition-all ${
                      index === currentSlide
                        ? 'w-8 bg-primary'
                        : index < currentSlide
                        ? 'w-2 bg-primary/50'
                        : 'w-2 bg-border'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between gap-4">
                <button
                  onClick={handlePrev}
                  disabled={currentSlide === 0}
                  className={`btn btn-secondary ${currentSlide === 0 ? 'opacity-0 pointer-events-none' : ''}`}
                >
                  <ChevronLeft className="w-5 h-5" />
                  Back
                </button>

                {isLastSlide ? (
                  <button onClick={handleComplete} className="btn btn-primary flex-1">
                    Get Started
                    <Check className="w-5 h-5" />
                  </button>
                ) : (
                  <button onClick={handleNext} className="btn btn-primary flex-1">
                    Continue
                    <ChevronRight className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Hook to check if onboarding should be shown
export function useOnboarding() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    const completed = secureStorage.getItem<boolean>(ONBOARDING_KEY, false);
    setShowOnboarding(!completed);
    setIsChecked(true);
  }, []);

  const completeOnboarding = () => {
    secureStorage.setItem(ONBOARDING_KEY, true);
    setShowOnboarding(false);
  };

  const resetOnboarding = () => {
    secureStorage.removeItem(ONBOARDING_KEY);
    setShowOnboarding(true);
  };

  return { showOnboarding, isChecked, completeOnboarding, resetOnboarding };
}

export { ONBOARDING_KEY };
