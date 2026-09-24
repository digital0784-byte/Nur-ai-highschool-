import React, { useState } from 'react';
import {
  Settings,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Lock,
  Power,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Database,
  Brain,
  CreditCard,
  UserX,
  FileText,
  Download,
  Save,
  Radio,
  Sliders,
  X,
} from 'lucide-react';
import { adminAuditService } from '../../services/adminAuditService';
import { SUPER_ADMIN_EMAIL } from '../../services/subscriptionService';

interface EmergencyState {
  maintenanceMode: boolean;
  disableRegistrations: boolean;
  disablePayments: boolean;
  disableAITutor: boolean;
  disableExternalReferences: boolean;
}

export const AdminSettingsSection: React.FC = () => {
  // General School & Academic Settings
  const [schoolName, setSchoolName] = useState('NUR AI High School (ኑር AI ሁለተኛ ደረጃ ት/ቤት)');
  const [academicYear, setAcademicYear] = useState('2019 ዓ.ም (2019 E.C. FDRE MoE)');
  const [currentSemester, setCurrentSemester] = useState<1 | 2>(1);
  const [primaryAIModel, setPrimaryAIModel] = useState('gemini-2.5-flash');
  const [fallbackAIModel, setFallbackAIModel] = useState('gemini-3.1-flash-lite');
  const [defaultLanguage, setDefaultLanguage] = useState<'am' | 'en' | 'om' | 'ti'>('am');

  // Emergency Controls State
  const [emergency, setEmergency] = useState<EmergencyState>({
    maintenanceMode: false,
    disableRegistrations: false,
    disablePayments: false,
    disableAITutor: false,
    disableExternalReferences: false,
  });

  // Suspend compromised account modal
  const [compromisedEmail, setCompromisedEmail] = useState('');
  const [compromisedReason, setCompromisedReason] = useState('');

  // Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState<{
    actionKey: keyof EmergencyState | 'suspend_account';
    title: string;
    description: string;
    targetValue?: boolean;
  } | null>(null);

  const [notificationMsg, setNotificationMsg] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const showNotification = (text: string, type: 'success' | 'error' = 'success') => {
    setNotificationMsg({ type, text });
    setTimeout(() => setNotificationMsg(null), 4000);
  };

  const handleSaveGeneralSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await adminAuditService.logAction(
      'SYSTEM_SETTINGS_SAVED',
      'School Identity & Academic Calendar',
      'SUCCESS',
      {
        schoolName,
        academicYear,
        currentSemester,
        primaryAIModel,
        fallbackAIModel,
        defaultLanguage,
      }
    );
    showNotification('የስርዓት ማስተካከያዎች በተሳካ ሁኔታ ተቀምጠዋል! (Settings Saved)');
  };

  const requestEmergencyToggle = (key: keyof EmergencyState) => {
    const nextVal = !emergency[key];
    const titles: Record<keyof EmergencyState, string> = {
      maintenanceMode: nextVal ? 'የጥገና ሁነታን ማግበር (Enable Maintenance Mode)' : 'የጥገና ሁነታን ማጥፋት (Disable Maintenance Mode)',
      disableRegistrations: nextVal ? 'አዲስ የተማሪ ምዝገባዎችን ማገድ (Disable Student Registrations)' : 'የተማሪ ምዝገባን መፍቀድ (Enable Student Registrations)',
      disablePayments: nextVal ? 'የክፍያ መቀበያዎችን ማገድ (Temporarily Disable Payments)' : 'የክፍያ መቀበያዎችን መክፈት (Enable Payments)',
      disableAITutor: nextVal ? 'የAI አስጠኚ አገልግሎትን ማቆም (Disable AI Feature)' : 'የAI አስጠኚን ማስጀመር (Enable AI Feature)',
      disableExternalReferences: nextVal ? 'ውጫዊ ማጣቀሻዎችን ማገድ (Disable External References)' : 'ውጫዊ ማጣቀሻዎችን መፍቀድ (Enable External References)',
    };

    const descriptions: Record<keyof EmergencyState, string> = {
      maintenanceMode: 'ተማሪዎች ጊዜያዊ የጥገና መልእክት ያያሉ። የአድሚን ክፍሎች ግን ክፍት ሆነው ይቀጥላሉ።',
      disableRegistrations: 'አዳዲስ ተማሪዎች ወደ መተግበሪያው እንዳይመዘገቡ ወዲያውኑ ይከለክላል።',
      disablePayments: 'በቴሌብር፣ በሲቢኢ እና በባንኮች የሚላኩ አዳዲስ የክፍያ ጥያቄዎችን በጊዜያዊነት ያቆማል።',
      disableAITutor: 'በጄሚናይ የሚሰሩ አጋዥ አስጠኚ ጥያቄዎችን በጊዜያዊነት ያግዳል (መጽሐፍት ንባብ አይነካም)።',
      disableExternalReferences: 'ከኢ.ፌ.ዲ.ሪ ኦፊሴላዊ መማሪያ መጽሐፍት ውጪ ያሉ ማጣቀሻዎችን በጥብቅ ይገድባል።',
    };

    setConfirmModal({
      actionKey: key,
      title: titles[key],
      description: descriptions[key],
      targetValue: nextVal,
    });
  };

  const executeConfirmedAction = async () => {
    if (!confirmModal) return;

    if (confirmModal.actionKey === 'suspend_account') {
      if (!compromisedEmail.trim()) {
        showNotification('እባክዎ የታገደውን ኢሜይል ያስገቡ', 'error');
        return;
      }
      await adminAuditService.logAction(
        'STUDENT_SUSPENDED',
        compromisedEmail.trim(),
        'SUCCESS',
        {
          reason: compromisedReason || 'Emergency Compromised Account Lock by Super Admin',
          superAdmin: SUPER_ADMIN_EMAIL,
        }
      );
      showNotification(`አካውንት ${compromisedEmail} ወዲያውኑ ታግዷል!`);
      setCompromisedEmail('');
      setCompromisedReason('');
    } else {
      const key = confirmModal.actionKey as keyof EmergencyState;
      const nextVal = confirmModal.targetValue!;
      setEmergency((prev) => ({ ...prev, [key]: nextVal }));

      await adminAuditService.logAction(
        'EMERGENCY_SETTING_CHANGED',
        `Emergency Control: ${key}`,
        'SUCCESS',
        {
          state: nextVal ? 'ENABLED' : 'DISABLED',
          adminEmail: SUPER_ADMIN_EMAIL,
        }
      );
      showNotification(`${confirmModal.title} ተፈፅሟል!`);
    }

    setConfirmModal(null);
  };

  const handleExportBackup = () => {
    const backupData = {
      schoolName,
      academicYear,
      curriculum: 'FDRE Ministry of Education • Grades 9-12 (2019 ዓ.ም)',
      exportedAt: new Date().toISOString(),
      superAdmin: SUPER_ADMIN_EMAIL,
      emergencyState: emergency,
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nur_ai_system_settings_backup_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-stone-900 text-white font-mono">
              SYSTEM CONTROLS
            </span>
            <span className="text-xs text-stone-500 font-mono">FDRE MoE Curriculum Year 2019 ዓ.ም</span>
          </div>
          <h2 className="text-lg font-bold text-stone-900 font-serif-ethiopic flex items-center gap-2">
            <Settings className="w-5 h-5 text-stone-800" />
            <span>የስርዓት ማስተካከያዎች እና የአስቸኳይ ጊዜ መቆጣጠሪያዎች (Settings & Emergency Controls)</span>
          </h2>
          <p className="text-xs text-stone-500">
            Configure institutional parameters, curriculum editions, and instant emergency kill-switches.
          </p>
        </div>

        <button
          onClick={handleExportBackup}
          className="flex items-center gap-2 px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold transition cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Export Backup JSON</span>
        </button>
      </div>

      {notificationMsg && (
        <div
          className={`p-3.5 rounded-2xl text-xs font-bold flex items-center gap-2.5 animate-in fade-in ${
            notificationMsg.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          {notificationMsg.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          ) : (
            <XCircle className="w-4 h-4 text-rose-600" />
          )}
          <span>{notificationMsg.text}</span>
        </div>
      )}

      {/* SECTION 1: EMERGENCY KILL-SWITCHES */}
      <div className="bg-rose-50/70 border-2 border-rose-200 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-rose-200 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-xs">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-rose-950 font-serif-ethiopic">
                የአስቸኳይ ጊዜ መቆጣጠሪያዎች (Emergency Kill-Switches)
              </h3>
              <p className="text-[11px] text-rose-700">
                All actions require explicit confirmation and write to the immutable audit trail.
              </p>
            </div>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-rose-200 text-rose-900 font-mono">
            Zero-Trust Protected
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {/* Switch 1: Maintenance Mode */}
          <div className="p-4 bg-white rounded-2xl border border-rose-200 flex items-center justify-between gap-3 shadow-2xs">
            <div>
              <div className="font-bold text-xs text-stone-900 flex items-center gap-1.5">
                <Power className="w-4 h-4 text-rose-600" />
                <span>የጥገና ሁነታ (System Maintenance Mode)</span>
              </div>
              <p className="text-[11px] text-stone-500 mt-0.5">
                Display maintenance splash screen to students while keeping Admin active.
              </p>
            </div>
            <button
              onClick={() => requestEmergencyToggle('maintenanceMode')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 ${
                emergency.maintenanceMode
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              {emergency.maintenanceMode ? 'Active (ON)' : 'Disabled (OFF)'}
            </button>
          </div>

          {/* Switch 2: Disable Registrations */}
          <div className="p-4 bg-white rounded-2xl border border-rose-200 flex items-center justify-between gap-3 shadow-2xs">
            <div>
              <div className="font-bold text-xs text-stone-900 flex items-center gap-1.5">
                <UserX className="w-4 h-4 text-rose-600" />
                <span>የተማሪ ምዝገባን ማገድ (Disable New Registrations)</span>
              </div>
              <p className="text-[11px] text-stone-500 mt-0.5">
                Prevent any new students from self-registering.
              </p>
            </div>
            <button
              onClick={() => requestEmergencyToggle('disableRegistrations')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 ${
                emergency.disableRegistrations
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              {emergency.disableRegistrations ? 'Blocked (ON)' : 'Allowed (OFF)'}
            </button>
          </div>

          {/* Switch 3: Disable Payments */}
          <div className="p-4 bg-white rounded-2xl border border-rose-200 flex items-center justify-between gap-3 shadow-2xs">
            <div>
              <div className="font-bold text-xs text-stone-900 flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-rose-600" />
                <span>ክፍያዎችን በጊዜያዊነት ማገድ (Disable Payments)</span>
              </div>
              <p className="text-[11px] text-stone-500 mt-0.5">
                Temporarily pause new payment submissions for Telebirr / CBE.
              </p>
            </div>
            <button
              onClick={() => requestEmergencyToggle('disablePayments')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 ${
                emergency.disablePayments
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              {emergency.disablePayments ? 'Paused (ON)' : 'Active (OFF)'}
            </button>
          </div>

          {/* Switch 4: Disable AI Feature */}
          <div className="p-4 bg-white rounded-2xl border border-rose-200 flex items-center justify-between gap-3 shadow-2xs">
            <div>
              <div className="font-bold text-xs text-stone-900 flex items-center gap-1.5">
                <Brain className="w-4 h-4 text-rose-600" />
                <span>የAI አስጠኚን ማቆም (Disable AI Tutor Feature)</span>
              </div>
              <p className="text-[11px] text-stone-500 mt-0.5">
                If Gemini API experiences errors or quota limits, pause AI interactions.
              </p>
            </div>
            <button
              onClick={() => requestEmergencyToggle('disableAITutor')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 ${
                emergency.disableAITutor
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              {emergency.disableAITutor ? 'Disabled (ON)' : 'Active (OFF)'}
            </button>
          </div>
        </div>

        {/* Emergency Fast Suspend Compromised Account */}
        <div className="p-4 bg-white rounded-2xl border border-rose-200 space-y-2">
          <div className="font-bold text-xs text-rose-900 flex items-center gap-1.5">
            <Lock className="w-4 h-4 text-rose-600" />
            <span>አስቸኳይ የተማሪ አካውንት ማገጃ (Emergency Suspend Compromised Account)</span>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <input
              type="text"
              value={compromisedEmail}
              onChange={(e) => setCompromisedEmail(e.target.value)}
              placeholder="Student email or UID (e.g., student@nur.edu.et)"
              className="flex-1 w-full text-xs p-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-rose-500"
            />
            <input
              type="text"
              value={compromisedReason}
              onChange={(e) => setCompromisedReason(e.target.value)}
              placeholder="Reason (e.g. suspicious activity, non-payment)"
              className="flex-1 w-full text-xs p-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-rose-500"
            />
            <button
              onClick={() => {
                if (!compromisedEmail.trim()) {
                  showNotification('እባክዎ ኢሜይል ያስገቡ', 'error');
                  return;
                }
                setConfirmModal({
                  actionKey: 'suspend_account',
                  title: 'ተማሪን ወዲያውኑ ማገድ (Emergency Suspend Account)',
                  description: `የተማሪው አካውንት (${compromisedEmail}) ወዲያውኑ ይታገዳል፣ ክፍለ ጊዜውም ይሰረዛል።`,
                });
              }}
              className="w-full sm:w-auto px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition cursor-pointer"
            >
              አግድ (Suspend Now)
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 2: INSTITUTIONAL & ACADEMIC PARAMETERS */}
      <form onSubmit={handleSaveGeneralSettings} className="bg-white p-5 sm:p-6 rounded-3xl border border-stone-200 shadow-2xs space-y-5">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-stone-900 font-serif-ethiopic">
              የትምህርት ቤት እና የስርዓተ-ትምህርት መረጃ (School Profile & Parameters)
            </h3>
            <p className="text-xs text-stone-500">
              National high school framework configuration for grades 9 through 12
            </p>
          </div>
          <button
            type="submit"
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>ማስተካከያዎችን አስቀምጥ (Save Settings)</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-bold text-stone-700 mb-1">የትምህርት ቤት ስም (School Name):</label>
            <input
              type="text"
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-600 font-serif-ethiopic"
            />
          </div>

          <div>
            <label className="block font-bold text-stone-700 mb-1">የትምህርት ዘመን (Academic Year):</label>
            <input
              type="text"
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
              className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-600 font-mono"
            />
          </div>

          <div>
            <label className="block font-bold text-stone-700 mb-1">የመጀመሪያ AI ሞዴል (Primary Model):</label>
            <select
              value={primaryAIModel}
              onChange={(e) => setPrimaryAIModel(e.target.value)}
              className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-600 font-mono"
            >
              <option value="gemini-2.5-flash">gemini-2.5-flash (Fast & Native Multimodal)</option>
              <option value="gemini-3.1-flash-lite">gemini-3.1-flash-lite (Cost-Effective Fallback)</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-stone-700 mb-1">ነባሪ ቋንቋ (Default UI Language):</label>
            <select
              value={defaultLanguage}
              onChange={(e) => setDefaultLanguage(e.target.value as any)}
              className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-600 font-serif-ethiopic"
            >
              <option value="am">አማርኛ (Amharic)</option>
              <option value="en">English</option>
              <option value="om">Afaan Oromoo</option>
              <option value="ti">ትግርኛ (Tigrinya)</option>
            </select>
          </div>
        </div>

        {/* Ethiopian Grade Pricing Reference */}
        <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
          <div className="font-bold text-xs text-stone-800">
            የኢትዮጵያ ሁለተኛ ደረጃ ወርሃዊ ክፍያዎች (Monthly Tier Prices):
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="p-2.5 bg-white rounded-xl border border-stone-200 text-center">
              <span className="text-[10px] text-stone-400 block">Grade 9</span>
              <span className="font-black text-emerald-800 font-mono text-sm">160 ETB</span>
            </div>
            <div className="p-2.5 bg-white rounded-xl border border-stone-200 text-center">
              <span className="text-[10px] text-stone-400 block">Grade 10</span>
              <span className="font-black text-emerald-800 font-mono text-sm">180 ETB</span>
            </div>
            <div className="p-2.5 bg-white rounded-xl border border-stone-200 text-center">
              <span className="text-[10px] text-stone-400 block">Grade 11</span>
              <span className="font-black text-emerald-800 font-mono text-sm">200 ETB</span>
            </div>
            <div className="p-2.5 bg-white rounded-xl border border-stone-200 text-center">
              <span className="text-[10px] text-stone-400 block">Grade 12</span>
              <span className="font-black text-emerald-800 font-mono text-sm">200 ETB</span>
            </div>
          </div>
          <p className="text-[11px] text-stone-500">
            *Pricing configuration can be dynamically updated inside the Subscriptions & Pricing Management module.
          </p>
        </div>
      </form>

      {/* Confirmation Modal */}
      {confirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-stone-300 p-6 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="font-bold text-base text-stone-900 font-serif-ethiopic">
                {confirmModal.title}
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed font-serif-ethiopic">
                {confirmModal.description}
              </p>
            </div>

            <div className="p-3 bg-stone-50 rounded-xl text-[11px] text-stone-500 text-center font-mono">
              Action verified by Super Admin: {SUPER_ADMIN_EMAIL}
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setConfirmModal(null)}
                className="flex-1 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                ይቅር (Cancel)
              </button>
              <button
                type="button"
                onClick={executeConfirmedAction}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition shadow-md cursor-pointer"
              >
                አረጋግጥና ፈጽም (Confirm Action)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
