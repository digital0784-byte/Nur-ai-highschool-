import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import {
  SyncStatusState,
  OfflineDownloadableItem,
  SyncConflictRecord,
  StorageQuotaInfo,
  LocalQuizAttempt,
  LocalLessonCompletion,
  LocalLearningActivity,
} from '../types/offlineSync';
import { offlineSyncEngine } from '../services/offlineSyncEngine';
import { GradeLevel } from '../types/curriculumEngine';
import { LanguageCode } from '../types';

interface OfflineSyncContextType {
  isOnline: boolean;
  isOffline: boolean;
  isSimulatedOffline: boolean;
  syncStatus: SyncStatusState;
  pendingCount: number;
  lastSyncedAt: string | null;
  storageQuota: StorageQuotaInfo;
  cachedItems: OfflineDownloadableItem[];
  conflictLogs: SyncConflictRecord[];
  localQuizAttempts: LocalQuizAttempt[];
  localLessonCompletions: LocalLessonCompletion[];
  localActivities: LocalLearningActivity[];

  // Actions
  toggleSimulatedOffline: (forceOffline?: boolean) => boolean;
  syncNow: () => Promise<{ syncedCount: number; failedCount: number; conflicts: number }>;
  downloadLesson: (lesson: any, unit: any, subject: any, grade: GradeLevel) => OfflineDownloadableItem;
  downloadUnit: (unit: any, subject: any, grade: GradeLevel) => OfflineDownloadableItem;
  downloadTopic: (topic: any, lesson: any, unit: any, subject: any, grade: GradeLevel) => OfflineDownloadableItem;
  downloadExercises: (exercises: any[], topic: any, lesson: any, unit: any, subject: any, grade: GradeLevel) => OfflineDownloadableItem;
  downloadReview: (review: any, unit: any, subject: any, grade: GradeLevel) => OfflineDownloadableItem;
  downloadQuiz: (assessment: any, unit: any, subject: any, grade: GradeLevel) => OfflineDownloadableItem;
  removeCachedItem: (id: string) => void;
  clearAllCache: () => void;
  cleanupOldestCache: (count?: number) => number;
  isItemCached: (id: string) => boolean;
  getCachedItem: (id: string) => OfflineDownloadableItem | null;
  clearConflictLogs: () => void;

  // Study recordings
  recordLessonCompletion: (lessonId: string, topicId: string, subjectId: string, grade: GradeLevel, timeSpentSeconds: number) => LocalLessonCompletion;
  recordQuizAttempt: (
    topicId: string,
    topicTitle: string,
    subjectId: string,
    grade: GradeLevel,
    score: number,
    totalQuestions: number,
    answers: { questionId: string; selectedAnswer: any; correctAnswer: any; isCorrect: boolean; timeSpentSeconds: number }[],
    timeSpentSeconds: number
  ) => LocalQuizAttempt;
  getAIOfflineNotice: (lang?: LanguageCode) => { title: string; message: string; suggestions: string };
}

const OfflineSyncContext = createContext<OfflineSyncContextType | undefined>(undefined);

