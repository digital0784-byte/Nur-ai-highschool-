import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  Unsubscribe,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import {
  Subscription,
  PaymentRecord,
  PaymentAuditLog,
  SubscriptionPricingConfig,
  PaymentMethodName,
  SystemFeedback,
} from '../types/subscription';
import { Grade } from '../types';
import { notificationService } from './notificationService';

export const SUPER_ADMIN_EMAIL = 'mejennur669@gmail.com';

export function isSuperAdmin(email?: string | null, role?: string): boolean {
  if (!email && !role) return false;
  if (email && email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase()) return true;
  if (role === 'SUPER_ADMIN' || role === 'super_admin') return true;
  return false;
}

export const DEFAULT_PRICING_CONFIG: SubscriptionPricingConfig = {
  grade9Price: 160,
  grade10Price: 180,
  grade11Price: 200,
  grade12Price: 200,
  subscriptionDurationDays: 30,
  renewalReminderDays: 5,
  methods: {
    'Telebirr': {
      id: 'Telebirr',
      displayName: 'ቴሌብር (Telebirr)',
      accountName: 'NUR AI High School Tutor',
      accountNumber: '0911 23 45 67',
      shortCodeOrTill: '892144 (Merchant/Till)',
      iconName: 'Smartphone',
      badgeColor: 'bg-amber-50 text-amber-900 border-amber-300',
      instructionsAm: 'በቴሌብር መተግበሪያ ወደ 0911234567 ወይም በነጋዴ ኮድ (Till Number) 892144 ክፍያ ይፈጽሙ። የክፍያውን ሚስጥር ቁጥር (Transaction ID) እና ደረሰኝ ከታች ያስገቡ።',
      instructionsEn: 'Pay via Telebirr App to 0911234567 or Merchant Till Number 892144. Enter the Transaction Reference and upload receipt screenshot.',
      isEnabled: true,
    },
    'Commercial Bank of Ethiopia (CBE)': {
      id: 'Commercial Bank of Ethiopia (CBE)',
      displayName: 'የኢትዮጵያ ንግድ ባንክ (CBE)',
      accountName: 'NUR AI High School Academy',
      accountNumber: '1000 4892 1039 5',
      iconName: 'Building2',
      badgeColor: 'bg-purple-50 text-purple-900 border-purple-300',
      instructionsAm: 'በ CBE Birr ወይም በሞባይል ባንኪንግ ወደ ሂሳብ ቁጥር 1000489210395 ያስተላልፉ። የባንክ ማመሳከሪያ ቁጥር (FT Number) ከታች ይመዝግቡ።',
      instructionsEn: 'Transfer via CBE Birr or Mobile Banking to Account 1000489210395. Enter the FT reference code below.',
      isEnabled: true,
    },
    'Dashen Bank': {
      id: 'Dashen Bank',
      displayName: 'ዳሸን ባንክ (Dashen Bank - Amole)',
      accountName: 'NUR AI High School Education',
      accountNumber: '5219 0382 9102 1',
      iconName: 'Landmark',
      badgeColor: 'bg-blue-50 text-blue-900 border-blue-300',
      instructionsAm: 'በዳሸን ባንክ ወይም በአሞሌ (Amole) ወደ ሂሳብ ቁጥር 5219038291021 ያስተላልፉ። የማረጋገጫውን ቁጥር ያስገቡ።',
      instructionsEn: 'Transfer via Dashen Mobile / Amole to Account 5219038291021. Enter the transaction reference.',
      isEnabled: true,
    },
    'Bank of Abyssinia': {
      id: 'Bank of Abyssinia',
      displayName: 'አቢሲኒያ ባንክ (Bank of Abyssinia)',
      accountName: 'NUR AI Educational Systems',
      accountNumber: '8910 2341 0291',
      iconName: 'CreditCard',
      badgeColor: 'bg-amber-50 text-amber-950 border-amber-400',
      instructionsAm: 'በቦአ (BoA) ሞባይል ባንኪንግ ወደ ሂሳብ ቁጥር 891023410291 ይላኩ። የማረጋገጫ ደረሰኝ ኮድ ያስገቡ።',
      instructionsEn: 'Transfer via BoA Mobile Banking to Account 891023410291. Enter transaction reference number.',
      isEnabled: true,
    },
  },
};

