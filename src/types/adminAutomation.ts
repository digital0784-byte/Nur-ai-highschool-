import { Grade } from '../types';

export type QuestionType = 'multiple_choice' | 'true_false' | 'multi_select' | 'calculation' | 'short_answer';

export type QuestionDifficulty = 'easy' | 'medium' | 'hard';

export type QualityStatus = 'VERIFIED_CURRICULUM' | 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED';

export interface GeneratedQuizQuestion {
  id: string;
  grade: Grade;
  subject: string;
  unit: number;
  lesson: string;
  topic: string;
  type: QuestionType;
  difficulty: QuestionDifficulty;
  question: string;
  options?: string[]; // for multiple_choice & multi_select
  correctAnswer: string | string[]; // string or array for multi_select
  explanation: string;
  sourceTopic: string;
  textbookReference: string;
  qualityStatus: QualityStatus;
  generatedAt: string;
}

export interface AIQuizGenerationRequest {
  grade: Grade;
  subject: string;
  unit: number;
  lesson?: string;
  topic: string;
  difficulty: QuestionDifficulty;
  questionCount: number;
  questionTypes?: QuestionType[];
}

export interface AIQuizGenerationResponse {
  success: boolean;
  questions: GeneratedQuizQuestion[];
  topic: string;
  unit: number;
  curriculumGrounded: boolean;
  generatedAt: string;
}

export type AssignmentType = 'homework' | 'exercise' | 'project' | 'revision';

export interface GeneratedAssignment {
  id: string;
  title: string;
  description: string;
  type: AssignmentType;
  grade: Grade;
  subject: string;
  unit: number;
  lesson: string;
  topic: string;
  learningOutcomes: string[];
  difficulty: QuestionDifficulty;
  isPremium: boolean;
  dueDate: string;
  totalPoints: number;
  status: 'draft' | 'approved' | 'disabled' | 'published';
  questions: Array<{
    id: string;
    prompt: string;
    type: 'text' | 'numerical' | 'structured' | 'calculation';
    points: number;
    expectedAnswerOutline?: string;
    rubricCriteria?: string[];
  }>;
  createdAt: string;
  approvedBy?: string;
  updatedAt: string;
}

export interface AIAssignmentEvaluationRequest {
  assignmentId: string;
  studentId: string;
  studentName: string;
  answers: Array<{
    questionId: string;
    prompt: string;
    studentAnswer: string;
    type: 'text' | 'numerical' | 'structured' | 'calculation' | 'photo';
  }>;
}

export interface QuestionEvaluationBreakdown {
  questionId: string;
  score: number;
  maxScore: number;
  isCorrect: boolean;
  isPartiallyCorrect: boolean;
  identifiedCorrectParts: string[];
  identifiedIncorrectParts: string[];
  explanation: string;
  constructiveFeedback: string;
  weakTopicsIdentified: string[];
  confidenceScore: number; // 0 - 1.0
  humanReviewRecommended: boolean;
  reviewReason?: string;
}

export interface AIAssignmentEvaluationResult {
  evaluationId: string;
  assignmentId: string;
  studentId: string;
  totalScore: number;
  maxScore: number;
  percentage: number;
  breakdown: QuestionEvaluationBreakdown[];
  overallFeedback: string;
  weakTopicsIdentified: string[];
  masteredTopicsIdentified: string[];
  studentProgressUpdated: boolean;
  aiConfidenceScore: number;
  humanReviewFlag: boolean;
  evaluatedAt: string;
}

export type StudentMasteryStatus = 'MASTERED' | 'DEVELOPING' | 'NEEDS_PRACTICE' | 'NOT_STARTED';

export interface StudentProgressAnalysisRecord {
  studentId: string;
  studentName: string;
  grade: Grade;
  lessonsCompleted: number;
  totalLessons: number;
  quizAverageScore: number;
  assignmentAverageScore: number;
  examAverageScore: number;
  totalMistakesLogged: number;
  weakTopics: Array<{
    topicId: string;
    topicTitle: string;
    subject: string;
    accuracyRate: number;
    status: StudentMasteryStatus;
  }>;
  masteredTopics: Array<{
    topicId: string;
    topicTitle: string;
    subject: string;
  }>;
  learningFrequency: 'DAILY' | 'REGULAR' | 'OCCASIONAL' | 'INACTIVE';
  learningProgressPercentage: number;
  knowledgeMapStatusSummary: {
    masteredCount: number;
    developingCount: number;
    needsPracticeCount: number;
    notStartedCount: number;
  };
  aiStudentSummary: string; // safe, objective summary
  lastAnalyzedAt: string;
}

