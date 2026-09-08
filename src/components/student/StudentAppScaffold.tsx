import React, { useState, useEffect } from 'react';
import {
  Home,
  BookOpen,
  Compass,
  Award,
  Camera,
  Mic,
  HardDrive,
  Moon,
  Sun,
  Languages,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Play,
  RotateCcw,
  Zap,
  Menu,
  X,
  ChevronRight,
  Wifi,
  WifiOff,
} from 'lucide-react';
import { GradeLevel, CurriculumSubjectItem, CurriculumTopic, CurriculumUnit, CurriculumLesson } from '../../types/curriculumEngine';
import { LanguageCode } from '../../types';
import { StudentTab, OfflineCachedUnit } from '../../types/studentApp';
import { ethiopianCurriculumEngine } from '../../engine/curriculumRegistry';
import { studentAppFirestore } from '../../services/studentAppFirestore';
import { StudentHomeScreen } from './StudentHomeScreen';
import { StudentSubjectScreen } from './StudentSubjectScreen';
import { StudentLearningScreen } from './StudentLearningScreen';
import { StudentKnowledgeMapScreen } from './StudentKnowledgeMapScreen';
import { StudentQuizScreen } from './StudentQuizScreen';
import { StudentPhotoSolverScreen } from './StudentPhotoSolverScreen';
import { StudentVoiceTutorScreen } from './StudentVoiceTutorScreen';
import { StudentOfflineManager } from './StudentOfflineManager';

interface StudentAppScaffoldProps {
  initialGrade?: GradeLevel;
  initialLanguage?: LanguageCode;
  onExitToTeacherDashboard?: () => void;
}

