import { GradeLevel } from './curriculumEngine';
import { LanguageCode } from '../types';

/**
 * 6-Level Source Hierarchy strictly defining priority
 */
export type SourcePriorityLevel =
  | 1 // LEVEL 1 — Ethiopian curriculum/textbooks
  | 2 // LEVEL 2 — Official government/education sources
  | 3 // LEVEL 3 — Universities and reputable academic institutions
  | 4 // LEVEL 4 — Peer-reviewed academic papers and reputable academic books
  | 5 // LEVEL 5 — High-quality reference books and educational resources
  | 6; // LEVEL 6 — Reputable web sources when necessary

export const SOURCE_PRIORITY_LABELS: Record<SourcePriorityLevel, { am: string; en: string; badgeColor: string }> = {
  1: {
    am: 'ደረጃ 1: የኢትዮጵያ ስርዓተ-ትምህርት / መማሪያ መጽሐፍ (Ethiopian Curriculum)',
    en: 'Level 1: Ethiopian Curriculum & Textbooks',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  },
  2: {
    am: 'ደረጃ 2: ይፋዊ የመንግስትና የትምህርት ተቋማት (Official Gov & MoE)',
    en: 'Level 2: Official Government & MoE Sources',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
  },
  3: {
    am: 'ደረጃ 3: ዩኒቨርሲቲዎችና ከፍተኛ የትምህርት ተቋማት (Universities)',
    en: 'Level 3: Universities & Academic Institutions',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
  },
  4: {
    am: 'ደረጃ 4: የተገመገሙ አካዳሚክ ጥናቶችና መጻሕፍት (Peer-Reviewed Papers)',
    en: 'Level 4: Peer-Reviewed Academic Papers & Books',
    badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-300',
  },
  5: {
    am: 'ደረጃ 5: ከፍተኛ ጥራት ያላቸው አጋዥ መጻሕፍት (Reference Resources)',
    en: 'Level 5: High-Quality Reference Books',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
  },
  6: {
    am: 'ደረጃ 6: የተረጋገጡ ይፋዊ ድረ-ገጾች (Reputable Web References)',
    en: 'Level 6: Reputable Web References',
    badgeColor: 'bg-stone-100 text-stone-800 border-stone-300',
  },
};

/**
 * Permitted Source Types
 */
export type ExternalSourceType =
  | 'CURRICULUM_TEXTBOOK'
  | 'REFERENCE_BOOK'
  | 'ACADEMIC_BOOK'
  | 'UNIVERSITY_RESOURCE'
  | 'ACADEMIC_PAPER'
  | 'OFFICIAL_DOCUMENT'
  | 'OPEN_EDUCATIONAL_RESOURCE'
  | 'WEB_REFERENCE';

export const SOURCE_TYPE_LABELS: Record<ExternalSourceType, { am: string; en: string }> = {
  CURRICULUM_TEXTBOOK: { am: 'የስርዓተ-ትምህርት መማሪያ መጽሐፍ', en: 'Curriculum Textbook' },
  REFERENCE_BOOK: { am: 'የአጋዥና የማመሳከሪያ መጽሐፍ', en: 'Reference Book' },
  ACADEMIC_BOOK: { am: 'አካዳሚክ መጽሐፍ', en: 'Academic Book' },
  UNIVERSITY_RESOURCE: { am: 'የዩኒቨርሲቲ ትምህርታዊ ግብዓት', en: 'University Resource' },
  ACADEMIC_PAPER: { am: 'የተመራማሪዎች አካዳሚክ ጥናት (Paper)', en: 'Academic Paper' },
  OFFICIAL_DOCUMENT: { am: 'ይፋዊ ሰነድ / ፖሊሲ', en: 'Official Document' },
  OPEN_EDUCATIONAL_RESOURCE: { am: 'ክፍት የትምህርት ግብዓት (OER)', en: 'Open Educational Resource' },
  WEB_REFERENCE: { am: 'የተረጋገጠ የድረ-ገጽ ምንጭ', en: 'Web Reference' },
};

/**
 * Copyright and Access Controls
 */
export type CopyrightStatus =
  | 'PUBLIC_DOMAIN'
  | 'CREATIVE_COMMONS'
  | 'OPEN_ACCESS'
  | 'LICENSED'
  | 'FAIR_USE_EDUCATIONAL'
  | 'RESTRICTED';

export type AccessPermission =
  | 'FULL_TEXT'
  | 'SUMMARIZED_ONLY'
  | 'EXCERPTS_ONLY'
  | 'METADATA_AND_CITATION_ONLY';

/**
 * Approved Source Entry in Knowledge Base
 */
export interface ApprovedSource {
  sourceId: string;
  title: string;
  author: string;
  publisher: string;
  year: number;
  isbn?: string;
  subject: string;
  grade: GradeLevel | 'all';
  topic: string;
  sourceType: ExternalSourceType;
  priorityLevel: SourcePriorityLevel;
  copyrightStatus: CopyrightStatus;
  accessPermission: AccessPermission;
  fileUrl?: string;
  description: string;
  academicCredibility: number; // 1 - 100
  isVerified: boolean;
  trustedDomain?: string;
  citationCount?: number;
  pageCount?: number;
  addedAt: string;
  addedBy: string;
  keyConcepts?: string[];
}

