import React from 'react';
import { BookOpen, CheckCircle2, Award, TrendingUp } from 'lucide-react';
import { SubjectGamificationProgress } from '../../types/gamification';
import { SupportedLanguage } from '../../types/curriculumEngine';

interface SubjectProgressSectionProps {
  progressList?: SubjectGamificationProgress[];
  language: SupportedLanguage;
  onSelectSubject?: (subjectId: string) => void;
}

// Canonical Ethiopian high school subjects default progress
const DEFAULT_SUBJECTS_PROGRESS: SubjectGamificationProgress[] = [
  {
    subjectId: 'math',
    subjectName: 'ሂሳብ (Mathematics)',
    stream: 'Common (የጋራ)',
    unitsCompleted: 2,
    totalUnits: 6,
    topicsMastered: 7,
    totalTopics: 18,
    quizPerformanceAverage: 82,
    learningProgressPercentage: 45,
    badgeUnlocked: true,
  },
  {
    subjectId: 'physics',
    subjectName: 'ፊዚክስ (Physics)',
    stream: 'Natural Science',
    unitsCompleted: 1,
    totalUnits: 6,
    topicsMastered: 4,
    totalTopics: 16,
    quizPerformanceAverage: 78,
    learningProgressPercentage: 35,
    badgeUnlocked: false,
  },
  {
    subjectId: 'chemistry',
    subjectName: 'ኬሚስትሪ (Chemistry)',
    stream: 'Natural Science',
    unitsCompleted: 2,
    totalUnits: 5,
    topicsMastered: 6,
    totalTopics: 15,
    quizPerformanceAverage: 85,
    learningProgressPercentage: 50,
    badgeUnlocked: true,
  },
  {
    subjectId: 'biology',
    subjectName: 'ባዮሎጂ (Biology)',
    stream: 'Natural Science',
    unitsCompleted: 3,
    totalUnits: 6,
    topicsMastered: 9,
    totalTopics: 18,
    quizPerformanceAverage: 88,
    learningProgressPercentage: 62,
    badgeUnlocked: true,
  },
  {
    subjectId: 'english',
    subjectName: 'እንግሊዝኛ (English)',
    stream: 'Common (የጋራ)',
    unitsCompleted: 2,
    totalUnits: 7,
    topicsMastered: 6,
    totalTopics: 20,
    quizPerformanceAverage: 90,
    learningProgressPercentage: 42,
    badgeUnlocked: true,
  },
  {
    subjectId: 'history',
    subjectName: 'ታሪክ (History)',
    stream: 'Social Science',
    unitsCompleted: 1,
    totalUnits: 5,
    topicsMastered: 3,
    totalTopics: 15,
    quizPerformanceAverage: 75,
    learningProgressPercentage: 28,
    badgeUnlocked: false,
  },
  {
    subjectId: 'geography',
    subjectName: 'ጂኦግራፊ (Geography)',
    stream: 'Social Science',
    unitsCompleted: 1,
    totalUnits: 5,
    topicsMastered: 4,
    totalTopics: 14,
    quizPerformanceAverage: 80,
    learningProgressPercentage: 32,
    badgeUnlocked: false,
  },
  {
    subjectId: 'citizenship',
    subjectName: 'የዜግነት ትምህርት (Citizenship)',
    stream: 'Social Science',
    unitsCompleted: 2,
    totalUnits: 4,
    topicsMastered: 5,
    totalTopics: 12,
    quizPerformanceAverage: 92,
    learningProgressPercentage: 58,
    badgeUnlocked: true,
  },
];

