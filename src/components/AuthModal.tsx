import React, { useState, useEffect } from 'react';
import {
  X,
  LogIn,
  UserPlus,
  GraduationCap,
  Briefcase,
  AlertCircle,
  Loader2,
  CheckCircle,
  ShieldCheck,
  KeyRound,
  Mail,
  Smartphone,
  ArrowLeft,
  Lock,
  Eye,
  EyeOff,
  RefreshCw,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Grade, UserRole } from '../types';
import { auth } from '../lib/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import { premiumContentService } from '../services/premiumContentService';

export type AuthViewMode =
  | 'login'
  | 'register'
  | 'forgot_select'
  | 'forgot_email'
  | 'forgot_phone';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    authModalMode,
    openAuthModal,
    closeAuthModal,
    login,
    register,
  } = useAuth();

  const [mode, setMode] = useState<AuthViewMode>(authModalMode || 'login');
  const [emailOrPhone, setEmailOrPhone] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [displayName, setDisplayName] = useState<string>('');
  const [role, setRole] = useState<UserRole>('student');
  const [grade, setGrade] = useState<Grade>(9);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Phone recovery multi-step state
  const [phoneStep, setPhoneStep] = useState<'input_phone' | 'input_otp' | 'input_new_password' | 'done'>('input_phone');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [otpChallengeId, setOtpChallengeId] = useState<string>('');
  const [otpCode, setOtpCode] = useState<string>('');
  const [otpTimer, setOtpTimer] = useState<number>(300); // 5 minutes
  const [resetToken, setResetToken] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  // Sync mode if parent opened with specific mode
  useEffect(() => {
    setMode(authModalMode || 'login');
    setErrorMessage(null);
    setSuccessMessage(null);
    setPhoneStep('input_phone');
  }, [authModalMode, isAuthModalOpen]);

  // Countdown timer for OTP
  useEffect(() => {
    let interval: any;
    if (mode === 'forgot_phone' && phoneStep === 'input_otp' && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [mode, phoneStep, otpTimer]);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      if (mode === 'login') {
        const inputVal = emailOrPhone.trim();
        if (!inputVal || !password) {
          setErrorMessage('እባክዎ ኢሜይል ወይም ስልክ እና የይለፍ ቃል ያስገቡ (Please enter email/phone and password)');
          setIsLoading(false);
          return;
        }

        // If user typed a phone number, adapt to internal email identity if applicable
        const loginEmail = inputVal.includes('@')
          ? inputVal
          : `${inputVal.replace(/[^0-9]/g, '')}@student.nur.et`;

        await login(loginEmail, password);
      } else if (mode === 'register') {
        if (!displayName.trim()) {
          setErrorMessage('እባክዎ ሙሉ ስምዎን ያስገቡ (Please enter your full name)');
          setIsLoading(false);
          return;
        }
        if (!emailOrPhone.trim() || password.length < 6) {
          setErrorMessage('የይለፍ ቃል ቢያንስ 6 ፊደላት መሆን አለበት (Password must be at least 6 characters)');
          setIsLoading(false);
          return;
        }
        await register(emailOrPhone.trim(), password, displayName, role, grade);
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      let msg = err.message || 'ስህተት ተከስቷል፣ እባክዎ እንደገና ይሞክሩ (An error occurred)';
      if (err.code === 'auth/email-already-in-use') {
        msg = 'ይህ ኢሜይል አስቀድሞ ተመዝግቧል፣ እባክዎ ይግቡ (Email already registered. Please sign in)';
      } else if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        msg = 'የተሳሳተ ኢሜይል ወይም የይለፍ ቃል (Invalid email or password)';
      } else if (err.code === 'auth/weak-password') {
        msg = 'የይለፍ ቃሉ ጠንካራ መሆን አለበት (Password should be at least 6 characters)';
      } else if (err.code === 'auth/invalid-email') {
        msg = 'ትክክለኛ ያልሆነ የኢሜይል አድራሻ (Invalid email format)';
      }
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // Handler for Email Recovery
  const handleEmailRecovery = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    const targetEmail = emailOrPhone.trim();
    if (!targetEmail || !targetEmail.includes('@')) {
      setErrorMessage('እባክዎ ትክክለኛ የኢሜይል አድራሻ ያስገቡ (Please enter a valid email address).');
      setIsLoading(false);
      return;
    }

    try {
      // 1. Try Firebase Auth Client password reset
      try {
        await sendPasswordResetEmail(auth, targetEmail);
      } catch (fbErr) {
        console.warn('Firebase client reset warning (handled):', fbErr);
      }

      // 2. Notify backend audit and rate-limit engine
      const res = await premiumContentService.requestEmailRecovery(targetEmail);
      setSuccessMessage(res.message);
    } catch (err: any) {
      setErrorMessage(err.message || 'የመልሶ ማግኛ ጥያቄውን ማስተናገድ አልተቻለም። እባክዎ ጥቂት ቆይተው ይሞክሩ።');
    } finally {
      setIsLoading(false);
    }
  };

  // Handler for Phone OTP Request (Step 1)
  const handleRequestPhoneOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    const clean = phoneNumber.replace(/[\s-]/g, '');
    if (!/^(?:\+2519\d{8}|09\d{8}|2519\d{8})$/.test(clean)) {
      setErrorMessage('እባክዎ ትክክለኛ የኢትዮጵያ ስልክ ቁጥር (+251 9... ወይም 09...) ያስገቡ።');
      setIsLoading(false);
      return;
    }

    try {
      const res = await premiumContentService.requestPhoneOtp(clean);
      if (res.success && res.challengeId) {
        setOtpChallengeId(res.challengeId);
        setPhoneStep('input_otp');
        setOtpTimer(300);
        setSuccessMessage(res.message);
      } else {
        setErrorMessage(res.message || 'የማረጋገጫ ኮድ መላክ አልተቻለም።');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'የስርዓት ስህተት ተከስቷል። እባክዎ እንደገና ይሞክሩ።');
    } finally {
      setIsLoading(false);
    }
  };

  // Handler for Phone OTP Verification (Step 2)
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    if (otpCode.trim().length !== 6) {
      setErrorMessage('እባክዎ 6-አሃዝ የማረጋገጫ ኮድ ያስገቡ (Please enter 6-digit OTP code).');
      setIsLoading(false);
      return;
    }

    try {
      const res = await premiumContentService.verifyPhoneOtp(phoneNumber, otpCode.trim(), otpChallengeId);
      if (res.success && res.resetToken) {
        setResetToken(res.resetToken);
        setPhoneStep('input_new_password');
        setSuccessMessage(res.message);
      } else {
        setErrorMessage(res.message || 'የማረጋገጫ ኮዱ ትክክል አይደለም።');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'ማረጋገጥ አልተቻለም።');
    } finally {
      setIsLoading(false);
    }
  };

  // Handler for Setting New Strong Password (Step 3)
  const handleSetNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    if (newPassword.length < 8) {
      setErrorMessage('የይለፍ ቃል ቢያንስ 8 ፊደላት መሆን አለበት (Password must be at least 8 characters).');
      setIsLoading(false);
      return;
    }

    if (!/[0-9]/.test(newPassword) || !/[a-zA-Z]/.test(newPassword)) {
      setErrorMessage('የይለፍ ቃል ፊደላትን እና ቁጥሮችን ማካተት አለበት (Must contain letters and numbers).');
      setIsLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('የይለፍ ቃሎቹ አይመሳሰሉም (Passwords do not match).');
      setIsLoading(false);
      return;
    }

    try {
      const res = await premiumContentService.resetPasswordWithPhoneToken(resetToken, newPassword);
      if (res.success) {
        setPhoneStep('done');
        setSuccessMessage(res.message);
      } else {
        setErrorMessage(res.message || 'የይለፍ ቃል መቀየር አልተቻለም።');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'ስህተት ተከስቷል።');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      id="auth-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#1E1B18]/75 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeAuthModal();
      }}
    >
      <div
        id="auth-modal-container"
        className="w-full max-w-md bg-[#FAF6EC] border-[2px] border-[#38332D] shadow-2xl overflow-hidden rounded-2xl text-[#1E1B18]"
      >
        {/* Header Bar */}
        <div className="bg-[#EFE8D6] px-5 py-4 border-b border-[#38332D]/30 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#38332D] text-[#FAF6EC] flex items-center justify-center font-black shadow-xs">
              {mode.startsWith('forgot') ? (
                <KeyRound className="w-4 h-4 text-amber-300" />
              ) : mode === 'login' ? (
                <LogIn className="w-4 h-4 text-[#EBD9B4]" />
              ) : (
                <UserPlus className="w-4 h-4 text-[#EBD9B4]" />
              )}
            </div>
            <div>
              <h3 className="font-serif-ethiopic font-bold text-sm sm:text-base text-[#1E1B18]">
                {mode === 'login'
                  ? 'ወደ ኑር አካውንትዎ ይግቡ'
                  : mode === 'register'
                  ? 'አዲስ የተጠቃሚ አካውንት ይፍጠሩ'
                  : 'የአካውንት መልሶ ማግኛ (Account Recovery)'}
              </h3>
              <p className="text-[11px] text-[#665C4D]">
                {mode === 'login'
                  ? 'NUR AI High School • የኢትዮጵያ ሁለተኛ ደረጃ'
                  : mode === 'register'
                  ? 'የተማሪ ወይም የመምህር አካውንት'
                  : 'ደህንነቱ የተጠበቀ የኑር መልሶ ማግኛ'}
              </p>
            </div>
          </div>
          <button
            onClick={closeAuthModal}
            className="p-1 rounded-lg hover:bg-[#DED5C0] text-[#665C4D] hover:text-[#1E1B18] transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher (Only in Login/Register) */}
        {!mode.startsWith('forgot') && (
          <div className="flex border-b border-[#38332D]/20 bg-[#FAF6EC]">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
              className={`flex-1 py-2.5 text-xs sm:text-sm font-bold font-serif-ethiopic text-center transition-all cursor-pointer ${
                mode === 'login'
                  ? 'border-b-2 border-[#2E6B4A] text-[#2E6B4A] bg-[#EDE5D2]/60'
                  : 'text-[#665C4D] hover:text-[#1E1B18] hover:bg-[#EFE8D6]/40'
              }`}
            >
              ግባ (Sign In)
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
              className={`flex-1 py-2.5 text-xs sm:text-sm font-bold font-serif-ethiopic text-center transition-all cursor-pointer ${
                mode === 'register'
                  ? 'border-b-2 border-[#2E6B4A] text-[#2E6B4A] bg-[#EDE5D2]/60'
                  : 'text-[#665C4D] hover:text-[#1E1B18] hover:bg-[#EFE8D6]/40'
              }`}
            >
              ተመዝገብ (Sign Up)
            </button>
          </div>
        )}

        {/* Form Body */}
        <div className="p-5 sm:p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Notifications / Errors */}
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-xs text-red-700 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div className="font-serif-ethiopic leading-relaxed">{errorMessage}</div>
            </div>
          )}

          {successMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2.5 text-xs text-emerald-800 animate-in fade-in">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div className="font-serif-ethiopic leading-relaxed">{successMessage}</div>
            </div>
          )}

          {/* ======================================================== */}
          {/* VIEW 1: NORMAL LOGIN OR REGISTER                         */}
          {/* ======================================================== */}
          {!mode.startsWith('forgot') ? (
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* If Register: Role & Name Selection */}
              {mode === 'register' && (
                <>
                  <div>
                    <label className="block text-xs font-bold font-serif-ethiopic text-[#4A4237] mb-1">
                      የአካውንት አይነት (Account Role):
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setRole('student')}
                        className={`p-2 rounded-lg border text-xs font-bold font-serif-ethiopic flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          role === 'student'
                            ? 'bg-[#2E6B4A] text-white border-[#1D4A32] shadow-xs'
                            : 'bg-white text-[#4A4237] border-[#38332D]/30 hover:bg-[#EDE5D2]'
                        }`}
                      >
                        <GraduationCap className="w-4 h-4" />
                        <span>ተማሪ (Student)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setRole('teacher')}
                        className={`p-2 rounded-lg border text-xs font-bold font-serif-ethiopic flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          role === 'teacher'
                            ? 'bg-[#1D4ED8] text-white border-[#1E3A8A] shadow-xs'
                            : 'bg-white text-[#4A4237] border-[#38332D]/30 hover:bg-[#EDE5D2]'
                        }`}
                      >
                        <Briefcase className="w-4 h-4" />
                        <span>መምህር (Teacher)</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold font-serif-ethiopic text-[#4A4237] mb-1">
                      ሙሉ ስም (Full Name):
                    </label>
                    <input
                      type="text"
                      required
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder={role === 'teacher' ? 'መምህር አበበ ከበደ' : 'ተማሪ ዮናስ አለሙ'}
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-[#38332D]/40 rounded-lg focus:outline-none focus:border-[#2E6B4A] text-[#1E1B18]"
                    />
                  </div>

                  {role === 'student' && (
                    <div>
                      <label className="block text-xs font-bold font-serif-ethiopic text-[#4A4237] mb-1">
                        ክፍል (Grade Level):
                      </label>
                      <div className="grid grid-cols-4 gap-1.5">
                        {([9, 10, 11, 12] as Grade[]).map((g) => (
                          <button
                            key={g}
                            type="button"
                            onClick={() => setGrade(g)}
                            className={`py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                              grade === g
                                ? 'bg-[#38332D] text-[#FAF6EC] border-[#1E1B18] shadow-xs'
                                : 'bg-white text-[#4A4237] border-[#38332D]/30 hover:bg-[#EDE5D2]'
                            }`}
                          >
                            ክፍል {g}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Email or Phone field */}
              <div>
                <label className="block text-xs font-bold font-serif-ethiopic text-[#4A4237] mb-1">
                  {mode === 'login'
                    ? 'ኢሜይል ወይም ስልክ (Email / Phone):'
                    : 'ኢሜይል አድራሻ (Email Address):'}
                </label>
                <input
                  type={mode === 'login' ? 'text' : 'email'}
                  required
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  placeholder={mode === 'login' ? 'student@example.com ወይም 0911...' : 'student@example.com'}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-[#38332D]/40 rounded-lg focus:outline-none focus:border-[#2E6B4A] text-[#1E1B18]"
                />
              </div>

              {/* Password field */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold font-serif-ethiopic text-[#4A4237]">
                    የይለፍ ቃል (Password):
                  </label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => {
                        setMode('forgot_select');
                        setErrorMessage(null);
                        setSuccessMessage(null);
                      }}
                      className="text-xs text-[#2E6B4A] hover:underline font-bold font-serif-ethiopic cursor-pointer"
                    >
                      የይለፍ ቃል ረሱ? (Forgot Password?)
                    </button>
                  )}
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="ቢያንስ 6 ፊደላት..."
                    className="w-full px-3 py-2 pr-9 text-xs sm:text-sm bg-white border border-[#38332D]/40 rounded-lg focus:outline-none focus:border-[#2E6B4A] text-[#1E1B18]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-2.5 rounded-lg text-white font-bold font-serif-ethiopic text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer ${
                  role === 'teacher' && mode === 'register'
                    ? 'bg-[#1D4ED8] hover:bg-[#1E40AF]'
                    : 'bg-[#2E6B4A] hover:bg-[#235338]'
                } disabled:opacity-50`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>በማስኬድ ላይ (Processing)...</span>
                  </>
                ) : mode === 'login' ? (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>ግባ (Sign In)</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>{role === 'teacher' ? 'የመምህር አካውንት ፍጠር' : 'የተማሪ አካውንት ፍጠር'}</span>
                  </>
                )}
              </button>
            </form>
          ) : mode === 'forgot_select' ? (
            /* ======================================================== */
            /* VIEW 2: FORGOT PASSWORD SELECTION (PART 1 MANDATE)       */
            /* ======================================================== */
            <div className="space-y-4 text-center">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-300 text-amber-800 flex items-center justify-center mx-auto shadow-xs">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-serif-ethiopic font-bold text-base text-[#1E1B18]">
                  አትጨነቁ። የኑር አካውንትዎን ደህንነቱ በተጠበቀ ሁኔታ ማግኘት ይችላሉ።
                </h4>
                <p className="text-xs text-[#665C4D] mt-1 font-serif-ethiopic">
                  Don't worry. You can securely recover your NUR account. How would you like to recover your account?
                </p>
              </div>

              <div className="space-y-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setMode('forgot_email');
                    setErrorMessage(null);
                    setSuccessMessage(null);
                  }}
                  className="w-full p-3.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 hover:border-[#2E6B4A] transition-all flex items-center gap-3 text-left shadow-xs cursor-pointer group"
                >
                  <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-xs sm:text-sm font-serif-ethiopic text-[#1E1B18]">
                      🔐 በኢሜይል መልሶ ማግኘት (Recover with Email)
                    </div>
                    <div className="text-[11px] text-[#665C4D]">
                      የይለፍ ቃል መልሶ ማግኛ ሊንክ ወደ ኢሜይልዎ ይላካል
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMode('forgot_phone');
                    setPhoneStep('input_phone');
                    setErrorMessage(null);
                    setSuccessMessage(null);
                  }}
                  className="w-full p-3.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 hover:border-[#2E6B4A] transition-all flex items-center gap-3 text-left shadow-xs cursor-pointer group"
                >
                  <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-xs sm:text-sm font-serif-ethiopic text-[#1E1B18]">
                      📱 በስልክ ቁጥር (OTP) መልሶ ማግኘት (Recover with Phone)
                    </div>
                    <div className="text-[11px] text-[#665C4D]">
                      የ 6-አሃዝ የማረጋገጫ ኮድ ወደ ስልክዎ ይላካል
                    </div>
                  </div>
                </button>
              </div>

              <div className="pt-2 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setErrorMessage(null);
                    setSuccessMessage(null);
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-stone-900 font-serif-ethiopic cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>ወደ መግቢያ ተመለስ (Back to Login)</span>
                </button>
              </div>
            </div>
          ) : mode === 'forgot_email' ? (
            /* ======================================================== */
            /* VIEW 3: RECOVER WITH EMAIL                               */
            /* ======================================================== */
            <form onSubmit={handleEmailRecovery} className="space-y-4">
              <div className="text-center">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-2">
                  <Mail className="w-5 h-5" />
                </div>
                <h4 className="font-serif-ethiopic font-bold text-sm text-[#1E1B18]">
                  የኢሜይል አድራሻዎን ያስገቡ
                </h4>
                <p className="text-xs text-[#665C4D] mt-0.5 font-serif-ethiopic">
                  የይለፍ ቃል መልሶ ማግኛ መመሪያ በኢሜይል እንልክልዎታለን
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold font-serif-ethiopic text-[#4A4237] mb-1">
                  ኢሜይል አድራሻ (Email Address):
                </label>
                <input
                  type="email"
                  required
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  placeholder="student@example.com"
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-[#38332D]/40 rounded-lg focus:outline-none focus:border-[#2E6B4A] text-[#1E1B18]"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 rounded-lg text-white font-bold font-serif-ethiopic text-xs sm:text-sm bg-[#2E6B4A] hover:bg-[#235338] transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>በመላክ ላይ...</span>
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4" />
                    <span>የይለፍ ቃል መልሶ ማግኛ ላክ (Send Recovery Link)</span>
                  </>
                )}
              </button>

              <div className="pt-2 text-center border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => {
                    setMode('forgot_select');
                    setErrorMessage(null);
                    setSuccessMessage(null);
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-stone-900 font-serif-ethiopic cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>ወደ ኋላ ተመለስ (Back)</span>
                </button>
              </div>
            </form>
          ) : (
            /* ======================================================== */
            /* VIEW 4: RECOVER WITH PHONE (MULTI-STEP SECURE OTP)       */
            /* ======================================================== */
            <div className="space-y-4">
              {phoneStep === 'input_phone' && (
                <form onSubmit={handleRequestPhoneOtp} className="space-y-3.5">
                  <div className="text-center">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center mx-auto mb-2">
                      <Smartphone className="w-5 h-5" />
                    </div>
                    <h4 className="font-serif-ethiopic font-bold text-sm text-[#1E1B18]">
                      ደረጃ 1፡ ስልክ ቁጥርዎን ያስገቡ
                    </h4>
                    <p className="text-xs text-[#665C4D] mt-0.5 font-serif-ethiopic">
                      Step 1: Enter your registered mobile phone number
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold font-serif-ethiopic text-[#4A4237] mb-1">
                      ስልክ ቁጥር (Mobile Number):
                    </label>
                    <input
                      type="tel"
                      required
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="0911234567 ወይም +251 9..."
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-[#38332D]/40 rounded-lg focus:outline-none focus:border-[#2E6B4A] text-[#1E1B18]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 rounded-lg text-white font-bold font-serif-ethiopic text-xs sm:text-sm bg-[#1D4ED8] hover:bg-[#1E40AF] transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>ኮድ በመላክ ላይ...</span>
                      </>
                    ) : (
                      <>
                        <Smartphone className="w-4 h-4" />
                        <span>የማረጋገጫ ኮድ ላክ (Send Verification Code)</span>
                      </>
                    )}
                  </button>
                </form>
              )}

              {phoneStep === 'input_otp' && (
                <form onSubmit={handleVerifyOtp} className="space-y-3.5">
                  <div className="text-center">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto mb-2">
                      <KeyRound className="w-5 h-5" />
                    </div>
                    <h4 className="font-serif-ethiopic font-bold text-sm text-[#1E1B18]">
                      ደረጃ 2፡ የ 6-አሃዝ የማረጋገጫ ኮድ ያስገቡ
                    </h4>
                    <p className="text-xs text-[#665C4D] mt-0.5 font-serif-ethiopic">
                      Enter the 6-digit OTP code sent to your phone
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold font-serif-ethiopic text-[#4A4237] mb-1">
                      የማረጋገጫ ኮድ (OTP Code):
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                      placeholder="123456"
                      className="w-full text-center tracking-widest font-mono text-lg font-bold px-3 py-2 bg-white border border-[#38332D]/40 rounded-lg focus:outline-none focus:border-[#2E6B4A] text-[#1E1B18]"
                    />
                    <div className="flex items-center justify-between text-[11px] text-stone-500 mt-1.5 font-mono">
                      <span>
                        ቀሪ ጊዜ (Time): {Math.floor(otpTimer / 60)}:{(otpTimer % 60).toString().padStart(2, '0')}
                      </span>
                      <button
                        type="button"
                        onClick={handleRequestPhoneOtp}
                        disabled={otpTimer > 240}
                        className="text-[#2E6B4A] hover:underline disabled:opacity-40 cursor-pointer"
                      >
                        እንደገና ላክ (Resend)
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 rounded-lg text-white font-bold font-serif-ethiopic text-xs sm:text-sm bg-[#2E6B4A] hover:bg-[#235338] transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>በማረጋገጥ ላይ...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        <span>ኮዱን አረጋግጥ (Verify Code)</span>
                      </>
                    )}
                  </button>
                </form>
              )}

              {phoneStep === 'input_new_password' && (
                <form onSubmit={handleSetNewPassword} className="space-y-3.5">
                  <div className="text-center">
                    <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center mx-auto mb-2">
                      <Lock className="w-5 h-5" />
                    </div>
                    <h4 className="font-serif-ethiopic font-bold text-sm text-[#1E1B18]">
                      ደረጃ 3፡ አዲስ ጠንካራ የይለፍ ቃል ያስገቡ
                    </h4>
                    <p className="text-xs text-[#665C4D] mt-0.5 font-serif-ethiopic">
                      Set your new password (minimum 8 characters with letters & numbers)
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold font-serif-ethiopic text-[#4A4237] mb-1">
                      አዲስ የይለፍ ቃል (New Password):
                    </label>
                    <input
                      type="password"
                      required
                      minLength={8}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="ቢያንስ 8 ፊደላትና ቁጥሮች..."
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-[#38332D]/40 rounded-lg focus:outline-none focus:border-[#2E6B4A] text-[#1E1B18]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold font-serif-ethiopic text-[#4A4237] mb-1">
                      አዲሱን የይለፍ ቃል ያረጋግጡ (Confirm Password):
                    </label>
                    <input
                      type="password"
                      required
                      minLength={8}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="የይለፍ ቃሉን ይድገሙ..."
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-[#38332D]/40 rounded-lg focus:outline-none focus:border-[#2E6B4A] text-[#1E1B18]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 rounded-lg text-white font-bold font-serif-ethiopic text-xs sm:text-sm bg-[#2E6B4A] hover:bg-[#235338] transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>በመቀየር ላይ...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>የይለፍ ቃል ቀይር (Update Password)</span>
                      </>
                    )}
                  </button>
                </form>
              )}

              {phoneStep === 'done' && (
                <div className="text-center space-y-3 py-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                    <CheckCircle className="w-7 h-7" />
                  </div>
                  <h4 className="font-serif-ethiopic font-bold text-base text-emerald-900">
                    የይለፍ ቃልዎ በተሳካ ሁኔታ ተቀይሯል!
                  </h4>
                  <p className="text-xs text-[#665C4D] font-serif-ethiopic">
                    አሁን በአዲሱ የይለፍ ቃልዎ መግባት ይችላሉ።
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      setErrorMessage(null);
                      setSuccessMessage(null);
                    }}
                    className="w-full py-2.5 rounded-lg bg-[#2E6B4A] text-white font-bold font-serif-ethiopic text-xs sm:text-sm hover:bg-[#235338] transition-all shadow-md cursor-pointer"
                  >
                    ወደ መግቢያ ሂድ (Proceed to Login)
                  </button>
                </div>
              )}

              {phoneStep !== 'done' && (
                <div className="pt-2 text-center border-t border-stone-200">
                  <button
                    type="button"
                    onClick={() => {
                      setMode('forgot_select');
                      setErrorMessage(null);
                      setSuccessMessage(null);
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-stone-900 font-serif-ethiopic cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>ወደ ኋላ ተመለስ (Back)</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Informational Footer */}
        <div className="bg-[#EDE5D2] px-4 py-2.5 border-t border-[#D8CEBC] text-[11px] text-[#665C4D] flex items-center justify-between">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>ደህንነቱ የተጠበቀ የFirebase Cloud አገልግሎት</span>
          </span>
          <span className="font-mono text-[10px] text-[#7A6E5C]">v2.0 Fortress</span>
        </div>
      </div>
    </div>
  );
};