export interface PersonalizedRecommendationItem {
  id: string;
  studentId: string;
  title: string;
  type:
    | 'REVIEW_TOPIC'
    | 'PRACTICE_QUESTIONS'
    | 'WATCH_LESSON'
    | 'READ_TEXTBOOK_SECTION'
    | 'TAKE_QUIZ'
    | 'CONTINUE_NEXT_LESSON';
  subject: string;
  grade: Grade;
  topicTitle: string;
  unitNumber: number;
  textbookPage?: number;
  targetAction: string;
  reason: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'ACTIVE' | 'COMPLETED' | 'DISMISSED';
  createdAt: string;
}

export type PaymentStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'EXPIRED';

export type FraudRiskLevel = 'LOW RISK' | 'MEDIUM RISK' | 'HIGH RISK';

export interface FraudRiskAssessment {
  recordId: string;
  riskLevel: FraudRiskLevel;
  riskScore: number; // 0 - 100
  signals: string[];
  explanation: string;
  isDuplicateReference: boolean;
  isRepeatedAttempt: boolean;
  isInconsistentData: boolean;
  recommendedAction: string;
  assessedAt: string;
}

export interface PaymentAutomationRecord {
  id: string;
  studentId: string;
  studentName: string;
  studentPhone: string;
  studentEmail?: string;
  grade: Grade;
  amount: number;
  currency: string;
  method: 'Telebirr' | 'CBE Birr' | 'Commercial Bank of Ethiopia (CBE)' | 'Dashen Bank' | 'Bank of Abyssinia';
  transactionReference: string;
  status: PaymentStatus;
  isIncomplete: boolean;
  missingFields?: string[];
  fraudRisk: FraudRiskAssessment;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
  receiptUrl?: string;
}

export interface SubscriptionExpiryAlert {
  id: string;
  subscriptionId: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  grade: Grade;
  stage: '7_DAYS' | '3_DAYS' | '1_DAY' | 'ON_EXPIRY';
  daysRemaining: number;
  expiryDate: string;
  notificationSent: boolean;
  sentAt?: string;
  notificationChannel: 'IN_APP' | 'SMS_SIMULATED' | 'EMAIL';
  status: 'ACTIVE' | 'EXPIRED';
}

export interface AIRecommendedAction {
  id: string;
  title: string;
  issue: string;
  evidence: string;
  recommendedAction: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  category: 'PAYMENT' | 'SUBSCRIPTION' | 'STUDENT' | 'CURRICULUM' | 'SECURITY';
  sensitiveAction: boolean; // True requires SUPER_ADMIN confirmation
  targetId: string;
  actionPayload?: Record<string, any>;
  status: 'PENDING' | 'APPROVED' | 'DISMISSED' | 'EXECUTED';
  createdAt: string;
}

export interface AutomatedAdminReport {
  id: string;
  type: 'DAILY' | 'WEEKLY' | 'MONTHLY';
  generatedAt: string;
  title: string;
  dateRange: string;
  metrics: {
    totalStudents: number;
    activeSubscribers: number;
    pendingPaymentsCount: number;
    approvedPaymentsRevenueETB: number;
    quizzesTaken: number;
    assignmentsEvaluated: number;
    topWeakTopics: Array<{ topic: string; subject: string; count: number }>;
    aiRequestsTotal: number;
    aiSuccessRate: number;
    contentProcessingSuccessRate: number;
    failedCurriculumPages: number;
    systemHealthScore: number;
    securityAlertsCount: number;
    fraudRiskAlertsCount: number;
  };
  executiveSummary: string;
  keyInsights: string[];
  recommendedPriorities: string[];
}

export interface AutomationJobExecution {
  id: string;
  jobName: string;
  triggerType: 'DAILY_SCHEDULE' | 'EVENT_AFTER_QUIZ' | 'EVENT_AFTER_ASSIGNMENT' | 'EVENT_AFTER_PAYMENT' | 'EXPIRY_CHECK';
  timestamp: string;
  status: 'SUCCESS' | 'WARNING' | 'FAILED';
  itemsProcessed: number;
  details: string;
  source: 'AUTOMATION' | 'AI';
}

export interface AIAdminAssistantMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  dataCard?: {
    type: 'METRICS' | 'PAYMENT_LIST' | 'STUDENT_LIST' | 'EXPIRY_LIST' | 'CURRICULUM_ALERT' | 'REPORT_SUMMARY';
    title: string;
    items?: Array<{ label: string; value: string | number; alert?: boolean }>;
    summary?: string;
  };
}
