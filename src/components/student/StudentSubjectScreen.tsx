import React, { useState } from 'react';
import {
  ArrowLeft,
  BookOpen,
  ChevronDown,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  Clock,
  HelpCircle,
  FileText,
  Activity,
  Layers,
  Award,
  BookMarked,
  ArrowUpRight,
  Download,
} from 'lucide-react';
import {
  CurriculumSubjectItem,
  CurriculumUnit,
  CurriculumLesson,
  CurriculumTopic,
  GradeLevel,
} from '../../types/curriculumEngine';
import { LanguageCode } from '../../types';
import { studentAppFirestore } from '../../services/studentAppFirestore';

interface StudentSubjectScreenProps {
  subject: CurriculumSubjectItem;
  grade: GradeLevel;
  language: LanguageCode;
  darkMode: boolean;
  lowDataMode: boolean;
  onBack: () => void;
  onStartLearning: (topic: CurriculumTopic, unit: CurriculumUnit, lesson: CurriculumLesson) => void;
}

export const StudentSubjectScreen: React.FC<StudentSubjectScreenProps> = ({
  subject,
  grade,
  language,
  darkMode,
  lowDataMode,
  onBack,
  onStartLearning,
}) => {
  const [selectedUnitId, setSelectedUnitId] = useState<string>(subject.units[0]?.id || '');
  const [selectedTopicId, setSelectedTopicId] = useState<string>(() => {
    return subject.units[0]?.sections[0]?.lessons[0]?.topics[0]?.id || '';
  });
  const [activeTopicTab, setActiveTopicTab] = useState<
    | 'outcome'
    | 'explanation'
    | 'examples'
    | 'activities'
    | 'exercises'
    | 'review'
    | 'assessment'
  >('outcome');
  const [cachedStatus, setCachedStatus] = useState<Record<string, boolean>>(() => {
    const res: Record<string, boolean> = {};
    subject.units.forEach((u) => {
      res[u.id] = studentAppFirestore.isUnitCached(u.id);
    });
    return res;
  });

  const selectedUnit = subject.units.find((u) => u.id === selectedUnitId) || subject.units[0];

  // Find the selected topic object across sections & lessons
  let selectedTopic: CurriculumTopic | undefined;
  let parentLesson: CurriculumLesson | undefined;
  if (selectedUnit) {
    for (const section of selectedUnit.sections) {
      for (const lesson of section.lessons) {
        const found = lesson.topics.find((t) => t.id === selectedTopicId);
        if (found) {
          selectedTopic = found;
          parentLesson = lesson;
          break;
        }
      }
      if (selectedTopic) break;
    }
  }
  // Fallback to first topic if not found
  if (!selectedTopic && selectedUnit) {
    selectedTopic = selectedUnit.sections[0]?.lessons[0]?.topics[0];
    parentLesson = selectedUnit.sections[0]?.lessons[0];
  }

  const handleDownloadUnit = (unit: CurriculumUnit) => {
    studentAppFirestore.saveUnitOffline(unit, subject.id, grade);
    setCachedStatus((prev) => ({ ...prev, [unit.id]: true }));
  };

  const bgCard = darkMode ? 'bg-[#211F26] border-[#36343B]' : 'bg-white border-[#E6E0E9]';
  const textPrimary = darkMode ? 'text-[#E6E1E5]' : 'text-[#1D1B20]';
  const textSecondary = darkMode ? 'text-[#CAC4D0]' : 'text-[#49454F]';
  const primaryBtn = 'bg-[#6750A4] text-white hover:bg-[#523e85]';

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header bar: Back button & Subject Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E6E0E9] dark:border-[#36343B]">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className={`p-2 rounded-full border transition-all cursor-pointer ${
              darkMode ? 'bg-[#2B2930] border-[#49454F] text-[#E6E1E5]' : 'bg-[#ECE6F0] border-[#CAC4D0] text-[#1D1B20]'
            } hover:opacity-80`}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#EADDFF] text-[#21005D] dark:bg-[#4F378B] dark:text-[#EADDFF]">
                ክፍል {grade} (Grade {grade})
              </span>
              <span className="text-xs text-[#7A7060] dark:text-[#CAC4D0]">
                {subject.curriculumEdition}
              </span>
            </div>
            <h1 className={`text-xl sm:text-2xl font-black tracking-tight ${textPrimary}`}>
              {subject.name[language] || subject.name.en}
            </h1>
          </div>
        </div>

        {/* Official Textbook Banner Badge */}
        <div className={`px-4 py-2 rounded-2xl border text-xs flex items-center gap-2.5 ${bgCard}`}>
          <BookMarked className="w-4 h-4 text-[#6750A4]" />
          <div>
            <span className="font-extrabold block text-gray-800 dark:text-gray-200">
              {subject.textbookTitle}
            </span>
            <span className="text-[10px] text-gray-500 dark:text-gray-400">
              {subject.textbookPublisher}
            </span>
          </div>
        </div>
      </div>

      {/* Main Hierarchy: Left column: Units & Lessons list; Right column: Topic Deep-Dive */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Units & Lessons Navigation (4 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className={`text-sm font-black uppercase tracking-wider ${textSecondary}`}>
              የምዕራፎችና የትምህርት ዝርዝር ({subject.units.length} ምዕራፎች)
            </h2>
          </div>

          <div className="space-y-3 max-h-[750px] overflow-y-auto pr-1">
            {subject.units.map((unit) => {
              const isSelected = unit.id === selectedUnit?.id;
              const isCached = cachedStatus[unit.id];

              return (
                <div
                  key={unit.id}
                  className={`rounded-2xl border-[1.5px] transition-all overflow-hidden ${
                    isSelected
                      ? 'border-[#6750A4] shadow-sm'
                      : darkMode
                      ? 'border-[#36343B] bg-[#211F26]'
                      : 'border-[#E6E0E9] bg-white'
                  }`}
                >
                  {/* Unit Header Bar */}
                  <div
                    onClick={() => {
                      setSelectedUnitId(unit.id);
                      const firstTopic = unit.sections[0]?.lessons[0]?.topics[0];
                      if (firstTopic) setSelectedTopicId(firstTopic.id);
                    }}
                    className={`p-4 cursor-pointer flex items-center justify-between transition-colors ${
                      isSelected
                        ? darkMode
                          ? 'bg-[#2B2930]'
                          : 'bg-[#F7F2FA]'
                        : 'hover:bg-gray-50/50 dark:hover:bg-[#2B2930]/50'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-black uppercase text-[#6750A4] dark:text-[#D0BCFF]">
                          ምዕራፍ {unit.unitNumber} (Unit {unit.unitNumber})
                        </span>
                        {isCached && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                            ኦፍላይን ወርዷል
                          </span>
                        )}
                      </div>
                      <h3 className={`text-sm font-bold ${textPrimary}`}>
                        {unit.title[language] || unit.title.en}
                      </h3>
                      <p className={`text-[11px] ${textSecondary}`}>
                        ገጽ {unit.textbookPageStart}-{unit.textbookPageEnd} • {unit.allocatedPeriods || 16} ክፍለ-ጊዜዎች
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        title="ለኦፍላይን ጥናት አውርድ"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownloadUnit(unit);
                        }}
                        className={`p-2 rounded-full border text-xs cursor-pointer ${
                          isCached
                            ? 'text-emerald-600 border-emerald-300 bg-emerald-50 dark:bg-emerald-950/40'
                            : 'text-gray-500 border-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                      <ChevronRight
                        className={`w-5 h-5 text-gray-400 transition-transform ${
                          isSelected ? 'rotate-90 text-[#6750A4]' : ''
                        }`}
                      />
                    </div>
                  </div>

                  {/* Expanded Lessons & Topics in this unit */}
                  {isSelected && (
                    <div className="p-3 pt-0 border-t border-[#E6E0E9] dark:border-[#36343B] space-y-3 mt-2">
                      {unit.sections.map((section) => (
                        <div key={section.id} className="space-y-2">
                          <div className="text-[11px] font-bold text-gray-500 px-2 pt-1 flex items-center gap-1">
                            <span>ክፍል {section.sectionNumber}:</span>
                            <span className="truncate">{section.title[language] || section.title.en}</span>
                          </div>

                          {section.lessons.map((lesson) => (
                            <div key={lesson.id} className="pl-2 space-y-1">
                              <span className="text-[10px] font-extrabold text-[#7D5260] dark:text-[#FFD8E4] block">
                                {lesson.lessonNumber}: {lesson.title[language] || lesson.title.en} ({lesson.periodCount} ክፍለ-ጊዜ)
                              </span>

                              {lesson.topics.map((topic) => {
                                const isTopicSelected = topic.id === selectedTopic?.id;
                                return (
                                  <button
                                    key={topic.id}
                                    onClick={() => setSelectedTopicId(topic.id)}
                                    className={`w-full text-left p-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                                      isTopicSelected
                                        ? 'bg-[#6750A4] text-white shadow-xs'
                                        : darkMode
                                        ? 'bg-[#2B2930] text-[#E6E1E5] hover:bg-[#36343B]'
                                        : 'bg-[#ECE6F0] text-[#1D1B20] hover:bg-[#E6E0E9]'
                                    }`}
                                  >
                                    <div className="flex items-center gap-2 truncate">
                                      <span className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0" />
                                      <span className="truncate">{topic.title[language] || topic.title.en}</span>
                                    </div>
                                    <span className={`text-[10px] flex-shrink-0 ${isTopicSelected ? 'text-purple-200' : 'text-gray-500'}`}>
                                      ገጽ {topic.textbookPage}
                                    </span>
                                  </button>
                                );
                              })}
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: Topic Detail Viewer (7 cols) */}
        {selectedTopic && selectedUnit && parentLesson && (
          <div className="lg:col-span-7 space-y-4">
            <div className={`rounded-3xl p-6 border-[1.5px] shadow-xs space-y-5 ${bgCard}`}>
              {/* Topic Title Bar & Fast Learn CTA */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200">
                    <span>ምዕራፍ {selectedUnit.unitNumber} • ርዕስ {selectedTopic.topicNumber}</span>
                  </div>
                  <h2 className={`text-xl sm:text-2xl font-black ${textPrimary}`}>
                    {selectedTopic.title[language] || selectedTopic.title.en}
                  </h2>
                  <p className={`text-xs ${textSecondary}`}>
                    ምንጭ፡ የኢትዮጵያ አዲሱ ስርዓተ-ትምህርት የመማሪያ መጽሐፍ ገጽ {selectedTopic.textbookPage}
                  </p>
                </div>

                <button
                  onClick={() => onStartLearning(selectedTopic!, selectedUnit, parentLesson!)}
                  className={`px-5 py-2.5 rounded-full text-xs font-black transition-all flex items-center gap-2 shadow-sm cursor-pointer whitespace-nowrap active:scale-95 ${primaryBtn}`}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>ወደ መማሪያ ገጽ (Start Learning)</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>

              {/* 8-Tab Selector for Topic Scope */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-[#E6E0E9] dark:border-[#36343B]">
                {[
                  { id: 'outcome', label: '1. የትምህርት ውጤት (Outcomes)' },
                  { id: 'explanation', label: '2. ማብራሪያ (Explanation)' },
                  { id: 'examples', label: `3. ምሳሌዎች (${selectedTopic.examples.length})` },
                  { id: 'activities', label: `4. ተግባራት (${selectedTopic.activities.length})` },
                  { id: 'exercises', label: `5. ልምምዶች (${selectedTopic.exercises.length})` },
                  { id: 'review', label: '6. ክለሳ (Review)' },
                  { id: 'assessment', label: '7. ግምገማ (Assessment)' },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setActiveTopicTab(t.id as any)}
                    className={`px-3 py-1.5 rounded-full text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer ${
                      activeTopicTab === t.id
                        ? 'bg-[#6750A4] text-white shadow-xs'
                        : darkMode
                        ? 'bg-[#2B2930] text-[#CAC4D0] hover:text-white'
                        : 'bg-[#ECE6F0] text-[#49454F] hover:text-[#1D1B20]'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Tab 1: Learning Outcome */}
              {activeTopicTab === 'outcome' && (
                <div className="space-y-4">
                  <h3 className={`text-sm font-black flex items-center gap-2 ${textPrimary}`}>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    የትምህርት ውጤቶች (Expected Learning Outcomes)
                  </h3>
                  <div className="space-y-2.5">
                    {selectedTopic.learningOutcomes.map((lo) => (
                      <div
                        key={lo.id}
                        className={`p-3.5 rounded-2xl border flex items-start gap-3 ${
                          darkMode ? 'bg-[#2B2930] border-[#49454F]' : 'bg-[#F7F2FA] border-[#E6E0E9]'
                        }`}
                      >
                        <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-black flex-shrink-0 mt-0.5">
                          ✓
                        </span>
                        <div>
                          <p className={`text-xs font-bold ${textPrimary}`}>
                            {lo.description[language] || lo.description.en}
                          </p>
                          <span className="text-[10px] text-gray-500 block mt-0.5">
                            ኮድ፡ {lo.code} • Bloom ደረጃ፡ {lo.bloomLevel || 'ተግባራዊ'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 2: Explanation */}
              {activeTopicTab === 'explanation' && (
                <div className="space-y-4">
                  <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-[#2B2930] border-[#49454F]' : 'bg-gray-50 border-[#E6E0E9]'}`}>
                    <h4 className="text-xs font-black uppercase text-[#6750A4] dark:text-[#D0BCFF] mb-2">
                      አጠቃላይ ማጠቃለያ (Overview)
                    </h4>
                    <p className={`text-xs leading-relaxed ${textPrimary}`}>
                      {selectedTopic.explanations.overview}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className={`text-xs font-black uppercase tracking-wider ${textSecondary}`}>
                      ዋና ዋና ፅንሰ-ሀሳቦች (Core Concepts)
                    </h4>
                    <ul className="space-y-2">
                      {selectedTopic.explanations.coreConcepts.map((c, i) => (
                        <li
                          key={i}
                          className={`p-3 rounded-xl border text-xs font-medium flex items-start gap-2.5 ${
                            darkMode ? 'bg-[#2B2930] border-[#49454F]' : 'bg-white border-[#E6E0E9]'
                          }`}
                        >
                          <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-900 dark:bg-purple-900/60 dark:text-purple-200 flex items-center justify-center text-[11px] font-black flex-shrink-0">
                            {i + 1}
                          </span>
                          <span className={textPrimary}>{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Tab 3: Examples */}
              {activeTopicTab === 'examples' && (
                <div className="space-y-3">
                  <h3 className={`text-sm font-black flex items-center gap-2 ${textPrimary}`}>
                    <FileText className="w-4 h-4 text-purple-600" />
                    የመማሪያ መጽሐፍ ምሳሌዎች (Worked Textbook Examples)
                  </h3>
                  {selectedTopic.examples.map((ex) => (
                    <div
                      key={ex.id}
                      className={`p-4 rounded-2xl border space-y-2.5 ${
                        darkMode ? 'bg-[#2B2930] border-[#49454F]' : 'bg-[#FEF7FF] border-[#EADDFF]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-[#6750A4] dark:text-[#D0BCFF]">
                          {ex.title}
                        </span>
                        <span className="text-[10px] text-gray-500 font-bold">
                          ገጽ {ex.textbookPage}
                        </span>
                      </div>
                      <div className="p-3 rounded-xl bg-white dark:bg-[#1D1B20] border border-gray-200 dark:border-gray-800 text-xs font-mono">
                        <span className="text-purple-700 dark:text-purple-300 font-bold block mb-1">ጥያቄ፡</span>
                        {ex.problem}
                      </div>
                      <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs">
                        <span className="text-emerald-800 dark:text-emerald-300 font-bold block mb-1">መፍትሄ፡</span>
                        <p className="whitespace-pre-line text-gray-800 dark:text-gray-200">{ex.solution}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 4: Activities */}
              {activeTopicTab === 'activities' && (
                <div className="space-y-3">
                  <h3 className={`text-sm font-black flex items-center gap-2 ${textPrimary}`}>
                    <Activity className="w-4 h-4 text-amber-600" />
                    የክፍል ተግባራትና ሙከራዎች (Textbook Activities)
                  </h3>
                  {selectedTopic.activities.map((act) => (
                    <div
                      key={act.id}
                      className={`p-4 rounded-2xl border space-y-2 ${
                        darkMode ? 'bg-[#2B2930] border-[#49454F]' : 'bg-[#FFF8E1] border-[#FFE082]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-amber-800 dark:text-amber-200">
                          {act.activityNumber}: {act.title}
                        </span>
                        <span className="text-[10px] text-gray-500">ገጽ {act.textbookPage}</span>
                      </div>
                      <p className="text-xs text-gray-700 dark:text-gray-300 font-medium">
                        <strong>ዓላማ፡</strong> {act.objective}
                      </p>
                      <div className="space-y-1 text-xs">
                        <strong>መመሪያዎች፡</strong>
                        {act.instructions.map((ins, idx) => (
                          <p key={idx} className="text-gray-600 dark:text-gray-400 pl-2">
                            • {ins}
                          </p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 5: Exercises */}
              {activeTopicTab === 'exercises' && (
                <div className="space-y-3">
                  <h3 className={`text-sm font-black flex items-center gap-2 ${textPrimary}`}>
                    <BookOpen className="w-4 h-4 text-blue-600" />
                    የመማሪያ መጽሐፍ ልምምዶች (Textbook Exercises)
                  </h3>
                  {selectedTopic.exercises.map((exs) => (
                    <div
                      key={exs.id}
                      className={`p-4 rounded-2xl border space-y-3 ${
                        darkMode ? 'bg-[#2B2930] border-[#49454F]' : 'bg-white border-[#E6E0E9]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-blue-700 dark:text-blue-300">
                          {exs.exerciseNumber}: {exs.title}
                        </span>
                        <span className="text-[10px] text-gray-500">ገጽ {exs.textbookPage}</span>
                      </div>
                      <div className="space-y-2">
                        {exs.problems.map((prob) => (
                          <div
                            key={prob.questionNumber}
                            className="p-3 rounded-xl bg-gray-50 dark:bg-[#1D1B20] border border-gray-200 dark:border-gray-800 text-xs space-y-1"
                          >
                            <span className="font-black text-[#6750A4]">ጥያቄ {prob.questionNumber}:</span>
                            <p className="text-gray-800 dark:text-gray-200">{prob.text}</p>
                            {prob.hint && (
                              <p className="text-[11px] text-amber-700 dark:text-amber-300 italic">
                                ፍንጭ (Hint): {prob.hint}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 6: Review */}
              {activeTopicTab === 'review' && (
                <div className="space-y-4">
                  <h3 className={`text-sm font-black flex items-center gap-2 ${textPrimary}`}>
                    <Layers className="w-4 h-4 text-emerald-600" />
                    የምዕራፉ ማጠቃለያና ቁልፍ ቃላት (Unit Review)
                  </h3>
                  <div className={`p-4 rounded-2xl border space-y-3 ${bgCard}`}>
                    <h4 className="text-xs font-black text-[#6750A4] uppercase">ዋና ዋና ነጥቦች (Summary Points)</h4>
                    <ul className="space-y-1.5 text-xs text-gray-700 dark:text-gray-300">
                      {selectedUnit.unitReview?.summaryPoints?.map((pt, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-emerald-600 font-bold">•</span>
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Tab 7: Assessment */}
              {activeTopicTab === 'assessment' && (
                <div className="space-y-3">
                  <h3 className={`text-sm font-black flex items-center gap-2 ${textPrimary}`}>
                    <Award className="w-4 h-4 text-rose-600" />
                    የምዕራፍ መመዘኛ ፈተና (Unit Assessment)
                  </h3>
                  <div className={`p-4 rounded-2xl border space-y-3 ${bgCard}`}>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                        {selectedUnit.unitAssessment?.instructions || 'የሚከተሉትን ጥያቄዎች በጥንቃቄ መልሱ።'}
                      </span>
                      <span className="text-[10px] text-gray-500">
                        ገጽ {selectedUnit.unitAssessment?.textbookPage}
                      </span>
                    </div>
                    <button
                      onClick={() => onStartLearning(selectedTopic!, selectedUnit, parentLesson!)}
                      className="w-full py-2.5 rounded-full text-xs font-black bg-[#6750A4] text-white hover:bg-[#523e85] transition-all cursor-pointer shadow-xs"
                    >
                      በመማሪያ ገጽ ፈተናውን ይጀምሩ
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
