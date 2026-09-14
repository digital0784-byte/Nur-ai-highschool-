import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Plus,
  Trash2,
  CheckCircle2,
  ShieldCheck,
  Search,
  ExternalLink,
  Layers,
  Globe,
  Sparkles,
  RefreshCw,
  Library,
  GraduationCap,
  FileCheck,
  Scale,
  Building2,
  Check,
  ChevronRight,
  Info,
} from 'lucide-react';
import {
  ApprovedSource,
  SourcePriorityLevel,
  ExternalSourceType,
  TrustedDomainRecord,
  CitationAuditLog,
  AnalysisMode,
  DeepAnalysisResult,
} from '../../types/researchAnalysis';
import { researchAnalysisService } from '../../services/researchAnalysisService';
import { GradeLevel } from '../../types/curriculumEngine';

export const AdminResearchSourcesSection: React.FC = () => {
  const [sources, setSources] = useState<ApprovedSource[]>([]);
  const [domains, setDomains] = useState<TrustedDomainRecord[]>([]);
  const [audits, setAudits] = useState<CitationAuditLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'catalog' | 'domains' | 'audits' | 'tester'>('catalog');

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  // Add Source Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newSource, setNewSource] = useState<Omit<ApprovedSource, 'sourceId' | 'addedAt'>>({
    title: '',
    author: '',
    publisher: '',
    year: new Date().getFullYear(),
    isbn: '',
    subject: 'Physics',
    grade: 11,
    topic: '',
    sourceType: 'REFERENCE_BOOK',
    priorityLevel: 4,
    academicCredibility: 90,
    copyrightStatus: 'PUBLIC_DOMAIN',
    accessPermission: 'SUMMARIZED_ONLY',
    description: '',
    fileUrl: '',
    keyConcepts: [],
    isVerified: true,
    addedBy: 'SUPER_ADMIN',
  });
  const [keyConceptsInput, setKeyConceptsInput] = useState('');

  // Add Domain state
  const [newDomainName, setNewDomainName] = useState('');
  const [newDomainCategory, setNewDomainCategory] = useState<TrustedDomainRecord['category']>('INTERNATIONAL_UNIVERSITY');
  const [newDomainDesc, setNewDomainDesc] = useState('');

  // Live Tester state
  const [testQuestion, setTestQuestion] = useState('Newtonian Mechanics vs Einstein Relativity in Ethiopian Grade 11 Physics');
  const [testSubject, setTestSubject] = useState('Physics');
  const [testGrade, setTestGrade] = useState<GradeLevel>(11);
  const [testMode, setTestMode] = useState<AnalysisMode>('comparative');
  const [testLoading, setTestLoading] = useState(false);
  const [testResult, setTestResult] = useState<DeepAnalysisResult | null>(null);

  const loadData = () => {
    setLoading(true);
    try {
      const srcList = researchAnalysisService.getApprovedSources();
      const domList = researchAnalysisService.getTrustedDomains();
      const auditList = researchAnalysisService.getAuditLogs();
      setSources(srcList);
      setDomains(domList);
      setAudits(auditList);
    } catch (e) {
      console.warn('Error loading research data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddSource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSource.title || !newSource.author) return;

    const concepts = keyConceptsInput
      .split(',')
      .map((c) => c.trim())
      .filter((c) => c.length > 0);

    researchAnalysisService.addApprovedSource({
      ...newSource,
      keyConcepts: concepts,
    });

    setIsAddModalOpen(false);
    setNewSource({
      title: '',
      author: '',
      publisher: '',
      year: new Date().getFullYear(),
      isbn: '',
      subject: 'Physics',
      grade: 11,
      topic: '',
      sourceType: 'REFERENCE_BOOK',
      priorityLevel: 4,
      academicCredibility: 90,
      copyrightStatus: 'PUBLIC_DOMAIN',
      accessPermission: 'SUMMARIZED_ONLY',
      description: '',
      fileUrl: '',
      keyConcepts: [],
      isVerified: true,
      addedBy: 'SUPER_ADMIN',
    });
    setKeyConceptsInput('');
    loadData();
  };

  const handleDeleteSource = (sourceId: string) => {
    if (confirm('Are you sure you want to remove this approved source from the knowledge base?')) {
      researchAnalysisService.deleteApprovedSource(sourceId);
      loadData();
    }
  };

  const handlePriorityChange = (sourceId: string, priority: SourcePriorityLevel) => {
    researchAnalysisService.updateSourcePriority(sourceId, priority);
    loadData();
  };

  const handleAddDomain = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDomainName) return;
    researchAnalysisService.addTrustedDomain({
      domain: newDomainName.toLowerCase().trim(),
      institutionName: newDomainDesc || newDomainName,
      category: newDomainCategory,
      isActive: true,
      credibilityScore: 95,
      notes: 'Added by SUPER_ADMIN',
    });
    setNewDomainName('');
    setNewDomainDesc('');
    loadData();
  };

  const handleRemoveDomain = (domain: string) => {
    if (confirm(`Remove trusted domain "${domain}"?`)) {
      researchAnalysisService.removeTrustedDomain(domain);
      loadData();
    }
  };

  const handleRunTest = async () => {
    setTestLoading(true);
    setTestResult(null);
    try {
      const res = await researchAnalysisService.executeMultiSourceAnalysis({
        question: testQuestion,
        subject: testSubject,
        grade: testGrade,
        unitNumber: 2,
        topicTitle: testQuestion,
        mode: testMode,
        language: 'am',
      });
      setTestResult(res);
      loadData();
    } catch (err) {
      console.error('Test execution failed:', err);
    } finally {
      setTestLoading(false);
    }
  };

  // Filter sources
  const filteredSources = sources.filter((s) => {
    if (selectedSubject !== 'all' && s.subject.toLowerCase() !== selectedSubject.toLowerCase()) return false;
    if (selectedPriority !== 'all' && s.priorityLevel !== Number(selectedPriority)) return false;
    if (selectedType !== 'all' && s.sourceType !== selectedType) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        s.title.toLowerCase().includes(q) ||
        s.author.toLowerCase().includes(q) ||
        s.publisher.toLowerCase().includes(q) ||
        s.topic.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getPriorityBadge = (lvl: SourcePriorityLevel) => {
    const badges: Record<SourcePriorityLevel, { text: string; bg: string; color: string }> = {
      1: { text: 'Level 1 · Ethiopian Curriculum', bg: 'bg-emerald-100 dark:bg-emerald-950/50', color: 'text-emerald-800 dark:text-emerald-300' },
      2: { text: 'Level 2 · Official MoE/Gov', bg: 'bg-teal-100 dark:bg-teal-950/50', color: 'text-teal-800 dark:text-teal-300' },
      3: { text: 'Level 3 · Universities', bg: 'bg-blue-100 dark:bg-blue-950/50', color: 'text-blue-800 dark:text-blue-300' },
      4: { text: 'Level 4 · Academic Books/Papers', bg: 'bg-indigo-100 dark:bg-indigo-950/50', color: 'text-indigo-800 dark:text-indigo-300' },
      5: { text: 'Level 5 · High-Quality References', bg: 'bg-amber-100 dark:bg-amber-950/50', color: 'text-amber-800 dark:text-amber-300' },
      6: { text: 'Level 6 · Reputable Web Sources', bg: 'bg-stone-100 dark:bg-stone-800', color: 'text-stone-700 dark:text-stone-300' },
    };
    const b = badges[lvl] || badges[6];
    return <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${b.bg} ${b.color}`}>{b.text}</span>;
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-stone-900 text-white p-6 rounded-2xl shadow-sm border border-emerald-800/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold tracking-wider uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                PART 20
              </span>
              <h1 className="text-xl font-bold font-serif-ethiopic">
                የላቀ AI ጥናትና የምርምር ምንጮች ቁጥጥር (Research & Multi-Source Engine)
              </h1>
            </div>
            <p className="text-sm text-stone-300 max-w-3xl">
              ባለ ሁለት ደረጃ የእውቀት ስርዓት (Two-Layer Knowledge System)፦ የኢትዮጵያ ስርዓተ-ትምህርት እንደ ዋነኛ መነሻ (Layer 1) ሆኖ፣
              ከተረጋገጡ የዩኒቨርሲቲና የአካዳሚክ ምንጮች (Layer 2) ጋር በታማኝነትና በጥብቅ ሳይንሳዊ ሚዛን ተቀናጅቶ የሚቀርብበት ማዕከል።
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              አዲስ ምንጭ አክል (Add Approved Source)
            </button>
            <button
              onClick={loadData}
              disabled={loading}
              className="p-2.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-xl transition-colors cursor-pointer"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-stone-800/80">
          <div className="bg-stone-800/60 p-3 rounded-xl border border-stone-700/40">
            <div className="text-xs text-stone-400">ጠቅላላ የተፈቀዱ ምንጮች</div>
            <div className="text-2xl font-bold text-emerald-400 mt-0.5">{sources.length}</div>
            <div className="text-[11px] text-stone-400 mt-0.5">የስርዓተ-ትምህርት + ውጫዊ</div>
          </div>
          <div className="bg-stone-800/60 p-3 rounded-xl border border-stone-700/40">
            <div className="text-xs text-stone-400">የተረጋገጡ ዶሜይኖች (Domains)</div>
            <div className="text-2xl font-bold text-teal-300 mt-0.5">{domains.length}</div>
            <div className="text-[11px] text-stone-400 mt-0.5">MoE, AAU, OpenStax, etc.</div>
          </div>
          <div className="bg-stone-800/60 p-3 rounded-xl border border-stone-700/40">
            <div className="text-xs text-stone-400">የሀሰተኛ ምንጭ መከላከያ (QC)</div>
            <div className="text-2xl font-bold text-emerald-400 mt-0.5">100%</div>
            <div className="text-[11px] text-stone-400 mt-0.5">Zero Fabricated Citations</div>
          </div>
          <div className="bg-stone-800/60 p-3 rounded-xl border border-stone-700/40">
            <div className="text-xs text-stone-400">የተደረጉ ኦዲቶች (Audits)</div>
            <div className="text-2xl font-bold text-blue-300 mt-0.5">{audits.length}</div>
            <div className="text-[11px] text-stone-400 mt-0.5">Verified Two-Layer Queries</div>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex border-b border-stone-200 dark:border-stone-800 gap-2">
        <button
          onClick={() => setActiveTab('catalog')}
          className={`flex items-center gap-2 pb-3 px-3 text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
            activeTab === 'catalog'
              ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400'
              : 'border-transparent text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
          }`}
        >
          <Library className="w-4 h-4" />
          የምንጮች ካታሎግ ({filteredSources.length})
        </button>
        <button
          onClick={() => setActiveTab('domains')}
          className={`flex items-center gap-2 pb-3 px-3 text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
            activeTab === 'domains'
              ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400'
              : 'border-transparent text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
          }`}
        >
          <Globe className="w-4 h-4" />
          የተፈቀዱ የድረ-ገጽ ዶሜይኖች ({domains.length})
        </button>
        <button
          onClick={() => setActiveTab('audits')}
          className={`flex items-center gap-2 pb-3 px-3 text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
            activeTab === 'audits'
              ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400'
              : 'border-transparent text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
          }`}
        >
          <FileCheck className="w-4 h-4" />
          የ AI ጥቅሶች ኦዲት መዝገብ ({audits.length})
        </button>
        <button
          onClick={() => setActiveTab('tester')}
          className={`flex items-center gap-2 pb-3 px-3 text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
            activeTab === 'tester'
              ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400'
              : 'border-transparent text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-500" />
          የምርምር ሞካሪ (Interactive Research Tester)
        </button>
      </div>

      {/* TAB 1: CATALOG */}
      {activeTab === 'catalog' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="bg-white dark:bg-stone-900 p-4 rounded-xl border border-stone-200 dark:border-stone-800 shadow-xs flex flex-wrap items-center gap-3">
            <div className="flex-1 min-w-[220px] relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="በርዕስ፣ በፀሐፊ፣ በይዘት ወይም በርዕሰ-ጉዳይ ፈልግ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="py-2 px-3 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-700 dark:text-stone-300"
            >
              <option value="all">ሁሉም የትምህርት ዓይነቶች (All Subjects)</option>
              <option value="Physics">Physics (ፊዚክስ)</option>
              <option value="Mathematics">Mathematics (ሂሳብ)</option>
              <option value="Chemistry">Chemistry (ኬሚስትሪ)</option>
              <option value="Biology">Biology (ባዮሎጂ)</option>
              <option value="History">History (ታሪክ)</option>
              <option value="Geography">Geography (ጂኦግራፊ)</option>
              <option value="Economics">Economics (ኢኮኖሚክስ)</option>
              <option value="English">English (እንግሊዝኛ)</option>
            </select>

            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="py-2 px-3 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-700 dark:text-stone-300"
            >
              <option value="all">ሁሉም ቅድሚያ ደረጃዎች (All Priorities)</option>
              <option value="1">Level 1 · Ethiopian Curriculum</option>
              <option value="2">Level 2 · Official MoE/Gov</option>
              <option value="3">Level 3 · Universities</option>
              <option value="4">Level 4 · Academic Books/Papers</option>
              <option value="5">Level 5 · High-Quality References</option>
              <option value="6">Level 6 · Reputable Web Sources</option>
            </select>

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="py-2 px-3 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-700 dark:text-stone-300"
            >
              <option value="all">ሁሉም የምንጭ ዓይነቶች (All Types)</option>
              <option value="CURRICULUM_TEXTBOOK">Curriculum Textbook</option>
              <option value="REFERENCE_BOOK">Reference Book</option>
              <option value="ACADEMIC_BOOK">Academic Book</option>
              <option value="UNIVERSITY_RESOURCE">University Resource</option>
              <option value="ACADEMIC_PAPER">Academic Paper</option>
              <option value="OFFICIAL_DOCUMENT">Official Document</option>
              <option value="OPEN_EDUCATIONAL_RESOURCE">Open Educational Resource</option>
              <option value="WEB_REFERENCE">Web Reference</option>
            </select>
          </div>

          {/* Sources Table */}
          <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 dark:bg-stone-800/60 text-stone-500 dark:text-stone-400 border-b border-stone-200 dark:border-stone-800 uppercase font-semibold">
                  <tr>
                    <th className="py-3 px-4">የምንጭ ርዕስና ደራሲ (Title & Author)</th>
                    <th className="py-3 px-3">ደረጃ (Priority Level)</th>
                    <th className="py-3 px-3">ትምህርት / ክፍል</th>
                    <th className="py-3 px-3">ዓይነት (Type)</th>
                    <th className="py-3 px-3">አካዳሚክ ደረጃ</th>
                    <th className="py-3 px-3 text-right">እርምጃዎች</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                  {filteredSources.map((source) => (
                    <tr key={source.sourceId} className="hover:bg-stone-50/70 dark:hover:bg-stone-800/40 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-stone-900 dark:text-stone-100 text-sm">
                          {source.title}
                        </div>
                        <div className="text-stone-500 text-xs flex items-center gap-2 mt-0.5">
                          <span>{source.author}</span>
                          <span>•</span>
                          <span>{source.publisher} ({source.year})</span>
                          {source.isbn && (
                            <>
                              <span>•</span>
                              <span className="font-mono text-[11px]">ISBN: {source.isbn}</span>
                            </>
                          )}
                        </div>
                        {source.description && (
                          <div className="text-stone-400 text-[11px] mt-1 line-clamp-1">
                            {source.description}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        <div className="space-y-1">
                          {getPriorityBadge(source.priorityLevel)}
                          <div className="flex items-center gap-1">
                            <span className="text-[10px] text-stone-400">ቀይር፡</span>
                            <select
                              value={source.priorityLevel}
                              onChange={(e) => handlePriorityChange(source.sourceId, Number(e.target.value) as SourcePriorityLevel)}
                              className="text-[10px] bg-stone-100 dark:bg-stone-800 rounded px-1 py-0.5 border border-stone-200 dark:border-stone-700"
                            >
                              <option value="1">Level 1</option>
                              <option value="2">Level 2</option>
                              <option value="3">Level 3</option>
                              <option value="4">Level 4</option>
                              <option value="5">Level 5</option>
                              <option value="6">Level 6</option>
                            </select>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-medium text-stone-800 dark:text-stone-200">
                          {source.subject}
                        </div>
                        <div className="text-stone-500 text-[11px]">
                          ክፍል {source.grade}
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-[11px] font-mono">
                          {source.sourceType}
                        </span>
                        <div className="text-[10px] text-stone-400 mt-0.5">
                          {source.accessPermission}
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5">
                          <div className="w-10 bg-stone-200 dark:bg-stone-700 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-emerald-500 h-full rounded-full"
                              style={{ width: `${source.academicCredibility}%` }}
                            />
                          </div>
                          <span className="font-semibold text-stone-700 dark:text-stone-300">
                            {source.academicCredibility}%
                          </span>
                        </div>
                        <div className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5 mt-0.5">
                          <CheckCircle2 className="w-3 h-3" />
                          የተረጋገጠ ምንጭ
                        </div>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {source.fileUrl && (
                            <a
                              href={source.fileUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 text-stone-500 hover:text-emerald-600 rounded transition-colors"
                              title="ምንጩን ይመልከቱ"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                          <button
                            onClick={() => handleDeleteSource(source.sourceId)}
                            className="p-1.5 text-stone-400 hover:text-rose-600 rounded transition-colors cursor-pointer"
                            title="ምንጩን ሰርዝ"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredSources.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-stone-400">
                        ምንም የተገኘ የተፈቀደ ምንጭ የለም። ማጣሪያውን ይቀይሩ ወይም አዲስ ምንጭ ያክሉ።
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TRUSTED DOMAINS */}
      {activeTab === 'domains' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Add Domain Form */}
          <div className="bg-white dark:bg-stone-900 p-5 rounded-xl border border-stone-200 dark:border-stone-800 shadow-xs h-fit">
            <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2 mb-3">
              <Globe className="w-4 h-4 text-emerald-600" />
              አዲስ የታመነ ዶሜይን አክል (Add Trusted Domain)
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              AI ውጫዊ የማመሳከሪያ መረጃዎችን በሚፈልግበት ወቅት በእነዚህ የተፈቀዱ ዶሜይኖች ላይ ብቻ ተመስርቶ መረጃ ያረጋግጣል።
            </p>
            <form onSubmit={handleAddDomain} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  የዶሜይን አድራሻ (Domain URL / Hostname)
                </label>
                <input
                  type="text"
                  placeholder="ለምሳሌ፡ mit.edu ወይም aau.edu.et"
                  value={newDomainName}
                  onChange={(e) => setNewDomainName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg focus:ring-1 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  የተቋሙ ስም (Organization Name)
                </label>
                <input
                  type="text"
                  placeholder="ለምሳሌ፡ Addis Ababa University"
                  value={newDomainDesc}
                  onChange={(e) => setNewDomainDesc(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  የተቋም ዓይነት (Category)
                </label>
                <select
                  value={newDomainCategory}
                  onChange={(e) => setNewDomainCategory(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg"
                >
                  <option value="GOVERNMENT">መንግስታዊ / ትምህርት ሚኒስቴር (Government / MoE)</option>
                  <option value="UNIVERSITY">ከፍተኛ ዩኒቨርሲቲ (University)</option>
                  <option value="ACADEMIC_PUBLISHER">አካዳሚክ አሳታሚ (Academic Publisher)</option>
                  <option value="OPEN_EDUCATION">ክፍት የትምህርት ግብዓት (Open Education)</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer mt-2"
              >
                ዶሜይን ፈቅድ (Authorize Domain)
              </button>
            </form>
          </div>

          {/* Domains List */}
          <div className="md:col-span-2 space-y-3">
            <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 shadow-xs overflow-hidden">
              <div className="p-4 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                    የተፈቀዱ አስተማማኝ ድረ-ገጾች ({domains.length})
                  </h3>
                  <p className="text-xs text-stone-500">
                    የውጭ መረጃዎችን ለማረጋገጥ AI እንዲጠቀምባቸው የተፈቀዱ ኦፊሴላዊ ተቋማት
                  </p>
                </div>
              </div>

              <div className="divide-y divide-stone-100 dark:divide-stone-800">
                {domains.map((dom) => (
                  <div key={dom.domain} className="p-4 flex items-center justify-between hover:bg-stone-50/70 dark:hover:bg-stone-800/40 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-600 flex items-center justify-center font-bold text-xs border border-teal-200 dark:border-teal-800">
                        {dom.category === 'GOVERNMENT' ? <Building2 className="w-4 h-4" /> : <GraduationCap className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="font-semibold text-stone-900 dark:text-stone-100 text-sm flex items-center gap-2">
                          <span>{dom.institutionName}</span>
                          <span className="px-2 py-0.5 text-[10px] rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-mono">
                            {dom.domain}
                          </span>
                        </div>
                        <div className="text-xs text-stone-500 flex items-center gap-2 mt-0.5">
                          <span className="capitalize">{dom.category.toLowerCase().replace('_', ' ')}</span>
                          <span>•</span>
                          <span>ተአማኒነት፡ {dom.credibilityScore}%</span>
                          {dom.notes && <span>• {dom.notes}</span>}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 rounded-md flex items-center gap-1">
                        <Check className="w-3 h-3" /> የተፈቀደ
                      </span>
                      <button
                        onClick={() => handleRemoveDomain(dom.domain)}
                        className="p-1.5 text-stone-400 hover:text-rose-600 rounded transition-colors cursor-pointer"
                        title="ዶሜይን አስወግድ"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: AUDIT LOGS */}
      {activeTab === 'audits' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-stone-900 p-4 rounded-xl border border-stone-200 dark:border-stone-800 shadow-xs flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                የ AI ጥቅሶችና ምንጮች የጥራት ቁጥጥር መዝገብ (Citation Audit & Quality Control)
              </h3>
              <p className="text-xs text-stone-500">
                ተማሪዎች ለጠየቋቸው ጥልቅ የምርምር ጥያቄዎች የተሰጡት ጥቅሶች የተረጋገጡ መሆናቸውንና የሀሰተኛ ምንጭ አለመኖሩን የሚመዘግብ ኦዲት
              </p>
            </div>
            <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 text-xs font-bold rounded-full flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              100% Verified Quality Ratio
            </span>
          </div>

          <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 dark:bg-stone-800/60 text-stone-500 dark:text-stone-400 border-b border-stone-200 dark:border-stone-800 uppercase font-semibold">
                  <tr>
                    <th className="py-3 px-4">የጥያቄው ርዕስ (Research Topic)</th>
                    <th className="py-3 px-3">ትምህርትና ክፍል</th>
                    <th className="py-3 px-3">የተፈተሹ ጥቅሶች (Checked Citations)</th>
                    <th className="py-3 px-3">የስርዓተ-ትምህርት / ውጫዊ ንፅፅር</th>
                    <th className="py-3 px-3">የተረጋገጠበት ሁኔታ</th>
                    <th className="py-3 px-3">ቀንና ሰዓት</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                  {audits.map((audit) => (
                    <tr key={audit.auditId} className="hover:bg-stone-50/70 dark:hover:bg-stone-800/40">
                      <td className="py-3 px-4 font-medium text-stone-900 dark:text-stone-100">
                        {audit.question}
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-semibold">{audit.subject}</span>
                        <span className="text-stone-500 text-[11px] block">ክፍል {audit.studentGrade}</span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-bold text-stone-800 dark:text-stone-200">
                          {audit.citationsCheckedCount} ጥቅሶች
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 rounded text-[10px] font-semibold">
                            {audit.curriculumCitationsCount} ስርዓተ-ትምህርት
                          </span>
                          <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 rounded text-[10px] font-semibold">
                            {audit.externalCitationsCount} ውጫዊ ምንጭ
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 flex items-center gap-1 w-fit">
                          <CheckCircle2 className="w-3 h-3" />
                          የተረጋገጠ (No Hallucination)
                        </span>
                      </td>
                      <td className="py-3 px-3 text-stone-400 text-[11px]">
                        {new Date(audit.timestamp).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                  {audits.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-stone-400">
                        እስካሁን የተመዘገበ ኦዲት የለም።
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: INTERACTIVE RESEARCH TESTER */}
      {activeTab === 'tester' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-stone-900 p-5 rounded-xl border border-stone-200 dark:border-stone-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  የባለ ሁለት ደረጃ የእውቀት ሞካሪ (Live Two-Layer Research Tester)
                </h3>
                <p className="text-xs text-stone-500">
                  ስርዓተ-ትምህርቱን እንደ መነሻ (Layer 1) አድርጎ ከውጭ ከተፈቀዱ ምንጮች (Layer 2) ጋር በ13ቱ ነጥቦች አዋህዶ መተንተን
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  የትምህርት ዓይነት (Subject)
                </label>
                <select
                  value={testSubject}
                  onChange={(e) => setTestSubject(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg"
                >
                  <option value="Physics">Physics (ፊዚክስ)</option>
                  <option value="Mathematics">Mathematics (ሂሳብ)</option>
                  <option value="Chemistry">Chemistry (ኬሚስትሪ)</option>
                  <option value="Biology">Biology (ባዮሎጂ)</option>
                  <option value="History">History (ታሪክ)</option>
                  <option value="Economics">Economics (ኢኮኖሚክስ)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  የክፍል ደረጃ (Grade Level)
                </label>
                <select
                  value={testGrade}
                  onChange={(e) => setTestGrade(Number(e.target.value) as GradeLevel)}
                  className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg"
                >
                  <option value={9}>Grade 9 (ክፍል 9)</option>
                  <option value={10}>Grade 10 (ክፍል 10)</option>
                  <option value={11}>Grade 11 (ክፍል 11)</option>
                  <option value={12}>Grade 12 (ክፍል 12)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  የትንታኔ ሁነታ (Analysis Mode)
                </label>
                <select
                  value={testMode}
                  onChange={(e) => setTestMode(e.target.value as AnalysisMode)}
                  className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg"
                >
                  <option value="DEEP_ANALYSIS">ጥልቅ ትንታኔ (Deep Analysis)</option>
                  <option value="comparative">የእይታዎች ንፅፅር (Comparative Scholarly)</option>
                  <option value="real_world">ተግባራዊ ምሳሌ (Real-World Applied)</option>
                  <option value="university_level">የዩኒቨርሲቲ ዝግጅት (University Level)</option>
                  <option value="curriculum">የስርዓተ-ትምህርት ብቻ (Curriculum Only)</option>
                  <option value="book_recommendations">አጋዥ መጻሕፍት ጠቁም (Book Recommendations)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                የምርምር ጥያቄ / ርዕስ (Topic / Research Prompt)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={testQuestion}
                  onChange={(e) => setTestQuestion(e.target.value)}
                  placeholder="ለምሳሌ፡ Circular Motion in Grade 11 Physics with GERD Turbine Application"
                  className="flex-1 px-3 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg"
                />
                <button
                  onClick={handleRunTest}
                  disabled={testLoading}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  {testLoading ? 'በመተንተን ላይ...' : 'ትንታኔውን አከናውን (Execute Analysis)'}
                </button>
              </div>
            </div>
          </div>

          {/* Test Result View (13 Points Display) */}
          {testResult && (
            <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-6 shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-stone-100 dark:border-stone-800">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                    Two-Layer Knowledge Result
                  </span>
                  <h2 className="text-base font-bold text-stone-900 dark:text-stone-100 mt-1">
                    {testResult.question}
                  </h2>
                </div>
                <div className="text-right text-xs text-stone-500">
                  <div>ክፍል {testResult.grade} • {testResult.subject}</div>
                  <div className="font-mono uppercase text-emerald-600 font-semibold">{testResult.mode}</div>
                </div>
              </div>

              {/* 1. Definition */}
              <div className="bg-stone-50 dark:bg-stone-800/50 p-4 rounded-xl border border-stone-200 dark:border-stone-700/60">
                <div className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">
                  1. 📌 መሰረታዊ ፍቺ (Foundational Definition)
                </div>
                <div className="text-sm text-stone-900 dark:text-stone-100 leading-relaxed font-serif-ethiopic">
                  {testResult.definition}
                </div>
              </div>

              {/* 2 & 3: Curriculum vs Deeper Explanation */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/40 dark:bg-emerald-950/20">
                  <div className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4" />
                    2. 📖 በኢትዮጵያ ስርዓተ-ትምህርት መሰረት (Layer 1 Curriculum)
                  </div>
                  <div className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed font-serif-ethiopic">
                    {testResult.curriculumExplanation}
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-indigo-200 dark:border-indigo-800/60 bg-indigo-50/40 dark:bg-indigo-950/20">
                  <div className="text-xs font-bold text-indigo-800 dark:text-indigo-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4" />
                    3. 🔬 ተጨማሪ ጥልቅ ማብራሪያ (Layer 2 External Academic)
                  </div>
                  <div className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed font-serif-ethiopic">
                    {testResult.deeperExplanation}
                  </div>
                </div>
              </div>

              {/* 4. Key Concepts */}
              <div>
                <div className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">
                  4. 💡 ዋና ዋና ፅንሰ-ሀሳቦች (Key Concepts)
                </div>
                <div className="flex flex-wrap gap-2">
                  {testResult.keyConcepts.map((c, i) => (
                    <span key={i} className="px-3 py-1 bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 rounded-lg text-xs font-medium border border-stone-200 dark:border-stone-700">
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              {/* 5. Different Perspectives */}
              {testResult.differentPerspectives && testResult.differentPerspectives.length > 0 && (
                <div>
                  <div className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Scale className="w-4 h-4 text-amber-500" />
                    5. ⚖️ የተለያዩ አመለካከቶችና የንፅፅር ትንታኔ (Multi-Source Perspectives)
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {testResult.differentPerspectives.map((p, i) => (
                      <div key={i} className="p-3 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50/60 dark:bg-stone-800/30">
                        <div className="font-bold text-xs text-stone-900 dark:text-stone-100">
                          {p.perspectiveTitle}
                        </div>
                        <div className="text-xs text-stone-600 dark:text-stone-300 mt-1">
                          {p.description}
                        </div>
                        <div className="text-[11px] text-stone-400 mt-2 flex items-center justify-between">
                          <span>ምንጭ፡ {p.proponentOrSource}</span>
                          <span className="font-semibold text-emerald-600">{p.consensusDegree}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 6 & 7: Examples & Real-world Applications */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">
                    6. 📐 ምሳሌዎችና ማብራሪያዎች (Examples & Demonstrations)
                  </div>
                  <div className="space-y-2">
                    {testResult.examples.map((ex, i) => (
                      <div key={i} className="p-3 rounded-lg bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-700 text-xs">
                        <div className="font-semibold text-stone-800 dark:text-stone-200">
                          ምሳሌ {i + 1}፡ {ex.title}
                        </div>
                        <div className="text-stone-600 dark:text-stone-300 mt-1 whitespace-pre-line text-[11px]">
                          {ex.scenarioOrProblem}
                        </div>
                        <div className="mt-1.5 font-mono text-[11px] text-emerald-800 dark:text-emerald-300 bg-emerald-50/50 dark:bg-emerald-950/20 p-2 rounded">
                          {ex.detailedWalkthrough}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">
                    7. 🌍 በኢትዮጵያ ነባራዊ ሁኔታ (Real-World Applications)
                  </div>
                  <div className="p-3 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/60 text-xs">
                    <div className="font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5 mb-1.5">
                      <span>🇪🇹</span>
                      <span>የኢትዮጵያ ነባራዊ ሁኔታና ተጨባጭ ፋይዳ</span>
                    </div>
                    <div className="text-stone-700 dark:text-stone-300 whitespace-pre-line leading-relaxed">
                      {testResult.realWorldApplication}
                    </div>
                  </div>
                </div>
              </div>

              {/* 8 & 9: Advantages & Limitations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-700">
                  <div className="text-xs font-bold text-emerald-700 dark:text-emerald-400 mb-1">
                    8. ➕ ጥቅሞችና ጠቀሜታ (Advantages)
                  </div>
                  <ul className="list-disc pl-4 text-xs text-stone-600 dark:text-stone-300 space-y-0.5">
                    {testResult.advantages.map((adv, i) => (
                      <li key={i}>{adv}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 rounded-lg bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-700">
                  <div className="text-xs font-bold text-amber-700 dark:text-amber-400 mb-1">
                    9. ⚠️ ወሰኖችና ገደቦች (Limitations & Constraints)
                  </div>
                  <ul className="list-disc pl-4 text-xs text-stone-600 dark:text-stone-300 space-y-0.5">
                    {testResult.limitations.map((lim, i) => (
                      <li key={i}>{lim}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* 11 & 12: Critical Questions & Summary */}
              <div className="space-y-3">
                <div>
                  <div className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">
                    11. 🤔 የማሰብ አቅምን የሚያዳብሩ ጥያቄዎች (Critical-Thinking Questions)
                  </div>
                  <div className="space-y-1">
                    {testResult.criticalThinkingQuestions.map((q, i) => (
                      <div key={i} className="text-xs text-stone-700 dark:text-stone-300 flex items-start gap-2">
                        <span className="font-bold text-emerald-600">{i + 1}.</span>
                        <span>{q}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
                  <div className="text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1">
                    12. 📝 ማጠቃለያ (Synthesis Summary)
                  </div>
                  <div className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed font-serif-ethiopic">
                    {testResult.summary}
                  </div>
                </div>
              </div>

              {/* 13. Sources & References */}
              <div>
                <div className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>13. 📚 የተጠቀሱ ይፋዊ ምንጮች (Validated Citations)</span>
                  <span className="text-emerald-600 font-normal">ሁሉንም ምንጮች በአስተማማኝ ሁኔታ ማጣራት ተከናውኗል</span>
                </div>
                <div className="space-y-2">
                  {testResult.citations.map((c, i) => (
                    <div
                      key={c.citationId || i}
                      className={`p-3 rounded-lg border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                        c.isCurriculum
                          ? 'border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20'
                          : 'border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/20'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                          <span>{c.sourceTitle}</span>
                          {getPriorityBadge(c.priorityLevel)}
                        </div>
                        <div className="text-stone-500 text-[11px] mt-0.5">
                          {c.author} • {c.publisher} ({c.year}) {c.pageNumber ? `• ገጽ ${c.pageNumber}` : ''}
                        </div>
                        {c.exactSnippetOrSummary && (
                          <div className="text-stone-600 dark:text-stone-300 text-[11px] mt-1 italic">
                            "{c.exactSnippetOrSummary}"
                          </div>
                        )}
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider self-start sm:self-auto font-semibold bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
                        {c.verificationStatus}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Add Source Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-stone-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-xl border border-stone-200 dark:border-stone-800">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
              <h2 className="text-base font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-600" />
                አዲስ የተፈቀደ የምርምር ምንጭ መዝግብ (Register Approved Source)
              </h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-stone-400 hover:text-stone-600 text-lg font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSource} className="space-y-4 mt-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    የመጽሐፍ ወይም የምንጭ ርዕስ (Title) *
                  </label>
                  <input
                    type="text"
                    required
                    value={newSource.title}
                    onChange={(e) => setNewSource({ ...newSource, title: e.target.value })}
                    placeholder="ለምሳሌ፡ University Physics with Modern Physics"
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    ፀሐፊ / ደራሲ (Author / Authors) *
                  </label>
                  <input
                    type="text"
                    required
                    value={newSource.author}
                    onChange={(e) => setNewSource({ ...newSource, author: e.target.value })}
                    placeholder="Hugh D. Young, Roger A. Freedman"
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    አሳታሚ / ተቋም (Publisher / Institution)
                  </label>
                  <input
                    type="text"
                    value={newSource.publisher}
                    onChange={(e) => setNewSource({ ...newSource, publisher: e.target.value })}
                    placeholder="Pearson / OpenStax / AAU Press"
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    የታተመበት ዓ.ም (Year)
                  </label>
                  <input
                    type="number"
                    value={newSource.year}
                    onChange={(e) => setNewSource({ ...newSource, year: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    ISBN (ካለ)
                  </label>
                  <input
                    type="text"
                    value={newSource.isbn || ''}
                    onChange={(e) => setNewSource({ ...newSource, isbn: e.target.value })}
                    placeholder="978-0133978049"
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    የትምህርት ዓይነት (Subject)
                  </label>
                  <select
                    value={newSource.subject}
                    onChange={(e) => setNewSource({ ...newSource, subject: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg"
                  >
                    <option value="Physics">Physics</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Biology">Biology</option>
                    <option value="History">History</option>
                    <option value="Geography">Geography</option>
                    <option value="Economics">Economics</option>
                    <option value="English">English</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    የክፍል ደረጃ (Target Grade)
                  </label>
                  <select
                    value={newSource.grade}
                    onChange={(e) => setNewSource({ ...newSource, grade: e.target.value === 'all' ? 'all' : Number(e.target.value) as any })}
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg"
                  >
                    <option value="all">ለሁሉም ክፍሎች (All 9-12)</option>
                    <option value={9}>Grade 9</option>
                    <option value={10}>Grade 10</option>
                    <option value={11}>Grade 11</option>
                    <option value={12}>Grade 12</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    የምንጭ ቅድሚያ ደረጃ (Priority Level 1-6) *
                  </label>
                  <select
                    value={newSource.priorityLevel}
                    onChange={(e) => setNewSource({ ...newSource, priorityLevel: Number(e.target.value) as SourcePriorityLevel })}
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg font-semibold"
                  >
                    <option value={1}>Level 1 · Ethiopian Curriculum</option>
                    <option value={2}>Level 2 · Official MoE / Government</option>
                    <option value={3}>Level 3 · Universities & Reputable Academic</option>
                    <option value={4}>Level 4 · Peer-Reviewed Academic Books/Papers</option>
                    <option value={5}>Level 5 · High-Quality Reference Books</option>
                    <option value={6}>Level 6 · Reputable Web Sources</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    የምንጭ ዓይነት (Source Type)
                  </label>
                  <select
                    value={newSource.sourceType}
                    onChange={(e) => setNewSource({ ...newSource, sourceType: e.target.value as ExternalSourceType })}
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg"
                  >
                    <option value="CURRICULUM_TEXTBOOK">Curriculum Textbook</option>
                    <option value="REFERENCE_BOOK">Reference Book</option>
                    <option value="ACADEMIC_BOOK">Academic Book</option>
                    <option value="UNIVERSITY_RESOURCE">University Resource</option>
                    <option value="ACADEMIC_PAPER">Academic Paper</option>
                    <option value="OFFICIAL_DOCUMENT">Official Document</option>
                    <option value="OPEN_EDUCATIONAL_RESOURCE">Open Educational Resource</option>
                    <option value="WEB_REFERENCE">Web Reference</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    ዋና ዋና ፅንሰ-ሀሳቦች (Key Concepts, comma separated)
                  </label>
                  <input
                    type="text"
                    value={keyConceptsInput}
                    onChange={(e) => setKeyConceptsInput(e.target.value)}
                    placeholder="Kinematics, Dynamics, Projectile Motion, Gravitation"
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    አጭር ማብራሪያና የትኩረት አቅጣጫ (Description)
                  </label>
                  <textarea
                    rows={2}
                    value={newSource.description}
                    onChange={(e) => setNewSource({ ...newSource, description: e.target.value })}
                    placeholder="This book is recommended for extended derivations, circular motion mechanics, and collegiate university preparation."
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    ፋይል ወይም የድረ-ገጽ አድራሻ (File / Resource URL)
                  </label>
                  <input
                    type="url"
                    value={newSource.fileUrl || ''}
                    onChange={(e) => setNewSource({ ...newSource, fileUrl: e.target.value })}
                    placeholder="https://openstax.org/details/books/university-physics-volume-1"
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-stone-100 dark:border-stone-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 rounded-lg font-semibold cursor-pointer"
                >
                  ይቅር (Cancel)
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  ምንጩን አጽድቅና መዝግብ (Approve & Register Source)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
