import React, { useState } from 'react';
import { EntranceQuestion } from '../../types/entranceExam';
import { Grade } from '../../types';
import {
  Flame,
  Zap,
  Award,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Sparkles,
  Trophy,
} from 'lucide-react';

interface DailyChallengeViewProps {
  questions: EntranceQuestion[];
  userId: string;
  grade: Grade;
  onAwardXP?: (xp: number, reason: string) => void;
  onIncrementStreak?: () => void;
}

export const DailyChallengeView: React.FC<DailyChallengeViewProps> = ({
  questions,
  userId,
  grade,
  onAwardXP,
  onIncrementStreak,
}) => {
  const [sprintSize, setSprintSize] = useState<5 | 10 | 15>(5);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [challengeQuestions, setChallengeQuestions] = useState<EntranceQuestion[]>([]);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [timeSpent, setTimeSpent] = useState<number>(0);

  const startSprint = (size: 5 | 10 | 15) => {
    setSprintSize(size);
    const pool = [...questions].sort(() => 0.5 - Math.random()).slice(0, size);
    setChallengeQuestions(pool);
    setCurrentIndex(0);
    setSelectedAnswers({});
    setIsActive(true);
    setIsCompleted(false);
    setScore(0);
  };

  const handleSelectAnswer = (optIndex: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentIndex]: optIndex,
    }));
  };

  const handleFinish = () => {
    let earned = 0;
    challengeQuestions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswer) earned += 1;
    });
    setScore(earned);
    setIsActive(false);
    setIsCompleted(true);

    // Award XP
    const xpReward = sprintSize === 5 ? 50 : sprintSize === 10 ? 100 : 180;
    if (onAwardXP) {
      onAwardXP(xpReward, `Completed ${sprintSize}-Question Daily Entrance Challenge`);
    }
    if (onIncrementStreak) {
      onIncrementStreak();
    }
  };

  const currentQ = challengeQuestions[currentIndex];

  if (isCompleted) {
    return (
      <div className="max-w-xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm text-center space-y-5">
        <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
          <Trophy className="w-8 h-8" />
        </div>

        <div className="space-y-1">
          <h3 className="text-2xl font-bold font-serif-ethiopic text-stone-900">
            የዕለቱ የፈተና ፈተና ተጠናቋል!
          </h3>
          <p className="text-xs text-stone-500">
            የ{sprintSize} ጥያቄዎች ዕለታዊ ፈተናዎን በተሳካ ሁኔታ አጠናቀዋል
          </p>
        </div>

        <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 flex items-center justify-around text-xs">
          <div>
            <span className="text-stone-500 block">ትክክለኛ ውጤት</span>
            <span className="text-lg font-bold text-emerald-700">
              {score} / {sprintSize}
            </span>
          </div>
          <div className="w-px h-8 bg-stone-200" />
          <div>
            <span className="text-stone-500 block">የተገኘ XP</span>
            <span className="text-lg font-bold text-amber-600">
              +{sprintSize === 5 ? 50 : sprintSize === 10 ? 100 : 180} XP
            </span>
          </div>
          <div className="w-px h-8 bg-stone-200" />
          <div>
            <span className="text-stone-500 block">የጥናት ጽናት</span>
            <span className="text-lg font-bold text-orange-600 flex items-center justify-center gap-1">
              <Flame className="w-4 h-4 fill-orange-500 text-orange-600" /> +1 Day
            </span>
          </div>
        </div>

        <button
          onClick={() => setIsCompleted(false)}
          className="px-6 py-2.5 bg-stone-900 hover:bg-black text-white rounded-xl text-xs font-bold cursor-pointer transition-all shadow-sm"
        >
          ወደ መነሻ ተመለስ
        </button>
      </div>
    );
  }

  if (isActive && currentQ) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-stone-100 text-xs">
          <span className="px-3 py-1 bg-amber-100 text-amber-900 font-bold rounded-xl flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5" />
            <span>Daily Sprint ({currentIndex + 1}/{sprintSize})</span>
          </span>
          <span className="font-semibold text-stone-500 uppercase">{currentQ.subject}</span>
        </div>

        <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200/80 space-y-1">
          <p className="text-sm sm:text-base font-semibold text-stone-900 leading-relaxed">
            {currentQ.question}
          </p>
        </div>

        <div className="space-y-2.5">
          {currentQ.options?.map((opt, idx) => {
            const isSelected = selectedAnswers[currentIndex] === idx;
            return (
              <button
                key={idx}
                onClick={() => handleSelectAnswer(idx)}
                className={`w-full p-4 rounded-xl text-left text-xs sm:text-sm font-medium transition-all flex items-center justify-between border cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                    : 'bg-white hover:bg-stone-50 text-stone-800 border-stone-200'
                }`}
              >
                <span>{opt}</span>
                <span className="w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-bold">
                  {String.fromCharCode(65 + idx)}
                </span>
              </button>
            );
          })}
        </div>

        <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
          <button
            onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentIndex === 0}
            className="px-4 py-2 border border-stone-200 text-stone-600 rounded-xl text-xs font-semibold hover:bg-stone-50 disabled:opacity-40 cursor-pointer"
          >
            ወደ ኋላ
          </button>

          {currentIndex < sprintSize - 1 ? (
            <button
              onClick={() => setCurrentIndex((prev) => prev + 1)}
              className="px-5 py-2 bg-stone-900 hover:bg-black text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <span>ቀጣይ</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="px-6 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <span>ጨርስ (Complete)</span>
              <CheckCircle2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif-ethiopic text-stone-900 flex items-center gap-2">
            <Flame className="w-6 h-6 text-orange-500" />
            የዕለቱ የፈተና ፈተናዎች (Daily Entrance Challenges)
          </h2>
          <p className="text-xs text-stone-500">
            በየቀኑ አጫጭር የጊዜ ልምምዶችን በመስራት የፈተና ጽናትዎን (Streak) እና የXP ነጥቦችን ያሳድጉ።
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-6 rounded-2xl border border-stone-200 hover:border-amber-500 hover:shadow-md transition-all bg-stone-50 hover:bg-white space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 bg-amber-100 text-amber-900 rounded-lg text-xs font-bold">
                5 Questions
              </span>
              <span className="text-xs text-stone-500 font-mono">~4 min</span>
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900">Sprint 1: Fast Five</h3>
              <p className="text-xs text-stone-500">5 ፈጣን የፈተና ጥያቄዎች ለዕለቱ ጅምር።</p>
            </div>
            <div className="pt-2 flex items-center justify-between text-xs text-stone-600 border-t border-stone-200">
              <span>ሽልማት፡ +50 XP</span>
              <button
                onClick={() => startSprint(5)}
                className="px-4 py-2 bg-stone-900 hover:bg-black text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                ጀምር
              </button>
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-stone-200 hover:border-indigo-500 hover:shadow-md transition-all bg-stone-50 hover:bg-white space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 bg-indigo-100 text-indigo-900 rounded-lg text-xs font-bold">
                10 Questions
              </span>
              <span className="text-xs text-stone-500 font-mono">~8 min</span>
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900">Sprint 2: Standard Ten</h3>
              <p className="text-xs text-stone-500">10 ሚዛናዊ የፈተና ጥያቄዎች ከተለያዩ ርዕሶች።</p>
            </div>
            <div className="pt-2 flex items-center justify-between text-xs text-stone-600 border-t border-stone-200">
              <span>ሽልማት፡ +100 XP</span>
              <button
                onClick={() => startSprint(10)}
                className="px-4 py-2 bg-indigo-700 hover:bg-indigo-800 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                ጀምር
              </button>
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-stone-200 hover:border-orange-500 hover:shadow-md transition-all bg-stone-50 hover:bg-white space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 bg-orange-100 text-orange-900 rounded-lg text-xs font-bold">
                15 Questions
              </span>
              <span className="text-xs text-stone-500 font-mono">~12 min</span>
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900">Sprint 3: Endurance 15</h3>
              <p className="text-xs text-stone-500">15 ጥልቅ የሂሳብና የሳይንስ ስሌት ጥያቄዎች።</p>
            </div>
            <div className="pt-2 flex items-center justify-between text-xs text-stone-600 border-t border-stone-200">
              <span>ሽልማት፡ +180 XP</span>
              <button
                onClick={() => startSprint(15)}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                ጀምር
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
