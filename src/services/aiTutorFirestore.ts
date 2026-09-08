import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import {
  AISessionItem,
  AIMessageItem,
  StudentMasteryRecord,
  StudentAnswerRecord,
  WeakTopicRecord,
  LearningRecommendationRecord,
  QuizAttemptRecord,
  ExamAttemptRecord,
} from '../types/aiTutor';

class AITutorFirestoreService {
  private getUserId(): string {
    return auth.currentUser?.uid || 'guest_student_' + (localStorage.getItem('guest_student_id') || this.initGuestId());
  }

  private initGuestId(): string {
    const id = Math.random().toString(36).substring(2, 9);
    localStorage.setItem('guest_student_id', id);
    return id;
  }

  // --- SESSIONS ---
  public async saveSession(session: AISessionItem): Promise<void> {
    try {
      if (auth.currentUser) {
        await setDoc(doc(db, 'ai_sessions', session.id), {
          ...session,
          updatedAt: serverTimestamp(),
        });
      }
    } catch (e) {
      console.warn('Firestore session write skipped, saving to localStorage:', e);
    }
    // Local backup
    const local = JSON.parse(localStorage.getItem('nur_ai_sessions') || '{}');
    local[session.id] = session;
    localStorage.setItem('nur_ai_sessions', JSON.stringify(local));
  }

  public async getSessions(): Promise<AISessionItem[]> {
    const userId = this.getUserId();
    try {
      if (auth.currentUser) {
        const q = query(
          collection(db, 'ai_sessions'),
          where('userId', '==', userId),
          orderBy('updatedAt', 'desc'),
          limit(20)
        );
        const snap = await getDocs(q);
        if (!snap.empty) {
          return snap.docs.map((d) => d.data() as AISessionItem);
        }
      }
    } catch (e) {
      console.warn('Firestore getSessions failed, loading from local:', e);
    }
    const local = JSON.parse(localStorage.getItem('nur_ai_sessions') || '{}');
    return Object.values(local);
  }

  // --- MESSAGES ---
  public async saveMessage(msg: AIMessageItem): Promise<void> {
    try {
      if (auth.currentUser) {
        await setDoc(doc(db, 'ai_messages', msg.id), {
          ...msg,
          timestamp: serverTimestamp(),
        });
      }
    } catch (e) {
      console.warn('Firestore message write skipped, saving locally:', e);
    }
    const key = `nur_ai_msgs_${msg.sessionId}`;
    const local: AIMessageItem[] = JSON.parse(localStorage.getItem(key) || '[]');
    local.push(msg);
    localStorage.setItem(key, JSON.stringify(local));
  }

  public async getMessages(sessionId: string): Promise<AIMessageItem[]> {
    try {
      if (auth.currentUser) {
        const q = query(
          collection(db, 'ai_messages'),
          where('sessionId', '==', sessionId),
          orderBy('timestamp', 'asc'),
          limit(50)
        );
        const snap = await getDocs(q);
        if (!snap.empty) {
          return snap.docs.map((d) => d.data() as AIMessageItem);
        }
      }
    } catch (e) {
      console.warn('Firestore getMessages failed, fallback to local:', e);
    }
    const key = `nur_ai_msgs_${sessionId}`;
    return JSON.parse(localStorage.getItem(key) || '[]');
  }

  // --- STUDENT MASTERY ---
  public async updateMastery(records: StudentMasteryRecord[]): Promise<void> {
    for (const rec of records) {
      try {
        if (auth.currentUser) {
          await setDoc(doc(db, 'student_mastery', rec.id), {
            ...rec,
            lastUpdated: serverTimestamp(),
          });
        }
      } catch (e) {
        console.warn('Firestore mastery write failed:', e);
      }
    }
    const local = JSON.parse(localStorage.getItem('nur_student_mastery') || '{}');
    records.forEach((r) => {
      local[r.topicId] = r;
    });
    localStorage.setItem('nur_student_mastery', JSON.stringify(local));
  }

