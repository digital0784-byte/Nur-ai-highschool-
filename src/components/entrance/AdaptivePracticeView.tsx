import React, { useState, useEffect, useRef } from 'react';
import {
  EntranceQuestion,
  QuestionDifficulty,
  PracticeMode,
  MistakeRecord,
} from '../../types/entranceExam';
import { Grade } from '../../types';
import {
  BrainCircuit,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  ArrowRight,
  HelpCircle,
  Award,
  AlertTriangle,
  RotateCcw,
  BookOpen,
  Filter,
  Flame,
  Zap,
} from 'lucide-react';

interface AdaptivePracticeViewProps {
  questions: EntranceQuestion[];
  userId: string;
  grade: Grade;
  onRecordMistake: (mistake: MistakeRecord) => void;
  onAskAICoach: (question: EntranceQuestion, userAnswer: any) => void;
  onPracticeFinished?: (stats: { solved: number; correct: number; timeSecs: number }) => void;
}

export const AdaptivePracticeView: React.FC<AdaptivePracticeViewProps> = ({
  questions,
  userId,
  grade,
  onRecordMistake,
  onAskAICoach,
  onPracticeFinished,
}) => {
  const [practiceMode, setPracticeMode] = useState<PracticeMode>('quick');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [currentDifficulty, setCurrentDifficulty] = useState<QuestionDifficulty>('medium');

  // Filter pool
  const filteredQuestions = questions.filter((q) => {
    if (selectedSubject !== 'all' && q.subject !== selectedSubject) return false;
    return true;
  });

  const [sessionQuestions, setSessionQuestions] = useState<EntranceQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [responseTimes, setResponseTimes] = useState<number[]>([]);
  const [correctCount, setCorrectCount] = useState<number>(0);

  // Timer
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isSessionActive, setIsSessionActive] = useState<boolean>(false);
  const timerRef = useRef<any>(null);

  const startSession = (mode: PracticeMode) => {
    setPracticeMode(mode);
    let count = 5;
    if (mode === 'quick') count = 5;
    else if (mode === 'topic' || mode === 'mixed') count = 10;
    else if (mode === 'timed') count = 15;

    // Shuffle & take
    const pool = [...filteredQuestions].sort(() => 0.5 - Math.random()).slice(0, count);
    setSessionQuestions(pool);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setHasAnswered(false);
    setIsCorrect(false);
    setResponseTimes([]);
    setCorrectCount(0);
    setTimerSeconds(0);
    setIsSessionActive(true);
  };

  // Timer effect
  useEffect(() => {
    if (isSessionActive && !hasAnswered) {
      timerRef.current = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isSessionActive, hasAnswered, currentIndex]);

  const currentQ = sessionQuestions[currentIndex];

  const handleSelectAnswer = (idx: number) => {
    if (hasAnswered) return;
    setSelectedAnswer(idx);
    setHasAnswered(true);

    const correct = idx === currentQ.correctAnswer;
    setIsCorrect(correct);
    if (correct) {
      setCorrectCount((prev) => prev + 1);
      // Adaptive increase difficulty
      if (currentDifficulty === 'easy') setCurrentDifficulty('medium');
      else if (currentDifficulty === 'medium') setCurrentDifficulty('hard');
      else if (currentDifficulty === 'hard') setCurrentDifficulty('advanced');
    } else {
      // Record mistake
      const mistake: MistakeRecord = {
        id: `mistake-${userId}-${currentQ.id}-${Date.now()}`,
        userId,
        questionId: currentQ.id,
        question: currentQ,
        userAnswer: idx,
        correctAnswer: currentQ.correctAnswer,
        attemptedAt: new Date().toISOString(),
        retryCount: 1,
        understood: false,
        conceptGap: currentQ.conceptGaps?.[0] || 'Conceptual derivation error',
        sourceExamOrPractice: 'Adaptive Practice',
      };
      onRecordMistake(mistake);

      // Step down difficulty adaptively
      if (currentDifficulty === 'advanced') setCurrentDifficulty('hard');
      else if (currentDifficulty === 'hard') setCurrentDifficulty('medium');
      else if (currentDifficulty === 'medium') setCurrentDifficulty('easy');
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex < sessionQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setHasAnswered(false);
      setIsCorrect(false);
    } else {
      // Finished
      setIsSessionActive(false);
      if (onPracticeFinished) {
        onPracticeFinished({
          solved: sessionQuestions.length,
          correct: correctCount + (isCorrect ? 1 : 0),
          timeSecs: timerSeconds,
        });
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Session Controls & Mode Selector */}
      {!isSessionActive && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-stone-100">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-serif-ethiopic text-stone-900 flex items-center gap-2">
                <BrainCircuit className="w-6 h-6 text-indigo-600" />
                ተለዋዋጭ የልምምድ ሞተር (Adaptive & Timed Practice)
              </h2>
              <p className="text-xs text-stone-500">
                በትክክለኛ መልሶች አስቸጋሪነቱ የሚጨምር፤ በስህተት ጊዜ ማብራሪያና ቀላል ጥያቄዎችን የሚያቀርብ ስርዓት።
              </p>
            </div>

            {/* Subject filter */}
            <div className="flex items-center gap-2 text-xs">
              <Filter className="w-4 h-4 text-stone-400" />
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-800 font-semibold focus:outline-none"
              >
                <option value="all">ሁሉንም የትምህርት አይነቶች (All)</option>
                <option value="math">Mathematics (ሒሳብ)</option>
                <option value="physics">Physics (ፊዚክስ)</option>
                <option value="chemistry">Chemistry (ኬሚስትሪ)</option>
                <option value="biology">Biology (ባዮሎጂ)</option>
                <option value="english">English (እንግሊዝኛ)</option>
                <option value="aptitude">Aptitude (አጠቃላይ ብቃት)</option>
                <option value="history">History (ታሪክ)</option>
                <option value="geography">Geography (ጆግራፊ)</option>
                <option value="economics">Economics (ኢኮኖሚክስ)</option>
              </select>
            </div>
          </div>

          {/* Modes Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div
              onClick={() => startSession('quick')}
              className="p-5 rounded-2xl border border-stone-200 hover:border-indigo-500 hover:shadow-md transition-all cursor-pointer bg-stone-50 hover:bg-white space-y-3"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-stone-900">Quick Practice</h4>
                <p className="text-xs text-stone-500">5 ፈጣን ጥያቄዎች ለዕለታዊ ልምምድ</p>
              </div>
              <span className="inline-block text-[10px] font-bold text-indigo-700 uppercase">
                5 Questions • ~5 mins
              </span>
            </div>

            <div
              onClick={() => startSession('topic')}
              className="p-5 rounded-2xl border border-stone-200 hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer bg-stone-50 hover:bg-white space-y-3"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-stone-900">Topic Drill</h4>
                <p className="text-xs text-stone-500">በአንድ የተመረጠ ርዕስ ላይ ጥልቅ ልምምድ</p>
              </div>
              <span className="inline-block text-[10px] font-bold text-emerald-700 uppercase">
                10 Questions • ~12 mins
              </span>
            </div>

            <div
              onClick={() => startSession('mixed')}
              className="p-5 rounded-2xl border border-stone-200 hover:border-purple-500 hover:shadow-md transition-all cursor-pointer bg-stone-50 hover:bg-white space-y-3"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                <BrainCircuit className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-stone-900">Mixed Composite</h4>
                <p className="text-xs text-stone-500">የተደባለቁ የሳይንስና የቋንቋ ጥያቄዎች</p>
              </div>
              <span className="inline-block text-[10px] font-bold text-purple-700 uppercase">
                10 Questions • Adaptive
              </span>
            </div>

            <div
              onClick={() => startSession('timed')}
              className="p-5 rounded-2xl border border-stone-200 hover:border-amber-500 hover:shadow-md transition-all cursor-pointer bg-stone-50 hover:bg-white space-y-3"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-stone-900">Timed Sprint</h4>
                <p className="text-xs text-stone-500">በጥብቅ የጊዜ ቆጣሪ ፍጥነትን መሞከር</p>
              </div>
              <span className="inline-block text-[10px] font-bold text-amber-700 uppercase">
                15 Questions • Timed
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Active Question Screen */}
      {isSessionActive && currentQ && (
        <div className="max-w-3xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
          {/* Top Bar */}
          <div className="flex items-center justify-between pb-4 border-b border-stone-100">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-stone-900 text-white rounded-xl text-xs font-bold font-serif-ethiopic">
                ጥያቄ {currentIndex + 1} / {sessionQuestions.length}
              </span>
              <span className="text-xs text-stone-500 font-semibold uppercase">
                {currentQ.subject}
              </span>
              <span className="px-2 py-0.5 bg-indigo-50 text-indigo-800 rounded text-[10px] font-bold uppercase">
                Difficulty: {currentQ.difficulty}
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs font-mono text-stone-600 bg-stone-50 px-3 py-1 rounded-xl border border-stone-200">
              <Clock className="w-3.5 h-3.5 text-stone-500" />
              <span>
                {Math.floor(timerSeconds / 60)}:{(timerSeconds % 60).toString().padStart(2, '0')}
              </span>
            </div>
          </div>

          {/* Question Text & Textbook Citation */}
          <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200/80 space-y-2">
            <p className="text-sm sm:text-base font-semibold text-stone-900 leading-relaxed">
              {currentQ.question}
            </p>
            <div className="text-[11px] text-stone-500 flex flex-wrap items-center gap-3 pt-1">
              <span>📚 ምንጭ፡ {currentQ.source}</span>
              {currentQ.page && <span>(ገጽ {currentQ.page})</span>}
              <span className="text-stone-400">•</span>
              <span>{currentQ.unit} - {currentQ.topic}</span>
            </div>
          </div>

          {/* Options */}
          <div className="space-y-2.5">
            {currentQ.options?.map((option, idx) => {
              const isSelected = selectedAnswer === idx;
              const isOptionCorrect = idx === currentQ.correctAnswer;

              let btnStyle = 'bg-white hover:bg-stone-50 text-stone-800 border-stone-200';
              if (hasAnswered) {
                if (isOptionCorrect) {
                  btnStyle = 'bg-emerald-50 text-emerald-900 border-emerald-500 shadow-sm';
                } else if (isSelected) {
                  btnStyle = 'bg-rose-50 text-rose-900 border-rose-500 shadow-sm';
                } else {
                  btnStyle = 'bg-stone-50 text-stone-400 border-stone-200 opacity-60';
                }
              } else if (isSelected) {
                btnStyle = 'bg-indigo-600 text-white border-indigo-600';
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectAnswer(idx)}
                  disabled={hasAnswered}
                  className={`w-full p-4 rounded-xl text-left text-xs sm:text-sm font-medium transition-all flex items-center justify-between border cursor-pointer ${btnStyle}`}
                >
                  <span>{option}</span>
                  <div className="flex items-center gap-2">
                    {hasAnswered && isOptionCorrect && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    )}
                    {hasAnswered && isSelected && !isOptionCorrect && (
                      <XCircle className="w-4 h-4 text-rose-600" />
                    )}
                    <span className="w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-bold">
                      {String.fromCharCode(65 + idx)}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Immediate Pedagogical Explanation & Concept Gap Detection */}
          {hasAnswered && (
            <div
              className={`p-5 rounded-2xl border space-y-3 animate-in fade-in duration-300 ${
                isCorrect ? 'bg-emerald-50/60 border-emerald-200' : 'bg-rose-50/60 border-rose-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {isCorrect ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-rose-600" />
                  )}
                  <h4 className="text-xs font-bold font-serif-ethiopic text-stone-900">
                    {isCorrect ? 'ትክክለኛ መልስ! (Correct Answer)' : 'ትክክል አይደለም (Incorrect)'}
                  </h4>
                </div>
                <button
                  onClick={() => onAskAICoach(currentQ, selectedAnswer)}
                  className="px-3 py-1 bg-white hover:bg-stone-50 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>AI አስጠኚን ጠይቅ (Ask AI Coach)</span>
                </button>
              </div>

              <p className="text-xs text-stone-700 leading-relaxed">
                <strong>ማብራሪያ፡</strong> {currentQ.explanation}
              </p>

              {!isCorrect && currentQ.conceptGaps && (
                <div className="pt-2 border-t border-rose-200/60 text-xs text-rose-800 space-y-1">
                  <span className="font-bold">የተገኘ የፅንሰ-ሀሳብ ክፍተት (Concept Gap):</span>
                  <p className="text-rose-700">{currentQ.conceptGaps.join(', ')}</p>
                  <p className="text-[11px] text-rose-600 italic">
                    ይህ ጥያቄ በቀጣይ እንድትከሱት ወደ "ስህተት ማስታወሻ ደብተር" (Mistake Book) ተጨምሯል።
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Navigation */}
          <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
            <button
              onClick={() => setIsSessionActive(false)}
              className="px-4 py-2 border border-stone-200 text-stone-600 rounded-xl text-xs font-semibold hover:bg-stone-50 cursor-pointer"
            >
              ልምምድ አቁም
            </button>

            {hasAnswered && (
              <button
                onClick={handleNextQuestion}
                className="px-6 py-2.5 bg-stone-900 hover:bg-black text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <span>
                  {currentIndex < sessionQuestions.length - 1 ? 'ቀጣይ ጥያቄ' : 'ልምምዱን አጠናቅቅ'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
