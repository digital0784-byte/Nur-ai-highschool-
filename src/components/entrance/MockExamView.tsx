import React, { useState, useEffect, useRef } from 'react';
import {
  EntranceMockExam,
  EntranceQuestion,
  EntranceMockAttempt,
  EntranceStream,
  TopicPerformance,
} from '../../types/entranceExam';
import { Grade } from '../../types';
import {
  Clock,
  Flag,
  CheckCircle2,
  AlertTriangle,
  Award,
  ArrowRight,
  RotateCcw,
  ShieldCheck,
  ChevronRight,
  BookOpen,
  Filter,
  BarChart2,
  FileText,
} from 'lucide-react';

interface MockExamViewProps {
  mockExams: EntranceMockExam[];
  questions: EntranceQuestion[];
  userId: string;
  grade: Grade;
  stream: EntranceStream;
  onSaveAttempt: (attempt: EntranceMockAttempt) => void;
  onAskAICoach: (question: EntranceQuestion, userAnswer: any) => void;
}

export const MockExamView: React.FC<MockExamViewProps> = ({
  mockExams,
  questions,
  userId,
  grade,
  stream,
  onSaveAttempt,
  onAskAICoach,
}) => {
  const [selectedExam, setSelectedExam] = useState<EntranceMockExam | null>(null);
  const [examQuestions, setExamQuestions] = useState<EntranceQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<number, boolean>>({});
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState<number>(0);
  const [isExamActive, setIsExamActive] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [completedAttempt, setCompletedAttempt] = useState<EntranceMockAttempt | null>(null);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState<boolean>(false);

  const timerRef = useRef<any>(null);

  // Start exam
  const handleStartExam = (exam: EntranceMockExam) => {
    setSelectedExam(exam);
    // Gather matching questions
    const qList = exam.questionIds
      .map((id) => questions.find((q) => q.id === id))
      .filter((q): q is EntranceQuestion => Boolean(q));

    // Fallback if question bank is small: append sample questions
    let finalQuestions = qList;
    if (finalQuestions.length < 5) {
      const extra = questions.filter((q) => !finalQuestions.some((f) => f.id === q.id));
      finalQuestions = [...finalQuestions, ...extra].slice(0, 10);
    }

    setExamQuestions(finalQuestions);
    setCurrentIndex(0);
    setUserAnswers({});
    setFlaggedQuestions({});
    setTimeRemainingSeconds(exam.durationMinutes * 60);
    setIsExamActive(true);
    setIsSubmitted(false);
    setCompletedAttempt(null);
  };

  // Timer countdown
  useEffect(() => {
    if (isExamActive && timeRemainingSeconds > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemainingSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleSubmitExam(); // Auto-submit when time expires
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isExamActive, timeRemainingSeconds]);

  const handleSelectOption = (optIndex: number) => {
    if (isSubmitted) return;
    setUserAnswers((prev) => ({
      ...prev,
      [currentIndex]: optIndex,
    }));
  };

  const handleToggleFlag = (index: number) => {
    setFlaggedQuestions((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleSubmitExam = () => {
    if (!selectedExam || isSubmitted) return;
    setShowSubmitConfirm(false);

    let correctCount = 0;
    const subjectMap: Record<string, { subject: string; score: number; total: number }> = {};
    const topicMap: Record<string, { topic: string; subject: string; score: number; total: number }> = {};
    const diffMap: Record<string, { diff: string; score: number; total: number }> = {};
    const weakAreas: string[] = [];

    examQuestions.forEach((q, idx) => {
      const chosen = userAnswers[idx];
      const isCorrect = chosen === q.correctAnswer;
      if (isCorrect) correctCount += 1;

      // Subject
      if (!subjectMap[q.subject]) {
        subjectMap[q.subject] = { subject: q.subject, score: 0, total: 0 };
      }
      subjectMap[q.subject].total += 1;
      if (isCorrect) subjectMap[q.subject].score += 1;

      // Topic
      if (!topicMap[q.topic]) {
        topicMap[q.topic] = { topic: q.topic, subject: q.subject, score: 0, total: 0 };
      }
      topicMap[q.topic].total += 1;
      if (isCorrect) topicMap[q.topic].score += 1;
      else if (!weakAreas.includes(q.topic)) weakAreas.push(q.topic);

      // Difficulty
      if (!diffMap[q.difficulty]) {
        diffMap[q.difficulty] = { diff: q.difficulty, score: 0, total: 0 };
      }
      diffMap[q.difficulty].total += 1;
      if (isCorrect) diffMap[q.difficulty].score += 1;
    });

    const totalQuestions = examQuestions.length;
    const attemptedCount = Object.keys(userAnswers).length;
    const unansweredCount = totalQuestions - attemptedCount;
    const percentage = Math.round((correctCount / Math.max(1, totalQuestions)) * 100);
    const accuracy = attemptedCount > 0 ? Math.round((correctCount / attemptedCount) * 100) : 0;
    const timeUsedSeconds = selectedExam.durationMinutes * 60 - timeRemainingSeconds;

    const subjectBreakdown: Record<string, { score: number; total: number; percentage: number }> = {};
    Object.values(subjectMap).forEach((s) => {
      subjectBreakdown[s.subject] = {
        score: s.score,
        total: s.total,
        percentage: Math.round((s.score / s.total) * 100),
      };
    });

    const topicBreakdown: Record<string, TopicPerformance> = {};
    Object.values(topicMap).forEach((t) => {
      const pct = Math.round((t.score / t.total) * 100);
      topicBreakdown[t.topic] = {
        topic: t.topic,
        subject: t.subject,
        score: t.score,
        total: t.total,
        percentage: pct,
        isWeak: pct < 60,
      };
    });

    const difficultyBreakdown: Record<string, { score: number; total: number; percentage: number }> = {};
    Object.values(diffMap).forEach((d) => {
      difficultyBreakdown[d.diff] = {
        score: d.score,
        total: d.total,
        percentage: Math.round((d.score / d.total) * 100),
      };
    });

    const recommendations = [
      `Focus revision on weak areas: ${weakAreas.slice(0, 3).join(', ') || 'Keep practicing mixed sets'}.`,
      'Review mistakes in the Mistake Book to reinforce conceptual rules.',
      'Practice with strict timers to build speed on calculation-intensive items.',
    ];

    const attempt: EntranceMockAttempt = {
      id: `attempt-${userId}-${selectedExam.id}-${Date.now()}`,
      examId: selectedExam.id,
      examTitle: selectedExam.title,
      mockExamTitle: selectedExam.title,
      userId,
      grade,
      score: correctCount,
      total: totalQuestions,
      percentage,
      accuracy,
      timeUsedSeconds,
      attemptedCount,
      unansweredCount,
      subjectBreakdown,
      topicBreakdown,
      difficultyBreakdown,
      subjectPerformance: Object.entries(subjectBreakdown).reduce((acc, [subj, data]: [string, any]) => {
        acc[subj] = { score: data.score, total: data.total, accuracy: data.percentage };
        return acc;
      }, {} as Record<string, { score: number; total: number; accuracy: number }>),
      topicPerformance: {},
      difficultyPerformance: {},
      weakAreas,
      recommendations,
      answers: examQuestions.reduce((acc, q, idx) => {
        acc[q.id] = {
          questionId: q.id,
          selectedAnswer: userAnswers[idx] ?? null,
          correctAnswer: q.correctAnswer,
          isCorrect: userAnswers[idx] === q.correctAnswer,
          timeTakenSeconds: Math.round(timeUsedSeconds / totalQuestions),
          topic: q.topic,
          subject: q.subject,
          difficulty: q.difficulty,
        };
        return acc;
      }, {} as Record<string, MockExamAnswer>),
      completedAt: new Date().toISOString(),
    };

    setIsExamActive(false);
    setIsSubmitted(true);
    setCompletedAttempt(attempt);
    onSaveAttempt(attempt);
  };

  const currentQ = examQuestions[currentIndex];

  // 1. RESULT SCREEN
  if (isSubmitted && completedAttempt) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header Summary */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
          <div className="text-center space-y-2 pb-6 border-b border-stone-100">
            <div className="w-16 h-16 bg-indigo-50 text-indigo-700 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
              <Award className="w-8 h-8" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif-ethiopic text-stone-900">
              የሞዴል ፈተና ውጤት ማጠቃለያ (Exam Results)
            </h2>
            <p className="text-xs text-stone-500 max-w-lg mx-auto">
              {completedAttempt.mockExamTitle}
            </p>

            <div className="inline-flex items-center gap-4 px-6 py-2.5 bg-stone-50 border border-stone-200 rounded-2xl text-sm pt-2">
              <div>
                <span className="text-stone-500 text-xs">ጠቅላላ ውጤት፡ </span>
                <span className="font-extrabold text-stone-900 text-base">
                  {completedAttempt.score} / {completedAttempt.total} ({completedAttempt.percentage}%)
                </span>
              </div>
              <div className="w-px h-6 bg-stone-200" />
              <div>
                <span className="text-stone-500 text-xs">ትክክለኛነት፡ </span>
                <span className="font-extrabold text-emerald-700 text-base">
                  {completedAttempt.accuracy}%
                </span>
              </div>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80 text-center space-y-1">
              <span className="text-xs text-stone-500 font-semibold">የተሞከሩ ጥያቄዎች</span>
              <div className="text-xl font-bold text-stone-900">{completedAttempt.attemptedCount}</div>
            </div>
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80 text-center space-y-1">
              <span className="text-xs text-stone-500 font-semibold">ያልተሞከሩ ጥያቄዎች</span>
              <div className="text-xl font-bold text-stone-900">{completedAttempt.unansweredCount}</div>
            </div>
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80 text-center space-y-1">
              <span className="text-xs text-stone-500 font-semibold">የተወሰደ ጊዜ</span>
              <div className="text-xl font-bold text-stone-900">
                {Math.floor(completedAttempt.timeUsedSeconds / 60)} ደቂቃ
              </div>
            </div>
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80 text-center space-y-1">
              <span className="text-xs text-stone-500 font-semibold">የደካማ ርዕሶች ብዛት</span>
              <div className="text-xl font-bold text-rose-700">{completedAttempt.weakAreas.length}</div>
            </div>
          </div>

          {/* Subject-by-Subject Breakdown */}
          <div className="space-y-3 pt-2">
            <h4 className="text-sm font-bold font-serif-ethiopic text-stone-900 flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-indigo-600" />
              በትምህርት አይነት የተገኘ ውጤት (Subject Breakdown)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.entries(completedAttempt.subjectBreakdown).map(([subj, data]) => (
                <div
                  key={subj}
                  className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between"
                >
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-stone-800">{subj}</span>
                    <p className="text-[10px] text-stone-500">
                      {data.score} ከ {data.total} ትክክል
                    </p>
                  </div>
                  <span className="text-xs font-bold text-stone-900 px-2 py-1 bg-white rounded-lg border border-stone-200">
                    {data.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Weak Topics & Recommendations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 bg-rose-50/70 border border-rose-200 rounded-2xl space-y-2">
              <h4 className="text-xs font-bold text-rose-800 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                ደካማ ርዕሶች (Weak Topics Detected)
              </h4>
              {completedAttempt.weakAreas.length > 0 ? (
                <ul className="space-y-1 text-xs text-rose-900">
                  {completedAttempt.weakAreas.map((area, idx) => (
                    <li key={idx} className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                      <span>{area}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-rose-700">ሁሉንም ርዕሶች በአጥጋቢ ደረጃ አጠናቀዋል!</p>
              )}
            </div>

            <div className="p-4 bg-indigo-50/70 border border-indigo-200 rounded-2xl space-y-2">
              <h4 className="text-xs font-bold text-indigo-900 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-700" />
                ቀጣይ የሚመከሩ የጥናት እርምጃዎች (Recommendations)
              </h4>
              <ul className="space-y-1 text-xs text-indigo-950">
                {completedAttempt.recommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0 mt-1.5" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Mandatory Disclaimer */}
          <div className="p-4 bg-stone-100 rounded-2xl border border-stone-200 flex items-start gap-3 text-xs text-stone-600">
            <ShieldCheck className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
            <p>
              <strong>ህጋዊ ማሳሰቢያ (Official Disclaimer):</strong> Results are for practice and diagnostic purposes only and do not guarantee official national examination outcomes or university admission decisions.
            </p>
          </div>

          {/* Action buttons */}
          <div className="pt-4 flex items-center justify-between">
            <button
              onClick={() => {
                setIsSubmitted(false);
                setIsExamActive(false);
                setSelectedExam(null);
              }}
              className="px-5 py-2.5 border border-stone-200 hover:bg-stone-50 text-stone-700 rounded-xl text-xs font-bold cursor-pointer"
            >
              ወደ ፈተናዎች ዝርዝር ተመለስ
            </button>

            {selectedExam && (
              <button
                onClick={() => handleStartExam(selectedExam)}
                className="px-6 py-2.5 bg-indigo-700 hover:bg-indigo-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <RotateCcw className="w-4 h-4" />
                <span>ፈተናውን እንደገና ውሰድ</span>
              </button>
            )}
          </div>
        </div>

        {/* Detailed Question Review List */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-4">
          <h3 className="text-base font-bold font-serif-ethiopic text-stone-900">
            የጥያቄዎች ዝርዝር ክለሳ (Question Review & Explanations)
          </h3>

          <div className="space-y-4">
            {examQuestions.map((q, idx) => {
              const userAns = userAnswers[idx];
              const isCorrect = userAns === q.correctAnswer;
              return (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl border space-y-2 ${
                    isCorrect ? 'bg-emerald-50/40 border-emerald-200' : 'bg-rose-50/40 border-rose-200'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-stone-700 font-bold">ጥያቄ {idx + 1} ({q.subject})</span>
                    <span className={isCorrect ? 'text-emerald-700 font-bold' : 'text-rose-700 font-bold'}>
                      {isCorrect ? 'ትክክል ✓' : 'ስህተት ✗'}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm font-semibold text-stone-900">{q.question}</p>

                  <div className="text-xs text-stone-600 space-y-0.5 pt-1">
                    <p>የመረጡት መልስ፡ <strong>{userAns !== undefined ? q.options?.[userAns] : 'ያልተመለሰ'}</strong></p>
                    <p className="text-emerald-800 font-bold">ትክክለኛ መልስ፡ {q.options?.[q.correctAnswer]}</p>
                    <p className="text-[11px] text-stone-500 pt-1">ማብራሪያ፡ {q.explanation}</p>
                  </div>

                  {!isCorrect && (
                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={() => onAskAICoach(q, userAns)}
                        className="px-3 py-1 bg-white hover:bg-stone-50 border border-indigo-200 text-indigo-700 rounded-lg text-xs font-bold cursor-pointer"
                      >
                        ይህን ጥያቄ AI አስጠኚን ጠይቅ
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // 2. ACTIVE EXAM SCREEN
  if (isExamActive && currentQ && selectedExam) {
    const isFlagged = flaggedQuestions[currentIndex];
    const minutesLeft = Math.floor(timeRemainingSeconds / 60);
    const secondsLeft = timeRemainingSeconds % 60;
    const answeredCount = Object.keys(userAnswers).length;

    return (
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Top Floating Control Bar */}
        <div className="bg-stone-900 text-white rounded-2xl p-4 sm:p-5 shadow-lg flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] text-stone-400 font-mono uppercase tracking-wider">
              {selectedExam.title}
            </span>
            <div className="text-xs sm:text-sm font-bold font-serif-ethiopic flex items-center gap-2">
              <span>ጥያቄ {currentIndex + 1} ከ {examQuestions.length}</span>
              <span className="text-stone-400">•</span>
              <span className="text-stone-300 font-normal">የተመለሱ፡ {answeredCount}/{examQuestions.length}</span>
            </div>
          </div>

          {/* Countdown Clock */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-xl font-mono text-sm font-bold text-amber-300 border border-white/10">
              <Clock className="w-4 h-4" />
              <span>{minutesLeft}:{secondsLeft.toString().padStart(2, '0')}</span>
            </div>

            <button
              onClick={() => setShowSubmitConfirm(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer"
            >
              ፈተና ጨርስ (Submit)
            </button>
          </div>
        </div>

        {/* Question Card & Palette Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Question Body */}
          <div className="lg:col-span-3 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 bg-stone-100 rounded-lg text-xs font-bold text-stone-800 uppercase">
                  {currentQ.subject}
                </span>
                <span className="text-xs text-stone-500 font-medium">
                  {currentQ.unit}
                </span>
              </div>

              <button
                onClick={() => handleToggleFlag(currentIndex)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all cursor-pointer ${
                  isFlagged
                    ? 'bg-amber-50 text-amber-900 border-amber-300'
                    : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                }`}
              >
                <Flag className={`w-3.5 h-3.5 ${isFlagged ? 'fill-amber-500 text-amber-600' : ''}`} />
                <span>{isFlagged ? 'ተሰይሟል (Flagged)' : 'ምልክት አድርግ (Flag)'}</span>
              </button>
            </div>

            {/* Question Statement */}
            <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200/80 space-y-2">
              <p className="text-sm sm:text-base font-semibold text-stone-900 leading-relaxed">
                {currentQ.question}
              </p>
              <div className="text-[11px] text-stone-500 flex items-center gap-2">
                <span>ምንጭ፡ {currentQ.source}</span>
                {currentQ.page && <span>(ገጽ {currentQ.page})</span>}
              </div>
            </div>

            {/* Options */}
            <div className="space-y-2.5">
              {currentQ.options?.map((option, idx) => {
                const isSelected = userAnswers[currentIndex] === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full p-4 rounded-xl text-left text-xs sm:text-sm font-medium transition-all flex items-center justify-between border cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-sm border-indigo-600'
                        : 'bg-white hover:bg-stone-50 text-stone-800 border-stone-200'
                    }`}
                  >
                    <span>{option}</span>
                    <span
                      className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-bold ${
                        isSelected ? 'border-white text-white' : 'border-stone-300 text-stone-500'
                      }`}
                    >
                      {String.fromCharCode(65 + idx)}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Navigation */}
            <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
              <button
                onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentIndex === 0}
                className="px-4 py-2 border border-stone-200 text-stone-600 rounded-xl text-xs font-semibold hover:bg-stone-50 disabled:opacity-40 cursor-pointer"
              >
                ቀዳሚ ጥያቄ
              </button>

              <button
                onClick={() => setCurrentIndex((prev) => Math.min(examQuestions.length - 1, prev + 1))}
                disabled={currentIndex === examQuestions.length - 1}
                className="px-5 py-2 bg-stone-900 hover:bg-black text-white rounded-xl text-xs font-bold flex items-center gap-1.5 disabled:opacity-40 cursor-pointer"
              >
                <span>ቀጣይ ጥያቄ</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Question Palette Sidebar */}
          <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-sm space-y-4 h-fit">
            <h4 className="text-xs font-bold font-serif-ethiopic text-stone-900 uppercase tracking-wider">
              የጥያቄዎች ማውጫ (Question Palette)
            </h4>

            <div className="grid grid-cols-5 gap-2">
              {examQuestions.map((_, idx) => {
                const isAnswered = userAnswers[idx] !== undefined;
                const flagged = flaggedQuestions[idx];
                const isCur = currentIndex === idx;

                let bgClass = 'bg-stone-100 text-stone-600';
                if (isCur) {
                  bgClass = 'ring-2 ring-indigo-600 font-bold bg-stone-900 text-white';
                } else if (flagged) {
                  bgClass = 'bg-amber-100 text-amber-900 font-bold';
                } else if (isAnswered) {
                  bgClass = 'bg-emerald-100 text-emerald-900 font-bold';
                }

                return (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-9 rounded-xl text-xs flex items-center justify-center transition-all cursor-pointer ${bgClass}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            <div className="pt-3 border-t border-stone-100 space-y-1.5 text-[11px] text-stone-600">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-emerald-100 border border-emerald-300" />
                <span>የተመለሰ ({answeredCount})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-amber-100 border border-amber-300" />
                <span>የተሰየመ ({Object.values(flaggedQuestions).filter(Boolean).length})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-stone-100 border border-stone-300" />
                <span>ያልተመለሰ ({examQuestions.length - answeredCount})</span>
              </div>
            </div>
          </div>
        </div>

        {/* Confirmation Modal */}
        {showSubmitConfirm && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-stone-200 shadow-xl space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="text-center space-y-1">
                <h3 className="text-base font-bold font-serif-ethiopic text-stone-900">
                  ፈተናውን ለማጠናቀቅ እርግጠኛ ነዎት?
                </h3>
                <p className="text-xs text-stone-500">
                  እስካሁን ከመለሷቸው {answeredCount} ጥያቄዎች ውስጥ {examQuestions.length - answeredCount} ጥያቄዎች አልተመለሱም።
                </p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => setShowSubmitConfirm(false)}
                  className="flex-1 py-2.5 border border-stone-200 hover:bg-stone-50 rounded-xl text-xs font-semibold text-stone-700 cursor-pointer"
                >
                  ወደ ፈተናው ተመለስ
                </button>
                <button
                  onClick={handleSubmitExam}
                  className="flex-1 py-2.5 bg-indigo-700 hover:bg-indigo-800 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  አጠናቅቅና አስረክብ
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // 3. EXAMS LISTING VIEW
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif-ethiopic text-stone-900 flex items-center gap-2">
            <Award className="w-6 h-6 text-indigo-600" />
            የዩኒቨርሲቲ መግቢያ ሞዴል ፈተናዎች (Entrance Mock Exams)
          </h2>
          <p className="text-xs text-stone-500">
            በእውነተኛ የፈተና ሰዓትና የጥያቄ ብዛት የተዘጋጁ ሙሉ ሞዴል ፈተናዎች።
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {mockExams.map((exam) => (
            <div
              key={exam.id}
              className="p-6 rounded-2xl border border-stone-200 hover:border-indigo-500 hover:shadow-md transition-all bg-stone-50 hover:bg-white space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 bg-indigo-100 text-indigo-800 rounded-lg text-[10px] font-bold uppercase">
                    Grade {exam.grade} • {exam.stream.toUpperCase()}
                  </span>
                  <span className="text-xs text-stone-500 font-mono font-semibold flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {exam.durationMinutes} ደቂቃ
                  </span>
                </div>

                <h3 className="text-base font-bold text-stone-900">{exam.title}</h3>
                <p className="text-xs text-stone-600 leading-relaxed">{exam.description || exam.instructions}</p>
              </div>

              <div className="space-y-3 pt-3 border-t border-stone-200/60">
                <div className="flex items-center justify-between text-xs text-stone-500">
                  <span>የትምህርት ክፍሎች፡</span>
                  <span className="font-semibold text-stone-800">{exam.subjects.join(', ')}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-stone-500">
                  <span>ጠቅላላ የጥያቄዎች ብዛት፡</span>
                  <span className="font-bold text-stone-800">{exam.totalQuestions || exam.questionCount} ጥያቄዎች</span>
                </div>

                <button
                  onClick={() => handleStartExam(exam)}
                  className="w-full py-2.5 bg-indigo-700 hover:bg-indigo-800 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>ፈተናውን ጀምር (Start Exam)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
