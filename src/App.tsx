import { useState, useMemo } from 'react';
import { Grade, ActiveTab } from './types';
import { getCurriculum } from './data/curriculumData';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { TopicChips } from './components/TopicChips';
import { TabBar } from './components/TabBar';
import { LessonView } from './components/LessonView';
import { FlashcardView } from './components/FlashcardView';
import { QuizView } from './components/QuizView';

function TutorialAppContent() {
  const { language, t } = useLanguage();

  // Application State
  const [selectedGrade, setSelectedGrade] = useState<Grade>(9);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('math');
  const [activeTab, setActiveTab] = useState<ActiveTab>('lesson');

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

  return (
    <div className="min-h-screen bg-[#FAF6EC] text-[#24211E] py-3 sm:py-6 px-2 sm:px-4 md:px-6 flex flex-col items-center justify-start">
      {/* Main Container with 1.5px solid dark notebook border */}
      <div
        id="app-main-frame"
        className="w-full max-w-6xl border-[1.5px] border-[#38332D] bg-[#FAF6EC] shadow-sm flex flex-col overflow-hidden"
      >
        {/* Top Header */}
        <Header
          selectedGrade={selectedGrade}
          onSelectGrade={handleSelectGrade}
        />

        {/* Workspace: Sidebar + Content */}
        <div className="flex flex-col md:flex-row flex-1 min-h-[620px]">
          {/* Left Sidebar */}
          <Sidebar
            subjects={currentCurriculum}
            selectedSubjectId={currentSubject.id}
            onSelectSubject={handleSelectSubject}
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

            {/* 3 Tabs Header: Lesson | Flashcards | Quiz */}
            <TabBar
              activeTab={activeTab}
              onChangeTab={setActiveTab}
              subject={currentSubject}
            />

            {/* Tab Contents */}
            <div className="flex-1 overflow-y-auto bg-[#FAF6EC]">
              {activeTab === 'lesson' && (
                <LessonView
                  topic={currentTopic}
                  subject={currentSubject}
                  onChangeTab={setActiveTab}
                />
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
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <TutorialAppContent />
    </LanguageProvider>
  );
}
