import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Lock,
  UserCheck,
  KeyRound,
  FileCheck2,
  HardDrive,
  Activity,
  PlayCircle,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Search,
  Filter,
  Eye,
  Server,
  Zap,
} from 'lucide-react';
import { securityAuditService } from '../../services/securityAuditService';
import { AuditLogEntry, SecurityReport, SecurityTestResult } from '../../types/security';

export const AdminSecurityDashboard: React.FC = () => {
  const [report, setReport] = useState<SecurityReport | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [runningTests, setRunningTests] = useState(false);
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLog, setSelectedLog] = useState<AuditLogEntry | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoadingLogs(true);
    try {
      const logs = await securityAuditService.getAuditLogs();
      setAuditLogs(logs);
      const rep = await securityAuditService.runSecurityTestSuite();
      setReport(rep);
    } catch (e) {
      console.error('Failed to load security audit data', e);
    } finally {
      setLoadingLogs(false);
    }
  };

  const handleRunTests = async () => {
    setRunningTests(true);
    try {
      const updatedReport = await securityAuditService.runSecurityTestSuite();
      setReport(updatedReport);
      const updatedLogs = await securityAuditService.getAuditLogs();
      setAuditLogs(updatedLogs);
    } finally {
      setRunningTests(false);
    }
  };

  const filteredLogs = auditLogs.filter((log) => {
    const matchesRole = roleFilter === 'all' || log.actorRole === roleFilter;
    const matchesSearch =
      searchQuery === '' ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.resourceType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.actorId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesSearch;
  });

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-stone-900 text-white p-6 sm:p-8 rounded-3xl border border-emerald-700/40 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Security & RBAC Fortress</h1>
                <span className="px-3 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  PART 8 SECURED
                </span>
              </div>
              <p className="text-stone-300 text-sm mt-1">
                Zero-Trust Firestore & Storage Rules, Role-Based Access Control, Firebase App Check & Backend Isolation
              </p>
            </div>
          </div>

          <button
            onClick={handleRunTests}
            disabled={runningTests}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium shadow-md transition disabled:opacity-50"
          >
            {runningTests ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : (
              <PlayCircle className="w-5 h-5" />
            )}
            <span>Run Production Checks</span>
          </button>
        </div>

        {/* Security Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-emerald-800/60">
          <div className="bg-stone-900/40 backdrop-blur p-4 rounded-2xl border border-emerald-800/40">
            <div className="text-xs font-medium text-emerald-300 flex items-center gap-1.5">
              <UserCheck className="w-4 h-4" /> Role Enforcement
            </div>
            <div className="text-lg font-bold text-white mt-1">ADMIN • TEACHER • STUDENT</div>
            <div className="text-xs text-stone-400 mt-0.5">Strict non-escalating RBAC</div>
          </div>

          <div className="bg-stone-900/40 backdrop-blur p-4 rounded-2xl border border-emerald-800/40">
            <div className="text-xs font-medium text-emerald-300 flex items-center gap-1.5">
              <Lock className="w-4 h-4" /> Firestore Rules
            </div>
            <div className="text-lg font-bold text-white mt-1">Default Deny</div>
            <div className="text-xs text-stone-400 mt-0.5">Zero update-gaps deployed</div>
          </div>

          <div className="bg-stone-900/40 backdrop-blur p-4 rounded-2xl border border-emerald-800/40">
            <div className="text-xs font-medium text-emerald-300 flex items-center gap-1.5">
              <KeyRound className="w-4 h-4" /> API Protection
            </div>
            <div className="text-lg font-bold text-white mt-1">Server-Side Only</div>
            <div className="text-xs text-stone-400 mt-0.5">Zero client Gemini/Firebase keys</div>
          </div>

          <div className="bg-stone-900/40 backdrop-blur p-4 rounded-2xl border border-emerald-800/40">
            <div className="text-xs font-medium text-emerald-300 flex items-center gap-1.5">
              <Zap className="w-4 h-4" /> Firebase App Check
            </div>
            <div className="text-lg font-bold text-white mt-1">Active & Guarded</div>
            <div className="text-xs text-stone-400 mt-0.5">ReCaptchaV3 + Dev Debug Token</div>
          </div>
        </div>
      </div>

      {/* Production Checks Runner Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-emerald-600" />
              Automated Production Security Test Vectors
            </h2>
            <p className="text-stone-600 text-sm">
              Deterministic verification against cross-student data theft, curriculum tampering, and unauthorized API calls
            </p>
          </div>
          {report && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full text-xs font-semibold text-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>
                {report.passedTests} / {report.totalTests} Tests Verified
              </span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {report?.testResults.map((test) => (
            <div
              key={test.id}
              className={`p-5 rounded-2xl border transition ${
                test.passed
                  ? 'bg-stone-50/70 border-stone-200 hover:border-emerald-300'
                  : 'bg-rose-50/70 border-rose-200'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-stone-200/80 text-stone-700">
                  {test.id}
                </span>
                <span
                  className={`text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                    test.passed
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : 'bg-rose-100 text-rose-800 border border-rose-200'
                  }`}
                >
                  {test.passed ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                  {test.actual} ({test.statusHttp})
                </span>
              </div>

              <h3 className="font-semibold text-stone-900 text-sm mt-3 leading-snug">{test.name}</h3>
              <p className="font-mono text-xs text-stone-500 mt-1 break-all bg-white/80 p-1.5 rounded border border-stone-200/60">
                {test.target}
              </p>
              <p className="text-xs text-stone-600 mt-2 leading-relaxed">{test.reason}</p>

              <div className="flex items-center justify-between mt-4 pt-3 border-t border-stone-200/60 text-[11px] text-stone-400 font-mono">
                <span>Expected: {test.expected}</span>
                <span>Latency: {test.latencyMs}ms</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Security Architectural Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Pillar 1: Firestore & Storage */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-base">Rules Hardening</h3>
              <p className="text-xs text-stone-500">Firestore & Cloud Storage</p>
            </div>
          </div>
          <ul className="text-xs text-stone-700 space-y-2.5">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Global Default Deny:</strong> Unknown documents rejected automatically.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Curriculum Master Gate:</strong> Students read published only; writes reserved to ADMIN.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Teacher Class Partitioning:</strong> Teachers can only grade assigned classroom sections.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Storage MIME & Size Guard:</strong> Profile pics &lt;5MB, Submissions &lt;20MB, isolated folders.</span>
            </li>
          </ul>
        </div>

        {/* Pillar 2: Backend Authorization & Rate Limiting */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-base">Backend Protection</h3>
              <p className="text-xs text-stone-500">Express, Middlewares & API Gates</p>
            </div>
          </div>
          <ul className="text-xs text-stone-700 space-y-2.5">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Bearer Token Verification:</strong> All administrative endpoints enforce valid auth headers.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Sliding-Window Rate Limiter:</strong> 120 req/min per IP to prevent Denial of Wallet attacks.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Request Size Limiter:</strong> 1MB strict payload cap to thwart buffer overflow attempts.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Sanitized Error Handling:</strong> Zero stack traces or internal secrets exposed to clients.</span>
            </li>
          </ul>
        </div>

        {/* Pillar 3: AI & Secrets Isolation */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-base">AI & Secrets Isolation</h3>
              <p className="text-xs text-stone-500">Zero Client-Side Credentials</p>
            </div>
          </div>
          <ul className="text-xs text-stone-700 space-y-2.5">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Gemini Key Server Isolation:</strong> Client code contains zero AI studio or Gemini tokens.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>YouTube Data Key Protection:</strong> All video searches proxied securely through backend.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Firebase Admin Isolation:</strong> Service account credentials stored strictly in container environment.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Clean .env.example:</strong> Documents variable names only; zero secrets in version control.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Immutable Audit Log Explorer */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
              <Activity className="w-6 h-6 text-stone-800" />
              Administrative & Security Audit Trail
            </h2>
            <p className="text-stone-600 text-sm">
              Immutable log stream of curriculum updates, role alterations, authorization decisions, and security alerts
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Role Filter Tabs */}
            <div className="flex items-center bg-stone-100 p-1 rounded-xl text-xs font-medium">
              {(['all', 'admin', 'teacher', 'student', 'system'] as const).map((role) => (
                <button
                  key={role}
                  onClick={() => setRoleFilter(role)}
                  className={`px-3 py-1.5 rounded-lg capitalize transition ${
                    roleFilter === role ? 'bg-white text-stone-900 shadow-sm font-semibold' : 'text-stone-600'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search audit actions..."
                className="pl-9 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-stone-400 w-44"
              />
            </div>

            <button
              onClick={loadData}
              disabled={loadingLogs}
              className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition"
              title="Refresh Audit Logs"
            >
              <RefreshCw className={`w-4 h-4 ${loadingLogs ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Audit Log Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-700">
            <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider font-semibold border-b border-stone-200">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Actor</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Resource</th>
                <th className="py-3 px-4">Result</th>
                <th className="py-3 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-mono">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-stone-400 font-sans">
                    No audit log records matching the filter criteria.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-stone-50/70 transition">
                    <td className="py-3 px-4 text-stone-500 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-sans font-medium text-stone-900">{log.actorId}</span>
                      <span className="ml-1.5 px-1.5 py-0.2 rounded text-[10px] uppercase font-bold bg-stone-100 text-stone-600">
                        {log.actorRole}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-sans font-medium text-stone-900">
                      {log.action.replace(/_/g, ' ')}
                    </td>
                    <td className="py-3 px-4 text-stone-600">
                      {log.resourceType}: {log.resourceId}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          log.result === 'success'
                            ? 'bg-emerald-100 text-emerald-800'
                            : log.result === 'denied'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {log.result}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="p-1.5 rounded-lg hover:bg-stone-200 text-stone-500 transition"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit Log Detail Modal */}
      {selectedLog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-stone-200">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-stone-900 text-base">Audit Trail Record Inspector</h3>
              <button
                onClick={() => setSelectedLog(null)}
                className="text-stone-400 hover:text-stone-600 text-sm font-semibold"
              >
                ✕
              </button>
            </div>
            <div className="space-y-2 text-xs font-mono bg-stone-50 p-4 rounded-2xl border border-stone-200 overflow-x-auto">
              <div><strong>Log ID:</strong> {selectedLog.id}</div>
              <div><strong>Timestamp:</strong> {selectedLog.timestamp}</div>
              <div><strong>Actor UID:</strong> {selectedLog.actorId} ({selectedLog.actorRole})</div>
              <div><strong>Action:</strong> {selectedLog.action}</div>
              <div><strong>Resource:</strong> {selectedLog.resourceType} / {selectedLog.resourceId}</div>
              <div><strong>Result:</strong> {selectedLog.result}</div>
              <div><strong>IP:</strong> {selectedLog.ip || '127.0.0.1'}</div>
              {selectedLog.metadata && (
                <div className="mt-2 pt-2 border-t border-stone-200">
                  <strong>Metadata:</strong>
                  <pre className="mt-1 text-[11px] text-stone-700 whitespace-pre-wrap">
                    {JSON.stringify(selectedLog.metadata, null, 2)}
                  </pre>
                </div>
              )}
            </div>
            <button
              onClick={() => setSelectedLog(null)}
              className="w-full py-2.5 rounded-xl bg-stone-900 text-white font-medium text-xs hover:bg-stone-800 transition"
            >
              Close Inspector
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
