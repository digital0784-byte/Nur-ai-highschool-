import React, { useState } from 'react';
import { KnowledgeNode, KnowledgeEdge } from '../types/curriculumEngine';
import { CheckCircle2, AlertTriangle, ArrowRight, BookOpen, Layers } from 'lucide-react';

interface Props {
  nodes: KnowledgeNode[];
  edges: KnowledgeEdge[];
  selectedNodeId?: string;
  onSelectNode: (node: KnowledgeNode) => void;
  language?: string;
}

export const CurriculumKnowledgeMapView: React.FC<Props> = ({
  nodes,
  edges,
  selectedNodeId,
  onSelectNode,
  language = 'am',
}) => {
  const [filterDifficulty, setFilterDifficulty] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');

  const filteredNodes = nodes.filter((n) =>
    filterDifficulty === 'all' ? true : n.difficulty === filterDifficulty
  );

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-600" />
            <h3 className="text-lg font-bold text-slate-800">
              {language === 'am' ? 'የእውቀት ካርታ እና የቅድመ-ዕውቀት ግንኙነቶች (Knowledge Map)' : 'Subject Knowledge DAG & Prerequisite Map'}
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {language === 'am'
              ? 'በአዲሱ የኢትዮጵያ ስርዓተ-ትምህርት ርዕሶች መካከል ያሉ የቅድመ-ትምህርት (Prerequisite) ትስስሮች እና የተማሪ ብቃት ደረጃ'
              : 'Directed acyclic graph of textbook topic dependencies and mastery states'}
          </p>
        </div>

        {/* Difficulty Filter */}
        <div className="flex items-center gap-1.5 bg-slate-50 p-1 rounded-xl border border-slate-200">
          {(['all', 'easy', 'medium', 'hard'] as const).map((diff) => (
            <button
              key={diff}
              onClick={() => setFilterDifficulty(diff)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all capitalize ${
                filterDifficulty === diff
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {diff === 'all' ? (language === 'am' ? 'ሁሉም' : 'All') : diff}
            </button>
          ))}
        </div>
      </div>

      {/* Visual Graph Flow */}
      <div className="relative overflow-x-auto pb-4">
        <div className="min-w-[650px] flex flex-col gap-6">
          {/* Top Layer: Foundational */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              {language === 'am' ? 'መሰረታዊ ፅንሰ-ሃሳቦች (Foundational Concepts)' : 'Foundational Concepts'}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredNodes
                .filter((n) => n.importance === 'foundational')
                .map((node) => renderNodeCard(node))}
            </div>
          </div>

          {/* Middle Layer: Core */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              {language === 'am' ? 'ዋና የክፍል ደረጃ ርዕሶች (Core Competencies)' : 'Core Competencies'}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredNodes
                .filter((n) => n.importance === 'core')
                .map((node) => renderNodeCard(node))}
            </div>
          </div>

          {/* Top Layer: Advanced */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-purple-500"></span>
              {language === 'am' ? 'ከፍተኛ የትንታኔ ርዕሶች (Advanced & Synthesis)' : 'Advanced & Synthesis'}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredNodes
                .filter((n) => n.importance === 'advanced')
                .map((node) => renderNodeCard(node))}
            </div>
          </div>
        </div>
      </div>

      {/* Prerequisite Edges Relationship Legend */}
      <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
        <div className="flex items-center gap-4">
          <span className="font-semibold text-slate-700">
            {language === 'am' ? 'የቅድመ-ትምህርት ትስስሮች፦' : 'Prerequisite Links:'}
          </span>
          <span className="flex items-center gap-1 text-slate-500">
            <ArrowRight className="w-3.5 h-3.5 text-indigo-500" />
            {edges.length} {language === 'am' ? 'የተመዘገቡ ቀጥተኛ ትስስሮች' : 'Direct Dependencies'}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-emerald-100 border border-emerald-400"></span>
            ≥ 80% {language === 'am' ? 'የተሟላ ብቃት' : 'Mastered'}
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-amber-100 border border-amber-400"></span>
            60-79% {language === 'am' ? 'በሂደት ላይ' : 'Developing'}
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-rose-100 border border-rose-400"></span>
            &lt; 60% {language === 'am' ? 'ክለሳ የሚያስፈልገው' : 'Needs Review'}
          </span>
        </div>
      </div>
    </div>
  );

  function renderNodeCard(node: KnowledgeNode) {
    const isSelected = selectedNodeId === node.id;
    const mastery = node.masteryPercentage ?? 75;
    const isMastered = mastery >= 80;
    const isWeak = mastery < 60;

    return (
      <button
        key={node.id}
        onClick={() => onSelectNode(node)}
        className={`text-left p-3.5 rounded-xl border transition-all relative ${
          isSelected
            ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-500/20 shadow-xs'
            : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs'
        }`}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                Unit {node.unitNumber}
              </span>
              <span
                className={`text-[10px] font-semibold px-1.5 py-0.5 rounded uppercase ${
                  node.difficulty === 'easy'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : node.difficulty === 'medium'
                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}
              >
                {node.difficulty}
              </span>
            </div>
            <h4 className="text-xs font-bold text-slate-800 line-clamp-1">
              {language === 'am' ? node.amharicLabel : node.label}
            </h4>
            <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
              {node.label}
            </p>
          </div>

          <div className="shrink-0 flex items-center">
            {isMastered ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            ) : isWeak ? (
              <AlertTriangle className="w-4 h-4 text-rose-500" />
            ) : (
              <BookOpen className="w-4 h-4 text-amber-500" />
            )}
          </div>
        </div>

        {/* Mastery Progress Bar */}
        <div className="mt-3 pt-2 border-t border-slate-100">
          <div className="flex justify-between items-center text-[10px] mb-1">
            <span className="text-slate-500">
              {language === 'am' ? 'የብቃት ደረጃ' : 'Mastery'}
            </span>
            <span
              className={`font-bold ${
                isMastered ? 'text-emerald-700' : isWeak ? 'text-rose-700' : 'text-amber-700'
              }`}
            >
              {mastery}%
            </span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${
                isMastered ? 'bg-emerald-500' : isWeak ? 'bg-rose-500' : 'bg-amber-500'
              }`}
              style={{ width: `${mastery}%` }}
            ></div>
          </div>
        </div>
      </button>
    );
  }
};
