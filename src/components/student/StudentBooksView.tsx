import React, { useState, useEffect, useMemo } from 'react';
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
  CheckCircle2,
  Moon,
  Sun,
  ArrowLeft,
  FolderOpen,
  User,
  Info,
  Clock,
  Play,
} from 'lucide-react';
import { GradeLevel } from '../../types/curriculumEngine';
import {
  LanguageCode,
  ReferenceBook,
  ReferenceBookChapter,
  ReferenceBookSection,
  ReferenceBookProgress,
  ReferenceBookBookmark,
} from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useSubscription } from '../../context/SubscriptionContext';
import { secureBookService } from '../../services/secureBookService';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { ProgressBar } from '../ui/ProgressBar';

interface StudentBooksViewProps {
  grade: GradeLevel;
  language: LanguageCode;
  onOpenAITutorForBook?: (bookTitle: string, pageText: string) => void;
  onBackToDashboard?: () => void;
  onBack?: () => void;
}

type BooksNavStep = 'categories' | 'book_detail' | 'chapter_detail' | 'reading_view';

export const StudentBooksView: React.FC<StudentBooksViewProps> = ({
  grade,
  language,
  onOpenAITutorForBook,
  onBackToDashboard,
}) => {
  const { user, userProfile } = useAuth();
  const { hasLearningAccess, isOwnerSuperAdmin } = useSubscription();
  const currentUserId = user?.uid || userProfile?.uid || 'student_local';

  // Hierarchical Navigation Stack: Categories -> Book -> Chapter/Section -> Reading View
  const [navStep, setNavStep] = useState<BooksNavStep>('categories');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedGradeFilter, setSelectedGradeFilter] = useState<number | 'all'>(() => {
    return isOwnerSuperAdmin ? 'all' : grade;
  });
  const [searchQuery, setSearchQuery] = useState('');

  // Firestore / Service Data
  const [books, setBooks] = useState<ReferenceBook[]>([]);
  const [chapters, setChapters] = useState<ReferenceBookChapter[]>([]);
  const [sections, setSections] = useState<ReferenceBookSection[]>([]);
  const [progressMap, setProgressMap] = useState<Record<string, ReferenceBookProgress>>({});
  const [bookmarks, setBookmarks] = useState<ReferenceBookBookmark[]>([]);
  const [loading, setLoading] = useState(true);

  // Selected Entities in Drill-down
  const [selectedBook, setSelectedBook] = useState<ReferenceBook | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<ReferenceBookChapter | null>(null);
  const [selectedSectionIndex, setSelectedSectionIndex] = useState<number>(0);

  // Reader Controls: Font size, Light/Dark reading mode, in-content search, AI insight
  const [fontSizePercent, setFontSizePercent] = useState<number>(105);
  const [readerDarkMode, setReaderDarkMode] = useState<boolean>(false);
  const [inBookSearchQuery, setInBookSearchQuery] = useState<string>('');
  const [aiExplanationText, setAiExplanationText] = useState<string | null>(null);

  useEffect(() => {
    loadReferenceBooksData();
  }, [currentUserId, isOwnerSuperAdmin]);

  // Listen to browser/Android system Back button inside Reference Books drill-down
  useEffect(() => {
    const handlePopState = () => {
      if (navStep === 'reading_view') {
        setNavStep('chapter_detail');
      } else if (navStep === 'chapter_detail') {
        setNavStep('book_detail');
      } else if (navStep === 'book_detail') {
        setNavStep('categories');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [navStep]);

  const pushNavStep = (next: BooksNavStep) => {
    try {
      window.history.pushState({ booksStep: next }, '');
    } catch {}
    setNavStep(next);
  };

  const handleStepBack = () => {
    if (navStep === 'reading_view') {
      setNavStep('chapter_detail');
      setAiExplanationText(null);
    } else if (navStep === 'chapter_detail') {
      setNavStep('book_detail');
    } else if (navStep === 'book_detail') {
      setNavStep('categories');
      setSelectedBook(null);
    } else if (onBackToDashboard) {
      onBackToDashboard();
    }
  };

  const loadReferenceBooksData = async () => {
    setLoading(true);
    try {
      const [loadedBooks, userProg, userBms] = await Promise.all([
        secureBookService.getReferenceBooks({ isAdmin: isOwnerSuperAdmin }),
        secureBookService.getUserBookProgress(currentUserId),
        secureBookService.getUserBookmarks(currentUserId),
      ]);
      setBooks(loadedBooks);
      setProgressMap(userProg);
      setBookmarks(userBms);
    } finally {
      setLoading(false);
    }
  };

  const categories = useMemo(() => {
    const set = new Set<string>();
    books.forEach((b) => {
      if (b.category) set.add(b.category);
    });
    return ['all', ...Array.from(set)];
  }, [books]);

  const filteredBooks = useMemo(() => {
    return books.filter((b) => {
      if (!isOwnerSuperAdmin && (b.status !== 'PUBLISHED' || b.accessLevel === 'ADMIN_ONLY')) {
        return false;
      }
      if (selectedCategory !== 'all' && b.category !== selectedCategory) {
        return false;
      }
      if (selectedGradeFilter !== 'all' && b.gradeId !== selectedGradeFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = b.title.toLowerCase().includes(q) || (b.titleAmharic || '').toLowerCase().includes(q);
        const matchAuthor = b.author.toLowerCase().includes(q);
        const matchSubj = b.subjectName.toLowerCase().includes(q) || b.description.toLowerCase().includes(q);
        if (!matchTitle && !matchAuthor && !matchSubj) return false;
      }
      return true;
    });
  }, [books, selectedCategory, selectedGradeFilter, searchQuery, isOwnerSuperAdmin]);

  // Open a specific book -> load its chapters & sections
  const handleSelectBook = async (book: ReferenceBook) => {
    if (book.accessLevel === 'PREMIUM' && !hasLearningAccess && !isOwnerSuperAdmin) {
      return;
    }
    setSelectedBook(book);
    const [chList, secList] = await Promise.all([
      secureBookService.getBookChapters(book.id),
      secureBookService.getBookSections(book.id),
    ]);
    setChapters(chList);
    setSections(secList);
    pushNavStep('book_detail');
  };

  // Open a chapter -> view sections list
  const handleSelectChapter = (chapter: ReferenceBookChapter) => {
    setSelectedChapter(chapter);
    setSelectedSectionIndex(0);
    pushNavStep('chapter_detail');
  };

  // Open reading view for a specific section and save progress
  const handleOpenSectionReader = async (chapter: ReferenceBookChapter, secIdx: number) => {
    if (!selectedBook) return;
    setSelectedChapter(chapter);
    setSelectedSectionIndex(secIdx);
    setAiExplanationText(null);
    secureBookService.enableNativeFlagSecure(true);
    pushNavStep('reading_view');

    const chapterSections = sections.filter((s) => s.chapterId === chapter.id);
    const targetSec = chapterSections[secIdx];
    if (targetSec) {
      const totalSecs = Math.max(sections.length, 1);
      const globalIdx = sections.findIndex((s) => s.id === targetSec.id);
      const pct = Math.min(100, Math.max(10, Math.round(((globalIdx + 1) / totalSecs) * 100)));
      const saved = await secureBookService.saveUserBookProgress({
        userId: currentUserId,
        bookId: selectedBook.id,
        chapterId: chapter.id,
        sectionId: targetSec.id,
        progressPercent: pct,
        lastReadPosition: `Chapter ${chapter.chapterNumber} • Section ${targetSec.sectionNumber}: ${targetSec.title}`,
      });
      setProgressMap((prev) => ({ ...prev, [selectedBook.id]: saved }));
    }
  };

  // Continue reading from last-read position
  const handleContinueReadingBook = async (book: ReferenceBook) => {
    const prog = progressMap[book.id];
    const [chList, secList] = await Promise.all([
      secureBookService.getBookChapters(book.id),
      secureBookService.getBookSections(book.id),
    ]);
    setSelectedBook(book);
    setChapters(chList);
    setSections(secList);

    if (prog && chList.length > 0) {
      const targetCh = chList.find((c) => c.id === prog.chapterId) || chList[0];
      const chSecs = secList.filter((s) => s.chapterId === targetCh.id);
      const secIdx = Math.max(0, chSecs.findIndex((s) => s.id === prog.sectionId));
      setSelectedChapter(targetCh);
      setSelectedSectionIndex(secIdx >= 0 ? secIdx : 0);
      pushNavStep('reading_view');
    } else if (chList.length > 0) {
      setSelectedChapter(chList[0]);
      setSelectedSectionIndex(0);
      pushNavStep('reading_view');
    } else {
      pushNavStep('book_detail');
    }
  };

  const currentChapterSections = useMemo(() => {
    if (!selectedChapter) return [];
    return sections.filter((s) => s.chapterId === selectedChapter.id);
  }, [sections, selectedChapter]);

  const currentSection = currentChapterSections[selectedSectionIndex] || null;

  const isCurrentSectionBookmarked = useMemo(() => {
    if (!selectedBook || !currentSection) return false;
    return bookmarks.some((b) => b.bookId === selectedBook.id && b.sectionId === currentSection.id);
  }, [bookmarks, selectedBook, currentSection]);

  const handleToggleBookmark = async () => {
    if (!selectedBook || !selectedChapter || !currentSection) return;
    const res = await secureBookService.toggleBookmark({
      userId: currentUserId,
      bookId: selectedBook.id,
      bookTitle: selectedBook.title,
      chapterId: selectedChapter.id,
      chapterTitle: selectedChapter.title,
      sectionId: currentSection.id,
      sectionTitle: currentSection.title,
    });
    setBookmarks(res.bookmarks);
  };

  const handleAskAIAboutSection = () => {
    if (!selectedBook || !currentSection) return;
    const bodyText = currentSection.content.join(' ');
    setAiExplanationText(
      language === 'am'
        ? `የኑር AI ማብራሪያ (${currentSection.sectionNumber} - ${currentSection.title}):\n\nይህ የማጣቀሻ ክፍል ለክፍል ${selectedBook.gradeId} ተማሪዎች ቁልፍ ፅንሰ-ሀሳቦችንና ቀመሮችን ይዟል። ዋና ጭብጥ፡ ${bodyText.slice(0, 180)}...`
        : `NUR AI Reference Synthesis (${currentSection.sectionNumber} - ${currentSection.title}):\n\nThis section highlights essential Grade ${selectedBook.gradeId} concepts and exam-relevant principles: ${bodyText.slice(0, 200)}...`
    );
  };

  // ============================================================================
  // VIEW 4: IN-APP READING VIEW (Dashboard -> Reference Books -> Book -> Chapter -> Section -> Reading View)
  // ============================================================================
  if (navStep === 'reading_view' && selectedBook && selectedChapter) {
    const filteredContentParagraphs = currentSection
      ? currentSection.content.filter((p) =>
          !inBookSearchQuery.trim()
            ? true
            : p.toLowerCase().includes(inBookSearchQuery.toLowerCase())
        )
      : [];

    return (
      <div className="space-y-4 max-w-5xl mx-auto pb-12">
        {/* TOP NAVIGATION & READER CONTROLS BAR (Strictly No Download or External Share Buttons) */}
        <div className="bg-white rounded-3xl p-4 border border-stone-200/90 shadow-xs flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={handleStepBack}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-stone-200 text-xs font-bold text-stone-700 hover:bg-stone-100 cursor-pointer transition-colors shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{language === 'am' ? 'ወደ ክፍሎች ተመለስ' : 'Back to Sections'}</span>
            </button>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {selectedBook.accessLevel}
                </span>
                <h3 className="text-xs sm:text-sm font-bold text-stone-900 truncate font-serif-ethiopic">
                  {language === 'am' && selectedBook.titleAmharic ? selectedBook.titleAmharic : selectedBook.title}
                </h3>
              </div>
              <p className="text-[11px] text-stone-500 truncate mt-0.5">
                {selectedChapter.title} • {currentSection ? `Section ${currentSection.sectionNumber}: ${currentSection.title}` : ''}
              </p>
            </div>
          </div>

          {/* Reader Toolbar: In-Book Search, Font Size, Light/Dark Mode, Bookmark, AI */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Search inside approved content */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={inBookSearchQuery}
                onChange={(e) => setInBookSearchQuery(e.target.value)}
                placeholder={language === 'am' ? 'በይዘቱ ውስጥ ፈልግ...' : 'Search in section...'}
                className="pl-8 pr-3 py-1.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-800 w-36 sm:w-44 focus:outline-none focus:border-emerald-600"
              />
            </div>

            {/* Font-size control */}
            <div className="flex items-center bg-stone-100 rounded-xl p-1 border border-stone-200">
              <button
                onClick={() => setFontSizePercent((z) => Math.max(z - 10, 85))}
                className="p-1 rounded-lg hover:bg-white text-stone-700 cursor-pointer"
                title="Decrease Font Size"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="px-2 text-[11px] font-mono font-bold text-stone-700">{fontSizePercent}%</span>
              <button
                onClick={() => setFontSizePercent((z) => Math.min(z + 10, 150))}
                className="p-1 rounded-lg hover:bg-white text-stone-700 cursor-pointer"
                title="Increase Font Size"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Light / Dark Reading Mode Toggle */}
            <button
              onClick={() => setReaderDarkMode(!readerDarkMode)}
              className={`p-2 rounded-xl border cursor-pointer transition-colors ${
                readerDarkMode
                  ? 'bg-slate-900 text-amber-300 border-slate-700'
                  : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
              }`}
              title={readerDarkMode ? 'Switch to Light Reading Mode' : 'Switch to Dark Reading Mode'}
            >
              {readerDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Bookmark Button */}
            <button
              onClick={handleToggleBookmark}
              className={`px-2.5 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                isCurrentSectionBookmarked
                  ? 'bg-amber-50 text-amber-700 border-amber-300'
                  : 'border-stone-200 text-stone-600 hover:bg-stone-100'
              }`}
              title="Bookmark Section"
            >
              <Bookmark className={`w-3.5 h-3.5 ${isCurrentSectionBookmarked ? 'fill-amber-500 text-amber-600' : ''}`} />
              <span className="hidden sm:inline">{isCurrentSectionBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
            </button>

            {/* AI Insight Button */}
            <button
              onClick={handleAskAIAboutSection}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100 text-xs font-bold cursor-pointer transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>{language === 'am' ? 'AI ማብራሪያ' : 'AI Insight'}</span>
            </button>
          </div>
        </div>

        {/* AI EXPLANATION PANEL */}
        {aiExplanationText && (
          <div className="p-4 rounded-2xl bg-emerald-50/95 border border-emerald-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                <Bot className="w-4 h-4 text-emerald-600" />
                {language === 'am' ? 'የኑር AI ማጣቀሻ ማብራሪያ' : 'NUR AI Reference Insight'}
              </span>
              <div className="flex items-center gap-2">
                {onOpenAITutorForBook && currentSection && (
                  <button
                    onClick={() => onOpenAITutorForBook(selectedBook.title, currentSection.content.join('\n'))}
                    className="text-[11px] font-bold text-emerald-700 hover:underline cursor-pointer"
                  >
                    {language === 'am' ? 'ከ AI አስጠኚ ጋር ተወያይ →' : 'Open in Full AI Tutor →'}
                  </button>
                )}
                <button
                  onClick={() => setAiExplanationText(null)}
                  className="text-stone-400 hover:text-stone-700 text-xs cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-emerald-900 leading-relaxed whitespace-pre-wrap">
              {aiExplanationText}
            </p>
          </div>
        )}

        {/* PROTECTED READING VIEWPORT */}
        <div
          onContextMenu={(e) => e.preventDefault()}
          className={`rounded-3xl border shadow-sm p-6 sm:p-10 relative overflow-hidden min-h-[520px] flex flex-col justify-between select-none transition-colors ${
            readerDarkMode
              ? 'bg-slate-950 border-slate-800 text-slate-100'
              : 'bg-white border-stone-200/90 text-stone-900'
          }`}
        >
          {/* Dynamic DRM Watermark */}
          <div className="absolute inset-0 pointer-events-none flex flex-wrap items-center justify-center opacity-[0.035] overflow-hidden select-none">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="transform -rotate-12 m-8 font-mono text-xs">
                NUR AI REFERENCE READER • {currentUserId} • IN-APP VIEW ONLY
              </div>
            ))}
          </div>

          <div className="relative z-10 space-y-6">
            {/* Source & Content Protection Header */}
            <div
              className={`flex flex-wrap items-center justify-between gap-2 pb-4 border-b text-xs ${
                readerDarkMode ? 'border-slate-800 text-slate-400' : 'border-stone-100 text-stone-500'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="font-mono uppercase tracking-wider text-[10px]">
                  {selectedBook.source}
                </span>
              </div>
              <span className="flex items-center gap-1 text-emerald-600 font-semibold text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5" />
                {language === 'am' ? 'በመተግበሪያው ውስጥ ብቻ የሚነበብ (Protected View)' : 'In-App Protected Reference'}
              </span>
            </div>

            {currentSection ? (
              <div style={{ fontSize: `${fontSizePercent}%` }} className="space-y-5 max-w-3xl leading-relaxed">
                <div>
                  <span className="text-xs font-mono font-bold text-emerald-600 uppercase">
                    Section {currentSection.sectionNumber}
                  </span>
                  <h2
                    className={`text-xl sm:text-2xl font-black font-serif-ethiopic mt-1 ${
                      readerDarkMode ? 'text-white' : 'text-stone-900'
                    }`}
                  >
                    {currentSection.title}
                  </h2>
                </div>

                {/* Approved Section Paragraphs */}
                <div className="space-y-4">
                  {filteredContentParagraphs.map((para, idx) => (
                    <p
                      key={idx}
                      className={`leading-relaxed ${
                        readerDarkMode ? 'text-slate-200' : 'text-stone-700'
                      }`}
                    >
                      {para}
                    </p>
                  ))}
                </div>

                {/* Key Formulas & Rules */}
                {currentSection.keyFormulas && currentSection.keyFormulas.length > 0 && (
                  <div
                    className={`my-6 p-5 rounded-2xl border space-y-2.5 ${
                      readerDarkMode
                        ? 'bg-slate-900/90 border-slate-800 text-emerald-300'
                        : 'bg-[#FAF6EC] border-[#D5C8B4] text-stone-900'
                    }`}
                  >
                    <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                      {language === 'am' ? 'ቁልፍ ቀመሮችና ህጎች (Key Formulas & Laws)' : 'Key Formulas & Principles'}
                    </h4>
                    <div className="space-y-1.5 font-mono text-xs sm:text-sm">
                      {currentSection.keyFormulas.map((f, i) => (
                        <div
                          key={i}
                          className={`py-1.5 border-b last:border-0 ${
                            readerDarkMode ? 'border-slate-800' : 'border-stone-200/60'
                          }`}
                        >
                          {f}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Worked Examples */}
                {currentSection.workedExamples && currentSection.workedExamples.length > 0 && (
                  <div className="space-y-3 pt-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                      {language === 'am' ? 'የተሰሩ ምሳሌዎች (Worked Examples)' : 'Worked Examples'}
                    </h4>
                    {currentSection.workedExamples.map((ex, i) => (
                      <div
                        key={i}
                        className={`p-4 rounded-2xl border space-y-2 text-xs sm:text-sm ${
                          readerDarkMode
                            ? 'bg-slate-900/60 border-slate-800'
                            : 'bg-emerald-50/50 border-emerald-200/80'
                        }`}
                      >
                        <p className="font-bold">Q: {ex.question}</p>
                        <p className={readerDarkMode ? 'text-slate-300' : 'text-stone-700'}>
                          <strong>Solution:</strong> {ex.solution}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-stone-400">No section content available.</p>
            )}
          </div>

          {/* Footer: Section Navigation & Source/License Preservation */}
          <div
            className={`relative z-10 pt-6 mt-8 border-t space-y-3 ${
              readerDarkMode ? 'border-slate-800' : 'border-stone-100'
            }`}
          >
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                leftIcon={<ChevronLeft className="w-4 h-4" />}
                disabled={selectedSectionIndex === 0}
                onClick={() => handleOpenSectionReader(selectedChapter, selectedSectionIndex - 1)}
              >
                {language === 'am' ? 'ቀዳሚ ክፍል' : 'Previous Section'}
              </Button>

              <span className="text-xs font-mono text-stone-500 font-bold">
                Section {selectedSectionIndex + 1} of { Math.max(currentChapterSections.length, 1) }
              </span>

              <Button
                variant="primary"
                size="sm"
                rightIcon={<ChevronRight className="w-4 h-4" />}
                disabled={selectedSectionIndex >= currentChapterSections.length - 1}
                onClick={() => handleOpenSectionReader(selectedChapter, selectedSectionIndex + 1)}
              >
                {language === 'am' ? 'ቀጣይ ክፍል' : 'Next Section'}
              </Button>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-stone-400 pt-2">
              <span>Author: {selectedBook.author}</span>
              <span>License: {selectedBook.licenseInfo}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // VIEW 3: CHAPTER SECTIONS VIEW (Book -> Chapter -> Sections)
  // ============================================================================
  if (navStep === 'chapter_detail' && selectedBook && selectedChapter) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto pb-12">
        <div className="flex items-center justify-between">
          <button
            onClick={handleStepBack}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-stone-200 text-xs font-bold text-stone-700 hover:bg-stone-100 cursor-pointer shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{language === 'am' ? 'ወደ ምዕራፎች ዝርዝር ተመለስ' : 'Back to Chapters'}</span>
          </button>
          <Badge variant="success" size="sm">
            Chapter {selectedChapter.chapterNumber}
          </Badge>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-xs space-y-2">
          <span className="text-xs font-mono font-bold text-emerald-700 uppercase">
            {selectedBook.title}
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-stone-900 font-serif-ethiopic">
            {selectedChapter.title}
          </h2>
          <p className="text-xs sm:text-sm text-stone-600">{selectedChapter.summary}</p>
        </div>

        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 px-1">
            {language === 'am' ? 'የምዕራፉ ንዑስ ክፍሎች (Sections)' : 'Sections in this Chapter'}
          </h3>
          {currentChapterSections.length === 0 ? (
            <div className="p-8 rounded-3xl bg-white border border-stone-200 text-center text-xs text-stone-500">
              No sections found for this chapter.
            </div>
          ) : (
            currentChapterSections.map((sec, idx) => {
              const isBm = bookmarks.some((b) => b.sectionId === sec.id);
              return (
                <div
                  key={sec.id}
                  onClick={() => handleOpenSectionReader(selectedChapter, idx)}
                  className="bg-white rounded-2xl p-5 border border-stone-200/90 hover:border-emerald-400 shadow-2xs flex items-center justify-between gap-4 cursor-pointer transition-all group"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono text-[11px] font-bold">
                        Section {sec.sectionNumber}
                      </span>
                      {isBm && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600">
                          <Bookmark className="w-3 h-3 fill-amber-500" /> Bookmarked
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm sm:text-base font-bold text-stone-900 group-hover:text-emerald-800 font-serif-ethiopic">
                      {sec.title}
                    </h4>
                    <p className="text-xs text-stone-500 line-clamp-2">
                      {sec.content[0]}
                    </p>
                  </div>
                  <Button variant="primary" size="sm" rightIcon={<BookOpen className="w-3.5 h-3.5" />}>
                    {language === 'am' ? 'አንብብ' : 'Read'}
                  </Button>
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  }

  // ============================================================================
  // VIEW 2: BOOK DETAIL & CHAPTER LIST (Categories -> Book -> Chapters)
  // ============================================================================
  if (navStep === 'book_detail' && selectedBook) {
    const bookProg = progressMap[selectedBook.id];

    return (
      <div className="space-y-6 max-w-5xl mx-auto pb-12">
        {/* Back Button */}
        <div className="flex items-center justify-between">
          <button
            onClick={handleStepBack}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-stone-200 text-xs font-bold text-stone-700 hover:bg-stone-100 cursor-pointer shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{language === 'am' ? 'ወደ ማጣቀሻ መጽሐፍት ተመለስ' : 'Back to Reference Books'}</span>
          </button>
          <Badge variant="neutral" size="sm">
            Grade {selectedBook.gradeId} • {selectedBook.category}
          </Badge>
        </div>

        {/* Book Metadata Hero Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-xs flex flex-col md:flex-row gap-6">
          <div
            className={`w-full md:w-56 h-64 rounded-2xl bg-gradient-to-br ${
              selectedBook.coverGradient || 'from-emerald-700 to-teal-950'
            } p-5 text-white flex flex-col justify-between shrink-0 shadow-md`}
          >
            <div className="flex items-center justify-between text-xs">
              <span className="px-2.5 py-0.5 rounded-full bg-black/30 border border-white/20 font-mono text-[10px]">
                Grade {selectedBook.gradeId}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-400/20 border border-emerald-300/30 text-emerald-200 font-mono text-[10px] font-bold">
                {selectedBook.accessLevel}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest opacity-80 block">
                {selectedBook.subjectName}
              </span>
              <h3 className="text-base font-black font-serif-ethiopic leading-snug mt-1">
                {language === 'am' && selectedBook.titleAmharic ? selectedBook.titleAmharic : selectedBook.title}
              </h3>
              <p className="text-[11px] opacity-85 mt-2">{selectedBook.author}</p>
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="success" size="xs">
                  {selectedBook.subjectName}
                </Badge>
                <Badge variant="neutral" size="xs">
                  {selectedBook.category}
                </Badge>
                <span className="text-xs text-stone-500 flex items-center gap-1">
                  <User className="w-3.5 h-3.5" /> {selectedBook.author}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-stone-900 font-serif-ethiopic">
                {language === 'am' && selectedBook.titleAmharic ? selectedBook.titleAmharic : selectedBook.title}
              </h2>

              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                {selectedBook.description}
              </p>

              {/* Source & License Info */}
              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-stone-800">
                  <Info className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{language === 'am' ? 'ምንጭ እና ፈቃድ (Source & License)' : 'Source & License Information'}</span>
                </div>
                <p className="text-stone-600 text-[11px]">
                  <strong>Source:</strong> {selectedBook.source}
                </p>
                <p className="text-stone-500 text-[11px]">
                  <strong>License:</strong> {selectedBook.licenseInfo}
                </p>
              </div>
            </div>

            {/* Reading Progress & Continue Reading Action */}
            <div className="pt-4 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-bold text-stone-700">
                    {language === 'am' ? 'የንባብ ሂደት (Reading Progress)' : 'Reading Progress'}
                  </span>
                  <span className="font-mono font-bold text-emerald-700">
                    {bookProg?.progressPercent || 0}%
                  </span>
                </div>
                <ProgressBar value={bookProg?.progressPercent || 0} size="xs" variant="emerald" />
                {bookProg?.lastReadPosition && (
                  <p className="text-[11px] text-stone-500 mt-1 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-emerald-600" />
                    <span>Last read: {bookProg.lastReadPosition}</span>
                  </p>
                )}
              </div>

              <Button
                variant="primary"
                size="md"
                leftIcon={<Play className="w-4 h-4" />}
                onClick={() => handleContinueReadingBook(selectedBook)}
              >
                {bookProg
                  ? language === 'am'
                    ? 'ንባብ ቀጥል (Continue Reading)'
                    : 'Continue Reading'
                  : language === 'am'
                  ? 'ማንበብ ጀምር (Start Reading)'
                  : 'Start Reading'}
              </Button>
            </div>
          </div>
        </div>

        {/* Chapters List */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-stone-900 font-serif-ethiopic px-1">
            {language === 'am' ? 'የመጽሐፉ ምዕራፎች (Chapters)' : 'Book Chapters'} ({chapters.length})
          </h3>
          {chapters.map((ch) => {
            const chSecs = sections.filter((s) => s.chapterId === ch.id);
            return (
              <div
                key={ch.id}
                onClick={() => handleSelectChapter(ch)}
                className="bg-white rounded-2xl p-5 border border-stone-200/90 hover:border-emerald-400 shadow-2xs flex items-center justify-between gap-4 cursor-pointer transition-all group"
              >
                <div className="space-y-1">
                  <span className="text-[11px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                    Chapter {ch.chapterNumber} • {chSecs.length} Sections
                  </span>
                  <h4 className="text-base font-bold text-stone-900 group-hover:text-emerald-800 font-serif-ethiopic mt-1">
                    {ch.title}
                  </h4>
                  <p className="text-xs text-stone-500">{ch.summary}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-stone-400 group-hover:text-emerald-700 group-hover:translate-x-1 transition-all shrink-0" />
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ============================================================================
  // VIEW 1: REFERENCE BOOKS HOME & CATEGORIES (Dashboard -> Reference Books -> Categories)
  // ============================================================================
  const booksInProgress = books.filter((b) => progressMap[b.id]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Top Header with Back Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          {onBackToDashboard && (
            <button
              onClick={onBackToDashboard}
              className="mt-1 p-2 rounded-xl bg-white border border-stone-200 text-stone-700 hover:bg-stone-100 cursor-pointer shadow-2xs"
              title="Back to Dashboard"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-emerald-100 text-emerald-900">
                REFERENCE BOOKS LIBRARY
              </span>
              <span className="text-xs text-stone-500 font-mono">Grades 9–12</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-stone-900 font-serif-ethiopic mt-1">
              {language === 'am'
                ? 'የማጣቀሻ መጽሐፍት ክፍል (Reference Books)'
                : 'Approved Reference Books & Study Guides'}
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
              {language === 'am'
                ? 'በመተግበሪያው ውስጥ በቀጥታ የሚነበቡ የክፍል 9-12 የተፈቀዱ ማጣቀሻ መጽሐፍት።'
                : 'Read approved Ethiopian Grade 9–12 reference books directly inside the secure application reader.'}
            </p>
          </div>
        </div>

        {/* Grade Filter: Admin can toggle, students are locked */}
        {isOwnerSuperAdmin ? (
          <div className="flex items-center gap-1 bg-white p-1 rounded-2xl border border-stone-200 text-xs shadow-2xs">
            <span className="text-[10px] font-bold text-amber-900 px-2">👑 Admin:</span>
            {(['all', 9, 10, 11, 12] as (number | 'all')[]).map((g) => (
              <button
                key={g}
                onClick={() => setSelectedGradeFilter(g)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                  selectedGradeFilter === g
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {g === 'all' ? (language === 'am' ? 'ሁሉም' : 'All Grades') : `G${g}`}
              </button>
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-2xl border border-stone-200 text-xs font-bold text-stone-900 shadow-2xs font-serif-ethiopic">
            <BookOpen className="w-4 h-4 text-emerald-700" />
            <span>{language === 'am' ? `ክፍል ${grade}` : `Grade ${grade}`}</span>
            <span className="text-[10px] text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded-full font-bold">
              🔒 {language === 'am' ? 'የተቆለፈ' : 'Locked'}
            </span>
          </div>
        )}
      </div>

      {/* Search & Categories Strip */}
      <div className="bg-white rounded-3xl p-4 border border-stone-200/90 shadow-xs space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              language === 'am'
                ? 'መጽሐፍ በርዕስ፣ በደራሲ ወይም በትምህርት ዓይነት ይፈልጉ...'
                : 'Search reference books by title, author, or subject...'
            }
            className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-2xl text-xs sm:text-sm focus:outline-none focus:border-emerald-600"
          />
        </div>

        {/* Categories Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
          <span className="text-[11px] font-bold text-stone-400 uppercase flex items-center gap-1 shrink-0">
            <FolderOpen className="w-3.5 h-3.5" /> Categories:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-emerald-50 text-emerald-900 border border-emerald-300'
                  : 'bg-stone-50 text-stone-600 border border-stone-200/80 hover:bg-stone-100'
              }`}
            >
              {cat === 'all' ? (language === 'am' ? 'ሁሉም ምድቦች (All Categories)' : 'All Categories') : cat}
            </button>
          ))}
        </div>
      </div>

      {/* CONTINUE READING & SAVED BOOKMARKS STRIP */}
      {(booksInProgress.length > 0 || bookmarks.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {booksInProgress.length > 0 && (
            <div className="bg-white rounded-3xl p-5 border border-emerald-200/90 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-emerald-600" />
                  {language === 'am' ? 'ንባብ ይቀጥሉ (Continue Reading)' : 'Continue Reading'}
                </span>
                <span className="text-[11px] font-mono text-stone-400">{booksInProgress.length} active</span>
              </div>
              {booksInProgress.slice(0, 2).map((b) => {
                const prog = progressMap[b.id];
                return (
                  <div
                    key={b.id}
                    onClick={() => handleContinueReadingBook(b)}
                    className="p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-200/70 flex items-center justify-between gap-3 cursor-pointer hover:bg-emerald-50 transition-colors"
                  >
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-stone-900 truncate font-serif-ethiopic">
                        {language === 'am' && b.titleAmharic ? b.titleAmharic : b.title}
                      </h4>
                      <p className="text-[11px] text-stone-500 truncate mt-0.5">
                        {prog?.lastReadPosition}
                      </p>
                    </div>
                    <span className="px-2.5 py-1 rounded-xl bg-emerald-700 text-white font-mono text-xs font-bold shrink-0">
                      {prog?.progressPercent || 15}% →
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {bookmarks.length > 0 && (
            <div className="bg-white rounded-3xl p-5 border border-amber-200/90 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                  <Bookmark className="w-4 h-4 text-amber-600 fill-amber-500" />
                  {language === 'am' ? 'የተመዘገቡ ዕልባቶች (Saved Bookmarks)' : 'Your Reference Bookmarks'}
                </span>
                <span className="text-[11px] font-mono text-stone-400">{bookmarks.length} saved</span>
              </div>
              <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                {bookmarks.slice(0, 3).map((bm) => {
                  const book = books.find((bk) => bk.id === bm.bookId);
                  return (
                    <div
                      key={bm.id}
                      onClick={() => book && handleContinueReadingBook(book)}
                      className="p-3 rounded-2xl bg-amber-50/40 border border-amber-200/60 flex items-center justify-between gap-3 cursor-pointer hover:bg-amber-50 transition-colors text-xs"
                    >
                      <div className="min-w-0">
                        <p className="font-bold text-stone-900 truncate">{bm.sectionTitle}</p>
                        <p className="text-[11px] text-stone-500 truncate">
                          {bm.bookTitle} • {bm.chapterTitle}
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-amber-700 shrink-0" />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* REFERENCE BOOKS CATALOG GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredBooks.map((book) => {
          const prog = progressMap[book.id];
          const isLocked = book.accessLevel === 'PREMIUM' && !hasLearningAccess && !isOwnerSuperAdmin;

          return (
            <div
              key={book.id}
              className="bg-white rounded-3xl p-5 border border-stone-200/90 shadow-xs flex flex-col justify-between hover:border-emerald-300 hover:shadow-md transition-all"
            >
              <div>
                {/* Book Cover */}
                <div
                  onClick={() => handleSelectBook(book)}
                  className={`h-44 rounded-2xl bg-gradient-to-br ${
                    book.coverGradient || 'from-emerald-700 to-teal-950'
                  } p-5 text-white flex flex-col justify-between shadow-inner relative overflow-hidden mb-4 cursor-pointer`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="px-2.5 py-0.5 rounded-full bg-black/30 border border-white/20 font-mono text-[10px]">
                      Grade {book.gradeId} • {book.subjectName}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-bold flex items-center gap-1 ${
                        book.accessLevel === 'PREMIUM'
                          ? 'bg-amber-400/20 text-amber-200 border border-amber-300/40'
                          : 'bg-emerald-400/20 text-emerald-200 border border-emerald-300/40'
                      }`}
                    >
                      {isLocked ? <Lock className="w-3 h-3" /> : <ShieldCheck className="w-3 h-3" />}
                      {book.accessLevel}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider opacity-80 block">
                      {book.category}
                    </span>
                    <h4 className="text-base font-bold font-serif-ethiopic text-white line-clamp-2 mt-0.5">
                      {language === 'am' && book.titleAmharic ? book.titleAmharic : book.title}
                    </h4>
                    <p className="text-[11px] opacity-85 truncate mt-1">{book.author}</p>
                  </div>
                </div>

                {/* Description & Source */}
                <p className="text-xs text-stone-600 line-clamp-2 mb-3 leading-relaxed">
                  {book.description}
                </p>

                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-[11px] text-stone-500 truncate max-w-[180px]" title={book.source}>
                    {book.source}
                  </span>
                  <span className="font-mono font-bold text-emerald-700">
                    {prog?.progressPercent || 0}% read
                  </span>
                </div>
                <ProgressBar value={prog?.progressPercent || 0} size="xs" variant="emerald" />
              </div>

              {/* Action Footer */}
              <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between gap-2">
                <span className="text-[11px] text-stone-500 truncate">
                  {prog?.lastReadPosition
                    ? prog.lastReadPosition
                    : language === 'am'
                    ? 'በመተግበሪያው ውስጥ አንብብ'
                    : 'In-App Protected Reader'}
                </span>
                <Button
                  variant={isLocked ? 'outline' : 'primary'}
                  size="sm"
                  rightIcon={isLocked ? <Lock className="w-3.5 h-3.5" /> : <BookOpen className="w-3.5 h-3.5" />}
                  onClick={() => handleSelectBook(book)}
                >
                  {isLocked
                    ? 'Premium Only'
                    : prog
                    ? language === 'am'
                      ? 'ቀጥል (Continue)'
                      : 'Continue'
                    : language === 'am'
                    ? 'አንብብ (Read)'
                    : 'Open Book'}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
