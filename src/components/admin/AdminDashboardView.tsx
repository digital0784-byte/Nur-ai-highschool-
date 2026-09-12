import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  Settings,
  Bell,
  CheckCircle2,
  Brain,
  ShieldCheck,
  Layers,
  Award,
  Sparkles,
  Menu,
  X,
  RefreshCw,
  CreditCard,
  TrendingUp,
  FileText,
  ShieldAlert,
  Tag,
} from 'lucide-react';
import {
  AdminActiveSubTab,
  AdminDashboardStats,
  ClassGroup,
  CurriculumMetadata,
  AssessmentQuiz,
  AssessmentExam,
} from '../../types/adminDashboard';
import { UserProfile } from '../../types';
import { adminFirestoreService } from '../../services/adminFirestore';

// Sections
import { AdminOverviewSection } from './AdminOverviewSection';
import { AdminStudentsSection } from './AdminStudentsSection';
import { AdminTeachersSection } from './AdminTeachersSection';
import { AdminParentsSection } from './AdminParentsSection';
import { AdminClassesSection } from './AdminClassesSection';
import { AdminCurriculumSection } from './AdminCurriculumSection';
import { AdminAssessmentsSection } from './AdminAssessmentsSection';
import { AITeacherAssistantSection } from './AITeacherAssistantSection';
import { AdminRAGAnalyticsSection } from './AdminRAGAnalyticsSection';
import { AdminSettingsSection } from './AdminSettingsSection';
import { AdminE2ESimulationSection } from './AdminE2ESimulationSection';
import { AdminNotificationsSection } from './AdminNotificationsSection';
import { AdminSecurityDashboard } from './AdminSecurityDashboard';
import { AdminPaymentDashboardSection } from './AdminPaymentDashboardSection';
import { AdminSubscriptionsSection } from './AdminSubscriptionsSection';
import { AdminPricingManagementSection } from './AdminPricingManagementSection';
import { AdminPaymentMethodsSection } from './AdminPaymentMethodsSection';
import { AdminRevenueAnalyticsSection } from './AdminRevenueAnalyticsSection';
import { AdminReportsSection } from './AdminReportsSection';
import { AdminPaymentAuditLogsSection } from './AdminPaymentAuditLogsSection';