export const OfflineSyncProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOnline, setIsOnline] = useState<boolean>(offlineSyncEngine.isOnline());
  const [isSimulatedOffline, setIsSimulatedOffline] = useState<boolean>(offlineSyncEngine.isOfflineSimulated());
  const [syncStatus, setSyncStatus] = useState<SyncStatusState>(offlineSyncEngine.getSyncStatus());
  const [pendingCount, setPendingCount] = useState<number>(offlineSyncEngine.getPendingCount());
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(offlineSyncEngine.getLastSyncedTime());
  const [storageQuota, setStorageQuota] = useState<StorageQuotaInfo>(offlineSyncEngine.getStorageQuotaInfo());
  const [cachedItems, setCachedItems] = useState<OfflineDownloadableItem[]>(offlineSyncEngine.getAllCachedItems());
  const [conflictLogs, setConflictLogs] = useState<SyncConflictRecord[]>(offlineSyncEngine.getConflictLogs());
  const [localQuizAttempts, setLocalQuizAttempts] = useState<LocalQuizAttempt[]>(offlineSyncEngine.getLocalQuizAttempts());
  const [localLessonCompletions, setLocalLessonCompletions] = useState<LocalLessonCompletion[]>(offlineSyncEngine.getLocalLessonCompletions());
  const [localActivities, setLocalActivities] = useState<LocalLearningActivity[]>(offlineSyncEngine.getLocalActivities());

  const refreshState = useCallback(() => {
    setIsOnline(offlineSyncEngine.isOnline());
    setIsSimulatedOffline(offlineSyncEngine.isOfflineSimulated());
    setSyncStatus(offlineSyncEngine.getSyncStatus());
    setPendingCount(offlineSyncEngine.getPendingCount());
    setLastSyncedAt(offlineSyncEngine.getLastSyncedTime());
    setStorageQuota(offlineSyncEngine.getStorageQuotaInfo());
    setCachedItems(offlineSyncEngine.getAllCachedItems());
    setConflictLogs(offlineSyncEngine.getConflictLogs());
    setLocalQuizAttempts(offlineSyncEngine.getLocalQuizAttempts());
    setLocalLessonCompletions(offlineSyncEngine.getLocalLessonCompletions());
    setLocalActivities(offlineSyncEngine.getLocalActivities());
  }, []);

  useEffect(() => {
    refreshState();
    const unsubscribe = offlineSyncEngine.subscribe(() => {
      refreshState();
    });
    return () => unsubscribe();
  }, [refreshState]);

  const toggleSimulatedOffline = (forceOffline?: boolean) => {
    const val = offlineSyncEngine.toggleSimulatedOffline(forceOffline);
    refreshState();
    return val;
  };

  const syncNow = async () => {
    const res = await offlineSyncEngine.syncPendingTasks(true);
    refreshState();
    return res;
  };

  const downloadLesson = (lesson: any, unit: any, subject: any, grade: GradeLevel) => {
    const item = offlineSyncEngine.downloadLesson(lesson, unit, subject, grade);
    refreshState();
    return item;
  };

  const downloadUnit = (unit: any, subject: any, grade: GradeLevel) => {
    const item = offlineSyncEngine.downloadUnit(unit, subject, grade);
    refreshState();
    return item;
  };

  const downloadTopic = (topic: any, lesson: any, unit: any, subject: any, grade: GradeLevel) => {
    const item = offlineSyncEngine.downloadTopic(topic, lesson, unit, subject, grade);
    refreshState();
    return item;
  };

  const downloadExercises = (exercises: any[], topic: any, lesson: any, unit: any, subject: any, grade: GradeLevel) => {
    const item = offlineSyncEngine.downloadExercises(exercises, topic, lesson, unit, subject, grade);
    refreshState();
    return item;
  };

  const downloadReview = (review: any, unit: any, subject: any, grade: GradeLevel) => {
    const item = offlineSyncEngine.downloadUnitReview(review, unit, subject, grade);
    refreshState();
    return item;
  };

  const downloadQuiz = (assessment: any, unit: any, subject: any, grade: GradeLevel) => {
    const item = offlineSyncEngine.downloadQuiz(assessment, unit, subject, grade);
    refreshState();
    return item;
  };

  const removeCachedItem = (id: string) => {
    offlineSyncEngine.removeCachedItem(id);
    refreshState();
  };

  const clearAllCache = () => {
    offlineSyncEngine.clearAllCachedContent();
    refreshState();
  };

  const cleanupOldestCache = (count: number = 2) => {
    const removed = offlineSyncEngine.cleanupOldestCache(count);
    refreshState();
    return removed;
  };

  const isItemCached = (id: string) => {
    return offlineSyncEngine.isItemCached(id);
  };

  const getCachedItem = (id: string) => {
    return offlineSyncEngine.getCachedItem(id);
  };

  const clearConflictLogs = () => {
    offlineSyncEngine.clearConflictLogs();
    refreshState();
  };

  const recordLessonCompletion = (lessonId: string, topicId: string, subjectId: string, grade: GradeLevel, timeSpentSeconds: number) => {
    const rec = offlineSyncEngine.recordOfflineLessonCompletion(lessonId, topicId, subjectId, grade, timeSpentSeconds);
    refreshState();
    return rec;
  };

  const recordQuizAttempt = (
    topicId: string,
    topicTitle: string,
    subjectId: string,
    grade: GradeLevel,
    score: number,
    totalQuestions: number,
    answers: { questionId: string; selectedAnswer: any; correctAnswer: any; isCorrect: boolean; timeSpentSeconds: number }[],
    timeSpentSeconds: number
  ) => {
    const rec = offlineSyncEngine.recordOfflineQuizAttempt(
      topicId,
      topicTitle,
      subjectId,
      grade,
      score,
      totalQuestions,
      answers,
      timeSpentSeconds
    );
    refreshState();
    return rec;
  };

  const getAIOfflineNotice = (lang?: LanguageCode) => {
    return offlineSyncEngine.getAIOfflineNotice(lang);
  };

  return (
    <OfflineSyncContext.Provider
      value={{
        isOnline,
        isOffline: !isOnline,
        isSimulatedOffline,
        syncStatus,
        pendingCount,
        lastSyncedAt,
        storageQuota,
        cachedItems,
        conflictLogs,
        localQuizAttempts,
        localLessonCompletions,
        localActivities,
        toggleSimulatedOffline,
        syncNow,
        downloadLesson,
        downloadUnit,
        downloadTopic,
        downloadExercises,
        downloadReview,
        downloadQuiz,
        removeCachedItem,
        clearAllCache,
        cleanupOldestCache,
        isItemCached,
        getCachedItem,
        clearConflictLogs,
        recordLessonCompletion,
        recordQuizAttempt,
        getAIOfflineNotice,
      }}
    >
      {children}
    </OfflineSyncContext.Provider>
  );
};

export const useOfflineSync = (): OfflineSyncContextType => {
  const context = useContext(OfflineSyncContext);
  if (!context) {
    throw new Error('useOfflineSync must be used within an OfflineSyncProvider');
  }
  return context;
};
