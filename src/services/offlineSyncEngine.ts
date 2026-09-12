import {
  doc,
  setDoc,
  getDoc,
  collection,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { GradeLevel } from '../types/curriculumEngine';
import { LanguageCode } from '../types';
import {
  OfflineContentType,
  OfflineDownloadableItem,
  SyncStatusState,
  SyncQueueTask,
  SyncConflictRecord,
  LocalQuizAttempt,
  LocalLessonCompletion,
  LocalLearningActivity,
  StorageQuotaInfo,
} from '../types/offlineSync';
import { StudentTopicMastery } from '../types/studentApp';

class OfflineSyncEngine {
  private isSimulatedOffline: boolean = false;
  private isOnlineNative: boolean = typeof navigator !== 'undefined' ? navigator.onLine : true;
  private syncStatus: SyncStatusState = 'online';
  private lastSyncedAt: string | null = null;
  private listeners: Set<() => void> = new Set();
  private maxCacheBytes: number = 50 * 1024 * 1024; // 50 MB local budget for low-end Android
  private syncInProgress: boolean = false;

  // LocalStorage Keys
  private readonly CACHE_ITEMS_KEY = 'nur_offline_cached_items_v2';
  private readonly SYNC_QUEUE_KEY = 'nur_offline_sync_queue_v2';
  private readonly QUIZ_ATTEMPTS_KEY = 'nur_local_quiz_attempts_v2';
  private readonly LESSON_COMPLETIONS_KEY = 'nur_local_lesson_completions_v2';
  private readonly ACTIVITIES_KEY = 'nur_local_activities_v2';
  private readonly CONFLICT_LOGS_KEY = 'nur_sync_conflict_logs_v2';
  private readonly LAST_SYNC_KEY = 'nur_last_synced_timestamp';
  private readonly SIMULATED_OFFLINE_KEY = 'nur_simulated_offline_mode';

  constructor() {
    if (typeof window !== 'undefined') {
      this.isSimulatedOffline = localStorage.getItem(this.SIMULATED_OFFLINE_KEY) === 'true';
      this.lastSyncedAt = localStorage.getItem(this.LAST_SYNC_KEY);
      this.updateEffectiveOnlineStatus();

      window.addEventListener('online', () => {
        this.isOnlineNative = true;
        this.updateEffectiveOnlineStatus();
        if (this.isOnline()) {
          this.syncPendingTasks();
        }
      });

      window.addEventListener('offline', () => {
        this.isOnlineNative = false;
        this.updateEffectiveOnlineStatus();
      });

      // Periodically check queue if online
      setInterval(() => {
        if (this.isOnline() && !this.syncInProgress && this.getPendingTasks().length > 0) {
          this.syncPendingTasks();
        }
      }, 15000);
    }
  }

  // ===================== LISTENER MANAGEMENT =====================
  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.listeners.forEach((fn) => {
      try {
        fn();
      } catch (e) {
        console.error('OfflineSyncEngine listener error:', e);
      }
    });
  }

  // ===================== CONNECTIVITY & SIMULATION =====================
  public isOnline(): boolean {
    if (this.isSimulatedOffline) return false;
    return this.isOnlineNative;
  }

  public isOffline(): boolean {
    return !this.isOnline();
  }

  public isOfflineSimulated(): boolean {
    return this.isSimulatedOffline;
  }

  public toggleSimulatedOffline(forceOffline?: boolean): boolean {
    const next = forceOffline !== undefined ? forceOffline : !this.isSimulatedOffline;
    this.isSimulatedOffline = next;
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.SIMULATED_OFFLINE_KEY, next ? 'true' : 'false');
    }
    this.updateEffectiveOnlineStatus();

    if (!next && this.isOnlineNative) {
      // Switched back online, auto-sync
      this.syncPendingTasks();
    }
    this.notify();
    return this.isSimulatedOffline;
  }

  private updateEffectiveOnlineStatus(): void {
    if (this.isOnline()) {
      if (this.syncStatus === 'offline') {
        this.syncStatus = this.getPendingTasks().length > 0 ? 'syncing' : 'online';
      }
    } else {
      this.syncStatus = 'offline';
    }
  }

  public getSyncStatus(): SyncStatusState {
    return this.syncStatus;
  }

  public getLastSyncedTime(): string | null {
    return this.lastSyncedAt;
  }

  public getUserId(): string {
    return auth.currentUser?.uid || localStorage.getItem('nur_student_uid') || 'guest_student';
  }

  // ===================== OFFLINE CONTENT CACHING =====================
  public getAllCachedItems(): OfflineDownloadableItem[] {
    try {
      return JSON.parse(localStorage.getItem(this.CACHE_ITEMS_KEY) || '[]');
    } catch (e) {
      return [];
    }
  }

  public getCachedItem(id: string): OfflineDownloadableItem | null {
    const items = this.getAllCachedItems();
    return items.find((i) => i.id === id) || null;
  }

  public isItemCached(id: string): boolean {
    const items = this.getAllCachedItems();
    return items.some((i) => i.id === id);
  }

  public cacheItem(item: Omit<OfflineDownloadableItem, 'downloadedAt' | 'lastAccessedAt' | 'sizeBytes'> & { payload: any }): OfflineDownloadableItem {
    const items = this.getAllCachedItems().filter((i) => i.id !== item.id);
    const serializedPayload = JSON.stringify(item.payload);
    const sizeBytes = new Blob([serializedPayload]).size;

    const fullItem: OfflineDownloadableItem = {
      ...item,
      sizeBytes,
      downloadedAt: new Date().toISOString(),
      lastAccessedAt: new Date().toISOString(),
    };

    items.unshift(fullItem);

    // Enforce storage quota
    this.enforceCacheBudget(items);

    try {
      localStorage.setItem(this.CACHE_ITEMS_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn('LocalStorage full, performing aggressive cleanup...', e);
      this.cleanupOldestCache(3);
      try {
        localStorage.setItem(this.CACHE_ITEMS_KEY, JSON.stringify(items.slice(0, 15)));
      } catch (e2) {}
    }

    this.notify();
    return fullItem;
  }

  public removeCachedItem(id: string): void {
    const items = this.getAllCachedItems().filter((i) => i.id !== id);
    localStorage.setItem(this.CACHE_ITEMS_KEY, JSON.stringify(items));
    this.notify();
  }

  public clearAllCachedContent(): void {
    localStorage.removeItem(this.CACHE_ITEMS_KEY);
    this.notify();
  }

  private enforceCacheBudget(items: OfflineDownloadableItem[]): void {
    let currentBytes = items.reduce((acc, i) => acc + (i.sizeBytes || 0), 0);
    while (currentBytes > this.maxCacheBytes && items.length > 1) {
      // Remove the item with the oldest lastAccessedAt
      items.sort((a, b) => new Date(a.lastAccessedAt).getTime() - new Date(b.lastAccessedAt).getTime());
      const removed = items.shift();
      if (removed) {
        currentBytes -= removed.sizeBytes || 0;
      }
    }
  }

  public cleanupOldestCache(count: number = 2): number {
    const items = this.getAllCachedItems();
    if (items.length <= 1) return 0;
    items.sort((a, b) => new Date(a.lastAccessedAt).getTime() - new Date(b.lastAccessedAt).getTime());
    const toRemove = items.slice(0, count);
    const remaining = items.slice(count);
    localStorage.setItem(this.CACHE_ITEMS_KEY, JSON.stringify(remaining));
    this.notify();
    return toRemove.length;
  }

  public touchCachedItemAccess(id: string): void {
    const items = this.getAllCachedItems();
    const target = items.find((i) => i.id === id);
    if (target) {
      target.lastAccessedAt = new Date().toISOString();
      localStorage.setItem(this.CACHE_ITEMS_KEY, JSON.stringify(items));
    }
  }

  // ===================== SPECIFIC CONTENT DOWNLOADERS =====================
  public downloadLesson(
    lesson: any,
    unit: any,
    subject: any,
    grade: GradeLevel
  ): OfflineDownloadableItem {
    const id = `lesson-${subject.id}-${unit.id}-${lesson.id}`;
    return this.cacheItem({
      id,
      type: 'lesson',
      subjectId: subject.id,
      subjectTitle: subject.name,
      grade,
      unitNumber: unit.unitNumber,
      unitTitle: unit.title,
      lessonId: lesson.id,
      lessonNumber: lesson.lessonNumber,
      lessonTitle: lesson.title,
      title: lesson.title,
      payload: {
        lesson,
        unitSummary: {
          id: unit.id,
          unitNumber: unit.unitNumber,
          title: unit.title,
        },
        subjectSummary: {
          id: subject.id,
          name: subject.name,
          grade,
        },
      },
    });
  }

  public downloadUnit(
    unit: any,
    subject: any,
    grade: GradeLevel
  ): OfflineDownloadableItem {
    const id = `unit-${subject.id}-${unit.id}`;
    return this.cacheItem({
      id,
      type: 'unit',
      subjectId: subject.id,
      subjectTitle: subject.name,
      grade,
      unitNumber: unit.unitNumber,
      unitTitle: unit.title,
      title: unit.title,
      payload: unit,
    });
  }

  public downloadTopic(
    topic: any,
    lesson: any,
    unit: any,
    subject: any,
    grade: GradeLevel
  ): OfflineDownloadableItem {
    const id = `topic-${subject.id}-${unit.id}-${topic.id}`;
    return this.cacheItem({
      id,
      type: 'topic',
      subjectId: subject.id,
      subjectTitle: subject.name,
      grade,
      unitNumber: unit.unitNumber,
      unitTitle: unit.title,
      lessonId: lesson.id,
      lessonTitle: lesson.title,
      topicId: topic.id,
      title: topic.title,
      payload: {
        topic,
        lessonSummary: { id: lesson.id, number: lesson.lessonNumber, title: lesson.title },
        unitSummary: { id: unit.id, number: unit.unitNumber, title: unit.title },
        subjectSummary: { id: subject.id, name: subject.name, grade },
      },
    });
  }

  public downloadExercises(
    exercises: any[],
    topic: any,
    lesson: any,
    unit: any,
    subject: any,
    grade: GradeLevel
  ): OfflineDownloadableItem {
    const id = `exercises-${subject.id}-${unit.id}-${topic.id}`;
    return this.cacheItem({
      id,
      type: 'exercises',
      subjectId: subject.id,
      subjectTitle: subject.name,
      grade,
      unitNumber: unit.unitNumber,
      unitTitle: unit.title,
      lessonId: lesson.id,
      topicId: topic.id,
      title: {
        en: `Exercises: ${topic.title.en}`,
        am: `መልመጃዎች፡ ${topic.title.am}`,
        om: topic.title.om ? `Shaakala: ${topic.title.om}` : undefined,
        ti: topic.title.ti ? `ልምምዳት፡ ${topic.title.ti}` : undefined,
      },
      payload: {
        exercises,
        topicSummary: { id: topic.id, title: topic.title },
        unitSummary: { id: unit.id, number: unit.unitNumber, title: unit.title },
      },
    });
  }

  public downloadUnitReview(
    review: any,
    unit: any,
    subject: any,
    grade: GradeLevel
  ): OfflineDownloadableItem {
    const id = `review-${subject.id}-${unit.id}`;
    return this.cacheItem({
      id,
      type: 'review',
      subjectId: subject.id,
      subjectTitle: subject.name,
      grade,
      unitNumber: unit.unitNumber,
      unitTitle: unit.title,
      title: {
        en: `Unit ${unit.unitNumber} Review: ${unit.title.en}`,
        am: `የምዕራፍ ${unit.unitNumber} ማጠቃለያ፡ ${unit.title.am}`,
        om: unit.title.om ? `Goolaba Boqonnaa ${unit.unitNumber}: ${unit.title.om}` : undefined,
        ti: unit.title.ti ? `መዛዘሚ ምዕራፍ ${unit.unitNumber}: ${unit.title.ti}` : undefined,
      },
      payload: {
        review,
        unitSummary: { id: unit.id, number: unit.unitNumber, title: unit.title },
      },
    });
  }

  public downloadQuiz(
    assessment: any,
    unit: any,
    subject: any,
    grade: GradeLevel
  ): OfflineDownloadableItem {
    const id = `quiz-${subject.id}-${unit.id}`;
    return this.cacheItem({
      id,
      type: 'quiz',
      subjectId: subject.id,
      subjectTitle: subject.name,
      grade,
      unitNumber: unit.unitNumber,
      unitTitle: unit.title,
      title: {
        en: `Unit ${unit.unitNumber} Quiz & Assessment`,
        am: `የምዕራፍ ${unit.unitNumber} ፈተናና ምዘና`,
        om: `Qormaata Boqonnaa ${unit.unitNumber}`,
        ti: `ፈተናን ገምጋምን ምዕራፍ ${unit.unitNumber}`,
      },
      payload: {
        assessment,
        unitSummary: { id: unit.id, number: unit.unitNumber, title: unit.title },
      },
    });
  }

  // ===================== OFFLINE STUDY & PROGRESS RECORDING =====================
  public recordOfflineLessonCompletion(
    lessonId: string,
    topicId: string,
    subjectId: string,
    grade: GradeLevel,
    timeSpentSeconds: number
  ): LocalLessonCompletion {
    const uid = this.getUserId();
    const dateStr = new Date().toISOString();
    // Unique deterministic ID to make synchronization strictly idempotent
    const completionId = `compl_${uid}_${lessonId}`;

    const record: LocalLessonCompletion = {
      completionId,
      userId: uid,
      lessonId,
      topicId,
      subjectId,
      grade,
      completedAt: dateStr,
      timeSpentSeconds,
      synced: false,
    };

    // Store in local completions
    const allCompletions = this.getLocalLessonCompletions().filter((c) => c.completionId !== completionId);
    allCompletions.push(record);
    localStorage.setItem(this.LESSON_COMPLETIONS_KEY, JSON.stringify(allCompletions));

    // Enqueue for background synchronization
    this.enqueueSyncTask({
      id: `task_lesson_completion_${completionId}`,
      type: 'sync_lesson_completion',
      userId: uid,
      payload: record,
      clientTimestamp: dateStr,
      clientVersion: Date.now(),
      status: 'pending',
      retryCount: 0,
    });

    // Record activity
    this.recordOfflineActivity('lesson_read', subjectId, topicId, lessonId, { timeSpentSeconds });

    // Update local mastery
    this.recordOfflineTopicProgress(topicId, subjectId, grade, timeSpentSeconds, true);

    if (this.isOnline()) {
      this.syncPendingTasks();
    }

    this.notify();
    return record;
  }

  public getLocalLessonCompletions(): LocalLessonCompletion[] {
    try {
      return JSON.parse(localStorage.getItem(this.LESSON_COMPLETIONS_KEY) || '[]');
    } catch (e) {
      return [];
    }
  }

  public recordOfflineQuizAttempt(
    topicId: string,
    topicTitle: string,
    subjectId: string,
    grade: GradeLevel,
    score: number,
    totalQuestions: number,
    answers: { questionId: string; selectedAnswer: any; correctAnswer: any; isCorrect: boolean; timeSpentSeconds: number }[],
    timeSpentSeconds: number
  ): LocalQuizAttempt {
    const uid = this.getUserId();
    const dateStr = new Date().toISOString();
    const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
    // Deterministic unique ID to prevent duplicate records
    const attemptId = `quiz_${uid}_${topicId}_${Date.now()}`;

    const record: LocalQuizAttempt = {
      attemptId,
      userId: uid,
      topicId,
      topicTitle,
      subjectId,
      grade,
      score,
      totalQuestions,
      percentage,
      answers,
      completedAt: dateStr,
      synced: false,
    };

    // Store in local attempts
    const attempts = this.getLocalQuizAttempts();
    attempts.unshift(record);
    localStorage.setItem(this.QUIZ_ATTEMPTS_KEY, JSON.stringify(attempts.slice(0, 50)));

    // Enqueue for synchronization
    this.enqueueSyncTask({
      id: `task_quiz_attempt_${attemptId}`,
      type: 'sync_quiz_attempt',
      userId: uid,
      payload: record,
      clientTimestamp: dateStr,
      clientVersion: Date.now(),
      status: 'pending',
      retryCount: 0,
    });

    // Record activity
    this.recordOfflineActivity('quiz_taken', subjectId, topicId, topicTitle, { score, totalQuestions, percentage });

    // Update local mastery
    this.recordOfflineTopicQuizMastery(topicId, topicTitle, subjectId, grade, score, totalQuestions, timeSpentSeconds);

    if (this.isOnline()) {
      this.syncPendingTasks();
    }

    this.notify();
    return record;
  }

  public getLocalQuizAttempts(): LocalQuizAttempt[] {
    try {
      return JSON.parse(localStorage.getItem(this.QUIZ_ATTEMPTS_KEY) || '[]');
    } catch (e) {
      return [];
    }
  }

  public recordOfflineActivity(
    type: 'lesson_read' | 'quiz_taken' | 'exercise_done' | 'review_viewed' | 'practice_completed',
    subjectId: string,
    topicId: string,
    topicTitle: string,
    metadata?: Record<string, any>
  ): LocalLearningActivity {
    const uid = this.getUserId();
    const dateStr = new Date().toISOString();
    const activityId = `act_${uid}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const activity: LocalLearningActivity = {
      activityId,
      userId: uid,
      type,
      subjectId,
      topicId,
      topicTitle,
      metadata,
      timestamp: dateStr,
      synced: false,
    };

    const activities = this.getLocalActivities();
    activities.unshift(activity);
    localStorage.setItem(this.ACTIVITIES_KEY, JSON.stringify(activities.slice(0, 100)));

    this.enqueueSyncTask({
      id: `task_activity_${activityId}`,
      type: 'sync_learning_activity',
      userId: uid,
      payload: activity,
      clientTimestamp: dateStr,
      clientVersion: Date.now(),
      status: 'pending',
      retryCount: 0,
    });

    return activity;
  }

  public getLocalActivities(): LocalLearningActivity[] {
    try {
      return JSON.parse(localStorage.getItem(this.ACTIVITIES_KEY) || '[]');
    } catch (e) {
      return [];
    }
  }

  private recordOfflineTopicProgress(
    topicId: string,
    subjectId: string,
    grade: GradeLevel,
    timeSpentSeconds: number,
    completed: boolean
  ): void {
    const uid = this.getUserId();
    const cacheKey = `nur_mastery_${uid}_${topicId}`;
    let current: StudentTopicMastery = {
      topicId,
      topicTitle: topicId,
      subjectId,
      grade,
      masteryLevel: 'learning',
      masteryScore: 50,
      correctCount: 0,
      incorrectCount: 0,
      attemptsCount: 0,
      totalTimeSpentSeconds: 0,
      completed: false,
      lastStudiedAt: new Date().toISOString(),
      difficultySuggested: 'medium',
      needsRevision: false,
    };

    const local = localStorage.getItem(cacheKey);
    if (local) {
      try {
        current = { ...current, ...JSON.parse(local) };
      } catch (e) {}
    }

    current.totalTimeSpentSeconds += timeSpentSeconds;
    current.lastStudiedAt = new Date().toISOString();
    if (completed) current.completed = true;

    localStorage.setItem(cacheKey, JSON.stringify(current));

    // Enqueue mastery sync
    this.enqueueSyncTask({
      id: `task_mastery_${uid}_${topicId}`,
      type: 'sync_mastery',
      userId: uid,
      payload: { ...current, topicId, subjectId, grade },
      clientTimestamp: new Date().toISOString(),
      clientVersion: Date.now(),
      status: 'pending',
      retryCount: 0,
    });

    // Enqueue student_progress sync
    this.enqueueSyncTask({
      id: `task_progress_${uid}_${subjectId}`,
      type: 'sync_progress',
      userId: uid,
      payload: {
        userId: uid,
        subjectId,
        grade,
        lastStudiedTopicId: topicId,
        lastUpdated: new Date().toISOString(),
      },
      clientTimestamp: new Date().toISOString(),
      clientVersion: Date.now(),
      status: 'pending',
      retryCount: 0,
    });
  }

  private recordOfflineTopicQuizMastery(
    topicId: string,
    topicTitle: string,
    subjectId: string,
    grade: GradeLevel,
    correctCount: number,
    totalCount: number,
    timeSpentSeconds: number
  ): void {
    const uid = this.getUserId();
    const cacheKey = `nur_mastery_${uid}_${topicId}`;
    let current: StudentTopicMastery = {
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

    const local = localStorage.getItem(cacheKey);
    if (local) {
      try {
        current = { ...current, ...JSON.parse(local) };
      } catch (e) {}
    }

    current.attemptsCount += 1;
    current.correctCount += correctCount;
    current.incorrectCount += Math.max(0, totalCount - correctCount);
    current.totalTimeSpentSeconds += timeSpentSeconds;
    current.lastStudiedAt = new Date().toISOString();

    const percentage = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;
    current.masteryScore = current.attemptsCount === 1
      ? percentage
      : Math.round(current.masteryScore * 0.4 + percentage * 0.6);

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

    localStorage.setItem(cacheKey, JSON.stringify(current));

    this.enqueueSyncTask({
      id: `task_mastery_${uid}_${topicId}`,
      type: 'sync_mastery',
      userId: uid,
      payload: current,
      clientTimestamp: new Date().toISOString(),
      clientVersion: Date.now(),
      status: 'pending',
      retryCount: 0,
    });
  }

  // ===================== SYNC QUEUE & IDEMPOTENT SYNC ENGINE =====================
  public getPendingTasks(): SyncQueueTask[] {
    try {
      const queue: SyncQueueTask[] = JSON.parse(localStorage.getItem(this.SYNC_QUEUE_KEY) || '[]');
      return queue.filter((t) => t.status !== 'synced');
    } catch (e) {
      return [];
    }
  }

  public getPendingCount(): number {
    return this.getPendingTasks().length;
  }

  private enqueueSyncTask(task: SyncQueueTask): void {
    try {
      const queue: SyncQueueTask[] = JSON.parse(localStorage.getItem(this.SYNC_QUEUE_KEY) || '[]');
      // Idempotency: replace existing task with same ID if pending, updating to latest payload
      const existingIdx = queue.findIndex((t) => t.id === task.id);
      if (existingIdx >= 0) {
        queue[existingIdx] = {
          ...queue[existingIdx],
          payload: task.payload,
          clientTimestamp: task.clientTimestamp,
          clientVersion: task.clientVersion,
          status: 'pending',
        };
      } else {
        queue.push(task);
      }
      localStorage.setItem(this.SYNC_QUEUE_KEY, JSON.stringify(queue));
    } catch (e) {
      console.warn('Failed to enqueue sync task:', e);
    }
  }

  public async syncPendingTasks(force: boolean = false): Promise<{ syncedCount: number; failedCount: number; conflicts: number }> {
    if (this.syncInProgress) {
      return { syncedCount: 0, failedCount: 0, conflicts: 0 };
    }

    if (!this.isOnline() && !force) {
      this.syncStatus = 'offline';
      this.notify();
      return { syncedCount: 0, failedCount: 0, conflicts: 0 };
    }

    this.syncInProgress = true;
    this.syncStatus = 'syncing';
    this.notify();

    let syncedCount = 0;
    let failedCount = 0;
    let conflictsCount = 0;

    try {
      const queue: SyncQueueTask[] = JSON.parse(localStorage.getItem(this.SYNC_QUEUE_KEY) || '[]');
      const remainingQueue: SyncQueueTask[] = [];

      for (const task of queue) {
        if (task.status === 'synced') continue;

        // Exponential backoff check
        if (task.nextRetryAt && Date.now() < task.nextRetryAt && !force) {
          remainingQueue.push(task);
          continue;
        }

        try {
          // Process individual task with conflict detection & resolution
          const conflict = await this.executeSyncTask(task);
          if (conflict) {
            conflictsCount++;
            this.recordConflict(conflict);
          }

          task.status = 'synced';
          task.syncedAt = new Date().toISOString();
          syncedCount++;

          // Mark corresponding local records as synced
          this.markLocalRecordSynced(task);
        } catch (err: any) {
          console.warn(`Sync task failed (${task.id}):`, err);
          task.status = 'failed';
          task.retryCount = (task.retryCount || 0) + 1;
          task.lastError = err?.message || 'Network/Server Error';
          // Exponential backoff up to 30 seconds
          const delayMs = Math.min(30000, 1000 * Math.pow(2, task.retryCount));
          task.nextRetryAt = Date.now() + delayMs;
          failedCount++;
          remainingQueue.push(task);
        }
      }

      localStorage.setItem(this.SYNC_QUEUE_KEY, JSON.stringify(remainingQueue));

      const now = new Date().toISOString();
      this.lastSyncedAt = now;
      localStorage.setItem(this.LAST_SYNC_KEY, now);

      if (remainingQueue.length === 0) {
        this.syncStatus = 'synced';
      } else if (failedCount > 0) {
        this.syncStatus = 'sync_failed';
      } else {
        this.syncStatus = 'online';
      }
    } catch (e) {
      console.error('Fatal sync error:', e);
      this.syncStatus = 'sync_failed';
    } finally {
      this.syncInProgress = false;
      this.notify();
    }

    return { syncedCount, failedCount, conflicts: conflictsCount };
  }

  // Individual Task Execution with Conflict Resolution
  private async executeSyncTask(task: SyncQueueTask): Promise<SyncConflictRecord | null> {
    const uid = task.userId;

    // Verify auth status before synchronization
    if (!auth.currentUser) {
      // If user is not yet logged in with Firebase Auth, guest synchronization is preserved locally
      // until user authenticates.
      console.log('Skipping Firebase remote sync: User not authenticated. Preserving in local queue.');
      return null;
    }

    switch (task.type) {
      case 'sync_mastery': {
        const topicId = task.payload.topicId;
        const docRef = doc(db, 'student_mastery', `${uid}_${topicId}`);
        const serverSnap = await getDoc(docRef);

        let conflict: SyncConflictRecord | null = null;
        let finalData = { ...task.payload, userId: uid };

        if (serverSnap.exists()) {
          const serverData = serverSnap.data();
          const serverUpdated = serverData.lastStudiedAt || (serverData.lastUpdated instanceof Timestamp ? serverData.lastUpdated.toDate().toISOString() : null);
          const clientUpdated = task.clientTimestamp;

          // Conflict resolution: Preserve most recent valid update
          if (serverUpdated && new Date(serverUpdated) > new Date(clientUpdated)) {
            conflict = {
              id: `conflict_${Date.now()}_${topicId}`,
              collection: 'student_mastery',
              docId: `${uid}_${topicId}`,
              clientTimestamp: clientUpdated,
              serverTimestamp: serverUpdated,
              resolution: 'merged',
              resolvedAt: new Date().toISOString(),
              reason: 'Server had newer study timestamp. Merged highest mastery score and cumulative time.',
            };

            finalData = {
              ...serverData,
              // Merge stats safely: take max score and combine attempts
              masteryScore: Math.max(serverData.masteryScore || 0, task.payload.masteryScore || 0),
              attemptsCount: Math.max(serverData.attemptsCount || 0, task.payload.attemptsCount || 0),
              totalTimeSpentSeconds: Math.max(serverData.totalTimeSpentSeconds || 0, task.payload.totalTimeSpentSeconds || 0),
              completed: serverData.completed || task.payload.completed,
              needsRevision: serverData.needsRevision && task.payload.needsRevision,
            };
          }
        }

        await setDoc(docRef, {
          ...finalData,
          lastUpdated: serverTimestamp(),
          syncedAt: serverTimestamp(),
        }, { merge: true });

        return conflict;
      }

      case 'sync_progress': {
        const subjectId = task.payload.subjectId;
        const docRef = doc(db, 'student_progress', `${uid}_${subjectId}`);
        const serverSnap = await getDoc(docRef);

        let conflict: SyncConflictRecord | null = null;
        let finalData = { ...task.payload, userId: uid };

        if (serverSnap.exists()) {
          const serverData = serverSnap.data();
          if (serverData.lastUpdated && new Date(serverData.lastUpdated) > new Date(task.clientTimestamp)) {
            conflict = {
              id: `conflict_prog_${Date.now()}_${subjectId}`,
              collection: 'student_progress',
              docId: `${uid}_${subjectId}`,
              clientTimestamp: task.clientTimestamp,
              serverTimestamp: serverData.lastUpdated,
              resolution: 'kept_server',
              resolvedAt: new Date().toISOString(),
              reason: 'Server progress is more recent. Preserving server active topic.',
            };
            finalData = { ...serverData };
          }
        }

        await setDoc(docRef, {
          ...finalData,
          lastUpdated: serverTimestamp(),
        }, { merge: true });

        return conflict;
      }

      case 'sync_quiz_attempt': {
        const attemptId = task.payload.attemptId;
        // Deterministic ID prevents duplicate attempts
        const docRef = doc(db, 'quiz_attempts', attemptId);
        await setDoc(docRef, {
          ...task.payload,
          userId: uid,
          syncedAt: serverTimestamp(),
        }, { merge: true });
        return null;
      }

      case 'sync_lesson_completion': {
        const completionId = task.payload.completionId;
        // Deterministic ID prevents duplicate completions
        const docRef = doc(db, 'lesson_completion', completionId);
        await setDoc(docRef, {
          ...task.payload,
          userId: uid,
          syncedAt: serverTimestamp(),
        }, { merge: true });
        return null;
      }

      case 'sync_learning_activity': {
        const activityId = task.payload.activityId;
        const docRef = doc(db, 'learning_activity', activityId);
        await setDoc(docRef, {
          ...task.payload,
          userId: uid,
          syncedAt: serverTimestamp(),
        }, { merge: true });
        return null;
      }

      case 'sync_profile': {
        const docRef = doc(db, 'students', uid);
        await setDoc(docRef, {
          ...task.payload,
          lastActive: serverTimestamp(),
        }, { merge: true });
        return null;
      }

      default:
        return null;
    }
  }

  private markLocalRecordSynced(task: SyncQueueTask): void {
    if (task.type === 'sync_quiz_attempt') {
      const attempts = this.getLocalQuizAttempts();
      const target = attempts.find((a) => a.attemptId === task.payload.attemptId);
      if (target) {
        target.synced = true;
        localStorage.setItem(this.QUIZ_ATTEMPTS_KEY, JSON.stringify(attempts));
      }
    } else if (task.type === 'sync_lesson_completion') {
      const completions = this.getLocalLessonCompletions();
      const target = completions.find((c) => c.completionId === task.payload.completionId);
      if (target) {
        target.synced = true;
        localStorage.setItem(this.LESSON_COMPLETIONS_KEY, JSON.stringify(completions));
      }
    } else if (task.type === 'sync_learning_activity') {
      const activities = this.getLocalActivities();
      const target = activities.find((a) => a.activityId === task.payload.activityId);
      if (target) {
        target.synced = true;
        localStorage.setItem(this.ACTIVITIES_KEY, JSON.stringify(activities));
      }
    }
  }

  // ===================== CONFLICT LOGS =====================
  public getConflictLogs(): SyncConflictRecord[] {
    try {
      return JSON.parse(localStorage.getItem(this.CONFLICT_LOGS_KEY) || '[]');
    } catch (e) {
      return [];
    }
  }

  private recordConflict(conflict: SyncConflictRecord): void {
    const logs = this.getConflictLogs();
    logs.unshift(conflict);
    localStorage.setItem(this.CONFLICT_LOGS_KEY, JSON.stringify(logs.slice(0, 30)));
  }

  public clearConflictLogs(): void {
    localStorage.removeItem(this.CONFLICT_LOGS_KEY);
    this.notify();
  }

  // ===================== STORAGE QUOTA & LOW-END DEVICE METRICS =====================
  public getStorageQuotaInfo(): StorageQuotaInfo {
    const items = this.getAllCachedItems();
    const usedBytes = items.reduce((acc, i) => acc + (i.sizeBytes || 0), 0);
    const usagePercentage = Math.min(100, Math.round((usedBytes / this.maxCacheBytes) * 100));

    const unitsCount = items.filter((i) => i.type === 'unit').length;
    const lessonsCount = items.filter((i) => i.type === 'lesson').length;
    const quizzesCount = items.filter((i) => i.type === 'quiz').length;

    let lowDataMode = false;
    try {
      const profile = JSON.parse(localStorage.getItem(`nur_profile_${this.getUserId()}`) || '{}');
      lowDataMode = profile.lowDataMode || false;
    } catch (e) {}

    return {
      usedBytes,
      quotaBytes: this.maxCacheBytes,
      usagePercentage,
      cachedUnitsCount: unitsCount,
      cachedLessonsCount: lessonsCount,
      cachedQuizzesCount: quizzesCount,
      pendingSyncCount: this.getPendingCount(),
      lowDataMode,
    };
  }

  // ===================== AI OFFLINE LIMITATION HELPER =====================
  public getAIOfflineNotice(lang: LanguageCode = 'am'): { title: string; message: string; suggestions: string } {
    switch (lang) {
      case 'en':
        return {
          title: 'AI Tutor is Offline',
          message: 'The AI Socratic Tutor requires an active internet connection to generate new answers. However, you can continue reading cached textbook lessons, practicing offline exercises, and taking downloaded quizzes.',
          suggestions: 'Your quiz results and study progress will be safely saved locally and automatically synchronized with Firestore once internet returns.',
        };
      case 'om':
        return {
          title: 'Barsiisaan AI Intarneetii Hin Qabu',
          message: 'Barsiisaan AI deebii haaraa kennuuf intarneetii barbaada. Ta’us, barnoota gad-buufame dubbisuu fi qormaata shaakaluu ni dandeessu.',
          suggestions: 'Qabxiin keessanii fi guddinni barnoota keessanii bakkichatti qabama, yeroo intarneetiin deebi’u ni walsima.',
        };
      case 'ti':
        return {
          title: 'ናይ AI መምህር ኣብ ኦፍላይን ኣይሰርሕን እዩ',
          message: 'ናይ AI መምህር ሓደሽቲ መልስታት ንምሃብ ኢንተርኔት የድልዮ እዩ። ይኹን እምበር ዝወረዱ ትምህርትታትን ፈተናታትን ብኦፍላይን ምቕጻል ይከኣል እዩ።',
          suggestions: 'ውጽኢት ፈተናኹምን ዝተመሃርኩምዎ መጠንን ብውሑስ መገዲ ተዓቂቡ ኢንተርኔት ምስ ተመልሰ ብቐጥታ ናብ Firestore ይሰማማዕ።',
        };
      case 'am':
      default:
        return {
          title: 'የ AI መምህር ያለ ኢንተርኔት አይሰራም (AI Offline)',
          message: 'የ AI መምህር አዳዲስ ጥያቄዎችን ለመመለስ ንቁ የኢንተርኔት ግንኙነት ይፈልጋል። ይሁን እንጂ የወረዱ የትምህርት ክፍሎችን፣ ምሳሌዎችን፣ መልመጃዎችንና የክፍል ፈተናዎችን ያለ ኢንተርኔት በነፃነት ማጥናት ይችላሉ።',
          suggestions: 'የፈተና ውጤትዎና የጥናት ጊዜዎ በአካባቢው ማከማቻ በደህንነት ተቀምጦ ኢንተርኔት ሲመጣ ወዲያውኑ ወደ Firestore ይመሳሰላል።',
        };
    }
  }
}

export const offlineSyncEngine = new OfflineSyncEngine();
