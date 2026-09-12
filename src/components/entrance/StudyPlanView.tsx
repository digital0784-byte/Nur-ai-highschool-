import React, { useState } from 'react';
import { StudyPlan } from '../../types/entranceExam';
import {
  Calendar,
  Clock,
  CheckCircle2,
  BookOpen,
  Sparkles,
  Target,
  ArrowRight,
  Flame,
  CheckSquare,
  Square,
  RotateCcw,
} from 'lucide-react';

interface StudyPlanViewProps {
  studyPlan: StudyPlan | null;
  onUpdatePlan: (updated: StudyPlan) => void;
  onStartDiagnostic: () => void;
  onSelectSubTab: (tab: string) => void;
}

export const StudyPlanView: React.FC<StudyPlanViewProps> = ({
  studyPlan,
  onUpdatePlan,
  onStartDiagnostic,
  onSelectSubTab,
}) => {
  const [selectedMinutes, setSelectedMinutes] = useState<number>(
    studyPlan?.availableStudyTimeMinutes || 90
  );

  if (!studyPlan) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 border border-stone-200 text-center space-y-4 shadow-sm">
        <div className="w-16 h-16 bg-indigo-50 text-indigo-700 rounded-2xl flex items-center justify-center mx-auto">
          <Calendar className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold font-serif-ethiopic text-stone-900">
          እስካሁን የተፈጠረ ብጁ የጥናት እቅድ የለም
        </h3>
        <p className="text-xs text-stone-500 max-w-md mx-auto leading-relaxed">
          የመነሻ ዳያግኖስቲክ ፈተናውን በመውሰድ የእውቀት ደረጃዎንና የክፍተት ርዕሶችዎን ይለዩ። ስርዓቱ ወዲያውኑ ለእርስዎ የሚመጥን የጥናት እቅድ ያዘጋጃል።
        </p>
        <button
          onClick={onStartDiagnostic}
          className="px-6 py-2.5 bg-indigo-700 hover:bg-indigo-800 text-white rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer"
        >
          ዳያግኖስቲክ ምዘና ጀምር (Start Diagnostic)
        </button>
      </div>
    );
  }

  const handleToggleDailyTask = (
    key: keyof StudyPlan['dailyStructure']
  ) => {
    const updated: StudyPlan = {
      ...studyPlan,
      dailyStructure: {
        ...studyPlan.dailyStructure,
        [key]: {
          ...studyPlan.dailyStructure[key],
          completed: !studyPlan.dailyStructure[key].completed,
        },
      },
      updatedAt: new Date().toISOString(),
    };
    onUpdatePlan(updated);
  };

  const handleToggleMilestone = (milestoneId: string) => {
    const updated: StudyPlan = {
      ...studyPlan,
      weeklyMilestones: studyPlan.weeklyMilestones.map((m) =>
        m.id === milestoneId ? { ...m, completed: !m.completed } : m
      ),
      updatedAt: new Date().toISOString(),
    };
    onUpdatePlan(updated);
  };

  const handleTimeChange = (mins: number) => {
    setSelectedMinutes(mins);
    const updated: StudyPlan = {
      ...studyPlan,
      availableStudyTimeMinutes: mins,
      dailyStructure: {
        conceptReview: {
          ...studyPlan.dailyStructure.conceptReview,
          durationMins: Math.round(mins * 0.3),
        },
        practice: {
          ...studyPlan.dailyStructure.practice,
          durationMins: Math.round(mins * 0.3),
          questionsCount: Math.max(5, Math.round(mins / 10)),
        },
        weakTopicRevision: {
          ...studyPlan.dailyStructure.weakTopicRevision,
          durationMins: Math.round(mins * 0.2),
        },
        timedQuestions: {
          ...studyPlan.dailyStructure.timedQuestions,
          durationMins: Math.round(mins * 0.1),
        },
        reviewMistakes: {
          ...studyPlan.dailyStructure.reviewMistakes,
          durationMins: Math.round(mins * 0.1),
        },
      },
      updatedAt: new Date().toISOString(),
    };
    onUpdatePlan(updated);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-stone-100">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-indigo-700">
              <Calendar className="w-4 h-4" />
              <span>የተማሪው ብጁ የጥናት እቅድ (Personalized Entrance Study Plan)</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-serif-ethiopic text-stone-900">
              {studyPlan.examGoal}
            </h2>
            <p className="text-xs text-stone-500">
              Grade {studyPlan.grade} • {studyPlan.stream === 'natural' ? 'Natural Science Stream' : 'Social Science Stream'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onStartDiagnostic}
              className="px-4 py-2 border border-stone-200 hover:bg-stone-50 text-stone-700 text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-stone-500" />
              <span>ዳያግኖስቲክ ድገም</span>
            </button>
          </div>
        </div>

        {/* Time Selector Slider */}
        <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-stone-800 flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-600" />
              ለጥናት ያለው ዕለታዊ ጊዜ (Daily Available Study Time)
            </span>
            <span className="font-extrabold text-indigo-700 text-sm">
              {studyPlan.availableStudyTimeMinutes} ደቂቃዎች ({Math.round(studyPlan.availableStudyTimeMinutes / 60 * 10) / 10} hrs)
            </span>
          </div>

          <div className="flex items-center gap-2">
            {[30, 60, 90, 120, 180].map((mins) => (
              <button
                key={mins}
                onClick={() => handleTimeChange(mins)}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  studyPlan.availableStudyTimeMinutes === mins
                    ? 'bg-stone-900 text-white shadow-sm'
                    : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-100'
                }`}
              >
                {mins} ደቂቃ
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Daily Routine Structure */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-5">
          <h3 className="text-base font-bold font-serif-ethiopic text-stone-900 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-indigo-600" />
            የዕለት ተዕለት የጥናት ተግባራት (Today's Daily Tasks)
          </h3>

          <div className="space-y-3">
            {/* 1. Concept Review */}
            <div
              onClick={() => handleToggleDailyTask('conceptReview')}
              className={`p-4 rounded-2xl border transition-all flex items-start gap-3 cursor-pointer ${
                studyPlan.dailyStructure.conceptReview.completed
                  ? 'bg-emerald-50/70 border-emerald-300'
                  : 'bg-white hover:bg-stone-50 border-stone-200'
              }`}
            >
              {studyPlan.dailyStructure.conceptReview.completed ? (
                <CheckSquare className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <Square className="w-5 h-5 text-stone-400 shrink-0 mt-0.5" />
              )}
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-900">
                    1. Concept Review ({studyPlan.dailyStructure.conceptReview.durationMins} min)
                  </span>
                  <span className="text-[11px] text-stone-500 font-semibold">መጽሐፍ ክለሳ</span>
                </div>
                <h4 className="text-sm font-bold text-stone-800">
                  {studyPlan.dailyStructure.conceptReview.topic}
                </h4>
                <p className="text-xs text-stone-600">
                  {studyPlan.dailyStructure.conceptReview.textbookRef || 'በስርዓተ-ትምህርት መጽሐፍ የተመለከቱ ዋና ዋና ህጎችንና ቀመሮችን መከለስ'}
                </p>
              </div>
            </div>

            {/* 2. Practice */}
            <div
              onClick={() => handleToggleDailyTask('practice')}
              className={`p-4 rounded-2xl border transition-all flex items-start gap-3 cursor-pointer ${
                studyPlan.dailyStructure.practice.completed
                  ? 'bg-emerald-50/70 border-emerald-300'
                  : 'bg-white hover:bg-stone-50 border-stone-200'
              }`}
            >
              {studyPlan.dailyStructure.practice.completed ? (
                <CheckSquare className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <Square className="w-5 h-5 text-stone-400 shrink-0 mt-0.5" />
              )}
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-900">
                    2. Practice Questions ({studyPlan.dailyStructure.practice.durationMins} min)
                  </span>
                  <span className="text-[11px] text-stone-500 font-semibold">
                    {studyPlan.dailyStructure.practice.questionsCount} ጥያቄዎች
                  </span>
                </div>
                <h4 className="text-sm font-bold text-stone-800">
                  {studyPlan.dailyStructure.practice.topic}
                </h4>
                <p className="text-xs text-stone-600">
                  ደረጃ በደረጃ ከአንደኛ እስከ አራተኛ ደረጃ አስቸጋሪነት ጥያቄዎችን መስራት
                </p>
              </div>
            </div>

            {/* 3. Weak-Topic Revision */}
            <div
              onClick={() => handleToggleDailyTask('weakTopicRevision')}
              className={`p-4 rounded-2xl border transition-all flex items-start gap-3 cursor-pointer ${
                studyPlan.dailyStructure.weakTopicRevision.completed
                  ? 'bg-emerald-50/70 border-emerald-300'
                  : 'bg-white hover:bg-stone-50 border-stone-200'
              }`}
            >
              {studyPlan.dailyStructure.weakTopicRevision.completed ? (
                <CheckSquare className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <Square className="w-5 h-5 text-stone-400 shrink-0 mt-0.5" />
              )}
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-rose-900">
                    3. Weak-Topic Revision ({studyPlan.dailyStructure.weakTopicRevision.durationMins} min)
                  </span>
                  <span className="text-[11px] text-rose-600 font-semibold">ክፍተት ማረሚያ</span>
                </div>
                <h4 className="text-sm font-bold text-stone-800">
                  {studyPlan.dailyStructure.weakTopicRevision.topic}
                </h4>
                <p className="text-xs text-stone-600">
                  {studyPlan.dailyStructure.weakTopicRevision.reason}
                </p>
              </div>
            </div>

            {/* 4. Timed Questions */}
            <div
              onClick={() => handleToggleDailyTask('timedQuestions')}
              className={`p-4 rounded-2xl border transition-all flex items-start gap-3 cursor-pointer ${
                studyPlan.dailyStructure.timedQuestions.completed
                  ? 'bg-emerald-50/70 border-emerald-300'
                  : 'bg-white hover:bg-stone-50 border-stone-200'
              }`}
            >
              {studyPlan.dailyStructure.timedQuestions.completed ? (
                <CheckSquare className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <Square className="w-5 h-5 text-stone-400 shrink-0 mt-0.5" />
              )}
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-900">
                    4. Timed Questions ({studyPlan.dailyStructure.timedQuestions.durationMins} min)
                  </span>
                  <span className="text-[11px] text-amber-700 font-semibold">
                    {studyPlan.dailyStructure.timedQuestions.count} ጥያቄዎች
                  </span>
                </div>
                <h4 className="text-sm font-bold text-stone-800">የፍጥነትና ትኩረት ልምምድ (Timed Sprint)</h4>
                <p className="text-xs text-stone-600">
                  በፈተና ሰዓት ውስጥ በፍጥነትና በጥንቃቄ መልሶችን የመለየት ልምድ
                </p>
              </div>
            </div>

            {/* 5. Review Mistakes */}
            <div
              onClick={() => handleToggleDailyTask('reviewMistakes')}
              className={`p-4 rounded-2xl border transition-all flex items-start gap-3 cursor-pointer ${
                studyPlan.dailyStructure.reviewMistakes.completed
                  ? 'bg-emerald-50/70 border-emerald-300'
                  : 'bg-white hover:bg-stone-50 border-stone-200'
              }`}
            >
              {studyPlan.dailyStructure.reviewMistakes.completed ? (
                <CheckSquare className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <Square className="w-5 h-5 text-stone-400 shrink-0 mt-0.5" />
              )}
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-900">
                    5. Review Mistakes ({studyPlan.dailyStructure.reviewMistakes.durationMins} min)
                  </span>
                  <span className="text-[11px] text-purple-700 font-semibold">የስህተት ማስታወሻ</span>
                </div>
                <h4 className="text-sm font-bold text-stone-800">
                  የተሳሳቷቸውን ጥያቄዎች ደግመው ይስሩ
                </h4>
                <p className="text-xs text-stone-600">
                  የስህተት መንስኤዎችን በAI አስጠኚ ወይም በመጽሐፍ ማብራሪያ ማጥራት
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Weekly Milestones */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-5">
          <h3 className="text-base font-bold font-serif-ethiopic text-stone-900 flex items-center gap-2">
            <Target className="w-5 h-5 text-indigo-600" />
            የሳምንቱ ወሳኝ ደረጃዎች (Weekly Milestones)
          </h3>

          <div className="space-y-2.5">
            {studyPlan.weeklyMilestones.map((milestone) => (
              <div
                key={milestone.id}
                onClick={() => handleToggleMilestone(milestone.id)}
                className={`p-3.5 rounded-xl border transition-all flex items-start gap-3 cursor-pointer ${
                  milestone.completed
                    ? 'bg-emerald-50/60 border-emerald-300'
                    : 'bg-stone-50 hover:bg-stone-100 border-stone-200'
                }`}
              >
                {milestone.completed ? (
                  <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <Square className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
                )}
                <div className="space-y-0.5 text-xs">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-stone-800">{milestone.day}</span>
                    <span className="text-[10px] text-stone-500 font-semibold">
                      {milestone.targetAccuracy}% Accuracy
                    </span>
                  </div>
                  <p className="text-stone-600 leading-snug">{milestone.focus}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <button
              onClick={() => onSelectSubTab('practice')}
              className="w-full py-3 bg-indigo-700 hover:bg-indigo-800 text-white rounded-xl text-xs font-bold shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>ወደ ልምምድ ቀጥል (Start Today's Practice)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
