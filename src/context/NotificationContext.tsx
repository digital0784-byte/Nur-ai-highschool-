import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { useLanguage } from './LanguageContext';
import {
  NotificationItem,
  NotificationPreferences,
  DeviceToken,
  SendNotificationPayload,
  SupportedNotificationLanguage,
} from '../types/notifications';
import { notificationService } from '../services/notificationService';
import { requestFCMToken, subscribeToForegroundFCM } from '../lib/fcm';

interface NotificationContextType {
  notifications: NotificationItem[];
  unreadCount: number;
  loading: boolean;
  preferences: NotificationPreferences | null;
  activeToast: NotificationItem | null;
  deviceToken: DeviceToken | null;
  fcmPermission: NotificationPermission | 'default';
  requestPermission: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  sendNotification: (payload: SendNotificationPayload) => Promise<NotificationItem>;
  updatePreferences: (newPrefs: NotificationPreferences) => Promise<void>;
  dismissToast: () => void;
  triggerDeepLink: (deepLink: string, notifId?: string) => void;
  onDeepLinkNavigation?: (deepLink: string) => void;
  setOnDeepLinkNavigation: (fn: (deepLink: string) => void) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, userProfile } = useAuth();
  const { language } = useLanguage();

  const activeUid = user?.uid || userProfile?.uid || 'student_demo_user';
  const activeRole = userProfile?.role || 'student';
  const supportedLang = (['en', 'am', 'om', 'ti', 'so'].includes(language)
    ? language
    : 'am') as SupportedNotificationLanguage;

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null);
  const [activeToast, setActiveToast] = useState<NotificationItem | null>(null);
  const [deviceToken, setDeviceToken] = useState<DeviceToken | null>(null);
  const [fcmPermission, setFcmPermission] = useState<NotificationPermission | 'default'>('default');
  const [deepLinkHandler, setDeepLinkHandler] = useState<((deepLink: string) => void) | null>(null);

  // Check initial browser notification permission
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setFcmPermission(Notification.permission);
    }
  }, []);

  // Request notification permission and register FCM device token
  const requestPermission = useCallback(async () => {
    try {
      const devToken = await requestFCMToken(activeUid);
      if (devToken) {
        setDeviceToken(devToken);
        await notificationService.registerDeviceToken(devToken);
        if (typeof window !== 'undefined' && 'Notification' in window) {
          setFcmPermission(Notification.permission);
        }
      }
    } catch (e) {
      console.warn('[NotificationContext] Failed to acquire FCM token:', e);
    }
  }, [activeUid]);

  // Load preferences and real-time notifications
  useEffect(() => {
    let unsubscribe: (() => void) | null = null;
    setLoading(true);

    // 1. Fetch preferences
    notificationService.getPreferences(activeUid, supportedLang).then((prefs) => {
      setPreferences(prefs);
    });

    // 2. Ensure default notifications exist
    notificationService.seedStarterNotifications(activeUid, supportedLang);

    // 3. Subscribe to real-time notification stream
    unsubscribe = notificationService.subscribeToUserNotifications(
      activeUid,
      activeRole,
      (items, unread) => {
        setNotifications(items);
        setUnreadCount(unread);
        setLoading(false);
      }
    );

    // 4. Request FCM token automatically in background if already granted
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      requestPermission();
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [activeUid, activeRole, supportedLang, requestPermission]);

  // Listen to foreground FCM messages
  useEffect(() => {
    const unsubFCM = subscribeToForegroundFCM((payload) => {
      const title = payload.notification?.title || payload.data?.title || 'NUR AI High School';
      const body = payload.notification?.body || payload.data?.body || '';
      const type = (payload.data?.type as any) || 'system_announcement';
      const deepLink = payload.data?.deepLink || '/';

      const toastItem: NotificationItem = {
        id: payload.data?.id || `fcm_${Date.now()}`,
        title,
        body,
        type,
        recipientId: activeUid,
        recipientRole: activeRole as any,
        createdAt: new Date().toISOString(),
        readAt: null,
        relatedId: payload.data?.relatedId || '',
        relatedType: (payload.data?.relatedType as any) || 'system',
        deepLink,
        priority: (payload.data?.priority as any) || 'high',
      };

      // Show in-app banner toast
      setActiveToast(toastItem);
    });

    return () => {
      unsubFCM();
    };
  }, [activeUid, activeRole]);

  // Play subtle chime when high-priority toast arrives
  useEffect(() => {
    if (activeToast && preferences?.soundEnabled) {
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
        osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15); // A5
        gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.4);
      } catch (audioErr) {
        // Silent catch for autoplay policies
      }
    }
  }, [activeToast, preferences?.soundEnabled]);

  const markAsRead = useCallback(async (id: string) => {
    await notificationService.markAsRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, readAt: new Date().toISOString() } : n))
    );
    setUnreadCount((c) => Math.max(0, c - 1));
  }, []);

  const markAllAsRead = useCallback(async () => {
    await notificationService.markAllAsRead(activeUid, activeRole);
    const now = new Date().toISOString();
    setNotifications((prev) => prev.map((n) => ({ ...n, readAt: now })));
    setUnreadCount(0);
  }, [activeUid, activeRole]);

  const deleteNotification = useCallback(async (id: string) => {
    await notificationService.deleteNotification(id);
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const sendNotification = useCallback(
    async (payload: SendNotificationPayload) => {
      const created = await notificationService.createNotification({
        ...payload,
        language: payload.language || supportedLang,
      });

      // Also display locally if targeted to current user
      if (
        created.recipientId === activeUid ||
        created.recipientId === 'all' ||
        created.recipientRole === 'all' ||
        created.recipientRole === activeRole
      ) {
        setActiveToast(created);
      }

      return created;
    },
    [activeUid, activeRole, supportedLang]
  );

  const updatePreferences = useCallback(
    async (newPrefs: NotificationPreferences) => {
      setPreferences(newPrefs);
      await notificationService.savePreferences(newPrefs);
    },
    []
  );

  const dismissToast = useCallback(() => {
    setActiveToast(null);
  }, []);

  const triggerDeepLink = useCallback(
    (deepLink: string, notifId?: string) => {
      if (notifId) {
        markAsRead(notifId);
      }
      dismissToast();

      console.log(`[DEEP-LINK] Navigating to: ${deepLink}`);

      // If a custom handler is registered by App.tsx / StudentAppView, invoke it
      if (deepLinkHandler) {
        deepLinkHandler(deepLink);
      }

      // Also emit a DOM custom event for app-wide reactive listening
      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('NUR_DEEP_LINK_NAVIGATE', {
            detail: { deepLink },
          })
        );
      }
    },
    [deepLinkHandler, markAsRead, dismissToast]
  );

  const setOnDeepLinkNavigation = useCallback((fn: (deepLink: string) => void) => {
    setDeepLinkHandler(() => fn);
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        preferences,
        activeToast,
        deviceToken,
        fcmPermission,
        requestPermission,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        sendNotification,
        updatePreferences,
        dismissToast,
        triggerDeepLink,
        setOnDeepLinkNavigation,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
