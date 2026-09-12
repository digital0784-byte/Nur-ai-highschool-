import React, { useState } from 'react';
import { BookmarkItem, SearchContentType } from '../../types/searchAndRecommendations';
import {
  Bookmark,
  Trash2,
  BookOpen,
  ExternalLink,
  Bot,
  Wifi,
  Search,
  Filter,
  Layers,
  HelpCircle,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface BookmarksListViewProps {
  bookmarks: BookmarkItem[];
  onRemoveBookmark: (bookmarkId: string) => void;
  onOpenContent: (bookmark: BookmarkItem) => void;
  onAskAITutor: (bookmark: BookmarkItem) => void;
}

export const BookmarksListView: React.FC<BookmarksListViewProps> = ({
  bookmarks,
  onRemoveBookmark,
  onOpenContent,
  onAskAITutor,
}) => {
  const { language } = useLanguage();
  const [filterType, setFilterType] = useState<string>('all');
  const [searchFilter, setSearchFilter] = useState<string>('');

  const filteredBookmarks = bookmarks.filter((b) => {
    if (filterType !== 'all' && b.contentType !== filterType) return false;
    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase();
      const matchTitle = b.title.toLowerCase().includes(q);
      const matchAm = b.amharicTitle?.toLowerCase().includes(q);
      const matchSubj = b.subjectName.toLowerCase().includes(q);
      if (!matchTitle && !matchAm && !matchSubj) return false;
    }
    return true;
  });

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-4 sm:p-6 space-y-4 shadow-xs">
      {/* Header & Filter Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-50 text-amber-700">
            <Bookmark className="w-5 h-5 fill-amber-500 text-amber-600" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-stone-900">
              {language === 'am' ? 'የተቀመጡ የትምህርት ማስታወሻዎች (Bookmarks)' : 'Saved Bookmarks & Favorites'}
            </h3>
            <p className="text-xs text-stone-500">
              {language === 'am'
                ? 'ከመስመር ውጭ የሚሰሩ የተመረጡ ትምህርቶች፣ ጥያቄዎች እና መልመጃዎች።'
                : 'Your offline-accessible saved curriculum topics, exercises, and question bank items.'}
            </p>
          </div>
        </div>

        {/* Content Type Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs py-1">
          {[
            { id: 'all', label: 'ሁሉም (All)' },
            { id: 'topic', label: 'ትምህርት (Topics)' },
            { id: 'exercise', label: 'መልመጃ (Exercises)' },
            { id: 'question', label: 'ጥያቄዎች (Questions)' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilterType(tab.id)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap ${
                filterType === tab.id
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Filter search bar if multiple bookmarks */}
      {bookmarks.length > 3 && (
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder={
              language === 'am'
                ? 'በተቀመጡ ማስታወሻዎች ውስጥ ፈልግ...'
                : 'Filter inside your bookmarks...'
            }
            className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
          />
        </div>
      )}

      {/* Empty State */}
      {filteredBookmarks.length === 0 ? (
        <div className="py-10 text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-full bg-stone-100 flex items-center justify-center text-stone-400">
            <Bookmark className="w-6 h-6" />
          </div>
          <div className="text-xs font-semibold text-stone-700">
            {bookmarks.length === 0
              ? language === 'am'
                ? 'ምንም የተቀመጠ ይዘት የለም'
                : 'No Bookmarks Saved Yet'
              : language === 'am'
              ? 'ከተመረጠው ማጣሪያ ጋር የሚስማማ የለም'
              : 'No bookmarks matching filter'}
          </div>
          <p className="text-2xs text-stone-500 max-w-sm mx-auto">
            {language === 'am'
              ? 'በፍለጋ ውጤቶች ላይ የሚገኘውን "አስቀምጥ" (Bookmark) ቁልፍ በመጫን ለቀጣይ ፈጣን መዳረሻ እና ከመስመር ውጭ ለማንበብ ያስቀምጡ።'
              : 'Tap the bookmark button on any search result or lesson to keep it saved for instant offline access.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filteredBookmarks.map((item) => (
            <div
              key={item.id}
              className="bg-stone-50 hover:bg-emerald-50/40 border border-stone-200 hover:border-emerald-300 rounded-xl p-3.5 space-y-2.5 transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-1 text-2xs font-medium">
                    <span className="px-1.5 py-0.5 rounded bg-white text-stone-700 border border-stone-200">
                      Grade {item.grade}
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      {item.subjectName}
                    </span>
                    {item.offlineCached && (
                      <span className="px-1.5 py-0.5 rounded bg-sky-100 text-sky-800 flex items-center gap-1 text-2xs font-semibold">
                        <Wifi className="w-2.5 h-2.5" />
                        <span>Offline Ready</span>
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => onRemoveBookmark(item.id)}
                    className="p-1 text-stone-400 hover:text-red-600 rounded-md transition-colors"
                    title="Remove Bookmark"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <h4
                  onClick={() => onOpenContent(item)}
                  className="text-xs font-bold text-stone-900 group-hover:text-emerald-800 cursor-pointer pt-1 line-clamp-1"
                >
                  {item.title}
                </h4>

                {item.snippet && (
                  <p className="text-2xs text-stone-600 line-clamp-2 mt-1">
                    {item.snippet}
                  </p>
                )}

                <div className="text-2xs text-stone-400 mt-1 flex items-center gap-2">
                  <span>{item.source}</span>
                  {item.textbookPage && <span>• ገጽ {item.textbookPage}</span>}
                </div>
              </div>

              {/* Actions row */}
              <div className="flex items-center justify-between gap-2 pt-2 border-t border-stone-200/60">
                <button
                  type="button"
                  onClick={() => onAskAITutor(item)}
                  className="px-2 py-1 bg-white hover:bg-purple-50 text-purple-700 border border-purple-200 rounded-md text-2xs font-medium flex items-center gap-1 transition-colors"
                >
                  <Bot className="w-3 h-3" />
                  <span>በAI ጠይቅ</span>
                </button>

                <button
                  type="button"
                  onClick={() => onOpenContent(item)}
                  className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-md text-2xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <span>ክፈት</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
