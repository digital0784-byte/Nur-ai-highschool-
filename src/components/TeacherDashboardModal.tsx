import React, { useState, useEffect } from 'react';
import {
  X,
  Users,
  Search,
  BookOpen,
  Award,
  BarChart3,
  RefreshCw,
  GraduationCap,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Printer,
  FileText,
  UserCheck,
} from 'lucide-react';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { UserProfile, Grade, CourseProgressMap } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { getCurriculum } from '../data/curriculumData';

interface StudentDataWithProgress {
  profile: UserProfile;
  progressMap: CourseProgressMap;
  totalCompletedTopics: number;
  overallPercentage: number;
  lastActive?: string;
  quizCount: number;
  averageQuizScore?: number;
}

interface TeacherDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  teacherProfile: UserProfile;
}

export const TeacherDashboardModal: React.FC<TeacherDashboardModalProps> = ({
  isOpen,
  onClose,
  teacherProfile,
}) => {
  const { language } = useLanguage();
  const [students, setStudents] = useState<StudentDataWithProgress[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedGradeFilter, setSelectedGradeFilter] = useState<number | 'all'>('all');
  const [selectedStudent, setSelectedStudent] = useState<StudentDataWithProgress | null>(null);

  const curriculum = React.useMemo(() => getCurriculum(language), [language]);

  // Calculate total curriculum topics
  const totalCurriculumTopics = React.useMemo(() => {
    return curriculum.reduce((acc, sub) => acc + sub.topics.length, 0);
  }, [curriculum]);

  // Fetch all students and their progress from Firestore
  const fetchStudentsData = async () => {
    setIsLoading(true);
    try {
      const usersQuery = query(collection(db, 'users'), where('role', '==', 'student'));
      const snapshot = await getDocs(usersQuery);

      const studentsList: StudentDataWithProgress[] = [];

      for (const userDoc of snapshot.docs) {
        const studentProfile = userDoc.data() as UserProfile;
        let progressMap: CourseProgressMap = {};
        let quizCount = 0;
        let totalScoreSum = 0;

        try {
          const progressDocRef = doc(db, 'users', studentProfile.uid, 'progress', 'current');
          const progSnap = await getDoc(progressDocRef);
          if (progSnap.exists()) {
            const data = progSnap.data();
            progressMap = (data.progressMap || {}) as CourseProgressMap;
          }

          // Count completed topics & quizzes
          let completedTopics = 0;
          for (const item of Object.values(progressMap)) {
            if (item.lessonCompleted && item.flashcardsCompleted && item.quizCompleted) {
              completedTopics += 1;
            }
            if (item.quizCompleted) {
              quizCount += 1;
              totalScoreSum += (item.quizScore || 0) / (item.quizTotal || 1);
            }
          }

          const percentage = totalCurriculumTopics > 0
            ? Math.min(100, Math.round((completedTopics / totalCurriculumTopics) * 100))
            : 0;

          const avgScore = quizCount > 0 ? Math.round((totalScoreSum / quizCount) * 100) : undefined;

          studentsList.push({
            profile: studentProfile,
            progressMap,
            totalCompletedTopics: completedTopics,
            overallPercentage: percentage,
            quizCount,
            averageQuizScore: avgScore,
            lastActive: studentProfile.updatedAt || studentProfile.createdAt,
          });
        } catch (err) {
          console.warn('Could not fetch student progress:', err);
          studentsList.push({
            profile: studentProfile,
            progressMap: {},
            totalCompletedTopics: 0,
            overallPercentage: 0,
            quizCount: 0,
            lastActive: studentProfile.createdAt,
          });
        }
      }

      setStudents(studentsList);
    } catch (e) {
      console.error('Failed to fetch students in teacher dashboard:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchStudentsData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Filter students based on search and grade
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.profile.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.profile.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGrade =
      selectedGradeFilter === 'all' || s.profile.grade === selectedGradeFilter;
    return matchesSearch && matchesGrade;
  });

  // Calculate summary metrics
  const totalStudentsCount = students.length;
  const avgOverallPercentage =
    totalStudentsCount > 0
      ? Math.round(students.reduce((acc, s) => acc + s.overallPercentage, 0) / totalStudentsCount)
      : 0;
  const totalQuizzesAttempted = students.reduce((acc, s) => acc + s.quizCount, 0);

  return (
    <div
      id="teacher-dashboard-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-[#1E1B18]/75 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="teacher-dashboard-container"
        className="w-full max-w-5xl max-h-[92vh] flex flex-col bg-[#FAF6EC] border-[2px] border-[#38332D] shadow-2xl rounded-xl overflow-hidden text-[#1E1B18]"
      >
        {/* Modal Header */}
        <div className="bg-[#1D4ED8] text-white px-4 sm:px-6 py-4 flex items-center justify-between border-b-[2px] border-[#1E3A8A]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center text-white border border-white/30">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-xl font-bold font-serif-ethiopic tracking-tight">
                  የተማሪዎች ዳሽቦርድ (Students Dashboard)
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-900/40 text-blue-100 border border-blue-300/40">
                  መምህር፡ {teacherProfile.displayName}
                </span>
              </div>
              <p className="text-xs text-blue-100 font-serif-ethiopic">
                የተማሪዎችን የትምህርት እድገት፣ የፈተና ውጤት እና የጥናት ታሪክ መከታተያ
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchStudentsData}
              disabled={isLoading}
              className="p-2 text-white hover:bg-blue-800 rounded-lg transition-colors cursor-pointer"
              title="ዳታ አድስ (Refresh Data)"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button
              id="teacher-dashboard-close-btn"
              onClick={onClose}
              className="p-2 text-white hover:bg-blue-800 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Top Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-[#EDE5D2] border border-[#38332D]/30 rounded-lg p-3.5 space-y-1">
              <span className="text-[11px] font-bold font-serif-ethiopic text-[#665C4D] flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#1D4ED8]" />
                <span>የተመዘገቡ ተማሪዎች</span>
              </span>
              <div className="text-xl sm:text-2xl font-bold font-mono text-[#1E1B18]">
                {totalStudentsCount}
              </div>
              <span className="text-[10px] text-[#7A6E5C]">በFirestore የተመዘገቡ</span>
            </div>

            <div className="bg-[#EDE5D2] border border-[#38332D]/30 rounded-lg p-3.5 space-y-1">
              <span className="text-[11px] font-bold font-serif-ethiopic text-[#665C4D] flex items-center gap-1.5">
                <BarChart3 className="w-3.5 h-3.5 text-emerald-700" />
                <span>አማካይ እድገት</span>
              </span>
              <div className="text-xl sm:text-2xl font-bold font-mono text-[#1E1B18]">
                {avgOverallPercentage}%
              </div>
              <span className="text-[10px] text-[#7A6E5C]">የኮርስ ማጠናቀቂያ መጠን</span>
            </div>

            <div className="bg-[#EDE5D2] border border-[#38332D]/30 rounded-lg p-3.5 space-y-1">
              <span className="text-[11px] font-bold font-serif-ethiopic text-[#665C4D] flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-amber-700" />
                <span>የተወሰዱ ፈተናዎች</span>
              </span>
              <div className="text-xl sm:text-2xl font-bold font-mono text-[#1E1B18]">
                {totalQuizzesAttempted}
              </div>
              <span className="text-[10px] text-[#7A6E5C]">የኩዊዝ ሙከራዎች ድምር</span>
            </div>

            <div className="bg-[#EDE5D2] border border-[#38332D]/30 rounded-lg p-3.5 space-y-1">
              <span className="text-[11px] font-bold font-serif-ethiopic text-[#665C4D] flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-purple-700" />
                <span>የትምህርት ክፍሎች</span>
              </span>
              <div className="text-xl sm:text-2xl font-bold font-mono text-[#1E1B18]">
                ክፍል 9 - 12
              </div>
              <span className="text-[10px] text-[#7A6E5C]">ሁለተኛ ደረጃ ሥርዓተ-ትምህርት</span>
            </div>
          </div>

          {/* Search and Filters Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#EAE2CE] p-3 rounded-lg border border-[#38332D]/30">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#7A6E5C] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ተማሪ በስም ወይም በኢሜይል ፈልግ (Search student)..."
                className="w-full pl-9 pr-3 py-1.5 bg-white border border-[#38332D]/40 rounded-md text-xs font-serif-ethiopic focus:outline-none focus:border-[#1D4ED8]"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto">
              <span className="text-xs font-bold font-serif-ethiopic text-[#5A5143] whitespace-nowrap">
                ክፍል፡
              </span>
              <button
                onClick={() => setSelectedGradeFilter('all')}
                className={`px-2.5 py-1 text-xs font-bold rounded cursor-pointer transition-colors ${
                  selectedGradeFilter === 'all'
                    ? 'bg-[#38332D] text-[#FAF6EC]'
                    : 'bg-[#DDD3BD] text-[#4A4237] hover:bg-[#D0C4A9]'
                }`}
              >
                ሁሉም (All)
              </button>
              {([9, 10, 11, 12] as Grade[]).map((g) => (
                <button
                  key={g}
                  onClick={() => setSelectedGradeFilter(g)}
                  className={`px-2.5 py-1 text-xs font-bold rounded cursor-pointer transition-colors ${
                    selectedGradeFilter === g
                      ? 'bg-[#1D4ED8] text-white'
                      : 'bg-[#DDD3BD] text-[#4A4237] hover:bg-[#D0C4A9]'
                  }`}
                >
                  ክፍል {g}
                </button>
              ))}
            </div>
          </div>

          {/* Students List or Empty State */}
          {isLoading ? (
            <div className="p-12 text-center space-y-3">
              <RefreshCw className="w-8 h-8 text-[#1D4ED8] animate-spin mx-auto" />
              <p className="text-sm font-serif-ethiopic text-[#665C4D]">
                የተማሪዎች ዳታ ከFirestore በመጫን ላይ (Loading student records)...
              </p>
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="p-12 text-center bg-[#EDE5D2] rounded-xl border border-dashed border-[#38332D]/40 space-y-3">
              <UserCheck className="w-10 h-10 text-[#8C806D] mx-auto" />
              <h3 className="text-base font-bold font-serif-ethiopic text-[#2E2820]">
                ምንም ተማሪ አልተገኘም (No students found)
              </h3>
              <p className="text-xs text-[#665C4D] max-w-md mx-auto font-serif-ethiopic leading-relaxed">
                በዚህ ክፍል ውስጥ የተመዘገበ ተማሪ እስካሁን የለም። ተማሪዎች አካውንት ሲፈጥሩና ትምህርት ሲጀምሩ እድገታቸው እዚህ በራስ-ሰር ይዘረዘራል።
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold font-serif-ethiopic text-[#5A5143]">
                  የተገኙ ተማሪዎች ዝርዝር ({filteredStudents.length})
                </span>
                <span className="text-[11px] text-[#7A6E5C]">
                  የአንድ ተማሪ ዝርዝር ለማየት ስሙን ይጫኑ
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredStudents.map((student) => {
                  const p = student.profile;
                  const isSelected = selectedStudent?.profile.uid === p.uid;

                  return (
                    <div
                      key={p.uid}
                      onClick={() => setSelectedStudent(student)}
                      className={`p-4 rounded-xl border-[1.5px] transition-all cursor-pointer bg-white hover:shadow-md ${
                        isSelected
                          ? 'border-[#1D4ED8] ring-2 ring-blue-300'
                          : 'border-[#38332D]/30 hover:border-[#38332D]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-10 h-10 rounded-full bg-[#EAE2CE] text-[#38332D] border border-[#38332D]/40 flex items-center justify-center font-bold text-sm">
                            {p.displayName.slice(0, 1).toUpperCase()}
                          </div>
                          <div>
                            <h4 className="font-bold text-sm text-[#1E1B18] font-serif-ethiopic">
                              {p.displayName}
                            </h4>
                            <p className="text-[11px] text-[#665C4D] font-mono">{p.email}</p>
                          </div>
                        </div>

                        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300 shrink-0">
                          ክፍል {p.grade || 9}
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-1.5 pt-1 border-t border-[#EFE8D6]">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-[#665C4D] font-serif-ethiopic text-[11px]">
                            የኮርስ እድገት (Progress):
                          </span>
                          <span className="font-bold font-mono text-[#1E1B18]">
                            {student.overallPercentage}%
                          </span>
                        </div>
                        <div className="h-2 w-full bg-[#EDE5D2] rounded-full overflow-hidden border border-[#38332D]/20">
                          <div
                            className="h-full bg-emerald-600 transition-all duration-300"
                            style={{ width: `${student.overallPercentage}%` }}
                          />
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-[#7A6E5C] pt-1">
                          <span>
                            ያጠናቀቃቸው ርዕሶች፡ <strong>{student.totalCompletedTopics}</strong>
                          </span>
                          <span>
                            ኩዊዝ፡ <strong>{student.quizCount} ተወስዷል</strong>
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Student Detailed Breakdown Drawer (When a student is clicked) */}
          {selectedStudent && (
            <div className="mt-6 p-4 sm:p-5 bg-white border-[2px] border-[#1D4ED8] rounded-xl space-y-4 animate-in slide-in-from-bottom-3 duration-200">
              <div className="flex items-center justify-between border-b border-[#EAE2CE] pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-[#1D4ED8] flex items-center justify-center font-bold">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-[#1E1B18] font-serif-ethiopic">
                      {selectedStudent.profile.displayName} — የተማሪው የትምህርት ዝርዝር
                    </h3>
                    <p className="text-xs text-[#665C4D]">
                      ኢሜይል፡ {selectedStudent.profile.email} | ክፍል፡ {selectedStudent.profile.grade || 9}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.print()}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#FAF6EC] hover:bg-[#EDE5D2] border border-[#38332D] text-xs font-bold font-serif-ethiopic cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>ሪፖርት አትም</span>
                  </button>
                  <button
                    onClick={() => setSelectedStudent(null)}
                    className="p-1 text-[#665C4D] hover:text-[#1E1B18] cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Subject by Subject breakdown */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#665C4D] font-serif-ethiopic">
                  የትምህርት ዓይነቶች ዝርዝር ሁኔታ (Subject Breakdown):
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {curriculum.map((sub) => {
                    const completedInSub = sub.topics.filter((top) => {
                      const item = selectedStudent.progressMap[top.id];
                      return item && item.lessonCompleted && item.flashcardsCompleted && item.quizCompleted;
                    }).length;

                    const subPct = sub.topics.length > 0
                      ? Math.round((completedInSub / sub.topics.length) * 100)
                      : 0;

                    return (
                      <div
                        key={sub.id}
                        className="p-3 bg-[#FAF6EC] border border-[#38332D]/30 rounded-lg space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs font-serif-ethiopic text-[#2E2820]">
                            {sub.name}
                          </span>
                          <span className="text-[11px] font-mono font-bold text-[#1D4ED8]">
                            {subPct}%
                          </span>
                        </div>

                        <div className="h-1.5 w-full bg-[#E5DCC9] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-600"
                            style={{ width: `${subPct}%` }}
                          />
                        </div>

                        <div className="text-[10px] text-[#7A6E5C] flex justify-between">
                          <span>
                            ያጠናቀቃቸው፡ {completedInSub}/{sub.topics.length} ርዕሶች
                          </span>
                          <span>
                            {subPct === 100 ? (
                              <span className="text-emerald-700 font-bold">ተጠናቋል ✓</span>
                            ) : (
                              'በሂደት ላይ'
                            )}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-[#EDE5D2] px-4 sm:px-6 py-3 border-t border-[#38332D]/30 flex items-center justify-between text-xs">
          <span className="text-[#665C4D] font-serif-ethiopic">
            የኢትዮጵያ ሁለተኛ ደረጃ ትምህርት — የመምህራን የመረጃ ማዕከል
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#38332D] hover:bg-[#24211E] text-white font-bold rounded-lg cursor-pointer transition-colors"
          >
            ዝጋ (Close)
          </button>
        </div>
      </div>
    </div>
  );
};
