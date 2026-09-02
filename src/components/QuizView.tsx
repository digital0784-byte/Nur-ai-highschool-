import React, { useState, useEffect } from 'react';
import { Topic, Subject } from '../types';
import {
  CheckCircle2,
  XCircle,
  RotateCcw,
  ArrowRight,
  ArrowLeft,
  Award,
  BookOpen
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useProgress } from '../context/ProgressContext';

interface QuizViewProps {
  topic: Topic;
  subject: Subject;
}

export const QuizView: React.FC<QuizViewProps> = ({ topic, subject }) => {
  const { t, isRtl } = useLanguage();
  const { recordQuizResult, getTopicProgress } = useProgress();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>([]);
  const [isFinished, setIsFinished] = useState(false);

  const topicProgress = getTopicProgress(topic.id);
  const questions = topic.quizQuestions;
  const currentQuestion = questions[currentQuestionIndex] || questions[0];

  // Reset when topic changes
  useEffect(() => {
    setCurrentQuestionIndex(0);
    setSelectedOptionIndex(null);
    setUserAnswers(new Array(topic.quizQuestions.length).fill(null));
    setIsFinished(false);
  }, [topic.id, topic.quizQuestions.length]);

  const handleSelectOption = (index: number) => {
    if (selectedOptionIndex !== null) return; // Already answered this question

    setSelectedOptionIndex(index);
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = index;
    setUserAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOptionIndex(null);
    } else {
      setIsFinished(true);

      // Record quiz completion in progress state
      const correctCount = userAnswers.reduce((count: number, answer, idx) => {
        return answer === questions[idx]?.correctIndex ? count + 1 : count;
      }, 0);
      recordQuizResult(topic.id, correctCount, questions.length);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedOptionIndex(null);
    setUserAnswers(new Array(questions.length).fill(null));
    setIsFinished(false);
  };

  // Calculate score
  const correctCount = userAnswers.reduce((count: number, answer, idx) => {
    return answer === questions[idx]?.correctIndex ? count + 1 : count;
  }, 0);

  const scorePercentage = Math.round((correctCount / questions.length) * 100);

  // If Quiz Finished: Show Score Summary Screen
  if (isFinished) {
    let feedbackTitle = t.tryAgainTitle;
    let feedbackMessage = t.tryAgainMsg;

    if (correctCount === questions.length) {
      feedbackTitle = t.perfectScoreTitle;
      feedbackMessage = t.perfectScoreMsg;
    } else if (correctCount >= 3) {
      feedbackTitle = t.goodScoreTitle;
      feedbackMessage = t.goodScoreMsg;
    }

    return (
      <div id="quiz-summary-container" className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto space-y-6">
        {/* Score Card Header */}
        <div
          id="quiz-score-card"
          className="border-[2px] border-[#38332D] bg-[#FAF6EC] p-6 sm:p-8 text-center space-y-4 shadow-sm"
          style={{ borderTop: `6px solid ${subject.accentColor}` }}
        >
          <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center border-2 border-[#38332D] bg-[#F4EEDB]">
            <Award className="w-9 h-9" style={{ color: subject.accentColor }} />
          </div>

          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#7A705E]">
              {t.quizResultTitle}
            </span>
            <h2 className="font-serif-ethiopic text-2xl sm:text-3xl font-bold text-[#1E1B18]">
              {feedbackTitle}
            </h2>
            <p className="text-sm text-[#5A5143] max-w-md mx-auto font-serif-ethiopic">
              {feedbackMessage}
            </p>
          </div>

          {/* Big Score Display */}
          <div className="inline-flex items-baseline justify-center gap-2 px-6 py-3 bg-[#EDE6D4] border-[1.5px] border-[#38332D]">
            <span className="text-3xl sm:text-4xl font-mono font-extrabold text-[#1E1B18]">
              {correctCount}
            </span>
            <span className="text-xl font-mono text-[#7A705E]">/</span>
            <span className="text-xl font-mono text-[#7A705E]">{questions.length}</span>
            <span className="text-xs font-bold text-[#5A5143] mx-2">({scorePercentage}%)</span>
          </div>

          {/* Retry Button */}
          <div className="pt-3 flex items-center justify-center gap-3">
            <button
              id="quiz-retry-btn"
              onClick={handleRestartQuiz}
              className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-bold border-[1.5px] border-[#38332D] bg-[#38332D] text-[#FAF6EC] hover:bg-[#24211E] transition-all cursor-pointer shadow-xs active:translate-y-0.5"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="font-serif-ethiopic">{t.retryBtn}</span>
            </button>
          </div>
        </div>

        {/* Detailed Question Review List */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#5A5143] pb-2 border-b-[1.5px] border-[#38332D]">
            <BookOpen className="w-4 h-4" />
            <span className="font-serif-ethiopic">{t.reviewTitle}</span>
          </div>

          <div className="space-y-4">
            {questions.map((q, qIndex) => {
              const userAns = userAnswers[qIndex];
              const isCorrect = userAns === q.correctIndex;

              return (
                <div
                  key={q.id}
                  className={`p-4 border-[1.5px] border-[#38332D] bg-[#FAF6EC] space-y-3 ${
                    isCorrect
                      ? !isRtl ? 'border-l-6 border-l-emerald-600' : 'border-r-6 border-r-emerald-600'
                      : !isRtl ? 'border-l-6 border-l-rose-600' : 'border-r-6 border-r-rose-600'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <h4 className="font-serif-ethiopic text-sm sm:text-base font-bold text-[#1E1B18] leading-snug">
                      {qIndex + 1}. {q.question}
                    </h4>
                    {isCorrect ? (
                      <span className="shrink-0 inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 border border-emerald-300">
                        <CheckCircle2 className="w-3.5 h-3.5" /> {t.correctBadge}
                      </span>
                    ) : (
                      <span className="shrink-0 inline-flex items-center gap-1 text-xs font-bold text-rose-800 bg-rose-100 px-2 py-0.5 border border-rose-300">
                        <XCircle className="w-3.5 h-3.5" /> {t.incorrectBadge}
                      </span>
                    )}
                  </div>

                  {/* Options status */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {q.options.map((opt, optIndex) => {
                      const isTargetCorrect = optIndex === q.correctIndex;
                      const isUserPick = optIndex === userAns;

                      let optClasses = 'border border-[#D6CBB4] bg-[#F4EEDB] text-[#5A5143]';
                      if (isTargetCorrect) {
                        optClasses = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-bold border-[1.5px]';
                      } else if (isUserPick && !isCorrect) {
                        optClasses = 'border-rose-500 bg-rose-50 text-rose-950 font-bold border-[1.5px] line-through';
                      }

                      return (
                        <div key={optIndex} className={`p-2 rounded-xs flex items-center justify-between ${optClasses}`}>
                          <span className="font-serif-ethiopic">{opt}</span>
                          {isTargetCorrect && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 ml-1 rtl:mr-1 rtl:ml-0" />}
                          {isUserPick && !isCorrect && <XCircle className="w-3.5 h-3.5 text-rose-600 shrink-0 ml-1 rtl:mr-1 rtl:ml-0" />}
                        </div>
                      );
                    })}
                  </div>

                  {/* Explanation box */}
                  <div className="p-3 bg-[#F2ECE0] border border-[#D5CAA8] text-xs text-[#38332D] space-y-1">
                    <span className="font-bold text-[#5A5143]">{t.explanationPrefix} </span>
                    <span className="font-serif-ethiopic">{q.explanation}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Active Quiz Question View
  const isAnswered = selectedOptionIndex !== null;
  const isUserCorrect = isAnswered && selectedOptionIndex === currentQuestion.correctIndex;

  return (
    <div id="active-quiz-container" className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto space-y-6">
      {/* Quiz Progress Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-[1.5px] border-[#38332D] pb-3">
        <div className="space-y-0.5">
          <span className="text-xs font-bold uppercase tracking-wider text-[#5A5143]">
            {t.quizSubtitle}
          </span>
          <h3 className="font-serif-ethiopic text-base sm:text-lg font-bold text-[#1E1B18]">
            {topic.title}
          </h3>
        </div>

        {/* Question Counter & Status */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {topicProgress.quizCompleted && (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 border border-emerald-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
              <span>
                {t.quizPassedBadge} ({topicProgress.quizScore}/{topicProgress.quizTotal || 4})
              </span>
            </span>
          )}

          <div
            id="quiz-progress-badge"
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#EDE6D4] border-[1.5px] border-[#38332D] text-xs font-mono font-bold text-[#1E1B18]"
          >
            <span>{t.questionLabel}</span>
            <span className="text-sm font-bold" style={{ color: subject.accentColor }}>
              {currentQuestionIndex + 1}
            </span>
            <span>{t.fromLabel}</span>
            <span>{questions.length}</span>
          </div>
        </div>
      </div>

      {/* Question Box */}
      <div
        id="question-card"
        className="border-[2px] border-[#38332D] bg-[#FAF6EC] p-5 sm:p-7 space-y-5 shadow-xs"
        style={{ borderTop: `6px solid ${subject.accentColor}` }}
      >
        <div className="flex items-start gap-3">
          <span
            className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 border border-[#38332D] text-white"
            style={{ backgroundColor: subject.accentColor }}
          >
            {currentQuestionIndex + 1}
          </span>
          <h2
            id="current-question-text"
            className="font-serif-ethiopic text-base sm:text-xl font-bold text-[#1E1B18] leading-relaxed pt-0.5"
          >
            {currentQuestion.question}
          </h2>
        </div>

        {/* Options List */}
        <div id="quiz-options-list" className="space-y-2.5 pt-2" role="radiogroup">
          {currentQuestion.options.map((option, optIndex) => {
            const isOptionSelected = selectedOptionIndex === optIndex;
            const isCorrectTarget = optIndex === currentQuestion.correctIndex;

            let optionStyle = 'bg-[#FAF6EC] border-[#38332D] text-[#24211E] hover:bg-[#EFE8D6]';

            if (isAnswered) {
              if (isCorrectTarget) {
                // Correct option -> always highlighted green
                optionStyle = 'bg-emerald-50 border-emerald-600 text-emerald-950 font-bold ring-1 ring-emerald-500';
              } else if (isOptionSelected && !isUserCorrect) {
                // User picked wrong option -> highlight red
                optionStyle = 'bg-rose-50 border-rose-600 text-rose-950 font-bold ring-1 ring-rose-500';
              } else {
                // Other options -> dim
                optionStyle = 'bg-[#F2ECE0] border-[#D6CBB4] text-[#7A705E] opacity-60';
              }
            }

            const optionLabel = t.optionLabels[optIndex] || ['A', 'B', 'C', 'D'][optIndex];

            return (
              <button
                key={optIndex}
                id={`quiz-opt-${optIndex}`}
                onClick={() => handleSelectOption(optIndex)}
                disabled={isAnswered}
                className={`w-full text-left rtl:text-right p-3.5 sm:p-4 border-[1.5px] transition-all flex items-center justify-between gap-3 cursor-pointer ${optionStyle} ${
                  isAnswered ? 'cursor-default' : 'active:translate-y-0.5'
                }`}
                aria-checked={isOptionSelected}
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-xs border border-current flex items-center justify-center text-xs font-bold shrink-0 font-serif-ethiopic">
                    {optionLabel}
                  </span>
                  <span className="text-sm sm:text-base font-serif-ethiopic">
                    {option}
                  </span>
                </div>

                {/* Status Indicator Icon */}
                {isAnswered && isCorrectTarget && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                )}
                {isAnswered && isOptionSelected && !isUserCorrect && (
                  <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Immediate Explanation Box (shown after answering) */}
        {isAnswered && (
          <div
            id="quiz-explanation-box"
            className={`p-4 border-[1.5px] space-y-2 animate-in fade-in duration-300 ${
              isUserCorrect
                ? 'bg-emerald-50/70 border-emerald-500 text-emerald-950'
                : 'bg-rose-50/70 border-rose-500 text-rose-950'
            }`}
          >
            <div className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider">
              {isUserCorrect ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span className="text-emerald-800">{t.correctAnswerMsg}</span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 text-rose-700" />
                  <span className="text-rose-800">{t.incorrectAnswerMsg}</span>
                </>
              )}
            </div>

            <div className="text-xs sm:text-sm leading-relaxed text-[#24211E]">
              <span className="font-bold text-[#38332D]">{t.explanationPrefix} </span>
              <span className="font-serif-ethiopic">{currentQuestion.explanation}</span>
            </div>
          </div>
        )}
      </div>

      {/* Next Question Advance Button */}
      {isAnswered && (
        <div className="flex justify-end rtl:justify-start pt-2">
          <button
            id="quiz-next-btn"
            onClick={handleNextQuestion}
            className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold border-[1.5px] border-[#38332D] text-[#FAF6EC] transition-all cursor-pointer shadow-xs active:translate-y-0.5"
            style={{ backgroundColor: subject.accentColor }}
          >
            <span className="font-serif-ethiopic">
              {currentQuestionIndex < questions.length - 1 ? t.nextQuestionBtn : t.viewResultBtn}
            </span>
            {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </button>
        </div>
      )}
    </div>
  );
};
