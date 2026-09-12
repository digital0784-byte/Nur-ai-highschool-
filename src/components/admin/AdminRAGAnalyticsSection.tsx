import React, { useState, useEffect } from 'react';
import {
  Brain,
  Search,
  Database,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Activity,
  Layers,
  Sparkles,
  RefreshCw,
  Cpu,
} from 'lucide-react';
import { AIRAGStats } from '../../types/adminDashboard';
import { adminFirestoreService } from '../../services/adminFirestore';

interface AdminRAGAnalyticsSectionProps {
  initialStats?: AIRAGStats;
}

export const AdminRAGAnalyticsSection: React.FC<AdminRAGAnalyticsSectionProps> = ({
  initialStats,
}) => {
  const [stats, setStats] = useState<AIRAGStats>(
    initialStats || {
      totalIndexedDocuments: 18,
      totalChunks: 1420,
      averageRetrievalLatencyMs: 145,
      cacheHitRate: 88,
      fallbackTriggeredCount: 3,
      unsupportedQuestionsCount: 2,
    }
  );

  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Load sample chunks
  useEffect(() => {
    handleSearchChunks('Cell organelles plant and animal cells');
  }, []);

  const handleSearchChunks = async (searchQuery: string) => {
    setIsSearching(true);
    try {
      const res = await fetch(`/api/ai-tutor/rag-chunks?q=${encodeURIComponent(searchQuery || 'biology')}`);
      const data = await res.json();
      const formatted = (data.chunks || []).map((c: any) => ({
        id: c.chunkId || c.id,
        source: c.metadata?.source || c.source || 'Ministry of Education Textbook',
        textbookPage: c.metadata?.textbookPage || c.textbookPage || 1,
        text: c.snippet || c.text || '',
        score: c.relevanceScore || c.score || 0.95,
      }));
      setSearchResults(formatted);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
        <div>
          <h3 className="text-lg font-bold text-stone-900 font-serif-ethiopic flex items-center gap-2">
            <Brain className="w-5 h-5 text-teal-700" />
            <span>AI እና RAG የመረጃ ቋት ቁጥጥር (AI & RAG Management)</span>
          </h3>
          <p className="text-xs text-stone-500">
            Monitor vectorized textbook chunks, semantic retrieval latency, resilient model fallbacks, and token logs
          </p>
        </div>

        <button
          onClick={() => handleSearchChunks(query || 'curriculum')}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold rounded-xl transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>አድስ (Refresh)</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-stone-200 shadow-2xs">
          <span className="text-[10px] font-bold uppercase text-stone-500 block mb-1">RAG ሰነዶች</span>
          <div className="text-xl font-extrabold text-stone-900">{stats.totalIndexedDocuments}</div>
          <div className="text-[10px] text-emerald-700 font-semibold">18 MoE Textbooks</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-stone-200 shadow-2xs">
          <span className="text-[10px] font-bold uppercase text-stone-500 block mb-1">የተከፋፈሉ Chunks</span>
          <div className="text-xl font-extrabold text-stone-900">{stats.totalChunks}</div>
          <div className="text-[10px] text-teal-700 font-semibold">Indexed Vectors</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-stone-200 shadow-2xs">
          <span className="text-[10px] font-bold uppercase text-stone-500 block mb-1">አማካይ ፍጥነት</span>
          <div className="text-xl font-extrabold text-stone-900">{stats.averageRetrievalLatencyMs}ms</div>
          <div className="text-[10px] text-blue-700 font-semibold">Fast Semantic Search</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-stone-200 shadow-2xs">
          <span className="text-[10px] font-bold uppercase text-stone-500 block mb-1">የማስታወሻ ቅልጥፍና</span>
          <div className="text-xl font-extrabold text-stone-900">{stats.cacheHitRate}%</div>
          <div className="text-[10px] text-indigo-700 font-semibold">Prompt Cache Hits</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-stone-200 shadow-2xs">
          <span className="text-[10px] font-bold uppercase text-stone-500 block mb-1">ተደጋጋሚ Fallback</span>
          <div className="text-xl font-extrabold text-amber-700">{stats.fallbackTriggeredCount}</div>
          <div className="text-[10px] text-stone-500">Auto Resilient Fallbacks</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-stone-200 shadow-2xs">
          <span className="text-[10px] font-bold uppercase text-stone-500 block mb-1">ያልተደገፉ ጥያቄዎች</span>
          <div className="text-xl font-extrabold text-stone-700">{stats.unsupportedQuestionsCount}</div>
          <div className="text-[10px] text-stone-400">Out-of-Syllabus Filtered</div>
        </div>
      </div>

      {/* RAG Chunk Search Playground */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-4">
        <div>
          <h4 className="text-sm font-bold text-stone-900 font-serif-ethiopic flex items-center gap-2">
            <Search className="w-4 h-4 text-teal-600" />
            <span>የ RAG መረጃ ፍተሻ (Curriculum Vector Search Playground)</span>
          </h4>
          <p className="text-xs text-stone-500">
            Query textbook snippets directly to inspect how context is retrieved for students and teachers
          </p>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearchChunks(query)}
            placeholder="Search concepts (e.g., Photosynthesis, Newton's Laws, Quadratic formula)..."
            className="flex-1 text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-teal-600"
          />
          <button
            onClick={() => handleSearchChunks(query)}
            disabled={isSearching}
            className="px-4 py-2 bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            {isSearching ? 'በመፈለግ ላይ...' : 'ፈልግ (Query)'}
          </button>
        </div>

        {/* Results list */}
        <div className="space-y-2.5 pt-2">
          {searchResults.length === 0 ? (
            <div className="text-center py-6 text-stone-400 text-xs">
              ምንም የተገኘ መረጃ የለም (No chunks matching query)
            </div>
          ) : (
            searchResults.map((chunk, idx) => (
              <div
                key={chunk.id || idx}
                className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-teal-100 text-teal-900 font-mono">
                      {chunk.source || 'MoE Textbook'}
                    </span>
                    <span className="text-[11px] font-semibold text-stone-600">
                      ገጽ {chunk.textbookPage || 15}
                    </span>
                  </div>
                  <span className="text-[10px] text-emerald-700 font-bold">
                    Relevance Score: {chunk.score ? Math.round(chunk.score * 100) : 94}%
                  </span>
                </div>
                <p className="text-stone-700 leading-relaxed text-[11px] bg-white p-2.5 rounded-lg border border-stone-100">
                  {chunk.text}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
