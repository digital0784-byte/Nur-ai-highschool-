import { Grade, SubjectStream } from '../types';

export type AssessmentQuestionType =
  | 'mcq'
  | 'true_false'
  | 'fill_blank'
  | 'short_answer'
  | 'matching'
  | 'discussion'
  | 'practical'
  | 'coding';

export type AssessmentDifficulty = 'easy' | 'medium' | 'hard';

export type QuestionValidationStatus = 'draft' | 'reviewed' | 'published' | 'archived';

export interface MatchingPair {
  id: string;
  left: string;
  right: string;
}

export interface QuestionValidationResult {
  isValid: boolean;
  confidence: number;
  groundedInTextbook: boolean;
  singleCorrectAnswer: boolean;
  difficultyVerified: boolean;
  sourceVerified: boolean;
  issues: string[];
}

export interface CurriculumQuestion {
  id: string;
  question: string;
  type: AssessmentQuestionType;
  options?: string[];
  matchingPairs?: MatchingPair[];
  correctAnswer: string | number | string[] | Record<string, string>;
  explanation: string;
  grade: Grade;
  subjectId: string;
  subjectName: string;
  unitNumber: number;
  unitTitle: string;
  topic: string;
  difficulty: AssessmentDifficulty;
  textbookPage: number | string;
  source: string;
  competency?: string;
  codeSnippet?: string;
  language?: string;
  status: QuestionValidationStatus;
  createdBy: string;
  createdAt: string;
  validationResult?: QuestionValidationResult;
}

export interface ExamBlueprint {
  id: string;
  title: string;
  grade: Grade;
  subjectId: string;
  subjectName: string;
  stream?: SubjectStream;
  examType: 'quiz' | 'midterm' | 'final' | 'esslce_model' | 'diagnostic';
  selectedUnits: number[];
  selectedTopics: string[];
  totalQuestions: number;
  questionTypes: AssessmentQuestionType[];
  difficultyDistribution: {
    easy: number; // percentage (e.g. 40)
    medium: number; // percentage (e.g. 40)
    hard: number; // percentage (e.g. 20)
  };
  timeLimitMinutes: number;
  passingScore: number;
  scheduledDate?: string;
  antiCheating: {
    randomizeQuestions: boolean;
    randomizeOptions: boolean;
    serverTimerValidation: boolean;
    submissionLocking: boolean;
    maxAttempts: number;
  };
  status: 'draft' | 'published' | 'closed';
  createdAt: string;
  createdBy: string;
}

export interface GeneratedExam {
  id: string;
  blueprintId: string;
  title: string;
  grade: Grade;
  subjectId: string;
  subjectName: string;
  examType: string;
  timeLimitMinutes: number;
  totalMarks: number;
  passingScore: number;
  questions: CurriculumQuestion[];
  antiCheating: ExamBlueprint['antiCheating'];
  createdAt: string;
}

export interface StudentAssessmentAttempt {
  id: string;
  studentId: string;
  studentName: string;
  assessmentId: string;
  assessmentTitle: string;
  assessmentType: 'quiz' | 'exam';
  grade: Grade;
  subjectId: string;
  startedAt: string;
  submittedAt?: string;
  durationSeconds: number;
  status: 'in_progress' | 'submitted' | 'graded';
  answers: Record<string, any>;
  serverScore?: number;
  totalMarks?: number;
  percentage?: number;
  isPassed?: boolean;
  topicBreakdown?: Record<string, { total: number; correct: number; percentage: number }>;
  weakTopics?: string[];
  strongTopics?: string[];
  recommendations?: string[];
}

export interface AdaptiveQuizState {
  sessionId: string;
  studentId: string;
  subjectId: string;
  grade: Grade;
  unitNumber: number;
  topic: string;
  currentDifficulty: AssessmentDifficulty;
  consecutiveCorrect: number;
  consecutiveWrong: number;
  history: Array<{
    questionId: string;
    difficulty: AssessmentDifficulty;
    isCorrect: boolean;
    timeSpentSec: number;
    topic: string;
  }>;
  currentQuestionIndex: number;
  questions: CurriculumQuestion[];
  answers: Record<string, any>;
  score: number;
  maxScore: number;
  status: 'active' | 'completed';
  weakTopics: string[];
  strongTopics: string[];
  recommendedRevision: string[];
}

export interface QuestionBankFilter {
  grade?: Grade | 'all';
  subjectId?: string | 'all';
  unitNumber?: number | 'all';
  type?: AssessmentQuestionType | 'all';
  difficulty?: AssessmentDifficulty | 'all';
  status?: QuestionValidationStatus | 'all';
  searchQuery?: string;
}

export interface AssessmentAnalyticsSummary {
  totalAssessmentsConducted: number;
  totalSubmissions: number;
  averageClassScore: number;
  passingRate: number;
  weakTopics: Array<{ topic: string; subject: string; grade: Grade; failureRate: number }>;
  strongTopics: Array<{ topic: string; subject: string; grade: Grade; successRate: number }>;
  frequentlyMissedQuestions: Array<{
    questionId: string;
    questionText: string;
    subject: string;
    unitNumber: number;
    errorRate: number;
  }>;
}
