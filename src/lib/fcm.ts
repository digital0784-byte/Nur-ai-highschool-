import { getMessaging, getToken, onMessage, isSupported, MessagePayload } from 'firebase/messaging';
import { app } from './firebase';
import { DeviceToken } from '../types/notifications';

let messagingInstance: any = null;

export async function initClientFCM(): Promise<any> {
  if (typeof window === 'undefined') return null;

  try {
    const supported = await isSupported();
    if (supported) {
      if (!messagingInstance) {
        messagingInstance = getMessaging(app);
      }
      return messagingInstance;
    } else {
      console.warn('[FCM] Firebase Messaging is not supported in this environment.');
      return null;
    }
  } catch (err) {
    console.warn('[FCM] Error checking FCM support:', err);
    return null;
  }
}

export async function requestFCMToken(userId: string): Promise<DeviceToken | null> {
  if (typeof window === 'undefined') return null;

  try {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.log('[FCM] Notification permission was not granted:', permission);
      return null;
    }

    const messaging = await initClientFCM();
    let token = '';

    if (messaging && 'serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
        // Retrieve token
        token = await getToken(messaging, {
          serviceWorkerRegistration: registration,
          vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY || undefined,
        });
      } catch (fcmError) {
        console.warn('[FCM] getToken via service worker had error, falling back to client token:', fcmError);
      }
    }

    // Fallback simulated persistent token for preview/sandbox if VAPID isn't configured
    if (!token) {
      const stored = localStorage.getItem(`nur_device_token_${userId}`);
      if (stored) {
        token = stored;
      } else {
        token = `fcm_web_token_${userId.slice(0, 8)}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        localStorage.setItem(`nur_device_token_${userId}`, token);
      }
    }

    const deviceToken: DeviceToken = {
      id: `token_${token.slice(0, 16)}`,
      userId,
      token,
      platform: /Android/i.test(navigator.userAgent) ? 'android' : 'web',
      deviceModel: navigator.userAgent.includes('Android') ? 'Android Mobile' : navigator.platform || 'Web Browser',
      appVersion: '1.2.0-nur-curriculum',
      createdAt: new Date().toISOString(),
      lastActiveAt: new Date().toISOString(),
      isValid: true,
    };

    return deviceToken;
  } catch (error) {
    console.error('[FCM] Failed to request FCM token:', error);
    return null;
  }
}

export function subscribeToForegroundFCM(onNotification: (payload: MessagePayload) => void): () => void {
  let unsubscribe: (() => void) | null = null;

  initClientFCM().then((messaging) => {
    if (messaging) {
      unsubscribe = onMessage(messaging, (payload) => {
        console.log('[FCM] Foreground notification received:', payload);
        onNotification(payload);
      });
    }
  });

  return () => {
    if (unsubscribe) {
      unsubscribe();
    }
  };
}
