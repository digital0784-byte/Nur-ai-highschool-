import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  FileText,
  CheckCircle2,
  ExternalLink,
  Search,
  Filter,
  Layers,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  ShieldCheck,
  Plus,
  AlertTriangle,
  RotateCcw,
  Clock,
  ChevronRight,
  ChevronDown,
  Edit,
  Save,
  X,
  FileQuestion,
  ListFilter,
} from 'lucide-react';
import { CurriculumMetadata } from '../../types/adminDashboard';
import { Grade } from '../../types';
import { adminAuditService } from '../../services/adminAuditService';

interface AdminCurriculumSectionProps {
  metadataList: CurriculumMetadata[];
}

export type ProcessingStatus = 'PENDING' | 'PROCESSING' | 'PROCESSED' | 'FAILED' | 'REVIEW_REQUIRED';

export interface PageProcessingRecord {
  id: string;
  subjectId: string;
  subjectName: string;
  grade: Grade;
  unit: number;
  unitTitle: string;
  section: string;
  lesson: string;
  topic: string;
  learningOutcome: string;
  pageNumber: number;
  status: ProcessingStatus;
  chunksExtracted: number;
  lastAttempt: string;
  errorMessage?: string;
}

export const AdminCurriculumSection: React.FC<AdminCurriculumSectionProps> = ({
  metadataList,
}) => {
  const [list, setList] = useState<CurriculumMetadata[]>(metadataList);
  const [activeSubView, setActiveSubView] = useState<'textbooks' | 'processing_monitor' | 'curriculum_tree'>('textbooks');
  const [selectedGrade, setSelectedGrade] = useState<Grade | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [previewPdf, setPreviewPdf] = useState<{ url: string; title: string } | null>(null);

  // Edit Metadata State
  const [editingMetadata, setEditingMetadata] = useState<CurriculumMetadata | null>(null);

  // Content Processing Tracking Data
  const [pageRecords, setPageRecords] = useState<PageProcessingRecord[]>([
    {
      id: 'p-m9-042',
      subjectId: 'math-grade9',
      subjectName: 'Mathematics',
      grade: 9,
      unit: 2,
      unitTitle: 'Equations and Inequalities',
      section: '2.1',
      lesson: 'Linear Equations in One Variable',
      topic: 'Solving Multi-Step Equations',
      learningOutcome: 'Apply algebraic properties to isolate variables in multi-step equations',
      pageNumber: 42,
      status: 'PROCESSED',
      chunksExtracted: 4,
      lastAttempt: '2026-09-18 10:15',
    },
    {
      id: 'p-m9-043',
      subjectId: 'math-grade9',
      subjectName: 'Mathematics',
      grade: 9,
      unit: 2,
      unitTitle: 'Equations and Inequalities',
      section: '2.1',
      lesson: 'Linear Equations in One Variable',
      topic: 'Word Problems with Equations',
      learningOutcome: 'Formulate linear equations from practical real-world problems',
      pageNumber: 43,
      status: 'PROCESSED',
      chunksExtracted: 5,
      lastAttempt: '2026-09-18 10:16',
    },
    {
      id: 'p-p9-087',
      subjectId: 'physics-grade9',
      subjectName: 'Physics',
      grade: 9,
      unit: 3,
      unitTitle: 'Motion in a Straight Line',
      section: '3.2',
      lesson: 'Uniform Accelerated Motion',
      topic: 'Equations of Motion',
      learningOutcome: 'Derive and solve kinematic equations for uniformly accelerated motion',
      pageNumber: 87,
      status: 'FAILED',
      chunksExtracted: 0,
      lastAttempt: '2026-09-20 14:22',
      errorMessage: 'Complex SVG diagram formula failed OCR vectorization',
    },
    {
      id: 'p-b10-112',
      subjectId: 'bio-grade10',
      subjectName: 'Biology',
      grade: 10,
      unit: 4,
      unitTitle: 'Genetics and Heredity',
      section: '4.1',
      lesson: 'Mendelian Genetics',
      topic: 'Punnett Square Analysis',
      learningOutcome: 'Construct and interpret monohybrid cross Punnett squares',
      pageNumber: 112,
      status: 'REVIEW_REQUIRED',
      chunksExtracted: 3,
      lastAttempt: '2026-09-21 09:30',
      errorMessage: 'Low OCR confidence on botanical diagram terminology',
    },
    {
      id: 'p-c11-065',
      subjectId: 'chem-grade11',
      subjectName: 'Chemistry',
      grade: 11,
      unit: 2,
      unitTitle: 'Atomic Structure and Periodicity',
      section: '2.3',
      lesson: 'Electron Configuration',
      topic: 'Quantum Numbers',
      learningOutcome: 'Determine all four quantum numbers for valence electrons',
      pageNumber: 65,
      status: 'PROCESSED',
      chunksExtracted: 6,
      lastAttempt: '2026-09-19 16:40',
    },
    {
      id: 'p-m12-140',
      subjectId: 'math-grade12',
      subjectName: 'Mathematics',
      grade: 12,
      unit: 3,
      unitTitle: 'Introduction to Calculus',
      section: '3.1',
      lesson: 'Limits and Continuity',
      topic: 'Evaluating Limits Analytically',
      learningOutcome: 'Calculate limits using factorization and conjugate multiplication',
      pageNumber: 140,
      status: 'PROCESSING',
      chunksExtracted: 2,
      lastAttempt: '2026-09-22 08:12',
    },
  ]);

  const [retryingId, setRetryingId] = useState<string | null>(null);

  const togglePublish = (subjectId: string) => {
    setList((prev) =>
      prev.map((item) =>
        item.subjectId === subjectId ? { ...item, isPublished: !item.isPublished } : item
      )
    );
  };

  const handleSaveMetadata = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMetadata) return;

    setList((prev) =>
      prev.map((item) => (item.subjectId === editingMetadata.subjectId ? editingMetadata : item))
    );

    await adminAuditService.logAction(
      'CURRICULUM_UPDATED',
      `${editingMetadata.subjectName} (Grade ${editingMetadata.grade})`,
      'SUCCESS',
      {
        publisher: editingMetadata.publisher,
        unitsCount: editingMetadata.unitsCount,
        topicsCount: editingMetadata.topicsCount,
        coveragePercentage: editingMetadata.coveragePercentage,
      }
    );

    setEditingMetadata(null);
  };

  const handleRetryProcessing = async (id: string) => {
    setRetryingId(id);
    await new Promise((r) => setTimeout(r, 1200));

    setPageRecords((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              status: 'PROCESSED',
              chunksExtracted: Math.max(3, p.chunksExtracted + 2),
              errorMessage: undefined,
              lastAttempt: new Date().toLocaleString(),
            }
          : p
      )
    );

    await adminAuditService.logAction(
      'CONTENT_PROCESSING_RETRY',
      `Page Record: ${id}`,
      'SUCCESS',
      { recordId: id }
    );

    setRetryingId(null);
  };

  // Content processing stats
  const processingStats = useMemo(() => {
    const totalPages = 4120; // 18 MoE Textbooks combined
    const processedPages = 3980;
    const pendingPages = 75;
    const failedPages = 38;
    const reviewRequiredPages = 27;
    const coveragePercentage = Math.round((processedPages / totalPages) * 100);

    return {
      totalPages,
      processedPages,
      pendingPages,
      failedPages,
      reviewRequiredPages,
      coveragePercentage,
    };
  }, []);

  const filteredTextbooks = list.filter((item) => {
    const matchesSearch =
      item.subjectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.textbookTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = selectedGrade === 'all' || item.grade === selectedGrade;
    return matchesSearch && matchesGrade;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-blue-100 text-blue-900 font-mono">
              FDRE MoE CURRICULUM CONTROL
            </span>
            <span className="text-xs text-stone-500 font-mono">2019 ዓ.ም Syllabus Edition</span>
          </div>
          <h2 className="text-lg font-bold text-stone-900 font-serif-ethiopic flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-700" />
            <span>የስርዓተ-ትምህርትና የመማሪያ መጽሐፍት መቆጣጠሪያ (Curriculum & Content Processing)</span>
          </h2>
          <p className="text-xs text-stone-500">
            Hierarchy: Grade → Subject → Unit → Section → Lesson → Topic → Learning Outcome. 18 Verified Textbooks.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center bg-stone-100 p-1 rounded-xl border border-stone-200">
          <button
            onClick={() => setActiveSubView('textbooks')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeSubView === 'textbooks'
                ? 'bg-white text-stone-900 shadow-2xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            መማሪያ መጽሐፍት (18 Textbooks)
          </button>
          <button
            onClick={() => setActiveSubView('processing_monitor')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeSubView === 'processing_monitor'
                ? 'bg-white text-stone-900 shadow-2xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <span>Processing Monitor</span>
            {processingStats.failedPages > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                {processingStats.failedPages}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* VIEW 1: TEXTBOOKS OVERVIEW & METADATA */}
      {activeSubView === 'textbooks' && (
        <div className="space-y-5">
          {/* Filters & Search */}
          <div className="flex flex-col sm:flex-row items-center gap-3 bg-stone-50 p-3.5 rounded-2xl border border-stone-200">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search textbook by title, subject name, or edition..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>

            <div className="flex items-center gap-1 w-full sm:w-auto overflow-x-auto">
              <span className="text-xs font-bold text-stone-500 mr-1 shrink-0">ክፍል (Grade):</span>
              {(['all', 9, 10, 11, 12] as const).map((g) => (
                <button
                  key={g}
                  onClick={() => setSelectedGrade(g)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl transition cursor-pointer ${
                    selectedGrade === g
                      ? 'bg-blue-700 text-white shadow-2xs'
                      : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  {g === 'all' ? 'All' : `Grade ${g}`}
                </button>
              ))}
            </div>
          </div>

          {/* Textbooks Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTextbooks.map((item) => (
              <div
                key={item.subjectId}
                className="bg-white rounded-2xl border border-stone-200 p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-800 border border-blue-200 font-mono">
                      Grade {item.grade} • {item.stream.toUpperCase()}
                    </span>
                    <button
                      onClick={() => setEditingMetadata(item)}
                      className="p-1 text-stone-400 hover:text-stone-700 rounded-md transition"
                      title="Edit metadata"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h4 className="text-base font-bold text-stone-900 font-serif-ethiopic">
                    {item.subjectName}
                  </h4>
                  <p className="text-xs text-stone-600 mt-1 line-clamp-2">
                    {item.textbookTitle}
                  </p>

                  <div className="mt-3 space-y-1.5 text-xs text-stone-500">
                    <div className="flex items-center justify-between">
                      <span>አሳታሚ (Publisher):</span>
                      <span className="font-semibold text-stone-700 text-[11px] truncate max-w-[170px]">
                        {item.publisher}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>የገጽ ብዛት (Pages):</span>
                      <span className="font-semibold text-stone-700">{item.pageCount} Pages</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Units & Topics:</span>
                      <span className="font-semibold text-stone-700">
                        {item.unitsCount} Units ({item.topicsCount} Topics)
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>AI/RAG Coverage:</span>
                      <span className="font-semibold text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        {item.coveragePercentage}% Indexed
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                  <button
                    onClick={() => setPreviewPdf({ url: `/textbooks/${item.pdfFileName}`, title: item.textbookTitle })}
                    className="px-2.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5 text-blue-700" />
                    <span>📘 PDF አንብብ</span>
                  </button>

                  <button
                    onClick={() => togglePublish(item.subjectId)}
                    className="flex items-center gap-1.5 text-xs font-bold cursor-pointer transition-colors"
                  >
                    {item.isPublished ? (
                      <span className="text-emerald-700 flex items-center gap-1">
                        <ToggleRight className="w-5 h-5 text-emerald-600" />
                        <span>የታተመ (Active)</span>
                      </span>
                    ) : (
                      <span className="text-stone-400 flex items-center gap-1">
                        <ToggleLeft className="w-5 h-5 text-stone-400" />
                        <span>ረቂቅ (Draft)</span>
                      </span>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 2: CONTENT PROCESSING MONITOR (Requirement #10) */}
      {activeSubView === 'processing_monitor' && (
        <div className="space-y-6">
          {/* Summary Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-2xs">
              <div className="text-[10px] font-bold text-stone-400 uppercase">Total Pages</div>
              <div className="text-xl font-black text-stone-900 font-mono mt-0.5">
                {processingStats.totalPages.toLocaleString()}
              </div>
              <div className="text-[10px] text-stone-400">18 Textbooks</div>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-2xs">
              <div className="text-[10px] font-bold text-stone-400 uppercase">PROCESSED</div>
              <div className="text-xl font-black text-emerald-700 font-mono mt-0.5">
                {processingStats.processedPages.toLocaleString()}
              </div>
              <div className="text-[10px] text-emerald-600 font-bold">RAG Ready</div>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-2xs">
              <div className="text-[10px] font-bold text-stone-400 uppercase">PENDING</div>
              <div className="text-xl font-black text-blue-700 font-mono mt-0.5">
                {processingStats.pendingPages}
              </div>
              <div className="text-[10px] text-stone-400">In Pipeline</div>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-2xs">
              <div className="text-[10px] font-bold text-stone-400 uppercase">FAILED</div>
              <div className="text-xl font-black text-rose-700 font-mono mt-0.5">
                {processingStats.failedPages}
              </div>
              <div className="text-[10px] text-rose-600 font-bold">Requires Action</div>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-2xs">
              <div className="text-[10px] font-bold text-stone-400 uppercase">REVIEW REQ.</div>
              <div className="text-xl font-black text-amber-700 font-mono mt-0.5">
                {processingStats.reviewRequiredPages}
              </div>
              <div className="text-[10px] text-stone-400">Low OCR Score</div>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-2xs">
              <div className="text-[10px] font-bold text-stone-400 uppercase">COVERAGE</div>
              <div className="text-xl font-black text-emerald-800 font-mono mt-0.5">
                {processingStats.coveragePercentage}%
              </div>
              <div className="text-[10px] text-stone-400">Total FDRE Syllabus</div>
            </div>
          </div>

          {/* Page Processing Queue Table */}
          <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-stone-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-stone-900 font-serif-ethiopic flex items-center gap-2">
                  <Layers className="w-4 h-4 text-blue-700" />
                  <span>የገጾችና የትምህርት ክፍሎች ሂደት ክትትል (Page-Level Processing Monitor)</span>
                </h3>
                <p className="text-xs text-stone-500">
                  Inspect OCR vectors, lesson hierarchy, failed parsing diagrams, and trigger manual retry.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 text-stone-500 font-bold uppercase tracking-wider text-[10px] border-b border-stone-200">
                  <tr>
                    <th className="py-3 px-4">Subject & Grade</th>
                    <th className="py-3 px-4">Curriculum Hierarchy (Unit / Section / Lesson)</th>
                    <th className="py-3 px-4">Page</th>
                    <th className="py-3 px-4">Learning Outcome</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {pageRecords.map((record) => (
                    <tr key={record.id} className="hover:bg-stone-50/70 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-stone-900">{record.subjectName}</div>
                        <div className="text-[10px] text-stone-400 font-mono">Grade {record.grade}</div>
                      </td>
                      <td className="py-3 px-4 max-w-[240px]">
                        <div className="font-bold text-stone-800 truncate">
                          Unit {record.unit}: {record.unitTitle}
                        </div>
                        <div className="text-[11px] text-stone-500 truncate">
                          § {record.section} • {record.lesson}
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-stone-700">
                        p. {record.pageNumber}
                      </td>
                      <td className="py-3 px-4 max-w-[220px]">
                        <p className="text-[11px] text-stone-600 line-clamp-2" title={record.learningOutcome}>
                          {record.learningOutcome}
                        </p>
                      </td>
                      <td className="py-3 px-4">
                        {record.status === 'PROCESSED' && (
                          <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-[11px]">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            PROCESSED ({record.chunksExtracted} chunks)
                          </span>
                        )}
                        {record.status === 'PROCESSING' && (
                          <span className="inline-flex items-center gap-1 text-blue-700 font-bold text-[11px]">
                            <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                            PROCESSING
                          </span>
                        )}
                        {record.status === 'FAILED' && (
                          <div>
                            <span className="inline-flex items-center gap-1 text-rose-700 font-bold text-[11px]">
                              <AlertTriangle className="w-3.5 h-3.5" />
                              FAILED
                            </span>
                            {record.errorMessage && (
                              <div className="text-[10px] text-rose-600 mt-0.5 line-clamp-1" title={record.errorMessage}>
                                {record.errorMessage}
                              </div>
                            )}
                          </div>
                        )}
                        {record.status === 'REVIEW_REQUIRED' && (
                          <div>
                            <span className="inline-flex items-center gap-1 text-amber-700 font-bold text-[11px]">
                              <Clock className="w-3.5 h-3.5" />
                              REVIEW_REQUIRED
                            </span>
                            {record.errorMessage && (
                              <div className="text-[10px] text-amber-600 mt-0.5 line-clamp-1" title={record.errorMessage}>
                                {record.errorMessage}
                              </div>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {(record.status === 'FAILED' || record.status === 'REVIEW_REQUIRED') && (
                          <button
                            onClick={() => handleRetryProcessing(record.id)}
                            disabled={retryingId === record.id}
                            className="px-2.5 py-1 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-bold transition cursor-pointer disabled:opacity-50 inline-flex items-center gap-1"
                          >
                            <RotateCcw className={`w-3 h-3 ${retryingId === record.id ? 'animate-spin' : ''}`} />
                            <span>Retry</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Edit Metadata Modal */}
      {editingMetadata && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <form
            onSubmit={handleSaveMetadata}
            className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-stone-200 p-6 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-bold text-sm text-stone-900 font-serif-ethiopic flex items-center gap-2">
                <Edit className="w-4 h-4 text-blue-700" />
                <span>የስርዓተ-ትምህርት መረጃ ማስተካከያ (Edit Curriculum Metadata)</span>
              </h3>
              <button
                type="button"
                onClick={() => setEditingMetadata(null)}
                className="text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">የትምህርት ዓይነት (Subject):</label>
                <input
                  type="text"
                  value={editingMetadata.subjectName}
                  disabled
                  className="w-full p-2 bg-stone-100 border border-stone-200 rounded-xl text-stone-600"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">የመጽሐፍ ርዕስ (Textbook Title):</label>
                <input
                  type="text"
                  value={editingMetadata.textbookTitle}
                  onChange={(e) =>
                    setEditingMetadata({ ...editingMetadata, textbookTitle: e.target.value })
                  }
                  className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">አሳታሚ (Publisher):</label>
                  <input
                    type="text"
                    value={editingMetadata.publisher}
                    onChange={(e) =>
                      setEditingMetadata({ ...editingMetadata, publisher: e.target.value })
                    }
                    className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">እትም (Curriculum Edition):</label>
                  <input
                    type="text"
                    value={editingMetadata.curriculumEdition}
                    onChange={(e) =>
                      setEditingMetadata({ ...editingMetadata, curriculumEdition: e.target.value })
                    }
                    className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">ገጾች (Pages):</label>
                  <input
                    type="number"
                    value={editingMetadata.pageCount}
                    onChange={(e) =>
                      setEditingMetadata({ ...editingMetadata, pageCount: Number(e.target.value) })
                    }
                    className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">ክፍለ-ትምህርቶች (Units):</label>
                  <input
                    type="number"
                    value={editingMetadata.unitsCount}
                    onChange={(e) =>
                      setEditingMetadata({ ...editingMetadata, unitsCount: Number(e.target.value) })
                    }
                    className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">ርዕሰ-ጉዳዮች (Topics):</label>
                  <input
                    type="number"
                    value={editingMetadata.topicsCount}
                    onChange={(e) =>
                      setEditingMetadata({ ...editingMetadata, topicsCount: Number(e.target.value) })
                    }
                    className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setEditingMetadata(null)}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold cursor-pointer"
              >
                ይቅር (Cancel)
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold transition cursor-pointer"
              >
                አስቀምጥ (Save Changes)
              </button>
            </div>
          </form>
        </div>
      )}

      {/* PDF Modal Viewer */}
      {previewPdf && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden shadow-2xl border border-stone-300">
            <div className="p-4 bg-stone-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-400" />
                <h4 className="text-sm font-bold truncate max-w-xl">{previewPdf.title}</h4>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={previewPdf.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 bg-stone-800 hover:bg-stone-700 text-white text-xs font-bold rounded-lg flex items-center gap-1"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>በአዲስ ታብ ክፈት (Open in Tab)</span>
                </a>
                <button
                  onClick={() => setPreviewPdf(null)}
                  className="p-1 text-stone-400 hover:text-white text-lg font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="flex-1 bg-stone-200">
              <iframe
                src={previewPdf.url}
                className="w-full h-full border-none"
                title={previewPdf.title}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
