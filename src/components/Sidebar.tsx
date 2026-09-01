import React from 'react';
import { Subject } from '../types';
import { useLanguage } from '../context/LanguageContext';
import {
  Calculator,
  Atom,
  FlaskConical,
  Dna,
  Languages,
  BookText,
  Landmark,
  Monitor
} from 'lucide-react';

interface SidebarProps {
  subjects: Subject[];
  selectedSubjectId: string;
  onSelectSubject: (subjectId: string) => void;
}

// Icon mapper for quick visual recognition alongside colored dots
const getSubjectIcon = (id: string, className = "w-4 h-4") => {
  switch (id) {
    case 'math':
      return <Calculator className={className} />;
    case 'physics':
      return <Atom className={className} />;
    case 'chemistry':
      return <FlaskConical className={className} />;
    case 'biology':
      return <Dna className={className} />;
    case 'english':
      return <Languages className={className} />;
    case 'amharic':
      return <BookText className={className} />;
    case 'social-studies':
      return <Landmark className={className} />;
    case 'ict':
      return <Monitor className={className} />;
    default:
      return null;
  }
};

export const Sidebar: React.FC<SidebarProps> = ({
  subjects,
  selectedSubjectId,
  onSelectSubject,
}) => {
  const { t, isRtl } = useLanguage();

  return (
    <aside
      id="subjects-sidebar"
      className="w-full md:w-64 lg:w-72 shrink-0 border-b-[1.5px] md:border-b-0 md:border-r-[1.5px] border-[#38332D] bg-[#F4EEDB] flex flex-col"
    >
      <div className="p-3.5 border-b-[1.5px] border-[#38332D] hidden md:flex items-center justify-between bg-[#ECE4D0]">
        <span className="text-xs font-bold uppercase tracking-wider text-[#4A4237]">
          {t.subjectsTitle}
        </span>
        <span className="text-[11px] text-[#786D5B] font-serif-ethiopic">
          {t.subjectsSubtitle}
        </span>
      </div>

      {/* Horizontal scroll on mobile, vertical list on desktop */}
      <nav
        id="subjects-nav-list"
        aria-label={t.subjectsTitle}
        className="flex md:flex-col overflow-x-auto md:overflow-x-visible no-scrollbar divide-x-[1.5px] md:divide-x-0 md:divide-y-[1.5px] divide-[#38332D] p-1.5 md:p-0"
      >
        {subjects.map((subject) => {
          const isSelected = subject.id === selectedSubjectId;

          return (
            <button
              key={subject.id}
              id={`subject-btn-${subject.id}`}
              onClick={() => onSelectSubject(subject.id)}
              className={`flex items-center gap-2.5 px-3 py-2.5 sm:px-4 sm:py-3 text-left transition-all whitespace-nowrap md:whitespace-normal cursor-pointer w-auto md:w-full relative ${
                isSelected
                  ? 'bg-[#FAF6EC] text-[#1E1B18] font-bold shadow-xs'
                  : 'bg-transparent text-[#4A4237] hover:bg-[#ECE4D0] font-medium'
              }`}
              style={{
                borderLeft: !isRtl && isSelected ? `4px solid ${subject.accentColor}` : undefined,
                borderRight: isRtl && isSelected ? `4px solid ${subject.accentColor}` : undefined,
              }}
            >
              {/* Colored Dot Indicator */}
              <span
                className="w-3 h-3 rounded-full shrink-0 border border-black/20"
                style={{ backgroundColor: subject.accentColor }}
                aria-hidden="true"
              />

              {/* Subject Icon */}
              <span
                className="shrink-0 transition-colors"
                style={{ color: isSelected ? subject.accentColor : '#665C4D' }}
              >
                {getSubjectIcon(subject.id)}
              </span>

              {/* Name & SubName tag */}
              <div className="flex flex-col min-w-0 pr-1">
                <span className="text-sm leading-tight font-serif-ethiopic truncate">
                  {subject.name}
                </span>
                <span className="text-[10px] text-[#7A705E] tracking-wider truncate">
                  {subject.subName}
                </span>
              </div>

              {/* Active Indicator Arrow on Desktop */}
              {isSelected && (
                <span
                  className="hidden md:inline-block ml-auto mr-0 rtl:mr-auto rtl:ml-0 text-xs font-mono font-bold"
                  style={{ color: subject.accentColor }}
                >
                  {isRtl ? '‹' : '›'}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </aside>
  );
};
