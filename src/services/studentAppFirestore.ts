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
  StudentProfileData,
  StudentTopicMastery,
  StudentProgressSummary,
  StudentRecommendationItem,
  StudentMasteryLevel,
  OfflineCachedUnit,
} from '../types/studentApp';
import { GradeLevel, DifficultyLevel } from '../types/curriculumEngine';
import { ethiopianCurriculumEngine } from '../engine/curriculumRegistry';
import { offlineSyncEngine } from './offlineSyncEngine';

class StudentAppFirestoreService {
  private isOnline: boolean = typeof navigator !== 'undefined' ? navigator.onLine : true;
  private syncQueueKey = 'nur_student_offline_sync_queue';
  private offlineUnitsKey = 'nur_student_cached_units';

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        this.isOnline = true;
        this.processOfflineQueue();
      });
      window.addEventListener('offline', () => {
        this.isOnline = false;
      });
    }
  }

  public getUserId(): string {
    return auth.currentUser?.uid || localStorage.getItem('nur_student_uid') || this.initGuestUid();
  }

  private initGuestUid(): string {
    const id = 'student_' + Math.random().toString(36).substring(2, 10);
    localStorage.setItem('nur_student_uid', id);
    return id;
  }

  // ===================== PROFILE & SETTINGS =====================
  public async getStudentProfile(): Promise<StudentProfileData> {
    const uid = this.getUserId();
    const local = localStorage.getItem(`nur_profile_${uid}`);
    let defaultProfile: StudentProfileData = {
      uid,
      displayName: auth.currentUser?.displayName || 'ተማሪ (High School Student)',
      email: auth.currentUser?.email || 'student@nur.edu.et',
      grade: 9,
      preferredLanguage: 'am',
      schoolName: 'NUR AI High School',
      avatarSeed: 'Felix',
      lowDataMode: false,
      darkMode: false,
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString(),
    };

    if (local) {
      try {
        defaultProfile = { ...defaultProfile, ...JSON.parse(local) };
      } catch (e) {
        console.warn('Failed parsing local profile:', e);
      }
    }

    if (auth.currentUser && this.isOnline) {
      try {
        const snap = await getDoc(doc(db, 'students', uid));
        if (snap.exists()) {
          const remote = snap.data() as Partial<StudentProfileData>;
          defaultProfile = { ...defaultProfile, ...remote };
          localStorage.setItem(`nur_profile_${uid}`, JSON.stringify(defaultProfile));
        } else {
          // Initialize in Firestore
          await setDoc(doc(db, 'students', uid), {
            ...defaultProfile,
            createdAt: serverTimestamp(),
            lastActive: serverTimestamp(),
          });
        }
      } catch (err) {
        console.warn('Firestore profile fetch skipped, using offline cache:', err);
      }
    }

    return defaultProfile;
  }

  public async updateStudentProfile(updates: Partial<StudentProfileData>): Promise<void> {
    const uid = this.getUserId();
    const current = await this.getStudentProfile();
    const updated = { ...current, ...updates, lastActive: new Date().toISOString() };

    localStorage.setItem(`nur_profile_${uid}`, JSON.stringify(updated));

    if (auth.currentUser && this.isOnline) {
      try {
        await setDoc(doc(db, 'students', uid), {
          ...updated,
          lastActive: serverTimestamp(),
        }, { merge: true });
      } catch (err) {
        this.enqueueOfflineAction('updateProfile', { uid, updates });
      }
    } else {
      this.enqueueOfflineAction('updateProfile', { uid, updates });
    }
  }

  // ===================== TOPIC MASTERY & ADAPTIVITY =====================
  public async getTopicMastery(topicId: string): Promise<StudentTopicMastery | null> {
    const uid = this.getUserId();
    const cacheKey = `nur_mastery_${uid}_${topicId}`;
    const local = localStorage.getItem(cacheKey);
    if (local) {
      try {
        return JSON.parse(local);
      } catch (e) {}
    }

    if (auth.currentUser && this.isOnline) {
      try {
        const snap = await getDoc(doc(db, 'student_mastery', `${uid}_${topicId}`));
        if (snap.exists()) {
          const remote = snap.data() as StudentTopicMastery;
          localStorage.setItem(cacheKey, JSON.stringify(remote));
          return remote;
        }
      } catch (e) {
        console.warn('Firestore getTopicMastery failed:', e);
      }
    }

    return null;
  }

  public async getAllTopicMasteries(subjectId?: string): Promise<StudentTopicMastery[]> {
    const uid = this.getUserId();
    const localAll: StudentTopicMastery[] = [];

    // Check localStorage keys
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(`nur_mastery_${uid}_`)) {
        try {
          const item: StudentTopicMastery = JSON.parse(localStorage.getItem(key) || '{}');
          if (!subjectId || item.subjectId === subjectId) {
            localAll.push(item);
          }
        } catch (e) {}
      }
    }

    if (auth.currentUser && this.isOnline) {
      try {
        const q = query(collection(db, 'student_mastery'), where('userId', '==', uid));
        const snap = await getDocs(q);
        if (!snap.empty) {
          const remote = snap.docs.map((d) => d.data() as StudentTopicMastery);
          remote.forEach((r) => {
            localStorage.setItem(`nur_mastery_${uid}_${r.topicId}`, JSON.stringify(r));
          });
          return subjectId ? remote.filter((r) => r.subjectId === subjectId) : remote;
        }
      } catch (e) {
        console.warn('Firestore getAllTopicMasteries failed:', e);
      }
    }

    return localAll;
  }

  public async recordLearningProgress(
    topicId: string,
    topicTitle: string,
    subjectId: string,
    grade: GradeLevel,
    timeSpentSeconds: number,
    completed: boolean = true
  ): Promise<StudentTopicMastery> {
    const uid = this.getUserId();
    const current = (await this.getTopicMastery(topicId)) || {
      topicId,
      topicTitle,
      subjectId,
      grade,
      masteryLevel: 'not_started',
      masteryScore: 0,
      correctCount: 0,
      incorrectCount: 0,
      attemptsCount: 0,
      totalTimeSpentSeconds: 0,
      completed: false,
      lastStudiedAt: new Date().toISOString(),
      difficultySuggested: 'medium',
      needsRevision: false,
    };

    current.totalTimeSpentSeconds += timeSpentSeconds;
    current.lastStudiedAt = new Date().toISOString();
    if (completed) current.completed = true;

    if (current.masteryLevel === 'not_started') {
      current.masteryLevel = 'learning';
      current.masteryScore = 50;
    }

    // Save locally
    localStorage.setItem(`nur_mastery_${uid}_${topicId}`, JSON.stringify(current));

    // Save to Firestore
    if (auth.currentUser && this.isOnline) {
      try {
        await setDoc(doc(db, 'student_mastery', `${uid}_${topicId}`), {
          ...current,
          userId: uid,
          lastUpdated: serverTimestamp(),
        }, { merge: true });

        // Update student_progress summary
        await setDoc(doc(db, 'student_progress', `${uid}_${subjectId}`), {
          userId: uid,
          subjectId,
          lastStudiedTopicId: topicId,
          lastStudiedTopicTitle: topicTitle,
          lastUpdated: serverTimestamp(),
        }, { merge: true });
      } catch (err) {
        this.enqueueOfflineAction('recordProgress', { uid, topicId, current });
      }
    } else {
      this.enqueueOfflineAction('recordProgress', { uid, topicId, current });
    }

    return current;
  }

  public async recordQuizResult(
    topicId: string,
    topicTitle: string,
    subjectId: string,
    grade: GradeLevel,
    correctCount: number,
    totalCount: number,
    timeSpentSeconds: number
  ): Promise<{ mastery: StudentTopicMastery; recommendations: StudentRecommendationItem[] }> {
    const uid = this.getUserId();
    const current = (await this.getTopicMastery(topicId)) || {
      topicId,
      topicTitle,
      subjectId,
      grade,
      masteryLevel: 'not_started',
      masteryScore: 0,
      correctCount: 0,
      incorrectCount: 0,
      attemptsCount: 0,
      totalTimeSpentSeconds: 0,
      completed: false,
      lastStudiedAt: new Date().toISOString(),
      difficultySuggested: 'medium',
      needsRevision: false,
    };

    current.attemptsCount += 1;
    current.correctCount += correctCount;
    current.incorrectCount += totalCount - correctCount;
    current.totalTimeSpentSeconds += timeSpentSeconds;
    current.lastStudiedAt = new Date().toISOString();

    const percentage = Math.round((correctCount / totalCount) * 100);
    // Exponential smoothing for continuous mastery score
    current.masteryScore = current.attemptsCount === 1
      ? percentage
      : Math.round(current.masteryScore * 0.4 + percentage * 0.6);

    // Adaptive Mastery Level Classification:
    // Not Started | Learning | Developing | Mastered
    if (current.masteryScore >= 80) {
      current.masteryLevel = 'mastered';
      current.difficultySuggested = 'hard';
      current.needsRevision = false;
    } else if (current.masteryScore >= 60) {
      current.masteryLevel = 'developing';
      current.difficultySuggested = 'medium';
      current.needsRevision = false;
    } else {
      current.masteryLevel = 'learning';
      current.difficultySuggested = 'easy';
      current.needsRevision = true;
    }

    // Save mastery
    localStorage.setItem(`nur_mastery_${uid}_${topicId}`, JSON.stringify(current));

    // Generate Adaptive Recommendations
    const recommendations: StudentRecommendationItem[] = [];
    const knowledgeMap = ethiopianCurriculumEngine.getKnowledgeMap(subjectId);
    const node = knowledgeMap?.nodes.find((n) => n.topicId === topicId);

    if (current.needsRevision) {
      // Find prerequisite topic if any
      const prereqId = node?.prerequisites?.[0];
      const prereqNode = prereqId ? knowledgeMap?.nodes.find((n) => n.id === prereqId) : undefined;

      recommendations.push({
        id: `rec_${Date.now()}_rev`,
        type: prereqNode ? 'next_prerequisite' : 'revision',
        subjectId,
        subjectName: subjectId.split('-')[0].toUpperCase(),
        topicId: prereqNode ? prereqNode.topicId : topicId,
        topicTitle: prereqNode ? (prereqNode.amharicLabel || prereqNode.label) : topicTitle,
        grade,
        reason: prereqNode
          ? `ተማሪው በ"${topicTitle}" (${percentage}%) ክፍተት ስላሳየ፣ መሰረታዊ ቅድመ-ተፈላጊውን "${prereqNode.label}" መከለስ ቅድሚያ ይሰጠዋል።`
          : `በዚህ ርዕስ ላይ የተፈጠረውን ክፍተት ለማስተካከል ቀለል ያሉ ምሳሌዎችን በድጋሚ መስራት ይመከራል።`,
        targetDifficulty: 'easy',
        generatedAt: new Date().toISOString(),
      });
    } else if (current.masteryLevel === 'mastered') {
      // Find next node in DAG
      const nextEdge = knowledgeMap?.edges.find((e) => {
        const fromNode = knowledgeMap.nodes.find((n) => n.id === e.from);
        return fromNode?.topicId === topicId;
      });

      if (nextEdge) {
        const nextNode = knowledgeMap.nodes.find((n) => n.id === nextEdge.to);
        if (nextNode) {
          recommendations.push({
            id: `rec_${Date.now()}_adv`,
            type: 'advance_topic',
            subjectId,
            subjectName: subjectId.split('-')[0].toUpperCase(),
            topicId: nextNode.topicId,
            topicTitle: nextNode.amharicLabel || nextNode.label,
            grade,
            reason: `ተማሪው በ"${topicTitle}" የላቀ ውጤት (${percentage}%) ስላስመዘገበ፣ ወደ ቀጣዩ የላቀ ርዕስ "${nextNode.label}" መሸጋገር ይችላሉ።`,
            targetDifficulty: 'hard',
            generatedAt: new Date().toISOString(),
          });
        }
      }
    }

    // Save recommendations locally
    const existingRecs = this.getLocalRecommendations();
    localStorage.setItem(
      `nur_recommendations_${uid}`,
      JSON.stringify([...recommendations, ...existingRecs].slice(0, 15))
    );

    // Sync to Firestore
    if (auth.currentUser && this.isOnline) {
      try {
        await setDoc(doc(db, 'student_mastery', `${uid}_${topicId}`), {
          ...current,
          userId: uid,
          lastUpdated: serverTimestamp(),
        });

        await setDoc(doc(db, 'quiz_attempts', `quiz_${Date.now()}`), {
          userId: uid,
          topicId,
          topicTitle,
          subjectId,
          score: correctCount,
          totalQuestions: totalCount,
          percentage,
          masteryLevel: current.masteryLevel,
          timestamp: serverTimestamp(),
        });

        for (const rec of recommendations) {
          await setDoc(doc(db, 'recommendations', rec.id), {
            ...rec,
            userId: uid,
            createdAt: serverTimestamp(),
          });
        }
      } catch (err) {
        this.enqueueOfflineAction('recordQuiz', { uid, current, percentage });
      }
    }

    return { mastery: current, recommendations };
  }

  public getLocalRecommendations(): StudentRecommendationItem[] {
    const uid = this.getUserId();
    const local = localStorage.getItem(`nur_recommendations_${uid}`);
    if (local) {
      try {
        return JSON.parse(local);
      } catch (e) {}
    }
    return [];
  }

  public async getProgressSummary(grade: GradeLevel): Promise<StudentProgressSummary> {
    const masteries = await this.getAllTopicMasteries();
    const totalLessonsCompleted = masteries.filter((m) => m.completed).length;
    const totalStudyMinutes = Math.round(
      masteries.reduce((acc, m) => acc + m.totalTimeSpentSeconds, 0) / 60
    );
    const masteredCount = masteries.filter((m) => m.masteryLevel === 'mastered').length;
    const developingCount = masteries.filter((m) => m.masteryLevel === 'developing').length;
    const weakCount = masteries.filter((m) => m.needsRevision).length;

    const quizAttempts = masteries.filter((m) => m.attemptsCount > 0);
    const averageQuizScore =
      quizAttempts.length > 0
        ? Math.round(
            quizAttempts.reduce((acc, m) => acc + m.masteryScore, 0) / quizAttempts.length
          )
        : 0;

    const lastStudied = masteries.sort(
      (a, b) => new Date(b.lastStudiedAt).getTime() - new Date(a.lastStudiedAt).getTime()
    )[0];

    return {
      totalLessonsCompleted,
      totalStudyMinutes,
      currentStreakDays: 3, // Initialized active streak
      averageQuizScore,
      masteredTopicsCount: masteredCount,
      developingTopicsCount: developingCount,
      weakTopicsCount: weakCount,
      overallPercentage: Math.min(100, Math.round((masteredCount / Math.max(1, masteries.length || 10)) * 100)),
      lastStudiedSubjectId: lastStudied?.subjectId,
      lastStudiedTopicId: lastStudied?.topicId,
      lastStudiedTopicTitle: lastStudied?.topicTitle,
    };
  }

  // ===================== OFFLINE LEARNING CACHE =====================
  public getCachedUnits(): OfflineCachedUnit[] {
    try {
      return JSON.parse(localStorage.getItem(this.offlineUnitsKey) || '[]');
    } catch (e) {
      return [];
    }
  }

  public isUnitCached(unitId: string): boolean {
    const units = this.getCachedUnits();
    return units.some((u) => u.unitId === unitId);
  }

  public saveUnitOffline(unit: any, subjectId: string, grade: GradeLevel): void {
    const units = this.getCachedUnits().filter((u) => u.unitId !== unit.id);
    const serialized = JSON.stringify(unit);
    units.push({
      unitId: unit.id,
      subjectId,
      unitNumber: unit.unitNumber,
      title: unit.title.en || unit.title.am,
      grade,
      downloadedAt: new Date().toISOString(),
      sizeBytes: new Blob([serialized]).size,
      data: unit,
    });
    localStorage.setItem(this.offlineUnitsKey, JSON.stringify(units));
  }

  public removeUnitOffline(unitId: string): void {
    const units = this.getCachedUnits().filter((u) => u.unitId !== unitId);
    localStorage.setItem(this.offlineUnitsKey, JSON.stringify(units));
  }

  // ===================== OFFLINE QUEUE SYNC =====================
  private enqueueOfflineAction(action: string, payload: any): void {
    try {
      const queue = JSON.parse(localStorage.getItem(this.syncQueueKey) || '[]');
      queue.push({ action, payload, timestamp: new Date().toISOString() });
      localStorage.setItem(this.syncQueueKey, JSON.stringify(queue));
    } catch (e) {}
  }

  public async processOfflineQueue(): Promise<void> {
    if (!auth.currentUser || !this.isOnline) return;
    try {
      const queue = JSON.parse(localStorage.getItem(this.syncQueueKey) || '[]');
      if (queue.length === 0) return;

      console.log(`Syncing ${queue.length} offline actions to Firestore...`);
      for (const item of queue) {
        if (item.action === 'recordProgress') {
          await setDoc(
            doc(db, 'student_mastery', `${item.payload.uid}_${item.payload.topicId}`),
            { ...item.payload.current, userId: item.payload.uid, syncedAt: serverTimestamp() },
            { merge: true }
          );
        }
      }
      localStorage.removeItem(this.syncQueueKey);

      // Also trigger full offlineSyncEngine
      await offlineSyncEngine.syncPendingTasks();
    } catch (e) {
      console.warn('Error processing offline queue:', e);
    }
  }
}

export const studentAppFirestore = new StudentAppFirestoreService();
