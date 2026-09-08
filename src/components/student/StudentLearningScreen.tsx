import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  BookOpen,
  Sparkles,
  MessageSquare,
  HelpCircle,
  FileCheck2,
  ListOrdered,
  CheckCircle,
  Check,
  Send,
  Loader2,
  Layers,
  ChevronRight,
  BookMarked,
  Lightbulb,
  Award,
  AlertCircle,
  Clock,
  Compass,
  Zap,
} from 'lucide-react';
import {
  CurriculumTopic,
  CurriculumUnit,
  CurriculumLesson,
  GradeLevel,
} from '../../types/curriculumEngine';
import { LanguageCode } from '../../types';
import { LearningPageSection, StudentTopicMastery, StudentRecommendationItem } from '../../types/studentApp';
import { studentAppFirestore } from '../../services/studentAppFirestore';
import { aiTutorEngine } from '../../engine/aiTutorEngine';

interface StudentLearningScreenProps {
  topic: CurriculumTopic;
  unit: CurriculumUnit;
  lesson: CurriculumLesson;
  grade: GradeLevel;
  subjectId: string;
  subjectName: string;
  language: LanguageCode;
  darkMode: boolean;
  lowDataMode: boolean;
  onBack: () => void;
  onNavigateToTopic?: (topicId: string) => void;
}

