import React, { useState } from 'react';
import { Subject, Grade, VideoLessonItem } from '../types';
import { videoLessonsData } from '../data/videoLessonsData';
import { useLanguage } from '../context/LanguageContext';
import { InteractiveAnimationStudio } from './InteractiveAnimationStudio';
import {
  Video,
  Play,
  Clock,
  User,
  Sparkles,
  BookOpen,
  CheckCircle2,
  HelpCircle,
  FlaskConical,
  ListOrdered,
  ChevronRight,
  Loader2,
  Layers,
  LogOut,
  PlaySquare,
  Activity,
} from 'lucide-react';

interface VideoLearningViewProps {
  subject: Subject;
  grade: Grade;
  onOpenAITutor?: (chapterTitle: string, mode: 'analysis' | 'chat') => void;
  onExit?: () => void;
}

export const VideoLearningView: React.FC<VideoLearningViewProps> = ({
  subject,
  grade,
  onOpenAITutor,
  onExit,
}) => {
  const { language, t } = useLanguage();

  // Mode: 'animation_studio' (default for dynamic visual simulations) vs 'video_lecture'
  const [learningMode, setLearningMode] = useState<'animation_studio' | 'video_lecture'>('animation_studio');

  // Find videos matching subject, or provide related fallback
  const subjectVideos = videoLessonsData.filter((v) => v.subjectId === subject.id);
  const availableVideos = subjectVideos.length > 0 ? subjectVideos : videoLessonsData;

  const [selectedVideo, setSelectedVideo] = useState<VideoLessonItem>(availableVideos[0]);
  const [selectedTimestamp, setSelectedTimestamp] = useState<number>(0);
  const [userQuizAnswers, setUserQuizAnswers] = useState<Record<number, number>>({});
  const [showQuizResults, setShowQuizResults] = useState<boolean>(false);

  const [isSummarizingAI, setIsSummarizingAI] = useState<boolean>(false);
  const [aiNotes, setAiNotes] = useState<{
    visualNotes?: string;
    keyFormulas?: string[];
  } | null>(null);

  const handleFetchAiVideoSummary = async () => {
    setIsSummarizingAI(true);
    try {
      const res = await fetch('/api/ai/video-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          videoTitle: selectedVideo.title,
          subjectName: subject.name,
          grade,
          timestamps: selectedVideo.timestamps,
          topicTitle: selectedVideo.unitTitle,
          duration: selectedVideo.duration,
          language,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setAiNotes({
          visualNotes: data.visualNotes || data.summary || '',
          keyFormulas: data.keyFormulas || [],
        });
      } else {
        throw new Error('AI summary response not ok');
      }
    } catch (err) {
      console.warn('AI Video summary network fallback:', err);
      setAiNotes({
        visualNotes: `### 🎥 የቪዲዮ ትምህርቱ ዋና ምስላዊ ማጠቃለያ (${selectedVideo.title})
- **ዋና ጭብጥ**: ${selectedVideo.overview}
- **የተብራሩ ዋና ነጥቦች**: ${selectedVideo.keyVisualTakeaways.join('፣ ')}
- **የፈተና ትኩረት**: በቪዲዮው ላይ የተመለከቷቸውን ቀመሮች እና የላብራቶሪ ምልከታዎች በማስታወሻ ደብተርዎ ይለማመዱ።`,
      });
    } finally {
      setIsSummarizingAI(false);
    }
  };

  const handleSelectQuizOption = (qIdx: number, optIdx: number) => {
    if (showQuizResults) return;
    setUserQuizAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-150">
      {/* Top Mode Switcher Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#FAF6EC] border-[1.5px] border-[#38332D] rounded-xl p-3 shadow-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setLearningMode('animation_studio')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold font-serif-ethiopic transition-all cursor-pointer border ${
              learningMode === 'animation_studio'
                ? 'bg-[#2563EB] text-white border-[#1E40AF] shadow-xs'
                : 'bg-[#EDE6D4] text-[#423A2F] border-[#38332D]/30 hover:bg-[#E3DAC4]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>✨ የአኒሜሽን ቪዲዮ እና የድርጅት ምስላዊ ማስመሰያ (Animation Studio)</span>
          </button>

          <button
            onClick={() => setLearningMode('video_lecture')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold font-serif-ethiopic transition-all cursor-pointer border ${
              learningMode === 'video_lecture'
                ? 'bg-[#38332D] text-[#FAF6EC] border-[#38332D] shadow-xs'
                : 'bg-[#EDE6D4] text-[#423A2F] border-[#38332D]/30 hover:bg-[#E3DAC4]'
            }`}
          >
            <PlaySquare className="w-3.5 h-3.5" />
            <span>🎥 የተግባር ቪዲዮ ትምህርቶች (Video Lessons)</span>
          </button>
        </div>

        {/* Quick Exit */}
        {onExit && (
          <button
            onClick={onExit}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#8B261E] hover:bg-[#721F18] text-white text-xs font-bold font-serif-ethiopic shadow-xs cursor-pointer border border-[#5E1610]"
            title="ከቪዲዮ ውጣ / ወደ ዋናው ትምህርት ተመለስ (Exit Video)"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>መውጫ / ውጣ (Exit)</span>
          </button>
        )}
      </div>

      {/* Mode 1: Interactive Animation Studio for any organization/concept */}
      {learningMode === 'animation_studio' && (
        <InteractiveAnimationStudio
          subject={subject}
          grade={grade}
          onOpenAITutor={onOpenAITutor}
          onExit={onExit}
        />
      )}

      {/* Mode 2: Standard Curriculum Video Lessons */}
      {learningMode === 'video_lecture' && (
        <div className="space-y-6">
          {/* Header & Video Selector */}
          <div className="bg-[#FAF6EC] border-[1.5px] border-[#38332D] rounded-xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center border border-[#38332D]"
                style={{ backgroundColor: subject.accentColor, color: '#FFFFFF' }}
              >
                <Video className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold font-serif-ethiopic text-[#1E1B18]">
                  የቪዲዮ ትምህርቶች (Interactive Video Lessons)
                </h2>
                <p className="text-xs text-[#5A5143] font-serif-ethiopic">
                  የላብራቶሪ ሙከራዎች፣ ምስላዊ ማብራሪያዎች እና የደረጃ በደረጃ ስሌቶች
                </p>
              </div>
            </div>

            {/* Video selector dropdown if multiple */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#5A5143]">ትምህርት ምረጥ:</span>
              <select
                value={selectedVideo.id}
                onChange={(e) => {
                  const found = availableVideos.find((v) => v.id === e.target.value);
                  if (found) {
                    setSelectedVideo(found);
                    setUserQuizAnswers({});
                    setShowQuizResults(false);
                    setAiNotes(null);
                  }
                }}
                className="bg-[#EDE6D4] border border-[#38332D] rounded-lg px-3 py-1.5 text-xs font-bold text-[#1E1B18] font-serif-ethiopic focus:outline-none max-w-[220px] truncate"
              >
                {availableVideos.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

      {/* Main Video Presentation Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: Video Player + Details */}
        <div className="lg:col-span-8 space-y-4">
          {/* Video Container */}
          <div className="bg-[#1E1B18] rounded-xl border-[2px] border-[#38332D] shadow-[4px_4px_0px_0px_#38332D] overflow-hidden aspect-video relative flex items-center justify-center">
            <iframe
              src={selectedVideo.videoUrl}
              title={selectedVideo.title}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>

          {/* Video Info Card */}
          <div className="bg-[#FAF6EC] border-[1.5px] border-[#38332D] rounded-xl p-5 shadow-xs space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-black uppercase text-amber-950 bg-amber-200 border border-amber-400 px-2.5 py-0.5 rounded-full">
                {selectedVideo.curriculumBadge}
              </span>
              <div className="flex items-center gap-3 text-xs text-[#5A5143]">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {selectedVideo.duration}
                </span>
                <span className="flex items-center gap-1 font-bold">
                  <User className="w-3.5 h-3.5" /> {selectedVideo.instructor}
                </span>
              </div>
            </div>

            <h3 className="text-lg font-bold font-serif-ethiopic text-[#1E1B18]">
              {selectedVideo.title}
            </h3>
            <p className="text-xs sm:text-sm text-[#423A2F] font-serif-ethiopic leading-relaxed">
              {selectedVideo.overview}
            </p>

            {/* AI Notes Button */}
            <div className="pt-2 flex flex-wrap gap-2 border-t border-[#38332D]/40">
              <button
                onClick={handleFetchAiVideoSummary}
                disabled={isSummarizingAI}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#EDE6D4] hover:bg-[#E3DAC4] border border-[#38332D] text-xs font-bold text-[#1E1B18] shadow-2xs cursor-pointer"
              >
                {isSummarizingAI ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-600" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                )}
                <span>በAI ምስላዊ ማጠቃለያ አፍልቅ (AI Notes)</span>
              </button>

              <button
                onClick={() => onOpenAITutor?.(selectedVideo.title, 'chat')}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#1E1B18] hover:bg-[#38332D] text-[#FAF6EC] text-xs font-bold shadow-2xs cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>ስለዚህ ቪዲዮ AI ጠይቅ</span>
              </button>
            </div>

            {/* AI Generated Notes Box */}
            {aiNotes && (
              <div className="mt-3 p-4 rounded-xl bg-amber-50/70 border border-amber-300 text-xs font-serif-ethiopic text-amber-950 space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-amber-900">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>የGemini 3.7 የቪዲዮ ትንታኔ ማስታወሻ፡</span>
                </div>
                <p className="whitespace-pre-wrap leading-relaxed">{aiNotes.visualNotes}</p>
              </div>
            )}
          </div>

          {/* Practical Lab Demonstration (if present) */}
          {selectedVideo.labExperimentDemonstration && (
            <div className="bg-[#FAF6EC] border-[1.5px] border-[#38332D] rounded-xl p-5 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-sm font-bold text-[#1E1B18] font-serif-ethiopic">
                <FlaskConical className="w-4 h-4 text-emerald-700" />
                <span>{selectedVideo.labExperimentDemonstration.title}</span>
              </div>

              <div className="bg-[#EDE6D4] p-3 rounded-lg border border-[#38332D]/50 text-xs space-y-1.5">
                <span className="font-bold text-[#1E1B18] block">አስፈላጊ የላብራቶሪ ቁሳቁሶች፡</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedVideo.labExperimentDemonstration.materials.map((mat, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded bg-[#FAF6EC] border border-[#38332D]/40 text-[#423A2F]"
                    >
                      {mat}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-1 text-xs text-[#1E1B18] font-serif-ethiopic">
                <span className="font-bold block text-[#1E1B18]">ተግባራዊ ቅደም-ተከተል፡</span>
                <ol className="list-decimal list-inside space-y-1 text-[#423A2F]">
                  {selectedVideo.labExperimentDemonstration.steps.map((st, i) => (
                    <li key={i}>{st}</li>
                  ))}
                </ol>
              </div>
            </div>
          )}
        </div>

        {/* Right Col: Timestamps + Visual Takeaways + Quick Check */}
        <div className="lg:col-span-4 space-y-4">
          {/* Chapter Timestamps */}
          <div className="bg-[#FAF6EC] border-[1.5px] border-[#38332D] rounded-xl p-4 shadow-xs space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#665C4D] flex items-center gap-1.5">
              <ListOrdered className="w-4 h-4 text-amber-700" />
              <span>የቪዲዮው ክፍሎች (Timestamps)</span>
            </h4>

            <div className="space-y-2">
              {selectedVideo.timestamps.map((ts, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-lg border border-[#38332D]/60 bg-[#EDE6D4] hover:bg-[#E3DAC4] transition-colors flex items-start gap-2 text-xs"
                >
                  <span className="font-mono font-black text-amber-900 bg-amber-200 px-1.5 py-0.5 rounded border border-amber-400 shrink-0">
                    {ts.time}
                  </span>
                  <div>
                    <h5 className="font-bold text-[#1E1B18] font-serif-ethiopic line-clamp-1">
                      {ts.title}
                    </h5>
                    <p className="text-[11px] text-[#5A5143] font-serif-ethiopic line-clamp-2 mt-0.5">
                      {ts.conceptSummary}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Key Visual Takeaways */}
          <div className="bg-[#FAF6EC] border-[1.5px] border-[#38332D] rounded-xl p-4 shadow-xs space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#665C4D] flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-emerald-700" />
              <span>ዋና ዋና ምስላዊ ነጥቦች</span>
            </h4>

            <ul className="space-y-2">
              {selectedVideo.keyVisualTakeaways.map((note, idx) => (
                <li
                  key={idx}
                  className="text-xs text-[#1E1B18] font-serif-ethiopic flex items-start gap-2 bg-[#EDE6D4] p-2.5 rounded-lg border border-[#38332D]/40"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Post-Video Comprehension Check */}
          {selectedVideo.checkQuestions && selectedVideo.checkQuestions.length > 0 && (
            <div className="bg-[#FAF6EC] border-[1.5px] border-[#38332D] rounded-xl p-4 shadow-xs space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#665C4D] flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-blue-700" />
                <span>የቪዲዮ ማጠቃለያ ፈጣን ጥያቄ</span>
              </h4>

              {selectedVideo.checkQuestions.map((q, qIdx) => {
                const userAns = userQuizAnswers[qIdx];
                const isCorrect = userAns === q.correctIndex;

                return (
                  <div key={qIdx} className="space-y-2">
                    <p className="text-xs font-bold text-[#1E1B18] font-serif-ethiopic">
                      {q.question}
                    </p>
                    <div className="space-y-1.5">
                      {q.options.map((opt, optIdx) => {
                        const isSelected = userAns === optIdx;
                        let btnStyle =
                          'bg-[#EDE6D4] text-[#1E1B18] border-[#38332D]/60 hover:bg-[#E3DAC4]';

                        if (showQuizResults) {
                          if (optIdx === q.correctIndex) {
                            btnStyle = 'bg-emerald-100 border-emerald-700 text-emerald-950 font-bold';
                          } else if (isSelected && !isCorrect) {
                            btnStyle = 'bg-rose-100 border-rose-700 text-rose-950';
                          }
                        } else if (isSelected) {
                          btnStyle = 'bg-[#1E1B18] text-[#FAF6EC] border-[#1E1B18]';
                        }

                        return (
                          <button
                            key={optIdx}
                            onClick={() => handleSelectQuizOption(qIdx, optIdx)}
                            className={`w-full text-left p-2 rounded text-xs font-serif-ethiopic border transition-all cursor-pointer ${btnStyle}`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>

                    {!showQuizResults ? (
                      <button
                        onClick={() => setShowQuizResults(true)}
                        disabled={userAns === undefined}
                        className="mt-2 text-xs font-bold px-3 py-1.5 rounded bg-[#1E1B18] text-[#FAF6EC] hover:bg-[#38332D] disabled:opacity-40"
                      >
                        መልስ አረጋግጥ
                      </button>
                    ) : (
                      <div className="text-[11px] p-2 rounded bg-emerald-50 border border-emerald-200 text-emerald-900 font-serif-ethiopic">
                        {q.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
        </div>
      )}
    </div>
  );
};
