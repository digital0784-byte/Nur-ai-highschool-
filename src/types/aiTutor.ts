import { GradeLevel, QuestionType, DifficultyLevel } from './curriculumEngine';
import { LanguageCode } from '../types';

export type LearningMode = 'beginner' | 'guided' | 'practice' | 'mastery';

export type TutorFeatureType =
  | 'ask_question'
  | 'explain_topic'
  | 'step_by_step'
  | 'examples'
  | 'practice_questions'
  | 'hints'
  | 'check_answer'
  | 'explain_mistakes'
  | 'quiz'
  | 'exam'
  | 'weak_topics'
  | 'identify_weak_topics'
  | 'recommend_lesson'
  | 'recommend_next_lesson'
  | 'photo_solver'
  | 'voice';

export interface TextbookCitation {
  grade: GradeLevel | number;
  subject: string;
  subjectId?: string;
  unit: number;
  unitTitle: string;
  section?: string;
  lesson?: string;
  topic?: string;
  page: number | string;
  source: string;
}

export interface AISessionItem {
  id: string;
  userId: string;
  grade: GradeLevel;
  subjectId: string;
  subjectName: string;
  mode: LearningMode;
  language: LanguageCode;
  title: string;
  activeTopicId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AIMessageItem {
  id: string;
  sessionId: string;
  userId: string;
  role: 'user' | 'assistant';
  content: string;
  featureType: TutorFeatureType;
  citations?: TextbookCitation[];
  groundedInTextbook: boolean;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface StudentMasteryRecord {
  id: string;
  userId: string;
  topicId: string;
  topicTitle: string;
  subjectId: string;
  grade: GradeLevel;
  masteryLevel: number; // 0 - 100
  status: 'not_started' | 'learning' | 'weak' | 'mastered';
  questionsAnswered: number;
  correctCount: number;
  currentMode: LearningMode;
  lastUpdated: string;
}

export interface StudentAnswerRecord {
  id: string;
  userId: string;
  sessionId: string;
  questionId: string;
  questionText: string;
  studentAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  feedback: string;
  mistakeDiagnosis?: string;
  topicId: string;
  topicTitle: string;
  subjectId: string;
  timestamp: string;
}

export interface WeakTopicRecord {
  id: string;
  userId: string;
  topicId: string;
  topicTitle: string;
  subjectId: string;
  grade: GradeLevel;
  accuracyRate: number; // e.g. 33%
  failureCount: number;
  prerequisiteNeeded?: string;
  recommendedRemedy: string;
  detectedAt: string;
}

export interface LearningRecommendationRecord {
  id: string;
  userId: string;
  subjectId: string;
  currentTopicId: string;
  currentTopicTitle: string;
  recommendedTopicId: string;
  recommendedTopicTitle: string;
  recommendedAction: 'review_prerequisite' | 'practice_more' | 'advance_topic';
  reason: string;
  generatedAt: string;
}

export interface QuizAttemptRecord {
  id: string;
  userId: string;
  sessionId: string;
  subjectId: string;
  subjectName: string;
  unitNumber: number;
  unitTitle: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  difficulty: DifficultyLevel;
  timestamp: string;
}

export interface ExamAttemptRecord {
  id: string;
  userId: string;
  subjectId: string;
  subjectName: string;
  examTitle: string;
  score: number;
  maxScore: number;
  percentage: number;
  passed: boolean;
  durationSeconds: number;
  timestamp: string;
}

export interface PhotoQuestionSolution {
  questionText: string;
  detectedGrade: GradeLevel;
  detectedSubject: string;
  detectedTopic: string;
  solutionSteps: string[];
  finalAnswer: string;
  citations: TextbookCitation[];
  groundedInTextbook: boolean;
  revisionTip: string;
}

export interface TutorActionRequest {
  feature: TutorFeatureType;
  question?: string;
  topicId?: string;
  topicTitle?: string;
  studentAnswer?: string;
  previousQuestion?: string;
  correctAnswer?: string;
  grade?: GradeLevel;
  subjectId?: string;
  subjectName?: string;
  unitNumber?: number;
  unitTitle?: string;
  mode?: LearningMode;
  language?: LanguageCode;
  difficulty?: DifficultyLevel;
  hintLevel?: 1 | 2 | 3;
  imageBase64?: string;
  audioPrompt?: string;
  sessionId?: string;
  userId?: string;
}
