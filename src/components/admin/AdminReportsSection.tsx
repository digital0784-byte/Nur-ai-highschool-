import React, { useState, useEffect, useMemo } from 'react';
import {
  FileText,
  Download,
  Calendar,
  Filter,
  Users,
  CreditCard,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Lock,
  RefreshCw,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSubscription } from '../../context/SubscriptionContext';
import { subscriptionService, SUPER_ADMIN_EMAIL } from '../../services/subscriptionService';
import { adminFirestoreService } from '../../services/adminFirestore';
import { PaymentRecord, Subscription } from '../../types/subscription';
import { UserProfile, Grade } from '../../types';

type ReportType =
  | 'registrations'
  | 'active_subs'
  | 'expired_subs'
  | 'payments'
  | 'revenue'
  | 'grade_distribution'
  | 'payment_methods';

export const AdminReportsSection: React.FC = () => {
  const { user } = useAuth();
  const { isOwnerSuperAdmin } = useSubscription();

  const [selectedReport, setSelectedReport] = useState<ReportType>('payments');
  const [dateRange, setDateRange] = useState<'all' | '7d' | '30d' | 'this_year'>('all');
  const [loading, setLoading] = useState<boolean>(true);

  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [students, setStudents] = useState<UserProfile[]>([]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [subs, stus] = await Promise.all([
          subscriptionService.getAllSubscriptions(),
          adminFirestoreService.getStudents(),
        ]);
        setSubscriptions(subs);
        setStudents(stus);
      } catch (err) {
        console.warn('Error loading report source data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();

    const unsubPay = subscriptionService.subscribeToAllPayments((records) => {
      setPayments(records);
    });

    return () => unsubPay();
  }, []);

  // Filter items by selected date range
  const filterByDate = <T extends { submittedAt?: string; createdAt?: string; startDate?: string }>(
    items: T[],
    dateField: keyof T
  ): T[] => {
    if (dateRange === 'all') return items;
    const now = Date.now();
    let threshold = 0;
    if (dateRange === '7d') threshold = now - 7 * 24 * 60 * 60 * 1000;
    else if (dateRange === '30d') threshold = now - 30 * 24 * 60 * 60 * 1000;
    else if (dateRange === 'this_year') threshold = new Date(new Date().getFullYear(), 0, 1).getTime();

    return items.filter((item) => {
      const val = item[dateField];
      if (!val || typeof val !== 'string') return true;
      const t = new Date(val).getTime();
      return t >= threshold;
    });
  };

  // Pre-computed datasets
  const activeSubs = useMemo(() => {
    const filtered = subscriptions.filter(
      (s) => s.status === 'ACTIVE' && new Date(s.expiryDate).getTime() >= Date.now()
    );
    return filterByDate(filtered, 'startDate');
  }, [subscriptions, dateRange]);

  const expiredSubs = useMemo(() => {
    const filtered = subscriptions.filter(
      (s) => s.status === 'EXPIRED' || new Date(s.expiryDate).getTime() < Date.now()
    );
    return filterByDate(filtered, 'updatedAt' as any);
  }, [subscriptions, dateRange]);

  const filteredPayments = useMemo(() => {
    return filterByDate(payments, 'submittedAt');
  }, [payments, dateRange]);

  const filteredStudents = useMemo(() => {
    return filterByDate(students, 'createdAt');
  }, [students, dateRange]);

  // Export handlers (Restricted strictly to SUPER_ADMIN)
  const handleExportCSV = () => {
    if (!isOwnerSuperAdmin) {
      alert('Unauthorized. Only Super Admin can export financial reports.');
      return;
    }

    let csvContent = '';
    let filename = `nur_ai_${selectedReport}_${new Date().toISOString().slice(0, 10)}.csv`;

    switch (selectedReport) {
      case 'payments':
      case 'revenue': {
        const rows = (selectedReport === 'revenue' ? filteredPayments.filter((p) => p.status === 'APPROVED') : filteredPayments).map((p) => [
          p.paymentId,
          p.studentName || 'Student',
          p.grade || 9,
          p.amountETB,
          p.paymentMethod,
          p.transactionReference,
          p.status,
          p.submittedAt,
        ]);
        csvContent = ['PaymentID,StudentName,Grade,AmountETB,Method,Reference,Status,SubmittedAt', ...rows.map((r) => r.join(','))].join('\n');
        break;
      }
      case 'registrations': {
        const rows = filteredStudents.map((s) => [s.uid, `"${s.displayName}"`, s.email, s.grade || 9, s.role, s.createdAt || '']);
        csvContent = ['UID,DisplayName,Email,Grade,Role,RegisteredAt', ...rows.map((r) => r.join(','))].join('\n');
        break;
      }
      case 'active_subs':
      case 'expired_subs': {
        const targetList = selectedReport === 'active_subs' ? activeSubs : expiredSubs;
        const rows = targetList.map((s) => [s.userId, `"${s.studentName}"`, s.grade, s.status, s.priceETB, s.startDate, s.expiryDate]);
        csvContent = ['UserID,StudentName,Grade,Status,PriceETB,StartDate,ExpiryDate', ...rows.map((r) => r.join(','))].join('\n');
        break;
      }
      case 'grade_distribution': {
        const grades: Grade[] = [9, 10, 11, 12];
        const rows = grades.map((g) => {
          const total = filteredStudents.filter((s) => s.grade === g).length;
          const active = activeSubs.filter((s) => s.grade === g).length;
          return [g, total, active];
        });
        csvContent = ['Grade,TotalRegisteredStudents,ActiveSubscribers', ...rows.map((r) => r.join(','))].join('\n');
        break;
      }
      case 'payment_methods': {
        const methods = ['telebirr', 'cbe', 'dashen', 'boa'];
        const rows = methods.map((m) => {
          const matched = filteredPayments.filter((p) => p.paymentMethod === m && p.status === 'APPROVED');
          const sum = matched.reduce((s, p) => s + (p.amountETB || 0), 0);
          return [m, matched.length, sum];
        });
        csvContent = ['PaymentMethod,ApprovedTransactionsCount,TotalRevenueETB', ...rows.map((r) => r.join(','))].join('\n');
        break;
      }
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportJSON = () => {
    if (!isOwnerSuperAdmin) {
      alert('Unauthorized. Only Super Admin can export financial reports.');
      return;
    }

    let exportData: any = {};
    const filename = `nur_ai_${selectedReport}_${new Date().toISOString().slice(0, 10)}.json`;

    switch (selectedReport) {
      case 'payments':
        exportData = { report: 'payments_transaction_report', generatedAt: new Date().toISOString(), records: filteredPayments };
        break;
      case 'revenue':
        exportData = {
          report: 'revenue_report',
          generatedAt: new Date().toISOString(),
          totalApprovedRevenueETB: filteredPayments.filter((p) => p.status === 'APPROVED').reduce((s, p) => s + (p.amountETB || 0), 0),
          approvedPayments: filteredPayments.filter((p) => p.status === 'APPROVED'),
        };
        break;
      case 'registrations':
        exportData = { report: 'student_registrations_report', generatedAt: new Date().toISOString(), count: filteredStudents.length, students: filteredStudents };
        break;
      case 'active_subs':
        exportData = { report: 'active_subscriptions_report', generatedAt: new Date().toISOString(), count: activeSubs.length, subscriptions: activeSubs };
        break;
      case 'expired_subs':
        exportData = { report: 'expired_subscriptions_report', generatedAt: new Date().toISOString(), count: expiredSubs.length, subscriptions: expiredSubs };
        break;
      case 'grade_distribution':
        exportData = {
          report: 'grade_distribution_report',
          generatedAt: new Date().toISOString(),
          distribution: [9, 10, 11, 12].map((g) => ({
            grade: g,
            registeredStudents: filteredStudents.filter((s) => s.grade === g).length,
            activeSubscribers: activeSubs.filter((s) => s.grade === g).length,
          })),
        };
        break;
      case 'payment_methods':
        exportData = {
          report: 'payment_methods_report',
          generatedAt: new Date().toISOString(),
          methods: ['telebirr', 'cbe', 'dashen', 'boa'].map((m) => {
            const matched = filteredPayments.filter((p) => p.paymentMethod === m && p.status === 'APPROVED');
            return {
              method: m,
              count: matched.length,
              totalETB: matched.reduce((s, p) => s + (p.amountETB || 0), 0),
            };
          }),
        };
        break;
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const reportTabs: { id: ReportType; label: string; count?: number }[] = [
    { id: 'payments', label: '1. የክፍያዎች ሪፖርት (Payments)', count: filteredPayments.length },
    { id: 'revenue', label: '2. የገቢ ሪፖርት (Revenue)', count: filteredPayments.filter((p) => p.status === 'APPROVED').length },
    { id: 'registrations', label: '3. የተማሪዎች ምዝገባ (Registrations)', count: filteredStudents.length },
    { id: 'active_subs', label: '4. ንቁ ሳብስክሪፕሽን (Active Subs)', count: activeSubs.length },
    { id: 'expired_subs', label: '5. ጊዜያቸው ያለፈባቸው (Expired)', count: expiredSubs.length },
    { id: 'grade_distribution', label: '6. የክፍል ስርጭት (Grade Distribution)' },
    { id: 'payment_methods', label: '7. የክፍያ መንገዶች (Payment Methods)' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-100 text-emerald-800">
              Super Admin Reports
            </span>
            <span className="text-xs text-stone-500 font-mono">Restricted to {SUPER_ADMIN_EMAIL}</span>
          </div>
          <h2 className="text-lg font-bold font-serif-ethiopic text-stone-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-700" />
            <span>ኦፊሴላዊ የሲስተም እና የፋይናንስ ሪፖርቶች (System & Revenue Reports)</span>
          </h2>
          <p className="text-xs text-stone-500">
            Exportable audits, payment histories, registration records, and grade performance
          </p>
        </div>

        {/* Date Filter & Export buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Date Filter */}
          <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl text-xs">
            <Calendar className="w-3.5 h-3.5 text-stone-500 ml-1.5" />
            <button
              onClick={() => setDateRange('all')}
              className={`px-2 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                dateRange === 'all' ? 'bg-white shadow-2xs text-stone-900' : 'text-stone-600'
              }`}
            >
              All Time
            </button>
            <button
              onClick={() => setDateRange('30d')}
              className={`px-2 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                dateRange === '30d' ? 'bg-white shadow-2xs text-stone-900' : 'text-stone-600'
              }`}
            >
              30 Days
            </button>
            <button
              onClick={() => setDateRange('7d')}
              className={`px-2 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                dateRange === '7d' ? 'bg-white shadow-2xs text-stone-900' : 'text-stone-600'
              }`}
            >
              7 Days
            </button>
          </div>

          {/* Export CSV */}
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
            title="Export CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          {/* Export JSON */}
          <button
            onClick={handleExportJSON}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-900 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
            title="Export JSON"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>
        </div>
      </div>

      {/* Reports Navigation Tabs */}
      <div className="flex flex-wrap gap-1.5 bg-stone-100 p-1.5 rounded-xl border border-stone-200">
        {reportTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedReport(tab.id)}
            className={`px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedReport === tab.id
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-white/60 text-stone-700 hover:bg-white'
            }`}
          >
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={`px-1.5 py-0.2 rounded text-[10px] font-mono ${
                  selectedReport === tab.id ? 'bg-emerald-900 text-white' : 'bg-stone-200 text-stone-700'
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Report Data Preview Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-stone-400 flex flex-col items-center gap-2">
            <RefreshCw className="w-6 h-6 animate-spin text-emerald-600" />
            <span className="text-xs">ሪፖርት በመዘጋጀት ላይ ነው...</span>
          </div>
        ) : (
          <div className="overflow-x-auto max-h-[500px]">
            {/* 1 & 2: PAYMENTS OR REVENUE TABLE */}
            {(selectedReport === 'payments' || selectedReport === 'revenue') && (
              <table className="w-full text-left text-xs text-stone-700">
                <thead className="bg-stone-100 text-[11px] font-bold text-stone-600 uppercase border-b border-stone-200 sticky top-0">
                  <tr>
                    <th className="p-3">Payment ID</th>
                    <th className="p-3">Student Name</th>
                    <th className="p-3">Grade</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Method</th>
                    <th className="p-3">Ref Code</th>
                    <th className="p-3">Date</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {(selectedReport === 'revenue'
                    ? filteredPayments.filter((p) => p.status === 'APPROVED')
                    : filteredPayments
                  ).map((p) => (
                    <tr key={p.paymentId} className="hover:bg-stone-50">
                      <td className="p-3 font-mono text-[10px] text-stone-500">{p.paymentId}</td>
                      <td className="p-3 font-bold text-stone-900">{p.studentName || 'Student'}</td>
                      <td className="p-3">Grade {p.grade}</td>
                      <td className="p-3 font-bold text-stone-900">{p.amountETB} ETB</td>
                      <td className="p-3 uppercase font-semibold text-stone-600">{p.paymentMethod}</td>
                      <td className="p-3 font-mono text-stone-600">{p.transactionReference}</td>
                      <td className="p-3 text-stone-500 text-[11px]">
                        {new Date(p.submittedAt).toLocaleDateString()}
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            p.status === 'APPROVED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : p.status === 'PENDING'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* 3: REGISTRATIONS TABLE */}
            {selectedReport === 'registrations' && (
              <table className="w-full text-left text-xs text-stone-700">
                <thead className="bg-stone-100 text-[11px] font-bold text-stone-600 uppercase border-b border-stone-200 sticky top-0">
                  <tr>
                    <th className="p-3">Student Name</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Grade</th>
                    <th className="p-3">Role</th>
                    <th className="p-3">Registered At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredStudents.map((s) => (
                    <tr key={s.uid} className="hover:bg-stone-50">
                      <td className="p-3 font-bold text-stone-900">{s.displayName}</td>
                      <td className="p-3 text-stone-600">{s.email}</td>
                      <td className="p-3 font-semibold">Grade {s.grade || 9}</td>
                      <td className="p-3 uppercase text-stone-500 font-mono text-[10px]">{s.role}</td>
                      <td className="p-3 text-stone-500 text-[11px]">
                        {s.createdAt ? new Date(s.createdAt).toLocaleDateString() : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* 4 & 5: ACTIVE & EXPIRED SUBSCRIPTIONS */}
            {(selectedReport === 'active_subs' || selectedReport === 'expired_subs') && (
              <table className="w-full text-left text-xs text-stone-700">
                <thead className="bg-stone-100 text-[11px] font-bold text-stone-600 uppercase border-b border-stone-200 sticky top-0">
                  <tr>
                    <th className="p-3">Student User ID</th>
                    <th className="p-3">Student Name</th>
                    <th className="p-3">Grade</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Price</th>
                    <th className="p-3">Start Date</th>
                    <th className="p-3">Expiry Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {(selectedReport === 'active_subs' ? activeSubs : expiredSubs).map((s) => (
                    <tr key={s.id} className="hover:bg-stone-50">
                      <td className="p-3 font-mono text-[10px] text-stone-500">{s.userId}</td>
                      <td className="p-3 font-bold text-stone-900">{s.studentName || 'Student'}</td>
                      <td className="p-3">Grade {s.grade}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            s.status === 'ACTIVE'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {s.status}
                        </span>
                      </td>
                      <td className="p-3 font-bold text-stone-900">{s.priceETB} ETB</td>
                      <td className="p-3 text-stone-500 text-[11px]">
                        {s.startDate ? new Date(s.startDate).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="p-3 text-stone-500 text-[11px]">
                        {s.expiryDate ? new Date(s.expiryDate).toLocaleDateString() : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* 6: GRADE DISTRIBUTION */}
            {selectedReport === 'grade_distribution' && (
              <table className="w-full text-left text-xs text-stone-700">
                <thead className="bg-stone-100 text-[11px] font-bold text-stone-600 uppercase border-b border-stone-200">
                  <tr>
                    <th className="p-3">Grade</th>
                    <th className="p-3">Total Registered Students</th>
                    <th className="p-3">Active Subscribers</th>
                    <th className="p-3">Conversion Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {([9, 10, 11, 12] as Grade[]).map((g) => {
                    const total = filteredStudents.filter((s) => s.grade === g).length;
                    const active = activeSubs.filter((s) => s.grade === g).length;
                    const rate = total > 0 ? Math.round((active / total) * 100) : 0;
                    return (
                      <tr key={g} className="hover:bg-stone-50">
                        <td className="p-3 font-bold text-stone-900">Grade {g} (ክፍል {g})</td>
                        <td className="p-3 font-mono font-bold text-stone-800">{total} ተማሪዎች</td>
                        <td className="p-3 font-mono font-bold text-emerald-700">{active} ንቁ ሳብስክሪፕሽን</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            {rate}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}

            {/* 7: PAYMENT METHODS UTILIZATION */}
            {selectedReport === 'payment_methods' && (
              <table className="w-full text-left text-xs text-stone-700">
                <thead className="bg-stone-100 text-[11px] font-bold text-stone-600 uppercase border-b border-stone-200">
                  <tr>
                    <th className="p-3">Payment Method</th>
                    <th className="p-3">Approved Transactions</th>
                    <th className="p-3">Total Revenue (ETB)</th>
                    <th className="p-3">Volume Share</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {[
                    { id: 'telebirr', name: 'Telebirr (ቴሌብር)' },
                    { id: 'cbe', name: 'CBE (የኢትዮጵያ ንግድ ባንክ)' },
                    { id: 'dashen', name: 'Dashen Bank (ዳሽን ባንክ)' },
                    { id: 'boa', name: 'Bank of Abyssinia (አቢሲኒያ ባንክ)' },
                  ].map((m) => {
                    const matched = filteredPayments.filter(
                      (p) => p.paymentMethod === m.id && p.status === 'APPROVED'
                    );
                    const totalRev = filteredPayments
                      .filter((p) => p.status === 'APPROVED')
                      .reduce((s, p) => s + (p.amountETB || 0), 0);
                    const sum = matched.reduce((s, p) => s + (p.amountETB || 0), 0);
                    const share = totalRev > 0 ? Math.round((sum / totalRev) * 100) : 0;
                    return (
                      <tr key={m.id} className="hover:bg-stone-50">
                        <td className="p-3 font-bold text-stone-900">{m.name}</td>
                        <td className="p-3 font-mono font-bold text-stone-800">{matched.length} ክፍያዎች</td>
                        <td className="p-3 font-mono font-bold text-emerald-800">{sum.toLocaleString()} ETB</td>
                        <td className="p-3 font-bold text-stone-600">{share}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
