import React from 'react';
import { Grade, Subject, ActiveTab } from '../types';
import {
  BookOpen,
  GraduationCap,
  Globe,
  CheckCircle2,
  Award,
  ListChecks,
  FileText,
  Sparkles,
  LogIn,
  LogOut,
  User,
  Users,
  CloudCheck,
  ShieldCheck,
  Cloud,
  CreditCard,
  MessageSquare,
  Clock,
  AlertTriangle,
  LayoutGrid,
  Settings,
  Eye,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useProgress } from '../context/ProgressContext';
import { useAuth } from '../context/AuthContext';
import { useSubscription } from '../context/SubscriptionContext';
import { NotificationBell } from './notifications/NotificationBell';

interface HeaderProps {
  selectedGrade: Grade;
  onSelectGrade: (grade: Grade) => void;
  subjects: Subject[];
  onOpenChecklist: () => void;
  onOpenCertificate: () => void;
  onOpenAllTextbooks?: () => void;
  onOpenNewCurriculum?: () => void;
  onOpenSubscription?: () => void;
  onOpenFeedback?: () => void;
  onOpenModulesDropdown?: () => void;
  onOpenDirectPayment?: () => void;
  onOpenSettings?: () => void;
  onOpenGateway?: () => void;
  activeTab?: ActiveTab;
  onToggleAdminDashboard?: () => void;
}

const grades: Grade[] = [9, 10, 11, 12];

