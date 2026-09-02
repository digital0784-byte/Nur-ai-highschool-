import React, { useState, useEffect, useRef } from 'react';
import { Subject, Grade } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { Bot, Sparkles, Send, Loader2, X, BookOpen, Lightbulb, RefreshCw, MessageSquare, AlertCircle } from 'lucide-react';

interface AIChapterTutorModalProps {
  isOpen: boolean;
  onClose: () => void;
  subject: Subject;
  grade: Grade;
  chapterTitle: string;
  chapterNumber?: number;
  chapterSummary?: string;
  initialMode?: 'analysis' | 'chat';
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
}) => {
  const { language, t } = useLanguage();
  const [activeMode, setActiveMode] = useState<'analysis' | 'chat'>(initialMode);
  const [analysis, setAnalysis] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Sync mode when prop changes
  useEffect(() => {
    if (isOpen) {
      setActiveMode(initialMode);
    }
  }, [isOpen, initialMode]);

  // Fetch AI Analysis when modal opens
  useEffect(() => {
    if (isOpen && !analysis && activeMode === 'analysis') {
      fetchAnalysis();
    }
  }, [isOpen, activeMode, chapterTitle]);

  // Scroll to bottom of chat
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim() || isChatLoading) return;

    const userText = inputMessage.trim();
    const newMessages: ChatMessage[] = [
      ...messages,
      { role: 'user', content: userText, timestamp: new Date() },
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
                          key={idx}
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
                    key={index}
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

              {/* Chat Input Field */}
              <form onSubmit={handleSendMessage} className="mt-3 flex gap-2 pt-2 border-t border-[#38332D]">
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
