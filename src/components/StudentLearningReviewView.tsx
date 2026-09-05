import React, { useEffect, useState } from 'react';
import { Subject, Grade, StudentWeakArea } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useProgress } from '../context/ProgressContext';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  RefreshCw,
  Award,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Bot,
  BookOpen,
  TrendingUp,
  Brain,
  Layers,
  HelpCircle,
  Clock,
  ChevronRight,
} from 'lucide-react';

interface StudentLearningReviewViewProps {
  subject: Subject;
  grade: Grade;
  onOpenAITutor: (chapterTitle: string, mode?: 'analysis' | 'chat') => void;
  onGoToVisualLearning?: () => void;
  onGoToTopic?: (topicId: string) => void;
}

export const StudentLearningReviewView: React.FC<StudentLearningReviewViewProps> = ({
  subject,
  grade,
  onOpenAITutor,
  onGoToVisualLearning,
  onGoToTopic,
}) => {
  const { t, language } = useLanguage();
  const { userProfile, user } = useAuth();
  const { studentReview, isLoadingReview, refreshReview, progressMap } = useProgress();
  const [isRefreshingManual, setIsRefreshingManual] = useState<boolean>(false);

  // Auto-fetch initial review if not present
  useEffect(() => {
    if (!studentReview && !isLoadingReview) {
      refreshReview(false);
    }
  }, [studentReview, isLoadingReview, refreshReview]);

  const handleManualRefresh = async () => {
    setIsRefreshingManual(true);
    await refreshReview(true);
    setIsRefreshingManual(false);
  };

  const studentName = userProfile?.displayName || user?.displayName || 'ተማሪ';

  return (
    <div id="student-learning-review-container" className="p-3 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      {/* Top Banner & Header */}
      <div
        id="review-header-card"
        className="bg-[#EDE6D4] border-[1.5px] border-[#38332D] rounded-xl p-4 sm:p-6 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        style={{ borderLeftColor: subject.accentColor, borderLeftWidth: '6px' }}
      >
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-900 border border-amber-400 text-[11px] font-sans font-black tracking-wide uppercase flex items-center gap-1">
              <Bot className="w-3.5 h-3.5 text-amber-800" />
              AI Personal Teacher
            </span>
            <span className="text-xs text-[#5A5143] font-serif-ethiopic">
              {grade}ኛ ክፍል • {subject.name}
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-bold font-serif-ethiopic text-[#1E1B18] flex items-center gap-2">
            <span>የእኔ የመማሪያ ግምገማ (My Learning Review)</span>
          </h1>

          <p className="text-xs sm:text-sm text-[#474036] font-serif-ethiopic max-w-2xl leading-relaxed">
            የግል AI አስተማሪህ የሰራሃቸውን ኩዊዞች፣ ያጠናሃቸውን ፍላሽካርዶች እና የተመለከትካቸውን ትምህርቶች በጥልቀት በመገምገም ያዘጋጀው የግል መመሪያ።
          </p>
        </div>

        {/* Refresh button & Last Updated */}
        <div className="flex flex-col items-start md:items-end gap-2 shrink-0">
          <button
            id="refresh-review-btn"
            onClick={handleManualRefresh}
            disabled={isLoadingReview || isRefreshingManual}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1E1B18] text-[#FAF6EC] hover:bg-[#38332D] active:scale-98 transition-all text-xs font-bold shadow-xs cursor-pointer disabled:opacity-50"
          >
            <RefreshCw
              className={`w-4 h-4 ${isLoadingReview || isRefreshingManual ? 'animate-spin text-amber-400' : ''}`}
            />
            <span className="font-serif-ethiopic">
              {isLoadingReview || isRefreshingManual ? 'ትንተና በማካሄድ ላይ...' : 'ግምገማ አድስ (Refresh Review)'}
            </span>
          </button>

          {studentReview?.generatedAt && (
            <div className="text-[11px] text-[#665C4D] flex items-center gap-1 font-sans">
              <Clock className="w-3 h-3" />
              <span>የመጨረሻ ግምገማ: {new Date(studentReview.generatedAt).toLocaleDateString()} {new Date(studentReview.generatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Review Status Card */}
      {studentReview ? (
        <div className="space-y-6">
          {/* Master Grade & Encouragement Hero Box */}
          <div
            id="review-mastery-card"
            className="bg-[#FAF6EC] border-[1.5px] border-[#38332D] rounded-xl p-4 sm:p-6 shadow-sm flex flex-col lg:flex-row items-stretch gap-6"
          >
            {/* Left Grade Meter */}
            <div className="lg:w-1/3 bg-[#EDE6D4]/70 border border-[#38332D]/30 rounded-xl p-5 flex flex-col items-center justify-center text-center">
              <span className="text-xs uppercase tracking-wider font-bold text-[#5A5143] font-sans">
                አጠቃላይ የዕውቀት ብቃት (Mastery Level)
              </span>

              <div className="relative my-3 flex items-center justify-center">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-[#38332D] bg-[#FAF6EC] flex flex-col items-center justify-center shadow-xs">
                  <span className="text-3xl sm:text-4xl font-black font-sans text-[#1E1B18]">
                    {studentReview.masteryPercentage}%
                  </span>
                  <span className="text-[11px] font-bold uppercase tracking-widest text-[#5A5143]">
                    ደረጃ {studentReview.overallGradeLetter}
                  </span>
                </div>
              </div>

              <div className="w-full bg-[#DCD2BB] h-2.5 rounded-full overflow-hidden border border-[#38332D]/30 mt-1">
                <div
                  className="h-full transition-all duration-700 rounded-full"
                  style={{
                    width: `${studentReview.masteryPercentage}%`,
                    backgroundColor: subject.accentColor,
                  }}
                />
              </div>

              <p className="text-[11px] text-[#5A5143] mt-2 font-serif-ethiopic">
                በአዲሱ የኢትዮጵያ ስርዓተ-ትምህርት መመዘኛ መስፈርት
              </p>
            </div>

            {/* Right: Personal Encouragement & Summary */}
            <div className="lg:w-2/3 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-amber-800">
                  <Sparkles className="w-5 h-5 fill-amber-300" />
                  <h3 className="font-bold text-sm sm:text-base text-[#1E1B18] font-serif-ethiopic">
                    የግል AI አስተማሪህ ማስታወሻ (Teacher's Message to {studentName})
                  </h3>
                </div>

                <div className="bg-[#EDE6D4] border border-[#38332D]/40 rounded-xl p-4 text-xs sm:text-sm font-serif-ethiopic leading-relaxed text-[#1E1B18] shadow-2xs">
                  “{studentReview.encouragement}”
                </div>

                <p className="text-xs text-[#5A5143] font-serif-ethiopic leading-relaxed">
                  {studentReview.summaryText}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 pt-2 border-t border-[#38332D]/20">
                <button
                  id="open-tutor-from-review-btn"
                  onClick={() => onOpenAITutor(subject.name, 'chat')}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-100 text-amber-950 border border-amber-400 hover:bg-amber-200 transition-colors text-xs font-bold font-serif-ethiopic cursor-pointer shadow-2xs"
                >
                  <Bot className="w-4 h-4 text-amber-800" />
                  <span>ከአስተማሪው ጋር ተወያይ (Chat with Tutor)</span>
                </button>

                {onGoToVisualLearning && (
                  <button
                    onClick={onGoToVisualLearning}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#EDE6D4] text-[#1E1B18] border border-[#38332D]/40 hover:bg-[#E3DAC4] transition-colors text-xs font-bold font-serif-ethiopic cursor-pointer shadow-2xs"
                  >
                    <TrendingUp className="w-4 h-4 text-rose-700" />
                    <span>በምስላዊ ግራፍ እና ማስመሰያ ተመልከት (Visual Learning)</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Two-Column Grid: Strengths & Weak Areas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Column 1: Mastered Strengths */}
            <div
              id="review-strengths-card"
              className="bg-[#FAF6EC] border-[1.5px] border-[#38332D] rounded-xl p-4 sm:p-5 shadow-sm space-y-4"
            >
              <div className="flex items-center justify-between border-b border-[#38332D]/20 pb-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 border border-emerald-400 text-emerald-800 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <h2 className="font-bold text-sm sm:text-base font-serif-ethiopic text-[#1E1B18]">
                    ያሳዩት ጥንካሬ እና የተካኑባቸው ርዕሶች (Strengths)
                  </h2>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-bold">
                  {studentReview.strengths?.length || 0}
                </span>
              </div>

              <ul className="space-y-2.5">
                {studentReview.strengths && studentReview.strengths.length > 0 ? (
                  studentReview.strengths.map((str, idx) => (
                    <li
                      key={idx}
                      className="p-3 bg-[#EDE6D4]/50 border border-[#38332D]/30 rounded-lg flex items-start gap-2.5 text-xs sm:text-sm font-serif-ethiopic text-[#1E1B18]"
                    >
                      <span className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center shrink-0 text-[10px] font-sans font-bold mt-0.5">
                        ✓
                      </span>
                      <span>{str}</span>
                    </li>
                  ))
                ) : (
                  <p className="text-xs text-[#665C4D] font-serif-ethiopic py-3 text-center">
                    ተጨማሪ ጥያቄዎችን ሲሰሩ ያካበቷቸው ጥንካሬዎች እዚህ ይሰበሰባሉ።
                  </p>
                )}
              </ul>
            </div>

            {/* Column 2: Weak Areas & Diagnostic Misconceptions */}
            <div
              id="review-weak-areas-card"
              className="bg-[#FAF6EC] border-[1.5px] border-[#38332D] rounded-xl p-4 sm:p-5 shadow-sm space-y-4"
            >
              <div className="flex items-center justify-between border-b border-[#38332D]/20 pb-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-rose-100 border border-rose-400 text-rose-800 flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <h2 className="font-bold text-sm sm:text-base font-serif-ethiopic text-[#1E1B18]">
                    ትኩረት የሚሹ ክፍተቶች (Diagnostic Weak Areas)
                  </h2>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full bg-rose-100 text-rose-900 font-bold">
                  {studentReview.weakAreas?.length || 0}
                </span>
              </div>

              <div className="space-y-3">
                {studentReview.weakAreas && studentReview.weakAreas.length > 0 ? (
                  studentReview.weakAreas.map((weak, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 bg-rose-50/60 border border-rose-300 rounded-xl space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#1E1B18] font-serif-ethiopic text-sm">
                          {weak.topicTitle}
                        </span>
                        {weak.scoreSummary && (
                          <span className="px-2 py-0.5 rounded-full bg-rose-200 text-rose-900 font-sans font-bold text-[10px]">
                            {weak.scoreSummary}
                          </span>
                        )}
                      </div>

                      {/* Conceptual Root Cause (Inferred from wrong answers) */}
                      <div className="space-y-1">
                        <div className="text-[11px] font-bold text-rose-900 uppercase tracking-wide flex items-center gap-1 font-sans">
                          <span>⚠️ የተለየው የፅንሰ-ሀሳብ ክፍተት (Root Concept):</span>
                        </div>
                        <p className="text-xs text-[#2A241F] font-serif-ethiopic leading-relaxed">
                          {weak.missingConcept}
                        </p>
                      </div>

                      {/* Remedy */}
                      {weak.remedy && (
                        <div className="pt-1.5 border-t border-rose-200 text-[11px] text-[#4A4035] font-serif-ethiopic flex items-start gap-1.5">
                          <span className="font-bold text-amber-800 shrink-0">💡 መፍትሔ፡</span>
                          <span>{weak.remedy}</span>
                        </div>
                      )}

                      {/* Action Trigger to tutor */}
                      <div className="pt-2 flex items-center justify-end gap-2">
                        <button
                          onClick={() => onOpenAITutor(weak.topicTitle, 'chat')}
                          className="text-[11px] px-2.5 py-1 rounded-lg bg-[#1E1B18] text-[#FAF6EC] hover:bg-[#38332D] font-serif-ethiopic font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Bot className="w-3 h-3 text-amber-400" />
                          <span>ይህንን ርዕስ ከአስተማሪው ጋር ተለማመድ</span>
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-emerald-800 font-serif-ethiopic py-3 text-center bg-emerald-50 rounded-lg border border-emerald-200">
                    ድንቅ ስራ! በአሁኑ ሰዓት ያልተፈታ አሳሳቢ የትምህርት ክፍተት አልተገኘም።
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Next Steps: Ordered Roadmap */}
          <div
            id="review-next-steps-card"
            className="bg-[#FAF6EC] border-[1.5px] border-[#38332D] rounded-xl p-4 sm:p-6 shadow-sm space-y-4"
          >
            <div className="flex items-center gap-2 border-b border-[#38332D]/20 pb-3">
              <div className="w-7 h-7 rounded-lg bg-indigo-100 border border-indigo-400 text-indigo-800 flex items-center justify-center">
                <ArrowRight className="w-4 h-4" />
              </div>
              <h2 className="font-bold text-sm sm:text-base font-serif-ethiopic text-[#1E1B18]">
                ቀጣይ የሚመከሩ የትምህርት እርምጃዎች (Personalized Study Roadmap)
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              {studentReview.nextSteps && studentReview.nextSteps.length > 0 ? (
                studentReview.nextSteps.map((step) => (
                  <div
                    key={step.stepNumber}
                    className="p-4 bg-[#EDE6D4] border border-[#38332D]/30 rounded-xl space-y-2 flex flex-col justify-between"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="w-6 h-6 rounded-full bg-[#1E1B18] text-[#FAF6EC] font-sans font-black text-xs flex items-center justify-center">
                          {step.stepNumber}
                        </span>
                        <span className="text-[10px] uppercase font-bold text-[#5A5143] tracking-wide">
                          እርምጃ {step.stepNumber}
                        </span>
                      </div>

                      <h4 className="font-bold text-xs sm:text-sm font-serif-ethiopic text-[#1E1B18]">
                        {step.title}
                      </h4>

                      <p className="text-xs text-[#3D352B] font-serif-ethiopic leading-relaxed">
                        {step.action}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-[#38332D]/20 text-[11px] text-[#665C4D] font-serif-ethiopic">
                      <span className="font-bold text-[#1E1B18]">ምክንያት፡</span> {step.reason}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-[#5A5143] font-serif-ethiopic">
                  የቀጣይ እርምጃዎች መመሪያ በማዘጋጀት ላይ ነው።
                </p>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Loading or Empty State */
        <div className="bg-[#FAF6EC] border-[1.5px] border-[#38332D] rounded-xl p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-amber-100 border-2 border-[#38332D] text-amber-800 mx-auto flex items-center justify-center animate-pulse">
            <Brain className="w-8 h-8 text-amber-800" />
          </div>

          <div className="space-y-1">
            <h3 className="text-lg font-bold font-serif-ethiopic text-[#1E1B18]">
              {isLoadingReview ? 'የመማር ሂደቱን በAI በመተንተን ላይ...' : 'የግል መማሪያ ግምገማ ለማግኘት ዝግጁ ነው'}
            </h3>
            <p className="text-xs text-[#5A5143] font-serif-ethiopic max-w-md mx-auto">
              ኩዊዞችን መስራትዎን እና ትምህርቶችን ማጠናቀቅዎን መሰረት በማድረግ የግል AI አስተማሪው አጠቃላይ ትንተና ያዘጋጅልዎታል።
            </p>
          </div>

          <button
            onClick={handleManualRefresh}
            disabled={isLoadingReview}
            className="px-5 py-2.5 rounded-xl bg-[#1E1B18] text-[#FAF6EC] hover:bg-[#38332D] font-bold text-xs font-serif-ethiopic cursor-pointer inline-flex items-center gap-2 shadow-xs"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>አሁን ግምገማ ጀምር (Generate Review)</span>
          </button>
        </div>
      )}
    </div>
  );
};
