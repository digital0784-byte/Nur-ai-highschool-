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
  Camera,
  Compass,
  Bookmark,
  HardDrive,
  User,
  Settings,
  Star,
  Target,
  GraduationCap,
  LogOut,
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

export interface StudentHomeScreenProps {
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
  onOpenExams?: () => void;
  onOpenPhotoSolver?: () => void;
  onOpenVoiceTutor?: () => void;
  onOpenEntranceExam?: () => void;
  onOpenProgress?: () => void;
  onOpenProfile?: () => void;
  onOpenSettings?: () => void;
  onOpenBookmarks?: () => void;
  onOpenOfflineManager?: () => void;
  onLogout?: () => void;
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
  onOpenExams,
  onOpenPhotoSolver,
  onOpenVoiceTutor,
  onOpenEntranceExam,
  onOpenProgress,
  onOpenProfile,
  onOpenSettings,
  onOpenBookmarks,
  onOpenOfflineManager,
  onLogout,
}) => {
  const { userProfile, logout } = useAuth();
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
  const [bookmarks, setBookmarks] = useState([
    { id: 'bm1', title: 'Quadratic Equation Formula & Proof', subject: 'Mathematics', topicId: 'math-g9-u1-t1', subjectId: 'math-g9' },
    { id: 'bm2', title: 'Newtonian Kinematic Equations', subject: 'Physics', topicId: 'physics-g9-u1-t1', subjectId: 'physics-g9' },
    { id: 'bm3', title: 'Periodic Table Group Characteristics', subject: 'Chemistry', topicId: 'chem-g9-u1-t1', subjectId: 'chemistry-g9' },
  ]);
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
      setWeakTopics(
        weak.length > 0
          ? weak
          : [
              {
                topicId: 'math-g9-u2-t3',
                topicTitle: 'Inverse Functions & Domain Restrictions',
                masteryScore: 48,
                attemptsCount: 3,
                lastStudiedAt: new Date().toISOString(),
                needsRevision: true,
                subjectId: 'math-g9',
              } as any,
              {
                topicId: 'physics-g9-u1-t4',
                topicTitle: 'Vector Resolution in 2D Space',
                masteryScore: 52,
                attemptsCount: 2,
                lastStudiedAt: new Date().toISOString(),
                needsRevision: true,
                subjectId: 'physics-g9',
              } as any,
            ]
      );
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
      {/* ========================================================================= */}
      {/* 1. WELCOME MESSAGE & 2. GRADE HEADER BANNER */}
      {/* ========================================================================= */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950 rounded-3xl p-6 sm:p-7 text-white shadow-sm border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2.5 mb-2 flex-wrap">
              {/* Requirement 12 item 2: Grade */}
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5 font-mono">
                <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
                {language === 'am' ? `ክፍል ${grade}` : `Grade ${grade}`}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-800/80 text-slate-300 border border-slate-700/80">
                {language === 'am' ? '2019 ዓ.ም አዲሱ ስርዓተ-ትምህርት' : '2019 E.C. Ethiopian Curriculum'}
              </span>
              {/* Requirement 12 item 17: Gamification Streak */}
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold font-mono">
                <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400 animate-pulse" />
                <span>{summary.currentStreakDays} {language === 'am' ? 'ቀን በተከታታይ' : 'Day Streak'}</span>
              </div>
            </div>

            {/* Requirement 12 item 1: Welcome Message */}
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-white font-serif-ethiopic">
              {language === 'am'
                ? `እንኳን ደህና መጣህ፣ ${studentDisplayName}!`
                : `Welcome back, ${studentDisplayName}!`}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1.5 font-serif-ethiopic max-w-xl">
              {language === 'am'
                ? `የዛሬው የክፍል ${grade} የትምህርት ክፍለ-ጊዜ ተዘጋጅቷል። በ AI አስጠኚ እገዛ አዳዲስ ፅንሰ-ሀሳቦችን ይማሩ።`
                : `Your personalized Grade ${grade} learning track is ready. Start your session with Socratic AI guidance.`}
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => onContinueLearning(continuedSubjectId, continuedTopicId)}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs sm:text-sm transition-all shadow-md shadow-emerald-950/40 cursor-pointer active:scale-95"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              <span>{language === 'am' ? 'ትምህርት ጀምር' : 'Start Session'}</span>
            </button>

            {/* Quick Logout from Home Banner */}
            <button
              onClick={() => (onLogout ? onLogout() : logout?.())}
              title={language === 'am' ? 'ከመለያ ውጣ (Logout)' : 'Logout'}
              className="inline-flex items-center gap-1.5 px-3.5 py-3 rounded-2xl bg-white/10 hover:bg-rose-500/25 hover:border-rose-400/40 border border-white/15 text-rose-300 hover:text-white font-bold text-xs transition-all cursor-pointer active:scale-95 shadow-sm"
            >
              <LogOut className="w-4 h-4 text-rose-400" />
              <span className="hidden sm:inline">{language === 'am' ? 'ውጣ' : 'Logout'}</span>
            </button>
          </div>
        </div>

        {/* Learning Progress Bar (Requirement 12 item 13: Progress) */}
        <div className="mt-6 pt-5 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-xs text-slate-300 mb-2">
            <span className="font-semibold flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              {language === 'am' ? `የክፍል ${grade} አጠቃላይ የትምህርት ሽፋን (Progress)` : `Grade ${grade} Curriculum Progress`}
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

      {/* ========================================================================= */}
      {/* 13. PROGRESS KPI STATS STRIP */}
      {/* ========================================================================= */}
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

      {/* ========================================================================= */}
      {/* 3. CONTINUE LEARNING + 4. TODAY'S LESSON (Recommendations) */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Continue Learning Prominent Card (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex flex-col justify-between hover:border-emerald-400 transition-all">
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <Badge variant="primary" dot pulse>
                {language === 'am' ? 'ያቆሙበት ትምህርት (Continue Learning)' : 'In Progress'}
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
              {language === 'am' ? 'ትምህርቱን ቀጥል (Continue)' : 'Continue Lesson'}
            </Button>
          </div>
        </div>

        {/* 4. Today's Lesson / Recommendation Card (5 cols) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-emerald-900 to-teal-950 rounded-3xl p-5 sm:p-6 text-white shadow-xs flex flex-col justify-between border border-emerald-800/60">
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/30 text-emerald-200 border border-emerald-400/30 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                {language === 'am' ? "የዛሬው የ AI ክፍለ-ትምህርት (Today's Lesson)" : "Today's Lesson"}
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
              <span className="px-2.5 py-1 rounded-lg bg-emerald-800/60 border border-emerald-700/50 font-medium font-mono">
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

      {/* ========================================================================= */}
      {/* 6. AI TUTOR, 7. PRACTICE, 8. QUIZ, 9. EXAMS, 10. ENTRANCE EXAM, 11. PHOTO SOLVER, 12. VOICE TUTOR */}
      {/* ========================================================================= */}
      <div>
        <div className="flex items-center justify-between mb-3.5">
          <h3 className="text-base font-bold text-slate-900 font-serif-ethiopic">
            {language === 'am' ? 'ዋና ዋና የትምህርት ክፍሎችና መሳሪያዎች' : 'Core Learning Suite & AI Tools'}
          </h3>
          <span className="text-xs text-slate-400 font-mono">Part 21 Academic Suite</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 sm:gap-3.5">
          {/* 6. AI Tutor */}
          <div
            onClick={() => (onOpenAITutor ? onOpenAITutor() : onNavigateToTab?.('ai_tutor'))}
            className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-xs hover:border-emerald-400 hover:shadow-sm cursor-pointer transition-all group"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <Brain className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
              {language === 'am' ? 'ኑር AI አስጠኚ' : 'AI Tutor'}
            </h4>
            <p className="text-[11px] text-slate-400 mt-0.5 truncate">
              {language === 'am' ? 'ሶቅራጥሳዊ RAG' : 'Socratic Dialog'}
            </p>
          </div>

          {/* 7. Practice */}
          <div
            onClick={() => (onOpenPractice ? onOpenPractice() : onNavigateToTab?.('practice'))}
            className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-xs hover:border-amber-400 hover:shadow-sm cursor-pointer transition-all group"
          >
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <Award className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-slate-900 group-hover:text-amber-700 transition-colors">
              {language === 'am' ? 'ልምምድ & ፈተና' : 'Practice'}
            </h4>
            <p className="text-[11px] text-slate-400 mt-0.5 truncate">
              {language === 'am' ? 'የደረጃ ጥያቄዎች' : 'Adaptive drills'}
            </p>
          </div>

          {/* 8. Quiz */}
          <div
            onClick={() => (onOpenQuiz ? onOpenQuiz() : onNavigateToTab?.('practice'))}
            className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-xs hover:border-indigo-400 hover:shadow-sm cursor-pointer transition-all group"
          >
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <Zap className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">
              {language === 'am' ? 'ፈጣን ኩዊዝ' : 'Quiz Engine'}
            </h4>
            <p className="text-[11px] text-slate-400 mt-0.5 truncate">
              {language === 'am' ? 'ፈጣን ምዘና' : 'Instant evaluation'}
            </p>
          </div>

          {/* 9. Exams */}
          <div
            onClick={() => (onOpenExams ? onOpenExams() : onNavigateToTab?.('exams'))}
            className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-xs hover:border-purple-400 hover:shadow-sm cursor-pointer transition-all group"
          >
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <FileCheck className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-slate-900 group-hover:text-purple-700 transition-colors">
              {language === 'am' ? 'ፈተናዎች & ማትሪክ' : 'Model Exams'}
            </h4>
            <p className="text-[11px] text-slate-400 mt-0.5 truncate">
              {language === 'am' ? 'ብሔራዊ ፈተና' : 'National tests'}
            </p>
          </div>

          {/* 10. Entrance Exam Preparation */}
          <div
            onClick={() => (onOpenEntranceExam ? onOpenEntranceExam() : onNavigateToTab?.('exams'))}
            className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-xs hover:border-rose-400 hover:shadow-sm cursor-pointer transition-all group"
          >
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-slate-900 group-hover:text-rose-700 transition-colors">
              {language === 'am' ? 'የዩኒቨርሲቲ መግቢያ' : 'Entrance Prep'}
            </h4>
            <p className="text-[11px] text-slate-400 mt-0.5 truncate">
              {language === 'am' ? 'ክፍል 11-12 ማትሪክ' : 'Matric prep'}
            </p>
          </div>

          {/* 11. Photo Question Solver */}
          <div
            onClick={() => (onOpenPhotoSolver ? onOpenPhotoSolver() : onNavigateToTab?.('photo_solver'))}
            className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-xs hover:border-cyan-400 hover:shadow-sm cursor-pointer transition-all group"
          >
            <div className="w-9 h-9 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <Camera className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-slate-900 group-hover:text-cyan-700 transition-colors">
              {language === 'am' ? 'ፎቶ ጥያቄ ፈቺ' : 'Photo Solver'}
            </h4>
            <p className="text-[11px] text-slate-400 mt-0.5 truncate">
              {language === 'am' ? 'ካሜራ አንስተህ ፈታ' : 'Snap & solve'}
            </p>
          </div>

          {/* 12. Voice Tutor */}
          <div
            onClick={() => (onOpenVoiceTutor ? onOpenVoiceTutor() : onNavigateToTab?.('voice_tutor'))}
            className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-xs hover:border-teal-400 hover:shadow-sm cursor-pointer transition-all group"
          >
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <Mic className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
              {language === 'am' ? 'የድምፅ አስጠኚ' : 'Voice Tutor'}
            </h4>
            <p className="text-[11px] text-slate-400 mt-0.5 truncate">
              {language === 'am' ? 'በንግግር ጠይቅ' : 'Listen & Learn'}
            </p>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. SUBJECTS GRID (የክፍል {grade} የትምህርት ዓይነቶች) */}
      {/* ========================================================================= */}
      <div>
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-sm">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 font-serif-ethiopic">
                {language === 'am' ? `የክፍል ${grade} የትምህርት ዓይነቶች (Subjects)` : `Grade ${grade} Subjects`}
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
                      {totalUnits} {language === 'am' ? 'ምዕራፍ' : 'Units'}
                    </span>
                  </div>

                  {firstUnitTitle && (
                    <p className="text-xs text-slate-500 line-clamp-1 mb-3 bg-slate-50 p-2 rounded-xl border border-slate-100">
                      Unit 1: {firstUnitTitle}
                    </p>
                  )}

                  {/* Subject Mastery / Progress */}
                  <div className="space-y-1 mt-2">
                    <div className="flex justify-between text-[11px] text-slate-500">
                      <span>{language === 'am' ? 'የትምህርት ሂደት' : 'Curriculum progress'}</span>
                      <span className="font-mono font-bold text-slate-800">{progress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-600 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => {
                      onSelectSubject(subj.id);
                    }}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
                  >
                    <span>{language === 'am' ? 'ትምህርቱን ጀምር' : 'Open Curriculum'}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onNavigateToTab?.('books')}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
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

      {/* ========================================================================= */}
      {/* 14. KNOWLEDGE MAP & 15. WEAK TOPICS & 16. RECOMMENDATIONS */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* 14. Knowledge Map & 15. Weak Topics Review (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-emerald-600" />
              <h4 className="text-sm sm:text-base font-bold text-slate-900 font-serif-ethiopic">
                {language === 'am' ? 'የዕውቀት ካርታና ደካማ ርዕሶች (Knowledge Map & Weak Topics)' : 'Knowledge Map & Review'}
              </h4>
            </div>
            <button
              onClick={() => onOpenKnowledgeMap()}
              className="text-xs font-bold text-emerald-700 hover:underline cursor-pointer"
            >
              {language === 'am' ? 'ሙሉ ካርታ (DAG)' : 'Open Map'}
            </button>
          </div>

          <p className="text-xs text-slate-500">
            {language === 'am'
              ? 'በቅርብ ጊዜ የወሰዷቸው የፈተና ጥያቄዎች መሰረት በማድረግ ማሻሻያ የሚሹ ርዕሶች ተለይተዋል፡'
              : 'AI Weak Topic Detector identified concepts requiring reinforcement before exams:'}
          </p>

          <div className="space-y-2.5">
            {weakTopics.slice(0, 3).map((w, idx) => (
              <div
                key={idx}
                className="p-3 rounded-2xl bg-amber-50/60 border border-amber-200/80 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs shrink-0">
                    <AlertTriangle className="w-4 h-4 text-amber-700" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">
                      {w.topicTitle || 'Calculus Foundations'}
                    </p>
                    <p className="text-[10px] text-amber-800 font-mono">
                      Mastery: {w.masteryScore}% • {w.attemptsCount} attempts
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => onContinueLearning(w.subjectId || continuedSubjectId, w.topicId)}
                  className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shrink-0 transition-colors cursor-pointer"
                >
                  {language === 'am' ? 'አሁን ከልስ' : 'Review'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 16. Recommendations & 17. Gamification Summary (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
              <h4 className="text-sm sm:text-base font-bold text-slate-900 font-serif-ethiopic">
                {language === 'am' ? 'የተማሪ ነጥብና ደረጃ (Gamification)' : 'Student Level & XP'}
              </h4>
            </div>
            <span className="text-xs font-mono font-bold text-amber-600">Level 4 Scholar</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-150 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">Total XP</span>
              <span className="text-lg font-black text-slate-900 font-mono">1,480 XP</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-150 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">Badges</span>
              <span className="text-lg font-black text-emerald-700 font-mono">6 Earned</span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 text-xs space-y-1">
            <span className="font-bold text-emerald-950 block font-serif-ethiopic">
              {language === 'am' ? 'የ AI የቀን ምክር (Daily Recommendation):' : 'AI Academic Recommendation:'}
            </span>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              {recommendations[0]?.reason ||
                'Complete 2 practice quizzes in Physics to unlock your Grade 9 Midterm Mastery Badge!'}
            </p>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 18. NOTIFICATIONS, 19. BOOKMARKS, 20. OFFLINE LEARNING, 21. PROFILE, 22. SETTINGS */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* 18. Notifications Alert Card */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-emerald-600" />
              <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                {language === 'am' ? 'ማሳወቂያዎች (Notifications)' : 'Notifications'}
              </h5>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          </div>
          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <p className="font-bold text-slate-800">
                {language === 'am' ? 'የሳምንቱ አጠቃላይ ምዘና' : 'Weekly Matric Assessment'}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                ክፍል {grade} ሒሳብና ፊዚክስ ምዕራፍ 1 ምዘና አርብ ይካሄዳል
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <p className="font-bold text-slate-800">
                {language === 'am' ? 'አዲስ ኦፊሴላዊ መጽሐፍ' : 'Textbook Update'}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                የ 2019 E.C. አዲሱ የትምህርት ሚኒስቴር መጽሐፍ ገብቷል
              </p>
            </div>
          </div>
        </div>

        {/* 19. Bookmarks & Saved Topics Card */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-blue-600" />
              <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                {language === 'am' ? 'የተቀመጡ ማስታወሻዎች (Bookmarks)' : 'Bookmarks'}
              </h5>
            </div>
            <span className="text-[10px] font-mono text-slate-400">{bookmarks.length} saved</span>
          </div>
          <div className="space-y-2 text-xs">
            {bookmarks.map((b) => (
              <div
                key={b.id}
                onClick={() => onContinueLearning(b.subjectId, b.topicId)}
                className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-100 cursor-pointer transition-colors flex items-center justify-between"
              >
                <div className="min-w-0 pr-2">
                  <p className="font-bold text-slate-800 truncate">{b.title}</p>
                  <p className="text-[10px] text-slate-400">{b.subject}</p>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              </div>
            ))}
          </div>
        </div>

        {/* 20. Offline Learning, 21. Profile, 22. Settings Card */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-teal-600" />
                <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  {language === 'am' ? 'ያለ ኢንተርኔት (Offline) & ቅንብር' : 'Offline & Settings'}
                </h5>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 text-[10px] font-bold">
                PWA Ready
              </span>
            </div>

            <div className="mt-3 space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50">
                <span className="text-slate-600 font-serif-ethiopic">
                  {language === 'am' ? 'የተቀመጡ ክፍለ-ትምህርቶች:' : 'Cached Lessons:'}
                </span>
                <span className="font-bold text-slate-900 font-mono">12 Units (84MB)</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50">
                <span className="text-slate-600 font-serif-ethiopic">
                  {language === 'am' ? 'ዳታ ቆጣቢ ሁኔታ:' : 'Low Data Mode:'}
                </span>
                <span className="font-bold text-emerald-700 font-mono">
                  {lowDataMode ? 'ON' : 'OFF'}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
            <button
              onClick={() => onNavigateToTab?.('profile')}
              className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <User className="w-3.5 h-3.5" />
              <span>{language === 'am' ? 'መገለጫ (Profile)' : 'Profile'}</span>
            </button>
            <button
              onClick={() => onNavigateToTab?.('profile')}
              className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>{language === 'am' ? 'ቅንብሮች (Settings)' : 'Settings'}</span>
            </button>
            <button
              onClick={() => (onLogout ? onLogout() : logout?.())}
              className="py-2 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              title={language === 'am' ? 'ከመለያ ውጣ (Logout)' : 'Logout'}
            >
              <LogOut className="w-3.5 h-3.5 text-rose-600" />
              <span>{language === 'am' ? 'ውጣ' : 'Logout'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
