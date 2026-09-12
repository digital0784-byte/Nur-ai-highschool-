import { db } from '../lib/firebase';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  limit,
} from 'firebase/firestore';
import {
  EntranceQuestion,
  EntranceMockExam,
  EntranceMockAttempt,
  EntranceProgress,
  DiagnosticAttempt,
  StudyPlan,
  MistakeRecord,
  EntranceExamConfig,
  EntrancePastPaper,
  ReadinessLevel,
  QuestionDifficulty,
  EntranceStream,
  TopicPerformance,
} from '../types/entranceExam';
import { Grade } from '../types';
import {
  INITIAL_ENTRANCE_CONFIG,
  INITIAL_ENTRANCE_QUESTIONS,
  INITIAL_MOCK_EXAMS,
  INITIAL_PAST_PAPERS,
} from '../data/entranceExamData';

const LOCAL_STORAGE_KEYS = {
  CONFIG: 'nur_entrance_config_cache',
  QUESTIONS: 'nur_entrance_questions_cache',
  MOCK_EXAMS: 'nur_entrance_mock_exams_cache',
  PROGRESS: (userId: string) => `nur_entrance_progress_${userId}`,
  STUDY_PLAN: (userId: string) => `nur_entrance_study_plan_${userId}`,
  MISTAKES: (userId: string) => `nur_entrance_mistakes_${userId}`,
  DIAGNOSTICS: (userId: string) => `nur_entrance_diagnostics_${userId}`,
  ATTEMPTS: (userId: string) => `nur_entrance_attempts_${userId}`,
  PAST_PAPERS: 'nur_entrance_past_papers_cache',
};

