import React, { useState, useMemo } from 'react';
import {
  X,
  ListOrdered,
  BookOpen,
  Search,
  ChevronRight,
  Sparkles,
  Award,
  CheckCircle2,
  FileText,
  Clock,
  Layers,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';
import { Grade, Subject, SubjectTextbook, SupplementaryBook } from '../types';
import { useLanguage } from '../context/LanguageContext';

export interface TableOfContentsItem {
  id: string;
  type: 'unit' | 'section' | 'exam' | 'summary' | 'example';
  numberLabel: string;
  title: string;
  description?: string;
  unitNumber: number;
  sectionIndex?: number;
  pageNumber?: number;
  durationMinutes?: number;
  subsections?: {
    id: string;
    title: string;
    keyTermsCount?: number;
    examplesCount?: number;
  }[];
}

interface TableOfContentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  badge?: string;
  accentColor?: string;
  textbook?: SubjectTextbook;
  supplementaryBook?: SupplementaryBook;
  currentUnitNumber?: number;
  currentChapterIndex?: number;
  onSelectUnit?: (unitNumber: number, sectionIndex?: number) => void;
  onSelectSupplementaryChapter?: (chapterIndex: number) => void;
  onOpenAITutor?: (topicTitle: string) => void;
  onTakeExam?: (unitNumber: number) => void;
}

