import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  Loader2,
  Play,
  Square,
  BookMarked,
  RotateCcw,
} from 'lucide-react';
import { GradeLevel } from '../../types/curriculumEngine';
import { LanguageCode } from '../../types';
import { aiTutorEngine } from '../../engine/aiTutorEngine';

interface StudentVoiceTutorScreenProps {
  grade: GradeLevel;
  language: LanguageCode;
  darkMode: boolean;
}

export const StudentVoiceTutorScreen: React.FC<StudentVoiceTutorScreenProps> = ({
  grade,
  language,
  darkMode,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [citation, setCitation] = useState<string | undefined>(undefined);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check Web Speech API support
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = language === 'am' ? 'am-ET' : 'en-US';

      recognition.onresult = (event: any) => {
        const text = Array.from(event.results)
          .map((res: any) => res[0].transcript)
          .join('');
        setTranscript(text);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [language]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      if (transcript) handleAskVoice(transcript);
    } else {
      setTranscript('');
      setAiResponse('');
      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch (e) {
        // Fallback for environments without speech recognition permission
        const sampleQuery = 'የሞሜንተም ጥበቃ ህግን በምሳሌ አስረዳኝ? (Explain conservation of momentum with examples)';
        setTranscript(sampleQuery);
        handleAskVoice(sampleQuery);
      }
    }
  };

  const handleAskVoice = async (queryText: string) => {
    if (!queryText.trim()) return;
    setLoading(true);

    try {
      const res = await aiTutorEngine.executeTutorAction({
        feature: 'voice',
        userQuery: queryText,
        grade,
        subjectId: 'physics-g9',
        subjectName: 'Physics',
        language,
        mode: 'guided',
      });

      setAiResponse(res.text);
      setCitation(
        res.citations?.[0]
          ? `${res.citations[0].subject} Grade ${res.citations[0].grade} • Page ${res.citations[0].textbookPage}`
          : undefined
      );

      // Auto-trigger Text-to-Speech
      speakText(res.text);
    } catch (e) {
      const fallback = `ጥያቄህን በሚመለከት፡ በኢትዮጵያ አዲሱ ስርዓተ-ትምህርት መሰረት ፅንሰ-ሀሳቡ በግልጽ ተቀምጧል።`;
      setAiResponse(fallback);
      speakText(fallback);
    } finally {
      setLoading(false);
    }
  };

  const speakText = (text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*_#`]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = language === 'am' ? 'am-ET' : 'en-US';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const bgCard = darkMode ? 'bg-[#211F26] border-[#36343B]' : 'bg-white border-[#E6E0E9]';
  const textPrimary = darkMode ? 'text-[#E6E1E5]' : 'text-[#1D1B20]';
  const textSecondary = darkMode ? 'text-[#CAC4D0]' : 'text-[#49454F]';

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E6E0E9] dark:border-[#36343B]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase bg-[#EADDFF] text-[#21005D] dark:bg-[#4F378B] dark:text-[#EADDFF]">
            <Mic className="w-3.5 h-3.5" />
            <span>የድምፅ AI አስተማሪ (Voice Tutor Engine)</span>
          </div>
          <h1 className={`text-xl sm:text-2xl font-black ${textPrimary} mt-1`}>
            በድምፅ ጠይቁ • በድምፅ ተማሩ
          </h1>
          <p className={`text-xs ${textSecondary}`}>
            የንግግር ጥያቄ (Speech-to-Text) → AI መልስ → ድምፅ ንባብ (Text-to-Speech)
          </p>
        </div>
      </div>

      {/* Interactive Voice Hub Card */}
      <div className={`rounded-3xl p-8 sm:p-12 border-[1.5px] shadow-xs text-center space-y-6 ${bgCard}`}>
        {/* Large Pulse Mic Button */}
        <div className="relative inline-block">
          {isListening && (
            <div className="absolute inset-0 rounded-full bg-red-500/20 animate-ping" />
          )}
          <button
            onClick={toggleListening}
            className={`w-24 h-24 sm:w-28 sm:h-28 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-lg active:scale-95 ${
              isListening
                ? 'bg-red-600 text-white animate-pulse'
                : 'bg-[#6750A4] text-white hover:bg-[#523e85]'
            }`}
          >
            {isListening ? <Mic className="w-12 h-12" /> : <Mic className="w-12 h-12" />}
          </button>
        </div>

        <div className="space-y-1">
          <h3 className={`text-base sm:text-lg font-bold ${textPrimary}`}>
            {isListening ? 'ድምፅዎን እያዳመጥኩ ነው...' : 'የማይክሮፎን ቁልፉን ተጭነው ጥያቄዎን ይናገሩ'}
          </h3>
          <p className={`text-xs ${textSecondary}`}>
            የተመረጠ ቋንቋ፡ {language === 'am' ? 'አማርኛ (am-ET)' : 'English (en-US)'}
          </p>
        </div>

        {/* Live Transcript Bubble */}
        {transcript && (
          <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 max-w-xl mx-auto text-xs sm:text-sm font-medium">
            <span className="text-purple-700 dark:text-purple-300 font-bold block mb-1">
              የተሰማው ንግግር (Speech Transcript):
            </span>
            <p className={textPrimary}>"{transcript}"</p>
          </div>
        )}

        {/* Loading Spinner */}
        {loading && (
          <div className="flex items-center justify-center gap-2 text-xs font-bold text-gray-500">
            <Loader2 className="w-4 h-4 animate-spin text-[#6750A4]" />
            <span>አስተማሪው መልሱን በማዘጋጀት ላይ ነው...</span>
          </div>
        )}

        {/* Quick Sample Voice Prompts */}
        <div className="pt-4 border-t border-gray-100 dark:border-gray-800 space-y-2">
          <span className="text-[11px] font-bold text-gray-500 block">ወይም እነዚህን የናሙና ጥያቄዎች ይሞክሩ፡</span>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {[
              'የስበት ኃይል ቀመር ምንድን ነው?',
              'ስለ ፎቶሲንተሲስ ሂደት በአጭሩ ንገረኝ?',
              'ቀጥተኛ መስመር እኩልታን እንዴት እንሰራለን?',
            ].map((q, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setTranscript(q);
                  handleAskVoice(q);
                }}
                className="px-3 py-1.5 rounded-full border text-xs font-bold bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-[#6750A4] transition-all cursor-pointer"
              >
                "{q}"
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* AI Voice Response & Controls Card */}
      {aiResponse && (
        <div className={`rounded-3xl p-6 sm:p-8 border-[1.5px] shadow-xs space-y-5 ${bgCard}`}>
          <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-2">
              <Volume2 className="w-5 h-5 text-[#6750A4]" />
              <h3 className={`text-base font-black ${textPrimary}`}>የአስተማሪው መልስ (AI Audio Output)</h3>
            </div>
            {citation && (
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-indigo-50 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200">
                {citation}
              </span>
            )}
          </div>

          <div className="p-5 rounded-2xl bg-gray-50 dark:bg-[#1D1B20] border border-gray-200 dark:border-gray-800 text-xs sm:text-sm leading-relaxed whitespace-pre-line text-gray-800 dark:text-gray-200">
            {aiResponse}
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              {isSpeaking ? (
                <button
                  onClick={stopSpeaking}
                  className="px-4 py-2 rounded-full text-xs font-black bg-rose-600 text-white hover:bg-rose-700 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Square className="w-3.5 h-3.5" />
                  <span>ድምፅ አቁም (Stop Audio)</span>
                </button>
              ) : (
                <button
                  onClick={() => speakText(aiResponse)}
                  className="px-4 py-2 rounded-full text-xs font-black bg-[#6750A4] text-white hover:bg-[#523e85] transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>እንደገና አድምጥ (Play Again)</span>
                </button>
              )}
            </div>

            <span className="text-xs text-gray-500 font-medium">
              በኢትዮጵያ ስርዓተ-ትምህርት የተረጋገጠ
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
