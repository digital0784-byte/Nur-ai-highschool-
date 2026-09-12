import React, { useState, useEffect } from 'react';
import {
  EntranceProgress,
  StudyPlan,
  EntranceQuestion,
  EntranceMockExam,
  EntranceExamConfig,
  EntrancePastPaper,
  MistakeRecord,
  EntranceStream,
  DiagnosticAttempt,
  EntranceMockAttempt,
} from '../../types/entranceExam';
import { Grade } from '../../types';
import { entranceExamService } from '../../services/entranceExamFirestore';
import { EntranceDashboard } from './EntranceDashboard';
import { DiagnosticTestView } from './DiagnosticTestView';
import { StudyPlanView } from './StudyPlanView';
import { AdaptivePracticeView } from './AdaptivePracticeView';
import { MockExamView } from './MockExamView';
import { MistakeBookView } from './MistakeBookView';
import { AIEntranceCoachView } from './AIEntranceCoachView';
import { DailyChallengeView } from './DailyChallengeView';
import { PastPapersView } from './PastPapersView';
import { EntranceAdminManager } from './EntranceAdminManager';
import {
  BrainCircuit,
  GraduationCap,
  Calendar,
  Zap,
  Award,
  BookOpen,
  Sparkles,
  Flame,
  FileText,
  ShieldAlert,
  WifiOff,
  Wifi,
} from 'lucide-react';

interface EntranceExamPrepViewProps {
  userId?: string;
  userRole?: string;
  onAwardXP?: (amount: number, reason: string) => void;
  onIncrementStreak?: () => void;
}

