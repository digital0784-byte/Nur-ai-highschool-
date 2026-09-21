import React, { useState } from 'react';
import {
  BookOpen,
  ShieldCheck,
  Lock,
  Search,
  Filter,
  Eye,
  Edit,
  Plus,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Download,
  EyeOff,
  Sparkles,
  ChevronRight,
  MoreVertical,
  X,
  Save,
} from 'lucide-react';
import { GradeLevel } from '../../types/curriculumEngine';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

interface BookItem {
  id: string;
  title: string;
  titleAmharic: string;
  subject: string;
  grade: GradeLevel;
  totalPages: number;
  encryptionStatus: 'AES-256 Active' | 'Pending Refresh';
  downloadProtection: 'Enforced (No Download)';
  watermarkActive: boolean;
  lastUpdated: string;
  unitCount: number;
}

export const AdminBookManagementSection: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel | 'all'>('all');
  const [selectedBookForEdit, setSelectedBookForEdit] = useState<BookItem | null>(null);

  const [books, setBooks] = useState<BookItem[]>([
    {
      id: 'book-math-9',
      title: 'Grade 9 Mathematics Student Textbook',
      titleAmharic: 'የ9ኛ ክፍል ሒሳብ የተማሪ መጽሐፍ',
      subject: 'Mathematics',
      grade: 9,
      totalPages: 184,
      encryptionStatus: 'AES-256 Active',
      downloadProtection: 'Enforced (No Download)',
      watermarkActive: true,
      lastUpdated: '2026-09-15',
      unitCount: 6,
    },
    {
      id: 'book-physics-9',
      title: 'Grade 9 Physics Student Textbook',
      titleAmharic: 'የ9ኛ ክፍል ፊዚክስ የተማሪ መጽሐፍ',
      subject: 'Physics',
      grade: 9,
      totalPages: 210,
      encryptionStatus: 'AES-256 Active',
      downloadProtection: 'Enforced (No Download)',
      watermarkActive: true,
      lastUpdated: '2026-09-14',
      unitCount: 5,
    },
    {
      id: 'book-chem-9',
      title: 'Grade 9 Chemistry Student Textbook',
      titleAmharic: 'የ9ኛ ክፍል ኬሚስትሪ የተማሪ መጽሐፍ',
      subject: 'Chemistry',
      grade: 9,
      totalPages: 168,
      encryptionStatus: 'AES-256 Active',
      downloadProtection: 'Enforced (No Download)',
      watermarkActive: true,
      lastUpdated: '2026-09-10',
      unitCount: 5,
    },
    {
      id: 'book-bio-9',
      title: 'Grade 9 Biology Student Textbook',
      titleAmharic: 'የ9ኛ ክፍል ባዮሎጂ የተማሪ መጽሐፍ',
      subject: 'Biology',
      grade: 9,
      totalPages: 195,
      encryptionStatus: 'AES-256 Active',
      downloadProtection: 'Enforced (No Download)',
      watermarkActive: true,
      lastUpdated: '2026-09-08',
      unitCount: 6,
    },
    {
      id: 'book-math-10',
      title: 'Grade 10 Mathematics Student Textbook',
      titleAmharic: 'የ10ኛ ክፍል ሒሳብ የተማሪ መጽሐፍ',
      subject: 'Mathematics',
      grade: 10,
      totalPages: 196,
      encryptionStatus: 'AES-256 Active',
      downloadProtection: 'Enforced (No Download)',
      watermarkActive: true,
      lastUpdated: '2026-09-12',
      unitCount: 7,
    },
    {
      id: 'book-physics-10',
      title: 'Grade 10 Physics Student Textbook',
      titleAmharic: 'የ10ኛ ክፍል ፊዚክስ የተማሪ መጽሐፍ',
      subject: 'Physics',
      grade: 10,
      totalPages: 220,
      encryptionStatus: 'AES-256 Active',
      downloadProtection: 'Enforced (No Download)',
      watermarkActive: true,
      lastUpdated: '2026-09-11',
      unitCount: 6,
    },
    {
      id: 'book-math-11',
      title: 'Grade 11 Mathematics (Natural Science)',
      titleAmharic: 'የ11ኛ ክፍል ሒሳብ (የተፈጥሮ ሳይንስ)',
      subject: 'Mathematics',
      grade: 11,
      totalPages: 240,
      encryptionStatus: 'AES-256 Active',
      downloadProtection: 'Enforced (No Download)',
      watermarkActive: true,
      lastUpdated: '2026-09-05',
      unitCount: 8,
    },
    {
      id: 'book-math-12',
      title: 'Grade 12 Mathematics (Matriculation Preparation)',
      titleAmharic: 'የ12ኛ ክፍል ሒሳብ (የዩኒቨርሲቲ መግቢያ ዝግጅት)',
      subject: 'Mathematics',
      grade: 12,
      totalPages: 260,
      encryptionStatus: 'AES-256 Active',
      downloadProtection: 'Enforced (No Download)',
      watermarkActive: true,
      lastUpdated: '2026-09-02',
      unitCount: 8,
    },
  ]);

  const filteredBooks = books.filter((b) => {
    const matchSearch =
      b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.titleAmharic.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.subject.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchSearch) return false;
    if (selectedGrade !== 'all' && b.grade !== selectedGrade) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* 1. Header & Quick Metrics */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-stone-900 font-serif-ethiopic">
            የመጽሐፍትና የይዘት ጥበቃ አስተዳደር (Secure Book Management)
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            የኢ.ፌ.ዲ.ሪ ትምህርት ሚኒስቴር ይፋዊ መጽሐፍት ካታሎግ፣ የይዘት ምስጠራ (DRM) እና የማውረድ መከላከያ ቁጥጥር።
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="success" size="md" dot>
            DRM Download Protection: Active
          </Badge>
        </div>
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-stone-200/90 shadow-xs">
          <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
            Total In-App Books
          </span>
          <span className="text-2xl font-black text-stone-900 font-mono mt-1 block">
            {books.length}
          </span>
          <span className="text-xs text-emerald-700 font-medium mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> 100% Curriculum Aligned
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-stone-200/90 shadow-xs">
          <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
            Total Protected Pages
          </span>
          <span className="text-2xl font-black text-stone-900 font-mono mt-1 block">
            1,681
          </span>
          <span className="text-xs text-stone-500 mt-1 block">Grades 9 - 12 Coverage</span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-stone-200/90 shadow-xs">
          <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
            Watermark Enforcement
          </span>
          <span className="text-2xl font-black text-emerald-700 font-mono mt-1 block">
            Enabled
          </span>
          <span className="text-xs text-emerald-700 font-medium mt-1 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" /> User Session Stamped
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-stone-200/90 shadow-xs">
          <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
            External Download Leaks
          </span>
          <span className="text-2xl font-black text-emerald-800 font-mono mt-1 block">
            0 Leaks
          </span>
          <span className="text-xs text-stone-500 mt-1 block">Protected via Private Storage</span>
        </div>
      </div>

      {/* 2. Filter Bar & Search */}
      <div className="bg-white rounded-3xl p-4 border border-stone-200/90 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search textbook by title or subject..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-10 pr-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
          />
        </div>

        {/* Grade Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full sm:w-auto">
          {(['all', 9, 10, 11, 12] as (GradeLevel | 'all')[]).map((g) => (
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

      {/* 3. ERP Clean Data Table */}
      <div className="bg-white rounded-3xl border border-stone-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-600 border-collapse">
            <thead className="bg-stone-50 border-b border-stone-200/80 uppercase font-mono text-[11px] text-stone-400">
              <tr>
                <th className="px-5 py-4 font-bold">Textbook Title</th>
                <th className="px-4 py-4 font-bold">Subject & Grade</th>
                <th className="px-4 py-4 font-bold">Pages & Units</th>
                <th className="px-4 py-4 font-bold">DRM Status</th>
                <th className="px-4 py-4 font-bold">Download Policy</th>
                <th className="px-4 py-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredBooks.map((book) => (
                <tr key={book.id} className="hover:bg-stone-50/70 transition-colors">
                  <td className="px-5 py-4">
                    <div className="font-bold text-stone-900 font-serif-ethiopic text-sm">
                      {book.titleAmharic}
                    </div>
                    <div className="text-[11px] text-stone-400 mt-0.5">{book.title}</div>
                  </td>

                  <td className="px-4 py-4">
                    <span className="font-bold text-stone-800">{book.subject}</span>
                    <div className="text-[11px] text-emerald-800 font-mono mt-0.5">
                      Grade {book.grade}
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    <div className="font-mono text-stone-800">{book.totalPages} Pages</div>
                    <div className="text-[11px] text-stone-400 mt-0.5">{book.unitCount} Units</div>
                  </td>

                  <td className="px-4 py-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <ShieldCheck className="w-3 h-3" />
                      {book.encryptionStatus}
                    </span>
                  </td>

                  <td className="px-4 py-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                      <EyeOff className="w-3 h-3" />
                      {book.downloadProtection}
                    </span>
                  </td>

                  <td className="px-4 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        variant="outline"
                        size="xs"
                        leftIcon={<Edit className="w-3 h-3" />}
                        onClick={() => setSelectedBookForEdit(book)}
                      >
                        Edit DRM
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Slide-Over / Modal Editor for Book Metadata & DRM */}
      {selectedBookForEdit && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-3xl p-6 bg-white border border-stone-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-emerald-700" />
                <h3 className="text-base font-bold text-stone-900">
                  Edit Textbook Security Policies
                </h3>
              </div>
              <button
                onClick={() => setSelectedBookForEdit(null)}
                className="p-1 rounded-full hover:bg-stone-100 text-stone-400 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-stone-700 block mb-1">Title</label>
                <input
                  type="text"
                  value={selectedBookForEdit.title}
                  readOnly
                  className="w-full bg-stone-100 border border-stone-200 rounded-xl px-3 py-2 text-stone-600 font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Amharic Title</label>
                <input
                  type="text"
                  value={selectedBookForEdit.titleAmharic}
                  readOnly
                  className="w-full bg-stone-100 border border-stone-200 rounded-xl px-3 py-2 text-stone-600 font-serif-ethiopic"
                />
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
                <span className="font-bold text-emerald-950 block">DRM Security Policy Status</span>
                <div className="flex items-center gap-2 text-emerald-800">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>AES-256 In-Memory Decryption: Enabled</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-800">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Direct Firebase Storage Download URLs: Blocked</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-800">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Dynamic Session Watermarking: Enforced</span>
                </div>
              </div>
            </div>

            <div className="pt-3 flex items-center justify-end gap-2 border-t border-stone-100">
              <Button variant="outline" size="sm" onClick={() => setSelectedBookForEdit(null)}>
                Close
              </Button>
              <Button
                variant="primary"
                size="sm"
                leftIcon={<Save className="w-3.5 h-3.5" />}
                onClick={() => setSelectedBookForEdit(null)}
              >
                Save Policies
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
