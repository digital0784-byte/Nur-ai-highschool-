import React, { useState } from 'react';
import { MistakeRecord, EntranceQuestion } from '../../types/entranceExam';
import {
  BookOpen,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  RotateCcw,
  Filter,
  Check,
  AlertTriangle,
  Bookmark,
} from 'lucide-react';

interface MistakeBookViewProps {
  mistakes: MistakeRecord[];
  onMarkUnderstood: (questionId: string) => void;
  onAskAICoach: (question: EntranceQuestion, userAnswer: any) => void;
  onRetryQuestion: (question: EntranceQuestion) => void;
}

export const MistakeBookView: React.FC<MistakeBookViewProps> = ({
  mistakes,
  onMarkUnderstood,
  onAskAICoach,
  onRetryQuestion,
}) => {
  const [filterSubject, setFilterSubject] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'unresolved' | 'understood'>('unresolved');

  const filteredMistakes = mistakes.filter((m) => {
    if (filterSubject !== 'all' && m.question.subject !== filterSubject) return false;
    if (filterStatus === 'unresolved' && m.understood) return false;
    if (filterStatus === 'understood' && !m.understood) return false;
    return true;
  });

  const unresolvedCount = mistakes.filter((m) => !m.understood).length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-stone-100">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-serif-ethiopic text-stone-900 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-rose-600" />
              የስህተት ማስታወሻ ደብተር (Mistake Book)
            </h2>
            <p className="text-xs text-stone-500">
              በልምምድና በፈተና ወቅት የተሳሳቷቸውን ጥያቄዎች ደግመው ይለማመዱ፤ የፅንሰ-ሀሳብ ክፍተቶችዎን በAI አስጠኚ ያጥሩ።
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs font-bold text-rose-800">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <span>ያልተፈቱ ስህተቶች፡ {unresolvedCount}</span>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Status filter tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-xl">
            <button
              onClick={() => setFilterStatus('unresolved')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                filterStatus === 'unresolved'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              ያልተፈቱ ({unresolvedCount})
            </button>
            <button
              onClick={() => setFilterStatus('understood')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                filterStatus === 'understood'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              የተካኑ (Understood)
            </button>
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                filterStatus === 'all'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              ሁሉም ({mistakes.length})
            </button>
          </div>

          {/* Subject dropdown */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-stone-400" />
            <select
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
              className="px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-800 font-semibold focus:outline-none"
            >
              <option value="all">ሁሉም የትምህርት አይነቶች</option>
              <option value="math">Mathematics (ሒሳብ)</option>
              <option value="physics">Physics (ፊዚክስ)</option>
              <option value="chemistry">Chemistry (ኬሚስትሪ)</option>
              <option value="biology">Biology (ባዮሎጂ)</option>
              <option value="english">English (እንግሊዝኛ)</option>
              <option value="aptitude">Aptitude (ብቃት)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Mistakes List */}
      {filteredMistakes.length > 0 ? (
        <div className="space-y-4">
          {filteredMistakes.map((record) => {
            const q = record.question;
            return (
              <div
                key={record.id}
                className={`bg-white rounded-3xl p-6 border shadow-sm space-y-4 transition-all ${
                  record.understood
                    ? 'border-emerald-200 bg-emerald-50/20'
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-stone-100 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 bg-stone-100 rounded-lg font-bold text-stone-800 uppercase">
                      {q.subject}
                    </span>
                    <span className="text-stone-500 font-medium">
                      {q.unit} • {q.topic}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {record.understood ? (
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-100 px-2.5 py-0.5 rounded-full text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        ተረድቻለሁ (Understood)
                      </span>
                    ) : (
                      <span className="text-[11px] text-stone-400">
                        የሙከራ ድግግሞሽ፡ {record.retryCount}
                      </span>
                    )}
                  </div>
                </div>

                {/* Question */}
                <div className="space-y-2">
                  <p className="text-sm sm:text-base font-semibold text-stone-900">
                    {q.question}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                    <div className="p-3 rounded-xl bg-rose-50/70 border border-rose-200 text-rose-900">
                      <span className="font-bold block text-[11px] uppercase text-rose-700">የእርስዎ ምርጫ (Your Answer):</span>
                      <span>
                        {record.userAnswer !== null && record.userAnswer !== undefined
                          ? q.options?.[record.userAnswer] || `Option ${record.userAnswer}`
                          : 'ያልተመለሰ'}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 text-emerald-900">
                      <span className="font-bold block text-[11px] uppercase text-emerald-700">ትክክለኛ መልስ (Correct Answer):</span>
                      <span>{q.options?.[q.correctAnswer]}</span>
                    </div>
                  </div>
                </div>

                {/* Explanation & Concept Gap */}
                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80 text-xs space-y-1.5">
                  <div className="font-bold text-stone-800 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    <span>የስርዓተ-ትምህርት ማብራሪያ፡</span>
                  </div>
                  <p className="text-stone-600 leading-relaxed">{q.explanation}</p>

                  {record.conceptGap && (
                    <div className="pt-2 border-t border-stone-200 text-stone-600">
                      <strong className="text-rose-700">የተገኘ የስህተት ክፍተት፡ </strong>
                      <span>{record.conceptGap}</span>
                    </div>
                  )}

                  <div className="text-[11px] text-stone-400 pt-1">
                    ምንጭ፡ {q.source} {q.page && `(ገጽ ${q.page})`}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onAskAICoach(q, record.userAnswer)}
                      className="px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      <span>AI አስጠኚን ጠይቅ (Ask AI Coach)</span>
                    </button>

                    <button
                      onClick={() => onRetryQuestion(q)}
                      className="px-3.5 py-2 border border-stone-200 hover:bg-stone-50 text-stone-700 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-stone-500" />
                      <span>ደግመህ ፈትን (Retry)</span>
                    </button>
                  </div>

                  {!record.understood && (
                    <button
                      onClick={() => onMarkUnderstood(record.questionId)}
                      className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <Check className="w-4 h-4" />
                      <span>ተረድቻለሁ ብለህ ምልክት አድርግ</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 shadow-sm space-y-3">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
          <h4 className="text-base font-bold font-serif-ethiopic text-stone-900">
            በዚህ ምርጫ ውስጥ የተመዘገበ ስህተት የለም!
          </h4>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            ልምምዶችንና ፈተናዎችን በመውሰድ እውቀትዎን ይፈትሹ። የተሳሳቷቸው ጥያቄዎች እዚህ በዝርዝር ይቀመጣሉ።
          </p>
        </div>
      )}
    </div>
  );
};
