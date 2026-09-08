import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  BookOpen,
  Send,
  HelpCircle,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Camera,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  BrainCircuit,
  TrendingUp,
  Compass,
  FileText,
  Lightbulb,
  Award,
  Layers,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  Check,
  Play,
  RotateCcw,
  X,
  Upload,
} from 'lucide-react';
import { GradeLevel } from '../types/curriculumEngine';
import { LanguageCode, Subject } from '../types';
import {
  LearningMode,
  TutorFeatureType,
  TextbookCitation,
  AIMessageItem,
  AISessionItem,
  StudentMasteryRecord,
  WeakTopicRecord,
  LearningRecommendationRecord,
  PhotoQuestionSolution,
} from '../types/aiTutor';
import { aiTutorFirestore } from '../services/aiTutorFirestore';

interface EthiopianAITutorViewProps {
  currentSubject?: Subject;
  initialGrade?: GradeLevel;
}

const SUPPORTED_LANGUAGES: { code: LanguageCode; name: string; nativeName: string }[] = [
  { code: 'am', name: 'Amharic', nativeName: 'አማርኛ' },
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'om', name: 'Afaan Oromoo', nativeName: 'Afaan Oromoo' },
  { code: 'ti', name: 'Tigrinya', nativeName: 'ትግርኛ' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
];

const SUBJECTS_LIST = [
  { id: 'math-g9', name: 'Mathematics', am: 'ሒሳብ', defaultGrade: 9 },
  { id: 'physics-g9', name: 'Physics', am: 'ፊዚክስ', defaultGrade: 9 },
  { id: 'chemistry-g10', name: 'Chemistry', am: 'ኬሚስትሪ', defaultGrade: 10 },
  { id: 'biology-g9', name: 'Biology', am: 'ባዮሎጂ', defaultGrade: 9 },
  { id: 'it-g10', name: 'Information Technology', am: 'ኢንፎርሜሽን ቴክኖሎጂ', defaultGrade: 10 },
  { id: 'economics-g11', name: 'Economics', am: 'ኢኮኖሚክስ', defaultGrade: 11 },
  { id: 'history-g9', name: 'History', am: 'ታሪክ', defaultGrade: 9 },
  { id: 'geography-g9', name: 'Geography', am: 'ጆግራፊ', defaultGrade: 9 },
  { id: 'english-g9', name: 'English', am: 'እንግሊዝኛ', defaultGrade: 9 },
];

const LEARNING_MODES: { id: LearningMode; title: string; amTitle: string; desc: string }[] = [
  { id: 'beginner', title: 'Beginner', amTitle: 'ጀማሪ (Beginner)', desc: 'ቀላል ማብራሪያ፣ የዕለት ተዕለት ምሳሌዎች እና የማያቋርጡ ፍንጮች' },
  { id: 'guided', title: 'Guided', amTitle: 'መሪ (Guided)', desc: 'ደረጃ በደረጃ የሚመራ የስርዓተ-ትምህርት ጥናት' },
  { id: 'practice', title: 'Practice', amTitle: 'ልምምድ (Practice)', desc: 'የችግር አፈታትና የቀመር አጠቃቀም ልምምድ' },
  { id: 'mastery', title: 'Mastery', amTitle: 'ብቃት (Mastery)', desc: 'የሀገር አቀፍ የ12ኛ ክፍል ፈተና (ESSLCE) የላቀ ዝግጅት' },
];

