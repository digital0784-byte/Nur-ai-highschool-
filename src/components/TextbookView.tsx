import React, { useState, useMemo, useEffect } from 'react';
import {
  Download,
  Printer,
  BookOpen,
  Search,
  Bookmark,
  ChevronRight,
  ChevronDown,
  CheckCircle2,
  FileText,
  Layers,
  ZoomIn,
  ZoomOut,
  Sparkles,
  Bot,
  Award,
  Globe,
  LogOut,
  ListOrdered,
  ListFilter,
  ExternalLink,
} from 'lucide-react';
import { Grade, Subject, LanguageCode } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { getTextbook, getAllTextbooksForSubject } from '../data/textbooksData';
import { generateTextbookPdf } from '../utils/pdfGenerator';
import { TableOfContentsModal } from './TableOfContentsModal';

interface TextbookViewProps {
  subject: Subject;
  selectedGrade: Grade;
  onSelectGrade: (grade: Grade) => void;
  onOpenAllTextbooksModal?: () => void;
  onOpenAITutor?: (chapterTitle: string, mode: 'analysis' | 'chat') => void;
  onTakeObjectivesExam?: (unitNumber: number) => void;
  onExit?: () => void;
}

export const TextbookView: React.FC<TextbookViewProps> = ({
  subject,
  selectedGrade,
  onSelectGrade,
  onOpenAllTextbooksModal,
  onOpenAITutor,
  onTakeObjectivesExam,
  onExit,
}) => {
  const { language, setLanguage, t } = useLanguage();
  const [activeUnitNumber, setActiveUnitNumber] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [fontSizeLevel, setFontSizeLevel] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);
  const [isTocModalOpen, setIsTocModalOpen] = useState<boolean>(false);
  const [targetSectionToScroll, setTargetSectionToScroll] = useState<number | null>(null);

  // Retrieve the textbook for the current subject, grade, and student selected language
  const currentTextbook = useMemo(() => {
    return getTextbook(subject.id, selectedGrade, language);
  }, [subject.id, selectedGrade, language]);

  // Handle jump to specific section
  const handleJumpToSection = (unitNumber: number, sectionIndex?: number) => {
    setActiveUnitNumber(unitNumber);
    if (typeof sectionIndex === 'number') {
      setTargetSectionToScroll(sectionIndex);
    }
  };

  // Scroll to targeted section when unit changes or section selected
  useEffect(() => {
    if (targetSectionToScroll !== null) {
      const timer = setTimeout(() => {
        const el = document.getElementById(`section-${activeUnitNumber}-${targetSectionToScroll}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        setTargetSectionToScroll(null);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [activeUnitNumber, targetSectionToScroll]);

  // Available grade textbooks for this subject in current language
  const availableGradeTextbooks = useMemo(() => {
    return getAllTextbooksForSubject(subject.id, language);
  }, [subject.id, language]);

  const languagesList: { code: LanguageCode; label: string; flag: string }[] = [
    { code: 'am', label: 'አማርኛ', flag: '🇪🇹' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'om', label: 'Afaan Oromoo', flag: '🌳' },
    { code: 'ti', label: 'ትግርኛ', flag: '🏔️' },
    { code: 'ar', label: 'العربية', flag: '🌍' },
    { code: 'so', label: 'Soomaali', flag: '⭐' },
  ];

  // Active unit
  const activeUnit = useMemo(() => {
    return (
      currentTextbook.units.find((u) => u.unitNumber === activeUnitNumber) ||
      currentTextbook.units[0]
    );
  }, [currentTextbook, activeUnitNumber]);

  // Filtered units based on search query
  const filteredUnits = useMemo(() => {
    if (!searchQuery.trim()) return currentTextbook.units;
    const q = searchQuery.toLowerCase();
    return currentTextbook.units.filter(
      (u) =>
        u.title.toLowerCase().includes(q) ||
        u.summary.toLowerCase().includes(q) ||
        u.sections.some(
          (s) =>
            s.title.toLowerCase().includes(q) ||
            s.content.some((c) => c.toLowerCase().includes(q))
        )
    );
  }, [currentTextbook, searchQuery]);

  // Font size classes
  const fontClasses = {
    normal: 'text-sm leading-relaxed',
    large: 'text-base leading-relaxed',
    xlarge: 'text-lg leading-loose',
  }[fontSizeLevel];

  // Handle PDF Download
  const handleDownloadPdf = () => {
    setIsGeneratingPdf(true);
    try {
      generateTextbookPdf(currentTextbook, subject.name, selectedGrade);
    } catch (err) {
      console.error('PDF Generation failed:', err);
    } finally {
      setTimeout(() => setIsGeneratingPdf(false), 500);
    }
  };

  // Handle Print / Save as PDF
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-6">
      {/* Textbook Header Banner */}
      <div
        id="textbook-header-card"
        className="border-[1.5px] border-[#38332D] bg-[#F2ECE0] p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm"
      >
        <div className="space-y-1.5 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-bold font-serif-ethiopic bg-[#38332D] text-[#FAF6EC]">
              <BookOpen className="w-3.5 h-3.5" />
              {t.gradeTierPrefix} {selectedGrade} {t.gradeTextbookTitle}
            </span>
            <span className="text-[11px] font-serif-ethiopic bg-[#E5DCC9] border border-[#BFB29E] px-2 py-0.5 text-[#544B3D] font-medium">
              {currentTextbook.curriculumBadge}
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-bold font-serif-ethiopic text-[#1A1815]">
            {subject.name} - {t.gradeTierPrefix} {selectedGrade}
          </h1>
          <p className="text-xs sm:text-sm font-serif-ethiopic text-[#5C5346] line-clamp-2">
            {currentTextbook.description}
          </p>
        </div>

        {/* Actions: TOC, Download PDF, Print, Exit & Grade Switcher */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Prominent Table of Contents (ማውጫ) Button */}
          <button
            id="open-textbook-toc-btn"
            onClick={() => setIsTocModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-bold font-serif-ethiopic bg-[#1D4ED8] hover:bg-[#1E40AF] text-white border-[1.5px] border-[#1E3A8A] shadow-sm transition-all active:scale-95 cursor-pointer"
            title="የመጽሐፉን ሙሉ ማውጫ ክፈት (Open Table of Contents)"
          >
            <ListOrdered className="w-4 h-4" />
            <span>📋 ማውጫ (Table of Contents)</span>
          </button>

          {/* Official Ministry of Education PDF Button or Summarized Badge */}
          {currentTextbook.officialPdfUrl ? (
            <a
              id="view-official-pdf-btn"
              href={currentTextbook.officialPdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-bold font-serif-ethiopic bg-[#047857] hover:bg-[#065F46] text-white border-[1.5px] border-[#064E3B] shadow-sm transition-all active:scale-95 cursor-pointer no-underline"
              title="የትምህርት ሚኒስቴር ኦፊሴላዊ የተማሪ መጽሐፍ (PDF) በአዲስ ገጽ ክፈት"
            >
              <ExternalLink className="w-4 h-4" />
              <span>📘 ኦፊሴላዊ መጽሐፍ (PDF)</span>
            </a>
          ) : (
            <span
              id="summarized-note-badge"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium font-serif-ethiopic bg-[#F2ECE0] text-[#5C5346] border border-[#BFB29E] select-none"
              title="ይህ ክፍል የተጠቃለለ ዲጂታል ማስታወሻ ይዟል"
            >
              <FileText className="w-3.5 h-3.5 text-[#8C806E]" />
              <span>የተጠቃለለ ዲጂታል ማስታወሻ</span>
            </span>
          )}

          {onExit && (
            <button
              id="exit-textbook-btn"
              onClick={onExit}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-bold font-serif-ethiopic bg-[#8B261E] hover:bg-[#721F18] text-white border-[1.5px] border-[#5E1610] shadow-sm transition-colors cursor-pointer"
              title="ከመጽሐፍ ውጣ / ወደ ዋናው ትምህርት ተመለስ (Exit Book)"
            >
              <LogOut className="w-4 h-4" />
              <span>መውጫ / ውጣ (Exit)</span>
            </button>
          )}

          <button
            id="download-textbook-pdf-btn"
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-bold font-serif-ethiopic bg-[#2E6B4A] hover:bg-[#24573B] text-white border-[1.5px] border-[#1D4A32] shadow-sm transition-colors cursor-pointer disabled:opacity-50"
            title="Download full PDF textbook"
          >
            <Download className="w-4 h-4" />
            {isGeneratingPdf ? t.downloadingPdfLabel : t.downloadPdfBtn}
          </button>

          <button
            id="print-textbook-btn"
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium font-serif-ethiopic bg-[#FAF6EC] hover:bg-[#EBE3D3] text-[#2D2821] border-[1.5px] border-[#38332D] shadow-sm transition-colors cursor-pointer"
            title="Print or Save as PDF via browser"
          >
            <Printer className="w-4 h-4" />
            {t.printPdfBtn}
          </button>
        </div>
      </div>

      {/* Grade & Language Selector Strip & All-Subjects PDF Library Button */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b-[1.5px] border-[#D8CEBC] pb-3">
        <div className="flex flex-wrap items-center gap-4">
          {/* Grade Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold font-serif-ethiopic text-[#6B6150] uppercase tracking-wider">
              {t.selectGradeTextbookPrompt}:
            </span>
            <div className="flex items-center gap-1.5">
              {([9, 10, 11, 12] as Grade[]).map((g) => {
                const isSelected = g === selectedGrade;
                return (
                  <button
                    key={g}
                    onClick={() => {
                      onSelectGrade(g);
                      setActiveUnitNumber(1);
                    }}
                    className={`px-3 py-1 text-xs font-bold font-serif-ethiopic border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#38332D] text-[#FAF6EC] border-[#38332D] shadow-xs'
                        : 'bg-[#FAF6EC] text-[#5A5040] border-[#BFB29E] hover:bg-[#EBE3D3]'
                    }`}
                  >
                    {t.gradeTierPrefix} {g}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Language Selector for Textbook */}
          <div className="flex items-center gap-2 border-l border-[#D8CEBC] pl-3">
            <span className="text-xs font-bold font-serif-ethiopic text-[#6B6150] flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-[#8A7E6C]" />
              ቋንቋ / Language:
            </span>
            <div className="flex items-center gap-1 flex-wrap">
              {languagesList.map((langItem) => {
                const isCurrent = language === langItem.code;
                return (
                  <button
                    key={langItem.code}
                    onClick={() => setLanguage(langItem.code)}
                    className={`px-2 py-0.5 text-xs font-medium font-serif-ethiopic rounded transition-colors cursor-pointer flex items-center gap-1 ${
                      isCurrent
                        ? 'bg-[#2E6B4A] text-white font-bold border border-[#1D4A32] shadow-xs'
                        : 'bg-[#FAF6EC] text-[#5C5346] border border-[#BFB29E] hover:bg-[#EBE3D3]'
                    }`}
                    title={`ቋንቋ ወደ ${langItem.label} ቀይር`}
                  >
                    <span>{langItem.flag}</span>
                    <span>{langItem.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* View All Subjects PDF Library Button */}
        {onOpenAllTextbooksModal && (
          <button
            onClick={onOpenAllTextbooksModal}
            className="flex items-center gap-1.5 text-xs font-bold font-serif-ethiopic text-[#8E4A1F] hover:text-[#6D3613] hover:underline cursor-pointer"
          >
            <Layers className="w-4 h-4" />
            {t.allSubjectsPdfLibraryTitle} →
          </button>
        )}
      </div>

      {/* Main Reading Workspace: Units Navigation (Left) + Unit Content (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Table of Contents & Unit Switcher (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Search box within textbook */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#857967]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchInTextbookPlaceholder}
              className="w-full pl-9 pr-3 py-2 text-xs font-serif-ethiopic bg-[#FAF6EC] border-[1.5px] border-[#38332D] text-[#24211E] placeholder-[#8C806E] focus:outline-none focus:ring-1 focus:ring-[#38332D]"
            />
          </div>

          {/* Units Navigation Box */}
          <div className="border-[1.5px] border-[#38332D] bg-[#FAF6EC] p-3 space-y-2.5 rounded-lg shadow-xs">
            <div className="flex items-center justify-between border-b border-[#D8CEBC] pb-2 px-1">
              <span className="text-xs font-bold font-serif-ethiopic text-[#38332D] flex items-center gap-1.5">
                <Bookmark className="w-3.5 h-3.5 text-[#A2421B]" />
                {t.textbookTableOfContents}
              </span>
              <button
                type="button"
                onClick={() => setIsTocModalOpen(true)}
                className="text-[11px] font-bold font-serif-ethiopic text-[#1D4ED8] hover:text-[#1E40AF] hover:underline flex items-center gap-1 cursor-pointer bg-blue-50 px-2 py-0.5 rounded border border-blue-200"
              >
                <ListOrdered className="w-3 h-3" />
                <span>ሙሉ ማውጫ</span>
              </button>
            </div>

            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
              {filteredUnits.length === 0 ? (
                <div className="p-3 text-xs text-center text-[#786D5B] font-serif-ethiopic">
                  ምንም ምዕራፍ አልተገኘም (No matching units)
                </div>
              ) : (
                filteredUnits.map((u) => {
                  const isActive = u.unitNumber === activeUnit.unitNumber;
                  return (
                    <div
                      key={u.unitNumber}
                      className={`border rounded-lg overflow-hidden transition-all ${
                        isActive
                          ? 'border-[#38332D] bg-[#F2EDE1] shadow-xs'
                          : 'border-[#D8CEBC] bg-[#FAF6EC] hover:border-[#BFB29E]'
                      }`}
                    >
                      <button
                        onClick={() => setActiveUnitNumber(u.unitNumber)}
                        className={`w-full text-left p-2.5 text-xs font-serif-ethiopic transition-all flex items-start justify-between gap-2 cursor-pointer ${
                          isActive
                            ? 'bg-[#38332D] text-[#FAF6EC] font-bold'
                            : 'bg-[#F5EFE3] text-[#423A2F] hover:bg-[#EBE3D3]'
                        }`}
                      >
                        <div className="space-y-0.5 flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`px-1.5 py-0.2 text-[10px] font-bold uppercase rounded-xs ${
                                isActive
                                  ? 'bg-[#FAF6EC] text-[#38332D]'
                                  : 'bg-[#E5DCC9] text-[#544B3D]'
                              }`}
                            >
                              {t.unitLabel} {u.unitNumber}
                            </span>
                            <span className="text-[10px] text-opacity-80">
                              ({u.sections.length} ንዑስ ርዕሶች)
                            </span>
                          </div>
                          <p className="line-clamp-2 text-xs leading-snug">
                            {u.title.replace(/^[^\s]+ [0-9]+፡\s*/, '')}
                          </p>
                        </div>
                        <ChevronDown
                          className={`w-3.5 h-3.5 mt-1 shrink-0 transition-transform duration-200 ${
                            isActive ? 'rotate-180 text-[#FAF6EC]' : 'text-[#877B68]'
                          }`}
                        />
                      </button>

                      {/* Expandable subtopics if active */}
                      {isActive && u.sections && u.sections.length > 0 && (
                        <div className="p-2 space-y-1 bg-[#FAF6EC] border-t border-[#D8CEBC]">
                          <div className="text-[10px] font-bold font-serif-ethiopic text-[#7A6E5C] uppercase px-1 pb-1">
                            የምዕራፉ ንዑሳን ርዕሶች (Sections):
                          </div>
                          {u.sections.map((sec, sIdx) => (
                            <button
                              key={sIdx}
                              onClick={() => handleJumpToSection(u.unitNumber, sIdx)}
                              className="w-full text-left px-2 py-1.5 rounded text-[11px] font-serif-ethiopic text-[#2E2820] hover:bg-[#EAE2D1] hover:text-[#1A1815] transition-colors flex items-center justify-between gap-1 group cursor-pointer"
                            >
                              <span className="truncate">
                                {sec.title}
                              </span>
                              <ChevronRight className="w-3 h-3 text-[#A0937F] group-hover:text-[#2E6B4A] shrink-0" />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Quick PDF Card */}
          <div className="border border-[#BFB29E] bg-[#F2ECE0] p-3 text-xs font-serif-ethiopic space-y-2">
            <div className="flex items-center gap-2 text-[#38332D] font-bold">
              <FileText className="w-4 h-4 text-[#2E6B4A]" />
              <span>ኦፊሴላዊ የትምህርት ሚኒስቴር ማረጋገጫ</span>
            </div>
            <p className="text-[11px] text-[#5C5346] leading-relaxed">
              ይህ መጽሐፍ በአዲሱ የኢትዮጵያ የሁለተኛ ደረጃ ትምህርት ስርዓተ-ትምህርት መስፈርት መሰረት የተዘጋጀ ይዘት ነው።
            </p>
          </div>
        </div>

        {/* Right Column: Full Unit Reader View (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Reader Control Bar: Font sizing & reading mode */}
          <div className="flex items-center justify-between bg-[#F2ECE0] border-[1.5px] border-[#38332D] px-3.5 py-2 text-xs">
            <div className="flex items-center gap-2 text-[#38332D] font-serif-ethiopic font-bold">
              <span className="bg-[#38332D] text-[#FAF6EC] px-2 py-0.5 text-[11px]">
                {t.unitLabel} {activeUnit.unitNumber}
              </span>
              <span className="truncate max-w-[280px] sm:max-w-[400px]">
                {activeUnit.title}
              </span>
            </div>

            {/* Font Zoom Controls */}
            <div className="flex items-center gap-1 text-[#483F33]">
              <span className="text-[11px] font-serif-ethiopic hidden sm:inline mr-1">
                {t.fontSizeLabel}:
              </span>
              <button
                onClick={() => setFontSizeLevel('normal')}
                className={`px-2 py-0.5 text-xs font-bold border ${
                  fontSizeLevel === 'normal'
                    ? 'bg-[#38332D] text-[#FAF6EC] border-[#38332D]'
                    : 'bg-[#FAF6EC] border-[#BFB29E] hover:bg-[#EAE1D1]'
                }`}
                title="Normal Font Size"
              >
                A
              </button>
              <button
                onClick={() => setFontSizeLevel('large')}
                className={`px-2 py-0.5 text-sm font-bold border ${
                  fontSizeLevel === 'large'
                    ? 'bg-[#38332D] text-[#FAF6EC] border-[#38332D]'
                    : 'bg-[#FAF6EC] border-[#BFB29E] hover:bg-[#EAE1D1]'
                }`}
                title="Large Font Size"
              >
                A+
              </button>
              <button
                onClick={() => setFontSizeLevel('xlarge')}
                className={`px-2 py-0.5 text-base font-bold border ${
                  fontSizeLevel === 'xlarge'
                    ? 'bg-[#38332D] text-[#FAF6EC] border-[#38332D]'
                    : 'bg-[#FAF6EC] border-[#BFB29E] hover:bg-[#EAE1D1]'
                }`}
                title="Extra Large Font Size"
              >
                A++
              </button>
            </div>
          </div>

          {/* Printable Textbook Unit Paper Document */}
          <div
            id="textbook-document-paper"
            className="border-[1.5px] border-[#38332D] bg-[#FAF6EC] p-5 sm:p-8 space-y-6 shadow-xs"
          >
            {/* Unit Header */}
            <div className="border-b-[1.5px] border-[#38332D] pb-4 space-y-2">
              <div className="text-xs uppercase font-mono font-bold tracking-widest text-[#7C6E59]">
                UNIT {activeUnit.unitNumber} • {subject.name.toUpperCase()} (GRADE {selectedGrade})
              </div>
              <h2 className="text-xl sm:text-2xl font-bold font-serif-ethiopic text-[#1A1815]">
                {activeUnit.title}
              </h2>
              {/* Unit Summary Box */}
              <div className="bg-[#F5EFE3] border-l-4 border-[#38332D] p-3 text-xs sm:text-sm font-serif-ethiopic text-[#4E4437] italic">
                <span className="font-bold not-italic text-[#1E1B18]">የምዕራፉ ማጠቃለያ (Summary): </span>
                {activeUnit.summary}
              </div>

              {/* AI & Objectives Action Bar */}
              <div className="pt-2 flex flex-wrap gap-2 not-italic">
                <button
                  onClick={() => onOpenAITutor?.(activeUnit.title, 'analysis')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 border border-amber-400 text-amber-950 text-xs font-bold font-serif-ethiopic shadow-2xs cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                  <span>በAI ተንትን (AI Deep Dive)</span>
                </button>

                <button
                  onClick={() => onOpenAITutor?.(activeUnit.title, 'chat')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1E1B18] hover:bg-[#38332D] text-[#FAF6EC] text-xs font-bold font-serif-ethiopic shadow-2xs cursor-pointer"
                >
                  <Bot className="w-3.5 h-3.5 text-amber-400" />
                  <span>የAI አስተማሪ ጠይቅ (Ask AI Tutor)</span>
                </button>

                {onTakeObjectivesExam && (
                  <button
                    onClick={() => onTakeObjectivesExam(activeUnit.unitNumber)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-100 hover:bg-emerald-200 border border-emerald-500 text-emerald-950 text-xs font-bold font-serif-ethiopic shadow-2xs cursor-pointer"
                  >
                    <Award className="w-3.5 h-3.5 text-emerald-700" />
                    <span>የቻፕተሩን ዓላማዎች ተፈተን (Take Exam)</span>
                  </button>
                )}
              </div>
            </div>

            {/* Sections */}
            <div className="space-y-6">
              {activeUnit.sections.map((section, idx) => (
                <div
                  key={idx}
                  id={`section-${activeUnit.unitNumber}-${idx}`}
                  className="space-y-3.5 scroll-mt-6"
                >
                  <h3 className="text-base sm:text-lg font-bold font-serif-ethiopic text-[#28231C] border-b border-[#E0D5C3] pb-1 flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#A2421B] shrink-0" />
                    {section.title}
                  </h3>

                  {/* Paragraphs */}
                  <div className={`space-y-2.5 font-serif-ethiopic text-[#2B2620] ${fontClasses}`}>
                    {section.content.map((p, pIdx) => (
                      <p key={pIdx} className="leading-relaxed">
                        {p}
                      </p>
                    ))}
                  </div>

                  {/* Key Terms Box if present */}
                  {section.keyTerms && section.keyTerms.length > 0 && (
                    <div className="border border-[#C8BCAB] bg-[#F4EFE6] p-3.5 space-y-2">
                      <div className="text-xs font-bold font-serif-ethiopic text-[#38332D] uppercase tracking-wider flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#2E6B4A]" />
                        ዋና ዋና ቃላት እና ትርጓሜዎች (Key Terms)
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                        {section.keyTerms.map((kt, kIdx) => (
                          <div
                            key={kIdx}
                            className="bg-[#FAF6EC] border border-[#DDD3C2] p-2.5 space-y-1 text-xs font-serif-ethiopic"
                          >
                            <span className="font-bold text-[#1E1B18] block text-[13px]">
                              {kt.term}
                            </span>
                            <span className="text-[#554C3F] leading-snug block text-[12px]">
                              {kt.definition}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Worked Examples if present */}
                  {section.workedExamples && section.workedExamples.length > 0 && (
                    <div className="border border-[#A8C4B3] bg-[#EFF7F2] p-3.5 space-y-3">
                      <div className="text-xs font-bold font-serif-ethiopic text-[#1A4D32] flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-[#2E6B4A]" />
                        {t.workedExamplesTitle}
                      </div>

                      {section.workedExamples.map((we, wIdx) => (
                        <div
                          key={wIdx}
                          className="bg-[#FAFDFB] border border-[#B9D8C6] p-3 space-y-2 text-xs font-serif-ethiopic"
                        >
                          <div className="font-bold text-[#1A442E] leading-snug">
                            {we.question}
                          </div>
                          <div className="text-[#2F5441] pl-2.5 border-l-2 border-[#2E6B4A] space-y-1">
                            <span className="font-bold text-[#1D3E2B] block">አሰራር / መፍትሄ (Solution):</span>
                            <p className="leading-relaxed">{we.solution}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Exercises if present */}
                  {section.exercises && section.exercises.length > 0 && (
                    <div className="border border-[#DFD4C0] bg-[#F7F2E8] p-3 space-y-2 text-xs font-serif-ethiopic">
                      <div className="font-bold text-[#453C30]">
                        የመልመጃ ጥያቄዎች (Exercises):
                      </div>
                      <ul className="list-disc pl-5 space-y-1 text-[#3B3327]">
                        {section.exercises.map((ex, exIdx) => (
                          <li key={exIdx}>{ex}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Unit Review Questions */}
            {activeUnit.unitReviewQuestions && activeUnit.unitReviewQuestions.length > 0 && (
              <div className="border-t-[1.5px] border-[#38332D] pt-4 space-y-3">
                <h4 className="text-sm sm:text-base font-bold font-serif-ethiopic text-[#1E1B18] flex items-center gap-2">
                  <Bookmark className="w-4 h-4 text-[#A2421B]" />
                  {t.unitReviewQuestionsTitle} ({activeUnit.title})
                </h4>
                <div className="space-y-2">
                  {activeUnit.unitReviewQuestions.map((rq, rqIdx) => (
                    <div
                      key={rqIdx}
                      className="bg-[#F5EFE3] border border-[#D5C9B5] p-2.5 text-xs sm:text-sm font-serif-ethiopic text-[#312B23] flex items-start gap-2"
                    >
                      <span className="font-mono font-bold text-[#7E715D] shrink-0">
                        {rqIdx + 1}.
                      </span>
                      <span>{rq}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Bottom navigation between units */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-[#D8CEBC]">
            {activeUnit.unitNumber > 1 ? (
              <button
                onClick={() => setActiveUnitNumber(activeUnit.unitNumber - 1)}
                className="px-3.5 py-2 text-xs font-bold font-serif-ethiopic bg-[#FAF6EC] hover:bg-[#EBE3D3] text-[#38332D] border-[1.5px] border-[#38332D] cursor-pointer"
              >
                ← ቀዳሚ ምዕራፍ ({activeUnit.unitNumber - 1})
              </button>
            ) : <div />}

            <div className="flex items-center gap-2">
              {onExit && (
                <button
                  onClick={onExit}
                  className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold font-serif-ethiopic bg-[#8B261E] hover:bg-[#721F18] text-white border-[1.5px] border-[#5E1610] cursor-pointer shadow-xs"
                  title="ከመጽሐፉ ውጣ (Exit Book)"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>መውጫ / ውጣ (Exit)</span>
                </button>
              )}

              <button
                onClick={handleDownloadPdf}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold font-serif-ethiopic bg-[#2E6B4A] hover:bg-[#235338] text-white border-[1.5px] border-[#1D4A32] cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                {t.downloadPdfBtn}
              </button>
            </div>

            {activeUnit.unitNumber < currentTextbook.units.length ? (
              <button
                onClick={() => setActiveUnitNumber(activeUnit.unitNumber + 1)}
                className="px-3.5 py-2 text-xs font-bold font-serif-ethiopic bg-[#38332D] hover:bg-[#201D1A] text-[#FAF6EC] border-[1.5px] border-[#38332D] cursor-pointer"
              >
                ቀጣይ ምዕራፍ ({activeUnit.unitNumber + 1}) →
              </button>
            ) : <div />}
          </div>
        </div>
      </div>

      {/* Interactive Table of Contents Modal */}
      <TableOfContentsModal
        isOpen={isTocModalOpen}
        onClose={() => setIsTocModalOpen(false)}
        title={`${subject.name} - ክፍል ${selectedGrade}`}
        subtitle={currentTextbook.description}
        badge={currentTextbook.curriculumBadge}
        accentColor={subject.accentColor}
        textbook={currentTextbook}
        currentUnitNumber={activeUnit.unitNumber}
        onSelectUnit={(unitNum, secIdx) => {
          handleJumpToSection(unitNum, secIdx);
          setIsTocModalOpen(false);
        }}
        onOpenAITutor={(topic) => {
          onOpenAITutor?.(topic, 'analysis');
          setIsTocModalOpen(false);
        }}
        onTakeExam={(unitNum) => {
          onTakeObjectivesExam?.(unitNum);
          setIsTocModalOpen(false);
        }}
      />
    </div>
  );
};
