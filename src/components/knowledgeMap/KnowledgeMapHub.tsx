import React, { useState, useEffect, useMemo } from 'react';
import {
  Brain,
  TrendingUp,
  AlertTriangle,
  Award,
  BookOpen,
  CheckCircle2,
  Clock,
  ChevronRight,
  Flame,
  Target,
  Sparkles,
  ShieldCheck,
  Compass,
  GraduationCap,
  Users,
  BarChart3,
  RefreshCw,
  Zap,
  Lock,
  Unlock,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { Grade, LanguageCode } from '../../types';
import {
  KnowledgeTopicNode,
  StudentAnalyticsSummary,
  StudentTopicMasteryRecord,
  WeakTopicRecord,
  LearningAlertRecord,
  PerformanceSnapshot,
  TeacherClassroomAnalytics,
  SuperAdminAggregatedAnalytics,
} from '../../types/knowledgeMap';
import { knowledgeMapService } from '../../services/knowledgeMapService';

interface KnowledgeMapHubProps {
  currentGrade: Grade;
  language: LanguageCode;
  isOwnerSuperAdmin?: boolean;
  userRole?: 'student' | 'teacher' | 'super_admin' | 'admin';
  onNavigateToTopic?: (topicId: string, subject: string) => void;
  onOpenAITutor?: (topicTitle: string) => void;
}

export const KnowledgeMapHub: React.FC<KnowledgeMapHubProps> = ({
  currentGrade,
  language,
  isOwnerSuperAdmin = false,
  userRole = 'student',
  onNavigateToTopic,
  onOpenAITutor,
}) => {
  const [activeTab, setActiveTab] = useState<
    'my_status' | 'knowledge_tree' | 'trends' | 'early_warning' | 'entrance_prep' | 'teacher_view' | 'admin_analytics'
  >('my_status');

  const [selectedSubject, setSelectedSubject] = useState<string>('Mathematics');
  const [selectedGrade, setSelectedGrade] = useState<Grade>(currentGrade || 11);
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  const [loading, setLoading] = useState<boolean>(true);
  const [analytics, setAnalytics] = useState<StudentAnalyticsSummary | null>(null);
  const [masteryRecords, setMasteryRecords] = useState<StudentTopicMasteryRecord[]>([]);
  const [performanceSnapshots, setPerformanceSnapshots] = useState<PerformanceSnapshot[]>([]);
  const [teacherData, setTeacherData] = useState<TeacherClassroomAnalytics | null>(null);
  const [adminAnalytics, setAdminAnalytics] = useState<SuperAdminAggregatedAnalytics | null>(null);
  const [aiInsights, setAiInsights] = useState<string[]>([]);
  const [isGeneratingInsights, setIsGeneratingInsights] = useState<boolean>(false);

  // Translations
  const isAm = language === 'am';
  const isOm = language === 'om';
  const isTi = language === 'ti';

  const t = useMemo(() => {
    return {
      title: isAm ? 'የእውቀት ካርታ እና AI ትንታኔ' : isOm ? 'Kaartaa Beekkumsaa fi Xiinxala AI' : isTi ? 'ካርታ ፍልጠትን AI ትንታነን' : 'Knowledge Map & AI Analytics',
      subtitle: isAm
        ? 'የትምህርት ውጤትዎን በርዕስ ደረጃ ይረዱ፣ ክፍተቶችን ያስተካክሉ እና ለብሔራዊ ፈተና ይዘጋጁ'
        : isOm
        ? 'Sadarkaa mata-dureetti dandeettii kee beeki, hanqina sirreessi'
        : isTi
        ? 'ንደረጃ ፍልጠትኩም ብርእሰ-ጉዳይ ተረድኡ፣ ዝጎደለ ኣማልኡ'
        : 'Topic-level mastery tracking, prerequisite gap diagnosis & early-warning engine',
      myStatus: isAm ? 'የእኔ የመማር ሁኔታ' : isOm ? 'Sadarkaa Barumsaa Koo' : isTi ? 'ደረጃ ምምሃረይ' : 'My Learning Status',
      knowledgeTree: isAm ? 'የእውቀት ካርታ ዛፍ' : isOm ? 'Mukaa Kaartaa Beekkumsaa' : isTi ? 'ኦም ካርታ ፍልጠት' : 'Knowledge Map Tree',
      trends: isAm ? 'የትምህርት አዝማሚያ' : isOm ? 'Adeumsa Raawwii' : isTi ? 'ናህሪ ውጽኢት' : 'Performance Trends',
      earlyWarning: isAm ? 'የቅድመ-ማስጠንቀቂያ ማንቂያዎች' : isOm ? 'Akeekkachiisa Yeroo' : isTi ? 'ናይ ቅድመ-ምልክታ መጠንቀቕታታት' : 'Early Warnings',
      entrancePrep: isAm ? 'የ12ኛ ክፍል ዩኒቨርሲቲ መግቢያ' : isOm ? 'Qophii Qormaata Seensaa' : isTi ? 'ድሉውነት መእተዊ ፈተና' : 'Entrance Exam Prep',
      teacherView: isAm ? 'የመምህር ክፍል ክትትል' : isOm ? 'Ilaalcha Barsiisaa' : isTi ? 'ናይ መምህር ምክትታል' : 'Teacher Classroom',
      adminAnalytics: isAm ? 'አጠቃላይ የስርዓት ትንታኔ' : isOm ? 'Xiinxala Sirnaa' : isTi ? 'ሓፈሻዊ ትንታነ' : 'System Analytics',
      mastered: isAm ? 'የተካኑበት' : isOm ? 'Kan Beekame' : isTi ? 'ዝተመልከዎ' : 'Mastered',
      developing: isAm ? 'በእድገት ላይ' : isOm ? 'Guddataa Jiru' : isTi ? 'ኣብ ምምዕባል' : 'Developing',
      learning: isAm ? 'በመማር ላይ' : isOm ? 'Barachaa Jiru' : isTi ? 'ኣብ ምምሃር' : 'Learning',
      notStarted: isAm ? 'ያልተጀመረ' : isOm ? 'Kan Hin Jalqabamne' : isTi ? 'ዘይተጀመረ' : 'Not Started',
      weakTopics: isAm ? 'ትኩረት የሚሹ ርዕሶች' : isOm ? 'Mata-dureewwan Dadhaboo' : isTi ? 'ትኹረት ዘድልዮም ርእስታት' : 'Weak Topics',
      prereqGaps: isAm ? 'የቅድመ-ሁኔታ ክፍተቶች' : isOm ? 'Hanqinaalee Bu\'uuraa' : isTi ? 'ናይ ቅድመ-ኩነት ክፍተታት' : 'Prerequisite Gaps',
      overallMastery: isAm ? 'አጠቃላይ የብቃት ደረጃ' : isOm ? 'Dandeettii Waliigalaa' : isTi ? 'ሓፈሻዊ ብቕዓት' : 'Overall Mastery',
      streak: isAm ? 'የቀናት ተከታታይነት' : isOm ? 'Walitti Fufiinsa' : isTi ? 'ተኸታታሊ መዓልትታት' : 'Study Streak',
      recommendations: isAm ? 'የተመረጡ የመማር እርምጃዎች' : isOm ? 'Tarkaanfilee Filataman' : isTi ? 'ዝተመርጹ ናይ ምምሃር ስጉምትታት' : 'Personalized Recommendations',
      aiAdvisor: isAm ? 'የኑር AI ትምህርታዊ ምክር' : isOm ? 'Gorsa Barnootaa NUR AI' : isTi ? 'ትምህርታዊ ምኽሪ ኑር AI' : 'NUR AI Academic Guidance',
      allSubjects: isAm ? 'ሁሉም ትምህርቶች' : isOm ? 'Barnoota Hunda' : isTi ? 'ኩሎም ትምህርትታት' : 'All Subjects',
      startLesson: isAm ? 'ትምህርት ጀምር' : isOm ? 'Barumsa Jalqabi' : isTi ? 'ትምህርቲ ጀምር' : 'Start Lesson',
      practiceTopic: isAm ? 'ተለማመድ' : isOm ? 'Shaakali' : isTi ? 'ተለማመድ' : 'Practice Topic',
      askAITutor: isAm ? 'አስተማሪ ጠይቅ' : isOm ? 'Barsiisaa Gaafadhu' : isTi ? 'መምህር ሕተት' : 'Ask AI Tutor',
      prereqRequired: isAm ? 'ቅድመ-ሁኔታ ያስፈልጋል' : isOm ? 'Bu\'uura Barbaachisa' : isTi ? 'ቅድመ-ኩነት የድሊ' : 'Prerequisite Required',
    };
  }, [isAm, isOm, isTi]);

  // Load data
  const loadData = async () => {
    setLoading(true);
    try {
      const studentId = knowledgeMapService.getUserId();
      const [sum, recs, snaps, teach, adm] = await Promise.all([
        knowledgeMapService.getStudentAnalyticsSummary(studentId),
        knowledgeMapService.getAllStudentMasteries(studentId),
        knowledgeMapService.getPerformanceSnapshots(studentId),
        knowledgeMapService.getTeacherClassroomAnalytics(),
        knowledgeMapService.getSuperAdminSystemAnalytics(),
      ]);

      setAnalytics(sum);
      setMasteryRecords(recs);
      setPerformanceSnapshots(snaps);
      setTeacherData(teach);
      setAdminAnalytics(adm);
      setAiInsights(sum.aiPedagogicalAdvice);
    } catch (err) {
      console.error('[KnowledgeMapHub] load data error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedGrade]);

  // Generate live AI academic insights
  const handleRefreshAIInsights = async () => {
    if (!analytics) return;
    setIsGeneratingInsights(true);
    try {
      const res = await fetch('/api/knowledge-map/analytics-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentGrade: selectedGrade,
          stream: selectedGrade >= 11 ? 'natural' : 'common',
          overallMasteryPercent: analytics.overallMasteryPercent,
          strongSubjects: analytics.entranceExamReadiness?.strongSubjects || ['Mathematics'],
          weakTopics: analytics.entranceExamReadiness?.highPriorityWeakTopics || [],
          activeAlerts: analytics.activeAlerts,
          language,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.insights && Array.isArray(data.insights)) {
          setAiInsights(data.insights);
        }
      }
    } catch (e) {
      console.warn('Live insight generation error:', e);
    } finally {
      setIsGeneratingInsights(false);
    }
  };

  // Filtered knowledge nodes
  const allNodes = useMemo(() => knowledgeMapService.getAllTopicNodes(), []);
  const filteredNodes = useMemo(() => {
    return allNodes.filter(
      (n) => n.grade === selectedGrade && (!selectedSubject || n.subject === selectedSubject)
    );
  }, [allNodes, selectedGrade, selectedSubject]);

  const uniqueSubjects = useMemo(() => {
    const set = new Set<string>();
    allNodes.forEach((n) => set.add(n.subject));
    return Array.from(set);
  }, [allNodes]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-8 space-y-4">
        <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin" />
        <p className="text-sm font-medium text-slate-600">
          {isAm ? 'የእውቀት ካርታ እና ትንታኔ በመጫን ላይ...' : 'Loading Knowledge Map & Early-Warning Engine...'}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-emerald-700/40">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>NUR AI Knowledge Map & Early-Warning Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">{t.title}</h1>
            <p className="text-emerald-100/80 text-sm sm:text-base leading-relaxed">{t.subtitle}</p>
          </div>

          {/* Quick Metrics Badge */}
          <div className="grid grid-cols-3 gap-3 bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/15">
            <div className="text-center px-2">
              <div className="text-2xl sm:text-3xl font-black text-emerald-300">
                {analytics?.overallMasteryPercent || 0}%
              </div>
              <div className="text-[11px] text-emerald-200/90 font-medium">{t.overallMastery}</div>
            </div>
            <div className="text-center px-2 border-x border-white/15">
              <div className="text-2xl sm:text-3xl font-black text-amber-300">
                {analytics?.activeWeakTopicsCount || 0}
              </div>
              <div className="text-[11px] text-amber-200/90 font-medium">{t.weakTopics}</div>
            </div>
            <div className="text-center px-2">
              <div className="text-2xl sm:text-3xl font-black text-rose-300">
                {analytics?.activeAlerts.length || 0}
              </div>
              <div className="text-[11px] text-rose-200/90 font-medium">{t.earlyWarning}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 scrollbar-none">
        <button
          onClick={() => setActiveTab('my_status')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${
            activeTab === 'my_status'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Target className="w-4 h-4" />
          <span>{t.myStatus}</span>
        </button>

        <button
          onClick={() => setActiveTab('knowledge_tree')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${
            activeTab === 'knowledge_tree'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>{t.knowledgeTree}</span>
        </button>

        <button
          onClick={() => setActiveTab('trends')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${
            activeTab === 'trends'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>{t.trends}</span>
        </button>

        <button
          onClick={() => setActiveTab('early_warning')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${
            activeTab === 'early_warning'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>{t.earlyWarning}</span>
          {analytics && analytics.activeAlerts.length > 0 && (
            <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-rose-100 text-rose-800 font-bold">
              {analytics.activeAlerts.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('entrance_prep')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${
            activeTab === 'entrance_prep'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>{t.entrancePrep}</span>
        </button>

        {/* Teacher tab */}
        {(userRole === 'teacher' || isOwnerSuperAdmin) && (
          <button
            onClick={() => setActiveTab('teacher_view')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${
              activeTab === 'teacher_view'
                ? 'bg-teal-700 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>{t.teacherView}</span>
          </button>
        )}

        {/* Super Admin Analytics tab */}
        {isOwnerSuperAdmin && (
          <button
            onClick={() => setActiveTab('admin_analytics')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${
              activeTab === 'admin_analytics'
                ? 'bg-purple-700 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>{t.adminAnalytics}</span>
          </button>
        )}
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: MY LEARNING STATUS (Student Dashboard Section) */}
      {/* ========================================================================= */}
      {activeTab === 'my_status' && analytics && (
        <div className="space-y-6">
          {/* AI Student Pedagogical Advice Card */}
          <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                  <Brain className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">{t.aiAdvisor}</h3>
                  <p className="text-xs text-slate-500">
                    {isAm
                      ? 'የተጨባጭ ስርዓተ-ትምህርት ትንታኔ እና የታለመ የማሻሻያ መመሪያ'
                      : 'Curriculum-aligned diagnostic feedback for continuous improvement'}
                  </p>
                </div>
              </div>
              <button
                onClick={handleRefreshAIInsights}
                disabled={isGeneratingInsights}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-emerald-200 text-xs font-semibold text-emerald-800 hover:bg-emerald-100 transition"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isGeneratingInsights ? 'animate-spin' : ''}`} />
                <span>{isGeneratingInsights ? 'Analyzing...' : 'Refresh Insights'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {aiInsights.map((insight, idx) => (
                <div key={idx} className="bg-white p-3.5 rounded-xl border border-emerald-100 shadow-2xs text-xs sm:text-sm text-slate-700 leading-relaxed flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{insight}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Core Status Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
              <div className="text-xs text-slate-500 font-medium">{t.mastered}</div>
              <div className="text-2xl font-bold text-emerald-700">{analytics.masteredTopicsCount}</div>
              <div className="text-[11px] text-slate-400">Score &ge; 80% (Verified)</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
              <div className="text-xs text-slate-500 font-medium">{t.developing}</div>
              <div className="text-2xl font-bold text-blue-700">{analytics.developingTopicsCount}</div>
              <div className="text-[11px] text-slate-400">Score 60% &ndash; 79%</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
              <div className="text-xs text-slate-500 font-medium">{t.weakTopics}</div>
              <div className="text-2xl font-bold text-amber-700">{analytics.activeWeakTopicsCount}</div>
              <div className="text-[11px] text-slate-400">Requires practice</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
              <div className="text-xs text-slate-500 font-medium">{t.prereqGaps}</div>
              <div className="text-2xl font-bold text-rose-700">{analytics.criticalPrerequisiteGapsCount}</div>
              <div className="text-[11px] text-slate-400">Blocks progression</div>
            </div>
          </div>

          {/* Subject Mastery Breakdown */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-600" />
              <span>{isAm ? 'የትምህርት ዓይነቶች የብቃት ደረጃ' : 'Subject Mastery Breakdown'}</span>
            </h3>
            <div className="space-y-3">
              {Object.values(analytics.subjectMasteryBreakdown).map((subj) => (
                <div key={subj.subjectName} className="space-y-1">
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="font-semibold text-slate-800">{subj.subjectName}</span>
                    <span className="font-bold text-slate-700">{subj.masteryScore}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        subj.masteryScore >= 80
                          ? 'bg-emerald-500'
                          : subj.masteryScore >= 60
                          ? 'bg-blue-500'
                          : 'bg-amber-500'
                      }`}
                      style={{ width: `${subj.masteryScore}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Priority Personalized Recommendations */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" />
              <span>{t.recommendations}</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {analytics.topRecommendations.map((rec) => (
                <div
                  key={rec.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-emerald-300 transition-all space-y-2.5 flex flex-col justify-between shadow-2xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                        {rec.subject} &bull; Grade {rec.grade}
                      </span>
                      <span className="text-[11px] text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {rec.estimatedMinutes} min
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm">{rec.title}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{rec.reason}</p>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => onNavigateToTopic && onNavigateToTopic(rec.topicId, rec.subject)}
                      className="flex-1 py-2 px-3 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition text-center"
                    >
                      {t.startLesson}
                    </button>
                    <button
                      onClick={() => onOpenAITutor && onOpenAITutor(rec.topicTitle)}
                      className="py-2 px-3 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-semibold transition"
                    >
                      {t.askAITutor}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: KNOWLEDGE MAP TREE & PREREQUISITE GRAPH */}
      {/* ========================================================================= */}
      {activeTab === 'knowledge_tree' && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <div className="flex items-center gap-2 overflow-x-auto">
              {([9, 10, 11, 12] as Grade[]).map((g) => (
                <button
                  key={g}
                  onClick={() => setSelectedGrade(g)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    selectedGrade === g
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Grade {g}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 overflow-x-auto">
              {uniqueSubjects.map((subj) => (
                <button
                  key={subj}
                  onClick={() => setSelectedSubject(subj)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    selectedSubject === subj
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {subj}
                </button>
              ))}
            </div>
          </div>

          {/* Tree Nodes List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredNodes.map((node) => {
              const mastery = masteryRecords.find((m) => m.topic === node.id);
              const score = mastery?.masteryScore || 0;
              const status = mastery?.status || 'NOT_STARTED';
              const hasGaps = mastery?.prerequisiteStatus === 'GAPS_EXIST';

              return (
                <div
                  key={node.id}
                  className={`bg-white rounded-xl p-5 border transition-all shadow-2xs space-y-3.5 ${
                    hasGaps
                      ? 'border-rose-200 bg-rose-50/20'
                      : status === 'MASTERED'
                      ? 'border-emerald-200 bg-emerald-50/20'
                      : 'border-slate-200 hover:border-emerald-300'
                  }`}
                >
                  {/* Unit & Status Badge */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500">
                      Unit {node.unitNumber}: {node.unitTitle}
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        status === 'MASTERED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : status === 'DEVELOPING'
                          ? 'bg-blue-100 text-blue-800'
                          : status === 'LEARNING'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {status} ({score}%)
                    </span>
                  </div>

                  {/* Title & Lesson */}
                  <div>
                    <h4 className="text-base font-bold text-slate-900">{node.topicTitle}</h4>
                    <p className="text-xs text-slate-600 mt-0.5">Lesson {node.lessonNumber}: {node.lessonTitle}</p>
                  </div>

                  {/* Learning Outcomes */}
                  <div className="space-y-1.5 bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                      Learning Outcomes
                    </div>
                    {node.learningOutcomes.map((lo) => (
                      <div key={lo.id} className="text-xs text-slate-600 flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{lo.description}</span>
                      </div>
                    ))}
                  </div>

                  {/* Prerequisites */}
                  {node.prerequisites.length > 0 && (
                    <div className="space-y-1 pt-1">
                      <div className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                        {hasGaps ? (
                          <Lock className="w-3 h-3 text-rose-500" />
                        ) : (
                          <Unlock className="w-3 h-3 text-emerald-600" />
                        )}
                        <span>Prerequisites:</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {node.prerequisites.map((p) => (
                          <span
                            key={p.topicId}
                            className={`text-[11px] px-2 py-0.5 rounded-md font-medium ${
                              hasGaps
                                ? 'bg-rose-100 text-rose-800 border border-rose-200'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {p.title} (min {p.minRequiredScore}%)
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => onNavigateToTopic && onNavigateToTopic(node.id, node.subject)}
                      className="flex-1 py-1.5 px-3 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition text-center"
                    >
                      {t.startLesson}
                    </button>
                    <button
                      onClick={() => onOpenAITutor && onOpenAITutor(node.topicTitle)}
                      className="py-1.5 px-3 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-semibold transition"
                    >
                      {t.askAITutor}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: PERFORMANCE TRENDS & ANALYTICS */}
      {/* ========================================================================= */}
      {activeTab === 'trends' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-base">{t.trends}</h3>
                <p className="text-xs text-slate-500">
                  {isAm ? 'የቀናት፣ የሳምንታት እና የወራት አጠቃላይ የውጤት ለውጥ' : 'Track accuracy, questions answered, and mastery over time'}
                </p>
              </div>
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                {(['daily', 'weekly', 'monthly'] as const).map((tFrame) => (
                  <button
                    key={tFrame}
                    onClick={() => setTimeframe(tFrame)}
                    className={`px-3 py-1 rounded-md text-xs font-bold capitalize transition ${
                      timeframe === tFrame
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {tFrame}
                  </button>
                ))}
              </div>
            </div>

            {/* Performance snapshot bars */}
            <div className="space-y-4">
              <div className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Quiz & Assessment Accuracy (%)
              </div>
              <div className="grid grid-cols-7 gap-2 items-end h-40 pt-4 border-b border-slate-100">
                {performanceSnapshots.slice(-7).map((snap, idx) => (
                  <div key={snap.id} className="flex flex-col items-center gap-2 h-full justify-end">
                    <span className="text-[11px] font-bold text-slate-700">{snap.quizAccuracy}%</span>
                    <div
                      className="w-full bg-emerald-500 rounded-t-lg transition-all duration-500 hover:bg-emerald-600"
                      style={{ height: `${snap.quizAccuracy}%` }}
                    />
                    <span className="text-[10px] text-slate-400 truncate max-w-[40px]">
                      {snap.dateLabel.substring(5)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <div className="text-xs text-slate-500">Total Study Time</div>
                <div className="text-xl font-bold text-slate-900">
                  {performanceSnapshots.reduce((acc, s) => acc + s.studyTimeMinutes, 0)} mins
                </div>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <div className="text-xs text-slate-500">Questions Solved</div>
                <div className="text-xl font-bold text-slate-900">
                  {performanceSnapshots.reduce((acc, s) => acc + s.questionsCompleted, 0)}
                </div>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <div className="text-xs text-slate-500">Average Quiz Accuracy</div>
                <div className="text-xl font-bold text-emerald-700">74.2%</div>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <div className="text-xs text-slate-500">Active Study Streak</div>
                <div className="text-xl font-bold text-amber-600 flex items-center gap-1">
                  <Flame className="w-5 h-5 fill-amber-500 text-amber-500" />
                  <span>7 Days</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: EARLY WARNING ALERTS & ACADEMIC SUPPORT */}
      {/* ========================================================================= */}
      {activeTab === 'early_warning' && analytics && (
        <div className="space-y-6">
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-600 flex items-center justify-center text-white">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">{t.earlyWarning}</h3>
                <p className="text-xs sm:text-sm text-slate-600">
                  {isAm
                    ? 'ትምህርታዊ ክፍተቶች እንዳይባባሱ ቀድመው የሚረዱ የማንቂያ መልእክቶች'
                    : 'Preventative academic alerts highlighting topics that require prompt reinforcement'}
                </p>
              </div>
            </div>

            {analytics.activeAlerts.length === 0 ? (
              <div className="bg-white p-8 rounded-xl text-center space-y-2 border border-rose-100">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-slate-900 text-base">No Critical Learning Alerts</h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Your learning pace and prerequisite accuracy are currently strong across all tracked curriculum nodes.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {analytics.activeAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="bg-white p-5 rounded-xl border border-rose-200 shadow-2xs space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 uppercase tracking-wider">
                        {alert.severity} &bull; {alert.type}
                      </span>
                      <span className="text-xs text-slate-400">
                        {new Date(alert.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-slate-900">{alert.title}</h4>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{alert.message}</p>

                    <div className="bg-amber-50 p-3 rounded-lg border border-amber-200 text-xs text-amber-900 font-medium flex items-center gap-2">
                      <Zap className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>Suggested Action: {alert.suggestedAction}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: GRADE 11 & 12 ENTRANCE EXAM READINESS */}
      {/* ========================================================================= */}
      {activeTab === 'entrance_prep' && analytics?.entranceExamReadiness && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-indigo-900 via-blue-900 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-lg space-y-4">
            <div className="flex items-center gap-3">
              <GraduationCap className="w-8 h-8 text-indigo-300" />
              <div>
                <h3 className="text-xl sm:text-2xl font-bold">Ethiopian University Entrance Examination (EUEE) Prep</h3>
                <p className="text-indigo-200 text-xs sm:text-sm">
                  Targeted analysis of national exam high-weight units and prerequisite revision
                </p>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/15 flex items-center justify-between">
              <div>
                <div className="text-xs text-indigo-200 uppercase tracking-wider font-semibold">
                  Curriculum Preparation Readiness
                </div>
                <div className="text-2xl sm:text-3xl font-black text-emerald-300">
                  {analytics.entranceExamReadiness.overallReadinessPercent}%
                </div>
              </div>
              <div className="text-right text-xs text-indigo-200">
                <div>Natural & Social Stream Focus</div>
                <div className="font-semibold text-white">Grade 11 & 12 Core Syllabus</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h4 className="font-bold text-slate-900 text-base">High-Priority Exam Topics Requiring Revision</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {allNodes
                .filter((n) => n.isNationalExamPriority)
                .map((examNode) => (
                  <div
                    key={examNode.id}
                    className="p-4 rounded-xl border border-slate-200 hover:border-indigo-300 transition-all space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800">
                        {examNode.subject} &bull; Grade {examNode.grade}
                      </span>
                      <span className="text-xs font-semibold text-amber-600">High Weight</span>
                    </div>
                    <h5 className="font-bold text-slate-900 text-sm">{examNode.topicTitle}</h5>
                    <p className="text-xs text-slate-600">Unit {examNode.unitNumber}: {examNode.lessonTitle}</p>
                    <button
                      onClick={() => onNavigateToTopic && onNavigateToTopic(examNode.id, examNode.subject)}
                      className="w-full mt-2 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition"
                    >
                      Study Exam Priority Unit
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: TEACHER CLASSROOM VIEW */}
      {/* ========================================================================= */}
      {activeTab === 'teacher_view' && teacherData && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-lg">{teacherData.className}</h3>
                <p className="text-xs text-slate-500">
                  {teacherData.totalStudents} Enrolled Students &bull; Grade {teacherData.grade}
                </p>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-500">Class Average Mastery</div>
                <div className="text-2xl font-bold text-emerald-700">{teacherData.averageMasteryScore}%</div>
              </div>
            </div>

            {/* Students needing academic support */}
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span>Students Needing Academic Intervention ({teacherData.studentsNeedingSupportCount})</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {teacherData.atRiskStudents.map((std) => (
                  <div key={std.studentId} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-sm">{std.displayName}</span>
                      <span className="text-xs font-bold text-amber-700">{std.averageScore}%</span>
                    </div>
                    <div className="text-xs text-slate-600">{std.primaryNeed}</div>
                    <div className="text-[11px] text-slate-400">Last active: {std.lastActive}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Common Weak Topics in Class */}
            <div className="space-y-3 pt-2">
              <h4 className="font-bold text-slate-900 text-sm">Common Class Weak Topics</h4>
              <div className="space-y-2">
                {teacherData.commonWeakTopics.map((cwt) => (
                  <div
                    key={cwt.topicId}
                    className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between text-xs sm:text-sm"
                  >
                    <div>
                      <span className="font-bold text-slate-800">{cwt.topicTitle}</span>
                      <span className="ml-2 text-slate-500">({cwt.subject})</span>
                    </div>
                    <div className="text-right">
                      <span className="font-semibold text-rose-600">{cwt.affectedStudentsCount} students struggling</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 7: SUPER ADMIN SYSTEM ANALYTICS */}
      {/* ========================================================================= */}
      {activeTab === 'admin_analytics' && adminAnalytics && isOwnerSuperAdmin && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
            <div>
              <h3 className="font-bold text-slate-900 text-lg">System-Wide Curriculum Analytics (Super Admin)</h3>
              <p className="text-xs text-slate-500">Aggregated high school performance benchmarks across all grades</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div className="text-xs text-slate-500">Total Enrolled Students</div>
                <div className="text-2xl font-bold text-slate-900">{adminAnalytics.totalStudents.toLocaleString()}</div>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div className="text-xs text-slate-500">Active Students Today</div>
                <div className="text-2xl font-bold text-emerald-700">{adminAnalytics.activeStudentsToday.toLocaleString()}</div>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div className="text-xs text-slate-500">System Quiz Average</div>
                <div className="text-2xl font-bold text-blue-700">{adminAnalytics.averageQuizScore}%</div>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div className="text-xs text-slate-500">System Completion Rate</div>
                <div className="text-2xl font-bold text-purple-700">{adminAnalytics.overallCompletionRate}%</div>
              </div>
            </div>

            {/* Grade distribution */}
            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 text-sm">Students by Grade Level</h4>
              <div className="grid grid-cols-4 gap-3">
                {([9, 10, 11, 12] as Grade[]).map((g) => (
                  <div key={g} className="p-3 bg-slate-50 rounded-xl text-center border border-slate-100">
                    <div className="text-xs text-slate-500">Grade {g}</div>
                    <div className="text-lg font-bold text-slate-800">
                      {adminAnalytics.gradeDistribution[g]?.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
