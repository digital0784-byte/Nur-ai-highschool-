import { Grade, LanguageCode } from '../types';
import { GradeLevel } from './curriculumEngine';

export type TeachingMode = 'beginner' | 'guided' | 'practice' | 'mastery';

export type VoiceAudioState =
  | 'idle'
  | 'listening'
  | 'processing'
  | 'generating'
  | 'speaking'
  | 'clarifying'
  | 'error';

export type VoiceCoachCommand =
  | 'explain_lesson'
  | 'give_example'
  | 'quiz_me'
  | 'check_answer'
  | 'explain_mistake'
  | 'make_easier'
  | 'make_harder'
  | 'review_weak_topics'
  | 'what_next';

export interface CurriculumSourceMetadata {
  grade: GradeLevel;
  subject: string;
  unitNumber: number;
  unitTitle: string;
  topicTitle: string;
  textbookTitle: string;
  publisher?: string;
  page?: number;
  snippet?: string;
}

export interface VoiceMessageRecord {
  id: string;
  sessionId: string;
  sender: 'student' | 'ai';
  text: string;
  spokenScript?: string;
  language: LanguageCode;
  timestamp: string;
  confidence?: number;
  sourceMetadata?: CurriculumSourceMetadata;
  audioMetadata?: {
    durationSeconds?: number;
    wasVoiceInput?: boolean;
  };
  teachingMode?: TeachingMode;
  interactiveQuiz?: VoiceQuizItem;
  photoUrl?: string;
  clarificationPrompt?: string;
}

export interface VoiceSessionRecord {
  sessionId: string;
  studentId: string;
  grade: Grade;
  language: LanguageCode;
  subject: string;
  topic: string;
  teachingMode: TeachingMode;
  startedAt: string;
  endedAt?: string;
  durationSeconds: number;
  status: 'active' | 'completed' | 'paused';
  messageCount: number;
}

export interface VoiceQuizItem {
  id: string;
  question: string;
  questionAudioScript?: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  topicId: string;
  subject: string;
  grade: Grade;
  difficulty: 'easy' | 'medium' | 'hard';
  userAnswer?: string;
  isEvaluated?: boolean;
  isCorrect?: boolean;
}

export interface VoiceTutorCostConfig {
  maxDailyRequestsPerFreeUser: number;
  maxDailyRequestsPerSubscriber: number;
  maxSessionDurationMinutes: number;
  enableAudioResponses: boolean;
  enableLowDataModeByDefault: boolean;
  lastUpdatedBy?: string;
  lastUpdatedAt?: string;
}

export interface VoiceTutorUsageAnalytics {
  totalVoiceSessions: number;
  totalTextSessions: number;
  totalSpokenMinutes: number;
  totalQuestionsSolved: number;
  languageDistribution: Record<LanguageCode, number>;
  subjectDistribution: Record<string, number>;
  activeStudentsToday: number;
  failedRequestsCount: number;
  averageSessionDurationMinutes: number;
}
