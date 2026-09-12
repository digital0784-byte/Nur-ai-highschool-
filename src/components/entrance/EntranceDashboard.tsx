import React, { useState } from 'react';
import {
  EntranceProgress,
  StudyPlan,
  EntranceStream,
  ReadinessLevel,
} from '../../types/entranceExam';
import { Grade } from '../../types';
import {
  Award,
  Flame,
  Clock,
  Target,
  AlertTriangle,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Sparkles,
  RefreshCw,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';

interface EntranceDashboardProps {
  progress: EntranceProgress;
  studyPlan: StudyPlan | null;
  selectedGrade: Grade;
  selectedStream: EntranceStream;
  onSelectSubTab: (tab: string) => void;
  onRefresh: () => void;
  onUpdateStudyMinutes: (mins: number) => void;
}

export const EntranceDashboard: React.FC<EntranceDashboardProps> = ({
  progress,
  studyPlan,
  selectedGrade,
  selectedStream,
  onSelectSubTab,
  onRefresh,
  onUpdateStudyMinutes,
}) => {
  const [editingMinutes, setEditingMinutes] = useState<number>(
    studyPlan?.availableStudyTimeMinutes || 90
  );

  const getReadinessBadge = (level: ReadinessLevel) => {
    switch (level) {
      case 'Strong Preparation':
        return {
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-300',
          dot: 'bg-emerald-500',
          desc: 'Excellent consistency & high accuracy across curriculum topics.',
        };
      case 'Good Progress':
        return {
          bg: 'bg-blue-50 text-blue-800 border-blue-300',
          dot: 'bg-blue-500',
          desc: 'Solid foundation; target weak topics to reach advanced readiness.',
        };
      case 'Developing':
        return {
          bg: 'bg-amber-50 text-amber-800 border-amber-300',
          dot: 'bg-amber-500',
          desc: 'Progressing well; complete regular timed practice and review mistakes.',
        };
      case 'Needs Improvement':
      default:
        return {
          bg: 'bg-rose-50 text-rose-800 border-rose-300',
          dot: 'bg-rose-500',
          desc: 'Begin with the diagnostic test to pinpoint and fix prerequisite gaps.',
        };
    }
  };

  const badgeInfo = getReadinessBadge(progress.readinessStatus);

  return (
    <div className="space-y-6">
      {/* Top Banner: Estimated Readiness & Goal */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-md border border-stone-800 relative overflow-hidden">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 relative z-10">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold text-indigo-200 border border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>የኢትዮጵያ ዩኒቨርሲቲ መግቢያ ፈተና ዝግጅት ሞተር (Grade {selectedGrade})</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif-ethiopic tracking-tight">
              የፈተና ዝግጁነት ዳሽቦርድ (Preparation Dashboard)
            </h1>
            <p className="text-stone-300 text-sm leading-relaxed">
              በአዲሱ የትምህርት ሚኒስቴር ስርዓተ-ትምህርት የተደገፈ ጥልቅ ልምምድ፣ ስልታዊ የጊዜ አጠቃቀምና ብጁ የጥናት እቅድ።
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-1">
              <div className="flex items-center gap-2 text-xs text-stone-300">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>የትምህርት መስክ፡ <strong>{selectedStream === 'natural' ? 'Natural Science' : selectedStream === 'social' ? 'Social Science' : 'Common Composite'}</strong></span>
              </div>
              <div className="flex items-center gap-2 text-xs text-stone-300">
                <Flame className="w-4 h-4 text-orange-400" />
                <span>የጥናት ጽናት፡ <strong>{progress.studyStreak} ቀናት (Days)</strong></span>
              </div>
            </div>
          </div>

          {/* Readiness Box */}
          <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-5 min-w-[280px] space-y-3">
            <div className="flex items-center justify-between text-xs text-stone-300">
              <span className="font-semibold uppercase tracking-wider">የዝግጁነት ደረጃ (Readiness)</span>
              <span className="text-stone-400">Tutorial Signal</span>
            </div>
            <div className="flex items-center gap-3">
              <span className={`w-3 h-3 rounded-full ${badgeInfo.dot}`} />
              <span className="text-xl font-bold font-serif-ethiopic text-white">{progress.readinessStatus}</span>
            </div>
            <p className="text-xs text-stone-300 leading-relaxed">
              {badgeInfo.desc}
            </p>
            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
              <span className="text-stone-400">ትክክለኛነት (Accuracy):</span>
              <span className="font-bold text-amber-300">{progress.accuracy}%</span>
            </div>
          </div>
        </div>

        {/* Transparent Disclaimer */}
        <div className="mt-6 pt-4 border-t border-white/10 flex items-start gap-2.5 text-xs text-stone-300">
          <ShieldCheck className="w-4 h-4 text-indigo-300 shrink-0 mt-0.5" />
          <p>
            <strong>ግልፅ ማስታወሻ (Transparency Note):</strong> ይህ የዝግጁነት አመላካች በመተግበሪያው ውስጥ በተጠናቀቁ የልምምድ ጥያቄዎችና ሞዴል ፈተናዎች ላይ ብቻ የተመሰረተ ነው። የመንግስት ይፋዊ የፈተና ውጤት ወይም ወደ ዩኒቨርሲቲ የመግባት ዋስትና አይሰጥም።
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-stone-500 text-xs font-semibold">
            <span>የተፈቱ ጥያቄዎች</span>
            <Target className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold text-stone-900">{progress.questionsSolved}</div>
          <p className="text-xs text-stone-500">ከተለያዩ የትምህርት ዓይነቶች የተፈቱ</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-stone-500 text-xs font-semibold">
            <span>አማካኝ ትክክለኛነት</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-700">{progress.accuracy}%</div>
          <div className="w-full bg-stone-100 rounded-full h-2">
            <div
              className="bg-emerald-600 h-2 rounded-full transition-all"
              style={{ width: `${Math.min(100, progress.accuracy)}%` }}
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-stone-500 text-xs font-semibold">
            <span>የተወሰዱ ሞዴል ፈተናዎች</span>
            <Award className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-amber-800">{progress.mockExamsTaken}</div>
          <p className="text-xs text-stone-500">የተሟሉ የጊዜ ማስመሰያ ፈተናዎች</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-stone-500 text-xs font-semibold">
            <span>ያልተካኑ ርዕሶች (Weak Topics)</span>
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-bold text-rose-700">{progress.weakTopics.length}</div>
          <p className="text-xs text-stone-500">ትኩረት የሚሹ ርዕሶች</p>
        </div>
      </div>

      {/* Main Grid: Study Plan & Weak Topic Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Personalized Daily Study Plan */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-stone-100">
            <div>
              <h3 className="text-lg font-bold text-stone-900 font-serif-ethiopic flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-600" />
                የዛሬው የጥናት እቅድ (Today's Personalized Plan)
              </h3>
              <p className="text-xs text-stone-500">
                {studyPlan?.examGoal || 'የአጠቃላይ የዩኒቨርሲቲ መግቢያ ፈተና ዝግጁነት'}
              </p>
            </div>
            <button
              onClick={() => onSelectSubTab('study_plan')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-700 hover:text-indigo-900 cursor-pointer"
            >
              <span>ሙሉ እቅድ ተመልከት</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {studyPlan ? (
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl border border-indigo-100 bg-indigo-50/50 flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-indigo-200 text-indigo-900 rounded text-[10px] font-bold">1. Concept Review</span>
                    <span className="text-xs font-bold text-stone-800">{studyPlan.dailyStructure.conceptReview.topic}</span>
                  </div>
                  <p className="text-xs text-stone-600">{studyPlan.dailyStructure.conceptReview.textbookRef || 'ከዋናው የመማሪያ መጽሐፍ ፅንሰ-ሀሳብ መከለስ'}</p>
                </div>
                <span className="text-xs font-semibold text-stone-500 shrink-0">{studyPlan.dailyStructure.conceptReview.durationMins} ደቂቃ</span>
              </div>

              <div className="p-3.5 rounded-xl border border-emerald-100 bg-emerald-50/50 flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-emerald-200 text-emerald-900 rounded text-[10px] font-bold">2. Practice</span>
                    <span className="text-xs font-bold text-stone-800">{studyPlan.dailyStructure.practice.topic}</span>
                  </div>
                  <p className="text-xs text-stone-600">{studyPlan.dailyStructure.practice.questionsCount} ጥያቄዎችን በደረጃ መስራት</p>
                </div>
                <span className="text-xs font-semibold text-stone-500 shrink-0">{studyPlan.dailyStructure.practice.durationMins} ደቂቃ</span>
              </div>

              <div className="p-3.5 rounded-xl border border-rose-100 bg-rose-50/50 flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-rose-200 text-rose-900 rounded text-[10px] font-bold">3. Weak Topic Revision</span>
                    <span className="text-xs font-bold text-stone-800">{studyPlan.dailyStructure.weakTopicRevision.topic}</span>
                  </div>
                  <p className="text-xs text-stone-600">{studyPlan.dailyStructure.weakTopicRevision.reason}</p>
                </div>
                <span className="text-xs font-semibold text-stone-500 shrink-0">{studyPlan.dailyStructure.weakTopicRevision.durationMins} ደቂቃ</span>
              </div>

              <div className="p-3.5 rounded-xl border border-amber-100 bg-amber-50/50 flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-amber-200 text-amber-900 rounded text-[10px] font-bold">4. Timed Sprint</span>
                    <span className="text-xs font-bold text-stone-800">{studyPlan.dailyStructure.timedQuestions.count} ፈጣን የጊዜ ጥያቄዎች</span>
                  </div>
                  <p className="text-xs text-stone-600">የፈተና ወቅት ፍጥነትንና ትኩረትን ማጎልበት</p>
                </div>
                <span className="text-xs font-semibold text-stone-500 shrink-0">{studyPlan.dailyStructure.timedQuestions.durationMins} ደቂቃ</span>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center space-y-4 border border-dashed border-stone-200 rounded-2xl">
              <BookOpen className="w-10 h-10 text-indigo-400 mx-auto" />
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-stone-800 font-serif-ethiopic">የመነሻ ዳያግኖስቲክ ምዘና ይውሰዱ</h4>
                <p className="text-xs text-stone-500 max-w-md mx-auto">
                  የመነሻ ዳያግኖስቲክ ፈተናውን በመውሰድ የእውቀት ክፍተቶችዎን ይለዩ። ስርዓቱ ወዲያውኑ ብጁ የጥናት እቅድ ያዘጋጅልዎታል።
                </p>
              </div>
              <button
                onClick={() => onSelectSubTab('diagnostic')}
                className="px-5 py-2.5 bg-indigo-700 hover:bg-indigo-800 text-white rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer"
              >
                ዳያግኖስቲክ ጀምር (Start Diagnostic)
              </button>
            </div>
          )}

          {/* Quick study time adjuster */}
          <div className="pt-3 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
            <span className="text-stone-600">ለዛሬ ያሎት የጥናት ጊዜ፡</span>
            <div className="flex items-center gap-2">
              {[30, 60, 90, 120, 180].map((mins) => (
                <button
                  key={mins}
                  onClick={() => {
                    setEditingMinutes(mins);
                    onUpdateStudyMinutes(mins);
                  }}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                    (studyPlan?.availableStudyTimeMinutes || 90) === mins
                      ? 'bg-stone-900 text-white'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  {mins} min
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Weak Topics & Quick Action Hub */}
        <div className="space-y-6">
          {/* Weak Topics Widget */}
          <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <h4 className="text-sm font-bold text-stone-900 font-serif-ethiopic flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                ትኩረት የሚሹ ርዕሶች
              </h4>
              <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                {progress.weakTopics.length} ርዕሶች
              </span>
            </div>

            {progress.weakTopics.length > 0 ? (
              <div className="space-y-2">
                {progress.weakTopics.slice(0, 4).map((topic, i) => (
                  <div
                    key={i}
                    className="p-3 bg-stone-50 hover:bg-stone-100 rounded-xl border border-stone-200 transition-colors flex items-center justify-between gap-2 text-xs"
                  >
                    <span className="font-semibold text-stone-800 truncate">{topic}</span>
                    <button
                      onClick={() => onSelectSubTab('practice')}
                      className="text-[11px] text-indigo-700 hover:text-indigo-900 font-bold shrink-0 cursor-pointer"
                    >
                      ልምምድ
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-6 text-center text-xs text-stone-500 space-y-1">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                <p>ምንም የተለዩ ደካማ ርዕሶች የሉም!</p>
                <p className="text-[11px] text-stone-400">ፈተናዎችን በመውሰድ እውቀትዎን ይፈትሹ።</p>
              </div>
            )}

            <button
              onClick={() => onSelectSubTab('mistake_book')}
              className="w-full py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-800 font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>የስህተት ማስታወሻ ደብተር (Mistake Book)</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Practice Fast-Launch Cards */}
          <div className="bg-stone-900 text-white rounded-2xl p-5 shadow-sm space-y-3">
            <h4 className="text-sm font-bold font-serif-ethiopic flex items-center gap-2 text-amber-400">
              <Sparkles className="w-4 h-4" />
              ፈጣን ማስጀመሪያ (Quick Launch)
            </h4>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onSelectSubTab('practice')}
                className="p-3 bg-white/10 hover:bg-white/15 rounded-xl text-left transition-all cursor-pointer"
              >
                <div className="text-xs font-bold">5-Q Sprint</div>
                <div className="text-[10px] text-stone-400">ፈጣን ልምምድ</div>
              </button>
              <button
                onClick={() => onSelectSubTab('mock_exams')}
                className="p-3 bg-white/10 hover:bg-white/15 rounded-xl text-left transition-all cursor-pointer"
              >
                <div className="text-xs font-bold">Mock Exam</div>
                <div className="text-[10px] text-stone-400">ሙሉ ማስመሰያ</div>
              </button>
              <button
                onClick={() => onSelectSubTab('ai_coach')}
                className="p-3 bg-white/10 hover:bg-white/15 rounded-xl text-left transition-all cursor-pointer"
              >
                <div className="text-xs font-bold">AI Coach</div>
                <div className="text-[10px] text-stone-400">የግል አስጠኚ</div>
              </button>
              <button
                onClick={() => onSelectSubTab('past_papers')}
                className="p-3 bg-white/10 hover:bg-white/15 rounded-xl text-left transition-all cursor-pointer"
              >
                <div className="text-xs font-bold">Past Papers</div>
                <div className="text-[10px] text-stone-400">ያለፉ ፈተናዎች</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
