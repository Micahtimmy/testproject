import { useState, useCallback } from 'react';
import { secureStorage } from '../utils/security';

export const ONBOARDING_KEY = 'financeflow_onboarding_complete';

export function useOnboarding() {
  const [showOnboarding, setShowOnboarding] = useState(() => {
    const completed = secureStorage.getItem<boolean>(ONBOARDING_KEY, false);
    return !completed;
  });

  const [isChecked] = useState(true);

  const completeOnboarding = useCallback(() => {
    secureStorage.setItem(ONBOARDING_KEY, true);
    setShowOnboarding(false);
  }, []);

  const resetOnboarding = useCallback(() => {
    secureStorage.removeItem(ONBOARDING_KEY);
    setShowOnboarding(true);
  }, []);

  return { showOnboarding, isChecked, completeOnboarding, resetOnboarding };
}