  public async getMastery(): Promise<StudentMasteryRecord[]> {
    const userId = this.getUserId();
    try {
      if (auth.currentUser) {
        const q = query(collection(db, 'student_mastery'), where('userId', '==', userId));
        const snap = await getDocs(q);
        if (!snap.empty) {
          return snap.docs.map((d) => d.data() as StudentMasteryRecord);
        }
      }
    } catch (e) {
      console.warn('Firestore getMastery failed:', e);
    }
    const local = JSON.parse(localStorage.getItem('nur_student_mastery') || '{}');
    return Object.values(local);
  }

  // --- WEAK TOPICS ---
  public async saveWeakTopics(records: WeakTopicRecord[]): Promise<void> {
    for (const rec of records) {
      try {
        if (auth.currentUser) {
          await setDoc(doc(db, 'weak_topics', rec.id), {
            ...rec,
            detectedAt: serverTimestamp(),
          });
        }
      } catch (e) {
        console.warn('Firestore weak_topics write failed:', e);
      }
    }
    const local = JSON.parse(localStorage.getItem('nur_weak_topics') || '{}');
    records.forEach((r) => {
      local[r.topicId] = r;
    });
    localStorage.setItem('nur_weak_topics', JSON.stringify(local));
  }

  public async getWeakTopics(): Promise<WeakTopicRecord[]> {
    const userId = this.getUserId();
    try {
      if (auth.currentUser) {
        const q = query(collection(db, 'weak_topics'), where('userId', '==', userId));
        const snap = await getDocs(q);
        if (!snap.empty) {
          return snap.docs.map((d) => d.data() as WeakTopicRecord);
        }
      }
    } catch (e) {
      console.warn('Firestore getWeakTopics failed:', e);
    }
    const local = JSON.parse(localStorage.getItem('nur_weak_topics') || '{}');
    return Object.values(local);
  }

  // --- RECOMMENDATIONS ---
  public async saveRecommendations(records: LearningRecommendationRecord[]): Promise<void> {
    for (const rec of records) {
      try {
        if (auth.currentUser) {
          await setDoc(doc(db, 'recommendations', rec.id), {
            ...rec,
            generatedAt: serverTimestamp(),
          });
        }
      } catch (e) {
        console.warn('Firestore recommendations write failed:', e);
      }
    }
    localStorage.setItem('nur_recommendations', JSON.stringify(records));
  }

  public async getRecommendations(): Promise<LearningRecommendationRecord[]> {
    const userId = this.getUserId();
    try {
      if (auth.currentUser) {
        const q = query(collection(db, 'recommendations'), where('userId', '==', userId), limit(10));
        const snap = await getDocs(q);
        if (!snap.empty) {
          return snap.docs.map((d) => d.data() as LearningRecommendationRecord);
        }
      }
    } catch (e) {
      console.warn('Firestore getRecommendations failed:', e);
    }
    return JSON.parse(localStorage.getItem('nur_recommendations') || '[]');
  }

  // --- QUIZ & EXAM ATTEMPTS ---
  public async logQuizAttempt(attempt: QuizAttemptRecord): Promise<void> {
    try {
      if (auth.currentUser) {
        await setDoc(doc(db, 'quiz_attempts', attempt.id), {
          ...attempt,
          timestamp: serverTimestamp(),
        });
      }
    } catch (e) {
      console.warn('Firestore quiz attempt write failed:', e);
    }
    const local: QuizAttemptRecord[] = JSON.parse(localStorage.getItem('nur_quiz_attempts') || '[]');
    local.unshift(attempt);
    localStorage.setItem('nur_quiz_attempts', JSON.stringify(local.slice(0, 30)));
  }

  public async logExamAttempt(attempt: ExamAttemptRecord): Promise<void> {
    try {
      if (auth.currentUser) {
        await setDoc(doc(db, 'exam_attempts', attempt.id), {
          ...attempt,
          timestamp: serverTimestamp(),
        });
      }
    } catch (e) {
      console.warn('Firestore exam attempt write failed:', e);
    }
    const local: ExamAttemptRecord[] = JSON.parse(localStorage.getItem('nur_exam_attempts') || '[]');
    local.unshift(attempt);
    localStorage.setItem('nur_exam_attempts', JSON.stringify(local.slice(0, 30)));
  }
}

export const aiTutorFirestore = new AITutorFirestoreService();
