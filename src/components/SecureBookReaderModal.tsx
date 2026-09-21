import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Search,
  BookOpen,
  Shield,
  ShieldCheck,
  Lock,
  Layers,
  ListOrdered,
  Maximize2,
  Minimize2,
  AlertTriangle,
  Info,
  CheckCircle2,
  Bookmark,
  EyeOff,
} from 'lucide-react';
import { SubjectTextbook, SupplementaryBook, Grade } from '../types';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { secureBookService, SecureBookAccessResponse } from '../services/secureBookService';

interface SecureBookReaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  textbook?: SubjectTextbook | null;
  supplementaryBook?: SupplementaryBook | null;
  initialUnitNumber?: number;
  initialChapterIndex?: number;
  title?: string;
  subtitle?: string;
  badge?: string;
  accentColor?: string;
}

export const SecureBookReaderModal: React.FC<SecureBookReaderModalProps> = ({
  isOpen,
  onClose,
  textbook,
  supplementaryBook,
  initialUnitNumber = 1,
  initialChapterIndex = 0,
  title,
  subtitle,
  badge = 'የኢ.ፌ.ዲ.ሪ ትምህርት ሚኒስቴር የተጠበቀ ዲጂታል መጽሐፍ',
  accentColor = '#2E6B4A',
}) => {
  const { user, userProfile } = useAuth();
  const { t, language } = useLanguage();

  // Navigation state
  const [activeUnitNumber, setActiveUnitNumber] = useState<number>(initialUnitNumber);
  const [activeChapterIndex, setActiveChapterIndex] = useState<number>(initialChapterIndex);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [jumpPageInput, setJumpPageInput] = useState<string>('1');
  const [isTocOpen, setIsTocOpen] = useState<boolean>(false);

  // Zoom state
  const [zoomLevel, setZoomLevel] = useState<number>(100);

  // Search state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [searchResultsCount, setSearchResultsCount] = useState<number>(0);

  // Security / DRM state
  const [securityStatus, setSecurityStatus] = useState<SecureBookAccessResponse | null>(null);
  const [isScreenBlurred, setIsScreenBlurred] = useState<boolean>(false);
  const [securityWarning, setSecurityWarning] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const readerContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Synchronize initial unit or chapter when modal opens
  useEffect(() => {
    if (isOpen) {
      setActiveUnitNumber(initialUnitNumber);
      setActiveChapterIndex(initialChapterIndex);
      setCurrentPage(1);
      setJumpPageInput('1');
      setZoomLevel(100);
      setSearchQuery('');
      setSecurityWarning(null);
      setIsScreenBlurred(false);

      // Enable Android Native FLAG_SECURE
      secureBookService.enableNativeFlagSecure(true);

      // Verify server-side authorization and record access
      const bookId = textbook
        ? `textbook_${textbook.subjectId}_g${textbook.grade}`
        : supplementaryBook
        ? `supp_${supplementaryBook.id}`
        : 'general_book';

      secureBookService
        .verifyBookAccess({
          bookId,
          grade: textbook?.grade || supplementaryBook?.grades?.[0] || 9,
          subjectId: textbook?.subjectId || supplementaryBook?.subjectId || 'general',
          unitNumber: initialUnitNumber,
          pageNumber: 1,
        })
        .then((res) => setSecurityStatus(res))
        .catch(() => {});
    } else {
      // Disable FLAG_SECURE on modal dismiss
      secureBookService.enableNativeFlagSecure(false);
    }
  }, [isOpen, textbook, supplementaryBook, initialUnitNumber, initialChapterIndex]);

  // Compute active reading unit or chapter
  const activeUnit = useMemo(() => {
    if (!textbook || !textbook.units) return null;
    return textbook.units.find((u) => u.unitNumber === activeUnitNumber) || textbook.units[0] || null;
  }, [textbook, activeUnitNumber]);

  const activeChapter = useMemo(() => {
    if (!supplementaryBook || !supplementaryBook.chapters) return null;
    return supplementaryBook.chapters[activeChapterIndex] || supplementaryBook.chapters[0] || null;
  }, [supplementaryBook, activeChapterIndex]);

  // Calculate total pages in current context
  const totalPagesInUnit = useMemo(() => {
    if (activeUnit) {
      // Approximate 2-4 pages per section + 2 for review
      return Math.max(3, (activeUnit.sections?.length || 1) * 2 + 2);
    }
    if (activeChapter) {
      return Math.max(2, (activeChapter.fullContent?.length || 1) + 1);
    }
    return 10;
  }, [activeUnit, activeChapter]);

  // Handle page changes
  const handleNextPage = () => {
    if (currentPage < totalPagesInUnit) {
      setCurrentPage((prev) => {
        const next = prev + 1;
        setJumpPageInput(String(next));
        return next;
      });
      readerContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Advance to next unit if available
      if (textbook && activeUnit && activeUnit.unitNumber < textbook.units.length) {
        setActiveUnitNumber(activeUnit.unitNumber + 1);
        setCurrentPage(1);
        setJumpPageInput('1');
        readerContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (supplementaryBook && activeChapterIndex < supplementaryBook.chapters.length - 1) {
        setActiveChapterIndex(activeChapterIndex + 1);
        setCurrentPage(1);
        setJumpPageInput('1');
        readerContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => {
        const p = prev - 1;
        setJumpPageInput(String(p));
        return p;
      });
      readerContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Go back to previous unit if available
      if (textbook && activeUnit && activeUnit.unitNumber > 1) {
        setActiveUnitNumber(activeUnit.unitNumber - 1);
        setCurrentPage(1);
        setJumpPageInput('1');
        readerContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (supplementaryBook && activeChapterIndex > 0) {
        setActiveChapterIndex(activeChapterIndex - 1);
        setCurrentPage(1);
        setJumpPageInput('1');
        readerContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handleJumpToPage = (e: React.FormEvent) => {
    e.preventDefault();
    const p = parseInt(jumpPageInput, 10);
    if (!isNaN(p) && p >= 1 && p <= totalPagesInUnit) {
      setCurrentPage(p);
      readerContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setJumpPageInput(String(currentPage));
    }
  };

  // Zoom controls
  const handleZoomIn = () => setZoomLevel((z) => Math.min(200, z + 15));
  const handleZoomOut = () => setZoomLevel((z) => Math.max(75, z - 15));
  const handleZoomReset = () => setZoomLevel(100);

  // DRM & Security: Block unauthorized keyboard shortcuts (Save, Print, Copy)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Block Ctrl+S / Cmd+S (Save page / PDF)
      if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
        showSecurityWarning('የመጽሐፉን ፋይል ማውረድ ወይም ወደ መሣሪያ ማስቀመጥ በጥብቅ የተከለከለ ነው (Saving/downloading book files is prohibited).');
        return false;
      }
      // Block Ctrl+P / Cmd+P (Print page / save as PDF)
      if ((e.ctrlKey || e.metaKey) && (e.key === 'p' || e.key === 'P')) {
        e.preventDefault();
        showSecurityWarning('መጽሐፉን ማተም ወይም ወደ PDF መቀየር የተጠበቀ ነው (Printing or exporting to PDF is restricted).');
        return false;
      }
      // Block Ctrl+U (View Source)
      if ((e.ctrlKey || e.metaKey) && (e.key === 'u' || e.key === 'U')) {
        e.preventDefault();
        return false;
      }
      // Block F12 / DevTools shortcut attempt
      if (e.key === 'F12') {
        e.preventDefault();
        return false;
      }

      // Keyboard navigation for reader: Arrow keys
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        handleNextPage();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        handlePrevPage();
      } else if ((e.ctrlKey || e.metaKey) && (e.key === 'f' || e.key === 'F')) {
        e.preventDefault();
        setIsSearchOpen(true);
        setTimeout(() => searchInputRef.current?.focus(), 100);
      }
    };

    // DRM: Block copy event
    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      showSecurityWarning('የስርዓተ-ትምህርት መጽሐፍ ይዘትን ሙሉ በሙሉ መገልበጥ አይፈቀድም (Bulk copying of curriculum book content is prohibited).');
      if (e.clipboardData) {
        e.clipboardData.setData(
          'text/plain',
          'የኢ.ፌ.ዲ.ሪ ትምህርት ሚኒስቴር ስርዓተ-ትምህርት ጥበቃ የተደረገበት ነው (Protected Copyright FDRE MoE / NUR Academy).'
        );
      }
    };

    // DRM: Hide contents during window blur or app-switcher to prevent OS recent-app snapshots
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsScreenBlurred(true);
      } else {
        setIsScreenBlurred(false);
      }
    };

    const handleWindowBlur = () => {
      setIsScreenBlurred(true);
    };

    const handleWindowFocus = () => {
      setIsScreenBlurred(false);
    };

    window.addEventListener('keydown', handleKeyDown, true);
    document.addEventListener('copy', handleCopy, true);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('focus', handleWindowFocus);

    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
      document.removeEventListener('copy', handleCopy, true);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
      window.removeEventListener('focus', handleWindowFocus);
    };
  }, [isOpen, currentPage, totalPagesInUnit, activeUnit, activeChapterIndex]);

  const showSecurityWarning = (msg: string) => {
    setSecurityWarning(msg);
    setTimeout(() => setSecurityWarning(null), 4000);
  };

  // Watermark text composed of authenticated user credentials
  const watermarkText = useMemo(() => {
    const studentName = user?.displayName || userProfile?.displayName || 'Authorized Student';
    const email = user?.email || userProfile?.email || 'authenticated@nur.edu.et';
    const uid = user?.uid || 'std-sec-token';
    const dateStr = new Date().toLocaleDateString('en-US');
    return `FDRE MoE • NUR ACADEMY • CONFIDENTIAL • ${studentName} (${email}) • ID: ${uid.substring(0, 10)} • ${dateStr} • DO NOT SHARE OR REPRODUCE`;
  }, [user, userProfile]);

  // Full-text highlighting for search
  const highlightSearch = (text: string) => {
    if (!searchQuery.trim()) return text;
    const query = searchQuery.trim();
    const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === query.toLowerCase() ? (
            <mark key={i} className="bg-amber-300 text-stone-950 font-bold px-1 rounded-xs">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </>
    );
  };

  if (!isOpen) return null;

  const displayTitle =
    title ||
    textbook?.title ||
    supplementaryBook?.title ||
    `Grade ${textbook?.grade || supplementaryBook?.grades?.[0] || 9} Textbook`;

  return (
    <div
      id="secure-book-reader-modal"
      className="fixed inset-0 z-50 flex flex-col bg-stone-950/95 backdrop-blur-md select-none"
      onContextMenu={(e) => {
        e.preventDefault();
        showSecurityWarning('የቀኝ ጠቅታ ድርጊት ተሰናክሏል፤ መጽሐፉ በመተግበሪያው ውስጥ ብቻ ይነበባል (Right-click disabled: Book is protected).');
      }}
    >
      {/* Privacy curtain / Screen capture shield when app is in background or unfocused */}
      {isScreenBlurred && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-stone-900 text-white p-6 text-center">
          <EyeOff className="w-14 h-14 text-amber-400 mb-3 animate-pulse" />
          <h3 className="text-lg font-bold font-serif-ethiopic mb-1">
            🔒 የደህንነት ጥበቃ ገጽ (Security Screen Shield Active)
          </h3>
          <p className="text-xs text-stone-400 max-w-md">
            የኢትዮጵያ ትምህርት ሚኒስቴር የዲጂታል መጽሐፍት ጥበቃ ፖሊሲ መሰረት መስኮቱ ሲቀየር ይዘቱ ለደህንነት ሲባል ተሸፍኗል። ንባብ ለመቀጠል ወደ መተግበሪያው ይመለሱ።
          </p>
        </div>
      )}

      {/* Security Toast Warning */}
      {securityWarning && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-red-900/95 text-white border border-red-700 px-4 py-2.5 rounded-lg shadow-2xl text-xs font-serif-ethiopic animate-bounce">
          <Shield className="w-4 h-4 text-red-300 shrink-0" />
          <span>{securityWarning}</span>
        </div>
      )}

      {/* Top Header Bar */}
      <header className="flex items-center justify-between px-4 py-2.5 bg-[#25211D] border-b border-[#3D3730] text-stone-200">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-900/40 border border-emerald-700/50 text-[11px] font-bold text-emerald-400 shrink-0">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>🔒 የተጠበቀ ዲጂታል ንባብ</span>
          </div>

          <div className="min-w-0">
            <h1 className="text-xs sm:text-sm font-bold font-serif-ethiopic truncate text-stone-100">
              {displayTitle}
            </h1>
            <p className="text-[10px] text-stone-400 truncate flex items-center gap-2">
              <span>{badge}</span>
              {activeUnit && (
                <span className="text-amber-400 font-semibold">
                  • {t.unitLabel} {activeUnit.unitNumber}: {activeUnit.title}
                </span>
              )}
              {activeChapter && (
                <span className="text-amber-400 font-semibold">
                  • ምዕራፍ {activeChapter.chapterNumber}: {activeChapter.title}
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Right Header Controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Table of Contents Toggle */}
          <button
            id="reader-toc-toggle"
            onClick={() => setIsTocOpen(!isTocOpen)}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs rounded border transition-colors cursor-pointer ${
              isTocOpen
                ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                : 'bg-stone-800 border-stone-700 hover:bg-stone-700 text-stone-200'
            }`}
            title="ማውጫ ክፈት/ዝጋ (Toggle Table of Contents)"
          >
            <ListOrdered className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">ማውጫ</span>
          </button>

          {/* Search Toggle */}
          <button
            id="reader-search-toggle"
            onClick={() => {
              setIsSearchOpen(!isSearchOpen);
              if (!isSearchOpen) {
                setTimeout(() => searchInputRef.current?.focus(), 100);
              }
            }}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs rounded border transition-colors cursor-pointer ${
              isSearchOpen
                ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                : 'bg-stone-800 border-stone-700 hover:bg-stone-700 text-stone-200'
            }`}
            title="በመጽሐፉ ውስጥ ፈልግ (Search in Book)"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">ፈልግ</span>
          </button>

          {/* Close Reader */}
          <button
            id="close-secure-reader-btn"
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-white hover:bg-stone-800 rounded transition-colors cursor-pointer"
            title="ከመጽሐፉ ውጣ (Close Protected Reader)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Secondary Navigation & Zoom Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2 bg-[#1C1917] border-b border-[#2C2723] text-stone-300 text-xs font-serif-ethiopic">
        {/* Unit / Chapter Navigation Selector */}
        <div className="flex items-center gap-2">
          {textbook && (
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-stone-400">ምዕራፍ፡</span>
              <select
                id="reader-unit-select"
                value={activeUnitNumber}
                onChange={(e) => {
                  const u = parseInt(e.target.value, 10);
                  setActiveUnitNumber(u);
                  setCurrentPage(1);
                  setJumpPageInput('1');
                }}
                className="bg-stone-800 text-stone-100 border border-stone-700 rounded px-2 py-1 text-xs focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                {textbook.units.map((u) => (
                  <option key={u.unitNumber} value={u.unitNumber}>
                    {t.unitLabel} {u.unitNumber}: {u.title.substring(0, 32)}...
                  </option>
                ))}
              </select>
            </div>
          )}

          {supplementaryBook && (
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-stone-400">ክፍል፡</span>
              <select
                id="reader-chapter-select"
                value={activeChapterIndex}
                onChange={(e) => {
                  const idx = parseInt(e.target.value, 10);
                  setActiveChapterIndex(idx);
                  setCurrentPage(1);
                  setJumpPageInput('1');
                }}
                className="bg-stone-800 text-stone-100 border border-stone-700 rounded px-2 py-1 text-xs focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                {supplementaryBook.chapters.map((ch, idx) => (
                  <option key={ch.chapterNumber} value={idx}>
                    ምዕራፍ {ch.chapterNumber}: {ch.title.substring(0, 32)}...
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Page Jump & Navigation */}
        <div className="flex items-center gap-2">
          <button
            id="reader-prev-page-btn"
            onClick={handlePrevPage}
            disabled={currentPage <= 1 && activeUnitNumber <= 1 && activeChapterIndex <= 0}
            className="p-1 rounded bg-stone-800 hover:bg-stone-700 disabled:opacity-30 disabled:cursor-not-allowed text-stone-200 border border-stone-700 cursor-pointer transition-colors"
            title="ያለፈው ገጽ (Previous Page)"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <form onSubmit={handleJumpToPage} className="flex items-center gap-1">
            <span className="text-[11px] text-stone-400">ገጽ</span>
            <input
              id="reader-page-jump-input"
              type="text"
              value={jumpPageInput}
              onChange={(e) => setJumpPageInput(e.target.value)}
              className="w-10 text-center bg-stone-800 text-stone-100 border border-stone-700 rounded py-0.5 text-xs font-bold focus:outline-none focus:border-amber-500"
            />
            <span className="text-[11px] text-stone-400">ከ {totalPagesInUnit}</span>
          </form>

          <button
            id="reader-next-page-btn"
            onClick={handleNextPage}
            className="p-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 cursor-pointer transition-colors"
            title="ቀጣይ ገጽ (Next Page)"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-stone-400 hidden sm:inline">አጉላ/አሳንስ (Zoom):</span>
          <button
            id="reader-zoom-out-btn"
            onClick={handleZoomOut}
            className="p-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700 cursor-pointer"
            title="አሳንስ (Zoom Out)"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>

          <span className="px-1.5 py-0.5 text-[11px] font-mono text-stone-300 bg-stone-800/80 rounded border border-stone-700">
            {zoomLevel}%
          </span>

          <button
            id="reader-zoom-in-btn"
            onClick={handleZoomIn}
            className="p-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700 cursor-pointer"
            title="አጉላ (Zoom In)"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>

          <button
            id="reader-zoom-reset-btn"
            onClick={handleZoomReset}
            className="p-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700 cursor-pointer"
            title="መደበኛ መጠን (Reset 100%)"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Interactive Search Bar Popdown */}
      {isSearchOpen && (
        <div className="flex items-center gap-3 px-4 py-2 bg-stone-900 border-b border-stone-800 text-xs">
          <Search className="w-4 h-4 text-amber-400 shrink-0" />
          <input
            ref={searchInputRef}
            id="reader-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="በዚህ ምዕራፍ ውስጥ ቃል ወይም ፅንሰ-ሀሳብ ፈልግ... (Search terms, formulas, rules)"
            className="flex-1 bg-stone-800 text-stone-100 placeholder-stone-400 border border-stone-700 rounded px-3 py-1.5 focus:outline-none focus:border-amber-500 font-serif-ethiopic"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-stone-400 hover:text-stone-200 text-[11px]"
            >
              አፅዳ
            </button>
          )}
          <span className="text-[11px] text-stone-400">
            {searchQuery.trim() ? `ፍለጋ በመካሄድ ላይ` : 'የሚፈልጉትን ቃል ያስገቡ'}
          </span>
        </div>
      )}

      {/* Main Reading Workspace Body */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Table of Contents Drawer (Left) */}
        {isTocOpen && (
          <aside className="w-72 sm:w-80 bg-[#1E1B18] border-r border-[#38332D] flex flex-col z-20 shadow-xl overflow-y-auto">
            <div className="p-3 border-b border-[#38332D] flex items-center justify-between">
              <span className="text-xs font-bold font-serif-ethiopic text-amber-400 flex items-center gap-1.5">
                <Bookmark className="w-4 h-4" />
                የመጽሐፉ ሙሉ ማውጫ (TOC)
              </span>
              <button
                onClick={() => setIsTocOpen(false)}
                className="text-stone-400 hover:text-white p-1 rounded cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-2 space-y-2">
              {textbook?.units.map((u) => {
                const isActive = u.unitNumber === activeUnitNumber;
                return (
                  <div
                    key={u.unitNumber}
                    className={`rounded-lg border transition-all ${
                      isActive
                        ? 'bg-stone-800/80 border-amber-500/60'
                        : 'bg-stone-900/40 border-stone-800 hover:border-stone-700'
                    }`}
                  >
                    <button
                      onClick={() => {
                        setActiveUnitNumber(u.unitNumber);
                        setCurrentPage(1);
                        setJumpPageInput('1');
                      }}
                      className="w-full text-left p-2.5 text-xs font-serif-ethiopic text-stone-200 cursor-pointer"
                    >
                      <div className="flex items-center justify-between text-amber-400 font-bold mb-0.5">
                        <span>{t.unitLabel} {u.unitNumber}</span>
                        <span className="text-[10px] text-stone-400">
                          {u.sections.length} ክፍሎች
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-300 line-clamp-2">
                        {u.title.replace(/^[^\s]+ [0-9]+፡\s*/, '')}
                      </p>
                    </button>

                    {/* Sub-sections */}
                    {isActive && (
                      <div className="px-2 pb-2 pt-1 border-t border-stone-800 space-y-1">
                        {u.sections.map((sec, sIdx) => (
                          <button
                            key={sIdx}
                            onClick={() => {
                              setCurrentPage(sIdx + 1);
                              setJumpPageInput(String(sIdx + 1));
                            }}
                            className="w-full text-left px-2 py-1 rounded text-[11px] font-serif-ethiopic text-stone-400 hover:bg-stone-700 hover:text-stone-100 flex items-center justify-between truncate cursor-pointer"
                          >
                            <span className="truncate">{sec.title}</span>
                            <span className="text-[9px] text-stone-500">ገጽ {sIdx + 1}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              {supplementaryBook?.chapters.map((ch, idx) => {
                const isActive = idx === activeChapterIndex;
                return (
                  <button
                    key={ch.chapterNumber}
                    onClick={() => {
                      setActiveChapterIndex(idx);
                      setCurrentPage(1);
                      setJumpPageInput('1');
                    }}
                    className={`w-full text-left p-2.5 rounded-lg border text-xs font-serif-ethiopic transition-all cursor-pointer ${
                      isActive
                        ? 'bg-stone-800/80 border-amber-500/60 text-stone-100'
                        : 'bg-stone-900/40 border-stone-800 hover:border-stone-700 text-stone-300'
                    }`}
                  >
                    <div className="font-bold text-amber-400 mb-0.5">
                      ምዕራፍ {ch.chapterNumber}
                    </div>
                    <div className="text-[11px] line-clamp-2">{ch.title}</div>
                  </button>
                );
              })}
            </div>
          </aside>
        )}

        {/* Center Paper Canvas Viewport */}
        <main
          ref={readerContainerRef}
          className="flex-1 overflow-y-auto bg-[#141210] p-4 sm:p-8 flex justify-center relative select-none"
        >
          {/* Dynamic Personalized Anti-Piracy Watermark Grid */}
          <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden opacity-[0.06] select-none flex flex-wrap gap-24 p-8 justify-around items-center">
            {Array.from({ length: 12 }).map((_, idx) => (
              <div
                key={idx}
                className="transform -rotate-25 text-stone-100 font-mono text-xs sm:text-sm font-bold tracking-widest uppercase whitespace-nowrap"
              >
                {watermarkText}
              </div>
            ))}
          </div>

          {/* Secure Paper Document Container */}
          <div
            id="secure-book-document"
            style={{
              transform: `scale(${zoomLevel / 100})`,
              transformOrigin: 'top center',
              width: '100%',
              maxWidth: '850px',
            }}
            className="bg-[#FAF6EC] text-[#24201A] p-6 sm:p-12 rounded-lg shadow-2xl border-[2px] border-[#38332D] space-y-8 min-h-[950px] transition-transform duration-150 relative"
          >
            {/* Header Document Strip */}
            <div className="border-b-[2px] border-[#38332D] pb-5 space-y-2">
              <div className="flex items-center justify-between text-xs font-serif-ethiopic text-[#736857]">
                <span>{badge}</span>
                <span className="font-bold text-[#2E6B4A]">
                  ገጽ {currentPage} ከ {totalPagesInUnit}
                </span>
              </div>

              {activeUnit && (
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 text-xs font-bold bg-[#38332D] text-[#FAF6EC] rounded-xs font-serif-ethiopic">
                      {t.unitLabel} {activeUnit.unitNumber}
                    </span>
                    <span className="text-xs font-serif-ethiopic text-[#736857]">
                      {textbook?.title}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold font-serif-ethiopic text-[#1A1815]">
                    {highlightSearch(activeUnit.title)}
                  </h2>
                </div>
              )}

              {activeChapter && (
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 text-xs font-bold bg-[#38332D] text-[#FAF6EC] rounded-xs font-serif-ethiopic">
                      ምዕራፍ {activeChapter.chapterNumber}
                    </span>
                    <span className="text-xs font-serif-ethiopic text-[#736857]">
                      {supplementaryBook?.title}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold font-serif-ethiopic text-[#1A1815]">
                    {highlightSearch(activeChapter.title)}
                  </h2>
                </div>
              )}
            </div>

            {/* Content for Textbook Unit */}
            {activeUnit && (
              <div className="space-y-8 font-serif-ethiopic text-sm sm:text-base leading-relaxed text-[#2C2720]">
                {/* Unit Overview Summary */}
                {activeUnit.summary && (
                  <div className="p-4 bg-[#F2EDE1] border-l-4 border-[#2E6B4A] rounded-r-lg space-y-1">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#2E6B4A]">
                      የምዕራፉ መግቢያና ዋና ዓላማ (Unit Overview & Objectives)
                    </h4>
                    <p className="text-sm text-[#443D32] leading-relaxed">
                      {highlightSearch(activeUnit.summary)}
                    </p>
                  </div>
                )}

                {/* Section Content */}
                {activeUnit.sections && activeUnit.sections.length > 0 && (
                  <div className="space-y-8">
                    {activeUnit.sections.map((sec, idx) => (
                      <article
                        key={idx}
                        className="space-y-4 border-b border-[#E3DAC9] pb-6 last:border-b-0"
                      >
                        <h3 className="text-lg font-bold text-[#1F1B16] flex items-center gap-2">
                          <span className="text-xs px-2 py-0.5 bg-[#E8DFC8] rounded text-[#423A2F]">
                            {activeUnit.unitNumber}.{idx + 1}
                          </span>
                          <span>{highlightSearch(sec.title)}</span>
                        </h3>

                        {sec.content && (
                          <div className="space-y-3 leading-relaxed text-[#332C24]">
                            {Array.isArray(sec.content) ? (
                              sec.content.map((p, pIdx) => (
                                <p key={pIdx}>{highlightSearch(p)}</p>
                              ))
                            ) : (
                              <p>{highlightSearch(String(sec.content))}</p>
                            )}
                          </div>
                        )}

                        {/* Key Terms */}
                        {sec.keyTerms && sec.keyTerms.length > 0 && (
                          <div className="p-3 bg-[#FAF3E0] border border-[#DFCBAA] rounded-md space-y-1.5">
                            <span className="text-xs font-bold text-[#8A5119] uppercase tracking-wide">
                              🔑 ቁልፍ ፅንሰ-ሀሳቦች (Key Terms):
                            </span>
                            <div className="flex flex-wrap gap-2 pt-1">
                              {sec.keyTerms.map((kt: any, kIdx: number) => (
                                <span
                                  key={kIdx}
                                  className="px-2 py-0.5 bg-white border border-[#CDB58E] rounded text-xs font-medium text-[#4A3921]"
                                >
                                  {typeof kt === 'string' ? (
                                    highlightSearch(kt)
                                  ) : (
                                    <span>
                                      <strong>{highlightSearch(kt.term)}</strong>: {highlightSearch(kt.definition)}
                                    </span>
                                  )}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Worked Examples */}
                        {sec.workedExamples && sec.workedExamples.length > 0 && (
                          <div className="p-4 bg-[#EBF3ED] border border-[#ADCBB7] rounded-md space-y-2">
                            <span className="text-xs font-bold text-[#1E5737] uppercase tracking-wide">
                              📝 ተግባራዊ ምሳሌ (Worked Example):
                            </span>
                            <div className="space-y-2 text-xs sm:text-sm text-[#20452E]">
                              {sec.workedExamples.map((ex: any, eIdx: number) => (
                                <div key={eIdx} className="bg-white/80 p-2.5 rounded border border-[#C5DDCF] space-y-1">
                                  {typeof ex === 'string' ? (
                                    highlightSearch(ex)
                                  ) : (
                                    <>
                                      <p className="font-semibold">{highlightSearch(ex.question)}</p>
                                      <p className="text-stone-700">{highlightSearch(ex.solution)}</p>
                                    </>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </article>
                    ))}
                  </div>
                )}

                {/* Unit Review Questions */}
                {activeUnit.unitReviewQuestions && activeUnit.unitReviewQuestions.length > 0 && (
                  <div className="p-5 bg-[#F6F0E4] border border-[#D5C7B0] rounded-lg space-y-3">
                    <h4 className="text-sm font-bold text-[#38332D] uppercase tracking-wider">
                      🎯 የምዕራፍ ማጠቃለያ የክለሳ ጥያቄዎች (Unit Review Exercises)
                    </h4>
                    <ol className="list-decimal list-inside space-y-2 text-xs sm:text-sm text-[#443C31]">
                      {activeUnit.unitReviewQuestions.map((q, qIdx) => (
                        <li key={qIdx} className="leading-normal">
                          {highlightSearch(q)}
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            )}

            {/* Content for Supplementary Book Chapter */}
            {activeChapter && (
              <div className="space-y-6 font-serif-ethiopic text-sm sm:text-base leading-relaxed text-[#2C2720]">
                {activeChapter.summary && (
                  <div className="p-4 bg-[#F2EDE1] border-l-4 border-amber-600 rounded-r-lg">
                    <p className="text-sm text-[#443D32]">
                      {highlightSearch(activeChapter.summary)}
                    </p>
                  </div>
                )}

                {/* Key Formulas & Rules */}
                {activeChapter.keyFormulasAndRules && activeChapter.keyFormulasAndRules.length > 0 && (
                  <div className="p-4 bg-[#FFF9E6] border border-[#E8D499] rounded-lg space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#8A6715]">
                      📐 ቁልፍ ቀመሮችና ሕጎች (Key Formulas & Rules)
                    </h4>
                    <ul className="list-disc list-inside space-y-1.5 text-xs sm:text-sm text-[#473B17]">
                      {activeChapter.keyFormulasAndRules.map((formula, fIdx) => (
                        <li key={fIdx}>{highlightSearch(formula)}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Full Chapter Content */}
                {activeChapter.fullContent && (
                  <div className="space-y-4 text-[#332C24]">
                    {activeChapter.fullContent.map((paragraph, pIdx) => (
                      <p key={pIdx}>{highlightSearch(paragraph)}</p>
                    ))}
                  </div>
                )}

                {/* Sample Exam Problems */}
                {activeChapter.sampleExamProblems && activeChapter.sampleExamProblems.length > 0 && (
                  <div className="space-y-4 pt-4">
                    <h4 className="text-sm font-bold text-[#1E3A8A] uppercase tracking-wider">
                      🧪 የፈተና ምሳሌዎችና አሰራሮች (Sample Exam Problems)
                    </h4>
                    {activeChapter.sampleExamProblems.map((item, probIdx) => (
                      <div
                        key={probIdx}
                        className="p-4 bg-[#EFF6FF] border border-[#BFDBFE] rounded-lg space-y-2"
                      >
                        <div className="font-bold text-xs sm:text-sm text-[#1E3A8A]">
                          ጥያቄ {probIdx + 1}፡ {highlightSearch(item.problem)}
                        </div>
                        <div className="p-2.5 bg-white rounded border border-[#DBEAFE] text-xs font-mono text-[#1E293B]">
                          መልስ/አሰራር፡ {highlightSearch(item.solution)}
                        </div>
                        {item.tip && (
                          <div className="text-[11px] text-[#2563EB] italic">
                            💡 ጠቃሚ ምክር፡ {highlightSearch(item.tip)}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Document Footer */}
            <footer className="pt-8 border-t-[1.5px] border-[#38332D] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#7A6F5E] font-serif-ethiopic">
              <div className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#2E6B4A]" />
                <span>ይህ ዲጂታል ይዘት በመተግበሪያው ውስጥ ብቻ እንዲነበብ የተጠበቀ ነው።</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage <= 1 && activeUnitNumber <= 1 && activeChapterIndex <= 0}
                  className="px-3 py-1 bg-[#EBE3D3] hover:bg-[#DDD2BE] disabled:opacity-40 rounded text-[#38332D] font-bold cursor-pointer"
                >
                  ← ያለፈው ገጽ
                </button>
                <button
                  onClick={handleNextPage}
                  className="px-3 py-1 bg-[#38332D] hover:bg-[#201D1A] text-[#FAF6EC] font-bold rounded cursor-pointer"
                >
                  ቀጣይ ገጽ →
                </button>
              </div>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
};
