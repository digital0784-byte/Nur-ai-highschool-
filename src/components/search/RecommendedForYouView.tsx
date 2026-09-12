import React, { useState } from 'react';
import { CurriculumRecommendation } from '../../types/searchAndRecommendations';
import {
  Sparkles,
  Award,
  AlertTriangle,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  RefreshCw,
  HelpCircle,
  FileCheck,
  TrendingUp,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface RecommendedForYouViewProps {
  recommendations: CurriculumRecommendation[];
  onCompleteActivity: (rec: CurriculumRecommendation) => Promise<void>;
  onDismiss: (recId: string) => void;
  onRefreshRecommendations: () => void;
  onOpenContent: (rec: CurriculumRecommendation) => void;
  isGenerating: boolean;
}

export const RecommendedForYouView: React.FC<RecommendedForYouViewProps> = ({
  recommendations,
  onCompleteActivity,
  onDismiss,
  onRefreshRecommendations,
  onOpenContent,
  isGenerating,
}) => {
  const { language } = useLanguage();
  const [completingId, setCompletingId] = useState<string | null>(null);

  const activeRecs = recommendations.filter((r) => r.status !== 'dismissed');

  const handleComplete = async (rec: CurriculumRecommendation) => {
    setCompletingId(rec.id);
    try {
      await onCompleteActivity(rec);
    } finally {
      setCompletingId(null);
    }
  };

  const getTypeBadge = (type: CurriculumRecommendation['type']) => {
    switch (type) {
      case 'revision':
        return {
          label: language === 'am' ? 'የክለሳ ትምህርት (Revision)' : 'Revision',
          color: 'bg-red-50 text-red-700 border-red-200',
          icon: AlertTriangle,
        };
      case 'next_lesson':
        return {
          label: language === 'am' ? 'ቀጣይ ትምህርት (Next Lesson)' : 'Next Lesson',
          color: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          icon: BookOpen,
        };
      case 'quiz':
        return {
          label: language === 'am' ? 'የእውቀት ምዘና (Quiz Challenge)' : 'Mastery Quiz',
          color: 'bg-amber-50 text-amber-800 border-amber-200',
          icon: FileCheck,
        };
      case 'practice_questions':
        return {
          label: language === 'am' ? 'የልምምድ ጥያቄዎች (Practice)' : 'Practice Questions',
          color: 'bg-sky-50 text-sky-800 border-sky-200',
          icon: HelpCircle,
        };
      default:
        return {
          label: language === 'am' ? 'ተዛማጅ ርዕስ (Related Topic)' : 'Related Topic',
          color: 'bg-purple-50 text-purple-800 border-purple-200',
          icon: Sparkles,
        };
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-4 sm:p-6 space-y-4 shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-purple-50 text-purple-700">
            <Sparkles className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-stone-900">
                {language === 'am' ? 'ለእርስዎ የተመረጡ ጥቆማዎች (Recommended for You)' : 'Recommended for You'}
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 text-2xs font-semibold">
                AI Adaptive
              </span>
            </div>
            <p className="text-xs text-stone-500">
              {language === 'am'
                ? 'በፈተና ውጤትዎ፣ በክፍልዎ እና ባልተጠናቀቁ ክፍሎች ላይ የተመሰረተ የግል የመማር እቅድ።'
                : 'Personalized curriculum path guided by your quiz performance, weak topics, and mastery level.'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onRefreshRecommendations}
          disabled={isGenerating}
          className="px-3 py-1.5 border border-stone-200 hover:bg-stone-50 text-stone-600 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin text-purple-600' : ''}`} />
          <span>{language === 'am' ? 'ጥቆማዎችን አድስ' : 'Refresh'}</span>
        </button>
      </div>

      {/* Recommendations Cards Grid */}
      {activeRecs.length === 0 ? (
        <div className="py-8 text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-full bg-stone-100 flex items-center justify-center text-stone-400">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div className="text-xs font-semibold text-stone-700">
            {language === 'am' ? 'ሁሉም የጥቆማ ተግባራት ተጠናቀዋል!' : 'All Recommended Activities Completed!'}
          </div>
          <p className="text-2xs text-stone-500 max-w-sm mx-auto">
            {language === 'am'
              ? 'አዳዲስ ጥቆማዎችን ለማግኘት "ጥቆማዎችን አድስ" የሚለውን ይጫኑ ወይም ተጨማሪ ፈተናዎችን ይውሰዱ።'
              : 'Tap "Refresh" to diagnose your recent progress or attempt a new subject quiz.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {activeRecs.map((rec) => {
            const badge = getTypeBadge(rec.type);
            const Icon = badge.icon;
            const isDone = rec.status === 'completed';
            const isBusy = completingId === rec.id;

            return (
              <div
                key={rec.id}
                className={`rounded-xl border p-4 transition-all flex flex-col justify-between space-y-3 ${
                  isDone
                    ? 'bg-stone-50/70 border-stone-200 opacity-75'
                    : rec.priority === 'high'
                    ? 'bg-red-50/20 border-red-200 hover:border-red-300'
                    : 'bg-white border-stone-200 hover:border-emerald-300'
                }`}
              >
                <div className="space-y-2">
                  {/* Badge & XP Reward row */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`px-2 py-0.5 rounded-md border text-2xs font-semibold flex items-center gap-1 ${badge.color}`}
                      >
                        <Icon className="w-3 h-3" />
                        <span>{badge.label}</span>
                      </span>

                      {rec.priority === 'high' && (
                        <span className="px-1.5 py-0.5 rounded bg-red-100 text-red-800 text-2xs font-bold uppercase">
                          High Priority
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1 text-amber-700 font-bold text-2xs bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                      <Award className="w-3 h-3 fill-amber-500 text-amber-600" />
                      <span>+{rec.xpReward} XP</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h4
                    onClick={() => onOpenContent(rec)}
                    className="text-xs font-bold text-stone-900 hover:text-emerald-700 cursor-pointer pt-0.5"
                  >
                    {rec.title}
                  </h4>

                  {/* Diagnosis Reason */}
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {language === 'am' && rec.amharicReason ? rec.amharicReason : rec.reason}
                  </p>

                  {/* Textbook citation */}
                  <div className="flex items-center gap-2 text-2xs text-stone-400">
                    <span>Grade {rec.grade} {rec.subjectName}</span>
                    <span>• Unit {rec.unitNumber}</span>
                    {rec.textbookPage && <span>• ገጽ {rec.textbookPage}</span>}
                  </div>
                </div>

                {/* Actions row */}
                <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs">
                  {isDone ? (
                    <div className="flex items-center gap-1.5 text-emerald-700 font-semibold text-2xs">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>ተጠናቋል (+{rec.xpReward} XP Earned)</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleComplete(rec)}
                      disabled={isBusy}
                      className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-lg text-2xs shadow-xs flex items-center gap-1.5 transition-all disabled:opacity-50"
                    >
                      {isBusy ? (
                        <span className="inline-block w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <CheckCircle2 className="w-3 h-3" />
                          <span>አጠናቅቅና XP ውሰድ (Complete & Earn XP)</span>
                        </>
                      )}
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => onOpenContent(rec)}
                    className="text-stone-500 hover:text-stone-800 text-2xs font-medium flex items-center gap-1"
                  >
                    <span>ክፈት</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
