import React, { useState } from 'react';
import {
  Sparkles,
  Award,
  HelpCircle,
  FileText,
  Brain,
  CheckCircle2,
  Loader2,
  Copy,
  BookOpen,
  Save,
  Check,
  Send,
  AlertCircle,
  Clock,
  Layers,
} from 'lucide-react';
import { Grade } from '../../types';
import { adminFirestoreService } from '../../services/adminFirestore';

type TeacherTool =
  | 'quiz_generator'
  | 'exam_generator'
  | 'explain_topic'
  | 'practice_exercises'
  | 'analyze_weakness'
  | 'lesson_plan';

export const AITeacherAssistantSection: React.FC = () => {
  const [activeTool, setActiveTool] = useState<TeacherTool>('quiz_generator');

  // Common Form States
  const [subject, setSubject] = useState('Biology');
  const [grade, setGrade] = useState<Grade>(9);
  const [unit, setUnit] = useState('1');
  const [topic, setTopic] = useState('Cell Organelles and Microscopy');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [examType, setExamType] = useState<'midterm' | 'final' | 'esslce_model'>('midterm');
  const [studentName, setStudentName] = useState('አበበ ቢቂላ (Abebe Bikila)');

  // Execution states
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // 1. Generate Quiz
  const handleGenerateQuiz = async () => {
    setIsLoading(true);
    setResult(null);
    setSavedSuccess(false);
    try {
      const res = await fetch('/api/ai-teacher/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, grade, unit, difficulty, count: 4, language: 'am' }),
      });
      const data = await res.json();
      setResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Generate Exam
  const handleGenerateExam = async () => {
    setIsLoading(true);
    setResult(null);
    setSavedSuccess(false);
    try {
      const res = await fetch('/api/ai-teacher/generate-exam', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, grade, examType, durationMinutes: 60, language: 'am' }),
      });
      const data = await res.json();
      setResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Explain Difficult Topic
  const handleExplainTopic = async () => {
    setIsLoading(true);
    setResult(null);
    try {
      const res = await fetch('/api/ai-teacher/explain-topic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, subject, grade, language: 'am' }),
      });
      const data = await res.json();
      setResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  // 4. Generate Practice Exercises
  const handleGeneratePractice = async () => {
    setIsLoading(true);
    setResult(null);
    try {
      const res = await fetch('/api/ai-teacher/generate-practice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, subject, grade, count: 3, language: 'am' }),
      });
      const data = await res.json();
      setResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  // 5. Analyze Student Weaknesses
  const handleAnalyzeWeakness = async () => {
    setIsLoading(true);
    setResult(null);
    try {
      const res = await fetch('/api/ai-teacher/analyze-weaknesses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName,
          subject,
          grade,
          scoreData: { quizScore: 8, total: 20, missedQuestions: ['Prokaryote vs Eukaryote nucleus', 'Cell wall cellulose composition'] },
          language: 'am',
        }),
      });
      const data = await res.json();
      setResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  // 6. Create Lesson Plan
  const handleCreateLessonPlan = async () => {
    setIsLoading(true);
    setResult(null);
    try {
      const res = await fetch('/api/ai-teacher/create-lesson-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, subject, grade, durationMinutes: 45, language: 'am' }),
      });
      const data = await res.json();
      setResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  // Save generated quiz to Firestore
  const handleSaveQuizToBank = async () => {
    if (!result?.questions) return;
    try {
      await adminFirestoreService.saveAssessmentQuiz({
        id: 'qz_' + Date.now(),
        title: result.title || `Grade ${grade} ${subject} Quiz`,
        subjectId: `g${grade}_${subject.toLowerCase()}`,
        subjectName: subject,
        grade,
        unitNumber: parseInt(unit) || 1,
        difficulty,
        timeLimitMinutes: 20,
        totalMarks: result.questions.length * 5,
        published: true,
        createdAt: new Date().toISOString(),
        questions: result.questions,
      });
      setSavedSuccess(true);
    } catch (e) {
      console.error(e);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(result, null, 2));
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-900 to-indigo-800 text-white p-5 rounded-2xl border border-indigo-700/50 shadow-md">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase bg-indigo-500/20 text-indigo-200 border border-indigo-400/30">
            FDRE MoE Curriculum AI Suite
          </span>
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            Teacher Workbench
          </span>
        </div>
        <h3 className="text-xl sm:text-2xl font-bold font-serif-ethiopic tracking-tight">
          የመምህራን AI ረዳት (AI Teacher Assistant)
        </h3>
        <p className="text-xs text-indigo-200 mt-1 max-w-2xl font-serif-ethiopic">
          Empower secondary school educators with curriculum-grounded quiz generation, national model exams, 5E pedagogical lesson plans, and diagnostic learning remediation.
        </p>
      </div>

      {/* Tool Navigation Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {[
          { id: 'quiz_generator', label: '1. ፈተና ማዘጋጀት (Generate Quiz)', icon: <Award className="w-3.5 h-3.5" /> },
          { id: 'exam_generator', label: '2. የትምህርት ፈተና (Generate Exam)', icon: <FileText className="w-3.5 h-3.5" /> },
          { id: 'explain_topic', label: '3. አርዕስት ማብራራት (Explain Topic)', icon: <Brain className="w-3.5 h-3.5" /> },
          { id: 'practice_exercises', label: '4. የተግባር ልምምድ (Practice Exercises)', icon: <Layers className="w-3.5 h-3.5" /> },
          { id: 'analyze_weakness', label: '5. ድክመት መመርመር (Analyze Weakness)', icon: <HelpCircle className="w-3.5 h-3.5" /> },
          { id: 'lesson_plan', label: '6. የመማሪያ ዕቅድ (5E Lesson Plan)', icon: <BookOpen className="w-3.5 h-3.5" /> },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => {
              setActiveTool(t.id as TeacherTool);
              setResult(null);
            }}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeTool === t.id
                ? 'bg-indigo-700 text-white shadow-xs'
                : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
            }`}
          >
            {t.icon}
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* Form Controls Card */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="block font-bold text-stone-700 mb-1">የትምህርት አይነት (Subject):</label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full p-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-600"
            >
              <option value="Biology">Biology (ስነ-ህይወት)</option>
              <option value="Chemistry">Chemistry (ኬሚስትሪ)</option>
              <option value="Physics">Physics (ፊዚክስ)</option>
              <option value="Mathematics">Mathematics (ሒሳብ)</option>
              <option value="English">English (እንግሊዝኛ)</option>
              <option value="Geography">Geography (ጆግራፊ)</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-stone-700 mb-1">ደረጃ (Grade):</label>
            <select
              value={grade}
              onChange={(e) => setGrade(parseInt(e.target.value) as Grade)}
              className="w-full p-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-600"
            >
              <option value={9}>Grade 9 (9ኛ ክፍል)</option>
              <option value={10}>Grade 10 (10ኛ ክፍል)</option>
              <option value={11}>Grade 11 (11ኛ ክፍል)</option>
              <option value={12}>Grade 12 (12ኛ ክፍል)</option>
            </select>
          </div>

          {activeTool === 'quiz_generator' && (
            <>
              <div>
                <label className="block font-bold text-stone-700 mb-1">ምዕራፍ (Unit Number):</label>
                <input
                  type="text"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  placeholder="e.g. 1"
                  className="w-full p-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-600"
                />
              </div>
              <div>
                <label className="block font-bold text-stone-700 mb-1">የከበደበት መጠን (Difficulty):</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as any)}
                  className="w-full p-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-600"
                >
                  <option value="easy">ቀላል (Basic/Easy)</option>
                  <option value="medium">መካከለኛ (Medium)</option>
                  <option value="hard">ከባድ (Challenging)</option>
                </select>
              </div>
            </>
          )}

          {activeTool === 'exam_generator' && (
            <div>
              <label className="block font-bold text-stone-700 mb-1">የፈተና ዓይነት (Exam Type):</label>
              <select
                value={examType}
                onChange={(e) => setExamType(e.target.value as any)}
                className="w-full p-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-600"
              >
                <option value="midterm">የመንፈቀ-ዓመት አጋማሽ (Midterm)</option>
                <option value="final">የመንፈቀ-ዓመት ማጠቃለያ (Final Exam)</option>
                <option value="esslce_model">የብሔራዊ ሞዴል ፈተና (ESSLCE Model)</option>
              </select>
            </div>
          )}

          {(activeTool === 'explain_topic' || activeTool === 'practice_exercises' || activeTool === 'lesson_plan') && (
            <div className="sm:col-span-2">
              <label className="block font-bold text-stone-700 mb-1">አርዕስት (Topic Title):</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Cell Organelles, Projectile Motion, Stoichiometry"
                className="w-full p-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-600"
              />
            </div>
          )}

          {activeTool === 'analyze_weakness' && (
            <div className="sm:col-span-2">
              <label className="block font-bold text-stone-700 mb-1">የተማሪ ስም (Student Name):</label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="Student Name"
                className="w-full p-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-600"
              />
            </div>
          )}
        </div>

        {/* Action Trigger */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
          <button
            onClick={() => {
              if (activeTool === 'quiz_generator') handleGenerateQuiz();
              else if (activeTool === 'exam_generator') handleGenerateExam();
              else if (activeTool === 'explain_topic') handleExplainTopic();
              else if (activeTool === 'practice_exercises') handleGeneratePractice();
              else if (activeTool === 'analyze_weakness') handleAnalyzeWeakness();
              else if (activeTool === 'lesson_plan') handleCreateLessonPlan();
            }}
            disabled={isLoading}
            className="px-5 py-2.5 bg-indigo-700 hover:bg-indigo-800 disabled:opacity-50 text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-all shadow-xs cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>በማዘጋጀት ላይ (Generating with Resilient AI)...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>አመንጭ (Generate with AI)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Output Display Container */}
      {result && (
        <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <h4 className="text-base font-bold text-stone-900 font-serif-ethiopic flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>የ AI ውጤት (AI Generated Results)</span>
              </h4>
              <p className="text-xs text-stone-500">
                Grounded in official Ethiopian Ministry of Education curriculum
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={copyToClipboard}
                className="px-3 py-1.5 text-xs text-stone-600 hover:bg-stone-100 rounded-lg flex items-center gap-1 cursor-pointer"
              >
                {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{isCopied ? 'Copied' : 'Copy JSON'}</span>
              </button>

              {activeTool === 'quiz_generator' && result.questions && (
                <button
                  onClick={handleSaveQuizToBank}
                  disabled={savedSuccess}
                  className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                >
                  {savedSuccess ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
                  <span>{savedSuccess ? 'Saved to Firestore!' : 'Save to Quiz Bank'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Render Quiz Items */}
          {result.questions && (
            <div className="space-y-3">
              <div className="font-bold text-stone-800 text-sm font-serif-ethiopic">
                {result.title}
              </div>
              {result.questions.map((q: any, i: number) => (
                <div key={q.id || i} className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 text-xs space-y-2">
                  <div className="font-bold text-stone-900">
                    {i + 1}. {q.question}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pl-2">
                    {q.options?.map((opt: string, optIdx: number) => (
                      <div
                        key={optIdx}
                        className={`p-2 rounded-lg border text-[11px] ${
                          optIdx === q.correctIndex
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold'
                            : 'bg-white border-stone-200 text-stone-700'
                        }`}
                      >
                        {String.fromCharCode(65 + optIdx)}. {opt}
                        {optIdx === q.correctIndex && ' ✓ (Correct)'}
                      </div>
                    ))}
                  </div>
                  {q.explanation && (
                    <div className="text-[11px] text-stone-600 bg-stone-100/70 p-2 rounded-lg">
                      <span className="font-bold text-stone-700">ማብራሪያ: </span>
                      {q.explanation} {q.textbookPage && `(Textbook page ${q.textbookPage})`}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Render Text Explanations */}
          {result.explanation && (
            <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-200 text-xs text-stone-800 whitespace-pre-line leading-relaxed font-serif-ethiopic">
              {result.explanation}
            </div>
          )}

          {/* Render Lesson Plan Stages */}
          {result.stages && (
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <div className="font-bold text-stone-800 mb-1">1. ዓላማዎች (Objectives):</div>
                <ul className="list-disc list-inside space-y-0.5 text-stone-700">
                  {result.objectives?.map((obj: string, i: number) => (
                    <li key={i}>{obj}</li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {Object.entries(result.stages).map(([stage, desc]: any) => (
                  <div key={stage} className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                    <span className="font-bold text-indigo-900 uppercase text-[10px] tracking-wider block mb-1">
                      Stage: {stage}
                    </span>
                    <p className="text-stone-700 text-xs">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Render Practice Exercises */}
          {result.exercises && (
            <div className="space-y-3 text-xs">
              {result.exercises.map((ex: any, i: number) => (
                <div key={i} className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-900">Exercise {i + 1} ({ex.level})</span>
                  </div>
                  <p className="text-stone-800 font-medium">{ex.problem}</p>
                  <div className="bg-white p-2.5 rounded-lg border border-stone-200 text-[11px] text-stone-600 space-y-1">
                    <div className="font-bold text-emerald-800">የአሰራር ሂደት (Worked Solution):</div>
                    {ex.solutionSteps?.map((s: string, sIdx: number) => (
                      <div key={sIdx}>{s}</div>
                    ))}
                    <div className="font-bold text-stone-800 pt-1">መልስ: {ex.finalAnswer}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Render Student Weakness Analysis */}
          {result.identifiedGaps && (
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl space-y-1">
                <div className="font-bold text-rose-950">የተለዩ የትምህርት ክፍተቶች (Identified Gaps):</div>
                <ul className="list-disc list-inside text-rose-900">
                  {result.identifiedGaps.map((g: string, i: number) => (
                    <li key={i}>{g}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-1">
                <div className="font-bold text-amber-950">የመፍትሄ የድርጊት መርሃግብር (Teacher Action Plan):</div>
                <ul className="list-disc list-inside text-amber-900">
                  {result.teacherActionPlan?.map((a: string, i: number) => (
                    <li key={i}>{a}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900">
                <span className="font-bold">የማበረታቻ መልዕክት: </span>
                {result.encouragementMessage}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
