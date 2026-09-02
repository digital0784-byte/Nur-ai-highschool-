import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { SubjectStream } from '../types';
import {
  X,
  GraduationCap,
  Compass,
  FlaskConical,
  BookOpen,
  Award,
  Cpu,
  Sprout,
  Users,
  CheckCircle2,
  Sparkles,
  ExternalLink
} from 'lucide-react';

interface NewCurriculumModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectStream?: (stream: SubjectStream) => void;
}

export const NewCurriculumModal: React.FC<NewCurriculumModalProps> = ({
  isOpen,
  onClose,
  onSelectStream,
}) => {
  const { t } = useLanguage();
  const [activeSection, setActiveSection] = useState<'overview' | 'streams' | 'competencies' | 'practical' | 'esslce'>('overview');

  if (!isOpen) return null;

  return (
    <div
      id="new-curriculum-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        id="new-curriculum-modal-container"
        className="w-full max-w-4xl bg-[#FAF6EC] border-[1.5px] border-[#38332D] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-[#38332D] text-[#FAF6EC] flex items-center justify-between border-b border-[#38332D]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xs bg-[#FAF6EC] text-[#38332D] flex items-center justify-center font-bold">
              <GraduationCap className="w-6 h-6 text-[#1E40AF]" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-xl font-bold font-serif-ethiopic tracking-tight">
                  {t.newCurriculumTitle}
                </h2>
                <span className="px-2 py-0.5 text-[11px] font-bold bg-amber-400 text-stone-900 border border-amber-500 rounded-xs">
                  {t.newCurriculumTag}
                </span>
              </div>
              <p className="text-xs text-[#DDD3BD] mt-0.5">
                {t.newCurriculumSubtitle}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 hover:bg-[#FAF6EC]/20 text-[#FAF6EC] transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b-[1.5px] border-[#38332D] bg-[#EDE5D2] overflow-x-auto no-scrollbar divide-x-[1.5px] divide-[#38332D]">
          <button
            onClick={() => setActiveSection('overview')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-bold whitespace-nowrap cursor-pointer transition-colors ${
              activeSection === 'overview'
                ? 'bg-[#FAF6EC] text-[#1E1B18] border-b-2 border-b-[#1E40AF]'
                : 'text-[#5A5143] hover:bg-[#E5DCB9]'
            }`}
          >
            📌 {t.curriculumPillarsTab}
          </button>
          <button
            onClick={() => setActiveSection('streams')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-bold whitespace-nowrap cursor-pointer transition-colors ${
              activeSection === 'streams'
                ? 'bg-[#FAF6EC] text-[#1E1B18] border-b-2 border-b-[#1E40AF]'
                : 'text-[#5A5143] hover:bg-[#E5DCB9]'
            }`}
          >
            🎓 {t.curriculumStructureTab}
          </button>
          <button
            onClick={() => setActiveSection('competencies')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-bold whitespace-nowrap cursor-pointer transition-colors ${
              activeSection === 'competencies'
                ? 'bg-[#FAF6EC] text-[#1E1B18] border-b-2 border-b-[#1E40AF]'
                : 'text-[#5A5143] hover:bg-[#E5DCB9]'
            }`}
          >
            🎯 {t.competenciesTitle}
          </button>
          <button
            onClick={() => setActiveSection('practical')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-bold whitespace-nowrap cursor-pointer transition-colors ${
              activeSection === 'practical'
                ? 'bg-[#FAF6EC] text-[#1E1B18] border-b-2 border-b-[#1E40AF]'
                : 'text-[#5A5143] hover:bg-[#E5DCB9]'
            }`}
          >
            🧪 {t.curriculumPracticalTab}
          </button>
          <button
            onClick={() => setActiveSection('esslce')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-bold whitespace-nowrap cursor-pointer transition-colors ${
              activeSection === 'esslce'
                ? 'bg-[#FAF6EC] text-[#1E1B18] border-b-2 border-b-[#1E40AF]'
                : 'text-[#5A5143] hover:bg-[#E5DCB9]'
            }`}
          >
            📝 {t.curriculumEsslceTab}
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 text-[#24211E]">
          {/* SECTION 1: OVERVIEW & PILLARS */}
          {activeSection === 'overview' && (
            <div className="space-y-5">
              <div className="bg-[#EFF6FF] border border-[#2563EB] p-4 text-[#1E3A8A] space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <Sparkles className="w-4 h-4 text-[#2563EB]" />
                  <span>የኢ.ፌ.ዲ.ሪ ትምህርት ሚኒስቴር አዲሱ ስርዓተ-ትምህርት (General Education Curriculum Framework)</span>
                </div>
                <p className="text-xs sm:text-sm leading-relaxed text-[#1E40AF]">
                  አዲሱ የኢትዮጵያ ስርዓተ-ትምህርት ተማሪዎችን በዕውቀት፣ በክህሎትና በአመለካከት የበቁ፣ ችግር ፈቺ፣ ለፈጠራና ለቴክኖሎጂ ዝግጁ የሆኑ ዜጎችን ለማፍራት በብቃት-ተኮር (Competency-Based) መርህ የተዘጋጀ ነው።
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="border-[1.5px] border-[#38332D] bg-[#FAF6EC] p-4 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-sm text-[#1E1B18]">
                    <span className="w-6 h-6 rounded-full bg-[#1D4ED8] text-white flex items-center justify-center text-xs">1</span>
                    <span>ብቃት-ተኮር ትምህርት (Competency-Based Education)</span>
                  </div>
                  <p className="text-xs text-[#5A5143] leading-relaxed">
                    ከተለምዷዊ የቃል በቃል ንባብ (Rote learning) ይልቅ የተማሪውን እውነተኛ ግንዛቤ፣ ተግባራዊ ችግር የመፍታትና የመተንተን አቅም ይገመግማል።
                  </p>
                </div>

                <div className="border-[1.5px] border-[#38332D] bg-[#FAF6EC] p-4 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-sm text-[#1E1B18]">
                    <span className="w-6 h-6 rounded-full bg-[#047857] text-white flex items-center justify-center text-xs">2</span>
                    <span>ተግባራዊ የላብራቶሪና የመስክ ስራ (Hands-on & Practical)</span>
                  </div>
                  <p className="text-xs text-[#5A5143] leading-relaxed">
                    በተፈጥሮ ሳይንስ ላብራቶሪ፣ በግብርና ልምምድ፣ በኢንፎርሜሽን ቴክኖሎጂ ፕሮግራሚንግና በማህበራዊ ምርምር የተደገፈ ጥልቅ ትምህርት።
                  </p>
                </div>

                <div className="border-[1.5px] border-[#38332D] bg-[#FAF6EC] p-4 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-sm text-[#1E1B18]">
                    <span className="w-6 h-6 rounded-full bg-[#D97706] text-white flex items-center justify-center text-xs">3</span>
                    <span>የሀገር በቀል እውቀትና ቴክኖሎጂ ትስስር (Indigenous Knowledge)</span>
                  </div>
                  <p className="text-xs text-[#5A5143] leading-relaxed">
                    የኢትዮጵያን ጥንታዊ ቅርሶች፣ ባህላዊ ህክምና፣ የተፈጥሮ ሀብት ጥበቃ እና ታሪክ ከዘመናዊ ሳይንስ ጋር በማስተሳሰር ማስተማር።
                  </p>
                </div>

                <div className="border-[1.5px] border-[#38332D] bg-[#FAF6EC] p-4 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-sm text-[#1E1B18]">
                    <span className="w-6 h-6 rounded-full bg-[#7C3AED] text-white flex items-center justify-center text-xs">4</span>
                    <span>የ21ኛው ክፍለ-ዘመን ክህሎቶች (21st Century Skills)</span>
                  </div>
                  <p className="text-xs text-[#5A5143] leading-relaxed">
                    ሂሳዊ አስተሳሰብ (Critical Thinking)፣ ዲጂታል ክህሎት፣ የቡድን ስራ፣ የዜግነት ስነ-ምግባር እና የስራ ፈጠራ (Entrepreneurship)።
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 2: STREAMS & STRUCTURE */}
          {activeSection === 'streams' && (
            <div className="space-y-6">
              {/* Grade 9 & 10 */}
              <div className="border-[1.5px] border-[#38332D] bg-[#F7F2E4] p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-[#38332D]/20 pb-2">
                  <h3 className="font-bold text-sm text-[#1E1B18] flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-[#1E40AF]" />
                    <span>አጠቃላይ ሁለተኛ ደረጃ (General Secondary: Grade 9-10)</span>
                  </h3>
                  <span className="text-xs bg-[#E8DFC8] px-2 py-0.5 border border-[#D5C9AC] font-semibold">
                    11 የጋራ የትምህርት አይነቶች
                  </span>
                </div>
                <p className="text-xs text-[#5A5143]">
                  ሁሉም ተማሪዎች ወደ ተመረጠ ዘርፍ ከመግባታቸው በፊት ጠንካራ ሳይንሳዊ፣ ማህበራዊ፣ ቋንቋና ቴክኖሎጂካል መሰረት እንዲይዙ የሚሰጥ።
                </p>
              </div>

              {/* Grade 11 & 12 Streams */}
              <div className="space-y-3">
                <h3 className="font-bold text-sm text-[#1E1B18] flex items-center gap-2">
                  <Compass className="w-4 h-4 text-[#1E40AF]" />
                  <span>የመሰናዶ ዘርፎች (Preparatory Streams: Grade 11-12)</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Natural Science Stream Card */}
                  <div className="border-[1.5px] border-[#047857] bg-[#ECFDF5] p-4 space-y-3 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-[#065F46] flex items-center gap-1.5">
                          <FlaskConical className="w-4 h-4 text-[#059669]" />
                          {t.streamNatural} (Natural Science Stream)
                        </span>
                        <span className="text-[11px] font-bold bg-[#A7F3D0] text-[#064E3B] px-2 py-0.5 rounded-xs">
                          STEM & Health
                        </span>
                      </div>
                      <p className="text-xs text-[#047857] leading-relaxed">
                        ለህክምና፣ ምህንድስና፣ ኢንፎርሜሽን ቴክኖሎጂ፣ ግብርና እና ተፈጥሮ ሳይንስ ሙያዎች የሚያዘጋጅ ዘርፍ።
                      </p>
                      <div className="text-xs text-[#065F46] font-semibold pt-1">
                        ዋና የትምህርት ዓይነቶች፡
                        <ul className="list-disc list-inside mt-1 font-normal text-xs text-[#047857] space-y-0.5">
                          <li>ሂሳብ (Mathematics - Advanced)</li>
                          <li>ፊዚክስ (Physics) & ኬሚስትሪ (Chemistry)</li>
                          <li>ባዮሎጂ (Biology) & ግብርና (Agriculture)</li>
                          <li>ኢንፎርሜሽን ቴክኖሎጂ (IT) & እንግሊዝኛ</li>
                        </ul>
                      </div>
                    </div>

                    {onSelectStream && (
                      <button
                        onClick={() => {
                          onSelectStream('natural');
                          onClose();
                        }}
                        className="w-full mt-3 py-1.5 bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold transition-colors cursor-pointer"
                      >
                        የተፈጥሮ ሳይንስ ዘርፍን ምረጥ (Select Natural)
                      </button>
                    )}
                  </div>

                  {/* Social Science Stream Card */}
                  <div className="border-[1.5px] border-[#D97706] bg-[#FFFBEB] p-4 space-y-3 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-[#B45309] flex items-center gap-1.5">
                          <Users className="w-4 h-4 text-[#D97706]" />
                          {t.streamSocial} (Social Science Stream)
                        </span>
                        <span className="text-[11px] font-bold bg-[#FDE68A] text-[#78350F] px-2 py-0.5 rounded-xs">
                          Humanities & Business
                        </span>
                      </div>
                      <p className="text-xs text-[#B45309] leading-relaxed">
                        ለህግ፣ ኢኮኖሚክስ፣ ንግድ፣ ማህበራዊ ሳይንስ፣ ዲፕሎማሲ እና ጋዜጠኝነት ሙያዎች የሚያዘጋጅ ዘርፍ።
                      </p>
                      <div className="text-xs text-[#B45309] font-semibold pt-1">
                        ዋና የትምህርት ዓይነቶች፡
                        <ul className="list-disc list-inside mt-1 font-normal text-xs text-[#92400E] space-y-0.5">
                          <li>ኢኮኖሚክስ (Economics) & ጂኦግራፊ (Geography)</li>
                          <li>ታሪክ (History) & የዜግነት ትምህርት (Citizenship)</li>
                          <li>አጠቃላይ ሂሳብ (General Math) & እንግሊዝኛ</li>
                          <li>ኢንፎርሜሽን ቴክኖሎጂ (IT) & ስነ-ጽሁፍ</li>
                        </ul>
                      </div>
                    </div>

                    {onSelectStream && (
                      <button
                        onClick={() => {
                          onSelectStream('social');
                          onClose();
                        }}
                        className="w-full mt-3 py-1.5 bg-[#D97706] hover:bg-[#B45309] text-white text-xs font-bold transition-colors cursor-pointer"
                      >
                        የማህበራዊ ሳይንስ ዘርፍን ምረጥ (Select Social)
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 3: COMPETENCY BENCHMARKS */}
          {activeSection === 'competencies' && (
            <div className="space-y-4">
              <div className="p-3 bg-[#F4EEDB] border border-[#38332D]/30 text-xs text-[#5A5143] leading-relaxed">
                በአዲሱ ስርዓተ-ትምህርት እያንዳንዱ ትምህርትና ርዕስ ተማሪው ሊያሳካቸው የሚገቡ ግልጽ የብቃት መለኪያዎች (Learning Competency Outcomes) አሉት።
              </div>

              <div className="space-y-3">
                <div className="border-[1.5px] border-[#38332D] bg-[#FAF6EC] p-3.5 space-y-2">
                  <span className="text-xs font-bold text-[#1D4ED8] bg-[#EFF6FF] px-2 py-0.5 border border-[#2563EB]">
                    ሂሳብና የተፈጥሮ ሳይንስ (Math & STEM Competencies)
                  </span>
                  <ul className="list-disc list-inside text-xs text-[#38332D] space-y-1 mt-2">
                    <li>ፎርሙላዎችን በቃላቸው ከመያዝ ባለፈ በገሃዱ አለም ስሌት ላይ መተርጎምና መጠቀም መቻል።</li>
                    <li>የሳይንሳዊ ምርምር ቅደም ተከተሎችን (Hypothesis, Experiment, Analysis, Conclusion) መተግበር።</li>
                    <li>ላብራቶሪዎችን በጥንቃቄ ማከናወንና የመረጃ ሰንጠረዦችን መተንተን።</li>
                  </ul>
                </div>

                <div className="border-[1.5px] border-[#38332D] bg-[#FAF6EC] p-3.5 space-y-2">
                  <span className="text-xs font-bold text-[#B45309] bg-[#FFFBEB] px-2 py-0.5 border border-[#F59E0B]">
                    ማህበራዊ ሳይንስና ዜግነት (Social Sciences Competencies)
                  </span>
                  <ul className="list-disc list-inside text-xs text-[#38332D] space-y-1 mt-2">
                    <li>ታሪካዊ ክስተቶችንና ሰነዶችን ከበርካታ አቅጣጫዎች በነፃነት መመዘንና መመርመር።</li>
                    <li>የዴሞክራሲ፣ የሰብዓዊ መብቶች እና የህገ-መንግስት መሰረቶችን መረዳትና በዜግነት ኃላፊነት መወጣት።</li>
                    <li>የሀገር ውስጥና የአለም አቀፍ ኢኮኖሚያዊ ሁኔታዎችን መተንተን።</li>
                  </ul>
                </div>

                <div className="border-[1.5px] border-[#38332D] bg-[#FAF6EC] p-3.5 space-y-2">
                  <span className="text-xs font-bold text-[#0D9488] bg-[#F0FDFA] px-2 py-0.5 border border-[#14B8A6]">
                    ኢንፎርሜሽን ቴክኖሎጂና ግብርና (IT & Applied Technology)
                  </span>
                  <ul className="list-disc list-inside text-xs text-[#38332D] space-y-1 mt-2">
                    <li>አልጎሪዝም መቅረጽ፣ መሰረታዊ የኮምፒውተር ፕሮግራሚንግና የዳታ አያያዝ ክህሎት።</li>
                    <li>የሳይበር ደህንነት፣ ዲጂታል ንጽህና እና ኃላፊነት የተሞላበት የኢንተርኔት አጠቃቀም።</li>
                    <li>ዘመናዊ የግብርና ቴክኖሎጂዎች፣ የአፈር እንክብካቤ እና የምግብ ዋስትና ማረጋገጫ ዘዴዎች።</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 4: PRACTICAL ACTIVITIES */}
          {activeSection === 'practical' && (
            <div className="space-y-4">
              <div className="border-[1.5px] border-[#38332D] bg-[#FAF6EC] p-4 space-y-3">
                <div className="flex items-center gap-2 font-bold text-sm text-[#1E1B18]">
                  <FlaskConical className="w-5 h-5 text-[#047857]" />
                  <span>ተግባራዊ የላብራቶሪና የመስክ ስራዎች (Laboratory & Field Protocols)</span>
                </div>
                <p className="text-xs text-[#5A5143] leading-relaxed">
                  በአዲሱ መማሪያ መተግበሪያ ውስጥ ለእያንዳንዱ ርዕስ የተዘጋጁ ተግባራዊ ልምምዶች፣ የሚያስፈልጉ ቁሳቁሶች፣ የደህንነት መመሪያዎች እና የመጨረሻ ምልከታዎች ተካተዋል።
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-3 bg-[#EDE5D2] border border-[#38332D]/30 space-y-1">
                    <span className="text-xs font-bold text-[#1E1B18] flex items-center gap-1">
                      <Cpu className="w-3.5 h-3.5 text-[#1D4ED8]" /> አይቲ (IT Lab)
                    </span>
                    <p className="text-[11px] text-[#5A5143]">የፓይዘን አልጎሪዝም እና የኔትወርክ ግንኙነት ሙከራዎች።</p>
                  </div>
                  <div className="p-3 bg-[#EDE5D2] border border-[#38332D]/30 space-y-1">
                    <span className="text-xs font-bold text-[#1E1B18] flex items-center gap-1">
                      <FlaskConical className="w-3.5 h-3.5 text-[#047857]" /> ኬሚስትሪ / ፊዚክስ
                    </span>
                    <p className="text-[11px] text-[#5A5143]">የአሲድ-ቤዝ ቲትሬሽንና የኦሲሌሽን ፔንዱለም ስሌቶች።</p>
                  </div>
                  <div className="p-3 bg-[#EDE5D2] border border-[#38332D]/30 space-y-1">
                    <span className="text-xs font-bold text-[#1E1B18] flex items-center gap-1">
                      <Sprout className="w-3.5 h-3.5 text-[#D97706]" /> ግብርና / ባዮሎጂ
                    </span>
                    <p className="text-[11px] text-[#5A5143]">የአፈር ፒኤች (pH) ምርመራ እና የዕፅዋት ሴል ማይክሮስኮፕ።</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 5: ESSLCE NATIONAL EXAM */}
          {activeSection === 'esslce' && (
            <div className="space-y-4">
              <div className="border-[1.5px] border-[#38332D] bg-[#EFF6FF] p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-[#1E40AF] flex items-center gap-2">
                    <Award className="w-5 h-5 text-[#2563EB]" />
                    <span>የኢትዮጵያ ዩኒቨርሲቲ መግቢያ ፈተና (ESSLCE National Exam Prep)</span>
                  </h3>
                  <span className="text-xs bg-[#DBEAFE] text-[#1E3A8A] font-bold px-2 py-0.5 border border-[#93C5FD]">
                    {t.esslcePrepBadge}
                  </span>
                </div>
                <p className="text-xs text-[#1E3A8A] leading-relaxed">
                  አዲሱ ስርዓተ-ትምህርት የብሔራዊ ፈተና ጥያቄዎችን ከንድፈ-ሀሳብ ማስታወስ ወደ ሂሳዊ አስተሳሰብ፣ ችግር አፈታትና ጥልቅ ግንዛቤ ቀይሮታል።
                </p>
                <div className="space-y-2 pt-2">
                  <div className="flex items-start gap-2 text-xs text-[#1E40AF]">
                    <CheckCircle2 className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
                    <span><strong>የጥያቄዎች መዋቅር፡</strong> በብሉፕሪንት (Blueprint) የተመሩ የጽንሰ-ሀሳብ፣ የተግባር ስሌት እና የትንተና ጥያቄዎች።</span>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-[#1E40AF]">
                    <CheckCircle2 className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
                    <span><strong>የፍላሽካርድ እና ኩዊዝ ማጠቃለያ፡</strong> በመተግበሪያው ውስጥ በእያንዳንዱ ርዕስ ስር የተቀመጡት ጥያቄዎች ከብሔራዊ ፈተና ደረጃዎች ጋር ሙሉ በሙሉ የተጣጣሙ ናቸው።</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 bg-[#EDE5D2] border-t-[1.5px] border-[#38332D] flex items-center justify-between flex-wrap gap-2">
          <span className="text-xs text-[#5A5143] font-serif-ethiopic">
            የኢ.ፌ.ዲ.ሪ ትምህርት ሚኒስቴር የሥርዓተ-ትምህርት መመሪያዎች
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#38332D] hover:bg-[#24211E] text-[#FAF6EC] text-xs font-bold border border-[#38332D] cursor-pointer transition-colors"
          >
            {t.closeBtn}
          </button>
        </div>
      </div>
    </div>
  );
};
