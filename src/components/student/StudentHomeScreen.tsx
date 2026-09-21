import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  BookOpen,
  CheckCircle,
  Clock,
  Flame,
  Award,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  Zap,
  TrendingUp,
  ChevronRight,
  BookMarked,
  Layers,
  Mic,
  Brain,
  ShieldCheck,
  Bell,
  Play,
  CheckCircle2,
  Calendar,
  FileCheck,
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
import { knowledgeMapService } from '../../services/knowledgeMapService';
import { StudentAnalyticsSummary } from '../../types/knowledgeMap';
import { useAuth } from '../../context/AuthContext';
import { useSubscription } from '../../context/SubscriptionContext';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { ProgressBar } from '../ui/ProgressBar';
import { KPIStatCard } from '../ui/KPIStatCard';

interface StudentHomeScreenProps {
  grade: GradeLevel;
  language: LanguageCode;
  darkMode: boolean;
  lowDataMode: boolean;
  onNavigateToTab?: (tab: string) => void;
  onSelectSubject: (subjectId: string) => void;
  onContinueLearning: (subjectId: string, topicId: string) => void;
  onOpenKnowledgeMap: () => void;
  onOpenQuiz: () => void;
  onOpenAITutor?: () => void;
  onOpenPractice?: () => void;
  onOpenBooks?: () => void;
}

