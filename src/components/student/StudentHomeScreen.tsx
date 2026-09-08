import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  BookOpen,
  CheckCircle,
  Clock,
  Flame,
  Award,
  AlertTriangle,
  Compass,
  ArrowRight,
  RefreshCw,
  Zap,
  TrendingUp,
  Download,
  ChevronRight,
  BookMarked,
  Layers,
} from 'lucide-react';
import { GradeLevel } from '../../types/curriculumEngine';
import { LanguageCode } from '../../types';
import {
  StudentProgressSummary,
  StudentTopicMastery,
  StudentRecommendationItem,
} from '../../types/studentApp';
import { studentAppFirestore } from '../../services/studentAppFirestore';
import { ethiopianCurriculumEngine } from '../../engine/curriculumRegistry';

interface StudentHomeScreenProps {
  grade: GradeLevel;
  language: LanguageCode;
  darkMode: boolean;
  lowDataMode: boolean;
  onSelectSubject: (subjectId: string) => void;
  onContinueLearning: (subjectId: string, topicId: string) => void;
  onOpenKnowledgeMap: () => void;
  onOpenQuiz: () => void;
}

export const StudentHomeScreen: React.FC<StudentHomeScreenProps> = ({
  grade,
  language,
  darkMode,
  lowDataMode,
  onSelectSubject,
  onContinueLearning,
  onOpenKnowledgeMap,
  onOpenQuiz,
}) => {
  const [summary, setSummary] = useState<StudentProgressSummary>({
    totalLessonsCompleted: 0,
    totalStudyMinutes: 0,
    currentStreakDays: 1,
    averageQuizScore: 0,
    masteredTopicsCount: 0,
    developingTopicsCount: 0,
    weakTopicsCount: 0,
    overallPercentage: 0,
  });
  const [weakTopics, setWeakTopics] = useState<StudentTopicMastery[]>([]);
  const [recommendations, setRecommendations] = useState<StudentRecommendationItem[]>([]);
  const [recentQuizzes, setRecentQuizzes] = useState<StudentTopicMastery[]>([]);
  const [loading, setLoading] = useState(true);

  const subjects = ethiopianCurriculumEngine.getSubjectsByGrade(grade);

  useEffect(() => {
    loadHomeData();
  }, [grade]);

  const loadHomeData = async () => {
    setLoading(true);
    try {
      const prog = await studentAppFirestore.getProgressSummary(grade);
      setSummary(prog);

      const masteries = await studentAppFirestore.getAllTopicMasteries();
      const weak = masteries.filter((m) => m.needsRevision);
      setWeakTopics(weak);

      const quizzes = masteries
        .filter((m) => m.attemptsCount > 0)
        .sort((a, b) => new Date(b.lastStudiedAt).getTime() - new Date(a.lastStudiedAt).getTime())
        .slice(0, 4);
      setRecentQuizzes(quizzes);

      const recs = studentAppFirestore.getLocalRecommendations();
      setRecommendations(recs);
    } catch (e) {
      console.warn('Error loading home screen data:', e);
    } finally {
      setLoading(false);
    }
  };

  // Language dictionary for Home Screen
  const labels: Record<string, Record<string, string>> = {
    welcome: {
      en: 'Welcome back, Student!',
      am: 'እንኳን ደህና መጣህ ተማሪዬ!',
      om: 'Baga nagaan deebite, Barataa!',
      ti: 'እንቋዕ ብደሓን መጻእኻ ተምሃራይ!',
    },
    subtitle: {
      en: 'FDRE Ministry of Education New Secondary Curriculum • Personalized with NUR AI',
      am: 'የኢ.ፌ.ዲ.ሪ ትምህርት ሚኒስቴር አዲሱ ሁለተኛ ደረጃ ሥርዓተ-ትምህርት • በኑር AI የተደገፈ',
      om: 'Sirna Barnootaa Haarawaa Ministeera Barnootaa • NUR AI tiin deeggarame',
      ti: 'ሓድሽ ስርዓተ ትምህርቲ ሚኒስትሪ ትምህርቲ • ብኑር AI ዝተደገፈ',
    },
    continueLearning: {
      en: 'Continue Learning',
      am: 'ካቆሙበት ይቀጥሉ',
      om: 'Barnoota Itti Fufi',
      ti: 'ካብቲ ዘቋረጽካዮ ቀጽል',
    },
    todaysLesson: {
      en: "Today's Focus Lesson",
      am: 'የዛሬው የትኩረት ትምህርት',
      om: 'Barnoota Har’aa',
      ti: 'ናይ ሎሚ ትምህርቲ',
    },
    progressOverview: {
      en: 'Learning Progress',
      am: 'የትምህርት ሂደትና እድገት',
      om: 'Adeemsa Barnootaa',
      ti: 'ዕቤት ትምህርቲ',
    },
    weakTopicsTitle: {
      en: 'Needs Revision (Weak Topics)',
      am: 'ክለሳ የሚሹ ርዕሶች (ደካማ ጎኖች)',
      om: 'Mata duree irra deebii barbaadan',
      ti: 'ክለሳ ዘድልዮም ኣርእስታት',
    },
    recommendedLessons: {
      en: 'AI Adaptive Recommendations',
      am: 'የኑር AI አዳፕቲቭ ምክሮች',
      om: 'Gorsa AI NUR',
      ti: 'ምኽሪ AI ኑር',
    },
    recentScores: {
      en: 'Recent Quiz Results',
      am: 'የቅርብ ጊዜ የፈተና ውጤቶች',
      om: 'Qabxii Qormaataa Dhihoo',
      ti: 'ናይ ቀረባ ጊዜ ውጽኢታት ፈተና',
    },
    subjectsTitle: {
      en: 'Grade Subjects',
      am: 'የክፍሉ የትምህርት ዓይነቶች',
      om: 'Barnoota Kutaa',
      ti: 'ናይቲ ክፍሊ ዓይነታት ትምህርቲ',
    },
  };

  const getLabel = (key: string) => labels[key]?.[language] || labels[key]?.['en'] || key;

  // Active theme classes based on Material 3 design system
  const bgCard = darkMode ? 'bg-[#211F26] border-[#36343B]' : 'bg-white border-[#E6E0E9]';
  const textPrimary = darkMode ? 'text-[#E6E1E5]' : 'text-[#1D1B20]';
  const textSecondary = darkMode ? 'text-[#CAC4D0]' : 'text-[#49454F]';
  const primaryContainer = darkMode ? 'bg-[#4F378B] text-[#EADDFF]' : 'bg-[#EADDFF] text-[#21005D]';

  // Sample focus lesson for Today's Lesson
  const firstSubject = subjects[0];
  const firstTopic = firstSubject?.units[0]?.sections[0]?.lessons[0]?.topics[0];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 sm:space-y-8">
      {/* 1. M3 Welcome Banner Card */}
      <section
        id="student-welcome-banner"
        className={`rounded-3xl p-6 sm:p-8 border-[1.5px] transition-all relative overflow-hidden shadow-sm ${
          darkMode
            ? 'bg-gradient-to-r from-[#2B2735] via-[#211F26] to-[#1E1B24] border-[#49454F]'
            : 'bg-gradient-to-r from-[#F7F2FA] via-[#FEF7FF] to-[#EADDFF]/40 border-[#D0BCFF]'
        }`}
      >
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-extrabold tracking-wide uppercase bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>NUR AI • ክፍል {grade} (Grade {grade})</span>
            </div>
            <h1 className={`text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight ${textPrimary}`}>
              {getLabel('welcome')}
            </h1>
            <p className={`text-xs sm:text-sm font-medium ${textSecondary}`}>
              {getLabel('subtitle')}
            </p>
          </div>

          {/* Quick Action Chips */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={onOpenKnowledgeMap}
              className={`px-4 py-2.5 rounded-full text-xs font-extrabold transition-all flex items-center gap-2 shadow-xs cursor-pointer ${primaryContainer} hover:opacity-90 active:scale-95`}
            >
              <Compass className="w-4 h-4" />
              <span>የእውቀት ካርታ (Knowledge Map)</span>
            </button>
            <button
              onClick={onOpenQuiz}
              className="px-4 py-2.5 rounded-full text-xs font-extrabold bg-[#6750A4] text-white hover:bg-[#523e85] transition-all flex items-center gap-2 shadow-xs cursor-pointer active:scale-95"
            >
              <Award className="w-4 h-4" />
              <span>ፈተና ውሰድ (Take Quiz)</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. Top Grid: Continue Learning + Today's Lesson */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Continue Learning Card */}
        <div
          id="student-continue-learning-card"
          className={`rounded-3xl p-5 sm:p-6 border-[1.5px] shadow-xs flex flex-col justify-between transition-all ${bgCard}`}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-[#7D5260] dark:text-[#FFD8E4] flex items-center gap-1.5">
                <BookMarked className="w-4 h-4 text-purple-600" />
                {getLabel('continueLearning')}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-purple-100 text-purple-900 dark:bg-purple-900/50 dark:text-purple-200">
                {summary.lastStudiedSubjectId ? 'ተጀምሯል' : 'አዲስ ጀምር'}
              </span>
            </div>

            <div>
              <h3 className={`text-lg sm:text-xl font-bold ${textPrimary}`}>
                {summary.lastStudiedTopicTitle || (firstTopic?.title[language] || firstTopic?.title.en || 'Linear Equations')}
              </h3>
              <p className={`text-xs ${textSecondary} mt-1`}>
                የመማሪያ መጽሐፍ ገጽ {firstTopic?.textbookPage || 15} • ፅንሰ-ሀሳብ፣ ምሳሌዎች እና ልምምዶች
              </p>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-[#E6E0E9] dark:border-[#36343B] flex items-center justify-between">
            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" />
              ስርዓተ-ትምህርት ዝግጁ
            </span>
            <button
              onClick={() =>
                onContinueLearning(
                  summary.lastStudiedSubjectId || firstSubject?.id || 'math-g9',
                  summary.lastStudiedTopicId || firstTopic?.id || 'topic-math-1'
                )
              }
              className="px-4 py-2 rounded-full text-xs font-extrabold bg-[#6750A4] text-white hover:bg-[#523e85] transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
            >
              <span>አሁን አጥና</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Today's Focus Lesson Card */}
        <div
          id="student-todays-lesson-card"
          className={`rounded-3xl p-5 sm:p-6 border-[1.5px] shadow-xs flex flex-col justify-between transition-all ${bgCard}`}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-[#B3261E] dark:text-[#F2B8B5] flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-amber-600" />
                {getLabel('todaysLesson')}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-900 dark:bg-amber-900/50 dark:text-amber-200">
                የቀኑ ምርጥ
              </span>
            </div>

            <div>
              <h3 className={`text-lg sm:text-xl font-bold ${textPrimary}`}>
                {firstSubject ? `${firstSubject.name[language] || firstSubject.name.en} - ${firstSubject.units[0]?.title[language] || firstSubject.units[0]?.title.en}` : 'Mathematics'}
              </h3>
              <p className={`text-xs ${textSecondary} mt-1`}>
                የዕለቱ የትኩረት ርዕስ፡ {firstTopic?.title[language] || firstTopic?.title.en || 'የስርዓተ-ትምህርት መግቢያ'}
              </p>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-[#E6E0E9] dark:border-[#36343B] flex items-center justify-between">
            <span className="text-xs font-medium text-[#49454F] dark:text-[#CAC4D0] flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-indigo-500" />
              የተመደበ ጊዜ፡ 40 ደቂቃ
            </span>
            <button
              onClick={() =>
                onContinueLearning(
                  firstSubject?.id || 'math-g9',
                  firstTopic?.id || 'topic-math-1'
                )
              }
              className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${primaryContainer} hover:opacity-90 active:scale-95`}
            >
              <span>ጀምር</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Progress Summary Grid (Material 3 Cards) */}
      <section id="student-progress-summary">
        <h2 className={`text-base sm:text-lg font-black tracking-tight mb-3 flex items-center gap-2 ${textPrimary}`}>
          <TrendingUp className="w-4 h-4 text-[#6750A4]" />
          <span>{getLabel('progressOverview')}</span>
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className={`p-4 rounded-2xl border-[1.5px] shadow-xs space-y-1 ${bgCard}`}>
            <span className="text-xs font-bold text-[#49454F] dark:text-[#CAC4D0] block">የተጠናቀቁ ትምህርቶች</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-black text-[#6750A4]">{summary.totalLessonsCompleted}</span>
              <span className="text-xs font-bold text-gray-500">ትምህርት</span>
            </div>
          </div>

          <div className={`p-4 rounded-2xl border-[1.5px] shadow-xs space-y-1 ${bgCard}`}>
            <span className="text-xs font-bold text-[#49454F] dark:text-[#CAC4D0] block">የጥናት ጊዜ</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-black text-amber-600">{summary.totalStudyMinutes}</span>
              <span className="text-xs font-bold text-gray-500">ደቂቃ</span>
            </div>
          </div>

          <div className={`p-4 rounded-2xl border-[1.5px] shadow-xs space-y-1 ${bgCard}`}>
            <span className="text-xs font-bold text-[#49454F] dark:text-[#CAC4D0] block">አጠቃላይ የፈተና አማካይ</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-black text-emerald-600">{summary.averageQuizScore}%</span>
              <span className="text-xs font-bold text-gray-500">አማካይ</span>
            </div>
          </div>

          <div className={`p-4 rounded-2xl border-[1.5px] shadow-xs space-y-1 ${bgCard}`}>
            <span className="text-xs font-bold text-[#49454F] dark:text-[#CAC4D0] block">የነቃ የቀን ስትሪክ</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-black text-rose-600">{summary.currentStreakDays}</span>
              <span className="text-xs font-bold text-gray-500">ቀናት 🔥</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Adaptive Alerts: Weak Topics & Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Weak Topics Card */}
        <section
          id="student-weak-topics-section"
          className={`rounded-3xl p-5 sm:p-6 border-[1.5px] shadow-xs space-y-3 ${
            darkMode ? 'bg-[#291A1E] border-[#8C1D18]/40' : 'bg-[#FFF0EE] border-[#FFDAD6]'
          }`}
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm sm:text-base font-extrabold text-[#BA1A1A] dark:text-[#FFB4AB] flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#BA1A1A]" />
              <span>{getLabel('weakTopicsTitle')}</span>
            </h3>
            <span className="text-xs font-extrabold px-2 py-0.5 rounded-full bg-rose-200 text-rose-900 dark:bg-rose-900/60 dark:text-rose-200">
              {weakTopics.length} ርዕሶች
            </span>
          </div>

          {weakTopics.length === 0 ? (
            <div className="py-6 text-center text-xs text-[#7A7060] dark:text-[#CAC4D0]">
              <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto mb-1.5 opacity-80" />
              <p className="font-bold">ምንም የተመዘገበ የደካማ ርዕስ ክፍተት የለም! ጥሩ እየተማሩ ነው።</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {weakTopics.slice(0, 3).map((w) => (
                <div
                  key={w.topicId}
                  className={`p-3 rounded-2xl border flex items-center justify-between gap-3 ${
                    darkMode ? 'bg-[#211F26] border-[#49454F]' : 'bg-white border-[#E6E0E9]'
                  }`}
                >
                  <div>
                    <h4 className={`text-xs font-bold ${textPrimary}`}>{w.topicTitle}</h4>
                    <span className="text-[11px] text-rose-600 font-extrabold block">
                      የውጤት መጠን፡ {w.masteryScore}% (ደካማ ርዕስ)
                    </span>
                  </div>
                  <button
                    onClick={() => onContinueLearning(w.subjectId, w.topicId)}
                    className="px-3 py-1.5 rounded-full text-[11px] font-extrabold bg-[#BA1A1A] text-white hover:bg-[#93000A] transition-all cursor-pointer whitespace-nowrap shadow-xs"
                  >
                    ክለሳ ጀምር
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Adaptive Recommendations Card */}
        <section
          id="student-recommendations-section"
          className={`rounded-3xl p-5 sm:p-6 border-[1.5px] shadow-xs space-y-3 ${
            darkMode ? 'bg-[#1D2526] border-[#004F58]/40' : 'bg-[#E6F7F9] border-[#A6EEF8]'
          }`}
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm sm:text-base font-extrabold text-[#006874] dark:text-[#80D5E3] flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#006874]" />
              <span>{getLabel('recommendedLessons')}</span>
            </h3>
            <span className="text-xs font-extrabold px-2 py-0.5 rounded-full bg-teal-200 text-teal-900 dark:bg-teal-900/60 dark:text-teal-200">
              {recommendations.length} ምክሮች
            </span>
          </div>

          {recommendations.length === 0 ? (
            <div className="py-6 text-center text-xs text-[#7A7060] dark:text-[#CAC4D0]">
              <Sparkles className="w-8 h-8 text-teal-600 mx-auto mb-1.5 opacity-80" />
              <p className="font-bold">ትምህርቶችን ሲያጠኑ ኑር AI ብጁ ምክሮችን እዚህ ያዘጋጅልዎታል።</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {recommendations.slice(0, 3).map((rec) => (
                <div
                  key={rec.id}
                  className={`p-3 rounded-2xl border flex items-center justify-between gap-3 ${
                    darkMode ? 'bg-[#211F26] border-[#49454F]' : 'bg-white border-[#E6E0E9]'
                  }`}
                >
                  <div>
                    <h4 className={`text-xs font-bold ${textPrimary}`}>{rec.topicTitle}</h4>
                    <p className="text-[11px] text-[#49454F] dark:text-[#CAC4D0] line-clamp-1">{rec.reason}</p>
                  </div>
                  <button
                    onClick={() => onContinueLearning(rec.subjectId, rec.topicId)}
                    className="px-3 py-1.5 rounded-full text-[11px] font-extrabold bg-[#006874] text-white hover:bg-[#004F58] transition-all cursor-pointer whitespace-nowrap shadow-xs"
                  >
                    ይህን አጥና
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* 5. Subjects Grid (Grade -> Subject -> Units -> Lessons -> Topics) */}
      <section id="student-subjects-grid-section">
        <div className="flex items-center justify-between mb-4">
          <h2 className={`text-base sm:text-lg font-black tracking-tight flex items-center gap-2 ${textPrimary}`}>
            <BookOpen className="w-5 h-5 text-[#6750A4]" />
            <span>{getLabel('subjectsTitle')} ({subjects.length})</span>
          </h2>
          <span className="text-xs font-bold text-[#6750A4] dark:text-[#D0BCFF]">
            ክፍል {grade} አዲሱ ስርዓተ-ትምህርት
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjects.map((sub) => {
            const unitsCount = sub.units.length;
            const totalTopics = sub.units.reduce(
              (acc, u) =>
                acc +
                u.sections.reduce(
                  (sacc, s) => sacc + s.lessons.reduce((lacc, l) => lacc + l.topics.length, 0),
                  0
                ),
              0
            );

            return (
              <div
                key={sub.id}
                onClick={() => onSelectSubject(sub.id)}
                className={`group rounded-3xl p-5 border-[1.5px] transition-all duration-200 cursor-pointer shadow-xs hover:shadow-md hover:-translate-y-0.5 ${bgCard} hover:border-[#6750A4]`}
              >
                <div className="flex items-start justify-between">
                  <div className="p-3 rounded-2xl bg-[#EADDFF]/50 text-[#21005D] dark:bg-[#4F378B]/40 dark:text-[#EADDFF] group-hover:scale-105 transition-transform">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase bg-[#E6E0E9] text-[#49454F] dark:bg-[#36343B] dark:text-[#CAC4D0]">
                    {unitsCount} ምዕራፎች
                  </span>
                </div>

                <div className="mt-4 space-y-1">
                  <h3 className={`text-base font-extrabold group-hover:text-[#6750A4] transition-colors ${textPrimary}`}>
                    {sub.name[language] || sub.name.en}
                  </h3>
                  <p className={`text-xs ${textSecondary} line-clamp-1`}>
                    {sub.textbookTitle}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#E6E0E9] dark:border-[#36343B] flex items-center justify-between text-xs font-bold">
                  <span className="text-[#49454F] dark:text-[#CAC4D0]">
                    {totalTopics} የተመደቡ ርዕሶች
                  </span>
                  <span className="text-[#6750A4] dark:text-[#D0BCFF] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    ክፈት <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. Recent Quiz Scores */}
      {recentQuizzes.length > 0 && (
        <section id="student-recent-quizzes">
          <h3 className={`text-base font-black tracking-tight mb-3 flex items-center gap-2 ${textPrimary}`}>
            <Award className="w-4 h-4 text-purple-600" />
            <span>{getLabel('recentScores')}</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {recentQuizzes.map((q) => (
              <div
                key={q.topicId}
                className={`p-4 rounded-2xl border-[1.5px] shadow-xs flex items-center justify-between ${bgCard}`}
              >
                <div>
                  <h4 className={`text-xs font-bold truncate max-w-[160px] ${textPrimary}`}>{q.topicTitle}</h4>
                  <span className="text-[10px] text-[#7A7060] dark:text-[#CAC4D0] block">
                    {new Date(q.lastStudiedAt).toLocaleDateString()}
                  </span>
                </div>
                <div
                  className={`px-2.5 py-1 rounded-full text-xs font-black ${
                    q.masteryScore >= 80
                      ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-900/60 dark:text-emerald-200'
                      : q.masteryScore < 60
                      ? 'bg-rose-100 text-rose-900 dark:bg-rose-900/60 dark:text-rose-200'
                      : 'bg-amber-100 text-amber-900 dark:bg-amber-900/60 dark:text-amber-200'
                  }`}
                >
                  {q.masteryScore}%
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
