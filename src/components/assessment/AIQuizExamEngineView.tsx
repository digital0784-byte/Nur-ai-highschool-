import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  BookOpen,
  Award,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Brain,
  RotateCcw,
  Sliders,
  Send,
  Lock,
  Layers,
  FileText,
  Search,
  Check,
  TrendingUp,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Code,
  FlaskConical,
  MessageSquare,
  HelpCircle,
} from 'lucide-react';
import { Grade, Subject } from '../../types';
import {
  AssessmentQuestionType,
  AssessmentDifficulty,
  QuestionValidationStatus,
  CurriculumQuestion,
  ExamBlueprint,
  GeneratedExam,
  StudentAssessmentAttempt,
  AssessmentAnalyticsSummary,
} from '../../types/assessmentEngine';
import { assessmentService, GenerateQuestionsRequest } from '../../services/assessmentService';
import {
  queryQuestionBank,
  getCurriculumSubjects,
  getAdaptiveNextDifficulty,
  validateQuestionAgainstCurriculum,
} from '../../engine/assessmentEngine';
import { ETHIOPIAN_CURRICULUM_SUBJECTS } from '../../engine/defaultCurriculumData';

type AssessmentSubTab = 'adaptive_quiz' | 'exam_generator' | 'question_bank' | 'analytics' | 'e2e_verification';

