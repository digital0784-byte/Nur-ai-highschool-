import React, { useState } from 'react';
import {
  Award,
  Clock,
  CheckCircle2,
  AlertCircle,
  Play,
  RotateCcw,
  Sparkles,
  BookOpen,
  ArrowRight,
  Flame,
  HelpCircle,
  FileCheck,
  GraduationCap,
  TrendingUp,
} from 'lucide-react';
import { GradeLevel } from '../../types/curriculumEngine';
import { LanguageCode } from '../../types';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { ProgressBar } from '../ui/ProgressBar';

interface StudentPracticeViewProps {
  grade: GradeLevel;
  language: LanguageCode;
  onOpenTopicQuiz?: (subjectId: string, topicId: string) => void;
  onOpenEntrancePrep?: () => void;
}

export const StudentPracticeView: React.FC<StudentPracticeViewProps> = ({
  grade,
  language,
  onOpenTopicQuiz,
  onOpenEntrancePrep,
}) => {
  // Practice sub-modes: 'overview' | 'active_quiz' | 'mistake_review'
  const [activeMode, setActiveMode] = useState<'overview' | 'active_quiz' | 'mistake_review'>('overview');
  const [selectedPracticeType, setSelectedPracticeType] = useState<string>('practice');

  // Interactive Quiz / Practice simulation state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const sampleQuestions = [
    {
      id: 'q-1',
      subject: 'ሒሳብ (Mathematics)',
      question:
        language === 'am'
          ? 'የፈንክሽኑ f(x) = 2x² - 4x + 1 ዶሜንና ሬንጅ የትኛው ነው?'
          : 'What is the domain and vertex of the quadratic function f(x) = 2x² - 4x + 1?',
      options: [
        language === 'am' ? 'A) ዶሜን: ሁሉም እውነተኛ ቁጥሮች (All Real Numbers)' : 'A) Domain: All Real Numbers, Vertex: (1, -1)',
        language === 'am' ? 'B) ዶሜን: x > 0 ብቻ' : 'B) Domain: x > 0 only, Vertex: (0, 1)',
        language === 'am' ? 'C) ዶሜን: x ≥ 2' : 'C) Domain: x ≥ 2, Vertex: (-1, 2)',
        language === 'am' ? 'D) ዶሜን: x < -1' : 'D) Domain: x < -1, Vertex: (2, 0)',
      ],
      correctIndex: 0,
      explanation:
        language === 'am'
          ? 'ለማንኛውም የሁለተኛ ዲግሪ ፖሊኖሚያል (Quadratic) ዶሜኑ ሁሉም እውነተኛ ቁጥሮች (ℝ) ናቸው።'
          : 'For any standard polynomial function, the domain includes all real numbers ℝ.',
    },
    {
      id: 'q-2',
      subject: 'ፊዚክስ (Physics)',
      question:
        language === 'am'
          ? 'አንድ አካል በ 5 m/s² ቋሚ ፍጥንጥነት ቢንቀሳቀስ፣ ከ 4 ሰከንድ በኋላ ያለው የፍጥነት ለውጥ ስንት ይሆናል?'
          : 'If an object accelerates uniformly at 5 m/s², what is its velocity change after 4 seconds?',
      options: ['A) 10 m/s', 'B) 20 m/s', 'C) 25 m/s', 'D) 1.25 m/s'],
      correctIndex: 1,
      explanation:
        language === 'am'
          ? 'Δv = a × t = 5 m/s² × 4 s = 20 m/s'
          : 'Using Δv = a × t gives 5 m/s² × 4 s = 20 m/s.',
    },
  ];

  const currentQ = sampleQuestions[currentQuestionIndex];

  const handleStartPractice = (type: string) => {
    setSelectedPracticeType(type);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setActiveMode(type === 'mistakes' ? 'mistake_review' : 'active_quiz');
  };

  const handleSelectOption = (idx: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(idx);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null) return;
    setIsAnswerSubmitted(true);
    if (selectedOption === currentQ.correctIndex) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < sampleQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      // Finished
      alert(
        language === 'am'
          ? `ልምምዱን አጠናቀዋል! ውጤትዎ: ${score + (selectedOption === currentQ.correctIndex ? 1 : 0)}/${sampleQuestions.length}`
          : `Practice session complete! Final Score: ${score + (selectedOption === currentQ.correctIndex ? 1 : 0)}/${sampleQuestions.length}`
      );
      setActiveMode('overview');
    }
  };

  // If active interactive quiz mode
  if (activeMode === 'active_quiz' || activeMode === 'mistake_review') {
    return (
      <div className="max-w-3xl mx-auto space-y-5 pb-12">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setActiveMode('overview')}
            className="text-xs font-bold text-stone-600 hover:text-stone-900 bg-white px-3.5 py-2 rounded-xl border border-stone-200 cursor-pointer shadow-xs"
          >
            ← {language === 'am' ? 'ወደ ልምምዶች ተመለስ' : 'Back to Practice Menu'}
          </button>
          <Badge variant="primary" dot>
            ጥያቄ {currentQuestionIndex + 1} ከ {sampleQuestions.length}
          </Badge>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200/60">
              {currentQ.subject}
            </span>
            <span className="text-xs font-mono text-stone-400">FDRE Curriculum Question Bank</span>
          </div>

          <h3 className="text-base sm:text-lg font-bold text-stone-900 font-serif-ethiopic leading-relaxed">
            {currentQ.question}
          </h3>

          {/* Options */}
          <div className="space-y-3">
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === currentQ.correctIndex;
              let btnStyle = 'border-stone-200 bg-stone-50/60 hover:bg-stone-100';

              if (isAnswerSubmitted) {
                if (isCorrect) {
                  btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-bold';
                } else if (isSelected) {
                  btnStyle = 'border-rose-400 bg-rose-50 text-rose-950';
                } else {
                  btnStyle = 'border-stone-200 opacity-50';
                }
              } else if (isSelected) {
                btnStyle = 'border-emerald-600 bg-emerald-50/80 text-emerald-950 font-bold shadow-xs';
              }

              return (
                <div
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  className={`p-4 rounded-2xl border text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-between ${btnStyle}`}
                >
                  <span>{opt}</span>
                  {isAnswerSubmitted && isCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Explanation if submitted */}
          {isAnswerSubmitted && (
            <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-xs sm:text-sm text-emerald-950 space-y-1">
              <span className="font-bold uppercase tracking-wider text-[11px] block">
                {language === 'am' ? 'የመልስ ማብራሪያ (Official Explanation)' : 'Official Solution'}
              </span>
              <p>{currentQ.explanation}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end pt-4 border-t border-stone-100">
            {!isAnswerSubmitted ? (
              <Button
                variant="primary"
                size="md"
                disabled={selectedOption === null}
                onClick={handleSubmitAnswer}
              >
                {language === 'am' ? 'መልሴን አረጋግጥ' : 'Check Answer'}
              </Button>
            ) : (
              <Button
                variant="primary"
                size="md"
                rightIcon={<ArrowRight className="w-4 h-4" />}
                onClick={handleNextQuestion}
              >
                {currentQuestionIndex < sampleQuestions.length - 1
                  ? language === 'am' ? 'ቀጣይ ጥያቄ' : 'Next Question'
                  : language === 'am' ? 'ልምምዱን ጨርስ' : 'Finish Practice'}
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Overview Practice Hub Menu
  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-stone-900 font-serif-ethiopic">
          {language === 'am' ? 'የልምምድና የፈተና ማዕከል' : 'Practice & Exam Preparation'}
        </h2>
        <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
          {language === 'am'
            ? 'በኢ.ፌ.ዲ.ሪ የትምህርት ሚኒስቴር ፈተናዎች መዋቅር የተዘጋጁ ጥያቄዎችን ይለማመዱ።'
            : 'Adaptive topical practice, quizzes, national mock exams, and university entrance prep.'}
        </p>
      </div>

      {/* 5 Core Practice Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* 1. Practice */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-xs flex flex-col justify-between hover:border-emerald-300 transition-all">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-stone-900 font-serif-ethiopic">
              {language === 'am' ? 'ዕለታዊ ልምምድ (Topic Practice)' : 'Topic Practice'}
            </h3>
            <p className="text-xs text-stone-500 mt-2 leading-relaxed">
              {language === 'am'
                ? 'በእያንዳንዱ ርዕስ ላይ ደረጃ በደረጃ የሚሰጡ የልምምድ ጥያቄዎች ከቅጽበታዊ ማብራሪያ ጋር።'
                : 'Adaptive step-by-step problem sets covering all units with hints and solution steps.'}
            </p>
          </div>
          <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between">
            <span className="text-xs text-stone-400 font-mono">1,400+ Questions</span>
            <Button variant="primary" size="sm" onClick={() => handleStartPractice('practice')}>
              {language === 'am' ? 'ጀምር' : 'Start'}
            </Button>
          </div>
        </div>

        {/* 2. Quiz */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-xs flex flex-col justify-between hover:border-amber-300 transition-all">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mb-4">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-stone-900 font-serif-ethiopic">
              {language === 'am' ? 'ፈጣን ምዘና (Timed Quiz)' : 'Timed Topical Quiz'}
            </h3>
            <p className="text-xs text-stone-500 mt-2 leading-relaxed">
              {language === 'am'
                ? 'በደቂቃዎች ውስጥ እውቀትዎን የሚለኩ ፈጣን የፈተና ጥያቄዎች ከነጥብና ደረጃ ጋር።'
                : '10-minute sprint quizzes to test comprehension, earn XP, and preserve your learning streak.'}
            </p>
          </div>
          <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between">
            <span className="text-xs text-stone-400 font-mono">+50 XP Per Quiz</span>
            <Button variant="primary" size="sm" onClick={() => handleStartPractice('quiz')}>
              {language === 'am' ? 'ተወዳደር' : 'Take Quiz'}
            </Button>
          </div>
        </div>

        {/* 3. Mock Exam */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-xs flex flex-col justify-between hover:border-blue-300 transition-all">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center mb-4">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-stone-900 font-serif-ethiopic">
              {language === 'am' ? 'ሞዴል ፈተና (Mock Exam Simulator)' : 'National Mock Exam'}
            </h3>
            <p className="text-xs text-stone-500 mt-2 leading-relaxed">
              {language === 'am'
                ? 'ትክክለኛውን የኢትዮጵያ የፈተና አሰጣጥ ሥርዓት የተከተለ ሙሉ የፈተና ማስመሰያ።'
                : 'Full-length simulated examination with realistic time constraints and section breakdown.'}
            </p>
          </div>
          <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between">
            <span className="text-xs text-stone-400 font-mono">50 Questions • 60 min</span>
            <Button variant="outline" size="sm" onClick={() => handleStartPractice('mock_exam')}>
              {language === 'am' ? 'ፈተና ጀምር' : 'Simulate'}
            </Button>
          </div>
        </div>

        {/* 4. Entrance Preparation */}
        <div className="bg-gradient-to-br from-stone-900 to-stone-850 rounded-3xl p-6 text-white shadow-xs flex flex-col justify-between border border-stone-800">
          <div>
            <div className="flex items-center justify-between gap-2 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                <GraduationCap className="w-6 h-6" />
              </div>
              <Badge variant="warning" size="xs">High School Exit</Badge>
            </div>
            <h3 className="text-lg font-bold text-white font-serif-ethiopic">
              {language === 'am'
                ? 'የዩኒቨርሲቲ መግቢያ ፈተና ዝግጅት'
                : 'University Entrance Prep'}
            </h3>
            <p className="text-xs text-stone-300 mt-2 leading-relaxed">
              {language === 'am'
                ? 'የ12ኛ ክፍል እና የከፍተኛ ሁለተኛ ደረጃ ተማሪዎች የዩኒቨርሲቲ መግቢያ ዝግጅት ሞተር።'
                : 'Curated previous national matriculation exam papers, high-yield items, and performance analytics.'}
            </p>
          </div>
          <div className="pt-4 mt-4 border-t border-stone-800 flex items-center justify-between">
            <span className="text-xs text-stone-400 font-mono">10 Years Exam Archives</span>
            <button
              onClick={() => onOpenEntrancePrep ? onOpenEntrancePrep() : handleStartPractice('entrance')}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-stone-950 font-bold text-xs cursor-pointer transition-all shadow-xs"
            >
              {language === 'am' ? 'ክፈት' : 'Launch Prep'}
            </button>
          </div>
        </div>

        {/* 5. Mistake Review */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-xs flex flex-col justify-between hover:border-rose-300 transition-all">
          <div>
            <div className="flex items-center justify-between gap-2 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-700 flex items-center justify-center">
                <RotateCcw className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                4 {language === 'am' ? 'ስህተቶች' : 'Items'}
              </span>
            </div>
            <h3 className="text-lg font-bold text-stone-900 font-serif-ethiopic">
              {language === 'am' ? 'የስህተቶች ክለሳ (Mistake Review)' : 'Mistake Review'}
            </h3>
            <p className="text-xs text-stone-500 mt-2 leading-relaxed">
              {language === 'am'
                ? 'ቀደም ሲል በተሳሳቷቸው ጥያቄዎች ላይ ያተኮረ ስማርት ማስተካከያና ዳግም ፈተና።'
                : 'Smart spaced-repetition of questions you previously answered incorrectly until mastered.'}
            </p>
          </div>
          <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between">
            <span className="text-xs text-stone-400 font-mono">Remedial Engine</span>
            <Button variant="danger" size="sm" onClick={() => handleStartPractice('mistakes')}>
              {language === 'am' ? 'ስህተቶችን አርም' : 'Review'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
