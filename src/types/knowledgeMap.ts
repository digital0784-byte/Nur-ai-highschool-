import { Grade } from '../types';

export type MasteryStatus = 'NOT_STARTED' | 'LEARNING' | 'DEVELOPING' | 'MASTERED';

export type WeakTopicSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type WeakTopicStatus = 'ACTIVE' | 'RESOLVED';

export type AlertSeverity = 'INFO' | 'WARNING' | 'CRITICAL';

export type AlertType =
  | 'DECLINING_ACCURACY'
  | 'PREREQUISITE_GAP'
  | 'MISSED_PRACTICE'
  | 'REPEATED_QUIZ_FAILURES'
  | 'INACTIVITY'
  | 'EXAM_PREP_URGENT';

export type AlertStatus = 'ACTIVE' | 'RESOLVED' | 'ACKNOWLEDGED';

export type RecommendationType =
  | 'PREREQUISITE_REVISION'
  | 'WEAK_TOPIC_PRACTICE'
  | 'NEXT_LESSON'
  | 'EXAM_PREP_HIGH_PRIORITY'
  | 'MISSED_ACTIVITY';

export type RecommendationPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export type RecommendationStatus = 'PENDING' | 'COMPLETED' | 'DISMISSED';

export type LearningEventType =
  | 'LESSON_COMPLETION'
  | 'PRACTICE_ATTEMPT'
  | 'QUIZ_SUBMISSION'
  | 'EXAM_SUBMISSION'
  | 'MISTAKE_CORRECTION'
  | 'FLASHCARD_STUDY'
  | 'SIMULATION_INTERACTION';

export interface PrerequisiteRef {
  topicId: string;
  title: string;
  subject: string;
  grade: Grade;
  minRequiredScore: number;
}

export interface LearningOutcome {
  id: string;
  description: string;
  competencyLevel: 'BASIC' | 'INTERMEDIATE' | 'ADVANCED';
}

export interface KnowledgeTopicNode {
  id: string;
  grade: Grade;
  subject: string;
  unitNumber: number;
  unitTitle: string;
  sectionNumber?: number;
  sectionTitle?: string;
  lessonNumber: number;
  lessonTitle: string;
  topicTitle: string;
  learningOutcomes: LearningOutcome[];
  prerequisites: PrerequisiteRef[];
  advancedTopicIds?: string[];
  stream?: 'natural' | 'social' | 'common';
  isNationalExamPriority?: boolean; // For Grades 11-12 entrance prep
}

export interface StudentTopicMasteryRecord {
  id: string; // studentId_topicId
  studentId: string;
  grade: Grade;
  subject: string;
  unit: number;
  lesson: number;
  topic: string;
  topicTitle: string;
  masteryScore: number; // 0 - 100
  status: MasteryStatus;
  prerequisiteStatus: 'SATISFIED' | 'GAPS_EXIST' | 'NOT_APPLICABLE';
  lastActivityAt: string;
  lastAssessmentAt: string;
  updatedAt: string;
  accuracyRate: number; // 0 - 100
  completedLessonsCount: number;
  quizzesTakenCount: number;
  practiceAttemptsCount: number;
}

export interface WeakTopicRecord {
  id: string;
  studentId: string;
  topicId: string;
  topicTitle: string;
  subject: string;
  grade: Grade;
  severity: WeakTopicSeverity;
  evidence: {
    accuracyRate: number;
    failedAttemptsCount: number;
    lastFailedDate: string;
    missingPrerequisites?: string[];
    sampleMistakeConcept?: string;
  };
  detectedAt: string;
  resolvedAt?: string;
  status: WeakTopicStatus;
}

export interface PersonalizedRecommendationRecord {
  id: string;
  studentId: string;
  type: RecommendationType;
  topicId: string;
  topicTitle: string;
  subject: string;
  grade: Grade;
  title: string;
  reason: string;
  priority: RecommendationPriority;
  estimatedMinutes: number;
  actionUrl?: string;
  createdAt: string;
  status: RecommendationStatus;
}

export interface LearningAlertRecord {
  id: string;
  studentId: string;
  type: AlertType;
  severity: AlertSeverity;
  title: string;
  message: string;
  suggestedAction: string;
  evidence: {
    consecutiveFails?: number;
    accuracyDropPercent?: number;
    daysInactive?: number;
    topicId?: string;
    subject?: string;
  };
  createdAt: string;
  resolvedAt?: string;
  status: AlertStatus;
}

export interface VerifiedLearningEvent {
  id: string; // Idempotent unique event id
  studentId: string;
  eventType: LearningEventType;
  grade: Grade;
  subject: string;
  unitNumber: number;
  lessonNumber: number;
  topicId: string;
  topicTitle: string;
  score?: number; // 0 - 100
  isCorrect?: boolean;
  totalQuestions?: number;
  correctQuestions?: number;
  durationSeconds?: number;
  mistakeCorrected?: boolean;
  metadata?: Record<string, any>;
  timestamp: string;
  offlineSyncId?: string;
}

export interface PerformanceSnapshot {
  id: string;
  studentId: string;
  timeframe: 'daily' | 'weekly' | 'monthly';
  dateLabel: string;
  quizAccuracy: number; // 0 - 100
  examScoresAvg: number; // 0 - 100
  questionsCompleted: number;
  studyTimeMinutes: number;
  topicsMasteredCount: number;
  weakTopicsCount: number;
  learningStreak: number;
  completionRate: number; // 0 - 100
  updatedAt: string;
}

export interface StudentAnalyticsSummary {
  studentId: string;
  overallMasteryPercent: number;
  totalTopicsTracked: number;
  masteredTopicsCount: number;
  developingTopicsCount: number;
  learningTopicsCount: number;
  notStartedTopicsCount: number;
  activeWeakTopicsCount: number;
  criticalPrerequisiteGapsCount: number;
  subjectMasteryBreakdown: Record<string, {
    subjectName: string;
    masteryScore: number;
    topicsCount: number;
    masteredCount: number;
    weakCount: number;
  }>;
  aiPedagogicalAdvice: string[];
  activeAlerts: LearningAlertRecord[];
  topRecommendations: PersonalizedRecommendationRecord[];
  entranceExamReadiness?: {
    overallReadinessPercent: number;
    highPriorityWeakTopics: WeakTopicRecord[];
    prerequisiteGaps: PrerequisiteRef[];
    strongSubjects: string[];
    revisionFocusAreas: string[];
  };
}

export interface TeacherClassroomAnalytics {
  classId: string;
  className: string;
  grade: Grade;
  totalStudents: number;
  averageMasteryScore: number;
  studentsNeedingSupportCount: number;
  commonWeakTopics: {
    topicId: string;
    topicTitle: string;
    subject: string;
    affectedStudentsCount: number;
    averageScore: number;
  }[];
  atRiskStudents: {
    studentId: string;
    displayName: string;
    weakTopicsCount: number;
    averageScore: number;
    lastActive: string;
    primaryNeed: string;
  }[];
}

export interface SuperAdminAggregatedAnalytics {
  totalStudents: number;
  activeStudentsToday: number;
  activeStudentsThisWeek: number;
  gradeDistribution: Record<Grade, number>;
  averageMasteryBySubject: Record<string, number>;
  systemWideWeakTopics: {
    topicId: string;
    topicTitle: string;
    subject: string;
    grade: Grade;
    studentCount: number;
  }[];
  averageQuizScore: number;
  averageExamScore: number;
  criticalAlertsCount: number;
  overallCompletionRate: number;
}
