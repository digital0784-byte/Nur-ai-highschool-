import React, { useState } from 'react';
import {
  FileCheck,
  CheckCircle2,
  Clock,
  Award,
  AlertCircle,
  HelpCircle,
  Play,
  RotateCcw,
  BookOpen,
  Sparkles,
  ChevronRight,
  Filter,
  Check,
  Flame,
} from 'lucide-react';
import { GradeLevel } from '../../types/curriculumEngine';
import { LanguageCode } from '../../types';
import { ethiopianCurriculumEngine } from '../../engine/curriculumRegistry';

interface StudentExamsViewProps {
  grade: GradeLevel;
  language: LanguageCode;
  onOpenAITutor?: (topicOrQuestion?: string) => void;
}

interface ExamQuestion {
  id: string;
  question: string;
  questionAmharic?: string;
  options: string[];
  optionsAmharic?: string[];
  correctIndex: number;
  explanation: string;
  explanationAmharic?: string;
}

interface MockExam {
  id: string;
  title: string;
  titleAmharic: string;
  subject: string;
  subjectAmharic: string;
  type: 'matric' | 'midterm' | 'final';
  durationMinutes: number;
  totalMarks: number;
  yearEC: string;
  questions: ExamQuestion[];
}

export const StudentExamsView: React.FC<StudentExamsViewProps> = ({
  grade,
  language,
  onOpenAITutor,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'matric' | 'midterm' | 'final'>('all');
  const [activeExam, setActiveExam] = useState<MockExam | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(0);

  // Mock comprehensive exams aligned with the Ethiopian curriculum
  const exams: MockExam[] = [
    {
      id: `exam-g${grade}-matric-2016`,
      title: `Grade ${grade} National Model Entrance Exam (2016 E.C.)`,
      titleAmharic: `የ${grade}ኛ ክፍል ብሔራዊ የሞዴል መግቢያ ፈተና (2016 ዓ.ም)`,
      subject: 'Mathematics',
      subjectAmharic: 'ሒሳብ',
      type: 'matric',
      durationMinutes: 45,
      totalMarks: 100,
      yearEC: '2016',
      questions: [
        {
          id: 'q1',
          question: 'Which of the following relations is a function?',
          questionAmharic: 'ከሚከተሉት ግንኙነቶች መካከል ፈንክሽን (Function) የሆነው የትኛው ነው?',
          options: [
            'R = {(1, 2), (1, 3), (2, 4)}',
            'R = {(2, 5), (3, 5), (4, 6)}',
            'R = {(3, 1), (3, 2), (3, 3)}',
            'R = {(4, 8), (4, 9), (5, 10)}',
          ],
          optionsAmharic: [
            'R = {(1, 2), (1, 3), (2, 4)}',
            'R = {(2, 5), (3, 5), (4, 6)}',
            'R = {(3, 1), (3, 2), (3, 3)}',
            'R = {(4, 8), (4, 9), (5, 10)}',
          ],
          correctIndex: 1,
          explanation: 'A relation is a function if each element of the domain maps to exactly one element in the range. In option B, every x-value (2, 3, 4) is unique.',
          explanationAmharic: 'አንድ ግንኙነት ፈንክሽን የሚባለው እያንዳንዱ የዶሜይን (domain) አባል ከአንድና ከአንድ የሬንጅ (range) አባል ጋር ብቻ ሲጣመር ነው። በምርጫ B ውስጥ እያንዳንዱ x-እሴት (2, 3, 4) የተለየ ነው።',
        },
        {
          id: 'q2',
          question: 'What is the domain of the rational function f(x) = (2x + 1) / (x - 3)?',
          questionAmharic: 'የፈንክሽን f(x) = (2x + 1) / (x - 3) ዶሜይን (Domain) የትኛው ነው?',
          options: [
            'All real numbers except x = -1/2',
            'All real numbers except x = 3',
            'All real numbers except x = 0',
            'All positive real numbers',
          ],
          optionsAmharic: [
            'x = -1/2 በስተቀር ሁሉም እውነተኛ ቁጥሮች',
            'x = 3 በስተቀር ሁሉም እውነተኛ ቁጥሮች (All real numbers except 3)',
            'x = 0 በስተቀር ሁሉም እውነተኛ ቁጥሮች',
            'ሁሉም አዎንታዊ እውነተኛ ቁጥሮች',
          ],
          correctIndex: 1,
          explanation: 'The denominator cannot be zero: x - 3 ≠ 0, therefore x ≠ 3.',
          explanationAmharic: 'የአንድ ክፍልፋይ ታችኛው ክፍል (Denominator) ዜሮ መሆን አይችልም፤ x - 3 ≠ 0 ስለሆነ x ≠ 3 ነው።',
        },
        {
          id: 'q3',
          question: 'If f(x) = 3x - 4, what is the inverse function f⁻¹(x)?',
          questionAmharic: 'f(x) = 3x - 4 ከሆነ፣ ተገላቢጦሽ ፈንክሽኑ f⁻¹(x) ስንት ይሆናል?',
          options: [
            'f⁻¹(x) = (x + 4) / 3',
            'f⁻¹(x) = (x - 4) / 3',
            'f⁻¹(x) = 3x + 4',
            'f⁻¹(x) = 4 - 3x',
          ],
          optionsAmharic: [
            'f⁻¹(x) = (x + 4) / 3',
            'f⁻¹(x) = (x - 4) / 3',
            'f⁻¹(x) = 3x + 4',
            'f⁻¹(x) = 4 - 3x',
          ],
          correctIndex: 0,
          explanation: 'Let y = 3x - 4. Swap x and y: x = 3y - 4 => x + 4 = 3y => y = (x + 4) / 3.',
          explanationAmharic: 'y = 3x - 4 ብለን እንጀምር፤ x እና y ስንቀያይር x = 3y - 4 ይሆናል። x + 4 = 3y => y = (x + 4)/3 ነው።',
        },
      ],
    },
    {
      id: `exam-g${grade}-midterm-physics`,
      title: `Grade ${grade} Semester 1 Midterm Exam`,
      titleAmharic: `የ${grade}ኛ ክፍል 1ኛ ሴሚስተር አጋማሽ ፈተና`,
      subject: 'Physics',
      subjectAmharic: 'ፊዚክስ',
      type: 'midterm',
      durationMinutes: 40,
      totalMarks: 50,
      yearEC: '2019',
      questions: [
        {
          id: 'qp1',
          question: 'Which of the following is a fundamental physical quantity in the SI system?',
          questionAmharic: 'ከሚከተሉት ውስጥ በ SI ሲስተም መሰረታዊ አካላዊ መጠን (Fundamental physical quantity) የሆነው የትኛው ነው?',
          options: ['Velocity', 'Force', 'Mass', 'Density'],
          optionsAmharic: ['ፍጥነት (Velocity)', 'ኃይል (Force)', 'ይዘት/መጠነ-ቁስ (Mass)', 'ጥግግት (Density)'],
          correctIndex: 2,
          explanation: 'Mass (measured in kilograms) is one of the seven base SI quantities.',
          explanationAmharic: 'መጠነ-ቁስ (Mass) በኪሎግራም የሚለካ ሲሆን ከሰባቱ መሰረታዊ የ SI ክፍሎች አንዱ ነው።',
        },
        {
          id: 'qp2',
          question: 'According to Newton’s second law of motion, force equals:',
          questionAmharic: 'እንደ ኒውተን 2ኛ የእንቅስቃሴ ህግ ከሆነ፣ ኃይል (Force) እኩል የሚሆነው ከየትኛው ጋር ነው?',
          options: ['Mass × Acceleration', 'Mass / Velocity', 'Distance × Time', 'Weight / Gravity'],
          optionsAmharic: ['መጠነ-ቁስ × ፍጥንጥነት (Mass × Acceleration)', 'መጠነ-ቁስ / ፍጥነት', 'ርቀት × ጊዜ', 'ክብደት / ስበት'],
          correctIndex: 0,
          explanation: 'F = m × a (Force = Mass × Acceleration).',
          explanationAmharic: 'F = m × a (ኃይል = መጠነ-ቁስ × ፍጥንጥነት) ነው።',
        },
      ],
    },
    {
      id: `exam-g${grade}-final-chem`,
      title: `Grade ${grade} Semester Final Exam`,
      titleAmharic: `የ${grade}ኛ ክፍል ሴሚስተር ማጠቃለያ ፈተና`,
      subject: 'Chemistry',
      subjectAmharic: 'ኬሚስትሪ',
      type: 'final',
      durationMinutes: 60,
      totalMarks: 100,
      yearEC: '2019',
      questions: [
        {
          id: 'qc1',
          question: 'What is the pH of a neutral aqueous solution at 25°C?',
          questionAmharic: 'በ 25°C ላይ ገለልተኛ የውሃ ውህድ ፒኤች (pH) ስንት ነው?',
          options: ['0', '7', '14', '1'],
          optionsAmharic: ['0', '7', '14', '1'],
          correctIndex: 1,
          explanation: 'At 25°C, a neutral solution has pH = 7 ([H⁺] = 10⁻⁷ M).',
          explanationAmharic: 'በ 25°C የሙቀት መጠን ገለልተኛ (neutral) የሆነ መፍትሄ pH = 7 ነው።',
        },
      ],
    },
  ];

  const filteredExams = exams.filter((ex) => {
    if (selectedFilter === 'all') return true;
    return ex.type === selectedFilter;
  });

  const handleStartExam = (exam: MockExam) => {
    setActiveExam(exam);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setIsSubmitted(false);
    setTimeLeftSeconds(exam.durationMinutes * 60);
  };

  const handleSelectOption = (questionIndex: number, optionIndex: number) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIndex]: optionIndex,
    }));
  };

  const handleSubmitExam = () => {
    setIsSubmitted(true);
  };

  // Calculate score
  const scoreStats = React.useMemo(() => {
    if (!activeExam) return { correct: 0, total: 0, percentage: 0 };
    let correct = 0;
    activeExam.questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) {
        correct++;
      }
    });
    const total = activeExam.questions.length;
    const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
    return { correct, total, percentage };
  }, [activeExam, selectedAnswers]);

  // Active Exam Taking Screen
  if (activeExam) {
    const currentQ = activeExam.questions[currentQuestionIndex];
    return (
      <div className="space-y-6 max-w-4xl mx-auto pb-12 animate-in fade-in">
        {/* Exam Navigation Header */}
        <div className="p-4 sm:p-6 bg-white rounded-3xl border border-stone-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200 inline-block mb-1">
              {language === 'am' ? activeExam.subjectAmharic : activeExam.subject} • {activeExam.yearEC} E.C.
            </span>
            <h2 className="text-lg sm:text-xl font-black text-stone-900 font-serif-ethiopic">
              {language === 'am' ? activeExam.titleAmharic : activeExam.title}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 text-stone-700 text-xs font-bold">
              <Clock className="w-4 h-4 text-amber-600" />
              <span>{activeExam.durationMinutes} ደቂቃዎች</span>
            </div>

            <button
              onClick={() => setActiveExam(null)}
              className="px-3 py-1.5 rounded-xl border border-stone-200 text-xs font-bold text-stone-600 hover:bg-stone-50 cursor-pointer"
            >
              {language === 'am' ? 'ፈተናውን አቋርጥ' : 'Exit Exam'}
            </button>
          </div>
        </div>

        {/* Question Card */}
        <div className="p-6 sm:p-8 bg-white rounded-3xl border border-stone-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-stone-100 pb-4">
            <span className="text-xs font-black text-stone-400 uppercase">
              ጥያቄ {currentQuestionIndex + 1} ከ {activeExam.questions.length}
            </span>
            {onOpenAITutor && (
              <button
                type="button"
                onClick={() => onOpenAITutor(currentQ.question)}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>የ AI ማብራሪያ ጠይቅ (Ask NUR AI)</span>
              </button>
            )}
          </div>

          <p className="text-base sm:text-lg font-bold text-stone-900 leading-relaxed font-serif-ethiopic">
            {language === 'am' && currentQ.questionAmharic
              ? currentQ.questionAmharic
              : currentQ.question}
          </p>

          {/* Options */}
          <div className="space-y-3">
            {(language === 'am' && currentQ.optionsAmharic
              ? currentQ.optionsAmharic
              : currentQ.options
            ).map((opt, optIdx) => {
              const isSelected = selectedAnswers[currentQuestionIndex] === optIdx;
              const isCorrect = currentQ.correctIndex === optIdx;
              let btnStyle = 'border-stone-200 hover:border-emerald-400 bg-stone-50/50';

              if (isSubmitted) {
                if (isCorrect) {
                  btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold';
                } else if (isSelected) {
                  btnStyle = 'border-rose-500 bg-rose-50 text-rose-900';
                }
              } else if (isSelected) {
                btnStyle = 'border-emerald-600 bg-emerald-50/80 text-emerald-900 font-bold shadow-xs';
              }

              return (
                <button
                  key={optIdx}
                  type="button"
                  onClick={() => handleSelectOption(currentQuestionIndex, optIdx)}
                  className={`w-full p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between gap-3 text-sm ${btnStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-xl bg-white border border-stone-200 flex items-center justify-center font-bold text-xs shrink-0">
                      {String.fromCharCode(65 + optIdx)}
                    </span>
                    <span>{opt}</span>
                  </div>
                  {isSubmitted && isCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation if submitted */}
          {isSubmitted && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
              <span className="font-bold block">የጥያቄው ማብራሪያ (Explanation):</span>
              <p className="leading-relaxed">
                {language === 'am' && currentQ.explanationAmharic
                  ? currentQ.explanationAmharic
                  : currentQ.explanation}
              </p>
            </div>
          )}

          {/* Pagination & Submit Bar */}
          <div className="flex items-center justify-between pt-4 border-t border-stone-100">
            <button
              type="button"
              disabled={currentQuestionIndex === 0}
              onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
              className="px-4 py-2 rounded-xl border border-stone-200 text-xs font-bold text-stone-600 hover:bg-stone-50 disabled:opacity-30 cursor-pointer"
            >
              ቀዳሚ (Previous)
            </button>

            {currentQuestionIndex < activeExam.questions.length - 1 ? (
              <button
                type="button"
                onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                ቀጣይ (Next Question)
              </button>
            ) : !isSubmitted ? (
              <button
                type="button"
                onClick={handleSubmitExam}
                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-black shadow-md cursor-pointer animate-pulse"
              >
                ፈተናውን አስረክብ (Submit Exam)
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setActiveExam(null)}
                className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                ውጤት ተመልከት (Finish & Exit)
              </button>
            )}
          </div>
        </div>

        {/* Results summary card if submitted */}
        {isSubmitted && (
          <div className="p-6 bg-white rounded-3xl border border-emerald-300 shadow-sm text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-black text-stone-900 font-serif-ethiopic">
              የፈተና ውጤት፦ {scoreStats.percentage}% ({scoreStats.correct} / {scoreStats.total})
            </h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              ውጤትዎ በተማሪው ፕሮግረስ እና የትምህርት ቻርት ላይ ተመዝግቧል።
            </p>
          </div>
        )}
      </div>
    );
  }

  // Master Exams Directory View
  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 rounded-3xl p-6 sm:p-7 text-white shadow-sm border border-stone-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                ክፍል {grade} • ፈተናዎች & ማትሪክ
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/10 text-stone-300 border border-white/10">
                አዲሱ ሥርዓተ-ትምህርት
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black font-serif-ethiopic text-white">
              {language === 'am' ? 'የፈተና እና የማትሪክ ዝግጅት ማዕከል' : 'Exams & Matriculation Preparation Hub'}
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 mt-1 max-w-xl">
              የ1ኛ እና 2ኛ ሴሚስተር አጋማሽ፣ ማጠቃለያ እና የብሔራዊ መግቢያ የሞዴል ፈተናዎች ስብስብ።
            </p>
          </div>

          <div className="flex items-center gap-2 bg-stone-800/80 p-2 rounded-2xl border border-stone-700">
            <Flame className="w-5 h-5 text-amber-400" />
            <div>
              <span className="text-xs font-bold text-white block">የፈተና ሞተሮች</span>
              <span className="text-[10px] text-stone-400">100% አዳፕቲቭ</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: 'all', label: language === 'am' ? 'ሁሉም ፈተናዎች' : 'All Exams' },
          { id: 'matric', label: language === 'am' ? 'የብሔራዊ ማትሪክ ሞዴል' : 'Matric Model' },
          { id: 'midterm', label: language === 'am' ? 'የሴሚስተር አጋማሽ' : 'Midterm Exams' },
          { id: 'final', label: language === 'am' ? 'የሴሚስተር ማጠቃለያ' : 'Semester Finals' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setSelectedFilter(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
              selectedFilter === tab.id
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Exams Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredExams.map((exam) => (
          <div
            key={exam.id}
            className="p-5 rounded-3xl bg-white border border-stone-200/80 shadow-xs hover:border-emerald-500 transition-all flex flex-col justify-between gap-4"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-stone-100 text-stone-700">
                  {language === 'am' ? exam.subjectAmharic : exam.subject}
                </span>
                <span className="text-xs text-stone-400 font-mono">{exam.yearEC} ዓ.ም</span>
              </div>
              <h3 className="text-base font-bold text-stone-900 font-serif-ethiopic">
                {language === 'am' ? exam.titleAmharic : exam.title}
              </h3>
              <div className="flex items-center gap-4 text-xs text-stone-500 pt-1">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-stone-400" />
                  {exam.durationMinutes} ደቂቃ
                </span>
                <span className="flex items-center gap-1">
                  <FileCheck className="w-3.5 h-3.5 text-stone-400" />
                  {exam.questions.length} ጥያቄዎች
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleStartExam(exam)}
              className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs cursor-pointer transition-all"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>ፈተናውን ጀምር (Start Exam)</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
