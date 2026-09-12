import React, { useState } from 'react';
import { Topic, Subject, ActiveTab } from '../types';
import { BookOpen, CheckCircle2, ArrowRight, ArrowLeft, Layers, HelpCircle, Target, FlaskConical, Sparkles, Compass, Briefcase, Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useProgress } from '../context/ProgressContext';
import { RealLifeConnectionModal } from './career/RealLifeConnectionModal';
import { careerConnectionEngine } from '../engine/careerConnectionEngine';

interface LessonViewProps {
  topic: Topic;
  subject: Subject;
  onChangeTab: (tab: ActiveTab) => void;
  onOpenAITutor?: (chapterTitle: string, mode: 'analysis' | 'chat') => void;
}

export const LessonView: React.FC<LessonViewProps> = ({
  topic,
  subject,
  onChangeTab,
  onOpenAITutor,
}) => {
  const { t, isRtl, language } = useLanguage();
  const { getTopicProgress, markLessonComplete } = useProgress();
  const [isPurposeModalOpen, setIsPurposeModalOpen] = useState(false);

  const progress = getTopicProgress(topic.id);
  const isLessonDone = progress.lessonCompleted;

  const handleToggleLessonComplete = () => {
    markLessonComplete(topic.id, !isLessonDone);
  };

  const isAmharic = language === 'am';
  const quickConn = careerConnectionEngine.getTopicRealLifeConnection(subject.id, topic.id, topic.lessonTitle);

  // Helper for stream name
  const streamLabel =
    subject.stream === 'natural'
      ? t.streamNatural
      : subject.stream === 'social'
      ? t.streamSocial
      : t.streamCommon;

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
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <div className="flex flex-wrap items-center gap-2">
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

            {/* Stream badge */}
            <span className="text-[11px] font-semibold px-2 py-0.5 bg-[#EDE5D2] border border-[#38332D]/30 text-[#4A4237] flex items-center gap-1">
              <Compass className="w-3 h-3" />
              {streamLabel}
            </span>

            {/* Curriculum standard badge */}
            <span className="text-[11px] font-bold px-2 py-0.5 bg-amber-100 border border-amber-400 text-amber-900 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-600" />
              {t.newCurriculumTag}
            </span>
          </div>

          {/* Lesson Completion Status Pill */}
          <button
            id="toggle-lesson-complete-top-btn"
            onClick={handleToggleLessonComplete}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold border transition-colors cursor-pointer ${
              isLessonDone
                ? 'bg-emerald-100 border-emerald-500 text-emerald-950'
                : 'bg-[#EDE5D2] hover:bg-[#E2D6BE] border-[#38332D] text-[#4A4237]'
            }`}
          >
            <CheckCircle2 className={`w-3.5 h-3.5 ${isLessonDone ? 'text-emerald-700' : 'text-[#7A705E]'}`} />
            <span>{isLessonDone ? t.lessonCompletedBadge : t.markLessonCompleteBtn}</span>
          </button>
        </div>

        <h2
          id="lesson-title"
          className="font-serif-ethiopic text-xl sm:text-2xl font-bold text-[#1E1B18] tracking-tight leading-snug"
        >
          {topic.lessonTitle}
        </h2>

        {/* AI & Interactive Learning Quick Actions */}
        <div className="pt-3 flex flex-wrap gap-2 border-t border-[#38332D]/30 mt-3">
          <button
            id="open-purpose-modal-btn"
            onClick={() => setIsPurposeModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold font-serif-ethiopic shadow-2xs cursor-pointer"
          >
            <Compass className="w-3.5 h-3.5 text-emerald-300" />
            <span>🧭 በእውነተኛ ህይወትና ስራ (Why am I learning this?)</span>
          </button>

          <button
            onClick={() => onOpenAITutor?.(topic.lessonTitle, 'analysis')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 border border-amber-400 text-amber-950 text-xs font-bold font-serif-ethiopic shadow-2xs cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <span>በAI ተንትን (AI Deep Dive)</span>
          </button>

          <button
            onClick={() => onOpenAITutor?.(topic.lessonTitle, 'chat')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1E1B18] hover:bg-[#38332D] text-[#FAF6EC] text-xs font-bold font-serif-ethiopic shadow-2xs cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>የAI አስተማሪ ጠይቅ (Ask AI Tutor)</span>
          </button>

          <button
            onClick={() => onChangeTab('objectives_exam')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#EDE5D2] hover:bg-[#E2D6BE] border border-[#38332D] text-[#1E1B18] text-xs font-bold font-serif-ethiopic cursor-pointer"
          >
            <Target className="w-3.5 h-3.5 text-amber-800" />
            <span>የቻፕተር ፈተና (Objectives)</span>
          </button>

          <button
            onClick={() => onChangeTab('video_learning')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 border border-rose-300 text-rose-900 text-xs font-bold font-serif-ethiopic cursor-pointer"
          >
            <span>🎥 ቪዲዮ ትምህርት</span>
          </button>
        </div>
      </div>

      {/* Real-Life Purpose & Ethiopian Context Callout (Part 14) */}
      <div
        id="lesson-purpose-banner"
        className="rounded-2xl border-[1.5px] border-emerald-700/70 bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 p-4.5 space-y-2.5 shadow-xs"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-emerald-900">
            <Compass className="w-4 h-4 text-emerald-700" />
            <span>{isAmharic ? 'ይህንን ትምህርት ለምን እማራለሁ? (Why am I learning this?)' : 'Real-Life Purpose & Ethiopian Context'}</span>
          </div>
          <button
            onClick={() => setIsPurposeModalOpen(true)}
            className="text-xs font-bold text-emerald-800 hover:text-emerald-950 underline flex items-center gap-1 cursor-pointer"
          >
            <span>{isAmharic ? 'ሙሉ ዝርዝር እይ' : 'Explore All Connections'}</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
          {isAmharic ? quickConn.whyItMatters.am : quickConn.whyItMatters.en}
        </p>

        <div className="pt-2 border-t border-emerald-200/60 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center space-x-1.5 text-amber-900 font-medium">
            <Globe className="w-3.5 h-3.5 text-amber-700 shrink-0" />
            <span className="line-clamp-1">
              {isAmharic ? quickConn.ethiopianContextExample.am : quickConn.ethiopianContextExample.en}
            </span>
          </div>

          <button
            onClick={() => setIsPurposeModalOpen(true)}
            className="rounded-lg bg-emerald-700 px-3 py-1 text-xs font-bold text-white hover:bg-emerald-800 transition-colors shadow-2xs cursor-pointer shrink-0"
          >
            {isAmharic ? 'የሙያና የፕሮጀክት ዝምድና' : 'Careers & Projects'}
          </button>
        </div>
      </div>

      {/* Competency Benchmarks (New Curriculum) */}
      {topic.competencies && topic.competencies.length > 0 && (
        <div
          id="lesson-competencies-box"
          className="border-[1.5px] border-[#2563EB] bg-[#EFF6FF] p-4 space-y-2.5"
        >
          <div className="flex items-center justify-between flex-wrap gap-2 border-b border-[#2563EB]/20 pb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#1E40AF] flex items-center gap-1.5 font-serif-ethiopic">
              <Target className="w-4 h-4 text-[#2563EB]" />
              {t.competenciesTitle}
            </h3>
            <span className="text-[10px] bg-[#DBEAFE] text-[#1E3A8A] font-bold px-2 py-0.5 rounded-xs">
              MoE Standard
            </span>
          </div>
          <ul className="space-y-1.5 text-xs sm:text-sm text-[#1E3A8A]">
            {topic.competencies.map((comp, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-[#2563EB] font-bold">✓</span>
                <span className="font-serif-ethiopic leading-snug">{comp}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Main Lesson Body */}
      <article
        id="lesson-article"
        className="border-[1.5px] border-[#38332D] bg-[#FAF6EC] p-5 sm:p-7 space-y-4 shadow-xs"
      >
        <div className="flex items-center justify-between pb-3 border-b border-[#38332D]/20 text-[#5A5143] text-xs font-bold uppercase tracking-wider">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" style={{ color: subject.accentColor }} />
            <span>{t.lessonContentTitle}</span>
          </div>
          {isLessonDone && (
            <span className="text-emerald-800 font-bold text-[11px] flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {t.lessonCompletedBadge}
            </span>
          )}
        </div>

        <div className="space-y-3.5 text-[#24211E] text-base leading-relaxed font-normal">
          {topic.lessonContent.map((paragraph, idx) => (
            <p key={idx} className="indent-4 sm:indent-6 text-justify font-serif-ethiopic">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Practical Activity / Lab Section (New Curriculum) */}
        {topic.practicalActivity && (
          <div
            id="lesson-practical-activity-box"
            className="mt-6 border-[1.5px] border-[#047857] bg-[#ECFDF5] p-4 sm:p-5 space-y-3"
          >
            <div className="flex items-center justify-between flex-wrap gap-2 border-b border-[#047857]/20 pb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#065F46] flex items-center gap-1.5 font-serif-ethiopic">
                <FlaskConical className="w-4 h-4 text-[#059669]" />
                {t.practicalActivityTitle}: {topic.practicalActivity.title}
              </h3>
              <span className="text-[10px] bg-[#A7F3D0] text-[#064E3B] font-bold px-2 py-0.5 rounded-xs">
                Hands-on Lab
              </span>
            </div>

            {/* Materials Required */}
            {topic.practicalActivity.materials && topic.practicalActivity.materials.length > 0 && (
              <div className="space-y-1">
                <span className="text-xs font-bold text-[#065F46]">
                  {t.practicalMaterialsLabel}:
                </span>
                <p className="text-xs text-[#047857] font-serif-ethiopic">
                  {topic.practicalActivity.materials.join(' • ')}
                </p>
              </div>
            )}

            {/* Step-by-step Procedures */}
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-[#065F46]">
                {t.practicalStepsLabel}:
              </span>
              <ol className="list-decimal list-inside space-y-1 text-xs sm:text-sm text-[#047857] font-serif-ethiopic">
                {topic.practicalActivity.steps.map((step, sIdx) => (
                  <li key={sIdx} className="leading-relaxed">
                    {step}
                  </li>
                ))}
              </ol>
            </div>

            {/* Expected Observation */}
            {topic.practicalActivity.observation && (
              <div className="p-2.5 bg-white/70 border border-[#047857]/30 text-xs text-[#065F46] space-y-0.5">
                <span className="font-bold">{t.practicalObservationLabel}:</span>
                <p className="font-serif-ethiopic">{topic.practicalActivity.observation}</p>
              </div>
            )}
          </div>
        )}

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

      {/* Action Footer to Mark Completed & Proceed to Flashcards or Quiz */}
      <div
        id="lesson-actions-bar"
        className="p-4 border-[1.5px] border-[#38332D] bg-[#F2ECE0] flex flex-col sm:flex-row items-center justify-between gap-3"
      >
        <button
          id="toggle-lesson-complete-bottom-btn"
          onClick={handleToggleLessonComplete}
          className={`flex items-center gap-2 px-4 py-2 border-[1.5px] text-xs sm:text-sm font-bold transition-all cursor-pointer w-full sm:w-auto justify-center ${
            isLessonDone
              ? 'bg-emerald-100 border-emerald-600 text-emerald-950 shadow-xs'
              : 'bg-[#38332D] text-[#FAF6EC] hover:bg-[#24211E]'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span className="font-serif-ethiopic">
            {isLessonDone ? t.lessonCompletedBadge : t.markLessonCompleteBtn}
          </span>
        </button>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            id="go-to-flashcards-btn"
            onClick={() => onChangeTab('flashcards')}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 border-[1.5px] border-[#38332D] bg-[#FAF6EC] hover:bg-[#EAE2CE] text-xs sm:text-sm font-bold text-[#1E1B18] transition-colors cursor-pointer"
          >
            <Layers className="w-4 h-4" />
            <span className="font-serif-ethiopic">{t.flashcardsBtn}</span>
          </button>
          <button
            id="go-to-quiz-btn"
            onClick={() => onChangeTab('quiz')}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 border-[1.5px] border-[#38332D] text-xs sm:text-sm font-bold text-[#FAF6EC] transition-colors cursor-pointer"
            style={{ backgroundColor: subject.accentColor }}
          >
            <HelpCircle className="w-4 h-4" />
            <span className="font-serif-ethiopic">{t.startQuizBtn}</span>
            {isRtl ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </div>
  );
};
