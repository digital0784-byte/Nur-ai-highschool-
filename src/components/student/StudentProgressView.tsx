import React from 'react';
import {
  TrendingUp,
  Award,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Brain,
  Layers,
  ArrowRight,
  BookOpen,
  Calendar,
} from 'lucide-react';
import { GradeLevel } from '../../types/curriculumEngine';
import { LanguageCode } from '../../types';
import { ethiopianCurriculumEngine } from '../../engine/curriculumRegistry';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { ProgressBar } from '../ui/ProgressBar';
import { KPIStatCard } from '../ui/KPIStatCard';

interface StudentProgressViewProps {
  grade: GradeLevel;
  language: LanguageCode;
  onNavigateToTopic?: (subjectId: string, topicId: string) => void;
}

export const StudentProgressView: React.FC<StudentProgressViewProps> = ({
  grade,
  language,
  onNavigateToTopic,
}) => {
  const subjects = ethiopianCurriculumEngine.getSubjectsByGrade(grade);

  const stats = {
    overallPercentage: 48,
    totalCompletedLessons: 24,
    totalStudyHours: 18.5,
    streakDays: 7,
    averageQuizScore: 88,
    masteredCount: 14,
    developingCount: 7,
    weakCount: 3,
  };

  const subjectProgress = [
    { name: 'ሒሳብ (Mathematics)', nameEn: 'Mathematics', progress: 62, mastered: 5, weak: 1 },
    { name: 'ፊዚክስ (Physics)', nameEn: 'Physics', progress: 45, mastered: 3, weak: 1 },
    { name: 'ኬሚስትሪ (Chemistry)', nameEn: 'Chemistry', progress: 50, mastered: 3, weak: 0 },
    { name: 'ባዮሎጂ (Biology)', nameEn: 'Biology', progress: 58, mastered: 4, weak: 1 },
    { name: 'ኢኮኖሚክስ (Economics)', nameEn: 'Economics', progress: 35, mastered: 2, weak: 0 },
  ];

  const weakTopicsList = [
    {
      subject: 'ሒሳብ (Mathematics)',
      subjectId: 'math-g9',
      topic: 'የኢንቨርስ ፈንክሽኖች ግራፍ (Inverse Functions Graphing)',
      topicId: 'math-g9-u1-t2',
      accuracy: '45%',
    },
    {
      subject: 'ፊዚክስ (Physics)',
      subjectId: 'physics-g9',
      topic: 'የቬክተሮች ብዜት (Dot and Cross Products)',
      topicId: 'physics-g9-u1-t2',
      accuracy: '50%',
    },
    {
      subject: 'ባዮሎጂ (Biology)',
      subjectId: 'biology-g9',
      topic: 'የሴል ኦርጋኔሎች ተግባር (Organelle Specialization)',
      topicId: 'biology-g9-u1-t2',
      accuracy: '55%',
    },
  ];

  const weekDays = [
    { day: 'Mon', active: true, minutes: 45 },
    { day: 'Tue', active: true, minutes: 60 },
    { day: 'Wed', active: true, minutes: 30 },
    { day: 'Thu', active: true, minutes: 75 },
    { day: 'Fri', active: true, minutes: 50 },
    { day: 'Sat', active: true, minutes: 90 },
    { day: 'Sun', active: true, minutes: 40 },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Title */}
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-stone-900 font-serif-ethiopic">
          {language === 'am' ? 'የትምህርት ውጤትና የእድገት ትንታኔ' : 'Learning Analytics & Mastery'}
        </h2>
        <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
          {language === 'am'
            ? 'አጠቃላይ የትምህርት እድገትዎን፣ የፈተና ውጤቶችን እና የክለሳ ርዕሶችን ይከታተሉ።'
            : 'Track topic mastery, learning streaks, quiz benchmarks, and personalized remedial areas.'}
        </p>
      </div>

      {/* 1. Top Overall Progress Hero Card */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          {/* Progress Ring or Circular Indicator */}
          <div className="relative w-20 h-20 rounded-full bg-emerald-50 border-4 border-emerald-500 flex items-center justify-center shrink-0">
            <span className="text-xl font-black font-mono text-emerald-900">
              {stats.overallPercentage}%
            </span>
          </div>

          <div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200/60 font-mono">
              Grade {grade} Curriculum Coverage
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-stone-900 mt-1 font-serif-ethiopic">
              {language === 'am' ? 'አጠቃላይ የትምህርት ሂደትዎ በጥሩ ሁኔታ ላይ ነው!' : 'You are on track with your curriculum!'}
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              {language === 'am'
                ? `እስካሁን ${stats.totalCompletedLessons} ርዕሶችን ያጠናቀቁ ሲሆን፣ 14ቱ ሙሉ በሙሉ የተካኑ ናቸው።`
                : `${stats.totalCompletedLessons} topics completed, with 14 fully mastered.`}
            </p>
          </div>
        </div>

        {/* Learning Streak Pill */}
        <div className="flex items-center gap-3 bg-amber-50/80 border border-amber-200/80 p-4 rounded-2xl shrink-0 self-start md:self-auto">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
            <Flame className="w-5 h-5 fill-amber-500 text-amber-500" />
          </div>
          <div>
            <div className="text-base font-black font-mono text-stone-900">
              {stats.streakDays} {language === 'am' ? 'ቀናት' : 'Days Streak'}
            </div>
            <p className="text-xs text-stone-500">
              {language === 'am' ? 'የጥናት ጽናት' : 'Consecutive Daily Study'}
            </p>
          </div>
        </div>
      </div>

      {/* 2. 7-Day Activity Visualizer & Topic Mastery Status */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Weekly Activity (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-stone-200/90 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <h4 className="text-sm font-bold text-stone-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-600" />
              {language === 'am' ? 'የሳምንቱ የጥናት ሰዓት (Weekly Study Activity)' : 'Weekly Study Activity'}
            </h4>
            <span className="text-xs font-mono font-bold text-emerald-700">{stats.totalStudyHours} hrs total</span>
          </div>

          <div className="grid grid-cols-7 gap-2 pt-6 pb-2">
            {weekDays.map((d, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div className="w-full bg-stone-100 rounded-xl h-24 flex items-end p-1">
                  <div
                    className="w-full bg-emerald-500 rounded-lg transition-all"
                    style={{ height: `${Math.min((d.minutes / 90) * 100, 100)}%` }}
                  />
                </div>
                <span className="text-xs font-semibold text-stone-700">{d.day}</span>
                <span className="text-[10px] text-stone-400 font-mono">{d.minutes}m</span>
              </div>
            ))}
          </div>
        </div>

        {/* Topic Mastery Distribution (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-stone-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-bold text-stone-900 pb-3 border-b border-stone-100 flex items-center gap-2">
              <Brain className="w-4 h-4 text-teal-600" />
              {language === 'am' ? 'የእውቀት ደረጃ ድልድል (Mastery Levels)' : 'Topic Mastery Distribution'}
            </h4>

            <div className="space-y-4 mt-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-bold text-emerald-800">
                    {language === 'am' ? 'የተካኑ (Mastered)' : 'Mastered (80%+)'}
                  </span>
                  <span className="font-mono font-bold">{stats.masteredCount} ርዕሶች</span>
                </div>
                <ProgressBar value={60} size="sm" variant="emerald" showPercentage={false} />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-bold text-amber-800">
                    {language === 'am' ? 'በመሻሻል ላይ (Developing)' : 'Developing (50-80%)'}
                  </span>
                  <span className="font-mono font-bold">{stats.developingCount} ርዕሶች</span>
                </div>
                <ProgressBar value={30} size="sm" variant="amber" showPercentage={false} />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-bold text-rose-800">
                    {language === 'am' ? 'ክለሳ የሚሹ (Needs Revision)' : 'Needs Revision (<50%)'}
                  </span>
                  <span className="font-mono font-bold">{stats.weakCount} ርዕሶች</span>
                </div>
                <ProgressBar value={10} size="sm" variant="rose" showPercentage={false} />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
            <span>አማካይ የምዘና ውጤት:</span>
            <span className="font-mono font-bold text-stone-900 text-sm">{stats.averageQuizScore}%</span>
          </div>
        </div>
      </div>

      {/* 3. Subject Progress Breakdown & Weak Topics Alert */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Subject Progress Cards (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-stone-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <h4 className="text-sm font-bold text-stone-900 font-serif-ethiopic">
              {language === 'am' ? 'የትምህርት አይነቶች እድገት' : 'Subject Progress Breakdown'}
            </h4>
            <span className="text-xs text-stone-400">All Subjects</span>
          </div>

          <div className="space-y-4">
            {subjectProgress.map((sub, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-stone-800">
                    {language === 'am' ? sub.name : sub.nameEn}
                  </span>
                  <span className="font-mono font-bold text-stone-900">{sub.progress}%</span>
                </div>
                <ProgressBar value={sub.progress} size="sm" variant="emerald" showPercentage={false} />
              </div>
            ))}
          </div>
        </div>

        {/* Weak Topics / Needs Review (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-stone-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h4 className="text-sm font-bold text-rose-900 flex items-center gap-1.5 font-serif-ethiopic">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                {language === 'am' ? 'ትኩረት የሚሹ ደካማ ርዕሶች' : 'Weak Topics (Action Required)'}
              </h4>
              <Badge variant="danger" size="xs">
                {weakTopicsList.length}
              </Badge>
            </div>

            <div className="divide-y divide-stone-100 mt-2">
              {weakTopicsList.map((item, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-stone-900 truncate">{item.topic}</p>
                    <p className="text-[11px] text-stone-500">
                      {item.subject} • ውጤት: <span className="font-mono text-rose-600 font-bold">{item.accuracy}</span>
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="xs"
                    onClick={() => onNavigateToTopic?.(item.subjectId, item.topicId)}
                  >
                    {language === 'am' ? 'አርም' : 'Review'}
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-stone-100 text-center">
            <span className="text-xs text-stone-400">
              {language === 'am' ? 'እነዚህን ርዕሶች ማጠናከር የፈተና ውጤትዎን በ 18% ያሳድጋል!' : 'Revising these boosts test scores by ~18%!'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
