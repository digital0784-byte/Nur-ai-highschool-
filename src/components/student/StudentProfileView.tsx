import React, { useState } from 'react';
import {
  User,
  CreditCard,
  CheckCircle2,
  Calendar,
  ShieldCheck,
  Languages,
  Moon,
  Sun,
  HardDrive,
  LogOut,
  Mail,
  School,
  Sparkles,
  ArrowRight,
  Zap,
} from 'lucide-react';
import { GradeLevel } from '../../types/curriculumEngine';
import { LanguageCode } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useSubscription } from '../../context/SubscriptionContext';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

interface StudentProfileViewProps {
  grade: GradeLevel;
  language: LanguageCode;
  darkMode: boolean;
  lowDataMode: boolean;
  onSelectGrade: (g: GradeLevel) => void;
  onSelectLanguage: (l: LanguageCode) => void;
  onToggleDarkMode: () => void;
  onToggleLowDataMode: (enabled: boolean) => void;
  onOpenPaymentModal?: () => void;
}

export const StudentProfileView: React.FC<StudentProfileViewProps> = ({
  grade,
  language,
  darkMode,
  lowDataMode,
  onSelectGrade,
  onSelectLanguage,
  onToggleDarkMode,
  onToggleLowDataMode,
  onOpenPaymentModal,
}) => {
  const { user, userProfile, logout } = useAuth();
  const { subscription, hasLearningAccess } = useSubscription();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleConfirmLogout = async () => {
    setIsLoggingOut(true);
    try {
      if (logout) {
        await logout();
      }
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setIsLoggingOut(false);
      setShowLogoutModal(false);
    }
  };

  const studentName = userProfile?.displayName || (userProfile as any)?.name || 'Abebe Bikila';
  const studentEmail = userProfile?.email || 'student@nur-ai.edu.et';
  const schoolName = (userProfile as any)?.schoolName || 'Addis Ababa Secondary High School';

  const premiumFeatures = [
    language === 'am' ? 'የሁሉም የሁለተኛ ደረጃ መጽሐፍት ሙሉ ተደራሽነት' : 'Full access to all FDRE curriculum textbooks',
    language === 'am' ? 'ያልተገደበ የኑር AI የግል አስተማሪ ጥያቄዎች (Text, Voice, Photo)' : 'Unlimited NUR AI Socratic Tutor queries',
    language === 'am' ? 'የዩኒቨርሲቲ መግቢያ ፈተና (Entrance Exam) ሞተር' : 'National University Entrance Exam archive',
    language === 'am' ? 'ከመስመር ውጭ (Offline) የማውረድና የማንበብ ችሎታ' : 'Offline caching for low-connectivity study',
    language === 'am' ? 'የተሟሉ የቪዲዮና የላብራቶሪ ማብራሪያዎች' : 'Interactive video labs and visual simulations',
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* 1. Header Profile Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-xs flex flex-col sm:flex-row items-center sm:items-start justify-between gap-5">
        <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          <div className="w-20 h-20 rounded-3xl bg-emerald-600 text-white flex items-center justify-center font-black text-2xl shadow-sm">
            {studentName.charAt(0)}
          </div>
          <div>
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-stone-900 font-serif-ethiopic">
                {studentName}
              </h2>
              <Badge variant="success" size="xs">ክፍል {grade}</Badge>
            </div>
            <p className="text-xs text-stone-500 mt-1 flex items-center justify-center sm:justify-start gap-1.5">
              <Mail className="w-3.5 h-3.5" />
              {studentEmail}
            </p>
            <p className="text-xs text-stone-500 mt-0.5 flex items-center justify-center sm:justify-start gap-1.5">
              <School className="w-3.5 h-3.5" />
              {schoolName}
            </p>
          </div>
        </div>

        {logout && (
          <Button
            variant="outline"
            size="sm"
            className="border-rose-200 text-rose-700 hover:bg-rose-50 hover:border-rose-300"
            leftIcon={<LogOut className="w-3.5 h-3.5 text-rose-600" />}
            onClick={() => setShowLogoutModal(true)}
          >
            {language === 'am' ? 'ከመለያ ውጣ (Logout)' : 'Log Out'}
          </Button>
        )}
      </div>

      {/* 2. SUBSCRIPTION & BILLING CARD (Main Requirement) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900 font-serif-ethiopic">
                {language === 'am' ? 'የሳብስክሪፕሽንና ክፍያ ሁኔታ (Subscription Status)' : 'Subscription & Plan Details'}
              </h3>
              <p className="text-xs text-stone-500">
                {language === 'am' ? 'የጥቅል አይነትና የክፍያ ማረጋገጫ' : 'Active tier and entitlement status'}
              </p>
            </div>
          </div>

          <Badge variant={hasLearningAccess ? 'success' : 'warning'} size="md" dot pulse>
            {hasLearningAccess
              ? language === 'am' ? 'ንቁ (Active)' : 'Active Plan'
              : language === 'am' ? 'የሙከራ ጊዜ' : 'Free Trial'}
          </Badge>
        </div>

        {/* Subscription Meta Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-2xl bg-stone-50 border border-stone-100">
          <div>
            <span className="text-[11px] uppercase tracking-wider font-semibold text-stone-400 block mb-0.5">
              {language === 'am' ? 'የአሁን ክፍል (Grade)' : 'Current Grade'}
            </span>
            <span className="text-sm font-bold text-stone-900">ክፍል {grade} (Grade {grade})</span>
          </div>

          <div>
            <span className="text-[11px] uppercase tracking-wider font-semibold text-stone-400 block mb-0.5">
              {language === 'am' ? 'የጥቅል ስም (Plan)' : 'Plan Tier'}
            </span>
            <span className="text-sm font-bold text-stone-900 font-mono">
              {subscription?.plan || (subscription as any)?.planId || 'Annual High School Pass'}
            </span>
          </div>

          <div>
            <span className="text-[11px] uppercase tracking-wider font-semibold text-stone-400 block mb-0.5">
              {language === 'am' ? 'የሚያበቃበት ቀን (Expiry)' : 'Expiry Date'}
            </span>
            <span className="text-sm font-bold text-stone-900 font-mono">
              2019 ዓ.ም (July 2027)
            </span>
          </div>

          <div>
            <span className="text-[11px] uppercase tracking-wider font-semibold text-stone-400 block mb-0.5">
              {language === 'am' ? 'የክፍያ ሁኔታ (Payment)' : 'Payment Status'}
            </span>
            <span className="text-sm font-bold text-emerald-700 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {language === 'am' ? 'የተረጋገጠ (Verified)' : 'Verified (CBE/Telebirr)'}
            </span>
          </div>
        </div>

        {/* Premium Features Checklist */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">
            {language === 'am' ? 'የተካተቱ ፕሪሚየም አገልግሎቶች (Included Features)' : 'Included Premium Features'}
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {premiumFeatures.map((feat, idx) => (
              <div key={idx} className="flex items-center gap-2.5 text-xs text-stone-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{feat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Renewal / Upgrade Button */}
        <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
          <span className="text-xs text-stone-500">
            {language === 'am' ? 'የክፍያ ደረሰኝ ወይም እቅድ ለማደስ:' : 'To extend or renew subscription:'}
          </span>
          <Button
            variant="primary"
            size="sm"
            onClick={onOpenPaymentModal}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            {language === 'am' ? 'ክፍያ ፈጽም / አድስ' : 'Renew / Make Payment'}
          </Button>
        </div>
      </div>

      {/* 3. SETTINGS: GRADE, LANGUAGE, DATA PREFERENCES */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-xs space-y-6">
        <h3 className="text-base font-bold text-stone-900 font-serif-ethiopic pb-3 border-b border-stone-100">
          {language === 'am' ? 'የትምህርትና የመተግበሪያ ቅንብሮች' : 'App & Learning Preferences'}
        </h3>

        {/* Grade Selection */}
        <div>
          <label className="block text-xs font-bold text-stone-700 mb-2">
            {language === 'am' ? 'የትምህርት ክፍልዎን ይምረጡ (Grade Level)' : 'Change Grade Level'}
          </label>
          <div className="grid grid-cols-4 gap-2">
            {([9, 10, 11, 12] as GradeLevel[]).map((g) => (
              <button
                key={g}
                onClick={() => onSelectGrade(g)}
                className={`py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  grade === g
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-stone-50 text-stone-700 border border-stone-200 hover:bg-stone-100'
                }`}
              >
                ክፍል {g} (Grade {g})
              </button>
            ))}
          </div>
        </div>

        {/* Language Selection */}
        <div>
          <label className="block text-xs font-bold text-stone-700 mb-2">
            {language === 'am' ? 'የመተግበሪያ ቋንቋ (Preferred Language)' : 'Preferred Language'}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { code: 'am', label: 'አማርኛ' },
              { code: 'en', label: 'English' },
              { code: 'om', label: 'Afaan Oromoo' },
              { code: 'ti', label: 'ትግርኛ' },
            ].map((l) => (
              <button
                key={l.code}
                onClick={() => onSelectLanguage(l.code as LanguageCode)}
                className={`py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  language === l.code
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-stone-50 text-stone-700 border border-stone-200 hover:bg-stone-100'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>

        {/* Low Data Mode Toggle */}
        <div className="flex items-center justify-between pt-4 border-t border-stone-100">
          <div>
            <span className="text-xs font-bold text-stone-900 block">
              {language === 'am' ? 'ዳታ ቆጣቢ ሁነታ (Low-Data Mode)' : 'Low-Data Mode'}
            </span>
            <span className="text-[11px] text-stone-500">
              {language === 'am' ? 'የኢንተርኔት ፍጆታን በ 70% ይቀንሳል' : 'Compresses images and saves mobile data'}
            </span>
          </div>
          <button
            onClick={() => onToggleLowDataMode(!lowDataMode)}
            className={`w-12 h-6 rounded-full transition-colors p-1 cursor-pointer flex items-center ${
              lowDataMode ? 'bg-emerald-600 justify-end' : 'bg-stone-200 justify-start'
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-white shadow-xs" />
          </button>
        </div>
      </div>

      {/* 4. ACCOUNT SECURITY & LOGOUT CARD */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-xs space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <LogOut className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900 font-serif-ethiopic">
                {language === 'am' ? 'የመለያ ደህንነትና መውጫ (Account & Sign Out)' : 'Account Security & Sign Out'}
              </h3>
              <p className="text-xs text-stone-500">
                {language === 'am' ? 'ከመተግበሪያው በደህንነት ለመውጣት' : 'Manage your active session and sign out'}
              </p>
            </div>
          </div>
          <Badge variant="neutral" size="sm">
            {language === 'am' ? 'ደህንነቱ የተጠበቀ' : 'Secured'}
          </Badge>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <span className="text-slate-500 font-medium">
              {language === 'am' ? 'የተመዘገበ ኢሜይል / ስልክ ቁጥር:' : 'Account Identifier:'}
            </span>
            <span className="font-bold text-slate-800 font-mono">{studentEmail}</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <span className="text-slate-500 font-medium">
              {language === 'am' ? 'የትምህርት ደረጃ (Grade):' : 'Enrolled Grade:'}
            </span>
            <span className="font-bold text-emerald-800 font-mono">ክፍል {grade} (2019 E.C.)</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <span className="text-slate-500 font-medium">
              {language === 'am' ? 'የደመና ምትኬ ሁኔታ (Cloud Sync):' : 'Cloud Progress Sync:'}
            </span>
            <span className="font-bold text-emerald-700 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              {language === 'am' ? 'ሁሉም መረጃዎች በደመናው ላይ ተመሳስለዋል' : 'Up to date & safely synced'}
            </span>
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500 leading-relaxed max-w-md">
            {language === 'am'
              ? 'ሲወጡ የትምህርት ታሪክዎ፣ የፈተና ውጤቶችዎና የከፈሉት ሳብስክሪፕሽን ሙሉ በሙሉ ተቀምጦ ይቆያል።'
              : 'Signing out keeps your learning history, quiz scores, and active subscription fully intact.'}
          </p>
          <Button
            variant="danger"
            size="md"
            leftIcon={<LogOut className="w-4 h-4" />}
            onClick={() => setShowLogoutModal(true)}
            className="w-full sm:w-auto shrink-0 shadow-sm"
          >
            {language === 'am' ? 'ከመለያ ውጣ (Sign Out)' : 'Sign Out of Account'}
          </Button>
        </div>
      </div>

      {/* CONFIRMATION MODAL */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-stone-200 space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <LogOut className="w-6 h-6 text-rose-600" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 font-serif-ethiopic">
                  {language === 'am' ? 'ከመለያዎ መውጣት ይፈልጋሉ?' : 'Confirm Sign Out'}
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {language === 'am'
                    ? 'የተማሩት ትምህርት፣ የፈተና ውጤቶችና ማስታወሻዎችዎ በሙሉ በደመናው ላይ ተቀምጠው ይቆያሉ።'
                    : 'Your progress and study streak are saved in the cloud. You can log back in at any time.'}
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
              <div className="min-w-0 pr-2">
                <p className="font-bold text-slate-800 truncate font-serif-ethiopic">{studentName}</p>
                <p className="text-slate-500 text-[11px] font-mono mt-0.5 truncate">{studentEmail}</p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px] shrink-0 font-mono">
                {language === 'am' ? `ክፍል ${grade}` : `Grade ${grade}`}
              </span>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                disabled={isLoggingOut}
                className="flex-1 py-3 px-4 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-bold transition-all cursor-pointer"
              >
                {language === 'am' ? 'ይቅር፣ ተመለስ' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleConfirmLogout}
                disabled={isLoggingOut}
                className="flex-1 py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black transition-all shadow-md shadow-rose-600/20 cursor-pointer flex items-center justify-center gap-2"
              >
                {isLoggingOut ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <LogOut className="w-4 h-4" />
                )}
                <span>{language === 'am' ? 'አዎ፣ ውጣ' : 'Log Out'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
