import { GradeLevel, SupportedLanguage, DifficultyLevel, QuestionType, RAGMetadata } from './curriculumEngine';

export type SearchContentType = 'all' | 'topic' | 'lesson' | 'unit' | 'question' | 'exercise' | 'assessment';

export type SearchMode = 'smart' | 'keyword' | 'semantic_rag' | 'ai_intent';

export interface SearchFilters {
  grade?: GradeLevel | 'all';
  subjectId?: string | 'all';
  unit?: number | 'all';
  difficulty?: DifficultyLevel | 'all';
  contentType?: SearchContentType;
  language?: SupportedLanguage;
}

export interface SearchResultItem {
  id: string;
  title: string;
  amharicTitle?: string;
  grade: GradeLevel;
  subjectId: string;
  subjectName: string;
  unitNumber: number;
  unitTitle: string;
  sectionTitle?: string;
  lessonTitle?: string;
  topicTitle?: string;
  topicId?: string;
  contentType: SearchContentType;
  shortExplanation: string;
  textbookPage: number | string;
  source: string;
  difficulty?: DifficultyLevel;
  relevanceScore: number;
  matchReason?: string;
  highlights?: string[];
  prerequisites?: string[];
  questionData?: {
    questionType: QuestionType;
    prompt: string;
    options?: string[];
    correctAnswer?: any;
    explanation: string;
  };
  exerciseData?: {
    exerciseNumber: string;
    problemCount: number;
  };
}

export interface AIIntentAnalysis {
  intent: 'explain_concept' | 'list_topics' | 'practice_questions' | 'find_unit' | 'curriculum_overview' | 'general_search';
  detectedGrade?: GradeLevel;
  detectedSubject?: string;
  detectedSubjectId?: string;
  detectedTopic?: string;
  detectedUnitNumber?: number;
  detectedPageNumber?: number;
  searchKeywords: string[];
  synthesizedExplanation?: string;
  canAskAITutor: boolean;
  tutorStarterPrompt?: string;
}

export interface AISearchResponse {
  query: string;
  aiIntent: AIIntentAnalysis;
  results: SearchResultItem[];
  totalMatches: number;
  executionTimeMs: number;
  isRAGPowered: boolean;
  modelUsed?: string;
}

export interface RecentSearchItem {
  id: string;
  userId: string;
  query: string;
  searchMode: SearchMode;
  filters?: SearchFilters;
  resultCount: number;
  timestamp: string;
}

export interface BookmarkItem {
  id: string;
  userId: string;
  contentType: SearchContentType;
  contentId: string; // topicId, lessonId, questionId, unitId
  title: string;
  amharicTitle?: string;
  grade: GradeLevel;
  subjectId: string;
  subjectName: string;
  unitNumber?: number;
  unitTitle?: string;
  topicId?: string;
  topicTitle?: string;
  textbookPage?: number | string;
  snippet?: string;
  source: string;
  createdAt: string;
  offlineCached: boolean;
  notes?: string;
}

export type RecommendationType =
  | 'next_lesson'
  | 'revision'
  | 'practice_questions'
  | 'quiz'
  | 'related_topic';

export type RecommendationPriority = 'high' | 'medium' | 'low';

export type RecommendationStatus = 'pending' | 'completed' | 'dismissed';

export interface CurriculumRecommendation {
  id: string;
  userId: string;
  type: RecommendationType;
  contentId: string; // topicId or unitId or quizId
  title: string;
  amharicTitle?: string;
  grade: GradeLevel;
  subjectId: string;
  subjectName: string;
  unitNumber: number;
  unitTitle: string;
  topicTitle?: string;
  reason: string;
  amharicReason?: string;
  priority: RecommendationPriority;
  createdAt: string;
  status: RecommendationStatus;
  textbookPage?: number | string;
  xpReward: number;
  targetActionLabel: string;
  completedAt?: string;
}

export interface RecommendationEvent {
  id: string;
  userId: string;
  recommendationId: string;
  eventType: 'generated' | 'viewed' | 'clicked' | 'completed' | 'dismissed';
  timestamp: string;
  xpAwarded?: number;
}

export interface E2ESearchVerificationStage {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'passed' | 'failed';
  details: string;
  latencyMs?: number;
  metadata?: any;
}
