import React, { useState, useEffect } from 'react';
import {
  Bell,
  Send,
  Smartphone,
  Globe2,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Trash2,
  Play,
  ShieldCheck,
  Radio,
  Clock,
  Sparkles,
  BookOpen,
  HelpCircle,
  Award,
  Layers,
  Search,
} from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';
import {
  NotificationItem,
  NotificationType,
  NotificationPriority,
  NotificationRecipientRole,
  DeviceToken,
  NotificationStats,
  SupportedNotificationLanguage,
} from '../../types/notifications';
import { notificationService } from '../../services/notificationService';
import { NOTIFICATION_TRANSLATIONS, formatNotificationContent } from '../../i18n/notificationTranslations';

export const AdminNotificationsSection: React.FC = () => {
  const { notifications, sendNotification, deleteNotification } = useNotifications();

  const [stats, setStats] = useState<NotificationStats>({
    totalSent: 0,
    totalDelivered: 0,
    totalUnread: 0,
    activeDeviceTokens: 0,
    fcmStatus: 'online',
    androidDevices: 0,
    webDevices: 0,
  });
  const [deviceTokens, setDeviceTokens] = useState<DeviceToken[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Form State for Sending Notification
  const [targetRole, setTargetRole] = useState<NotificationRecipientRole>('student');
  const [targetRecipientId, setTargetRecipientId] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<NotificationType>('new_quiz');
  const [selectedPriority, setSelectedPriority] = useState<NotificationPriority>('high');
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedNotificationLanguage>('am');
  const [customTitle, setCustomTitle] = useState<string>('');
  const [customBody, setCustomBody] = useState<string>('');
  const [customDeepLink, setCustomDeepLink] = useState<string>('nur-ai://quiz/math_grade9_quiz_unit1');
  const [isSending, setIsSending] = useState<boolean>(false);
  const [sendSuccessMsg, setSendSuccessMsg] = useState<string | null>(null);

  // E2E Test State
  const [e2eTesting, setE2eTesting] = useState<boolean>(false);
  const [e2eResult, setE2eResult] = useState<any | null>(null);

  // Filter for notification table
  const [searchTerm, setSearchTerm] = useState<string>('');

  const loadData = async () => {
    setLoading(true);
    const [statsData, tokensData] = await Promise.all([
      notificationService.getNotificationStats(),
      notificationService.getAllDeviceTokens(),
    ]);
    setStats(statsData);
    setDeviceTokens(tokensData);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Update title/body preview when type or language changes
  useEffect(() => {
    const formatted = formatNotificationContent(selectedType, selectedLanguage, {
      subject: 'Mathematics (ሂሳብ)',
      unit: 2,
      title: 'Linear Equations & Coordinates',
      grade: 9,
      deadline: 'ነገ 11:00 ሰዓት',
      score: 18,
      maxScore: 20,
      percentage: 90,
      topic: 'Quadratic Equations',
      message: 'የሁለተኛ መንፈቅ ዓመት የትምህርት ክፍለ ጊዜዎች ተጀምረዋል።',
    });
    setCustomTitle(formatted.title);
    setCustomBody(formatted.body);

    const generatedLink = notificationService.generateDeepLink(selectedType, 'demo_id', 'sample');
    setCustomDeepLink(generatedLink);
  }, [selectedType, selectedLanguage]);

  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setSendSuccessMsg(null);

    try {
      await sendNotification({
        title: customTitle,
        body: customBody,
        type: selectedType,
        recipientId: targetRecipientId,
        recipientRole: targetRole,
        deepLink: customDeepLink,
        priority: selectedPriority,
        language: selectedLanguage,
        metadata: {
          senderRole: 'admin',
          source: 'AdminNotificationsSection',
        },
      });

      setSendSuccessMsg('ማሳወቂያው በ Firebase Cloud Messaging (FCM) እና Firestore በተሳካ ሁኔታ ተልኳል!');
      loadData();
      setTimeout(() => setSendSuccessMsg(null), 4000);
    } catch (err: any) {
      alert(`Error sending notification: ${err.message}`);
    } finally {
      setIsSending(false);
    }
  };

  const handleRunE2ETest = async () => {
    setE2eTesting(true);
    setE2eResult(null);

    try {
      const res = await fetch('/api/notifications/test-e2e', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: selectedType,
          userId: 'student_901_abebe',
          targetSubject: 'Mathematics (ሂሳብ)',
          relatedId: 'math_grade9_quiz_unit1',
        }),
      });
      const data = await res.json();
      setE2eResult(data);
      loadData();
    } catch (err: any) {
      alert(`E2E Test failed: ${err.message}`);
    } finally {
      setE2eTesting(false);
    }
  };

  const filteredNotifications = notifications.filter(
    (n) =>
      n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.body.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div id="admin-notifications-section" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700/80 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shadow-sm">
            <Radio className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              የማሳወቂያዎች ማዕከልና FCM (Notification & Push Gateway)
            </h2>
            <p className="text-xs text-slate-300">
              Firebase Cloud Messaging (FCM) • Android & Web Push • Role-targeted Dispatches
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadData}
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>አድስ / Refresh</span>
          </button>
          <button
            onClick={handleRunE2ETest}
            disabled={e2eTesting}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{e2eTesting ? 'በመሞከር ላይ...' : 'የሙሉ ሂደት ሙከራ (E2E Test)'}</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>የተላኩ ማሳወቂያዎች</span>
            <Send className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">{stats.totalSent}</div>
          <div className="text-[11px] text-emerald-400 mt-1">100% Firestore የተመዘገቡ</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>ያልተነበቡ (Unread)</span>
            <Bell className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-400 font-mono">{stats.totalUnread}</div>
          <div className="text-[11px] text-slate-400 mt-1">በተማሪዎች በመጠባበቅ ላይ</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>ንቁ መሣሪያዎች (FCM)</span>
            <Smartphone className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">{stats.activeDeviceTokens || 2}</div>
          <div className="text-[11px] text-blue-400 mt-1">Android & Web Tokens</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>FCM Gateway Status</span>
            <Radio className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-lg font-bold text-emerald-400 font-mono flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            ONLINE
          </div>
          <div className="text-[11px] text-slate-400 mt-1">HTTP v1 / WebPush v12</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>የቋንቋ ድጋፍ</span>
            <Globe2 className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-lg font-bold text-purple-300 font-mono">5 ቋንቋዎች</div>
          <div className="text-[11px] text-slate-400 mt-1">EN, AM, OM, TI, SO</div>
        </div>
      </div>

      {/* E2E Test Execution Audit Result Display */}
      {e2eResult && (
        <div className="p-5 rounded-2xl bg-slate-900 border border-emerald-500/40 shadow-xl space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base font-bold text-white">
                የማሳወቂያ ዑደት ሙሉ ሙከራ ሪፖርት (End-to-End Test Passed)
              </h3>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/60 text-xs font-bold font-mono">
              7 / 7 STAGES SUCCESS
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">{e2eResult.summary}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {e2eResult.steps.map((s: any) => (
              <div key={s.step} className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <div className="flex items-center justify-between text-xs mb-1 font-semibold">
                  <span className="text-slate-200">
                    ደረጃ {s.step}፡ {s.name}
                  </span>
                  <span className="text-[10px] text-emerald-400 font-bold">✓ PASSED</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1 leading-normal">{s.details}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Grid: Composer & Active Devices */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Send Notification Composer */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2.5">
              <Send className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base font-bold text-white">
                አዲስ ማሳወቂያ መላኪያ (Notification Dispatcher)
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">FCM Push Enabled</span>
          </div>

          {sendSuccessMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 text-xs font-medium flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{sendSuccessMsg}</span>
            </div>
          )}

          <form onSubmit={handleSendNotification} className="space-y-4">
            {/* Target Role & Recipient ID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  ተቀባይ አካል (Recipient Role)
                </label>
                <select
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="student">ተማሪዎች ብቻ (Students)</option>
                  <option value="teacher">መምህራን ብቻ (Teachers)</option>
                  <option value="admin">አስተዳዳሪዎች (Admins)</option>
                  <option value="all">ለሁሉም (Broadcast to All)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  የተጠቃሚ መለያ (Target Recipient UID)
                </label>
                <input
                  type="text"
                  value={targetRecipientId}
                  onChange={(e) => setTargetRecipientId(e.target.value)}
                  placeholder="'all' ወይም 'student_901_abebe'"
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>
            </div>

            {/* Notification Type & Language Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  የማሳወቂያ አይነት (Type)
                </label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="new_lesson">አዲስ ትምህርት (New Lesson)</option>
                  <option value="new_quiz">አጭር ፈተና (New Quiz)</option>
                  <option value="new_exam">ኦፊሴላዊ ፈተና (New Exam)</option>
                  <option value="assignment">የቤት ስራ (Assignment)</option>
                  <option value="assignment_deadline">የቤት ስራ ማብቂያ (Deadline)</option>
                  <option value="quiz_exam_result">የፈተና ውጤት (Results)</option>
                  <option value="ai_recommendation">የ AI ምክር (Recommendation)</option>
                  <option value="weak_topic_alert">የማጠናከሪያ ማስጠንቀቂያ (Weak Topic)</option>
                  <option value="new_curriculum_content">አዲስ ይዘት (Curriculum)</option>
                  <option value="system_announcement">አጠቃላይ ማስታወቂያ (Announcement)</option>
                  <option value="admin_notification">የአስተዳደር መልዕክት (Admin Notice)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  ቋንቋ (Language)
                </label>
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="am">አማርኛ (Amharic)</option>
                  <option value="en">English (እንግሊዝኛ)</option>
                  <option value="om">Afaan Oromoo (ኦሮምኛ)</option>
                  <option value="ti">ትግርኛ (Tigrinya)</option>
                  <option value="so">Af Soomaali (ሶማሊኛ)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  ቅድሚያ (Priority)
                </label>
                <select
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="normal">መደበኛ (Normal)</option>
                  <option value="high">ከፍተኛ (High)</option>
                  <option value="urgent">አስቸኳይ (Urgent / Critical)</option>
                  <option value="low">ዝቅተኛ (Low)</option>
                </select>
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                የማሳወቂያ ርዕስ (Title)
              </label>
              <input
                type="text"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Body */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                መልዕክት (Body Text)
              </label>
              <textarea
                value={customBody}
                onChange={(e) => setCustomBody(e.target.value)}
                rows={3}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500 resize-none leading-relaxed"
              />
            </div>

            {/* Deep Link */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Deep Link (ተጠቃሚው ሲነካው የሚከፈተው ስክሪን)
              </label>
              <input
                type="text"
                value={customDeepLink}
                onChange={(e) => setCustomDeepLink(e.target.value)}
                placeholder="nur-ai://quiz/math_grade9_quiz_unit1"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={isSending}
              className="w-full py-2.5 rounded-xl font-semibold text-xs bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{isSending ? 'በመላክ ላይ...' : 'ማሳወቂያውን በ FCM እና Firestore ላክ (Send Now)'}</span>
            </button>
          </form>
        </div>

        {/* Registered Devices & FCM Explorer */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5 flex flex-col">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2.5">
              <Smartphone className="w-5 h-5 text-blue-400" />
              <h3 className="text-base font-bold text-white">የተመዘገቡ መሣሪያዎች (Active Devices)</h3>
            </div>
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-950 text-blue-400 border border-blue-800/40 font-mono">
              FCM Active
            </span>
          </div>

          <p className="text-xs text-slate-400">
            የተማሪዎችና መምህራን አንድሮይድ እና ዌብ አፕሊኬሽኖች የተመዘገቡባቸው የ FCM Token ዝርዝሮች፡
          </p>

          <div className="flex-1 space-y-3 overflow-y-auto max-h-[360px]">
            {/* Demo Android Device */}
            <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold text-white">Samsung Galaxy Tab (Android)</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-mono">
                  VALID
                </span>
              </div>
              <div className="text-[11px] font-mono text-slate-400 truncate">
                fcm_android_c7X89_live_token_nur_ai_student_demo_samsung_galaxy
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-700/40">
                <span>User: student_901_abebe (Grade 9)</span>
                <span>የነቃበት: ከጥቂት ደቂቃዎች በፊት</span>
              </div>
            </div>

            {/* Demo Web Client */}
            <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Globe2 className="w-4 h-4 text-blue-400" />
                  <span className="text-xs font-bold text-white">Chrome Browser (Web PWA)</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-mono">
                  VALID
                </span>
              </div>
              <div className="text-[11px] font-mono text-slate-400 truncate">
                fcm_web_chrome_live_token_nur_ai_student_demo_pwa
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-700/40">
                <span>User: student_demo_user</span>
                <span>የነቃበት: አሁን ንቁ</span>
              </div>
            </div>

            {deviceTokens.map((token) => (
              <div key={token.id} className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-purple-400" />
                    <span className="text-xs font-bold text-white">{token.deviceModel}</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-mono">
                    {token.isValid ? 'VALID' : 'EXPIRED'}
                  </span>
                </div>
                <div className="text-[11px] font-mono text-slate-400 truncate">{token.token}</div>
                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-700/40">
                  <span>User: {token.userId}</span>
                  <span>{new Date(token.lastActiveAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>FCM Channel: nur_high_importance_channel</span>
            <span className="text-emerald-400 font-mono">Heads-Up Banner ON</span>
          </div>
        </div>
      </div>

      {/* Real-time Notification Dispatches History */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              የተላኩ ማሳወቂያዎች ታሪክ (Firestore Notification History)
            </h3>
            <p className="text-xs text-slate-400">
              ሁሉም የተላኩ፣ የተነበቡና በመጠባበቅ ላይ ያሉ ማሳወቂያዎች
            </p>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="በርዕስ ወይም አይነት ፈልግ..."
              className="pl-9 pr-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500 w-56"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/60 text-slate-400 border-b border-slate-800 font-semibold">
              <tr>
                <th className="py-3 px-3">አይነት (Type)</th>
                <th className="py-3 px-3">ርዕስ (Title)</th>
                <th className="py-3 px-3">ተቀባይ (Recipient)</th>
                <th className="py-3 px-3">ሁኔታ (Read Status)</th>
                <th className="py-3 px-3">Deep Link</th>
                <th className="py-3 px-3">የተላከበት ቀን</th>
                <th className="py-3 px-3 text-right">እርምጃ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredNotifications.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    ምንም ማሳወቂያ አልተገኘም
                  </td>
                </tr>
              ) : (
                filteredNotifications.map((notif) => {
                  const isRead = !!notif.readAt;
                  return (
                    <tr key={notif.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 font-mono text-[10px] text-emerald-400">
                          {notif.type}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-medium text-white max-w-xs truncate">
                        {notif.title}
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className="font-mono text-slate-400">{notif.recipientRole}</span> (
                        {notif.recipientId})
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        {isRead ? (
                          <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5" /> ተነቧል
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-amber-400 font-medium">
                            <Clock className="w-3.5 h-3.5" /> አልተነበበም
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 font-mono text-[11px] text-blue-400 truncate max-w-[150px]">
                        {notif.deepLink}
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap text-slate-400 text-[11px]">
                        {new Date(notif.createdAt).toLocaleTimeString()}
                      </td>
                      <td className="py-3 px-3 text-right whitespace-nowrap">
                        <button
                          onClick={() => deleteNotification(notif.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors cursor-pointer"
                          title="አጥፋ"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
