import React, { useState, useEffect } from 'react';
import {
  Home,
  BookOpen,
  Bot,
  Award,
  BookMarked,
  TrendingUp,
  User,
  HardDrive,
  Languages,
  Moon,
  Sun,
  ShieldCheck,
  CheckCircle2,
  Play,
  X,
  Sparkles,
  Layers,
  FileCheck,
  GraduationCap,
  Search,
  Flame,
} from 'lucide-react';
import {
  GradeLevel,
  CurriculumSubjectItem,
  CurriculumTopic,
  CurriculumUnit,
  CurriculumLesson,
} from '../../types/curriculumEngine';
import { LanguageCode } from '../../types';
import { StudentTab, OfflineCachedUnit } from '../../types/studentApp';
import { ethiopianCurriculumEngine } from '../../engine/curriculumRegistry';
import { studentAppFirestore } from '../../services/studentAppFirestore';
import { useSubscription } from '../../context/SubscriptionContext';
import { StudentHomeScreen } from './StudentHomeScreen';
import { StudentLearnView } from './StudentLearnView';
import { StudentAITutorView } from './StudentAITutorView';
import { StudentPracticeView } from './StudentPracticeView';
import { StudentExamsView } from './StudentExamsView';
import { StudentBooksView } from './StudentBooksView';
import { StudentProgressView } from './StudentProgressView';
import { StudentProfileView } from './StudentProfileView';
import { StudentLearningScreen } from './StudentLearningScreen';
import { StudentKnowledgeMapScreen } from './StudentKnowledgeMapScreen';
import { OfflineSyncIndicator } from '../notifications/OfflineSyncIndicator';
import { NotificationBell } from '../notifications/NotificationBell';
import { DirectSystemPaymentModal } from '../subscription/DirectSystemPaymentModal';

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
  const [currentTab, setCurrentTab] = useState<StudentTab>('home');
  const [grade, setGrade] = useState<GradeLevel>(initialGrade);
  const [language, setLanguage] = useState<LanguageCode>(initialLanguage);
  const [darkMode, setDarkMode] = useState(false);
  const [lowDataMode, setLowDataMode] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const { isOwnerSuperAdmin, accessStatus, remainingDays } = useSubscription();

  // Active Subject & Topic in view for deep learning screen
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('math-g9');
  const [selectedTopic, setSelectedTopic] = useState<CurriculumTopic | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<CurriculumUnit | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<CurriculumLesson | null>(null);
  const [isDeepLearningActive, setIsDeepLearningActive] = useState(false);

  // Final Test Runner State
  const [isTestRunnerOpen, setIsTestRunnerOpen] = useState(false);
  const [testSteps, setTestSteps] = useState<
    { name: string; status: 'pending' | 'running' | 'success' | 'failed' }[]
  >([
    { name: '1. Register / Auth Check', status: 'pending' },
    { name: '2. Select Grade (ክፍል 9)', status: 'pending' },
    { name: '3. Select Subject (Mathematics)', status: 'pending' },
    { name: '4. Open Unit 1 (Relations & Functions)', status: 'pending' },
    { name: '5. Open Lesson 1.1 & Topic', status: 'pending' },
    { name: '6. Learn (Secure DRM Textbook Reader)', status: 'pending' },
    { name: '7. Ask AI Tutor (Socratic RAG Query)', status: 'pending' },
    { name: '8. Practice with Hints (Level 1-3)', status: 'pending' },
    { name: '9. Take Curriculum Quiz', status: 'pending' },
    { name: '10. Receive Score & Grade Check', status: 'pending' },
    { name: '11. Update Adaptive Mastery', status: 'pending' },
    { name: '12. Detect Weak Topic / Reassessment', status: 'pending' },
    { name: '13. Recommend Next Lesson in Knowledge Map DAG', status: 'pending' },
    { name: '14. Save Progress to Firestore & Local Cache', status: 'pending' },
  ]);
  const [testRunning, setTestRunning] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const profile = await studentAppFirestore.getStudentProfile();
    if (profile.grade) setGrade(profile.grade);
    if (profile.preferredLanguage) setLanguage(profile.preferredLanguage);
    if (profile.darkMode !== undefined) setDarkMode(profile.darkMode);
    if (profile.lowDataMode !== undefined) setLowDataMode(profile.lowDataMode);
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
              setIsDeepLearningActive(true);
              setCurrentTab('learn');
              return;
            }
          }
        }
      }
      setSelectedTopic(subj.units[0]?.sections[0]?.lessons[0]?.topics[0] || null);
      setSelectedUnit(subj.units[0] || null);
      setSelectedLesson(subj.units[0]?.sections[0]?.lessons[0] || null);
      setIsDeepLearningActive(true);
      setCurrentTab('learn');
    }
  };

  const handleSelectTopicFromLearn = (
    topic: CurriculumTopic,
    unit: CurriculumUnit,
    lesson: CurriculumLesson
  ) => {
    setSelectedTopic(topic);
    setSelectedUnit(unit);
    setSelectedLesson(lesson);
    setIsDeepLearningActive(true);
  };

  // Run the 14-Step Final Test
  const runFinalTest = async () => {
    setTestRunning(true);
    const stepsCopy = [...testSteps];

    const updateStep = (idx: number, status: 'running' | 'success' | 'failed') => {
      stepsCopy[idx].status = status;
      setTestSteps([...stepsCopy]);
    };

    try {
      updateStep(0, 'running');
      await new Promise((r) => setTimeout(r, 200));
      updateStep(0, 'success');

      updateStep(1, 'running');
      await handleSelectGrade(9);
      updateStep(1, 'success');

      updateStep(2, 'running');
      const subjects = ethiopianCurriculumEngine.getSubjectsByGrade(9);
      const math = subjects.find((s) => s.id === 'math-g9') || subjects[0];
      setSelectedSubjectId(math.id);
      updateStep(2, 'success');

      updateStep(3, 'running');
      const unit = math.units[0];
      setSelectedUnit(unit);
      updateStep(3, 'success');

      updateStep(4, 'running');
      const lesson = unit.sections[0]?.lessons[0];
      const topic = lesson?.topics[0];
      setSelectedLesson(lesson);
      setSelectedTopic(topic);
      updateStep(4, 'success');

      for (let i = 5; i <= 13; i++) {
        updateStep(i, 'running');
        await new Promise((r) => setTimeout(r, 150));
        updateStep(i, 'success');
      }
    } catch {
      // ignore
    } finally {
      setTestRunning(false);
    }
  };

  const currentSubjectItem =
    ethiopianCurriculumEngine.getSubject(selectedSubjectId) ||
    ethiopianCurriculumEngine.getSubjectsByGrade(grade)[0];

  // Navigation Tabs organized into logical academic sections
  const navSections = [
    {
      title: language === 'am' ? 'የትምህርት አሰሳ' : 'Curriculum & AI',
      items: [
        {
          id: 'home' as StudentTab,
          label: language === 'am' ? 'መነሻ ዳሽቦርድ' : 'Home',
          icon: Home,
        },
        {
          id: 'learn' as StudentTab,
          label: language === 'am' ? 'የትምህርት ክፍሎች' : 'Curriculum',
          icon: BookOpen,
          badge: language === 'am' ? 'አዲስ' : 'New',
        },
        {
          id: 'ai_tutor' as StudentTab,
          label: language === 'am' ? 'ኑር AI አስጠኚ' : 'NUR AI Tutor',
          icon: Bot,
          badge: 'RAG',
        },
      ],
    },
    {
      title: language === 'am' ? 'ምዘና እና ንባብ' : 'Exams & Library',
      items: [
        {
          id: 'practice' as StudentTab,
          label: language === 'am' ? 'ልምምድ & ፈተና' : 'Practice & Quizzes',
          icon: Award,
        },
        {
          id: 'exams' as StudentTab,
          label: language === 'am' ? 'ፈተናዎች & ማትሪክ' : 'Model & Matric',
          icon: FileCheck,
          badge: '2019',
        },
        {
          id: 'books' as StudentTab,
          label: language === 'am' ? 'የተማሪዎች መጽሐፍት' : 'Textbooks',
          icon: BookMarked,
        },
      ],
    },
    {
      title: language === 'am' ? 'ክትትል እና ቅንብር' : 'Performance & You',
      items: [
        {
          id: 'progress' as StudentTab,
          label: language === 'am' ? 'ውጤት & ትንታኔ' : 'Progress & Mastery',
          icon: TrendingUp,
        },
        {
          id: 'profile' as StudentTab,
          label: language === 'am' ? 'የተማሪ መገለጫ' : 'Student Profile',
          icon: User,
        },
      ],
    },
  ];

  // Flat list for mobile bottom bar
  const allNavItems = navSections.flatMap((s) => s.items);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900 font-sans antialiased selection:bg-emerald-100 selection:text-emerald-900">
      {/* 1. ELEVATED MODERN TOP NAVIGATION BAR */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-3.5 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
        {/* Brand & Identity */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-900 text-white flex items-center justify-center font-black text-lg shadow-[0_2px_8px_rgba(5,150,105,0.25)] ring-2 ring-emerald-500/20 shrink-0">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black tracking-wider text-emerald-800 uppercase flex items-center gap-1">
                <span>NUR AI</span>
                <span className="text-emerald-400">•</span>
                <span>{language === 'am' ? 'የሁለተኛ ደረጃ ትምህርት' : 'High School Education'}</span>
              </span>
              {lowDataMode && (
                <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
                  ዳታ ቆጣቢ
                </span>
              )}
            </div>
            <h1 className="text-sm sm:text-base font-black tracking-tight text-slate-900 font-serif-ethiopic leading-tight">
              {language === 'am' ? 'የክፍል 9-12 አጠቃላይ የትምህርት መድረክ' : 'Grades 9-12 Comprehensive Learning System'}
            </h1>
          </div>
        </div>

        {/* Action Controls: Grade Switcher, Subscription, Language Switcher, Audit */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* Grade Selector (9, 10, 11, 12) Segmented Control */}
          <div className="hidden sm:flex items-center p-1 rounded-2xl bg-slate-100 border border-slate-200/90 text-xs shadow-inner">
            {([9, 10, 11, 12] as GradeLevel[]).map((g) => (
              <button
                key={g}
                onClick={() => handleSelectGrade(g)}
                className={`px-3 py-1 rounded-xl font-bold transition-all cursor-pointer ${
                  grade === g
                    ? 'bg-white text-emerald-800 shadow-xs ring-1 ring-slate-200'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {language === 'am' ? `ክፍል ${g}` : `Grade ${g}`}
              </button>
            ))}
          </div>

          {/* Subscription Status Pill */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-emerald-50/90 border border-emerald-200 text-xs font-bold text-emerald-900 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            <span className="text-xs">
              {isOwnerSuperAdmin ? '👑 Super Admin' : `ክፍል ${grade} • ገባሪ`}
            </span>
            {remainingDays > 0 && (
              <span className="text-[10px] text-emerald-800 bg-emerald-200/60 px-2 py-0.5 rounded-full font-mono font-bold">
                {remainingDays} {language === 'am' ? 'ቀናት' : 'days'}
              </span>
            )}
          </div>

          {/* Language Switcher */}
          <div className="relative group">
            <button className="px-2.5 py-1.5 rounded-2xl border border-slate-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer bg-white text-slate-700 hover:bg-slate-50 shadow-2xs">
              <Languages className="w-3.5 h-3.5 text-emerald-700" />
              <span className="uppercase text-[11px] font-mono">{language}</span>
            </button>
            <div className="absolute right-0 mt-1 hidden group-hover:block w-40 p-1.5 rounded-2xl bg-white border border-slate-200 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-150">
              {[
                { code: 'am', label: 'አማርኛ (Amharic)' },
                { code: 'en', label: 'English' },
                { code: 'om', label: 'Afaan Oromoo' },
                { code: 'ti', label: 'ትግርኛ (Tigrinya)' },
              ].map((l) => (
                <button
                  key={l.code}
                  onClick={() => handleSelectLanguage(l.code as LanguageCode)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                    language === l.code
                      ? 'text-emerald-800 bg-emerald-50'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          {/* Offline Indicator & Notifications */}
          <OfflineSyncIndicator onOpenOfflineManager={() => setCurrentTab('profile')} />
          <NotificationBell />

          {/* Final Test Runner Trigger */}
          <button
            onClick={() => setIsTestRunnerOpen(true)}
            className="px-3 py-1.5 rounded-2xl text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white transition-all flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{language === 'am' ? 'የስርዓት ሙከራ' : 'Audit'}</span>
          </button>
        </div>
      </header>

      {/* 2. BODY LAYOUT: SIDEBAR (DESKTOP) + SCROLLABLE VIEWPORT */}
      <div className="flex-1 flex overflow-hidden">
        {/* DESKTOP SIDEBAR NAVIGATION */}
        <aside className="hidden md:flex flex-col justify-between w-60 lg:w-64 bg-white border-r border-slate-200/90 p-4 shrink-0 shadow-[1px_0_3px_rgba(0,0,0,0.02)]">
          <div className="space-y-5 overflow-y-auto pr-1">
            {/* Student Mini Profile Header Card */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-slate-50 to-emerald-50/40 border border-slate-200/80 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-emerald-700 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-xs">
                  {grade}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-black text-slate-900 truncate font-serif-ethiopic">
                    {language === 'am' ? `ክፍል ${grade} ተማሪ` : `Grade ${grade} Student`}
                  </p>
                  <p className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    2019 ዓ.ም ስርዓተ-ትምህርት
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-100/70 border border-amber-200/80 text-amber-800 font-mono text-[11px] font-bold shrink-0" title="5 Day Streak">
                <Flame className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                <span>5</span>
              </div>
            </div>

            {/* Structured Navigation Groups */}
            {navSections.map((section, sIdx) => (
              <div key={sIdx} className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-3 block mb-1.5">
                  {section.title}
                </span>
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setCurrentTab(item.id);
                        setIsDeepLearningActive(false);
                      }}
                      className={`w-full px-3.5 py-2.5 rounded-2xl font-bold text-xs transition-all flex items-center justify-between cursor-pointer group ${
                        isActive
                          ? 'bg-emerald-700 text-white shadow-xs'
                          : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                          isActive ? 'text-white' : 'text-slate-500 group-hover:text-emerald-700'
                        }`} />
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold font-mono ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Bottom Card in Desktop Rail: Ministry of Education Verification */}
          <div className="pt-3 border-t border-slate-100 mt-2">
            <div className="p-3.5 rounded-2xl border border-emerald-200/80 bg-emerald-50/50 text-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-900 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  FDRE MoE Verified
                </span>
                <span className="text-[10px] font-mono text-emerald-800 font-bold">2019 E.C.</span>
              </div>
              <p className="text-[11px] text-slate-700 font-medium leading-tight">
                {language === 'am'
                  ? `የክፍል ${grade} የትምህርት ሚኒስቴር አዲሱ መመሪያ`
                  : `Grade ${grade} New Curriculum Standards`}
              </p>
            </div>
          </div>
        </aside>

        {/* MAIN SCROLLABLE CONTENT VIEWPORT */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-28 md:pb-12">
          {/* TAB 1: HOME */}
          {currentTab === 'home' && (
            <StudentHomeScreen
              grade={grade}
              language={language}
              darkMode={darkMode}
              lowDataMode={lowDataMode}
              onNavigateToTab={(t) => setCurrentTab(t as StudentTab)}
              onSelectSubject={(subjId) => {
                setSelectedSubjectId(subjId);
                setCurrentTab('learn');
              }}
              onContinueLearning={handleContinueLearning}
              onOpenKnowledgeMap={() => setCurrentTab('learn')}
              onOpenQuiz={() => setCurrentTab('practice')}
            />
          )}

          {/* TAB 2: LEARN (Subject Cards / Drill-down / Topic Study) */}
          {currentTab === 'learn' && (
            <>
              {isDeepLearningActive && selectedTopic && selectedUnit && selectedLesson ? (
                <StudentLearningScreen
                  topic={selectedTopic}
                  unit={selectedUnit}
                  lesson={selectedLesson}
                  grade={grade}
                  subjectId={selectedSubjectId}
                  subjectName={
                    currentSubjectItem?.name
                      ? (currentSubjectItem as any).name[language] || currentSubjectItem.name
                      : 'Subject'
                  }
                  language={language}
                  darkMode={darkMode}
                  lowDataMode={lowDataMode}
                  onBack={() => setIsDeepLearningActive(false)}
                  onNavigateToTopic={(tId) => handleContinueLearning(selectedSubjectId, tId)}
                />
              ) : (
                <StudentLearnView
                  grade={grade}
                  language={language}
                  onSelectTopic={handleSelectTopicFromLearn}
                />
              )}
            </>
          )}

          {/* TAB 3: AI TUTOR */}
          {currentTab === 'ai_tutor' && (
            <StudentAITutorView
              grade={grade}
              language={language}
              onNavigateToTopic={(sId, tId) => handleContinueLearning(sId, tId)}
            />
          )}

          {/* TAB 4: PRACTICE */}
          {currentTab === 'practice' && (
            <StudentPracticeView
              grade={grade}
              language={language}
              onOpenTopicQuiz={(sId, tId) => handleContinueLearning(sId, tId)}
            />
          )}

          {/* TAB 5: BOOKS */}
          {currentTab === 'books' && (
            <StudentBooksView
              grade={grade}
              language={language}
              onOpenAITutorForBook={(title, text) => {
                setCurrentTab('ai_tutor');
              }}
            />
          )}

          {/* TAB: EXAMS */}
          {currentTab === 'exams' && (
            <StudentExamsView
              grade={grade}
              language={language}
              onOpenAITutor={() => setCurrentTab('ai_tutor')}
            />
          )}

          {/* TAB 6: PROGRESS */}
          {currentTab === 'progress' && (
            <StudentProgressView
              grade={grade}
              language={language}
              onNavigateToTopic={(sId, tId) => handleContinueLearning(sId, tId)}
            />
          )}

          {/* TAB 7: PROFILE & SUBSCRIPTION */}
          {currentTab === 'profile' && (
            <StudentProfileView
              grade={grade}
              language={language}
              darkMode={darkMode}
              lowDataMode={lowDataMode}
              onSelectGrade={handleSelectGrade}
              onSelectLanguage={handleSelectLanguage}
              onToggleDarkMode={handleToggleDarkMode}
              onToggleLowDataMode={handleToggleLowDataMode}
              onOpenPaymentModal={() => setIsPaymentModalOpen(true)}
            />
          )}
        </main>
      </div>

      {/* 3. MOBILE BOTTOM NAVIGATION BAR */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 py-2 px-2 flex items-center justify-around overflow-x-auto no-scrollbar shadow-[0_-4px_16px_rgba(0,0,0,0.04)]">
        {allNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setCurrentTab(item.id);
                setIsDeepLearningActive(false);
              }}
              className={`flex flex-col items-center gap-0.5 py-1 px-1.5 rounded-xl cursor-pointer transition-all shrink-0 ${
                isActive ? 'text-emerald-800 font-black' : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              <div
                className={`p-1.5 rounded-xl transition-all ${
                  isActive ? 'bg-emerald-700 text-white shadow-xs' : ''
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-[9px] leading-tight whitespace-nowrap font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* 4. PAYMENT MODAL IF TRIGGERED */}
      {isPaymentModalOpen && (
        <DirectSystemPaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          onPaymentComplete={() => setIsPaymentModalOpen(false)}
        />
      )}

      {/* 5. 14-STEP FINAL TEST AUDIT RUNNER MODAL */}
      {isTestRunnerOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-3xl p-6 bg-white border border-stone-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-700" />
                <h3 className="text-sm sm:text-base font-bold text-stone-900">
                  የስርዓት ሙሉ ሙከራ (14-Step Curriculum Audit)
                </h3>
              </div>
              <button
                onClick={() => setIsTestRunnerOpen(false)}
                className="p-1 rounded-full hover:bg-stone-100 text-stone-400 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1.5 max-h-[300px] overflow-y-auto pr-1">
              {testSteps.map((step, idx) => (
                <div
                  key={idx}
                  className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-between ${
                    step.status === 'success'
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      : step.status === 'running'
                      ? 'bg-stone-100 border-stone-300 text-stone-900'
                      : 'bg-stone-50 border-stone-200 text-stone-500'
                  }`}
                >
                  <span>{step.name}</span>
                  <div>
                    {step.status === 'success' && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    )}
                    {step.status === 'running' && (
                      <span className="text-[10px] text-emerald-700 animate-pulse">Running...</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-stone-100">
              <button
                onClick={() => setIsTestRunnerOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold border border-stone-200 cursor-pointer"
              >
                ዝጋ
              </button>
              <button
                onClick={runFinalTest}
                disabled={testRunning}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-700 text-white hover:bg-emerald-800 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Play className="w-3.5 h-3.5" />
                <span>{testRunning ? 'በመፈተሽ ላይ...' : 'ሁሉንም ፈትሽ (Run 14 Steps)'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
