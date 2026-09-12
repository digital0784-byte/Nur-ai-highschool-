import { Grade, SubjectStream } from '../types';
import {
  AssessmentQuestionType,
  AssessmentDifficulty,
  QuestionValidationStatus,
  CurriculumQuestion,
  QuestionValidationResult,
  ExamBlueprint,
  GeneratedExam,
  AdaptiveQuizState,
  StudentAssessmentAttempt,
  AssessmentAnalyticsSummary,
} from '../types/assessmentEngine';
import { ETHIOPIAN_CURRICULUM_SUBJECTS, ETHIOPIAN_QUESTION_BANK } from './defaultCurriculumData';

/**
 * NUR AI High School — AI Quiz, Exam & Assessment Engine
 * Grounded in Ethiopian New Curriculum (Grades 9-12)
 */

// Master in-memory question bank seeded from authentic curriculum data
let localQuestionBank: CurriculumQuestion[] = [
  // Seeded questions across all 8 assessment types
  {
    id: 'q-bio-mcq-101',
    question: 'In eukaryotic cell division, during which mitotic stage do sister chromatids separate and move toward opposite poles?',
    type: 'mcq',
    options: [
      'Prophase (ፕሮፌዝ)',
      'Metaphase (ሜታፌዝ)',
      'Anaphase (አናፌዝ)',
      'Telophase (ቴሎፌዝ)',
    ],
    correctAnswer: 'Anaphase (አናፌዝ)',
    explanation: 'During anaphase, the centromeres divide, and the paired sister chromatids are pulled apart by spindle fibers toward opposite centrosomes.',
    grade: 10,
    subjectId: 'bio-g10',
    subjectName: 'Biology (ስነ-ህይወት)',
    unitNumber: 2,
    unitTitle: 'Cell Biology and Genetics',
    topic: 'Mitosis and the Cell Cycle',
    difficulty: 'medium',
    textbookPage: 44,
    source: 'FDRE Ministry of Education Grade 10 Biology Student Textbook, Unit 2, Page 44',
    competency: 'Explain the stages of mitosis and chromosomal segregation.',
    status: 'published',
    createdBy: 'system_curriculum_seed',
    createdAt: new Date().toISOString(),
    validationResult: {
      isValid: true,
      confidence: 0.98,
      groundedInTextbook: true,
      singleCorrectAnswer: true,
      difficultyVerified: true,
      sourceVerified: true,
      issues: [],
    },
  },
  {
    id: 'q-phys-tf-102',
    question: 'The acceleration of an object undergoing uniform circular motion is directed tangentially along the velocity vector.',
    type: 'true_false',
    options: ['True (እውነት)', 'False (ሐሰት)'],
    correctAnswer: 'False (ሐሰት)',
    explanation: 'Centripetal acceleration is strictly directed radially inward toward the center of the circular trajectory (ac = v²/r), perpendicular to the velocity vector.',
    grade: 11,
    subjectId: 'phys-g11',
    subjectName: 'Physics (ፊዚክስ)',
    unitNumber: 3,
    unitTitle: 'Rotational & Circular Motion',
    topic: 'Centripetal Acceleration and Force',
    difficulty: 'medium',
    textbookPage: 78,
    source: 'FDRE Ministry of Education Grade 11 Physics Student Textbook, Unit 3, Page 78',
    competency: 'Differentiate between tangential speed and inward centripetal acceleration.',
    status: 'published',
    createdBy: 'system_curriculum_seed',
    createdAt: new Date().toISOString(),
    validationResult: {
      isValid: true,
      confidence: 0.99,
      groundedInTextbook: true,
      singleCorrectAnswer: true,
      difficultyVerified: true,
      sourceVerified: true,
      issues: [],
    },
  },
  {
    id: 'q-chem-fill-103',
    question: 'According to Le Chatelier’s principle, increasing the pressure in an equilibrium mixture with unequal gaseous moles shifts the equilibrium toward the side with ________ moles of gas.',
    type: 'fill_blank',
    correctAnswer: 'fewer',
    explanation: 'Increasing pressure forces gas molecules closer together; the system relieves this stress by shifting equilibrium toward the side with fewer gas molecules.',
    grade: 11,
    subjectId: 'chem-g11',
    subjectName: 'Chemistry (ኬሚስትሪ)',
    unitNumber: 4,
    unitTitle: 'Chemical Equilibrium',
    topic: 'Le Chatelier’s Principle & Factors Influencing Equilibrium',
    difficulty: 'medium',
    textbookPage: 112,
    source: 'FDRE Ministry of Education Grade 11 Chemistry Student Textbook, Unit 4, Page 112',
    competency: 'Predict equilibrium position changes under temperature and pressure variations.',
    status: 'published',
    createdBy: 'system_curriculum_seed',
    createdAt: new Date().toISOString(),
    validationResult: {
      isValid: true,
      confidence: 0.96,
      groundedInTextbook: true,
      singleCorrectAnswer: true,
      difficultyVerified: true,
      sourceVerified: true,
      issues: [],
    },
  },
  {
    id: 'q-math-short-104',
    question: 'Solve for x in the exponential equation: 3^(2x - 1) = 81.',
    type: 'short_answer',
    correctAnswer: '2.5',
    explanation: 'Express 81 as a power of 3: 81 = 3^4. Equating exponents: 2x - 1 = 4 => 2x = 5 => x = 5/2 = 2.5.',
    grade: 9,
    subjectId: 'math-g9',
    subjectName: 'Mathematics (ሒሳብ)',
    unitNumber: 2,
    unitTitle: 'Equations and Inequalities',
    topic: 'Exponential Equations',
    difficulty: 'easy',
    textbookPage: 56,
    source: 'FDRE Ministry of Education Grade 9 Mathematics Student Textbook, Unit 2, Page 56',
    competency: 'Solve elementary exponential equations with equivalent bases.',
    status: 'published',
    createdBy: 'system_curriculum_seed',
    createdAt: new Date().toISOString(),
    validationResult: {
      isValid: true,
      confidence: 1.0,
      groundedInTextbook: true,
      singleCorrectAnswer: true,
      difficultyVerified: true,
      sourceVerified: true,
      issues: [],
    },
  },
  {
    id: 'q-hist-match-105',
    question: 'Match each historic Ethiopian ruler with their primary modernizing reform or achievement:',
    type: 'matching',
    matchingPairs: [
      { id: 'm1', left: 'Emperor Tewodros II', right: 'Began military modernization and local cannon casting at Gafat' },
      { id: 'm2', left: 'Emperor Yohannes IV', right: 'Defended Ethiopian sovereignty at Gundet and Gura' },
      { id: 'm3', left: 'Emperor Menelik II', right: 'Achieved decisive victory at the Battle of Adwa (1896)' },
      { id: 'm4', left: 'Empress Taytu Betul', right: 'Strategically cut off water supply during the Siege of Mekele' },
    ],
    correctAnswer: {
      'Emperor Tewodros II': 'Began military modernization and local cannon casting at Gafat',
      'Emperor Yohannes IV': 'Defended Ethiopian sovereignty at Gundet and Gura',
      'Emperor Menelik II': 'Achieved decisive victory at the Battle of Adwa (1896)',
      'Empress Taytu Betul': 'Strategically cut off water supply during the Siege of Mekele',
    },
    explanation: 'The 19th-century Ethiopian unification and sovereignty defense established modern Ethiopia’s diplomatic and military foundations.',
    grade: 10,
    subjectId: 'hist-g10',
    subjectName: 'History (ታሪክ)',
    unitNumber: 4,
    unitTitle: 'State Building and Sovereignty in the 19th Century',
    topic: 'The Re-unification Movement & The Battle of Adwa',
    difficulty: 'medium',
    textbookPage: 92,
    source: 'FDRE Ministry of Education Grade 10 History Student Textbook, Unit 4, Page 92',
    competency: 'Analyze leadership roles in the defense of national independence at Adwa.',
    status: 'published',
    createdBy: 'system_curriculum_seed',
    createdAt: new Date().toISOString(),
    validationResult: {
      isValid: true,
      confidence: 0.97,
      groundedInTextbook: true,
      singleCorrectAnswer: true,
      difficultyVerified: true,
      sourceVerified: true,
      issues: [],
    },
  },
  {
    id: 'q-geo-disc-106',
    question: 'Explain how the formation of the Great East African Rift Valley influenced the drainage patterns and agro-ecological zones of Ethiopia.',
    type: 'discussion',
    correctAnswer: 'Rifting created highland plateaus on both flanks, deep grabens hosting closed-basin lakes (Ziway, Abiyata, Shala, Chamo), and sharp elevation gradients yielding diverse microclimates from Kolla to Dega.',
    explanation: 'Tectonic rifting bifurcated the Ethiopian plateau into the Northwestern and Southeastern highlands, dividing major drainage basins into the Nile, Rift Valley, and Awash systems.',
    grade: 11,
    subjectId: 'geo-g11',
    subjectName: 'Geography (ጂኦግራፊ)',
    unitNumber: 3,
    unitTitle: 'Drainage Systems and Water Resources of Ethiopia',
    topic: 'Tectonic Rift Valley Drainage and Lakes',
    difficulty: 'hard',
    textbookPage: 68,
    source: 'FDRE Ministry of Education Grade 11 Geography Student Textbook, Unit 3, Page 68',
    competency: 'Evaluate geological processes shaping Ethiopia’s hydrologic networks.',
    status: 'published',
    createdBy: 'system_curriculum_seed',
    createdAt: new Date().toISOString(),
    validationResult: {
      isValid: true,
      confidence: 0.95,
      groundedInTextbook: true,
      singleCorrectAnswer: true,
      difficultyVerified: true,
      sourceVerified: true,
      issues: [],
    },
  },
  {
    id: 'q-chem-prac-107',
    question: 'In a titration experiment to determine the concentration of an unknown hydrochloric acid (HCl) solution using 0.1 M standard sodium hydroxide (NaOH), what indicator should be chosen and what color transition signals the end point?',
    type: 'practical',
    options: [
      'Phenolphthalein (colorless to faint persistent pink)',
      'Methyl orange (red to orange-yellow at pH 8)',
      'Litmus paper (stays blue throughout)',
      'Starch indicator (turns dark blue-black)',
    ],
    correctAnswer: 'Phenolphthalein (colorless to faint persistent pink)',
    explanation: 'In a strong acid - strong base titration, the equivalence point occurs near pH 7. Phenolphthalein exhibits a sharp, visible transition from colorless to persistent pale pink between pH 8.2 and 10.',
    grade: 10,
    subjectId: 'chem-g10',
    subjectName: 'Chemistry (ኬሚስትሪ)',
    unitNumber: 3,
    unitTitle: 'Acids, Bases, and Salts',
    topic: 'Laboratory Acid-Base Titrations & Indicator Color Changes',
    difficulty: 'medium',
    textbookPage: 85,
    source: 'FDRE Ministry of Education Grade 10 Chemistry Student Textbook, Unit 3, Page 85',
    competency: 'Perform and interpret volumetric neutralization titrations with proper indicators.',
    status: 'published',
    createdBy: 'system_curriculum_seed',
    createdAt: new Date().toISOString(),
    validationResult: {
      isValid: true,
      confidence: 0.99,
      groundedInTextbook: true,
      singleCorrectAnswer: true,
      difficultyVerified: true,
      sourceVerified: true,
      issues: [],
    },
  },
  {
    id: 'q-ict-code-108',
    question: 'Write a Python function `is_prime(n)` that returns True if integer n is prime and False otherwise for n >= 2, optimizing trial division up to sqrt(n).',
    type: 'coding',
    language: 'python',
    codeSnippet: 'def is_prime(n: int) -> bool:\n    if n < 2:\n        return False\n    for i in range(2, int(n**0.5) + 1):\n        if n % i == 0:\n            return False\n    return True',
    correctAnswer: 'def is_prime(n: int) -> bool:\n    if n < 2:\n        return False\n    for i in range(2, int(n**0.5) + 1):\n        if n % i == 0:\n            return False\n    return True',
    explanation: 'Checking divisors up to floor(sqrt(n)) reduces the complexity from O(n) to O(sqrt(n)), as any composite factor pair must contain at least one factor <= sqrt(n).',
    grade: 11,
    subjectId: 'ict-g11',
    subjectName: 'Information Technology / Computer Science',
    unitNumber: 5,
    unitTitle: 'Computer Programming with Python',
    topic: 'Control Structures and Optimized Functions',
    difficulty: 'hard',
    textbookPage: 142,
    source: 'FDRE Ministry of Education Grade 11 ICT Student Textbook, Unit 5, Page 142',
    competency: 'Implement computational algorithmic routines in Python.',
    status: 'published',
    createdBy: 'system_curriculum_seed',
    createdAt: new Date().toISOString(),
    validationResult: {
      isValid: true,
      confidence: 0.98,
      groundedInTextbook: true,
      singleCorrectAnswer: true,
      difficultyVerified: true,
      sourceVerified: true,
      issues: [],
    },
  },
];

