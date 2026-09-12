import { Grade } from '../types';

export type EntranceStream = 'natural' | 'social' | 'common';

export type EntranceLanguage = 'am' | 'en' | 'om' | 'ti';

export type QuestionDifficulty = 'easy' | 'medium' | 'hard' | 'advanced';

export type QuestionType =
  | 'mcq'
  | 'true_false'
  | 'short_answer'
  | 'numerical'
  | 'matching'
  | 'problem_solving';

export type QuestionStatus = 'DRAFT' | 'REVIEWED' | 'PUBLISHED' | 'ARCHIVED';

export type PracticeMode = 'quick' | 'topic' | 'mixed' | 'timed' | 'mock';

export type ReadinessLevel =
  | 'Needs Improvement'
  | 'Developing'
  | 'Good Progress'
  | 'Strong Preparation';

export interface EntranceQuestion {
  id: string;
  question: string;
  options?: string[];
  correctAnswer: string | number;
  explanation: string;
  grade: Grade; // 11 | 12 (or 9-10 foundations)
  subject: string; // 'math' | 'physics' | 'chemistry' | 'biology' | 'english' | 'history' | 'geography' | 'economics' | 'aptitude'
  unit: string;
  section?: string;
  lesson?: string;
  topic: string;
  learningOutcome?: string;
  difficulty: QuestionDifficulty;
  source: string; // e.g., "Ethiopian MoE Grade 11/12 Textbook"
  page?: number | string;
  type: QuestionType;
  status: QuestionStatus;
  matchingPairs?: { left: string; right: string }[];
  stream?: EntranceStream;
  conceptGaps?: string[];
  prerequisites?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface TopicPerformance {
  topic: string;
  subject: string;
  score: number;
  total: number;
  percentage: number;
  isWeak: boolean;
}

export interface DiagnosticAttempt {
  attemptId: string;
  userId: string;
  grade: Grade;
  stream: EntranceStream;
  score: number;
  total: number;
  percentage: number;
  topicPerformance: Record<string, TopicPerformance>;
  weakTopics: string[];
  strongTopics: string[];
  prerequisites: string[];
  recommendations: string[];
  completedAt: string;
}

export interface DailyStudyStructure {
  conceptReview: {
    topic: string;
    subject: string;
    durationMins: number;
    completed: boolean;
    textbookRef?: string;
  };
  practice: {
    topic: string;
    questionsCount: number;
    durationMins: number;
    completed: boolean;
  };
  weakTopicRevision: {
    topic: string;
    reason: string;
    durationMins: number;
    completed: boolean;
  };
  timedQuestions: {
    count: number;
    durationMins: number;
    completed: boolean;
  };
  reviewMistakes: {
    mistakeCount: number;
    durationMins: number;
    completed: boolean;
  };
}

export interface WeeklyMilestone {
  id: string;
  day: string;
  focus: string;
  targetQuestions: number;
  targetAccuracy: number;
  completed: boolean;
}

export interface StudyPlan {
  id: string;
  userId: string;
  grade: Grade;
  stream: EntranceStream;
  availableStudyTimeMinutes: number; // e.g., 30, 60, 120, 180
  examGoal: string; // e.g. "Target 600+ Score in Natural Science"
  diagnosticAttemptId?: string;
  weakTopics: string[];
  prerequisiteTopics: string[];
  dailyStructure: DailyStudyStructure;
  weeklyMilestones: WeeklyMilestone[];
  createdAt: string;
  updatedAt: string;
}

export interface EntranceMockExam {
  id: string;
  title: string;
  description?: string;
  grade: Grade;
  stream: EntranceStream;
  subjects: string[];
  topics: string[];
  questionCount: number;
  totalQuestions?: number;
  durationMinutes: number;
  instructions: string;
  difficulty: 'standard' | 'challenging' | 'adaptive';
  availability: 'active' | 'draft' | 'archived';
  isPublished?: boolean;
  questionIds: string[];
  blueprintWeights?: Record<string, number>; // subjectId -> percentage
  createdAt?: string;
}

export interface MockExamAnswer {
  questionId: string;
  selectedAnswer: any;
  correctAnswer: any;
  isCorrect: boolean;
  timeTakenSeconds: number;
  topic: string;
  subject: string;
  difficulty: QuestionDifficulty;
}

export interface EntranceMockAttempt {
  id: string;
  examId: string;
  examTitle: string;
  mockExamTitle?: string;
  userId: string;
  grade: Grade;
  score: number;
  total: number;
  percentage: number;
  accuracy: number;
  attemptedCount: number;
  unansweredCount: number;
  timeUsedSeconds: number;
  subjectPerformance: Record<string, { score: number; total: number; accuracy: number }>;
  subjectBreakdown?: Record<string, { score: number; total: number; percentage: number }>;
  topicPerformance: Record<string, { score: number; total: number; accuracy: number; weak: boolean }>;
  difficultyPerformance: Record<string, { score: number; total: number }>;
  weakAreas: string[];
  recommendedRevision: string[];
  recommendations?: string[];
  answers: Record<string, MockExamAnswer>;
  completedAt: string;
}

export interface MistakeRecord {
  id: string;
  userId: string;
  questionId: string;
  question: EntranceQuestion;
  userAnswer: any;
  correctAnswer: any;
  attemptedAt: string;
  retryCount: number;
  understood: boolean;
  conceptGap: string;
  aiExplanation?: string;
  sourceExamOrPractice?: string;
}

export interface EntranceProgress {
  userId: string;
  grade: Grade;
  stream: EntranceStream;
  dailyStudyTimeMinutes: number;
  questionsSolved: number;
  accuracy: number;
  topicsMastered: string[];
  weakTopics: string[];
  strongTopics: string[];
  mockExamsTaken: number;
  recentScores: number[];
  studyStreak: number;
  revisionSessionsCount: number;
  readinessStatus: ReadinessLevel;
  lastActiveDate: string;
  totalTimeSpentMinutes: number;
}

export interface EntranceExamSubjectConfig {
  id: string;
  name: string;
  amharicName: string;
  stream: EntranceStream;
  weight: number; // percentage in entrance composite
  difficulty: QuestionDifficulty;
  topics: {
    id: string;
    title: string;
    unit: string;
    estimatedQuestions: number;
    textbookPage?: number;
  }[];
  enabled: boolean;
}

export interface EntranceExamConfig {
  id: string;
  academicYear: string;
  gradesSupported: Grade[];
  subjects: EntranceExamSubjectConfig[];
  preparationCategories: string[];
  minPassingAccuracy: number;
  recommendedDailyMinutes: number;
  enabled?: boolean;
  accessTier?: 'free' | 'pro' | 'school';
  updatedAt: string;
}

export interface EntrancePastPaper {
  id: string;
  title: string;
  source: string; // e.g. "Ministry of Education National Assessment Agency"
  year: number;
  grade: Grade;
  subject: string;
  stream: EntranceStream;
  documentUrl?: string;
  questionsCount: number;
  totalQuestions?: number;
  timeLimitMinutes?: number;
  sourceProvenance?: string;
  licenseInfo: string;
  isOfficial: boolean;
  metadata: {
    totalMarks?: number;
    durationMinutes?: number;
    language?: string;
    verificationStatus?: 'verified' | 'provisional';
    curriculumAlignment?: string;
  };
  createdAt: string;
}

export interface AICoachResponse {
  answer: string;
  stepByStep?: string[];
  curriculumReference?: {
    grade: Grade;
    subject: string;
    unit: string;
    topic: string;
    source: string;
    page?: number | string;
  };
  hint?: string;
  conceptTrap?: string;
  similarPracticeQuestion?: {
    question: string;
    options: string[];
    correctAnswer: string | number;
    explanation: string;
  };
}
