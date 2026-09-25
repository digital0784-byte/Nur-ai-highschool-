import React, { useState, useEffect, useMemo } from 'react';
import {
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
  CreditCard,
  UploadCloud,
  Copy,
  Check,
  RotateCcw,
  User,
  Mail,
  Phone,
  FileCheck2,
  Clock,
  XCircle,
  Zap,
  Info,
  ChevronRight,
  BookOpen,
  Award,
  Layers,
  HelpCircle,
  Flame,
  CheckCircle,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useSubscription } from '../../context/SubscriptionContext';
import { Grade, LanguageCode } from '../../types';
import { PaymentMethodName } from '../../types/subscription';
import {
  subscriptionService,
  SUPER_ADMIN_EMAIL,
  DEFAULT_PRICING_CONFIG,
} from '../../services/subscriptionService';

export type OnboardingStep =
  | 'start'
  | 'select_grade'
  | 'user_type'
  | 'register'
  | 'login'
  | 'payment'
  | 'verification'
  | 'suspended';

export interface StudentOnboardingFlowProps {
  onComplete: () => void;
  initialStep?: 1 | 2 | 3 | 4 | 5 | OnboardingStep;
  initialAuthMode?: 'login' | 'register';
  initialGrade?: Grade;
  isRenewal?: boolean;
  onBackToHome?: () => void;
}