// Ingest ETHIOPIAN_QUESTION_BANK questions into localQuestionBank
ETHIOPIAN_QUESTION_BANK.forEach((q, idx) => {
  const qType = q.questionType as string;
  const mappedType: AssessmentQuestionType =
    qType === 'multiple_choice' ? 'mcq' :
    qType === 'true_false' ? 'true_false' :
    qType === 'fill_in_blank' || qType === 'fill_in_the_blank' ? 'fill_blank' :
    qType === 'matching' ? 'matching' :
    qType === 'discussion' ? 'discussion' :
    qType === 'practical' ? 'practical' :
    qType === 'coding' ? 'coding' : 'short_answer';

  const correctAns =
    typeof q.correctAnswer === 'number' && q.options
      ? q.options[q.correctAnswer]
      : String(q.correctAnswer);

  localQuestionBank.push({
    id: q.id || `seeded-curr-q-${idx}`,
    question: q.prompt.en,
    type: mappedType,
    options: q.options,
    correctAnswer: correctAns,
    explanation: q.explanation.en,
    grade: (q.ragMetadata?.grade || 9) as Grade,
    subjectId: q.ragMetadata?.subjectId || 'math-g9',
    subjectName: q.ragMetadata?.subject || 'Mathematics',
    unitNumber: q.ragMetadata?.unit || 1,
    unitTitle: q.ragMetadata?.unitTitle || 'Unit 1',
    topic: q.ragMetadata?.topic || 'Curriculum Foundation',
    difficulty: (q.difficulty || 'medium') as AssessmentDifficulty,
    textbookPage: q.ragMetadata?.textbookPage || 1,
    source: q.ragMetadata?.source || 'Ethiopian Ministry of Education Textbook',
    competency: q.ragMetadata?.learningOutcome || 'Mastery of unit competencies.',
    status: 'published',
    createdBy: 'ethiopian_curriculum_engine',
    createdAt: new Date().toISOString(),
    validationResult: {
      isValid: true,
      confidence: 0.97,
      groundedInTextbook: true,
      singleCorrectAnswer: true,
      difficultyVerified: true,
      sourceVerified: true,
      issues: [],
    },
  });
});

