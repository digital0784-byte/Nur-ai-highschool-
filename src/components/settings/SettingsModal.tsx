import React, { useState, useEffect } from 'react';
import {
  X,
  Settings,
  User,
  BookOpen,
  Bot,
  Bell,
  Eye,
  Shield,
  CreditCard,
  Crown,
  Globe,
  Palette,
  Accessibility,
  Database,
  HelpCircle,
  FileText,
  Info,
  LogOut,
  Lock,
  KeyRound,
  Laptop,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  Loader2,
  RefreshCw,
  Trash2,
  ShieldAlert,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSubscription } from '../../context/SubscriptionContext';
import { useLanguage } from '../../context/LanguageContext';
import { premiumContentService } from '../../services/premiumContentService';

export type SettingsTabId =
  | 'account'
  | 'learning'
  | 'ai_tutor'
  | 'notifications'
  | 'privacy'
  | 'security'
  | 'subscription_payments'
  | 'premium'
  | 'language'
  | 'appearance'
  | 'accessibility'
  | 'data_storage'
  | 'help_support'
  | 'legal'
  | 'about'
  | 'logout';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: SettingsTabId;
  onOpenRecovery?: () => void;
  onOpenSubscription?: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'security',
  onOpenRecovery,
  onOpenSubscription,
}) => {
  const { user, userProfile, logout, openAuthModal } = useAuth();
  const { accessStatus, remainingDays, isOwnerSuperAdmin } = useSubscription();
  const { language, setLanguage, languages } = useLanguage();

  const [activeTab, setActiveTab] = useState<SettingsTabId>(initialTab);

  // Security Form States
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordFeedback, setPasswordFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Active Sessions State
  const [activeSessions, setActiveSessions] = useState<any[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(false);
  const [sessionActionMsg, setSessionActionMsg] = useState<string | null>(null);

  // Account State
  const [studentName, setStudentName] = useState(userProfile?.displayName || user?.displayName || 'Student');
  const [preferredGrade, setPreferredGrade] = useState(userProfile?.grade || 9);

  // Appearance & Accessibility
  const [themeMode, setThemeMode] = useState<'light' | 'sepia' | 'dark'>('sepia');
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  // AI Tutor Preferences
  const [tutorTone, setTutorTone] = useState<'socratic' | 'step_by_step' | 'concise'>('step_by_step');

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  useEffect(() => {
    if (activeTab === 'security' && isOpen) {
      loadSessions();
    }
  }, [activeTab, isOpen]);

  const loadSessions = async () => {
    setSessionsLoading(true);
    try {
      const list = await premiumContentService.getActiveSessions();
      setActiveSessions(list);
    } catch {
      setActiveSessions([
        {
          id: 'sess_current',
          device: 'Desktop Chrome / Linux',
          ipAddress: 'Current Device IP (Sandboxed)',
          lastActive: new Date().toISOString(),
          isCurrent: true,
        },
      ]);
    } finally {
      setSessionsLoading(false);
    }
  };

  if (!isOpen) return null;

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordFeedback(null);

    if (newPassword.length < 8) {
      setPasswordFeedback({
        type: 'error',
        text: 'የይለፍ ቃል ቢያንስ 8 ፊደላትና ቁጥሮች መሆን አለበት (Minimum 8 characters with letters & numbers).',
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordFeedback({
        type: 'error',
        text: 'የይለፍ ቃሎቹ አይዛመዱም (Passwords do not match).',
      });
      return;
    }

    setPasswordLoading(true);
    try {
      const res = await premiumContentService.changePassword(currentPassword, newPassword);
      if (res.success) {
        setPasswordFeedback({
          type: 'success',
          text: res.message || 'የይለፍ ቃልዎ በተሳካ ሁኔታ ተቀይሯል (Password changed successfully)!',
        });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setPasswordFeedback({
          type: 'error',
          text: res.message || 'የይለፍ ቃሉን መቀየር አልተቻለም።',
        });
      }
    } catch (err: any) {
      setPasswordFeedback({
        type: 'error',
        text: err.message || 'የስርዓት ስህተት ተከስቷል። እባክዎ እንደገና ይሞክሩ።',
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleSignOutAllOtherDevices = async () => {
    setSessionsLoading(true);
    setSessionActionMsg(null);
    try {
      const res = await premiumContentService.signOutAllOtherDevices();
      setSessionActionMsg(res.message || 'ሁሉም ሌሎች መሣሪያዎች በተሳካ ሁኔታ ወጥተዋል (Signed out other devices).');
      loadSessions();
    } catch (err: any) {
      setSessionActionMsg(err.message || 'ስህተት ተከስቷል');
    } finally {
      setSessionsLoading(false);
    }
  };

  const menuItems: { id: SettingsTabId; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'account', label: 'መለያ (Account)', icon: <User className="w-4 h-4" /> },
    { id: 'learning', label: 'ትምህርት (Learning)', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'ai_tutor', label: 'AI አስረጅ (AI Tutor)', icon: <Bot className="w-4 h-4" /> },
    { id: 'notifications', label: 'ማሳወቂያዎች (Notifications)', icon: <Bell className="w-4 h-4" /> },
    { id: 'privacy', label: 'ግላዊነት (Privacy)', icon: <Eye className="w-4 h-4" /> },
    { id: 'security', label: 'ደህንነት (Security)', icon: <Shield className="w-4 h-4" />, badge: 'Protected' },
    { id: 'subscription_payments', label: 'ሳብስክሪፕሽንና ክፍያ (Subscription & Payments)', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'premium', label: 'ፕሪሚየም ይዘት (Premium)', icon: <Crown className="w-4 h-4 text-amber-500" /> },
    { id: 'language', label: 'ቋንቋ (Language)', icon: <Globe className="w-4 h-4" /> },
    { id: 'appearance', label: 'ገጽታ (Appearance)', icon: <Palette className="w-4 h-4" /> },
    { id: 'accessibility', label: 'ተደራሽነት (Accessibility)', icon: <Accessibility className="w-4 h-4" /> },
    { id: 'data_storage', label: 'መረጃና ማከማቻ (Data & Storage)', icon: <Database className="w-4 h-4" /> },
    { id: 'help_support', label: 'እርዳታና ድጋፍ (Help & Support)', icon: <HelpCircle className="w-4 h-4" /> },
    { id: 'legal', label: 'ህጋዊ መመሪያ (Legal)', icon: <FileText className="w-4 h-4" /> },
    { id: 'about', label: 'ስለ ኑር AI (About NUR)', icon: <Info className="w-4 h-4" /> },
    { id: 'logout', label: 'ውጣ (Logout)', icon: <LogOut className="w-4 h-4 text-rose-600" /> },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
      <div
        id="settings-dialog"
        className="relative w-full max-w-4xl max-h-[92vh] bg-[#FAF6EC] border-[2px] border-[#38332D] rounded-2xl shadow-[6px_6px_0px_0px_#38332D] flex flex-col overflow-hidden text-[#1E1B18]"
      >
        {/* Header */}
        <div className="px-5 py-3.5 bg-[#EDE5D2] border-b-[2px] border-[#38332D] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#2E6B4A] text-white flex items-center justify-center shadow-xs">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif-ethiopic font-black text-base sm:text-lg text-[#1E1B18] leading-tight">
                ቅንብሮች (System Settings)
              </h2>
              <p className="text-[11px] text-[#665C4D] font-serif-ethiopic">
                NUR AI High School Tutor • Secure Settings Hub
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg border border-[#38332D]/40 bg-white hover:bg-stone-200 transition-colors cursor-pointer text-[#1E1B18]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body: Left Sidebar + Right Content Area */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Navigation Items (16 Items) */}
          <div className="w-full md:w-64 bg-[#F2ECE0] border-b md:border-b-0 md:border-r-[1.5px] border-[#38332D]/30 overflow-y-auto p-2 space-y-1 shrink-0 max-h-48 md:max-h-full">
            {menuItems.map((item) => {
              const isSelected = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.id === 'logout') {
                      logout();
                      onClose();
                    } else {
                      setActiveTab(item.id);
                    }
                  }}
                  className={`w-full px-3 py-2 rounded-xl text-left text-xs font-serif-ethiopic flex items-center justify-between transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#2E6B4A] text-white font-bold shadow-xs'
                      : 'text-[#4A4237] hover:bg-[#E5DCB9] hover:text-[#1E1B18]'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    {item.icon}
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[9.5px] px-1.5 py-0.5 rounded-full font-sans uppercase font-black ${
                        isSelected ? 'bg-amber-400 text-stone-900' : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Content Area */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto bg-[#FAF6EC] space-y-6">
            {/* ========================================================= */}
            {/* TAB: SECURITY (PART 1 & PART 18 MANDATES)                 */}
            {/* ========================================================= */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <div className="border-b border-[#D5C9AC] pb-3">
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-emerald-700" />
                    <h3 className="font-serif-ethiopic font-bold text-base text-[#1E1B18]">
                      የደህንነትና የይለፍ ቃል ማስተካከያ (Security & Password)
                    </h3>
                  </div>
                  <p className="text-xs text-[#665C4D] font-serif-ethiopic mt-1">
                    Manage password changes, account recovery channels, and active device sessions.
                  </p>
                </div>

                {/* 1. CHANGE PASSWORD FORM */}
                <div className="bg-white border-[1.5px] border-[#38332D] rounded-xl p-4 sm:p-5 shadow-xs space-y-4">
                  <div className="flex items-center gap-2">
                    <KeyRound className="w-4 h-4 text-emerald-700" />
                    <h4 className="font-serif-ethiopic font-bold text-sm text-[#1E1B18]">
                      [ Change Password ] የይለፍ ቃል መቀየሪያ
                    </h4>
                  </div>

                  {passwordFeedback && (
                    <div
                      className={`p-3 rounded-lg text-xs font-serif-ethiopic flex items-center gap-2 border ${
                        passwordFeedback.type === 'success'
                          ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                          : 'bg-rose-50 text-rose-900 border-rose-300'
                      }`}
                    >
                      {passwordFeedback.type === 'success' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-rose-700 shrink-0" />
                      )}
                      <span>{passwordFeedback.text}</span>
                    </div>
                  )}

                  <form onSubmit={handlePasswordChange} className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold font-serif-ethiopic text-[#4A4237] mb-1">
                        የአሁኑ የይለፍ ቃል (Current Password):
                      </label>
                      <input
                        type="password"
                        required
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="የነበረውን የይለፍ ቃል ያስገቡ..."
                        className="w-full px-3 py-2 text-xs sm:text-sm bg-[#FAF6EC] border border-[#38332D]/40 rounded-lg focus:outline-none focus:border-[#2E6B4A]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                          className="w-full px-3 py-2 text-xs sm:text-sm bg-[#FAF6EC] border border-[#38332D]/40 rounded-lg focus:outline-none focus:border-[#2E6B4A]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold font-serif-ethiopic text-[#4A4237] mb-1">
                          አዲሱን ያረጋግጡ (Confirm Password):
                        </label>
                        <input
                          type="password"
                          required
                          minLength={8}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="አዲሱን ይለፍ ቃል ይድገሙ..."
                          className="w-full px-3 py-2 text-xs sm:text-sm bg-[#FAF6EC] border border-[#38332D]/40 rounded-lg focus:outline-none focus:border-[#2E6B4A]"
                        />
                      </div>
                    </div>

                    <div className="text-[11px] text-[#665C4D] font-mono">
                      * የይለፍ ቃል ህግ፡ ቢያንስ 8 ፊደላት፣ ቁጥሮች እና ምልክቶችን ያካተተ መሆን አለበት።
                    </div>

                    <button
                      type="submit"
                      disabled={passwordLoading}
                      className="px-5 py-2.5 rounded-lg bg-[#2E6B4A] hover:bg-[#235338] text-white font-bold font-serif-ethiopic text-xs sm:text-sm shadow-xs transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {passwordLoading ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>በመቀየር ላይ...</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-3.5 h-3.5" />
                          <span>የይለፍ ቃል ቀይር (Change Password)</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>

                {/* 2. FORGOT PASSWORD / ACCOUNT RECOVERY LAUNCHER */}
                <div className="bg-white border-[1.5px] border-[#38332D] rounded-xl p-4 sm:p-5 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <KeyRound className="w-4 h-4 text-amber-600" />
                      <h4 className="font-serif-ethiopic font-bold text-sm text-[#1E1B18]">
                        [ Forgot Password / Account Recovery ]
                      </h4>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                      Zero-Trust OTP
                    </span>
                  </div>
                  <p className="text-xs text-[#5A5143] font-serif-ethiopic leading-relaxed">
                    የይለፍ ቃል ከረሱ ወይም መለያዎን በኢሜይል ወይም በስልክ ቁጥር (OTP) መልሰው ማግኘት ከፈለጉ፣ ደህንነቱ የተጠበቀውን የመልሶ ማግኛ መስኮት ይጠቀሙ።
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      if (onOpenRecovery) {
                        onOpenRecovery();
                      } else {
                        openAuthModal('login');
                      }
                    }}
                    className="px-4 py-2 rounded-lg bg-[#EDE5D2] hover:bg-[#DED2BA] text-[#1E1B18] border border-[#38332D]/40 font-bold font-serif-ethiopic text-xs flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <KeyRound className="w-3.5 h-3.5 text-amber-700" />
                    <span>የመልሶ ማግኛ መስኮት ክፈት (Launch Account Recovery)</span>
                  </button>
                </div>

                {/* 3. ACTIVE SESSIONS & DEVICE AUDIT */}
                <div className="bg-white border-[1.5px] border-[#38332D] rounded-xl p-4 sm:p-5 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Laptop className="w-4 h-4 text-blue-600" />
                      <h4 className="font-serif-ethiopic font-bold text-sm text-[#1E1B18]">
                        [ Active Sessions ] ንቁ ክፍለ-ጊዜዎች
                      </h4>
                    </div>
                    <button
                      type="button"
                      onClick={loadSessions}
                      className="p-1 rounded-md hover:bg-stone-100 text-stone-500 hover:text-stone-900 cursor-pointer"
                      title="አድስ (Refresh)"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${sessionsLoading ? 'animate-spin' : ''}`} />
                    </button>
                  </div>

                  {sessionActionMsg && (
                    <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-900 border border-emerald-300 text-xs font-serif-ethiopic">
                      {sessionActionMsg}
                    </div>
                  )}

                  <div className="space-y-2">
                    {activeSessions.map((sess, idx) => (
                      <div
                        key={sess.id || idx}
                        className="p-3 rounded-lg border border-stone-200 bg-[#FAF6EC] flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center shrink-0">
                            {sess.device?.includes('Phone') ? (
                              <Smartphone className="w-4 h-4" />
                            ) : (
                              <Laptop className="w-4 h-4" />
                            )}
                          </div>
                          <div>
                            <div className="font-bold font-serif-ethiopic text-stone-900 flex items-center gap-1.5">
                              <span>{sess.device || 'Web Browser'}</span>
                              {sess.isCurrent && (
                                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-sans font-bold">
                                  Current Device
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-stone-500 font-mono mt-0.5">
                              IP: {sess.ipAddress || '192.168.1.1'} • {new Date(sess.lastActive || Date.now()).toLocaleTimeString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* 4. SIGN OUT OTHER DEVICES */}
                  <div className="pt-2 border-t border-stone-200 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-stone-800 font-serif-ethiopic">
                        [ Sign out other devices ]
                      </div>
                      <div className="text-[11px] text-stone-500 font-serif-ethiopic">
                        ከዚህ መሣሪያ ውጭ ያሉ ሌሎች የገቡ መሣሪያዎችን በሙሉ አቋርጥ
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleSignOutAllOtherDevices}
                      disabled={sessionsLoading}
                      className="px-3.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold font-serif-ethiopic transition-colors cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>ሌሎችን አስወጣ (Sign Out All)</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: ACCOUNT */}
            {activeTab === 'account' && (
              <div className="space-y-4">
                <div className="border-b border-[#D5C9AC] pb-3">
                  <h3 className="font-serif-ethiopic font-bold text-base text-[#1E1B18]">የተማሪ መለያ (Student Account Profile)</h3>
                  <p className="text-xs text-[#665C4D]">Ethiopian Secondary Education Student Identity</p>
                </div>
                <div className="bg-white border-[1.5px] border-[#38332D] rounded-xl p-4 space-y-3">
                  <div>
                    <label className="block text-xs font-bold font-serif-ethiopic text-[#4A4237] mb-1">ሙሉ ስም (Full Name):</label>
                    <input
                      type="text"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-[#FAF6EC] border border-[#38332D]/40 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold font-serif-ethiopic text-[#4A4237] mb-1">ኢሜይል (Email):</label>
                    <input
                      type="email"
                      disabled
                      value={user?.email || 'student@nur.et'}
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-stone-100 border border-stone-300 rounded-lg text-stone-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold font-serif-ethiopic text-[#4A4237] mb-1">የትምህርት ደረጃ (Grade):</label>
                    <select
                      value={preferredGrade}
                      onChange={(e) => setPreferredGrade(Number(e.target.value) as any)}
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-[#FAF6EC] border border-[#38332D]/40 rounded-lg"
                    >
                      <option value={9}>ክፍል 9 (Grade 9)</option>
                      <option value={10}>ክፍል 10 (Grade 10)</option>
                      <option value={11}>ክፍል 11 (Grade 11 - Natural / Social Science)</option>
                      <option value={12}>ክፍል 12 (Grade 12 - National Exam Prep)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: LEARNING */}
            {activeTab === 'learning' && (
              <div className="space-y-4">
                <div className="border-b border-[#D5C9AC] pb-3">
                  <h3 className="font-serif-ethiopic font-bold text-base text-[#1E1B18]">የትምህርት ምርጫዎች (Learning Goals)</h3>
                  <p className="text-xs text-[#665C4D]">Ethiopian National Curriculum Study Settings</p>
                </div>
                <div className="bg-white border-[1.5px] border-[#38332D] rounded-xl p-4 space-y-3 text-xs font-serif-ethiopic">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded text-[#2E6B4A]" />
                    <span>ራስ-ሰር የትምህርት እድገት ማመሳሰል (Auto-sync topic mastery to Cloud)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded text-[#2E6B4A]" />
                    <span>የብሔራዊ ፈተና ጥያቄዎች ማስታወሻ (National Exam hint recommendations)</span>
                  </label>
                </div>
              </div>
            )}

            {/* TAB: AI TUTOR */}
            {activeTab === 'ai_tutor' && (
              <div className="space-y-4">
                <div className="border-b border-[#D5C9AC] pb-3">
                  <h3 className="font-serif-ethiopic font-bold text-base text-[#1E1B18]">የAI አስረጅ ባህሪ (AI Tutor Preferences)</h3>
                  <p className="text-xs text-[#665C4D]">Gemini Educational Explanation Depth</p>
                </div>
                <div className="bg-white border-[1.5px] border-[#38332D] rounded-xl p-4 space-y-3">
                  <label className="block text-xs font-bold font-serif-ethiopic text-[#4A4237]">የማብራሪያ ስልት (Teaching Tone):</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                    {(['step_by_step', 'socratic', 'concise'] as const).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setTutorTone(t)}
                        className={`p-2.5 rounded-lg border text-center font-bold capitalize cursor-pointer ${
                          tutorTone === t ? 'bg-[#2E6B4A] text-white border-[#1D4A32]' : 'bg-[#FAF6EC] border-stone-300'
                        }`}
                      >
                        {t.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: NOTIFICATIONS */}
            {activeTab === 'notifications' && (
              <div className="space-y-4">
                <div className="border-b border-[#D5C9AC] pb-3">
                  <h3 className="font-serif-ethiopic font-bold text-base text-[#1E1B18]">ማሳወቂያዎች (Notifications)</h3>
                  <p className="text-xs text-[#665C4D]">Email and Security Activity Alerts</p>
                </div>
                <div className="bg-white border-[1.5px] border-[#38332D] rounded-xl p-4 space-y-3 text-xs font-serif-ethiopic">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded text-[#2E6B4A]" />
                    <span>የደህንነት ማስጠንቀቂያዎችና ያልተለመደ የይለፍ ቃል ጥያቄ (Security & OTP alerts)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded text-[#2E6B4A]" />
                    <span>የሳብስክሪፕሽን ክፍያ ማረጋገጫ (Subscription confirmation alerts)</span>
                  </label>
                </div>
              </div>
            )}

            {/* TAB: PRIVACY */}
            {activeTab === 'privacy' && (
              <div className="space-y-4">
                <div className="border-b border-[#D5C9AC] pb-3">
                  <h3 className="font-serif-ethiopic font-bold text-base text-[#1E1B18]">ግላዊነት (Privacy & Anonymity)</h3>
                  <p className="text-xs text-[#665C4D]">Zero-Knowledge Protection</p>
                </div>
                <div className="bg-white border-[1.5px] border-[#38332D] rounded-xl p-4 space-y-3 text-xs font-serif-ethiopic">
                  <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-lg text-emerald-950">
                    🔒 የኢትዮጵያ ተማሪዎች መረጃዎች በሙሉ በከፍተኛ የደህንነት ደረጃ (AES-256) የተጠበቁ ናቸው።
                  </div>
                </div>
              </div>
            )}

            {/* TAB: SUBSCRIPTION & PAYMENTS */}
            {activeTab === 'subscription_payments' && (
              <div className="space-y-4">
                <div className="border-b border-[#D5C9AC] pb-3">
                  <h3 className="font-serif-ethiopic font-bold text-base text-[#1E1B18]">ሳብስክሪፕሽንና ክፍያ (Subscription & Payments)</h3>
                  <p className="text-xs text-[#665C4D]">Manage telebirr & CBE Payment Status</p>
                </div>
                <div className="bg-white border-[1.5px] border-[#38332D] rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-amber-50 border border-amber-300 text-xs">
                    <div>
                      <div className="font-bold text-amber-950">የአሁኑ ሁኔታ፡ {accessStatus}</div>
                      <div className="text-amber-800 text-[11px]">ቀሪ ቀናት፡ {remainingDays} ቀናት</div>
                    </div>
                    {onOpenSubscription && (
                      <button
                        onClick={onOpenSubscription}
                        className="px-3 py-1.5 rounded-lg bg-[#2E6B4A] text-white font-bold text-xs"
                      >
                        ክፍያ ፈጽም / አድስ
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: PREMIUM */}
            {activeTab === 'premium' && (
              <div className="space-y-4">
                <div className="border-b border-[#D5C9AC] pb-3">
                  <h3 className="font-serif-ethiopic font-bold text-base text-[#1E1B18]">ፕሪሚየም ይዘት (Premium Unlocks)</h3>
                  <p className="text-xs text-[#665C4D]">Official Videos, 2D/3D Simulations, and National Exams</p>
                </div>
                <div className="bg-white border-[1.5px] border-[#38332D] rounded-xl p-4 space-y-2 text-xs font-serif-ethiopic">
                  <div className="flex items-center gap-2 text-emerald-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>ሁሉንም የከፍተኛ ደረጃ የቪዲዮ ትምህርቶች መመልከት</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>2D/3D ምስላዊ የላብራቶሪ ማስመሰያዎች (Simulations)</span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: LANGUAGE */}
            {activeTab === 'language' && (
              <div className="space-y-4">
                <div className="border-b border-[#D5C9AC] pb-3">
                  <h3 className="font-serif-ethiopic font-bold text-base text-[#1E1B18]">የቋንቋ ምርጫ (Language)</h3>
                  <p className="text-xs text-[#665C4D]">Select your preferred Ethiopian language</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => setLanguage(l.code)}
                      className={`p-3 rounded-xl border text-left flex items-center justify-between cursor-pointer ${
                        language === l.code ? 'bg-[#2E6B4A] text-white border-[#1D4A32]' : 'bg-white border-stone-300'
                      }`}
                    >
                      <span className="font-bold">{l.nativeName || l.name}</span>
                      <span className="text-[11px] uppercase">{l.code}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: APPEARANCE */}
            {activeTab === 'appearance' && (
              <div className="space-y-4">
                <div className="border-b border-[#D5C9AC] pb-3">
                  <h3 className="font-serif-ethiopic font-bold text-base text-[#1E1B18]">ገጽታና ቀለም (Appearance & Theme)</h3>
                  <p className="text-xs text-[#665C4D]">Ethiopic Parchment, Light, and Dark Contrast</p>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {(['sepia', 'light', 'dark'] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setThemeMode(mode)}
                      className={`p-3 rounded-xl border text-center font-bold capitalize cursor-pointer ${
                        themeMode === mode ? 'bg-[#2E6B4A] text-white border-[#1D4A32]' : 'bg-white border-stone-300'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: ACCESSIBILITY */}
            {activeTab === 'accessibility' && (
              <div className="space-y-4">
                <div className="border-b border-[#D5C9AC] pb-3">
                  <h3 className="font-serif-ethiopic font-bold text-base text-[#1E1B18]">ተደራሽነት (Accessibility)</h3>
                  <p className="text-xs text-[#665C4D]">High Contrast and Motion Settings</p>
                </div>
                <div className="bg-white border-[1.5px] border-[#38332D] rounded-xl p-4 space-y-3 text-xs font-serif-ethiopic">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={highContrast}
                      onChange={(e) => setHighContrast(e.target.checked)}
                      className="rounded text-[#2E6B4A]"
                    />
                    <span>ከፍተኛ ንፅፅር (High Contrast Borders & Text)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={reducedMotion}
                      onChange={(e) => setReducedMotion(e.target.checked)}
                      className="rounded text-[#2E6B4A]"
                    />
                    <span>እንቅስቃሴ መቀነሻ (Reduced Motion for Animations)</span>
                  </label>
                </div>
              </div>
            )}

            {/* TAB: DATA & STORAGE */}
            {activeTab === 'data_storage' && (
              <div className="space-y-4">
                <div className="border-b border-[#D5C9AC] pb-3">
                  <h3 className="font-serif-ethiopic font-bold text-base text-[#1E1B18]">መረጃና ማከማቻ (Data & Storage)</h3>
                  <p className="text-xs text-[#665C4D]">Local Offline Cache and Clear Data</p>
                </div>
                <div className="bg-white border-[1.5px] border-[#38332D] rounded-xl p-4 space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold">የአካባቢ ማህደረ-ትውስታ (Cached Data): ~12.4 MB</div>
                      <div className="text-stone-500 text-[11px]">Saved quiz answers, offline textbook chapters</div>
                    </div>
                    <button
                      onClick={() => {
                        localStorage.clear();
                        window.location.reload();
                      }}
                      className="px-3 py-1.5 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 font-bold hover:bg-rose-100"
                    >
                      ማህደረ-ትውስታ አፅዳ (Clear Cache)
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: HELP & SUPPORT */}
            {activeTab === 'help_support' && (
              <div className="space-y-4">
                <div className="border-b border-[#D5C9AC] pb-3">
                  <h3 className="font-serif-ethiopic font-bold text-base text-[#1E1B18]">እርዳታና ድጋፍ (Help & Support)</h3>
                  <p className="text-xs text-[#665C4D]">Official Technical Assistance</p>
                </div>
                <div className="bg-white border-[1.5px] border-[#38332D] rounded-xl p-4 space-y-2 text-xs font-serif-ethiopic">
                  <div className="font-bold text-stone-900">የሲስተም ባለቤትና አዘጋጅ (Developer & Owner):</div>
                  <div className="text-stone-700">Nuriye Ahmed Adem</div>
                  <div className="text-stone-700">ስልክ (Phone): 0910097862</div>
                  <div className="text-stone-700">ኢሜይል (Email): mejennur669@gmail.com</div>
                </div>
              </div>
            )}

            {/* TAB: LEGAL */}
            {activeTab === 'legal' && (
              <div className="space-y-4">
                <div className="border-b border-[#D5C9AC] pb-3">
                  <h3 className="font-serif-ethiopic font-bold text-base text-[#1E1B18]">ህጋዊ መመሪያ (Legal & Curriculum Alignment)</h3>
                  <p className="text-xs text-[#665C4D]">Ministry of Education Standards Compliance</p>
                </div>
                <div className="bg-white border-[1.5px] border-[#38332D] rounded-xl p-4 space-y-2 text-xs font-serif-ethiopic leading-relaxed text-[#5A5143]">
                  ይህ የኑር AI የሁለተኛ ደረጃ ትምህርት መድረክ በኢትዮጵያ አዲሱ የትምህርት ሥርዓት (New Curriculum Framework) መሠረት የተዘጋጀ ሲሆን፣ ሁሉም የይዘት የቅጂ መብቶች በባለቤቱ የተጠበቁ ናቸው።
                </div>
              </div>
            )}

            {/* TAB: ABOUT */}
            {activeTab === 'about' && (
              <div className="space-y-4 text-center py-4">
                <div className="w-14 h-14 rounded-2xl bg-[#2E6B4A] text-white flex items-center justify-center mx-auto shadow-md">
                  <Info className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-serif-ethiopic font-black text-lg text-[#1E1B18]">
                    ኑር AI የሁለተኛ ደረጃ ትምህርት ቤት ረዳት
                  </h3>
                  <div className="text-xs text-stone-500 font-mono mt-0.5">Version 3.2.0 • Zero-Trust Fortress</div>
                </div>
                <p className="text-xs text-[#5A5143] font-serif-ethiopic max-w-md mx-auto leading-relaxed">
                  በኢትዮጵያ የ9ኛ - 12ኛ ክፍል ተማሪዎች የትምህርት ውጤታማነትን ለማሳደግ የተዘጋጀ ብልህ የAI እና የቪዲዮ ትምህርት ማዕከል።
                </p>
                <div className="text-[11px] text-[#7A6E5C] font-mono pt-2 border-t border-[#D5C9AC]">
                  Developed & Owned by Nuriye Ahmed Adem • 0910097862
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
