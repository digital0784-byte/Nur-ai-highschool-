import React, { useState } from 'react';
import {
  BookOpen,
  GraduationCap,
  Sparkles,
  Scale,
  Globe,
  BrainCircuit,
  Layers,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  FileText,
  ChevronDown,
  ChevronUp,
  Bookmark,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { DeepAnalysisResult, SOURCE_PRIORITY_LABELS, SourcePriorityLevel } from '../types/researchAnalysis';

interface DeepAnalysisResultViewProps {
  analysis: DeepAnalysisResult;
  compact?: boolean;
}

export const DeepAnalysisResultView: React.FC<DeepAnalysisResultViewProps> = ({
  analysis,
  compact = false,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'curriculum' | 'research' | 'applications' | 'citations'>('all');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    perspectives: true,
    examples: true,
    disagreement: true,
    citations: false,
    books: false,
  });

  const toggleSection = (key: string) => {
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="mt-3 bg-stone-50 border border-stone-200 rounded-xl overflow-hidden shadow-xs text-[#24211E]">
      {/* Header Banner */}
      <div className="bg-[#FAF6EC] px-4 py-3 border-b border-[#E3DAC4] flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-xs">
            <BrainCircuit className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm text-[#1E1B18]">
                ጥልቅ ባለብዙ ምንጭ የአካዳሚክ ትንታኔ (13-Point Research Synthesis)
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                13 ነጥቦች የተሟሉ
              </span>
            </div>
            <span className="text-[11px] text-[#7A7060]">
              ክፍል {analysis.grade} {analysis.subject} • {analysis.adaptiveDepthLabel || 'Curriculum + External Research'}
            </span>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto text-[11px] font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
              activeTab === 'all'
                ? 'bg-amber-800 text-white'
                : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            ሙሉ ትንታኔ (All 13)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('curriculum')}
            className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
              activeTab === 'curriculum'
                ? 'bg-emerald-800 text-white'
                : 'bg-white text-emerald-800 hover:bg-emerald-50 border border-emerald-200'
            }`}
          >
            ደረጃ 1፡ ስርዓተ-ትምህርት
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('research')}
            className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
              activeTab === 'research'
                ? 'bg-indigo-800 text-white'
                : 'bg-white text-indigo-800 hover:bg-indigo-50 border border-indigo-200'
            }`}
          >
            ደረጃ 2-6፡ የምርምር ትንታኔ
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('applications')}
            className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
              activeTab === 'applications'
                ? 'bg-amber-700 text-white'
                : 'bg-white text-amber-800 hover:bg-amber-50 border border-amber-200'
            }`}
          >
            ተጨባጭ አተገባበር
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4 text-xs sm:text-sm">
        {/* 1. Definition */}
        {(activeTab === 'all' || activeTab === 'curriculum') && (
          <div className="p-3 bg-white rounded-lg border border-stone-200">
            <div className="flex items-center gap-1.5 font-extrabold text-amber-900 mb-1">
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-100 border border-amber-300 font-mono">
                1
              </span>
              <span>📌 መሰረታዊ ፍቺ (Core Definition)</span>
            </div>
            <p className="text-[#38332D] leading-relaxed">{analysis.definition}</p>
          </div>
        )}

        {/* 2. Curriculum Explanation */}
        {(activeTab === 'all' || activeTab === 'curriculum') && (
          <div className="p-3.5 bg-emerald-50/60 rounded-lg border border-emerald-200">
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <div className="flex items-center gap-1.5 font-extrabold text-emerald-950">
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-200 border border-emerald-400 font-mono">
                  2
                </span>
                <BookOpen className="w-4 h-4 text-emerald-800" />
                <span>📖 በኢትዮጵያ ስርዓተ-ትምህርት መሰረት (According to the Ethiopian Curriculum)</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-300">
                ደረጃ 1 - ዋነኛ ምንጭ
              </span>
            </div>
            <p className="text-stone-800 leading-relaxed whitespace-pre-wrap">
              {analysis.curriculumExplanation || (analysis as any).curriculumAnswer}
            </p>
          </div>
        )}

        {/* 3. Deeper Explanation */}
        {(activeTab === 'all' || activeTab === 'research') && (
          <div className="p-3.5 bg-indigo-50/60 rounded-lg border border-indigo-200">
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <div className="flex items-center gap-1.5 font-extrabold text-indigo-950">
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-indigo-200 border border-indigo-400 font-mono">
                  3
                </span>
                <GraduationCap className="w-4 h-4 text-indigo-800" />
                <span>🔬 ተጨማሪ ጥልቅ ማብራሪያ (Additional Advanced Explanation)</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-900 border border-indigo-300">
                ደረጃ 2-5 - የውጭ ማመሳከሪያ
              </span>
            </div>
            <p className="text-stone-800 leading-relaxed whitespace-pre-wrap">
              {analysis.deeperExplanation || (analysis as any).extendedAnalysis}
            </p>
          </div>
        )}

        {/* 4. Key Concepts */}
        {activeTab === 'all' && analysis.keyConcepts && analysis.keyConcepts.length > 0 && (
          <div className="p-3 bg-white rounded-lg border border-stone-200">
            <div className="flex items-center gap-1.5 font-extrabold text-stone-800 mb-2">
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-stone-200 border border-stone-300 font-mono">
                4
              </span>
              <span>💡 ዋና ዋና ፅንሰ-ሀሳቦችና ቀመሮች (Key Concepts & Principles)</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {analysis.keyConcepts.map((concept, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-md bg-[#FAF6EC] border border-[#E3DAC4] text-xs font-bold text-amber-950"
                >
                  ✓ {concept}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 5. Different Perspectives & Multi-Source Disagreement */}
        {(activeTab === 'all' || activeTab === 'research') && (
          <div className="p-3.5 bg-white rounded-lg border border-stone-200 space-y-3">
            <div
              onClick={() => toggleSection('perspectives')}
              className="flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-1.5 font-extrabold text-stone-900">
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-stone-200 border border-stone-300 font-mono">
                  5
                </span>
                <Scale className="w-4 h-4 text-purple-700" />
                <span>⚖️ የተለያዩ አመለካከቶችና የሳይንሳዊ ክርክር ትንታኔ (Different Perspectives & Disagreement)</span>
              </div>
              <button type="button" className="text-stone-500 hover:text-stone-800">
                {expandedSections.perspectives ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>

            {expandedSections.perspectives && (
              <div className="space-y-2.5 pt-1">
                {analysis.differentPerspectives && analysis.differentPerspectives.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {analysis.differentPerspectives.map((persp, idx) => (
                      <div key={idx} className="p-2.5 rounded-lg bg-stone-50 border border-stone-200 text-xs">
                        <div className="font-extrabold text-stone-900 flex items-center justify-between">
                          <span>{persp.perspectiveTitle}</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-50 text-purple-700 border border-purple-200">
                            {persp.consensusDegree}
                          </span>
                        </div>
                        <p className="text-stone-600 mt-1">{persp.description}</p>
                        <div className="text-[10px] font-bold text-stone-400 mt-1">
                          ምንጭ፡ {persp.proponentOrSource}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Multi-Source Disagreement Synthesis */}
                {analysis.multiSourceDisagreement && (
                  <div className="p-3 rounded-lg bg-amber-50/70 border border-amber-200 text-xs">
                    <div className="font-extrabold text-amber-950 flex items-center gap-1 mb-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                      <span>የምንጮች ልዩነት (Issue): {analysis.multiSourceDisagreement.issue}</span>
                    </div>
                    <div className="space-y-1.5 my-2">
                      {analysis.multiSourceDisagreement.positions.map((pos, pIdx) => (
                        <div key={pIdx} className="p-2 rounded bg-white/90 border border-amber-200 text-[11px]">
                          <div className="font-bold text-stone-900 flex items-center justify-between">
                            <span>{pos.sourceName} (ደረጃ {pos.priorityLevel})</span>
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-800 font-bold">
                              ማስረጃ፡ {pos.evidenceStrength}
                            </span>
                          </div>
                          <p className="text-stone-700">{pos.stance}</p>
                          <span className="text-stone-500 text-[10px] block italic mt-0.5">ምክንያት፡ {pos.rationale}</span>
                        </div>
                      ))}
                    </div>
                    <div className="pt-2 border-t border-amber-200/80 font-medium text-amber-950 text-[11px]">
                      <span className="font-bold">የ AI ቅንጅታዊ ዳኝነት (Synthesis Verdict): </span>
                      {analysis.multiSourceDisagreement.synthesisVerdict}
                    </div>
                    {analysis.multiSourceDisagreement.epistemicUncertaintyNote && (
                      <div className="text-[10px] text-stone-500 mt-1 italic">
                        ማስታወሻ፡ {analysis.multiSourceDisagreement.epistemicUncertaintyNote}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* 6. Concrete Examples */}
        {(activeTab === 'all' || activeTab === 'curriculum') && analysis.examples && analysis.examples.length > 0 && (
          <div className="p-3.5 bg-white rounded-lg border border-stone-200 space-y-2">
            <div
              onClick={() => toggleSection('examples')}
              className="flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-1.5 font-extrabold text-stone-900">
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-stone-200 border border-stone-300 font-mono">
                  6
                </span>
                <FileText className="w-4 h-4 text-emerald-700" />
                <span>📐 የተሰሩ ምሳሌዎችና ስሌቶች (Concrete Worked Examples)</span>
              </div>
              <button type="button" className="text-stone-500 hover:text-stone-800">
                {expandedSections.examples ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>

            {expandedSections.examples && (
              <div className="space-y-2 pt-1">
                {analysis.examples.map((ex, exIdx) => (
                  <div key={exIdx} className="p-3 rounded-lg bg-[#FAF6EC] border border-[#E3DAC4] text-xs">
                    <div className="font-extrabold text-amber-950 mb-1">{ex.title}</div>
                    <div className="font-bold text-stone-800 mb-1">ጥያቄ/ሁኔታ፡ {ex.scenarioOrProblem}</div>
                    <div className="p-2 rounded bg-white border border-stone-200 font-mono text-[11px] text-stone-900 whitespace-pre-wrap">
                      {ex.detailedWalkthrough}
                    </div>
                    {ex.sourceCitation && (
                      <span className="text-[10px] text-stone-500 mt-1 block">ምንጭ፡ {ex.sourceCitation}</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 7. Real-world Application */}
        {(activeTab === 'all' || activeTab === 'applications') && (
          <div className="p-3.5 bg-emerald-50/70 rounded-lg border border-emerald-300">
            <div className="flex items-center gap-1.5 font-extrabold text-emerald-950 mb-1.5">
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-200 border border-emerald-400 font-mono">
                7
              </span>
              <Globe className="w-4 h-4 text-emerald-800" />
              <span>🌍 ተጨባጭ የሀገር ውስጥ እና ዓለም አቀፍ አተገባበር (Ethiopian Real-World Applications)</span>
            </div>
            <p className="text-emerald-950 leading-relaxed font-medium">
              {analysis.realWorldApplication}
            </p>
          </div>
        )}

        {/* 8 & 9. Advantages & Limitations */}
        {activeTab === 'all' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-emerald-50/40 border border-emerald-200">
              <div className="flex items-center gap-1.5 font-extrabold text-emerald-950 mb-1.5">
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-200 border border-emerald-300 font-mono">
                  8
                </span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                <span>➕ ጥቅሞችና ጠቀሜታ (Advantages)</span>
              </div>
              <ul className="space-y-1 text-xs text-stone-700">
                {analysis.advantages.map((adv, aIdx) => (
                  <li key={aIdx} className="flex items-start gap-1">
                    <span className="text-emerald-700 font-bold">•</span>
                    <span>{adv}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-3 rounded-lg bg-amber-50/40 border border-amber-200">
              <div className="flex items-center gap-1.5 font-extrabold text-amber-950 mb-1.5">
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-200 border border-amber-300 font-mono">
                  9
                </span>
                <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                <span>⚠️ ወሰኖችና ገደቦች (Limitations & Constraints)</span>
              </div>
              <ul className="space-y-1 text-xs text-stone-700">
                {analysis.limitations.map((lim, lIdx) => (
                  <li key={lIdx} className="flex items-start gap-1">
                    <span className="text-amber-700 font-bold">•</span>
                    <span>{lim}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* 10. Related Concepts */}
        {activeTab === 'all' && analysis.relatedConcepts && analysis.relatedConcepts.length > 0 && (
          <div className="p-3 bg-white rounded-lg border border-stone-200">
            <div className="flex items-center gap-1.5 font-extrabold text-stone-800 mb-1.5">
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-stone-200 border border-stone-300 font-mono">
                10
              </span>
              <Layers className="w-4 h-4 text-indigo-700" />
              <span>🕸️ ተዛማጅ ፅንሰ-ሀሳቦች በዕውቀት ካርታው (Related Concepts in Knowledge Graph)</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {analysis.relatedConcepts.map((rc, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded bg-indigo-50 border border-indigo-200 text-xs font-medium text-indigo-900"
                >
                  🔗 {rc}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 11. Critical Thinking Questions */}
        {activeTab === 'all' && analysis.criticalThinkingQuestions && analysis.criticalThinkingQuestions.length > 0 && (
          <div className="p-3.5 bg-purple-50/50 rounded-lg border border-purple-200">
            <div className="flex items-center gap-1.5 font-extrabold text-purple-950 mb-2">
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-purple-200 border border-purple-300 font-mono">
                11
              </span>
              <HelpCircle className="w-4 h-4 text-purple-800" />
              <span>🤔 የማሰብ አቅምን የሚያዳብሩ ጥያቄዎች (Critical-Thinking Questions)</span>
            </div>
            <div className="space-y-1.5 text-xs text-purple-950">
              {analysis.criticalThinkingQuestions.map((ctq, idx) => (
                <div key={idx} className="p-2 rounded bg-white/90 border border-purple-100 flex items-start gap-2">
                  <span className="font-bold text-purple-800">{idx + 1}.</span>
                  <span>{ctq}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 12. Summary */}
        {activeTab === 'all' && (
          <div className="p-3.5 bg-[#FAF6EC] rounded-lg border border-[#E3DAC4]">
            <div className="flex items-center gap-1.5 font-extrabold text-[#38332D] mb-1">
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-[#E3DAC4] border border-stone-400 font-mono">
                12
              </span>
              <span>📝 ማጠቃለያና ዋና ዋና ነጥቦች (Summary & Key Takeaways)</span>
            </div>
            <p className="text-[#24211E] leading-relaxed font-medium">{analysis.summary}</p>
          </div>
        )}

        {/* 13. Sources & Citations */}
        <div className="p-3.5 bg-white rounded-lg border border-stone-200 space-y-2">
          <div
            onClick={() => toggleSection('citations')}
            className="flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-1.5 font-extrabold text-stone-900">
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-stone-200 border border-stone-300 font-mono">
                13
              </span>
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>📚 የተረጋገጡ ምንጮችና ማጣቀሻዎች (Verified Citations - Levels 1 to 6)</span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-stone-100 text-stone-700">
                {analysis.citations?.length || 1}
              </span>
            </div>
            <button type="button" className="text-stone-500 hover:text-stone-800">
              {expandedSections.citations ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          {expandedSections.citations && (
            <div className="space-y-2 pt-1">
              {analysis.citations?.map((cit, idx) => {
                const priorityInfo = SOURCE_PRIORITY_LABELS[cit.priorityLevel as SourcePriorityLevel] || SOURCE_PRIORITY_LABELS[1];
                return (
                  <div
                    key={idx}
                    className={`p-2.5 rounded-lg border text-xs ${
                      cit.isCurriculum
                        ? 'bg-emerald-50/60 border-emerald-200'
                        : 'bg-stone-50 border-stone-200'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
                      <span className="font-extrabold text-stone-900">{cit.sourceTitle}</span>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${priorityInfo.badgeColor}`}>
                        {priorityInfo.am}
                      </span>
                    </div>
                    <div className="text-[11px] text-stone-600">
                      ደራሲ/ተቋም፡ <span className="font-bold text-stone-800">{cit.author}</span>
                      {cit.publisher && <> • አሳታሚ፡ {cit.publisher}</>}
                      {cit.year && <> ({cit.year})</>}
                      {cit.pageNumber && <> • ገጽ {cit.pageNumber}</>}
                    </div>
                    {cit.exactSnippetOrSummary && (
                      <p className="mt-1 text-[11px] text-stone-500 italic bg-white/70 p-1.5 rounded border border-stone-100">
                        "{cit.exactSnippetOrSummary}"
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recommended Books if present */}
        {analysis.recommendedBooks && analysis.recommendedBooks.length > 0 && (
          <div className="p-3 bg-[#FAF6EC] rounded-lg border border-[#E3DAC4] space-y-2">
            <div
              onClick={() => toggleSection('books')}
              className="flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-1.5 font-extrabold text-amber-950">
                <Bookmark className="w-4 h-4 text-amber-800" />
                <span>📖 ለተጨማሪ ጥናት የተመከሩ አጋዥ መጻሕፍት (Recommended Reference Books)</span>
              </div>
              <button type="button" className="text-stone-500 hover:text-stone-800">
                {expandedSections.books ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>

            {expandedSections.books && (
              <div className="space-y-1.5 pt-1">
                {analysis.recommendedBooks.map((book: any, bIdx: number) => {
                  const title = typeof book === 'string' ? book : book.title;
                  const author = typeof book === 'object' ? book.author : '';
                  const publisher = typeof book === 'object' ? book.publisher : '';
                  const year = typeof book === 'object' ? book.year : '';
                  return (
                    <div key={bIdx} className="p-2 rounded bg-white border border-[#E3DAC4] text-xs">
                      <span className="font-extrabold text-stone-900">{title}</span>
                      {(author || publisher) && (
                        <div className="text-[11px] text-stone-500">
                          {author && `በ ${author}`} {publisher && `(${publisher}, ${year})`}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
