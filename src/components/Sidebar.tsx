import React, { useState } from 'react';
import { Subject, SubjectStream } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useProgress } from '../context/ProgressContext';
import {
  Calculator,
  Atom,
  FlaskConical,
  Dna,
  Languages,
  BookText,
  Landmark,
  Monitor,
  CheckCircle2,
  Sprout,
  Scale,
  Globe2,
  TrendingUp,
  Filter
} from 'lucide-react';

interface SidebarProps {
  subjects: Subject[];
  selectedSubjectId: string;
  onSelectSubject: (subjectId: string) => void;
  selectedStream?: SubjectStream | 'all';
  onSelectStream?: (stream: SubjectStream | 'all') => void;
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
    case 'agriculture':
      return <Sprout className={className} />;
    case 'english':
      return <Languages className={className} />;
    case 'amharic':
      return <BookText className={className} />;
    case 'citizenship':
      return <Scale className={className} />;
    case 'geography':
      return <Globe2 className={className} />;
    case 'history':
      return <Landmark className={className} />;
    case 'economics':
      return <TrendingUp className={className} />;
    case 'ict':
    case 'it':
      return <Monitor className={className} />;
    default:
      return <BookText className={className} />;
  }
};

export const Sidebar: React.FC<SidebarProps> = ({
  subjects,
  selectedSubjectId,
  onSelectSubject,
  selectedStream = 'all',
  onSelectStream,
}) => {
  const { t, isRtl } = useLanguage();
  const { getSubjectProgress } = useProgress();
  const [internalStream, setInternalStream] = useState<SubjectStream | 'all'>(selectedStream);

  const activeStream = onSelectStream ? selectedStream : internalStream;
  const handleStreamChange = (stream: SubjectStream | 'all') => {
    if (onSelectStream) {
      onSelectStream(stream);
    } else {
      setInternalStream(stream);
    }
  };

  // Filter subjects according to stream if filtered
  const filteredSubjects = subjects.filter((s) => {
    if (activeStream === 'all') return true;
    if (s.stream === 'common' || !s.stream) return true;
    return s.stream === activeStream;
  });

  return (
    <aside
      id="subjects-sidebar"
      className="w-full md:w-64 lg:w-72 shrink-0 border-b-[1.5px] md:border-b-0 md:border-r-[1.5px] border-[#38332D] bg-[#F4EEDB] flex flex-col"
    >
      <div className="p-3.5 border-b-[1.5px] border-[#38332D] flex flex-col gap-2 bg-[#ECE4D0]">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-[#4A4237]">
            {t.subjectsTitle}
          </span>
          <span className="text-[11px] text-[#786D5B] font-serif-ethiopic">
            {t.subjectsSubtitle}
          </span>
        </div>

        {/* Stream Filter Pills */}
        <div className="flex items-center gap-1 p-0.5 bg-[#DDD3BD] border border-[#38332D]/30">
          <button
            onClick={() => handleStreamChange('all')}
            className={`flex-1 py-1 text-[10px] sm:text-[11px] font-bold transition-all cursor-pointer ${
              activeStream === 'all'
                ? 'bg-[#38332D] text-[#FAF6EC] shadow-xs'
                : 'text-[#4A4237] hover:bg-[#CFC3A8]'
            }`}
          >
            {t.streamAll}
          </button>
          <button
            onClick={() => handleStreamChange('natural')}
            className={`flex-1 py-1 text-[10px] sm:text-[11px] font-bold transition-all cursor-pointer ${
              activeStream === 'natural'
                ? 'bg-[#047857] text-white shadow-xs'
                : 'text-[#065F46] hover:bg-[#CFC3A8]'
            }`}
          >
            {t.streamNatural}
          </button>
          <button
            onClick={() => handleStreamChange('social')}
            className={`flex-1 py-1 text-[10px] sm:text-[11px] font-bold transition-all cursor-pointer ${
              activeStream === 'social'
                ? 'bg-[#D97706] text-white shadow-xs'
                : 'text-[#92400E] hover:bg-[#CFC3A8]'
            }`}
          >
            {t.streamSocial}
          </button>
        </div>
      </div>

      {/* Horizontal scroll on mobile, vertical list on desktop */}
      <nav
        id="subjects-nav-list"
        aria-label={t.subjectsTitle}
        className="flex md:flex-col overflow-x-auto md:overflow-x-visible no-scrollbar divide-x-[1.5px] md:divide-x-0 md:divide-y-[1.5px] divide-[#38332D] p-1.5 md:p-0"
      >
        {filteredSubjects.map((subject) => {
          const isSelected = subject.id === selectedSubjectId;
          const progress = getSubjectProgress(subject);

          return (
            <button
              key={subject.id}
              id={`subject-btn-${subject.id}`}
              onClick={() => onSelectSubject(subject.id)}
              className={`flex items-center gap-2.5 px-3 py-2.5 sm:px-4 sm:py-3 text-left rtl:text-right transition-all whitespace-nowrap md:whitespace-normal cursor-pointer w-auto md:w-full relative ${
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
              <div className="flex flex-col min-w-0 pr-1 rtl:pr-0 rtl:pl-1">
                <span className="text-sm leading-tight font-serif-ethiopic truncate">
                  {subject.name}
                </span>
                <span className="text-[10px] text-[#7A705E] tracking-wider truncate">
                  {subject.subName}
                </span>
              </div>

              {/* Completion Progress Indicator Badge */}
              <div className="ml-auto mr-0 rtl:mr-auto rtl:ml-0 flex items-center gap-1.5 shrink-0">
                {progress.isFullyComplete ? (
                  <span
                    className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-emerald-100 border border-emerald-400 text-emerald-800 text-[10px] font-bold"
                    title={t.statusCompleted}
                  >
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span className="hidden lg:inline">{t.statusCompleted}</span>
                  </span>
                ) : (
                  <span
                    className="text-[10px] font-mono font-semibold px-1 py-0.2 bg-[#E7DECA] border border-[#38332D]/30 text-[#665C4D]"
                    title={`${progress.completedTopics}/${progress.totalTopics}`}
                  >
                    {progress.completedTopics}/{progress.totalTopics}
                  </span>
                )}

                {/* Active Indicator Arrow on Desktop */}
                {isSelected && (
                  <span
                    className="hidden md:inline-block text-xs font-mono font-bold"
                    style={{ color: subject.accentColor }}
                  >
                    {isRtl ? '‹' : '›'}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};
