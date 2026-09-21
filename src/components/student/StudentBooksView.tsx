import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  ZoomIn,
  ZoomOut,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Lock,
  Sparkles,
  Bot,
  Layers,
  X,
  CheckCircle2,
  Filter,
} from 'lucide-react';
import { GradeLevel } from '../../types/curriculumEngine';
import { LanguageCode } from '../../types';
import { ethiopianCurriculumEngine } from '../../engine/curriculumRegistry';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { ProgressBar } from '../ui/ProgressBar';

interface StudentBooksViewProps {
  grade: GradeLevel;
  language: LanguageCode;
  onOpenAITutorForBook?: (bookTitle: string, pageText: string) => void;
}

interface InAppBook {
  id: string;
  title: string;
  titleAmharic: string;
  subject: string;
  grade: GradeLevel;
  coverColor: string;
  totalPages: number;
  currentPage: number;
  readProgress: number;
  isBookmarked: boolean;
  units: {
    unitNumber: number;
    title: string;
    pages: {
      pageNumber: number;
      heading: string;
      content: string;
      keyFormulas?: string[];
    }[];
  }[];
}

export const StudentBooksView: React.FC<StudentBooksViewProps> = ({
  grade,
  language,
  onOpenAITutorForBook,
}) => {
  const { userProfile } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState('all');

  // Reader state
  const [activeReadingBook, setActiveReadingBook] = useState<InAppBook | null>(null);
  const [activeUnitIndex, setActiveUnitIndex] = useState(0);
  const [activePageIndex, setActivePageIndex] = useState(0);
  const [zoomLevel, setZoomLevel] = useState<number>(100); // 90%, 100%, 115%, 130%
  const [bookSearch, setBookSearch] = useState('');
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [aiExplanationText, setAiExplanationText] = useState<string | null>(null);

  // Books Catalog Data aligned with Ethiopian Grade Curriculums
  const booksData: InAppBook[] = [
    {
      id: `math-g${grade}`,
      title: `Grade ${grade} Mathematics Student Textbook`,
      titleAmharic: `የ${grade}ኛ ክፍል ሒሳብ የተማሪ መጽሐፍ`,
      subject: 'Mathematics',
      grade,
      coverColor: 'from-emerald-700 to-teal-900',
      totalPages: 184,
      currentPage: 34,
      readProgress: 45,
      isBookmarked: true,
      units: [
        {
          unitNumber: 1,
          title: language === 'am' ? 'ምዕራፍ 1: ግንኙነቶችና ፈንክሽኖች' : 'Unit 1: Relations & Functions',
          pages: [
            {
              pageNumber: 1,
              heading: '1.1 Relations and Ordered Pairs',
              content:
                language === 'am'
                  ? 'በሒሳብ ውስጥ ስብስብ A እና ስብስብ B ሲሰጡ፣ የካርቴዢያን ብዜት A × B ንዑስ ስብስብ ግንኙነት (Relation) ይባላል። እያንዳንዱ ቅደም-ተከተል ያለው ጥንድ (x, y) በ x እና y መካከል ያለውን ዝምድና ያሳያል።'
                  : 'In high school mathematics, given two non-empty sets A and B, any subset of the Cartesian product A × B is defined as a relation from A to B. Each ordered pair (x, y) associates an input element with an output element.',
              keyFormulas: ['A × B = {(a, b) : a ∈ A and b ∈ B}', 'Domain(R) = {x : (x, y) ∈ R}'],
            },
            {
              pageNumber: 2,
              heading: '1.2 Functions and Inverses',
              content:
                language === 'am'
                  ? 'ፈንክሽን f ከ A ወደ B ሲሆን፣ በ A ውስጥ ላለ ለእያንዳንዱ አባል አንድና አንድ ብቻ ምስል (image) በ B ውስጥ ሲኖረው ነው። የአቀባዊ መስመር ፈተና (Vertical Line Test) ግራፉ ፈንክሽን መሆኑን ለማረጋገጥ ይረዳል።'
                  : 'A function f from A to B is a relation that assigns to each element of A exactly one element of B. The vertical line test states that if every vertical line intersects a graph in at most one point, the graph represents a function.',
              keyFormulas: ['f : A → B', 'f(x) = y', 'f⁻¹(y) = x'],
            },
          ],
        },
        {
          unitNumber: 2,
          title: language === 'am' ? 'ምዕራፍ 2: የሁለተኛ ዲግሪ እኩልታዎች' : 'Unit 2: Quadratic Equations',
          pages: [
            {
              pageNumber: 3,
              heading: '2.1 Solving Quadratic Equations by Factoring',
              content:
                language === 'am'
                  ? 'የሁለተኛ ዲግሪ እኩልታ አጠቃላይ ቅርጽ ax² + bx + c = 0 (a ≠ 0) ነው። በመደመርና በማባዛት ወይም በኳድራቲክ ፎርሙላ በመጠቀም መፍታት ይቻላል።'
                  : 'The standard form of a quadratic equation is ax² + bx + c = 0 where a ≠ 0. The discriminant D = b² - 4ac determines the nature of the roots.',
              keyFormulas: ['x = [-b ± √(b² - 4ac)] / (2a)', 'Discriminant D = b² - 4ac'],
            },
          ],
        },
      ],
    },
    {
      id: `physics-g${grade}`,
      title: `Grade ${grade} Physics Student Textbook`,
      titleAmharic: `የ${grade}ኛ ክፍል ፊዚክስ የተማሪ መጽሐፍ`,
      subject: 'Physics',
      grade,
      coverColor: 'from-blue-700 to-indigo-950',
      totalPages: 210,
      currentPage: 22,
      readProgress: 30,
      isBookmarked: false,
      units: [
        {
          unitNumber: 1,
          title: language === 'am' ? 'ምዕራፍ 1: ፊዚክስና የሰው ልጅ ማህበረሰብ' : 'Unit 1: Physics and Human Society',
          pages: [
            {
              pageNumber: 1,
              heading: '1.1 Physical Quantities and Measurement',
              content:
                language === 'am'
                  ? 'ፊዚክስ የተፈጥሮን ህጎች፣ ቁስና ኃይልን የሚያጠና የሳይንስ ዘርፍ ነው። ዓለም አቀፍ የመለኪያ አሃዶች (SI units) ለትክክለኛ ሳይንሳዊ ግንኙነት ወሳኝ ናቸው።'
                  : 'Physics is the empirical study of matter, energy, space, and time. Standard SI base units provide a universally consistent metric framework.',
              keyFormulas: ['Length: Meter (m)', 'Mass: Kilogram (kg)', 'Time: Second (s)'],
            },
          ],
        },
      ],
    },
    {
      id: `chemistry-g${grade}`,
      title: `Grade ${grade} Chemistry Student Textbook`,
      titleAmharic: `የ${grade}ኛ ክፍል ኬሚስትሪ የተማሪ መጽሐፍ`,
      subject: 'Chemistry',
      grade,
      coverColor: 'from-amber-700 to-stone-900',
      totalPages: 168,
      currentPage: 14,
      readProgress: 20,
      isBookmarked: false,
      units: [
        {
          unitNumber: 1,
          title: language === 'am' ? 'ምዕራፍ 1: የአቶም መዋቅር' : 'Unit 1: Atomic Structure & Periodicity',
          pages: [
            {
              pageNumber: 1,
              heading: '1.1 Early Atomic Theories',
              content:
                language === 'am'
                  ? 'ዳህልተን፣ ቶምሰን እና ራዘርፎርድ የአቶምን መዋቅር ለማብራራት የተለያዩ ሙከራዎችን አድርገዋል። የቦህር ሞዴል የኤሌክትሮኖችን የኢነርጂ እርከኖች ያስረዳል።'
                  : 'From Dalton and Thomson to Rutherford and Bohr, the atomic model evolved to explain discrete energy levels and subatomic configurations.',
            },
          ],
        },
      ],
    },
    {
      id: `biology-g${grade}`,
      title: `Grade ${grade} Biology Student Textbook`,
      titleAmharic: `የ${grade}ኛ ክፍል ባዮሎጂ የተማሪ መጽሐፍ`,
      subject: 'Biology',
      grade,
      coverColor: 'from-teal-700 to-emerald-950',
      totalPages: 195,
      currentPage: 50,
      readProgress: 52,
      isBookmarked: true,
      units: [
        {
          unitNumber: 1,
          title: language === 'am' ? 'ምዕራፍ 1: የህዋስ ባዮሎጂ' : 'Unit 1: Cell Biology & Microscopes',
          pages: [
            {
              pageNumber: 1,
              heading: '1.1 Cell Structure and Function',
              content:
                language === 'am'
                  ? 'ህዋስ የሁሉም ህይወት ያላቸው ፍጥረታት መሰረታዊ መዋቅራዊና ተግባራዊ አሃድ ነው። ፕሮካርዮቲክና ዩካርዮቲክ ህዋሳት በመዋቅር ይለያያሉ።'
                  : 'The cell is the basic structural and functional unit of life. Plant and animal cells feature distinct membrane-bound organelles.',
            },
          ],
        },
      ],
    },
    {
      id: `economics-g${grade}`,
      title: `Grade ${grade} Economics Student Textbook`,
      titleAmharic: `የ${grade}ኛ ክፍል ኢኮኖሚክስ የተማሪ መጽሐፍ`,
      subject: 'Economics',
      grade,
      coverColor: 'from-stone-700 to-stone-900',
      totalPages: 150,
      currentPage: 10,
      readProgress: 15,
      isBookmarked: false,
      units: [
        {
          unitNumber: 1,
          title: language === 'am' ? 'ምዕራፍ 1: የኢኮኖሚክስ ምንነት' : 'Unit 1: Fundamentals of Economics',
          pages: [
            {
              pageNumber: 1,
              heading: '1.1 Scarcity and Opportunity Cost',
              content:
                language === 'am'
                  ? 'ኢኮኖሚክስ ውስን ሃብቶችን ያልተገደበ የሰዎች ፍላጎት ለማርካት እንዴት ጥቅም ላይ እንደሚውሉ ያጠናል። የእድል ዋጋ (Opportunity Cost) የተተወው ምርጥ አማራጭ ነው።'
                  : 'Economics is the social science studying resource allocation under scarcity. Opportunity cost represents the next best alternative forgone.',
            },
          ],
        },
      ],
    },
  ];

  const filteredBooks = booksData.filter((b) => {
    const matchSearch =
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.titleAmharic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.subject.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchSearch) return false;
    if (selectedSubjectFilter !== 'all' && b.subject.toLowerCase() !== selectedSubjectFilter.toLowerCase()) {
      return false;
    }
    return true;
  });

  const handleOpenReader = (book: InAppBook) => {
    setActiveReadingBook(book);
    setActiveUnitIndex(0);
    setActivePageIndex(0);
    setZoomLevel(100);
    setBookSearch('');
    setIsBookmarked(book.isBookmarked);
    setAiExplanationText(null);
  };

  const handleAskAIAboutPage = () => {
    if (!activeReadingBook) return;
    const currentUnit = activeReadingBook.units[activeUnitIndex];
    const currentPage = currentUnit?.pages[activePageIndex];
    if (!currentPage) return;

    setAiExplanationText(
      language === 'am'
        ? `የኑር AI ማጠቃለያ ለገጽ ${currentPage.pageNumber} (${currentPage.heading}): \n\nይህ ክፍል በኢትዮጵያ ሥርዓተ-ትምህርት መሠረት የፈተና ጥያቄዎች የሚወጡበት ቁልፍ ነጥብ ነው። ዋናው መያዝ ያለበት ነጥብ፡ ${currentPage.content.substring(0, 100)}...`
        : `NUR AI Explanation for Page ${currentPage.pageNumber} (${currentPage.heading}): \n\nThis section contains core definitions frequently tested in national entrance exams. Key takeaway: ${currentPage.content.substring(0, 120)}...`
    );
  };

  // IF SECURE READER IS ACTIVE: RENDER IN-APP DRM PROTECTED READER
  if (activeReadingBook) {
    const currentUnit = activeReadingBook.units[activeUnitIndex];
    const currentPage = currentUnit?.pages[activePageIndex];

    return (
      <div className="space-y-4 max-w-5xl mx-auto pb-12">
        {/* READER TOP CONTROLS */}
        <div className="bg-white rounded-3xl p-4 border border-stone-200/90 shadow-xs flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveReadingBook(null)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-200 text-xs font-bold text-stone-700 hover:bg-stone-100 cursor-pointer transition-colors"
            >
              ← {language === 'am' ? 'ወደ መጽሐፍት ተመለስ' : 'Exit Reader'}
            </button>
            <div className="min-w-0">
              <h3 className="text-xs sm:text-sm font-bold text-stone-900 truncate">
                {language === 'am' ? activeReadingBook.titleAmharic : activeReadingBook.title}
              </h3>
              <p className="text-[11px] text-stone-400">
                {currentUnit ? currentUnit.title : ''} • Page {currentPage?.pageNumber || 1}
              </p>
            </div>
          </div>

          {/* Controls: Zoom, Bookmark, AI Explain (STRICTLY NO DOWNLOAD BUTTONS) */}
          <div className="flex items-center gap-2">
            {/* Zoom controls */}
            <div className="flex items-center bg-stone-100 rounded-xl p-1 border border-stone-200">
              <button
                onClick={() => setZoomLevel((z) => Math.max(z - 15, 85))}
                className="p-1 rounded-lg hover:bg-white text-stone-600 cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="px-2 text-xs font-mono font-bold text-stone-700">{zoomLevel}%</span>
              <button
                onClick={() => setZoomLevel((z) => Math.min(z + 15, 140))}
                className="p-1 rounded-lg hover:bg-white text-stone-600 cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>

            {/* Bookmark */}
            <button
              onClick={() => setIsBookmarked(!isBookmarked)}
              className={`p-2 rounded-xl border cursor-pointer transition-colors ${
                isBookmarked
                  ? 'bg-amber-50 text-amber-600 border-amber-300'
                  : 'border-stone-200 text-stone-500 hover:bg-stone-100'
              }`}
              title="Bookmark Page"
            >
              <Bookmark className="w-4 h-4" />
            </button>

            {/* Ask AI about Page */}
            <button
              onClick={handleAskAIAboutPage}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100 text-xs font-bold cursor-pointer transition-all shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>{language === 'am' ? 'AI ማብራሪያ' : 'Explain Page with AI'}</span>
            </button>
          </div>
        </div>

        {/* AI EXPLANATION BOX IF OPENED */}
        {aiExplanationText && (
          <div className="p-4 rounded-2xl bg-emerald-50/90 border border-emerald-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                <Bot className="w-4 h-4 text-emerald-600" />
                {language === 'am' ? 'የኑር AI ገጽ ማብራሪያ' : 'NUR AI Page Insight'}
              </span>
              <button
                onClick={() => setAiExplanationText(null)}
                className="text-stone-400 hover:text-stone-700 text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>
            <p className="text-xs sm:text-sm text-emerald-900 leading-relaxed whitespace-pre-wrap">
              {aiExplanationText}
            </p>
          </div>
        )}

        {/* READER MAIN SECURE DOCUMENT CANVAS */}
        <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm p-6 sm:p-10 relative overflow-hidden min-h-[500px] flex flex-col justify-between select-none">
          {/* SECURE DRM WATERMARK OVERLAY (Prevents photography and screen leaks) */}
          <div className="absolute inset-0 pointer-events-none flex flex-wrap items-center justify-center opacity-[0.04] overflow-hidden select-none">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="transform -rotate-12 m-8 text-stone-900 font-mono text-xs">
                NUR AI SECURE VIEWER • {userProfile?.uid || 'STUDENT_SESSION'} • DO NOT DISTRIBUTE
              </div>
            ))}
          </div>

          {/* Book Header info inside page */}
          <div className="relative z-10">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-6 text-xs text-stone-400">
              <span className="font-mono uppercase tracking-widest text-[10px]">
                FDRE MoE Official Digital Curriculum
              </span>
              <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                {language === 'am' ? 'የተጠበቀ ይዘት' : 'Encrypted DRM Protection'}
              </span>
            </div>

            {/* Page Content with dynamic Zoom scaling */}
            <div style={{ fontSize: `${zoomLevel}%` }} className="space-y-4 max-w-3xl leading-relaxed">
              <h2 className="text-lg sm:text-2xl font-black text-stone-900 font-serif-ethiopic">
                {currentPage?.heading || 'Section Overview'}
              </h2>

              <p className="text-stone-700 text-sm sm:text-base leading-relaxed">
                {currentPage?.content}
              </p>

              {/* Key Formulas or Theorems */}
              {currentPage?.keyFormulas && (
                <div className="my-6 p-4 rounded-2xl bg-[#FAF6EC] border border-[#D5C8B4] space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700">
                    {language === 'am' ? 'ቁልፍ ቀመሮችና ህጎች (Key Theorems)' : 'Key Formulas & Laws'}
                  </h4>
                  <div className="space-y-1 font-mono text-xs sm:text-sm text-stone-900">
                    {currentPage.keyFormulas.map((f, i) => (
                      <div key={i} className="py-1 border-b border-stone-200/50 last:border-0">
                        {f}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Reader Footer Navigation */}
          <div className="relative z-10 pt-6 mt-8 border-t border-stone-100 flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<ChevronLeft className="w-4 h-4" />}
              disabled={activePageIndex === 0 && activeUnitIndex === 0}
              onClick={() => {
                if (activePageIndex > 0) {
                  setActivePageIndex((p) => p - 1);
                } else if (activeUnitIndex > 0) {
                  setActiveUnitIndex((u) => u - 1);
                  setActivePageIndex(0);
                }
              }}
            >
              {language === 'am' ? 'ቀዳሚ ገጽ' : 'Previous'}
            </Button>

            <span className="text-xs font-mono text-stone-500 font-bold">
              Page {currentPage?.pageNumber || 1} of {activeReadingBook.totalPages}
            </span>

            <Button
              variant="primary"
              size="sm"
              rightIcon={<ChevronRight className="w-4 h-4" />}
              disabled={
                activeUnitIndex === activeReadingBook.units.length - 1 &&
                activePageIndex === (currentUnit?.pages.length || 1) - 1
              }
              onClick={() => {
                if (currentUnit && activePageIndex < currentUnit.pages.length - 1) {
                  setActivePageIndex((p) => p + 1);
                } else if (activeUnitIndex < activeReadingBook.units.length - 1) {
                  setActiveUnitIndex((u) => u + 1);
                  setActivePageIndex(0);
                }
              }}
            >
              {language === 'am' ? 'ቀጣይ ገጽ' : 'Next'}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // DEFAULT VIEW: BOOKS CATALOG
  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header and Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-stone-900 font-serif-ethiopic">
            {language === 'am'
              ? `የ${grade}ኛ ክፍል የተማሪዎች መጽሐፍት (Books)`
              : `Grade ${grade} In-App Textbooks`}
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            {language === 'am'
              ? 'ደህንነቱ በተጠበቀ የውስጠ-መተግበሪያ አንባቢ አማካኝነት መጽሐፍትን በነፃነት ያንብቡ።'
              : 'Read verified curriculum textbooks inside the secure, offline-ready DRM reader.'}
          </p>
        </div>

        {/* Subject Filter Chips */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar bg-stone-100 p-1 rounded-xl border border-stone-200 text-xs">
          {['all', 'Mathematics', 'Physics', 'Chemistry', 'Biology'].map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedSubjectFilter(filter)}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedSubjectFilter.toLowerCase() === filter.toLowerCase()
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              {filter === 'all' ? (language === 'am' ? 'ሁሉም' : 'All') : filter}
            </button>
          ))}
        </div>
      </div>

      {/* Books Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredBooks.map((book) => (
          <div
            key={book.id}
            className="bg-white rounded-3xl p-5 border border-stone-200/90 shadow-xs flex flex-col justify-between hover:border-emerald-300 hover:shadow-sm transition-all"
          >
            <div>
              {/* Modern Book Cover Card Preview */}
              <div
                className={`h-40 rounded-2xl bg-gradient-to-br ${book.coverColor} p-5 text-white flex flex-col justify-between shadow-inner relative overflow-hidden mb-4`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="px-2 py-0.5 rounded-full bg-black/30 border border-white/20 font-mono text-[10px]">
                    FDRE MoE
                  </span>
                  <span className="flex items-center gap-1 font-bold text-amber-300 text-xs">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Secure DRM
                  </span>
                </div>

                <div>
                  <span className="text-[11px] font-mono tracking-wider opacity-80 uppercase">
                    Grade {book.grade} • {book.subject}
                  </span>
                  <h4 className="text-base font-bold font-serif-ethiopic text-white line-clamp-2 mt-0.5">
                    {language === 'am' ? book.titleAmharic : book.title}
                  </h4>
                </div>
              </div>

              {/* Badges & Progress */}
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-stone-500 font-medium">
                  {book.totalPages} {language === 'am' ? 'ገጾች' : 'Pages'}
                </span>
                <span className="font-mono font-bold text-emerald-700">{book.readProgress}% read</span>
              </div>
              <ProgressBar value={book.readProgress} size="xs" variant="emerald" />
            </div>

            {/* Actions: Continue Reading */}
            <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between">
              <span className="text-xs text-stone-400">
                {language === 'am' ? `ገጽ ${book.currentPage} ላይ ቆመዋል` : `Page ${book.currentPage}`}
              </span>
              <Button
                variant="primary"
                size="sm"
                rightIcon={<BookOpen className="w-3.5 h-3.5" />}
                onClick={() => handleOpenReader(book)}
              >
                {language === 'am' ? 'አንብብ (Read)' : 'Read Inside'}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
