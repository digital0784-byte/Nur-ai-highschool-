import React, { useState } from 'react';
import {
  X,
  CreditCard,
  Smartphone,
  Building2,
  Copy,
  Check,
  ShieldCheck,
  Zap,
  PhoneCall,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Info,
  Lock,
} from 'lucide-react';
import { Grade } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useSubscription } from '../../context/SubscriptionContext';
import { subscriptionService } from '../../services/subscriptionService';

interface DirectSystemPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedGrade?: Grade;
  onPaymentComplete?: () => void;
}

export const DirectSystemPaymentModal: React.FC<DirectSystemPaymentModalProps> = ({
  isOpen,
  onClose,
  selectedGrade = 9,
  onPaymentComplete,
}) => {
  const { user, userProfile, openAuthModal } = useAuth();
  const {
    isOwnerSuperAdmin,
    submitPayment,
    superAdminApprove,
    refreshSubscription,
  } = useSubscription();

  const [activeGrade, setActiveGrade] = useState<Grade>(selectedGrade);
  const [activeMethod, setActiveMethod] = useState<'telebirr' | 'cbe'>('telebirr');
  const [transactionRef, setTransactionRef] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const prices: Record<Grade, number> = {
    9: 54,
    10: 54,
    11: 54,
    12: 54,
  };

  const currentPrice = prices[activeGrade];

  const telebirrData = {
    accountName: 'Nuriye Ahmed Adem',
    accountNumber: '0910097862',
    dialCode: '*127#',
    directDial: 'tel:0910097862',
  };

  const cbeData = {
    bankName: 'የኢትዮጵያ ንግድ ባንክ (Commercial Bank of Ethiopia)',
    accountName: 'Nuriye Ahmed Adem',
    accountNumber: '1000382883776',
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleDirectActivation = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!user) {
      openAuthModal('login');
      return;
    }

    const trimmedRef = transactionRef.trim();
    if (!trimmedRef) {
      setErrorMessage('እባክዎ የቴሌብር ማረጋገጫ (Transaction ID) ወይም የሲቢኢ (FT...) ቁጥር ያስገቡ።');
      return;
    }

    if (trimmedRef.length < 4) {
      setErrorMessage('የማረጋገጫ ቁጥሩ ቢያንስ 4 ፊደላት ወይም አሃዞች መሆን አለበት።');
      return;
    }

    setIsProcessing(true);
    try {
      const methodName =
        activeMethod === 'telebirr'
          ? 'Telebirr'
          : 'Commercial Bank of Ethiopia (CBE)';

      // Submit payment directly into system
      const paymentRecord = await submitPayment({
        grade: activeGrade,
        amountETB: currentPrice,
        paymentMethod: methodName,
        transactionReference: trimmedRef,
      });

      // If owner super admin or if self-verifying, auto-approve
      if (isOwnerSuperAdmin && paymentRecord?.paymentId) {
        await superAdminApprove(
          paymentRecord.paymentId,
          user.uid,
          activeGrade,
          currentPrice
        );
      }

      // Refresh subscription state
      await refreshSubscription();

      setSuccessMessage(
        isOwnerSuperAdmin
          ? `የሱፐር አድሚን ቀጥታ ክፍያ ተረጋግጦ ክፍል ${activeGrade} ሙሉ በሙሉ ተከፍቷል!`
          : `የክፍያ ማረጋገጫዎ በሲስተሙ ውስጥ በቀጥታ ተመዝግቧል! አስተዳዳሪው (${telebirrData.accountName}) እንዳረጋገጠው ይከፈታል።`
      );
      setTransactionRef('');

      if (onPaymentComplete) {
        setTimeout(() => {
          onPaymentComplete();
          onClose();
        }, 1500);
      }
    } catch (err: any) {
      console.error('Direct payment processing error:', err);
      setErrorMessage(err.message || 'ክፍያውን ማረጋገጥ አልተቻለም፣ እባክዎ በድጋሚ ይሞክሩ።');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div
      id="direct-payment-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div
        id="direct-payment-modal-card"
        className="w-full max-w-xl bg-[#FAF6EC] border-[2px] border-[#38332D] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Modal Top Header matching red theme */}
        <div className="bg-[#0B132B] text-white p-4 sm:p-5 flex items-center justify-between border-b border-slate-700 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold font-serif-ethiopic text-white">
                  NUR AI Premium — 54 ETB/month
                </h3>
                <span className="text-[10px] bg-emerald-500 text-slate-950 font-black px-1.5 py-0.5 rounded">
                  OFFICIAL
                </span>
              </div>
              <p className="text-xs text-slate-300 font-sans">
                Currency: ETB (Ethiopian Birr) • Direct Activation
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5">
          {/* Grade and Price Selection */}
          <div>
            <label className="block text-xs font-bold text-stone-700 font-serif-ethiopic mb-1.5">
              1. የክፍል ደረጃዎን ይምረጡ (Choose Grade):
            </label>
            <div className="grid grid-cols-4 gap-2">
              {([9, 10, 11, 12] as Grade[]).map((g) => {
                const isSelected = activeGrade === g;
                return (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setActiveGrade(g)}
                    className={`py-2 px-1 rounded-xl text-center border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#38332D] text-white border-[#38332D] shadow-xs'
                        : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-100'
                    }`}
                  >
                    <div className="text-xs font-bold font-serif-ethiopic">ክፍል {g}</div>
                    <div className="text-[11px] font-extrabold text-amber-600">
                      {prices[g]} ETB
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Payment Method Selector Tabs */}
          <div>
            <label className="block text-xs font-bold text-stone-700 font-serif-ethiopic mb-1.5">
              2. የመክፈያ መንገድ ይምረጡ (Telebirr ወይም CBE):
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setActiveMethod('telebirr')}
                className={`p-3 rounded-xl border flex items-center gap-2.5 transition-all cursor-pointer ${
                  activeMethod === 'telebirr'
                    ? 'bg-amber-500/15 border-amber-500 text-amber-950 ring-2 ring-amber-500/30 font-bold'
                    : 'bg-white border-stone-300 text-stone-700 hover:bg-stone-50'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div className="text-left truncate">
                  <div className="text-xs font-bold font-serif-ethiopic">ቴሌብር (Telebirr)</div>
                  <div className="text-[11px] font-mono font-bold text-amber-900">0910097862</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setActiveMethod('cbe')}
                className={`p-3 rounded-xl border flex items-center gap-2.5 transition-all cursor-pointer ${
                  activeMethod === 'cbe'
                    ? 'bg-purple-500/15 border-purple-600 text-purple-950 ring-2 ring-purple-600/30 font-bold'
                    : 'bg-white border-stone-300 text-stone-700 hover:bg-stone-50'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-purple-700 text-white flex items-center justify-center shrink-0">
                  <Building2 className="w-4 h-4" />
                </div>
                <div className="text-left truncate">
                  <div className="text-xs font-bold font-serif-ethiopic">ንግድ ባንክ (CBE)</div>
                  <div className="text-[11px] font-mono font-bold text-purple-900">1000382883776</div>
                </div>
              </button>
            </div>
          </div>

          {/* Account Detail Box for Telebirr */}
          {activeMethod === 'telebirr' && (
            <div className="bg-white border-2 border-amber-400 rounded-xl p-4 space-y-3 shadow-xs">
              <div className="flex items-center justify-between border-b border-amber-100 pb-2">
                <span className="text-xs text-stone-600 font-bold">የቴሌብር ስም (Account Name):</span>
                <span className="text-xs font-black text-stone-900 font-mono">
                  {telebirrData.accountName}
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-amber-100 pb-2">
                <div>
                  <span className="text-xs text-stone-600 block">የቴሌብር ስልክ ቁጥር:</span>
                  <span className="text-base font-mono font-black text-amber-700">
                    {telebirrData.accountNumber}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => copyToClipboard(telebirrData.accountNumber, 'tb_num')}
                    className="px-2.5 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer transition-colors border border-amber-300"
                  >
                    {copiedKey === 'tb_num' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>ተገልብጧል</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>ቁጥሩን ቅዳ</span>
                      </>
                    )}
                  </button>

                  <a
                    href={telebirrData.directDial}
                    className="px-2.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                    title="በስልክዎ በቀጥታ ይደውሉ"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>ደውል</span>
                  </a>
                </div>
              </div>

              <div className="p-2.5 bg-amber-50 rounded-lg text-xs text-amber-950 font-serif-ethiopic flex items-start gap-2 border border-amber-200/60">
                <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <p className="leading-relaxed text-[11.5px]">
                  በቴሌብር መተግበሪያ (Telebirr App) ወይም በ <strong>*127#</strong> ወደ{' '}
                  <strong>{telebirrData.accountNumber}</strong> ({telebirrData.accountName}){' '}
                  <strong>{currentPrice} ብር</strong> ያስተላልፉ። ከዚያ የመጣውን የክፍያ ማረጋገጫ ቁጥር (Transaction ID) ከታች ያስገቡ።
                </p>
              </div>
            </div>
          )}

          {/* Account Detail Box for CBE */}
          {activeMethod === 'cbe' && (
            <div className="bg-white border-2 border-purple-400 rounded-xl p-4 space-y-3 shadow-xs">
              <div className="flex items-center justify-between border-b border-purple-100 pb-2">
                <span className="text-xs text-stone-600 font-bold">የሂሳብ ስም (Account Name):</span>
                <span className="text-xs font-black text-stone-900 font-mono">
                  {cbeData.accountName}
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-purple-100 pb-2">
                <div>
                  <span className="text-xs text-stone-600 block">የሲቢኢ የሂሳብ ቁጥር (CBE Account):</span>
                  <span className="text-base font-mono font-black text-purple-800">
                    {cbeData.accountNumber}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => copyToClipboard(cbeData.accountNumber, 'cbe_acc')}
                  className="px-2.5 py-1.5 bg-purple-100 hover:bg-purple-200 text-purple-900 text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer transition-colors border border-purple-300"
                >
                  {copiedKey === 'cbe_acc' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>ተገልብጧል</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>ሂሳቡን ቅዳ</span>
                    </>
                  )}
                </button>
              </div>

              <div className="p-2.5 bg-purple-50 rounded-lg text-xs text-purple-950 font-serif-ethiopic flex items-start gap-2 border border-purple-200/60">
                <Info className="w-4 h-4 text-purple-700 shrink-0 mt-0.5" />
                <p className="leading-relaxed text-[11.5px]">
                  በ CBE Mobile Banking ወይም በ CBE Birr ወደ ሂሳብ ቁጥር{' '}
                  <strong>{cbeData.accountNumber}</strong> ({cbeData.accountName}){' '}
                  <strong>{currentPrice} ብር</strong> ያስተላልፉ። የባንክ ማመሳከሪያ ቁጥር (FT Number) ከታች ይመዝግቡ።
                </p>
              </div>
            </div>
          )}

          {/* Form to submit and verify directly */}
          <form onSubmit={handleDirectActivation} className="space-y-4 pt-1">
            <div>
              <label className="block text-xs font-bold text-stone-800 font-serif-ethiopic mb-1">
                3. የክፍያ ማረጋገጫ ቁጥር ያስገቡ (Transaction ID / FT Reference):
              </label>
              <input
                type="text"
                value={transactionRef}
                onChange={(e) => setTransactionRef(e.target.value)}
                placeholder={
                  activeMethod === 'telebirr'
                    ? 'ለምሳሌ፡ CIB4938291 ወይም 0910...'
                    : 'ለምሳሌ፡ FT2421039841...'
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-400 bg-white text-stone-900 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#2E6B4A]"
                required
              />
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-300 text-red-900 text-xs rounded-xl flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Success Message */}
            {successMessage && (
              <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-950 text-xs rounded-xl flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Submit Action Button */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-3 px-4 rounded-xl bg-[#2E6B4A] hover:bg-[#235338] disabled:bg-stone-400 text-white text-sm font-bold font-serif-ethiopic flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all"
            >
              {isProcessing ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>ክፍያውን በሲስተሙ እያረጋገጠ ነው...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 text-amber-300" />
                  <span>PAY 54 ETB (ክፍያውን ይመዝግቡ)</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Modal Bottom Footer */}
        <div className="p-3.5 bg-stone-100 border-t border-stone-300 text-center text-xs text-stone-600 font-serif-ethiopic flex items-center justify-center gap-2 shrink-0">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          <span>የተጠበቀ እና ፈጣን የክፍያ ስርዓት — Telebirr 0910097862 | CBE 1000382883776</span>
        </div>
      </div>
    </div>
  );
};
