import React, { useState, useEffect } from 'react';
import {
  Compass,
  Briefcase,
  Target,
  Award,
  BookOpen,
  Layers,
  Sparkles,
  TrendingUp,
  Globe,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ChevronRight,
  Filter,
  Plus,
  Save,
  Search,
  ExternalLink,
  GraduationCap,
  Hammer,
} from 'lucide-react';
import {
  CareerProfile,
  StudentGoalProfile,
  CareerAlignmentGuidance,
  SkillProfile,
  CrossSubjectConnection,
  RealWorldProjectIdea,
  CareerCategory,
} from '../../types/careerLearning';
import { careerLearningService } from '../../services/careerLearningService';
import { careerConnectionEngine } from '../../engine/careerConnectionEngine';

interface CareerExplorationViewProps {
  userId: string;
  studentGrade?: number;
  language?: 'en' | 'am' | 'om' | 'ti';
  progressMap?: Record<string, any>;
  onNavigateToTopic?: (subjectId: string, topicId: string) => void;
}

export const CareerExplorationView: React.FC<CareerExplorationViewProps> = ({
  userId,
  studentGrade = 9,
  language = 'en',
  progressMap = {},
  onNavigateToTopic,
}) => {
  const isAmharic = language === 'am';

  // State
  const [activeMainTab, setActiveMainTab] = useState<'pathways' | 'my_goals' | 'alignment' | 'skills' | 'synergy' | 'projects'>('pathways');
  const [careers, setCareers] = useState<CareerProfile[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCareer, setSelectedCareer] = useState<CareerProfile | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Goal Profile State
  const [goalProfile, setGoalProfile] = useState<StudentGoalProfile | null>(null);
  const [isEditingGoals, setIsEditingGoals] = useState(false);
  const [editCareerGoals, setEditCareerGoals] = useState<string[]>([]);
  const [editFields, setEditFields] = useState<string[]>([]);
  const [editProblems, setEditProblems] = useState<string>('');
  const [editEnjoyed, setEditEnjoyed] = useState<string[]>([]);
  const [editChallenging, setEditChallenging] = useState<string[]>([]);
  const [editTargetSkills, setEditTargetSkills] = useState<string[]>([]);
  const [editUniversity, setEditUniversity] = useState<string>('');
  const [isSavingGoals, setIsSavingGoals] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(false);

  // Alignment Guidance State
  const [alignmentGuidance, setAlignmentGuidance] = useState<CareerAlignmentGuidance | null>(null);

  // Projects and Cross connections
  const [projects, setProjects] = useState<RealWorldProjectIdea[]>([]);
  const [crossConnections, setCrossConnections] = useState<CrossSubjectConnection[]>([]);
  const [skills, setSkills] = useState<SkillProfile[]>([]);

  // Load Data
  useEffect(() => {
    const loadData = async () => {
      const allCareers = await careerLearningService.getAllCareers();
      setCareers(allCareers);
      if (allCareers.length > 0 && !selectedCareer) {
        setSelectedCareer(allCareers[0]);
      }

      const profile = await careerLearningService.getStudentGoalProfile(userId);
      setGoalProfile(profile);

      if (profile) {
        setEditCareerGoals(profile.primaryCareerGoals || []);
        setEditFields(profile.interestedFields || []);
        setEditProblems((profile.problemsToSolve || []).join('\n'));
        setEditEnjoyed(profile.enjoyedSubjects || []);
        setEditChallenging(profile.challengingSubjects || []);
        setEditTargetSkills(profile.targetSkills || []);
        setEditUniversity(profile.dreamUniversityOrField || '');

        const primaryCareerId = profile.primaryCareerGoals?.[0] || allCareers[0]?.careerId;
        if (primaryCareerId) {
          const guidance = await careerLearningService.getCareerAlignmentGuidance(
            primaryCareerId,
            profile,
            progressMap
          );
          setAlignmentGuidance(guidance);
        }
      }

      setProjects(careerLearningService.getProjects());
      setCrossConnections(careerLearningService.getCrossSubjectConnections());
      setSkills(careerLearningService.getSkills());
    };

    loadData();
  }, [userId]);

  // Handle Goal Profile Save
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingGoals(true);

    const updatedProfile: StudentGoalProfile = {
      userId,
      primaryCareerGoals: editCareerGoals,
      interestedFields: editFields,
      problemsToSolve: editProblems.split('\n').filter((p) => p.trim().length > 0),
      enjoyedSubjects: editEnjoyed,
      challengingSubjects: editChallenging,
      targetSkills: editTargetSkills,
      dreamUniversityOrField: editUniversity,
      createdAt: goalProfile?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const saved = await careerLearningService.saveStudentGoalProfile(updatedProfile);
    setGoalProfile(saved);
    setIsSavingGoals(false);
    setIsEditingGoals(false);
    setSaveSuccessMsg(true);
    setTimeout(() => setSaveSuccessMsg(false), 3000);

    // Refresh alignment
    if (saved.primaryCareerGoals?.[0]) {
      const guidance = await careerLearningService.getCareerAlignmentGuidance(
        saved.primaryCareerGoals[0],
        saved,
        progressMap
      );
      setAlignmentGuidance(guidance);
    }
  };

  // Filter Careers
  const filteredCareers = careers.filter((c) => {
    const matchesCategory = selectedCategory === 'all' || c.category === selectedCategory;
    const nameStr = (c.careerName.en + ' ' + c.careerName.am).toLowerCase();
    const matchesSearch = nameStr.includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories: { id: string; label: { en: string; am: string } }[] = [
    { id: 'all', label: { en: 'All Careers', am: 'ሁሉም ሙያዎች' } },
    { id: 'health', label: { en: 'Health & Medicine', am: 'ጤናና ህክምና' } },
    { id: 'technology', label: { en: 'Technology & AI', am: 'ቴክኖሎጂና AI' } },
    { id: 'engineering', label: { en: 'Engineering & Construction', am: 'ምህንድስናና ግንባታ' } },
    { id: 'agriculture_environment', label: { en: 'Agriculture & Environment', am: 'ግብርናና አካባቢ ጥበቃ' } },
    { id: 'business_economics', label: { en: 'Business & Economics', am: 'ቢዝነስና ኢኮኖሚክስ' } },
    { id: 'aviation_transport', label: { en: 'Aviation & Logistics', am: 'አቪዬሽንና ትራንስፖርት' } },
  ];

  return (
    <div id="career-exploration-view" className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Top Banner: Purpose & Real-Life Connection Engine */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-800 via-teal-800 to-cyan-900 p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center space-x-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-md text-emerald-200">
            <Compass className="h-4 w-4 text-emerald-300" />
            <span>{isAmharic ? 'ክፍል 14፡ የዓላማና ሙያ ትስስር ሞተር' : 'Part 14: Career & Purpose-Driven Learning Engine'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {isAmharic
              ? 'የትምህርትዎ እውነተኛ ዓላማና የወደፊት ጉዞዎ'
              : 'Discover Your Purpose: Connect Learning to Real Life & Careers'}
          </h1>
          <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed">
            {isAmharic
              ? 'ለምን እንደምትማሩ፣ እውቀቱ በኢትዮጵያ ውስጥ የት ጥቅም ላይ እንደሚውል፣ እና የሁለተኛ ደረጃ ትምህርትዎ ወደፊት ለሚመኙት ሙያ እንዴት ጠንካራ መሰረት እንደሚጥል ይወቁ::'
              : 'Understand why you are learning each subject, where knowledge powers Ethiopian megaprojects, and how your high school curriculum prepares you for impactful 21st-century careers.'}
          </p>

          {/* Quick Active Goal Badge */}
          {goalProfile && goalProfile.primaryCareerGoals?.length > 0 && (
            <div className="pt-2 flex flex-wrap items-center gap-2">
              <span className="text-xs text-emerald-200 font-medium">
                {isAmharic ? 'የእርስዎ የወደፊት ግብ፡' : 'Your Selected Goal:'}
              </span>
              {goalProfile.primaryCareerGoals.map((cId) => {
                const c = careerConnectionEngine.getCareerById(cId);
                return (
                  <span
                    key={cId}
                    className="inline-flex items-center space-x-1.5 rounded-full bg-emerald-500/30 border border-emerald-400/40 px-3 py-1 text-xs font-bold text-white shadow-xs"
                  >
                    <Briefcase className="h-3.5 w-3.5 text-emerald-200" />
                    <span>{c ? (isAmharic ? c.careerName.am : c.careerName.en) : cId}</span>
                  </span>
                );
              })}
              {goalProfile.dreamUniversityOrField && (
                <span className="inline-flex items-center space-x-1.5 rounded-full bg-cyan-500/20 border border-cyan-400/30 px-3 py-1 text-xs font-medium text-cyan-200">
                  <GraduationCap className="h-3.5 w-3.5" />
                  <span>{goalProfile.dreamUniversityOrField}</span>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Decorative Compass watermark */}
        <Compass className="absolute -right-8 -bottom-8 h-64 w-64 text-white/5 pointer-events-none" />
      </div>

      {/* Main Navigation Tabs */}
      <div className="flex border-b border-slate-200 overflow-x-auto gap-2 pb-2 text-sm font-semibold">
        <button
          id="tab-btn-pathways"
          onClick={() => setActiveMainTab('pathways')}
          className={`flex items-center space-x-2 rounded-xl px-4 py-2.5 transition-all shrink-0 ${
            activeMainTab === 'pathways'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Briefcase className="h-4 w-4" />
          <span>{isAmharic ? 'የሙያ መስኮች (Pathways)' : 'Career Pathways'}</span>
        </button>

        <button
          id="tab-btn-my-goals"
          onClick={() => setActiveMainTab('my_goals')}
          className={`flex items-center space-x-2 rounded-xl px-4 py-2.5 transition-all shrink-0 ${
            activeMainTab === 'my_goals'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Target className="h-4 w-4" />
          <span>{isAmharic ? 'የወደፊት ግቤ (My Goal Profile)' : 'My Future Goal Profile'}</span>
        </button>

        <button
          id="tab-btn-alignment"
          onClick={() => setActiveMainTab('alignment')}
          className={`flex items-center space-x-2 rounded-xl px-4 py-2.5 transition-all shrink-0 ${
            activeMainTab === 'alignment'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <TrendingUp className="h-4 w-4" />
          <span>{isAmharic ? 'የትምህርት ዝግጁነት (Alignment)' : 'Career Readiness Guidance'}</span>
        </button>

        <button
          id="tab-btn-skills"
          onClick={() => setActiveMainTab('skills')}
          className={`flex items-center space-x-2 rounded-xl px-4 py-2.5 transition-all shrink-0 ${
            activeMainTab === 'skills'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Award className="h-4 w-4" />
          <span>{isAmharic ? '21ኛው ክፍለ ዘመን ክህሎቶች' : '21st-Century Skills'}</span>
        </button>

        <button
          id="tab-btn-synergy"
          onClick={() => setActiveMainTab('synergy')}
          className={`flex items-center space-x-2 rounded-xl px-4 py-2.5 transition-all shrink-0 ${
            activeMainTab === 'synergy'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Layers className="h-4 w-4" />
          <span>{isAmharic ? 'የትምህርቶች ትስስር' : 'Subject Synergy'}</span>
        </button>

        <button
          id="tab-btn-projects"
          onClick={() => setActiveMainTab('projects')}
          className={`flex items-center space-x-2 rounded-xl px-4 py-2.5 transition-all shrink-0 ${
            activeMainTab === 'projects'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Hammer className="h-4 w-4" />
          <span>{isAmharic ? 'ተግባራዊ ፕሮጀክቶች' : 'Real-World Projects'}</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: CAREER PATHWAYS EXPLORER                                           */}
      {/* ========================================================================= */}
      {activeMainTab === 'pathways' && (
        <div className="space-y-6">
          {/* Category Pills & Search */}
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {isAmharic ? cat.label.am : cat.label.en}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isAmharic ? 'ሙያ ይፈልጉ...' : 'Search careers...'}
                className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-1.5 text-xs text-slate-900 focus:border-emerald-600 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Master Detail Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: Careers List */}
            <div className="lg:col-span-5 space-y-3">
              {filteredCareers.map((c) => {
                const isSelected = selectedCareer?.careerId === c.careerId;
                const isUserGoal = goalProfile?.primaryCareerGoals?.includes(c.careerId);

                return (
                  <div
                    key={c.careerId}
                    id={`career-card-${c.careerId}`}
                    onClick={() => setSelectedCareer(c)}
                    className={`cursor-pointer rounded-2xl border p-4.5 transition-all ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/40 shadow-sm ring-1 ring-emerald-600'
                        : 'border-slate-200 bg-white hover:border-emerald-300 hover:bg-slate-50/70 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-xl font-bold ${
                            isSelected ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          <Briefcase className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="font-bold text-slate-900 text-base">
                              {isAmharic ? c.careerName.am : c.careerName.en}
                            </h3>
                            {isUserGoal && (
                              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                                {isAmharic ? 'የእርስዎ ግብ' : 'Your Goal'}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                            {isAmharic ? c.shortDescription.am : c.shortDescription.en}
                          </p>
                        </div>
                      </div>
                      <ChevronRight
                        className={`h-5 w-5 ${isSelected ? 'text-emerald-700' : 'text-slate-300'}`}
                      />
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100">
                      {c.isHighGrowthInEthiopia && (
                        <span className="inline-flex items-center rounded-md bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-800 border border-amber-200">
                          {isAmharic ? 'በኢትዮጵያ ከፍተኛ ፍላጎት' : 'High Growth in Ethiopia'}
                        </span>
                      )}
                      <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">
                        {c.relatedSubjects.length} {isAmharic ? 'የትምህርት አይነቶች' : 'Curriculum Subjects'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right: Career Deep-Dive Panel */}
            <div className="lg:col-span-7">
              {selectedCareer ? (
                <div
                  id="career-detail-panel"
                  className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-6"
                >
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-5">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="rounded-full bg-emerald-100 px-3 py-0.5 text-xs font-semibold text-emerald-800">
                          {selectedCareer.category.toUpperCase().replace('_', ' & ')}
                        </span>
                        {selectedCareer.isHighGrowthInEthiopia && (
                          <span className="rounded-full bg-amber-100 px-3 py-0.5 text-xs font-semibold text-amber-900">
                            {isAmharic ? 'በኢትዮጵያ ተፈላጊ' : 'Strategic National Need'}
                          </span>
                        )}
                      </div>
                      <h2 className="text-2xl font-black text-slate-900 mt-1.5">
                        {isAmharic ? selectedCareer.careerName.am : selectedCareer.careerName.en}
                      </h2>
                    </div>

                    {/* Set as Goal Button */}
                    <button
                      id="set-career-goal-btn"
                      onClick={() => {
                        if (!editCareerGoals.includes(selectedCareer.careerId)) {
                          setEditCareerGoals([selectedCareer.careerId, ...editCareerGoals]);
                        }
                        setActiveMainTab('my_goals');
                        setIsEditingGoals(true);
                      }}
                      className="inline-flex items-center space-x-2 rounded-xl bg-emerald-700 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-800 transition-colors shrink-0"
                    >
                      <Target className="h-4 w-4" />
                      <span>{isAmharic ? 'ይህን ግቤ አድርግ' : 'Set as My Future Goal'}</span>
                    </button>
                  </div>

                  {/* Overview */}
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      {isAmharic ? 'የሙያው አጠቃላይ ገለጻ' : 'Career Overview & Impact'}
                    </h3>
                    <p className="mt-1.5 text-sm text-slate-700 leading-relaxed">
                      {isAmharic ? selectedCareer.detailedOverview.am : selectedCareer.detailedOverview.en}
                    </p>
                  </div>

                  {/* Ethiopian Opportunities & Megaprojects */}
                  <div className="rounded-2xl border border-amber-200/80 bg-gradient-to-br from-amber-50/90 to-yellow-50/40 p-4.5">
                    <div className="flex items-start space-x-3">
                      <Globe className="h-5 w-5 text-amber-800 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-amber-950">
                          {isAmharic ? 'በኢትዮጵያ ውስጥ ያሉ የስራና የተሳትፎ እድሎች' : 'Opportunities & Megaprojects in Ethiopia'}
                        </h4>
                        <p className="mt-1 text-sm text-slate-800 leading-relaxed">
                          {isAmharic
                            ? selectedCareer.ethiopianOpportunities.am
                            : selectedCareer.ethiopianOpportunities.en}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* High School Curriculum Connection */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
                      <span>{isAmharic ? 'የሁለተኛ ደረጃ ትምህርቶች ግንኙነት' : 'High School Subjects Connection'}</span>
                      <span className="text-[11px] font-normal text-slate-400">
                        {isAmharic ? 'ለምን ያስፈልጋል?' : 'Why each is vital'}
                      </span>
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {selectedCareer.relatedSubjects.map((sub) => (
                        <div
                          key={sub.subjectId}
                          className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 space-y-1.5"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-900 text-sm">
                              {isAmharic ? sub.subjectName.am : sub.subjectName.en}
                            </span>
                            <span
                              className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                                sub.importance === 'core'
                                  ? 'bg-rose-100 text-rose-800'
                                  : 'bg-blue-100 text-blue-800'
                              }`}
                            >
                              {sub.importance.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            {isAmharic ? sub.rationale.am : sub.rationale.en}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Key Curriculum Topics to Master */}
                  {selectedCareer.importantTopics.length > 0 && (
                    <div className="space-y-2.5">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        {isAmharic ? 'ትኩረት ሊሰጣቸው የሚገቡ ቁልፍ ርዕሶች' : 'Key High School Topics to Master'}
                      </h3>
                      <div className="space-y-2">
                        {selectedCareer.importantTopics.map((top) => (
                          <div
                            key={top.topicId}
                            className="rounded-xl border border-slate-200 p-3.5 bg-white space-y-1"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-emerald-800 text-sm">
                                {isAmharic ? top.topicTitle.am : top.topicTitle.en}
                              </span>
                              {onNavigateToTopic && (
                                <button
                                  onClick={() => onNavigateToTopic(top.subjectId, top.topicId)}
                                  className="inline-flex items-center space-x-1 text-xs font-semibold text-emerald-600 hover:text-emerald-800"
                                >
                                  <span>{isAmharic ? 'ክፈት' : 'Study'}</span>
                                  <ChevronRight className="h-3.5 w-3.5" />
                                </button>
                              )}
                            </div>
                            <p className="text-xs text-slate-700">
                              <strong>{isAmharic ? 'ጠቀሜታው፡ ' : 'Why it matters: '}</strong>
                              {isAmharic ? top.whyItMatters.am : top.whyItMatters.en}
                            </p>
                            <p className="text-xs text-slate-500 italic">
                              <strong>{isAmharic ? 'ተግባራዊ ምሳሌ፡ ' : 'Application: '}</strong>
                              {isAmharic ? top.applicationExample.am : top.applicationExample.en}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Ethiopian Universities & Higher Education Fields */}
                  {selectedCareer.educationFields.length > 0 && (
                    <div className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-4.5 space-y-2">
                      <div className="flex items-center space-x-2 text-indigo-950">
                        <GraduationCap className="h-5 w-5 text-indigo-700" />
                        <h3 className="font-bold text-sm">
                          {isAmharic ? 'የከፍተኛ ትምህርት መስኮችና ዩኒቨርሲቲዎች' : 'University Programs in Ethiopia'}
                        </h3>
                      </div>
                      {selectedCareer.educationFields.map((edu, idx) => (
                        <div key={idx} className="text-xs text-slate-700 space-y-1">
                          <div className="font-semibold text-slate-900">
                            {isAmharic ? edu.degreeName.am : edu.degreeName.en} ({edu.durationYears}{' '}
                            {isAmharic ? 'ዓመታት' : 'Years'})
                          </div>
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {edu.ethiopianUniversities.map((uni, uIdx) => (
                              <span
                                key={uIdx}
                                className="rounded-md bg-white border border-indigo-200/70 px-2 py-1 text-[11px] text-slate-700 font-medium"
                              >
                                {uni}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Required Skills */}
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      {isAmharic ? 'ተፈላጊ ክህሎቶች' : 'Essential 21st-Century Skills'}
                    </h3>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {selectedCareer.requiredSkills.map((sId) => {
                        const skill = careerConnectionEngine.getAllSkills().find((s) => s.skillId === sId);
                        return (
                          <span
                            key={sId}
                            className="inline-flex items-center space-x-1.5 rounded-lg bg-slate-100 px-3 py-1 text-xs font-medium text-slate-800"
                          >
                            <Award className="h-3.5 w-3.5 text-emerald-600" />
                            <span>{skill ? (isAmharic ? skill.name.am : skill.name.en) : sId}</span>
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-400">
                  <Compass className="h-12 w-12 mx-auto text-slate-300 mb-2" />
                  <p>{isAmharic ? 'ዝርዝሩን ለማየት ሙያ ይምረጡ::' : 'Select a career from the list to explore.'}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: MY FUTURE GOAL PROFILE (ONBOARDING & EDITING)                     */}
      {/* ========================================================================= */}
      {activeMainTab === 'my_goals' && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-5">
            <div>
              <div className="inline-flex items-center space-x-1.5 rounded-full bg-emerald-100 px-3 py-0.5 text-xs font-bold text-emerald-800">
                <Target className="h-3.5 w-3.5" />
                <span>{isAmharic ? 'የተማሪው የወደፊት እቅድ መገለጫ' : 'Student Future Goal Profile'}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                {isAmharic ? 'የግል ዓላማዎንና ፍላጎቶችዎን ይቅረጹ' : 'Shape Your Personal Goals & Passion'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                {isAmharic
                  ? 'ይህ መረጃ NUR AI እያንዳንዱን ትምህርት ለግል ግብዎ በሚጠቅም መልኩ እንዲያቀርብልዎ ያግዛል::'
                  : 'NUR AI uses your goal profile to explain why each topic matters specifically to your future pathway.'}
              </p>
            </div>

            <button
              id="toggle-edit-goals-btn"
              onClick={() => setIsEditingGoals(!isEditingGoals)}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition-all shrink-0 ${
                isEditingGoals
                  ? 'bg-slate-200 text-slate-800'
                  : 'bg-emerald-700 text-white hover:bg-emerald-800'
              }`}
            >
              {isEditingGoals
                ? isAmharic
                  ? 'ለውጦችን ሰርዝ'
                  : 'Cancel Editing'
                : isAmharic
                ? 'ግቦችን አሻሽል'
                : 'Edit Goal Profile'}
            </button>
          </div>

          {saveSuccessMsg && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-semibold text-emerald-900 flex items-center space-x-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>
                {isAmharic
                  ? 'የወደፊት ግቦችዎ በተሳካ ሁኔታ ተቀምጠዋል!'
                  : 'Your Future Goal Profile has been saved successfully! Your AI Tutor has updated its learning context.'}
              </span>
            </div>
          )}

          {isEditingGoals ? (
            /* EDITING FORM */
            <form onSubmit={handleSaveProfile} className="space-y-6">
              {/* Question 1: What career do you want in the future? */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-900 block">
                  {isAmharic ? '1. ወደፊት ምን ሙያ መስራት ይፈልጋሉ?' : '1. What careers do you want to pursue in the future?'}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                  {careers.map((c) => {
                    const isChecked = editCareerGoals.includes(c.careerId);
                    return (
                      <button
                        type="button"
                        key={c.careerId}
                        onClick={() => {
                          if (isChecked) {
                            setEditCareerGoals(editCareerGoals.filter((id) => id !== c.careerId));
                          } else {
                            setEditCareerGoals([...editCareerGoals, c.careerId]);
                          }
                        }}
                        className={`rounded-xl border p-3 text-left transition-all text-xs font-semibold ${
                          isChecked
                            ? 'border-emerald-600 bg-emerald-50 text-emerald-950 ring-1 ring-emerald-600'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{isAmharic ? c.careerName.am : c.careerName.en}</span>
                          {isChecked && <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Question 2: What problems do you want to solve? */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-900 block">
                  {isAmharic
                    ? '2. በሀገርዎ ወይም በማህበረሰብዎ ውስጥ ምን ችግሮችን መፍታት ይፈልጋሉ?'
                    : '2. What problems do you want to solve in your community or in Ethiopia?'}
                </label>
                <textarea
                  rows={3}
                  value={editProblems}
                  onChange={(e) => setEditProblems(e.target.value)}
                  placeholder={
                    isAmharic
                      ? 'ለምሳሌ፡ የገጠር ጤና ጣቢያዎችን የኤሌክትሪክ ችግር መፍታት፣ ድርቅን የሚቋቋም ምርጥ ዘር ማፍራት፣ ወዘተ:: (በእያንዳንዱ መስመር አንድ)'
                      : 'e.g. Solar electrification for rural health clinics, breeding drought-resistant Teff, digital banking security... (one per line)'
                  }
                  className="w-full rounded-xl border border-slate-300 p-3 text-sm text-slate-900 focus:border-emerald-600 focus:outline-hidden"
                />
              </div>

              {/* Question 3: What subjects do you enjoy? */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-900 block">
                  {isAmharic ? '3. የሚወዷቸው የትምህርት አይነቶች የትኞቹ ናቸው?' : '3. What subjects do you enjoy most?'}
                </label>
                <div className="flex flex-wrap gap-2">
                  {['math', 'physics', 'chemistry', 'biology', 'economics', 'it', 'english'].map((sub) => {
                    const isChecked = editEnjoyed.includes(sub);
                    return (
                      <button
                        type="button"
                        key={sub}
                        onClick={() => {
                          if (isChecked) setEditEnjoyed(editEnjoyed.filter((s) => s !== sub));
                          else setEditEnjoyed([...editEnjoyed, sub]);
                        }}
                        className={`rounded-full px-4 py-1.5 text-xs font-semibold uppercase transition-all ${
                          isChecked
                            ? 'bg-teal-700 text-white'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {sub}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Question 4: What subjects are challenging? */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-900 block">
                  {isAmharic
                    ? '4. ተጨማሪ እገዛ የሚያስፈልግዎት የትኞቹ ትምህርቶች ናቸው?'
                    : '4. Which subjects are challenging or need extra support?'}
                </label>
                <div className="flex flex-wrap gap-2">
                  {['math', 'physics', 'chemistry', 'biology', 'economics', 'it', 'english'].map((sub) => {
                    const isChecked = editChallenging.includes(sub);
                    return (
                      <button
                        type="button"
                        key={sub}
                        onClick={() => {
                          if (isChecked) setEditChallenging(editChallenging.filter((s) => s !== sub));
                          else setEditChallenging([...editChallenging, sub]);
                        }}
                        className={`rounded-full px-4 py-1.5 text-xs font-semibold uppercase transition-all ${
                          isChecked
                            ? 'bg-rose-700 text-white'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {sub}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Question 5: Dream University */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-900 block">
                  {isAmharic
                    ? '5. መማር የሚመኙት ዩኒቨርሲቲ ወይም የትምህርት ተቋም'
                    : '5. Dream University or Higher Education Institution'}
                </label>
                <input
                  type="text"
                  value={editUniversity}
                  onChange={(e) => setEditUniversity(e.target.value)}
                  placeholder={
                    isAmharic
                      ? 'ለምሳሌ፡ አዲስ አበባ ዩኒቨርሲቲ (AAiT / ጥቁር አንበሳ)፣ ሐሮማያ፣ ጅማ...'
                      : 'e.g. Addis Ababa University (AAiT / Tikur Anbessa), AASTU, Haramaya, Jimma...'
                  }
                  className="w-full rounded-xl border border-slate-300 p-3 text-sm text-slate-900 focus:border-emerald-600 focus:outline-hidden"
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-4 border-t border-slate-100">
                <button
                  type="submit"
                  disabled={isSavingGoals}
                  className="inline-flex items-center space-x-2 rounded-xl bg-emerald-700 px-6 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-emerald-800 disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  <span>{isSavingGoals ? (isAmharic ? 'በማስቀመጥ ላይ...' : 'Saving...') : isAmharic ? 'መገለጫዬን አስቀምጥ' : 'Save Goal Profile'}</span>
                </button>
              </div>
            </form>
          ) : (
            /* READ ONLY VIEW */
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Careers Card */}
                <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-2">
                    <Briefcase className="h-4 w-4 text-emerald-600" />
                    <span>{isAmharic ? 'የመረጧቸው የወደፊት ሙያዎች' : 'Selected Career Aspirations'}</span>
                  </h3>
                  {goalProfile?.primaryCareerGoals && goalProfile.primaryCareerGoals.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {goalProfile.primaryCareerGoals.map((cId) => {
                        const c = careerConnectionEngine.getCareerById(cId);
                        return (
                          <div
                            key={cId}
                            className="rounded-xl border border-emerald-200 bg-white px-3.5 py-2 text-xs font-bold text-emerald-950 shadow-2xs"
                          >
                            {c ? (isAmharic ? c.careerName.am : c.careerName.en) : cId}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic">
                      {isAmharic ? 'ገና ሙያ አልተመረጠም::' : 'No careers chosen yet.'}
                    </p>
                  )}
                </div>

                {/* Problems to Solve */}
                <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-2">
                    <Globe className="h-4 w-4 text-cyan-600" />
                    <span>{isAmharic ? 'መፍታት የሚፈልጓቸው ችግሮች' : 'Problems You Want to Solve'}</span>
                  </h3>
                  {goalProfile?.problemsToSolve && goalProfile.problemsToSolve.length > 0 ? (
                    <ul className="space-y-2 text-xs text-slate-700">
                      {goalProfile.problemsToSolve.map((prob, idx) => (
                        <li key={idx} className="flex items-start space-x-2">
                          <CheckCircle2 className="h-4 w-4 text-teal-600 shrink-0 mt-0.5" />
                          <span>{prob}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-slate-400 italic">
                      {isAmharic ? 'ገና አልተገለጸም::' : 'No specific problems recorded.'}
                    </p>
                  )}
                </div>
              </div>

              {/* Subject Preferences Card */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="rounded-2xl border border-teal-100 bg-teal-50/40 p-5 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-teal-800">
                    {isAmharic ? 'የሚወዷቸው ትምህርቶች' : 'Enjoyed Subjects'}
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {goalProfile?.enjoyedSubjects?.map((sub) => (
                      <span
                        key={sub}
                        className="rounded-md bg-white border border-teal-200 px-2.5 py-1 text-xs font-semibold text-teal-900 uppercase"
                      >
                        {sub}
                      </span>
                    )) || <span className="text-xs text-slate-400">None</span>}
                  </div>
                </div>

                <div className="rounded-2xl border border-rose-100 bg-rose-50/40 p-5 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-rose-800">
                    {isAmharic ? 'ድጋፍ የሚሹባቸው ትምህርቶች' : 'Challenging Subjects (Adaptive Focus)'}
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {goalProfile?.challengingSubjects?.map((sub) => (
                      <span
                        key={sub}
                        className="rounded-md bg-white border border-rose-200 px-2.5 py-1 text-xs font-semibold text-rose-900 uppercase"
                      >
                        {sub}
                      </span>
                    )) || <span className="text-xs text-slate-400">None</span>}
                  </div>
                </div>
              </div>

              {/* Dream University */}
              <div className="rounded-2xl border border-indigo-100 bg-indigo-50/30 p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <GraduationCap className="h-6 w-6 text-indigo-700" />
                  <div>
                    <span className="text-xs font-bold uppercase text-indigo-900">
                      {isAmharic ? 'የሚመኙት የከፍተኛ ትምህርት ተቋም' : 'Target University Goal'}
                    </span>
                    <p className="text-sm font-bold text-slate-900">
                      {goalProfile?.dreamUniversityOrField || 'Addis Ababa University'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: CAREER ALIGNMENT READINESS GUIDANCE                                */}
      {/* ========================================================================= */}
      {activeMainTab === 'alignment' && (
        <div className="space-y-6">
          {alignmentGuidance ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="rounded-full bg-emerald-100 px-3 py-0.5 text-xs font-bold text-emerald-800">
                      {isAmharic ? 'የትምህርት ዝግጁነት መመሪያ' : 'Curriculum Readiness Guidance'}
                    </span>
                    <span className="text-xs text-slate-400">Non-Deterministic Educational Evaluation</span>
                  </div>
                  <h2 className="text-2xl font-black text-slate-900 mt-1">
                    {isAmharic
                      ? `የዝግጁነት ዳሰሳ፡ ${alignmentGuidance.careerName.am}`
                      : `Readiness Overview: ${alignmentGuidance.careerName.en}`}
                  </h2>
                  <p className="text-sm text-slate-600 mt-1">
                    {isAmharic
                      ? alignmentGuidance.summaryGuidance.am
                      : alignmentGuidance.summaryGuidance.en}
                  </p>
                </div>

                {/* Score badge */}
                <div className="flex items-center space-x-3 rounded-2xl bg-slate-50 border border-slate-200 p-4 shrink-0">
                  <div className="text-center">
                    <div className="text-3xl font-black text-emerald-700">
                      {alignmentGuidance.alignmentScore}%
                    </div>
                    <div className="text-[11px] font-bold uppercase text-slate-500">
                      {alignmentGuidance.alignmentLevel} Alignment
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 space-y-1">
                  <span className="text-xs text-slate-500 font-medium">Subject Interest Match</span>
                  <div className="text-lg font-bold text-slate-900">
                    {alignmentGuidance.basisDetails.subjectAffinity} / 40 pts
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-slate-200 overflow-hidden">
                    <div
                      className="h-full bg-teal-600 rounded-full"
                      style={{ width: `${(alignmentGuidance.basisDetails.subjectAffinity / 40) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 space-y-1">
                  <span className="text-xs text-slate-500 font-medium">Curriculum Topic Mastery</span>
                  <div className="text-lg font-bold text-slate-900">
                    {alignmentGuidance.basisDetails.masteryPercentage} / 40 pts
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-slate-200 overflow-hidden">
                    <div
                      className="h-full bg-emerald-600 rounded-full"
                      style={{ width: `${(alignmentGuidance.basisDetails.masteryPercentage / 40) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 space-y-1">
                  <span className="text-xs text-slate-500 font-medium">21st-Century Skill Focus</span>
                  <div className="text-lg font-bold text-slate-900">
                    {alignmentGuidance.basisDetails.skillCoverage} / 20 pts
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-slate-200 overflow-hidden">
                    <div
                      className="h-full bg-cyan-600 rounded-full"
                      style={{ width: `${(alignmentGuidance.basisDetails.skillCoverage / 20) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Recommended Focus Areas */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  {isAmharic ? 'የሚመከሩ የትኩረት መስኮች' : 'Recommended Foundational Focus Areas'}
                </h3>
                <div className="space-y-2">
                  {alignmentGuidance.recommendedFocusAreas.map((rec, i) => (
                    <div
                      key={i}
                      className="flex items-start justify-between rounded-xl border border-slate-200 p-3.5 bg-white"
                    >
                      <div className="space-y-0.5">
                        <span className="font-bold text-slate-900 text-sm">{rec.topicId}</span>
                        <p className="text-xs text-slate-600">
                          {isAmharic ? rec.reason.am : rec.reason.en}
                        </p>
                      </div>
                      {onNavigateToTopic && (
                        <button
                          onClick={() => onNavigateToTopic(rec.subjectId, rec.topicId)}
                          className="rounded-lg bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 shrink-0 ml-3"
                        >
                          {isAmharic ? 'ተለማመድ' : 'Practice'}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Mandatory Non-Deterministic Disclaimer */}
              <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4 text-xs text-amber-950 flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold">
                    {isAmharic ? 'ትምህርታዊ ማሳሰቢያ' : 'Educational Guidance Disclaimer'}
                  </strong>
                  <p className="mt-0.5 leading-relaxed">
                    {isAmharic ? alignmentGuidance.disclaimer.am : alignmentGuidance.disclaimer.en}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-400">
              <p>
                {isAmharic
                  ? 'የዝግጁነት መመሪያን ለማየት በመጀመሪያ በ«የወደፊት ግቤ» ገጽ ላይ የሙያ ምርጫዎን ያጠናቅቁ::'
                  : 'Please configure your career goals in the "My Future Goal Profile" tab to view readiness guidance.'}
              </p>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: 21ST-CENTURY SKILLS TRACKER                                        */}
      {/* ========================================================================= */}
      {activeMainTab === 'skills' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-2">
            <h2 className="text-xl font-bold text-slate-900">
              {isAmharic ? 'የ21ኛው ክፍለ ዘመን ክህሎቶች ማዕከል' : '21st-Century Skill Development Engine'}
            </h2>
            <p className="text-sm text-slate-600">
              {isAmharic
                ? 'በኢትዮጵያ ስርአተ-ትምህርት ውስጥ እያንዳንዱ ርዕስ እውቀትን ብቻ ሳይሆን ለወደፊት ስራዎ የሚያስፈልጉ ወሳኝ የአስተሳሰብና የችግር ፈቺነት ክህሎቶችን ያዳብራል::'
                : 'Beyond rote memorization, the Ethiopian high school curriculum builds essential competencies required by modern universities, industries, and international organizations.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {skills.map((skill) => (
              <div
                key={skill.skillId}
                className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3 shadow-2xs hover:border-emerald-300 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800">
                      <Award className="h-5 w-5" />
                    </div>
                    <h3 className="font-bold text-slate-900 text-base">
                      {isAmharic ? skill.name.am : skill.name.en}
                    </h3>
                  </div>
                  <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold uppercase text-slate-600">
                    {skill.category}
                  </span>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed">
                  {isAmharic ? skill.description.am : skill.description.en}
                </p>

                {/* Sample Activity */}
                {skill.curriculumActivities.length > 0 && (
                  <div className="rounded-xl bg-slate-50 border border-slate-100 p-3 text-xs space-y-1">
                    <span className="font-bold text-slate-800">
                      {isAmharic ? 'የትምህርት ምሳሌ፡ ' : 'Curriculum Activity: '}
                      {isAmharic
                        ? skill.curriculumActivities[0].activityType.am
                        : skill.curriculumActivities[0].activityType.en}
                    </span>
                    <p className="text-slate-600">
                      {isAmharic
                        ? skill.curriculumActivities[0].example.am
                        : skill.curriculumActivities[0].example.en}
                    </p>
                  </div>
                )}

                {/* Careers Valuing Skill */}
                <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] text-slate-400">
                    {isAmharic ? 'ተፈላጊ በ፡' : 'Valued in:'}
                  </span>
                  {skill.careersValuingSkill.map((cId) => (
                    <span
                      key={cId}
                      className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-700"
                    >
                      {cId}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: CROSS-SUBJECT SYNERGY MATRIX                                       */}
      {/* ========================================================================= */}
      {activeMainTab === 'synergy' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-2">
            <h2 className="text-xl font-bold text-slate-900">
              {isAmharic ? 'የትምህርቶች ውህደትና ቅንጅት' : 'Cross-Subject Synergy Matrix'}
            </h2>
            <p className="text-sm text-slate-600">
              {isAmharic
                ? 'ምንም ትምህርት ለብቻው አይቆምም:: በዘመናዊው ዓለም ትላልቅ ፈጠራዎች የሚመጡት የተለያዩ የትምህርት መስኮች ሲቀናጁ ነው::'
                : 'No single subject operates in isolation. Complex engineering marvels like the GERD, mobile fintech, and modern pharmacology require seamless interdisciplinary synthesis.'}
            </p>
          </div>

          <div className="space-y-4">
            {crossConnections.map((conn) => (
              <div
                key={conn.connectionId}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center space-x-2 text-sm font-black text-emerald-800">
                    <Layers className="h-5 w-5 text-emerald-600" />
                    <span>
                      {conn.primarySubject} + {conn.connectedSubject}
                    </span>
                    <span className="text-slate-300">→</span>
                    <span className="text-slate-900 font-extrabold">
                      {isAmharic ? conn.combinedField.am : conn.combinedField.en}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {conn.relatedCareers.map((cId) => (
                      <span
                        key={cId}
                        className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-semibold text-slate-700"
                      >
                        {cId}
                      </span>
                    ))}
                  </div>
                </div>

                <p className="text-sm text-slate-700 leading-relaxed">
                  {isAmharic ? conn.synergyExplanation.am : conn.synergyExplanation.en}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                  <div className="rounded-xl bg-slate-50 border border-slate-100 p-3.5 text-xs text-slate-700 space-y-1">
                    <strong className="text-slate-900 block font-semibold">
                      {isAmharic ? 'ዓለም አቀፍ ምሳሌ' : 'Real-World Technical Example'}
                    </strong>
                    <p>{isAmharic ? conn.realWorldExample.am : conn.realWorldExample.en}</p>
                  </div>

                  <div className="rounded-xl bg-amber-50/80 border border-amber-200 p-3.5 text-xs text-amber-950 space-y-1">
                    <strong className="text-amber-900 block font-semibold">
                      {isAmharic ? 'በኢትዮጵያ ተጨባጭ አተገባበር' : 'Ethiopian Megaproject / Industry'}
                    </strong>
                    <p>{isAmharic ? conn.ethiopianApplication.am : conn.ethiopianApplication.en}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: REAL-WORLD PROJECTS INCUBATOR                                      */}
      {/* ========================================================================= */}
      {activeMainTab === 'projects' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-2">
            <h2 className="text-xl font-bold text-slate-900">
              {isAmharic ? 'ተግባራዊ የፈጠራ ፕሮጀክቶች' : 'Real-World High School Projects'}
            </h2>
            <p className="text-sm text-slate-600">
              {isAmharic
                ? 'የተማሩትን ፅንሰ-ሀሳቦች በቤትዎ፣ በት/ቤትዎ ወይም በማህበረሰብዎ ውስጥ ባሉ ተጨባጭ ስራዎች ላይ ይሞክሩ::'
                : 'Turn theory into practical mastery. These accessible, hands-on micro-projects connect high school physics, math, biology, and chemistry to everyday Ethiopian life.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((proj) => (
              <div
                key={proj.projectId}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-emerald-100 px-3 py-0.5 text-xs font-bold text-emerald-800">
                      Grade {proj.gradeLevel} Project
                    </span>
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 uppercase">
                      {proj.difficulty}
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-slate-900">
                    {isAmharic ? proj.title.am : proj.title.en}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    {isAmharic ? proj.description.am : proj.description.en}
                  </p>

                  {/* Materials */}
                  <div className="rounded-xl bg-slate-50 border border-slate-100 p-3 space-y-1 text-xs">
                    <span className="font-bold text-slate-800">
                      {isAmharic ? 'የሚያስፈልጉ ቁሳቁሶች፡' : 'Materials:'}
                    </span>
                    <ul className="list-disc list-inside space-y-0.5 text-slate-600">
                      {proj.materialsNeeded.map((m, idx) => (
                        <li key={idx}>{isAmharic ? m.am : m.en}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Outcome */}
                  <div className="rounded-xl bg-emerald-50/70 border border-emerald-200 p-3 text-xs text-emerald-950">
                    <strong className="block font-semibold mb-0.5">
                      {isAmharic ? 'የሚጠበቅ ግኝት፡' : 'Expected Outcome:'}
                    </strong>
                    {isAmharic ? proj.expectedOutcome.am : proj.expectedOutcome.en}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="italic">
                    {isAmharic ? proj.ethiopianContextFocus.am : proj.ethiopianContextFocus.en}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
