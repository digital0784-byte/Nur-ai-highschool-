import React, { useState } from 'react';
import {
  HelpCircle,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Award,
  Sparkles,
  BookOpen,
  ChevronRight,
  X,
  Save,
} from 'lucide-react';
import { GradeLevel } from '../../types/curriculumEngine';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

interface QuestionItem {
  id: string;
  grade: GradeLevel;
  subject: string;
  unit: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Entrance Exam';
  questionText: string;
  questionTextAmharic?: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
}

export const AdminQuestionBankSection: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel | 'all'>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedQuestionForEdit, setSelectedQuestionForEdit] = useState<QuestionItem | null>(null);

  const [questions, setQuestions] = useState<QuestionItem[]>([
    {
      id: 'q-math-9-01',
      grade: 9,
      subject: 'Mathematics',
      unit: 'Unit 1: The Number System',
      difficulty: 'Medium',
      questionText: 'Which of the following numbers is an irrational number?',
      questionTextAmharic: 'ከሚከተሉት ቁጥሮች ውስጥ ኢ-አመክንዮአዊ (Irrational) ቁጥር የሆነው የትኛው ነው?',
      options: ['3.14159', '√16', '√7', '22/7'],
      correctOptionIndex: 2,
      explanation:
        '√7 cannot be expressed as a ratio of two integers and its decimal expansion is non-terminating and non-repeating.',
    },
    {
      id: 'q-physics-9-01',
      grade: 9,
      subject: 'Physics',
      unit: 'Unit 2: Motion in One Dimension',
      difficulty: 'Easy',
      questionText: 'What is the SI unit of acceleration?',
      questionTextAmharic: 'የፍጥንጥነት (Acceleration) መደበኛ የኤስ.አይ መለኪያ አሃድ የትኛው ነው?',
      options: ['m/s', 'm/s²', 'km/h', 'N·s'],
      correctOptionIndex: 1,
      explanation: 'Acceleration is the rate of change of velocity per second, measured in m/s².',
    },
    {
      id: 'q-chem-10-01',
      grade: 10,
      subject: 'Chemistry',
      unit: 'Unit 3: Chemical Bonding',
      difficulty: 'Hard',
      questionText: 'Which type of bond involves the sharing of electron pairs between atoms?',
      questionTextAmharic: 'በአተሞች መካከል የኤሌክትሮን ጥንዶችን በመጋራት የሚፈጠር የኬሚካላዊ ትስስር አይነት የትኛው ነው?',
      options: ['Ionic bond', 'Covalent bond', 'Metallic bond', 'Hydrogen bond'],
      correctOptionIndex: 1,
      explanation:
        'A covalent bond consists of the mutual sharing of one or more pairs of electrons between two atoms.',
    },
    {
      id: 'q-bio-11-01',
      grade: 11,
      subject: 'Biology',
      unit: 'Unit 2: Cell Biology & Respiration',
      difficulty: 'Entrance Exam',
      questionText: 'During cellular respiration, which process yields the highest net ATP molecules per glucose molecule?',
      questionTextAmharic: 'በሴሉላር አተነፋፈስ ሂደት ውስጥ፣ በአንድ የግሉኮስ ሞለኪውል ከፍተኛውን የተጣራ የ-ATP ሞለኪውሎች የሚያመነጨው የትኛው ደረጃ ነው?',
      options: ['Glycolysis', 'Krebs cycle', 'Oxidative phosphorylation (Electron Transport Chain)', 'Fermentation'],
      correctOptionIndex: 2,
      explanation:
        'Oxidative phosphorylation through ATP synthase in the inner mitochondrial membrane produces approximately 26–28 ATP per glucose.',
    },
    {
      id: 'q-math-12-01',
      grade: 12,
      subject: 'Mathematics',
      unit: 'Unit 3: Differential Calculus',
      difficulty: 'Entrance Exam',
      questionText: 'What is the derivative of f(x) = ln(3x² + 5)?',
      questionTextAmharic: 'የፈንክሽን f(x) = ln(3x² + 5) ዴሪቬቲቭ (Derivative) የትኛው ነው?',
      options: ['6x / (3x² + 5)', '1 / (3x² + 5)', '6x ln(3x² + 5)', '3x / (3x² + 5)'],
      correctOptionIndex: 0,
      explanation: 'Using the chain rule: d/dx[ln(u)] = u\'/u = (6x) / (3x² + 5).',
    },
  ]);

  const filteredQuestions = questions.filter((q) => {
    const matchSearch =
      q.questionText.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (q.questionTextAmharic && q.questionTextAmharic.toLowerCase().includes(searchTerm.toLowerCase())) ||
      q.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.unit.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchSearch) return false;
    if (selectedGrade !== 'all' && q.grade !== selectedGrade) return false;
    if (selectedDifficulty !== 'all' && q.difficulty !== selectedDifficulty) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-stone-900 font-serif-ethiopic">
            የጥያቄዎች ባንክ አስተዳደር (Curriculum Question Bank)
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            የኢ.ፌ.ዲ.ሪ ሥርዓተ-ትምህርት ጥያቄዎች፣ የፈተናዎች ማከማቻ፣ እና የሶክራቲክ አጋዥ መመሪያዎች።
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() =>
            setSelectedQuestionForEdit({
              id: `q-new-${Date.now()}`,
              grade: 9,
              subject: 'Mathematics',
              unit: 'Unit 1: The Number System',
              difficulty: 'Medium',
              questionText: '',
              options: ['', '', '', ''],
              correctOptionIndex: 0,
              explanation: '',
            })
          }
        >
          Add New Question
        </Button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-stone-200/90 shadow-xs">
          <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
            Total Questions in Bank
          </span>
          <span className="text-2xl font-black text-stone-900 font-mono mt-1 block">
            {questions.length * 140}+
          </span>
          <span className="text-xs text-stone-500 mt-1 block">Across Grades 9 - 12</span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-stone-200/90 shadow-xs">
          <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
            Entrance Exam Archive
          </span>
          <span className="text-2xl font-black text-emerald-800 font-mono mt-1 block">
            2,450
          </span>
          <span className="text-xs text-emerald-700 font-medium mt-1 block">
            2010 - 2016 E.C. Certified
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-stone-200/90 shadow-xs">
          <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
            Socratic Hints Available
          </span>
          <span className="text-2xl font-black text-stone-900 font-mono mt-1 block">
            100%
          </span>
          <span className="text-xs text-stone-500 mt-1 block">Step-by-step reasoning</span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-stone-200/90 shadow-xs">
          <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
            Bilingual Support
          </span>
          <span className="text-2xl font-black text-stone-900 font-mono mt-1 block">
            Amharic + English
          </span>
          <span className="text-xs text-stone-500 mt-1 block">Aligned to MoE standards</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-3xl p-4 border border-stone-200/90 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search questions or units..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-10 pr-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Grade filter */}
          <div className="flex items-center gap-1">
            {(['all', 9, 10, 11, 12] as (GradeLevel | 'all')[]).map((g) => (
              <button
                key={g}
                onClick={() => setSelectedGrade(g)}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedGrade === g
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-stone-50 text-stone-600 hover:bg-stone-100 border border-stone-200'
                }`}
              >
                {g === 'all' ? 'All' : `G${g}`}
              </button>
            ))}
          </div>

          {/* Difficulty filter */}
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="bg-stone-50 border border-stone-200 rounded-xl px-3 py-1.5 text-xs text-stone-700 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          >
            <option value="all">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
            <option value="Entrance Exam">Entrance Exam</option>
          </select>
        </div>
      </div>

      {/* Clean ERP Questions Table */}
      <div className="bg-white rounded-3xl border border-stone-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-600 border-collapse">
            <thead className="bg-stone-50 border-b border-stone-200/80 uppercase font-mono text-[11px] text-stone-400">
              <tr>
                <th className="px-5 py-4 font-bold">Question & Unit</th>
                <th className="px-4 py-4 font-bold">Subject & Grade</th>
                <th className="px-4 py-4 font-bold">Difficulty</th>
                <th className="px-4 py-4 font-bold">Correct Option</th>
                <th className="px-4 py-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredQuestions.map((q) => (
                <tr key={q.id} className="hover:bg-stone-50/70 transition-colors">
                  <td className="px-5 py-4 max-w-md">
                    <p className="font-bold text-stone-900 line-clamp-2">{q.questionText}</p>
                    {q.questionTextAmharic && (
                      <p className="text-[11px] text-stone-500 font-serif-ethiopic mt-1 line-clamp-1">
                        {q.questionTextAmharic}
                      </p>
                    )}
                    <span className="inline-block mt-1 text-[10px] font-mono text-stone-400">
                      {q.unit}
                    </span>
                  </td>

                  <td className="px-4 py-4">
                    <span className="font-bold text-stone-800">{q.subject}</span>
                    <div className="text-[11px] text-emerald-800 font-mono mt-0.5">
                      Grade {q.grade}
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        q.difficulty === 'Easy'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : q.difficulty === 'Medium'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : q.difficulty === 'Hard'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-purple-50 text-purple-700 border border-purple-200'
                      }`}
                    >
                      {q.difficulty}
                    </span>
                  </td>

                  <td className="px-4 py-4">
                    <span className="font-mono font-bold text-emerald-800">
                      Option {String.fromCharCode(65 + q.correctOptionIndex)}:
                    </span>
                    <span className="text-[11px] text-stone-600 ml-1">
                      {q.options[q.correctOptionIndex]}
                    </span>
                  </td>

                  <td className="px-4 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        variant="outline"
                        size="xs"
                        leftIcon={<Edit className="w-3 h-3" />}
                        onClick={() => setSelectedQuestionForEdit(q)}
                      >
                        Edit
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Question Editor Modal */}
      {selectedQuestionForEdit && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="w-full max-w-xl rounded-3xl p-6 bg-white border border-stone-200 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="text-base font-bold text-stone-900">
                {selectedQuestionForEdit.id.startsWith('q-new') ? 'Add New Question' : 'Edit Question'}
              </h3>
              <button
                onClick={() => setSelectedQuestionForEdit(null)}
                className="p-1 rounded-full hover:bg-stone-100 text-stone-400 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-stone-700 block mb-1">Question (English)</label>
                <textarea
                  rows={2}
                  value={selectedQuestionForEdit.questionText}
                  onChange={(e) =>
                    setSelectedQuestionForEdit({
                      ...selectedQuestionForEdit,
                      questionText: e.target.value,
                    })
                  }
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Question (Amharic)</label>
                <textarea
                  rows={2}
                  value={selectedQuestionForEdit.questionTextAmharic || ''}
                  onChange={(e) =>
                    setSelectedQuestionForEdit({
                      ...selectedQuestionForEdit,
                      questionTextAmharic: e.target.value,
                    })
                  }
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-stone-900 font-serif-ethiopic focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Subject</label>
                  <input
                    type="text"
                    value={selectedQuestionForEdit.subject}
                    onChange={(e) =>
                      setSelectedQuestionForEdit({
                        ...selectedQuestionForEdit,
                        subject: e.target.value,
                      })
                    }
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Difficulty</label>
                  <select
                    value={selectedQuestionForEdit.difficulty}
                    onChange={(e) =>
                      setSelectedQuestionForEdit({
                        ...selectedQuestionForEdit,
                        difficulty: e.target.value as any,
                      })
                    }
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                    <option value="Entrance Exam">Entrance Exam</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Step-by-Step Solution / Explanation</label>
                <textarea
                  rows={2}
                  value={selectedQuestionForEdit.explanation}
                  onChange={(e) =>
                    setSelectedQuestionForEdit({
                      ...selectedQuestionForEdit,
                      explanation: e.target.value,
                    })
                  }
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-stone-900 focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-3 flex items-center justify-end gap-2 border-t border-stone-100">
              <Button variant="outline" size="sm" onClick={() => setSelectedQuestionForEdit(null)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                leftIcon={<Save className="w-3.5 h-3.5" />}
                onClick={() => {
                  if (selectedQuestionForEdit.id.startsWith('q-new')) {
                    setQuestions([selectedQuestionForEdit, ...questions]);
                  } else {
                    setQuestions(
                      questions.map((q) =>
                        q.id === selectedQuestionForEdit.id ? selectedQuestionForEdit : q
                      )
                    );
                  }
                  setSelectedQuestionForEdit(null);
                }}
              >
                Save Question
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
