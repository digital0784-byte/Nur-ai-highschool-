import {
  GradeLevel,
  SupportedLanguage,
  DifficultyLevel,
  CurriculumSubjectItem,
  CurriculumUnit,
  CurriculumTopic,
  CurriculumQuestion,
} from '../types/curriculumEngine';
import {
  SearchFilters,
  SearchResultItem,
  SearchContentType,
  CurriculumRecommendation,
  AIIntentAnalysis,
  RecommendationType,
} from '../types/searchAndRecommendations';
import { ethiopianCurriculumEngine } from './curriculumRegistry';

// Simple Levenshtein distance for typo-tolerant matching
function levenshteinDistance(a: string, b: string): number {
  const an = a ? a.length : 0;
  const bn = b ? b.length : 0;
  if (an === 0) return bn;
  if (bn === 0) return an;
  const matrix = new Array<number[]>(bn + 1);
  for (let i = 0; i <= bn; ++i) {
    let row = (matrix[i] = new Array<number>(an + 1));
    row[0] = i;
  }
  const firstRow = matrix[0];
  for (let j = 1; j <= an; ++j) {
    firstRow[j] = j;
  }
  for (let i = 1; i <= bn; ++i) {
    for (let j = 1; j <= an; ++j) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }
  return matrix[bn][an];
}

// Check if two tokens are similar (exact, substring, or typo within distance 1 or 2)
function isFuzzyMatch(target: string, queryToken: string): { matches: boolean; scoreBonus: number } {
  const t = target.toLowerCase();
  const q = queryToken.toLowerCase();

  if (t === q) return { matches: true, scoreBonus: 10 };
  if (t.includes(q)) return { matches: true, scoreBonus: 6 };
  if (q.length > 3 && t.length > 3) {
    const dist = levenshteinDistance(t, q);
    if (dist === 1) return { matches: true, scoreBonus: 4 };
    if (q.length > 5 && dist === 2) return { matches: true, scoreBonus: 2 };
  }
  return { matches: false, scoreBonus: 0 };
}

// Multilingual term dictionary mapping curriculum terms across Amharic, Afaan Oromo, Tigrinya, English
const CURRICULUM_SYNONYM_DICTIONARY: Record<string, string[]> = {
  cell: ['ሕዋስ', 'ሴል', 'lubbiyyoo', 'ህዋስ', 'mitosis', 'cytology'],
  biology: ['ስነ-ህይወት', 'ስነ ህይወት', 'baayoloojii', 'ስነ-ህይወት'],
  mathematics: ['ሂሳብ', 'ሒሳብ', 'herrega', 'ሒሳብ', 'math', 'maths'],
  physics: ['ፊዚክስ', 'fiiziksii', 'ፊዚክስ', 'motion', 'force'],
  chemistry: ['ኬሚስትሪ', 'kemistirii', 'ኬሚስትሪ', 'reaction', 'periodic'],
  quadratic: ['ኳድራቲክ', 'ካልኣይ ዲግሪ', 'quadratic', 'equation'],
  ecosystem: ['ስነ-ምህዳር', 'ikoo-siistama', 'ስነ ምህዳር'],
  photosynthesis: ['ፎቶሲንተሲስ', 'ፎቶሲንቴሲስ', 'footoosinteesisi'],
  mitosis: ['ማይቶሲስ', 'ማይቶሲስ', 'cell division'],
  meiosis: ['ሜዮሲስ', 'ሜዮሲስ'],
  genetics: ['ዘረመል', 'ጄኔቲክስ', 'dhaala'],
  polynomial: ['ፖሊኖሚያል', 'ፖሊኖሚያል'],
  trigonometry: ['ትሪጎኖሜትሪ', 'ትሪጎኖሜትሪ'],
  vector: ['ቬክተር', 'ቬክተር'],
  kinematics: ['ኪነማቲክስ', 'ኪነማቲክስ', 'እንቅስቃሴ'],
};

