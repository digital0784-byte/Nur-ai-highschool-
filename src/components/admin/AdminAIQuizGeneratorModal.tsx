import React, { useState } from 'react';
import {
  Sparkles,
  X,
  CheckCircle2,
  RefreshCw,
  BookOpen,
  Plus,
  HelpCircle,
  Calculator,
  ListCheck,
  CheckSquare,
  AlertCircle,
} from 'lucide-react';
import { Grade } from '../../types';
import {
  AIQuizGenerationRequest,
  GeneratedQuizQuestion,
  QuestionType,
  QuestionDifficulty,
} from '../../types/adminAutomation';
import { adminAutomationService } from '../../services/adminAutomationService';
import { addQuestionToBank } from '../../engine/assessmentEngine';

interface AdminAIQuizGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSavedToBank?: () => void;
}

const SUBJECT_OPTIONS = [
  'Mathematics (ሒሳብ)',
  'Physics (ፊዚክስ)',
  'Chemistry (ኬሚስትሪ)',
  'Biology (ስነ-ህይወት)',
  'English (እንግሊዝኛ)',
  'History (ታሪክ)',
  'Geography (ጂኦግራፊ)',
  'Economics (ኢኮኖሚክስ)',
  'Information Technology (አይቲ)',
  'Citizenship (የዜግነት ትምህርት)',
];