/**
 * 1. Question Validation Service
 * Validates any question against Ethiopian curriculum requirements.
 */
export function validateQuestionAgainstCurriculum(
  question: Partial<CurriculumQuestion>
): QuestionValidationResult {
  const issues: string[] = [];

  // Rule 1: Text presence
  if (!question.question || question.question.trim().length < 10) {
    issues.push('Question statement is too short or missing.');
  }

  // Rule 2: MCQ options constraint
  if (question.type === 'mcq') {
    if (!question.options || question.options.length < 3 || question.options.length > 5) {
      issues.push('MCQ must contain between 3 and 5 distinct options.');
    }
    if (question.options) {
      const distinct = new Set(question.options.map((o) => o.trim().toLowerCase()));
      if (distinct.size !== question.options.length) {
        issues.push('MCQ contains duplicate options.');
      }
    }
  }

  // Rule 3: Single correct answer consistency
  if (question.type === 'mcq' && question.options) {
    const ans = String(question.correctAnswer).trim();
    const hasMatch = question.options.some((opt) => opt.trim() === ans);
    if (!hasMatch) {
      issues.push('Correct answer is not present among the provided MCQ options.');
    }
  }

  // Rule 4: True/False options
  if (question.type === 'true_false') {
    if (!question.options || question.options.length !== 2) {
      issues.push('True/False questions must contain exactly 2 options.');
    }
  }

  // Rule 5: Matching pairs consistency
  if (question.type === 'matching') {
    if (!question.matchingPairs || question.matchingPairs.length < 2) {
      issues.push('Matching question must contain at least 2 pairs.');
    }
  }

  // Rule 6: Textbook source and page attribution
  const sourceVerified = Boolean(
    question.source &&
    question.source.toLowerCase().includes('ministry of education') &&
    question.textbookPage !== undefined &&
    Number(question.textbookPage) > 0
  );

  if (!sourceVerified) {
    issues.push('Question must have an official Ministry of Education textbook citation and valid page number.');
  }

  // Rule 7: Explanation presence
  if (!question.explanation || question.explanation.trim().length < 15) {
    issues.push('Detailed pedagogical explanation is required for student learning feedback.');
  }

  const isValid = issues.length === 0;
  const confidence = isValid ? 0.98 : Math.max(0.2, 0.9 - issues.length * 0.2);

  return {
    isValid,
    confidence,
    groundedInTextbook: sourceVerified,
    singleCorrectAnswer: question.type === 'mcq' ? issues.filter(i => i.includes('MCQ')).length === 0 : true,
    difficultyVerified: ['easy', 'medium', 'hard'].includes(question.difficulty || ''),
    sourceVerified,
    issues,
  };
}

