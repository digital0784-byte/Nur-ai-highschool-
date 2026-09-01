import React from 'react';
import { ActiveTab, Subject } from '../types';
import { BookOpen, Layers, HelpCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface TabBarProps {
  activeTab: ActiveTab;
  onChangeTab: (tab: ActiveTab) => void;
  subject: Subject;
}

export const TabBar: React.FC<TabBarProps> = ({
  activeTab,
  onChangeTab,
  subject,
}) => {
  const { t } = useLanguage();

  const tabs: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'lesson', label: t.tabLesson, icon: <BookOpen className="w-4 h-4" /> },
    { id: 'flashcards', label: t.tabFlashcards, icon: <Layers className="w-4 h-4" /> },
    { id: 'quiz', label: t.tabQuiz, icon: <HelpCircle className="w-4 h-4" /> },
  ];

  return (
    <div
      id="main-tab-bar"
      className="flex border-b-[1.5px] border-[#38332D] bg-[#EDE6D4] px-3 sm:px-6 pt-2 gap-1 sm:gap-2 overflow-x-auto no-scrollbar"
      role="tablist"
      aria-label={t.appTitle}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            id={`tab-btn-${tab.id}`}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChangeTab(tab.id)}
            className={`flex items-center gap-2 px-3 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-bold border-t-[1.5px] border-l-[1.5px] border-r-[1.5px] transition-all cursor-pointer whitespace-nowrap relative -mb-[1.5px] ${
              isActive
                ? 'bg-[#FAF6EC] text-[#1E1B18] border-[#38332D] shadow-xs z-10'
                : 'bg-[#E3DAC4] text-[#5A5143] hover:bg-[#DCD2BB] border-transparent'
            }`}
            style={{
              borderTopColor: isActive ? subject.accentColor : undefined,
              borderTopWidth: isActive ? '3px' : undefined,
            }}
          >
            <span style={{ color: isActive ? subject.accentColor : '#665C4D' }}>
              {tab.icon}
            </span>
            <span className="font-serif-ethiopic">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};
