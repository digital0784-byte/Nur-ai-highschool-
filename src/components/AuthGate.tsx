import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Sparkles,
  BookOpen,
  CheckCircle2,
  LogIn,
  UserPlus,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Loader2,
  Compass,
  Activity,
  Layers,
  Award,
  Users,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Grade, UserRole } from '../types';

interface AuthGateProps {
  children: React.ReactNode;
}

export const AuthGate: React.FC<AuthGateProps> = ({ children }) => {
  const { user, userProfile, loading, login, register } = useAuth();
  const { t, language } = useLanguage();

  // Guest bypass state: check sessionStorage so guest status persists across tabs/refreshes in current session
  const [guestBypass, setGuestBypass] = useState<boolean>(() => {
    return sessionStorage.getItem('nur_guest_bypass') === 'true';
  });

  const [authMode, setAuthMode] = useState<'login' | 'register' | 'guest'>('login');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [displayName, setDisplayName] = useState<string>('');
  const [role, setRole] = useState<UserRole>('student');
  const [selectedGrade, setSelectedGrade] = useState<Grade>(9);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // If user signs out, we can keep or reset guest bypass
  useEffect(() => {
    if (user) {
      sessionStorage.removeItem('nur_guest_bypass');
      setGuestBypass(false);
    }
  }, [user]);

  // Handle Form Submit for Login or Register
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    try {
      if (authMode === 'login') {
        if (!email.trim() || !password) {
          setErrorMessage('እባክዎ ኢሜይል እና የይለፍ ቃል ያስገቡ (Please enter email & password)');
          setIsSubmitting(false);
          return;
        }
        await login(email, password);
      } else if (authMode === 'register') {
        if (!displayName.trim()) {
          setErrorMessage('እባክዎ ሙሉ ስምዎን ያስገቡ (Please enter your name)');
          setIsSubmitting(false);
          return;
        }
        if (!email.trim() || password.length < 6) {
          setErrorMessage('የይለፍ ቃል ቢያንስ 6 ፊደላት መሆን አለበት (Password must be 6+ characters)');
          setIsSubmitting(false);
          return;
        }
        await register(email, password, displayName, role, selectedGrade);
      }
    } catch (err: any) {
      console.error('AuthGate error:', err);
      let msg = err.message || 'ስህተት ተከስቷል፣ እባክዎ እንደገና ይሞክሩ (An error occurred)';
      if (err.code === 'auth/email-already-in-use') {
        msg = 'ይህ ኢሜይል አስቀድሞ ተመዝግቧል፣ እባክዎ ይግቡ (Email already registered. Please sign in)';
      } else if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        msg = 'የተሳሳተ ኢሜይል ወይም የይለፍ ቃል (Invalid email or password)';
      } else if (err.code === 'auth/weak-password') {
        msg = 'የይለፍ ቃሉ ቢያንስ 6 ፊደላት መሆን አለበት (Password must be at least 6 characters)';
      }
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Guest Entry
  const handleContinueAsGuest = () => {
    sessionStorage.setItem('nur_guest_bypass', 'true');
    setGuestBypass(true);
  };

  // Loading spinner while Firebase Auth resolves
  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF6EC] flex flex-col items-center justify-center p-4 text-[#1E1B18]">
        <div className="flex flex-col items-center gap-3 p-6 bg-[#EDE6D4] border-[1.5px] border-[#38332D] rounded-xl shadow-xs">
          <Loader2 className="w-8 h-8 animate-spin text-amber-700" />
          <div className="text-center font-serif-ethiopic">
            <h3 className="font-bold text-base">ኑር AI የሁለተኛ ደረጃ ትምህርት ቤት</h3>
            <p className="text-xs text-[#5A5143] mt-1">መረጃዎችን በማዘጋጀት ላይ...</p>
          </div>
        </div>
      </div>
    );
  }

  // If user is authenticated OR has entered as guest, render app children
  if (user || guestBypass) {
    return <>{children}</>;
  }

  return (
    <div
      id="nur-ai-auth-gate"
      className="min-h-screen bg-[#FAF6EC] text-[#24211E] py-4 sm:py-8 px-3 sm:px-6 flex flex-col items-center justify-center font-serif-ethiopic"
    >
      <div className="w-full max-w-4xl bg-[#FAF6EC] border-[2px] border-[#38332D] shadow-[4px_4px_0px_0px_#38332D] rounded-xl overflow-hidden flex flex-col md:flex-row">
        {/* Left Col: Platform Branding, Pillars & Vision */}
        <div className="md:w-5/12 bg-[#EDE6D4] p-6 sm:p-8 border-b md:border-b-0 md:border-r-[1.5px] border-[#38332D] flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-11 h-11 rounded-lg bg-[#1E1B18] text-[#FAF6EC] flex items-center justify-center border border-[#38332D] shadow-xs shrink-0">
                <GraduationCap className="w-6 h-6 text-amber-300" />
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider font-sans font-black bg-amber-200 text-amber-950 px-2 py-0.5 rounded border border-amber-400">
                  Nur AI High School
                </span>
                <h1 className="text-base sm:text-lg font-bold text-[#1E1B18] mt-0.5 leading-tight">
                  ኑር AI ሁለተኛ ደረጃ ትምህርት ቤት
                </h1>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#423A2F] leading-relaxed">
              የኢትዮጵያ የ9-12ኛ ክፍል አዲሱ ስርዓተ-ትምህርት መስተጋብራዊ AI የትምህርት፣ የላብራቶሪ ማስመሰያ እና የፈተና መድረክ።
            </p>

            {/* Feature Checklist */}
            <div className="space-y-2.5 pt-2 border-t border-[#38332D]/20">
              <div className="flex items-start gap-2 text-xs text-[#2E2820]">
                <BookOpen className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                <span>
                  <strong>12ቱ የትምህርት አይነቶች</strong>፡ ሙሉ የተማሪ መጽሐፍት፣ ማጠቃለያ እና የተግባር ልምምዶች።
                </span>
              </div>
              <div className="flex items-start gap-2 text-xs text-[#2E2820]">
                <Sparkles className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <span>
                  <strong>የግል AI መምህር</strong>፡ ጥያቄዎችን በቅጽበት የሚመልስና ድክመቶችን የሚለይ አስተማሪ።
                </span>
              </div>
              <div className="flex items-start gap-2 text-xs text-[#2E2820]">
                <Activity className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span>
                  <strong>የቀጥታ ፊዚክስና ሂሳብ ማስመሰያ</strong>፡ 2D/3D ግራፍ እና በHTML5 ካንቫስ የሚሰሩ ሙከራዎች።
                </span>
              </div>
              <div className="flex items-start gap-2 text-xs text-[#2E2820]">
                <Award className="w-4 h-4 text-purple-700 shrink-0 mt-0.5" />
                <span>
                  <strong>ውጤት ክትትልና ሰርተፍኬት</strong>፡ በክላውድ የሚቀመጥ የትምህርት ግስጋሴ እና የማጠቃለያ የምስክር ወረቀት።
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#38332D]/20 text-[11px] text-[#665C4D]">
            <span>ኢትዮጵያ • የትምህርት ሚኒስቴር ስርዓተ-ትምህርት • ክፍል 9-12</span>
          </div>
        </div>

        {/* Right Col: Authentication Portal Form */}
        <div className="md:w-7/12 p-6 sm:p-8 flex flex-col justify-between space-y-5 bg-[#FAF6EC]">
          {/* Mode Tabs */}
          <div>
            <div className="flex rounded-lg border border-[#38332D] p-1 bg-[#EDE6D4] gap-1">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('login');
                  setErrorMessage(null);
                }}
                className={`flex-1 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  authMode === 'login'
                    ? 'bg-[#1E1B18] text-[#FAF6EC] shadow-2xs'
                    : 'text-[#423A2F] hover:bg-[#E3DAC4]'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>መግቢያ (Sign In)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setAuthMode('register');
                  setErrorMessage(null);
                }}
                className={`flex-1 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  authMode === 'register'
                    ? 'bg-[#1E1B18] text-[#FAF6EC] shadow-2xs'
                    : 'text-[#423A2F] hover:bg-[#E3DAC4]'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>ምዝገባ (Register)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setAuthMode('guest');
                  setErrorMessage(null);
                }}
                className={`flex-1 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  authMode === 'guest'
                    ? 'bg-[#1E1B18] text-[#FAF6EC] shadow-2xs'
                    : 'text-[#423A2F] hover:bg-[#E3DAC4]'
                }`}
              >
                <Compass className="w-3.5 h-3.5 text-amber-600" />
                <span>እንደ እንግዳ (Guest)</span>
              </button>
            </div>
          </div>

          {/* Error & Success Feedback Alerts */}
          {errorMessage && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-300 text-xs text-rose-900 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-300 text-xs text-emerald-900 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Form for Login & Register */}
          {authMode !== 'guest' ? (
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {authMode === 'register' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-[#1E1B18] mb-1">
                      ሙሉ ስም (Full Name)
                    </label>
                    <input
                      type="text"
                      required
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="ለምሳሌ፡ ኑር አህመድ"
                      className="w-full bg-[#EDE6D4] border border-[#38332D] rounded-lg px-3 py-2 text-xs text-[#1E1B18] focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  {/* Role Selector: Student vs Teacher */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setRole('student')}
                      className={`p-2 rounded-lg border text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer ${
                        role === 'student'
                          ? 'bg-amber-100 border-amber-800 text-amber-950 ring-1 ring-amber-700'
                          : 'bg-[#EDE6D4] border-[#38332D]/40 text-[#423A2F]'
                      }`}
                    >
                      <GraduationCap className="w-4 h-4 text-amber-800" />
                      <span>ተማሪ (Student)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRole('teacher')}
                      className={`p-2 rounded-lg border text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer ${
                        role === 'teacher'
                          ? 'bg-blue-100 border-blue-800 text-blue-950 ring-1 ring-blue-700'
                          : 'bg-[#EDE6D4] border-[#38332D]/40 text-[#423A2F]'
                      }`}
                    >
                      <Users className="w-4 h-4 text-blue-800" />
                      <span>መምህር (Teacher)</span>
                    </button>
                  </div>

                  {/* Grade Selector if Student */}
                  {role === 'student' && (
                    <div>
                      <label className="block text-xs font-bold text-[#1E1B18] mb-1">
                        የክፍል ደረጃ (Grade Level)
                      </label>
                      <div className="grid grid-cols-4 gap-1.5">
                        {([9, 10, 11, 12] as Grade[]).map((g) => (
                          <button
                            key={g}
                            type="button"
                            onClick={() => setSelectedGrade(g)}
                            className={`py-1.5 rounded-lg border text-xs font-bold font-sans cursor-pointer ${
                              selectedGrade === g
                                ? 'bg-[#1E1B18] text-white border-[#1E1B18]'
                                : 'bg-[#EDE6D4] text-[#38332D] border-[#38332D]/30 hover:bg-[#E3DAC4]'
                            }`}
                          >
                            {g}ኛ ክፍል
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Email Address */}
              <div>
                <label className="block text-xs font-bold text-[#1E1B18] mb-1">
                  ኢሜይል አድራሻ (Email Address)
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-[#EDE6D4] border border-[#38332D] rounded-lg px-3 py-2 text-xs text-[#1E1B18] focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold text-[#1E1B18] mb-1">
                  የይለፍ ቃል (Password)
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#EDE6D4] border border-[#38332D] rounded-lg px-3 py-2 text-xs text-[#1E1B18] focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <span className="text-[10px] text-[#665C4D]">ቢያንስ 6 ፊደላት ወይም ቁጥሮች</span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 rounded-lg bg-[#1E1B18] hover:bg-[#38332D] text-[#FAF6EC] font-bold text-xs flex items-center justify-center gap-2 shadow-2xs cursor-pointer disabled:opacity-50 mt-2"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                ) : (
                  <ArrowRight className="w-4 h-4 text-amber-400" />
                )}
                <span>
                  {authMode === 'login'
                    ? 'ወደ ኑር AI መድረክ ግባ (Sign In)'
                    : 'አካውንት ፈጥርና ጀምር (Create Account)'}
                </span>
              </button>
            </form>
          ) : (
            /* Guest Mode Explainer & Instant Entrance */
            <div className="space-y-4 text-center py-2">
              <div className="w-12 h-12 rounded-full bg-amber-100 border border-amber-400 text-amber-800 flex items-center justify-center mx-auto">
                <Compass className="w-6 h-6" />
              </div>

              <div className="space-y-1">
                <h3 className="font-bold text-sm text-[#1E1B18]">
                  ያለ ምዝገባ እንደ እንግዳ መማር ይፈልጋሉ?
                </h3>
                <p className="text-xs text-[#5A5143] max-w-sm mx-auto leading-relaxed">
                  ምንም ኢሜይል ወይም የይለፍ ቃል ሳያስፈልግ የ9-12ኛ ክፍል ሙሉ ትምህርቶችን፣ ቪዲዮዎችን፣ ግራፎችንና ፍላሽካርዶችን ወዲያውኑ ማግኘት ይችላሉ።
                </p>
              </div>

              <div className="p-3 bg-[#EDE6D4] border border-[#38332D]/30 rounded-lg text-left text-xs text-[#38332D] space-y-1">
                <p className="font-bold text-[#1E1B18]">💡 የማስታወሻ ነጥብ፡</p>
                <p>• የመማሪያ ሂደትን በደመና (Cloud) ለማስቀመጥና ሰርተፍኬት በስምዎ ለማውጣት በኋላ መመዝገብ ይችላሉ።</p>
              </div>

              <button
                type="button"
                onClick={handleContinueAsGuest}
                className="w-full py-2.5 rounded-lg bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-2xs cursor-pointer"
              >
                <span>እንደ እንግዳ ወዲያውኑ ጀምር (Explore as Guest)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Quick Bypass link at bottom */}
          {authMode !== 'guest' && (
            <div className="text-center pt-2 border-t border-[#38332D]/20">
              <button
                type="button"
                onClick={handleContinueAsGuest}
                className="text-xs text-[#5A5143] hover:text-[#1E1B18] underline cursor-pointer font-serif-ethiopic"
              >
                መመዝገብ አልፈልግም፣ እንደ እንግዳ አስስ (Skip & Continue as Guest) →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
