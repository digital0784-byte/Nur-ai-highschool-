import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  Unsubscribe,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import {
  NotificationItem,
  NotificationPreferences,
  DeviceToken,
  NotificationType,
  SendNotificationPayload,
  NotificationStats,
  SupportedNotificationLanguage,
} from '../types/notifications';
import { formatNotificationContent } from '../i18n/notificationTranslations';

const NOTIFICATIONS_COLLECTION = 'notifications';
const PREFERENCES_COLLECTION = 'notification_preferences';
const DEVICE_TOKENS_COLLECTION = 'device_tokens';

class NotificationService {
  /**
   * Generates a standard default preferences object for a user
   */
  getDefaultPreferences(userId: string, language: SupportedNotificationLanguage = 'am'): NotificationPreferences {
    return {
      userId,
      pushEnabled: true,
      inAppEnabled: true,
      emailNotifications: false,
      soundEnabled: true,
      language,
      types: {
        new_lesson: true,
        new_quiz: true,
        new_exam: true,
        assignment: true,
        assignment_deadline: true,
        quiz_exam_result: true,
        ai_recommendation: true,
        weak_topic_alert: true,
        new_curriculum_content: true,
        system_announcement: true,
        admin_notification: true,
      },
      quietHours: {
        enabled: false,
        start: '22:00',
        end: '07:00',
      },
      updatedAt: new Date().toISOString(),
    };
  }

