import React, { useState, useMemo } from 'react';
import { X, Download, BookOpen, Search, CheckCircle, ExternalLink, Layers, GraduationCap } from 'lucide-react';
import { Grade, Subject } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { getAllTextbooksForSubject, getTextbook } from '../data/textbooksData';
import { generateTextbookPdf } from '../utils/pdfGenerator';

interface AllTextbooksModalProps {
  isOpen: boolean;
  onClose: () => void;
  subjects: Subject[];
  onSelectSubjectAndGrade: (subjectId: string, grade: Grade) => void;
}

export const AllTextbooksModal: React.FC<AllTextbooksModalProps> = ({
  isOpen,
  onClose,
  subjects,
  onSelectSubjectAndGrade,
}) => {
  const { t } = useLanguage();
  const [selectedGradeFilter, setSelectedGradeFilter] = useState<Grade | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [downloadingKey, setDownloadingKey] = useState<string | null>(null);

  // Flatten all textbooks
  const allBooks = useMemo(() => {
    const list: {
      subject: Subject;
      grade: Grade;
      title: string;
      description: string;
      unitsCount: number;
      curriculumBadge: string;
    }[] = [];

    subjects.forEach((subj) => {
      const subjectBooks = getAllTextbooksForSubject(subj.id);
      subjectBooks.forEach((book) => {
        list.push({
          subject: subj,
          grade: book.grade,
          title: book.title,
          description: book.description,
          unitsCount: book.units.length || book.totalUnits,
          curriculumBadge: book.curriculumBadge,
        });
      });
    });

    return list;
  }, [subjects]);

  // Filtered books
  const filteredBooks = useMemo(() => {
    return allBooks.filter((item) => {
      const matchesGrade =
        selectedGradeFilter === 'all' || item.grade === selectedGradeFilter;
      const q = searchQuery.toLowerCase();
      const matchesQuery =
        !q ||
        item.subject.name.toLowerCase().includes(q) ||
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.grade.toString().includes(q);
      return matchesGrade && matchesQuery;
    });
  }, [allBooks, selectedGradeFilter, searchQuery]);

  if (!isOpen) return null;

  const handleDownload = (subject: Subject, grade: Grade) => {
    const key = `${subject.id}-${grade}`;
    setDownloadingKey(key);
    try {
      const textbook = getTextbook(subject.id, grade);
      if (textbook) {
        generateTextbookPdf(textbook, subject.name, grade);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setTimeout(() => setDownloadingKey(null), 500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
      <div
        id="all-textbooks-modal-card"
        className="bg-[#FAF6EC] border-[2px] border-[#38332D] w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
      >
        {/* Modal Header */}
        <div className="bg-[#38332D] text-[#FAF6EC] px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-[#FAF6EC] text-[#38332D]">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold font-serif-ethiopic">
                {t.allSubjectsPdfLibraryTitle} (FDRE MoE)
              </h2>
              <p className="text-xs text-[#DCD1BE] font-serif-ethiopic">
                የኢ.ፌ.ዲ.ሪ ትምህርት ሚኒስቴር የሁለተኛ ደረጃ (ክፍል 9 - 12) የተማሪ መማሪያ መጽሐፍት
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#DCD1BE] hover:text-[#FAF6EC] hover:bg-[#524B43] rounded-xs cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-[#F2ECE0] border-b-[1.5px] border-[#38332D] p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Grade filter tabs */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            <span className="text-xs font-bold font-serif-ethiopic text-[#645A4B] mr-1 shrink-0">
              {t.gradeTierPrefix}:
            </span>
            {(['all', 9, 10, 11, 12] as (Grade | 'all')[]).map((g) => {
              const isSelected = selectedGradeFilter === g;
              return (
                <button
                  key={g}
                  onClick={() => setSelectedGradeFilter(g)}
                  className={`px-3 py-1 text-xs font-bold font-serif-ethiopic border transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-[#38332D] text-[#FAF6EC] border-[#38332D]'
                      : 'bg-[#FAF6EC] text-[#4F4639] border-[#BFB29E] hover:bg-[#EAE1D1]'
                  }`}
                >
                  {g === 'all' ? 'ሁሉም (All Grades)' : `${t.gradeTierPrefix} ${g}`}
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#857967]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="የትምህርት አይነት ፈልግ (Search)..."
              className="w-full pl-9 pr-3 py-1.5 text-xs font-serif-ethiopic bg-[#FAF6EC] border border-[#38332D] text-[#24211E] placeholder-[#8C806E] focus:outline-none"
            />
          </div>
        </div>

        {/* Textbooks Grid */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredBooks.map((item) => {
              const key = `${item.subject.id}-${item.grade}`;
              const isDownloading = downloadingKey === key;

              return (
                <div
                  key={key}
                  className="border-[1.5px] border-[#38332D] bg-[#FAF6EC] p-4 flex flex-col justify-between space-y-3 hover:shadow-sm transition-all"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-bold font-serif-ethiopic bg-[#38332D] text-[#FAF6EC]">
                        <GraduationCap className="w-3 h-3" />
                        {t.gradeTierPrefix} {item.grade}
                      </span>
                      <span className="text-[10px] font-serif-ethiopic bg-[#EBE2D2] border border-[#C5B8A4] px-1.5 py-0.5 text-[#5A5040] truncate max-w-[180px]">
                        {item.unitsCount} {t.unitLabel}s • {item.curriculumBadge}
                      </span>
                    </div>

                    <h3 className="text-sm sm:text-base font-bold font-serif-ethiopic text-[#1A1815] leading-snug">
                      {item.subject.name} - {t.gradeTierPrefix} {item.grade}
                    </h3>
                    <p className="text-xs font-serif-ethiopic text-[#5C5346] line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2 border-t border-[#E3D8C7]">
                    <button
                      onClick={() => handleDownload(item.subject, item.grade)}
                      disabled={isDownloading}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 text-xs font-bold font-serif-ethiopic bg-[#2E6B4A] hover:bg-[#235338] text-white border border-[#1D4A32] transition-colors cursor-pointer disabled:opacity-50"
                      title="Download PDF"
                    >
                      <Download className="w-3.5 h-3.5" />
                      {isDownloading ? t.downloadingPdfLabel : t.downloadPdfBtn}
                    </button>

                    <button
                      onClick={() => {
                        onSelectSubjectAndGrade(item.subject.id, item.grade);
                        onClose();
                      }}
                      className="flex items-center justify-center gap-1 py-2 px-3 text-xs font-bold font-serif-ethiopic bg-[#FAF6EC] hover:bg-[#EBE3D3] text-[#38332D] border border-[#38332D] transition-colors cursor-pointer"
                      title="Read in App"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      {t.textbookBtn}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredBooks.length === 0 && (
            <div className="p-8 text-center text-sm font-serif-ethiopic text-[#756A59]">
              ምንም የተማሪ መጽሐፍ አልተገኘም (No textbooks found matching your search).
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-[#F2ECE0] border-t-[1.5px] border-[#38332D] px-5 py-3 flex items-center justify-between text-xs font-serif-ethiopic text-[#5A5041]">
          <span>
            ድምር የተዘጋጁ መጽሐፍት፡ {allBooks.length} የሁለተኛ ደረጃ መማሪያ መጽሐፍት (32 Total Books)
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#38332D] text-[#FAF6EC] font-bold border border-[#38332D] hover:bg-[#201D1A] cursor-pointer"
          >
            ዝጋ (Close)
          </button>
        </div>
      </div>
    </div>
  );
};
