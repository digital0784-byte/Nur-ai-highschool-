import React, { useState, useEffect } from 'react';
import {
  Compass,
  ArrowRight,
  CheckCircle,
  Clock,
  Award,
  AlertTriangle,
  Layers,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { GradeLevel, SubjectKnowledgeMap, KnowledgeNode } from '../../types/curriculumEngine';
import { LanguageCode } from '../../types';
import { StudentTopicMastery, StudentMasteryLevel } from '../../types/studentApp';
import { ethiopianCurriculumEngine } from '../../engine/curriculumRegistry';
import { studentAppFirestore } from '../../services/studentAppFirestore';

interface StudentKnowledgeMapScreenProps {
  grade: GradeLevel;
  language: LanguageCode;
  darkMode: boolean;
  onOpenTopic: (subjectId: string, topicId: string) => void;
}

export const StudentKnowledgeMapScreen: React.FC<StudentKnowledgeMapScreenProps> = ({
  grade,
  language,
  darkMode,
  onOpenTopic,
}) => {
  const subjects = ethiopianCurriculumEngine.getSubjectsByGrade(grade);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(subjects[0]?.id || 'math-g9');
  const [knowledgeMap, setKnowledgeMap] = useState<SubjectKnowledgeMap | undefined>(() =>
    ethiopianCurriculumEngine.getKnowledgeMap(selectedSubjectId)
  );
  const [masteries, setMasteries] = useState<Record<string, StudentTopicMastery>>({});
  const [activeNode, setActiveNode] = useState<KnowledgeNode | null>(null);

  useEffect(() => {
    const map = ethiopianCurriculumEngine.getKnowledgeMap(selectedSubjectId);
    setKnowledgeMap(map);
    if (map?.nodes[0]) {
      setActiveNode(map.nodes[0]);
    }
    loadMasteries();
  }, [selectedSubjectId, grade]);

  const loadMasteries = async () => {
    const all = await studentAppFirestore.getAllTopicMasteries(selectedSubjectId);
    const mapped: Record<string, StudentTopicMastery> = {};
    all.forEach((m) => {
      mapped[m.topicId] = m;
    });
    setMasteries(mapped);
  };

  const getNodeStatus = (node: KnowledgeNode): StudentMasteryLevel => {
    const m = masteries[node.topicId];
    if (!m) return 'not_started';
    return m.masteryLevel;
  };

  const bgCard = darkMode ? 'bg-[#211F26] border-[#36343B]' : 'bg-white border-[#E6E0E9]';
  const textPrimary = darkMode ? 'text-[#E6E1E5]' : 'text-[#1D1B20]';
  const textSecondary = darkMode ? 'text-[#CAC4D0]' : 'text-[#49454F]';

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E6E0E9] dark:border-[#36343B]">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase bg-[#EADDFF] text-[#21005D] dark:bg-[#4F378B] dark:text-[#EADDFF]">
            <Compass className="w-3.5 h-3.5" />
            <span>የእውቀት ካርታ (Knowledge Map DAG)</span>
          </div>
          <h1 className={`text-xl sm:text-2xl font-black ${textPrimary}`}>
            የትምህርት ቅድመ-ተፈላጊዎችና የእድገት ካርታ
          </h1>
          <p className={`text-xs ${textSecondary}`}>
            የእያንዳንዱን ፅንሰ-ሀሳብ ተዛምዶና የክህሎት ደረጃ በቀጥታ ይከታተሉ።
          </p>
        </div>

        {/* Subject Selector Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {subjects.map((s) => (
            <button
              key={s.id}
              onClick={() => setSelectedSubjectId(s.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                selectedSubjectId === s.id
                  ? 'bg-[#6750A4] text-white shadow-xs'
                  : darkMode
                  ? 'bg-[#2B2930] text-[#CAC4D0] hover:text-white'
                  : 'bg-[#ECE6F0] text-[#49454F] hover:text-[#1D1B20]'
              }`}
            >
              {s.name[language] || s.name.en}
            </button>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-3 text-xs font-bold">
        <span className="text-gray-500">ደረጃዎች፡</span>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-emerald-500" />
          <span className={textPrimary}>የተካነ (Mastered ≥80%)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-indigo-500" />
          <span className={textPrimary}>እያደገ ያለ (Developing 60-79%)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-amber-500" />
          <span className={textPrimary}>በመማር ላይ (Learning &lt;60%)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-gray-400" />
          <span className={textSecondary}>ያልተጀመረ (Not Started)</span>
        </div>
      </div>

      {/* Main Grid: DAG Visualizer + Node Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Visual Map Area (8 cols) */}
        <div className={`lg:col-span-8 rounded-3xl p-6 border-[1.5px] shadow-xs space-y-6 ${bgCard}`}>
          <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-800">
            <h2 className={`text-sm font-black uppercase tracking-wider ${textSecondary}`}>
              የፅንሰ-ሀሳቦች ቅደም-ተከተል (Prerequisite Flow)
            </h2>
            <span className="text-xs text-[#6750A4] dark:text-[#D0BCFF] font-bold">
              {knowledgeMap?.nodes.length || 0} ርዕሶች ተያይዘዋል
            </span>
          </div>

          <div className="space-y-4">
            {knowledgeMap?.nodes.map((node, idx) => {
              const status = getNodeStatus(node);
              const isSelected = activeNode?.id === node.id;
              const hasPrereq = node.prerequisites && node.prerequisites.length > 0;

              let badgeColor = 'bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
              if (status === 'mastered') badgeColor = 'bg-emerald-500 text-white';
              if (status === 'developing') badgeColor = 'bg-indigo-500 text-white';
              if (status === 'learning') badgeColor = 'bg-amber-500 text-white';

              return (
                <div key={node.id} className="relative">
                  {/* Prerequisite Link indicator */}
                  {hasPrereq && (
                    <div className="pl-6 pb-2 text-[11px] font-bold text-gray-500 flex items-center gap-1.5">
                      <span className="w-3 h-3 border-l-2 border-b-2 border-gray-300 dark:border-gray-700 inline-block -mt-1" />
                      <span>ቅድመ-ተፈላጊ፡ {node.prerequisites.join(', ')}</span>
                    </div>
                  )}

                  <div
                    onClick={() => setActiveNode(node)}
                    className={`p-4 rounded-2xl border-[1.5px] transition-all cursor-pointer flex items-center justify-between gap-4 ${
                      isSelected
                        ? 'border-[#6750A4] bg-purple-50/50 dark:bg-purple-950/30 shadow-xs'
                        : darkMode
                        ? 'border-[#36343B] bg-[#2B2930] hover:border-gray-600'
                        : 'border-[#E6E0E9] bg-white hover:border-[#6750A4]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shadow-xs ${badgeColor}`}>
                        {idx + 1}
                      </span>
                      <div>
                        <h3 className={`text-sm font-bold ${textPrimary}`}>
                          {node.amharicLabel || node.label}
                        </h3>
                        <p className={`text-[11px] ${textSecondary}`}>
                          ምዕራፍ {node.unitNumber} • ደረጃ፡ {node.difficulty}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                          status === 'mastered'
                            ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300'
                            : status === 'developing'
                            ? 'bg-indigo-100 text-indigo-900 dark:bg-indigo-950 dark:text-indigo-300'
                            : status === 'learning'
                            ? 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300'
                            : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                        }`}
                      >
                        {status}
                      </span>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Node Details Card (4 cols) */}
        {activeNode && (
          <div className={`lg:col-span-4 rounded-3xl p-6 border-[1.5px] shadow-xs space-y-5 ${bgCard}`}>
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase text-[#6750A4] dark:text-[#D0BCFF]">
                የተመረጠ ርዕስ መረጃ (Node Overview)
              </span>
              <h3 className={`text-lg font-black ${textPrimary}`}>
                {activeNode.amharicLabel || activeNode.label}
              </h3>
              <p className={`text-xs ${textSecondary}`}>
                የአዲሱ ስርዓተ-ትምህርት ምዕራፍ {activeNode.unitNumber}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-[#1D1B20] border border-gray-200 dark:border-gray-800 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500">የአሁኑ ደረጃ፡</span>
                <span className="font-black text-[#6750A4]">{getNodeStatus(activeNode).toUpperCase()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">የክብደት ደረጃ፡</span>
                <span className="font-bold text-gray-800 dark:text-gray-200">{activeNode.difficulty}</span>
              </div>
            </div>

            <button
              onClick={() => onOpenTopic(selectedSubjectId, activeNode.topicId)}
              className="w-full py-3 rounded-full text-xs font-black bg-[#6750A4] text-white hover:bg-[#523e85] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-95"
            >
              <span>ወደዚህ ትምህርት ሂድ (Start Learning)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
