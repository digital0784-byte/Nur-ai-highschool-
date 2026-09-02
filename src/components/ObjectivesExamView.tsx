import React, { useState } from 'react';
import { Subject, Grade } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { getTextbook } from '../data/textbooksData';
import {
  Award,
  CheckCircle2,
  XCircle,
  Sparkles,
  HelpCircle,
  RotateCcw,
  BookOpen,
  ArrowRight,
  Loader2,
  Target,
  BarChart3,
  ChevronRight,
} from 'lucide-react';

interface ObjectivesExamViewProps {
  subject: Subject;
  grade: Grade;
  onOpenAITutor?: (chapterTitle: string, mode: 'analysis' | 'chat') => void;
}

interface ObjectiveQuestion {
  id: string;
  objectiveText: string;
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
  explanation: string;
}

export const ObjectivesExamView: React.FC<ObjectivesExamViewProps> = ({
  subject,
  grade,
  onOpenAITutor,
}) => {
  const { language, t } = useLanguage();
  const textbook = getTextbook(subject.id, grade);
  const units = textbook.units;

  const [selectedUnitIndex, setSelectedUnitIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [aiEvaluation, setAiEvaluation] = useState<{
    evaluation: string;
    score: number;
    masteryLevel: string;
    suggestions: string[];
  } | null>(null);

  const currentUnit = units[selectedUnitIndex] || units[0];

  // Derive objective assessment questions for the selected unit
  const objectiveQuestions: ObjectiveQuestion[] = React.useMemo(() => {
    if (!currentUnit) return [];

    // If unit has explicit objectives with questions
    if (currentUnit.objectives && currentUnit.objectives.length > 0) {
      return currentUnit.objectives.map((obj, idx) => ({
        id: obj.id || `obj-${idx}`,
        objectiveText: obj.title,
        question:
          obj.masteryQuestion?.question ||
          `በምዕራፍ ${currentUnit.unitNumber} (${currentUnit.title}) ስር: ${obj.title}ን በተመለከተ ትክክለኛው የትኛው ነው?`,
        options: obj.masteryQuestion?.options || [
          'ፅንሰ-ሀሳቡ በስርዓተ-ትምህርቱ መሰረት ትክክል ነው',
          'ተቃራኒ ትርጓሜ ነው',
          'ያልተሟላ አገላለጽ ነው',
          'ምንም ግንኙነት የለውም',
        ],
        correctIndex: obj.masteryQuestion?.correctIndex ?? 0,
        explanation:
          obj.masteryQuestion?.explanation ||
          `ይህ ጥያቄ የ ${obj.title}ን የትምህርት ዓላማ ግንዛቤ ይፈትሻል።`,
      }));
    }

    // Fallback: generate high-quality objective questions from unit sections and summary
    const questionsList: ObjectiveQuestion[] = [];
    currentUnit.sections.forEach((sec, idx) => {
      const firstExample = sec.workedExamples?.[0];
      const firstTerm = sec.keyTerms?.[0];

      if (firstTerm) {
        questionsList.push({
          id: `sec-term-${idx}`,
          objectiveText: `Understand term & concept: ${firstTerm.term}`,
          question: `በ ${sec.title} ስር የ "${firstTerm.term}" ትክክለኛ ሳይንሳዊ ትርጉም የትኛው ነው?`,
          options: [
            firstTerm.definition,
            `የ ${firstTerm.term} ተቃራኒ ባህሪ መግለጫ`,
            'በዚህ ምዕራፍ ውስጥ የማይሰራ ህግ',
            'ከላይ ያሉት በሙሉ ስህተት ናቸው',
          ],
          correctIndex: 0,
          explanation: `ትክክለኛ ትርጉም፡ ${firstTerm.definition}`,
        });
      }

      if (firstExample) {
        questionsList.push({
          id: `sec-example-${idx}`,
          objectiveText: `Apply problem-solving methods for: ${sec.title}`,
          question: firstExample.question,
          options: [
            firstExample.solution.split('\n')[0] || 'ትክክለኛ አሰራርና መፍትሄ',
            'ቀመሩ በስህተት ተተግብሯል',
            'መልሱ ከ 0 በታች መሆን አለበት',
            'ስሌቱ አልተሟላም',
          ],
          correctIndex: 0,
          explanation: `የአሰራር ቅደም-ተከተል፡\n${firstExample.solution}`,
        });
      }
    });

    if (questionsList.length === 0) {
      questionsList.push({
        id: 'default-obj-1',
        objectiveText: `Master core principles of ${currentUnit.title}`,
        question: `የምዕራፍ ${currentUnit.unitNumber} (${currentUnit.title}) ዋና ጭብጥ የትኛው ነው?`,
        options: [
          currentUnit.summary,
          'ከምዕራፉ ጋር ተቃራኒ የሆነ መግለጫ',
          'ያልተረጋገጠ ግምት',
          'ምንም ግንኙነት የሌለው ሀሳብ',
        ],
        correctIndex: 0,
        explanation: `የምዕራፉ ዋና ማጠቃለያ፡ ${currentUnit.summary}`,
      });
    }

    return questionsList;
  }, [currentUnit]);

  const handleSelectOption = (qIndex: number, optIndex: number) => {
    if (isSubmitted) return;
    setUserAnswers((prev) => ({ ...prev, [qIndex]: optIndex }));
  };

  const handleUnitChange = (index: number) => {
    setSelectedUnitIndex(index);
    setUserAnswers({});
    setIsSubmitted(false);
    setAiEvaluation(null);
  };

  const handleSubmitExam = async () => {
    setIsSubmitted(true);
    setIsEvaluating(true);

    let rawScore = 0;
    const answerPayload = objectiveQuestions.map((q, idx) => {
      const studentAns = userAnswers[idx];
      const isCorrect = studentAns === q.correctIndex;
      if (isCorrect) rawScore++;
      return {
        question: q.question,
        studentAnswer: studentAns !== undefined ? q.options[studentAns] : 'ያልተመለሰ (Unanswered)',
        isCorrect,
      };
    });

    try {
      const res = await fetch('/api/ai/evaluate-objectives', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subjectName: subject.name,
          grade,
          chapterTitle: `ምዕራፍ ${currentUnit.unitNumber}: ${currentUnit.title}`,
          objectives: objectiveQuestions.map((q) => q.objectiveText),
          answers: answerPayload,
          language,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setAiEvaluation(data);
      } else {
        throw new Error('Objectives evaluation request failed');
      }
    } catch (err) {
      console.warn('Objective AI evaluation fallback:', err);
      const evalPercentage = Math.round((rawScore / (objectiveQuestions.length || 1)) * 100);
      setAiEvaluation({
        evaluation: evalPercentage >= 75
          ? `🎉 **ከፍተኛ የብቃት ደረጃ (High Mastery)**! የ${currentUnit.title}ን የትምህርት ዓላማዎች ${evalPercentage}% በትክክል አሳክተዋል።`
          : `📚 **መካከለኛ ደረጃ (${evalPercentage}%)** - የምዕራፉን ዋና ዋና ፅንሰ-ሀሳቦች እና ቀመሮች በድጋሚ በመከለስ ሙሉ ብቃት ያግኙ።`,
        score: rawScore,
        masteryLevel: evalPercentage >= 75 ? 'Mastered' : evalPercentage >= 50 ? 'Proficient' : 'Needs Review',
        suggestions: [
          'የተሳሳቱባቸውን ጥያቄዎች ማብራሪያ በድጋሚ ይከልሱ',
          'የምዕራፉን ፍላሽካርዶች በመጠቀም ፅንሰ-ሀሳቦችን ያጠናክሩ',
          'የተሰሩ ምሳሌዎችን በድጋሚ ይስሩ',
        ],
      });
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleReset = () => {
    setUserAnswers({});
    setIsSubmitted(false);
    setAiEvaluation(null);
  };

  const scoreCount = objectiveQuestions.filter((q, idx) => userAnswers[idx] === q.correctIndex).length;
  const percentage = Math.round((scoreCount / (objectiveQuestions.length || 1)) * 100);

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Unit Selector Bar */}
      <div className="bg-[#FAF6EC] border-[1.5px] border-[#38332D] rounded-xl p-4 sm:p-5 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center border border-[#38332D]"
              style={{ backgroundColor: subject.accentColor, color: '#FFFFFF' }}
            >
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold font-serif-ethiopic text-[#1E1B18]">
                የቻፕተር ፈተና (Chapter Learning Objectives Assessment)
              </h2>
              <p className="text-xs text-[#5A5143] font-serif-ethiopic">
                የእያንዳንዱን ምዕራፍ የትምህርት ዓላማዎች (Objectives) በመፈተን እውቀትዎን በAI ያረጋግጡ
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#5A5143]">ምዕራፍ ምረጥ:</span>
            <select
              value={selectedUnitIndex}
              onChange={(e) => handleUnitChange(Number(e.target.value))}
              className="bg-[#EDE6D4] border border-[#38332D] rounded-lg px-3 py-1.5 text-xs font-bold text-[#1E1B18] font-serif-ethiopic focus:outline-none"
            >
              {units.map((u, idx) => (
                <option key={idx} value={idx}>
                  ምዕራፍ {u.unitNumber}: {u.title.substring(0, 35)}...
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Unit Summary Banner */}
        <div className="bg-[#EDE6D4] p-3 rounded-lg border border-[#38332D]/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs font-black uppercase text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded border border-amber-400">
              ምዕራፍ {currentUnit.unitNumber}
            </span>
            <span className="text-sm font-bold text-[#1E1B18] ml-2 font-serif-ethiopic">
              {currentUnit.title}
            </span>
          </div>
          <button
            onClick={() => onOpenAITutor?.(currentUnit.title, 'analysis')}
            className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-[#FAF6EC] border border-[#38332D] text-[#1E1B18] hover:bg-[#E3DAC4] transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>የምዕራፉን AI ትንታኔ እይ</span>
          </button>
        </div>
      </div>

      {/* Exam Result / AI Evaluation Card */}
      {isSubmitted && (
        <div className="bg-[#FAF6EC] border-[2px] border-[#38332D] rounded-xl p-5 sm:p-6 shadow-[4px_4px_0px_0px_#1E1B18] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#38332D]">
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center border border-[#38332D] text-white font-black text-lg ${
                  percentage >= 75
                    ? 'bg-emerald-700'
                    : percentage >= 50
                    ? 'bg-amber-600'
                    : 'bg-rose-600'
                }`}
              >
                {percentage}%
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold font-serif-ethiopic text-[#1E1B18]">
                  {percentage >= 75
                    ? 'የምዕራፉን ዓላማዎች በከፍተኛ ደረጃ አሟልተዋል!'
                    : percentage >= 50
                    ? 'ጥሩ ውጤት ነው፤ ጥቂት ፅንሰ-ሀሳቦችን ይከልሱ'
                    : 'ትምህርቱን በድጋሚ በመከለስ የተሻለ ውጤት ያስመዝግቡ'}
                </h3>
                <p className="text-xs text-[#5A5143]">
                  የተመለሱ ጥያቄዎች፡ {scoreCount} ከ {objectiveQuestions.length} ({percentage}%)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#38332D] bg-[#EDE6D4] text-[#1E1B18] hover:bg-[#E3DAC4] text-xs font-bold"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>እንደገና ፈተን</span>
              </button>
              <button
                onClick={() => onOpenAITutor?.(currentUnit.title, 'chat')}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#38332D] bg-[#1E1B18] text-[#FAF6EC] hover:bg-[#38332D] text-xs font-bold shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>ከAI ጋር ተወያይበት</span>
              </button>
            </div>
          </div>

          {/* AI Pedagogical Diagnosis */}
          <div className="bg-[#EDE6D4] p-4 rounded-xl border border-[#38332D] space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-950">
              <Sparkles className="w-4 h-4 text-amber-700" />
              <span>የGemini 3.7 AI ትንታኔ እና የማሻሻያ ምክረ-ሀሳቦች (Diagnostic Report):</span>
            </div>

            {isEvaluating ? (
              <div className="py-4 flex items-center justify-center gap-2 text-xs text-[#5A5143]">
                <Loader2 className="w-4 h-4 animate-spin text-amber-700" />
                <span>AI የተማሪውን ውጤት እና የዓላማዎች ስኬት እየገመገመ ነው...</span>
              </div>
            ) : aiEvaluation ? (
              <div className="space-y-2 text-xs text-[#1E1B18] font-serif-ethiopic leading-relaxed">
                <p className="whitespace-pre-wrap">{aiEvaluation.evaluation}</p>
                {aiEvaluation.suggestions && aiEvaluation.suggestions.length > 0 && (
                  <div className="pt-2 border-t border-[#38332D]/30">
                    <span className="font-bold text-[#1E1B18]">የማሻሻያ ደረጃዎች፡</span>
                    <ul className="list-disc list-inside mt-1 space-y-1 text-[#423A2F]">
                      {aiEvaluation.suggestions.map((s, idx) => (
                        <li key={idx}>{s}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-[#5A5143] font-serif-ethiopic">
                የምዕራፉን ዓላማዎች በመከለስ ሙሉ እውቀትዎን ያዳብሩ።
              </p>
            )}
          </div>
        </div>
      )}

      {/* Questions List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm sm:text-base font-bold text-[#1E1B18] font-serif-ethiopic flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-700" />
            <span>የምዕራፍ {currentUnit.unitNumber} የብቃት መመዘኛ ጥያቄዎች ({objectiveQuestions.length})</span>
          </h3>
          <span className="text-xs text-[#665C4D]">
            የተመለሱ፡ {Object.keys(userAnswers).length}/{objectiveQuestions.length}
          </span>
        </div>

        {objectiveQuestions.map((q, qIndex) => {
          const selectedOption = userAnswers[qIndex];
          const isAnswered = selectedOption !== undefined;
          const isCorrect = selectedOption === q.correctIndex;

          return (
            <div
              key={q.id}
              className={`bg-[#FAF6EC] border-[1.5px] rounded-xl p-4 sm:p-5 transition-all ${
                isSubmitted
                  ? isCorrect
                    ? 'border-emerald-700 bg-emerald-50/40'
                    : 'border-rose-700 bg-rose-50/40'
                  : 'border-[#38332D] shadow-xs'
              }`}
            >
              {/* Objective Tag */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[11px] font-bold text-[#665C4D] bg-[#EDE6D4] px-2.5 py-0.5 rounded-full border border-[#38332D]/40">
                  🎯 ዓላማ፡ {q.objectiveText}
                </span>
                {isSubmitted && (
                  <span
                    className={`text-xs font-bold flex items-center gap-1 ${
                      isCorrect ? 'text-emerald-800' : 'text-rose-800'
                    }`}
                  >
                    {isCorrect ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" /> ትክክል
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4" /> ተሳስቷል
                      </>
                    )}
                  </span>
                )}
              </div>

              {/* Question Text */}
              <h4 className="text-sm sm:text-base font-bold text-[#1E1B18] font-serif-ethiopic mb-3">
                {qIndex + 1}. {q.question}
              </h4>

              {/* Options */}
              <div className="grid grid-cols-1 gap-2">
                {q.options.map((optionText, optIndex) => {
                  const isSelected = selectedOption === optIndex;
                  let optStyle =
                    'bg-[#EDE6D4] text-[#1E1B18] border-[#38332D] hover:bg-[#E3DAC4]';

                  if (isSubmitted) {
                    if (optIndex === q.correctIndex) {
                      optStyle = 'bg-emerald-100 border-emerald-700 text-emerald-950 font-bold';
                    } else if (isSelected && !isCorrect) {
                      optStyle = 'bg-rose-100 border-rose-700 text-rose-950';
                    } else {
                      optStyle = 'bg-[#EDE6D4]/50 border-transparent text-[#665C4D] opacity-60';
                    }
                  } else if (isSelected) {
                    optStyle = 'bg-[#1E1B18] text-[#FAF6EC] border-[#1E1B18] font-bold';
                  }

                  const optionLabels = ['ሀ', 'ለ', 'ሐ', 'መ'];

                  return (
                    <button
                      key={optIndex}
                      onClick={() => handleSelectOption(qIndex, optIndex)}
                      disabled={isSubmitted}
                      className={`w-full text-left p-3 rounded-lg border text-xs sm:text-sm font-serif-ethiopic flex items-start gap-2.5 transition-all cursor-pointer ${optStyle}`}
                    >
                      <span
                        className={`w-5 h-5 rounded-full text-xs flex items-center justify-center shrink-0 font-bold border ${
                          isSelected && !isSubmitted
                            ? 'bg-[#FAF6EC] text-[#1E1B18] border-[#FAF6EC]'
                            : 'bg-[#FAF6EC] text-[#1E1B18] border-[#38332D]'
                        }`}
                      >
                        {optionLabels[optIndex]}
                      </span>
                      <span className="flex-1">{optionText}</span>
                    </button>
                  );
                })}
              </div>

              {/* Explanation (Shown when submitted) */}
              {isSubmitted && (
                <div className="mt-3 p-3 rounded-lg bg-[#EDE6D4] border border-[#38332D]/60 text-xs font-serif-ethiopic text-[#1E1B18] leading-relaxed">
                  <span className="font-bold text-amber-900 block mb-1">ማብራሪያና ትንታኔ፡</span>
                  {q.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Action */}
      {!isSubmitted ? (
        <div className="pt-2 flex justify-end">
          <button
            onClick={handleSubmitExam}
            disabled={Object.keys(userAnswers).length === 0}
            className="px-6 py-3 rounded-xl bg-[#1E1B18] text-[#FAF6EC] hover:bg-[#38332D] disabled:opacity-40 font-bold text-sm shadow-[3px_3px_0px_0px_#A08C70] flex items-center gap-2 cursor-pointer"
          >
            <Award className="w-4 h-4 text-amber-400" />
            <span>ፈተናውን ጨርስና በAI ተገምግም</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      ) : null}
    </div>
  );
};
