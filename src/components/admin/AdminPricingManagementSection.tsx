import React, { useState, useEffect } from 'react';
import {
  Tag,
  DollarSign,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  RotateCcw,
  Save,
  Lock,
  Calendar,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSubscription } from '../../context/SubscriptionContext';
import { subscriptionService, SUPER_ADMIN_EMAIL } from '../../services/subscriptionService';
import { PricingConfig } from '../../types/subscription';
import { Grade } from '../../types';

export const AdminPricingManagementSection: React.FC = () => {
  const { user } = useAuth();
  const { isOwnerSuperAdmin } = useSubscription();

  const [currentConfig, setCurrentConfig] = useState<PricingConfig | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Form states
  const [p9, setP9] = useState<number>(160);
  const [p10, setP10] = useState<number>(180);
  const [p11, setP11] = useState<number>(200);
  const [p12, setP12] = useState<number>(200);
  const [durationDays, setDurationDays] = useState<number>(30);
  const [freeTierEnabled, setFreeTierEnabled] = useState<boolean>(false);
  const [changeReason, setChangeReason] = useState<string>('');

  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const unsub = subscriptionService.subscribeToPricingConfig((cfg) => {
      setCurrentConfig(cfg);
      setP9(cfg.gradeMonthlyPrices[9] ?? 160);
      setP10(cfg.gradeMonthlyPrices[10] ?? 180);
      setP11(cfg.gradeMonthlyPrices[11] ?? 200);
      setP12(cfg.gradeMonthlyPrices[12] ?? 200);
      setDurationDays(cfg.billingCycleDays ?? 30);
      setFreeTierEnabled(cfg.freeTierEnabled ?? false);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleResetToDefaults = () => {
    setP9(160);
    setP10(180);
    setP11(200);
    setP12(200);
    setDurationDays(30);
    setFreeTierEnabled(false);
    setChangeReason('Reset to standard Ethiopian MoE national subscription benchmarks.');
  };

  const handleSavePrices = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg(null);

    if (!isOwnerSuperAdmin) {
      setStatusMsg({
        type: 'error',
        text: `Unauthorized: Only Super Admin (${SUPER_ADMIN_EMAIL}) is permitted to modify pricing.`,
      });
      return;
    }

    if (p9 <= 0 || p10 <= 0 || p11 <= 0 || p12 <= 0) {
      setStatusMsg({
        type: 'error',
        text: 'Validation Error: Every grade price must be a positive number greater than 0 ETB.',
      });
      return;
    }

    if (durationDays <= 0) {
      setStatusMsg({
        type: 'error',
        text: 'Validation Error: Billing duration must be at least 1 day.',
      });
      return;
    }

    setIsSaving(true);
    try {
      const updatedConfig: PricingConfig = {
        gradeMonthlyPrices: {
          9: Number(p9),
          10: Number(p10),
          11: Number(p11),
          12: Number(p12),
        },
        billingCycleDays: Number(durationDays),
        currency: 'ETB',
        freeTierEnabled,
        updatedAt: new Date().toISOString(),
        updatedBy: user?.email || SUPER_ADMIN_EMAIL,
      };

      await subscriptionService.updatePricingConfig(
        updatedConfig,
        user ? { uid: user.uid, email: user.email || SUPER_ADMIN_EMAIL } : undefined
      );

      setStatusMsg({
        type: 'success',
        text: 'የክፍያ ዋጋዎች በተሳካ ሁኔታ ተሻሽለዋል! (Pricing updated successfully with audit trail)',
      });
      setChangeReason('');
    } catch (err: any) {
      console.error('Failed to update pricing:', err);
      setStatusMsg({
        type: 'error',
        text: `Error updating pricing: ${err.message || 'Unknown error'}`,
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-amber-100 text-amber-900 flex items-center gap-1">
              <Lock className="w-3 h-3 text-amber-700" />
              <span>Super Admin Authorization Required</span>
            </span>
            <span className="text-xs text-stone-500 font-mono">Governed by Ethiopian MoE benchmarks</span>
          </div>
          <h2 className="text-lg font-bold font-serif-ethiopic text-stone-900 flex items-center gap-2">
            <Tag className="w-5 h-5 text-emerald-700" />
            <span>የወርሃዊ ክፍያ ዋጋዎች አስተዳደር (Grade 9–12 Pricing Management)</span>
          </h2>
          <p className="text-xs text-stone-500">
            Configure monthly subscription fees in Ethiopian Birr (ETB). Every update generates an indelible audit log.
          </p>
        </div>

        <button
          type="button"
          onClick={handleResetToDefaults}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>ወደ ነባሪ መልስ (Reset Defaults)</span>
        </button>
      </div>

      {/* Status Feedback */}
      {statusMsg && (
        <div
          className={`p-4 rounded-xl text-xs font-bold flex items-center gap-2 ${
            statusMsg.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          {statusMsg.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* Pricing Form */}
      <form onSubmit={handleSavePrices} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Grade 9 */}
          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-700">9ኛ ክፍል (Grade 9)</span>
              <span className="text-[10px] text-stone-400 font-mono">Default: 160 ETB</span>
            </div>
            <div className="relative">
              <input
                type="number"
                min="1"
                required
                value={p9}
                onChange={(e) => setP9(Math.max(1, parseInt(e.target.value) || 0))}
                className="w-full text-xl font-black p-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 text-stone-900 pl-3 pr-14"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-stone-500">
                ETB/mo
              </span>
            </div>
            <p className="text-[11px] text-stone-500">General secondary foundation curriculum</p>
          </div>

          {/* Grade 10 */}
          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-700">10ኛ ክፍል (Grade 10)</span>
              <span className="text-[10px] text-stone-400 font-mono">Default: 180 ETB</span>
            </div>
            <div className="relative">
              <input
                type="number"
                min="1"
                required
                value={p10}
                onChange={(e) => setP10(Math.max(1, parseInt(e.target.value) || 0))}
                className="w-full text-xl font-black p-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 text-stone-900 pl-3 pr-14"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-stone-500">
                ETB/mo
              </span>
            </div>
            <p className="text-[11px] text-stone-500">Secondary national exam preparation</p>
          </div>

          {/* Grade 11 */}
          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-700">11ኛ ክፍል (Grade 11)</span>
              <span className="text-[10px] text-stone-400 font-mono">Default: 200 ETB</span>
            </div>
            <div className="relative">
              <input
                type="number"
                min="1"
                required
                value={p11}
                onChange={(e) => setP11(Math.max(1, parseInt(e.target.value) || 0))}
                className="w-full text-xl font-black p-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 text-stone-900 pl-3 pr-14"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-stone-500">
                ETB/mo
              </span>
            </div>
            <p className="text-[11px] text-stone-500">Preparatory Natural & Social Sciences</p>
          </div>

          {/* Grade 12 */}
          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-700">12ኛ ክፍል (Grade 12)</span>
              <span className="text-[10px] text-stone-400 font-mono">Default: 200 ETB</span>
            </div>
            <div className="relative">
              <input
                type="number"
                min="1"
                required
                value={p12}
                onChange={(e) => setP12(Math.max(1, parseInt(e.target.value) || 0))}
                className="w-full text-xl font-black p-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 text-stone-900 pl-3 pr-14"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-stone-500">
                ETB/mo
              </span>
            </div>
            <p className="text-[11px] text-stone-500">ESSLCE University Entrance preparation</p>
          </div>
        </div>

        {/* Additional Billing Cycle Parameters */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-emerald-700" />
              <span>የክፍያ ዑደት ርዝማኔ በቀናት (Billing Cycle Duration):</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                max="365"
                required
                value={durationDays}
                onChange={(e) => setDurationDays(Math.max(1, parseInt(e.target.value) || 30))}
                className="w-32 p-2 text-xs bg-stone-50 border border-stone-300 rounded-lg font-bold"
              />
              <span className="text-xs text-stone-500">ቀናት (Days per subscription period, usually 30)</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-indigo-700" />
              <span>የለውጥ ምክንያት (Reason for Price Adjustment):</span>
            </label>
            <input
              type="text"
              value={changeReason}
              onChange={(e) => setChangeReason(e.target.value)}
              placeholder="e.g. Annual curriculum update or inflation adjustment"
              className="w-full p-2 text-xs bg-stone-50 border border-stone-300 rounded-lg"
            />
            <span className="text-[10px] text-stone-400">ይህ ምክንያት በቀጥታ ወደ ኦዲት መዝገብ (Audit Log) ይገባል</span>
          </div>
        </div>

        {/* Submission Button */}
        <div className="flex justify-end gap-3">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'በማስቀመጥ ላይ...' : 'የዋጋ ማሻሻያውን አጽድቅ (Authorize Price Update)'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
