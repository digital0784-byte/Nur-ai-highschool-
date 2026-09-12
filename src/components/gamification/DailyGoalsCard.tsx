import React from 'react';
import { Target, CheckCircle2, Circle, Zap, BookOpen, HelpCircle, RotateCcw, Award } from 'lucide-react';
import { DailyGoal } from '../../types/gamification';
import { SupportedLanguage } from '../../types/curriculumEngine';

interface DailyGoalsCardProps {
  goals: DailyGoal[];
  language: SupportedLanguage;
  onQuickAction?: (goalType: DailyGoal['type']) => void;
}

export const DailyGoalsCard: React.FC<DailyGoalsCardProps> = ({
  goals,
  language,
  onQuickAction,
}) => {
  const completedCount = goals.filter((g) => g.isCompleted).length;
  const totalCount = goals.length;
  const allCompleted = totalCount > 0 && completedCount === totalCount;

  const getIcon = (type: DailyGoal['type']) => {
    switch (type) {
      case 'complete_lesson':
        return <BookOpen className="w-4 h-4 text-blue-600" />;
      case 'practice_questions':
        return <HelpCircle className="w-4 h-4 text-emerald-600" />;
      case 'review_weak_topic':
        return <RotateCcw className="w-4 h-4 text-purple-600" />;
      case 'take_quiz':
        return <Award className="w-4 h-4 text-amber-600" />;
    }
  };

  return (
    <div
      id="gamification-daily-goals-card"
      className="bg-[#FAF6EC] border-[1.5px] border-[#38332D] rounded-xl p-4 sm:p-5 shadow-sm mb-5"
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#E3DAC4]">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-800">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base font-serif-ethiopic text-[#1E1B18]">
              {language === 'am'
                ? 'የዛሬው ዕለታዊ ግቦች (Today’s Goals)'
                : language === 'om'
                ? 'Galma Guyyaa Har\'aa'
                : language === 'ti'
                ? 'ናይ ሎሚ ናይ መዓልቲ ሸቶታት'
                : 'Today’s Learning Goals'}
            </h3>
            <p className="text-xs text-[#7A705E]">
              {language === 'am'
                ? 'ቀለል ያሉ የዕለት ልምምዶችን በማጠናቀቅ ተጨማሪ የ XP ሽልማት ያግኙ'
                : 'Complete small daily study goals to build deep mastery and earn bonus XP.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`text-xs px-2.5 py-1 rounded-full font-bold border ${
              allCompleted
                ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                : 'bg-amber-100 text-amber-900 border-amber-300'
            }`}
          >
            {completedCount} / {totalCount} {language === 'am' ? 'ተጠናቋል' : 'Completed'}
          </span>
        </div>
      </div>

      {/* Goals List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
        {goals.map((goal) => {
          const title = goal.title[language] || goal.title.en;
          const desc = goal.description[language] || goal.description.en;
          const pct = Math.round((goal.currentCount / goal.targetCount) * 100);

          return (
            <div
              key={goal.id}
              className={`p-3 rounded-lg border transition-all ${
                goal.isCompleted
                  ? 'bg-emerald-50/70 border-emerald-300'
                  : 'bg-[#F2ECE0] border-[#DDD3BF] hover:border-[#BAAE98]'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2.5">
                  <div className="mt-0.5">{getIcon(goal.type)}</div>
                  <div>
                    <h4 className="text-sm font-bold text-[#1E1B18] font-serif-ethiopic">
                      {title}
                    </h4>
                    <p className="text-xs text-[#5A5143] mt-0.5">{desc}</p>
                  </div>
                </div>

                {/* Completed / Incomplete Badge */}
                <div className="shrink-0">
                  {goal.isCompleted ? (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {language === 'am' ? 'ተጠናቋል' : 'Done'}
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[11px] font-medium text-[#7A705E] bg-[#E3DAC4] px-2 py-0.5 rounded-full">
                      <Circle className="w-3 h-3 text-[#7A705E]" />
                      {goal.currentCount} / {goal.targetCount}
                    </span>
                  )}
                </div>
              </div>

              {/* Progress Bar & XP reward */}
              <div className="mt-3 flex items-center justify-between gap-3">
                <div className="flex-1">
                  <div className="w-full bg-[#DDD3BF] h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        goal.isCompleted ? 'bg-emerald-600' : 'bg-amber-600'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs font-bold text-amber-800 shrink-0">
                  <Zap className="w-3 h-3 fill-amber-500 text-amber-600" />
                  <span>+{goal.xpReward} XP</span>
                </div>
              </div>

              {/* Action trigger button if not completed */}
              {!goal.isCompleted && onQuickAction && (
                <div className="mt-2 text-right">
                  <button
                    onClick={() => onQuickAction(goal.type)}
                    className="text-[11px] text-[#2563EB] hover:underline font-bold cursor-pointer"
                  >
                    {language === 'am' ? 'አሁን ስራ →' : 'Start Now →'}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