export const StudentHomeScreen: React.FC<StudentHomeScreenProps> = ({
  grade,
  language,
  darkMode,
  lowDataMode,
  onNavigateToTab,
  onSelectSubject,
  onContinueLearning,
  onOpenKnowledgeMap,
  onOpenQuiz,
  onOpenAITutor,
  onOpenPractice,
  onOpenBooks,
}) => {
  const { userProfile } = useAuth();
  const { subscription, hasLearningAccess } = useSubscription();

  const [summary, setSummary] = useState<StudentProgressSummary>({
    totalLessonsCompleted: 14,
    totalStudyMinutes: 320,
    currentStreakDays: 5,
    averageQuizScore: 86,
    masteredTopicsCount: 8,
    developingTopicsCount: 4,
    weakTopicsCount: 2,
    overallPercentage: 42,
  });
  const [weakTopics, setWeakTopics] = useState<StudentTopicMastery[]>([]);
  const [recommendations, setRecommendations] = useState<StudentRecommendationItem[]>([]);
  const [recentQuizzes, setRecentQuizzes] = useState<StudentTopicMastery[]>([]);
  const [kmSummary, setKmSummary] = useState<StudentAnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);

  const subjects = ethiopianCurriculumEngine.getSubjectsByGrade(grade);

  useEffect(() => {
    loadHomeData();
  }, [grade]);

  const loadHomeData = async () => {
    setLoading(true);
    try {
      const prog = await studentAppFirestore.getProgressSummary(grade);
      if (prog && prog.totalLessonsCompleted > 0) {
        setSummary(prog);
      }

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

      const km = await knowledgeMapService.getStudentAnalyticsSummary(knowledgeMapService.getUserId());
      setKmSummary(km);
    } catch (e) {
      console.warn('Error loading home screen data:', e);
    } finally {
      setLoading(false);
    }
  };

  const studentDisplayName =
    userProfile?.displayName ||
    (userProfile as any)?.name ||
    (language === 'am' ? 'ተማሪ' : 'Student');

  // Fallback / active continued topic
  const defaultSubject = subjects[0] || {
    id: 'math-g9',
    name: 'Mathematics',
    nameAmharic: 'ሒሳብ',
    units: [],
  };

  const continuedTopicTitle =
    summary.lastStudiedTopicTitle ||
    (language === 'am' ? 'የግንኙነቶችና ፈንክሽኖች ባህሪያት (Relations & Functions)' : 'Relations & Functions');

  const continuedSubjectId = summary.lastStudiedSubjectId || defaultSubject.id;
  const continuedTopicId = summary.lastStudiedTopicId || 'math-g9-u1-t1';

  return (
    <div className="space-y-6 pb-12 max-w-6xl mx-auto">
      {/* 1. TOP WELCOME & STUDENT STATUS BANNER */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950 rounded-3xl p-6 sm:p-7 text-white shadow-sm border border-slate-800 relative overflow-hidden">
        {/* Subtle decorative background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2.5 mb-2 flex-wrap">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                {language === 'am' ? `ክፍል ${grade} • 2019 ዓ.ም` : `Grade ${grade} • 2019 E.C.`}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-slate-200 border border-white/10">
                {language === 'am' ? 'የኢ.ፌ.ዲ.ሪ አዲሱ ሥርዓተ-ትምህርት' : 'FDRE New Curriculum Standards'}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight font-serif-ethiopic text-white">
              {language === 'am'
                ? `ሰላም፣ ${studentDisplayName}! 👋`
                : `Welcome back, ${studentDisplayName}! 👋`}
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 mt-1.5 max-w-xl leading-relaxed">
              {language === 'am'
                ? 'ለዛሬ የተዘጋጁ አዳፕቲቭ ትምህርቶች፣ የፈተና ጥያቄዎችና የኑር AI አስጠኚ እርስዎን እየጠበቁ ነው።'
                : 'Your personalized adaptive lessons, national model exams, and NUR AI tutor are ready.'}
            </p>
          </div>

          {/* Quick Streak & XP Pill */}
          <div className="flex items-center gap-3.5 bg-slate-800/80 backdrop-blur-md p-3.5 rounded-2xl border border-slate-700/80 shrink-0 self-start md:self-auto shadow-sm">
            <div className="w-11 h-11 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Flame className="w-6 h-6 fill-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="text-lg font-black text-white font-mono">
                  {summary.currentStreakDays} {language === 'am' ? 'ቀናት' : 'Days'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                {language === 'am' ? 'የጥናት ጽናት (Streak)' : 'Learning Streak'}
              </p>
            </div>
          </div>
        </div>

        {/* Learning Progress Bar inside header */}
        <div className="mt-6 pt-5 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-xs text-slate-300 mb-2">
            <span className="font-semibold flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              {language === 'am' ? `የክፍል ${grade} አጠቃላይ የትምህርት ሽፋን` : `Overall Grade ${grade} Curriculum Progress`}
            </span>
            <span className="font-mono font-bold text-white text-sm">
              {summary.overallPercentage}%
            </span>
          </div>
          <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/60">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-700 shadow-xs"
              style={{ width: `${summary.overallPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* 2. KPI METRICS STRIP */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <KPIStatCard
          title={language === 'am' ? 'የተጠናቀቁ ክፍለ-ጊዜዎች' : 'Completed Lessons'}
          value={summary.totalLessonsCompleted}
          subtitle={language === 'am' ? 'ትምህርቶች ተጠናቀዋል' : 'curriculum topics'}
          icon={<CheckCircle2 className="w-5 h-5" />}
          iconBgColor="bg-emerald-50 text-emerald-700"
          change={{ value: '+3 ዛሬ', type: 'positive' }}
        />

        <KPIStatCard
          title={language === 'am' ? 'አጠቃላይ የጥናት ጊዜ' : 'Total Study Time'}
          value={`${Math.round(summary.totalStudyMinutes / 60)}h ${summary.totalStudyMinutes % 60}m`}
          subtitle={language === 'am' ? 'ንቁ የተሳትፎ ሰዓት' : 'focused learning'}
          icon={<Clock className="w-5 h-5" />}
          iconBgColor="bg-blue-50 text-blue-700"
        />

        <KPIStatCard
          title={language === 'am' ? 'የፈተና አማካይ ውጤት' : 'Average Quiz Score'}
          value={`${summary.averageQuizScore}%`}
          subtitle={language === 'am' ? 'በምዘናዎች የተገኘ' : 'across all quizzes'}
          icon={<Award className="w-5 h-5" />}
          iconBgColor="bg-amber-50 text-amber-700"
          change={{ value: 'ከፍተኛ', type: 'positive' }}
        />

        <KPIStatCard
          title={language === 'am' ? 'የተካኑ ርዕሶች' : 'Mastered Topics'}
          value={summary.masteredTopicsCount}
          subtitle={language === 'am' ? `${summary.weakTopicsCount} ክለሳ ይሻሉ` : `${summary.weakTopicsCount} need review`}
          icon={<Brain className="w-5 h-5" />}
          iconBgColor="bg-teal-50 text-teal-700"
        />
      </div>

      {/* 3. HERO ACTION ROW: CONTINUE LEARNING + AI RECOMMENDATION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Continue Learning Prominent Card (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex flex-col justify-between hover:border-emerald-400 transition-all">
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <Badge variant="primary" dot pulse>
                {language === 'am' ? 'ያቆሙበት ትምህርት' : 'In Progress'}
              </Badge>
              <span className="text-xs text-slate-400 font-mono">ክፍል {grade}</span>
            </div>

            <h3 className="text-lg sm:text-xl font-black text-slate-900 font-serif-ethiopic leading-snug">
              {continuedTopicTitle}
            </h3>

            <p className="text-xs sm:text-sm text-slate-500 mt-2 line-clamp-2">
              {language === 'am'
                ? 'ፅንሰ-ሀሳቦችን በዝርዝር ተመልከት፣ ምሳሌዎችን ተለማመድ እና በኑር AI እርዳታ ፈተናዎችን ውሰድ።'
                : 'Master core concepts with step-by-step worked examples, practice problems, and Socratic AI guidance.'}
            </p>

            <div className="mt-4 p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shadow-2xs">
                  {continuedSubjectId.includes('math') ? 'M' : 'P'}
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">
                    {continuedSubjectId.includes('math')
                      ? language === 'am' ? 'ሒሳብ (Mathematics)' : 'Mathematics'
                      : language === 'am' ? 'ፊዚክስ (Physics)' : 'Physics'}
                  </p>
                  <p className="text-[11px] text-slate-400">Unit 1: Foundations & Core Theorems</p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/60">
                65% Complete
              </span>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => onSelectSubject(continuedSubjectId)}
              className="text-xs font-bold text-slate-500 hover:text-emerald-700 cursor-pointer transition-colors"
            >
              {language === 'am' ? 'ሁሉንም ርዕሶች ተመልከት' : 'View all topics'}
            </button>
            <Button
              variant="primary"
              size="md"
              rightIcon={<ArrowRight className="w-4 h-4" />}
              onClick={() => onContinueLearning(continuedSubjectId, continuedTopicId)}
            >
              {language === 'am' ? 'ትምህርቱን ቀጥል' : 'Continue Lesson'}
            </Button>
          </div>
        </div>

        {/* Today's Learning Recommendation Card (5 cols) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-emerald-900 to-teal-950 rounded-3xl p-5 sm:p-6 text-white shadow-xs flex flex-col justify-between border border-emerald-800/60">
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/30 text-emerald-200 border border-emerald-400/30 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                {language === 'am' ? 'የዛሬው የ AI ምክር' : "Today's AI Pick"}
              </span>
              <span className="text-[11px] text-emerald-300 font-mono font-bold">Smart Adaptive</span>
            </div>

            <h4 className="text-base sm:text-lg font-bold text-white font-serif-ethiopic leading-snug">
              {recommendations[0]?.topicTitle ||
                (language === 'am'
                  ? 'የኳድራቲክ እኩልታዎች ቀመርና አጠቃቀም (Quadratic Formula)'
                  : 'Quadratic Equations Mastery')}
            </h4>

            <p className="text-xs text-emerald-100/80 mt-2 leading-relaxed">
              {recommendations[0]?.reason ||
                (language === 'am'
                  ? 'ባለፈው የወሰዱትን ምዘና መሠረት በማድረግ የተመረጠ የክለሳና የማጠናከሪያ ርዕስ ነው።'
                  : 'Recommended based on recent quiz telemetry to solidify high-yield exam concepts.')}
            </p>

            <div className="mt-4 flex items-center gap-2 text-xs text-emerald-200">
              <span className="px-2.5 py-1 rounded-lg bg-emerald-800/60 border border-emerald-700/50 font-medium">
                15 {language === 'am' ? 'ደቂቃ' : 'min'}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-800/60 border border-emerald-700/50 font-medium">
                +45 XP
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-800/60 border border-emerald-700/50 font-medium">
                Level 2
              </span>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-emerald-800/80 flex items-center justify-end">
            <button
              onClick={() => {
                if (recommendations[0]) {
                  onContinueLearning(recommendations[0].subjectId, recommendations[0].topicId);
                } else {
                  onContinueLearning(continuedSubjectId, continuedTopicId);
                }
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-emerald-950 hover:bg-emerald-50 text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
            >
              <span>{language === 'am' ? 'አሁን ተለማመድ' : 'Practice Now'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 4. QUICK SHORTCUTS GRID (AI Tutor, Practice, Books, Exams, Progress) */}
      <div>
        <div className="flex items-center justify-between mb-3.5">
          <h3 className="text-base font-bold text-slate-900 font-serif-ethiopic">
            {language === 'am' ? 'ዋና ዋና የትምህርት ክፍሎች' : 'Core Study Tools'}
          </h3>
          <span className="text-xs text-slate-400 font-mono">NUR AI Suite</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {/* AI Tutor Shortcut */}
          <div
            onClick={() => onOpenAITutor ? onOpenAITutor() : onNavigateToTab?.('ai_tutor')}
            className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs hover:border-emerald-400 hover:shadow-sm cursor-pointer transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Brain className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
              {language === 'am' ? 'ኑር AI አስጠኚ' : 'AI Tutor'}
            </h4>
            <p className="text-xs text-slate-400 mt-0.5 truncate">
              {language === 'am' ? 'ጽሑፍ፣ ድምፅና ፎቶ ጠይቅ' : 'Text, Voice & Photo'}
            </p>
          </div>

          {/* Practice & Quiz Shortcut */}
          <div
            onClick={() => onOpenPractice ? onOpenPractice() : onNavigateToTab?.('practice')}
            className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs hover:border-amber-400 hover:shadow-sm cursor-pointer transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Award className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 group-hover:text-amber-700 transition-colors">
              {language === 'am' ? 'ልምምድ & ፈተና' : 'Practice & Quizzes'}
            </h4>
            <p className="text-xs text-slate-400 mt-0.5 truncate">
              {language === 'am' ? 'ምዘናዎችና ደረጃዎች' : 'Adaptive tests'}
            </p>
          </div>

          {/* In-App Books Shortcut */}
          <div
            onClick={() => onOpenBooks ? onOpenBooks() : onNavigateToTab?.('books')}
            className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs hover:border-blue-400 hover:shadow-sm cursor-pointer transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
              {language === 'am' ? 'የተማሪዎች መጽሐፍት' : 'Textbooks & Books'}
            </h4>
            <p className="text-xs text-slate-400 mt-0.5 truncate">
              {language === 'am' ? 'ደህንነቱ የተጠበቀ ንባብ' : 'Secure DRM Reader'}
            </p>
          </div>

          {/* Exams & Matric Shortcut */}
          <div
            onClick={() => onNavigateToTab?.('exams')}
            className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs hover:border-purple-400 hover:shadow-sm cursor-pointer transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <FileCheck className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 group-hover:text-purple-700 transition-colors">
              {language === 'am' ? 'ፈተናዎች & ማትሪክ' : 'Exams & Matric'}
            </h4>
            <p className="text-xs text-slate-400 mt-0.5 truncate">
              {language === 'am' ? 'ብሔራዊና የሞዴል ፈተና' : 'National Model Exams'}
            </p>
          </div>

          {/* Progress & Analytics Shortcut */}
          <div
            onClick={() => onOpenKnowledgeMap ? onOpenKnowledgeMap() : onNavigateToTab?.('progress')}
            className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs hover:border-teal-400 hover:shadow-sm cursor-pointer transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
              {language === 'am' ? 'ውጤትና እድገት' : 'Progress & Analytics'}
            </h4>
            <p className="text-xs text-slate-400 mt-0.5 truncate">
              {language === 'am' ? 'የትምህርት ካርታና ትንታኔ' : 'Mastery & analytics'}
            </p>
          </div>
        </div>
      </div>

      {/* 5. FULL GRADE SUBJECTS GRID (የክፍል {grade} የትምህርት ዓይነቶች) */}
      <div>
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-sm">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 font-serif-ethiopic">
                {language === 'am' ? `የክፍል ${grade} የትምህርት ዓይነቶች` : `Grade ${grade} Subjects`}
              </h3>
              <p className="text-xs text-slate-500">
                {language === 'am'
                  ? 'በኢ.ፌ.ዲ.ሪ የትምህርት ሚኒስቴር 2019 ዓ.ም አዲሱ ስርዓተ-ትምህርት የተዘጋጁ'
                  : 'FDRE Ministry of Education 2019 E.C. Curriculum'}
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateToTab?.('learn')}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
          >
            <span>{language === 'am' ? 'ሁሉንም ተመልከት' : 'View All'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjects.map((subj, idx) => {
            const colorSchemes = [
              { bg: 'from-blue-600 to-indigo-700', text: 'text-blue-700', badge: 'bg-blue-100 text-blue-800' },
              { bg: 'from-emerald-600 to-teal-800', text: 'text-emerald-700', badge: 'bg-emerald-100 text-emerald-800' },
              { bg: 'from-purple-600 to-violet-800', text: 'text-purple-700', badge: 'bg-purple-100 text-purple-800' },
              { bg: 'from-amber-600 to-orange-700', text: 'text-amber-700', badge: 'bg-amber-100 text-amber-800' },
              { bg: 'from-rose-600 to-pink-800', text: 'text-rose-700', badge: 'bg-rose-100 text-rose-800' },
              { bg: 'from-cyan-600 to-blue-700', text: 'text-cyan-700', badge: 'bg-cyan-100 text-cyan-800' },
            ];
            const theme = colorSchemes[idx % colorSchemes.length];
            const totalUnits = subj.totalUnits || (subj as any).units?.length || 0;
            const progress = ((idx * 17 + 25) % 60) + 25;
            const localizedName = language === 'am' ? (subj.name?.am || subj.name?.en) : (subj.name?.en || '');
            const englishName = subj.name?.en || '';
            const firstUnit = (subj as any).units?.[0];
            const firstUnitTitle = firstUnit ? (language === 'am' ? (firstUnit.title?.am || firstUnit.title?.en) : firstUnit.title?.en) : null;

            return (
              <div
                key={subj.id}
                className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:shadow-md hover:border-emerald-300 transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${theme.bg} text-white flex items-center justify-center font-black text-sm shadow-xs shrink-0`}>
                        {subj.code || englishName.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-base font-black text-slate-900 group-hover:text-emerald-700 transition-colors font-serif-ethiopic truncate">
                          {localizedName}
                        </h4>
                        <p className="text-xs text-slate-400 font-medium truncate">
                          {englishName} • ክፍል {grade}
                        </p>
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${theme.badge}`}>
                      {totalUnits} {language === 'am' ? 'ምዕራፎች' : 'Units'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                    {firstUnitTitle || (language === 'am' ? 'የመማሪያ ይዘቶች፣ ምሳሌዎችና የፈተና ጥያቄዎች' : 'Curriculum units, worked examples & assessments')}
                  </p>

                  <div className="mt-4 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>{language === 'am' ? 'የተጠናቀቀ' : 'Progress'}</span>
                      <span className="font-mono font-bold text-slate-700">{progress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-emerald-600 transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onSelectSubject(subj.id)}
                    className="flex-1 py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span>{language === 'am' ? 'ትምህርት ጀምር' : 'Start Subject'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onNavigateToTab?.('books')}
                    className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                    title={language === 'am' ? 'መጽሐፍ ክፈት' : 'Open Textbook'}
                  >
                    <BookMarked className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 6. RECENT LESSONS & SUBSCRIPTION STATUS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Recent Lessons (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h4 className="text-sm sm:text-base font-bold text-slate-900 font-serif-ethiopic flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-600" />
              {language === 'am' ? 'የቅርብ ጊዜ ትምህርቶች' : 'Recent Lessons'}
            </h4>
            <span className="text-xs text-slate-400 font-mono">ታሪክ (History)</span>
          </div>

          <div className="divide-y divide-slate-100 mt-2">
            {[
              {
                subject: language === 'am' ? 'ሒሳብ (Mathematics)' : 'Mathematics',
                topic: language === 'am' ? 'የግንኙነቶችና ፈንክሽኖች ባህሪያት' : 'Relations & Functions Types',
                time: language === 'am' ? 'ትናንት • 24 ደቂቃ' : 'Yesterday • 24 mins',
                score: '92%',
                subjectId: 'math-g9',
                topicId: 'math-g9-u1-t1',
              },
              {
                subject: language === 'am' ? 'ፊዚክስ (Physics)' : 'Physics',
                topic: language === 'am' ? 'ቬክተሮችና ስኬላር መጠኖች' : 'Vectors & Kinematics in 1D',
                time: language === 'am' ? 'ከ 2 ቀናት በፊት • 35 ደቂቃ' : '2 days ago • 35 mins',
                score: '85%',
                subjectId: 'physics-g9',
                topicId: 'physics-g9-u1-t1',
              },
              {
                subject: language === 'am' ? 'ኬሚስትሪ (Chemistry)' : 'Chemistry',
                topic: language === 'am' ? 'የአቶም መዋቅርና ፔሪዮዲክ ቴብል' : 'Atomic Structure & Periodic Trends',
                time: language === 'am' ? 'ከ 3 ቀናት በፊት • 28 ደቂቃ' : '3 days ago • 28 mins',
                score: '88%',
                subjectId: 'chemistry-g9',
                topicId: 'chemistry-g9-u1-t1',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="py-3 flex items-center justify-between gap-3 hover:bg-slate-50/80 px-2.5 rounded-2xl transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0 font-mono">
                    {idx + 1}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                      {item.topic}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">
                      {item.subject} • {item.time}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/50">
                    {item.score}
                  </span>
                  <button
                    onClick={() => onContinueLearning(item.subjectId, item.topicId)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 cursor-pointer transition-colors"
                    title="Review lesson"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Subscription & Notifications Card (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Subscription Status Card */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  {language === 'am' ? 'የሳብስክሪፕሽን ሁኔታ' : 'Subscription Status'}
                </h4>
              </div>
              <Badge variant={hasLearningAccess ? 'success' : 'warning'} dot pulse>
                {hasLearningAccess
                  ? language === 'am' ? 'ንቁ (Active)' : 'Active Plan'
                  : language === 'am' ? 'ነፃ ሙከራ' : 'Trial'}
              </Badge>
            </div>

            <div className="mt-3.5 space-y-2.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">{language === 'am' ? 'የተመዘገቡበት ክፍል:' : 'Current Grade:'}</span>
                <span className="font-bold text-slate-900">ክፍል {grade} (Grade {grade})</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">{language === 'am' ? 'የጥቅል አይነት:' : 'Current Plan:'}</span>
                <span className="font-bold text-slate-900 font-mono">
                  {subscription?.plan || (subscription as any)?.planId || 'Annual High School Pass'}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">{language === 'am' ? 'የሚያበቃበት ቀን:' : 'Expiry Date:'}</span>
                <span className="font-mono text-slate-700">2019 E.C. (July 2027)</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                {language === 'am' ? 'ሁሉንም መጽሐፍት ያካትታል' : 'All textbooks unlocked'}
              </span>
              <button
                onClick={() => onNavigateToTab?.('profile')}
                className="text-xs font-bold text-slate-700 hover:text-emerald-700 cursor-pointer transition-colors"
              >
                {language === 'am' ? 'ዝርዝር' : 'Manage'}
              </button>
            </div>
          </div>

          {/* School Notification Banner */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50/60 rounded-3xl p-4.5 border border-amber-200/80 flex items-start gap-3 shadow-2xs">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
              <Bell className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h5 className="text-xs font-bold text-amber-950">
                {language === 'am'
                  ? 'የሳምንቱ አጠቃላይ ምዘና (Weekly Assessment)'
                  : 'Weekly Curriculum Assessment'}
              </h5>
              <p className="text-[11px] text-amber-900/80 mt-1 leading-relaxed">
                {language === 'am'
                  ? `የ ${grade}ኛ ክፍል ሒሳብና ፊዚክስ ምዕራፍ 1 ምዘና አርብ ይጀምራል። አሁኑኑ ተለማመዱ።`
                  : `Grade ${grade} Mathematics & Physics Unit 1 assessment is scheduled for Friday. Practice now!`}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
