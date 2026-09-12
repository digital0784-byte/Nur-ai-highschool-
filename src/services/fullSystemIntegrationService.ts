/**
 * Full System Integration & E2E Testing Service (PART 13)
 * Provides frontend/backend coordination for the 12-test suite,
 * curriculum coverage, and audit reports.
 */

import {
  fullSystemIntegrationEngine,
  SystemTestResult,
  CurriculumCoverageReport,
  FirestoreAuditReport,
  PerformanceAuditMetrics,
  FinalQualityAuditChecklist,
} from '../engine/fullSystemIntegrationEngine';

export interface FullSystemVerificationPayload {
  success: boolean;
  suiteName: string;
  timestamp: string;
  totalTests: number;
  passedTests: number;
  durationMs: number;
  results: SystemTestResult[];
  curriculumCoverage: CurriculumCoverageReport;
  firestoreAudit: FirestoreAuditReport;
  performanceMetrics: PerformanceAuditMetrics;
  qualityAuditChecklist: FinalQualityAuditChecklist[];
}

export class FullSystemIntegrationService {
  /**
   * Run the complete system integration verification suite
   */
  public async runFullSystemVerification(): Promise<FullSystemVerificationPayload> {
    const timestamp = new Date().toISOString();

    // Try backend API first if online
    if (navigator.onLine) {
      try {
        const response = await fetch('/api/system/verify-all-e2e', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ timestamp }),
        });
        if (response.ok) {
          const data = await response.json();
          return data;
        }
      } catch (err) {
        console.warn('[SystemIntegrationService] Backend verify-all-e2e fallback to client engine:', err);
      }
    }

    // Client engine fallback (guarantees tests run seamlessly offline or in air-gapped preview)
    const e2eResults = await fullSystemIntegrationEngine.executeAll12E2ETests();
    const curriculumCoverage = fullSystemIntegrationEngine.generateCurriculumCoverageReport();
    const firestoreAudit = fullSystemIntegrationEngine.auditFirestoreConsistency();
    const performanceMetrics = fullSystemIntegrationEngine.getPerformanceAuditMetrics();
    const qualityAuditChecklist = fullSystemIntegrationEngine.runFinalQualityAudit();

    return {
      success: e2eResults.success,
      suiteName: 'NUR AI High School Full System Integration & E2E Verification Suite (Parts 2 - 13)',
      timestamp,
      totalTests: e2eResults.totalTests,
      passedTests: e2eResults.passedTests,
      durationMs: e2eResults.durationMs,
      results: e2eResults.results,
      curriculumCoverage,
      firestoreAudit,
      performanceMetrics,
      qualityAuditChecklist,
    };
  }
}

export const fullSystemIntegrationService = new FullSystemIntegrationService();
