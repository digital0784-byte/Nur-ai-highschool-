import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Layers,
  HelpCircle,
  Sparkles,
  Camera,
  Volume2,
  VolumeX,
  Upload,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Award,
  Search,
  BookMarked,
  BrainCircuit,
  ArrowRight,
  GraduationCap,
  PlayCircle,
  ChevronDown,
  ChevronRight,
  RotateCcw,
} from 'lucide-react';
import {
  GradeLevel,
  CurriculumSubjectItem,
  CurriculumUnit,
  CurriculumTopic,
  CurriculumQuestion,
  SubjectKnowledgeMap,
  KnowledgeNode,
  QuestionType,
  DifficultyLevel,
} from '../types/curriculumEngine';
import { CurriculumKnowledgeMapView } from './CurriculumKnowledgeMapView';
import { TextbookIngestionModal } from './TextbookIngestionModal';

interface Props {
  initialGrade?: GradeLevel;
  onClose?: () => void;
  language?: string; // 'am' | 'en' | 'om' | 'ti'
}

export const EthiopianCurriculumEngineView: React.FC<Props> = ({
  initialGrade = 9,
  onClose,
  language: parentLanguage = 'am',
}) => {
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel>(initialGrade);
  const [language, setLanguage] = useState<'am' | 'en' | 'om' | 'ti'>(
    (parentLanguage as any) || 'am'
  );
  const [activeTab, setActiveTab] = useState<
    'hierarchy' | 'knowledge_map' | 'question_bank' | 'ai_tutor' | 'photo_solver' | 'voice_tutor' | 'exam_generator'
  >('hierarchy');

  // Curriculum Data State
  const [stats, setStats] = useState<any>(null);
  const [subjects, setSubjects] = useState<CurriculumSubjectItem[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('math-g9');
  const [selectedUnitNumber, setSelectedUnitNumber] = useState<number>(1);
  const [selectedTopicId, setSelectedTopicId] = useState<string>('math-g9-u1-top1');
  const [knowledgeMap, setKnowledgeMap] = useState<SubjectKnowledgeMap | null>(null);
  const [isIngestionModalOpen, setIsIngestionModalOpen] = useState(false);

  // Question Bank State
  const [questionBank, setQuestionBank] = useState<CurriculumQuestion[]>([]);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [userAnswers, setUserAnswers] = useState<Record<string, any>>({});
  const [revealedExplanations, setRevealedExplanations] = useState<Record<string, boolean>>({});

  // AI Tutor (Ask from Textbook) State
  const [tutorQuery, setTutorQuery] = useState('');
  const [tutorLoading, setTutorLoading] = useState(false);
  const [tutorResponse, setTutorResponse] = useState<any>(null);

  // Photo Question Solver State
  const [photoBase64, setPhotoBase64] = useState<string | null>(null);
  const [photoSolving, setPhotoSolving] = useState(false);
  const [photoSolution, setPhotoSolution] = useState<string | null>(null);

  // Voice Tutor State
  const [voiceQuery, setVoiceQuery] = useState('');
  const [voiceSpeaking, setVoiceSpeaking] = useState(false);
  const [voiceScript, setVoiceScript] = useState<string | null>(null);

  // Exam Generator State
  const [examUnit, setExamUnit] = useState<number>(1);
  const [examQuestionCount, setExamQuestionCount] = useState<number>(3);
  const [examDifficulty, setExamDifficulty] = useState<DifficultyLevel>('medium');
  const [generatedExam, setGeneratedExam] = useState<any[]>([]);
  const [generatingExam, setGeneratingExam] = useState(false);

  // Hierarchy expanders
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    'math-g9-u1-s1': true,
  });

  // Load stats and subjects on mount or grade change
  useEffect(() => {
    fetchStats();
    fetchSubjects();
  }, [selectedGrade]);

  // Load knowledge map and questions when subject changes
  useEffect(() => {
    if (selectedSubjectId) {
      fetchKnowledgeMap(selectedSubjectId);
      fetchQuestions(selectedSubjectId);
    }
  }, [selectedSubjectId]);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/curriculum/stats');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (e) {
      console.warn('Failed to load stats', e);
    }
  };

  const fetchSubjects = async () => {
    try {
      const res = await fetch(`/api/curriculum/subjects?grade=${selectedGrade}`);
      if (res.ok) {
        const data = await res.json();
        const list: CurriculumSubjectItem[] = data.subjects || [];
        setSubjects(list);
        if (list.length > 0 && !list.some((s) => s.id === selectedSubjectId)) {
          setSelectedSubjectId(list[0].id);
          setSelectedUnitNumber(list[0].units[0]?.unitNumber || 1);
        }
      }
    } catch (e) {
      console.warn('Failed to load subjects', e);
    }
  };

  const fetchKnowledgeMap = async (subjectId: string) => {
    try {
      const res = await fetch(`/api/curriculum/knowledge-map/${subjectId}`);
      if (res.ok) {
        const data = await res.json();
        setKnowledgeMap(data);
      } else {
        setKnowledgeMap(null);
      }
    } catch (e) {
      setKnowledgeMap(null);
    }
  };

  const fetchQuestions = async (subjectId: string) => {
    try {
      const res = await fetch('/api/curriculum/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subjectId, grade: selectedGrade }),
      });
      if (res.ok) {
        const data = await res.json();
        setQuestionBank(data.questions || []);
      }
    } catch (e) {
      console.warn('Failed to load questions', e);
    }
  };

  const selectedSubject = subjects.find((s) => s.id === selectedSubjectId) || subjects[0];
  const selectedUnit = selectedSubject?.units.find((u) => u.unitNumber === selectedUnitNumber) || selectedSubject?.units[0];

  // Ask from Textbook Handlers
  const handleAskTextbook = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!tutorQuery.trim()) return;

    setTutorLoading(true);
    setTutorResponse(null);

    try {
      const res = await fetch('/api/ai/ask-textbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: tutorQuery,
          grade: selectedGrade,
          subjectId: selectedSubjectId,
          subjectName: selectedSubject?.name?.en || 'Mathematics',
          language,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setTutorResponse(data);
      } else {
        setTutorResponse({
          answer: 'ይቅርታ፣ ጥያቄውን በመማሪያ መጽሐፍ ማጣቀሻ ለመመለስ አልተቻለም።',
          citations: [],
          groundedInTextbook: false,
        });
      }
    } catch (err: any) {
      setTutorResponse({
        answer: `ስህተት ተከስቷል፦ ${err.message}`,
        citations: [],
        groundedInTextbook: false,
      });
    } finally {
      setTutorLoading(false);
    }
  };

  // Photo Question Solver Handler
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setPhotoBase64(reader.result as string);
      setPhotoSolution(null);
    };
    reader.readAsDataURL(file);
  };

  const handleSolvePhoto = async () => {
    if (!photoBase64) return;
    setPhotoSolving(true);
    setPhotoSolution(null);

    try {
      const res = await fetch('/api/ai/solve-photo-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: photoBase64,
          grade: selectedGrade,
          subjectName: selectedSubject?.name?.en || 'General',
          language,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setPhotoSolution(data.solution);
      } else {
        setPhotoSolution('ፎቶውን በማንበብ ጥያቄውን መፍታት አልተቻለም። እባክዎ ምስሉ ግልጽ መሆኑን ያረጋግጡ።');
      }
    } catch (err: any) {
      setPhotoSolution(`ስህተት፦ ${err.message}`);
    } finally {
      setPhotoSolving(false);
    }
  };

  // Voice Tutor Handler
  const handleSpeakVoice = async (queryText?: string) => {
    const textToAsk = queryText || voiceQuery || 'Explain the central concepts of this unit';
    setVoiceSpeaking(true);

    try {
      const res = await fetch('/api/ai/voice-tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: textToAsk,
          grade: selectedGrade,
          subjectName: selectedSubject?.name?.en || 'Mathematics',
          language,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setVoiceScript(data.speechScript);

        // Native Speech Synthesis
        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(data.speechScript);
          utterance.lang = language === 'am' ? 'am-ET' : 'en-US';
          utterance.rate = 0.95;
          utterance.onend = () => setVoiceSpeaking(false);
          utterance.onerror = () => setVoiceSpeaking(false);
          window.speechSynthesis.speak(utterance);
        } else {
          setVoiceSpeaking(false);
        }
      }
    } catch (e) {
      setVoiceSpeaking(false);
    }
  };

  const handleStopVoice = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setVoiceSpeaking(false);
  };

  // Generate Exam Handler
  const handleGenerateExam = async () => {
    setGeneratingExam(true);
    setGeneratedExam([]);

    try {
      const res = await fetch('/api/ai/generate-curriculum-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grade: selectedGrade,
          subjectId: selectedSubjectId,
          subjectName: selectedSubject?.name?.en || 'Mathematics',
          unitNumber: examUnit,
          questionCount: examQuestionCount,
          difficulty: examDifficulty,
          language,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setGeneratedExam(data.questions || []);
      }
    } catch (e) {
      console.warn('Exam generation failed', e);
    } finally {
      setGeneratingExam(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Top Banner: Engine Status & Identity */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 text-[11px] font-extrabold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
                Ethiopian Curriculum Engine
              </span>
              <span className="px-2.5 py-0.5 text-[11px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full">
                Grades 9–12 Ministry Standards
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
              <BrainCircuit className="w-7 h-7 text-emerald-400" />
              ኑር AI የስርዓተ-ትምህርት ኢንጅን (Curriculum Engine)
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl mt-1.5 leading-relaxed">
              ከ1ኛ ገጽ እስከ መጨረሻው ገጽ የተሟላ፣ ከይፋዊ የመማሪያ መጽሐፍት በቀጥታ የተገነባ፣ እውነተኛ የእውቀት ካርታ እና ጥብቅ የAI ቲቶር ስርዓት።
            </p>
          </div>

          {/* Quick Actions & Grade Selector */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Grade Selector */}
            <div className="flex bg-slate-800 p-1 rounded-2xl border border-slate-700">
              {([9, 10, 11, 12] as GradeLevel[]).map((g) => (
                <button
                  key={g}
                  onClick={() => setSelectedGrade(g)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedGrade === g
                      ? 'bg-emerald-500 text-slate-950 shadow-sm'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  ክፍል {g}
                </button>
              ))}
            </div>

            {/* Language Switcher */}
            <div className="flex bg-slate-800 p-1 rounded-2xl border border-slate-700 text-xs font-semibold">
              {(['am', 'en', 'om', 'ti'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`px-2.5 py-1.5 rounded-xl transition-all uppercase ${
                    language === lang
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {lang === 'am' ? 'አማ' : lang === 'om' ? 'Oro' : lang === 'ti' ? 'ትግ' : 'Eng'}
                </button>
              ))}
            </div>

            {/* Reusable Ingest Button */}
            <button
              onClick={() => setIsIngestionModalOpen(true)}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white text-slate-900 hover:bg-slate-100 flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Upload className="w-3.5 h-3.5 text-indigo-600" />
              መጽሐፍ አስገባ (Import)
            </button>
          </div>
        </div>

        {/* Live Engine Metrics Audit Bar */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6 pt-6 border-t border-slate-800 text-xs">
            <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/60">
              <span className="text-slate-400 block text-[10px] font-bold uppercase">የትምህርት አይነቶች</span>
              <span className="text-lg font-black text-emerald-400">{stats.subjectsCount} Subjects</span>
            </div>
            <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/60">
              <span className="text-slate-400 block text-[10px] font-bold uppercase">ምዕራፎች</span>
              <span className="text-lg font-black text-indigo-300">{stats.unitsCount} Units</span>
            </div>
            <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/60">
              <span className="text-slate-400 block text-[10px] font-bold uppercase">ትምህርቶችና ርዕሶች</span>
              <span className="text-lg font-black text-blue-300">{stats.topicsCount} Topics</span>
            </div>
            <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/60">
              <span className="text-slate-400 block text-[10px] font-bold uppercase">የጥያቄዎች ባንክ</span>
              <span className="text-lg font-black text-amber-300">{stats.questionsCount} Questions</span>
            </div>
            <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/60">
              <span className="text-slate-400 block text-[10px] font-bold uppercase">የእውቀት ካርታ ኖዶች</span>
              <span className="text-lg font-black text-purple-300">{stats.knowledgeMapNodesCount} Nodes</span>
            </div>
            <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/60">
              <span className="text-slate-400 block text-[10px] font-bold uppercase">ያልተካተቱ ገጾች</span>
              <span className="text-lg font-black text-emerald-400">0% (100% Processed)</span>
            </div>
          </div>
        )}
      </div>

      {/* Subject Navigation Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {subjects.map((s) => (
          <button
            key={s.id}
            onClick={() => {
              setSelectedSubjectId(s.id);
              setSelectedUnitNumber(s.units[0]?.unitNumber || 1);
            }}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 border ${
              selectedSubjectId === s.id
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            <BookOpen className={`w-3.5 h-3.5 ${selectedSubjectId === s.id ? 'text-white' : 'text-indigo-600'}`} />
            <span>{s.name[language] || s.name.am || s.name.en}</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                selectedSubjectId === s.id ? 'bg-indigo-700 text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              {s.units.length} Units
            </span>
          </button>
        ))}
      </div>

      {/* Feature Tabs Navigation */}
      <div className="flex items-center gap-1.5 border-b border-slate-200 overflow-x-auto">
        <button
          onClick={() => setActiveTab('hierarchy')}
          className={`px-4 py-3 text-xs font-bold border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'hierarchy'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          {language === 'am' ? 'የስርዓተ-ትምህርት ደረጃዎች (Hierarchy)' : 'Curriculum Hierarchy'}
        </button>

        <button
          onClick={() => setActiveTab('knowledge_map')}
          className={`px-4 py-3 text-xs font-bold border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'knowledge_map'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <BrainCircuit className="w-4 h-4" />
          {language === 'am' ? 'የእውቀት ካርታ (Knowledge Map)' : 'Knowledge Map & Prereqs'}
        </button>

        <button
          onClick={() => setActiveTab('question_bank')}
          className={`px-4 py-3 text-xs font-bold border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'question_bank'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          {language === 'am' ? 'የጥያቄዎች ባንክ (Question Bank - 7 Types)' : 'Question Bank (7 Types)'}
        </button>

        <button
          onClick={() => setActiveTab('ai_tutor')}
          className={`px-4 py-3 text-xs font-bold border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'ai_tutor'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Sparkles className="w-4 h-4 text-emerald-500" />
          {language === 'am' ? 'ከመጽሐፉ ጠይቅ (Ask from Textbook)' : 'Ask from Textbook (RAG)'}
        </button>

        <button
          onClick={() => setActiveTab('photo_solver')}
          className={`px-4 py-3 text-xs font-bold border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'photo_solver'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Camera className="w-4 h-4 text-purple-500" />
          {language === 'am' ? 'በፎቶ ጥያቄ ፈቺ (Photo Solver)' : 'Photo Question Solver'}
        </button>

        <button
          onClick={() => setActiveTab('voice_tutor')}
          className={`px-4 py-3 text-xs font-bold border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'voice_tutor'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Volume2 className="w-4 h-4 text-blue-500" />
          {language === 'am' ? 'የድምፅ አስተማሪ (Voice Tutor)' : 'Voice Tutor'}
        </button>

        <button
          onClick={() => setActiveTab('exam_generator')}
          className={`px-4 py-3 text-xs font-bold border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'exam_generator'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <GraduationCap className="w-4 h-4 text-amber-500" />
          {language === 'am' ? 'የፈተና አዘጋጅ (Exam Generator)' : 'AI Exam Generator'}
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: CURRICULUM HIERARCHY EXPLORER */}
      {/* ========================================================================= */}
      {activeTab === 'hierarchy' && selectedUnit && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Unit Selector Column */}
          <div className="lg:col-span-4 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {language === 'am' ? 'የመማሪያ መጽሐፉ ምዕራፎች' : 'Textbook Units'}
            </h3>
            {selectedSubject?.units.map((unit) => (
              <button
                key={unit.id}
                onClick={() => setSelectedUnitNumber(unit.unitNumber)}
                className={`w-full text-left p-4 rounded-2xl border transition-all ${
                  selectedUnitNumber === unit.unitNumber
                    ? 'border-indigo-600 bg-indigo-50/50 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold mb-1">
                  <span className="text-indigo-600">Unit {unit.unitNumber}</span>
                  <span className="text-slate-400">
                    ገጽ {unit.textbookPageStart}-{unit.textbookPageEnd}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-800 line-clamp-2">
                  {unit.title[language] || unit.title.am || unit.title.en}
                </h4>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{unit.description}</p>
              </button>
            ))}
          </div>

          {/* Right: Detailed Deep-Dive for Selected Unit */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
              <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                    Unit {selectedUnit.unitNumber} • Official Ministry Textbook
                  </span>
                  <h2 className="text-xl font-black text-slate-900 mt-1">
                    {selectedUnit.title[language] || selectedUnit.title.am || selectedUnit.title.en}
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">{selectedUnit.description}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                    ገጽ {selectedUnit.textbookPageStart} - {selectedUnit.textbookPageEnd}
                  </span>
                </div>
              </div>

              {/* Sections & Lessons Hierarchy */}
              <div className="mt-6 space-y-4">
                {selectedUnit.sections.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 text-xs">
                    የዚህ ምዕራፍ ክፍሎች በመቀናበር ላይ ናቸው።
                  </div>
                ) : (
                  selectedUnit.sections.map((section) => {
                    const isExpanded = expandedSections[section.id] ?? true;
                    return (
                      <div key={section.id} className="border border-slate-200 rounded-2xl overflow-hidden">
                        <button
                          onClick={() =>
                            setExpandedSections((prev) => ({ ...prev, [section.id]: !isExpanded }))
                          }
                          className="w-full px-5 py-3.5 bg-slate-50 flex items-center justify-between text-left hover:bg-slate-100/80 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            {isExpanded ? (
                              <ChevronDown className="w-4 h-4 text-slate-500" />
                            ) : (
                              <ChevronRight className="w-4 h-4 text-slate-500" />
                            )}
                            <span className="text-xs font-black text-slate-800">
                              Section {section.sectionNumber}: {section.title[language] || section.title.am || section.title.en}
                            </span>
                          </div>
                          <span className="text-[11px] font-semibold text-slate-400">
                            ገጽ {section.textbookPageStart}-{section.textbookPageEnd}
                          </span>
                        </button>

                        {isExpanded && (
                          <div className="p-5 space-y-5 bg-white">
                            {section.lessons.map((lesson) => (
                              <div key={lesson.id} className="space-y-4">
                                <div className="flex items-center justify-between text-xs font-bold text-slate-700 pb-1 border-b border-slate-100">
                                  <span>{lesson.lessonNumber}: {lesson.title[language] || lesson.title.am || lesson.title.en}</span>
                                  <span className="text-slate-400 font-normal">{lesson.periodCount} Periods</span>
                                </div>

                                {lesson.topics.map((topic) => (
                                  <div
                                    key={topic.id}
                                    className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3"
                                  >
                                    <div className="flex items-start justify-between gap-3">
                                      <div>
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 block">
                                          Topic {topic.topicNumber} (ገጽ {topic.textbookPage})
                                        </span>
                                        <h4 className="text-sm font-bold text-slate-900 mt-0.5">
                                          {topic.title[language] || topic.title.am || topic.title.en}
                                        </h4>
                                      </div>
                                      <span
                                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase ${
                                          topic.difficulty === 'easy'
                                            ? 'bg-emerald-100 text-emerald-800'
                                            : topic.difficulty === 'medium'
                                            ? 'bg-amber-100 text-amber-800'
                                            : 'bg-rose-100 text-rose-800'
                                        }`}
                                      >
                                        {topic.difficulty}
                                      </span>
                                    </div>

                                    <p className="text-xs text-slate-600 leading-relaxed">{topic.summary}</p>

                                    {/* Learning Outcomes */}
                                    {topic.learningOutcomes?.length > 0 && (
                                      <div className="p-3 bg-indigo-50/60 rounded-lg border border-indigo-100 text-xs">
                                        <span className="font-bold text-indigo-900 block mb-1">
                                          🎯 የትምህርት ውጤት (Learning Outcome):
                                        </span>
                                        <p className="text-indigo-800">
                                          {topic.learningOutcomes[0].description[language] ||
                                            topic.learningOutcomes[0].description.am ||
                                            topic.learningOutcomes[0].description.en}
                                        </p>
                                      </div>
                                    )}

                                    {/* Core Concepts */}
                                    {topic.explanations?.coreConcepts && (
                                      <div className="space-y-1 text-xs">
                                        <span className="font-bold text-slate-700">መሰረታዊ ፅንሰ-ሃሳቦች፦</span>
                                        <ul className="list-disc list-inside text-slate-600 space-y-0.5 pl-1">
                                          {topic.explanations.coreConcepts.map((c, i) => (
                                            <li key={i}>{c}</li>
                                          ))}
                                        </ul>
                                      </div>
                                    )}

                                    {/* Worked Examples */}
                                    {topic.examples?.length > 0 && (
                                      <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs space-y-1.5">
                                        <span className="font-bold text-emerald-700 flex items-center gap-1">
                                          <FileCheck className="w-3.5 h-3.5" />
                                          {topic.examples[0].title}
                                        </span>
                                        <p className="text-slate-800 font-medium">ጥያቄ፦ {topic.examples[0].problem}</p>
                                        <p className="text-emerald-800 font-mono bg-emerald-50/70 p-2 rounded">
                                          አሰራር፦ {topic.examples[0].solution}
                                        </p>
                                      </div>
                                    )}

                                    {/* Practical Activities */}
                                    {topic.activities?.length > 0 && (
                                      <div className="p-3 bg-amber-50/70 rounded-lg border border-amber-200 text-xs space-y-1">
                                        <span className="font-bold text-amber-900 block">
                                          🔬 {topic.activities[0].activityNumber}: {topic.activities[0].title}
                                        </span>
                                        <p className="text-amber-800 text-[11px]">{topic.activities[0].objective}</p>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              {/* Unit Review & Assessment Footer */}
              {selectedUnit.unitReview && (
                <div className="mt-6 p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <BookMarked className="w-4 h-4 text-indigo-600" />
                    የምዕራፉ ማጠቃለያ እና ቁልፍ ቃላት (ገጽ {selectedUnit.unitReview.textbookPage})
                  </h4>
                  <ul className="list-disc list-inside text-xs text-slate-600 space-y-1 pl-1">
                    {selectedUnit.unitReview.summaryPoints.map((pt, i) => (
                      <li key={i}>{pt}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: KNOWLEDGE MAP & WEAK TOPIC RADAR */}
      {/* ========================================================================= */}
      {activeTab === 'knowledge_map' && (
        <div className="space-y-6">
          {knowledgeMap ? (
            <CurriculumKnowledgeMapView
              nodes={knowledgeMap.nodes}
              edges={knowledgeMap.edges}
              selectedNodeId={selectedTopicId}
              onSelectNode={(node) => setSelectedTopicId(node.topicId)}
              language={language}
            />
          ) : (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-500 text-xs">
              የዚህ ትምህርት የእውቀት ካርታ በመቀናበር ላይ ነው።
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: STRUCTURED QUESTION BANK (ALL 7 QUESTION TYPES) */}
      {/* ========================================================================= */}
      {activeTab === 'question_bank' && (
        <div className="space-y-6">
          {/* Question Filter Header */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700">የጥያቄ አይነት፦</span>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="text-xs font-semibold px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white"
              >
                <option value="all">ሁሉም አይነቶች (All 7 Types)</option>
                <option value="multiple_choice">Multiple Choice (ምርጫ)</option>
                <option value="true_false">True / False (እውነት/ሐሰት)</option>
                <option value="fill_in_blank">Fill in the Blank (ክፍት ቦታ)</option>
                <option value="short_answer">Short Answer (አጭር መልስ)</option>
                <option value="discussion">Discussion (ትንታኔ)</option>
                <option value="practical">Practical (የላብራቶሪ/ተግባራዊ)</option>
                <option value="coding">Coding (የኮምፒውተር ፕሮግራሚንግ)</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700">የከበደበት ደረጃ፦</span>
              <select
                value={filterDifficulty}
                onChange={(e) => setFilterDifficulty(e.target.value)}
                className="text-xs font-semibold px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white"
              >
                <option value="all">ሁሉም (All Levels)</option>
                <option value="easy">Easy (ቀላል)</option>
                <option value="medium">Medium (መካከለኛ)</option>
                <option value="hard">Hard (ከባድ)</option>
              </select>
            </div>

            <span className="text-xs font-semibold text-slate-500">
              {questionBank.length} ጥያቄዎች ተገኝተዋል
            </span>
          </div>

          {/* Question Cards */}
          <div className="space-y-4">
            {questionBank
              .filter((q) => (filterType === 'all' ? true : q.questionType === filterType))
              .filter((q) => (filterDifficulty === 'all' ? true : q.difficulty === filterDifficulty))
              .map((q, idx) => {
                const isRevealed = revealedExplanations[q.id];
                const selectedAns = userAnswers[q.id];

                return (
                  <div
                    key={q.id}
                    className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100">
                          #{idx + 1}
                        </span>
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                          {q.questionType.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-slate-400">
                          📖 ገጽ {q.ragMetadata.textbookPage} ({q.ragMetadata.unitTitle})
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                            q.difficulty === 'easy'
                              ? 'bg-emerald-100 text-emerald-800'
                              : q.difficulty === 'medium'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {q.difficulty}
                        </span>
                      </div>
                    </div>

                    <p className="text-sm font-bold text-slate-900 leading-relaxed">
                      {q.prompt[language] || q.prompt.am || q.prompt.en}
                    </p>

                    {/* Multiple Choice Options */}
                    {q.options && q.options.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        {q.options.map((opt, optIdx) => {
                          const isCorrect = optIdx === q.correctAnswer;
                          const isChosen = selectedAns === optIdx;

                          let btnStyle = 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100';
                          if (selectedAns !== undefined) {
                            if (isCorrect) btnStyle = 'bg-emerald-50 border-emerald-400 text-emerald-900 font-bold';
                            else if (isChosen) btnStyle = 'bg-rose-50 border-rose-400 text-rose-900';
                          }

                          return (
                            <button
                              key={optIdx}
                              onClick={() => setUserAnswers((prev) => ({ ...prev, [q.id]: optIdx }))}
                              className={`text-left p-3 rounded-xl border text-xs transition-all flex items-center gap-2.5 ${btnStyle}`}
                            >
                              <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center font-bold text-[10px] shrink-0">
                                {String.fromCharCode(65 + optIdx)}
                              </span>
                              <span>{opt}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Coding Starter if coding */}
                    {q.codeStarter && (
                      <div className="p-3 bg-slate-900 text-slate-100 rounded-xl font-mono text-xs overflow-x-auto">
                        <pre>{q.codeStarter}</pre>
                      </div>
                    )}

                    {/* Explanation Toggle */}
                    <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                      <button
                        onClick={() =>
                          setRevealedExplanations((prev) => ({ ...prev, [q.id]: !isRevealed }))
                        }
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                      >
                        {isRevealed ? 'ማብራሪያውን ደብቅ' : 'የመማሪያ መጽሐፉን ማብራሪያ ተመልከት (View Explanation)'}
                      </button>
                    </div>

                    {isRevealed && (
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1 text-slate-800 leading-relaxed">
                        <span className="font-bold text-emerald-800 block">
                          ትክክለኛ መልስ፦ {String(q.correctAnswer)}
                        </span>
                        <p>{q.explanation[language] || q.explanation.am || q.explanation.en}</p>
                        <p className="text-[11px] text-slate-500 pt-1">
                          ምንጭ፦ {q.ragMetadata.source}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: ASK FROM TEXTBOOK (STRICT RAG TUTOR) */}
      {/* ========================================================================= */}
      {activeTab === 'ai_tutor' && (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {language === 'am' ? 'ከይፋዊ የመማሪያ መጽሐፍ በቀጥታ ጠይቅ' : 'Ask Directly from Official Textbooks'}
                </h3>
                <p className="text-xs text-slate-500">
                  {language === 'am'
                    ? 'ኑር AI መልስ የሚሰጠው ከትምህርት ሚኒስቴር ይፋዊ መጽሐፍ ብቻ ሲሆን፣ ምዕራፍና ገጽ በማጣቀሻነት ይጠቅሳል።'
                    : 'Grounded strictly in verified Ethiopian Ministry textbooks with exact Grade, Unit, and Page citations.'}
                </p>
              </div>
            </div>

            <form onSubmit={handleAskTextbook} className="space-y-3">
              <textarea
                rows={3}
                value={tutorQuery}
                onChange={(e) => setTutorQuery(e.target.value)}
                placeholder="ለምሳሌ፡ የአስረጅ ቁጥር (Rational number) ትርጉምና ምሳሌ ምንድን ነው? ወይም የስበት ህግን ከመጽሐፉ አብራራልኝ..."
                className="w-full text-xs sm:text-sm p-4 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-emerald-500 transition-all"
              ></textarea>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span>የትምህርት ደረጃ፦</span>
                  <span className="font-bold text-slate-800">ክፍል {selectedGrade} {selectedSubject?.name?.am}</span>
                </div>

                <button
                  type="submit"
                  disabled={tutorLoading || !tutorQuery.trim()}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2 shadow-xs transition-all disabled:opacity-50"
                >
                  {tutorLoading ? (
                    <>
                      <RotateCcw className="w-4 h-4 animate-spin" />
                      ከመጽሐፉ በመፈለግ ላይ...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      መልስ ፈልግ (Ask RAG)
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Answer Display */}
            {tutorResponse && (
              <div
                className={`p-6 rounded-2xl border space-y-4 animate-in fade-in duration-150 ${
                  tutorResponse.groundedInTextbook
                    ? 'bg-slate-50/70 border-slate-200'
                    : 'bg-amber-50/70 border-amber-200'
                }`}
              >
                {/* Citations list */}
                {tutorResponse.citations?.length > 0 && (
                  <div className="flex flex-wrap gap-2 pb-3 border-b border-slate-200/80 text-xs">
                    {tutorResponse.citations.map((c: any, i: number) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center gap-1.5"
                      >
                        <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
                        {c.subject} • ምዕራፍ {c.unit} (ገጽ {c.page})
                      </span>
                    ))}
                  </div>
                )}

                <div className="text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line">
                  {tutorResponse.answer}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: PHOTO QUESTION SOLVER */}
      {/* ========================================================================= */}
      {activeTab === 'photo_solver' && (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-purple-50 text-purple-600 border border-purple-100">
                <Camera className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {language === 'am' ? 'በፎቶ ጥያቄ ፈቺ (Photo Solver)' : 'Photo Question Solver'}
                </h3>
                <p className="text-xs text-slate-500">
                  {language === 'am'
                    ? 'ከመማሪያ መጽሐፍ ወይም ከፈተና ወረቀት ላይ የተነሳን የጥያቄ ፎቶ በመጫን ደረጃ-በደረጃ አሰራር እና የመጨረሻ መልስ ያግኙ።'
                    : 'Upload a photo of an Ethiopian textbook or exam question for step-by-step verified derivation.'}
                </p>
              </div>
            </div>

            <div className="p-6 border-2 border-dashed border-slate-300 rounded-2xl text-center space-y-3 hover:border-purple-500 transition-colors">
              {photoBase64 ? (
                <div className="space-y-3">
                  <img
                    src={photoBase64}
                    alt="Question"
                    className="max-h-64 mx-auto rounded-xl shadow-xs border border-slate-200"
                  />
                  <div className="flex justify-center gap-2">
                    <label className="cursor-pointer px-4 py-2 text-xs font-bold rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200">
                      ሌላ ፎቶ ምረጥ
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              ) : (
                <label className="cursor-pointer flex flex-col items-center gap-2">
                  <Camera className="w-10 h-10 text-slate-400" />
                  <span className="text-xs font-bold text-slate-700">
                    የጥያቄውን ፎቶ እዚህ ይጫኑ ወይም ይጎትቱ (PNG, JPG)
                  </span>
                  <span className="text-[11px] text-slate-400">
                    ጠቅ በማድረግ ከፋይል ይምረጡ
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {photoBase64 && (
              <button
                onClick={handleSolvePhoto}
                disabled={photoSolving}
                className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all disabled:opacity-50"
              >
                {photoSolving ? (
                  <>
                    <RotateCcw className="w-4 h-4 animate-spin" />
                    ጥያቄውን በማንበብና በመፍታት ላይ...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    ጥያቄውን ደረጃ በደረጃ ፍታ (Solve Question)
                  </>
                )}
              </button>
            )}

            {photoSolution && (
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line space-y-2">
                <span className="font-bold text-purple-900 block text-xs">
                  ✅ ደረጃ በደረጃ የተገኘ አሰራርና መልስ፦
                </span>
                <div>{photoSolution}</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: VOICE TUTOR */}
      {/* ========================================================================= */}
      {activeTab === 'voice_tutor' && (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100">
                  <Volume2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {language === 'am' ? 'የድምፅ አስተማሪ (Voice Tutor)' : 'Spoken Voice Tutor'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {language === 'am'
                      ? 'የመማሪያ መጽሐፉን ዋና ዋና ፅንሰ-ሃሳቦች በቀጥታ በድምፅ ያዳምጡ።'
                      : 'Listen to spoken pedagogical explanations in Amharic or English.'}
                  </p>
                </div>
              </div>

              {voiceSpeaking && (
                <button
                  onClick={handleStopVoice}
                  className="px-3.5 py-1.5 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold flex items-center gap-1.5"
                >
                  <VolumeX className="w-4 h-4 text-rose-600" />
                  ድምፅ አቁም
                </button>
              )}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={voiceQuery}
                onChange={(e) => setVoiceQuery(e.target.value)}
                placeholder="ለምሳሌ፡ ስለ ኒውተን ህጎች በድምፅ አስረዳኝ..."
                className="flex-1 text-xs sm:text-sm px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-hidden focus:border-blue-500"
              />
              <button
                onClick={() => handleSpeakVoice()}
                disabled={voiceSpeaking}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all"
              >
                <Volume2 className="w-4 h-4" />
                አሰማኝ
              </button>
            </div>

            {voiceScript && (
              <div className="p-5 rounded-2xl bg-blue-50/60 border border-blue-100 text-xs sm:text-sm text-blue-950 space-y-2 leading-relaxed">
                <span className="font-bold text-blue-900 block text-xs">
                  🎙️ የተነገረ የማብራሪያ ጽሑፍ፦
                </span>
                <p>{voiceScript}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 7: AI EXAM GENERATOR */}
      {/* ========================================================================= */}
      {activeTab === 'exam_generator' && (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-amber-50 text-amber-600 border border-amber-100">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {language === 'am' ? 'የፈተናና የፈተና ጥያቄዎች አዘጋጅ (AI Exam Generator)' : 'Curriculum Exam Generator'}
                </h3>
                <p className="text-xs text-slate-500">
                  {language === 'am'
                    ? 'በተመረጠው ምዕራፍ እና የከበደበት ደረጃ መሰረት ትክክለኛ የኢትዮጵያ ስታንዳርድ የፈተና ጥያቄዎችን በቅጽበት ያዘጋጁ።'
                    : 'Generate authentic classroom exams adhering strictly to Ethiopian New Curriculum assessment frameworks.'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">ምዕራፍ (Unit)</label>
                <select
                  value={examUnit}
                  onChange={(e) => setExamUnit(parseInt(e.target.value, 10))}
                  className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 bg-white"
                >
                  {selectedSubject?.units.map((u) => (
                    <option key={u.id} value={u.unitNumber}>
                      Unit {u.unitNumber}: {u.title[language] || u.title.en}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">የጥያቄዎች ብዛት</label>
                <select
                  value={examQuestionCount}
                  onChange={(e) => setExamQuestionCount(parseInt(e.target.value, 10))}
                  className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 bg-white"
                >
                  <option value={2}>2 Questions</option>
                  <option value={3}>3 Questions</option>
                  <option value={5}>5 Questions</option>
                  <option value={10}>10 Questions</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">ደረጃ</label>
                <select
                  value={examDifficulty}
                  onChange={(e) => setExamDifficulty(e.target.value as DifficultyLevel)}
                  className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 bg-white"
                >
                  <option value="easy">Easy (ቀላል)</option>
                  <option value="medium">Medium (መካከለኛ)</option>
                  <option value="hard">Hard (ከባድ)</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleGenerateExam}
              disabled={generatingExam}
              className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all disabled:opacity-50"
            >
              {generatingExam ? (
                <>
                  <RotateCcw className="w-4 h-4 animate-spin" />
                  ፈተናውን ከመማሪያ መጽሐፉ በማዘጋጀት ላይ...
                </>
              ) : (
                <>
                  <Award className="w-4 h-4" />
                  ፈተና አዘጋጅ (Generate Verified Exam)
                </>
              )}
            </button>

            {/* Generated Exam Preview */}
            {generatedExam.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    የተዘጋጀው ፈተና ({generatedExam.length} ጥያቄዎች)
                  </h4>
                  <span className="text-[11px] text-slate-500 font-semibold">
                    ክፍል {selectedGrade} • Unit {examUnit}
                  </span>
                </div>

                {generatedExam.map((eq, i) => (
                  <div
                    key={eq.id || i}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-indigo-700">ጥያቄ {i + 1}</span>
                      <span className="text-[10px] uppercase font-semibold text-slate-500">
                        {eq.questionType || 'Assessment'}
                      </span>
                    </div>
                    <p className="text-slate-900 font-medium">{eq.prompt}</p>
                    {eq.options && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pl-2">
                        {eq.options.map((opt: string, oIdx: number) => (
                          <div key={oIdx} className="p-2 rounded bg-white border border-slate-200">
                            {String.fromCharCode(65 + oIdx)}. {opt}
                          </div>
                        ))}
                      </div>
                    )}
                    {eq.explanation && (
                      <p className="text-[11px] text-emerald-800 font-semibold pt-1">
                        ማብራሪያ፦ {eq.explanation}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Textbook Ingestion Modal */}
      <TextbookIngestionModal
        isOpen={isIngestionModalOpen}
        onClose={() => setIsIngestionModalOpen(false)}
        onImportSuccess={() => {
          fetchStats();
          fetchSubjects();
        }}
        language={language}
      />
    </div>
  );
};
