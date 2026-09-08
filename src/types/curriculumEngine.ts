export type GradeLevel = 9 | 10 | 11 | 12;

export type SupportedLanguage = 'en' | 'am' | 'om' | 'ti';

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export type QuestionType =
  | 'multiple_choice'
  | 'true_false'
  | 'fill_in_blank'
  | 'short_answer'
  | 'discussion'
  | 'practical'
  | 'coding';

export interface RAGMetadata {
  grade: GradeLevel;
  subject: string;
  subjectId: string;
  unit: number;
  unitTitle: string;
  section?: string;
  lesson?: string;
  topic?: string;
  learningOutcome?: string;
  textbookPage: number | string;
  source: string; // e.g. "Ministry of Education - New Curriculum Student Textbook Grade 9"
  difficulty: DifficultyLevel;
  prerequisites: string[]; // Topic IDs or concept codes
}

export interface LearningOutcome {
  id: string;
  code: string; // e.g. "LO-MATH9-U1-01"
  description: {
    en: string;
    am: string;
    om?: string;
    ti?: string;
  };
  bloomLevel?: 'remember' | 'understand' | 'apply' | 'analyze' | 'evaluate' | 'create';
}

export interface TextbookExample {
  id: string;
  title: string;
  problem: string;
  solution: string;
  methodology?: string;
  textbookPage: number;
}

export interface TextbookActivity {
  id: string;
  activityNumber: string; // e.g. "Activity 1.3"
  title: string;
  objective: string;
  instructions: string[];
  materials?: string[];
  expectedObservation?: string;
  safetyOrTips?: string;
  textbookPage: number;
}

export interface TextbookExercise {
  id: string;
  exerciseNumber: string; // e.g. "Exercise 1.2"
  title: string;
  problems: {
    questionNumber: string;
    text: string;
    hint?: string;
    answer?: string;
  }[];
  textbookPage: number;
}

export interface UnitReview {
  summaryPoints: string[];
  keyTerms: { term: string; definition: string }[];
  reviewQuestions: string[];
  textbookPage: number;
}

export interface UnitAssessment {
  title: string;
  totalMarks?: number;
  durationMinutes?: number;
  instructions: string;
  questions: CurriculumQuestion[];
  textbookPage: number;
}

export interface CurriculumTopic {
  id: string;
  topicNumber: string; // e.g. "1.1.2"
  title: {
    en: string;
    am: string;
    om?: string;
    ti?: string;
  };
  summary: string;
  textbookPage: number;
  learningOutcomes: LearningOutcome[];
  explanations: {
    overview: string;
    coreConcepts: string[];
    deepDive?: string;
  };
  examples: TextbookExample[];
  activities: TextbookActivity[];
  exercises: TextbookExercise[];
  difficulty: DifficultyLevel;
  prerequisites: string[]; // Topic IDs that should be understood first
}

export interface CurriculumLesson {
  id: string;
  lessonNumber: string; // e.g. "Lesson 1.2"
  title: {
    en: string;
    am: string;
    om?: string;
    ti?: string;
  };
  periodCount: number; // e.g. 2 periods
  textbookPageStart: number;
  textbookPageEnd: number;
  topics: CurriculumTopic[];
}

export interface CurriculumSection {
  id: string;
  sectionNumber: string; // e.g. "1.1"
  title: {
    en: string;
    am: string;
    om?: string;
    ti?: string;
  };
  textbookPageStart: number;
  textbookPageEnd: number;
  lessons: CurriculumLesson[];
}

export interface CurriculumUnit {
  id: string;
  unitNumber: number;
  title: {
    en: string;
    am: string;
    om?: string;
    ti?: string;
  };
  description: string;
  allocatedPeriods?: number;
  textbookPageStart: number;
  textbookPageEnd: number;
  sections: CurriculumSection[];
  unitReview: UnitReview;
  unitAssessment: UnitAssessment;
}

export interface CurriculumSubjectItem {
  id: string;
  name: {
    en: string;
    am: string;
    om?: string;
    ti?: string;
  };
  code: string;
  grade: GradeLevel;
  stream?: 'natural' | 'social' | 'common';
  textbookTitle: string;
  textbookPublisher: string; // e.g. "Federal Democratic Republic of Ethiopia Ministry of Education"
  curriculumEdition: string; // "New Curriculum (አዲሱ ሥርዓተ-ትምህርት)"
  officialPdfUrl?: string;
  totalUnits: number;
  units: CurriculumUnit[];
}

export interface CurriculumQuestion {
  id: string;
  questionType: QuestionType;
  difficulty: DifficultyLevel;
  prompt: {
    en: string;
    am: string;
    om?: string;
    ti?: string;
  };
  options?: string[]; // for multiple_choice
  correctAnswer: string | number | boolean;
  explanation: {
    en: string;
    am: string;
    om?: string;
    ti?: string;
  };
  learningOutcomeId?: string;
  ragMetadata: RAGMetadata;
  codeStarter?: string; // for coding questions
  codeLanguage?: string;
  rubric?: string[]; // for discussion/practical
}

export interface KnowledgeNode {
  id: string; // e.g. "math-g9-sets"
  label: string;
  amharicLabel: string;
  grade: GradeLevel;
  subjectId: string;
  unitNumber: number;
  topicId: string;
  difficulty: DifficultyLevel;
  importance: 'foundational' | 'core' | 'advanced';
  masteryPercentage?: number; // 0-100% for active student
  prerequisites: string[]; // ids of other KnowledgeNodes
}

export interface KnowledgeEdge {
  from: string; // source prerequisite node ID
  to: string;   // target dependent node ID
  relationship: 'prerequisite' | 'extension' | 'interdisciplinary';
}

export interface SubjectKnowledgeMap {
  subjectId: string;
  grade: GradeLevel;
  nodes: KnowledgeNode[];
  edges: KnowledgeEdge[];
}

export interface StudentProgressNode {
  userId: string;
  topicId: string;
  subjectId: string;
  grade: GradeLevel;
  masteryLevel: number; // 0 to 100
  status: 'not_started' | 'in_progress' | 'mastered' | 'weak';
  questionsAttempted: number;
  questionsCorrect: number;
  lastStudiedAt: string;
  notes?: string;
}

export interface TextbookImportPayload {
  grade: GradeLevel;
  subjectId: string;
  subjectName: string;
  publisher: string;
  edition: string;
  units: CurriculumUnit[];
  generatedQuestions?: CurriculumQuestion[];
}

export interface RAGSearchResult {
  chunkId: string;
  snippet: string;
  relevanceScore: number;
  metadata: RAGMetadata;
}
