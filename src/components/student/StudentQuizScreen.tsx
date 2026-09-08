import React, { useState, useEffect } from 'react';
import {
  Award,
  Sparkles,
  CheckCircle,
  XCircle,
  Clock,
  BookMarked,
  ArrowRight,
  RefreshCw,
  Loader2,
  Check,
  AlertTriangle,
} from 'lucide-react';
import { GradeLevel, CurriculumSubjectItem } from '../../types/curriculumEngine';
import { LanguageCode } from '../../types';
import { StudentTopicMastery, StudentRecommendationItem } from '../../types/studentApp';
import { ethiopianCurriculumEngine } from '../../engine/curriculumRegistry';
import { studentAppFirestore } from '../../services/studentAppFirestore';
import { aiTutorEngine } from '../../engine/aiTutorEngine';

interface StudentQuizScreenProps {
  grade: GradeLevel;
  language: LanguageCode;
  darkMode: boolean;
  onContinueLearning: (subjectId: string, topicId: string) => void;
}

interface QuizItem {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  textbookPage: number;
  unit: number;
}

export const StudentQuizScreen: React.FC<StudentQuizScreenProps> = ({
  grade,
  language,
  darkMode,
  onContinueLearning,
}) => {
  const subjects = ethiopianCurriculumEngine.getSubjectsByGrade(grade);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(subjects[0]?.id || 'math-g9');
  const [selectedUnitNumber, setSelectedUnitNumber] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<QuizItem[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [recommendations, setRecommendations] = useState<StudentRecommendationItem[]>([]);

  const currentSubject = subjects.find((s) => s.id === selectedSubjectId) || subjects[0];

  useEffect(() => {
    generateCurriculumQuiz();
  }, [selectedSubjectId, selectedUnitNumber, grade]);

  const generateCurriculumQuiz = () => {
    setLoading(true);
    setIsSubmitted(false);
    setSelectedAnswers({});
    setScore(null);
    setRecommendations([]);

    // Generate from curriculum engine question bank & unit topics
    const unit = currentSubject?.units.find((u) => u.unitNumber === selectedUnitNumber) || currentSubject?.units[0];
    const generated: QuizItem[] = [];

    unit?.sections.forEach((s) => {
      s.lessons.forEach((l) => {
        l.topics.forEach((t, tIdx) => {
          if (generated.length < 5) {
            generated.push({
              id: generated.length + 1,
              question: `በክፍል ${grade} ${currentSubject.name[language] || currentSubject.name.en} ምዕራፍ ${unit.unitNumber} ውስጥ "${t.title[language] || t.title.en}" በሚመለከት ዋናው ነጥብ የትኛው ነው?`,
              options: [
                t.explanations.coreConcepts[0] || 'መሰረታዊ የስርዓተ-ትምህርት ፅንሰ-ሀሳብ',
                'ከተጠቀሰው ርዕስ ጋር የማይገናኝ ሀሰተኛ መረጃ',
                'የስሌቱ ተቃራኒ የሆነ የቁጥር ውጤት',
                'ምንም ትክክለኛ ምላሽ የለም',
              ],
              correctIndex: 0,
              explanation: `በመማሪያ መጽሐፍ ገጽ ${t.textbookPage} መሰረት፡ ${t.explanations.overview}`,
              textbookPage: t.textbookPage,
              unit: unit.unitNumber,
            });
          }
        });
      });
    });

    setQuestions(generated);
    setLoading(false);
  };

  const handleSubmit = async () => {
    let correct = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) {
        correct += 1;
      }
    });

    const total = questions.length;
    const percentage = Math.round((correct / total) * 100);
    setScore(percentage);
    setIsSubmitted(true);

    // Record into student_mastery and quiz_attempts
    const targetTopicId = currentSubject?.units[0]?.sections[0]?.lessons[0]?.topics[0]?.id || 'topic-1';
    const topicTitle = `${currentSubject.name[language] || currentSubject.name.en} Unit ${selectedUnitNumber} Quiz`;

    const res = await studentAppFirestore.recordQuizResult(
      targetTopicId,
      topicTitle,
      selectedSubjectId,
      grade,
      correct,
      total,
      120
    );

    setRecommendations(res.recommendations);
  };

  const bgCard = darkMode ? 'bg-[#211F26] border-[#36343B]' : 'bg-white border-[#E6E0E9]';
  const textPrimary = darkMode ? 'text-[#E6E1E5]' : 'text-[#1D1B20]';
  const textSecondary = darkMode ? 'text-[#CAC4D0]' : 'text-[#49454F]';

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E6E0E9] dark:border-[#36343B]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase bg-purple-100 text-purple-900 dark:bg-purple-950 dark:text-purple-200">
            <Award className="w-3.5 h-3.5" />
            <span>የስርዓተ-ትምህርት መመዘኛ ፈተና (Curriculum Quiz Engine)</span>
          </div>
          <h1 className={`text-xl sm:text-2xl font-black ${textPrimary} mt-1`}>
            {currentSubject.name[language] || currentSubject.name.en} • ፈተና
          </h1>
        </div>

        {/* Action: Regenerate */}
        <button
          onClick={generateCurriculumQuiz}
          disabled={loading}
          className="px-4 py-2 rounded-full text-xs font-black bg-[#6750A4] text-white hover:bg-[#523e85] transition-all flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>አዲስ ፈተና አፍልቅ (Generate AI Quiz)</span>
        </button>
      </div>

      {/* Selectors: Subject & Unit */}
      <div className="flex flex-wrap items-center gap-3">
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

        {currentSubject?.units.length > 1 && (
          <div className="flex items-center gap-1">
            <span className="text-xs font-bold text-gray-500">ምዕራፍ፡</span>
            {currentSubject.units.map((u) => (
              <button
                key={u.id}
                onClick={() => setSelectedUnitNumber(u.unitNumber)}
                className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                  selectedUnitNumber === u.unitNumber
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                }`}
              >
                {u.unitNumber}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Questions Card */}
      <div className={`rounded-3xl p-6 sm:p-8 border-[1.5px] shadow-xs space-y-6 ${bgCard}`}>
        {loading ? (
          <div className="py-12 text-center space-y-2">
            <Loader2 className="w-8 h-8 animate-spin text-[#6750A4] mx-auto" />
            <p className="text-xs text-gray-500 font-bold">የፈተና ጥያቄዎችን ከመማሪያ መጽሐፉ በማዘጋጀት ላይ...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {questions.map((q, qIdx) => (
              <div key={q.id} className="space-y-3 pb-4 border-b border-gray-100 dark:border-gray-800 last:border-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 className={`text-xs sm:text-sm font-bold ${textPrimary}`}>
                    {qIdx + 1}. {q.question}
                  </h3>
                  <span className="text-[10px] text-gray-500 font-bold whitespace-nowrap">
                    ገጽ {q.textbookPage}
                  </span>
                </div>

                <div className="space-y-2">
                  {q.options.map((opt, optIdx) => {
                    const isSelected = selectedAnswers[qIdx] === optIdx;
                    const isCorrect = optIdx === q.correctIndex;

                    let btnStyle = darkMode
                      ? 'bg-[#2B2930] border-[#49454F] text-[#E6E1E5]'
                      : 'bg-white border-[#E6E0E9] text-[#1D1B20]';

                    if (isSelected) {
                      btnStyle = 'border-[#6750A4] bg-purple-50 dark:bg-purple-950/40 text-[#6750A4] font-black';
                    }

                    if (isSubmitted) {
                      if (isCorrect) {
                        btnStyle = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-black';
                      } else if (isSelected && !isCorrect) {
                        btnStyle = 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 font-black';
                      }
                    }

                    return (
                      <button
                        key={optIdx}
                        disabled={isSubmitted}
                        onClick={() => setSelectedAnswers({ ...selectedAnswers, [qIdx]: optIdx })}
                        className={`w-full text-left p-3.5 rounded-2xl border text-xs transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                      >
                        <span>{opt}</span>
                        {isSubmitted && isCorrect && <Check className="w-4 h-4 text-emerald-600" />}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation & Textbook Citation */}
                {isSubmitted && (
                  <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-[#1D1B20] border border-gray-200 dark:border-gray-800 text-xs space-y-1">
                    <p className="font-bold text-[#6750A4]">ማብራሪያ፡ {q.explanation}</p>
                    <span className="text-[10px] text-gray-500 flex items-center gap-1 font-mono">
                      <BookMarked className="w-3 h-3" />
                      የኢትዮጵያ አዲሱ ስርዓተ-ትምህርት የመማሪያ መጽሐፍ ገጽ {q.textbookPage}
                    </span>
                  </div>
                )}
              </div>
            ))}

            {/* Score & Adaptive Feedback Banner */}
            {isSubmitted && score !== null && (
              <div
                className={`p-6 rounded-3xl border space-y-3 ${
                  score >= 80
                    ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300'
                    : 'bg-rose-50 dark:bg-rose-950/30 border-rose-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {score >= 80 ? (
                      <CheckCircle className="w-6 h-6 text-emerald-600" />
                    ) : (
                      <AlertTriangle className="w-6 h-6 text-rose-600" />
                    )}
                    <div>
                      <h4 className="text-base font-black text-gray-900 dark:text-gray-100">
                        የፈተና ውጤትዎ፡ {score}% ({score >= 80 ? 'የተካነ / Mastered' : 'ክለሳ የሚሻ / Needs Revision'})
                      </h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        የእውቀት ደረጃዎና ምክሮች በራስ-ሰር ተዘምነዋል።
                      </p>
                    </div>
                  </div>
                  <span className="text-2xl font-black text-[#6750A4]">{score}%</span>
                </div>

                {recommendations.length > 0 && (
                  <div className="pt-2 border-t border-gray-200 dark:border-gray-700 space-y-2">
                    <span className="text-xs font-bold text-gray-800 dark:text-gray-200 block">
                      የኑር AI አዳፕቲቭ ምክሮች፡
                    </span>
                    {recommendations.map((r) => (
                      <div
                        key={r.id}
                        className="p-3 rounded-2xl bg-white dark:bg-[#211F26] border border-gray-200 dark:border-gray-800 flex items-center justify-between gap-3 text-xs"
                      >
                        <div>
                          <p className="font-bold">{r.topicTitle}</p>
                          <p className="text-[11px] text-gray-500">{r.reason}</p>
                        </div>
                        <button
                          onClick={() => onContinueLearning(r.subjectId, r.topicId)}
                          className="px-3 py-1.5 rounded-full text-xs font-bold bg-[#6750A4] text-white whitespace-nowrap cursor-pointer hover:bg-[#523e85]"
                        >
                          ጀምር
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Submit Button */}
            {!isSubmitted ? (
              <button
                onClick={handleSubmit}
                disabled={Object.keys(selectedAnswers).length < questions.length}
                className="w-full py-3 rounded-full text-xs font-black bg-[#6750A4] text-white hover:bg-[#523e85] transition-all cursor-pointer shadow-xs disabled:opacity-50"
              >
                መልሶችን አስረክብና ውጤትህን ተመልከት (Submit Quiz)
              </button>
            ) : (
              <button
                onClick={generateCurriculumQuiz}
                className="w-full py-3 rounded-full text-xs font-black bg-[#6750A4] text-white hover:bg-[#523e85] transition-all cursor-pointer shadow-xs"
              >
                ሌላ ፈተና ውሰድ (Take Another Quiz)
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
