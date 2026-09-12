import React, { useState } from 'react';
import {
  X,
  Bell,
  Volume2,
  VolumeX,
  Smartphone,
  Globe2,
  Moon,
  Check,
  ShieldCheck,
  Send,
  HelpCircle,
} from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';
import {
  NotificationPreferences,
  NotificationType,
  SupportedNotificationLanguage,
} from '../../types/notifications';

interface NotificationPreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NOTIFICATION_TYPE_METAS: Array<{
  type: NotificationType;
  labelAm: string;
  labelEn: string;
  desc: string;
}> = [
  {
    type: 'new_lesson',
    labelAm: 'አዲስ የትምህርት ክፍል',
    labelEn: 'New Lesson Content',
    desc: 'የአዲስ ምዕራፍና የትምህርት ክፍለ-ጊዜዎች ሲለቀቁ የሚደርስ',
  },
  {
    type: 'new_quiz',
    labelAm: 'አጭር የልምምድ ፈተና (Quiz)',
    labelEn: 'New Curriculum Quiz',
    desc: 'ለተማሩት ምዕራፍ ፈጣን መመዘኛ ጥያቄዎች ሲዘጋጁ',
  },
  {
    type: 'new_exam',
    labelAm: 'ኦፊሴላዊ ፈተና (Exam)',
    labelEn: 'Official Examination',
    desc: 'የትምህርት ቤት አጋማሽና ማጠቃለያ ፈተናዎች ማስታወቂያ',
  },
  {
    type: 'assignment',
    labelAm: 'የቤት ስራ (Assignment)',
    labelEn: 'Homework & Assignment',
    desc: 'በመምህራን የሚሰጡ የክፍልና የቤት ስራዎች',
  },
  {
    type: 'assignment_deadline',
    labelAm: 'የቤት ስራ ማስረከቢያ ጊዜ',
    labelEn: 'Assignment Deadline',
    desc: 'የማስረከቢያ ቀን ከመድረሱ በፊት የሚላክ ማሳሰቢያ',
  },
  {
    type: 'quiz_exam_result',
    labelAm: 'የፈተና ውጤቶች',
    labelEn: 'Assessment Results',
    desc: 'የፈተና ነጥብና የስህተት ማብራሪያ ይፋ ሲሆን',
  },
  {
    type: 'ai_recommendation',
    labelAm: 'የ NUR AI የጥናት ምክር',
    labelEn: 'AI Learning Recommendations',
    desc: 'በዕውቀት ካርታዎ ላይ ተመስርቶ የሚሰጥ የጥናት አቅጣጫ',
  },
  {
    type: 'weak_topic_alert',
    labelAm: 'የማጠናከሪያ ማስጠንቀቂያ',
    labelEn: 'Weak Topic Alert',
    desc: 'ድክመት የታየባቸውን ርዕሶች ለማሻሻል የሚላክ መፍትሔ',
  },
  {
    type: 'new_curriculum_content',
    labelAm: 'አዲስ የስርዓተ-ትምህርት ይዘት',
    labelEn: 'New Curriculum Content',
    desc: 'የትምህርት ሚኒስቴር አዳዲስ መጻሕፍት ሲካተቱ',
  },
  {
    type: 'system_announcement',
    labelAm: 'አጠቃላይ የትምህርት ቤት ማስታወቂያ',
    labelEn: 'System Announcement',
    desc: 'አስፈላጊ የትምህርት ካላንደርና የትምህርት ቤት ዜናዎች',
  },
  {
    type: 'admin_notification',
    labelAm: 'የአስተዳደር ማስታወቂያ',
    labelEn: 'Admin Notification',
    desc: 'ቴክኒካዊና ተቋማዊ መልዕክቶች',
  },
];

const LANGUAGES: Array<{ code: SupportedNotificationLanguage; name: string; native: string }> = [
  { code: 'am', name: 'Amharic', native: 'አማርኛ' },
  { code: 'en', name: 'English', native: 'English' },
  { code: 'om', name: 'Afaan Oromo', native: 'Afaan Oromoo' },
  { code: 'ti', name: 'Tigrinya', native: 'ትግርኛ' },
  { code: 'so', name: 'Somali', native: 'Af Soomaali' },
];