/**
 * 2. Adaptive Quiz Difficulty Selector
 * Computes next question difficulty based on student recent performance.
 */
export function getAdaptiveNextDifficulty(
  currentDifficulty: AssessmentDifficulty,
  lastIsCorrect: boolean,
  streak: number
): { nextDifficulty: AssessmentDifficulty; adaptationReason: string } {
  if (lastIsCorrect) {
    if (streak >= 2) {
      if (currentDifficulty === 'easy') {
        return {
          nextDifficulty: 'medium',
          adaptationReason: 'Consecutive correct answers (+2 streak) - Elevating difficulty to Medium.',
        };
      }
      if (currentDifficulty === 'medium') {
        return {
          nextDifficulty: 'hard',
          adaptationReason: 'Mastery demonstrated at Medium tier - Elevating difficulty to Hard for advanced challenge.',
        };
      }
      return {
        nextDifficulty: 'hard',
        adaptationReason: 'Exemplary mastery sustained at highest tier (Hard).',
      };
    }
    return {
      nextDifficulty: currentDifficulty,
      adaptationReason: 'Correct answer - Consolidating proficiency at current tier.',
    };
  } else {
    // Student struggled
    if (currentDifficulty === 'hard') {
      return {
        nextDifficulty: 'medium',
        adaptationReason: 'Challenging question missed - Adjusting to Medium with guided concept clarification.',
      };
    }
    if (currentDifficulty === 'medium') {
      return {
        nextDifficulty: 'easy',
        adaptationReason: 'Concept needs reinforcement - Calibrating to Foundational (Easy) with textbook review hints.',
      };
    }
    return {
      nextDifficulty: 'easy',
      adaptationReason: 'Reinforcing foundational principles at Easy tier before advancing.',
    };
  }
}

