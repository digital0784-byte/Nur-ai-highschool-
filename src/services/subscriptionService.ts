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
  PricingConfig,
  PaymentMethodConfig,
  PaymentMethodName,
  SystemFeedback,
} from '../types/subscription';
import { Grade } from '../types';
import { Entitlement, EntitlementStatus } from '../types/premiumSecurity';
import { notificationService } from './notificationService';

export const SUPER_ADMIN_EMAIL = 'mejennur669@gmail.com';
export const DEVELOPER_INFO = {
  name: 'Nuriye Ahmed Adem',
  phone: '0910097862',
  email: 'mejennur669@gmail.com',
  title: 'Lead Developer & System Architect',
};

/**
 * Strict Super Admin Verification:
 * ONLY the owner/creator email (mejennur669@gmail.com) holds permanent Super Admin privileges.
 */
export function isSuperAdmin(email?: string | null, role?: string): boolean {
  if (!email && !role) return false;
  if (email && email.trim().toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase()) return true;
  // If role says SUPER_ADMIN, strictly verify it also matches the sole super admin email
  if ((role === 'SUPER_ADMIN' || role === 'super_admin') && email && email.trim().toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase()) {
    return true;
  }
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
const ENTITLEMENTS_COLLECTION = 'entitlements';
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
   * Subscribe to system pricing config in real time
   */
  subscribeToPricingConfig(callback: (config: PricingConfig) => void): Unsubscribe {
    const docRef = doc(db, SETTINGS_COLLECTION, 'subscription_pricing');
    return onSnapshot(
      docRef,
      (snap) => {
        if (snap.exists()) {
          const d = snap.data();
          callback({
            gradeMonthlyPrices: {
              9: d.grade9Price ?? d.gradeMonthlyPrices?.[9] ?? 160,
              10: d.grade10Price ?? d.gradeMonthlyPrices?.[10] ?? 180,
              11: d.grade11Price ?? d.gradeMonthlyPrices?.[11] ?? 200,
              12: d.grade12Price ?? d.gradeMonthlyPrices?.[12] ?? 200,
            },
            billingCycleDays: d.subscriptionDurationDays ?? d.billingCycleDays ?? 30,
            currency: d.currency ?? 'ETB',
            freeTierEnabled: d.freeTierEnabled ?? false,
            updatedAt: d.updatedAt,
            updatedBy: d.updatedBy,
          });
        } else {
          callback({
            gradeMonthlyPrices: {
              9: DEFAULT_PRICING_CONFIG.grade9Price,
              10: DEFAULT_PRICING_CONFIG.grade10Price,
              11: DEFAULT_PRICING_CONFIG.grade11Price,
              12: DEFAULT_PRICING_CONFIG.grade12Price,
            },
            billingCycleDays: DEFAULT_PRICING_CONFIG.subscriptionDurationDays,
            currency: 'ETB',
            freeTierEnabled: false,
          });
        }
      },
      (err) => {
        console.warn('Could not subscribe to pricing config:', err);
        callback({
          gradeMonthlyPrices: { 9: 160, 10: 180, 11: 200, 12: 200 },
          billingCycleDays: 30,
          currency: 'ETB',
          freeTierEnabled: false,
        });
      }
    );
  }

  /**
   * Subscribe to system payment methods in real time
   */
  subscribeToPaymentMethods(callback: (methods: PaymentMethodConfig[]) => void): Unsubscribe {
    const docRef = doc(db, SETTINGS_COLLECTION, 'subscription_pricing');
    return onSnapshot(
      docRef,
      (snap) => {
        const methodsObj = snap.exists() && snap.data()?.methods
          ? snap.data().methods
          : DEFAULT_PRICING_CONFIG.methods;

        const list: PaymentMethodConfig[] = Object.values(methodsObj).map((m: any) => ({
          ...m,
          name: m.displayName || m.name || m.id,
          enabled: m.isEnabled ?? m.enabled ?? true,
        }));
        callback(list);
      },
      (err) => {
        console.warn('Payment methods subscription error:', err);
        callback(
          Object.values(DEFAULT_PRICING_CONFIG.methods).map((m) => ({
            ...m,
            name: m.displayName,
            enabled: m.isEnabled,
          }))
        );
      }
    );
  }

  /**
   * Super Admin update payment method configuration
   */
  async updatePaymentMethod(
    methodId: PaymentMethodName | string,
    updates: Partial<PaymentMethodConfig>
  ): Promise<void> {
    const docRef = doc(db, SETTINGS_COLLECTION, 'subscription_pricing');
    const snap = await getDoc(docRef);
    const existing = snap.exists() ? snap.data() : { ...DEFAULT_PRICING_CONFIG };
    const currentMethods = existing.methods || { ...DEFAULT_PRICING_CONFIG.methods };

    const matchedKey =
      Object.keys(currentMethods).find(
        (k) =>
          k.toLowerCase() === methodId.toLowerCase() ||
          currentMethods[k]?.id?.toLowerCase() === methodId.toLowerCase()
      ) || methodId;

    const existingMethod = currentMethods[matchedKey] || {};
    const updatedMethod = {
      ...existingMethod,
      ...updates,
      id: existingMethod.id || methodId,
      displayName: updates.displayName || updates.name || existingMethod.displayName || methodId,
      name: updates.name || updates.displayName || existingMethod.name || methodId,
      isEnabled: updates.isEnabled ?? updates.enabled ?? existingMethod.isEnabled ?? true,
      enabled: updates.enabled ?? updates.isEnabled ?? existingMethod.enabled ?? true,
    };

    currentMethods[matchedKey] = updatedMethod;

    await setDoc(
      docRef,
      {
        ...existing,
        methods: currentMethods,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  }

  /**
   * Fetch a student's current active subscription
   */
  async getStudentSubscription(userId: string): Promise<Subscription | null> {
    try {
      const subRef = doc(db, SUBSCRIPTIONS_COLLECTION, userId);
      const snap = await getDoc(subRef);
      if (snap.exists()) {
        const data = snap.data() as Subscription;
        if (
          data.status === 'ACTIVE' &&
          new Date(data.expiryDate).getTime() < Date.now()
        ) {
          data.status = 'EXPIRED';
        }
        return data;
      }
      return null;
    } catch (err) {
      console.warn('Could not get student subscription:', err);
      return null;
    }
  }

  /**
   * Fetch a student's payment records
   */
  async getStudentPayments(userId: string): Promise<PaymentRecord[]> {
    return this.getUserPayments(userId);
  }

  /**
   * Super Admin update pricing configuration
   * Requires SUPER_ADMIN authorization, validation, and logs audit trail
   */
  async updatePricingConfig(
    config: any,
    actorEmailOrObj?: string | { uid?: string; email?: string },
    actorId?: string,
    oldConfig?: SubscriptionPricingConfig,
    reason?: string
  ): Promise<void> {
    const actorEmail =
      typeof actorEmailOrObj === 'string'
        ? actorEmailOrObj
        : actorEmailOrObj?.email || SUPER_ADMIN_EMAIL;
    const adminId =
      actorId ||
      (typeof actorEmailOrObj === 'object' ? actorEmailOrObj?.uid : undefined) ||
      'super_admin_id';

    // 1. Authorization check
    if (!isSuperAdmin(actorEmail)) {
      throw new Error('Unauthorized. Only Super Admin (mejennur669@gmail.com) can update pricing.');
    }

    const grade9 = config.gradeMonthlyPrices ? config.gradeMonthlyPrices[9] : config.grade9Price;
    const grade10 = config.gradeMonthlyPrices ? config.gradeMonthlyPrices[10] : config.grade10Price;
    const grade11 = config.gradeMonthlyPrices ? config.gradeMonthlyPrices[11] : config.grade11Price;
    const grade12 = config.gradeMonthlyPrices ? config.gradeMonthlyPrices[12] : config.grade12Price;
    const durationDays = config.billingCycleDays || config.subscriptionDurationDays || 30;

    // 2. Strict validation: prices must be positive numbers
    if (grade9 <= 0 || grade10 <= 0 || grade11 <= 0 || grade12 <= 0) {
      throw new Error('Validation error: All grade prices must be positive numbers greater than 0.');
    }
    if (durationDays <= 0) {
      throw new Error('Validation error: Subscription duration must be greater than 0 days.');
    }

    const docRef = doc(db, SETTINGS_COLLECTION, 'subscription_pricing');
    const nowIso = new Date().toISOString();
    const payload = {
      grade9Price: Number(grade9),
      grade10Price: Number(grade10),
      grade11Price: Number(grade11),
      grade12Price: Number(grade12),
      subscriptionDurationDays: Number(durationDays),
      renewalReminderDays: config.renewalReminderDays || 3,
      methods: config.methods || DEFAULT_PRICING_CONFIG.methods,
      gradeMonthlyPrices: {
        9: Number(grade9),
        10: Number(grade10),
        11: Number(grade11),
        12: Number(grade12),
      },
      billingCycleDays: Number(durationDays),
      currency: config.currency || 'ETB',
      freeTierEnabled: config.freeTierEnabled ?? false,
      updatedAt: nowIso,
      updatedBy: actorEmail,
    };

    await setDoc(docRef, payload, { merge: true });

    const oldPricesStr = oldConfig
      ? `G9: ${oldConfig.grade9Price} ETB, G10: ${oldConfig.grade10Price} ETB, G11: ${oldConfig.grade11Price} ETB, G12: ${oldConfig.grade12Price} ETB`
      : 'Previous default config';
    const newPricesStr = `G9: ${grade9} ETB, G10: ${grade10} ETB, G11: ${grade11} ETB, G12: ${grade12} ETB`;

    await this.logPaymentAudit({
      action: 'PRICING_UPDATED',
      actorId: adminId,
      actorEmail,
      actorRole: 'SUPER_ADMIN',
      adminId,
      timestamp: nowIso,
      previousStatus: oldPricesStr,
      newStatus: newPricesStr,
      reason: reason || 'Super Admin pricing configuration update',
      details: `Super Admin updated prices from [${oldPricesStr}] to [${newPricesStr}]. Duration: ${durationDays} days`,
      metadata: {
        oldPrices: oldConfig || null,
        newPrices: {
          grade9Price: grade9,
          grade10Price: grade10,
          grade11Price: grade11,
          grade12Price: grade12,
        },
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

    // 2b. PART 4 & 7: Provision Server-Side Verified Entitlement
    const entitlementRef = doc(db, ENTITLEMENTS_COLLECTION, params.studentUserId);
    const entitlementData: Entitlement = {
      id: params.studentUserId,
      studentId: params.studentUserId,
      entitlementType: 'ALL_PREMIUM',
      plan: `Grade ${params.grade} Monthly Premium`,
      premium: true,
      grade: params.grade,
      status: 'ACTIVE',
      startDate: nowIso,
      endDate: expiryDate,
      sourcePaymentId: params.paymentId,
      createdAt: nowIso,
      updatedAt: nowIso,
    };
    await setDoc(entitlementRef, entitlementData, { merge: true });

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

    // 2b. Revoke Entitlement
    try {
      const entRef = doc(db, ENTITLEMENTS_COLLECTION, params.studentUserId);
      await updateDoc(entRef, {
        status: 'REVOKED',
        premium: false,
        updatedAt: nowIso,
      });
    } catch {
      // ignore if not found
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
    actionOrBool: 'SUSPEND' | 'REACTIVATE' | boolean,
    arg3?: string | { uid?: string; email?: string },
    arg4?: string | { uid?: string; email?: string },
    arg5?: string
  ): Promise<void> {
    const isSuspending = actionOrBool === true || actionOrBool === 'SUSPEND';
    const action: 'SUSPEND' | 'REACTIVATE' = isSuspending ? 'SUSPEND' : 'REACTIVATE';
    const newStatus = isSuspending ? 'SUSPENDED' : 'ACTIVE';

    let adminEmail = SUPER_ADMIN_EMAIL;
    let adminId = 'super_admin_id';
    let reason = '';

    if (typeof arg3 === 'string' && (arg3.includes('@') || !arg3.trim().includes(' '))) {
      adminEmail = arg3;
      adminId = typeof arg4 === 'string' ? arg4 : (arg4?.uid || 'super_admin_id');
      reason = arg5 || '';
    } else if (typeof arg3 === 'string') {
      reason = arg3;
      if (typeof arg4 === 'object' && arg4) {
        adminEmail = arg4.email || SUPER_ADMIN_EMAIL;
        adminId = arg4.uid || 'super_admin_id';
      }
    } else if (typeof arg3 === 'object' && arg3) {
      adminEmail = arg3.email || SUPER_ADMIN_EMAIL;
      adminId = arg3.uid || 'super_admin_id';
    }

    const nowIso = new Date().toISOString();
    const subRef = doc(db, SUBSCRIPTIONS_COLLECTION, userId);

    await updateDoc(subRef, {
      status: newStatus,
      updatedAt: nowIso,
    });

    await this.logPaymentAudit({
      subscriptionId: userId,
      action: isSuspending ? 'SUBSCRIPTION_SUSPENDED' : 'SUBSCRIPTION_REACTIVATED',
      actorId: adminId,
      adminId,
      actorEmail: adminEmail,
      actorRole: 'SUPER_ADMIN',
      timestamp: nowIso,
      previousStatus: isSuspending ? 'ACTIVE' : 'SUSPENDED',
      newStatus,
      reason: reason || 'Admin action',
      details: `Super Admin ${isSuspending ? 'suspended' : 'reactivated'} subscription. Reason: ${reason || 'Admin action'}`,
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

  /**
   * Fetch verified student entitlement
   */
  async getStudentEntitlement(studentId: string): Promise<Entitlement | null> {
    try {
      const snap = await getDoc(doc(db, ENTITLEMENTS_COLLECTION, studentId));
      if (snap.exists()) {
        const ent = snap.data() as Entitlement;
        if (ent.status === 'ACTIVE' && new Date(ent.endDate).getTime() < Date.now()) {
          ent.status = 'EXPIRED';
        }
        return ent;
      }
    } catch (e) {
      console.warn('Error fetching entitlement:', e);
    }
    return null;
  }

  /**
   * Listen to student entitlement changes in real time
   */
  subscribeToStudentEntitlement(
    studentId: string,
    callback: (entitlement: Entitlement | null) => void
  ): Unsubscribe {
    const entRef = doc(db, ENTITLEMENTS_COLLECTION, studentId);
    return onSnapshot(
      entRef,
      (snap) => {
        if (snap.exists()) {
          const ent = snap.data() as Entitlement;
          if (ent.status === 'ACTIVE' && new Date(ent.endDate).getTime() < Date.now()) {
            ent.status = 'EXPIRED';
          }
          callback(ent);
        } else {
          callback(null);
        }
      },
      (err) => {
        console.warn('Entitlement snapshot error:', err);
        callback(null);
      }
    );
  }
}

export const subscriptionService = new SubscriptionService();
