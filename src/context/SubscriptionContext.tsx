import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import {
  Subscription,
  PaymentRecord,
  SubscriptionPricingConfig,
  PaymentMethodName,
  SubscriptionStatus,
  SystemFeedback,
} from '../types/subscription';
import { Grade } from '../types';
import {
  subscriptionService,
  DEFAULT_PRICING_CONFIG,
  isSuperAdmin,
} from '../services/subscriptionService';

interface SubscriptionContextType {
  subscription: Subscription | null;
  latestPayment: PaymentRecord | null;
  paymentsHistory: PaymentRecord[];
  loading: boolean;
  pricingConfig: SubscriptionPricingConfig;
  isOwnerSuperAdmin: boolean;
  hasLearningAccess: boolean;
  accessStatus:
    | 'SUPER_ADMIN'
    | 'ACTIVE'
    | 'PENDING'
    | 'EXPIRED'
    | 'REJECTED'
    | 'SUSPENDED'
    | 'NONE';
  remainingDays: number;
  isExpiringSoon: boolean;
  submitPayment: (params: {
    grade: Grade;
    amountETB: number;
    paymentMethod: PaymentMethodName;
    transactionReference: string;
    proofImageUrl?: string;
  }) => Promise<PaymentRecord>;
  superAdminApprove: (
    paymentId: string,
    studentUserId: string,
    grade: Grade,
    amountETB: number
  ) => Promise<void>;
  superAdminReject: (
    paymentId: string,
    studentUserId: string,
    reason: string
  ) => Promise<void>;
  superAdminSuspend: (userId: string, reason?: string) => Promise<void>;
  superAdminReactivate: (userId: string) => Promise<void>;
  superAdminUpdatePricing: (config: SubscriptionPricingConfig) => Promise<void>;
  submitFeedback: (params: {
    rating: number;
    category: any;
    comment: string;
  }) => Promise<SystemFeedback>;
  refreshSubscription: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, userProfile } = useAuth();

  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [latestPayment, setLatestPayment] = useState<PaymentRecord | null>(null);
  const [paymentsHistory, setPaymentsHistory] = useState<PaymentRecord[]>([]);
  const [pricingConfig, setPricingConfig] = useState<SubscriptionPricingConfig>(DEFAULT_PRICING_CONFIG);
  const [loading, setLoading] = useState<boolean>(true);

  const isOwnerSuperAdmin = isSuperAdmin(user?.email, userProfile?.role);

  // Load Pricing Config
  useEffect(() => {
    let mounted = true;
    subscriptionService.getPricingConfig().then((cfg) => {
      if (mounted) setPricingConfig(cfg);
    });
    return () => {
      mounted = false;
    };
  }, []);

  // Listen to User Subscription & Payments
  useEffect(() => {
    if (!user) {
      setSubscription(null);
      setLatestPayment(null);
      setPaymentsHistory([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    // 1. Listen to user's subscription doc
    const unsubSub = subscriptionService.subscribeToUserSubscription(user.uid, (sub) => {
      setSubscription(sub);
      setLoading(false);
    });

    // 2. Listen to user's latest payment doc
    const unsubPay = subscriptionService.subscribeToUserLatestPayment(user.uid, (pay) => {
      setLatestPayment(pay);
    });

    // 3. Load historical payments
    subscriptionService.getUserPayments(user.uid).then((records) => {
      setPaymentsHistory(records);
    });

    return () => {
      unsubSub();
      unsubPay();
    };
  }, [user]);

  const refreshSubscription = useCallback(async () => {
    if (!user) return;
    const history = await subscriptionService.getUserPayments(user.uid);
    setPaymentsHistory(history);
    const cfg = await subscriptionService.getPricingConfig();
    setPricingConfig(cfg);
  }, [user]);

  // Calculate Remaining Days
  const remainingDays = React.useMemo(() => {
    if (!subscription || subscription.status !== 'ACTIVE') return 0;
    const expiry = new Date(subscription.expiryDate).getTime();
    const now = Date.now();
    const diffDays = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  }, [subscription]);

  const isExpiringSoon = remainingDays > 0 && remainingDays <= pricingConfig.renewalReminderDays;

  // Determine Access Status
  const accessStatus = React.useMemo(():
    | 'SUPER_ADMIN'
    | 'ACTIVE'
    | 'PENDING'
    | 'EXPIRED'
    | 'REJECTED'
    | 'SUSPENDED'
    | 'NONE' => {
    if (isOwnerSuperAdmin) return 'SUPER_ADMIN';

    // If teacher role, also grant access
    if (userProfile?.role === 'teacher') return 'ACTIVE';

    if (!subscription) {
      if (latestPayment?.status === 'PENDING') return 'PENDING';
      if (latestPayment?.status === 'REJECTED') return 'REJECTED';
      return 'NONE';
    }

    if (subscription.status === 'SUSPENDED') return 'SUSPENDED';

    if (subscription.status === 'ACTIVE') {
      const isExpired = new Date(subscription.expiryDate).getTime() < Date.now();
      if (isExpired) return 'EXPIRED';
      return 'ACTIVE';
    }

    if (subscription.status === 'PENDING' || latestPayment?.status === 'PENDING') {
      return 'PENDING';
    }

    if (latestPayment?.status === 'REJECTED' || subscription.status === 'CANCELLED') {
      return 'REJECTED';
    }

    if (subscription.status === 'EXPIRED') return 'EXPIRED';

    return 'NONE';
  }, [isOwnerSuperAdmin, userProfile?.role, subscription, latestPayment]);

  // Determine if student has learning access
  const hasLearningAccess = accessStatus === 'SUPER_ADMIN' || accessStatus === 'ACTIVE';

  // Student Submits Payment
  const submitPayment = async (params: {
    grade: Grade;
    amountETB: number;
    paymentMethod: PaymentMethodName;
    transactionReference: string;
    proofImageUrl?: string;
  }) => {
    if (!user) throw new Error('ክፍያ ለማስገባት እባክዎ መጀመሪያ ይግቡ (Please sign in to submit payment)');

    const record = await subscriptionService.submitPayment({
      userId: user.uid,
      studentName: userProfile?.displayName || user.email?.split('@')[0] || 'Student',
      studentEmail: user.email || undefined,
      grade: params.grade,
      amountETB: params.amountETB,
      paymentMethod: params.paymentMethod,
      transactionReference: params.transactionReference,
      proofImageUrl: params.proofImageUrl,
    });

    setLatestPayment(record);
    await refreshSubscription();
    return record;
  };

  // Super Admin Approves Payment
  const superAdminApprove = async (
    paymentId: string,
    studentUserId: string,
    grade: Grade,
    amountETB: number
  ) => {
    if (!isOwnerSuperAdmin) throw new Error('Unauthorized. Super Admin access required.');
    await subscriptionService.superAdminApprovePayment({
      paymentId,
      studentUserId,
      adminEmail: user?.email || 'admin',
      adminId: user?.uid || 'admin',
      grade,
      amountETB,
      durationDays: pricingConfig.subscriptionDurationDays,
    });
    await refreshSubscription();
  };

  // Super Admin Rejects Payment
  const superAdminReject = async (
    paymentId: string,
    studentUserId: string,
    reason: string
  ) => {
    if (!isOwnerSuperAdmin) throw new Error('Unauthorized. Super Admin access required.');
    await subscriptionService.superAdminRejectPayment({
      paymentId,
      studentUserId,
      adminEmail: user?.email || 'admin',
      adminId: user?.uid || 'admin',
      rejectionReason: reason,
    });
    await refreshSubscription();
  };

  // Super Admin Suspends
  const superAdminSuspend = async (userId: string, reason?: string) => {
    if (!isOwnerSuperAdmin) throw new Error('Unauthorized. Super Admin access required.');
    await subscriptionService.superAdminToggleSubscriptionSuspension(
      userId,
      'SUSPEND',
      user?.email || 'admin',
      user?.uid || 'admin',
      reason
    );
    await refreshSubscription();
  };

  // Super Admin Reactivates
  const superAdminReactivate = async (userId: string) => {
    if (!isOwnerSuperAdmin) throw new Error('Unauthorized. Super Admin access required.');
    await subscriptionService.superAdminToggleSubscriptionSuspension(
      userId,
      'REACTIVATE',
      user?.email || 'admin',
      user?.uid || 'admin'
    );
    await refreshSubscription();
  };

  // Super Admin Updates Pricing Config
  const superAdminUpdatePricing = async (config: SubscriptionPricingConfig) => {
    if (!isOwnerSuperAdmin) throw new Error('Unauthorized. Super Admin access required.');
    await subscriptionService.updatePricingConfig(
      config,
      user?.email || 'admin',
      user?.uid || 'admin'
    );
    setPricingConfig(config);
  };

  // Submit Feedback
  const submitFeedback = async (params: {
    rating: number;
    category: any;
    comment: string;
  }) => {
    if (!user) throw new Error('አስተያየት ለመስጠት እባክዎ መጀመሪያ ይግቡ (Please sign in)');
    const res = await subscriptionService.submitSystemFeedback({
      userId: user.uid,
      userName: userProfile?.displayName || user.email?.split('@')[0] || 'User',
      userEmail: user.email || '',
      userRole: userProfile?.role || 'student',
      grade: userProfile?.grade,
      rating: params.rating,
      category: params.category,
      comment: params.comment,
    });
    return res;
  };

  return (
    <SubscriptionContext.Provider
      value={{
        subscription,
        latestPayment,
        paymentsHistory,
        loading,
        pricingConfig,
        isOwnerSuperAdmin,
        hasLearningAccess,
        accessStatus,
        remainingDays,
        isExpiringSoon,
        submitPayment,
        superAdminApprove,
        superAdminReject,
        superAdminSuspend,
        superAdminReactivate,
        superAdminUpdatePricing,
        submitFeedback,
        refreshSubscription,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = (): SubscriptionContextType => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};