export const AdminDashboardView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminActiveSubTab>('overview');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Data states
  const [stats, setStats] = useState<AdminDashboardStats>({
    totalStudents: 34,
    totalTeachers: 12,
    totalParents: 28,
    totalClasses: 6,
    totalTextbooks: 18,
    totalQuizzes: 4,
    totalExams: 3,
    activeEnrollments: 34,
    aiRequestsTotal: 284,
    aiSuccessRate: 98.6,
  });
  const [students, setStudents] = useState<UserProfile[]>([]);
  const [classes, setClasses] = useState<ClassGroup[]>([]);
  const [quizzes, setQuizzes] = useState<AssessmentQuiz[]>([]);
  const [exams, setExams] = useState<AssessmentExam[]>([]);
  const [curriculum, setCurriculum] = useState<CurriculumMetadata[]>([]);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [statsData, studentsData, classesData, quizzesData, examsData, curData] =
        await Promise.all([
          adminFirestoreService.getDashboardStats(),
          adminFirestoreService.getStudents(),
          adminFirestoreService.getClasses(),
          adminFirestoreService.getAssessmentQuizzes(),
          adminFirestoreService.getAssessmentExams(),
          adminFirestoreService.getCurriculumMetadata(),
        ]);

      setStats(statsData);
      setStudents(studentsData);
      setClasses(classesData);
      setQuizzes(quizzesData);
      setExams(examsData);
      setCurriculum(curData);
    } catch (err) {
      console.error('Error loading admin dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const navItems: { id: AdminActiveSubTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'overview', label: '1. አጠቃላይ ዳሽቦርድ (Overview)', icon: <LayoutDashboard className="w-4 h-4 text-emerald-400" /> },
    { id: 'students', label: '2. ተማሪዎች (Students)', icon: <Users className="w-4 h-4" />, badge: `${students.length}` },
    { id: 'payments_billing', label: '3. ክፍያዎች ማረጋገጫ (Payments)', icon: <CreditCard className="w-4 h-4 text-amber-400" />, badge: 'PART 15' },
    { id: 'subscriptions', label: '4. ሳብስክሪፕሽን (Subscriptions)', icon: <CreditCard className="w-4 h-4 text-blue-400" /> },
    { id: 'pricing_management', label: '5. የዋጋ ቅንብር (Pricing Config)', icon: <Tag className="w-4 h-4 text-emerald-400" /> },
    { id: 'payment_methods', label: '6. የክፍያ መንገዶች (Payment Methods)', icon: <CreditCard className="w-4 h-4 text-amber-400" /> },
    { id: 'revenue_analytics', label: '7. የገቢ ትንታኔ (Revenue Analytics)', icon: <TrendingUp className="w-4 h-4 text-teal-400" /> },
    { id: 'reports', label: '8. ኦፊሴላዊ ሪፖርቶች (Reports & Export)', icon: <FileText className="w-4 h-4 text-indigo-400" /> },
    { id: 'payment_audit_logs', label: '9. የኦዲት መዝገብ (Payment Audit Log)', icon: <ShieldAlert className="w-4 h-4 text-rose-400" /> },
    { id: 'notifications', label: '10. ማሳወቂያዎች (Notifications & Alerts)', icon: <Bell className="w-4 h-4 text-amber-300" />, badge: 'ALERTS' },
    { id: 'security_rbac', label: '11. ደህንነትና ቁጥጥር (Security Fortress)', icon: <ShieldCheck className="w-4 h-4 text-emerald-400" /> },
    { id: 'teachers', label: 'መምህራን (Teachers)', icon: <GraduationCap className="w-4 h-4" />, badge: '12' },
    { id: 'parents', label: 'ወላጆች (Parents)', icon: <Users className="w-4 h-4" />, badge: '28' },
    { id: 'classes', label: 'ክፍሎችና ሴክሽኖች (Classes)', icon: <Layers className="w-4 h-4" />, badge: `${classes.length}` },
    { id: 'curriculum', label: 'የስርዓተ-ትምህርት መጽሐፍት (Curriculum)', icon: <BookOpen className="w-4 h-4" />, badge: '18' },
    { id: 'assessments', label: 'ምዘናዎችና ፈተናዎች (Assessments)', icon: <Award className="w-4 h-4" /> },
    { id: 'ai_assistant', label: 'የ AI መምህር ረዳት (AI Teacher)', icon: <Sparkles className="w-4 h-4 text-amber-500" /> },
    { id: 'rag_analytics', label: 'AI & RAG ቁጥጥር (AI & RAG)', icon: <Brain className="w-4 h-4 text-teal-500" /> },
    { id: 'e2e_verification', label: 'ሙሉ ፈተና (E2E Test)', icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" /> },
    { id: 'settings', label: 'ቅንብሮች (Settings)', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-[85vh] flex flex-col md:flex-row bg-stone-100/60 rounded-3xl overflow-hidden border border-stone-200/80 shadow-sm mt-2">
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-stone-900 text-white p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <span className="font-bold text-xs">NUR AI School Administration</span>
        </div>
        <button
          onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
          className="p-1.5 rounded-lg bg-stone-800 text-white cursor-pointer"
        >
          {isMobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`${
          isMobileNavOpen ? 'block' : 'hidden'
        } md:block w-full md:w-64 bg-stone-900 text-stone-300 p-4 border-r border-stone-800 shrink-0 flex flex-col justify-between overflow-y-auto max-h-[85vh]`}
      >
        <div>
          {/* Brand Header */}
          <div className="hidden md:flex items-center gap-2.5 pb-4 mb-3 border-b border-stone-800">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-white text-xs tracking-wide uppercase">
                SUPER_ADMIN Portal
              </div>
              <div className="text-[10px] text-stone-400 font-serif-ethiopic">
                NUR AI High School
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsMobileNavOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === item.id
                    ? 'bg-emerald-600 text-white font-bold shadow-xs'
                    : 'text-stone-400 hover:text-white hover:bg-stone-800/70'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  {item.icon}
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`px-1.5 py-0.2 rounded-md text-[10px] font-mono ${
                      activeTab === item.id
                        ? 'bg-emerald-800 text-emerald-100'
                        : 'bg-stone-800 text-stone-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="pt-4 mt-4 border-t border-stone-800 text-[11px] text-stone-500 space-y-2 shrink-0">
          <div className="flex items-center justify-between">
            <span>Academic Year</span>
            <span className="text-stone-300 font-bold">2017 E.C.</span>
          </div>
          <div className="flex items-center justify-between">
            <span>MoE Curriculum</span>
            <span className="text-emerald-400 font-bold">Grades 9–12</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-h-[85vh]">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-3">
            <RefreshCw className="w-7 h-7 text-emerald-600 animate-spin" />
            <div className="text-xs text-stone-500 font-serif-ethiopic">
              የዳሽቦርድ መረጃዎች በመጫን ላይ ናቸው...
            </div>
          </div>
        ) : (
          <>
            {activeTab === 'overview' && (
              <AdminOverviewSection stats={stats} onNavigateTab={setActiveTab} />
            )}
            {activeTab === 'students' && (
              <AdminStudentsSection students={students} onRefresh={loadAllData} />
            )}
            {activeTab === 'payments_billing' && <AdminPaymentDashboardSection />}
            {activeTab === 'subscriptions' && <AdminSubscriptionsSection />}
            {activeTab === 'pricing_management' && <AdminPricingManagementSection />}
            {activeTab === 'payment_methods' && <AdminPaymentMethodsSection />}
            {activeTab === 'revenue_analytics' && <AdminRevenueAnalyticsSection />}
            {activeTab === 'reports' && <AdminReportsSection />}
            {activeTab === 'payment_audit_logs' && <AdminPaymentAuditLogsSection />}
            {activeTab === 'notifications' && <AdminNotificationsSection />}
            {activeTab === 'security_rbac' && <AdminSecurityDashboard />}
            {activeTab === 'teachers' && <AdminTeachersSection />}
            {activeTab === 'parents' && <AdminParentsSection />}
            {activeTab === 'classes' && (
              <AdminClassesSection classes={classes} onRefresh={loadAllData} />
            )}
            {activeTab === 'curriculum' && (
              <AdminCurriculumSection metadataList={curriculum} />
            )}
            {activeTab === 'assessments' && (
              <AdminAssessmentsSection
                quizzes={quizzes}
                exams={exams}
                onRefresh={loadAllData}
              />
            )}
            {activeTab === 'ai_assistant' && <AITeacherAssistantSection />}
            {activeTab === 'rag_analytics' && <AdminRAGAnalyticsSection />}
            {activeTab === 'e2e_verification' && <AdminE2ESimulationSection />}
            {activeTab === 'settings' && <AdminSettingsSection />}
          </>
        )}
      </main>
    </div>
  );
};