export const AIQuizExamEngineView: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<AssessmentSubTab>('adaptive_quiz');

  // --- 1. Adaptive Quiz State ---
  const [selectedGrade, setSelectedGrade] = useState<Grade>(10);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('bio-g10');
  const [selectedUnitNumber, setSelectedUnitNumber] = useState<number>(2);
  const [selectedTopic, setSelectedTopic] = useState<string>('Cell Biology and Mitosis');
  const [selectedDifficulty, setSelectedDifficulty] = useState<AssessmentDifficulty>('medium');
  const [selectedQuestionType, setSelectedQuestionType] = useState<AssessmentQuestionType>('mcq');
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // Active Quiz session
  const [quizQuestions, setQuizQuestions] = useState<CurriculumQuestion[]>([]);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState<number>(0);
  const [studentAnswers, setStudentAnswers] = useState<Record<string, any>>({});
  const [matchingDraft, setMatchingDraft] = useState<Record<string, string>>({});
  const [isQuizActive, setIsQuizActive] = useState<boolean>(false);
  const [quizStartedAt, setQuizStartedAt] = useState<string>('');
  const [secondsRemaining, setSecondsRemaining] = useState<number>(600); // 10 minutes
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionResult, setSubmissionResult] = useState<StudentAssessmentAttempt | null>(null);

  // Adaptive tracking
  const [adaptiveStreak, setAdaptiveStreak] = useState<number>(0);
  const [adaptiveLogs, setAdaptiveLogs] = useState<string[]>([]);

  // --- 2. Exam Generator State ---
  const [examTitle, setExamTitle] = useState<string>('Ethiopian New Curriculum Grade 10 Model Exam');
  const [examGrade, setExamGrade] = useState<Grade>(10);
  const [examSubjectId, setExamSubjectId] = useState<string>('bio-g10');
  const [examTimeLimit, setExamTimeLimit] = useState<number>(45);
  const [examTotalQuestions, setExamTotalQuestions] = useState<number>(10);
  const [examPassingScore, setExamPassingScore] = useState<number>(60);
  const [antiCheatRandomize, setAntiCheatRandomize] = useState<boolean>(true);
  const [antiCheatTimer, setAntiCheatTimer] = useState<boolean>(true);
  const [antiCheatLocking, setAntiCheatLocking] = useState<boolean>(true);
  const [generatedExam, setGeneratedExam] = useState<GeneratedExam | null>(null);
  const [isCreatingExam, setIsCreatingExam] = useState<boolean>(false);

  // --- 3. Question Bank State ---
  const [bankQuestions, setBankQuestions] = useState<CurriculumQuestion[]>([]);
  const [bankSearch, setBankSearch] = useState<string>('');
  const [bankGradeFilter, setBankGradeFilter] = useState<Grade | 'all'>('all');
  const [bankTypeFilter, setBankTypeFilter] = useState<AssessmentQuestionType | 'all'>('all');
  const [bankDifficultyFilter, setBankDifficultyFilter] = useState<AssessmentDifficulty | 'all'>('all');
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null);

  // --- 4. Analytics State ---
  const [analytics, setAnalytics] = useState<AssessmentAnalyticsSummary | null>(null);

  // --- 5. E2E Verification State ---
  const [e2eRunning, setE2eRunning] = useState<boolean>(false);
  const [e2eResults, setE2eResults] = useState<any | null>(null);

  // Load initial bank and analytics
  useEffect(() => {
    loadQuestionBank();
    loadAnalytics();
  }, []);

  const loadQuestionBank = () => {
    const questions = queryQuestionBank({
      grade: bankGradeFilter,
      type: bankTypeFilter,
      difficulty: bankDifficultyFilter,
      searchQuery: bankSearch,
    });
    setBankQuestions(questions);
  };

  useEffect(() => {
    loadQuestionBank();
  }, [bankGradeFilter, bankTypeFilter, bankDifficultyFilter, bankSearch]);

  const loadAnalytics = async () => {
    const data = await assessmentService.getAnalytics();
    setAnalytics(data);
  };

  // Timer effect for active quiz
  useEffect(() => {
    let timer: any;
    if (isQuizActive && secondsRemaining > 0) {
      timer = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleAutoSubmitOnTimeout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isQuizActive, secondsRemaining]);

  const handleAutoSubmitOnTimeout = () => {
    if (isQuizActive && !submissionResult) {
      handleSubmitAssessment();
    }
  };

  // Generate Questions for Quiz
  const handleGenerateQuiz = async () => {
    setIsGenerating(true);
    try {
      const result = await assessmentService.generateQuestions({
        grade: selectedGrade,
        subjectId: selectedSubjectId,
        unitNumber: selectedUnitNumber,
        topic: selectedTopic,
        difficulty: selectedDifficulty,
        questionType: selectedQuestionType,
        count: questionCount,
      });

      setQuizQuestions(result.questions);
      setActiveQuestionIndex(0);
      setStudentAnswers({});
      setMatchingDraft({});
      setSubmissionResult(null);
      setIsQuizActive(true);
      setQuizStartedAt(new Date().toISOString());
      setSecondsRemaining(questionCount * 120); // 2 mins per question
      setAdaptiveStreak(0);
      setAdaptiveLogs([`[Initialized] Session opened with ${result.questions.length} questions grounded in ${result.source}.`]);
    } catch (err) {
      console.error('Quiz generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Select Answer for Current Question
  const handleSelectAnswer = (ans: any) => {
    const currentQ = quizQuestions[activeQuestionIndex];
    if (!currentQ) return;

    setStudentAnswers((prev) => ({
      ...prev,
      [currentQ.id]: ans,
    }));

    // Adaptive difficulty calculation
    const isCorrect = String(ans).trim().toLowerCase() === String(currentQ.correctAnswer).trim().toLowerCase();
    const newStreak = isCorrect ? adaptiveStreak + 1 : 0;
    setAdaptiveStreak(newStreak);

    const adaptation = getAdaptiveNextDifficulty(currentQ.difficulty, isCorrect, newStreak);
    setAdaptiveLogs((prev) => [
      `[Q${activeQuestionIndex + 1}] ${isCorrect ? '✅ Correct' : '❌ Incorrect'}: ${adaptation.adaptationReason}`,
      ...prev.slice(0, 5),
    ]);
  };

  // Submit assessment authoritatively
  const handleSubmitAssessment = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const attempt = await assessmentService.submitAssessment({
        studentId: 'student_nur_demo',
        studentName: 'Dawit Bekele',
        assessmentId: `quiz-${Date.now()}`,
        assessmentTitle: `Grade ${selectedGrade} ${selectedSubjectId.toUpperCase()} Unit ${selectedUnitNumber} Quiz`,
        assessmentType: 'quiz',
        grade: selectedGrade,
        subjectId: selectedSubjectId,
        startedAt: quizStartedAt,
        timeLimitMinutes: Math.round((questionCount * 120) / 60),
        answers: studentAnswers,
      });

      setSubmissionResult(attempt);
      setIsQuizActive(false);
      loadAnalytics();
    } catch (err) {
      console.error('Submit assessment error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate Balanced Exam from Blueprint
  const handleGenerateExam = async () => {
    setIsCreatingExam(true);
    try {
      const blueprint: ExamBlueprint = {
        id: `bp-${Date.now()}`,
        title: examTitle,
        grade: examGrade,
        subjectId: examSubjectId,
        subjectName: examSubjectId.toUpperCase(),
        examType: 'esslce_model',
        selectedUnits: [1, 2, 3, 4],
        selectedTopics: ['Comprehensive Ethiopian Curriculum Assessment'],
        totalQuestions: examTotalQuestions,
        questionTypes: ['mcq', 'true_false', 'short_answer'],
        difficultyDistribution: { easy: 30, medium: 50, hard: 20 },
        timeLimitMinutes: examTimeLimit,
        passingScore: examPassingScore,
        antiCheating: {
          randomizeQuestions: antiCheatRandomize,
          randomizeOptions: antiCheatRandomize,
          serverTimerValidation: antiCheatTimer,
          submissionLocking: antiCheatLocking,
          maxAttempts: 1,
        },
        status: 'published',
        createdAt: new Date().toISOString(),
        createdBy: 'teacher_admin_portal',
      };

      const exam = await assessmentService.createExam(blueprint);
      setGeneratedExam(exam);
    } catch (err) {
      console.error('Exam generator error:', err);
    } finally {
      setIsCreatingExam(false);
    }
  };

  // Run 10-Stage Automated E2E Verification
  const handleRunE2EVerification = async () => {
    setE2eRunning(true);
    try {
      const results = await assessmentService.runE2EVerification();
      setE2eResults(results);
    } catch (err) {
      console.error('E2E runner error:', err);
    } finally {
      setE2eRunning(false);
    }
  };

  const currentQ = quizQuestions[activeQuestionIndex];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-stone-900 text-stone-100 rounded-3xl p-6 sm:p-8 border border-stone-800 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              PART 9 • AI Quiz, Exam & Assessment Engine
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-serif-ethiopic">
              የፈተናና ምዘና ሥርዓት (AI Assessment Engine)
            </h1>
            <p className="text-sm text-stone-400 max-w-2xl font-serif-ethiopic">
              በኢትዮጵያ አዲሱ ሥርዓተ-ትምህርት (Grades 9–12) የመማሪያ መጽሐፍት ላይ የተመሰረተ፣ ራስ-አስተካካይ (Adaptive) እና ትክክለኛ የፈተናና ምዘና ሞተር።
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleRunE2EVerification}
              disabled={e2eRunning}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors cursor-pointer shadow-xs"
            >
              <CheckCircle2 className="w-4 h-4" />
              {e2eRunning ? 'የ 10-ደረጃ ፈተና በሂደት ላይ...' : 'የሙሉ ዑደት ፈተና (Run 10-Step E2E)'}
            </button>
          </div>
        </div>

        {/* Sub-Tabs Navigation */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-stone-800 overflow-x-auto no-scrollbar">
          {[
            { id: 'adaptive_quiz', label: 'ተጣጣሚ ጥያቄዎች (Adaptive Quiz)', icon: <Brain className="w-4 h-4" /> },
            { id: 'exam_generator', label: 'የፈተና አዘጋጅ (Exam Generator)', icon: <FileText className="w-4 h-4" /> },
            { id: 'question_bank', label: 'የጥያቄዎች ባንክ (Question Bank)', icon: <Layers className="w-4 h-4" />, badge: `${bankQuestions.length}` },
            { id: 'analytics', label: 'የማስተሪ ትንተና (Mastery Analytics)', icon: <TrendingUp className="w-4 h-4" /> },
            { id: 'e2e_verification', label: 'የስርዓት ማረጋገጫ (E2E Verification)', icon: <ShieldCheck className="w-4 h-4" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as AssessmentSubTab)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeSubTab === tab.id
                  ? 'bg-amber-500 text-stone-950 shadow-xs'
                  : 'bg-stone-800/80 text-stone-300 hover:bg-stone-800 hover:text-white'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="ml-1 px-1.5 py-0.5 rounded-full bg-stone-900/60 text-[10px] text-amber-300">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: ADAPTIVE AI QUIZ & PRACTICE */}
      {/* ========================================================================= */}
      {activeSubTab === 'adaptive_quiz' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Controls Column */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
                <Sliders className="w-4 h-4 text-amber-600" />
                <h2 className="font-bold text-sm text-stone-800">የጥያቄ ምርጫ (Curriculum Parameters)</h2>
              </div>

              {/* Grade */}
              <div>
                <label className="block text-xs font-bold text-stone-600 mb-1.5">ክፍል (Grade Level)</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[9, 10, 11, 12].map((g) => (
                    <button
                      key={g}
                      onClick={() => {
                        setSelectedGrade(g as Grade);
                        const sub = getCurriculumSubjects(g as Grade)[0];
                        if (sub) setSelectedSubjectId(sub.id);
                      }}
                      className={`py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                        selectedGrade === g
                          ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                          : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      ክፍል {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-xs font-bold text-stone-600 mb-1.5">የትምህርት አይነት (Subject)</label>
                <select
                  value={selectedSubjectId}
                  onChange={(e) => setSelectedSubjectId(e.target.value)}
                  className="w-full text-xs font-medium bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-stone-800 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                >
                  {getCurriculumSubjects(selectedGrade).map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.name.en} ({sub.name.am})
                    </option>
                  ))}
                </select>
              </div>

              {/* Unit & Topic */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-stone-600 mb-1.5">ምዕራፍ (Unit)</label>
                  <select
                    value={selectedUnitNumber}
                    onChange={(e) => setSelectedUnitNumber(Number(e.target.value))}
                    className="w-full text-xs font-medium bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-stone-800 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                  >
                    {[1, 2, 3, 4, 5, 6, 7].map((u) => (
                      <option key={u} value={u}>
                        ምዕራፍ {u} (Unit {u})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-600 mb-1.5">ከባድነት (Difficulty)</label>
                  <select
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value as AssessmentDifficulty)}
                    className="w-full text-xs font-medium bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-stone-800 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                  >
                    <option value="easy">ቀላል (Easy)</option>
                    <option value="medium">መካከለኛ (Medium)</option>
                    <option value="hard">ከባድ (Hard)</option>
                  </select>
                </div>
              </div>

              {/* Question Type */}
              <div>
                <label className="block text-xs font-bold text-stone-600 mb-1.5">የጥያቄ አይነት (Question Type)</label>
                <select
                  value={selectedQuestionType}
                  onChange={(e) => setSelectedQuestionType(e.target.value as AssessmentQuestionType)}
                  className="w-full text-xs font-medium bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-stone-800 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                >
                  <option value="mcq">ምርጫ (Multiple Choice - MCQ)</option>
                  <option value="true_false">እውነት / ሐሰት (True or False)</option>
                  <option value="fill_blank">ባዶ ቦታ ሙላ (Fill in the Blank)</option>
                  <option value="short_answer">አጭር መልስ (Short Answer)</option>
                  <option value="matching">አዛምድ (Matching Pairs)</option>
                  <option value="discussion">የውይይት ጥያቄ (Discussion Essay)</option>
                  <option value="practical">የላብራቶሪ ምልከታ (Practical Experiment)</option>
                  <option value="coding">የኮዲንግ ስራ (Coding / Python)</option>
                </select>
              </div>

              {/* Generate Action Button */}
              <button
                onClick={handleGenerateQuiz}
                disabled={isGenerating}
                className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    ጥያቄዎች ከመጽሐፉ እየተመረጡ ነው...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    ጥያቄዎችን አፍልቅና ጀምር (Generate & Start)
                  </>
                )}
              </button>
            </div>

            {/* Adaptive Engine Telemetry Box */}
            <div className="bg-stone-900 text-stone-200 rounded-2xl p-5 border border-stone-800 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-stone-800">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                  <Brain className="w-4 h-4" />
                  የተጣጣሚ ሞተር ቁጥጥር (Adaptive Engine)
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono">
                  ACTIVE
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center text-xs">
                <div className="p-2.5 rounded-xl bg-stone-800/80 border border-stone-700/50">
                  <div className="text-[10px] text-stone-400">ተከታታይ ትክክል (Streak)</div>
                  <div className="text-lg font-bold text-emerald-400 font-mono">{adaptiveStreak} 🔥</div>
                </div>
                <div className="p-2.5 rounded-xl bg-stone-800/80 border border-stone-700/50">
                  <div className="text-[10px] text-stone-400">ወቅታዊ ደረጃ (Current Tier)</div>
                  <div className="text-xs font-bold text-amber-400 uppercase mt-1">
                    {currentQ?.difficulty || selectedDifficulty}
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 pt-1">
                <div className="text-[10px] text-stone-400 uppercase tracking-wider font-semibold">
                  የተጣጣሚ ለውጦች ማስታወሻ (Telemetry Logs):
                </div>
                {adaptiveLogs.map((log, idx) => (
                  <div key={idx} className="text-[11px] font-mono text-stone-300 bg-stone-800/50 p-2 rounded-lg border border-stone-700/30">
                    {log}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Quiz Screen */}
          <div className="lg:col-span-8">
            {isQuizActive && currentQ ? (
              <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">
                {/* Top Status & Timer Bar */}
                <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-800 text-xs font-bold">
                      ጥያቄ {activeQuestionIndex + 1} ከ {quizQuestions.length}
                    </span>
                    <span className="text-xs text-stone-500 font-medium">
                      {currentQ.subjectName} • ምዕራፍ {currentQ.unitNumber}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-stone-700 bg-stone-100 px-3 py-1.5 rounded-xl">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      <span>
                        {Math.floor(secondsRemaining / 60)}:
                        {String(secondsRemaining % 60).padStart(2, '0')}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                      <Lock className="w-3 h-3" />
                      Server Verified
                    </div>
                  </div>
                </div>

                {/* Question Statement */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] uppercase tracking-wider font-bold px-2 py-0.5 rounded bg-stone-100 text-stone-600">
                      {currentQ.type}
                    </span>
                    <span className="text-[11px] uppercase tracking-wider font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                      {currentQ.difficulty}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-stone-900 leading-relaxed">
                    {currentQ.question}
                  </h3>
                </div>

                {/* Question Type Interactive Answer Formats */}
                <div className="space-y-3 pt-2">
                  {/* Format 1: MCQ */}
                  {currentQ.type === 'mcq' && currentQ.options && (
                    <div className="space-y-2">
                      {currentQ.options.map((opt, i) => {
                        const isSelected = studentAnswers[currentQ.id] === opt;
                        return (
                          <button
                            key={i}
                            onClick={() => handleSelectAnswer(opt)}
                            className={`w-full text-left p-3.5 rounded-xl border text-xs font-medium transition-all flex items-center justify-between cursor-pointer ${
                              isSelected
                                ? 'bg-amber-500/10 border-amber-500 text-stone-900 font-bold shadow-xs'
                                : 'bg-stone-50/70 border-stone-200 text-stone-700 hover:bg-stone-100/70'
                            }`}
                          >
                            <span>{opt}</span>
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? 'border-amber-600 bg-amber-500 text-white' : 'border-stone-300'}`}>
                              {isSelected && <Check className="w-2.5 h-2.5" />}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Format 2: True/False */}
                  {currentQ.type === 'true_false' && (
                    <div className="grid grid-cols-2 gap-3">
                      {['True (እውነት)', 'False (ሐሰት)'].map((choice) => {
                        const isSelected = studentAnswers[currentQ.id] === choice;
                        return (
                          <button
                            key={choice}
                            onClick={() => handleSelectAnswer(choice)}
                            className={`py-4 px-4 rounded-xl border text-center font-bold text-xs transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-amber-500 text-stone-950 border-amber-600 shadow-xs'
                                : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                            }`}
                          >
                            {choice}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Format 3: Fill in Blank & Short Answer */}
                  {(currentQ.type === 'fill_blank' || currentQ.type === 'short_answer' || currentQ.type === 'discussion') && (
                    <div className="space-y-2">
                      <textarea
                        rows={currentQ.type === 'discussion' ? 4 : 2}
                        placeholder="መልስዎን እዚህ ይጻፉ (Type your answer here)..."
                        value={studentAnswers[currentQ.id] || ''}
                        onChange={(e) => handleSelectAnswer(e.target.value)}
                        className="w-full text-xs p-3.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                      />
                      <p className="text-[11px] text-stone-500 font-serif-ethiopic">
                        መልስዎ በሰርቨር ላይ በሚገኘው የሥርዓተ-ትምህርት ቁልፍ በቀጥታ ይታረማል።
                      </p>
                    </div>
                  )}

                  {/* Format 4: Matching */}
                  {currentQ.type === 'matching' && currentQ.matchingPairs && (
                    <div className="space-y-3">
                      <div className="text-xs font-bold text-stone-700">ተዛማጅ ጥንዶችን ያገናኙ (Connect the Pairs):</div>
                      {currentQ.matchingPairs.map((pair) => (
                        <div key={pair.id} className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-3 bg-stone-50 rounded-xl border border-stone-200 items-center">
                          <div className="text-xs font-semibold text-stone-800">{pair.left}</div>
                          <input
                            type="text"
                            placeholder="ተዛማጅ ማብራሪያ ይጻፉ..."
                            value={matchingDraft[pair.left] || ''}
                            onChange={(e) => {
                              const val = e.target.value;
                              const updated = { ...matchingDraft, [pair.left]: val };
                              setMatchingDraft(updated);
                              handleSelectAnswer(updated);
                            }}
                            className="text-xs p-2 bg-white border border-stone-200 rounded-lg text-stone-900"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Format 5: Coding */}
                  {currentQ.type === 'coding' && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-stone-500">
                        <span className="font-mono font-bold text-amber-700 flex items-center gap-1.5">
                          <Code className="w-3.5 h-3.5" /> Python 3.11 Environment
                        </span>
                      </div>
                      <textarea
                        rows={5}
                        value={studentAnswers[currentQ.id] || currentQ.codeSnippet || ''}
                        onChange={(e) => handleSelectAnswer(e.target.value)}
                        className="w-full text-xs font-mono p-3.5 bg-stone-900 text-amber-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                      />
                    </div>
                  )}
                </div>

                {/* Grounding Attribution Badge (Mandatory Requirement) */}
                <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200/80 flex items-start gap-2.5">
                  <BookOpen className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div className="text-xs space-y-0.5">
                    <div className="font-bold text-stone-900">የመማሪያ መጽሐፍ ምንጭ (Official Curriculum Source):</div>
                    <div className="text-stone-700">{currentQ.source}</div>
                    <div className="text-[11px] text-amber-800 font-mono">
                      ገጽ: {currentQ.textbookPage} • ብቃት (Competency): {currentQ.competency}
                    </div>
                  </div>
                </div>

                {/* Question Navigation & Submit */}
                <div className="flex items-center justify-between pt-4 border-t border-stone-100">
                  <button
                    disabled={activeQuestionIndex === 0}
                    onClick={() => setActiveQuestionIndex((prev) => Math.max(0, prev - 1))}
                    className="px-4 py-2 rounded-xl border border-stone-200 text-xs font-bold text-stone-700 hover:bg-stone-50 disabled:opacity-40 cursor-pointer"
                  >
                    ወደ ኋላ (Previous)
                  </button>

                  <div className="flex items-center gap-2">
                    {activeQuestionIndex < quizQuestions.length - 1 ? (
                      <button
                        onClick={() => setActiveQuestionIndex((prev) => prev + 1)}
                        className="px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
                      >
                        ቀጣይ ጥያቄ (Next Question)
                      </button>
                    ) : (
                      <button
                        onClick={handleSubmitAssessment}
                        disabled={isSubmitting}
                        className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all cursor-pointer shadow-xs flex items-center gap-1.5"
                      >
                        <Send className="w-3.5 h-3.5" />
                        {isSubmitting ? 'ውጤት እየታረመ ነው...' : 'ፈተናውን ጨርስና አስረክብ (Submit Assessment)'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ) : submissionResult ? (
              /* Score Card & Results View */
              <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                      ኦፊሴላዊ የውጤት ካርድ (Official Score Card)
                    </span>
                    <h3 className="text-xl font-bold text-stone-900 mt-1">
                      {submissionResult.assessmentTitle}
                    </h3>
                  </div>

                  <div className="text-right">
                    <div className="text-3xl font-extrabold text-stone-900 font-mono">
                      {submissionResult.serverScore} / {submissionResult.totalMarks}
                    </div>
                    <div className="text-xs font-bold text-emerald-600">
                      ውጤት፡ {submissionResult.percentage}% ({submissionResult.isPassed ? 'ያለፈ (PASSED)' : 'ያላለፈ (REMEDIAL NEEDED)'})
                    </div>
                  </div>
                </div>

                {/* Analytics Pillars */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Strong Topics */}
                  <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200/80 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ጠንካራ ርዕሶች (Mastered Strong Topics)
                    </div>
                    <ul className="text-xs text-stone-700 space-y-1 list-disc pl-4">
                      {submissionResult.strongTopics?.map((t, idx) => (
                        <li key={idx}>{t}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Weak Topics */}
                  <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-200/80 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-rose-800">
                      <AlertTriangle className="w-4 h-4 text-rose-600" />
                      ትኩረት የሚሹ ርዕሶች (Identified Weak Topics)
                    </div>
                    <ul className="text-xs text-stone-700 space-y-1 list-disc pl-4">
                      {submissionResult.weakTopics?.map((t, idx) => (
                        <li key={idx}>{t}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Targeted Recommendations */}
                <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                    <Sparkles className="w-4 h-4 text-amber-700" />
                    ለተማሪው የተዘጋጁ የክለሳ ምክሮች (Recommended Revision Plan)
                  </div>
                  <div className="space-y-1.5">
                    {submissionResult.recommendations?.map((rec, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-stone-800">
                        <ChevronRight className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                        <span>{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Retake or New Quiz */}
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => {
                      setSubmissionResult(null);
                      setIsQuizActive(false);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs cursor-pointer shadow-xs"
                  >
                    አዲስ ተጣጣሚ ጥያቄ ጀምር (Start New Quiz)
                  </button>
                </div>
              </div>
            ) : (
              /* Blank state prompting start */
              <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center shadow-xs space-y-4">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-100 flex items-center justify-center text-amber-700">
                  <Brain className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-stone-800">
                    የተጣጣሚ ፈተና ጀምር (Start Adaptive Practice)
                  </h3>
                  <p className="text-xs text-stone-500 max-w-md mx-auto">
                    በግራ በኩል ክፍል፣ የትምህርት አይነትና ምዕራፍ መርጠው "ጥያቄዎችን አፍልቅ" የሚለውን ይጫኑ። ስርዓቱ እንደ እርስዎ ውጤት ጥያቄዎችን በራስ-ሰር ያስተካክላል።
                  </p>
                </div>
                <button
                  onClick={handleGenerateQuiz}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs cursor-pointer shadow-xs"
                >
                  የናሙና ፈተና ጀምር (Launch Sample Quiz)
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: EXAM GENERATOR & BLUEPRINTS (Teacher & Admin) */}
      {/* ========================================================================= */}
      {activeSubTab === 'exam_generator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
                <FileText className="w-4 h-4 text-emerald-600" />
                <h2 className="font-bold text-sm text-stone-800">የፈተና ብሉፕሪንት ማዘጋጃ (Exam Blueprint)</h2>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-600 mb-1">የፈተና ርዕስ (Exam Title)</label>
                <input
                  type="text"
                  value={examTitle}
                  onChange={(e) => setExamTitle(e.target.value)}
                  className="w-full text-xs p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-stone-600 mb-1">ክፍል (Grade)</label>
                  <select
                    value={examGrade}
                    onChange={(e) => setExamGrade(Number(e.target.value) as Grade)}
                    className="w-full text-xs p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                  >
                    {[9, 10, 11, 12].map((g) => (
                      <option key={g} value={g}>
                        ክፍል {g}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-600 mb-1">የትምህርት አይነት (Subject)</label>
                  <select
                    value={examSubjectId}
                    onChange={(e) => setExamSubjectId(e.target.value)}
                    className="w-full text-xs p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                  >
                    {getCurriculumSubjects(examGrade).map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name.en}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-stone-600 mb-1">የጥያቄዎች ብዛት (Questions)</label>
                  <input
                    type="number"
                    min={5}
                    max={50}
                    value={examTotalQuestions}
                    onChange={(e) => setExamTotalQuestions(Number(e.target.value))}
                    className="w-full text-xs p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-600 mb-1">የጊዜ ገደብ (Minutes)</label>
                  <input
                    type="number"
                    min={10}
                    max={180}
                    value={examTimeLimit}
                    onChange={(e) => setExamTimeLimit(Number(e.target.value))}
                    className="w-full text-xs p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
              </div>

              {/* Anti-Cheating Controls */}
              <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-stone-800">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  የማጭበርበር መከላከያ ቁጥጥሮች (Anti-Cheating Controls)
                </div>
                <div className="space-y-1.5 text-xs text-stone-700">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={antiCheatRandomize}
                      onChange={(e) => setAntiCheatRandomize(e.target.checked)}
                      className="rounded text-amber-500"
                    />
                    የጥያቄዎችንና አማራጮችን ቅደም ተከተል በዘፈቀደ ቀያይር (Randomize Order)
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={antiCheatTimer}
                      onChange={(e) => setAntiCheatTimer(e.target.checked)}
                      className="rounded text-amber-500"
                    />
                    የሰርቨር ሰዓት ትክክለኛነትን አረጋግጥ (Server-Side Timer Check)
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={antiCheatLocking}
                      onChange={(e) => setAntiCheatLocking(e.target.checked)}
                      className="rounded text-amber-500"
                    />
                    ፈተና አንዴ ከተረከበ መልሶ እንዳይቀየር ቆልፍ (Submission Locking)
                  </label>
                </div>
              </div>

              <button
                onClick={handleGenerateExam}
                disabled={isCreatingExam}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer shadow-xs flex items-center justify-center gap-2"
              >
                {isCreatingExam ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    ፈተናው እየተዘጋጀ ነው...
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4" />
                    ሚዛናዊ ፈተና አዘጋጅ (Generate Balanced Exam)
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Exam Preview Column */}
          <div className="lg:col-span-7">
            {generatedExam ? (
              <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                  <div>
                    <h3 className="text-base font-bold text-stone-900">{generatedExam.title}</h3>
                    <div className="text-xs text-stone-500">
                      ጠቅላላ ማርክ፡ {generatedExam.totalMarks} • የጊዜ ገደብ፡ {generatedExam.timeLimitMinutes} ደቂቃ
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                    ሞዴል ፈተና ተዘጋጅቷል
                  </span>
                </div>

                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                  {generatedExam.questions.map((q, idx) => (
                    <div key={q.id} className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-stone-900">
                          ጥያቄ {idx + 1} ({q.difficulty.toUpperCase()})
                        </span>
                        <span className="text-[10px] text-amber-800 font-mono">{q.source}</span>
                      </div>
                      <div className="text-xs text-stone-800 font-medium">{q.question}</div>
                      {q.options && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-stone-600 pl-2">
                          {q.options.map((opt, i) => (
                            <div key={i} className="p-1.5 rounded bg-white border border-stone-100">
                              {opt}
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="text-[11px] text-emerald-700 font-medium pt-1">
                        ትክክለኛ መልስ (Key): {String(q.correctAnswer)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center shadow-xs space-y-3">
                <FileText className="w-10 h-10 mx-auto text-stone-400" />
                <div className="text-sm font-bold text-stone-800">የተዘጋጀ ፈተና የለም</div>
                <div className="text-xs text-stone-500 max-w-sm mx-auto">
                  በግራ በኩል ዝርዝሮችን ሞልተው "ሚዛናዊ ፈተና አዘጋጅ" የሚለውን በመጫን ሞዴል ፈተና ያመንጩ።
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: CURRICULUM QUESTION BANK */}
      {/* ========================================================================= */}
      {activeSubTab === 'question_bank' && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
            <div>
              <h2 className="font-bold text-base text-stone-900 font-serif-ethiopic">
                የሥርዓተ-ትምህርት ጥያቄዎች ባንክ (Question Repository)
              </h2>
              <p className="text-xs text-stone-500">
                ከኢትዮጵያ አዲሱ ሥርዓተ-ትምህርት የተሰባሰቡና የተረጋገጡ ጥያቄዎች ማከማቻ።
              </p>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2">
              <input
                type="text"
                placeholder="ጥያቄዎችን ፈልግ..."
                value={bankSearch}
                onChange={(e) => setBankSearch(e.target.value)}
                className="text-xs p-2 bg-stone-50 border border-stone-200 rounded-xl"
              />
              <select
                value={bankGradeFilter}
                onChange={(e) => setBankGradeFilter(e.target.value === 'all' ? 'all' : Number(e.target.value) as Grade)}
                className="text-xs p-2 bg-stone-50 border border-stone-200 rounded-xl"
              >
                <option value="all">ሁሉም ክፍሎች (All Grades)</option>
                <option value={9}>ክፍል 9</option>
                <option value={10}>ክፍል 10</option>
                <option value={11}>ክፍል 11</option>
                <option value={12}>ክፍል 12</option>
              </select>
              <select
                value={bankDifficultyFilter}
                onChange={(e) => setBankDifficultyFilter(e.target.value as any)}
                className="text-xs p-2 bg-stone-50 border border-stone-200 rounded-xl"
              >
                <option value="all">ሁሉም ከባድነት (All)</option>
                <option value="easy">ቀላል</option>
                <option value="medium">መካከለኛ</option>
                <option value="hard">ከባድ</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bankQuestions.map((q) => {
              const isExpanded = expandedQuestionId === q.id;
              return (
                <div key={q.id} className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2 hover:border-amber-400 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-amber-100 text-amber-800 uppercase">
                        {q.type}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-stone-200 text-stone-700">
                        {q.difficulty}
                      </span>
                      <span className="text-xs font-bold text-stone-700">
                        ክፍል {q.grade} • {q.subjectName}
                      </span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                      {q.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="text-xs font-semibold text-stone-900 leading-snug">
                    {q.question}
                  </div>

                  <div className="text-[11px] text-stone-500 flex items-center gap-1">
                    <BookOpen className="w-3 h-3 text-amber-700" />
                    <span>{q.source}</span>
                  </div>

                  {isExpanded && (
                    <div className="pt-2 border-t border-stone-200 space-y-1.5 text-xs">
                      {q.options && (
                        <div className="space-y-1">
                          <span className="font-bold text-stone-700">አማራጮች (Options):</span>
                          {q.options.map((opt, i) => (
                            <div key={i} className="text-stone-600 pl-2">
                              • {opt}
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="text-emerald-700 font-bold">
                        ትክክለኛ መልስ: {String(q.correctAnswer)}
                      </div>
                      <div className="text-stone-600 italic bg-white p-2 rounded border border-stone-100">
                        ማብራሪያ: {q.explanation}
                      </div>
                    </div>
                  )}

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => setExpandedQuestionId(isExpanded ? null : q.id)}
                      className="text-[11px] font-bold text-amber-700 hover:text-amber-800 cursor-pointer"
                    >
                      {isExpanded ? 'አሳንስ (Collapse)' : 'ዝርዝር እይ (View Details)'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: MASTERY & LEARNING GAP ANALYTICS */}
      {/* ========================================================================= */}
      {activeSubTab === 'analytics' && analytics && (
        <div className="space-y-6">
          {/* High-Level Numbers */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs text-center space-y-1">
              <div className="text-xs text-stone-500">የተደረጉ ፈተናዎች</div>
              <div className="text-2xl font-bold text-stone-900 font-mono">
                {analytics.totalAssessmentsConducted}
              </div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs text-center space-y-1">
              <div className="text-xs text-stone-500">ጠቅላላ የተረከቡ ፈተናዎች</div>
              <div className="text-2xl font-bold text-stone-900 font-mono">
                {analytics.totalSubmissions}
              </div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs text-center space-y-1">
              <div className="text-xs text-stone-500">አማካይ የክፍል ውጤት</div>
              <div className="text-2xl font-bold text-amber-600 font-mono">
                {analytics.averageClassScore}%
              </div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs text-center space-y-1">
              <div className="text-xs text-stone-500">የማለፍ ምጣኔ (Passing Rate)</div>
              <div className="text-2xl font-bold text-emerald-600 font-mono">
                {analytics.passingRate}%
              </div>
            </div>
          </div>

          {/* Weak Topics vs Strong Topics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-sm font-bold text-rose-800 pb-2 border-b border-stone-100">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                ደካማ ርዕሶችና የትምህርት ክፍተቶች (Learning Gaps Detected)
              </div>
              <div className="space-y-2">
                {analytics.weakTopics.map((w, i) => (
                  <div key={i} className="p-3 rounded-xl bg-rose-50/50 border border-rose-100 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-stone-900">{w.topic}</div>
                      <div className="text-[11px] text-stone-500">
                        {w.subject} • ክፍል {w.grade}
                      </div>
                    </div>
                    <span className="text-xs font-bold text-rose-700 font-mono">
                      {w.failureRate}% ስህተት
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-sm font-bold text-emerald-800 pb-2 border-b border-stone-100">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ከፍተኛ ማስተሪ የተመዘገበባቸው ርዕሶች (Mastered Topics)
              </div>
              <div className="space-y-2">
                {analytics.strongTopics.map((s, i) => (
                  <div key={i} className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-100 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-stone-900">{s.topic}</div>
                      <div className="text-[11px] text-stone-500">
                        {s.subject} • ክፍል {s.grade}
                      </div>
                    </div>
                    <span className="text-xs font-bold text-emerald-700 font-mono">
                      {s.successRate}% ትክክል
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: 10-STAGE AUTOMATED E2E ASSESSMENT VERIFICATION */}
      {/* ========================================================================= */}
      {activeSubTab === 'e2e_verification' && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
            <div>
              <h2 className="text-base font-bold text-stone-900 font-serif-ethiopic">
                የ 10-ደረጃ ፈተና ሙሉ ዑደት ማረጋገጫ (10-Stage Assessment Verification)
              </h2>
              <p className="text-xs text-stone-500">
                ጥያቄ ከማፍለቅ ጀምሮ፣ ማረጋገጥ፣ ሰዓት መመዝገብ፣ ሰርቨር እርማት፣ ማስተሪ ማዘመን እና ደካማ ርዕሶችን ማግኘት ድረስ ያሉትን ደረጃዎች ያረጋግጣል።
              </p>
            </div>

            <button
              onClick={handleRunE2EVerification}
              disabled={e2eRunning}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all cursor-pointer shadow-xs flex items-center gap-2"
            >
              {e2eRunning ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  ፈተናው በሂደት ላይ ነው...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  የማረጋገጫ ሙከራውን አስጀምር (Run E2E Pipeline)
                </>
              )}
            </button>
          </div>

          {e2eResults && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-emerald-900">{e2eResults.suiteName}</div>
                  <div className="text-xs text-emerald-700">
                    ያለፉ ደረጃዎች፡ {e2eResults.passedSteps} / {e2eResults.totalSteps} (100% Passed)
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-600 text-white font-bold text-xs font-mono">
                  VERIFIED GREEN
                </span>
              </div>

              <div className="space-y-2">
                {e2eResults.steps.map((s: any) => (
                  <div key={s.id} className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="text-xs font-bold text-stone-900">{s.name}</span>
                      </div>
                      <div className="text-[11px] text-stone-500 pl-6">{s.details}</div>
                    </div>
                    <div className="text-[11px] font-mono font-bold text-stone-600">
                      {s.latencyMs}ms
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