export class SearchAndRecommendationEngine {
  /**
   * Search across all Ethiopian curriculum artifacts with smart ranking
   */
  public searchCurriculum(
    query: string,
    filters: SearchFilters = {},
    userContext?: {
      studentGrade?: GradeLevel;
      weakTopics?: string[];
      completedLessons?: string[];
    }
  ): SearchResultItem[] {
    const trimmed = query.trim();
    if (!trimmed && (!filters.subjectId || filters.subjectId === 'all') && (!filters.grade || filters.grade === 'all')) {
      return [];
    }

    const queryLower = trimmed.toLowerCase();
    const queryTokens = queryLower.split(/\s+/).filter((t) => t.length > 0);

    // Check for page number search pattern (e.g., "page 42", "p. 52", "p42")
    const pageMatch = queryLower.match(/(?:page|p\.?|ገጽ)\s*(\d+)/i);
    const targetPage = pageMatch ? parseInt(pageMatch[1], 10) : null;

    const subjects = ethiopianCurriculumEngine.getAllSubjects();
    const results: SearchResultItem[] = [];

    // Filter by subject & grade early if requested
    const targetSubjects = subjects.filter((s) => {
      if (filters.grade && filters.grade !== 'all' && s.grade !== filters.grade) return false;
      if (filters.subjectId && filters.subjectId !== 'all' && s.id !== filters.subjectId) return false;
      return true;
    });

    for (const subj of targetSubjects) {
      for (const unit of subj.units) {
        if (filters.unit && filters.unit !== 'all' && unit.unitNumber !== filters.unit) continue;

        // 1. UNIT RESULT EVALUATION
        if (!filters.contentType || filters.contentType === 'all' || filters.contentType === 'unit') {
          let unitScore = 0;
          const matchReasons: string[] = [];

          // Page match check
          if (targetPage !== null && unit.textbookPageStart <= targetPage && unit.textbookPageEnd >= targetPage) {
            unitScore += 50;
            matchReasons.push(`Textbook page ${targetPage} falls within this Unit`);
          }

          // Text token matching on Unit
          queryTokens.forEach((tok) => {
            const mEn = isFuzzyMatch(unit.title.en, tok);
            const mAm = isFuzzyMatch(unit.title.am || '', tok);
            const mSubj = isFuzzyMatch(subj.name.en, tok);
            const mSubjAm = isFuzzyMatch(subj.name.am || '', tok);
            const mDesc = isFuzzyMatch(unit.description, tok);

            if (mEn.matches) {
              unitScore += 15 + mEn.scoreBonus;
              matchReasons.push(`Unit Title: "${unit.title.en}"`);
            }
            if (mAm.matches) {
              unitScore += 15 + mAm.scoreBonus;
              matchReasons.push(`የምዕራፍ ርዕስ: "${unit.title.am}"`);
            }
            if (mSubj.matches || mSubjAm.matches) {
              unitScore += 8;
            }
            if (mDesc.matches) {
              unitScore += 5;
            }

            // Check synonyms
            for (const [key, synonyms] of Object.entries(CURRICULUM_SYNONYM_DICTIONARY)) {
              if (synonyms.some((s) => s.toLowerCase() === tok || tok.includes(s.toLowerCase()))) {
                if (unit.title.en.toLowerCase().includes(key) || unit.description.toLowerCase().includes(key)) {
                  unitScore += 12;
                  matchReasons.push(`Multilingual match on curriculum concept "${key}"`);
                }
              }
            }
          });

          // Grade boost if matching student context
          if (userContext?.studentGrade && subj.grade === userContext.studentGrade) {
            unitScore += 5;
          }

          if (unitScore > 0 || (queryTokens.length === 0 && (filters.subjectId || filters.grade))) {
            results.push({
              id: `unit-${unit.id}`,
              title: `Unit ${unit.unitNumber}: ${unit.title.en}`,
              amharicTitle: `ምዕራፍ ${unit.unitNumber}: ${unit.title.am}`,
              grade: subj.grade,
              subjectId: subj.id,
              subjectName: subj.name.en,
              unitNumber: unit.unitNumber,
              unitTitle: unit.title.en,
              contentType: 'unit',
              shortExplanation: unit.description,
              textbookPage: `pp. ${unit.textbookPageStart} - ${unit.textbookPageEnd}`,
              source: `${subj.textbookTitle} (${subj.textbookPublisher})`,
              relevanceScore: unitScore,
              matchReason: matchReasons.length > 0 ? matchReasons[0] : 'Curriculum Unit Match',
            });
          }
        }

        // 2. SECTIONS, LESSONS & TOPICS EVALUATION
        for (const sec of unit.sections) {
          for (const lesson of sec.lessons) {
            for (const topic of lesson.topics) {
              if (filters.difficulty && filters.difficulty !== 'all' && topic.difficulty !== filters.difficulty) {
                continue;
              }

              // Check content types
              const wantsTopics = !filters.contentType || filters.contentType === 'all' || filters.contentType === 'topic';
              const wantsLessons = !filters.contentType || filters.contentType === 'all' || filters.contentType === 'lesson';

              if (wantsTopics || wantsLessons) {
                let topicScore = 0;
                const matchReasons: string[] = [];

                // Direct page match
                if (targetPage !== null && topic.textbookPage === targetPage) {
                  topicScore += 60;
                  matchReasons.push(`Exact Textbook Page: ${targetPage}`);
                }

                // Exact phrase match
                if (trimmed && topic.title.en.toLowerCase().includes(queryLower)) {
                  topicScore += 40;
                  matchReasons.push(`Exact Title Match: "${topic.title.en}"`);
                } else if (trimmed && topic.title.am && topic.title.am.toLowerCase().includes(queryLower)) {
                  topicScore += 40;
                  matchReasons.push(`ቀጥተኛ የርዕስ ግጥጥሞሽ: "${topic.title.am}"`);
                }

                // Token level matching
                queryTokens.forEach((tok) => {
                  const mTopicEn = isFuzzyMatch(topic.title.en, tok);
                  const mTopicAm = isFuzzyMatch(topic.title.am || '', tok);
                  const mSummary = isFuzzyMatch(topic.summary, tok);
                  const mCore = isFuzzyMatch(topic.explanations?.coreConcepts?.join(' ') || '', tok);

                  if (mTopicEn.matches) {
                    topicScore += 20 + mTopicEn.scoreBonus;
                    matchReasons.push(`Topic Title Match`);
                  }
                  if (mTopicAm.matches) {
                    topicScore += 20 + mTopicAm.scoreBonus;
                    matchReasons.push(`የአርዕስት ግጥጥሞሽ`);
                  }
                  if (mSummary.matches) {
                    topicScore += 8 + mSummary.scoreBonus;
                  }
                  if (mCore.matches) {
                    topicScore += 10 + mCore.scoreBonus;
                    matchReasons.push(`Core Concept Match`);
                  }

                  // Multilingual synonyms
                  for (const [key, synonyms] of Object.entries(CURRICULUM_SYNONYM_DICTIONARY)) {
                    if (synonyms.some((s) => s.toLowerCase() === tok || tok.includes(s.toLowerCase()))) {
                      if (
                        topic.title.en.toLowerCase().includes(key) ||
                        topic.summary.toLowerCase().includes(key) ||
                        (topic.explanations?.coreConcepts || []).some((c) => c.toLowerCase().includes(key))
                      ) {
                        topicScore += 15;
                        matchReasons.push(`Curriculum concept match for "${key}"`);
                      }
                    }
                  }
                });

                // Context relevance boost
                if (userContext?.studentGrade && subj.grade === userContext.studentGrade) {
                  topicScore += 8;
                }
                if (userContext?.weakTopics && userContext.weakTopics.includes(topic.id)) {
                  topicScore += 6; // Prioritize student's diagnosed weak topics
                }

                if (topicScore > 0) {
                  results.push({
                    id: `topic-${topic.id}`,
                    title: topic.title.en,
                    amharicTitle: topic.title.am,
                    grade: subj.grade,
                    subjectId: subj.id,
                    subjectName: subj.name.en,
                    unitNumber: unit.unitNumber,
                    unitTitle: unit.title.en,
                    sectionTitle: sec.title.en,
                    lessonTitle: lesson.title.en,
                    topicTitle: topic.title.en,
                    topicId: topic.id,
                    contentType: 'topic',
                    shortExplanation: topic.summary || topic.explanations?.overview || '',
                    textbookPage: topic.textbookPage,
                    source: `${subj.textbookTitle} (Page ${topic.textbookPage})`,
                    difficulty: topic.difficulty,
                    relevanceScore: topicScore,
                    matchReason: matchReasons.length > 0 ? matchReasons[0] : 'Curriculum Concept Match',
                    highlights: topic.explanations?.coreConcepts?.slice(0, 3) || [],
                    prerequisites: topic.prerequisites,
                  });
                }
              }

              // 3. EXERCISES EVALUATION
              if ((!filters.contentType || filters.contentType === 'all' || filters.contentType === 'exercise') && topic.exercises) {
                for (const ex of topic.exercises) {
                  let exScore = 0;
                  const probTexts = ex.problems.map((p) => p.text).join(' ');
                  queryTokens.forEach((tok) => {
                    const mEx = isFuzzyMatch(probTexts, tok);
                    if (mEx.matches) {
                      exScore += 10 + mEx.scoreBonus;
                    }
                  });

                  if (targetPage !== null && topic.textbookPage === targetPage) {
                    exScore += 30;
                  }

                  if (exScore > 0) {
                    results.push({
                      id: `exercise-${ex.id}`,
                      title: `Exercise ${ex.exerciseNumber}: ${topic.title.en}`,
                      amharicTitle: `መልመጃ ${ex.exerciseNumber}: ${topic.title.am}`,
                      grade: subj.grade,
                      subjectId: subj.id,
                      subjectName: subj.name.en,
                      unitNumber: unit.unitNumber,
                      unitTitle: unit.title.en,
                      sectionTitle: sec.title.en,
                      lessonTitle: lesson.title.en,
                      topicTitle: topic.title.en,
                      topicId: topic.id,
                      contentType: 'exercise',
                      shortExplanation: ex.title || `Textbook practice exercise with ${ex.problems.length} problems.`,
                      textbookPage: topic.textbookPage,
                      source: `${subj.textbookTitle} (Exercise ${ex.exerciseNumber})`,
                      difficulty: topic.difficulty,
                      relevanceScore: exScore,
                      matchReason: `Curriculum Exercise Match`,
                      exerciseData: {
                        exerciseNumber: ex.exerciseNumber,
                        problemCount: ex.problems.length,
                      },
                    });
                  }
                }
              }
            }
          }
        }
      }
    }

    // 4. QUESTIONS / ASSESSMENT EVALUATION
    if (!filters.contentType || filters.contentType === 'all' || filters.contentType === 'question' || filters.contentType === 'assessment') {
      const questions = ethiopianCurriculumEngine.getQuestions();
      for (const q of questions) {
        if (filters.grade && filters.grade !== 'all' && q.ragMetadata.grade !== filters.grade) continue;
        if (filters.subjectId && filters.subjectId !== 'all' && q.ragMetadata.subjectId !== filters.subjectId) continue;
        if (filters.unit && filters.unit !== 'all' && q.ragMetadata.unit !== filters.unit) continue;
        if (filters.difficulty && filters.difficulty !== 'all' && q.difficulty !== filters.difficulty) continue;

        let qScore = 0;
        const promptEn = q.prompt.en;
        const promptAm = q.prompt.am;
        const expl = q.explanation?.en || '';

        queryTokens.forEach((tok) => {
          const mEn = isFuzzyMatch(promptEn, tok);
          const mAm = isFuzzyMatch(promptAm, tok);
          const mExpl = isFuzzyMatch(expl, tok);
          if (mEn.matches) qScore += 12 + mEn.scoreBonus;
          if (mAm.matches) qScore += 12 + mAm.scoreBonus;
          if (mExpl.matches) qScore += 6;
        });

        if (targetPage !== null && String(q.ragMetadata.textbookPage) === String(targetPage)) {
          qScore += 35;
        }

        if (qScore > 0) {
          results.push({
            id: `question-${q.id}`,
            title: `[Question] ${q.prompt.en.slice(0, 75)}...`,
            amharicTitle: `[ጥያቄ] ${q.prompt.am.slice(0, 75)}...`,
            grade: q.ragMetadata.grade,
            subjectId: q.ragMetadata.subjectId,
            subjectName: q.ragMetadata.subject,
            unitNumber: q.ragMetadata.unit,
            unitTitle: q.ragMetadata.unitTitle,
            sectionTitle: q.ragMetadata.section,
            lessonTitle: q.ragMetadata.lesson,
            topicTitle: q.ragMetadata.topic,
            contentType: 'question',
            shortExplanation: q.prompt.en,
            textbookPage: q.ragMetadata.textbookPage,
            source: q.ragMetadata.source,
            difficulty: q.difficulty,
            relevanceScore: qScore,
            matchReason: 'Curriculum Question Bank Match',
            questionData: {
              questionType: q.questionType,
              prompt: q.prompt.en,
              options: q.options,
              correctAnswer: q.correctAnswer,
              explanation: q.explanation.en,
            },
          });
        }
      }
    }

    // Rank results strictly according to Requirement 12:
    // 1. Exact relevance
    // 2. Curriculum relevance
    // 3. Grade relevance
    // 4. Subject relevance
    // 5. Topic relevance
    // 6. Student learning context
    return results.sort((a, b) => b.relevanceScore - a.relevanceScore);
  }

