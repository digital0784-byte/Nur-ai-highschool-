import React, { useState } from 'react';
import {
  Award,
  BookOpen,
  Crown,
  Flame,
  Sun,
  Compass,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  Target,
  Lock,
  Zap,
} from 'lucide-react';
import { BadgeItem } from '../../types/gamification';
import { SupportedLanguage } from '../../types/curriculumEngine';

interface BadgesGridProps {
  allBadges: BadgeItem[];
  earnedBadgeIds: string[];
  language: SupportedLanguage;
}

export const BadgesGrid: React.FC<BadgesGridProps> = ({
  allBadges,
  earnedBadgeIds,
  language,
}) => {
  const [filter, setFilter] = useState<'all' | 'earned' | 'locked'>('all');

  const earnedCount = earnedBadgeIds.length;
  const totalCount = allBadges.length;

  const getBadgeIcon = (iconName: string, isEarned: boolean) => {
    const className = `w-6 h-6 ${isEarned ? 'text-white' : 'text-[#7A705E]'}`;
    switch (iconName) {
      case 'BookOpen':
        return <BookOpen className={className} />;
      case 'Award':
        return <Award className={className} />;
      case 'Crown':
        return <Crown className={className} />;
      case 'Flame':
        return <Flame className={className} />;
      case 'Sun':
        return <Sun className={className} />;
      case 'Compass':
        return <Compass className={className} />;
      case 'Sparkles':
        return <Sparkles className={className} />;
      case 'TrendingUp':
        return <TrendingUp className={className} />;
      case 'CheckCircle2':
        return <CheckCircle2 className={className} />;
      case 'Target':
      default:
        return <Target className={className} />;
    }
  };

  const filteredBadges = allBadges.filter((b) => {
    const isEarned = earnedBadgeIds.includes(b.id);
    if (filter === 'earned') return isEarned;
    if (filter === 'locked') return !isEarned;
    return true;
  });

  return (
    <div
      id="gamification-badges-panel"
      className="bg-[#FAF6EC] border-[1.5px] border-[#38332D] rounded-xl p-4 sm:p-5 shadow-sm mb-5"
    >
      {/* Header & Filter pills */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#E3DAC4]">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-900">
            <Award className="w-5 h-5 text-amber-700" />
          </div>
          <div>
            <h3 className="font-bold text-base font-serif-ethiopic text-[#1E1B18]">
              {language === 'am'
                ? 'የውጤት ማረጋገጫ ባጆች (Achievement Badges)'
                : language === 'om'
                ? 'Mallattoolee Milkaa\'inaa'
                : language === 'ti'
                ? 'ናይ ዓወት ምልክታት (Badges)'
                : 'Achievement Badges'}
            </h3>
            <p className="text-xs text-[#7A705E]">
              {language === 'am'
                ? 'ከእውነተኛ የትምህርት ጥረትና ምዘና ብቻ የሚገኙ የተረጋገጡ ባጆች'
                : 'Earned exclusively through verified learning activities and real curriculum mastery.'}
            </p>
          </div>
        </div>

        {/* Filter controls */}
        <div className="flex items-center gap-1.5 bg-[#EDE6D4] p-1 rounded-lg border border-[#DDD3BF]">
          <button
            onClick={() => setFilter('all')}
            className={`px-2.5 py-1 text-xs rounded font-bold transition-all cursor-pointer ${
              filter === 'all'
                ? 'bg-[#FAF6EC] text-[#1E1B18] shadow-xs'
                : 'text-[#5A5143] hover:text-[#1E1B18]'
            }`}
          >
            {language === 'am' ? 'ሁሉም' : 'All'} ({totalCount})
          </button>
          <button
            onClick={() => setFilter('earned')}
            className={`px-2.5 py-1 text-xs rounded font-bold transition-all cursor-pointer ${
              filter === 'earned'
                ? 'bg-emerald-100 text-emerald-900 shadow-xs'
                : 'text-[#5A5143] hover:text-[#1E1B18]'
            }`}
          >
            {language === 'am' ? 'የተገኙ' : 'Earned'} ({earnedCount})
          </button>
          <button
            onClick={() => setFilter('locked')}
            className={`px-2.5 py-1 text-xs rounded font-bold transition-all cursor-pointer ${
              filter === 'locked'
                ? 'bg-[#FAF6EC] text-[#1E1B18] shadow-xs'
                : 'text-[#5A5143] hover:text-[#1E1B18]'
            }`}
          >
            {language === 'am' ? 'የቀሩ' : 'Locked'} ({totalCount - earnedCount})
          </button>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 mt-4">
        {filteredBadges.map((badge) => {
          const isEarned = earnedBadgeIds.includes(badge.id);
          const title = badge.title[language] || badge.title.en;
          const desc = badge.description[language] || badge.description.en;

          return (
            <div
              key={badge.id}
              className={`p-3.5 rounded-xl border transition-all relative ${
                isEarned
                  ? 'bg-[#FAF6EC] border-[#38332D] shadow-xs'
                  : 'bg-[#F4EFE6] border-[#DDD3BF] opacity-80'
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Badge Icon Circle */}
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border transition-all ${
                    isEarned
                      ? 'border-[#38332D] shadow-xs'
                      : 'bg-[#E3DAC4] border-[#DDD3BF]'
                  }`}
                  style={{
                    backgroundColor: isEarned ? badge.colorHex : undefined,
                  }}
                >
                  {isEarned ? (
                    getBadgeIcon(badge.iconName, true)
                  ) : (
                    <Lock className="w-5 h-5 text-[#7A705E]" />
                  )}
                </div>

                {/* Badge Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="text-sm font-bold text-[#1E1B18] truncate font-serif-ethiopic">
                      {title}
                    </h4>
                    {isEarned ? (
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-1.5 py-0.5 rounded-full shrink-0">
                        {language === 'am' ? 'የተገኘ' : 'Unlocked'}
                      </span>
                    ) : (
                      <span className="text-[10px] font-medium text-[#7A705E] bg-[#E3DAC4] px-1.5 py-0.5 rounded-full shrink-0">
                        {language === 'am' ? 'የተቆለፈ' : 'Locked'}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-[#5A5143] mt-1 line-clamp-2">
                    {desc}
                  </p>

                  <div className="mt-2.5 flex items-center justify-between text-[11px] pt-2 border-t border-[#E8DFC9]">
                    <span className="text-[#7A705E] capitalize">
                      {badge.category}
                    </span>
                    <span className="flex items-center gap-1 font-bold text-amber-800">
                      <Zap className="w-3 h-3 text-amber-600 fill-amber-500" />
                      +{badge.xpBonus} XP
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