class EntranceExamFirestoreService {
  // 1. CONFIGURATION
  async getExamConfig(): Promise<EntranceExamConfig> {
    try {
      if (db) {
        const docRef = doc(db, 'entrance_exam_configs', 'current');
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          const data = snap.data() as EntranceExamConfig;
          localStorage.setItem(LOCAL_STORAGE_KEYS.CONFIG, JSON.stringify(data));
          return data;
        }
      }
    } catch (e) {
      console.warn('[Entrance Service] Firestore config read error, falling back to cache:', e);
    }
    const cached = localStorage.getItem(LOCAL_STORAGE_KEYS.CONFIG);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (_) {}
    }
    return INITIAL_ENTRANCE_CONFIG;
  }

  async saveExamConfig(config: EntranceExamConfig): Promise<void> {
    localStorage.setItem(LOCAL_STORAGE_KEYS.CONFIG, JSON.stringify(config));
    try {
      if (db) {
        const docRef = doc(db, 'entrance_exam_configs', 'current');
        await setDoc(docRef, { ...config, updatedAt: new Date().toISOString() });
      }
    } catch (e) {
      console.warn('[Entrance Service] Failed to save config in Firestore:', e);
    }
  }

  // 2. QUESTION BANK
  async getQuestions(filter?: {
    grade?: Grade;
    subject?: string;
    stream?: EntranceStream;
    status?: string;
  }): Promise<EntranceQuestion[]> {
    let questions: EntranceQuestion[] = [];
    try {
      if (db) {
        const qRef = collection(db, 'entrance_question_banks');
        const snap = await getDocs(qRef);
        if (!snap.empty) {
          questions = snap.docs.map((d) => ({ id: d.id, ...d.data() } as EntranceQuestion));
        }
      }
    } catch (e) {
      console.warn('[Entrance Service] Firestore question bank fetch failed, using local seed:', e);
    }

    if (!questions.length) {
      const cached = localStorage.getItem(LOCAL_STORAGE_KEYS.QUESTIONS);
      if (cached) {
        try {
          questions = JSON.parse(cached);
        } catch (_) {}
      }
    }

    if (!questions.length) {
      questions = [...INITIAL_ENTRANCE_QUESTIONS];
      localStorage.setItem(LOCAL_STORAGE_KEYS.QUESTIONS, JSON.stringify(questions));
    }

    return questions.filter((q) => {
      if (filter?.grade && q.grade !== filter.grade) return false;
      if (filter?.subject && q.subject !== filter.subject) return false;
      if (filter?.stream && q.stream && q.stream !== 'common' && filter.stream !== 'common' && q.stream !== filter.stream) return false;
      if (filter?.status && q.status !== filter.status) return false;
      return true;
    });
  }

  async saveQuestion(question: EntranceQuestion): Promise<void> {
    const existing = await this.getQuestions();
    const idx = existing.findIndex((q) => q.id === question.id);
    if (idx >= 0) {
      existing[idx] = question;
    } else {
      existing.unshift(question);
    }
    localStorage.setItem(LOCAL_STORAGE_KEYS.QUESTIONS, JSON.stringify(existing));

    try {
      if (db) {
        const docRef = doc(db, 'entrance_question_banks', question.id);
        await setDoc(docRef, question);
      }
    } catch (e) {
      console.warn('[Entrance Service] Firestore saveQuestion error:', e);
    }
  }

  // 3. MOCK EXAMS
  async getMockExams(grade?: Grade, stream?: EntranceStream): Promise<EntranceMockExam[]> {
    let exams: EntranceMockExam[] = [];
    try {
      if (db) {
        const snap = await getDocs(collection(db, 'entrance_mock_exams'));
        if (!snap.empty) {
          exams = snap.docs.map((d) => ({ id: d.id, ...d.data() } as EntranceMockExam));
        }
      }
    } catch (e) {
      console.warn('[Entrance Service] Mock exams Firestore error:', e);
    }

    if (!exams.length) {
      const cached = localStorage.getItem(LOCAL_STORAGE_KEYS.MOCK_EXAMS);
      if (cached) {
        try {
          exams = JSON.parse(cached);
        } catch (_) {}
      }
    }

    if (!exams.length) {
      exams = [...INITIAL_MOCK_EXAMS];
      localStorage.setItem(LOCAL_STORAGE_KEYS.MOCK_EXAMS, JSON.stringify(exams));
    }

    return exams.filter((e) => {
      if (grade && e.grade !== grade) return false;
      if (stream && e.stream !== 'common' && e.stream !== stream) return false;
      return true;
    });
  }

  async saveMockExam(exam: EntranceMockExam): Promise<void> {
    const exams = await this.getMockExams();
    const idx = exams.findIndex((e) => e.id === exam.id);
    if (idx >= 0) {
      exams[idx] = exam;
    } else {
      exams.unshift(exam);
    }
    localStorage.setItem(LOCAL_STORAGE_KEYS.MOCK_EXAMS, JSON.stringify(exams));

    try {
      if (db) {
        await setDoc(doc(db, 'entrance_mock_exams', exam.id), exam);
      }
    } catch (e) {
      console.warn('[Entrance Service] Firestore saveMockExam error:', e);
    }
  }

  // 4. PROGRESS & READINESS MODEL
  async getProgress(userId: string, grade: Grade = 12, stream: EntranceStream = 'natural'): Promise<EntranceProgress> {
    try {
      if (db) {
        const docRef = doc(db, 'entrance_progress', userId);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          const data = snap.data() as EntranceProgress;
          localStorage.setItem(LOCAL_STORAGE_KEYS.PROGRESS(userId), JSON.stringify(data));
          return data;
        }
      }
    } catch (e) {
      console.warn('[Entrance Service] getProgress Firestore error:', e);
    }

    const cached = localStorage.getItem(LOCAL_STORAGE_KEYS.PROGRESS(userId));
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (_) {}
    }

    const initial: EntranceProgress = {
      userId,
      grade,
      stream,
      dailyStudyTimeMinutes: 0,
      questionsSolved: 0,
      accuracy: 0,
      topicsMastered: [],
      weakTopics: [],
      strongTopics: [],
      mockExamsTaken: 0,
      recentScores: [],
      studyStreak: 1,
      revisionSessionsCount: 0,
      readinessStatus: 'Developing',
      lastActiveDate: new Date().toISOString(),
      totalTimeSpentMinutes: 0,
    };
    return initial;
  }

  async updateProgress(progress: EntranceProgress): Promise<void> {
    // Recompute transparent readiness model based on measurable signals:
    progress.readinessStatus = this.calculateReadinessStatus(progress);
    localStorage.setItem(LOCAL_STORAGE_KEYS.PROGRESS(progress.userId), JSON.stringify(progress));

    try {
      if (db) {
        const docRef = doc(db, 'entrance_progress', progress.userId);
        await setDoc(docRef, progress);
      }
    } catch (e) {
      console.warn('[Entrance Service] updateProgress Firestore error:', e);
    }
  }

  calculateReadinessStatus(progress: EntranceProgress): ReadinessLevel {
    // Transparent readiness model:
    // 1. Accuracy weight (40%)
    // 2. Mock exam experience (25%)
    // 3. Questions solved volume (15%)
    // 4. Topics mastered ratio (20%)
    const acc = progress.accuracy || 0;
    const mocks = progress.mockExamsTaken || 0;
    const questions = progress.questionsSolved || 0;
    const mastered = progress.topicsMastered.length;
    const weakCount = progress.weakTopics.length;

    let score = 0;
    // Accuracy points (max 40)
    score += Math.min(40, (acc / 100) * 40);
    // Mock points (max 25)
    score += Math.min(25, mocks * 8);
    // Question volume points (max 15)
    score += Math.min(15, (questions / 40) * 15);
    // Mastered topics points (max 20)
    score += Math.min(20, mastered * 4);
    // Penalty for unresolved weak topics
    score -= Math.min(10, weakCount * 2);

    if (score >= 70 && acc >= 75 && mocks >= 2) {
      return 'Strong Preparation';
    }
    if (score >= 50 && acc >= 60) {
      return 'Good Progress';
    }
    if (score >= 25) {
      return 'Developing';
    }
    return 'Needs Improvement';
  }

  // 5. DIAGNOSTIC ASSESSMENT
  async saveDiagnosticAttempt(attempt: DiagnosticAttempt): Promise<void> {
    const key = LOCAL_STORAGE_KEYS.DIAGNOSTICS(attempt.userId);
    const existing: DiagnosticAttempt[] = JSON.parse(localStorage.getItem(key) || '[]');
    existing.unshift(attempt);
    localStorage.setItem(key, JSON.stringify(existing));

    try {
      if (db) {
        await setDoc(doc(db, 'diagnostic_attempts', attempt.attemptId), attempt);
      }
    } catch (e) {
      console.warn('[Entrance Service] saveDiagnosticAttempt Firestore error:', e);
    }

    // Automatically update student progress & generate personalized study plan
    const progress = await this.getProgress(attempt.userId, attempt.grade, attempt.stream);
    progress.accuracy = Math.round(
      (progress.accuracy * progress.questionsSolved + attempt.score) /
        Math.max(1, progress.questionsSolved + attempt.total)
    );
    progress.questionsSolved += attempt.total;
    progress.weakTopics = Array.from(new Set([...progress.weakTopics, ...attempt.weakTopics]));
    progress.strongTopics = Array.from(new Set([...progress.strongTopics, ...attempt.strongTopics]));
    progress.topicsMastered = Array.from(new Set([...progress.topicsMastered, ...attempt.strongTopics]));
    await this.updateProgress(progress);

    // Generate personalized study plan
    await this.generateStudyPlanFromDiagnostic(attempt);
  }

  async getDiagnosticAttempts(userId: string): Promise<DiagnosticAttempt[]> {
    const key = LOCAL_STORAGE_KEYS.DIAGNOSTICS(userId);
    try {
      if (db) {
        const qRef = collection(db, 'diagnostic_attempts');
        const q = query(qRef, where('userId', '==', userId), limit(10));
        const snap = await getDocs(q);
        if (!snap.empty) {
          const list = snap.docs.map((d) => d.data() as DiagnosticAttempt);
          localStorage.setItem(key, JSON.stringify(list));
          return list;
        }
      }
    } catch (e) {
      console.warn('[Entrance Service] getDiagnosticAttempts error:', e);
    }
    return JSON.parse(localStorage.getItem(key) || '[]');
  }

  // 6. STUDY PLAN
  async generateStudyPlanFromDiagnostic(
    diagnostic: DiagnosticAttempt,
    availableMinutes: number = 90
  ): Promise<StudyPlan> {
    const primaryWeak = diagnostic.weakTopics[0] || 'Limits and Continuity of Functions';
    const secondaryWeak = diagnostic.weakTopics[1] || 'Chemical Equilibrium & Le Chatelier Principle';
    const primaryPrereq = diagnostic.prerequisites[0] || 'Algebraic factoring and standard function behavior';

    const plan: StudyPlan = {
      id: `plan-${diagnostic.userId}-${Date.now()}`,
      userId: diagnostic.userId,
      grade: diagnostic.grade,
      stream: diagnostic.stream,
      availableStudyTimeMinutes: availableMinutes,
      examGoal: diagnostic.stream === 'natural' ? 'Target 600+ Score in Natural Science Composite' : 'Target High Distinction in Social Science Composite',
      diagnosticAttemptId: diagnostic.attemptId,
      weakTopics: diagnostic.weakTopics,
      prerequisiteTopics: diagnostic.prerequisites,
      dailyStructure: {
        conceptReview: {
          topic: primaryWeak,
          subject: 'Core Ethiopian Curriculum',
          durationMins: Math.round(availableMinutes * 0.3),
          completed: false,
          textbookRef: 'MoE Grade 11/12 Textbook Review Section',
        },
        practice: {
          topic: primaryWeak,
          questionsCount: Math.max(5, Math.round(availableMinutes / 10)),
          durationMins: Math.round(availableMinutes * 0.3),
          completed: false,
        },
        weakTopicRevision: {
          topic: secondaryWeak,
          reason: 'Diagnostic accuracy below 60% threshold',
          durationMins: Math.round(availableMinutes * 0.2),
          completed: false,
        },
        timedQuestions: {
          count: 5,
          durationMins: Math.round(availableMinutes * 0.1),
          completed: false,
        },
        reviewMistakes: {
          mistakeCount: 3,
          durationMins: Math.round(availableMinutes * 0.1),
          completed: false,
        },
      },
      weeklyMilestones: [
        { id: 'wm-1', day: 'Day 1', focus: 'Foundational Diagnostic & Prerequisite Recovery (' + primaryPrereq + ')', targetQuestions: 15, targetAccuracy: 65, completed: true },
        { id: 'wm-2', day: 'Day 2', focus: 'Concept Drilling on ' + primaryWeak, targetQuestions: 20, targetAccuracy: 70, completed: false },
        { id: 'wm-3', day: 'Day 3', focus: 'Secondary Revision on ' + secondaryWeak, targetQuestions: 20, targetAccuracy: 75, completed: false },
        { id: 'wm-4', day: 'Day 4', focus: 'Timed Quick Practice (Mixed Topics)', targetQuestions: 25, targetAccuracy: 80, completed: false },
        { id: 'wm-5', day: 'Day 5', focus: 'Mistake Book Remediation & AI Coach Consultation', targetQuestions: 15, targetAccuracy: 85, completed: false },
        { id: 'wm-6', day: 'Day 6', focus: 'Full Timed Model Mock Examination', targetQuestions: 40, targetAccuracy: 75, completed: false },
        { id: 'wm-7', day: 'Day 7', focus: 'Weekly Progress Review & Plan Adaptation', targetQuestions: 10, targetAccuracy: 85, completed: false },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await this.saveStudyPlan(plan);
    return plan;
  }

  async getStudyPlan(userId: string): Promise<StudyPlan | null> {
    const key = LOCAL_STORAGE_KEYS.STUDY_PLAN(userId);
    try {
      if (db) {
        const docRef = doc(db, 'study_plans', userId);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          const data = snap.data() as StudyPlan;
          localStorage.setItem(key, JSON.stringify(data));
          return data;
        }
      }
    } catch (e) {
      console.warn('[Entrance Service] getStudyPlan error:', e);
    }
    const cached = localStorage.getItem(key);
    return cached ? JSON.parse(cached) : null;
  }

  async saveStudyPlan(plan: StudyPlan): Promise<void> {
    const key = LOCAL_STORAGE_KEYS.STUDY_PLAN(plan.userId);
    localStorage.setItem(key, JSON.stringify(plan));
    try {
      if (db) {
        await setDoc(doc(db, 'study_plans', plan.userId), plan);
      }
    } catch (e) {
      console.warn('[Entrance Service] saveStudyPlan error:', e);
    }
  }

  // 7. MISTAKE BOOK
  async recordMistake(mistake: MistakeRecord): Promise<void> {
    const key = LOCAL_STORAGE_KEYS.MISTAKES(mistake.userId);
    const existing: MistakeRecord[] = JSON.parse(localStorage.getItem(key) || '[]');
    const idx = existing.findIndex((m) => m.questionId === mistake.questionId);
    if (idx >= 0) {
      existing[idx] = {
        ...existing[idx],
        retryCount: (existing[idx].retryCount || 1) + 1,
        attemptedAt: mistake.attemptedAt,
        userAnswer: mistake.userAnswer,
      };
    } else {
      existing.unshift(mistake);
    }
    localStorage.setItem(key, JSON.stringify(existing));

    try {
      if (db) {
        await setDoc(doc(db, 'mistake_book', `${mistake.userId}_${mistake.questionId}`), mistake);
      }
    } catch (e) {
      console.warn('[Entrance Service] recordMistake error:', e);
    }
  }

  async markMistakeUnderstood(userId: string, questionId: string): Promise<void> {
    const key = LOCAL_STORAGE_KEYS.MISTAKES(userId);
    const existing: MistakeRecord[] = JSON.parse(localStorage.getItem(key) || '[]');
    const target = existing.find((m) => m.questionId === questionId);
    if (target) {
      target.understood = true;
      localStorage.setItem(key, JSON.stringify(existing));
    }

    try {
      if (db) {
        await updateDoc(doc(db, 'mistake_book', `${userId}_${questionId}`), {
          understood: true,
        });
      }
    } catch (e) {
      console.warn('[Entrance Service] markMistakeUnderstood error:', e);
    }
  }

  async getMistakes(userId: string): Promise<MistakeRecord[]> {
    const key = LOCAL_STORAGE_KEYS.MISTAKES(userId);
    try {
      if (db) {
        const qRef = collection(db, 'mistake_book');
        const q = query(qRef, where('userId', '==', userId), limit(50));
        const snap = await getDocs(q);
        if (!snap.empty) {
          const list = snap.docs.map((d) => d.data() as MistakeRecord);
          localStorage.setItem(key, JSON.stringify(list));
          return list;
        }
      }
    } catch (e) {
      console.warn('[Entrance Service] getMistakes error:', e);
    }
    return JSON.parse(localStorage.getItem(key) || '[]');
  }

  // 8. MOCK EXAM ATTEMPTS
  async saveMockAttempt(attempt: EntranceMockAttempt): Promise<void> {
    const key = LOCAL_STORAGE_KEYS.ATTEMPTS(attempt.userId);
    const existing: EntranceMockAttempt[] = JSON.parse(localStorage.getItem(key) || '[]');
    existing.unshift(attempt);
    localStorage.setItem(key, JSON.stringify(existing));

    try {
      if (db) {
        await setDoc(doc(db, 'entrance_mock_attempts', attempt.id), attempt);
      }
    } catch (e) {
      console.warn('[Entrance Service] saveMockAttempt error:', e);
    }

    // Update student entrance progress
    const progress = await this.getProgress(attempt.userId, attempt.grade);
    progress.mockExamsTaken += 1;
    progress.recentScores.unshift(attempt.percentage);
    if (progress.recentScores.length > 5) progress.recentScores.pop();
    progress.questionsSolved += attempt.total;
    progress.accuracy = Math.round(
      (progress.accuracy * (progress.questionsSolved - attempt.total) + attempt.accuracy * attempt.total) /
        progress.questionsSolved
    );
    progress.weakTopics = Array.from(new Set([...progress.weakTopics, ...attempt.weakAreas]));
    progress.totalTimeSpentMinutes += Math.round(attempt.timeUsedSeconds / 60);
    await this.updateProgress(progress);
  }

  async getMockAttempts(userId: string): Promise<EntranceMockAttempt[]> {
    const key = LOCAL_STORAGE_KEYS.ATTEMPTS(userId);
    try {
      if (db) {
        const qRef = collection(db, 'entrance_mock_attempts');
        const q = query(qRef, where('userId', '==', userId), limit(20));
        const snap = await getDocs(q);
        if (!snap.empty) {
          const list = snap.docs.map((d) => d.data() as EntranceMockAttempt);
          localStorage.setItem(key, JSON.stringify(list));
          return list;
        }
      }
    } catch (e) {
      console.warn('[Entrance Service] getMockAttempts error:', e);
    }
    return JSON.parse(localStorage.getItem(key) || '[]');
  }

  // 9. PAST PAPERS
  async getPastPapers(): Promise<EntrancePastPaper[]> {
    try {
      if (db) {
        const snap = await getDocs(collection(db, 'entrance_past_papers'));
        if (!snap.empty) {
          return snap.docs.map((d) => d.data() as EntrancePastPaper);
        }
      }
    } catch (e) {
      console.warn('[Entrance Service] getPastPapers error:', e);
    }
    const cached = localStorage.getItem(LOCAL_STORAGE_KEYS.PAST_PAPERS);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (_) {}
    }
    return INITIAL_PAST_PAPERS;
  }

  async savePastPaper(paper: EntrancePastPaper): Promise<void> {
    const list = await this.getPastPapers();
    list.unshift(paper);
    localStorage.setItem(LOCAL_STORAGE_KEYS.PAST_PAPERS, JSON.stringify(list));
    try {
      if (db) {
        await setDoc(doc(db, 'entrance_past_papers', paper.id), paper);
      }
    } catch (e) {
      console.warn('[Entrance Service] savePastPaper error:', e);
    }
  }
}

export const entranceExamService = new EntranceExamFirestoreService();