export const SubjectProgressSection: React.FC<SubjectProgressSectionProps> = ({
  progressList = DEFAULT_SUBJECTS_PROGRESS,
  language,
  onSelectSubject,
}) => {
  return (
    <div
      id="gamification-subject-progress-section"
      className="bg-[#FAF6EC] border-[1.5px] border-[#38332D] rounded-xl p-4 sm:p-5 shadow-sm mb-5"
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#E3DAC4]">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-blue-100 border border-blue-300 flex items-center justify-center text-blue-800">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base font-serif-ethiopic text-[#1E1B18]">
              {language === 'am'
                ? 'የትምህርት ዓይነቶች እድገት (Subject Progress)'
                : language === 'om'
                ? 'Guddina Barnootaa'
                : language === 'ti'
                ? 'ናይ ዓይነተ ትምህርቲ ምዕባለ'
                : 'Subject Progress & Mastery'}
            </h3>
            <p className="text-xs text-[#7A705E]">
              {language === 'am'
                ? 'በእያንዳንዱ የሁለተኛ ደረጃ ትምህርት የተጠናቀቁ ምዕራፎች፣ ርዕሶች እና የፈተና ውጤት'
                : 'Curriculum units completed, topics mastered, quiz performance, and overall learning progress.'}
            </p>
          </div>
        </div>

        <span className="text-xs font-bold text-[#5A5143] bg-[#EAE2D0] px-2.5 py-1 rounded-full border border-[#DDD3BF]">
          {progressList.length} {language === 'am' ? 'የትምህርት አይነቶች' : 'Subjects'}
        </span>
      </div>

      {/* Grid of Subject Progress Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mt-4">
        {progressList.map((subj) => (
          <div
            key={subj.subjectId}
            className="p-3.5 rounded-xl border border-[#DDD3BF] bg-[#F2ECE0] hover:border-[#38332D] transition-all"
          >
            {/* Title & Stream */}
            <div className="flex items-start justify-between gap-2">
              <div>
                <h4 className="font-bold text-sm text-[#1E1B18] font-serif-ethiopic">
                  {subj.subjectName}
                </h4>
                {subj.stream && (
                  <span className="text-[10px] text-[#7A705E] font-medium">
                    {subj.stream}
                  </span>
                )}
              </div>

              <div className="text-right">
                <span className="text-sm font-black text-[#1E1B18]">
                  {subj.learningProgressPercentage}%
                </span>
                <div className="text-[10px] text-[#7A705E]">
                  {language === 'am' ? 'የመማር እድገት' : 'Progress'}
                </div>
              </div>
            </div>

            {/* Metrics Breakdown: Units Completed, Topics Mastered, Quiz Performance */}
            <div className="grid grid-cols-3 gap-2 my-3 text-center">
              <div className="bg-[#FAF6EC] border border-[#DDD3BF] rounded-lg p-2">
                <div className="text-[11px] text-[#7A705E] flex items-center justify-center gap-1">
                  <BookOpen className="w-3 h-3 text-blue-600" />
                  <span>{language === 'am' ? 'ምዕራፎች' : 'Units'}</span>
                </div>
                <div className="text-xs font-black text-[#1E1B18] mt-0.5">
                  {subj.unitsCompleted} / {subj.totalUnits}
                </div>
              </div>

              <div className="bg-[#FAF6EC] border border-[#DDD3BF] rounded-lg p-2">
                <div className="text-[11px] text-[#7A705E] flex items-center justify-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>{language === 'am' ? 'ርዕሶች' : 'Mastered'}</span>
                </div>
                <div className="text-xs font-black text-[#1E1B18] mt-0.5">
                  {subj.topicsMastered} / {subj.totalTopics}
                </div>
              </div>

              <div className="bg-[#FAF6EC] border border-[#DDD3BF] rounded-lg p-2">
                <div className="text-[11px] text-[#7A705E] flex items-center justify-center gap-1">
                  <Award className="w-3 h-3 text-amber-600" />
                  <span>{language === 'am' ? 'ፈተና' : 'Quiz Avg'}</span>
                </div>
                <div className="text-xs font-black text-[#1E1B18] mt-0.5">
                  {subj.quizPerformanceAverage}%
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-[#DDD3BF] h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${subj.learningProgressPercentage}%` }}
              />
            </div>

            {onSelectSubject && (
              <div className="mt-2.5 text-right">
                <button
                  onClick={() => onSelectSubject(subj.subjectId)}
                  className="text-[11px] text-[#2563EB] hover:underline font-bold cursor-pointer"
                >
                  {language === 'am' ? 'ወደ ትምህርቱ ሂድ →' : 'Study Subject →'}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
