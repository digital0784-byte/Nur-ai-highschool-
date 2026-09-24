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
  Activity,
  Brain,
  History,
  LogOut,
  Clock,
  Radio,
  Bot,
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
import { useAuth } from '../../context/AuthContext';
import { useSubscription } from '../../context/SubscriptionContext';
import { SUPER_ADMIN_EMAIL, DEVELOPER_INFO } from '../../services/subscriptionService';

// Dedicated Core ERP Modules
import { AdminAuthPortal } from './AdminAuthPortal';
import { AdminOverviewSection } from './AdminOverviewSection';
import { AdminStudentsSection } from './AdminStudentsSection';
import { AdminCurriculumSection } from './AdminCurriculumSection';
import { AdminBookManagementSection } from './AdminBookManagementSection';
import { AdminPaymentDashboardSection } from './AdminPaymentDashboardSection';
import { AdminSubscriptionsSection } from './AdminSubscriptionsSection';
import { AdminRAGAnalyticsSection } from './AdminRAGAnalyticsSection';
import { AdminNotificationsSection } from './AdminNotificationsSection';
import { AdminRevenueAnalyticsSection } from './AdminRevenueAnalyticsSection';
import { AdminSystemHealthSection } from './AdminSystemHealthSection';
import { AdminSecurityDashboard } from './AdminSecurityDashboard';
import { AdminAuditTrailSection } from './AdminAuditTrailSection';
import { AdminSettingsSection } from './AdminSettingsSection';
import { AdminQuestionBankSection } from './AdminQuestionBankSection';
import { AdminAIControlCenter } from './AdminAIControlCenter';
import { AdminAIAssignmentSection } from './AdminAIAssignmentSection';
import { AdminAIQuizGeneratorModal } from './AdminAIQuizGeneratorModal';
import { AdminAIAssistantChat } from './AdminAIAssistantChat';
import { AdminAutomatedReportsModal } from './AdminAutomatedReportsModal';
import { AdminFraudRiskAlertsSection } from './AdminFraudRiskAlertsSection';

