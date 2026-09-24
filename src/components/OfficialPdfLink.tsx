import React, { useState, useEffect } from 'react';
import { Download, ExternalLink, FileText, Loader2, AlertCircle } from 'lucide-react';
import { getOfficialTextbookUrl, getStoragePathForTextbook } from '../services/officialTextbooks';
import { useLanguage } from '../context/LanguageContext';

export interface OfficialPdfLinkProps {
  subjectId: string;
  grade: number | string;
  fallbackUrl?: string;
  compact?: boolean;
  className?: string;
}

export const OfficialPdfLink: React.FC<OfficialPdfLinkProps> = ({
  subjectId,
  grade,
  fallbackUrl,
  compact = false,
  className = '',
}) => {
  const { language } = useLanguage();
  const [pdfUrl, setPdfUrl] = useState<string | null>(fallbackUrl || null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    getOfficialTextbookUrl(grade, subjectId, fallbackUrl)
      .then((url) => {
        if (isMounted) {
          setPdfUrl(url);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setPdfUrl(fallbackUrl || null);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [grade, subjectId, fallbackUrl]);

  const storagePath = getStoragePathForTextbook(grade, subjectId);

  // Compact Mode (for list items/modals alongside DRM button)
  if (compact) {
    if (loading) {
      return (
        <span
          className={`inline-flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-bold font-serif-ethiopic bg-[#F2ECE0] text-[#7A7062] border border-[#BFB29E] select-none ${className}`}
        >
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          <span>{language === 'am' ? 'በመፈለግ ላይ...' : 'Checking PDF...'}</span>
        </span>
      );
    }

    if (pdfUrl) {
      return (
        <a
          href={pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-bold font-serif-ethiopic bg-[#FAF6EC] hover:bg-[#F2ECE0] text-[#2E6B4A] border border-[#2E6B4A] shadow-2xs transition-all active:scale-95 cursor-pointer ${className}`}
          title={`${language === 'am' ? 'ኦፊሴላዊውን የመማሪያ መጽሐፍ ክፈት' : 'Open Official MoE PDF'}: ${storagePath}`}
        >
          <Download className="w-3.5 h-3.5 text-[#2E6B4A]" />
          <span>{language === 'am' ? 'ኦፊሴላዊ PDF' : 'Official PDF'}</span>
          <ExternalLink className="w-3 h-3 text-[#2E6B4A]/70 ml-0.5" />
        </a>
      );
    }

    // When not yet uploaded to storage
    return (
      <span
        className={`inline-flex items-center justify-center gap-1 py-2 px-2.5 text-[11px] font-medium font-serif-ethiopic bg-[#F2ECE0]/80 text-[#8C806F] border border-[#BFB29E]/60 ${className}`}
        title={`Firebase Storage: ${storagePath}`}
      >
        <FileText className="w-3 h-3 opacity-60" />
        <span>{language === 'am' ? 'PDF በክላውድ' : 'Cloud PDF'}</span>
      </span>
    );
  }

  // Standard Card / Section Mode (for Quick PDF Card inside TextbookView)
  return (
    <div className={`pt-2 border-t border-[#BFB29E]/60 mt-2 space-y-2 ${className}`}>
      {loading ? (
        <div className="flex items-center justify-center gap-2 py-2 px-3 text-xs font-bold font-serif-ethiopic bg-[#FAF6EC] text-[#7A7062] border border-[#BFB29E]">
          <Loader2 className="w-3.5 h-3.5 animate-spin text-[#2E6B4A]" />
          <span>{language === 'am' ? 'የመማሪያ መጽሐፍ ፋይል እየተረጋገጠ ነው...' : 'Verifying official textbook...'}</span>
        </div>
      ) : pdfUrl ? (
        <div className="space-y-1.5">
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 text-xs font-bold font-serif-ethiopic bg-[#2E6B4A] hover:bg-[#235338] text-white border border-[#1D4A32] shadow-2xs transition-all active:scale-98 cursor-pointer"
            title={`${language === 'am' ? 'ሙሉ ኦፊሴላዊውን መጽሐፍ አውርድ' : 'Download official complete textbook'}: ${storagePath}`}
          >
            <Download className={`w-4 h-4 transition-transform ${isHovered ? 'translate-y-0.5' : ''}`} />
            <span>
              {language === 'am'
                ? 'ኦፊሴላዊ PDF አውርድ (MoE Official)'
                : 'Download Official MoE PDF'}
            </span>
            <ExternalLink className="w-3.5 h-3.5 text-emerald-200 ml-1" />
          </a>
          <p className="text-[10px] text-[#7A7062] text-center font-mono">
            Firebase Storage: {storagePath}
          </p>
        </div>
      ) : (
        <div className="p-2.5 bg-[#FAF6EC] border border-[#BFB29E]/80 text-[11px] text-[#5C5346] space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-[#38332D]">
            <FileText className="w-3.5 h-3.5 text-[#2E6B4A]" />
            <span>{language === 'am' ? 'የመማሪያ መጽሐፍ ማከማቻ (Firebase Storage)' : 'Official Textbook Storage'}</span>
          </div>
          <p className="text-[10px] text-[#7A7062] leading-tight font-mono break-all">
            {storagePath}
          </p>
          <p className="text-[10px] text-stone-500 italic">
            {language === 'am'
              ? 'መጽሐፉ በመተግበሪያው ውስጥ በደህንነት ማንበቢያ (DRM) ይገኛል።'
              : 'Textbook is available in the secure in-app DRM reader.'}
          </p>
        </div>
      )}
    </div>
  );
};
