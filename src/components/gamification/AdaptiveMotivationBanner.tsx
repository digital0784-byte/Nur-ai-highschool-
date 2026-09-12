import React from 'react';
import { Sparkles, Heart, Compass, BookOpen, ArrowRight } from 'lucide-react';
import { AdaptiveMotivationState } from '../../types/gamification';
import { SupportedLanguage } from '../../types/curriculumEngine';

interface AdaptiveMotivationBannerProps {
  motivation: AdaptiveMotivationState;
  language: SupportedLanguage;
  onAction?: (actionType: AdaptiveMotivationState['suggestedAction']['type']) => void;
}

export const AdaptiveMotivationBanner: React.FC<AdaptiveMotivationBannerProps> = ({
  motivation,
  language,
  onAction,
}) => {
  const headline = motivation.headline[language] || motivation.headline.en;
  const subtext = motivation.subtext[language] || motivation.subtext.en;

  const isCelebration = motivation.tone === 'celebrating';
  const isSupportive = motivation.tone === 'supportive_revision';

  return (
    <div
      id="gamification-adaptive-motivation-banner"
      className={`rounded-xl border p-4 sm:p-5 mb-5 transition-all ${
        isCelebration
          ? 'bg-amber-50/90 border-amber-300 text-amber-950'
          : isSupportive
          ? 'bg-indigo-50/90 border-indigo-200 text-indigo-950'
          : 'bg-[#F2ECE0] border-[#DDD3BF] text-[#1E1B18]'
      }`}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
              isCelebration
                ? 'bg-amber-100 border-amber-300 text-amber-800'
                : isSupportive
                ? 'bg-indigo-100 border-indigo-300 text-indigo-800'
                : 'bg-[#E3DAC4] border-[#D5C9B3] text-[#5A5143]'
            }`}
          >
            {isCelebration ? (
              <Sparkles className="w-5 h-5" />
            ) : isSupportive ? (
              <Heart className="w-5 h-5 text-indigo-600" />
            ) : (
              <Compass className="w-5 h-5" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-white/70 border border-current/20">
                {language === 'am'
                  ? 'የአይ አይ አጋዥ መልዕክት (Adaptive Motivation)'
                  : 'AI Learning Coach'}
              </span>
            </div>
            <h3 className="text-base font-bold mt-1 font-serif-ethiopic">
              {headline}
            </h3>
            <p className="text-xs text-inherit opacity-90 mt-1 max-w-2xl font-serif-ethiopic leading-relaxed">
              {subtext}
            </p>
          </div>
        </div>

        {/* Action Button */}
        {onAction && (
          <button
            onClick={() => onAction(motivation.suggestedAction.type)}
            className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg border shadow-xs transition-all cursor-pointer shrink-0 active:scale-95 ${
              isCelebration
                ? 'bg-amber-600 text-white border-amber-700 hover:bg-amber-700'
                : isSupportive
                ? 'bg-indigo-600 text-white border-indigo-700 hover:bg-indigo-700'
                : 'bg-[#38332D] text-[#FAF6EC] border-[#1E1B18] hover:bg-[#25221E]'
            }`}
          >
            <span>
              {isSupportive
                ? language === 'am'
                  ? 'ቁልፍ ነጥቦችን ከልስ'
                  : 'Review Key Points'
                : isCelebration
                ? language === 'am'
                  ? 'ወደ ቀጣዩ ፈታኝ ደረጃ'
                  : 'Next Challenge'
                : language === 'am'
                ? 'ቀጣይ ትምህርት'
                : 'Continue Study'}
            </span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
