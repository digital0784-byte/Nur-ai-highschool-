import React, { useState, useEffect } from 'react';
import { Subject, Grade, VideoLessonItem, YouTubeVideoItem } from '../types';
import { videoLessonsData } from '../data/videoLessonsData';
import { useLanguage } from '../context/LanguageContext';
import { VisualDualEngineStudio } from './visualizer/VisualDualEngineStudio';
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
  Globe,
  Search,
  ExternalLink,
  Tv,
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

  // Mode: 'visual_studio' (2D/3D & Physics Simulation) vs 'curated_lessons' vs 'youtube_recommendations'
  const [learningMode, setLearningMode] = useState<'visual_studio' | 'curated_lessons' | 'youtube_recommendations'>('visual_studio');

  // Find videos matching subject, or provide fallback
  const subjectVideos = videoLessonsData.filter((v) => v.subjectId === subject.id);
  const availableVideos = subjectVideos.length > 0 ? subjectVideos : videoLessonsData;

  const [selectedVideo, setSelectedVideo] = useState<VideoLessonItem>(availableVideos[0]);
  const [userQuizAnswers, setUserQuizAnswers] = useState<Record<number, number>>({});
  const [showQuizResults, setShowQuizResults] = useState<boolean>(false);

  const [isSummarizingAI, setIsSummarizingAI] = useState<boolean>(false);
  const [aiNotes, setAiNotes] = useState<{
    visualNotes?: string;
    keyFormulas?: string[];
  } | null>(null);

  // --- FEATURE 3: YouTube Search State ---
  const [youtubeVideos, setYoutubeVideos] = useState<YouTubeVideoItem[]>([]);
  const [isLoadingYouTube, setIsLoadingYouTube] = useState<boolean>(false);
  const [activeYouTubeVideoId, setActiveYouTubeVideoId] = useState<string | null>(null);
  const [youtubeSearchTerm, setYoutubeSearchTerm] = useState<string>('');

  // Fetch YouTube recommendations when entering youtube tab or changing topic
  const fetchYouTubeVideos = async (customQuery?: string) => {
    setIsLoadingYouTube(true);
    try {
      const topicToSearch = customQuery || youtubeSearchTerm || selectedVideo.unitTitle || subject.name;
      const res = await fetch('/api/youtube/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subjectName: subject.name,
          topicTitle: topicToSearch,
          grade,
          language,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setYoutubeVideos(data.videos || []);
        if (data.videos && data.videos.length > 0 && !activeYouTubeVideoId) {
          setActiveYouTubeVideoId(data.videos[0].id);
        }
      }
    } catch (err) {
      console.warn('YouTube search network fallback:', err);
    } finally {
      setIsLoadingYouTube(false);
    }
  };

  useEffect(() => {
    if (learningMode === 'youtube_recommendations' && youtubeVideos.length === 0) {
      fetchYouTubeVideos();
    }
  }, [learningMode, subject.name, grade]);

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
      console.warn('AI Video summary fallback:', err);
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
        <div className="flex flex-wrap items-center gap-2">
          {/* Sub-tab 1: Visual Dual-Engine Studio */}
          <button
            id="tab-visual-studio"
            onClick={() => setLearningMode('visual_studio')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold font-serif-ethiopic transition-all cursor-pointer border ${
              learningMode === 'visual_studio'
                ? 'bg-[#2563EB] text-white border-[#1E40AF] shadow-xs'
                : 'bg-[#EDE6D4] text-[#423A2F] border-[#38332D]/30 hover:bg-[#E3DAC4]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>📐 ምስላዊ ግራፍ እና ማስመሰያ (Visual Studio 2D/3D)</span>
          </button>

          {/* Sub-tab 2: Curated Video Lessons */}
          <button
            id="tab-curated-lessons"
            onClick={() => setLearningMode('curated_lessons')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold font-serif-ethiopic transition-all cursor-pointer border ${
              learningMode === 'curated_lessons'
                ? 'bg-[#38332D] text-[#FAF6EC] border-[#38332D] shadow-xs'
                : 'bg-[#EDE6D4] text-[#423A2F] border-[#38332D]/30 hover:bg-[#E3DAC4]'
            }`}
          >
            <PlaySquare className="w-3.5 h-3.5 text-emerald-400" />
            <span>🎥 የተመረጡ የቪዲዮ ትምህርቶች (Curated Lessons)</span>
          </button>

          {/* Sub-tab 3: YouTube Recommendations */}
          <button
            id="tab-youtube-recommendations"
            onClick={() => setLearningMode('youtube_recommendations')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold font-serif-ethiopic transition-all cursor-pointer border ${
              learningMode === 'youtube_recommendations'
                ? 'bg-[#DC2626] text-white border-[#B91C1C] shadow-xs'
                : 'bg-[#EDE6D4] text-[#423A2F] border-[#38332D]/30 hover:bg-[#E3DAC4]'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-rose-200" />
            <span>🌐 ዩቲዩብ የትምህርት ቪዲዮዎች (YouTube Tutorials)</span>
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

      {/* Mode 1: Dual-Engine Interactive Studio (Plotly 2D/3D + HTML5 Canvas Physics + Node Flow) */}
      {learningMode === 'visual_studio' && (
        <VisualDualEngineStudio
          subject={subject}
          grade={grade}
          onOpenAITutor={onOpenAITutor}
          onExit={onExit}
        />
      )}

      {/* Mode 2: Standard Curriculum Video Lessons */}
      {learningMode === 'curated_lessons' && (
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

            {/* Video selector dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#5A5143] font-serif-ethiopic">ትምህርት ምረጥ:</span>
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
                className="bg-[#EDE6D4] border border-[#38332D] rounded-lg px-3 py-1.5 text-xs font-bold text-[#1E1B18] font-serif-ethiopic focus:outline-none max-w-[220px] truncate cursor-pointer"
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
                    <span>ስለዚህ ቪዲዮ AI አስተማሪህን ጠይቅ</span>
                  </button>
                </div>

                {/* AI Summary Display */}
                {aiNotes && (
                  <div className="p-4 bg-[#EDE6D4] border border-[#38332D]/40 rounded-xl space-y-2 mt-3 animate-in fade-in">
                    <h4 className="text-xs font-bold text-amber-900 font-serif-ethiopic flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                      <span>የAI ምስላዊ ትንተና ማስታወሻ፡</span>
                    </h4>
                    <div className="text-xs text-[#1E1B18] font-serif-ethiopic whitespace-pre-wrap leading-relaxed">
                      {aiNotes.visualNotes}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Col: Timestamps & Quiz */}
            <div className="lg:col-span-4 space-y-4">
              {/* Timestamps */}
              <div className="bg-[#FAF6EC] border-[1.5px] border-[#38332D] rounded-xl p-4 shadow-xs space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#665C4D] flex items-center gap-1.5">
                  <ListOrdered className="w-4 h-4 text-amber-700" />
                  <span>የርዕስ ሰዓት ማውጫ (Timestamps)</span>
                </h4>
                <div className="space-y-1.5">
                  {selectedVideo.timestamps.map((ts, idx) => (
                    <div
                      key={idx}
                      className="p-2 bg-[#EDE6D4]/60 border border-[#38332D]/30 rounded-lg flex items-center justify-between text-xs"
                    >
                      <span className="font-serif-ethiopic text-[#1E1B18] font-medium">{ts.title}</span>
                      <span className="font-mono text-[11px] font-bold text-[#5A5143] bg-[#FAF6EC] px-1.5 py-0.5 rounded border border-[#38332D]/20">
                        {ts.time}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Visual Takeaways */}
              <div className="bg-[#FAF6EC] border-[1.5px] border-[#38332D] rounded-xl p-4 shadow-xs space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#665C4D] flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>ዋና ዋና ትምህርቶች (Key Takeaways)</span>
                </h4>
                <ul className="space-y-1.5">
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
                            className="mt-2 text-xs font-bold px-3 py-1.5 rounded bg-[#1E1B18] text-[#FAF6EC] hover:bg-[#38332D] disabled:opacity-40 cursor-pointer"
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

      {/* Mode 3: FEATURE 3 - Automatic YouTube Video Recommendations */}
      {learningMode === 'youtube_recommendations' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Header & Topic Search Bar */}
          <div className="bg-[#FAF6EC] border-[1.5px] border-[#38332D] rounded-xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-rose-100 border border-rose-400 text-rose-700 flex items-center justify-center">
                <Tv className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold font-serif-ethiopic text-[#1E1B18]">
                  በኢንተርኔት የሚመከሩ የትምህርት ቪዲዮዎች (Recommended Online Tutorials)
                </h2>
                <p className="text-xs text-[#5A5143] font-serif-ethiopic">
                  በኢትዮጵያ ስርዓተ-ትምህርት ዙሪያ የተዘጋጁ አስተማሪ ቪዲዮዎች (Asterawi, E-learning Ethiopia, MoE)
                </p>
              </div>
            </div>

            {/* Live Search Field */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={youtubeSearchTerm}
                  onChange={(e) => setYoutubeSearchTerm(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') fetchYouTubeVideos(youtubeSearchTerm);
                  }}
                  placeholder={`${subject.name} ርዕስ ፈልግ...`}
                  className="bg-[#EDE6D4] border border-[#38332D] rounded-lg px-3 py-1.5 text-xs font-serif-ethiopic focus:outline-none w-48 sm:w-60 text-[#1E1B18]"
                />
              </div>

              <button
                onClick={() => fetchYouTubeVideos(youtubeSearchTerm)}
                disabled={isLoadingYouTube}
                className="px-3 py-1.5 rounded-lg bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-bold font-serif-ethiopic flex items-center gap-1 cursor-pointer disabled:opacity-50"
              >
                {isLoadingYouTube ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Search className="w-3.5 h-3.5" />
                )}
                <span>ፈልግ</span>
              </button>
            </div>
          </div>

          {/* Active YouTube Video Player Box */}
          {activeYouTubeVideoId && (
            <div className="bg-[#FAF6EC] border-[1.5px] border-[#38332D] rounded-xl p-4 sm:p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-rose-900 bg-rose-100 border border-rose-300 px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                  <Play className="w-3 h-3 fill-rose-700 text-rose-700" />
                  አሁን እየተመለከቱት ያለው ቪዲዮ (Active Video Player)
                </span>
                <a
                  href={`https://www.youtube.com/watch?v=${activeYouTubeVideoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-700 hover:underline flex items-center gap-1 font-serif-ethiopic"
                >
                  <span>በዩቲዩብ አዲስ መስኮት ክፈት</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="bg-[#1E1B18] rounded-xl border-[2px] border-[#38332D] shadow-[4px_4px_0px_0px_#38332D] overflow-hidden aspect-video relative">
                <iframe
                  src={`https://www.youtube.com/embed/${activeYouTubeVideoId}?autoplay=1&rel=0`}
                  title="YouTube Tutorial Player"
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            </div>
          )}

          {/* Grid of Recommended YouTube Videos */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold font-serif-ethiopic text-[#1E1B18]">
                የተገኙ ቪዲዮዎች ለ {subject.name} - ክፍል {grade}
              </h3>
              <span className="text-xs text-[#665C4D]">
                {youtubeVideos.length} ቪዲዮዎች ተገኝተዋል
              </span>
            </div>

            {isLoadingYouTube ? (
              <div className="p-12 text-center bg-[#FAF6EC] border-[1.5px] border-[#38332D] rounded-xl space-y-2">
                <Loader2 className="w-8 h-8 animate-spin text-rose-600 mx-auto" />
                <p className="text-xs font-serif-ethiopic text-[#5A5143]">
                  የዩቲዩብ የትምህርት ቪዲዮዎችን በማፈላለግ ላይ...
                </p>
              </div>
            ) : youtubeVideos.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {youtubeVideos.map((video) => {
                  const isPlaying = activeYouTubeVideoId === video.id;

                  return (
                    <div
                      key={video.id}
                      onClick={() => setActiveYouTubeVideoId(video.id)}
                      className={`group bg-[#FAF6EC] border-[1.5px] rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between ${
                        isPlaying
                          ? 'border-rose-600 ring-2 ring-rose-400 bg-rose-50/40'
                          : 'border-[#38332D] hover:border-[#1E1B18]'
                      }`}
                    >
                      {/* Thumbnail with duration overlay */}
                      <div className="aspect-video w-full relative bg-[#EDE6D4] overflow-hidden">
                        <img
                          src={video.thumbnailUrl}
                          alt={video.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                          <div className="w-10 h-10 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                            <Play className="w-5 h-5 fill-white ml-0.5" />
                          </div>
                        </div>
                      </div>

                      {/* Video Card Meta */}
                      <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                        <div className="space-y-1">
                          <h4 className="text-xs sm:text-sm font-bold font-serif-ethiopic text-[#1E1B18] line-clamp-2 leading-snug">
                            {video.title}
                          </h4>
                          <p className="text-[11px] text-[#5A5143] line-clamp-2 font-serif-ethiopic">
                            {video.description || 'የኢትዮጵያ ስርዓተ-ትምህርት ዝርዝር ማብራሪያ።'}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-[#38332D]/20 flex items-center justify-between text-[11px] text-[#665C4D]">
                          <span className="font-bold text-[#1E1B18] truncate max-w-[140px]">
                            {video.channelTitle}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-[#EDE6D4] text-[10px] font-sans">
                            {isPlaying ? '▶ እየታየ' : 'ይመልከቱ'}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center bg-[#FAF6EC] border-[1.5px] border-[#38332D] rounded-xl space-y-2">
                <p className="text-xs font-serif-ethiopic text-[#5A5143]">
                  ለዚህ ርዕስ የተገኘ ቪዲዮ የለም። እባክዎ ሌላ የፍለጋ ቃል ይሞክሩ።
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
