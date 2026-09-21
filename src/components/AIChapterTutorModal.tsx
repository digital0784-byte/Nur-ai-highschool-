import React, { useState, useEffect, useRef } from 'react';
import { Subject, Grade, StudentWeakArea } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useProgress } from '../context/ProgressContext';
import {
  Bot,
  Sparkles,
  Send,
  Loader2,
  X,
  BookOpen,
  Lightbulb,
  RefreshCw,
  MessageSquare,
  AlertCircle,
  Library,
  GraduationCap,
  Globe,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Search,
} from 'lucide-react';
import { DeepAnalysisResult, SOURCE_PRIORITY_LABELS, SOURCE_TYPE_LABELS } from '../types/researchAnalysis';
import { researchAnalysisService } from '../services/researchAnalysisService';

interface AIChapterTutorModalProps {
  isOpen: boolean;
  onClose: () => void;
  subject: Subject;
  grade: Grade;
  chapterTitle: string;
  chapterNumber?: number;
  chapterSummary?: string;
  initialMode?: 'analysis' | 'chat' | 'research';
  weakAreas?: StudentWeakArea[];
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export const AIChapterTutorModal: React.FC<AIChapterTutorModalProps> = ({
  isOpen,
  onClose,
  subject,
  grade,
  chapterTitle,
  chapterNumber = 1,
  chapterSummary = '',
  initialMode = 'analysis',
  weakAreas: propWeakAreas,
}) => {
  const { language, t } = useLanguage();
  const { studentReview } = useProgress();
  const [activeMode, setActiveMode] = useState<'analysis' | 'chat' | 'research'>(initialMode);
  const [analysis, setAnalysis] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // Multi-Source Research Engine State (Part 20)
  const [researchResult, setResearchResult] = useState<DeepAnalysisResult | null>(null);
  const [isResearchLoading, setIsResearchLoading] = useState<boolean>(false);
  const [researchError, setResearchError] = useState<string | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Match relevant weak area from student review or prop
  const activeWeakAreas: StudentWeakArea[] = propWeakAreas || studentReview?.weakAreas || [];
  const relevantWeakArea = activeWeakAreas.find(
    (w) =>
      w.subjectName?.toLowerCase().includes(subject.name.toLowerCase()) ||
      w.topicTitle?.toLowerCase().includes(chapterTitle.toLowerCase()) ||
      chapterTitle.toLowerCase().includes(w.topicTitle?.toLowerCase() || '')
  ) || activeWeakAreas[0];

  // Sync mode when prop changes and initialize proactive personalized greeting
  useEffect(() => {
    if (isOpen) {
      setActiveMode(initialMode);
      if (messages.length === 0) {
        if (relevantWeakArea && relevantWeakArea.missingConcept) {
          const proactiveGreeting =
            language === 'en'
              ? `Hello! As your personal AI teacher, I've analyzed your learning records. In **${relevantWeakArea.topicTitle || chapterTitle}**, I noticed: *"${relevantWeakArea.missingConcept}"*. Would you like us to review this specific concept step-by-step right now?`
              : `ሰላም! እንደ ግል AI አስተማሪህ የመማር ግምገማህን ተመልክቻለሁ። በ**${relevantWeakArea.topicTitle || chapterTitle}** ላይ፡ *"${relevantWeakArea.missingConcept}"* ዙሪያ ክፍተት እንዳለ አስተውያለሁ። ይህንን ፅንሰ-ሀሳብ በቀላል ምሳሌ እና በደረጃ በደረጃ ስሌት አብረን እንድናብራራው ትፈልጋለህ?`;

          setMessages([
            {
              role: 'assistant',
              content: proactiveGreeting,
              timestamp: new Date(),
            },
          ]);
        } else {
          const standardGreeting =
            language === 'en'
              ? `Hello! I am your personal AI teacher for **${subject.name} - Grade ${grade} (${chapterTitle})**. Ask me any question, ask for step-by-step problem derivations, or let's test your understanding!`
              : `ሰላም! እኔ የ**${subject.name} ክፍል ${grade} (${chapterTitle})** የግል AI አስተማሪህ ነኝ። ማንኛውንም ያልገባህን ፅንሰ-ሀሳብ፣ ፎርሙላ ወይም የፈተና ጥያቄ ጠይቀኝ፤ ደረጃ በደረጃ አብረን እንሰራለን!`;

          setMessages([
            {
              role: 'assistant',
              content: standardGreeting,
              timestamp: new Date(),
            },
          ]);
        }
      }
    }
  }, [isOpen, initialMode, relevantWeakArea, chapterTitle, subject.name, grade, language]);

  // Fetch AI Analysis when modal opens
  useEffect(() => {
    if (isOpen && !analysis && activeMode === 'analysis') {
      fetchAnalysis();
    } else if (isOpen && !researchResult && activeMode === 'research') {
      fetchResearch();
    }
  }, [isOpen, activeMode, chapterTitle]);

  // Scroll to bottom of chat
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchResearch = async () => {
    setIsResearchLoading(true);
    setResearchError(null);
    try {
      const validGrade = (grade >= 9 && grade <= 12 ? grade : 9) as 9 | 10 | 11 | 12;
      const result = await researchAnalysisService.executeMultiSourceAnalysis({
        question: chapterTitle,
        subject: subject.name,
        grade: validGrade,
        unitNumber: chapterNumber,
        topicTitle: chapterTitle,
        mode: 'deep_analysis',
        language,
      });
      setResearchResult(result);
    } catch (err: any) {
      console.warn('Research multi-source analysis error:', err);
      setResearchError(err?.message || 'ጥልቅ የምርምር ትንታኔ ማምጣት አልተቻለም።');
    } finally {
      setIsResearchLoading(false);
    }
  };

  const fetchAnalysis = async () => {
    setIsAnalyzing(true);
    setAnalysisError(null);
    try {
      const res = await fetch('/api/ai/analyze-chapter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subjectName: subject.name,
          grade,
          topicTitle: chapterTitle,
          chapterNumber,
          chapterTitle,
          content: chapterSummary || `${subject.name} Grade ${grade} Chapter ${chapterNumber}: ${chapterTitle}`,
          language,
        }),
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch AI analysis (${res.status})`);
      }

      const data = await res.json();
      setAnalysis(data.analysis || 'Analysis generated successfully.');
    } catch (err: any) {
      console.warn('AI Analysis network fallback:', err);
      setAnalysis(`### 1. 🎯 የፅንሰ-ሀሳቡ ዋና ፍሬ ነገር (Core Conceptual Breakdown)
ይህ ምዕራፍ **${subject.name} - ክፍል ${grade} (${chapterTitle})** በኢትዮጵያ አዲሱ ስርዓተ-ትምህርት መሰረት የተቀረፀ ሲሆን፣ ተማሪዎች በንድፈ-ሀሳብ እና በተግባር የተደገፈ ጥልቅ ግንዛቤ እንዲያገኙ ታስቦ የተዘጋጀ ነው።

### 2. 💡 ቀመር እና ሳይንሳዊ መርሆዎች (Formulas & Key Laws)
- የርዕሰ ጉዳዩ ዋና ዋና መርሆዎች ደረጃ በደረጃ ተተንትነዋል።
- ቁልፍ የሆኑ ህጎች እና ፎርሙላዎች በተግባራዊ ምሳሌዎች ተብራርተዋል።

### 3. 🇪🇹 በኢትዮጵያ ነባራዊ ሁኔታ ተግባራዊ መገለጫ (Ethiopian Context & Real-World Application)
ይህ ትምህርት በኢትዮጵያ ኢኮኖሚ፣ ግብርና፣ ታዳሽ ሃይል (እንደ ታላቁ የህዳሴ ግድብ) እና በዲጂታል ቴክኖሎጂ ውስጥ ቀጥተኛ ተፈፃሚነት አለው።

### 4. ⚠️ ተማሪዎች በፈተና የሚሰሯቸው የተለመዱ ስህተቶች (Common Pitfalls)
- ፅንሰ-ሀሳቦችን በቃላት ብቻ ከማስታወስ ይልቅ ምክንያታዊ ትስስራቸውን መረዳት ይገባል።
- ለሀገር አቀፍ የዩኒቨርሲቲ መግቢያ ፈተና (ESSLCE) የፅንሰ-ሀሳብ ጥያቄዎች ላይ ጥንቃቄ ማድረግ።

### 5. 🚀 የብቃት ማረጋገጫ የፈተና ጥያቄዎች (Mastery Check)
1. የዚህን ምዕራፍ ዋና መርህ በራስዎ ቃላት ያብራሩ?
2. በቀረቡት የተሰሩ ምሳሌዎች ላይ በመመስረት የልምምድ ጥያቄዎችን ይስሩ።`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSendMessage = async (e?: React.FormEvent, customText?: string) => {
    if (e) e.preventDefault();
    const textToSend = (customText || inputMessage).trim();
    if (!textToSend || isChatLoading) return;

    const newMessages: ChatMessage[] = [
      ...messages,
      { role: 'user', content: textToSend, timestamp: new Date() },
    ];
    setMessages(newMessages);
    setInputMessage('');
    setIsChatLoading(true);

    try {
      const apiMessages = newMessages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch('/api/ai/tutor-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subjectName: subject.name,
          grade,
          chapterTitle,
          topicTitle: chapterTitle,
          messages: apiMessages,
          language,
          weakAreas: activeWeakAreas,
          studentReview,
        }),
      });

      if (!res.ok) {
        throw new Error(`AI Tutor responded with status ${res.status}`);
      }

      const data = await res.json();
      setMessages([
        ...newMessages,
        { role: 'assistant', content: data.reply, timestamp: new Date() },
      ]);
    } catch (err: any) {
      console.error('Chat error:', err);
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: `ይቅርታ፣ ጥያቄዎን ለማስተናገድ ችግር አጋጥሟል (${err.message})። እባክዎ እንደገና ይሞክሩ።`,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#1E1B18]/70 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-[#FAF6EC] border-[2px] border-[#38332D] shadow-[6px_6px_0px_0px_#1E1B18] rounded-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden"
        style={{ borderTopColor: subject.accentColor, borderTopWidth: '6px' }}
      >
        {/* Modal Header */}
        <div className="bg-[#EDE6D4] px-4 sm:px-6 py-3 sm:py-4 border-b-[1.5px] border-[#38332D] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center border-[1.5px] border-[#38332D] shadow-xs"
              style={{ backgroundColor: subject.accentColor, color: '#FFFFFF' }}
            >
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase px-2 py-0.5 rounded-full bg-[#E3DAC4] border border-[#38332D] text-[#1E1B18]">
                  ክፍል {grade} • {subject.name}
                </span>
                <span className="text-xs font-bold text-amber-900 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Gemini 3.7 AI
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold font-serif-ethiopic text-[#1E1B18] mt-0.5 line-clamp-1">
                {chapterTitle}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg border border-[#38332D] bg-[#FAF6EC] text-[#5A5143] hover:text-[#1E1B18] hover:bg-[#E3DAC4] transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher: AI Analysis vs AI Tutor Chat */}
        <div className="flex border-b border-[#38332D] bg-[#E3DAC4] px-4 gap-2 pt-2">
          <button
            onClick={() => setActiveMode('analysis')}
            className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold border-t-[1.5px] border-l-[1.5px] border-r-[1.5px] rounded-t-lg transition-all ${
              activeMode === 'analysis'
                ? 'bg-[#FAF6EC] text-[#1E1B18] border-[#38332D] shadow-xs -mb-[1px]'
                : 'bg-transparent text-[#665C4D] border-transparent hover:bg-[#DCD2BB]'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>የምዕራፉ ጥልቅ ትንታኔ (AI Analysis)</span>
          </button>
          <button
            onClick={() => setActiveMode('chat')}
            className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold border-t-[1.5px] border-l-[1.5px] border-r-[1.5px] rounded-t-lg transition-all ${
              activeMode === 'chat'
                ? 'bg-[#FAF6EC] text-[#1E1B18] border-[#38332D] shadow-xs -mb-[1px]'
                : 'bg-transparent text-[#665C4D] border-transparent hover:bg-[#DCD2BB]'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-blue-600" />
            <span>የግል AI አስተማሪ (Ask AI Tutor)</span>
            {messages.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center font-bold">
                {messages.length}
              </span>
            )}
          </button>
          <button
            onClick={() => {
              setActiveMode('research');
              if (!researchResult) fetchResearch();
            }}
            className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold border-t-[1.5px] border-l-[1.5px] border-r-[1.5px] rounded-t-lg transition-all ${
              activeMode === 'research'
                ? 'bg-[#FAF6EC] text-[#1E1B18] border-[#38332D] shadow-xs -mb-[1px]'
                : 'bg-transparent text-[#665C4D] border-transparent hover:bg-[#DCD2BB]'
            }`}
          >
            <Library className="w-4 h-4 text-emerald-700" />
            <span>የምርምርና ማስረጃ ትንታኔ (Multi-Source Research)</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {activeMode === 'analysis' ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-[#F4EDE0] p-3 rounded-lg border border-[#38332D]">
                <div className="flex items-center gap-2 text-xs font-bold text-[#5A5143]">
                  <BookOpen className="w-4 h-4 text-emerald-700" />
                  <span>የኢ.ፌ.ዲ.ሪ ስርዓተ-ትምህርት ጥልቅ ትንታኔ፣ የፈተና ጥያቄዎችና አቋራጭ መንገዶች</span>
                </div>
                <button
                  onClick={fetchAnalysis}
                  disabled={isAnalyzing}
                  className="flex items-center gap-1 text-xs font-bold text-[#1E1B18] hover:text-amber-800 bg-[#FAF6EC] px-2.5 py-1 rounded border border-[#38332D] disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
                  <span>እንደገና አፍልቅ</span>
                </button>
              </div>

              {isAnalyzing ? (
                <div className="py-16 flex flex-col items-center justify-center gap-3 text-center">
                  <div className="w-12 h-12 rounded-full border-4 border-[#38332D] border-t-amber-600 animate-spin flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-amber-600" />
                  </div>
                  <p className="text-sm font-bold text-[#1E1B18] font-serif-ethiopic">
                    Gemini 3.7 የምዕራፉን ይዘትና የፈተና ማጠቃለያ በማዘጋጀት ላይ ነው...
                  </p>
                  <p className="text-xs text-[#665C4D]">
                    የኢትዮጵያ ሁለተኛ ደረጃ ስርዓተ-ትምህርት መመዘኛዎችን በማመሳከር ላይ
                  </p>
                </div>
              ) : analysisError ? (
                <div className="p-4 rounded-lg bg-rose-50 border border-rose-300 text-rose-800 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-600" />
                  <div>
                    <h4 className="text-sm font-bold">የትንታኔ ስህተት አጋጥሟል</h4>
                    <p className="text-xs mt-1">{analysisError}</p>
                    <button
                      onClick={fetchAnalysis}
                      className="mt-2 text-xs font-bold px-3 py-1 bg-rose-600 text-white rounded hover:bg-rose-700"
                    >
                      እንደገና ሞክር
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-[#FAF6EC] border border-[#38332D] rounded-xl p-5 sm:p-6 shadow-xs leading-relaxed text-[#1E1B18] text-sm sm:text-base font-serif-ethiopic whitespace-pre-wrap">
                  {analysis}
                </div>
              )}
            </div>
          ) : activeMode === 'research' ? (
            <div className="space-y-4">
              {/* Header Bar */}
              <div className="flex items-center justify-between bg-[#F4EDE0] p-3 rounded-lg border border-[#38332D]">
                <div className="flex items-center gap-2 text-xs font-bold text-[#5A5143]">
                  <Library className="w-4 h-4 text-emerald-700" />
                  <span>ባለ 6-ደረጃ የኢትዮጵያ ስርዓተ-ትምህርትና የአካዳሚክ ማስረጃ ትንታኔ (Multi-Source Synthesis)</span>
                </div>
                <button
                  onClick={fetchResearch}
                  disabled={isResearchLoading}
                  className="flex items-center gap-1 text-xs font-bold text-[#1E1B18] hover:text-emerald-800 bg-[#FAF6EC] px-2.5 py-1 rounded border border-[#38332D] disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isResearchLoading ? 'animate-spin' : ''}`} />
                  <span>እንደገና መርምር</span>
                </button>
              </div>

              {isResearchLoading ? (
                <div className="py-16 flex flex-col items-center justify-center gap-3 text-center">
                  <div className="w-12 h-12 rounded-full border-4 border-[#38332D] border-t-emerald-600 animate-spin flex items-center justify-center">
                    <Library className="w-5 h-5 text-emerald-600" />
                  </div>
                  <p className="text-sm font-bold text-[#1E1B18] font-serif-ethiopic">
                    የኢትዮጵያ ስርዓተ-ትምህርት መጻሕፍትን እና ዓለም አቀፍ አካዳሚክ ምንጮችን በማመሳከር ላይ...
                  </p>
                  <p className="text-xs text-[#665C4D]">
                    የምንጮች ደረጃ 1 እስከ 6 ማረጋገጫና የተጨባጭ ምሳሌዎች ትንተና
                  </p>
                </div>
              ) : researchError ? (
                <div className="p-4 rounded-lg bg-rose-50 border border-rose-300 text-rose-800 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-600" />
                  <div>
                    <h4 className="text-sm font-bold">የምርምር ትንታኔ ስህተት አጋጥሟል</h4>
                    <p className="text-xs mt-1">{researchError}</p>
                    <button
                      onClick={fetchResearch}
                      className="mt-2 text-xs font-bold px-3 py-1 bg-rose-600 text-white rounded hover:bg-rose-700"
                    >
                      እንደገና ሞክር
                    </button>
                  </div>
                </div>
              ) : researchResult ? (
                <div className="space-y-4 font-serif-ethiopic">
                  {/* Definition & Core Breakdown */}
                  <div className="bg-[#FAF6EC] border border-[#38332D] rounded-xl p-4 sm:p-5 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-800 uppercase tracking-wider">
                      <Lightbulb className="w-4 h-4" />
                      <span>1. የፅንሰ-ሀሳቡ ፍሬ ነገርና ትርጓሜ (Core Definition)</span>
                    </div>
                    <p className="text-sm sm:text-base text-[#1E1B18] leading-relaxed">
                      {researchResult.definition}
                    </p>
                  </div>

                  {/* Level 1: Ethiopian Curriculum Primary Explanation */}
                  <div className="bg-emerald-50/70 border-2 border-emerald-600/60 rounded-xl p-4 sm:p-5 space-y-2">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <span className="flex items-center gap-2 text-xs font-bold text-emerald-950">
                        <ShieldCheck className="w-4 h-4 text-emerald-700" />
                        <span>ደረጃ 1፡ በኢትዮጵያ ስርዓተ-ትምህርት መሠረት (Ethiopian MoE Curriculum)</span>
                      </span>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-200 text-emerald-900 border border-emerald-400">
                        ክፍል {grade} ይፋዊ መማሪያ መጽሐፍ
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-emerald-950 leading-relaxed">
                      {researchResult.curriculumExplanation}
                    </p>
                  </div>

                  {/* Level 2-4: Advanced Academic Explanation */}
                  <div className="bg-blue-50/60 border border-blue-300 rounded-xl p-4 sm:p-5 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-blue-950">
                      <GraduationCap className="w-4 h-4 text-blue-700" />
                      <span>ደረጃ 2–4፡ ጥልቅ አካዳሚክና ዩኒቨርሲቲ-ደረጃ ማብራሪያ (Advanced Academic Insight)</span>
                    </div>
                    <p className="text-xs sm:text-sm text-blue-950 leading-relaxed">
                      {researchResult.deeperExplanation}
                    </p>
                  </div>

                  {/* Ethiopian Real-World Application */}
                  {researchResult.realWorldApplication && (
                    <div className="bg-amber-50/60 border border-amber-300 rounded-xl p-4 sm:p-5 space-y-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-amber-950">
                        <Globe className="w-4 h-4 text-amber-700" />
                        <span>በኢትዮጵያ ነባራዊ ሁኔታ ተግባራዊ መገለጫ (Ethiopian Context & Real-World Application)</span>
                      </div>
                      <p className="text-xs sm:text-sm text-amber-950 leading-relaxed">
                        {researchResult.realWorldApplication}
                      </p>
                    </div>
                  )}

                  {/* Concrete Examples */}
                  {researchResult.examples && researchResult.examples.length > 0 && (
                    <div className="bg-[#FAF6EC] border border-[#38332D] rounded-xl p-4 sm:p-5 space-y-3">
                      <div className="flex items-center gap-2 text-xs font-bold text-[#1E1B18]">
                        <BookOpen className="w-4 h-4 text-emerald-700" />
                        <span>ተግባራዊ ምሳሌዎችና የደረጃ በደረጃ ስሌት (Worked Examples)</span>
                      </div>
                      <div className="space-y-2.5">
                        {researchResult.examples.map((ex, idx) => (
                          <div key={`modal-ex-${idx}-${ex.title || ''}`} className="p-3 bg-[#F4EDE0] rounded-lg border border-[#D5C9AC] space-y-1 text-xs">
                            <div className="font-bold text-[#1E1B18]">{ex.title}</div>
                            <div className="text-[#5A5143] italic">{ex.scenarioOrProblem}</div>
                            <div className="text-[#1E1B18] whitespace-pre-wrap pt-1 border-t border-[#D5C9AC]/60">
                              {ex.detailedWalkthrough}
                            </div>
                            {ex.sourceCitation && (
                              <div className="text-[10px] text-emerald-800 font-mono pt-1">
                                📎 {ex.sourceCitation}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Verified Citations List with Priority Badges */}
                  {researchResult.citations && researchResult.citations.length > 0 && (
                    <div className="bg-[#FAF6EC] border border-[#38332D] rounded-xl p-4 sm:p-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2 text-xs font-bold text-[#1E1B18]">
                          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                          <span>የተረጋገጡ የጥናት ምንጮችና ማጣቀሻዎች ({researchResult.citations.length} Citations)</span>
                        </span>
                        <span className="text-[10px] text-[#786D5B] font-mono">
                          Source Hierarchy Tier 1–6
                        </span>
                      </div>
                      <div className="space-y-2">
                        {researchResult.citations.map((cit, idx) => (
                          <div key={cit.citationId ? `modal-cit-${cit.citationId}` : `modal-cit-${idx}-${cit.sourceTitle || ''}`} className="p-3 bg-[#F4EDE0] rounded-lg border border-[#D5C9AC] space-y-1.5 text-xs">
                            <div className="flex items-center justify-between flex-wrap gap-2">
                              <span className="font-bold text-[#1E1B18]">{cit.sourceTitle}</span>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                                SOURCE_PRIORITY_LABELS[cit.priorityLevel]?.badgeColor || 'bg-stone-100 text-stone-800'
                              }`}>
                                {SOURCE_PRIORITY_LABELS[cit.priorityLevel]?.am || `ደረጃ ${cit.priorityLevel}`}
                              </span>
                            </div>
                            <div className="text-[11px] text-[#5A5143] flex flex-wrap gap-3">
                              <span>ደራሲ/ተቋም፡ {cit.author}</span>
                              {cit.year && <span>ዓመት፡ {cit.year}</span>}
                              {cit.pageNumber && <span>ገጽ፡ {cit.pageNumber}</span>}
                            </div>
                            <p className="text-[11px] text-[#1E1B18] bg-[#FAF6EC] p-2 rounded border border-[#D5C9AC]/50 italic">
                              "{cit.exactSnippetOrSummary}"
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recommended Reference Books */}
                  {researchResult.recommendedBooks && researchResult.recommendedBooks.length > 0 && (
                    <div className="bg-[#FAF6EC] border border-[#38332D] rounded-xl p-4 sm:p-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2 text-xs font-bold text-[#1E1B18]">
                          <Library className="w-4 h-4 text-emerald-700" />
                          <span>የተመከሩ የአጋዥና የማመሳከሪያ መጻሕፍት (Recommended Reference Books)</span>
                        </span>
                        <span className="text-[10px] text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                          {researchResult.recommendedBooks.length} Books
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {researchResult.recommendedBooks.map((book, idx) => (
                          <div key={book.sourceId ? `modal-book-${book.sourceId}` : `modal-book-${idx}-${book.title || ''}`} className="p-3 bg-[#F4EDE0] rounded-lg border border-[#D5C9AC] space-y-1 text-xs">
                            <div className="font-bold text-[#1E1B18] line-clamp-1">{book.title}</div>
                            <div className="text-[11px] text-[#5A5143]">ደራሲ/አሳታሚ፡ {book.author} ({book.year})</div>
                            <div className="text-[10px] text-emerald-800 font-medium">
                              {SOURCE_TYPE_LABELS[book.sourceType]?.am || book.sourceType} • ታማኝነት፡ {book.academicCredibility}%
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          ) : (
            <div className="flex flex-col h-[52vh] sm:h-[55vh]">
              {/* Chat messages list */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                {messages.length === 0 && (
                  <div className="py-8 text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-blue-100 border border-blue-300 text-blue-700 mx-auto flex items-center justify-center">
                      <Bot className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-[#1E1B18] font-serif-ethiopic">
                      እንኳን ወደ {subject.name} AI የግል አስተማሪ በደህና መጡ!
                    </h3>
                    <p className="text-xs text-[#665C4D] max-w-md mx-auto font-serif-ethiopic">
                      ስለዚህ ምዕራፍ ያልገባዎትን ቀመር፣ ፅንሰ-ሀሳብ ወይም የፈተና ጥያቄ ይጠይቁ። በአማርኛ፣ በኦሮምኛ፣ በትግርኛ ወይም በእንግሊዝኛ ማብራሪያ ያገኛሉ።
                    </p>
                    <div className="flex flex-wrap justify-center gap-2 pt-2">
                      {[
                        'የዚህን ምዕራፍ ዋና ዋና ቀመሮች ዘርዝርልኝ?',
                        'በፈተና ላይ በተደጋጋሚ የሚወጡ ጥያቄዎች ምንድን ናቸው?',
                        'ይህንን ፅንሰ-ሀሳብ በቀላል ምሳሌ አስረዳኝ?',
                      ].map((prompt, idx) => (
                        <button
                          key={`modal-prompt-${idx}-${prompt.slice(0, 10)}`}
                          onClick={() => {
                            setInputMessage(prompt);
                          }}
                          className="text-xs bg-[#EDE6D4] hover:bg-[#E3DAC4] border border-[#38332D] text-[#1E1B18] px-3 py-1.5 rounded-full font-serif-ethiopic text-left"
                        >
                          💡 {prompt}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {messages.map((msg, index) => (
                  <div
                    key={`modal-chat-${msg.role}-${index}-${msg.timestamp ? msg.timestamp.getTime() : ''}`}
                    className={`flex items-start gap-2.5 ${
                      msg.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {msg.role === 'assistant' && (
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 border border-[#38332D] shadow-2xs"
                        style={{ backgroundColor: subject.accentColor, color: '#FFFFFF' }}
                      >
                        <Bot className="w-4 h-4" />
                      </div>
                    )}
                    <div
                      className={`max-w-[82%] rounded-2xl p-3.5 sm:p-4 text-xs sm:text-sm leading-relaxed border ${
                        msg.role === 'user'
                          ? 'bg-[#1E1B18] text-[#FAF6EC] border-[#1E1B18] rounded-tr-none'
                          : 'bg-[#FAF6EC] text-[#1E1B18] border-[#38332D] rounded-tl-none font-serif-ethiopic whitespace-pre-wrap shadow-xs'
                      }`}
                    >
                      {msg.content}
                      <span className="block text-[10px] opacity-60 mt-1.5 text-right">
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))}

                {isChatLoading && (
                  <div className="flex items-start gap-2.5">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 border border-[#38332D]"
                      style={{ backgroundColor: subject.accentColor, color: '#FFFFFF' }}
                    >
                      <Bot className="w-4 h-4" />
                    </div>
                    <div className="bg-[#FAF6EC] border border-[#38332D] rounded-2xl rounded-tl-none p-3 flex items-center gap-2 text-xs text-[#5A5143]">
                      <Loader2 className="w-4 h-4 animate-spin text-amber-600" />
                      <span className="font-serif-ethiopic">AI መልሱን በማዘጋጀት ላይ ነው...</span>
                    </div>
                  </div>
                )}
                <div ref={chatBottomRef} />
              </div>

              {/* Quick Diagnostic Study Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-2 pb-1">
                {relevantWeakArea && (
                  <button
                    type="button"
                    onClick={() =>
                      handleSendMessage(
                        undefined,
                        `በ${relevantWeakArea.topicTitle || chapterTitle} ላይ የከበደኝን ፅንሰ-ሀሳብ (${relevantWeakArea.missingConcept || 'ቀመሩን'}) በቀላል ምሳሌ አብራራልኝ።`
                      )
                    }
                    className="text-[11px] px-2.5 py-1 rounded-full bg-rose-100 text-rose-900 border border-rose-300 hover:bg-rose-200 transition-colors font-serif-ethiopic whitespace-nowrap flex items-center gap-1 shrink-0"
                  >
                    <Sparkles className="w-3 h-3 text-rose-600" />
                    <span>🎯 የደካማ ርዕሴን ክፍተት አብራራልኝ</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() =>
                    handleSendMessage(
                      undefined,
                      `የዚህን ምዕራፍ ዋና ቀመር ወይም ህግ በደረጃ በደረጃ ስሌትና ምሳሌ አብራራልኝ።`
                    )
                  }
                  className="text-[11px] px-2.5 py-1 rounded-full bg-[#EDE6D4] text-[#1E1B18] border border-[#38332D]/40 hover:bg-[#E3DAC4] transition-colors font-serif-ethiopic whitespace-nowrap flex items-center gap-1 shrink-0"
                >
                  <Lightbulb className="w-3 h-3 text-amber-600" />
                  <span>💡 ደረጃ በደረጃ ምሳሌ ስራኝ</span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleSendMessage(
                      undefined,
                      `ለዚህ ምዕራፍ የሚሆን የብቃት መመዘኛ 1 የፈተና ጥያቄ ጠይቀኝና መልሴን ገምግምልኝ።`
                    )
                  }
                  className="text-[11px] px-2.5 py-1 rounded-full bg-[#EDE6D4] text-[#1E1B18] border border-[#38332D]/40 hover:bg-[#E3DAC4] transition-colors font-serif-ethiopic whitespace-nowrap flex items-center gap-1 shrink-0"
                >
                  <MessageSquare className="w-3 h-3 text-indigo-600" />
                  <span>📝 የፈተና ጥያቄ ጠይቀኝ</span>
                </button>
              </div>

              {/* Chat Input Field */}
              <form onSubmit={handleSendMessage} className="mt-1 flex gap-2 pt-2 border-t border-[#38332D]">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder={t.askAiPrompt || 'ስለዚህ ምዕራፍ ጥያቄዎን እዚህ ይጻፉ...'}
                  disabled={isChatLoading}
                  className="flex-1 bg-[#FAF6EC] border-[1.5px] border-[#38332D] rounded-xl px-4 py-2.5 text-xs sm:text-sm font-serif-ethiopic focus:outline-none focus:ring-2 focus:ring-amber-500 text-[#1E1B18] placeholder-[#8A7E6C]"
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim() || isChatLoading}
                  className="px-4 py-2.5 rounded-xl bg-[#1E1B18] text-[#FAF6EC] hover:bg-[#38332D] disabled:opacity-40 font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span className="hidden sm:inline">ላክ</span>
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-[#EDE6D4] px-4 sm:px-6 py-2.5 border-t-[1.5px] border-[#38332D] flex items-center justify-between text-xs text-[#665C4D]">
          <div className="flex items-center gap-1.5">
            <Lightbulb className="w-3.5 h-3.5 text-amber-700" />
            <span className="font-serif-ethiopic">በኢትዮጵያ የትምህርት ሚኒስቴር ስርዓተ-ትምህርት ላይ የተመሰረተ</span>
          </div>
          <button
            onClick={onClose}
            className="font-bold text-[#1E1B18] hover:underline cursor-pointer"
          >
            ዝጋ
          </button>
        </div>
      </div>
    </div>
  );
};
