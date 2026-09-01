import React from 'react';
import { Topic, Subject, ActiveTab } from '../types';
import { BookOpen, CheckCircle2, ArrowRight, ArrowLeft, Layers, HelpCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface LessonViewProps {
  topic: Topic;
  subject: Subject;
  onChangeTab: (tab: ActiveTab) => void;
}

export const LessonView: React.FC<LessonViewProps> = ({
  topic,
  subject,
  onChangeTab,
}) => {
  const { t, isRtl } = useLanguage();

  return (
    <div id="lesson-view-container" className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-4xl">
      {/* Lesson Header Banner */}
      <div
        id="lesson-header-box"
        className="p-4 sm:p-5 border-[1.5px] border-[#38332D] bg-[#FAF6EC] relative"
        style={{
          borderLeftWidth: !isRtl ? '6px' : undefined,
          borderLeftColor: !isRtl ? subject.accentColor : undefined,
          borderRightWidth: isRtl ? '6px' : undefined,
          borderRightColor: isRtl ? subject.accentColor : undefined,
        }}
      >
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span
            className="text-xs font-bold px-2 py-0.5 border"
            style={{
              backgroundColor: subject.accentLight,
              color: subject.accentColor,
              borderColor: subject.accentBorder,
            }}
          >
            {subject.name} • {t.gradeTierPrefix} {topic.gradeTier}
          </span>
          <span className="text-xs text-[#7A705E]">
            {t.lessonExplanationBanner}
          </span>
        </div>

        <h2
          id="lesson-title"
          className="font-serif-ethiopic text-xl sm:text-2xl font-bold text-[#1E1B18] tracking-tight leading-snug"
        >
          {topic.lessonTitle}
        </h2>
      </div>

      {/* Main Lesson Body */}
      <article
        id="lesson-article"
        className="border-[1.5px] border-[#38332D] bg-[#FAF6EC] p-5 sm:p-7 space-y-4 shadow-xs"
      >
        <div className="flex items-center gap-2 pb-3 border-b border-[#38332D]/20 text-[#5A5143] text-xs font-bold uppercase tracking-wider">
          <BookOpen className="w-4 h-4" style={{ color: subject.accentColor }} />
          {t.lessonContentTitle}
        </div>

        <div className="space-y-3.5 text-[#24211E] text-base leading-relaxed font-normal">
          {topic.lessonContent.map((paragraph, idx) => (
            <p key={idx} className="indent-4 sm:indent-6 text-justify font-serif-ethiopic">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Key Takeaways */}
        {topic.keyPoints && topic.keyPoints.length > 0 && (
          <div
            id="lesson-keypoints-box"
            className="mt-6 p-4 border-[1.5px] border-[#38332D] bg-[#F4EEDB] space-y-2.5"
          >
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#38332D] flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              {t.keyTakeawaysTitle}
            </h3>
            <ul className="space-y-1.5 text-xs sm:text-sm text-[#38332D]">
              {topic.keyPoints.map((point, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="font-bold text-[#5A5143]">•</span>
                  <span className="font-serif-ethiopic">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </article>

      {/* Action Footer to Proceed to Flashcards or Quiz */}
      <div
        id="lesson-actions-bar"
        className="p-4 border-[1.5px] border-[#38332D] bg-[#F2ECE0] flex flex-col sm:flex-row items-center justify-between gap-3"
      >
        <div className="text-xs text-[#5A5143] text-center sm:text-left rtl:sm:text-right">
          {t.lessonFooterPrompt}
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            id="go-to-flashcards-btn"
            onClick={() => onChangeTab('flashcards')}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 border-[1.5px] border-[#38332D] bg-[#FAF6EC] hover:bg-[#EAE2CE] text-xs sm:text-sm font-bold text-[#1E1B18] transition-colors cursor-pointer"
          >
            <Layers className="w-4 h-4" />
            {t.flashcardsBtn}
          </button>
          <button
            id="go-to-quiz-btn"
            onClick={() => onChangeTab('quiz')}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 border-[1.5px] border-[#38332D] text-xs sm:text-sm font-bold text-[#FAF6EC] transition-colors cursor-pointer"
            style={{ backgroundColor: subject.accentColor }}
          >
            <HelpCircle className="w-4 h-4" />
            {t.startQuizBtn}
            {isRtl ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </div>
  );
};
