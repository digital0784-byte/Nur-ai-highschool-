import React from 'react';
import { Subject, Topic, Grade } from '../types';
import { Sparkles, Layers, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useProgress } from '../context/ProgressContext';

interface TopicChipsProps {
  subject: Subject;
  selectedGrade: Grade;
  selectedTopic: Topic;
  onSelectTopic: (topic: Topic) => void;
}

export const TopicChips: React.FC<TopicChipsProps> = ({
  subject,
  selectedGrade,
  selectedTopic,
  onSelectTopic,
}) => {
  const { t } = useLanguage();
  const { isTopicComplete, getTopicProgress } = useProgress();

  return (
    <div
      id="topic-chips-bar"
      className="p-3 sm:p-4 bg-[#F8F3E6] border-b-[1.5px] border-[#38332D] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
    >
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold uppercase tracking-wider text-[#5A5143] flex items-center gap-1.5 shrink-0">
          <Layers className="w-3.5 h-3.5" style={{ color: subject.accentColor }} />
          {t.topicsLabel} ({subject.name}):
        </span>
      </div>

      <div
        id="topic-chips-container"
        className="flex flex-wrap items-center gap-2"
      >
        {subject.topics.map((topic) => {
          const isSelected = topic.id === selectedTopic.id;
          const isGradeMatched = topic.applicableGrades.includes(selectedGrade);
          const isComplete = isTopicComplete(topic.id);
          const tp = getTopicProgress(topic.id);

          // Calculate sub-activities completed (0 to 3)
          let subCompleted = 0;
          if (tp.lessonCompleted) subCompleted++;
          if (tp.flashcardsCompleted) subCompleted++;
          if (tp.quizCompleted) subCompleted++;

          return (
            <button
              key={topic.id}
              id={`topic-chip-${topic.id}`}
              onClick={() => onSelectTopic(topic)}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs sm:text-sm font-medium border-[1.5px] transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#FAF6EC] text-[#1E1B18] font-bold shadow-xs'
                  : 'bg-[#EDE6D4] text-[#4A4237] hover:bg-[#E4DCB9] border-[#38332D]'
              }`}
              style={{
                borderColor: isSelected ? subject.accentColor : '#38332D',
              }}
            >
              {/* Grade Tier Badge */}
              <span
                className="text-[10px] font-bold px-1.5 py-0.2 border rounded-xs"
                style={{
                  backgroundColor: isSelected ? subject.accentColor : '#DDD4BE',
                  color: isSelected ? '#FFFFFF' : '#38332D',
                  borderColor: isSelected ? subject.accentColor : '#38332D',
                }}
              >
                {t.gradeTierPrefix} {topic.gradeTier}
              </span>

              {/* Title */}
              <span className="truncate max-w-[200px] sm:max-w-none font-serif-ethiopic">
                {topic.title}
              </span>

              {/* Completion status pill */}
              {isComplete ? (
                <span
                  title={t.topicFullyCompletedBadge}
                  className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.2 border border-emerald-300"
                >
                  <CheckCircle2 className="w-2.5 h-2.5 text-emerald-700" />
                  <span>3/3</span>
                </span>
              ) : subCompleted > 0 ? (
                <span
                  title={`${subCompleted}/3 completed`}
                  className="inline-flex items-center text-[10px] font-mono font-semibold text-[#665C4D] bg-[#E7DECA] px-1.5 py-0.2 border border-[#38332D]/30"
                >
                  {subCompleted}/3
                </span>
              ) : null}

              {/* Matched Grade sparkle */}
              {isGradeMatched && !isComplete && (
                <span
                  title={`${t.gradePrefix} ${selectedGrade}`}
                  className="flex items-center text-[10px] font-bold text-amber-700 bg-amber-100 px-1 py-0.2 border border-amber-300"
                >
                  <Sparkles className="w-2.5 h-2.5 mx-0.5" />
                  {t.yourGradeBadge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
