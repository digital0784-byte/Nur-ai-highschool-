import React, { useState, useEffect, useMemo } from 'react';
import {
  FileText,
  ShieldAlert,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Settings,
  AlertTriangle,
  RefreshCw,
  Eye,
  Lock,
} from 'lucide-react';
import { subscriptionService, SUPER_ADMIN_EMAIL } from '../../services/subscriptionService';
import { PaymentAuditLog } from '../../types/subscription';

export const AdminPaymentAuditLogsSection: React.FC = () => {
  const [logs, setLogs] = useState<PaymentAuditLog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [actionFilter, setActionFilter] = useState<string>('ALL');
  const [selectedLog, setSelectedLog] = useState<PaymentAuditLog | null>(null);

  useEffect(() => {
    const unsub = subscriptionService.subscribeToAuditLogs((auditEntries) => {
      setLogs(auditEntries);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      if (actionFilter !== 'ALL' && log.action !== actionFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchAction = log.action?.toLowerCase().includes(q);
        const matchPayId = log.paymentId?.toLowerCase().includes(q);
        const matchAdmin = (log.adminId || log.actorId)?.toLowerCase().includes(q);
        const matchEmail = log.actorEmail?.toLowerCase().includes(q);
        const matchDetails = log.details?.toLowerCase().includes(q);
        const matchReason = log.reason?.toLowerCase().includes(q);
        if (!matchAction && !matchPayId && !matchAdmin && !matchEmail && !matchDetails && !matchReason) {
          return false;
        }
      }
      return true;
    });
  }, [logs, actionFilter, searchQuery]);

  const getActionBadge = (action: string) => {
    switch (action) {
      case 'PAYMENT_APPROVED':
      case 'SUBSCRIPTION_ACTIVATED':
      case 'SUBSCRIPTION_REACTIVATED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>{action}</span>
          </span>
        );
      case 'PAYMENT_REJECTED':
      case 'SUBSCRIPTION_SUSPENDED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
            <XCircle className="w-3 h-3 text-rose-600" />
            <span>{action}</span>
          </span>
        );
      case 'PAYMENT_SUBMITTED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
            <Clock className="w-3 h-3 text-amber-600" />
            <span>{action}</span>
          </span>
        );
      case 'PRICING_UPDATED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
            <Settings className="w-3 h-3 text-indigo-600" />
            <span>{action}</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-stone-100 text-stone-800 border border-stone-200">
            <span>{action}</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-stone-900 text-white flex items-center gap-1">
              <Lock className="w-3 h-3 text-amber-400" />
              <span>Immutable Audit Ledger</span>
            </span>
            <span className="text-xs text-stone-500 font-mono">payment_audit_logs/{'{logId}'}</span>
          </div>
          <h2 className="text-lg font-bold font-serif-ethiopic text-stone-900 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-emerald-700" />
            <span>የክፍያና ሳብስክሪፕሽን ኦዲት መዝገብ (Payment Audit Log)</span>
          </h2>
          <p className="text-xs text-stone-500">
            Strict append-only transaction logs. Every submission, approval, rejection, and price update is permanently recorded.
          </p>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2 text-right">
          <span className="text-[10px] font-bold uppercase text-emerald-900 block">ጠቅላላ መዝገቦች (Entries)</span>
          <span className="text-sm font-black text-emerald-950 font-mono">{logs.length} Recorded Audits</span>
        </div>
      </div>

      {/* Search & Action Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-stone-50 p-3 rounded-xl border border-stone-200">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Payment ID, Admin ID, Actor Email, or reason..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600"
          />
        </div>

        <div className="flex items-center gap-1 w-full sm:w-auto overflow-x-auto">
          <span className="text-xs font-bold text-stone-500 mr-1 shrink-0">ተግባር (Action):</span>
          {[
            { id: 'ALL', label: 'All Actions' },
            { id: 'PAYMENT_APPROVED', label: 'Approved' },
            { id: 'PAYMENT_REJECTED', label: 'Rejected' },
            { id: 'PAYMENT_SUBMITTED', label: 'Submitted' },
            { id: 'PRICING_UPDATED', label: 'Pricing' },
            { id: 'SUBSCRIPTION_SUSPENDED', label: 'Suspended' },
            { id: 'SUBSCRIPTION_REACTIVATED', label: 'Reactivated' },
          ].map((btn) => (
            <button
              key={btn.id}
              onClick={() => setActionFilter(btn.id)}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                actionFilter === btn.id
                  ? 'bg-stone-900 text-white shadow-2xs'
                  : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-stone-400 flex flex-col items-center gap-2">
            <RefreshCw className="w-6 h-6 animate-spin text-emerald-600" />
            <span className="text-xs">የኦዲት መረጃዎች በመጫን ላይ ናቸው...</span>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="p-12 text-center text-stone-400">
            ምንም የኦዲት መዝገብ አልተገኘም (No audit records matching filter)
          </div>
        ) : (
          <div className="overflow-x-auto max-h-[550px]">
            <table className="w-full text-left text-xs text-stone-700">
              <thead className="bg-stone-100/80 text-[11px] font-bold text-stone-600 uppercase border-b border-stone-200 sticky top-0">
                <tr>
                  <th className="p-3">ቀንና ሰዓት (Timestamp)</th>
                  <th className="p-3">ተግባር (Action)</th>
                  <th className="p-3">Payment ID / Sub ID</th>
                  <th className="p-3">የሁኔታ ለውጥ (Status Change)</th>
                  <th className="p-3">ፈጻሚ (Admin / Actor)</th>
                  <th className="p-3">ምክንያት / ዝርዝር (Details & Reason)</th>
                  <th className="p-3 text-right">ሜታዳታ (View)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-stone-50">
                    <td className="p-3 text-stone-500 font-mono text-[11px] whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="p-3 whitespace-nowrap">{getActionBadge(log.action)}</td>
                    <td className="p-3 font-mono text-[11px] text-stone-700">
                      {log.paymentId ? (
                        <span className="font-bold">{log.paymentId}</span>
                      ) : (
                        <span className="text-stone-400">{log.subscriptionId || 'System'}</span>
                      )}
                    </td>
                    <td className="p-3 text-stone-700 font-mono text-[11px]">
                      {log.previousStatus && log.newStatus ? (
                        <div className="flex items-center gap-1">
                          <span className="text-stone-500 line-through">{log.previousStatus}</span>
                          <span className="text-stone-400">→</span>
                          <span className="font-bold text-emerald-700">{log.newStatus}</span>
                        </div>
                      ) : (
                        <span className="text-stone-400">-</span>
                      )}
                    </td>
                    <td className="p-3 text-stone-700">
                      <div className="font-bold text-xs">{log.actorRole || 'SUPER_ADMIN'}</div>
                      <div className="text-[10px] text-stone-400 font-mono truncate max-w-[130px]">
                        {log.adminId || log.actorEmail}
                      </div>
                    </td>
                    <td className="p-3 text-stone-600 max-w-xs truncate" title={log.details || log.reason}>
                      {log.reason ? (
                        <div className="text-rose-700 font-semibold text-[11px]">ምክንያት፡ {log.reason}</div>
                      ) : null}
                      <div className="text-[11px]">{log.details}</div>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="p-1.5 text-stone-500 hover:text-emerald-700 hover:bg-stone-100 rounded-lg cursor-pointer transition-colors"
                        title="View Full Metadata"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 border border-stone-300 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h4 className="text-base font-bold text-stone-900 font-serif-ethiopic flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-emerald-700" />
                <span>የኦዲት መዝገብ ዝርዝር (Audit Log Detail)</span>
              </h4>
              <button
                onClick={() => setSelectedLog(null)}
                className="text-stone-400 hover:text-stone-600 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-stone-100">
                <span className="text-stone-500 font-bold">Log ID:</span>
                <span className="font-mono text-stone-900">{selectedLog.id}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-100">
                <span className="text-stone-500 font-bold">Action:</span>
                <span>{getActionBadge(selectedLog.action)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-100">
                <span className="text-stone-500 font-bold">Timestamp:</span>
                <span className="font-mono text-stone-900">{new Date(selectedLog.timestamp).toISOString()}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-100">
                <span className="text-stone-500 font-bold">Actor Role:</span>
                <span className="font-bold text-stone-900">{selectedLog.actorRole}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-100">
                <span className="text-stone-500 font-bold">Actor Email:</span>
                <span className="font-mono text-stone-900">{selectedLog.actorEmail}</span>
              </div>
              {selectedLog.paymentId && (
                <div className="flex justify-between py-1 border-b border-stone-100">
                  <span className="text-stone-500 font-bold">Payment ID:</span>
                  <span className="font-mono text-stone-900">{selectedLog.paymentId}</span>
                </div>
              )}
              {selectedLog.reason && (
                <div className="py-1 border-b border-stone-100">
                  <span className="text-stone-500 font-bold block mb-0.5">Reason:</span>
                  <span className="text-rose-700 font-bold">{selectedLog.reason}</span>
                </div>
              )}
              <div className="py-1">
                <span className="text-stone-500 font-bold block mb-1">Metadata Payload:</span>
                <pre className="bg-stone-900 text-emerald-400 p-3 rounded-xl font-mono text-[11px] overflow-x-auto max-h-48">
                  {JSON.stringify(selectedLog.metadata || selectedLog.meta || { details: selectedLog.details }, null, 2)}
                </pre>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 bg-stone-900 text-white rounded-xl text-xs font-bold cursor-pointer"
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
