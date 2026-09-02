import React from 'react';
import { Subject, Topic } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useProgress } from '../context/ProgressContext';
import {
  CheckCircle2,
  Circle,
  Award,
  Sparkles,
  RotateCcw,
  X,
  BookOpen,
  Layers,
  HelpCircle,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';

interface CourseProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  subjects: Subject[];
  onSelectTopic: (subjectId: string, topic: Topic) => void;
  onOpenCertificate: () => void;
}

export const CourseProgressModal: React.FC<CourseProgressModalProps> = ({
  isOpen,
  onClose,
  subjects,
  onSelectTopic,
  onOpenCertificate,
}) => {
  const { t, isRtl } = useLanguage();
  const {
    getOverallProgress,
    getSubjectProgress,
    getTopicProgress,
    isTopicComplete,
    markLessonComplete,
    resetAllProgress,
  } = useProgress();

  if (!isOpen) return null;

  const overall = getOverallProgress(subjects);

  const handleReset = () => {
    if (window.confirm(t.resetConfirmMsg)) {
      resetAllProgress();
    }
  };

  return (
    <div
      id="progress-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="progress-modal-title"
    >
      <div
        id="progress-modal-card"
        className="relative w-full max-w-4xl bg-[#FAF6EC] border-[2px] border-[#38332D] shadow-2xl p-4 sm:p-6 space-y-6 my-auto text-[#1E1B18] max-h-[90vh] flex flex-col"
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b-[1.5px] border-[#38332D] pb-3 shrink-0">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1 bg-[#38332D] text-[#FAF6EC]">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </span>
              <h2
                id="progress-modal-title"
                className="font-serif-ethiopic text-lg sm:text-xl font-bold text-[#1E1B18]"
              >
                {t.completionChecklistTitle}
              </h2>
            </div>
            <p className="text-xs text-[#665C4D] font-serif-ethiopic">
              {t.completionChecklistSubtitle}
            </p>
          </div>

          <button
            id="close-progress-modal-btn"
            onClick={onClose}
            className="p-1.5 text-[#5A5143] hover:text-[#1E1B18] hover:bg-[#EDE6D4] border border-[#38332D] cursor-pointer transition-colors"
            aria-label={t.closeBtn}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Global Progress Overview Box */}
        <div className="p-4 bg-[#F2ECE0] border-[1.5px] border-[#38332D] space-y-3 shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#4A4237]">
                {t.overallProgressLabel}
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl font-mono font-extrabold text-[#1E1B18]">
                  {overall.percentage}%
                </span>
                <span className="text-xs text-[#665C4D]">
                  ({overall.completedTopics} / {overall.totalTopics} {t.coursesCompletedLabel})
                </span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                id="modal-open-certificate-btn"
                onClick={() => {
                  onClose();
                  onOpenCertificate();
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#38332D] text-[#FAF6EC] hover:bg-[#24211E] text-xs font-bold border border-[#38332D] cursor-pointer transition-colors shadow-xs"
              >
                <Award className="w-3.5 h-3.5 text-amber-300" />
                <span>{t.certificateBtn}</span>
              </button>

              <button
                id="modal-reset-progress-btn"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-[#FAF6EC] hover:bg-[#EAE2CE] text-[#7A705E] hover:text-[#1E1B18] text-xs font-medium border border-[#38332D] cursor-pointer transition-colors"
                title={t.resetProgressBtn}
              >
                <RotateCcw className="w-3 h-3" />
                <span className="hidden sm:inline">{t.resetProgressBtn}</span>
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-3 bg-[#E5DCB9] border border-[#38332D] overflow-hidden">
            <div
              className="h-full bg-[#15803D] transition-all duration-500"
              style={{ width: `${overall.percentage}%` }}
            />
          </div>

          {/* Completion Celebration or Requirement Notice */}
          {overall.isAllComplete ? (
            <div className="p-2.5 bg-emerald-100 border border-emerald-400 text-emerald-950 text-xs font-bold flex items-center gap-2 font-serif-ethiopic">
              <Sparkles className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>{t.allCoursesCompletedCelebration}</span>
            </div>
          ) : (
            <div className="text-[11px] text-[#7A705E] font-serif-ethiopic">
              ℹ️ {t.requiredToCompleteNotice}
            </div>
          )}
        </div>

        {/* Subjects & Topics Checklist List (Scrollable) */}
        <div className="overflow-y-auto space-y-4 pr-1 divide-y divide-[#38332D]/15">
          {subjects.map((subject) => {
            const subjectProgress = getSubjectProgress(subject);

            return (
              <div key={subject.id} className="pt-4 first:pt-0 space-y-3">
                {/* Subject Header */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full shrink-0 border border-black/20"
                      style={{ backgroundColor: subject.accentColor }}
                    />
                    <h3 className="font-serif-ethiopic text-sm sm:text-base font-bold text-[#1E1B18]">
                      {subject.name}
                    </h3>
                    <span className="text-xs text-[#7A705E] hidden sm:inline">
                      ({subject.subName})
                    </span>
                  </div>

                  {/* Subject Status Badge */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[#5A5143]">
                      {subjectProgress.completedTopics}/{subjectProgress.totalTopics} {t.statusCompleted}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 border ${
                        subjectProgress.isFullyComplete
                          ? 'bg-emerald-100 border-emerald-400 text-emerald-900'
                          : subjectProgress.completedTopics > 0
                          ? 'bg-amber-100 border-amber-400 text-amber-900'
                          : 'bg-[#EDE6D4] border-[#38332D] text-[#7A705E]'
                      }`}
                    >
                      {subjectProgress.isFullyComplete
                        ? t.statusCompleted
                        : subjectProgress.completedTopics > 0
                        ? t.statusInProgress
                        : t.statusNotStarted}
                    </span>
                  </div>
                </div>

                {/* Topics in this Subject */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-3 sm:pl-5 rtl:pl-0 rtl:pr-3 rtl:sm:pr-5 border-l-2 rtl:border-l-0 rtl:border-r-2 border-[#38332D]/20">
                  {subject.topics.map((topic) => {
                    const tp = getTopicProgress(topic.id);
                    const topicComplete = isTopicComplete(topic.id);

                    return (
                      <div
                        key={topic.id}
                        className={`p-3 border-[1.5px] bg-[#FAF6EC] space-y-2.5 transition-all ${
                          topicComplete
                            ? 'border-emerald-600 shadow-xs'
                            : 'border-[#38332D]'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-[10px] font-bold px-1.5 py-0.2 bg-[#EDE6D4] border border-[#38332D] text-[#4A4237] mr-1.5 rtl:mr-0 rtl:ml-1.5">
                              {t.gradeTierPrefix} {topic.gradeTier}
                            </span>
                            <span className="font-serif-ethiopic text-xs sm:text-sm font-bold text-[#1E1B18]">
                              {topic.title}
                            </span>
                          </div>

                          {topicComplete ? (
                            <span className="shrink-0 inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 border border-emerald-300">
                              <CheckCircle2 className="w-3 h-3" />
                              {t.statusCompleted}
                            </span>
                          ) : (
                            <span className="shrink-0 text-[10px] text-[#7A705E]">
                              {t.statusInProgress}
                            </span>
                          )}
                        </div>

                        {/* 3 Step Checklist: Lesson, Flashcards, Quiz */}
                        <div className="space-y-1.5 text-xs text-[#38332D] pt-1 border-t border-[#38332D]/10">
                          {/* 1. Lesson */}
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1.5">
                              <BookOpen className="w-3 h-3 text-[#7A705E]" />
                              <span className="font-serif-ethiopic">{t.tabLesson}</span>
                            </div>
                            {tp.lessonCompleted ? (
                              <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-[11px]">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                {t.lessonCompletedBadge}
                              </span>
                            ) : (
                              <button
                                onClick={() => markLessonComplete(topic.id, true)}
                                className="text-[10px] text-amber-800 bg-amber-50 hover:bg-amber-100 px-1.5 py-0.5 border border-amber-300 font-medium cursor-pointer"
                              >
                                {t.markLessonCompleteBtn}
                              </button>
                            )}
                          </div>

                          {/* 2. Flashcards */}
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1.5">
                              <Layers className="w-3 h-3 text-[#7A705E]" />
                              <span className="font-serif-ethiopic">{t.tabFlashcards}</span>
                            </div>
                            {tp.flashcardsCompleted ? (
                              <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-[11px]">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                {t.flashcardsCompletedBadge}
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[#7A705E] text-[10px]">
                                <Circle className="w-3 h-3" />
                                {t.statusNotStarted}
                              </span>
                            )}
                          </div>

                          {/* 3. Quiz */}
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1.5">
                              <HelpCircle className="w-3 h-3 text-[#7A705E]" />
                              <span className="font-serif-ethiopic">{t.tabQuiz}</span>
                            </div>
                            {tp.quizCompleted ? (
                              <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-[11px]">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                {t.quizPassedBadge} ({tp.quizScore}/{tp.quizTotal || 4})
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[#7A705E] text-[10px]">
                                <Circle className="w-3 h-3" />
                                {t.statusNotStarted}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Direct Go to Topic Button */}
                        <div className="pt-1.5 text-right rtl:text-left">
                          <button
                            onClick={() => {
                              onSelectTopic(subject.id, topic);
                              onClose();
                            }}
                            className="inline-flex items-center gap-1 text-xs font-bold text-[#1E1B18] hover:text-black transition-colors cursor-pointer"
                          >
                            <span>{t.goToTopicBtn}</span>
                            {isRtl ? <ArrowLeft className="w-3 h-3" /> : <ArrowRight className="w-3 h-3" />}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