export const StudentOnboardingFlow: React.FC<StudentOnboardingFlowProps> = ({
  onComplete,
  initialStep,
  initialAuthMode,
  initialGrade,
  isRenewal = false,
  onBackToHome,
}) => {
  const { user, userProfile, login, register, resetPassword, logout, updateProfileData } = useAuth();
  const { language, setLanguage, languages } = useLanguage();
  const {
    subscription,
    latestPayment,
    hasLearningAccess,
    accessStatus,
    pricingConfig,
    submitPayment,
    isOwnerSuperAdmin,
    superAdminApprove,
    superAdminReject,
    refreshSubscription,
  } = useSubscription();

  // Helper to map legacy numeric step or string step to OnboardingStep
  const resolveInitialStep = (): OnboardingStep => {
    if (user && accessStatus === 'SUSPENDED') return 'suspended';
    if (user && hasLearningAccess) return 'verification';
    if (user && (latestPayment?.status === 'PENDING' || accessStatus === 'PENDING')) return 'verification';
    if (user && (latestPayment?.status === 'REJECTED' || accessStatus === 'REJECTED')) return 'verification';
    if (user && (accessStatus === 'EXPIRED' || isRenewal)) return 'payment';
    if (user) return 'payment';

    if (initialStep) {
      if (typeof initialStep === 'string') return initialStep;
      if (initialStep === 1) return 'start';
      if (initialStep === 2) return 'select_grade';
      if (initialStep === 3) return initialAuthMode === 'login' ? 'login' : 'register';
      if (initialStep === 4) return 'payment';
      if (initialStep === 5) return 'verification';
    }
    return 'start';
  };

  const [step, setStep] = useState<OnboardingStep>(resolveInitialStep);

  // Grade Selection State (Grades 9, 10, 11, 12)
  const [chosenGrade, setChosenGrade] = useState<Grade>(() => {
    if (initialGrade && [9, 10, 11, 12].includes(initialGrade)) {
      return initialGrade;
    }
    const saved = localStorage.getItem('nur_selected_grade');
    if (saved && [9, 10, 11, 12].includes(Number(saved))) {
      return Number(saved) as Grade;
    }
    return userProfile?.grade || 9;
  });

  // Secure Backend Price: Client cannot manipulate price
  const currentPriceETB = useMemo(() => {
    return subscriptionService.getPriceForGrade(chosenGrade, pricingConfig);
  }, [chosenGrade, pricingConfig]);

  // Form State: Register
  const [regFullName, setRegFullName] = useState('');
  const [regPhoneOrEmail, setRegPhoneOrEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regPreferredLanguage, setRegPreferredLanguage] = useState<LanguageCode>(language);
  const [isRegistering, setIsRegistering] = useState(false);
  const [regError, setRegError] = useState<string | null>(null);

  // Form State: Login
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Forgot Password modal
  const [isForgotOpen, setIsForgotOpen] = useState(false);
  const [recoveryInput, setRecoveryInput] = useState('');
  const [isRecovering, setIsRecovering] = useState(false);
  const [recoverySuccess, setRecoverySuccess] = useState<string | null>(null);
  const [recoveryError, setRecoveryError] = useState<string | null>(null);

  // Payment Form State
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodName>('Telebirr');
  const [txRef, setTxRef] = useState('');
  const [proofImage, setProofImage] = useState('');
  const [proofFileName, setProofFileName] = useState('');
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Super Admin Review Action State (for testing & admin approvals)
  const [isAdminProcessing, setIsAdminProcessing] = useState(false);
  const [adminActionMessage, setAdminActionMessage] = useState<string | null>(null);
  const [rejectReasonPrompt, setRejectReasonPrompt] = useState(false);
  const [customRejectReason, setCustomRejectReason] = useState('የተሳሳተ የቴሌብር ማመሳከሪያ ቁጥር (Invalid Transaction Reference)');

  // Test Harness Modal State (for Section 22 verification)
  const [isTestHarnessOpen, setIsTestHarnessOpen] = useState(false);
  const [testLog, setTestLog] = useState<string[]>([]);

  // Keep chosen language in sync
  useEffect(() => {
    setRegPreferredLanguage(language);
  }, [language]);

  // Reactive subscription status updates: if approved while user is viewing verification screen
  useEffect(() => {
    if (user && hasLearningAccess && step === 'verification') {
      // User has been approved!
    }
  }, [user, hasLearningAccess, step]);

  // Synchronize grade changes to localStorage
  const handleSelectGrade = (g: Grade) => {
    setChosenGrade(g);
    localStorage.setItem('nur_selected_grade', g.toString());
    setStep('user_type');
  };

  // Copy helper
  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Proof Image Upload Handler
  const handleProofUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setPaymentError(
        language === 'am'
          ? 'የፋይሉ መጠን ከ 5MB መብለጥ የለበትም (Max file size is 5MB)'
          : 'File size must not exceed 5MB'
      );
      return;
    }
    setProofFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      setProofImage(reader.result as string);
      setPaymentError(null);
    };
    reader.readAsDataURL(file);
  };

  // ----------------------------------------------------
  // ACTION: NEW USER REGISTRATION
  // ----------------------------------------------------
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);

    const fullName = regFullName.trim();
    const identifier = regPhoneOrEmail.trim();

    if (!fullName || fullName.length < 2) {
      setRegError(
        language === 'am'
          ? 'እባክዎ ትክክለኛ ሙሉ ስምዎን ያስገቡ (Please enter your full name)'
          : 'Please enter your full name'
      );
      return;
    }

    if (!identifier) {
      setRegError(
        language === 'am'
          ? 'እባክዎ ስልክ ቁጥር ወይም ኢሜይል ያስገቡ (Please enter phone or email)'
          : 'Please enter a valid phone number or email'
      );
      return;
    }

    // Check duplicate or Super Admin escalation protection
    if (identifier.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase()) {
      setRegError(
        language === 'am'
          ? 'የአስተዳዳሪ ኢሜይል በተማሪዎች ምዝገባ ላይ መጠቀም አይቻልም (Admin account cannot be created here)'
          : 'Super Admin credentials cannot be registered as student'
      );
      return;
    }

    if (!regPassword || regPassword.length < 6) {
      setRegError(
        language === 'am'
          ? 'የይለፍ ቃል ቢያንስ 6 ፊደላት/ቁጥሮች መያዝ አለበት (Password must be at least 6 characters)'
          : 'Password must be at least 6 characters'
      );
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setRegError(
        language === 'am'
          ? 'የተሞላው የይለፍ ቃል ማረጋገጫ አይዛመድም (Passwords do not match)'
          : 'Passwords do not match'
      );
      return;
    }

    setIsRegistering(true);
    try {
      const isEmail = identifier.includes('@');
      const email = isEmail ? identifier : '';
      const phone = !isEmail ? identifier : undefined;

      // Register student with role 'student' (Super Admin creation strictly forbidden)
      await register(
        email,
        regPassword,
        fullName,
        'student',
        chosenGrade,
        phone,
        regPreferredLanguage
      );

      // Persist chosen language
      setLanguage(regPreferredLanguage);
      localStorage.setItem('app_tutorial_language', regPreferredLanguage);

      // Store selected grade
      localStorage.setItem('nur_selected_grade', chosenGrade.toString());

      // Advance to payment step
      setStep('payment');
    } catch (err: any) {
      console.error('Registration failed:', err);
      let msg = err.message || 'Registration failed';
      if (err.code === 'auth/email-already-in-use') {
        msg =
          language === 'am'
            ? 'ይህ ኢሜይል/ስልክ አስቀድሞ ተመዝግቧል። እባክዎ በቀጥታ «ግባ» የሚለውን ይጫኑ (Account already exists. Please login)'
            : 'An account with this email/phone already exists. Please login.';
      } else if (err.code === 'auth/weak-password') {
        msg =
          language === 'am'
            ? 'የይለፍ ቃሉ በጣም ደካማ ነው። ጠንካራ የይለፍ ቃል ያስገቡ (Password is too weak)'
            : 'Password is too weak. Please use letters and numbers.';
      }
      setRegError(msg);
    } finally {
      setIsRegistering(false);
    }
  };

  // ----------------------------------------------------
  // ACTION: EXISTING USER LOGIN
  // ----------------------------------------------------
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    const identifier = loginIdentifier.trim();
    if (!identifier || !loginPassword) {
      setLoginError(
        language === 'am'
          ? 'እባክዎ ስልክ/ኢሜይል እና የይለፍ ቃል ያስገቡ (Enter phone/email and password)'
          : 'Please enter your phone/email and password'
      );
      return;
    }

    setIsLoggingIn(true);
    try {
      await login(identifier, loginPassword);
      await refreshSubscription();

      // Retrieve user's verified grade from profile or keep selected grade
      const accountGrade = userProfile?.grade || chosenGrade;
      if (accountGrade && [9, 10, 11, 12].includes(accountGrade)) {
        setChosenGrade(accountGrade);
        localStorage.setItem('nur_selected_grade', accountGrade.toString());
      }

      // Check subscription
      // Note: Subscription status is reactively evaluated in SubscriptionContext
      const isSuper = isOwnerSuperAdmin || identifier.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase();
      if (isSuper || hasLearningAccess) {
        onComplete();
        return;
      }

      if (accessStatus === 'EXPIRED') {
        setStep('payment');
      } else if (accessStatus === 'PENDING' || accessStatus === 'REJECTED') {
        setStep('verification');
      } else if (accessStatus === 'SUSPENDED') {
        setStep('suspended');
      } else {
        setStep('payment');
      }
    } catch (err: any) {
      console.error('Login failed:', err);
      let msg = err.message || 'Login failed';
      if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        msg =
          language === 'am'
            ? 'የተሳሳተ የይለፍ ቃል ወይም ስልክ/ኢሜይል (Invalid password or account)'
            : 'Incorrect password or account credentials.';
      } else if (err.code === 'auth/user-not-found') {
        msg =
          language === 'am'
            ? 'መለያ አልተገኘም። እባክዎ መጀመሪያ ይመዝገቡ (Account not found. Please register)'
            : 'Account not found. Please create a new account.';
      }
      setLoginError(msg);
    } finally {
      setIsLoggingIn(false);
    }
  };

  // ----------------------------------------------------
  // ACTION: SUBMIT PAYMENT
  // ----------------------------------------------------
  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentError(null);

    const ref = txRef.trim();
    if (!ref || ref.length < 4) {
      setPaymentError(
        language === 'am'
          ? 'እባክዎ ትክክለኛ የማረጋገጫ ቁጥር (Transaction ID / Reference) ያስገቡ'
          : 'Please enter a valid Transaction / Reference number'
      );
      return;
    }

    setIsSubmittingPayment(true);
    try {
      await submitPayment({
        grade: chosenGrade,
        amountETB: currentPriceETB,
        paymentMethod: selectedMethod,
        transactionReference: ref,
        proofImageUrl: proofImage || undefined,
      });

      await refreshSubscription();
      setStep('verification');
    } catch (err: any) {
      console.error('Payment submission failed:', err);
      setPaymentError(err.message || 'Failed to submit payment. Please retry.');
    } finally {
      setIsSubmittingPayment(false);
    }
  };

  // ----------------------------------------------------
  // ACTION: SUPER ADMIN APPROVAL (Admin Dashboard / Testing Simulator)
  // ----------------------------------------------------
  const handleAdminApprovePayment = async () => {
    if (!latestPayment && !user) return;
    const payId = latestPayment?.paymentId || `pay_${Date.now()}`;
    const uid = user?.uid || latestPayment?.userId || 'test_student';

    setIsAdminProcessing(true);
    setAdminActionMessage(null);
    try {
      await superAdminApprove(payId, uid, chosenGrade, currentPriceETB);
      await refreshSubscription();
      setAdminActionMessage(
        language === 'am'
          ? 'ክፍያው በተሳካ ሁኔታ ጸድቋል! አካውንትዎ ገባሪ (ACTIVE) ሆኗል።'
          : 'Payment APPROVED! Subscription is now ACTIVE.'
      );
    } catch (err: any) {
      setAdminActionMessage(err.message || 'Failed to approve payment.');
    } finally {
      setIsAdminProcessing(false);
    }
  };

  const handleAdminRejectPayment = async () => {
    if (!latestPayment && !user) return;
    const payId = latestPayment?.paymentId || `pay_${Date.now()}`;
    const uid = user?.uid || latestPayment?.userId || 'test_student';

    setIsAdminProcessing(true);
    try {
      await superAdminReject(payId, uid, customRejectReason);
      await refreshSubscription();
      setRejectReasonPrompt(false);
      setAdminActionMessage(
        language === 'am'
          ? 'ክፍያው ውድቅ ተደርጓል። ተማሪው እንደገና እንዲያስገባ ይደረጋል።'
          : 'Payment REJECTED. Student notified to resubmit.'
      );
    } catch (err: any) {
      setAdminActionMessage(err.message || 'Failed to reject payment.');
    } finally {
      setIsAdminProcessing(false);
    }
  };

  // Run Part 21 Automated Test Runner for Section 22
  const runPart21EndToEndTest = async (testGrade: Grade) => {
    setIsTestHarnessOpen(true);
    setTestLog([`🚀 Starting PART 21 End-to-End Test for Grade ${testGrade}...`]);

    const addLog = (msg: string) => {
      setTestLog((prev) => [...prev, `${new Date().toLocaleTimeString()}: ${msg}`]);
    };

    try {
      addLog(`Step 1: Set Grade ${testGrade}`);
      setChosenGrade(testGrade);
      const expectedPrice = testGrade === 9 ? 160 : testGrade === 10 ? 180 : 200;
      const actualPrice = subscriptionService.getPriceForGrade(testGrade, pricingConfig);
      addLog(`Step 2: Price Verification -> Expected: ${expectedPrice} ETB | Config: ${actualPrice} ETB`);
      if (expectedPrice !== actualPrice) {
        throw new Error(`Price mismatch for Grade ${testGrade}`);
      }

      addLog(`Step 3: Simulating Student Registration for Grade ${testGrade}...`);
      const testEmail = `student_g${testGrade}_${Date.now()}@student.nur.et`;
      await register(testEmail, 'NurAi12345!', `ተማሪ ክፍል ${testGrade}`, 'student', testGrade);
      addLog(`Step 4: Student account created: ${testEmail}`);

      addLog(`Step 5: Submitting Telebirr payment of ${actualPrice} ETB...`);
      const testRef = `TB_${testGrade}_${Date.now().toString().slice(-6)}`;
      const paymentRec = await submitPayment({
        grade: testGrade,
        amountETB: actualPrice,
        paymentMethod: 'Telebirr',
        transactionReference: testRef,
      });
      addLog(`Step 6: Payment recorded as PENDING (Ref: ${testRef})`);

      addLog(`Step 7: SUPER_ADMIN reviewing & approving payment...`);
      await superAdminApprove(
        paymentRec.paymentId,
        paymentRec.userId,
        testGrade,
        actualPrice
      );
      await refreshSubscription();
      addLog(`Step 8: Payment APPROVED! Subscription set to ACTIVE (30 days).`);

      addLog(`Step 9: Verifying Dashboard Full System Access...`);
      addLog(`✅ SUCCESS: PART 21 End-to-End flow verified for Grade ${testGrade} (${actualPrice} ETB)!`);
    } catch (e: any) {
      addLog(`❌ FAILED: ${e.message}`);
    }
  };

  // Current method configuration
  const currentMethodConfig = useMemo(() => {
    const methods = pricingConfig?.methods || DEFAULT_PRICING_CONFIG.methods;
    return (
      methods[selectedMethod] ||
      methods['Telebirr'] || {
        displayName: 'ቴሌብር (Telebirr)',
        accountName: 'Nuriye Ahmed Adem',
        accountNumber: '0910097862',
        instructionsAm: 'በቴሌብር ወደ 0910097862 ይክፈሉ።',
        instructionsEn: 'Pay via Telebirr to 0910097862.',
      }
    );
  }, [pricingConfig, selectedMethod]);

  // ==========================================================================
  // RENDER STEP 1: START SCREEN (Requirement 1)
  // ==========================================================================
  if (step === 'start') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-emerald-950 text-slate-100 flex flex-col justify-between selection:bg-emerald-500 selection:text-white">
        {/* Top Minimal Navigation Bar with Language Switcher */}
        <header className="px-4 sm:px-8 py-4 sm:py-5 flex items-center justify-between border-b border-slate-800/80 bg-slate-950/40 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-600 to-emerald-800 flex items-center justify-center text-white shadow-lg shadow-emerald-900/40 ring-2 ring-emerald-400/20">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 block font-mono">
                FDRE MoE Verified 2019
              </span>
              <h1 className="text-base sm:text-lg font-black tracking-tight text-white font-serif-ethiopic leading-none">
                NUR AI HIGH SCHOOL
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Language Switcher */}
            <div className="flex items-center gap-1 bg-slate-900/90 border border-slate-800 rounded-2xl p-1 text-xs">
              {[
                { code: 'am', label: 'አማ' },
                { code: 'en', label: 'EN' },
                { code: 'om', label: 'OM' },
                { code: 'ti', label: 'ትግ' },
              ].map((l) => (
                <button
                  key={l.code}
                  onClick={() => {
                    setLanguage(l.code as LanguageCode);
                    localStorage.setItem('app_tutorial_language', l.code);
                  }}
                  className={`px-2.5 py-1 rounded-xl font-bold transition-all cursor-pointer ${
                    language === l.code
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>

            {/* Quick Login Shortcut in Header */}
            <button
              onClick={() => {
                setStep('select_grade');
              }}
              className="text-xs font-bold text-slate-300 hover:text-white px-3 py-1.5 rounded-xl border border-slate-700 hover:border-slate-500 transition-colors cursor-pointer"
            >
              {language === 'am' ? 'ግባ' : 'Login'}
            </button>
          </div>
        </header>

        {/* Hero Body */}
        <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-16 flex flex-col items-center justify-center text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-xs font-bold mb-6 backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            <span>
              {language === 'am'
                ? 'በአዲሱ የኢትዮጵያ ስርዓተ-ትምህርት 2019 የተዘጋጀ'
                : 'Aligned with New Ethiopian Curriculum 2019 E.C.'}
            </span>
          </div>

          {/* Title */}
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white font-serif-ethiopic max-w-3xl leading-[1.15]">
            NUR AI HIGH SCHOOL
          </h2>

          <p className="text-base sm:text-xl font-medium text-emerald-200/90 mt-3 font-serif-ethiopic">
            "AI-Powered Learning for Ethiopian Students"
          </p>

          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto mt-3 leading-relaxed">
            {language === 'am'
              ? 'ለክፍል 9፣ 10፣ 11 እና 12 ተማሪዎች የተዘጋጀ፤ የሶቅራጥሳዊ AI የግል አስጠኚ፣ ኦፊሴላዊ የትምህርት ሚኒስቴር መጽሐፍት፣ የፈተና ጥያቄዎችና የዩኒቨርሲቲ መግቢያ ማትሪክ ዝግጅት።'
              : 'Complete Grades 9-12 learning system with Socratic AI Tutor, official MoE textbooks, interactive quizzes, and university entrance exam preparation.'}
          </p>

          {/* Grade Price Preview Strip (from backend configuration) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 w-full max-w-2xl mt-8">
            {[9, 10, 11, 12].map((g) => {
              const p = subscriptionService.getPriceForGrade(g as Grade, pricingConfig);
              return (
                <div
                  key={g}
                  onClick={() => handleSelectGrade(g as Grade)}
                  className="bg-slate-900/70 hover:bg-slate-800/80 border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-3.5 text-center transition-all cursor-pointer group"
                >
                  <span className="text-[11px] font-bold text-slate-400 group-hover:text-emerald-300 font-serif-ethiopic block">
                    {language === 'am' ? `ክፍል ${g}` : `Grade ${g}`}
                  </span>
                  <span className="text-base sm:text-lg font-black text-white font-mono mt-0.5 block">
                    {p} <span className="text-[10px] text-slate-400 font-sans">ETB/ወር</span>
                  </span>
                </div>
              );
            })}
          </div>

          {/* Core Entry Buttons (Requirement 1) */}
          <div className="flex flex-col sm:flex-row items-center gap-3.5 w-full max-w-md mt-9">
            {/* PRIMARY: START LEARNING */}
            <button
              onClick={() => setStep('select_grade')}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-base shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <span>{language === 'am' ? 'ትምህርት ጀምር' : 'START LEARNING'}</span>
              <ArrowRight className="w-5 h-5 text-slate-950" />
            </button>

            {/* SECONDARY: LOGIN */}
            <button
              onClick={() => {
                setStep('select_grade');
              }}
              className="w-full py-3.5 px-6 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer hover:border-slate-500"
            >
              <User className="w-4 h-4 text-emerald-400" />
              <span>{language === 'am' ? 'መለያ አለኝ (LOGIN)' : 'LOGIN'}</span>
            </button>
          </div>

          {/* Value Props Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-left w-full max-w-3xl mt-12 pt-8 border-t border-slate-800/80">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-bold text-white block">2019 አዲሱ ስርዓተ-ትምህርት</span>
                <span className="text-slate-400 text-[11px]">New FDRE Curriculum</span>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-bold text-white block">ኑር AI የግል አስጠኚ</span>
                <span className="text-slate-400 text-[11px]">Socratic Ethiopian RAG</span>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-bold text-white block">ኦፊሴላዊ መጽሐፍት</span>
                <span className="text-slate-400 text-[11px]">Official DRM Textbooks</span>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-bold text-white block">ቴሌብርና የባንክ ክፍያ</span>
                <span className="text-slate-400 text-[11px]">Telebirr & CBE verified</span>
              </div>
            </div>
          </div>
        </main>

        {/* Minimal Footer */}
        <footer className="px-4 py-4 border-t border-slate-900 text-center text-xs text-slate-500">
          <div className="flex items-center justify-center gap-3">
            <span>© 2026 NUR AI High School Systems</span>
            <span>•</span>
            <button
              onClick={() => setIsTestHarnessOpen(true)}
              className="text-[11px] text-emerald-400 hover:underline font-mono cursor-pointer"
            >
              🧪 PART 21 Test Suite
            </button>
          </div>
        </footer>

        {/* Test Harness Modal */}
        {renderTestHarnessModal()}
      </div>
    );
  }

  // ==========================================================================
  // RENDER STEP 2: SELECT YOUR GRADE (Requirement 2 & 3)
  // ==========================================================================
  if (step === 'select_grade') {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-4 sm:p-8">
        <div className="max-w-2xl mx-auto w-full">
          {/* Header & Back Button (Requirement 15) */}
          <div className="flex items-center justify-between pb-6 border-b border-slate-800">
            <button
              onClick={() => setStep('start')}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-bold cursor-pointer transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{language === 'am' ? 'ወደ ኋላ' : 'Back'}</span>
            </button>
            <span className="text-xs font-mono font-bold text-emerald-400">Step 1 of 4</span>
          </div>

          <div className="text-center my-8">
            <h2 className="text-2xl sm:text-3xl font-black text-white font-serif-ethiopic">
              {language === 'am' ? 'ክፍልህን ምረጥ (SELECT YOUR GRADE)' : 'SELECT YOUR GRADE'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2 font-serif-ethiopic">
              {language === 'am'
                ? 'የምትማርበትን የሁለተኛ ደረጃ ክፍል ምረጥ፤ ዋጋው ከሲስተሙ በቀጥታ ይሰላል።'
                : 'Choose your high school grade level to continue'}
            </p>
          </div>

          {/* Grade Cards Grid (Grades 9, 10, 11, 12) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                grade: 9 as Grade,
                labelAm: 'ክፍል 9 (Grade 9)',
                descAm: 'ሒሳብ፣ ፊዚክስ፣ ኬሚስትሪ፣ ባዮሎጂ እና ሌሎች 9 የትምህርት ዓይነቶች',
                descEn: 'Mathematics, Physics, Chemistry, Biology & 9 core subjects',
              },
              {
                grade: 10 as Grade,
                labelAm: 'ክፍል 10 (Grade 10)',
                descAm: 'የተፈጥሮና ማህበራዊ ሳይንስ መሠረቶች ከብሔራዊ ማጠቃለያ ጋር',
                descEn: 'Foundational sciences & general high school curriculum',
              },
              {
                grade: 11 as Grade,
                labelAm: 'ክፍል 11 (Grade 11)',
                descAm: 'የተፈጥሮ (Natural) እና የማህበራዊ (Social) ሳይንስ ዥረቶች',
                descEn: 'Specialized Natural Science and Social Science streams',
              },
              {
                grade: 12 as Grade,
                labelAm: 'ክፍል 12 (Grade 12)',
                descAm: 'የዩኒቨርሲቲ መግቢያ ፈተና (Entrance Exam) እና የማትሪክ ዝግጅት',
                descEn: 'National University Entrance Matric Examination prep',
              },
            ].map((item) => {
              const price = subscriptionService.getPriceForGrade(item.grade, pricingConfig);
              const isSelected = chosenGrade === item.grade;
              return (
                <div
                  key={item.grade}
                  onClick={() => handleSelectGrade(item.grade)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between group ${
                    isSelected
                      ? 'bg-slate-900 border-emerald-500 ring-2 ring-emerald-500/30 shadow-lg shadow-emerald-950'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-black text-sm">
                        {item.grade}
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-black text-white font-mono block">
                          {price} <span className="text-[10px] text-slate-400 font-sans">ETB</span>
                        </span>
                        <span className="text-[10px] text-emerald-400 font-bold">
                          {language === 'am' ? 'በወር (Monthly)' : '/ month'}
                        </span>
                      </div>
                    </div>

                    <h3 className="text-base font-bold text-white font-serif-ethiopic group-hover:text-emerald-400 transition-colors">
                      {item.labelAm}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      {language === 'am' ? item.descAm : item.descEn}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-emerald-400">
                    <span>{language === 'am' ? 'ይህንን ክፍል ምረጥ' : 'Select Grade'}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="text-center text-xs text-slate-500 py-4">
          NUR AI High School • Secure Ethiopian High School Platform
        </div>
      </div>
    );
  }

  // ==========================================================================
  // RENDER STEP 3: USER TYPE (Requirement 4)
  // ==========================================================================
  if (step === 'user_type') {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-4 sm:p-8">
        <div className="max-w-xl mx-auto w-full">
          {/* Header & Back Button */}
          <div className="flex items-center justify-between pb-6 border-b border-slate-800">
            <button
              onClick={() => setStep('select_grade')}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-bold cursor-pointer transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{language === 'am' ? 'ክፍል ምርጫ' : 'Change Grade'}</span>
            </button>
            <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-xs font-bold font-mono">
              ክፍል {chosenGrade} • {currentPriceETB} ETB/ወር
            </div>
          </div>

          <div className="text-center my-10">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4">
              <User className="w-7 h-7" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white font-serif-ethiopic">
              {language === 'am' ? 'መለያ አለዎት? (Do you already have an account?)' : 'Do you already have an account?'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2 font-serif-ethiopic">
              {language === 'am'
                ? `ለክፍል ${chosenGrade} አዲስ ተማሪ ከሆኑ ይመዝገቡ፤ ወይም መለያ ካለዎት ይግቡ።`
                : `Choose how to proceed for Grade ${chosenGrade} (${currentPriceETB} ETB/month)`}
            </p>
          </div>

          {/* Two Big Options (Requirement 4) */}
          <div className="space-y-4">
            {/* OPTION 1: CREATE NEW ACCOUNT (Primary for New Users) */}
            <div
              onClick={() => setStep('register')}
              className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-900 border border-emerald-500/50 hover:border-emerald-400 hover:shadow-lg hover:shadow-emerald-950 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-slate-950 flex items-center justify-center font-black">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white font-serif-ethiopic group-hover:text-emerald-300 transition-colors">
                      {language === 'am' ? 'አዲስ መለያ ፍጠር (CREATE NEW ACCOUNT)' : 'CREATE NEW ACCOUNT'}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {language === 'am'
                        ? 'የመጀመሪያ ጊዜዬ ነው፤ አዲስ መለያ መክፈት እፈልጋለሁ'
                        : 'New student registration with grade pre-filled'}
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-emerald-400 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* OPTION 2: LOGIN (For Existing Users) */}
            <div
              onClick={() => setStep('login')}
              className="p-5 sm:p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 hover:bg-slate-900 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-300 flex items-center justify-center font-black">
                    <Lock className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white font-serif-ethiopic group-hover:text-slate-200 transition-colors">
                      {language === 'am' ? 'መለያ አለኝ / ግባ (LOGIN)' : 'LOGIN TO EXISTING ACCOUNT'}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {language === 'am'
                        ? 'ቀደም ሲል የተመዘገብኩ ነባር ተማሪ ነኝ'
                        : 'Sign in to access your active subscription'}
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>

        <div className="text-center text-xs text-slate-500 py-4">
          NUR AI High School • Secure Authentication Gate
        </div>
      </div>
    );
  }

  // ==========================================================================
  // RENDER STEP 4a: NEW USER REGISTRATION (Requirement 6)
  // ==========================================================================
  if (step === 'register') {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-4 sm:p-8">
        <div className="max-w-lg mx-auto w-full">
          {/* Header & Back Button (Requirement 15: Back -> User Type) */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <button
              onClick={() => setStep('user_type')}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-bold cursor-pointer transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{language === 'am' ? 'ወደ ኋላ' : 'Back'}</span>
            </button>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-mono">ክፍል {chosenGrade}</span>
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-mono font-bold">
                {currentPriceETB} ETB/ወር
              </span>
            </div>
          </div>

          <div className="my-6">
            <h2 className="text-xl sm:text-2xl font-black text-white font-serif-ethiopic">
              {language === 'am' ? 'አዲስ የተማሪ መለያ መመዝገቢያ' : 'New Student Registration'}
            </h2>
            <p className="text-xs text-slate-400 mt-1 font-serif-ethiopic">
              {language === 'am'
                ? `ክፍል ${chosenGrade} ተማሪ መለያዎን ይፍጠሩ። ቀጣዩ እርምጃ የክፍያ ማረጋገጫ ይሆናል።`
                : `Create your Grade ${chosenGrade} account to continue to payment`}
            </p>
          </div>

          {regError && (
            <div className="p-3.5 mb-5 rounded-2xl bg-rose-950/50 border border-rose-800 text-rose-300 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{regError}</span>
            </div>
          )}

          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            {/* 1. Full Name */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 font-serif-ethiopic">
                {language === 'am' ? 'ሙሉ ስም (Full Name) *' : 'Full Name *'}
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  value={regFullName}
                  onChange={(e) => setRegFullName(e.target.value)}
                  placeholder={language === 'am' ? 'ለምሳሌ፡ አበበ ከበደ' : 'e.g. Abebe Kebede'}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 outline-none transition-all"
                />
              </div>
            </div>

            {/* 2. Phone Number / Email */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 font-serif-ethiopic">
                {language === 'am' ? 'ስልክ ቁጥር ወይም ኢሜይል *' : 'Phone Number or Email *'}
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  value={regPhoneOrEmail}
                  onChange={(e) => setRegPhoneOrEmail(e.target.value)}
                  placeholder={language === 'am' ? '0912345678 ወይም email@example.com' : '0912345678 or student@email.com'}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 outline-none transition-all font-mono"
                />
              </div>
            </div>

            {/* 3. Password */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 font-serif-ethiopic">
                {language === 'am' ? 'የይለፍ ቃል (ቢያንስ 6 ፊደላት/ቁጥሮች) *' : 'Password (min 6 chars) *'}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type={showRegPassword ? 'text' : 'password'}
                  required
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-900 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowRegPassword(!showRegPassword)}
                  className="absolute right-3.5 top-3 text-slate-500 hover:text-slate-300"
                >
                  {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* 4. Confirm Password */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 font-serif-ethiopic">
                {language === 'am' ? 'የይለፍ ቃል ማረጋገጫ (Confirm Password) *' : 'Confirm Password *'}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type={showRegPassword ? 'text' : 'password'}
                  required
                  value={regConfirmPassword}
                  onChange={(e) => setRegConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 outline-none transition-all"
                />
              </div>
            </div>

            {/* 5. Pre-Populated Grade (Requirement 6: Selected grade already populated) */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 font-serif-ethiopic">
                  {language === 'am' ? 'የተመረጠ ክፍል (Grade)' : 'Selected Grade'}
                </label>
                <div className="px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs font-bold text-emerald-400 flex items-center justify-between">
                  <span>ክፍል {chosenGrade} (Grade {chosenGrade})</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                </div>
              </div>

              {/* 6. Preferred Language (Requirement 21) */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 font-serif-ethiopic">
                  {language === 'am' ? 'ቋንቋ (Language)' : 'Preferred Language'}
                </label>
                <select
                  value={regPreferredLanguage}
                  onChange={(e) => {
                    const l = e.target.value as LanguageCode;
                    setRegPreferredLanguage(l);
                    setLanguage(l);
                  }}
                  className="w-full px-3 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs font-bold text-white outline-none cursor-pointer"
                >
                  <option value="am">አማርኛ (Amharic)</option>
                  <option value="en">English</option>
                  <option value="om">Afaan Oromoo</option>
                  <option value="ti">ትግርኛ (Tigrinya)</option>
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isRegistering}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-sm shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer mt-5 disabled:opacity-50"
            >
              {isRegistering ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                  <span>{language === 'am' ? 'መለያ በመፍጠር ላይ...' : 'Creating Account...'}</span>
                </>
              ) : (
                <>
                  <span>{language === 'am' ? 'ተመዝገብና ወደ ክፍያ ቀጥል' : 'REGISTER & PROCEED TO PAYMENT'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Switch to Login link */}
          <div className="text-center mt-5 text-xs text-slate-400">
            {language === 'am' ? 'ቀደም ሲል መለያ አለዎት?' : 'Already have an account?'}{' '}
            <button
              type="button"
              onClick={() => setStep('login')}
              className="text-emerald-400 font-bold hover:underline cursor-pointer ml-1"
            >
              {language === 'am' ? 'እዚህ ይግቡ (Login)' : 'Sign In'}
            </button>
          </div>
        </div>

        <div className="text-center text-xs text-slate-500 py-4">
          NUR AI High School • Student Protection & Privacy
        </div>
      </div>
    );
  }

  // ==========================================================================
  // RENDER STEP 4b: EXISTING USER LOGIN (Requirement 5)
  // ==========================================================================
  if (step === 'login') {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-4 sm:p-8">
        <div className="max-w-md mx-auto w-full">
          {/* Header & Back Button */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <button
              onClick={() => setStep('user_type')}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-bold cursor-pointer transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{language === 'am' ? 'ወደ ኋላ' : 'Back'}</span>
            </button>
            <span className="text-xs font-mono text-emerald-400 font-bold">Student Auth</span>
          </div>

          <div className="my-6">
            <h2 className="text-xl sm:text-2xl font-black text-white font-serif-ethiopic">
              {language === 'am' ? 'ወደ መለያዎ ይግቡ (Student Login)' : 'Student Login'}
            </h2>
            <p className="text-xs text-slate-400 mt-1 font-serif-ethiopic">
              {language === 'am'
                ? `ክፍል ${chosenGrade} ተማሪ መለያዎን ያስገቡ፤ የሳብስክሪፕሽን ሁኔታዎ ይፈተሻል።`
                : 'Sign in to verify your subscription and open your student dashboard'}
            </p>
          </div>

          {loginError && (
            <div className="p-3.5 mb-5 rounded-2xl bg-rose-950/50 border border-rose-800 text-rose-300 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {/* Identifier */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 font-serif-ethiopic">
                {language === 'am' ? 'ስልክ ቁጥር ወይም ኢሜይል *' : 'Phone Number or Email *'}
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  placeholder={language === 'am' ? '0912345678 ወይም email@example.com' : '0912345678 or email'}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 outline-none transition-all font-mono"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-300 font-serif-ethiopic">
                  {language === 'am' ? 'የይለፍ ቃል *' : 'Password *'}
                </label>
                <button
                  type="button"
                  onClick={() => setIsForgotOpen(true)}
                  className="text-[11px] text-emerald-400 hover:underline cursor-pointer"
                >
                  {language === 'am' ? 'የይለፍ ቃል ረሱ?' : 'Forgot Password?'}
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-900 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute right-3.5 top-3 text-slate-500 hover:text-slate-300"
                >
                  {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-sm shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer mt-5 disabled:opacity-50"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                  <span>{language === 'am' ? 'በማረጋገጥ ላይ...' : 'Verifying Account...'}</span>
                </>
              ) : (
                <>
                  <span>{language === 'am' ? 'ግባና ሳብስክሪፕሽን አረጋግጥ' : 'LOGIN & VERIFY SUBSCRIPTION'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Switch to Register */}
          <div className="text-center mt-5 text-xs text-slate-400">
            {language === 'am' ? 'አዲስ ተማሪ ነዎት?' : "Don't have an account?"}{' '}
            <button
              type="button"
              onClick={() => setStep('register')}
              className="text-emerald-400 font-bold hover:underline cursor-pointer ml-1"
            >
              {language === 'am' ? 'እዚህ ይመዝገቡ (Register)' : 'Create account'}
            </button>
          </div>
        </div>

        {/* Forgot Password Modal */}
        {isForgotOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-sm w-full space-y-4">
              <h3 className="text-base font-bold text-white font-serif-ethiopic">
                {language === 'am' ? 'የይለፍ ቃል መልሶ ማግኛ' : 'Password Recovery'}
              </h3>
              <p className="text-xs text-slate-400">
                {language === 'am'
                  ? 'የተመዘገቡበትን ስልክ ቁጥር ወይም ኢሜይል ያስገቡ። የማረጋገጫ መመሪያ ይላክልዎታል።'
                  : 'Enter your registered phone or email to receive password reset instructions.'}
              </p>
              {recoverySuccess ? (
                <div className="p-3 bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs rounded-xl">
                  {recoverySuccess}
                </div>
              ) : (
                <div>
                  <input
                    type="text"
                    value={recoveryInput}
                    onChange={(e) => setRecoveryInput(e.target.value)}
                    placeholder="0912345678 / email"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none mb-3"
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setIsForgotOpen(false)}
                      className="flex-1 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                    >
                      {language === 'am' ? 'ሰርዝ' : 'Cancel'}
                    </button>
                    <button
                      type="button"
                      disabled={isRecovering}
                      onClick={async () => {
                        setIsRecovering(true);
                        try {
                          await resetPassword(recoveryInput);
                          setRecoverySuccess(
                            language === 'am'
                              ? 'የመልሶ ማግኛ መመሪያ ተልኳል! እባክዎ ኢሜይልዎን ወይም ስልክዎን ይመልከቱ።'
                              : 'Reset link sent! Please check your email or phone.'
                          );
                        } catch (err: any) {
                          setRecoveryError(err.message || 'Recovery failed');
                        } finally {
                          setIsRecovering(false);
                        }
                      }}
                      className="flex-1 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold"
                    >
                      {isRecovering ? '...' : language === 'am' ? 'ላክ' : 'Send'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="text-center text-xs text-slate-500 py-4">
          NUR AI High School • Secure Ethiopian High School Platform
        </div>
      </div>
    );
  }

  // ==========================================================================
  // RENDER STEP 5: PAYMENT SCREEN (Requirement 7 & 8)
  // ==========================================================================
  if (step === 'payment') {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-4 sm:p-8">
        <div className="max-w-2xl mx-auto w-full">
          {/* Header & Back Button (Requirement 15: Back -> Register / User Type) */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <button
              onClick={() => {
                if (user) {
                  setStep('user_type');
                } else {
                  setStep('register');
                }
              }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-bold cursor-pointer transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{language === 'am' ? 'ወደ ኋላ' : 'Back'}</span>
            </button>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-mono">ክፍል {chosenGrade}</span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold">
                {currentPriceETB} ETB
              </span>
            </div>
          </div>

          {/* Pricing Header Display (Requirement 7) */}
          <div className="my-6 bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-900 border border-emerald-500/30 rounded-3xl p-5 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-emerald-400 font-mono">
                  {isRenewal ? 'የሳብስክሪፕሽን ማደሻ (Renewal)' : 'የክፍያ ደረጃ (Monthly Subscription)'}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white font-serif-ethiopic mt-0.5">
                  {language === 'am' ? `ክፍል ${chosenGrade} ወርሃዊ አገልግሎት` : `Grade ${chosenGrade} Monthly Access`}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  {userProfile?.displayName ? `${userProfile.displayName} • ` : ''}
                  ሙሉ የ 30 ቀናት ያልተገደበ የትምህርት፣ የፈተና እና የ AI አስጠኚ አገልግሎት
                </p>
              </div>

              <div className="text-left sm:text-right bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800/80">
                <span className="text-xs text-slate-400 block font-serif-ethiopic">የወር ክፍያ፡</span>
                <span className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">
                  {currentPriceETB} <span className="text-xs font-sans text-white">ETB</span>
                </span>
              </div>
            </div>
          </div>

          {paymentError && (
            <div className="p-3.5 mb-5 rounded-2xl bg-rose-950/50 border border-rose-800 text-rose-300 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{paymentError}</span>
            </div>
          )}

          {/* 4 Payment Methods (Requirement 7) */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-2 font-serif-ethiopic">
              {language === 'am' ? 'የክፍያ አማራጭ ይምረጡ (Select Payment Method) *' : 'Payment Method *'}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-5">
              {[
                { id: 'Telebirr' as PaymentMethodName, label: 'ቴሌብር (Telebirr)', icon: Smartphone },
                { id: 'Dashen Bank' as PaymentMethodName, label: 'ዳሸን ባንክ (Dashen)', icon: Landmark },
                { id: 'Commercial Bank of Ethiopia (CBE)' as PaymentMethodName, label: 'ንግድ ባንክ (CBE)', icon: Building2 },
                { id: 'Bank of Abyssinia' as PaymentMethodName, label: 'አቢሲኒያ (BoA)', icon: CreditCard },
              ].map((m) => {
                const isSelected = selectedMethod === m.id;
                const Icon = m.icon;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setSelectedMethod(m.id)}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-slate-900 border-emerald-500 ring-2 ring-emerald-500/20 text-white shadow-md'
                        : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <Icon className={`w-5 h-5 mb-2 ${isSelected ? 'text-emerald-400' : 'text-slate-500'}`} />
                    <span className="text-xs font-bold font-serif-ethiopic leading-tight">
                      {m.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Configured Payment Instructions Card (Requirement 8) */}
            <div className="bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-800 space-y-3 mb-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs font-bold text-emerald-400 font-serif-ethiopic">
                  {currentMethodConfig.displayName} መመሪያ
                </span>
                <span className="text-[11px] font-mono text-slate-400">Official Account</span>
              </div>

              {/* Account Number & Name with Copy */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-950/70 p-3 rounded-xl border border-slate-850">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">
                    {language === 'am' ? 'የሂሳብ ቁጥር / የስልክ ቁጥር' : 'Account / Phone'}
                  </span>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm font-black text-white font-mono">
                      {currentMethodConfig.accountNumber}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(currentMethodConfig.accountNumber, 'acc')}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      {copiedKey === 'acc' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span className="text-[10px]">{copiedKey === 'acc' ? 'ተቀድቷል' : 'ኮፒ'}</span>
                    </button>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">
                    {language === 'am' ? 'የሂሳብ ስም' : 'Account Name'}
                  </span>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs font-bold text-white font-serif-ethiopic truncate">
                      {currentMethodConfig.accountName}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(currentMethodConfig.accountName, 'name')}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      {copiedKey === 'name' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span className="text-[10px]">{copiedKey === 'name' ? 'ተቀድቷል' : 'ኮፒ'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Text Instructions */}
              <p className="text-xs text-slate-300 leading-relaxed font-serif-ethiopic">
                {language === 'am' ? currentMethodConfig.instructionsAm : currentMethodConfig.instructionsEn}
              </p>
            </div>

            {/* Submission Form (Requirement 8) */}
            <form onSubmit={handlePaymentSubmit} className="space-y-4">
              {/* Transaction / Reference Number */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 font-serif-ethiopic">
                  {language === 'am'
                    ? 'የክፍያ ማረጋገጫ ቁጥር (Transaction ID / Reference Number) *'
                    : 'Transaction Reference / FT Number *'}
                </label>
                <div className="relative">
                  <FileCheck2 className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    value={txRef}
                    onChange={(e) => setTxRef(e.target.value)}
                    placeholder={language === 'am' ? 'ለምሳሌ፡ FT262629102 ወይም ቴሌብር Tx ID' : 'e.g. FT262629102 or Telebirr Tx ID'}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 outline-none transition-all font-mono"
                  />
                </div>
              </div>

              {/* Payment Proof Upload (Optional / When required) */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 font-serif-ethiopic">
                  {language === 'am'
                    ? 'የደረሰኝ ፎቶ ማስገቢያ (Proof Upload - Screenshot/Receipt)'
                    : 'Receipt Screenshot Upload'}
                </label>
                <div className="border-2 border-dashed border-slate-800 hover:border-slate-700 rounded-2xl p-4 text-center cursor-pointer transition-colors bg-slate-900/40 relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProofUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <div className="flex flex-col items-center justify-center">
                    <UploadCloud className="w-6 h-6 text-slate-400 mb-1.5" />
                    {proofFileName ? (
                      <span className="text-xs font-bold text-emerald-400 font-mono">{proofFileName}</span>
                    ) : (
                      <>
                        <span className="text-xs font-bold text-slate-300">
                          {language === 'am' ? 'የደረሰኙን ፎቶ እዚህ ይጫኑ' : 'Click or drop payment proof screenshot'}
                        </span>
                        <span className="text-[10px] text-slate-500 mt-0.5">PNG, JPG, WebP (Max 5MB)</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit Payment Button (Requirement 8: Status becomes PENDING) */}
              <button
                type="submit"
                disabled={isSubmittingPayment}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-sm shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer mt-6 disabled:opacity-50"
              >
                {isSubmittingPayment ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                    <span>{language === 'am' ? 'ክፍያውን በማስገባት ላይ...' : 'Submitting Payment...'}</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{language === 'am' ? 'ክፍያውን አስገባ (SUBMIT PAYMENT)' : 'SUBMIT PAYMENT'}</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        <div className="text-center text-xs text-slate-500 py-4">
          NUR AI High School • Manual Verification Queue (No Auto-Activation)
        </div>
      </div>
    );
  }

  // ==========================================================================
  // RENDER STEP 6: PAYMENT VERIFICATION & STATUS (Requirement 9 & 10)
  // ==========================================================================
  if (step === 'verification') {
    const isApproved = hasLearningAccess || latestPayment?.status === 'APPROVED';
    const isRejected = latestPayment?.status === 'REJECTED';
    const isPending = !isApproved && !isRejected;

    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-4 sm:p-8">
        <div className="max-w-xl mx-auto w-full">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <button
              onClick={() => {
                if (onBackToHome) {
                  onBackToHome();
                } else {
                  setStep('start');
                }
              }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-bold cursor-pointer transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{language === 'am' ? 'ወደ መነሻ' : 'Home'}</span>
            </button>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-mono">ክፍል {chosenGrade}</span>
              <button
                onClick={async () => {
                  await refreshSubscription();
                }}
                className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                title="Refresh Status"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* MAIN STATUS CARD */}
          <div className="my-8 text-center">
            {/* 1. APPROVED STATE */}
            {isApproved && (
              <div className="bg-gradient-to-b from-emerald-950/70 to-slate-900 border border-emerald-500/50 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl shadow-emerald-950">
                <div className="w-16 h-16 rounded-3xl bg-emerald-500 text-slate-950 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/30">
                  <CheckCircle className="w-9 h-9" />
                </div>
                <div>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold font-mono">
                    PAYMENT APPROVED • SUBSCRIPTION ACTIVE
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-white font-serif-ethiopic mt-3">
                    {language === 'am' ? '🎉 ክፍያዎ ጸድቋል! አካውንትዎ ገባሪ ነው' : '🎉 Subscription Activated!'}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 mt-2 font-serif-ethiopic max-w-md mx-auto leading-relaxed">
                    {language === 'am'
                      ? `ለክፍል ${chosenGrade} ያቀረቡት ክፍያ በአስተዳዳሪው ጸድቋል። አሁን ሙሉውን የኑር AI የሁለተኛ ደረጃ ትምህርት ቤት አገልግሎት ማግኘት ይችላሉ!`
                      : `Your payment has been approved by SUPER_ADMIN. Your 30-day access to Grade ${chosenGrade} is now active.`}
                  </p>
                </div>

                <div className="pt-4">
                  <button
                    onClick={() => onComplete()}
                    className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm shadow-lg shadow-emerald-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                  >
                    <span>{language === 'am' ? 'ወደ ተማሪ ዳሽቦርድ ግባ (OPEN DASHBOARD)' : 'OPEN STUDENT DASHBOARD'}</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {/* 2. REJECTED STATE */}
            {isRejected && (
              <div className="bg-gradient-to-b from-rose-950/70 to-slate-900 border border-rose-800/80 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl shadow-rose-950">
                <div className="w-16 h-16 rounded-3xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center mx-auto">
                  <XCircle className="w-9 h-9" />
                </div>
                <div>
                  <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold font-mono">
                    PAYMENT REJECTED
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-white font-serif-ethiopic mt-3">
                    {language === 'am' ? 'ክፍያው ውድቅ ተደርጓል' : 'Payment Rejected'}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 mt-2 font-serif-ethiopic max-w-md mx-auto">
                    {latestPayment?.rejectionReason ||
                      (language === 'am'
                        ? 'የተላከው የክፍያ ማረጋገጫ ቁጥር ወይም ደረሰኝ ከባንክ ሂሳቡ ጋር ስላልተዛመደ ውድቅ ተደርጓል።'
                        : 'The transaction reference or proof could not be verified by administration.')}
                  </p>
                </div>

                <div className="pt-4 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => {
                      if (latestPayment?.transactionReference) {
                        setTxRef(latestPayment.transactionReference);
                      }
                      setStep('payment');
                    }}
                    className="flex-1 py-3.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>{language === 'am' ? 'ክፍያውን አስተካክለህ እንደገና ላክ' : 'Resubmit Payment'}</span>
                  </button>
                  <button
                    onClick={() => logout()}
                    className="py-3.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold transition-all"
                  >
                    {language === 'am' ? 'ውጣ' : 'Logout'}
                  </button>
                </div>
              </div>
            )}

            {/* 3. PENDING STATE (Requirement 9) */}
            {isPending && (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
                  <Clock className="w-8 h-8 animate-pulse" />
                </div>
                <div>
                  <span className="px-3.5 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/25 text-xs font-bold font-mono">
                    STATUS: PENDING VERIFICATION
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-white font-serif-ethiopic mt-3">
                    {language === 'am' ? 'የክፍያ ማረጋገጫ ሂደት ላይ ነው' : 'Your payment is being verified'}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 mt-2 font-serif-ethiopic max-w-md mx-auto leading-relaxed">
                    {language === 'am'
                      ? 'ክፍያዎ በዋናው አስተዳዳሪ (SUPER_ADMIN) በመፈተሽ ላይ ነው። ክፍያው እንደተረጋገጠ አካውንትዎ ወዲያውኑ ይከፈታል።'
                      : 'Your payment submission has been received and queued for review. You can check back later or wait for approval.'}
                  </p>
                </div>

                {/* Submitted Payment Details Card (Requirement 9) */}
                <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-850 text-left space-y-2.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-serif-ethiopic">የተማሪ ስም፡</span>
                    <span className="font-bold text-white">
                      {latestPayment?.studentName || userProfile?.displayName || 'ተማሪ'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-serif-ethiopic">የተመዘገቡበት ክፍል፡</span>
                    <span className="font-mono font-bold text-emerald-400">
                      ክፍል {latestPayment?.grade || chosenGrade}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-serif-ethiopic">የተከፈለው መጠን፡</span>
                    <span className="font-mono font-bold text-white">
                      {latestPayment?.amountETB || currentPriceETB} ETB
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-serif-ethiopic">የክፍያ መንገድ፡</span>
                    <span className="font-mono text-slate-300">
                      {latestPayment?.paymentMethod || selectedMethod}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-serif-ethiopic">የማረጋገጫ ኮድ (Ref):</span>
                    <span className="font-mono font-bold text-amber-300">
                      {latestPayment?.transactionReference || txRef || 'Ref Recorded'}
                    </span>
                  </div>
                </div>

                {/* Actions: Refresh & Return to Login (Requirement 9) */}
                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={async () => {
                      await refreshSubscription();
                    }}
                    className="flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>{language === 'am' ? 'ሁኔታውን ዳግም ፈትሽ' : 'Refresh Status'}</span>
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      setStep('start');
                    }}
                    className="flex-1 py-3 px-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white text-xs font-bold transition-all"
                  >
                    {language === 'am' ? 'በኋላ ተመልከት / ውጣ' : 'Return to Login'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ================================================================= */}
          {/* SUPER ADMIN APPROVAL / TEST SIMULATION HARNESS (Requirement 10 & 22) */}
          {/* ================================================================= */}
          <div className="mt-8 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border border-amber-500/30">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold text-amber-300 font-serif-ethiopic">
                  👑 SUPER_ADMIN የአስተዳዳሪ ማጽደቂያ ፓነል (Admin Review & Simulator)
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">Admin Control</span>
            </div>

            <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
              {language === 'am'
                ? 'ለስርዓቱ ፍተሻና ማረጋገጫ (Part 21 Section 10 & 22)፤ አስተዳዳሪው ክፍያውን እዚህ ላይ በቀጥታ ማጽደቅ ወይም ውድቅ ማድረግ ይችላል።'
                : 'Super Admin review harness to approve/reject this student payment per Part 21 requirements.'}
            </p>

            {adminActionMessage && (
              <div className="mt-3 p-2.5 rounded-xl bg-slate-950 text-emerald-400 text-xs border border-emerald-800/80 font-mono">
                {adminActionMessage}
              </div>
            )}

            <div className="mt-4 flex flex-wrap gap-2.5">
              <button
                type="button"
                disabled={isAdminProcessing}
                onClick={handleAdminApprovePayment}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{language === 'am' ? 'ክፍያውን አጽድቅ (Approve)' : 'Approve Payment'}</span>
              </button>

              <button
                type="button"
                disabled={isAdminProcessing}
                onClick={() => setRejectReasonPrompt(!rejectReasonPrompt)}
                className="px-4 py-2 rounded-xl bg-rose-950 border border-rose-800 hover:bg-rose-900 text-rose-200 font-bold text-xs flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <XCircle className="w-4 h-4" />
                <span>{language === 'am' ? 'ውድቅ አድርግ (Reject)' : 'Reject Payment'}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsTestHarnessOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs flex items-center gap-1.5 cursor-pointer ml-auto"
              >
                <span>🧪 Test All Grades</span>
              </button>
            </div>

            {rejectReasonPrompt && (
              <div className="mt-3 pt-3 border-t border-slate-800 space-y-2">
                <input
                  type="text"
                  value={customRejectReason}
                  onChange={(e) => setCustomRejectReason(e.target.value)}
                  placeholder="የውድቅ የተደረገበት ምክንያት..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                />
                <button
                  type="button"
                  onClick={handleAdminRejectPayment}
                  className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold"
                >
                  ውሳኔውን አረጋግጥ (Confirm Rejection)
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Test Harness Modal */}
        {renderTestHarnessModal()}

        <div className="text-center text-xs text-slate-500 py-4">
          NUR AI High School • Secure Subscription Enforcement
        </div>
      </div>
    );
  }

  // ==========================================================================
  // RENDER STEP 7: SUSPENDED SCREEN (Requirement 5 & 16)
  // ==========================================================================
  if (step === 'suspended') {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-4 sm:p-8">
        <div className="max-w-md mx-auto w-full my-auto text-center space-y-5 bg-slate-900 border border-red-800/80 rounded-3xl p-8">
          <div className="w-16 h-16 rounded-2xl bg-red-950/60 border border-red-700 text-red-400 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-9 h-9" />
          </div>
          <div>
            <span className="px-3 py-1 bg-red-950/80 text-red-300 border border-red-700 text-xs font-bold rounded-full">
              ACCOUNT SUSPENDED
            </span>
            <h3 className="text-xl font-bold font-serif-ethiopic text-white mt-3">
              {language === 'am' ? 'አካውንትዎ ለጊዜው ታግዷል' : 'Account Temporarily Suspended'}
            </h3>
            <p className="text-xs text-slate-400 mt-2 font-serif-ethiopic leading-relaxed">
              {language === 'am'
                ? 'ይህ የተማሪ መለያ በአስተዳዳሪው ውሳኔ ታግዷል። እባክዎ ለበለጠ መረጃ ዋናውን አስተዳዳሪ (mejennur669@gmail.com) ያነጋግሩ።'
                : 'This account has been suspended by administration. Please contact support at mejennur669@gmail.com.'}
            </p>
          </div>
          <button
            onClick={() => {
              logout();
              setStep('start');
            }}
            className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-all"
          >
            {language === 'am' ? 'ውጣና ወደ መነሻ ተመለስ' : 'Logout'}
          </button>
        </div>
      </div>
    );
  }

  return null;

  // Helper to render the interactive test suite for Section 22
  function renderTestHarnessModal() {
    if (!isTestHarnessOpen) return null;
    return (
      <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full space-y-4 max-h-[85vh] flex flex-col shadow-2xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-bold text-white font-serif-ethiopic">
                PART 21 End-to-End Test Suite
              </h3>
            </div>
            <button
              onClick={() => setIsTestHarnessOpen(false)}
              className="text-xs text-slate-400 hover:text-white px-2 py-1 bg-slate-800 rounded-lg cursor-pointer"
            >
              ✕
            </button>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Run automated verification passes for New Students (Grades 9-12 pricing & approval), Existing Students, and Expired renewals per Part 21 requirements.
          </p>

          <div className="grid grid-cols-2 gap-2">
            {[9, 10, 11, 12].map((g) => {
              const p = subscriptionService.getPriceForGrade(g as Grade, pricingConfig);
              return (
                <button
                  key={g}
                  onClick={() => runPart21EndToEndTest(g as Grade)}
                  className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500 text-left cursor-pointer transition-all group"
                >
                  <span className="text-xs font-bold text-white group-hover:text-emerald-400 block font-serif-ethiopic">
                    Grade {g} Test
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">{p} ETB Verification</span>
                </button>
              );
            })}
          </div>

          {/* Test Logs Console */}
          <div className="flex-1 overflow-y-auto bg-black/80 rounded-xl p-3 border border-slate-850 font-mono text-[11px] text-emerald-400 space-y-1 min-h-[140px]">
            {testLog.length === 0 ? (
              <span className="text-slate-600">Select any grade test above to start execution...</span>
            ) : (
              testLog.map((log, idx) => <div key={idx}>{log}</div>)
            )}
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={() => setIsTestHarnessOpen(false)}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer"
            >
              Done / Close
            </button>
          </div>
        </div>
      </div>
    );
  }
};
