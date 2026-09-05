import React from 'react';
import { Grade, Subject } from '../types';
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
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useProgress } from '../context/ProgressContext';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  selectedGrade: Grade;
  onSelectGrade: (grade: Grade) => void;
  subjects: Subject[];
  onOpenChecklist: () => void;
  onOpenCertificate: () => void;
  onOpenAllTextbooks?: () => void;
  onOpenNewCurriculum?: () => void;
  onOpenTeacherDashboard?: () => void;
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
  onOpenTeacherDashboard,
}) => {
  const { language, setLanguage, t, languages } = useLanguage();
  const { getOverallProgress, isSyncing, isCloudSynced } = useProgress();
  const { user, userProfile, logout, openAuthModal } = useAuth();

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
            className="w-10 h-10 rounded-xs bg-[#38332D] text-[#FAF6EC] flex items-center justify-center shrink-0 border border-[#38332D] shadow-xs"
          >
            <GraduationCap className="w-6 h-6 text-[#EBD9B4]" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1
                id="main-app-title"
                className="font-serif-ethiopic text-lg sm:text-2xl font-bold tracking-tight text-[#1E1B18]"
              >
                {t.appTitle}
              </h1>
              <span className="text-[11px] font-semibold uppercase tracking-wider bg-[#E8DFC8] text-[#4A4237] px-2 py-0.5 border border-[#D5C9AC]">
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
            <p className="text-xs sm:text-sm text-[#665C4D] mt-0.5 font-serif-ethiopic">
              {t.appSubtitle}
            </p>
          </div>
        </div>

        {/* Right Section: Language Selector & Grade Selector */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 self-start lg:self-auto">
          {/* Language Selector */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-[#5A5143] whitespace-nowrap flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-[#665C4D]" />
              <span className="hidden sm:inline">{t.languageSelectorLabel}:</span>
            </span>
            <div
              id="language-selector-group"
              className="inline-flex border-[1.5px] border-[#38332D] bg-[#EFE8D6] p-0.5 flex-wrap"
            >
              {languages.map((langMeta) => {
                const isSelected = language === langMeta.code;
                return (
                  <button
                    key={langMeta.code}
                    id={`lang-btn-${langMeta.code}`}
                    onClick={() => setLanguage(langMeta.code)}
                    className={`px-2 py-0.5 sm:py-1 text-xs font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#38332D] text-[#FAF6EC] shadow-xs'
                        : 'text-[#4A4237] hover:bg-[#E5DCB9]'
                    }`}
                    title={langMeta.name}
                    aria-pressed={isSelected}
                  >
                    {langMeta.nativeName}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Grade Selector */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-[#5A5143] whitespace-nowrap flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-[#665C4D]" />
              <span className="hidden sm:inline">{t.selectGradeLabel}</span>
            </span>
            <div
              id="grade-selector-group"
              className="inline-flex border-[1.5px] border-[#38332D] bg-[#EFE8D6] p-0.5"
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

          {/* User Account / Auth Section */}
          <div className="flex items-center gap-1.5 pl-1 sm:pl-2 sm:border-l border-[#38332D]/30">
            {!user ? (
              <button
                id="header-signin-btn"
                onClick={() => openAuthModal('login')}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#2E6B4A] hover:bg-[#235338] text-white text-xs font-bold border border-[#1D4A32] rounded cursor-pointer transition-colors shadow-xs"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span className="font-serif-ethiopic">ግባ / ተመዝገብ (Sign In)</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                {/* Role and User Badge */}
                <div className="flex items-center gap-1.5 bg-[#EAE2CE] border border-[#38332D]/40 px-2 py-0.5 rounded">
                  <span className="text-xs font-bold font-serif-ethiopic text-[#1E1B18] flex items-center gap-1">
                    {userProfile?.role === 'teacher' ? (
                      <span className="text-[#1D4ED8] font-bold">👨‍🏫 መምህር</span>
                    ) : (
                      <span className="text-emerald-700 font-bold">🎓 ተማሪ</span>
                    )}
                    <span className="font-semibold text-[11px] truncate max-w-[90px] sm:max-w-[120px]">
                      {userProfile?.displayName || user.email?.split('@')[0]}
                    </span>
                  </span>
                </div>

                {/* If Teacher, prominent button in top bar */}
                {userProfile?.role === 'teacher' && onOpenTeacherDashboard && (
                  <button
                    id="header-teacher-dashboard-btn"
                    onClick={onOpenTeacherDashboard}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#1D4ED8] hover:bg-[#1E40AF] text-white text-xs font-bold border border-[#1E3A8A] rounded cursor-pointer transition-all shadow-xs"
                    title="የተማሪዎችን የትምህርት እድገት መከታተያ ዳሽቦርድ"
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span className="font-serif-ethiopic hidden sm:inline">የተማሪዎች ዳሽቦርድ</span>
                    <span className="font-serif-ethiopic sm:hidden">ዳሽቦርድ</span>
                  </button>
                )}

                {/* Logout button */}
                <button
                  id="header-logout-btn"
                  onClick={logout}
                  className="p-1 text-[#665C4D] hover:text-red-700 hover:bg-red-50 rounded transition-colors cursor-pointer"
                  title="ውጣ (Sign Out)"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
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
          {/* Prominent Teacher Dashboard Button in second row too if Teacher */}
          {userProfile?.role === 'teacher' && onOpenTeacherDashboard && (
            <button
              id="header-teacher-dashboard-prominent-btn"
              onClick={onOpenTeacherDashboard}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#1D4ED8] hover:bg-[#1E40AF] text-white text-xs font-bold border border-[#172554] rounded cursor-pointer transition-colors shadow-xs"
            >
              <Users className="w-3.5 h-3.5" />
              <span className="font-serif-ethiopic">👥 የተማሪዎች ዳሽቦርድ (Students)</span>
            </button>
          )}

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