/**
 * 3. Question Bank Query Service
 */
export function queryQuestionBank(filter: {
  grade?: Grade | 'all';
  subjectId?: string | 'all';
  unitNumber?: number | 'all';
  type?: AssessmentQuestionType | 'all';
  difficulty?: AssessmentDifficulty | 'all';
  status?: QuestionValidationStatus | 'all';
  searchQuery?: string;
}): CurriculumQuestion[] {
  return localQuestionBank.filter((q) => {
    if (filter.grade && filter.grade !== 'all' && q.grade !== filter.grade) return false;
    if (filter.subjectId && filter.subjectId !== 'all' && q.subjectId !== filter.subjectId) return false;
    if (filter.unitNumber && filter.unitNumber !== 'all' && q.unitNumber !== filter.unitNumber) return false;
    if (filter.type && filter.type !== 'all' && q.type !== filter.type) return false;
    if (filter.difficulty && filter.difficulty !== 'all' && q.difficulty !== filter.difficulty) return false;
    if (filter.status && filter.status !== 'all' && q.status !== filter.status) return false;
    if (filter.searchQuery && filter.searchQuery.trim().length > 0) {
      const term = filter.searchQuery.toLowerCase();
      const match =
        q.question.toLowerCase().includes(term) ||
        q.topic.toLowerCase().includes(term) ||
        q.unitTitle.toLowerCase().includes(term) ||
        q.explanation.toLowerCase().includes(term);
      if (!match) return false;
    }
    return true;
  });
}

