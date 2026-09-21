import { useState, useMemo, useEffect, useRef } from 'react';
import { Grade, ActiveTab, Topic, SubjectStream } from './types';
import { getCurriculum } from './data/curriculumData';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProgressProvider, useProgress } from './context/ProgressContext';
import { NotificationProvider, useNotifications } from './context/NotificationContext';
import { NotificationToast } from './components/notifications/NotificationToast';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { TopicChips } from './components/TopicChips';
import { TabBar } from './components/TabBar';
import { LessonView } from './components/LessonView';
import { TextbookView } from './components/TextbookView';
import { ObjectivesExamView } from './components/ObjectivesExamView';
import { VideoLearningView } from './components/VideoLearningView';
import { SupplementaryBooksView } from './components/SupplementaryBooksView';
import { FlashcardView } from './components/FlashcardView';
import { QuizView } from './components/QuizView';
import { CourseProgressModal } from './components/CourseProgressModal';
import { CompletionCertificateModal } from './components/CompletionCertificateModal';
import { AllTextbooksModal } from './components/AllTextbooksModal';
import { NewCurriculumModal } from './components/NewCurriculumModal';
import { AIChapterTutorModal } from './components/AIChapterTutorModal';
import { AuthModal } from './components/AuthModal';
import { StudentLearningReviewView } from './components/StudentLearningReviewView';
import { EthiopianCurriculumEngineView } from './components/EthiopianCurriculumEngineView';
import { EthiopianAITutorView } from './components/EthiopianAITutorView';
import { StudentAppScaffold } from './components/student/StudentAppScaffold';
import { AdminDashboardView } from './components/admin/AdminDashboardView';
import { AdminSecurityDashboard } from './components/admin/AdminSecurityDashboard';
import { AIQuizExamEngineView } from './components/assessment/AIQuizExamEngineView';
import { GamificationDashboardView } from './components/gamification/GamificationDashboardView';
import { SmartSearchMainView } from './components/search/SmartSearchMainView';
import { PhotoQuestionSolverView } from './components/photoVoice/PhotoQuestionSolverView';
import { FullSystemIntegrationView } from './components/admin/FullSystemIntegrationView';
import { AuthGate } from './components/AuthGate';

import { OfflineSyncProvider } from './context/OfflineSyncContext';
import { GamificationProvider } from './context/GamificationContext';
import { SubscriptionProvider, useSubscription } from './context/SubscriptionContext';
import { SubscriptionPaymentView } from './components/subscription/SubscriptionPaymentView';
import { SubscriptionPaywallGate } from './components/subscription/SubscriptionPaywallGate';
import { SystemFeedbackModal } from './components/feedback/SystemFeedbackModal';
import { SystemFeedbackView } from './components/feedback/SystemFeedbackView';
import { CareerExplorationView } from './components/career/CareerExplorationView';
import { EntranceExamPrepView } from './components/entrance/EntranceExamPrepView';
import { PremiumLearningCenter } from './components/premium/PremiumLearningCenter';
import { AcademicWorkHubView } from './components/assessment/AcademicWorkHubView';
import { useGamification } from './context/GamificationContext';
import { SystemModulesDropdownDrawer } from './components/navigation/SystemModulesDropdownDrawer';
import { DirectSystemPaymentModal } from './components/subscription/DirectSystemPaymentModal';
import { SettingsModal, SettingsTabId } from './components/settings/SettingsModal';
import { FrontendGatewayModal } from './components/gateway/FrontendGatewayModal';

