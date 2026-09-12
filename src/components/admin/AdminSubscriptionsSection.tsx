import React, { useState, useEffect, useMemo } from 'react';
import {
  CreditCard,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  PauseCircle,
  PlayCircle,
  Calendar,
  Eye,
  RefreshCw,
  ShieldAlert,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSubscription } from '../../context/SubscriptionContext';
import { subscriptionService, SUPER_ADMIN_EMAIL } from '../../services/subscriptionService';
import { Subscription, SubscriptionStatus } from '../../types/subscription';
import { Grade } from '../../types';

export const AdminSubscriptionsSection: React.FC = () => {
  const { user } = useAuth();
  const { isOwnerSuperAdmin } = useSubscription();

  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [gradeFilter, setGradeFilter] = useState<Grade | 'ALL'>('ALL');

  // Suspension Modal State
  const [targetSub, setTargetSub] = useState<Subscription | null>(null);
  const [suspensionReason, setSuspensionReason] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [actionAlert, setActionAlert] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const unsub = subscriptionService.subscribeToAllSubscriptions((subs) => {
      setSubscriptions(subs);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // Compute status including expiration date check
  const getComputedStatus = (s: Subscription): SubscriptionStatus => {
    if (s.status === 'SUSPENDED') return 'SUSPENDED';
    if (s.status === 'PENDING') return 'PENDING';
    const isPast = new Date(s.expiryDate).getTime() < Date.now();
    if (isPast) return 'EXPIRED';
    return s.status;
  };

  const filteredSubscriptions = useMemo(() => {
    return subscriptions.filter((s) => {
      const computed = getComputedStatus(s);
      if (statusFilter !== 'ALL' && computed !== statusFilter) return false;
      if (gradeFilter !== 'ALL' && s.grade !== gradeFilter) return false;

      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchName = s.studentName?.toLowerCase().includes(q);
        const matchId = s.userId?.toLowerCase().includes(q);
        const matchSubId = s.id?.toLowerCase().includes(q);
        if (!matchName && !matchId && !matchSubId) return false;
      }
      return true;
    });
  }, [subscriptions, statusFilter, gradeFilter, searchTerm]);

  const handleToggleSuspension = async (s: Subscription) => {
    setTargetSub(s);
    setSuspensionReason('');
  };

  const confirmSuspensionAction = async () => {
    if (!targetSub) return;
    if (!isOwnerSuperAdmin) {
      setActionAlert({ type: 'error', text: 'Unauthorized. Only Super Admin can suspend/reactivate.' });
      return;
    }

    const willSuspend = targetSub.status !== 'SUSPENDED';
    setIsSubmitting(true);
    setActionAlert(null);

    try {
      await subscriptionService.superAdminToggleSubscriptionSuspension(
        targetSub.userId,
        willSuspend,
        suspensionReason.trim() || undefined,
        user ? { uid: user.uid, email: user.email || SUPER_ADMIN_EMAIL } : undefined
      );

      setActionAlert({
        type: 'success',
        text: `ሳብስክሪፕሽን በተሳካ ሁኔታ ${willSuspend ? 'ታግዷል (Suspended)' : 'ዳግም ነቅቷል (Reactivated)'}።`,
      });
      setTargetSub(null);
    } catch (err: any) {
      setActionAlert({ type: 'error', text: `Failed: ${err.message}` });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-blue-100 text-blue-900">
              Subscription Management
            </span>
            <span className="text-xs text-stone-500 font-mono">Real-time Student Enrolments</span>
          </div>
          <h2 className="text-lg font-bold font-serif-ethiopic text-stone-900 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-emerald-700" />
            <span>የተማሪዎች ሳብስክሪፕሽን ዝርዝርና ቁጥጥር (Subscriptions Management)</span>
          </h2>
          <p className="text-xs text-stone-500">
            View active, pending, expired, and suspended memberships with manual override authorization.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-stone-100 px-3 py-1.5 rounded-xl text-center">
            <span className="text-[10px] text-stone-500 font-bold block">ጠቅላላ ሳብስክሪፕሽን</span>
            <span className="text-base font-black text-stone-900">{subscriptions.length}</span>
          </div>
        </div>
      </div>

      {actionAlert && (
        <div
          className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
            actionAlert.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          {actionAlert.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span>{actionAlert.text}</span>
        </div>
      )}

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-stone-50 p-3 rounded-xl border border-stone-200">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by student name, User ID, or subscription ID..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1 w-full sm:w-auto overflow-x-auto">
          {[
            { id: 'ALL', label: 'All' },
            { id: 'ACTIVE', label: 'Active' },
            { id: 'PENDING', label: 'Pending' },
            { id: 'EXPIRED', label: 'Expired' },
            { id: 'SUSPENDED', label: 'Suspended' },
          ].map((s) => (
            <button
              key={s.id}
              onClick={() => setStatusFilter(s.id)}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                statusFilter === s.id
                  ? 'bg-stone-900 text-white shadow-2xs'
                  : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Grade Filter */}
        <div className="flex items-center gap-1">
          <span className="text-xs font-bold text-stone-500">Grade:</span>
          {(['ALL', 9, 10, 11, 12] as const).map((g) => (
            <button
              key={g}
              onClick={() => setGradeFilter(g)}
              className={`px-2 py-1 text-xs font-bold rounded-lg cursor-pointer ${
                gradeFilter === g
                  ? 'bg-emerald-700 text-white shadow-2xs'
                  : 'bg-white text-stone-600 border border-stone-200'
              }`}
            >
              {g === 'ALL' ? 'All' : g}
            </button>
          ))}
        </div>
      </div>

      {/* Subscriptions Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-stone-400 flex flex-col items-center gap-2">
            <RefreshCw className="w-6 h-6 animate-spin text-emerald-600" />
            <span className="text-xs">የሳብስክሪፕሽን መረጃዎች በመጫን ላይ ናቸው...</span>
          </div>
        ) : filteredSubscriptions.length === 0 ? (
          <div className="p-12 text-center text-stone-400">
            ምንም ሳብስክሪፕሽን አልተገኘም (No subscriptions matching filter)
          </div>
        ) : (
          <div className="overflow-x-auto max-h-[550px]">
            <table className="w-full text-left text-xs text-stone-700">
              <thead className="bg-stone-100 text-[11px] font-bold text-stone-600 uppercase border-b border-stone-200 sticky top-0">
                <tr>
                  <th className="p-3">ተማሪ (Student Name & ID)</th>
                  <th className="p-3">ክፍል (Grade)</th>
                  <th className="p-3">ሁኔታ (Status)</th>
                  <th className="p-3">ዋጋ (Price)</th>
                  <th className="p-3">የተጀመረበት (Start Date)</th>
                  <th className="p-3">የሚያበቃበት (Expiry Date)</th>
                  <th className="p-3">ቀሪ ቀናት (Days Left)</th>
                  <th className="p-3 text-right">ተግባራት (Actions)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredSubscriptions.map((sub) => {
                  const computedStatus = getComputedStatus(sub);
                  const expiryTime = new Date(sub.expiryDate).getTime();
                  const nowTime = Date.now();
                  const daysLeft = Math.max(0, Math.ceil((expiryTime - nowTime) / (1000 * 60 * 60 * 24)));

                  return (
                    <tr key={sub.id || sub.userId} className="hover:bg-stone-50">
                      <td className="p-3">
                        <div className="font-bold text-stone-900">{sub.studentName || 'Student'}</div>
                        <div className="font-mono text-[10px] text-stone-400">{sub.userId}</div>
                      </td>
                      <td className="p-3 font-semibold">Grade {sub.grade}</td>
                      <td className="p-3">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            computedStatus === 'ACTIVE'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : computedStatus === 'SUSPENDED'
                              ? 'bg-rose-100 text-rose-800 border border-rose-200'
                              : computedStatus === 'PENDING'
                              ? 'bg-amber-100 text-amber-800 border border-amber-200'
                              : 'bg-stone-100 text-stone-700 border border-stone-200'
                          }`}
                        >
                          {computedStatus}
                        </span>
                      </td>
                      <td className="p-3 font-bold text-stone-900">{sub.priceETB} ETB</td>
                      <td className="p-3 text-stone-500 text-[11px]">
                        {sub.startDate ? new Date(sub.startDate).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="p-3 text-stone-500 text-[11px]">
                        {sub.expiryDate ? new Date(sub.expiryDate).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="p-3">
                        {computedStatus === 'ACTIVE' ? (
                          <span
                            className={`font-mono text-xs font-bold ${
                              daysLeft <= 3 ? 'text-rose-600 animate-pulse' : 'text-emerald-700'
                            }`}
                          >
                            {daysLeft} ቀናት ቀሪ
                          </span>
                        ) : (
                          <span className="text-stone-400 text-[11px]">-</span>
                        )}
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => handleToggleSuspension(sub)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            sub.status === 'SUSPENDED'
                              ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                              : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                          }`}
                          title={sub.status === 'SUSPENDED' ? 'Reactivate Subscription' : 'Suspend Subscription'}
                        >
                          {sub.status === 'SUSPENDED' ? (
                            <>
                              <PlayCircle className="w-3.5 h-3.5" />
                              <span>Reactivate</span>
                            </>
                          ) : (
                            <>
                              <PauseCircle className="w-3.5 h-3.5" />
                              <span>Suspend</span>
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Suspension / Reactivation Modal */}
      {targetSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 border border-stone-300 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-200">
              <h4 className="text-base font-bold text-stone-900 font-serif-ethiopic flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-emerald-700" />
                <span>
                  {targetSub.status === 'SUSPENDED'
                    ? 'ሳብስክሪፕሽን ዳግም አንቃ (Reactivate)'
                    : 'ሳብስክሪፕሽን አግድ (Suspend Subscription)'}
                </span>
              </h4>
              <button
                onClick={() => setTargetSub(null)}
                className="text-stone-400 hover:text-stone-600 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="text-xs space-y-2 text-stone-600">
              <p>
                ተማሪ፡ <strong className="text-stone-900">{targetSub.studentName || targetSub.userId}</strong>
              </p>
              <p>
                ክፍል፡ <strong>Grade {targetSub.grade}</strong>
              </p>
              <p>
                ይህ እርምጃ በቀጥታ በኦዲት መዝገብ (Audit Log) ውስጥ ይመዘገባል እንዲሁም ለተማሪው የኢን-አፕ ማሳወቂያ ይደርሰዋል።
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">ምክንያት (Reason):</label>
              <input
                type="text"
                value={suspensionReason}
                onChange={(e) => setSuspensionReason(e.target.value)}
                placeholder="e.g. Disciplinary hold, or manual verification passed"
                className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-xl"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setTargetSub(null)}
                className="px-3 py-1.5 bg-stone-100 text-stone-600 rounded-lg text-xs font-bold cursor-pointer"
              >
                አቋርጥ (Cancel)
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={confirmSuspensionAction}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold text-white transition-all cursor-pointer ${
                  targetSub.status === 'SUSPENDED'
                    ? 'bg-emerald-700 hover:bg-emerald-800'
                    : 'bg-rose-700 hover:bg-rose-800'
                }`}
              >
                {isSubmitting
                  ? 'በማከናወን ላይ...'
                  : targetSub.status === 'SUSPENDED'
                  ? 'አንቃ (Reactivate)'
                  : 'አግድ (Suspend)'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