export const Header: React.FC<HeaderProps> = ({
  selectedGrade,
  onSelectGrade,
  subjects,
  onOpenChecklist,
  onOpenCertificate,
  onOpenAllTextbooks,
  onOpenNewCurriculum,
  onOpenSubscription,
  onOpenFeedback,
  onOpenModulesDropdown,
  onOpenDirectPayment,
  onOpenSettings,
  onOpenGateway,
  activeTab,
  onToggleAdminDashboard,
}) => {
  const { language, setLanguage, t, languages } = useLanguage();
  const { getOverallProgress, isSyncing, isCloudSynced } = useProgress();
  const { user, userProfile, logout, openAuthModal } = useAuth();
  const { accessStatus, remainingDays, isOwnerSuperAdmin } = useSubscription();

  const overall = getOverallProgress(subjects);

  return (
    <header
      id="app-header"
      className="border-b-[1.5px] border-[#38332D] bg-[#F7F2E4] px-3 py-2.5 sm:px-6 sm:py-3.5 transition-colors space-y-3"
    >
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4">
        {/* Title and Subtitle */}
        <div className="flex items-center gap-3">
          <div
            id="app-logo-badge"
            className="w-11 h-11 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0 border border-red-700 shadow-md"
          >
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10.5px] font-black uppercase tracking-wider text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded font-serif-ethiopic">
                {t.ethiopiaAiSchool || (language === 'en' ? 'Ethiopia AI Academy' : 'ኢትዮጵያ AI ትምህርት ቤት')}
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider bg-[#E8DFC8] text-[#4A4237] px-1.5 py-0.5 border border-[#D5C9AC]">
                {t.countryBadge}
              </span>

              {/* New Curriculum Guide Trigger */}
              {onOpenNewCurriculum && (
                <button
                  id="header-new-curriculum-btn"
                  onClick={onOpenNewCurriculum}
                  className="inline-flex items-center gap-1 text-[11px] font-bold bg-amber-200 hover:bg-amber-300 text-stone-900 px-2 py-0.5 border border-amber-400 cursor-pointer transition-colors shadow-2xs"
                  title="Explore Ethiopian New Curriculum Framework"
                >
                  <Sparkles className="w-3 h-3 text-amber-700" />
                  <span>{t.newCurriculumTag}</span>
                </button>
              )}
            </div>
            <h1
              id="main-app-title"
              className="font-serif-ethiopic text-base sm:text-xl font-black tracking-tight text-[#1E1B18] mt-0.5"
            >
              {t.appTitle}
            </h1>
            <p className="text-xs text-[#665C4D] font-serif-ethiopic hidden sm:block">
              {t.appSubtitle} (Grades 9–12)
            </p>
          </div>
        </div>

        {/* Right Section: User ID Card matching screenshot */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 self-start lg:self-auto">
          {/* User Account / Auth Section */}
          <div className="flex items-center gap-2">
            {!user ? (
              <button
                id="header-signin-btn"
                onClick={() => openAuthModal('login')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#2E6B4A] hover:bg-[#235338] text-white text-xs font-bold border border-[#1D4A32] rounded-lg cursor-pointer transition-colors shadow-xs"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span className="font-serif-ethiopic">{t.signInBtn || (language === 'en' ? 'Sign In / Register' : 'ግባ / ተመዝገብ')}</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                {/* User ID card matching screenshot */}
                <div className="flex items-center gap-2 bg-white border border-[#D5C9AC] px-3 py-1.5 rounded-xl shadow-xs">
                  <div className="w-8 h-8 rounded-lg bg-red-100 border border-red-200 text-red-600 flex items-center justify-center shrink-0 font-bold relative">
                    <User className="w-4 h-4" />
                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-red-600" />
                  </div>
                  <div className="truncate max-w-[130px] sm:max-w-[190px]">
                    <span className="text-[9.5px] text-stone-500 block leading-tight font-serif-ethiopic">
                      {t.userAccountId || (language === 'en' ? 'User Account' : 'የተጠቃሚ መለያ')}
                    </span>
                    <span className="text-xs font-bold text-stone-900 truncate block">
                      {userProfile?.displayName || user.email?.split('@')[0] || 'mejennur669'}
                      {isOwnerSuperAdmin && (
                        <span className="text-amber-800 ml-1 font-black">(Super Admin)</span>
                      )}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-700 text-[10px] font-bold shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="font-serif-ethiopic">{language === 'en' ? 'Online' : 'መስመር ላይ'}</span>
                  </div>
                </div>

                {/* Subscription Status Pill */}
                {onOpenSubscription && (
                  <button
                    onClick={onOpenSubscription}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                      accessStatus === 'ACTIVE'
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300 hover:bg-emerald-200'
                        : accessStatus === 'PENDING'
                        ? 'bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-200 animate-pulse'
                        : accessStatus === 'SUPER_ADMIN'
                        ? 'bg-amber-100 text-amber-900 border-amber-400 font-black'
                        : accessStatus === 'EXPIRED'
                        ? 'bg-rose-100 text-rose-800 border-rose-300 hover:bg-rose-200'
                        : 'bg-stone-200 text-stone-800 border-stone-300 hover:bg-stone-300'
                    }`}
                    title={language === 'en' ? 'Subscription & Payment Details' : 'የሳብስክሪፕሽንና ክፍያ ዝርዝር'}
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span className="font-serif-ethiopic hidden sm:inline">
                      {accessStatus === 'ACTIVE'
                        ? (language === 'en' ? `Sub Active (${remainingDays}d)` : `ክፍያ የጸደቀ (${remainingDays}ቀን)`)
                        : accessStatus === 'PENDING'
                        ? (language === 'en' ? 'Pending Approval' : 'በማረጋገጥ ላይ')
                        : accessStatus === 'SUPER_ADMIN'
                        ? (language === 'en' ? 'Super Admin' : 'ባለቤት (Super Admin)')
                        : accessStatus === 'EXPIRED'
                        ? (language === 'en' ? 'Expired' : 'ጊዜው ያለፈ')
                        : (language === 'en' ? 'Subscription / Pay' : 'ክፍያ / Sub')}
                    </span>
                  </button>
                )}

                {/* Feedback Button */}
                {onOpenFeedback && (
                  <button
                    onClick={onOpenFeedback}
                    className="p-1.5 text-[#665C4D] hover:text-[#1E1B18] hover:bg-[#E5DCB9] rounded-lg transition-colors cursor-pointer"
                    title={language === 'en' ? 'System Feedback' : 'ስለ ሲስተሙ አስተያዬት ስጥ (System Feedback)'}
                  >
                    <MessageSquare className="w-4 h-4 text-cyan-800" />
                  </button>
                )}

                {/* Settings Button */}
                {onOpenSettings && (
                  <button
                    id="header-settings-btn"
                    onClick={onOpenSettings}
                    className="p-1.5 text-[#665C4D] hover:text-[#1E1B18] hover:bg-[#E5DCB9] rounded-lg transition-colors cursor-pointer"
                    title={language === 'en' ? 'Settings & Security' : 'ቅንብሮች (Settings & Security)'}
                  >
                    <Settings className="w-4 h-4 text-emerald-800" />
                  </button>
                )}

                {/* Logout button */}
                <button
                  id="header-logout-btn"
                  onClick={() => {
                    sessionStorage.removeItem('nur_onboarding_completed');
                    logout();
                  }}
                  className="p-1.5 text-[#665C4D] hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                  title={language === 'en' ? 'Sign Out' : 'ውጣ (Sign Out)'}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Notification Bell with Badge & Drawer */}
            <div className="pl-1 sm:pl-2 border-l border-[#38332D]/30">
              <NotificationBell />
            </div>
          </div>
        </div>
      </div>

      {/* Action Navigation Row */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-[#38332D]/20">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Button 0: Welcome Screen / Gateway */}
          {onOpenGateway && (
            <button
              id="header-open-gateway-btn"
              onClick={onOpenGateway}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-stone-950 text-xs font-black rounded-lg transition-all cursor-pointer shadow-xs border border-amber-600 active:scale-98 font-serif-ethiopic"
              title={language === 'en' ? 'Open Welcome & Setup Screen' : 'የመነሻ ስክሪን ክፈት (Welcome Screen)'}
            >
              <Sparkles className="w-3.5 h-3.5 text-stone-950" />
              <span>{language === 'en' ? '👋 Welcome Screen' : '👋 መነሻ ስክሪን'}</span>
            </button>
          )}

          {/* Button: Public Website Gateway */}
          <button
            id="header-public-web-btn"
            onClick={() => {
              sessionStorage.removeItem('nur_onboarding_completed');
              window.location.hash = '#home';
              window.location.reload();
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF6EC] hover:bg-[#EAE0C7] text-[#1E1B18] text-xs font-bold rounded-lg transition-all cursor-pointer shadow-xs border border-[#38332D]/40 active:scale-98 font-serif-ethiopic"
            title={language === 'en' ? 'Go to Public Marketing Website' : 'ወደ ይፋዊ መነሻ ድረ-ገጽ ተመለስ'}
          >
            <span>🌐 {language === 'en' ? 'Public Website' : 'ይፋዊ ድረ-ገጽ'}</span>
          </button>

          {/* Super Admin Inspection & Switcher Button */}
          {isOwnerSuperAdmin && onToggleAdminDashboard && (
            <button
              id="header-superadmin-inspect-btn"
              onClick={onToggleAdminDashboard}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-black rounded-lg transition-all cursor-pointer shadow-md border font-serif-ethiopic active:scale-98 ${
                activeTab === 'admin_dashboard'
                  ? 'bg-amber-600 hover:bg-amber-700 text-white border-amber-800'
                  : 'bg-emerald-800 hover:bg-emerald-900 text-amber-200 border-emerald-950'
              }`}
              title={
                activeTab === 'admin_dashboard'
                  ? 'የተማሪዎችን መማሪያ፣ መጻሕፍትና ጥያቄዎች ለመፈተሽ'
                  : 'ወደ ሱፐር አድሚን ዳሽቦርድ ለመመለስ'
              }
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
              <span>
                {activeTab === 'admin_dashboard'
                  ? (language === 'en' ? '👁️ Inspect Student Modules' : '👁️ የተማሪ ክፍሎችን ፈትሽ')
                  : (language === 'en' ? '⚡ Super Admin Dashboard' : '⚡ ሱፐር አድሚን ዳሽቦርድ')}
              </span>
            </button>
          )}

          {/* Button 1: Sides / Modules */}
          {onOpenModulesDropdown && (
            <button
              id="header-modules-btn"
              onClick={onOpenModulesDropdown}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0B132B] hover:bg-[#15234A] text-white text-xs font-bold rounded-lg transition-all cursor-pointer shadow-xs border border-slate-700 active:scale-98 font-serif-ethiopic"
              title={t.modulesMenuBtn || 'የሲስተም ሳይዶችና ክፍሎች'}
            >
              <LayoutGrid className="w-3.5 h-3.5 text-amber-400" />
              <span>{t.modulesMenuBtn ? `📑 ${t.modulesMenuBtn}` : '📑 ሳይዶች / ክፍሎች'}</span>
            </button>
          )}

          {/* Button 2: Vibrant Red ALL MODULES DROPDOWN */}
          {onOpenModulesDropdown && (
            <button
              onClick={onOpenModulesDropdown}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-black rounded-lg transition-all cursor-pointer shadow-md shadow-red-900/20 border border-red-700 active:scale-98 font-serif-ethiopic"
              title={language === 'en' ? 'Explore all system modules' : 'የሲስተም ክፍሎች በሙሉ (30 Modules Dropdown)'}
            >
              <LayoutGrid className="w-3.5 h-3.5 text-white" />
              <span>{language === 'en' ? '📋 Open All Modules' : '📋 ሁሉንም ክፍሎች ክፈት (All Modules)'}</span>
            </button>
          )}

          {/* Button 3: Direct In-System Payment */}
          {onOpenDirectPayment && (
            <button
              onClick={onOpenDirectPayment}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg transition-all cursor-pointer shadow-xs border border-emerald-900 font-serif-ethiopic"
              title={language === 'en' ? 'Direct payment via Telebirr 0910097862 or CBE 1000382883776' : 'ቀጥታ ክፍያ በቴሌብር 0910097862 ወይም CBE 1000382883776'}
            >
              <CreditCard className="w-3.5 h-3.5 text-emerald-200" />
              <span>{language === 'en' ? '💳 Direct Payment (Telebirr / CBE)' : '💳 ቀጥታ ክፍያ (0910097862 / 1000382883776)'}</span>
            </button>
          )}
        </div>

        {/* Grade Selector & Language Selector */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* Grade Selector */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-[#5A5143] whitespace-nowrap flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-[#665C4D]" />
              <span className="hidden sm:inline">{t.selectGradeLabel}</span>
            </span>
            <div
              id="grade-selector-group"
              className="inline-flex border-[1.5px] border-[#38332D] bg-[#EFE8D6] p-0.5 rounded"
            >
              {grades.map((grade) => {
                const isSelected = selectedGrade === grade;
                return (
                  <button
                    key={grade}
                    id={`grade-btn-${grade}`}
                    onClick={() => onSelectGrade(grade)}
                    className={`px-2 sm:px-2.5 py-0.5 sm:py-1 text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#38332D] text-[#FAF6EC] shadow-xs'
                        : 'text-[#4A4237] hover:bg-[#E5DCB9]'
                    }`}
                    aria-pressed={isSelected}
                  >
                    {t.gradePrefix} {grade}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Language Selector: Full 6 Ethiopian & Regional Languages Switcher */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-[#38332D] whitespace-nowrap flex items-center gap-1 font-serif-ethiopic">
              <Globe className="w-3.5 h-3.5 text-emerald-800" />
              <span className="hidden md:inline">{language === 'en' ? 'Language:' : language === 'ar' ? 'اللغة:' : language === 'ti' ? 'ቋንቋ:' : language === 'om' ? 'Afaan:' : language === 'so' ? 'Luqadda:' : 'ቋንቋ:'}</span>
            </span>

            {/* Responsive Desktop 6-Language Pill Switcher */}
            <div
              id="language-selector-group"
              className="hidden sm:inline-flex border-2 border-[#1E1B18] bg-white p-0.5 rounded-lg shadow-2xs divide-x divide-stone-200"
            >
              {languages.map((l) => {
                const isSelected = language === l.code;
                return (
                  <button
                    key={l.code}
                    id={`lang-btn-${l.code}`}
                    onClick={() => setLanguage(l.code)}
                    className={`px-2 py-1 text-xs font-bold transition-all cursor-pointer flex items-center gap-1 whitespace-nowrap ${
                      isSelected
                        ? 'bg-[#1E1B18] text-amber-300 shadow-xs font-black'
                        : 'text-[#38332D] hover:bg-stone-100 font-semibold'
                    }`}
                    title={`${l.name} (${l.nativeName})`}
                    aria-pressed={isSelected}
                  >
                    <span>{l.flagOrLabel}</span>
                    <span>{l.nativeName}</span>
                  </button>
                );
              })}
            </div>

            {/* Mobile Dropdown for small screens */}
            <div className="sm:hidden flex items-center">
              <select
                id="language-mobile-select"
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
                aria-label="Select Language"
                className="bg-white border-2 border-[#1E1B18] rounded-md text-xs font-bold py-1 px-2 text-[#1E1B18] shadow-2xs cursor-pointer focus:outline-none focus:ring-1 focus:ring-emerald-700"
              >
                {languages.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.flagOrLabel} {l.nativeName}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Progress & Course Completion Banner in Header */}
      <div
        id="course-progress-header-bar"
        className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 p-2 sm:p-2.5 bg-[#EDE5D2] border border-[#38332D]/30"
      >
        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
          <span className="text-xs font-bold uppercase tracking-wider text-[#4A4237] flex items-center gap-1.5 shrink-0 font-serif-ethiopic">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
            <span>{t.overallProgressLabel}:</span>
          </span>

          {/* Progress Bar Container */}
          <div className="flex-1 max-w-xs h-2.5 bg-[#DDD3BD] border border-[#38332D]/50 overflow-hidden relative">
            <div
              className="h-full bg-emerald-700 transition-all duration-500"
              style={{ width: `${overall.percentage}%` }}
            />
          </div>

          <span className="text-xs font-mono font-bold text-[#1E1B18] whitespace-nowrap">
            {overall.completedTopics}/{overall.totalTopics} ({overall.percentage}%)
          </span>

          {/* Cloud Sync Status Indicator */}
          {user && (
            <div className="hidden md:flex items-center pl-2 text-[11px] font-serif-ethiopic">
              {isSyncing ? (
                <span className="text-blue-700 flex items-center gap-1">
                  <Cloud className="w-3 h-3 animate-pulse" />
                  <span>በማመሳሰል ላይ...</span>
                </span>
              ) : isCloudSynced ? (
                <span className="text-emerald-800 flex items-center gap-1" title="በደመና ተቀምጧል">
                  <CloudCheck className="w-3 h-3 text-emerald-700" />
                  <span>ደመና ተመሳስሏል</span>
                </span>
              ) : null}
            </div>
          )}
        </div>

        {/* Interactive Buttons for Textbooks, Checklist & Certificate */}
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          {onOpenNewCurriculum && (
            <button
              id="header-curriculum-guide-btn"
              onClick={onOpenNewCurriculum}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#1E40AF] hover:bg-[#1D4ED8] text-white text-xs font-bold border border-[#172554] cursor-pointer transition-colors shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span className="font-serif-ethiopic">{t.newCurriculumTitle}</span>
            </button>
          )}

          {onOpenAllTextbooks && (
            <button
              id="header-all-textbooks-btn"
              onClick={onOpenAllTextbooks}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#2E6B4A] hover:bg-[#235338] text-white text-xs font-bold border border-[#1D4A32] cursor-pointer transition-colors shadow-xs"
              title="Browse all Ethiopian curriculum textbooks in PDF"
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="font-serif-ethiopic">{t.allSubjectsPdfLibraryTitle}</span>
            </button>
          )}

          <button
            id="header-checklist-btn"
            onClick={onOpenChecklist}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#FAF6EC] hover:bg-[#E4DCB9] text-[#1E1B18] text-xs font-bold border border-[#38332D] cursor-pointer transition-colors shadow-xs"
          >
            <ListChecks className="w-3.5 h-3.5 text-[#38332D]" />
            <span className="font-serif-ethiopic">{t.viewChecklistBtn}</span>
          </button>

          <button
            id="header-certificate-btn"
            onClick={onOpenCertificate}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#38332D] hover:bg-[#24211E] text-[#FAF6EC] text-xs font-bold border border-[#38332D] cursor-pointer transition-colors shadow-xs"
          >
            <Award className="w-3.5 h-3.5 text-amber-300" />
            <span className="font-serif-ethiopic">{t.certificateBtn}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
