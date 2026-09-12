import React, { useState } from 'react';
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
} from 'lucide-react';
import { CurriculumMetadata } from '../../types/adminDashboard';
import { Grade } from '../../types';

interface AdminCurriculumSectionProps {
  metadataList: CurriculumMetadata[];
}

export const AdminCurriculumSection: React.FC<AdminCurriculumSectionProps> = ({
  metadataList,
}) => {
  const [list, setList] = useState<CurriculumMetadata[]>(metadataList);
  const [selectedGrade, setSelectedGrade] = useState<Grade | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [previewPdf, setPreviewPdf] = useState<{ url: string; title: string } | null>(null);

  const togglePublish = (subjectId: string) => {
    setList((prev) =>
      prev.map((item) =>
        item.subjectId === subjectId ? { ...item, isPublished: !item.isPublished } : item
      )
    );
  };

  const filtered = list.filter((item) => {
    const matchesSearch =
      item.subjectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.textbookTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = selectedGrade === 'all' || item.grade === selectedGrade;
    return matchesSearch && matchesGrade;
  });

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
        <div>
          <h3 className="text-lg font-bold text-stone-900 font-serif-ethiopic flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-700" />
            <span>የስርዓተ-ትምህርት እና የመማሪያ መጽሐፍት አስተዳደር (Curriculum Management)</span>
          </h3>
          <p className="text-xs text-stone-500">
            Ethiopian Ministry of Education (FDRE MoE) official textbooks, syllabus editions, coverage, and page references
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-bold border border-emerald-200 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>18 Real MoE Textbooks Verified</span>
          </span>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-stone-50 p-3 rounded-xl border border-stone-200">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search textbook by title, subject name, or edition..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600"
          />
        </div>

        <div className="flex items-center gap-1 w-full sm:w-auto overflow-x-auto">
          <span className="text-xs font-bold text-stone-500 mr-1 shrink-0">ክፍል (Grade):</span>
          {(['all', 9, 10, 11, 12] as const).map((g) => (
            <button
              key={g}
              onClick={() => setSelectedGrade(g)}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                selectedGrade === g
                  ? 'bg-blue-700 text-white shadow-2xs'
                  : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100'
              }`}
            >
              {g === 'all' ? 'All Grades' : `Grade ${g}`}
            </button>
          ))}
        </div>
      </div>

      {/* Textbooks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((item) => (
          <div
            key={item.subjectId}
            className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
                  Grade {item.grade} • {item.stream.toUpperCase()}
                </span>
                <span className="text-[10px] text-stone-400 font-mono">{item.version}</span>
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
                  <span>ክፍለ-ትምህርቶች (Units / Topics):</span>
                  <span className="font-semibold text-stone-700">{item.unitsCount} Units ({item.topicsCount} Topics)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>AI/RAG ሽፋን (Coverage):</span>
                  <span className="font-semibold text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    {item.coveragePercentage}% Indexed
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
              {/* Live PDF Viewer button */}
              <button
                onClick={() => setPreviewPdf({ url: `/textbooks/${item.pdfFileName}`, title: item.textbookTitle })}
                className="px-2.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                title="Open and read the real textbook PDF"
              >
                <FileText className="w-3.5 h-3.5 text-blue-700" />
                <span>📘 ኦፊሴላዊ መጽሐፍ (PDF)</span>
              </button>

              {/* Publish Toggle */}
              <button
                onClick={() => togglePublish(item.subjectId)}
                className="flex items-center gap-1.5 text-xs font-bold cursor-pointer transition-colors"
              >
                {item.isPublished ? (
                  <span className="text-emerald-700 flex items-center gap-1">
                    <ToggleRight className="w-5 h-5 text-emerald-600" />
                    <span>የታተመ (Published)</span>
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
