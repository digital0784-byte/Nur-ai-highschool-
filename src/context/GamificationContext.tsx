import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { useLanguage } from './LanguageContext';
import {
  GamificationProfile,
  LearningStreak,
  BadgeItem,
  DailyGoal,
  PersonalMilestone,
  LeaderboardEntry,
  AdaptiveMotivationState,
  GamificationVerificationResult,
} from '../types/gamification';
import { SupportedLanguage } from '../types/curriculumEngine';
import { BADGES_CATALOG, LEARNING_LEVELS } from '../data/gamificationData';
import { gamificationFirestore } from '../services/gamificationFirestore';

interface GamificationContextType {
  profile: GamificationProfile | null;
  streak: LearningStreak | null;
  allBadges: BadgeItem[];
  earnedBadgeIds: string[];
  dailyGoals: DailyGoal[];
  milestones: PersonalMilestone[];
  leaderboard: LeaderboardEntry[];
  adaptiveMotivation: AdaptiveMotivationState;
  loading: boolean;
  awardLessonXP: (topicId: string, lessonTitle: string) => Promise<boolean>;
  awardQuizXP: (quizId: string, score: number, total: number, isImprovement?: boolean) => Promise<boolean>;
  awardExerciseXP: (exerciseId: string) => Promise<boolean>;
  progressDailyGoal: (type: DailyGoal['type']) => Promise<void>;
  updateStreak: () => Promise<void>;
  refreshGamification: () => Promise<void>;
  runVerificationSuite: () => Promise<GamificationVerificationResult>;
}

const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

