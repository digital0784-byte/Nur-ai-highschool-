import React, { useState } from 'react';
import {
  Award,
  FileText,
  Plus,
  Eye,
  CheckCircle2,
  Clock,
  Trash2,
  Calendar,
  Layers,
  Filter,
  Sparkles,
} from 'lucide-react';
import { AssessmentQuiz, AssessmentExam } from '../../types/adminDashboard';
import { Grade } from '../../types';
import { adminFirestoreService } from '../../services/adminFirestore';
import { AIQuizExamEngineView } from '../assessment/AIQuizExamEngineView';

interface AdminAssessmentsSectionProps {
  quizzes: AssessmentQuiz[];
  exams: AssessmentExam[];
  onRefresh: () => void;
}

export const AdminAssessmentsSection: React.FC<AdminAssessmentsSectionProps> = ({
  quizzes,
  exams,
  onRefresh,
}) => {
  const [activeTab, setActiveTab] = useState<'quizzes' | 'exams' | 'submissions' | 'ai_engine'>('quizzes');
  const [selectedItem, setSelectedItem] = useState<any | null>(null);

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
        <div>
          <h3 className="text-lg font-bold text-stone-900 font-serif-ethiopic flex items-center gap-2">
            <Award className="w-5 h-5 text-purple-700" />
            <span>የምዘና እና የፈተና ባንክ (Assessments & Exams Bank)</span>
          </h3>
          <p className="text-xs text-stone-500">
            Official curriculum quizzes, midterms, final examinations, and student submissions
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('quizzes')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'quizzes'
                ? 'bg-white text-purple-900 shadow-2xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            ምዕራፍ ፈተናዎች ({quizzes.length} Quizzes)
          </button>
          <button
            onClick={() => setActiveTab('exams')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'exams'
                ? 'bg-white text-purple-900 shadow-2xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            አጠቃላይ ፈተናዎች ({exams.length} Exams)
          </button>
          <button
            onClick={() => setActiveTab('submissions')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'submissions'
                ? 'bg-white text-purple-900 shadow-2xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            የተማሪዎች ውጤት (Submissions)
          </button>
          <button
            onClick={() => setActiveTab('ai_engine')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'ai_engine'
                ? 'bg-amber-500 text-stone-950 shadow-2xs font-extrabold'
                : 'text-amber-700 bg-amber-50/70 hover:bg-amber-100'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI ፈተና ሞተር (Part 9 Engine)</span>
          </button>
        </div>
      </div>

      {/* AI Assessment Engine View */}
      {activeTab === 'ai_engine' && (
        <AIQuizExamEngineView />
      )}

      {/* Quizzes List */}
      {activeTab === 'quizzes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quizzes.map((qz) => (
            <div
              key={qz.id}
              className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-50 text-purple-800 border border-purple-200">
                    Grade {qz.grade} • Unit {qz.unitNumber}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-stone-100 text-stone-700">
                    {qz.difficulty}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-stone-900 font-serif-ethiopic">
                  {qz.title}
                </h4>
                <div className="text-xs text-stone-500 mt-1">{qz.subjectName}</div>

                <div className="mt-3 space-y-1 text-xs text-stone-600">
                  <div className="flex items-center justify-between">
                    <span>የጥያቄ ብዛት (Questions):</span>
                    <span className="font-semibold">{qz.questions?.length || 5} Questions</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>የተሰጠው ሰዓት (Time Limit):</span>
                    <span className="font-semibold">{qz.timeLimitMinutes} Minutes</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>ጠቅላላ ነጥብ (Total Marks):</span>
                    <span className="font-semibold">{qz.totalMarks} Pts</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                <button
                  onClick={() => setSelectedItem(qz)}
                  className="text-xs font-bold text-purple-700 hover:text-purple-800 flex items-center gap-1 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>ጥያቄዎችን እይ (Preview Questions)</span>
                </button>
                <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Published
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Exams List */}
      {activeTab === 'exams' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {exams.map((ex) => (
            <div
              key={ex.id}
              className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-800 border border-indigo-200">
                    Grade {ex.grade} • {ex.examType.toUpperCase()}
                  </span>
                  <span className="text-[11px] text-stone-400">{ex.totalMarks} Marks</span>
                </div>

                <h4 className="text-sm font-bold text-stone-900 font-serif-ethiopic">
                  {ex.title}
                </h4>
                <div className="text-xs text-stone-500 mt-1">{ex.subjectName}</div>

                <div className="mt-3 space-y-1 text-xs text-stone-600">
                  <div className="flex items-center justify-between">
                    <span>የተሰጠው ሰዓት (Duration):</span>
                    <span className="font-semibold">{ex.durationMinutes} Minutes</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>የትምህርት ዓመት (Academic Year):</span>
                    <span className="font-semibold">{ex.academicYear}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>የጥያቄ ብዛት (Items):</span>
                    <span className="font-semibold">{ex.questions?.length || 10} Items</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                <button
                  onClick={() => setSelectedItem(ex)}
                  className="text-xs font-bold text-indigo-700 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>ፈተናውን እይ (Preview Exam)</span>
                </button>
                <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Ready for Exam Hall
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Submissions List */}
      {activeTab === 'submissions' && (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs text-stone-700">
            <thead className="bg-stone-100/70 border-b border-stone-200 text-[11px] uppercase tracking-wider text-stone-600 font-bold">
              <tr>
                <th className="p-3.5">ተማሪ (Student)</th>
                <th className="p-3.5">ፈተና (Assessment)</th>
                <th className="p-3.5">ነጥብ (Score)</th>
                <th className="p-3.5">መቶኛ (Percentage)</th>
                <th className="p-3.5">የድጋፍ ሁኔታ (Remedial Action)</th>
                <th className="p-3.5">ቀን (Date)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {[
                { student: 'አበበ ቢቂላ', exam: 'Biology Unit 1 Quiz', score: '18/20', pct: '90%', remedial: 'Mastered', status: 'ok', date: '2025-02-28' },
                { student: 'ጥሩነሽ ዲባባ', exam: 'Mathematics Unit 2 Quiz', score: '15/20', pct: '75%', remedial: 'Revision Recommended', status: 'warning', date: '2025-02-27' },
                { student: 'ኃይሌ ገብረስላሴ', exam: 'Physics Kinematics Midterm', score: '48/50', pct: '96%', remedial: 'Mastered', status: 'ok', date: '2025-02-26' },
                { student: 'ደራርቱ ቱሉ', exam: 'Chemistry Stoichiometry', score: '9/20', pct: '45%', remedial: 'AI Remedial Session Dispatched', status: 'error', date: '2025-02-25' },
              ].map((sub, i) => (
                <tr key={i} className="hover:bg-stone-50/70">
                  <td className="p-3.5 font-bold text-stone-900">{sub.student}</td>
                  <td className="p-3.5 text-stone-700">{sub.exam}</td>
                  <td className="p-3.5 font-semibold text-stone-800">{sub.score}</td>
                  <td className="p-3.5 font-bold text-stone-900">{sub.pct}</td>
                  <td className="p-3.5">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                        sub.status === 'ok'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : sub.status === 'warning'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : 'bg-rose-50 text-rose-800 border border-rose-200'
                      }`}
                    >
                      {sub.remedial}
                    </span>
                  </td>
                  <td className="p-3.5 text-stone-400">{sub.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Item Preview Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full max-h-[85vh] flex flex-col p-6 border border-stone-300 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h4 className="text-base font-bold text-stone-900 font-serif-ethiopic">
                  {selectedItem.title}
                </h4>
                <p className="text-xs text-stone-500">
                  Grade {selectedItem.grade} {selectedItem.subjectName}
                </p>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="text-stone-400 hover:text-stone-600 text-lg font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
              {selectedItem.questions?.map((q: any, i: number) => (
                <div key={q.id || i} className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1.5">
                  <div className="font-bold text-stone-800">
                    {i + 1}. {q.question}
                  </div>
                  <div className="grid grid-cols-2 gap-1 pl-2 text-[11px]">
                    {q.options?.map((opt: string, optIdx: number) => (
                      <div
                        key={optIdx}
                        className={`p-1.5 rounded-lg border ${
                          optIdx === q.correctIndex
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold'
                            : 'bg-white border-stone-200 text-stone-600'
                        }`}
                      >
                        {String.fromCharCode(65 + optIdx)}. {opt}
                      </div>
                    ))}
                  </div>
                  {q.explanation && (
                    <div className="text-[10px] text-stone-500 pt-1">
                      <span className="font-bold">Rationale:</span> {q.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2 border-t border-stone-100">
              <button
                onClick={() => setSelectedItem(null)}
                className="px-4 py-2 bg-stone-800 hover:bg-stone-900 text-white text-xs font-bold rounded-xl cursor-pointer"
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
