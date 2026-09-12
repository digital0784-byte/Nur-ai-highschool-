import React from 'react';
import { TrendingUp, Sparkles, CheckCircle2, HeartHandshake } from 'lucide-react';
import { PersonalMilestone } from '../../types/gamification';
import { SupportedLanguage } from '../../types/curriculumEngine';

interface PersonalMilestonesCardProps {
  milestones: PersonalMilestone[];
  language: SupportedLanguage;
}

const DEFAULT_SAMPLE_MILESTONES: PersonalMilestone[] = [
  {
    id: 'sample-1',
    userId: 'default',
    type: 'score_improved',
    title: {
      en: 'Mathematics Score Surge',
      am: 'የሂሳብ ውጤት መሻሻል',
      om: 'Fooyya\'iinsa Qabxii Herregaa',
      ti: 'ናይ ሒሳብ ውጽኢት ምምሕያሽ',
    },
    message: {
      en: 'Your Mathematics score improved by 15% on Unit 1 Relations & Functions.',
      am: 'በምዕራፍ 1 ግንኙነቶች እና ፈንክሽኖች ላይ የሂሳብ ውጤትዎ በ 15% አሻሽሏል።',
      om: 'Qabxiin herregaa boqonnaa 1 keessatti 15%n fooyya\'eera.',
      ti: 'ኣብ ምዕራፍ 1 ዝምድናታትን ፈንክሽናትን ናይ ሒሳብ ውጽኢትኩም ብ 15% ተመሓይሹ።',
    },
    metricValue: 15,
    achievedAt: new Date().toISOString(),
    acknowledged: true,
  },
  {
    id: 'sample-2',
    userId: 'default',
    type: 'topics_mastered_weekly',
    title: {
      en: 'Weekly Mastery Milestone',
      am: 'የሳምንታዊ ክህሎት ምዕራፍ',
      om: 'Milkaa\'ina Torbee',
      ti: 'ናይ ሰሙን ዓወት',
    },
    message: {
      en: 'You mastered 5 new topics across Sciences and Social Studies this week.',
      am: 'በዚህ ሳምንት በተፈጥሮ እና በማህበራዊ ሳይንስ ውስጥ 5 አዳዲስ ርዕሶችን አውቀዋል።',
      om: 'Torbee kana keessatti mata dureewwan haaraa 5 sirriitti hubatteetta.',
      ti: 'ኣብዚ ሰሙን 5 ሓደሽቲ ኣርእስቲ ተማሂርኩም ወዲእኩም።',
    },
    metricValue: 5,
    achievedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    acknowledged: true,
  },
  {
    id: 'sample-3',
    userId: 'default',
    type: 'weekly_goal_completed',
    title: {
      en: 'Learning Goal Completed',
      am: 'የመማሪያ ግብ ተሳክቷል',
      om: 'Galmi Xumurameera',
      ti: 'ሸቶ ትምህርቲ ተዛዚሙ',
    },
    message: {
      en: 'You completed your weekly learning goal with regular study sessions.',
      am: 'በቋሚ የመማር ክፍለ-ጊዜዎች ሳምንታዊ የትምህርት ግብዎን አሳክተዋል።',
      om: 'Galma barnootaa torbee keetii haalaan xumurteetta.',
      ti: 'ናይ ሰሙን ናይ ምምሃር ሸቶኹም ብብቕዓት ዛዚምኩም።',
    },
    metricValue: 100,
    achievedAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    acknowledged: true,
  },
];

export const PersonalMilestonesCard: React.FC<PersonalMilestonesCardProps> = ({
  milestones = [],
  language,
}) => {
  const displayMilestones = milestones.length > 0 ? milestones : DEFAULT_SAMPLE_MILESTONES;

  return (
    <div
      id="gamification-personal-milestones-card"
      className="bg-[#FAF6EC] border-[1.5px] border-[#38332D] rounded-xl p-4 sm:p-5 shadow-sm mb-5"
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#E3DAC4]">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-800">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base font-serif-ethiopic text-[#1E1B18]">
              {language === 'am'
                ? 'የግል መሻሻል ምዕራፎች (Personal Milestones)'
                : language === 'om'
                ? 'Milkaa\'ina Dhuunfaa'
                : language === 'ti'
                ? 'ናይ ውልቀ ዓወታት'
                : 'Personal Milestones & Growth'}
            </h3>
            <p className="text-xs text-[#7A705E]">
              {language === 'am'
                ? 'ከሌሎች ጋር ካልተገባ ውድድር ይልቅ በራስዎ እድገት እና መሻሻል ላይ ያተኮረ'
                : 'Focused on your personal progress and growth instead of unhealthy competition.'}
            </p>
          </div>
        </div>

        <span className="text-xs font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2.5 py-1 rounded-full flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5" />
          {displayMilestones.length} {language === 'am' ? 'ምዕራፎች' : 'Milestones'}
        </span>
      </div>

      {/* Milestones List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mt-4">
        {displayMilestones.map((item) => {
          const title = item.title[language] || item.title.en;
          const msg = item.message[language] || item.message.en;

          return (
            <div
              key={item.id}
              className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/50 hover:bg-emerald-50 transition-all"
            >
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs mb-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <span className="font-serif-ethiopic">{title}</span>
              </div>
              <p className="text-xs text-[#2E3C2B] leading-relaxed font-serif-ethiopic">
                "{msg}"
              </p>
              <div className="mt-3 flex items-center justify-between text-[11px] text-[#556951] pt-2 border-t border-emerald-200/60">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  {language === 'am' ? 'የተረጋገጠ እድገት' : 'Verified Growth'}
                </span>
                <span>
                  {new Date(item.achievedAt).toLocaleDateString(language === 'am' ? 'am-ET' : 'en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