  /**
   * Rule-based personalized recommendations engine according to Section 5 & 6
   */
  public generatePersonalizedRecommendations(params: {
    userId: string;
    studentGrade: GradeLevel;
    progressMap: Record<string, { lessonCompleted?: boolean; quizCompleted?: boolean; quizScore?: number; quizTotal?: number }>;
    weakTopics?: Array<{ topicId: string; topicTitle: string; subjectName: string; missingConcept?: string }>;
    learningGoal?: string;
  }): CurriculumRecommendation[] {
    const { userId, studentGrade, progressMap, weakTopics = [] } = params;
    const recommendations: CurriculumRecommendation[] = [];

    const gradeSubjects = ethiopianCurriculumEngine.getSubjectsByGrade(studentGrade);
    const now = new Date().toISOString();

    // RULE 1: If topic is weak -> recommend REVISION (High Priority)
    weakTopics.forEach((w, idx) => {
      // Look up topic metadata
      let matchedTopic: CurriculumTopic | null = null;
      let matchedSubject: CurriculumSubjectItem | null = null;
      let matchedUnit: CurriculumUnit | null = null;

      for (const subj of gradeSubjects) {
        for (const unit of subj.units) {
          for (const sec of unit.sections) {
            for (const lesson of sec.lessons) {
              const found = lesson.topics.find((t) => t.id === w.topicId || t.title.en.toLowerCase() === w.topicTitle.toLowerCase());
              if (found) {
                matchedTopic = found;
                matchedSubject = subj;
                matchedUnit = unit;
                break;
              }
            }
            if (matchedTopic) break;
          }
          if (matchedTopic) break;
        }
        if (matchedTopic) break;
      }

      const title = matchedTopic ? matchedTopic.title.en : w.topicTitle;
      const amTitle = matchedTopic ? matchedTopic.title.am : w.topicTitle;
      const subjName = matchedSubject ? matchedSubject.name.en : w.subjectName;
      const subjId = matchedSubject ? matchedSubject.id : 'biology';
      const unitNum = matchedUnit ? matchedUnit.unitNumber : 1;
      const unitTitle = matchedUnit ? matchedUnit.title.en : 'Curriculum Fundamentals';
      const page = matchedTopic ? matchedTopic.textbookPage : 25;

      recommendations.push({
        id: `rec-weak-${w.topicId}-${idx}`,
        userId,
        type: 'revision',
        contentId: w.topicId,
        title: `Revision: ${title}`,
        amharicTitle: `ክለሳ፡ ${amTitle}`,
        grade: studentGrade,
        subjectId: subjId,
        subjectName: subjName,
        unitNumber: unitNum,
        unitTitle,
        topicTitle: title,
        reason: `Diagnosed weak area (${w.missingConcept || 'Quiz score below threshold'}). Review core concepts before moving forward.`,
        amharicReason: `በፈተና ደካማ ውጤት የታየበት አርዕስት ነው። ወደሚቀጥለው ከመሄድዎ በፊት ዋና ፅንሰ-ሀሳቦችን ይከልሱ።`,
        priority: 'high',
        createdAt: now,
        status: 'pending',
        textbookPage: page,
        xpReward: 35,
        targetActionLabel: 'Review Textbook & Summary',
      });
    });

    // RULE 2 & 3: Evaluate mastered vs in-progress vs next lesson & prerequisites
    for (const subj of gradeSubjects) {
      for (const unit of subj.units) {
        for (const sec of unit.sections) {
          for (const lesson of sec.lessons) {
            for (const topic of lesson.topics) {
              const prog = progressMap[topic.id];
              const isCompleted = prog?.lessonCompleted;
              const isQuizPassed = (prog?.quizCompleted && (prog?.quizScore || 0) / (prog?.quizTotal || 1) >= 0.75);

              // If completed and mastered -> recommend NEXT TOPIC or RECOMMENDED QUIZ
              if (isCompleted && !prog?.quizCompleted) {
                recommendations.push({
                  id: `rec-quiz-${topic.id}`,
                  userId,
                  type: 'quiz',
                  contentId: topic.id,
                  title: `Mastery Quiz: ${topic.title.en}`,
                  amharicTitle: `የእውቀት ምዘና፡ ${topic.title.am}`,
                  grade: studentGrade,
                  subjectId: subj.id,
                  subjectName: subj.name.en,
                  unitNumber: unit.unitNumber,
                  unitTitle: unit.title.en,
                  topicTitle: topic.title.en,
                  reason: `You finished the lesson for "${topic.title.en}". Take the unit quiz to prove concept mastery.`,
                  amharicReason: `ትምህርቱን አጠናቀዋል! ፅንሰ-ሀሳቡን በሚገባ መረዳትዎን በፈተና ያረጋግጡ።`,
                  priority: 'medium',
                  createdAt: now,
                  status: 'pending',
                  textbookPage: topic.textbookPage,
                  xpReward: 50,
                  targetActionLabel: 'Start Practice Quiz',
                });
              }

              // Check if prerequisite is incomplete
              if (!isCompleted && topic.prerequisites && topic.prerequisites.length > 0) {
                const missingPrereq = topic.prerequisites.find((pId) => !progressMap[pId]?.lessonCompleted);
                if (missingPrereq) {
                  // Recommend prerequisite first
                  recommendations.push({
                    id: `rec-prereq-${missingPrereq}-${topic.id}`,
                    userId,
                    type: 'revision',
                    contentId: missingPrereq,
                    title: `Prerequisite Required: ${topic.title.en}`,
                    amharicTitle: `ቅድመ-ትምህርት ያስፈልጋል፡ ${topic.title.am}`,
                    grade: studentGrade,
                    subjectId: subj.id,
                    subjectName: subj.name.en,
                    unitNumber: unit.unitNumber,
                    unitTitle: unit.title.en,
                    topicTitle: topic.title.en,
                    reason: `Before starting "${topic.title.en}", Ethiopian curriculum requires mastering foundational prerequisite "${missingPrereq}".`,
                    amharicReason: `ወደዚህ ትምህርት ከመሸጋገርዎ በፊት መሠረታዊ የሆነውን ቅድመ-ትምህርት ማጠናቀቅ ይኖርብዎታል።`,
                    priority: 'high',
                    createdAt: now,
                    status: 'pending',
                    textbookPage: topic.textbookPage,
                    xpReward: 30,
                    targetActionLabel: 'Study Prerequisite',
                  });
                }
              }

              // If not completed and no blocking prerequisite -> recommend as NEXT LESSON
              if (!isCompleted && recommendations.filter((r) => r.type === 'next_lesson' && r.subjectId === subj.id).length === 0) {
                recommendations.push({
                  id: `rec-next-${topic.id}`,
                  userId,
                  type: 'next_lesson',
                  contentId: topic.id,
                  title: `Next Up: ${topic.title.en}`,
                  amharicTitle: `ቀጣይ ትምህርት፡ ${topic.title.am}`,
                  grade: studentGrade,
                  subjectId: subj.id,
                  subjectName: subj.name.en,
                  unitNumber: unit.unitNumber,
                  unitTitle: unit.title.en,
                  topicTitle: topic.title.en,
                  reason: `Sequentially next curriculum lesson in ${subj.name.en}, Unit ${unit.unitNumber}.`,
                  amharicReason: `በሥርዓተ-ትምህርቱ መሠረት ቀጣዩ የታቀደ ትምህርት ነው።`,
                  priority: 'medium',
                  createdAt: now,
                  status: 'pending',
                  textbookPage: topic.textbookPage,
                  xpReward: 25,
                  targetActionLabel: 'Open Lesson',
                });
              }

              // Practice questions recommendation for in-progress topics
              if (isCompleted && isQuizPassed && recommendations.filter((r) => r.type === 'practice_questions').length < 2) {
                recommendations.push({
                  id: `rec-practice-${topic.id}`,
                  userId,
                  type: 'practice_questions',
                  contentId: topic.id,
                  title: `Practice Questions: ${topic.title.en}`,
                  amharicTitle: `የልምምድ ጥያቄዎች፡ ${topic.title.am}`,
                  grade: studentGrade,
                  subjectId: subj.id,
                  subjectName: subj.name.en,
                  unitNumber: unit.unitNumber,
                  unitTitle: unit.title.en,
                  topicTitle: topic.title.en,
                  reason: `Strengthen your mastery with targeted FDRE MoE textbook exercises.`,
                  amharicReason: `የመማሪያ መጽሐፍ ልምምድ ጥያቄዎችን በመስራት እውቀትዎን ያዳብሩ።`,
                  priority: 'low',
                  createdAt: now,
                  status: 'pending',
                  textbookPage: topic.textbookPage,
                  xpReward: 20,
                  targetActionLabel: 'Solve Exercises',
                });
              }
            }
          }
        }
      }
    }

    // Sort: High priority first, then medium, then low
    const priorityWeight: Record<string, number> = { high: 3, medium: 2, low: 1 };
    return recommendations
      .sort((a, b) => priorityWeight[b.priority] - priorityWeight[a.priority])
      .slice(0, 8);
  }

