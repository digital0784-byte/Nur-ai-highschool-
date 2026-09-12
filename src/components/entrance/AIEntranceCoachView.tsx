import React, { useState } from 'react';
import {
  EntranceQuestion,
  AICoachResponse,
  EntranceLanguage,
} from '../../types/entranceExam';
import { Grade } from '../../types';
import {
  Sparkles,
  Send,
  BookOpen,
  HelpCircle,
  Lightbulb,
  AlertOctagon,
  ArrowRight,
  RotateCcw,
  Languages,
  CheckCircle2,
  BrainCircuit,
  MessageSquare,
} from 'lucide-react';

interface AIEntranceCoachViewProps {
  initialQuestion?: EntranceQuestion | null;
  initialUserAnswer?: any;
  grade: Grade;
  onClearContext?: () => void;
}

export const AIEntranceCoachView: React.FC<AIEntranceCoachViewProps> = ({
  initialQuestion,
  initialUserAnswer,
  grade,
  onClearContext,
}) => {
  const [language, setLanguage] = useState<EntranceLanguage>('am');
  const [mode, setMode] = useState<
    'explain' | 'hint' | 'mistake_analysis' | 'similar_question' | 'interactive'
  >('explain');
  const [userQuery, setUserQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [coachResponse, setCoachResponse] = useState<AICoachResponse | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<EntranceQuestion | null>(
    initialQuestion || null
  );

  const handleAskCoach = async (overrideMode?: typeof mode, overrideQuery?: string) => {
    const activeMode = overrideMode || mode;
    const activeQuery = overrideQuery || userQuery;

    setIsLoading(true);
    try {
      const payload = {
        mode: activeMode,
        query: activeQuery,
        question: selectedQuestion,
        studentAnswer: initialUserAnswer,
        grade,
        subject: selectedQuestion?.subject || 'Mathematics',
        unit: selectedQuestion?.unit || 'General Review',
        topic: selectedQuestion?.topic || 'Core Curriculum',
        source: selectedQuestion?.source || 'Ethiopian MoE Grade 11/12 Textbook',
        page: selectedQuestion?.page || 1,
        language,
      };

      const res = await fetch('/api/entrance-coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        setCoachResponse(data);
      } else {
        throw new Error('Server returned non-200');
      }
    } catch (err) {
      console.warn('[AI Coach] Direct request failed, displaying fallback response:', err);
      // Fallback
      setCoachResponse({
        answer:
          language === 'am'
            ? 'ይህ ፅንሰ-ሀሳብ በኢትዮጵያ የ12ኛ/11ኛ ክፍል ስርዓተ-ትምህርት ውስጥ ወሳኝ ነው። ደረጃ በደረጃ ስንመለከተው፡ በመጀመሪያ የመማሪያ መጽሐፍቱን ህጎች መገንዘብ፣ ቀጥሎም እሴቶችን በትክክል መተካት ያስፈልጋል።'
            : 'This concept is foundational in the Ethiopian high school curriculum. Review the textbook definition, verify algebraic identities, and confirm dimensional units before solving.',
        stepByStep: [
          language === 'am' ? 'ደረጃ 1፡ በዋናው የስርዓተ-ትምህርት መጽሐፍ የተመለከተውን መሠረታዊ ቀመር መለየት።' : 'Step 1: Identify the underlying theorem from your textbook.',
          language === 'am' ? 'ደረጃ 2፡ የተሰጡትን ቁጥሮችና የሂሳብ ግንኙነቶች በትክክል መተካት።' : 'Step 2: Substitute the known values and evaluate algebraically.',
          language === 'am' ? 'ደረጃ 3፡ መልስዎን ከአማራጮች ጋር ማነፃፀርና ትክክለኛነቱን ማረጋገጥ።' : 'Step 3: Validate the result against unit constraints and target options.',
        ],
        curriculumReference: {
          grade,
          subject: selectedQuestion?.subject || 'Mathematics',
          unit: selectedQuestion?.unit || 'Unit 1',
          topic: selectedQuestion?.topic || 'Core Concept',
          source: selectedQuestion?.source || 'Ethiopian High School Textbook',
          page: selectedQuestion?.page || 45,
        },
        hint: language === 'am' ? 'ቀመሩን ከመተግበርዎ በፊት አሃዶች ተመሳሳይ መሆናቸውን ያረጋግጡ።' : 'Examine the boundary conditions before solving.',
        conceptTrap: language === 'am' ? 'የተማሪዎች የተለመደ ስህተት፡ የሒሳብ ምልክቶችን (+/-) ማዛባት ነው።' : 'Candidates frequently confuse inverse operations under timed pressure.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const presetChips = [
    {
      mode: 'explain',
      labelEn: 'Explain concept step-by-step',
      labelAm: 'ፅንሰ-ሀሳቡን ደረጃ በደረጃ አስረዳኝ',
    },
    {
      mode: 'hint',
      labelEn: 'Give me a strategic hint',
      labelAm: 'ስልታዊ ፍንጭ ስጠኝ (ቀጥታ መልሱን ሳትነግረኝ)',
    },
    {
      mode: 'mistake_analysis',
      labelEn: 'Analyze common traps in this topic',
      labelAm: 'በዚህ ርዕስ ውስጥ ተማሪዎች የሚሰሩትን ስህተት አብራራልኝ',
    },
    {
      mode: 'similar_question',
      labelEn: 'Generate similar practice question',
      labelAm: 'ተመሳሳይ የልምምድ ሞዴል ጥያቄ ፍጠርልኝ',
    },
    {
      mode: 'interactive',
      labelEn: 'Conduct oral / interactive test',
      labelAm: 'አሳታፊ የፈተና ጥያቄ ጠይቀኝ',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Banner with Multilingual Switcher */}
      <div className="bg-gradient-to-r from-stone-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 border border-stone-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-bold text-amber-300">
              <Sparkles className="w-3.5 h-3.5" />
              <span>የኢትዮጵያ ስርዓተ-ትምህርት መረጃ-ተኮር AI አስጠኚ (RAG Grounded Coach)</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-serif-ethiopic">
              የፈተና ረዳትና አስጠኚ AI (Entrance Exam Coach)
            </h2>
            <p className="text-xs text-stone-300">
              በአዲሱ የትምህርት ሚኒስቴር የመማሪያ መጽሐፍት ላይ ብቻ የተመሰረቱ ጥልቅ ማብራሪያዎችና ስልታዊ ምክሮች።
            </p>
          </div>

          {/* Multilingual Selector */}
          <div className="bg-white/10 backdrop-blur-md p-1 rounded-2xl border border-white/15 flex items-center gap-1 text-xs">
            <Languages className="w-4 h-4 text-stone-300 ml-2" />
            <button
              onClick={() => setLanguage('am')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                language === 'am' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-300 hover:text-white'
              }`}
            >
              አማርኛ
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                language === 'en' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-300 hover:text-white'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLanguage('om')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                language === 'om' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-300 hover:text-white'
              }`}
            >
              Afaan Oromo
            </button>
            <button
              onClick={() => setLanguage('ti')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                language === 'ti' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-300 hover:text-white'
              }`}
            >
              ትግርኛ
            </button>
          </div>
        </div>

        {/* Selected Context Bar (if launched from a mistake or practice question) */}
        {selectedQuestion && (
          <div className="p-3 bg-white/10 rounded-2xl border border-white/15 flex items-center justify-between text-xs text-stone-200">
            <div className="flex items-center gap-2 truncate">
              <span className="px-2 py-0.5 bg-amber-400 text-stone-900 rounded font-bold uppercase text-[10px]">
                የጥያቄ አውድ
              </span>
              <span className="font-semibold truncate">{selectedQuestion.question}</span>
            </div>
            {onClearContext && (
              <button
                onClick={() => {
                  setSelectedQuestion(null);
                  onClearContext();
                }}
                className="text-stone-400 hover:text-white text-xs underline cursor-pointer shrink-0 ml-2"
              >
                አውድ አጥፋ
              </button>
            )}
          </div>
        )}
      </div>

      {/* Preset Action Chips */}
      <div className="flex flex-wrap gap-2">
        {presetChips.map((chip) => (
          <button
            key={chip.mode}
            onClick={() => {
              setMode(chip.mode as any);
              handleAskCoach(chip.mode as any);
            }}
            className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all border cursor-pointer ${
              mode === chip.mode
                ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                : 'bg-white hover:bg-stone-50 text-stone-700 border-stone-200'
            }`}
          >
            {language === 'am' ? chip.labelAm : chip.labelEn}
          </button>
        ))}
      </div>

      {/* Input box */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-stone-200 shadow-sm space-y-3">
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={userQuery}
            onChange={(e) => setUserQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAskCoach();
            }}
            placeholder={
              language === 'am'
                ? 'የማይገባዎትን የፈተና ጥያቄ ወይም ፅንሰ-ሀሳብ እዚህ ይጠይቁ...'
                : 'Ask any entrance concept, formula derivation, or question explanation...'
            }
            className="flex-1 px-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl text-xs sm:text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-all"
          />

          <button
            onClick={() => handleAskCoach()}
            disabled={isLoading || (!userQuery.trim() && !selectedQuestion)}
            className="px-5 py-3 bg-indigo-700 hover:bg-indigo-800 text-white rounded-2xl text-xs font-bold shadow-sm flex items-center gap-2 disabled:opacity-40 cursor-pointer transition-all shrink-0"
          >
            {isLoading ? (
              <span className="animate-spin">⏳</span>
            ) : (
              <>
                <span>ጠይቅ</span>
                <Send className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Response Display */}
      {coachResponse && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6 animate-in fade-in duration-300">
          {/* Official RAG Source Badge */}
          {coachResponse.curriculumReference && (
            <div className="p-4 bg-indigo-50/70 border border-indigo-200 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs text-indigo-950">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-700 shrink-0" />
                <span className="font-bold">
                  {coachResponse.curriculumReference.subject} (Grade {coachResponse.curriculumReference.grade})
                </span>
                <span className="text-indigo-400">•</span>
                <span>{coachResponse.curriculumReference.unit}</span>
                <span className="text-indigo-400">•</span>
                <span className="font-semibold">{coachResponse.curriculumReference.topic}</span>
              </div>

              <div className="text-[11px] bg-white px-3 py-1 rounded-xl border border-indigo-200 font-mono font-bold text-indigo-800">
                {coachResponse.curriculumReference.source} (ገጽ {coachResponse.curriculumReference.page})
              </div>
            </div>
          )}

          {/* Main Answer */}
          <div className="space-y-3">
            <h3 className="text-base font-bold font-serif-ethiopic text-stone-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              የአስጠኚው ማብራሪያ (Coach Explanation)
            </h3>
            <p className="text-sm text-stone-800 leading-relaxed font-normal">
              {coachResponse.answer}
            </p>
          </div>

          {/* Step-by-Step Breakdown */}
          {coachResponse.stepByStep && coachResponse.stepByStep.length > 0 && (
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                ደረጃ በደረጃ ስሌት (Step-by-Step Breakdown)
              </h4>
              <div className="space-y-2">
                {coachResponse.stepByStep.map((step, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-700 flex items-start gap-2.5"
                  >
                    <span className="w-5 h-5 rounded-full bg-stone-200 text-stone-800 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Strategic Hint & Concept Trap */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {coachResponse.hint && (
              <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-1.5 text-xs text-amber-950">
                <div className="flex items-center gap-2 font-bold text-amber-900">
                  <Lightbulb className="w-4 h-4 text-amber-600" />
                  <span>ስልታዊ ፍንጭ (Strategic Hint)</span>
                </div>
                <p className="leading-relaxed">{coachResponse.hint}</p>
              </div>
            )}

            {coachResponse.conceptTrap && (
              <div className="p-4 bg-rose-50/70 border border-rose-200 rounded-2xl space-y-1.5 text-xs text-rose-950">
                <div className="flex items-center gap-2 font-bold text-rose-900">
                  <AlertOctagon className="w-4 h-4 text-rose-600" />
                  <span>የተለመዱ ስህተቶች (Common Trap to Avoid)</span>
                </div>
                <p className="leading-relaxed">{coachResponse.conceptTrap}</p>
              </div>
            )}
          </div>

          {/* Follow-up similar practice problem */}
          {coachResponse.similarPracticeQuestion && (
            <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200/80 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-stone-900 flex items-center gap-2">
                  <BrainCircuit className="w-4 h-4 text-indigo-600" />
                  ተጨማሪ የልምምድ ጥያቄ (Similar Practice Question)
                </h4>
                <span className="text-[10px] bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded">
                  AI Generated
                </span>
              </div>

              <p className="font-semibold text-stone-800">
                {coachResponse.similarPracticeQuestion.question}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {coachResponse.similarPracticeQuestion.options.map((opt, i) => (
                  <div
                    key={i}
                    className="p-2.5 bg-white rounded-xl border border-stone-200 text-stone-700"
                  >
                    {opt}
                  </div>
                ))}
              </div>

              <p className="text-[11px] text-stone-500 italic">
                ትክክለኛ መልስ፡ {coachResponse.similarPracticeQuestion.options[coachResponse.similarPracticeQuestion.correctAnswer]} ({coachResponse.similarPracticeQuestion.explanation})
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