/**
 * Validated Citation for Answers
 */
export interface ValidatedCitation {
  citationId: string;
  claim: string;
  sourceTitle: string;
  author: string;
  publisher?: string;
  year?: number;
  sourceType: ExternalSourceType;
  priorityLevel: SourcePriorityLevel;
  url?: string;
  pageNumber?: number;
  exactSnippetOrSummary: string;
  isCurriculum: boolean;
  verificationStatus: 'VERIFIED_CURRICULUM' | 'VERIFIED_EXTERNAL' | 'OFFICIAL_DOCUMENT' | 'UNVERIFIED';
}

/**
 * Analysis Modes
 */
export type AnalysisMode =
  | 'curriculum' // Prioritize Ethiopian textbook, explain at grade level
  | 'deep_analysis' // Curriculum + trusted external sources
  | 'comparative' // Compare curriculum explanation with other academic viewpoints
  | 'real_world' // Local Ethiopian + global real-world applications
  | 'university_level' // Advanced university preparation depth
  | 'different_viewpoints' // Identify academic debate/positions
  | 'book_recommendations' // Recommend approved reference books
  | 'sources_used'; // Detailed audit of cited materials

/**
 * Multi-Source Synthesis Record (Disagreements & Perspectives)
 */
export interface MultiSourceDisagreement {
  issue: string;
  positions: {
    stance: string;
    sourceName: string;
    priorityLevel: SourcePriorityLevel;
    evidenceStrength: 'HIGH' | 'MODERATE' | 'THEORETICAL';
    rationale: string;
  }[];
  synthesisVerdict: string;
  epistemicUncertaintyNote?: string;
}

/**
 * 13-Point Complete Deep Analysis Structure
 */
export interface DeepAnalysisResult {
  id: string;
  question: string;
  subject: string;
  grade: GradeLevel;
  mode: AnalysisMode;
  language: LanguageCode;
  
  // 1. Definition
  definition: string;
  
  // 2. Curriculum Explanation ("According to the Ethiopian curriculum...")
  curriculumExplanation: string;
  
  // 3. Deeper Explanation ("Additional explanation...")
  deeperExplanation: string;
  
  // 4. Key Concepts
  keyConcepts: string[];
  
  // 5. Different Perspectives / Academic Views
  differentPerspectives?: {
    perspectiveTitle: string;
    description: string;
    proponentOrSource: string;
    consensusDegree: string;
  }[];
  
  // Multi-source Disagreement synthesis (if sources differ)
  multiSourceDisagreement?: MultiSourceDisagreement;
  
  // 6. Concrete Examples (textbook & advanced)
  examples: {
    title: string;
    scenarioOrProblem: string;
    detailedWalkthrough: string;
    sourceCitation?: string;
  }[];
  
  // 7. Real-world Application (Ethiopian context: GERD, Agriculture, Tech, Health, Rift Valley, Industry)
  realWorldApplication: string;
  
  // 8. Advantages
  advantages: string[];
  
  // 9. Limitations
  limitations: string[];
  
  // 10. Related Concepts
  relatedConcepts: string[];
  
  // 11. Critical-thinking Questions
  criticalThinkingQuestions: string[];
  
  // 12. Summary
  summary: string;
  
  // 13. Sources & Citations
  citations: ValidatedCitation[];
  
  // External Recommended Books
  recommendedBooks: ApprovedSource[];
  
  // Knowledge Graph Context (Grade -> Subject -> Unit -> Topic -> Concept -> External References)
  knowledgeGraphNode?: {
    grade: number;
    subject: string;
    unitNumber: number;
    unitTitle: string;
    topic: string;
    concept: string;
    relatedConcepts: string[];
    externalReferences: string[];
  };
  
  // Quality Control & Hallucination Checks
  hallucinationCheckPassed: boolean;
  adaptiveDepthLabel: string;
  hasCurriculumGrounding: boolean;
  hasExternalEnrichment: boolean;
  generatedAt: string;
  modelUsed?: string;
}

/**
 * Trusted Domain configuration for SUPER_ADMIN
 */
export interface TrustedDomainRecord {
  domain: string;
  institutionName: string;
  category: 'GOVERNMENT' | 'ETHIOPIAN_UNIVERSITY' | 'INTERNATIONAL_UNIVERSITY' | 'OPEN_SCIENCE' | 'ENCYCLOPEDIA';
  credibilityScore: number; // 80 - 100
  isActive: boolean;
  notes?: string;
}

/**
 * Citation Review Record for Audit
 */
export interface CitationAuditLog {
  auditId: string;
  question: string;
  studentGrade: GradeLevel;
  subject: string;
  citationsCheckedCount: number;
  curriculumCitationsCount: number;
  externalCitationsCount: number;
  hallucinationScore: number; // 0 = no hallucination detected
  verifiedSourcesRatio: number; // e.g. 1.0 = 100%
  timestamp: string;
  flaggedUnverified: boolean;
}