  /**
   * AI Intent Parser for Natural Language Search Queries
   * Query -> Understand intent -> Identify Grade/Subject/Topic -> Retrieve curriculum
   */
  public parseNaturalLanguageIntent(query: string): AIIntentAnalysis {
    const qLower = query.toLowerCase();

    // 1. Detect Grade
    let detectedGrade: GradeLevel | undefined;
    if (qLower.includes('grade 9') || qLower.includes('9ኛ ክፍል')) detectedGrade = 9;
    else if (qLower.includes('grade 10') || qLower.includes('10ኛ ክፍል')) detectedGrade = 10;
    else if (qLower.includes('grade 11') || qLower.includes('11ኛ ክፍል')) detectedGrade = 11;
    else if (qLower.includes('grade 12') || qLower.includes('12ኛ ክፍል')) detectedGrade = 12;

    // 2. Detect Subject
    let detectedSubject: string | undefined;
    let detectedSubjectId: string | undefined;
    if (qLower.includes('biology') || qLower.includes('ባዮሎጂ') || qLower.includes('ስነ-ህይወት')) {
      detectedSubject = 'Biology';
      detectedSubjectId = 'biology';
    } else if (qLower.includes('math') || qLower.includes('mathematics') || qLower.includes('ሂሳብ')) {
      detectedSubject = 'Mathematics';
      detectedSubjectId = 'mathematics';
    } else if (qLower.includes('physics') || qLower.includes('ፊዚክስ')) {
      detectedSubject = 'Physics';
      detectedSubjectId = 'physics';
    } else if (qLower.includes('chemistry') || qLower.includes('ኬሚስትሪ')) {
      detectedSubject = 'Chemistry';
      detectedSubjectId = 'chemistry';
    } else if (qLower.includes('english') || qLower.includes('እንግሊዝኛ')) {
      detectedSubject = 'English';
      detectedSubjectId = 'english';
    }

    // 3. Detect Unit or Page
    const pageMatch = qLower.match(/(?:page|p\.?|ገጽ)\s*(\d+)/i);
    const detectedPageNumber = pageMatch ? parseInt(pageMatch[1], 10) : undefined;

    const unitMatch = qLower.match(/(?:unit|ምዕራፍ)\s*(\d+)/i);
    const detectedUnitNumber = unitMatch ? parseInt(unitMatch[1], 10) : undefined;

    // 4. Classify Intent
    let intent: AIIntentAnalysis['intent'] = 'general_search';
    if (qLower.includes('explain') || qLower.includes('what is') || qLower.includes('አብራራልኝ') || qLower.includes('ምን ማለት ነው')) {
      intent = 'explain_concept';
    } else if (qLower.includes('practice question') || qLower.includes('give me question') || qLower.includes('ጥያቄ') || qLower.includes('ፈተና')) {
      intent = 'practice_questions';
    } else if (qLower.includes('show me') || qLower.includes('topics about') || qLower.includes('አሳየኝ') || qLower.includes('ርዕሶች')) {
      intent = 'list_topics';
    } else if (detectedUnitNumber) {
      intent = 'find_unit';
    }

    // Clean keywords
    const stopWords = new Set(['explain', 'show', 'me', 'the', 'about', 'give', 'for', 'this', 'topic', 'topics', 'in', 'grade', 'class', 'ጥያቄ', 'አሳየኝ']);
    const tokens = qLower
      .replace(/[^\w\s\u1200-\u137F]/g, ' ')
      .split(/\s+/)
      .filter((t) => t.length > 2 && !stopWords.has(t));

    const detectedTopic = tokens.join(' ');

    return {
      intent,
      detectedGrade,
      detectedSubject,
      detectedSubjectId,
      detectedTopic: detectedTopic.length > 0 ? detectedTopic : undefined,
      detectedUnitNumber,
      detectedPageNumber,
      searchKeywords: tokens,
      canAskAITutor: true,
      tutorStarterPrompt: `As an Ethiopian Secondary AI Tutor, explain: "${query}" aligned with the FDRE Ministry of Education textbook.`,
    };
  }
}

export const searchAndRecommendationEngine = new SearchAndRecommendationEngine();
