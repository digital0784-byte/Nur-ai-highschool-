import React from 'react';
import { ActiveTab, Subject } from '../types';
import {
  BookOpen,
  Layers,
  HelpCircle,
  Award,
  Video,
  Library,
  Bot,
  BrainCircuit,
  Sparkles,
  Smartphone,
  ShieldCheck,
  Lock,
  Camera,
  Flame,
  Search,
  Server,
  Compass,
  CreditCard,
  MessageSquare,
  GraduationCap,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useSubscription } from '../context/SubscriptionContext';

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
  const { isOwnerSuperAdmin } = useSubscription();

  const allTabs: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: string; superAdminOnly?: boolean }[] = [
    { id: 'academic_work_hub', label: t.tabAcademicWorkHub || 'የቤት ስራ፣ አሳይንመንትና ፕሮጀክት', icon: <Award className="w-4 h-4 text-emerald-600" />, badge: 'NEW AI' },
    { id: 'premium_learning_center', label: t.tabPremiumCenter || 'ፕሪሚየም የትምህርት ማዕከል', icon: <Sparkles className="w-4 h-4 text-amber-600" />, badge: '54 ETB' },
    { id: 'entrance_prep', label: t.tabEntrancePrep || 'የዩኒቨርሲቲ መግቢያ ፈተና', icon: <GraduationCap className="w-4 h-4 text-indigo-700" />, badge: 'PART 16' },
    { id: 'subscription_payment', label: t.tabSubscription || 'ክፍያና ሳብስክሪፕሽን', icon: <CreditCard className="w-4 h-4 text-emerald-700" />, badge: 'PART 14' },
    { id: 'system_feedback', label: t.tabSystemFeedback || 'የተጠቃሚ አስተያዬት', icon: <MessageSquare className="w-4 h-4 text-cyan-700" /> },
    { id: 'career_pathways', label: t.tabCareerPathways || 'የወደፊት ዓላማና ሙያ', icon: <Compass className="w-4 h-4 text-emerald-700" />, badge: 'PART 14' },
    { id: 'system_integration', label: t.tabSystemIntegration || 'የሥርዓት ውህደትና E2E ፈተና', icon: <Server className="w-4 h-4 text-emerald-800" />, badge: 'PART 13' },
    { id: 'smart_search', label: t.tabSmartSearch || 'ስማርት ፍለጋና ጥቆማ', icon: <Search className="w-4 h-4 text-emerald-700" />, badge: 'PART 12' },
    { id: 'gamification', label: t.tabGamification || 'የተማሪ ማበረታቻና ባጆች', icon: <Flame className="w-4 h-4 text-orange-600 fill-orange-500" />, badge: 'PART 11' },
    { id: 'photo_voice_tutor', label: t.tabPhotoVoice || 'ፎቶ ጥያቄ ፈቺና ድምፅ', icon: <Camera className="w-4 h-4 text-sky-600" />, badge: 'PART 10' },
    { id: 'assessment_engine', label: t.tabAssessmentEngine || 'የፈተናና ምዘና ሞተር', icon: <Award className="w-4 h-4 text-amber-600" />, badge: 'PART 9' },
    { id: 'security_fortress', label: t.tabSecurityFortress || 'ደህንነትና ፍቃዶች', icon: <Lock className="w-4 h-4 text-emerald-800" />, badge: 'PART 8' },
    { id: 'admin_dashboard', label: t.tabAdminDashboard || 'አስተዳደር ዳሽቦርድ', icon: <ShieldCheck className="w-4 h-4 text-emerald-700" />, badge: 'PART 15', superAdminOnly: true },
    { id: 'student_app', label: t.tabStudentApp || 'የተማሪ መተግበሪያ', icon: <Smartphone className="w-4 h-4 text-purple-700" />, badge: 'PART 4' },
    { id: 'ai_tutor', label: t.tabAiTutor || 'ኑር AI የግል አስተማሪ', icon: <Sparkles className="w-4 h-4 text-amber-700" />, badge: 'PART 3' },
    { id: 'curriculum_engine', label: t.tabCurriculumEngine || 'የስርዓተ-ትምህርት ኢንጅን', icon: <BrainCircuit className="w-4 h-4 text-indigo-700" />, badge: 'PART 2' },
    { id: 'lesson', label: t.tabLesson, icon: <BookOpen className="w-4 h-4" /> },
    { id: 'textbook', label: t.tabTextbook || 'የተማሪ መጽሐፍ', icon: <BookOpen className="w-4 h-4 text-emerald-700" /> },
    { id: 'objectives_exam', label: t.tabObjectivesExam || 'የቻፕተር ፈተና', icon: <Award className="w-4 h-4 text-amber-700" />, badge: 'AI' },
    { id: 'video_learning', label: t.tabVisualLearning || 'ምስላዊ ትምህርት', icon: <Video className="w-4 h-4 text-rose-700" /> },
    { id: 'student_review', label: t.tabStudentReview || 'የእኔ የመማሪያ ግምገማ', icon: <Bot className="w-4 h-4 text-purple-700" />, badge: 'AI' },
    { id: 'supplementary', label: t.tabSupplementary || 'አጋዥ መጽሐፍት', icon: <Library className="w-4 h-4 text-indigo-700" /> },
    { id: 'flashcards', label: t.tabFlashcards, icon: <Layers className="w-4 h-4" /> },
    { id: 'quiz', label: t.tabQuiz, icon: <HelpCircle className="w-4 h-4" /> },
  ];

  // Filter out super-admin-only tabs for normal students
  const tabs = allTabs.filter((tab) => !tab.superAdminOnly || isOwnerSuperAdmin);

  return (
    <div
      id="main-tab-bar"
      className="flex border-b-[1.5px] border-[#38332D] bg-[#EDE6D4] px-2 sm:px-4 pt-2 gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar"
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
            className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-2 sm:py-2.5 text-xs sm:text-xs font-bold border-t-[1.5px] border-l-[1.5px] border-r-[1.5px] transition-all cursor-pointer whitespace-nowrap relative -mb-[1.5px] ${
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
            {tab.badge && (
              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-200 text-amber-900 border border-amber-400 font-sans font-black">
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
