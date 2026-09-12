import React, { useState, useEffect, useMemo } from 'react';
import {
  CreditCard,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Filter,
  DollarSign,
  TrendingUp,
  Users,
  ShieldCheck,
  Eye,
  Settings,
  AlertTriangle,
  RotateCcw,
  Download,
  Calendar,
  Save,
  Lock,
  MessageSquare,
} from 'lucide-react';
import { useSubscription } from '../../context/SubscriptionContext';
import { useAuth } from '../../context/AuthContext';
import { PaymentRecord, Subscription, PaymentStatus, PaymentMethodName, SubscriptionPricingConfig } from '../../types/subscription';
import { Grade } from '../../types';
import { subscriptionService, SUPER_ADMIN_EMAIL } from '../../services/subscriptionService';

export const AdminPaymentDashboardSection: React.FC = () => {
  const { user, userProfile } = useAuth();
  const {
    pricingConfig,
    superAdminApprove,
    superAdminReject,
    superAdminSuspend,
    superAdminReactivate,
    superAdminUpdatePricing,
    isOwnerSuperAdmin,
  } = useSubscription();

  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'payments' | 'subscriptions' | 'pricing_config' | 'audit_logs'>('payments');

  // Filters
  const [statusFilter, setStatusFilter] = useState<'ALL' | PaymentStatus>('ALL');
  const [gradeFilter, setGradeFilter] = useState<'ALL' | Grade>('ALL');
  const [methodFilter, setMethodFilter] = useState<'ALL' | PaymentMethodName>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals & Action States
  const [selectedPaymentForProof, setSelectedPaymentForProof] = useState<PaymentRecord | null>(null);
  const [rejectingPayment, setRejectingPayment] = useState<PaymentRecord | null>(null);
  const [rejectionReasonInput, setRejectionReasonInput] = useState<string>('');
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  // Settings Form State
  const [pricingForm, setPricingForm] = useState<SubscriptionPricingConfig>(pricingConfig);
  const [isSavingPricing, setIsSavingPricing] = useState<boolean>(false);

  // Sync pricingForm when pricingConfig updates
  useEffect(() => {
    setPricingForm(pricingConfig);
  }, [pricingConfig]);

  // Load Real-Time Payments and Subscriptions
  useEffect(() => {
    const unsubPayments = subscriptionService.subscribeToAllPayments((records) => {
      setPayments(records);
      setLoading(false);
    });

    subscriptionService.getAllSubscriptions().then((subs) => {
      setSubscriptions(subs);
    });

    return () => unsubPayments();
  }, []);

  // Filtered Payments List
  const filteredPayments = useMemo(() => {
    return payments.filter((p) => {
      if (statusFilter !== 'ALL' && p.status !== statusFilter) return false;
      if (gradeFilter !== 'ALL' && p.grade !== gradeFilter) return false;
      if (methodFilter !== 'ALL' && p.paymentMethod !== methodFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = p.studentName?.toLowerCase().includes(q);
        const matchesRef = p.transactionReference?.toLowerCase().includes(q);
        const matchesEmail = p.studentEmail?.toLowerCase().includes(q);
        if (!matchesName && !matchesRef && !matchesEmail) return false;
      }
      return true;
    });
  }, [payments, statusFilter, gradeFilter, methodFilter, searchQuery]);

  // Financial & Subscriber Metrics
  const metrics = useMemo(() => {
    const approvedPayments = payments.filter((p) => p.status === 'APPROVED');
    const totalRevenueETB = approvedPayments.reduce((sum, p) => sum + (p.amountETB || 0), 0);

    const pendingPayments = payments.filter((p) => p.status === 'PENDING');
    const pendingAmountETB = pendingPayments.reduce((sum, p) => sum + (p.amountETB || 0), 0);

    const activeSubs = subscriptions.filter(
      (s) => s.status === 'ACTIVE' && new Date(s.expiryDate).getTime() >= Date.now()
    );

    const gradeBreakdown = {
      g9: subscriptions.filter((s) => s.grade === 9 && s.status === 'ACTIVE').length,
      g10: subscriptions.filter((s) => s.grade === 10 && s.status === 'ACTIVE').length,
      g11: subscriptions.filter((s) => s.grade === 11 && s.status === 'ACTIVE').length,
      g12: subscriptions.filter((s) => s.grade === 12 && s.status === 'ACTIVE').length,
    };

    return {
      totalRevenueETB,
      approvedCount: approvedPayments.length,
      pendingCount: pendingPayments.length,
      pendingAmountETB,
      activeSubsCount: activeSubs.length,
      gradeBreakdown,
    };
  }, [payments, subscriptions]);

  // Handle Approve
  const handleApprove = async (payment: PaymentRecord) => {
    setProcessingId(payment.paymentId);
    setActionSuccessMsg(null);
    try {
      await superAdminApprove(
        payment.paymentId,
        payment.userId,
        payment.grade,
        payment.amountETB
      );
      setActionSuccessMsg(`ክፍያ ${payment.transactionReference} በተሳካ ሁኔታ ጸድቋል!`);
      // refresh subscriptions
      const subs = await subscriptionService.getAllSubscriptions();
      setSubscriptions(subs);
    } catch (err: any) {
      alert(`Approval error: ${err.message}`);
    } finally {
      setProcessingId(null);
    }
  };

  // Handle Reject Submit
  const handleRejectConfirm = async () => {
    if (!rejectingPayment) return;
    if (!rejectionReasonInput.trim()) {
      alert('እባክዎ የውድቅ ማድረጊያ ምክንያት ያስገቡ (Please enter reason)');
      return;
    }

    setProcessingId(rejectingPayment.paymentId);
    setActionSuccessMsg(null);
    try {
      await superAdminReject(
        rejectingPayment.paymentId,
        rejectingPayment.userId,
        rejectionReasonInput.trim()
      );
      setActionSuccessMsg(`ክፍያ ${rejectingPayment.transactionReference} ውድቅ ተደርጓል`);
      setRejectingPayment(null);
      setRejectionReasonInput('');
      const subs = await subscriptionService.getAllSubscriptions();
      setSubscriptions(subs);
    } catch (err: any) {
      alert(`Rejection error: ${err.message}`);
    } finally {
      setProcessingId(null);
    }
  };

  // Handle Save Pricing Config
  const handleSavePricing = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingPricing(true);
    try {
      await superAdminUpdatePricing(pricingForm);
      setActionSuccessMsg('የዋጋና የክፍያ ቅንብሮች በተሳካ ሁኔታ ተሻሽለዋል!');
    } catch (err: any) {
      alert(`Pricing update error: ${err.message}`);
    } finally {
      setIsSavingPricing(false);
    }
  };

  // Super Admin Authorization Gate
  if (!isOwnerSuperAdmin) {
    return (
      <div className="p-8 bg-rose-50 border-2 border-rose-300 rounded-2xl text-center max-w-xl mx-auto my-8 space-y-4">
        <Lock className="w-12 h-12 text-rose-600 mx-auto" />
        <h3 className="text-lg font-bold font-serif-ethiopic text-rose-900">
          ይህ ክፍል ለዋናው ሲስተም ባለቤት SUPER_ADMIN ብቻ የተፈቀደ ነው
        </h3>
        <p className="text-xs text-rose-700 leading-relaxed font-serif-ethiopic">
          የተማሪዎችን ክፍያ ማረጋገጥ፣ ዋጋ መለወጥና የገንዘብ ዝውውር መቆጣጠር የሚቻለው በተፈቀደለት የባለቤት አካውንት ({SUPER_ADMIN_EMAIL}) ብቻ ነው።
        </p>
      </div>
    );
  }

  return (
    <div id="admin-payments-dashboard" className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-stone-900 text-white p-5 rounded-2xl shadow-sm border border-stone-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-stone-900 flex items-center justify-center font-bold shadow-xs">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold font-serif-ethiopic">
                የክፍያዎችና ሳብስክሪፕሽን ቁጥጥር (SUPER_ADMIN)
              </h2>
              <span className="px-2 py-0.5 bg-amber-400 text-stone-900 text-[10px] font-black rounded uppercase">
                PART 14
              </span>
            </div>
            <p className="text-xs text-stone-400">
              የ 9-12ኛ ክፍል ተማሪዎች ወርሃዊ ክፍያዎች ማረጋገጫ፣ የዋጋ ቅንብር እና የገቢ ሪፖርት
            </p>
          </div>
        </div>

        {/* Action success alert */}
        {actionSuccessMsg && (
          <div className="px-3.5 py-1.5 bg-emerald-500/20 border border-emerald-500 text-emerald-300 text-xs rounded-lg font-bold animate-in fade-in">
            {actionSuccessMsg}
          </div>
        )}
      </div>

      {/* Revenue & Subscriber KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Metric 1: Total Revenue */}
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between text-stone-500 text-xs">
            <span className="font-semibold">አጠቃላይ ገቢ (Total Revenue)</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-2xl font-black text-stone-900">
            {metrics.totalRevenueETB.toLocaleString()} <span className="text-xs font-bold text-stone-500">ETB</span>
          </div>
          <div className="mt-1 text-[11px] text-emerald-700 font-semibold">
            {metrics.approvedCount} የተረጋገጡ ክፍያዎች
          </div>
        </div>

        {/* Metric 2: Pending Verification */}
        <div className="bg-white p-4 rounded-xl border border-amber-300 bg-amber-50/40 shadow-2xs">
          <div className="flex items-center justify-between text-amber-900 text-xs">
            <span className="font-bold">በማረጋገጥ ላይ (Pending)</span>
            <Clock className="w-4 h-4 text-amber-600 animate-pulse" />
          </div>
          <div className="mt-2 text-2xl font-black text-amber-900">
            {metrics.pendingCount}{' '}
            <span className="text-xs font-bold text-amber-700">({metrics.pendingAmountETB} ETB)</span>
          </div>
          <div className="mt-1 text-[11px] text-amber-800">የአስተዳዳሪ ውሳኔ የሚጠብቁ</div>
        </div>

        {/* Metric 3: Active Subscribers */}
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between text-stone-500 text-xs">
            <span className="font-semibold">ንቁ ተመዝጋቢዎች (Active Subs)</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-2 text-2xl font-black text-stone-900">
            {metrics.activeSubsCount}{' '}
            <span className="text-xs font-bold text-stone-500">ተማሪዎች</span>
          </div>
          <div className="mt-1 text-[11px] text-stone-500">ትምህርታቸውን እየተከታተሉ ያሉ</div>
        </div>

        {/* Metric 4: Grade Breakdown */}
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between text-stone-500 text-xs mb-1.5">
            <span className="font-semibold">የክፍሎች ተሳትፎ (Grades)</span>
            <TrendingUp className="w-4 h-4 text-purple-600" />
          </div>
          <div className="grid grid-cols-4 gap-1 text-center text-xs">
            <div className="bg-stone-100 p-1 rounded">
              <span className="text-[10px] text-stone-500 block">9ኛ</span>
              <span className="font-bold text-stone-800">{metrics.gradeBreakdown.g9}</span>
            </div>
            <div className="bg-stone-100 p-1 rounded">
              <span className="text-[10px] text-stone-500 block">10ኛ</span>
              <span className="font-bold text-stone-800">{metrics.gradeBreakdown.g10}</span>
            </div>
            <div className="bg-stone-100 p-1 rounded">
              <span className="text-[10px] text-stone-500 block">11ኛ</span>
              <span className="font-bold text-stone-800">{metrics.gradeBreakdown.g11}</span>
            </div>
            <div className="bg-stone-100 p-1 rounded">
              <span className="text-[10px] text-stone-500 block">12ኛ</span>
              <span className="font-bold text-stone-800">{metrics.gradeBreakdown.g12}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Tab Navigation Bar */}
      <div className="flex border-b border-stone-200 bg-stone-100 p-1 rounded-xl">
        <button
          onClick={() => setActiveTab('payments')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            activeTab === 'payments'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          የክፍያ ማረጋገጫዎች ({payments.length})
        </button>
        <button
          onClick={() => setActiveTab('subscriptions')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            activeTab === 'subscriptions'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          የተማሪዎች ሳብስክሪፕሽን ({subscriptions.length})
        </button>
        <button
          onClick={() => setActiveTab('pricing_config')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'pricing_config'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Settings className="w-3.5 h-3.5" />
          <span>የዋጋና ባንክ ቅንብሮች</span>
        </button>
      </div>

      {/* TAB 1: PAYMENTS LIST & VERIFICATION */}
      {activeTab === 'payments' && (
        <div className="space-y-4">
          {/* Filters Row */}
          <div className="bg-white p-3.5 rounded-xl border border-stone-200 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[280px]">
              {/* Search */}
              <div className="relative flex-1 min-w-[180px]">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  placeholder="በተማሪ ስም ወይም በማመሳከሪያ ቁጥር ፈልግ..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-stone-50 border border-stone-300 rounded-lg text-xs focus:outline-none focus:border-stone-500"
                />
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-2.5 py-1.5 bg-stone-50 border border-stone-300 rounded-lg font-semibold"
              >
                <option value="ALL">ሁሉም ሁኔታ (All Status)</option>
                <option value="PENDING">በማረጋገጥ ላይ (Pending)</option>
                <option value="APPROVED">የጸደቁ (Approved)</option>
                <option value="REJECTED">ውድቅ የተደረጉ (Rejected)</option>
              </select>

              {/* Grade Filter */}
              <select
                value={gradeFilter}
                onChange={(e) =>
                  setGradeFilter(e.target.value === 'ALL' ? 'ALL' : (Number(e.target.value) as Grade))
                }
                className="px-2.5 py-1.5 bg-stone-50 border border-stone-300 rounded-lg font-semibold"
              >
                <option value="ALL">ሁሉም ክፍሎች (All Grades)</option>
                <option value="9">ክፍል 9</option>
                <option value="10">ክፍል 10</option>
                <option value="11">ክፍል 11</option>
                <option value="12">ክፍል 12</option>
              </select>

              {/* Method Filter */}
              <select
                value={methodFilter}
                onChange={(e) => setMethodFilter(e.target.value as any)}
                className="px-2.5 py-1.5 bg-stone-50 border border-stone-300 rounded-lg font-semibold"
              >
                <option value="ALL">ሁሉም የመክፈያ መንገዶች</option>
                <option value="Telebirr">Telebirr</option>
                <option value="Commercial Bank of Ethiopia (CBE)">CBE</option>
                <option value="Dashen Bank">Dashen Bank</option>
                <option value="Bank of Abyssinia">Bank of Abyssinia</option>
              </select>
            </div>

            <div className="text-stone-500 font-semibold">
              የተገኙት፡ <span className="text-stone-900 font-bold">{filteredPayments.length}</span>
            </div>
          </div>

          {/* Payments Table */}
          <div className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-stone-200 bg-stone-50 text-stone-600 font-bold">
                    <th className="p-3">ቀንና ሰዓት</th>
                    <th className="p-3">ተማሪ</th>
                    <th className="p-3">ክፍል</th>
                    <th className="p-3">መጠን</th>
                    <th className="p-3">መንገድ</th>
                    <th className="p-3">ማመሳከሪያ (Ref ID)</th>
                    <th className="p-3">ደረሰኝ (Proof)</th>
                    <th className="p-3">ሁኔታ</th>
                    <th className="p-3 text-right">ውሳኔ / Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredPayments.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="p-8 text-center text-stone-500 font-serif-ethiopic">
                        ምንም አይነት የክፍያ መረጃ አልተገኘም (No payments found)
                      </td>
                    </tr>
                  ) : (
                    filteredPayments.map((payment) => {
                      const isProcessing = processingId === payment.paymentId;

                      return (
                        <tr
                          key={payment.paymentId}
                          className="hover:bg-stone-50/80 transition-colors"
                        >
                          <td className="p-3 text-stone-500 whitespace-nowrap">
                            {new Date(payment.submittedAt).toLocaleDateString('am-ET')}{' '}
                            <span className="text-[10px] block">
                              {new Date(payment.submittedAt).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </td>
                          <td className="p-3">
                            <div className="font-bold text-stone-900 font-serif-ethiopic">
                              {payment.studentName}
                            </div>
                            <div className="text-[10px] text-stone-500 truncate max-w-[140px]">
                              {payment.studentEmail || payment.userId}
                            </div>
                          </td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 bg-stone-100 border border-stone-200 rounded font-bold text-stone-800">
                              ክፍል {payment.grade}
                            </span>
                          </td>
                          <td className="p-3">
                            <span className="font-mono font-extrabold text-[#2E6B4A]">
                              {payment.amountETB} ETB
                            </span>
                          </td>
                          <td className="p-3 text-stone-700 font-medium">
                            {payment.paymentMethod}
                          </td>
                          <td className="p-3">
                            <span className="font-mono font-bold bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded text-[11px]">
                              {payment.transactionReference}
                            </span>
                          </td>
                          <td className="p-3">
                            {payment.proofImageUrl ? (
                              <button
                                type="button"
                                onClick={() => setSelectedPaymentForProof(payment)}
                                className="inline-flex items-center gap-1 px-2 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded border border-stone-300 font-semibold cursor-pointer"
                              >
                                <Eye className="w-3.5 h-3.5 text-stone-600" />
                                <span>እይ</span>
                              </button>
                            ) : (
                              <span className="text-[10px] text-stone-400">የለም</span>
                            )}
                          </td>
                          <td className="p-3 whitespace-nowrap">
                            {payment.status === 'APPROVED' && (
                              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded text-[11px] border border-emerald-300 flex items-center gap-1 w-fit">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                <span>የጸደቀ</span>
                              </span>
                            )}
                            {payment.status === 'PENDING' && (
                              <span className="px-2 py-0.5 bg-amber-100 text-amber-800 font-bold rounded text-[11px] border border-amber-300 flex items-center gap-1 w-fit">
                                <Clock className="w-3 h-3 text-amber-600 animate-spin" />
                                <span>በማረጋገጥ ላይ</span>
                              </span>
                            )}
                            {payment.status === 'REJECTED' && (
                              <span className="px-2 py-0.5 bg-rose-100 text-rose-800 font-bold rounded text-[11px] border border-rose-300 flex items-center gap-1 w-fit">
                                <XCircle className="w-3 h-3 text-rose-600" />
                                <span>ውድቅ የተደረገ</span>
                              </span>
                            )}
                          </td>
                          <td className="p-3 text-right whitespace-nowrap">
                            {payment.status === 'PENDING' ? (
                              <div className="inline-flex items-center gap-1.5">
                                <button
                                  type="button"
                                  disabled={isProcessing}
                                  onClick={() => handleApprove(payment)}
                                  className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded font-bold text-xs flex items-center gap-1 transition-all cursor-pointer shadow-2xs"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>አጽድቅ</span>
                                </button>
                                <button
                                  type="button"
                                  disabled={isProcessing}
                                  onClick={() => {
                                    setRejectingPayment(payment);
                                    setRejectionReasonInput('');
                                  }}
                                  className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded font-bold text-xs flex items-center gap-1 transition-all cursor-pointer"
                                >
                                  <XCircle className="w-3.5 h-3.5" />
                                  <span>ውድቅ</span>
                                </button>
                              </div>
                            ) : (
                              <div className="text-[11px] text-stone-500">
                                {payment.verifiedAt && (
                                  <span>
                                    {new Date(payment.verifiedAt).toLocaleDateString('am-ET')}
                                  </span>
                                )}
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SUBSCRIPTIONS OVERVIEW */}
      {activeTab === 'subscriptions' && (
        <div className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-2xs">
          <div className="p-4 border-b border-stone-200 flex items-center justify-between">
            <h3 className="text-sm font-bold text-stone-900 font-serif-ethiopic">
              የተማሪዎች ሳብስክሪፕሽን ሁኔታ (Student Subscriptions)
            </h3>
            <span className="text-xs text-stone-500 font-semibold">
              ድምር፡ {subscriptions.length}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-50 text-stone-600 font-bold">
                  <th className="p-3">ተማሪ (Student)</th>
                  <th className="p-3">ክፍል (Grade)</th>
                  <th className="p-3">ዕቅድ (Plan)</th>
                  <th className="p-3">የጀመረበት ቀን</th>
                  <th className="p-3">የሚያበቃበት ቀን</th>
                  <th className="p-3">ሁኔታ (Status)</th>
                  <th className="p-3 text-right">እርምጃዎች</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {subscriptions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-stone-500">
                      ምንም አይነት ሳብስክሪፕሽን አልተመዘገበም
                    </td>
                  </tr>
                ) : (
                  subscriptions.map((sub) => {
                    const isExpired = new Date(sub.expiryDate).getTime() < Date.now();
                    const isSuspended = sub.status === 'SUSPENDED';

                    return (
                      <tr key={sub.id} className="hover:bg-stone-50">
                        <td className="p-3">
                          <div className="font-bold text-stone-900 font-serif-ethiopic">
                            {sub.studentName || 'Student'}
                          </div>
                          <div className="text-[10px] text-stone-500 font-mono">{sub.userId}</div>
                        </td>
                        <td className="p-3 font-bold">ክፍል {sub.grade}</td>
                        <td className="p-3 text-stone-700">{sub.planName}</td>
                        <td className="p-3 text-stone-600">
                          {new Date(sub.startDate).toLocaleDateString('am-ET')}
                        </td>
                        <td className="p-3 text-stone-600">
                          {new Date(sub.expiryDate).toLocaleDateString('am-ET')}
                        </td>
                        <td className="p-3">
                          {sub.status === 'ACTIVE' && !isExpired && (
                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded text-[11px]">
                              ACTIVE
                            </span>
                          )}
                          {isExpired && sub.status === 'ACTIVE' && (
                            <span className="px-2 py-0.5 bg-amber-100 text-amber-800 font-bold rounded text-[11px]">
                              EXPIRED
                            </span>
                          )}
                          {sub.status === 'PENDING' && (
                            <span className="px-2 py-0.5 bg-amber-100 text-amber-800 font-bold rounded text-[11px]">
                              PENDING
                            </span>
                          )}
                          {sub.status === 'SUSPENDED' && (
                            <span className="px-2 py-0.5 bg-rose-100 text-rose-800 font-bold rounded text-[11px]">
                              SUSPENDED
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-right whitespace-nowrap">
                          {isSuspended ? (
                            <button
                              type="button"
                              onClick={() => superAdminReactivate(sub.userId)}
                              className="px-2.5 py-1 bg-emerald-600 text-white rounded text-xs font-bold hover:bg-emerald-700 cursor-pointer"
                            >
                              እገዳ አንሳ (Reactivate)
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                const reason = prompt('የእገዳ ምክንያት ያስገቡ (Suspension reason):');
                                if (reason) superAdminSuspend(sub.userId, reason);
                              }}
                              className="px-2.5 py-1 bg-stone-200 text-stone-800 rounded text-xs font-semibold hover:bg-rose-100 hover:text-rose-800 cursor-pointer"
                            >
                              ዕገድ (Suspend)
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: PRICING & PAYMENT CONFIGURATION */}
      {activeTab === 'pricing_config' && (
        <form onSubmit={handleSavePricing} className="space-y-6">
          {/* Monthly Prices by Grade */}
          <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-stone-900 font-serif-ethiopic flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              <span>የክፍሎች ወርሃዊ የዋጋ ተመን (Monthly Prices in ETB)</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1 font-serif-ethiopic">
                  ክፍል 9 (Grade 9 ETB):
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  value={pricingForm.grade9Price}
                  onChange={(e) =>
                    setPricingForm({ ...pricingForm, grade9Price: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1 font-serif-ethiopic">
                  ክፍል 10 (Grade 10 ETB):
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  value={pricingForm.grade10Price}
                  onChange={(e) =>
                    setPricingForm({ ...pricingForm, grade10Price: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1 font-serif-ethiopic">
                  ክፍል 11 (Grade 11 ETB):
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  value={pricingForm.grade11Price}
                  onChange={(e) =>
                    setPricingForm({ ...pricingForm, grade11Price: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1 font-serif-ethiopic">
                  ክፍል 12 (Grade 12 ETB):
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  value={pricingForm.grade12Price}
                  onChange={(e) =>
                    setPricingForm({ ...pricingForm, grade12Price: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-stone-100">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1 font-serif-ethiopic">
                  የሳብስክሪፕሽን ቆይታ በቀናት (Duration Days):
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  value={pricingForm.subscriptionDurationDays}
                  onChange={(e) =>
                    setPricingForm({
                      ...pricingForm,
                      subscriptionDurationDays: Number(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1 font-serif-ethiopic">
                  የማደሻ ማሳሰቢያ የሚላክበት የቀን ብዛት (Renewal Reminder Days):
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  value={pricingForm.renewalReminderDays}
                  onChange={(e) =>
                    setPricingForm({
                      ...pricingForm,
                      renewalReminderDays: Number(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Details (Telebirr, CBE, Dashen, Abyssinia) */}
          <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-stone-900 font-serif-ethiopic flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-blue-600" />
              <span>የባንኮችና የመክፈያ መንገዶች ዝርዝር መረጃዎች (Payment Methods Config)</span>
            </h3>

            {(
              [
                'Telebirr',
                'Commercial Bank of Ethiopia (CBE)',
                'Dashen Bank',
                'Bank of Abyssinia',
              ] as PaymentMethodName[]
            ).map((mKey) => {
              const mCfg = pricingForm.methods[mKey];
              if (!mCfg) return null;

              return (
                <div
                  key={mKey}
                  className="p-4 border border-stone-200 rounded-xl bg-stone-50/50 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-stone-900 font-serif-ethiopic">
                      {mCfg.displayName}
                    </span>
                    <label className="inline-flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={mCfg.isEnabled}
                        onChange={(e) => {
                          const updated = { ...pricingForm.methods };
                          updated[mKey].isEnabled = e.target.checked;
                          setPricingForm({ ...pricingForm, methods: updated });
                        }}
                        className="rounded text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="text-xs font-semibold text-stone-700">ይህ መንገድ ይሰራ</span>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block text-stone-600 font-semibold mb-1">
                        የሂሳብ ስም (Account Holder Name):
                      </label>
                      <input
                        type="text"
                        value={mCfg.accountName}
                        onChange={(e) => {
                          const updated = { ...pricingForm.methods };
                          updated[mKey].accountName = e.target.value;
                          setPricingForm({ ...pricingForm, methods: updated });
                        }}
                        className="w-full px-3 py-1.5 bg-white border border-stone-300 rounded"
                      />
                    </div>

                    <div>
                      <label className="block text-stone-600 font-semibold mb-1">
                        የሂሳብ / ስልክ ቁጥር (Account/Phone Number):
                      </label>
                      <input
                        type="text"
                        value={mCfg.accountNumber}
                        onChange={(e) => {
                          const updated = { ...pricingForm.methods };
                          updated[mKey].accountNumber = e.target.value;
                          setPricingForm({ ...pricingForm, methods: updated });
                        }}
                        className="w-full px-3 py-1.5 bg-white border border-stone-300 rounded font-mono"
                      />
                    </div>
                  </div>

                  {mKey === 'Telebirr' && (
                    <div className="text-xs">
                      <label className="block text-stone-600 font-semibold mb-1">
                        የነጋዴ / Till Shortcode (ካለ):
                      </label>
                      <input
                        type="text"
                        value={mCfg.shortCodeOrTill || ''}
                        onChange={(e) => {
                          const updated = { ...pricingForm.methods };
                          updated[mKey].shortCodeOrTill = e.target.value;
                          setPricingForm({ ...pricingForm, methods: updated });
                        }}
                        className="w-full px-3 py-1.5 bg-white border border-stone-300 rounded"
                      />
                    </div>
                  )}

                  <div className="text-xs">
                    <label className="block text-stone-600 font-semibold mb-1">
                      ለተማሪው የሚታይ መመሪያ (Instructions in Amharic):
                    </label>
                    <textarea
                      rows={2}
                      value={mCfg.instructionsAm}
                      onChange={(e) => {
                        const updated = { ...pricingForm.methods };
                        updated[mKey].instructionsAm = e.target.value;
                        setPricingForm({ ...pricingForm, methods: updated });
                      }}
                      className="w-full px-3 py-1.5 bg-white border border-stone-300 rounded"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSavingPricing}
              className="px-6 py-2.5 bg-[#2E6B4A] hover:bg-[#235338] text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{isSavingPricing ? 'በማስቀመጥ ላይ...' : 'ቅንብሮችን አስቀምጥ (Save Configuration)'}</span>
            </button>
          </div>
        </form>
      )}

      {/* MODAL 1: VIEW PROOF IMAGE */}
      {selectedPaymentForProof && (
        <div
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-xs"
          onClick={() => setSelectedPaymentForProof(null)}
        >
          <div
            className="bg-white max-w-lg w-full rounded-2xl overflow-hidden shadow-2xl p-5 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-stone-200 pb-2">
              <h4 className="font-bold text-sm text-stone-900 font-serif-ethiopic">
                የክፍያ ደረሰኝ ምስል (Payment Proof)
              </h4>
              <button
                type="button"
                onClick={() => setSelectedPaymentForProof(null)}
                className="text-stone-400 hover:text-stone-700 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="max-h-[65vh] overflow-y-auto flex items-center justify-center bg-stone-100 rounded-xl p-2">
              <img
                src={selectedPaymentForProof.proofImageUrl}
                alt="Receipt Proof"
                className="max-w-full max-h-[55vh] object-contain rounded"
              />
            </div>

            <div className="text-xs text-stone-600 space-y-1">
              <div>
                <strong>ተማሪ፡</strong> {selectedPaymentForProof.studentName} (ክፍል {selectedPaymentForProof.grade})
              </div>
              <div>
                <strong>ማመሳከሪያ፡</strong> {selectedPaymentForProof.transactionReference}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: REJECT CONFIRMATION WITH REASON */}
      {rejectingPayment && (
        <div
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-xs"
          onClick={() => setRejectingPayment(null)}
        >
          <div
            className="bg-white max-w-md w-full rounded-2xl overflow-hidden shadow-2xl p-5 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 text-rose-600">
              <XCircle className="w-5 h-5" />
              <h4 className="font-bold text-sm font-serif-ethiopic">
                ክፍያ ውድቅ ማድረጊያ (Reject Payment)
              </h4>
            </div>

            <p className="text-xs text-stone-600">
              ለተማሪ <strong>{rejectingPayment.studentName}</strong> የላኩትን ክፍያ ውድቅ ማድረግ
              የፈለጉበትን ምክንያት ያስገቡ። ምክንያቱ ለተማሪው ወዲያውኑ በማሳወቂያ ይደርሳል።
            </p>

            <textarea
              rows={3}
              required
              placeholder="ለምሳሌ፡ ያስገቡት የባንክ ማመሳከሪያ ቁጥር በባንካችን አልተገኘም ወይም መጠኑ አይዛመድም።"
              value={rejectionReasonInput}
              onChange={(e) => setRejectionReasonInput(e.target.value)}
              className="w-full p-2.5 border border-stone-300 rounded-lg text-xs focus:outline-none focus:border-rose-500"
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRejectingPayment(null)}
                className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-lg cursor-pointer"
              >
                ተመለስ
              </button>
              <button
                type="button"
                onClick={handleRejectConfirm}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg cursor-pointer shadow-xs"
              >
                ውድቅ አድርግ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
