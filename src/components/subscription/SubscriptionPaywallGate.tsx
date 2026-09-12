import React from 'react';
import {
  Lock,
  Clock,
  AlertTriangle,
  RotateCcw,
  CreditCard,
  MessageSquare,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  BookOpen,
  GraduationCap,
} from 'lucide-react';
import { useSubscription } from '../../context/SubscriptionContext';
import { useAuth } from '../../context/AuthContext';

interface SubscriptionPaywallGateProps {
  children: React.ReactNode;
  featureTitle?: string;
  onNavigateToPayment: () => void;
  onOpenFeedback: () => void;
}

export const SubscriptionPaywallGate: React.FC<SubscriptionPaywallGateProps> = ({
  children,
  featureTitle = 'ይህ የትምህርት ክፍል',
  onNavigateToPayment,
  onOpenFeedback,
}) => {
  const { user, openAuthModal } = useAuth();
  const {
    hasLearningAccess,
    accessStatus,
    latestPayment,
    subscription,
    remainingDays,
  } = useSubscription();

  // If user has active subscription or is Super Admin, render children directly!
  if (hasLearningAccess) {
    return <>{children}</>;
  }

  // If not logged in
  if (!user) {
    return (
      <div className="p-6 sm:p-10 max-w-2xl mx-auto text-center bg-[#FAF6EC] border-[2px] border-[#38332D] rounded-2xl shadow-md my-8 space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-[#38332D] text-[#EBD9B4] flex items-center justify-center mx-auto shadow-md">
          <GraduationCap className="w-9 h-9" />
        </div>
        <div>
          <span className="px-3 py-1 bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold rounded-full uppercase">
            የተማሪዎች ምዝገባ
          </span>
          <h3 className="text-xl sm:text-2xl font-bold font-serif-ethiopic text-[#1E1B18] mt-2">
            ወደ ኑር AI የሁለተኛ ደረጃ ትምህርት ቤት ይግቡ
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 mt-2 font-serif-ethiopic max-w-md mx-auto">
            {featureTitle}ን ለመጠቀም እባክዎ መጀመሪያ አካውንት ይፍጠሩ ወይም ይግቡ፤ በመቀጠል ወርሃዊ ሳብስክሪፕሽን በማግበር ትምህርትዎን ይጀምሩ።
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => openAuthModal('register')}
            className="w-full sm:w-auto px-6 py-2.5 bg-[#2E6B4A] hover:bg-[#235338] text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2"
          >
            <span>አዲስ ተማሪ ይመዝገቡ (Register)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => openAuthModal('login')}
            className="w-full sm:w-auto px-6 py-2.5 bg-[#38332D] hover:bg-black text-[#FAF6EC] font-bold text-xs sm:text-sm rounded-xl transition-all shadow-xs cursor-pointer"
          >
            መግቢያ (Sign In)
          </button>
        </div>
      </div>
    );
  }

  // 1. PENDING VERIFICATION SCREEN
  if (accessStatus === 'PENDING') {
    return (
      <div className="p-6 sm:p-10 max-w-2xl mx-auto bg-[#FAF6EC] border-[2px] border-amber-600/70 rounded-2xl shadow-md my-8 text-center space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto border border-amber-300 animate-pulse">
          <Clock className="w-9 h-9" />
        </div>

        <div>
          <span className="px-3 py-1 bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold rounded-full">
            በማረጋገጥ ላይ (Pending Verification)
          </span>
          <h3 className="text-xl sm:text-2xl font-bold font-serif-ethiopic text-[#1E1B18] mt-2.5">
            የክፍያ ማረጋገጫዎ በአስተዳዳሪው እየተገመገመ ነው
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 mt-2 font-serif-ethiopic max-w-lg mx-auto leading-relaxed">
            ያስገቡት የክፍያ ማመሳከሪያ ቁጥር ለሲስተም ባለቤቱ ደርሷል። ማረጋገጫው እንደተጠናቀቀ የትምህርት ክፍሎች፣ AI የግል አስተማሪ እና ፈተናዎች ወዲያውኑ ክፍት ይሆናሉ።
          </p>
        </div>

        {latestPayment && (
          <div className="bg-white border border-amber-200 rounded-xl p-4 text-left max-w-md mx-auto space-y-2 text-xs">
            <div className="flex justify-between border-b border-stone-100 pb-1.5">
              <span className="text-stone-500">የተማሪ ስም፡</span>
              <span className="font-bold text-stone-900">{latestPayment.studentName}</span>
            </div>
            <div className="flex justify-between border-b border-stone-100 pb-1.5">
              <span className="text-stone-500">ክፍል፡</span>
              <span className="font-bold text-stone-900">ክፍል {latestPayment.grade}</span>
            </div>
            <div className="flex justify-between border-b border-stone-100 pb-1.5">
              <span className="text-stone-500">የተከፈለው መጠን፡</span>
              <span className="font-extrabold text-[#2E6B4A]">{latestPayment.amountETB} ETB</span>
            </div>
            <div className="flex justify-between border-b border-stone-100 pb-1.5">
              <span className="text-stone-500">የመክፈያ መንገድ፡</span>
              <span className="font-bold text-stone-900">{latestPayment.paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">የማረጋገጫ ቁጥር (Ref):</span>
              <span className="font-mono font-bold text-amber-800">
                {latestPayment.transactionReference}
              </span>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={onNavigateToPayment}
            className="w-full sm:w-auto px-5 py-2.5 bg-[#38332D] text-white hover:bg-black text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <CreditCard className="w-4 h-4" />
            <span>የክፍያ ዝርዝር ይመልከቱ (View Payment)</span>
          </button>
          <button
            onClick={onOpenFeedback}
            className="w-full sm:w-auto px-5 py-2.5 bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            <span>አስተዳዳሪውን ያነጋግሩ (Support / Feedback)</span>
          </button>
        </div>
      </div>
    );
  }

  // 2. REJECTED SCREEN
  if (accessStatus === 'REJECTED') {
    return (
      <div className="p-6 sm:p-10 max-w-2xl mx-auto bg-[#FAF6EC] border-[2px] border-rose-600/70 rounded-2xl shadow-md my-8 text-center space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center mx-auto border border-rose-300">
          <AlertTriangle className="w-9 h-9" />
        </div>

        <div>
          <span className="px-3 py-1 bg-rose-100 text-rose-900 border border-rose-300 text-xs font-bold rounded-full">
            ክፍያ ውድቅ ተደርጓል (Payment Rejected)
          </span>
          <h3 className="text-xl sm:text-2xl font-bold font-serif-ethiopic text-[#1E1B18] mt-2.5">
            የክፍያ ማረጋገጫዎ ተቀባይነት አላገኘም
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 mt-2 font-serif-ethiopic max-w-md mx-auto">
            የተላከው የክፍያ ማረጋገጫ በትክክል ስላልተረጋገጠ ወይም መረጃው ስላልተሟላ ውድቅ ተደርጓል።
          </p>
        </div>

        {latestPayment?.rejectionReason && (
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-left max-w-md mx-auto text-xs text-rose-950">
            <span className="font-bold block text-rose-800 mb-1">የውድቅ የተደረገበት ምክንያት፡</span>
            <p className="leading-relaxed">{latestPayment.rejectionReason}</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={onNavigateToPayment}
            className="w-full sm:w-auto px-6 py-2.5 bg-[#2E6B4A] hover:bg-[#235338] text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>ትክክለኛውን ክፍያ እንደገና ያስገቡ (Resubmit Payment)</span>
          </button>
          <button
            onClick={onOpenFeedback}
            className="w-full sm:w-auto px-5 py-2.5 bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            <span>አስተያየት ወይም ቅሬታ ያስገቡ</span>
          </button>
        </div>
      </div>
    );
  }

  // 3. EXPIRED SCREEN
  if (accessStatus === 'EXPIRED') {
    return (
      <div className="p-6 sm:p-10 max-w-2xl mx-auto bg-[#FAF6EC] border-[2px] border-amber-700/70 rounded-2xl shadow-md my-8 text-center space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto border border-amber-300">
          <RotateCcw className="w-9 h-9" />
        </div>

        <div>
          <span className="px-3 py-1 bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold rounded-full">
            የሳብስክሪፕሽን ጊዜው አልቋል (Subscription Expired)
          </span>
          <h3 className="text-xl sm:text-2xl font-bold font-serif-ethiopic text-[#1E1B18] mt-2.5">
            የወርሃዊ ትምህርት አገልግሎት ጊዜዎ ተጠናቋል
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 mt-2 font-serif-ethiopic max-w-md mx-auto">
            የትምህርት ጉዞዎን፣ የፈተና ውጤቶችዎን እና የ AI የግል አስተማሪዎን ሳያቋርጡ ለመቀጠል እባክዎ ለቀጣዩ ወር ያድሱ።
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={onNavigateToPayment}
            className="w-full sm:w-auto px-6 py-2.5 bg-[#2E6B4A] hover:bg-[#235338] text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2"
          >
            <CreditCard className="w-4 h-4" />
            <span>አሁን ያድሱ (Renew Monthly Subscription)</span>
          </button>
        </div>
      </div>
    );
  }

  // 4. SUSPENDED SCREEN
  if (accessStatus === 'SUSPENDED') {
    return (
      <div className="p-6 sm:p-10 max-w-2xl mx-auto bg-[#FAF6EC] border-[2px] border-red-700 rounded-2xl shadow-md my-8 text-center space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-red-100 text-red-700 flex items-center justify-center mx-auto border border-red-300">
          <ShieldAlert className="w-9 h-9" />
        </div>

        <div>
          <span className="px-3 py-1 bg-red-100 text-red-900 border border-red-300 text-xs font-bold rounded-full">
            አካውንትዎ ታግዷል (Suspended)
          </span>
          <h3 className="text-xl sm:text-2xl font-bold font-serif-ethiopic text-[#1E1B18] mt-2.5">
            የሳብስክሪፕሽን አገልግሎትዎ ለጊዜው ታግዷል
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 mt-2 font-serif-ethiopic max-w-md mx-auto">
            ይህ አካውንት በአስተዳዳሪው ውሳኔ ታግዷል። እባክዎ ለበለጠ መረጃ የሲስተም ባለቤቱን ያነጋግሩ።
          </p>
        </div>

        <div className="pt-2">
          <button
            onClick={onOpenFeedback}
            className="px-6 py-2.5 bg-[#38332D] hover:bg-black text-white text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 mx-auto"
          >
            <MessageSquare className="w-4 h-4" />
            <span>አስተዳዳሪውን ያነጋግሩ (Contact Admin)</span>
          </button>
        </div>
      </div>
    );
  }

  // 5. DEFAULT NO SUBSCRIPTION SCREEN
  return (
    <div className="p-6 sm:p-10 max-w-2xl mx-auto bg-[#FAF6EC] border-[2px] border-[#38332D] rounded-2xl shadow-md my-8 text-center space-y-5">
      <div className="w-16 h-16 rounded-2xl bg-[#38332D] text-[#EBD9B4] flex items-center justify-center mx-auto shadow-md">
        <Lock className="w-9 h-9" />
      </div>

      <div>
        <span className="px-3 py-1 bg-[#EAE2CE] text-[#4A4237] border border-[#D5C9AC] text-xs font-bold rounded-full">
          የተቆለፈ የትምህርት ክፍል (Subscription Required)
        </span>
        <h3 className="text-xl sm:text-2xl font-bold font-serif-ethiopic text-[#1E1B18] mt-2.5">
          {featureTitle}ን ለመጠቀም ወርሃዊ ሳብስክሪፕሽን ያስፈልጋል
        </h3>
        <p className="text-xs sm:text-sm text-stone-600 mt-2 font-serif-ethiopic max-w-lg mx-auto leading-relaxed">
          የክፍል 9 (160 ብር)፣ ክፍል 10 (180 ብር)፣ ክፍል 11 (200 ብር)፣ ክፍል 12 (200 ብር) ወርሃዊ ክፍያ በመክፈል ሁሉንም የኑር AI የሁለተኛ ደረጃ ትምህርቶች፣ ፈተናዎችና AI ረዳት ይክፈቱ።
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <button
          onClick={onNavigateToPayment}
          className="w-full sm:w-auto px-6 py-3 bg-[#2E6B4A] hover:bg-[#235338] text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
        >
          <CreditCard className="w-4 h-4" />
          <span>ወደ ክፍያና ምዝገባ ገጽ ሂድ (Go to Subscription)</span>
        </button>
        <button
          onClick={onOpenFeedback}
          className="w-full sm:w-auto px-5 py-3 bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <MessageSquare className="w-4 h-4" />
          <span>አስተያየት ወይም ጥያቄ ይጠይቁ</span>
        </button>
      </div>
    </div>
  );
};