function TutorialAppContent() {
  const { language, t } = useLanguage();
  const { getOverallProgress, progressMap, studentReview } = useProgress();
  const { userProfile } = useAuth();
  const { isOwnerSuperAdmin, hasLearningAccess, loading: subscriptionLoading } = useSubscription();
  const { awardQuizXP, updateStreak } = useGamification();
  const { sendNotification } = useNotifications();

  // Application State
  const [selectedGrade, setSelectedGrade] = useState<Grade>(() => {
    const saved = localStorage.getItem('nur_selected_grade');
    if (saved && [9, 10, 11, 12].includes(Number(saved))) {
      return Number(saved) as Grade;
    }
    return 9;
  });
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('math');
  const [activeTab, setActiveTab] = useState<ActiveTab>('student_app');
  const [selectedStream, setSelectedStream] = useState<SubjectStream | 'all'>(() => {
    const saved = localStorage.getItem('nur_selected_stream');
    if (saved && ['all', 'natural', 'social'].includes(saved)) {
      return saved as SubjectStream | 'all';
    }
    return 'all';
  });
  const [isGatewayOpen, setIsGatewayOpen] = useState<boolean>(false);

  // Ref to track if initial routing for the user has occurred
  const initialAdminRoutedRef = useRef<boolean>(false);

  // PART 15 — Super Admin & Student Routing Enforcement:
  // IF authenticated user is SUPER_ADMIN: defaults to Admin Dashboard on login,
  // but has UNRESTRICTED ACCESS to inspect every section, student tab, and grade.
  // IF authenticated user is STUDENT:
  //   IF active subscription: open Student Dashboard.
  //   ELSE: open Subscription/Payment screen.
  // Never expose admin routes to students.
  useEffect(() => {
    if (subscriptionLoading) return;

    if (!initialAdminRoutedRef.current) {
      initialAdminRoutedRef.current = true;
      if (isOwnerSuperAdmin) {
        setActiveTab('admin_dashboard');
      } else if (!hasLearningAccess) {
        setActiveTab('subscription_payment');
      }
      return;
    }

    // Only guard non-super-admin users from admin routes or unpaid access
    if (!isOwnerSuperAdmin) {
      setActiveTab((prev) => {
        if (prev === 'admin_dashboard' || prev === 'security_fortress') {
          return hasLearningAccess ? 'student_app' : 'subscription_payment';
        }
        if (prev === 'student_app' && !hasLearningAccess) {
          return 'subscription_payment';
        }
        return prev;
      });
    }
  }, [userProfile?.uid, isOwnerSuperAdmin, hasLearningAccess, subscriptionLoading]);

  const handleTabChange = (newTab: ActiveTab) => {
    if ((newTab === 'admin_dashboard' || newTab === 'security_fortress') && !isOwnerSuperAdmin) {
      setActiveTab(hasLearningAccess ? 'student_app' : 'subscription_payment');
      return;
    }
    setActiveTab(newTab);
  };

  // Modals state
  const [isChecklistOpen, setIsChecklistOpen] = useState<boolean>(false);
  const [isCertificateOpen, setIsCertificateOpen] = useState<boolean>(false);
  const [isAllTextbooksOpen, setIsAllTextbooksOpen] = useState<boolean>(false);
  const [isNewCurriculumOpen, setIsNewCurriculumOpen] = useState<boolean>(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState<boolean>(false);
  const [isModulesDropdownOpen, setIsModulesDropdownOpen] = useState<boolean>(false);
  const [isDirectPaymentModalOpen, setIsDirectPaymentModalOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [settingsTab, setSettingsTab] = useState<SettingsTabId>('security');

  // AI Tutor / Deep-Dive Modal State
  const [aiTutorState, setAiTutorState] = useState<{
    isOpen: boolean;
    chapterTitle: string;
    mode: 'analysis' | 'chat' | 'research';
  }>({
    isOpen: false,
    chapterTitle: '',
    mode: 'analysis',
  });

  const handleOpenAITutor = (chapterTitle: string, mode: 'analysis' | 'chat' | 'research' = 'analysis') => {
    setAiTutorState({
      isOpen: true,
      chapterTitle,
      mode,
    });
  };

  // Load localized curriculum based on current language
  const currentCurriculum = useMemo(() => {
    return getCurriculum(language);
  }, [language]);

  // Selected Subject in current curriculum
  const currentSubject = useMemo(() => {
    return (
      currentCurriculum.find((s) => s.id === selectedSubjectId) ||
      currentCurriculum[0]
    );
  }, [currentCurriculum, selectedSubjectId]);

  // Helper to determine appropriate topic based on grade tier
  const getTopicForGrade = (subject = currentSubject, grade = selectedGrade) => {
    const tier = grade <= 10 ? '9-10' : '11-12';
    const matched = subject.topics.find((t) => t.gradeTier === tier);
    return matched || subject.topics[0];
  };

  const [selectedTopicId, setSelectedTopicId] = useState<string>(() => {
    return getTopicForGrade(currentSubject, selectedGrade).id;
  });

  // Get current active topic
  const currentTopic = useMemo(() => {
    return (
      currentSubject.topics.find((t) => t.id === selectedTopicId) ||
      getTopicForGrade(currentSubject, selectedGrade)
    );
  }, [currentSubject, selectedTopicId, selectedGrade]);

  // Handler for changing grade: also synchronizes topic tier
  const handleSelectGrade = (grade: Grade) => {
    setSelectedGrade(grade);
    localStorage.setItem('nur_selected_grade', grade.toString());
    const newTopic = getTopicForGrade(currentSubject, grade);
    setSelectedTopicId(newTopic.id);
  };

  // Handler for changing subject
  const handleSelectSubject = (subjectId: string) => {
    setSelectedSubjectId(subjectId);
    const nextSubject =
      currentCurriculum.find((s) => s.id === subjectId) || currentSubject;
    const newTopic = getTopicForGrade(nextSubject, selectedGrade);
    setSelectedTopicId(newTopic.id);
  };

  // Handler for selecting topic directly from checklist modal or chips
  const handleSelectTopicDirect = (subjectId: string, topic: Topic) => {
    setSelectedSubjectId(subjectId);
    setSelectedTopicId(topic.id);
  };

  // Handler for opening textbook from library modal
  const handleSelectSubjectAndGradeForTextbook = (subjectId: string, grade: Grade) => {
    setSelectedSubjectId(subjectId);
    setSelectedGrade(grade);
    setActiveTab('textbook');
  };

  const overall = getOverallProgress(currentCurriculum);

  return (
    <div className="min-h-screen bg-[#FAF6EC] text-[#24211E] py-3 sm:py-6 px-2 sm:px-4 md:px-6 flex flex-col items-center justify-start">
      {/* Main Container with 1.5px solid dark notebook border */}
      <div
        id="app-main-frame"
        className="w-full max-w-6xl border-[1.5px] border-[#38332D] bg-[#FAF6EC] shadow-sm flex flex-col overflow-hidden"
      >
        {/* Top Header with Course Completion Progress, Textbooks Library & Actions */}
        <Header
          selectedGrade={selectedGrade}
          onSelectGrade={handleSelectGrade}
          subjects={currentCurriculum}
          onOpenChecklist={() => setIsChecklistOpen(true)}
          onOpenCertificate={() => setIsCertificateOpen(true)}
          onOpenAllTextbooks={() => setIsAllTextbooksOpen(true)}
          onOpenNewCurriculum={() => setActiveTab('curriculum_engine')}
          onOpenSubscription={() => setActiveTab('subscription_payment')}
          onOpenFeedback={() => setIsFeedbackModalOpen(true)}
          onOpenModulesDropdown={() => setIsModulesDropdownOpen(true)}
          onOpenDirectPayment={() => setIsDirectPaymentModalOpen(true)}
          onOpenSettings={() => {
            setSettingsTab('security');
            setIsSettingsOpen(true);
          }}
          onOpenGateway={() => setIsGatewayOpen(true)}
          activeTab={activeTab}
          onToggleAdminDashboard={() =>
            setActiveTab((prev) => (prev === 'admin_dashboard' ? 'student_app' : 'admin_dashboard'))
          }
        />

        {/* Workspace: Sidebar + Content */}
        <div className="flex flex-col md:flex-row flex-1 min-h-[620px]">
          {/* Left Sidebar */}
          <Sidebar
            subjects={currentCurriculum}
            selectedSubjectId={currentSubject.id}
            onSelectSubject={handleSelectSubject}
            selectedStream={selectedStream}
            onSelectStream={(stream) => {
              setSelectedStream(stream);
              localStorage.setItem('nur_selected_stream', stream);
            }}
            onOpenGateway={() => setIsGatewayOpen(true)}
            onOpenSettings={() => {
              setSettingsTab('security');
              setIsSettingsOpen(true);
            }}
          />

          {/* Main Study Panel */}
          <main
            id="study-main-panel"
            className="flex-1 flex flex-col bg-[#FAF6EC] overflow-x-hidden min-w-0"
          >
            {/* Topic Chips Row */}
            <TopicChips
              subject={currentSubject}
              selectedGrade={selectedGrade}
              selectedTopic={currentTopic}
              onSelectTopic={(topic) => setSelectedTopicId(topic.id)}
            />

            {/* Tabs Header: Lesson | Textbook | Objectives Exam | Video | Supplementary | Flashcards | Quiz */}
            <TabBar
              activeTab={activeTab}
              onChangeTab={handleTabChange}
              subject={currentSubject}
            />

            {/* Tab Contents */}
            <div className="flex-1 overflow-y-auto bg-[#FAF6EC]">
              {activeTab === 'academic_work_hub' && (
                <div className="p-2 sm:p-4 lg:p-6">
                  <AcademicWorkHubView
                    onNavigateToPayment={() => setActiveTab('subscription_payment')}
                    selectedGrade={selectedGrade}
                    onGradeChange={setSelectedGrade}
                  />
                </div>
              )}

              {activeTab === 'premium_learning_center' && (
                <div className="p-2 sm:p-4 lg:p-6">
                  <PremiumLearningCenter
                    onNavigateToPayment={() => setActiveTab('subscription_payment')}
                    selectedGrade={selectedGrade}
                    onGradeChange={setSelectedGrade}
                  />
                </div>
              )}

              {activeTab === 'entrance_prep' && (
                <SubscriptionPaywallGate
                  featureTitle="የዩኒቨርሲቲ መግቢያ ፈተና ዝግጅት ሞተር (University Entrance Exam Prep Engine)"
                  onNavigateToPayment={() => setActiveTab('subscription_payment')}
                  onOpenFeedback={() => setIsFeedbackModalOpen(true)}
                >
                  <div className="p-2 sm:p-4 lg:p-6">
                    <EntranceExamPrepView
                      userId={userProfile?.uid || 'guest-student'}
                      userRole={userProfile?.role === 'admin' || isOwnerSuperAdmin ? 'SUPER_ADMIN' : 'STUDENT'}
                      onAwardXP={(amount, reason) => {
                        awardQuizXP('entrance-prep-session', Math.min(amount, 100), 100);
                        sendNotification({
                          title: 'የፈተና ነጥብ ተጨምሯል (+XP)',
                          body: `${reason}: +${amount} XP ተቀዳጅተዋል!`,
                          type: 'admin_notification',
                          recipientId: userProfile?.uid || 'guest-student',
                          recipientRole: 'student',
                        });
                      }}
                      onIncrementStreak={() => {
                        updateStreak();
                        sendNotification({
                          title: 'የጥናት ጽናት ቀጥሏል (Streak +1)',
                          body: 'የዕለቱ የመግቢያ ፈተና ልምምድዎን አጠናቀዋል!',
                          type: 'admin_notification',
                          recipientId: userProfile?.uid || 'guest-student',
                          recipientRole: 'student',
                        });
                      }}
                    />
                  </div>
                </SubscriptionPaywallGate>
              )}

              {activeTab === 'subscription_payment' && (
                <div className="p-2 sm:p-4 lg:p-6">
                  <SubscriptionPaymentView
                    initialGrade={selectedGrade}
                    onPaymentSuccess={() => setActiveTab('lesson')}
                    onOpenFeedback={() => setIsFeedbackModalOpen(true)}
                  />
                </div>
              )}

              {activeTab === 'system_feedback' && (
                <div className="p-2 sm:p-4 lg:p-6">
                  <SystemFeedbackView />
                </div>
              )}

              {activeTab === 'career_pathways' && (
                <div className="p-2 sm:p-4 lg:p-6">
                  <CareerExplorationView
                    userId={userProfile?.uid || 'student_demo'}
                    studentGrade={selectedGrade}
                    language={language as any}
                    progressMap={progressMap}
                    onNavigateToTopic={(subjectId, topicId) => {
                      handleSelectSubject(subjectId);
                      setSelectedTopicId(topicId);
                      setActiveTab('lesson');
                    }}
                  />
                </div>
              )}

              {activeTab === 'system_integration' && (
                <div className="p-2 sm:p-4 lg:p-6">
                  <FullSystemIntegrationView />
                </div>
              )}

              {activeTab === 'smart_search' && (
                <div className="p-2 sm:p-4 lg:p-6">
                  <SmartSearchMainView
                    userId={userProfile?.uid || 'student_demo'}
                    studentGrade={selectedGrade}
                    progressMap={progressMap}
                    weakTopics={studentReview?.weakAreas || []}
                    onSelectTopic={(subjectId, topicId) => {
                      handleSelectSubject(subjectId);
                      setSelectedTopicId(topicId);
                      setActiveTab('lesson');
                    }}
                    onOpenAITutor={(prompt, subjectId) => {
                      if (subjectId) handleSelectSubject(subjectId);
                      handleOpenAITutor(prompt || 'Curriculum Concept Explanation', 'chat');
                    }}
                  />
                </div>
              )}

              {activeTab === 'gamification' && (
                <div className="p-2 sm:p-4 lg:p-6">
                  <GamificationDashboardView />
                </div>
              )}

              {activeTab === 'photo_voice_tutor' && (
                <SubscriptionPaywallGate
                  featureTitle="ፎቶ ጥያቄ ፈቺና ድምፅ (Photo Solver & Voice AI)"
                  onNavigateToPayment={() => setActiveTab('subscription_payment')}
                  onOpenFeedback={() => setIsFeedbackModalOpen(true)}
                >
                  <div className="p-2 sm:p-4 lg:p-6">
                    <PhotoQuestionSolverView />
                  </div>
                </SubscriptionPaywallGate>
              )}

              {activeTab === 'assessment_engine' && (
                <SubscriptionPaywallGate
                  featureTitle="የፈተናና ምዘና ሞተር (Assessment Engine)"
                  onNavigateToPayment={() => setActiveTab('subscription_payment')}
                  onOpenFeedback={() => setIsFeedbackModalOpen(true)}
                >
                  <div className="p-2 sm:p-4 lg:p-6">
                    <AIQuizExamEngineView />
                  </div>
                </SubscriptionPaywallGate>
              )}

              {activeTab === 'security_fortress' && (
                <div className="p-2 sm:p-4 lg:p-6">
                  {isOwnerSuperAdmin ? (
                    <AdminSecurityDashboard />
                  ) : (
                    <div className="bg-white p-8 rounded-2xl border border-rose-300 text-center space-y-3 max-w-md mx-auto my-12 shadow-sm">
                      <h3 className="text-base font-bold text-stone-900 font-serif-ethiopic">የተከለከለ ክልል (Access Denied)</h3>
                      <p className="text-xs text-stone-600">ይህ ክፍል ለዋናው አስተዳዳሪ (SUPER_ADMIN) ብቻ የተፈቀደ ነው።</p>
                      <button
                        onClick={() => setActiveTab(hasLearningAccess ? 'student_app' : 'subscription_payment')}
                        className="px-4 py-2 bg-stone-900 text-white rounded-xl text-xs font-bold cursor-pointer"
                      >
                        ወደ ተማሪዎች ገጽ ተመለስ
                      </button>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'admin_dashboard' && (
                <div className="p-2 sm:p-4 lg:p-6">
                  {isOwnerSuperAdmin ? (
                    <AdminDashboardView />
                  ) : (
                    <div className="bg-white p-8 rounded-2xl border border-rose-300 text-center space-y-3 max-w-md mx-auto my-12 shadow-sm">
                      <h3 className="text-base font-bold text-stone-900 font-serif-ethiopic">የተከለከለ ክልል (Access Denied)</h3>
                      <p className="text-xs text-stone-600">ይህ ክፍል ለዋናው አስተዳዳሪ (SUPER_ADMIN) ብቻ የተፈቀደ ነው።</p>
                      <button
                        onClick={() => setActiveTab(hasLearningAccess ? 'student_app' : 'subscription_payment')}
                        className="px-4 py-2 bg-stone-900 text-white rounded-xl text-xs font-bold cursor-pointer"
                      >
                        ወደ ተማሪዎች ገጽ ተመለስ
                      </button>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'student_app' && (
                <StudentAppScaffold
                  initialGrade={selectedGrade}
                  initialLanguage={language}
                />
              )}

              {activeTab === 'ai_tutor' && (
                <SubscriptionPaywallGate
                  featureTitle="ኑር AI የግል አስተማሪ (AI Tutor & RAG)"
                  onNavigateToPayment={() => setActiveTab('subscription_payment')}
                  onOpenFeedback={() => setIsFeedbackModalOpen(true)}
                >
                  <EthiopianAITutorView
                    currentSubject={currentSubject}
                    initialGrade={selectedGrade}
                  />
                </SubscriptionPaywallGate>
              )}

              {activeTab === 'curriculum_engine' && (
                <div className="p-2 sm:p-4">
                  <EthiopianCurriculumEngineView
                    initialGrade={selectedGrade}
                    language={language}
                    onClose={() => setActiveTab('lesson')}
                  />
                </div>
              )}

              {activeTab === 'lesson' && (
                <SubscriptionPaywallGate
                  featureTitle="የትምህርት ክፍለ-ጊዜ (Lessons & Explanations)"
                  onNavigateToPayment={() => setActiveTab('subscription_payment')}
                  onOpenFeedback={() => setIsFeedbackModalOpen(true)}
                >
                  <LessonView
                    topic={currentTopic}
                    subject={currentSubject}
                    onChangeTab={setActiveTab}
                    onOpenAITutor={handleOpenAITutor}
                  />
                </SubscriptionPaywallGate>
              )}

              {activeTab === 'textbook' && (
                <SubscriptionPaywallGate
                  featureTitle="የተማሪው መጽሐፍ (Textbook Content)"
                  onNavigateToPayment={() => setActiveTab('subscription_payment')}
                  onOpenFeedback={() => setIsFeedbackModalOpen(true)}
                >
                  <TextbookView
                    subject={currentSubject}
                    selectedGrade={selectedGrade}
                    onSelectGrade={handleSelectGrade}
                    onOpenAllTextbooksModal={() => setIsAllTextbooksOpen(true)}
                    onOpenAITutor={handleOpenAITutor}
                    onTakeObjectivesExam={() => setActiveTab('objectives_exam')}
                    onExit={() => setActiveTab('lesson')}
                  />
                </SubscriptionPaywallGate>
              )}

              {activeTab === 'objectives_exam' && (
                <SubscriptionPaywallGate
                  featureTitle="የቻፕተር ፈተና (Objectives Exam)"
                  onNavigateToPayment={() => setActiveTab('subscription_payment')}
                  onOpenFeedback={() => setIsFeedbackModalOpen(true)}
                >
                  <div className="p-4 sm:p-6 lg:p-8">
                    <ObjectivesExamView
                      subject={currentSubject}
                      grade={selectedGrade}
                      onOpenAITutor={handleOpenAITutor}
                    />
                  </div>
                </SubscriptionPaywallGate>
              )}

              {activeTab === 'video_learning' && (
                <SubscriptionPaywallGate
                  featureTitle="ምስላዊ ትምህርት (Visual Learning)"
                  onNavigateToPayment={() => setActiveTab('subscription_payment')}
                  onOpenFeedback={() => setIsFeedbackModalOpen(true)}
                >
                  <div className="p-4 sm:p-6 lg:p-8">
                    <VideoLearningView
                      subject={currentSubject}
                      grade={selectedGrade}
                      onOpenAITutor={handleOpenAITutor}
                      onExit={() => setActiveTab('lesson')}
                    />
                  </div>
                </SubscriptionPaywallGate>
              )}

              {activeTab === 'student_review' && (
                <StudentLearningReviewView
                  subject={currentSubject}
                  grade={selectedGrade}
                  onOpenAITutor={handleOpenAITutor}
                  onGoToVisualLearning={() => setActiveTab('video_learning')}
                  onGoToTopic={(topicId) => {
                    setSelectedTopicId(topicId);
                    setActiveTab('lesson');
                  }}
                />
              )}

              {activeTab === 'supplementary' && (
                <SubscriptionPaywallGate
                  featureTitle="አጋዥ መጽሐፍት (Supplementary Books)"
                  onNavigateToPayment={() => setActiveTab('subscription_payment')}
                  onOpenFeedback={() => setIsFeedbackModalOpen(true)}
                >
                  <div className="p-4 sm:p-6 lg:p-8">
                    <SupplementaryBooksView
                      subject={currentSubject}
                      grade={selectedGrade}
                      onOpenAITutor={handleOpenAITutor}
                      onExit={() => setActiveTab('lesson')}
                    />
                  </div>
                </SubscriptionPaywallGate>
              )}

              {activeTab === 'flashcards' && (
                <SubscriptionPaywallGate
                  featureTitle="የቃላትና ፅንሰ-ሃሳብ ፍላሽካርዶች (Flashcards)"
                  onNavigateToPayment={() => setActiveTab('subscription_payment')}
                  onOpenFeedback={() => setIsFeedbackModalOpen(true)}
                >
                  <FlashcardView
                    topic={currentTopic}
                    subject={currentSubject}
                  />
                </SubscriptionPaywallGate>
              )}

              {activeTab === 'quiz' && (
                <SubscriptionPaywallGate
                  featureTitle="የዕውቀት መፈተሻ ጥያቄዎች (Quizzes)"
                  onNavigateToPayment={() => setActiveTab('subscription_payment')}
                  onOpenFeedback={() => setIsFeedbackModalOpen(true)}
                >
                  <QuizView
                    topic={currentTopic}
                    subject={currentSubject}
                  />
                </SubscriptionPaywallGate>
              )}
            </div>
          </main>
        </div>

        {/* Footer info bar */}
        <footer
          id="app-footer"
          className="border-t-[1.5px] border-[#38332D] bg-[#F2ECE0] px-4 py-2.5 text-center text-xs text-[#5A5143] flex flex-col md:flex-row items-center justify-between gap-2"
        >
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            <span className="font-serif-ethiopic font-bold text-[#1E1B18]">
              {t.footerTitle}
            </span>
            <span className="text-[#877C6A] hidden sm:inline">•</span>
            <span className="font-serif-ethiopic">{t.footerSubtitle}</span>
            <span className="text-[#877C6A] hidden sm:inline">•</span>
            <span className="inline-flex items-center gap-1 font-semibold text-stone-800 bg-[#E8DFC8] px-2 py-0.5 rounded border border-[#D5C9AC]">
              <span>👑 Sole Super Admin:</span>
              <span className="font-bold text-stone-900">Nuriye Ahmed Adem</span>
            </span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-[#7A705E] font-mono">
            <a
              href="tel:0910097862"
              className="hover:text-emerald-800 transition-colors"
            >
              📞 0910097862
            </a>
            <span className="text-stone-400">|</span>
            <a
              href="mailto:mejennur669@gmail.com"
              className="hover:text-emerald-800 transition-colors"
            >
              ✉️ mejennur669@gmail.com
            </a>
          </div>
        </footer>
      </div>

      {/* Interactive AI Chapter Tutor Modal */}
      <AIChapterTutorModal
        isOpen={aiTutorState.isOpen}
        onClose={() => setAiTutorState((prev) => ({ ...prev, isOpen: false }))}
        subject={currentSubject}
        grade={selectedGrade}
        chapterTitle={aiTutorState.chapterTitle || currentTopic.lessonTitle}
        initialMode={aiTutorState.mode}
      />

      {/* New Ethiopian Curriculum Guide Modal */}
      <NewCurriculumModal
        isOpen={isNewCurriculumOpen}
        onClose={() => setIsNewCurriculumOpen(false)}
        onSelectStream={(stream) => setSelectedStream(stream)}
      />

      {/* All Subjects & Grades PDF Textbooks Library Modal */}
      <AllTextbooksModal
        isOpen={isAllTextbooksOpen}
        onClose={() => setIsAllTextbooksOpen(false)}
        subjects={currentCurriculum}
        onSelectSubjectAndGrade={handleSelectSubjectAndGradeForTextbook}
      />

      {/* Completion Checklist Modal */}
      <CourseProgressModal
        isOpen={isChecklistOpen}
        onClose={() => setIsChecklistOpen(false)}
        subjects={currentCurriculum}
        onSelectTopic={handleSelectTopicDirect}
        onOpenCertificate={() => setIsCertificateOpen(true)}
      />

      {/* Course Completion & Mastery Certificate Modal */}
      <CompletionCertificateModal
        isOpen={isCertificateOpen}
        onClose={() => setIsCertificateOpen(false)}
        selectedGrade={selectedGrade}
        subjects={currentCurriculum}
        completedCount={overall.completedTopics}
        totalTopics={overall.totalTopics}
      />

      {/* User Authentication Modal */}
      <AuthModal />

      {/* User System Feedback Modal (Part 14) */}
      <SystemFeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
      />

      {/* Real-time Notification In-App Toast */}
      <NotificationToast />

      {/* System Modules Dropdown Drawer matching Screenshot style */}
      <SystemModulesDropdownDrawer
        isOpen={isModulesDropdownOpen}
        onClose={() => setIsModulesDropdownOpen(false)}
        activeTab={activeTab}
        onSelectTab={(tab) => {
          handleTabChange(tab);
          setIsModulesDropdownOpen(false);
        }}
        isSuperAdmin={isOwnerSuperAdmin}
        userEmail={userProfile?.email}
        onOpenDirectPayment={() => {
          setIsModulesDropdownOpen(false);
          setIsDirectPaymentModalOpen(true);
        }}
        onOpenResearch={() => {
          setActiveTab('supplementary');
          setIsModulesDropdownOpen(false);
        }}
        onOpenSettings={() => {
          setIsModulesDropdownOpen(false);
          setSettingsTab('security');
          setIsSettingsOpen(true);
        }}
      />

      {/* Direct In-System Payment Modal with Telebirr 0910097862 and CBE 1000382883776 */}
      <DirectSystemPaymentModal
        isOpen={isDirectPaymentModalOpen}
        onClose={() => setIsDirectPaymentModalOpen(false)}
        selectedGrade={selectedGrade}
        onPaymentComplete={() => {
          setActiveTab('student_app');
        }}
      />

      {/* Comprehensive System Settings Modal (Part 18 Mandate) */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        initialTab={settingsTab}
        onOpenRecovery={() => {
          setIsSettingsOpen(false);
        }}
        onOpenSubscription={() => {
          setIsSettingsOpen(false);
          setIsDirectPaymentModalOpen(true);
        }}
      />

      {/* 3-Screen Frontend Gateway Modal (Welcome -> Language & Grade -> Payment & Login) */}
      <FrontendGatewayModal
        isOpen={isGatewayOpen}
        onClose={() => setIsGatewayOpen(false)}
        selectedGrade={selectedGrade}
        onSelectGrade={handleSelectGrade}
        selectedStream={selectedStream}
        onSelectStream={(stream) => {
          setSelectedStream(stream);
          localStorage.setItem('nur_selected_stream', stream);
        }}
        onDirectPaymentOpen={() => {
          setIsGatewayOpen(false);
          setIsDirectPaymentModalOpen(true);
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <SubscriptionProvider>
          <ProgressProvider>
            <NotificationProvider>
              <OfflineSyncProvider>
                <GamificationProvider>
                  <AuthGate>
                    <TutorialAppContent />
                  </AuthGate>
                </GamificationProvider>
              </OfflineSyncProvider>
            </NotificationProvider>
          </ProgressProvider>
        </SubscriptionProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
