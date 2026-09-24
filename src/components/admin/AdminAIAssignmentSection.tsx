import React, { useState, useEffect } from 'react';
import {
  FileText,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Plus,
  RefreshCw,
  Eye,
  Sliders,
  CheckSquare,
  XCircle,
  HelpCircle,
  Award,
  BookOpen,
} from 'lucide-react';
import { Grade } from '../../types';
import {
  GeneratedAssignment,
  AIAssignmentEvaluationResult,
  AssignmentType,
} from '../../types/adminAutomation';
import { adminAutomationService } from '../../services/adminAutomationService';

export const AdminAIAssignmentSection: React.FC = () => {
  const [assignments, setAssignments] = useState<GeneratedAssignment[]>([]);
  const [loading, setLoading] = useState(true);

  // New assignment form state
  const [showGenModal, setShowGenModal] = useState(false);
  const [genGrade, setGenGrade] = useState<Grade>(10);
  const [genSubject, setGenSubject] = useState('Biology (ስነ-ህይወት)');
  const [genUnit, setGenUnit] = useState(2);
  const [genLesson, setGenLesson] = useState('Lesson 2.3: Stages of Mitosis');
  const [genTopic, setGenTopic] = useState('Cell Division and Mitosis');
  const [genType, setGenType] = useState<AssignmentType>('homework');
  const [genDifficulty, setGenDifficulty] = useState('medium');
  const [genIsPremium, setGenIsPremium] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Selected assignment for preview
  const [selectedAssignment, setSelectedAssignment] = useState<GeneratedAssignment | null>(null);

  // Interactive AI Checking tester
  const [testStudentName, setTestStudentName] = useState('Yonas Haile');
  const [testStudentAnswer, setTestStudentAnswer] = useState(
    'Metaphase is when chromosomes align along the equator of the cell. Spindle fibers attach to the centromeres and pull sister chromatids during anaphase.'
  );
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<AIAssignmentEvaluationResult | null>(null);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const data = await adminAutomationService.getAssignments();
      setAssignments(data);
      if (data.length > 0 && !selectedAssignment) {
        setSelectedAssignment(data[0]);
      }
    } catch (e) {
      console.warn('Failed to load assignments:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const handleGenerateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsGenerating(true);
      const newAsg = await adminAutomationService.generateAssignment({
        grade: genGrade,
        subject: genSubject,
        unit: genUnit,
        lesson: genLesson,
        topic: genTopic,
        type: genType,
        difficulty: genDifficulty,
        isPremium: genIsPremium,
      });
      setShowGenModal(false);
      await fetchAssignments();
      setSelectedAssignment(newAsg);
    } catch (err: any) {
      alert(`Assignment generation failed: ${err?.message || 'Error'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleStatusChange = async (id: string, status: 'approved' | 'disabled') => {
    try {
      const updated = await adminAutomationService.updateAssignmentStatus(id, status);
      setAssignments((prev) => prev.map((a) => (a.id === id ? updated : a)));
      if (selectedAssignment?.id === id) {
        setSelectedAssignment(updated);
      }
    } catch (err: any) {
      alert(`Error updating assignment: ${err?.message}`);
    }
  };

  const handleRunEvaluationTest = async () => {
    if (!selectedAssignment) return;
    try {
      setIsEvaluating(true);
      const q = selectedAssignment.questions[0];
      const res = await adminAutomationService.evaluateAssignmentSubmission({
        assignmentId: selectedAssignment.id,
        studentId: 'std_01',
        studentName: testStudentName,
        answers: [
          {
            questionId: q?.id || 'q1',
            prompt: q?.prompt || 'Summarize the stages and biological significance.',
            studentAnswer: testStudentAnswer,
            type: q?.type || 'text',
          },
        ],
      });
      setEvaluationResult(res);
    } catch (err: any) {
      alert(`Evaluation error: ${err?.message}`);
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div id="admin_ai_assignments_section" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600" />
              AI Assignment & Auto-Checking Engine
            </h2>
            <span className="text-[10px] font-bold px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-full">
              Automated Operations
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Generate curriculum assignments (homework, exercises, projects, revision). Automatically evaluate text,
            numerical, and structured answers with rubric criteria.
          </p>
        </div>

        <button
          onClick={() => setShowGenModal(true)}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-600/20 transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Generate New Assignment
        </button>
      </div>

      {/* Main Grid: Assignment Catalog & Live AI Evaluator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Assignment Catalog */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              Curriculum Assignments ({assignments.length})
            </h3>
            <button
              onClick={fetchAssignments}
              className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {loading ? (
            <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center text-slate-500 text-xs">
              <RefreshCw className="w-4 h-4 animate-spin mx-auto mb-2 text-indigo-600" />
              Loading assignments...
            </div>
          ) : (
            <div className="space-y-3">
              {assignments.map((asg) => {
                const isSelected = selectedAssignment?.id === asg.id;
                return (
                  <div
                    key={asg.id}
                    onClick={() => setSelectedAssignment(asg)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-indigo-50/60 border-indigo-400 ring-2 ring-indigo-500/20'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 uppercase">
                          {asg.type}
                        </span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-800">
                          Grade {asg.grade}
                        </span>
                        {asg.isPremium && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 flex items-center gap-1">
                            <Award className="w-3 h-3 text-amber-600" /> Premium
                          </span>
                        )}
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          asg.status === 'approved'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {asg.status.toUpperCase()}
                      </span>
                    </div>

                    <h4 className="font-bold text-slate-900 text-sm mt-2">{asg.title}</h4>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{asg.description}</p>

                    <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                      <span>{asg.subject}</span>
                      <span>{asg.questions.length} questions • {asg.totalPoints} pts</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Selected Assignment Details & AI Submission Checker */}
        <div className="lg:col-span-7 space-y-6">
          {selectedAssignment ? (
            <>
              {/* Assignment Detail Card */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-200">
                        {selectedAssignment.subject} • Unit {selectedAssignment.unit}
                      </span>
                      <span className="text-xs font-mono text-slate-400">ID: {selectedAssignment.id}</span>
                    </div>
                    <h3 className="text-lg font-black text-slate-900 mt-1.5">{selectedAssignment.title}</h3>
                    <p className="text-xs text-slate-600 mt-1">{selectedAssignment.description}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    {selectedAssignment.status === 'approved' ? (
                      <button
                        onClick={() => handleStatusChange(selectedAssignment.id, 'disabled')}
                        className="px-3 py-1.5 border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
                      >
                        <XCircle className="w-3.5 h-3.5 text-slate-400" /> Disable
                      </button>
                    ) : (
                      <button
                        onClick={() => handleStatusChange(selectedAssignment.id, 'approved')}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                      </button>
                    )}
                  </div>
                </div>

                {/* Questions Preview */}
                <div className="space-y-3 pt-3 border-t border-slate-100">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Assignment Questions & Rubric Specifications
                  </h4>
                  {selectedAssignment.questions.map((q, idx) => (
                    <div key={q.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-800">
                          Question {idx + 1} ({q.type.toUpperCase()})
                        </span>
                        <span className="font-mono text-indigo-700 font-semibold">{q.points} Points</span>
                      </div>
                      <p className="text-xs text-slate-700 font-medium">{q.prompt}</p>
                      {q.expectedAnswerOutline && (
                        <div className="text-[11px] text-slate-600 bg-white p-2 rounded-lg border border-slate-200">
                          <strong className="text-slate-800">Expected Answer Outline:</strong> {q.expectedAnswerOutline}
                        </div>
                      )}
                      {q.rubricCriteria && q.rubricCriteria.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {q.rubricCriteria.map((crit, cIdx) => (
                            <span
                              key={cIdx}
                              className="text-[10px] px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-md"
                            >
                              ✓ {crit}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Assignment Checker: Interactive Simulation & Grading */}
              <div
                id="ai_submission_checking_harness"
                className="bg-gradient-to-br from-indigo-950 to-slate-900 text-white rounded-2xl p-6 shadow-xl border border-indigo-500/30 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Sparkles className="w-5 h-5 text-indigo-400" />
                    <div>
                      <h4 className="font-bold text-sm text-white">AI Automated Submission Checker</h4>
                      <p className="text-[11px] text-slate-300">
                        Evaluates text & calculations, highlights mistakes, assigns score, and flags subjective cases.
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                    Live Testing Mode
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">Student Name</label>
                      <input
                        type="text"
                        value={testStudentName}
                        onChange={(e) => setTestStudentName(e.target.value)}
                        className="w-full text-xs px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">Evaluating Against</label>
                      <div className="text-xs px-3 py-2 bg-slate-800/40 border border-slate-700 rounded-xl text-slate-400 truncate">
                        Question 1 of {selectedAssignment.title}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Student Answer Submission
                    </label>
                    <textarea
                      rows={3}
                      value={testStudentAnswer}
                      onChange={(e) => setTestStudentAnswer(e.target.value)}
                      placeholder="Type or paste student's answer..."
                      className="w-full text-xs p-3 bg-slate-800/80 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={handleRunEvaluationTest}
                      disabled={isEvaluating || !testStudentAnswer.trim()}
                      className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-500/20 transition-all flex items-center gap-2"
                    >
                      <Sparkles className={`w-3.5 h-3.5 ${isEvaluating ? 'animate-spin' : ''}`} />
                      {isEvaluating ? 'Evaluating Submission with AI...' : 'Run Automated AI Evaluation'}
                    </button>
                  </div>
                </div>

                {/* Live Evaluation Output */}
                {evaluationResult && (
                  <div className="mt-4 p-4 rounded-xl bg-slate-900/90 border border-indigo-400/40 space-y-3 animate-in fade-in">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-black text-emerald-400">
                          {evaluationResult.totalScore} / {evaluationResult.maxScore} Pts
                        </span>
                        <span className="text-xs font-semibold text-slate-400">
                          ({evaluationResult.percentage}%)
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-slate-300 font-mono">
                          Confidence: {Math.round(evaluationResult.aiConfidenceScore * 100)}%
                        </span>
                        {evaluationResult.humanReviewFlag ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-400/30 rounded flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3 text-amber-400" /> Human Review Flagged
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 rounded flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Auto-Graded
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-xs space-y-1.5 text-slate-200">
                      <div>
                        <strong className="text-indigo-300">Overall Feedback:</strong> {evaluationResult.overallFeedback}
                      </div>

                      {evaluationResult.breakdown[0] && (
                        <div className="space-y-1 pt-1 text-[11px]">
                          {evaluationResult.breakdown[0].identifiedCorrectParts.length > 0 && (
                            <div className="text-emerald-300 flex items-start gap-1">
                              <span>✓</span>
                              <span>
                                <strong>Correct Elements:</strong>{' '}
                                {evaluationResult.breakdown[0].identifiedCorrectParts.join(', ')}
                              </span>
                            </div>
                          )}
                          {evaluationResult.breakdown[0].identifiedIncorrectParts.length > 0 && (
                            <div className="text-rose-300 flex items-start gap-1">
                              <span>✗</span>
                              <span>
                                <strong>Missed Elements:</strong>{' '}
                                {evaluationResult.breakdown[0].identifiedIncorrectParts.join(', ')}
                              </span>
                            </div>
                          )}
                          <div className="text-slate-400 mt-1">
                            <strong>Constructive Guidance:</strong>{' '}
                            {evaluationResult.breakdown[0].constructiveFeedback}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="p-12 bg-white rounded-2xl border border-slate-200 text-center text-slate-400 text-sm">
              Select an assignment from the left to view questions, rubric, and run automated AI evaluations.
            </div>
          )}
        </div>
      </div>

      {/* GENERATE ASSIGNMENT MODAL */}
      {showGenModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-5 bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex items-center justify-between">
              <h3 className="font-bold text-base flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-400" />
                Generate Curriculum Assignment
              </h3>
              <button onClick={() => setShowGenModal(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleGenerateAssignment} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Grade</label>
                  <select
                    value={genGrade}
                    onChange={(e) => setGenGrade(Number(e.target.value) as Grade)}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg"
                  >
                    <option value={9}>Grade 9</option>
                    <option value={10}>Grade 10</option>
                    <option value={11}>Grade 11</option>
                    <option value={12}>Grade 12</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Assignment Type</label>
                  <select
                    value={genType}
                    onChange={(e) => setGenType(e.target.value as AssignmentType)}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg"
                  >
                    <option value="homework">Homework</option>
                    <option value="exercise">In-Class Exercise</option>
                    <option value="project">Hands-On Project</option>
                    <option value="revision">Revision Worksheet</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Subject</label>
                <input
                  type="text"
                  value={genSubject}
                  onChange={(e) => setGenSubject(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Unit Number</label>
                  <input
                    type="number"
                    min={1}
                    max={12}
                    value={genUnit}
                    onChange={(e) => setGenUnit(Number(e.target.value))}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Difficulty</label>
                  <select
                    value={genDifficulty}
                    onChange={(e) => setGenDifficulty(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Curriculum Topic</label>
                <input
                  type="text"
                  required
                  value={genTopic}
                  onChange={(e) => setTopicSafe(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="chk_premium_asg"
                  checked={genIsPremium}
                  onChange={(e) => setGenIsPremium(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="chk_premium_asg" className="text-xs font-medium text-slate-700">
                  Premium Assignment / Project (Accessible to 54 ETB/month tier subscribers)
                </label>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowGenModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5"
                >
                  <Sparkles className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
                  {isGenerating ? 'Generating...' : 'Generate Assignment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  function setTopicSafe(val: string) {
    setGenTopic(val);
  }
};
