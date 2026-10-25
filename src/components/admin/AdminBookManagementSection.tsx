import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  ShieldCheck,
  Lock,
  Search,
  Edit,
  Plus,
  CheckCircle2,
  EyeOff,
  X,
  Save,
  Layers,
  Trash2,
  FileText,
} from 'lucide-react';
import {
  Grade,
  ReferenceBook,
  ReferenceBookAccessLevel,
  ReferenceBookStatus,
  ReferenceBookChapter,
  ReferenceBookSection,
} from '../../types';
import { secureBookService } from '../../services/secureBookService';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export const AdminBookManagementSection: React.FC = () => {
  const [books, setBooks] = useState<ReferenceBook[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<Grade | 'all'>('all');
  const [activeSubView, setActiveSubView] = useState<'books' | 'chapters'>('books');

  // Book Editor Modal State
  const [editingBook, setEditingBook] = useState<ReferenceBook | null>(null);
  const [isCreatingBook, setIsCreatingBook] = useState(false);

  // Chapters & Sections Manager State
  const [selectedBookForChapters, setSelectedBookForChapters] = useState<ReferenceBook | null>(null);
  const [chapters, setChapters] = useState<ReferenceBookChapter[]>([]);
  const [sections, setSections] = useState<ReferenceBookSection[]>([]);
  const [newChapterTitle, setNewChapterTitle] = useState('');
  const [newChapterSummary, setNewChapterSummary] = useState('');
  const [newSectionTitle, setNewSectionTitle] = useState('');
  const [newSectionNumber, setNewSectionNumber] = useState('1.1');
  const [newSectionContent, setNewSectionContent] = useState('');
  const [newSectionFormulas, setNewSectionFormulas] = useState('');
  const [targetChapterId, setTargetChapterId] = useState<string>('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    const list = await secureBookService.getReferenceBooks({ includeDrafts: true, isAdmin: true });
    setBooks(list);
    if (!selectedBookForChapters && list.length > 0) {
      handleSelectBookForChapters(list[0]);
    }
  };

  const handleSelectBookForChapters = async (book: ReferenceBook) => {
    setSelectedBookForChapters(book);
    const [ch, sec] = await Promise.all([
      secureBookService.getBookChapters(book.id),
      secureBookService.getBookSections(book.id),
    ]);
    setChapters(ch);
    setSections(sec);
    if (ch.length > 0) {
      setTargetChapterId(ch[0].id);
    }
  };

  const handleOpenCreateBook = () => {
    const newBook: ReferenceBook = {
      id: `ref-book-${Date.now()}`,
      title: '',
      titleAmharic: '',
      author: 'FDRE MoE / Academic Reference Panel',
      subjectId: 'math',
      subjectName: 'Mathematics',
      gradeId: 9,
      category: 'Curriculum Reference',
      description: '',
      coverGradient: 'from-emerald-700 via-emerald-800 to-teal-950',
      accessLevel: 'FREE',
      status: 'PUBLISHED',
      source: 'Official Approved Reference',
      licenseInfo: 'Educational Reference License — In-App Reading Only',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setEditingBook(newBook);
    setIsCreatingBook(true);
  };

  const handleSaveBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBook || !editingBook.title.trim()) return;
    await secureBookService.saveReferenceBookAdmin(editingBook);
    await loadBooks();
    setEditingBook(null);
    setIsCreatingBook(false);
    setStatusMessage('Reference book configuration saved and synced.');
    setTimeout(() => setStatusMessage(null), 3500);
  };

  const handleDeleteBook = async (bookId: string) => {
    await secureBookService.deleteReferenceBookAdmin(bookId);
    await loadBooks();
    setStatusMessage('Reference book removed.');
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleAddChapter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookForChapters || !newChapterTitle.trim()) return;
    const ch: ReferenceBookChapter = {
      id: `ch-${selectedBookForChapters.id}-${Date.now()}`,
      bookId: selectedBookForChapters.id,
      chapterNumber: chapters.length + 1,
      title: newChapterTitle.trim(),
      summary: newChapterSummary.trim() || 'Approved reference chapter.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await secureBookService.saveChapterAdmin(ch);
    setNewChapterTitle('');
    setNewChapterSummary('');
    await handleSelectBookForChapters(selectedBookForChapters);
    setStatusMessage('Chapter added to reference book.');
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleAddSection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookForChapters || !targetChapterId || !newSectionTitle.trim() || !newSectionContent.trim()) {
      return;
    }
    const sec: ReferenceBookSection = {
      id: `sec-${selectedBookForChapters.id}-${Date.now()}`,
      bookId: selectedBookForChapters.id,
      chapterId: targetChapterId,
      sectionNumber: newSectionNumber.trim() || '1.1',
      title: newSectionTitle.trim(),
      content: newSectionContent
        .split('\n')
        .map((p) => p.trim())
        .filter(Boolean),
      keyFormulas: newSectionFormulas
        .split('\n')
        .map((f) => f.trim())
        .filter(Boolean),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await secureBookService.saveSectionAdmin(sec);
    setNewSectionTitle('');
    setNewSectionContent('');
    setNewSectionFormulas('');
    await handleSelectBookForChapters(selectedBookForChapters);
    setStatusMessage('Section content added and protected.');
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const filteredBooks = books.filter((b) => {
    const matchSearch =
      b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.titleAmharic || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.subjectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.author.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchSearch) return false;
    if (selectedGrade !== 'all' && b.gradeId !== selectedGrade) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* 1. Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-stone-900 font-serif-ethiopic">
            የማጣቀሻ መጽሐፍት፣ ምዕራፎችና የመዳረሻ ቁጥጥር (Reference Books & Access Management)
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            Configure Reference Books, Chapters, Sections, Access Levels (FREE, PREMIUM, ADMIN_ONLY), Publication Status, and Source/License attribution.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={handleOpenCreateBook}
          >
            Add Reference Book
          </Button>
        </div>
      </div>

      {statusMessage && (
        <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Sub-navigation Tabs: Books & Access vs Chapters & Sections */}
      <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-stone-200 w-fit">
        <button
          onClick={() => setActiveSubView('books')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeSubView === 'books'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Reference Books & Access ({books.length})</span>
        </button>
        <button
          onClick={() => setActiveSubView('chapters')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeSubView === 'chapters'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Reference Book Chapters & Sections</span>
        </button>
      </div>

      {activeSubView === 'books' ? (
        <>
          {/* Filter Bar */}
          <div className="bg-white rounded-3xl p-4 border border-stone-200/90 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                placeholder="Search reference book by title, author, subject..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-10 pr-4 py-2 text-xs focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full sm:w-auto">
              {(['all', 9, 10, 11, 12] as (Grade | 'all')[]).map((g) => (
                <button
                  key={g}
                  onClick={() => setSelectedGrade(g)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    selectedGrade === g
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-stone-50 text-stone-600 hover:bg-stone-100 border border-stone-200'
                  }`}
                >
                  {g === 'all' ? 'All Grades' : `Grade ${g}`}
                </button>
              ))}
            </div>
          </div>

          {/* Reference Books Table */}
          <div className="bg-white rounded-3xl border border-stone-200/90 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-600 border-collapse">
                <thead className="bg-stone-50 border-b border-stone-200/80 uppercase font-mono text-[11px] text-stone-400">
                  <tr>
                    <th className="px-5 py-4 font-bold">Book Title & Author</th>
                    <th className="px-4 py-4 font-bold">Subject & Grade</th>
                    <th className="px-4 py-4 font-bold">Category & Source</th>
                    <th className="px-4 py-4 font-bold">Access Level</th>
                    <th className="px-4 py-4 font-bold">Status</th>
                    <th className="px-4 py-4 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredBooks.map((book) => (
                    <tr key={book.id} className="hover:bg-stone-50/70 transition-colors">
                      <td className="px-5 py-4">
                        <div className="font-bold text-stone-900 font-serif-ethiopic text-sm">
                          {book.titleAmharic || book.title}
                        </div>
                        <div className="text-[11px] text-stone-500 mt-0.5">
                          {book.title} • <span className="font-semibold">{book.author}</span>
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <span className="font-bold text-stone-800">{book.subjectName}</span>
                        <div className="text-[11px] text-emerald-800 font-mono mt-0.5">
                          Grade {book.gradeId}
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <div className="font-semibold text-stone-800">{book.category}</div>
                        <div className="text-[10px] text-stone-400 truncate max-w-[180px]" title={book.source}>
                          {book.source}
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold font-mono border ${
                            book.accessLevel === 'FREE'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : book.accessLevel === 'PREMIUM'
                              ? 'bg-amber-50 text-amber-800 border-amber-300'
                              : 'bg-rose-50 text-rose-700 border-rose-200'
                          }`}
                        >
                          {book.accessLevel}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            book.status === 'PUBLISHED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-stone-200 text-stone-700'
                          }`}
                        >
                          {book.status}
                        </span>
                      </td>

                      <td className="px-4 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            variant="outline"
                            size="xs"
                            leftIcon={<Layers className="w-3 h-3" />}
                            onClick={() => {
                              handleSelectBookForChapters(book);
                              setActiveSubView('chapters');
                            }}
                          >
                            Chapters
                          </Button>
                          <Button
                            variant="outline"
                            size="xs"
                            leftIcon={<Edit className="w-3 h-3" />}
                            onClick={() => {
                              setEditingBook({ ...book });
                              setIsCreatingBook(false);
                            }}
                          >
                            Configure
                          </Button>
                          <button
                            onClick={() => handleDeleteBook(book.id)}
                            className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 cursor-pointer"
                            title="Delete Book"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        /* CHAPTERS & SECTIONS MANAGEMENT VIEW */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Select Book & Add Chapter */}
          <div className="space-y-4">
            <div className="bg-white rounded-3xl p-5 border border-stone-200 space-y-3">
              <label className="block text-xs font-bold text-stone-700 uppercase">
                Select Reference Book
              </label>
              <select
                value={selectedBookForChapters?.id || ''}
                onChange={(e) => {
                  const found = books.find((b) => b.id === e.target.value);
                  if (found) handleSelectBookForChapters(found);
                }}
                className="w-full p-2.5 rounded-xl bg-stone-50 border border-stone-300 text-xs font-bold text-stone-900"
              >
                {books.map((b) => (
                  <option key={b.id} value={b.id}>
                    [G{b.gradeId}] {b.title}
                  </option>
                ))}
              </select>
            </div>

            <form onSubmit={handleAddChapter} className="bg-white rounded-3xl p-5 border border-stone-200 space-y-3">
              <h3 className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-emerald-600" />
                <span>Add New Chapter</span>
              </h3>
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">Chapter Title *</label>
                <input
                  type="text"
                  required
                  value={newChapterTitle}
                  onChange={(e) => setNewChapterTitle(e.target.value)}
                  placeholder="e.g. Chapter 3: Coordinate Geometry"
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">Chapter Summary</label>
                <textarea
                  rows={2}
                  value={newChapterSummary}
                  onChange={(e) => setNewChapterSummary(e.target.value)}
                  placeholder="Brief overview of chapter learning objectives..."
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs"
                />
              </div>
              <Button type="submit" variant="primary" size="sm" className="w-full">
                Save Chapter
              </Button>
            </form>
          </div>

          {/* Right: Chapters List & Add Section Form */}
          <div className="lg:col-span-2 space-y-5">
            <form onSubmit={handleAddSection} className="bg-white rounded-3xl p-5 border border-stone-200 space-y-3">
              <h3 className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-emerald-600" />
                <span>Add Approved Section Content to Chapter</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-stone-600 mb-1">Target Chapter *</label>
                  <select
                    value={targetChapterId}
                    onChange={(e) => setTargetChapterId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs font-bold"
                  >
                    {chapters.map((c) => (
                      <option key={c.id} value={c.id}>
                        Ch {c.chapterNumber}: {c.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">Section Number *</label>
                  <input
                    type="text"
                    required
                    value={newSectionNumber}
                    onChange={(e) => setNewSectionNumber(e.target.value)}
                    placeholder="1.2"
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">Section Title *</label>
                <input
                  type="text"
                  required
                  value={newSectionTitle}
                  onChange={(e) => setNewSectionTitle(e.target.value)}
                  placeholder="e.g. Distance Formula & Midpoint Theorem"
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">
                  Approved Reference Content (One paragraph per line) *
                </label>
                <textarea
                  rows={4}
                  required
                  value={newSectionContent}
                  onChange={(e) => setNewSectionContent(e.target.value)}
                  placeholder="Enter educational reference paragraphs..."
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">
                  Key Formulas (Optional, one formula per line)
                </label>
                <textarea
                  rows={2}
                  value={newSectionFormulas}
                  onChange={(e) => setNewSectionFormulas(e.target.value)}
                  placeholder="d = √[(x₂ - x₁)² + (y₂ - y₁)²]"
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs font-mono"
                />
              </div>

              <div className="flex justify-end">
                <Button type="submit" variant="primary" size="sm" leftIcon={<Save className="w-3.5 h-3.5" />}>
                  Add Protected Section
                </Button>
              </div>
            </form>

            {/* Existing Chapters & Sections Preview */}
            <div className="bg-white rounded-3xl p-5 border border-stone-200 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Configured Chapters & Sections ({chapters.length} Chapters, {sections.length} Sections)
              </h4>
              {chapters.map((ch) => {
                const chSecs = sections.filter((s) => s.chapterId === ch.id);
                return (
                  <div key={ch.id} className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-stone-900">
                        Chapter {ch.chapterNumber}: {ch.title}
                      </span>
                      <Badge variant="neutral" size="xs">
                        {chSecs.length} sections
                      </Badge>
                    </div>
                    <p className="text-[11px] text-stone-500">{ch.summary}</p>
                    <div className="pl-3 border-l-2 border-emerald-300 space-y-1 pt-1">
                      {chSecs.map((s) => (
                        <div key={s.id} className="text-xs text-stone-700 flex items-center justify-between">
                          <span>
                            <strong className="font-mono">{s.sectionNumber}</strong> — {s.title}
                          </span>
                          <span className="text-[10px] font-mono text-emerald-700">In-App Protected</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CREATE / EDIT REFERENCE BOOK METADATA & ACCESS */}
      {editingBook && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-xs">
          <form
            onSubmit={handleSaveBook}
            className="w-full max-w-xl rounded-3xl p-6 bg-white border border-stone-200 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-emerald-700" />
                <h3 className="text-base font-bold text-stone-900">
                  {isCreatingBook ? 'Create Reference Book' : 'Configure Reference Book & Access Rights'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingBook(null)}
                className="p-1 rounded-full hover:bg-stone-100 text-stone-400 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="sm:col-span-2">
                <label className="font-bold text-stone-700 block mb-1">Book Title (English) *</label>
                <input
                  type="text"
                  required
                  value={editingBook.title}
                  onChange={(e) => setEditingBook({ ...editingBook, title: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-900"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-bold text-stone-700 block mb-1">Book Title (Amharic)</label>
                <input
                  type="text"
                  value={editingBook.titleAmharic || ''}
                  onChange={(e) => setEditingBook({ ...editingBook, titleAmharic: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-900 font-serif-ethiopic"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Author / Publisher *</label>
                <input
                  type="text"
                  required
                  value={editingBook.author}
                  onChange={(e) => setEditingBook({ ...editingBook, author: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-900"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Category *</label>
                <input
                  type="text"
                  required
                  value={editingBook.category}
                  onChange={(e) => setEditingBook({ ...editingBook, category: e.target.value })}
                  placeholder="Curriculum Reference / National Exam Prep"
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-900"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Subject *</label>
                <input
                  type="text"
                  required
                  value={editingBook.subjectName}
                  onChange={(e) =>
                    setEditingBook({
                      ...editingBook,
                      subjectName: e.target.value,
                      subjectId: e.target.value.toLowerCase().replace(/\s+/g, '_'),
                    })
                  }
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-900"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Grade Level *</label>
                <select
                  value={editingBook.gradeId}
                  onChange={(e) => setEditingBook({ ...editingBook, gradeId: Number(e.target.value) as Grade })}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-900 font-bold"
                >
                  <option value={9}>Grade 9</option>
                  <option value={10}>Grade 10</option>
                  <option value={11}>Grade 11</option>
                  <option value={12}>Grade 12</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Access Level *</label>
                <select
                  value={editingBook.accessLevel}
                  onChange={(e) =>
                    setEditingBook({ ...editingBook, accessLevel: e.target.value as ReferenceBookAccessLevel })
                  }
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-900 font-bold"
                >
                  <option value="FREE">FREE (All Active Students)</option>
                  <option value="PREMIUM">PREMIUM (Subscribed Students)</option>
                  <option value="ADMIN_ONLY">ADMIN_ONLY (Hidden from Students)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Publication Status *</label>
                <select
                  value={editingBook.status}
                  onChange={(e) =>
                    setEditingBook({ ...editingBook, status: e.target.value as ReferenceBookStatus })
                  }
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-900 font-bold"
                >
                  <option value="PUBLISHED">PUBLISHED (Visible to Students)</option>
                  <option value="DRAFT">DRAFT (Hidden)</option>
                  <option value="ARCHIVED">ARCHIVED</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="font-bold text-stone-700 block mb-1">Description *</label>
                <textarea
                  rows={2}
                  required
                  value={editingBook.description}
                  onChange={(e) => setEditingBook({ ...editingBook, description: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-900"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Source Attribution *</label>
                <input
                  type="text"
                  required
                  value={editingBook.source}
                  onChange={(e) => setEditingBook({ ...editingBook, source: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-900"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">License & Rights Info *</label>
                <input
                  type="text"
                  required
                  value={editingBook.licenseInfo}
                  onChange={(e) => setEditingBook({ ...editingBook, licenseInfo: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-900"
                />
              </div>
            </div>

            <div className="pt-3 flex items-center justify-end gap-2 border-t border-stone-100">
              <Button type="button" variant="outline" size="sm" onClick={() => setEditingBook(null)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" leftIcon={<Save className="w-3.5 h-3.5" />}>
                Save Book Configuration
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
