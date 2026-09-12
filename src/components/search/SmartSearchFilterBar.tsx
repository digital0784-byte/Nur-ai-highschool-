import React, { useState } from 'react';
import {
  Search,
  Mic,
  MicOff,
  Filter,
  X,
  Sparkles,
  BookOpen,
  HelpCircle,
  Award,
  Layers,
  CheckCircle2,
  ChevronDown,
} from 'lucide-react';
import { SearchFilters, SearchMode, SearchContentType } from '../../types/searchAndRecommendations';
import { GradeLevel, SupportedLanguage, DifficultyLevel } from '../../types/curriculumEngine';
import { useLanguage } from '../../context/LanguageContext';

interface SmartSearchFilterBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSearch: (queryOverride?: string) => void;
  searchMode: SearchMode;
  setSearchMode: (mode: SearchMode) => void;
  filters: SearchFilters;
  setFilters: React.Dispatch<React.SetStateAction<SearchFilters>>;
  isSearching: boolean;
  onVoiceSearchTrigger: () => void;
  isListeningVoice: boolean;
}

export const SmartSearchFilterBar: React.FC<SmartSearchFilterBarProps> = ({
  searchQuery,
  setSearchQuery,
  onSearch,
  searchMode,
  setSearchMode,
  filters,
  setFilters,
  isSearching,
  onVoiceSearchTrigger,
  isListeningVoice,
}) => {
  const { language } = useLanguage();
  const [showAdvancedFilters, setShowAdvancedFilters] = useState<boolean>(false);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  const clearQuery = () => {
    setSearchQuery('');
  };

  const hasActiveFilters =
    (filters.grade && filters.grade !== 'all') ||
    (filters.subjectId && filters.subjectId !== 'all') ||
    (filters.unit && filters.unit !== 'all') ||
    (filters.difficulty && filters.difficulty !== 'all') ||
    (filters.contentType && filters.contentType !== 'all');

  const clearFilters = () => {
    setFilters({
      grade: 'all',
      subjectId: 'all',
      unit: 'all',
      difficulty: 'all',
      contentType: 'all',
      language: (language as SupportedLanguage) || 'en',
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-4 sm:p-5 space-y-4">
      {/* Top row: Search Mode Selectors */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-3">
        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
          <button
            type="button"
            onClick={() => setSearchMode('smart')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 whitespace-nowrap ${
              searchMode === 'smart'
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>ስማርት ፍለጋ (Smart & Typo-Tolerant)</span>
          </button>

          <button
            type="button"
            onClick={() => setSearchMode('ai_intent')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 whitespace-nowrap ${
              searchMode === 'ai_intent'
                ? 'bg-purple-700 text-white shadow-sm'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>ሰው ሰራሽ አስተውሎት (AI Intent Search)</span>
          </button>

          <button
            type="button"
            onClick={() => setSearchMode('keyword')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 whitespace-nowrap ${
              searchMode === 'keyword'
                ? 'bg-sky-700 text-white shadow-sm'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>ቀጥተኛ ቃል (Keyword / Exact)</span>
          </button>

          <button
            type="button"
            onClick={() => setSearchMode('semantic_rag')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 whitespace-nowrap ${
              searchMode === 'semantic_rag'
                ? 'bg-amber-700 text-white shadow-sm'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>የስርአተ-ትምህርት RAG (Curriculum RAG)</span>
          </button>
        </div>

        <button
          type="button"
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-colors ${
            hasActiveFilters
              ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
              : 'border-stone-200 text-stone-600 hover:bg-stone-50'
          }`}
        >
          <Filter className="w-3.5 h-3.5" />
          <span>ማጣሪያዎች (Filters)</span>
          {hasActiveFilters && (
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
          )}
          <ChevronDown
            className={`w-3 h-3 transition-transform ${showAdvancedFilters ? 'rotate-180' : ''}`}
          />
        </button>
      </div>

      {/* Main Search Input Bar with Voice Button */}
      <div className="relative flex items-center">
        <div className="absolute left-3.5 text-stone-400 pointer-events-none">
          <Search className="w-5 h-5" />
        </div>

        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            language === 'am'
              ? 'በቁልፍ ቃል፣ አርዕስት፣ ገጽ ቁጥር፣ ወይም በAI ይጠይቁ (ምሳሌ፡ "Explain quadratic equations", "Grade 10 Biology cells", "ገጽ 42")...'
              : 'Search curriculum by keyword, topic, textbook page, or ask AI (e.g., "Explain mitosis", "Quadratic equations", "Page 42")...'
          }
          className="w-full pl-11 pr-28 py-3.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all shadow-inner"
        />

        <div className="absolute right-2.5 flex items-center gap-1.5">
          {searchQuery && (
            <button
              type="button"
              onClick={clearQuery}
              className="p-1.5 text-stone-400 hover:text-stone-600 rounded-md transition-colors"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Voice Search Button (PART 10 integration) */}
          <button
            type="button"
            onClick={onVoiceSearchTrigger}
            className={`p-2 rounded-lg transition-all ${
              isListeningVoice
                ? 'bg-red-600 text-white animate-pulse shadow-md'
                : 'text-stone-500 hover:text-emerald-700 hover:bg-stone-100'
            }`}
            title="Voice Search (ድምፅ ፍለጋ)"
          >
            {isListeningVoice ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={() => onSearch()}
            disabled={isSearching}
            className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-60"
          >
            {isSearching ? (
              <span className="inline-block w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <span>ፈልግ (Search)</span>
            )}
          </button>
        </div>
      </div>

      {/* Suggested Quick Searches */}
      <div className="flex items-center gap-1.5 overflow-x-auto text-xs text-stone-500 pt-1">
        <span className="font-medium text-stone-400 whitespace-nowrap">የተለመዱ ፍለጋዎች (Try):</span>
        {[
          'Grade 10 Biology Mitosis',
          'Quadratic Equations Grade 10',
          'ሕዋስ እና የስነ-ህይወት ህግጋት',
          'Photosynthesis reactions',
          'ገጽ 42 (Page 42)',
          'Ecosystem dynamics',
        ].map((sample) => (
          <button
            key={sample}
            type="button"
            onClick={() => {
              setSearchQuery(sample);
              onSearch(sample);
            }}
            className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-md transition-colors whitespace-nowrap"
          >
            {sample}
          </button>
        ))}
      </div>

      {/* Expandable Advanced Filters (Section 7) */}
      {showAdvancedFilters && (
        <div className="pt-3 border-t border-stone-100 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs animate-in fade-in duration-200">
          {/* Grade Filter */}
          <div>
            <label className="block font-medium text-stone-700 mb-1">ክፍል (Grade)</label>
            <select
              value={filters.grade || 'all'}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  grade: e.target.value === 'all' ? 'all' : (Number(e.target.value) as GradeLevel),
                }))
              }
              className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-800 focus:ring-1 focus:ring-emerald-600"
            >
              <option value="all">ሁሉንም ክፍሎች (All Grades)</option>
              <option value="9">9ኛ ክፍል (Grade 9)</option>
              <option value="10">10ኛ ክፍል (Grade 10)</option>
              <option value="11">11ኛ ክፍል (Grade 11)</option>
              <option value="12">12ኛ ክፍል (Grade 12)</option>
            </select>
          </div>

          {/* Subject Filter */}
          <div>
            <label className="block font-medium text-stone-700 mb-1">የትምህርት ዓይነት (Subject)</label>
            <select
              value={filters.subjectId || 'all'}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  subjectId: e.target.value,
                }))
              }
              className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-800 focus:ring-1 focus:ring-emerald-600"
            >
              <option value="all">ሁሉንም (All Subjects)</option>
              <option value="biology">ስነ-ህይወት (Biology)</option>
              <option value="mathematics">ሂሳብ (Mathematics)</option>
              <option value="physics">ፊዚክስ (Physics)</option>
              <option value="chemistry">ኬሚስትሪ (Chemistry)</option>
              <option value="english">እንግሊዝኛ (English)</option>
            </select>
          </div>

          {/* Unit Filter */}
          <div>
            <label className="block font-medium text-stone-700 mb-1">ምዕራፍ (Unit)</label>
            <select
              value={filters.unit || 'all'}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  unit: e.target.value === 'all' ? 'all' : Number(e.target.value),
                }))
              }
              className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-800 focus:ring-1 focus:ring-emerald-600"
            >
              <option value="all">ሁሉንም ምዕራፍ (All Units)</option>
              <option value="1">ምዕራፍ 1 (Unit 1)</option>
              <option value="2">ምዕራፍ 2 (Unit 2)</option>
              <option value="3">ምዕራፍ 3 (Unit 3)</option>
              <option value="4">ምዕራፍ 4 (Unit 4)</option>
              <option value="5">ምዕራፍ 5 (Unit 5)</option>
            </select>
          </div>

          {/* Content Type Filter */}
          <div>
            <label className="block font-medium text-stone-700 mb-1">የይዘት ዓይነት (Content Type)</label>
            <select
              value={filters.contentType || 'all'}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  contentType: e.target.value as SearchContentType,
                }))
              }
              className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-800 focus:ring-1 focus:ring-emerald-600"
            >
              <option value="all">ሁሉንም ይዘት (All Types)</option>
              <option value="topic">አርዕስት (Topic / Lesson)</option>
              <option value="unit">ምዕራፍ (Unit Overview)</option>
              <option value="exercise">መልመጃ (Exercises)</option>
              <option value="question">የፈተና ጥያቄዎች (Question Bank)</option>
            </select>
          </div>

          {/* Difficulty Filter */}
          <div>
            <label className="block font-medium text-stone-700 mb-1">ከበድነት (Difficulty)</label>
            <select
              value={filters.difficulty || 'all'}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  difficulty: e.target.value as DifficultyLevel | 'all',
                }))
              }
              className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-800 focus:ring-1 focus:ring-emerald-600"
            >
              <option value="all">ሁሉንም ደረጃ (All Levels)</option>
              <option value="easy">ቀላል (Easy)</option>
              <option value="medium">መካከለኛ (Medium)</option>
              <option value="hard">ከባድ (Hard)</option>
            </select>
          </div>

          {/* Clear Filters Button */}
          <div className="flex items-end">
            <button
              type="button"
              onClick={clearFilters}
              className="w-full py-2 px-3 border border-stone-200 hover:bg-stone-100 text-stone-600 font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5"
            >
              <X className="w-3.5 h-3.5" />
              <span>ማጣሪያ አጽዳ (Reset)</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
