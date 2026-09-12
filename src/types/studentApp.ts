import { GradeLevel, DifficultyLevel } from './curriculumEngine';
import { LanguageCode } from '../types';
import { TextbookCitation } from './aiTutor';

export type StudentMasteryLevel = 'not_started' | 'learning' | 'developing' | 'mastered';

export interface StudentProfileData {
  uid: string;
  displayName: string;
  email: string;
  grade: GradeLevel;
  preferredLanguage: LanguageCode;
  schoolName?: string;
  avatarSeed?: string;
  lowDataMode: boolean;
  darkMode: boolean;
  createdAt: string;
  lastActive: string;
}

export interface StudentTopicMastery {
  topicId: string;
  topicTitle: string;
  subjectId: string;
  grade: GradeLevel;
  masteryLevel: StudentMasteryLevel;
  masteryScore: number; // 0 - 100
  correctCount: number;
  incorrectCount: number;
  attemptsCount: number;
  totalTimeSpentSeconds: number;
  completed: boolean;
  lastStudiedAt: string;
  difficultySuggested: DifficultyLevel;
  needsRevision: boolean;
  remedialPrerequisiteId?: string;
}

export interface StudentProgressSummary {
  totalLessonsCompleted: number;
  totalStudyMinutes: number;
  currentStreakDays: number;
  averageQuizScore: number;
  masteredTopicsCount: number;
  developingTopicsCount: number;
  weakTopicsCount: number;
  overallPercentage: number;
  lastStudiedSubjectId?: string;
  lastStudiedTopicId?: string;
  lastStudiedTopicTitle?: string;
}

export interface StudentRecommendationItem {
  id: string;
  type: 'revision' | 'practice_easier' | 'reassess' | 'advance_topic' | 'next_prerequisite';
  subjectId: string;
  subjectName: string;
  topicId: string;
  topicTitle: string;
  grade: GradeLevel;
  reason: string;
  targetDifficulty: DifficultyLevel;
  generatedAt: string;
  actionUrl?: string;
}

export interface OfflineCachedUnit {
  unitId: string;
  subjectId: string;
  unitNumber: number;
  title: string;
  grade: GradeLevel;
  downloadedAt: string;
  sizeBytes: number;
  data: any; // Full unit content
}

export type StudentTab = 'home' | 'search' | 'subjects' | 'learn' | 'knowledge_map' | 'quiz' | 'photo_solver' | 'voice_tutor' | 'offline' | 'gamification';

export type LearningPageSection =
  | 'read'
  | 'ai_explain'
  | 'ask_tutor'
  | 'examples'
  | 'practice'
  | 'quiz'
  | 'review';