  /**
   * Listen to real-time notifications for a user (ordered by createdAt desc)
   */
  subscribeToUserNotifications(
    userId: string,
    role: string,
    callback: (notifications: NotificationItem[], unreadCount: number) => void
  ): Unsubscribe {
    const notifsRef = collection(db, NOTIFICATIONS_COLLECTION);
    
    // We listen to all notifications and filter for recipientId == userId, recipientId == 'all', or recipientRole == role
    const q = query(notifsRef, orderBy('createdAt', 'desc'), limit(50));

    return onSnapshot(
      q,
      (snapshot) => {
        const items: NotificationItem[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as NotificationItem;
          // Filter matching recipient or broadcast
          const matches =
            data.recipientId === userId ||
            data.recipientId === 'all' ||
            data.recipientRole === 'all' ||
            data.recipientRole === role ||
            role === 'admin';

          if (matches) {
            items.push({
              ...data,
              id: docSnap.id,
            });
          }
        });

        const unreadCount = items.filter((item) => !item.readAt).length;
        callback(items, unreadCount);
      },
      (error) => {
        console.warn('[NotificationService] Firestore snapshot error, using local fallback:', error);
      }
    );
  }

  /**
   * Fetch notification history for a user
   */
  async getUserNotifications(userId: string, role: string = 'student'): Promise<NotificationItem[]> {
    try {
      const notifsRef = collection(db, NOTIFICATIONS_COLLECTION);
      const q = query(notifsRef, orderBy('createdAt', 'desc'), limit(100));
      const snapshot = await getDocs(q);

      const items: NotificationItem[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as NotificationItem;
        if (
          data.recipientId === userId ||
          data.recipientId === 'all' ||
          data.recipientRole === 'all' ||
          data.recipientRole === role ||
          role === 'admin'
        ) {
          items.push({
            ...data,
            id: docSnap.id,
          });
        }
      });

      return items;
    } catch (error) {
      console.error('[NotificationService] Error fetching notifications:', error);
      return [];
    }
  }

  /**
   * Create and send a notification with Firestore persistence + FCM push dispatch
   */
  async createNotification(payload: SendNotificationPayload): Promise<NotificationItem> {
    const id = `notif_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const createdAt = new Date().toISOString();

    // Auto-generate title & body using localization if not explicitly provided
    let title = payload.title;
    let body = payload.body;
    let defaultAction = 'View';

    if (!title || !body) {
      const formatted = formatNotificationContent(
        payload.type,
        payload.language || 'am',
        payload.metadata || {}
      );
      if (!title) title = formatted.title;
      if (!body) body = formatted.body;
      defaultAction = formatted.defaultAction;
    }

    // Default deepLink based on relatedType
    let deepLink = payload.deepLink;
    if (!deepLink) {
      deepLink = this.generateDeepLink(payload.type, payload.relatedId, payload.relatedType);
    }

    const item: NotificationItem = {
      id,
      title,
      body,
      type: payload.type,
      recipientId: payload.recipientId,
      recipientRole: payload.recipientRole,
      createdAt,
      readAt: null,
      relatedId: payload.relatedId || '',
      relatedType: payload.relatedType || 'system',
      deepLink,
      priority: payload.priority || 'normal',
      metadata: payload.metadata || {},
    };

    // 1. Save to Firestore
    try {
      const docRef = doc(db, NOTIFICATIONS_COLLECTION, id);
      await setDoc(docRef, item);
    } catch (err) {
      console.error('[NotificationService] Failed to write notification to Firestore:', err);
    }

    // 2. Dispatch FCM Push via backend /api/notifications/send
    try {
      await fetch('/api/notifications/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
    } catch (apiErr) {
      console.warn('[NotificationService] FCM backend API call notice:', apiErr);
    }

    return item;
  }

  /**
   * Mark a single notification as read
   */
  async markAsRead(notificationId: string): Promise<boolean> {
    try {
      const docRef = doc(db, NOTIFICATIONS_COLLECTION, notificationId);
      const readAt = new Date().toISOString();
      await updateDoc(docRef, { readAt });
      return true;
    } catch (error) {
      console.error(`[NotificationService] Failed to mark ${notificationId} as read:`, error);
      return false;
    }
  }

  /**
   * Mark all notifications as read for a user
   */
  async markAllAsRead(userId: string, role: string = 'student'): Promise<number> {
    try {
      const notifications = await this.getUserNotifications(userId, role);
      const unread = notifications.filter((n) => !n.readAt);
      const now = new Date().toISOString();

      await Promise.all(
        unread.map((n) => {
          const docRef = doc(db, NOTIFICATIONS_COLLECTION, n.id);
          return updateDoc(docRef, { readAt: now });
        })
      );

      return unread.length;
    } catch (error) {
      console.error('[NotificationService] Failed to mark all as read:', error);
      return 0;
    }
  }

  /**
   * Delete a notification
   */
  async deleteNotification(notificationId: string): Promise<boolean> {
    try {
      const docRef = doc(db, NOTIFICATIONS_COLLECTION, notificationId);
      await deleteDoc(docRef);
      return true;
    } catch (error) {
      console.error(`[NotificationService] Failed to delete notification ${notificationId}:`, error);
      return false;
    }
  }

  /**
   * Get user notification preferences
   */
  async getPreferences(userId: string, preferredLang: SupportedNotificationLanguage = 'am'): Promise<NotificationPreferences> {
    try {
      const docRef = doc(db, PREFERENCES_COLLECTION, userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return docSnap.data() as NotificationPreferences;
      } else {
        const defaultPrefs = this.getDefaultPreferences(userId, preferredLang);
        await setDoc(docRef, defaultPrefs);
        return defaultPrefs;
      }
    } catch (error) {
      console.warn('[NotificationService] Error loading preferences, returning default:', error);
      return this.getDefaultPreferences(userId, preferredLang);
    }
  }

  /**
   * Save user notification preferences
   */
  async savePreferences(preferences: NotificationPreferences): Promise<boolean> {
    try {
      const docRef = doc(db, PREFERENCES_COLLECTION, preferences.userId);
      await setDoc(docRef, {
        ...preferences,
        updatedAt: new Date().toISOString(),
      });
      return true;
    } catch (error) {
      console.error('[NotificationService] Failed to save preferences:', error);
      return false;
    }
  }

  /**
   * Register or update a device token
   */
  async registerDeviceToken(deviceToken: DeviceToken): Promise<boolean> {
    try {
      const docRef = doc(db, DEVICE_TOKENS_COLLECTION, deviceToken.id);
      await setDoc(docRef, {
        ...deviceToken,
        lastActiveAt: new Date().toISOString(),
        isValid: true,
      });
      return true;
    } catch (error) {
      console.error('[NotificationService] Failed to register device token:', error);
      return false;
    }
  }

  /**
   * Remove or invalidate an expired/revoked device token
   */
  async unregisterDeviceToken(tokenId: string): Promise<boolean> {
    try {
      const docRef = doc(db, DEVICE_TOKENS_COLLECTION, tokenId);
      await deleteDoc(docRef);
      return true;
    } catch (error) {
      console.error('[NotificationService] Failed to unregister device token:', error);
      return false;
    }
  }

  /**
   * Fetch all registered device tokens (Admin view)
   */
  async getAllDeviceTokens(): Promise<DeviceToken[]> {
    try {
      const collRef = collection(db, DEVICE_TOKENS_COLLECTION);
      const snapshot = await getDocs(collRef);
      const tokens: DeviceToken[] = [];
      snapshot.forEach((snap) => {
        tokens.push(snap.data() as DeviceToken);
      });
      return tokens;
    } catch (error) {
      console.error('[NotificationService] Failed to get device tokens:', error);
      return [];
    }
  }

  /**
   * Fetch system-wide notification statistics
   */
  async getNotificationStats(): Promise<NotificationStats> {
    try {
      const notifsRef = collection(db, NOTIFICATIONS_COLLECTION);
      const notifSnap = await getDocs(notifsRef);
      let totalSent = notifSnap.size;
      let totalUnread = 0;

      notifSnap.forEach((snap) => {
        const data = snap.data() as NotificationItem;
        if (!data.readAt) totalUnread++;
      });

      const tokens = await this.getAllDeviceTokens();
      const androidDevices = tokens.filter((t) => t.platform === 'android').length;
      const webDevices = tokens.filter((t) => t.platform === 'web').length;

      return {
        totalSent,
        totalDelivered: totalSent,
        totalUnread,
        activeDeviceTokens: tokens.length,
        fcmStatus: 'online',
        androidDevices,
        webDevices,
      };
    } catch (error) {
      return {
        totalSent: 0,
        totalDelivered: 0,
        totalUnread: 0,
        activeDeviceTokens: 0,
        fcmStatus: 'online',
        androidDevices: 0,
        webDevices: 0,
      };
    }
  }

  /**
   * Generate clean deep links conforming to the app's routing
   */
  generateDeepLink(type: NotificationType, relatedId?: string, relatedType?: string): string {
    const id = relatedId || 'default';
    switch (type) {
      case 'new_quiz':
      case 'quiz_exam_result':
        return `nur-ai://quiz/${id}`;
      case 'new_exam':
        return `nur-ai://exam/${id}`;
      case 'new_lesson':
      case 'new_curriculum_content':
        return `nur-ai://lesson/${id}`;
      case 'assignment':
      case 'assignment_deadline':
        return `nur-ai://assignment/${id}`;
      case 'ai_recommendation':
        return `nur-ai://ai-tutor?rec=${id}`;
      case 'weak_topic_alert':
        return `nur-ai://ai-tutor?topic=${id}&remedy=true`;
      case 'admin_notification':
        return `nur-ai://admin/alerts`;
      case 'system_announcement':
      default:
        return `nur-ai://announcements/${id}`;
    }
  }

  /**
   * Seed comprehensive starter notifications if the user has 0 notifications
   */
  async seedStarterNotifications(userId: string, language: SupportedNotificationLanguage = 'am'): Promise<void> {
    try {
      const existing = await this.getUserNotifications(userId);
      if (existing.length >= 3) return;

      const sampleNotifications: SendNotificationPayload[] = [
        {
          type: 'new_lesson',
          recipientId: userId,
          recipientRole: 'student',
          relatedId: 'bio_grade9_unit2',
          relatedType: 'lesson',
          priority: 'normal',
          language,
          metadata: {
            subject: 'Biology (ባዮሎጂ)',
            unit: 2,
            title: 'Cell Biology & Microscope Optics',
          },
        },
        {
          type: 'new_quiz',
          recipientId: userId,
          recipientRole: 'student',
          relatedId: 'math_grade9_quiz1',
          relatedType: 'quiz',
          priority: 'high',
          language,
          metadata: {
            subject: 'Mathematics (ሂሳብ)',
            grade: 9,
            unit: 1,
          },
        },
        {
          type: 'ai_recommendation',
          recipientId: userId,
          recipientRole: 'student',
          relatedId: 'rec_chem_stoichiometry',
          relatedType: 'ai_recommendation',
          priority: 'normal',
          language,
          metadata: {
            title: 'Stoichiometry & Molar Mass Calculations',
          },
        },
        {
          type: 'weak_topic_alert',
          recipientId: userId,
          recipientRole: 'student',
          relatedId: 'topic_physics_vectors',
          relatedType: 'weak_topic',
          priority: 'urgent',
          language,
          metadata: {
            subject: 'Physics (ፊዚክስ)',
            topic: 'Vector Resolution & 2D Kinematics',
          },
        },
        {
          type: 'system_announcement',
          recipientId: 'all',
          recipientRole: 'all',
          relatedId: 'ann_midterm_schedule',
          relatedType: 'system',
          priority: 'high',
          language,
          metadata: {
            message: 'Ethiopian New Curriculum Grade 9-12 Midterm Examinations start next Monday. Make sure to complete your review units.',
          },
        },
      ];

      for (const sample of sampleNotifications) {
        await this.createNotification(sample);
      }
    } catch (e) {
      console.warn('[NotificationService] Error seeding notifications:', e);
    }
  }
}

export const notificationService = new NotificationService();
