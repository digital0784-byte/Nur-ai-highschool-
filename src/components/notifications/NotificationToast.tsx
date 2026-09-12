import React, { useEffect, useState } from 'react';
import {
  Bell,
  X,
  ArrowRight,
  BookOpen,
  HelpCircle,
  Award,
  AlertTriangle,
  Sparkles,
  Megaphone,
  CheckCircle2,
} from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';
import { NotificationType } from '../../types/notifications';

export const NotificationToast: React.FC = () => {
  const { activeToast, dismissToast, triggerDeepLink } = useNotifications();
  const [progress, setProgress] = useState<number>(100);

  useEffect(() => {
    if (!activeToast) {
      setProgress(100);
      return;
    }

    const duration = 6000;
    const interval = 50;
    const step = (interval / duration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          dismissToast();
          return 0;
        }
        return prev - step;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [activeToast, dismissToast]);

  if (!activeToast) return null;

  const getTypeIcon = (type: NotificationType) => {
    switch (type) {
      case 'new_lesson':
      case 'new_curriculum_content':
        return <BookOpen className="w-5 h-5 text-emerald-400" />;
      case 'new_quiz':
      case 'assignment':
        return <HelpCircle className="w-5 h-5 text-blue-400" />;
      case 'new_exam':
      case 'quiz_exam_result':
        return <Award className="w-5 h-5 text-amber-400" />;
      case 'ai_recommendation':
        return <Sparkles className="w-5 h-5 text-purple-400" />;
      case 'weak_topic_alert':
        return <AlertTriangle className="w-5 h-5 text-rose-400" />;
      case 'system_announcement':
      case 'admin_notification':
      default:
        return <Megaphone className="w-5 h-5 text-teal-400" />;
    }
  };

  const getTypeBadge = (type: NotificationType) => {
    switch (type) {
      case 'new_lesson':
        return 'አዲስ ትምህርት / Lesson';
      case 'new_quiz':
        return 'ፈተና / Quiz';
      case 'new_exam':
        return 'ዋና ፈተና / Exam';
      case 'assignment':
        return 'የቤት ስራ / Assignment';
      case 'ai_recommendation':
        return 'NUR AI ጥቆማ / Recommendation';
      case 'weak_topic_alert':
        return 'ማጠናከሪያ / Remedial';
      case 'system_announcement':
      default:
        return 'ማስታወቂያ / Alert';
    }
  };

  return (
    <div
      id="notification-toast-card"
      className="fixed top-5 right-5 z-50 max-w-md w-full bg-slate-900/95 border border-emerald-500/40 text-slate-100 rounded-2xl shadow-2xl backdrop-blur-md overflow-hidden transition-all duration-300 animate-in fade-in slide-in-from-top-4"
      role="alert"
    >
      <div className="p-4 flex items-start gap-3.5">
        <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 shrink-0">
          {getTypeIcon(activeToast.type)}
        </div>

        <div className="flex-1 min-w-0 pr-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800/40">
              {getTypeBadge(activeToast.type)}
            </span>
            {activeToast.priority === 'urgent' && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40">
                አስቸኳይ / URGENT
              </span>
            )}
          </div>

          <h4 className="text-sm font-semibold text-white truncate leading-snug">
            {activeToast.title}
          </h4>

          <p className="text-xs text-slate-300 mt-1 line-clamp-2 leading-relaxed">
            {activeToast.body}
          </p>

          <div className="mt-3 flex items-center gap-2">
            <button
              id="toast-open-btn"
              onClick={() => triggerDeepLink(activeToast.deepLink, activeToast.id)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors cursor-pointer shadow-sm"
            >
              <span>ክፈት / Open</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              id="toast-dismiss-btn"
              onClick={dismissToast}
              className="px-2.5 py-1.5 rounded-lg text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
            >
              አልፈው / Dismiss
            </button>
          </div>
        </div>

        <button
          onClick={dismissToast}
          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Auto-dismiss countdown bar */}
      <div className="w-full bg-slate-800 h-1">
        <div
          className="bg-emerald-500 h-full transition-all duration-75 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};