export const EntranceExamPrepView: React.FC<EntranceExamPrepViewProps> = ({
  userId = 'guest-student',
  userRole = 'STUDENT',
  onAwardXP,
  onIncrementStreak,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<string>('dashboard');
  const [selectedGrade, setSelectedGrade] = useState<Grade>(12);
  const [selectedStream, setSelectedStream] = useState<EntranceStream>('natural');

  // Core state
  const [config, setConfig] = useState<EntranceExamConfig | null>(null);
  const [progress, setProgress] = useState<EntranceProgress | null>(null);
  const [studyPlan, setStudyPlan] = useState<StudyPlan | null>(null);
  const [questions, setQuestions] = useState<EntranceQuestion[]>([]);
  const [mockExams, setMockExams] = useState<EntranceMockExam[]>([]);
  const [mistakes, setMistakes] = useState<MistakeRecord[]>([]);
  const [pastPapers, setPastPapers] = useState<EntrancePastPaper[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  // Context passing for AI coach
  const [coachQuestionContext, setCoachQuestionContext] = useState<EntranceQuestion | null>(null);
  const [coachAnswerContext, setCoachAnswerContext] = useState<any>(null);

  // Load initial data
  const loadEngineData = async () => {
    setIsLoading(true);
    try {
      const [cfg, prog, plan, qList, mList, mistList, pList] = await Promise.all([
        entranceExamService.getExamConfig(),
        entranceExamService.getProgress(userId, selectedGrade, selectedStream),
        entranceExamService.getStudyPlan(userId),
        entranceExamService.getQuestions({ grade: selectedGrade, stream: selectedStream }),
        entranceExamService.getMockExams(selectedGrade, selectedStream),
        entranceExamService.getMistakes(userId),
        entranceExamService.getPastPapers(),
      ]);

      setConfig(cfg);
      setProgress(prog);
      setStudyPlan(plan);
      setQuestions(qList);
      setMockExams(mList);
      setMistakes(mistList);
      setPastPapers(pList);
    } catch (err) {
      console.warn('[Entrance View] Error loading engine data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadEngineData();

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [userId, selectedGrade, selectedStream]);

  // Handlers
  const handleDiagnosticComplete = async (attempt: DiagnosticAttempt) => {
    await entranceExamService.saveDiagnosticAttempt(attempt);
    if (onAwardXP) onAwardXP(150, 'Completed Entrance Diagnostic Assessment');
    await loadEngineData();
    setActiveSubTab('study_plan');
  };

  const handleUpdateStudyPlan = async (updated: StudyPlan) => {
    await entranceExamService.saveStudyPlan(updated);
    setStudyPlan(updated);
  };

  const handleRecordMistake = async (mistake: MistakeRecord) => {
    await entranceExamService.recordMistake(mistake);
    setMistakes((prev) => [mistake, ...prev.filter((m) => m.questionId !== mistake.questionId)]);
  };

  const handleMarkMistakeUnderstood = async (questionId: string) => {
    await entranceExamService.markMistakeUnderstood(userId, questionId);
    setMistakes((prev) =>
      prev.map((m) => (m.questionId === questionId ? { ...m, understood: true } : m))
    );
    if (onAwardXP) onAwardXP(30, 'Remediated Weak Entrance Topic in Mistake Book');
  };

  const handleMockAttempt = async (attempt: EntranceMockAttempt) => {
    await entranceExamService.saveMockAttempt(attempt);
    if (onAwardXP) onAwardXP(200, 'Completed Timed Entrance Mock Exam');
    if (onIncrementStreak) onIncrementStreak();
    await loadEngineData();
  };

  const handleAskAICoach = (q: EntranceQuestion, userAns: any) => {
    setCoachQuestionContext(q);
    setCoachAnswerContext(userAns);
    setActiveSubTab('ai_coach');
  };

  const isSuperAdmin = userRole === 'SUPER_ADMIN' || userRole === 'ADMIN';

  // Navigation Items
  const navTabs = [
    { id: 'dashboard', label: 'ዳሽቦርድ (Dashboard)', icon: GraduationCap },
    { id: 'diagnostic', label: 'ዳያግኖስቲክ (Diagnostic)', icon: BrainCircuit },
    { id: 'study_plan', label: 'የጥናት እቅድ (Study Plan)', icon: Calendar },
    { id: 'practice', label: 'ልምምድ (Practice)', icon: Zap },
    { id: 'mock_exams', label: 'ሞዴል ፈተናዎች (Mock Exams)', icon: Award },
    { id: 'mistake_book', label: `ስህተቶች (${mistakes.filter((m) => !m.understood).length})`, icon: BookOpen },
    { id: 'ai_coach', label: 'AI አስጠኚ (Coach)', icon: Sparkles },
    { id: 'daily_challenge', label: 'ዕለታዊ ፈተና (Sprint)', icon: Flame },
    { id: 'past_papers', label: 'ያለፉ ፈተናዎች (Past Papers)', icon: FileText },
  ];

  if (isSuperAdmin) {
    navTabs.push({ id: 'admin', label: 'አስተዳደር (Admin)', icon: ShieldAlert });
  }

  if (isLoading || !progress) {
    return (
      <div className="min-h-[400px] flex items-center justify-center p-8">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-semibold text-stone-600 font-serif-ethiopic">
            የዩኒቨርሲቲ መግቢያ ፈተና ሞተር እየተነሳ ነው (Loading Entrance Engine)...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-2 sm:px-4">
      {/* Offline Status & Grade/Stream Selection Bar */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        {/* Grade & Stream Selectors */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => setSelectedGrade(11)}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                selectedGrade === 11
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              11ኛ ክፍል (Grade 11)
            </button>
            <button
              onClick={() => setSelectedGrade(12)}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                selectedGrade === 12
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              12ኛ ክፍል (Grade 12)
            </button>
          </div>

          <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => setSelectedStream('natural')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                selectedStream === 'natural'
                  ? 'bg-white text-indigo-900 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              ተፈጥሮ ሳይንስ (Natural Science)
            </button>
            <button
              onClick={() => setSelectedStream('social')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                selectedStream === 'social'
                  ? 'bg-white text-indigo-900 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              ማህበራዊ ሳይንስ (Social Science)
            </button>
          </div>
        </div>

        {/* Offline Cache Indicator */}
        <div className="flex items-center gap-2 text-xs">
          {isOnline ? (
            <span className="inline-flex items-center gap-1.5 text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              <Wifi className="w-3.5 h-3.5" />
              <span>ደመና የተገናኘ (Cloud Sync Active)</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-amber-700 font-semibold bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
              <WifiOff className="w-3.5 h-3.5" />
              <span>ከመስመር ውጭ ሞድ (Offline Ready)</span>
            </span>
          )}
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {navTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 shrink-0 transition-all border cursor-pointer ${
                isActive
                  ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                  : 'bg-white hover:bg-stone-50 text-stone-600 border-stone-200'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-stone-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active Sub-Tab View Content */}
      <div className="animate-in fade-in duration-200">
        {activeSubTab === 'dashboard' && (
          <EntranceDashboard
            progress={progress}
            studyPlan={studyPlan}
            selectedGrade={selectedGrade}
            selectedStream={selectedStream}
            onSelectSubTab={setActiveSubTab}
            onRefresh={loadEngineData}
            onUpdateStudyMinutes={async (mins) => {
              if (studyPlan) {
                const updated = { ...studyPlan, availableStudyTimeMinutes: mins };
                await handleUpdateStudyPlan(updated);
              }
            }}
          />
        )}

        {activeSubTab === 'diagnostic' && (
          <DiagnosticTestView
            questions={questions}
            userId={userId}
            grade={selectedGrade}
            stream={selectedStream}
            onComplete={handleDiagnosticComplete}
            onCancel={() => setActiveSubTab('dashboard')}
          />
        )}

        {activeSubTab === 'study_plan' && (
          <StudyPlanView
            studyPlan={studyPlan}
            onUpdatePlan={handleUpdateStudyPlan}
            onStartDiagnostic={() => setActiveSubTab('diagnostic')}
            onSelectSubTab={setActiveSubTab}
          />
        )}

        {activeSubTab === 'practice' && (
          <AdaptivePracticeView
            questions={questions}
            userId={userId}
            grade={selectedGrade}
            onRecordMistake={handleRecordMistake}
            onAskAICoach={handleAskAICoach}
            onPracticeFinished={() => {
              if (onAwardXP) onAwardXP(80, 'Completed Adaptive Practice Session');
              loadEngineData();
            }}
          />
        )}

        {activeSubTab === 'mock_exams' && (
          <MockExamView
            mockExams={mockExams}
            questions={questions}
            userId={userId}
            grade={selectedGrade}
            stream={selectedStream}
            onSaveAttempt={handleMockAttempt}
            onAskAICoach={handleAskAICoach}
          />
        )}

        {activeSubTab === 'mistake_book' && (
          <MistakeBookView
            mistakes={mistakes}
            onMarkUnderstood={handleMarkMistakeUnderstood}
            onAskAICoach={handleAskAICoach}
            onRetryQuestion={(q) => {
              setActiveSubTab('practice');
            }}
          />
        )}

        {activeSubTab === 'ai_coach' && (
          <AIEntranceCoachView
            initialQuestion={coachQuestionContext}
            initialUserAnswer={coachAnswerContext}
            grade={selectedGrade}
            onClearContext={() => {
              setCoachQuestionContext(null);
              setCoachAnswerContext(null);
            }}
          />
        )}

        {activeSubTab === 'daily_challenge' && (
          <DailyChallengeView
            questions={questions}
            userId={userId}
            grade={selectedGrade}
            onAwardXP={onAwardXP}
            onIncrementStreak={onIncrementStreak}
          />
        )}

        {activeSubTab === 'past_papers' && (
          <PastPapersView
            pastPapers={pastPapers}
            grade={selectedGrade}
            onStartPaperExam={(paper) => {
              setActiveSubTab('mock_exams');
            }}
          />
        )}

        {activeSubTab === 'admin' && isSuperAdmin && config && (
          <EntranceAdminManager
            config={config}
            questions={questions}
            mockExams={mockExams}
            onSaveConfig={async (cfg) => {
              await entranceExamService.saveExamConfig(cfg);
              setConfig(cfg);
            }}
            onSaveQuestion={async (q) => {
              await entranceExamService.saveQuestion(q);
              await loadEngineData();
            }}
            onSaveMockExam={async (m) => {
              await entranceExamService.saveMockExam(m);
              await loadEngineData();
            }}
          />
        )}
      </div>
    </div>
  );
};
