import { initializeAppCheck, ReCaptchaV3Provider, CustomProvider, getToken, AppCheck } from 'firebase/app-check';
import { app } from './firebase';

let appCheckInstance: AppCheck | null = null;
let isAppCheckInitialized = false;

declare global {
  interface Window {
    FIREBASE_APPCHECK_DEBUG_TOKEN?: boolean | string;
  }
}

/**
 * Initialize Firebase App Check
 * Supports ReCaptchaV3 in production, and self.FIREBASE_APPCHECK_DEBUG_TOKEN in development.
 */
export function initAppCheck(): AppCheck | null {
  if (typeof window === 'undefined') return null;
  if (isAppCheckInitialized && appCheckInstance) return appCheckInstance;

  try {
    const isDev = import.meta.env.DEV || window.location.hostname === 'localhost';
    const siteKey = import.meta.env.VITE_APPCHECK_SITE_KEY;
    const debugToken = import.meta.env.VITE_APPCHECK_DEBUG_TOKEN;

    if (isDev || !siteKey) {
      // In development or when siteKey is not yet provisioned, configure debug token
      window.FIREBASE_APPCHECK_DEBUG_TOKEN = debugToken || true;
      console.log('[AppCheck] Initialized in development mode with debug token support.');
    }

    if (siteKey) {
      appCheckInstance = initializeAppCheck(app, {
        provider: new ReCaptchaV3Provider(siteKey),
        isTokenAutoRefreshEnabled: true,
      });
      isAppCheckInitialized = true;
      console.log('[AppCheck] Initialized with ReCaptchaV3Provider.');
    } else {
      // Fallback debug custom provider for environments without recaptcha site key
      appCheckInstance = initializeAppCheck(app, {
        provider: new CustomProvider({
          getToken: async () => {
            return {
              token: 'nur-appcheck-dev-token-' + Date.now(),
              expireTimeMillis: Date.now() + 3600000,
            };
          },
        }),
        isTokenAutoRefreshEnabled: true,
      });
      isAppCheckInitialized = true;
    }
  } catch (err: any) {
    console.warn('[AppCheck] Note on AppCheck init (continuing gracefully):', err.message);
  }

  return appCheckInstance;
}

/**
 * Retrieve active App Check token for backend authorization headers
 */
export async function getAppCheckToken(): Promise<string | null> {
  try {
    if (!appCheckInstance) {
      initAppCheck();
    }
    if (appCheckInstance) {
      const result = await getToken(appCheckInstance, false);
      return result.token;
    }
  } catch (err) {
    // If offline or blocked by adblockers, provide fallback token
    return 'nur-fallback-appcheck-token';
  }
  return 'nur-fallback-appcheck-token';
}