export const StudentLearningScreen: React.FC<StudentLearningScreenProps> = ({
  topic,
  unit,
  lesson,
  grade,
  subjectId,
  subjectName,
  language,
  darkMode,
  lowDataMode,
  onBack,
  onNavigateToTopic,
}) => {
  const [activeSection, setActiveSection] = useState<LearningPageSection>('read');
  const [mastery, setMastery] = useState<StudentTopicMastery | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [recommendations, setRecommendations] = useState<StudentRecommendationItem[]>([]);

  // Time tracking
  const startTimeRef = useRef<number>(Date.now());

  // AI Explain State
  const [aiExplainText, setAiExplainText] = useState<string>('');
  const [isExplaining, setIsExplaining] = useState<boolean>(false);

  // Ask AI Tutor Chat State
  const [chatMessages, setChatMessages] = useState<
    { sender: 'user' | 'ai'; text: string; citation?: string }[]
  >([
    {
      sender: 'ai',
      text: `ሰላም! እኔ የኑር AI የግል አስተማሪህ ነኝ። ስለ "${topic.title[language] || topic.title.en}" ማንኛውንም ጥያቄ ጠይቀኝ፤ ከመማሪያ መጽሐፍህ ገጽ ${topic.textbookPage} በመነሳት በግልፅ አብራራልሃለሁ።`,
      citation: `${subjectName} Grade ${grade} • Unit ${unit.unitNumber} • Page ${topic.textbookPage}`,
    },
  ]);
  const [chatInput, setChatInput] = useState<string>('');
  const [isChatSending, setIsChatSending] = useState<boolean>(false);

  // Practice & Hints State
  const [selectedPracticeIndex, setSelectedPracticeIndex] = useState<number>(0);
  const [revealedHints, setRevealedHints] = useState<Record<number, number>>({}); // probIndex -> hintLevel

  // Quiz State
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);

  useEffect(() => {
    startTimeRef.current = Date.now();
    loadTopicMastery();

    // Default auto-load AI explain if empty
    if (!aiExplainText) {
      handleRequestAIExplain();
    }
  }, [topic.id]);

  const loadTopicMastery = async () => {
    const data = await studentAppFirestore.getTopicMastery(topic.id);
    if (data) {
      setMastery(data);
      setIsCompleted(data.completed);
    } else {
      setIsCompleted(false);
    }
  };

  const handleRequestAIExplain = async () => {
    setIsExplaining(true);
    try {
      const res = await aiTutorEngine.executeTutorAction({
        feature: 'explain_topic',
        topicTitle: topic.title[language] || topic.title.en,
        grade,
        subjectId,
        subjectName,
        language,
        mode: 'guided',
      });
      setAiExplainText(res.text);
    } catch (e) {
      // Fallback to textbook overview
      setAiExplainText(
        topic.explanations.overview +
          '\n\nዋና ዋና ፅንሰ-ሀሳቦች፡\n' +
          topic.explanations.coreConcepts.map((c, i) => `${i + 1}. ${c}`).join('\n')
      );
    } finally {
      setIsExplaining(false);
    }
  };

  const handleSendChatMessage = async () => {
    if (!chatInput.trim() || isChatSending) return;
    const userText = chatInput.trim();
    setChatInput('');
    setChatMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setIsChatSending(true);

    try {
      const res = await aiTutorEngine.executeTutorAction({
        feature: 'ask_question',
        userQuery: userText,
        topicTitle: topic.title[language] || topic.title.en,
        grade,
        subjectId,
        subjectName,
        language,
        mode: 'guided',
      });

      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: res.text,
          citation: res.citations?.[0]
            ? `${res.citations[0].subject} Grade ${res.citations[0].grade} • Unit ${res.citations[0].unit} • Page ${res.citations[0].textbookPage}`
            : undefined,
        },
      ]);
    } catch (e) {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: `ጥያቄህን በሚመለከት በመማሪያ መጽሐፍህ ገጽ ${topic.textbookPage} ላይ የተገለጸው ዋና ነጥብ፡ ${topic.explanations.coreConcepts[0] || topic.explanations.overview}`,
          citation: `${subjectName} Grade ${grade} • Page ${topic.textbookPage}`,
        },
      ]);
    } finally {
      setIsChatSending(false);
    }
  };

  const handleRevealNextHint = (probIdx: number) => {
    const current = revealedHints[probIdx] || 0;
    setRevealedHints({ ...revealedHints, [probIdx]: Math.min(3, current + 1) });
  };

  // 3 Practice Questions generated from topic exercises
  const sampleProblems = topic.exercises[0]?.problems || [
    {
      questionNumber: '1',
      text: `${topic.title.en} በሚመለከት ዋናውን ቀመር ወይም ፅንሰ-ሀሳብ በመጠቀም ጥያቄውን ስራ።`,
      hint: 'የመማሪያ መጽሐፍ ገጽ ' + topic.textbookPage + ' ላይ የተመለከተውን ምሳሌ መመልከት ትችላለህ።',
      answer: 'ትክክለኛው መፍትሄ በመማሪያ መጽሐፉ ውስጥ በዝርዝር ቀርቧል።',
    },
  ];

  // 3 Curricular Quiz Items
  const sampleQuizQuestions = [
    {
      id: 1,
      question: `ስለ "${topic.title[language] || topic.title.en}" ትክክለኛ የሆነው ፅንሰ-ሀሳብ የትኛው ነው?`,
      options: [
        topic.explanations.coreConcepts[0] || 'መሰረታዊ የስርዓተ-ትምህርት ህግ',
        'ከተጠቀሰው ርዕስ ጋር የማይገናኝ ሀሳብ',
        'የቀመር ስሌቱ ተቃራኒ ውጤት',
        'ምንም መልስ አልተገኘም',
      ],
      correctIndex: 0,
      explanation: `በመማሪያ መጽሐፍ ገጽ ${topic.textbookPage} መሰረት ትክክለኛው ፅንሰ-ሀሳብ ተገልጿል።`,
      page: topic.textbookPage,
    },
    {
      id: 2,
      question: `በዚህ ርዕስ ላይ የተማርነው ቁልፍ ዓላማ የትኛው ነው?`,
      options: [
        'ፅንሰ-ሀሳቡን መረዳትና በምሳሌዎች መተግበር',
        'ያለ ምንም ስሌት ማስታወስ ብቻ',
        'ከኢትዮጵያ ስርዓተ-ትምህርት ውጭ ያሉ ርዕሶችን ማጥናት',
        'ጥያቄዎችን አለመመለስ',
      ],
      correctIndex: 0,
      explanation: `የኢትዮጵያ አዲሱ ስርዓተ-ትምህርት የተግባር ክህሎትን ያጎላል።`,
      page: topic.textbookPage,
    },
  ];

  const handleSubmitQuiz = async () => {
    let correct = 0;
    sampleQuizQuestions.forEach((q, idx) => {
      if (quizAnswers[idx] === q.correctIndex) {
        correct += 1;
      }
    });

    const total = sampleQuizQuestions.length;
    const timeSpentSeconds = Math.max(15, Math.round((Date.now() - startTimeRef.current) / 1000));
    setQuizScore(Math.round((correct / total) * 100));
    setQuizSubmitted(true);

    // Save quiz result & update adaptive mastery
    const result = await studentAppFirestore.recordQuizResult(
      topic.id,
      topic.title[language] || topic.title.en,
      subjectId,
      grade,
      correct,
      total,
      timeSpentSeconds
    );
    setMastery(result.mastery);
    setRecommendations(result.recommendations);
  };

  const handleMarkAsComplete = async () => {
    const timeSpentSeconds = Math.max(20, Math.round((Date.now() - startTimeRef.current) / 1000));
    const updated = await studentAppFirestore.recordLearningProgress(
      topic.id,
      topic.title[language] || topic.title.en,
      subjectId,
      grade,
      timeSpentSeconds,
      true
    );
    setMastery(updated);
    setIsCompleted(true);
  };

  const bgCard = darkMode ? 'bg-[#211F26] border-[#36343B]' : 'bg-white border-[#E6E0E9]';
  const textPrimary = darkMode ? 'text-[#E6E1E5]' : 'text-[#1D1B20]';
  const textSecondary = darkMode ? 'text-[#CAC4D0]' : 'text-[#49454F]';

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Bar: Navigation & Topic Identity */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E6E0E9] dark:border-[#36343B]">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className={`p-2 rounded-full border transition-all cursor-pointer ${
              darkMode ? 'bg-[#2B2930] border-[#49454F] text-[#E6E1E5]' : 'bg-[#ECE6F0] border-[#CAC4D0] text-[#1D1B20]'
            } hover:opacity-80`}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase text-[#6750A4] dark:text-[#D0BCFF]">
                {subjectName} ክፍል {grade} • ምዕራፍ {unit.unitNumber}
              </span>
              <span className="text-[10px] text-gray-500 font-bold">
                መጽሐፍ ገጽ {topic.textbookPage}
              </span>
            </div>
            <h1 className={`text-xl sm:text-2xl font-black ${textPrimary}`}>
              {topic.title[language] || topic.title.en}
            </h1>
          </div>
        </div>

        {/* 8. Action: Mark as Complete / Status */}
        <div className="flex items-center gap-2">
          {isCompleted ? (
            <div className="px-4 py-2 rounded-full text-xs font-black bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>ተጠናቋል (Mastered)</span>
            </div>
          ) : (
            <button
              onClick={handleMarkAsComplete}
              className="px-4 py-2 rounded-full text-xs font-black bg-emerald-600 text-white hover:bg-emerald-700 transition-all flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
            >
              <CheckCircle className="w-4 h-4" />
              <span>8. እንደተጠናቀቀ ምልክት አድርግ</span>
            </button>
          )}
        </div>
      </div>

      {/* The 8 Core Action Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#E6E0E9] dark:border-[#36343B]">
        {[
          { id: 'read', label: '1. ትምህርቱን አንብብ (Read)', icon: BookOpen },
          { id: 'ai_explain', label: '2. AI ማብራሪያ (AI Explain)', icon: Sparkles },
          { id: 'ask_tutor', label: '3. ጠይቅ (Ask AI Tutor)', icon: MessageSquare },
          { id: 'examples', label: `4. ምሳሌዎች (${topic.examples.length})`, icon: ListOrdered },
          { id: 'practice', label: '5. ልምምድ (Practice)', icon: HelpCircle },
          { id: 'quiz', label: '6. ፈተና (Quiz)', icon: Award },
          { id: 'review', label: '7. ክለሳ (Review)', icon: Layers },
        ].map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id as LearningPageSection)}
              className={`px-4 py-2 rounded-full text-xs font-black whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                isActive
                  ? 'bg-[#6750A4] text-white shadow-xs'
                  : darkMode
                  ? 'bg-[#2B2930] text-[#CAC4D0] hover:text-white'
                  : 'bg-[#ECE6F0] text-[#49454F] hover:text-[#1D1B20]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. Read Lesson Content */}
      {activeSection === 'read' && (
        <div className={`rounded-3xl p-6 sm:p-8 border-[1.5px] shadow-xs space-y-6 ${bgCard}`}>
          <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-800">
            <div>
              <span className="text-xs font-black uppercase text-[#6750A4] dark:text-[#D0BCFF]">
                {lesson.lessonNumber}: {lesson.title[language] || lesson.title.en}
              </span>
              <h2 className={`text-xl font-bold ${textPrimary}`}>
                {topic.title[language] || topic.title.en}
              </h2>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#EADDFF] text-[#21005D] dark:bg-[#4F378B] dark:text-[#EADDFF]">
              የመማሪያ መጽሐፍ ገጽ {topic.textbookPage}
            </span>
          </div>

          <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm leading-relaxed space-y-4">
            <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-[#2B2930] border-[#49454F]' : 'bg-[#F7F2FA] border-[#EADDFF]'}`}>
              <h3 className="text-xs font-black uppercase text-[#6750A4] mb-1">ዋና ማጠቃለያ</h3>
              <p className={textPrimary}>{topic.explanations.overview}</p>
            </div>

            <div className="space-y-2">
              <h3 className={`text-sm font-black ${textPrimary}`}>ቁልፍ ፅንሰ-ሀሳቦች (Core Concepts)</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {topic.explanations.coreConcepts.map((concept, i) => (
                  <div
                    key={i}
                    className={`p-4 rounded-2xl border flex items-start gap-3 ${
                      darkMode ? 'bg-[#2B2930] border-[#49454F]' : 'bg-white border-[#E6E0E9]'
                    }`}
                  >
                    <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-900 dark:bg-purple-900/60 dark:text-purple-200 flex items-center justify-center text-xs font-black flex-shrink-0">
                      {i + 1}
                    </span>
                    <p className={`text-xs ${textPrimary}`}>{concept}</p>
                  </div>
                ))}
              </div>
            </div>

            {topic.learningOutcomes[0] && (
              <div className="p-4 rounded-2xl border border-emerald-300 bg-emerald-50 dark:bg-emerald-950/30 text-xs">
                <span className="text-emerald-800 dark:text-emerald-300 font-bold block mb-1">
                  የሚጠበቅ የትምህርት ውጤት (Expected Outcome):
                </span>
                <p className="text-gray-800 dark:text-gray-200 font-medium">
                  {topic.learningOutcomes[0].description[language] || topic.learningOutcomes[0].description.en}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. AI Explain */}
      {activeSection === 'ai_explain' && (
        <div className={`rounded-3xl p-6 sm:p-8 border-[1.5px] shadow-xs space-y-5 ${bgCard}`}>
          <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#6750A4]" />
              <h2 className={`text-base sm:text-lg font-black ${textPrimary}`}>
                የኑር AI ዝርዝር ማብራሪያ (RAG Grounded Explanation)
              </h2>
            </div>
            <button
              onClick={handleRequestAIExplain}
              disabled={isExplaining}
              className="px-3 py-1.5 rounded-full text-xs font-bold bg-[#6750A4] text-white hover:bg-[#523e85] transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isExplaining ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
              <span>እንደገና አብራራ</span>
            </button>
          </div>

          {isExplaining ? (
            <div className="py-12 text-center space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-[#6750A4] mx-auto" />
              <p className="text-xs text-gray-500 font-medium">
                የኢትዮጵያ አዲሱን የመማሪያ መጽሐፍ ገጽ {topic.textbookPage} በመፈተሽ ላይ...
              </p>
            </div>
          ) : (
            <div className="p-5 rounded-2xl bg-gray-50 dark:bg-[#1D1B20] border border-gray-200 dark:border-gray-800 text-xs sm:text-sm leading-relaxed whitespace-pre-line text-gray-800 dark:text-gray-200">
              {aiExplainText || 'ማብራሪያውን ለመጫን "እንደገና አብራራ" የሚለውን ይጫኑ።'}
            </div>
          )}

          <div className="p-3.5 rounded-xl border border-indigo-200 bg-indigo-50/50 dark:bg-indigo-950/20 text-xs flex items-center gap-2 text-indigo-800 dark:text-indigo-300">
            <BookMarked className="w-4 h-4 flex-shrink-0" />
            <span>
              ይህ ማብራሪያ በቀጥታ በኢትዮጵያ ትምህርት ሚኒስቴር አዲሱ ስርዓተ-ትምህርት (ገጽ {topic.textbookPage}) ላይ የተመሰረተ ነው።
            </span>
          </div>
        </div>
      )}

      {/* 3. Ask AI Tutor Chat */}
      {activeSection === 'ask_tutor' && (
        <div className={`rounded-3xl p-5 sm:p-6 border-[1.5px] shadow-xs space-y-4 ${bgCard}`}>
          <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-[#6750A4]" />
              <h2 className={`text-base font-black ${textPrimary}`}>
                የግል AI አስተማሪ (Personal Socratic Tutor)
              </h2>
            </div>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-200">
              መስመር ላይ (Active)
            </span>
          </div>

          {/* Chat Stream */}
          <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
            {chatMessages.map((msg, i) => (
              <div
                key={i}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[75%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-[#6750A4] text-white rounded-tr-xs'
                      : darkMode
                      ? 'bg-[#2B2930] text-[#E6E1E5] border border-[#49454F] rounded-tl-xs'
                      : 'bg-gray-100 text-[#1D1B20] border border-gray-200 rounded-tl-xs'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                  {msg.citation && (
                    <div className="mt-2 pt-1.5 border-t border-black/10 dark:border-white/10 text-[10px] opacity-80 flex items-center gap-1 font-mono">
                      <BookMarked className="w-3 h-3" />
                      <span>{msg.citation}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isChatSending && (
              <div className="flex items-center gap-2 text-xs text-gray-500 py-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#6750A4]" />
                <span>አስተማሪው በመጽሐፉ ላይ በመመስረት እየመለሰ ነው...</span>
              </div>
            )}
          </div>

          {/* Input Bar */}
          <div className="pt-2 flex items-center gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendChatMessage()}
              placeholder="ስለዚህ ርዕስ ማንኛውንም ነገር ጠይቅ (ለምሳሌ፡ ቀመሩን በምሳሌ አስረዳኝ)..."
              className={`flex-1 px-4 py-2.5 rounded-full border text-xs sm:text-sm outline-none transition-all ${
                darkMode
                  ? 'bg-[#2B2930] border-[#49454F] text-[#E6E1E5] focus:border-[#D0BCFF]'
                  : 'bg-[#F7F2FA] border-[#CAC4D0] text-[#1D1B20] focus:border-[#6750A4]'
              }`}
            />
            <button
              onClick={handleSendChatMessage}
              disabled={!chatInput.trim() || isChatSending}
              className="p-2.5 rounded-full bg-[#6750A4] text-white hover:bg-[#523e85] transition-all disabled:opacity-50 cursor-pointer shadow-xs"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 4. Examples */}
      {activeSection === 'examples' && (
        <div className="space-y-4">
          {topic.examples.map((ex) => (
            <div
              key={ex.id}
              className={`rounded-3xl p-5 sm:p-6 border-[1.5px] shadow-xs space-y-3 ${bgCard}`}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-[#6750A4] dark:text-[#D0BCFF]">
                  {ex.title}
                </h3>
                <span className="text-[10px] text-gray-500 font-bold">
                  ገጽ {ex.textbookPage}
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-[#1D1B20] border border-gray-200 dark:border-gray-800 text-xs font-mono">
                <span className="text-purple-700 dark:text-purple-300 font-bold block mb-1">ጥያቄ፡</span>
                <p className={textPrimary}>{ex.problem}</p>
              </div>
              <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs">
                <span className="text-emerald-800 dark:text-emerald-300 font-bold block mb-1">የደረጃ በደረጃ መፍትሄ፡</span>
                <p className="whitespace-pre-line text-gray-800 dark:text-gray-200 leading-relaxed">
                  {ex.solution}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 5. Practice with Progressive Hints (Level 1, 2, 3) */}
      {activeSection === 'practice' && (
        <div className={`rounded-3xl p-6 border-[1.5px] shadow-xs space-y-5 ${bgCard}`}>
          <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-800">
            <div>
              <h2 className={`text-base font-black ${textPrimary}`}>
                የደረጃ በደረጃ የተግባር ልምምድ (Progressive Practice)
              </h2>
              <p className="text-xs text-gray-500">
                ፍንጮችን ደረጃ በደረጃ በመጠቀም እራስዎ ጥያቄዎችን ይስሩ።
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {sampleProblems.map((prob, idx) => {
              const hintLevel = revealedHints[idx] || 0;
              return (
                <div
                  key={idx}
                  className={`p-5 rounded-2xl border space-y-3 ${
                    darkMode ? 'bg-[#2B2930] border-[#49454F]' : 'bg-gray-50 border-[#E6E0E9]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-[#6750A4] dark:text-[#D0BCFF]">
                      ልምምድ {idx + 1}
                    </span>
                    <span className="text-[10px] text-gray-500">
                      ገጽ {topic.textbookPage}
                    </span>
                  </div>

                  <p className={`text-xs sm:text-sm font-bold ${textPrimary}`}>{prob.text}</p>

                  {/* Progressive Hint Reveal Buttons */}
                  <div className="pt-2 flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => handleRevealNextHint(idx)}
                      disabled={hintLevel >= 3}
                      className="px-3 py-1.5 rounded-full text-xs font-black bg-amber-500 text-white hover:bg-amber-600 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <Lightbulb className="w-3.5 h-3.5" />
                      <span>
                        {hintLevel === 0
                          ? 'ፍንጭ 1 አሳይ (Show Hint 1)'
                          : hintLevel === 1
                          ? 'ፍንጭ 2 አሳይ (Show Hint 2)'
                          : 'መፍትሄውን አሳይ (Solution)'}
                      </span>
                    </button>
                  </div>

                  {hintLevel >= 1 && (
                    <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200">
                      <strong>ፍንጭ 1 (መነሻ):</strong> {prob.hint || 'የመማሪያ መጽሐፉን መሰረታዊ ቀመር አስታውስ።'}
                    </div>
                  )}

                  {hintLevel >= 2 && (
                    <div className="p-3 rounded-xl bg-amber-100 dark:bg-amber-900/40 border border-amber-300 dark:border-amber-700 text-xs text-amber-950 dark:text-amber-100">
                      <strong>ፍንጭ 2 (የስሌት ቅደም ተከተል):</strong> በመጀመሪያ ተለዋዋጮችን ለይ፤ ከዚያም እሴቶቹን በመተካት በቀላሉ ስራ።
                    </div>
                  )}

                  {hintLevel >= 3 && (
                    <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 text-xs text-emerald-900 dark:text-emerald-200">
                      <strong>ትክክለኛ መፍትሄ (Full Solution):</strong> {prob.answer || 'የተሟላው መልስ በመማሪያ መጽሐፉ ውስጥ ተረጋግጧል።'}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 6. Quiz & Adaptive Mastery Scoring */}
      {activeSection === 'quiz' && (
        <div className={`rounded-3xl p-6 sm:p-8 border-[1.5px] shadow-xs space-y-6 ${bgCard}`}>
          <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-800">
            <div>
              <h2 className={`text-base sm:text-lg font-black ${textPrimary}`}>
                የትምህርት መመዘኛ ፈተና (Curriculum Quiz)
              </h2>
              <p className="text-xs text-gray-500">
                ትክክለኛውን መልስ በመምረጥ ውጤትዎን ይመልከቱ፤ ስርዓቱ ችሎታዎን በራሱ ያሻሽላል።
              </p>
            </div>
            {quizScore !== null && (
              <div
                className={`px-4 py-1.5 rounded-full text-xs font-black ${
                  quizScore >= 80
                    ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                    : 'bg-rose-100 text-rose-900 border border-rose-300'
                }`}
              >
                ውጤት፡ {quizScore}%
              </div>
            )}
          </div>

          {/* Questions */}
          <div className="space-y-5">
            {sampleQuizQuestions.map((q, qIdx) => (
              <div key={q.id} className="space-y-3">
                <h3 className={`text-xs sm:text-sm font-bold ${textPrimary}`}>
                  {qIdx + 1}. {q.question}
                </h3>

                <div className="space-y-2">
                  {q.options.map((opt, optIdx) => {
                    const isSelected = quizAnswers[qIdx] === optIdx;
                    const isSubmitted = quizSubmitted;
                    const isCorrect = optIdx === q.correctIndex;

                    let btnStyle = darkMode
                      ? 'bg-[#2B2930] border-[#49454F] text-[#E6E1E5]'
                      : 'bg-white border-[#E6E0E9] text-[#1D1B20]';

                    if (isSelected) {
                      btnStyle = 'border-[#6750A4] bg-purple-50 dark:bg-purple-950/40 text-[#6750A4] font-black';
                    }

                    if (isSubmitted) {
                      if (isCorrect) {
                        btnStyle = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-black';
                      } else if (isSelected && !isCorrect) {
                        btnStyle = 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 font-black';
                      }
                    }

                    return (
                      <button
                        key={optIdx}
                        disabled={quizSubmitted}
                        onClick={() => setQuizAnswers({ ...quizAnswers, [qIdx]: optIdx })}
                        className={`w-full text-left p-3.5 rounded-2xl border text-xs transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                      >
                        <span>{opt}</span>
                        {isSubmitted && isCorrect && <Check className="w-4 h-4 text-emerald-600" />}
                      </button>
                    );
                  })}
                </div>

                {quizSubmitted && (
                  <div className="p-3 rounded-xl bg-gray-50 dark:bg-[#1D1B20] border border-gray-200 dark:border-gray-800 text-xs text-gray-700 dark:text-gray-300">
                    <p className="font-bold text-[#6750A4]">ማብራሪያ፡ {q.explanation}</p>
                    <span className="text-[10px] text-gray-500">ምንጭ፡ የመማሪያ መጽሐፍ ገጽ {q.page}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Submit Action */}
          {!quizSubmitted ? (
            <button
              onClick={handleSubmitQuiz}
              disabled={Object.keys(quizAnswers).length < sampleQuizQuestions.length}
              className="w-full py-3 rounded-full text-xs font-black bg-[#6750A4] text-white hover:bg-[#523e85] transition-all cursor-pointer shadow-xs disabled:opacity-50"
            >
              መልሶችን አስገባና ደረጃህን አዘምን (Submit & Update Mastery)
            </button>
          ) : (
            <div className="p-4 rounded-2xl border border-purple-200 bg-purple-50/50 dark:bg-purple-950/20 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-[#6750A4] dark:text-[#D0BCFF]">
                  የአዳፕቲቭ ችሎታ ደረጃ (Mastery Status): {mastery?.masteryLevel?.toUpperCase()}
                </span>
                <span className="text-xs font-bold text-gray-600 dark:text-gray-400">
                  አዲስ የተጠቆመ ደረጃ፡ {mastery?.difficultySuggested}
                </span>
              </div>

              {recommendations.length > 0 && (
                <div className="space-y-1.5 text-xs text-gray-800 dark:text-gray-200">
                  <span className="font-bold text-amber-700 dark:text-amber-300 block">የኑር AI አዳፕቲቭ ምክር፡</span>
                  {recommendations.map((r) => (
                    <div key={r.id} className="p-2.5 rounded-xl bg-white dark:bg-[#2B2930] border border-amber-200">
                      <p className="font-bold">{r.topicTitle}</p>
                      <p className="text-[11px] text-gray-500">{r.reason}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* 7. Review */}
      {activeSection === 'review' && (
        <div className={`rounded-3xl p-6 sm:p-8 border-[1.5px] shadow-xs space-y-5 ${bgCard}`}>
          <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-800">
            <h2 className={`text-base sm:text-lg font-black ${textPrimary}`}>
              የክለሳ ካርዶችና ማጠቃለያ (Key Review Takeaways)
            </h2>
            <span className="text-xs text-gray-500 font-bold">ገጽ {topic.textbookPage}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className={`p-4 rounded-2xl border space-y-2 ${darkMode ? 'bg-[#2B2930] border-[#49454F]' : 'bg-[#FFF8E1] border-[#FFE082]'}`}>
              <h3 className="text-xs font-black uppercase text-amber-800 dark:text-amber-200">
                ማስታወሻ (Key Takeaway)
              </h3>
              <p className="text-xs text-gray-800 dark:text-gray-200">
                {topic.explanations.overview}
              </p>
            </div>

            <div className={`p-4 rounded-2xl border space-y-2 ${darkMode ? 'bg-[#2B2930] border-[#49454F]' : 'bg-[#E8F5E9] border-[#C8E6C9]'}`}>
              <h3 className="text-xs font-black uppercase text-emerald-800 dark:text-emerald-200">
                የፈተና ምክር (Exam Tip)
              </h3>
              <p className="text-xs text-gray-800 dark:text-gray-200">
                በብሔራዊ ፈተና (ESSLCE) ላይ ከዚህ ርዕስ የሚወጡ ጥያቄዎች በዋናነት ቀመሮችንና ፅንሰ-ሀሳባዊ ትርጉሞችን በማነጻጸር ላይ ያተኩራሉ።
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
