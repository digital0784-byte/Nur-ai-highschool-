import React, { useState } from 'react';
import { Subject, Grade } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { Award, Printer, X, CheckCircle, Sparkles } from 'lucide-react';

interface CompletionCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedGrade: Grade;
  subjects: Subject[];
  completedCount: number;
  totalTopics: number;
}

export const CompletionCertificateModal: React.FC<CompletionCertificateModalProps> = ({
  isOpen,
  onClose,
  selectedGrade,
  subjects,
  completedCount,
  totalTopics,
}) => {
  const { t, language, isRtl } = useLanguage();
  const [studentName, setStudentName] = useState('');

  if (!isOpen) return null;

  const isFullMastery = completedCount >= totalTopics && totalTopics > 0;
  const todayDate = new Date().toLocaleDateString(language === 'en' ? 'en-US' : 'am-ET', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      id="certificate-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="certificate-modal-title"
    >
      <div
        id="certificate-modal-card"
        className="relative w-full max-w-3xl bg-[#FAF6EC] border-[2px] border-[#38332D] shadow-2xl p-4 sm:p-8 space-y-6 my-auto text-[#1E1B18]"
      >
        {/* Top Close & Print Controls */}
        <div className="flex items-center justify-between border-b border-[#38332D]/20 pb-3 print:hidden">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-700" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#5A5143]">
              {t.certificateBtn}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="print-certificate-btn"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#38332D] text-[#FAF6EC] hover:bg-[#24211E] text-xs font-bold border border-[#38332D] cursor-pointer transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{t.certificatePrintBtn}</span>
            </button>
            <button
              id="close-certificate-btn"
              onClick={onClose}
              className="p-1.5 text-[#5A5143] hover:text-[#1E1B18] hover:bg-[#EDE6D4] border border-[#38332D] cursor-pointer transition-colors"
              aria-label={t.closeBtn}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Student Name Input Bar (hidden on print) */}
        <div className="p-3 bg-[#EFE8D6] border-[1.5px] border-[#38332D] flex flex-col sm:flex-row items-center gap-3 print:hidden">
          <label htmlFor="student-name-input" className="text-xs font-bold text-[#4A4237] shrink-0">
            {t.certificatePresentedTo}:
          </label>
          <input
            id="student-name-input"
            type="text"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            placeholder={t.certificateDefaultStudent}
            className="flex-1 px-3 py-1.5 text-sm bg-[#FAF6EC] border border-[#38332D] text-[#1E1B18] font-bold focus:outline-hidden"
          />
        </div>

        {/* PRINTABLE CERTIFICATE BODY */}
        <div
          id="printable-certificate"
          className="relative border-[4px] border-double border-[#38332D] bg-[#FFFDF7] p-6 sm:p-10 space-y-6 text-center shadow-inner overflow-hidden"
          style={{
            backgroundImage:
              'radial-gradient(circle at center, rgba(245, 237, 216, 0.4) 0%, rgba(255, 253, 247, 1) 75%)',
          }}
        >
          {/* Certificate Corner Ornaments */}
          <div className="absolute top-2 left-2 text-[#38332D] text-xs select-none">❖</div>
          <div className="absolute top-2 right-2 text-[#38332D] text-xs select-none">❖</div>
          <div className="absolute bottom-2 left-2 text-[#38332D] text-xs select-none">❖</div>
          <div className="absolute bottom-2 right-2 text-[#38332D] text-xs select-none">❖</div>

          {/* Certificate Header Banner */}
          <div className="space-y-1.5">
            <div className="inline-flex items-center justify-center gap-2 px-3 py-0.5 border border-[#38332D] bg-[#EFE8D6] text-[11px] font-bold uppercase tracking-widest text-[#4A4237]">
              <Sparkles className="w-3 h-3 text-amber-700" />
              <span>{t.countryBadge} • {t.gradePrefix} {selectedGrade}</span>
              <Sparkles className="w-3 h-3 text-amber-700" />
            </div>

            <h2
              id="certificate-modal-title"
              className="font-serif-ethiopic text-2xl sm:text-3xl font-extrabold text-[#1E1B18] tracking-tight leading-snug pt-2"
            >
              {t.certificateTitle}
            </h2>
            <p className="text-xs font-mono tracking-wider text-[#665C4D]">
              {t.certificateSubtitle}
            </p>
          </div>

          {/* Presentation Subtitle */}
          <div className="space-y-2 pt-2">
            <p className="text-xs uppercase tracking-widest text-[#7A705E] font-serif-ethiopic">
              {t.certificatePresentedTo}
            </p>
            <div className="font-serif-ethiopic text-xl sm:text-2xl font-bold text-[#1E1B18] pb-1 border-b-2 border-[#38332D] inline-block min-w-[240px]">
              {studentName.trim() ? studentName : t.certificateDefaultStudent}
            </div>
          </div>

          {/* Main Statement */}
          <p className="font-serif-ethiopic text-xs sm:text-sm text-[#38332D] leading-relaxed max-w-xl mx-auto text-justify sm:text-center">
            {t.certificateBodyText}
          </p>

          {/* Core Subjects Grid Pill List */}
          <div className="py-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#7A705E] block mb-2">
              {t.subjectsTitle} (8)
            </span>
            <div className="flex flex-wrap items-center justify-center gap-1.5">
              {subjects.map((s) => (
                <span
                  key={s.id}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#F4EEDB] border border-[#38332D] text-xs font-serif-ethiopic font-semibold text-[#1E1B18]"
                >
                  <CheckCircle className="w-3 h-3 text-emerald-700" />
                  <span>{s.name}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Completion Status & Seal */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#38332D]/20 text-xs">
            <div className="text-left rtl:text-right space-y-0.5">
              <span className="text-[11px] text-[#7A705E] block">{todayDate}</span>
              <span className="font-mono font-bold text-[#38332D]">
                {completedCount} / {totalTopics} {t.coursesCompletedLabel}
              </span>
            </div>

            {/* Official Seal Emblem */}
            <div className="w-20 h-20 rounded-full border-2 border-[#38332D] bg-[#F7F2E2] flex flex-col items-center justify-center p-1 text-center shadow-xs">
              <Award className="w-6 h-6 text-amber-700 mb-0.5" />
              <span className="text-[8px] font-extrabold uppercase tracking-tighter text-[#38332D] leading-none">
                OFFICIAL
              </span>
              <span className="text-[7px] font-bold text-amber-800 leading-none">
                {isFullMastery ? '100% COMPLETE' : 'IN PROGRESS'}
              </span>
            </div>

            <div className="text-right rtl:text-left space-y-0.5">
              <span className="font-serif-ethiopic font-bold text-[#1E1B18] block">
                የኢትዮጵያ ሁለተኛ ደረጃ መማሪያ
              </span>
              <span className="text-[10px] text-[#7A705E]">Ministry of Education Standards</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
