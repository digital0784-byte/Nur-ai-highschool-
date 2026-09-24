import React, { useState } from 'react';
import {
  Sparkles,
  BookOpen,
  GraduationCap,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Smartphone,
  HelpCircle,
  Award,
  Zap,
  RotateCcw,
  Check,
  Send,
  Loader2,
  Flame,
  Layers,
  Lock,
} from 'lucide-react';
import { Grade, LanguageCode } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface PublicDemoPageProps {
  onBackToHome: () => void;
  onRegister: () => void;
  onLogin: () => void;
}

export const PublicDemoPage: React.FC<PublicDemoPageProps> = ({
  onBackToHome,
  onRegister,
  onLogin,
}) => {
  const { language, setLanguage, languages } = useLanguage();
  const [demoGrade, setDemoGrade] = useState<Grade>(9);
  const [activeTab, setActiveTab] = useState<'socratic' | 'quiz' | 'textbook'>('socratic');

  // Interactive Socratic AI Simulator State
  const [messages, setMessages] = useState<Array<{ sender: 'student' | 'ai'; text: string; hint?: string }>>([
    {
      sender: 'ai',
      text: 'ሰላም! እኔ የኑር AI የግል አስተማሪ ነኝ። መልሶችን በቀጥታ ከመስጠት ይልቅ በማሰብና በመመራመር እንድትደርስበት አግዝሃለሁ። ዛሬ በየትኛው ርዕስ እንጀምር?',
    },
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);

  // Pre-configured prompt samples
  const promptSamples = [
    {
      label: 'የኒውተን 2ኛ ሕግ (F = ma)',
      grade: 9,
      q: 'የኒውተን ሁለተኛ ሕግ (F = ma) ምንድነው? እንዴትስ ይሰራል?',
      resp: 'በጣም ጥሩ ጥያቄ ነው! አንድን ቀላል ኳስ እና ከባድ ድንጋይ በእኩል ጉልበት ብትመታቸው የትኛው በበለጠ ፍጥነት ይጓዛል? ይህ ከጉልበት (F)፣ ክብደት (m) እና ፍጥነት መጨመር (a) ጋር እንዴት ይያያዛል?',
      hint: 'ምክር፦ F = ma ማለት ጉልበት (Force) = ግዝፈት (Mass) × ፍጥንጥነት (Acceleration) ነው።',
    },
    {
      label: 'የኳድራቲክ ቀመር (Quadratic Formula)',
      grade: 10,
      q: 'ax² + bx + c = 0 ሲሆን xን እንዴት እናገኛለን?',
      resp: 'የኳድራቲክ እኩልታዎችን ለመፍታት የፎርሙላውን ምንጭ ማስታወስ ይጠቅማል። ዲስክሪሚናንት (Discriminant) D = b² - 4ac የውጤቱን አይነት እንዴት ይወስነዋል?',
      hint: 'ቀመር፦ x = (-b ± √(b² - 4ac)) / (2a)',
    },
    {
      label: 'የሕዋስ ክፍፍል (Mitosis vs Meiosis)',
      grade: 11,
      q: 'በማይቶሲስ (Mitosis) እና በሚዮሲስ (Meiosis) መካከል ያለው ልዩነት ምንድነው?',
      resp: 'ድንቅ ጥያቄ! በሰውነታችን ውስጥ ቁስል ሲድን አዳዲስ ሴሎች የሚፈጠሩት በየትኛው ክፍፍል ይመስልሃል? የክሮሞሶም ቁጥሩስ እኩል ሆኖ የሚቀጥለው በየትኛው ላይ ነው?',
      hint: 'ማይቶሲስ 2 ተመሳሳይ ሴሎችን ሲፈጥር ሚዮሲስ 4 የግማሽ ክሮሞሶም (Haploid) ሴሎችን ይፈጥራል።',
    },
    {
      label: 'የመግቢያ ፈተና (Entrance Exam Prep)',
      grade: 12,
      q: 'የ12ኛ ክፍል የዩኒቨርሲቲ መግቢያ ፈተና ላይ ውጤቴን እንዴት ማሻሻል እችላለሁ?',
      resp: 'በመግቢያ ፈተና ስኬታማ ለመሆን ዋናው ቁልፍ የጊዜ አጠቃቀምና ያለፉት ዓመታት ጥያቄዎችን በምክንያት መስራት ነው። ኑር AI ያንተን ደካማ ርዕሶች በመለየት ልዩ የፈተና ሞተሮችን ያዘጋጅልሃል።',
      hint: 'በየቀኑ 20 የፈተና ጥያቄዎችን ሰርተህ ማብራሪያቸውን መከለስ ውጤትህን ከ30% በላይ ያሳድጋል።',
    },
  ];

  const handleSendPrompt = (textToSend?: string) => {
    const query = textToSend || inputMsg;
    if (!query.trim()) return;

    const newMsgs = [...messages, { sender: 'student' as const, text: query }];
    setMessages(newMsgs);
    setInputMsg('');
    setIsAiThinking(true);

    setTimeout(() => {
      // Find matching sample or generate contextual response
      const matched = promptSamples.find(
        (p) => query.includes(p.label) || query.includes(p.q.substring(0, 10))
      );
      const resp = matched
        ? matched.resp
        : `ጥሩ ጥያቄ ነው! በ${demoGrade}ኛ ክፍል ስርዓተ-ትምህርት መሠረት፣ ይህንን ርዕስ ለመረዳት በመጽሐፉ ላይ ያሉትን መሰረታዊ ፅንሰ-ሀሳቦች እንመልከት። ምን የሚመስልህ ይመስልሃል?`;
      const hint = matched?.hint;

      setMessages((prev) => [...prev, { sender: 'ai', text: resp, hint }]);
      setIsAiThinking(false);
    }, 700);
  };

  // Interactive Sample Quiz State
  const sampleQuizQuestions = [
    {
      id: 1,
      grade: 9,
      subject: 'ፊዚክስ (Physics)',
      question: 'የጉልበት (Force) የ SI መለኪያ አሃድ ምን ይባላል?',
      options: ['ጁል (Joule)', 'ዋት (Watt)', 'ኒውተን (Newton)', 'ፓስካል (Pascal)'],
      correctIndex: 2,
      explanation: 'የጉልበት (Force) የ SI መለኪያ ኒውተን (N) ሲሆን 1 N = 1 kg·m/s² ነው። ጁል የስራ፣ ዋት የሀይል፣ ፓስካል ደግሞ የጫና መለኪያ ናቸው።',
    },
    {
      id: 2,
      grade: 10,
      subject: 'ሒሳብ (Mathematics)',
      question: 'የ 2x + 6 = 16 እኩልታ የ x ዋጋ ስንት ነው?',
      options: ['x = 3', 'x = 5', 'x = 7', 'x = 10'],
      correctIndex: 1,
      explanation: '2x + 6 = 16 => 2x = 16 - 6 => 2x = 10 => x = 5።',
    },
    {
      id: 3,
      grade: 11,
      subject: 'ባዮሎጂ (Biology)',
      question: 'የሴል የኃይል ማመንጫ ማዕከል (Powerhouse of the Cell) ተብሎ የሚጠራው የትኛው ነው?',
      options: ['ኒውክሊየስ (Nucleus)', 'ራይቦዞም (Ribosome)', 'ማይቶኮንድሪያ (Mitochondria)', 'ክሎሮፕላስት (Chloroplast)'],
      correctIndex: 2,
      explanation: 'ማይቶኮንድሪያ (Mitochondria) በሴሉላር ሬስፒሬሽን (Cellular Respiration) አማካኝነት ATP ስለሚያመነጭ የሴሉ የኃይል ማመንጫ ይባላል።',
    },
    {
      id: 4,
      grade: 12,
      subject: 'ኬሚስትሪ (Chemistry)',
      question: 'የንጹህ ውሃ ፒኤች (pH) በ 25°C ላይ ስንት ነው?',
      options: ['0', '7 (Neutral)', '14', '1'],
      correctIndex: 1,
      explanation: 'በ 25°C ላይ የንጹህ ውሃ የሃይድሮጅንና ሃይድሮክሳይድ አዮን እኩል ስለሆነ pH = 7 (ገለልተኛ/Neutral) ነው።',
    },
  ];

  const [currentQuizIdx, setCurrentQuizIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  const currentQ = sampleQuizQuestions[currentQuizIdx];

  const handleSelectOption = (idx: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(idx);
  };

  const handleCheckAnswer = () => {
    if (selectedOption === null) return;
    setIsAnswerSubmitted(true);
    if (selectedOption === currentQ.correctIndex) {
      setQuizScore((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    if (currentQuizIdx < sampleQuizQuestions.length - 1) {
      setCurrentQuizIdx((prev) => prev + 1);
    } else {
      setCurrentQuizIdx(0);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF6EC] text-[#24211E] font-sans selection:bg-emerald-100 selection:text-emerald-900 pb-16">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 bg-[#FAF6EC]/95 backdrop-blur-md border-b-[1.5px] border-[#38332D] shadow-xs">
        <div className="max-w-6xl mx-auto px-3 sm:px-6 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onBackToHome}
              className="p-1.5 rounded-xl bg-[#EFE8D6] hover:bg-[#E2D8BF] text-[#24211E] border border-[#38332D]/40 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-bold"
              title="ወደ መነሻ ገጽ ተመለስ"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">መነሻ ገጽ (Home)</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="text-lg font-black font-serif-ethiopic text-[#1E1B18]">
                ኑር AI • ነጻ ማሳያ
              </span>
              <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-amber-400 text-stone-950 font-bold border border-amber-600">
                Interactive Demo
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onLogin}
              className="px-3 py-1.5 text-xs font-bold text-[#1E1B18] hover:bg-[#EAE0C7] border border-[#38332D]/40 rounded-xl transition-all cursor-pointer"
            >
              ይግቡ (Login)
            </button>
            <button
              onClick={onRegister}
              className="px-4 py-1.5 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-1.5 border border-emerald-950"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>ተመዝገብ & ሙሉውን ክፈት</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <section className="bg-gradient-to-b from-[#F4ECD8] to-[#FAF6EC] py-8 px-3 sm:px-6 border-b border-[#38332D]/20 text-center">
        <div className="max-w-4xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-300">
            ያለ ምዝገባ የሲስተሙን ብቃት ይሞክሩ (Try Live Features)
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-[#1E1B18] font-serif-ethiopic">
            የኑር AI ሶቅራጥሳዊ አስተማሪና የፈተና ሞተር የቀጥታ ማሳያ
          </h1>
          <p className="text-xs sm:text-sm text-[#5E513F] max-w-2xl mx-auto">
            የኢ.ፌ.ዲ.ሪ ትምህርት ሚኒስቴር አዲሱን ካሪኩለም መሠረት ያደረገውን AI አስተማሪ፣ ፈተናዎችንና ይፋዊ መጻሕፍትን ከዚህ በታች በቀጥታ ይሞክሩ።
          </p>

          {/* Grade Selector Tabs */}
          <div className="pt-3 flex flex-wrap items-center justify-center gap-2">
            {([9, 10, 11, 12] as Grade[]).map((g) => (
              <button
                key={g}
                onClick={() => setDemoGrade(g)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                  demoGrade === g
                    ? 'bg-stone-900 text-white border-stone-950 shadow-md'
                    : 'bg-white text-stone-700 border-stone-300 hover:border-stone-500'
                }`}
              >
                {g}ኛ ክፍል (Grade {g})
              </button>
            ))}
          </div>

          {/* Feature Mode Switcher */}
          <div className="pt-4 flex p-1 bg-[#EAE0C7] rounded-2xl border border-[#38332D]/30 max-w-md mx-auto">
            <button
              onClick={() => setActiveTab('socratic')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'socratic'
                  ? 'bg-emerald-800 text-white shadow-md'
                  : 'text-[#4A4237] hover:text-black'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI አስተማሪ (Tutor)</span>
            </button>
            <button
              onClick={() => setActiveTab('quiz')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'quiz'
                  ? 'bg-emerald-800 text-white shadow-md'
                  : 'text-[#4A4237] hover:text-black'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>የልምምድ ፈተና (Quiz)</span>
            </button>
            <button
              onClick={() => setActiveTab('textbook')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'textbook'
                  ? 'bg-emerald-800 text-white shadow-md'
                  : 'text-[#4A4237] hover:text-black'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>መጽሐፍት (Textbooks)</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Interactive Demo Container */}
      <main className="max-w-4xl mx-auto px-3 sm:px-6 pt-8">
        {/* TAB 1: SOCRATIC AI TUTOR SIMULATOR */}
        {activeTab === 'socratic' && (
          <div className="bg-white border-[1.5px] border-[#38332D] rounded-3xl overflow-hidden shadow-lg flex flex-col">
            {/* Header */}
            <div className="bg-[#FAF6EC] border-b border-[#38332D]/20 p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-800 text-amber-300 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black font-serif-ethiopic text-stone-900">
                    የሶቅራጥሳዊ AI የግል አስተማሪ የቀጥታ ውይይት
                  </h3>
                  <p className="text-[11px] text-stone-500">
                    የ{demoGrade}ኛ ክፍል ካሪኩለም • ጥያቄዎችን በምክንያት የሚያስረዳ
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-300">
                ● Live AI Model
              </span>
            </div>

            {/* Quick Sample Prompts */}
            <div className="p-3 bg-[#FAF6EC]/50 border-b border-[#38332D]/10 flex flex-wrap gap-2 items-center">
              <span className="text-[11px] font-bold text-stone-600">ፈጣን ጥያቄ ምረጥ፡</span>
              {promptSamples.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendPrompt(p.q)}
                  className="px-2.5 py-1 bg-white hover:bg-stone-100 border border-stone-300 rounded-lg text-xs text-stone-800 font-medium transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Zap className="w-3 h-3 text-amber-500" />
                  <span>{p.label}</span>
                </button>
              ))}
            </div>

            {/* Chat Messages */}
            <div className="p-4 sm:p-6 space-y-4 min-h-[300px] max-h-[420px] overflow-y-auto bg-stone-50/50">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${m.sender === 'student' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed shadow-xs ${
                      m.sender === 'student'
                        ? 'bg-stone-900 text-white rounded-br-xs'
                        : 'bg-white border border-[#38332D]/20 text-stone-900 rounded-bl-xs'
                    }`}
                  >
                    <p className="font-serif-ethiopic">{m.text}</p>
                    {m.hint && (
                      <div className="mt-2.5 pt-2 border-t border-emerald-100 bg-emerald-50/80 -mx-1 p-2 rounded-xl text-[11px] text-emerald-900 flex items-start gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                        <span>{m.hint}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isAiThinking && (
                <div className="flex items-center gap-2 text-stone-500 text-xs py-2">
                  <Loader2 className="w-4 h-4 animate-spin text-emerald-700" />
                  <span className="font-serif-ethiopic">ኑር AI በማሰብና ካሪኩለሙን በማጣቀስ ላይ ነው...</span>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <div className="p-3 sm:p-4 bg-white border-t border-[#38332D]/20 flex items-center gap-2">
              <input
                type="text"
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendPrompt()}
                placeholder="ስለ ማንኛውም የትምህርት ርዕስ ጥያቄዎን ይጠይቁ..."
                className="flex-1 px-4 py-2.5 bg-stone-100 border border-stone-300 rounded-xl text-xs sm:text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-emerald-700 transition-colors"
              />
              <button
                onClick={() => handleSendPrompt()}
                disabled={!inputMsg.trim() || isAiThinking}
                className="px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
              >
                <span>ላክ</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: INTERACTIVE PRACTICE QUIZ */}
        {activeTab === 'quiz' && (
          <div className="bg-white border-[1.5px] border-[#38332D] rounded-3xl p-6 sm:p-8 shadow-lg space-y-6">
            <div className="flex items-center justify-between border-b border-[#38332D]/20 pb-4">
              <div>
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">
                  {currentQ.subject}
                </span>
                <h3 className="text-base sm:text-lg font-black text-stone-900 font-serif-ethiopic">
                  ጥያቄ {currentQuizIdx + 1} / {sampleQuizQuestions.length}
                </h3>
              </div>
              <div className="text-right">
                <span className="text-xs text-stone-500 block">የተገኙ ነጥቦች</span>
                <span className="text-sm font-black text-emerald-800 font-mono">
                  {quizScore} / {sampleQuizQuestions.length}
                </span>
              </div>
            </div>

            {/* Question Text */}
            <div className="p-4 rounded-2xl bg-[#FAF6EC] border border-[#38332D]/20">
              <p className="text-sm sm:text-base font-bold text-stone-900 font-serif-ethiopic leading-relaxed">
                {currentQ.question}
              </p>
            </div>

            {/* Options */}
            <div className="space-y-2.5">
              {currentQ.options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === currentQ.correctIndex;
                let optStyles = 'bg-stone-50 border-stone-300 text-stone-800 hover:border-emerald-700';

                if (isAnswerSubmitted) {
                  if (isCorrect) {
                    optStyles = 'bg-emerald-100 border-emerald-600 text-emerald-950 font-bold';
                  } else if (isSelected && !isCorrect) {
                    optStyles = 'bg-rose-100 border-rose-500 text-rose-950';
                  }
                } else if (isSelected) {
                  optStyles = 'bg-emerald-800 text-white border-emerald-950 font-bold';
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between text-xs sm:text-sm font-serif-ethiopic ${optStyles}`}
                  >
                    <span>{opt}</span>
                    {isAnswerSubmitted && isCorrect && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    )}
                    {isAnswerSubmitted && isSelected && !isCorrect && (
                      <XCircle className="w-4 h-4 text-rose-600" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation card after submit */}
            {isAnswerSubmitted && (
              <div className="p-4 rounded-2xl bg-stone-100 border border-stone-300 space-y-1 text-xs">
                <span className="font-bold text-emerald-800 block">የካሪኩለም ማብራሪያ (Explanation):</span>
                <p className="text-stone-700 leading-relaxed font-serif-ethiopic">{currentQ.explanation}</p>
              </div>
            )}

            {/* Action Bar */}
            <div className="flex items-center justify-end gap-3 pt-2">
              {!isAnswerSubmitted ? (
                <button
                  onClick={handleCheckAnswer}
                  disabled={selectedOption === null}
                  className="px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-40"
                >
                  መልሱን አረጋግጥ (Submit Answer)
                </button>
              ) : (
                <button
                  onClick={handleNextQuestion}
                  className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span>ቀጣይ ጥያቄ</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: TEXTBOOK PREVIEW */}
        {activeTab === 'textbook' && (
          <div className="bg-white border-[1.5px] border-[#38332D] rounded-3xl p-6 sm:p-8 shadow-lg space-y-6">
            <div className="flex items-center justify-between border-b border-[#38332D]/20 pb-4">
              <div>
                <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block">
                  የኢ.ፌ.ዲ.ሪ ትምህርት ሚኒስቴር ይፋዊ መጽሐፍት
                </span>
                <h3 className="text-base sm:text-lg font-black text-stone-900 font-serif-ethiopic">
                  የ{demoGrade}ኛ ክፍል የመማሪያ መጽሐፍት ማዕከል
                </h3>
              </div>
              <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-[#FAF6EC] border border-[#38332D]/30 text-stone-700">
                DRM Protected
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { title: 'ሒሳብ (Mathematics)', units: '10 ምዕራፎች', pages: '280 ገጾች', color: 'bg-blue-50 border-blue-200' },
                { title: 'ፊዚክስ (Physics)', units: '8 ምዕራፎች', pages: '240 ገጾች', color: 'bg-purple-50 border-purple-200' },
                { title: 'ኬሚስትሪ (Chemistry)', units: '7 ምዕራፎች', pages: '220 ገጾች', color: 'bg-emerald-50 border-emerald-200' },
                { title: 'ባዮሎጂ (Biology)', units: '6 ምዕራፎች', pages: '210 ገጾች', color: 'bg-amber-50 border-amber-200' },
                { title: 'እንግሊዝኛ (English)', units: '12 ዩኒቶች', pages: '260 ገጾች', color: 'bg-rose-50 border-rose-200' },
                { title: 'ታሪክና ጂኦግራፊ', units: '8 ምዕራፎች', pages: '230 ገጾች', color: 'bg-cyan-50 border-cyan-200' },
              ].map((b, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl border ${b.color} flex flex-col justify-between gap-3 text-left`}
                >
                  <div className="space-y-1">
                    <span className="text-xs font-black text-stone-900 font-serif-ethiopic block">{b.title}</span>
                    <span className="text-[11px] text-stone-600 block">{b.units} • {b.pages}</span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-black/5 text-[11px] text-stone-500 font-mono">
                    <span className="flex items-center gap-1">
                      <Lock className="w-3 h-3 text-stone-400" />
                      <span>ለተመዘገቡ ብቻ</span>
                    </span>
                    <button
                      onClick={onRegister}
                      className="text-emerald-800 font-bold hover:underline cursor-pointer"
                    >
                      ክፈት →
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF6EC] border border-[#38332D]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-left">
                <h4 className="text-xs font-bold text-stone-900">ሙሉ መጽሐፍትን ለማንበብና ለማጥናት</h4>
                <p className="text-[11px] text-stone-600">
                  የተማሪ መለያዎን በመፍጠር እና ወርሃዊ ክፍያውን በመፈጸም ሁሉንም መጻሕፍትና የፈተና ጥያቄዎች ያግኙ።
                </p>
              </div>
              <button
                onClick={onRegister}
                className="px-5 py-2.5 bg-stone-900 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0"
              >
                ተመዝገብ & አንብብ
              </button>
            </div>
          </div>
        )}

        {/* Bottom Callout: Unlock Full System */}
        <div className="mt-10 bg-gradient-to-br from-emerald-900 to-stone-900 text-white rounded-3xl p-6 sm:p-8 border border-emerald-800/50 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 text-left">
          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-400 text-stone-950 inline-flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>ሙሉ የትምህርት ስርዓት (Full Learning System)</span>
            </span>
            <h3 className="text-xl sm:text-2xl font-black font-serif-ethiopic">
              የ{demoGrade}ኛ ክፍልን ሙሉ ስርዓተ-ትምህርት ዛሬውኑ ይጀምሩ!
            </h3>
            <p className="text-xs sm:text-sm text-emerald-200 max-w-lg">
              በወር ከ160 - 200 ETB ብቻ በመክፈል ያልተገደበ የAI አስተማሪ፣ የምዕራፍ ፈተናዎች፣ የላብራቶሪ ማስመሰያ እና ከመስመር ውጭ የጥናት ዕድል ያግኙ።
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto">
            <button
              onClick={onRegister}
              className="w-full sm:w-auto px-6 py-3 bg-amber-400 hover:bg-amber-300 text-stone-950 font-black text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>አሁን ይመዝገቡ (Register Now)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onLogin}
              className="w-full sm:w-auto px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 transition-all cursor-pointer text-center"
            >
              ይግቡ (Login)
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};
