import { GradeLevel, SupportedLanguage } from './curriculumEngine';

export type { SupportedLanguage };

export type XPActivityType =
  | 'lesson_complete'
  | 'exercise_complete'
  | 'quiz_passed'
  | 'quiz_score_improved'
  | 'revision_complete'
  | 'streak_maintained'
  | 'recommended_topic_complete'
  | 'photo_solved'
  | 'voice_session_completed'
  | 'badge_awarded'
  | 'daily_goal_completed'
  | 'bonus';

export interface XPTransaction {
  id: string;
  userId: string;
  type: XPActivityType;
  sourceId: string; // unique reference to prevent duplicate rewards e.g. "lesson_math-g9-u1-t1"
  amount: number;
  createdAt: string;
  verified: boolean;
  reason?: string;
  metadata?: Record<string, any>;
}

export interface LearningLevel {
  level: number;
  title: Record<SupportedLanguage, string>;
  minXp: number;
  maxXp: number;
  badgeIcon: string;
  perk: Record<SupportedLanguage, string>;
  description: Record<SupportedLanguage, string>;
}

export type BadgeCategory =
  | 'starter'
  | 'quiz'
  | 'streak'
  | 'subject'
  | 'mastery'
  | 'consistency';

export interface BadgeItem {
  id: string;
  code: string;
  title: Record<SupportedLanguage, string>;
  description: Record<SupportedLanguage, string>;
  category: BadgeCategory;
  xpBonus: number;
  iconName: string;
  colorHex: string;
  requiredMetric: {
    type:
      | 'first_lesson'
      | 'first_quiz'
      | 'quiz_master'
      | 'streak_7'
      | 'streak_30'
      | 'subject_explorer'
      | 'topic_master'
      | 'improvement_champion'
      | 'problem_solver'
      | 'consistent_learner';
    targetCount: number;
  };
}

export interface StudentBadge {
  id: string;
  userId: string;
  badgeId: string;
  earnedAt: string;
  verified: boolean;
  triggerSource: string;
}

export interface LearningStreak {
  id: string;
  userId: string;
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string; // YYYY-MM-DD
  historyDates: string[]; // List of YYYY-MM-DD dates where activity occurred
  freezeCount: number; // Forgiving streak mechanism
  gracePeriodUsed: boolean;
  updatedAt: string;
}

export type DailyGoalType =
  | 'complete_lesson'
  | 'practice_questions'
  | 'review_weak_topic'
  | 'take_quiz';

export interface DailyGoal {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  type: DailyGoalType;
  title: Record<SupportedLanguage, string>;
  description: Record<SupportedLanguage, string>;
  targetCount: number;
  currentCount: number;
  isCompleted: boolean;
  xpReward: number;
  subjectId?: string;
  topicId?: string;
  completedAt?: string;
}

export type MilestoneType =
  | 'score_improved'
  | 'topics_mastered_weekly'
  | 'weekly_goal_completed'
  | 'streak_record'
  | 'subject_mastery';

export interface PersonalMilestone {
  id: string;
  userId: string;
  type: MilestoneType;
  title: Record<SupportedLanguage, string>;
  message: Record<SupportedLanguage, string>;
  metricValue: number;
  achievedAt: string;
  acknowledged: boolean;
  subjectId?: string;
}

export interface SubjectGamificationProgress {
  subjectId: string;
  subjectName: string;
  stream?: string;
  unitsCompleted: number;
  totalUnits: number;
  topicsMastered: number;
  totalTopics: number;
  quizPerformanceAverage: number;
  learningProgressPercentage: number;
  badgeUnlocked?: boolean;
}

export interface GamificationProfile {
  userId: string;
  totalXp: number;
  currentLevel: number;
  currentLevelTitle: Record<SupportedLanguage, string>;
  levelProgress: number; // 0 to 100
  xpInCurrentLevel: number;
  xpForNextLevel: number;
  currentStreakDays: number;
  longestStreakDays: number;
  lastActiveDate: string;
  totalLessonsCompleted: number;
  totalExercisesCompleted: number;
  totalQuizzesPassed: number;
  totalRevisionsCompleted: number;
  badgesCount: number;
  milestonesCount: number;
  optOutLeaderboard: boolean;
  anonymousAlias: string; // e.g. "Scholar #7481"
  cachedAt?: string;
  updatedAt: string;
}

export interface LeaderboardEntry {
  id: string;
  rank: number;
  alias: string;
  level: number;
  levelTitle: string;
  weeklyXp: number;
  streakDays: number;
  isCurrentUser: boolean;
}

export interface AdaptiveMotivationState {
  tone: 'encouraging' | 'celebrating' | 'supportive_revision' | 'steady_pace';
  headline: Record<SupportedLanguage, string>;
  subtext: Record<SupportedLanguage, string>;
  suggestedAction: {
    type: 'review_weak_topic' | 'next_lesson' | 'quick_practice' | 'take_break';
    subjectId?: string;
    topicId?: string;
    topicTitle?: string;
  };
}

export interface GamificationVerificationStep {
  stepId: string;
  name: string;
  status: 'pending' | 'running' | 'passed' | 'failed';
  details: string;
  timestamp: string;
}

export interface GamificationVerificationResult {
  success: boolean;
  flowName: string;
  executedAt: string;
  totalSteps: number;
  passedSteps: number;
  durationMs: number;
  steps: GamificationVerificationStep[];
  updatedProfile?: GamificationProfile;
}
