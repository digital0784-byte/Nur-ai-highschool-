import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Search,
  ChevronRight,
  Sparkles,
  Layers,
  GraduationCap,
  Clock,
  Play,
  FileText,
  Filter,
} from 'lucide-react';
import {
  GradeLevel,
  CurriculumSubjectItem,
  CurriculumUnit,
  CurriculumLesson,
  CurriculumTopic,
} from '../../types/curriculumEngine';
import { LanguageCode } from '../../types';
import { ethiopianCurriculumEngine } from '../../engine/curriculumRegistry';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { ProgressBar } from '../ui/ProgressBar';

interface StudentLearnViewProps {
  grade: GradeLevel;
  language: LanguageCode;
  onSelectTopic: (topic: CurriculumTopic, unit: CurriculumUnit, lesson: CurriculumLesson) => void;
  onOpenKnowledgeMap?: () => void;
}

const getLocalizedText = (
  field: string | { en: string; am: string; om?: string; ti?: string } | undefined,
  lang: LanguageCode
): string => {
  if (!field) return '';
  if (typeof field === 'string') return field;
  return field[lang] || field.am || field.en || '';
};

export const StudentLearnView: React.FC<StudentLearnViewProps> = ({
  grade,
  language,
  onSelectTopic,
  onOpenKnowledgeMap,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStream, setSelectedStream] = useState<'all' | 'natural' | 'social'>('all');
  const [activeSubject, setActiveSubject] = useState<CurriculumSubjectItem | null>(null);

  const rawSubjects = ethiopianCurriculumEngine.getSubjectsByGrade(grade);

  // Subject statistics calculation
  const subjectsWithStats = rawSubjects.map((sub, index) => {
    let totalTopics = 0;
    sub.units.forEach((u) => {
      u.sections.forEach((s) => {
        s.lessons.forEach((l) => {
          totalTopics += l.topics.length;
        });
      });
    });
    totalTopics = totalTopics || 12;

    const completedTopics = Math.min(Math.floor(totalTopics * ((index + 1) * 0.22)), totalTopics);
    const progress = Math.round((completedTopics / totalTopics) * 100);
    const weakCount = index === 1 ? 2 : index === 0 ? 1 : 0;
    const firstTopic = sub.units[0]?.sections[0]?.lessons[0]?.topics[0];
    const currentTopicTitle = firstTopic
      ? getLocalizedText(firstTopic.title, language)
      : 'Fundamental Principles & Theories';

    const isNatural = ['math-g9', 'math-g10', 'math-g11', 'math-g12', 'physics-g9', 'physics-g10', 'chemistry-g9', 'biology-g9'].some((id) =>
      sub.id.startsWith(id.split('-')[0])
    );

    return {
      ...sub,
      totalTopics,
      completedTopics,
      progress,
      weakCount,
      currentTopicTitle,
      isNatural,
    };
  });

  const filteredSubjects = subjectsWithStats.filter((s) => {
    const nameStr = getLocalizedText(s.name, language).toLowerCase();
    const matchSearch = nameStr.includes(searchQuery.toLowerCase());

    if (!matchSearch) return false;
    if (selectedStream === 'natural') return s.isNatural;
    if (selectedStream === 'social') return !s.isNatural;
    return true;
  });

  // If a subject is clicked, show its unit/lesson drill-down
  if (activeSubject) {
    const subjectName = getLocalizedText(activeSubject.name, language);

    return (
      <div className="space-y-5 max-w-5xl mx-auto pb-12">
        {/* Back breadcrumb */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setActiveSubject(null)}
            className="flex items-center gap-2 text-xs font-bold text-stone-600 hover:text-stone-900 bg-white px-3.5 py-2 rounded-xl border border-stone-200 cursor-pointer shadow-xs transition-all"
          >
            ← {language === 'am' ? 'ወደ ትምህርቶች ዝርዝር ተመለስ' : 'Back to Subjects'}
          </button>
          <Badge variant="neutral">ክፍል {grade} • 2019 ዓ.ም</Badge>
        </div>

        {/* Subject Banner */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-xl shrink-0">
              {subjectName.charAt(0) || 'S'}
            </div>
            <div>
              <h2 className="text-xl font-black text-stone-900 font-serif-ethiopic">
                {subjectName}
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                {language === 'am'
                  ? `አጠቃላይ ${activeSubject.units.length} ምዕራፎች በኢ.ፌ.ዲ.ሪ አዲሱ ሥርዓተ-ትምህርት መሠረት`
                  : `${activeSubject.units.length} comprehensive units aligned with Ethiopian Curriculum`}
              </p>
            </div>
          </div>
          {onOpenKnowledgeMap && (
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Layers className="w-4 h-4" />}
              onClick={onOpenKnowledgeMap}
            >
              {language === 'am' ? 'የትምህርት ካርታ (Knowledge Map)' : 'Knowledge Map DAG'}
            </Button>
          )}
        </div>

        {/* Units List */}
        <div className="space-y-4">
          {activeSubject.units.map((unit) => {
            const unitTitle = getLocalizedText(unit.title, language);

            return (
              <div
                key={unit.id}
                className="bg-white rounded-2xl border border-stone-200/80 p-5 shadow-xs transition-all"
              >
                <div className="flex items-start justify-between gap-3 pb-3 border-b border-stone-100">
                  <div>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60 font-mono">
                      Unit {unit.unitNumber}
                    </span>
                    <h3 className="text-base font-bold text-stone-900 mt-1 font-serif-ethiopic">
                      {unitTitle}
                    </h3>
                  </div>
                  <span className="text-xs text-stone-400">
                    {unit.sections.length} {language === 'am' ? 'ክፍሎች' : 'Sections'}
                  </span>
                </div>

                {/* Sections & Lessons */}
                <div className="mt-3 space-y-2">
                  {unit.sections.map((section) => {
                    const sectionTitle = getLocalizedText(section.title, language);

                    return (
                      <div key={section.id} className="pt-2">
                        <h4 className="text-xs font-semibold text-stone-600 uppercase tracking-wider mb-2">
                          Section {section.sectionNumber}: {sectionTitle}
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {section.lessons.map((lesson) => {
                            const firstTopic = lesson.topics[0];
                            const lessonTitle = getLocalizedText(lesson.title, language);
                            const topicTitle = firstTopic
                              ? getLocalizedText(firstTopic.title, language)
                              : 'Core Topic';

                            return (
                              <div
                                key={lesson.id}
                                onClick={() => firstTopic && onSelectTopic(firstTopic, unit, lesson)}
                                className="p-3 rounded-xl bg-stone-50 hover:bg-emerald-50/50 border border-stone-100 hover:border-emerald-200 transition-all cursor-pointer flex items-center justify-between group"
                              >
                                <div className="min-w-0 pr-2">
                                  <p className="text-xs font-bold text-stone-800 group-hover:text-emerald-900 truncate">
                                    Lesson {lesson.lessonNumber}: {lessonTitle}
                                  </p>
                                  <p className="text-[11px] text-stone-400 mt-0.5 truncate">
                                    {topicTitle}
                                  </p>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="xs"
                                  className="text-emerald-700 group-hover:bg-white shrink-0"
                                >
                                  <Play className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600" />
                                </Button>
                              </div>
                            );
                          })}
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
    );
  }

  // Main Subject Cards View
  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-stone-900 font-serif-ethiopic">
            {language === 'am' ? `የ${grade}ኛ ክፍል የትምህርት አይነቶች` : `Grade ${grade} Learning Subjects`}
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            {language === 'am'
              ? 'የትምህርት ሂደትን ይከታተሉ፣ ደካማ ጎኖችን ያርሙ እና ክፍለ-ጊዜዎችን ይቀጥሉ።'
              : 'Track progress, review weak topics, and continue your structured curriculum.'}
          </p>
        </div>

        {/* Search & Stream Filter */}
        <div className="flex items-center gap-2">
          <div className="flex items-center p-1 bg-stone-100 rounded-xl border border-stone-200 text-xs">
            <button
              onClick={() => setSelectedStream('all')}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                selectedStream === 'all' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500'
              }`}
            >
              {language === 'am' ? 'ሁሉም' : 'All'}
            </button>
            <button
              onClick={() => setSelectedStream('natural')}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                selectedStream === 'natural' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500'
              }`}
            >
              {language === 'am' ? 'የተፈጥሮ' : 'Natural'}
            </button>
            <button
              onClick={() => setSelectedStream('social')}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                selectedStream === 'social' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500'
              }`}
            >
              {language === 'am' ? 'ማህበራዊ' : 'Social'}
            </button>
          </div>
        </div>
      </div>

      {/* Subject Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {filteredSubjects.map((subject) => {
          const firstTopic = subject.units[0]?.sections[0]?.lessons[0]?.topics[0];
          const firstUnit = subject.units[0];
          const firstLesson = subject.units[0]?.sections[0]?.lessons[0];
          const localizedSubjectName = getLocalizedText(subject.name, language);

          return (
            <div
              key={subject.id}
              className="bg-white rounded-3xl p-5 border border-stone-200/90 shadow-xs hover:border-emerald-300 hover:shadow-sm transition-all flex flex-col justify-between"
            >
              <div>
                {/* Subject Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-100 flex items-center justify-center font-black text-lg">
                      {localizedSubjectName.charAt(0) || 'S'}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-stone-900 font-serif-ethiopic leading-snug">
                        {localizedSubjectName}
                      </h3>
                      <p className="text-xs text-stone-400">
                        {subject.units.length} {language === 'am' ? 'ምዕራፎች' : 'Units'}
                      </p>
                    </div>
                  </div>

                  {subject.weakCount > 0 ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1 shrink-0">
                      <AlertTriangle className="w-3 h-3" />
                      {subject.weakCount} {language === 'am' ? 'ክለሳ' : 'Weak'}
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                      {subject.progress}%
                    </span>
                  )}
                </div>

                {/* Progress Bar */}
                <div className="space-y-1.5 my-3">
                  <div className="flex justify-between text-xs text-stone-500">
                    <span>{language === 'am' ? 'የትምህርት ሽፋን' : 'Progress'}</span>
                    <span className="font-mono font-bold text-stone-900">{subject.progress}%</span>
                  </div>
                  <ProgressBar value={subject.progress} size="sm" variant="emerald" />
                </div>

                {/* Current Topic Box */}
                <div className="p-3 rounded-xl bg-stone-50 border border-stone-100 my-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                    {language === 'am' ? 'የአሁን ርዕስ (Current Topic)' : 'Current Topic'}
                  </span>
                  <p className="text-xs font-bold text-stone-800 line-clamp-1">
                    {subject.currentTopicTitle}
                  </p>
                </div>

                {/* Stats row */}
                <div className="flex items-center justify-between text-xs text-stone-500 pt-1 pb-2">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    {subject.completedTopics} / {subject.totalTopics}{' '}
                    {language === 'am' ? 'ተጠናቀቁ' : 'Done'}
                  </span>
                  <span className="text-stone-400 font-mono">
                    {subject.totalTopics - subject.completedTopics} {language === 'am' ? 'ቀሪ' : 'Left'}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 mt-2 border-t border-stone-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => setActiveSubject(subject)}
                  className="text-xs font-bold text-stone-600 hover:text-stone-900 cursor-pointer"
                >
                  {language === 'am' ? 'ምዕራፎችን እይ' : 'View Units'}
                </button>
                <Button
                  variant="primary"
                  size="sm"
                  rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                  onClick={() => {
                    if (firstTopic && firstUnit && firstLesson) {
                      onSelectTopic(firstTopic, firstUnit, firstLesson);
                    } else {
                      setActiveSubject(subject);
                    }
                  }}
                >
                  {language === 'am' ? 'ተማር (Continue)' : 'Continue'}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
