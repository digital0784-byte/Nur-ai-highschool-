import React from 'react';
import {
  SearchResultItem,
  AIIntentAnalysis,
} from '../../types/searchAndRecommendations';
import {
  BookOpen,
  Bookmark,
  BookmarkCheck,
  Bot,
  Layers,
  Award,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  FileText,
  HelpCircle,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface SearchResultsListProps {
  results: SearchResultItem[];
  aiIntent?: AIIntentAnalysis;
  isBookmarked: (contentId: string) => boolean;
  onToggleBookmark: (result: SearchResultItem) => void;
  onOpenContent: (result: SearchResultItem) => void;
  onAskAITutor: (result: SearchResultItem, customPrompt?: string) => void;
  isOffline: boolean;
  searchQuery: string;
}

export const SearchResultsList: React.FC<SearchResultsListProps> = ({
  results,
  aiIntent,
  isBookmarked,
  onToggleBookmark,
  onOpenContent,
  onAskAITutor,
  isOffline,
  searchQuery,
}) => {
  const { language } = useLanguage();

  if (results.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-stone-200 p-8 text-center space-y-3">
        <div className="w-12 h-12 mx-auto rounded-full bg-stone-100 flex items-center justify-center text-stone-400">
          <BookOpen className="w-6 h-6" />
        </div>
        <h4 className="text-base font-semibold text-stone-800">
          {language === 'am' ? 'ምንም ተዛማጅ የስርዓተ-ትምህርት ይዘት አልተገኘም' : 'No Curriculum Matches Found'}
        </h4>
        <p className="text-xs text-stone-500 max-w-md mx-auto">
          {language === 'am'
            ? 'የተለየ ቁልፍ ቃል፣ የአማርኛ/እንግሊዝኛ ቃል፣ ወይም የመማሪያ መጽሐፍ ገጽ ቁጥር በመጠቀም ይፈልጉ (ምሳሌ፡ "Mitosis", "ሕዋስ", "ገጽ 42")።'
            : 'Try refining your query, checking spelling, or searching by textbook page number (e.g. "Quadratic", "Page 30").'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* AI Intent Summary Banner if available (Section 4) */}
      {aiIntent && (aiIntent.detectedSubject || aiIntent.detectedTopic || aiIntent.detectedGrade) && (
        <div className="bg-gradient-to-r from-purple-50 via-indigo-50 to-purple-50 rounded-xl border border-purple-200 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-purple-100 text-purple-700">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-purple-900 uppercase tracking-wide">
                  {language === 'am' ? 'የAI ፍለጋ ግንዛቤ (AI Search Intent)' : 'AI Search Understanding'}
                </span>
                {aiIntent.detectedGrade && (
                  <span className="px-2 py-0.5 rounded-full bg-purple-200 text-purple-800 text-2xs font-semibold">
                    Grade {aiIntent.detectedGrade}
                  </span>
                )}
                {aiIntent.detectedSubject && (
                  <span className="px-2 py-0.5 rounded-full bg-indigo-200 text-indigo-800 text-2xs font-semibold">
                    {aiIntent.detectedSubject}
                  </span>
                )}
              </div>
              <p className="text-xs text-purple-950 mt-0.5">
                {language === 'am'
                  ? `ጥያቄዎ ወደ ${aiIntent.detectedSubject || 'ትምህርት'} ${aiIntent.detectedGrade ? `ክፍል ${aiIntent.detectedGrade}` : ''} ሥርዓተ-ትምህርት አርዕስት ተገናኝቷል።`
                  : `Synthesized intent to retrieve official Ethiopian curriculum topics for ${aiIntent.detectedSubject || 'requested subjects'}.`}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              onAskAITutor(
                results[0],
                `Explain "${searchQuery}" thoroughly according to the Ethiopian Ministry of Education curriculum.`
              )
            }
            className="px-3 py-1.5 bg-purple-700 hover:bg-purple-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-all flex items-center gap-1.5 whitespace-nowrap"
          >
            <Bot className="w-3.5 h-3.5" />
            <span>አስተማሪውን በዝርዝር ጠይቅ (Ask AI Tutor)</span>
          </button>
        </div>
      )}

      {/* Results Header Count & Offline Notice */}
      <div className="flex items-center justify-between px-1 text-xs text-stone-500">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-stone-700">
            {results.length} {language === 'am' ? 'የስርዓተ-ትምህርት ውጤቶች ተገኝተዋል' : 'curriculum results found'}
          </span>
          {isOffline && (
            <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-2xs font-medium">
              ከመስመር ውጭ ካሸ (Offline Cache)
            </span>
          )}
        </div>
        <span className="text-stone-400">FDRE MoE Verified Catalog</span>
      </div>

      {/* Results Cards List */}
      <div className="space-y-3">
        {results.map((item) => {
          const bookmarked = isBookmarked(item.topicId || item.id);

          return (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-stone-200 hover:border-emerald-400 p-4 sm:p-5 transition-all hover:shadow-md group relative"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                {/* Left: Content Details */}
                <div className="space-y-1.5 flex-1">
                  {/* Badges row */}
                  <div className="flex flex-wrap items-center gap-1.5 text-2xs font-medium">
                    <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 font-semibold">
                      Grade {item.grade}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 font-semibold">
                      {item.subjectName}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-600">
                      Unit {item.unitNumber}
                    </span>
                    {item.contentType && (
                      <span className="px-2 py-0.5 rounded-md bg-sky-50 text-sky-800 uppercase tracking-wider text-2xs">
                        {item.contentType}
                      </span>
                    )}
                    {item.difficulty && (
                      <span
                        className={`px-2 py-0.5 rounded-md text-2xs font-medium ${
                          item.difficulty === 'easy'
                            ? 'bg-emerald-100 text-emerald-800'
                            : item.difficulty === 'medium'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {item.difficulty}
                      </span>
                    )}
                  </div>

                  {/* Title & Amharic Title */}
                  <div className="flex items-baseline gap-2">
                    <h3
                      onClick={() => onOpenContent(item)}
                      className="text-base font-bold text-stone-900 group-hover:text-emerald-700 cursor-pointer transition-colors"
                    >
                      {item.title}
                    </h3>
                    {item.amharicTitle && (
                      <span className="text-xs text-stone-500 font-medium hidden sm:inline">
                        ({item.amharicTitle})
                      </span>
                    )}
                  </div>

                  {/* Short explanation / snippet */}
                  <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                    {item.shortExplanation}
                  </p>

                  {/* Key Highlights / Core concepts */}
                  {item.highlights && item.highlights.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {item.highlights.map((h, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded bg-stone-100 text-stone-600 text-2xs"
                        >
                          • {h}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Question data preview if question */}
                  {item.questionData && (
                    <div className="mt-2 p-2.5 bg-stone-50 rounded-lg border border-stone-200 text-xs space-y-1">
                      <div className="font-medium text-stone-800">
                        {item.questionData.prompt}
                      </div>
                      {item.questionData.options && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-2xs text-stone-600 pt-1">
                          {item.questionData.options.map((opt, oIdx) => (
                            <div key={oIdx} className="px-2 py-1 bg-white rounded border border-stone-200">
                              {opt}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Textbook Page & Source citation */}
                  <div className="flex items-center gap-3 text-2xs text-stone-500 pt-1.5">
                    <span className="flex items-center gap-1 font-medium text-emerald-800">
                      <BookOpen className="w-3 h-3" />
                      <span>Textbook: {item.source}</span>
                    </span>
                    {item.textbookPage && (
                      <span className="px-1.5 py-0.5 rounded bg-stone-100 font-semibold text-stone-700">
                        ገጽ (Page): {item.textbookPage}
                      </span>
                    )}
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                  {/* Bookmark Button */}
                  <button
                    type="button"
                    onClick={() => onToggleBookmark(item)}
                    className={`p-2 rounded-lg text-xs font-medium border transition-all flex items-center gap-1 ${
                      bookmarked
                        ? 'bg-amber-50 border-amber-300 text-amber-800 shadow-xs'
                        : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                    }`}
                    title={bookmarked ? 'Remove Bookmark' : 'Bookmark Content'}
                  >
                    {bookmarked ? (
                      <>
                        <BookmarkCheck className="w-4 h-4 fill-amber-500 text-amber-600" />
                        <span className="hidden sm:inline">ተቀምጧል (Saved)</span>
                      </>
                    ) : (
                      <>
                        <Bookmark className="w-4 h-4" />
                        <span className="hidden sm:inline">አስቀምጥ (Save)</span>
                      </>
                    )}
                  </button>

                  {/* Ask AI Tutor Button */}
                  <button
                    type="button"
                    onClick={() => onAskAITutor(item)}
                    className="p-2 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-medium border border-purple-200 bg-purple-50 hover:bg-purple-100 text-purple-800 transition-colors flex items-center gap-1.5"
                    title="Ask AI Personal Tutor"
                  >
                    <Bot className="w-3.5 h-3.5 text-purple-700" />
                    <span className="hidden sm:inline">በAI ተማር (Ask AI)</span>
                  </button>

                  {/* Open Content Button */}
                  <button
                    type="button"
                    onClick={() => onOpenContent(item)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs transition-colors flex items-center gap-1.5 ml-auto sm:ml-0"
                  >
                    <span>ይዘቱን ክፈት (Open)</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
