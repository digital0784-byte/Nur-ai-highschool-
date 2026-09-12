export type NotificationType =
  | 'new_lesson'
  | 'new_quiz'
  | 'new_exam'
  | 'assignment'
  | 'assignment_deadline'
  | 'quiz_exam_result'
  | 'ai_recommendation'
  | 'weak_topic_alert'
  | 'new_curriculum_content'
  | 'system_announcement'
  | 'admin_notification';

export type NotificationPriority = 'low' | 'normal' | 'high' | 'urgent';

export type NotificationRecipientRole = 'student' | 'teacher' | 'admin' | 'all';

export type NotificationRelatedType =
  | 'quiz'
  | 'exam'
  | 'lesson'
  | 'topic'
  | 'assignment'
  | 'submission'
  | 'ai_recommendation'
  | 'weak_topic'
  | 'curriculum'
  | 'gamification'
  | 'system';

export type SupportedNotificationLanguage = 'en' | 'am' | 'om' | 'ti' | 'so';

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  type: NotificationType;
  recipientId: string; // user UID, or 'all', or 'grade_9', etc.
  recipientRole: NotificationRecipientRole;
  createdAt: string; // ISO format
  readAt: string | null;
  relatedId: string;
  relatedType: NotificationRelatedType;
  deepLink: string;
  priority: NotificationPriority;
  metadata?: {
    grade?: number;
    subjectId?: string;
    subjectName?: string;
    unitNumber?: number;
    score?: number;
    maxScore?: number;
    percentage?: number;
    senderName?: string;
    [key: string]: any;
  };
}

export interface NotificationPreferences {
  userId: string;
  pushEnabled: boolean;
  inAppEnabled: boolean;
  emailNotifications: boolean;
  soundEnabled: boolean;
  language: SupportedNotificationLanguage;
  types: Record<NotificationType, boolean>;
  quietHours: {
    enabled: boolean;
    start: string; // "22:00"
    end: string;   // "07:00"
  };
  updatedAt: string;
}

export interface DeviceToken {
  id: string;
  userId: string;
  token: string;
  platform: 'android' | 'web' | 'ios';
  deviceModel: string;
  appVersion: string;
  createdAt: string;
  lastActiveAt: string;
  isValid: boolean;
}

export interface NotificationStats {
  totalSent: number;
  totalDelivered: number;
  totalUnread: number;
  activeDeviceTokens: number;
  fcmStatus: 'online' | 'connected' | 'standby';
  androidDevices: number;
  webDevices: number;
}

export interface SendNotificationPayload {
  title?: string;
  body?: string;
  type: NotificationType;
  recipientId: string;
  recipientRole: NotificationRecipientRole;
  relatedId?: string;
  relatedType?: NotificationRelatedType;
  deepLink?: string;
  priority?: NotificationPriority;
  language?: SupportedNotificationLanguage;
  metadata?: Record<string, any>;
}
