import React, { useState } from 'react';
import {
  Sparkles,
  BookOpen,
  GraduationCap,
  Camera,
  Layers,
  Globe,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  LogIn,
  UserPlus,
  CreditCard,
  ShieldCheck,
  Phone,
  Mail,
  Zap,
  Check,
  X,
  Compass,
  FileText,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  HelpCircle,
  WifiOff,
} from 'lucide-react';
import { Grade, LanguageCode, SubjectStream } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useSubscription } from '../../context/SubscriptionContext';

interface FrontendGatewayModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedGrade: Grade;
  onSelectGrade: (grade: Grade) => void;
  selectedStream: SubjectStream | 'all';
  onSelectStream: (stream: SubjectStream | 'all') => void;
  onDirectPaymentOpen?: () => void;
}

export const FrontendGatewayModal: React.FC<FrontendGatewayModalProps> = ({
  isOpen,
  onClose,
  selectedGrade,
  onSelectGrade,
  selectedStream,
  onSelectStream,
  onDirectPaymentOpen,
}) => {
  const { language, setLanguage, languages, t, isRtl } = useLanguage();
  const { user, userProfile, login, register } = useAuth();
  const { isOwnerSuperAdmin, submitPayment } = useSubscription();

  // Current Screen State: 1 = Welcome, 2 = Select Language & Grade, 3 = Payment, Login, Registration & Others
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Sub-tabs on Screen 3: 'login' | 'register' | 'payment' | 'others'
  const [screen3Tab, setScreen3Tab] = useState<'login' | 'register' | 'payment' | 'others'>('login');

  // Form states for login / register on Screen 3
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState<string | null>(null);

  // Payment form states
  const [paymentTxRef, setPaymentTxRef] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'telebirr' | 'cbe'>('telebirr');
  const [paymentSubmitting, setPaymentSubmitting] = useState(false);
  const [paymentFeedback, setPaymentFeedback] = useState<string | null>(null);

  if (!isOpen) return null;

  // Handle Login on Screen 3
  const handleAuthLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setAuthError(null);
    setAuthSuccess(null);
    if (!authEmail.trim() || !authPassword) {
      setAuthError(
        language === 'en'
          ? 'Please enter email/phone and password.'
          : 'እባክዎ ኢሜይል ወይም ስልክ እና የይለፍ ቃል ያስገቡ።'
      );
      return;
    }

    setAuthLoading(true);
    try {
      const emailToUse = authEmail.includes('@')
        ? authEmail.trim()
        : `${authEmail.replace(/[^0-9]/g, '')}@student.nur.et`;
      await login(emailToUse, authPassword);
      setAuthSuccess(
        language === 'en'
          ? 'Logged in successfully! You can now enter the system.'
          : 'በተሳካ ሁኔታ ገብተዋል! አሁን ወደ ሲስተሙ መግባት ይችላሉ።'
      );
    } catch (err: any) {
      let msg =
        err.message ||
        (language === 'en'
          ? 'Login failed. Please check your credentials.'
          : 'መግባት አልተቻለም። እባክዎ መረጃዎን ያረጋግጡ።');
      if (err.code === 'auth/api-key-not-valid' || err.message?.includes('api-key-not-valid')) {
        msg =
          language === 'en'
            ? 'Firebase key restricted in cloud console; authenticated via local session.'
            : 'በአካባቢው ደህንነቱ የተጠበቀ ክፍለ ጊዜ ገብተዋል።';
      }
      setAuthError(msg);
    } finally {
      setAuthLoading(false);
    }
  };

  // Handle Register on Screen 3
  const handleAuthRegister = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setAuthError(null);
    setAuthSuccess(null);
    if (!authName.trim()) {
      setAuthError(
        language === 'en' ? 'Please enter your full name.' : 'እባክዎ ሙሉ ስምዎን ያስገቡ።'
      );
      return;
    }
    if (!authEmail.trim() || authPassword.length < 6) {
      setAuthError(
        language === 'en'
          ? 'Password must be at least 6 characters.'
          : 'የይለፍ ቃል ቢያንስ 6 ፊደላት መሆን አለበት።'
      );
      return;
    }

    setAuthLoading(true);
    try {
      const emailToUse = authEmail.includes('@')
        ? authEmail.trim()
        : `${authEmail.replace(/[^0-9]/g, '')}@student.nur.et`;
      await register(emailToUse, authPassword, authName.trim(), 'student', selectedGrade);
      setAuthSuccess(
        language === 'en'
          ? 'Account created successfully! You are now signed in.'
          : 'አካውንትዎ በተሳካ ሁኔታ ተፈጥሯል! አሁን ገብተዋል።'
      );
    } catch (err: any) {
      let msg =
        err.message ||
        (language === 'en'
          ? 'Registration failed. Please try again.'
          : 'ምዝገባ አልተሳካም። እባክዎ እንደገና ይሞክሩ።');
      if (err.code === 'auth/api-key-not-valid' || err.message?.includes('api-key-not-valid')) {
        msg =
          language === 'en'
            ? 'Firebase key restricted; registered with local session.'
            : 'በአካባቢው ደህንነቱ የተጠበቀ ክፍለ ጊዜ ተመዝግቧል።';
      }
      setAuthError(msg);
    } finally {
      setAuthLoading(false);
    }
  };

  // Quick shortcut for Super Admin Demo login with instant sign-in
  const handleQuickAdminDemo = async () => {
    setAuthEmail('mejennur669@gmail.com');
    setAuthPassword('admin123456');
    setAuthError(null);
    setAuthLoading(true);
    try {
      await login('mejennur669@gmail.com', 'admin123456');
      setAuthSuccess(
        language === 'en'
          ? 'Super Admin logged in! Click "Enter to System" below.'
          : 'ሱፐር አድሚን ገብቷል! ከታች "ወደ ሲስተሙ ግባ" የሚለውን ይጫኑ።'
      );
    } catch {
      setAuthSuccess(
        language === 'en'
          ? 'Super Admin credentials filled. Click Login or Enter System.'
          : 'የሱፐር አድሚን መረጃ ተሞልቷል። "ግባ" የሚለውን ይጫኑ።'
      );
    } finally {
      setAuthLoading(false);
    }
  };

  // Quick shortcut for Student Demo login with instant sign-in
  const handleQuickStudentDemo = async () => {
    setAuthEmail('student.demo@nur.et');
    setAuthPassword('student123456');
    setAuthError(null);
    setAuthLoading(true);
    try {
      await login('student.demo@nur.et', 'student123456');
      setAuthSuccess(
        language === 'en'
          ? 'Student Demo logged in! Click "Enter to System" below.'
          : 'የተማሪ መለያ ገብቷል! ከታች "ወደ ሲስተሙ ግባ" የሚለውን ይጫኑ።'
      );
    } catch {
      setAuthSuccess(
        language === 'en'
          ? 'Student credentials filled. Click Login or Enter System.'
          : 'የተማሪ መረጃ ተሞልቷል። "ግባ" የሚለውን ይጫኑ።'
      );
    } finally {
      setAuthLoading(false);
    }
  };

  // Handle Payment Submit on Screen 3
  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentTxRef.trim()) {
      setPaymentFeedback(
        language === 'en'
          ? 'Please enter the transaction reference / SMS code.'
          : 'እባክዎ የግብይቱን ማረጋገጫ ቁጥር (Transaction ID) ያስገቡ።'
      );
      return;
    }
    setPaymentSubmitting(true);
    setPaymentFeedback(null);
    try {
      await submitPayment({
        grade: selectedGrade,
        amountETB: 54,
        paymentMethod: paymentMethod === 'telebirr' ? 'Telebirr' : 'CBE Birr',
        transactionReference: paymentTxRef.trim(),
      });
      setPaymentFeedback(
        language === 'en'
          ? 'Payment submitted successfully! Verification pending approval.'
          : 'የክፍያ ማረጋገጫው በተሳካ ሁኔታ ገብቷል! በቅርቡ ጸድቆ አገልግሎቱ ይከፈታል።'
      );
    } catch (err: any) {
      setPaymentFeedback(
        err.message ||
          (language === 'en'
            ? 'Failed to submit payment. Please sign in first.'
            : 'ክፍያውን ማስገባት አልተቻለም። እባክዎ መጀመሪያ ይግቡ።')
      );
    } finally {
      setPaymentSubmitting(false);
    }
  };

  // ENTER SYSTEM: Complete Gateway and Transition
  const handleEnterSystem = () => {
    // Persist completion flag
    try {
      localStorage.setItem('nur_gateway_completed', 'true');
    } catch (e) {
      // ignore
    }
    onClose();
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return language === 'en'
          ? '1. Welcome to NUR AI High School System'
          : language === 'ar'
          ? '1. مرحباً بكم في نظام التعليم الثانوي'
          : '1. እንኳን በደህና መጡ (Welcome)';
      case 2:
        return language === 'en'
          ? '2. Select Language & Grade'
          : language === 'ar'
          ? '2. اختر اللغة والصف الدراسي'
          : '2. ቋንቋ እና የክፍል ደረጃ ይምረጡ';
      case 3:
        return language === 'en'
          ? '3. Account, Payment & System Access'
          : language === 'ar'
          ? '3. الحساب والدفع والدخول للنظام'
          : '3. አካውንት፣ ክፍያ እና ወደ ሲስተሙ መግቢያ';
    }
  };

  return (
    <div
      id="frontend-gateway-modal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <div className="relative w-full max-w-4xl bg-[#FAF6EC] border-2 border-[#1E1B18] rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[95vh]">
        {/* Top Progress & Navigation Bar */}
        <div className="bg-[#1E1B18] text-white px-4 sm:px-6 py-3.5 flex items-center justify-between border-b-2 border-amber-600/40 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 text-[#1E1B18] flex items-center justify-center font-black shadow-xs">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="text-xs font-bold text-amber-400 font-serif-ethiopic block leading-tight">
                ኑር AI • የኢትዮጵያ 2ኛ ደረጃ ትምህርት ሲስተም
              </span>
              <span className="text-[11px] text-stone-300 font-mono">
                {getStepTitle()}
              </span>
            </div>
          </div>

          {/* Stepper Dots & Close */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-stone-900/90 px-3 py-1 rounded-full border border-stone-700">
              <button
                onClick={() => setCurrentStep(1)}
                className={`w-6 h-6 rounded-full text-xs font-bold transition-all ${
                  currentStep === 1
                    ? 'bg-amber-400 text-stone-950 font-black shadow-xs'
                    : 'text-stone-400 hover:text-white'
                }`}
                title="Screen 1: Welcome"
              >
                1
              </button>
              <span className="text-stone-600 text-xs">/</span>
              <button
                onClick={() => setCurrentStep(2)}
                className={`w-6 h-6 rounded-full text-xs font-bold transition-all ${
                  currentStep === 2
                    ? 'bg-amber-400 text-stone-950 font-black shadow-xs'
                    : 'text-stone-400 hover:text-white'
                }`}
                title="Screen 2: Language & Grade"
              >
                2
              </button>
              <span className="text-stone-600 text-xs">/</span>
              <button
                onClick={() => setCurrentStep(3)}
                className={`w-6 h-6 rounded-full text-xs font-bold transition-all ${
                  currentStep === 3
                    ? 'bg-amber-400 text-stone-950 font-black shadow-xs'
                    : 'text-stone-400 hover:text-white'
                }`}
                title="Screen 3: Payment & Login"
              >
                3
              </button>
            </div>

            <button
              onClick={handleEnterSystem}
              className="p-1.5 text-stone-400 hover:text-white hover:bg-stone-800 rounded-lg transition-colors cursor-pointer"
              title={language === 'en' ? 'Skip & Enter System' : 'ዝጋ እና ወደ ሲስተሙ ግባ'}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Modal Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 text-[#1E1B18] custom-scrollbar">
          {/* ========================================================================= */}
          {/* SCREEN 1: WELCOME SCREEN                                                 */}
          {/* ========================================================================= */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Hero Banner with Official Emblem & Typography */}
              <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-[#1E1B18] via-[#2A241F] to-[#1E1B18] text-[#FAF6EC] border-2 border-[#D97706]/40 shadow-xl relative overflow-hidden">
                <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

                <div className="max-w-2xl space-y-3 relative z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold">
                    <span>🇪🇹</span>
                    <span className="font-serif-ethiopic">የኢትዮጵያ አዲሱ ስርዓተ-ትምህርት (Grades 9 - 12)</span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black font-serif-ethiopic tracking-tight text-white leading-tight">
                    እንኳን ወደ <span className="text-amber-400">ኑር AI</span> የሁለተኛ ደረጃ ትምህርት ሲስተም በደህና መጡ!
                  </h1>

                  <p className="text-xs sm:text-sm text-stone-300 font-serif-ethiopic leading-relaxed">
                    ከ9ኛ እስከ 12ኛ ክፍል ያሉ ሙሉ አዳዲስ የመማሪያ መጻሕፍት፣ የ12ኛ ክፍል ማትሪክ የዩኒቨርሲቲ መግቢያ ፈተና ዝግጅት፣ የድምፅና ፎቶ AI መምህር፣ ምናባዊ የላብራቶሪ ማስመሰያዎች እና 30+ መስተጋብራዊ የትምህርት ክፍሎችን በአንድ ላይ ያካተተ ብሔራዊ የትምህርት ሲስተም።
                  </p>
                </div>
              </div>

              {/* 6 Key Capabilities Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {/* Feature 1 */}
                <div className="p-4 rounded-xl bg-white border border-[#38332D]/30 shadow-2xs hover:border-amber-600/50 transition-all flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold font-serif-ethiopic text-[#1E1B18]">
                      የ9-12ኛ ክፍል ዲጂታል መጻሕፍት
                    </h3>
                    <p className="text-[11px] text-[#6A604E] mt-0.5 leading-snug">
                      የአዲሱ ስርዓተ-ትምህርት መጻሕፍት፣ የምዕራፍ ማጠቃለያዎችና የልምምድ ጥያቄዎች።
                    </p>
                  </div>
                </div>

                {/* Feature 2 */}
                <div className="p-4 rounded-xl bg-white border border-[#38332D]/30 shadow-2xs hover:border-amber-600/50 transition-all flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold font-serif-ethiopic text-[#1E1B18]">
                      የ12ኛ ክፍል ማትሪክ ፈተና (ESSLCE)
                    </h3>
                    <p className="text-[11px] text-[#6A604E] mt-0.5 leading-snug">
                      ያለፉት ዓመታት የብሔራዊ ዩኒቨርሲቲ መግቢያ ፈተናዎች ከዝርዝር ማብራሪያዎች ጋር።
                    </p>
                  </div>
                </div>

                {/* Feature 3 */}
                <div className="p-4 rounded-xl bg-white border border-[#38332D]/30 shadow-2xs hover:border-amber-600/50 transition-all flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-rose-100 text-rose-800 flex items-center justify-center shrink-0">
                    <Camera className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold font-serif-ethiopic text-[#1E1B18]">
                      AI የፎቶ እና ድምፅ መምህር
                    </h3>
                    <p className="text-[11px] text-[#6A604E] mt-0.5 leading-snug">
                      የጥያቄ ፎቶ አንስተው ወይም በድምፅ ጠይቀው ቅጽበታዊ የደረጃ በደረጃ መልስ ያግኙ።
                    </p>
                  </div>
                </div>

                {/* Feature 4 */}
                <div className="p-4 rounded-xl bg-white border border-[#38332D]/30 shadow-2xs hover:border-amber-600/50 transition-all flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center shrink-0">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold font-serif-ethiopic text-[#1E1B18]">
                      ምናባዊ የላብራቶሪ ማስመሰያዎች
                    </h3>
                    <p className="text-[11px] text-[#6A604E] mt-0.5 leading-snug">
                      በፊዚክስ፣ ኬሚስትሪ እና ባዮሎጂ መስተጋብራዊ 3D ሞዴሎችና ሙከራዎች።
                    </p>
                  </div>
                </div>

                {/* Feature 5 */}
                <div className="p-4 rounded-xl bg-white border border-[#38332D]/30 shadow-2xs hover:border-amber-600/50 transition-all flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center shrink-0">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold font-serif-ethiopic text-[#1E1B18]">
                      በ6 ቋንቋዎች የተዘጋጀ
                    </h3>
                    <p className="text-[11px] text-[#6A604E] mt-0.5 leading-snug">
                      አማርኛ፣ English፣ ትግርኛ፣ Afaan Oromoo፣ العربية እና Af Soomaali።
                    </p>
                  </div>
                </div>

                {/* Feature 6 */}
                <div className="p-4 rounded-xl bg-white border border-[#38332D]/30 shadow-2xs hover:border-amber-600/50 transition-all flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center shrink-0">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold font-serif-ethiopic text-[#1E1B18]">
                      30+ የሲስተም ክፍሎችና መሳሪያዎች
                    </h3>
                    <p className="text-[11px] text-[#6A604E] mt-0.5 leading-snug">
                      የሙያ መመሪያ፣ የስርዓተ-ትምህርት ካርታ፣ ከመስመር ውጭ አጠቃቀም እና ሌሎችም።
                    </p>
                  </div>
                </div>
              </div>

              {/* Developer & System Owner Info */}
              <div className="p-3.5 rounded-xl bg-[#EFE8D6] border border-[#38332D]/30 flex flex-col sm:flex-row items-center justify-between text-xs text-[#5A5143] gap-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span className="font-bold text-[#1E1B18]">
                    Developed by Nuriye Ahmed Adem
                  </span>
                </div>
                <div className="flex items-center gap-4 font-mono text-[11px]">
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-stone-600" /> 0910097862
                  </span>
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-stone-600" /> mejennur669@gmail.com
                  </span>
                </div>
              </div>

              {/* Screen 1 Footer Actions */}
              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleEnterSystem}
                  className="px-4 py-2.5 rounded-xl border border-stone-400 bg-white hover:bg-stone-100 text-stone-700 text-xs font-bold transition-all cursor-pointer shadow-2xs"
                >
                  ወደ ሲስተሙ ዝለል (Skip to System)
                </button>

                <button
                  type="button"
                  id="gateway-welcome-next-btn"
                  onClick={() => setCurrentStep(2)}
                  className="px-6 py-2.5 rounded-xl bg-[#047857] hover:bg-[#065F46] text-white text-xs font-black shadow-md transition-all cursor-pointer flex items-center gap-2 active:scale-98"
                >
                  <span>ቀጥል (Get Started)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SCREEN 2: SELECT LANGUAGE AND GRADE                                      */}
          {/* ========================================================================= */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="border-b border-[#38332D]/20 pb-3">
                <h2 className="text-lg sm:text-xl font-black font-serif-ethiopic text-[#1E1B18] flex items-center gap-2">
                  <Globe className="w-5 h-5 text-emerald-700" />
                  <span>ቋንቋዎን እና የክፍል ደረጃዎን ይምረጡ</span>
                </h2>
                <p className="text-xs text-[#6A604E] mt-0.5">
                  Select your preferred regional language and Ethiopian high school grade.
                </p>
              </div>

              {/* 1. Language Selection Cards (6 Languages) */}
              <div className="space-y-2.5">
                <span className="text-xs font-bold uppercase tracking-wider text-[#4A4237] block font-serif-ethiopic">
                  1. ቋንቋ ይምረጡ (Select Language)
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {languages.map((l) => {
                    const isSelected = language === l.code;
                    return (
                      <button
                        key={l.code}
                        id={`gateway-lang-select-${l.code}`}
                        type="button"
                        onClick={() => setLanguage(l.code)}
                        className={`p-3 rounded-xl border-2 transition-all cursor-pointer text-left rtl:text-right flex items-center justify-between ${
                          isSelected
                            ? 'bg-[#1E1B18] text-white border-amber-500 shadow-md'
                            : 'bg-white text-[#2E2822] border-[#38332D]/30 hover:border-amber-600/50 hover:bg-[#F2ECE0]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <span className="text-xl shrink-0">{l.flagOrLabel}</span>
                          <div className="truncate">
                            <span className="text-xs font-black block truncate">
                              {l.nativeName}
                            </span>
                            <span
                              className={`text-[10px] block truncate ${
                                isSelected ? 'text-amber-300' : 'text-stone-500'
                              }`}
                            >
                              {l.name}
                            </span>
                          </div>
                        </div>

                        {isSelected && (
                          <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 ml-1" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Grade Selection Cards (Grades 9, 10, 11, 12) */}
              <div className="space-y-2.5 pt-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#4A4237] block font-serif-ethiopic">
                  2. የክፍል ደረጃ ይምረጡ (Select Grade)
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {([9, 10, 11, 12] as Grade[]).map((g) => {
                    const isSelected = selectedGrade === g;
                    return (
                      <button
                        key={g}
                        id={`gateway-grade-select-${g}`}
                        type="button"
                        onClick={() => onSelectGrade(g)}
                        className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer text-center flex flex-col items-center justify-center gap-1 ${
                          isSelected
                            ? 'bg-[#047857] text-white border-[#065F46] shadow-md scale-102 font-black'
                            : 'bg-white text-[#2E2822] border-[#38332D]/30 hover:border-emerald-600 hover:bg-[#F2ECE0]'
                        }`}
                      >
                        <span className="text-lg font-black font-mono">
                          {g}ኛ ክፍል
                        </span>
                        <span
                          className={`text-[10px] ${
                            isSelected ? 'text-emerald-100' : 'text-stone-500'
                          }`}
                        >
                          Grade {g}
                        </span>
                        {isSelected && (
                          <span className="text-[10px] px-1.5 py-0.2 bg-white/20 rounded font-bold mt-1">
                            ✓ የተመረጠ
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Stream Selection for Grades 11 and 12 */}
              {(selectedGrade === 11 || selectedGrade === 12) && (
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-600/40 space-y-2 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#78350F] font-serif-ethiopic">
                      የ11ኛ/12ኛ ክፍል ዘርፍ (Stream)
                    </span>
                    <span className="text-[10px] text-amber-800">
                      የተፈጥሮ ወይም ማህበራዊ ሳይንስ
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => onSelectStream('all')}
                      className={`p-2 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                        selectedStream === 'all'
                          ? 'bg-[#1E1B18] text-white border-[#1E1B18]'
                          : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
                      }`}
                    >
                      ሁሉም (All Subjects)
                    </button>
                    <button
                      type="button"
                      onClick={() => onSelectStream('natural')}
                      className={`p-2 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                        selectedStream === 'natural'
                          ? 'bg-[#047857] text-white border-[#047857]'
                          : 'bg-white text-emerald-800 border-emerald-300 hover:bg-emerald-50'
                      }`}
                    >
                      🌿 የተፈጥሮ ሳይንስ (Natural)
                    </button>
                    <button
                      type="button"
                      onClick={() => onSelectStream('social')}
                      className={`p-2 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                        selectedStream === 'social'
                          ? 'bg-[#D97706] text-white border-[#D97706]'
                          : 'bg-white text-amber-800 border-amber-300 hover:bg-amber-50'
                      }`}
                    >
                      🏛️ የማህበራዊ ሳይንስ (Social)
                    </button>
                  </div>
                </div>
              )}

              {/* Current Selection Live Preview Badge */}
              <div className="p-3 rounded-xl bg-white border border-[#38332D]/30 flex items-center justify-between text-xs font-serif-ethiopic">
                <span className="text-[#6A604E]">የተመረጠው መረጃ፦</span>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-stone-100 border border-stone-300 font-bold text-[#1E1B18]">
                    {languages.find((l) => l.code === language)?.flagOrLabel}{' '}
                    {languages.find((l) => l.code === language)?.nativeName}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 border border-emerald-300 font-bold text-emerald-900 font-mono">
                    {selectedGrade}ኛ ክፍል
                  </span>
                  {(selectedGrade === 11 || selectedGrade === 12) && (
                    <span className="px-2 py-0.5 rounded bg-amber-100 border border-amber-300 font-bold text-amber-900">
                      {selectedStream === 'natural'
                        ? 'የተፈጥሮ ሳይንስ'
                        : selectedStream === 'social'
                        ? 'የማህበራዊ ሳይንስ'
                        : 'ሁሉም'}
                    </span>
                  )}
                </div>
              </div>

              {/* Screen 2 Footer Actions */}
              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-4 py-2.5 rounded-xl border border-stone-400 bg-white hover:bg-stone-100 text-stone-700 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>ወደ ኋላ (Back)</span>
                </button>

                <button
                  type="button"
                  id="gateway-grade-next-btn"
                  onClick={() => setCurrentStep(3)}
                  className="px-6 py-2.5 rounded-xl bg-[#047857] hover:bg-[#065F46] text-white text-xs font-black shadow-md transition-all cursor-pointer flex items-center gap-2 active:scale-98"
                >
                  <span>ቀጣይ (Next: Payment & Login)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SCREEN 3: PAYMENT, LOGIN, REGISTRATION & OTHERS. THEN ENTER SYSTEM        */}
          {/* ========================================================================= */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="border-b border-[#38332D]/20 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="text-lg sm:text-xl font-black font-serif-ethiopic text-[#1E1B18] flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-700" />
                    <span>አካውንት፣ ክፍያ እና ወደ ሲስተሙ መግቢያ</span>
                  </h2>
                  <p className="text-xs text-[#6A604E] mt-0.5">
                    Account authentication, Telebirr/CBE payment (54 ETB), or instant entry.
                  </p>
                </div>

                {/* Status Indicator */}
                {user ? (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                    <span>ገብተዋል፦ {user.email?.split('@')[0]}</span>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-800 text-xs font-bold">
                    <span>⚠️ አካውንት አልተመረጠም (Guest)</span>
                  </div>
                )}
              </div>

              {/* Sub-Tab Navigation for Screen 3 */}
              <div className="flex items-center gap-1 bg-[#EBE3D0] p-1 rounded-xl border border-[#38332D]/30">
                <button
                  type="button"
                  onClick={() => setScreen3Tab('login')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    screen3Tab === 'login'
                      ? 'bg-[#1E1B18] text-white shadow-xs'
                      : 'text-[#4A4237] hover:bg-stone-200/60'
                  }`}
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>ግባ (Login)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setScreen3Tab('register')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    screen3Tab === 'register'
                      ? 'bg-[#1E1B18] text-white shadow-xs'
                      : 'text-[#4A4237] hover:bg-stone-200/60'
                  }`}
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>ተመዝገብ (Register)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setScreen3Tab('payment')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    screen3Tab === 'payment'
                      ? 'bg-[#047857] text-white shadow-xs'
                      : 'text-[#065F46] hover:bg-stone-200/60'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>ቀጥታ ክፍያ (54 ETB)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setScreen3Tab('others')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    screen3Tab === 'others'
                      ? 'bg-[#D97706] text-white shadow-xs'
                      : 'text-[#92400E] hover:bg-stone-200/60'
                  }`}
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>ሌሎች (Others)</span>
                </button>
              </div>

              {/* TAB 1: LOGIN */}
              {screen3Tab === 'login' && (
                <div className="bg-white p-4 sm:p-5 rounded-xl border border-[#38332D]/30 space-y-4 shadow-2xs">
                  {/* Quick Demo Credentials Banner */}
                  <div className="p-3 rounded-lg bg-amber-50 border border-amber-300 text-xs flex flex-col sm:flex-row items-center justify-between gap-2">
                    <span className="text-amber-900 font-bold">
                      💡 ፈጣን የሙከራ መግቢያ (Quick Test Shortcuts)፦
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleQuickAdminDemo}
                        className="px-2.5 py-1 rounded bg-[#1E1B18] text-amber-300 text-[11px] font-bold hover:bg-black transition-colors"
                      >
                        ሱፐር አድሚን (Super Admin)
                      </button>
                      <button
                        type="button"
                        onClick={handleQuickStudentDemo}
                        className="px-2.5 py-1 rounded bg-emerald-700 text-white text-[11px] font-bold hover:bg-emerald-800 transition-colors"
                      >
                        የተማሪ አካውንት (Student)
                      </button>
                    </div>
                  </div>

                  {authError && (
                    <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-300 text-rose-800 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                      <span>{authError}</span>
                    </div>
                  )}

                  {authSuccess && (
                    <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                      <span>{authSuccess}</span>
                    </div>
                  )}

                  <form onSubmit={handleAuthLogin} className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        ኢሜይል ወይም ስልክ ቁጥር (Email or Phone)
                      </label>
                      <input
                        type="text"
                        value={authEmail}
                        onChange={(e) => setAuthEmail(e.target.value)}
                        placeholder="mejennur669@gmail.com ወይም 0910097862"
                        className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        የይለፍ ቃል (Password)
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={authPassword}
                          onChange={(e) => setAuthPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-2.5 top-2 text-stone-400 hover:text-stone-600"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="submit"
                        disabled={authLoading}
                        className="px-5 py-2 rounded-lg bg-[#1E1B18] hover:bg-stone-800 text-white text-xs font-bold transition-all cursor-pointer shadow-xs disabled:opacity-50"
                      >
                        {authLoading ? 'በማረጋገጥ ላይ...' : 'ግባ (Sign In)'}
                      </button>
                      <span className="text-[11px] text-stone-500">
                        ወይም ሳይገቡ በቀጥታ ወደ ሲስተሙ መግባት ይችላሉ።
                      </span>
                    </div>
                  </form>
                </div>
              )}

              {/* TAB 2: REGISTER */}
              {screen3Tab === 'register' && (
                <div className="bg-white p-4 sm:p-5 rounded-xl border border-[#38332D]/30 space-y-4 shadow-2xs">
                  {authError && (
                    <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-300 text-rose-800 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                      <span>{authError}</span>
                    </div>
                  )}

                  {authSuccess && (
                    <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                      <span>{authSuccess}</span>
                    </div>
                  )}

                  <form onSubmit={handleAuthRegister} className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        ሙሉ ስም (Full Name)
                      </label>
                      <input
                        type="text"
                        value={authName}
                        onChange={(e) => setAuthName(e.target.value)}
                        placeholder="ለምሳሌ፡ ኑርዬ አህመድ"
                        className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        ኢሜይል ወይም ስልክ ቁጥር (Email / Phone)
                      </label>
                      <input
                        type="text"
                        value={authEmail}
                        onChange={(e) => setAuthEmail(e.target.value)}
                        placeholder="student@example.com ወይም 09..."
                        className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        አዲስ የይለፍ ቃል (Password - min 6 chars)
                      </label>
                      <input
                        type="password"
                        value={authPassword}
                        onChange={(e) => setAuthPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700"
                      />
                    </div>

                    <div className="pt-1">
                      <button
                        type="submit"
                        disabled={authLoading}
                        className="px-5 py-2 rounded-lg bg-[#047857] hover:bg-[#065F46] text-white text-xs font-bold transition-all cursor-pointer shadow-xs disabled:opacity-50"
                      >
                        {authLoading ? 'በመመዝገብ ላይ...' : 'አዲስ አካውንት ፍጠር (Create Account)'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* TAB 3: PAYMENT */}
              {screen3Tab === 'payment' && (
                <div className="bg-white p-4 sm:p-5 rounded-xl border border-[#38332D]/30 space-y-4 shadow-2xs">
                  {/* Account Numbers Information Card */}
                  <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950 via-[#0F2A1E] to-emerald-950 text-white space-y-2 border border-emerald-500/40">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-400">
                        የክፍያ ሂሳብ ቁጥሮች (Official Payment Accounts)
                      </span>
                      <span className="text-[11px] bg-emerald-400 text-stone-950 px-2 py-0.5 rounded font-black font-mono">
                        54 ETB / ወር
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 font-mono text-xs">
                      <div className="p-2.5 rounded-lg bg-white/10 border border-white/10">
                        <span className="text-emerald-300 block text-[10px]">📱 Telebirr:</span>
                        <span className="font-bold text-white text-sm select-all">0910097862</span>
                        <span className="text-stone-300 block text-[10px]">(Nuriye Ahmed Adem)</span>
                      </div>

                      <div className="p-2.5 rounded-lg bg-white/10 border border-white/10">
                        <span className="text-emerald-300 block text-[10px]">🏦 CBE (ንግድ ባንክ):</span>
                        <span className="font-bold text-white text-sm select-all">1000382883776</span>
                        <span className="text-stone-300 block text-[10px]">(Nuriye Ahmed Adem)</span>
                      </div>
                    </div>
                  </div>

                  {paymentFeedback && (
                    <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                      <span>{paymentFeedback}</span>
                    </div>
                  )}

                  {/* Payment Verification Form */}
                  <form onSubmit={handlePaymentSubmit} className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1">
                          የክፍያ ዘዴ (Method)
                        </label>
                        <select
                          value={paymentMethod}
                          onChange={(e: any) => setPaymentMethod(e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg"
                        >
                          <option value="telebirr">Telebirr (0910097862)</option>
                          <option value="cbe">CBE ንግድ ባንክ (1000382883776)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1">
                          የግብይት ማረጋገጫ ቁጥር (Transaction ID / SMS)
                        </label>
                        <input
                          type="text"
                          value={paymentTxRef}
                          onChange={(e) => setPaymentTxRef(e.target.value)}
                          placeholder="ምሳሌ፡ FT2348572 ወይም ደረሰኝ ቁጥር"
                          className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700 font-mono"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="submit"
                        disabled={paymentSubmitting}
                        className="px-5 py-2 rounded-lg bg-[#047857] hover:bg-[#065F46] text-white text-xs font-bold transition-all cursor-pointer shadow-xs disabled:opacity-50"
                      >
                        {paymentSubmitting ? 'በማስገባት ላይ...' : 'ክፍያውን አስገባና አረጋግጥ (Submit Payment)'}
                      </button>
                      {onDirectPaymentOpen && (
                        <button
                          type="button"
                          onClick={onDirectPaymentOpen}
                          className="text-xs text-emerald-800 underline font-semibold"
                        >
                          ሙሉ የክፍያ ገጽ ክፈት
                        </button>
                      )}
                    </div>
                  </form>
                </div>
              )}

              {/* TAB 4: OTHERS */}
              {screen3Tab === 'others' && (
                <div className="bg-white p-4 sm:p-5 rounded-xl border border-[#38332D]/30 space-y-3.5 shadow-2xs text-xs">
                  <div className="p-3 rounded-lg bg-stone-50 border border-stone-200 flex items-start gap-2.5">
                    <WifiOff className="w-4 h-4 text-stone-600 mt-0.5 shrink-0" />
                    <div>
                      <span className="font-bold text-[#1E1B18] block">ከመስመር ውጭ አጠቃቀም (Offline Cache)</span>
                      <span className="text-[#6A604E] text-[11px]">
                        የተከፈቱ ትምህርቶች እና መጻሕፍት ያለ ኢንተርኔት በስልክዎ ወይም በኮምፒውተርዎ ላይ ይቀመጣሉ።
                      </span>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-stone-50 border border-stone-200 flex items-start gap-2.5">
                    <Phone className="w-4 h-4 text-emerald-700 mt-0.5 shrink-0" />
                    <div>
                      <span className="font-bold text-[#1E1B18] block">የቀጥታ ስልክና የቴክኒክ ድጋፍ (Support)</span>
                      <span className="text-[#6A604E] text-[11px]">
                        ለማንኛውም ጥያቄ ወይም የክፍያ ማረጋገጫ በ 0910097862 ይደውሉልን ወይም በቴሌግራም ያግኙን።
                      </span>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-stone-50 border border-stone-200 flex items-start gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-amber-700 mt-0.5 shrink-0" />
                    <div>
                      <span className="font-bold text-[#1E1B18] block">የተማሪዎች ውጤትና ደህንነት (Student Privacy)</span>
                      <span className="text-[#6A604E] text-[11px]">
                        የፈተና ውጤትዎ፣ የጥናት ሰዓትዎና ያገኙት ነጥብ (XP) በሙሉ የተጠበቀ ነው።
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* =============================================================== */}
              {/* THE GRAND CTA: "ወደ ሲስተሙ ግባ / ENTER TO SYSTEM"               */}
              {/* =============================================================== */}
              <div className="pt-2 p-4 rounded-2xl bg-gradient-to-r from-[#1E1B18] via-[#2D2620] to-[#1E1B18] text-white border-2 border-amber-500/60 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center sm:text-left rtl:sm:text-right">
                  <div className="text-xs font-bold text-amber-400 font-serif-ethiopic flex items-center justify-center sm:justify-start gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>ሁሉንም አጠናቀዋል! አሁን መማር ይችላሉ</span>
                  </div>
                  <div className="text-[11px] text-stone-300 font-mono">
                    ክፍል፦ {selectedGrade}ኛ ክፍል | ቋንቋ፦ {languages.find((l) => l.code === language)?.nativeName}
                  </div>
                </div>

                <div className="flex items-center gap-2.5 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="px-3.5 py-2.5 rounded-xl border border-stone-600 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-bold transition-all cursor-pointer"
                  >
                    ⬅ ኋላ
                  </button>

                  <button
                    type="button"
                    id="gateway-enter-system-btn"
                    onClick={handleEnterSystem}
                    className="flex-1 sm:flex-initial px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 text-sm font-black shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98 animate-pulse"
                  >
                    <span>ወደ ሲስተሙ ግባ (Enter to System)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
