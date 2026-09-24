import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
  RefreshCw,
  Search,
  Filter,
  Eye,
  Info,
  ExternalLink,
} from 'lucide-react';
import { PaymentAutomationRecord, FraudRiskLevel } from '../../types/adminAutomation';
import { adminAutomationService } from '../../services/adminAutomationService';
import { adminAuditService } from '../../services/adminAuditService';

export const AdminFraudRiskAlertsSection: React.FC = () => {
  const [payments, setPayments] = useState<PaymentAutomationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Super Admin Decision Modal
  const [selectedRecord, setSelectedRecord] = useState<PaymentAutomationRecord | null>(null);
  const [modalAction, setModalAction] = useState<'APPROVE' | 'REJECT' | null>(null);
  const [decisionNotes, setDecisionNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchQueue = async () => {
    try {
      setLoading(true);
      const data = await adminAutomationService.getPaymentsQueue();
      setPayments(data.queue || []);
    } catch (e) {
      console.warn('Failed to load payments queue:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  const handleDecision = async () => {
    if (!selectedRecord || !modalAction) return;
    try {
      setIsProcessing(true);
      const newStatus = modalAction === 'APPROVE' ? 'APPROVED' : 'REJECTED';

      // Update local state
      setPayments((prev) =>
        prev.map((p) =>
          p.id === selectedRecord.id
            ? {
                ...p,
                status: newStatus,
                reviewedAt: new Date().toISOString(),
                reviewedBy: 'mejennur669@gmail.com',
                rejectionReason: modalAction === 'REJECT' ? decisionNotes : undefined,
              }
            : p
        )
      );

      // Record to Audit Trail
      await adminAuditService.logAction(
        modalAction === 'APPROVE' ? 'PAYMENT_APPROVED' : 'PAYMENT_REJECTED',
        `Payment ${selectedRecord.id} (${selectedRecord.transactionReference}) for ${selectedRecord.studentName}`,
        'SUCCESS',
        {
          amount: selectedRecord.amount,
          method: selectedRecord.method,
          riskLevel: selectedRecord.fraudRisk.riskLevel,
          decisionNotes,
        },
        'mejennur669@gmail.com',
        'owner_super_admin_669',
        'SUPER_ADMIN',
        `Super Admin manually ${modalAction === 'APPROVE' ? 'approved' : 'rejected'} transaction. Reason: ${
          decisionNotes || 'Verified with bank statement.'
        }`
      );

      setSelectedRecord(null);
      setModalAction(null);
      setDecisionNotes('');
    } catch (e: any) {
      alert(`Decision error: ${e?.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredPayments = payments.filter((p) => {
    if (filterStatus === 'PENDING' && p.status !== 'PENDING') return false;
    if (filterStatus === 'HIGH_RISK' && p.fraudRisk.riskLevel !== 'HIGH RISK') return false;
    if (filterStatus === 'APPROVED' && p.status !== 'APPROVED') return false;
    if (filterStatus === 'REJECTED' && p.status !== 'REJECTED') return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        p.studentName.toLowerCase().includes(q) ||
        p.transactionReference.toLowerCase().includes(q) ||
        p.studentPhone.includes(q);
      if (!match) return false;
    }
    return true;
  });

  return (
    <div id="admin_fraud_risk_section" className="space-y-6">
      {/* Header with Strict Policy Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-amber-500" />
                Payment Queue & Fraud-Risk Anomaly Engine
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-full">
                Super Admin Final Approval Only
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              AI scans transaction references for duplicates, mismatches, and abnormal frequencies.
            </p>
          </div>

          <button
            onClick={fetchQueue}
            className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors flex items-center gap-1.5 self-start sm:self-auto"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh Queue
          </button>
        </div>

        {/* Clear Legal / Policy Guidelines */}
        <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
          <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong>Institutional Governance Policy:</strong> AI-detected signals are indicators for administrative
            investigation, <em>never definitive proof of fraud</em>. Never accuse or penalize a student automatically.
            <strong> The AI is strictly prohibited from approving payments.</strong> Only the Super Admin (
            <strong>mejennur669@gmail.com</strong>) has authority to approve or reject.
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { key: 'ALL', label: 'All Records' },
            { key: 'PENDING', label: 'Pending Review' },
            { key: 'HIGH_RISK', label: '⚠️ High Risk Anomalies' },
            { key: 'APPROVED', label: 'Approved' },
            { key: 'REJECTED', label: 'Rejected' },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilterStatus(f.key)}
              className={`text-xs px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                filterStatus === f.key
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search student, ref, phone..."
            className="w-full text-xs pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 text-center text-slate-500 text-xs">
            <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-amber-500" />
            Scanning payment queue and running anomaly detectors...
          </div>
        ) : filteredPayments.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            No payment submissions match the selected filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-semibold">
                <tr>
                  <th className="py-3 px-4">Student & Grade</th>
                  <th className="py-3 px-4">Method & Amount</th>
                  <th className="py-3 px-4">Transaction Ref</th>
                  <th className="py-3 px-4">AI Fraud-Risk Assessment</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Super Admin Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredPayments.map((p) => {
                  const isHigh = p.fraudRisk.riskLevel === 'HIGH RISK';
                  const isMed = p.fraudRisk.riskLevel === 'MEDIUM RISK';
                  return (
                    <tr
                      key={p.id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isHigh ? 'bg-rose-50/30' : isMed ? 'bg-amber-50/20' : ''
                      }`}
                    >
                      {/* Student */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{p.studentName}</div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          Grade {p.grade} • {p.studentPhone}
                        </div>
                      </td>

                      {/* Method & Amount */}
                      <td className="py-3.5 px-4">
                        <div className="font-black text-slate-900">
                          {p.amount} {p.currency}
                        </div>
                        <div className="text-[11px] text-slate-500">{p.method}</div>
                        {p.isIncomplete && (
                          <span className="text-[10px] text-amber-700 font-bold block">
                            ⚠️ Incomplete / Underpaid
                          </span>
                        )}
                      </td>

                      {/* Ref */}
                      <td className="py-3.5 px-4">
                        <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-800 text-[11px] font-bold">
                          {p.transactionReference}
                        </span>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {new Date(p.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>

                      {/* AI Assessment */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="flex items-center gap-1.5 mb-1">
                          <span
                            className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                              isHigh
                                ? 'bg-rose-100 text-rose-800 border-rose-300'
                                : isMed
                                ? 'bg-amber-100 text-amber-800 border-amber-300'
                                : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            }`}
                          >
                            {p.fraudRisk.riskLevel} ({p.fraudRisk.riskScore}/100)
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 leading-snug line-clamp-2">
                          {p.fraudRisk.explanation}
                        </p>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            p.status === 'APPROVED'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : p.status === 'REJECTED'
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        {p.status === 'PENDING' ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setSelectedRecord(p);
                                setModalAction('REJECT');
                              }}
                              className="px-2.5 py-1 text-xs border border-rose-200 text-rose-700 hover:bg-rose-50 rounded-lg font-semibold transition-colors"
                            >
                              Reject
                            </button>
                            <button
                              onClick={() => {
                                setSelectedRecord(p);
                                setModalAction('APPROVE');
                              }}
                              className="px-2.5 py-1 text-xs bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold shadow-sm transition-colors"
                            >
                              Approve
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-400 font-mono">Resolved</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* SUPER ADMIN CONFIRMATION MODAL */}
      {selectedRecord && modalAction && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
            <div
              className={`p-5 text-white flex items-center justify-between ${
                modalAction === 'APPROVE' ? 'bg-emerald-900' : 'bg-rose-900'
              }`}
            >
              <h3 className="font-bold text-base flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-300" />
                {modalAction === 'APPROVE' ? 'Confirm Payment Approval' : 'Confirm Payment Rejection'}
              </h3>
              <button
                onClick={() => {
                  setSelectedRecord(null);
                  setModalAction(null);
                }}
                className="text-white/80 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
                <div>
                  <strong>Student:</strong> {selectedRecord.studentName} (Grade {selectedRecord.grade})
                </div>
                <div>
                  <strong>Amount & Method:</strong> {selectedRecord.amount} {selectedRecord.currency} via{' '}
                  {selectedRecord.method}
                </div>
                <div>
                  <strong>Transaction Reference:</strong>{' '}
                  <span className="font-mono font-bold text-slate-800">
                    {selectedRecord.transactionReference}
                  </span>
                </div>
                <div>
                  <strong>AI Risk Level:</strong>{' '}
                  <span
                    className={`font-bold ${
                      selectedRecord.fraudRisk.riskLevel === 'HIGH RISK' ? 'text-rose-600' : 'text-slate-700'
                    }`}
                  >
                    {selectedRecord.fraudRisk.riskLevel}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Reason / Verification Notes:
                </label>
                <input
                  type="text"
                  value={decisionNotes}
                  onChange={(e) => setDecisionNotes(e.target.value)}
                  placeholder={
                    modalAction === 'APPROVE'
                      ? 'e.g. Verified on CBE branch slip'
                      : 'e.g. Duplicate reference code submitted'
                  }
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRecord(null);
                    setModalAction(null);
                  }}
                  className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handleDecision}
                  className={`px-4 py-2 text-white font-bold text-xs rounded-xl shadow-md transition-colors ${
                    modalAction === 'APPROVE'
                      ? 'bg-emerald-600 hover:bg-emerald-700'
                      : 'bg-rose-600 hover:bg-rose-700'
                  }`}
                >
                  {isProcessing ? 'Recording Decision...' : `Confirm ${modalAction}`}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
