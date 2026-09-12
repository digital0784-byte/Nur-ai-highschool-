export type UserSecurityRole = 'admin' | 'teacher' | 'student';

export type AuditActionResult = 'success' | 'denied' | 'failed';

export interface AuditLogEntry {
  id: string;
  actorId: string;
  actorRole: UserSecurityRole | 'system';
  action: string;
  resourceType: string;
  resourceId: string;
  timestamp: string;
  result: AuditActionResult;
  ip?: string;
  metadata?: Record<string, any>;
}

export interface SecurityTestResult {
  id: string;
  name: string;
  target: string;
  expected: 'DENY' | 'ALLOW';
  actual: 'DENY' | 'ALLOW';
  passed: boolean;
  statusHttp: number;
  reason: string;
  latencyMs: number;
  timestamp: string;
}

export interface SecurityReport {
  authStatus: 'configured' | 'verified' | 'degraded';
  rbacStatus: 'active' | 'enforced';
  firestoreRulesStatus: 'deployed' | 'active';
  storageRulesStatus: 'configured' | 'active';
  appCheckStatus: 'active_dev_fallback' | 'enforced_recaptcha';
  backendSecurityStatus: 'hardened' | 'active';
  apiKeyProtectionStatus: 'isolated_server_side' | 'zero_client_keys';
  auditLoggingStatus: 'active_immutable' | 'recording';
  lastRunTimestamp: string;
  totalTests: number;
  passedTests: number;
  testResults: SecurityTestResult[];
  vulnerabilitiesFound: string[];
  recommendations: string[];
}
