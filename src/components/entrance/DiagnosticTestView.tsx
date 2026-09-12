import React, { useState } from 'react';
import {
  EntranceQuestion,
  DiagnosticAttempt,
  EntranceStream,
  TopicPerformance,
} from '../../types/entranceExam';
import { Grade } from '../../types';
import {
  BrainCircuit,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Clock,
  Sparkles,
  HelpCircle,
  Award,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';

interface DiagnosticTestViewProps {
  questions: EntranceQuestion[];
  userId: string;
  grade: Grade;
  stream: EntranceStream;
  onComplete: (attempt: DiagnosticAttempt) => void;
  onCancel: () => void;
}

export const DiagnosticTestView: React.FC<DiagnosticTestViewProps> = ({
  questions,
  userId,
  grade,
  stream,
  onComplete,
  onCancel,
}) => {
  // Take up to 6 diverse questions across curriculum topics
  const diagnosticPool = questions.slice(0, 6);

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [completedAttempt, setCompletedAttempt] = useState<DiagnosticAttempt | null>(null);

  const currentQ = diagnosticPool[currentIndex];

  const handleSelectOption = (optIndex: number) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentIndex]: optIndex,
    }));
  };

  const handleSubmit = () => {
    let score = 0;
    const topicMap: Record<string, { topic: string; subject: string; score: number; total: number }> = {};
    const weakTopics: string[] = [];
    const strongTopics: string[] = [];
    const prerequisites: string[] = [];
    const recommendations: string[] = [];

    diagnosticPool.forEach((q, idx) => {
      const chosen = selectedAnswers[idx];
      const isCorrect = chosen === q.correctAnswer;
      if (isCorrect) score += 1;

      if (!topicMap[q.topic]) {
        topicMap[q.topic] = { topic: q.topic, subject: q.subject, score: 0, total: 0 };
      }
      topicMap[q.topic].total += 1;
      if (isCorrect) {
        topicMap[q.topic].score += 1;
      } else {
        if (!weakTopics.includes(q.topic)) weakTopics.push(q.topic);
        if (q.prerequisites && q.prerequisites.length > 0) {
          prerequisites.push(...q.prerequisites);
        }
      }
    });

    Object.values(topicMap).forEach((t) => {
      const pct = Math.round((t.score / t.total) * 100);
      if (pct >= 70 && !strongTopics.includes(t.topic)) {
        strongTopics.push(t.topic);
      }
    });

    if (weakTopics.length > 0) {
      recommendations.push(`Revise foundational concepts in: ${weakTopics.join(', ')}.`);
    }
    if (prerequisites.length > 0) {
      recommendations.push(`Review key prerequisites: ${Array.from(new Set(prerequisites)).join(', ')}.`);
    }
    recommendations.push('Complete daily timed sprints to build examination speed.');

    const topicPerf: Record<string, TopicPerformance> = {};
    Object.values(topicMap).forEach((t) => {
      const pct = Math.round((t.score / t.total) * 100);
      topicPerf[t.topic] = {
        topic: t.topic,
        subject: t.subject,
        score: t.score,
        total: t.total,
        percentage: pct,
        isWeak: pct < 60,
      };
    });

    const attempt: DiagnosticAttempt = {
      attemptId: `diag-${userId}-${Date.now()}`,
      userId,
      grade,
      stream,
      score,
      total: diagnosticPool.length,
      percentage: Math.round((score / diagnosticPool.length) * 100),
      topicPerformance: topicPerf,
      weakTopics,
      strongTopics,
      prerequisites: Array.from(new Set(prerequisites)),
      recommendations,
      completedAt: new Date().toISOString(),
    };

    setCompletedAttempt(attempt);
    setIsSubmitted(true);
    onComplete(attempt);
  };

  // Results View
  if (isSubmitted && completedAttempt) {
    return (
      <div className="max-w-3xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-md space-y-6">
        <div className="text-center space-y-3 pb-6 border-b border-stone-100">
          <div className="w-16 h-16 bg-indigo-50 text-indigo-700 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
            <Award className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold font-serif-ethiopic text-stone-900">
            የዳያግኖስቲክ ውጤት ማጠቃለያ (Diagnostic Results)
          </h2>
          <p className="text-xs text-stone-500 max-w-lg mx-auto">
            ውጤትዎ ተገምግሟል። በዚሁ መሰረት ለእርስዎ ተስማሚ የሆነ የጥናት እቅድና የመሻሻያ አቅጣጫ ተዘጋጅቷል።
          </p>

          <div className="inline-flex items-center gap-3 px-4 py-2 bg-stone-50 rounded-2xl border border-stone-200 text-sm">
            <span className="text-stone-500">የተገኘ ውጤት፡</span>
            <span className="font-bold text-stone-900">
              {completedAttempt.score} / {completedAttempt.total} ({completedAttempt.percentage}%)
            </span>
          </div>
        </div>

        {/* Weak Areas vs Strong Areas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-rose-50/70 border border-rose-200 rounded-2xl space-y-2">
            <h4 className="text-xs font-bold text-rose-800 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              ክለሳ የሚሹ ርዕሶች (Identified Weak Topics)
            </h4>
            {completedAttempt.weakTopics.length > 0 ? (
              <ul className="space-y-1 text-xs text-rose-900">
                {completedAttempt.weakTopics.map((t, i) => (
                  <li key={i} className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-rose-700">ሁሉንም ርዕሶች በአጥጋቢ ሁኔታ ሰርተዋል!</p>
            )}
          </div>

          <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-2">
            <h4 className="text-xs font-bold text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ጠንካራ ጎኖች (Mastered Concepts)
            </h4>
            {completedAttempt.strongTopics.length > 0 ? (
              <ul className="space-y-1 text-xs text-emerald-900">
                {completedAttempt.strongTopics.map((t, i) => (
                  <li key={i} className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-emerald-700">ተጨማሪ ልምምድ በማድረግ ጥንካሬዎን ያሳድጉ።</p>
            )}
          </div>
        </div>

        {/* Prerequisites Detected */}
        {completedAttempt.prerequisites.length > 0 && (
          <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-2">
            <h4 className="text-xs font-bold text-amber-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-700" />
              ቅድመ-ዕውቀት ማጠናከሪያዎች (Prerequisites to Review)
            </h4>
            <div className="flex flex-wrap gap-2 pt-1">
              {completedAttempt.prerequisites.map((p, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 bg-amber-100 text-amber-900 rounded-lg text-xs font-medium"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="pt-4 flex items-center justify-between">
          <button
            onClick={() => {
              setIsSubmitted(false);
              setSelectedAnswers({});
              setCurrentIndex(0);
            }}
            className="px-4 py-2 border border-stone-200 text-stone-700 hover:bg-stone-50 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            ደግመህ ፈትን (Retake)
          </button>

          <button
            onClick={onCancel}
            className="px-6 py-2.5 bg-indigo-700 hover:bg-indigo-800 text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-2 cursor-pointer"
          >
            <span>ወደ ጥናት እቅድ ቀጥል (Go to Study Plan)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  if (!currentQ) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-stone-200 text-xs text-stone-500">
        ጥያቄዎች አልተገኙም። እባክዎ እንደገና ይሞክሩ።
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-stone-100">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-indigo-700">
            <BrainCircuit className="w-4 h-4" />
            <span>የመነሻ ዳያግኖስቲክ ምዘና (Diagnostic Assessment)</span>
          </div>
          <h3 className="text-sm font-bold text-stone-900">
            ጥያቄ {currentIndex + 1} ከ {diagnosticPool.length}
          </h3>
        </div>

        <div className="flex items-center gap-2 text-xs text-stone-500">
          <span className="px-2.5 py-1 bg-stone-100 rounded-lg font-semibold uppercase text-[10px]">
            {currentQ.subject}
          </span>
          <span className="px-2.5 py-1 bg-indigo-50 text-indigo-800 rounded-lg font-semibold text-[10px]">
            {currentQ.difficulty}
          </span>
        </div>
      </div>

      {/* Question Text */}
      <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200/80 space-y-2">
        <p className="text-sm sm:text-base font-semibold text-stone-900 leading-relaxed">
          {currentQ.question}
        </p>
        <div className="text-[11px] text-stone-500 flex items-center gap-2 pt-1">
          <span>ምንጭ፡ {currentQ.source}</span>
          {currentQ.page && <span>(ገጽ {currentQ.page})</span>}
        </div>
      </div>

      {/* Options */}
      <div className="space-y-2.5">
        {currentQ.options?.map((option, idx) => {
          const isSelected = selectedAnswers[currentIndex] === idx;
          return (
            <button
              key={idx}
              onClick={() => handleSelectOption(idx)}
              className={`w-full p-4 rounded-xl text-left text-xs sm:text-sm font-medium transition-all flex items-center justify-between cursor-pointer ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-sm border-indigo-600'
                  : 'bg-white hover:bg-stone-50 text-stone-800 border border-stone-200'
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

      {/* Navigation & Submit */}
      <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
        <button
          onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
          disabled={currentIndex === 0}
          className="px-4 py-2 border border-stone-200 text-stone-600 rounded-xl text-xs font-semibold hover:bg-stone-50 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
        >
          ወደ ኋላ
        </button>

        <div className="flex items-center gap-1.5">
          {diagnosticPool.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`w-7 h-7 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                currentIndex === i
                  ? 'bg-stone-900 text-white'
                  : selectedAnswers[i] !== undefined
                  ? 'bg-indigo-100 text-indigo-900'
                  : 'bg-stone-100 text-stone-500'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>

        {currentIndex < diagnosticPool.length - 1 ? (
          <button
            onClick={() => setCurrentIndex((prev) => prev + 1)}
            className="px-5 py-2 bg-indigo-700 hover:bg-indigo-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <span>ቀጣይ</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={Object.keys(selectedAnswers).length === 0}
            className="px-6 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm disabled:opacity-40"
          >
            <span>ምዘናውን ጨርስ (Submit)</span>
            <CheckCircle2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
