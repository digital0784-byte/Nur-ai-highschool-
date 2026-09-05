import React, { useState } from 'react';
import { Subject, Grade } from '../../types';
import { PlotlyGraphVisualizer, GraphMode } from './PlotlyGraphVisualizer';
import { PhysicsCanvasSimulator, SimulationType } from './PhysicsCanvasSimulator';
import { InteractiveAnimationStudio } from '../InteractiveAnimationStudio';
import { useLanguage } from '../../context/LanguageContext';
import {
  TrendingUp,
  Activity,
  Layers,
  Sparkles,
  Bot,
  Sliders,
  Play,
  RotateCcw,
  Zap,
  Compass,
  Atom,
  Eye,
  Loader2,
  CheckCircle2,
} from 'lucide-react';

interface VisualDualEngineStudioProps {
  subject: Subject;
  grade: Grade;
  onOpenAITutor?: (chapterTitle: string, mode: 'analysis' | 'chat') => void;
  onExit?: () => void;
}

export type VisualStudioTab = 'graphing' | 'simulation' | 'flow_diagram';

export const VisualDualEngineStudio: React.FC<VisualDualEngineStudioProps> = ({
  subject,
  grade,
  onOpenAITutor,
  onExit,
}) => {
  const { t, language } = useLanguage();

  // Smart initial tab based on subject
  const initialTab: VisualStudioTab =
    subject.id === 'math'
      ? 'graphing'
      : subject.id === 'physics'
      ? 'simulation'
      : 'flow_diagram';

  const [activeTab, setActiveTab] = useState<VisualStudioTab>(initialTab);
  const [aiCustomPrompt, setAiCustomPrompt] = useState<string>('');
  const [isGeneratingAiVisual, setIsGeneratingAiVisual] = useState<boolean>(false);
  const [aiVisualGuidance, setAiVisualGuidance] = useState<string | null>(null);

  // Direct preset shortcuts for Ethiopian curriculum
  const [graphMode, setGraphMode] = useState<GraphMode>(
    grade >= 11 ? 'vector_3d' : 'quadratic'
  );
  const [simType, setSimType] = useState<SimulationType>(
    subject.id === 'biology' ? 'photosynthesis' : 'projectile'
  );

  const handleGenerateAiVisual = async () => {
    if (!aiCustomPrompt.trim() || isGeneratingAiVisual) return;
    setIsGeneratingAiVisual(true);
    setAiVisualGuidance(null);

    try {
      const res = await fetch('/api/ai/generate-animation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topicName: aiCustomPrompt.trim(),
          subjectName: subject.name,
          grade,
          language,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        // Check if the prompt suggests graphing or simulation
        const lower = aiCustomPrompt.toLowerCase();
        if (lower.includes('graph') || lower.includes('parabola') || lower.includes('vector') || lower.includes('quadratic')) {
          setActiveTab('graphing');
          setGraphMode(lower.includes('vector') || lower.includes('3d') ? 'vector_3d' : 'quadratic');
        } else if (lower.includes('motion') || lower.includes('projectile') || lower.includes('pendulum') || lower.includes('circuit') || lower.includes('wave')) {
          setActiveTab('simulation');
          if (lower.includes('circuit') || lower.includes('ohm')) setSimType('circuit_ohm');
          else if (lower.includes('pendulum')) setSimType('pendulum');
          else if (lower.includes('wave')) setSimType('wave_interference');
          else setSimType('projectile');
        } else {
          setActiveTab('flow_diagram');
        }

        setAiVisualGuidance(
          `✨ **${data.title || aiCustomPrompt}**፡ በኢትዮጵያ ስርዓተ-ትምህርት መሰረት ምስላዊ ማብራሪያው ተዘጋጅቷል። የተብራሩ ነጥቦች፡ ${(data.keyTakeaways || []).join(' • ')}`
        );
      }
    } catch (err) {
      console.warn('AI Visual Generation error:', err);
    } finally {
      setIsGeneratingAiVisual(false);
    }
  };

  return (
    <div id="visual-dual-engine-studio" className="space-y-6">
      {/* Visual Engine Navigation Header */}
      <div className="bg-[#EDE6D4] border-[1.5px] border-[#38332D] rounded-xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-900 border border-indigo-400 text-[11px] font-sans font-black tracking-wide uppercase flex items-center gap-1">
              <Zap className="w-3 h-3 text-indigo-700" />
              Interactive Dual-Engine Studio
            </span>
            <span className="text-xs text-[#5A5143] font-serif-ethiopic">
              {grade}ኛ ክፍል • {subject.name}
            </span>
          </div>

          <h2 className="text-lg sm:text-xl font-bold font-serif-ethiopic text-[#1E1B18]">
            ምስላዊ የትምህርት ስቱዲዮ (Visual Learning & Simulation Studio)
          </h2>

          <p className="text-xs sm:text-sm text-[#474036] font-serif-ethiopic max-w-2xl leading-relaxed">
            በፕሎትሊ (Plotly.js) የተደገፉ የሂሳብ 2D/3D ግራፎች እና በኤችቲኤምኤል5 ካንቫስ (Canvas) የሚሰሩ የቀጥታ ፊዚክስ/ባዮሎጂ ማስመሰያዎች።
          </p>
        </div>

        {/* Engine Switcher Buttons */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            id="engine-tab-graphing"
            onClick={() => setActiveTab('graphing')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold font-serif-ethiopic transition-all cursor-pointer border ${
              activeTab === 'graphing'
                ? 'bg-[#1E1B18] text-[#FAF6EC] border-[#1E1B18] shadow-2xs'
                : 'bg-[#FAF6EC] text-[#38332D] border-[#38332D]/30 hover:bg-[#E3DAC4]'
            }`}
          >
            <TrendingUp className="w-4 h-4 text-blue-400" />
            <span>📐 የሂሳብ ግራፎች (Plotly 2D/3D)</span>
          </button>

          <button
            id="engine-tab-simulation"
            onClick={() => setActiveTab('simulation')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold font-serif-ethiopic transition-all cursor-pointer border ${
              activeTab === 'simulation'
                ? 'bg-[#1E1B18] text-[#FAF6EC] border-[#1E1B18] shadow-2xs'
                : 'bg-[#FAF6EC] text-[#38332D] border-[#38332D]/30 hover:bg-[#E3DAC4]'
            }`}
          >
            <Activity className="w-4 h-4 text-emerald-400" />
            <span>🚀 ፊዚክስ ማስመሰያ (Canvas Sim)</span>
          </button>

          <button
            id="engine-tab-flow"
            onClick={() => setActiveTab('flow_diagram')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold font-serif-ethiopic transition-all cursor-pointer border ${
              activeTab === 'flow_diagram'
                ? 'bg-[#1E1B18] text-[#FAF6EC] border-[#1E1B18] shadow-2xs'
                : 'bg-[#FAF6EC] text-[#38332D] border-[#38332D]/30 hover:bg-[#E3DAC4]'
            }`}
          >
            <Layers className="w-4 h-4 text-purple-400" />
            <span>✨ የአኒሜሽን ፍሰት (Process Flow)</span>
          </button>
        </div>
      </div>

      {/* AI Custom Visual Generator Bar */}
      <div className="bg-[#FAF6EC] border-[1.5px] border-[#38332D] rounded-xl p-3.5 sm:p-4 shadow-2xs space-y-2.5">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={aiCustomPrompt}
              onChange={(e) => setAiCustomPrompt(e.target.value)}
              placeholder="ለምሳሌ፡ ኳድራቲክ ፈንክሽን፣ የፕሮጀክትይል አወንጫፊ፣ የኦህም ህግ፣ የዲኤንኤ አወቃቀር..."
              className="w-full bg-[#EDE6D4] border-[1.5px] border-[#38332D] rounded-xl px-4 py-2 text-xs sm:text-sm font-serif-ethiopic focus:outline-none focus:ring-2 focus:ring-amber-500 text-[#1E1B18]"
            />
          </div>

          <button
            onClick={handleGenerateAiVisual}
            disabled={!aiCustomPrompt.trim() || isGeneratingAiVisual}
            className="px-4 py-2 rounded-xl bg-[#1E1B18] text-[#FAF6EC] hover:bg-[#38332D] text-xs font-bold font-serif-ethiopic flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer disabled:opacity-50 shrink-0"
          >
            {isGeneratingAiVisual ? (
              <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
            ) : (
              <Sparkles className="w-4 h-4 text-amber-400" />
            )}
            <span>በGemini AI ምስላዊ ፈብርክ (Generate Visual)</span>
          </button>
        </div>

        {aiVisualGuidance && (
          <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-lg text-xs font-serif-ethiopic text-emerald-950 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <span>{aiVisualGuidance}</span>
          </div>
        )}
      </div>

      {/* Engine 1: Plotly 2D/3D Graphing Engine */}
      {activeTab === 'graphing' && (
        <PlotlyGraphVisualizer
          initialMode={graphMode}
          topicTitle={subject.name}
          subjectName={subject.name}
          grade={grade}
        />
      )}

      {/* Engine 2: HTML5 Canvas Real-Time Physics & Biology Simulation */}
      {activeTab === 'simulation' && (
        <PhysicsCanvasSimulator
          initialSimulation={simType}
          topicTitle={subject.name}
        />
      )}

      {/* Engine 3: Animated Multi-Stage Process Flow Diagram */}
      {activeTab === 'flow_diagram' && (
        <InteractiveAnimationStudio
          subject={subject}
          grade={grade}
          onOpenAITutor={onOpenAITutor}
          onExit={onExit}
        />
      )}
    </div>
  );
};
