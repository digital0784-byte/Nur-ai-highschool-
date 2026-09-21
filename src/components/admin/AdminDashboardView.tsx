import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  HelpCircle,
  CreditCard,
  BarChart3,
  Settings,
  ShieldCheck,
  CheckCircle2,
  Bell,
  RefreshCw,
  Search,
  Menu,
  X,
  Phone,
  Mail,
  Lock,
  Layers,
  Sparkles,
  ArrowUpRight,
  TrendingUp,
  FileText,
  ShieldAlert,
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

// ERP Core Sections
import { AdminOverviewSection } from './AdminOverviewSection';
import { AdminStudentsSection } from './AdminStudentsSection';
import { AdminCurriculumSection } from './AdminCurriculumSection';
import { AdminBookManagementSection } from './AdminBookManagementSection';
import { AdminQuestionBankSection } from './AdminQuestionBankSection';
import { AdminPaymentDashboardSection } from './AdminPaymentDashboardSection';
import { AdminRevenueAnalyticsSection } from './AdminRevenueAnalyticsSection';
import { AdminSettingsSection } from './AdminSettingsSection';

// Detailed secondary modules for drilldown
import { AdminAssessmentsSection } from './AdminAssessmentsSection';
import { AdminRAGAnalyticsSection } from './AdminRAGAnalyticsSection';
import { AdminSecurityDashboard } from './AdminSecurityDashboard';
import { AdminSubscriptionsSection } from './AdminSubscriptionsSection';
import { AdminPricingManagementSection } from './AdminPricingManagementSection';
import { AdminPaymentMethodsSection } from './AdminPaymentMethodsSection';
import { AdminReportsSection } from './AdminReportsSection';
import { AdminPaymentAuditLogsSection } from './AdminPaymentAuditLogsSection';
import { AdminVoiceAnalyticsSection } from './AdminVoiceAnalyticsSection';
import { AdminResearchSourcesSection } from './AdminResearchSourcesSection';
import { AdminNotificationsSection } from './AdminNotificationsSection';
import { AdminParentsSection } from './AdminParentsSection';
import { AdminClassesSection } from './AdminClassesSection';
import { AdminE2ESimulationSection } from './AdminE2ESimulationSection';

