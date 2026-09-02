export type Grade = 9 | 10 | 11 | 12;

export type LanguageCode = 'am' | 'en' | 'ti' | 'om' | 'ar' | 'so';

export interface LanguageMeta {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flagOrLabel: string;
  dir: 'ltr' | 'rtl';
}

export interface Flashcard {
  id: string;
  front: string; // Question or term
  back: string;  // Short answer or definition
  hint?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: [string, string, string, string];
  correctIndex: number; // 0, 1, 2, 3
  explanation: string;
}

export interface PracticalActivity {
  title: string;
  materials?: string[];
  steps: string[];
  observation: string;
}

export type SubjectStream = 'natural' | 'social' | 'common';
export type StreamFilter = 'all' | 'natural' | 'social';

export interface Topic {
  id: string;
  title: string;
  gradeTier: '9-10' | '11-12';
  applicableGrades: Grade[];
  lessonTitle: string;
  lessonContent: string[]; // Array of paragraphs
  competencies?: string[]; // New Curriculum Competency standards
  keyPoints?: string[];
  practicalActivity?: PracticalActivity; // Hands-on laboratory or practical project
  flashcards: Flashcard[]; // 4 flashcards
  quizQuestions: QuizQuestion[]; // 4 questions
}

export interface Subject {
  id: string;
  name: string;          // e.g. "ሂሳብ", "Mathematics", "ሒሳብ", "Herrega", "الرياضيات", "Xisaab"
  subName: string;       // Secondary name/translation
  stream?: SubjectStream;// 'natural' | 'social' | 'common' (for Grade 11-12 stream pathways)
  curriculumBadge?: string; // e.g. "አዲሱ ስርዓተ-ትምህርት"
  accentColor: string;   // e.g. "#1D4ED8"
  accentLight: string;   // e.g. "#EFF6FF"
  accentBorder: string;  // e.g. "#2563EB"
  accentBadge: string;
  topics: Topic[];       // 2 topics (one 9-10, one 11-12)
}

export type ActiveTab =
  | 'lesson'
  | 'textbook'
  | 'objectives_exam'
  | 'video_learning'
  | 'supplementary'
  | 'flashcards'
  | 'quiz';

export interface ObjectiveItem {
  id: string;
  title: string;
  description?: string;
  masteryQuestion?: {
    question: string;
    options: [string, string, string, string];
    correctIndex: number;
    explanation: string;
  };
}

export interface TextbookSection {
  title: string;
  content: string[];
  keyTerms?: { term: string; definition: string }[];
  workedExamples?: { question: string; solution: string }[];
  exercises?: string[];
}

export interface TextbookUnit {
  unitNumber: number;
  title: string;
  summary: string;
  objectives?: ObjectiveItem[];
  sections: TextbookSection[];
  unitReviewQuestions?: string[];
}

export interface SubjectTextbook {
  subjectId: string;
  grade: Grade;
  title: string;
  curriculumBadge: string;
  totalUnits: number;
  description: string;
  units: TextbookUnit[];
}

export interface SupplementaryBookChapter {
  chapterNumber: number;
  title: string;
  summary: string;
  keyFormulasAndRules?: string[];
  sampleExamProblems?: { problem: string; solution: string; tip: string }[];
  fullContent: string[];
}

export interface SupplementaryBook {
  id: string;
  title: string;
  amharicTitle: string;
  authorOrSeries: string;
  category: 'extreme' | 'alpha' | 'national_exam' | 'lab_manual' | 'formula_handbook';
  categoryLabel: string;
  subjectId: string;
  grades: Grade[];
  description: string;
  badge: string;
  highlights: string[];
  chapters: SupplementaryBookChapter[];
}

export interface VideoTimestamp {
  time: string;
  seconds: number;
  title: string;
  conceptSummary: string;
}

export interface VideoLessonItem {
  id: string;
  subjectId: string;
  grade: Grade;
  title: string;
  amharicTitle: string;
  unitNumber: number;
  unitTitle: string;
  duration: string;
  videoUrl: string;
  instructor: string;
  curriculumBadge: string;
  overview: string;
  timestamps: VideoTimestamp[];
  keyVisualTakeaways: string[];
  labExperimentDemonstration?: {
    title: string;
    materials: string[];
    steps: string[];
    scientificLaw: string;
  };
  checkQuestions: {
    question: string;
    options: [string, string, string, string];
    correctIndex: number;
    explanation: string;
  }[];
}

export interface TopicProgressItem {
  lessonCompleted: boolean;
  flashcardsCompleted: boolean;
  quizCompleted: boolean;
  quizScore?: number;
  quizTotal?: number;
}

export type CourseProgressMap = Record<string, TopicProgressItem>;

