import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  BookOpen,
  Award,
  CheckCircle2,
  Lock,
  FileText,
  FlaskConical,
  Send,
  AlertTriangle,
  RotateCcw,
  Clock,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  Download,
  Flame,
  HelpCircle,
  Layers,
  Percent,
  Check,
  Zap,
} from 'lucide-react';
import { Grade, Subject } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useSubscription } from '../../context/SubscriptionContext';

interface AcademicWorkHubViewProps {
  onNavigateToPayment: () => void;
  selectedGrade?: Grade;
  onGradeChange?: (grade: Grade) => void;
}

type WorkHubTab = 'homework' | 'assignment' | 'project' | 'portfolio' | 'admin_controls';

export const AcademicWorkHubView: React.FC<AcademicWorkHubViewProps> = ({
  onNavigateToPayment,
  selectedGrade: propGrade = 10,
  onGradeChange,
}) => {
  const { user, userProfile } = useAuth();
  const { subscription, isOwnerSuperAdmin } = useSubscription();

  const [activeTab, setActiveTab] = useState<WorkHubTab>('homework');
  const [currentGrade, setCurrentGrade] = useState<Grade>(propGrade);
  const [selectedSubject, setSelectedSubject] = useState<string>('Mathematics');

  // Entitlement state
  const [isPremiumEntitled, setIsPremiumEntitled] = useState<boolean>(false);
  const [entitlementLoading, setEntitlementLoading] = useState<boolean>(true);

  // Homework state
  const [hwChapter, setHwChapter] = useState<string>('Unit 2: Polynomial Functions and Relations');
  const [isGeneratingHw, setIsGeneratingHw] = useState<boolean>(false);
  const [currentHomework, setCurrentHomework] = useState<any>(null);
  const [hwAnswers, setHwAnswers] = useState<Record<string, string>>({});
  const [hwGradingResult, setHwGradingResult] = useState<any>(null);
  const [isSubmittingHw, setIsSubmittingHw] = useState<boolean>(false);

  // Premium Assignment state
  const [asgnTopic, setAsgnTopic] = useState<string>('Higher-Order Quadratic Modeling and Real-World Optimization');
  const [isGeneratingAsgn, setIsGeneratingAsgn] = useState<boolean>(false);
  const [currentAssignment, setCurrentAssignment] = useState<any>(null);
  const [asgnSubmissionText, setAsgnSubmissionText] = useState<string>('');
  const [asgnEvalResult, setAsgnEvalResult] = useState<any>(null);
  const [isSubmittingAsgn, setIsSubmittingAsgn] = useState<boolean>(false);

  // Premium Project state
  const [projectType, setProjectType] = useState<'experiment' | 'investigation' | 'prototype'>('experiment');
  const [isGeneratingProj, setIsGeneratingProj] = useState<boolean>(false);
  const [currentProject, setCurrentProject] = useState<any>(null);
  const [currentPhase, setCurrentPhase] = useState<number>(1);
  const [phaseSubmissionText, setPhaseSubmissionText] = useState<string>('');
  const [phaseEvalResult, setPhaseEvalResult] = useState<any>(null);
  const [isSubmittingPhase, setIsSubmittingPhase] = useState<boolean>(false);

  // Portfolio & Admin state
  const [portfolioRecords, setPortfolioRecords] = useState<any[]>([]);
  const [adminStats, setAdminStats] = useState<any>(null);
  const [overrideRecordId, setOverrideRecordId] = useState<string>('');
  const [overrideScore, setOverrideScore] = useState<number>(95);
  const [overrideFeedback, setOverrideFeedback] = useState<string>('');

  // 1. Verify Server-Side Entitlement
  useEffect(() => {
    const verifyEntitlement = async () => {
      setEntitlementLoading(true);
      try {
        const res = await fetch('/api/premium/verify-student-entitlement', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user?.uid,
            userEmail: user?.email,
            subscription,
          }),
        });
        const data = await res.json();
        setIsPremiumEntitled(Boolean(data.isPremium || isOwnerSuperAdmin));
      } catch (err) {
        setIsPremiumEntitled(isOwnerSuperAdmin);
      } finally {
        setEntitlementLoading(false);
      }
    };

    verifyEntitlement();
  }, [user, subscription, isOwnerSuperAdmin]);

  // Load records
  const loadRecords = async () => {
    try {
      const res = await fetch(`/api/admin/academic-engine/records?email=${encodeURIComponent(user?.email || '')}`);
      const data = await res.json();
      if (data.records) setPortfolioRecords(data.records);
      if (data.stats) setAdminStats(data.stats);
    } catch (err) {
      console.error('Failed to load academic records', err);
    }
  };

  useEffect(() => {
    loadRecords();
  }, [user]);

  const handleGradeChange = (g: Grade) => {
    setCurrentGrade(g);
    if (onGradeChange) onGradeChange(g);
  };

  // --- HOMEWORK ACTIONS ---
  const handleGenerateHomework = async () => {
    setIsGeneratingHw(true);
    setHwGradingResult(null);
    setHwAnswers({});
    try {
      const res = await fetch('/api/ai/homework/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: selectedSubject,
          grade: currentGrade,
          topic: hwChapter,
        }),
      });
      const data = await res.json();
      if (data.success && data.content) {
        setCurrentHomework({
          id: data.homeworkId,
          ...data.content,
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingHw(false);
    }
  };

  const handleSubmitHomework = async () => {
    if (!currentHomework) return;
    setIsSubmittingHw(true);
    try {
      const res = await fetch('/api/ai/homework/submit-and-grade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          homeworkId: currentHomework.id,
          studentAnswers: hwAnswers,
          studentName: userProfile?.displayName || user?.displayName || 'Student',
          studentId: user?.uid || 'anon',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setHwGradingResult(data);
        loadRecords();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingHw(false);
    }
  };

  // --- PREMIUM ASSIGNMENT ACTIONS ---
  const handleGenerateAssignment = async () => {
    if (!isPremiumEntitled && !isOwnerSuperAdmin) {
      onNavigateToPayment();
      return;
    }
    setIsGeneratingAsgn(true);
    setAsgnEvalResult(null);
    try {
      const res = await fetch('/api/ai/premium/assignment/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: selectedSubject,
          grade: currentGrade,
          topic: asgnTopic,
          userId: user?.uid,
          userEmail: user?.email,
          subscription,
        }),
      });
      const data = await res.json();
      if (data.success && data.assignment) {
        setCurrentAssignment({
          id: data.assignmentId,
          ...data.assignment,
        });
      } else if (data.isPremiumRequired) {
        onNavigateToPayment();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingAsgn(false);
    }
  };

  const handleSubmitAssignment = async () => {
    if (!currentAssignment || !asgnSubmissionText.trim()) return;
    setIsSubmittingAsgn(true);
    try {
      const res = await fetch('/api/ai/premium/assignment/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assignmentId: currentAssignment.id,
          studentSubmission: asgnSubmissionText,
          studentName: userProfile?.displayName || user?.displayName || 'Student',
          studentId: user?.uid || 'anon',
          userId: user?.uid,
          userEmail: user?.email,
          subscription,
        }),
      });
      const data = await res.json();
      if (data.success && data.evaluation) {
        setAsgnEvalResult(data.evaluation);
        loadRecords();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingAsgn(false);
    }
  };

  // --- PREMIUM PROJECT ACTIONS ---
  const handleGenerateProject = async () => {
    if (!isPremiumEntitled && !isOwnerSuperAdmin) {
      onNavigateToPayment();
      return;
    }
    setIsGeneratingProj(true);
    setPhaseEvalResult(null);
    try {
      const res = await fetch('/api/ai/premium/project/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: selectedSubject,
          grade: currentGrade,
          projectType,
          userId: user?.uid,
          userEmail: user?.email,
          subscription,
        }),
      });
      const data = await res.json();
      if (data.success && data.project) {
        setCurrentProject({
          id: data.projectId,
          ...data.project,
        });
        setCurrentPhase(1);
      } else if (data.isPremiumRequired) {
        onNavigateToPayment();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingProj(false);
    }
  };

  const handleSubmitProjectPhase = async () => {
    if (!currentProject || !phaseSubmissionText.trim()) return;
    setIsSubmittingPhase(true);
    try {
      const res = await fetch('/api/ai/premium/project/evaluate-milestone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: currentProject.id,
          phaseNumber: currentPhase,
          submissionContent: phaseSubmissionText,
          studentName: userProfile?.displayName || user?.displayName || 'Student',
          studentId: user?.uid || 'anon',
          userId: user?.uid,
          userEmail: user?.email,
          subscription,
        }),
      });
      const data = await res.json();
      if (data.success && data.milestoneEvaluation) {
        setPhaseEvalResult(data.milestoneEvaluation);
        if (data.milestoneEvaluation.approvedForNextPhase && currentPhase < 3) {
          setCurrentPhase(currentPhase + 1);
          setPhaseSubmissionText('');
        }
        loadRecords();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingPhase(false);
    }
  };

  // Super Admin override
  const handleAdminOverride = async (recordId: string) => {
    try {
      const res = await fetch('/api/admin/academic-engine/override-grade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recordId,
          newScore: overrideScore,
          newFeedback: overrideFeedback,
          adminEmail: user?.email,
        }),
      });
      const data = await res.json();
      if (data.success) {
        alert('Grade overridden successfully by Super Admin.');
        loadRecords();
        setOverrideRecordId('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 font-sans">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-amber-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl mb-6 relative overflow-hidden border border-amber-900/40">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="bg-amber-500/20 text-amber-300 text-[11px] font-black px-2.5 py-0.5 rounded-full border border-amber-500/30 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                NUR AI Academic Work Engine
              </span>
              <span className="bg-white/10 text-stone-300 text-[11px] font-semibold px-2 py-0.5 rounded-full">
                Zero-Teacher • Fully Automated AI Examiner
              </span>
              {isPremiumEntitled ? (
                <span className="bg-emerald-500/20 text-emerald-300 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  PREMIUM STUDENT (54 ETB Active)
                </span>
              ) : (
                <span className="bg-stone-500/30 text-stone-300 text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
                  NORMAL STUDENT (Homework Access)
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white font-serif-ethiopic">
              የቤት ስራ፣ ፕሪሚየም አሳይንመንትና ፕሮጀክት ማዕከል
            </h1>
            <p className="text-stone-300 text-sm mt-1 max-w-2xl">
              AI automatically generates, examines, and grades assignments and real-world STEM projects aligned strictly with the Ethiopian Ministry of Education curriculum.
            </p>
          </div>

          {/* Upgrade prompt if not premium */}
          {!isPremiumEntitled && !isOwnerSuperAdmin && (
            <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-2xl shrink-0 flex flex-col items-start gap-2 max-w-xs">
              <div className="flex items-center gap-2 text-amber-300 text-xs font-bold">
                <Lock className="w-4 h-4 text-amber-400" />
                <span>ፕሪሚየም አሳይንመንትና ፕሮጀክቶች</span>
              </div>
              <p className="text-[11px] text-stone-300">
                Unlock higher-order multi-step assignments, hands-on lab projects, and rubric auto-grading for just <strong className="text-amber-300">54 ETB/month</strong>.
              </p>
              <button
                onClick={onNavigateToPayment}
                className="w-full py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-stone-950 font-black text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Zap className="w-3.5 h-3.5 fill-stone-950" />
                በወር 54 ብር ፕሪሚየም ይክፈቱ
              </button>
            </div>
          )}
        </div>

        {/* Grade & Subject Selector */}
        <div className="relative z-10 flex flex-wrap items-center gap-3 mt-6 pt-6 border-t border-white/10">
          <span className="text-xs text-stone-400 font-semibold">የትምህርት ደረጃ (Grade):</span>
          <div className="flex gap-1.5 bg-white/10 p-1 rounded-xl">
            {([9, 10, 11, 12] as Grade[]).map((g) => (
              <button
                key={g}
                onClick={() => handleGradeChange(g)}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  currentGrade === g
                    ? 'bg-amber-500 text-stone-950 shadow-xs'
                    : 'text-stone-300 hover:text-white hover:bg-white/10'
                }`}
              >
                ክፍል {g}
              </button>
            ))}
          </div>

          <span className="text-xs text-stone-400 font-semibold ml-2">የትምህርት ዓይነት (Subject):</span>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="bg-stone-800 text-white text-xs font-semibold px-3 py-1.5 rounded-xl border border-stone-700 outline-none cursor-pointer"
          >
            <option value="Mathematics">ሂሳብ (Mathematics)</option>
            <option value="Physics">ፊዚክስ (Physics)</option>
            <option value="Chemistry">ኬሚስትሪ (Chemistry)</option>
            <option value="Biology">ባዮሎጂ (Biology)</option>
            <option value="English">እንግሊዝኛ (English)</option>
            <option value="General Science">አጠቃላይ ሳይንስ (General Science)</option>
          </select>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-stone-300 pb-3 mb-6 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('homework')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'homework'
              ? 'bg-stone-900 text-white shadow-md'
              : 'bg-stone-200/70 text-stone-700 hover:bg-stone-200'
          }`}
        >
          <BookOpen className="w-4 h-4 text-emerald-400" />
          <span>1. የቤት ስራ ሞተር (AI Homework)</span>
          <span className="bg-emerald-500/20 text-emerald-800 text-[10px] px-1.5 py-0.2 rounded-md font-extrabold">
            FREE / NORMAL
          </span>
        </button>

        <button
          onClick={() => setActiveTab('assignment')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'assignment'
              ? 'bg-stone-900 text-white shadow-md'
              : 'bg-stone-200/70 text-stone-700 hover:bg-stone-200'
          }`}
        >
          <Award className="w-4 h-4 text-amber-400" />
          <span>2. ፕሪሚየም አሳይንመንት (AI Premium Assignment)</span>
          <span className="bg-amber-500/20 text-amber-800 text-[10px] px-1.5 py-0.2 rounded-md font-extrabold flex items-center gap-0.5">
            <Lock className="w-2.5 h-2.5" /> 54 ETB
          </span>
        </button>

        <button
          onClick={() => setActiveTab('project')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'project'
              ? 'bg-stone-900 text-white shadow-md'
              : 'bg-stone-200/70 text-stone-700 hover:bg-stone-200'
          }`}
        >
          <FlaskConical className="w-4 h-4 text-cyan-400" />
          <span>3. ፕሪሚየም ፕሮጀክት (AI Premium Project)</span>
          <span className="bg-amber-500/20 text-amber-800 text-[10px] px-1.5 py-0.2 rounded-md font-extrabold flex items-center gap-0.5">
            <Lock className="w-2.5 h-2.5" /> 54 ETB
          </span>
        </button>

        <button
          onClick={() => setActiveTab('portfolio')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'portfolio'
              ? 'bg-stone-900 text-white shadow-md'
              : 'bg-stone-200/70 text-stone-700 hover:bg-stone-200'
          }`}
        >
          <Layers className="w-4 h-4 text-purple-400" />
          <span>4. የተማሪ ፖርትፎሊዮ (Portfolio)</span>
          <span className="bg-stone-300 text-stone-800 text-[10px] px-1.5 py-0.2 rounded-md font-extrabold">
            {portfolioRecords.length}
          </span>
        </button>

        {isOwnerSuperAdmin && (
          <button
            onClick={() => setActiveTab('admin_controls')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'admin_controls'
                ? 'bg-rose-900 text-white shadow-md'
                : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-rose-400" />
            <span>5. Super Admin Academic Controls</span>
          </button>
        )}
      </div>

      {/* --- TAB 1: AI HOMEWORK ENGINE (NORMAL / FREE) --- */}
      {activeTab === 'homework' && (
        <div className="space-y-6">
          <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-stone-100 pb-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Normal Student Access • AI Auto-Examiner
                </span>
                <h2 className="text-xl font-black text-stone-900 mt-1">
                  Grade {currentGrade} {selectedSubject} Homework Generator
                </h2>
                <p className="text-xs text-stone-500">
                  Select a chapter to generate high-yield practice questions. AI grades your submission instantly.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={hwChapter}
                  onChange={(e) => setHwChapter(e.target.value)}
                  placeholder="Chapter or Topic..."
                  className="px-3 py-2 text-xs border border-stone-300 rounded-xl outline-none focus:border-stone-800 w-64"
                />
                <button
                  onClick={handleGenerateHomework}
                  disabled={isGeneratingHw}
                  className="px-4 py-2 bg-stone-900 hover:bg-black text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 disabled:opacity-50"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  {isGeneratingHw ? 'በማመንጨት ላይ...' : 'የቤት ስራ አመንጭ (Generate)'}
                </button>
              </div>
            </div>

            {/* Generated Homework Form */}
            {currentHomework ? (
              <div className="mt-6 space-y-6">
                <div className="bg-stone-50 border border-stone-200/80 rounded-2xl p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-stone-900">{currentHomework.title}</h3>
                    <span className="text-xs text-stone-500 font-semibold">{currentHomework.questions?.length} Questions</span>
                  </div>
                  <p className="text-xs text-stone-600 mt-1">{currentHomework.objective}</p>
                </div>

                {/* Questions */}
                <div className="space-y-4">
                  {currentHomework.questions?.map((q: any, idx: number) => (
                    <div key={q.id || idx} className="bg-white border border-stone-200 rounded-2xl p-5">
                      <div className="flex items-start gap-3">
                        <span className="w-6 h-6 rounded-full bg-stone-100 text-stone-800 text-xs font-black flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-stone-900 mb-3">{q.question}</p>

                          {q.type === 'mcq' && q.options ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {q.options.map((opt: string, optIdx: number) => {
                                const optLetter = opt.charAt(0);
                                const isSelected = hwAnswers[q.id] === optLetter;
                                return (
                                  <button
                                    key={optIdx}
                                    onClick={() => setHwAnswers({ ...hwAnswers, [q.id]: optLetter })}
                                    className={`p-3 text-left text-xs font-medium rounded-xl border transition-all cursor-pointer flex items-center gap-2 ${
                                      isSelected
                                        ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold'
                                        : 'bg-stone-50/60 border-stone-200 hover:bg-stone-100 text-stone-700'
                                    }`}
                                  >
                                    <span className="w-5 h-5 rounded-full bg-white border border-stone-300 text-[11px] font-bold flex items-center justify-center shrink-0">
                                      {optLetter}
                                    </span>
                                    <span>{opt}</span>
                                  </button>
                                );
                              })}
                            </div>
                          ) : (
                            <input
                              type="text"
                              value={hwAnswers[q.id] || ''}
                              onChange={(e) => setHwAnswers({ ...hwAnswers, [q.id]: e.target.value })}
                              placeholder="መልስዎን ወይም ስሌቱን እዚህ ይጻፉ..."
                              className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl outline-none focus:border-stone-800"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Submit button */}
                <div className="flex justify-end pt-4">
                  <button
                    onClick={handleSubmitHomework}
                    disabled={isSubmittingHw}
                    className="px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    {isSubmittingHw ? 'AI እየገመገመ ነው...' : 'ለ AI ፈታኝ አስረክብ (Submit & Auto-Grade)'}
                  </button>
                </div>

                {/* Grading Result */}
                {hwGradingResult && (
                  <div className="bg-emerald-50/90 border-2 border-emerald-400 rounded-3xl p-6 mt-6">
                    <div className="flex items-center justify-between border-b border-emerald-200 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black text-xl shadow-md">
                          {hwGradingResult.gradeLetter}
                        </div>
                        <div>
                          <span className="text-[10px] font-black uppercase text-emerald-800 tracking-wider">
                            የ AI ፈታኝ ግምገማ ውጤት
                          </span>
                          <h4 className="text-lg font-black text-emerald-950">
                            ውጤት: {hwGradingResult.score}% ({hwGradingResult.correctCount} / {hwGradingResult.totalQuestions} ትክክል)
                          </h4>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-emerald-900 font-medium mt-3">
                      {hwGradingResult.aiExaminerFeedback}
                    </p>

                    <div className="mt-4 space-y-2">
                      {hwGradingResult.evaluationDetails?.map((det: any, dIdx: number) => (
                        <div key={dIdx} className="bg-white/80 border border-emerald-200 rounded-xl p-3 flex items-center justify-between text-xs">
                          <span className="font-semibold text-stone-800">ጥያቄ {dIdx + 1} (የተሰጠ መልስ: {det.studentAnswer || 'የለም'})</span>
                          <span className={`font-bold flex items-center gap-1 ${det.isCorrect ? 'text-emerald-700' : 'text-rose-600'}`}>
                            {det.isCorrect ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                            {det.feedback}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12 border-2 border-dashed border-stone-200 rounded-3xl mt-6">
                <BookOpen className="w-10 h-10 text-stone-400 mx-auto mb-2" />
                <h3 className="text-sm font-bold text-stone-700">ምንም የቤት ስራ አልተመረጠም</h3>
                <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1">
                  የተፈለገውን ርዕስ ጽፈው ወይም ነባሪውን በመጠቀም «የቤት ስራ አመንጭ» የሚለውን ይጫኑ።
                </p>
                <button
                  onClick={handleGenerateHomework}
                  className="mt-4 px-4 py-2 bg-stone-900 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer hover:bg-black"
                >
                  የቤት ስራ ጀምር
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- TAB 2: AI PREMIUM ASSIGNMENT ENGINE (PREMIUM ONLY) --- */}
      {activeTab === 'assignment' && (
        <div className="space-y-6">
          {!isPremiumEntitled && !isOwnerSuperAdmin ? (
            <div className="bg-gradient-to-b from-amber-500/10 to-stone-900 text-white border-2 border-amber-500/40 rounded-3xl p-8 text-center max-w-2xl mx-auto shadow-2xl">
              <div className="w-16 h-16 rounded-3xl bg-amber-500 text-stone-950 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Lock className="w-8 h-8" />
              </div>
              <span className="bg-amber-400/20 text-amber-300 text-xs font-black uppercase px-3 py-1 rounded-full border border-amber-400/30">
                PREMIUM-ONLY FEATURE • 54 ETB/MONTH
              </span>
              <h2 className="text-2xl font-black text-white mt-3 font-serif-ethiopic">
                AI ፕሪሚየም አሳይንመንት ሞተር
              </h2>
              <p className="text-stone-300 text-xs sm:text-sm mt-2 leading-relaxed">
                Normal students have access to Homework. Advanced Assignments require a Premium subscription (54 ETB/month). Includes:
              </p>
              <ul className="text-stone-300 text-xs text-left max-w-md mx-auto mt-4 space-y-2">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-400 shrink-0" />
                  Higher-order problem solving (Analysis, Evaluation, Formulation)
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-400 shrink-0" />
                  Multi-step quantitative calculations and formula derivations
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-400 shrink-0" />
                  Detailed AI 0-100 Rubric evaluation with step-by-step corrections
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-400 shrink-0" />
                  Plagiarism & authenticity verification
                </li>
              </ul>
              <button
                onClick={onNavigateToPayment}
                className="mt-6 px-8 py-3.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-stone-950 font-black text-sm rounded-2xl shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2 mx-auto"
              >
                <Zap className="w-4 h-4 fill-stone-950" />
                በወር 54 ብር ፕሪሚየም ይክፈቱ (Upgrade to Premium)
              </button>
            </div>
          ) : (
            <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-stone-100 pb-4">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded border border-amber-200 flex items-center gap-1 w-fit">
                    <Sparkles className="w-3 h-3 text-amber-600" />
                    Premium Assignment Engine (Server-Verified Active)
                  </span>
                  <h2 className="text-xl font-black text-stone-900 mt-1">
                    Grade {currentGrade} {selectedSubject} Rigorous Assignment
                  </h2>
                  <p className="text-xs text-stone-500">
                    High-order cognitive challenge evaluated against Ethiopian national standards.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={asgnTopic}
                    onChange={(e) => setAsgnTopic(e.target.value)}
                    placeholder="Assignment Topic..."
                    className="px-3 py-2 text-xs border border-stone-300 rounded-xl outline-none focus:border-stone-800 w-64"
                  />
                  <button
                    onClick={handleGenerateAssignment}
                    disabled={isGeneratingAsgn}
                    className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white text-xs font-black rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 disabled:opacity-50"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    {isGeneratingAsgn ? 'በማመንጨት ላይ...' : 'ፕሪሚየም አሳይንመንት አመንጭ'}
                  </button>
                </div>
              </div>

              {currentAssignment ? (
                <div className="mt-6 space-y-6">
                  <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-5">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-black text-stone-900">{currentAssignment.title}</h3>
                      <span className="bg-amber-200/80 text-amber-900 text-xs font-bold px-2 py-0.5 rounded-md">
                        100 Total Points
                      </span>
                    </div>
                    <p className="text-xs text-stone-700 mt-1">{currentAssignment.overview}</p>
                  </div>

                  {/* Tasks */}
                  <div className="space-y-4">
                    {currentAssignment.tasks?.map((task: any, idx: number) => (
                      <div key={idx} className="bg-stone-50 border border-stone-200 rounded-2xl p-5">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-bold text-stone-900">{task.title}</h4>
                          <span className="text-xs font-bold text-stone-500">Weight: {task.weight}%</span>
                        </div>
                        <p className="text-xs text-stone-700 leading-relaxed">{task.instruction}</p>
                      </div>
                    ))}
                  </div>

                  {/* Rubric Preview */}
                  <div className="bg-stone-100 rounded-2xl p-4">
                    <h4 className="text-xs font-bold uppercase text-stone-600 mb-2">የግምገማ ሩብሪክ (Grading Rubric Breakdown)</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {currentAssignment.rubric?.map((rub: any, rIdx: number) => (
                        <div key={rIdx} className="bg-white border border-stone-200 p-3 rounded-xl">
                          <div className="flex justify-between items-center text-xs font-bold text-stone-900 mb-1">
                            <span>{rub.criterion}</span>
                            <span className="text-amber-700">{rub.maxPoints} pts</span>
                          </div>
                          <p className="text-[11px] text-stone-500">{rub.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Submission Box */}
                  <div className="border border-stone-300 rounded-2xl p-4 bg-white">
                    <label className="block text-xs font-bold text-stone-800 mb-2">
                      የእርስዎ ዝርዝር መልስና ስሌት (Student Solution Submission):
                    </label>
                    <textarea
                      rows={6}
                      value={asgnSubmissionText}
                      onChange={(e) => setAsgnSubmissionText(e.target.value)}
                      placeholder="እዚህ ጋር የደረጃ በደረጃ ስሌትዎን፣ ቀመሮችንና ጽንሰ-ሀሳባዊ ማብራሪያዎን ያስገቡ..."
                      className="w-full text-xs p-3 border border-stone-200 rounded-xl outline-none focus:border-stone-800 resize-y"
                    />
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-[11px] text-stone-500">
                        AI Rubric evaluates conceptual rigor, numerical precision, and Ethiopian context.
                      </span>
                      <button
                        onClick={handleSubmitAssignment}
                        disabled={isSubmittingAsgn || !asgnSubmissionText.trim()}
                        className="px-6 py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white text-xs font-black rounded-xl shadow-md cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                      >
                        <Send className="w-3.5 h-3.5" />
                        {isSubmittingAsgn ? 'AI እያረመ ነው...' : 'ለ AI ፈታኝ አስረክብ (Evaluate with Rubric)'}
                      </button>
                    </div>
                  </div>

                  {/* Evaluation Output */}
                  {asgnEvalResult && (
                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-400 rounded-3xl p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-200 pb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-14 h-14 rounded-2xl bg-amber-600 text-white font-black text-2xl flex items-center justify-center shadow-md">
                            {asgnEvalResult.gradeLetter}
                          </div>
                          <div>
                            <span className="text-[10px] font-black uppercase text-amber-800 tracking-wider">
                              ኦፊሴላዊ የ AI ፈታኝ የምዘና ውጤት
                            </span>
                            <h3 className="text-xl font-black text-stone-950">
                              ጠቅላላ ውጤት: {asgnEvalResult.totalScore} / 100
                            </h3>
                          </div>
                        </div>
                        <div className="bg-white/80 border border-amber-200 px-3 py-1.5 rounded-xl text-right">
                          <span className="text-[10px] text-stone-500 block">የእውነተኛነት ማረጋገጫ (Authenticity)</span>
                          <span className="text-xs font-black text-emerald-700">
                            {asgnEvalResult.authenticityScore}% Verified Original
                          </span>
                        </div>
                      </div>

                      {/* Criteria scores */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
                        {asgnEvalResult.criteriaScores?.map((crit: any, cIdx: number) => (
                          <div key={cIdx} className="bg-white/90 border border-amber-200 p-3 rounded-xl">
                            <div className="flex justify-between items-center text-xs font-bold text-stone-900 mb-1">
                              <span>{crit.criterion}</span>
                              <span className="text-amber-800 font-black">{crit.score} / {crit.max}</span>
                            </div>
                            <p className="text-[11px] text-stone-600">{crit.note}</p>
                          </div>
                        ))}
                      </div>

                      {/* Strengths & Weaknesses */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs mt-4">
                        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5">
                          <h4 className="font-bold text-emerald-900 mb-1 flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            ቁልፍ ጥንካሬዎች (Key Strengths)
                          </h4>
                          <ul className="list-disc list-inside text-emerald-800 space-y-1 text-[11px]">
                            {asgnEvalResult.strengths?.map((s: string, idx: number) => (
                              <li key={idx}>{s}</li>
                            ))}
                          </ul>
                        </div>

                        <div className="bg-rose-50 border border-rose-200 rounded-xl p-3.5">
                          <h4 className="font-bold text-rose-900 mb-1 flex items-center gap-1.5">
                            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                            ሊሻሻሉ የሚገባቸው ነጥቦች (Areas for Improvement)
                          </h4>
                          <ul className="list-disc list-inside text-rose-800 space-y-1 text-[11px]">
                            {asgnEvalResult.weaknesses?.map((w: string, idx: number) => (
                              <li key={idx}>{w}</li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Corrections & References */}
                      <div className="bg-white border border-amber-200 rounded-xl p-4 mt-4 text-xs space-y-2">
                        <div>
                          <strong className="text-stone-900">የደረጃ በደረጃ እርማት (Step-by-Step Correction): </strong>
                          <span className="text-stone-700">{asgnEvalResult.stepByStepCorrections}</span>
                        </div>
                        <div>
                          <strong className="text-stone-900">የስርዓተ-ትምህርት ማጣቀሻ (Curriculum Reference): </strong>
                          <span className="text-amber-800 font-semibold">{asgnEvalResult.chapterReferences}</span>
                        </div>
                        <div>
                          <strong className="text-stone-900">የቀጣይ ልምምድ ፍኖተ-ካርታ (Roadmap): </strong>
                          <span className="text-stone-700">{asgnEvalResult.improvementRoadmap}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12 border-2 border-dashed border-stone-200 rounded-3xl mt-6">
                  <Award className="w-10 h-10 text-amber-500 mx-auto mb-2" />
                  <h3 className="text-sm font-bold text-stone-700">ምንም ፕሪሚየም አሳይንመንት አልተመረጠም</h3>
                  <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1">
                    ርዕስዎን ያስገቡና «ፕሪሚየም አሳይንመንት አመንጭ» የሚለውን ይጫኑ።
                  </p>
                  <button
                    onClick={handleGenerateAssignment}
                    className="mt-4 px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer hover:from-amber-700 hover:to-amber-800"
                  >
                    አሳይንመንት ጀምር
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* --- TAB 3: AI PREMIUM PROJECT ENGINE (PREMIUM ONLY) --- */}
      {activeTab === 'project' && (
        <div className="space-y-6">
          {!isPremiumEntitled && !isOwnerSuperAdmin ? (
            <div className="bg-gradient-to-b from-cyan-950 to-stone-950 text-white border-2 border-cyan-500/40 rounded-3xl p-8 text-center max-w-2xl mx-auto shadow-2xl">
              <div className="w-16 h-16 rounded-3xl bg-cyan-500 text-stone-950 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <FlaskConical className="w-8 h-8" />
              </div>
              <span className="bg-cyan-400/20 text-cyan-300 text-xs font-black uppercase px-3 py-1 rounded-full border border-cyan-400/30">
                PREMIUM STEM PROJECTS • 54 ETB/MONTH
              </span>
              <h2 className="text-2xl font-black text-white mt-3 font-serif-ethiopic">
                AI ፕሪሚየም ፕሮጀክት ሞተር (Hands-on STEM)
              </h2>
              <p className="text-stone-300 text-xs sm:text-sm mt-2 leading-relaxed">
                Work on real-world scientific investigations, engineering prototypes, and community challenges with 3-phase milestone evaluation.
              </p>
              <button
                onClick={onNavigateToPayment}
                className="mt-6 px-8 py-3.5 bg-gradient-to-r from-cyan-400 to-cyan-500 hover:from-cyan-500 hover:to-cyan-600 text-stone-950 font-black text-sm rounded-2xl shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2 mx-auto"
              >
                <Zap className="w-4 h-4 fill-stone-950" />
                በወር 54 ብር ፕሪሚየም ይክፈቱ (Unlock Project Engine)
              </button>
            </div>
          ) : (
            <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-stone-100 pb-4">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-cyan-800 bg-cyan-50 px-2.5 py-0.5 rounded border border-cyan-200 flex items-center gap-1 w-fit">
                    <FlaskConical className="w-3 h-3 text-cyan-600" />
                    Multi-Phase Practical STEM Project Engine
                  </span>
                  <h2 className="text-xl font-black text-stone-900 mt-1">
                    Grade {currentGrade} {selectedSubject} Hands-On Project
                  </h2>
                  <p className="text-xs text-stone-500">
                    Phase 1 (Proposal) → Phase 2 (Data Collection) → Phase 3 (Final Report & Certificate).
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={projectType}
                    onChange={(e: any) => setProjectType(e.target.value)}
                    className="px-3 py-2 text-xs border border-stone-300 rounded-xl outline-none"
                  >
                    <option value="experiment">ሳይንሳዊ ሙከራ (Science Experiment)</option>
                    <option value="investigation">ምርምርና ዳሰሳ (Research Investigation)</option>
                    <option value="prototype">የማህበረሰብ መፍትሔ (Community STEM Solution)</option>
                  </select>
                  <button
                    onClick={handleGenerateProject}
                    disabled={isGeneratingProj}
                    className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 text-white text-xs font-black rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 disabled:opacity-50"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    {isGeneratingProj ? 'በማመንጨት ላይ...' : 'ፕሮጀክት አመንጭ'}
                  </button>
                </div>
              </div>

              {currentProject ? (
                <div className="mt-6 space-y-6">
                  {/* Project Overview */}
                  <div className="bg-cyan-50/60 border border-cyan-200/80 rounded-2xl p-5">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-black text-stone-900">{currentProject.title}</h3>
                      <span className="bg-cyan-200/80 text-cyan-900 text-xs font-bold px-2.5 py-0.5 rounded-full">
                        Phase {currentPhase} of 3
                      </span>
                    </div>
                    <p className="text-xs text-stone-700 mt-1">{currentProject.objective}</p>

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-bold text-stone-600">አስፈላጊ ቁሳቁሶች (Materials):</span>
                      {currentProject.materialsNeeded?.map((mat: string, mIdx: number) => (
                        <span key={mIdx} className="bg-white border border-cyan-200 text-[11px] px-2 py-0.5 rounded-md text-stone-700">
                          {mat}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* 3-Phase Stepper */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {currentProject.phases?.map((p: any) => {
                      const isDone = currentPhase > p.phase;
                      const isCurrent = currentPhase === p.phase;
                      return (
                        <div
                          key={p.phase}
                          className={`p-4 rounded-2xl border transition-all ${
                            isCurrent
                              ? 'bg-cyan-500 text-white border-cyan-600 shadow-md'
                              : isDone
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                              : 'bg-stone-50 border-stone-200 text-stone-600 opacity-60'
                          }`}
                        >
                          <div className="flex items-center justify-between text-xs font-bold mb-1">
                            <span>Phase {p.phase}</span>
                            {isDone ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            ) : isCurrent ? (
                              <span className="bg-white/20 px-2 py-0.5 rounded text-[10px]">Active</span>
                            ) : (
                              <Clock className="w-3.5 h-3.5" />
                            )}
                          </div>
                          <h4 className="text-xs font-black">{p.title}</h4>
                          <p className={`text-[11px] mt-1 line-clamp-2 ${isCurrent ? 'text-white/90' : 'text-stone-500'}`}>
                            {p.description}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  {/* Active Phase Submission */}
                  <div className="bg-white border border-stone-300 rounded-2xl p-5">
                    <h4 className="text-sm font-black text-stone-900 mb-1">
                      Phase {currentPhase} ማስረከቢያ (Milestone Submission)
                    </h4>
                    <p className="text-xs text-stone-500 mb-3">
                      {currentProject.phases?.find((p: any) => p.phase === currentPhase)?.deliverables}
                    </p>

                    <textarea
                      rows={5}
                      value={phaseSubmissionText}
                      onChange={(e) => setPhaseSubmissionText(e.target.value)}
                      placeholder={`የ Phase ${currentPhase} ዝርዝር ሪፖርትዎን፣ የሰበሰቧቸውን መረጃዎች እና ምልከታዎች እዚህ ያስገቡ...`}
                      className="w-full text-xs p-3 border border-stone-200 rounded-xl outline-none focus:border-stone-800"
                    />

                    <div className="flex justify-end mt-3">
                      <button
                        onClick={handleSubmitProjectPhase}
                        disabled={isSubmittingPhase || !phaseSubmissionText.trim()}
                        className="px-6 py-2.5 bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 text-white text-xs font-black rounded-xl shadow-md cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                      >
                        <Send className="w-3.5 h-3.5" />
                        {isSubmittingPhase ? 'AI ምዕራፉን እየገመገመ ነው...' : `Phase ${currentPhase} አስረክብ (Evaluate Phase)`}
                      </button>
                    </div>
                  </div>

                  {/* Milestone Eval Result */}
                  {phaseEvalResult && (
                    <div className="bg-gradient-to-br from-cyan-50 to-teal-50 border-2 border-cyan-400 rounded-3xl p-6">
                      <div className="flex items-center justify-between border-b border-cyan-200 pb-3">
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-cyan-800">
                            የምዕራፍ {phaseEvalResult.phase} ምዘና
                          </span>
                          <h4 className="text-lg font-black text-stone-950">
                            ውጤት: {phaseEvalResult.score} / 100
                          </h4>
                        </div>
                        {phaseEvalResult.approvedForNextPhase && (
                          <span className="bg-emerald-100 text-emerald-800 text-xs font-black px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            ወደ ቀጣዩ ምዕራፍ ተፈቅዷል
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-stone-800 font-medium mt-3 leading-relaxed">
                        {phaseEvalResult.milestoneFeedback}
                      </p>

                      {phaseEvalResult.certificateEligible && (
                        <div className="bg-amber-100 border-2 border-amber-400 rounded-2xl p-4 mt-4 text-center">
                          <Award className="w-10 h-10 text-amber-600 mx-auto mb-2" />
                          <h4 className="text-sm font-black text-amber-950 font-serif-ethiopic">
                            እንኳን ደስ አለዎት! ሙሉውን STEM ፕሮጀክት አጠናቀዋል።
                          </h4>
                          <p className="text-xs text-amber-900 mt-1">
                            የምስክር ወረቀትዎ በተማሪ ፖርትፎሊዮ ውስጥ ዝግጁ ሆኗል።
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12 border-2 border-dashed border-stone-200 rounded-3xl mt-6">
                  <FlaskConical className="w-10 h-10 text-cyan-500 mx-auto mb-2" />
                  <h3 className="text-sm font-bold text-stone-700">ምንም ፕሮጀክት አልተጀመረም</h3>
                  <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1">
                    የፕሮጀክት አይነት ይምረጡና «ፕሮጀክት አመንጭ» የሚለውን ይጫኑ።
                  </p>
                  <button
                    onClick={handleGenerateProject}
                    className="mt-4 px-4 py-2 bg-gradient-to-r from-cyan-600 to-cyan-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer hover:from-cyan-700 hover:to-cyan-800"
                  >
                    STEM ፕሮጀክት ጀምር
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* --- TAB 4: STUDENT PORTFOLIO --- */}
      {activeTab === 'portfolio' && (
        <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-stone-100 pb-4">
            <div>
              <h2 className="text-xl font-black text-stone-900">የተማሪ አካዳሚክ ፖርትፎሊዮ (Academic Portfolio)</h2>
              <p className="text-xs text-stone-500">
                All AI-examined homework, premium assignments, and practical STEM projects.
              </p>
            </div>
            <button
              onClick={loadRecords}
              className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold rounded-xl cursor-pointer"
            >
              አድስ (Refresh)
            </button>
          </div>

          <div className="divide-y divide-stone-100">
            {portfolioRecords.map((rec) => (
              <div key={rec.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 text-white font-black text-sm ${
                      rec.type === 'homework'
                        ? 'bg-emerald-600'
                        : rec.type === 'assignment'
                        ? 'bg-amber-600'
                        : 'bg-cyan-600'
                    }`}
                  >
                    {rec.gradeLetter || rec.score || 'AI'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`text-[10px] font-black uppercase px-2 py-0.2 rounded ${
                          rec.type === 'homework'
                            ? 'bg-emerald-100 text-emerald-800'
                            : rec.type === 'assignment'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-cyan-100 text-cyan-800'
                        }`}
                      >
                        {rec.type.toUpperCase()}
                      </span>
                      {rec.isPremium && (
                        <span className="bg-amber-200 text-amber-950 text-[10px] font-extrabold px-1.5 py-0.2 rounded">
                          PREMIUM
                        </span>
                      )}
                      <span className="text-[11px] text-stone-400">
                        {new Date(rec.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-stone-900 mt-0.5">{rec.title}</h4>
                    <p className="text-xs text-stone-500">{rec.feedback || 'Completed by Student'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto">
                  <div className="text-right">
                    <span className="text-sm font-black text-stone-900 block">{rec.score}%</span>
                    <span className="text-[10px] text-stone-400 uppercase font-bold">{rec.status}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- TAB 5: SUPER ADMIN ACADEMIC CONTROLS --- */}
      {activeTab === 'admin_controls' && isOwnerSuperAdmin && (
        <div className="bg-white border border-rose-200 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="border-b border-rose-100 pb-4">
            <span className="text-[10px] font-black uppercase tracking-wider text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
              Root Super Admin Authority (mejennur669@gmail.com)
            </span>
            <h2 className="text-xl font-black text-stone-900 mt-1">
              Super Admin Academic Control & Grade Overrides
            </h2>
            <p className="text-xs text-stone-500">
              Oversee all AI-generated worksheets, student submissions, and override AI evaluations if necessary.
            </p>
          </div>

          {/* Stats */}
          {adminStats && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200">
                <span className="text-xs text-stone-500 block">የቤት ስራዎች (Homework)</span>
                <span className="text-2xl font-black text-stone-900">{adminStats.totalHomework}</span>
              </div>
              <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200">
                <span className="text-xs text-amber-800 block">ፕሪሚየም አሳይንመንቶች</span>
                <span className="text-2xl font-black text-amber-900">{adminStats.totalAssignments}</span>
              </div>
              <div className="bg-cyan-50 p-4 rounded-2xl border border-cyan-200">
                <span className="text-xs text-cyan-800 block">ፕሪሚየም ፕሮጀክቶች</span>
                <span className="text-2xl font-black text-cyan-900">{adminStats.totalProjects}</span>
              </div>
              <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200">
                <span className="text-xs text-emerald-800 block">በ AI የታረሙ (Auto-Graded)</span>
                <span className="text-2xl font-black text-emerald-900">{adminStats.autoGradedCount}</span>
              </div>
            </div>
          )}

          {/* Grade Override Panel */}
          <div className="bg-rose-50/50 border border-rose-200 rounded-2xl p-5">
            <h3 className="text-sm font-bold text-rose-950 mb-3">ውጤት ማሻሻያ (Super Admin Grade Override)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-stone-600 block mb-1">ሪከርድ ይምረጡ (Record ID):</label>
                <select
                  value={overrideRecordId}
                  onChange={(e) => setOverrideRecordId(e.target.value)}
                  className="w-full text-xs p-2 border border-stone-300 rounded-xl bg-white"
                >
                  <option value="">-- ይምረጡ --</option>
                  {portfolioRecords.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.title} ({r.score}%)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-stone-600 block mb-1">አዲስ ውጤት (Score %):</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={overrideScore}
                  onChange={(e) => setOverrideScore(Number(e.target.value))}
                  className="w-full text-xs p-2 border border-stone-300 rounded-xl bg-white"
                />
              </div>

              <div>
                <label className="text-xs text-stone-600 block mb-1">የማሻሻያ ማስታወሻ (Note):</label>
                <input
                  type="text"
                  value={overrideFeedback}
                  onChange={(e) => setOverrideFeedback(e.target.value)}
                  placeholder="Super Admin review adjustment..."
                  className="w-full text-xs p-2 border border-stone-300 rounded-xl bg-white"
                />
              </div>
            </div>

            <button
              onClick={() => overrideRecordId && handleAdminOverride(overrideRecordId)}
              disabled={!overrideRecordId}
              className="mt-4 px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white text-xs font-black rounded-xl shadow-xs cursor-pointer disabled:opacity-50"
            >
              ውጤት አጽድቅና ቀይር (Apply Override)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
