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

export interface Topic {
  id: string;
  title: string;
  gradeTier: '9-10' | '11-12';
  applicableGrades: Grade[];
  lessonTitle: string;
  lessonContent: string[]; // Array of paragraphs
  keyPoints?: string[];
  flashcards: Flashcard[]; // 4 flashcards
  quizQuestions: QuizQuestion[]; // 4 questions
}

export interface Subject {
  id: string;
  name: string;          // e.g. "ሂሳብ", "Mathematics", "ሒሳብ", "Herrega", "الرياضيات", "Xisaab"
  subName: string;       // Secondary name/translation
  accentColor: string;   // e.g. "#1D4ED8"
  accentLight: string;   // e.g. "#EFF6FF"
  accentBorder: string;  // e.g. "#2563EB"
  accentBadge: string;
  topics: Topic[];       // 2 topics (one 9-10, one 11-12)
}

export type ActiveTab = 'lesson' | 'flashcards' | 'quiz';

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
  tabFlashcards: string;
  tabQuiz: string;
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
}
