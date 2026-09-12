import React, { useState } from 'react';
import { EntrancePastPaper } from '../../types/entranceExam';
import { Grade } from '../../types';
import {
  FileText,
  Clock,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  Filter,
  Download,
  AlertCircle,
} from 'lucide-react';

interface PastPapersViewProps {
  pastPapers: EntrancePastPaper[];
  grade: Grade;
  onStartPaperExam: (paper: EntrancePastPaper) => void;
}

export const PastPapersView: React.FC<PastPapersViewProps> = ({
  pastPapers,
  grade,
  onStartPaperExam,
}) => {
  const [filterSubject, setFilterSubject] = useState<string>('all');

  const filtered = pastPapers.filter((p) => {
    if (filterSubject !== 'all' && p.subject !== filterSubject) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner with Strict Provenance Rule */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-stone-100">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-serif-ethiopic text-stone-900 flex items-center gap-2">
              <FileText className="w-6 h-6 text-indigo-600" />
              ያለፉና ሞዴል የፈተና ወረቀቶች (Past & Model Entrance Papers)
            </h2>
            <p className="text-xs text-stone-500">
              በይፋዊ ፈቃድና በስርዓተ-ትምህርት አሰላለፍ የተረጋገጡ የዩኒቨርሲቲ መግቢያ ሞዴል ወረቀቶች።
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <Filter className="w-4 h-4 text-stone-400" />
            <select
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
              className="px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-800 font-semibold focus:outline-none"
            >
              <option value="all">ሁሉም የትምህርት አይነቶች (All)</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Physics">Physics</option>
              <option value="Chemistry">Chemistry</option>
              <option value="English">English</option>
              <option value="Aptitude">Aptitude</option>
            </select>
          </div>
        </div>

        {/* Provenance and Integrity Banner */}
        <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80 flex items-start gap-3 text-xs text-stone-700">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <p>
            <strong>የትክክለኛነት ደንብ (Proven Integrity Rule):</strong> NUR AI የውሸት ወይም ያልተረጋገጡ ይፋዊ የፈተና ወረቀቶችን አያቀርብም። ሁሉም ወረቀቶች እንደ <strong>'Curriculum-Aligned Model Entrance Exam'</strong> ወይም <strong>'Official MoE Past Paper'</strong> በግልፅ በምንጫቸውና በፈቃዳቸው ተለይተው ተቀምጠዋል።
          </p>
        </div>

        {/* Papers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {filtered.map((paper) => (
            <div
              key={paper.id}
              className="p-6 rounded-2xl border border-stone-200 hover:border-indigo-500 hover:shadow-md transition-all bg-white flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase ${
                      paper.isOfficial
                        ? 'bg-emerald-100 text-emerald-900'
                        : 'bg-indigo-100 text-indigo-900'
                    }`}
                  >
                    {paper.isOfficial ? `Official Paper (${paper.year})` : 'Curriculum-Aligned Model'}
                  </span>
                  <span className="text-xs text-stone-500 font-mono flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {paper.timeLimitMinutes || paper.metadata?.durationMinutes || 120} ደቂቃ
                  </span>
                </div>

                <h3 className="text-base font-bold text-stone-900">{paper.title}</h3>
                <p className="text-xs text-stone-500">{paper.subject} • Grade {paper.grade} • {paper.stream.toUpperCase()}</p>
              </div>

              <div className="space-y-2 pt-3 border-t border-stone-100 text-xs">
                <div className="flex items-center justify-between text-stone-600">
                  <span>የጥያቄዎች ብዛት፡</span>
                  <span className="font-bold text-stone-900">{paper.totalQuestions || paper.questionsCount} ጥያቄዎች</span>
                </div>
                <div className="flex items-center justify-between text-stone-600">
                  <span>የተረጋገጠ ምንጭ፡</span>
                  <span className="font-medium text-stone-800 truncate max-w-[200px]">{paper.sourceProvenance || paper.source}</span>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => onStartPaperExam(paper)}
                    className="w-full py-2.5 bg-stone-900 hover:bg-black text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                  >
                    <span>በፈተና ሰዓት ጀምር (Start Timed Exam)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
