import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  BookOpen,
  Camera,
  RotateCcw,
  HelpCircle,
  Zap,
  Send,
  X,
  AlertTriangle,
  Flame,
  CheckCircle,
  WifiOff,
  ChevronDown,
} from 'lucide-react';
import { Grade, LanguageCode } from '../../types';
import {
  TeachingMode,
  VoiceAudioState,
  VoiceCoachCommand,
  VoiceMessageRecord,
  CurriculumSourceMetadata,
} from '../../types/voiceTutor';
import { voiceTutorService } from '../../services/voiceTutorService';
import { subscriptionService } from '../../services/subscriptionService';
import { VoiceQuizCard } from './VoiceQuizCard';

const FormattedMessage: React.FC<{ text: string }> = ({ text }) => {
  const paragraphs = text.split('\n\n');
  return (
    <div className="space-y-2">
      {paragraphs.map((p, i) => {
        if (p.startsWith('- ') || p.startsWith('* ')) {
          const items = p.split('\n');
          return (
            <ul key={i} className="list-disc pl-5 space-y-1">
              {items.map((item, j) => (
                <li key={j}>{renderFormattedSpans(item.replace(/^[-*]\s+/, ''))}</li>
              ))}
            </ul>
          );
        }
        return (
          <p key={i} className="leading-relaxed">
            {renderFormattedSpans(p)}
          </p>
        );
      })}
    </div>
  );
};

function renderFormattedSpans(line: string) {
  const parts = line.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={idx} className="font-bold text-emerald-300">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

interface AIVoiceTutorModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultGrade?: Grade;
  defaultSubject?: string;
  defaultTopic?: string;
  defaultLanguage?: LanguageCode;
}