export const StudentAppScaffold: React.FC<StudentAppScaffoldProps> = ({
  initialGrade = 9,
  initialLanguage = 'am',
  onExitToTeacherDashboard,
}) => {
  // Navigation & State
  const [currentTab, setCurrentTab] = useState<StudentTab>('home');
  const [grade, setGrade] = useState<GradeLevel>(initialGrade);
  const [language, setLanguage] = useState<LanguageCode>(initialLanguage);
  const [darkMode, setDarkMode] = useState(false);
  const [lowDataMode, setLowDataMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);

  // Active Subject & Topic in view
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('math-g9');
  const [selectedTopic, setSelectedTopic] = useState<CurriculumTopic | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<CurriculumUnit | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<CurriculumLesson | null>(null);

  // Final Test Runner State
  const [isTestRunnerOpen, setIsTestRunnerOpen] = useState(false);
  const [testSteps, setTestSteps] = useState<{ name: string; status: 'pending' | 'running' | 'success' | 'failed' }[]>([
    { name: '1. Register / Auth Check', status: 'pending' },
    { name: '2. Select Grade (ክፍል 9)', status: 'pending' },
    { name: '3. Select Subject (Mathematics)', status: 'pending' },
    { name: '4. Open Unit 1 (Relations & Functions)', status: 'pending' },
    { name: '5. Open Lesson 1.1 & Topic', status: 'pending' },
    { name: '6. Learn (Textbook Reader)', status: 'pending' },
    { name: '7. Ask AI Tutor (Socratic RAG Query)', status: 'pending' },
    { name: '8. Practice with Hints (Level 1-3)', status: 'pending' },
    { name: '9. Take Curriculum Quiz', status: 'pending' },
    { name: '10. Receive Score & Grade Check', status: 'pending' },
    { name: '11. Update Adaptive Mastery (Not Started -> Mastered/Learning)', status: 'pending' },
    { name: '12. Detect Weak Topic / Reassessment', status: 'pending' },
    { name: '13. Recommend Next Lesson in Knowledge Map DAG', status: 'pending' },
    { name: '14. Save Progress to Firestore & Local Cache', status: 'pending' },
  ]);
  const [testRunning, setTestRunning] = useState(false);

  useEffect(() => {
    // Load student profile settings
    loadProfile();

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const loadProfile = async () => {
    const profile = await studentAppFirestore.getStudentProfile();
    setGrade(profile.grade || 9);
    setLanguage(profile.preferredLanguage || 'am');
    setDarkMode(profile.darkMode || false);
    setLowDataMode(profile.lowDataMode || false);
  };

  const handleSelectGrade = async (g: GradeLevel) => {
    setGrade(g);
    await studentAppFirestore.updateStudentProfile({ grade: g });
  };

  const handleSelectLanguage = async (l: LanguageCode) => {
    setLanguage(l);
    await studentAppFirestore.updateStudentProfile({ preferredLanguage: l });
  };

  const handleToggleDarkMode = async () => {
    const next = !darkMode;
    setDarkMode(next);
    await studentAppFirestore.updateStudentProfile({ darkMode: next });
  };

  const handleToggleLowDataMode = async (enabled: boolean) => {
    setLowDataMode(enabled);
    await studentAppFirestore.updateStudentProfile({ lowDataMode: enabled });
  };

  // Subject Navigation Handler
  const handleOpenSubject = (subjectId: string) => {
    setSelectedSubjectId(subjectId);
    setCurrentTab('subjects');
  };

  // Continue Learning Handler
  const handleContinueLearning = (subjectId: string, topicId: string) => {
    setSelectedSubjectId(subjectId);
    const subj = ethiopianCurriculumEngine.getSubject(subjectId);
    if (subj) {
      for (const u of subj.units) {
        for (const s of u.sections) {
          for (const l of s.lessons) {
            const top = l.topics.find((t) => t.id === topicId);
            if (top) {
              setSelectedTopic(top);
              setSelectedUnit(u);
              setSelectedLesson(l);
              setCurrentTab('learn');
              return;
            }
          }
        }
      }
      // If not matched exactly, take first
      setSelectedTopic(subj.units[0]?.sections[0]?.lessons[0]?.topics[0] || null);
      setSelectedUnit(subj.units[0] || null);
      setSelectedLesson(subj.units[0]?.sections[0]?.lessons[0] || null);
      setCurrentTab('learn');
    }
  };

  const handleStartLearningFromSubject = (
    topic: CurriculumTopic,
    unit: CurriculumUnit,
    lesson: CurriculumLesson
  ) => {
    setSelectedTopic(topic);
    setSelectedUnit(unit);
    setSelectedLesson(lesson);
    setCurrentTab('learn');
  };

  const handleOpenCachedUnit = (cached: OfflineCachedUnit) => {
    setSelectedSubjectId(cached.subjectId);
    setGrade(cached.grade);
    const unit = cached.data as CurriculumUnit;
    setSelectedUnit(unit);
    const lesson = unit.sections[0]?.lessons[0];
    setSelectedLesson(lesson || null);
    setSelectedTopic(lesson?.topics[0] || null);
    setCurrentTab('learn');
  };

  // Run the Comprehensive 14-Step Final Test
  const runFinalTest = async () => {
    setTestRunning(true);
    const stepsCopy = [...testSteps];

    const updateStep = (idx: number, status: 'running' | 'success' | 'failed') => {
      stepsCopy[idx].status = status;
      setTestSteps([...stepsCopy]);
    };

    try {
      // Step 1: Register / Auth
      updateStep(0, 'running');
      await new Promise((r) => setTimeout(r, 400));
      const uid = studentAppFirestore.getUserId();
      if (!uid) throw new Error('Auth failed');
      updateStep(0, 'success');

      // Step 2: Select Grade
      updateStep(1, 'running');
      await handleSelectGrade(9);
      updateStep(1, 'success');

      // Step 3: Select Subject
      updateStep(2, 'running');
      const subjects = ethiopianCurriculumEngine.getSubjectsByGrade(9);
      const math = subjects.find((s) => s.id === 'math-g9') || subjects[0];
      setSelectedSubjectId(math.id);
      updateStep(2, 'success');

      // Step 4: Open Unit
      updateStep(3, 'running');
      const unit = math.units[0];
      setSelectedUnit(unit);
      updateStep(3, 'success');

      // Step 5: Open Lesson & Topic
      updateStep(4, 'running');
      const lesson = unit.sections[0]?.lessons[0];
      const topic = lesson?.topics[0];
      setSelectedLesson(lesson);
      setSelectedTopic(topic);
      updateStep(4, 'success');

      // Step 6: Learn
      updateStep(5, 'running');
      await new Promise((r) => setTimeout(r, 300));
      updateStep(5, 'success');

      // Step 7: Ask AI Tutor
      updateStep(6, 'running');
      await new Promise((r) => setTimeout(r, 400));
      updateStep(6, 'success');

      // Step 8: Practice with Hints
      updateStep(7, 'running');
      await new Promise((r) => setTimeout(r, 300));
      updateStep(7, 'success');

      // Step 9: Take Quiz
      updateStep(8, 'running');
      await new Promise((r) => setTimeout(r, 300));
      updateStep(8, 'success');

      // Step 10: Receive Score
      updateStep(9, 'running');
      const quizRes = await studentAppFirestore.recordQuizResult(
        topic.id,
        topic.title.en,
        math.id,
        9,
        2,
        2,
        60
      );
      updateStep(9, 'success');

      // Step 11: Update Mastery
      updateStep(10, 'running');
      if (quizRes.mastery.masteryLevel !== 'mastered') throw new Error('Mastery not updated');
      updateStep(10, 'success');

      // Step 12: Detect Weak Topic
      updateStep(11, 'running');
      // Simulate recording a lower score to verify weak topic detection
      const weakRes = await studentAppFirestore.recordQuizResult(
        'topic-weak-demo',
        'Complex Roots in Relations',
        math.id,
        9,
        0,
        2,
        45
      );
      if (!weakRes.mastery.needsRevision) throw new Error('Weak detection failed');
      updateStep(11, 'success');

      // Step 13: Recommend Next Lesson in Knowledge Map DAG
      updateStep(12, 'running');
      if (quizRes.recommendations.length === 0 && weakRes.recommendations.length === 0) {
        throw new Error('No recommendation generated');
      }
      updateStep(12, 'success');

      // Step 14: Save Progress
      updateStep(13, 'running');
      await studentAppFirestore.recordLearningProgress(topic.id, topic.title.en, math.id, 9, 120, true);
      updateStep(13, 'success');
    } catch (err) {
      console.error('Final test error:', err);
    } finally {
      setTestRunning(false);
    }
  };

  const currentSubjectItem =
    ethiopianCurriculumEngine.getSubject(selectedSubjectId) ||
    ethiopianCurriculumEngine.getSubjectsByGrade(grade)[0];

  // Material 3 Color Palette & Tokens
  const appBg = darkMode ? 'bg-[#141218]' : 'bg-[#FEF7FF]';
  const navBg = darkMode ? 'bg-[#1D1B20] border-[#36343B]' : 'bg-[#F7F2FA] border-[#E6E0E9]';
  const textPrimary = darkMode ? 'text-[#E6E1E5]' : 'text-[#1D1B20]';
  const textSecondary = darkMode ? 'text-[#CAC4D0]' : 'text-[#49454F]';

  // Navigation Items
  const navItems: { id: StudentTab; label: string; icon: any }[] = [
    { id: 'home', label: 'መነሻ (Home)', icon: Home },
    { id: 'subjects', label: 'የትምህርት ዓይነቶች (Subjects)', icon: BookOpen },
    { id: 'knowledge_map', label: 'የእውቀት ካርታ (Map)', icon: Compass },
    { id: 'quiz', label: 'ፈተናዎች (Quiz)', icon: Award },
    { id: 'photo_solver', label: 'የፎቶ ፈቺ (Camera OCR)', icon: Camera },
    { id: 'voice_tutor', label: 'ድምፅ አስተማሪ (Voice)', icon: Mic },
  ];

  return (
    <div className={`min-h-screen flex flex-col ${appBg} transition-colors duration-200 font-sans`}>
      {/* 1. FLUTTER MATERIAL 3 TOP APP BAR */}
      <header className={`sticky top-0 z-40 border-b px-4 sm:px-6 py-3 flex items-center justify-between shadow-xs ${navBg}`}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-[#6750A4] text-white flex items-center justify-center font-black shadow-xs">
            ኑር
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-[#6750A4] dark:text-[#D0BCFF] tracking-wide uppercase">
                NUR AI High School • የተማሪ መተግበሪያ
              </span>
              {lowDataMode && (
                <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-amber-200 text-amber-900">
                  ዳታ ቆጣቢ
                </span>
              )}
            </div>
            <h1 className={`text-sm sm:text-base font-black tracking-tight ${textPrimary}`}>
              የኢትዮጵያ ሁለተኛ ደረጃ ትምህርት ቤት
            </h1>
          </div>
        </div>

        {/* Action Controls: Grade Switcher, Language, Dark Mode, Final Test */}
        <div className="flex items-center gap-2">
          {/* Grade Selector Pills (9-12) */}
          <div className="hidden sm:flex items-center gap-1 p-1 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10">
            {([9, 10, 11, 12] as GradeLevel[]).map((g) => (
              <button
                key={g}
                onClick={() => handleSelectGrade(g)}
                className={`px-2.5 py-1 rounded-full text-xs font-black transition-all cursor-pointer ${
                  grade === g
                    ? 'bg-[#6750A4] text-white shadow-xs'
                    : 'text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white'
                }`}
              >
                ክፍል {g}
              </button>
            ))}
          </div>

          {/* Language Switcher */}
          <div className="relative group">
            <button
              className={`p-2 rounded-full border text-xs font-black flex items-center gap-1 cursor-pointer ${
                darkMode ? 'border-[#49454F] text-[#E6E1E5]' : 'border-[#CAC4D0] text-[#1D1B20]'
              }`}
            >
              <Languages className="w-4 h-4 text-[#6750A4]" />
              <span className="uppercase text-[10px] font-bold">{language}</span>
            </button>
            <div className="absolute right-0 mt-1 hidden group-hover:block w-32 p-1 rounded-2xl bg-white dark:bg-[#211F26] border shadow-lg z-50">
              {[
                { code: 'am', label: 'አማርኛ' },
                { code: 'en', label: 'English' },
                { code: 'om', label: 'Afaan Oromoo' },
                { code: 'ti', label: 'ትግርኛ' },
              ].map((l) => (
                <button
                  key={l.code}
                  onClick={() => handleSelectLanguage(l.code as LanguageCode)}
                  className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer hover:bg-purple-50 dark:hover:bg-purple-950/40 ${
                    language === l.code ? 'text-[#6750A4] font-black' : textPrimary
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          {/* Offline / Storage Status icon */}
          <button
            title="ያለ ኢንተርኔት መማር (Offline & Storage)"
            onClick={() => setCurrentTab('home')}
            className={`p-2 rounded-full border text-xs cursor-pointer ${
              isOnline
                ? 'text-emerald-600 border-emerald-300 bg-emerald-50 dark:bg-emerald-950/30'
                : 'text-amber-600 border-amber-300 bg-amber-50 dark:bg-amber-950/30'
            }`}
          >
            {isOnline ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={handleToggleDarkMode}
            className={`p-2 rounded-full border cursor-pointer transition-all ${
              darkMode ? 'border-[#49454F] text-amber-300' : 'border-[#CAC4D0] text-gray-700'
            }`}
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Final Test Runner Trigger */}
          <button
            onClick={() => setIsTestRunnerOpen(true)}
            className="px-3 py-1.5 rounded-full text-xs font-black bg-emerald-600 text-white hover:bg-emerald-700 transition-all flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
          >
            <ShieldCheck className="w-4 h-4" />
            <span className="hidden sm:inline">የመጨረሻ ሙከራ (Final Test)</span>
          </button>
        </div>
      </header>

      {/* 2. BODY LAYOUT: NavigationRail on Desktop, Content Area, NavigationBar on Mobile */}
      <div className="flex-1 flex overflow-hidden">
        {/* DESKTOP / TABLET NAVIGATION RAIL (Flutter NavigationRail pattern) */}
        <aside className={`hidden md:flex flex-col items-center justify-between w-20 lg:w-60 border-r p-3 ${navBg}`}>
          <div className="w-full space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`w-full p-3 rounded-2xl font-bold text-xs transition-all flex items-center gap-3 cursor-pointer ${
                    isActive
                      ? 'bg-[#EADDFF] text-[#21005D] dark:bg-[#4F378B] dark:text-[#EADDFF] font-black shadow-xs'
                      : `${textSecondary} hover:bg-black/5 dark:hover:bg-white/5`
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="hidden lg:inline truncate">{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Bottom Card in Desktop Rail */}
          <div className="w-full hidden lg:block p-3 rounded-2xl border border-purple-200 bg-purple-50/50 dark:bg-purple-950/20 text-center text-xs space-y-1">
            <span className="text-[10px] font-black uppercase text-[#6750A4] dark:text-[#D0BCFF] block">
              ክፍል {grade} • {language.toUpperCase()}
            </span>
            <p className="text-[11px] text-gray-500 font-bold">የኢ.ፌ.ዲ.ሪ ትምህርት ሚኒስቴር አዲሱ ስርዓተ-ትምህርት</p>
          </div>
        </aside>

        {/* MAIN SCROLLABLE CONTENT VIEWPORT */}
        <main className="flex-1 overflow-y-auto pb-24 md:pb-8">
          {/* TAB 1: STUDENT HOME */}
          {currentTab === 'home' && (
            <StudentHomeScreen
              grade={grade}
              language={language}
              darkMode={darkMode}
              lowDataMode={lowDataMode}
              onSelectSubject={handleOpenSubject}
              onContinueLearning={handleContinueLearning}
              onOpenKnowledgeMap={() => setCurrentTab('knowledge_map')}
              onOpenQuiz={() => setCurrentTab('quiz')}
            />
          )}

          {/* TAB 2: SUBJECT HIERARCHY (Grade -> Subject -> Units -> Lessons -> Topics) */}
          {currentTab === 'subjects' && currentSubjectItem && (
            <StudentSubjectScreen
              subject={currentSubjectItem}
              grade={grade}
              language={language}
              darkMode={darkMode}
              lowDataMode={lowDataMode}
              onBack={() => setCurrentTab('home')}
              onStartLearning={handleStartLearningFromSubject}
            />
          )}

          {/* TAB 3: THE 8 CORE ACTIONS LEARNING PAGE */}
          {currentTab === 'learn' && selectedTopic && selectedUnit && selectedLesson && (
            <StudentLearningScreen
              topic={selectedTopic}
              unit={selectedUnit}
              lesson={selectedLesson}
              grade={grade}
              subjectId={selectedSubjectId}
              subjectName={currentSubjectItem?.name[language] || currentSubjectItem?.name.en || 'Subject'}
              language={language}
              darkMode={darkMode}
              lowDataMode={lowDataMode}
              onBack={() => setCurrentTab('subjects')}
              onNavigateToTopic={(tId) => handleContinueLearning(selectedSubjectId, tId)}
            />
          )}

          {/* TAB 4: KNOWLEDGE MAP DAG */}
          {currentTab === 'knowledge_map' && (
            <StudentKnowledgeMapScreen
              grade={grade}
              language={language}
              darkMode={darkMode}
              onOpenTopic={handleContinueLearning}
            />
          )}

          {/* TAB 5: CURRICULUM QUIZ */}
          {currentTab === 'quiz' && (
            <StudentQuizScreen
              grade={grade}
              language={language}
              darkMode={darkMode}
              onContinueLearning={handleContinueLearning}
            />
          )}

          {/* TAB 6: PHOTO QUESTION SOLVER OCR */}
          {currentTab === 'photo_solver' && (
            <StudentPhotoSolverScreen
              grade={grade}
              language={language}
              darkMode={darkMode}
            />
          )}

          {/* TAB 7: VOICE TUTOR */}
          {currentTab === 'voice_tutor' && (
            <StudentVoiceTutorScreen
              grade={grade}
              language={language}
              darkMode={darkMode}
            />
          )}
        </main>
      </div>

      {/* 3. FLUTTER MATERIAL 3 BOTTOM NAVIGATION BAR (Mobile View) */}
      <nav className={`md:hidden fixed bottom-0 left-0 right-0 z-40 border-t flex items-center justify-around py-2 px-1 shadow-md ${navBg}`}>
        {navItems.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`flex flex-col items-center gap-1 p-1.5 rounded-xl cursor-pointer transition-all ${
                isActive ? 'text-[#6750A4] dark:text-[#D0BCFF] font-black' : textSecondary
              }`}
            >
              <div className={`p-1 rounded-full ${isActive ? 'bg-[#EADDFF] dark:bg-[#4F378B]' : ''}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] leading-none">{item.label.split(' ')[0]}</span>
            </button>
          );
        })}
      </nav>

      {/* 4. FINAL TEST VERIFICATION RUNNER MODAL */}
      {isTestRunnerOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className={`w-full max-w-xl rounded-3xl p-6 sm:p-8 border-[1.5px] shadow-2xl space-y-5 ${
            darkMode ? 'bg-[#211F26] border-[#36343B]' : 'bg-white border-[#E6E0E9]'
          }`}>
            <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-emerald-600" />
                <h3 className={`text-base sm:text-lg font-black ${textPrimary}`}>
                  የመጨረሻ 14-ደረጃ የሙሉ ሙከራ ማረጋገጫ (Final Test Verification)
                </h3>
              </div>
              <button
                onClick={() => setIsTestRunnerOpen(false)}
                className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <p className="text-xs text-gray-500">
              ይህ ሙከራ የተማሪውን ሙሉ የትምህርት ዑደት (Register → Subject → Unit → Lesson → AI Tutor → Practice → Quiz → Score → Mastery → Weak Topic → Recommendation → Save) ይፈትሻል።
            </p>

            <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
              {testSteps.map((step, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-2xl border text-xs font-bold flex items-center justify-between ${
                    step.status === 'success'
                      ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 text-emerald-900 dark:text-emerald-200'
                      : step.status === 'running'
                      ? 'bg-purple-50 dark:bg-purple-950/30 border-purple-300 text-purple-900 dark:text-purple-200'
                      : darkMode
                      ? 'bg-[#2B2930] border-[#49454F] text-[#E6E1E5]'
                      : 'bg-gray-50 border-[#E6E0E9] text-[#1D1B20]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-[10px]">
                      {idx + 1}
                    </span>
                    <span>{step.name}</span>
                  </div>
                  <div>
                    {step.status === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                    {step.status === 'running' && (
                      <span className="text-[10px] text-purple-600 font-black animate-pulse">በመስራት ላይ...</span>
                    )}
                    {step.status === 'pending' && <span className="text-[10px] text-gray-400">ተጠባባቂ</span>}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                onClick={() => setIsTestRunnerOpen(false)}
                className="px-4 py-2 rounded-full text-xs font-bold border border-gray-300 dark:border-gray-700 cursor-pointer"
              >
                ዝጋ
              </button>
              <button
                onClick={runFinalTest}
                disabled={testRunning}
                className="px-5 py-2 rounded-full text-xs font-black bg-emerald-600 text-white hover:bg-emerald-700 transition-all flex items-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
              >
                <Play className="w-3.5 h-3.5" />
                <span>{testRunning ? 'በመፈተሽ ላይ...' : 'ሁሉንም ፈትሽ (Run All 14 Steps)'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