export const AdminAIQuizGeneratorModal: React.FC<AdminAIQuizGeneratorModalProps> = ({
  isOpen,
  onClose,
  onSavedToBank,
}) => {
  const [grade, setGrade] = useState<Grade>(10);
  const [subject, setSubject] = useState(SUBJECT_OPTIONS[0]);
  const [unit, setUnit] = useState<number>(2);
  const [lesson, setLesson] = useState('Lesson 2.1: Key Principles');
  const [topic, setTopic] = useState('Quadratic Equations and Roots');
  const [difficulty, setDifficulty] = useState<QuestionDifficulty>('medium');
  const [questionCount, setQuestionCount] = useState<number>(5);

  const [selectedTypes, setSelectedTypes] = useState<QuestionType[]>([
    'multiple_choice',
    'true_false',
    'calculation',
  ]);

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<GeneratedQuizQuestion[]>([]);
  const [saveSuccessMap, setSaveSuccessMap] = useState<Record<string, boolean>>({});

  if (!isOpen) return null;

  const toggleType = (t: QuestionType) => {
    if (selectedTypes.includes(t)) {
      if (selectedTypes.length > 1) {
        setSelectedTypes(selectedTypes.filter((item) => item !== t));
      }
    } else {
      setSelectedTypes([...selectedTypes, t]);
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsGenerating(true);
      setSaveSuccessMap({});
      const req: AIQuizGenerationRequest = {
        grade,
        subject,
        unit,
        lesson,
        topic,
        difficulty,
        questionCount,
        questionTypes: selectedTypes,
      };
      const res = await adminAutomationService.generateQuiz(req);
      setGeneratedQuestions(res.questions || []);
    } catch (err: any) {
      alert(`Generation error: ${err?.message || 'Failed to generate quiz'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddToQuestionBank = (q: GeneratedQuizQuestion) => {
    // Map to CurriculumQuestion for assessmentEngine
    const mappedType: any = q.type === 'calculation' ? 'short_answer' : q.type === 'multi_select' ? 'mcq' : q.type;
    const curriculumQ: any = {
      id: q.id,
      grade: q.grade,
      subjectId: q.subject.toLowerCase().includes('math')
        ? 'math'
        : q.subject.toLowerCase().includes('phys')
        ? 'physics'
        : q.subject.toLowerCase().includes('chem')
        ? 'chemistry'
        : 'biology',
      subjectName: q.subject,
      unitNumber: q.unit,
      unitTitle: `Unit ${q.unit}`,
      lessonTitle: q.lesson,
      topic: q.topic,
      type: mappedType,
      difficulty: q.difficulty,
      question: q.question,
      options: q.options || [],
      correctAnswer: Array.isArray(q.correctAnswer) ? q.correctAnswer.join(', ') : q.correctAnswer,
      explanation: q.explanation,
      status: 'approved',
      textbookReference: {
        bookTitle: `FDRE MoE Grade ${q.grade} ${q.subject}`,
        editionYear: '2019 ዓ.ም',
        pageNumber: 42,
        chapter: `Unit ${q.unit}`,
      },
    };

    addQuestionToBank(curriculumQ);
    setSaveSuccessMap((prev) => ({ ...prev, [q.id]: true }));
    if (onSavedToBank) onSavedToBank();
  };

  const handleAddAllToQuestionBank = () => {
    generatedQuestions.forEach((q) => handleAddToQuestionBank(q));
  };

  return (
    <div
      id="modal_ai_quiz_generator"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
    >
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-slate-900 via-emerald-950 to-teal-950 text-white flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">AI Quiz Generator (Curriculum-Grounded)</h3>
              <p className="text-xs text-slate-300">
                FDRE Ministry of Education High School Curriculum (2019 ዓ.ም)
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Generation Configuration Form */}
          <form onSubmit={handleGenerate} className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Target Grade</label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(Number(e.target.value) as Grade)}
                  className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                >
                  <option value={9}>Grade 9 (9ኛ ክፍል)</option>
                  <option value={10}>Grade 10 (10ኛ ክፍል)</option>
                  <option value={11}>Grade 11 (11ኛ ክፍል)</option>
                  <option value={12}>Grade 12 (12ኛ ክፍል)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Subject</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                >
                  {SUBJECT_OPTIONS.map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Unit Number</label>
                <input
                  type="number"
                  min={1}
                  max={12}
                  value={unit}
                  onChange={(e) => setUnit(Number(e.target.value))}
                  className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Specific Lesson Title</label>
                <input
                  type="text"
                  value={lesson}
                  onChange={(e) => setLesson(e.target.value)}
                  placeholder="e.g. Lesson 2.2: Solving by Factoring"
                  className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Curriculum Topic</label>
                <input
                  type="text"
                  required
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. Quadratic Formula and Discriminant"
                  className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Difficulty</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as QuestionDifficulty)}
                  className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="easy">Foundational (Easy)</option>
                  <option value="medium">Standard National Exam (Medium)</option>
                  <option value="hard">Advanced Problem Solving (Hard)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Question Count</label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={questionCount}
                  onChange={(e) => setQuestionCount(Number(e.target.value))}
                  className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Question Formats</label>
                <div className="flex flex-wrap gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => toggleType('multiple_choice')}
                    className={`text-[11px] px-2 py-1 rounded-md border font-medium ${
                      selectedTypes.includes('multiple_choice')
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-white text-slate-700 border-slate-300'
                    }`}
                  >
                    MCQ
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleType('true_false')}
                    className={`text-[11px] px-2 py-1 rounded-md border font-medium ${
                      selectedTypes.includes('true_false')
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-white text-slate-700 border-slate-300'
                    }`}
                  >
                    True/False
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleType('calculation')}
                    className={`text-[11px] px-2 py-1 rounded-md border font-medium ${
                      selectedTypes.includes('calculation')
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-white text-slate-700 border-slate-300'
                    }`}
                  >
                    Calculation
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={isGenerating}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2"
              >
                <Sparkles className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
                {isGenerating ? 'Grounding Questions with Curriculum AI...' : 'Generate Curriculum Questions'}
              </button>
            </div>
          </form>

          {/* Generated Questions List */}
          {generatedQuestions.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Generated Questions ({generatedQuestions.length})
                  </h4>
                  <p className="text-xs text-slate-500">
                    Topic: <strong>{topic}</strong> • Grounded in FDRE MoE Grade {grade} {subject}
                  </p>
                </div>
                <button
                  onClick={handleAddAllToQuestionBank}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add All to Question Bank
                </button>
              </div>

              <div className="space-y-3">
                {generatedQuestions.map((q, idx) => (
                  <div
                    key={q.id}
                    className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm space-y-2.5 hover:border-emerald-300 transition-all"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase font-bold">
                          {q.type.replace('_', ' ')}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                          {q.difficulty}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                          {q.qualityStatus}
                        </span>
                      </div>

                      <button
                        onClick={() => handleAddToQuestionBank(q)}
                        disabled={saveSuccessMap[q.id]}
                        className={`text-xs px-3 py-1 rounded-lg font-semibold flex items-center gap-1 transition-colors ${
                          saveSuccessMap[q.id]
                            ? 'bg-emerald-100 text-emerald-800 cursor-default'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        }`}
                      >
                        {saveSuccessMap[q.id] ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 text-emerald-700" /> Saved in Bank
                          </>
                        ) : (
                          <>
                            <Plus className="w-3 h-3" /> Add to Bank
                          </>
                        )}
                      </button>
                    </div>

                    <p className="font-semibold text-slate-900 text-sm">{q.question}</p>

                    {q.options && q.options.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        {q.options.map((opt, oIdx) => {
                          const isCorrect =
                            opt === q.correctAnswer ||
                            (Array.isArray(q.correctAnswer) && q.correctAnswer.includes(opt));
                          return (
                            <div
                              key={oIdx}
                              className={`p-2 rounded-lg text-xs border ${
                                isCorrect
                                  ? 'bg-emerald-50/80 border-emerald-300 font-semibold text-emerald-900'
                                  : 'bg-slate-50 border-slate-200 text-slate-700'
                              }`}
                            >
                              <span className="font-mono mr-1.5">{String.fromCharCode(65 + oIdx)}.</span> {opt}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    <div className="p-2.5 rounded-lg bg-emerald-50/50 border border-emerald-100 text-xs text-slate-700 space-y-1">
                      <div className="font-semibold text-emerald-900 flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
                        Explanation & Textbook Grounding:
                      </div>
                      <p className="text-slate-600">{q.explanation}</p>
                      <div className="text-[11px] font-mono text-emerald-800">{q.textbookReference}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between flex-shrink-0 text-xs text-slate-500">
          <span>Grounding Model: Gemini 3.1 & MoE Approved Textbooks</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-xl transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
