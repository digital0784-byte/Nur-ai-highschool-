import { Grade } from '../types';

export type SubscriptionStatus = 'PENDING' | 'ACTIVE' | 'EXPIRED' | 'SUSPENDED' | 'CANCELLED';

export type PaymentStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export type PaymentMethodName =
  | 'Telebirr'
  | 'Dashen Bank'
  | 'Commercial Bank of Ethiopia (CBE)'
  | 'Bank of Abyssinia';

export interface Subscription {
  id: string;
  userId: string;
  studentName?: string;
  grade: Grade;
  planName: string;
  priceETB: number;
  startDate: string; // ISO string
  expiryDate: string; // ISO string
  status: SubscriptionStatus;
  paymentId: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentRecord {
  paymentId: string;
  userId: string;
  studentName: string;
  studentEmail?: string;
  grade: Grade;
  amountETB: number;
  paymentMethod: PaymentMethodName;
  transactionReference: string;
  proofImageUrl?: string;
  status: PaymentStatus;
  submittedAt: string;
  verifiedAt?: string;
  verifiedBy?: string;
  rejectionReason?: string;
  notes?: string;
}

export interface PaymentAuditLog {
  id: string;
  paymentId?: string;
  subscriptionId?: string;
  action:
    | 'PAYMENT_SUBMITTED'
    | 'PAYMENT_APPROVED'
    | 'PAYMENT_REJECTED'
    | 'SUBSCRIPTION_ACTIVATED'
    | 'SUBSCRIPTION_SUSPENDED'
    | 'SUBSCRIPTION_REACTIVATED'
    | 'SUBSCRIPTION_EXPIRED'
    | 'PRICING_UPDATED';
  actorId: string;
  actorEmail: string;
  actorRole: string;
  timestamp: string;
  details: string;
  previousStatus?: string;
  newStatus?: string;
  adminId?: string;
  reason?: string;
  metadata?: Record<string, any>;
  meta?: Record<string, any>;
}

export interface PaymentMethodConfig {
  id: PaymentMethodName;
  displayName: string;
  accountName: string;
  accountNumber: string;
  shortCodeOrTill?: string;
  iconName: string;
  badgeColor: string;
  instructionsAm: string;
  instructionsEn: string;
  isEnabled: boolean;
}

export interface SubscriptionPricingConfig {
  grade9Price: number;
  grade10Price: number;
  grade11Price: number;
  grade12Price: number;
  subscriptionDurationDays: number;
  renewalReminderDays: number;
  methods: Record<PaymentMethodName, PaymentMethodConfig>;
}

export type FeedbackCategory =
  | 'learning_experience'
  | 'payment_process'
  | 'technical_issue'
  | 'feature_request'
  | 'general';

export interface SystemFeedback {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userRole: string;
  grade?: Grade;
  rating: number; // 1 to 5
  category: FeedbackCategory;
  comment: string;
  status: 'PENDING' | 'REVIEWED' | 'ADDRESSED';
  adminResponse?: string;
  respondedAt?: string;
  createdAt: string;
  updatedAt: string;
}
