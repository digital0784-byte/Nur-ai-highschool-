import React, { useState } from 'react';
import {
  CreditCard,
  CheckCircle2,
  Clock,
  AlertTriangle,
  UploadCloud,
  Copy,
  Check,
  ShieldCheck,
  Calendar,
  Sparkles,
  ArrowRight,
  Info,
  Lock,
  ExternalLink,
  RotateCcw,
  QrCode,
  FileCheck2,
} from 'lucide-react';
import { useSubscription } from '../../context/SubscriptionContext';
import { useAuth } from '../../context/AuthContext';
import { Grade } from '../../types';
import { PaymentMethodName } from '../../types/subscription';

interface SubscriptionPaymentViewProps {
  initialGrade?: Grade;
  onPaymentSuccess?: () => void;
  onOpenFeedback?: () => void;
}

export const SubscriptionPaymentView: React.FC<SubscriptionPaymentViewProps> = ({
  initialGrade = 9,
  onPaymentSuccess,
  onOpenFeedback,
}) => {
  const { user, userProfile, openAuthModal } = useAuth();
  const {
    subscription,
    latestPayment,
    paymentsHistory,
    pricingConfig,
    accessStatus,
    remainingDays,
    isExpiringSoon,
    submitPayment,
    isOwnerSuperAdmin,
  } = useSubscription();

  const [selectedGrade, setSelectedGrade] = useState<Grade>(
    userProfile?.grade || initialGrade || 9
  );
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodName>('Telebirr');
  const [transactionRef, setTransactionRef] = useState<string>('');
  const [proofImage, setProofImage] = useState<string>('');
  const [proofFileName, setProofFileName] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Derive price for current selected grade
  const currentPrice = React.useMemo(() => {
    switch (selectedGrade) {
      case 9:
        return pricingConfig.grade9Price;
      case 10:
        return pricingConfig.grade10Price;
      case 11:
        return pricingConfig.grade11Price;
      case 12:
        return pricingConfig.grade12Price;
      default:
        return 160;
    }
  }, [selectedGrade, pricingConfig]);

  const activeMethodConfig = pricingConfig.methods[selectedMethod] || pricingConfig.methods['Telebirr'];

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit (< 4MB)
    if (file.size > 4 * 1024 * 1024) {
      setErrorMsg('የመረጡት ምስል መጠን ከ 4MB በታች መሆን አለበት (Image size must be under 4MB)');
      return;
    }

    setProofFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      setProofImage(reader.result as string);
      setErrorMsg(null);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!user) {
      openAuthModal('register');
      return;
    }

    if (!transactionRef.trim()) {
      setErrorMsg('እባክዎ ትክክለኛውን የክፍያ ማረጋገጫ / Transaction Reference ቁጥር ያስገቡ');
      return;
    }

    if (transactionRef.trim().length < 4) {
      setErrorMsg('የማረጋገጫ ቁጥሩ ቢያንስ 4 ፊደላት ወይም አሃዞች መሆን አለበት');
      return;
    }

    setIsSubmitting(true);
    try {
      await submitPayment({
        grade: selectedGrade,
        amountETB: currentPrice,
        paymentMethod: selectedMethod,
        transactionReference: transactionRef.trim(),
        proofImageUrl: proofImage || undefined,
      });

      setSuccessMsg(
        'የክፍያ ማረጋገጫዎ በተሳካ ሁኔታ ተልኳል! አስተዳዳሪው እንዳረጋገጠው ሳብስክሪፕሽንዎ ወዲያውኑ ይከፈታል።'
      );
      setTransactionRef('');
      setProofImage('');
      setProofFileName('');
      if (onPaymentSuccess) onPaymentSuccess();
    } catch (err: any) {
      console.error('Payment submission failed:', err);
      setErrorMsg(err.message || 'ክፍያውን ማስተላለፍ አልተቻለም፣ እባክዎ እንደገና ይሞክሩ።');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="subscription-payment-page" className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Top Banner / System Status */}
      <div className="bg-[#38332D] text-[#FAF6EC] p-5 sm:p-7 rounded-2xl shadow-md border border-[#4A4237] relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-44 h-44 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400/20 text-amber-300 text-xs font-bold rounded-full mb-3 border border-amber-400/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>የ 9-12 ክፍል ኑር AI ፕሪሚየም የትምህርት ምዝገባ</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-serif-ethiopic text-white">
              የኑር AI ሳብስክሪፕሽንና ክፍያ ማረጋገጫ
            </h2>
            <p className="text-xs sm:text-sm text-[#D8CEBC] mt-1 font-serif-ethiopic max-w-2xl">
              በኢትዮጵያ አዲሱ ስርዓተ-ትምህርት መሰረት የተዘጋጁ 18+ መጽሐፍት፣ AI የግል አስተማሪ፣ የፈተናዎች ሞተርና የላብራቶሪ ማስመሰያዎችን በወርሃዊ ክፍያ ያግኙ።
            </p>
          </div>

          {/* Current Status Box */}
          <div className="bg-[#2A2622] p-4 rounded-xl border border-stone-700/80 min-w-[220px]">
            <div className="text-[11px] text-stone-400 uppercase tracking-wider font-semibold">
              የአሁኑ የሳብስክሪፕሽን ሁኔታ
            </div>
            <div className="mt-1.5 flex items-center gap-2">
              {accessStatus === 'ACTIVE' && (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <div>
                    <div className="text-sm font-bold text-emerald-400 font-serif-ethiopic">
                      ክፍያ የጸደቀ (Active)
                    </div>
                    <div className="text-[11px] text-stone-300">
                      {remainingDays} ቀናት ይቀራሉ {isExpiringSoon && '⚠️ ሊያልቅ ተቃርቧል'}
                    </div>
                  </div>
                </>
              )}

              {accessStatus === 'PENDING' && (
                <>
                  <Clock className="w-5 h-5 text-amber-400 animate-pulse" />
                  <div>
                    <div className="text-sm font-bold text-amber-400 font-serif-ethiopic">
                      በማረጋገጥ ላይ (Pending)
                    </div>
                    <div className="text-[11px] text-stone-300">አስተዳዳሪው እያረጋገጠው ነው</div>
                  </div>
                </>
              )}

              {accessStatus === 'EXPIRED' && (
                <>
                  <RotateCcw className="w-5 h-5 text-rose-400" />
                  <div>
                    <div className="text-sm font-bold text-rose-400 font-serif-ethiopic">
                      ጊዜው ያለፈበት (Expired)
                    </div>
                    <div className="text-[11px] text-stone-300">ለቀጣይ ወር ያድሱ</div>
                  </div>
                </>
              )}

              {accessStatus === 'REJECTED' && (
                <>
                  <AlertTriangle className="w-5 h-5 text-rose-400" />
                  <div>
                    <div className="text-sm font-bold text-rose-400 font-serif-ethiopic">
                      ውድቅ የተደረገ (Rejected)
                    </div>
                    <div className="text-[11px] text-stone-300">እንደገና ማረጋገጫ ያስገቡ</div>
                  </div>
                </>
              )}

              {accessStatus === 'SUPER_ADMIN' && (
                <>
                  <ShieldCheck className="w-5 h-5 text-amber-400" />
                  <div>
                    <div className="text-sm font-bold text-amber-400 font-serif-ethiopic">
                      SUPER_ADMIN (ባለቤት)
                    </div>
                    <div className="text-[11px] text-stone-300">ሙሉ ያልተገደበ ፍቃድ</div>
                  </div>
                </>
              )}

              {accessStatus === 'NONE' && (
                <>
                  <Lock className="w-5 h-5 text-stone-400" />
                  <div>
                    <div className="text-sm font-bold text-stone-300 font-serif-ethiopic">
                      ያልተመዘገበ (No Subscription)
                    </div>
                    <div className="text-[11px] text-stone-400">ከታች ክፍያ ፈጽመው ይክፈቱ</div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Rejection Notification Alert if applicable */}
      {accessStatus === 'REJECTED' && latestPayment?.rejectionReason && (
        <div className="p-4 bg-rose-50 border-2 border-rose-300 rounded-xl text-rose-900 flex items-start gap-3 shadow-xs">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-bold text-sm font-serif-ethiopic">የክፍያ ማረጋገጫዎ ውድቅ ተደርጓል</h4>
            <p className="text-xs text-rose-800 mt-0.5">
              <strong>የአስተዳዳሪው ምክንያት፡</strong> {latestPayment.rejectionReason}
            </p>
            <p className="text-xs text-rose-700 mt-1">
              እባክዎ ትክክለኛውን የባንክ ማመሳከሪያ ቁጥር ወይም ደረሰኝ ከታች ባለው ፎርም እንደገና ይላኩ።
            </p>
          </div>
        </div>
      )}

      {/* Main 2-Column Grid: Pricing & Instructions on Left, Submission Form on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Grade Pricing & Instructions (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Step 1: Select Grade & Pricing Card */}
          <div className="bg-[#FAF6EC] border-[1.5px] border-[#38332D] rounded-xl p-4 sm:p-5 shadow-xs">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-6 h-6 rounded-full bg-[#38332D] text-white text-xs font-bold flex items-center justify-center">
                1
              </span>
              <h3 className="font-bold font-serif-ethiopic text-sm text-[#1E1B18]">
                ክፍል ይምረጡ (Select Grade)
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {([9, 10, 11, 12] as Grade[]).map((g) => {
                const isSelected = selectedGrade === g;
                const price =
                  g === 9
                    ? pricingConfig.grade9Price
                    : g === 10
                    ? pricingConfig.grade10Price
                    : g === 11
                    ? pricingConfig.grade11Price
                    : pricingConfig.grade12Price;

                return (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setSelectedGrade(g)}
                    className={`p-3 rounded-lg border text-left transition-all cursor-pointer relative ${
                      isSelected
                        ? 'border-[#2E6B4A] bg-[#EAF3ED] ring-2 ring-[#2E6B4A]/30 shadow-xs'
                        : 'border-[#D8CEBC] bg-white hover:bg-[#F2EDE1]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-[#1E1B18] font-serif-ethiopic">
                        ክፍል {g}
                      </span>
                      {isSelected && <Check className="w-4 h-4 text-[#2E6B4A]" />}
                    </div>
                    <div className="mt-1 flex items-baseline gap-1">
                      <span className="text-lg font-black text-[#2E6B4A]">{price}</span>
                      <span className="text-xs text-stone-600 font-bold">ETB / ወር</span>
                    </div>
                    <div className="text-[10px] text-stone-500 mt-0.5">
                      {g <= 10 ? 'አጠቃላይ የሁለተኛ ደረጃ' : 'የዩኒቨርሲቲ መግቢያ ዝግጅት'}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 p-3 bg-[#EDE6D4] rounded-lg border border-[#D5C9AC] flex items-center justify-between">
              <div>
                <span className="text-xs text-stone-600">የተመረጠው ወርሃዊ ክፍያ፡</span>
                <div className="text-base font-extrabold text-[#1E1B18] font-serif-ethiopic">
                  ክፍል {selectedGrade} — {currentPrice} ብር (ETB)
                </div>
              </div>
              <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-[11px] font-bold rounded-md border border-emerald-300">
                ለ 30 ቀናት
              </span>
            </div>
          </div>

          {/* Step 2: Payment Method Details Card */}
          <div className="bg-[#FAF6EC] border-[1.5px] border-[#38332D] rounded-xl p-4 sm:p-5 shadow-xs">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-6 h-6 rounded-full bg-[#38332D] text-white text-xs font-bold flex items-center justify-center">
                2
              </span>
              <h3 className="font-bold font-serif-ethiopic text-sm text-[#1E1B18]">
                የመክፈያ መንገድ ይምረጡ (Payment Method)
              </h3>
            </div>

            {/* Method Tabs */}
            <div className="grid grid-cols-2 gap-1.5 mb-4">
              {(
                [
                  'Telebirr',
                  'Commercial Bank of Ethiopia (CBE)',
                  'Dashen Bank',
                  'Bank of Abyssinia',
                ] as PaymentMethodName[]
              ).map((mName) => {
                const isSelected = selectedMethod === mName;
                const mCfg = pricingConfig.methods[mName];
                if (!mCfg?.isEnabled) return null;

                return (
                  <button
                    key={mName}
                    type="button"
                    onClick={() => setSelectedMethod(mName)}
                    className={`px-2.5 py-2 rounded-lg text-xs font-bold transition-all text-left border cursor-pointer ${
                      isSelected
                        ? 'bg-[#38332D] text-white border-[#38332D] shadow-xs'
                        : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-100'
                    }`}
                  >
                    <div className="truncate">{mCfg.displayName}</div>
                  </button>
                );
              })}
            </div>

            {/* Account & Instruction Display Box */}
            <div className="bg-white border border-[#D8CEBC] rounded-lg p-3.5 space-y-3">
              <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                <span className="text-xs text-stone-600 font-semibold">የሂሳብ ስም (Account Name):</span>
                <span className="text-xs font-bold text-stone-900">{activeMethodConfig.accountName}</span>
              </div>

              <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                <div>
                  <span className="text-xs text-stone-600 font-semibold block">
                    የሂሳብ / ስልክ ቁጥር (Account/Phone):
                  </span>
                  <span className="text-sm font-mono font-extrabold text-[#2E6B4A]">
                    {activeMethodConfig.accountNumber}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    copyToClipboard(activeMethodConfig.accountNumber, 'acc_num')
                  }
                  className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded border border-stone-300 flex items-center gap-1 cursor-pointer transition-colors"
                >
                  {copiedKey === 'acc_num' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>ተገልብጧል</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>ቅዳ</span>
                    </>
                  )}
                </button>
              </div>

              {activeMethodConfig.shortCodeOrTill && (
                <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                  <div>
                    <span className="text-xs text-stone-600 font-semibold block">
                      የነጋዴ / Till ቁጥር:
                    </span>
                    <span className="text-xs font-mono font-bold text-amber-800">
                      {activeMethodConfig.shortCodeOrTill}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      copyToClipboard(activeMethodConfig.shortCodeOrTill!, 'till')
                    }
                    className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded border border-stone-300 flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    {copiedKey === 'till' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>ተገልብጧል</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>ቅዳ</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Instructions text */}
              <div className="p-2.5 bg-amber-50/70 border border-amber-200 rounded text-xs text-amber-950 font-serif-ethiopic space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-amber-700" />
                  <span>የክፍያ መመሪያ፡</span>
                </div>
                <p className="leading-relaxed text-[11.5px]">{activeMethodConfig.instructionsAm}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Submission Form (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          <div className="bg-[#FAF6EC] border-[1.5px] border-[#38332D] rounded-xl p-5 sm:p-6 shadow-xs">
            <div className="flex items-center justify-between border-b border-[#D8CEBC] pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#38332D] text-white text-xs font-bold flex items-center justify-center">
                  3
                </span>
                <h3 className="font-bold font-serif-ethiopic text-sm sm:text-base text-[#1E1B18]">
                  የክፍያ ማረጋገጫ ማስገቢያ (Submit Payment)
                </h3>
              </div>
              <span className="text-xs font-bold text-[#2E6B4A] bg-[#EAF3ED] px-2.5 py-1 rounded border border-[#2E6B4A]/30">
                {currentPrice} ETB
              </span>
            </div>

            {/* Error or Success alerts */}
            {errorMsg && (
              <div className="mb-4 p-3 bg-red-50 border border-red-300 text-red-900 text-xs rounded-lg flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="mb-4 p-3.5 bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs rounded-lg flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Student Identification */}
              <div>
                <label className="block text-xs font-bold font-serif-ethiopic text-stone-700 mb-1">
                  የተማሪው ስም (Student Name):
                </label>
                <div className="px-3 py-2 bg-stone-100 border border-stone-300 rounded-lg text-xs font-bold text-stone-800 flex items-center justify-between">
                  <span>{userProfile?.displayName || user?.email || 'እባክዎ መጀመሪያ ይግቡ'}</span>
                  <span className="text-[11px] font-normal text-stone-500">
                    {user?.email || 'ያልገባ'}
                  </span>
                </div>
                {!user && (
                  <button
                    type="button"
                    onClick={() => openAuthModal('login')}
                    className="mt-1 text-xs text-blue-700 hover:underline font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <span>ክፍያውን ከማስገባትዎ በፊት እባክዎ ይግቡ ወይም ይመዝገቡ</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Selected Plan Details Row */}
              <div className="grid grid-cols-2 gap-2 text-xs bg-[#EDE5D2] p-2.5 rounded-lg border border-[#D5C9AC]">
                <div>
                  <span className="text-stone-500 block text-[11px]">የተመረጠ ክፍል፡</span>
                  <span className="font-bold text-stone-900">ክፍል {selectedGrade}</span>
                </div>
                <div>
                  <span className="text-stone-500 block text-[11px]">የመክፈያ መንገድ፡</span>
                  <span className="font-bold text-stone-900">{selectedMethod}</span>
                </div>
              </div>

              {/* Transaction Reference Number Field (Crucial!) */}
              <div>
                <label className="block text-xs font-bold font-serif-ethiopic text-stone-800 mb-1">
                  የክፍያ ማረጋገጫ ቁጥር / Transaction ID / Reference (ግዴታ) *
                </label>
                <input
                  type="text"
                  required
                  value={transactionRef}
                  onChange={(e) => setTransactionRef(e.target.value)}
                  placeholder="ለምሳሌ፡ FT2409849201 ወይም Telebirr TXN: TB901923"
                  className="w-full px-3.5 py-2.5 bg-white border border-[#38332D]/50 rounded-lg text-xs sm:text-sm font-mono focus:outline-none focus:border-[#2E6B4A] focus:ring-1 focus:ring-[#2E6B4A]"
                />
                <p className="text-[11px] text-stone-500 mt-1">
                  ክፍያ ሲፈጽሙ በባንክዎ ወይም በቴሌብር የደረሰዎትን የማረጋገጫ ኮድ እዚህ ይጻፉ።
                </p>
              </div>

              {/* Payment Proof / Receipt Screenshot Upload */}
              <div>
                <label className="block text-xs font-bold font-serif-ethiopic text-stone-800 mb-1">
                  የደረሰኝ ፎቶ ወይም ስክሪንሾት (Receipt / Screenshot Upload) - አማራጭ
                </label>
                <div className="border-2 border-dashed border-stone-300 rounded-lg p-3 sm:p-4 text-center hover:border-stone-400 bg-white transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    id="receipt-file-input"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <label
                    htmlFor="receipt-file-input"
                    className="cursor-pointer flex flex-col items-center justify-center gap-1.5"
                  >
                    <UploadCloud className="w-7 h-7 text-stone-400" />
                    <span className="text-xs font-bold text-stone-700">
                      {proofFileName ? proofFileName : 'የደረሰኙን ምስል ይጫኑ ወይም ይጎትቱ'}
                    </span>
                    <span className="text-[10px] text-stone-400">PNG, JPG እስከ 4MB</span>
                  </label>
                </div>

                {proofImage && (
                  <div className="mt-2 flex items-center gap-2 p-2 bg-stone-100 rounded-lg border border-stone-200">
                    <img
                      src={proofImage}
                      alt="Proof Preview"
                      className="w-12 h-12 object-cover rounded border"
                    />
                    <div className="flex-1 text-xs truncate">
                      <span className="font-bold text-stone-800 block truncate">
                        {proofFileName || 'የተመረጠ ደረሰኝ'}
                      </span>
                      <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                        <Check className="w-3 h-3" /> ለመላክ ተዘጋጅቷል
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setProofImage('');
                        setProofFileName('');
                      }}
                      className="text-xs text-red-600 hover:text-red-800 font-bold px-2 py-1"
                    >
                      ሰርዝ
                    </button>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-bold font-serif-ethiopic text-white transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer ${
                  isSubmitting
                    ? 'bg-stone-500 cursor-not-allowed'
                    : 'bg-[#2E6B4A] hover:bg-[#24543a] active:scale-[0.99]'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>በማስገባት ላይ...</span>
                  </>
                ) : (
                  <>
                    <FileCheck2 className="w-4 h-4" />
                    <span>ክፍያውን አረጋግጥና አስገባ (Submit Payment - {currentPrice} ETB)</span>
                  </>
                )}
              </button>

              <div className="text-center pt-1">
                <p className="text-[11px] text-stone-500 flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-stone-400" />
                  <span>ክፍያዎ በሲስተም ባለቤቱ ብቻ በጥንቃቄ ተገምግሞ ይጸድቃል።</span>
                </p>
              </div>
            </form>
          </div>

          {/* User Feedback Callout Button (Addressing User Request) */}
          {onOpenFeedback && (
            <div className="p-3.5 bg-[#EDE6D4] border border-[#D5C9AC] rounded-xl flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-stone-900 font-serif-ethiopic">
                  ስለ ክፍያው ወይም ስለ ሲስተሙ አስተያዬት አለዎት?
                </h4>
                <p className="text-[11px] text-stone-600">
                  አስተያዬትዎን ወይም ያጋጠመዎትን ማንኛውንም ችግር ለሲስተም ባለቤቱ በቀጥታ ያጋሩ።
                </p>
              </div>
              <button
                type="button"
                onClick={onOpenFeedback}
                className="px-3 py-1.5 bg-[#38332D] text-white hover:bg-black rounded-lg text-xs font-bold transition-colors cursor-pointer shrink-0"
              >
                አስተያዬት ስጥ
              </button>
            </div>
          )}
        </div>
      </div>

      {/* History of Past Payments & Subscriptions */}
      {paymentsHistory.length > 0 && (
        <div className="bg-[#FAF6EC] border-[1.5px] border-[#38332D] rounded-xl p-4 sm:p-5 shadow-xs">
          <h3 className="font-bold font-serif-ethiopic text-sm text-[#1E1B18] mb-3 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-stone-600" />
            <span>የቀደሙ ክፍያዎች ታሪክ (Payment History)</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-stone-300 text-stone-600 bg-stone-100/50">
                  <th className="p-2 font-semibold">ቀን (Date)</th>
                  <th className="p-2 font-semibold">ክፍል (Grade)</th>
                  <th className="p-2 font-semibold">መጠን (Amount)</th>
                  <th className="p-2 font-semibold">መንገድ (Method)</th>
                  <th className="p-2 font-semibold">ማመሳከሪያ (Ref ID)</th>
                  <th className="p-2 font-semibold">ሁኔታ (Status)</th>
                </tr>
              </thead>
              <tbody>
                {paymentsHistory.map((p) => (
                  <tr key={p.paymentId} className="border-b border-stone-200 hover:bg-stone-50">
                    <td className="p-2 text-stone-700">
                      {new Date(p.submittedAt).toLocaleDateString('am-ET')}
                    </td>
                    <td className="p-2 font-bold text-stone-800">ክፍል {p.grade}</td>
                    <td className="p-2 font-bold text-[#2E6B4A]">{p.amountETB} ETB</td>
                    <td className="p-2 text-stone-700">{p.paymentMethod}</td>
                    <td className="p-2 font-mono text-[11px] text-stone-600">
                      {p.transactionReference}
                    </td>
                    <td className="p-2">
                      {p.status === 'APPROVED' && (
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded text-[11px] border border-emerald-300">
                          የጸደቀ
                        </span>
                      )}
                      {p.status === 'PENDING' && (
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-800 font-bold rounded text-[11px] border border-amber-300">
                          በማረጋገጥ ላይ
                        </span>
                      )}
                      {p.status === 'REJECTED' && (
                        <span className="px-2 py-0.5 bg-rose-100 text-rose-800 font-bold rounded text-[11px] border border-rose-300">
                          ውድቅ የተደረገ
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
