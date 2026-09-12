import React, { useState, useEffect } from 'react';
import {
  SearchMode,
  SearchFilters,
  SearchResultItem,
  AIIntentAnalysis,
  RecentSearchItem,
  BookmarkItem,
  CurriculumRecommendation,
} from '../../types/searchAndRecommendations';
import { GradeLevel, SupportedLanguage } from '../../types/curriculumEngine';
import { searchAndRecommendationService } from '../../services/searchAndRecommendationService';
import { SmartSearchFilterBar } from './SmartSearchFilterBar';
import { SearchResultsList } from './SearchResultsList';
import { RecentSearchesView } from './RecentSearchesView';
import { BookmarksListView } from './BookmarksListView';
import { RecommendedForYouView } from './RecommendedForYouView';
import { SearchE2EVerificationPanel } from './SearchE2EVerificationPanel';
import {
  Search,
  Sparkles,
  Bookmark,
  ShieldCheck,
  Award,
  BookOpen,
  Volume2,
  X,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface SmartSearchMainViewProps {
  userId?: string;
  studentGrade?: GradeLevel;
  progressMap?: Record<string, any>;
  weakTopics?: Array<{ topicId: string; topicTitle: string; subjectName: string; missingConcept?: string }>;
  onSelectTopic: (subjectId: string, topicId: string) => void;
  onOpenAITutor?: (prompt?: string, subjectId?: string) => void;
}

export const SmartSearchMainView: React.FC<SmartSearchMainViewProps> = ({
  userId = 'student_demo',
  studentGrade = 10,
  progressMap = {},
  weakTopics = [],
  onSelectTopic,
  onOpenAITutor,
}) => {
  const { language } = useLanguage();

  // Active Tab
  const [activeTab, setActiveTab] = useState<'search' | 'recommendations' | 'bookmarks' | 'verification'>('search');

  // Search State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchMode, setSearchMode] = useState<SearchMode>('smart');
  const [filters, setFilters] = useState<SearchFilters>({
    grade: studentGrade,
    subjectId: 'all',
    unit: 'all',
    difficulty: 'all',
    contentType: 'all',
    language: (language as SupportedLanguage) || 'en',
  });
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);
  const [aiIntent, setAiIntent] = useState<AIIntentAnalysis | undefined>();
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isOffline, setIsOffline] = useState<boolean>(!navigator.onLine);

  // Voice Search State
  const [isListeningVoice, setIsListeningVoice] = useState<boolean>(false);
  const [voiceToast, setVoiceToast] = useState<string | null>(null);

  // Recent Searches, Bookmarks & Recommendations
  const [recentSearches, setRecentSearches] = useState<RecentSearchItem[]>([]);
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [recommendations, setRecommendations] = useState<CurriculumRecommendation[]>([]);
  const [isGeneratingRecs, setIsGeneratingRecs] = useState<boolean>(false);
  const [xpToast, setXpToast] = useState<{ amount: number; title: string } | null>(null);

  // Initialize data
  useEffect(() => {
    loadLocalData();

    // Default initial search to show grade-relevant topics immediately
    executeSearch('mitosis cell division', 'smart', { grade: studentGrade });

    // Initial recommendations generation
    loadOrGenerateRecommendations();
  }, [userId, studentGrade]);

  const loadLocalData = () => {
    setRecentSearches(searchAndRecommendationService.getRecentSearches(userId));
    setBookmarks(searchAndRecommendationService.getBookmarks(userId));
    setRecommendations(searchAndRecommendationService.getCachedRecommendations(userId));
  };

  const loadOrGenerateRecommendations = async () => {
    setIsGeneratingRecs(true);
    try {
      const recs = await searchAndRecommendationService.generateRecommendations({
        userId,
        studentGrade,
        progressMap,
        weakTopics,
      });
      setRecommendations(recs);
    } catch (e) {
      console.warn('[SmartSearch] recommendations load:', e);
    } finally {
      setIsGeneratingRecs(false);
    }
  };

  // Perform search
  const executeSearch = async (
    queryOverride?: string,
    modeOverride?: SearchMode,
    filterOverride?: SearchFilters
  ) => {
    const q = queryOverride !== undefined ? queryOverride : searchQuery;
    const mode = modeOverride || searchMode;
    const f = filterOverride || filters;

    setIsSearching(true);
    try {
      const resp = await searchAndRecommendationService.executeSearch({
        query: q,
        mode,
        filters: f,
        userId,
        studentGrade,
        weakTopics: weakTopics.map((w) => w.topicId),
      });

      setSearchResults(resp.results);
      setAiIntent(resp.aiIntent);
      setIsOffline(resp.isOffline);

      // Refresh recent searches
      setRecentSearches(searchAndRecommendationService.getRecentSearches(userId));
    } finally {
      setIsSearching(false);
    }
  };

  // Voice Search Handler (Section 10 in PART 10 integration)
  const handleVoiceSearchTrigger = () => {
    if (isListeningVoice) {
      setIsListeningVoice(false);
      return;
    }

    setIsListeningVoice(true);
    setVoiceToast(
      language === 'am'
        ? 'እየሰማሁ ነው... ጥያቄዎን ወይም ርዕሱን በአማርኛ ወይም በእንግሊዝኛ ይናገሩ (ምሳሌ፡ "ስለ mitosis አብራራልኝ")'
        : 'Listening... Speak your curriculum query in English, Amharic, Afaan Oromo, or Tigrinya'
    );

    // Check if Web Speech Recognition API is supported
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = language === 'am' ? 'am-ET' : 'en-US';

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setIsListeningVoice(false);
        setVoiceToast(null);
        setSearchQuery(transcript);
        executeSearch(transcript, 'ai_intent');
      };

      recognition.onerror = () => {
        setIsListeningVoice(false);
        setVoiceToast(null);
        // Fallback simulation for unsupported environments
        const fallback = 'Grade 10 Biology Mitosis';
        setSearchQuery(fallback);
        executeSearch(fallback, 'smart');
      };

      recognition.start();
    } else {
      // Voice input simulated fallback
      setTimeout(() => {
        setIsListeningVoice(false);
        setVoiceToast(null);
        const voiceSimulationQuery = 'Explain photosynthesis reactions';
        setSearchQuery(voiceSimulationQuery);
        executeSearch(voiceSimulationQuery, 'ai_intent');
      }, 2000);
    }
  };

  // Bookmarks handlers
  const handleToggleBookmark = async (item: SearchResultItem) => {
    const res = await searchAndRecommendationService.toggleBookmark(userId, {
      contentId: item.topicId || item.id,
      contentType: item.contentType,
      title: item.title,
      amharicTitle: item.amharicTitle,
      grade: item.grade,
      subjectId: item.subjectId,
      subjectName: item.subjectName,
      unitNumber: item.unitNumber,
      unitTitle: item.unitTitle,
      topicId: item.topicId,
      topicTitle: item.topicTitle,
      textbookPage: item.textbookPage,
      snippet: item.shortExplanation,
      source: item.source,
    });
    setBookmarks(res.bookmarks);
  };

  const handleRemoveBookmark = async (bookmarkId: string) => {
    const updated = await searchAndRecommendationService.removeBookmark(userId, bookmarkId);
    setBookmarks(updated);
  };

  const isItemBookmarked = (contentId: string) => {
    return bookmarks.some((b) => b.contentId === contentId || b.id === contentId);
  };

  // Recommendations handlers
  const handleCompleteRecommendation = async (rec: CurriculumRecommendation) => {
    const res = await searchAndRecommendationService.completeRecommendation(
      userId,
      rec.id,
      (language as SupportedLanguage) || 'am'
    );
    if (res.success) {
      setRecommendations(res.updatedRecommendations);
      setXpToast({ amount: res.xpAwarded, title: rec.title });
      setTimeout(() => setXpToast(null), 4000);
    }
  };

  const handleDismissRecommendation = (recId: string) => {
    const updated = searchAndRecommendationService.dismissRecommendation(userId, recId);
    setRecommendations(updated);
  };

  // Action delegates
  const handleOpenContent = (item: { subjectId: string; topicId?: string; contentId?: string }) => {
    const tId = item.topicId || item.contentId || 'bio-g10-u2-mitosis';
    onSelectTopic(item.subjectId, tId);
  };

  const handleAskAITutor = (item: { title: string; subjectId: string; textbookPage?: any }, customPrompt?: string) => {
    const prompt =
      customPrompt ||
      `Please explain the curriculum concept "${item.title}" from Grade ${studentGrade} ${item.subjectId} (FDRE MoE textbook page ${item.textbookPage || 'curriculum citation'}).`;
    if (onOpenAITutor) {
      onOpenAITutor(prompt, item.subjectId);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Toast feedback for XP Award */}
      {xpToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-amber-500/40 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5">
          <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
            <Award className="w-5 h-5 fill-amber-400" />
          </div>
          <div>
            <div className="text-xs font-bold text-amber-400">
              +{xpToast.amount} Verified XP Awarded!
            </div>
            <p className="text-2xs text-stone-300">
              Completed activity: {xpToast.title}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setXpToast(null)}
            className="p-1 text-stone-400 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Voice Listening Toast */}
      {voiceToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-purple-900 text-white px-5 py-3 rounded-full shadow-2xl border border-purple-400/40 flex items-center gap-3 animate-bounce">
          <Volume2 className="w-5 h-5 text-purple-300 animate-pulse" />
          <span className="text-xs font-medium">{voiceToast}</span>
        </div>
      )}

      {/* Top Header Navigation Tabs */}
      <div className="bg-white rounded-2xl border border-stone-200 p-2 sm:p-3 flex flex-wrap items-center justify-between gap-2 shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto py-1">
          <button
            type="button"
            onClick={() => setActiveTab('search')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === 'search'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>{language === 'am' ? 'ብልህ ፍለጋ (Smart Search)' : 'Curriculum Search'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('recommendations')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === 'recommendations'
                ? 'bg-purple-700 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>{language === 'am' ? 'የግል ጥቆማዎች (Recommended)' : 'Recommended for You'}</span>
            {recommendations.filter((r) => r.status === 'pending').length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-purple-200 text-purple-900 text-2xs font-bold">
                {recommendations.filter((r) => r.status === 'pending').length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('bookmarks')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === 'bookmarks'
                ? 'bg-amber-700 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span>{language === 'am' ? 'የተቀመጡ (Bookmarks)' : 'Bookmarks'}</span>
            {bookmarks.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-amber-200 text-amber-900 text-2xs font-bold">
                {bookmarks.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('verification')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === 'verification'
                ? 'bg-sky-800 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{language === 'am' ? 'E2E ማረጋገጫ (Verification)' : 'E2E Lifecycle Test'}</span>
          </button>
        </div>

        <div className="hidden lg:flex items-center gap-2 text-2xs text-stone-500 font-medium px-2">
          <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
          <span>FDRE MoE Secondary Curriculum Catalog</span>
        </div>
      </div>

      {/* Main Tab Content */}
      {activeTab === 'search' && (
        <div className="space-y-6">
          {/* Search bar & filters */}
          <SmartSearchFilterBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onSearch={(queryOverride) => executeSearch(queryOverride)}
            searchMode={searchMode}
            setSearchMode={setSearchMode}
            filters={filters}
            setFilters={setFilters}
            isSearching={isSearching}
            onVoiceSearchTrigger={handleVoiceSearchTrigger}
            isListeningVoice={isListeningVoice}
          />

          {/* Recent Searches chips */}
          <RecentSearchesView
            recentSearches={recentSearches}
            onSelectSearch={(query) => {
              setSearchQuery(query);
              executeSearch(query);
            }}
            onRemoveSearch={async (id) => {
              const updated = await searchAndRecommendationService.removeRecentSearch(userId, id);
              setRecentSearches(updated);
            }}
            onClearAll={async () => {
              await searchAndRecommendationService.clearRecentSearches(userId);
              setRecentSearches([]);
            }}
          />

          {/* Search Results list */}
          <SearchResultsList
            results={searchResults}
            aiIntent={aiIntent}
            isBookmarked={isItemBookmarked}
            onToggleBookmark={handleToggleBookmark}
            onOpenContent={handleOpenContent}
            onAskAITutor={handleAskAITutor}
            isOffline={isOffline}
            searchQuery={searchQuery}
          />
        </div>
      )}

      {activeTab === 'recommendations' && (
        <div className="space-y-6">
          <RecommendedForYouView
            recommendations={recommendations}
            onCompleteActivity={handleCompleteRecommendation}
            onDismiss={handleDismissRecommendation}
            onRefreshRecommendations={loadOrGenerateRecommendations}
            onOpenContent={handleOpenContent}
            isGenerating={isGeneratingRecs}
          />
        </div>
      )}

      {activeTab === 'bookmarks' && (
        <div className="space-y-6">
          <BookmarksListView
            bookmarks={bookmarks}
            onRemoveBookmark={handleRemoveBookmark}
            onOpenContent={handleOpenContent}
            onAskAITutor={handleAskAITutor}
          />
        </div>
      )}

      {activeTab === 'verification' && (
        <div className="space-y-6">
          <SearchE2EVerificationPanel
            userId={userId}
            onRefreshData={loadLocalData}
          />
        </div>
      )}
    </div>
  );
};
