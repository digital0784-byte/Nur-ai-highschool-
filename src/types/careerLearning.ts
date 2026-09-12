import { GradeLevel } from './curriculumEngine';

export type CareerCategory =
  | 'health'
  | 'engineering'
  | 'technology'
  | 'business_economics'
  | 'agriculture_environment'
  | 'aviation_transport'
  | 'science_research'
  | 'education_humanities';

export interface MultilingualText {
  en: string;
  am: string;
  om?: string;
  ti?: string;
}

export interface StudentGoalProfile {
  userId: string;
  primaryCareerGoals: string[]; // e.g. ['doctor', 'software_engineer', 'agricultural_scientist']
  interestedFields: string[]; // e.g. ['AI & Robotics', 'Clean Water', 'Renewable Energy', 'FinTech']
  problemsToSolve: string[]; // e.g. ['Improving healthcare in rural areas', 'Solar power for off-grid communities']
  enjoyedSubjects: string[]; // e.g. ['math-g9', 'biology-g9']
  challengingSubjects: string[]; // e.g. ['chemistry-g9']
  targetSkills: string[]; // e.g. ['problem_solving', 'critical_thinking']
  dreamUniversityOrField?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CareerSubjectRequirement {
  subjectId: string;
  subjectName: MultilingualText;
  importance: 'core' | 'supporting' | 'enrichment';
  rationale: MultilingualText;
}

export interface CareerTopicLink {
  subjectId: string;
  topicId: string;
  topicTitle: MultilingualText;
  whyItMatters: MultilingualText;
  applicationExample: MultilingualText;
}

export interface UniversityFieldInfo {
  degreeName: MultilingualText;
  programType: string;
  ethiopianUniversities: string[];
  durationYears: number;
}

export interface CareerProfile {
  careerId: string;
  careerName: MultilingualText;
  category: CareerCategory;
  shortDescription: MultilingualText;
  detailedOverview: MultilingualText;
  relatedSubjects: CareerSubjectRequirement[];
  importantTopics: CareerTopicLink[];
  requiredSkills: string[]; // skill IDs
  educationFields: UniversityFieldInfo[];
  possibleRoles: MultilingualText[];
  ethiopianOpportunities: MultilingualText;
  iconName: string;
  isHighGrowthInEthiopia?: boolean;
}

export interface RealWorldProjectIdea {
  projectId: string;
  title: MultilingualText;
  gradeLevel: GradeLevel;
  subjectId: string;
  topicId?: string;
  description: MultilingualText;
  materialsNeeded: MultilingualText[];
  expectedOutcome: MultilingualText;
  skillsGained: string[];
  ethiopianContextFocus: MultilingualText;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface CrossSubjectConnection {
  connectionId: string;
  primarySubject: string;
  connectedSubject: string;
  combinedField: MultilingualText;
  synergyExplanation: MultilingualText;
  realWorldExample: MultilingualText;
  ethiopianApplication: MultilingualText;
  relatedCareers: string[];
}

export interface TopicRealLifeConnection {
  topicId: string;
  subjectId: string;
  grade: GradeLevel;
  topicTitle: MultilingualText;
  whatYouAreLearning: MultilingualText;
  whereItIsUsed: MultilingualText[];
  whyItMatters: MultilingualText;
  realLifeExample: MultilingualText;
  ethiopianContextExample: MultilingualText;
  relatedCareers: string[];
  relatedSkills: string[];
  crossSubjectConnections: CrossSubjectConnection[];
  projectIdea?: RealWorldProjectIdea;
}

export type AlignmentLevel = 'Low' | 'Developing' | 'Good' | 'Strong';

export interface CareerAlignmentGuidance {
  careerId: string;
  careerName: MultilingualText;
  alignmentLevel: AlignmentLevel;
  alignmentScore: number; // 0 to 100
  summaryGuidance: MultilingualText;
  foundationalStrengths: MultilingualText[];
  recommendedFocusAreas: {
    subjectId: string;
    topicId?: string;
    reason: MultilingualText;
  }[];
  basisDetails: {
    subjectAffinity: number;
    masteryPercentage: number;
    skillCoverage: number;
  };
  disclaimer: MultilingualText;
}

export interface SkillProfile {
  skillId: string;
  name: MultilingualText;
  description: MultilingualText;
  category: 'cognitive' | 'technical' | 'interpersonal' | 'practical';
  curriculumActivities: {
    subjectId: string;
    activityType: MultilingualText;
    example: MultilingualText;
  }[];
  careersValuingSkill: string[];
}

export interface StudentSkillProgress {
  userId: string;
  skillId: string;
  level: number; // 1 to 5
  points: number;
  verifiedActivitiesCount: number;
  lastUpdated: string;
}

export interface PersonalizedPurposeCard {
  topicId: string;
  careerGoal: string;
  headline: MultilingualText;
  explanation: MultilingualText;
  actionableTip: MultilingualText;
  suggestedPracticeNode?: string;
}
