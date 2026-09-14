import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Lock,
  Unlock,
  Video,
  Sparkles,
  Layers,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Search,
  Sliders,
  Eye,
  SlidersHorizontal,
  Flame,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';
import { premiumContentService } from '../../services/premiumContentService';
import {
  ProtectedContentItem,
  UsageLimitsConfig,
  SecurityLogItem,
} from '../../types/premiumSecurity';
import { Grade } from '../../types';

export const AdminPremiumContentSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'content' | 'limits' | 'security_logs'>('content');
  const [contentList, setContentList] = useState<ProtectedContentItem[]>([]);
  const [usageLimits, setUsageLimits] = useState<UsageLimitsConfig>({
    dailyVideoLimit: 50,
    weeklyAnimationLimit: 100,
    dailyAiQuestionsLimit: 100,
    dailyExamAttemptsLimit: 20,
    maxConcurrentSessions: 2,
  });
  const [securityLogs, setSecurityLogs] = useState<SecurityLogItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterGrade, setFilterGrade] = useState<Grade | 'ALL'>('ALL');
  const [filterType, setFilterType] = useState<string>('ALL');

  // New Content Modal State
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newContent, setNewContent] = useState<Partial<ProtectedContentItem>>({
    title: '',
    description: '',
    grade: 9,
    subject: 'Mathematics',
    chapter: 'Unit 1',
    topic: '',
    contentType: 'video',
    premiumRequired: true,
    duration: '25:00',
    instructor: 'NUR Certified Senior Teacher',
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [items, limits, logs] = await Promise.all([
        premiumContentService.getAdminProtectedContent(),
        premiumContentService.getUsageLimits(),
        premiumContentService.getSecurityLogs(),
      ]);
      setContentList(items);
      setUsageLimits(limits);
      setSecurityLogs(logs);
    } catch (err: any) {
      setFeedbackMsg({ type: 'error', text: 'መረጃዎችን መጫን አልተቻለም (Failed to load content data).' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleTogglePremium = async (item: ProtectedContentItem) => {
    try {
      const updated = { ...item, premiumRequired: !item.premiumRequired };
      const ok = await premiumContentService.saveProtectedContent(updated);
      if (ok) {
        setContentList((prev) =>
          prev.map((c) => (c.contentId === item.contentId ? { ...c, premiumRequired: !item.premiumRequired } : c))
        );
        setFeedbackMsg({
          type: 'success',
          text: `"${item.title}" የፕሪሚየም ሁኔታ ተቀይሯል (Premium status updated).`,
        });
      }
    } catch {
      setFeedbackMsg({ type: 'error', text: 'ሁኔታውን መቀየር አልተቻለም።' });
    }
  };

  const handleDelete = async (contentId: string) => {
    if (!confirm('ይህንን የይዘት መረጃ መሰረዝ ይፈልጋሉ? (Are you sure you want to delete this content item?)')) return;
    try {
      const ok = await premiumContentService.deleteProtectedContent(contentId);
      if (ok) {
        setContentList((prev) => prev.filter((c) => c.contentId !== contentId));
        setFeedbackMsg({ type: 'success', text: 'ይዘቱ ተሰርዟል (Content deleted successfully).' });
      }
    } catch {
      setFeedbackMsg({ type: 'error', text: 'መሰረዝ አልተቻለም።' });
    }
  };

  const handleCreateContent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.title?.trim()) return;

    try {
      const ok = await premiumContentService.saveProtectedContent({
        ...newContent,
        contentId: `content_${Date.now()}`,
      });
      if (ok) {
        setShowAddModal(false);
        setFeedbackMsg({ type: 'success', text: 'አዲስ የይዘት ትምህርት በተሳካ ሁኔታ ተመዝግቧል!' });
        loadData();
      }
    } catch {
      setFeedbackMsg({ type: 'error', text: 'መመዝገብ አልተቻለም።' });
    }
  };

  const handleSaveLimits = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const ok = await premiumContentService.updateUsageLimits(usageLimits);
      if (ok) {
        setFeedbackMsg({ type: 'success', text: 'የአጠቃቀም ገደቦች በተሳካ ሁኔታ ተሻሽለዋል (Fair-use limits updated)!' });
      }
    } catch {
      setFeedbackMsg({ type: 'error', text: 'ገደቦችን ማስቀመጥ አልተቻለም።' });
    }
  };

  const filteredItems = contentList.filter((item) => {
    if (filterGrade !== 'ALL' && item.grade !== filterGrade) return false;
    if (filterType !== 'ALL' && item.contentType !== filterType) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.subject.toLowerCase().includes(q) ||
        item.topic?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Section Header */}
      <div className="bg-stone-900 text-stone-100 p-6 rounded-3xl border border-stone-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold font-mono uppercase mb-2">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Super Admin Fortress Engine</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif-ethiopic text-white">
            የፕሪሚየም ይዘቶችና የደህንነት ጥበቃ ማዕከል (Premium Content & Security Hub)
          </h2>
          <p className="text-xs text-stone-400 mt-1">
            Zero-Trust የይዘት መቆጣጠሪያ፣ የቪዲዮ/ማስመሰያ መከላከያ እና የደህንነት ኦዲት ክትትል
          </p>
        </div>

        {/* Action / Refresh */}
        <div className="flex items-center gap-2">
          <button
            onClick={loadData}
            className="p-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors cursor-pointer"
            title="አድስ (Refresh)"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>አዲስ ይዘት መዝግብ (Add Protected Content)</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {feedbackMsg && (
        <div
          className={`p-3.5 rounded-2xl flex items-center justify-between gap-3 text-xs font-serif-ethiopic ${
            feedbackMsg.type === 'success'
              ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-800'
              : 'bg-rose-500/10 border border-rose-500/30 text-rose-800'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedbackMsg.type === 'success' ? (
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{feedbackMsg.text}</span>
          </div>
          <button
            onClick={() => setFeedbackMsg(null)}
            className="text-stone-400 hover:text-stone-700 font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-stone-200 gap-4">
        <button
          onClick={() => setActiveTab('content')}
          className={`pb-3 text-xs sm:text-sm font-bold font-serif-ethiopic flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === 'content'
              ? 'border-amber-600 text-amber-900'
              : 'border-transparent text-stone-500 hover:text-stone-900'
          }`}
        >
          <Video className="w-4 h-4" />
          <span>የቪዲዮ እና ማስመሰያ ይዘቶች ({contentList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('limits')}
          className={`pb-3 text-xs sm:text-sm font-bold font-serif-ethiopic flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === 'limits'
              ? 'border-amber-600 text-amber-900'
              : 'border-transparent text-stone-500 hover:text-stone-900'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>የፍትሃዊ አጠቃቀም ገደቦች (Usage Limits)</span>
        </button>

        <button
          onClick={() => setActiveTab('security_logs')}
          className={`pb-3 text-xs sm:text-sm font-bold font-serif-ethiopic flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === 'security_logs'
              ? 'border-amber-600 text-amber-900'
              : 'border-transparent text-stone-500 hover:text-stone-900'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>የደህንነት ኦዲት ሎግ ({securityLogs.length})</span>
        </button>
      </div>

      {/* TAB 1: PROTECTED CONTENT CATALOG */}
      {activeTab === 'content' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="በርዕስ፣ በክፍል ወይም በትምህርት ፈልግ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-stone-50 border border-stone-200 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={filterGrade}
                onChange={(e) => setFilterGrade(e.target.value === 'ALL' ? 'ALL' : (Number(e.target.value) as Grade))}
                className="px-3 py-2 text-xs font-bold rounded-xl bg-stone-50 border border-stone-200"
              >
                <option value="ALL">ሁሉንም ክፍሎች (All Grades)</option>
                <option value="9">ክፍል 9</option>
                <option value="10">ክፍል 10</option>
                <option value="11">ክፍል 11</option>
                <option value="12">ክፍል 12</option>
              </select>

              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 text-xs font-bold rounded-xl bg-stone-50 border border-stone-200"
              >
                <option value="ALL">ሁሉንም አይነት (All Types)</option>
                <option value="video">ቪዲዮ (Videos)</option>
                <option value="animation_2d">2D ማስመሰያ</option>
                <option value="animation_3d">3D ማስመሰያ</option>
              </select>
            </div>
          </div>

          {/* Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.map((item) => (
              <div
                key={item.contentId}
                className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span
                      className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                        item.contentType === 'video'
                          ? 'bg-blue-100 text-blue-800'
                          : item.contentType === 'animation_3d'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {item.contentType === 'video'
                        ? '🎥 Video'
                        : item.contentType === 'animation_3d'
                        ? '🪐 3D Simulation'
                        : '📐 2D Graph'}
                    </span>
                    <span className="text-[11px] font-bold text-stone-500">
                      ክፍል {item.grade} • {item.subject}
                    </span>
                  </div>

                  <h4 className="font-serif-ethiopic font-bold text-sm text-stone-900 line-clamp-2">
                    {item.title}
                  </h4>
                  <p className="text-xs text-stone-500 font-serif-ethiopic mt-1 line-clamp-2">
                    {item.description || item.chapter}
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                  {/* Premium Toggle Button */}
                  <button
                    onClick={() => handleTogglePremium(item)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      item.premiumRequired
                        ? 'bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200'
                        : 'bg-emerald-100 text-emerald-900 border border-emerald-300 hover:bg-emerald-200'
                    }`}
                  >
                    {item.premiumRequired ? (
                      <>
                        <Lock className="w-3.5 h-3.5 text-amber-700" />
                        <span>🔒 ፕሪሚየም ብቻ</span>
                      </>
                    ) : (
                      <>
                        <Unlock className="w-3.5 h-3.5 text-emerald-700" />
                        <span>🔓 ነፃ ይዘት</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleDelete(item.contentId)}
                    className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                    title="ሰርዝ"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: USAGE LIMITS CONFIGURATION */}
      {activeTab === 'limits' && (
        <form onSubmit={handleSaveLimits} className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-6 max-w-2xl">
          <div>
            <h3 className="text-base font-bold font-serif-ethiopic text-stone-900">
              የፍትሃዊ አጠቃቀም እና የፍጆታ ገደቦች (Fair-Use Limits)
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              የአገልጋይ ጫናን፣ ማጭበርበርን እና ያልተፈቀደ የቪዲዮ መዝረፍን ለመከላከል የተቀመጡ ዕለታዊ ገደቦች
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                የዕለቱ ከፍተኛ የቪዲዮ እይታ ገደብ (Daily Video Limit per Student):
              </label>
              <input
                type="number"
                min={1}
                max={500}
                value={usageLimits.dailyVideoLimit}
                onChange={(e) => setUsageLimits({ ...usageLimits, dailyVideoLimit: Number(e.target.value) })}
                className="w-full px-3 py-2 text-sm rounded-xl border border-stone-300 focus:outline-none focus:border-amber-500"
              />
              <span className="text-[11px] text-stone-400">ተማሪው በቀን ማየት የሚችለው ከፍተኛ የትምህርት ቪዲዮዎች ብዛት</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                የሳምንቱ ከፍተኛ የ2D/3D ማስመሰያዎች ገደብ (Weekly Simulation Limit):
              </label>
              <input
                type="number"
                min={1}
                max={1000}
                value={usageLimits.weeklyAnimationLimit}
                onChange={(e) => setUsageLimits({ ...usageLimits, weeklyAnimationLimit: Number(e.target.value) })}
                className="w-full px-3 py-2 text-sm rounded-xl border border-stone-300 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                በአንድ ጊዜ የሚፈቀዱ ተከታታይ ክፍለ-ጊዜዎች (Max Concurrent Sessions):
              </label>
              <input
                type="number"
                min={1}
                max={5}
                value={usageLimits.maxConcurrentSessions}
                onChange={(e) => setUsageLimits({ ...usageLimits, maxConcurrentSessions: Number(e.target.value) })}
                className="w-full px-3 py-2 text-sm rounded-xl border border-stone-300 focus:outline-none focus:border-amber-500"
              />
              <span className="text-[11px] text-stone-400">አካውንት መጋራትን (Account Sharing) ለመቆጣጠር የሚረዳ</span>
            </div>
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
          >
            ገደቦቹን አስቀምጥ (Save Fair-Use Limits)
          </button>
        </form>
      )}

      {/* TAB 3: SECURITY AUDIT LOGS */}
      {activeTab === 'security_logs' && (
        <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs">
          <div className="p-4 border-b border-stone-100 flex items-center justify-between">
            <h3 className="font-bold text-sm text-stone-900 font-serif-ethiopic">
              የቅጽበታዊ ደህንነት እና የማጭበርበር ክትትል (Security & Fraud Monitor)
            </h3>
            <span className="text-xs text-stone-400 font-mono">
              ጠቅላላ የተመዘገቡ፡ {securityLogs.length}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-700">
              <thead className="bg-stone-50 border-b border-stone-200 font-bold text-stone-600 uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4">ሰዓት (Timestamp)</th>
                  <th className="py-3 px-4">ክስተት (Event Type)</th>
                  <th className="py-3 px-4">ደረጃ (Severity)</th>
                  <th className="py-3 px-4">አስጊነት (Risk)</th>
                  <th className="py-3 px-4">ዝርዝር መግለጫ (Details)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {securityLogs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-stone-400">
                      ምንም የደህንነት ስጋት አልተመዘገበም (No security violations recorded).
                    </td>
                  </tr>
                ) : (
                  securityLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-stone-50/50">
                      <td className="py-2.5 px-4 font-mono text-[11px] text-stone-500">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </td>
                      <td className="py-2.5 px-4 font-mono font-bold text-stone-900">
                        {log.eventType}
                      </td>
                      <td className="py-2.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                            log.severity === 'CRITICAL'
                              ? 'bg-rose-100 text-rose-800'
                              : log.severity === 'HIGH'
                              ? 'bg-orange-100 text-orange-800'
                              : log.severity === 'MEDIUM'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {log.severity}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 font-mono font-bold">
                        <span className={log.riskScore > 50 ? 'text-rose-600' : 'text-stone-600'}>
                          {log.riskScore}/100
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-stone-600 font-serif-ethiopic">
                        {log.details}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: ADD NEW PROTECTED CONTENT */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full border border-stone-200 shadow-2xl space-y-4">
            <h3 className="font-serif-ethiopic font-bold text-base text-stone-900">
              አዲስ የትምህርት ቪዲዮ ወይም ማስመሰያ መዝግብ
            </h3>

            <form onSubmit={handleCreateContent} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">የርዕስ ስም (Title):</label>
                <input
                  type="text"
                  required
                  value={newContent.title}
                  onChange={(e) => setNewContent({ ...newContent, title: e.target.value })}
                  placeholder="Grade 11 Physics: Electric Fields..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">ክፍል (Grade):</label>
                  <select
                    value={newContent.grade}
                    onChange={(e) => setNewContent({ ...newContent, grade: Number(e.target.value) as Grade })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300"
                  >
                    <option value={9}>ክፍል 9</option>
                    <option value={10}>ክፍል 10</option>
                    <option value={11}>ክፍል 11</option>
                    <option value={12}>ክፍል 12</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">የትምህርት አይነት (Subject):</label>
                  <input
                    type="text"
                    required
                    value={newContent.subject}
                    onChange={(e) => setNewContent({ ...newContent, subject: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">የይዘት አይነት (Content Type):</label>
                  <select
                    value={newContent.contentType}
                    onChange={(e) => setNewContent({ ...newContent, contentType: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300"
                  >
                    <option value="video">ቪዲዮ (Video Lesson)</option>
                    <option value="animation_2d">2D Interactive Graph</option>
                    <option value="animation_3d">3D WebGL Simulation</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">የጊዜ ርዝመት (Duration):</label>
                  <input
                    type="text"
                    value={newContent.duration}
                    onChange={(e) => setNewContent({ ...newContent, duration: e.target.value })}
                    placeholder="25:00"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="chk-prem"
                  checked={newContent.premiumRequired}
                  onChange={(e) => setNewContent({ ...newContent, premiumRequired: e.target.checked })}
                  className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4 cursor-pointer"
                />
                <label htmlFor="chk-prem" className="text-xs font-bold text-stone-800 cursor-pointer">
                  በፕሪሚየም አባልነት ብቻ እንዲከፈት ይደረግ (Require Premium Subscription)
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs text-stone-600 hover:text-stone-900 cursor-pointer"
                >
                  ተመለስ (Cancel)
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-md cursor-pointer"
                >
                  አስቀምጥ (Save)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
