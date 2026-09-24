import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSubscription } from '../context/SubscriptionContext';
import { StudentOnboardingFlow } from './student/StudentOnboardingFlow';
import { PublicMarketingLandingPage } from './public/PublicMarketingLandingPage';
import { PublicDemoPage } from './public/PublicDemoPage';
import { Loader2 } from 'lucide-react';
import { Grade } from '../types';

interface AuthGateProps {
  children: React.ReactNode;
}

export const AuthGate: React.FC<AuthGateProps> = ({ children }) => {
  const { user, userProfile, loading: authLoading } = useAuth();
  const { isOwnerSuperAdmin, hasLearningAccess, loading: subLoading } = useSubscription();

  // View Mode: 'landing' (Public Marketing Homepage) | 'onboarding' (Registration/Login/Payment flow) | 'demo' (Interactive Public Demo)
  const [viewMode, setViewMode] = useState<'landing' | 'onboarding' | 'demo'>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#register' || hash === '#login' || hash === '#auth' || hash === '#payment') {
        return 'onboarding';
      }
      if (hash === '#demo') {
        return 'demo';
      }
    }
    return 'landing';
  });

  const [onboardingStep, setOnboardingStep] = useState<1 | 2 | 3 | 4 | 5>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#login' || hash === '#register') return 3;
    }
    return 3;
  });

  const [onboardingAuthMode, setOnboardingAuthMode] = useState<'login' | 'register'>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#login') return 'login';
    }
    return 'register';
  });

  const [onboardingGrade, setOnboardingGrade] = useState<Grade>(9);

  const [onboardingCompleted, setOnboardingCompleted] = useState<boolean>(() => {
    return sessionStorage.getItem('nur_onboarding_completed') === 'true';
  });

  // Sync hash changes if user uses browser history or shared links
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#register') {
        setOnboardingAuthMode('register');
        setOnboardingStep(3);
        setViewMode('onboarding');
      } else if (hash === '#login') {
        setOnboardingAuthMode('login');
        setOnboardingStep(3);
        setViewMode('onboarding');
      } else if (hash === '#demo') {
        setViewMode('demo');
      } else if (hash === '#home' || hash === '#landing') {
        setViewMode('landing');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // When user logs out, clean up session onboarding state so they see the public home page
  useEffect(() => {
    if (!user && !authLoading) {
      sessionStorage.removeItem('nur_onboarding_completed');
      setOnboardingCompleted(false);
    }
  }, [user, authLoading]);

  // Keep session storage in sync when onboarding completes
  const handleOnboardingComplete = () => {
    sessionStorage.setItem('nur_onboarding_completed', 'true');
    setOnboardingCompleted(true);
  };

  // If user is actively authenticated and either super admin or has learning access, let them in
  const shouldAllowAccess =
    isOwnerSuperAdmin ||
    (user && hasLearningAccess) ||
    (user && onboardingCompleted);

  if (authLoading && !user) {
    return (
      <div className="min-h-screen bg-[#24211E] flex flex-col items-center justify-center p-6 text-stone-200">
        <Loader2 className="w-10 h-10 text-amber-500 animate-spin mb-4" />
        <p className="text-sm font-semibold text-stone-300 font-serif-ethiopic">
          ኑር AI • ስርዓቱን በማዘጋጀት ላይ...
        </p>
        <p className="text-xs text-stone-500 mt-1">Initializing Ethiopian Curriculum Engine & Secure Auth...</p>
      </div>
    );
  }

  // 1. Authenticated with learning access or Super Admin -> Enter App
  if (shouldAllowAccess) {
    return <>{children}</>;
  }

  // 2. Authenticated user without active learning access -> Show payment / verification status
  if (user && !hasLearningAccess) {
    return (
      <StudentOnboardingFlow
        onComplete={handleOnboardingComplete}
        initialStep={4}
        initialGrade={userProfile?.grade || onboardingGrade}
        onBackToHome={() => setViewMode('landing')}
      />
    );
  }

  // 3. Unauthenticated user: Show Onboarding flow if requested
  if (viewMode === 'onboarding') {
    return (
      <StudentOnboardingFlow
        onComplete={handleOnboardingComplete}
        initialStep={onboardingStep}
        initialAuthMode={onboardingAuthMode}
        initialGrade={onboardingGrade}
        onBackToHome={() => {
          setViewMode('landing');
          if (window.location.hash) {
            window.history.pushState(null, '', window.location.pathname);
          }
        }}
      />
    );
  }

  // 4. Interactive Public Demo Mode
  if (viewMode === 'demo') {
    return (
      <PublicDemoPage
        onBackToHome={() => {
          setViewMode('landing');
          if (window.location.hash) {
            window.history.pushState(null, '', window.location.pathname);
          }
        }}
        onRegister={() => {
          setOnboardingAuthMode('register');
          setOnboardingStep(3);
          setViewMode('onboarding');
        }}
        onLogin={() => {
          setOnboardingAuthMode('login');
          setOnboardingStep(3);
          setViewMode('onboarding');
        }}
      />
    );
  }

  // 5. Default for public visitors: Professional Public Marketing Landing Page
  return (
    <PublicMarketingLandingPage
      onStartLearning={() => {
        setOnboardingAuthMode('register');
        setOnboardingStep(3);
        setViewMode('onboarding');
      }}
      onRegister={() => {
        setOnboardingAuthMode('register');
        setOnboardingStep(3);
        setViewMode('onboarding');
      }}
      onLogin={() => {
        setOnboardingAuthMode('login');
        setOnboardingStep(3);
        setViewMode('onboarding');
      }}
      onSelectGrade={(grade: Grade) => {
        setOnboardingGrade(grade);
        setOnboardingAuthMode('register');
        setOnboardingStep(3);
        setViewMode('onboarding');
      }}
      onExploreDemo={() => {
        setViewMode('demo');
      }}
    />
  );
};

