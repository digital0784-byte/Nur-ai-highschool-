import { GradeLevel, DifficultyLevel } from './curriculumEngine';
import { LanguageCode } from '../types';

export type OfflineContentType =
  | 'unit'
  | 'lesson'
  | 'topic'
  | 'examples'
  | 'activities'
  | 'exercises'
  | 'review'
  | 'quiz';

export interface OfflineDownloadableItem {
  id: string; // unique ID e.g. "unit-math-g9-u1" or "lesson-math-g9-u1-s1-l1"
  type: OfflineContentType;
  subjectId: string;
  subjectTitle: {
    en: string;
    am: string;
    om?: string;
    ti?: string;
  };
  grade: GradeLevel;
  unitNumber: number;
  unitTitle: {
    en: string;
    am: string;
    om?: string;
    ti?: string;
  };
  lessonId?: string;
  lessonNumber?: string;
  lessonTitle?: {
    en: string;
    am: string;
    om?: string;
    ti?: string;
  };
  topicId?: string;
  title: {
    en: string;
    am: string;
    om?: string;
    ti?: string;
  };
  sizeBytes: number;
  downloadedAt: string;
  lastAccessedAt: string;
  payload: any; // Content data object
}

export type SyncStatusState = 'online' | 'offline' | 'syncing' | 'synced' | 'sync_failed';

export type SyncActionType =
  | 'sync_progress'
  | 'sync_mastery'
  | 'sync_quiz_attempt'
  | 'sync_lesson_completion'
  | 'sync_learning_activity'
  | 'sync_profile';

export interface SyncQueueTask {
  id: string; // Idempotent key
  type: SyncActionType;
  userId: string;
  payload: any;
  clientTimestamp: string;
  clientVersion: number;
  status: 'pending' | 'syncing' | 'synced' | 'failed';
  retryCount: number;
  nextRetryAt?: number;
  lastError?: string;
  syncedAt?: string;
}

export interface SyncConflictRecord {
  id: string;
  collection: string;
  docId: string;
  clientTimestamp: string;
  serverTimestamp?: string;
  resolution: 'kept_server' | 'kept_client' | 'merged';
  resolvedAt: string;
  reason: string;
  details?: any;
}

export interface LocalQuizAnswer {
  questionId: string;
  selectedAnswer: string | number | boolean;
  correctAnswer: string | number | boolean;
  isCorrect: boolean;
  timeSpentSeconds: number;
}

export interface LocalQuizAttempt {
  attemptId: string; // Unique deterministic ID
  userId: string;
  topicId: string;
  topicTitle: string;
  subjectId: string;
  grade: GradeLevel;
  score: number;
  totalQuestions: number;
  percentage: number;
  answers: LocalQuizAnswer[];
  completedAt: string;
  synced: boolean;
}

export interface LocalLessonCompletion {
  completionId: string; // Unique deterministic ID
  userId: string;
  lessonId: string;
  topicId: string;
  subjectId: string;
  grade: GradeLevel;
  completedAt: string;
  timeSpentSeconds: number;
  synced: boolean;
}

export interface LocalLearningActivity {
  activityId: string; // Unique deterministic ID
  userId: string;
  type: 'lesson_read' | 'quiz_taken' | 'exercise_done' | 'review_viewed' | 'practice_completed';
  subjectId: string;
  topicId: string;
  topicTitle: string;
  metadata?: Record<string, any>;
  timestamp: string;
  synced: boolean;
}

export interface StorageQuotaInfo {
  usedBytes: number;
  quotaBytes: number; // e.g. 50 MB budget for low-end device
  usagePercentage: number;
  cachedUnitsCount: number;
  cachedLessonsCount: number;
  cachedQuizzesCount: number;
  pendingSyncCount: number;
  lowDataMode: boolean;
}
