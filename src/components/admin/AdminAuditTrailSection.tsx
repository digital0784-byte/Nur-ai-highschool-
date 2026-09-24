import React, { useState, useEffect, useMemo } from 'react';
import {
  FileText,
  Search,
  Filter,
  Download,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Eye,
  X,
  Code,
  Lock,
} from 'lucide-react';
import {
  adminAuditService,
  AdminAuditLogItem,
  AdminAuditActionType,
} from '../../services/adminAuditService';

export const AdminAuditTrailSection: React.FC = () => {
  const [logs, setLogs] = useState<AdminAuditLogItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [actionFilter, setActionFilter] = useState<string>('ALL');
  const [resultFilter, setResultFilter] = useState<string>('ALL');
  const [selectedLog, setSelectedLog] = useState<AdminAuditLogItem | null>(null);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const data = await adminAuditService.getAuditLogs();
      setLogs(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      if (actionFilter !== 'ALL' && log.action !== actionFilter) return false;
      if (resultFilter !== 'ALL' && log.result !== resultFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesAction = log.action.toLowerCase().includes(q);
        const matchesTarget = log.target.toLowerCase().includes(q);
        const matchesAdmin = log.adminEmail.toLowerCase().includes(q);
        if (!matchesAction && !matchesTarget && !matchesAdmin) return false;
      }
      return true;
    });
  }, [logs, actionFilter, resultFilter, searchQuery]);

  const handleExportJson = () => {
    const jsonStr = adminAuditService.exportAuditLogsJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nur_ai_superadmin_audit_trail_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatActionName = (action: AdminAuditActionType) => {
    return action.replace(/_/g, ' ');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-stone-900 text-white font-mono">
              IMMUTABLE AUDIT LOG
            </span>
            <span className="text-xs text-stone-500 font-mono">Zero-Tamper Record</span>
          </div>
          <h2 className="text-lg font-bold text-stone-900 font-serif-ethiopic flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-700" />
            <span>የአስተዳዳሪ የሥራ እንቅስቃሴዎች ኦዲት (Admin Audit Trail)</span>
          </h2>
          <p className="text-xs text-stone-500">
            Cryptographically timestamped record of payments, student suspensions, book revisions, and emergency toggles.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchLogs}
            disabled={loading}
            className="p-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl transition cursor-pointer"
            title="Refresh Logs"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={handleExportJson}
            className="flex items-center gap-2 px-3.5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export JSON Audit</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center gap-3 bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by action, target, student ID, or admin email..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-600"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="text-xs bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 font-bold text-stone-700"
          >
            <option value="ALL">All Actions</option>
            <option value="PAYMENT_APPROVED">Payment Approved</option>
            <option value="PAYMENT_REJECTED">Payment Rejected</option>
            <option value="STUDENT_SUSPENDED">Student Suspended</option>
            <option value="STUDENT_REACTIVATED">Student Reactivated</option>
            <option value="SUBSCRIPTION_CHANGED">Subscription Changed</option>
            <option value="CURRICULUM_UPDATED">Curriculum Updated</option>
            <option value="EMERGENCY_SETTING_CHANGED">Emergency Changed</option>
            <option value="NOTIFICATION_SENT">Notification Sent</option>
          </select>

          <select
            value={resultFilter}
            onChange={(e) => setResultFilter(e.target.value)}
            className="text-xs bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 font-bold text-stone-700"
          >
            <option value="ALL">All Results</option>
            <option value="SUCCESS">Success</option>
            <option value="FAILURE">Failure</option>
            <option value="WARNING">Warning</option>
          </select>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 text-stone-500 font-bold uppercase tracking-wider text-[10px] border-b border-stone-200">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Admin Actor</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Target Resource</th>
                <th className="py-3 px-4">Result</th>
                <th className="py-3 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-stone-50/70 transition-colors">
                  <td className="py-3 px-4 font-mono text-stone-500 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-stone-900">{log.adminEmail}</div>
                    <div className="text-[10px] text-stone-400 font-mono">{log.adminId}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-bold font-mono text-[11px] text-stone-800 bg-stone-100 px-2 py-0.5 rounded">
                      {formatActionName(log.action)}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-stone-700 max-w-[200px] truncate" title={log.target}>
                    {log.target}
                  </td>
                  <td className="py-3 px-4">
                    {log.result === 'SUCCESS' && (
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        SUCCESS
                      </span>
                    )}
                    {log.result === 'FAILURE' && (
                      <span className="inline-flex items-center gap-1 text-rose-700 font-bold text-[11px]">
                        <XCircle className="w-3.5 h-3.5" />
                        FAILURE
                      </span>
                    )}
                    {log.result === 'WARNING' && (
                      <span className="inline-flex items-center gap-1 text-amber-700 font-bold text-[11px]">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        WARNING
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setSelectedLog(log)}
                      className="p-1.5 hover:bg-stone-100 text-stone-600 hover:text-stone-900 rounded-lg transition cursor-pointer"
                      title="Inspect Metadata"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}

              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-stone-400">
                    ምንም የተመዘገበ ኦዲት አልተገኘም (No audit records matching criteria).
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspect Log Metadata Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl border border-stone-200 flex flex-col max-h-[85vh]">
            <div className="p-4 sm:p-5 bg-stone-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-sm">Audit Record Detail: {selectedLog.id}</h3>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="p-1 text-stone-400 hover:text-white rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 overflow-y-auto text-xs">
              <div className="grid grid-cols-2 gap-3 bg-stone-50 p-3 rounded-xl border border-stone-200">
                <div>
                  <span className="text-[10px] text-stone-400 font-mono block">ACTION</span>
                  <span className="font-bold text-stone-900">{selectedLog.action}</span>
                </div>
                <div>
                  <span className="text-[10px] text-stone-400 font-mono block">RESULT</span>
                  <span className="font-bold text-emerald-700">{selectedLog.result}</span>
                </div>
                <div>
                  <span className="text-[10px] text-stone-400 font-mono block">ADMIN ACTOR</span>
                  <span className="font-bold text-stone-900">{selectedLog.adminEmail}</span>
                </div>
                <div>
                  <span className="text-[10px] text-stone-400 font-mono block">TIMESTAMP</span>
                  <span className="font-mono text-stone-700">{selectedLog.timestamp}</span>
                </div>
              </div>

              <div>
                <span className="font-bold text-stone-700 mb-1 block">TARGET RESOURCE:</span>
                <div className="p-2.5 bg-stone-100 rounded-lg font-mono text-stone-800 break-all">
                  {selectedLog.target}
                </div>
              </div>

              <div>
                <span className="font-bold text-stone-700 mb-1 block">METADATA PAYLOAD:</span>
                <pre className="p-3 bg-stone-900 text-emerald-300 rounded-xl font-mono text-[11px] overflow-x-auto">
                  {JSON.stringify(selectedLog.metadata, null, 2)}
                </pre>
              </div>

              <div className="text-[11px] text-stone-400">
                Logged via IP: {selectedLog.ipAddress || 'Internal'} • Device: {selectedLog.deviceInfo || 'Secure Client'}
              </div>
            </div>

            <div className="p-4 bg-stone-50 border-t border-stone-200 text-right">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 bg-stone-900 text-white rounded-xl text-xs font-bold hover:bg-stone-800 transition cursor-pointer"
              >
                ዝጋ (Close)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