const PAYMENTS_COLLECTION = 'payments';
const SUBSCRIPTIONS_COLLECTION = 'subscriptions';
const SETTINGS_COLLECTION = 'system_settings';
const AUDIT_LOGS_COLLECTION = 'payment_audit_logs';
const FEEDBACKS_COLLECTION = 'system_feedbacks';

class SubscriptionService {
  /**
   * Fetch current system pricing configuration with local fallback
   */
  async getPricingConfig(): Promise<SubscriptionPricingConfig> {
    try {
      const docRef = doc(db, SETTINGS_COLLECTION, 'subscription_pricing');
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        return {
          ...DEFAULT_PRICING_CONFIG,
          ...snap.data(),
          methods: {
            ...DEFAULT_PRICING_CONFIG.methods,
            ...(snap.data().methods || {}),
          },
        } as SubscriptionPricingConfig;
      }
    } catch (err) {
      console.warn('Using default pricing config due to fetch error:', err);
    }
    return DEFAULT_PRICING_CONFIG;
  }

  /**
   * Super Admin update pricing configuration
   * Requires SUPER_ADMIN authorization, validation, and logs old/new price, date/time, adminId
   */
  async updatePricingConfig(
    config: SubscriptionPricingConfig,
    actorEmail: string,
    actorId: string,
    oldConfig?: SubscriptionPricingConfig,
    reason?: string
  ): Promise<void> {
    // 1. Authorization check
    if (!isSuperAdmin(actorEmail)) {
      throw new Error('Unauthorized. Only Super Admin (mejennur669@gmail.com) can update pricing.');
    }

    // 2. Strict validation: prices must be positive numbers
    if (
      config.grade9Price <= 0 ||
      config.grade10Price <= 0 ||
      config.grade11Price <= 0 ||
      config.grade12Price <= 0
    ) {
      throw new Error('Validation error: All grade prices must be positive numbers greater than 0.');
    }
    if (config.subscriptionDurationDays <= 0) {
      throw new Error('Validation error: Subscription duration must be greater than 0 days.');
    }

    const docRef = doc(db, SETTINGS_COLLECTION, 'subscription_pricing');
    const nowIso = new Date().toISOString();
    await setDoc(docRef, {
      ...config,
      updatedAt: nowIso,
      updatedBy: actorEmail,
    });

    const oldPricesStr = oldConfig
      ? `G9: ${oldConfig.grade9Price} ETB, G10: ${oldConfig.grade10Price} ETB, G11: ${oldConfig.grade11Price} ETB, G12: ${oldConfig.grade12Price} ETB`
      : 'Previous default config';
    const newPricesStr = `G9: ${config.grade9Price} ETB, G10: ${config.grade10Price} ETB, G11: ${config.grade11Price} ETB, G12: ${config.grade12Price} ETB`;

    await this.logPaymentAudit({
      action: 'PRICING_UPDATED',
      actorId,
      actorEmail,
      actorRole: 'SUPER_ADMIN',
      adminId: actorId,
      timestamp: nowIso,
      previousStatus: oldPricesStr,
      newStatus: newPricesStr,
      reason: reason || 'Super Admin pricing configuration update',
      details: `Super Admin updated prices from [${oldPricesStr}] to [${newPricesStr}]. Duration: ${config.subscriptionDurationDays} days`,
      metadata: {
        oldPrices: oldConfig || null,
        newPrices: {
          grade9Price: config.grade9Price,
          grade10Price: config.grade10Price,
          grade11Price: config.grade11Price,
          grade12Price: config.grade12Price,
        },
        durationDays: config.subscriptionDurationDays,
        adminId: actorId,
        adminEmail: actorEmail,
      },
    });
  }

  /**
   * Get price in ETB for a given grade
   */
  getPriceForGrade(grade: Grade, config?: SubscriptionPricingConfig): number {
    const cfg = config || DEFAULT_PRICING_CONFIG;
    switch (grade) {
      case 9:
        return cfg.grade9Price;
      case 10:
        return cfg.grade10Price;
      case 11:
        return cfg.grade11Price;
      case 12:
        return cfg.grade12Price;
      default:
        return 160;
    }
  }

  /**
   * Listen to user's active subscription in real time
   */
  subscribeToUserSubscription(
    userId: string,
    callback: (subscription: Subscription | null) => void
  ): Unsubscribe {
    const subRef = doc(db, SUBSCRIPTIONS_COLLECTION, userId);
    return onSnapshot(
      subRef,
      (snap) => {
        if (snap.exists()) {
          const data = snap.data() as Subscription;
          // Check expiry automatically
          if (
            data.status === 'ACTIVE' &&
            new Date(data.expiryDate).getTime() < Date.now()
          ) {
            data.status = 'EXPIRED';
          }
          callback(data);
        } else {
          callback(null);
        }
      },
      (err) => {
        console.warn('Subscription listen error:', err);
        callback(null);
      }
    );
  }

  /**
   * Fetch user's payments history
   */
  async getUserPayments(userId: string): Promise<PaymentRecord[]> {
    try {
      const q = query(
        collection(db, PAYMENTS_COLLECTION),
        where('userId', '==', userId),
        orderBy('submittedAt', 'desc'),
        limit(20)
      );
      const snap = await getDocs(q);
      return snap.docs.map((d) => ({ paymentId: d.id, ...d.data() } as PaymentRecord));
    } catch (err) {
      console.warn('Could not query user payments:', err);
      return [];
    }
  }

  /**
   * Listen to user's latest payment in real time
   */
  subscribeToUserLatestPayment(
    userId: string,
    callback: (payment: PaymentRecord | null) => void
  ): Unsubscribe {
    const q = query(
      collection(db, PAYMENTS_COLLECTION),
      where('userId', '==', userId),
      orderBy('submittedAt', 'desc'),
      limit(1)
    );
    return onSnapshot(
      q,
      (snap) => {
        if (!snap.empty) {
          const docItem = snap.docs[0];
          callback({ paymentId: docItem.id, ...docItem.data() } as PaymentRecord);
        } else {
          callback(null);
        }
      },
      (err) => {
        console.warn('Payments listen error:', err);
        callback(null);
      }
    );
  }

  /**
   * Student submits a payment for verification
   */
  async submitPayment(data: {
    userId: string;
    studentName: string;
    studentEmail?: string;
    grade: Grade;
    amountETB: number;
    paymentMethod: PaymentMethodName;
    transactionReference: string;
    proofImageUrl?: string;
  }): Promise<PaymentRecord> {
    const paymentId = `pay_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();

    const paymentRecord: PaymentRecord = {
      paymentId,
      userId: data.userId,
      studentName: data.studentName,
      studentEmail: data.studentEmail,
      grade: data.grade,
      amountETB: data.amountETB,
      paymentMethod: data.paymentMethod,
      transactionReference: data.transactionReference.trim(),
      proofImageUrl: data.proofImageUrl || '',
      status: 'PENDING',
      submittedAt: now,
    };

    // Save payment record
    await setDoc(doc(db, PAYMENTS_COLLECTION, paymentId), paymentRecord);

    // Update or initialize student's subscription as PENDING
    const subRef = doc(db, SUBSCRIPTIONS_COLLECTION, data.userId);
    const existingSubSnap = await getDoc(subRef);

    const subscriptionData: Subscription = {
      id: data.userId,
      userId: data.userId,
      studentName: data.studentName,
      grade: data.grade,
      planName: `Grade ${data.grade} Monthly Subscription`,
      priceETB: data.amountETB,
      startDate: now,
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'PENDING',
      paymentId,
      createdAt: existingSubSnap.exists() ? existingSubSnap.data().createdAt : now,
      updatedAt: now,
    };

    await setDoc(subRef, subscriptionData);

    // Audit log
    await this.logPaymentAudit({
      paymentId,
      subscriptionId: data.userId,
      action: 'PAYMENT_SUBMITTED',
      actorId: data.userId,
      actorEmail: data.studentEmail || data.studentName,
      actorRole: 'student',
      timestamp: now,
      previousStatus: 'NONE',
      newStatus: 'PENDING',
      details: `Student submitted ${data.amountETB} ETB via ${data.paymentMethod} (Ref: ${data.transactionReference})`,
      metadata: {
        paymentMethod: data.paymentMethod,
        amountETB: data.amountETB,
        transactionReference: data.transactionReference,
        hasProof: Boolean(data.proofImageUrl),
      },
    });

    // Send in-app notification to student
    try {
      await notificationService.createNotification({
        type: 'admin_notification',
        title: 'የክፍያ ማረጋገጫ ጥያቄዎ ደርሶናል (Payment Received)',
        body: `ለክፍል ${data.grade} የከፈሉት ${data.amountETB} ETB በማረጋገጥ ላይ ነው። አስተዳዳሪው እንዳረጋገጠው ሳብስክሪፕሽንዎ ወዲያውኑ ይከፈታል።`,
        recipientId: data.userId,
        recipientRole: 'student',
        priority: 'high',
        deepLink: 'subscription_payment',
        metadata: { paymentId, status: 'PENDING' },
      });
    } catch (e) {
      console.warn('Could not send payment notification:', e);
    }

    // Send notification to Super Admin
    try {
      await notificationService.createNotification({
        type: 'admin_notification',
        title: '🔔 አዲስ የክፍያ ማረጋገጫ ደርሷል (New Payment Submitted)',
        body: `ተማሪ ${data.studentName} (ክፍል ${data.grade}) ${data.amountETB} ETB በ ${data.paymentMethod} አስገብቷል (Ref: ${data.transactionReference})። ደረሰኙን በማየት ያጽድቁ።`,
        recipientId: 'super_admin',
        recipientRole: 'admin',
        priority: 'urgent',
        deepLink: 'payments_billing',
        metadata: { paymentId, status: 'PENDING', studentName: data.studentName, grade: data.grade },
      });
    } catch (e) {
      console.warn('Could not send super admin notification:', e);
    }

    return paymentRecord;
  }

  /**
   * Super Admin approves payment
   */
  async superAdminApprovePayment(params: {
    paymentId: string;
    studentUserId: string;
    adminEmail: string;
    adminId: string;
    grade: Grade;
    amountETB: number;
    durationDays?: number;
  }): Promise<void> {
    const now = new Date();
    const duration = params.durationDays || 30;
    const expiryDate = new Date(now.getTime() + duration * 24 * 60 * 60 * 1000).toISOString();
    const nowIso = now.toISOString();

    // 1. Update Payment status
    const payRef = doc(db, PAYMENTS_COLLECTION, params.paymentId);
    await updateDoc(payRef, {
      status: 'APPROVED',
      verifiedAt: nowIso,
      verifiedBy: params.adminEmail,
    });

    // 2. Set Subscription to ACTIVE
    const subRef = doc(db, SUBSCRIPTIONS_COLLECTION, params.studentUserId);
    await updateDoc(subRef, {
      status: 'ACTIVE',
      startDate: nowIso,
      expiryDate,
      priceETB: params.amountETB,
      grade: params.grade,
      paymentId: params.paymentId,
      updatedAt: nowIso,
    });

    // 3. Audit Log
    await this.logPaymentAudit({
      paymentId: params.paymentId,
      subscriptionId: params.studentUserId,
      action: 'PAYMENT_APPROVED',
      actorId: params.adminId,
      adminId: params.adminId,
      actorEmail: params.adminEmail,
      actorRole: 'SUPER_ADMIN',
      timestamp: nowIso,
      previousStatus: 'PENDING',
      newStatus: 'APPROVED',
      details: `Super Admin approved payment of ${params.amountETB} ETB. Subscription ACTIVE until ${expiryDate}`,
      metadata: {
        grade: params.grade,
        amountETB: params.amountETB,
        expiryDate,
        adminId: params.adminId,
      },
    });

    // 4. Send Notification
    try {
      await notificationService.createNotification({
        type: 'admin_notification',
        title: '🎉 እንኳን ደስ አለዎት! ክፍያዎ ጸድቋል (Subscription Activated)',
        body: `ለክፍል ${params.grade} የፈጸሙት ክፍያ ተረጋግጧል። የኑር AI የሁለተኛ ደረጃ ትምህርት ቤት አገልግሎት ለ 30 ቀናት በሙሉ ተከፍቷል!`,
        recipientId: params.studentUserId,
        recipientRole: 'student',
        priority: 'urgent',
        deepLink: 'lesson',
        metadata: { paymentId: params.paymentId, status: 'ACTIVE', expiryDate },
      });
    } catch (e) {
      console.warn('Could not send approval notification:', e);
    }
  }

  /**
   * Super Admin rejects payment
   */
  async superAdminRejectPayment(params: {
    paymentId: string;
    studentUserId: string;
    adminEmail: string;
    adminId: string;
    rejectionReason: string;
  }): Promise<void> {
    const nowIso = new Date().toISOString();

    // 1. Update Payment status
    const payRef = doc(db, PAYMENTS_COLLECTION, params.paymentId);
    await updateDoc(payRef, {
      status: 'REJECTED',
      rejectionReason: params.rejectionReason,
      verifiedAt: nowIso,
      verifiedBy: params.adminEmail,
    });

    // 2. Update Subscription status
    const subRef = doc(db, SUBSCRIPTIONS_COLLECTION, params.studentUserId);
    try {
      await updateDoc(subRef, {
        status: 'CANCELLED',
        updatedAt: nowIso,
      });
    } catch {
      // ignore if doc missing
    }

    // 3. Audit Log
    await this.logPaymentAudit({
      paymentId: params.paymentId,
      subscriptionId: params.studentUserId,
      action: 'PAYMENT_REJECTED',
      actorId: params.adminId,
      adminId: params.adminId,
      actorEmail: params.adminEmail,
      actorRole: 'SUPER_ADMIN',
      timestamp: nowIso,
      previousStatus: 'PENDING',
      newStatus: 'REJECTED',
      reason: params.rejectionReason,
      details: `Super Admin rejected payment. Reason: ${params.rejectionReason}`,
      metadata: {
        rejectionReason: params.rejectionReason,
        adminId: params.adminId,
      },
    });

    // 4. Send Notification to Student
    try {
      await notificationService.createNotification({
        type: 'admin_notification',
        title: '⚠️ የክፍያ ማረጋገጫ ችግር ተፈጥሯል (Payment Rejected)',
        body: `የላኩት የክፍያ ማረጋገጫ ውድቅ ተደርጓል። ምክንያት፡ ${params.rejectionReason}። እባክዎ ትክክለኛውን ደረሰኝ በማያያዝ እንደገና ይሞክሩ።`,
        recipientId: params.studentUserId,
        recipientRole: 'student',
        priority: 'urgent',
        deepLink: 'subscription_payment',
        metadata: { paymentId: params.paymentId, status: 'REJECTED' },
      });
    } catch (e) {
      console.warn('Could not send rejection notification:', e);
    }
  }

  /**
   * Super Admin manually toggles suspension
   */
  async superAdminToggleSubscriptionSuspension(
    userId: string,
    action: 'SUSPEND' | 'REACTIVATE',
    adminEmail: string,
    adminId: string,
    reason?: string
  ): Promise<void> {
    const nowIso = new Date().toISOString();
    const subRef = doc(db, SUBSCRIPTIONS_COLLECTION, userId);
    const newStatus = action === 'SUSPEND' ? 'SUSPENDED' : 'ACTIVE';

    await updateDoc(subRef, {
      status: newStatus,
      updatedAt: nowIso,
    });

    await this.logPaymentAudit({
      subscriptionId: userId,
      action: action === 'SUSPEND' ? 'SUBSCRIPTION_SUSPENDED' : 'SUBSCRIPTION_REACTIVATED',
      actorId: adminId,
      adminId,
      actorEmail: adminEmail,
      actorRole: 'SUPER_ADMIN',
      timestamp: nowIso,
      previousStatus: action === 'SUSPEND' ? 'ACTIVE' : 'SUSPENDED',
      newStatus,
      reason: reason || 'Admin action',
      details: `Super Admin ${action === 'SUSPEND' ? 'suspended' : 'reactivated'} subscription. Reason: ${reason || 'Admin action'}`,
      metadata: {
        reason: reason || 'Admin action',
        adminId,
      },
    });
  }

  /**
   * Super Admin loads all payments with real-time subscription
   */
  subscribeToAllPayments(
    callback: (payments: PaymentRecord[]) => void
  ): Unsubscribe {
    const q = query(
      collection(db, PAYMENTS_COLLECTION),
      orderBy('submittedAt', 'desc'),
      limit(150)
    );
    return onSnapshot(
      q,
      (snap) => {
        const records = snap.docs.map(
          (d) => ({ paymentId: d.id, ...d.data() } as PaymentRecord)
        );
        callback(records);
      },
      (err) => {
        console.warn('Could not subscribe to all payments:', err);
        callback([]);
      }
    );
  }

  /**
   * Super Admin loads all subscriptions in real time
   */
  subscribeToAllSubscriptions(
    callback: (subscriptions: Subscription[]) => void
  ): Unsubscribe {
    const q = query(
      collection(db, SUBSCRIPTIONS_COLLECTION),
      limit(200)
    );
    return onSnapshot(
      q,
      (snap) => {
        const records = snap.docs.map(
          (d) => ({ id: d.id, ...d.data() } as Subscription)
        );
        callback(records);
      },
      (err) => {
        console.warn('Could not subscribe to all subscriptions:', err);
        callback([]);
      }
    );
  }

  /**
   * Super Admin listens to payment audit logs in real time
   */
  subscribeToAuditLogs(
    callback: (logs: PaymentAuditLog[]) => void
  ): Unsubscribe {
    const q = query(
      collection(db, AUDIT_LOGS_COLLECTION),
      orderBy('timestamp', 'desc'),
      limit(100)
    );
    return onSnapshot(
      q,
      (snap) => {
        const records = snap.docs.map(
          (d) => ({ id: d.id, ...d.data() } as PaymentAuditLog)
        );
        callback(records);
      },
      (err) => {
        console.warn('Could not subscribe to audit logs:', err);
        callback([]);
      }
    );
  }

  /**
   * Super Admin loads all subscriptions
   */
  async getAllSubscriptions(): Promise<Subscription[]> {
    try {
      const snap = await getDocs(collection(db, SUBSCRIPTIONS_COLLECTION));
      return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Subscription));
    } catch (err) {
      console.warn('Could not load subscriptions:', err);
      return [];
    }
  }

  /**
   * Audit log helper
   */
  private async logPaymentAudit(data: Omit<PaymentAuditLog, 'id'>): Promise<void> {
    try {
      const logId = `audit_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      await setDoc(doc(db, AUDIT_LOGS_COLLECTION, logId), {
        id: logId,
        ...data,
      });
    } catch (err) {
      console.warn('Failed to record payment audit log:', err);
    }
  }

  /**
   * Get payment audit logs
   */
  async getPaymentAuditLogs(limitCount = 50): Promise<PaymentAuditLog[]> {
    try {
      const q = query(
        collection(db, AUDIT_LOGS_COLLECTION),
        orderBy('timestamp', 'desc'),
        limit(limitCount)
      );
      const snap = await getDocs(q);
      return snap.docs.map((d) => ({ id: d.id, ...d.data() } as PaymentAuditLog));
    } catch {
      return [];
    }
  }

  // ==========================================
  // SYSTEM FEEDBACK ("ተጠቃሚዎች ስለ ሲስተሙ አስተያዬት መስጫ ክፍል")
  // ==========================================

  /**
   * User submits feedback about the system
   */
  async submitSystemFeedback(feedback: {
    userId: string;
    userName: string;
    userEmail: string;
    userRole: string;
    grade?: Grade;
    rating: number;
    category: any;
    comment: string;
  }): Promise<SystemFeedback> {
    const feedbackId = `fb_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();

    const record: SystemFeedback = {
      id: feedbackId,
      userId: feedback.userId,
      userName: feedback.userName,
      userEmail: feedback.userEmail,
      userRole: feedback.userRole,
      grade: feedback.grade,
      rating: feedback.rating,
      category: feedback.category,
      comment: feedback.comment.trim(),
      status: 'PENDING',
      createdAt: now,
      updatedAt: now,
    };

    await setDoc(doc(db, FEEDBACKS_COLLECTION, feedbackId), record);
    return record;
  }

  /**
   * Listen to user feedbacks
   */
  subscribeToFeedbacks(
    callback: (feedbacks: SystemFeedback[]) => void
  ): Unsubscribe {
    const q = query(
      collection(db, FEEDBACKS_COLLECTION),
      orderBy('createdAt', 'desc'),
      limit(100)
    );
    return onSnapshot(
      q,
      (snap) => {
        callback(snap.docs.map((d) => ({ id: d.id, ...d.data() } as SystemFeedback)));
      },
      (err) => {
        console.warn('Feedbacks listen error:', err);
        callback([]);
      }
    );
  }

  /**
   * Super Admin responds to feedback
   */
  async respondToFeedback(
    feedbackId: string,
    adminResponse: string,
    status: 'REVIEWED' | 'ADDRESSED'
  ): Promise<void> {
    const nowIso = new Date().toISOString();
    await updateDoc(doc(db, FEEDBACKS_COLLECTION, feedbackId), {
      adminResponse,
      status,
      respondedAt: nowIso,
      updatedAt: nowIso,
    });
  }
}

export const subscriptionService = new SubscriptionService();
