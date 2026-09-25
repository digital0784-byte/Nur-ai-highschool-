import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSubscription } from '../context/SubscriptionContext';
import { StudentOnboardingFlow, OnboardingStep } from './student/StudentOnboardingFlow';
import { Loader2 } from 'lucide-react';
import { Grade } from '../types';

interface AuthGateProps {
  children: React.ReactNode;
}

export const AuthGate: React.FC<AuthGateProps> = ({ children }) => {
  const { user, userProfile, loading: authLoading } = useAuth();
  const {
    isOwnerSuperAdmin,
    hasLearningAccess,
    accessStatus,
    loading: subLoading,
  } = useSubscription();

  // If user is actively authenticated and either super admin or has verified active learning access, let them in
  const shouldAllowAccess = isOwnerSuperAdmin || (Boolean(user) && hasLearningAccess);

  // 1. Initial Auth Loading State
  if (authLoading && !user) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-slate-200">
        <Loader2 className="w-10 h-10 text-emerald-400 animate-spin mb-4" />
        <p className="text-sm font-semibold text-slate-100 font-serif-ethiopic">
          ኑር AI • ስርዓቱን በማዘጋጀት ላይ...
        </p>
        <p className="text-xs text-slate-400 mt-1">
          Initializing Ethiopian Curriculum Engine & Secure Auth...
        </p>
      </div>
    );
  }

  // 2. Authenticated user with ACTIVE subscription (or Super Admin) -> Full System Access
  if (shouldAllowAccess) {
    return <>{children}</>;
  }

  // 3. Authenticated user without active learning access -> Route strictly by subscription status
  if (user && !hasLearningAccess) {
    let initialStep: OnboardingStep = 'payment';
    let isRenewal = false;

    if (accessStatus === 'PENDING') {
      initialStep = 'verification';
    } else if (accessStatus === 'REJECTED') {
      initialStep = 'verification';
    } else if (accessStatus === 'EXPIRED') {
      initialStep = 'payment';
      isRenewal = true;
    } else if (accessStatus === 'SUSPENDED') {
      initialStep = 'suspended';
    } else {
      initialStep = 'payment';
    }

    return (
      <StudentOnboardingFlow
        onComplete={() => {
          // Handled reactively when subscription status becomes ACTIVE
        }}
        initialStep={initialStep}
        initialGrade={userProfile?.grade || 9}
        isRenewal={isRenewal}
      />
    );
  }

  // 4. Unauthenticated user: Show the complete PART 21 Entry Flow starting at Start Screen
  return (
    <StudentOnboardingFlow
      onComplete={() => {
        // Handled reactively when user logs in and subscription is ACTIVE
      }}
      initialStep="start"
      initialGrade={9}
    />
  );
};
