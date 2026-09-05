import React, { useState, useMemo, useEffect } from 'react';
import { Subject, Grade, SupplementaryBook, SupplementaryBookChapter, LanguageCode } from '../types';
import { getSupplementaryBooks } from '../data/supplementaryData';
import { normalizeSubjectId } from '../data/textbooksData';
import { useLanguage } from '../context/LanguageContext';
import {
  Library,
  BookOpen,
  Sparkles,
  Search,
  Filter,
  CheckCircle2,
  Lightbulb,
  FileText,
  ChevronRight,
  Loader2,
  HelpCircle,
  Award,
  Zap,
  Globe,
  LogOut,
  ListOrdered,
} from 'lucide-react';
import { TableOfContentsModal } from './TableOfContentsModal';

interface SupplementaryBooksViewProps {
  subject: Subject;
  grade: Grade;
  onOpenAITutor?: (chapterTitle: string, mode: 'analysis' | 'chat') => void;
  onExit?: () => void;
}

export const SupplementaryBooksView: React.FC<SupplementaryBooksViewProps> = ({
  subject,
  grade,
  onOpenAITutor,
  onExit,
}) => {
  const { language, setLanguage, t } = useLanguage();

  // Filter books matching current subject or display all
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isTocModalOpen, setIsTocModalOpen] = useState<boolean>(false);

  const currentBooksList = useMemo(() => {
    return getSupplementaryBooks(language);
  }, [language]);

  const filteredBooks = useMemo(() => {
    const normSubjectId = normalizeSubjectId(subject.id);
    return currentBooksList.filter((b) => {
      const normBookSubjectId = normalizeSubjectId(b.subjectId);
      const matchesSubject = b.subjectId === 'all' || normBookSubjectId === 'all' || normSubjectId === normBookSubjectId;
      const matchesCategory = selectedCategory === 'all' || b.category === selectedCategory;
      const matchesSearch =
        !searchQuery ||
        b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.amharicTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.description.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesSubject && matchesCategory && matchesSearch;
    });
  }, [currentBooksList, subject.id, selectedCategory, searchQuery]);

  const availableBooks = filteredBooks.length > 0 ? filteredBooks : currentBooksList;
  const [selectedBookId, setSelectedBookId] = useState<string>(availableBooks[0]?.id || 'supp-math-extreme-11-12');
  const [selectedChapterIndex, setSelectedChapterIndex] = useState<number>(0);

  const selectedBook: SupplementaryBook = useMemo(() => {
    return availableBooks.find((b) => b.id === selectedBookId) || availableBooks[0] || currentBooksList[0];
  }, [availableBooks, selectedBookId, currentBooksList]);

  const [aiAnalysis, setAiAnalysis] = useState<{
    analysis: string;
    keyTips?: string[];
  } | null>(null);
  const [isAnalyzingAI, setIsAnalyzingAI] = useState<boolean>(false);

  const currentChapter: SupplementaryBookChapter | undefined =
    selectedBook?.chapters[selectedChapterIndex] || selectedBook?.chapters[0];

  const languagesList: { code: LanguageCode; label: string; flag: string }[] = [
    { code: 'am', label: 'አማርኛ', flag: '🇪🇹' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'om', label: 'Afaan Oromoo', flag: '🌳' },
    { code: 'ti', label: 'ትግርኛ', flag: '🏔️' },
    { code: 'ar', label: 'العربية', flag: '🌍' },
    { code: 'so', label: 'Soomaali', flag: '⭐' },
  ];

  const handleAnalyzeSupplementary = async () => {
    if (!currentChapter) return;
    setIsAnalyzingAI(true);
    try {
      const res = await fetch('/api/ai/analyze-supplementary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookTitle: selectedBook.title,
          chapterTitle: currentChapter.title,
          subjectName: subject.name,
          query: `Analyze key exam patterns, shortcuts, and common traps for ${currentChapter.title}`,
          language,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setAiAnalysis(data);
      } else {
        throw new Error('Supplementary analysis failed');
      }
    } catch (err) {
      console.warn('AI Supplementary analysis fallback:', err);
      setAiAnalysis({
        analysis: `### 1. 📖 የዚህ አጋዥ መጽሐፍ ዋና ጠቀሜታ
ይህ **${selectedBook.title}** የተሰኘው አጋዥ መጽሐፍ ለ${subject.name} ክፍል ${grade} (${currentChapter.title}) ተማሪዎች ንድፈ-ሀሳብን ከፈተና ጥያቄዎች ጋር አጣምሮ የሚያቀርብ ከፍተኛ ጠቀሜታ ያለው መመሪያ ነው።

### 2. ⚡ ፈጣን የፈተና አሰራር ዘዴዎች (High-Speed Exam Tricks)
- ${currentChapter.keyFormulasAndRules?.join('\n- ') || 'ፈጣን የስሌት መንገዶችና ቴክኒኮች ተካትተዋል።'}
- በሀገር አቀፍ የዩኒቨርሲቲ መግቢያ ፈተናዎች (ESSLCE) ላይ የሚደጋገሙ ዋና ዋና ነጥቦች ተለይተዋል።

### 3. 📌 ማጠቃለያ የቀመር ሰሌዳ
- በምዕራፉ ውስጥ የተካተቱትን ቀመሮች እና ህጎች በደብተርዎ ላይ በመጻፍ ይለማመዱ።`,
        keyTips: ['የተሰሩ የፈተና ጥያቄዎችን ደጋግመው ይስሩ', 'ቀመሮችን በቃላት ሳይሆን በተግባር ይለማመዱ'],
      });
    } finally {
      setIsAnalyzingAI(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header Banner */}
      <div className="bg-[#FAF6EC] border-[1.5px] border-[#38332D] rounded-xl p-4 sm:p-5 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center border border-[#38332D]"
              style={{ backgroundColor: subject.accentColor, color: '#FFFFFF' }}
            >
              <Library className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold font-serif-ethiopic text-[#1E1B18]">
                አጋዥ መጽሐፍት እና የፈተና ጥንቅሮች (Supplementary & Reference Guides)
              </h2>
              <p className="text-xs text-[#5A5143] font-serif-ethiopic">
                የExtreme Series፣ የAlpha Prep እና የሀገር አቀፍ ፈተና (ESSLCE) አቋራጭ መንገዶችና ትንታኔዎች
              </p>
            </div>
          </div>

          {/* Search bar, TOC & Exit button */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            <button
              id="open-supp-toc-btn"
              onClick={() => setIsTocModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1D4ED8] hover:bg-[#1E40AF] text-white text-xs font-bold font-serif-ethiopic shadow-xs transition-all active:scale-95 cursor-pointer border border-[#1E3A8A] shrink-0"
              title="የአጋዥ መጽሐፉን ማውጫ ክፈት (Open Table of Contents)"
            >
              <ListOrdered className="w-3.5 h-3.5" />
              <span>📋 ማውጫ (TOC)</span>
            </button>

            <div className="relative">
              <Search className="w-4 h-4 text-[#8A7E6C] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="አጋዥ መጽሐፍ ፈልግ..."
                className="bg-[#EDE6D4] border border-[#38332D] rounded-lg pl-9 pr-3 py-1.5 text-xs text-[#1E1B18] font-serif-ethiopic focus:outline-none w-full sm:w-52"
              />
            </div>

            {onExit && (
              <button
                onClick={onExit}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#8B261E] hover:bg-[#721F18] text-white text-xs font-bold font-serif-ethiopic shadow-xs cursor-pointer border border-[#5E1610] shrink-0"
                title="ከአጋዥ መጽሐፍት ውጣ / ወደ ዋናው ትምህርት ተመለስ (Exit Reference Books)"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>መውጫ / ውጣ (Exit)</span>
              </button>
            )}
          </div>
        </div>

        {/* Language selector & Categories selector */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 border-t border-[#38332D]/20">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-bold font-serif-ethiopic text-[#5A5143] flex items-center gap-1 mr-1">
              <Globe className="w-3.5 h-3.5 text-[#8A7E6C]" />
              ቋንቋ / Language:
            </span>
            {languagesList.map((langItem) => {
              const isCurrent = language === langItem.code;
              return (
                <button
                  key={langItem.code}
                  onClick={() => {
                    setLanguage(langItem.code);
                    setAiAnalysis(null);
                  }}
                  className={`px-2 py-0.5 text-xs font-medium font-serif-ethiopic rounded transition-colors cursor-pointer flex items-center gap-1 ${
                    isCurrent
                      ? 'bg-[#2E6B4A] text-white font-bold border border-[#1D4A32] shadow-xs'
                      : 'bg-[#EDE6D4] text-[#5A5143] border border-[#38332D]/40 hover:bg-[#E3DAC4]'
                  }`}
                  title={`ቋንቋ ወደ ${langItem.label} ቀይር`}
                >
                  <span>{langItem.flag}</span>
                  <span>{langItem.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {[
              { id: 'all', label: 'ሁሉም' },
              { id: 'extreme', label: 'Extreme Series' },
              { id: 'national_exam', label: 'ESSLCE Exams' },
              { id: 'formula_handbook', label: 'Formulas' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold transition-all whitespace-nowrap cursor-pointer border ${
                  selectedCategory === cat.id
                    ? 'bg-[#1E1B18] text-[#FAF6EC] border-[#1E1B18]'
                    : 'bg-[#EDE6D4] text-[#5A5143] border-[#38332D]/40 hover:bg-[#E3DAC4]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Book selector cards strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {availableBooks.map((b) => {
          const isSelected = selectedBook?.id === b.id;

          return (
            <div
              key={b.id}
              onClick={() => {
                setSelectedBookId(b.id);
                setSelectedChapterIndex(0);
                setAiAnalysis(null);
              }}
              className={`p-3.5 rounded-xl border-[1.5px] cursor-pointer transition-all ${
                isSelected
                  ? 'bg-[#FAF6EC] border-[#38332D] shadow-[3px_3px_0px_0px_#1E1B18]'
                  : 'bg-[#EDE6D4] border-[#38332D]/40 hover:bg-[#E3DAC4]'
              }`}
            >
              <div className="flex items-center justify-between gap-1 mb-1.5">
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-amber-200 text-amber-900 border border-amber-400">
                  {b.badge}
                </span>
                <span className="text-[11px] font-bold text-[#665C4D]">{b.authorOrSeries}</span>
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-[#1E1B18] font-serif-ethiopic line-clamp-1">
                {b.amharicTitle || b.title}
              </h4>
              <p className="text-[11px] text-[#5A5143] line-clamp-2 mt-1 font-serif-ethiopic">
                {b.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Main Chapter Content & Analysis */}
      {selectedBook && currentChapter && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Col: Chapter Reader */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-[#FAF6EC] border-[1.5px] border-[#38332D] rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
              {/* Chapter Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#38332D]">
                <div>
                  <span className="text-xs font-black uppercase text-amber-900 bg-amber-200 border border-amber-400 px-2 py-0.5 rounded">
                    ምዕራፍ {currentChapter.chapterNumber}
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-[#1E1B18] font-serif-ethiopic mt-1">
                    {currentChapter.title}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleAnalyzeSupplementary}
                    disabled={isAnalyzingAI}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 border border-amber-400 text-amber-950 text-xs font-bold cursor-pointer"
                  >
                    {isAnalyzingAI ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-700" />
                    ) : (
                      <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                    )}
                    <span>በAI ተንትን (AI Analysis)</span>
                  </button>
                  <button
                    onClick={() => onOpenAITutor?.(currentChapter.title, 'chat')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1E1B18] hover:bg-[#38332D] text-[#FAF6EC] text-xs font-bold cursor-pointer shadow-xs"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>AI ጠይቅ</span>
                  </button>
                </div>
              </div>

              {/* Summary */}
              <div className="bg-[#EDE6D4] p-3.5 rounded-lg border border-[#38332D]/60 text-xs sm:text-sm font-serif-ethiopic text-[#1E1B18] leading-relaxed">
                <span className="font-bold text-amber-900 block mb-1">የምዕራፉ ማጠቃለያ፡</span>
                {currentChapter.summary}
              </div>

              {/* AI Deep Dive Analysis (if triggered) */}
              {aiAnalysis && (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 space-y-2 text-xs font-serif-ethiopic text-amber-950">
                  <div className="flex items-center gap-2 font-bold text-amber-900">
                    <Sparkles className="w-4 h-4 text-amber-700" />
                    <span>የGemini 3.7 ጥልቅ የፈተና እና የአሰራር ትንታኔ፡</span>
                  </div>
                  <p className="whitespace-pre-wrap leading-relaxed">{aiAnalysis.analysis}</p>
                  {aiAnalysis.keyTips && aiAnalysis.keyTips.length > 0 && (
                    <div className="pt-2 border-t border-amber-300/60">
                      <span className="font-bold">የፈተና አቋራጭ ምክሮች፡</span>
                      <ul className="list-disc list-inside mt-1 space-y-1">
                        {aiAnalysis.keyTips.map((tip, i) => (
                          <li key={i}>{tip}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Key Formulas & Rules */}
              {currentChapter.keyFormulasAndRules &&
                currentChapter.keyFormulasAndRules.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#665C4D] flex items-center gap-1.5">
                      <Zap className="w-4 h-4 text-amber-700" />
                      <span>ዋና ዋና ቀመሮች እና ህጎች (Formulas & Rules)</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {currentChapter.keyFormulasAndRules.map((rule, idx) => (
                        <div
                          key={idx}
                          className="bg-[#FAF6EC] border border-[#38332D] p-3 rounded-lg font-mono text-xs font-bold text-[#1E1B18] shadow-2xs"
                        >
                          {rule}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* Sample Exam Problems & Step-by-Step Solutions */}
              {currentChapter.sampleExamProblems &&
                currentChapter.sampleExamProblems.length > 0 && (
                  <div className="space-y-3 pt-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#665C4D] flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-emerald-700" />
                      <span>የተሰሩ የፈተና ጥያቄዎች እና የባለሙያ ምክሮች (Worked Problems & Tips)</span>
                    </h4>

                    <div className="space-y-3">
                      {currentChapter.sampleExamProblems.map((prob, idx) => (
                        <div
                          key={idx}
                          className="bg-[#EDE6D4] border border-[#38332D] rounded-xl p-4 space-y-2 text-xs font-serif-ethiopic"
                        >
                          <div className="font-bold text-[#1E1B18] flex items-start gap-2">
                            <span className="w-5 h-5 rounded-full bg-[#1E1B18] text-[#FAF6EC] flex items-center justify-center shrink-0 text-[11px]">
                              {idx + 1}
                            </span>
                            <span>{prob.problem}</span>
                          </div>

                          <div className="bg-[#FAF6EC] p-3 rounded border border-[#38332D]/40 whitespace-pre-wrap leading-relaxed text-[#1E1B18]">
                            <span className="font-bold text-emerald-800 block mb-1">መፍትሄ (Solution):</span>
                            {prob.solution}
                          </div>

                          {prob.tip && (
                            <div className="flex items-start gap-1.5 text-amber-900 bg-amber-100 p-2.5 rounded border border-amber-300">
                              <Lightbulb className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                              <span>
                                <strong>የፈተና ምክር (Pro Tip):</strong> {prob.tip}
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* Full Content */}
              <div className="space-y-2 pt-2 text-xs sm:text-sm font-serif-ethiopic text-[#1E1B18] leading-relaxed">
                {currentChapter.fullContent.map((paragraph, pIdx) => (
                  <p key={pIdx}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>

          {/* Right Col: Chapters List + Book Highlights */}
          <div className="lg:col-span-4 space-y-4">
            {/* Chapters Navigation */}
            <div className="bg-[#FAF6EC] border-[1.5px] border-[#38332D] rounded-xl p-4 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#665C4D] flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-amber-700" />
                  <span>የመጽሐፉ ምዕራፎች ({selectedBook.chapters.length})</span>
                </h4>
                <button
                  type="button"
                  onClick={() => setIsTocModalOpen(true)}
                  className="text-[11px] font-bold font-serif-ethiopic text-[#1D4ED8] hover:text-[#1E40AF] hover:underline flex items-center gap-1 cursor-pointer bg-blue-50 px-2 py-0.5 rounded border border-blue-200"
                >
                  <ListOrdered className="w-3 h-3" />
                  <span>ሙሉ ማውጫ</span>
                </button>
              </div>

              <div className="space-y-1.5">
                {selectedBook.chapters.map((ch, chIdx) => {
                  const isChSelected = selectedChapterIndex === chIdx;

                  return (
                    <button
                      key={chIdx}
                      onClick={() => {
                        setSelectedChapterIndex(chIdx);
                        setAiAnalysis(null);
                      }}
                      className={`w-full text-left p-2.5 rounded-lg border text-xs font-serif-ethiopic transition-all flex items-center justify-between gap-2 cursor-pointer ${
                        isChSelected
                          ? 'bg-[#1E1B18] text-[#FAF6EC] border-[#1E1B18] font-bold'
                          : 'bg-[#EDE6D4] text-[#1E1B18] border-[#38332D]/40 hover:bg-[#E3DAC4]'
                      }`}
                    >
                      <span className="line-clamp-1">
                        ምዕራፍ {ch.chapterNumber}: {ch.title}
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Book Highlights */}
            <div className="bg-[#FAF6EC] border-[1.5px] border-[#38332D] rounded-xl p-4 shadow-xs space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#665C4D] flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-emerald-700" />
                <span>የዚህ አጋዥ መጽሐፍ ዋና ዋና ጠቀሜታዎች</span>
              </h4>

              <ul className="space-y-2">
                {selectedBook.highlights.map((h, i) => (
                  <li
                    key={i}
                    className="text-xs text-[#1E1B18] font-serif-ethiopic flex items-start gap-2 bg-[#EDE6D4] p-2.5 rounded-lg border border-[#38332D]/40"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Table of Contents Modal for Supplementary Book */}
      {selectedBook && (
        <TableOfContentsModal
          isOpen={isTocModalOpen}
          onClose={() => setIsTocModalOpen(false)}
          title={selectedBook.amharicTitle || selectedBook.title}
          subtitle={selectedBook.description}
          badge={selectedBook.badge}
          accentColor={subject.accentColor}
          supplementaryBook={selectedBook}
          currentUnitNumber={currentChapter?.chapterNumber || 1}
          onSelectSupplementaryChapter={(chapterIdx) => {
            setSelectedChapterIndex(chapterIdx);
            setAiAnalysis(null);
            setIsTocModalOpen(false);
          }}
          onOpenAITutor={(topic) => {
            onOpenAITutor?.(topic, 'analysis');
            setIsTocModalOpen(false);
          }}
        />
      )}
    </div>
  );
};
