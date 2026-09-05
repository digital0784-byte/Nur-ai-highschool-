import React, { useState } from 'react';
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
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Grade, UserRole } from '../types';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    authModalMode,
    openAuthModal,
    closeAuthModal,
    login,
    register,
  } = useAuth();

  const [mode, setMode] = useState<'login' | 'register'>(authModalMode);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [displayName, setDisplayName] = useState<string>('');
  const [role, setRole] = useState<UserRole>('student');
  const [grade, setGrade] = useState<Grade>(9);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Sync mode if parent opened with specific mode
  React.useEffect(() => {
    setMode(authModalMode);
    setErrorMessage(null);
    setSuccessMessage(null);
  }, [authModalMode, isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      if (mode === 'login') {
        if (!email.trim() || !password) {
          setErrorMessage('እባክዎ ኢሜይል እና የይለፍ ቃል ያስገቡ (Please enter email and password)');
          setIsLoading(false);
          return;
        }
        await login(email, password);
      } else {
        if (!displayName.trim()) {
          setErrorMessage('እባክዎ ሙሉ ስምዎን ያስገቡ (Please enter your full name)');
          setIsLoading(false);
          return;
        }
        if (!email.trim() || password.length < 6) {
          setErrorMessage('የይለፍ ቃል ቢያንስ 6 ፊደላት መሆን አለበት (Password must be at least 6 characters)');
          setIsLoading(false);
          return;
        }
        await register(email, password, displayName, role, grade);
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

  return (
    <div
      id="auth-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#1E1B18]/70 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeAuthModal();
      }}
    >
      <div
        id="auth-modal-container"
        className="w-full max-w-md bg-[#FAF6EC] border-[2px] border-[#38332D] shadow-2xl overflow-hidden rounded-xl text-[#1E1B18]"
      >
        {/* Modal Header */}
        <div className="bg-[#38332D] text-[#FAF6EC] px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#EBD9B4] text-[#38332D] flex items-center justify-center font-bold">
              {mode === 'login' ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
            </div>
            <div>
              <h3 className="font-serif-ethiopic font-bold text-base text-[#FAF6EC]">
                {mode === 'login' ? 'መግቢያ (Sign In)' : 'አዲስ አካውንት መፍጠሪያ (Create Account)'}
              </h3>
              <p className="text-[11px] text-[#D8CEBC]">
                {mode === 'login'
                  ? 'ወደ መማሪያ ዳታቤዝዎ ይግቡ'
                  : 'የተማሪ ወይም የመምህር አካውንት ይመዝገቡ'}
              </p>
            </div>
          </div>
          <button
            id="auth-modal-close-btn"
            onClick={closeAuthModal}
            className="p-1.5 text-[#D8CEBC] hover:text-[#FAF6EC] hover:bg-[#4E473E] rounded-md transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher: Login vs Register */}
        <div className="grid grid-cols-2 border-b border-[#D8CEBC] bg-[#EDE5D2]">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              openAuthModal('login');
              setErrorMessage(null);
            }}
            className={`py-2.5 text-xs sm:text-sm font-bold font-serif-ethiopic transition-all cursor-pointer ${
              mode === 'login'
                ? 'bg-[#FAF6EC] text-[#1E1B18] border-b-2 border-[#1E1B18] shadow-xs'
                : 'text-[#665C4D] hover:text-[#1E1B18] hover:bg-[#E5DCB9]'
            }`}
          >
            መግቢያ (Sign In)
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              openAuthModal('register');
              setErrorMessage(null);
            }}
            className={`py-2.5 text-xs sm:text-sm font-bold font-serif-ethiopic transition-all cursor-pointer ${
              mode === 'register'
                ? 'bg-[#FAF6EC] text-[#1E1B18] border-b-2 border-[#1E1B18] shadow-xs'
                : 'text-[#665C4D] hover:text-[#1E1B18] hover:bg-[#E5DCB9]'
            }`}
          >
            አዲስ ምዝገባ (Register)
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-3.5">
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-300 text-red-800 text-xs rounded-lg flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs rounded-lg flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Registration Fields */}
          {mode === 'register' && (
            <>
              {/* Role Selection */}
              <div>
                <label className="block text-xs font-bold font-serif-ethiopic text-[#4A4237] mb-1.5">
                  የአካውንት ሚና ይምረጡ (Select Account Role):
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('student')}
                    className={`p-2.5 border rounded-lg flex flex-col items-center text-center transition-all cursor-pointer ${
                      role === 'student'
                        ? 'border-[#2E6B4A] bg-[#EAF3ED] text-[#1E4A32] font-bold shadow-xs'
                        : 'border-[#D8CEBC] bg-[#FAF6EC] text-[#665C4D] hover:bg-[#F2EDE1]'
                    }`}
                  >
                    <GraduationCap className={`w-5 h-5 mb-1 ${role === 'student' ? 'text-[#2E6B4A]' : 'text-stone-500'}`} />
                    <span className="text-xs font-bold font-serif-ethiopic">🎓 ተማሪ (Student)</span>
                    <span className="text-[10px] text-opacity-80">ኮርስ መከታተያ እና ፈተና</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('teacher')}
                    className={`p-2.5 border rounded-lg flex flex-col items-center text-center transition-all cursor-pointer ${
                      role === 'teacher'
                        ? 'border-[#1D4ED8] bg-[#EFF6FF] text-[#1E3A8A] font-bold shadow-xs'
                        : 'border-[#D8CEBC] bg-[#FAF6EC] text-[#665C4D] hover:bg-[#F2EDE1]'
                    }`}
                  >
                    <Briefcase className={`w-5 h-5 mb-1 ${role === 'teacher' ? 'text-[#1D4ED8]' : 'text-stone-500'}`} />
                    <span className="text-xs font-bold font-serif-ethiopic">👨‍🏫 መምህር (Teacher)</span>
                    <span className="text-[10px] text-opacity-80">የተማሪዎች ዳሽቦርድ መከታተያ</span>
                  </button>
                </div>
              </div>

              {/* Display Name */}
              <div>
                <label className="block text-xs font-bold font-serif-ethiopic text-[#4A4237] mb-1">
                  ሙሉ ስም (Full Name):
                </label>
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="ለምሳሌ፡ አልማዝ ተስፋዬ ወይም መምህር በቀለ"
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-[#38332D]/40 rounded-lg focus:outline-none focus:border-[#2E6B4A] text-[#1E1B18]"
                />
              </div>

              {/* Grade selection for students */}
              {role === 'student' && (
                <div>
                  <label className="block text-xs font-bold font-serif-ethiopic text-[#4A4237] mb-1">
                    የትምህርት ክፍል (Grade Level):
                  </label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {([9, 10, 11, 12] as Grade[]).map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setGrade(g)}
                        className={`py-1.5 text-xs font-bold rounded border transition-all cursor-pointer ${
                          grade === g
                            ? 'bg-[#38332D] text-[#FAF6EC] border-[#38332D]'
                            : 'bg-[#F2EDE1] text-[#4A4237] border-[#D8CEBC] hover:bg-[#E5DCB9]'
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

          {/* Email */}
          <div>
            <label className="block text-xs font-bold font-serif-ethiopic text-[#4A4237] mb-1">
              ኢሜይል አድራሻ (Email Address):
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="student@example.com"
              className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-[#38332D]/40 rounded-lg focus:outline-none focus:border-[#2E6B4A] text-[#1E1B18]"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold font-serif-ethiopic text-[#4A4237] mb-1">
              የይለፍ ቃል (Password):
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="ቢያንስ 6 ፊደላት..."
              className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-[#38332D]/40 rounded-lg focus:outline-none focus:border-[#2E6B4A] text-[#1E1B18]"
            />
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

        {/* Informational Footer */}
        <div className="bg-[#EDE5D2] px-4 py-2.5 border-t border-[#D8CEBC] text-[11px] text-[#665C4D] flex items-center justify-between">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>ደህንነቱ የተጠበቀ የFirebase Cloud አገልግሎት</span>
          </span>
          <span className="font-mono text-[10px] text-[#7A6E5C]">v1.0 Cloud</span>
        </div>
      </div>
    </div>
  );
};
