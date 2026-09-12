import React, { useState, useEffect, useMemo } from 'react';
import {
  TrendingUp,
  DollarSign,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  PieChart,
  BarChart3,
  CreditCard,
  ShieldCheck,
  RefreshCw,
  ArrowUpRight,
  Filter,
} from 'lucide-react';
import { subscriptionService } from '../../services/subscriptionService';
import { PaymentRecord, PaymentMethodName } from '../../types/subscription';
import { Grade } from '../../types';

export const AdminRevenueAnalyticsSection: React.FC = () => {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [timeRange, setTimeRange] = useState<'all' | 'month' | 'week' | 'today'>('all');

  useEffect(() => {
    const unsub = subscriptionService.subscribeToAllPayments((records) => {
      setPayments(records);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // Strict calculation: ONLY APPROVED payments count as revenue!
  const approvedPayments = useMemo(() => {
    return payments.filter((p) => p.status === 'APPROVED');
  }, [payments]);

  const pendingPayments = useMemo(() => {
    return payments.filter((p) => p.status === 'PENDING');
  }, [payments]);

  const rejectedPayments = useMemo(() => {
    return payments.filter((p) => p.status === 'REJECTED');
  }, [payments]);

  // Date boundary calculations
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const sevenDaysAgo = now.getTime() - 7 * 24 * 60 * 60 * 1000;
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();

  const todayRevenue = useMemo(() => {
    return approvedPayments
      .filter((p) => new Date(p.submittedAt).getTime() >= startOfToday)
      .reduce((sum, p) => sum + (p.amountETB || 0), 0);
  }, [approvedPayments, startOfToday]);

  const weekRevenue = useMemo(() => {
    return approvedPayments
      .filter((p) => new Date(p.submittedAt).getTime() >= sevenDaysAgo)
      .reduce((sum, p) => sum + (p.amountETB || 0), 0);
  }, [approvedPayments, sevenDaysAgo]);

  const monthRevenue = useMemo(() => {
    return approvedPayments
      .filter((p) => new Date(p.submittedAt).getTime() >= startOfMonth)
      .reduce((sum, p) => sum + (p.amountETB || 0), 0);
  }, [approvedPayments, startOfMonth]);

  const totalRevenue = useMemo(() => {
    return approvedPayments.reduce((sum, p) => sum + (p.amountETB || 0), 0);
  }, [approvedPayments]);

  // Revenue by Grade (Approved payments only)
  const revenueByGrade = useMemo(() => {
    const counts: Record<Grade, { amount: number; count: number }> = {
      9: { amount: 0, count: 0 },
      10: { amount: 0, count: 0 },
      11: { amount: 0, count: 0 },
      12: { amount: 0, count: 0 },
    };

    approvedPayments.forEach((p) => {
      const g = (p.grade || 9) as Grade;
      if (counts[g]) {
        counts[g].amount += p.amountETB || 0;
        counts[g].count += 1;
      }
    });

    return counts;
  }, [approvedPayments]);

  // Revenue by Payment Method (Approved payments only)
  const revenueByMethod = useMemo(() => {
    const map: Record<PaymentMethodName, { amount: number; count: number }> = {
      telebirr: { amount: 0, count: 0 },
      cbe: { amount: 0, count: 0 },
      dashen: { amount: 0, count: 0 },
      boa: { amount: 0, count: 0 },
    };

    approvedPayments.forEach((p) => {
      const m = p.paymentMethod || 'telebirr';
      if (map[m]) {
        map[m].amount += p.amountETB || 0;
        map[m].count += 1;
      }
    });

    return map;
  }, [approvedPayments]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-3">
        <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin" />
        <p className="text-xs text-stone-500 font-serif-ethiopic">የገቢ መረጃዎች በመሰብሰብ ላይ ናቸው...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-stone-900 to-emerald-950 text-white p-6 rounded-2xl border border-stone-800 shadow-sm relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Revenue & Financial Intelligence
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                FDRE Currency (ETB)
              </span>
            </div>
            <h2 className="text-2xl font-black font-serif-ethiopic tracking-tight">
              የገቢ ትንታኔ እና የክፍያ ስታቲስቲክስ (Revenue Analytics)
            </h2>
            <p className="text-xs text-stone-300 mt-1 max-w-xl font-serif-ethiopic">
              ትክክለኛ የተረጋገጡ (APPROVED) ክፍያዎች ብቻ የተካተቱበት የገንዘብ ዝውውር መቆጣጠሪያ። በማረጋገጥ ላይ ያሉ እና ውድቅ የተደረጉ ክፍያዎች በገቢ ስሌት ውስጥ አልተካተቱም።
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="bg-stone-800/80 px-4 py-2 rounded-xl border border-stone-700 text-right">
              <span className="text-[10px] text-stone-400 uppercase font-bold block">የስሌት ህግ (Strict Rule)</span>
              <span className="text-xs font-bold text-emerald-400">Approved Payments Only</span>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Revenue Breakdown (Today, Week, Month, Total) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Today */}
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
            <span className="font-bold">የዛሬ ገቢ (Today)</span>
            <Clock className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-stone-900">
            {todayRevenue.toLocaleString()}{' '}
            <span className="text-xs font-bold text-stone-500">ETB</span>
          </div>
          <div className="text-[11px] text-stone-400 mt-1">ዛሬ የተረጋገጡ ክፍያዎች</div>
        </div>

        {/* This Week */}
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
            <span className="font-bold">የሳምንቱ ገቢ (This Week)</span>
            <TrendingUp className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-stone-900">
            {weekRevenue.toLocaleString()}{' '}
            <span className="text-xs font-bold text-stone-500">ETB</span>
          </div>
          <div className="text-[11px] text-stone-400 mt-1">ያለፉት 7 ቀናት</div>
        </div>

        {/* This Month */}
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
            <span className="font-bold">የወሩ ገቢ (This Month)</span>
            <Calendar className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-black text-stone-900">
            {monthRevenue.toLocaleString()}{' '}
            <span className="text-xs font-bold text-stone-500">ETB</span>
          </div>
          <div className="text-[11px] text-stone-400 mt-1">የዚህ ወር ጠቅላላ ገቢ</div>
        </div>

        {/* Total Revenue */}
        <div className="bg-white p-4 rounded-2xl border-2 border-emerald-500 bg-emerald-50/20 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-emerald-800 mb-1">
            <span className="font-bold">ጠቅላላ ገቢ (Total Revenue)</span>
            <DollarSign className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-2xl font-black text-emerald-900">
            {totalRevenue.toLocaleString()}{' '}
            <span className="text-xs font-bold text-emerald-700">ETB</span>
          </div>
          <div className="text-[11px] text-emerald-700 font-medium mt-1">
            ከ {approvedPayments.length} የተረጋገጡ ክፍያዎች
          </div>
        </div>
      </div>

      {/* Transaction Volumes / Status Counts */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Approved Count */}
        <div className="bg-white p-4 rounded-2xl border border-emerald-200 bg-emerald-50/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-emerald-900 uppercase">የጸደቁ ክፍያዎች (Approved)</div>
              <div className="text-xl font-black text-emerald-950">{approvedPayments.length} ክፍያዎች</div>
            </div>
          </div>
          <span className="text-xs font-bold text-emerald-700">{totalRevenue.toLocaleString()} ETB</span>
        </div>

        {/* Pending Count */}
        <div className="bg-white p-4 rounded-2xl border border-amber-200 bg-amber-50/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-amber-900 uppercase">በማረጋገጥ ላይ (Pending)</div>
              <div className="text-xl font-black text-amber-950">{pendingPayments.length} ክፍያዎች</div>
            </div>
          </div>
          <span className="text-xs font-bold text-amber-700">
            {pendingPayments.reduce((s, p) => s + (p.amountETB || 0), 0).toLocaleString()} ETB
          </span>
        </div>

        {/* Rejected Count */}
        <div className="bg-white p-4 rounded-2xl border border-rose-200 bg-rose-50/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
              <XCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-rose-900 uppercase">ውድቅ የተደረጉ (Rejected)</div>
              <div className="text-xl font-black text-rose-950">{rejectedPayments.length} ክፍያዎች</div>
            </div>
          </div>
          <span className="text-xs font-bold text-rose-700">ውድቅ</span>
        </div>
      </div>

      {/* Two Column Section: Revenue by Grade & Revenue by Payment Method */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue by Grade */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-stone-900 font-serif-ethiopic flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-emerald-700" />
                <span>ገቢ በክፍል ደረጃ (Revenue by Grade)</span>
              </h3>
              <p className="text-[11px] text-stone-500">
                የእያንዳንዱ ክፍል የተረጋገጠ የክፍያ ድርሻ (Approved Only)
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            {([9, 10, 11, 12] as Grade[]).map((g) => {
              const gradeData = revenueByGrade[g];
              const pct = totalRevenue > 0 ? Math.round((gradeData.amount / totalRevenue) * 100) : 0;
              return (
                <div key={g} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-stone-800">Grade {g} (ክፍል {g})</span>
                    <span className="font-mono text-stone-600">
                      {gradeData.amount.toLocaleString()} ETB ({gradeData.count} ተማሪዎች • {pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-2.5 rounded-full transition-all duration-500 ${
                        g === 9
                          ? 'bg-blue-500'
                          : g === 10
                          ? 'bg-emerald-500'
                          : g === 11
                          ? 'bg-amber-500'
                          : 'bg-purple-500'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Revenue by Payment Method */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-stone-900 font-serif-ethiopic flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-amber-600" />
                <span>ገቢ በክፍያ ዘዴ (Revenue by Payment Method)</span>
              </h3>
              <p className="text-[11px] text-stone-500">
                ተማሪዎች የተጠቀሙባቸው የባንክና የቴሌብር መንገዶች
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            {[
              { id: 'telebirr' as PaymentMethodName, name: 'Telebirr (ቴሌብር)', color: 'bg-teal-500' },
              { id: 'cbe' as PaymentMethodName, name: 'CBE (የኢትዮጵያ ንግድ ባንክ)', color: 'bg-purple-600' },
              { id: 'dashen' as PaymentMethodName, name: 'Dashen Bank (ዳሽን ባንክ)', color: 'bg-blue-600' },
              { id: 'boa' as PaymentMethodName, name: 'Bank of Abyssinia (አቢሲኒያ)', color: 'bg-amber-600' },
            ].map((m) => {
              const data = revenueByMethod[m.id];
              const pct = totalRevenue > 0 ? Math.round((data.amount / totalRevenue) * 100) : 0;
              return (
                <div key={m.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-stone-800">{m.name}</span>
                    <span className="font-mono text-stone-600">
                      {data.amount.toLocaleString()} ETB ({data.count} ክፍያዎች • {pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-2.5 rounded-full ${m.color} transition-all duration-500`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
