import React from 'react';
import { Subject, Topic, Grade } from '../types';
import { Sparkles, Layers } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

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

              {/* Matched Grade sparkle */}
              {isGradeMatched && (
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