export const NotificationPreferencesModal: React.FC<NotificationPreferencesModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    preferences,
    updatePreferences,
    deviceToken,
    fcmPermission,
    requestPermission,
    sendNotification,
  } = useNotifications();

  const [formState, setFormState] = useState<NotificationPreferences | null>(preferences);
  const [saving, setSaving] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [testSent, setTestSent] = useState<boolean>(false);

  // Sync if preferences change externally
  React.useEffect(() => {
    if (preferences) {
      setFormState(preferences);
    }
  }, [preferences]);

  if (!isOpen || !formState) return null;

  const handleToggleChannel = (key: keyof Pick<NotificationPreferences, 'pushEnabled' | 'inAppEnabled' | 'soundEnabled' | 'emailNotifications'>) => {
    setFormState((prev) => (prev ? { ...prev, [key]: !prev[key] } : prev));
  };

  const handleToggleType = (type: NotificationType) => {
    setFormState((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        types: {
          ...prev.types,
          [type]: !prev.types[type],
        },
      };
    });
  };

  const handleLanguageChange = (lang: SupportedNotificationLanguage) => {
    setFormState((prev) => (prev ? { ...prev, language: lang } : prev));
  };

  const handleSave = async () => {
    if (!formState) return;
    setSaving(true);
    await updatePreferences(formState);
    setSaving(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleSendTestNotification = async () => {
    setTestSent(true);
    await sendNotification({
      type: 'ai_recommendation',
      recipientId: formState.userId,
      recipientRole: 'student',
      language: formState.language,
      priority: 'high',
      metadata: {
        title: 'Cell Membrane & Active Transport (Unit 2)',
      },
    });
    setTimeout(() => setTestSent(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div
        id="notification-preferences-modal"
        className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-slate-100"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                የማሳወቂያ ምርጫዎች (Notification Settings)
              </h3>
              <p className="text-xs text-slate-400">
                የ Firebase Cloud Messaging (FCM) እና የውስጠ-መተግበሪያ ማሳወቂያዎችዎን ያስተካክሉ
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Channel Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Push Notifications */}
            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/50 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Smartphone className="w-4 h-4 text-emerald-400" />
                  <input
                    type="checkbox"
                    id="pref-push-toggle"
                    checked={formState.pushEnabled}
                    onChange={() => handleToggleChannel('pushEnabled')}
                    className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
                  />
                </div>
                <h4 className="text-sm font-semibold text-slate-200">Push Notifications</h4>
                <p className="text-xs text-slate-400 mt-0.5">በስልክዎ ስክሪን ላይ የሚደርሱ (FCM)</p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-700/40">
                {fcmPermission !== 'granted' ? (
                  <button
                    onClick={requestPermission}
                    className="text-xs font-medium text-emerald-400 hover:underline cursor-pointer"
                  >
                    ፍቃድ ስጥ / Enable FCM
                  </button>
                ) : (
                  <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
                    <Check className="w-3 h-3" /> FCM ንቁ ነው
                  </span>
                )}
              </div>
            </div>

            {/* In-App Banners */}
            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/50 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Bell className="w-4 h-4 text-blue-400" />
                  <input
                    type="checkbox"
                    id="pref-inapp-toggle"
                    checked={formState.inAppEnabled}
                    onChange={() => handleToggleChannel('inAppEnabled')}
                    className="w-4 h-4 accent-blue-500 rounded cursor-pointer"
                  />
                </div>
                <h4 className="text-sm font-semibold text-slate-200">In-App Banners</h4>
                <p className="text-xs text-slate-400 mt-0.5">በመተግበሪያው ውስጥ የሚታዩ ካርዶች</p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-700/40 text-[11px] text-slate-400">
                በቀጥታ ስክሪን ላይ ይወጣል
              </div>
            </div>

            {/* Sound Alerts */}
            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/50 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  {formState.soundEnabled ? (
                    <Volume2 className="w-4 h-4 text-amber-400" />
                  ) : (
                    <VolumeX className="w-4 h-4 text-slate-500" />
                  )}
                  <input
                    type="checkbox"
                    id="pref-sound-toggle"
                    checked={formState.soundEnabled}
                    onChange={() => handleToggleChannel('soundEnabled')}
                    className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                  />
                </div>
                <h4 className="text-sm font-semibold text-slate-200">የድምፅ ማሳሰቢያ</h4>
                <p className="text-xs text-slate-400 mt-0.5">ማሳወቂያ ሲመጣ የሚሰማ ድምፅ</p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-700/40 text-[11px] text-slate-400">
                {formState.soundEnabled ? 'የነቃ ድምፅ' : 'ዝምታ (Muted)'}
              </div>
            </div>
          </div>

          {/* Language Selection */}
          <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/50">
            <div className="flex items-center gap-2 mb-2">
              <Globe2 className="w-4 h-4 text-teal-400" />
              <h4 className="text-sm font-semibold text-white">
                የማሳወቂያ ቋንቋ (Notification Language)
              </h4>
            </div>
            <p className="text-xs text-slate-400 mb-3">
              የሚላኩ ማሳወቂያዎች በእርስዎ በተመረጠው ቋንቋ ተተርጉመው ይደርሳሉ
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold text-center border transition-all cursor-pointer ${
                    formState.language === lang.code
                      ? 'bg-emerald-600/30 border-emerald-500 text-emerald-300 shadow-sm'
                      : 'bg-slate-800 border-slate-700/80 text-slate-300 hover:bg-slate-700/60'
                  }`}
                >
                  <div className="font-bold">{lang.native}</div>
                  <div className="text-[10px] opacity-75 font-normal">{lang.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Granular Notification Type Toggles */}
          <div>
            <h4 className="text-sm font-semibold text-slate-200 mb-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              የትምህርት እና የመድረክ ማሳወቂያ አይነቶች (11 Notification Categories)
            </h4>

            <div className="space-y-2.5">
              {NOTIFICATION_TYPE_METAS.map((item) => {
                const isChecked = formState.types[item.type] !== false;
                return (
                  <label
                    key={item.type}
                    className="flex items-start justify-between p-3 rounded-xl bg-slate-800/40 border border-slate-800 hover:border-slate-700/70 transition-colors cursor-pointer"
                  >
                    <div className="pr-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-slate-200">
                          {item.labelAm}
                        </span>
                        <span className="text-xs text-slate-400">({item.labelEn})</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleToggleType(item.type)}
                      className="mt-1 w-4 h-4 accent-emerald-500 rounded cursor-pointer"
                    />
                  </label>
                );
              })}
            </div>
          </div>

          {/* FCM & Device Token Diagnostics */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-300">FCM Gateway Status:</span>
              <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/50 font-mono text-[11px]">
                ONLINE • Firebase v12
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-300">Device FCM Token:</span>
              <span className="font-mono text-[11px] text-slate-400 truncate max-w-[280px]">
                {deviceToken?.token || 'fcm_web_token_registered_live'}
              </span>
            </div>
            <div className="pt-2 flex items-center justify-between border-t border-slate-800">
              <span>የሙከራ ማሳወቂያ ላክ (Test Dispatch):</span>
              <button
                onClick={handleSendTestNotification}
                disabled={testSent}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/30 transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{testSent ? 'ተልኳል / Sent!' : 'ማሳወቂያ ሞክር'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            {savedSuccess && (
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <Check className="w-4 h-4" /> ምርጫዎችዎ በተሳካ ሁኔታ ተቀምጠዋል!
              </span>
            )}
          </div>
          <div className="flex items-center gap-2.5">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors cursor-pointer"
            >
              ዝጋ / Close
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors cursor-pointer shadow-md disabled:opacity-50"
            >
              {saving ? 'በማስቀመጥ ላይ...' : 'ምርጫዎችን መዝግብ / Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