export const AdminDashboardView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminActiveSubTab>('overview');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Core Data States
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

  // The 8 Primary ERP Institutional Sections
  const primaryNavItems: { id: AdminActiveSubTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: 'overview',
      label: 'Overview / Dashboard',
      icon: <LayoutDashboard className="w-4 h-4 text-emerald-400" />,
    },
    {
      id: 'students',
      label: 'Student Management',
      icon: <Users className="w-4 h-4 text-blue-400" />,
      badge: `${students.length || 34}`,
    },
    {
      id: 'curriculum',
      label: 'Curriculum Management',
      icon: <Layers className="w-4 h-4 text-indigo-400" />,
      badge: '2019 E.C.',
    },
    {
      id: 'books',
      label: 'Book Management',
      icon: <BookOpen className="w-4 h-4 text-amber-400" />,
      badge: 'DRM Active',
    },
    {
      id: 'question_bank',
      label: 'Question Bank',
      icon: <HelpCircle className="w-4 h-4 text-emerald-400" />,
      badge: '2.4k Qs',
    },
    {
      id: 'finance',
      label: 'Subscription & Finance',
      icon: <CreditCard className="w-4 h-4 text-teal-400" />,
      badge: 'CBE/Telebirr',
    },
    {
      id: 'analytics',
      label: 'Analytics & Telemetry',
      icon: <BarChart3 className="w-4 h-4 text-purple-400" />,
    },
    {
      id: 'settings',
      label: 'Settings & Security',
      icon: <ShieldCheck className="w-4 h-4 text-rose-400" />,
    },
  ];

  return (
    <div className="min-h-[88vh] flex flex-col bg-stone-100/60 rounded-3xl overflow-hidden border border-stone-200/90 shadow-sm mt-2">
      {/* 1. TOP EXECUTIVE OPERATIONAL BAR */}
      <header className="bg-stone-900 text-white px-5 py-3.5 border-b border-stone-800 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
            className="md:hidden p-1.5 rounded-lg bg-stone-800 text-white cursor-pointer"
          >
            {isMobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold shadow-xs">
            <ShieldCheck className="w-5 h-5" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-sm tracking-wide text-white">NUR AI SCHOOL ERP</span>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-md bg-emerald-950 text-emerald-400 border border-emerald-800/80 text-[10px] font-mono font-bold">
                OPERATIONAL v4.2
              </span>
            </div>
            <p className="text-[11px] text-stone-400 font-serif-ethiopic">
              የኢ.ፌ.ዲ.ሪ አዲሱ ሥርዓተ-ትምህርት • 2019 ዓ.ም
            </p>
          </div>
        </div>

        {/* Super Admin Credential & Action Header */}
        <div className="flex items-center gap-3">
          {/* Super Admin Badge */}
          <div className="hidden lg:flex items-center gap-2.5 bg-stone-800/90 border border-stone-700/80 px-3 py-1.5 rounded-xl text-xs">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <div className="text-right">
              <div className="font-bold text-white text-[11px] leading-tight">
                Nuriye Ahmed Adem
              </div>
              <div className="text-[10px] text-stone-400 font-mono">
                SUPER ADMIN (ብቸኛ ባለቤት)
              </div>
            </div>
          </div>

          <button
            onClick={loadAllData}
            title="Refresh ERP Data"
            className="p-2 rounded-xl bg-stone-800 text-stone-300 hover:text-white hover:bg-stone-700 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </header>

      {/* 2. MAIN BODY (SIDEBAR + CONTENT CANVAS) */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Modern ERP Sidebar */}
        <aside
          className={`${
            isMobileNavOpen ? 'block' : 'hidden'
          } md:block w-full md:w-64 bg-stone-900 text-stone-300 p-4 border-r border-stone-800 shrink-0 flex flex-col justify-between overflow-y-auto max-h-[85vh]`}
        >
          <div>
            <div className="text-[11px] font-mono font-bold text-stone-500 uppercase tracking-wider px-3 mb-2">
              INSTITUTIONAL MODULES
            </div>

            <nav className="space-y-1">
              {primaryNavItems.map((item) => {
                const isActive =
                  activeTab === item.id ||
                  (item.id === 'finance' &&
                    ['payments_billing', 'subscriptions', 'pricing_management', 'payment_methods', 'payment_audit_logs'].includes(
                      activeTab
                    )) ||
                  (item.id === 'analytics' &&
                    ['revenue_analytics', 'rag_analytics', 'voice_tutor_analytics', 'reports'].includes(
                      activeTab
                    )) ||
                  (item.id === 'settings' &&
                    ['security_rbac', 'research_sources', 'notifications'].includes(activeTab));

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsMobileNavOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      isActive
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
                          isActive
                            ? 'bg-emerald-800 text-emerald-100'
                            : 'bg-stone-800 text-stone-400'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Sidebar Footer: Sole Super Admin Contact */}
          <div className="pt-4 mt-4 border-t border-stone-800 text-[11px] text-stone-500 space-y-2 shrink-0">
            <div className="p-3 rounded-2xl bg-stone-800/80 border border-stone-700/60 text-stone-300 space-y-1.5">
              <div className="flex items-center gap-1.5 text-amber-400 font-bold text-xs">
                <ShieldCheck className="w-4 h-4" />
                <span>Nuriye Ahmed Adem</span>
              </div>
              <div className="text-[10px] text-stone-400">Sole System Owner & Super Admin</div>
              <div className="pt-1 space-y-1">
                <a
                  href="tel:0910097862"
                  className="flex items-center gap-1.5 text-[11px] text-stone-300 hover:text-emerald-400 transition-colors"
                >
                  <Phone className="w-3 h-3 text-stone-500" />
                  <span>0910097862</span>
                </a>
                <a
                  href="mailto:mejennur669@gmail.com"
                  className="flex items-center gap-1.5 text-[11px] text-stone-300 hover:text-emerald-400 transition-colors truncate"
                >
                  <Mail className="w-3 h-3 text-stone-500 shrink-0" />
                  <span className="truncate">mejennur669@gmail.com</span>
                </a>
              </div>
            </div>

            <div className="flex items-center justify-between text-[10px] px-1 pt-1">
              <span>Status: Protected</span>
              <span className="text-emerald-400 font-mono font-bold">● Active</span>
            </div>
          </div>
        </aside>

        {/* 3. ERP CONTENT AREA */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-h-[85vh] bg-stone-50/50">
          {/* 1. OVERVIEW / DASHBOARD */}
          {activeTab === 'overview' && (
            <AdminOverviewSection
              stats={stats}
              onNavigateTab={(tab) => setActiveTab(tab)}
            />
          )}

          {/* 2. STUDENT MANAGEMENT */}
          {activeTab === 'students' && (
            <AdminStudentsSection students={students} onRefresh={loadAllData} />
          )}

          {/* 3. CURRICULUM MANAGEMENT */}
          {activeTab === 'curriculum' && (
            <AdminCurriculumSection metadataList={curriculum} />
          )}

          {/* 4. BOOK MANAGEMENT */}
          {activeTab === 'books' && <AdminBookManagementSection />}

          {/* 5. QUESTION BANK */}
          {activeTab === 'question_bank' && <AdminQuestionBankSection />}

          {/* 6. SUBSCRIPTION & FINANCE */}
          {(activeTab === 'finance' || activeTab === 'payments_billing') && (
            <AdminPaymentDashboardSection />
          )}

          {/* Sub-tabs under Finance if navigated */}
          {activeTab === 'subscriptions' && <AdminSubscriptionsSection />}
          {activeTab === 'pricing_management' && <AdminPricingManagementSection />}
          {activeTab === 'payment_methods' && <AdminPaymentMethodsSection />}
          {activeTab === 'payment_audit_logs' && <AdminPaymentAuditLogsSection />}

          {/* 7. ANALYTICS & TELEMETRY */}
          {(activeTab === 'analytics' || activeTab === 'revenue_analytics') && (
            <AdminRevenueAnalyticsSection />
          )}
          {activeTab === 'voice_tutor_analytics' && <AdminVoiceAnalyticsSection />}
          {activeTab === 'rag_analytics' && <AdminRAGAnalyticsSection />}
          {activeTab === 'reports' && <AdminReportsSection />}

          {/* 8. SETTINGS & SECURITY */}
          {activeTab === 'settings' && <AdminSettingsSection />}
          {activeTab === 'security_rbac' && <AdminSecurityDashboard />}
          {activeTab === 'research_sources' && <AdminResearchSourcesSection />}
          {activeTab === 'notifications' && <AdminNotificationsSection />}

          {/* Supplementary modules */}
          {activeTab === 'assessments' && (
            <AdminAssessmentsSection
              quizzes={quizzes}
              exams={exams}
              onRefresh={loadAllData}
            />
          )}
          {activeTab === 'classes' && (
            <AdminClassesSection classes={classes} onRefresh={loadAllData} />
          )}
          {activeTab === 'parents' && <AdminParentsSection />}
          {activeTab === 'e2e_verification' && <AdminE2ESimulationSection />}
        </main>
      </div>
    </div>
  );
};