export const GamificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { userProfile } = useAuth();
  const { language } = useLanguage();
  const currentLang = (['en', 'am', 'om', 'ti'].includes(language) ? language : 'am') as SupportedLanguage;

  const currentUserId = userProfile?.uid || 'guest_student';

  const [profile, setProfile] = useState<GamificationProfile | null>(() =>
    gamificationFirestore.getCachedProfile(currentUserId)
  );
  const [streak, setStreak] = useState<LearningStreak | null>(null);
  const [earnedBadgeIds, setEarnedBadgeIds] = useState<string[]>([]);
  const [dailyGoals, setDailyGoals] = useState<DailyGoal[]>([]);
  const [milestones, setMilestones] = useState<PersonalMilestone[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [prof, strk, badges, goals, lb] = await Promise.all([
        gamificationFirestore.getOrInitProfile(currentUserId),
        gamificationFirestore.getLearningStreak(currentUserId),
        gamificationFirestore.getEarnedBadgeIds(currentUserId),
        gamificationFirestore.getDailyGoals(currentUserId),
        gamificationFirestore.getPrivacySafeLeaderboard(currentUserId),
      ]);

      setProfile(prof);
      setStreak(strk);
      setEarnedBadgeIds(badges);
      setDailyGoals(goals);
      setLeaderboard(lb);
    } catch (e) {
      console.warn('[GamificationContext] Error loading initial gamification state:', e);
    } finally {
      setLoading(false);
    }
  }, [currentUserId]);

  useEffect(() => {
    loadData();
    const unsub = gamificationFirestore.subscribeToProfile(currentUserId, (updated) => {
      setProfile(updated);
    });
    return () => unsub();
  }, [currentUserId, loadData]);

  // Award Lesson XP
  const awardLessonXP = async (topicId: string, lessonTitle: string): Promise<boolean> => {
    const res = await gamificationFirestore.awardXP({
      userId: currentUserId,
      type: 'lesson_complete',
      sourceId: `lesson_${topicId}`,
      amount: 50,
      reason: `Completed lesson: ${lessonTitle}`,
      language: currentLang,
    });
    if (res.awarded) {
      setProfile(res.updatedProfile);
      if (res.newlyUnlockedBadges.length > 0) {
        setEarnedBadgeIds((prev) => [...new Set([...prev, ...res.newlyUnlockedBadges])]);
      }
      await gamificationFirestore.progressDailyGoal(currentUserId, 'complete_lesson', 1);
    }
    return res.awarded;
  };

  // Award Quiz XP
  const awardQuizXP = async (
    quizId: string,
    score: number,
    total: number,
    isImprovement: boolean = false
  ): Promise<boolean> => {
    const passed = score / total >= 0.6;
    if (!passed) return false;

    const baseAmount = 75;
    const bonus = Math.round((score / total) * 25);
    const totalAmount = baseAmount + bonus;

    const res = await gamificationFirestore.awardXP({
      userId: currentUserId,
      type: isImprovement ? 'quiz_score_improved' : 'quiz_passed',
      sourceId: `quiz_${quizId}_${Date.now()}`,
      amount: totalAmount,
      reason: `Scored ${score}/${total} on quiz`,
      metadata: {
        score,
        total,
        percentage: Math.round((score / total) * 100),
        improvementPct: isImprovement ? 20 : 0,
      },
      language: currentLang,
    });

    if (res.awarded) {
      setProfile(res.updatedProfile);
      if (res.newlyUnlockedBadges.length > 0) {
        setEarnedBadgeIds((prev) => [...new Set([...prev, ...res.newlyUnlockedBadges])]);
      }
      await gamificationFirestore.progressDailyGoal(currentUserId, 'take_quiz', 1);
    }
    return res.awarded;
  };

  // Award Exercise XP
  const awardExerciseXP = async (exerciseId: string): Promise<boolean> => {
    const res = await gamificationFirestore.awardXP({
      userId: currentUserId,
      type: 'exercise_complete',
      sourceId: `exercise_${exerciseId}_${Date.now()}`,
      amount: 30,
      reason: `Completed exercise practice`,
      language: currentLang,
    });
    if (res.awarded) {
      setProfile(res.updatedProfile);
      await gamificationFirestore.progressDailyGoal(currentUserId, 'practice_questions', 1);
    }
    return res.awarded;
  };

  // Progress daily goal
  const progressDailyGoal = async (type: DailyGoal['type']) => {
    const updated = await gamificationFirestore.progressDailyGoal(currentUserId, type, 1);
    setDailyGoals(updated);
  };

  // Update streak
  const updateStreak = async () => {
    const updated = await gamificationFirestore.updateLearningStreak(currentUserId);
    setStreak(updated);
  };

  // Run full verification suite
  const runVerificationSuite = async (): Promise<GamificationVerificationResult> => {
    const res = await gamificationFirestore.runFullGamificationVerificationFlow(
      currentUserId,
      currentLang
    );
    if (res.updatedProfile) {
      setProfile(res.updatedProfile);
    }
    await loadData();
    return res;
  };

  // Adaptive Motivation calculation
  const adaptiveMotivation = profile
    ? gamificationFirestore.getAdaptiveMotivation(
        profile,
        profile.totalQuizzesPassed > 0 ? 80 : 70,
        undefined,
        'Mathematics'
      )
    : {
        tone: 'encouraging' as const,
        headline: {
          en: 'Welcome to your learning journey!',
          am: 'እንኳን ወደ የመማር ጉዞዎ በደህና መጡ!',
          om: 'Baga nagaan dhuftan!',
          ti: 'ብደሓን መጻእኹም!',
        },
        subtext: {
          en: 'Every minute of study opens new doors to knowledge.',
          am: 'እያንዳንዱ የጥናት ደቂቃ ወደ አዲስ እውቀት በር ይከፍታል።',
          om: 'Daqiiqaan barnootaa hundi beekumsa dabala.',
          ti: 'ነፍሲ ወከፍ ናይ ጥናት ደቒቕ ሓደሽቲ ናይ ፍልጠት ማዕጾ ይኸፍት።',
        },
        suggestedAction: {
          type: 'next_lesson' as const,
        },
      };

  return (
    <GamificationContext.Provider
      value={{
        profile,
        streak,
        allBadges: BADGES_CATALOG,
        earnedBadgeIds,
        dailyGoals,
        milestones,
        leaderboard,
        adaptiveMotivation,
        loading,
        awardLessonXP,
        awardQuizXP,
        awardExerciseXP,
        progressDailyGoal,
        updateStreak,
        refreshGamification: loadData,
        runVerificationSuite,
      }}
    >
      {children}
    </GamificationContext.Provider>
  );
};

export function useGamification(): GamificationContextType {
  const context = useContext(GamificationContext);
  if (!context) {
    throw new Error('useGamification must be used within a GamificationProvider');
  }
  return context;
}
