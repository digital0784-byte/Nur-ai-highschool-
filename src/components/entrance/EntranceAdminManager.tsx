import React, { useState } from 'react';
import {
  EntranceExamConfig,
  EntranceQuestion,
  EntranceMockExam,
  QuestionStatus,
  QuestionDifficulty,
} from '../../types/entranceExam';
import { Grade } from '../../types';
import {
  ShieldAlert,
  Settings,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Save,
  BarChart3,
  FileSpreadsheet,
  Upload,
  Layers,
  Lock,
} from 'lucide-react';

interface EntranceAdminManagerProps {
  config: EntranceExamConfig;
  questions: EntranceQuestion[];
  mockExams: EntranceMockExam[];
  onSaveConfig: (updated: EntranceExamConfig) => void;
  onSaveQuestion: (question: EntranceQuestion) => void;
  onSaveMockExam: (exam: EntranceMockExam) => void;
}

export const EntranceAdminManager: React.FC<EntranceAdminManagerProps> = ({
  config,
  questions,
  mockExams,
  onSaveConfig,
  onSaveQuestion,
  onSaveMockExam,
}) => {
  const [activeTab, setActiveTab] = useState<'config' | 'questions' | 'mocks' | 'analytics'>('config');
  const [localConfig, setLocalConfig] = useState<EntranceExamConfig>({ ...config });
  const [editingQuestion, setEditingQuestion] = useState<Partial<EntranceQuestion> | null>(null);
  const [isSavedNotice, setIsSavedNotice] = useState<boolean>(false);

  const handleSaveConfig = () => {
    onSaveConfig(localConfig);
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 3000);
  };

  const handleSaveQuestionForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingQuestion?.question) return;

    const newQ: EntranceQuestion = {
      id: editingQuestion.id || `q-admin-${Date.now()}`,
      grade: editingQuestion.grade || 12,
      subject: editingQuestion.subject || 'Mathematics',
      unit: editingQuestion.unit || 'Unit 1',
      topic: editingQuestion.topic || 'Core Concept',
      question: editingQuestion.question || '',
      options: editingQuestion.options || ['A', 'B', 'C', 'D'],
      correctAnswer: editingQuestion.correctAnswer || 0,
      explanation: editingQuestion.explanation || '',
      difficulty: editingQuestion.difficulty || 'medium',
      stream: editingQuestion.stream || 'natural',
      status: editingQuestion.status || 'PUBLISHED',
      type: editingQuestion.type || 'mcq',
      source: editingQuestion.source || 'Ministry of Education High School Curriculum',
      page: editingQuestion.page || 1,
      conceptGaps: editingQuestion.conceptGaps || [],
      prerequisites: editingQuestion.prerequisites || [],
      createdAt: editingQuestion.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSaveQuestion(newQ);
    setEditingQuestion(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Super Admin Badging */}
      <div className="bg-stone-900 text-white rounded-3xl p-6 sm:p-8 border border-stone-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-stone-800">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-500/20 text-rose-300 rounded-full text-xs font-bold border border-rose-500/30">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>SUPER_ADMIN CONTROLS</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-serif-ethiopic">
              የመግቢያ ፈተና ሞተር አስተዳደር (Entrance Engine Admin Console)
            </h2>
            <p className="text-xs text-stone-400">
              የትምህርት ክፍሎች፣ የጥያቄዎች ባንክ፣ የሞዴል ፈተናዎች እና የመዳረሻ እርከኖች (Access Tiers) ውቅር።
            </p>
          </div>

          {isSavedNotice && (
            <div className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4" />
              <span>ቅንብሩ በተሳካ ሁኔታ ተቀምጧል!</span>
            </div>
          )}
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 pt-2">
          <button
            onClick={() => setActiveTab('config')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'config'
                ? 'bg-white text-stone-900 shadow-sm'
                : 'bg-stone-800 text-stone-400 hover:text-white'
            }`}
          >
            አጠቃላይ ውቅር (Config & Tiers)
          </button>
          <button
            onClick={() => setActiveTab('questions')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'questions'
                ? 'bg-white text-stone-900 shadow-sm'
                : 'bg-stone-800 text-stone-400 hover:text-white'
            }`}
          >
            የጥያቄዎች ባንክ ({questions.length})
          </button>
          <button
            onClick={() => setActiveTab('mocks')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'mocks'
                ? 'bg-white text-stone-900 shadow-sm'
                : 'bg-stone-800 text-stone-400 hover:text-white'
            }`}
          >
            ሞዴል ፈተናዎች ({mockExams.length})
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'analytics'
                ? 'bg-white text-stone-900 shadow-sm'
                : 'bg-stone-800 text-stone-400 hover:text-white'
            }`}
          >
            የፈተና ዝግጁነት ትንተና (Analytics)
          </button>
        </div>
      </div>

      {/* 1. CONFIG & TIERS TAB */}
      {activeTab === 'config' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
          <h3 className="text-base font-bold font-serif-ethiopic text-stone-900 flex items-center gap-2">
            <Settings className="w-5 h-5 text-indigo-600" />
            የስርዓት ቁጥጥርና የደንበኝነት እርከኖች (Engine Controls & Access Tiers)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Enable/Disable Engine */}
            <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200/80 space-y-3">
              <label className="text-xs font-bold text-stone-800 block">የመግቢያ ፈተና ሞተር ሁኔታ</label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setLocalConfig({ ...localConfig, enabled: !localConfig.enabled })}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    localConfig.enabled ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                  }`}
                >
                  {localConfig.enabled ? 'ሞተሩ ነቅቷል (ENABLED)' : 'ሞተሩ ቆሟል (DISABLED)'}
                </button>
              </div>
              <p className="text-[11px] text-stone-500">
                ሞተሩ ሲቆም ተማሪዎች የፈተና ዝግጅት ገጽን ማግኘት አይችሉም።
              </p>
            </div>

            {/* Access Tier Setting */}
            <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200/80 space-y-3">
              <label className="text-xs font-bold text-stone-800 block">የመዳረሻ እርከን (Required Tier)</label>
              <select
                value={localConfig.accessTier}
                onChange={(e) =>
                  setLocalConfig({ ...localConfig, accessTier: e.target.value as any })
                }
                className="w-full p-2.5 bg-white border border-stone-200 rounded-xl text-xs font-semibold text-stone-800 focus:outline-none"
              >
                <option value="free">ለሁሉም ክፍት (Free for all students)</option>
                <option value="pro">ለፕሮ ተጠቃሚዎች ብቻ (Pro Subscription Required)</option>
                <option value="school">ለትምህርት ቤቶች ብቻ (School License Required)</option>
              </select>
              <p className="text-[11px] text-stone-500">
                በሱፐር አድሚን ውቅር መሰረት የደንበኝነት መዳረሻን ይቆጣጠራል።
              </p>
            </div>
          </div>

          {/* Save button */}
          <div className="pt-4 border-t border-stone-100 flex justify-end">
            <button
              onClick={handleSaveConfig}
              className="px-6 py-2.5 bg-indigo-700 hover:bg-indigo-800 text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>ቅንብሮችን መዝግብ (Save Config)</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. QUESTION BANK TAB */}
      {activeTab === 'questions' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div>
                <h3 className="text-base font-bold font-serif-ethiopic text-stone-900">
                  የጥያቄዎች ባንክ አስተዳደር (Question Bank)
                </h3>
                <p className="text-xs text-stone-500">ጠቅላላ {questions.length} የፈተና ጥያቄዎች በስርዓቱ ውስጥ ይገኛሉ</p>
              </div>

              <button
                onClick={() =>
                  setEditingQuestion({
                    grade: 12,
                    subject: 'Mathematics',
                    options: ['', '', '', ''],
                    correctAnswer: 0,
                    status: 'PUBLISHED',
                    difficulty: 'medium',
                  })
                }
                className="px-4 py-2 bg-indigo-700 hover:bg-indigo-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>አዲስ ጥያቄ ጨምር</span>
              </button>
            </div>

            {/* Editing Form Modal/Box */}
            {editingQuestion && (
              <form
                onSubmit={handleSaveQuestionForm}
                className="p-6 bg-stone-50 rounded-2xl border border-stone-200 space-y-4"
              >
                <h4 className="text-sm font-bold text-stone-900">የጥያቄ መረጃ ማስገቢያ</h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="font-bold text-stone-700 block mb-1">ክፍል (Grade)</label>
                    <select
                      value={editingQuestion.grade || 12}
                      onChange={(e) =>
                        setEditingQuestion({ ...editingQuestion, grade: Number(e.target.value) as any })
                      }
                      className="w-full p-2 bg-white border border-stone-200 rounded-xl"
                    >
                      <option value={11}>Grade 11</option>
                      <option value={12}>Grade 12</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-stone-700 block mb-1">የትምህርት አይነት (Subject)</label>
                    <select
                      value={editingQuestion.subject || 'Mathematics'}
                      onChange={(e) =>
                        setEditingQuestion({ ...editingQuestion, subject: e.target.value })
                      }
                      className="w-full p-2 bg-white border border-stone-200 rounded-xl"
                    >
                      <option value="Mathematics">Mathematics</option>
                      <option value="Physics">Physics</option>
                      <option value="Chemistry">Chemistry</option>
                      <option value="Biology">Biology</option>
                      <option value="English">English</option>
                      <option value="Aptitude">Aptitude</option>
                      <option value="History">History</option>
                      <option value="Geography">Geography</option>
                      <option value="Economics">Economics</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-stone-700 block mb-1">አስቸጋሪነት (Difficulty)</label>
                    <select
                      value={editingQuestion.difficulty || 'medium'}
                      onChange={(e) =>
                        setEditingQuestion({ ...editingQuestion, difficulty: e.target.value as any })
                      }
                      className="w-full p-2 bg-white border border-stone-200 rounded-xl"
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="font-bold text-stone-700 block mb-1">ምዕራፍ (Unit)</label>
                    <input
                      type="text"
                      value={editingQuestion.unit || ''}
                      onChange={(e) =>
                        setEditingQuestion({ ...editingQuestion, unit: e.target.value })
                      }
                      placeholder="e.g. Unit 1"
                      className="w-full p-2 bg-white border border-stone-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-stone-700 block mb-1">ርዕስ (Topic)</label>
                    <input
                      type="text"
                      value={editingQuestion.topic || ''}
                      onChange={(e) =>
                        setEditingQuestion({ ...editingQuestion, topic: e.target.value })
                      }
                      placeholder="e.g. Limits and Continuity"
                      className="w-full p-2 bg-white border border-stone-200 rounded-xl"
                    />
                  </div>
                </div>

                <div className="text-xs space-y-1">
                  <label className="font-bold text-stone-700 block">የጥያቄው ይዘት (Question Text)</label>
                  <textarea
                    rows={2}
                    value={editingQuestion.question || ''}
                    onChange={(e) =>
                      setEditingQuestion({ ...editingQuestion, question: e.target.value })
                    }
                    placeholder="ጥያቄውን እዚህ ያስገቡ..."
                    className="w-full p-2 bg-white border border-stone-200 rounded-xl"
                    required
                  />
                </div>

                {/* Options */}
                <div className="space-y-2 text-xs">
                  <label className="font-bold text-stone-700 block">አማራጮችና ትክክለኛ መልስ</label>
                  {[0, 1, 2, 3].map((optIdx) => (
                    <div key={optIdx} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="correctAnswerRadio"
                        checked={editingQuestion.correctAnswer === optIdx}
                        onChange={() =>
                          setEditingQuestion({ ...editingQuestion, correctAnswer: optIdx })
                        }
                        className="w-4 h-4 text-indigo-600"
                      />
                      <input
                        type="text"
                        value={editingQuestion.options?.[optIdx] || ''}
                        onChange={(e) => {
                          const opts = [...(editingQuestion.options || ['', '', '', ''])];
                          opts[optIdx] = e.target.value;
                          setEditingQuestion({ ...editingQuestion, options: opts });
                        }}
                        placeholder={`አማራጭ ${String.fromCharCode(65 + optIdx)}`}
                        className="flex-1 p-2 bg-white border border-stone-200 rounded-xl"
                        required
                      />
                    </div>
                  ))}
                </div>

                <div className="text-xs space-y-1">
                  <label className="font-bold text-stone-700 block">የማብራሪያ ይዘት (Step-by-Step Explanation)</label>
                  <textarea
                    rows={2}
                    value={editingQuestion.explanation || ''}
                    onChange={(e) =>
                      setEditingQuestion({ ...editingQuestion, explanation: e.target.value })
                    }
                    placeholder="ዝርዝር ማብራሪያና የፈተና መፍትሄ..."
                    className="w-full p-2 bg-white border border-stone-200 rounded-xl"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingQuestion(null)}
                    className="px-4 py-2 border border-stone-200 rounded-xl text-stone-600 text-xs font-semibold cursor-pointer"
                  >
                    ሰርዝ
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-indigo-700 hover:bg-indigo-800 text-white rounded-xl text-xs font-bold cursor-pointer"
                  >
                    ጥያቄውን መዝግብ (Save Question)
                  </button>
                </div>
              </form>
            )}

            {/* Questions Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-stone-200 rounded-2xl overflow-hidden">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-700">
                  <tr>
                    <th className="p-3">የትምህርት አይነት</th>
                    <th className="p-3">ክፍል</th>
                    <th className="p-3">ርዕስ</th>
                    <th className="p-3">አስቸጋሪነት</th>
                    <th className="p-3">ሁኔታ</th>
                    <th className="p-3 text-right">እርምጃ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {questions.slice(0, 15).map((q) => (
                    <tr key={q.id} className="hover:bg-stone-50/60">
                      <td className="p-3 font-bold text-stone-800">{q.subject}</td>
                      <td className="p-3 text-stone-600">G{q.grade}</td>
                      <td className="p-3 text-stone-700 truncate max-w-[180px]">{q.topic}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 bg-stone-100 rounded text-[10px] font-bold uppercase">
                          {q.difficulty}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded text-[10px] font-bold">
                          {q.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => setEditingQuestion(q)}
                          className="text-indigo-700 hover:text-indigo-900 font-bold text-xs cursor-pointer"
                        >
                          አስተካክል
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 3. MOCK EXAMS TAB */}
      {activeTab === 'mocks' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div>
              <h3 className="text-base font-bold font-serif-ethiopic text-stone-900">
                የሞዴል ፈተናዎች ውቅር (Mock Exams Configuration)
              </h3>
              <p className="text-xs text-stone-500">የጥያቄዎችን ብዛት፣ ሰዓትና ክብደት ማስተካከል</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockExams.map((mock) => (
              <div
                key={mock.id}
                className="p-5 rounded-2xl border border-stone-200 bg-stone-50 space-y-3"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-stone-900">{mock.title}</span>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[10px]">
                    {mock.isPublished ? 'ታትሟል (PUBLISHED)' : 'ረቂቅ (DRAFT)'}
                  </span>
                </div>

                <p className="text-xs text-stone-600">{mock.description}</p>

                <div className="flex items-center justify-between text-xs text-stone-500 pt-2 border-t border-stone-200">
                  <span>የፈተና ቆይታ፡ {mock.durationMinutes} ደቂቃ</span>
                  <span>የጥያቄ ብዛት፡ {mock.totalQuestions}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. ANALYTICS TAB */}
      {activeTab === 'analytics' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
          <h3 className="text-base font-bold font-serif-ethiopic text-stone-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-600" />
            የአገር አቀፍና የተማሪዎች የፈተና ዝግጁነት ትንተና (Readiness Analytics)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-1">
              <span className="text-stone-500 font-semibold">ከፍተኛ ክፍተት ያለባቸው ርዕሶች</span>
              <ul className="text-rose-800 font-bold space-y-1 pt-1">
                <li>1. Limits and Continuity (Math)</li>
                <li>2. Chemical Equilibrium (Chem)</li>
                <li>3. Electromagnetic Induction (Phys)</li>
              </ul>
            </div>

            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-1">
              <span className="text-stone-500 font-semibold">አማካኝ የሞዴል ፈተና ውጤት</span>
              <div className="text-2xl font-bold text-indigo-700">68.4%</div>
              <p className="text-[10px] text-stone-400">ከ500+ የተማሪዎች ሙከራ የተሰላ</p>
            </div>

            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-1">
              <span className="text-stone-500 font-semibold">የጥናት ጽናት አማካይ</span>
              <div className="text-2xl font-bold text-orange-600">8.2 ቀናት</div>
              <p className="text-[10px] text-stone-400">ተከታታይ ዕለታዊ ልምምድ</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
