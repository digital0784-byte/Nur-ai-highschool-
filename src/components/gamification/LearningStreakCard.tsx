import React from 'react';
import { Flame, Calendar, ShieldCheck, Heart, Sparkles, CheckCircle2 } from 'lucide-react';
import { LearningStreak } from '../../types/gamification';
import { SupportedLanguage } from '../../types/curriculumEngine';

interface LearningStreakCardProps {
  streak: LearningStreak | null;
  language: SupportedLanguage;
  onRefreshStreak?: () => void;
}

export const LearningStreakCard: React.FC<LearningStreakCardProps> = ({
  streak,
  language,
  onRefreshStreak,
}) => {
  const currentStreak = streak?.currentStreak || 1;
  const longestStreak = streak?.longestStreak || 1;
  const freezeCount = streak?.freezeCount ?? 2;
  const gracePeriodUsed = streak?.gracePeriodUsed || false;
  const historyDates = streak?.historyDates || [];

  // Generate last 14 days calendar sequence for visual streak display
  const pastDays = Array.from({ length: 14 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (13 - i));
    const dateStr = d.toISOString().split('T')[0];
    const isCompleted = historyDates.includes(dateStr);
    const isToday = i === 13;
    return {
      dateStr,
      dayNum: d.getDate(),
      dayName: d.toLocaleDateString(language === 'am' ? 'am-ET' : 'en-US', { weekday: 'narrow' }),
      isCompleted,
      isToday,
    };
  });

  return (
    <div
      id="gamification-streak-card"
      className="bg-[#FAF6EC] border-[1.5px] border-[#38332D] rounded-xl p-4 sm:p-5 shadow-sm mb-5"
    >
      {/* Title & Streak Stats */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#E3DAC4]">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-orange-100 border border-orange-300 flex items-center justify-center text-orange-700">
            <Flame className="w-5 h-5 fill-orange-500 text-orange-600" />
          </div>
          <div>
            <h3 className="font-bold text-base font-serif-ethiopic text-[#1E1B18]">
              {language === 'am'
                ? 'የተከታታይ ቀናት ትምህርት (Learning Streak)'
                : language === 'om'
                ? 'Turtii Barnootaa (Streak)'
                : language === 'ti'
                ? 'ቀጻልነት ትምህርቲ (Streak)'
                : 'Learning Streak'}
            </h3>
            <p className="text-xs text-[#7A705E]">
              {language === 'am'
                ? 'በየቀኑ በመማር እውቀትን ያጠናክሩ፤ አንድ ቀን ቢዘለልም ይቅር ባይ ስርዓት አለው'
                : 'Study consistently every day; forgiving mechanism prevents harsh penalties for missing a day.'}
            </p>
          </div>
        </div>

        {/* Action / Today's Status */}
        <div className="flex items-center gap-2">
          <span className="text-xs px-2.5 py-1 bg-orange-100 text-orange-900 border border-orange-300 rounded-full font-bold flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-600" />
            {currentStreak} {language === 'am' ? 'ቀናት' : 'Days'}
          </span>
          {onRefreshStreak && (
            <button
              onClick={onRefreshStreak}
              className="text-xs text-[#5A5143] hover:text-[#1E1B18] underline cursor-pointer"
            >
              {language === 'am' ? 'አድስ' : 'Refresh'}
            </button>
          )}
        </div>
      </div>

      {/* Metrics Row: Current Streak, Longest Streak, Forgiving Freezes */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
        {/* Current Streak */}
        <div className="bg-[#F2ECE0] border border-[#DDD3BF] rounded-lg p-3 flex items-center justify-between">
          <div>
            <div className="text-xs text-[#7A705E]">
              {language === 'am' ? 'የአሁን ተከታታይነት' : 'Current Streak'}
            </div>
            <div className="text-2xl font-black text-[#1E1B18] flex items-center gap-1">
              {currentStreak}
              <span className="text-xs font-normal text-[#5A5143]">
                {language === 'am' ? 'ተከታታይ ቀናት' : 'consecutive days'}
              </span>
            </div>
          </div>
          <Flame className="w-6 h-6 text-orange-500 fill-orange-400" />
        </div>

        {/* Longest Streak */}
        <div className="bg-[#F2ECE0] border border-[#DDD3BF] rounded-lg p-3 flex items-center justify-between">
          <div>
            <div className="text-xs text-[#7A705E]">
              {language === 'am' ? 'ረጅሙ ተከታታይነት' : 'Longest Streak'}
            </div>
            <div className="text-2xl font-black text-[#1E1B18] flex items-center gap-1">
              {longestStreak}
              <span className="text-xs font-normal text-[#5A5143]">
                {language === 'am' ? 'ቀናት' : 'days'}
              </span>
            </div>
          </div>
          <Sparkles className="w-6 h-6 text-amber-600" />
        </div>

        {/* Forgiving Streak Freeze / Grace Protection */}
        <div className="bg-[#F2ECE0] border border-[#DDD3BF] rounded-lg p-3 flex items-center justify-between">
          <div>
            <div className="text-xs text-[#7A705E]">
              {language === 'am' ? 'የዕረፍት ይቅርታ (Grace Freezes)' : 'Streak Freezes Remaining'}
            </div>
            <div className="text-xl font-black text-emerald-800 flex items-center gap-1">
              {freezeCount}
              <span className="text-xs font-normal text-[#5A5143]">
                {language === 'am' ? 'የቀሩ ይቅርታዎች' : 'available'}
              </span>
            </div>
          </div>
          <ShieldCheck className="w-6 h-6 text-emerald-600" />
        </div>
      </div>

      {/* 14-Day Calendar History Row */}
      <div className="mt-2">
        <div className="flex items-center justify-between text-xs font-bold text-[#5A5143] mb-2">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#7A705E]" />
            {language === 'am' ? 'የ 14 ቀናት የመማር ታሪክ' : 'Last 14 Days Activity'}
          </span>
          <span className="text-[11px] text-[#7A705E]">
            {language === 'am' ? 'አረንጓዴ = የተጠናበት ቀን' : 'Green = Study Completed'}
          </span>
        </div>

        <div className="grid grid-cols-7 sm:grid-cols-14 gap-1.5 sm:gap-2">
          {pastDays.map((day) => (
            <div
              key={day.dateStr}
              title={`${day.dateStr} - ${day.isCompleted ? 'Completed' : 'Missed'}`}
              className={`flex flex-col items-center justify-center p-1.5 rounded-lg border text-center transition-all ${
                day.isCompleted
                  ? 'bg-emerald-100 border-emerald-400 text-emerald-950 font-bold'
                  : 'bg-[#EDE6D4] border-[#D5C9B3] text-[#7A705E]'
              } ${day.isToday ? 'ring-2 ring-orange-500' : ''}`}
            >
              <span className="text-[10px] uppercase">{day.dayName}</span>
              <span className="text-xs font-black">{day.dayNum}</span>
              {day.isCompleted ? (
                <CheckCircle2 className="w-3 h-3 text-emerald-600 mt-0.5" />
              ) : (
                <span className="w-1.5 h-1.5 rounded-full bg-[#BAAE98] mt-1" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Forgiving message (Requirement: "Do not punish students excessively for missing a day") */}
      <div className="mt-4 flex items-center gap-2 text-xs bg-[#F2ECE0] border border-[#DDD3BF] text-[#5A5143] rounded-lg p-2.5">
        <Heart className="w-4 h-4 text-rose-500 shrink-0" />
        <span>
          {language === 'am'
            ? 'አንድ ቀን ቢቀርዎ ተስፋ አይቁረጡ! ስርዓታችን የዕረፍት ይቅርታ ስላለው በቀጣዩ ቀን በመማር ተከታታይነትዎን በቀላሉ ማስቀጠል ይችላሉ።'
            : 'Missed a day? Do not worry! Our forgiving system protects your streak with freeze days so you can jump right back in without stress.'}
        </span>
      </div>
    </div>
  );
};
