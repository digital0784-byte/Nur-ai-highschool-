import { Grade } from '../types';

export type EntitlementType = 'ALL_PREMIUM' | 'PREMIUM_VIDEO' | 'PREMIUM_ANIMATION';

export type EntitlementStatus = 'ACTIVE' | 'EXPIRED' | 'REVOKED' | 'SUSPENDED';

export interface Entitlement {
  id: string;
  studentId: string;
  entitlementType: EntitlementType;
  plan: string;
  premium: boolean;
  grade: Grade;
  status: EntitlementStatus;
  startDate: string; // ISO
  endDate: string; // ISO
  sourcePaymentId?: string;
  createdAt: string;
  updatedAt: string;
}

export type ProtectedContentType = 'video' | 'animation_2d' | 'animation_3d';

export interface ProtectedContentItem {
  contentId: string;
  title: string;
  description: string;
  grade: Grade;
  subject: string;
  chapter: string;
  topic?: string;
  contentType: ProtectedContentType;
  premiumRequired: boolean; // default true, editable only by Super Admin
  storagePath: string;
  duration?: string;
  thumbnail?: string;
  instructor?: string;
  status: 'active' | 'draft' | 'archived';
  createdAt: string;
  updatedAt: string;
}

export type SecuritySeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface SecurityLogItem {
  id: string;
  userId?: string;
  userEmail?: string;
  eventType:
    | 'PASSWORD_RESET_REQUESTED'
    | 'PASSWORD_RESET_COMPLETED'
    | 'PASSWORD_CHANGED'
    | 'PHONE_OTP_REQUESTED'
    | 'PHONE_OTP_VERIFIED'
    | 'PHONE_OTP_FAILED'
    | 'SUSPICIOUS_RECOVERY_ATTEMPT'
    | 'UNAUTHORIZED_PREMIUM_ACCESS'
    | 'EXCESSIVE_STREAM_REQUESTS'
    | 'CONCURRENT_SESSION_DETECTED'
    | 'TOKEN_TAMPER_DETECTED'
    | 'SETTINGS_SECURITY_UPDATE';
  severity: SecuritySeverity;
  riskScore: number; // 0 to 100
  details: string;
  ipAddress?: string;
  userAgent?: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface UsageLimitsConfig {
  dailyVideoLimit: number;
  weeklyAnimationLimit: number;
  dailyAiQuestionsLimit: number;
  dailyExamAttemptsLimit: number;
  maxConcurrentSessions: number;
  updatedAt?: string;
  updatedBy?: string;
}

export interface WatermarkPayload {
  studentId: string;
  maskedEmail: string;
  text: string;
  timestamp: string;
}

export type WatermarkData = WatermarkPayload;

export interface AccessVerificationResponse {
  entitled: boolean;
  reason?: 'NOT_AUTHENTICATED' | 'NO_SUBSCRIPTION' | 'EXPIRED' | 'LIMIT_EXCEEDED' | 'FRAUD_BLOCKED' | 'REVOKED' | 'SERVER_ERROR';
  message: string;
  contentToken?: string;
  expiresInSeconds?: number;
  authorizedStreamUrl?: string;
  watermark?: WatermarkPayload;
  contentMetadata?: Partial<ProtectedContentItem>;
}
