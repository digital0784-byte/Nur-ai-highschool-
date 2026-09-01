import React from 'react';
import { Grade } from '../types';
import { BookOpen, GraduationCap, Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface HeaderProps {
  selectedGrade: Grade;
  onSelectGrade: (grade: Grade) => void;
}

const grades: Grade[] = [9, 10, 11, 12];

export const Header: React.FC<HeaderProps> = ({
  selectedGrade,
  onSelectGrade,
}) => {
  const { language, setLanguage, t, languages } = useLanguage();

  return (
    <header
      id="app-header"
      className="border-b-[1.5px] border-[#38332D] bg-[#F7F2E4] px-4 py-3 sm:px-6 sm:py-4 transition-colors"
    >
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
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
                className="font-serif-ethiopic text-xl sm:text-2xl font-bold tracking-tight text-[#1E1B18]"
              >
                {t.appTitle}
              </h1>
              <span className="text-[11px] font-semibold uppercase tracking-wider bg-[#E8DFC8] text-[#4A4237] px-2 py-0.5 border border-[#D5C9AC]">
                {t.countryBadge}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#665C4D] mt-0.5">
              {t.appSubtitle}
            </p>
          </div>
        </div>

        {/* Right Section: Language Selector & Grade Selector */}
        <div className="flex flex-wrap items-center gap-3 self-start lg:self-auto">
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
                    className={`px-2 py-1 text-xs font-semibold transition-all cursor-pointer ${
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
                    className={`px-2.5 py-1 text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
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
        </div>
      </div>
    </header>
  );
};
