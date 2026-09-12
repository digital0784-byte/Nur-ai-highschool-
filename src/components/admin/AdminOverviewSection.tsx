import React, { useState, useEffect, useMemo } from 'react';
import {
  Users,
  CreditCard,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  Calendar,
  DollarSign,
  AlertTriangle,
  ArrowUpRight,
  ShieldCheck,
  Brain,
  BookOpen,
  Award,
  Layers,
  GraduationCap,
  Sparkles,
  BarChart3,
  ChevronRight,
  RefreshCw,
} from 'lucide-react';
import { AdminDashboardStats, AdminActiveSubTab } from '../../types/adminDashboard';
import { subscriptionService } from '../../services/subscriptionService';
import { adminFirestoreService } from '../../services/adminFirestore';
import { PaymentRecord, Subscription } from '../../types/subscription';
import { UserProfile, Grade } from '../../types';

interface AdminOverviewSectionProps {
  stats: AdminDashboardStats;
  onNavigateTab: (tab: AdminActiveSubTab) => void;
}

export const AdminOverviewSection: React.FC<AdminOverviewSectionProps> = ({
  stats,
  onNavigateTab,
}) => {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [students, setStudents] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubPay = subscriptionService.subscribeToAllPayments((records) => {
      setPayments(records);
    });

    const unsubSub = subscriptionService.subscribeToAllSubscriptions((subs) => {
      setSubscriptions(subs);
    });

    adminFirestoreService.getStudents().then((stus) => {
      setStudents(stus);
      setLoading(false);
    }).catch(() => setLoading(false));

    return () => {
      unsubPay();
      unsubSub();
    };
  }, []);

  // Approved payments only for revenue calculation
  const approvedPayments = useMemo(() => {
    return payments.filter((p) => p.status === 'APPROVED');
  }, [payments]);

  const pendingPayments = useMemo(() => {
    return payments.filter((p) => p.status === 'PENDING');
  }, [payments]);

  const rejectedPayments = useMemo(() => {
    return payments.filter((p) => p.status === 'REJECTED');
  }, [payments]);

  const now = Date.now();
  const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).getTime();

  // Active subscribers: status === 'ACTIVE' and not expired
  const activeSubs = useMemo(() => {
    return subscriptions.filter(
      (s) => s.status === 'ACTIVE' && new Date(s.expiryDate).getTime() >= now
    );
  }, [subscriptions, now]);

  // Expired subscribers: status === 'EXPIRED' or expiryDate < now
  const expiredSubs = useMemo(() => {
    return subscriptions.filter(
      (s) => s.status === 'EXPIRED' || (s.status === 'ACTIVE' && new Date(s.expiryDate).getTime() < now)
    );
  }, [subscriptions, now]);

  // Monthly Revenue (Approved payments in current month)
  const monthlyRevenue = useMemo(() => {
    return approvedPayments
      .filter((p) => new Date(p.submittedAt).getTime() >= startOfMonth)
      .reduce((sum, p) => sum + (p.amountETB || 0), 0);
  }, [approvedPayments, startOfMonth]);

  // Total Revenue (All approved payments)
  const totalRevenue = useMemo(() => {
    return approvedPayments.reduce((sum, p) => sum + (p.amountETB || 0), 0);
  }, [approvedPayments]);

  // Students by Grade
  const studentsByGrade = useMemo(() => {
    const counts: Record<Grade, number> = { 9: 0, 10: 0, 11: 0, 12: 0 };
    students.forEach((s) => {
      const g = (s.grade || 9) as Grade;
      if (counts[g] !== undefined) counts[g] += 1;
    });
    return counts;
  }, [students]);

  // Active Subscriptions by Grade
  const activeSubsByGrade = useMemo(() => {
    const counts: Record<Grade, number> = { 9: 0, 10: 0, 11: 0, 12: 0 };
    activeSubs.forEach((s) => {
      const g = (s.grade || 9) as Grade;
      if (counts[g] !== undefined) counts[g] += 1;
    });
    return counts;
  }, [activeSubs]);

  // Recent Payments (top 5 sorted by submittedAt desc)
  const recentPayments = useMemo(() => {
    return [...payments]
      .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
      .slice(0, 5);
  }, [payments]);

  // Recent Registrations (top 5 sorted by createdAt desc)
  const recentRegistrations = useMemo(() => {
    return [...students]
      .sort((a, b) => {
        const tA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const tB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return tB - tA;
      })
      .slice(0, 5);
  }, [students]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner / Greeting */}
      <div className="bg-gradient-to-r from-[#203a43] to-[#0f2027] text-white p-6 rounded-2xl shadow-md border border-stone-700/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                NUR AI High School • 2017 E.C.
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                FDRE MoE Curriculum
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif-ethiopic tracking-tight">
              የትምህርት ቤት አስተዳደር እና የገቢ ቁጥጥር ዳሽቦርድ
            </h2>
            <p className="text-sm text-stone-300 mt-1 max-w-2xl font-serif-ethiopic">
              Grade 9–12 Ethiopian Curriculum management, student subscriptions, pending bank payment verifications, and MoE textbook mastery.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigateTab('payments_billing')}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-900 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer border border-amber-300/40"
            >
              <CreditCard className="w-4 h-4" />
              <span>ክፍያዎችን አረጋግጥ ({pendingPayments.length} Pending)</span>
            </button>
            <button
              onClick={() => onNavigateTab('revenue_analytics')}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer border border-emerald-400/40"
            >
              <TrendingUp className="w-4 h-4" />
              <span>የገቢ ትንታኔ (Revenue)</span>
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 1: REQUIRED OVERVIEW FINANCIAL & SUBSCRIPTION METRICS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-stone-800 uppercase tracking-wider flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-700" />
            <span>የተማሪዎችና የፋይናንስ ቁልፍ መረጃዎች (Key Financial & Enrollment Metrics)</span>
          </h3>
          <span className="text-xs text-stone-500 font-mono">Approved Payments Only for Revenue</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {/* 1. Total Registered Students */}
          <div
            onClick={() => onNavigateTab('students')}
            className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs hover:shadow-md transition-all cursor-pointer hover:border-emerald-500/50"
          >
            <div className="flex items-center justify-between text-stone-500 text-xs mb-1">
              <span className="font-bold">ጠቅላላ ተማሪዎች (Students)</span>
              <Users className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-stone-900">{students.length || stats.totalStudents}</div>
            <div className="text-[11px] text-emerald-700 font-medium mt-1">ክፍል 9 - 12</div>
          </div>

          {/* 2. Active Subscribers */}
          <div
            onClick={() => onNavigateTab('subscriptions')}
            className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs hover:shadow-md transition-all cursor-pointer hover:border-blue-500/50"
          >
            <div className="flex items-center justify-between text-stone-500 text-xs mb-1">
              <span className="font-bold">ንቁ ተመዝጋቢዎች (Active)</span>
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl font-black text-blue-900">{activeSubs.length}</div>
            <div className="text-[11px] text-stone-500 mt-1">ሙሉ ትምህርት ክፍት የሆናቸው</div>
          </div>

          {/* 3. Pending Payments */}
          <div
            onClick={() => onNavigateTab('payments_billing')}
            className="bg-white p-4 rounded-2xl border border-amber-300 bg-amber-50/40 shadow-2xs hover:shadow-md transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between text-amber-900 text-xs mb-1">
              <span className="font-bold">በማረጋገጥ ላይ (Pending)</span>
              <Clock className="w-4 h-4 text-amber-600 animate-pulse" />
            </div>
            <div className="text-2xl font-black text-amber-900">{pendingPayments.length}</div>
            <div className="text-[11px] text-amber-800 font-semibold mt-1">ውሳኔ የሚጠብቁ ክፍያዎች</div>
          </div>

          {/* 4. Expired Subscriptions */}
          <div
            onClick={() => onNavigateTab('subscriptions')}
            className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs hover:shadow-md transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between text-stone-500 text-xs mb-1">
              <span className="font-bold">ያለቀባቸው (Expired)</span>
              <AlertTriangle className="w-4 h-4 text-stone-500" />
            </div>
            <div className="text-2xl font-black text-stone-800">{expiredSubs.length}</div>
            <div className="text-[11px] text-stone-400 mt-1">እድሳት የሚሹ ተማሪዎች</div>
          </div>

          {/* 5. Rejected Payments */}
          <div
            onClick={() => onNavigateTab('payments_billing')}
            className="bg-white p-4 rounded-2xl border border-rose-200 bg-rose-50/30 shadow-2xs hover:shadow-md transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between text-rose-800 text-xs mb-1">
              <span className="font-bold">ውድቅ የተደረጉ (Rejected)</span>
              <XCircle className="w-4 h-4 text-rose-600" />
            </div>
            <div className="text-2xl font-black text-rose-900">{rejectedPayments.length}</div>
            <div className="text-[11px] text-rose-700 mt-1">የማይዛመዱ ማረጋገጫዎች</div>
          </div>
        </div>

        {/* Revenue Cards: Monthly Revenue & Total Revenue */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          {/* Monthly Revenue */}
          <div
            onClick={() => onNavigateTab('revenue_analytics')}
            className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs flex items-center justify-between cursor-pointer hover:border-emerald-500"
          >
            <div>
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block">
                የወሩ የተረጋገጠ ገቢ (Monthly Revenue)
              </span>
              <div className="text-2xl font-black text-stone-900 mt-1">
                {monthlyRevenue.toLocaleString()}{' '}
                <span className="text-xs font-bold text-stone-500">ETB</span>
              </div>
              <span className="text-[11px] text-emerald-700 font-medium">የዚህ ወር የገቡ ክፍያዎች ብቻ</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Calendar className="w-6 h-6" />
            </div>
          </div>

          {/* Total Revenue */}
          <div
            onClick={() => onNavigateTab('revenue_analytics')}
            className="bg-white p-4 rounded-2xl border-2 border-emerald-500 bg-emerald-50/20 shadow-2xs flex items-center justify-between cursor-pointer"
          >
            <div>
              <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider block">
                ጠቅላላ የተረጋገጠ ገቢ (Total Revenue)
              </span>
              <div className="text-2xl font-black text-emerald-950 mt-1">
                {totalRevenue.toLocaleString()}{' '}
                <span className="text-xs font-bold text-emerald-700">ETB</span>
              </div>
              <span className="text-[11px] text-emerald-800 font-bold">
                {approvedPayments.length} የተረጋገጡ (Approved) ክፍያዎች ድምር
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: GRADE BREAKDOWN (STUDENTS & ACTIVE SUBSCRIPTIONS BY GRADE) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Students by Grade */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-stone-900 font-serif-ethiopic flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-700" />
              <span>ተማሪዎች በክፍል ደረጃ (Students by Grade)</span>
            </h4>
            <span className="text-[11px] text-stone-500 font-mono">ጠቅላላ፡ {students.length} ተማሪዎች</span>
          </div>

          <div className="grid grid-cols-4 gap-2 pt-1">
            {([9, 10, 11, 12] as Grade[]).map((g) => (
              <div key={g} className="bg-stone-50 p-3 rounded-xl border border-stone-200 text-center">
                <span className="text-xs text-stone-500 font-bold block">Grade {g}</span>
                <span className="text-lg font-black text-stone-900">{studentsByGrade[g] || 0}</span>
                <span className="text-[10px] text-stone-400 block">ተማሪዎች</span>
              </div>
            ))}
          </div>
        </div>

        {/* Active Subscriptions by Grade */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-stone-900 font-serif-ethiopic flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-blue-700" />
              <span>ንቁ ሳብስክሪፕሽን በክፍል ደረጃ (Active Subscriptions by Grade)</span>
            </h4>
            <span className="text-[11px] text-blue-700 font-bold">ጠቅላላ፡ {activeSubs.length} ንቁ</span>
          </div>

          <div className="grid grid-cols-4 gap-2 pt-1">
            {([9, 10, 11, 12] as Grade[]).map((g) => {
              const activeCount = activeSubsByGrade[g] || 0;
              const totalGradeCount = studentsByGrade[g] || 1;
              const pct = Math.round((activeCount / Math.max(1, totalGradeCount)) * 100);
              return (
                <div key={g} className="bg-blue-50/50 p-3 rounded-xl border border-blue-200 text-center">
                  <span className="text-xs text-blue-950 font-bold block">Grade {g}</span>
                  <span className="text-lg font-black text-blue-900">{activeCount}</span>
                  <span className="text-[10px] text-blue-700 font-semibold block">{pct}% ንቁ</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* SECTION 3: RECENT PAYMENTS & RECENT REGISTRATIONS TABLES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Payments */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-stone-900 font-serif-ethiopic flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-600" />
              <span>የቅርብ ጊዜ ክፍያዎች (Recent Payments)</span>
            </h4>
            <button
              onClick={() => onNavigateTab('payments_billing')}
              className="text-xs text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-0.5 cursor-pointer"
            >
              <span>ሁሉንም እይ</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-stone-100">
            {recentPayments.length === 0 ? (
              <div className="py-6 text-center text-xs text-stone-400">ምንም ክፍያ አልተመዘገበም</div>
            ) : (
              recentPayments.map((p) => (
                <div key={p.paymentId} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-stone-900">{p.studentName || 'Student'}</div>
                    <div className="text-[10px] text-stone-400 font-mono">
                      {p.paymentMethod.toUpperCase()} • Ref: {p.transactionReference}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-stone-900">{p.amountETB} ETB</div>
                    <span
                      className={`inline-block px-2 py-0.2 rounded-full text-[10px] font-bold ${
                        p.status === 'APPROVED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : p.status === 'PENDING'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {p.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Registrations */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-stone-900 font-serif-ethiopic flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-700" />
              <span>የቅርብ ጊዜ ምዝገባዎች (Recent Registrations)</span>
            </h4>
            <button
              onClick={() => onNavigateTab('students')}
              className="text-xs text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-0.5 cursor-pointer"
            >
              <span>ሁሉንም እይ</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-stone-100">
            {recentRegistrations.length === 0 ? (
              <div className="py-6 text-center text-xs text-stone-400">ምንም ምዝገባ አልተገኘም</div>
            ) : (
              recentRegistrations.map((s) => (
                <div key={s.uid} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-stone-900">{s.displayName}</div>
                    <div className="text-[10px] text-stone-400">{s.email}</div>
                  </div>
                  <div className="text-right">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                      Grade {s.grade || 9}
                    </span>
                    <div className="text-[10px] text-stone-400 mt-0.5">
                      {s.createdAt ? new Date(s.createdAt).toLocaleDateString() : 'Active'}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
