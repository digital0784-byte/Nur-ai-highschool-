import React, { useState } from 'react';
import {
  Sparkles,
  Briefcase,
  Compass,
  Layers,
  Award,
  Globe,
  HelpCircle,
  X,
  ExternalLink,
  ChevronRight,
  Send,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import { TopicRealLifeConnection, StudentGoalProfile } from '../../types/careerLearning';
import { careerConnectionEngine } from '../../engine/careerConnectionEngine';
import { careerLearningService } from '../../services/careerLearningService';

interface RealLifeConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  subjectId: string;
  topicId: string;
  topicTitle: string;
  gradeLevel?: number;
  userGoalProfile?: StudentGoalProfile | null;
  language?: 'en' | 'am' | 'om' | 'ti';
}

export const RealLifeConnectionModal: React.FC<RealLifeConnectionModalProps> = ({
  isOpen,
  onClose,
  subjectId,
  topicId,
  topicTitle,
  gradeLevel = 9,
  userGoalProfile,
  language = 'en',
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'cross_subject' | 'project' | 'ask_ai'>('overview');
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiAnswer, setAiAnswer] = useState<{
    explanation: string;
    ethiopianExample: string;
    suggestedProject: string;
  } | null>(null);

  if (!isOpen) return null;

  const isAmharic = language === 'am';
  const connection: TopicRealLifeConnection = careerConnectionEngine.getTopicRealLifeConnection(
    subjectId,
    topicId,
    topicTitle,
    userGoalProfile
  );

  const purposeCard = careerConnectionEngine.getPersonalizedPurposeCard(
    subjectId,
    topicId,
    topicTitle,
    userGoalProfile || null
  );

  const handleAskAI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuestion.trim() && !aiAnswer) {
      setAiQuestion(`Why do I need to learn ${topicTitle} in real life in Ethiopia?`);
    }
    setAiLoading(true);
    try {
      const q = aiQuestion.trim() || `Why do I need to learn ${topicTitle} in real life in Ethiopia?`;
      const res = await careerLearningService.askAIPurposeExplanation(
        q,
        gradeLevel,
        subjectId,
        topicTitle,
        userGoalProfile,
        language
      );
      setAiAnswer(res);
    } catch (err) {
      console.error(err);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div
      id="real-life-connection-modal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200 overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Ethiopian Motif Accent */}
        <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-cyan-800 p-6 text-white">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 backdrop-blur-md">
                <Compass className="h-6 w-6 text-emerald-200" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="rounded-full bg-emerald-500/30 px-2.5 py-0.5 text-xs font-semibold text-emerald-100">
                    {isAmharic ? 'የእውነተኛ ህይወት ዝምድና' : 'Real-Life Purpose & Careers'}
                  </span>
                  <span className="text-xs text-emerald-200/80">Grade {gradeLevel}</span>
                </div>
                <h2 className="text-xl font-bold tracking-tight text-white mt-1">
                  {topicTitle}
                </h2>
              </div>
            </div>
            <button
              id="close-connection-modal-btn"
              onClick={onClose}
              className="rounded-full p-2 text-white/70 hover:bg-white/10 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="mt-6 flex space-x-2 border-b border-white/15 pb-2 text-sm font-medium">
            <button
              id="tab-conn-overview"
              onClick={() => setActiveTab('overview')}
              className={`rounded-lg px-3 py-1.5 transition-all ${
                activeTab === 'overview'
                  ? 'bg-white text-emerald-900 shadow-xs'
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              {isAmharic ? 'አጠቃላይ እይታ' : 'Why This Matters'}
            </button>
            <button
              id="tab-conn-cross"
              onClick={() => setActiveTab('cross_subject')}
              className={`rounded-lg px-3 py-1.5 transition-all ${
                activeTab === 'cross_subject'
                  ? 'bg-white text-emerald-900 shadow-xs'
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              {isAmharic ? 'የትምህርቶች ትስስር' : 'Subject Synergy'}
            </button>
            <button
              id="tab-conn-project"
              onClick={() => setActiveTab('project')}
              className={`rounded-lg px-3 py-1.5 transition-all ${
                activeTab === 'project'
                  ? 'bg-white text-emerald-900 shadow-xs'
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              {isAmharic ? 'ተግባራዊ ፕሮጀክት' : 'Real-World Project'}
            </button>
            <button
              id="tab-conn-ai"
              onClick={() => setActiveTab('ask_ai')}
              className={`flex items-center space-x-1.5 rounded-lg px-3 py-1.5 transition-all ${
                activeTab === 'ask_ai'
                  ? 'bg-emerald-400 text-slate-900 font-semibold shadow-xs'
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-300" />
              <span>{isAmharic ? 'AI አስተማሪን ጠይቅ' : 'Ask AI Purpose'}</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="max-h-[70vh] overflow-y-auto p-6 space-y-6">
          {/* PERSONALIZED PURPOSE BANNER (If user has set goal) */}
          {purposeCard && activeTab === 'overview' && (
            <div
              id="personalized-purpose-banner"
              className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-4.5 text-emerald-950 shadow-xs"
            >
              <div className="flex items-start space-x-3">
                <div className="rounded-lg bg-emerald-600 p-2 text-white shadow-xs">
                  <Briefcase className="h-5 w-5" />
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                      {isAmharic ? 'ለወደፊት ግብዎ ያለው ጠቀሜታ' : 'Targeted Career Pathway'}
                    </span>
                    <span className="rounded-full bg-emerald-200/70 px-2 py-0.5 text-[11px] font-semibold text-emerald-800">
                      {purposeCard.careerGoal}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-base">
                    {isAmharic ? purposeCard.headline.am : purposeCard.headline.en}
                  </h4>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {isAmharic ? purposeCard.explanation.am : purposeCard.explanation.en}
                  </p>
                  <div className="mt-2 flex items-center space-x-2 text-xs font-semibold text-emerald-800">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>{isAmharic ? purposeCard.actionableTip.am : purposeCard.actionableTip.en}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-5">
              {/* Question 1: What am I learning? */}
              <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-1.5">
                  <HelpCircle className="h-4 w-4 text-slate-400" />
                  <span>{isAmharic ? '1. ምን እየተማርኩ ነው?' : '1. What Are You Learning?'}</span>
                </h3>
                <p className="mt-1.5 text-sm text-slate-800 leading-relaxed font-medium">
                  {isAmharic ? connection.whatYouAreLearning.am : connection.whatYouAreLearning.en}
                </p>
              </div>

              {/* Question 2: Where is this used? */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  {isAmharic ? '2. በእውነተኛው ህይወት የት ጥቅም ላይ ይውላል?' : '2. Where Is This Knowledge Applied?'}
                </h3>
                <div className="mt-2.5 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {connection.whereItIsUsed.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-start space-x-2.5 rounded-lg border border-slate-200/80 bg-white p-3 text-sm text-slate-700 shadow-2xs"
                    >
                      <div className="mt-0.5 h-2 w-2 rounded-full bg-teal-500 shrink-0" />
                      <span>{isAmharic ? item.am : item.en}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Question 3: Ethiopian Context & Megaprojects */}
              <div className="rounded-xl border border-amber-200/80 bg-gradient-to-br from-amber-50/80 to-yellow-50/40 p-4">
                <div className="flex items-start space-x-3">
                  <Globe className="h-5 w-5 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-amber-900">
                      {isAmharic ? '3. በኢትዮጵያ ተጨባጭ አውድ ውስጥ ያለው ሚና' : '3. Ethiopian Context & National Development'}
                    </h3>
                    <p className="mt-1 text-sm text-slate-800 leading-relaxed">
                      {isAmharic ? connection.ethiopianContextExample.am : connection.ethiopianContextExample.en}
                    </p>
                  </div>
                </div>
              </div>

              {/* Question 4: Related Careers */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
                  <span>{isAmharic ? '4. ይህንን እውቀት የሚጠቀሙ ሙያዎች' : '4. Careers Utilizing This Knowledge'}</span>
                  <span className="text-[11px] font-normal text-slate-400">
                    {isAmharic ? 'ትምህርታዊ መመሪያ' : 'Educational Guidance'}
                  </span>
                </h3>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {connection.relatedCareers.map((cId) => {
                    const career = careerConnectionEngine.getCareerById(cId);
                    return (
                      <div
                        key={cId}
                        className="inline-flex items-center space-x-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 shadow-2xs hover:border-emerald-400 transition-colors"
                      >
                        <Briefcase className="h-3.5 w-3.5 text-emerald-600" />
                        <span>{career ? (isAmharic ? career.careerName.am : career.careerName.en) : cId}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Question 5: Key 21st-Century Skills */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  {isAmharic ? '5. የሚዳብሩ የ21ኛው ክፍለ ዘመን ክህሎቶች' : '5. 21st-Century Skills You Are Building'}
                </h3>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {connection.relatedSkills.map((sId) => {
                    const skill = careerConnectionEngine.getAllSkills().find((s) => s.skillId === sId);
                    return (
                      <span
                        key={sId}
                        className="inline-flex items-center space-x-1.5 rounded-md bg-indigo-50 border border-indigo-100 px-2.5 py-1 text-xs font-medium text-indigo-800"
                      >
                        <Award className="h-3.5 w-3.5 text-indigo-500" />
                        <span>{skill ? (isAmharic ? skill.name.am : skill.name.en) : sId}</span>
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CROSS-SUBJECT SYNERGY */}
          {activeTab === 'cross_subject' && (
            <div className="space-y-4">
              <p className="text-sm text-slate-600">
                {isAmharic
                  ? 'ትምህርቶች ተነጣጥለው አይቆሙም፤ በሳይንስና ምህንድስና ውስጥ ሂሳብ፣ ፊዚክስ፣ ኬሚስትሪና ባዮሎጂ ተቀናጅተው እውነተኛ ችግሮችን ይፈታሉ::'
                  : 'Subjects do not exist in silos. Real-world solutions emerge when multiple disciplines integrate seamlessly:'}
              </p>

              <div className="space-y-3.5">
                {connection.crossSubjectConnections.map((conn) => (
                  <div
                    key={conn.connectionId}
                    className="rounded-xl border border-slate-200 bg-white p-4.5 shadow-2xs hover:border-teal-300 transition-all"
                  >
                    <div className="flex items-center space-x-2 text-xs font-bold text-teal-700">
                      <Layers className="h-4 w-4 text-teal-600" />
                      <span>
                        {conn.primarySubject} + {conn.connectedSubject}
                      </span>
                      <ChevronRight className="h-3 w-3 text-slate-400" />
                      <span className="text-slate-900 font-semibold">
                        {isAmharic ? conn.combinedField.am : conn.combinedField.en}
                      </span>
                    </div>

                    <p className="mt-2 text-sm text-slate-700 leading-relaxed">
                      {isAmharic ? conn.synergyExplanation.am : conn.synergyExplanation.en}
                    </p>

                    <div className="mt-3 rounded-lg bg-slate-50 border border-slate-100 p-3 text-xs text-slate-600 space-y-1">
                      <div>
                        <strong className="text-slate-800">{isAmharic ? 'ምሳሌ፡ ' : 'Real Example: '}</strong>
                        {isAmharic ? conn.realWorldExample.am : conn.realWorldExample.en}
                      </div>
                      <div className="text-emerald-700 font-medium">
                        <strong>{isAmharic ? 'በኢትዮጵያ፡ ' : 'Ethiopian Context: '}</strong>
                        {isAmharic ? conn.ethiopianApplication.am : conn.ethiopianApplication.en}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: REAL-WORLD PROJECT */}
          {activeTab === 'project' && connection.projectIdea && (
            <div className="space-y-4">
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4.5">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-emerald-600 px-3 py-0.5 text-xs font-semibold text-white">
                    {connection.projectIdea.difficulty.toUpperCase()} LEVEL
                  </span>
                  <span className="text-xs font-medium text-emerald-800">
                    Grade {connection.projectIdea.gradeLevel} Project
                  </span>
                </div>
                <h3 className="mt-2 text-lg font-bold text-slate-900">
                  {isAmharic ? connection.projectIdea.title.am : connection.projectIdea.title.en}
                </h3>
                <p className="mt-1.5 text-sm text-slate-700 leading-relaxed">
                  {isAmharic ? connection.projectIdea.description.am : connection.projectIdea.description.en}
                </p>
              </div>

              {/* Materials Needed */}
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  {isAmharic ? 'የሚያስፈልጉ ቁሳቁሶች' : 'Accessible Materials Needed'}
                </h4>
                <ul className="mt-2 space-y-1.5 text-sm text-slate-700">
                  {connection.projectIdea.materialsNeeded.map((mat, i) => (
                    <li key={i} className="flex items-center space-x-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-600 shrink-0" />
                      <span>{isAmharic ? mat.am : mat.en}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Expected Outcome */}
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  {isAmharic ? 'የሚጠበቅ ውጤትና ግኝት' : 'Tangible Expected Outcome'}
                </h4>
                <p className="mt-1.5 text-sm text-slate-800 font-medium leading-relaxed">
                  {isAmharic ? connection.projectIdea.expectedOutcome.am : connection.projectIdea.expectedOutcome.en}
                </p>
              </div>

              {/* Ethiopian Context Focus */}
              <div className="rounded-xl border border-amber-100 bg-amber-50/50 p-3.5 text-xs text-amber-900 flex items-center space-x-2">
                <Globe className="h-4 w-4 text-amber-700 shrink-0" />
                <span>
                  {isAmharic
                    ? connection.projectIdea.ethiopianContextFocus.am
                    : connection.projectIdea.ethiopianContextFocus.en}
                </span>
              </div>
            </div>
          )}

          {/* TAB 4: ASK AI PURPOSE TUTOR */}
          {activeTab === 'ask_ai' && (
            <div className="space-y-4">
              <div className="rounded-xl border border-indigo-100 bg-indigo-50/40 p-4">
                <h3 className="text-sm font-bold text-indigo-950 flex items-center space-x-2">
                  <Sparkles className="h-4 w-4 text-indigo-600" />
                  <span>
                    {isAmharic
                      ? 'የዓላማና ሙያ ትስስር AI አስተማሪ'
                      : 'Ask the Purpose & Real-Life Learning AI Tutor'}
                  </span>
                </h3>
                <p className="mt-1 text-xs text-slate-600">
                  {isAmharic
                    ? '«ይህን ርዕስ ለምን እማራለሁ? በእውነተኛ ህይወት የት ጥቅም ላይ ይውላል?» ብለው በማንኛውም ጊዜ ይጠይቁ::'
                    : 'Ask anything about why this subject or topic is taught, how it connects to your goal, or where Ethiopian industries use it.'}
                </p>

                <form onSubmit={handleAskAI} className="mt-3 flex gap-2">
                  <input
                    type="text"
                    value={aiQuestion}
                    onChange={(e) => setAiQuestion(e.target.value)}
                    placeholder={
                      isAmharic
                        ? `ለምሳሌ፡ ${topicTitle}ን መማር በኢትዮጵያ የት ጥቅም ላይ ይውላል?`
                        : `e.g. Why do I need ${topicTitle}? Where is it used in Ethiopia?`
                    }
                    className="flex-1 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-100"
                  />
                  <button
                    type="submit"
                    disabled={aiLoading}
                    className="inline-flex items-center space-x-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-700 disabled:opacity-50"
                  >
                    {aiLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <span>{isAmharic ? 'ጠይቅ' : 'Ask'}</span>
                        <Send className="h-3.5 w-3.5" />
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* AI Answer Card */}
              {aiAnswer && (
                <div className="rounded-xl border border-slate-200 bg-white p-4.5 shadow-xs space-y-3 animate-in fade-in duration-200">
                  <div className="flex items-center space-x-2 text-xs font-bold text-indigo-700">
                    <Sparkles className="h-4 w-4 text-amber-500" />
                    <span>{isAmharic ? 'የ AI አስተማሪ ምላሽ' : 'Tutor Pedagogical Explanation'}</span>
                  </div>

                  <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-line">
                    {aiAnswer.explanation}
                  </p>

                  <div className="rounded-lg bg-amber-50/70 border border-amber-200 p-3 text-xs text-amber-950">
                    <strong className="font-semibold text-amber-900 block mb-0.5">
                      {isAmharic ? 'በኢትዮጵያ ውስጥ ተጨባጭ አተገባበር፡' : 'Ethiopian Real-World Application:'}
                    </strong>
                    {aiAnswer.ethiopianExample}
                  </div>

                  <div className="rounded-lg bg-emerald-50/70 border border-emerald-200 p-3 text-xs text-emerald-950">
                    <strong className="font-semibold text-emerald-900 block mb-0.5">
                      {isAmharic ? 'የሚመከር የፈጠራ ፕሮጀክት፡' : 'Suggested Hands-On Action:'}
                    </strong>
                    {aiAnswer.suggestedProject}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-100 bg-slate-50 px-6 py-3.5 flex items-center justify-between text-xs text-slate-500">
          <span>{isAmharic ? 'NUR AI የስራና የዓላማ ሞተር' : 'NUR AI Purpose-Driven Learning Engine'}</span>
          <button
            onClick={onClose}
            className="rounded-lg bg-slate-200/80 px-3 py-1.5 font-medium text-slate-700 hover:bg-slate-300 transition-colors"
          >
            {isAmharic ? 'ዝጋ' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
