import React, { useState } from 'react';
import {
  CheckCircle2,
  Play,
  RotateCcw,
  Loader2,
  AlertCircle,
  ShieldCheck,
  ChevronRight,
  Database,
  Award,
  BookOpen,
  Brain,
} from 'lucide-react';
import { adminFirestoreService } from '../../services/adminFirestore';

interface SimulationStepResult {
  step: number;
  name: string;
  status: 'pending' | 'running' | 'success' | 'failed';
  details?: string;
  data?: any;
}

export const AdminE2ESimulationSection: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [steps, setSteps] = useState<SimulationStepResult[]>([
    { step: 1, name: 'ደረጃ 1: አዲስ ክፍል መፍጠር (Admin Creates Class)', status: 'pending' },
    { step: 2, name: 'ደረጃ 2: ተማሪ መመዝገብ (Student Enrolls in Class)', status: 'pending' },
    { step: 3, name: 'ደረጃ 3: የትምህርት ክፍለ-ጊዜ መመደብ (Teacher Assigns Lesson)', status: 'pending' },
    { step: 4, name: 'ደረጃ 4: ተማሪ ትምህርቱን ማጥናት (Student Studies Lesson)', status: 'pending' },
    { step: 5, name: 'ደረጃ 5: የተማሪ ፈተና መውሰድ (Student Takes Quiz)', status: 'pending' },
    { step: 6, name: 'ደረጃ 6: ውጤት በዳታቤዝ ማስቀመጥ (Quiz Score Saved)', status: 'pending' },
    { step: 7, name: 'ደረጃ 7: የብቃት ደረጃ ማስላት (Mastery Recalculated)', status: 'pending' },
    { step: 8, name: 'ደረጃ 8: የተማሪ እድገት መከታተል (Progress Tracked)', status: 'pending' },
    { step: 9, name: 'ደረጃ 9: ደካማ አርዕስት በ AI መለየት (AI Identifies Weak Topic)', status: 'pending' },
    { step: 10, name: 'ደረጃ 10: የማካካሻ ትምህርት መምከር (AI Recommends Remedial Revision)', status: 'pending' },
  ]);

  const [finalReport, setFinalReport] = useState<any | null>(null);

  const runSimulation = async () => {
    setIsRunning(true);
    setFinalReport(null);

    // Reset steps
    setSteps((prev) => prev.map((s) => ({ ...s, status: 'pending', details: undefined })));

    try {
      // Execute the real service method
      const report = await adminFirestoreService.runEndToEndLifecycleSimulation((stepIndex, stepName, details) => {
        setSteps((prev) =>
          prev.map((s) => {
            if (s.step === stepIndex) {
              return { ...s, status: 'success', details };
            }
            if (s.step === stepIndex + 1) {
              return { ...s, status: 'running' };
            }
            return s;
          })
        );
      });

      setSteps((prev) => prev.map((s) => ({ ...s, status: 'success' })));
      setFinalReport(report);
    } catch (err: any) {
      console.error(err);
      setSteps((prev) =>
        prev.map((s) => (s.status === 'running' ? { ...s, status: 'failed', details: err.message } : s))
      );
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-900 to-teal-900 text-white p-5 rounded-2xl border border-emerald-700/50 shadow-md">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase bg-emerald-500/20 text-emerald-200 border border-emerald-400/30">
            End-to-End System Verification
          </span>
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            10-Step Lifecycle Pipeline
          </span>
        </div>
        <h3 className="text-xl sm:text-2xl font-bold font-serif-ethiopic tracking-tight">
          የሙሉ የትምህርት ዑደት ፈተና (Lifecycle Simulation Runner)
        </h3>
        <p className="text-xs text-emerald-100 mt-1 max-w-2xl font-serif-ethiopic">
          Verify the full lifecycle: Admin creates class &rarr; Student enrolls &rarr; Teacher assigns lesson &rarr; Student studies &rarr; Quiz taken &rarr; Score stored &rarr; Mastery calculated &rarr; Weak topic diagnosed &rarr; AI remedial recommendation dispatched.
        </p>

        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={runSimulation}
            disabled={isRunning}
            className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-stone-950 font-extrabold text-xs rounded-xl flex items-center gap-2 transition-all shadow-md cursor-pointer"
          >
            {isRunning ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-stone-900" />
                <span>የሙከራ ዑደት እየተካሄደ ነው (Running Pipeline)...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>ሙሉ ዑደቱን አስጀምር (Execute 10-Step Simulation)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 10 Steps Progress Cards */}
      <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b pb-3">
          <h4 className="text-sm font-bold text-stone-900 font-serif-ethiopic flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>የ 10ሩ ደረጃዎች ውጤት (Verification Stages)</span>
          </h4>
          <span className="text-xs text-stone-500 font-mono">
            {steps.filter((s) => s.status === 'success').length} / 10 Completed
          </span>
        </div>

        <div className="space-y-2">
          {steps.map((st) => (
            <div
              key={st.step}
              className={`p-3 rounded-xl border transition-all flex items-start justify-between gap-3 text-xs ${
                st.status === 'success'
                  ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                  : st.status === 'running'
                  ? 'bg-amber-50 border-amber-300 text-amber-950 animate-pulse'
                  : st.status === 'failed'
                  ? 'bg-rose-50 border-rose-200 text-rose-950'
                  : 'bg-stone-50/60 border-stone-200 text-stone-600'
              }`}
            >
              <div className="flex items-start gap-2.5">
                <div className="mt-0.5">
                  {st.status === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : st.status === 'running' ? (
                    <Loader2 className="w-4 h-4 text-amber-600 animate-spin" />
                  ) : st.status === 'failed' ? (
                    <AlertCircle className="w-4 h-4 text-rose-600" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-stone-300 flex items-center justify-center text-[10px] text-stone-400 font-bold">
                      {st.step}
                    </div>
                  )}
                </div>
                <div>
                  <div className="font-bold font-serif-ethiopic">{st.name}</div>
                  {st.details && (
                    <div className="text-[11px] mt-0.5 opacity-80 font-mono">{st.details}</div>
                  )}
                </div>
              </div>

              <span className="px-2 py-0.5 rounded-md text-[10px] uppercase font-bold tracking-wider shrink-0">
                {st.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Final Summary Card when Completed */}
      {finalReport && (
        <div className="bg-white rounded-2xl border border-emerald-200 p-5 shadow-xs space-y-3 animate-in fade-in">
          <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>ሙሉ የትምህርት ዑደት በተሳካ ሁኔታ ተጠናቋል! (Simulation Passed 100%)</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
              <span className="text-stone-400 block mb-1">የተፈጠረ ክፍል:</span>
              <span className="font-bold text-stone-800">{finalReport.classGroup?.name}</span>
            </div>
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
              <span className="text-stone-400 block mb-1">የተመዘገበ ተማሪ:</span>
              <span className="font-bold text-stone-800">{finalReport.student?.displayName}</span>
            </div>
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
              <span className="text-stone-400 block mb-1">የፈተና ውጤት:</span>
              <span className="font-bold text-emerald-700">
                {finalReport.submission?.score} / {finalReport.submission?.totalMarks} (
                {finalReport.submission?.percentage}%)
              </span>
            </div>
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
              <span className="text-stone-400 block mb-1">የ AI ማካካሻ መመሪያ:</span>
              <span className="font-bold text-indigo-700">
                {finalReport.recommendation?.recommendedTopic || 'Remediation Ready'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
