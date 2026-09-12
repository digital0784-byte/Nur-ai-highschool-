import React, { useState } from 'react';
import {
  Award,
  Flame,
  Target,
  BookOpen,
  TrendingUp,
  Users,
  Sparkles,
  Zap,
  CheckCircle2,
  PlayCircle,
  HelpCircle,
} from 'lucide-react';
import { useGamification } from '../../context/GamificationContext';
import { useLanguage } from '../../context/LanguageContext';
import { SupportedLanguage } from '../../types/curriculumEngine';
import { XPLevelHeaderCard } from './XPLevelHeaderCard';
import { LearningStreakCard } from './LearningStreakCard';
import { DailyGoalsCard } from './DailyGoalsCard';
import { BadgesGrid } from './BadgesGrid';
import { SubjectProgressSection } from './SubjectProgressSection';
import { PersonalMilestonesCard } from './PersonalMilestonesCard';
import { AdaptiveMotivationBanner } from './AdaptiveMotivationBanner';
import { ClassLeaderboardCard } from './ClassLeaderboardCard';
import { GamificationVerificationModal } from './GamificationVerificationModal';

export const GamificationDashboardView: React.FC = () => {
  const {
    profile,
    streak,
    allBadges,
    earnedBadgeIds,
    dailyGoals,
    milestones,
    leaderboard,
    adaptiveMotivation,
    awardLessonXP,
    awardQuizXP,
    awardExerciseXP,
    progressDailyGoal,
    updateStreak,
    refreshGamification,
    runVerificationSuite,
  } = useGamification();

  const { language } = useLanguage();
  const currentLang = (['en', 'am', 'om', 'ti'].includes(language) ? language : 'am') as SupportedLanguage;

  const [activeTab, setActiveTab] = useState<
    'all' | 'badges' | 'streak' | 'goals' | 'subjects' | 'milestones' | 'board'
  >('all');
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [optOutBoard, setOptOutBoard] = useState(profile?.optOutLeaderboard || false);
  const [demoActionFeedback, setDemoActionFeedback] = useState<string | null>(null);

  // Quick Action Handler for demonstration of real XP earning
  const handleQuickEarn = async (type: 'lesson' | 'quiz' | 'exercise') => {
    if (type === 'lesson') {
      const topicId = `rel_func_${Date.now()}`;
      await awardLessonXP(topicId, 'Relations & Functions Lesson');
      setDemoActionFeedback(
        currentLang === 'am'
          ? '🎉 +50 XP ተሸልመዋል! የትምህርት ማጠናቀቅ ባጅ መስፈርት ተመዝግቧል።'
          : '🎉 +50 XP Awarded! Lesson completion criteria logged.'
      );
    } else if (type === 'quiz') {
      await awardQuizXP(`quiz_unit1_${Date.now()}`, 10, 10, true);
      setDemoActionFeedback(
        currentLang === 'am'
          ? '🏆 +100 XP ተሸልመዋል! 100% የፈተና ውጤት እና የውጤት መሻሻል ተመዝግቧል።'
          : '🏆 +100 XP Awarded! 100% quiz score and improvement milestone recorded.'
      );
    } else if (type === 'exercise') {
      await awardExerciseXP(`ex_${Date.now()}`);
      setDemoActionFeedback(
        currentLang === 'am'
          ? '⚡ +30 XP ተሸልመዋል! የልምምድ ጥያቄዎች ግብዎ ወደፊት አድጓል።'
          : '⚡ +30 XP Awarded! Practice questions goal updated.'
      );
    }
    setTimeout(() => setDemoActionFeedback(null), 4000);
  };

  return (
    <div
      id="gamification-dashboard-container"
      className="max-w-6xl mx-auto px-4 py-6 sm:py-8 font-sans"
    >
      {/* Top Banner & Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-bold tracking-widest text-[#7A705E]">
              NUR AI High School • Part 11
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 font-bold">
              Motivation Engine
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif-ethiopic text-[#1E1B18]">
            {currentLang === 'am'
              ? 'የትምህርት ተነሳሽነትና ማበረታቻ ማዕከል'
              : currentLang === 'om'
              ? 'Giddu-gala Kaka\'umsa Barnootaa'
              : currentLang === 'ti'
              ? 'ማእኸል ናይ ትምህርቲ ድራኸ'
              : 'Student Motivation & Learning Engine'}
          </h1>
          <p className="text-xs sm:text-sm text-[#5A5143] mt-1 max-w-2xl font-serif-ethiopic">
            {currentLang === 'am'
              ? 'ያለአላስፈላጊ ጫና እና ፉክክር ተከታታይ የትምህርት ጥረትን፣ ክህሎትን እና የግል እድገትን በ XP፣ ደረጃዎች እና ባጆች የሚያበረታታ ስርዓት።'
              : 'Fosters continuous learning habits, real topic mastery, and personal improvement through verified XP, dedication levels, and badges.'}
          </p>
        </div>

        {/* Quick Testing Actions Bar */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleQuickEarn('lesson')}
            className="flex items-center gap-1 px-3 py-1.5 bg-[#FAF6EC] hover:bg-[#F2ECE0] text-[#38332D] border border-[#38332D] text-xs font-bold rounded-lg shadow-2xs cursor-pointer active:scale-95"
            title="Award verified lesson XP"
          >
            <PlayCircle className="w-3.5 h-3.5 text-blue-600" />
            <span>+50 XP {currentLang === 'am' ? 'ትምህርት' : 'Lesson'}</span>
          </button>
          <button
            onClick={() => handleQuickEarn('quiz')}
            className="flex items-center gap-1 px-3 py-1.5 bg-[#FAF6EC] hover:bg-[#F2ECE0] text-[#38332D] border border-[#38332D] text-xs font-bold rounded-lg shadow-2xs cursor-pointer active:scale-95"
            title="Award verified quiz XP"
          >
            <Award className="w-3.5 h-3.5 text-amber-600" />
            <span>+100 XP {currentLang === 'am' ? 'ፈተና' : 'Quiz'}</span>
          </button>
          <button
            onClick={() => handleQuickEarn('exercise')}
            className="flex items-center gap-1 px-3 py-1.5 bg-[#FAF6EC] hover:bg-[#F2ECE0] text-[#38332D] border border-[#38332D] text-xs font-bold rounded-lg shadow-2xs cursor-pointer active:scale-95"
            title="Award verified exercise practice XP"
          >
            <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>+30 XP {currentLang === 'am' ? 'ልምምድ' : 'Exercise'}</span>
          </button>
        </div>
      </div>

      {/* Floating Demo Feedback Notice */}
      {demoActionFeedback && (
        <div className="mb-4 p-3 rounded-xl bg-emerald-100 border border-emerald-400 text-emerald-950 text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>{demoActionFeedback}</span>
        </div>
      )}

      {/* Adaptive Motivation Banner (Requirement 12) */}
      <AdaptiveMotivationBanner
        motivation={adaptiveMotivation}
        language={currentLang}
        onAction={(type) => {
          if (type === 'quick_practice') handleQuickEarn('exercise');
          else if (type === 'review_weak_topic') handleQuickEarn('lesson');
          else handleQuickEarn('lesson');
        }}
      />

      {/* XP & Dedication Level Header Card (Requirements 1 & 2) */}
      <XPLevelHeaderCard
        profile={profile}
        language={currentLang}
        onRunTestFlow={() => setShowVerificationModal(true)}
      />

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-4 scrollbar-none border-b border-[#DDD3BF]">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap cursor-pointer transition-all flex items-center gap-1.5 ${
            activeTab === 'all'
              ? 'bg-[#38332D] text-[#FAF6EC] shadow-xs'
              : 'text-[#5A5143] hover:bg-[#EAE2D0]'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{currentLang === 'am' ? 'አጠቃላይ እይታ' : 'Full Overview'}</span>
        </button>

        <button
          onClick={() => setActiveTab('badges')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap cursor-pointer transition-all flex items-center gap-1.5 ${
            activeTab === 'badges'
              ? 'bg-[#38332D] text-[#FAF6EC] shadow-xs'
              : 'text-[#5A5143] hover:bg-[#EAE2D0]'
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>{currentLang === 'am' ? 'ባጆች' : 'Badges'} ({earnedBadgeIds.length}/{allBadges.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('streak')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap cursor-pointer transition-all flex items-center gap-1.5 ${
            activeTab === 'streak'
              ? 'bg-[#38332D] text-[#FAF6EC] shadow-xs'
              : 'text-[#5A5143] hover:bg-[#EAE2D0]'
          }`}
        >
          <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-400" />
          <span>{currentLang === 'am' ? 'ተከታታይ ቀናት' : 'Learning Streak'} ({streak?.currentStreak || 1}d)</span>
        </button>

        <button
          onClick={() => setActiveTab('goals')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap cursor-pointer transition-all flex items-center gap-1.5 ${
            activeTab === 'goals'
              ? 'bg-[#38332D] text-[#FAF6EC] shadow-xs'
              : 'text-[#5A5143] hover:bg-[#EAE2D0]'
          }`}
        >
          <Target className="w-3.5 h-3.5" />
          <span>{currentLang === 'am' ? 'ዕለታዊ ግቦች' : 'Daily Goals'}</span>
        </button>

        <button
          onClick={() => setActiveTab('subjects')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap cursor-pointer transition-all flex items-center gap-1.5 ${
            activeTab === 'subjects'
              ? 'bg-[#38332D] text-[#FAF6EC] shadow-xs'
              : 'text-[#5A5143] hover:bg-[#EAE2D0]'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>{currentLang === 'am' ? 'የትምህርት ዓይነቶች' : 'Subject Progress'}</span>
        </button>

        <button
          onClick={() => setActiveTab('milestones')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap cursor-pointer transition-all flex items-center gap-1.5 ${
            activeTab === 'milestones'
              ? 'bg-[#38332D] text-[#FAF6EC] shadow-xs'
              : 'text-[#5A5143] hover:bg-[#EAE2D0]'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>{currentLang === 'am' ? 'የግል መሻሻሎች' : 'Personal Milestones'}</span>
        </button>

        <button
          onClick={() => setActiveTab('board')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap cursor-pointer transition-all flex items-center gap-1.5 ${
            activeTab === 'board'
              ? 'bg-[#38332D] text-[#FAF6EC] shadow-xs'
              : 'text-[#5A5143] hover:bg-[#EAE2D0]'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>{currentLang === 'am' ? 'የጥናት ቦርድ' : 'Study Board'}</span>
        </button>
      </div>

      {/* Main Tab Content */}
      <div className="space-y-5">
        {/* Full Overview Tab */}
        {activeTab === 'all' && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <LearningStreakCard
                streak={streak}
                language={currentLang}
                onRefreshStreak={updateStreak}
              />
              <DailyGoalsCard
                goals={dailyGoals}
                language={currentLang}
                onQuickAction={(type) => {
                  if (type === 'complete_lesson') handleQuickEarn('lesson');
                  else if (type === 'take_quiz') handleQuickEarn('quiz');
                  else handleQuickEarn('exercise');
                }}
              />
            </div>

            <BadgesGrid
              allBadges={allBadges}
              earnedBadgeIds={earnedBadgeIds}
              language={currentLang}
            />

            <PersonalMilestonesCard
              milestones={milestones}
              language={currentLang}
            />

            <SubjectProgressSection
              language={currentLang}
            />

            <ClassLeaderboardCard
              entries={leaderboard}
              language={currentLang}
              optOut={optOutBoard}
              onToggleOptOut={(optOut) => setOptOutBoard(optOut)}
            />
          </>
        )}

        {/* Badges Tab */}
        {activeTab === 'badges' && (
          <BadgesGrid
            allBadges={allBadges}
            earnedBadgeIds={earnedBadgeIds}
            language={currentLang}
          />
        )}

        {/* Streak Tab */}
        {activeTab === 'streak' && (
          <LearningStreakCard
            streak={streak}
            language={currentLang}
            onRefreshStreak={updateStreak}
          />
        )}

        {/* Goals Tab */}
        {activeTab === 'goals' && (
          <DailyGoalsCard
            goals={dailyGoals}
            language={currentLang}
            onQuickAction={(type) => {
              if (type === 'complete_lesson') handleQuickEarn('lesson');
              else if (type === 'take_quiz') handleQuickEarn('quiz');
              else handleQuickEarn('exercise');
            }}
          />
        )}

        {/* Subjects Tab */}
        {activeTab === 'subjects' && (
          <SubjectProgressSection
            language={currentLang}
          />
        )}

        {/* Milestones Tab */}
        {activeTab === 'milestones' && (
          <PersonalMilestonesCard
            milestones={milestones}
            language={currentLang}
          />
        )}

        {/* Study Board Tab */}
        {activeTab === 'board' && (
          <ClassLeaderboardCard
            entries={leaderboard}
            language={currentLang}
            optOut={optOutBoard}
            onToggleOptOut={(optOut) => setOptOutBoard(optOut)}
          />
        )}
      </div>

      {/* Verification Test Modal */}
      <GamificationVerificationModal
        isOpen={showVerificationModal}
        onClose={() => setShowVerificationModal(false)}
        onRunTest={runVerificationSuite}
        language={currentLang}
      />
    </div>
  );
};
