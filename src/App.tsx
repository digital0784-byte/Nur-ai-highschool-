import { useState, useMemo } from 'react';
import { Grade, ActiveTab, Topic, SubjectStream } from './types';
import { getCurriculum } from './data/curriculumData';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProgressProvider, useProgress } from './context/ProgressContext';
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
import { TeacherDashboardModal } from './components/TeacherDashboardModal';
import { StudentLearningReviewView } from './components/StudentLearningReviewView';
import { EthiopianCurriculumEngineView } from './components/EthiopianCurriculumEngineView';
import { EthiopianAITutorView } from './components/EthiopianAITutorView';
import { StudentAppScaffold } from './components/student/StudentAppScaffold';
import { AuthGate } from './components/AuthGate';

function TutorialAppContent() {
  const { language, t } = useLanguage();
  const { getOverallProgress } = useProgress();
  const { userProfile } = useAuth();

  // Application State
  const [selectedGrade, setSelectedGrade] = useState<Grade>(9);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('math');
  const [activeTab, setActiveTab] = useState<ActiveTab>('student_app');
  const [selectedStream, setSelectedStream] = useState<SubjectStream | 'all'>('all');

  // Modals state
  const [isChecklistOpen, setIsChecklistOpen] = useState<boolean>(false);
  const [isCertificateOpen, setIsCertificateOpen] = useState<boolean>(false);
  const [isAllTextbooksOpen, setIsAllTextbooksOpen] = useState<boolean>(false);
  const [isNewCurriculumOpen, setIsNewCurriculumOpen] = useState<boolean>(false);
  const [isTeacherDashboardOpen, setIsTeacherDashboardOpen] = useState<boolean>(false);

  // AI Tutor / Deep-Dive Modal State
  const [aiTutorState, setAiTutorState] = useState<{
    isOpen: boolean;
    chapterTitle: string;
    mode: 'analysis' | 'chat';
  }>({
    isOpen: false,
    chapterTitle: '',
    mode: 'analysis',
  });

  const handleOpenAITutor = (chapterTitle: string, mode: 'analysis' | 'chat' = 'analysis') => {
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
          onOpenTeacherDashboard={() => setIsTeacherDashboardOpen(true)}
        />

        {/* Workspace: Sidebar + Content */}
        <div className="flex flex-col md:flex-row flex-1 min-h-[620px]">
          {/* Left Sidebar */}
          <Sidebar
            subjects={currentCurriculum}
            selectedSubjectId={currentSubject.id}
            onSelectSubject={handleSelectSubject}
            selectedStream={selectedStream}
            onSelectStream={setSelectedStream}
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
              onChangeTab={setActiveTab}
              subject={currentSubject}
            />

            {/* Tab Contents */}
            <div className="flex-1 overflow-y-auto bg-[#FAF6EC]">
              {activeTab === 'student_app' && (
                <StudentAppScaffold
                  initialGrade={selectedGrade}
                  initialLanguage={language}
                />
              )}

              {activeTab === 'ai_tutor' && (
                <EthiopianAITutorView
                  currentSubject={currentSubject}
                  initialGrade={selectedGrade}
                />
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
                <LessonView
                  topic={currentTopic}
                  subject={currentSubject}
                  onChangeTab={setActiveTab}
                  onOpenAITutor={handleOpenAITutor}
                />
              )}

              {activeTab === 'textbook' && (
                <TextbookView
                  subject={currentSubject}
                  selectedGrade={selectedGrade}
                  onSelectGrade={handleSelectGrade}
                  onOpenAllTextbooksModal={() => setIsAllTextbooksOpen(true)}
                  onOpenAITutor={handleOpenAITutor}
                  onTakeObjectivesExam={() => setActiveTab('objectives_exam')}
                  onExit={() => setActiveTab('lesson')}
                />
              )}

              {activeTab === 'objectives_exam' && (
                <div className="p-4 sm:p-6 lg:p-8">
                  <ObjectivesExamView
                    subject={currentSubject}
                    grade={selectedGrade}
                    onOpenAITutor={handleOpenAITutor}
                  />
                </div>
              )}

              {activeTab === 'video_learning' && (
                <div className="p-4 sm:p-6 lg:p-8">
                  <VideoLearningView
                    subject={currentSubject}
                    grade={selectedGrade}
                    onOpenAITutor={handleOpenAITutor}
                    onExit={() => setActiveTab('lesson')}
                  />
                </div>
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
                <div className="p-4 sm:p-6 lg:p-8">
                  <SupplementaryBooksView
                    subject={currentSubject}
                    grade={selectedGrade}
                    onOpenAITutor={handleOpenAITutor}
                    onExit={() => setActiveTab('lesson')}
                  />
                </div>
              )}

              {activeTab === 'flashcards' && (
                <FlashcardView
                  topic={currentTopic}
                  subject={currentSubject}
                />
              )}

              {activeTab === 'quiz' && (
                <QuizView
                  topic={currentTopic}
                  subject={currentSubject}
                />
              )}
            </div>
          </main>
        </div>

        {/* Footer info bar */}
        <footer
          id="app-footer"
          className="border-t-[1.5px] border-[#38332D] bg-[#F2ECE0] px-4 py-2.5 text-center text-xs text-[#5A5143] flex flex-col sm:flex-row items-center justify-between gap-2"
        >
          <div className="flex items-center gap-2">
            <span className="font-serif-ethiopic font-bold text-[#1E1B18]">
              {t.footerTitle}
            </span>
            <span className="text-[#877C6A]">•</span>
            <span className="font-serif-ethiopic">{t.footerSubtitle}</span>
          </div>
          <div className="text-[11px] text-[#7A705E] font-serif-ethiopic">
            {t.footerStats}
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

      {/* Teacher / Educator Students Analytics Dashboard */}
      {userProfile?.role === 'teacher' && (
        <TeacherDashboardModal
          isOpen={isTeacherDashboardOpen}
          onClose={() => setIsTeacherDashboardOpen(false)}
          teacherProfile={userProfile}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <ProgressProvider>
          <AuthGate>
            <TutorialAppContent />
          </AuthGate>
        </ProgressProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
