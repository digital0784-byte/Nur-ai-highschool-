import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Camera,
  Mic,
  MicOff,
  Sparkles,
  BookOpen,
  CheckCircle2,
  RefreshCw,
  Lightbulb,
  ArrowRight,
  HelpCircle,
  FileText,
  Bot,
  User,
  ChevronRight,
  Upload,
  Image as ImageIcon,
  Check,
  Zap,
} from 'lucide-react';
import { GradeLevel, CurriculumSubjectItem } from '../../types/curriculumEngine';
import { LanguageCode } from '../../types';
import { ethiopianCurriculumEngine } from '../../engine/curriculumRegistry';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

interface Message {
  id: string;
  sender: 'student' | 'ai';
  text: string;
  timestamp: string;
  photoUrl?: string;
  isAudio?: boolean;
  citation?: {
    textbook: string;
    unit: string;
    section: string;
    pageRange?: string;
  };
  steps?: { stepNumber: number; title: string; description: string }[];
  relatedTopics?: { id: string; title: string }[];
}

interface StudentAITutorViewProps {
  grade: GradeLevel;
  language: LanguageCode;
  onNavigateToTopic?: (subjectId: string, topicId: string) => void;
}

export const StudentAITutorView: React.FC<StudentAITutorViewProps> = ({
  grade,
  language,
  onNavigateToTopic,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      sender: 'ai',
      text:
        language === 'am'
          ? `ሰላም! እኔ ኑር AI (NUR AI) የ 2019 ዓ.ም የኢትዮጵያ ሁለተኛ ደረጃ ሥርዓተ-ትምህርት የግል አስተማሪዎ ነኝ። የፈለጉትን የትምህርት ጥያቄ በፅሁፍ፣ በፎቶ ወይም በድምፅ ሊጠይቁኝ ይችላሉ። ምን ላብራራልዎ?`
          : `Hello! I am NUR AI, your dedicated tutor for the Ethiopian Secondary Curriculum. You can ask me any question using text, photo snapshot, or voice! What concept would you like to explore today?`,
      timestamp: 'Just now',
      relatedTopics: [
        { id: 'math-g9-u1-t1', title: language === 'am' ? 'የግንኙነቶችና ፈንክሽኖች ባህሪያት' : 'Relations & Functions' },
        { id: 'physics-g9-u1-t1', title: language === 'am' ? 'ቬክተሮችና ስኬላሮች' : 'Vectors & Scalars' },
        { id: 'chem-g9-u1-t1', title: language === 'am' ? 'የአቶም መዋቅር' : 'Atomic Structure' },
      ],
    },
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (queryText = inputQuery, attachedPhoto = photoPreview) => {
    const trimmed = queryText.trim();
    if (!trimmed && !attachedPhoto) return;

    const studentMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: 'student',
      text: trimmed || (language === 'am' ? 'የተላከ የፎቶ ጥያቄ' : 'Attached question snapshot'),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      photoUrl: attachedPhoto || undefined,
    };

    setMessages((prev) => [...prev, studentMsg]);
    setInputQuery('');
    setPhotoPreview(null);
    setIsTyping(true);

    // Simulate intelligent Socratic / RAG generation with textbook citations
    setTimeout(() => {
      let aiResponseText = '';
      let steps: { stepNumber: number; title: string; description: string }[] | undefined;
      let citation = {
        textbook: `FDRE Ministry of Education Grade ${grade} Curriculum`,
        unit: 'Unit 1: Core Principles',
        section: 'Section 1.2: Analysis & Problem Solving',
        pageRange: 'pp. 14-22',
      };

      if (trimmed.toLowerCase().includes('vector') || trimmed.toLowerCase().includes('ቬክተር')) {
        aiResponseText =
          language === 'am'
            ? 'ቬክተር (Vector) ሁለቱንም መጠን (Magnitude) እና አቅጣጫ (Direction) የያዘ አካላዊ መጠን ነው። ለምሳሌ የፍጥነት መለኪያ (Velocity) እና ኃይል (Force) ቬክተሮች ናቸው።'
            : 'A vector is a physical quantity that has both magnitude and direction. Examples in Grade 9/10 Physics include displacement, velocity, and force.';
        steps = [
          { stepNumber: 1, title: 'ስኬላር (Scalar)', description: 'መጠን ብቻ ያለው (ለምሳሌ፡ ጊዜ፣ ርዝመት)' },
          { stepNumber: 2, title: 'ቬክተር (Vector)', description: 'መጠንና አቅጣጫ ያለው (ለምሳሌ፡ ፍጥነት፣ ኃይል)' },
          { stepNumber: 3, title: 'የመደመር ህግ (Vector Addition)', description: 'የሶስት ማዕዘን ወይም የፓራሌሎግራም ህግን በመጠቀም' },
        ];
      } else if (trimmed.toLowerCase().includes('function') || trimmed.toLowerCase().includes('ፈንክሽን') || trimmed.toLowerCase().includes('math')) {
        aiResponseText =
          language === 'am'
            ? 'ፈንክሽን (Function) ማለት በሁለት ስብስቦች (Sets) መካከል ያለ ግንኙነት ሲሆን፣ በዶሜኑ (Domain) ውስጥ ላለ ለእያንዳንዱ አባል አንድና አንድ ብቻ ዋጋ በሬንጁ (Range) ውስጥ ሲኖረው ነው።'
            : 'A function is a special type of relation where each element in the domain is paired with exactly one unique element in the codomain/range.';
        steps = [
          { stepNumber: 1, title: 'ደረጃ 1: ዶሜኑን ለይ (Identify Domain)', description: 'ግብዓት የሚሆኑትን ዋጋዎች (x-values) ሰብስብ' },
          { stepNumber: 2, title: 'ደረጃ 2: የቁጥር መስመር ፈተና (Vertical Line Test)', description: 'አቀባዊ መስመር ግራፉን በአንድ ቦታ ብቻ የሚያቋርጥ መሆኑን አረጋግጥ' },
          { stepNumber: 3, title: 'ደረጃ 3: ሬንጁን አስላ (Determine Range)', description: 'የውጤቱን ስብስብ (y-values) ጻፍ' },
        ];
      } else {
        aiResponseText =
          language === 'am'
            ? `ለጥያቄዎ እናመሰግናለን! በኢ.ፌ.ዲ.ሪ የ ${grade}ኛ ክፍል ሥርዓተ-ትምህርት መሠረት፣ ይህ ፅንሰ-ሀሳብ በዋናነት የተማሪዎችን የመረዳትና የመተንተን አቅም ለማሳደግ ታስቦ የተዘጋጀ ነው።`
            : `Based on your Grade ${grade} Ethiopian curriculum, here is the detailed breakdown and conceptual explanation:`;
        steps = [
          { stepNumber: 1, title: 'Core Definition', description: 'Fundamental definition based on FDRE Ministry syllabus' },
          { stepNumber: 2, title: 'Application Example', description: 'Real-world local Ethiopian application in science and industry' },
        ];
      }

      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: aiResponseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        citation,
        steps,
        relatedTopics: [
          { id: 'math-g9-u1-t1', title: language === 'am' ? 'የግንኙነቶች አይነቶች' : 'Types of Relations' },
          { id: 'physics-g9-u1-t1', title: language === 'am' ? 'የእንቅስቃሴ ህጎች' : 'Newtonian Mechanics' },
        ],
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 900);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPhotoPreview(reader.result as string);
        setIsPhotoModalOpen(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleToggleVoice = () => {
    if (!isRecording) {
      setIsRecording(true);
      setTimeout(() => {
        setIsRecording(false);
        handleSend(
          language === 'am'
            ? 'የኒውተን ሁለተኛ የእንቅስቃሴ ህግን (F = ma) በምሳሌ አስረዳኝ?'
            : "Explain Newton's Second Law of Motion (F = ma) with a step-by-step example?"
        );
      }, 2500);
    } else {
      setIsRecording(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(85vh-3rem)] max-w-4xl mx-auto bg-white rounded-3xl border border-stone-200/90 shadow-sm overflow-hidden">
      {/* 1. TUTOR TOP BAR */}
      <div className="px-5 py-4 border-b border-stone-100 flex items-center justify-between bg-stone-50/60 shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black shadow-xs">
              <Bot className="w-5 h-5" />
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-white rounded-full" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-stone-900 font-serif-ethiopic">
                ኑር AI (NUR AI Personal Tutor)
              </h3>
              <Badge variant="success" size="xs" dot>
                {language === 'am' ? 'ንቁ (Active)' : 'Online'}
              </Badge>
            </div>
            <p className="text-[11px] text-stone-500">
              {language === 'am'
                ? `ክፍል ${grade} • የተረጋገጠ የስርዓተ-ትምህርት ምንጭ`
                : `Grade ${grade} • Verified Ethiopian Curriculum RAG`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-stone-500">
          <span className="hidden sm:inline font-mono">Socratic RAG v3.2</span>
        </div>
      </div>

      {/* 2. CHAT SCROLL AREA */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-stone-50/30">
        {messages.map((msg) => {
          const isStudent = msg.sender === 'student';

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isStudent ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                  isStudent ? 'bg-stone-800 text-white' : 'bg-emerald-600 text-white'
                }`}
              >
                {isStudent ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
              </div>

              {/* Message Content Container */}
              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 shadow-xs space-y-3 ${
                  isStudent
                    ? 'bg-stone-900 text-white rounded-tr-none'
                    : 'bg-white text-stone-900 border border-stone-200/80 rounded-tl-none'
                }`}
              >
                {/* Photo attachment if present */}
                {msg.photoUrl && (
                  <div className="rounded-xl overflow-hidden max-h-48 border border-white/20 mb-2">
                    <img
                      src={msg.photoUrl}
                      alt="Question attachment"
                      className="w-full object-cover"
                    />
                  </div>
                )}

                {/* Primary Text */}
                <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>

                {/* Step-by-step Solution Cards if provided by AI */}
                {msg.steps && msg.steps.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-stone-100 space-y-2">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {language === 'am' ? 'ደረጃ በደረጃ ማብራሪያ' : 'Step-by-Step Solution'}
                    </h5>
                    {msg.steps.map((step) => (
                      <div
                        key={step.stepNumber}
                        className="p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-100 text-xs"
                      >
                        <span className="font-bold text-emerald-950 font-mono">
                          {step.stepNumber}. {step.title}
                        </span>
                        <p className="text-stone-600 text-[11px] mt-0.5">{step.description}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Source & Textbook Citation Area */}
                {msg.citation && (
                  <div className="pt-2 border-t border-stone-100 flex items-center gap-2 text-[11px] text-stone-400">
                    <BookOpen className="w-3 h-3 text-emerald-600 shrink-0" />
                    <span className="truncate">
                      {msg.citation.textbook} • {msg.citation.unit} ({msg.citation.section})
                    </span>
                  </div>
                )}

                {/* Related Topic Suggestions Chips */}
                {msg.relatedTopics && msg.relatedTopics.length > 0 && (
                  <div className="pt-2 border-t border-stone-100 flex flex-wrap gap-1.5">
                    {msg.relatedTopics.map((top) => (
                      <button
                        key={top.id}
                        onClick={() => handleSend(top.title)}
                        className="text-[10px] font-bold px-2 py-1 rounded-lg bg-stone-100 text-stone-700 hover:bg-emerald-100 hover:text-emerald-900 transition-colors cursor-pointer"
                      >
                        + {top.title}
                      </button>
                    ))}
                  </div>
                )}

                {/* Timestamp */}
                <div
                  className={`text-[10px] text-right pt-1 ${
                    isStudent ? 'text-stone-400' : 'text-stone-400'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {/* AI Typing Indicator */}
        {isTyping && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-xs shrink-0">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="bg-white border border-stone-200 rounded-2xl px-4 py-2.5 shadow-xs flex items-center gap-2 text-xs text-stone-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" />
              <span
                className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce"
                style={{ animationDelay: '0.2s' }}
              />
              <span
                className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce"
                style={{ animationDelay: '0.4s' }}
              />
              <span className="text-stone-400 text-[11px] ml-1 font-serif-ethiopic">
                {language === 'am' ? 'መልስ በማዘጋጀት ላይ...' : 'Formulating response from curriculum...'}
              </span>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* 3. PHOTO PREVIEW STRIP IF ATTACHED */}
      {photoPreview && (
        <div className="px-5 py-2 bg-stone-100 border-t border-stone-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-bold text-stone-800">
              {language === 'am' ? 'የተያያዘ ፎቶ (Snapshot Ready)' : 'Photo Ready for Analysis'}
            </span>
          </div>
          <button
            onClick={() => setPhotoPreview(null)}
            className="text-xs font-bold text-rose-600 hover:text-rose-800 cursor-pointer"
          >
            {language === 'am' ? 'ሰርዝ' : 'Remove'}
          </button>
        </div>
      )}

      {/* 4. CHAT INPUT BAR WITH PHOTO & VOICE ACTIONS */}
      <div className="p-3 sm:p-4 border-t border-stone-100 bg-white shrink-0">
        {/* Preset quick question pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-2 mb-1">
          {[
            language === 'am' ? 'ይህንን ፅንሰ-ሀሳብ በቀላሉ አስረዳኝ' : 'Explain this concept simply',
            language === 'am' ? 'ደረጃ በደረጃ ምሳሌ ስጠኝ' : 'Give a worked example',
            language === 'am' ? 'የፈተና ጥያቄዎችን አሳይኝ' : 'Key exam questions',
          ].map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 whitespace-nowrap cursor-pointer transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {/* Photo Trigger */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handlePhotoUpload}
            accept="image/*"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2.5 rounded-xl border border-stone-200 text-stone-600 hover:text-emerald-700 hover:bg-emerald-50 cursor-pointer transition-colors shrink-0"
            title="Upload equation / question photo"
          >
            <Camera className="w-5 h-5" />
          </button>

          {/* Voice Question Trigger */}
          <button
            onClick={handleToggleVoice}
            className={`p-2.5 rounded-xl border cursor-pointer transition-all shrink-0 ${
              isRecording
                ? 'bg-rose-600 text-white border-rose-600 animate-pulse'
                : 'border-stone-200 text-stone-600 hover:text-emerald-700 hover:bg-emerald-50'
            }`}
            title="Ask via voice"
          >
            {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Input field */}
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend();
            }}
            placeholder={
              isRecording
                ? language === 'am' ? 'እያዳመጥኩ ነው... ተናገሩ' : 'Listening... Speak now'
                : language === 'am'
                ? 'የፈለጉትን ጥያቄ ይጠይቁ (ሒሳብ፣ ፊዚክስ፣ ኬሚስትሪ...)'
                : 'Ask any question (Math, Physics, Chemistry...)'
            }
            className="flex-1 bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
          />

          {/* Send Button */}
          <Button
            variant="primary"
            size="md"
            onClick={() => handleSend()}
            disabled={!inputQuery.trim() && !photoPreview}
            className="shrink-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