export const TableOfContentsModal: React.FC<TableOfContentsModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  badge = 'ኦፊሴላዊ የስርዓተ-ትምህርት ማውጫ',
  accentColor = '#2E6B4A',
  textbook,
  supplementaryBook,
  currentUnitNumber = 1,
  currentChapterIndex = 0,
  onSelectUnit,
  onSelectSupplementaryChapter,
  onOpenAITutor,
  onTakeExam,
}) => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedUnits, setExpandedUnits] = useState<Record<number, boolean>>({
    [currentUnitNumber]: true,
  });

  // Toggle unit expansion
  const toggleUnit = (unitNumber: number) => {
    setExpandedUnits((prev) => ({
      ...prev,
      [unitNumber]: !prev[unitNumber],
    }));
  };

  // Build items from Textbook
  const textbookItems = useMemo<TableOfContentsItem[]>(() => {
    if (!textbook) return [];
    return textbook.units.map((unit, uIdx) => {
      return {
        id: `unit-${unit.unitNumber}`,
        type: 'unit',
        numberLabel: `ምዕራፍ ${unit.unitNumber}`,
        title: unit.title.replace(/^[^\s]+ [0-9]+፡\s*/, ''),
        description: unit.summary,
        unitNumber: unit.unitNumber,
        durationMinutes: 45 + unit.sections.length * 15,
        subsections: unit.sections.map((sec, sIdx) => ({
          id: `sec-${unit.unitNumber}-${sIdx}`,
          title: sec.title,
          keyTermsCount: sec.keyTerms?.length || 0,
          examplesCount: sec.workedExamples?.length || 0,
        })),
      };
    });
  }, [textbook]);

  // Build items from Supplementary Book
  const supplementaryItems = useMemo<TableOfContentsItem[]>(() => {
    if (!supplementaryBook) return [];
    return supplementaryBook.chapters.map((ch, idx) => {
      return {
        id: `supp-ch-${idx}`,
        type: 'unit',
        numberLabel: `ክፍል ${idx + 1}`,
        title: ch.title,
        description: ch.summary,
        unitNumber: idx + 1,
        sectionIndex: idx,
        durationMinutes: 40,
        subsections: [
          ...(ch.keyFormulasAndRules && ch.keyFormulasAndRules.length > 0
            ? [{ id: `supp-ch-${idx}-formulas`, title: '⚡ ዋና ዋና ቀመሮች እና ህጎች (Key Formulas & Rules)' }]
            : []),
          ...(ch.workedProblems && ch.workedProblems.length > 0
            ? [{ id: `supp-ch-${idx}-problems`, title: `📝 የተሰሩ የፈተና ጥያቄዎች (${ch.workedProblems.length} Worked Problems)` }]
            : []),
          ...(ch.examTipsAndTraps && ch.examTipsAndTraps.length > 0
            ? [{ id: `supp-ch-${idx}-traps`, title: '⚠️ የፈተና ወጥመዶችና ስልቶች (Exam Traps & Strategies)' }]
            : []),
        ],
      };
    });
  }, [supplementaryBook]);

  const items = textbook ? textbookItems : supplementaryItems;

  // Filter items by search
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return items;
    const q = searchQuery.toLowerCase();
    return items.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.numberLabel.toLowerCase().includes(q) ||
        item.description?.toLowerCase().includes(q) ||
        item.subsections?.some((sub) => sub.title.toLowerCase().includes(q))
    );
  }, [items, searchQuery]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/65 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        id="table-of-contents-modal-container"
        className="bg-[#FAF6EC] border-[2px] border-[#38332D] w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl rounded-xl overflow-hidden"
      >
        {/* Modal Header */}
        <div className="bg-[#38332D] text-[#FAF6EC] px-5 py-4 flex items-center justify-between border-b border-[#25211D]">
          <div className="flex items-center gap-3">
            <div
              className="p-2 rounded-lg text-white flex items-center justify-center border border-white/20"
              style={{ backgroundColor: accentColor }}
            >
              <ListOrdered className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold font-serif-ethiopic bg-amber-400 text-[#1E1B18] px-2 py-0.5 rounded-xs">
                  {badge}
                </span>
                <span className="text-xs text-[#C8BFAF] font-mono">
                  {items.length} {textbook ? 'ምዕራፎች (Units)' : 'ክፍሎች (Chapters)'}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold font-serif-ethiopic text-white mt-0.5">
                {title} — ማውጫ (Table of Contents)
              </h2>
              {subtitle && (
                <p className="text-xs text-[#DDD3C2] font-serif-ethiopic line-clamp-1">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-[#C8BFAF] hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            title="ዝጋ (Close Table of Contents)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Quick Filter Bar */}
        <div className="bg-[#F2ECE0] border-b border-[#D8CEBC] p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#857967]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="በማውጫው ውስጥ ርዕስ፣ ንዑስ ርዕስ ወይም ፅንሰ-ሀሳብ ይፈልጉ..."
              className="w-full pl-9 pr-3 py-2 text-xs font-serif-ethiopic bg-[#FAF6EC] border-[1.5px] border-[#38332D] text-[#24211E] placeholder-[#8C806E] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#38332D]"
              autoFocus
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={() => {
                const allExpanded: Record<number, boolean> = {};
                items.forEach((i) => {
                  allExpanded[i.unitNumber] = true;
                });
                setExpandedUnits(allExpanded);
              }}
              className="px-2.5 py-1.5 text-xs font-bold font-serif-ethiopic bg-[#EDE6D4] hover:bg-[#E2D8C0] border border-[#38332D] rounded-md text-[#38332D] cursor-pointer"
            >
              ሁሉንም ዘርጋ (Expand All)
            </button>
            <button
              onClick={() => setExpandedUnits({})}
              className="px-2.5 py-1.5 text-xs font-bold font-serif-ethiopic bg-[#EDE6D4] hover:bg-[#E2D8C0] border border-[#38332D] rounded-md text-[#38332D] cursor-pointer"
            >
              ሁሉንም እጠፍ (Collapse)
            </button>
          </div>
        </div>

        {/* Interactive Table of Contents List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#FAF6EC]">
          {filteredItems.length === 0 ? (
            <div className="p-8 text-center text-[#786D5B] font-serif-ethiopic space-y-2">
              <Search className="w-8 h-8 mx-auto opacity-40" />
              <p className="text-sm font-bold">ምንም ማውጫ አልተገኘም</p>
              <p className="text-xs">የተለየ ቃል ወይም የቁጥር ርዕስ በመፈለጊያው ላይ ያስገቡ።</p>
            </div>
          ) : (
            filteredItems.map((item) => {
              const isCurrent = textbook
                ? item.unitNumber === currentUnitNumber
                : item.sectionIndex === currentChapterIndex;
              const isExpanded = expandedUnits[item.unitNumber] ?? isCurrent;

              return (
                <div
                  key={item.id}
                  className={`border-[1.5px] rounded-xl overflow-hidden transition-all ${
                    isCurrent
                      ? 'border-[#2E6B4A] bg-[#F2F8F4] shadow-xs'
                      : 'border-[#38332D]/40 bg-[#FAF6EC] hover:border-[#38332D]'
                  }`}
                >
                  {/* Unit Main Header Banner */}
                  <div
                    onClick={() => toggleUnit(item.unitNumber)}
                    className="p-3.5 sm:p-4 flex items-start justify-between gap-3 cursor-pointer select-none bg-inherit"
                  >
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (textbook && onSelectUnit) {
                            onSelectUnit(item.unitNumber);
                            onClose();
                          } else if (supplementaryBook && onSelectSupplementaryChapter) {
                            onSelectSupplementaryChapter(item.sectionIndex || 0);
                            onClose();
                          }
                        }}
                        className={`px-2.5 py-1 rounded text-xs font-bold font-serif-ethiopic shrink-0 transition-transform active:scale-95 cursor-pointer shadow-xs ${
                          isCurrent
                            ? 'bg-[#2E6B4A] text-white border border-[#1D4A32]'
                            : 'bg-[#38332D] text-[#FAF6EC] hover:bg-[#52493E]'
                        }`}
                        title="ቀጥታ ወደዚህ ምዕራፍ ሂድ (Jump to Unit)"
                      >
                        {item.numberLabel}
                      </button>

                      <div className="space-y-1 flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-sm sm:text-base font-bold font-serif-ethiopic text-[#1A1815]">
                            {item.title}
                          </h3>
                          {isCurrent && (
                            <span className="text-[10px] font-bold font-serif-ethiopic bg-emerald-600 text-white px-2 py-0.5 rounded-full flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              የተመረጠ (Active)
                            </span>
                          )}
                        </div>

                        {item.description && (
                          <p className="text-xs text-[#5C5346] font-serif-ethiopic line-clamp-2 leading-relaxed">
                            {item.description}
                          </p>
                        )}

                        <div className="flex items-center gap-3 pt-1 text-[11px] text-[#7A6E5C] font-serif-ethiopic">
                          {item.subsections && item.subsections.length > 0 && (
                            <span className="flex items-center gap-1">
                              <Layers className="w-3.5 h-3.5" />
                              {item.subsections.length} ንዑስ ርዕሶች
                            </span>
                          )}
                          {item.durationMinutes && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              ~{item.durationMinutes} ደቂቃ
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (textbook && onSelectUnit) {
                            onSelectUnit(item.unitNumber);
                            onClose();
                          } else if (supplementaryBook && onSelectSupplementaryChapter) {
                            onSelectSupplementaryChapter(item.sectionIndex || 0);
                            onClose();
                          }
                        }}
                        className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#2E6B4A] hover:bg-[#235338] text-white text-xs font-bold font-serif-ethiopic cursor-pointer shadow-xs"
                      >
                        <span>ክፈት (Open)</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>

                      <div className="p-1 text-[#5C5346]">
                        <ChevronRight
                          className={`w-5 h-5 transition-transform duration-200 ${
                            isExpanded ? 'rotate-90' : ''
                          }`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Expanded Subsections Accordion */}
                  {isExpanded && item.subsections && item.subsections.length > 0 && (
                    <div className="border-t border-[#D8CEBC] bg-[#F7F2E7] p-3 sm:p-4 space-y-2">
                      <div className="text-[11px] font-bold font-serif-ethiopic uppercase tracking-wider text-[#7A6E5C] mb-2 flex items-center justify-between">
                        <span>የምዕራፉ ዝርዝር ንዑሳን ርዕሶች (Sub-topics & Sections)</span>
                        <span>ጠቅ በማድረግ ቀጥታ ይግቡ</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {item.subsections.map((sub, sIdx) => (
                          <button
                            key={sub.id}
                            onClick={() => {
                              if (textbook && onSelectUnit) {
                                onSelectUnit(item.unitNumber, sIdx);
                                onClose();
                              } else if (supplementaryBook && onSelectSupplementaryChapter) {
                                onSelectSupplementaryChapter(item.sectionIndex || 0);
                                onClose();
                              }
                            }}
                            className="text-left p-2.5 rounded-lg bg-[#FAF6EC] hover:bg-white border border-[#D5CAAF] hover:border-[#2E6B4A] transition-all flex items-center justify-between gap-2 group cursor-pointer shadow-2xs"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="w-5 h-5 rounded-full bg-[#EDE6D4] group-hover:bg-[#2E6B4A] group-hover:text-white text-[11px] font-bold font-mono flex items-center justify-center text-[#5A5040] shrink-0 transition-colors">
                                {sIdx + 1}
                              </span>
                              <span className="text-xs font-serif-ethiopic text-[#2E2820] group-hover:text-[#1A1815] font-medium truncate">
                                {sub.title}
                              </span>
                            </div>

                            <ChevronRight className="w-3.5 h-3.5 text-[#A0937F] group-hover:text-[#2E6B4A] group-hover:translate-x-0.5 transition-transform shrink-0" />
                          </button>
                        ))}
                      </div>

                      {/* Quick Unit Actions Bar inside TOC */}
                      <div className="pt-3 mt-2 border-t border-[#E5DAC4] flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          {onOpenAITutor && (
                            <button
                              onClick={() => {
                                onOpenAITutor(item.title);
                                onClose();
                              }}
                              className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-amber-100 hover:bg-amber-200 border border-amber-400 text-amber-950 text-xs font-bold font-serif-ethiopic cursor-pointer"
                            >
                              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                              <span>በAI ተንትን (AI Analyze)</span>
                            </button>
                          )}

                          {onTakeExam && textbook && (
                            <button
                              onClick={() => {
                                onTakeExam(item.unitNumber);
                                onClose();
                              }}
                              className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-100 hover:bg-emerald-200 border border-emerald-500 text-emerald-950 text-xs font-bold font-serif-ethiopic cursor-pointer"
                            >
                              <Award className="w-3.5 h-3.5 text-emerald-700" />
                              <span>ፈተና ውሰድ (Take Exam)</span>
                            </button>
                          )}
                        </div>

                        <button
                          onClick={() => {
                            if (textbook && onSelectUnit) {
                              onSelectUnit(item.unitNumber);
                              onClose();
                            } else if (supplementaryBook && onSelectSupplementaryChapter) {
                              onSelectSupplementaryChapter(item.sectionIndex || 0);
                              onClose();
                            }
                          }}
                          className="text-xs font-bold font-serif-ethiopic text-[#2E6B4A] hover:underline flex items-center gap-1 cursor-pointer ml-auto"
                        >
                          <span>ወደ ሙሉ ምዕራፍ ሂድ (Go to Full Unit)</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-[#F2ECE0] border-t border-[#D8CEBC] px-5 py-3 flex flex-wrap items-center justify-between gap-3 text-xs font-serif-ethiopic text-[#5C5346]">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#2E6B4A]" />
            <span>የማውጫውን ማንኛውንም ርዕስ ሲጫኑ ቀጥታ ወደሚመለከተው ገጽ ይወስድዎታል።</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#38332D] hover:bg-[#25211D] text-white font-bold cursor-pointer"
          >
            ዝጋ (Close)
          </button>
        </div>
      </div>
    </div>
  );
};
