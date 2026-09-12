import React from 'react';
import { RecentSearchItem } from '../../types/searchAndRecommendations';
import { History, X, Trash2, ArrowUpRight, Search } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface RecentSearchesViewProps {
  recentSearches: RecentSearchItem[];
  onSelectSearch: (query: string, item: RecentSearchItem) => void;
  onRemoveSearch: (searchId: string) => void;
  onClearAll: () => void;
}

export const RecentSearchesView: React.FC<RecentSearchesViewProps> = ({
  recentSearches,
  onSelectSearch,
  onRemoveSearch,
  onClearAll,
}) => {
  const { language } = useLanguage();

  if (recentSearches.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-stone-200 p-6 text-center space-y-2">
        <div className="w-10 h-10 mx-auto rounded-full bg-stone-100 flex items-center justify-center text-stone-400">
          <History className="w-5 h-5" />
        </div>
        <div className="text-xs font-semibold text-stone-700">
          {language === 'am' ? 'የቅርብ ጊዜ ፍለጋዎች የሉም' : 'No Recent Searches'}
        </div>
        <p className="text-2xs text-stone-500">
          {language === 'am'
            ? 'ያደረጓቸው ፍለጋዎች ለፈጣን ዳግም መዳረሻ እዚህ ይመዘገባሉ።'
            : 'Your curriculum searches will appear here for fast one-tap re-access.'}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-4 sm:p-5 space-y-3 shadow-xs">
      <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-emerald-700" />
          <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider">
            {language === 'am' ? 'የቅርብ ጊዜ ፍለጋዎች (Recent Searches)' : 'Recent Searches'}
          </h3>
          <span className="px-1.5 py-0.2 rounded-full bg-stone-100 text-stone-600 text-2xs font-semibold">
            {recentSearches.length}
          </span>
        </div>

        <button
          type="button"
          onClick={onClearAll}
          className="text-2xs text-stone-400 hover:text-red-600 flex items-center gap-1 transition-colors"
          title="Clear search history"
        >
          <Trash2 className="w-3 h-3" />
          <span>{language === 'am' ? 'ሁሉንም አጽዳ' : 'Clear All'}</span>
        </button>
      </div>

      <div className="flex flex-wrap gap-2 pt-1">
        {recentSearches.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-1.5 pl-3 pr-1.5 py-1.5 bg-stone-50 hover:bg-emerald-50 border border-stone-200 hover:border-emerald-300 rounded-lg text-xs transition-all group"
          >
            <button
              type="button"
              onClick={() => onSelectSearch(item.query, item)}
              className="flex items-center gap-1.5 text-stone-700 group-hover:text-emerald-800 text-left font-medium"
            >
              <Search className="w-3 h-3 text-stone-400 group-hover:text-emerald-600" />
              <span>{item.query}</span>
              {item.resultCount > 0 && (
                <span className="text-2xs text-stone-400 font-normal">
                  ({item.resultCount})
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onRemoveSearch(item.id);
              }}
              className="p-1 text-stone-300 hover:text-stone-600 hover:bg-stone-200 rounded-md transition-colors"
              title="Remove from history"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