export const AdminDashboardView: React.FC = () => {
  const { user, logout } = useAuth();
  const { isOwnerSuperAdmin } = useSubscription();

  const isVerifiedSuperAdmin =
    isOwnerSuperAdmin ||
    (user?.email && user.email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase());

  const [activeTab, setActiveTab] = useState<AdminActiveSubTab>('overview');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Session Security Timer (30 minutes)
  const [sessionSecondsRemaining, setSessionSecondsRemaining] = useState<number>(1800);

  // AI & Automation Modals
  const [isQuizGenModalOpen, setIsQuizGenModalOpen] = useState(false);
  const [isAssistantModalOpen, setIsAssistantModalOpen] = useState(false);
  const [isReportsModalOpen, setIsReportsModalOpen] = useState(false);

  // Core Data States
  const [stats, setStats] = useState<AdminDashboardStats>({
    totalStudents: 34,
    totalTeachers: 0,
    totalParents: 0,
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
    if (isVerifiedSuperAdmin) {
      loadAllData();
    }
  }, [isVerifiedSuperAdmin]);

  // Session countdown effect
  useEffect(() => {
    if (!isVerifiedSuperAdmin) return;
    const timer = setInterval(() => {
      setSessionSecondsRemaining((prev) => {
        if (prev <= 1) {
          logout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isVerifiedSuperAdmin, logout]);

  // Format session time
  const formatSessionTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // IF NOT AUTHENTICATED AS SUPER ADMIN, SHOW SECURE SUPER ADMIN AUTH PORTAL
  if (!isVerifiedSuperAdmin) {
    return <AdminAuthPortal onSuccess={loadAllData} />;
  }

  // The 13 Required Enterprise Navigation Modules
  const navigationItems: {
    id: AdminActiveSubTab;
    label: string;
    amharicLabel: string;
    icon: React.ReactNode;
    badge?: string;
  }[] = [
    {
      id: 'overview',
      label: 'Dashboard Overview',
      amharicLabel: 'አጠቃላይ እይታ',
      icon: <LayoutDashboard className="w-4 h-4 text-emerald-400" />,
    },
    {
      id: 'ai_automation',
      label: 'AI Automation Center',
      amharicLabel: 'የAI እና አውቶሜሽን ቁጥጥር',
      icon: <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />,
      badge: 'Control',
    },
    {
      id: 'assignments',
      label: 'Assignments & Auto-Check',
      amharicLabel: 'የስራዎችና ማረሚያ ቁጥጥር',
      icon: <FileText className="w-4 h-4 text-indigo-400" />,
      badge: 'AI Rubric',
    },
    {
      id: 'students',
      label: 'Students Control',
      amharicLabel: 'የተማሪዎች ቁጥጥር',
      icon: <Users className="w-4 h-4 text-blue-400" />,
      badge: `${students.length || 34}`,
    },
    {
      id: 'curriculum',
      label: 'Curriculum & Content',
      amharicLabel: 'ስርዓተ-ትምህርት',
      icon: <Layers className="w-4 h-4 text-indigo-400" />,
      badge: '2019 ዓ.ም',
    },
    {
      id: 'books',
      label: 'Book Management',
      amharicLabel: 'መጽሐፍት አስተዳደር',
      icon: <BookOpen className="w-4 h-4 text-amber-400" />,
      badge: 'DRM Active',
    },
    {
      id: 'ai_rag',
      label: 'AI & RAG Control',
      amharicLabel: 'የAI እና RAG ቁጥጥር',
      icon: <Brain className="w-4 h-4 text-purple-400" />,
      badge: '98.6%',
    },
    {
      id: 'finance',
      label: 'Payment Control',
      amharicLabel: 'የክፍያ ቁጥጥር (CBE/Telebirr)',
      icon: <CreditCard className="w-4 h-4 text-teal-400" />,
      badge: 'Verified',
    },
    {
      id: 'subscriptions',
      label: 'Subscription Control',
      amharicLabel: 'የደንበኝነት ምዝገባ',
      icon: <TrendingUp className="w-4 h-4 text-emerald-400" />,
      badge: 'Tier Prices',
    },
    {
      id: 'notifications',
      label: 'Notification Broadcast',
      amharicLabel: 'ማሳወቂያዎች መላኪያ',
      icon: <Bell className="w-4 h-4 text-rose-400" />,
    },
    {
      id: 'analytics',
      label: 'Analytics & Telemetry',
      amharicLabel: 'አጠቃላይ ትንታኔ',
      icon: <BarChart3 className="w-4 h-4 text-cyan-400" />,
    },
    {
      id: 'system_health',
      label: 'System Monitoring',
      amharicLabel: 'የሲስተም ጤናና ክትትል',
      icon: <Activity className="w-4 h-4 text-emerald-400" />,
      badge: '10 Subsystems',
    },
    {
      id: 'security_rbac',
      label: 'Security Fortress',
      amharicLabel: 'የደህንነት ምሽግና RBAC',
      icon: <ShieldCheck className="w-4 h-4 text-amber-400" />,
      badge: 'Zero-Trust',
    },
    {
      id: 'audit_trail',
      label: 'Audit Trail',
      amharicLabel: 'የእንቅስቃሴዎች ኦዲት',
      icon: <History className="w-4 h-4 text-stone-300" />,
      badge: 'Immutable',
    },
    {
      id: 'settings',
      label: 'Settings & Emergency',
      amharicLabel: 'ማስተካከያና አስቸኳይ ጊዜ',
      icon: <Settings className="w-4 h-4 text-rose-400" />,
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
                SUPER ADMIN
              </span>
            </div>
            <p className="text-[11px] text-stone-400 font-serif-ethiopic">
              የኢ.ፌ.ዲ.ሪ አዲሱ ሥርዓተ-ትምህርት 2019 ዓ.ም • ዋና መቆጣጠሪያ
            </p>
          </div>
        </div>

        {/* Super Admin Credential, Session Timer & Action Header */}
        <div className="flex items-center gap-3">
          {/* Session Timer */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-stone-800/90 border border-stone-700/80 text-[11px] font-mono text-stone-300">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>Session:</span>
            <span className="font-bold text-amber-300">{formatSessionTime(sessionSecondsRemaining)}</span>
          </div>

          {/* Quick AI Assistant Trigger */}
          <button
            onClick={() => setIsAssistantModalOpen(true)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-900/60 border border-purple-600/70 text-purple-200 text-xs font-bold hover:bg-purple-800 transition-all cursor-pointer shadow-sm"
          >
            <Bot className="w-3.5 h-3.5 text-purple-300" />
            <span>AI Assistant</span>
          </button>

          {/* Quick Reports Trigger */}
          <button
            onClick={() => setIsReportsModalOpen(true)}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-900/60 border border-teal-600/70 text-teal-200 text-xs font-bold hover:bg-teal-800 transition-all cursor-pointer shadow-sm"
          >
            <FileText className="w-3.5 h-3.5 text-teal-300" />
            <span>Reports</span>
          </button>

          {/* Super Admin Info */}
          <div className="hidden lg:flex items-center gap-2.5 bg-stone-800/90 border border-stone-700/80 px-3 py-1.5 rounded-xl text-xs">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <div className="text-right">
              <div className="font-bold text-white text-[11px] leading-tight">
                {DEVELOPER_INFO.name}
              </div>
              <div className="text-[10px] text-stone-400 font-mono">
                {SUPER_ADMIN_EMAIL}
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

          <button
            onClick={() => logout()}
            title="Secure Lock / Logout"
            className="p-2 rounded-xl bg-rose-950/70 border border-rose-800 text-rose-300 hover:bg-rose-900 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
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
            <div className="text-[11px] font-mono font-bold text-stone-500 uppercase tracking-wider px-3 mb-2 flex items-center justify-between">
              <span>ADMIN CONTROLS</span>
              <span className="text-[10px] text-emerald-400 font-normal">13 Modules</span>
            </div>

            <nav className="space-y-1">
              {navigationItems.map((item) => {
                const isActive =
                  activeTab === item.id ||
                  (item.id === 'finance' &&
                    ['payments_billing', 'payment_methods', 'payment_audit_logs'].includes(
                      activeTab
                    )) ||
                  (item.id === 'ai_rag' && activeTab === 'rag_analytics');

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
                <span>{DEVELOPER_INFO.name}</span>
              </div>
              <div className="text-[10px] text-stone-400">Sole System Owner & Super Admin</div>
              <div className="pt-1 space-y-1">
                <a
                  href={`tel:${DEVELOPER_INFO.phone}`}
                  className="flex items-center gap-1.5 text-[11px] text-stone-300 hover:text-emerald-400 transition-colors"
                >
                  <Phone className="w-3 h-3 text-stone-500" />
                  <span>{DEVELOPER_INFO.phone}</span>
                </a>
                <a
                  href={`mailto:${SUPER_ADMIN_EMAIL}`}
                  className="flex items-center gap-1.5 text-[11px] text-stone-300 hover:text-emerald-400 transition-colors truncate"
                >
                  <Mail className="w-3 h-3 text-stone-500 shrink-0" />
                  <span className="truncate">{SUPER_ADMIN_EMAIL}</span>
                </a>
              </div>
            </div>

            <div className="flex items-center justify-between text-[10px] px-1 pt-1">
              <span>Security: Zero-Trust</span>
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

          {/* AI AUTOMATION CONTROL CENTER */}
          {activeTab === 'ai_automation' && (
            <AdminAIControlCenter
              onOpenQuizGenerator={() => setIsQuizGenModalOpen(true)}
              onOpenAssistant={() => setIsAssistantModalOpen(true)}
              onOpenReports={() => setIsReportsModalOpen(true)}
              onNavigateToTab={(tab) => setActiveTab(tab as AdminActiveSubTab)}
            />
          )}

          {/* ASSIGNMENTS & AUTO-CHECKING */}
          {activeTab === 'assignments' && <AdminAIAssignmentSection />}

          {/* 2. STUDENT MANAGEMENT */}
          {activeTab === 'students' && (
            <AdminStudentsSection students={students} onRefresh={loadAllData} />
          )}

          {/* 3. CURRICULUM MANAGEMENT & CONTENT PROCESSING */}
          {activeTab === 'curriculum' && (
            <AdminCurriculumSection metadataList={curriculum} />
          )}

          {/* 4. BOOK MANAGEMENT (Approved Textbooks & DRM Protection) */}
          {activeTab === 'books' && <AdminBookManagementSection />}

          {/* 5. AI & RAG CONTROL */}
          {activeTab === 'ai_rag' && <AdminRAGAnalyticsSection />}

          {/* 6. PAYMENTS CONTROL (Verification & Auditing) */}
          {(activeTab === 'finance' || activeTab === 'payments_billing') && (
            <AdminPaymentDashboardSection />
          )}

          {/* 7. SUBSCRIPTIONS CONTROL & TIER PRICING */}
          {activeTab === 'subscriptions' && <AdminSubscriptionsSection />}

          {/* 8. NOTIFICATIONS CONTROL */}
          {activeTab === 'notifications' && <AdminNotificationsSection />}

          {/* 9. ANALYTICS & TELEMETRY */}
          {activeTab === 'analytics' && <AdminRevenueAnalyticsSection />}

          {/* 10. SYSTEM HEALTH & 10-SUBSYSTEM MONITORING */}
          {activeTab === 'system_health' && <AdminSystemHealthSection />}

          {/* 11. SECURITY FORTRESS & RBAC */}
          {activeTab === 'security_rbac' && <AdminSecurityDashboard />}

          {/* 12. AUDIT TRAIL (IMMUTABLE LOGS) */}
          {activeTab === 'audit_trail' && <AdminAuditTrailSection />}

          {/* 13. SETTINGS & EMERGENCY CONTROLS */}
          {activeTab === 'settings' && <AdminSettingsSection />}

          {/* Auxiliary Question Bank if accessed */}
          {activeTab === 'question_bank' && <AdminQuestionBankSection />}
        </main>
      </div>

      {/* AI AUTOMATION MODALS */}
      <AdminAIQuizGeneratorModal
        isOpen={isQuizGenModalOpen}
        onClose={() => setIsQuizGenModalOpen(false)}
        onSavedToBank={() => loadAllData()}
      />
      <AdminAIAssistantChat
        isOpen={isAssistantModalOpen}
        onClose={() => setIsAssistantModalOpen(false)}
        onNavigateToTab={(t) => setActiveTab(t as AdminActiveSubTab)}
      />
      <AdminAutomatedReportsModal
        isOpen={isReportsModalOpen}
        onClose={() => setIsReportsModalOpen(false)}
      />
    </div>
  );
};
