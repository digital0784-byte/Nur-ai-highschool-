import React, { useState, useEffect } from 'react';
import {
  Globe,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  AlertCircle,
  Loader2,
  Lock,
  Eye,
  EyeOff,
  Smartphone,
  Building2,
  Landmark,
  UploadCloud,
  Copy,
  Check,
  RotateCcw,
  User,
  Mail,
  Phone,
  KeyRound,
  FileCheck2,
  Clock,
  XCircle,
  Zap,
  Info,
  ExternalLink,
  ChevronRight,
  BookOpen,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useSubscription } from '../../context/SubscriptionContext';
import { Grade, LanguageCode } from '../../types';
import { PaymentMethodName } from '../../types/subscription';
import { SUPER_ADMIN_EMAIL, DEVELOPER_INFO } from '../../services/subscriptionService';

interface StudentOnboardingFlowProps {
  onComplete: () => void;
}

export const StudentOnboardingFlow: React.FC<StudentOnboardingFlowProps> = ({ onComplete }) => {
  const { user, userProfile, login, register, resetPassword, updateProfileData } = useAuth();
  const { language, setLanguage, languages } = useLanguage();
  const {
    subscription,
    latestPayment,
    hasLearningAccess,
    pricingConfig,
    submitPayment,
    isOwnerSuperAdmin,
    superAdminApprove,
    superAdminReject,
  } = useSubscription();

  // Steps:
  // 1: Language Selection
  // 2: Grade Selection
  // 3: Login / Register & Password Recovery
  // 4: Payment Submission
  // 5: Payment Verification & Status
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(() => {
    if (user && hasLearningAccess) return 5;
    if (user && latestPayment?.status === 'PENDING') return 5;
    if (user && latestPayment?.status === 'REJECTED') return 5;
    if (user) return 4;
    return 1;
  });

  // Screen 1: Language
  const [chosenLang, setChosenLang] = useState<LanguageCode>(language);

  // Screen 2: Grade
  const [chosenGrade, setChosenGrade] = useState<Grade>(() => {
    const saved = localStorage.getItem('nur_selected_grade');
    if (saved && [9, 10, 11, 12].includes(Number(saved))) {
      return Number(saved) as Grade;
    }
    return userProfile?.grade || 9;
  });

  // Screen 3: Auth Mode ('login' | 'register')
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  // Login form
  const [loginIdentifier, setLoginIdentifier] = useState<string>('');
  const [loginPassword, setLoginPassword] = useState<string>('');
  const [showLoginPassword, setShowLoginPassword] = useState<boolean>(false);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Register form
  const [regFullName, setRegFullName] = useState<string>('');
  const [regPhone, setRegPhone] = useState<string>('');
  const [regEmail, setRegEmail] = useState<string>('');
  const [regPassword, setRegPassword] = useState<string>('');
  const [regConfirmPassword, setRegConfirmPassword] = useState<string>('');
  const [showRegPassword, setShowRegPassword] = useState<boolean>(false);
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [regError, setRegError] = useState<string | null>(null);

  // Forgot Password modal/state
  const [isForgotOpen, setIsForgotOpen] = useState<boolean>(false);
  const [recoveryInput, setRecoveryInput] = useState<string>('');
  const [isRecovering, setIsRecovering] = useState<boolean>(false);
  const [recoverySuccess, setRecoverySuccess] = useState<string | null>(null);
  const [recoveryError, setRecoveryError] = useState<string | null>(null);

  // Screen 4: Payment
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodName>('Telebirr');
  const [txRef, setTxRef] = useState<string>('');
  const [proofImage, setProofImage] = useState<string>('');
  const [proofFileName, setProofFileName] = useState<string>('');
  const [isSubmittingPayment, setIsSubmittingPayment] = useState<boolean>(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Screen 5: Correction mode for rejected payments
  const [isCorrectingPayment, setIsCorrectingPayment] = useState<boolean>(false);

  // Sync step based on authentication and payment status
  useEffect(() => {
    if (user) {
      if (hasLearningAccess || isOwnerSuperAdmin) {
        setStep(5);
      } else if (latestPayment?.status === 'PENDING' || latestPayment?.status === 'REJECTED') {
        setStep(5);
      } else if (step < 4) {
        setStep(4);
      }
    }
  }, [user, hasLearningAccess, latestPayment, isOwnerSuperAdmin]);

  // Pricing calculation strictly as mandated:
  // Grade 9  = 160 ETB
  // Grade 10 = 180 ETB
  // Grade 11 = 200 ETB
  // Grade 12 = 200 ETB
  const gradePrice = React.useMemo(() => {
    switch (chosenGrade) {
      case 9:
        return pricingConfig.grade9Price || 160;
      case 10:
        return pricingConfig.grade10Price || 180;
      case 11:
        return pricingConfig.grade11Price || 200;
      case 12:
        return pricingConfig.grade12Price || 200;
      default:
        return 160;
    }
  }, [chosenGrade, pricingConfig]);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  // Screen 1: Handle Language Confirm
  const handleConfirmLanguage = async () => {
    setLanguage(chosenLang);
    localStorage.setItem('nur_preferred_language', chosenLang);
    if (user) {
      await updateProfileData({ preferredLanguage: chosenLang });
    }
    setStep(2);
  };

  // Screen 2: Handle Grade Confirm
  const handleConfirmGrade = async () => {
    localStorage.setItem('nur_selected_grade', chosenGrade.toString());
    if (user) {
      await updateProfileData({ grade: chosenGrade });
    }
    if (!user) {
      setStep(3);
    } else {
      setStep(4);
    }
  };

  // Screen 3: Handle Login Submit
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    const idVal = loginIdentifier.trim();
    if (!idVal || !loginPassword) {
      setLoginError(
        chosenLang === 'am'
          ? 'እባክዎ ስልክ ቁጥር ወይም ኢሜይል እና የይለፍ ቃል ያስገቡ።'
          : 'Please enter your phone/email and password.'
      );
      return;
    }

    setIsLoggingIn(true);
    try {
      await login(idVal, loginPassword);
      // Login succeeded; useEffect will direct to step 4 or 5
    } catch (err: any) {
      console.error('Login error:', err);
      let msg = err.message || (chosenLang === 'am' ? 'የመግቢያ ስህተት ተከስቷል' : 'Login failed');
      if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        msg = chosenLang === 'am' ? 'የተሳሳተ ኢሜይል/ስልክ ወይም የይለፍ ቃል።' : 'Invalid email/phone or password.';
      } else if (err.code === 'auth/user-not-found') {
        msg = chosenLang === 'am' ? 'ይህ ተጠቃሚ አልተገኘም። እባክዎ አስቀድመው ይመዝገቡ።' : 'Account not found. Please register.';
      }
      setLoginError(msg);
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Screen 3: Handle Register Submit
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);

    if (!regFullName.trim()) {
      setRegError(chosenLang === 'am' ? 'እባክዎ ሙሉ ስምዎን ያስገቡ።' : 'Please enter your full name.');
      return;
    }

    if (!regPhone.trim()) {
      setRegError(chosenLang === 'am' ? 'እባክዎ ስልክ ቁጥርዎን ያስገቡ።' : 'Please enter your phone number.');
      return;
    }

    if (regPassword.length < 6) {
      setRegError(
        chosenLang === 'am'
          ? 'የይለፍ ቃል ቢያንስ 6 ፊደላት መሆን አለበት።'
          : 'Password must be at least 6 characters.'
      );
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setRegError(
        chosenLang === 'am'
          ? 'የይለፍ ቃሎቹ አይመሳሰሉም። እባክዎ በድጋሚ ያረጋግጡ።'
          : 'Passwords do not match. Please recheck.'
      );
      return;
    }

    setIsRegistering(true);
    try {
      const emailToUse = regEmail.trim()
        ? regEmail.trim()
        : `${regPhone.trim().replace(/[^0-9]/g, '')}@student.nur.et`;

      // Role is strictly 'student' — no public admin registration
      await register(
        emailToUse,
        regPassword,
        regFullName.trim(),
        'student',
        chosenGrade,
        regPhone.trim(),
        chosenLang
      );
      // Registration logs user in; transitions to step 4 (Payment)
      setStep(4);
    } catch (err: any) {
      console.error('Registration error:', err);
      let msg = err.message || (chosenLang === 'am' ? 'የምዝገባ ስህተት ተከስቷል' : 'Registration failed');
      if (err.code === 'auth/email-already-in-use') {
        msg = chosenLang === 'am' ? 'ይህ ስልክ ወይም ኢሜይል አስቀድሞ ተመዝግቧል። እባክዎ ይግቡ።' : 'Account already registered. Please login.';
      }
      setRegError(msg);
    } finally {
      setIsRegistering(false);
    }
  };

  // Password Recovery handler
  const handlePasswordRecovery = async (e: React.FormEvent) => {
    e.preventDefault();
    setRecoveryError(null);
    setRecoverySuccess(null);

    const val = recoveryInput.trim();
    if (!val) {
      setRecoveryError(
        chosenLang === 'am' ? 'እባክዎ የተመዘገቡበትን ኢሜይል ወይም ስልክ ያስገቡ።' : 'Please enter your email or phone.'
      );
      return;
    }

    setIsRecovering(true);
    try {
      await resetPassword(val);
      setRecoverySuccess(
        chosenLang === 'am'
          ? 'የይለፍ ቃል ማደሻ መመሪያ ወደ ኢሜይልዎ/ስልክዎ ተልኳል። እባክዎ መልዕክትዎን ይመልከቱ።'
          : 'Password reset instructions have been sent. Please check your inbox or SMS.'
      );
    } catch (err: any) {
      setRecoveryError(
        chosenLang === 'am'
          ? 'የይለፍ ቃል ማደስ አልተቻለም። እባክዎ መረጃዎን ያረጋግጡ ወይም ከአስተዳዳሪው ጋር ይገናኙ።'
          : 'Failed to send reset link. Please check your credentials or contact support.'
      );
    } finally {
      setIsRecovering(false);
    }
  };

  // Screen 4: Handle Payment Submit
  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentError(null);

    if (!txRef.trim()) {
      setPaymentError(
        chosenLang === 'am'
          ? 'እባክዎ የግብይቱን ማረጋገጫ ቁጥር (Transaction ID / Reference) ያስገቡ።'
          : 'Please enter the transaction reference / receipt code.'
      );
      return;
    }

    setIsSubmittingPayment(true);
    try {
      await submitPayment({
        grade: chosenGrade,
        amountETB: gradePrice,
        paymentMethod: selectedMethod,
        transactionReference: txRef.trim(),
        proofImageUrl: proofImage || undefined,
      });

      setIsCorrectingPayment(false);
      setStep(5);
    } catch (err: any) {
      console.error('Payment submission error:', err);
      setPaymentError(
        err.message ||
          (chosenLang === 'am'
            ? 'የክፍያ ማረጋገጫውን ማስገባት አልተቻለም። እባክዎ እንደገና ይሞክሩ።'
            : 'Payment submission failed. Please try again.')
      );
    } finally {
      setIsSubmittingPayment(false);
    }
  };

  // Proof Image file reader
  const handleProofImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProofFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProofImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Method details configuration
  const activeMethodConfig =
    pricingConfig.methods[selectedMethod] || pricingConfig.methods['Telebirr'];

  return (
    <div
      id="student-onboarding-container"
      className="min-h-screen bg-stone-900 text-stone-100 flex flex-col items-center justify-center p-3 sm:p-6 font-sans relative overflow-hidden"
    >
      {/* Subtle Atmospheric Background Gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Master Card Container */}
      <div className="w-full max-w-3xl bg-stone-850 border border-stone-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto relative z-10">
        {/* Header with Branding and Step Tracker */}
        <div className="bg-stone-900 border-b border-stone-800 p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-stone-950 font-black shadow-md">
              <Sparkles className="w-5 h-5 text-stone-950" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-black text-white tracking-tight flex items-center gap-2 font-serif-ethiopic">
                <span>ኑር AI</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  የ2ኛ ደረጃ ትምህርት
                </span>
              </h1>
              <p className="text-xs text-stone-400">
                NUR AI High School Tutor • Ethiopian Curriculum System
              </p>
            </div>
          </div>

          {/* Stepper Indicator */}
          <div className="flex items-center gap-1 bg-stone-950/80 px-3 py-1.5 rounded-full border border-stone-800 text-xs font-semibold">
            <span
              className={`px-2 py-0.5 rounded-full transition-all ${
                step === 1 ? 'bg-amber-400 text-stone-950 font-bold' : 'text-stone-400'
              }`}
            >
              1. ቋንቋ
            </span>
            <span className="text-stone-600">•</span>
            <span
              className={`px-2 py-0.5 rounded-full transition-all ${
                step === 2 ? 'bg-amber-400 text-stone-950 font-bold' : 'text-stone-400'
              }`}
            >
              2. ክፍል
            </span>
            <span className="text-stone-600">•</span>
            <span
              className={`px-2 py-0.5 rounded-full transition-all ${
                step === 3 ? 'bg-amber-400 text-stone-950 font-bold' : 'text-stone-400'
              }`}
            >
              3. መለያ
            </span>
            <span className="text-stone-600">•</span>
            <span
              className={`px-2 py-0.5 rounded-full transition-all ${
                step === 4 ? 'bg-amber-400 text-stone-950 font-bold' : 'text-stone-400'
              }`}
            >
              4. ክፍያ
            </span>
            <span className="text-stone-600">•</span>
            <span
              className={`px-2 py-0.5 rounded-full transition-all ${
                step === 5 ? 'bg-emerald-400 text-stone-950 font-bold' : 'text-stone-400'
              }`}
            >
              5. ማረጋገጫ
            </span>
          </div>
        </div>

        {/* Content Body based on Step */}
        <div className="p-5 sm:p-8">
          {/* ========================================================================= */}
          {/* SCREEN 1: LANGUAGE SELECTION                                              */}
          {/* ========================================================================= */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="text-center space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-800 text-amber-400 text-xs font-semibold border border-stone-700">
                  <Globe className="w-3.5 h-3.5" />
                  <span>ደረጃ 1 / 5 • ቋንቋ ይምረጡ (Choose Language)</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white font-serif-ethiopic">
                  የመማሪያ ቋንቋዎን ይምረጡ
                </h2>
                <p className="text-sm text-stone-400 max-w-md mx-auto">
                  Select your preferred language. The chosen language will be saved to your student profile and applied across the entire app.
                </p>
              </div>

              {/* Language Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                {[
                  {
                    code: 'am' as LanguageCode,
                    name: 'Amharic',
                    native: 'አማርኛ',
                    desc: 'የአማርኛ ቋንቋ ስርዓተ-ትምህርት እና የ AI አስተማሪ',
                    flag: '🇪🇹',
                  },
                  {
                    code: 'om' as LanguageCode,
                    name: 'Afaan Oromo',
                    native: 'Afaan Oromoo',
                    desc: 'Sirna barnootaa Afaan Oromootiin fi barsiisaa AI',
                    flag: '🌳',
                  },
                  {
                    code: 'ti' as LanguageCode,
                    name: 'Tigrinya',
                    native: 'ትግርኛ',
                    desc: 'ብትግርኛ ቋንቋ ዝተዳለወ ስርዓተ ትምህርቲን AI መምህርን',
                    flag: '🇪🇹',
                  },
                  {
                    code: 'en' as LanguageCode,
                    name: 'English',
                    native: 'English',
                    desc: 'Full English curriculum textbooks and AI tutor explanation',
                    flag: '🌐',
                  },
                ].map((langItem) => {
                  const isSelected = chosenLang === langItem.code;
                  return (
                    <button
                      key={langItem.code}
                      type="button"
                      onClick={() => setChosenLang(langItem.code)}
                      className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                        isSelected
                          ? 'bg-amber-500/10 border-amber-500 text-white shadow-lg ring-2 ring-amber-500/40'
                          : 'bg-stone-900/60 border-stone-700/70 text-stone-300 hover:border-stone-500 hover:bg-stone-900'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <span className="text-2xl">{langItem.flag}</span>
                          <div>
                            <span className="text-lg font-black text-white block">
                              {langItem.native}
                            </span>
                            <span className="text-xs text-stone-400 font-medium">
                              {langItem.name}
                            </span>
                          </div>
                        </div>
                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                            isSelected
                              ? 'bg-amber-500 border-amber-500 text-stone-950'
                              : 'border-stone-600'
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                      </div>
                      <p className="text-xs text-stone-400 leading-relaxed">{langItem.desc}</p>
                    </button>
                  );
                })}
              </div>

              {/* Action Button */}
              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={handleConfirmLanguage}
                  className="w-full sm:w-auto px-7 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>ቀጥል (Continue to Grade Selection)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SCREEN 2: GRADE SELECTION                                                 */}
          {/* ========================================================================= */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="text-center space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-800 text-amber-400 text-xs font-semibold border border-stone-700">
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>ደረጃ 2 / 5 • ክፍል ይምረጡ (Select Grade)</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white font-serif-ethiopic">
                  የምትማሩበትን የክፍል ደረጃ ይምረጡ
                </h2>
                <p className="text-sm text-stone-400 max-w-lg mx-auto">
                  Your grade determines your textbooks, curriculum, AI Tutor topics, matric exams, and monthly subscription price.
                </p>
              </div>

              {/* 4 Grade Options Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                {[
                  {
                    grade: 9 as Grade,
                    label: '9ኛ ክፍል (Grade 9)',
                    badge: 'መሰረታዊ 2ኛ ደረጃ',
                    price: 160,
                    subjects: 'Mathematics, Physics, Chemistry, Biology, English...',
                    desc: 'የአዲሱ ስርዓተ-ትምህርት 10+ የመማሪያ መጻሕፍት እና የ AI ማብራሪያ',
                  },
                  {
                    grade: 10 as Grade,
                    label: '10ኛ ክፍል (Grade 10)',
                    badge: 'የብሔራዊ ፈተና ዝግጅት',
                    price: 180,
                    subjects: 'Advanced Math, Physics, Chemistry, Biology, History...',
                    desc: 'የ10ኛ ክፍል አዲስ ስርዓተ-ትምህርት እና የምዘና ሞተሮች',
                  },
                  {
                    grade: 11 as Grade,
                    label: '11ኛ ክፍል (Grade 11)',
                    badge: 'የተፈጥሮ & ማህበራዊ ሳይንስ',
                    price: 200,
                    subjects: 'Natural Science & Social Science Pathways',
                    desc: 'የዩኒቨርሲቲ መግቢያ መሰረት፣ የላብራቶሪ ማስመሰያዎች እና ፈተናዎች',
                  },
                  {
                    grade: 12 as Grade,
                    label: '12ኛ ክፍል (Grade 12)',
                    badge: 'የዩኒቨርሲቲ መግቢያ ማትሪክ',
                    price: 200,
                    subjects: 'National University Entrance Matric Exam Prep',
                    desc: 'የማትሪክ ፈተናዎች፣ አዳዲስ መጻሕፍትና የፈተና ጥያቄዎች አጠቃላይ ስብስብ',
                  },
                ].map((g) => {
                  const isSelected = chosenGrade === g.grade;
                  return (
                    <button
                      key={g.grade}
                      type="button"
                      onClick={() => setChosenGrade(g.grade)}
                      className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-3 relative overflow-hidden ${
                        isSelected
                          ? 'bg-amber-500/10 border-amber-500 text-white shadow-lg ring-2 ring-amber-500/40'
                          : 'bg-stone-900/60 border-stone-700/70 text-stone-300 hover:border-stone-500 hover:bg-stone-900'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="text-lg font-black text-white font-serif-ethiopic">
                            {g.label}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                            {g.price} ETB / ወር
                          </span>
                        </div>
                        <span className="inline-block px-2 py-0.5 rounded-md bg-stone-800 text-[11px] font-semibold text-stone-300 mb-2">
                          {g.badge}
                        </span>
                        <p className="text-xs text-stone-400 line-clamp-2">{g.desc}</p>
                      </div>

                      <div className="pt-2 border-t border-stone-800/80 flex items-center justify-between text-xs text-stone-400">
                        <span className="truncate max-w-[200px]">{g.subjects}</span>
                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                            isSelected
                              ? 'bg-amber-500 border-amber-500 text-stone-950'
                              : 'border-stone-600'
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Navigation buttons */}
              <div className="pt-4 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-5 py-3 rounded-2xl border border-stone-700 text-stone-300 hover:bg-stone-800 text-sm font-semibold flex items-center gap-2 cursor-pointer transition-all"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>ወደ ቋንቋ ተመለስ (Back)</span>
                </button>

                <button
                  type="button"
                  onClick={handleConfirmGrade}
                  className="px-7 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm flex items-center gap-2 shadow-lg cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>ቀጥል (Continue to Account & Login)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SCREEN 3: LOGIN / REGISTER & PASSWORD RECOVERY                            */}
          {/* ========================================================================= */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Header */}
              <div className="text-center space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-800 text-amber-400 text-xs font-semibold border border-stone-700">
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>ደረጃ 3 / 5 • የተማሪ መለያ (Student Authentication)</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white font-serif-ethiopic">
                  {authMode === 'login' ? 'ወደ መለያዎ ይግቡ (Sign In)' : 'አዲስ የተማሪ መለያ ይመዝግቡ (Register)'}
                </h2>
                <p className="text-sm text-stone-400 max-w-md mx-auto">
                  {authMode === 'login'
                    ? 'በስልክ ቁጥርዎ ወይም በኢሜይልዎ እና በይለፍ ቃልዎ ይግቡ።'
                    : 'ሙሉ ስምዎን እና ስልክ ቁጥርዎን በማስገባት የተማሪ መለያዎን ይፍጠሩ።'}
                </p>
              </div>

              {/* Mode Toggle Pills (Login / Register) */}
              <div className="flex p-1 bg-stone-950 rounded-2xl border border-stone-800 max-w-xs mx-auto">
                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    authMode === 'login'
                      ? 'bg-amber-500 text-stone-950 shadow-md'
                      : 'text-stone-400 hover:text-white'
                  }`}
                >
                  <span>መግቢያ (LOGIN)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMode('register')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    authMode === 'register'
                      ? 'bg-amber-500 text-stone-950 shadow-md'
                      : 'text-stone-400 hover:text-white'
                  }`}
                >
                  <span>ምዝገባ (REGISTER)</span>
                </button>
              </div>

              {/* Sub-form: LOGIN */}
              {authMode === 'login' && (
                <form onSubmit={handleLoginSubmit} className="space-y-4 max-w-md mx-auto">
                  {loginError && (
                    <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{loginError}</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                      ስልክ ቁጥር ወይም ኢሜይል (Phone or Email) *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-500">
                        <Phone className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        value={loginIdentifier}
                        onChange={(e) => setLoginIdentifier(e.target.value)}
                        placeholder="0912345678 or student@email.com"
                        required
                        className="w-full pl-10 pr-4 py-2.5 bg-stone-900 border border-stone-700 rounded-xl text-sm text-white placeholder-stone-500 focus:outline-none focus:border-amber-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-semibold text-stone-300">
                        የይለፍ ቃል (Password) *
                      </label>
                      <button
                        type="button"
                        onClick={() => setIsForgotOpen(true)}
                        className="text-xs text-amber-400 hover:underline cursor-pointer"
                      >
                        የይለፍ ቃል ረሱ? (Forgot?)
                      </button>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-500">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type={showLoginPassword ? 'text' : 'password'}
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="w-full pl-10 pr-10 py-2.5 bg-stone-900 border border-stone-700 rounded-xl text-sm text-white placeholder-stone-500 focus:outline-none focus:border-amber-500 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-500 hover:text-stone-300 cursor-pointer"
                      >
                        {showLoginPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoggingIn}
                    className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg cursor-pointer transition-all disabled:opacity-50"
                  >
                    {isLoggingIn ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <span>ወደ መለያ ግባ (Sign In)</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  {/* Demo Credential Buttons for Testing / Verification */}
                  <div className="pt-3 border-t border-stone-800 text-center space-y-2">
                    <p className="text-[11px] text-stone-500">ለፈጣን ሙከራ (Quick Evaluation Accounts):</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      <button
                        type="button"
                        onClick={() => {
                          setLoginIdentifier('mejennur669@gmail.com');
                          setLoginPassword('admin123456');
                        }}
                        className="px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-stone-750 text-[11px] text-amber-400 border border-stone-700 font-mono cursor-pointer"
                      >
                        👑 Super Admin Demo
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setLoginIdentifier('student.demo@nur.et');
                          setLoginPassword('student123456');
                        }}
                        className="px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-stone-750 text-[11px] text-stone-300 border border-stone-700 font-mono cursor-pointer"
                      >
                        🎓 Student Demo
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {/* Sub-form: REGISTER */}
              {authMode === 'register' && (
                <form onSubmit={handleRegisterSubmit} className="space-y-3.5 max-w-md mx-auto">
                  {regError && (
                    <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{regError}</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-stone-300 mb-1">
                      ሙሉ ስም (Full Name) *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-500">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        value={regFullName}
                        onChange={(e) => setRegFullName(e.target.value)}
                        placeholder="e.g. Abebe Kebede"
                        required
                        className="w-full pl-10 pr-4 py-2 bg-stone-900 border border-stone-700 rounded-xl text-sm text-white placeholder-stone-500 focus:outline-none focus:border-amber-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-300 mb-1">
                      ስልክ ቁጥር (Phone Number) *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-500">
                        <Phone className="w-4 h-4" />
                      </div>
                      <input
                        type="tel"
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        placeholder="0912345678"
                        required
                        className="w-full pl-10 pr-4 py-2 bg-stone-900 border border-stone-700 rounded-xl text-sm text-white placeholder-stone-500 focus:outline-none focus:border-amber-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-300 mb-1">
                      ኢሜይል (Email) <span className="text-stone-500 font-normal">- አማራጭ (Optional)</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-500">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="email"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="student@example.com"
                        className="w-full pl-10 pr-4 py-2 bg-stone-900 border border-stone-700 rounded-xl text-sm text-white placeholder-stone-500 focus:outline-none focus:border-amber-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-stone-300 mb-1">
                        የይለፍ ቃል (Password) *
                      </label>
                      <input
                        type={showRegPassword ? 'text' : 'password'}
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="Min 6 chars"
                        required
                        className="w-full px-3.5 py-2 bg-stone-900 border border-stone-700 rounded-xl text-sm text-white placeholder-stone-500 focus:outline-none focus:border-amber-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-300 mb-1">
                        ይለፍ ቃል ያረጋግጡ *
                      </label>
                      <input
                        type={showRegPassword ? 'text' : 'password'}
                        value={regConfirmPassword}
                        onChange={(e) => setRegConfirmPassword(e.target.value)}
                        placeholder="Confirm"
                        required
                        className="w-full px-3.5 py-2 bg-stone-900 border border-stone-700 rounded-xl text-sm text-white placeholder-stone-500 focus:outline-none focus:border-amber-500 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Selected Language & Grade Badges */}
                  <div className="p-2.5 rounded-xl bg-stone-950 border border-stone-800 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-stone-400">የተመረጠ ክፍል፡</span>
                      <span className="font-bold text-amber-400">ክፍል {chosenGrade}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-stone-400">ቋንቋ፡</span>
                      <span className="font-bold text-emerald-400 uppercase">{chosenLang}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isRegistering}
                    className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg cursor-pointer transition-all disabled:opacity-50 mt-2"
                  >
                    {isRegistering ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <span>ተመዝገብና ወደ ክፍያ ቀጥል (Register & Pay)</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Navigation Back */}
              <div className="pt-2 flex justify-start">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-5 py-2.5 rounded-2xl border border-stone-700 text-stone-400 hover:text-white hover:bg-stone-800 text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>ወደ ክፍል ምርጫ ተመለስ (Back to Grade)</span>
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SCREEN 4: PAYMENT SYSTEM                                                  */}
          {/* ========================================================================= */}
          {step === 4 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Header */}
              <div className="text-center space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-800 text-amber-400 text-xs font-semibold border border-stone-700">
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>ደረጃ 4 / 5 • የአባልነት ክፍያ (Subscription Payment)</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white font-serif-ethiopic">
                  የ{chosenGrade}ኛ ክፍል ወርሃዊ ክፍያ ፈጽሙ
                </h2>
                <p className="text-sm text-stone-400 max-w-lg mx-auto">
                  Monthly fee for Grade {chosenGrade} is{' '}
                  <span className="text-amber-400 font-bold">{gradePrice} ETB</span>. Pay using Telebirr, CBE, Dashen, or Bank of Abyssinia, then submit your transaction reference.
                </p>
              </div>

              {/* Price Banner Card */}
              <div className="p-4 rounded-2xl bg-stone-900 border border-amber-500/40 flex flex-wrap items-center justify-between gap-3 shadow-md">
                <div>
                  <span className="text-xs text-stone-400 font-medium block">
                    የተመረጠ የክፍል ደረጃ (Selected Grade Plan)
                  </span>
                  <span className="text-lg font-black text-white font-serif-ethiopic">
                    {chosenGrade}ኛ ክፍል • ሙሉ የመማሪያ መጻሕፍትና የ AI አስተማሪ
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-amber-400 font-mono block">
                    {gradePrice} ETB
                  </span>
                  <span className="text-[11px] text-stone-400">ለ 30 ቀናት (Monthly Plan)</span>
                </div>
              </div>

              {/* 4 Official Payment Methods Tabs */}
              <div className="space-y-3">
                <label className="block text-xs font-semibold text-stone-300">
                  የመክፈያ ዘዴ ይምረጡ (Choose Payment Method) *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {(
                    [
                      'Telebirr',
                      'Commercial Bank of Ethiopia (CBE)',
                      'Dashen Bank',
                      'Bank of Abyssinia',
                    ] as PaymentMethodName[]
                  ).map((mName) => {
                    const isSelected = selectedMethod === mName;
                    const cfg = pricingConfig.methods[mName];
                    return (
                      <button
                        key={mName}
                        type="button"
                        onClick={() => setSelectedMethod(mName)}
                        className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                          isSelected
                            ? 'bg-amber-500/10 border-amber-500 text-white ring-2 ring-amber-500/40 shadow-md'
                            : 'bg-stone-900/60 border-stone-800 text-stone-400 hover:border-stone-700 hover:bg-stone-900'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          {mName === 'Telebirr' && <Smartphone className="w-5 h-5 text-amber-400" />}
                          {mName.includes('CBE') && <Building2 className="w-5 h-5 text-purple-400" />}
                          {mName === 'Dashen Bank' && <Landmark className="w-5 h-5 text-blue-400" />}
                          {mName === 'Bank of Abyssinia' && <Landmark className="w-5 h-5 text-amber-500" />}
                          {isSelected && <Check className="w-4 h-4 text-amber-400 stroke-[3]" />}
                        </div>
                        <div>
                          <span className="text-xs font-black text-white block truncate">
                            {mName === 'Telebirr'
                              ? 'ቴሌብር'
                              : mName.includes('CBE')
                              ? 'ንግድ ባንክ (CBE)'
                              : mName === 'Dashen Bank'
                              ? 'ዳሸን ባንክ'
                              : 'አቢሲኒያ ባንክ'}
                          </span>
                          <span className="text-[10px] text-stone-500 block truncate">{mName}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Active Payment Method Bank Account Details */}
              {activeMethodConfig && (
                <div className="p-4 sm:p-5 rounded-2xl bg-stone-950 border border-stone-800 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-stone-850">
                    <div>
                      <span className="text-xs text-stone-400 block">የሂሳብ ባለቤት (Account Name)</span>
                      <span className="text-sm font-bold text-white">
                        {activeMethodConfig.accountName}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm sm:text-base font-black text-amber-400 font-mono tracking-wider">
                        {activeMethodConfig.accountNumber}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          copyToClipboard(activeMethodConfig.accountNumber, 'acc_num')
                        }
                        className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 cursor-pointer"
                        title="Copy Account Number"
                      >
                        {copiedKey === 'acc_num' ? (
                          <Check className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-stone-300 leading-relaxed font-serif-ethiopic">
                    {chosenLang === 'am'
                      ? activeMethodConfig.instructionsAm
                      : activeMethodConfig.instructionsEn}
                  </p>
                </div>
              )}

              {/* Payment Submission Form */}
              <form onSubmit={handlePaymentSubmit} className="space-y-4">
                {paymentError && (
                  <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{paymentError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                    የግብይት ማረጋገጫ ቁጥር / SMS ኮድ (Transaction Reference / FT Number) *
                  </label>
                  <input
                    type="text"
                    value={txRef}
                    onChange={(e) => setTxRef(e.target.value)}
                    placeholder="e.g. TL948291024 or FT240989012"
                    required
                    className="w-full px-4 py-3 bg-stone-900 border border-stone-700 rounded-xl text-sm text-white placeholder-stone-500 focus:outline-none focus:border-amber-500 font-mono tracking-wider"
                  />
                  <span className="text-[11px] text-stone-500 mt-1 block">
                    ከቴሌብር ወይም ከባንኩ የደረሰዎትን የማረጋገጫ ቁጥር ያስገቡ።
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                    የደረሰኝ ፎቶ (Receipt Screenshot / Proof) <span className="text-stone-500 font-normal">- አማራጭ (Optional)</span>
                  </label>
                  <label className="border-2 border-dashed border-stone-700 hover:border-amber-500 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors bg-stone-900/40">
                    <UploadCloud className="w-6 h-6 text-stone-400" />
                    <span className="text-xs text-stone-300 font-medium">
                      {proofFileName || 'የደረሰኝ ስክሪንሾት ይጫኑ (Upload screenshot)'}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProofImageUpload}
                      className="hidden"
                    />
                  </label>
                  {proofImage && (
                    <div className="mt-2 flex items-center gap-2 text-xs text-emerald-400">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>ደረሰኝ ተመርጧል (Receipt ready for review)</span>
                    </div>
                  )}
                </div>

                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200/90 leading-relaxed">
                  ⚠️ <strong>ማሳሰቢያ (Notice):</strong> ክፍያዎ በዋናው አስተዳዳሪ (Super Admin: {DEVELOPER_INFO.name}) ተረጋግጦ እስከሚፀድቅ ድረስ የትምህርት ክፍሎች አይከፈቱም።
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingPayment}
                  className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm flex items-center justify-center gap-2 shadow-xl cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
                >
                  {isSubmittingPayment ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <span>የክፍያ ማረጋገጫውን አስገባ (Submit Payment for Verification)</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SCREEN 5: PAYMENT VERIFICATION & STATUS                                   */}
          {/* ========================================================================= */}
          {step === 5 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Check status: APPROVED vs PENDING vs REJECTED */}
              {hasLearningAccess || isOwnerSuperAdmin || latestPayment?.status === 'APPROVED' ? (
                /* APPROVED / ACTIVE STATE */
                <div className="text-center space-y-4 py-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-lg">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div className="space-y-1.5">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 inline-block">
                      ክፍያዎ ጸድቋል (SUBSCRIPTION ACTIVE)
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black text-white font-serif-ethiopic">
                      እንኳን ደስ አለዎት! ክፍያዎ በተሳካ ሁኔታ ጸድቋል።
                    </h2>
                    <p className="text-sm text-stone-300 max-w-md mx-auto">
                      የ{chosenGrade}ኛ ክፍል ሙሉ አዳዲስ የመማሪያ መጻሕፍት፣ የ AI አስተማሪ፣ ፈተናዎች እና የላብራቶሪ ማስመሰያዎች ተከፍተውልዎታል።
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800 max-w-md mx-auto text-left space-y-2 text-xs text-stone-300">
                    <div className="flex justify-between">
                      <span className="text-stone-500">ተማሪ (Student):</span>
                      <span className="font-semibold text-white">
                        {userProfile?.displayName || user?.displayName || 'ተማሪ'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">የክፍል ደረጃ (Grade):</span>
                      <span className="font-semibold text-amber-400">{chosenGrade}ኛ ክፍል</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">የአባልነት ጊዜ (Duration):</span>
                      <span className="font-semibold text-emerald-400">30 ቀናት (Active)</span>
                    </div>
                  </div>

                  <div className="pt-3">
                    <button
                      type="button"
                      onClick={onComplete}
                      className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-sm inline-flex items-center justify-center gap-2 shadow-xl cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <BookOpen className="w-4 h-4" />
                      <span>ወደ ተማሪዎች ዳሽቦርድ ግባ (Enter Student Dashboard)</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : latestPayment?.status === 'REJECTED' ? (
                /* REJECTED STATE */
                <div className="text-center space-y-4 py-4">
                  <div className="w-16 h-16 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center mx-auto shadow-lg">
                    <XCircle className="w-8 h-8" />
                  </div>
                  <div className="space-y-1.5">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 inline-block">
                      ክፍያው ተቀባይነት አላገኘም (PAYMENT REJECTED)
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black text-white font-serif-ethiopic">
                      ክፍያዎ አልተረጋገጠም
                    </h2>
                    <p className="text-sm text-stone-300 max-w-md mx-auto">
                      የአስተዳዳሪው አስተያየት (Admin Reason):
                    </p>
                  </div>

                  {/* Rejection Reason Box */}
                  <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 max-w-md mx-auto text-left text-xs text-rose-200">
                    <p className="font-semibold mb-1">ምክንያት (Rejection Reason):</p>
                    <p className="italic">
                      "{latestPayment.rejectionReason || 'ያስገቡት የግብይት ማረጋገጫ ቁጥር ትክክል አይደለም። እባክዎ ትክክለኛውን ኮድ አስገብተው በድጋሚ ይላኩ።'}"
                    </p>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setIsCorrectingPayment(true);
                        setStep(4);
                      }}
                      className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm flex items-center gap-2 cursor-pointer shadow-lg transition-all"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>መረጃውን አስተካክለው በድጋሚ ይላኩ (Correct & Resubmit)</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* PENDING STATE */
                <div className="text-center space-y-4 py-4">
                  <div className="w-16 h-16 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto shadow-lg animate-pulse">
                    <Clock className="w-8 h-8" />
                  </div>
                  <div className="space-y-1.5">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 inline-block">
                      በማረጋገጥ ላይ (VERIFICATION IN PROGRESS)
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black text-white font-serif-ethiopic">
                      ክፍያዎ እየተረጋገጠ ነው...
                    </h2>
                    <p className="text-sm text-stone-300 max-w-md mx-auto">
                      የክፍያ ማረጋገጫዎ ደርሶናል! ዋናው አስተዳዳሪ (Super Admin: {DEVELOPER_INFO.name}) ግብይቱን እያጣራ ነው። እንደተረጋገጠ ሲስተሙ በራሱ ይከፈትልዎታል።
                    </p>
                  </div>

                  {/* Pending Submission Details */}
                  <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800 max-w-md mx-auto text-left space-y-2 text-xs text-stone-300">
                    <div className="flex justify-between">
                      <span className="text-stone-500">የግብይት ቁጥር (Reference):</span>
                      <span className="font-mono text-amber-400">
                        {latestPayment?.transactionReference || txRef || 'TL948291024'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">የመክፈያ ዘዴ (Method):</span>
                      <span className="font-semibold text-white">
                        {latestPayment?.paymentMethod || selectedMethod}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">ክፍያ (Amount):</span>
                      <span className="font-semibold text-white">{gradePrice} ETB</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">ሁኔታ (Status):</span>
                      <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-bold text-[10px]">
                        PENDING
                      </span>
                    </div>
                  </div>

                  {/* Mandatory Zero-Trust Rule Callout */}
                  <div className="p-3.5 rounded-2xl bg-stone-950 border border-stone-800 max-w-md mx-auto text-left text-xs text-stone-400 leading-relaxed">
                    🔒 <strong>የደህንነት መመሪያ (Security Policy):</strong> ክፍያዎ (PENDING) ሆኖ እያለ ትምህርቶችን ማግኘት አይፈቀድም። አስተዳዳሪው እንዳረጋገጠው ይህ ገጽ በራሱ ተቀይሮ ወደ ትምህርት ዳሽቦርድ ያስገባዎታል።
                  </div>

                  {/* Super Admin Evaluation Shortcut */}
                  <div className="pt-4 border-t border-stone-800 max-w-md mx-auto text-center space-y-2">
                    <p className="text-[11px] text-stone-500">
                      የሲስተም ግምገማ / ፈጣን ማጽደቂያ (Super Admin Testing Helper):
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      <button
                        type="button"
                        onClick={async () => {
                          if (latestPayment?.paymentId) {
                            await superAdminApprove(
                              latestPayment.paymentId,
                              latestPayment.userId || user?.uid || '',
                              latestPayment.grade || chosenGrade,
                              latestPayment.amountETB || gradePrice
                            );
                          } else {
                            // Instant approve helper for test
                            onComplete();
                          }
                        }}
                        className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>👑 Super Admin Approve (ማረጋገጫን አጽድቅ)</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Forgot Password Modal */}
      {isForgotOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-stone-900 border border-stone-700 rounded-3xl p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <KeyRound className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-white font-serif-ethiopic">
                  የይለፍ ቃል ማደሻ (Reset Password)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsForgotOpen(false)}
                className="text-stone-400 hover:text-white text-sm cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-stone-400 leading-relaxed">
              የተመዘገቡበትን ኢሜይል ወይም ስልክ ቁጥር ያስገቡ። የይለፍ ቃል መቀየሪያ መመሪያ ይላክልዎታል።
            </p>

            {recoveryError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{recoveryError}</span>
              </div>
            )}

            {recoverySuccess && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{recoverySuccess}</span>
              </div>
            )}

            <form onSubmit={handlePasswordRecovery} className="space-y-3">
              <input
                type="text"
                value={recoveryInput}
                onChange={(e) => setRecoveryInput(e.target.value)}
                placeholder="0912345678 or student@email.com"
                required
                className="w-full px-4 py-2.5 bg-stone-950 border border-stone-700 rounded-xl text-sm text-white placeholder-stone-500 focus:outline-none focus:border-amber-500"
              />

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsForgotOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-stone-400 hover:text-white cursor-pointer"
                >
                  ይቅር (Cancel)
                </button>
                <button
                  type="submit"
                  disabled={isRecovering}
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isRecovering ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <span>የይለፍ ቃል ማደሻ ላክ</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
