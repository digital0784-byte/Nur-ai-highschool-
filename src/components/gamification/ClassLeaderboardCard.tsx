import React, { useState } from 'react';
import { Users, Shield, EyeOff, Eye, Award, Flame, Zap } from 'lucide-react';
import { LeaderboardEntry } from '../../types/gamification';
import { SupportedLanguage } from '../../types/curriculumEngine';

interface ClassLeaderboardCardProps {
  entries: LeaderboardEntry[];
  language: SupportedLanguage;
  optOut: boolean;
  onToggleOptOut: (optOut: boolean) => void;
}

export const ClassLeaderboardCard: React.FC<ClassLeaderboardCardProps> = ({
  entries,
  language,
  optOut,
  onToggleOptOut,
}) => {
  const [showExplanation, setShowExplanation] = useState(false);

  return (
    <div
      id="gamification-classroom-board"
      className="bg-[#FAF6EC] border-[1.5px] border-[#38332D] rounded-xl p-4 sm:p-5 shadow-sm mb-5"
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#E3DAC4]">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-indigo-100 border border-indigo-300 flex items-center justify-center text-indigo-800">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base font-serif-ethiopic text-[#1E1B18]">
                {language === 'am'
                  ? 'የጥናት ቡድን ሰሌዳ (Privacy-Safe Study Board)'
                  : language === 'om'
                  ? 'Garee Qorannoo'
                  : language === 'ti'
                  ? 'ናይ መጽናዕቲ ጉጅለ'
                  : 'Privacy-Safe Study Board'}
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold flex items-center gap-1">
                <Shield className="w-3 h-3" />
                {language === 'am' ? 'የግል መረጃ ሚስጥራዊ' : 'Anonymous Aliases'}
              </span>
            </div>
            <p className="text-xs text-[#7A705E]">
              {language === 'am'
                ? 'የተማሪዎች ስም እና የግል መረጃ አይደበላለቅም፤ በምስጢራዊ ኮድ ስሞች ብቻ የጋራ ጥረትን ያበረታታል'
                : 'No public names, emails, or phone numbers. Uses anonymized aliases to promote positive habits.'}
            </p>
          </div>
        </div>

        {/* Privacy Opt-Out Toggle Button */}
        <button
          onClick={() => onToggleOptOut(!optOut)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
            optOut
              ? 'bg-[#E3DAC4] text-[#5A5143] border-[#DDD3BF]'
              : 'bg-emerald-50 text-emerald-900 border-emerald-300 hover:bg-emerald-100'
          }`}
        >
          {optOut ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          <span>
            {optOut
              ? language === 'am'
                ? 'ከቦርዱ ተገልለዋል (Opted Out)'
                : 'Opted Out of Board'
              : language === 'am'
              ? 'በቦርዱ ላይ ይሳተፉ (Active)'
              : 'Participating in Board'}
          </span>
        </button>
      </div>

      {optOut ? (
        <div className="my-6 p-4 rounded-xl border border-dashed border-[#DDD3BF] text-center text-xs text-[#7A705E] bg-[#F2ECE0]">
          <EyeOff className="w-8 h-8 mx-auto text-[#9B8F7C] mb-2" />
          <p className="font-bold text-[#38332D]">
            {language === 'am'
              ? 'የጥናት ቦርድ ተሳትፎን አቋርጠዋል'
              : 'You have opted out of the classroom study board.'}
          </p>
          <p className="mt-1 max-w-md mx-auto">
            {language === 'am'
              ? 'የእርስዎ ስምና ውጤት ለማንም አይታይም። በማንኛውም ሰዓት መልሰው መሳተፍ ይችላሉ።'
              : 'Your progress remains completely private and will not appear to peers. You can rejoin at any time.'}
          </p>
        </div>
      ) : (
        /* Board Entries Table */
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#DDD3BF] text-[#7A705E]">
                <th className="pb-2 font-bold">{language === 'am' ? 'ደረጃ' : 'Rank'}</th>
                <th className="pb-2 font-bold">{language === 'am' ? 'የተማሪ ኮድ' : 'Scholar Alias'}</th>
                <th className="pb-2 font-bold">{language === 'am' ? 'የትምህርት ደረጃ' : 'Level'}</th>
                <th className="pb-2 font-bold text-center">{language === 'am' ? 'ተከታታይ ቀናት' : 'Streak'}</th>
                <th className="pb-2 font-bold text-right">{language === 'am' ? 'የሳምንቱ ጥረት' : 'Weekly XP'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAE2D0]">
              {entries.map((entry) => (
                <tr
                  key={entry.id}
                  className={`transition-colors ${
                    entry.isCurrentUser
                      ? 'bg-amber-100/60 font-bold text-[#1E1B18]'
                      : 'hover:bg-[#F2ECE0] text-[#38332D]'
                  }`}
                >
                  <td className="py-2.5 pr-2">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                        entry.rank === 1
                          ? 'bg-amber-400 text-amber-950 shadow-xs'
                          : entry.rank === 2
                          ? 'bg-slate-300 text-slate-800'
                          : entry.rank === 3
                          ? 'bg-amber-600 text-white'
                          : 'bg-[#E3DAC4] text-[#5A5143]'
                      }`}
                    >
                      {entry.rank}
                    </span>
                  </td>
                  <td className="py-2.5 pr-2">
                    <span className="font-mono text-xs">{entry.alias}</span>
                    {entry.isCurrentUser && (
                      <span className="ml-2 text-[10px] bg-amber-200 text-amber-900 border border-amber-400 px-1.5 py-0.2 rounded font-bold">
                        {language === 'am' ? 'እርስዎ' : 'You'}
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 pr-2">
                    <span className="text-[#5A5143]">
                      Lvl {entry.level} ({entry.levelTitle})
                    </span>
                  </td>
                  <td className="py-2.5 pr-2 text-center">
                    <span className="inline-flex items-center gap-1 font-bold text-orange-700">
                      <Flame className="w-3.5 h-3.5 fill-orange-400 text-orange-500" />
                      {entry.streakDays}d
                    </span>
                  </td>
                  <td className="py-2.5 text-right font-black text-amber-900">
                    <span className="inline-flex items-center gap-0.5">
                      <Zap className="w-3 h-3 text-amber-600 fill-amber-500" />
                      {entry.weeklyXp.toLocaleString()} XP
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