export interface UITranslations {
  appTitle: string;
  appSubtitle: string;
  countryBadge: string;
  selectGradeLabel: string;
  gradePrefix: string;
  subjectsTitle: string;
  subjectsSubtitle: string;
  topicsLabel: string;
  gradeTierPrefix: string;
  yourGradeBadge: string;
  tabLesson: string;
  tabTextbook: string;
  tabObjectivesExam: string;
  tabVideoLearning: string;
  tabSupplementary: string;
  tabFlashcards: string;
  tabQuiz: string;
  // AI & Objectives
  aiAnalysisBtn: string;
  aiTutorTitle: string;
  aiTutorSubtitle: string;
  askAiPrompt: string;
  chapterObjectivesTitle: string;
  testObjectivesBtn: string;
  videoLessonsTitle: string;
  supplementaryBooksTitle: string;
  lessonExplanationBanner: string;
  lessonContentTitle: string;
  keyTakeawaysTitle: string;
  lessonFooterPrompt: string;
  flashcardsBtn: string;
  startQuizBtn: string;
  flashcardsSubtitle: string;
  cardLabel: string;
  ofLabel: string;
  cardFrontTag: string;
  cardBackTag: string;
  tapToFlipPrompt: string;
  flipBackPrompt: string;
  nextCardPrompt: string;
  prevCardBtn: string;
  nextCardBtn: string;
  flipCardBtn: string;
  flipToQuestionBtn: string;
  quizSubtitle: string;
  questionLabel: string;
  fromLabel: string;
  correctAnswerMsg: string;
  incorrectAnswerMsg: string;
  explanationPrefix: string;
  nextQuestionBtn: string;
  viewResultBtn: string;
  quizResultTitle: string;
  perfectScoreTitle: string;
  perfectScoreMsg: string;
  goodScoreTitle: string;
  goodScoreMsg: string;
  tryAgainTitle: string;
  tryAgainMsg: string;
  retryBtn: string;
  reviewTitle: string;
  correctBadge: string;
  incorrectBadge: string;
  footerTitle: string;
  footerSubtitle: string;
  footerStats: string;
  optionLabels: [string, string, string, string];
  languageSelectorLabel: string;
  // Progress & Course Completion Translations
  overallProgressLabel: string;
  coursesCompletedLabel: string;
  markLessonCompleteBtn: string;
  lessonCompletedBadge: string;
  flashcardsCompletedBadge: string;
  quizPassedBadge: string;
  topicFullyCompletedBadge: string;
  viewChecklistBtn: string;
  certificateBtn: string;
  completionChecklistTitle: string;
  completionChecklistSubtitle: string;
  requiredToCompleteNotice: string;
  allCoursesCompletedCelebration: string;
  certificateTitle: string;
  certificateSubtitle: string;
  certificatePresentedTo: string;
  certificateDefaultStudent: string;
  certificateBodyText: string;
  certificatePrintBtn: string;
  closeBtn: string;
  resetProgressBtn: string;
  resetConfirmMsg: string;
  goToTopicBtn: string;
  statusCompleted: string;
  statusInProgress: string;
  statusNotStarted: string;
  // PDF Textbook Translations
  textbookBtn: string;
  downloadPdfBtn: string;
  printPdfBtn: string;
  textbookTableOfContents: string;
  unitLabel: string;
  gradeTextbookTitle: string;
  searchInTextbookPlaceholder: string;
  workedExamplesTitle: string;
  unitReviewQuestionsTitle: string;
  fontSizeLabel: string;
  downloadingPdfLabel: string;
  allSubjectsPdfLibraryTitle: string;
  selectGradeTextbookPrompt: string;
  officialCurriculumBadge: string;
  readingModeLabel: string;
  unitOutlineLabel: string;
  // New Ethiopian Curriculum Framework
  newCurriculumTag: string;
  newCurriculumTitle: string;
  newCurriculumSubtitle: string;
  newCurriculumRoadmapBtn: string;
  newCurriculumModalTitle: string;
  newCurriculumModalSubtitle: string;
  curriculumPillarsTab: string;
  curriculumStructureTab: string;
  curriculumPracticalTab: string;
  curriculumEsslceTab: string;
  allStreamsLabel: string;
  streamAll: string;
  naturalScienceStreamLabel: string;
  streamNatural: string;
  socialScienceStreamLabel: string;
  streamSocial: string;
  streamCommon: string;
  streamSelectorPrompt: string;
  competenciesTitle: string;
  practicalActivityTitle: string;
  practicalMaterialsLabel: string;
  practicalStepsLabel: string;
  practicalObservationLabel: string;
  twentyFirstCenturySkillsTitle: string;
  esslcePrepBadge: string;
}