export const AIVoiceTutorModal: React.FC<AIVoiceTutorModalProps> = ({
  isOpen,
  onClose,
  defaultGrade = 11,
  defaultSubject = 'Mathematics',
  defaultTopic = 'Vectors and Matrices',
  defaultLanguage = 'am',
}) => {
  // Session parameters
  const [grade, setGrade] = useState<Grade>(defaultGrade);
  const [subject, setSubject] = useState<string>(defaultSubject);
  const [topic, setTopic] = useState<string>(defaultTopic);
  const [language, setLanguage] = useState<LanguageCode>(defaultLanguage);
  const [teachingMode, setTeachingMode] = useState<TeachingMode>('guided');

  // Audio and conversation states
  const [audioState, setAudioState] = useState<VoiceAudioState>('idle');
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);
  const [lowDataMode, setLowDataMode] = useState<boolean>(false);
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  // Messages and input
  const [messages, setMessages] = useState<VoiceMessageRecord[]>([]);
  const [inputText, setInputText] = useState<string>('');
  const [interimTranscript, setInterimTranscript] = useState<string>('');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [clarificationPrompt, setClarificationPrompt] = useState<string | null>(null);
  const [dailyQuota, setDailyQuota] = useState<{ allowed: boolean; remaining: number; usedToday: number; maxLimit: number }>({
    allowed: true,
    remaining: 10,
    usedToday: 0,
    maxLimit: 10,
  });

  const chatBottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Online / Offline listener
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Check subscription and quota
  useEffect(() => {
    if (!isOpen) return;

    const studentId = voiceTutorService.getUserId();
    const unsub = subscriptionService.subscribeToUserSubscription(studentId, (sub) => {
      const hasActive = sub?.status === 'ACTIVE';
      const quota = voiceTutorService.checkDailyUsageLimit(hasActive);
      setDailyQuota(quota);
    });

    // Start a voice session
    voiceTutorService.startSession(grade, subject, topic, language, teachingMode);

    // Initial greeting if empty
    if (messages.length === 0) {
      const greetingText =
        language === 'am'
          ? `ሰላም! እኔ የሁለተኛ ደረጃ (9-12) የኑር AI የግል የድምፅ አስተማሪህ ነኝ። በ${subject} ክፍል ${grade} ርዕስ "${topic}" ላይ የተዘጋጁ የመማሪያ መጽሐፍትን መሰረት በማድረግ ማብራሪያ ለመስጠት ዝግጁ ነኝ። በማይክሮፎኑ ተናገር ወይም ከታች ያሉትን አቋራጮች ተጠቀም።`
          : language === 'om'
          ? `Akkam! Ani barsiisaa sagalee NUR AI ti. Barnoota ${subject} Kutaa ${grade} mata-duree "${topic}" irratti kitaaba barataa qabachuun si gargaaruuf qophiidha. Maayikiroofoonii tuqiitii dubbadhu.`
          : language === 'ti'
          ? `ሰላም! ኣነ ናይ ኑር AI ናይ ድምጺ መምህርካ እየ። ኣብ ${subject} ክፍሊ ${grade} ርእሲ "${topic}" መጽሓፍ ተምሃራይ ብምጥቃም ንምሕጋዝ ድሉው እየ። ብድምጺ ተዛረብ።`
          : `Hello! I am your NUR AI High School Voice Tutor. I am ready to guide you through Grade ${grade} ${subject} (${topic}) strictly grounded in your Ethiopian Ministry of Education textbook. Tap the microphone to speak!`;

      const initialMessage: VoiceMessageRecord = {
        id: `init_${Date.now()}`,
        sessionId: 'init',
        sender: 'ai',
        text: greetingText,
        language,
        timestamp: new Date().toISOString(),
        confidence: 1.0,
      };
      setMessages([initialMessage]);
    }

    return () => {
      unsub();
      voiceTutorService.stopSpeaking();
      voiceTutorService.stopListening();
    };
  }, [isOpen, grade, subject, topic, language]);

  // Scroll to bottom on new messages
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, interimTranscript]);

  if (!isOpen) return null;

  // Language display map
  const langLabels: Record<LanguageCode, string> = {
    am: 'አማርኛ (Amharic)',
    om: 'Afaan Oromoo',
    ti: 'ትግርኛ (Tigrinya)',
    en: 'English',
    ar: 'العربية',
    so: 'Somali',
  };

  // Coaching quick commands
  const coachCommands: { label: string; intent: VoiceCoachCommand; icon: any }[] = [
    {
      label: language === 'am' ? 'ትምህርቱን አብራራልኝ' : language === 'om' ? 'Ibsa naaf kenni' : language === 'ti' ? 'መብርሂ ሃበኒ' : 'Explain lesson',
      intent: 'explain_lesson',
      icon: BookOpen,
    },
    {
      label: language === 'am' ? 'ምሳሌ ስጠኝ' : language === 'om' ? 'Fakkeenya kenni' : language === 'ti' ? 'ኣብነት ሃበኒ' : 'Give example',
      intent: 'give_example',
      icon: Sparkles,
    },
    {
      label: language === 'am' ? 'ፈተና ጠይቀኝ' : language === 'om' ? 'Gaaffii na gaafadhu' : language === 'ti' ? 'ሕቶ ሕተተኒ' : 'Quiz me',
      intent: 'quiz_me',
      icon: HelpCircle,
    },
    {
      label: language === 'am' ? 'ቀለል አድርገው' : language === 'om' ? 'Salphisi' : language === 'ti' ? 'ኣቕልለለይ' : 'Make it easier',
      intent: 'make_easier',
      icon: RotateCcw,
    },
    {
      label: language === 'am' ? 'ከበድ ያለ ጥያቄ' : language === 'om' ? 'Cimsi' : language === 'ti' ? 'ኣኽብደለይ' : 'Make it harder',
      intent: 'make_harder',
      icon: Zap,
    },
    {
      label: language === 'am' ? 'ደካማ ርዕሶቼን ከልስልኝ' : language === 'om' ? 'Hundummaa irra deebi\'i' : language === 'ti' ? 'ድኹም ርእሲ ተንትነለይ' : 'Review weak topics',
      intent: 'review_weak_topics',
      icon: Flame,
    },
  ];

  // Microphone toggle handler
  const handleToggleListening = () => {
    if (audioState === 'listening') {
      voiceTutorService.stopListening();
      setAudioState('idle');
      return;
    }

    voiceTutorService.stopSpeaking();
    setAudioState('listening');
    setInterimTranscript('');

    voiceTutorService.startListening(language, {
      onResult: (transcript, isFinal, confidence) => {
        setInterimTranscript(transcript);
        if (isFinal && transcript.trim()) {
          setAudioState('processing');
          handleSendQuery(transcript.trim(), undefined, true);
        }
      },
      onError: (err) => {
        console.warn('Microphone STT error:', err);
        setAudioState('idle');
      },
      onEnd: () => {
        setAudioState((prev) => (prev === 'listening' ? 'idle' : prev));
      },
    });
  };

  // Submit Query to Backend
  const handleSendQuery = async (
    userText: string,
    explicitIntent?: VoiceCoachCommand,
    wasVoice: boolean = false
  ) => {
    if (!userText.trim() && !photoPreview) return;

    if (!isOnline) {
      alert('Live AI Voice requires an internet connection. Previously cached materials remain available in your offline library.');
      setAudioState('idle');
      return;
    }

    // Check daily quota
    if (!dailyQuota.allowed && dailyQuota.remaining <= 0) {
      alert('Daily voice AI request limit reached. Please upgrade your subscription for unlimited access.');
      setAudioState('idle');
      return;
    }

    const userMessageId = `usr_${Date.now()}`;
    const userRecord: VoiceMessageRecord = {
      id: userMessageId,
      sessionId: 'active',
      sender: 'student',
      text: userText,
      language,
      timestamp: new Date().toISOString(),
      audioMetadata: { wasVoiceInput: wasVoice },
      photoUrl: photoPreview || undefined,
    };

    setMessages((prev) => [...prev, userRecord]);
    setInputText('');
    setInterimTranscript('');
    setClarificationPrompt(null);
    setAudioState('generating');

    try {
      // Build conversation history format
      const history = messages.slice(-5).map((m) => ({
        role: (m.sender === 'student' ? 'user' : 'assistant') as 'user' | 'assistant',
        text: m.text,
      }));

      const res = await voiceTutorService.sendVoiceQuery({
        message: userText,
        grade,
        subject,
        topic,
        language,
        teachingMode,
        voiceIntent: explicitIntent,
        photoData: photoPreview || undefined,
        wasVoiceInput: wasVoice,
        history,
      });

      const aiRecord: VoiceMessageRecord = {
        id: res.messageId,
        sessionId: 'active',
        sender: 'ai',
        text: res.answer,
        spokenScript: res.spokenScript,
        language,
        timestamp: new Date().toISOString(),
        confidence: res.confidence,
        sourceMetadata: res.citations?.[0],
        interactiveQuiz: res.interactiveQuiz,
        clarificationPrompt: res.clarificationPrompt,
      };

      setMessages((prev) => [...prev, aiRecord]);

      if (res.clarificationPrompt) {
        setClarificationPrompt(res.clarificationPrompt);
      }

      // Update remaining quota
      setDailyQuota((prev) => ({
        ...prev,
        usedToday: prev.usedToday + 1,
        remaining: Math.max(0, prev.remaining - 1),
      }));

      // Speak response if audio is enabled and not muted
      if (!isAudioMuted && !lowDataMode && res.spokenScript) {
        setAudioState('speaking');
        voiceTutorService.speak(res.spokenScript, language, {
          onEnd: () => setAudioState('idle'),
          onError: () => setAudioState('idle'),
        });
      } else {
        setAudioState('idle');
      }

      // Reset photo preview after successful submission
      setPhotoPreview(null);
    } catch (err: any) {
      console.error('Voice tutor send query failed:', err);
      setAudioState('idle');
      const errRecord: VoiceMessageRecord = {
        id: `err_${Date.now()}`,
        sessionId: 'active',
        sender: 'ai',
        text: `⚠️ **Error**: ${err.message || 'Could not connect to Voice Tutor service. Please check your network and try again.'}`,
        language,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errRecord]);
    }
  };

  // Photo upload handler
  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setPhotoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-2 sm:p-4">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-4xl h-[94vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Top Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-900/90 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-100">
                  {language === 'am' ? 'ኑር AI የድምፅ አስተማሪ' : language === 'om' ? 'NUR AI Barsiisaa Sagalee' : language === 'ti' ? 'ኑር AI መምህር ድምጺ' : 'NUR AI Voice Tutor'}
                </h3>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {teachingMode}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {subject} • Grade {grade} • {topic}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Language Selector */}
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as LanguageCode)}
              className="bg-slate-800 border border-slate-700 text-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-medium focus:outline-none focus:border-emerald-500"
            >
              <option value="am">አማርኛ (Amharic)</option>
              <option value="om">Afaan Oromoo</option>
              <option value="ti">ትግርኛ (Tigrinya)</option>
              <option value="en">English</option>
            </select>

            {/* Teaching Mode Selector */}
            <select
              value={teachingMode}
              onChange={(e) => setTeachingMode(e.target.value as TeachingMode)}
              className="bg-slate-800 border border-slate-700 text-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-medium focus:outline-none focus:border-emerald-500 hidden sm:block"
            >
              <option value="beginner">Beginner (መሰረታዊ)</option>
              <option value="guided">Guided (ደረጃ በደረጃ)</option>
              <option value="practice">Practice (ልምምድ)</option>
              <option value="mastery">Mastery (የፈተና ደረጃ)</option>
            </select>

            {/* Mute Audio Toggle */}
            <button
              type="button"
              onClick={() => {
                if (!isAudioMuted) {
                  voiceTutorService.stopSpeaking();
                }
                setIsAudioMuted(!isAudioMuted);
              }}
              className={`p-2 rounded-xl border transition ${
                isAudioMuted
                  ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-emerald-400'
              }`}
              title={isAudioMuted ? 'Unmute Audio' : 'Mute Audio'}
            >
              {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Close Modal */}
            <button
              type="button"
              onClick={() => {
                voiceTutorService.endSession();
                onClose();
              }}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Offline Warning Banner */}
        {!isOnline && (
          <div className="bg-amber-950/80 border-b border-amber-500/40 px-4 py-2 flex items-center gap-2 text-amber-200 text-xs">
            <WifiOff className="w-4 h-4 shrink-0" />
            <span>
              {language === 'am'
                ? 'ከመስመር ውጭ ነዎት። የቀጥታ AI ድምፅ አገልግሎት ኢንተርኔት ይፈልጋል። አስቀድመው የወረዱ ትምህርቶች በቤተ-መጽሐፍትዎ ይገኛሉ።'
                : 'You are offline. Live AI Voice requires internet connection. Previously downloaded units are accessible in your offline library.'}
            </span>
          </div>
        )}

        {/* Conversation Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.sender === 'student' ? 'items-end' : 'items-start'
              }`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-3xl p-4 sm:p-5 shadow-md ${
                  msg.sender === 'student'
                    ? 'bg-emerald-600 text-white rounded-br-none'
                    : 'bg-slate-800/90 border border-slate-700/80 text-slate-100 rounded-bl-none'
                }`}
              >
                {/* Photo attachment if present */}
                {msg.photoUrl && (
                  <img
                    src={msg.photoUrl}
                    alt="Question"
                    className="max-h-48 rounded-xl mb-3 object-cover border border-white/20"
                  />
                )}

                {/* Message Text with Formatted Spans */}
                <div className="text-sm sm:text-base leading-relaxed break-words text-slate-100">
                  <FormattedMessage text={msg.text} />
                </div>

                {/* Interactive Voice Quiz if generated */}
                {msg.interactiveQuiz && (
                  <VoiceQuizCard
                    quiz={msg.interactiveQuiz}
                    language={language}
                    onQuizCompleted={(isCorrect, feedback) => {
                      // Handled within quiz card
                    }}
                  />
                )}

                {/* Curriculum Source Citation Card */}
                {msg.sourceMetadata && (
                  <div className="mt-3 pt-3 border-t border-slate-700/60 flex items-start gap-2 text-xs text-emerald-400/90">
                    <BookOpen className="w-4 h-4 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold block text-slate-300">
                        {msg.sourceMetadata.textbookTitle}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        Grade {msg.sourceMetadata.grade} • Unit {msg.sourceMetadata.unitNumber} ({msg.sourceMetadata.unitTitle}) • Page ~{msg.sourceMetadata.page}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 mt-1 px-2 text-[10px] text-slate-500">
                <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                {msg.audioMetadata?.wasVoiceInput && (
                  <span className="flex items-center gap-1 text-emerald-400">
                    <Mic className="w-3 h-3" /> Voice
                  </span>
                )}
              </div>
            </div>
          ))}

          {/* Real-time Interim Transcription Bubble */}
          {interimTranscript && (
            <div className="flex flex-col items-end">
              <div className="max-w-[75%] rounded-3xl rounded-br-none p-4 bg-emerald-700/70 text-white animate-pulse text-sm">
                <span className="italic">"{interimTranscript}"</span>
              </div>
            </div>
          )}

          {/* Math/Science Clarification Banner (e.g. 15 vs 50) */}
          {clarificationPrompt && (
            <div className="bg-amber-500/15 border border-amber-500/40 rounded-2xl p-3.5 my-2 flex items-center justify-between gap-3 text-amber-200 text-xs">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{clarificationPrompt}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handleSendQuery('Confirm 15 (fifteen)', undefined, true)}
                  className="px-2.5 py-1 bg-amber-500 text-slate-950 font-bold rounded-lg hover:bg-amber-400 transition"
                >
                  15
                </button>
                <button
                  type="button"
                  onClick={() => handleSendQuery('Confirm 50 (fifty)', undefined, true)}
                  className="px-2.5 py-1 bg-amber-500 text-slate-950 font-bold rounded-lg hover:bg-amber-400 transition"
                >
                  50
                </button>
              </div>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Quick Voice Coach Command Chips */}
        <div className="px-4 py-2 border-t border-slate-800 bg-slate-900/90 overflow-x-auto no-scrollbar flex items-center gap-2">
          {coachCommands.map((cmd, idx) => {
            const Icon = cmd.icon;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendQuery(cmd.label, cmd.intent, false)}
                className="whitespace-nowrap px-3 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-medium text-slate-300 hover:text-emerald-400 flex items-center gap-1.5 transition shrink-0"
              >
                <Icon className="w-3.5 h-3.5 text-emerald-400" />
                <span>{cmd.label}</span>
              </button>
            );
          })}
        </div>

        {/* Bottom Voice Control Deck */}
        <div className="p-4 border-t border-slate-800 bg-slate-900 flex flex-col gap-3">
          {/* Status Indicator Bar */}
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <div className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${
                  audioState === 'listening'
                    ? 'bg-rose-500 animate-ping'
                    : audioState === 'speaking'
                    ? 'bg-amber-400 animate-pulse'
                    : audioState === 'generating'
                    ? 'bg-blue-400 animate-spin'
                    : 'bg-emerald-500'
                }`}
              />
              <span className="font-medium text-slate-300">
                {audioState === 'listening'
                  ? language === 'am' ? 'እያዳመጠ ነው...' : 'Listening...'
                  : audioState === 'generating'
                  ? language === 'am' ? 'መልስ በማመንጨት ላይ...' : 'Generating answer...'
                  : audioState === 'speaking'
                  ? language === 'am' ? 'እየተናገረ ነው...' : 'Speaking response...'
                  : language === 'am' ? 'ዝግጁ ነው (መናገር ይችላሉ)' : 'Ready (Tap mic to speak)'}
              </span>
            </div>

            {/* Daily Usage indicator */}
            <span className="text-[11px] text-slate-500">
              {dailyQuota.remaining} requests left today
            </span>
          </div>

          {/* Main Voice and Text input row */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Photo Question Solver button */}
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handlePhotoSelect}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={`p-3 rounded-2xl border transition ${
                photoPreview
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
              title="Attach Textbook Photo Question"
            >
              <Camera className="w-5 h-5" />
            </button>

            {/* Text Input Fallback */}
            <div className="flex-1 relative">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendQuery(inputText, undefined, false);
                  }
                }}
                placeholder={
                  language === 'am'
                    ? 'ጥያቄዎን እዚህ ይተይቡ ወይም በማይኩ ይናገሩ...'
                    : language === 'om'
                    ? 'Gaaffii kee barreessi ykn sagaleen dubbadhu...'
                    : language === 'ti'
                    ? 'ሕቶኻ ኣብዚ ጽሓፍ ወይ ብድምጺ ተዛረብ...'
                    : 'Type a curriculum question or speak...'
                }
                className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 pr-10"
              />
              {inputText.trim() && (
                <button
                  type="button"
                  onClick={() => handleSendQuery(inputText, undefined, false)}
                  className="absolute right-2.5 top-2.5 p-1.5 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl transition"
                >
                  <Send className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Central Animated Microphone Button */}
            <button
              type="button"
              onClick={handleToggleListening}
              className={`relative p-4 rounded-2xl text-white font-bold transition shadow-xl flex items-center justify-center ${
                audioState === 'listening'
                  ? 'bg-rose-600 ring-4 ring-rose-500/40 animate-pulse'
                  : 'bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400'
              }`}
              title="Hold or Tap to Speak"
            >
              <Mic className={`w-6 h-6 ${audioState === 'listening' ? 'scale-110' : ''}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