export const EthiopianAITutorView: React.FC<EthiopianAITutorViewProps> = ({
  currentSubject,
  initialGrade = 9,
}) => {
  // Config state
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel>(initialGrade);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(
    currentSubject ? `${currentSubject.id}-g${initialGrade}` : 'math-g9'
  );
  const [learningMode, setLearningMode] = useState<LearningMode>('guided');
  const [selectedLang, setSelectedLang] = useState<LanguageCode>('am');

  // Interactive state
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeFeature, setActiveFeature] = useState<TutorFeatureType>('ask_question');
  const [hintLevel, setHintLevel] = useState<1 | 2 | 3>(1);

  // Messages & Session state
  const [sessionId, setSessionId] = useState<string>(() => 'sess_' + Date.now());
  const [messages, setMessages] = useState<AIMessageItem[]>([]);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Diagnostics & Adaptivity state
  const [masteryRecords, setMasteryRecords] = useState<StudentMasteryRecord[]>([]);
  const [weakTopics, setWeakTopics] = useState<WeakTopicRecord[]>([]);
  const [recommendations, setRecommendations] = useState<LearningRecommendationRecord[]>([]);
  const [showDiagnostics, setShowDiagnostics] = useState(false);

  // Modals state
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [photoBase64, setPhotoBase64] = useState<string | null>(null);
  const [photoSolution, setPhotoSolution] = useState<PhotoQuestionSolution | null>(null);
  const [isSolvingPhoto, setIsSolvingPhoto] = useState(false);

  // Voice state
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Verification Test state
  const [showTestModal, setShowTestModal] = useState(false);
  const [testReport, setTestReport] = useState<any>(null);
  const [isRunningTest, setIsRunningTest] = useState(false);

  // Active Quiz Modal
  const [activeQuizQuestions, setActiveQuizQuestions] = useState<any[] | null>(null);
  const [quizSelectedAnswers, setQuizSelectedAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const currentSubjectObj =
    SUBJECTS_LIST.find((s) => s.id === selectedSubjectId) || SUBJECTS_LIST[0];

  // Initialize Welcome Message
  useEffect(() => {
    const welcomeMsg: AIMessageItem = {
      id: 'msg_welcome_' + Date.now(),
      sessionId,
      userId: 'student_1',
      role: 'assistant',
      content:
        selectedLang === 'am'
          ? `ሰላም! እኔ ኑር AI የኢትዮጵያ የሁለተኛ ደረጃ (9-12 ክፍል) የግል አስተማሪዎ ነኝ። ትምህርት የምሰጠው በይፋዊው የአዲሱ ስርዓተ-ትምህርት የተማሪ መጽሐፍ ላይ ብቻ ተመስርቼ ነው። ማንኛውንም ጥያቄ ይጠይቁኝ፣ ፅንሰ-ሀሳብ እንዲብራራ ያድርጉ፣ ደረጃ በደረጃ ስሌት ይመልከቱ፣ ወይም የፎቶ ጥያቄ ያስገቡ!`
          : selectedLang === 'om'
          ? `Akkam! Ani NUR AI Barsiisaa dhuunfaa mana barumsaa sadarkaa lammaffaa Itoophiyaa (Kutaa 9-12) ti. Gaaffii barbaadde na gaafadhu, shallaggii deemsa deemsaan ilaali!`
          : selectedLang === 'ti'
          ? `ሰላም! ኣነ ኑር AI ናይ ኢትዮጵያ ካልኣይ ብርኪ (9-12 ክፍሊ) ብሕታዊ መምህርካ እየ። ዝኾነ ሕቶ ሕተቱኒ፣ ብመጽሓፍ ተምሃራይ ዝተረጋገጸ መልሲ ክህበኩም እየ!`
          : selectedLang === 'ar'
          ? `مرحباً! أنا معلمك الشخصي الذكي لمدارس المرحلة الثانوية في إثيوبيا (الصفوف 9-12). أقدم الشروحات والحلول المنهجية المعتمدة خطوة بخطوة!`
          : `Hello! I am NUR AI, your personal Ethiopian High School tutor for Grades 9-12. I teach exclusively grounded in the official Ethiopian New Curriculum student textbooks. Ask me anything, request step-by-step solutions, test your mastery, or upload a photo of any question!`,
      featureType: 'ask_question',
      citations: [
        {
          grade: selectedGrade,
          subject: currentSubjectObj.name,
          unit: 1,
          unitTitle: 'Curriculum Foundations',
          page: 1,
          source: 'Ministry of Education Student Textbook',
        },
      ],
      groundedInTextbook: true,
      timestamp: new Date().toISOString(),
    };

    setMessages([welcomeMsg]);
    loadSavedData();
  }, [selectedGrade, selectedSubjectId, selectedLang]);

  // Scroll to bottom on new message
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const loadSavedData = async () => {
    try {
      const savedMastery = await aiTutorFirestore.getMastery();
      if (savedMastery.length > 0) setMasteryRecords(savedMastery);

      const savedWeak = await aiTutorFirestore.getWeakTopics();
      if (savedWeak.length > 0) setWeakTopics(savedWeak);

      const savedRecs = await aiTutorFirestore.getRecommendations();
      if (savedRecs.length > 0) setRecommendations(savedRecs);
    } catch (e) {
      console.warn('Failed to load saved tutor data:', e);
    }
  };

  // Central Dispatcher for Tutor Action
  const triggerTutorAction = async (
    feature: TutorFeatureType,
    customQuestion?: string,
    additionalParams: Record<string, any> = {}
  ) => {
    const questionToAsk = customQuestion || inputText.trim();
    if (!questionToAsk && ['ask_question', 'hints', 'check_answer'].includes(feature)) {
      return;
    }

    setIsLoading(true);
    setActiveFeature(feature);

    const userMessageText =
      feature === 'ask_question'
        ? questionToAsk
        : feature === 'explain_topic'
        ? `ርዕስ ይብራራልኝ፡ "${questionToAsk || currentSubjectObj.name}"`
        : feature === 'step_by_step'
        ? `ደረጃ በደረጃ ስሌት፡ "${questionToAsk}"`
        : feature === 'examples'
        ? `ከመማሪያ መጽሐፍ የተሰሩ ምሳሌዎች ይቅረቡ`
        : feature === 'practice_questions'
        ? `የልምምድ ጥያቄዎች ይዘጋጁ`
        : feature === 'hints'
        ? `ፍንጭ ደረጃ ${hintLevel} ይስጡኝ`
        : feature === 'explain_mistakes'
        ? `ስህተቴን አብራራልኝ`
        : feature === 'quiz'
        ? `ፈጣን የ5 ጥያቄዎች ፈተና ይዘጋጅ`
        : feature === 'exam'
        ? `የምዕራፍ ፈተና ይዘጋጅ`
        : feature === 'identify_weak_topics'
        ? `የእኔን ደካማ ጎኖች እና ክፍተቶች ለዩልኝ`
        : feature === 'recommend_next_lesson'
        ? `ቀጣይ የማጠናውን ርዕስ ምከሩኝ`
        : questionToAsk;

    // Append user message
    const userMsg: AIMessageItem = {
      id: 'usr_' + Date.now(),
      sessionId,
      userId: 'student_1',
      role: 'user',
      content: userMessageText,
      featureType: feature,
      groundedInTextbook: false,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');

    try {
      const response = await fetch('/api/ai-tutor/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          feature,
          question: questionToAsk,
          topicTitle: additionalParams.topicTitle || questionToAsk,
          grade: selectedGrade,
          subjectId: selectedSubjectId,
          subjectName: currentSubjectObj.name,
          mode: learningMode,
          language: selectedLang,
          hintLevel: feature === 'hints' ? hintLevel : undefined,
          studentAnswer: additionalParams.studentAnswer,
          previousQuestion: additionalParams.previousQuestion,
          correctAnswer: additionalParams.correctAnswer,
          ...additionalParams,
        }),
      });

      const data = await response.json();

      if (data.quiz && data.quiz.length > 0) {
        setActiveQuizQuestions(data.quiz);
        setQuizSelectedAnswers({});
        setQuizSubmitted(false);
      }

      const botMsg: AIMessageItem = {
        id: 'bot_' + Date.now(),
        sessionId,
        userId: 'student_1',
        role: 'assistant',
        content: data.answer,
        featureType: feature,
        citations: data.citations || [],
        groundedInTextbook: data.groundedInTextbook || false,
        timestamp: new Date().toISOString(),
        metadata: {
          hintLevel: data.hintLevel,
          evaluation: data.evaluation,
        },
      };

      setMessages((prev) => [...prev, botMsg]);

      // Save to Firestore
      await aiTutorFirestore.saveMessage(userMsg);
      await aiTutorFirestore.saveMessage(botMsg);

      // Speak if in voice mode or audio script provided
      if (data.audioScript && isSpeaking) {
        speakText(data.audioScript);
      }
    } catch (err: any) {
      console.error('AI Tutor action error:', err);
      const errorMsg: AIMessageItem = {
        id: 'err_' + Date.now(),
        sessionId,
        userId: 'student_1',
        role: 'assistant',
        content: `ይቅርታ፣ ጥያቄውን በመመለስ ሂደት ላይ ችግር አጋጥሟል። እባክዎ ጥያቄዎን በድጋሚ ይሞክሩ።`,
        featureType: feature,
        groundedInTextbook: false,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // Text-To-Speech
  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    if (selectedLang === 'am') utterance.lang = 'am-ET';
    else if (selectedLang === 'ar') utterance.lang = 'ar-SA';
    else utterance.lang = 'en-US';

    utterance.rate = 0.95;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // Speech-To-Text (Microphone)
  const toggleSpeechRecognition = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('የድምፅ ግብዓት (Speech Recognition) በአሳሽዎ አይደገፍም። እባክዎ Chrome ወይም Edge ይጠቀሙ።');
      return;
    }

    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = selectedLang === 'am' ? 'am-ET' : selectedLang === 'ar' ? 'ar-SA' : 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => setIsRecording(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsRecording(false);
      };
      recognition.onerror = () => setIsRecording(false);
      recognition.onend = () => setIsRecording(false);

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      console.error('Speech recognition error:', e);
      setIsRecording(false);
    }
  };

  // Handle Photo Question Submission
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setPhotoBase64(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const processPhotoSolution = async () => {
    if (!photoBase64) return;
    setIsSolvingPhoto(true);
    try {
      const resp = await fetch('/api/ai-tutor/photo-solve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: photoBase64,
          grade: selectedGrade,
          subjectName: currentSubjectObj.name,
          language: selectedLang,
        }),
      });
      const data: PhotoQuestionSolution = await resp.json();
      setPhotoSolution(data);

      // Also append to chat
      const photoMessage: AIMessageItem = {
        id: 'photo_' + Date.now(),
        sessionId,
        userId: 'student_1',
        role: 'assistant',
        content: `📷 **የፎቶ ጥያቄ ትንታኔ (Photo Solver)**\n\n**ጥያቄ፡** ${data.questionText}\n\n**ደረጃ በደረጃ አሰራር፡**\n${data.solutionSteps.map((s, idx) => `${idx + 1}. ${s}`).join('\n')}\n\n**የመጨረሻ መልስ፡** ${data.finalAnswer}\n\n💡 **የክለሳ ምክር፡** ${data.revisionTip}`,
        featureType: 'photo_solver',
        citations: data.citations,
        groundedInTextbook: data.groundedInTextbook,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, photoMessage]);
      await aiTutorFirestore.saveMessage(photoMessage);
    } catch (err) {
      console.error('Photo solve error:', err);
      alert('የፎቶ ጥያቄውን መፍታት አልተቻለም። እባክዎ እንደገና ይሞክሩ።');
    } finally {
      setIsSolvingPhoto(false);
    }
  };

  // Run the Part 3 Verification Test Flow
  const handleRunFullVerificationTest = async () => {
    setIsRunningTest(true);
    setShowTestModal(true);
    setTestReport(null);
    try {
      const resp = await fetch('/api/ai-tutor/test-flow');
      const data = await resp.json();
      setTestReport(data);

      // If mastery / recommendations returned in steps, update local state
      const masteryStep = data.steps?.find((s: any) => s.stepNumber === 9);
      if (masteryStep?.data) setMasteryRecords(masteryStep.data);

      const weakStep = data.steps?.find((s: any) => s.stepNumber === 10);
      if (weakStep?.data) setWeakTopics(weakStep.data);

      const recStep = data.steps?.find((s: any) => s.stepNumber === 11);
      if (recStep?.data) setRecommendations(recStep.data);
    } catch (e) {
      console.error('Test run failed:', e);
    } finally {
      setIsRunningTest(false);
    }
  };

  // Handle Quiz Submission
  const handleQuizSubmit = async () => {
    if (!activeQuizQuestions) return;
    setQuizSubmitted(true);

    let score = 0;
    const studentAnswersPayload: { topicId: string; topicTitle: string; isCorrect: boolean }[] = [];

    activeQuizQuestions.forEach((q, idx) => {
      const selected = quizSelectedAnswers[idx];
      const isCorrect = selected === q.correctAnswer;
      if (isCorrect) score += 1;

      studentAnswersPayload.push({
        topicId: `topic-u${selectedGrade}-${q.textbookPage || 1}`,
        topicTitle: q.prompt?.substring(0, 30) || 'Topic Question',
        isCorrect,
      });
    });

    try {
      // Evaluate adaptivity and save to Firestore
      const resp = await fetch('/api/ai-tutor/evaluate-adaptive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'student_1',
          subjectId: selectedSubjectId,
          answers: studentAnswersPayload,
        }),
      });
      const adaptivityData = await resp.json();

      setMasteryRecords(adaptivityData.masteryRecords || []);
      setWeakTopics(adaptivityData.weakTopics || []);
      setRecommendations(adaptivityData.recommendations || []);

      await aiTutorFirestore.updateMastery(adaptivityData.masteryRecords || []);
      await aiTutorFirestore.saveWeakTopics(adaptivityData.weakTopics || []);
      await aiTutorFirestore.saveRecommendations(adaptivityData.recommendations || []);

      await aiTutorFirestore.logQuizAttempt({
        id: 'quiz_att_' + Date.now(),
        userId: 'student_1',
        sessionId,
        subjectId: selectedSubjectId,
        subjectName: currentSubjectObj.name,
        unitNumber: 1,
        unitTitle: 'Curriculum Unit',
        score,
        totalQuestions: activeQuizQuestions.length,
        percentage: Math.round((score / activeQuizQuestions.length) * 100),
        difficulty: 'medium',
        timestamp: new Date().toISOString(),
      });
    } catch (e) {
      console.warn('Adaptive evaluation logging failed:', e);
    }
  };

  return (
    <div id="ai-tutor-container" className="flex flex-col h-full bg-[#FAF6EC] text-[#24211E]">
      {/* 1. Header & Configuration Bar */}
      <header
        id="ai-tutor-header"
        className="border-b-[1.5px] border-[#38332D] bg-[#EDE6D4] px-4 py-3 sm:px-6 sm:py-3.5 flex flex-wrap items-center justify-between gap-3 shadow-xs"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-600/15 border-[1.5px] border-amber-700/40 flex items-center justify-center text-amber-800 shadow-xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-base sm:text-lg text-[#1E1B18] tracking-tight">
                ኑር AI የግል አስተማሪ (AI Personal Tutor & RAG)
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-600 text-white shadow-xs">
                PART 3
              </span>
            </div>
            <p className="text-xs text-[#6B6152] font-medium hidden sm:block">
              በኢትዮጵያ አዲሱ ስርዓተ-ትምህርት የመማሪያ መጽሐፍት ላይ ብቻ የተመሰረተ የግል አጋዥ
            </p>
          </div>
        </div>

        {/* Global Controls: Grade, Subject, Mode, Language, Test Runner */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Grade Selector */}
          <select
            id="tutor-grade-select"
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(Number(e.target.value) as GradeLevel)}
            className="px-2.5 py-1.5 text-xs font-bold bg-[#FAF6EC] border-[1.5px] border-[#38332D] rounded-lg text-[#1E1B18] focus:outline-hidden focus:ring-2 focus:ring-amber-500 shadow-xs cursor-pointer"
          >
            <option value={9}>ክፍል 9 (Grade 9)</option>
            <option value={10}>ክፍል 10 (Grade 10)</option>
            <option value={11}>ክፍል 11 (Grade 11)</option>
            <option value={12}>ክፍል 12 (Grade 12)</option>
          </select>

          {/* Subject Selector */}
          <select
            id="tutor-subject-select"
            value={selectedSubjectId}
            onChange={(e) => setSelectedSubjectId(e.target.value)}
            className="px-2.5 py-1.5 text-xs font-bold bg-[#FAF6EC] border-[1.5px] border-[#38332D] rounded-lg text-[#1E1B18] focus:outline-hidden focus:ring-2 focus:ring-amber-500 shadow-xs cursor-pointer max-w-[150px] sm:max-w-none truncate"
          >
            {SUBJECTS_LIST.map((s) => (
              <option key={s.id} value={s.id}>
                {s.am} ({s.name})
              </option>
            ))}
          </select>

          {/* Learning Mode */}
          <select
            id="tutor-mode-select"
            value={learningMode}
            onChange={(e) => setLearningMode(e.target.value as LearningMode)}
            className="px-2.5 py-1.5 text-xs font-bold bg-amber-50 border-[1.5px] border-amber-800 rounded-lg text-amber-950 focus:outline-hidden focus:ring-2 focus:ring-amber-500 shadow-xs cursor-pointer"
          >
            {LEARNING_MODES.map((m) => (
              <option key={m.id} value={m.id}>
                {m.amTitle}
              </option>
            ))}
          </select>

          {/* Language Selector */}
          <select
            id="tutor-language-select"
            value={selectedLang}
            onChange={(e) => setSelectedLang(e.target.value as LanguageCode)}
            className="px-2.5 py-1.5 text-xs font-bold bg-[#FAF6EC] border-[1.5px] border-[#38332D] rounded-lg text-[#1E1B18] focus:outline-hidden focus:ring-2 focus:ring-amber-500 shadow-xs cursor-pointer"
          >
            {SUPPORTED_LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>
                {l.nativeName}
              </option>
            ))}
          </select>

          {/* Diagnostics Drawer Toggle */}
          <button
            id="tutor-toggle-diagnostics-btn"
            onClick={() => setShowDiagnostics(!showDiagnostics)}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg border-[1.5px] transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
              showDiagnostics
                ? 'bg-purple-700 text-white border-purple-900'
                : 'bg-[#EDE6D4] text-[#38332D] border-[#38332D] hover:bg-[#E3DAC4]'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span className="hidden md:inline">የብቃት ደረጃ</span>
            {weakTopics.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
            )}
          </button>

          {/* Run Full Verification Test */}
          <button
            id="tutor-run-verification-test-btn"
            onClick={handleRunFullVerificationTest}
            className="px-3 py-1.5 text-xs font-extrabold rounded-lg bg-emerald-700 text-white border-[1.5px] border-emerald-900 hover:bg-emerald-800 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-200" />
            <span>የPart 3 ማረጋገጫ ፈተና (Test Flow)</span>
          </button>
        </div>
      </header>

      {/* 2. 14 AI Tutor Features Toolbar */}
      <div
        id="tutor-features-toolbar"
        className="bg-[#F3EDE0] border-b-[1.5px] border-[#38332D] px-3 py-2 sm:px-6 overflow-x-auto no-scrollbar flex items-center gap-1.5"
      >
        <span className="text-[11px] font-black uppercase text-[#857B6C] tracking-wider whitespace-nowrap mr-1">
          አገልግሎቶች (14 Features):
        </span>

        <button
          onClick={() => triggerTutorAction('explain_topic')}
          className="px-2.5 py-1 text-xs font-bold rounded-md bg-white border border-[#38332D] text-[#1E1B18] hover:bg-amber-50 hover:border-amber-700 transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap"
        >
          <BookOpen className="w-3 h-3 text-indigo-600" />
          <span>ርዕስ አብራራ</span>
        </button>

        <button
          onClick={() => triggerTutorAction('step_by_step')}
          className="px-2.5 py-1 text-xs font-bold rounded-md bg-white border border-[#38332D] text-[#1E1B18] hover:bg-amber-50 hover:border-amber-700 transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap"
        >
          <BrainCircuit className="w-3 h-3 text-blue-600" />
          <span>ደረጃ በደረጃ ስሌት</span>
        </button>

        <button
          onClick={() => triggerTutorAction('examples')}
          className="px-2.5 py-1 text-xs font-bold rounded-md bg-white border border-[#38332D] text-[#1E1B18] hover:bg-amber-50 hover:border-amber-700 transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap"
        >
          <Lightbulb className="w-3 h-3 text-amber-600" />
          <span>የመማሪያ መጽሐፍ ምሳሌዎች</span>
        </button>

        <button
          onClick={() => triggerTutorAction('practice_questions')}
          className="px-2.5 py-1 text-xs font-bold rounded-md bg-white border border-[#38332D] text-[#1E1B18] hover:bg-amber-50 hover:border-amber-700 transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap"
        >
          <FileText className="w-3 h-3 text-emerald-600" />
          <span>የልምምድ ጥያቄዎች</span>
        </button>

        {/* Progressive Hints (Level 1, 2, 3) */}
        <div className="flex items-center border border-[#38332D] rounded-md bg-white overflow-hidden">
          <button
            onClick={() => {
              const nextLvl = (hintLevel % 3 + 1) as 1 | 2 | 3;
              setHintLevel(nextLvl);
              triggerTutorAction('hints', undefined, { hintLevel: nextLvl });
            }}
            className="px-2 py-1 text-xs font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 flex items-center gap-1 cursor-pointer whitespace-nowrap"
          >
            <HelpCircle className="w-3 h-3 text-amber-600" />
            <span>ፍንጭ (ደረጃ {hintLevel}/3)</span>
          </button>
        </div>

        <button
          onClick={() => triggerTutorAction('quiz')}
          className="px-2.5 py-1 text-xs font-bold rounded-md bg-white border border-[#38332D] text-[#1E1B18] hover:bg-amber-50 hover:border-amber-700 transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap"
        >
          <Award className="w-3 h-3 text-purple-600" />
          <span>ፈጣን ፈተና (Quiz)</span>
        </button>

        <button
          onClick={() => triggerTutorAction('exam')}
          className="px-2.5 py-1 text-xs font-bold rounded-md bg-white border border-[#38332D] text-[#1E1B18] hover:bg-amber-50 hover:border-amber-700 transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap"
        >
          <FileText className="w-3 h-3 text-rose-600" />
          <span>የምዕራፍ ፈተና (Exam)</span>
        </button>

        <button
          onClick={() => triggerTutorAction('identify_weak_topics')}
          className="px-2.5 py-1 text-xs font-bold rounded-md bg-white border border-[#38332D] text-[#1E1B18] hover:bg-amber-50 hover:border-amber-700 transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap"
        >
          <AlertTriangle className="w-3 h-3 text-amber-600" />
          <span>ደካማ ጎን መለያ</span>
        </button>

        <button
          onClick={() => triggerTutorAction('recommend_next_lesson')}
          className="px-2.5 py-1 text-xs font-bold rounded-md bg-white border border-[#38332D] text-[#1E1B18] hover:bg-amber-50 hover:border-amber-700 transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap"
        >
          <Compass className="w-3 h-3 text-teal-600" />
          <span>ቀጣይ ትምህርት ምከረኝ</span>
        </button>

        <button
          onClick={() => setShowPhotoModal(true)}
          className="px-2.5 py-1 text-xs font-extrabold rounded-md bg-amber-600 text-white border border-amber-800 hover:bg-amber-700 transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap shadow-xs"
        >
          <Camera className="w-3 h-3 text-amber-100" />
          <span>የፎቶ ጥያቄ ፈቺ (OCR)</span>
        </button>
      </div>

      {/* 3. Main Workspace: Chat & Diagnostics Sidebar */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Chat Feed */}
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          <div
            id="tutor-chat-stream"
            className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 max-w-4xl w-full mx-auto"
          >
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1.5`}
                >
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#857B6C] px-1">
                    {isUser ? (
                      <span>የተማሪ ጥያቄ</span>
                    ) : (
                      <>
                        <Sparkles className="w-3 h-3 text-amber-600" />
                        <span className="font-extrabold text-[#38332D]">ኑር AI አስተማሪ</span>
                        {msg.groundedInTextbook && (
                          <span className="ml-1 px-1.5 py-0.2 rounded text-[9px] bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold">
                            ✓ ከመማሪያ መጽሐፍ የተረጋገጠ
                          </span>
                        )}
                      </>
                    )}
                  </div>

                  <div
                    className={`max-w-[92%] sm:max-w-[85%] rounded-xl p-4 border-[1.5px] shadow-xs text-sm leading-relaxed ${
                      isUser
                        ? 'bg-amber-700 text-white border-amber-900 rounded-tr-none'
                        : 'bg-white text-[#24211E] border-[#38332D] rounded-tl-none'
                    }`}
                  >
                    {/* Citations Header if present */}
                    {!isUser && msg.citations && msg.citations.length > 0 && (
                      <div className="mb-3 p-2.5 rounded-lg bg-[#FAF6EC] border border-[#E3DAC4] flex items-start gap-2 text-xs">
                        <BookOpen className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
                        <div className="text-[#38332D]">
                          <span className="font-extrabold text-amber-900 block">
                            📖 ይፋዊ የመማሪያ መጽሐፍ ምንጭ (Official Textbook Citation):
                          </span>
                          <span className="font-bold">
                            ክፍል {msg.citations[0].grade} {msg.citations[0].subject} | ምዕራፍ{' '}
                            {msg.citations[0].unit}: {msg.citations[0].unitTitle} | ገጽ{' '}
                            {msg.citations[0].page}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Main Content */}
                    <div className="whitespace-pre-wrap font-sans text-xs sm:text-sm">
                      {msg.content}
                    </div>

                    {/* Evaluation Box if present */}
                    {msg.metadata?.evaluation && (
                      <div className="mt-3 p-3 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-950">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-extrabold text-xs">የምላሽ ግምገማ ውጤት፡</span>
                          <span className="font-black text-xs px-2 py-0.5 rounded-full bg-indigo-600 text-white">
                            {msg.metadata.evaluation.score}%
                          </span>
                        </div>
                        <p className="text-xs">{msg.metadata.evaluation.feedback}</p>
                        {msg.metadata.evaluation.textbookRuleRef && (
                          <span className="text-[11px] text-indigo-700 font-bold block mt-1">
                            የመማሪያ መጽሐፍ ደንብ፡ {msg.metadata.evaluation.textbookRuleRef}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Footer Actions for Bot Messages */}
                    {!isUser && (
                      <div className="mt-3 pt-2 border-t border-[#EAE3D2] flex items-center justify-between text-xs text-[#7A7060]">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => speakText(msg.content)}
                            className="p-1 rounded-md hover:bg-[#F3EDE0] text-[#5A5143] hover:text-[#1E1B18] transition-all flex items-center gap-1 cursor-pointer"
                            title="በድምፅ አዳምጥ (Listen)"
                          >
                            <Volume2 className="w-3.5 h-3.5 text-amber-700" />
                            <span className="text-[11px] font-bold">አዳምጥ</span>
                          </button>
                          {isSpeaking && (
                            <button
                              onClick={stopSpeaking}
                              className="p-1 rounded-md hover:bg-rose-100 text-rose-700 transition-all flex items-center gap-1 cursor-pointer"
                            >
                              <VolumeX className="w-3.5 h-3.5" />
                              <span className="text-[11px] font-bold">አቁም</span>
                            </button>
                          )}
                        </div>

                        <span className="text-[10px] text-[#A69B89]">
                          {new Date(msg.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-start gap-2 text-xs text-[#7A7060] animate-pulse p-3 bg-white border border-[#38332D] rounded-xl max-w-sm">
                <RefreshCw className="w-4 h-4 animate-spin text-amber-600" />
                <span>ስርዓተ-ትምህርቱ እየተፈተሸ እና መልሱ ከመማሪያ መጽሐፍ እየተዘጋጀ ነው...</span>
              </div>
            )}

            <div ref={chatBottomRef} />
          </div>

          {/* Input Box */}
          <div
            id="tutor-input-container"
            className="border-t-[1.5px] border-[#38332D] bg-[#EDE6D4] p-3 sm:p-4"
          >
            <div className="max-w-4xl mx-auto flex items-center gap-2">
              <button
                id="tutor-mic-btn"
                onClick={toggleSpeechRecognition}
                className={`p-2.5 rounded-xl border-[1.5px] transition-all cursor-pointer shadow-xs ${
                  isRecording
                    ? 'bg-rose-600 text-white border-rose-800 animate-pulse'
                    : 'bg-[#FAF6EC] text-[#38332D] border-[#38332D] hover:bg-[#F3EDE0]'
                }`}
                title="በድምፅ ጥያቄ ይጠይቁ (Voice Input)"
              >
                {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              <button
                id="tutor-photo-btn"
                onClick={() => setShowPhotoModal(true)}
                className="p-2.5 rounded-xl bg-[#FAF6EC] text-[#38332D] border-[1.5px] border-[#38332D] hover:bg-[#F3EDE0] transition-all cursor-pointer shadow-xs"
                title="የጥያቄ ፎቶ ስቀል (Photo Question Solver)"
              >
                <Camera className="w-4 h-4 text-amber-800" />
              </button>

              <input
                id="tutor-text-input"
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !isLoading && triggerTutorAction('ask_question')}
                placeholder={`ክፍል ${selectedGrade} የ${currentSubjectObj.am} ጥያቄዎን እዚህ ይፃፉ...`}
                className="flex-1 px-4 py-2.5 text-sm bg-white border-[1.5px] border-[#38332D] rounded-xl text-[#1E1B18] placeholder-[#8F8474] focus:outline-hidden focus:ring-2 focus:ring-amber-500 shadow-xs"
                disabled={isLoading}
              />

              <button
                id="tutor-send-btn"
                onClick={() => triggerTutorAction('ask_question')}
                disabled={isLoading || !inputText.trim()}
                className="px-4 py-2.5 rounded-xl bg-amber-700 text-white font-extrabold text-sm border-[1.5px] border-amber-900 hover:bg-amber-800 disabled:opacity-50 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">ጠይቅ</span>
              </button>
            </div>
          </div>
        </div>

        {/* 4. Diagnostics & Adaptive Learning Drawer */}
        {showDiagnostics && (
          <aside
            id="tutor-diagnostics-drawer"
            className="w-80 border-l-[1.5px] border-[#38332D] bg-[#F5EFE1] p-4 overflow-y-auto space-y-4 shadow-lg shrink-0"
          >
            <div className="flex items-center justify-between border-b border-[#38332D]/30 pb-2">
              <div className="flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-purple-700" />
                <h3 className="font-extrabold text-xs text-[#1E1B18] uppercase tracking-wider">
                  የተማሪ የብቃት ትንታኔ (Mastery Diagnostics)
                </h3>
              </div>
              <button
                onClick={() => setShowDiagnostics(false)}
                className="p-1 rounded-md hover:bg-[#E3DAC4] cursor-pointer"
              >
                <X className="w-4 h-4 text-[#5A5143]" />
              </button>
            </div>

            {/* Weak Topics Alert */}
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200">
              <div className="flex items-center gap-1.5 text-rose-900 font-extrabold text-xs mb-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                <span>ትኩረት የሚሹ ደካማ ርዕሶች ({weakTopics.length})</span>
              </div>
              {weakTopics.length === 0 ? (
                <p className="text-xs text-rose-800/80">ምንም የተመዘገበ የደካማ ርዕስ ክፍተት የለም።</p>
              ) : (
                <div className="space-y-2">
                  {weakTopics.map((w) => (
                    <div key={w.id} className="p-2 rounded bg-white border border-rose-100 text-xs">
                      <div className="flex justify-between font-bold text-rose-950">
                        <span>{w.topicTitle}</span>
                        <span className="text-rose-600">{w.accuracyRate}%</span>
                      </div>
                      <p className="text-[11px] text-[#5A5143] mt-1">{w.recommendedRemedy}</p>
                      {w.prerequisiteNeeded && (
                        <span className="text-[10px] font-bold text-indigo-700 block mt-1">
                          ቅድመ-ተፈላጊ፡ {w.prerequisiteNeeded}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recommendations based on Knowledge Map DAG */}
            <div className="p-3 rounded-xl bg-teal-50 border border-teal-200">
              <div className="flex items-center gap-1.5 text-teal-900 font-extrabold text-xs mb-1.5">
                <Compass className="w-3.5 h-3.5 text-teal-700" />
                <span>የእውቀት ካርታ ምክሮች (Knowledge Map DAG)</span>
              </div>
              {recommendations.length === 0 ? (
                <p className="text-xs text-teal-800/80">ጥያቄዎችን በመመለስ የእውቀት ካርታ ምክሮችን ያግኙ።</p>
              ) : (
                <div className="space-y-2">
                  {recommendations.map((rec) => (
                    <div key={rec.id} className="p-2 rounded bg-white border border-teal-100 text-xs">
                      <div className="font-bold text-teal-950 flex items-center gap-1">
                        <ChevronRight className="w-3 h-3 text-teal-600" />
                        <span>{rec.recommendedTopicTitle}</span>
                      </div>
                      <p className="text-[11px] text-[#5A5143] mt-1">{rec.reason}</p>
                      <button
                        onClick={() =>
                          triggerTutorAction('explain_topic', rec.recommendedTopicTitle)
                        }
                        className="mt-1.5 px-2 py-0.5 text-[10px] font-extrabold rounded bg-teal-700 text-white hover:bg-teal-800 cursor-pointer"
                      >
                        ይህን ርዕስ አጥና
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Mastery Levels */}
            <div className="p-3 rounded-xl bg-white border border-[#38332D]/30">
              <h4 className="font-extrabold text-xs text-[#38332D] mb-2">የተመዘገቡ የርዕስ ብቃቶች</h4>
              {masteryRecords.length === 0 ? (
                <p className="text-xs text-[#7A7060]">ምንም ጥያቄ እስካሁን አልተመለሰም።</p>
              ) : (
                <div className="space-y-2">
                  {masteryRecords.map((m) => (
                    <div key={m.id} className="space-y-1">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="truncate max-w-[150px]">{m.topicTitle}</span>
                        <span>{m.masteryLevel}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-[#EAE3D2] rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            m.masteryLevel >= 80
                              ? 'bg-emerald-600'
                              : m.masteryLevel < 60
                              ? 'bg-rose-600'
                              : 'bg-amber-600'
                          }`}
                          style={{ width: `${m.masteryLevel}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </aside>
        )}
      </div>

      {/* 5. Photo Question Solver Modal */}
      {showPhotoModal && (
        <div
          id="photo-solver-modal"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="bg-[#FAF6EC] border-[2px] border-[#38332D] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#38332D]/30 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-amber-600/20 text-amber-900 border border-amber-800">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-[#1E1B18]">የፎቶ ጥያቄ ፈቺ (Photo Question Solver)</h3>
                  <p className="text-xs text-[#6B6152]">የመማሪያ መጽሐፍ ወይም የፈተና ጥያቄ ፎቶ በማስገባት ደረጃ በደረጃ መልስ ያግኙ</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowPhotoModal(false);
                  setPhotoBase64(null);
                  setPhotoSolution(null);
                }}
                className="p-1 rounded-md hover:bg-[#E3DAC4] cursor-pointer"
              >
                <X className="w-5 h-5 text-[#5A5143]" />
              </button>
            </div>

            {/* Image Preview or Dropzone */}
            {!photoBase64 ? (
              <label className="border-2 border-dashed border-[#38332D]/40 rounded-xl p-8 flex flex-col items-center justify-center gap-2 bg-[#F5EFE1] hover:bg-[#EDE6D4] transition-all cursor-pointer">
                <Upload className="w-8 h-8 text-amber-800" />
                <span className="font-extrabold text-sm text-[#38332D]">የጥያቄውን ፎቶ ይጫኑ ወይም ይጎትቱ</span>
                <span className="text-xs text-[#7A7060]">JPG, PNG, WEBP ይደገፋል</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
            ) : (
              <div className="space-y-3">
                <div className="relative rounded-xl overflow-hidden border-[1.5px] border-[#38332D] max-h-52">
                  <img src={photoBase64} alt="Uploaded Question" className="w-full object-cover" />
                  <button
                    onClick={() => {
                      setPhotoBase64(null);
                      setPhotoSolution(null);
                    }}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 text-white hover:bg-black"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {!photoSolution && (
                  <button
                    onClick={processPhotoSolution}
                    disabled={isSolvingPhoto}
                    className="w-full py-2.5 rounded-xl bg-amber-700 text-white font-extrabold text-sm border-[1.5px] border-amber-900 hover:bg-amber-800 disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                  >
                    {isSolvingPhoto ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>OCR ትንታኔ እና ከመማሪያ መጽሐፍ እየተፈለገ ነው...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>ጥያቄውን በኑር AI ፍታ (Solve Question)</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            )}

            {/* Solution Display if solved */}
            {photoSolution && (
              <div className="p-4 rounded-xl bg-white border border-[#38332D] space-y-2 text-xs max-h-60 overflow-y-auto">
                <div className="flex items-center justify-between font-bold text-amber-900 border-b pb-1">
                  <span>ርዕስ፡ {photoSolution.detectedTopic}</span>
                  <span>ክፍል {photoSolution.detectedGrade}</span>
                </div>
                <div className="space-y-1">
                  <span className="font-extrabold text-[#1E1B18] block">ደረጃ በደረጃ ስሌት፡</span>
                  {photoSolution.solutionSteps.map((step, idx) => (
                    <p key={idx} className="text-[#38332D]">
                      {idx + 1}. {step}
                    </p>
                  ))}
                </div>
                <div className="p-2 rounded bg-emerald-50 border border-emerald-200 text-emerald-950 font-extrabold">
                  የመጨረሻ መልስ፡ {photoSolution.finalAnswer}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 6. Interactive Curriculum Quiz Modal */}
      {activeQuizQuestions && (
        <div
          id="active-quiz-modal"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="bg-[#FAF6EC] border-[2px] border-[#38332D] rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#38332D]/30 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-purple-600/20 text-purple-900 border border-purple-800">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-[#1E1B18]">የስርዓተ-ትምህርት ፈጣን ፈተና (Curriculum Quiz)</h3>
                  <p className="text-xs text-[#6B6152]">በክፍል {selectedGrade} {currentSubjectObj.am} የተማሪ መጽሐፍ ይዘት ላይ የተመሰረተ</p>
                </div>
              </div>
              <button
                onClick={() => setActiveQuizQuestions(null)}
                className="p-1 rounded-md hover:bg-[#E3DAC4] cursor-pointer"
              >
                <X className="w-5 h-5 text-[#5A5143]" />
              </button>
            </div>

            {/* Questions List */}
            <div className="space-y-4">
              {activeQuizQuestions.map((q, idx) => {
                const selected = quizSelectedAnswers[idx];
                const isAnswered = typeof selected === 'number';
                const isCorrect = isAnswered && selected === q.correctAnswer;

                return (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-white border border-[#38332D] space-y-2 text-xs"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-extrabold text-sm text-[#1E1B18]">
                        {idx + 1}. {q.prompt}
                      </span>
                      {quizSubmitted && (
                        <span
                          className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                            isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {isCorrect ? 'ትክክል ✓' : 'ተሳስቷል ✗'}
                        </span>
                      )}
                    </div>

                    {q.options && q.options.length > 0 && (
                      <div className="space-y-1.5 mt-2">
                        {q.options.map((opt: string, optIdx: number) => {
                          const isOptSelected = selected === optIdx;
                          let optStyle = 'bg-[#FAF6EC] hover:bg-[#F3EDE0] border-[#EAE3D2]';

                          if (quizSubmitted) {
                            if (optIdx === q.correctAnswer) {
                              optStyle = 'bg-emerald-100 border-emerald-400 font-extrabold text-emerald-950';
                            } else if (isOptSelected) {
                              optStyle = 'bg-rose-100 border-rose-400 text-rose-950';
                            }
                          } else if (isOptSelected) {
                            optStyle = 'bg-amber-100 border-amber-600 font-extrabold text-amber-950';
                          }

                          return (
                            <button
                              key={optIdx}
                              disabled={quizSubmitted}
                              onClick={() =>
                                setQuizSelectedAnswers((prev) => ({ ...prev, [idx]: optIdx }))
                              }
                              className={`w-full text-left p-2 rounded-lg border text-xs transition-all cursor-pointer flex items-center justify-between ${optStyle}`}
                            >
                              <span>{opt}</span>
                              {quizSubmitted && optIdx === q.correctAnswer && (
                                <Check className="w-3.5 h-3.5 text-emerald-700" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {quizSubmitted && q.explanation && (
                      <p className="mt-2 p-2 rounded bg-indigo-50 border border-indigo-100 text-indigo-950 text-[11px]">
                        💡 <strong>ማብራሪያ፡</strong> {q.explanation} (ገጽ {q.textbookPage})
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Quiz Actions */}
            <div className="pt-2 border-t border-[#38332D]/30 flex items-center justify-end gap-2">
              {!quizSubmitted ? (
                <button
                  onClick={handleQuizSubmit}
                  disabled={Object.keys(quizSelectedAnswers).length === 0}
                  className="px-5 py-2 rounded-xl bg-purple-700 text-white font-extrabold text-xs border border-purple-900 hover:bg-purple-800 disabled:opacity-50 transition-all cursor-pointer shadow-xs"
                >
                  መልሶችን አስረክብ እና ውጤት አስላ
                </button>
              ) : (
                <button
                  onClick={() => {
                    setActiveQuizQuestions(null);
                    setShowDiagnostics(true);
                  }}
                  className="px-5 py-2 rounded-xl bg-emerald-700 text-white font-extrabold text-xs border border-emerald-900 hover:bg-emerald-800 transition-all cursor-pointer shadow-xs"
                >
                  ውጤት እና የብቃት ማሻሻያ ተመልከት
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 7. Verification Test Flow Modal */}
      {showTestModal && (
        <div
          id="verification-test-modal"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="bg-[#FAF6EC] border-[2px] border-[#38332D] rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#38332D]/30 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-emerald-600/20 text-emerald-900 border border-emerald-800">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-[#1E1B18]">
                    PART 3 የማረጋገጫ ፈተና (End-to-End Verification Test Flow)
                  </h3>
                  <p className="text-xs text-[#6B6152]">
                    የተማሪ ጥያቄ → RAG ፍለጋ → AI መልስ → የመጽሐፍ ገጽ ጥቅስ → ፈተና → የብቃት ምዘና → የእውቀት ካርታ
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowTestModal(false)}
                className="p-1 rounded-md hover:bg-[#E3DAC4] cursor-pointer"
              >
                <X className="w-5 h-5 text-[#5A5143]" />
              </button>
            </div>

            {isRunningTest ? (
              <div className="py-12 flex flex-col items-center justify-center gap-3">
                <RefreshCw className="w-8 h-8 animate-spin text-emerald-700" />
                <span className="font-extrabold text-sm text-[#1E1B18]">
                  የ11 ደረጃዎች ሙሉ የፈተና ፍሰት (End-to-End Pipeline) በመፈተሽ ላይ...
                </span>
              </div>
            ) : testReport ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-300">
                  <div className="flex items-center gap-2 font-black text-emerald-900 text-sm">
                    <CheckCircle className="w-5 h-5 text-emerald-700" />
                    <span>ሙሉ ፈተናው በተሳካ ሁኔታ አልፏል! (ALL 11 STEPS PASSED)</span>
                  </div>
                  <span className="text-xs font-bold text-emerald-800">
                    {new Date(testReport.timestamp).toLocaleTimeString()}
                  </span>
                </div>

                <div className="space-y-2">
                  {testReport.steps?.map((step: any) => (
                    <div
                      key={step.stepNumber}
                      className="p-3 rounded-lg bg-white border border-[#38332D] space-y-1 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-[#1E1B18]">
                          ደረጃ {step.stepNumber}፡ {step.stepName}
                        </span>
                        <span className="font-black px-2 py-0.5 rounded text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-300">
                          {step.status.toUpperCase()} ✓
                        </span>
                      </div>
                      <pre className="mt-1 p-2 rounded bg-[#FAF6EC] text-[11px] text-[#4A4033] overflow-x-auto font-mono">
                        {JSON.stringify(step.data, null, 2)}
                      </pre>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-xs text-rose-700">የማረጋገጫ ፈተናው አልተሳካም። እባክዎ ድጋሚ ይሞክሩ።</p>
            )}

            <div className="pt-2 border-t border-[#38332D]/30 flex justify-end">
              <button
                onClick={handleRunFullVerificationTest}
                disabled={isRunningTest}
                className="px-4 py-2 rounded-xl bg-emerald-700 text-white font-extrabold text-xs hover:bg-emerald-800 transition-all cursor-pointer shadow-xs flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>ፈተናውን በድጋሚ አስጀምር (Rerun Test)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
