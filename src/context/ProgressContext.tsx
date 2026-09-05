import React, { createContext, useContext, useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { CourseProgressMap, TopicProgressItem, Subject, StudentReviewData, QuizAttemptRecord } from '../types';
import { doc, getDoc, setDoc, addDoc, collection } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from './AuthContext';

interface SubjectProgressSummary {
  completedTopics: number;
  totalTopics: number;
  percentage: number;
  isFullyComplete: boolean;
}

interface OverallProgressSummary {
  completedTopics: number;
  totalTopics: number;
  percentage: number;
  completedSubjects: number;
  totalSubjects: number;
  isAllComplete: boolean;
  totalActivitiesCompleted: number;
  totalActivitiesCount: number;
}

interface ProgressContextType {
  progressMap: CourseProgressMap;
  isSyncing: boolean;
  isCloudSynced: boolean;
  studentReview: StudentReviewData | null;
  isLoadingReview: boolean;
  markLessonComplete: (topicId: string, completed?: boolean) => void;
  markFlashcardsComplete: (topicId: string) => void;
  recordQuizResult: (topicId: string, score: number, total: number, subjectId?: string) => void;
  isTopicComplete: (topicId: string) => boolean;
  getTopicProgress: (topicId: string) => TopicProgressItem;
  getSubjectProgress: (subject: Subject) => SubjectProgressSummary;
  getOverallProgress: (subjects: Subject[]) => OverallProgressSummary;
  resetAllProgress: () => void;
  syncNow: () => Promise<void>;
  refreshReview: (force?: boolean) => Promise<StudentReviewData | null>;
}

const STORAGE_KEY = 'ethio_highschool_course_progress_v1';
const REVIEW_STORAGE_KEY = 'ethio_student_review_cache_v1';

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

const defaultTopicProgress: TopicProgressItem = {
  lessonCompleted: false,
  flashcardsCompleted: false,
  quizCompleted: false,
};

function mergeProgressMaps(local: CourseProgressMap, remote: CourseProgressMap): CourseProgressMap {
  const merged: CourseProgressMap = { ...local };
  for (const [topicId, remoteItem] of Object.entries(remote)) {
    const localItem = merged[topicId];
    if (!localItem) {
      merged[topicId] = remoteItem;
    } else {
      merged[topicId] = {
        lessonCompleted: localItem.lessonCompleted || remoteItem.lessonCompleted,
        flashcardsCompleted: localItem.flashcardsCompleted || remoteItem.flashcardsCompleted,
        quizCompleted: localItem.quizCompleted || remoteItem.quizCompleted,
        quizScore: Math.max(localItem.quizScore || 0, remoteItem.quizScore || 0),
        quizTotal: localItem.quizTotal || remoteItem.quizTotal,
      };
    }
  }
  return merged;
}

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, userProfile } = useAuth();
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [isCloudSynced, setIsCloudSynced] = useState<boolean>(false);
  const [isLoadingReview, setIsLoadingReview] = useState<boolean>(false);
  const [studentReview, setStudentReview] = useState<StudentReviewData | null>(() => {
    try {
      const saved = localStorage.getItem(REVIEW_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return null;
  });

  const isInitialSyncDone = useRef<boolean>(false);
  const quizHistoryRef = useRef<QuizAttemptRecord[]>([]);

  const [progressMap, setProgressMap] = useState<CourseProgressMap>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore JSON parse error
    }
    return {};
  });

  // Always save to localStorage immediately
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progressMap));
    } catch (e) {
      console.warn('Failed to persist progress to localStorage', e);
    }
  }, [progressMap]);

  // Refresh or generate Student Review using AI Tutor Engine
  const refreshReview = useCallback(
    async (force: boolean = false): Promise<StudentReviewData | null> => {
      // If we already have a recent review and not forcing, reuse
      if (!force && studentReview) {
        const generatedAt = new Date(studentReview.generatedAt).getTime();
        const tenMinutesAgo = Date.now() - 10 * 60 * 1000;
        if (generatedAt > tenMinutesAgo) {
          return studentReview;
        }
      }

      setIsLoadingReview(true);
      try {
        const lang = localStorage.getItem('app_tutorial_language') || 'am';
        const res = await fetch('/api/ai/student-review', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            uid: user?.uid,
            studentName: userProfile?.displayName || user?.displayName || 'ተማሪ',
            grade: userProfile?.grade || 10,
            language: lang,
            progressMap,
            quizHistory: quizHistoryRef.current,
          }),
        });

        if (!res.ok) {
          throw new Error(`Review generation failed (${res.status})`);
        }

        const data = await res.json();
        const review: StudentReviewData = data.review;

        setStudentReview(review);
        try {
          localStorage.setItem(REVIEW_STORAGE_KEY, JSON.stringify(review));
        } catch {}

        // Save to Firestore if user is authenticated
        if (user?.uid) {
          const topLevelReviewRef = doc(db, 'reviews', user.uid);
          const subReviewRef = doc(db, 'users', user.uid, 'reviews', 'current');
          const payload = {
            ...review,
            uid: user.uid,
            lastUpdated: new Date().toISOString(),
          };
          setDoc(topLevelReviewRef, payload, { merge: true }).catch(() => {});
          setDoc(subReviewRef, payload, { merge: true }).catch(() => {});
        }

        return review;
      } catch (err) {
        console.warn('Student review generation error:', err);
        return studentReview;
      } finally {
        setIsLoadingReview(false);
      }
    },
    [user?.uid, user?.displayName, userProfile?.grade, userProfile?.displayName, progressMap, studentReview]
  );

  // Sync with Firestore whenever user logs in or changes
  useEffect(() => {
    if (!user?.uid) {
      setIsCloudSynced(false);
      isInitialSyncDone.current = false;
      return;
    }

    let isMounted = true;

    const syncInitialProgress = async () => {
      try {
        setIsSyncing(true);
        const progressDocRef = doc(db, 'users', user.uid, 'progress', 'current');
        const topProgressRef = doc(db, 'progress', user.uid);
        const reviewDocRef = doc(db, 'reviews', user.uid);

        const [snap, reviewSnap] = await Promise.all([
          getDoc(progressDocRef),
          getDoc(reviewDocRef).catch(() => null),
        ]);

        if (!isMounted) return;

        // Restore review if available in cloud
        if (reviewSnap && reviewSnap.exists()) {
          const cloudReview = reviewSnap.data() as StudentReviewData;
          setStudentReview(cloudReview);
          try {
            localStorage.setItem(REVIEW_STORAGE_KEY, JSON.stringify(cloudReview));
          } catch {}
        }

        if (snap.exists()) {
          const cloudData = snap.data();
          const cloudMap = (cloudData.progressMap || {}) as CourseProgressMap;

          setProgressMap((localMap) => {
            const merged = mergeProgressMaps(localMap, cloudMap);
            // Save merged back to cloud in both locations
            const syncPayload = {
              uid: user.uid,
              progressMap: merged,
              lastUpdated: new Date().toISOString(),
            };
            setDoc(progressDocRef, syncPayload, { merge: true }).catch(() => {});
            setDoc(topProgressRef, syncPayload, { merge: true }).catch(() => {});
            return merged;
          });
        } else {
          // Upload local progress to cloud
          setProgressMap((localMap) => {
            if (Object.keys(localMap).length > 0) {
              const syncPayload = {
                uid: user.uid,
                progressMap: localMap,
                lastUpdated: new Date().toISOString(),
              };
              setDoc(progressDocRef, syncPayload, { merge: true }).catch(() => {});
              setDoc(topProgressRef, syncPayload, { merge: true }).catch(() => {});
            }
            return localMap;
          });
        }

        setIsCloudSynced(true);
        isInitialSyncDone.current = true;
      } catch (err) {
        console.warn('Cloud sync skipped (offline mode):', err);
      } finally {
        if (isMounted) setIsSyncing(false);
      }
    };

    syncInitialProgress();

    return () => {
      isMounted = false;
    };
  }, [user?.uid]);

  // Helper to push progress changes to Firestore for authenticated users
  const pushToCloud = (newMap: CourseProgressMap) => {
    if (!user?.uid) return;
    try {
      const progressDocRef = doc(db, 'users', user.uid, 'progress', 'current');
      const topProgressRef = doc(db, 'progress', user.uid);
      const payload = {
        uid: user.uid,
        progressMap: newMap,
        lastUpdated: new Date().toISOString(),
      };
      setDoc(progressDocRef, payload, { merge: true }).catch(() => {});
      setDoc(topProgressRef, payload, { merge: true }).catch(() => {});
    } catch {
      // ignore offline errors
    }
  };

  const markLessonComplete = (topicId: string, completed: boolean = true) => {
    setProgressMap((prev) => {
      const current = prev[topicId] || { ...defaultTopicProgress };
      const updated = {
        ...prev,
        [topicId]: {
          ...current,
          lessonCompleted: completed,
        },
      };
      pushToCloud(updated);
      return updated;
    });
  };

  const markFlashcardsComplete = (topicId: string) => {
    setProgressMap((prev) => {
      const current = prev[topicId] || { ...defaultTopicProgress };
      const updated = {
        ...prev,
        [topicId]: {
          ...current,
          flashcardsCompleted: true,
        },
      };
      pushToCloud(updated);
      return updated;
    });
  };

  const recordQuizResult = (
    topicId: string,
    score: number,
    total: number,
    subjectId?: string
  ) => {
    setProgressMap((prev) => {
      const current = prev[topicId] || { ...defaultTopicProgress };
      const updated = {
        ...prev,
        [topicId]: {
          ...current,
          quizCompleted: true,
          quizScore: Math.max(current.quizScore || 0, score),
          quizTotal: total,
        },
      };
      pushToCloud(updated);
      return updated;
    });

    const attemptRecord: QuizAttemptRecord = {
      userId: user?.uid || 'guest',
      topicId,
      subjectId: subjectId || '',
      score,
      total,
      percentage: total > 0 ? Math.round((score / total) * 100) : 0,
      timestamp: new Date().toISOString(),
    };
    quizHistoryRef.current.push(attemptRecord);

    // Also record detailed quiz attempt if logged in in both collections
    if (user?.uid) {
      try {
        const quizCollectionRef = collection(db, 'users', user.uid, 'quizRecords');
        const topQuizCollectionRef = collection(db, 'quizHistory', user.uid, 'entries');
        addDoc(quizCollectionRef, attemptRecord).catch(() => {});
        addDoc(topQuizCollectionRef, attemptRecord).catch(() => {});
      } catch {
        // ignore offline
      }
    }
  };

  const getTopicProgress = (topicId: string): TopicProgressItem => {
    return progressMap[topicId] || defaultTopicProgress;
  };

  const isTopicComplete = (topicId: string): boolean => {
    const item = progressMap[topicId];
    if (!item) return false;
    return item.lessonCompleted && item.flashcardsCompleted && item.quizCompleted;
  };

  const getSubjectProgress = (subject: Subject): SubjectProgressSummary => {
    const totalTopics = subject.topics.length;
    let completedTopics = 0;

    subject.topics.forEach((topic) => {
      if (isTopicComplete(topic.id)) {
        completedTopics += 1;
      }
    });

    const percentage = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;
    return {
      completedTopics,
      totalTopics,
      percentage,
      isFullyComplete: totalTopics > 0 && completedTopics === totalTopics,
    };
  };

  const getOverallProgress = (subjects: Subject[]): OverallProgressSummary => {
    let totalTopics = 0;
    let completedTopics = 0;
    let completedSubjects = 0;
    let totalActivitiesCompleted = 0;

    subjects.forEach((subject) => {
      totalTopics += subject.topics.length;
      let subjectFullyDone = true;

      subject.topics.forEach((topic) => {
        const p = getTopicProgress(topic.id);
        if (p.lessonCompleted) totalActivitiesCompleted += 1;
        if (p.flashcardsCompleted) totalActivitiesCompleted += 1;
        if (p.quizCompleted) totalActivitiesCompleted += 1;

        if (isTopicComplete(topic.id)) {
          completedTopics += 1;
        } else {
          subjectFullyDone = false;
        }
      });

      if (subjectFullyDone && subject.topics.length > 0) {
        completedSubjects += 1;
      }
    });

    const totalSubjects = subjects.length;
    const totalActivitiesCount = totalTopics * 3;
    const percentage =
      totalActivitiesCount > 0
        ? Math.round((totalActivitiesCompleted / totalActivitiesCount) * 100)
        : 0;

    return {
      completedTopics,
      totalTopics,
      percentage,
      completedSubjects,
      totalSubjects,
      isAllComplete: totalTopics > 0 && completedTopics === totalTopics,
      totalActivitiesCompleted,
      totalActivitiesCount,
    };
  };

  const resetAllProgress = () => {
    setProgressMap({});
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    if (user?.uid) {
      try {
        const progressDocRef = doc(db, 'users', user.uid, 'progress', 'current');
        setDoc(progressDocRef, {
          uid: user.uid,
          progressMap: {},
          lastUpdated: new Date().toISOString(),
        }).catch(() => {});
      } catch {
        // ignore
      }
    }
  };

  const syncNow = async () => {
    if (!user?.uid) return;
    try {
      setIsSyncing(true);
      const progressDocRef = doc(db, 'users', user.uid, 'progress', 'current');
      await setDoc(
        progressDocRef,
        {
          uid: user.uid,
          progressMap,
          lastUpdated: new Date().toISOString(),
        },
        { merge: true }
      );
      setIsCloudSynced(true);
    } catch (e) {
      console.warn('Manual sync failed:', e);
    } finally {
      setIsSyncing(false);
    }
  };

  const contextValue = useMemo(
    () => ({
      progressMap,
      isSyncing,
      isCloudSynced,
      studentReview,
      isLoadingReview,
      markLessonComplete,
      markFlashcardsComplete,
      recordQuizResult,
      isTopicComplete,
      getTopicProgress,
      getSubjectProgress,
      getOverallProgress,
      resetAllProgress,
      syncNow,
      refreshReview,
    }),
    [progressMap, isSyncing, isCloudSynced, studentReview, isLoadingReview, refreshReview, user?.uid]
  );

  return <ProgressContext.Provider value={contextValue}>{children}</ProgressContext.Provider>;
};

export function useProgress(): ProgressContextType {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
}
