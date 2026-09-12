import React from 'react';
import { Award, Zap, Sparkles, Shield, ChevronRight, Info } from 'lucide-react';
import { GamificationProfile } from '../../types/gamification';
import { SupportedLanguage } from '../../types/curriculumEngine';
import { LEARNING_LEVELS, calculateLevelProgress } from '../../data/gamificationData';

interface XPLevelHeaderCardProps {
  profile: GamificationProfile | null;
  language: SupportedLanguage;
  onRunTestFlow?: () => void;
}

export const XPLevelHeaderCard: React.FC<XPLevelHeaderCardProps> = ({
  profile,
  language,
  onRunTestFlow,
}) => {
  const totalXp = profile?.totalXp || 0;
  const progress = calculateLevelProgress(totalXp);
  const currentLvl = progress.currentLevel;
  const nextLvl = progress.nextLevel;

  const levelTitle = currentLvl.title[language] || currentLvl.title.en;
  const nextLevelTitle = nextLvl ? nextLvl.title[language] || nextLvl.title.en : 'Maximum Level Reached';
  const perkText = currentLvl.perk[language] || currentLvl.perk.en;

  return (
    <div
      id="gamification-xp-level-card"
      className="bg-[#FAF6EC] border-[1.5px] border-[#38332D] rounded-xl p-4 sm:p-6 shadow-sm mb-5 relative overflow-hidden"
    >
      {/* Top Banner & Grade Disclaimer */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-[#E3DAC4]">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-900 font-black">
            <Award className="w-5 h-5 text-amber-700" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#7A705E]">
                {language === 'am' ? 'የትምህርት ደረጃ' : language === 'om' ? 'Sadarkaa Barnootaa' : language === 'ti' ? 'ብርኪ ትምህርቲ' : 'Learning Level'}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold flex items-center gap-1">
                <Info className="w-3 h-3" />
                {language === 'am'
                  ? 'የጥናት ትጋት ደረጃ (የክፍል ደረጃ አይደለም)'
                  : language === 'om'
                  ? 'Sadarkaa ciminnaa (kutaa miti)'
                  : language === 'ti'
                  ? 'ናይ ጽንዓት ብርኪ (ክፍሊ ኣይኮነን)'
                  : 'Study Dedication Level (Not Academic Grade)'}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold font-serif-ethiopic text-[#1E1B18]">
              {language === 'am' ? `ደረጃ ${currentLvl.level}፡ ${levelTitle}` : `Level ${currentLvl.level}: ${levelTitle}`}
            </h2>
          </div>
        </div>

        {/* Action Button: Run Verification Suite */}
        {onRunTestFlow && (
          <button
            id="btn-run-gamification-verification"
            onClick={onRunTestFlow}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#38332D] text-[#FAF6EC] hover:bg-[#25221E] active:scale-95 text-xs font-bold rounded-lg border border-[#1E1B18] shadow-xs transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>
              {language === 'am' ? 'የ 9-ደረጃ የሞተር ፍተሻ (Final Test)' : 'Run 9-Stage Test Suite'}
            </span>
          </button>
        )}
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4">
        {/* Total XP Earned */}
        <div className="bg-[#F2ECE0] border border-[#DDD3BF] rounded-lg p-3">
          <div className="flex items-center justify-between text-xs text-[#7A705E] font-medium mb-1">
            <span>{language === 'am' ? 'አጠቃላይ XP' : 'Total XP Earned'}</span>
            <Zap className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-[#1E1B18]">
            {totalXp.toLocaleString()} <span className="text-xs font-normal text-[#5A5143]">XP</span>
          </div>
        </div>

        {/* Current Level */}
        <div className="bg-[#F2ECE0] border border-[#DDD3BF] rounded-lg p-3">
          <div className="flex items-center justify-between text-xs text-[#7A705E] font-medium mb-1">
            <span>{language === 'am' ? 'የአሁን ደረጃ' : 'Current Level'}</span>
            <Shield className="w-3.5 h-3.5 text-indigo-600" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-[#1E1B18]">
            {currentLvl.level} <span className="text-xs font-normal text-[#5A5143]">/ 10</span>
          </div>
        </div>

        {/* XP for next level */}
        <div className="bg-[#F2ECE0] border border-[#DDD3BF] rounded-lg p-3">
          <div className="flex items-center justify-between text-xs text-[#7A705E] font-medium mb-1">
            <span>{language === 'am' ? 'ለቀጣይ ደረጃ' : 'XP to Next Level'}</span>
            <ChevronRight className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-[#1E1B18]">
            {nextLvl ? progress.xpNeededForNextLevel.toLocaleString() : '0'}{' '}
            <span className="text-xs font-normal text-[#5A5143]">XP</span>
          </div>
        </div>

        {/* Badges Earned */}
        <div className="bg-[#F2ECE0] border border-[#DDD3BF] rounded-lg p-3">
          <div className="flex items-center justify-between text-xs text-[#7A705E] font-medium mb-1">
            <span>{language === 'am' ? 'የተገኙ ባጆች' : 'Badges Earned'}</span>
            <Award className="w-3.5 h-3.5 text-purple-600" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-[#1E1B18]">
            {profile?.badgesCount || 0} <span className="text-xs font-normal text-[#5A5143]">/ 10</span>
          </div>
        </div>
      </div>

      {/* Progress Bar & Next Level Target */}
      <div className="mt-1">
        <div className="flex justify-between items-center text-xs font-bold text-[#5A5143] mb-1.5">
          <span>
            {language === 'am'
              ? `ደረጃ ${currentLvl.level} እድገት (${progress.percentage}%)`
              : `Level ${currentLvl.level} Progress (${progress.percentage}%)`}
          </span>
          {nextLvl && (
            <span className="text-[11px] text-[#7A705E]">
              {language === 'am' ? `ቀጣይ፡ ደረጃ ${nextLvl.level} (${nextLevelTitle})` : `Next: Level ${nextLvl.level} (${nextLevelTitle})`}
            </span>
          )}
        </div>

        <div className="w-full bg-[#E5DDCB] h-3 rounded-full overflow-hidden border border-[#D5C9B3] relative">
          <div
            className="h-full bg-gradient-to-r from-amber-500 via-amber-600 to-emerald-600 rounded-full transition-all duration-500"
            style={{ width: `${Math.max(5, progress.percentage)}%` }}
          />
        </div>

        {/* Level Perk notification */}
        <div className="mt-3 flex items-start gap-2 text-xs bg-amber-50/80 border border-amber-200 text-amber-900 rounded-lg p-2.5">
          <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">
              {language === 'am' ? 'የደረጃው ልዩ ጥቅም፡ ' : 'Level Privilege: '}
            </span>
            <span>{perkText}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
