import React, { useState } from 'react';
import {
  FileText,
  Download,
  Printer,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  X,
  TrendingUp,
  BarChart3,
  ShieldCheck,
  CreditCard,
  GraduationCap,
} from 'lucide-react';
import { AutomatedAdminReport } from '../../types/adminAutomation';
import { adminAutomationService } from '../../services/adminAutomationService';

interface AdminAutomatedReportsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminAutomatedReportsModal: React.FC<AdminAutomatedReportsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [reportType, setReportType] = useState<'DAILY' | 'WEEKLY' | 'MONTHLY'>('DAILY');
  const [loading, setLoading] = useState(false);
  const [currentReport, setCurrentReport] = useState<AutomatedAdminReport | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async (type = reportType) => {
    try {
      setLoading(true);
      const rep = await adminAutomationService.generateAutomatedReport(type);
      setCurrentReport(rep);
    } catch (e: any) {
      alert(`Report generation failed: ${e?.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      id="modal_automated_admin_reports"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
    >
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white flex items-center justify-between flex-shrink-0 border-b border-teal-500/30">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-500/20 border border-teal-400/30 text-teal-300 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">Automated Institutional Reports Engine</h3>
              <p className="text-xs text-slate-300 font-mono">
                12-Dimension Comprehensive System Telemetry Audit
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab selector & controls */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 flex-shrink-0">
          <div className="flex items-center gap-2">
            {(['DAILY', 'WEEKLY', 'MONTHLY'] as const).map((t) => (
              <button
                key={t}
                onClick={() => {
                  setReportType(t);
                  handleGenerate(t);
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  reportType === t
                    ? 'bg-teal-700 text-white shadow-sm'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {t === 'DAILY' ? 'Daily Report' : t === 'WEEKLY' ? 'Weekly Report' : 'Monthly Audit'}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleGenerate(reportType)}
              disabled={loading}
              className="px-3.5 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              Re-Compile
            </button>
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              Print / Save PDF
            </button>
          </div>
        </div>

        {/* Report Content Container */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-slate-50/50">
          {loading ? (
            <div className="p-12 text-center text-slate-500 text-sm">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-3 text-teal-600" />
              Aggregating live institutional telemetry and compiling report...
            </div>
          ) : currentReport ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-sm">
              {/* Report Title & Metadata */}
              <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                    {currentReport.type} REPORT
                  </span>
                  <h2 className="text-xl font-black text-slate-900 mt-1">{currentReport.title}</h2>
                  <p className="text-xs text-slate-500 font-mono">
                    Timeframe: {currentReport.dateRange} • Generated at{' '}
                    {new Date(currentReport.generatedAt).toLocaleString()}
                  </p>
                </div>
                <div className="text-right font-mono text-xs text-slate-500">
                  <div>NUR AI High School Tutor</div>
                  <div className="text-[10px]">FDRE MoE Curriculum Standards</div>
                </div>
              </div>

              {/* 12-Dimension Core Metrics Grid */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                  <BarChart3 className="w-4 h-4 text-teal-600" />
                  Key Institutional Performance Dimensions
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[11px] text-slate-500 block">Total Students</span>
                    <strong className="text-lg font-black text-slate-900">
                      {currentReport.metrics.totalStudents}
                    </strong>
                    <span className="text-[10px] text-emerald-700 block font-medium">
                      {currentReport.metrics.activeSubscribers} Active Paid
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[11px] text-slate-500 block">Verified Revenue</span>
                    <strong className="text-lg font-black text-emerald-600">
                      {currentReport.metrics.approvedPaymentsRevenueETB} ETB
                    </strong>
                    <span className="text-[10px] text-amber-700 block font-medium">
                      {currentReport.metrics.pendingPaymentsCount} Pending in Queue
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[11px] text-slate-500 block">Assessments Evaluated</span>
                    <strong className="text-lg font-black text-indigo-600">
                      {currentReport.metrics.quizzesTaken + currentReport.metrics.assignmentsEvaluated}
                    </strong>
                    <span className="text-[10px] text-slate-500 block">
                      {currentReport.metrics.assignmentsEvaluated} Written Submissions
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[11px] text-slate-500 block">System Reliability</span>
                    <strong className="text-lg font-black text-teal-600">
                      {currentReport.metrics.systemHealthScore}%
                    </strong>
                    <span className="text-[10px] text-emerald-700 block font-medium">
                      {currentReport.metrics.aiSuccessRate}% AI Success
                    </span>
                  </div>
                </div>
              </div>

              {/* Top Weak Topics Identified by AI */}
              <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    Top Curriculum Weak Topics (Requires Reinforcement)
                  </h4>
                  <span className="text-[10px] text-amber-800 font-mono">Aggregated from Quizzes</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {currentReport.metrics.topWeakTopics.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 bg-white rounded-lg border border-amber-200 text-xs space-y-1"
                    >
                      <div className="font-bold text-slate-900 truncate">{item.topic}</div>
                      <div className="flex items-center justify-between text-[11px] text-slate-500">
                        <span>{item.subject}</span>
                        <span className="font-mono text-rose-600 font-bold">{item.count} mistakes logged</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Executive Summary */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Executive Operations Narrative
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  {currentReport.executiveSummary}
                </p>
              </div>

              {/* Key Insights & Next Priorities */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <h5 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-teal-600" /> Key Insights
                  </h5>
                  <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
                    {currentReport.keyInsights.map((insight, idx) => (
                      <li key={idx}>{insight}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <h5 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Recommended Action Priorities
                  </h5>
                  <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
                    {currentReport.recommendedPriorities.map((prio, idx) => (
                      <li key={idx}>{prio}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-400 text-sm">
              Click 'Daily Report', 'Weekly Report', or 'Monthly Audit' above to generate an executive report.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 flex-shrink-0">
          <span>Official FDRE MoE Curriculum Assessment Engine (Year 2019 ዓ.ም)</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-xl transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
