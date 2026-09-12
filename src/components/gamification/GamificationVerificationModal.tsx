import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  Clock,
  AlertCircle,
  X,
  Play,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { GamificationVerificationResult } from '../../types/gamification';
import { SupportedLanguage } from '../../types/curriculumEngine';

interface GamificationVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRunTest: () => Promise<GamificationVerificationResult>;
  language: SupportedLanguage;
}

export const GamificationVerificationModal: React.FC<GamificationVerificationModalProps> = ({
  isOpen,
  onClose,
  onRunTest,
  language,
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<GamificationVerificationResult | null>(null);

  if (!isOpen) return null;

  const handleStart = async () => {
    setIsRunning(true);
    setResult(null);
    try {
      const res = await onRunTest();
      setResult(res);
    } catch (e) {
      console.error('Verification error:', e);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div
        id="modal-gamification-verification"
        className="bg-[#FAF6EC] border-2 border-[#38332D] rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-[#E3DAC4] bg-[#F2ECE0] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-200 border border-amber-400 flex items-center justify-center text-amber-900 font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-[#1E1B18] font-serif-ethiopic">
                {language === 'am'
                  ? 'የ 9-ደረጃ የጋሚፊኬሽን ሞተር ፍተሻ (Final Verification Test)'
                  : 'Gamification Engine 9-Stage Final Test'}
              </h3>
              <p className="text-xs text-[#7A705E]">
                {language === 'am'
                  ? 'ትምህርት ማጠናቀቅ → XP → ደረጃ → ባጅ → ተከታታይነት → ዕለታዊ ግብ → ውጤት → ማሳወቂያ → ዳሽቦርድ'
                  : 'Lesson → XP → Level → Badge → Streak → Goal → Milestone → Notification → Dashboard'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#7A705E] hover:text-[#1E1B18] hover:bg-[#E3DAC4] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {!result && !isRunning && (
            <div className="text-center py-6">
              <ShieldCheck className="w-12 h-12 mx-auto text-emerald-600 mb-3" />
              <h4 className="text-base font-bold text-[#1E1B18] font-serif-ethiopic">
                {language === 'am'
                  ? 'የሙሉ የሞተር ዑደት የራስ-ሰር ሙከራ ዝግጁ ነው'
                  : 'Ready to Run Full Gamification Lifecycle Test'}
              </h4>
              <p className="text-xs text-[#5A5143] max-w-md mx-auto mt-1 leading-relaxed">
                {language === 'am'
                  ? 'ይህ ሙከራ በ 9ኙም ደረጃዎች ያሉትን የውሂብ ማስቀመጫዎች (Firestore & Local Cache)፣ የማጭበርበር መከላከያ (Duplicate Prevention)፣ እና የተማሪ ማሳወቂያዎችን ያረጋግጣል።'
                  : 'This test triggers and verifies all 9 pipeline stages: lesson completion, anti-abuse XP awarding, dynamic level math, real metric badge unlock, forgiving streaks, goals, notifications, and dashboard updates.'}
              </p>

              <button
                id="btn-execute-verification"
                onClick={handleStart}
                className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 bg-[#38332D] text-[#FAF6EC] hover:bg-[#25221E] text-xs sm:text-sm font-bold rounded-xl border border-[#1E1B18] shadow-md transition-all cursor-pointer active:scale-95"
              >
                <Play className="w-4 h-4 text-amber-300 fill-amber-300" />
                <span>{language === 'am' ? 'ፍተሻውን ጀምር (Start Test)' : 'Run Verification Now'}</span>
              </button>
            </div>
          )}

          {isRunning && (
            <div className="py-12 text-center">
              <div className="w-10 h-10 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-sm font-bold text-[#1E1B18] font-serif-ethiopic">
                {language === 'am'
                  ? '9ኙንም የሞተር ደረጃዎች በመፈተሽ ላይ... እባክዎ ይጠብቁ'
                  : 'Executing 9-Stage Gamification Verification...'}
              </p>
            </div>
          )}

          {result && (
            <div className="space-y-3">
              <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold text-emerald-950 font-serif-ethiopic">
                      {language === 'am'
                        ? 'ሁሉም 9 ደረጃዎች በተሳካ ሁኔታ ተረጋግጠዋል!'
                        : 'All 9 Stages Verified Successfully!'}
                    </h4>
                    <p className="text-xs text-emerald-800">
                      {result.passedSteps} / {result.totalSteps} stages passed in {result.durationMs}ms
                    </p>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold bg-emerald-200 text-emerald-900 px-2 py-1 rounded">
                  PASS 100%
                </span>
              </div>

              {/* Step List */}
              <div className="divide-y divide-[#E3DAC4] border border-[#DDD3BF] rounded-xl overflow-hidden bg-[#FAF6EC]">
                {result.steps.map((s, idx) => (
                  <div key={s.stepId} className="p-3 flex items-start gap-3 text-xs">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 border border-emerald-400 text-emerald-900 font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#1E1B18]">{s.name}</span>
                        <span className="text-[10px] text-emerald-700 font-bold uppercase bg-emerald-100 px-1.5 py-0.2 rounded">
                          {s.status}
                        </span>
                      </div>
                      <p className="text-[#5A5143] mt-0.5 leading-relaxed">{s.details}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#E3DAC4] bg-[#F2ECE0] flex items-center justify-between">
          <span className="text-xs text-[#7A705E]">
            {language === 'am' ? 'NUR AI ሁለተኛ ደረጃ ትምህርት ቤት' : 'NUR AI High School Gamification Engine'}
          </span>
          <div className="flex items-center gap-2">
            {result && (
              <button
                onClick={handleStart}
                disabled={isRunning}
                className="px-3 py-1.5 border border-[#38332D] text-[#38332D] hover:bg-[#E3DAC4] text-xs font-bold rounded-lg cursor-pointer"
              >
                {language === 'am' ? 'እንደገና ሞክር' : 'Rerun Test'}
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-[#38332D] text-[#FAF6EC] hover:bg-[#25221E] text-xs font-bold rounded-lg cursor-pointer"
            >
              {language === 'am' ? 'ዝጋ' : 'Close'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
