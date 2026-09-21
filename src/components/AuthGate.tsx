import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSubscription } from '../context/SubscriptionContext';
import { StudentOnboardingFlow } from './student/StudentOnboardingFlow';
import { Loader2 } from 'lucide-react';

interface AuthGateProps {
  children: React.ReactNode;
}

export const AuthGate: React.FC<AuthGateProps> = ({ children }) => {
  const { user, userProfile, loading: authLoading } = useAuth();
  const { isOwnerSuperAdmin, hasLearningAccess, loading: subLoading } = useSubscription();

  const [onboardingCompleted, setOnboardingCompleted] = useState<boolean>(() => {
    return sessionStorage.getItem('nur_onboarding_completed') === 'true';
  });

  // Keep session storage in sync
  const handleOnboardingComplete = () => {
    sessionStorage.setItem('nur_onboarding_completed', 'true');
    setOnboardingCompleted(true);
  };

  // If user is actively authenticated and either super admin or has learning access, let them in
  const shouldAllowAccess =
    isOwnerSuperAdmin ||
    (user && hasLearningAccess) ||
    onboardingCompleted;

  if (authLoading && !user) {
    return (
      <div className="min-h-screen bg-stone-900 flex flex-col items-center justify-center p-6 text-stone-200">
        <Loader2 className="w-10 h-10 text-amber-500 animate-spin mb-4" />
        <p className="text-sm font-semibold text-stone-300 font-serif-ethiopic">
          ኑር AI • ስርዓቱን በማዘጋጀት ላይ...
        </p>
        <p className="text-xs text-stone-500 mt-1">Initializing Ethiopian Curriculum Engine & Secure Auth...</p>
      </div>
    );
  }

  if (shouldAllowAccess) {
    return <>{children}</>;
  }

  return <StudentOnboardingFlow onComplete={handleOnboardingComplete} />;
};
