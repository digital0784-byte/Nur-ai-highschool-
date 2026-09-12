import { Grade, UserProfile, UserRole } from '../types';
import { GradeLevel } from './curriculumEngine';

export interface ClassGroup {
  id: string;
  name: string; // e.g. "Grade 9-A Natural", "Grade 10-C"
  grade: Grade;
  section: string; // 'A', 'B', 'C', etc.
  academicYear: string; // e.g. "2017 E.C. (2024/25)"
  teacherId: string;
  teacherName: string;
  studentUids: string[];
  schedule?: string;
  roomNumber?: string;
  createdAt: string;
}

export interface Enrollment {
  id: string;
  classId: string;
  className: string;
  studentUid: string;
  studentName: string;
  grade: Grade;
  enrolledAt: string;
  status: 'active' | 'transferred' | 'graduated' | 'inactive';
}

export interface ParentContact {
  id: string;
  parentName: string;
  email: string;
  phone: string;
  studentUids: string[];
  studentNames: string[];
  relationship: 'father' | 'mother' | 'guardian';
  address?: string;
  createdAt: string;
}

export interface SchoolSection {
  id: string;
  name: string;
  grade: Grade;
  roomNumber: string;
  maxCapacity: number;
  activeStudentsCount: number;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  classId: string;
  className?: string;
  subjectId: string;
  subjectName: string;
  grade: Grade;
  unitNumber: number;
  dueDate: string;
  totalPoints: number;
  status: 'published' | 'draft' | 'closed';
  questions: Array<{
    id: string;
    prompt: string;
    points: number;
    type: 'short_answer' | 'essay' | 'workout' | 'multiple_choice';
  }>;
  assignedDate: string;
}

export interface AssessmentQuiz {
  id: string;
  title: string;
  classId?: string;
  subjectId: string;
  subjectName: string;
  grade: Grade;
  unitNumber: number;
  difficulty: 'easy' | 'medium' | 'hard';
  timeLimitMinutes: number;
  questions: Array<{
    id: string;
    question: string;
    options: [string, string, string, string];
    correctIndex: number;
    explanation: string;
    textbookPage?: number;
  }>;
  totalMarks: number;
  scheduledDate?: string;
  published: boolean;
  createdAt: string;
}

export interface AssessmentExam {
  id: string;
  title: string;
  examType: 'midterm' | 'final' | 'esslce_model';
  classId?: string;
  subjectId: string;
  subjectName: string;
  grade: Grade;
  durationMinutes: number;
  totalMarks: number;
  passingScore: number;
  academicYear?: string;
  questions: Array<{
    id: string;
    question: string;
    options: [string, string, string, string];
    correctIndex: number;
    explanation: string;
    weight: number;
    unitNumber: number;
    textbookPage?: number;
  }>;
  published: boolean;
  createdAt: string;
}

export interface Submission {
  id: string;
  assessmentId: string;
  assessmentTitle: string;
  type: 'assignment' | 'quiz' | 'exam';
  studentUid: string;
  studentName: string;
  classId?: string;
  score: number;
  total: number;
  percentage: number;
  answers: Record<string, any>;
  submittedAt: string;
  gradedAt?: string;
  feedback?: string;
  status: 'submitted' | 'graded' | 'pending';
}

export interface CurriculumMetadata {
  subjectId: string;
  subjectName: string;
  grade: Grade;
  stream: 'natural' | 'social' | 'common';
  textbookTitle: string;
  publisher: string;
  curriculumEdition: string;
  pageCount: number;
  pdfFileName: string;
  unitsCount: number;
  topicsCount: number;
  isPublished: boolean;
  lastIndexedAt?: string;
  coveragePercentage: number;
  version: string;
}

export interface RAGDocument {
  id: string;
  subjectId: string;
  grade: Grade;
  title: string;
  fileName: string;
  fileSizeMb: number;
  pageCount: number;
  totalChunks: number;
  status: 'indexed' | 'processing' | 'ready';
  lastProcessed: string;
  sha256?: string;
}

export interface RAGChunkView {
  id: string;
  documentId: string;
  subjectId: string;
  subjectName: string;
  grade: Grade;
  unit: number;
  unitTitle: string;
  topic: string;
  text: string;
  textbookPage: number;
  similarityScore?: number;
}

export interface AIUsageLog {
  id: string;
  timestamp: string;
  endpoint: string;
  model: string;
  promptTokens: number;
  candidateTokens: number;
  totalTokens: number;
  latencyMs: number;
  status: 'success' | 'failed' | 'fallback_used';
  errorDetail?: string;
  userRole: UserRole;
}

export interface AIRAGStats {
  totalIndexedDocuments: number;
  totalChunks: number;
  averageRetrievalLatencyMs: number;
  cacheHitRate: number;
  fallbackTriggeredCount: number;
  unsupportedQuestionsCount: number;
}

export interface AdminDashboardStats {
  totalStudents: number;
  totalTeachers: number;
  totalParents?: number;
  totalClasses: number;
  totalTextbooks: number;
  totalCurriculumTopics?: number;
  totalQuestions?: number;
  totalQuizzes: number;
  totalExams: number;
  activeEnrollments?: number;
  aiRequestsTotal: number;
  aiSuccessRate: number;
  avgResponseLatencyMs?: number;
  weakTopicsIdentified?: number;
  activeRecommendations?: number;
}

export interface SystemSettings {
  schoolName: string;
  academicYear: string;
  currentSemester: 1 | 2;
  defaultLanguage: string;
  aiModelPreference: 'gemini-3.8-flash' | 'gemini-3.6-flash' | 'gemini-3.1-flash-lite';
  offlineSyncIntervalMinutes: number;
  strictRAGGrounding: boolean;
  enableStudentSelfRegistration: boolean;
  lowDataModeDefault: boolean;
}

export type AdminActiveSubTab =
  | 'overview'
  | 'students'
  | 'payments_billing'
  | 'subscriptions'
  | 'pricing_management'
  | 'payment_methods'
  | 'revenue_analytics'
  | 'reports'
  | 'payment_audit_logs'
  | 'notifications'
  | 'security_rbac'
  | 'teachers'
  | 'parents'
  | 'classes'
  | 'curriculum'
  | 'assessments'
  | 'ai_assistant'
  | 'rag_analytics'
  | 'settings'
  | 'e2e_verification';
