import {
  StudentGoalProfile,
  CareerProfile,
  TopicRealLifeConnection,
  CrossSubjectConnection,
  RealWorldProjectIdea,
  CareerAlignmentGuidance,
  SkillProfile,
} from '../types/careerLearning';
import { careerConnectionEngine } from '../engine/careerConnectionEngine';

export class CareerLearningService {
  private static instance: CareerLearningService;
  private readonly storagePrefix = 'nur_student_goals_';

  private constructor() {}

  public static getInstance(): CareerLearningService {
    if (!CareerLearningService.instance) {
      CareerLearningService.instance = new CareerLearningService();
    }
    return CareerLearningService.instance;
  }

  /**
   * Retrieves the student's career goal profile
   */
  public async getStudentGoalProfile(userId: string): Promise<StudentGoalProfile | null> {
    try {
      const response = await fetch(`/api/career/goals/${encodeURIComponent(userId)}`);
      if (response.ok) {
        const data = await response.json();
        if (data.profile) {
          localStorage.setItem(this.storagePrefix + userId, JSON.stringify(data.profile));
          return data.profile;
        }
      }
    } catch (err) {
      console.warn('Network error fetching career goals, reading offline cache:', err);
    }

    // LocalStorage Fallback
    const cached = localStorage.getItem(this.storagePrefix + userId);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {
        // ignore JSON parse error
      }
    }

    // Default template for new student
    const defaultProfile: StudentGoalProfile = {
      userId,
      primaryCareerGoals: ['software_engineer'],
      interestedFields: ['AI & Robotics', 'Clean Energy', 'Healthcare Access'],
      problemsToSolve: ['Improving healthcare in rural areas', 'Solar power for off-grid communities'],
      enjoyedSubjects: ['math', 'physics'],
      challengingSubjects: ['chemistry'],
      targetSkills: ['problem_solving', 'logical_reasoning', 'digital_literacy'],
      dreamUniversityOrField: 'Addis Ababa University (AAiT)',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(this.storagePrefix + userId, JSON.stringify(defaultProfile));
    return defaultProfile;
  }

  /**
   * Saves or updates the student's career goal profile
   */
  public async saveStudentGoalProfile(profile: StudentGoalProfile): Promise<StudentGoalProfile> {
    profile.updatedAt = new Date().toISOString();
    localStorage.setItem(this.storagePrefix + profile.userId, JSON.stringify(profile));

    try {
      const response = await fetch('/api/career/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile }),
      });
      if (response.ok) {
        const data = await response.json();
        return data.profile || profile;
      }
    } catch (err) {
      console.warn('Offline: Saved career goals to local cache for subsequent synchronization.', err);
    }

    return profile;
  }

  /**
   * Retrieves all career pathways
   */
  public async getAllCareers(): Promise<CareerProfile[]> {
    try {
      const res = await fetch('/api/career/profiles');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.careers) && data.careers.length > 0) {
          return data.careers;
        }
      }
    } catch (e) {
      // fallback to engine
    }
    return careerConnectionEngine.getAllCareers();
  }

  /**
   * Retrieves topic real-life connection & purpose
   */
  public async getTopicConnection(
    subjectId: string,
    topicId: string,
    topicTitle: string,
    userGoals?: StudentGoalProfile | null
  ): Promise<TopicRealLifeConnection> {
    try {
      const res = await fetch(`/api/career/connection/${subjectId}/${topicId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.connection) {
          return data.connection;
        }
      }
    } catch (e) {
      // fallback
    }
    return careerConnectionEngine.getTopicRealLifeConnection(subjectId, topicId, topicTitle, userGoals);
  }

  /**
   * Computes career alignment guidance
   */
  public async getCareerAlignmentGuidance(
    careerId: string,
    userGoals: StudentGoalProfile | null,
    progressMap: Record<string, any>
  ): Promise<CareerAlignmentGuidance> {
    return careerConnectionEngine.calculateCareerAlignment(careerId, userGoals, progressMap);
  }

  /**
   * Retrieves cross-subject connections
   */
  public getCrossSubjectConnections(subject?: string): CrossSubjectConnection[] {
    return careerConnectionEngine.getCrossSubjectConnections(subject);
  }

  /**
   * Retrieves real-world projects
   */
  public getProjects(grade?: number, careerId?: string): RealWorldProjectIdea[] {
    return careerConnectionEngine.getProjects(grade, careerId);
  }

  /**
   * Retrieves skill profiles
   */
  public getSkills(): SkillProfile[] {
    return careerConnectionEngine.getAllSkills();
  }

  /**
   * AI Purpose Tutor Explanation: Answers "Why do I need this subject/topic?"
   */
  public async askAIPurposeExplanation(
    query: string,
    grade: number,
    subject: string,
    topic: string,
    userGoals?: StudentGoalProfile | null,
    language: string = 'en'
  ): Promise<{ explanation: string; ethiopianExample: string; suggestedProject: string }> {
    try {
      const res = await fetch('/api/career/ai-purpose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, grade, subject, topic, userGoals, language }),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('AI purpose endpoint failed, generating local pedagogical response:', e);
    }

    // Fallback pedagogical generator
    const conn = careerConnectionEngine.getTopicRealLifeConnection(subject, topic, topic, userGoals);
    return {
      explanation:
        language === 'am'
          ? `${conn.whatYouAreLearning.am} ይህ ርዕስ ${conn.whyItMatters.am}`
          : `${conn.whatYouAreLearning.en} This topic is vital because ${conn.whyItMatters.en}`,
      ethiopianExample:
        language === 'am' ? conn.ethiopianContextExample.am : conn.ethiopianContextExample.en,
      suggestedProject:
        language === 'am'
          ? conn.projectIdea?.title.am || 'ተግባራዊ የፈጠራ ፕሮጀክት ይሞክሩ'
          : conn.projectIdea?.title.en || 'Try building a practical project',
    };
  }
}

export const careerLearningService = CareerLearningService.getInstance();
