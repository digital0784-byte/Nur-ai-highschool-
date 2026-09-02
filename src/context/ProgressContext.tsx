import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { CourseProgressMap, TopicProgressItem, Subject, Topic } from '../types';

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
  markLessonComplete: (topicId: string, completed?: boolean) => void;
  markFlashcardsComplete: (topicId: string) => void;
  recordQuizResult: (topicId: string, score: number, total: number) => void;
  isTopicComplete: (topicId: string) => boolean;
  getTopicProgress: (topicId: string) => TopicProgressItem;
  getSubjectProgress: (subject: Subject) => SubjectProgressSummary;
  getOverallProgress: (subjects: Subject[]) => OverallProgressSummary;
  resetAllProgress: () => void;
}

const STORAGE_KEY = 'ethio_highschool_course_progress_v1';

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

const defaultTopicProgress: TopicProgressItem = {
  lessonCompleted: false,
  flashcardsCompleted: false,
  quizCompleted: false,
};

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progressMap));
    } catch (e) {
      console.warn('Failed to persist progress to localStorage', e);
    }
  }, [progressMap]);

  const markLessonComplete = (topicId: string, completed: boolean = true) => {
    setProgressMap((prev) => {
      const current = prev[topicId] || { ...defaultTopicProgress };
      return {
        ...prev,
        [topicId]: {
          ...current,
          lessonCompleted: completed,
        },
      };
    });
  };

  const markFlashcardsComplete = (topicId: string) => {
    setProgressMap((prev) => {
      const current = prev[topicId] || { ...defaultTopicProgress };
      return {
        ...prev,
        [topicId]: {
          ...current,
          flashcardsCompleted: true,
        },
      };
    });
  };

  const recordQuizResult = (topicId: string, score: number, total: number) => {
    setProgressMap((prev) => {
      const current = prev[topicId] || { ...defaultTopicProgress };
      return {
        ...prev,
        [topicId]: {
          ...current,
          quizCompleted: true,
          quizScore: Math.max(current.quizScore || 0, score),
          quizTotal: total,
        },
      };
    });
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
  };

  const contextValue = useMemo(
    () => ({
      progressMap,
      markLessonComplete,
      markFlashcardsComplete,
      recordQuizResult,
      isTopicComplete,
      getTopicProgress,
      getSubjectProgress,
      getOverallProgress,
      resetAllProgress,
    }),
    [progressMap]
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
