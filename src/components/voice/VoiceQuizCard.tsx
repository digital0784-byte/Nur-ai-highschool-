import React, { useState } from 'react';
import { VoiceQuizItem } from '../../types/voiceTutor';
import { voiceTutorService } from '../../services/voiceTutorService';
import { LanguageCode } from '../../types';
import { Mic, CheckCircle2, XCircle, Volume2, HelpCircle } from 'lucide-react';

interface VoiceQuizCardProps {
  quiz: VoiceQuizItem;
  language: LanguageCode;
  onQuizCompleted: (isCorrect: boolean, feedback: string) => void;
}

export const VoiceQuizCard: React.FC<VoiceQuizCardProps> = ({
  quiz,
  language,
  onQuizCompleted,
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [spokenAnswer, setSpokenAnswer] = useState<string>('');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [evaluation, setEvaluation] = useState<{ isCorrect: boolean; feedback: string } | null>(null);

  const isAm = language === 'am';
  const isOm = language === 'om';
  const isTi = language === 'ti';

  const labels = {
    quizTitle: isAm ? 'ፈጣን የድምፅ ፈተና (Voice Quiz)' : isOm ? 'Qormaata Sagalee' : isTi ? 'ናይ ድምጺ ፈተና' : 'Quick Voice Quiz',
    speakAnswer: isAm ? 'በድምፅ መልስ' : isOm ? 'Sagaleedhaan Deebisi' : isTi ? 'ብድምጺ መልሲ' : 'Answer by Voice',
    listening: isAm ? 'እያዳመጠ ነው...' : isOm ? 'Dhaggeeffachaa jira...' : isTi ? 'ይሰምዕ ኣሎ...' : 'Listening...',
    submitAnswer: isAm ? 'መልስ አረጋግጥ' : isOm ? 'Deebii Mirkaneessi' : isTi ? 'መልሲ ኣረጋግጽ' : 'Check Answer',
    correct: isAm ? 'ትክክል ነው!' : isOm ? 'Sirriidha!' : isTi ? 'ትኽክል!' : 'Correct!',
    incorrect: isAm ? 'ስህተት ነው' : isOm ? 'Dogoggora' : isTi ? 'ስሕተት' : 'Incorrect',
    readQuestion: isAm ? 'ጥያቄውን አንብብልኝ' : isOm ? 'Gaaffii naaf dubbisi' : isTi ? 'ሕቶ ኣንብበለይ' : 'Read Question',
  };

  const handleReadQuestion = () => {
    voiceTutorService.speak(quiz.questionAudioScript || quiz.question, language);
  };

  const handleStartVoiceAnswer = () => {
    if (isListening) {
      voiceTutorService.stopListening();
      setIsListening(false);
      return;
    }

    setIsListening(true);
    voiceTutorService.startListening(language, {
      onResult: (transcript, isFinal) => {
        setSpokenAnswer(transcript);
        if (isFinal) {
          setIsListening(false);
        }
      },
      onError: (err) => {
        console.warn('Voice quiz STT error:', err);
        setIsListening(false);
      },
      onEnd: () => {
        setIsListening(false);
      },
    });
  };

  const handleSubmit = async (answerToCheck?: string) => {
    const finalAnswer = answerToCheck || spokenAnswer || selectedOption;
    if (!finalAnswer) return;

    setIsSubmitting(true);
    try {
      const result = await voiceTutorService.submitVoiceQuizAnswer(quiz, finalAnswer);
      setEvaluation({
        isCorrect: result.isCorrect,
        feedback: result.feedback,
      });

      // Speak feedback out loud
      voiceTutorService.speak(result.feedback, language);
      onQuizCompleted(result.isCorrect, result.feedback);
    } catch (e) {
      console.warn('Evaluation failed:', e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-2xl p-5 my-3 shadow-lg backdrop-blur-sm">
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-emerald-400" />
          <h4 className="text-sm font-semibold text-emerald-200 tracking-wide uppercase">
            {labels.quizTitle}
          </h4>
        </div>
        <button
          type="button"
          onClick={handleReadQuestion}
          className="p-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 rounded-lg text-xs flex items-center gap-1.5 transition"
          title={labels.readQuestion}
        >
          <Volume2 className="w-4 h-4" />
          <span className="hidden sm:inline">{labels.readQuestion}</span>
        </button>
      </div>

      <p className="text-base font-medium text-emerald-50 mb-4 leading-relaxed">
        {quiz.question}
      </p>

      {/* Options if present */}
      {quiz.options && quiz.options.length > 0 && (
        <div className="space-y-2 mb-4">
          {quiz.options.map((opt, idx) => (
            <button
              key={idx}
              type="button"
              disabled={!!evaluation}
              onClick={() => {
                setSelectedOption(opt);
                handleSubmit(opt);
              }}
              className={`w-full text-left px-4 py-2.5 rounded-xl border text-sm transition flex items-center justify-between ${
                selectedOption === opt
                  ? 'bg-emerald-600/30 border-emerald-400 text-emerald-100 font-medium'
                  : 'bg-emerald-900/30 border-emerald-500/20 hover:bg-emerald-800/40 text-emerald-200'
              }`}
            >
              <span>{opt}</span>
              {evaluation && opt === quiz.correctAnswer && (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Voice answering interface */}
      {!evaluation && (
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 border-t border-emerald-800/40">
          <button
            type="button"
            onClick={handleStartVoiceAnswer}
            className={`px-4 py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition w-full sm:w-auto ${
              isListening
                ? 'bg-rose-600 text-white animate-pulse'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow'
            }`}
          >
            <Mic className={`w-4 h-4 ${isListening ? 'animate-bounce' : ''}`} />
            <span>{isListening ? labels.listening : labels.speakAnswer}</span>
          </button>

          {spokenAnswer && (
            <div className="flex-1 text-xs bg-emerald-900/50 px-3 py-2 rounded-lg border border-emerald-500/30 text-emerald-200 flex items-center justify-between w-full">
              <span className="truncate">"{spokenAnswer}"</span>
              <button
                type="button"
                onClick={() => handleSubmit()}
                disabled={isSubmitting}
                className="ml-2 px-2.5 py-1 bg-emerald-500 text-white rounded text-xs hover:bg-emerald-400 transition"
              >
                {labels.submitAnswer}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Result feedback */}
      {evaluation && (
        <div
          className={`mt-4 p-3.5 rounded-xl border flex items-start gap-3 ${
            evaluation.isCorrect
              ? 'bg-emerald-900/40 border-emerald-500/50 text-emerald-100'
              : 'bg-rose-950/40 border-rose-500/50 text-rose-200'
          }`}
        >
          {evaluation.isCorrect ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          ) : (
            <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          )}
          <div className="text-sm">
            <span className="font-semibold block mb-0.5">
              {evaluation.isCorrect ? labels.correct : labels.incorrect}
            </span>
            <p className="opacity-95 leading-relaxed">{evaluation.feedback}</p>
          </div>
        </div>
      )}
    </div>
  );
};