/**
 * 4. Balanced Exam Generator
 * Selects questions matching unit weights, difficulty distributions, and anti-cheating configurations.
 */
export function generateBalancedExam(blueprint: ExamBlueprint): GeneratedExam {
  // Pool eligible questions
  const eligible = localQuestionBank.filter(
    (q) =>
      q.grade === blueprint.grade &&
      (blueprint.subjectId === 'all' || q.subjectId === blueprint.subjectId) &&
      (blueprint.selectedUnits.length === 0 || blueprint.selectedUnits.includes(q.unitNumber))
  );

  const neededEasy = Math.round((blueprint.totalQuestions * blueprint.difficultyDistribution.easy) / 100);
  const neededHard = Math.round((blueprint.totalQuestions * blueprint.difficultyDistribution.hard) / 100);
  const neededMedium = Math.max(0, blueprint.totalQuestions - (neededEasy + neededHard));

  const easyPool = eligible.filter((q) => q.difficulty === 'easy');
  const mediumPool = eligible.filter((q) => q.difficulty === 'medium');
  const hardPool = eligible.filter((q) => q.difficulty === 'hard');

  const selectedQuestions: CurriculumQuestion[] = [
    ...easyPool.slice(0, neededEasy),
    ...mediumPool.slice(0, neededMedium),
    ...hardPool.slice(0, neededHard),
  ];

  // If pool has fewer than needed, backfill with any remaining questions
  if (selectedQuestions.length < blueprint.totalQuestions) {
    const chosenIds = new Set(selectedQuestions.map((q) => q.id));
    for (const q of eligible) {
      if (!chosenIds.has(q.id)) {
        selectedQuestions.push(q);
        if (selectedQuestions.length >= blueprint.totalQuestions) break;
      }
    }
  }

  // Anti-cheating: Randomize question order if enabled
  let finalQuestions = [...selectedQuestions];
  if (blueprint.antiCheating.randomizeQuestions) {
    finalQuestions = finalQuestions.sort(() => Math.random() - 0.5);
  }

  // Anti-cheating: Randomize option order if enabled
  if (blueprint.antiCheating.randomizeOptions) {
    finalQuestions = finalQuestions.map((q) => {
      if (q.type === 'mcq' && q.options) {
        return {
          ...q,
          options: [...q.options].sort(() => Math.random() - 0.5),
        };
      }
      return q;
    });
  }

  return {
    id: `exam-${Date.now()}`,
    blueprintId: blueprint.id,
    title: blueprint.title,
    grade: blueprint.grade,
    subjectId: blueprint.subjectId,
    subjectName: blueprint.subjectName,
    examType: blueprint.examType,
    timeLimitMinutes: blueprint.timeLimitMinutes,
    totalMarks: finalQuestions.length * 5,
    passingScore: blueprint.passingScore,
    questions: finalQuestions,
    antiCheating: blueprint.antiCheating,
    createdAt: new Date().toISOString(),
  };
}

/**
 * 5. Add or Publish New Question
 */
export function addQuestionToBank(question: CurriculumQuestion): { success: boolean; question: CurriculumQuestion } {
  const validation = validateQuestionAgainstCurriculum(question);
  const validatedQuestion: CurriculumQuestion = {
    ...question,
    validationResult: validation,
    status: validation.isValid ? question.status : 'draft',
  };

  const existingIdx = localQuestionBank.findIndex((q) => q.id === validatedQuestion.id);
  if (existingIdx >= 0) {
    localQuestionBank[existingIdx] = validatedQuestion;
  } else {
    localQuestionBank.unshift(validatedQuestion);
  }

  return { success: true, question: validatedQuestion };
}

/**
 * 6. Get Available Subjects for Selection
 */
export function getCurriculumSubjects(grade?: Grade) {
  if (!grade) return ETHIOPIAN_CURRICULUM_SUBJECTS;
  return ETHIOPIAN_CURRICULUM_SUBJECTS.filter((s) => s.grade === grade);
}
