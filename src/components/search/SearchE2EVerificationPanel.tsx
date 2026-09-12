import React, { useState } from 'react';
import {
  E2ESearchVerificationStage,
} from '../../types/searchAndRecommendations';
import { searchAndRecommendationService } from '../../services/searchAndRecommendationService';
import {
  Play,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  ShieldCheck,
  RefreshCw,
  Award,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface SearchE2EVerificationPanelProps {
  userId: string;
  onRefreshData?: () => void;
}

export const SearchE2EVerificationPanel: React.FC<SearchE2EVerificationPanelProps> = ({
  userId,
  onRefreshData,
}) => {
  const { language } = useLanguage();
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [stages, setStages] = useState<E2ESearchVerificationStage[]>([]);
  const [lastResult, setLastResult] = useState<{
    success: boolean;
    durationMs: number;
    passedStages: number;
    totalStages: number;
  } | null>(null);

  const runSuite = async () => {
    setIsRunning(true);
    setLastResult(null);

    const result = await searchAndRecommendationService.runE2EVerificationSuite(
      userId,
      (updatedStages) => {
        setStages(updatedStages);
      }
    );

    setIsRunning(false);
    setLastResult({
      success: result.success,
      durationMs: result.durationMs,
      passedStages: result.passedStages,
      totalStages: result.totalStages,
    });

    if (onRefreshData) {
      onRefreshData();
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-4 sm:p-6 space-y-4 shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-50 text-emerald-800">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-stone-900">
                {language === 'am'
                  ? 'የ10-ደረጃ ሥርዓተ-ትምህርት ፍለጋ እና የጥቆማ ሙከራ (E2E Verification Suite)'
                  : '10-Stage Search & Recommendation Lifecycle Verification'}
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-2xs font-semibold">
                E2E Automation
              </span>
            </div>
            <p className="text-xs text-stone-500">
              {language === 'am'
                ? 'የፍለጋ፣ የማጣሪያ፣ የዕልባት፣ የደካማ ነጥብ ምርመራ፣ የጥቆማ አሰጣጥ እና የXP ሽልማት ሙሉ ሰንሰለት ማረጋገጫ።'
                : 'Automated test of: Search → Filter → Bookmark → Weak Area Simulation → Recommendation → XP Award.'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={runSuite}
          disabled={isRunning}
          className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-xl text-xs shadow-xs flex items-center gap-2 transition-all disabled:opacity-50 whitespace-nowrap"
        >
          {isRunning ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>የሙከራ ሂደቱ እየተካሄደ ነው...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              <span>ሙሉ የ10-ደረጃ ሙከራ አስጀምር (Run E2E Test)</span>
            </>
          )}
        </button>
      </div>

      {/* Test Results Summary Banner */}
      {lastResult && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between gap-4 ${
            lastResult.success
              ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950'
              : 'bg-red-50 border-red-300 text-red-950'
          }`}
        >
          <div className="flex items-center gap-3">
            {lastResult.success ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-700 flex-shrink-0" />
            ) : (
              <XCircle className="w-6 h-6 text-red-700 flex-shrink-0" />
            )}
            <div>
              <div className="font-bold text-xs sm:text-sm">
                {lastResult.success
                  ? 'ሁሉም የ10-ደረጃ የፍለጋ እና የጥቆማ ፈተናዎች በተሳካ ሁኔታ አልፈዋል! (10/10 Stages PASSED)'
                  : 'የሙከራ ሂደቱ ላይ ስህተት ተከስቷል'}
              </div>
              <p className="text-2xs opacity-80 mt-0.5">
                የተጠናቀቀበት ጊዜ፡ {lastResult.durationMs}ms | የተረጋገጡ ደረጃዎች፡{' '}
                {lastResult.passedStages} ከ {lastResult.totalStages}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 font-bold text-xs bg-white/80 px-3 py-1.5 rounded-lg border border-emerald-300">
            <Award className="w-4 h-4 text-amber-600" />
            <span>+35 Verified XP Added</span>
          </div>
        </div>
      )}

      {/* Stages Checklist */}
      {stages.length > 0 ? (
        <div className="space-y-2 pt-2">
          {stages.map((st, idx) => (
            <div
              key={st.id}
              className={`p-3 rounded-xl border flex items-start gap-3 transition-all text-xs ${
                st.status === 'passed'
                  ? 'bg-emerald-50/30 border-emerald-200'
                  : st.status === 'running'
                  ? 'bg-purple-50/40 border-purple-300 ring-1 ring-purple-300'
                  : st.status === 'failed'
                  ? 'bg-red-50 border-red-300'
                  : 'bg-stone-50 border-stone-200 opacity-60'
              }`}
            >
              <div className="pt-0.5 flex-shrink-0">
                {st.status === 'passed' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : st.status === 'running' ? (
                  <RefreshCw className="w-4 h-4 text-purple-600 animate-spin" />
                ) : st.status === 'failed' ? (
                  <XCircle className="w-4 h-4 text-red-600" />
                ) : (
                  <Clock className="w-4 h-4 text-stone-400" />
                )}
              </div>

              <div className="flex-1 space-y-0.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-stone-800">
                    {st.id}: {st.name}
                  </span>
                  {st.latencyMs !== undefined && (
                    <span className="text-2xs text-stone-400 font-mono">
                      {st.latencyMs}ms
                    </span>
                  )}
                </div>
                <p className="text-2xs text-stone-600">{st.details}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-6 bg-stone-50 rounded-xl text-center text-xs text-stone-500">
          የፍለጋ፣ የዕልባት እና የጥቆማ ሞተሩን አሰራር ከላይ ያለውን "ሙሉ የ10-ደረጃ ሙከራ አስጀምር" ቁልፍ በመጫን ያረጋግጡ።
        </div>
      )}
    </div>
  );
};
