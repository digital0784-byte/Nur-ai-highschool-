import { auth, db } from '../lib/firebase';
import {
  AccessVerificationResponse,
  ProtectedContentItem,
  UsageLimitsConfig,
  SecurityLogItem,
} from '../types/premiumSecurity';
import { SUPER_ADMIN_EMAIL } from './subscriptionService';

class PremiumContentService {
  /**
   * Helper to get current Firebase user's ID token
   */
  private async getIdToken(): Promise<string | null> {
    const user = auth.currentUser;
    if (!user) return null;
    try {
      return await user.getIdToken();
    } catch {
      return null;
    }
  }

  /**
   * PART 7: Server-side content access verification
   * Requests temporary time-bound signed token and authorized stream URL
   */
  async verifyContentAccess(
    contentId: string,
    contentType: 'video' | 'animation_2d' | 'animation_3d'
  ): Promise<AccessVerificationResponse> {
    try {
      const token = await this.getIdToken();
      const currentUser = auth.currentUser;

      const response = await fetch('/api/premium/verify-access', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          contentId,
          contentType,
          userId: currentUser?.uid,
          userEmail: currentUser?.email,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          entitled: false,
          reason: errorData.reason || 'FRAUD_BLOCKED',
          message: errorData.message || 'Verification failed. Please check your subscription status.',
        };
      }

      return await response.json();
    } catch (err: any) {
      console.warn('Server access verification error, using local fallback:', err);
      // Fallback check if server offline or development preview
      const currentUser = auth.currentUser;
      const isSuper =
        currentUser?.email?.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase();

      if (isSuper) {
        return {
          entitled: true,
          message: 'Super Admin access granted.',
          contentToken: `mock_admin_token_${Date.now()}`,
          authorizedStreamUrl: '',
          watermark: {
            studentId: currentUser?.uid || 'super_admin',
            maskedEmail: currentUser?.email || 'admin@nur.et',
            text: `NUR AI • Super Admin • ${new Date().toLocaleDateString()}`,
            timestamp: new Date().toISOString(),
          },
        };
      }

      return {
        entitled: false,
        reason: 'NOT_AUTHENTICATED',
        message: 'Could not connect to authentication server. Please verify your connection.',
      };
    }
  }

  /**
   * Request email password recovery
   */
  async requestEmailRecovery(email: string): Promise<{ success: boolean; message: string }> {
    const res = await fetch('/api/auth/recovery-request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    return await res.json();
  }

  /**
   * Request phone OTP password recovery
   */
  async requestPhoneOtp(phone: string): Promise<{ success: boolean; message: string; challengeId?: string }> {
    const res = await fetch('/api/auth/phone-recovery-request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone }),
    });
    return await res.json();
  }

  /**
   * Verify phone recovery OTP
   */
  async verifyPhoneOtp(
    phone: string,
    otp: string,
    challengeId?: string
  ): Promise<{ success: boolean; message: string; resetToken?: string }> {
    const res = await fetch('/api/auth/phone-recovery-verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, otp, challengeId }),
    });
    return await res.json();
  }

  /**
   * Reset password with verified phone OTP token
   */
  async resetPasswordWithPhoneToken(
    resetToken: string,
    newPassword: string
  ): Promise<{ success: boolean; message: string }> {
    const res = await fetch('/api/auth/phone-recovery-reset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resetToken, newPassword }),
    });
    return await res.json();
  }

  /**
   * Change password from Settings (authenticated)
   */
  async changePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<{ success: boolean; message: string }> {
    const token = await this.getIdToken();
    const res = await fetch('/api/auth/change-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        currentPassword,
        newPassword,
        userId: auth.currentUser?.uid,
        userEmail: auth.currentUser?.email,
      }),
    });
    return await res.json();
  }

  /**
   * Fetch active sessions for the current student
   */
  async getActiveSessions(): Promise<any[]> {
    const token = await this.getIdToken();
    const res = await fetch('/api/auth/active-sessions', {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.sessions || [];
  }

  /**
   * Terminate all other sessions for security
   */
  async signOutAllOtherDevices(): Promise<{ success: boolean; message: string }> {
    const token = await this.getIdToken();
    const res = await fetch('/api/auth/sign-out-all', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    return await res.json();
  }

  /**
   * Super Admin: Fetch protected content list
   */
  async getAdminProtectedContent(): Promise<ProtectedContentItem[]> {
    const token = await this.getIdToken();
    const res = await fetch('/api/admin/premium-content', {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    if (!res.ok) return [];
    return await res.json();
  }

  /**
   * Super Admin: Save protected content item
   */
  async saveProtectedContent(content: Partial<ProtectedContentItem>): Promise<boolean> {
    const token = await this.getIdToken();
    const res = await fetch('/api/admin/premium-content', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(content),
    });
    return res.ok;
  }

  /**
   * Super Admin: Delete protected content
   */
  async deleteProtectedContent(contentId: string): Promise<boolean> {
    const token = await this.getIdToken();
    const res = await fetch(`/api/admin/premium-content/${contentId}`, {
      method: 'DELETE',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    return res.ok;
  }

  /**
   * Super Admin: Get Usage Limits
   */
  async getUsageLimits(): Promise<UsageLimitsConfig> {
    const res = await fetch('/api/admin/usage-limits');
    if (!res.ok) {
      return {
        dailyVideoLimit: 50,
        weeklyAnimationLimit: 100,
        dailyAiQuestionsLimit: 100,
        dailyExamAttemptsLimit: 20,
        maxConcurrentSessions: 2,
      };
    }
    return await res.json();
  }

  /**
   * Super Admin: Update Usage Limits
   */
  async updateUsageLimits(limits: Partial<UsageLimitsConfig>): Promise<boolean> {
    const token = await this.getIdToken();
    const res = await fetch('/api/admin/usage-limits', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(limits),
    });
    return res.ok;
  }

  /**
   * Super Admin: Get Security Audit Logs
   */
  async getSecurityLogs(): Promise<SecurityLogItem[]> {
    const token = await this.getIdToken();
    const res = await fetch('/api/admin/security-audit-logs', {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    if (!res.ok) return [];
    return await res.json();
  }
}

export const premiumContentService = new PremiumContentService();
