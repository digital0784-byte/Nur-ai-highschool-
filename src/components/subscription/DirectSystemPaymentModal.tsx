import React, { useState } from 'react';
import {
  X,
  CreditCard,
  Smartphone,
  Building2,
  Landmark,
  Copy,
  Check,
  ShieldCheck,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { Grade } from '../../types';
import { PaymentMethodName } from '../../types/subscription';
import { useAuth } from '../../context/AuthContext';
import { useSubscription } from '../../context/SubscriptionContext';
import { DEFAULT_PRICING_CONFIG, subscriptionService } from '../../services/subscriptionService';

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
  const { user, openAuthModal } = useAuth();
  const {
    pricingConfig,
    isOwnerSuperAdmin,
    submitPayment,
    superAdminApprove,
    refreshSubscription,
  } = useSubscription();

  const [activeGrade, setActiveGrade] = useState<Grade>(selectedGrade);
  const [activeMethod, setActiveMethod] = useState<PaymentMethodName>('Dashen Bank');
  const [transactionRef, setTransactionRef] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentPrice = subscriptionService.getPriceForGrade(activeGrade, pricingConfig);
  const methodsMap = pricingConfig?.methods || DEFAULT_PRICING_CONFIG.methods;
  const currentMethodConfig =
    methodsMap[activeMethod] ||
    DEFAULT_PRICING_CONFIG.methods[activeMethod] ||
    DEFAULT_PRICING_CONFIG.methods['Dashen Bank'];

  const copyToClipboard = (text: string, key: string) => {
    if (!text) return;
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
      setErrorMessage('እባክዎ የክፍያ ማረጋገጫ (Transaction ID / Reference) ቁጥር ያስገቡ።');
      return;
    }

    if (trimmedRef.length < 4) {
      setErrorMessage('የማረጋገጫ ቁጥሩ ቢያንስ 4 ፊደላት ወይም አሃዞች መሆን አለበት።');
      return;
    }

    setIsProcessing(true);
    try {
      const paymentRecord = await submitPayment({
        grade: activeGrade,
        amountETB: currentPrice,
        paymentMethod: activeMethod,
        transactionReference: trimmedRef,
      });

      if (isOwnerSuperAdmin && paymentRecord?.paymentId) {
        await superAdminApprove(
          paymentRecord.paymentId,
          user.uid,
          activeGrade,
          currentPrice
        );
      }

      await refreshSubscription();

      setSuccessMessage(
        isOwnerSuperAdmin
          ? `የሱፐር አድሚን ክፍያ ተረጋግጦ ክፍል ${activeGrade} ሙሉ በሙሉ ተከፍቷል!`
          : `የክፍያ ማረጋገጫዎ በሲስተሙ ውስጥ ተመዝግቧል (Status: PENDING)! በአስተዳዳሪው (SUPER_ADMIN) ሲረጋገጥ ይከፈታል።`
      );
      setTransactionRef('');

      if (onPaymentComplete) {
        setTimeout(() => {
          onPaymentComplete();
          onClose();
        }, 1500);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'ክፍያውን ማረጋገጥ አልተቻለም፣ እባክዎ በድጋሚ ይሞክሩ።');
    } finally {
      setIsProcessing(false);
    }
  };

  const methodButtons: { id: PaymentMethodName; label: string; icon: any }[] = [
    { id: 'Telebirr', label: 'ቴሌብር (Telebirr)', icon: Smartphone },
    { id: 'Dashen Bank', label: 'ዳሸን ባንክ (Dashen)', icon: Landmark },
    { id: 'Commercial Bank of Ethiopia (CBE)', label: 'ንግድ ባንክ (CBE)', icon: Building2 },
    { id: 'Bank of Abyssinia', label: 'አቢሲኒያ ባንክ (BoA)', icon: CreditCard },
  ];

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
        {/* Modal Top Header */}
        <div className="bg-[#0B132B] text-white p-4 sm:p-5 flex items-center justify-between border-b border-slate-700 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold font-serif-ethiopic text-white">
                  NUR AI High School — ክፍል {activeGrade} ({currentPrice} ETB/month)
                </h3>
              </div>
              <p className="text-xs text-slate-300 font-sans">
                Official Student Subscription Payment • Manual Verification
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
                const priceForG = subscriptionService.getPriceForGrade(g, pricingConfig);
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
                      {priceForG} ETB
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Payment Method Selector Tabs */}
          <div>
            <label className="block text-xs font-bold text-stone-700 font-serif-ethiopic mb-1.5">
              2. የመክፈያ መንገድ ይምረጡ (Select Payment Method):
            </label>
            <div className="grid grid-cols-2 gap-2">
              {methodButtons.map((m) => {
                const isSelected = activeMethod === m.id;
                const Icon = m.icon;
                const mCfg = methodsMap[m.id] || DEFAULT_PRICING_CONFIG.methods[m.id];
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setActiveMethod(m.id)}
                    className={`p-3 rounded-xl border flex items-center gap-2.5 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-500/15 border-emerald-700 text-emerald-950 ring-2 ring-emerald-600/30 font-bold'
                        : 'bg-white border-stone-300 text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-slate-800 text-white flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="text-left truncate">
                      <div className="text-xs font-bold font-serif-ethiopic truncate">{m.label}</div>
                      <div className="text-[10px] font-mono text-stone-600 truncate">
                        {user ? mCfg?.accountNumber || 'Official Channel' : 'Registered Students Only'}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Official Payment Instructions Box (Restricted to Registered Students) */}
          {!user ? (
            <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-4 text-center space-y-2.5 shadow-xs">
              <div className="text-xs font-bold text-amber-950 font-serif-ethiopic">
                የክፍያ ሂሳብ መረጃዎች ለተመዘገቡ ተማሪዎች ብቻ የተጠበቁ ናቸው
              </div>
              <p className="text-[11px] text-amber-800">
                የቴሌብር እና የባንክ የክፍያ መመሪያዎችን ለማየት እባክዎ መጀመሪያ ይመዝገቡ ወይም ወደ መለያዎ ይግቡ።
              </p>
              <button
                type="button"
                onClick={() => openAuthModal('login')}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg cursor-pointer transition-colors"
              >
                ይግቡ / ይመዝገቡ (Login / Register)
              </button>
            </div>
          ) : (
            <div className="bg-white border-2 border-stone-300 rounded-xl p-4 space-y-3 shadow-xs">
              <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                <span className="text-xs text-stone-600 font-bold">የሂሳብ ስም (Account Name):</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-stone-900 font-mono">
                    {currentMethodConfig.accountName}
                  </span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(currentMethodConfig.accountName, 'acc_name')}
                    className="p-1 text-stone-500 hover:text-stone-900 rounded cursor-pointer"
                  >
                    {copiedKey === 'acc_name' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                <div>
                  <span className="text-xs text-stone-600 block">
                    የሂሳብ / ስልክ ቁጥር (Account / Phone Number):
                  </span>
                  <span className="text-base font-mono font-black text-emerald-800">
                    {currentMethodConfig.accountNumber || 'በአስተዳዳሪ (SUPER_ADMIN) የሚሞላ'}
                  </span>
                </div>

                {currentMethodConfig.accountNumber && (
                  <button
                    type="button"
                    onClick={() => copyToClipboard(currentMethodConfig.accountNumber, 'acc_num')}
                    className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer transition-colors border border-emerald-300"
                  >
                    {copiedKey === 'acc_num' ? (
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
                )}
              </div>

              <div className="p-2.5 bg-stone-50 rounded-lg text-xs text-stone-800 font-serif-ethiopic flex items-start gap-2 border border-stone-200/80">
                <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <p className="leading-relaxed text-[11.5px]">
                  {currentMethodConfig.instructionsAm}
                </p>
              </div>
            </div>
          )}

          {/* Form to submit payment */}
          <form onSubmit={handleDirectActivation} className="space-y-4 pt-1">
            <div>
              <label className="block text-xs font-bold text-stone-800 font-serif-ethiopic mb-1">
                3. የክፍያ ማረጋገጫ ቁጥር ያስገቡ (Transaction ID / FT Reference):
              </label>
              <input
                type="text"
                value={transactionRef}
                onChange={(e) => setTransactionRef(e.target.value)}
                placeholder="ለምሳሌ፡ FT2421039841..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-400 bg-white text-stone-900 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#2E6B4A]"
                required
              />
            </div>

            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-300 text-red-900 text-xs rounded-xl flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-950 text-xs rounded-xl flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{successMessage}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-3 px-4 rounded-xl bg-[#2E6B4A] hover:bg-[#235338] disabled:bg-stone-400 text-white text-sm font-bold font-serif-ethiopic flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all"
            >
              {isProcessing ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>ክፍያውን በመመዝገብ ላይ...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 text-amber-300" />
                  <span>SUBMIT PAYMENT ({currentPrice} ETB)</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Modal Bottom Footer */}
        <div className="p-3.5 bg-stone-100 border-t border-stone-300 text-center text-xs text-stone-600 font-serif-ethiopic flex items-center justify-center gap-2 shrink-0">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          <span>የተጠበቀ የክፍያ ማረጋገጫ ስርዓት • Official NUR AI High School Payment</span>
        </div>
      </div>
    </div>
  );
};
